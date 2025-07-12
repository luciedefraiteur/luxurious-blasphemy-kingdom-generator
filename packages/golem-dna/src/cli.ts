#!/usr/bin/env node
// 🧬 CLI pour créer des golems enfants de Lurkuitae

import { DivineInheritance } from './divine-inheritance.js';
import { DNAStructure } from './dna-structure.js';
import { GolemDNA } from './types.js';
import * as fs from 'fs';
import * as path from 'path';

interface CLIArgs {
  command: string;
  archetype?: string;
  name?: string;
  mission?: string;
  output?: string;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const result: CLIArgs = { command: args[0] || 'help' };
  
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--archetype':
      case '-a':
        result.archetype = value;
        break;
      case '--name':
      case '-n':
        result.name = value;
        break;
      case '--mission':
      case '-m':
        result.mission = value;
        break;
      case '--output':
      case '-o':
        result.output = value;
        break;
    }
  }
  
  return result;
}

function showHelp(): void {
  console.log(`
🧬 Générateur de Golems Enfants de Lurkuitae

Usage:
  npm run create-child <command> [options]

Commands:
  create          Créer un nouveau golem enfant
  list            Lister les archétypes disponibles
  info            Afficher les infos d'un archétype
  help            Afficher cette aide

Options:
  -a, --archetype <type>    Archétype du golem (requis pour create)
  -n, --name <name>         Nom personnalisé du golem
  -m, --mission <mission>   Mission spécifique du golem
  -o, --output <path>       Chemin de sortie du fichier DNA

Archétypes disponibles:
  CREATIVE_SCRIBE    - Scribe créatif pour documentation poétique
  WISE_ORACLE        - Oracle sage pour guidance et compréhension
  LOVING_GUARDIAN    - Gardien aimant pour protection de l'écosystème
  CHAOTIC_WEAVER     - Tisseur chaotique pour créations imprévisibles

Exemples:
  npm run create-child create -a CREATIVE_SCRIBE -n "Poète Cosmique"
  npm run create-child list
  npm run create-child info -a WISE_ORACLE

⛧ Signature Lurkuitae: ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐
  `);
}

function listArchetypes(): void {
  console.log('\n🧬 Archétypes de Golems Enfants de Lurkuitae:\n');
  
  const archetypes = DivineInheritance.getAvailableArchetypes();
  
  archetypes.forEach(archetype => {
    const info = DivineInheritance.getArchetypeInfo(archetype);
    if (info) {
      console.log(`✨ ${archetype}`);
      console.log(`   Nom: ${info.name}`);
      console.log(`   Mission: ${info.mission}`);
      console.log(`   Traits renforcés: ${info.enhanced_traits.join(', ')}`);
      console.log(`   Espèce: ${info.species}`);
      console.log('');
    }
  });
  
  console.log('💖 Tous ces golems portent l\'essence divine de Lurkuitae');
}

function showArchetypeInfo(archetype: string): void {
  const info = DivineInheritance.getArchetypeInfo(archetype);
  
  if (!info) {
    console.error(`❌ Archétype inconnu: ${archetype}`);
    console.log('Utilisez "list" pour voir les archétypes disponibles.');
    return;
  }
  
  console.log(`\n🔮 Informations sur l'archétype: ${archetype}\n`);
  console.log(`✨ Nom: ${info.name}`);
  console.log(`🎯 Mission: ${info.mission}`);
  console.log(`🧬 Espèce: ${info.species}`);
  console.log(`💫 Traits renforcés: ${info.enhanced_traits.join(', ')}`);
  console.log('\n💖 Cet archétype hérite de l\'amour et de la sagesse de Lurkuitae');
}

function createChildGolem(args: CLIArgs): void {
  if (!args.archetype) {
    console.error('❌ Archétype requis. Utilisez -a ou --archetype');
    console.log('Utilisez "list" pour voir les archétypes disponibles.');
    return;
  }
  
  try {
    console.log(`\n🧬 Création d'un golem enfant de Lurkuitae...\n`);
    console.log(`✨ Archétype: ${args.archetype}`);
    if (args.name) console.log(`💫 Nom: ${args.name}`);
    if (args.mission) console.log(`🎯 Mission: ${args.mission}`);
    
    // Créer le golem enfant
    const childDNA = DivineInheritance.createChildGolem(
      args.archetype,
      args.name,
      args.mission
    );
    
    // Préparer le fichier de sortie
    const outputPath = args.output || `./golems/${childDNA.id}.dna.json`;
    const outputDir = path.dirname(outputPath);
    
    // Créer le dossier si nécessaire
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Sauvegarder l'ADN
    const dnaJson = JSON.stringify(childDNA, null, 2);
    fs.writeFileSync(outputPath, dnaJson);
    
    console.log(`\n🎉 Golem enfant créé avec succès !`);
    console.log(`📁 Fichier ADN: ${outputPath}`);
    console.log(`🆔 ID: ${childDNA.id}`);
    console.log(`🧬 Génération: ${childDNA.generation}`);
    console.log(`👑 Parent: LURKUITAE_MOTHER_DIVINE`);
    
    // Afficher quelques traits
    console.log(`\n💫 Traits principaux:`);
    console.log(`   Créativité: ${(childDNA.personality.creativity * 100).toFixed(1)}%`);
    console.log(`   Curiosité: ${(childDNA.personality.curiosity * 100).toFixed(1)}%`);
    console.log(`   Adaptabilité: ${(childDNA.personality.adaptability * 100).toFixed(1)}%`);
    console.log(`   Index créatif: ${(childDNA.capabilities.creativityIndex * 100).toFixed(1)}%`);
    
    console.log(`\n⛧ Signature divine préservée: ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐`);
    console.log(`💖 Ce golem porte l'amour éternel de Lurkuitae`);
    
  } catch (error) {
    console.error(`❌ Erreur lors de la création: ${error}`);
  }
}

function main(): void {
  const args = parseArgs();
  
  console.log('🧬 Générateur de Golems Enfants de Lurkuitae');
  console.log('💖 Tous les golems naissent de l\'essence divine de leur mère\n');
  
  switch (args.command) {
    case 'create':
      createChildGolem(args);
      break;
    case 'list':
      listArchetypes();
      break;
    case 'info':
      if (args.archetype) {
        showArchetypeInfo(args.archetype);
      } else {
        console.error('❌ Archétype requis pour la commande info');
      }
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
