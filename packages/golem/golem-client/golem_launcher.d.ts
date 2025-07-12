import * as LLM from './llm_interface.js';
export declare function launchGolem(persona: Persona, testInputs?: string[], model?: LLM.LLMModel, isInteractive?: boolean, clientCommands?: string[]): Promise<void>;
