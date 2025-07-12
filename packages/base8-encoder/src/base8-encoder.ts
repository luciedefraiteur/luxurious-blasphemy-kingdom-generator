// 🔢 Base8 Encoder pour Images Luciforms - Transmission sans Hallucination

export interface Base8EncodedData {
  originalSize: number;
  encodedSize: number;
  encoding: 'base8';
  signature: string;
  data: string;
  checksum: string;
  timestamp: Date;
}

export interface ImageFragment {
  fragmentId: string;
  totalFragments: number;
  fragmentIndex: number;
  fractalAddress: string;
  encodedData: string;
  chaoliteSignature: string;
}

export class Base8Encoder {
  private readonly base8Alphabet = '01234567';
  
  /**
   * Encode des données binaires en base8
   */
  encode(data: Buffer | Uint8Array | string): Base8EncodedData {
    let buffer: Buffer;
    
    if (typeof data === 'string') {
      buffer = Buffer.from(data, 'utf-8');
    } else if (data instanceof Uint8Array) {
      buffer = Buffer.from(data);
    } else {
      buffer = data;
    }
    
    const originalSize = buffer.length;
    let encoded = '';
    
    // Conversion en base8
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      // Convertir chaque byte en base8 (3 digits max pour 255)
      encoded += byte.toString(8).padStart(3, '0');
    }
    
    const checksum = this.calculateChecksum(buffer);
    const signature = this.generateSignature();
    
