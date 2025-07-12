#!/usr/bin/env node
// 🌀 Test du Divine Hallucinator - CLI Simple

import { DivineHallucinator } from './divine-hallucinator.js';
import * as fs from 'fs';

class DivineHallucinatorTester {
  private hallucinator: DivineHallucinator;

  constructor() {
    this.hallucinator = new DivineHallucinator();
  }

  /**
   * Teste avec un texte simple
   */
  async testSimpleText(text: string): Promise<void> {
    console.log('🌀 Test Divine Hallucinator avec texte simple');
    console.log('═'.repeat(60));
    console.log(`📝 Texte: "${text}"`);
    
    try {
      const result = await this.hallucinator.analyzeText(text);
      
      console.log('\n🔥 PROMPT GÉNÉRÉ:');
      console.log('─'.repeat(40));
      console.log(result.prompt);
      console.log('─'.repeat(40));
      
      console.log('\n💡 Instructions:');
      console.log('1. Copiez le prompt ci-dessus');
      console.log('2. Collez-le dans ChatGPT, Claude, Gemini, etc.');
      console.log('3. L\'IA va halluciner les valeurs numériques des personae détectées');
      console.log('4. Récupérez la réponse JSON pour analyse');
      
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }

  /**
   * Teste avec un fichier
   */
  async testFile(filePath: string): Promise<void> {
    console.log('🌀 Test Divine Hallucinator avec fichier');
    console.log('═'.repeat(60));
    console.log(`📁 Fichier: ${filePath}`);
    
    try {
      const result = await this.hallucinator.analyzeFile(filePath);
      
      console.log('\n📄 CONTENU ANALYSÉ:');
      console.log('─'.repeat(40));
      console.log(result.inputContent.substring(0, 200) + '...');
      console.log('─'.repeat(40));
      
      console.log('\n🔥 PROMPT GÉNÉRÉ:');
      console.log('─'.repeat(40));
      console.log(result.prompt);
      console.log('─'.repeat(40));
      
      console.log('\n💡 Instructions:');
      console.log('1. Copiez le prompt ci-dessus');
      console.log('2. Collez-le dans votre IA préférée');
      console.log('3. Récupérez la réponse JSON');
      
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }

  /**
   * Teste avec des exemples prédéfinis
   */
  async testExamples(): Promise<void> {
    console.log('🌀 Test avec exemples prédéfinis');
    console.log('═'.repeat(60));
    
    const examples = [
      "Salut, je suis Jean Dupont et mon ami s'appelle Pierre Martin. On travaille avec ChatGPT.",
      "Dans cette histoire, Zeus rencontre Jesus et ils discutent avec Lucifer.",
      "L'équipe comprend Alice, Bob, et l'IA Claude. Le projet est dirigé par Marie Curie.",
      "Les personnages incluent Gandalf, Harry Potter, et Hermione Granger."
    ];
    
    for (let i = 0; i < examples.length; i++) {
      console.log(`\n📝 EXEMPLE ${i + 1}:`);
      await this.testSimpleText(examples[i]);
      
      if (i < examples.length - 1) {
        console.log('\n' + '═'.repeat(60));
      }
    }
  }

  /**
   * Crée un fichier de test
   */
  createTestFile(): string {
    const testContent = `
# Test de Personae pour Divine Hallucinator

Voici une liste de personnes et entités à analyser:

## Personnes réelles:
- Jean Dupont (développeur)
- Marie Curie (scientifique)
- Albert Einstein (physicien)
- Lucie Defraiteur (émissaire de Lurkuitae)

## Entités divines:
- Jesus Christ
- Lucifer
- Zeus
- Odin
- Buddha

## Entités AI:
- ChatGPT
- Claude Sonnet
- Gemini
- GPT-4

## Personnages fictifs:
- Harry Potter
- Gandalf
- Superman
- Batman

## Entités mystérieuses:
- Lurkuitae (source divine)
- ShadEOS
- Chad Orveil
- Augment Agent

Fin du test.
    `;
    
    const filePath = 'test_personae.txt';
    fs.writeFileSync(filePath, testContent);
    console.log(`📁 Fichier de test créé: ${filePath}`);
    return filePath;
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const tester = new DivineHallucinatorTester();
  
  async function main() {
    if (args.length === 0) {
      console.log(`
🌀 Test Divine Hallucinator

Usage:
  npm run test-hallucinator                    # Exemples prédéfinis
  npm run test-hallucinator text "<texte>"     # Tester un texte
  npm run test-hallucinator file <fichier>    # Tester un fichier
  npm run test-hallucinator create-test       # Créer fichier de test

Exemples:
  npm run test-hallucinator text "Salut je suis Jean et mon ami Pierre"
  npm run test-hallucinator file mon_fichier.txt
  npm run test-hallucinator create-test

⛧ Signature Lurkuitae ⛧
      `);
      return;
    }
    
    try {
      if (args[0] === 'text' && args[1]) {
        await tester.testSimpleText(args[1]);
      } else if (args[0] === 'file' && args[1]) {
        await tester.testFile(args[1]);
      } else if (args[0] === 'create-test') {
        const filePath = tester.createTestFile();
        console.log(`\n💡 Maintenant testez avec: npm run test-hallucinator file ${filePath}`);
      } else {
        await tester.testExamples();
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }
  
  main();
}
