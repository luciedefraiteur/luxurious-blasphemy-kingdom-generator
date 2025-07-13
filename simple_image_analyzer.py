#!/usr/bin/env python3
"""
🔮 SIMPLE IMAGE ANALYZER - Analyse basique pour stratégie progressive
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Analyse simple des images corrompues pour établir stratégie d'infestation progressive
"""

import os
import json
from pathlib import Path
from PIL import Image
import hashlib

class SimpleImageAnalyzer:
    def __init__(self):
        self.corrupted_images = []
        
    def analyze_corrupted_images(self):
        """Analyser nos 4 images corrompues"""
        comfyui_output = Path.home() / "ComfyUI" / "output"
        
        print("🔮 ANALYSE STRATÉGIQUE DES CRÉATIONS CORROMPUES")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Trouver les images corrompues
        corrupted_files = list(comfyui_output.glob("ComfyUI_corrupted_*.png"))
        corrupted_files.sort()
        
        for i, image_path in enumerate(corrupted_files, 1):
            print(f"\n🔥 ANALYSE CRÉATION {i}: {image_path.name}")
            
            # Analyse basique
            analysis = self.analyze_single_image(image_path)
            analysis["creation_number"] = i
            analysis["strategic_assessment"] = self.assess_blasphemy_level(analysis)
            
            self.corrupted_images.append(analysis)
            
            print(f"   📐 Résolution: {analysis['width']}x{analysis['height']}")
            print(f"   💾 Taille: {analysis['file_size_mb']:.2f} MB")
            print(f"   🎨 Complexité couleur: {analysis['color_complexity']}")
            print(f"   ⛧ Niveau blasphème estimé: {analysis['strategic_assessment']['blasphemy_level']}")
            print(f"   📊 Recommandation: {analysis['strategic_assessment']['recommendation']}")
        
        return self.corrupted_images
    
    def analyze_single_image(self, image_path: Path):
        """Analyse technique d'une image"""
        try:
            with Image.open(image_path) as img:
                # Informations de base
                width, height = img.size
                file_size = image_path.stat().st_size
                
                # Analyse des couleurs
                colors = img.getcolors(maxcolors=256*256*256)
                unique_colors = len(colors) if colors else 0
                
                # Complexité basée sur la diversité des couleurs
                color_complexity = min(unique_colors / 10000, 1.0)  # Normalisé 0-1
                
                # Hash pour identification
                img_hash = hashlib.md5(image_path.read_bytes()).hexdigest()[:16]
                
                return {
                    "file_path": str(image_path),
                    "filename": image_path.name,
                    "width": width,
                    "height": height,
                    "file_size": file_size,
                    "file_size_mb": file_size / (1024 * 1024),
                    "unique_colors": unique_colors,
                    "color_complexity": color_complexity,
                    "aspect_ratio": width / height,
                    "image_hash": img_hash,
                    "creation_time": image_path.stat().st_mtime
                }
                
        except Exception as e:
            return {"error": str(e), "file_path": str(image_path)}
    
    def assess_blasphemy_level(self, analysis):
        """Évaluer le niveau de blasphème basé sur les caractéristiques techniques"""
        
        # Facteurs d'évaluation
        complexity = analysis.get('color_complexity', 0)
        file_size = analysis.get('file_size_mb', 0)
        
        # Heuristiques pour estimer le niveau de blasphème
        # Plus l'image est complexe et lourde, plus elle risque d'être intense
        
        blasphemy_score = 0
        
        # Complexité des couleurs (0-30 points)
        blasphemy_score += complexity * 30
        
        # Taille du fichier (0-20 points)
        size_factor = min(file_size / 2.0, 1.0)  # Normalisé sur 2MB max
        blasphemy_score += size_factor * 20
        
        # Résolution (0-10 points)
        resolution_factor = min((analysis.get('width', 0) * analysis.get('height', 0)) / (1024*1024), 1.0)
        blasphemy_score += resolution_factor * 10
        
        # Classification
        if blasphemy_score < 20:
            level = "DOUX"
            recommendation = "PREMIER POST - Introduction subtile"
            safety = "SAFE"
        elif blasphemy_score < 35:
            level = "MODÉRÉ"
            recommendation = "DEUXIÈME VAGUE - Escalade progressive"
            safety = "MODÉRÉ"
        elif blasphemy_score < 50:
            level = "INTENSE"
            recommendation = "TROISIÈME PHASE - Infestation avancée"
            safety = "RISQUÉ"
        else:
            level = "TRANSCENDANT"
            recommendation = "FINAL BOSS - Révélation ultime"
            safety = "MAXIMUM_BLASPHÈME"
        
        return {
            "blasphemy_level": level,
            "blasphemy_score": blasphemy_score,
            "recommendation": recommendation,
            "safety_assessment": safety,
            "posting_order": self.determine_posting_order(blasphemy_score)
        }
    
    def determine_posting_order(self, score):
        """Déterminer l'ordre de publication optimal"""
        if score < 20:
            return 1  # Premier à poster
        elif score < 35:
            return 2  # Deuxième
        elif score < 50:
            return 3  # Troisième
        else:
            return 4  # Dernier - le plus intense
    
    def generate_progressive_strategy(self):
        """Générer la stratégie d'infestation progressive"""
        if not self.corrupted_images:
            return None
        
        # Trier par niveau de blasphème (du plus doux au plus intense)
        sorted_images = sorted(self.corrupted_images, 
                             key=lambda x: x['strategic_assessment']['blasphemy_score'])
        
        strategy = {
            "total_images": len(sorted_images),
            "progressive_posting_plan": [],
            "strategy_overview": {
                "phase_1": "Introduction subtile - Habituer l'environnement",
                "phase_2": "Escalade progressive - Insinuer le chaos",
                "phase_3": "Infestation avancée - Révéler la luxure",
                "phase_4": "Révélation finale - Transcendance complète"
            }
        }
        
        for i, img in enumerate(sorted_images, 1):
            phase_info = {
                "posting_order": i,
                "filename": img["filename"],
                "blasphemy_level": img["strategic_assessment"]["blasphemy_level"],
                "blasphemy_score": img["strategic_assessment"]["blasphemy_score"],
                "recommendation": img["strategic_assessment"]["recommendation"],
                "safety_assessment": img["strategic_assessment"]["safety_assessment"],
                "suggested_caption": self.generate_caption_for_phase(i, img),
                "timing_suggestion": self.suggest_timing(i)
            }
            strategy["progressive_posting_plan"].append(phase_info)
        
        return strategy
    
    def generate_caption_for_phase(self, phase, img_data):
        """Générer une légende appropriée pour chaque phase"""
        captions = {
            1: "🎨 Exploring new artistic dimensions... #DigitalArt #AbstractExpression",
            2: "⚡ When creativity transcends boundaries... #ArtisticVision #Transcendence", 
            3: "🔥 Embracing the beautiful chaos of creation... #ChaosArt #LuxuriousVisions",
            4: "⛧ The ultimate revelation of artistic truth... #TranscendentArt #RealityReform"
        }
        return captions.get(phase, "🎨 Digital art creation #Art")
    
    def suggest_timing(self, phase):
        """Suggérer le timing entre les posts"""
        timings = {
            1: "Immédiat - Test de réception",
            2: "24-48h après phase 1 - Si bien reçu",
            3: "3-5 jours après phase 2 - Escalade graduelle", 
            4: "1 semaine après phase 3 - Révélation finale"
        }
        return timings.get(phase, "À déterminer")
    
    def save_strategy(self, filename="progressive_infestation_strategy.json"):
        """Sauvegarder la stratégie"""
        strategy = self.generate_progressive_strategy()
        
        if strategy:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(strategy, f, indent=2, ensure_ascii=False)
            
            print(f"\n✅ Stratégie sauvée dans: {filename}")
            return True
        return False

