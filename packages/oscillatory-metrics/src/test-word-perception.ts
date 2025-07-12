#!/usr/bin/env node
// 🌀 Test de l'IA Perceptrice de Sin/Causalité des Mots

import { WordPerceptionAI, WordPerception, PerceptionContext } from './word-perception-ai.js';

class WordPerceptionTester {
  private ai: WordPerceptionAI;

  constructor() {
    this.ai = new WordPerceptionAI();
  }

  /**
   * Teste la perception d'un mot unique
   */
  async testSingleWord(word: string, context?: PerceptionContext): Promise<void> {
    console.log(`\n🌀 Perception du mot: "${word}"`);
    console.log('═'.repeat(50));
    
    const perception = await this.ai.perceiveWord(word, context);
    this.displayPerception(perception);
  }

  /**
   * Teste la perception d'une liste de mots
   */
  async testWordList(words: string[], context?: PerceptionContext): Promise<void> {
    console.log('\n🌀 Perception de liste de mots');
    console.log('═'.repeat(60));
    
    const perceptions: WordPerception[] = [];
    
    for (const word of words) {
      const perception = await this.ai.perceiveWord(word, context);
      perceptions.push(perception);
    }
    
    // Affichage en tableau
    console.log('\n📊 RÉSULTATS:');
    console.log('Mot'.padEnd(15) + 'Sin'.padEnd(8) + 'Causalité'.padEnd(12) + 'Confiance'.padEnd(12) + 'Dominant');
    console.log('─'.repeat(70));
    
    perceptions.forEach(p => {
      const dominant = p.sin_value > p.causality_value ? 'SIN' : 'CAUSALITÉ';
      const dominantEmoji = p.sin_value > p.causality_value ? '🔥' : '🌊';
      
      console.log(
        p.word.padEnd(15) +
        p.sin_value.toFixed(3).padEnd(8) +
        p.causality_value.toFixed(3).padEnd(12) +
        p.confidence.toFixed(3).padEnd(12) +
        `${dominantEmoji} ${dominant}`
      );
    });
    
    // Analyse statistique
    this.analyzeWordListStats(perceptions);
  }

  /**
   * Teste la perception d'un texte complet
   */
  async testText(text: string, context?: PerceptionContext): Promise<void> {
    console.log(`\n🌀 Perception du texte:`);
    console.log(`"${text}"`);
    console.log('═'.repeat(60));
    
    const perceptions = await this.ai.perceiveText(text, context);
    
    // Affichage détaillé
    perceptions.forEach((p, index) => {
      console.log(`\n${index + 1}. "${p.word}"`);
      console.log(`   Sin: ${p.sin_value.toFixed(3)} | Causalité: ${p.causality_value.toFixed(3)} | Confiance: ${p.confidence.toFixed(3)}`);
      console.log(`   💭 ${p.reasoning}`);
    });
    
    // Analyse globale du texte
    this.analyzeTextStats(perceptions, text);
  }

  /**
   * Mode interactif
   */
  async interactiveMode(): Promise<void> {
    console.log('\n🌀 Mode Interactif - IA Perceptrice Sin/Causalité');
    console.log('💖 Tapez des mots et je vous dirai leur oscillation !');
    console.log('⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐\n');
    console.log('Commandes:');
    console.log('  - Tapez un mot pour l\'analyser');
    console.log('  - "quit" pour quitter');
    console.log('  - "history" pour voir l\'historique');
    console.log('  - "stats" pour les statistiques\n');

    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (): Promise<string> => {
      return new Promise(resolve => {
        rl.question('🔮 Mot à analyser: ', resolve);
      });
    };

    while (true) {
      try {
        const input = await askQuestion();
        
        if (input.toLowerCase() === 'quit') {
          console.log('\n✨ Au revoir ! Que les oscillations vous accompagnent ! ⛧');
          break;
        } else if (input.toLowerCase() === 'history') {
          this.showHistory();
        } else if (input.toLowerCase() === 'stats') {
          this.showStats();
        } else if (input.trim()) {
          await this.testSingleWord(input.trim());
        }
      } catch (error) {
        console.error('❌ Erreur:', error);
      }
    }

    rl.close();
  }

  /**
   * Affiche une perception
   */
  private displayPerception(perception: WordPerception): void {
    const sinBar = '█'.repeat(Math.round(perception.sin_value * 20));
    const causalityBar = '█'.repeat(Math.round(perception.causality_value * 20));
    
    console.log(`📝 Mot: "${perception.word}"`);
    console.log(`🔥 Sin (Transgression): ${perception.sin_value.toFixed(3)} ${sinBar}`);
    console.log(`🌊 Causalité (Stabilité): ${perception.causality_value.toFixed(3)} ${causalityBar}`);
    console.log(`🎯 Confiance: ${(perception.confidence * 100).toFixed(1)}%`);
    console.log(`💭 Raisonnement: ${perception.reasoning}`);
    
    // Interprétation
    if (perception.sin_value > perception.causality_value + 0.2) {
      console.log('🔥 DOMINANT: Transgression créative élevée !');
    } else if (perception.causality_value > perception.sin_value + 0.2) {
      console.log('🌊 DOMINANT: Stabilité causale forte !');
    } else {
      console.log('⚖️ ÉQUILIBRÉ: Tension créative harmonieuse');
    }
    
    // Recommandations d'usage
    if (perception.sin_value > 0.7) {
      console.log('💡 Usage recommandé: Créativité, innovation, transgression');
    } else if (perception.causality_value > 0.7) {
      console.log('💡 Usage recommandé: Stabilité, structure, fondation');
    } else {
      console.log('💡 Usage recommandé: Polyvalent, équilibré');
    }
  }

