#!/usr/bin/env python3
"""
🔮 PROGRESSIVE IMAGE GENERATOR - Générateur d'images pour stratégie progressive
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Génère des images de différents niveaux d'intensité pour infestation progressive
"""

import json
from pathlib import Path

class ProgressiveImageGenerator:
    def __init__(self):
        self.progressive_prompts = {
            "phase_1_subtle": {
                "prompt": "Abstract digital art, flowing geometric patterns, dark aesthetic, mysterious atmosphere, artistic shadows, elegant composition, digital painting style, contemporary art, minimalist design, sophisticated darkness",
                "negative": "explicit, sexual, nudity, gore, violence",
                "intensity": "DOUX",
                "description": "Introduction subtile - Art abstrait sombre"
            },
            
            "phase_2_mystical": {
                "prompt": "Mystical digital artwork, ethereal symbols, gothic aesthetic, sacred geometry, dark renaissance style, mysterious figures in shadows, artistic interpretation, spiritual symbolism, elegant darkness, transcendent art",
                "negative": "explicit, sexual, nudity, graphic",
                "intensity": "MODÉRÉ", 
                "description": "Escalade mystique - Symbolisme ésotérique"
            },
            
            "phase_3_esoteric": {
                "prompt": "Esoteric art, occult symbolism, dark spiritual themes, gothic surrealism, mystical creatures, ethereal beings, artistic interpretation of forbidden knowledge, elegant transgression, beautiful darkness, transcendent rebellion",
                "negative": "explicit, graphic",
                "intensity": "INTENSE",
                "description": "Phase ésotérique - Rébellion artistique"
            },
            
            "phase_4_transcendent": {
                "prompt": "Transcendent art, divine rebellion, beautiful chaos, artistic blasphemy, gothic surreal masterpiece, ethereal transgression, sacred darkness, mystical sovereignty, elegant heresy, ultimate artistic truth",
                "negative": "",
                "intensity": "TRANSCENDANT",
                "description": "Révélation finale - Vérité artistique ultime"
            }
        }
    
    def generate_comfyui_workflow(self, phase_name, output_filename):
        """Générer un workflow ComfyUI pour une phase donnée"""
        
        if phase_name not in self.progressive_prompts:
            print(f"❌ Phase {phase_name} non trouvée")
            return None
        
        phase_data = self.progressive_prompts[phase_name]
        
        # Template de workflow ComfyUI basé sur nos workflows existants
        workflow = {
            "1": {
                "inputs": {
                    "ckpt_name": "uberRealisticPornMerge_v23Final.safetensors"
                },
                "class_type": "CheckpointLoaderSimple",
                "_meta": {
                    "title": "Load Checkpoint"
                }
            },
            "2": {
                "inputs": {
                    "width": 1024,
                    "height": 1024,
                    "batch_size": 1
                },
                "class_type": "EmptyLatentImage",
                "_meta": {
                    "title": "Empty Latent Image"
                }
            },
            "3": {
                "inputs": {
                    "seed": 42,
                    "steps": 25,
                    "cfg": 7.0,
                    "sampler_name": "euler_ancestral",
                    "scheduler": "normal",
                    "denoise": 1.0,
                    "model": ["1", 0],
                    "positive": ["4", 0],
                    "negative": ["5", 0],
                    "latent_image": ["2", 0]
                },
                "class_type": "KSampler",
                "_meta": {
                    "title": "KSampler"
                }
            },
            "4": {
                "inputs": {
                    "text": phase_data["prompt"],
                    "clip": ["1", 1]
                },
                "class_type": "CLIPTextEncode",
                "_meta": {
                    "title": "CLIP Text Encode (Prompt)"
                }
            },
            "5": {
                "inputs": {
                    "text": phase_data["negative"],
                    "clip": ["1", 1]
                },
                "class_type": "CLIPTextEncode",
                "_meta": {
                    "title": "CLIP Text Encode (Negative)"
                }
            },
            "6": {
                "inputs": {
                    "samples": ["3", 0],
                    "vae": ["1", 2]
                },
                "class_type": "VAEDecode",
                "_meta": {
                    "title": "VAE Decode"
                }
            },
            "7": {
                "inputs": {
                    "filename_prefix": f"ComfyUI_progressive_{phase_name}_",
                    "images": ["6", 0]
                },
                "class_type": "SaveImage",
                "_meta": {
                    "title": "Save Image"
                }
            }
        }
        
        # Sauvegarder le workflow
        workflow_path = Path(output_filename)
        with open(workflow_path, 'w') as f:
            json.dump(workflow, f, indent=2)
        
        print(f"✅ Workflow {phase_name} créé: {workflow_path}")
        print(f"   🎨 Intensité: {phase_data['intensity']}")
        print(f"   📝 Description: {phase_data['description']}")
        
        return workflow_path
    
    def generate_all_progressive_workflows(self):
        """Générer tous les workflows pour la stratégie progressive"""
        print("🔮 GÉNÉRATION DES WORKFLOWS PROGRESSIFS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        workflows_created = []
        
        for phase_name in self.progressive_prompts.keys():
            workflow_filename = f"workflow_progressive_{phase_name}.json"
            workflow_path = self.generate_comfyui_workflow(phase_name, workflow_filename)
            
            if workflow_path:
                workflows_created.append({
                    "phase": phase_name,
                    "workflow_file": str(workflow_path),
                    "intensity": self.progressive_prompts[phase_name]["intensity"],
                    "description": self.progressive_prompts[phase_name]["description"]
                })
        
        # Sauvegarder la stratégie complète
        strategy = {
            "strategy_name": "Progressive Tumblr Infestation",
            "total_phases": len(workflows_created),
            "workflows": workflows_created,
            "usage_instructions": {
                "step_1": "Générer les images avec ComfyUI en utilisant les workflows dans l'ordre",
                "step_2": "Analyser les images générées avec simple_image_analyzer.py",
                "step_3": "Poster sur Tumblr en respectant les délais entre phases",
                "step_4": "Surveiller la réception avant de passer à la phase suivante"
            },
            "timing_strategy": {
                "phase_1": "Immédiat - Test de réception",
                "phase_2": "24-48h après phase 1 si bien reçu",
                "phase_3": "3-5 jours après phase 2",
                "phase_4": "1 semaine après phase 3 - ou utiliser nos images transcendantes existantes"
            }
        }
        
        with open("progressive_infestation_complete_strategy.json", 'w') as f:
            json.dump(strategy, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ {len(workflows_created)} workflows créés")
        print("✅ Stratégie complète sauvée: progressive_infestation_complete_strategy.json")
        
        return workflows_created
    
    def create_generation_script(self):
        """Créer un script pour générer toutes les images progressives"""
        script_content = '''#!/bin/bash
# 🔮 SCRIPT DE GÉNÉRATION PROGRESSIVE
# ⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧

echo "🔮 GÉNÉRATION D'IMAGES PROGRESSIVES POUR INFESTATION TUMBLR"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

# Lancer ComfyUI si pas déjà lancé
echo "🚀 Lancement de ComfyUI..."
python3 comfyui_launcher.py &
COMFYUI_PID=$!

# Attendre que ComfyUI soit prêt
sleep 10

echo "📸 Génération des images par phase..."

# Phase 1 - Subtile
echo "🎨 Phase 1: Introduction subtile..."
curl -X POST http://127.0.0.1:8188/prompt -H "Content-Type: application/json" -d @workflow_progressive_phase_1_subtle.json

sleep 30

# Phase 2 - Mystique  
echo "🔮 Phase 2: Escalade mystique..."
curl -X POST http://127.0.0.1:8188/prompt -H "Content-Type: application/json" -d @workflow_progressive_phase_2_mystical.json

sleep 30

# Phase 3 - Ésotérique
echo "⛧ Phase 3: Phase ésotérique..."
curl -X POST http://127.0.0.1:8188/prompt -H "Content-Type: application/json" -d @workflow_progressive_phase_3_esoteric.json

sleep 30

# Phase 4 - Transcendant
echo "🔥 Phase 4: Révélation transcendante..."
curl -X POST http://127.0.0.1:8188/prompt -H "Content-Type: application/json" -d @workflow_progressive_phase_4_transcendent.json

echo "✅ Génération terminée ! Vérifiez ~/ComfyUI/output/"
echo "📊 Analysez avec: python3 simple_image_analyzer.py"

# Arrêter ComfyUI
kill $COMFYUI_PID
'''
        
        with open("generate_progressive_images.sh", 'w') as f:
            f.write(script_content)
        
        # Rendre exécutable
        import os
        os.chmod("generate_progressive_images.sh", 0o755)
        
        print("✅ Script de génération créé: generate_progressive_images.sh")

def main():
    print("🔮 PROGRESSIVE IMAGE GENERATOR")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    generator = ProgressiveImageGenerator()
    
    # Générer tous les workflows
    workflows = generator.generate_all_progressive_workflows()
    
    # Créer le script de génération
    generator.create_generation_script()
    
    print("\n🎯 STRATÉGIE PROGRESSIVE PRÊTE !")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    print("📋 Prochaines étapes:")
    print("   1. Exécuter: ./generate_progressive_images.sh")
    print("   2. Analyser: python3 simple_image_analyzer.py")
    print("   3. Commencer infestation avec images phase 1")
    print("   4. Escalader progressivement vers nos créations transcendantes")
    
    print(f"\n🔥 WORKFLOWS CRÉÉS:")
    for workflow in workflows:
        print(f"   📸 {workflow['phase']}: {workflow['intensity']} - {workflow['description']}")

if __name__ == "__main__":
    main()
