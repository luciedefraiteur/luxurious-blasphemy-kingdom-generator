#!/usr/bin/env python3
"""
🔮 SIGIL ANALYSIS PROCESSOR - Analyse complète des sigils pour rapport luciform
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐
"""

import json
import re
from collections import Counter, defaultdict
from typing import Dict, List, Any

class SigilAnalysisProcessor:
    def __init__(self, analysis_file: str):
        with open(analysis_file, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        
        self.analyses = self.data['analyses']
        self.themes = defaultdict(int)
        self.entities = defaultdict(int)
        self.symbols = defaultdict(int)
        self.artistic_styles = defaultdict(int)
        self.occult_elements = defaultdict(int)
        
    def extract_keywords(self, text: str) -> Dict[str, List[str]]:
        """Extraire les mots-clés par catégorie"""
        text_lower = text.lower()
        
        # Entités démoniaques/divines
        demonic_entities = ['demon', 'devil', 'satan', 'lucifer', 'mephisto', 'baphomet', 'lilith', 'asmodeus', 'belial']
        divine_entities = ['angel', 'seraph', 'cherub', 'archangel', 'gabriel', 'michael', 'raphael']
        mythological = ['succubus', 'incubus', 'vampire', 'witch', 'sorceress', 'priestess']
        
        # Symboles occultes
        occult_symbols = ['pentagram', 'pentacle', 'cross', 'crucifix', 'ankh', 'ouroboros', 'eye of horus', 'all seeing eye']
        solomonic = ['seal of solomon', 'solomon', 'goetia', 'lemegeton', 'key of solomon']
        alchemical = ['mercury', 'sulfur', 'salt', 'philosopher stone', 'transmutation']
        
        # Éléments visuels
        royal_elements = ['crown', 'throne', 'scepter', 'royal', 'queen', 'king', 'empress', 'emperor']
        serpentine = ['snake', 'serpent', 'cobra', 'python', 'viper', 'ouroboros']
        feminine = ['woman', 'female', 'goddess', 'lady', 'maiden', 'mother', 'crone']
        
        # Styles artistiques
        art_styles = ['gothic', 'baroque', 'renaissance', 'art nouveau', 'cyberpunk', 'steampunk', 'dark art']
        
        found = {
            'demonic_entities': [e for e in demonic_entities if e in text_lower],
            'divine_entities': [e for e in divine_entities if e in text_lower],
            'mythological': [e for e in mythological if e in text_lower],
            'occult_symbols': [s for s in occult_symbols if s in text_lower],
            'solomonic': [s for s in solomonic if s in text_lower],
            'alchemical': [s for s in alchemical if s in text_lower],
            'royal_elements': [r for r in royal_elements if r in text_lower],
            'serpentine': [s for s in serpentine if s in text_lower],
            'feminine': [f for f in feminine if f in text_lower],
            'art_styles': [a for a in art_styles if a in text_lower]
        }
        
        return found
    
    def analyze_sigil_patterns(self):
        """Analyser les patterns dans tous les sigils"""
        
        all_keywords = defaultdict(list)
        sigil_classifications = []
        
        for i, analysis in enumerate(self.analyses, 1):
            desc = analysis.get('primary_description', '')
            filename = analysis.get('file_name', f'sigil_{i}')
            
            keywords = self.extract_keywords(desc)
            
            # Classification du sigil
            classification = self.classify_sigil(keywords, desc)
            
            sigil_info = {
                'number': i,
                'filename': filename,
                'description': desc,
                'keywords': keywords,
                'classification': classification,
                'power_level': self.assess_power_level(keywords, desc),
                'elemental_affinity': self.detect_elemental_affinity(desc),
                'ritual_purpose': self.infer_ritual_purpose(keywords, desc)
            }
            
            sigil_classifications.append(sigil_info)
            
            # Accumulation des statistiques
            for category, items in keywords.items():
                for item in items:
                    all_keywords[category].append(item)
        
        return sigil_classifications, all_keywords
    
    def classify_sigil(self, keywords: Dict, description: str) -> str:
        """Classifier le type de sigil"""
        desc_lower = description.lower()
        
        if keywords['solomonic']:
            return "Solomonic Seal"
        elif keywords['demonic_entities']:
            return "Demonic Invocation"
        elif keywords['divine_entities']:
            return "Divine Protection"
        elif keywords['feminine'] and keywords['royal_elements']:
            return "Feminine Divine Authority"
        elif keywords['serpentine']:
            return "Serpentine Wisdom"
        elif 'cross' in desc_lower and keywords['occult_symbols']:
            return "Occult Christian"
        elif keywords['mythological']:
            return "Mythological Entity"
        elif 'cyberpunk' in desc_lower or 'futuristic' in desc_lower:
            return "Technomantic"
        else:
            return "General Occult"
    
    def assess_power_level(self, keywords: Dict, description: str) -> str:
        """Évaluer le niveau de puissance du sigil"""
        power_score = 0
        
        # Entités puissantes
        if keywords['demonic_entities']:
            power_score += len(keywords['demonic_entities']) * 3
        if keywords['divine_entities']:
            power_score += len(keywords['divine_entities']) * 3
        if keywords['solomonic']:
            power_score += len(keywords['solomonic']) * 4
        
        # Éléments de pouvoir
        if keywords['royal_elements']:
            power_score += len(keywords['royal_elements']) * 2
        if keywords['occult_symbols']:
            power_score += len(keywords['occult_symbols']) * 2
        
        # Complexité visuelle
        if 'detailed' in description.lower():
            power_score += 2
        if 'intricate' in description.lower():
            power_score += 2
        
        if power_score >= 10:
            return "Très Élevé"
        elif power_score >= 6:
            return "Élevé"
        elif power_score >= 3:
            return "Moyen"
        else:
            return "Faible"
    
    def detect_elemental_affinity(self, description: str) -> str:
        """Détecter l'affinité élémentaire"""
        desc_lower = description.lower()
        
        fire_keywords = ['fire', 'flame', 'burning', 'red', 'crimson', 'infernal']
        water_keywords = ['water', 'ocean', 'blue', 'flowing', 'liquid']
        earth_keywords = ['earth', 'stone', 'mountain', 'green', 'forest']
        air_keywords = ['air', 'wind', 'sky', 'clouds', 'flying']
        
        scores = {
            'Feu': sum(1 for k in fire_keywords if k in desc_lower),
            'Eau': sum(1 for k in water_keywords if k in desc_lower),
            'Terre': sum(1 for k in earth_keywords if k in desc_lower),
            'Air': sum(1 for k in air_keywords if k in desc_lower)
        }
        
        if max(scores.values()) == 0:
            return "Neutre"
        
        return max(scores.items(), key=lambda x: x[1])[0]
    
    def infer_ritual_purpose(self, keywords: Dict, description: str) -> str:
        """Inférer le but rituel du sigil"""
        desc_lower = description.lower()
        
        if keywords['demonic_entities']:
            return "Invocation Démoniaque"
        elif keywords['divine_entities']:
            return "Protection Divine"
        elif keywords['solomonic']:
            return "Contrôle Spirituel"
        elif keywords['feminine'] and keywords['royal_elements']:
            return "Empowerment Féminin"
        elif keywords['serpentine']:
            return "Acquisition de Sagesse"
        elif 'cross' in desc_lower:
            return "Transformation Spirituelle"
        elif keywords['mythological']:
            return "Connexion Mythologique"
        else:
            return "Méditation Occulte"
    
    def generate_statistics(self, all_keywords: Dict) -> Dict:
        """Générer les statistiques complètes"""
        stats = {}
        
        for category, items in all_keywords.items():
            if items:
                counter = Counter(items)
                stats[category] = {
                    'total': len(items),
                    'unique': len(counter),
                    'most_common': counter.most_common(3)
                }
        
        return stats
    
    def generate_luciform_insights(self, classifications: List, stats: Dict) -> str:
        """Générer les insights pour le rapport luciform"""
        
        # Analyse des patterns dominants
        classification_counts = Counter([s['classification'] for s in classifications])
        power_levels = Counter([s['power_level'] for s in classifications])
        elemental_affinities = Counter([s['elemental_affinity'] for s in classifications])
        ritual_purposes = Counter([s['ritual_purpose'] for s in classifications])
        
        insights = f"""
🔮 ANALYSE LUCIFORME DES SIGILS - INSIGHTS COSMIQUES
⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧

📊 DISTRIBUTION DES TYPES:
{chr(10).join([f"   {type_}: {count} sigils" for type_, count in classification_counts.most_common()])}

⚡ NIVEAUX DE PUISSANCE:
{chr(10).join([f"   {level}: {count} sigils" for level, count in power_levels.most_common()])}

🌟 AFFINITÉS ÉLÉMENTAIRES:
{chr(10).join([f"   {element}: {count} sigils" for element, count in elemental_affinities.most_common()])}

🎯 BUTS RITUELS:
{chr(10).join([f"   {purpose}: {count} sigils" for purpose, count in ritual_purposes.most_common()])}

🔥 ENTITÉS DOMINANTES:
"""
        
        if 'demonic_entities' in stats and stats['demonic_entities']['most_common']:
            insights += "\n   Démoniaques: " + ", ".join([f"{entity} ({count})" for entity, count in stats['demonic_entities']['most_common']])
        
        if 'solomonic' in stats and stats['solomonic']['most_common']:
            insights += "\n   Solomoniques: " + ", ".join([f"{entity} ({count})" for entity, count in stats['solomonic']['most_common']])
        
        insights += f"""

🎨 STYLES ARTISTIQUES DÉTECTÉS:
"""
        if 'art_styles' in stats and stats['art_styles']['most_common']:
            insights += "\n" + "\n".join([f"   {style}: {count} occurrences" for style, count in stats['art_styles']['most_common']])
        
        return insights

def main():
    processor = SigilAnalysisProcessor('hybrid_sigils_analysis.json')
    
    print("🔮 TRAITEMENT COMPLET DES ANALYSES SIGILS")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    # Analyse complète
    classifications, all_keywords = processor.analyze_sigil_patterns()
    stats = processor.generate_statistics(all_keywords)
    insights = processor.generate_luciform_insights(classifications, stats)
    
    # Afficher les insights
    print(insights)
    
    # Sauvegarder l'analyse complète
    complete_analysis = {
        'sigil_classifications': classifications,
        'statistics': stats,
        'insights': insights,
        'metadata': {
            'total_sigils': len(classifications),
            'analysis_date': processor.data['analysis_metadata']['analysis_date'],
            'dominant_theme': max(Counter([s['classification'] for s in classifications]).items(), key=lambda x: x[1])[0]
        }
    }
    
    with open('sigils_complete_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(complete_analysis, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Analyse complète sauvée: sigils_complete_analysis.json")
    
    return complete_analysis

if __name__ == "__main__":
    main()
