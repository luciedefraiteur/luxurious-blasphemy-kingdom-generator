import { applyOperation, CreateFile, Operation, ShellCommand } from 'luciform-core';
import * as path from 'path';
import * as fs from 'fs/promises';

async function runTest() {
    const filePath = path.resolve('./test_batch_editor_output.txt');
    const content = 'This file was created by test_batch_editor.ts';

    const operation: CreateFile = { // Explicitly type the operation
        type: 'create_file',
        filePath: filePath,
        content: content
    };

    try {
        console.log(`Attempting to create file: ${filePath}`);
        await applyOperation(operation, false);
        console.log(`Successfully created file: ${filePath}`);
    } catch (error) {
        console.error(`Error in test_batch_editor.ts: ${error}`);
    }
}

runTest();