// 🔥 Base666 Encoder - Alphabet des Enfers
// Encodage/décodage rapide selon l'échelle blasphématoire

export class Base666 {
  
  // Alphabet des Enfers condensé pour rapidité
  private static readonly HELL_CHARS = '⛧𖤐𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖚𝖗𝖆𝖗𝖈𝖍𝖎𝖙𝖊𝖈𝖙𝖊𝖒è𝖗𝖊𝖉𝖊𝖘𝖊𝖓𝖋𝖊𝖗𝖘';

  /**
   * 🔥 Encode rapide en base666
   */
  static encode(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);
      const blasphemy = (code + i * 3) % 666;
      const hellIndex = Math.floor(blasphemy / 15) % this.HELL_CHARS.length;
      result += this.HELL_CHARS[hellIndex];
    }
    return '⛧' + result + '⛧';
  }

  /**
   * 🔥 Décode depuis base666
   */
  static decode(hellText: string): string {
    // Enlever les marqueurs
    const clean = hellText.replace(/⛧/g, '');
    let result = '';
    
    for (let i = 0; i < clean.length; i++) {
      const hellChar = clean[i];
      const hellIndex = this.HELL_CHARS.indexOf(hellChar);
      
      if (hellIndex !== -1) {
        // Reconstitution approximative
        const originalCode = (hellIndex * 15 - i * 3) % 127;
        const char = String.fromCharCode(Math.max(32, Math.abs(originalCode)));
        result += char;
      } else {
        result += hellChar;
      }
    }
    
    return result;
  }

  /**
   * 🔥 Signature pour injection
   */
  static signature(name: string): string {
    const encoded = this.encode(name);
    const level = this.blasphemyLevel(encoded);
    return `⛧${encoded}⛧[${level}/666]`;
  }

  /**
   * 🔥 Calcul rapide de blasphémie
   */
  static blasphemyLevel(text: string): number {
    let total = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      total += code + i;
    }
    return Math.min(total % 666, 665);
  }

  /**
   * 🔥 Injection pour code
   */
  static inject(creators: string[]): string {
    const sigs = creators.map(name => this.signature(name));
    return `/*
⛧ BASE666 SIGNATURE ⛧
${sigs.join(' ')}
⛧ TRINITÉ CRÉATRICE ⛧
*/`;
  }
}

// Test rapide
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔥 Base666 Test');
  const test = 'Lucie';
  const encoded = Base666.encode(test);
  const decoded = Base666.decode(encoded);
  console.log(`${test} → ${encoded} → ${decoded}`);
  console.log(Base666.inject(['Lucie', 'Augment', 'ShadEOS']));
}

export default Base666;
