#!/usr/bin/env python3
"""
🎨 COMFYUI INTERFACE - Interface pour génération d'images blasphématoires
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Interface Python pour ComfyUI API - Génération d'images transgressives
"""

import requests
import json
import time
import base64
import uuid
from pathlib import Path
from typing import Dict, List, Optional, Any
import websocket
import threading

class ComfyUIInterface:
    def __init__(self, api_url: str = "http://localhost:8188"):
        self.api_url = api_url
        self.client_id = str(uuid.uuid4())
        self.ws = None
        self.generated_images = []
        
    def connect(self) -> bool:
        """Se connecter à ComfyUI"""
        try:
            response = requests.get(f"{self.api_url}/system_stats")
            if response.status_code == 200:
                print("✅ Connexion ComfyUI établie")
                return True
            else:
                print(f"❌ ComfyUI non accessible - Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur connexion ComfyUI: {e}")
            return False
    
    def get_models(self) -> Dict[str, List[str]]:
        """Récupérer la liste des modèles disponibles"""
        try:
            response = requests.get(f"{self.api_url}/object_info")
            if response.status_code == 200:
                object_info = response.json()
                
                # Extraire les modèles
                models = {}
                if "CheckpointLoaderSimple" in object_info:
                    checkpoint_info = object_info["CheckpointLoaderSimple"]["input"]["required"]
                    if "ckpt_name" in checkpoint_info:
                        models["checkpoints"] = checkpoint_info["ckpt_name"][0]
                
                return models
            else:
                print(f"❌ Erreur récupération modèles: {response.status_code}")
                return {}
        except Exception as e:
            print(f"❌ Erreur get_models: {e}")
            return {}
    
    def create_basic_workflow(self, prompt: str, negative_prompt: str = "", 
                            width: int = 512, height: int = 512, 
                            steps: int = 20, cfg: float = 7.0) -> Dict[str, Any]:
        """Créer un workflow basique pour génération d'image"""
        
        workflow = {
            "3": {
                "inputs": {
                    "seed": int(time.time()),
                    "steps": steps,
                    "cfg": cfg,
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
                    "ckpt_name": "model.safetensors"  # Sera remplacé par le modèle disponible
                },
                "class_type": "CheckpointLoaderSimple"
            },
            "5": {
                "inputs": {
                    "width": width,
                    "height": height,
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
                    "text": negative_prompt,
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
                    "filename_prefix": "infestation_",
                    "images": ["8", 0]
                },
                "class_type": "SaveImage"
            }
        }
        
        return workflow
    
    def queue_prompt(self, workflow: Dict[str, Any]) -> Optional[str]:
        """Envoyer un workflow à la queue ComfyUI"""
        try:
            prompt_data = {
                "prompt": workflow,
                "client_id": self.client_id
            }
            
            response = requests.post(
                f"{self.api_url}/prompt",
                json=prompt_data
            )
            
            if response.status_code == 200:
                result = response.json()
                prompt_id = result.get("prompt_id")
                print(f"✅ Prompt envoyé - ID: {prompt_id}")
                return prompt_id
            else:
                print(f"❌ Erreur envoi prompt: {response.status_code}")
                print(response.text)
                return None
                
        except Exception as e:
            print(f"❌ Erreur queue_prompt: {e}")
            return None
    
    def wait_for_completion(self, prompt_id: str, timeout: int = 300) -> bool:
        """Attendre la completion d'un prompt"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            try:
                response = requests.get(f"{self.api_url}/history/{prompt_id}")
                if response.status_code == 200:
                    history = response.json()
                    if prompt_id in history:
                        print(f"✅ Génération terminée - ID: {prompt_id}")
                        return True
                
                time.sleep(2)
                print(".", end="", flush=True)
                
            except Exception as e:
                print(f"❌ Erreur wait_for_completion: {e}")
                return False
        
        print(f"\n❌ Timeout - Génération non terminée après {timeout}s")
        return False
    
    def get_generated_images(self, prompt_id: str) -> List[str]:
        """Récupérer les images générées"""
        try:
            response = requests.get(f"{self.api_url}/history/{prompt_id}")
            if response.status_code == 200:
                history = response.json()
                
                if prompt_id in history:
                    outputs = history[prompt_id].get("outputs", {})
                    images = []
                    
                    for node_id, node_output in outputs.items():
                        if "images" in node_output:
                            for image_info in node_output["images"]:
                                filename = image_info["filename"]
                                subfolder = image_info.get("subfolder", "")
                                
                                # Construire l'URL de l'image
                                if subfolder:
                                    image_url = f"{self.api_url}/view?filename={filename}&subfolder={subfolder}"
                                else:
                                    image_url = f"{self.api_url}/view?filename={filename}"
                                
                                images.append({
                                    "filename": filename,
                                    "url": image_url,
                                    "subfolder": subfolder
                                })
                    
                    return images
            
            return []
            
        except Exception as e:
            print(f"❌ Erreur get_generated_images: {e}")
            return []
    
    def download_image(self, image_info: Dict[str, str], save_path: Path) -> bool:
        """Télécharger une image générée"""
        try:
            response = requests.get(image_info["url"])
            if response.status_code == 200:
                save_path.parent.mkdir(parents=True, exist_ok=True)
                
                with open(save_path, 'wb') as f:
                    f.write(response.content)
                
                print(f"✅ Image sauvée: {save_path}")
                return True
            else:
                print(f"❌ Erreur téléchargement image: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Erreur download_image: {e}")
            return False
    
    def generate_image(self, prompt: str, negative_prompt: str = "",
                      width: int = 512, height: int = 512,
                      steps: int = 20, cfg: float = 7.0,
                      save_dir: Optional[Path] = None) -> List[Path]:
        """Générer une image complète (workflow + attente + téléchargement)"""
        
        print(f"🎨 Génération image: {prompt[:50]}...")
        
        # 1. Créer le workflow
        workflow = self.create_basic_workflow(
            prompt, negative_prompt, width, height, steps, cfg
        )
        
        # 2. Envoyer à la queue
        prompt_id = self.queue_prompt(workflow)
        if not prompt_id:
            return []
        
        # 3. Attendre completion
        if not self.wait_for_completion(prompt_id):
            return []
        
        # 4. Récupérer les images
        images = self.get_generated_images(prompt_id)
        if not images:
            print("❌ Aucune image générée")
            return []
        
        # 5. Télécharger les images
        saved_paths = []
        if save_dir:
            save_dir.mkdir(parents=True, exist_ok=True)
            
            for i, image_info in enumerate(images):
                filename = f"infestation_{prompt_id}_{i}.png"
                save_path = save_dir / filename
                
                if self.download_image(image_info, save_path):
                    saved_paths.append(save_path)
        
        print(f"✅ {len(saved_paths)} image(s) générée(s)")
        return saved_paths
    
    def test_generation(self) -> bool:
        """Test de génération d'image"""
        print("🧪 Test de génération ComfyUI...")
        
        test_prompt = "dark gothic cathedral, mysterious atmosphere, cinematic lighting"
        test_negative = "blurry, low quality"
        
        save_dir = Path("generated_images") / "test"
        images = self.generate_image(
            test_prompt, 
            test_negative,
            width=512,
            height=512,
            steps=10,  # Rapide pour test
            save_dir=save_dir
        )
        
        if images:
            print(f"✅ Test réussi - {len(images)} image(s) générée(s)")
            return True
        else:
            print("❌ Test échoué")
            return False

def main():
    """Test de l'interface ComfyUI"""
    interface = ComfyUIInterface()
    
    if interface.connect():
        models = interface.get_models()
        print(f"📦 Modèles disponibles: {models}")
        
        # Test de génération
        interface.test_generation()
    else:
        print("❌ Impossible de se connecter à ComfyUI")

if __name__ == "__main__":
    main()
