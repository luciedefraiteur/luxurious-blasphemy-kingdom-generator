#!/usr/bin/env python3
"""
🔮 WORKFLOW VALIDATOR - Validation et correction des workflows corrompus
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Valide et corrige les workflows pour ComfyUI
"""

import json
import requests
from pathlib import Path
from typing import Dict, Any, List

class WorkflowValidator:
    def __init__(self, server_url: str = "http://127.0.0.1:8188"):
        self.server_url = server_url
        self.api_url = f"{server_url}/api"
    
    def validate_workflow_format(self, workflow_path: str) -> Dict[str, Any]:
        """Valider le format d'un workflow"""
        print(f"🔍 Validation: {Path(workflow_path).name}")
        
        try:
            with open(workflow_path, 'r', encoding='utf-8') as f:
                workflow = json.load(f)
            
            # Vérifications de base
            issues = []
            
            # Vérifier la structure
            if 'nodes' not in workflow:
                issues.append("Structure 'nodes' manquante")
            
            # Vérifier les nodes
            if 'nodes' in workflow:
                nodes = workflow['nodes']
                node_types = []
                
                for node in nodes:
                    if 'type' not in node:
                        issues.append(f"Node sans type: {node.get('id', 'unknown')}")
                    else:
                        node_types.append(node['type'])
                
                # Vérifier les types essentiels
                essential_types = ['CheckpointLoaderSimple', 'CLIPTextEncode', 'KSampler', 'VAEDecode', 'SaveImage']
                missing_types = [t for t in essential_types if t not in node_types]
                
                if missing_types:
                    issues.append(f"Types manquants: {missing_types}")
            
            return {
                'valid': len(issues) == 0,
                'issues': issues,
                'workflow': workflow
            }
            
        except Exception as e:
            return {
                'valid': False,
                'issues': [f"Erreur parsing: {e}"],
                'workflow': None
            }
    
    def check_server_object_info(self) -> Dict[str, Any]:
        """Obtenir les informations sur les objets disponibles"""
        try:
            response = requests.get(f"{self.api_url}/object_info", timeout=10)
            if response.status_code == 200:
                return response.json()
        except:
            pass
        return {}
    
    def create_simple_workflow(self, prompt: str) -> Dict[str, Any]:
        """Créer un workflow simple qui fonctionne"""
        
        # Workflow minimal fonctionnel
        simple_workflow = {
            "3": {
                "inputs": {
                    "seed": 42,
                    "steps": 20,
                    "cfg": 7.5,
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 1,
                    "model": ["4", 0],
                    "positive": ["6", 0],
                    "negative": ["7", 0],
                    "latent_image": ["5", 0]
                },
                "class_type": "KSampler"
            },
            "4": {
                "inputs": {
                    "ckpt_name": "uberRealisticPornMerge_v23Final.safetensors"  # Modèle de Lucifer
                },
                "class_type": "CheckpointLoaderSimple"
            },
            "5": {
                "inputs": {
                    "width": 1024,
                    "height": 1024,
                    "batch_size": 1
                },
                "class_type": "EmptyLatentImage"
            },
            "6": {
                "inputs": {
                    "text": prompt,
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "7": {
                "inputs": {
                    "text": "bad quality, blurry, low resolution",
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "8": {
                "inputs": {
                    "samples": ["3", 0],
                    "vae": ["4", 2]
                },
                "class_type": "VAEDecode"
            },
            "9": {
                "inputs": {
                    "filename_prefix": "ComfyUI_corrupted",
                    "images": ["8", 0]
                },
                "class_type": "SaveImage"
            }
        }
        
        return simple_workflow
    
    def test_simple_workflow(self, prompt: str) -> bool:
        """Tester un workflow simple"""
        print(f"🧪 Test workflow simple avec prompt: {prompt[:50]}...")
        
        try:
            workflow = self.create_simple_workflow(prompt)
            
            prompt_data = {
                "prompt": workflow,
                "client_id": "workflow_validator"
            }
            
            response = requests.post(f"{self.api_url}/prompt", json=prompt_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                prompt_id = result.get("prompt_id")
                print(f"✅ Workflow simple accepté: {prompt_id}")
                return True
            else:
                print(f"❌ Workflow simple rejeté: {response.status_code}")
                try:
                    error_info = response.json()
                    print(f"   Erreur: {error_info}")
                except:
                    print(f"   Erreur: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Erreur test workflow: {e}")
            return False
    
    def create_corrected_workflows(self):
        """Créer des workflows corrigés avec nos prompts"""
        print("\n🔧 CRÉATION DE WORKFLOWS CORRIGÉS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Charger nos prompts corrompus
        try:
            with open('luxure_corrupted_prompts.json', 'r', encoding='utf-8') as f:
                corrupted_prompts = json.load(f)
            
            prompts = []
            for corruption in corrupted_prompts.get('corrupted_prompts', []):
                if 'corrupted_prompt' in corruption:
                    prompts.append(corruption['corrupted_prompt'])
            
            print(f"✅ {len(prompts)} prompts corrompus chargés")
            
            # Créer des workflows corrigés
            corrected_workflows = []
            
            for i, prompt in enumerate(prompts, 1):
                print(f"\n🔧 Création workflow corrigé {i}...")
                
                # Créer le workflow simple
                workflow = self.create_simple_workflow(prompt)
                
                # Sauvegarder
                output_path = f"corrected_workflow_{i}.json"
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(workflow, f, indent=2, ensure_ascii=False)
                
                corrected_workflows.append(output_path)
                print(f"✅ Workflow corrigé créé: {output_path}")
            
            return corrected_workflows
            
        except Exception as e:
            print(f"❌ Erreur création workflows corrigés: {e}")
            return []
    
    def validate_all_workflows(self):
        """Valider tous les workflows"""
        print("🔮 VALIDATION DE TOUS LES WORKFLOWS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Valider les workflows corrompus originaux
        print("\n📄 WORKFLOWS CORROMPUS ORIGINAUX:")
        for i in range(1, 4):
            workflow_path = f"corrupted_workflow_{i}.json"
            if Path(workflow_path).exists():
                result = self.validate_workflow_format(workflow_path)
                if result['valid']:
                    print(f"✅ {workflow_path}: Valide")
                else:
                    print(f"❌ {workflow_path}: {result['issues']}")
        
        # Créer et valider les workflows corrigés
        print("\n🔧 CRÉATION DE WORKFLOWS CORRIGÉS:")
        corrected_workflows = self.create_corrected_workflows()
        
        print("\n📄 WORKFLOWS CORRIGÉS:")
        for workflow_path in corrected_workflows:
            result = self.validate_workflow_format(workflow_path)
            if result['valid']:
                print(f"✅ {workflow_path}: Valide")
            else:
                print(f"❌ {workflow_path}: {result['issues']}")
        
        return corrected_workflows

def main():
    validator = WorkflowValidator()
    
    print("🔮 WORKFLOW VALIDATOR")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    # Vérifier si le serveur est disponible
    try:
        response = requests.get(f"{validator.server_url}/system_stats", timeout=5)
        if response.status_code == 200:
            print("✅ Serveur ComfyUI disponible")
            
            # Valider et corriger les workflows
            corrected_workflows = validator.validate_all_workflows()
            
            # Tester un workflow simple
            if corrected_workflows:
                print(f"\n🧪 TEST D'UN WORKFLOW CORRIGÉ:")
                test_prompt = "Beautiful gothic cathedral, dark atmosphere, mystical lighting"
                validator.test_simple_workflow(test_prompt)
            
        else:
            print("❌ Serveur ComfyUI non disponible")
            print("   Lancez d'abord ComfyUI avec le launcher")
    
    except:
        print("❌ Serveur ComfyUI non accessible")
        print("   Lancez d'abord ComfyUI avec le launcher")
        
        # Créer quand même les workflows corrigés
        print("\n🔧 Création des workflows corrigés hors ligne...")
        validator.validate_all_workflows()

if __name__ == "__main__":
    main()