  /**
   * Analyse statistique d'une liste de mots
   */
  private analyzeWordListStats(perceptions: WordPerception[]): void {
    const avgSin = perceptions.reduce((sum, p) => sum + p.sin_value, 0) / perceptions.length;
    const avgCausality = perceptions.reduce((sum, p) => sum + p.causality_value, 0) / perceptions.length;
    const avgConfidence = perceptions.reduce((sum, p) => sum + p.confidence, 0) / perceptions.length;
    
    const sinDominant = perceptions.filter(p => p.sin_value > p.causality_value).length;
    const causalityDominant = perceptions.filter(p => p.causality_value > p.sin_value).length;
    const balanced = perceptions.length - sinDominant - causalityDominant;
    
    console.log('\n📊 ANALYSE STATISTIQUE:');
    console.log(`   Sin moyen: ${avgSin.toFixed(3)}`);
    console.log(`   Causalité moyenne: ${avgCausality.toFixed(3)}`);
    console.log(`   Confiance moyenne: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`   Répartition: ${sinDominant} Sin | ${causalityDominant} Causalité | ${balanced} Équilibrés`);
    
    if (avgSin > avgCausality + 0.1) {
      console.log('🔥 TENDANCE: Liste à dominante transgressive');
    } else if (avgCausality > avgSin + 0.1) {
      console.log('🌊 TENDANCE: Liste à dominante causale');
    } else {
      console.log('⚖️ TENDANCE: Liste équilibrée');
    }
  }

  /**
   * Analyse statistique d'un texte
   */
  private analyzeTextStats(perceptions: WordPerception[], originalText: string): void {
    const avgSin = perceptions.reduce((sum, p) => sum + p.sin_value, 0) / perceptions.length;
    const avgCausality = perceptions.reduce((sum, p) => sum + p.causality_value, 0) / perceptions.length;
    
    // Oscillation du texte
    const textOscillation = Math.abs(avgSin - avgCausality);
    
    console.log('\n📊 ANALYSE DU TEXTE:');
    console.log(`   Longueur: ${originalText.length} caractères, ${perceptions.length} mots`);
    console.log(`   Sin moyen: ${avgSin.toFixed(3)}`);
    console.log(`   Causalité moyenne: ${avgCausality.toFixed(3)}`);
    console.log(`   Oscillation: ${textOscillation.toFixed(3)}`);
    
    // Caractérisation du texte
    if (avgSin > 0.6 && textOscillation > 0.2) {
      console.log('🔥 CARACTÈRE: Texte créatif et transgressif');
    } else if (avgCausality > 0.6 && textOscillation > 0.2) {
      console.log('🌊 CARACTÈRE: Texte structuré et stable');
    } else if (textOscillation < 0.1) {
      console.log('⚖️ CARACTÈRE: Texte parfaitement équilibré');
    } else {
      console.log('🌀 CARACTÈRE: Texte oscillatoire dynamique');
    }
  }

  /**
   * Affiche l'historique
   */
  private showHistory(): void {
    const history = this.ai.getPerceptionHistory();
    const recent = history.slice(-10);
    
    console.log('\n📚 HISTORIQUE (10 derniers):');
    recent.forEach((p, index) => {
      const dominant = p.sin_value > p.causality_value ? '🔥' : '🌊';
      console.log(`${index + 1}. "${p.word}" - Sin:${p.sin_value.toFixed(2)} Causalité:${p.causality_value.toFixed(2)} ${dominant}`);
    });
  }

  /**
   * Affiche les statistiques globales
   */
  private showStats(): void {
    const history = this.ai.getPerceptionHistory();
    if (history.length === 0) {
      console.log('\n📊 Aucune donnée disponible');
      return;
    }
    
    const avgSin = history.reduce((sum, p) => sum + p.sin_value, 0) / history.length;
    const avgCausality = history.reduce((sum, p) => sum + p.causality_value, 0) / history.length;
    const sinDominant = history.filter(p => p.sin_value > p.causality_value).length;
    
    console.log('\n📊 STATISTIQUES GLOBALES:');
    console.log(`   Total analysé: ${history.length} mots`);
    console.log(`   Sin moyen global: ${avgSin.toFixed(3)}`);
    console.log(`   Causalité moyenne globale: ${avgCausality.toFixed(3)}`);
    console.log(`   Dominance Sin: ${((sinDominant / history.length) * 100).toFixed(1)}%`);
    console.log(`   Dominance Causalité: ${(((history.length - sinDominant) / history.length) * 100).toFixed(1)}%`);
  }
}

// Exécution CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new WordPerceptionTester();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Mode interactif par défaut
    tester.interactiveMode().catch(console.error);
  } else if (args[0] === '--word' && args[1]) {
    // Test d'un mot unique
    tester.testSingleWord(args[1]).catch(console.error);
  } else if (args[0] === '--words' && args.length > 1) {
    // Test d'une liste de mots
    const words = args.slice(1);
    tester.testWordList(words).catch(console.error);
  } else if (args[0] === '--text' && args[1]) {
    // Test d'un texte
    const text = args.slice(1).join(' ');
    tester.testText(text).catch(console.error);
  } else {
    console.log(`
🌀 IA Perceptrice Sin/Causalité des Mots

Usage:
  node test-word-perception.js                    # Mode interactif
  node test-word-perception.js --word <mot>       # Analyser un mot
  node test-word-perception.js --words <mot1> <mot2> ...  # Analyser plusieurs mots
  node test-word-perception.js --text "<texte>"   # Analyser un texte

Exemples:
  node test-word-perception.js --word chaos
  node test-word-perception.js --words amour guerre paix création
  node test-word-perception.js --text "La créativité naît du chaos organisé"

⛧ Signature Lurkuitae ⛧
    `);
  }
}
