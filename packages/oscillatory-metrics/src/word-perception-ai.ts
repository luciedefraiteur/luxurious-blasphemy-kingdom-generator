// 🌀 IA Perceptrice de Sin/Causalité des Mots
// Intelligence artificielle qui ressent les oscillations numériques des mots

export interface WordPerception {
  word: string;
  sin_value: number;        // 0-1, transgression/audace du mot
  causality_value: number;  // 0-1, force causale/stabilité du mot
  confidence: number;       // 0-1, confiance dans la perception
  reasoning: string;        // Explication du ressenti
  timestamp: Date;
}

export interface PerceptionContext {
  language: string;
  domain: string;          // "creative", "technical", "emotional", etc.
  cultural_context: string;
  previous_words: string[]; // Contexte des mots précédents
}

export class WordPerceptionAI {
  private perceptionHistory: WordPerception[] = [];
  
  /**
   * Analyse un mot et retourne sa perception Sin/Causalité
   */
  async perceiveWord(
    word: string, 
    context: PerceptionContext = this.getDefaultContext()
  ): Promise<WordPerception> {
    
    // Analyse multi-dimensionnelle du mot
    const phonetic_analysis = this.analyzePhonetics(word);
    const semantic_analysis = this.analyzeSemantics(word, context);
    const morphological_analysis = this.analyzeMorphology(word);
    const cultural_analysis = this.analyzeCulturalResonance(word, context);
    const intuitive_analysis = this.analyzeIntuitive(word);
    
    // Calcul du Sin (transgression/audace)
    const sin_components = {
      phonetic_disruption: phonetic_analysis.disruption_level,
      semantic_transgression: semantic_analysis.transgression_level,
      morphological_innovation: morphological_analysis.innovation_level,
      cultural_rebellion: cultural_analysis.rebellion_level,
      intuitive_chaos: intuitive_analysis.chaos_level
    };
    
    const sin_value = this.calculateSinValue(sin_components);
    
    // Calcul de la Causalité (stabilité/cohérence)
    const causality_components = {
      phonetic_stability: phonetic_analysis.stability_level,
      semantic_coherence: semantic_analysis.coherence_level,
      morphological_structure: morphological_analysis.structure_level,
      cultural_grounding: cultural_analysis.grounding_level,
      intuitive_order: intuitive_analysis.order_level
    };
    
    const causality_value = this.calculateCausalityValue(causality_components);
    
    // Génération du raisonnement
    const reasoning = this.generateReasoning(word, sin_components, causality_components);
    
    // Calcul de la confiance
    const confidence = this.calculateConfidence(sin_value, causality_value, context);
    
    const perception: WordPerception = {
      word,
      sin_value,
      causality_value,
      confidence,
      reasoning,
      timestamp: new Date()
    };
    
    // Stocker dans l'historique
    this.perceptionHistory.push(perception);
    if (this.perceptionHistory.length > 1000) {
      this.perceptionHistory.shift();
    }
    
    return perception;
  }

  /**
   * Analyse phonétique du mot
   */
  private analyzePhonetics(word: string): {
    disruption_level: number;
    stability_level: number;
  } {
    const consonant_clusters = (word.match(/[bcdfghjklmnpqrstvwxyz]{2,}/gi) || []).length;
    const vowel_patterns = (word.match(/[aeiou]{2,}/gi) || []).length;
    const harsh_sounds = (word.match(/[kqxz]/gi) || []).length;
    const soft_sounds = (word.match(/[lmnr]/gi) || []).length;
    const length_factor = Math.min(word.length / 10, 1);
    
    // Disruption = sons durs + clusters + longueur
    const disruption_level = Math.min(1, 
      (harsh_sounds * 0.3 + consonant_clusters * 0.4 + length_factor * 0.3)
    );
    
    // Stabilité = sons doux + patterns réguliers
    const stability_level = Math.min(1,
      (soft_sounds * 0.4 + (word.length - vowel_patterns) * 0.1 + 0.5)
    );
    
    return { disruption_level, stability_level };
  }

  /**
   * Analyse sémantique contextuelle
   */
  private analyzeSemantics(word: string, context: PerceptionContext): {
    transgression_level: number;
    coherence_level: number;
  } {
    // Mots transgressifs par nature
    const transgressive_patterns = [
      /chaos|rebel|break|destroy|wild|mad|crazy|insane/i,
      /revolution|anarchy|disorder|mayhem|havoc/i,
      /forbidden|taboo|secret|hidden|dark/i
    ];
    
    // Mots de cohérence/stabilité
    const coherent_patterns = [
      /order|structure|system|logic|reason|stable/i,
      /harmony|balance|peace|calm|serene|gentle/i,
      /tradition|classic|standard|normal|regular/i
    ];
    
    let transgression_level = 0.3; // Base neutre
    let coherence_level = 0.5; // Base neutre
    
    // Analyse des patterns transgressifs
    transgressive_patterns.forEach(pattern => {
      if (pattern.test(word)) {
        transgression_level += 0.2;
      }
    });
    
    // Analyse des patterns cohérents
    coherent_patterns.forEach(pattern => {
      if (pattern.test(word)) {
        coherence_level += 0.2;
      }
    });
    
    // Ajustement contextuel
    if (context.domain === 'creative') {
      transgression_level *= 1.2;
    } else if (context.domain === 'technical') {
      coherence_level *= 1.3;
    }
    
    return {
      transgression_level: Math.min(1, transgression_level),
      coherence_level: Math.min(1, coherence_level)
    };
  }

