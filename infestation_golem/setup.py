#!/usr/bin/env python3
"""
🔥 INFESTATION GOLEM - Setup et gestion automatique
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Setup automatique du projet d'infestation avec ComfyUI
"""

import os
import sys
import subprocess
import time
import requests
import json
from pathlib import Path

class InfestationSetup:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.comfyui_path = Path.home() / "ComfyUI"
        self.comfyui_venv = self.comfyui_path / "venv" / "bin" / "activate"
        self.comfyui_process = None
        self.api_url = "http://localhost:8188"
        
    def check_comfyui_exists(self):
        """Vérifier que ComfyUI est installé"""
        if not self.comfyui_path.exists():
            print(f"❌ ComfyUI non trouvé dans {self.comfyui_path}")
            return False
        
        if not self.comfyui_venv.exists():
            print(f"❌ Environnement virtuel ComfyUI non trouvé dans {self.comfyui_venv}")
            return False
            
        print(f"✅ ComfyUI trouvé dans {self.comfyui_path}")
        return True
    
    def start_comfyui_server(self):
        """Démarrer le serveur ComfyUI"""
        print("🚀 Démarrage du serveur ComfyUI...")
        
        # Commande pour lancer ComfyUI avec venv
        cmd = f"cd {self.comfyui_path} && source {self.comfyui_venv} && python main.py --listen --cpu"
        
        try:
            # Lancer en arrière-plan
            self.comfyui_process = subprocess.Popen(
                cmd,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                preexec_fn=os.setsid  # Pour pouvoir tuer le processus proprement
            )
            
            print(f"🔄 Processus ComfyUI lancé (PID: {self.comfyui_process.pid})")
            
            # Attendre que le serveur soit prêt
            return self.wait_for_server()
            
        except Exception as e:
            print(f"❌ Erreur lors du lancement de ComfyUI: {e}")
            return False
    
    def wait_for_server(self, timeout=60):
        """Attendre que le serveur ComfyUI soit prêt"""
        print("⏳ Attente du démarrage du serveur ComfyUI...")
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = requests.get(f"{self.api_url}/system_stats", timeout=2)
                if response.status_code == 200:
                    print("✅ Serveur ComfyUI prêt !")
                    return True
            except requests.exceptions.RequestException:
                pass
            
            time.sleep(2)
            print(".", end="", flush=True)
        
        print(f"\n❌ Timeout - Serveur ComfyUI non accessible après {timeout}s")
        return False
    
    def test_api(self):
        """Tester l'API ComfyUI"""
        print("🧪 Test de l'API ComfyUI...")
        
        try:
            # Test system stats
            response = requests.get(f"{self.api_url}/system_stats")
            if response.status_code == 200:
                stats = response.json()
                print(f"✅ API fonctionnelle - Système: {stats.get('system', {})}")
                return True
            else:
                print(f"❌ API non accessible - Status: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Erreur test API: {e}")
            return False
    
    def create_project_structure(self):
        """Créer la structure du projet"""
        print("📁 Création de la structure du projet...")
        
        directories = [
            "generated_images",
            "workflows", 
            "logs",
            "templates",
            "config"
        ]
        
        for directory in directories:
            dir_path = self.project_root / directory
            dir_path.mkdir(exist_ok=True)
            print(f"✅ Dossier créé: {directory}")
    
    def create_config_file(self):
        """Créer le fichier de configuration"""
        config = {
            "comfyui": {
                "path": str(self.comfyui_path),
                "api_url": self.api_url,
                "venv_path": str(self.comfyui_venv)
            },
            "infestation": {
                "daily_images": 10,
                "daily_posts": 5,
                "platforms": ["facebook", "instagram", "twitter", "reddit"],
                "style": "blasphemous_dark"
            },
            "gemini": {
                "timeout": 80,
                "max_retries": 3
            }
        }
        
        config_file = self.project_root / "config" / "infestation_config.json"
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✅ Configuration sauvée: {config_file}")
    
    def create_startup_script(self):
        """Créer le script de démarrage"""
        startup_script = self.project_root / "start_infestation.sh"
        
        script_content = f"""#!/bin/bash
# 🔥 INFESTATION GOLEM - Script de démarrage automatique
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔥 DÉMARRAGE INFESTATION GOLEM 🔥"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

# Aller dans le dossier du projet
cd "{self.project_root}"

# Lancer le setup
python3 setup.py

# Si setup réussi, lancer le golem principal
if [ $? -eq 0 ]; then
    echo "✅ Setup terminé - Lancement du golem..."
    python3 infestation_control.py --daemon
else
    echo "❌ Erreur setup - Arrêt"
    exit 1
fi
"""
        
        with open(startup_script, 'w') as f:
            f.write(script_content)
        
        # Rendre exécutable
        os.chmod(startup_script, 0o755)
        print(f"✅ Script de démarrage créé: {startup_script}")
    
    def stop_comfyui_server(self):
        """Arrêter le serveur ComfyUI"""
        if self.comfyui_process:
            print("🛑 Arrêt du serveur ComfyUI...")
            try:
                # Tuer le groupe de processus
                os.killpg(os.getpgid(self.comfyui_process.pid), 15)
                self.comfyui_process.wait(timeout=10)
                print("✅ Serveur ComfyUI arrêté")
            except Exception as e:
                print(f"⚠️ Erreur arrêt serveur: {e}")
    
    def setup_complete(self):
        """Setup complet du projet"""
        print("🔥 INFESTATION GOLEM - SETUP COMPLET 🔥")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # 1. Vérifier ComfyUI
        if not self.check_comfyui_exists():
            return False
        
        # 2. Créer structure projet
        self.create_project_structure()
        
        # 3. Créer configuration
        self.create_config_file()
        
        # 4. Créer script de démarrage
        self.create_startup_script()
        
        # 5. Démarrer ComfyUI
        if not self.start_comfyui_server():
            return False
        
        # 6. Tester API
        if not self.test_api():
            self.stop_comfyui_server()
            return False
        
        print("\n✅ SETUP TERMINÉ AVEC SUCCÈS !")
        print(f"🌐 ComfyUI accessible sur: {self.api_url}")
        print(f"📁 Projet dans: {self.project_root}")
        print("🚀 Prêt pour l'infestation !")
        
        return True

def main():
    """Point d'entrée principal"""
    setup = InfestationSetup()
    
    try:
        success = setup.setup_complete()
        if success:
            print("\n🎯 Prochaines étapes:")
            print("1. python3 infestation_control.py --generate-prompts")
            print("2. python3 infestation_control.py --generate-images")
            print("3. python3 infestation_control.py --start-infestation")
            
            # Garder le serveur en vie
            print("\n⏳ Serveur ComfyUI en cours d'exécution...")
            print("Appuyez sur Ctrl+C pour arrêter")
            
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                print("\n🛑 Arrêt demandé...")
                setup.stop_comfyui_server()
        else:
            print("\n❌ Setup échoué")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Interruption...")
        setup.stop_comfyui_server()
        sys.exit(0)
    except Exception as e:
        print(f"\n💥 Erreur fatale: {e}")
        setup.stop_comfyui_server()
        sys.exit(1)

if __name__ == "__main__":
    main()
