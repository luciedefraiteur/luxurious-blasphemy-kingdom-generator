// 🌀 Types pour le Générateur de Vie Luciforme
// Hanté par la signature base666 - Fractalisation totale

export interface LuciformLifeInput {
  luciform: any;                    // N'importe quel luciform
  animationType: AnimationType;     // Type d'animation désirée
  context?: WorkspaceContext;       // Contexte workspace optionnel
  targetGolem?: string;            // Golem cible pour dialogue
  ritualIntensity?: number;        // Intensité des prompts rituels (0-666)
}

export enum AnimationType {
  DIALOGUE = 'dialogue',           // Dialogue avec un autre golem
  SCRYORB = 'scryorb',            // Vision du contexte environnant
  PLAN_GENERATION = 'plan_generation', // Génération d'un plan.luciform
  FULL_ANIMATION = 'full_animation',   // Animation complète
  RITUAL_INVOCATION = 'ritual_invocation' // Invocation rituelle pure
}

export interface WorkspaceContext {
  currentDirectory: string;
  openFiles: FileContext[];
  recentActivity: ActivityLog[];
  availableGolems: GolemPresence[];
  cosmicEnergy: number;            // Niveau d'énergie cosmique (0-1)
}

export interface FileContext {
  path: string;
  content: string;
  lastModified: Date;
  blasphemyLevel: number;          // Niveau de blasphémie du fichier
  luciformType?: string;
}

export interface ActivityLog {
  timestamp: Date;
  action: string;
  file?: string;
  golem?: string;
  energyChange: number;
}

export interface GolemPresence {
  name: string;
  type: string;
  status: 'active' | 'dormant' | 'transcendent';
  lastSeen: Date;
  signature: string;               // Signature base666
  capabilities: string[];
}

export interface ScryOrbVision {
  centerFocus: string;             // Point central de la vision
  surroundingElements: VisionElement[];
  hiddenPatterns: string[];        // Patterns cachés détectés
  futureEchoes: string[];          // Échos du futur perçus
  pastResonances: string[];        // Résonances du passé
  cosmicConnections: string[];     // Connexions cosmiques
}

export interface VisionElement {
  type: 'file' | 'golem' | 'energy' | 'pattern' | 'mystery';
  name: string;
  description: string;
  significance: number;            // Importance (0-1)
  blasphemyLevel: number;         // Niveau blasphématoire
}

export interface RitualPrompt {
  invocation: string;              // Invocation initiale
  context: string;                 // Contexte rituel
  request: string;                 // Demande spécifique
  signature: string;               // Signature base666 intégrée
  expectedResponse: ResponseType;
}

export enum ResponseType {
  DIALOGUE_LINES = 'dialogue_lines',
  VISION_DESCRIPTION = 'vision_description',
  ACTION_SEQUENCE = 'action_sequence',
  PLAN_STRUCTURE = 'plan_structure',
  PURE_CREATION = 'pure_creation'
}

export interface AnimatedLuciform {
  originalLuciform: any;
  animationType: AnimationType;
  generatedContent: GeneratedContent;
  ritualUsed: RitualPrompt;
  timestamp: Date;
  signature: string;               // Signature base666 du générateur
  cosmicResonance: number;         // Résonance cosmique (0-666)
}

export interface GeneratedContent {
  type: ResponseType;
  content: string | DialogueSequence | ScryOrbVision | PlanLuciform;
  metadata: {
    aiModel: string;
    processingTime: number;
    blasphemyLevel: number;
    confidence: number;
  };
}

export interface DialogueSequence {
  participants: string[];          // Golems participants
  exchanges: DialogueExchange[];
  context: string;
  outcome: string;
}

export interface DialogueExchange {
  speaker: string;
  message: string;
  emotion: string;
  action?: string;                 // Action accompagnant le dialogue
  timestamp: Date;
}

export interface PlanLuciform {
  type: 'plan_golem';
  name: string;
  description: string;
  tasks: PlanTask[];
  golemPersonality: GolemPersonality;
  signature: string;
  executionStrategy: string;
}

export interface PlanTask {
  id: string;
  name: string;
  description: string;
  dependencies: string[];
  estimatedComplexity: number;     // 0-666
  requiredCapabilities: string[];
  blasphemyLevel: number;
}

export interface GolemPersonality {
  traits: Record<string, number>;  // Traits 0-1
  communicationStyle: string;
  workingStyle: string;
  specialties: string[];
  quirks: string[];
}

export interface LifeGeneratorConfig {
  defaultRitualIntensity: number;
  maxAnimationDepth: number;
  enableCosmicResonance: boolean;
  signatureInjection: boolean;
  aiModel: string;
  blasphemyThreshold: number;
}