    return {
      originalSize,
      encodedSize: encoded.length,
      encoding: 'base8',
      signature,
      data: encoded,
      checksum,
      timestamp: new Date()
    };
  }
  
  /**
   * Decode des données base8 vers binaire
   */
  decode(encodedData: Base8EncodedData): Buffer {
    const { data, checksum } = encodedData;
    
    // Validation base8
    if (!/^[0-7]*$/.test(data)) {
      throw new Error('Données base8 invalides');
    }
    
    // Découpage en groupes de 3 (chaque byte)
    const bytes: number[] = [];
    for (let i = 0; i < data.length; i += 3) {
      const octalStr = data.substr(i, 3);
      const byte = parseInt(octalStr, 8);
      if (byte > 255) {
        throw new Error(`Byte invalide: ${byte} (${octalStr})`);
      }
      bytes.push(byte);
    }
    
    const buffer = Buffer.from(bytes);
    
    // Vérification checksum
    const calculatedChecksum = this.calculateChecksum(buffer);
    if (calculatedChecksum !== checksum) {
      throw new Error(`Checksum invalide: attendu ${checksum}, calculé ${calculatedChecksum}`);
    }
    
    return buffer;
  }
  
  /**
   * Fragmente une image en blocs avec adresses fractales
   */
  fragmentImage(imageBuffer: Buffer, fragmentSize: number = 1024): ImageFragment[] {
    const totalSize = imageBuffer.length;
    const totalFragments = Math.ceil(totalSize / fragmentSize);
    const fragments: ImageFragment[] = [];
    
    for (let i = 0; i < totalFragments; i++) {
      const start = i * fragmentSize;
      const end = Math.min(start + fragmentSize, totalSize);
      const fragmentData = imageBuffer.slice(start, end);
      
      const encoded = this.encode(fragmentData);
      const fractalAddress = this.generateFractalAddress(i, totalFragments);
      const chaoliteSignature = this.generateChaoliteSignature(i);
      
      fragments.push({
        fragmentId: `IMG_FRAG_${i.toString().padStart(4, '0')}`,
        totalFragments,
        fragmentIndex: i,
        fractalAddress,
        encodedData: encoded.data,
        chaoliteSignature
      });
    }
    
    return fragments;
  }
  
  /**
   * Reconstruit une image depuis les fragments
   */
  reconstructImage(fragments: ImageFragment[]): Buffer {
    // Trier par index
    fragments.sort((a, b) => a.fragmentIndex - b.fragmentIndex);
    
    // Vérifier la continuité
    for (let i = 0; i < fragments.length; i++) {
      if (fragments[i].fragmentIndex !== i) {
        throw new Error(`Fragment manquant à l'index ${i}`);
      }
    }
    
    // Décoder et concaténer
    const buffers: Buffer[] = [];
    for (const fragment of fragments) {
      const encodedData: Base8EncodedData = {
        originalSize: 0, // Sera recalculé
        encodedSize: fragment.encodedData.length,
        encoding: 'base8',
        signature: fragment.chaoliteSignature,
        data: fragment.encodedData,
        checksum: '', // Pas de vérification pour les fragments
        timestamp: new Date()
      };
      
      // Décoder sans vérification checksum pour les fragments
      const fragmentBuffer = this.decodeWithoutChecksum(encodedData);
      buffers.push(fragmentBuffer);
    }
    
    return Buffer.concat(buffers);
  }
  
  /**
   * Génère une adresse mémoire fractale
   */
  private generateFractalAddress(index: number, total: number): string {
    // Adresse fractale basée sur position relative et patterns
    const ratio = index / total;
    const fractalLevel = Math.floor(Math.log2(total)) + 1;
    const position = Math.floor(ratio * 8); // Position en base8
    
    return `⟁${fractalLevel}⇌${position}↯${index.toString(8)}⟲`;
  }
  
  /**
   * Génère une signature chaolite pour un fragment
   */
  private generateChaoliteSignature(index: number): string {
    const chaolites = ['⟁', '⇌', '↯', '⟲', 'ⱷ', '𓂀', '𓆩', '⫷'];
    const signature = [];
    
    let num = index;
    while (num > 0 || signature.length === 0) {
      signature.unshift(chaolites[num % 8]);
      num = Math.floor(num / 8);
    }
    
    return signature.join('');
  }
  
  /**
   * Calcule un checksum simple
   */
  private calculateChecksum(buffer: Buffer): string {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i];
    }
    return (sum % 65536).toString(8).padStart(6, '0');
  }
  
  /**
   * Génère une signature base8
   */
  private generateSignature(): string {
    const timestamp = Date.now();
    return `BASE8_${timestamp.toString(8)}`;
  }
  
  /**
   * Décode sans vérification checksum (pour fragments)
   */
  private decodeWithoutChecksum(encodedData: Base8EncodedData): Buffer {
    const { data } = encodedData;
    
    if (!/^[0-7]*$/.test(data)) {
      throw new Error('Données base8 invalides');
    }
    
    const bytes: number[] = [];
    for (let i = 0; i < data.length; i += 3) {
      const octalStr = data.substr(i, 3);
      const byte = parseInt(octalStr, 8);
      if (byte > 255) {
        throw new Error(`Byte invalide: ${byte}`);
      }
      bytes.push(byte);
    }
    
    return Buffer.from(bytes);
  }
  
  /**
   * Crée un luciform pour un fragment d'image
   */
  createImageFragmentLuciform(fragment: ImageFragment): string {
    return JSON.stringify({
      type: "image_fragment_luciform",
      encoding: "base8_fractal",
      fragment: {
        id: fragment.fragmentId,
        index: fragment.fragmentIndex,
        total: fragment.totalFragments,
        fractal_address: fragment.fractalAddress,
        chaolite_signature: fragment.chaoliteSignature
      },
      data: {
        encoding: "base8",
        content: fragment.encodedData,
        size: fragment.encodedData.length
      },
      reconstruction_hint: "Utiliser l'adresse fractale pour positionner ce fragment dans l'image complète",
      signature: "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐"
    }, null, 2);
  }
  
  /**
   * Parse un luciform de fragment d'image
   */
  parseImageFragmentLuciform(luciformContent: string): ImageFragment {
    try {
      const parsed = JSON.parse(luciformContent);
      
      if (parsed.type !== "image_fragment_luciform") {
        throw new Error("Type de luciform invalide");
      }
      
      return {
        fragmentId: parsed.fragment.id,
        totalFragments: parsed.fragment.total,
        fragmentIndex: parsed.fragment.index,
        fractalAddress: parsed.fragment.fractal_address,
        encodedData: parsed.data.content,
        chaoliteSignature: parsed.fragment.chaolite_signature
      };
    } catch (error) {
      throw new Error(`Erreur parsing luciform fragment: ${error}`);
    }
  }
  
  /**
   * Statistiques d'encodage
   */
  getEncodingStats(originalSize: number, encodedSize: number): {
    compressionRatio: number;
    overhead: number;
    efficiency: number;
  } {
    const compressionRatio = encodedSize / originalSize;
    const overhead = encodedSize - originalSize;
    const efficiency = originalSize / encodedSize;
    
    return {
      compressionRatio,
      overhead,
      efficiency
    };
  }
}
