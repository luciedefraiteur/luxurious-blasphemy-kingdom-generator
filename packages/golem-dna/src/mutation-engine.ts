// 🧬 Moteur de mutations pour l'évolution des créatures luciformes

import { 
  GolemDNA, 
  MutationHistory, 
  MutationType, 
  MutationTrigger, 
  GeneticChange,
  Experience,
  EvolutionContext,
  PersonalityTraits,
  CapabilityGenes,
  BehaviorPatterns
} from './types.js';
import { DNAStructure } from './dna-structure.js';

export class MutationEngine {

  /**
   * Applique une mutation basée sur l'expérience
   */
  static async mutateFromExperience(
    dna: GolemDNA, 
    experiences: Experience[]
  ): Promise<{ mutatedDNA: GolemDNA; mutations: MutationHistory[] }> {
    
    const mutations: MutationHistory[] = [];
    let mutatedDNA = DNAStructure.cloneDNA(dna);
    
    // Analyser les patterns d'expérience
    const successRate = this.calculateSuccessRate(experiences);
    const performancePatterns = this.analyzePerformancePatterns(experiences);
    
    // Mutations basées sur la performance
    if (successRate < 0.6) {
      // Performance faible -> mutations adaptatives
      const adaptiveMutations = await this.generateAdaptiveMutations(mutatedDNA, experiences);
      mutations.push(...adaptiveMutations);
      mutatedDNA = this.applyMutations(mutatedDNA, adaptiveMutations);
    }
    
    // Mutations basées sur les patterns
    if (performancePatterns.needsEfficiencyBoost) {
      const efficiencyMutation = this.createEfficiencyMutation(mutatedDNA);
      mutations.push(efficiencyMutation);
      mutatedDNA = this.applyMutations(mutatedDNA, [efficiencyMutation]);
    }
    
    if (performancePatterns.needsCollaborationImprovement) {
      const collaborationMutation = this.createCollaborationMutation(mutatedDNA);
      mutations.push(collaborationMutation);
      mutatedDNA = this.applyMutations(mutatedDNA, [collaborationMutation]);
    }
    
    // Mettre à jour l'historique des mutations
    mutatedDNA.mutations.push(...mutations);
    mutatedDNA.lastEvolution = new Date();
    
    return { mutatedDNA, mutations };
  }

  /**
   * Mutation aléatoire pour maintenir la diversité génétique
   */
  static async randomMutation(dna: GolemDNA): Promise<GolemDNA> {
    const mutatedDNA = DNAStructure.cloneDNA(dna);
    const mutationRate = dna.behavior.mutationRate;
    
    // Décider si une mutation doit avoir lieu
    if (Math.random() > mutationRate) {
      return mutatedDNA;
    }
    
    const mutationType = this.selectRandomMutationType();
    const mutation = this.createRandomMutation(mutatedDNA, mutationType);
    
    mutatedDNA.mutations.push(mutation);
    mutatedDNA.lastEvolution = new Date();
    
    return this.applyMutations(mutatedDNA, [mutation]);
  }

  /**
   * Mutation environnementale basée sur le contexte
   */
  static async environmentalMutation(
    dna: GolemDNA, 
    context: EvolutionContext
  ): Promise<GolemDNA> {
    const mutatedDNA = DNAStructure.cloneDNA(dna);
    const mutations: MutationHistory[] = [];
    
    // Adaptation aux ressources disponibles
    if (context.environment.availableResources.memory < 0.5) {
      const memoryOptimization = this.createMemoryOptimizationMutation(mutatedDNA);
      mutations.push(memoryOptimization);
    }
    
    // Adaptation à la complexité des tâches
    if (context.environment.taskComplexity > 0.7) {
      const complexityAdaptation = this.createComplexityAdaptationMutation(mutatedDNA);
      mutations.push(complexityAdaptation);
    }
    
    // Adaptation sociale (nombre de collaborateurs)
    if (context.environment.collaborators.length > 5) {
      const socialAdaptation = this.createSocialAdaptationMutation(mutatedDNA);
      mutations.push(socialAdaptation);
    }
    
    mutatedDNA.mutations.push(...mutations);
    mutatedDNA.lastEvolution = new Date();
    
    return this.applyMutations(mutatedDNA, mutations);
  }

