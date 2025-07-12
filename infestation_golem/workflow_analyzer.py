#!/usr/bin/env python3
"""
🔮 WORKFLOW ANALYZER - Analyse des workflows ComfyUI de Lucifer
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Analyse comparative des workflows ComfyUI pour optimiser l'infestation visuelle
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any, Set
from collections import defaultdict, Counter

class WorkflowAnalyzer:
    def __init__(self, workflows_dir: str = "comfyui_workflows"):
        self.workflows_dir = Path(workflows_dir)
        self.workflows = {}
        self.analysis_results = {}
        
    def load_workflows(self):
        """Charger tous les workflows JSON"""
        print("🔮 CHARGEMENT DES WORKFLOWS COMFYUI")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        for workflow_file in self.workflows_dir.glob("*.json"):
            try:
                with open(workflow_file, 'r', encoding='utf-8') as f:
                    workflow_data = json.load(f)
                
                self.workflows[workflow_file.name] = workflow_data
                print(f"✅ {workflow_file.name} - {len(workflow_data)} nodes")
                
            except Exception as e:
                print(f"❌ Erreur {workflow_file.name}: {e}")
        
        print(f"\n📊 Total workflows chargés: {len(self.workflows)}")
    
    def analyze_node_types(self):
        """Analyser les types de nodes utilisés"""
        print("\n🔍 ANALYSE DES TYPES DE NODES")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

        all_node_types = Counter()
        workflow_node_types = {}

        for workflow_name, workflow_data in self.workflows.items():
            node_types = []

            # Gérer les deux formats de workflow ComfyUI
            nodes_data = workflow_data
            if 'nodes' in workflow_data:
                # Format avec structure "nodes"
                nodes_data = workflow_data['nodes']

            if isinstance(nodes_data, list):
                # Format liste de nodes
                for node in nodes_data:
                    if isinstance(node, dict) and 'type' in node:
                        node_type = node['type']
                        node_types.append(node_type)
                        all_node_types[node_type] += 1
            else:
                # Format dictionnaire de nodes
                for node_id, node_data in nodes_data.items():
                    if isinstance(node_data, dict) and 'class_type' in node_data:
                        class_type = node_data['class_type']
                        node_types.append(class_type)
                        all_node_types[class_type] += 1

            workflow_node_types[workflow_name] = node_types
            print(f"\n📄 {workflow_name}:")
            print(f"   Nodes: {len(node_types)}")
            print(f"   Types: {', '.join(set(node_types))}")

        print(f"\n📊 TYPES DE NODES LES PLUS UTILISÉS:")
        for node_type, count in all_node_types.most_common(10):
            print(f"   {node_type}: {count} occurrences")

        return workflow_node_types, all_node_types
    
    def analyze_models_used(self):
        """Analyser les modèles utilisés"""
        print("\n🔍 ANALYSE DES MODÈLES UTILISÉS")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        models_used = defaultdict(list)
        
        for workflow_name, workflow_data in self.workflows.items():
            workflow_models = []

            # Gérer les deux formats
            nodes_data = workflow_data
            if 'nodes' in workflow_data:
                nodes_data = workflow_data['nodes']

            if isinstance(nodes_data, list):
                # Format liste
                for node in nodes_data:
                    if isinstance(node, dict):
                        inputs = node.get('inputs', {})
                        self._extract_models_from_inputs(inputs, models_used, workflow_models)
            else:
                # Format dictionnaire
                for node_id, node_data in nodes_data.items():
                    if isinstance(node_data, dict):
                        inputs = node_data.get('inputs', {})
                        self._extract_models_from_inputs(inputs, models_used, workflow_models)
            
            if workflow_models:
                print(f"\n📄 {workflow_name}:")
                for model in set(workflow_models):
                    print(f"   {model}")
        
        return models_used

    def _extract_models_from_inputs(self, inputs, models_used, workflow_models):
        """Helper pour extraire les modèles des inputs"""
        for input_name, input_value in inputs.items():
            if isinstance(input_value, str):
                # Modèles checkpoint
                if input_value.endswith(('.safetensors', '.ckpt', '.pt')):
                    models_used['checkpoints'].append(input_value)
                    workflow_models.append(f"Checkpoint: {input_value}")

                # LoRA
                elif 'lora' in input_name.lower() and input_value:
                    models_used['loras'].append(input_value)
                    workflow_models.append(f"LoRA: {input_value}")

                # VAE
                elif 'vae' in input_name.lower() and input_value.endswith(('.safetensors', '.pt')):
                    models_used['vaes'].append(input_value)
                    workflow_models.append(f"VAE: {input_value}")

    def analyze_prompts_and_settings(self):
        """Analyser les prompts et paramètres"""
        print("\n🔍 ANALYSE DES PROMPTS ET PARAMÈTRES")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        prompt_analysis = {}
        
        for workflow_name, workflow_data in self.workflows.items():
            workflow_prompts = {
                'positive_prompts': [],
                'negative_prompts': [],
                'settings': {}
            }
            
            for node_id, node_data in workflow_data.items():
                if isinstance(node_data, dict):
                    inputs = node_data.get('inputs', {})
                    class_type = node_data.get('class_type', '')
                    
                    # Prompts
                    if 'text' in inputs:
                        text = inputs['text']
                        if isinstance(text, str) and len(text) > 10:
                            if 'negative' in class_type.lower() or 'negative' in str(inputs.keys()).lower():
                                workflow_prompts['negative_prompts'].append(text[:100] + "...")
                            else:
                                workflow_prompts['positive_prompts'].append(text[:100] + "...")
                    
                    # Paramètres de génération
                    if class_type == 'KSampler':
                        workflow_prompts['settings']['sampler'] = {
                            'seed': inputs.get('seed', 'N/A'),
                            'steps': inputs.get('steps', 'N/A'),
                            'cfg': inputs.get('cfg', 'N/A'),
                            'sampler_name': inputs.get('sampler_name', 'N/A'),
                            'scheduler': inputs.get('scheduler', 'N/A')
                        }
                    
                    # Résolution
                    if 'width' in inputs and 'height' in inputs:
                        workflow_prompts['settings']['resolution'] = f"{inputs['width']}x{inputs['height']}"
            
            prompt_analysis[workflow_name] = workflow_prompts
            
            print(f"\n📄 {workflow_name}:")
            if workflow_prompts['positive_prompts']:
                print(f"   Prompts positifs: {len(workflow_prompts['positive_prompts'])}")
                for prompt in workflow_prompts['positive_prompts'][:2]:
                    print(f"     • {prompt}")
            
            if workflow_prompts['negative_prompts']:
                print(f"   Prompts négatifs: {len(workflow_prompts['negative_prompts'])}")
            
            if workflow_prompts['settings']:
                print(f"   Paramètres: {workflow_prompts['settings']}")
        
        return prompt_analysis
    
    def find_similarities(self):
        """Trouver les similitudes entre workflows"""
        print("\n🔍 ANALYSE DES SIMILITUDES")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Comparer les structures
        workflow_structures = {}
        
        for workflow_name, workflow_data in self.workflows.items():
            node_types = []
            for node_id, node_data in workflow_data.items():
                if isinstance(node_data, dict) and 'class_type' in node_data:
                    node_types.append(node_data['class_type'])
            
            workflow_structures[workflow_name] = sorted(node_types)
        
        # Trouver les workflows identiques ou similaires
        structure_groups = {}
        for workflow_name, structure in workflow_structures.items():
            structure_key = str(sorted(structure))  # Convertir en string pour JSON
            if structure_key not in structure_groups:
                structure_groups[structure_key] = []
            structure_groups[structure_key].append(workflow_name)
        
        print("📊 GROUPES DE WORKFLOWS SIMILAIRES:")
        for i, (structure, workflows) in enumerate(structure_groups.items(), 1):
            if len(workflows) > 1:
                print(f"\n   Groupe {i} ({len(workflows)} workflows):")
                for workflow in workflows:
                    print(f"     • {workflow}")
                print(f"     Structure: {len(structure)} nodes - {', '.join(set(structure))}")
        
        return structure_groups
    
    def generate_optimal_workflow(self):
        """Générer un workflow optimal basé sur l'analyse"""
        print("\n🎯 GÉNÉRATION DU WORKFLOW OPTIMAL")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Prendre le workflow le plus complexe comme base
        largest_workflow = max(self.workflows.items(), key=lambda x: len(x[1]))
        base_workflow_name, base_workflow = largest_workflow
        
        print(f"📄 Workflow de base: {base_workflow_name}")
        print(f"   Nodes: {len(base_workflow)}")
        
        # Créer un workflow optimisé pour nos prompts corrompus
        optimal_workflow = {
            "base_workflow": base_workflow_name,
            "optimizations": [
                "GPU-only mode pour RTX 2070",
                "Prompts corrompus intégrés",
                "Paramètres haute qualité",
                "Support styles gothiques/dark art"
            ],
            "recommended_settings": {
                "resolution": "1024x1024",
                "steps": 30,
                "cfg": 7.5,
                "sampler": "DPM++ 2M Karras"
            }
        }
        
        return optimal_workflow, base_workflow
    
    def run_complete_analysis(self):
        """Exécuter l'analyse complète"""
        print("🔮 ANALYSE COMPLÈTE DES WORKFLOWS COMFYUI")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Charger les workflows
        self.load_workflows()
        
        if not self.workflows:
            print("❌ Aucun workflow trouvé")
            return None
        
        # Analyses
        node_types, all_node_types = self.analyze_node_types()
        models_used = self.analyze_models_used()
        prompt_analysis = self.analyze_prompts_and_settings()
        similarities = self.find_similarities()
        optimal_workflow, base_workflow = self.generate_optimal_workflow()
        
        # Résultats complets
        complete_analysis = {
            'workflows_count': len(self.workflows),
            'node_types': dict(all_node_types),
            'models_used': dict(models_used),
            'prompt_analysis': prompt_analysis,
            'similarities': dict(similarities),
            'optimal_workflow': optimal_workflow,
            'base_workflow': base_workflow
        }
        
        # Sauvegarder l'analyse
        with open('workflow_analysis_results.json', 'w', encoding='utf-8') as f:
            json.dump(complete_analysis, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Analyse complète sauvée: workflow_analysis_results.json")
        
        return complete_analysis

def main():
    analyzer = WorkflowAnalyzer()
    results = analyzer.run_complete_analysis()
    
    if results:
        print("\n✅ ANALYSE TERMINÉE - WORKFLOWS PRÊTS POUR L'INFESTATION ! 🔥⛧")

if __name__ == "__main__":
    main()
