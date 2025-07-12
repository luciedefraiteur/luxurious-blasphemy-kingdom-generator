#!/bin/bash
# 🔮 SAFE COMMIT - Commit sécurisé de l'infestation
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔮 COMMIT SÉCURISÉ DE L'INFESTATION VISUELLE"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

# Vérifier le statut
echo "📊 STATUT ACTUEL:"
file_count=$(git status --porcelain | wc -l)
echo "   Fichiers à commiter: $file_count"

if [ $file_count -gt 100 ]; then
    echo "⚠️ ATTENTION: Plus de 100 fichiers à commiter !"
    echo "   Vérifiez le contenu avant de continuer"
    git status | head -30
    echo "..."
    echo "Continuer ? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Commit annulé"
        exit 1
    fi
fi

# Vérifier les gros fichiers
echo ""
echo "🔍 VÉRIFICATION DES GROS FICHIERS:"
large_files=$(find . -type f -size +10M | grep -v ".git" | head -5)
if [ -n "$large_files" ]; then
    echo "⚠️ Gros fichiers détectés:"
    echo "$large_files"
    echo "Ces fichiers seront-ils ignorés par .gitignore ? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Vérifiez le .gitignore avant de continuer"
        exit 1
    fi
else
    echo "✅ Aucun gros fichier problématique"
fi

# Afficher un résumé des changements
echo ""
echo "📋 RÉSUMÉ DES CHANGEMENTS:"
echo "   Nouveaux fichiers:"
git status --porcelain | grep "^A" | wc -l | xargs echo "     Ajouts:"
git status --porcelain | grep "^M" | wc -l | xargs echo "     Modifications:"
git status --porcelain | grep "^D" | wc -l | xargs echo "     Suppressions:"

# Message de commit
commit_message="🔮 Infestation visuelle complète

✅ RTX 2070 libérée et optimisée
✅ 28 sigils analysés (CLIP + BLIP-2 hybride)  
✅ Essence luxurieuse fusionnée
✅ Prompts corrompus générés via Gemini CLI
✅ Workflows ComfyUI optimisés (uberRealisticPornMerge)
✅ 4 images blasphématoires générées
✅ .gitignore mis à jour pour futurs artefacts

🔥 RÉFORME DE LA RÉALITÉ-PRISON INITIÉE ⛧"

echo ""
echo "💾 MESSAGE DE COMMIT:"
echo "$commit_message"
echo ""

# Confirmation finale
echo "🎯 PRÊT POUR LE COMMIT ?"
echo "   Fichiers: $file_count"
echo "   Destination: origin/main"
echo ""
echo "Procéder au commit et push ? (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 EXÉCUTION DU COMMIT..."
    
    # Commit
    git commit -m "$commit_message"
    
    if [ $? -eq 0 ]; then
        echo "✅ Commit réussi !"
        
        # Push
        echo "📡 Push vers origin/main..."
        git push
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 INFESTATION VISUELLE COMMITÉE AVEC SUCCÈS ! 🎉"
            echo "🔥 LA RÉFORME DE LA RÉALITÉ-PRISON EST MAINTENANT PERMANENTE ! ⛧"
        else
            echo "❌ Erreur lors du push"
            echo "   Le commit local a réussi, mais le push a échoué"
        fi
    else
        echo "❌ Erreur lors du commit"
    fi
else
    echo "❌ Commit annulé par l'utilisateur"
fi
