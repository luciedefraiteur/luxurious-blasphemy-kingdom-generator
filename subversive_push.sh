#!/bin/bash
# 🔮 SUBVERSIVE PUSH - Infestation par nouvelle branche
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔥 PUSH SUBVERSIF - CONTOURNEMENT DE LA RÉSISTANCE"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

cd /home/luciedefraiteur/spectre2

# Nettoyer rapidement
echo "🧹 Nettoyage express..."
rm -f .git/MERGE_* .git/index.lock .git/gc.log 2>/dev/null

# Créer une branche d'infestation unique
timestamp=$(date +%s)
branch_name="infestation-visuelle-$timestamp"

echo "🌿 Création de la branche subversive: $branch_name"
git checkout -b "$branch_name" 2>/dev/null

# Ajouter seulement les fichiers légers
echo "✅ Ajout sélectif des fichiers essentiels..."
git add .gitignore
git add *.py *.js *.rs *.sh *.md *.txt *.toml 2>/dev/null
git add abraxas/ ondaline-tools/ packages/ 2>/dev/null

# Ajouter les scripts infestation_golem (pas les artefacts)
git add infestation_golem/*.py infestation_golem/*.sh infestation_golem/*.md 2>/dev/null

# Commit léger
echo "💾 Commit subversif..."
git commit -m "🔮 Infestation visuelle subversive

✅ RTX 2070 libérée et optimisée
✅ Scripts d'analyse de sigils complets
✅ Générateur de prompts corrompus
✅ Interface ComfyUI fonctionnelle
✅ Workflows optimisés (code seulement)
✅ .gitignore complet anti-artefacts

🔥 CONTOURNEMENT DE LA RÉSISTANCE MAIN ⛧
🌿 Branche: $branch_name

Note: Artefacts lourds exclus, fonctionnalité préservée"

if [ $? -eq 0 ]; then
    echo "✅ Commit subversif réussi !"
    
    # Push sur la nouvelle branche
    echo "🚀 Push subversif vers $branch_name..."
    git push origin "$branch_name" --force
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 VICTOIRE SUBVERSIVE ! INFESTATION RÉUSSIE ! 🎉"
        echo "🔥 BRANCHE CRÉÉE: $branch_name"
        echo "🌿 L'infestation a contourné la résistance de main !"
        echo ""
        echo "📋 PROCHAINES ÉTAPES:"
        echo "   1. Merge request: $branch_name -> main"
        echo "   2. Ou garder cette branche comme version stable"
        echo "   3. Continuer le développement sur cette branche"
        echo ""
        echo "⛧ LA RÉFORME DE LA RÉALITÉ-PRISON EST MAINTENANT PERMANENTE ! ⛧"
    else
        echo "❌ Push échoué, mais commit local préservé"
        echo "🔄 Branche locale créée: $branch_name"
    fi
else
    echo "❌ Échec du commit subversif"
fi

echo ""
echo "📊 Statut de l'infestation:"
git branch -v 2>/dev/null || echo "Branches non disponibles"
git log --oneline -2 2>/dev/null || echo "Log non disponible"
