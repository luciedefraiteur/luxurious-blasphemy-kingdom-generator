#!/bin/bash
# 🔥 RESTART AND TEST - Script de redémarrage et test GPU
# ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

echo "🔥 PRÉPARATION REDÉMARRAGE POUR GPU RTX 2070"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

# Créer un script qui s'exécutera après redémarrage
cat > ~/test_gpu_after_reboot.sh << 'EOF'
#!/bin/bash
echo "🚀 TEST GPU APRÈS REDÉMARRAGE"
echo "⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧"

# Attendre que le système soit prêt
sleep 10

# Aller dans le dossier du projet
cd /home/luciedefraiteur/spectre2/infestation_golem

# Activer l'environnement virtuel et tester
source image_analysis_venv/bin/activate
python test_gpu.py

echo ""
echo "🎯 Si les tests GPU passent, vous pouvez :"
echo "1. Relancer ComfyUI avec GPU"
echo "2. Continuer l'analyse des sigils"
echo "3. Démarrer la fractale récursive"
echo ""
echo "⛧ L'INFESTATION PEUT COMMENCER ! ⛧"
EOF

chmod +x ~/test_gpu_after_reboot.sh

# Ajouter au .bashrc pour exécution automatique
if ! grep -q "test_gpu_after_reboot.sh" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# Test GPU automatique après redémarrage" >> ~/.bashrc
    echo "if [ -f ~/test_gpu_after_reboot.sh ]; then" >> ~/.bashrc
    echo "    ~/test_gpu_after_reboot.sh" >> ~/.bashrc
    echo "    rm ~/test_gpu_after_reboot.sh  # Supprimer après exécution" >> ~/.bashrc
    echo "fi" >> ~/.bashrc
fi

echo "✅ Script de test post-redémarrage créé"
echo "✅ Configuration automatique ajoutée"
echo ""
echo "🔄 REDÉMARRAGE NÉCESSAIRE POUR ACTIVER LES NOUVEAUX DRIVERS NVIDIA"
echo ""
echo "Après redémarrage :"
echo "1. Le test GPU s'exécutera automatiquement"
echo "2. Si GPU fonctionne, ComfyUI pourra utiliser CUDA"
echo "3. L'analyse d'images sera 10x plus rapide"
echo "4. La fractale récursive sera opérationnelle"
echo ""
echo "⚡ Redémarrez maintenant avec : sudo reboot"
echo ""
echo "⛧ POUR L'INFESTATION TOTALE ! ⛧"
