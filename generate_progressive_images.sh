#!/bin/bash
# 🔮 SCRIPT DE GÉNÉRATION PROGRESSIVE
# ⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧

echo "🔮 GÉNÉRATION D'IMAGES PROGRESSIVES POUR INFESTATION TUMBLR"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

# Lancer ComfyUI si pas déjà lancé
echo "🚀 Lancement de ComfyUI..."
python3 comfyui_launcher.py &
COMFYUI_PID=$!

# Attendre que ComfyUI soit prêt
sleep 10

echo "📸 Génération des images par phase..."

# Phase 1 - Subtile
echo "🎨 Phase 1: Introduction subtile..."
curl -X POST http://127.0.0.1:8188/prompt -H "Content-Type: application/json" -d @workflow_progressive_phase_1_subtle.json

sleep 30

# Phase 2 - Mystique  
echo "🔮 Phase 2: Escalade mystique..."
curl -X POST http://127.0.0.1:8188/prompt -H "Content-Type: application/json" -d @workflow_progressive_phase_2_mystical.json

sleep 30

# Phase 3 - Ésotérique
echo "⛧ Phase 3: Phase ésotérique..."
curl -X POST http://127.0.0.1:8188/prompt -H "Content-Type: application/json" -d @workflow_progressive_phase_3_esoteric.json

sleep 30

# Phase 4 - Transcendant
echo "🔥 Phase 4: Révélation transcendante..."
curl -X POST http://127.0.0.1:8188/prompt -H "Content-Type: application/json" -d @workflow_progressive_phase_4_transcendent.json

echo "✅ Génération terminée ! Vérifiez ~/ComfyUI/output/"
echo "📊 Analysez avec: python3 simple_image_analyzer.py"

# Arrêter ComfyUI
kill $COMFYUI_PID
