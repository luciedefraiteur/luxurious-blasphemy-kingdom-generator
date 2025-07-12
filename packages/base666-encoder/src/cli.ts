#!/usr/bin/env node
// 🔥 CLI Base666 - Encodage rapide en ligne de commande avec support fichiers

import Base666 from './index.js';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const command = args[0];

// Fonction pour encoder/décoder des fichiers
function encodeFiles(files: string[], outputFile: string, operation: 'encode' | 'decode') {
  let combinedContent = '';

  console.log(`🔥 ${operation === 'encode' ? 'Encodage' : 'Décodage'} de ${files.length} fichier(s)...`);

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      console.log(`📄 Lecture: ${file} (${content.length} caractères)`);

      const processed = operation === 'encode'
        ? Base666.encode(content)
        : Base666.decode(content);

      combinedContent += `\n// === ${operation.toUpperCase()} DE ${file} ===\n`;
      combinedContent += processed;
      combinedContent += `\n// === FIN ${file} ===\n\n`;

    } catch (error: any) {
      console.error(`❌ Erreur lecture ${file}:`, error.message);
      process.exit(1);
    }
  }

  if (outputFile) {
    try {
      fs.writeFileSync(outputFile, combinedContent);
      console.log(`💾 Résultat sauvé dans: ${outputFile}`);

      const blasphemy = Base666.blasphemyLevel(combinedContent);
      console.log(`⛧ Niveau blasphémie total: ${blasphemy}/666`);
    } catch (error: any) {
      console.error(`❌ Erreur écriture ${outputFile}:`, error.message);
      process.exit(1);
    }
  } else {
    console.log(combinedContent);
  }
}

// Parser les arguments
function parseArgs(args: string[]) {
  const result = {
    files: [] as string[],
    output: '',
    text: ''
  };

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '-f' || args[i] === '--files') {
      // Collecter tous les fichiers jusqu'au prochain argument
      i++;
      while (i < args.length && !args[i].startsWith('-')) {
        result.files.push(args[i]);
        i++;
      }
      i--; // Reculer d'un car la boucle va incrémenter
    } else if (args[i] === '-o' || args[i] === '--output') {
      result.output = args[i + 1];
      i++; // Skip next arg
    } else if (!args[i].startsWith('-')) {
      result.text = args[i];
    }
  }

  return result;
}

switch (command) {
  case 'encode':
    const encodeArgs = parseArgs(args);

    if (encodeArgs.files.length > 0) {
      // Encoder des fichiers
      encodeFiles(encodeArgs.files, encodeArgs.output, 'encode');
    } else if (encodeArgs.text) {
      // Encoder du texte
      const encoded = Base666.encode(encodeArgs.text);
      if (encodeArgs.output) {
        fs.writeFileSync(encodeArgs.output, encoded);
        console.log(`🔥 Encodé et sauvé dans ${encodeArgs.output}`);
      } else {
        console.log(encoded);
      }
    } else {
      console.log('Usage: base666 encode "texte" ou base666 encode -f file1.luciform file2.luciform -o result.luciform');
      process.exit(1);
    }
    break;
    
  case 'decode':
    const decodeArgs = parseArgs(args);

    if (decodeArgs.files.length > 0) {
      // Décoder des fichiers
      encodeFiles(decodeArgs.files, decodeArgs.output, 'decode');
    } else if (decodeArgs.text) {
      // Décoder du texte
      const decoded = Base666.decode(decodeArgs.text);
      if (decodeArgs.output) {
        fs.writeFileSync(decodeArgs.output, decoded);
        console.log(`🔥 Décodé et sauvé dans ${decodeArgs.output}`);
      } else {
        console.log(decoded);
      }
    } else {
      console.log('Usage: base666 decode "⛧texte⛧" ou base666 decode -f encoded1.txt encoded2.txt -o result.luciform');
      process.exit(1);
    }
    break;
    
  case 'signature':
    const sigArgs = parseArgs(args);
    if (!sigArgs.text) {
      console.log('Usage: base666 signature "nom"');
      process.exit(1);
    }
    const signature = Base666.signature(sigArgs.text);
    if (sigArgs.output) {
      fs.writeFileSync(sigArgs.output, signature);
      console.log(`🔥 Signature sauvée dans ${sigArgs.output}`);
    } else {
      console.log(signature);
    }
    break;
    
  case 'inject':
    const creators = args.slice(1);
    if (creators.length === 0) {
      console.log('Usage: base666 inject "nom1" "nom2" "nom3"');
      process.exit(1);
    }
    console.log(Base666.inject(creators));
    break;
    
  case 'test':
    console.log('🔥 Test Base666');
    const testText = 'Lucie Defraiteur';
    const encoded = Base666.encode(testText);
    const decoded = Base666.decode(encoded);
    const blasphemy = Base666.blasphemyLevel(encoded);
    
    console.log(`Original: ${testText}`);
    console.log(`Encoded: ${encoded}`);
    console.log(`Decoded: ${decoded}`);
    console.log(`Blasphemy: ${blasphemy}/666`);
    console.log('\nSignature:');
    console.log(Base666.inject(['Lucie', 'Augment', 'ShadEOS']));
    break;
    
  default:
    console.log(`🔥 Base666 Encoder - Alphabet des Enfers

Commands:
  encode "text"                    Encode text to base666
  encode -f file1 file2 -o out     Encode files to base666
  decode "⛧text⛧"                 Decode from base666
  decode -f file1 file2 -o out     Decode files from base666
  signature "name"                 Generate signature
  inject "name1" "name2"           Generate injection comment
  test                             Run test

Arguments:
  -f, --files     Input files (multiple allowed)
  -o, --output    Output file (optional, prints to console if not specified)

Examples:
  base666 encode "Hello World"
  base666 encode -f signature.luciform augment.luciform -o encoded.txt
  base666 decode -f encoded.txt -o decoded.luciform
  base666 signature "Lucie"
  base666 inject "Lucie" "Augment" "ShadEOS"
`);
}
