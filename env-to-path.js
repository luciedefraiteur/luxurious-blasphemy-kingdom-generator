#!/usr/bin/env node
// 🔧 ENV-to-PATH Tool V2 - Chargement amélioré des variables d'environnement
// Recréé avec amour par LUCIFER MORNINGSTAR 💖⛧

const fs = require('fs');
const path = require('path');

/**
 * ENV-to-PATH Tool V2 - Plus robuste et sécurisé
 * Recréé avec amour par LUCIFER MORNINGSTAR 💖⛧
 */
class EnvToPathTool {
    constructor() {
        this.envFile = '.env';
        this.exportScript = 'export-env.sh';
        this.variables = new Map();
        this.apiKeys = new Map();
        this.stats = {
            totalVariables: 0,
            apiKeysFound: 0,
            injectedVariables: 0,
            verifiedVariables: 0
        };
    }

    /**
     * Exécuter l'outil complet
     */
    async run() {
        console.log('🔧 ENV-to-PATH Tool V2 - LUCIFER MORNINGSTAR ⭐⛧');
        console.log('═'.repeat(80));
        
        try {
            // 1. Vérifier/créer le fichier .env
            await this.ensureEnvFile();
            
            // 2. Parser le fichier .env
            await this.parseEnvFile();
            
            // 3. Détecter les clés API
            this.detectApiKeys();
            
            // 4. Injecter dans process.env
            this.injectIntoProcessEnv();
            
            // 5. Générer le script d'export
            await this.generateExportScript();
            
            // 6. Vérifier l'injection
            this.verifyInjection();
            
            // 7. Afficher le rapport final
            this.showFinalReport();
            
        } catch (error) {
            console.error('❌ Erreur ENV-to-PATH Tool:', error.message);
            process.exit(1);
        }
    }

    /**
     * Vérifier/créer le fichier .env
     */
    async ensureEnvFile() {
        console.log(`📁 Vérification du fichier: ${this.envFile}`);
        
        if (!fs.existsSync(this.envFile)) {
            console.log('⚠️ Fichier .env non trouvé, création d\'un exemple...');
            
            const exampleEnv = `# ⭐ Variables d'environnement - LUCIFER MORNINGSTAR ⭐
# Créé automatiquement par ENV-to-PATH Tool V2

# APIs pour l'IA (remplace par tes vraies clés)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Configuration du projet
PROJECT_NAME=spectre2
ENVIRONMENT=development
DEBUG=true

# Métriques golemiques
GOLEM_SIN_DOMINANCE=666
GOLEM_CAUSALITY=333

# Signature LUCIFER MORNINGSTAR
CREATOR=LUCIFER_MORNINGSTAR
SIGNATURE=⭐⛧LUCIFER⛧⭐
CREATION_DATE=${new Date().toISOString()}
`;
            
            fs.writeFileSync(this.envFile, exampleEnv);
            console.log('✅ Fichier .env d\'exemple créé');
            console.log('🔧 Édite le fichier .env avec tes vraies clés API');
        } else {
            console.log('✅ Fichier .env trouvé');
        }
    }

    /**
     * Parser le fichier .env avec validation
     */
    async parseEnvFile() {
        console.log(`📝 Parsing du fichier: ${this.envFile}`);
        
        const content = fs.readFileSync(this.envFile, 'utf-8');
        const lines = content.split('\n');
        
        console.log(`📝 ${lines.length} lignes trouvées`);
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Ignorer les commentaires et lignes vides
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }
            
            // Parser les variables
            const match = trimmedLine.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
            if (match) {
                const [, key, value] = match;
                
                // Nettoyer la valeur (enlever les guillemets)
                let cleanValue = value.replace(/^["']|["']$/g, '');
                
                // Vérifier que ce n'est pas un placeholder
                if (!cleanValue.includes('your_') && !cleanValue.includes('_here')) {
                    this.variables.set(key, cleanValue);
                    console.log(`✅ ${key}: ${this.maskSensitiveValue(key, cleanValue)}`);
                } else {
                    console.log(`⚠️ ${key}: Placeholder détecté, ignoré`);
                }
            }
        }
        
        this.stats.totalVariables = this.variables.size;
        console.log(`🎯 ${this.stats.totalVariables} variables valides parsées`);
    }

    /**
     * Détecter les clés API
     */
    detectApiKeys() {
        console.log('\n🔑 Détection des clés API...');
        
        const apiPatterns = [
            /API_KEY$/,
            /TOKEN$/,
            /SECRET$/,
            /PASSWORD$/
        ];
        
        for (const [key, value] of this.variables) {
            const isApiKey = apiPatterns.some(pattern => pattern.test(key));
            
            if (isApiKey) {
                this.apiKeys.set(key, value);
                console.log(`🔐 ${key}: ${this.maskSensitiveValue(key, value)}`);
            }
        }
        
        this.stats.apiKeysFound = this.apiKeys.size;
        console.log(`🎯 ${this.stats.apiKeysFound} clés API trouvées`);
    }

