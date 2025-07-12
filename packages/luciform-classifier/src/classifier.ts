// 🔍 Luciform Classifier - Classification intelligente des types de luciforms
// Détecte le type et génère des prompts de validation spécialisés

export interface LuciformClassification {
  detectedType: LuciformType;
  confidence: number;
  reasoning: string;
  specializedPrompt: string;
  validationCriteria: string[];
  specificMetrics: string[];
  timestamp: Date;
}

export enum LuciformType {
  GOLEM_LUCIFORM = "GOLEM_LUCIFORM",
  SCRYORB_LUCIFORM = "SCRYORB_LUCIFORM", 
  RITUAL_LUCIFORM = "RITUAL_LUCIFORM",
  TOOL_LUCIFORM = "TOOL_LUCIFORM",
  DATA_LUCIFORM = "DATA_LUCIFORM",
  PLAN_LUCIFORM = "PLAN_LUCIFORM",
  GENERIC_LUCIFORM = "GENERIC_LUCIFORM",
  UNKNOWN_LUCIFORM = "UNKNOWN_LUCIFORM"
}

export class LuciformClassifier {
  
  /**
   * Classifie un luciform et génère le prompt de validation spécialisé
   */
  async classifyLuciform(luciformContent: string): Promise<{
    classificationPrompt: string;
    expectedResponse: LuciformClassification;
  }> {
    
    const classificationPrompt = this.generateClassificationPrompt(luciformContent);
    const expectedResponse = this.generateExpectedResponse();
    
    return {
      classificationPrompt,
      expectedResponse
    };
  }

  /**
   * Génère le prompt de classification pour l'IA
   */
  private generateClassificationPrompt(luciformContent: string): string {
    return `🔍 CLASSIFICATION INTELLIGENTE DE LUCIFORM 🔍

⛧ Tu es l'IA Classificatrice de l'écosystème Lurkuitae ⛧

LUCIFORM À CLASSIFIER:
${luciformContent}

MISSION DE CLASSIFICATION:
1. 🧬 ANALYSE le contenu du luciform en profondeur
2. 🎯 DÉTERMINE le type principal parmi ces catégories:

TYPES DE LUCIFORMS RECONNUS:

🧬 **GOLEM_LUCIFORM** - Golem vivant autonome
   Indices: ADN, oscillations, boucle de vie, autonomie, évolution
   Mots-clés: "golem", "dna", "living", "autonomous", "oscillatory", "fitness"

👁️ **SCRYORB_LUCIFORM** - Exploration contextuelle
   Indices: exploration, analyse environnement, découverte, recherche
   Mots-clés: "scry", "explore", "context", "environment", "discovery"

📜 **RITUAL_LUCIFORM** - Rituel ou cérémonie
   Indices: participants, phases, actions rituelles, invocations
   Mots-clés: "ritual", "ceremony", "participants", "invocation", "phases"

🔧 **TOOL_LUCIFORM** - Outil ou utilitaire
   Indices: fonctionnalités, commandes, paramètres, usage technique
   Mots-clés: "tool", "utility", "command", "function", "parameters"

📊 **DATA_LUCIFORM** - Structure de données
   Indices: listes, tableaux, références, métadonnées, stockage
   Mots-clés: "data", "list", "array", "metadata", "storage", "reference"

📋 **PLAN_LUCIFORM** - Plan ou stratégie
   Indices: étapes, objectifs, phases, roadmap, stratégie
   Mots-clés: "plan", "strategy", "phases", "objectives", "roadmap"

🌊 **GENERIC_LUCIFORM** - Luciform générique
   Indices: structure basique, pas de spécialisation claire
   
❓ **UNKNOWN_LUCIFORM** - Type non reconnu
   Indices: structure inhabituelle, contenu non identifiable

3. 🧮 GÉNÈRE un prompt de validation spécialisé pour ce type
4. 📊 DÉFINIS les critères de validation spécifiques
5. 💭 EXPLIQUE ton raisonnement de classification

FORMAT DE RÉPONSE OBLIGATOIRE (JSON strict):
{
  "detectedType": "TYPE_DETECTE",
  "confidence": 0.95,
  "reasoning": "Explication détaillée de la classification",
  "specializedPrompt": "Prompt de validation spécialisé pour ce type",
  "validationCriteria": [
    "Critère 1 spécifique au type",
    "Critère 2 spécifique au type"
  ],
  "specificMetrics": [
    "Métrique 1 à vérifier",
    "Métrique 2 à vérifier"
  ]
}

EXEMPLES DE PROMPTS SPÉCIALISÉS:

Pour GOLEM_LUCIFORM:
"Valide ce golem vivant - vérifie sa boucle de vie, ses métriques oscillatoires, sa capacité d'évolution autonome, ses systèmes de perception/action, et sa structure ADN."

Pour SCRYORB_LUCIFORM:
"Valide cette exploration ScryOrb - vérifie les paramètres d'exploration, la logique de découverte, les critères de recherche, et la structure de résultats."

Pour RITUAL_LUCIFORM:
"Valide ce rituel luciform - vérifie la séquence des phases, la cohérence des participants, la logique des invocations, et la structure cérémonielle."

⚡ CLASSIFIE MAINTENANT ! ⚡
Signature Lurkuitae: ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐`;
  }

