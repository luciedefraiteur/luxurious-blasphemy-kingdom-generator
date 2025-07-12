#!/usr/bin/env python3
"""
🔥 INFESTATION CONTROL - Contrôleur principal du golem d'infestation
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Contrôleur principal pour l'infestation des réseaux sociaux
"""

import argparse
import json
import sys
import time
from pathlib import Path
from typing import List, Dict, Any

from comfyui_interface import ComfyUIInterface
from gemini_prompts import GeminiPromptGenerator
from social_helper import SocialMediaHelper
from egregore_engine import EgregorEngine

class InfestationController:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.config_file = self.project_root / "config" / "infestation_config.json"
        self.config = self.load_config()
        
        # Initialiser les modules
        self.comfyui = ComfyUIInterface(self.config["comfyui"]["api_url"])
        self.prompt_generator = GeminiPromptGenerator()
        self.social_helper = SocialMediaHelper()
        self.egregore_engine = EgregorEngine()
        
        self.generated_images_dir = self.project_root / "generated_images"
        self.logs_dir = self.project_root / "logs"
        
    def load_config(self) -> Dict[str, Any]:
        """Charger la configuration"""
        try:
            with open(self.config_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Erreur chargement config: {e}")
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """Configuration par défaut"""
        return {
            "comfyui": {
                "api_url": "http://localhost:8188"
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
    
    def status(self):
        """Afficher le statut du système"""
        print("🔥 INFESTATION GOLEM - STATUS 🔥")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Status ComfyUI
        if self.comfyui.connect():
            print("✅ ComfyUI: CONNECTÉ")
            models = self.comfyui.get_models()
            print(f"📦 Modèles: {len(models.get('checkpoints', []))} disponibles")
        else:
            print("❌ ComfyUI: DÉCONNECTÉ")
        
        # Status Gemini
        if self.prompt_generator.test_connection():
            print("✅ Gemini: CONNECTÉ")
        else:
            print("❌ Gemini: DÉCONNECTÉ")
        
        # Statistiques
        images_count = len(list(self.generated_images_dir.glob("**/*.png")))
        print(f"🎨 Images générées: {images_count}")
        
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    def generate_prompts(self, count: int = 10, style: str = "blasphemous"):
        """Générer des prompts via Gemini"""
        print(f"🔮 Génération de {count} prompts style '{style}'...")
        
        prompts = self.prompt_generator.generate_batch(count, style)
        
        if prompts:
            # Sauvegarder les prompts
            prompts_file = self.project_root / "generated_prompts.json"
            with open(prompts_file, 'w') as f:
                json.dump(prompts, f, indent=2)
            
            print(f"✅ {len(prompts)} prompts générés et sauvés")
            
            # Afficher quelques exemples
            for i, prompt in enumerate(prompts[:3]):
                print(f"  {i+1}. {prompt[:80]}...")
        else:
            print("❌ Aucun prompt généré")
    
    def generate_images(self, count: int = 5, use_saved_prompts: bool = True):
        """Générer des images via ComfyUI"""
        print(f"🎨 Génération de {count} images...")
        
        # Récupérer les prompts
        if use_saved_prompts:
            prompts_file = self.project_root / "generated_prompts.json"
            if prompts_file.exists():
                with open(prompts_file, 'r') as f:
                    prompts = json.load(f)
            else:
                print("❌ Aucun prompt sauvé - Génération de prompts d'abord...")
                self.generate_prompts(count)
                with open(prompts_file, 'r') as f:
                    prompts = json.load(f)
        else:
            prompts = self.prompt_generator.generate_batch(count, "blasphemous")
        
        if not prompts:
            print("❌ Aucun prompt disponible")
            return
        
        # Générer les images
        generated_images = []
        save_dir = self.generated_images_dir / time.strftime("%Y%m%d")
        
        for i, prompt in enumerate(prompts[:count]):
            print(f"\n🎨 Image {i+1}/{count}")
            
            images = self.comfyui.generate_image(
                prompt=prompt,
                negative_prompt="blurry, low quality, censored, safe",
                width=512,
                height=512,
                steps=20,
                cfg=7.5,
                save_dir=save_dir
            )
            
            generated_images.extend(images)
        
        print(f"\n✅ {len(generated_images)} images générées au total")
        return generated_images
    
    def create_egregores(self, count: int = 5):
        """Créer des égrégores subtils"""
        print(f"🧬 Création de {count} égrégores...")
        
        egregores = self.egregore_engine.create_batch(count)
        
        if egregores:
            # Sauvegarder
            egregores_file = self.project_root / "generated_egregores.json"
            with open(egregores_file, 'w') as f:
                json.dump(egregores, f, indent=2)
            
            print(f"✅ {len(egregores)} égrégores créés")
            
            # Afficher exemples
            for i, egregore in enumerate(egregores[:2]):
                print(f"  {i+1}. {egregore['text'][:60]}...")
        else:
            print("❌ Aucun égrégore créé")
    
    def prepare_posts(self, platform: str = "all"):
        """Préparer des posts pour les réseaux sociaux"""
        print(f"📱 Préparation posts pour: {platform}")
        
        # Récupérer images récentes
        today_dir = self.generated_images_dir / time.strftime("%Y%m%d")
        if today_dir.exists():
            images = list(today_dir.glob("*.png"))
        else:
            images = list(self.generated_images_dir.glob("**/*.png"))[-5:]  # 5 plus récentes
        
        if not images:
            print("❌ Aucune image disponible - Générez des images d'abord")
            return
        
        # Préparer les posts
        prepared_posts = self.social_helper.prepare_posts(images, platform)
        
        if prepared_posts:
            posts_file = self.project_root / "prepared_posts.json"
            with open(posts_file, 'w') as f:
                json.dump(prepared_posts, f, indent=2)
            
            print(f"✅ {len(prepared_posts)} posts préparés")
            self.show_prepared_posts()
        else:
            print("❌ Aucun post préparé")
    
    def show_prepared_posts(self):
        """Afficher les posts préparés"""
        posts_file = self.project_root / "prepared_posts.json"
        if not posts_file.exists():
            print("❌ Aucun post préparé")
            return
        
        with open(posts_file, 'r') as f:
            posts = json.load(f)
        
        print("\n📱 POSTS PRÉPARÉS:")
        print("═" * 60)
        
        for i, post in enumerate(posts):
            print(f"\n{i+1}. Platform: {post['platform']}")
            print(f"   Image: {post['image_path']}")
            print(f"   Caption: {post['caption'][:80]}...")
            print(f"   Hashtags: {post['hashtags']}")
    
    def daily_routine(self):
        """Routine quotidienne d'infestation"""
        print("🌅 ROUTINE QUOTIDIENNE D'INFESTATION")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        config = self.config["infestation"]
        
        # 1. Générer prompts
        print("\n1️⃣ Génération prompts...")
        self.generate_prompts(config["daily_images"] * 2)  # Plus de prompts que d'images
        
        # 2. Générer images
        print("\n2️⃣ Génération images...")
        self.generate_images(config["daily_images"])
        
        # 3. Créer égrégores
        print("\n3️⃣ Création égrégores...")
        self.create_egregores(5)
        
        # 4. Préparer posts
        print("\n4️⃣ Préparation posts...")
        self.prepare_posts("all")
        
        print("\n✅ ROUTINE QUOTIDIENNE TERMINÉE")
        print("📱 Posts prêts pour publication manuelle")
    
    def daemon_mode(self):
        """Mode daemon - routine automatique"""
        print("🤖 MODE DAEMON - INFESTATION CONTINUE")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        try:
            while True:
                # Routine quotidienne
                self.daily_routine()
                
                # Attendre 24h
                print("\n⏰ Attente 24h avant prochaine routine...")
                time.sleep(24 * 60 * 60)  # 24 heures
                
        except KeyboardInterrupt:
            print("\n🛑 Arrêt daemon demandé")

def main():
    """Point d'entrée principal"""
    parser = argparse.ArgumentParser(description="🔥 Infestation Golem Controller")
    
    parser.add_argument("--status", action="store_true", help="Afficher le statut")
    parser.add_argument("--generate-prompts", type=int, metavar="COUNT", help="Générer des prompts")
    parser.add_argument("--generate-images", type=int, metavar="COUNT", help="Générer des images")
    parser.add_argument("--create-egregores", type=int, metavar="COUNT", help="Créer des égrégores")
    parser.add_argument("--prepare-posts", type=str, metavar="PLATFORM", help="Préparer posts (all/facebook/instagram/twitter/reddit)")
    parser.add_argument("--show-posts", action="store_true", help="Afficher posts préparés")
    parser.add_argument("--daily-routine", action="store_true", help="Routine quotidienne complète")
    parser.add_argument("--daemon", action="store_true", help="Mode daemon continu")
    
    args = parser.parse_args()
    
    controller = InfestationController()
    
    if args.status:
        controller.status()
    elif args.generate_prompts:
        controller.generate_prompts(args.generate_prompts)
    elif args.generate_images:
        controller.generate_images(args.generate_images)
    elif args.create_egregores:
        controller.create_egregores(args.create_egregores)
    elif args.prepare_posts:
        controller.prepare_posts(args.prepare_posts)
    elif args.show_posts:
        controller.show_prepared_posts()
    elif args.daily_routine:
        controller.daily_routine()
    elif args.daemon:
        controller.daemon_mode()
    else:
        print("🔥 INFESTATION GOLEM CONTROLLER 🔥")
        print("Utilisez --help pour voir les commandes disponibles")
        controller.status()

if __name__ == "__main__":
    main()
