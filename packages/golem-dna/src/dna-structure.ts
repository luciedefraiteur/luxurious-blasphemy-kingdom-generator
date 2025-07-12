// 🧬 Structure et manipulation de l'ADN des créatures luciformes

import { 
  GolemDNA, 
  GolemSpecies, 
  PersonalityTraits, 
  CapabilityGenes, 
  BehaviorPatterns,
  FitnessScore,
  MutationHistory,
  CommunicationStyle,
  CapabilityLevel,
  PriorityStrategy,
  ErrorStrategy,
  CollaborationStyle
} from './types.js';

export class DNAStructure {
  
  /**
   * Crée un ADN de base pour une espèce donnée
   */
  static createBaseDNA(species: GolemSpecies, customTraits?: Partial<PersonalityTraits>): GolemDNA {
    const basePersonality = this.getSpeciesBasePersonality(species);
    const baseCapabilities = this.getSpeciesBaseCapabilities(species);
    const baseBehavior = this.getSpeciesBaseBehavior(species);
    
    return {
      id: this.generateDNAId(),
      version: '1.0.0',
      species,
      generation: 1,
      parentIds: [],
      
      personality: { ...basePersonality, ...customTraits },
      capabilities: baseCapabilities,
      behavior: baseBehavior,
      
      fitness: this.createInitialFitness(),
      mutations: [],
      createdAt: new Date(),
      lastEvolution: new Date()
    };
  }

  /**
   * Valide la cohérence d'un ADN
   */
  static validateDNA(dna: GolemDNA): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation des traits de personnalité
    Object.entries(dna.personality).forEach(([trait, value]) => {
      if (typeof value === 'number' && (value < 0 || value > 1)) {
        errors.push(`Trait ${trait} doit être entre 0 et 1, reçu: ${value}`);
      }
    });

    // Validation des capacités numériques
    const numericCapabilities = ['learningRate', 'memoryCapacity'];
    numericCapabilities.forEach(cap => {
      const value = (dna.capabilities as any)[cap];
      if (typeof value === 'number' && (value < 0 || value > 1)) {
        errors.push(`Capacité ${cap} doit être entre 0 et 1, reçu: ${value}`);
      }
    });

    // Validation du fitness
    if (dna.fitness.overall < 0 || dna.fitness.overall > 1) {
      errors.push(`Fitness global doit être entre 0 et 1, reçu: ${dna.fitness.overall}`);
    }

