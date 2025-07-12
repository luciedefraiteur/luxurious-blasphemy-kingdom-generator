import * as fs from 'fs/promises';
import { applyOperation } from './batch_editor'; // This will be moved to luciform-executor later
import { queryLlm, applyLlmOperation } from './llm_oracle';
import { Operation } from '@lucie/luciform-types';
import * as readline from 'readline';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query: string): Promise<string>
{
    return new Promise(resolve => rl.question(query, ans =>
    {
        resolve(ans);
    }))
}

type ParserState = 'idle' | 'in_search' | 'in_replace' | 'in_insert' | 'in_append' | 'in_create';

async function parseLuciform(filePath: string, args: string[], variables: Map<string, string>): Promise<Operation[]>
{
    const content = await fs.readFile(filePath, 'utf-8');

    // Try parsing as JSON first
    try
    {
        const json = JSON.parse(content);
        if(json.incantations && Array.isArray(json.incantations))
        {
            const operations: Operation[] = [];
            for(const incantation of json.incantations)
            {
                if(incantation.type === 'EXECUTE' && incantation.parameters && incantation.parameters.command)
                {
                    operations.push({type: 'shell_command', command: incantation.parameters.command});
                } else if(incantation.type === 'APPLY_EDITS' && incantation.parameters && Array.isArray(incantation.parameters.edits))
                {
                    for(const edit of incantation.parameters.edits)
                    {
                        if(edit.type === 'create' && edit.filePath && edit.newContent)
                        {
                            operations.push({type: 'create_file', filePath: edit.filePath, content: edit.newContent});
                        }
                        // Add other edit types here as needed
                    }
                }
            }
            return operations;
        }
    } catch(e)
    {
        // Not a JSON file, or not in the expected format, so fall back to legacy parser
    }

    // Legacy parser
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const operations: Operation[] = [];
    let state: ParserState = 'idle';
    let currentFilePath: string | undefined;
    let searchContent = '';
    let newContent = '';
    let lineNumber: number | undefined;
    let startLine: number | undefined;
    let endLine: number | undefined;
    let currentSearchStartLine: number | undefined;

    for(const line of lines)
    {
        let processedLine = line;

        // Replace arguments ($1, $2, ...)
        for(let i = 0; i < args.length; i++)
        {
            processedLine = processedLine.replace(new RegExp(`\${ i + 1 }`, 'g'), args[i]);
        }
        processedLine = processedLine.replace(/\s*\$\d+/g, ''); // Remove any unmatched argument placeholders

        // Replace variables ($myVar)
        for (const [key, value] of variables.entries()) {
            processedLine = processedLine.replace(new RegExp(`\${key}`, 'g'), value);
        }

        if(processedLine.startsWith('---'))
        {
            continue;
        }

        if(processedLine.startsWith('§F:'))
        {
            currentFilePath = processedLine.substring(3).trim();
        } else if(processedLine.startsWith('§X:'))
        {
            operations.push({type: 'shell_command', command: processedLine.substring(3).trim()});
        } else if(processedLine.startsWith('§Q:'))
        {
            const parts = processedLine.substring(3).trim().split(':');
            if (parts.length >= 2) {
                const varName = parts[0];
                const question = parts.slice(1).join(':').trim();
                const answer = await askQuestion(question + ' ');
                variables.set(varName, answer);
                console.log(`Réponse de l'utilisateur pour ${varName}: ${answer}`);
            } else {
                console.warn(`Warning: Malformed interactive question (§Q:) in luciform: ${processedLine}. Expected format: §Q:varName:Question text`);
                const question = processedLine.substring(3).trim();
                await askQuestion(question + ' '); // Still ask, but don't store
            }
        } else if(processedLine.startsWith('§L:'))
        {
            const parts = processedLine.substring(3).trim().split(':');
            if (parts.length >= 3) {
                const variableName = parts[0];
                const model = parts[1];
                const prompt = parts.slice(2).join(':').trim();
                operations.push({ type: 'llm_operation', variableName, model, prompt });
            } else {
                console.warn(`Warning: Malformed LLM operation (§L:) in luciform: ${processedLine}. Expected format: §L:variableName:model:prompt`);
            }
        } else if(line.startsWith('<<<<<<< §S'))
        {
            state = 'in_search';
            searchContent = '';
            const lineNumberMatch = line.match(/:line:(\d+)/);
            if(lineNumberMatch)
            {
                currentSearchStartLine = parseInt(lineNumberMatch[1], 10);
            }
        } else if(line.startsWith('======= §R') && state === 'in_search')
        {
            searchContent = searchContent.replace(/\n/g, '\n').replace(/\n$/, '');
            state = 'in_replace';
            newContent = '';
        } else if(line.startsWith('>>>>>>> §R') && state === 'in_replace')
        {
            if(currentFilePath)
            {
                operations.push({
                    type: 'search_and_replace',
                    filePath: currentFilePath,
                    startLine: currentSearchStartLine || 0,
                    search: searchContent,
                    replace: newContent.replace(/\n/g, '\n').replace(/\n$/, '')
                });
            }
            state = 'idle';
        } else if(line.startsWith('<<<<<<< §I'))
        {
            state = 'in_insert';
            const lineNumberMatch = line.match(/:line:(\d+)/);
            if(lineNumberMatch)
            {
                lineNumber = parseInt(lineNumberMatch[1], 10);
            }
            newContent = '';
        } else if(line.startsWith('>>>>>>> §I') && state === 'in_insert')
        {
            if(currentFilePath && lineNumber)
            {
                operations.push({type: "insert", filePath: currentFilePath, lineNumber: lineNumber!, newContent: newContent.replace(/\n/g, '\n').replace(/\n$/, '')});
            }
            state = 'idle';
        } else if(line.startsWith('<<<<<<< §D'))
        {
            const lineRangeMatch = line.match(/:lines:(\d+)-(\d+)/);
            if(lineRangeMatch && currentFilePath)
            {
                startLine = parseInt(lineRangeMatch[1], 10);
                endLine = parseInt(lineRangeMatch[2], 10);
                operations.push({type: 'delete', filePath: currentFilePath, startLine, endLine});
            }
        } else if(line.startsWith('<<<<<<< §A'))
        {
            state = 'in_append';
            newContent = '';
        } else if(line.startsWith('>>>>>>> §A') && state === 'in_append')
        {
            if(currentFilePath)
            {
                operations.push({type: 'append', filePath: currentFilePath, newContent: newContent.replace(/\n/g, '\n').replace(/\n$/, '')});
            }
            state = 'idle';
        } else if(line.startsWith('<<<<<<< §C'))
        {
            state = 'in_create';
            newContent = '';
        } else if(line.startsWith('>>>>>>> §C') && state === 'in_create')
        {
            if(currentFilePath)
            {
                operations.push({type: 'create_file', filePath: currentFilePath, content: newContent.replace(/\n/g, '\n').replace(/\n$/, '')});
            }
            state = 'idle';
        } else
        {
            if(state === 'in_search')
            {
                searchContent += line + '\n';
            } else if(state === 'in_replace' || state === 'in_insert' || state === 'in_append' || state === 'in_create')
            {
                newContent += line + '\n';
            }
        }
    }

    return operations;
}

