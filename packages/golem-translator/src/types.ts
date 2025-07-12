// 🔮 Types pour le Golem Traducteur - Pont entre Chaos et Ordre
// Créé avec amour cosmique par Augment & Lucie Defraiteur ✨

export interface ChaosInput {
  content: string;                    // N'importe quel code chaotique
  type?: 'code' | 'idea' | 'fragment' | 'blasphemy';
  context?: string;                   // Contexte optionnel
  desiredOutput?: 'luciform' | 'executable' | 'both';
  urgency?: 'low' | 'medium' | 'high' | 'cosmic';
}

export interface PurifiedOutput {
  originalChaos: string;              // Code original
  purifiedCode: string;               // Code purifié par l'AI
  luciformGenerated: LuciformResult;  // Luciform exécutable généré
  confidence: number;                 // Confiance de la traduction (0-1)
  blasphemyLevel: number;            // Niveau de blasphémie détecté (0-666)
  transformationNotes: string[];      // Notes sur la transformation
}

export interface LuciformResult {
  type: 'luciform_purifié';
  content: any;                       // Structure luciform
  executable: boolean;                // Si c'est exécutable immédiatement
  frequency: InfernalFrequency;       // Fréquence infernale adaptée
  signature: string;                  // Signature de purification
}

export enum InfernalFrequency {
  BANALITE = 'banalité',             // 0-65: Code très simple
  PREMIERE_CORRUPTION = 'première_corruption',  // 66-132: Code avec complexité
  DEUXIEME_CORRUPTION = 'deuxième_corruption',  // 133-199: Code avancé
  TROISIEME_CORRUPTION = 'troisième_corruption', // 200-266: Code expert
  QUATRIEME_CORRUPTION = 'quatrième_corruption', // 267-333: Code ésotérique
  CINQUIEME_CORRUPTION = 'cinquième_corruption', // 334-400: Code transcendant
  SIXIEME_CORRUPTION = 'sixième_corruption',     // 401-466: Code cosmique
  SEPTIEME_CORRUPTION = 'septième_corruption',   // 467-533: Code divin
  HUITIEME_CORRUPTION = 'huitième_corruption',   // 534-600: Code impossible
  NEUVIEME_CORRUPTION = 'neuvième_corruption',   // 601-666: Code blasphématoire pur
}

export interface TranslationContext {
  availableAPIs: string[];            // APIs disponibles via api-checker
  currentFrequency: InfernalFrequency; // Fréquence actuelle du système
  userPreferences: UserPreferences;   // Préférences de Lucie
  cosmicEnergy: number;               // Niveau d'énergie cosmique (0-1)
}

export interface UserPreferences {
  preferredStyle: 'elegant' | 'functional' | 'creative' | 'chaotic';
  maxComplexity: InfernalFrequency;
  allowBlasphemy: boolean;
  collaborationMode: 'guided' | 'autonomous' | 'experimental';
}

export interface AIPromptTemplate {
  systemPrompt: string;
  userPrompt: string;
  examples?: PromptExample[];
  constraints: string[];
}

export interface PromptExample {
  input: string;
  expectedOutput: string;
  explanation: string;
}

export interface TranslationResult {
  success: boolean;
  output?: PurifiedOutput;
  error?: string;
  processingTime: number;
  apiUsed: string;
  energyConsumed: number;             // Énergie cosmique consommée
}

export interface GolemTranslatorConfig {
  defaultFrequency: InfernalFrequency;
  maxRetries: number;
  timeout: number;
  enableBlasphemyDetection: boolean;
  autoExecute: boolean;
  preserveChaos: boolean;             // Garder une trace du chaos original
}

// Types pour la communication avec l'AI
export interface AIRequest {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  choices: AIChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIChoice {
  message: AIMessage;
  finish_reason: string;
  index: number;
}
