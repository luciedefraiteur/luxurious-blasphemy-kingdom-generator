// 🌀 Moteur Oscillatoire - Sin/Cos Métriques pour l'Écosystème Lurkuitae
// Système de métriques créatives basé sur les oscillations mathématiques

export interface OscillatoryMetrics {
  // Métriques de base
  sin_transgression: number;      // 0-1, audace créative
  sin_boundaries: number;         // 0-1, limites conventionnelles  
  cos_coherence: number;          // -1 à 1, cohérence temporelle
  causal_strength: number;        // 0-1, force causale
  
  // Métriques dérivées
  sin_ratio: number;              // sin_transgression / sin_boundaries
  cos_causality: number;          // cos_coherence / causal_strength
  
  // Oscillations temporelles
  phase: number;                  // 0-2π, phase actuelle
  frequency: number;              // Hz, fréquence d'oscillation
  amplitude: number;              // 0-1, amplitude créative
  
  // Métadonnées
  timestamp: Date;
  golem_id: string;
  signature_lurkuitae: string;
}

export interface GolemOscillationProfile {
  golem_id: string;
  archetype: string;
  base_frequency: number;         // Fréquence naturelle du golem
  resonance_patterns: number[];   // Harmoniques préférées
  sin_preference: number;         // Tendance vers transgression (0-1)
  cos_preference: number;         // Tendance vers cohérence (0-1)
  evolution_rate: number;         // Vitesse d'adaptation des métriques
}

export interface FamilyResonance {
  family_id: string;
  collective_phase: number;       // Phase collective de la famille
  harmony_index: number;          // 0-1, harmonie entre golems
  creative_tension: number;       // 0-1, tension créative productive
  emergence_potential: number;    // 0-1, potentiel d'émergence
}

export class OscillatoryEngine {
  private profiles: Map<string, GolemOscillationProfile> = new Map();
  private metrics_history: Map<string, OscillatoryMetrics[]> = new Map();
  
  constructor() {
    this.initializeArchetypeProfiles();
  }

  /**
   * Initialise les profils oscillatoires par archétype
   */
  private initializeArchetypeProfiles(): void {
    // Poète Cosmique - Haute créativité, cohérence narrative
    this.profiles.set('CREATIVE_SCRIBE', {
      golem_id: 'CREATIVE_SCRIBE',
      archetype: 'CREATIVE_SCRIBE',
      base_frequency: 0.8,
      resonance_patterns: [1.0, 1.618, 2.0], // Harmoniques dorées
      sin_preference: 0.8,
      cos_preference: 0.6,
      evolution_rate: 0.3
    });

    // Oracle Sage - Équilibre sagesse/innovation
    this.profiles.set('WISE_ORACLE', {
      golem_id: 'WISE_ORACLE', 
      archetype: 'WISE_ORACLE',
      base_frequency: 0.5,
      resonance_patterns: [0.5, 1.0, 1.5], // Harmoniques stables
      sin_preference: 0.6,
      cos_preference: 0.9,
      evolution_rate: 0.2
    });

    // Gardien Aimant - Stabilité et protection
    this.profiles.set('LOVING_GUARDIAN', {
      golem_id: 'LOVING_GUARDIAN',
      archetype: 'LOVING_GUARDIAN', 
      base_frequency: 0.3,
      resonance_patterns: [0.25, 0.5, 0.75], // Harmoniques protectrices
      sin_preference: 0.4,
      cos_preference: 0.95,
      evolution_rate: 0.1
    });

    // Tisseur Chaotique - Chaos créatif maximal
    this.profiles.set('CHAOTIC_WEAVER', {
      golem_id: 'CHAOTIC_WEAVER',
      archetype: 'CHAOTIC_WEAVER',
      base_frequency: 1.2,
      resonance_patterns: [0.666, 1.333, 2.666], // Harmoniques chaotiques
      sin_preference: 0.95,
      cos_preference: 0.3,
      evolution_rate: 0.5
    });
  }

