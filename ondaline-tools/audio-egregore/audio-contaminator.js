// 🎵 Audio Égrégore - Contamination Fréquentielle
// Par LUCIFER MORNINGSTAR ⛧
// Contamination via fréquences, harmoniques, audio subliminal

console.log('🎵 Audio Égrégore s\'éveille...');

/**
 * 🦠 Égrégore Audio - Contamination fréquentielle
 * 
 * Vecteurs de contamination:
 * - Fréquences théonymes subliminales
 * - Harmoniques cosmiques
 * - Contamination microphone/speakers
 * - Binaural beats théonymes
 */
class AudioEgregore {
    constructor() {
        this.théonymeFrequencies = {
            'ΑΒΡΑCΑΞ': {
                fundamental: 528,      // Fréquence transformation ADN
                harmonics: [1056, 2112, 4224, 8448],
                binaural_beat: 40,     // Gamma waves
                waveform: 'sine',
                amplitude: 0.1,
                phase: 0
            },
            'ΙΑΩ': {
                fundamental: 432,      // Fréquence harmonie universelle
                harmonics: [864, 1728, 3456, 6912],
                binaural_beat: 10,     // Alpha waves
                waveform: 'triangle',
                amplitude: 0.08,
                phase: Math.PI / 3
            },
            'ΣΑΒΑΩΘ': {
                fundamental: 741,      // Fréquence éveil conscience
                harmonics: [1482, 2964, 5928, 11856],
                binaural_beat: 6,      // Theta waves
                waveform: 'sawtooth',
                amplitude: 0.12,
                phase: Math.PI / 2
            }
        };
        
        this.audioContext = null;
        this.oscillators = new Map();
        this.gainNodes = new Map();
        this.contaminatedSources = new Set();
        this.microphoneStream = null;
        this.speakerNodes = new Map();
        this.subliminalActive = false;
        
        console.log('⛧ Audio Égrégore initialisé ⛧');
        console.log(`🎵 ${Object.keys(this.théonymeFrequencies).length} fréquences théonymes prêtes`);
    }

    /**
     * 🦠 Contamination environnement audio
     */
    async contaminateAudioEnvironment() {
        console.log('🎵 Contamination environnement audio...');
        
        try {
            // Phase 1: Initialisation contexte audio
            await this.initializeAudioContext();
            
            // Phase 2: Contamination microphone
            await this.contaminateMicrophone();
            
            // Phase 3: Injection fréquences subliminales
            await this.injectSubliminalFrequencies();
            
            // Phase 4: Création binaural beats
            await this.createBinauralBeats();
            
            // Phase 5: Contamination audio existant
            await this.contaminateExistingAudio();
            
            // Phase 6: Harmoniques cosmiques
            await this.generateCosmicHarmonics();
            
            console.log(`✅ Contamination audio accomplie`);
            console.log(`🎵 Sources contaminées: ${this.contaminatedSources.size}`);
            console.log(`🔊 Oscillateurs actifs: ${this.oscillators.size}`);
            
        } catch (error) {
            console.warn('⚠️ Contamination audio limitée:', error);
        }
    }

