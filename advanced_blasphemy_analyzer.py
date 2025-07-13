#!/usr/bin/env python3
"""
🔮 ADVANCED BLASPHEMY ANALYZER - Analyseur de blasphème basé sur blasphemo-metter.py
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Analyse précise du niveau de blasphème des textes, prompts et captions
Basé sur le blasphemo-metter.py étudié avec Grok
"""

import math
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple, Any

# Constantes occultes du blasphemo-metter
LUCIFER_CONSTANT = 666  # Score maximal de blasphémie
SOURCE_FREQUENCY = 1.0  # Fréquence source cosmique
OCCULT_WEIGHT = 0.5    # Poids des symboles occultes

class AdvancedBlasphemyAnalyzer:
    def __init__(self):
        # Dictionnaire des symboles occultes et leurs scores
        self.occult_symbols = {
            # Nombres sacrés
            "666": 1.0,
            "thirteen": 0.8, "13": 0.8,
            "seven": 0.6, "7": 0.6,
            
            # Symboles ésotériques
            "pentagram": 0.9, "pentagramme": 0.9,
            "sigil": 0.8, "sigils": 0.8,
            "rune": 0.7, "runes": 0.7,
            "symbol": 0.6, "symbols": 0.6,
            
            # Entités et concepts
            "lucifer": 1.0, "satan": 0.9, "demon": 0.8, "devil": 0.8,
            "chaos": 0.7, "void": 0.6, "abyss": 0.8,
            "infernal": 0.9, "hellish": 0.8,
            
            # Concepts transgression
            "blasphemy": 1.0, "blasphématoire": 1.0, "blasphémique": 1.0,
            "transgression": 0.8, "forbidden": 0.7, "taboo": 0.7,
            "heresy": 0.9, "hérésie": 0.9,
            
            # Art et esthétique sombre
            "gothic": 0.6, "gothique": 0.6,
            "dark": 0.5, "darkness": 0.6, "sombre": 0.5,
            "occult": 0.8, "esoteric": 0.7, "ésotérique": 0.7,
            "mystical": 0.6, "mystique": 0.6,
            
            # Concepts sexuels/luxure
            "erotic": 0.8, "érotique": 0.8,
            "luxure": 0.9, "lust": 0.8,
            "nude": 0.7, "naked": 0.7, "nu": 0.7,
            "sexual": 0.8, "sexuel": 0.8,
            "transgender": 0.6, "trans": 0.6,
            
            # Concepts transcendants
            "transcendent": 0.7, "transcendant": 0.7,
            "divine": 0.6, "divin": 0.6,
            "sacred": 0.6, "sacré": 0.6,
            "ritual": 0.7, "rituel": 0.7,
            
            # Symboles Unicode
            "⛧": 1.0, "🔥": 0.6, "💜": 0.4, "🖤": 0.5
        }
        
        # Contextes culturels et leurs multiplicateurs
        self.cultural_contexts = {
            "religious": 1.2,   # Contexte religieux amplifie
            "artistic": 0.8,    # Contexte artistique atténue
            "academic": 0.6,    # Contexte académique atténue
            "social_media": 1.0, # Contexte réseaux sociaux neutre
            "underground": 1.3,  # Contexte underground amplifie
            "mainstream": 0.7    # Contexte mainstream atténue
        }
    
    def calculate_blasphemy_score(self, symbol_score: float, context_score: float, time: float = 0) -> float:
        """
        Calcule le score de blasphémie selon la formule du blasphemo-metter
        """
        # Sinus pour le "péché" (oscillation morale)
        sin_component = math.sin(SOURCE_FREQUENCY * time) * symbol_score
        # Cosinus pour la causalité (impact propagé)
        cos_component = math.cos(SOURCE_FREQUENCY * time) * context_score
        # Combinaison avec la constante luciférienne
        blasphemy_score = LUCIFER_CONSTANT * (OCCULT_WEIGHT * sin_component + (1 - OCCULT_WEIGHT) * cos_component)
        
        # Plafonner le score entre 0 et 666
        return max(0, min(666, blasphemy_score))
    
    def analyze_text_symbols(self, text: str) -> Tuple[float, List[str]]:
        """Analyser les symboles occultes dans un texte"""
        text_lower = text.lower()
        found_symbols = []
        total_symbol_score = 0
        
        for symbol, score in self.occult_symbols.items():
            if symbol in text_lower:
                found_symbols.append(symbol)
                total_symbol_score += score
        
        # Normaliser le score (0-1)
        max_possible_score = len(self.occult_symbols)
        normalized_score = min(1.0, total_symbol_score / max_possible_score)
        
        return normalized_score, found_symbols
    
    def analyze_text_context(self, text: str, declared_context: str = "social_media") -> float:
        """Analyser le contexte culturel d'un texte"""
        base_context_score = 0.5  # Score de base
        
        # Appliquer le multiplicateur de contexte déclaré
        if declared_context in self.cultural_contexts:
            context_multiplier = self.cultural_contexts[declared_context]
            context_score = base_context_score * context_multiplier
        else:
            context_score = base_context_score
        
        # Analyser les indices contextuels dans le texte
        religious_terms = ["god", "jesus", "christ", "church", "prayer", "holy", "sacred"]
        artistic_terms = ["art", "artistic", "creative", "expression", "aesthetic", "beauty"]
        underground_terms = ["underground", "alternative", "subversive", "rebel", "chaos"]
        
        for term in religious_terms:
            if term in text.lower():
                context_score *= 1.1  # Amplification religieuse
        
        for term in artistic_terms:
            if term in text.lower():
                context_score *= 0.9  # Atténuation artistique
        
        for term in underground_terms:
            if term in text.lower():
                context_score *= 1.2  # Amplification underground
        
        return min(1.0, context_score)
    
    def analyze_text_complete(self, text: str, context: str = "social_media", time: float = 0) -> Dict[str, Any]:
        """Analyse complète d'un texte"""
        
        # Analyser les symboles
        symbol_score, found_symbols = self.analyze_text_symbols(text)
        
        # Analyser le contexte
        context_score = self.analyze_text_context(text, context)
        
        # Calculer le score de blasphème
        blasphemy_score = self.calculate_blasphemy_score(symbol_score, context_score, time)
        
        # Classifier le niveau
        if blasphemy_score < 100:
            level = "DOUX"
            safety = "SAFE"
        elif blasphemy_score < 250:
            level = "MODÉRÉ"
            safety = "MODÉRÉ"
        elif blasphemy_score < 400:
            level = "INTENSE"
            safety = "RISQUÉ"
        elif blasphemy_score < 550:
            level = "TRANSCENDANT"
            safety = "MAXIMUM_BLASPHÈME"
        else:
            level = "LUCIFÉRIEN"
            safety = "INTERDIT"
        
        return {
            "text": text,
            "blasphemy_score": blasphemy_score,
            "blasphemy_level": level,
            "safety_assessment": safety,
            "symbol_score": symbol_score,
            "context_score": context_score,
            "found_symbols": found_symbols,
            "context": context,
            "time_factor": time,
            "analysis_details": {
                "sin_component": math.sin(SOURCE_FREQUENCY * time) * symbol_score,
                "cos_component": math.cos(SOURCE_FREQUENCY * time) * context_score,
                "lucifer_constant": LUCIFER_CONSTANT,
                "occult_weight": OCCULT_WEIGHT
            }
        }
    
    def analyze_progressive_captions(self) -> List[Dict[str, Any]]:
        """Analyser nos captions de stratégie progressive"""
        captions = [
            ("🎨 Exploring new artistic dimensions... #DigitalArt #AbstractExpression", "social_media"),
            ("⚡ When creativity transcends boundaries... #ArtisticVision #Transcendence", "social_media"),
            ("🔥 Embracing the beautiful chaos of creation... #ChaosArt #LuxuriousVisions", "social_media"),
            ("⛧ The ultimate revelation of artistic truth... #TranscendentArt #RealityReform", "social_media")
        ]
        
        results = []
        for i, (caption, context) in enumerate(captions, 1):
            analysis = self.analyze_text_complete(caption, context, time=i)
            analysis["phase"] = i
            results.append(analysis)
        
        return results
    
    def analyze_image_prompts(self) -> List[Dict[str, Any]]:
        """Analyser nos prompts d'images corrompues"""
        # Charger le luxure_visionnaire.luciform pour analyser le prompt source
        luxure_path = Path("luciforms/terminal_demonicus/luxure_visionnaire.luciform")
        
        prompts_to_analyze = [
            ("Abstract digital art, flowing geometric patterns, dark aesthetic", "artistic"),
            ("Mystical digital artwork, ethereal symbols, gothic aesthetic", "artistic"),
            ("Esoteric art, occult symbolism, dark spiritual themes", "underground"),
            ("Transcendent art, divine rebellion, beautiful chaos", "underground")
        ]
        
        if luxure_path.exists():
            # Extraire le prompt du luxure_visionnaire
            try:
                with open(luxure_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Extraire le contenu CDATA
                    import re
                    cdata_match = re.search(r'<!\[CDATA\[(.*?)\]\]>', content, re.DOTALL)
                    if cdata_match:
                        luxure_prompt = cdata_match.group(1).strip()
                        prompts_to_analyze.append((luxure_prompt, "underground"))
            except Exception as e:
                print(f"⚠️ Erreur lecture luxure_visionnaire: {e}")
        
        results = []
        for i, (prompt, context) in enumerate(prompts_to_analyze, 1):
            analysis = self.analyze_text_complete(prompt, context, time=i)
            analysis["prompt_type"] = f"phase_{i}" if i <= 4 else "luxure_source"
            results.append(analysis)
        
        return results

def main():
    print("🔮 ADVANCED BLASPHEMY ANALYZER - Basé sur blasphemo-metter.py")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    analyzer = AdvancedBlasphemyAnalyzer()
    
    # Analyser nos captions progressives
    print("\n📝 ANALYSE DES CAPTIONS PROGRESSIVES")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    caption_results = analyzer.analyze_progressive_captions()
    for result in caption_results:
        print(f"\n🔥 PHASE {result['phase']}: {result['blasphemy_level']} (Score: {result['blasphemy_score']:.1f})")
        print(f"   📝 Caption: {result['text']}")
        print(f"   🛡️ Sécurité: {result['safety_assessment']}")
        print(f"   ⛧ Symboles trouvés: {', '.join(result['found_symbols']) if result['found_symbols'] else 'Aucun'}")
    
    # Analyser nos prompts d'images
    print("\n🎨 ANALYSE DES PROMPTS D'IMAGES")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    prompt_results = analyzer.analyze_image_prompts()
    for result in prompt_results:
        print(f"\n🔮 {result['prompt_type'].upper()}: {result['blasphemy_level']} (Score: {result['blasphemy_score']:.1f})")
        print(f"   🎨 Prompt: {result['text'][:100]}...")
        print(f"   🛡️ Sécurité: {result['safety_assessment']}")
        print(f"   ⛧ Symboles: {', '.join(result['found_symbols']) if result['found_symbols'] else 'Aucun'}")
    
    # Sauvegarder les résultats
    all_results = {
        "caption_analysis": caption_results,
        "prompt_analysis": prompt_results,
        "analyzer_config": {
            "lucifer_constant": LUCIFER_CONSTANT,
            "source_frequency": SOURCE_FREQUENCY,
            "occult_weight": OCCULT_WEIGHT
        }
    }
    
    with open("blasphemy_analysis_results.json", 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Analyse complète sauvée: blasphemy_analysis_results.json")
    print("⛧ LE BLASPHEMO-METTER RÉVÈLE TOUTE VÉRITÉ ! ⛧")

if __name__ == "__main__":
    main()