  /**
   * Génère la structure de réponse attendue
   */
  private generateExpectedResponse(): LuciformClassification {
    return {
      detectedType: LuciformType.UNKNOWN_LUCIFORM,
      confidence: 0,
      reasoning: "Template de réponse attendue",
      specializedPrompt: "Prompt spécialisé généré par l'IA",
      validationCriteria: ["Critères de validation"],
      specificMetrics: ["Métriques à vérifier"],
      timestamp: new Date()
    };
  }

  /**
   * Parse une réponse de classification
   */
  parseClassificationResponse(jsonResponse: string): LuciformClassification {
    try {
      const parsed = JSON.parse(jsonResponse);
      
      return {
        detectedType: parsed.detectedType as LuciformType,
        confidence: parsed.confidence || 0,
        reasoning: parsed.reasoning || "Aucune explication",
        specializedPrompt: parsed.specializedPrompt || "Prompt non généré",
        validationCriteria: parsed.validationCriteria || [],
        specificMetrics: parsed.specificMetrics || [],
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`Erreur parsing classification: ${error}`);
    }
  }

  /**
   * Analyse un fichier luciform
   */
  async classifyFile(filePath: string): Promise<{
    classificationPrompt: string;
    originalContent: string;
  }> {
    const fs = await import('fs');
    
    try {
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      const result = await this.classifyLuciform(originalContent);
      
      return {
        classificationPrompt: result.classificationPrompt,
        originalContent
      };
    } catch (error) {
      throw new Error(`Erreur lecture fichier ${filePath}: ${error}`);
    }
  }

  /**
   * Sauvegarde les résultats de classification
   */
  saveClassification(
    classification: LuciformClassification,
    originalContent: string,
    outputPath?: string
  ): string {
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultPath = `classification_${timestamp}.json`;
    const savePath = outputPath || defaultPath;
    
    const results = {
      classification,
      originalContent,
      timestamp: new Date(),
      signature: "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐"
    };
    
    fs.writeFileSync(savePath, JSON.stringify(results, null, 2));
    return savePath;
  }

  /**
   * Affiche les résultats de classification
   */
  displayClassification(classification: LuciformClassification): void {
    console.log('\n🔍 RÉSULTATS DE CLASSIFICATION');
    console.log('═'.repeat(60));
    
    // Emoji selon le type
    const typeEmojis: Record<LuciformType, string> = {
      [LuciformType.GOLEM_LUCIFORM]: '🧬',
      [LuciformType.SCRYORB_LUCIFORM]: '👁️',
      [LuciformType.RITUAL_LUCIFORM]: '📜',
      [LuciformType.TOOL_LUCIFORM]: '🔧',
      [LuciformType.DATA_LUCIFORM]: '📊',
      [LuciformType.PLAN_LUCIFORM]: '📋',
      [LuciformType.GENERIC_LUCIFORM]: '🌊',
      [LuciformType.UNKNOWN_LUCIFORM]: '❓'
    };
    
    const emoji = typeEmojis[classification.detectedType] || '❓';
    
    console.log(`${emoji} Type détecté: ${classification.detectedType}`);
    console.log(`🎯 Confiance: ${(classification.confidence * 100).toFixed(1)}%`);
    console.log(`💭 Raisonnement: ${classification.reasoning}`);
    
    console.log('\n📋 CRITÈRES DE VALIDATION:');
    classification.validationCriteria.forEach((criteria, index) => {
      console.log(`   ${index + 1}. ${criteria}`);
    });
    
    console.log('\n📊 MÉTRIQUES SPÉCIFIQUES:');
    classification.specificMetrics.forEach((metric, index) => {
      console.log(`   ${index + 1}. ${metric}`);
    });
    
    console.log('\n🔥 PROMPT DE VALIDATION SPÉCIALISÉ:');
    console.log('─'.repeat(60));
    console.log(classification.specializedPrompt);
    console.log('─'.repeat(60));
    
    // Recommandations d'usage
    console.log('\n💡 RECOMMANDATIONS:');
    if (classification.confidence > 0.8) {
      console.log('✅ Classification très fiable - utilisez le prompt spécialisé');
    } else if (classification.confidence > 0.6) {
      console.log('⚠️ Classification modérée - vérifiez le prompt généré');
    } else {
      console.log('❌ Classification incertaine - validation manuelle recommandée');
    }
  }

  /**
   * Obtient des statistiques sur les types de luciforms
   */
  getTypeStatistics(): Record<LuciformType, string> {
    return {
      [LuciformType.GOLEM_LUCIFORM]: "Golems vivants autonomes avec boucles de vie",
      [LuciformType.SCRYORB_LUCIFORM]: "Explorations contextuelles et découvertes",
      [LuciformType.RITUAL_LUCIFORM]: "Rituels et cérémonies structurées",
      [LuciformType.TOOL_LUCIFORM]: "Outils et utilitaires techniques",
      [LuciformType.DATA_LUCIFORM]: "Structures de données et métadonnées",
      [LuciformType.PLAN_LUCIFORM]: "Plans et stratégies organisationnelles",
      [LuciformType.GENERIC_LUCIFORM]: "Luciforms génériques sans spécialisation",
      [LuciformType.UNKNOWN_LUCIFORM]: "Types non reconnus ou inhabituels"
    };
  }
}