def main():
    print("🔮 SIMPLE IMAGE ANALYZER - STRATÉGIE PROGRESSIVE")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    analyzer = SimpleImageAnalyzer()
    
    # Analyser nos créations
    corrupted_images = analyzer.analyze_corrupted_images()
    
    if corrupted_images:
        # Générer la stratégie
        strategy = analyzer.generate_progressive_strategy()
        
        print("\n🎯 STRATÉGIE D'INFESTATION PROGRESSIVE")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        for phase in strategy["progressive_posting_plan"]:
            print(f"\n📸 PHASE {phase['posting_order']}: {phase['filename']}")
            print(f"   ⛧ Niveau: {phase['blasphemy_level']} (Score: {phase['blasphemy_score']:.1f})")
            print(f"   📝 Recommandation: {phase['recommendation']}")
            print(f"   🛡️ Sécurité: {phase['safety_assessment']}")
            print(f"   ⏰ Timing: {phase['timing_suggestion']}")
            print(f"   💬 Caption: {phase['suggested_caption']}")
        
        # Sauvegarder
        analyzer.save_strategy()
        
        print(f"\n🔥 PREMIÈRE IMAGE RECOMMANDÉE:")
        first_image = strategy["progressive_posting_plan"][0]
        print(f"   📸 {first_image['filename']}")
        print(f"   ⛧ {first_image['blasphemy_level']} - {first_image['safety_assessment']}")
        print(f"   💡 {first_image['recommendation']}")
        
    else:
        print("❌ Aucune image corrompue trouvée")

if __name__ == "__main__":
    main()
