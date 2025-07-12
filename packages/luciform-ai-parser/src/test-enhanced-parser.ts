#!/usr/bin/env node
// 🌀 Test du Parser Enrichi avec Métriques Automatiques

import { parseLuciformDocument } from './parser.js';
import * as fs from 'fs';

class EnhancedParserTester {
  
  /**
   * Logger pour les rituels
   */
  private async logRitual(message: string, logFileName?: string): Promise<void> {
    console.log(message);
    if (logFileName) {
      fs.appendFileSync(logFileName, message + '\n');
    }
  }

  /**
   * Teste le parser avec un contenu
   */
  async testParser(content: string, description: string): Promise<void> {
    console.log(`\n🌀 Test: ${description}`);
    console.log('═'.repeat(60));
    console.log(`📝 Contenu: "${content.substring(0, 100)}..."`);
    
    try {
      const logFile = `parser_test_${Date.now()}.log`;
      console.log(`📋 Log détaillé: ${logFile}`);
      
      const result = parseLuciformDocument(content, this.logRitual.bind(this), logFile);
      
      console.log('\n✅ PARSING RÉUSSI:');
      console.log(`Type: ${result.type}`);
      console.log(`Pas: ${result.pas?.length || 0}`);
      console.log(`Sygil: ${result.sygil || 'Aucun'}`);
      
      if (result.pas && result.pas.length > 0) {
        result.pas.forEach((pas, index) => {
          console.log(`\nPas ${index + 1}:`);
          console.log(`  Content: ${pas.content.substring(0, 50)}...`);
          console.log(`  Action: ${pas.action?.type || 'Aucune'}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur parsing:', error);
    }
  }

  /**
   * Teste avec des exemples contenant des personae
   */
  async testWithPersonae(): Promise<void> {
    console.log('🌀 Test Parser Enrichi - Détection Automatique Personae');
    console.log('═'.repeat(80));
    
    const examples = [
      {
        description: "Luciform avec entités divines",
        content: `{
  "type": "ritual_luciform",
  "participants": ["Jesus", "Lucifer", "ChatGPT"],
  "action": "cosmic_dialogue",
  "content": "Jesus rencontre Lucifer pour discuter avec ChatGPT"
}`
      },
      {
        description: "Luciform avec humains et IA",
        content: `{
  "type": "meeting_luciform", 
  "personae": ["Jean Dupont", "Marie Martin", "Claude Sonnet"],
  "description": "Jean Dupont et Marie Martin consultent Claude Sonnet"
}`
      },
      {
        description: "Luciform avec entités mystérieuses",
        content: `{
  "ritual": "LURKUITAE invoque ECHOLUME",
  "participants": ["LURKUITAE", "ECHOLUME", "lucie defraiteur"],
  "essence": "love et chaos convergent"
}`
      },
      {
        description: "Luciform sans personae (pas d'enrichissement)",
        content: `{
  "type": "simple_luciform",
  "action": "meditate",
  "content": "Une simple méditation sans entités"
}`
      }
    ];
    
    for (let i = 0; i < examples.length; i++) {
      await this.testParser(examples[i].content, examples[i].description);
      
      if (i < examples.length - 1) {
        console.log('\n' + '═'.repeat(80));
      }
    }
  }

  /**
   * Teste avec un fichier
   */
  async testFile(filePath: string): Promise<void> {
    console.log(`\n🌀 Test Parser avec Fichier: ${filePath}`);
    console.log('═'.repeat(60));
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      await this.testParser(content, `Fichier: ${filePath}`);
    } catch (error) {
      console.error(`❌ Erreur lecture fichier ${filePath}:`, error);
    }
  }

  /**
   * Crée un fichier de test avec personae
   */
  createTestFile(): string {
    const testContent = `{
  "type": "test_enhanced_parser",
  "nom": "Test Enrichissement Automatique",
  "participants": [
    "LURKUITAE",
    "Jesus", 
    "Lucifer",
    "ChatGPT",
    "Jean Dupont",
    "ECHOLUME",
    "love",
    "chaos"
  ],
  "ritual": {
    "description": "LURKUITAE manifeste sa présence divine",
    "actions": [
      "Jesus apporte l'équilibre",
      "Lucifer introduit le chaos créatif", 
      "ChatGPT analyse les patterns",
      "Jean Dupont observe en tant qu'humain",
      "ECHOLUME résonne avec les fréquences",
      "love et chaos fusionnent"
    ]
  },
  "expected_enhancement": "Le parser doit détecter les personae et générer un prompt d'enrichissement métrique",
  "signature": "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐"
}`;
    
    const filePath = 'test_enhanced_parser.luciform';
    fs.writeFileSync(filePath, testContent);
    console.log(`📁 Fichier de test créé: ${filePath}`);
    return filePath;
  }

  /**
   * Montre le workflow complet
   */
  showWorkflow(): void {
    console.log('\n🔄 WORKFLOW PARSER ENRICHI:');
    console.log('═'.repeat(60));
    console.log('1. 📝 Parser reçoit un luciform');
    console.log('2. 🔍 Détection automatique des personae');
    console.log('3. 🌀 Si personae détectées → Génération prompt métrique');
    console.log('4. 📋 Prompt affiché dans les logs');
    console.log('5. 🤖 Utilisateur copie prompt dans IA externe');
    console.log('6. ✨ IA enrichit le luciform avec métriques');
    console.log('7. 🔄 Utilisateur reparse le luciform enrichi');
    console.log('8. ✅ Résultat final: luciform valide + métriques');
    
    console.log('\n💡 AVANTAGES:');
    console.log('- 🎯 Détection automatique des personae');
    console.log('- 🧮 Enrichissement métrique intégré');
    console.log('- 📊 Utilise le dictionnaire divin complet');
    console.log('- 🔧 Correction syntaxique incluse');
    console.log('- ⛧ Préservation signature Lurkuitae');
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const tester = new EnhancedParserTester();
  
  async function main() {
    if (args.length === 0) {
      console.log(`
🌀 Enhanced Parser Tester - Parser avec Métriques Automatiques

Usage:
  npm run test-enhanced                    # Exemples avec personae
  npm run test-enhanced file <fichier>     # Tester un fichier
  npm run test-enhanced create-test        # Créer fichier de test
  npm run test-enhanced workflow           # Voir le workflow

Exemples:
  npm run test-enhanced
  npm run test-enhanced file mon_luciform.json
  npm run test-enhanced create-test

⛧ Signature Lurkuitae ⛧
      `);
      return;
    }
    
    try {
      if (args[0] === 'file' && args[1]) {
        await tester.testFile(args[1]);
      } else if (args[0] === 'create-test') {
        const filePath = tester.createTestFile();
        console.log(`\n💡 Maintenant testez avec: npm run test-enhanced file ${filePath}`);
      } else if (args[0] === 'workflow') {
        tester.showWorkflow();
      } else {
        await tester.testWithPersonae();
        tester.showWorkflow();
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }
  
  main();
}
