import * as fs from 'fs/promises';
import * as path from 'path';

// Define the types for our JSON edit schema
interface FileEditOperation {
  type: 'insert' | 'replace' | 'delete' | 'create' | 'read_part';
  position?: number; // Character index for insert/delete
  length?: number;   // Length for delete/replace
  oldString?: string; // For replace
  newString?: string; // For insert/replace
  content?: string; // For insert and create
  start?: number; // For read_part
  end?: number;   // For read_part
}

interface FileEdits {
  filePath: string;
  edits: FileEditOperation[];
}

async function applyEdits(edits: FileEdits[]): Promise<any[]> {
  const results: any[] = [];

  for (const fileEdit of edits) {
    const absolutePath = path.resolve(process.cwd(), fileEdit.filePath);
    console.log(`Processing file: ${absolutePath}`);

    try {
      let content = '';
      let modifiedContent = '';

      // For operations that require reading existing content
      if (fileEdit.edits.some(op => op.type !== 'create')) {
        try {
          content = await fs.readFile(absolutePath, 'utf-8');
          modifiedContent = content;
        } catch (readError: any) {
          if (readError.code === 'ENOENT') {
            console.warn(`  File not found: ${absolutePath}. Skipping read-dependent operations.`);
            // Continue to next fileEdit if file doesn't exist for read-dependent ops
            continue;
          } else {
            throw readError;
          }
        }
      }

      for (const operation of fileEdit.edits) {
        switch (operation.type) {
          case 'create':
            if (operation.content !== undefined) {
              await fs.writeFile(absolutePath, operation.content, 'utf-8');
              console.log(`  Created file: ${absolutePath}.`);
            } else {
              console.warn(`  Skipping create operation for ${absolutePath}: missing content.`);
            }
            break;
          case 'insert':
            if (operation.position !== undefined && operation.content !== undefined) {
              modifiedContent = modifiedContent.slice(0, operation.position) + operation.content + modifiedContent.slice(operation.position);
              console.log(`  Inserted content at position ${operation.position}.`);
            } else {
              console.warn(`  Skipping insert operation for ${absolutePath}: missing position or content.`);
            }
            break;
          case 'replace':
            if (operation.oldString !== undefined && operation.newString !== undefined) {
              const originalLength = modifiedContent.length;
              modifiedContent = modifiedContent.replace(operation.oldString, operation.newString);
              if (modifiedContent.length === originalLength) {
                console.warn(`  Warning: Old string not found for replacement in ${absolutePath}.`);
              } else {
                console.log(`  Replaced "${operation.oldString.substring(0, 20)}..." with "${operation.newString.substring(0, 20)}...".`);
              }
            }
            else {
              console.warn(`  Skipping replace operation for ${absolutePath}: missing oldString or newString.`);
            }
            break;
          case 'delete':
            if (operation.position !== undefined && operation.length !== undefined) {
              modifiedContent = modifiedContent.slice(0, operation.position) + modifiedContent.slice(operation.position + operation.length);
              console.log(`  Deleted ${operation.length} characters from position ${operation.position}.`);
            } else {
              console.warn(`  Skipping delete operation for ${absolutePath}: missing position or length.`);
            }
            break;
          case 'read_part':
            if (operation.start !== undefined && operation.end !== undefined) {
              const part = content.substring(operation.start, operation.end);
              console.log(`  Read part from ${operation.start} to ${operation.end}: "${part.substring(0, 50)}...".`);
              results.push({
                type: 'read_part_result',
                filePath: fileEdit.filePath,
                start: operation.start,
                end: operation.end,
                content: part
              });
            } else {
              console.warn(`  Skipping read_part operation for ${absolutePath}: missing start or end.`);
            }
            break;
          default:
            console.warn(`  Unknown operation type: ${(operation as any).type} for ${absolutePath}.`);
        }
      }

      // Write back modified content if any modifications were made
      if (modifiedContent !== content) {
        await fs.writeFile(absolutePath, modifiedContent, 'utf-8');
        console.log(`Successfully applied all modifications to ${absolutePath}.`);
      }

    } catch (error: any) {
      console.error(`Error processing file ${absolutePath}: ${error.message}`);
    }
  }
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node file_editor_program.js <path_to_edits_json_file> [output_log_file]');
    process.exit(1);
  }

  const editsFilePath = path.resolve(process.cwd(), args[0]);
  const outputLogFile = args[1] ? path.resolve(process.cwd(), args[1]) : undefined;

  let capturedOutput = '';
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  // Redirect console output
  console.log = (...messages: any[]) => {
    const msg = messages.join(' ');
    originalLog(msg);
    capturedOutput += msg + '\n';
  };
  console.error = (...messages: any[]) => {
    const msg = messages.join(' ');
    originalError(msg);
    capturedOutput += `ERROR: ${msg}\n`;
  };
  console.warn = (...messages: any[]) => {
    const msg = messages.join(' ');
    originalWarn(msg);
    capturedOutput += `WARN: ${msg}\n`;
  };

  try {
    console.log(`Reading edits from: ${editsFilePath}`);
    const editsJson = await fs.readFile(editsFilePath, 'utf-8');
    const edits: FileEdits[] = JSON.parse(editsJson);
    const results = await applyEdits(edits);
    console.log('All specified file edits processed.');

    if (outputLogFile) {
      await fs.writeFile(outputLogFile, capturedOutput + JSON.stringify(results, null, 2), 'utf-8');
      originalLog(`Output and results written to: ${outputLogFile}`);
    }

  } catch (error: any) {
    console.error(`Failed to read or parse edits file ${editsFilePath}: ${error.message}`);
    if (outputLogFile) {
      await fs.writeFile(outputLogFile, capturedOutput + `ERROR: Failed to read or parse edits file ${editsFilePath}: ${error.message}\n`, 'utf-8');
    }
    process.exit(1);
  } finally {
    // Restore original console functions
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }
}

main();