import * as fs from 'fs';
import { RitualContext, RitualPlan, Incantation } from '../../luciform-types/src/base.js';

import * as fsPromises from 'fs/promises';

async function writeLog(filename: string, content: string)
{
    const logEntry = `${ new Date().toISOString() }\n${ content }\n\n`;
    await fsPromises.appendFile(filename, logEntry);
    console.log(logEntry); // Also output to console
}

export async function logAlma(context: RitualContext, userIntent: string)
{
    const content = `
## JOURNAL D'ALMA - LE CŒUR DU SYSTÈME
- **Système Actif:** ${ context.personality }
- **Philosophie:** ${ context.lifeSystem?.philosophy || 'Philosophie par défaut' }
- **Intention Utilisateur:** ${ userIntent }
- **État Émotionnel:** ${ JSON.stringify(context.kardiaSphere, null, 2) }
- **Contexte Narratif:** ${ JSON.stringify(context.narrativeWeaving, null, 2) }
`;
    await writeLog('alma.log', content);
}

export async function logEli(context: RitualContext, poeticAnalysis: string, suggestedNextStep: string)
{
    const content = `
## PARCHEMIN D'ELI - L'INTERPRÈTE DES SONGES
- **Système Actif:** ${ context.personality }
- **Analyse Poétique:** ${ poeticAnalysis }
- **Suggestion d'Action Extraite:** ${ suggestedNextStep }
`;
    await writeLog('eli.log', content);
}

export async function logNova(context: RitualContext, naturalLanguagePlan: string, finalPlan: RitualPlan)
{
    const content = `
## REGISTRE DE NOVA - LE LOGICIEN
- **Système Actif:** ${ context.personality }
- **Plan Rêvé (Langage Naturel):** \n${ naturalLanguagePlan }
- **Plan Traduit (JSON):** \n${ JSON.stringify(finalPlan, null, 2) }
`;
    await writeLog('nova.log', content);
}

export async function logZed(context: RitualContext, failedStep: Incantation, remediationPlan: Incantation[])
{
    const content = `
## RAPPORT DE ZED - LE GUÉRISSEUR
- **Système Actif:** ${ context.personality }
- **Étape Échouée:** \n${ JSON.stringify(failedStep, null, 2) }
- **Plan de Remédiation Généré:** \n${ JSON.stringify(remediationPlan, null, 2) }
`;
    await writeLog('zed.log', content);
}

export async function logGolem(message: string, level: 'info' | 'error' = 'info')
{
    const content = `
## GOLEM SERVER LOG
- **Level:** ${ level.toUpperCase() }
- **Message:** ${ message }
`;
    await writeLog('golem.log', content);
}

export async function logGolemClient(message: string, level: 'info' | 'error' = 'info')
{
    const content = `
## GOLEM CLIENT LOG
- **Level:** ${ level.toUpperCase() }
- **Message:** ${ message }
`;
    await writeLog('golem_client.log', content);
}

export async function logPersonaAction(persona: string, command: string, ritual: string | null)
{
    const content = `
## ${ persona.toUpperCase() } ACTION
- **Command:** ${ command }
- **Generated Ritual:**
---
${ ritual || 'No ritual generated.' }
---
`;
    await writeLog(`${ persona }.log`, content);
}

export async function logRitual(message: string, logFileName: string = 'ritual.log') {
    await writeLog(logFileName, message);
}