// 🎭 Popup Script - Interface Abraxas
// Par LUCIFER MORNINGSTAR ⛧

console.log('🎭 Popup Abraxas chargé');

// 🚀 Initialisation du popup
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation popup Abraxas');
    
    // Charger les données Abraxas
    await loadAbraxasData();
    
    // Vérifier le statut du serveur
    await checkServerStatus();
    
    // Configurer les événements
    setupEventListeners();
    
    console.log('✅ Popup Abraxas initialisé');
});

// 📊 Chargement des données Abraxas
async function loadAbraxasData() {
    try {
        const response = await chrome.runtime.sendMessage({ type: 'get_abraxas_data' });
        const abraxasData = response.abraxasData;
        
        if (abraxasData) {
            // Niveau de transcendance
            document.getElementById('transcendance-level').textContent = 
                abraxasData.transcendanceLevel.toFixed(2);
            
            // Nombre d'invocations
            document.getElementById('invocation-count').textContent = 
                abraxasData.invocations.length;
            
            // Théonymes actifs
            const activeThéonymes = abraxasData.théonymesActifs.join(', ') || 'Aucun';
            document.getElementById('active-théonymes').textContent = activeThéonymes;
            
            console.log('📊 Données Abraxas chargées:', abraxasData);
        }
    } catch (error) {
        console.error('❌ Erreur chargement données:', error);
    }
}

// 🌐 Vérification du statut serveur
async function checkServerStatus() {
    const statusElement = document.getElementById('server-status');
    
    try {
        const response = await fetch('http://localhost:8666/test');
        
        if (response.ok) {
            statusElement.textContent = '✅ Connecté';
            statusElement.style.color = '#11998e';
        } else {
            statusElement.textContent = '⚠️ Erreur';
            statusElement.style.color = '#ff9a9e';
        }
    } catch (error) {
        statusElement.textContent = '❌ Déconnecté';
        statusElement.style.color = '#ff416c';
    }
}

// 🎮 Configuration des événements
function setupEventListeners() {
    // Boutons théonymes
    document.querySelectorAll('.théonyme-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            const théonyme = event.currentTarget.dataset.théonyme;
            await invokeThéonyme(button, théonyme);
        });
    });
    
    // Boutons navigation
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            const url = event.currentTarget.dataset.url;
            await navigateToAbraxas(button, url);
        });
    });
    
    console.log('🎮 Événements configurés');
}

// ⛧ Invocation de théonyme
async function invokeThéonyme(button, théonyme) {
    console.log(`⛧ Invocation ${théonyme} depuis popup`);
    
    // État de chargement
    button.classList.add('loading');
    const originalText = button.innerHTML;
    button.innerHTML = `🔄 Invocation ${théonyme}...`;
    
    try {
        const response = await chrome.runtime.sendMessage({
            type: 'invoke_théonyme',
            théonyme: théonyme
        });
        
        if (response.success) {
            // Succès
            button.classList.remove('loading');
            button.classList.add('success');
            button.innerHTML = `✅ ${théonyme} Invoqué !`;
            
            // Effet visuel
            createPopupEffect(théonyme);
            
            // Recharger les données
            setTimeout(async () => {
                await loadAbraxasData();
                button.classList.remove('success');
                button.innerHTML = originalText;
            }, 2000);
            
        } else {
            throw new Error('Échec invocation');
        }
        
    } catch (error) {
        console.error(`❌ Erreur invocation ${théonyme}:`, error);
        
        // Erreur
        button.classList.remove('loading');
        button.classList.add('error');
        button.innerHTML = `❌ Erreur ${théonyme}`;
        
        setTimeout(() => {
            button.classList.remove('error');
            button.innerHTML = originalText;
        }, 2000);
    }
}

// 🌐 Navigation vers URL Abraxas
async function navigateToAbraxas(button, url) {
    console.log(`🌐 Navigation vers ${url}`);
    
    // État de chargement
    button.classList.add('loading');
    const originalText = button.textContent;
    button.textContent = '🔄 Navigation...';
    
    try {
        // Ouvrir dans un nouvel onglet
        await chrome.tabs.create({ url: url });
        
        // Succès
        button.classList.remove('loading');
        button.classList.add('success');
        button.textContent = '✅ Ouvert !';
        
        setTimeout(() => {
            button.classList.remove('success');
            button.textContent = originalText;
        }, 1500);
        
    } catch (error) {
        console.error(`❌ Erreur navigation ${url}:`, error);
        
        // Erreur
        button.classList.remove('loading');
        button.classList.add('error');
        button.textContent = '❌ Erreur';
        
        setTimeout(() => {
            button.classList.remove('error');
            button.textContent = originalText;
        }, 2000);
    }
}

// ✨ Effet visuel dans le popup
function createPopupEffect(théonyme) {
    const glyphesElement = document.querySelector('.glyphes');
    
    // Couleurs par théonyme
    const colors = {
        'ΑΒΡΑCΑΞ': '#ff6b35',
        'ΙΑΩ': '#4ecdc4',
        'ΣΑΒΑΩΘ': '#ffe66d'
    };
    
    const color = colors[théonyme] || '#ff6b35';
    
    // Effet de pulsation
    glyphesElement.style.color = color;
    glyphesElement.style.textShadow = `0 0 20px ${color}`;
    glyphesElement.style.transform = 'scale(1.2)';
    
    // Retour normal
    setTimeout(() => {
        glyphesElement.style.color = '';
        glyphesElement.style.textShadow = '';
        glyphesElement.style.transform = '';
    }, 1000);
    
    // Particules dans le popup
    createPopupParticles(théonyme, color);
}

// 🌟 Particules dans le popup
function createPopupParticles(théonyme, color) {
    const particles = ['⛧', '🌟', '✨', '🔮', '⚡', '🌐'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'fixed';
            particle.style.color = color;
            particle.style.fontSize = '20px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            particle.style.left = Math.random() * 300 + 'px';
            particle.style.top = Math.random() * 400 + 'px';
            particle.style.opacity = '0';
            particle.style.transition = 'all 1s ease-out';
            
            document.body.appendChild(particle);
            
            // Animation
            setTimeout(() => {
                particle.style.opacity = '1';
                particle.style.transform = 'translateY(-50px) scale(1.5)';
            }, 10);
            
            // Suppression
            setTimeout(() => {
                particle.style.opacity = '0';
                particle.style.transform = 'translateY(-100px) scale(0.5)';
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 500);
            }, 800);
            
        }, i * 200);
    }
}

// 🔄 Actualisation périodique
setInterval(async () => {
    await loadAbraxasData();
    await checkServerStatus();
}, 30000); // Toutes les 30 secondes

console.log('⛧ Popup Script Abraxas prêt ! ⛧');