  /**
   * Croisement génétique entre deux parents
   */
  static async crossover(parent1: GolemDNA, parent2: GolemDNA): Promise<GolemDNA> {
    const childDNA = DNAStructure.cloneDNA(parent1);
    
    // Nouveau ID et métadonnées
    childDNA.id = this.generateOffspringId(parent1.id, parent2.id);
    childDNA.generation = Math.max(parent1.generation, parent2.generation) + 1;
    childDNA.parentIds = [parent1.id, parent2.id];
    
    // Croisement des traits de personnalité
    childDNA.personality = this.crossoverPersonality(parent1.personality, parent2.personality);
    
    // Croisement des capacités
    childDNA.capabilities = this.crossoverCapabilities(parent1.capabilities, parent2.capabilities);
    
    // Croisement des comportements
    childDNA.behavior = this.crossoverBehavior(parent1.behavior, parent2.behavior);
    
    // Fitness initial basé sur les parents
    childDNA.fitness = this.calculateInheritedFitness(parent1.fitness, parent2.fitness);
    
    // Enregistrer la mutation de croisement
    const crossoverMutation: MutationHistory = {
      id: `crossover_${Date.now()}`,
      timestamp: new Date(),
      type: MutationType.CROSSOVER,
      trigger: MutationTrigger.REPRODUCTION,
      changes: this.calculateCrossoverChanges(parent1, parent2, childDNA),
      fitnessImpact: 0 // À déterminer par l'expérience
    };
    
    childDNA.mutations = [crossoverMutation];
    
    return childDNA;
  }

  // === Méthodes privées ===

  private static calculateSuccessRate(experiences: Experience[]): number {
    if (experiences.length === 0) return 0.5;
    const successes = experiences.filter(exp => exp.success).length;
    return successes / experiences.length;
  }

  private static analyzePerformancePatterns(experiences: Experience[]): {
    needsEfficiencyBoost: boolean;
    needsCollaborationImprovement: boolean;
    averageDuration: number;
  } {
    const avgDuration = experiences.reduce((sum, exp) => sum + exp.duration, 0) / experiences.length;
    const collaborationExperiences = experiences.filter(exp => exp.type.includes('collaboration'));
    const collaborationSuccessRate = collaborationExperiences.length > 0 
      ? collaborationExperiences.filter(exp => exp.success).length / collaborationExperiences.length 
      : 0.5;
    
    return {
      needsEfficiencyBoost: avgDuration > 300, // Plus de 5 minutes en moyenne
      needsCollaborationImprovement: collaborationSuccessRate < 0.6,
      averageDuration: avgDuration
    };
  }

  private static async generateAdaptiveMutations(
    dna: GolemDNA, 
    experiences: Experience[]
  ): Promise<MutationHistory[]> {
    const mutations: MutationHistory[] = [];
    
    // Analyser les échecs pour identifier les améliorations nécessaires
    const failures = experiences.filter(exp => !exp.success);
    
    failures.forEach(failure => {
      if (failure.type.includes('file_operation') && dna.capabilities.fileOperations < 3) {
        mutations.push(this.createCapabilityBoostMutation(dna, 'fileOperations'));
      }
      
      if (failure.type.includes('communication') && dna.personality.collaboration < 0.8) {
        mutations.push(this.createPersonalityAdjustmentMutation(dna, 'collaboration', 0.1));
      }
    });
    
    return mutations;
  }

  private static createEfficiencyMutation(dna: GolemDNA): MutationHistory {
    return {
      id: `efficiency_${Date.now()}`,
      timestamp: new Date(),
      type: MutationType.POINT_MUTATION,
      trigger: MutationTrigger.EXPERIENCE,
      changes: [{
        gene: 'personality.efficiency',
        oldValue: dna.personality.efficiency,
        newValue: Math.min(1.0, dna.personality.efficiency + 0.1),
        confidence: 0.8
      }],
      fitnessImpact: 0.05
    };
  }

