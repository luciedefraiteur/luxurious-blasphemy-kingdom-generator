#!/usr/bin/env python3
"""
🔮 IMAGE ANALYZER - Analyse d'images via BLIP-2 pour fractale récursive
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Analyse automatique des sigils et images générées pour la fractale récursive
"""

import os
import json
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
import torch
from PIL import Image
from transformers import Blip2Processor, Blip2ForConditionalGeneration
import argparse

class ImageAnalyzer:
    def __init__(self, model_name: str = "Salesforce/blip2-opt-2.7b"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"🔮 Initialisation ImageAnalyzer sur {self.device}")
        
        # Charger le modèle BLIP-2
        print("📦 Chargement du modèle BLIP-2...")
        self.processor = Blip2Processor.from_pretrained(model_name)
        self.model = Blip2ForConditionalGeneration.from_pretrained(
            model_name, 
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
        )
        self.model.to(self.device)
        print("✅ Modèle BLIP-2 chargé avec succès")
        
        self.analysis_results = []
        
    def analyze_image(self, image_path: Path, custom_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Analyser une image avec BLIP-2"""
        try:
            # Charger l'image
            image = Image.open(image_path).convert('RGB')
            
            # Préparer les prompts
            prompts = [
                "Describe this image in detail:",
                "What symbols, shapes, and mystical elements do you see?",
                "Describe the artistic style and mood:",
                "What occult or esoteric symbols are present?"
            ]
            
            if custom_prompt:
                prompts.append(custom_prompt)
            
            results = {}
            
            for prompt in prompts:
                # Traiter l'image avec le prompt
                inputs = self.processor(image, prompt, return_tensors="pt").to(self.device)
                
                # Générer la description
                with torch.no_grad():
                    generated_ids = self.model.generate(**inputs, max_length=100, num_beams=5)
                
                # Décoder la réponse
                generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                
                # Nettoyer la réponse (enlever le prompt)
                if prompt in generated_text:
                    generated_text = generated_text.replace(prompt, "").strip()
                
                # Stocker le résultat
                prompt_key = prompt.replace(":", "").replace(" ", "_").lower()
                results[prompt_key] = generated_text
            
            # Métadonnées
            analysis = {
                "file_path": str(image_path),
                "file_name": image_path.name,
                "file_size": image_path.stat().st_size,
                "analysis_timestamp": time.time(),
                "device_used": self.device,
                "descriptions": results,
                "combined_description": self._combine_descriptions(results)
            }
            
            print(f"✅ Analysé: {image_path.name}")
            return analysis
            
        except Exception as e:
            print(f"❌ Erreur analyse {image_path}: {e}")
            return {
                "file_path": str(image_path),
                "file_name": image_path.name,
                "error": str(e),
                "analysis_timestamp": time.time()
            }
    
    def _combine_descriptions(self, descriptions: Dict[str, str]) -> str:
        """Combiner toutes les descriptions en une seule"""
        combined = []
        for key, desc in descriptions.items():
            if desc and desc.strip():
                combined.append(desc.strip())
        
        return " | ".join(combined)
    
    def analyze_directory(self, directory: Path, extensions: List[str] = None) -> List[Dict[str, Any]]:
        """Analyser tous les images d'un dossier"""
        if extensions is None:
            extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp']
        
        print(f"📁 Analyse du dossier: {directory}")
        
        # Trouver toutes les images
        image_files = []
        for ext in extensions:
            image_files.extend(directory.glob(f"*{ext}"))
            image_files.extend(directory.glob(f"*{ext.upper()}"))
        
        print(f"🖼️ {len(image_files)} images trouvées")
        
        results = []
        for i, image_file in enumerate(image_files, 1):
            print(f"🔍 Analyse {i}/{len(image_files)}: {image_file.name}")
            
            analysis = self.analyze_image(image_file)
            results.append(analysis)
            
            # Petite pause pour éviter la surchauffe
            time.sleep(0.5)
        
        self.analysis_results.extend(results)
        return results
    
    def save_results(self, output_file: Path):
        """Sauvegarder les résultats d'analyse"""
        output_data = {
            "analysis_metadata": {
                "total_images": len(self.analysis_results),
                "analysis_date": time.strftime("%Y-%m-%d %H:%M:%S"),
                "device_used": self.device,
                "model_used": "Salesforce/blip2-opt-2.7b"
            },
            "analyses": self.analysis_results
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Résultats sauvés: {output_file}")
    
    def analyze_sigils(self, sigils_dir: str = "/home/luciedefraiteur/Téléchargements/sygils") -> List[Dict[str, Any]]:
        """Analyser spécifiquement les sigils existants"""
        sigils_path = Path(sigils_dir)
        
        if not sigils_path.exists():
            print(f"❌ Dossier sigils non trouvé: {sigils_dir}")
            return []
        
        print("🔮 ANALYSE DES SIGILS EXISTANTS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Analyser avec des prompts spécialisés pour sigils
        results = []
        image_files = []
        
        # Chercher les images
        for ext in ['.jpg', '.jpeg', '.png', '.bmp']:
            image_files.extend(sigils_path.glob(f"*{ext}"))
            image_files.extend(sigils_path.glob(f"*{ext.upper()}"))
        
        print(f"🔮 {len(image_files)} sigils trouvés")
        
        for i, sigil_file in enumerate(image_files, 1):
            print(f"⛧ Analyse sigil {i}/{len(image_files)}: {sigil_file.name}")
            
            # Analyse spécialisée pour sigils
            analysis = self.analyze_sigil(sigil_file)
            results.append(analysis)
        
        return results
    
    def analyze_sigil(self, sigil_path: Path) -> Dict[str, Any]:
        """Analyse spécialisée pour un sigil"""
        try:
            image = Image.open(sigil_path).convert('RGB')
            
            # Prompts spécialisés pour sigils
            sigil_prompts = [
                "Describe this mystical symbol or sigil:",
                "What geometric patterns and shapes are present?",
                "Describe any occult, esoteric, or magical symbols:",
                "What is the overall energy and mood of this sigil?",
                "Describe the lines, curves, and symbolic elements:"
            ]
            
            results = {}
            
            for prompt in sigil_prompts:
                inputs = self.processor(image, prompt, return_tensors="pt").to(self.device)
                
                with torch.no_grad():
                    generated_ids = self.model.generate(**inputs, max_length=120, num_beams=5)
                
                generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                
                # Nettoyer
                if prompt in generated_text:
                    generated_text = generated_text.replace(prompt, "").strip()
                
                prompt_key = prompt.replace(":", "").replace(" ", "_").replace("?", "").lower()
                results[prompt_key] = generated_text
            
            # Analyse spécialisée
            analysis = {
                "file_path": str(sigil_path),
                "file_name": sigil_path.name,
                "file_size": sigil_path.stat().st_size,
                "analysis_timestamp": time.time(),
                "type": "sigil",
                "device_used": self.device,
                "sigil_descriptions": results,
                "combined_sigil_description": self._combine_descriptions(results),
                "magical_keywords": self._extract_magical_keywords(results)
            }
            
            return analysis
            
        except Exception as e:
            print(f"❌ Erreur analyse sigil {sigil_path}: {e}")
            return {
                "file_path": str(sigil_path),
                "file_name": sigil_path.name,
                "error": str(e),
                "type": "sigil",
                "analysis_timestamp": time.time()
            }
    
    def _extract_magical_keywords(self, descriptions: Dict[str, str]) -> List[str]:
        """Extraire des mots-clés magiques des descriptions"""
        magical_words = [
            "circle", "triangle", "pentagram", "hexagram", "spiral", "rune", "symbol",
            "mystical", "occult", "esoteric", "magical", "sacred", "divine", "cosmic",
            "energy", "power", "ritual", "spell", "enchantment", "sigil", "talisman",
            "geometric", "pattern", "mandala", "chakra", "aura", "spiritual", "astral"
        ]
        
        found_keywords = []
        combined_text = " ".join(descriptions.values()).lower()
        
        for word in magical_words:
            if word in combined_text:
                found_keywords.append(word)
        
        return found_keywords

def main():
    """Point d'entrée principal"""
    parser = argparse.ArgumentParser(description="🔮 Image Analyzer - Analyse d'images via BLIP-2")
    
    parser.add_argument("--sigils", action="store_true", help="Analyser les sigils existants")
    parser.add_argument("--directory", type=str, help="Analyser un dossier spécifique")
    parser.add_argument("--image", type=str, help="Analyser une image spécifique")
    parser.add_argument("--output", type=str, default="analysis_results.json", help="Fichier de sortie")
    
    args = parser.parse_args()
    
    # Initialiser l'analyseur
    analyzer = ImageAnalyzer()
    
    if args.sigils:
        # Analyser les sigils
        results = analyzer.analyze_sigils()
        analyzer.analysis_results = results
        
    elif args.directory:
        # Analyser un dossier
        directory = Path(args.directory)
        if directory.exists():
            analyzer.analyze_directory(directory)
        else:
            print(f"❌ Dossier non trouvé: {args.directory}")
            return
            
    elif args.image:
        # Analyser une image
        image_path = Path(args.image)
        if image_path.exists():
            result = analyzer.analyze_image(image_path)
            analyzer.analysis_results = [result]
        else:
            print(f"❌ Image non trouvée: {args.image}")
            return
    else:
        print("🔮 Utilisation:")
        print("  --sigils : Analyser les sigils existants")
        print("  --directory [path] : Analyser un dossier")
        print("  --image [path] : Analyser une image")
        return
    
    # Sauvegarder les résultats
    output_path = Path(args.output)
    analyzer.save_results(output_path)
    
    print(f"\n✅ Analyse terminée - {len(analyzer.analysis_results)} images analysées")
    print(f"💾 Résultats dans: {output_path}")

if __name__ == "__main__":
    main()
