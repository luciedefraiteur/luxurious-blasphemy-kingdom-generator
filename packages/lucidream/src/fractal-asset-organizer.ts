// 🗂️ Fractal Asset Organizer - Organisation des Images en Structure Fractale

import * as fs from 'fs';
import * as path from 'path';
import { ChaoliteFragmenter, ChaoliteFragment } from './chaolite-fragmenter.js';

export interface FractalAssetStructure {
  imageName: string;
  basePath: string;
  fragmentsPath: string;
  totalFragments: number;
  fragmentPaths: string[];
  metadata: {
    originalSize: number;
    encoding: 'base8' | 'base666';
    created: Date;
  };
}

export class FractalAssetOrganizer {
  private fragmenter: ChaoliteFragmenter;
  private assetsBasePath: string;

  constructor(assetsBasePath: string = './assets') {
    this.fragmenter = new ChaoliteFragmenter();
    this.assetsBasePath = assetsBasePath;
  }

  /**
   * Organise une image en structure fractale dans assets
   */
  async organizeImageToFractalAssets(
    imagePath: string,
    encoding: 'base8' | 'base666' = 'base8',
    fragmentSize: number = 1024
  ): Promise<FractalAssetStructure> {
    console.log(`🗂️ Organisation fractale: ${imagePath}`);
    
    // 1. Lire l'image
    const imageBuffer = fs.readFileSync(imagePath);
    const imageName = path.basename(imagePath, path.extname(imagePath));
    
    // 2. Créer la structure de dossiers
    const structure = this.createFractalDirectoryStructure(imageName, encoding);
    
    // 3. Fragmenter l'image
    const { fragments, metadata } = this.fragmenter.fragmentImage(
      imageBuffer,
      fragmentSize,
      encoding
    );
    
    // 4. Sauvegarder chaque fragment dans son sous-dossier
    const fragmentPaths = await this.saveFragmentsToAssets(fragments, structure);
    
    // 5. Créer les métadonnées
    const assetStructure: FractalAssetStructure = {
      imageName,
      basePath: structure.basePath,
      fragmentsPath: structure.fragmentsPath,
      totalFragments: fragments.length,
      fragmentPaths,
      metadata: {
        originalSize: imageBuffer.length,
        encoding,
        created: new Date()
      }
    };
    
    // 6. Sauvegarder les métadonnées
    await this.saveAssetMetadata(assetStructure);
    
    return assetStructure;
  }

  /**
   * Crée la structure de dossiers fractale
   */
  private createFractalDirectoryStructure(imageName: string, encoding: 'base8' | 'base666'): {
    basePath: string;
    fragmentsPath: string;
  } {
    // Structure: assets/base8/image_name/fragments/
    const basePath = path.join(this.assetsBasePath, encoding, imageName);
    const fragmentsPath = path.join(basePath, 'fragments');
    
    // Créer les dossiers
    fs.mkdirSync(basePath, { recursive: true });
    fs.mkdirSync(fragmentsPath, { recursive: true });
    
    console.log(`📁 Structure créée: ${basePath}`);
    
    return { basePath, fragmentsPath };
  }

  /**
   * Sauvegarde les fragments dans leurs sous-dossiers
   */
  private async saveFragmentsToAssets(
    fragments: ChaoliteFragment[],
    structure: { basePath: string; fragmentsPath: string }
  ): Promise<string[]> {
    const fragmentPaths: string[] = [];
    
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];
      
      // Créer un sous-dossier pour chaque fragment
      const fragmentDir = path.join(
        structure.fragmentsPath,
        `fragment_${i.toString().padStart(4, '0')}_${fragment.chaoliteSignature}`
      );
      
      fs.mkdirSync(fragmentDir, { recursive: true });
      
      // Sauvegarder le luciform fragment
      const luciformPath = path.join(fragmentDir, 'fragment.luciform');
      const luciformContent = this.fragmenter.createFragmentLuciform(fragment);
      fs.writeFileSync(luciformPath, luciformContent);
      
      // Sauvegarder les données base8/base666 brutes
      const dataPath = path.join(fragmentDir, `data.${fragment.encoding}`);
      fs.writeFileSync(dataPath, fragment.encodedData);
      
