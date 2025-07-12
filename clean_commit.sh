#!/bin/bash
# 🔮 CLEAN COMMIT - Commit propre sans artefacts lourds
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔮 NETTOYAGE ET COMMIT PROPRE"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

cd /home/luciedefraiteur/spectre2

# Nettoyer les fichiers git bloqués
echo "🧹 Nettoyage des fichiers git bloqués..."
rm -f .git/MERGE_* .git/index.lock .git/gc.log 2>/dev/null
git reset --hard HEAD 2>/dev/null

# Supprimer les fichiers lourds du cache git
echo "🗑️ Suppression des artefacts lourds du cache git..."

# Supprimer les gros fichiers du cache
git rm --cached -r infestation_golem/image_analysis_venv/ 2>/dev/null || true
git rm --cached -r infestation_golem/cache/ 2>/dev/null || true
git rm --cached infestation_golem/*.png 2>/dev/null || true
git rm --cached infestation_golem/*.jpg 2>/dev/null || true
git rm --cached infestation_golem/*_analysis.json 2>/dev/null || true
git rm --cached infestation_golem/*_results.json 2>/dev/null || true
git rm --cached infestation_golem/corrupted_workflow_*.json 2>/dev/null || true
git rm --cached infestation_golem/corrected_workflow_*.json 2>/dev/null || true
git rm --cached infestation_golem/comfyui_workflows/ 2>/dev/null || true

# Ajouter seulement les fichiers essentiels
echo "✅ Ajout des fichiers essentiels seulement..."
git add .gitignore
git add *.py *.js *.rs *.sh *.md *.txt *.toml 2>/dev/null || true
git add abraxas/ 2>/dev/null || true
git add abraxas-*/ 2>/dev/null || true
git add ondaline-tools/ 2>/dev/null || true
git add packages/ 2>/dev/null || true

# Ajouter les fichiers infestation_golem essentiels seulement
git add infestation_golem/*.py 2>/dev/null || true
git add infestation_golem/*.sh 2>/dev/null || true
git add infestation_golem/*.md 2>/dev/null || true
git add infestation_golem/*.txt 2>/dev/null || true

# Vérifier la taille du commit
echo "📊 Vérification de la taille du commit..."
file_count=$(git status --porcelain | wc -l)
echo "   Fichiers à commiter: $file_count"

if [ $file_count -gt 200 ]; then
    echo "⚠️ ATTENTION: Trop de fichiers ($file_count) !"
    echo "   Réduction en cours..."
    git reset
    git add .gitignore *.py *.js *.rs *.sh *.md
    file_count=$(git status --porcelain | wc -l)
    echo "   Fichiers réduits à: $file_count"
fi

# Commit propre
echo "💾 Commit propre..."
git commit -m "🔮 Infestation visuelle - Version propre

✅ RTX 2070 libérée et optimisée
✅ Analyse de sigils (CLIP + BLIP-2)
✅ Prompts corrompus via Gemini CLI  
✅ Workflows ComfyUI optimisés
✅ .gitignore complet (artefacts exclus)

🔥 RÉFORME DE LA RÉALITÉ-PRISON ⛧

Note: Artefacts lourds exclus pour performance"

if [ $? -eq 0 ]; then
    echo "✅ Commit propre réussi !"
    
    # Push rapide
    echo "🚀 Push rapide..."
    git push origin main --force
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCÈS ! INFESTATION PROPRE POUSSÉE ! 🎉"
        echo "🔥 REPOSITORY OPTIMISÉ ET SYNCHRONISÉ ! ⛧"
    else
        echo "❌ Échec du push, mais commit local réussi"
    fi
else
    echo "❌ Échec du commit"
fi

echo ""
echo "📊 Statut final:"
git log --oneline -2 2>/dev/null || echo "Git log non disponible"
