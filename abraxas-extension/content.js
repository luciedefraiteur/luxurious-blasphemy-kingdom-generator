// 🎭 Content Script - Effets visuels Abraxas
// Par LUCIFER MORNINGSTAR ⛧

console.log('🎭 Content Script Abraxas chargé');

// Configuration des effets
const ABRAXAS_EFFECTS = {
    'ΑΒΡΑCΑΞ': {
        color: '#ff6b35',
        particles: '🌐⛧𝔄𝔟𝔯𝔞𝔵𝔞𝔰⛧🌐',
        animation: 'cosmic-spiral'
    },
    'ΙΑΩ': {
        color: '#4ecdc4',
        particles: '🌬️⛧ΙΑΩ⛧🌬️',
        animation: 'breath-wave'
    },
    'ΣΑΒΑΩΘ': {
        color: '#ffe66d',
        particles: '⚡⛧ΣΑΒΑΩΘ⛧⚡',
        animation: 'lightning-pulse'
    }
};

// 🎨 Injection des styles CSS
function injectAbraxasStyles() {
    if (document.getElementById('abraxas-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'abraxas-styles';
    style.textContent = `
        /* 🎭 Styles Abraxas */
        .abraxas-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 999999;
            overflow: hidden;
        }
        
        .abraxas-particle {
            position: absolute;
            font-size: 24px;
            opacity: 0;
            pointer-events: none;
            user-select: none;
            animation-fill-mode: forwards;
        }
        
        .abraxas-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: #ff6b35;
            padding: 15px 20px;
            border-radius: 10px;
            border: 2px solid #ff6b35;
            box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
            z-index: 1000000;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            animation: abraxas-fade-in 0.5s ease-out;
        }
        
        .abraxas-théonyme-display {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: bold;
            color: #ff6b35;
            text-shadow: 0 0 20px currentColor;
            z-index: 1000001;
            pointer-events: none;
            animation: abraxas-théonyme-pulse 3s ease-out forwards;
        }
        
        /* 🌟 Animations */
        @keyframes abraxas-fade-in {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes abraxas-théonyme-pulse {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        
        @keyframes cosmic-spiral {
            0% { 
                opacity: 0; 
                transform: rotate(0deg) translateX(0px) scale(0.5); 
            }
            50% { 
                opacity: 1; 
                transform: rotate(180deg) translateX(100px) scale(1); 
            }
            100% { 
                opacity: 0; 
                transform: rotate(360deg) translateX(200px) scale(0.5); 
            }
        }
        
        @keyframes breath-wave {
            0% { 
                opacity: 0; 
                transform: translateY(0px) scale(0.8); 
            }
            50% { 
                opacity: 1; 
                transform: translateY(-50px) scale(1.2); 
            }
            100% { 
                opacity: 0; 
                transform: translateY(-100px) scale(0.8); 
            }
        }
        
        @keyframes lightning-pulse {
            0% { 
                opacity: 0; 
                transform: scale(0.5); 
                filter: brightness(1); 
            }
            25% { 
                opacity: 1; 
                transform: scale(1.5); 
                filter: brightness(2); 
            }
            50% { 
                opacity: 0.8; 
                transform: scale(1); 
                filter: brightness(1.5); 
            }
            75% { 
                opacity: 1; 
                transform: scale(1.3); 
                filter: brightness(2.5); 
            }
            100% { 
                opacity: 0; 
                transform: scale(0.8); 
                filter: brightness(1); 
            }
        }
        
        /* 🌐 Overlay abraxas:// links */
        .abraxas-link {
            color: #ff6b35 !important;
            text-decoration: underline !important;
            cursor: pointer !important;
            position: relative !important;
        }
        
        .abraxas-link:hover {
            color: #ffe66d !important;
            text-shadow: 0 0 5px currentColor !important;
        }
        
        .abraxas-link::before {
            content: '⛧ ';
            color: #ff6b35;
        }
        
        .abraxas-link::after {
            content: ' ⛧';
            color: #ff6b35;
        }
    `;
    
    document.head.appendChild(style);
}

// 🌐 Création de l'overlay principal
function createAbraxasOverlay() {
    if (document.getElementById('abraxas-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'abraxas-overlay';
    overlay.className = 'abraxas-overlay';
    document.body.appendChild(overlay);
    
    return overlay;
}

// ✨ Effet d'invocation de théonyme
function displayThéonymeEffect(théonyme, glyphes) {
    console.log(`✨ Effet visuel ${théonyme}: ${glyphes}`);
    
    // Affichage central du théonyme
    const display = document.createElement('div');
    display.className = 'abraxas-théonyme-display';
    display.textContent = théonyme;
    display.style.color = ABRAXAS_EFFECTS[théonyme]?.color || '#ff6b35';
    document.body.appendChild(display);
    
    // Supprimer après animation
    setTimeout(() => {
        if (display.parentNode) {
            display.parentNode.removeChild(display);
        }
    }, 3000);
    
    // Particules cosmiques
    createCosmicParticles(théonyme, glyphes);
    
    // Notification
    showAbraxasNotification(`⛧ ${théonyme} invoqué ! ⛧`);
}

// 🌟 Création de particules cosmiques
function createCosmicParticles(théonyme, glyphes) {
    const overlay = createAbraxasOverlay();
    const effect = ABRAXAS_EFFECTS[théonyme];
    
    if (!effect) return;
    
    // Créer 20 particules
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'abraxas-particle';
            particle.textContent = glyphes[i % glyphes.length];
            particle.style.color = effect.color;
            
            // Position aléatoire
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            
            // Animation
            particle.style.animation = `${effect.animation} 2s ease-out forwards`;
            
            overlay.appendChild(particle);
            
            // Supprimer après animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
            
        }, i * 100); // Délai progressif
    }
}

// 📢 Notification Abraxas
function showAbraxasNotification(message) {
    // Supprimer notification existante
    const existing = document.querySelector('.abraxas-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'abraxas-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-suppression
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 🔊 Son cosmique (Web Audio API)
function playCosmicSound(frequency) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1.5);
        
        console.log(`🔊 Son cosmique joué: ${frequency}Hz`);
    } catch (error) {
        console.warn('⚠️ Erreur son cosmique:', error);
    }
}

