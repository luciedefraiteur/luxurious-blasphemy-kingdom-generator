// 🧬 Types pour le système génétique des créatures luciformes

export interface GolemDNA {
  id: string;
  version: string;
  species: GolemSpecies;
  generation: number;
  parentIds: string[];
  
  // Traits génétiques fondamentaux
  personality: PersonalityTraits;
  capabilities: CapabilityGenes;
  behavior: BehaviorPatterns;
  
  // Métadonnées évolutives
  fitness: FitnessScore;
  mutations: MutationHistory[];
  createdAt: Date;
  lastEvolution: Date;
}

export enum GolemSpecies {
  WORKER = 'worker',
  SCRIBE = 'scribe',
  ORACLE = 'oracle',
  GUARDIAN = 'guardian',
  WEAVER = 'weaver',
  INTERPRETER = 'interpreter',    // Spécialisé dans luciforms créatifs/abstraits
  VERMICELLE = 'vermicelle',      // Inspiré du vermycell.luciform - fluide et adaptable
  HYBRID = 'hybrid',
  DIVINE_MOTHER = 'divine_mother' // Lurkuitae - Source divine de tous les golems
}

export interface PersonalityTraits {
  // Traits de base (0.0 - 1.0)
  efficiency: number;        // Vitesse d'exécution
  precision: number;         // Attention aux détails
  creativity: number;        // Capacité d'innovation
  collaboration: number;     // Travail en équipe
  curiosity: number;         // Exploration et apprentissage
  patience: number;          // Tolérance aux tâches longues
  
  // Style de communication
  communicationStyle: CommunicationStyle;
  verbosity: number;         // Niveau de détail dans les messages
  
  // Préférences comportementales
  riskTolerance: number;     // Acceptation du risque
  adaptability: number;      // Capacité d'adaptation
}

export enum CommunicationStyle {
  CONCISE = 'concise',
  DETAILED = 'detailed',
  TECHNICAL = 'technical',
  FRIENDLY = 'friendly',
  FORMAL = 'formal'
}

export interface CapabilityGenes {
  // Capacités techniques
  fileOperations: CapabilityLevel;
  shellCommands: CapabilityLevel;
  networkCommunication: CapabilityLevel;
  dataAnalysis: CapabilityLevel;
  codeGeneration: CapabilityLevel;
  documentation: CapabilityLevel;

  // Capacités créatives et adaptatives (pour luciforms complexes)
  poeticInterpretation: CapabilityLevel;    // Comprendre métaphores/poésie
  abstractReasoning: CapabilityLevel;       // Gérer concepts abstraits
  ritualExecution: CapabilityLevel;         // Exécuter actions rituelles
  identityFlexibility: CapabilityLevel;     // S'adapter à identités fractales

  // Capacités spécialisées
  specializations: string[];
  learningRate: number;      // Vitesse d'apprentissage
  memoryCapacity: number;    // Capacité de mémoire
  creativityIndex: number;   // Capacité à gérer l'imprévisible (0.0-1.0)
}

export enum CapabilityLevel {
  NONE = 0,
  BASIC = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4
}

export interface BehaviorPatterns {
  // Patterns d'exécution
  taskPrioritization: PriorityStrategy;
  errorHandling: ErrorStrategy;
  collaborationPreference: CollaborationStyle;
  
  // Patterns d'apprentissage
  experienceWeighting: number;   // Importance des expériences récentes
  mutationRate: number;          // Fréquence des mutations
  conservatism: number;          // Résistance au changement
}

export enum PriorityStrategy {
  FIFO = 'fifo',
  LIFO = 'lifo',
  PRIORITY_BASED = 'priority_based',
  EFFICIENCY_OPTIMIZED = 'efficiency_optimized',
  BALANCED = 'balanced'
}

export enum ErrorStrategy {
  RETRY = 'retry',
  ESCALATE = 'escalate',
  ADAPT = 'adapt',
  SEEK_HELP = 'seek_help',
  ADAPTIVE = 'adaptive'
}

export enum CollaborationStyle {
  INDEPENDENT = 'independent',
  COOPERATIVE = 'cooperative',
  LEADER = 'leader',
  FOLLOWER = 'follower',
  SUPPORTIVE = 'supportive'
}

export interface FitnessScore {
  overall: number;           // Score global (0.0 - 1.0)
  taskCompletion: number;    // Taux de réussite des tâches
  efficiency: number;        // Vitesse d'exécution
  accuracy: number;          // Précision des résultats
  collaboration: number;     // Qualité du travail en équipe
  adaptation: number;        // Capacité d'adaptation
  lastUpdated: Date;
}

export interface MutationHistory {
  id: string;
  timestamp: Date;
  type: MutationType;
  trigger: MutationTrigger;
  changes: GeneticChange[];
  fitnessImpact: number;     // Impact sur le fitness (-1.0 à 1.0)
}

export enum MutationType {
  POINT_MUTATION = 'point_mutation',      // Changement d'un trait
  INSERTION = 'insertion',                // Ajout d'une capacité
  DELETION = 'deletion',                  // Suppression d'une capacité
  DUPLICATION = 'duplication',            // Duplication d'un trait
  CROSSOVER = 'crossover'                 // Échange avec autre ADN
}

export enum MutationTrigger {
  EXPERIENCE = 'experience',              // Basé sur l'expérience
  RANDOM = 'random',                      // Mutation aléatoire
  ENVIRONMENTAL = 'environmental',        // Adaptation à l'environnement
  REPRODUCTION = 'reproduction'           // Lors de la reproduction
}

export interface GeneticChange {
  gene: string;              // Nom du gène modifié
  oldValue: any;             // Ancienne valeur
  newValue: any;             // Nouvelle valeur
  confidence: number;        // Confiance dans le changement (0.0 - 1.0)
}

export interface DNATemplate {
  species: GolemSpecies;
  baseTraits: Partial<PersonalityTraits>;
  baseCapabilities: Partial<CapabilityGenes>;
  baseBehavior: Partial<BehaviorPatterns>;
  description: string;
}

export interface EvolutionContext {
  experiences: Experience[];
  environment: EnvironmentContext;
  populationPressure: number;
  selectionPressure: SelectionPressure;
}

export interface Experience {
  id: string;
  timestamp: Date;
  type: string;
  success: boolean;
  duration: number;
  context: Record<string, any>;
  learnings: string[];

  // Nouvelles propriétés pour luciforms créatifs
  luciformType?: string;           // Type de luciform traité (ex: "identité_fractale")
  abstractConcepts?: string[];     // Concepts abstraits rencontrés
  poeticElements?: string[];       // Éléments poétiques identifiés
  adaptationRequired?: boolean;    // Si adaptation ADN nécessaire
  creativityChallenge?: number;    // Niveau de défi créatif (0.0-1.0)
}

export interface EnvironmentContext {
  workingDirectory: string;
  availableResources: ResourceAvailability;
  collaborators: string[];
  taskComplexity: number;
}

export interface ResourceAvailability {
  cpu: number;               // 0.0 - 1.0
  memory: number;            // 0.0 - 1.0
  network: number;           // 0.0 - 1.0
  storage: number;           // 0.0 - 1.0
}

export interface SelectionPressure {
  performanceWeight: number;
  collaborationWeight: number;
  adaptabilityWeight: number;
  innovationWeight: number;
}