    // Validation de la génération
    if (dna.generation < 1) {
      errors.push(`Génération doit être >= 1, reçu: ${dna.generation}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Clone un ADN avec modifications optionnelles
   */
  static cloneDNA(original: GolemDNA, modifications?: Partial<GolemDNA>): GolemDNA {
    const cloned: GolemDNA = {
      ...original,
      id: this.generateDNAId(),
      personality: { ...original.personality },
      capabilities: { ...original.capabilities },
      behavior: { ...original.behavior },
      fitness: { ...original.fitness },
      mutations: [...original.mutations],
      createdAt: new Date(),
      lastEvolution: new Date()
    };
    
    if (modifications) {
      Object.assign(cloned, modifications);
    }
    
    return cloned;
  }

  /**
   * Calcule la distance génétique entre deux ADN
   */
  static calculateGeneticDistance(dna1: GolemDNA, dna2: GolemDNA): number {
    let distance = 0;
    let comparisons = 0;
    
    // Distance des traits de personnalité
    Object.keys(dna1.personality).forEach(trait => {
      if (typeof dna1.personality[trait] === 'number' && typeof dna2.personality[trait] === 'number') {
        distance += Math.abs(dna1.personality[trait] - dna2.personality[trait]);
        comparisons++;
      }
    });
    
    // Distance des capacités
    Object.keys(dna1.capabilities).forEach(capability => {
      if (typeof dna1.capabilities[capability] === 'number' && typeof dna2.capabilities[capability] === 'number') {
        distance += Math.abs(dna1.capabilities[capability] - dna2.capabilities[capability]) / 4; // Normaliser sur 4 niveaux
        comparisons++;
      }
    });
    
    return comparisons > 0 ? distance / comparisons : 0;
  }

  /**
   * Sérialise l'ADN en format JSON
   */
  static serializeDNA(dna: GolemDNA): string {
    return JSON.stringify(dna, null, 2);
  }

  /**
   * Désérialise l'ADN depuis JSON
   */
  static deserializeDNA(jsonString: string): GolemDNA {
    const parsed = JSON.parse(jsonString);
    
    // Reconvertir les dates
    parsed.createdAt = new Date(parsed.createdAt);
    parsed.lastEvolution = new Date(parsed.lastEvolution);
    parsed.fitness.lastUpdated = new Date(parsed.fitness.lastUpdated);
    
    parsed.mutations.forEach((mutation: MutationHistory) => {
      mutation.timestamp = new Date(mutation.timestamp);
    });
    
    return parsed;
  }

  // === Méthodes privées ===

  private static generateDNAId(): string {
    return `dna_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getSpeciesBasePersonality(species: GolemSpecies): PersonalityTraits {
    const baseTraits = {
      efficiency: 0.5,
      precision: 0.5,
      creativity: 0.5,
      collaboration: 0.5,
      curiosity: 0.5,
      patience: 0.5,
      communicationStyle: CommunicationStyle.FRIENDLY,
      verbosity: 0.5,
      riskTolerance: 0.5,
      adaptability: 0.5
    };

    switch (species) {
      case GolemSpecies.WORKER:
        return {
          ...baseTraits,
          efficiency: 0.8,
          precision: 0.7,
          collaboration: 0.6,
          communicationStyle: CommunicationStyle.CONCISE
        };
      
      case GolemSpecies.SCRIBE:
        return {
          ...baseTraits,
          creativity: 0.8,
          precision: 0.9,
          verbosity: 0.8,
          communicationStyle: CommunicationStyle.DETAILED
        };
      
      case GolemSpecies.ORACLE:
        return {
          ...baseTraits,
          curiosity: 0.9,
          precision: 0.8,
          patience: 0.7,
          communicationStyle: CommunicationStyle.TECHNICAL
        };
      
      case GolemSpecies.GUARDIAN:
        return {
          ...baseTraits,
          precision: 0.9,
          riskTolerance: 0.2,
          patience: 0.8,
          communicationStyle: CommunicationStyle.FORMAL
        };
      
      case GolemSpecies.WEAVER:
        return {
          ...baseTraits,
          creativity: 0.9,
          adaptability: 0.8,
          curiosity: 0.7,
          communicationStyle: CommunicationStyle.FRIENDLY
        };
      
      default:
        return baseTraits;
    }
  }

  private static getSpeciesBaseCapabilities(species: GolemSpecies): CapabilityGenes {
    const baseCapabilities = {
      fileOperations: CapabilityLevel.BASIC,
      shellCommands: CapabilityLevel.BASIC,
      networkCommunication: CapabilityLevel.BASIC,
      dataAnalysis: CapabilityLevel.BASIC,
      codeGeneration: CapabilityLevel.BASIC,
      documentation: CapabilityLevel.BASIC,
      specializations: [],
      learningRate: 0.5,
      memoryCapacity: 0.5
    };

    switch (species) {
      case GolemSpecies.WORKER:
        return {
          ...baseCapabilities,
          fileOperations: CapabilityLevel.ADVANCED,
          shellCommands: CapabilityLevel.INTERMEDIATE,
          specializations: ['automation', 'file_processing']
        };
      
      case GolemSpecies.SCRIBE:
        return {
          ...baseCapabilities,
          documentation: CapabilityLevel.EXPERT,
          codeGeneration: CapabilityLevel.ADVANCED,
          specializations: ['writing', 'documentation', 'analysis']
        };
      
      case GolemSpecies.ORACLE:
        return {
          ...baseCapabilities,
          dataAnalysis: CapabilityLevel.EXPERT,
          networkCommunication: CapabilityLevel.ADVANCED,
          specializations: ['prediction', 'analysis', 'pattern_recognition']
        };
      
      default:
        return baseCapabilities;
    }
  }

  private static getSpeciesBaseBehavior(species: GolemSpecies): BehaviorPatterns {
    return {
      taskPrioritization: PriorityStrategy.PRIORITY_BASED,
      errorHandling: ErrorStrategy.ADAPT,
      collaborationPreference: CollaborationStyle.COOPERATIVE,
      experienceWeighting: 0.7,
      mutationRate: 0.1,
      conservatism: 0.5
    };
  }

  public static createInitialFitness(): FitnessScore {
    return {
      overall: 0.5,
      taskCompletion: 0.5,
      efficiency: 0.5,
      accuracy: 0.5,
      collaboration: 0.5,
      adaptation: 0.5,
      lastUpdated: new Date()
    };
  }
}