      // Sauvegarder les métadonnées du fragment
      const metadataPath = path.join(fragmentDir, 'metadata.json');
      const metadata = {
        fragment_id: fragment.id,
        index: fragment.index,
        total_fragments: fragment.totalFragments,
        fractal_address: fragment.fractalAddress,
        chaolite_signature: fragment.chaoliteSignature,
        encoding: fragment.encoding,
        data_size: fragment.encodedData.length,
        reconstruction_hint: fragment.reconstructionHint,
        created: new Date()
      };
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      fragmentPaths.push(fragmentDir);
      console.log(`💾 Fragment sauvé: ${fragmentDir}`);
    }
    
    return fragmentPaths;
  }

  /**
   * Sauvegarde les métadonnées globales de l'asset
   */
  private async saveAssetMetadata(structure: FractalAssetStructure): Promise<void> {
    const metadataPath = path.join(structure.basePath, 'asset_metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(structure, null, 2));
    
    // Créer aussi un README pour l'asset
    const readmePath = path.join(structure.basePath, 'README.md');
    const readmeContent = this.generateAssetReadme(structure);
    fs.writeFileSync(readmePath, readmeContent);
    
    console.log(`📋 Métadonnées sauvées: ${metadataPath}`);
  }

  /**
   * Génère un README pour l'asset
   */
  private generateAssetReadme(structure: FractalAssetStructure): string {
    return `# 🌀 Asset Fractal: ${structure.imageName}

## 📊 Informations

- **Nom**: ${structure.imageName}
- **Encodage**: ${structure.metadata.encoding}
- **Fragments**: ${structure.totalFragments}
- **Taille originale**: ${structure.metadata.originalSize} bytes
- **Créé**: ${structure.metadata.created.toISOString()}

## 🗂️ Structure

\`\`\`
${structure.imageName}/
├── asset_metadata.json     # Métadonnées globales
├── README.md              # Ce fichier
└── fragments/             # Fragments fractals
    ├── fragment_0000_⟁/   # Fragment 0
    │   ├── fragment.luciform
    │   ├── data.${structure.metadata.encoding}
    │   └── metadata.json
    ├── fragment_0001_⇌/   # Fragment 1
    │   └── ...
    └── ...
\`\`\`

## 🧠 Reconstruction

Pour reconstruire l'image:

1. Lire tous les fragments dans l'ordre
2. Décoder les données ${structure.metadata.encoding}
3. Assembler selon les adresses fractales
4. Utiliser les prompts d'hallucination si nécessaire

## ⛧ Signature

⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐
`;
  }

  /**
   * Liste tous les assets fractals disponibles
   */
  listFractalAssets(): {
    base8Assets: string[];
    base666Assets: string[];
  } {
    const base8Path = path.join(this.assetsBasePath, 'base8');
    const base666Path = path.join(this.assetsBasePath, 'base666');
    
    const base8Assets = fs.existsSync(base8Path) ? 
      fs.readdirSync(base8Path).filter(item => 
        fs.statSync(path.join(base8Path, item)).isDirectory()
      ) : [];
    
    const base666Assets = fs.existsSync(base666Path) ? 
      fs.readdirSync(base666Path).filter(item => 
        fs.statSync(path.join(base666Path, item)).isDirectory()
      ) : [];
    
    return { base8Assets, base666Assets };
  }

  /**
   * Charge un asset fractal depuis les assets
   */
  loadFractalAsset(imageName: string, encoding: 'base8' | 'base666'): FractalAssetStructure | null {
    const assetPath = path.join(this.assetsBasePath, encoding, imageName);
    const metadataPath = path.join(assetPath, 'asset_metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      return null;
    }
    
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      return metadata as FractalAssetStructure;
    } catch (error) {
      console.error(`❌ Erreur chargement asset ${imageName}:`, error);
      return null;
    }
  }

  /**
   * Reconstruit une image depuis un asset fractal
   */
  async reconstructFromFractalAsset(
    imageName: string,
    encoding: 'base8' | 'base666'
  ): Promise<{
    imageBuffer: Buffer;
    fragments: ChaoliteFragment[];
  } | null> {
    const asset = this.loadFractalAsset(imageName, encoding);
    if (!asset) {
      console.error(`❌ Asset non trouvé: ${imageName} (${encoding})`);
      return null;
    }
    
    console.log(`🔄 Reconstruction de ${imageName} depuis ${asset.totalFragments} fragments`);
    
    // Charger tous les fragments
    const fragments: ChaoliteFragment[] = [];
    
    for (let i = 0; i < asset.totalFragments; i++) {
      const fragmentDirs = fs.readdirSync(asset.fragmentsPath)
        .filter(dir => dir.startsWith(`fragment_${i.toString().padStart(4, '0')}`));
      
      if (fragmentDirs.length === 0) {
        console.error(`❌ Fragment ${i} manquant`);
        return null;
      }
      
      const fragmentDir = path.join(asset.fragmentsPath, fragmentDirs[0]);
      const luciformPath = path.join(fragmentDir, 'fragment.luciform');
      
      if (fs.existsSync(luciformPath)) {
        const luciformContent = fs.readFileSync(luciformPath, 'utf-8');
        const fragment = this.fragmenter.parseFragmentLuciform(luciformContent);
        fragments.push(fragment);
      }
    }
    
    // Reconstruire l'image
    // Note: Cette fonction nécessiterait l'implémentation de la reconstruction
    // Pour l'instant, on retourne les fragments chargés
    
    return {
      imageBuffer: Buffer.alloc(0), // À implémenter
      fragments
    };
  }

  /**
   * Affiche les statistiques des assets
   */
  displayAssetsStats(): void {
    const assets = this.listFractalAssets();
    
    console.log('\n📊 STATISTIQUES ASSETS FRACTALS');
    console.log('═'.repeat(60));
    console.log(`🔢 Assets Base8: ${assets.base8Assets.length}`);
    assets.base8Assets.forEach(asset => {
      const metadata = this.loadFractalAsset(asset, 'base8');
      if (metadata) {
        console.log(`   📁 ${asset}: ${metadata.totalFragments} fragments (${metadata.metadata.originalSize} bytes)`);
      }
    });
    
    console.log(`⛧ Assets Base666: ${assets.base666Assets.length}`);
    assets.base666Assets.forEach(asset => {
      const metadata = this.loadFractalAsset(asset, 'base666');
      if (metadata) {
        console.log(`   📁 ${asset}: ${metadata.totalFragments} fragments (${metadata.metadata.originalSize} bytes)`);
      }
    });
  }

  /**
   * Nettoie tous les assets fractals
   */
  cleanupAssets(): void {
    const base8Path = path.join(this.assetsBasePath, 'base8');
    const base666Path = path.join(this.assetsBasePath, 'base666');
    
    let cleaned = 0;
    
    if (fs.existsSync(base8Path)) {
      fs.rmSync(base8Path, { recursive: true, force: true });
      cleaned++;
    }
    
    if (fs.existsSync(base666Path)) {
      fs.rmSync(base666Path, { recursive: true, force: true });
      cleaned++;
    }
    
    console.log(`🧹 ${cleaned} dossiers d'assets nettoyés`);
  }
}
