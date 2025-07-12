// 🧬 Point d'entrée principal du package golem-dna
// Système génétique pour les créatures luciformes du Royaume Numérique de Lucie Faire

export * from './types.js';
export * from './dna-structure.js';
export * from './mutation-engine.js';

// Classe principale pour l'utilisation simplifiée
import { DNAStructure } from './dna-structure.js';
import { MutationEngine } from './mutation-engine.js';
import { 
  GolemDNA, 
  GolemSpecies, 
  PersonalityTraits, 
  Experience, 
  EvolutionContext 
} from './types.js';

/**
 * Classe principale pour la gestion de l'ADN des golems
 * Interface simplifiée pour les opérations courantes
 */
export class GolemDNAManager {
  
  /**
   * Crée un nouveau golem avec ADN de base
   */
  static async createGolem(
    species: GolemSpecies, 
    customTraits?: Partial<PersonalityTraits>
  ): Promise<GolemDNA> {
    const dna = DNAStructure.createBaseDNA(species, customTraits);
    const validation = DNAStructure.validateDNA(dna);
    
    if (!validation.valid) {
      throw new Error(`ADN invalide: ${validation.errors.join(', ')}`);
    }
    
    return dna;
  }

  /**
   * Fait évoluer un golem basé sur ses expériences
   */
  static async evolveGolem(
    dna: GolemDNA, 
    experiences: Experience[]
  ): Promise<GolemDNA> {
    const { mutatedDNA } = await MutationEngine.mutateFromExperience(dna, experiences);
    
    // Valider l'ADN muté
    const validation = DNAStructure.validateDNA(mutatedDNA);
    if (!validation.valid) {
      console.warn(`Mutations produisent ADN invalide: ${validation.errors.join(', ')}`);
      return dna; // Retourner l'original si la mutation échoue
    }
    
    return mutatedDNA;
  }

  /**
   * Crée un descendant de deux golems parents
   */
  static async reproduceGolems(
    parent1: GolemDNA, 
    parent2: GolemDNA
  ): Promise<GolemDNA> {
    const offspring = await MutationEngine.crossover(parent1, parent2);
    
    // Valider le descendant
    const validation = DNAStructure.validateDNA(offspring);
    if (!validation.valid) {
      throw new Error(`Descendant invalide: ${validation.errors.join(', ')}`);
    }
    
    return offspring;
  }

  /**
   * Applique une mutation environnementale
   */
  static async adaptToEnvironment(
    dna: GolemDNA, 
    context: EvolutionContext
  ): Promise<GolemDNA> {
    return await MutationEngine.environmentalMutation(dna, context);
  }

  /**
   * Calcule la compatibilité génétique entre deux golems
   */
  static calculateCompatibility(dna1: GolemDNA, dna2: GolemDNA): number {
    const distance = DNAStructure.calculateGeneticDistance(dna1, dna2);
    return Math.max(0, 1 - distance); // Convertir distance en compatibilité
  }

  /**
   * Sauvegarde l'ADN en format JSON
   */
  static serializeDNA(dna: GolemDNA): string {
    return DNAStructure.serializeDNA(dna);
  }

  /**
   * Charge l'ADN depuis JSON
   */
  static deserializeDNA(jsonString: string): GolemDNA {
    return DNAStructure.deserializeDNA(jsonString);
  }

  /**
   * Clone un golem avec modifications optionnelles
   */
  static cloneGolem(
    original: GolemDNA, 
    modifications?: Partial<GolemDNA>
  ): GolemDNA {
    return DNAStructure.cloneDNA(original, modifications);
  }

  /**
   * Génère un rapport d'analyse génétique
   */
  static analyzeGenetics(dna: GolemDNA): {
    species: GolemSpecies;
    generation: number;
    dominantTraits: string[];
    weaknesses: string[];
    evolutionPotential: number;
    fitnessScore: number;
  } {
    // Identifier les traits dominants (> 0.7)
    const dominantTraits: string[] = [];
    Object.entries(dna.personality).forEach(([trait, value]) => {
      if (typeof value === 'number' && value > 0.7) {
        dominantTraits.push(trait);
      }
    });

    // Identifier les faiblesses (< 0.3)
    const weaknesses: string[] = [];
    Object.entries(dna.personality).forEach(([trait, value]) => {
      if (typeof value === 'number' && value < 0.3) {
        weaknesses.push(trait);
      }
    });

    // Calculer le potentiel d'évolution
    const evolutionPotential = dna.capabilities.learningRate * dna.personality.adaptability;

    return {
      species: dna.species,
      generation: dna.generation,
      dominantTraits,
      weaknesses,
      evolutionPotential,
      fitnessScore: dna.fitness.overall
    };
  }

  /**
   * Recommande des améliorations pour un golem
   */
  static recommendImprovements(dna: GolemDNA): {
    priorityImprovements: string[];
    suggestedExperiences: string[];
    compatiblePartners: GolemSpecies[];
  } {
    const analysis = this.analyzeGenetics(dna);
    const priorityImprovements: string[] = [];
    const suggestedExperiences: string[] = [];
    const compatiblePartners: GolemSpecies[] = [];

    // Recommandations basées sur les faiblesses
    if (analysis.weaknesses.includes('efficiency')) {
      priorityImprovements.push('Améliorer l\'efficacité via des tâches répétitives');
      suggestedExperiences.push('automation_tasks', 'batch_processing');
    }

    if (analysis.weaknesses.includes('collaboration')) {
      priorityImprovements.push('Développer les compétences collaboratives');
      suggestedExperiences.push('team_projects', 'peer_communication');
    }

    // Partenaires compatibles pour reproduction
    switch (dna.species) {
      case GolemSpecies.WORKER:
        compatiblePartners.push(GolemSpecies.SCRIBE, GolemSpecies.ORACLE);
        break;
      case GolemSpecies.SCRIBE:
        compatiblePartners.push(GolemSpecies.WORKER, GolemSpecies.WEAVER);
        break;
      case GolemSpecies.ORACLE:
        compatiblePartners.push(GolemSpecies.WORKER, GolemSpecies.GUARDIAN);
        break;
      default:
        compatiblePartners.push(...Object.values(GolemSpecies));
    }

    return {
      priorityImprovements,
      suggestedExperiences,
      compatiblePartners
    };
  }
}

// Export par défaut pour utilisation simple
export default GolemDNAManager;
