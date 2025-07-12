import { LuciformDocument, ActionNode } from '../../luciform-types/src/base.js';
export declare function executeLuciform(document: LuciformDocument, logRitual: (message: string, logFileName?: string) => Promise<void>, getAIHelp: (rawContent: string, reason: string) => Promise<ActionNode>, logFileName?: string): Promise<void>;
