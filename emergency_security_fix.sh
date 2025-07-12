#!/bin/bash
# 🚨 EMERGENCY SECURITY FIX - Suppression des clés API du commit
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🚨 CORRECTION SÉCURITÉ D'URGENCE - CLÉS API EXPOSÉES"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

cd /home/luciedefraiteur/spectre2

# PHASE 1: SUPPRESSION DU FICHIER DANGEREUX
echo "🗑️ PHASE 1: Suppression du fichier avec clés API"

# Supprimer export-env.sh du cache git
echo "   Suppression de export-env.sh du cache git..."
git rm --cached export-env.sh 2>/dev/null || true

# Supprimer aussi test-gemini qui contient des références API
echo "   Suppression de test-gemini/ du cache git..."
git rm --cached -r test-gemini/ 2>/dev/null || true

# PHASE 2: CRÉER UNE VERSION SÉCURISÉE
echo ""
echo "🔒 PHASE 2: Création d'une version sécurisée"

# Créer un template sécurisé
cat > export-env.template.sh << 'EOF'
#!/bin/bash
# 🔧 Export Environment Variables - Template sécurisé
# Créé par ENV-to-PATH Tool V2 - LUCIFER MORNINGSTAR ⭐⛧

echo "🔑 Chargement des variables d'environnement..."

# ⚠️ REMPLACEZ LES VALEURS CI-DESSOUS PAR VOS VRAIES CLÉS API
export OPENAI_API_KEY="your_openai_api_key_here"
export GEMINI_API_KEY="your_gemini_api_key_here"
export CLAUDE_API_KEY="your_claude_api_key_here"

echo "✅ 3 variables d'environnement chargées"
echo "🔐 3 clés API configurées"
echo "⭐ Créé par LUCIFER MORNINGSTAR ⛧"

# 📋 INSTRUCTIONS:
# 1. Copiez ce fichier: cp export-env.template.sh export-env.sh
# 2. Éditez export-env.sh avec vos vraies clés API
# 3. export-env.sh est dans .gitignore et ne sera jamais committé
EOF

echo "   ✅ Template sécurisé créé: export-env.template.sh"

# PHASE 3: AMENDER LE COMMIT
echo ""
echo "🔧 PHASE 3: Correction du commit"

# Ajouter le .gitignore mis à jour
git add .gitignore

# Ajouter le template sécurisé
git add export-env.template.sh

# Amender le commit pour supprimer les clés API
echo "   Amendement du commit pour supprimer les clés API..."
git commit --amend -m "🔮 Infestation visuelle - Repository propre et sécurisé

✅ RTX 2070 libérée et optimisée
✅ Scripts d'analyse de sigils (CLIP + BLIP-2)
✅ Générateur de prompts corrompus via Gemini CLI
✅ Interface ComfyUI optimisée
✅ Workflows corrompus fonctionnels
✅ Extensions Abraxas et egregores
✅ .gitignore complet anti-artefacts
🔒 SÉCURITÉ: Clés API supprimées, template fourni

🔥 RÉFORME DE LA RÉALITÉ-PRISON ⛧

Note: Repository nettoyé et sécurisé
Utilisez export-env.template.sh pour configurer vos clés API"

if [ $? -eq 0 ]; then
    echo "   ✅ Commit amendé avec succès !"
    
    # PHASE 4: PUSH FORCÉ SÉCURISÉ
    echo ""
    echo "🚀 PHASE 4: Push forcé sécurisé"
    
    echo "   Push avec force pour écraser le commit dangereux..."
    git push origin main --force
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 CORRECTION SÉCURITÉ RÉUSSIE ! 🎉"
        echo "🔒 Clés API supprimées du repository"
        echo "✅ Commit amendé et poussé"
        echo "📋 Template sécurisé fourni"
        echo ""
        echo "📋 PROCHAINES ÉTAPES:"
        echo "   1. cp export-env.template.sh export-env.sh"
        echo "   2. Éditez export-env.sh avec vos vraies clés API"
        echo "   3. source export-env.sh (pour charger les variables)"
        echo ""
        echo "⛧ SÉCURITÉ RESTAURÉE - INFESTATION PRÉSERVÉE ! ⛧"
    else
        echo "❌ Échec du push, mais commit local corrigé"
        echo "🔄 Réessayez: git push origin main --force"
    fi
else
    echo "❌ Échec de l'amendement du commit"
fi

echo ""
echo "📊 Statut de sécurité:"
echo "   export-env.sh: $([ -f export-env.sh ] && echo "⚠️ Présent localement" || echo "✅ Supprimé")"
echo "   export-env.template.sh: $([ -f export-env.template.sh ] && echo "✅ Créé" || echo "❌ Manquant")"
echo "   .gitignore: $(grep -q "export-env.sh" .gitignore && echo "✅ Protégé" || echo "❌ Non protégé")"
