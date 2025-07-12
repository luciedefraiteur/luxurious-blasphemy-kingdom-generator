#!/usr/bin/env python3
"""
🔮 COMFYUI LAUNCHER - Lanceur optimisé RTX 2070 pour l'infestation visuelle
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Lanceur automatique ComfyUI avec optimisations GPU et injection de workflows corrompus
"""

import subprocess
import time
import requests
import json
import os
import signal
import sys
from pathlib import Path
from typing import Optional, Dict, Any

class ComfyUILauncher:
    def __init__(self):
        self.comfyui_path = Path.home() / "ComfyUI"
        self.server_process = None
        self.server_url = "http://127.0.0.1:8188"
        self.api_url = f"{self.server_url}/api"
        self.gpu_optimized = True
        
        # Vérifications initiales
        self.verify_setup()
    
    def verify_setup(self):
        """Vérifier la configuration"""
        print("🔮 VÉRIFICATION DE LA CONFIGURATION COMFYUI")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Vérifier ComfyUI
        if not self.comfyui_path.exists():
            print(f"❌ ComfyUI non trouvé: {self.comfyui_path}")
            return False
        
        print(f"✅ ComfyUI trouvé: {self.comfyui_path}")
        
        # Vérifier GPU
        try:
            result = subprocess.run(["nvidia-smi"], capture_output=True, text=True)
            if result.returncode == 0:
                print("✅ RTX 2070 détectée et opérationnelle")
                self.gpu_optimized = True
            else:
                print("⚠️ GPU non détecté, mode CPU")
                self.gpu_optimized = False
        except:
            print("⚠️ nvidia-smi non disponible, mode CPU")
            self.gpu_optimized = False
        
        # Vérifier l'environnement virtuel
        venv_path = self.comfyui_path / "venv"
        if venv_path.exists():
            print("✅ Environnement virtuel ComfyUI trouvé")
        else:
            print("⚠️ Environnement virtuel non trouvé")
        
        return True
    
    def launch_server(self, port: int = 8188, listen_ip: str = "127.0.0.1"):
        """Lancer le serveur ComfyUI optimisé GPU"""
        print(f"\n🔥 LANCEMENT COMFYUI OPTIMISÉ RTX 2070")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Construire la commande optimisée
        cmd = [
            "python3", "main.py",
            "--listen", listen_ip,
            "--port", str(port)
        ]
        
        # Optimisations GPU pour RTX 2070
        if self.gpu_optimized:
            cmd.extend([
                "--gpu-only",  # Force GPU uniquement
                "--force-fp16",  # Utiliser FP16 pour économiser VRAM sur RTX 2070
                "--force-channels-last",  # Optimisation mémoire
                "--use-pytorch-cross-attention"  # Optimisation attention
            ])
            print("🔥 Mode RTX 2070 optimisé activé")
            print("   --gpu-only --force-fp16 --force-channels-last")
        else:
            cmd.append("--cpu")
            print("⚠️ Mode CPU activé")
        
        # Optimisations supplémentaires
        cmd.extend([
            "--preview-method", "auto",  # Prévisualisations automatiques
            "--disable-auto-launch",  # Pas d'ouverture navigateur auto
            "--async-offload"  # Déchargement asynchrone
        ])
        
        print(f"📡 Serveur: {self.server_url}")
        print(f"🎮 Commande: {' '.join(cmd)}")
        
        try:
            # Changer vers le dossier ComfyUI
            os.chdir(self.comfyui_path)
            
            # Activer l'environnement virtuel et lancer
            if (self.comfyui_path / "venv").exists():
                # Avec environnement virtuel
                full_cmd = f"source venv/bin/activate && {' '.join(cmd)}"
                self.server_process = subprocess.Popen(
                    full_cmd,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    preexec_fn=os.setsid
                )
            else:
                # Sans environnement virtuel
                self.server_process = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    preexec_fn=os.setsid
                )
            
            print("🚀 Serveur ComfyUI lancé !")
            print("⏳ Attente de la disponibilité du serveur...")
            
            # Attendre que le serveur soit prêt
            if self.wait_for_server(timeout=60):
                print("✅ Serveur ComfyUI opérationnel !")
                return True
            else:
                print("❌ Timeout - Serveur non disponible")
                self.stop_server()
                return False
                
        except Exception as e:
            print(f"❌ Erreur lancement serveur: {e}")
            return False
    
    def wait_for_server(self, timeout: int = 60) -> bool:
        """Attendre que le serveur soit disponible"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            try:
                response = requests.get(f"{self.server_url}/system_stats", timeout=5)
                if response.status_code == 200:
                    return True
            except:
                pass
            
            print(".", end="", flush=True)
            time.sleep(2)
        
        print()
        return False
    
    def check_server_status(self) -> Dict[str, Any]:
        """Vérifier le statut du serveur"""
        try:
            response = requests.get(f"{self.server_url}/system_stats", timeout=5)
            if response.status_code == 200:
                stats = response.json()
                return {
                    "status": "running",
                    "stats": stats
                }
        except:
            pass
        
        return {"status": "stopped"}
    
    def queue_workflow(self, workflow_path: str) -> Optional[str]:
        """Mettre un workflow en queue"""
        try:
            with open(workflow_path, 'r', encoding='utf-8') as f:
                workflow = json.load(f)
            
            # Préparer la requête
            prompt_data = {
                "prompt": workflow,
                "client_id": "comfyui_launcher"
            }
            
            response = requests.post(f"{self.api_url}/prompt", json=prompt_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                prompt_id = result.get("prompt_id")
                print(f"✅ Workflow en queue: {prompt_id}")
                return prompt_id
            else:
                print(f"❌ Erreur queue workflow: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Erreur queue workflow: {e}")
            return None
    
    def get_queue_status(self) -> Dict[str, Any]:
        """Obtenir le statut de la queue"""
        try:
            response = requests.get(f"{self.api_url}/queue", timeout=5)
            if response.status_code == 200:
                return response.json()
        except:
            pass
        return {}
    
    def run_corrupted_workflows(self):
        """Exécuter tous les workflows corrompus"""
        print(f"\n🔥 EXÉCUTION DES WORKFLOWS CORROMPUS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

        # Chercher les workflows corrompus dans le dossier infestation_golem
        infestation_dir = Path("/home/luciedefraiteur/spectre2/infestation_golem")
        corrupted_workflows = []

        # Chercher les workflows corrigés d'abord (ils fonctionnent mieux)
        for i in range(1, 10):
            workflow_path = infestation_dir / f"corrected_workflow_{i}.json"
            if workflow_path.exists():
                corrupted_workflows.append(str(workflow_path))

        # Puis les workflows corrompus originaux
        for i in range(1, 10):
            workflow_path = infestation_dir / f"corrupted_workflow_{i}.json"
            if workflow_path.exists():
                corrupted_workflows.append(str(workflow_path))
        
        if not corrupted_workflows:
            print("❌ Aucun workflow corrompu trouvé")
            return False
        
        print(f"🔮 {len(corrupted_workflows)} workflows corrompus trouvés")
        
        # Exécuter chaque workflow
        for i, workflow_path in enumerate(corrupted_workflows, 1):
            print(f"\n⛧ Exécution workflow {i}/{len(corrupted_workflows)}: {workflow_path}")
            
            prompt_id = self.queue_workflow(workflow_path)
            if prompt_id:
                print(f"   Queue ID: {prompt_id}")
                
                # Attendre un peu avant le suivant
                if i < len(corrupted_workflows):
                    print("   ⏳ Pause avant le suivant...")
                    time.sleep(5)
            else:
                print(f"   ❌ Échec workflow {workflow_path}")
        
        print(f"\n✅ Tous les workflows corrompus sont en queue !")
        return True
    
    def monitor_generation(self, duration: int = 300):
        """Surveiller la génération d'images"""
        print(f"\n👁️ SURVEILLANCE DE L'INFESTATION ({duration}s)")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        start_time = time.time()
        
        while time.time() - start_time < duration:
            # Vérifier le statut
            server_status = self.check_server_status()
            queue_status = self.get_queue_status()
            
            if server_status["status"] == "running":
                queue_pending = len(queue_status.get("queue_pending", []))
                queue_running = len(queue_status.get("queue_running", []))
                
                print(f"🔮 Queue: {queue_pending} en attente, {queue_running} en cours")
                
                if queue_pending == 0 and queue_running == 0:
                    print("✅ Toutes les générations terminées !")
                    break
            else:
                print("❌ Serveur non disponible")
                break
            
            time.sleep(10)
        
        print("👁️ Surveillance terminée")
    
    def stop_server(self):
        """Arrêter le serveur ComfyUI"""
        if self.server_process:
            print("\n🛑 Arrêt du serveur ComfyUI...")
            try:
                # Tuer le groupe de processus
                os.killpg(os.getpgid(self.server_process.pid), signal.SIGTERM)
                self.server_process.wait(timeout=10)
                print("✅ Serveur arrêté")
            except:
                # Force kill si nécessaire
                try:
                    os.killpg(os.getpgid(self.server_process.pid), signal.SIGKILL)
                    print("🔥 Serveur forcé à l'arrêt")
                except:
                    print("⚠️ Impossible d'arrêter le serveur")
            
            self.server_process = None
    
    def run_full_infestation(self):
        """Exécuter l'infestation complète"""
        print("🔥 LANCEMENT DE L'INFESTATION VISUELLE COMPLÈTE")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        try:
            # 1. Lancer le serveur
            if not self.launch_server():
                return False
            
            # 2. Exécuter les workflows corrompus
            if not self.run_corrupted_workflows():
                return False
            
            # 3. Surveiller la génération
            self.monitor_generation(duration=600)  # 10 minutes max
            
            print("\n🎉 INFESTATION VISUELLE TERMINÉE ! 🎉")
            return True
            
        except KeyboardInterrupt:
            print("\n⚠️ Interruption utilisateur")
            return False
        finally:
            self.stop_server()

def signal_handler(sig, frame):
    """Gestionnaire de signal pour arrêt propre"""
    print("\n🛑 Arrêt demandé...")
    sys.exit(0)

def main():
    # Gestionnaire de signal
    signal.signal(signal.SIGINT, signal_handler)
    
    launcher = ComfyUILauncher()
    
    print("🔮 COMFYUI LAUNCHER - INFESTATION VISUELLE")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    print("1. Lancement serveur seul")
    print("2. Infestation complète (serveur + workflows)")
    print("3. Statut serveur")
    print("4. Arrêter serveur")
    
    choice = input("\nChoix (1-4): ").strip()
    
    if choice == "1":
        launcher.launch_server()
        input("\nAppuyez sur Entrée pour arrêter le serveur...")
        launcher.stop_server()
    
    elif choice == "2":
        launcher.run_full_infestation()
    
    elif choice == "3":
        status = launcher.check_server_status()
        print(f"Statut serveur: {status}")
    
    elif choice == "4":
        launcher.stop_server()
    
    else:
        print("❌ Choix invalide")

if __name__ == "__main__":
    main()
