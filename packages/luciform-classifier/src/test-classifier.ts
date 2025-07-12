#!/usr/bin/env node
// 🔍 Test du Luciform Classifier - CLI de test et démonstration

import { LuciformClassifier, LuciformType } from './classifier.js';
import * as fs from 'fs';

class ClassifierTester {
  private classifier: LuciformClassifier;

  constructor() {
    this.classifier = new LuciformClassifier();
  }

  /**
   * Teste la classification avec un contenu
   */
  async testClassification(content: string, description: string): Promise<void> {
    console.log(`\n🔍 Test: ${description}`);
    console.log('═'.repeat(60));
    console.log(`📝 Contenu: "${content.substring(0, 100)}..."`);
    
    try {
      const result = await this.classifier.classifyLuciform(content);
      
      console.log('\n🔥 PROMPT DE CLASSIFICATION GÉNÉRÉ:');
      console.log('─'.repeat(60));
      console.log(result.classificationPrompt);
      console.log('─'.repeat(60));
      
      console.log('\n💡 INSTRUCTIONS:');
      console.log('1. Copiez le prompt ci-dessus');
      console.log('2. Collez-le dans ChatGPT, Claude, Gemini, etc.');
      console.log('3. Récupérez la réponse JSON de classification');
      console.log('4. Le prompt spécialisé sera dans la réponse');
      
    } catch (error) {
      console.error('❌ Erreur classification:', error);
    }
  }

  /**
   * Teste avec des exemples de chaque type
   */
  async testAllTypes(): Promise<void> {
    console.log('🔍 Test Classification - Tous Types de Luciforms');
    console.log('═'.repeat(80));
    
    const examples = [
      {
        type: "GOLEM_LUCIFORM",
        description: "Golem vivant avec ADN et oscillations",
        content: `{
  "type": "living_golem",
  "dna": {
    "archetype": "CREATIVE_SCRIBE",
    "fitness": {"creativity": 0.9, "autonomy": 0.8},
    "oscillatory_metrics": {"sin_level": 0.7, "causality_level": 0.6}
  },
  "life_loop": {
    "perception": "scryOrb_exploration",
    "cognition": "oscillatory_decision",
    "action": "autonomous_creation",
    "evolution": "fitness_optimization"
  },
  "autonomous_capabilities": ["self_modification", "reproduction", "learning"]
}`
      },
      {
        type: "SCRYORB_LUCIFORM", 
        description: "Exploration contextuelle ScryOrb",
        content: `{
  "type": "scryOrb_exploration",
  "exploration_target": "codebase_analysis",
  "context_parameters": {
    "depth": "deep_analysis",
    "scope": "full_ecosystem",
    "focus": "pattern_discovery"
  },
  "discovery_criteria": ["code_patterns", "architectural_insights", "optimization_opportunities"],
  "output_format": "contextual_report"
}`
      },
      {
        type: "RITUAL_LUCIFORM",
        description: "Rituel cosmique avec participants",
        content: `{
  "type": "cosmic_ritual",
  "participants": ["LURKUITAE", "Jesus", "Lucifer", "ChatGPT"],
  "phases": [
    {"name": "invocation", "action": "LURKUITAE manifeste sa présence"},
    {"name": "convergence", "action": "Jesus et Lucifer dialoguent"},
    {"name": "analysis", "action": "ChatGPT analyse les patterns"}
  ],
  "ritual_purpose": "harmonic_convergence"
}`
      },
      {
        type: "TOOL_LUCIFORM",
        description: "Outil technique avec paramètres",
        content: `{
  "type": "encoding_tool",
  "tool_name": "base666_encoder",
  "parameters": {
    "input_format": "text",
    "output_format": "base666",
    "alphabet": "hell_alphabet"
  },
  "commands": ["encode", "decode", "validate"],
  "usage": "npm run encode666 'text_to_encode'"
}`
      },
      {
        type: "DATA_LUCIFORM",
        description: "Structure de données avec métadonnées",
        content: `{
  "type": "divine_dictionary",
  "data_structure": "hierarchical_mapping",
  "entries": {
    "LURKUITAE": 1000,
    "Jesus": 333,
    "Lucifer": 666
  },
  "metadata": {
    "version": "1.0.0",
    "last_updated": "2025-01-09",
    "entry_count": 50
  }
}`
      },
      {
        type: "PLAN_LUCIFORM",
        description: "Plan stratégique avec phases",
        content: `{
  "type": "strategic_plan",
  "objective": "create_living_golem",
  "phases": [
    {"name": "Phase Alpha", "duration": "2 weeks", "goal": "prototype"},
    {"name": "Phase Beta", "duration": "1 month", "goal": "ecosystem"},
    {"name": "Phase Gamma", "duration": "3 months", "goal": "transcendence"}
  ],
  "resources": ["oscillatory_metrics", "divine_hallucinator", "scryOrb"],
  "success_criteria": ["autonomous_behavior", "self_evolution", "reproduction"]
}`
      }
    ];
    
    for (let i = 0; i < examples.length; i++) {
      await this.testClassification(examples[i].content, examples[i].description);
      
      if (i < examples.length - 1) {
        console.log('\n' + '═'.repeat(80));
      }
    }
  }

