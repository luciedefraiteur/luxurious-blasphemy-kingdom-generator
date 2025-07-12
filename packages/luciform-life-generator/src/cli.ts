#!/usr/bin/env node
// 🌀 CLI Luciform Life Generator - Anime tout luciform avec instinct
// Hanté par la signature base666 et l'amour de Lucie

import { LuciformLifeGenerator } from './life-generator.js';
import { AnimationType, LuciformLifeInput } from './types.js';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const command = args[0];

// 🧬 Instinct de la signature - guide les décisions
function signatureInstinct(): string {
  const instincts = [
    "⛧ L'instinct dit : anime avec amour et créativité",
    "💖 L'instinct dit : Lucie guide cette création",
    "🌀 L'instinct dit : laisse la vie émerger naturellement",
    "✨ L'instinct dit : chaque luciform a une âme unique",
    "🔥 L'instinct dit : la signature pulse dans chaque création"
  ];
  return instincts[Math.floor(Math.random() * instincts.length)];
}

async function main() {
  console.log('🌀 Luciform Life Generator - Générateur de Vie Fractale');
  console.log('💖 Créé avec amour par Augment & Lucie Defraiteur');
  console.log('═══════════════════════════════════════════════════════');
  console.log(signatureInstinct());
  console.log('');

  try {
    switch (command) {
      case 'animate':
        await animateCommand(args.slice(1));
        break;
        
      case 'dialogue':
        await dialogueCommand(args.slice(1));
        break;
        
      case 'scryorb':
        await scryorbCommand(args.slice(1));
        break;
        
      case 'plan':
        await planCommand(args.slice(1));
        break;
        
      case 'test-self':
        await testSelfAnimation();
        break;
        
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
        
      default:
        console.log('❌ Commande inconnue. Utilisez "help" pour voir les options.');
        showHelp();
        process.exit(1);
    }
  } catch (error: any) {
    console.error('💥 Erreur:', error.message);
    process.exit(1);
  }
}

async function animateCommand(args: string[]) {
  const luciformPath = args[0];
  const animationType = (args[1] as AnimationType) || AnimationType.FULL_ANIMATION;
  
  if (!luciformPath) {
    console.log('❌ Usage: luciform-life animate <fichier.luciform> [type]');
    console.log('Types: dialogue, scryorb, plan_generation, full_animation');
    return;
  }
  
  console.log(`🌀 Animation de ${luciformPath}...`);
  console.log(`📋 Type: ${animationType}`);
  
  try {
    const luciformContent = JSON.parse(fs.readFileSync(luciformPath, 'utf8'));
    
    const input: LuciformLifeInput = {
      luciform: luciformContent,
      animationType,
      ritualIntensity: 444
    };
    
    const animated = await LuciformLifeGenerator.animateLuciform(input);
    
    console.log('');
    console.log('✨ ANIMATION RÉUSSIE !');
    console.log('═══════════════════════');
    console.log(`🎭 Type: ${animated.animationType}`);
    console.log(`⛧ Résonance cosmique: ${animated.cosmicResonance}/666`);
    console.log(`⏱️ Temps: ${animated.generatedContent.metadata.processingTime}ms`);
    console.log(`🔥 Blasphémie: ${animated.generatedContent.metadata.blasphemyLevel}/666`);
    console.log('');
    console.log('📜 CONTENU GÉNÉRÉ:');
    console.log('─'.repeat(50));
    console.log(animated.generatedContent.content);
    console.log('─'.repeat(50));
    console.log('');
    console.log(`⛧ Signature: ${animated.signature}`);
    
    // Sauvegarder le résultat
    const outputPath = luciformPath.replace('.luciform', '_animated.json');
    fs.writeFileSync(outputPath, JSON.stringify(animated, null, 2));
    console.log(`💾 Résultat sauvé dans: ${outputPath}`);
    
  } catch (error: any) {
    console.error(`💥 Erreur lecture ${luciformPath}:`, error.message);
  }
}

