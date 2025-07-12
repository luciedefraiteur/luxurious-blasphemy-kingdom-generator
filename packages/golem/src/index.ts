import * as fs from 'fs/promises';

async function refactor() {
    const filePath = './execute_luciform.ts';
    let content = await fs.readFile(filePath, 'utf-8');

    const parseLuciformRegex = /async function parseLuciform\(filePath: string\): Promise<Operation\[\]> {([\s\S]*?)}\n/g;
    const match = parseLuciformRegex.exec(content);

    if (!match) {
        console.error('Could not find parseLuciform function');
        return;
    }

    const parseLuciformBody = match[1];
    const newFunctionName = 'parseLinesToOperations';
    const newFunction = `async function ${newFunctionName}(lines: string[]): Promise<Operation[]> {${parseLuciformBody}}`;

    const newParseLuciform = `async function parseLuciform(filePath: string): Promise<Operation[]> {\n    const content = await fs.readFile(filePath, 'utf-8');\n    const lines = content.replace(/\r\n/g, '\n').split('\n');\n    return ${newFunctionName}(lines);\n}`;

    content = content.replace(parseLuciformRegex, newParseLuciform);
    content = content.replace(`type ParserState`, newFunction + `\n\ntype ParserState`);

    await fs.writeFile(filePath, content, 'utf-8');
}

refactor();