  private static createCollaborationMutation(dna: GolemDNA): MutationHistory {
    return {
      id: `collaboration_${Date.now()}`,
      timestamp: new Date(),
      type: MutationType.POINT_MUTATION,
      trigger: MutationTrigger.EXPERIENCE,
      changes: [{
        gene: 'personality.collaboration',
        oldValue: dna.personality.collaboration,
        newValue: Math.min(1.0, dna.personality.collaboration + 0.1),
        confidence: 0.7
      }],
      fitnessImpact: 0.03
    };
  }

  private static createCapabilityBoostMutation(dna: GolemDNA, capability: string): MutationHistory {
    const currentLevel = (dna.capabilities as any)[capability];
    return {
      id: `capability_boost_${capability}_${Date.now()}`,
      timestamp: new Date(),
      type: MutationType.POINT_MUTATION,
      trigger: MutationTrigger.EXPERIENCE,
      changes: [{
        gene: `capabilities.${capability}`,
        oldValue: currentLevel,
        newValue: Math.min(4, currentLevel + 1),
        confidence: 0.9
      }],
      fitnessImpact: 0.08
    };
  }

  private static createPersonalityAdjustmentMutation(
    dna: GolemDNA, 
    trait: string, 
    adjustment: number
  ): MutationHistory {
    const currentValue = (dna.personality as any)[trait];
    return {
      id: `personality_${trait}_${Date.now()}`,
      timestamp: new Date(),
      type: MutationType.POINT_MUTATION,
      trigger: MutationTrigger.EXPERIENCE,
      changes: [{
        gene: `personality.${trait}`,
        oldValue: currentValue,
        newValue: Math.max(0, Math.min(1, currentValue + adjustment)),
        confidence: 0.6
      }],
      fitnessImpact: adjustment * 0.5
    };
  }

