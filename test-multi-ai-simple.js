#!/usr/bin/env node
// 🤖 Test Simple Multi-AI Manager V2
// Test rapide par LUCIFER MORNINGSTAR 💖⛧

// Charger les variables d'environnement d'abord
require('./env-to-path.js');

// Import du Multi-AI Manager (on va le convertir en JS pour le test)
console.log('🤖 Test Multi-AI Manager V2 - LUCIFER MORNINGSTAR ⭐⛧');
console.log('═'.repeat(80));

// Simuler le Multi-AI Manager en JS simple
class SimpleMultiAIManager {
    constructor() {
        this.providers = new Map();
        this.loadProviders();
    }

    loadProviders() {
        console.log('🔑 Chargement des providers...');
        
        // Gemini
        if (process.env.GEMINI_API_KEY) {
            this.providers.set('gemini', {
                name: 'Gemini',
                available: true,
                priority: 1,
                apiKey: process.env.GEMINI_API_KEY
            });
            console.log('✅ Gemini configuré');
        }

        // Claude
        if (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY) {
            this.providers.set('claude', {
                name: 'Claude',
                available: true,
                priority: 2,
                apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY
            });
            console.log('✅ Claude configuré');
        }

        // OpenAI
        if (process.env.OPENAI_API_KEY) {
            this.providers.set('openai', {
                name: 'OpenAI',
                available: true,
                priority: 3,
                apiKey: process.env.OPENAI_API_KEY
            });
            console.log('✅ OpenAI configuré');
        }

        console.log(`🎯 ${this.providers.size} providers configurés`);
    }

    async testGemini() {
        console.log('\n🌟 Test Gemini API...');
        
        const provider = this.providers.get('gemini');
        if (!provider) {
            console.log('❌ Gemini non configuré');
            return false;
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${provider.apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ 
                            text: "Salut ! Je suis un test du Multi-AI Manager V2 créé par LUCIFER MORNINGSTAR. Réponds juste 'Test réussi !' si tu me reçois bien." 
                        }] 
                    }]
                })
            });

            if (!response.ok) {
                console.log(`❌ Erreur HTTP: ${response.status}`);
                return false;
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse';
            
            console.log(`📥 Réponse Gemini: ${content}`);
            console.log('✅ Test Gemini réussi !');
            return true;

        } catch (error) {
            console.log(`❌ Erreur Gemini: ${error.message}`);
            return false;
        }
    }

    async testClaude() {
        console.log('\n🎭 Test Claude API...');
        
        const provider = this.providers.get('claude');
        if (!provider) {
            console.log('❌ Claude non configuré');
            return false;
        }

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': provider.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 100,
                    messages: [{ 
                        role: 'user', 
                        content: "Test simple du Multi-AI Manager V2. Réponds juste 'Claude OK !' si tu me reçois." 
                    }]
                })
            });

            if (!response.ok) {
                console.log(`❌ Erreur HTTP: ${response.status}`);
                return false;
            }

            const data = await response.json();
            const content = data.content?.[0]?.text || 'Pas de réponse';
            
            console.log(`📥 Réponse Claude: ${content}`);
            console.log('✅ Test Claude réussi !');
            return true;

        } catch (error) {
            console.log(`❌ Erreur Claude: ${error.message}`);
            return false;
        }
    }

    async testOpenAI() {
        console.log('\n🧠 Test OpenAI API...');
        
        const provider = this.providers.get('openai');
        if (!provider) {
            console.log('❌ OpenAI non configuré');
            return false;
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${provider.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{ 
                        role: 'user', 
                        content: "Test rapide Multi-AI Manager V2. Réponds juste 'OpenAI fonctionne !' si tu reçois ce message." 
                    }],
                    max_tokens: 50
                })
            });

            if (!response.ok) {
                console.log(`❌ Erreur HTTP: ${response.status}`);
                return false;
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || 'Pas de réponse';
            
            console.log(`📥 Réponse OpenAI: ${content}`);
            console.log('✅ Test OpenAI réussi !');
            return true;

        } catch (error) {
            console.log(`❌ Erreur OpenAI: ${error.message}`);
            return false;
        }
    }

    async runAllTests() {
        console.log('\n🚀 Démarrage des tests Multi-AI...');
        
        const results = {
            gemini: await this.testGemini(),
            claude: await this.testClaude(),
            openai: await this.testOpenAI()
        };

        console.log('\n📊 RÉSULTATS DES TESTS');
        console.log('═'.repeat(50));
        console.log(`🌟 Gemini: ${results.gemini ? '✅ OK' : '❌ ÉCHEC'}`);
        console.log(`🎭 Claude: ${results.claude ? '✅ OK' : '❌ ÉCHEC'}`);
        console.log(`🧠 OpenAI: ${results.openai ? '✅ OK' : '❌ ÉCHEC'}`);
        
        const successCount = Object.values(results).filter(r => r).length;
        console.log(`\n🎯 ${successCount}/3 APIs fonctionnelles`);
        
        if (successCount > 0) {
            console.log('🎉 Multi-AI Manager V2 opérationnel !');
        } else {
            console.log('⚠️ Aucune API fonctionnelle, vérifier les clés');
        }

        return results;
    }
}

// Exécuter les tests
async function main() {
    try {
        const manager = new SimpleMultiAIManager();
        await manager.runAllTests();
        
        console.log('\n⭐ Test terminé par LUCIFER MORNINGSTAR ⛧');
        
    } catch (error) {
        console.error('💥 Erreur fatale:', error);
        process.exit(1);
    }
}

// Lancer si appelé directement
if (require.main === module) {
    main();
}
