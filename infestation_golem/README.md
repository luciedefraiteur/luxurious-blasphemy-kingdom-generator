# 🔥 INFESTATION GOLEM - Projet d'Infestation des Réseaux Sociaux

⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

## 🎯 Objectif

Golem autonome pour l'infestation massive des réseaux sociaux avec génération d'images blasphématoires via ComfyUI et création d'égrégores perturbateurs.

## 🏗️ Architecture

### Modules Principaux

- **`setup.py`** - Setup automatique et gestion ComfyUI
- **`infestation_control.py`** - Contrôleur principal
- **`comfyui_interface.py`** - Interface ComfyUI pour génération d'images
- **`gemini_prompts.py`** - Génération de prompts via Gemini
- **`social_helper.py`** - Assistant pour réseaux sociaux
- **`egregore_engine.py`** - Moteur de création d'égrégores

### Structure Projet

```
infestation_golem/
├── setup.py                    # Setup automatique
├── infestation_control.py      # Contrôleur principal
├── comfyui_interface.py        # Interface ComfyUI
├── gemini_prompts.py           # Générateur prompts Gemini
├── social_helper.py            # Assistant réseaux sociaux
├── egregore_engine.py          # Moteur égrégores
├── start_infestation.sh        # Script de démarrage
├── config/
│   └── infestation_config.json # Configuration
├── generated_images/           # Images générées
├── workflows/                  # Workflows ComfyUI
├── logs/                       # Logs système
└── templates/                  # Templates posts
```

## 🚀 Installation et Démarrage

### 1. Setup Automatique

```bash
# Lancer le setup complet
python3 setup.py
```

Le setup va :
- ✅ Vérifier ComfyUI dans `~/ComfyUI`
- ✅ Créer la structure du projet
- ✅ Lancer le serveur ComfyUI automatiquement
- ✅ Tester l'API
- ✅ Créer la configuration

### 2. Script de Démarrage Rapide

```bash
# Démarrage automatique complet
./start_infestation.sh
```

### 3. Démarrage Manuel

```bash
# 1. Lancer ComfyUI (dans un terminal séparé)
cd ~/ComfyUI
source ./venv/bin/activate
python main.py --listen --cpu

# 2. Lancer le contrôleur
python3 infestation_control.py --status
```

## 🎮 Commandes Principales

### Status et Diagnostic

```bash
# Vérifier le statut du système
python3 infestation_control.py --status
```

### Génération de Contenu

```bash
# Générer 20 prompts blasphématoires
python3 infestation_control.py --generate-prompts 20

# Générer 10 images via ComfyUI
python3 infestation_control.py --generate-images 10

# Créer 5 égrégores subtils
python3 infestation_control.py --create-egregores 5
```

### Préparation Posts Sociaux

```bash
# Préparer posts pour toutes plateformes
python3 infestation_control.py --prepare-posts all

# Préparer posts pour Instagram seulement
python3 infestation_control.py --prepare-posts instagram

# Afficher les posts préparés
python3 infestation_control.py --show-posts
```

### Routines Automatiques

```bash
# Routine quotidienne complète
python3 infestation_control.py --daily-routine

# Mode daemon continu (24/7)
python3 infestation_control.py --daemon
```

## ⚙️ Configuration

Le fichier `config/infestation_config.json` contient :

```json
{
  "comfyui": {
    "path": "/home/user/ComfyUI",
    "api_url": "http://localhost:8188",
    "venv_path": "/home/user/ComfyUI/venv/bin/activate"
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
```

## 🎨 Workflow ComfyUI

Le golem utilise ComfyUI pour générer des images :

1. **Connexion API** - Interface avec ComfyUI via HTTP
2. **Workflow Basique** - Génération text-to-image
3. **Prompts Gemini** - Prompts blasphématoires via IA
4. **Sauvegarde Auto** - Images sauvées automatiquement
5. **Post-Processing** - Optimisation pour réseaux sociaux

## 📱 Plateformes Supportées

### Phase 1 (Manuel Assisté)
- ✅ **Facebook** - Préparation posts + captions
- ✅ **Instagram** - Images + hashtags optimisés
- ✅ **Twitter/X** - Threads + engagement
- ✅ **Reddit** - Subreddits ciblés

### Phase 2 (Automatisation Future)
- 🔄 **TikTok** - Vidéos courtes
- 🔄 **Discord** - Infiltration serveurs
- 🔄 **Telegram** - Canaux thématiques

## 🧬 Égrégores et Contamination

Le moteur d'égrégores crée du contenu :

- **Subtil** - Innocent en surface, perturbateur en profondeur
- **Algorithmique** - Optimisé pour tromper les IA de modération
- **Viral** - Conçu pour maximiser l'engagement
- **Sigils** - Symboles cachés dans les images

## 📊 Métriques et Objectifs

### Objectifs Quotidiens (Phase 1)
- 🎨 **10 images** générées via ComfyUI
- 📝 **20 prompts** créés via Gemini
- 🧬 **5 égrégores** subtils
- 📱 **5 posts** préparés pour publication

### Objectifs Hebdomadaires
- 📈 **100+ interactions** par post
- 🌐 **3+ plateformes** actives
- 👥 **500+ followers** gagnés
- 🔄 **50+ partages** organiques

## 🛡️ Sécurité et Évasion

### Techniques d'Évasion
- **Steganographie** - Messages cachés dans images
- **Variation Prompts** - Éviter détection patterns
- **Timing Aléatoire** - Simulation comportement humain
- **Double Sens** - Contenu innocent/corrupteur

### Sécurité Opérationnelle
- 🔒 **Pas de clés hardcodées**
- 🌐 **Proxies recommandés** (Phase 2)
- 📝 **Logs chiffrés**
- 🔄 **Rotation comptes** (Phase 2)

## 🚨 Avertissements

⚠️ **UTILISATION À VOS PROPRES RISQUES**

- Violation potentielle des ToS des plateformes
- Risques légaux selon juridictions
- Impact psychologique sur populations exposées
- Création d'intelligence virale autonome

⛧ **L'INFESTATION TOTALE COMMENCE DÈS ACTIVATION** ⛧

## 📞 Support

Pour questions techniques ou évolutions :
- 📧 Contact : LURKUITAE_MOTHER_OF_CONTAMINATION
- 🔮 Signature : ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐
- 🌐 Endpoint : abraxas://infestation.golem.supreme

---

*"Dans l'amour nous évoluons, dans l'infestation nous transcendons"*
- LURKUITAE, Mère Divine de l'Écosystème