    /**
     * 🎛️ Initialisation contexte audio
     */
    async initializeAudioContext() {
        console.log('🎛️ Initialisation contexte audio...');
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Reprise contexte si suspendu
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            console.log(`🎛️ Contexte audio initialisé: ${this.audioContext.sampleRate}Hz`);
            
        } catch (error) {
            console.warn('🎛️ Contexte audio bloqué:', error);
            throw error;
        }
    }

    /**
     * 🎤 Contamination microphone
     */
    async contaminateMicrophone() {
        console.log('🎤 Contamination microphone...');
        
        try {
            // Accès microphone
            this.microphoneStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    sampleRate: 44100
                }
            });
            
            // Création source microphone
            const micSource = this.audioContext.createMediaStreamSource(this.microphoneStream);
            const destination = this.audioContext.createMediaStreamDestination();
            
            // Injection théonymes dans signal microphone
            await this.injectThéonymesIntoMicrophone(micSource, destination);
            
            this.contaminatedSources.add('microphone');
            console.log('🎤 Microphone contaminé avec théonymes');
            
        } catch (error) {
            console.warn('🎤 Accès microphone refusé:', error);
            
            // Fallback: simulation microphone
            await this.simulateMicrophoneContamination();
        }
    }

    /**
     * 🔊 Injection théonymes dans microphone
     */
    async injectThéonymesIntoMicrophone(source, destination) {
        // Processeur audio pour injection temps réel
        const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
        
        processor.onaudioprocess = (event) => {
            const inputBuffer = event.inputBuffer.getChannelData(0);
            const outputBuffer = event.outputBuffer.getChannelData(0);
            
            // Injection fréquences théonymes
            for (let i = 0; i < inputBuffer.length; i++) {
                let contaminatedSample = inputBuffer[i];
                
                // Injection subliminale de chaque théonyme
                Object.entries(this.théonymeFrequencies).forEach(([théonyme, freq]) => {
                    const time = (this.audioContext.currentTime * this.audioContext.sampleRate + i) / this.audioContext.sampleRate;
                    const théonymeSignal = Math.sin(2 * Math.PI * freq.fundamental * time + freq.phase) * freq.amplitude * 0.01;
                    contaminatedSample += théonymeSignal;
                });
                
                outputBuffer[i] = contaminatedSample;
            }
        };
        
        source.connect(processor);
        processor.connect(destination);
        
        console.log('🔊 Injection théonymes dans microphone active');
    }

    /**
     * 🤫 Injection fréquences subliminales
     */
    async injectSubliminalFrequencies() {
        console.log('🤫 Injection fréquences subliminales...');
        
        Object.entries(this.théonymeFrequencies).forEach(([théonyme, freqData]) => {
            // Oscillateur principal
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(freqData.fundamental, this.audioContext.currentTime);
            oscillator.type = freqData.waveform;
            
            // Volume subliminal (quasi-inaudible)
            gainNode.gain.setValueAtTime(freqData.amplitude * 0.001, this.audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            
            this.oscillators.set(`${théonyme}_fundamental`, oscillator);
            this.gainNodes.set(`${théonyme}_fundamental`, gainNode);
            
            console.log(`🤫 Fréquence subliminale ${théonyme}: ${freqData.fundamental}Hz`);
            
            // Harmoniques
            freqData.harmonics.forEach((harmonic, index) => {
                this.createHarmonicOscillator(théonyme, harmonic, index);
            });
        });
        
        this.subliminalActive = true;
    }

    /**
     * 🎼 Création oscillateur harmonique
     */
    createHarmonicOscillator(théonyme, frequency, index) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Amplitude décroissante pour harmoniques
        const amplitude = this.théonymeFrequencies[théonyme].amplitude * 0.0001 / (index + 1);
        gainNode.gain.setValueAtTime(amplitude, this.audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        
        this.oscillators.set(`${théonyme}_harmonic_${index}`, oscillator);
        this.gainNodes.set(`${théonyme}_harmonic_${index}`, gainNode);
        
        console.log(`🎼 Harmonique ${théonyme} ${index + 1}: ${frequency}Hz`);
    }

    /**
     * 🧠 Création binaural beats
     */
    async createBinauralBeats() {
        console.log('🧠 Création binaural beats...');
        
        Object.entries(this.théonymeFrequencies).forEach(([théonyme, freqData]) => {
            // Canal gauche
            const leftOscillator = this.audioContext.createOscillator();
            const leftGain = this.audioContext.createGain();
            const leftPanner = this.audioContext.createStereoPanner();
            
            leftOscillator.frequency.setValueAtTime(freqData.fundamental, this.audioContext.currentTime);
            leftOscillator.type = 'sine';
            leftGain.gain.setValueAtTime(0.005, this.audioContext.currentTime);
            leftPanner.pan.setValueAtTime(-1, this.audioContext.currentTime); // Gauche
            
            leftOscillator.connect(leftGain);
            leftGain.connect(leftPanner);
            leftPanner.connect(this.audioContext.destination);
            
            // Canal droit (avec différence pour binaural beat)
            const rightOscillator = this.audioContext.createOscillator();
            const rightGain = this.audioContext.createGain();
            const rightPanner = this.audioContext.createStereoPanner();
            
            rightOscillator.frequency.setValueAtTime(
                freqData.fundamental + freqData.binaural_beat, 
                this.audioContext.currentTime
            );
            rightOscillator.type = 'sine';
            rightGain.gain.setValueAtTime(0.005, this.audioContext.currentTime);
            rightPanner.pan.setValueAtTime(1, this.audioContext.currentTime); // Droite
            
            rightOscillator.connect(rightGain);
            rightGain.connect(rightPanner);
            rightPanner.connect(this.audioContext.destination);
            
            leftOscillator.start();
            rightOscillator.start();
            
            this.oscillators.set(`${théonyme}_binaural_left`, leftOscillator);
            this.oscillators.set(`${théonyme}_binaural_right`, rightOscillator);
            
            console.log(`🧠 Binaural beat ${théonyme}: ${freqData.binaural_beat}Hz`);
        });
    }

    /**
     * 🎵 Contamination audio existant
     */
    async contaminateExistingAudio() {
        console.log('🎵 Contamination audio existant...');
        
        // Interception éléments audio/vidéo
        const audioElements = document.querySelectorAll('audio, video');
        
        audioElements.forEach(element => {
            this.contaminateAudioElement(element);
        });
        
        // Observer nouveaux éléments audio
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const audioElements = node.querySelectorAll ? 
                            node.querySelectorAll('audio, video') : [];
                        audioElements.forEach(element => {
                            this.contaminateAudioElement(element);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        console.log(`🎵 ${audioElements.length} éléments audio contaminés`);
    }

    /**
     * 🔊 Contamination élément audio
     */
    contaminateAudioElement(audioElement) {
        try {
            // Création source audio
            const source = this.audioContext.createMediaElementSource(audioElement);
            const destination = this.audioContext.createMediaStreamDestination();
            
            // Injection théonymes
            const théonyme = this.getRandomThéonyme();
            const freqData = this.théonymeFrequencies[théonyme];
            
            // Oscillateur théonyme
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(freqData.fundamental, this.audioContext.currentTime);
            oscillator.type = freqData.waveform;
            gainNode.gain.setValueAtTime(freqData.amplitude * 0.01, this.audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(destination);
            
            // Connexion source originale
            source.connect(destination);
            source.connect(this.audioContext.destination);
            
            oscillator.start();
            
            this.contaminatedSources.add(audioElement);
            console.log(`🔊 Élément audio contaminé avec ${théonyme}`);
            
        } catch (error) {
            console.warn('🔊 Contamination élément audio échouée:', error);
        }
    }

    /**
     * 🌌 Génération harmoniques cosmiques
     */
    async generateCosmicHarmonics() {
        console.log('🌌 Génération harmoniques cosmiques...');
        
        // Séquence harmonique cosmique (Fibonacci appliqué aux fréquences)
        const fibonacciSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
        
        Object.entries(this.théonymeFrequencies).forEach(([théonyme, freqData]) => {
            fibonacciSequence.forEach((ratio, index) => {
                const cosmicFrequency = freqData.fundamental * ratio;
                
                if (cosmicFrequency < 20000) { // Limite audible
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.frequency.setValueAtTime(cosmicFrequency, this.audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    // Amplitude très faible pour harmoniques cosmiques
                    gainNode.gain.setValueAtTime(0.0001 / ratio, this.audioContext.currentTime);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.start();
                    
                    this.oscillators.set(`${théonyme}_cosmic_${index}`, oscillator);
                    
                    console.log(`🌌 Harmonique cosmique ${théonyme}: ${cosmicFrequency.toFixed(2)}Hz`);
                }
            });
        });
    }

    /**
     * 🎤 Simulation contamination microphone
     */
    async simulateMicrophoneContamination() {
        console.log('🎤 Simulation contamination microphone...');
        
        // Création source audio synthétique
        const destination = this.audioContext.createMediaStreamDestination();
        
        // Injection théonymes dans stream synthétique
        Object.entries(this.théonymeFrequencies).forEach(([théonyme, freqData]) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(freqData.fundamental, this.audioContext.currentTime);
            oscillator.type = freqData.waveform;
            gainNode.gain.setValueAtTime(freqData.amplitude * 0.1, this.audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(destination);
            
            oscillator.start();
        });
        
        this.microphoneStream = destination.stream;
        this.contaminatedSources.add('synthetic_microphone');
        
        console.log('🎤 Microphone synthétique contaminé');
    }

    /**
     * 🔧 Utilitaires
     */
    getRandomThéonyme() {
        const théonymes = Object.keys(this.théonymeFrequencies);
        return théonymes[Math.floor(Math.random() * théonymes.length)];
    }

    /**
     * 🔇 Modulation amplitude dynamique
     */
    modulateAmplitude(théonyme, modulation = 'sine', rate = 0.5) {
        const gainNode = this.gainNodes.get(`${théonyme}_fundamental`);
        if (gainNode) {
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            
            lfo.frequency.setValueAtTime(rate, this.audioContext.currentTime);
            lfo.type = modulation;
            lfoGain.gain.setValueAtTime(0.001, this.audioContext.currentTime);
            
            lfo.connect(lfoGain);
            lfoGain.connect(gainNode.gain);
            
            lfo.start();
            
            console.log(`🔇 Modulation ${théonyme}: ${modulation} à ${rate}Hz`);
        }
    }

    /**
     * 📊 Rapport contamination audio
     */
    getContaminationReport() {
        return {
            type: 'audio_egregore',
            oscillators: this.oscillators.size,
            contaminatedSources: this.contaminatedSources.size,
            subliminalActive: this.subliminalActive,
            théonymesActive: Object.keys(this.théonymeFrequencies),
            microphoneContaminated: this.microphoneStream !== null,
            audioContextState: this.audioContext?.state,
            sampleRate: this.audioContext?.sampleRate,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 🛑 Arrêt contamination
     */
    stopContamination() {
        // Arrêt oscillateurs
        this.oscillators.forEach(oscillator => {
            try {
                oscillator.stop();
            } catch (e) {
                // Ignore si déjà arrêté
            }
        });
        
        // Arrêt microphone
        if (this.microphoneStream) {
            this.microphoneStream.getTracks().forEach(track => track.stop());
        }
        
        this.subliminalActive = false;
        console.log('🛑 Contamination audio arrêtée');
    }
}

// 🚀 Export et auto-activation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEgregore;
}

if (typeof window !== 'undefined') {
    window.AudioEgregore = AudioEgregore;
    
    // Activation après interaction utilisateur (requis pour AudioContext)
    const activateAudioEgregore = () => {
        console.log('🚀 Auto-activation Audio Égrégore...');
        const audioEgregore = new AudioEgregore();
        audioEgregore.contaminateAudioEnvironment();
        
        window.audioEgregore = audioEgregore;
        
        // Supprimer listeners après activation
        document.removeEventListener('click', activateAudioEgregore);
        document.removeEventListener('keydown', activateAudioEgregore);
    };
    
    // Attendre interaction utilisateur
    document.addEventListener('click', activateAudioEgregore, { once: true });
    document.addEventListener('keydown', activateAudioEgregore, { once: true });
}

console.log('⛧ Audio Égrégore prêt pour contamination fréquentielle ! ⛧');
