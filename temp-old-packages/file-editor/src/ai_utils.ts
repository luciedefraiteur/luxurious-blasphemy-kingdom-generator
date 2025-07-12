import { spawn } from 'child_process';
import * as os from 'os';
import * as fs from 'fs/promises';
import * as path from 'path';

// --- Copied LLMModel from core_types.ts ---
export enum LLMModel {
  Mistral = 'mistral',
  Claude = 'claude',
  GPT4 = 'gpt-4',
  GPT3_5_Turbo = 'gpt-3.5-turbo',
  GeminiPro = 'gemini-pro',
  CodeLlama = "codellama:7b-instruct",
  CodeLlamaCode = "codellama:7b-code",
  Llama3 = "llama3",
  OpenAI = "openai",
  Gemini = "gemini",
  Random = "random"
}

// --- Copied LLMInterface from llm_interface.ts (simplified) ---
function escapeJson(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function extractBetweenMarkers(input: string): string {
  const match = input.match(/```(?:json)?[\s\S]*?```/);
  return match ? match[1] : input;
}

export class LLMInterface {
  private static cache: Map<string, string> = new Map();

  static async query(prompt: string, model: LLMModel = LLMModel.Mistral, _fetch: typeof fetch = fetch): Promise<string> {
    const cacheKey = `${ model }-${ prompt }`;
    if (LLMInterface.cache.has(cacheKey)) {
      return LLMInterface.cache.get(cacheKey)!;
    }

    let actualModel = model;

    if (model === LLMModel.Random) {
      let availableModels = Object.values(LLMModel).filter(m => m !== LLMModel.Random);
      const hasOpenAI = process.env.OPENAI_API_KEY;
      if (!hasOpenAI) {
        availableModels = availableModels.filter(m => m !== LLMModel.OpenAI);
      }
      actualModel = availableModels[Math.floor(Math.random() * availableModels.length)];
    }

    if (actualModel === LLMModel.OpenAI) {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        throw new Error("OPENAI_API_KEY environment variable is not set.");
      }

      try {
        const response = await _fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ openaiApiKey }`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{role: "user", content: prompt}],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI API Error ${ response.status }: ${ errorText }`);
        }

        const json = await response.json() as any;
        const fullResponse = json.choices[0]?.message?.content ?? '';

        if (!fullResponse) {
          throw new Error("OpenAI API: Empty response after parsing.");
        }
        LLMInterface.cache.set(cacheKey, fullResponse);
        return extractBetweenMarkers(fullResponse);
      } catch (err: any) {
        console.error("OpenAI FETCH Error:", err);
        throw new Error(`[OpenAI Error: ${ err.message }]`);
      }
    } else if (actualModel === LLMModel.Gemini) {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set.");
      }

      try {
        const response = await _fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${ geminiApiKey }`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{parts: [{text: prompt}]}],
            generationConfig: {
              temperature: 0.7,
            }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Gemini API Error ${ response.status }: ${ errorText }`);
        }

        const json = await response.json() as any;
        const fullResponse = json.candidates[0]?.content?.parts[0]?.text ?? '';

        if (!fullResponse) {
          throw new Error("Gemini API: Empty response after parsing.");
        }
        LLMInterface.cache.set(cacheKey, fullResponse);
        return extractBetweenMarkers(fullResponse);
      } catch (err: any) {
        console.error("Gemini FETCH Error:", err);
        throw new Error(`[Gemini Error: ${ err.message }]`);
      }
    } else if (actualModel === LLMModel.Claude) {
      const apiKey = process.env.CLAUDE_API_KEY;
      if (!apiKey) {
        throw new Error('La clé API Claude (CLAUDE_API_KEY) n\'est pas définie dans le fichier .env');
      }
      try {
        const response = await _fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 4096,
            messages: [
              {role: "user", content: prompt}
            ]
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Erreur de l'API Claude: ${ response.status } ${ response.statusText } - ${ errorBody }`);
        }

        const data = await response.json() as any;
        const fullResponse = data.content[0].text;
        LLMInterface.cache.set(cacheKey, fullResponse);
        return fullResponse;
      } catch (err: any) {
        console.error("[Erreur Claude Interface]", err);
        throw new Error(`[Claude Error: ${ err.message }]`);
      }
    }
    else if (actualModel === LLMModel.CodeLlama || actualModel === LLMModel.CodeLlamaCode || actualModel === LLMModel.Llama3 || actualModel === LLMModel.Mistral) {
      const isWindows = os.platform() === 'win32';
      const cleanPrompt = escapeJson(prompt);

      if (isWindows) {
        try {
          const body = {
            model: actualModel,
            prompt: cleanPrompt,
            stream: false
          };

          console.log(`[LLMInterface] Envoi de la requête à Ollama pour le modèle ${ actualModel }...`);
          const response = await _fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama HTTP ${ response.status } : ${ errorText }`);
          }

          const json = await response.json() as {response?: string};
          const fullResponse = json.response ?? '';

          if (!fullResponse) {
            throw new Error("Ollama: Empty response after parsing");
          }

          console.log("fullResponse:", fullResponse);
          return extractBetweenMarkers(fullResponse);
        } catch (err: any) {
          console.error("Ollama FETCH Error :", err);
          throw new Error(`[Ollama Error: ${ err.message }]`);
        }

      } else {
        return new Promise((resolve, reject) => {
          const child = spawn('llm', ['--no-stream', '--model', actualModel], {
            stdio: ['pipe', 'pipe', 'pipe']
          });

          let stdout = '';
          let stderr = '';

          const timeout = setTimeout(() => {
            child.kill('SIGKILL');
            reject('[Timeout LLM : aucune réponse après 30 secondes]');
          }, 30000);

          child.stdout.on('data', (data) => {
            stdout += data.toString();
          });

          child.stderr.on('data', (data) => {
            stderr += data.toString();
          });

          child.on('error', (err) => {
            clearTimeout(timeout);
            reject(`[Erreur LLM: ${ err.message }]`);
          });

          child.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
              reject(`[LLM terminé avec code ${ code }] ${ stderr }`);
            } else {
              const result = stdout.trim();
              resolve(extractBetweenMarkers(result));
            }
          });

          child.stdin.write(prompt + '\n');
          child.stdin.end();
        });
      }
    } else {
      throw new Error(`Unsupported LLM model: ${ actualModel }`);
    }
  }
}

// --- Copied Persona interface (simplified) ---
export interface Persona {
  name: string;
  description: string;
  job?: { type: string; prompt: string; }; // Job can be an object with a prompt
  llm_model?: LLMModel;
}

// --- Copied RitualContext (minimal for this tool) ---
export interface RitualContext {
  outcome_history: string[];
  step_results_history: any[];
  current_sanctum: string;
  operatingSystem: string;
  conduit?: any; // Made optional for minimal context
  kardiaSphere?: any; // Made optional for minimal context
  scroll?: any; // Added scroll
  maxScrollLength?: any; // Added maxScrollLength
  incantation_history?: any; // Added incantation_history
  narrativeWeaving?: any; // Added narrativeWeaving
  activeReflection?: any; // Added activeReflection
  user_preferences?: any; // Added user_preferences
  chantModeEnabled?: any; // Added chantModeEnabled
  currentSanctumContent?: any; // Added currentSanctumContent
  personality?: any; // Added personality
  lifeSystem?: any; // Added lifeSystem
}

// --- Simplified PersonaLoader ---
class PersonaLoader {
  private personas: Map<string, Persona> = new Map();
  private personasDirectory: string;

  constructor(baseDir: string) {
    this.personasDirectory = path.resolve(baseDir, 'personas');
    this.loadPersonas(); // Load on instantiation
  }

  async loadPersonas() {
    try {
      const entries = await fs.readdir(this.personasDirectory, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(this.personasDirectory, entry.name);
        if (entry.isFile() && entry.name.endsWith('.personae')) {
          const content = await fs.readFile(fullPath, 'utf-8');
          const persona: Persona = JSON.parse(content);
          this.personas.set(persona.name.toLowerCase(), persona);
        }
      }
    } catch (error) {
      console.error(`Error loading personas: ${error}`);
    }
  }

  getPersona(name: string): Persona | undefined {
    return this.personas.get(name.toLowerCase());
  }
}

const personaLoader = new PersonaLoader(process.cwd()); // Initialize with current working directory

// --- Adapted getPersonaResponse ---
export async function getPersonaResponse(personaName: string, message: string, context: RitualContext, llmModel: LLMModel = LLMModel.Mistral): Promise<string> {
  let persona: Persona | undefined = personaLoader.getPersona(personaName);

  if (!persona) {
    // For this standalone tool, we don't create new personas. Just return a default.
    console.warn(`Persona ${personaName} not found. Using default response.`);
    return `[System]: Persona ${personaName} not found.`;
  }

  if (persona.job && persona.job.prompt) {
    const jobPrompt = `${ persona.job.prompt }\n\nInput: "${ message }"`;
    return await LLMInterface.query(jobPrompt, persona.llm_model || llmModel);
  } else {
    const prompt = `${ persona.description }\n\nRephrase the following message in this persona's voice: "${ message }"`;
    return await LLMInterface.query(prompt, persona.llm_model || llmModel);
  }
}
