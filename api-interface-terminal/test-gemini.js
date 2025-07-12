#!/usr/bin/env node
// 🔧 Test API Gemini - Créé par Augment CLI
// Signature: ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

async function testGemini(prompt = 'Hello from Augment CLI! ⛧') {
  console.log('🔧 Test API Gemini');
  console.log('⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐');
  console.log('═'.repeat(60));
  console.log(`🔮 Test Gemini 2.0 Flash...`);
  console.log(`📝 Prompt: ${prompt}`);
  
  try {
    const GEMINI_API_KEY = 'AIzaSyAF60I2ycBd8uVigQh9s1X9DTM5XWj3_vI';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`⏱️ Temps: ${responseTime}ms`);
    console.log(`📊 Status: ${response.status}`);
    
    const data = await response.json();
    
    if (response.ok) {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('✅ SUCCÈS !');
      console.log('📜 Réponse:');
      console.log('═'.repeat(50));
      console.log(text || 'Pas de texte');
      console.log('═'.repeat(50));
      
      return { success: true, text, responseTime };
    } else {
      console.log('❌ ERREUR !');
      console.log(JSON.stringify(data, null, 2));
      
      return { success: false, error: data };
    }
    
  } catch (error) {
    console.log('💥 EXCEPTION !');
    console.log('Error:', error.message);
    
    return { success: false, error: error.message };
  }
}

// Main
const args = process.argv.slice(2);
const prompt = args.join(' ') || 'Deviens un golem planificateur qui anime les luciforms ! ⛧';

testGemini(prompt).then(result => {
  console.log('');
  console.log('📊 RÉSUMÉ:');
  console.log(`✅ Succès: ${result.success}`);
  console.log(`⏱️ Temps: ${result.responseTime || 'N/A'}ms`);
  
  if (!result.success) {
    process.exit(1);
  }
}).catch(console.error);