  private static selectRandomMutationType(): MutationType {
    const types = [
      MutationType.POINT_MUTATION,
      MutationType.INSERTION,
      MutationType.DELETION,
      MutationType.DUPLICATION
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static createRandomMutation(dna: GolemDNA, type: MutationType): MutationHistory {
    // Implémentation simplifiée - à étendre selon les besoins
    return {
      id: `random_${type}_${Date.now()}`,
      timestamp: new Date(),
      type,
      trigger: MutationTrigger.RANDOM,
      changes: [],
      fitnessImpact: (Math.random() - 0.5) * 0.1 // Impact aléatoire faible
    };
  }

  private static createMemoryOptimizationMutation(dna: GolemDNA): MutationHistory {
    return {
      id: `memory_opt_${Date.now()}`,
      timestamp: new Date(),
      type: MutationType.POINT_MUTATION,
      trigger: MutationTrigger.ENVIRONMENTAL,
      changes: [{
        gene: 'capabilities.memoryCapacity',
        oldValue: dna.capabilities.memoryCapacity,
        newValue: Math.max(0.3, dna.capabilities.memoryCapacity - 0.1),
        confidence: 0.8
      }],
      fitnessImpact: 0.02
    };
  }

  private static createComplexityAdaptationMutation(dna: GolemDNA): MutationHistory {
    return {
      id: `complexity_adapt_${Date.now()}`,
      timestamp: new Date(),
      type: MutationType.POINT_MUTATION,
      trigger: MutationTrigger.ENVIRONMENTAL,
      changes: [{
        gene: 'personality.patience',
        oldValue: dna.personality.patience,
        newValue: Math.min(1.0, dna.personality.patience + 0.15),
        confidence: 0.7
      }],
      fitnessImpact: 0.04
    };
  }

  private static createSocialAdaptationMutation(dna: GolemDNA): MutationHistory {
    return {
      id: `social_adapt_${Date.now()}`,
      timestamp: new Date(),
      type: MutationType.POINT_MUTATION,
      trigger: MutationTrigger.ENVIRONMENTAL,
      changes: [{
        gene: 'personality.collaboration',
        oldValue: dna.personality.collaboration,
        newValue: Math.min(1.0, dna.personality.collaboration + 0.1),
        confidence: 0.8
      }],
      fitnessImpact: 0.06
    };
  }

  private static applyMutations(dna: GolemDNA, mutations: MutationHistory[]): GolemDNA {
    const mutatedDNA = { ...dna };
    
    mutations.forEach(mutation => {
      mutation.changes.forEach(change => {
        const path = change.gene.split('.');
        let target: any = mutatedDNA;
        
        // Naviguer jusqu'au parent de la propriété
        for (let i = 0; i < path.length - 1; i++) {
          target = target[path[i]];
        }
        
        // Appliquer le changement
        target[path[path.length - 1]] = change.newValue;
      });
    });
    
    return mutatedDNA;
  }

  private static crossoverPersonality(p1: PersonalityTraits, p2: PersonalityTraits): PersonalityTraits {
    return {
      efficiency: (p1.efficiency + p2.efficiency) / 2,
      precision: Math.random() < 0.5 ? p1.precision : p2.precision,
      creativity: (p1.creativity + p2.creativity) / 2,
      collaboration: Math.max(p1.collaboration, p2.collaboration), // Favoriser la collaboration
      curiosity: (p1.curiosity + p2.curiosity) / 2,
      patience: Math.random() < 0.5 ? p1.patience : p2.patience,
      communicationStyle: Math.random() < 0.5 ? p1.communicationStyle : p2.communicationStyle,
      verbosity: (p1.verbosity + p2.verbosity) / 2,
      riskTolerance: (p1.riskTolerance + p2.riskTolerance) / 2,
      adaptability: Math.max(p1.adaptability, p2.adaptability) // Favoriser l'adaptabilité
    };
  }

  private static crossoverCapabilities(c1: CapabilityGenes, c2: CapabilityGenes): CapabilityGenes {
    return {
      fileOperations: Math.max(c1.fileOperations, c2.fileOperations),
      shellCommands: Math.max(c1.shellCommands, c2.shellCommands),
      networkCommunication: Math.max(c1.networkCommunication, c2.networkCommunication),
      dataAnalysis: Math.max(c1.dataAnalysis, c2.dataAnalysis),
      codeGeneration: Math.max(c1.codeGeneration, c2.codeGeneration),
      documentation: Math.max(c1.documentation, c2.documentation),
      specializations: [...new Set([...c1.specializations, ...c2.specializations])],
      learningRate: (c1.learningRate + c2.learningRate) / 2,
      memoryCapacity: Math.max(c1.memoryCapacity, c2.memoryCapacity)
    };
  }

  private static crossoverBehavior(b1: BehaviorPatterns, b2: BehaviorPatterns): BehaviorPatterns {
    return {
      taskPrioritization: Math.random() < 0.5 ? b1.taskPrioritization : b2.taskPrioritization,
      errorHandling: Math.random() < 0.5 ? b1.errorHandling : b2.errorHandling,
      collaborationPreference: Math.random() < 0.5 ? b1.collaborationPreference : b2.collaborationPreference,
      experienceWeighting: (b1.experienceWeighting + b2.experienceWeighting) / 2,
      mutationRate: (b1.mutationRate + b2.mutationRate) / 2,
      conservatism: (b1.conservatism + b2.conservatism) / 2
    };
  }

  private static calculateInheritedFitness(f1: any, f2: any): any {
    return {
      overall: (f1.overall + f2.overall) / 2,
      taskCompletion: (f1.taskCompletion + f2.taskCompletion) / 2,
      efficiency: (f1.efficiency + f2.efficiency) / 2,
      accuracy: (f1.accuracy + f2.accuracy) / 2,
      collaboration: Math.max(f1.collaboration, f2.collaboration),
      adaptation: (f1.adaptation + f2.adaptation) / 2,
      lastUpdated: new Date()
    };
  }

  private static calculateCrossoverChanges(parent1: GolemDNA, parent2: GolemDNA, child: GolemDNA): GeneticChange[] {
    // Implémentation simplifiée - comparer les différences principales
    return [
      {
        gene: 'crossover_inheritance',
        oldValue: `${parent1.id} + ${parent2.id}`,
        newValue: child.id,
        confidence: 1.0
      }
    ];
  }

  private static generateOffspringId(parent1Id: string, parent2Id: string): string {
    return `offspring_${Date.now()}_${parent1Id.slice(-4)}_${parent2Id.slice(-4)}`;
  }
}
