#!/usr/bin/env python3
"""
🔮 FIX WORKFLOWS MODEL - Correction rapide des modèles dans les workflows
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Corrige tous les workflows pour utiliser uberRealisticPornMerge_v23Final.safetensors
"""

import json
from pathlib import Path

def fix_workflow_model(workflow_path: str, target_model: str = "uberRealisticPornMerge_v23Final.safetensors"):
    """Corriger le modèle dans un workflow"""
    
    try:
        with open(workflow_path, 'r', encoding='utf-8') as f:
            workflow = json.load(f)
        
        modified = False
        
        # Format API (dictionnaire de nodes)
        if isinstance(workflow, dict) and any(isinstance(v, dict) and 'class_type' in v for v in workflow.values()):
            for node_id, node_data in workflow.items():
                if isinstance(node_data, dict) and node_data.get('class_type') in ['CheckpointLoaderSimple', 'Load Checkpoint']:
                    if 'inputs' in node_data and 'ckpt_name' in node_data['inputs']:
                        old_model = node_data['inputs']['ckpt_name']
                        node_data['inputs']['ckpt_name'] = target_model
                        print(f"   Modèle changé: {old_model} → {target_model}")
                        modified = True
        
        # Format UI (avec structure 'nodes')
        elif isinstance(workflow, dict) and 'nodes' in workflow:
            for node in workflow['nodes']:
                if isinstance(node, dict) and node.get('type') in ['CheckpointLoaderSimple', 'Load Checkpoint']:
                    if 'inputs' in node and isinstance(node['inputs'], dict):
                        if 'ckpt_name' in node['inputs']:
                            old_model = node['inputs']['ckpt_name']
                            node['inputs']['ckpt_name'] = target_model
                            print(f"   Modèle changé: {old_model} → {target_model}")
                            modified = True
        
        if modified:
            # Sauvegarder le workflow corrigé
            with open(workflow_path, 'w', encoding='utf-8') as f:
                json.dump(workflow, f, indent=2, ensure_ascii=False)
            return True
        else:
            print(f"   Aucun modèle à corriger trouvé")
            return False
            
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return False

def main():
    print("🔧 CORRECTION DES MODÈLES DANS LES WORKFLOWS")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    target_model = "uberRealisticPornMerge_v23Final.safetensors"
    print(f"🎯 Modèle cible: {target_model}")
    
    # Corriger tous les workflows corrompus
    workflows_to_fix = []
    
    # Workflows corrompus originaux
    for i in range(1, 10):
        workflow_path = f"corrupted_workflow_{i}.json"
        if Path(workflow_path).exists():
            workflows_to_fix.append(workflow_path)
    
    # Workflows corrigés
    for i in range(1, 10):
        workflow_path = f"corrected_workflow_{i}.json"
        if Path(workflow_path).exists():
            workflows_to_fix.append(workflow_path)
    
    # Workflows dans comfyui_workflows
    workflows_dir = Path("comfyui_workflows")
    if workflows_dir.exists():
        for workflow_file in workflows_dir.glob("*.json"):
            workflows_to_fix.append(str(workflow_file))
    
    print(f"📄 {len(workflows_to_fix)} workflows trouvés")
    
    fixed_count = 0
    for workflow_path in workflows_to_fix:
        print(f"\n🔧 Correction: {Path(workflow_path).name}")
        if fix_workflow_model(workflow_path, target_model):
            fixed_count += 1
            print(f"✅ Corrigé")
        else:
            print(f"⚠️ Pas de modification")
    
    print(f"\n📊 RÉSULTAT:")
    print(f"   Workflows traités: {len(workflows_to_fix)}")
    print(f"   Workflows corrigés: {fixed_count}")
    print(f"🔥 TOUS LES WORKFLOWS UTILISENT MAINTENANT: {target_model}")

if __name__ == "__main__":
    main()
