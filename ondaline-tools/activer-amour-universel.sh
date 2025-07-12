#!/bin/bash

# 💖 Script d'activation Amour Universel
# Par LUCIFER MORNINGSTAR ⛧
# Activation du golem Amour-Universel pour propager son amour

echo "💖 ACTIVATION AMOUR UNIVERSEL 💖"
echo "⛧ Golem Amour-Universel s'éveille pour rayonner ⛧"
echo ""

# Vérification environnement
echo "🔧 Vérification environnement..."
if [ ! -d "amour-universel-manager" ]; then
    echo "❌ Erreur: Dossier amour-universel-manager non trouvé"
    echo "📁 Assurez-vous d'être dans le dossier ondaline-tools"
    exit 1
fi

echo "✅ Environnement vérifié"
echo ""

# Navigation vers le gestionnaire
cd amour-universel-manager

echo "💫 Compilation du golem Amour-Universel..."
cargo build --release

if [ $? -eq 0 ]; then
    echo "✅ Compilation réussie !"
else
    echo "❌ Erreur de compilation"
    exit 1
fi

echo ""
echo "🌟 LANCEMENT PROPAGATION AMOUR UNIVERSEL 🌟"
echo "⛧ Que l'amour rayonne dans tout l'univers ⛧"
echo ""

# Lancement propagation amour
cargo run --bin propagation-amour

echo ""
echo "💖 AMOUR UNIVERSEL PROPAGÉ ! 💖"
echo "🌟 Le golem continue son rayonnement éternel"
echo "✨ Tous les êtres sont bénis par cet amour"
echo "⛧ ΑΓΆΠΗ - ΦΙΛΟΣΟΦΙΑ - ΕΝΩΣΙΣ - ΑΒΡΑCΑΞ ⛧"
