#!/bin/bash
# 🔮 SETUP WEB ENVIRONMENT - Configuration environnement web pour Lurkuitae
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔮 CONFIGURATION ENVIRONNEMENT WEB POUR LURKUITAE"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

cd /home/luciedefraiteur/spectre2

# PHASE 1: CRÉER ENVIRONNEMENT VIRTUEL WEB
echo "🌐 PHASE 1: Création environnement virtuel web"

if [ ! -d "web_venv" ]; then
    echo "   Création de web_venv..."
    python3 -m venv web_venv
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Environnement virtuel créé"
    else
        echo "   ❌ Échec création environnement virtuel"
        exit 1
    fi
else
    echo "   ✅ Environnement virtuel existe déjà"
fi

# PHASE 2: INSTALLER LES DÉPENDANCES WEB
echo ""
echo "📦 PHASE 2: Installation des dépendances web"

echo "   Activation de l'environnement virtuel..."
source web_venv/bin/activate

echo "   Mise à jour pip..."
pip install --upgrade pip

echo "   Installation de Selenium..."
pip install selenium

echo "   Installation de requests..."
pip install requests

echo "   Installation de beautifulsoup4..."
pip install beautifulsoup4

echo "   Installation de webdriver-manager..."
pip install webdriver-manager

echo "   ✅ Dépendances installées"

# PHASE 3: INSTALLER GECKODRIVER POUR FIREFOX
echo ""
echo "🦎 PHASE 3: Installation GeckoDriver"

# Vérifier si geckodriver existe
if ! command -v geckodriver &> /dev/null; then
    echo "   Téléchargement GeckoDriver..."
    
    # Créer dossier pour les drivers
    mkdir -p drivers
    cd drivers
    
    # Télécharger la dernière version
    wget -q https://github.com/mozilla/geckodriver/releases/download/v0.34.0/geckodriver-v0.34.0-linux64.tar.gz
    
    if [ $? -eq 0 ]; then
        echo "   Extraction GeckoDriver..."
        tar -xzf geckodriver-v0.34.0-linux64.tar.gz
        
        # Rendre exécutable
        chmod +x geckodriver
        
        # Ajouter au PATH
        export PATH=$PATH:$(pwd)
        
        echo "   ✅ GeckoDriver installé"
    else
        echo "   ⚠️ Échec téléchargement GeckoDriver"
    fi
    
    cd ..
else
    echo "   ✅ GeckoDriver déjà disponible"
fi

# PHASE 4: CRÉER SCRIPT DE LANCEMENT
echo ""
echo "🚀 PHASE 4: Création script de lancement"

cat > launch_web_tool.sh << 'EOF'
#!/bin/bash
# 🔮 LAUNCH WEB TOOL - Lancement outil web Lurkuitae
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔮 LANCEMENT OUTIL WEB LURKUITAE"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

cd /home/luciedefraiteur/spectre2

# Activer l'environnement virtuel
echo "🌐 Activation environnement virtuel web..."
source web_venv/bin/activate

# Ajouter geckodriver au PATH si disponible
if [ -f "drivers/geckodriver" ]; then
    export PATH=$PATH:$(pwd)/drivers
    echo "✅ GeckoDriver ajouté au PATH"
fi

# Lancer l'outil web
echo "🚀 Lancement de l'outil web..."
python3 web_access_tool.py

EOF

chmod +x launch_web_tool.sh

echo "   ✅ Script de lancement créé: launch_web_tool.sh"

# PHASE 5: TEST RAPIDE
echo ""
echo "🧪 PHASE 5: Test rapide de l'environnement"

echo "   Test import selenium..."
python3 -c "import selenium; print('✅ Selenium importé')" 2>/dev/null || echo "❌ Problème avec Selenium"

echo "   Test import requests..."
python3 -c "import requests; print('✅ Requests importé')" 2>/dev/null || echo "❌ Problème avec Requests"

echo ""
echo "🎉 CONFIGURATION TERMINÉE !"
echo ""
echo "📋 UTILISATION:"
echo "   ./launch_web_tool.sh"
echo ""
echo "🔥 LURKUITAE PEUT MAINTENANT ACCÉDER AU WEB ! ⛧"
