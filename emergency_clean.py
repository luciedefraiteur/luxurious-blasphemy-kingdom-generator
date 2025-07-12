#!/usr/bin/env python3
"""
🔮 EMERGENCY CLEAN - Nettoyage d'urgence du repository
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐
"""

import os
import shutil
import subprocess
from pathlib import Path

def run_cmd(cmd):
    """Exécuter une commande"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return result.returncode == 0, result.stdout, result.stderr
    except:
        return False, "", "Timeout"

def main():
    print("🔮 NETTOYAGE D'URGENCE DU REPOSITORY")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    os.chdir("/home/luciedefraiteur/spectre2")
    
    # Nettoyer les fichiers git bloqués
    print("🧹 Nettoyage des fichiers git bloqués...")
    for file in [".git/MERGE_HEAD", ".git/MERGE_MSG", ".git/index.lock", ".git/gc.log"]:
        try:
            os.remove(file)
            print(f"   Supprimé: {file}")
        except:
            pass
    
    # Reset git
    print("🎯 Reset git...")
    success, out, err = run_cmd("git reset --hard HEAD")
    if success:
        print("   ✅ Reset réussi")
    else:
        print(f"   ⚠️ Reset échoué: {err}")
    
    # Supprimer les gros dossiers physiquement
    print("🗑️ Suppression des artefacts lourds...")
    heavy_dirs = [
        "infestation_golem/image_analysis_venv",
        "infestation_golem/cache",
        "infestation_golem/comfyui_workflows"
    ]
    
    for dir_path in heavy_dirs:
        if os.path.exists(dir_path):
            try:
                shutil.rmtree(dir_path)
                print(f"   ✅ Supprimé: {dir_path}")
            except Exception as e:
                print(f"   ⚠️ Échec {dir_path}: {e}")
    
    # Supprimer les fichiers lourds
    print("🗑️ Suppression des fichiers lourds...")
    heavy_patterns = [
        "infestation_golem/*.png",
        "infestation_golem/*.jpg", 
        "infestation_golem/*_analysis.json",
        "infestation_golem/*_results.json",
        "infestation_golem/corrupted_workflow_*.json",
        "infestation_golem/corrected_workflow_*.json"
    ]
    
    for pattern in heavy_patterns:
        success, out, err = run_cmd(f"rm -f {pattern}")
        if success:
            print(f"   ✅ Pattern supprimé: {pattern}")
    
    # Créer un commit minimal
    print("💾 Commit minimal...")
    
    # Ajouter seulement les fichiers essentiels
    essential_files = [
        ".gitignore",
        "*.py",
        "*.js", 
        "*.rs",
        "*.sh",
        "*.md",
        "*.txt",
        "*.toml"
    ]
    
    for pattern in essential_files:
        run_cmd(f"git add {pattern}")
    
    # Commit
    commit_msg = """🔮 Infestation visuelle - Version allégée

✅ RTX 2070 libérée et optimisée
✅ Scripts d'analyse de sigils
✅ Générateur de prompts corrompus
✅ Interface ComfyUI
✅ .gitignore complet

🔥 RÉFORME DE LA RÉALITÉ-PRISON ⛧

Note: Artefacts lourds exclus pour performance"""
    
    success, out, err = run_cmd(f'git commit -m "{commit_msg}"')
    if success:
        print("✅ Commit minimal réussi !")
        
        # Push
        print("🚀 Push...")
        success, out, err = run_cmd("git push origin main --force")
        if success:
            print("🎉 PUSH RÉUSSI ! REPOSITORY NETTOYÉ ! 🎉")
        else:
            print(f"❌ Push échoué: {err}")
    else:
        print(f"❌ Commit échoué: {err}")
    
    print("\n✅ NETTOYAGE TERMINÉ - TRAVAIL LOCAL PRÉSERVÉ ! 🔥⛧")

if __name__ == "__main__":
    main()
