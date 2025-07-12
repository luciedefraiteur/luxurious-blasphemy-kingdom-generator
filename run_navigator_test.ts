const { codexLurkuitaeNavigator } = await import('./dist/src/codex_lurkuitae_navigator.js');
import * as fs from 'fs/promises';
import * as path from 'path';

async function runTestRitual() {
  const luciformPath = path.join(__dirname, 'luciforms', 'test_ritual', 'test_ritual.luciform');
  const luciformContent = await fs.readFile(luciformPath, 'utf-8');

  // Minimal RitualContext for testing
  const context: any = {
    conduit: {},
    kardiaSphere: {},
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
    personality: 'test_navigator',
    lifeSystem: {},
  };

  // Simple logging function
  const logRitual = async (message: string, logFileName?: string) => {
    const logPath = path.join(process.cwd(), logFileName || 'test_ritual.log');
    await fs.appendFile(logPath, `[${new Date().toISOString()}] ${message}\n`);
    console.log(message);
  };

  try {
    console.log(`Running test ritual from: ${luciformPath}`);
    await codexLurkuitaeNavigator(luciformContent, context, logRitual, 'test_ritual.log');
    console.log("Test ritual completed successfully.");
  } catch (error) {
    console.error("Test ritual failed:", error);
  }
}

runTestRitual();
