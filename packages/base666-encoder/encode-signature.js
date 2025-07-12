import fs from 'fs';
import Base666 from './dist/index.js';

const content = fs.readFileSync('../../luciforms/signature_adapted.luciform', 'utf8');
console.log('🔥 ENCODAGE EN BASE666 - ALPHABET DES ENFERS');
console.log('═══════════════════════════════════════════════');
console.log('');

const encoded = Base666.encode(content);
const blasphemy = Base666.blasphemyLevel(encoded);

console.log('📊 STATISTIQUES:');
console.log('Taille originale:', content.length, 'caractères');
console.log('Taille encodée:', encoded.length, 'caractères');
console.log('Niveau blasphémie:', blasphemy, '/666');
console.log('');

console.log('⛧ SIGNATURE ENCODÉE BASE666:');
console.log(encoded);
console.log('');

// Sauvegarder le résultat
const result = {
  type: 'signature_encoded_base666',
  original_size: content.length,
  encoded_size: encoded.length,
  blasphemy_level: blasphemy,
  encoded_signature: encoded,
  description: 'Vision de Lucie Defraiteur et structure luciforme parfaite encodée selon l\'Alphabet des Enfers',
  created_by: 'Augment avec outil base666-encoder',
  timestamp: new Date().toISOString()
};

fs.writeFileSync('../luciforms/signature_encoded.luciform', JSON.stringify(result, null, 2));
console.log('💾 Sauvegardé dans signature_encoded.luciform');