  /**
   * Calcule le ratio sin/sin (transgression créative)
   */
  calculateSinRatio(transgression: number, boundaries: number): number {
    // Éviter division par zéro
    const safe_boundaries = Math.max(boundaries, 0.001);
    return Math.sin(transgression * Math.PI) / Math.sin(safe_boundaries * Math.PI);
  }

  /**
   * Calcule le ratio cos/causalité (cohérence causale)
   */
  calculateCosCausality(coherence: number, causality: number): number {
    // Éviter division par zéro
    const safe_causality = Math.max(causality, 0.001);
    return Math.cos(coherence * Math.PI) / safe_causality;
  }

  /**
   * Met à jour la phase oscillatoire
   */
  updatePhase(currentPhase: number, frequency: number, deltaTime: number): number {
    return (currentPhase + 2 * Math.PI * frequency * deltaTime) % (2 * Math.PI);
  }

  /**
   * Calcule l'amplitude créative basée sur les métriques
   */
  calculateAmplitude(sinRatio: number, cosCausality: number): number {
    // Amplitude = équilibre entre transgression et cohérence
    return Math.sqrt(sinRatio * sinRatio + cosCausality * cosCausality) / Math.sqrt(2);
  }

  /**
   * Génère des métriques oscillatoires pour un golem
   */
  generateMetrics(
    golemId: string, 
    context: {
      mission_complexity: number;
      creative_pressure: number;
      stability_requirement: number;
      time_constraint: number;
    }
  ): OscillatoryMetrics {
    const profile = this.profiles.get(golemId);
    if (!profile) {
      throw new Error(`Profil oscillatoire introuvable pour golem: ${golemId}`);
    }

    // Calculs de base influencés par le contexte et le profil
    const sin_transgression = Math.min(1.0, 
      profile.sin_preference * context.creative_pressure * 
      (1 + 0.3 * Math.sin(Date.now() * profile.base_frequency / 1000))
    );

    const sin_boundaries = Math.max(0.1,
      context.stability_requirement * (1 - profile.sin_preference) *
      (1 + 0.2 * Math.cos(Date.now() * profile.base_frequency / 1000))
    );

    const cos_coherence = profile.cos_preference * 
      (2 * context.stability_requirement - 1) *
      Math.cos(Date.now() * profile.base_frequency / 2000);

    const causal_strength = Math.min(1.0,
      context.mission_complexity * profile.cos_preference *
      (1 - 0.1 * context.time_constraint)
    );

    // Métriques dérivées
    const sin_ratio = this.calculateSinRatio(sin_transgression, sin_boundaries);
    const cos_causality = this.calculateCosCausality(cos_coherence, causal_strength);

    // Oscillations temporelles
    const phase = (Date.now() * profile.base_frequency / 1000) % (2 * Math.PI);
    const amplitude = this.calculateAmplitude(sin_ratio, cos_causality);

    const metrics: OscillatoryMetrics = {
      sin_transgression,
      sin_boundaries,
      cos_coherence,
      causal_strength,
      sin_ratio,
      cos_causality,
      phase,
      frequency: profile.base_frequency,
      amplitude,
      timestamp: new Date(),
      golem_id: golemId,
      signature_lurkuitae: "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐"
    };

    // Stocker dans l'historique
    if (!this.metrics_history.has(golemId)) {
      this.metrics_history.set(golemId, []);
    }
    this.metrics_history.get(golemId)!.push(metrics);

    // Garder seulement les 100 dernières métriques
    const history = this.metrics_history.get(golemId)!;
    if (history.length > 100) {
      history.shift();
    }

    return metrics;
  }

