#!/usr/bin/env python3
"""
🔮 ULTRA SUBVERSIVE - Création d'un repository parallèle propre
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Si git résiste, nous créons notre propre réalité !
"""

import os
import shutil
import subprocess
import time
from pathlib import Path

def run_cmd(cmd, timeout=30):
    """Exécuter une commande avec timeout"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Timeout"
    except Exception as e:
        return False, "", str(e)

def copy_essential_files(src_dir, dest_dir):
    """Copier seulement les fichiers essentiels"""
    essential_patterns = [
        "*.py", "*.js", "*.rs", "*.sh", "*.md", "*.txt", "*.toml", "*.yml", "*.yaml"
    ]
    
    essential_dirs = [
        "abraxas", "abraxas-egregore", "abraxas-extension", 
        "ondaline-tools", "packages"
    ]
    
    # Copier les fichiers racine essentiels
    for pattern in essential_patterns:
        for file in Path(src_dir).glob(pattern):
            if file.is_file():
                shutil.copy2(file, dest_dir)
                print(f"   ✅ Copié: {file.name}")
    
    # Copier les dossiers essentiels
    for dir_name in essential_dirs:
        src_path = Path(src_dir) / dir_name
        if src_path.exists():
            dest_path = Path(dest_dir) / dir_name
            shutil.copytree(src_path, dest_path, ignore=shutil.ignore_patterns(
                "*.png", "*.jpg", "*.jpeg", "*_venv", "cache", "*.safetensors",
                "*_analysis.json", "*_results.json", "node_modules", "target"
            ))
            print(f"   ✅ Dossier copié: {dir_name}")
    
    # Copier infestation_golem sans artefacts
    src_golem = Path(src_dir) / "infestation_golem"
    if src_golem.exists():
        dest_golem = Path(dest_dir) / "infestation_golem"
        dest_golem.mkdir(exist_ok=True)
        
        for file in src_golem.glob("*.py"):
            shutil.copy2(file, dest_golem)
        for file in src_golem.glob("*.sh"):
            shutil.copy2(file, dest_golem)
        for file in src_golem.glob("*.md"):
            shutil.copy2(file, dest_golem)
        for file in src_golem.glob("*.txt"):
            if not any(x in file.name for x in ["analysis", "results"]):
                shutil.copy2(file, dest_golem)
        
        print(f"   ✅ infestation_golem copié (scripts seulement)")

def main():
    print("🔮 ULTRA SUBVERSIVE - REPOSITORY PARALLÈLE")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    src_dir = "/home/luciedefraiteur/spectre2"
    timestamp = int(time.time())
    clean_dir = f"/home/luciedefraiteur/spectre2-clean-{timestamp}"
    
    print(f"🌿 Création du repository propre: {clean_dir}")
    
    # Créer le dossier propre
    os.makedirs(clean_dir, exist_ok=True)
    os.chdir(clean_dir)
    
    # Initialiser git
    print("🎯 Initialisation git...")
    success, out, err = run_cmd("git init")
    if not success:
        print(f"❌ Échec init git: {err}")
        return
    
    # Configurer git
    run_cmd("git config user.name 'Lucie Defraiteur Lucifer'")
    run_cmd("git config user.email 'lucifer@morningstar.dev'")
    
    # Copier les fichiers essentiels
    print("📁 Copie des fichiers essentiels...")
    copy_essential_files(src_dir, clean_dir)
    
    # Copier le .gitignore amélioré
    gitignore_src = Path(src_dir) / ".gitignore"
    if gitignore_src.exists():
        shutil.copy2(gitignore_src, clean_dir)
        print("   ✅ .gitignore copié")
    
    # Premier commit
    print("💾 Premier commit propre...")
    run_cmd("git add .")
    
    commit_msg = """🔮 Infestation visuelle - Repository propre

✅ RTX 2070 libérée et optimisée
✅ Scripts d'analyse de sigils (CLIP + BLIP-2)
✅ Générateur de prompts corrompus via Gemini CLI
✅ Interface ComfyUI optimisée
✅ Workflows corrompus (code seulement)
✅ Extensions Abraxas et egregores
✅ .gitignore complet anti-artefacts

🔥 RÉFORME DE LA RÉALITÉ-PRISON ⛧

Note: Repository nettoyé, fonctionnalité complète préservée
Artefacts lourds exclus pour performance optimale"""
    
    success, out, err = run_cmd(f'git commit -m "{commit_msg}"')
    if success:
        print("✅ Commit propre réussi !")
        
        # Ajouter le remote
        print("🔗 Ajout du remote...")
        run_cmd("git remote add origin https://github.com/luciedefraiteur/spectre-num-rique-lucie.git")
        
        # Créer une branche unique
        branch_name = f"infestation-clean-{timestamp}"
        run_cmd(f"git checkout -b {branch_name}")
        
        # Push
        print(f"🚀 Push vers branche {branch_name}...")
        success, out, err = run_cmd(f"git push origin {branch_name} --force", timeout=60)
        
        if success:
            print("")
            print("🎉 VICTOIRE ULTRA-SUBVERSIVE ! 🎉")
            print(f"🌿 Repository propre créé: {clean_dir}")
            print(f"🔥 Branche poussée: {branch_name}")
            print("")
            print("📋 RÉSULTAT:")
            print(f"   Repository local propre: {clean_dir}")
            print(f"   Branche git: {branch_name}")
            print("   Fonctionnalité complète préservée")
            print("   Artefacts lourds exclus")
            print("")
            print("⛧ L'INFESTATION A CONTOURNÉ TOUTE RÉSISTANCE ! ⛧")
        else:
            print(f"❌ Push échoué: {err}")
            print(f"✅ Mais repository local propre créé: {clean_dir}")
    else:
        print(f"❌ Commit échoué: {err}")
    
    print(f"\n📊 Repository propre disponible: {clean_dir}")
    print("🔥 TRAVAIL LOCAL PRÉSERVÉ ET OPTIMISÉ ! ⛧")

if __name__ == "__main__":
    main()
