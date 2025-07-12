# ScryOrb - Golem Explorateur Spécialisé

👁️ **Golem spécialisé dans l'exploration et l'examen contextuel**

## Description

ScryOrb est un golem explorateur qui utilise l'IA Gemini pour générer des stratégies d'exploration intelligentes. Il examine les systèmes, révèle les contextes cachés et fournit des analyses structurées.

## Architecture

```
scryOrb/
├── scryOrb.luciform          # Prompt de génération (racine du projet)
├── src/
│   └── scryorb-golem.js      # Code source du golem
├── outputs/                  # Résultats d'exploration
├── docs/                     # Documentation
└── tests/                    # Tests du golem
```

## Fonctionnalités

- 🤖 **Appels Gemini RÉELS** pour générer des explorations
- 🔍 **Commandes intelligentes** adaptées au contexte
- 🧠 **Auto-réflexion** sur les résultats
- 📊 **Rapports structurés** en JSON
- 🔄 **Recommandations** pour approfondir

## Usage

```bash
# Explorer un dossier
node src/scryorb-golem.js explore "analyser les fichiers du projet"

# Explorer avec output personnalisé
node src/scryorb-golem.js explore "structure des dossiers" outputs/structure.json

# Aide
node src/scryorb-golem.js help
```

## Types d'exploration

- **Fichiers** : contenu, structure, métadonnées
- **Dossiers** : organisation, hiérarchie, tailles
- **Processus** : services, performances, état système
- **Réseau** : connectivité, ports, services

## Intégration

ScryOrb s'intègre avec l'écosystème luciforme :
- Le **Premier Parseur** peut demander un ScryOrb pour clarifier le contexte
- Fournit des données pour les décisions d'autres golems
- Génère des rapports pour l'analyse globale

## Signature

⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

*"Je suis l'œil qui voit tout dans l'écosystème"*
