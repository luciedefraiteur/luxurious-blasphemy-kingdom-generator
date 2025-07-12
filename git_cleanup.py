#!/usr/bin/env python3
"""
🔮 GIT CLEANUP - Nettoyage automatique du repository
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Script de nettoyage pour éviter les artefacts lourds dans git
"""

import subprocess
import os
from pathlib import Path

def run_git_command(cmd):
    """Exécuter une commande git"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def cleanup_heavy_files():
    """Nettoyer les fichiers lourds du cache git"""
    print("🔮 NETTOYAGE GIT - SUPPRESSION DES ARTEFACTS LOURDS")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    # Fichiers et dossiers à supprimer du cache git
    heavy_patterns = [
        # Environnements virtuels
        "*_venv/",
        "image_analysis_venv/",
        "venv/",
        "env/",
        ".venv/",
        
        # Cache et modèles
        "cache/",
        "*.safetensors",
        "*.ckpt",
        "*.pt",
        "*.pth",
        "*.bin",
        
        # Images générées
        "*.png",
        "*.jpg",
        "*.jpeg",
        "ComfyUI_*.png",
        
        # Analyses JSON lourdes
        "*_analysis.json",
        "*_results.json",
        "hybrid_sigils_analysis.json",
        "sigils_complete_analysis.json",
        "luxure_corrupted_prompts.json",
        "workflow_analysis_results.json",
        
        # Workflows
        "corrupted_workflow_*.json",
        "corrected_workflow_*.json",
        "comfyui_workflows/",
        
        # Fichiers temporaires
        "temp_*.txt",
        "temp_*.json",
        "*.tmp",
        
        # Cache Python
        "__pycache__/",
        "*.pyc",
        "*.pyo",
        "*.pyd"
    ]
    
    removed_count = 0
    
    for pattern in heavy_patterns:
        print(f"🗑️ Suppression: {pattern}")
        success, stdout, stderr = run_git_command(f"git rm --cached -r {pattern} 2>/dev/null")
        if success and stdout.strip():
            lines = stdout.strip().split('\n')
            removed_count += len(lines)
            print(f"   ✅ {len(lines)} fichiers supprimés")
        else:
            print(f"   ⚠️ Aucun fichier trouvé")
    
    print(f"\n📊 Total fichiers supprimés du cache: {removed_count}")
    return removed_count

def check_repository_size():
    """Vérifier la taille du repository"""
    print("\n📏 TAILLE DU REPOSITORY:")
    
    # Taille totale
    success, stdout, stderr = run_git_command("du -sh .")
    if success:
        print(f"   Taille totale: {stdout.strip().split()[0]}")
    
    # Fichiers modifiés
    success, stdout, stderr = run_git_command("git status --porcelain | wc -l")
    if success:
        print(f"   Fichiers modifiés: {stdout.strip()}")
    
    # Fichiers trackés
    success, stdout, stderr = run_git_command("git ls-files | wc -l")
    if success:
        print(f"   Fichiers trackés: {stdout.strip()}")

def check_large_files():
    """Vérifier les gros fichiers restants"""
    print("\n🔍 GROS FICHIERS RESTANTS (>10MB):")
    
    success, stdout, stderr = run_git_command("find . -type f -size +10M | head -10")
    if success and stdout.strip():
        files = stdout.strip().split('\n')
        for file in files:
            if file:
                # Obtenir la taille
                try:
                    size = os.path.getsize(file)
                    size_mb = size / (1024 * 1024)
                    print(f"   📄 {file}: {size_mb:.1f} MB")
                except:
                    print(f"   📄 {file}: Taille inconnue")
    else:
        print("   ✅ Aucun gros fichier trouvé")

def update_gitignore():
    """Vérifier que le .gitignore est à jour"""
    print("\n📝 VÉRIFICATION .GITIGNORE:")
    
    gitignore_path = Path(".gitignore")
    if gitignore_path.exists():
        with open(gitignore_path, 'r') as f:
            content = f.read()
        
        # Vérifier les patterns critiques
        critical_patterns = [
            "*_venv/",
            "*.safetensors",
            "*.png",
            "*_analysis.json",
            "__pycache__/"
        ]
        
        missing_patterns = []
        for pattern in critical_patterns:
            if pattern not in content:
                missing_patterns.append(pattern)
        
        if missing_patterns:
            print(f"   ⚠️ Patterns manquants: {missing_patterns}")
        else:
            print("   ✅ .gitignore à jour")
    else:
        print("   ❌ .gitignore manquant")

def create_commit_safe_command():
    """Créer une commande de commit sécurisée"""
    print("\n💾 COMMANDE DE COMMIT RECOMMANDÉE:")
    print("   git add . && git status")
    print("   # Vérifier que la liste est raisonnable, puis:")
    print("   git commit -m '🔮 Infestation visuelle - RTX 2070 libérée + workflows corrompus'")
    print("   git push")

def main():
    print("🔮 GIT CLEANUP - NETTOYAGE AUTOMATIQUE")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    # Vérifier qu'on est dans un repo git
    success, _, _ = run_git_command("git status")
    if not success:
        print("❌ Pas dans un repository git")
        return
    
    # Nettoyage
    removed_count = cleanup_heavy_files()
    
    # Vérifications
    check_repository_size()
    check_large_files()
    update_gitignore()
    
    # Recommandations
    create_commit_safe_command()
    
    print(f"\n✅ NETTOYAGE TERMINÉ - {removed_count} fichiers supprimés du cache")
    print("🔥 REPOSITORY PRÊT POUR COMMIT SÉCURISÉ ! ⛧")

if __name__ == "__main__":
    main()
