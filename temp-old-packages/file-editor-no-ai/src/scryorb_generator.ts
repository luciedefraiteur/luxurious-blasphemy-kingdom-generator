import * as fs from 'fs/promises';
import * as path from 'path';

interface ScryOrbError {
  filePath: string;
  lineNumber: number;
  columnNumber?: number;
  errorMessage: string;
  codeContext?: string; // Surrounding lines of code
  fullFileContent?: string; // The entire content of the file (optional, for deeper context)
}

interface ScryOrb {
  timestamp: string;
  source: string; // e.g., 'tsc', 'eslint', 'build'
  errors: ScryOrbError[];
}

export async function generateScryOrb(errorOutput: string, source: string = 'build') {
  const errors: ScryOrbError[] = [];

  // Basic regex to parse TypeScript errors (e.g., "file.ts(line,col): error TSxxxx: message")
  const tsErrorRegex = /(.*?)\((\d+),(\d+)\): error (TS\d+): (.*)/g;
  let match;

  while ((match = tsErrorRegex.exec(errorOutput)) !== null) {
    const [, filePath, lineNumberStr, columnNumberStr, errorCode, errorMessage] = match;
    const lineNumber = parseInt(lineNumberStr);
    const columnNumber = parseInt(columnNumberStr);

    let codeContext: string | undefined;
    let fullFileContent: string | undefined;

    try {
      fullFileContent = await fs.readFile(filePath.trim(), 'utf-8');
      const lines = fullFileContent.split(/\r?\n/);
      const startLine = Math.max(0, lineNumber - 6); // 5 lines before + 1 for 0-indexing
      const endLine = Math.min(lines.length, lineNumber + 5); // 5 lines after
      codeContext = lines.slice(startLine, endLine).join('\n');

    } catch (fileError: any) {
      console.error(`ScryOrb Generator: Could not read file ${filePath}: ${fileError.message}`);
      codeContext = `Could not read file: ${fileError.message}`;
    }

    errors.push({
      filePath: filePath.trim(),
      lineNumber: lineNumber,
      columnNumber: columnNumber,
      errorMessage: `${errorCode}: ${errorMessage.trim()}`,
      codeContext: codeContext,
      fullFileContent: fullFileContent, // Include full content for now
    });
  }

  const scryOrb: ScryOrb = {
    timestamp: new Date().toISOString(),
    source: source,
    errors: errors,
  };

  const outputFileName = `build_error_${Date.now()}.scryOrb`;
  const outputPath = path.join(process.cwd(), outputFileName); // Save in current working directory for now

  await fs.writeFile(outputPath, JSON.stringify(scryOrb, null, 2), 'utf-8');
  console.log(`ScryOrb generated: ${outputPath}`);
}

// Read from stdin if piped, otherwise expect argument
export async function main() {
  let input = '';
  if (process.stdin.isTTY) {
    // Not piped, expect argument
    input = process.argv[2];
  } else {
    // Piped input
    for await (const chunk of process.stdin) {
      input += chunk;
    }
  }

  if (!input) {
    console.error("No error output provided to scryorb_generator.");
    process.exit(1);
  }

  await generateScryOrb(input);
}