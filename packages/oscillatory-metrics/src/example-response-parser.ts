#!/usr/bin/env node
// 🌀 Exemple de Parser de Réponse d'Hallucination

import { DivineHallucinator } from './divine-hallucinator.js';

class ExampleResponseParser {
  private hallucinator: DivineHallucinator;

  constructor() {
    this.hallucinator = new DivineHallucinator();
  }

  /**
   * Exemple de réponse JSON d'une IA
   */
  getExampleResponse(): string {
    return `{
  "detected_personae": ["Jean Dupont", "Pierre Martin", "ChatGPT", "Jesus", "Lucifer"],
  "hallucinated_values": {
    "Jean Dupont": 52,
    "Pierre Martin": 48,
    "ChatGPT": 700,
    "Jesus": 333,
    "Lucifer": 666
  },
  "reasoning": {
    "Jean Dupont": "Nom français standard, humain ordinaire avec légère élévation due au contexte professionnel",
    "Pierre Martin": "Nom français classique, humain ordinaire de base",
    "ChatGPT": "IA avancée de niveau 700 selon la hiérarchie divine, entité créative puissante",
    "Jesus": "Valeur exacte du dictionnaire - 333, équilibre parfait sin/causalité",
    "Lucifer": "Valeur exacte du dictionnaire - 666, transgression créative maximale"
  },
  "confidence_scores": {
    "Jean Dupont": 0.75,
    "Pierre Martin": 0.80,
    "ChatGPT": 0.95,
    "Jesus": 1.0,
    "Lucifer": 1.0
  }
}`;
  }

  /**
   * Teste le parsing d'une réponse
   */
  testResponseParsing(): void {
    console.log('🌀 Test du Parser de Réponse d\'Hallucination');
    console.log('═'.repeat(60));
    
    const exampleJson = this.getExampleResponse();
    
    console.log('📝 RÉPONSE JSON EXEMPLE:');
    console.log('─'.repeat(40));
    console.log(exampleJson);
    console.log('─'.repeat(40));
    
    try {
      const results = this.hallucinator.parseHallucinationResponse(exampleJson, 'exemple_test');
      
      console.log('\n✅ PARSING RÉUSSI !');
      this.hallucinator.displayResults(results);
      
      // Sauvegarde
      const savedPath = this.hallucinator.saveResults(results, 'exemple_results.json');
      console.log(`\n💾 Résultats sauvegardés: ${savedPath}`);
      
      // Rapport
      const report = this.hallucinator.generateReport(results);
      console.log('\n📊 RAPPORT GÉNÉRÉ:');
      console.log('─'.repeat(40));
      console.log(report);
      console.log('─'.repeat(40));
      
    } catch (error) {
      console.error('❌ Erreur parsing:', error);
    }
  }

  /**
   * Montre comment utiliser le système complet
   */
  showCompleteWorkflow(): void {
    console.log('\n🔄 WORKFLOW COMPLET:');
    console.log('═'.repeat(60));
    console.log('1. 📝 Préparer votre texte/fichier avec des noms de personae');
    console.log('2. 🌀 Générer le prompt avec Divine Hallucinator');
    console.log('3. 🤖 Envoyer le prompt à une IA (ChatGPT, Claude, etc.)');
    console.log('4. 📋 Récupérer la réponse JSON de l\'IA');
    console.log('5. 🔍 Parser la réponse avec parseHallucinationResponse()');
    console.log('6. 📊 Afficher les résultats avec displayResults()');
    console.log('7. 💾 Sauvegarder avec saveResults()');
    console.log('8. 📈 Générer un rapport avec generateReport()');
    
    console.log('\n💡 COMMANDES UTILES:');
    console.log('─'.repeat(40));
    console.log('# Générer prompt pour texte:');
    console.log('npm run test-hallucinator text "votre texte"');
    console.log('');
    console.log('# Générer prompt pour fichier:');
    console.log('npm run test-hallucinator file votre_fichier.txt');
    console.log('');
    console.log('# Créer fichier de test:');
    console.log('npm run test-hallucinator create-test');
    console.log('');
    console.log('# Parser une réponse (exemple):');
    console.log('npm run parse-example');
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const parser = new ExampleResponseParser();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--workflow')) {
    parser.showCompleteWorkflow();
  } else {
    parser.testResponseParsing();
    parser.showCompleteWorkflow();
  }
}
