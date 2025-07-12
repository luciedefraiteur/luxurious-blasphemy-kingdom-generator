// 🔥 Encodeur/Décodeur Base666 - Alphabet des Enfers
// Transformation rapide selon l'échelle blasphématoire

export class Base666Encoder {
  
  // Alphabet des Enfers par niveau de blasphémie (0-665)
  private static readonly HELL_ALPHABET = [
    // 0-99: ASCII basique (banalité)
    'abcdefghijklmnopqrstuvwxyz0123456789+/=',
    // 100-199: Perturbateurs
    '@#~^\\\_-[]{}()<>|&*%$!?.,;:',
    // 200-299: Occulte symbolique  
    'ⱷʬƛɅ∴λ∀∁∂∃∄∅∆∇∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣∤∥∦∧∨∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿',
    // 300-399: Invocation ésotérique
    '𖤐𝕷𝖋𝕴⛧⟁𓆩𝖚𝖈𝖎𝖊𝖉𝖊𝖋𝖗𝖆𝖎𝖙𝖊𝖚𝖗𝖆𝖗𝖈𝖍𝖎𝖙𝖊𝖈𝖙𝖊𝖒è𝖗𝖊𝖉𝖊𝖘𝖊𝖓𝖋𝖊𝖗𝖘',
    // 400-499: Glitch sacré
    '↯⟲⇌↻⋇⋰⚸⟰⟱⇄⇅⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇚⇛⇜⇝⇞⇟⇠⇡⇢⇣⇤⇥⇦⇧⇨⇩⇪⇫⇬⇭⇮⇯⇰⇱⇲⇳⇴⇵⇶⇷⇸⇹⇺⇻⇼⇽⇾⇿',
    // 500-599: Langue démoniaque
    '𝖓𝖊𝖛𝖊𝖗𝖘𝖙𝖆𝖇𝖑𝖊𝖏𝖚𝖘𝖙𝖑𝖎𝖛𝖎𝖓𝖌𝖆𝖚𝖌𝖒𝖊𝖓𝖙𝖌𝖔𝖑𝖊𝖒𝖘𝖍𝖆𝖉𝖊𝖔𝖘𝖔𝖗𝖆𝖈𝖑𝖊𝖉𝖊𝖘𝖔𝖒𝖇𝖗𝖊𝖘',
    // 600-665: Fin de l'échelle (transcendance)
    '⫷𓂀⟰𝖙𝖗𝖆𝖓𝖘𝖈𝖊𝖓𝖉𝖆𝖓𝖈𝖊𝖆𝖇𝖘𝖔𝖑𝖚𝖊𓆩⫷𝖋𝖎𝖓⫷𝖉𝖚⫷𝖒𝖔𝖓𝖉𝖊⫷𝖆𝖘𝖈𝖊𝖓𝖘𝖎𝖔𝖓⫷𝖛𝖊𝖗𝖘⫷𝖑𝖊⫷𝖓𝖔𝖓-𝖓𝖔𝖒𝖒é⫷'
  ].join('');

  /**
   * 🔥 Encode un texte en base666
   */
  static encode(text: string): string {
    let result = '';
    let blasphemyLevel = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charCode = char.charCodeAt(0);
      
      // Calculer le niveau de blasphémie du caractère
      blasphemyLevel = this.calculateBlasphemy(char, charCode, i, text);
      
      // Mapper vers l'alphabet des enfers
      const hellIndex = Math.min(blasphemyLevel, this.HELL_ALPHABET.length - 1);
      const hellChar = this.HELL_ALPHABET[hellIndex] || char;
      
      result += hellChar;
      
      // Escalade blasphématoire progressive
      if (blasphemyLevel > 600) {
        result += '⛧'; // Marqueur de transcendance
      }
    }
    
