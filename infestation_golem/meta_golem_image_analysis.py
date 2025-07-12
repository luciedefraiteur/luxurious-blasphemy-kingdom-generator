#!/usr/bin/env python3
"""
🔮 META-GOLEM IMAGE ANALYSIS - Exploration comparative des solutions
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Meta-golem pour tester et comparer toutes les options d'analyse d'images
"""

import torch
import time
import psutil
import subprocess
from pathlib import Path
from typing import Dict, List, Any
import json

class MetaGolemImageAnalysis:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.vram_total = torch.cuda.get_device_properties(0).total_memory / 1024**3 if torch.cuda.is_available() else 0
        self.test_results = []
        
    def get_memory_usage(self):
        """Obtenir l'usage mémoire GPU et RAM"""
        gpu_memory = torch.cuda.memory_allocated() / 1024**3 if torch.cuda.is_available() else 0
        ram_memory = psutil.virtual_memory().used / 1024**3
        return {
            "gpu_memory_gb": gpu_memory,
            "ram_memory_gb": ram_memory,
            "gpu_memory_percent": (gpu_memory / self.vram_total * 100) if self.vram_total > 0 else 0
        }
    
    def test_blip2_variants(self):
        """Tester différentes variantes de BLIP-2"""
        print("🔍 TEST BLIP-2 VARIANTS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        blip2_models = [
            {
                "name": "BLIP-2 OPT-680M",
                "model_id": "Salesforce/blip2-opt-680m",
                "estimated_vram": "2.5 GB",
                "quality": "Bonne",
                "speed": "Rapide"
            },
            {
                "name": "BLIP-2 OPT-2.7B", 
                "model_id": "Salesforce/blip2-opt-2.7b",
                "estimated_vram": "8+ GB",
                "quality": "Excellente",
                "speed": "Moyenne"
            },
            {
                "name": "BLIP-2 T5-XL",
                "model_id": "Salesforce/blip2-flan-t5-xl",
                "estimated_vram": "6 GB",
                "quality": "Très bonne",
                "speed": "Moyenne"
            }
        ]
        
        for model_info in blip2_models:
            print(f"\n📦 Test {model_info['name']}...")
            
            try:
                from transformers import Blip2Processor, Blip2ForConditionalGeneration
                
                # Nettoyer la mémoire
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
                
                memory_before = self.get_memory_usage()
                start_time = time.time()
                
                # Tenter de charger le modèle
                processor = Blip2Processor.from_pretrained(model_info["model_id"])
                model = Blip2ForConditionalGeneration.from_pretrained(
                    model_info["model_id"],
                    torch_dtype=torch.float16,
                    device_map="auto"
                )
                
                load_time = time.time() - start_time
                memory_after = self.get_memory_usage()
                
                # Test simple
                test_success = True
                inference_time = 0
                
                print(f"✅ {model_info['name']} chargé avec succès")
                print(f"   Temps de chargement: {load_time:.1f}s")
                print(f"   VRAM utilisée: {memory_after['gpu_memory_gb'] - memory_before['gpu_memory_gb']:.1f} GB")
                
                # Nettoyer
                del model, processor
                torch.cuda.empty_cache()
                
                result = {
                    "model": model_info["name"],
                    "model_id": model_info["model_id"],
                    "success": True,
                    "load_time": load_time,
                    "vram_used": memory_after['gpu_memory_gb'] - memory_before['gpu_memory_gb'],
                    "estimated_vram": model_info["estimated_vram"],
                    "quality": model_info["quality"],
                    "speed": model_info["speed"]
                }
                
            except Exception as e:
                print(f"❌ {model_info['name']} échoué: {str(e)[:100]}...")
                result = {
                    "model": model_info["name"],
                    "model_id": model_info["model_id"],
                    "success": False,
                    "error": str(e)[:200],
                    "estimated_vram": model_info["estimated_vram"]
                }
            
            self.test_results.append(result)
    
    def test_clip_interrogator(self):
        """Tester CLIP Interrogator"""
        print("\n🔍 TEST CLIP INTERROGATOR")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        try:
            # Installer clip-interrogator si nécessaire
            try:
                import clip_interrogator
            except ImportError:
                print("📦 Installation CLIP Interrogator...")
                subprocess.run(["pip", "install", "clip-interrogator"], check=True)
                import clip_interrogator
            
            memory_before = self.get_memory_usage()
            start_time = time.time()
            
            from clip_interrogator import Config, Interrogator
            
            config = Config(clip_model_name="ViT-L-14/openai")
            config.device = self.device
            
            ci = Interrogator(config)
            
            load_time = time.time() - start_time
            memory_after = self.get_memory_usage()
            
            print(f"✅ CLIP Interrogator chargé avec succès")
            print(f"   Temps de chargement: {load_time:.1f}s")
            print(f"   VRAM utilisée: {memory_after['gpu_memory_gb'] - memory_before['gpu_memory_gb']:.1f} GB")
            
            result = {
                "model": "CLIP Interrogator",
                "model_id": "clip-interrogator",
                "success": True,
                "load_time": load_time,
                "vram_used": memory_after['gpu_memory_gb'] - memory_before['gpu_memory_gb'],
                "estimated_vram": "1-2 GB",
                "quality": "Bonne pour descriptions générales",
                "speed": "Très rapide"
            }
            
        except Exception as e:
            print(f"❌ CLIP Interrogator échoué: {str(e)[:100]}...")
            result = {
                "model": "CLIP Interrogator",
                "success": False,
                "error": str(e)[:200]
            }
        
        self.test_results.append(result)
    
    def test_llava(self):
        """Tester LLaVA via Ollama"""
        print("\n🔍 TEST LLAVA")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        try:
            # Vérifier si Ollama est installé
            result_ollama = subprocess.run(["which", "ollama"], capture_output=True)
            
            if result_ollama.returncode != 0:
                print("⚠️ Ollama non installé - Installation requise")
                result = {
                    "model": "LLaVA (Ollama)",
                    "success": False,
                    "error": "Ollama non installé",
                    "installation_required": True
                }
            else:
                # Vérifier si LLaVA est disponible
                result_llava = subprocess.run(["ollama", "list"], capture_output=True, text=True)
                
                if "llava" in result_llava.stdout:
                    print("✅ LLaVA disponible via Ollama")
                    result = {
                        "model": "LLaVA (Ollama)",
                        "success": True,
                        "estimated_vram": "4-6 GB",
                        "quality": "Excellente pour conversations",
                        "speed": "Rapide",
                        "note": "Nécessite Ollama"
                    }
                else:
                    print("⚠️ LLaVA non installé dans Ollama")
                    result = {
                        "model": "LLaVA (Ollama)",
                        "success": False,
                        "error": "LLaVA non installé dans Ollama",
                        "installation_command": "ollama pull llava"
                    }
            
        except Exception as e:
            print(f"❌ LLaVA test échoué: {str(e)[:100]}...")
            result = {
                "model": "LLaVA (Ollama)",
                "success": False,
                "error": str(e)[:200]
            }
        
        self.test_results.append(result)
    
    def test_quantization_options(self):
        """Tester les options de quantization"""
        print("\n🔍 TEST QUANTIZATION OPTIONS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Vérifier bitsandbytes
        try:
            import bitsandbytes
            print("✅ bitsandbytes disponible")
            quantization_available = True
        except ImportError:
            print("⚠️ bitsandbytes non installé")
            quantization_available = False
        
        result = {
            "quantization_8bit": quantization_available,
            "quantization_4bit": quantization_available,
            "memory_reduction": "50% (8-bit) ou 75% (4-bit)",
            "quality_impact": "Minimal (8-bit), Léger (4-bit)",
            "installation_command": "pip install bitsandbytes" if not quantization_available else None
        }
        
        self.test_results.append(result)
    
    def generate_recommendation(self):
        """Générer une recommandation basée sur les tests"""
        print("\n🎯 ANALYSE ET RECOMMANDATION")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Analyser les résultats
        successful_models = [r for r in self.test_results if r.get("success", False)]
        
        print(f"💾 VRAM disponible: {self.vram_total:.1f} GB")
        print(f"✅ Modèles fonctionnels: {len(successful_models)}")
        
        # Recommandation
        if any(r.get("model") == "BLIP-2 OPT-680M" and r.get("success") for r in self.test_results):
            recommendation = {
                "primary": "BLIP-2 OPT-680M",
                "reason": "Optimal pour RTX 2070 - bon équilibre qualité/performance",
                "vram_usage": "~2.5 GB",
                "implementation": "Modifier image_analyzer.py pour utiliser Salesforce/blip2-opt-680m"
            }
        elif any(r.get("model") == "CLIP Interrogator" and r.get("success") for r in self.test_results):
            recommendation = {
                "primary": "CLIP Interrogator",
                "reason": "Très léger et rapide, parfait pour RTX 2070",
                "vram_usage": "~1-2 GB",
                "implementation": "Créer nouveau module avec clip-interrogator"
            }
        else:
            recommendation = {
                "primary": "Quantization BLIP-2 2.7B",
                "reason": "Utiliser quantization 8-bit pour réduire VRAM",
                "vram_usage": "~4 GB (avec 8-bit)",
                "implementation": "Installer bitsandbytes et modifier le chargement"
            }
        
        return recommendation
    
    def run_full_analysis(self):
        """Exécuter l'analyse complète"""
        print("🔮 META-GOLEM IMAGE ANALYSIS - EXPLORATION COMPLÈTE")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Tests
        self.test_blip2_variants()
        self.test_clip_interrogator()
        self.test_llava()
        self.test_quantization_options()
        
        # Recommandation
        recommendation = self.generate_recommendation()
        
        # Sauvegarder les résultats
        results = {
            "system_info": {
                "gpu": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None",
                "vram_total": self.vram_total,
                "device": self.device
            },
            "test_results": self.test_results,
            "recommendation": recommendation
        }
        
        with open("meta_golem_analysis_results.json", "w") as f:
            json.dump(results, f, indent=2)
        
        print(f"\n🎯 RECOMMANDATION FINALE:")
        print(f"   Modèle: {recommendation['primary']}")
        print(f"   Raison: {recommendation['reason']}")
        print(f"   VRAM: {recommendation['vram_usage']}")
        print(f"   Action: {recommendation['implementation']}")
        
        return recommendation

def main():
    meta_golem = MetaGolemImageAnalysis()
    recommendation = meta_golem.run_full_analysis()
    
    print("\n💾 Résultats sauvés dans: meta_golem_analysis_results.json")
    print("⛧ L'INFESTATION OPTIMALE PEUT COMMENCER ! ⛧")

if __name__ == "__main__":
    main()