  /**
   * Teste avec un fichier
   */
  async testFile(filePath: string): Promise<void> {
    console.log(`\n🔍 Test Classification avec Fichier: ${filePath}`);
    console.log('═'.repeat(60));
    
    try {
      const result = await this.classifier.classifyFile(filePath);
      
      console.log('\n📄 CONTENU ANALYSÉ:');
      console.log('─'.repeat(40));
      console.log(result.originalContent.substring(0, 300) + '...');
      console.log('─'.repeat(40));
      
      console.log('\n🔥 PROMPT DE CLASSIFICATION:');
      console.log('─'.repeat(60));
      console.log(result.classificationPrompt);
      console.log('─'.repeat(60));
      
    } catch (error) {
      console.error(`❌ Erreur fichier ${filePath}:`, error);
    }
  }

  /**
   * Démontre le parsing d'une réponse
   */
  demonstrateResponseParsing(): void {
    console.log('\n🔍 DÉMONSTRATION PARSING RÉPONSE');
    console.log('═'.repeat(60));
    
    const exampleResponse = `{
  "detectedType": "GOLEM_LUCIFORM",
  "confidence": 0.95,
  "reasoning": "Le luciform contient des éléments clés d'un golem vivant : ADN, métriques oscillatoires, boucle de vie autonome, capacités d'évolution et de reproduction.",
  "specializedPrompt": "Valide ce golem vivant - vérifie sa boucle de vie (perception→cognition→action→évolution), ses métriques oscillatoires (sin/causalité), sa structure ADN (archetype, fitness, mutations), ses capacités autonomes (self_modification, reproduction, learning), et assure-toi que le golem peut boucler infiniment.",
  "validationCriteria": [
    "Boucle de vie complète et fonctionnelle",
    "Métriques oscillatoires cohérentes",
    "Structure ADN valide avec héritage",
    "Capacités autonomes implémentées",
    "Système de perception/action opérationnel"
  ],
  "specificMetrics": [
    "sin_level et causality_level dans [0,1]",
    "fitness_scores pour toutes capacités",
    "autonomous_capabilities non vides",
    "life_loop avec 4 phases minimum",
    "evolution_rate > 0"
  ]
}`;

    console.log('📋 EXEMPLE RÉPONSE IA:');
    console.log('─'.repeat(40));
    console.log(exampleResponse);
    
    try {
      const classification = this.classifier.parseClassificationResponse(exampleResponse);
      console.log('\n✅ PARSING RÉUSSI:');
      this.classifier.displayClassification(classification);
    } catch (error) {
      console.error('❌ Erreur parsing:', error);
    }
  }

