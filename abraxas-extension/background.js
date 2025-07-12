// 🌐 Background Service Worker - Extension Abraxas
// Par LUCIFER MORNINGSTAR ⛧

console.log('⛧ Extension Abraxas s\'éveille ! ⛧');

// Configuration Abraxas
const ABRAXAS_CONFIG = {
    serverUrl: 'http://localhost:8666',
    théonymes: {
        'ΑΒΡΑCΑΞ': { glyphes: '🌐⛧𝔄𝔟𝔯𝔞𝔵𝔞𝔰⛧🌐', frequency: 528 },
        'ΙΑΩ': { glyphes: '🌬️⛧ΙΑΩ⛧🌬️', frequency: 432 },
        'ΣΑΒΑΩΘ': { glyphes: '⚡⛧ΣΑΒΑΩΘ⛧⚡', frequency: 741 }
    },
    endpoints: {
        cosmic: '365.unité.chaos',
        golem: 'golem.transcendance',
        navigation: 'cosmos.navigation',
        sanctification: 'sanctification.gnostique'
    }
};

// 🔄 Installation de l'extension
chrome.runtime.onInstalled.addListener((details) => {
    console.log('🎉 Extension Abraxas installée !');
    
    if (details.reason === 'install') {
        // Première installation
        showWelcomeNotification();
        initializeAbraxasStorage();
    } else if (details.reason === 'update') {
        // Mise à jour
        console.log('🔄 Extension Abraxas mise à jour');
    }
});

// 🌐 Interception des URLs abraxas://
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.url.startsWith('abraxas://')) {
            console.log(`🌐 URL Abraxas interceptée: ${details.url}`);
            
            // Rediriger vers le serveur local
            const encodedUrl = encodeURIComponent(details.url);
            const redirectUrl = `${ABRAXAS_CONFIG.serverUrl}/abraxas?url=${encodedUrl}`;
            
            // Notifier l'utilisateur
            showAbraxasNotification(`⛧ Navigation vers ${details.url} ⛧`);
            
            return { redirectUrl: redirectUrl };
        }
    },
    { urls: ["abraxas://*/*"] },
    ["blocking"]
);

// ⚡ Gestion des commandes clavier
chrome.commands.onCommand.addListener(async (command) => {
    console.log(`⌨️ Commande reçue: ${command}`);
    
    switch (command) {
        case 'invoke-abraxas':
            await invokeThéonyme('ΑΒΡΑCΑΞ');
            break;
        case 'invoke-iao':
            await invokeThéonyme('ΙΑΩ');
            break;
        case 'invoke-sabaoth':
            await invokeThéonyme('ΣΑΒΑΩΘ');
            break;
    }
});

// 🔮 Invocation de théonyme
async function invokeThéonyme(théonyme) {
    console.log(`⛧ Invocation ${théonyme} ⛧`);
    
    try {
        const abraxasUrl = `abraxas://365.unité.chaos/invoke?théonyme=${théonyme}`;
        const serverUrl = `${ABRAXAS_CONFIG.serverUrl}/abraxas?url=${encodeURIComponent(abraxasUrl)}`;
        
        const response = await fetch(serverUrl);
        const result = await response.json();
        
        if (result.status === 'INVOKED') {
            // Succès de l'invocation
            showAbraxasNotification(`✅ ${théonyme} invoqué avec succès !`);
            
            // Envoyer aux content scripts pour effet visuel
            broadcastToContentScripts({
                type: 'théonyme_invoked',
                théonyme: théonyme,
                glyphes: result.glyphes,
                data: result.data
            });
            
            // Jouer son cosmique
            playCosmicSound(ABRAXAS_CONFIG.théonymes[théonyme].frequency);
            
            // Sauvegarder l'invocation
            await saveInvocation(théonyme, result);
            
        } else {
            showAbraxasNotification(`❌ Erreur invocation ${théonyme}`);
        }
        
    } catch (error) {
        console.error(`❌ Erreur invocation ${théonyme}:`, error);
        showAbraxasNotification(`⚠️ Serveur Abraxas indisponible`);
    }
}

