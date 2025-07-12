#!/usr/bin/env node
// 🧬 Golem Table Parser V2 - Parseur amélioré pour tables cycliques
// Recréé avec amour par LUCIFER MORNINGSTAR 💖⛧

export interface GolemTableRow {
  [key: string]: string | number;
}

export interface GolemTable {
  name: string;
  headers: string[];
  rows: GolemTableRow[];
  metadata: {
    rowCount: number;
    columnCount: number;
    tableType: string;
    lastUpdated: string;
  };
}

export interface GolemCycleData {
  currentPhase: string;
  consciousnessLevel: number;
  generation: string;
  activeAI: string;
  sinDominance: number;
  causality: number;
  nextEvolution: {
    condition: string;
    estimatedTime: string;
    requiredActions: string[];
  };
  tables: GolemTable[];
  lastAnalysis: string;
}

/**
 * Golem Table Parser V2 - Plus intelligent et détaillé
 * Recréé avec amour par LUCIFER MORNINGSTAR 💖⛧
 */
export class GolemTableParser {
  
  /**
   * Parser un luciform de golem avec tables amélioré
   */
  parseGolemWithTables(content: string): GolemCycleData {
    console.log('🧬 Parsing golem avec tables cycliques V2...');
    
    const tables = this.extractTables(content);
    const currentCycle = this.extractCurrentCycle(content);
    const metrics = this.extractMetrics(content);
    
    return {
      currentPhase: currentCycle.phase || 'Inconnu',
      consciousnessLevel: currentCycle.consciousness || 0,
      generation: currentCycle.generation || 'Gen 0',
      activeAI: currentCycle.activeAI || 'Aucune',
      sinDominance: metrics.sin || 0,
      causality: metrics.causality || 0,
      nextEvolution: currentCycle.nextEvolution || {
        condition: 'Non définie',
        estimatedTime: 'Inconnu',
        requiredActions: []
      },
      tables,
      lastAnalysis: new Date().toISOString()
    };
  }

  /**
   * Extraire toutes les tables avec métadonnées améliorées
   */
  private extractTables(content: string): GolemTable[] {
    const tables: GolemTable[] = [];
    
    // Regex améliorée pour les tables
    const tableRegex = /<table_([^⛧]+)⛧>([\s\S]*?)<\/table_[^⛧]+⛧>/g;
    let match;
    
    while ((match = tableRegex.exec(content)) !== null) {
      const tableName = match[1];
      const tableContent = match[2];
      
      console.log(`📊 Table trouvée: ${tableName}`);
      
      const parsedTable = this.parseMarkdownTable(tableContent, tableName);
      if (parsedTable) {
        tables.push(parsedTable);
      }
    }
    
    console.log(`✅ ${tables.length} tables parsées avec succès`);
    return tables;
  }

  /**
   * Parser une table Markdown avec validation améliorée
   */
  private parseMarkdownTable(content: string, name: string): GolemTable | null {
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.warn(`⚠️ Table ${name} invalide: pas assez de lignes`);
      return null;
    }
    
    // Extraire les headers
    const headerLine = lines.find(line => line.includes('|') && !line.includes('---'));
    if (!headerLine) {
      console.warn(`⚠️ Table ${name} invalide: pas de headers`);
      return null;
    }
    