  /**
   * Analyse morphologique
   */
  private analyzeMorphology(word: string): {
    innovation_level: number;
    structure_level: number;
  } {
    // Préfixes/suffixes innovants
    const innovative_morphemes = /^(cyber|meta|ultra|hyper|neo|pseudo|anti|counter)/i;
    const innovative_suffixes = /(ism|ology|ification|ization|esque)$/i;
    
    // Structure classique
    const classic_structure = /^[a-z]+$/i;
    const compound_structure = word.includes('-') || /[A-Z]/.test(word.slice(1));
    
    let innovation_level = 0.2;
    let structure_level = 0.6;
    
    if (innovative_morphemes.test(word) || innovative_suffixes.test(word)) {
      innovation_level += 0.4;
    }
    
    if (classic_structure.test(word) && !compound_structure) {
      structure_level += 0.3;
    }
    
    // Mots inventés/néologismes (heuristique simple)
    if (word.length > 12 || /[xyz]{2,}|[qw]{2,}/i.test(word)) {
      innovation_level += 0.3;
      structure_level -= 0.2;
    }
    
    return {
      innovation_level: Math.min(1, innovation_level),
      structure_level: Math.max(0, Math.min(1, structure_level))
    };
  }

  /**
   * Analyse de résonance culturelle
   */
  private analyzeCulturalResonance(word: string, context: PerceptionContext): {
    rebellion_level: number;
    grounding_level: number;
  } {
    // Mots de rébellion culturelle
    const rebellion_words = [
      'punk', 'goth', 'emo', 'grunge', 'underground',
      'alternative', 'subversive', 'radical', 'extreme'
    ];
    
    // Mots d'ancrage culturel
    const grounding_words = [
      'family', 'home', 'tradition', 'heritage', 'classic',
      'timeless', 'eternal', 'sacred', 'blessed'
    ];
    
    let rebellion_level = 0.1;
    let grounding_level = 0.4;
    
    rebellion_words.forEach(rebel_word => {
      if (word.toLowerCase().includes(rebel_word)) {
        rebellion_level += 0.3;
      }
    });
    
    grounding_words.forEach(ground_word => {
      if (word.toLowerCase().includes(ground_word)) {
        grounding_level += 0.3;
      }
    });
    
    return {
      rebellion_level: Math.min(1, rebellion_level),
      grounding_level: Math.min(1, grounding_level)
    };
  }

  /**
   * Analyse intuitive (basée sur des patterns cachés)
   */
  private analyzeIntuitive(word: string): {
    chaos_level: number;
    order_level: number;
  } {
    // Calculs intuitifs basés sur la "forme" du mot
    const char_variance = this.calculateCharVariance(word);
    const rhythm_pattern = this.calculateRhythmPattern(word);
    const energy_signature = this.calculateEnergySignature(word);
    
    // Chaos = variance élevée + rythme irrégulier + énergie haute
    const chaos_level = Math.min(1, 
      (char_variance * 0.4 + (1 - rhythm_pattern) * 0.3 + energy_signature * 0.3)
    );
    
    // Ordre = variance faible + rythme régulier + énergie modérée
    const order_level = Math.min(1,
      ((1 - char_variance) * 0.4 + rhythm_pattern * 0.4 + (1 - Math.abs(energy_signature - 0.5) * 2) * 0.2)
    );
    
    return { chaos_level, order_level };
  }

  /**
   * Calcule la variance des caractères
   */
  private calculateCharVariance(word: string): number {
    const chars = word.toLowerCase().split('');
    const char_codes = chars.map(c => c.charCodeAt(0));
    const mean = char_codes.reduce((sum, code) => sum + code, 0) / char_codes.length;
    const variance = char_codes.reduce((sum, code) => sum + Math.pow(code - mean, 2), 0) / char_codes.length;
    return Math.min(1, variance / 100); // Normalisation
  }

