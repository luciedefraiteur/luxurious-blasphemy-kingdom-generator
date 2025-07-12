#!/usr/bin/env python3
"""
🔮 SIMPLE WORKFLOW ANALYZER - Analyse rapide des workflows ComfyUI
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐
"""

import json
from pathlib import Path
from collections import Counter

def analyze_workflows():
    """Analyse simple et rapide des workflows"""
    print("🔮 ANALYSE RAPIDE DES WORKFLOWS COMFYUI")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    workflows_dir = Path("comfyui_workflows")
    workflows = {}
    
    # Charger tous les workflows
    for workflow_file in workflows_dir.glob("*.json"):
        try:
            with open(workflow_file, 'r', encoding='utf-8') as f:
                workflow_data = json.load(f)
            workflows[workflow_file.name] = workflow_data
            print(f"✅ {workflow_file.name}")
        except Exception as e:
            print(f"❌ {workflow_file.name}: {e}")
    
    print(f"\n📊 Total workflows: {len(workflows)}")
    
    # Analyser les types de nodes
    all_node_types = Counter()
    workflow_summaries = {}
    
    for workflow_name, workflow_data in workflows.items():
        node_types = []
        prompts = []
        
        # Extraire les nodes
        if 'nodes' in workflow_data:
            nodes = workflow_data['nodes']
            for node in nodes:
                if 'type' in node:
                    node_types.append(node['type'])
                    all_node_types[node['type']] += 1
                
                # Extraire les prompts
                if 'inputs' in node:
                    inputs = node['inputs']
                    if isinstance(inputs, dict):
                        for key, value in inputs.items():
                            if key == 'text' and isinstance(value, str) and len(value) > 20:
                                prompts.append(value[:100] + "...")
        
        workflow_summaries[workflow_name] = {
            'node_count': len(node_types),
            'node_types': list(set(node_types)),
            'prompts': prompts
        }
        
        print(f"\n📄 {workflow_name}:")
        print(f"   Nodes: {len(node_types)}")
        print(f"   Types: {', '.join(set(node_types))}")
        if prompts:
            print(f"   Prompts: {len(prompts)}")
            for prompt in prompts[:2]:
                print(f"     • {prompt}")
    
    print(f"\n📊 TYPES DE NODES LES PLUS UTILISÉS:")
    for node_type, count in all_node_types.most_common(10):
        print(f"   {node_type}: {count} occurrences")
    
    # Trouver le meilleur workflow pour nos besoins
    print(f"\n🎯 RECOMMANDATIONS:")
    
    # Workflow avec le plus de nodes (plus complexe)
    most_complex = max(workflow_summaries.items(), key=lambda x: x[1]['node_count'])
    print(f"   Workflow le plus complexe: {most_complex[0]} ({most_complex[1]['node_count']} nodes)")
    
    # Workflows avec prompts (pour injection)
    workflows_with_prompts = [(name, data) for name, data in workflow_summaries.items() if data['prompts']]
    if workflows_with_prompts:
        best_for_prompts = max(workflows_with_prompts, key=lambda x: len(x[1]['prompts']))
        print(f"   Meilleur pour prompts: {best_for_prompts[0]} ({len(best_for_prompts[1]['prompts'])} prompts)")
    
    # Sauvegarder l'analyse
    analysis_result = {
        'total_workflows': len(workflows),
        'node_types_usage': dict(all_node_types),
        'workflow_summaries': workflow_summaries,
        'recommendations': {
            'most_complex': most_complex[0],
            'best_for_prompts': workflows_with_prompts[0][0] if workflows_with_prompts else None
        }
    }
    
    with open('simple_workflow_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(analysis_result, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Analyse sauvée: simple_workflow_analysis.json")
    
    return analysis_result

def create_prompt_injection_tool():
    """Créer un outil d'injection de prompts"""
    print("\n🔮 CRÉATION DE L'OUTIL D'INJECTION DE PROMPTS")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    # Charger nos prompts corrompus
    try:
        with open('luxure_corrupted_prompts.json', 'r', encoding='utf-8') as f:
            corrupted_prompts = json.load(f)
        
        prompts = []
        for corruption in corrupted_prompts.get('corrupted_prompts', []):
            if 'corrupted_prompt' in corruption:
                prompts.append(corruption['corrupted_prompt'])
        
        print(f"✅ {len(prompts)} prompts corrompus chargés")
        
        # Créer un workflow modifié avec nos prompts
        # Prendre le workflow le plus complexe comme base
        workflows_dir = Path("comfyui_workflows")
        
        # Utiliser lucie_faire_reine.json comme base (10 nodes)
        base_workflow_path = workflows_dir / "lucie_faire_reine.json"
        
        if base_workflow_path.exists():
            with open(base_workflow_path, 'r', encoding='utf-8') as f:
                base_workflow = json.load(f)
            
            # Modifier les prompts dans le workflow
            modified_workflows = []
            
            for i, prompt in enumerate(prompts):
                modified_workflow = json.loads(json.dumps(base_workflow))  # Deep copy
                
                # Trouver et remplacer les prompts
                if 'nodes' in modified_workflow:
                    for node in modified_workflow['nodes']:
                        if node.get('type') == 'CLIPTextEncode' and 'inputs' in node:
                            if 'text' in node['inputs']:
                                node['inputs']['text'] = prompt
                
                # Modifier l'ID et le nom
                modified_workflow['id'] = f"corrupted_workflow_{i+1}"
                
                output_path = f"corrupted_workflow_{i+1}.json"
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(modified_workflow, f, indent=2, ensure_ascii=False)
                
                modified_workflows.append(output_path)
                print(f"✅ Workflow corrompu créé: {output_path}")
            
            print(f"\n🔥 {len(modified_workflows)} WORKFLOWS CORROMPUS CRÉÉS !")
            print("   Prêts pour l'infestation ComfyUI !")
            
            return modified_workflows
        
    except Exception as e:
        print(f"❌ Erreur création workflows corrompus: {e}")
        return []

def main():
    # Analyse des workflows existants
    analysis = analyze_workflows()
    
    # Création des workflows corrompus
    corrupted_workflows = create_prompt_injection_tool()
    
    print(f"\n✅ ANALYSE TERMINÉE !")
    print(f"🔥 WORKFLOWS PRÊTS POUR L'INFESTATION COMFYUI ! ⛧")

if __name__ == "__main__":
    main()