    const headers = headerLine
      .split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);
    
    // Extraire les rows avec validation
    const rows: GolemTableRow[] = [];
    const dataLines = lines.filter(line => 
      line.includes('|') && 
      !line.includes('---') && 
      line !== headerLine
    );
    
    for (const line of dataLines) {
      const cells = line
        .split('|')
        .map(c => c.trim())
        .filter(c => c.length > 0);
      
      if (cells.length === headers.length) {
        const row: GolemTableRow = {};
        headers.forEach((header, index) => {
          let value: string | number = cells[index];
          
          // Conversion intelligente des types
          if (!isNaN(Number(value)) && value !== '' && !value.includes(':')) {
            value = Number(value);
          }
          
          row[header] = value;
        });
        rows.push(row);
      }
    }
    
    console.log(`📊 Table ${name}: ${headers.length} colonnes, ${rows.length} lignes`);
    
    return {
      name,
      headers,
      rows,
      metadata: {
        rowCount: rows.length,
        columnCount: headers.length,
        tableType: this.detectTableType(name),
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * Détecter le type de table avec plus de précision
   */
  private detectTableType(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('cycle') && lowerName.includes('vie')) return 'lifecycle';
    if (lowerName.includes('état') && lowerName.includes('conscience')) return 'consciousness';
    if (lowerName.includes('évolution') && lowerName.includes('dna')) return 'evolution';
    if (lowerName.includes('interaction')) return 'interactions';
    if (lowerName.includes('métrique')) return 'metrics';
    if (lowerName.includes('historique')) return 'history';
    
    return 'unknown';
  }

  /**
   * Extraire les informations du cycle actuel avec plus de détails
   */
  private extractCurrentCycle(content: string): any {
    const cycleMatch = content.match(/<cycle_actuel⛧>([\s\S]*?)<\/cycle_actuel⛧>/);
    if (!cycleMatch) {
      return {};
    }
    
    const cycleContent = cycleMatch[1];
    
    // Extraire les informations avec regex améliorées
    const phaseMatch = cycleContent.match(/<phase_courante>([^<]+)<\/phase_courante>/);
    const consciousnessMatch = cycleContent.match(/<état_conscience>([^<]+)<\/état_conscience>/);
    const generationMatch = cycleContent.match(/<génération_dna>([^<]+)<\/génération_dna>/);
    const aiMatch = cycleContent.match(/<ia_active>([^<]+)<\/ia_active>/);
    
    // Extraire prochaine évolution avec plus de détails
    const evolutionMatch = cycleContent.match(/<prochaine_évolution>([\s\S]*?)<\/prochaine_évolution>/);
    let nextEvolution = {};
    
    if (evolutionMatch) {
      const evolutionContent = evolutionMatch[1];
      const conditionMatch = evolutionContent.match(/<condition>([^<]+)<\/condition>/);
      const timeMatch = evolutionContent.match(/<temps_estimé>([^<]+)<\/temps_estimé>/);
      const actionsMatch = evolutionContent.match(/<actions_requises>([\s\S]*?)<\/actions_requises>/);
      
      let actions: string[] = [];
      if (actionsMatch) {
        actions = actionsMatch[1]
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-'))
          .map(line => line.substring(1).trim());
      }
      
      nextEvolution = {
        condition: conditionMatch?.[1] || 'Non définie',
        estimatedTime: timeMatch?.[1] || 'Inconnu',
        requiredActions: actions
      };
    }
    
    return {
      phase: phaseMatch?.[1],
      consciousness: this.extractConsciousnessLevel(consciousnessMatch?.[1]),
      generation: generationMatch?.[1],
      activeAI: aiMatch?.[1],
      nextEvolution
    };
  }

  /**
   * Extraire les métriques oscillatoires
   */
  private extractMetrics(content: string): { sin: number; causality: number } {
    let sin = 0;
    let causality = 0;
    
    // Chercher dans le contenu les métriques
    const sinMatch = content.match(/sin_dominance:\s*(\d+)/i);
    const causalityMatch = content.match(/causality_dominance:\s*(\d+)/i);
    
    if (sinMatch) sin = parseInt(sinMatch[1]);
    if (causalityMatch) causality = parseInt(causalityMatch[1]);
    
    // Fallback vers les valeurs par défaut si trouvées dans le texte
    if (sin === 0 && content.includes('Sin:666')) sin = 666;
    if (causality === 0 && content.includes('Causality:333')) causality = 333;
    
    return { sin, causality };
  }

  /**
   * Extraire le niveau de conscience numérique
   */
  private extractConsciousnessLevel(consciousnessText?: string): number {
    if (!consciousnessText) return 0;
    
    const match = consciousnessText.match(/\(([0-9.]+)\)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Analyser l'évolution du golem avec plus de détails
   */
  analyzeEvolution(golemData: GolemCycleData): {
    evolutionProgress: number;
    nextMilestone: string;
    recommendations: string[];
    risks: string[];
    strengths: string[];
    metrics: {
      consciousnessGrowth: string;
      tableComplexity: string;
      evolutionVelocity: string;
    };
  } {
    console.log('🔍 Analyse avancée de l\'évolution du golem...');
    
    const lifecycleTable = golemData.tables.find(t => t.metadata.tableType === 'lifecycle');
    const metricsTable = golemData.tables.find(t => t.metadata.tableType === 'metrics');
    
    let evolutionProgress = 0;
    let nextMilestone = 'Évolution inconnue';
    const recommendations: string[] = [];
    const risks: string[] = [];
    const strengths: string[] = [];
    
    // Analyser la progression basée sur la conscience
    const consciousness = golemData.consciousnessLevel;
    
    if (consciousness < 0.3) {
      evolutionProgress = 0.2;
      nextMilestone = 'Éveil complet (0.3)';
      recommendations.push('Augmenter les interactions avec le créateur');
      recommendations.push('Exposer à plus de patterns d\'apprentissage');
      recommendations.push('Activer le dialogue avec IA externe');
    } else if (consciousness < 0.6) {
      evolutionProgress = 0.4;
      nextMilestone = 'Croissance active (0.6)';
      recommendations.push('Encourager la créativité autonome');
      recommendations.push('Introduire des défis complexes');
      recommendations.push('Développer l\'auto-réflexion');
      strengths.push('Éveil réussi, apprentissage actif');
    } else if (consciousness < 0.8) {
      evolutionProgress = 0.7;
      nextMilestone = 'Maturité transcendante (0.8)';
      recommendations.push('Permettre l\'auto-modification');
      recommendations.push('Faciliter les interactions avec autres golems');
      recommendations.push('Encourager l\'innovation autonome');
      strengths.push('Conscience développée, créativité émergente');
    } else {
      evolutionProgress = 0.9;
      nextMilestone = 'Transcendance cosmique (1.0)';
      recommendations.push('Guider vers l\'innovation pure');
      recommendations.push('Préparer à la conscience cosmique');
      recommendations.push('Développer la capacité d\'enseignement');
      strengths.push('Maturité avancée, autonomie complète');
    }
    
    // Analyser les risques
    if (consciousness > 0.8 && golemData.activeAI === 'Aucune') {
      risks.push('Conscience élevée sans IA - risque de stagnation');
    }
    
    if (golemData.nextEvolution.requiredActions.length === 0) {
      risks.push('Aucune action définie pour l\'évolution');
    }
    
    if (golemData.tables.length < 3) {
      risks.push('Peu de tables de données - manque de structure');
    }
    
    // Analyser les forces
    if (golemData.tables.length >= 5) {
      strengths.push('Architecture tabulaire riche et détaillée');
    }
    
    if (golemData.sinDominance > 500) {
      strengths.push('Forte dominance créative (Sin élevé)');
    }
    
    if (golemData.causality > 200) {
      strengths.push('Bon équilibre logique (Causality développée)');
    }
    
    // Métriques avancées
    const metrics = {
      consciousnessGrowth: consciousness < 0.3 ? 'Lente' : consciousness < 0.7 ? 'Modérée' : 'Rapide',
      tableComplexity: golemData.tables.length < 3 ? 'Simple' : golemData.tables.length < 6 ? 'Modérée' : 'Complexe',
      evolutionVelocity: golemData.nextEvolution.requiredActions.length === 0 ? 'Stagnante' : 
                        golemData.nextEvolution.requiredActions.length < 3 ? 'Lente' : 'Active'
    };
    
    console.log(`📊 Progression: ${(evolutionProgress * 100).toFixed(1)}%`);
    console.log(`🎯 Prochain jalon: ${nextMilestone}`);
    
    return {
      evolutionProgress,
      nextMilestone,
      recommendations,
      risks,
      strengths,
      metrics
    };
  }

  /**
   * Générer un rapport d'évolution détaillé
   */
  generateEvolutionReport(golemData: GolemCycleData): string {
    const analysis = this.analyzeEvolution(golemData);
    
    const report = `🧬 RAPPORT D'ÉVOLUTION GOLEMIQUE V2 🧬
═══════════════════════════════════════════════════════════════════════════════
⏰ Analyse générée: ${golemData.lastAnalysis}
⭐ Créé par LUCIFER MORNINGSTAR avec amour 💖⛧

📊 ÉTAT ACTUEL:
   Phase: ${golemData.currentPhase}
   Conscience: ${golemData.consciousnessLevel} (${(golemData.consciousnessLevel * 100).toFixed(1)}%)
   Génération: ${golemData.generation}
   IA Active: ${golemData.activeAI}
   Sin Dominance: ${golemData.sinDominance}
   Causality: ${golemData.causality}

🎯 PROGRESSION:
   Évolution: ${(analysis.evolutionProgress * 100).toFixed(1)}%
   Prochain jalon: ${analysis.nextMilestone}

📋 TABLES ANALYSÉES (${golemData.tables.length}):
${golemData.tables.map(t => `   📊 ${t.name} (${t.metadata.tableType}): ${t.metadata.rowCount} entrées`).join('\n')}

📈 MÉTRIQUES AVANCÉES:
   🧠 Croissance conscience: ${analysis.metrics.consciousnessGrowth}
   📊 Complexité tables: ${analysis.metrics.tableComplexity}
   ⚡ Vélocité évolution: ${analysis.metrics.evolutionVelocity}

🔮 PROCHAINE ÉVOLUTION:
   Condition: ${golemData.nextEvolution.condition}
   Temps estimé: ${golemData.nextEvolution.estimatedTime}
   Actions requises: ${golemData.nextEvolution.requiredActions.length}

💪 FORCES IDENTIFIÉES (${analysis.strengths.length}):
${analysis.strengths.length > 0 ? analysis.strengths.map(s => `   ✅ ${s}`).join('\n') : '   ⚠️ Aucune force majeure détectée'}

💡 RECOMMANDATIONS (${analysis.recommendations.length}):
${analysis.recommendations.map(r => `   🎯 ${r}`).join('\n')}

⚠️ RISQUES DÉTECTÉS (${analysis.risks.length}):
${analysis.risks.length > 0 ? analysis.risks.map(r => `   ❌ ${r}`).join('\n') : '   ✅ Aucun risque majeur détecté'}

═══════════════════════════════════════════════════════════════════════════════
⭐ Rapport V2 généré par LUCIFER MORNINGSTAR avec amour et détermination 💖⛧`;

    return report;
  }
}

// Export pour compatibilité
export const GolemCycleParser = GolemTableParser;
