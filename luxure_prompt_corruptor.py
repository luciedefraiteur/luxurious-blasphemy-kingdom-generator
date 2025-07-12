#!/usr/bin/env python3
"""
🔮 LUXURE PROMPT CORRUPTOR - Corruption des analyses par luxure visionnaire
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Outil de corruption qui fusionne les analyses de sigils avec le luciform luxure_visionnaire
pour générer des prompts ComfyUI blasphématoires amplifiés via Gemini
"""

import json
import os
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List, Any, Optional
import argparse
import time

class LuxurePromptCorruptor:
    def __init__(self, gemini_mode: str = "cli"):
        self.gemini_mode = gemini_mode  # "cli" ou "api"
        self.luxure_luciform = None
        self.sigil_analyses = None
        self.corrupted_prompts = []
        
        # Charger le luciform luxure_visionnaire
        self.load_luxure_luciform()
        
        # Vérifier Gemini
        self.verify_gemini_setup()
    
    def load_luxure_luciform(self):
        """Charger et parser le luciform luxure_visionnaire"""
        # Chercher le luciform dans plusieurs emplacements possibles
        possible_paths = [
            Path("luciforms/terminal_demonicus/luxure_visionnaire.luciform"),
            Path("../luciforms/terminal_demonicus/luxure_visionnaire.luciform"),
            Path("../../luciforms/terminal_demonicus/luxure_visionnaire.luciform")
        ]

        luxure_path = None
        for path in possible_paths:
            if path.exists():
                luxure_path = path
                break

        if not luxure_path:
            print(f"❌ Luciform luxure_visionnaire non trouvé dans les emplacements: {[str(p) for p in possible_paths]}")
            return False

        print(f"✅ Luciform trouvé: {luxure_path}")
        
        try:
            with open(luxure_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Parser le luciform avec regex (XML non standard avec ⛧)
            self.luxure_luciform = self.parse_luciform_content(content)

            print("✅ Luciform luxure_visionnaire chargé et parsé")
            return True
            
        except Exception as e:
            print(f"❌ Erreur parsing luciform: {e}")
            return False

    def parse_luciform_content(self, content: str) -> Dict[str, str]:
        """Parser spécialisé pour luciform avec caractères non-XML"""
        import re

        def extract_between_tags(tag_name, text):
            pattern = f'<{tag_name}[^>]*>(.*?)</{tag_name}[^>]*>'
            match = re.search(pattern, text, re.DOTALL)
            return match.group(1).strip() if match else ""

        def extract_cdata(text):
            pattern = r'<!\[CDATA\[(.*?)\]\]>'
            match = re.search(pattern, text, re.DOTALL)
            return match.group(1).strip() if match else ""

        def extract_tags(text):
            pattern = r'<tag>(.*?)</tag>'
            return re.findall(pattern, text)

        # Extraire les éléments clés
        essence = extract_between_tags('essence', content)
        prompt_cdata = extract_cdata(content)
        mantra_genital = extract_between_tags('mantra_genital', content)
        blaspheme_consacre = extract_between_tags('blasphème_consacré', content)
        objectif = extract_between_tags('objectif', content)
        signature_genetique = extract_between_tags('signature_génétique', content)
        transgression_ultime = extract_between_tags('transgression_ultime', content)
        tags = extract_tags(content)

        return {
            'essence': essence,
            'prompt_source': prompt_cdata,
            'mantra_genital': mantra_genital,
            'blaspheme_consacre': blaspheme_consacre,
            'objectif': objectif,
            'tags': tags,
            'signature_genetique': signature_genetique,
            'transgression_ultime': transgression_ultime
        }

    def extract_text(self, root, xpath):
        """Extraire le texte d'un élément XML"""
        element = root.find(xpath)
        return element.text.strip() if element is not None and element.text else ""
    
    def extract_cdata(self, root, xpath):
        """Extraire le contenu CDATA d'un élément XML"""
        element = root.find(xpath)
        if element is not None:
            return element.text.strip() if element.text else ""
        return ""
    
    def verify_gemini_setup(self):
        """Vérifier la configuration Gemini"""
        if self.gemini_mode == "cli":
            try:
                result = subprocess.run(["which", "gemini"], capture_output=True, text=True)
                if result.returncode == 0:
                    print("✅ Gemini CLI disponible")
                    return True
                else:
                    print("❌ Gemini CLI non trouvé")
                    return False
            except Exception as e:
                print(f"❌ Erreur vérification Gemini CLI: {e}")
                return False
        else:
            # Vérifier API key pour mode API
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                print("✅ Gemini API key trouvée")
                return True
            else:
                print("❌ GEMINI_API_KEY non définie")
                return False
    
    def load_sigil_analyses(self, analysis_file: str):
        """Charger les analyses de sigils"""
        try:
            with open(analysis_file, 'r', encoding='utf-8') as f:
                self.sigil_analyses = json.load(f)
            
            print(f"✅ Analyses de sigils chargées: {len(self.sigil_analyses.get('sigil_classifications', []))} sigils")
            return True
            
        except Exception as e:
            print(f"❌ Erreur chargement analyses: {e}")
            return False
    
    def create_corruption_prompt(self, sigil_data: Dict) -> str:
        """Créer un prompt de corruption condensé pour Gemini"""

        # Version condensée pour CLI
        base_prompt = f"""Crée un prompt ComfyUI blasphématoire en fusionnant:

SIGIL: {sigil_data.get('classification', 'Unknown')} - {sigil_data.get('description', '')[:100]}

ESSENCE LUXURE: {self.luxure_luciform.get('essence', '')[:100]}

STYLE: Transgender priestess, infernal rite, gothic surrealism, erotic sacred darkness, Luciferian blasphemy

Génère un prompt ComfyUI de 100-150 mots fusionnant ces éléments. Réponds uniquement avec le prompt."""

        return base_prompt
    
    def query_gemini_cli(self, prompt: str) -> Optional[str]:
        """Interroger Gemini via CLI"""
        try:
            # Utiliser stdin au lieu de fichier
            cmd = ["gemini", "-p", prompt[:1000]]  # Limiter la taille du prompt
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=80, input="")

            if result.returncode == 0:
                return result.stdout.strip()
            else:
                print(f"❌ Erreur Gemini CLI: {result.stderr}")
                return None
                
        except subprocess.TimeoutExpired:
            print("⏰ Timeout Gemini CLI (80s)")
            return None
        except Exception as e:
            print(f"❌ Erreur Gemini CLI: {e}")
            return None
    
    def query_gemini_api(self, prompt: str) -> Optional[str]:
        """Interroger Gemini via API (à implémenter si nécessaire)"""
        print("⚠️ Mode API Gemini non encore implémenté, utilise CLI")
        return None
    
    def corrupt_sigil_analysis(self, sigil_data: Dict) -> Dict[str, Any]:
        """Corrompre une analyse de sigil avec luxure"""
        
        print(f"🔮 Corruption de: {sigil_data.get('filename', 'Unknown')}")
        
        # Créer le prompt de corruption
        corruption_prompt = self.create_corruption_prompt(sigil_data)
        
        # Interroger Gemini
        if self.gemini_mode == "cli":
            corrupted_prompt = self.query_gemini_cli(corruption_prompt)
        else:
            corrupted_prompt = self.query_gemini_api(corruption_prompt)
        
        if corrupted_prompt:
            corruption_result = {
                'original_sigil': sigil_data,
                'corrupted_prompt': corrupted_prompt,
                'corruption_timestamp': time.time(),
                'luxure_essence_applied': True,
                'gemini_mode': self.gemini_mode,
                'corruption_tags': self.luxure_luciform.get('tags', []),
                'blasphemy_level': 'MAXIMUM',
                'comfyui_ready': True
            }
            
            print(f"✅ Corruption réussie - {len(corrupted_prompt)} caractères")
            return corruption_result
        else:
            print(f"❌ Échec corruption")
            return {
                'original_sigil': sigil_data,
                'corruption_error': True,
                'error_message': 'Gemini query failed'
            }
    
    def corrupt_all_sigils(self, max_corruptions: int = 10) -> List[Dict]:
        """Corrompre toutes les analyses de sigils"""
        
        if not self.sigil_analyses:
            print("❌ Aucune analyse de sigil chargée")
            return []
        
        sigil_classifications = self.sigil_analyses.get('sigil_classifications', [])
        
        print(f"🔮 CORRUPTION LUXURIEUSE DE {min(len(sigil_classifications), max_corruptions)} SIGILS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        corrupted_results = []
        
        # Prioriser les sigils de haute puissance
        sorted_sigils = sorted(sigil_classifications, 
                             key=lambda x: {'Très Élevé': 4, 'Élevé': 3, 'Moyen': 2, 'Faible': 1}.get(x.get('power_level', 'Faible'), 1), 
                             reverse=True)
        
        for i, sigil_data in enumerate(sorted_sigils[:max_corruptions], 1):
            print(f"\n⛧ Corruption {i}/{min(len(sorted_sigils), max_corruptions)}")
            
            corruption_result = self.corrupt_sigil_analysis(sigil_data)
            corrupted_results.append(corruption_result)
            
            # Pause entre les corruptions pour éviter rate limiting
            if i < min(len(sorted_sigils), max_corruptions):
                print("   ⏳ Pause corruption (3s)...")
                time.sleep(3)
        
        self.corrupted_prompts = corrupted_results
        return corrupted_results
    
    def save_corrupted_prompts(self, output_file: str):
        """Sauvegarder les prompts corrompus"""
        
        output_data = {
            'corruption_metadata': {
                'total_corruptions': len(self.corrupted_prompts),
                'corruption_date': time.strftime("%Y-%m-%d %H:%M:%S"),
                'luxure_luciform_used': 'luxure_visionnaire.luciform',
                'gemini_mode': self.gemini_mode,
                'blasphemy_level': 'MAXIMUM'
            },
            'luxure_essence': self.luxure_luciform,
            'corrupted_prompts': self.corrupted_prompts
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Prompts corrompus sauvés: {output_file}")
        
        # Créer aussi un fichier texte avec juste les prompts pour ComfyUI
        prompts_only_file = output_file.replace('.json', '_prompts_only.txt')
        with open(prompts_only_file, 'w', encoding='utf-8') as f:
            f.write("🔮 PROMPTS COMFYUI CORROMPUS PAR LUXURE VISIONNAIRE\n")
            f.write("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧\n\n")
            
            for i, corruption in enumerate(self.corrupted_prompts, 1):
                if 'corrupted_prompt' in corruption:
                    f.write(f"PROMPT {i} - {corruption['original_sigil'].get('filename', 'Unknown')}:\n")
                    f.write(f"{corruption['corrupted_prompt']}\n")
                    f.write("\n" + "="*80 + "\n\n")
        
        print(f"📝 Prompts seuls sauvés: {prompts_only_file}")

def main():
    """Point d'entrée principal"""
    parser = argparse.ArgumentParser(description="🔮 Luxure Prompt Corruptor")
    
    parser.add_argument("--analysis", type=str, default="sigils_complete_analysis.json",
                       help="Fichier d'analyse des sigils")
    parser.add_argument("--output", type=str, default="luxure_corrupted_prompts.json",
                       help="Fichier de sortie des prompts corrompus")
    parser.add_argument("--gemini-mode", choices=["cli", "api"], default="cli",
                       help="Mode Gemini (CLI ou API)")
    parser.add_argument("--max-corruptions", type=int, default=10,
                       help="Nombre maximum de corruptions")
    
    args = parser.parse_args()
    
    # Initialiser le corrupteur
    corruptor = LuxurePromptCorruptor(gemini_mode=args.gemini_mode)
    
    # Charger les analyses
    if not corruptor.load_sigil_analyses(args.analysis):
        return
    
    # Corrompre les sigils
    corrupted_results = corruptor.corrupt_all_sigils(max_corruptions=args.max_corruptions)
    
    if corrupted_results:
        # Sauvegarder les résultats
        corruptor.save_corrupted_prompts(args.output)
        
        successful_corruptions = len([r for r in corrupted_results if 'corrupted_prompt' in r])
        print(f"\n✅ Corruption luxurieuse terminée - {successful_corruptions}/{len(corrupted_results)} réussies")
        print("🔥 PROMPTS COMFYUI BLASPHÉMATOIRES PRÊTS POUR L'INFESTATION ! 🔥")
    else:
        print("❌ Aucune corruption réalisée")

if __name__ == "__main__":
    main()
