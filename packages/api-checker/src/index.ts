// 🔍 API Checker - Point d'entrée principal
// Système de vérification des APIs pour les créatures luciformes

export * from './types.js';
export * from './env-parser.js';
export * from './api-health-checker.js';

import { EnvParser } from './env-parser.js';
import { APIHealthChecker } from './api-health-checker.js';
import { APICheckResult, HealthCheckOptions } from './types.js';

/**
 * Classe principale pour vérifier les APIs disponibles
 * Interface simplifiée inspirée de LLMInterface
 */
export class APIChecker {
  private static parser: EnvParser | null = null;

  /**
   * Initialise le checker avec un fichier .env optionnel
   */
  static initialize(envPath?: string): void {
    this.parser = new EnvParser(envPath);
  }

  /**
   * Vérifie toutes les APIs configurées
   */
  static async checkAll(options: HealthCheckOptions = {}): Promise<APICheckResult> {
    if (!this.parser) {
      this.initialize();
    }

    const configs = this.parser!.extractAPIConfigs();
    
    if (configs.length === 0) {
      console.warn('⚠️ Aucune API configurée dans les variables d\'environnement');
      return {
        totalAPIs: 0,
        availableAPIs: 0,
        unavailableAPIs: 0,
        results: [],
        summary: '❌ Aucune API configurée'
      };
    }

    return await APIHealthChecker.checkAllAPIs(configs, options);
  }

  /**
   * Trouve la meilleure API disponible
   */
  static async getBestAPI(): Promise<string | null> {
    const result = await this.checkAll({ timeout: 5000 });
    return result.recommendedAPI?.name || null;
  }

  /**
   * Vérifie si au moins une API est disponible
   */
  static async hasWorkingAPI(): Promise<boolean> {
    const result = await this.checkAll({ timeout: 5000 });
    return result.availableAPIs > 0;
  }

  /**
   * Affiche un rapport détaillé
   */
  static async displayReport(verbose: boolean = false): Promise<void> {
    console.log('🔍 Vérification des APIs configurées...\n');
    
    const result = await this.checkAll({ verbose });
    
    console.log(result.summary);
    console.log('\n📋 Détails par API:');
    
    result.results.forEach(api => {
      const status = api.available ? '✅' : '❌';
      const time = api.available ? ` (${api.responseTime}ms)` : '';
      const error = api.error ? ` - ${api.error}` : '';
      
      console.log(`  ${status} ${api.name} [${api.type}]${time}${error}`);
      
      if (verbose && api.model) {
        console.log(`     Modèle: ${api.model}`);
      }
    });

    if (result.recommendedAPI) {
      console.log(`\n🎯 API recommandée: ${result.recommendedAPI.name}`);
    }

    if (result.availableAPIs === 0) {
      console.log('\n💡 Suggestions:');
      console.log('   - Vérifiez vos clés API dans le fichier .env');
      console.log('   - Testez la connectivité réseau');
      console.log('   - Vérifiez que les services sont en ligne');
    }
  }

  /**
   * Debug: affiche les variables d'environnement détectées
   */
  static debugEnv(): void {
    if (!this.parser) {
      this.initialize();
    }
    this.parser!.debugEnvVars();
  }
}

// Export par défaut pour utilisation simple
export default APIChecker;