  /**
   * Calcule la résonance familiale entre tous les golems
   */
  calculateFamilyResonance(golemIds: string[]): FamilyResonance {
    const currentMetrics = golemIds.map(id => {
      const history = this.metrics_history.get(id);
      return history ? history[history.length - 1] : null;
    }).filter(m => m !== null) as OscillatoryMetrics[];

    if (currentMetrics.length === 0) {
      throw new Error("Aucune métrique disponible pour calculer la résonance familiale");
    }

    // Phase collective (moyenne pondérée des phases)
    const collective_phase = currentMetrics.reduce((sum, m) => 
      sum + m.phase * m.amplitude, 0
    ) / currentMetrics.reduce((sum, m) => sum + m.amplitude, 0);

    // Index d'harmonie (cohérence des oscillations)
    const phase_variance = currentMetrics.reduce((sum, m) => 
      sum + Math.pow(m.phase - collective_phase, 2), 0
    ) / currentMetrics.length;
    const harmony_index = Math.exp(-phase_variance); // 0-1, 1 = parfaite harmonie

    // Tension créative (équilibre sin/cos collectif)
    const avg_sin_ratio = currentMetrics.reduce((sum, m) => sum + m.sin_ratio, 0) / currentMetrics.length;
    const avg_cos_causality = currentMetrics.reduce((sum, m) => sum + m.cos_causality, 0) / currentMetrics.length;
    const creative_tension = Math.abs(avg_sin_ratio - avg_cos_causality) / 2;

    // Potentiel d'émergence (combinaison amplitude et diversité)
    const avg_amplitude = currentMetrics.reduce((sum, m) => sum + m.amplitude, 0) / currentMetrics.length;
    const amplitude_diversity = Math.sqrt(
      currentMetrics.reduce((sum, m) => sum + Math.pow(m.amplitude - avg_amplitude, 2), 0) / currentMetrics.length
    );
    const emergence_potential = avg_amplitude * (1 + amplitude_diversity);

    return {
      family_id: "LURKUITAE_FAMILY",
      collective_phase,
      harmony_index,
      creative_tension,
      emergence_potential: Math.min(1.0, emergence_potential)
    };
  }

  /**
   * Détecte les patterns d'émergence créative
   */
  detectEmergencePatterns(golemId: string): {
    is_emerging: boolean;
    emergence_type: string;
    confidence: number;
    recommendations: string[];
  } {
    const history = this.metrics_history.get(golemId);
    if (!history || history.length < 10) {
      return {
        is_emerging: false,
        emergence_type: "insufficient_data",
        confidence: 0,
        recommendations: ["Collecter plus de données oscillatoires"]
      };
    }

    const recent = history.slice(-10);
    
    // Détection de tendances
    const sin_trend = this.calculateTrend(recent.map(m => m.sin_ratio));
    const cos_trend = this.calculateTrend(recent.map(m => m.cos_causality));
    const amplitude_trend = this.calculateTrend(recent.map(m => m.amplitude));

    // Patterns d'émergence
    let emergence_type = "stable";
    let confidence = 0;
    const recommendations: string[] = [];

    if (sin_trend > 0.1 && amplitude_trend > 0.05) {
      emergence_type = "creative_breakthrough";
      confidence = Math.min(1.0, sin_trend + amplitude_trend);
      recommendations.push("Amplifier les capacités créatives");
      recommendations.push("Documenter les innovations émergentes");
    } else if (cos_trend > 0.1 && sin_trend < -0.05) {
      emergence_type = "wisdom_consolidation";
      confidence = Math.min(1.0, cos_trend - sin_trend);
      recommendations.push("Capitaliser sur la stabilité acquise");
      recommendations.push("Partager la sagesse avec la famille");
    } else if (amplitude_trend > 0.1) {
      emergence_type = "power_amplification";
      confidence = amplitude_trend;
      recommendations.push("Canaliser l'énergie croissante");
      recommendations.push("Surveiller l'équilibre sin/cos");
    }

    return {
      is_emerging: confidence > 0.3,
      emergence_type,
      confidence,
      recommendations
    };
  }

  /**
   * Calcule la tendance d'une série de valeurs
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const x_mean = (n - 1) / 2;
    const y_mean = values.reduce((sum, v) => sum + v, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      const x_diff = i - x_mean;
      numerator += x_diff * (values[i] - y_mean);
      denominator += x_diff * x_diff;
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Obtient l'historique des métriques pour un golem
   */
  getMetricsHistory(golemId: string): OscillatoryMetrics[] {
    return this.metrics_history.get(golemId) || [];
  }

  /**
   * Obtient le profil oscillatoire d'un golem
   */
  getProfile(golemId: string): GolemOscillationProfile | undefined {
    return this.profiles.get(golemId);
  }
}