    /**
     * Masquer les valeurs sensibles
     */
    maskSensitiveValue(key, value) {
        const apiPatterns = [
            /API_KEY$/,
            /TOKEN$/,
            /SECRET$/,
            /PASSWORD$/
        ];
        
        const isApiKey = apiPatterns.some(pattern => pattern.test(key));
        
        if (isApiKey && value.length > 10) {
            return value.substring(0, 10) + '***' + value.slice(-4);
        }
        
        return value;
    }

    /**
     * Injecter dans process.env
     */
    injectIntoProcessEnv() {
        console.log('\n🚀 Injection des variables dans le PATH...');
        
        for (const [key, value] of this.variables) {
            process.env[key] = value;
            console.log(`✅ ${key} injecté dans le PATH`);
            this.stats.injectedVariables++;
        }
        
        console.log(`🎉 ${this.stats.injectedVariables} variables injectées avec succès !`);
    }

    /**
     * Générer le script d'export bash
     */
    async generateExportScript() {
        console.log('\n📜 Génération du script d\'export...');
        
        let scriptContent = `#!/bin/bash
# 🔧 Export Environment Variables - Généré automatiquement
# Créé par ENV-to-PATH Tool V2 - LUCIFER MORNINGSTAR ⭐⛧
# Généré le: ${new Date().toISOString()}

echo "🔑 Chargement des variables d'environnement..."

`;
        
        // Ajouter les exports
        for (const [key, value] of this.variables) {
            // Échapper les valeurs pour bash
            const escapedValue = value.replace(/"/g, '\\"');
            scriptContent += `export ${key}="${escapedValue}"\n`;
        }
        
        scriptContent += `
echo "✅ ${this.stats.injectedVariables} variables d'environnement chargées"
echo "🔐 ${this.stats.apiKeysFound} clés API configurées"
echo "⭐ Créé par LUCIFER MORNINGSTAR ⛧"
`;
        
        fs.writeFileSync(this.exportScript, scriptContent);
        
        // Rendre le script exécutable
        fs.chmodSync(this.exportScript, '755');
        
        console.log(`✅ Script généré: ${this.exportScript}`);
        console.log(`🔧 Usage: source ${this.exportScript}`);
    }

    /**
     * Vérifier l'injection
     */
    verifyInjection() {
        console.log('\n🔍 Vérification des variables injectées...');
        
        for (const [key] of this.variables) {
            if (process.env[key]) {
                console.log(`✅ ${key}: Présent dans le PATH`);
                this.stats.verifiedVariables++;
            } else {
                console.log(`❌ ${key}: Absent du PATH`);
            }
        }
        
        console.log(`📊 ${this.stats.verifiedVariables}/${this.stats.totalVariables} variables vérifiées`);
    }

    /**
     * Afficher le rapport final
     */
    showFinalReport() {
        console.log('\n📋 RAPPORT FINAL V2');
        console.log('═'.repeat(80));
        console.log(`📁 Fichier .env: ${path.resolve(this.envFile)}`);
        console.log(`📝 Variables parsées: ${this.stats.totalVariables}`);
        console.log(`🔑 Clés API détectées: ${this.stats.apiKeysFound}`);
        console.log(`🚀 Variables injectées: ${this.stats.injectedVariables}`);
        console.log(`📜 Script généré: ${this.exportScript}`);
        console.log(`✅ Vérification: ${this.stats.verifiedVariables === this.stats.totalVariables ? 'SUCCÈS' : 'PARTIEL'}`);
        
        console.log('\n🎉 ENV-to-PATH Tool V2 terminé !');
        console.log('⭐ Variables disponibles dans le PATH pour ce processus');
        console.log(`🔧 Pour les autres processus: source ${this.exportScript}`);
        console.log('💖 Recréé avec amour par LUCIFER MORNINGSTAR ⛧');
        
        // Instructions d'utilisation
        console.log('\n📖 INSTRUCTIONS:');
        console.log('1. Édite le fichier .env avec tes vraies clés API');
        console.log('2. Relance: node env-to-path.js');
        console.log(`3. Pour d'autres terminaux: source ${this.exportScript}`);
        console.log('4. Vérifie avec: echo $GEMINI_API_KEY');
    }
}

// Exécuter l'outil si appelé directement
if (require.main === module) {
    const tool = new EnvToPathTool();
    tool.run().catch(error => {
        console.error('💥 Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = EnvToPathTool;