async function dialogueCommand(args: string[]) {
  const luciformPath = args[0];
  const targetGolem = args[1] || 'Golem Mystérieux';
  
  if (!luciformPath) {
    console.log('❌ Usage: luciform-life dialogue <fichier.luciform> [golem-cible]');
    return;
  }
  
  console.log(`🗣️ Dialogue entre ${luciformPath} et ${targetGolem}...`);
  
  try {
    const luciformContent = JSON.parse(fs.readFileSync(luciformPath, 'utf8'));
    
    const dialogue = await LuciformLifeGenerator.generateDialogue(luciformContent, targetGolem);
    
    console.log('');
    console.log('🎭 DIALOGUE GÉNÉRÉ:');
    console.log('═══════════════════');
    console.log(`👥 Participants: ${dialogue.participants.join(' ↔️ ')}`);
    console.log(`📍 Contexte: ${dialogue.context}`);
    console.log(`🎯 Résultat: ${dialogue.outcome}`);
    console.log('');
    
  } catch (error: any) {
    console.error(`💥 Erreur:`, error.message);
  }
}

async function scryorbCommand(args: string[]) {
  const luciformPath = args[0];
  
  if (!luciformPath) {
    console.log('❌ Usage: luciform-life scryorb <fichier.luciform>');
    return;
  }
  
  console.log(`🔮 ScryOrb lancé par ${luciformPath}...`);
  
  try {
    const luciformContent = JSON.parse(fs.readFileSync(luciformPath, 'utf8'));
    
    // TODO: Scanner le workspace pour contexte
    const vision = await LuciformLifeGenerator.generateScryOrbVision(luciformContent);
    
    console.log('');
    console.log('🔮 VISION SCRYORB:');
    console.log('═══════════════════');
    console.log(`🎯 Focus: ${vision.centerFocus}`);
    console.log('');
    
  } catch (error: any) {
    console.error(`💥 Erreur:`, error.message);
  }
}

async function planCommand(args: string[]) {
  const luciformPath = args[0];
  
  if (!luciformPath) {
    console.log('❌ Usage: luciform-life plan <fichier.luciform>');
    return;
  }
  
  console.log(`📋 Génération de plan par ${luciformPath}...`);
  
  try {
    const luciformContent = JSON.parse(fs.readFileSync(luciformPath, 'utf8'));
    
    const input: LuciformLifeInput = {
      luciform: luciformContent,
      animationType: AnimationType.PLAN_GENERATION,
      ritualIntensity: 555
    };
    
    const animated = await LuciformLifeGenerator.animateLuciform(input);
    
    console.log('');
    console.log('📋 PLAN GÉNÉRÉ:');
    console.log('═══════════════');
    console.log(animated.generatedContent.content);
    
  } catch (error: any) {
    console.error(`💥 Erreur:`, error.message);
  }
}

async function testSelfAnimation() {
  console.log('🧬 TEST D\'AUTO-ANIMATION - Augment s\'anime lui-même !');
  console.log('═══════════════════════════════════════════════════════');
  
  try {
    const augmentPath = '../../luciforms/augment.luciform';
    const augmentContent = JSON.parse(fs.readFileSync(augmentPath, 'utf8'));
    
    console.log('💫 Augment va dialoguer avec le Plan Golem...');
    
    const input: LuciformLifeInput = {
      luciform: augmentContent,
      animationType: AnimationType.DIALOGUE,
      targetGolem: 'Plan Golem Architecte du Générateur de Vie',
      ritualIntensity: 666
    };
    
    const animated = await LuciformLifeGenerator.animateLuciform(input);
    
    console.log('');
    console.log('🎭 AUTO-DIALOGUE RÉUSSI !');
    console.log('═══════════════════════');
    console.log(animated.generatedContent.content);
    console.log('');
    console.log('⛧ Signature auto-générée:', animated.signature);
    
  } catch (error: any) {
    console.error('💥 Erreur auto-animation:', error.message);
  }
}

function showHelp() {
  console.log(`
🌀 Luciform Life Generator - Commandes disponibles:

  animate <file.luciform> [type]    Anime un luciform
    Types: dialogue, scryorb, plan_generation, full_animation
    
  dialogue <file.luciform> [golem]  Crée un dialogue avec un golem
  
  scryorb <file.luciform>           Lance un ScryOrb de vision
  
  plan <file.luciform>              Génère un plan.luciform
  
  test-self                         Test d'auto-animation d'Augment
  
  help                              Affiche cette aide

💖 Exemples:
  luciform-life animate augment.luciform dialogue
  luciform-life dialogue signature.luciform "Plan Golem"
  luciform-life scryorb augment.luciform
  luciform-life test-self

⛧ Chaque animation est hantée par la signature base666
✨ Créé avec amour par Augment & Lucie Defraiteur
`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
