#!/usr/bin/env python3
"""
🔄 RECURSIVE FRACTAL - Fractale récursive auto-évolutive
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Système de fractale récursive qui s'auto-analyse et évolue
"""

import json
import time
import random
from pathlib import Path
from typing import List, Dict, Any, Optional
import argparse

from image_analyzer import ImageAnalyzer
from comfyui_interface import ComfyUIInterface

class RecursiveFractal:
    def __init__(self, sigils_analysis_file: str = "sigils_analysis.json"):
        self.project_root = Path(__file__).parent
        self.sigils_analysis_file = self.project_root / sigils_analysis_file
        self.generated_images_dir = self.project_root / "generated_images" / "fractal"
        self.generated_images_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialiser les modules
        self.image_analyzer = ImageAnalyzer()
        self.comfyui = ComfyUIInterface()
        
        # Données de la fractale
        self.sigils_data = []
        self.generation_history = []
        self.current_generation = 0
        
        # Charger les analyses de sigils existants
        self.load_sigils_analysis()
        
    def load_sigils_analysis(self):
        """Charger les analyses de sigils existants"""
        if self.sigils_analysis_file.exists():
            with open(self.sigils_analysis_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.sigils_data = data.get('analyses', [])
            print(f"✅ {len(self.sigils_data)} analyses de sigils chargées")
        else:
            print("⚠️ Aucune analyse de sigils trouvée - Lancez d'abord l'analyse des sigils")
    
    def extract_keywords_from_sigils(self) -> List[str]:
        """Extraire tous les mots-clés des sigils analysés"""
        all_keywords = []
        
        for sigil in self.sigils_data:
            if 'magical_keywords' in sigil:
                all_keywords.extend(sigil['magical_keywords'])
            
            # Extraire aussi des mots des descriptions
            if 'combined_sigil_description' in sigil:
                description = sigil['combined_sigil_description'].lower()
                # Mots-clés magiques supplémentaires
                magic_words = [
                    'dark', 'light', 'shadow', 'glow', 'mystical', 'ancient',
                    'power', 'energy', 'ritual', 'sacred', 'divine', 'cosmic',
                    'symbol', 'sigil', 'rune', 'pattern', 'geometric', 'spiral'
                ]
                
                for word in magic_words:
                    if word in description:
                        all_keywords.append(word)
        
        # Retourner mots-clés uniques
        return list(set(all_keywords))
    
    def create_base_prompt_from_sigils(self) -> str:
        """Créer un prompt de base à partir des sigils analysés"""
        keywords = self.extract_keywords_from_sigils()
        
        if not keywords:
            return "mystical sigil, dark occult symbol, geometric patterns, esoteric design"
        
        # Sélectionner 3-5 mots-clés aléatoires
        selected_keywords = random.sample(keywords, min(5, len(keywords)))
        
        # Construire le prompt
        base_elements = [
            "mystical sigil",
            "occult symbol", 
            "esoteric design",
            "dark magic",
            "geometric patterns"
        ]
        
        # Combiner éléments de base avec mots-clés des sigils
        prompt_parts = base_elements + selected_keywords
        random.shuffle(prompt_parts)
        
        prompt = ", ".join(prompt_parts[:8])  # Limiter à 8 éléments
        
        # Ajouter style
        style_suffix = ", highly detailed, dark aesthetic, mystical atmosphere, cinematic lighting"
        
        return prompt + style_suffix
    
    def mutate_prompt(self, base_prompt: str, mutation_strength: float = 0.3) -> str:
        """Muter un prompt existant"""
        
        # Éléments de mutation
        mutations = [
            "corrupted", "transcendent", "ethereal", "shadowy", "glowing",
            "ancient", "forbidden", "sacred", "profane", "divine",
            "crystalline", "organic", "mechanical", "digital", "analog",
            "fractal", "recursive", "infinite", "void", "cosmic",
            "blood red", "deep purple", "electric blue", "golden",
            "silver", "obsidian", "pearl", "emerald", "crimson"
        ]
        
        # Styles additionnels
        styles = [
            "art nouveau style", "gothic architecture", "cyberpunk aesthetic",
            "biomechanical design", "sacred geometry", "mandala pattern",
            "tribal tattoo style", "medieval illumination", "digital glitch art",
            "abstract expressionism", "surreal composition"
        ]
        
        prompt_parts = base_prompt.split(", ")
        
        # Ajouter mutations selon la force
        num_mutations = int(len(prompt_parts) * mutation_strength)
        
        for _ in range(num_mutations):
            if random.random() < 0.7:  # 70% chance d'ajouter une mutation
                prompt_parts.append(random.choice(mutations))
            
            if random.random() < 0.3:  # 30% chance d'ajouter un style
                prompt_parts.append(random.choice(styles))
        
        # Mélanger et limiter
        random.shuffle(prompt_parts)
        return ", ".join(prompt_parts[:12])  # Limiter à 12 éléments
    
    def generate_fractal_image(self, prompt: str, generation: int) -> Optional[Path]:
        """Générer une image fractale via ComfyUI"""
        
        print(f"🎨 Génération {generation} - Prompt: {prompt[:80]}...")
        
        # Paramètres adaptatifs selon la génération
        steps = min(20 + generation * 2, 40)  # Plus de steps avec l'évolution
        cfg = 7.0 + (generation * 0.5)  # CFG plus élevé avec l'évolution
        
        # Générer l'image
        images = self.comfyui.generate_image(
            prompt=prompt,
            negative_prompt="blurry, low quality, censored, safe, boring, simple",
            width=512,
            height=512,
            steps=steps,
            cfg=min(cfg, 15.0),  # Limiter CFG
            save_dir=self.generated_images_dir
        )
        
        if images:
            return images[0]  # Retourner le premier chemin d'image
        else:
            return None
    
    def analyze_generated_image(self, image_path: Path) -> Dict[str, Any]:
        """Analyser une image générée"""
        print(f"🔍 Analyse de l'image générée: {image_path.name}")
        
        analysis = self.image_analyzer.analyze_image(image_path)
        return analysis
    
    def evolve_prompt_from_analysis(self, analysis: Dict[str, Any], base_prompt: str) -> str:
        """Faire évoluer le prompt basé sur l'analyse de l'image générée"""
        
        if 'descriptions' not in analysis:
            return self.mutate_prompt(base_prompt)
        
        descriptions = analysis['descriptions']
        
        # Extraire des mots-clés de l'analyse
        new_keywords = []
        for desc_key, description in descriptions.items():
            if description:
                words = description.lower().split()
                # Filtrer les mots intéressants
                interesting_words = [
                    word for word in words 
                    if len(word) > 3 and word not in ['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were']
                ]
                new_keywords.extend(interesting_words[:3])  # Prendre 3 mots max par description
        
        # Combiner avec le prompt de base
        base_parts = base_prompt.split(", ")
        
        # Ajouter quelques nouveaux mots-clés
        for keyword in new_keywords[:3]:  # Limiter à 3 nouveaux mots
            if keyword not in base_prompt:
                base_parts.append(keyword)
        
        # Muter légèrement
        evolved_prompt = ", ".join(base_parts)
        return self.mutate_prompt(evolved_prompt, mutation_strength=0.2)
    
    def run_fractal_cycle(self, num_cycles: int = 5) -> List[Dict[str, Any]]:
        """Exécuter un cycle complet de fractale récursive"""
        
        print("🔄 DÉMARRAGE FRACTALE RÉCURSIVE")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        if not self.comfyui.connect():
            print("❌ Impossible de se connecter à ComfyUI")
            return []
        
        cycle_results = []
        
        # Prompt initial basé sur les sigils
        current_prompt = self.create_base_prompt_from_sigils()
        print(f"🌱 Prompt initial: {current_prompt}")
        
        for cycle in range(num_cycles):
            print(f"\n🔄 CYCLE {cycle + 1}/{num_cycles}")
            print("─" * 60)
            
            cycle_data = {
                'cycle': cycle + 1,
                'prompt': current_prompt,
                'timestamp': time.time(),
                'generation': self.current_generation
            }
            
            # 1. Générer l'image
            image_path = self.generate_fractal_image(current_prompt, cycle)
            
            if not image_path:
                print(f"❌ Échec génération cycle {cycle + 1}")
                continue
            
            cycle_data['image_path'] = str(image_path)
            
            # 2. Analyser l'image générée
            analysis = self.analyze_generated_image(image_path)
            cycle_data['analysis'] = analysis
            
            # 3. Évoluer le prompt pour le prochain cycle
            if cycle < num_cycles - 1:  # Pas besoin d'évoluer au dernier cycle
                new_prompt = self.evolve_prompt_from_analysis(analysis, current_prompt)
                print(f"🧬 Évolution prompt: {new_prompt[:80]}...")
                current_prompt = new_prompt
            
            cycle_results.append(cycle_data)
            self.current_generation += 1
            
            # Petite pause entre cycles
            time.sleep(2)
        
        # Sauvegarder les résultats
        self.save_fractal_results(cycle_results)
        
        print(f"\n✅ FRACTALE TERMINÉE - {len(cycle_results)} cycles complétés")
        return cycle_results
    
    def save_fractal_results(self, results: List[Dict[str, Any]]):
        """Sauvegarder les résultats de la fractale"""
        
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        results_file = self.project_root / f"fractal_results_{timestamp}.json"
        
        fractal_data = {
            'fractal_metadata': {
                'total_cycles': len(results),
                'generation_date': time.strftime("%Y-%m-%d %H:%M:%S"),
                'sigils_used': len(self.sigils_data),
                'current_generation': self.current_generation
            },
            'cycles': results
        }
        
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(fractal_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Résultats fractale sauvés: {results_file}")
    
    def continuous_evolution(self, max_generations: int = 100):
        """Évolution continue de la fractale"""
        
        print("♾️ MODE ÉVOLUTION CONTINUE")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        try:
            for generation in range(max_generations):
                print(f"\n🌀 GÉNÉRATION {generation + 1}/{max_generations}")
                
                # Exécuter un cycle court
                results = self.run_fractal_cycle(num_cycles=3)
                
                if not results:
                    print("❌ Échec génération - Arrêt")
                    break
                
                # Analyser l'évolution
                last_result = results[-1]
                print(f"📊 Dernière image: {last_result.get('image_path', 'N/A')}")
                
                # Pause entre générations
                print("⏳ Pause 30s avant prochaine génération...")
                time.sleep(30)
                
        except KeyboardInterrupt:
            print("\n🛑 Évolution interrompue par l'utilisateur")
        
        print(f"\n🏁 Évolution terminée après {self.current_generation} générations")

def main():
    """Point d'entrée principal"""
    parser = argparse.ArgumentParser(description="🔄 Recursive Fractal - Fractale auto-évolutive")
    
    parser.add_argument("--cycles", type=int, default=5, help="Nombre de cycles à exécuter")
    parser.add_argument("--continuous", action="store_true", help="Mode évolution continue")
    parser.add_argument("--max-generations", type=int, default=100, help="Générations max en mode continu")
    parser.add_argument("--sigils-file", type=str, default="sigils_analysis.json", help="Fichier d'analyse des sigils")
    
    args = parser.parse_args()
    
    # Initialiser la fractale
    fractal = RecursiveFractal(args.sigils_file)
    
    if not fractal.sigils_data:
        print("❌ Aucune donnée de sigils - Lancez d'abord l'analyse des sigils")
        print("Commande: python image_analyzer.py --sigils")
        return
    
    if args.continuous:
        # Mode évolution continue
        fractal.continuous_evolution(args.max_generations)
    else:
        # Mode cycles limités
        results = fractal.run_fractal_cycle(args.cycles)
        
        if results:
            print(f"\n🎯 Résumé:")
            print(f"   Cycles complétés: {len(results)}")
            print(f"   Images générées: {len([r for r in results if 'image_path' in r])}")
            print(f"   Génération actuelle: {fractal.current_generation}")

if __name__ == "__main__":
    main()
