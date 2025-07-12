#!/usr/bin/env python3
"""
🔮 HYBRID IMAGE ANALYZER - Système hybride optimal pour RTX 2070
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Système hybride : CLIP Interrogator (rapide) + BLIP-2 quantizé (qualité)
"""

import os
import json
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
import torch
from PIL import Image
import argparse

class HybridImageAnalyzer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"🔮 Initialisation HybridImageAnalyzer sur {self.device}")
        
        # Modules d'analyse
        self.clip_interrogator = None
        self.blip2_model = None
        self.blip2_processor = None
        
        # Résultats
        self.analysis_results = []
        
        # Statistiques
        self.stats = {
            "clip_analyses": 0,
            "blip2_analyses": 0,
            "total_time": 0,
            "avg_time_per_image": 0
        }
    
    def init_clip_interrogator(self):
        """Initialiser CLIP Interrogator (rapide et léger)"""
        if self.clip_interrogator is not None:
            return True
            
        try:
            print("📦 Chargement CLIP Interrogator...")
            from clip_interrogator import Config, Interrogator
            
            config = Config(clip_model_name="ViT-L-14/openai")
            config.device = self.device
            config.chunk_size = 2048
            config.flavor_intermediate_count = 512
            
            self.clip_interrogator = Interrogator(config)
            print("✅ CLIP Interrogator prêt")
            return True
            
        except Exception as e:
            print(f"❌ Erreur CLIP Interrogator: {e}")
            return False
    
    def init_blip2_quantized(self):
        """Initialiser BLIP-2 quantizé (qualité supérieure)"""
        if self.blip2_model is not None:
            return True
            
        try:
            print("📦 Chargement BLIP-2 quantizé...")
            from transformers import Blip2Processor, Blip2ForConditionalGeneration, BitsAndBytesConfig
            
            # Configuration quantization 8-bit
            quantization_config = BitsAndBytesConfig(
                load_in_8bit=True,
                llm_int8_threshold=6.0,
                llm_int8_has_fp16_weight=False,
            )
            
            # Charger le modèle plus petit avec quantization
            model_name = "Salesforce/blip2-opt-2.7b"
            
            self.blip2_processor = Blip2Processor.from_pretrained(model_name)
            self.blip2_model = Blip2ForConditionalGeneration.from_pretrained(
                model_name,
                quantization_config=quantization_config,
                device_map="auto",
                torch_dtype=torch.float16
            )
            
            print("✅ BLIP-2 quantizé prêt")
            return True
            
        except Exception as e:
            print(f"❌ Erreur BLIP-2 quantizé: {e}")
            return False
    
    def analyze_with_clip(self, image_path: Path) -> Dict[str, Any]:
        """Analyse rapide avec CLIP Interrogator"""
        try:
            if not self.init_clip_interrogator():
                return {"error": "CLIP Interrogator non disponible"}
            
            start_time = time.time()
            
            # Charger l'image
            image = Image.open(image_path).convert('RGB')
            
            # Analyse CLIP
            description = self.clip_interrogator.interrogate(image)
            
            analysis_time = time.time() - start_time
            self.stats["clip_analyses"] += 1
            
            return {
                "method": "CLIP_Interrogator",
                "description": description,
                "analysis_time": analysis_time,
                "quality": "standard",
                "speed": "fast"
            }
            
        except Exception as e:
            return {"method": "CLIP_Interrogator", "error": str(e)}
    
    def analyze_with_blip2(self, image_path: Path) -> Dict[str, Any]:
        """Analyse de qualité avec BLIP-2 quantizé"""
        try:
            if not self.init_blip2_quantized():
                return {"error": "BLIP-2 quantizé non disponible"}
            
            start_time = time.time()
            
            # Charger l'image
            image = Image.open(image_path).convert('RGB')
            
            # Prompts spécialisés pour sigils
            prompts = [
                "Describe this mystical symbol or sigil in detail:",
                "What occult or esoteric elements do you see?",
                "Describe the geometric patterns and artistic style:",
                "What is the spiritual or magical meaning of this image?"
            ]
            
            descriptions = {}
            
            for prompt in prompts:
                # Nettoyer la mémoire
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
                
                # Traiter l'image
                inputs = self.blip2_processor(image, prompt, return_tensors="pt").to(self.device)
                
                # Générer la description
                with torch.no_grad():
                    generated_ids = self.blip2_model.generate(
                        **inputs,
                        max_length=100,
                        num_beams=3,
                        do_sample=False,
                        early_stopping=True
                    )
                
                # Décoder
                generated_text = self.blip2_processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                
                # Nettoyer le prompt de la réponse
                if prompt in generated_text:
                    generated_text = generated_text.replace(prompt, "").strip()
                
                prompt_key = prompt.replace(":", "").replace(" ", "_").replace("?", "").lower()
                descriptions[prompt_key] = generated_text
                
                # Nettoyer les tensors
                del inputs, generated_ids
            
            analysis_time = time.time() - start_time
            self.stats["blip2_analyses"] += 1
            
            # Combiner les descriptions
            combined_description = " | ".join([desc for desc in descriptions.values() if desc.strip()])
            
            return {
                "method": "BLIP2_Quantized",
                "descriptions": descriptions,
                "combined_description": combined_description,
                "analysis_time": analysis_time,
                "quality": "high",
                "speed": "medium"
            }
            
        except Exception as e:
            return {"method": "BLIP2_Quantized", "error": str(e)}
    
    def analyze_image_hybrid(self, image_path: Path, mode: str = "auto") -> Dict[str, Any]:
        """Analyse hybride d'une image"""
        
        print(f"🔍 Analyse hybride: {image_path.name}")
        
        start_time = time.time()
        
        # Métadonnées de base
        analysis = {
            "file_path": str(image_path),
            "file_name": image_path.name,
            "file_size": image_path.stat().st_size,
            "analysis_timestamp": time.time(),
            "mode": mode
        }
        
        # Choisir la méthode d'analyse
        if mode == "fast" or (mode == "auto" and self.stats["clip_analyses"] < 5):
            # Utiliser CLIP pour les premières analyses ou mode rapide
            clip_result = self.analyze_with_clip(image_path)
            analysis["clip_analysis"] = clip_result
            
            if "error" not in clip_result:
                analysis["primary_description"] = clip_result["description"]
                analysis["analysis_method"] = "CLIP_Primary"
            
        elif mode == "quality":
            # Utiliser BLIP-2 pour la qualité
            blip2_result = self.analyze_with_blip2(image_path)
            analysis["blip2_analysis"] = blip2_result
            
            if "error" not in blip2_result:
                analysis["primary_description"] = blip2_result["combined_description"]
                analysis["analysis_method"] = "BLIP2_Primary"
        
        else:  # mode == "auto" ou "hybrid"
            # Analyse hybride complète
            clip_result = self.analyze_with_clip(image_path)
            analysis["clip_analysis"] = clip_result
            
            # Si CLIP fonctionne et on a de la VRAM, essayer BLIP-2
            if "error" not in clip_result and torch.cuda.is_available():
                memory_free = torch.cuda.get_device_properties(0).total_memory - torch.cuda.memory_allocated()
                memory_free_gb = memory_free / 1024**3
                
                if memory_free_gb > 3.0:  # Assez de VRAM pour BLIP-2
                    blip2_result = self.analyze_with_blip2(image_path)
                    analysis["blip2_analysis"] = blip2_result
                    
                    # Combiner les résultats
                    if "error" not in blip2_result:
                        analysis["primary_description"] = f"CLIP: {clip_result['description']} | BLIP2: {blip2_result['combined_description']}"
                        analysis["analysis_method"] = "Hybrid_Complete"
                    else:
                        analysis["primary_description"] = clip_result["description"]
                        analysis["analysis_method"] = "CLIP_Fallback"
                else:
                    analysis["primary_description"] = clip_result["description"]
                    analysis["analysis_method"] = "CLIP_MemoryLimit"
            else:
                analysis["primary_description"] = clip_result.get("description", "Analysis failed")
                analysis["analysis_method"] = "CLIP_Only"
        
        total_time = time.time() - start_time
        analysis["total_analysis_time"] = total_time
        self.stats["total_time"] += total_time
        
        return analysis
    
    def analyze_sigils_directory(self, sigils_dir: str = "/home/luciedefraiteur/Téléchargements/sygils", 
                                mode: str = "auto") -> List[Dict[str, Any]]:
        """Analyser tous les sigils avec le système hybride"""
        
        sigils_path = Path(sigils_dir)
        if not sigils_path.exists():
            print(f"❌ Dossier sigils non trouvé: {sigils_dir}")
            return []
        
        print("🔮 ANALYSE HYBRIDE DES SIGILS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Trouver toutes les images
        image_files = []
        for ext in ['.jpg', '.jpeg', '.png', '.bmp']:
            image_files.extend(sigils_path.glob(f"*{ext}"))
            image_files.extend(sigils_path.glob(f"*{ext.upper()}"))
        
        print(f"🔮 {len(image_files)} sigils trouvés")
        print(f"📊 Mode d'analyse: {mode}")
        
        results = []
        
        for i, sigil_file in enumerate(image_files, 1):
            print(f"\n⛧ Sigil {i}/{len(image_files)}: {sigil_file.name}")
            
            # Analyser avec le système hybride
            analysis = self.analyze_image_hybrid(sigil_file, mode)
            results.append(analysis)
            
            # Afficher le résultat
            if "primary_description" in analysis:
                desc = analysis["primary_description"][:100] + "..." if len(analysis["primary_description"]) > 100 else analysis["primary_description"]
                print(f"   📝 {analysis.get('analysis_method', 'Unknown')}: {desc}")
                print(f"   ⏱️ Temps: {analysis.get('total_analysis_time', 0):.1f}s")
            
            # Petite pause pour éviter la surchauffe
            time.sleep(0.5)
        
        self.analysis_results.extend(results)
        
        # Calculer les statistiques finales
        if len(results) > 0:
            self.stats["avg_time_per_image"] = self.stats["total_time"] / len(results)
        
        return results
    
    def save_results(self, output_file: Path):
        """Sauvegarder les résultats avec statistiques"""
        
        output_data = {
            "analysis_metadata": {
                "total_images": len(self.analysis_results),
                "analysis_date": time.strftime("%Y-%m-%d %H:%M:%S"),
                "device_used": self.device,
                "analyzer_type": "Hybrid_CLIP_BLIP2"
            },
            "statistics": self.stats,
            "analyses": self.analysis_results
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Résultats sauvés: {output_file}")
        print(f"📊 Statistiques:")
        print(f"   CLIP analyses: {self.stats['clip_analyses']}")
        print(f"   BLIP-2 analyses: {self.stats['blip2_analyses']}")
        print(f"   Temps moyen/image: {self.stats['avg_time_per_image']:.1f}s")

def main():
    """Point d'entrée principal"""
    parser = argparse.ArgumentParser(description="🔮 Hybrid Image Analyzer")
    
    parser.add_argument("--sigils", action="store_true", help="Analyser les sigils existants")
    parser.add_argument("--mode", choices=["auto", "fast", "quality", "hybrid"], default="auto", 
                       help="Mode d'analyse")
    parser.add_argument("--output", type=str, default="hybrid_sigils_analysis.json", 
                       help="Fichier de sortie")
    
    args = parser.parse_args()
    
    # Initialiser l'analyseur hybride
    analyzer = HybridImageAnalyzer()
    
    if args.sigils:
        # Analyser les sigils
        results = analyzer.analyze_sigils_directory(mode=args.mode)
        
        if results:
            # Sauvegarder les résultats
            output_path = Path(args.output)
            analyzer.save_results(output_path)
            
            print(f"\n✅ Analyse hybride terminée - {len(results)} sigils analysés")
        else:
            print("❌ Aucun sigil analysé")
    else:
        print("🔮 Utilisation:")
        print("  --sigils : Analyser les sigils existants")
        print("  --mode [auto|fast|quality|hybrid] : Mode d'analyse")

if __name__ == "__main__":
    main()