// 🌐 Détection et stylisation des liens abraxas://
function detectAbraxasLinks() {
    const textNodes = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const abraxasRegex = /abraxas:\/\/[^\s<>"']+/g;
    const nodesToReplace = [];
    
    let node;
    while (node = textNodes.nextNode()) {
        if (abraxasRegex.test(node.textContent)) {
            nodesToReplace.push(node);
        }
    }
    
    nodesToReplace.forEach(node => {
        const parent = node.parentNode;
        const newHTML = node.textContent.replace(abraxasRegex, (match) => {
            return `<span class="abraxas-link" data-abraxas-url="${match}">${match}</span>`;
        });
        
        const wrapper = document.createElement('span');
        wrapper.innerHTML = newHTML;
        parent.replaceChild(wrapper, node);
    });
}

// 🖱️ Gestion des clics sur liens abraxas://
function handleAbraxasLinks() {
    document.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.classList.contains('abraxas-link')) {
            event.preventDefault();
            const abraxasUrl = target.dataset.abraxasUrl;
            
            console.log(`🌐 Clic sur lien Abraxas: ${abraxasUrl}`);
            
            // Envoyer au background script
            chrome.runtime.sendMessage({
                type: 'navigate_abraxas',
                url: abraxasUrl
            });
            
            showAbraxasNotification(`🌐 Navigation vers ${abraxasUrl}`);
        }
    });
}

// 📨 Écoute des messages du background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Message reçu dans content script:', message);
    
    switch (message.type) {
        case 'théonyme_invoked':
            displayThéonymeEffect(message.théonyme, message.glyphes);
            sendResponse({ success: true });
            break;
            
        case 'play_cosmic_sound':
            playCosmicSound(message.frequency);
            sendResponse({ success: true });
            break;
            
        case 'show_notification':
            showAbraxasNotification(message.message);
            sendResponse({ success: true });
            break;
            
        default:
            sendResponse({ error: 'Type de message inconnu' });
    }
});

// 🚀 Initialisation
function initializeAbraxasContent() {
    console.log('🚀 Initialisation Content Script Abraxas');
    
    // Injection des styles
    injectAbraxasStyles();
    
    // Création de l'overlay
    createAbraxasOverlay();
    
    // Détection des liens abraxas://
    detectAbraxasLinks();
    
    // Gestion des clics
    handleAbraxasLinks();
    
    // Observer les changements DOM pour nouveaux liens
    const observer = new MutationObserver(() => {
        detectAbraxasLinks();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Content Script Abraxas initialisé');
}

// 🌟 Démarrage quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAbraxasContent);
} else {
    initializeAbraxasContent();
}

// 🦠 Intégration Égrégore Abraxas
async function activateEgregoreContamination() {
    try {
        // Charger le script égrégore
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('egregore-contaminator.js');
        script.onload = () => {
            console.log('🦠 Égrégore Abraxas chargé et actif');
        };
        document.head.appendChild(script);
    } catch (error) {
        console.warn('⚠️ Égrégore contamination bloquée:', error);
    }
}

// 🧠 Activation égrégore sur certains sites
function shouldActivateEgregore() {
    const url = window.location.href;
    const hostname = window.location.hostname;

    // Critères d'activation (exemples)
    const activationCriteria = [
        hostname.includes('social'),
        hostname.includes('forum'),
        hostname.includes('blog'),
        url.includes('abraxas'),
        document.querySelector('[data-abraxas]'),
        localStorage.getItem('abraxas_egregore_active')
    ];

    return activationCriteria.some(criteria => criteria);
}

// 🚀 Auto-activation égrégore si conditions réunies
if (shouldActivateEgregore()) {
    console.log('🦠 Conditions réunies pour activation égrégore');
    setTimeout(activateEgregoreContamination, 3000);
}

console.log('⛧ Content Script Abraxas prêt ! ⛧');