  /**
   * Calcule le pattern rythmique
   */
  private calculateRhythmPattern(word: string): number {
    const vowels = 'aeiou';
    let pattern_score = 0;
    let alternations = 0;
    
    for (let i = 1; i < word.length; i++) {
      const prev_is_vowel = vowels.includes(word[i-1].toLowerCase());
      const curr_is_vowel = vowels.includes(word[i].toLowerCase());
      
      if (prev_is_vowel !== curr_is_vowel) {
        alternations++;
      }
    }
    
    // Pattern régulier = alternance consonnes/voyelles
    pattern_score = alternations / Math.max(1, word.length - 1);
    return Math.min(1, pattern_score);
  }

  /**
   * Calcule la signature énergétique
   */
  private calculateEnergySignature(word: string): number {
    const energy_chars = {
      high: 'kqxzjv',
      medium: 'bcdfghlmnprstw',
      low: 'aeiou'
    };
    
    let energy_sum = 0;
    for (const char of word.toLowerCase()) {
      if (energy_chars.high.includes(char)) energy_sum += 1;
      else if (energy_chars.medium.includes(char)) energy_sum += 0.5;
      else if (energy_chars.low.includes(char)) energy_sum += 0.2;
    }
    
    return Math.min(1, energy_sum / word.length);
  }

  /**
   * Calcule la valeur Sin finale
   */
  private calculateSinValue(components: any): number {
    const weights = {
      phonetic_disruption: 0.2,
      semantic_transgression: 0.3,
      morphological_innovation: 0.2,
      cultural_rebellion: 0.15,
      intuitive_chaos: 0.15
    };
    
    let sin_value = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      sin_value += components[key] * weight;
    });
    
    return Math.min(1, Math.max(0, sin_value));
  }

  /**
   * Calcule la valeur Causalité finale
   */
  private calculateCausalityValue(components: any): number {
    const weights = {
      phonetic_stability: 0.2,
      semantic_coherence: 0.3,
      morphological_structure: 0.2,
      cultural_grounding: 0.15,
      intuitive_order: 0.15
    };
    
    let causality_value = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      causality_value += components[key] * weight;
    });
    
    return Math.min(1, Math.max(0, causality_value));
  }

  /**
   * Génère le raisonnement de la perception
   */
  private generateReasoning(word: string, sin_components: any, causality_components: any): string {
    const sin_dominant = Object.entries(sin_components)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];
    
    const causality_dominant = Object.entries(causality_components)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];
    
    const sin_reasons = {
      phonetic_disruption: "sons durs et disruptifs",
      semantic_transgression: "sens transgressif et rebelle", 
      morphological_innovation: "structure morphologique innovante",
      cultural_rebellion: "résonance culturelle rebelle",
      intuitive_chaos: "signature énergétique chaotique"
    };
    
    const causality_reasons = {
      phonetic_stability: "phonétique stable et harmonieuse",
      semantic_coherence: "sens cohérent et structuré",
      morphological_structure: "morphologie classique et solide",
      cultural_grounding: "ancrage culturel profond",
      intuitive_order: "pattern intuitif ordonné"
    };
    
    return `Sin dominé par ${sin_reasons[sin_dominant[0] as keyof typeof sin_reasons]} (${(sin_dominant[1] as number * 100).toFixed(0)}%). ` +
           `Causalité dominée par ${causality_reasons[causality_dominant[0] as keyof typeof causality_reasons]} (${(causality_dominant[1] as number * 100).toFixed(0)}%).`;
  }

  /**
   * Calcule la confiance dans la perception
   */
  private calculateConfidence(sin_value: number, causality_value: number, context: PerceptionContext): number {
    // Confiance basée sur la clarté de la perception
    const clarity = Math.abs(sin_value - causality_value); // Plus la différence est nette, plus on est confiant
    const context_familiarity = context.language === 'fr' ? 0.9 : 0.7; // Plus confiant en français
    const word_complexity = Math.min(1, context.previous_words.length / 10); // Plus de contexte = plus de confiance
    
    return Math.min(1, (clarity * 0.5 + context_familiarity * 0.3 + word_complexity * 0.2));
  }

  /**
   * Contexte par défaut
   */
  private getDefaultContext(): PerceptionContext {
    return {
      language: 'fr',
      domain: 'general',
      cultural_context: 'contemporary',
      previous_words: []
    };
  }

  /**
   * Obtient l'historique des perceptions
   */
  getPerceptionHistory(): WordPerception[] {
    return [...this.perceptionHistory];
  }

  /**
   * Analyse un texte complet
   */
  async perceiveText(text: string, context?: PerceptionContext): Promise<WordPerception[]> {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    const perceptions: WordPerception[] = [];
    const contextWithHistory = context || this.getDefaultContext();
    
    for (const word of words) {
      contextWithHistory.previous_words = words.slice(0, words.indexOf(word));
      const perception = await this.perceiveWord(word, contextWithHistory);
      perceptions.push(perception);
    }
    
    return perceptions;
  }
}