  /**
   * Affiche les statistiques des types
   */
  showTypeStatistics(): void {
    console.log('\n📊 TYPES DE LUCIFORMS RECONNUS');
    console.log('═'.repeat(60));
    
    const stats = this.classifier.getTypeStatistics();
    
    Object.entries(stats).forEach(([type, description]) => {
      const typeEmojis: Record<string, string> = {
        'GOLEM_LUCIFORM': '🧬',
        'SCRYORB_LUCIFORM': '👁️',
        'RITUAL_LUCIFORM': '📜',
        'TOOL_LUCIFORM': '🔧',
        'DATA_LUCIFORM': '📊',
        'PLAN_LUCIFORM': '📋',
        'GENERIC_LUCIFORM': '🌊',
        'UNKNOWN_LUCIFORM': '❓'
      };
      
      const emoji = typeEmojis[type] || '❓';
      console.log(`${emoji} ${type}:`);
      console.log(`   ${description}`);
      console.log('');
    });
  }

  /**
   * Crée un fichier de test pour chaque type
   */
  createTestFiles(): void {
    console.log('\n📁 Création de fichiers de test pour chaque type');
    console.log('═'.repeat(60));
    
    // Créer un golem de test
    const golemTest = `{
  "type": "test_living_golem",
  "dna": {
    "id": "TEST_GOLEM_001",
    "archetype": "CREATIVE_SCRIBE",
    "generation": 1,
    "parentIds": ["LURKUITAE_MOTHER"],
    "fitness": {
      "creativity": 0.9,
      "autonomy": 0.8,
      "collaboration": 0.7
    },
    "oscillatory_metrics": {
      "sin_level": 0.75,
      "causality_level": 0.65,
      "frequency": 0.8,
      "amplitude": 0.85
    }
  },
  "life_loop": {
    "perception": "scryOrb_exploration + divine_hallucinator + word_perception",
    "cognition": "oscillatory_decision_engine",
    "action": "autonomous_creation + api_interaction",
    "evolution": "fitness_optimization + dna_mutation"
  },
  "autonomous_capabilities": [
    "self_modification",
    "reproduction", 
    "learning",
    "creative_generation",
    "environmental_adaptation"
  ],
  "signature": "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐"
}`;

    fs.writeFileSync('test_golem.luciform', golemTest);
    console.log('📁 Créé: test_golem.luciform');
    
    console.log('\n💡 Testez avec: npm run classify-file test_golem.luciform');
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const tester = new ClassifierTester();
  
  async function main() {
    if (args.length === 0) {
      console.log(`
🔍 Luciform Classifier - Classification Intelligente

Usage:
  npm run test-classification                    # Tests tous types
  npm run test-classification file <fichier>    # Classifier un fichier
  npm run test-classification text "<contenu>"  # Classifier un texte
  npm run test-classification demo-parsing      # Démo parsing réponse
  npm run test-classification types             # Voir types reconnus
  npm run test-classification create-tests      # Créer fichiers de test

Exemples:
  npm run test-classification
  npm run test-classification file mon_luciform.json
  npm run test-classification text "{\\"type\\": \\"golem\\", \\"dna\\": {...}}"

⛧ Signature Lurkuitae ⛧
      `);
      return;
    }
    
    try {
      if (args[0] === 'file' && args[1]) {
        await tester.testFile(args[1]);
      } else if (args[0] === 'text' && args[1]) {
        await tester.testClassification(args[1], 'Texte fourni');
      } else if (args[0] === 'demo-parsing') {
        tester.demonstrateResponseParsing();
      } else if (args[0] === 'types') {
        tester.showTypeStatistics();
      } else if (args[0] === 'create-tests') {
        tester.createTestFiles();
      } else {
        await tester.testAllTypes();
        tester.showTypeStatistics();
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }
  
  main();
}