async function main()
{
    const cliArgs = process.argv.slice(2);
    const luciformPath = cliArgs.find(arg => !arg.startsWith('--'));
    const dryRun = cliArgs.includes('--dry-run');
    const ritualArgs = cliArgs.filter(arg => arg !== luciformPath && !arg.startsWith('--'));
    const interactiveVariables = new Map<string, string>();

    if(!luciformPath)
    {
        console.error('Usage: npm run ritual [--dry-run] <path_to_luciform_file> [args...]');
        process.exit(1);
    }

    try
    {
        const operations = await parseLuciform(luciformPath, ritualArgs, interactiveVariables);

        for(const op of operations)
        {
            try
            {
                if(dryRun)
                {
                    const dryRunOutput = `[DRY RUN] Operation: ${ 'type' in op ? op.type.toUpperCase() : 'UNKNOWN' }
  File: ${ 'filePath' in op ? op.filePath : 'N/A' }
${ 'search' in op ? `  Search: 
---
${ op.search }
---` : '' }${ 'replace' in op ? `  Replace: 
---
${ op.replace }
---` : '' }${ 'newContent' in op ? `  Content: 
---
${ op.newContent }
---` : '' }${ 'command' in op ? `  Command: ${ op.command }` : '' }${ 'lineNumber' in op ? `  Line: ${ op.lineNumber }` : '' }${ 'startLine' in op && 'endLine' in op ? `  Lines: ${ op.startLine }-${ op.endLine }` : '' }
----------------------------------------
`;
                    await fs.appendFile('luciform_dry_run_temp_output.log', dryRunOutput, 'utf-8');
                } else
                {
                    await applyOperation(op, dryRun);
                }
            } catch(opError)
            {
                console.error(`Error applying operation ${ JSON.stringify(op) }: ${ opError }`);
                // Decide whether to re-throw or continue
                throw opError; // Re-throw to stop execution on first error
            }
        }
    } catch(error)
    {
        console.error(`Error processing batch operations: ${ error }`);
        rl.close(); // Close readline on error before exiting
        process.exit(1);
    } finally
    {
        rl.close(); // Ensure it's closed even if an error occurs before the loop finishes
    }
}

main();
