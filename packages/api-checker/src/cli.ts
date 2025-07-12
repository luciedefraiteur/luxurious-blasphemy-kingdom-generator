#!/usr/bin/env node
// 🖥️ CLI pour tester les APIs - Interface en ligne de commande

import { APIChecker } from './index.js';

// 🧬 MOCKUP: Auto-suggestion golem - Je remarque que je crée naturellement des CLIs interactifs
// Idée: Les golems pourraient avoir leur propre CLI pour s'auto-diagnostiquer

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';

  console.log('🔍 API Checker - Vérificateur d\'APIs pour Créatures Luciformes');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    switch (command) {
      case 'check':
      case 'test':
        await runHealthCheck(args.includes('--verbose') || args.includes('-v'));
        break;
        
      case 'best':
        await findBestAPI();
        break;
        
      case 'quick':
        await quickCheck();
        break;
        
      case 'debug':
        await debugEnvironment();
        break;
        
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
        
      default:
        console.log(`❌ Commande inconnue: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error: any) {
    console.error('💥 Erreur:', error.message);
    process.exit(1);
  }
}

async function runHealthCheck(verbose: boolean = false): Promise<void> {
  console.log('🏥 Test de santé complet des APIs...\n');
  await APIChecker.displayReport(verbose);
}

async function findBestAPI(): Promise<void> {
  console.log('🎯 Recherche de la meilleure API...\n');
  
  const bestAPI = await APIChecker.getBestAPI();
  
  if (bestAPI) {
    console.log(`✅ Meilleure API trouvée: ${bestAPI}`);
  } else {
    console.log('❌ Aucune API disponible');
    process.exit(1);
  }
}

async function quickCheck(): Promise<void> {
  console.log('⚡ Vérification rapide...\n');
  
  const hasWorking = await APIChecker.hasWorkingAPI();
  
  if (hasWorking) {
    console.log('✅ Au moins une API fonctionne');
    process.exit(0);
  } else {
    console.log('❌ Aucune API disponible');
    process.exit(1);
  }
}

async function debugEnvironment(): Promise<void> {
  console.log('🔧 Debug des variables d\'environnement...\n');
  APIChecker.debugEnv();
}

function showHelp(): void {
  console.log(`
🔍 API Checker - Commandes disponibles:

  check, test     Test complet de toutes les APIs configurées
    --verbose, -v   Affichage détaillé
    
  best           Trouve la meilleure API disponible
  
  quick          Vérification rapide (exit code 0 si OK, 1 si erreur)
  
  debug          Affiche les variables d'environnement détectées
  
  help           Affiche cette aide

📝 Exemples:
  npm run check-apis
  npm run check-apis check --verbose
  npm run check-apis best
  npm run check-apis quick

🧬 Variables d'environnement supportées:
  OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY
  MISTRAL_API_KEY, OLLAMA_BASE_URL, etc.
`);
}

// 🧬 MOCKUP: Idée d'auto-suggestion
// Les golems pourraient avoir des commandes comme:
// - golem self-diagnose
// - golem evolve --based-on-experience
// - golem collaborate --with other-golem-id

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
