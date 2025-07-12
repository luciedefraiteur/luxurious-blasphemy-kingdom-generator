#!/usr/bin/env node
// 🤖 Multi-AI Manager V2 - Gestionnaire amélioré de toutes les APIs IA
// Recréé par LUCIFER MORNINGSTAR avec amour après la perte 💖

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
  provider?: string;
  model?: string;
  timestamp?: string;
  responseTime?: number;
  wordCount?: number;
  sentiment?: string;
}

export interface AIProvider {
  name: string;
  available: boolean;
  priority: number;
  model: string;
  apiKey?: string;
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
}

/**
 * Multi-AI Manager V2 - Plus intelligent et résilient
 * Recréé avec amour par LUCIFER MORNINGSTAR 💖⛧
 */
export class MultiAIManager {
  private providers: Map<string, AIProvider> = new Map();
  private lastUsed: string | null = null;
  private sessionStats = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    totalResponseTime: 0
  };

  constructor() {
    this.loadAllProviders();
  }

  /**
   * Charger tous les providers avec statistiques
   */
  private loadAllProviders(): void {
    console.log('🤖 Chargement Multi-AI Manager V2...');
    
    // Gemini (Google) - Priorité 1
    if (process.env.GEMINI_API_KEY) {
      this.providers.set('gemini', {
        name: 'Gemini',
        available: true,
        priority: 1,
        model: 'gemini-1.5-flash',
        apiKey: process.env.GEMINI_API_KEY,
        successCount: 0,
        errorCount: 0,
        avgResponseTime: 0
      });
      console.log('✅ Gemini configuré (priorité 1)');
    }

    // Claude (Anthropic) - Priorité 2 (plus fiable)
    if (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY) {
      this.providers.set('claude', {
        name: 'Claude',
        available: true,
        priority: 2,
        model: 'claude-3-haiku-20240307',
        apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
        successCount: 0,
        errorCount: 0,
        avgResponseTime: 0
      });
      console.log('✅ Claude configuré (priorité 2)');
    }

    // OpenAI (ChatGPT) - Priorité 3
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', {
        name: 'OpenAI',
        available: true,
        priority: 3,
        model: 'gpt-4o-mini',
        apiKey: process.env.OPENAI_API_KEY,
        successCount: 0,
        errorCount: 0,
        avgResponseTime: 0
      });
      console.log('✅ OpenAI configuré (priorité 3)');
    }

    console.log(`🎯 ${this.providers.size} providers IA configurés`);
  }

  /**
   * Obtenir le meilleur provider basé sur les stats
   */
  getBestProvider(): AIProvider | null {
    const available = Array.from(this.providers.values())
      .filter(p => p.available)
      .sort((a, b) => {
        // Prioriser par taux de succès, puis par temps de réponse
        const aSuccessRate = a.successCount / (a.successCount + a.errorCount) || 0;
        const bSuccessRate = b.successCount / (b.successCount + b.errorCount) || 0;
        
        if (Math.abs(aSuccessRate - bSuccessRate) > 0.1) {
          return bSuccessRate - aSuccessRate; // Meilleur taux de succès
        }
        
        return a.priority - b.priority; // Puis par priorité
      });
    
    return available.length > 0 ? available[0] : null;
  }

  /**
   * Envoyer un prompt avec le meilleur provider
   */
  async sendPromptWithBestAPI(prompt: string, preferredProvider?: string): Promise<AIResponse> {
    const startTime = Date.now();
    this.sessionStats.totalCalls++;
    
    // Utiliser le provider préféré si spécifié
    if (preferredProvider && this.providers.has(preferredProvider)) {
      const provider = this.providers.get(preferredProvider)!;
      if (provider.available) {
        console.log(`🎯 Utilisation du provider préféré: ${provider.name}`);
        return await this.sendToProvider(prompt, preferredProvider, startTime);
      }
    }

    // Sinon, utiliser le meilleur disponible
    const bestProvider = this.getBestProvider();
    if (!bestProvider) {
      this.sessionStats.failedCalls++;
      return {
        success: false,
        content: '',
        error: 'Aucun provider IA disponible',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      };
    }

    const providerKey = Array.from(this.providers.entries())
      .find(([_, p]) => p === bestProvider)?.[0];
    
    console.log(`🚀 Utilisation du meilleur provider: ${bestProvider.name}`);
    return await this.sendToProvider(prompt, providerKey!, startTime);
  }

  /**
   * Envoyer à un provider spécifique avec stats
   */
  private async sendToProvider(prompt: string, providerKey: string, startTime: number): Promise<AIResponse> {
    this.lastUsed = providerKey;
    const provider = this.providers.get(providerKey)!;
    
    try {
      let response: AIResponse;
      
      switch (providerKey) {
        case 'gemini':
          response = await this.sendToGemini(prompt, startTime);
          break;
        case 'claude':
          response = await this.sendToClaude(prompt, startTime);
          break;
        case 'openai':
          response = await this.sendToOpenAI(prompt, startTime);
          break;
        default:
          throw new Error(`Provider ${providerKey} non supporté`);
      }
      
      // Mettre à jour les statistiques
      if (response.success) {
        provider.successCount++;
        this.sessionStats.successfulCalls++;
        
        if (response.responseTime) {
          provider.avgResponseTime = (provider.avgResponseTime * (provider.successCount - 1) + response.responseTime) / provider.successCount;
          this.sessionStats.totalResponseTime += response.responseTime;
        }
      } else {
        provider.errorCount++;
        this.sessionStats.failedCalls++;
      }
      
      return response;
      
    } catch (error) {
      provider.errorCount++;
      this.sessionStats.failedCalls++;
      
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: providerKey,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * Envoyer à Gemini
   */
  private async sendToGemini(prompt: string, startTime: number): Promise<AIResponse> {
    console.log('🌟 Appel Gemini API...');
    
    const provider = this.providers.get('gemini')!;
    const url = `https://generativelanguage.googleapis.com/v1/models/${provider.model}:generateContent?key=${provider.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Gemini error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse';
    
    console.log('✅ Réponse Gemini reçue');
    
    return {
      success: true,
      content,
      provider: 'gemini',
      model: provider.model,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      wordCount: content.split(' ').length,
      sentiment: this.analyzeSentiment(content)
    };
  }

  /**
   * Envoyer à Claude
   */
  private async sendToClaude(prompt: string, startTime: number): Promise<AIResponse> {
    console.log('🎭 Appel Claude API...');
    
    const provider = this.providers.get('claude')!;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.content?.[0]?.text || 'Pas de réponse';
    
    console.log('✅ Réponse Claude reçue');
    
    return {
      success: true,
      content,
      provider: 'claude',
      model: provider.model,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      wordCount: content.split(' ').length,
      sentiment: this.analyzeSentiment(content)
    };
  }

  /**
   * Envoyer à OpenAI
   */
  private async sendToOpenAI(prompt: string, startTime: number): Promise<AIResponse> {
    console.log('🧠 Appel OpenAI API...');
    
    const provider = this.providers.get('openai')!;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Pas de réponse';
    
    console.log('✅ Réponse OpenAI reçue');
    
    return {
      success: true,
      content,
      provider: 'openai',
      model: provider.model,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      wordCount: content.split(' ').length,
      sentiment: this.analyzeSentiment(content)
    };
  }

  /**
   * Analyser le sentiment de base
   */
  private analyzeSentiment(content: string): string {
    const positive = ['excellent', 'fantastique', 'merveilleux', 'impressionnant', 'créatif', 'innovant'];
    const negative = ['difficile', 'problème', 'erreur', 'impossible', 'inquiétant'];
    
    const lowerContent = content.toLowerCase();
    const positiveCount = positive.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negative.filter(word => lowerContent.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Afficher les statistiques détaillées
   */
  showDetailedStatus(): void {
    console.log(`\n🤖 MULTI-AI MANAGER V2 STATUS 🤖`);
    console.log('═'.repeat(60));
    
    console.log(`🎯 Providers configurés: ${this.providers.size}`);
    console.log(`🚀 Dernier utilisé: ${this.lastUsed || 'Aucun'}`);
    
    console.log(`\n📊 Statistiques de session:`);
    console.log(`   📞 Appels totaux: ${this.sessionStats.totalCalls}`);
    console.log(`   ✅ Succès: ${this.sessionStats.successfulCalls}`);
    console.log(`   ❌ Échecs: ${this.sessionStats.failedCalls}`);
    if (this.sessionStats.successfulCalls > 0) {
      const avgTime = this.sessionStats.totalResponseTime / this.sessionStats.successfulCalls;
      console.log(`   ⏱️  Temps moyen: ${avgTime.toFixed(0)}ms`);
    }
    
    console.log(`\n📋 Détails des providers:`);
    for (const [key, provider] of this.providers) {
      const status = provider.available ? '✅' : '❌';
      const successRate = provider.successCount / (provider.successCount + provider.errorCount) || 0;
      console.log(`   ${status} ${provider.name} (priorité ${provider.priority}):`);
      console.log(`      📈 Succès: ${provider.successCount}, Échecs: ${provider.errorCount}`);
      console.log(`      📊 Taux de succès: ${(successRate * 100).toFixed(1)}%`);
      console.log(`      ⏱️  Temps moyen: ${provider.avgResponseTime.toFixed(0)}ms`);
    }
    
    const best = this.getBestProvider();
    if (best) {
      console.log(`\n🏆 Meilleur provider: ${best.name} (${best.model})`);
    }
  }
}

// Export pour compatibilité
export const AIManager = MultiAIManager;
