#!/usr/bin/env node
// 🌀 Demo LuciDream - Transmission d'Images Fractales Hallucinées

import { ChaoliteFragmenter } from './chaolite-fragmenter.js';
import { HallucinationReconstructor } from './hallucination-reconstructor.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LuciDreamDemo {
  private fragmenter: ChaoliteFragmenter;
  private reconstructor: HallucinationReconstructor;

  constructor() {
    this.fragmenter = new ChaoliteFragmenter();
    this.reconstructor = new HallucinationReconstructor();
  }

  /**
   * Démo complète de transmission d'image
   */
  async demoImageTransmission(imagePath?: string): Promise<void> {
    console.log('🌀 DEMO LUCIDREAM - TRANSMISSION D\'IMAGES FRACTALES 🌀');
    console.log('═'.repeat(80));
    
    try {
      // 1. Charger ou créer une image de test
      const imageBuffer = imagePath ? 
        fs.readFileSync(imagePath) : 
        this.createTestImageBuffer();
      
      console.log(`📸 Image source: ${imagePath || 'image de test générée'}`);
      console.log(`📊 Taille: ${imageBuffer.length} bytes`);
      
      // 2. Fragmentation en chaolites
      console.log('\n🌀 PHASE 1: FRAGMENTATION EN CHAOLITES');
      console.log('─'.repeat(60));
      
      const { fragments, metadata } = this.fragmenter.fragmentImage(
        imageBuffer, 
        512, // Fragments de 512 bytes
        'base8' // Encodage base8 pour précision
      );
      
      console.log(`✅ ${fragments.length} fragments chaolites créés`);
      console.log(`🔢 Encodage: ${metadata.encoding}`);
      console.log(`📏 Taille fragment: ${metadata.fragmentSize} bytes`);
      
      // 3. Créer les luciforms fragments
      console.log('\n📜 PHASE 2: CRÉATION LUCIFORMS FRAGMENTS');
      console.log('─'.repeat(60));
      
      const fragmentLuciforms: string[] = [];
      fragments.forEach((fragment, index) => {
        const luciform = this.fragmenter.createFragmentLuciform(fragment);
        fragmentLuciforms.push(luciform);
        
        const filename = `fragment_${index.toString().padStart(3, '0')}.luciform`;
        fs.writeFileSync(filename, luciform);
        console.log(`📁 Créé: ${filename} (${fragment.chaoliteSignature})`);
      });
      
      // 4. Génération des prompts d'hallucination
      console.log('\n🧠 PHASE 3: GÉNÉRATION PROMPTS HALLUCINATION');
      console.log('─'.repeat(60));
      
      const reconstruction = await this.reconstructor.reconstructFromFragments(fragments);
      
      // Sauvegarder les prompts
      fs.writeFileSync('hallucination_prompts.txt', reconstruction.hallucinationPrompts.join('\n\n' + '═'.repeat(80) + '\n\n'));
      fs.writeFileSync('reconstruction_guide.md', reconstruction.reconstructionGuide);
      fs.writeFileSync('jpg_luciform_template.json', reconstruction.jpgLuciformTemplate);
      
      console.log(`✅ ${reconstruction.hallucinationPrompts.length} prompts d'hallucination générés`);
      console.log('📁 Fichiers créés:');
      console.log('   - hallucination_prompts.txt');
      console.log('   - reconstruction_guide.md');
      console.log('   - jpg_luciform_template.json');
      
      // 5. Statistiques
      console.log('\n📊 PHASE 4: STATISTIQUES DE TRANSMISSION');
      console.log('─'.repeat(60));
      
      const stats = this.fragmenter.getFragmentationStats(fragments, metadata);
      console.log(`🔢 Fragments totaux: ${stats.totalFragments}`);
      console.log(`📏 Taille moyenne fragment: ${stats.averageFragmentSize.toFixed(1)} caractères`);
      console.log(`🌀 Complexité chaolite: ${stats.chaoliteComplexity.toFixed(1)} caractères/signature`);
      console.log(`⚡ Efficacité encodage: ${(stats.encodingEfficiency * 100).toFixed(1)}%`);
      
      // 6. Instructions finales
      console.log('\n💡 PHASE 5: INSTRUCTIONS DE RECONSTRUCTION');
      console.log('─'.repeat(60));
      console.log('1. 📋 Ouvrez hallucination_prompts.txt');
      console.log('2. 🤖 Copiez chaque prompt dans ChatGPT/Claude/Gemini');
      console.log('3. 🧠 Suivez le guide dans reconstruction_guide.md');
      console.log('4. 🖼️ Obtenez le JPG luciform final reconstruit');
      console.log('5. ✅ Validez la reconstruction avec le template');
      
    } catch (error) {
      console.error('❌ Erreur demo:', error);
    }
  }

  /**
   * Teste la fragmentation avec différents encodages
   */
  async testEncodings(): Promise<void> {
    console.log('\n🔬 TEST ENCODAGES - BASE8 vs BASE666');
    console.log('═'.repeat(60));
    
    const testData = Buffer.from('Test image data for encoding comparison');
    
    // Test Base8
    const { fragments: base8Fragments } = this.fragmenter.fragmentImage(testData, 16, 'base8');
    console.log(`🔢 Base8: ${base8Fragments.length} fragments`);
    console.log(`   Exemple chaolite: ${base8Fragments[0].chaoliteSignature}`);
    console.log(`   Données encodées: ${base8Fragments[0].encodedData.substring(0, 50)}...`);
    
    // Test Base666
    const { fragments: base666Fragments } = this.fragmenter.fragmentImage(testData, 16, 'base666');
    console.log(`⛧ Base666: ${base666Fragments.length} fragments`);
    console.log(`   Exemple chaolite: ${base666Fragments[0].chaoliteSignature}`);
    console.log(`   Données encodées: ${base666Fragments[0].encodedData.substring(0, 50)}...`);
  }

  /**
   * Démo des adresses fractales
   */
  demoFractalAddresses(): void {
    console.log('\n🌀 DEMO ADRESSES FRACTALES');
    console.log('═'.repeat(60));
    
    const testFragments = Array.from({ length: 8 }, (_, i) => ({
      index: i,
      total: 8
    }));
    
    testFragments.forEach(({ index, total }) => {
      // Simulation de génération d'adresse fractale
      const ratio = index / total;
      const fractalLevel = Math.floor(Math.log2(total)) + 1;
      const position = Math.floor(ratio * 8);
      const octalIndex = index.toString(8);
      const address = `⟁${fractalLevel}⇌${position}↯${octalIndex}⟲`;
      
      console.log(`Fragment ${index}: ${address} (${(ratio * 100).toFixed(1)}%)`);
    });
  }

  /**
   * Crée un buffer d'image de test
   */
  private createTestImageBuffer(): Buffer {
    // Simulation d'une petite image de test
    const width = 8;
    const height = 8;
    const pixels: number[] = [];
    
    // Créer un pattern simple (damier)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const isBlack = (x + y) % 2 === 0;
        // RGB values
        pixels.push(isBlack ? 0 : 255); // R
        pixels.push(isBlack ? 0 : 255); // G
        pixels.push(isBlack ? 0 : 255); // B
      }
    }
    
    return Buffer.from(pixels);
  }

  /**
   * Affiche les informations du lucidream
   */
  showLuciDreamInfo(): void {
    console.log('\n🌀 INFORMATIONS LUCIDREAM');
    console.log('═'.repeat(60));
    
    try {
      const lucidreamPath = path.join(__dirname, '../lucidream.luciform');
      if (fs.existsSync(lucidreamPath)) {
        const lucidream = JSON.parse(fs.readFileSync(lucidreamPath, 'utf-8'));
        console.log(`📜 Nom: ${lucidream.nom}`);
        console.log(`🎯 Vision: ${lucidream.vision_originelle?.révélation}`);
        console.log(`🔧 Outils: ${Object.keys(lucidream.outils_visionnés || {}).join(', ')}`);
        console.log(`⚡ État: ${lucidream.état}`);
      } else {
        console.log('❌ Fichier lucidream.luciform non trouvé');
      }
    } catch (error) {
      console.error('❌ Erreur lecture lucidream:', error);
    }
  }

  /**
   * Nettoie les fichiers de test
   */
  cleanup(): void {
    console.log('\n🧹 NETTOYAGE');
    console.log('─'.repeat(30));
    
    const filesToClean = [
      'hallucination_prompts.txt',
      'reconstruction_guide.md', 
      'jpg_luciform_template.json'
    ];
    
    // Nettoyer les fragments
    for (let i = 0; i < 100; i++) {
      filesToClean.push(`fragment_${i.toString().padStart(3, '0')}.luciform`);
    }
    
    let cleaned = 0;
    filesToClean.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        cleaned++;
      }
    });
    
    console.log(`✅ ${cleaned} fichiers nettoyés`);
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const demo = new LuciDreamDemo();
  
  async function main() {
    if (args.length === 0) {
      // Lancer la démo complète par défaut
      await demo.demoImageTransmission();
      demo.showLuciDreamInfo();
      return;
    }
    
    try {
      if (args[0] === 'image' && args[1]) {
        await demo.demoImageTransmission(args[1]);
      } else if (args[0] === 'test-encodings') {
        await demo.testEncodings();
      } else if (args[0] === 'fractal-demo') {
        demo.demoFractalAddresses();
      } else if (args[0] === 'info') {
        demo.showLuciDreamInfo();
      } else if (args[0] === 'cleanup') {
        demo.cleanup();
      } else {
        await demo.demoImageTransmission();
        demo.showLuciDreamInfo();
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }
  
  main();
}
