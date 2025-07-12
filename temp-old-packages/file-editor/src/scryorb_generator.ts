import * as fs from 'fs/promises';
import * as path from 'path';
import { getPersonaResponse, LLMModel, RitualContext } from './ai_utils.js';

interface ScryOrbError {
  filePath: string;
  lineNumber: number;
  columnNumber?: number;
  errorMessage: string;
  codeContext?: string; // Surrounding lines of code
  fullFileContent?: string; // The entire content of the file (optional, for deeper context)
  aiAnalysis?: string;  // AI's interpretation, diagnosis, or suggested fix
}

interface ScryOrb {
  timestamp: string;
  source: string; // e.g., 'tsc', 'eslint', 'build'
  errors: ScryOrbError[];
}

async function generateScryOrb(errorOutput: string, source: string = 'build') {
  const errors: ScryOrbError[] = [];

  // Basic regex to parse TypeScript errors (e.g., "file.ts(line,col): error TSxxxx: message")
  const tsErrorRegex = /(.*?)\((\d+),(\d+)\): error (TS\d+): (.*)/g;
  let match;

  // Create a minimal RitualContext for persona interaction
  const minimalContext: RitualContext = {
    conduit: {} as any,
    kardiaSphere: {} as any,
    scroll: [],
    maxScrollLength: 10,
    incantation_history: [],
    outcome_history: [],
    step_results_history: [],
    narrativeWeaving: {},
    activeReflection: null,
    user_preferences: '',
    chantModeEnabled: false,
    current_sanctum: process.cwd(),
    currentSanctumContent: '',
    operatingSystem: process.platform,
    personality: 'scryorb_generator',
    lifeSystem: {},
  };

  while ((match = tsErrorRegex.exec(errorOutput)) !== null) {
    const [, filePath, lineNumberStr, columnNumberStr, errorCode, errorMessage] = match;
    const lineNumber = parseInt(lineNumberStr);
    const columnNumber = parseInt(columnNumberStr);

    let codeContext: string | undefined;
    let fullFileContent: string | undefined;
    let aiAnalysis: string | undefined;

    try {
      fullFileContent = await fs.readFile(filePath.trim(), 'utf-8');
      const lines = fullFileContent.split(/\r?\n/);
      const startLine = Math.max(0, lineNumber - 6); // 5 lines before + 1 for 0-indexing
      const endLine = Math.min(lines.length, lineNumber + 5); // 5 lines after
      codeContext = lines.slice(startLine, endLine).join('\n');

      // Invoke Syngraphe for AI analysis
      const syngraphePrompt = `You are Syngraphe, the scribe-démon du Damier. Analyze this build error and provide a concise diagnosis and suggested correction.\n\nFile: ${filePath}\nLine: ${lineNumber}\nError: ${errorMessage}\n\nCode Context:\n\`\`\`\n${codeContext}\n\`\`\`\n\nFull File Content (for broader context):\n\`\`\`\n${fullFileContent}\n\`\`\`\n\nDiagnosis and Correction:`;
      aiAnalysis = await getPersonaResponse('Syngraphe', syngraphePrompt, minimalContext);

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
      aiAnalysis: aiAnalysis,
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
async function main() {
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

main();