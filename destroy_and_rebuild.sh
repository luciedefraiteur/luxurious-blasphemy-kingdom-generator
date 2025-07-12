#!/bin/bash
# 🔮 DESTROY AND REBUILD - Destruction de l'ancien git et création parfaite
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔥 DESTRUCTION ET RENAISSANCE DU REPOSITORY"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

cd /home/luciedefraiteur/spectre2

# PHASE 1: DESTRUCTION DE L'ANCIEN SYSTÈME
echo "💀 PHASE 1: DESTRUCTION DE L'ANCIEN .git"
echo "   Suppression du dossier .git corrompu..."

# Forcer la suppression même si des processus sont bloqués
sudo pkill -f git 2>/dev/null || true
sleep 2

# Supprimer le .git avec force maximale
sudo rm -rf .git/ 2>/dev/null || true
rm -rf .git/ 2>/dev/null || true

if [ ! -d ".git" ]; then
    echo "   ✅ .git détruit avec succès !"
else
    echo "   ⚠️ .git résiste, force brute..."
    sudo chmod -R 777 .git/ 2>/dev/null || true
    sudo rm -rf .git/ 2>/dev/null || true
    rm -rf .git/ 2>/dev/null || true
fi

# PHASE 2: NETTOYAGE DES ARTEFACTS LOURDS
echo ""
echo "🧹 PHASE 2: NETTOYAGE DES ARTEFACTS LOURDS"

# Supprimer les environnements virtuels
echo "   Suppression des environnements virtuels..."
rm -rf infestation_golem/image_analysis_venv/ 2>/dev/null || true
rm -rf infestation_golem/*_venv/ 2>/dev/null || true
rm -rf venv/ env/ .venv/ 2>/dev/null || true

# Supprimer les caches
echo "   Suppression des caches..."
rm -rf infestation_golem/cache/ 2>/dev/null || true
rm -rf cache/ .cache/ 2>/dev/null || true
rm -rf __pycache__/ infestation_golem/__pycache__/ 2>/dev/null || true

# Supprimer les images générées
echo "   Suppression des images générées..."
rm -f infestation_golem/*.png infestation_golem/*.jpg 2>/dev/null || true
rm -f ComfyUI_*.png decompressed_*.* 2>/dev/null || true

# Supprimer les analyses JSON lourdes
echo "   Suppression des analyses JSON lourdes..."
rm -f infestation_golem/*_analysis.json 2>/dev/null || true
rm -f infestation_golem/*_results.json 2>/dev/null || true
rm -f infestation_golem/luxure_corrupted_prompts.json 2>/dev/null || true
rm -f infestation_golem/workflow_analysis_results.json 2>/dev/null || true
rm -f infestation_golem/corrupted_workflow_*.json 2>/dev/null || true
rm -f infestation_golem/corrected_workflow_*.json 2>/dev/null || true

# Supprimer les workflows ComfyUI
echo "   Suppression des workflows ComfyUI..."
rm -rf infestation_golem/comfyui_workflows/ 2>/dev/null || true

# Supprimer les fichiers temporaires
echo "   Suppression des fichiers temporaires..."
rm -f infestation_golem/temp_* infestation_golem/*.tmp 2>/dev/null || true
rm -f *.log infestation_golem/*.log 2>/dev/null || true

# PHASE 3: VÉRIFICATION DE LA PROPRETÉ
echo ""
echo "🔍 PHASE 3: VÉRIFICATION DE LA PROPRETÉ"

# Calculer la taille
total_size=$(du -sh . 2>/dev/null | cut -f1)
echo "   Taille totale du dossier: $total_size"

# Compter les fichiers
file_count=$(find . -type f | wc -l)
echo "   Nombre total de fichiers: $file_count"

# Vérifier les gros fichiers restants
echo "   Gros fichiers restants (>10MB):"
large_files=$(find . -type f -size +10M 2>/dev/null | head -5)
if [ -n "$large_files" ]; then
    echo "$large_files" | while read file; do
        size=$(du -h "$file" 2>/dev/null | cut -f1)
        echo "     ⚠️ $file ($size)"
    done
else
    echo "     ✅ Aucun gros fichier trouvé"
fi

# PHASE 4: PRÉPARATION POUR NOUVEAU GIT
echo ""
echo "🎯 PHASE 4: PRÉPARATION POUR NOUVEAU GIT"

# Vérifier que .gitignore est parfait
if [ -f ".gitignore" ]; then
    gitignore_size=$(wc -l < .gitignore)
    echo "   .gitignore: $gitignore_size lignes ✅"
else
    echo "   ❌ .gitignore manquant !"
fi

# Créer un résumé des fichiers qui seront trackés
echo "   Fichiers qui seront trackés:"
echo "     Scripts Python: $(find . -name "*.py" -not -path "./.git/*" | wc -l)"
echo "     Scripts Shell: $(find . -name "*.sh" -not -path "./.git/*" | wc -l)"
echo "     Fichiers Rust: $(find . -name "*.rs" -not -path "./.git/*" | wc -l)"
echo "     Fichiers Markdown: $(find . -name "*.md" -not -path "./.git/*" | wc -l)"
echo "     Fichiers config: $(find . -name "*.toml" -o -name "*.json" -o -name "*.yaml" | grep -v "_analysis\|_results\|workflow_\|corrupted_\|corrected_" | wc -l)"

echo ""
echo "🎉 DESTRUCTION ET NETTOYAGE TERMINÉS !"
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo "   1. cd /home/luciedefraiteur/spectre2"
echo "   2. git init"
echo "   3. git remote add origin <NOUVEAU_REPO_URL>"
echo "   4. git add ."
echo "   5. git commit -m '🔮 Infestation visuelle - Repository propre'"
echo "   6. git push origin main"
echo ""
echo "✅ REPOSITORY PRÊT POUR RENAISSANCE PARFAITE ! 🔥⛧"