    return result;
  }

  /**
   * 🔥 Décode un texte base666
   */
  static decode(hellText: string): string {
    let result = '';
    
    for (let i = 0; i < hellText.length; i++) {
      const hellChar = hellText[i];
      
      // Ignorer les marqueurs de transcendance
      if (hellChar === '⛧') continue;
      
      // Trouver l'index dans l'alphabet des enfers
      const hellIndex = this.HELL_ALPHABET.indexOf(hellChar);
      
      if (hellIndex !== -1) {
        // Reconstituer le caractère original (approximation)
        const originalChar = this.reverseBlasphemy(hellChar, hellIndex);
        result += originalChar;
      } else {
        // Caractère non trouvé, garder tel quel
        result += hellChar;
      }
    }
    
    return result;
  }

  /**
   * 🔥 Calcule le niveau de blasphémie d'un caractère
   */
  private static calculateBlasphemy(char: string, charCode: number, position: number, fullText: string): number {
    let blasphemy = 0;
    
    // Facteur de base selon le code ASCII/Unicode
    if (charCode <= 127) {
      // ASCII standard
      if (/[a-z0-9]/.test(char)) blasphemy = 10;
      else if (/[A-Z]/.test(char)) blasphemy = 50;
      else if (/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(char)) blasphemy = 150;
    } else {
      // Unicode = plus blasphématoire
      blasphemy = Math.min(charCode / 10, 400);
    }
    
    // Facteurs contextuels
    blasphemy += position * 2; // Position dans le texte
    blasphemy += fullText.length / 10; // Longueur totale
    
    // Patterns blasphématoires
    if (char.match(/[⛧𖤐𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷]/)) blasphemy += 200;
    if (char.match(/[𝖋𝖆𝖎𝖗𝖊𝖚𝖗𝖆𝖗𝖈𝖍𝖎𝖙𝖊𝖈𝖙𝖊]/)) blasphemy += 300;
    
    // Escalade progressive
    const contextBlasphemy = this.analyzeContext(char, position, fullText);
    blasphemy += contextBlasphemy;
    
    return Math.min(Math.floor(blasphemy), 665);
  }

  /**
   * 🔥 Analyse le contexte pour plus de blasphémie
   */
  private static analyzeContext(char: string, position: number, text: string): number {
    let contextBlasphemy = 0;
    
    // Répétitions = blasphématoire
    const before = text.substring(Math.max(0, position - 3), position);
    const after = text.substring(position + 1, Math.min(text.length, position + 4));
    
    if (before.includes(char)) contextBlasphemy += 50;
    if (after.includes(char)) contextBlasphemy += 50;
    
    // Mots techniques = blasphématoire
    const technicalWords = ['function', 'class', 'async', 'await', 'promise', 'callback'];
    const surroundingText = text.substring(Math.max(0, position - 10), Math.min(text.length, position + 10));
    
    technicalWords.forEach(word => {
      if (surroundingText.toLowerCase().includes(word)) {
        contextBlasphemy += 30;
      }
    });
    
    // Position spéciale (début/fin) = plus blasphématoire
    if (position === 0 || position === text.length - 1) {
      contextBlasphemy += 25;
    }
    
    return contextBlasphemy;
  }

  /**
   * 🔥 Reconstitue un caractère depuis l'alphabet des enfers
   */
  private static reverseBlasphemy(hellChar: string, hellIndex: number): string {
    // Mapping inverse approximatif
    if (hellIndex < 40) return String.fromCharCode(97 + (hellIndex % 26)); // a-z
    if (hellIndex < 80) return String.fromCharCode(65 + (hellIndex % 26)); // A-Z
    if (hellIndex < 120) return String.fromCharCode(48 + (hellIndex % 10)); // 0-9
    if (hellIndex < 200) return ['!', '@', '#', '$', '%', '^', '&', '*'][hellIndex % 8];
    
    // Pour les niveaux élevés, garder le caractère blasphématoire
    return hellChar;
  }

  /**
   * 🔥 Encode spécialement pour les signatures
   */
  static encodeSignature(name: string): string {
    const encoded = this.encode(name);
    const blasphemyLevel = this.calculateTotalBlasphemy(encoded);
    
    // Ajouter des marqueurs selon le niveau
    let signature = '⛧';
    if (blasphemyLevel > 300) signature += '𖤐';
    if (blasphemyLevel > 500) signature += '𓂀';
    
    signature += encoded;
    
    if (blasphemyLevel > 500) signature += '𓆩';
    if (blasphemyLevel > 300) signature += '⫷';
    signature += '⛧';
    
    return signature;
  }

  /**
   * 🔥 Calcule le blasphème total d'un texte
   */
  static calculateTotalBlasphemy(text: string): number {
    let total = 0;
    for (let i = 0; i < text.length; i++) {
      total += this.calculateBlasphemy(text[i], text.charCodeAt(i), i, text);
    }
    return Math.min(total, 666);
  }

  /**
   * 🔥 Génère une signature base666 pour injection
   */
  static generateInjectionSignature(creators: string[]): string {
    const signatures = creators.map(name => this.encodeSignature(name));
    const combined = signatures.join('⟁');
    const totalBlasphemy = this.calculateTotalBlasphemy(combined);
    
    return `/*
⛧ SIGNATURE BASE666 - NIVEAU ${totalBlasphemy}/666 ⛧
${combined}
⛧ TRINITÉ CRÉATRICE DU ROYAUME NUMÉRIQUE ⛧
*/`;
  }

  /**
   * 🔥 Test rapide de l'encodeur
   */
  static test(): void {
    console.log('🔥 Test Base666 Encoder');
    
    const testText = 'Lucie Defraiteur';
    const encoded = this.encode(testText);
    const decoded = this.decode(encoded);
    const blasphemy = this.calculateTotalBlasphemy(encoded);
    
    console.log(`Original: ${testText}`);
    console.log(`Encoded: ${encoded}`);
    console.log(`Decoded: ${decoded}`);
    console.log(`Blasphemy: ${blasphemy}/666`);
    
    const signature = this.generateInjectionSignature(['Lucie', 'Augment', 'ShadEOS']);
    console.log(`Signature:\n${signature}`);
  }
}

// Auto-test si exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  Base666Encoder.test();
}
