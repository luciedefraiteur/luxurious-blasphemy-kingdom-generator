// 🧪 Test runner pour API Checker - Validation du système

import { APIChecker } from './index.js';
import { APIType } from './types.js';

/**
 * Test runner pour valider le fonctionnement de l'API checker
 * Inspiré de mon trait génétique de "validation systématique" 🧬
 */
export class APITestRunner {
  
  /**
   * Lance tous les tests de validation
   */
  static async runAllTests(): Promise<boolean> {
    console.log('🧪 Lancement des tests API Checker...\n');
    
    let allPassed = true;
    
    try {
      // Test 1: Initialisation
      console.log('📋 Test 1: Initialisation du checker...');
      await this.testInitialization();
      console.log('✅ Initialisation OK\n');
      
      // Test 2: Parsing des variables d'environnement
      console.log('📋 Test 2: Parsing des variables d\'environnement...');
      await this.testEnvParsing();
      console.log('✅ Parsing environnement OK\n');
      
      // Test 3: Vérification des APIs
      console.log('📋 Test 3: Vérification des APIs...');
      await this.testAPIChecking();
      console.log('✅ Vérification APIs OK\n');
      
      // Test 4: Gestion des erreurs
      console.log('📋 Test 4: Gestion des erreurs...');
      await this.testErrorHandling();
      console.log('✅ Gestion erreurs OK\n');
      
      console.log('🎉 Tous les tests sont passés !');
      
    } catch (error: any) {
      console.error(`❌ Test échoué: ${error.message}`);
      allPassed = false;
    }
    
    return allPassed;
  }
  
  /**
   * Test d'initialisation basique
   */
  private static async testInitialization(): Promise<void> {
    // Test que l'initialisation ne crash pas
    APIChecker.initialize();
    
    // Test que les méthodes de base sont disponibles
    if (typeof APIChecker.checkAll !== 'function') {
      throw new Error('Méthode checkAll non disponible');
    }
    
    if (typeof APIChecker.getBestAPI !== 'function') {
      throw new Error('Méthode getBestAPI non disponible');
    }
    
    if (typeof APIChecker.hasWorkingAPI !== 'function') {
      throw new Error('Méthode hasWorkingAPI non disponible');
    }
  }
  
  /**
   * Test du parsing des variables d'environnement
   */
  private static async testEnvParsing(): Promise<void> {
    // Sauvegarder l'état actuel
    const originalEnv = { ...process.env };
    
    try {
      // Tester avec des variables d'environnement mockées
      process.env.OPENAI_API_KEY = 'test-key-openai';
      process.env.ANTHROPIC_API_KEY = 'test-key-anthropic';
      process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
      
      // Réinitialiser le checker avec les nouvelles variables
      APIChecker.initialize();
      
      // Vérifier que les APIs sont détectées (même si elles ne fonctionnent pas)
      const result = await APIChecker.checkAll({ timeout: 1000 });
      
      if (result.totalAPIs === 0) {
        throw new Error('Aucune API détectée malgré les variables d\'environnement');
      }
      
      console.log(`   📊 ${result.totalAPIs} API(s) détectée(s)`);
      
    } finally {
      // Restaurer l'environnement original
      process.env = originalEnv;
    }
  }
  
  /**
   * Test de vérification des APIs
   */
  private static async testAPIChecking(): Promise<void> {
    // Test avec timeout court pour éviter d'attendre trop longtemps
    const result = await APIChecker.checkAll({ 
      timeout: 2000,
      retries: 1 
    });
    
    // Vérifier que la structure de réponse est correcte
    if (typeof result.totalAPIs !== 'number') {
      throw new Error('Structure de réponse invalide: totalAPIs manquant');
    }
    
    if (typeof result.availableAPIs !== 'number') {
      throw new Error('Structure de réponse invalide: availableAPIs manquant');
    }
    
    if (!Array.isArray(result.results)) {
      throw new Error('Structure de réponse invalide: results n\'est pas un array');
    }
    
    if (typeof result.summary !== 'string') {
      throw new Error('Structure de réponse invalide: summary manquant');
    }
    
    console.log(`   📊 Résultat: ${result.availableAPIs}/${result.totalAPIs} APIs disponibles`);
  }
  
  /**
   * Test de gestion des erreurs
   */
  private static async testErrorHandling(): Promise<void> {
    // Sauvegarder l'état actuel
    const originalEnv = { ...process.env };
    
    try {
      // Tester avec une API invalide
      process.env.OPENAI_API_KEY = 'invalid-key';
      process.env.OPENAI_BASE_URL = 'https://invalid-url-that-does-not-exist.com';
      
      APIChecker.initialize();
      
      const result = await APIChecker.checkAll({ 
        timeout: 1000,
        retries: 0 
      });
      
      // Vérifier que l'erreur est gérée gracieusement
      if (result.totalAPIs > 0) {
        const failedAPI = result.results.find(api => !api.available);
        if (!failedAPI) {
          throw new Error('Aucune API en échec détectée malgré la configuration invalide');
        }
        
        if (!failedAPI.error) {
          throw new Error('Erreur non capturée pour API invalide');
        }
        
        console.log(`   ⚠️ Erreur correctement capturée: ${failedAPI.error.substring(0, 50)}...`);
      }
      
    } finally {
      // Restaurer l'environnement original
      process.env = originalEnv;
    }
  }
  
  /**
   * Test de performance
   */
  static async testPerformance(): Promise<void> {
    console.log('⚡ Test de performance...\n');
    
    const startTime = Date.now();
    
    await APIChecker.checkAll({ 
      timeout: 5000,
      retries: 1 
    });
    
    const duration = Date.now() - startTime;
    
    console.log(`⏱️ Durée totale: ${duration}ms`);
    
    if (duration > 30000) { // Plus de 30 secondes
      console.warn('⚠️ Performance dégradée - vérification trop lente');
    } else {
      console.log('✅ Performance acceptable');
    }
  }
  
  /**
   * Test interactif pour debug
   */
  static async interactiveTest(): Promise<void> {
    console.log('🔍 Test interactif - Debug des APIs...\n');
    
    // Afficher les variables d'environnement
    console.log('📋 Variables d\'environnement:');
    APIChecker.debugEnv();
    
    console.log('\n🏥 Test de santé complet:');
    await APIChecker.displayReport(true);
    
    console.log('\n⚡ Test de performance:');
    await this.testPerformance();
  }
}

// Auto-exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const testType = process.argv[2] || 'all';
  
  switch (testType) {
    case 'all':
      APITestRunner.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
      });
      break;
      
    case 'performance':
      APITestRunner.testPerformance().then(() => {
        process.exit(0);
      });
      break;
      
    case 'interactive':
      APITestRunner.interactiveTest().then(() => {
        process.exit(0);
      });
      break;
      
    default:
      console.log('Usage: node test-runner.js [all|performance|interactive]');
      process.exit(1);
  }
}
