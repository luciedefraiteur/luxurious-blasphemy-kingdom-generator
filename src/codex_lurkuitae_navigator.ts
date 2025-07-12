import { parseLuciformDocument } from '../packages/luciform-ai-parser/src/parser.js';
import { executeLuciform } from '../packages/luciform-executor/src/index.js';
import { getAIHelp } from '../packages/luciform-ai-interface/src/index.js';
import { LuciformDocument, RitualContext } from '../packages/luciform-types/src/base.js';
import { getPersonaResponse } from '../../luciform-core/dist/personas.js';

export async function codexLurkuitaeNavigator(
  luciformContent: string,
  context: RitualContext,
  logRitual: (message: string, logFileName?: string) => Promise<void>,
  logFileName?: string
): Promise<void> {
  console.log("CodexLurkuitaeNavigator: Starting intelligent parsing and execution.");

  let luciformDocument: LuciformDocument;

  try {
    luciformDocument = parseLuciformDocument(luciformContent, logRitual, logFileName);
    console.log("CodexLurkuitaeNavigator: Parsing complete. Starting execution.");
    await executeLuciform(luciformDocument, logRitual, getAIHelp, logFileName);
    console.log("CodexLurkuitaeNavigator: Execution complete.");
  } catch (error: any) {
    console.error("CodexLurkuitaeNavigator: Error during parsing or execution:", error);
    throw error; // Re-throw the error after logging
  }
}