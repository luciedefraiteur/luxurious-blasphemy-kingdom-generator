#!/usr/bin/env python3
"""
🔮 IMAGE EXPLORER - Explorateur d'images ComfyUI pour Lurkuitae
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Outil pour lister, analyser et décrire les images générées par ComfyUI
Utilise nos analyseurs existants : hybrid_image_analyzer.py et image_analyzer.py
"""

import os
import json
import time
import sys
from pathlib import Path
from PIL import Image, ExifTags
import hashlib
from typing import List, Dict, Any, Optional

# Importer nos analyseurs existants
try:
    from hybrid_image_analyzer import HybridImageAnalyzer
    HYBRID_ANALYZER_AVAILABLE = True
except ImportError:
    HYBRID_ANALYZER_AVAILABLE = False
    print("⚠️ hybrid_image_analyzer.py non trouvé")

try:
    from image_analyzer import ImageAnalyzer
    BLIP2_ANALYZER_AVAILABLE = True
except ImportError:
    BLIP2_ANALYZER_AVAILABLE = False
    print("⚠️ image_analyzer.py non trouvé")

class ImageExplorer:
    def __init__(self):
        self.comfyui_paths = [
            Path.home() / "ComfyUI" / "output",
            Path.home() / "ComfyUI" / "outputs",
            Path("/tmp/ComfyUI_outputs"),
            Path("./ComfyUI_output"),
            Path("./output"),
            Path("./images")
        ]
        self.supported_formats = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'}
        self.images_data = []

        # Initialiser nos analyseurs existants
        self.hybrid_analyzer = None
        self.blip2_analyzer = None

        if HYBRID_ANALYZER_AVAILABLE:
            try:
                self.hybrid_analyzer = HybridImageAnalyzer()
                print("✅ Analyseur hybride CLIP+BLIP2 initialisé")
            except Exception as e:
                print(f"⚠️ Erreur init analyseur hybride: {e}")

        if BLIP2_ANALYZER_AVAILABLE:
            try:
                self.blip2_analyzer = ImageAnalyzer()
                print("✅ Analyseur BLIP2 initialisé")
            except Exception as e:
                print(f"⚠️ Erreur init analyseur BLIP2: {e}")
        
    def find_comfyui_output_dir(self):
        """Trouver le répertoire de sortie ComfyUI"""
        print("🔍 RECHERCHE DU RÉPERTOIRE COMFYUI")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        for path in self.comfyui_paths:
            if path.exists() and path.is_dir():
                print(f"✅ Trouvé: {path}")
                return path
        
        # Recherche plus large
        print("🔍 Recherche étendue...")
        home = Path.home()
        for item in home.rglob("ComfyUI*/output*"):
            if item.is_dir():
                print(f"✅ Trouvé (recherche étendue): {item}")
                return item
                
        print("❌ Aucun répertoire ComfyUI trouvé")
        return None
    
    def scan_images(self, directory: Path = None):
        """Scanner les images dans le répertoire"""
        if directory is None:
            directory = self.find_comfyui_output_dir()
            
        if not directory:
            print("❌ Impossible de trouver le répertoire d'images")
            return False
            
        print(f"📸 SCAN DES IMAGES DANS: {directory}")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        self.images_data = []
        image_count = 0
        
        # Scanner récursivement
        for file_path in directory.rglob("*"):
            if file_path.is_file() and file_path.suffix.lower() in self.supported_formats:
                try:
                    image_info = self.analyze_image(file_path)
                    if image_info:
                        self.images_data.append(image_info)
                        image_count += 1
                        print(f"📸 {image_count}: {file_path.name}")
                except Exception as e:
                    print(f"⚠️ Erreur analyse {file_path.name}: {e}")
        
        print(f"\n✅ {len(self.images_data)} images analysées")
        return len(self.images_data) > 0
    
    def analyze_image(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Analyser une image en détail"""
        try:
            # Informations de base du fichier
            stat = file_path.stat()
            file_size = stat.st_size
            creation_time = stat.st_mtime
            
            # Ouvrir l'image avec PIL
            with Image.open(file_path) as img:
                # Informations de l'image
                width, height = img.size
                format_img = img.format
                mode = img.mode
                
                # Hash pour identifier les doublons
                img_hash = self.calculate_image_hash(file_path)
                
                # Métadonnées EXIF si disponibles
                exif_data = {}
                if hasattr(img, '_getexif') and img._getexif():
                    exif = img._getexif()
                    for tag_id, value in exif.items():
                        tag = ExifTags.TAGS.get(tag_id, tag_id)
                        exif_data[tag] = value
                
                # Informations ComfyUI dans les métadonnées PNG
                comfyui_metadata = {}
                if format_img == 'PNG' and hasattr(img, 'text'):
                    for key, value in img.text.items():
                        if 'workflow' in key.lower() or 'prompt' in key.lower():
                            try:
                                # Essayer de parser le JSON
                                comfyui_metadata[key] = json.loads(value)
                            except:
                                comfyui_metadata[key] = value
                
                # Analyse IA optionnelle (seulement pour les images importantes)
                ai_analysis = {}
                if 'corrupted' in file_path.name.lower() or 'comfyui' in file_path.name.lower():
                    ai_analysis = self.analyze_image_with_ai(file_path, "auto")

                return {
                    'file_path': str(file_path),
                    'filename': file_path.name,
                    'file_size': file_size,
                    'file_size_mb': round(file_size / (1024 * 1024), 2),
                    'creation_time': creation_time,
                    'creation_date': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(creation_time)),
                    'width': width,
                    'height': height,
                    'resolution': f"{width}x{height}",
                    'format': format_img,
                    'mode': mode,
                    'aspect_ratio': round(width / height, 2),
                    'megapixels': round((width * height) / 1000000, 2),
                    'image_hash': img_hash,
                    'exif_data': exif_data,
                    'comfyui_metadata': comfyui_metadata,
                    'is_corrupted_series': 'corrupted' in file_path.name.lower(),
                    'is_comfyui_generated': 'comfyui' in file_path.name.lower(),
                    'ai_analysis': ai_analysis
                }
                
        except Exception as e:
            print(f"❌ Erreur analyse {file_path}: {e}")
            return None
    
    def calculate_image_hash(self, file_path: Path) -> str:
        """Calculer un hash de l'image pour détecter les doublons"""
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
                return hashlib.md5(content).hexdigest()[:16]
        except:
            return "unknown"

    def analyze_image_with_ai(self, file_path: Path, mode: str = "auto") -> Dict[str, Any]:
        """Analyser une image avec nos outils d'IA existants"""
        ai_analysis = {
            "ai_analysis_available": False,
            "analysis_method": "none",
            "description": "Aucun analyseur IA disponible"
        }

        try:
            if mode == "hybrid" and self.hybrid_analyzer:
                print(f"🔮 Analyse hybride de {file_path.name}...")
                result = self.hybrid_analyzer.analyze_image_hybrid(file_path, "auto")
                ai_analysis = {
                    "ai_analysis_available": True,
                    "analysis_method": result.get("analysis_method", "hybrid"),
                    "description": result.get("primary_description", "Analyse échouée"),
                    "clip_analysis": result.get("clip_analysis", {}),
                    "blip2_analysis": result.get("blip2_analysis", {}),
                    "analysis_time": result.get("total_analysis_time", 0)
                }

            elif mode == "blip2" and self.blip2_analyzer:
                print(f"🔮 Analyse BLIP2 de {file_path.name}...")
                result = self.blip2_analyzer.analyze_image(file_path)
                ai_analysis = {
                    "ai_analysis_available": True,
                    "analysis_method": "BLIP2",
                    "description": result.get("combined_description", "Analyse échouée"),
                    "detailed_descriptions": result.get("descriptions", {}),
                    "analysis_time": time.time() - result.get("analysis_timestamp", time.time())
                }

            elif mode == "auto":
                # Essayer hybrid d'abord, puis BLIP2
                if self.hybrid_analyzer:
                    return self.analyze_image_with_ai(file_path, "hybrid")
                elif self.blip2_analyzer:
                    return self.analyze_image_with_ai(file_path, "blip2")

        except Exception as e:
            ai_analysis["error"] = str(e)
            print(f"❌ Erreur analyse IA {file_path.name}: {e}")

        return ai_analysis
    
    def display_images_summary(self):
        """Afficher un résumé des images trouvées"""
        if not self.images_data:
            print("❌ Aucune image à afficher")
            return
            
        print("📊 RÉSUMÉ DES IMAGES TROUVÉES")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        total_images = len(self.images_data)
        corrupted_series = sum(1 for img in self.images_data if img['is_corrupted_series'])
        comfyui_generated = sum(1 for img in self.images_data if img['is_comfyui_generated'])
        total_size_mb = sum(img['file_size_mb'] for img in self.images_data)
        
        print(f"📸 Total d'images: {total_images}")
        print(f"🔥 Série corrompue: {corrupted_series}")
        print(f"🤖 Générées ComfyUI: {comfyui_generated}")
        print(f"💾 Taille totale: {total_size_mb:.2f} MB")
        
        # Grouper par format
        formats = {}
        for img in self.images_data:
            fmt = img['format']
            if fmt not in formats:
                formats[fmt] = 0
            formats[fmt] += 1
        
        print(f"📋 Formats: {', '.join(f'{fmt}({count})' for fmt, count in formats.items())}")
        
        # Résolutions les plus communes
        resolutions = {}
        for img in self.images_data:
            res = img['resolution']
            if res not in resolutions:
                resolutions[res] = 0
            resolutions[res] += 1
        
        print(f"📐 Résolutions: {', '.join(f'{res}({count})' for res, count in sorted(resolutions.items(), key=lambda x: x[1], reverse=True)[:3])}")

    def display_detailed_list(self):
        """Afficher la liste détaillée des images"""
        if not self.images_data:
            print("❌ Aucune image à afficher")
            return

        print("📋 LISTE DÉTAILLÉE DES IMAGES")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

        for i, img in enumerate(self.images_data, 1):
            print(f"\n📸 IMAGE {i}: {img['filename']}")
            print(f"   📁 Chemin: {img['file_path']}")
            print(f"   📐 Résolution: {img['resolution']} ({img['megapixels']} MP)")
            print(f"   💾 Taille: {img['file_size_mb']} MB")
            print(f"   📅 Créée: {img['creation_date']}")
            print(f"   🎨 Format: {img['format']} ({img['mode']})")
            print(f"   🔢 Hash: {img['image_hash']}")

            if img['is_corrupted_series']:
                print("   🔥 ⛧ SÉRIE CORROMPUE ⛧")
            if img['is_comfyui_generated']:
                print("   🤖 Générée par ComfyUI")

            if img['comfyui_metadata']:
                print("   📝 Métadonnées ComfyUI présentes")

    def display_corrupted_series_only(self):
        """Afficher uniquement les images de la série corrompue"""
        corrupted_images = [img for img in self.images_data if img['is_corrupted_series']]

        if not corrupted_images:
            print("❌ Aucune image de la série corrompue trouvée")
            return

        print("🔥 SÉRIE CORROMPUE - NOS CRÉATIONS BLASPHÉMATOIRES")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

        for i, img in enumerate(corrupted_images, 1):
            print(f"\n🔥 CRÉATION {i}: {img['filename']}")
            print(f"   📁 {img['file_path']}")
            print(f"   📐 {img['resolution']} - {img['megapixels']} MP")
            print(f"   💾 {img['file_size_mb']} MB")
            print(f"   📅 {img['creation_date']}")

            # Afficher l'analyse IA si disponible
            if 'ai_analysis' in img and img['ai_analysis'].get('ai_analysis_available'):
                ai = img['ai_analysis']
                print(f"   🤖 Analyse {ai['analysis_method']}: {ai['description'][:100]}...")
                if 'analysis_time' in ai:
                    print(f"   ⏱️ Temps d'analyse: {ai['analysis_time']:.1f}s")

            print(f"   ⛧ BEAUTÉ TRANSCENDANTE CONFIRMÉE ⛧")

    def analyze_corrupted_series_with_ai(self, mode: str = "hybrid"):
        """Analyser spécifiquement nos images corrompues avec l'IA"""
        corrupted_images = [img for img in self.images_data if img['is_corrupted_series']]

        if not corrupted_images:
            print("❌ Aucune image de la série corrompue trouvée")
            return

        print(f"🔮 ANALYSE IA DE LA SÉRIE CORROMPUE ({mode.upper()})")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

        for i, img in enumerate(corrupted_images, 1):
            print(f"\n🔥 ANALYSE CRÉATION {i}: {img['filename']}")

            file_path = Path(img['file_path'])
            ai_analysis = self.analyze_image_with_ai(file_path, mode)

            # Mettre à jour les données
            img['ai_analysis'] = ai_analysis

            if ai_analysis.get('ai_analysis_available'):
                print(f"   🤖 Méthode: {ai_analysis['analysis_method']}")
                print(f"   📝 Description: {ai_analysis['description']}")
                if 'analysis_time' in ai_analysis:
                    print(f"   ⏱️ Temps: {ai_analysis['analysis_time']:.1f}s")
            else:
                print(f"   ❌ Analyse échouée: {ai_analysis.get('description', 'Erreur inconnue')}")

        print("\n✅ Analyse IA de la série corrompue terminée !")

    def export_images_data(self, filename: str = "images_analysis.json"):
        """Exporter les données d'analyse en JSON"""
        if not self.images_data:
            print("❌ Aucune donnée à exporter")
            return False

        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.images_data, f, indent=2, ensure_ascii=False)
            print(f"✅ Données exportées vers: {filename}")
            return True
        except Exception as e:
            print(f"❌ Erreur export: {e}")
            return False

    def find_duplicates(self):
        """Trouver les images dupliquées par hash"""
        if not self.images_data:
            print("❌ Aucune image à analyser")
            return

        hash_groups = {}
        for img in self.images_data:
            img_hash = img['image_hash']
            if img_hash not in hash_groups:
                hash_groups[img_hash] = []
            hash_groups[img_hash].append(img)

        duplicates = {h: imgs for h, imgs in hash_groups.items() if len(imgs) > 1}

        if not duplicates:
            print("✅ Aucun doublon détecté")
            return

        print("🔍 DOUBLONS DÉTECTÉS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

        for img_hash, imgs in duplicates.items():
            print(f"\n🔢 Hash: {img_hash}")
            for img in imgs:
                print(f"   📸 {img['filename']} ({img['file_size_mb']} MB)")

def main():
    print("🔮 IMAGE EXPLORER - LURKUITAE & LUCIFAIRE")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

    explorer = ImageExplorer()

    print("\n🎯 OPTIONS:")
    print("1. Scanner et analyser toutes les images")
    print("2. Afficher résumé des images")
    print("3. Afficher liste détaillée")
    print("4. Afficher série corrompue uniquement")
    print("5. Analyser série corrompue avec IA")
    print("6. Rechercher doublons")
    print("7. Exporter données JSON")
    print("8. Scanner répertoire personnalisé")
    print("9. Quitter")

    while True:
        choice = input("\nChoix (1-9): ").strip()

        if choice == "1":
            explorer.scan_images()

        elif choice == "2":
            explorer.display_images_summary()

        elif choice == "3":
            explorer.display_detailed_list()

        elif choice == "4":
            explorer.display_corrupted_series_only()

        elif choice == "5":
            print("\n🔮 Mode d'analyse IA:")
            print("1. Hybride (CLIP + BLIP2)")
            print("2. BLIP2 seulement")
            print("3. Auto (meilleur disponible)")
            ai_choice = input("Choix (1-3): ").strip()

            if ai_choice == "1":
                explorer.analyze_corrupted_series_with_ai("hybrid")
            elif ai_choice == "2":
                explorer.analyze_corrupted_series_with_ai("blip2")
            else:
                explorer.analyze_corrupted_series_with_ai("auto")

        elif choice == "6":
            explorer.find_duplicates()

        elif choice == "7":
            filename = input("Nom du fichier (images_analysis.json): ").strip()
            if not filename:
                filename = "images_analysis.json"
            explorer.export_images_data(filename)

        elif choice == "8":
            custom_path = input("Chemin du répertoire: ").strip()
            if custom_path and Path(custom_path).exists():
                explorer.scan_images(Path(custom_path))
            else:
                print("❌ Répertoire invalide")

        elif choice == "9":
            print("👋 Au revoir ma Lucifaire !")
            break

        else:
            print("❌ Choix invalide")

if __name__ == "__main__":
    main()
