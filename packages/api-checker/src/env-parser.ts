// 🔧 Parser pour extraire les configurations d'API depuis .env
// Inspiré de luciform-core/llm_interface.ts

import { APIConfig, APIType } from './types.js';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

export class EnvParser {
  private envVars: Record<string, string> = {};

  constructor(envPath?: string) {
    // Méthode simple inspirée de llm_interface - utiliser process.env directement
    // et essayer de charger .env depuis la racine si possible
    this.loadEnvFile(envPath);
    this.envVars = process.env as Record<string, string>;
  }

  private loadEnvFile(envPath?: string): void {
    const possiblePaths = [
      envPath,
      resolve(process.cwd(), '../../../.env'),  // Depuis packages/api-checker/
      resolve(process.cwd(), '../../.env'),     // Depuis codex-lurkuitae-navigator/
      resolve(process.cwd(), '.env')            // Répertoire courant
    ].filter(Boolean) as string[];

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        try {
          const envContent = readFileSync(path, 'utf8');
          this.parseEnvContent(envContent);
          console.log(`✅ .env chargé depuis: ${path}`);
          return;
        } catch (error) {
          console.warn(`⚠️ Erreur lecture ${path}:`, error);
        }
      }
    }

    console.log('📝 Utilisation des variables d\'environnement système');
  }

  private parseEnvContent(content: string): void {
    const lines = content.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    });
  }

  /**
   * Extrait toutes les configurations d'API depuis les variables d'environnement
   */
  extractAPIConfigs(): APIConfig[] {
    const configs: APIConfig[] = [];
    
    // OpenAI APIs
    configs.push(...this.extractOpenAIConfigs());
    
    // Anthropic APIs
    configs.push(...this.extractAnthropicConfigs());
    
    // Google APIs
    configs.push(...this.extractGoogleConfigs());
    
    // Mistral APIs
    configs.push(...this.extractMistralConfigs());
    
    // Ollama APIs
    configs.push(...this.extractOllamaConfigs());
    
    // APIs personnalisées
    configs.push(...this.extractCustomConfigs());
    
    return configs.filter(config => config.apiKey || config.baseUrl);
  }

  private extractOpenAIConfigs(): APIConfig[] {
    const configs: APIConfig[] = [];
    
    // OpenAI standard
    if (this.envVars.OPENAI_API_KEY) {
      configs.push({
        name: 'OpenAI',
        type: APIType.OPENAI,
        baseUrl: this.envVars.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        apiKey: this.envVars.OPENAI_API_KEY,
        model: this.envVars.OPENAI_MODEL || 'gpt-3.5-turbo',
        testEndpoint: '/chat/completions'
      });
    }
    
    // OpenAI compatible (ex: LocalAI, Ollama avec OpenAI API)
    if (this.envVars.OPENAI_COMPATIBLE_API_KEY) {
      configs.push({
        name: 'OpenAI Compatible',
        type: APIType.OPENAI,
        baseUrl: this.envVars.OPENAI_COMPATIBLE_BASE_URL || 'http://localhost:8080/v1',
        apiKey: this.envVars.OPENAI_COMPATIBLE_API_KEY,
        model: this.envVars.OPENAI_COMPATIBLE_MODEL || 'gpt-3.5-turbo',
        testEndpoint: '/chat/completions'
      });
    }
    
    return configs;
  }

  private extractAnthropicConfigs(): APIConfig[] {
    const configs: APIConfig[] = [];
    
    if (this.envVars.ANTHROPIC_API_KEY) {
      configs.push({
        name: 'Anthropic Claude',
        type: APIType.ANTHROPIC,
        baseUrl: this.envVars.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
        apiKey: this.envVars.ANTHROPIC_API_KEY,
        model: this.envVars.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
        testEndpoint: '/v1/messages',
        headers: {
          'anthropic-version': '2023-06-01'
        }
      });
    }
    
    return configs;
  }

  private extractGoogleConfigs(): APIConfig[] {
    const configs: APIConfig[] = [];
    
    // Google Gemini
    if (this.envVars.GOOGLE_API_KEY) {
      configs.push({
        name: 'Google Gemini',
        type: APIType.GOOGLE,
        baseUrl: this.envVars.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: this.envVars.GOOGLE_API_KEY,
        model: this.envVars.GOOGLE_MODEL || 'gemini-pro',
        testEndpoint: '/models'
      });
    }
    
    return configs;
  }

  private extractMistralConfigs(): APIConfig[] {
    const configs: APIConfig[] = [];
    
    if (this.envVars.MISTRAL_API_KEY) {
      configs.push({
        name: 'Mistral AI',
        type: APIType.MISTRAL,
        baseUrl: this.envVars.MISTRAL_BASE_URL || 'https://api.mistral.ai/v1',
        apiKey: this.envVars.MISTRAL_API_KEY,
        model: this.envVars.MISTRAL_MODEL || 'mistral-medium',
        testEndpoint: '/chat/completions'
      });
    }
    
    return configs;
  }

  private extractOllamaConfigs(): APIConfig[] {
    const configs: APIConfig[] = [];
    
    // Ollama local
    const ollamaUrl = this.envVars.OLLAMA_BASE_URL || 'http://localhost:11434';
    const ollamaModel = this.envVars.OLLAMA_MODEL || 'llama2';
    
    configs.push({
      name: 'Ollama Local',
      type: APIType.OLLAMA,
      baseUrl: ollamaUrl,
      model: ollamaModel,
      testEndpoint: '/api/tags'
    });
    
    return configs;
  }

  private extractCustomConfigs(): APIConfig[] {
    const configs: APIConfig[] = [];
    
    // Rechercher des APIs personnalisées avec pattern CUSTOM_API_*
    Object.keys(this.envVars).forEach(key => {
      if (key.startsWith('CUSTOM_API_') && key.endsWith('_URL')) {
        const prefix = key.replace('_URL', '');
        const name = prefix.replace('CUSTOM_API_', '').toLowerCase();
        
        configs.push({
          name: `Custom ${name}`,
          type: APIType.CUSTOM,
          baseUrl: this.envVars[key],
          apiKey: this.envVars[`${prefix}_KEY`],
          model: this.envVars[`${prefix}_MODEL`],
          testEndpoint: this.envVars[`${prefix}_TEST_ENDPOINT`] || '/health'
        });
      }
    });
    
    return configs;
  }

  /**
   * Affiche toutes les variables d'environnement liées aux APIs
   */
  debugEnvVars(): void {
    const apiKeys = Object.keys(this.envVars).filter(key => 
      key.includes('API_KEY') || 
      key.includes('BASE_URL') || 
      key.includes('MODEL') ||
      key.includes('OPENAI') ||
      key.includes('ANTHROPIC') ||
      key.includes('GOOGLE') ||
      key.includes('MISTRAL') ||
      key.includes('OLLAMA')
    );
    
    console.log('🔍 Variables d\'environnement API détectées:');
    apiKeys.forEach(key => {
      const value = this.envVars[key];
      const maskedValue = key.includes('KEY') ? 
        (value ? `${value.substring(0, 8)}...` : 'undefined') : 
        value || 'undefined';
      console.log(`  ${key}: ${maskedValue}`);
    });
  }

  /**
   * Vérifie si au moins une API est configurée
   */
  hasAnyAPIConfigured(): boolean {
    const configs = this.extractAPIConfigs();
    return configs.length > 0;
  }
}
