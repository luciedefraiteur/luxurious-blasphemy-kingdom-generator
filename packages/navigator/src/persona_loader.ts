import * as fs from 'fs';
import * as path from 'path';

export interface Persona {
  name: string;
  description: string;
  job?: { prompt: string };
  llm_model?: any;
}

export function loadPersonas(personasPath: string): Persona[] {
  const personas: Persona[] = [];
  const files = fs.readdirSync(personasPath);

  for (const file of files) {
    if (file.endsWith('.personae')) {
      const filePath = path.join(personasPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      try {
        const persona: Persona = JSON.parse(content);
        personas.push(persona);
      } catch (e) {
        console.error(`Error parsing persona file ${filePath}: ${e}`);
      }
    }
  }
  return personas;
}
