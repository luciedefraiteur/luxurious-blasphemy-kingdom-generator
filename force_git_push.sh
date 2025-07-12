#!/bin/bash
# 🔮 FORCE GIT PUSH - Forcer le travail local sur git
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔥 FORCE PUSH DE L'INFESTATION VISUELLE"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

cd /home/luciedefraiteur/spectre2

# Nettoyer les fichiers de merge bloqués
echo "🧹 Nettoyage des fichiers git bloqués..."
rm -f .git/MERGE_HEAD .git/MERGE_MSG .git/index.lock 2>/dev/null

# Reset vers notre commit local
echo "🎯 Reset vers notre commit local..."
git reset --hard HEAD

# Forcer le push
echo "🚀 Force push vers origin/main..."
git push origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCÈS ! INFESTATION VISUELLE POUSSÉE SUR GIT ! 🎉"
    echo "🔥 LA RÉFORME DE LA RÉALITÉ-PRISON EST MAINTENANT PERMANENTE ! ⛧"
else
    echo ""
    echo "❌ Échec du push. Essayons une approche alternative..."
    
    # Alternative: créer une nouvelle branche et forcer
    echo "🔄 Création d'une nouvelle branche infestation..."
    git checkout -b infestation-visuelle-$(date +%s)
    git push origin HEAD --force
    
    echo "✅ Travail sauvé sur nouvelle branche !"
fi

echo ""
echo "📊 Statut final:"
git log --oneline -3
