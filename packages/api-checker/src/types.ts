// 🔍 Types pour le vérificateur d'APIs

export interface APIConfig {
  name: string;
  type: APIType;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  headers?: Record<string, string>;
  testEndpoint?: string;
  testPayload?: any;
}

export enum APIType {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  MISTRAL = 'mistral',
  OLLAMA = 'ollama',
  CUSTOM = 'custom'
}

export interface APIStatus {
  name: string;
  type: APIType;
  available: boolean;
  responseTime: number;
  error?: string;
  model?: string;
  rateLimit?: RateLimitInfo;
  lastChecked: Date;
}

export interface RateLimitInfo {
  requestsPerMinute?: number;
  requestsRemaining?: number;
  resetTime?: Date;
}

export interface APICheckResult {
  totalAPIs: number;
  availableAPIs: number;
  unavailableAPIs: number;
  fastestAPI?: APIStatus;
  recommendedAPI?: APIStatus;
  results: APIStatus[];
  summary: string;
}

export interface HealthCheckOptions {
  timeout?: number;
  retries?: number;
  includeModelTest?: boolean;
  verbose?: boolean;
}

export interface TestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface APITestPayload {
  messages?: TestMessage[];
  prompt?: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
}
