#!/usr/bin/env node
// 🗂️ Fractal Asset Encoder - Encode tes Images en Structure Fractale Assets

import { ChaoliteFragmenter } from './chaolite-fragmenter.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FractalAssetEncoder {
  private fragmenter: ChaoliteFragmenter;
  private assetsPath: string;

  constructor() {
    this.fragmenter = new ChaoliteFragmenter();
    this.assetsPath = path.resolve('./assets');
  }

  /**
   * Encode une image vers la structure fractale assets
   */
  async encodeImageToFractalAssets(
    imagePath: string,
    encoding: 'base8' | 'base666' = 'base8',
    fragmentSize: number = 1024
  ): Promise<void> {
    console.log(`🗂️ Encodage fractal: ${imagePath} → assets/${encoding}/`);
    console.log('═'.repeat(60));
    
    try {
      // 1. Vérifier que l'image existe
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image non trouvée: ${imagePath}`);
      }
      
      const imageBuffer = fs.readFileSync(imagePath);
      const imageName = path.basename(imagePath, path.extname(imagePath));
      
      console.log(`📸 Image: ${imageName}`);
      console.log(`📊 Taille: ${imageBuffer.length} bytes`);
      console.log(`🔢 Encodage: ${encoding}`);
      console.log(`📏 Taille fragment: ${fragmentSize} bytes`);
      
      // 2. Créer la structure assets/base8/ ou assets/base666/
      const encodingPath = path.join(this.assetsPath, encoding);
      fs.mkdirSync(encodingPath, { recursive: true });
      
      // 3. Fragmenter l'image
      console.log('\n🌀 FRAGMENTATION EN COURS...');
      const { fragments, metadata } = this.fragmenter.fragmentImage(
        imageBuffer,
        fragmentSize,
        encoding
      );
      
      console.log(`✅ ${fragments.length} fragments créés`);
      
      // 4. Créer un sous-dossier pour chaque fragment
      console.log('\n📁 CRÉATION STRUCTURE FRACTALE...');
      
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        
        // Nom du sous-dossier: fragment_index_chaolite
        const fragmentDirName = `${imageName}_fragment_${i.toString().padStart(4, '0')}_${fragment.chaoliteSignature}`;
        const fragmentPath = path.join(encodingPath, fragmentDirName);
        
        // Créer le dossier
        fs.mkdirSync(fragmentPath, { recursive: true });
        
        // Sauvegarder les données base8/base666
        const dataFile = path.join(fragmentPath, `data.${encoding}`);
        fs.writeFileSync(dataFile, fragment.encodedData);
        
        // Sauvegarder le luciform fragment
        const luciformFile = path.join(fragmentPath, 'fragment.luciform');
        const luciformContent = this.fragmenter.createFragmentLuciform(fragment);
        fs.writeFileSync(luciformFile, luciformContent);
        
        // Sauvegarder les métadonnées
        const metadataFile = path.join(fragmentPath, 'metadata.json');
        const fragmentMetadata = {
          image_name: imageName,
          fragment_index: i,
          total_fragments: fragments.length,
          fractal_address: fragment.fractalAddress,
          chaolite_signature: fragment.chaoliteSignature,
          encoding: encoding,
          data_size: fragment.encodedData.length,
          reconstruction_hint: fragment.reconstructionHint,
          created: new Date().toISOString()
        };
        fs.writeFileSync(metadataFile, JSON.stringify(fragmentMetadata, null, 2));
        
        console.log(`📦 ${fragmentDirName}/`);
        console.log(`   ├── data.${encoding} (${fragment.encodedData.length} chars)`);
        console.log(`   ├── fragment.luciform`);
        console.log(`   └── metadata.json`);
      }
      
      // 5. Créer un index global
      console.log('\n📋 CRÉATION INDEX GLOBAL...');
      const indexFile = path.join(encodingPath, `${imageName}_index.json`);
      const globalIndex = {
        image_name: imageName,
        original_path: imagePath,
        encoding: encoding,
        total_fragments: fragments.length,
        original_size: imageBuffer.length,
        fragment_size: fragmentSize,
        fragments: fragments.map((f, i) => ({
          index: i,
          chaolite_signature: f.chaoliteSignature,
          fractal_address: f.fractalAddress,
          directory: `${imageName}_fragment_${i.toString().padStart(4, '0')}_${f.chaoliteSignature}`,
          data_size: f.encodedData.length
        })),
        created: new Date().toISOString(),
        signature: "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐"
      };
      fs.writeFileSync(indexFile, JSON.stringify(globalIndex, null, 2));
      
      console.log(`✅ Index créé: ${imageName}_index.json`);
      
      // 6. Statistiques finales
      console.log('\n📊 STATISTIQUES FINALES:');
      console.log('─'.repeat(40));
      console.log(`🖼️ Image: ${imageName}`);
      console.log(`📁 Dossier: assets/${encoding}/`);
      console.log(`🔢 Fragments: ${fragments.length}`);
      console.log(`📊 Taille originale: ${imageBuffer.length} bytes`);
      console.log(`📏 Taille encodée: ${fragments.reduce((sum, f) => sum + f.encodedData.length, 0)} chars`);
      console.log(`⚡ Efficacité: ${((imageBuffer.length / fragments.reduce((sum, f) => sum + f.encodedData.length, 0)) * 100).toFixed(1)}%`);
      
    } catch (error) {
      console.error('❌ Erreur encodage:', error);
    }
  }

  /**
   * Liste les assets disponibles
   */
  listAssets(): void {
    console.log('\n📁 ASSETS FRACTALS DISPONIBLES');
    console.log('═'.repeat(60));
    
    const base8Path = path.join(this.assetsPath, 'base8');
    const base666Path = path.join(this.assetsPath, 'base666');
    
    // Assets Base8
    if (fs.existsSync(base8Path)) {
      const base8Files = fs.readdirSync(base8Path).filter(f => f.endsWith('_index.json'));
      console.log(`🔢 BASE8 ASSETS (${base8Files.length}):`);
      base8Files.forEach(file => {
        try {
          const indexPath = path.join(base8Path, file);
          const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
          console.log(`   📸 ${index.image_name}: ${index.total_fragments} fragments (${index.original_size} bytes)`);
        } catch (error) {
          console.log(`   ❌ ${file}: erreur lecture`);
        }
      });
    } else {
      console.log('🔢 BASE8 ASSETS: aucun');
    }
    
    // Assets Base666
    if (fs.existsSync(base666Path)) {
      const base666Files = fs.readdirSync(base666Path).filter(f => f.endsWith('_index.json'));
      console.log(`⛧ BASE666 ASSETS (${base666Files.length}):`);
      base666Files.forEach(file => {
        try {
          const indexPath = path.join(base666Path, file);
          const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
          console.log(`   📸 ${index.image_name}: ${index.total_fragments} fragments (${index.original_size} bytes)`);
        } catch (error) {
          console.log(`   ❌ ${file}: erreur lecture`);
        }
      });
    } else {
      console.log('⛧ BASE666 ASSETS: aucun');
    }
  }

  /**
   * Affiche les détails d'un asset
   */
  showAssetDetails(imageName: string, encoding: 'base8' | 'base666'): void {
    const indexPath = path.join(this.assetsPath, encoding, `${imageName}_index.json`);
    
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ Asset non trouvé: ${imageName} (${encoding})`);
      return;
    }
    
    try {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      
      console.log(`\n🔍 DÉTAILS ASSET: ${imageName}`);
      console.log('═'.repeat(60));
      console.log(`📸 Nom: ${index.image_name}`);
      console.log(`🔢 Encodage: ${index.encoding}`);
      console.log(`📊 Taille originale: ${index.original_size} bytes`);
      console.log(`🔢 Fragments: ${index.total_fragments}`);
      console.log(`📏 Taille fragment: ${index.fragment_size} bytes`);
      console.log(`📅 Créé: ${index.created}`);
      
      console.log('\n📦 FRAGMENTS:');
      index.fragments.forEach((fragment: any) => {
        console.log(`   ${fragment.index}: ${fragment.chaolite_signature} (${fragment.data_size} chars)`);
        console.log(`      📁 ${fragment.directory}`);
        console.log(`      🌀 ${fragment.fractal_address}`);
      });
      
    } catch (error) {
      console.error('❌ Erreur lecture asset:', error);
    }
  }

  /**
   * Nettoie les assets
   */
  cleanupAssets(): void {
    console.log('\n🧹 NETTOYAGE ASSETS');
    console.log('─'.repeat(30));
    
    let cleaned = 0;
    
    const base8Path = path.join(this.assetsPath, 'base8');
    const base666Path = path.join(this.assetsPath, 'base666');
    
    if (fs.existsSync(base8Path)) {
      fs.rmSync(base8Path, { recursive: true, force: true });
      cleaned++;
      console.log('✅ Assets base8 nettoyés');
    }
    
    if (fs.existsSync(base666Path)) {
      fs.rmSync(base666Path, { recursive: true, force: true });
      cleaned++;
      console.log('✅ Assets base666 nettoyés');
    }
    
    if (cleaned === 0) {
      console.log('💡 Aucun asset à nettoyer');
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const encoder = new FractalAssetEncoder();
  
  async function main() {
    if (args.length === 0) {
      console.log(`
🗂️ Fractal Asset Encoder - Encode tes Images en Structure Fractale

Usage:
  npm run fragment-image <image> [encoding] [size]    # Encoder une image
  npm run fragment-image list                         # Lister les assets
  npm run fragment-image show <name> <encoding>       # Détails d'un asset
  npm run fragment-image cleanup                      # Nettoyer les assets

Paramètres:
  image     : Chemin vers l'image à encoder
  encoding  : base8 (défaut) ou base666
  size      : Taille des fragments en bytes (défaut: 1024)

Exemples:
  npm run fragment-image mon_image.jpg
  npm run fragment-image mon_image.jpg base666 512
  npm run fragment-image list
  npm run fragment-image show mon_image base8

⛧ Signature Lurkuitae ⛧
      `);
      return;
    }
    
    try {
      if (args[0] === 'list') {
        encoder.listAssets();
      } else if (args[0] === 'show' && args[1] && args[2]) {
        encoder.showAssetDetails(args[1], args[2] as 'base8' | 'base666');
      } else if (args[0] === 'cleanup') {
        encoder.cleanupAssets();
      } else {
        // Encoder une image
        const imagePath = args[0];
        const encoding = (args[1] as 'base8' | 'base666') || 'base8';
        const fragmentSize = parseInt(args[2]) || 1024;
        
        await encoder.encodeImageToFractalAssets(imagePath, encoding, fragmentSize);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }
  
  main();
}