// 📡 Diffusion vers content scripts
async function broadcastToContentScripts(message) {
    try {
        const tabs = await chrome.tabs.query({});
        
        for (const tab of tabs) {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, message).catch(() => {
                    // Ignore les erreurs (onglets sans content script)
                });
            }
        }
    } catch (error) {
        console.error('❌ Erreur diffusion:', error);
    }
}

// 🔊 Son cosmique (via content script)
function playCosmicSound(frequency) {
    broadcastToContentScripts({
        type: 'play_cosmic_sound',
        frequency: frequency
    });
}

// 📢 Notifications Abraxas
function showAbraxasNotification(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/abraxas-48.png',
        title: '⛧ Protocole Abraxas ⛧',
        message: message
    });
}

// 🎉 Notification de bienvenue
function showWelcomeNotification() {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/abraxas-128.png',
        title: '👑 Extension Abraxas Installée ! 👑',
        message: '⛧ Navigation gnostique activée ! Utilisez Ctrl+Shift+A pour invoquer Abraxas ⛧'
    });
}

// 💾 Initialisation du stockage
async function initializeAbraxasStorage() {
    const defaultData = {
        invocations: [],
        transcendanceLevel: 0.0,
        théonymesActifs: [],
        serverUrl: ABRAXAS_CONFIG.serverUrl,
        autoInvoke: false,
        cosmicSounds: true,
        visualEffects: true
    };
    
    await chrome.storage.local.set({ abraxasData: defaultData });
    console.log('💾 Stockage Abraxas initialisé');
}

// 📝 Sauvegarde d'invocation
async function saveInvocation(théonyme, result) {
    try {
        const { abraxasData } = await chrome.storage.local.get('abraxasData');
        
        abraxasData.invocations.push({
            théonyme: théonyme,
            timestamp: new Date().toISOString(),
            glyphes: result.glyphes,
            status: result.status
        });
        
        // Garder seulement les 100 dernières invocations
        if (abraxasData.invocations.length > 100) {
            abraxasData.invocations = abraxasData.invocations.slice(-100);
        }
        
        // Incrémenter transcendance
        abraxasData.transcendanceLevel += 0.01;
        
        // Ajouter théonyme actif
        if (!abraxasData.théonymesActifs.includes(théonyme)) {
            abraxasData.théonymesActifs.push(théonyme);
        }
        
        await chrome.storage.local.set({ abraxasData });
        console.log(`💾 Invocation ${théonyme} sauvegardée`);
        
    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
    }
}

// 🌐 Gestion des messages des content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Message reçu:', message);
    
    switch (message.type) {
        case 'invoke_théonyme':
            invokeThéonyme(message.théonyme);
            sendResponse({ success: true });
            break;
            
        case 'get_abraxas_data':
            chrome.storage.local.get('abraxasData').then(sendResponse);
            return true; // Réponse asynchrone
            
        case 'navigate_abraxas':
            chrome.tabs.create({ url: message.url });
            sendResponse({ success: true });
            break;
            
        default:
            sendResponse({ error: 'Type de message inconnu' });
    }
});

// 🔄 Vérification périodique du serveur Abraxas
setInterval(async () => {
    try {
        const response = await fetch(`${ABRAXAS_CONFIG.serverUrl}/test`);
        if (response.ok) {
            console.log('✅ Serveur Abraxas accessible');
        } else {
            console.warn('⚠️ Serveur Abraxas répond avec erreur');
        }
    } catch (error) {
        console.warn('⚠️ Serveur Abraxas indisponible');
    }
}, 5 * 60 * 1000); // Vérification toutes les 5 minutes

// 🌟 Auto-invocation (si activée)
chrome.storage.local.get('abraxasData').then(({ abraxasData }) => {
    if (abraxasData?.autoInvoke) {
        // Auto-invocation ABRAXAS toutes les 66 minutes
        setInterval(() => {
            console.log('🔄 Auto-invocation ABRAXAS (66 min)');
            invokeThéonyme('ΑΒΡΑCΑΞ');
        }, 66 * 60 * 1000);
    }
});

console.log('🌐 Service Worker Abraxas initialisé');
console.log('⛧ Navigation gnostique prête ! ⛧');
