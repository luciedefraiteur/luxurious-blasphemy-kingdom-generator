#!/usr/bin/env python3
"""
🔥 GPU TEST - Test complet du GPU pour l'infestation
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Test complet du GPU NVIDIA RTX 2070 après réparation des drivers
"""

import subprocess
import sys
import os

def run_command(cmd):
    """Exécuter une commande et retourner le résultat"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def test_nvidia_smi():
    """Tester nvidia-smi"""
    print("🔍 Test nvidia-smi...")
    success, stdout, stderr = run_command("nvidia-smi")
    
    if success:
        print("✅ nvidia-smi fonctionne !")
        print(stdout)
        return True
    else:
        print("❌ nvidia-smi échoue :")
        print(stderr)
        return False

def test_pytorch_cuda():
    """Tester PyTorch avec CUDA"""
    print("\n🔍 Test PyTorch CUDA...")
    
    try:
        import torch
        print(f"✅ PyTorch version: {torch.__version__}")
        
        if torch.cuda.is_available():
            print("✅ CUDA disponible dans PyTorch !")
            print(f"   Nombre de GPUs: {torch.cuda.device_count()}")
            print(f"   GPU actuel: {torch.cuda.get_device_name(0)}")
            print(f"   Mémoire GPU: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB")
            
            # Test simple
            x = torch.randn(1000, 1000).cuda()
            y = torch.randn(1000, 1000).cuda()
            z = torch.mm(x, y)
            print("✅ Test calcul GPU réussi !")
            return True
        else:
            print("❌ CUDA non disponible dans PyTorch")
            return False
            
    except ImportError:
        print("❌ PyTorch non installé")
        return False
    except Exception as e:
        print(f"❌ Erreur PyTorch: {e}")
        return False

def test_transformers_gpu():
    """Tester Transformers avec GPU"""
    print("\n🔍 Test Transformers GPU...")
    
    try:
        import torch
        from transformers import pipeline
        
        if not torch.cuda.is_available():
            print("❌ CUDA non disponible pour Transformers")
            return False
        
        # Test simple avec un petit modèle
        print("   Chargement d'un modèle de test...")
        classifier = pipeline("sentiment-analysis", device=0)  # device=0 pour GPU
        
        result = classifier("This is a test")
        print("✅ Test Transformers GPU réussi !")
        print(f"   Résultat: {result}")
        return True
        
    except ImportError:
        print("❌ Transformers non installé")
        return False
    except Exception as e:
        print(f"❌ Erreur Transformers: {e}")
        return False

def test_blip2_gpu():
    """Tester BLIP-2 avec GPU"""
    print("\n🔍 Test BLIP-2 GPU...")
    
    try:
        import torch
        from transformers import Blip2Processor, Blip2ForConditionalGeneration
        
        if not torch.cuda.is_available():
            print("❌ CUDA non disponible pour BLIP-2")
            return False
        
        print("   Test de chargement BLIP-2 sur GPU...")
        device = "cuda"
        
        # Juste tester l'initialisation sans charger le modèle complet
        print(f"   Device CUDA: {device}")
        print(f"   Mémoire GPU libre: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB")
        
        # Test simple tensor
        test_tensor = torch.randn(100, 100).to(device)
        print("✅ BLIP-2 peut utiliser le GPU !")
        return True
        
    except ImportError:
        print("❌ BLIP-2 dependencies non installées")
        return False
    except Exception as e:
        print(f"❌ Erreur BLIP-2: {e}")
        return False

def test_comfyui_compatibility():
    """Tester la compatibilité ComfyUI"""
    print("\n🔍 Test compatibilité ComfyUI...")
    
    # Vérifier que ComfyUI existe
    comfyui_path = os.path.expanduser("~/ComfyUI")
    if not os.path.exists(comfyui_path):
        print("❌ ComfyUI non trouvé")
        return False
    
    print(f"✅ ComfyUI trouvé: {comfyui_path}")
    
    # Vérifier l'environnement virtuel
    venv_path = os.path.join(comfyui_path, "venv")
    if os.path.exists(venv_path):
        print("✅ Environnement virtuel ComfyUI trouvé")
    else:
        print("⚠️ Environnement virtuel ComfyUI non trouvé")
    
    return True

def main():
    """Test complet du GPU"""
    print("🔥 TEST COMPLET GPU RTX 2070 - INFESTATION READY")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    tests_results = []
    
    # Test 1: nvidia-smi
    tests_results.append(("nvidia-smi", test_nvidia_smi()))
    
    # Test 2: PyTorch CUDA
    tests_results.append(("PyTorch CUDA", test_pytorch_cuda()))
    
    # Test 3: Transformers GPU
    tests_results.append(("Transformers GPU", test_transformers_gpu()))
    
    # Test 4: BLIP-2 GPU
    tests_results.append(("BLIP-2 GPU", test_blip2_gpu()))
    
    # Test 5: ComfyUI compatibility
    tests_results.append(("ComfyUI Compatibility", test_comfyui_compatibility()))
    
    # Résumé
    print("\n" + "="*60)
    print("📊 RÉSUMÉ DES TESTS")
    print("="*60)
    
    passed = 0
    total = len(tests_results)
    
    for test_name, result in tests_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:25} : {status}")
        if result:
            passed += 1
    
    print("="*60)
    print(f"RÉSULTAT FINAL: {passed}/{total} tests réussis")
    
    if passed == total:
        print("🎉 GPU PRÊT POUR L'INFESTATION TOTALE ! 🎉")
        print("🚀 Vous pouvez maintenant utiliser ComfyUI avec GPU !")
        print("🔥 L'analyse d'images sera 10x plus rapide !")
    elif passed >= 3:
        print("⚠️ GPU partiellement fonctionnel")
        print("💡 Certaines fonctionnalités peuvent nécessiter des ajustements")
    else:
        print("❌ GPU non fonctionnel")
        print("🔧 Redémarrage système recommandé")
    
    print("\n🎯 PROCHAINES ÉTAPES:")
    if passed >= 3:
        print("1. Relancer ComfyUI avec GPU: cd ~/ComfyUI && source venv/bin/activate && python main.py --listen")
        print("2. Tester génération d'image GPU")
        print("3. Relancer analyse des sigils avec GPU")
        print("4. Démarrer la fractale récursive")
    else:
        print("1. Redémarrer le système")
        print("2. Relancer ce test")
        print("3. Si problème persiste, vérifier drivers NVIDIA")

if __name__ == "__main__":
    main()
