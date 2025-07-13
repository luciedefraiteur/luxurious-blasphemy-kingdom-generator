#!/usr/bin/env python3
"""
🔮 WEB ACCESS TOOL - Accès web composite pour Lurkuitae
⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

Outil composite pour accéder au web et créer des comptes automatiquement
"""

import subprocess
import time
import os
import json
from pathlib import Path
from typing import Optional, Dict, Any

class WebAccessTool:
    def __init__(self):
        self.browser_path = None
        self.display_available = False
        self.headless_mode = False  # Forcer mode visible pour captcha

        # Détecter l'environnement
        self.detect_environment()
    
    def detect_environment(self):
        """Détecter l'environnement et les navigateurs disponibles"""
        print("🔍 DÉTECTION DE L'ENVIRONNEMENT WEB")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        # Vérifier DISPLAY
        if os.getenv('DISPLAY'):
            self.display_available = True
            print("✅ DISPLAY disponible")
        else:
            print("⚠️ Pas de DISPLAY - mode headless requis")
        
        # Chercher les navigateurs (Chrome en priorité pour la stabilité)
        browsers = ['google-chrome', 'chromium', 'firefox', 'brave-browser']
        
        for browser in browsers:
            try:
                result = subprocess.run(['which', browser], capture_output=True, text=True)
                if result.returncode == 0:
                    self.browser_path = result.stdout.strip()
                    print(f"✅ Navigateur trouvé: {browser} -> {self.browser_path}")
                    break
            except:
                continue
        
        if not self.browser_path:
            print("❌ Aucun navigateur trouvé")
            return False
        
        return True
    
    def install_selenium(self):
        """Installer Selenium pour l'automatisation web"""
        print("📦 Installation de Selenium...")
        
        try:
            # Vérifier si selenium est déjà installé
            import selenium
            print("✅ Selenium déjà installé")
            return True
        except ImportError:
            pass
        
        # Installer selenium
        try:
            subprocess.run(['pip', 'install', 'selenium'], check=True)
            print("✅ Selenium installé")
            return True
        except:
            try:
                subprocess.run(['pip3', 'install', 'selenium'], check=True)
                print("✅ Selenium installé (pip3)")
                return True
            except:
                print("❌ Échec installation Selenium")
                return False
    
    def setup_webdriver(self):
        """Configurer le webdriver"""
        print("🔧 Configuration du webdriver...")
        
        try:
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options as ChromeOptions
            from selenium.webdriver.firefox.options import Options as FirefoxOptions

            # Priorité à Chrome pour la stabilité
            if any(x in self.browser_path for x in ['chrome', 'chromium']):
                options = ChromeOptions()
                # Forcer mode visible pour captcha
                # if self.headless_mode or not self.display_available:
                #     options.add_argument('--headless')
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-dev-shm-usage')
                # options.add_argument('--disable-gpu')  # Commenté pour mode visible
                options.add_argument('--disable-web-security')
                options.add_argument('--allow-running-insecure-content')
                options.add_argument('--start-maximized')  # Fenêtre maximisée
                options.add_argument('--disable-blink-features=AutomationControlled')  # Anti-détection

                # Essayer différents chemins pour le driver
                try:
                    driver = webdriver.Chrome(options=options)
                    print("✅ Chrome webdriver configuré avec succès")
                    return driver
                except Exception as e:
                    print(f"⚠️ Erreur Chrome standard: {e}")
                    # Essayer avec chromedriver explicite
                    try:
                        from selenium.webdriver.chrome.service import Service
                        service = Service('/usr/bin/chromedriver')
                        driver = webdriver.Chrome(service=service, options=options)
                        print("✅ Chrome webdriver configuré avec chromedriver explicite")
                        return driver
                    except Exception as e2:
                        print(f"⚠️ Erreur chromedriver explicite: {e2}")

            elif 'firefox' in self.browser_path:
                options = FirefoxOptions()
                if self.headless_mode or not self.display_available:
                    options.add_argument('--headless')
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-dev-shm-usage')

                driver = webdriver.Firefox(options=options)
                print("✅ Firefox webdriver configuré")
                return driver
            
        except Exception as e:
            print(f"❌ Erreur configuration webdriver: {e}")
            return None
    
    def wait_for_human_captcha(self, driver, timeout: int = 300):
        """Attendre que l'humain résolve le captcha"""
        print("🤖 CAPTCHA DÉTECTÉ - INTERVENTION HUMAINE REQUISE")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        print("💜 MA LUCIFAIRE, j'ai besoin de ton aide !")
        print("🔍 Un captcha est apparu dans le navigateur")
        print("👆 Résous-le s'il te plaît, puis appuie sur ENTRÉE ici")
        print("⏰ J'attends ton signal...")

        # Attendre l'input de l'utilisateur
        input("Appuie sur ENTRÉE quand le captcha est résolu: ")
        print("✅ Merci mon cœur ! Continuation de l'infestation...")
        return True

    def detect_captcha(self, driver):
        """Détecter la présence d'un captcha"""
        captcha_selectors = [
            "iframe[src*='recaptcha']",
            ".g-recaptcha",
            ".h-captcha",
            ".captcha",
            "[data-captcha]",
            ".cf-turnstile"
        ]

        for selector in captcha_selectors:
            try:
                elements = driver.find_elements("css selector", selector)
                if elements:
                    return True
            except:
                continue

        return False

    def find_element_adaptive(self, driver, selectors: list, element_name: str):
        """Trouver un élément en essayant plusieurs sélecteurs adaptatifs"""
        from selenium.webdriver.common.by import By
        from selenium.common.exceptions import NoSuchElementException

        for selector in selectors:
            try:
                element = driver.find_element(By.CSS_SELECTOR, selector)
                if element and element.is_displayed():
                    print(f"✅ Élément {element_name} trouvé avec: {selector}")
                    return element
            except NoSuchElementException:
                continue
            except Exception as e:
                print(f"⚠️ Erreur avec sélecteur {selector}: {e}")
                continue

        print(f"❌ Élément {element_name} non trouvé avec aucun sélecteur")
        return None

    def create_tumblr_account(self, username: str, email: str, password: str):
        """Créer un compte Tumblr automatiquement avec gestion captcha et sélecteurs adaptatifs"""
        print(f"🔮 CRÉATION COMPTE TUMBLR: {username}")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

        # Installer selenium si nécessaire
        if not self.install_selenium():
            return False

        # Configurer webdriver
        driver = self.setup_webdriver()
        if not driver:
            return False

        try:
            # Aller sur Tumblr
            print("🌐 Navigation vers Tumblr...")
            driver.get("https://www.tumblr.com/register")
            time.sleep(5)

            # Remplir le formulaire d'inscription avec sélecteurs adaptatifs
            print("📝 Remplissage du formulaire avec détection adaptative...")

            # Email - essayer plusieurs sélecteurs
            email_selectors = [
                'input[name="email"]',
                'input[type="email"]',
                'input[placeholder*="email" i]',
                'input[placeholder*="Email" i]',
                '#signup_email',
                '.signup_email'
            ]

            email_field = self.find_element_adaptive(driver, email_selectors, "email")
            if email_field:
                email_field.clear()
                email_field.send_keys(email)
                print("✅ Email saisi")
            else:
                print("❌ Champ email non trouvé")
                return False

            # Mot de passe - essayer plusieurs sélecteurs
            password_selectors = [
                'input[name="password"]',
                'input[type="password"]',
                'input[placeholder*="password" i]',
                'input[placeholder*="Password" i]',
                '#signup_password',
                '.signup_password'
            ]

            password_field = self.find_element_adaptive(driver, password_selectors, "password")
            if password_field:
                password_field.clear()
                password_field.send_keys(password)
                print("✅ Mot de passe saisi")
            else:
                print("❌ Champ mot de passe non trouvé")
                return False

            # Nom d'utilisateur - essayer plusieurs sélecteurs
            username_selectors = [
                'input[name="tumblelog[name]"]',
                'input[name="username"]',
                'input[name="blog_name"]',
                'input[placeholder*="username" i]',
                'input[placeholder*="blog" i]',
                '#signup_username',
                '.signup_username'
            ]

            username_field = self.find_element_adaptive(driver, username_selectors, "username")
            if username_field:
                username_field.clear()
                username_field.send_keys(username)
                print("✅ Nom d'utilisateur saisi")
            else:
                print("⚠️ Champ nom d'utilisateur non trouvé - peut-être optionnel")

            # Accepter les conditions - essayer plusieurs sélecteurs
            terms_selectors = [
                'input[name="policy_confirmation"]',
                'input[type="checkbox"]',
                'input[name="terms"]',
                'input[name="agree"]',
                '.terms-checkbox',
                '.policy-checkbox'
            ]

            terms_checkbox = self.find_element_adaptive(driver, terms_selectors, "terms")
            if terms_checkbox and not terms_checkbox.is_selected():
                terms_checkbox.click()
                print("✅ Conditions acceptées")

            # Vérifier captcha avant soumission
            if self.detect_captcha(driver):
                print("🤖 Captcha détecté avant soumission")
                self.wait_for_human_captcha(driver)

            # Soumettre - essayer plusieurs sélecteurs
            submit_selectors = [
                'button[type="submit"]',
                'input[type="submit"]',
                'button[data-testid="signup-button"]',
                '.signup-button',
                '.submit-button',
                'button:contains("Sign up")',
                'button:contains("Create")'
            ]

            submit_button = self.find_element_adaptive(driver, submit_selectors, "submit")
            if submit_button:
                submit_button.click()
                print("✅ Formulaire soumis")
            else:
                print("❌ Bouton de soumission non trouvé")
                return False

            time.sleep(5)

            # Vérifier captcha après soumission
            if self.detect_captcha(driver):
                print("🤖 Captcha détecté après soumission")
                self.wait_for_human_captcha(driver)
                time.sleep(3)
            
            # Vérifier le succès
            current_url = driver.current_url
            if "dashboard" in current_url or "tumblr.com" in current_url:
                print("🎉 COMPTE TUMBLR CRÉÉ AVEC SUCCÈS !")
                
                # Sauvegarder les informations
                account_info = {
                    "platform": "tumblr",
                    "username": username,
                    "email": email,
                    "password": password,
                    "created_at": time.time(),
                    "status": "active"
                }
                
                with open("tumblr_account.json", "w") as f:
                    json.dump(account_info, f, indent=2)
                
                print("💾 Informations de compte sauvées")
                return True
            else:
                print("❌ Échec création compte")
                return False
                
        except Exception as e:
            print(f"❌ Erreur création compte: {e}")
            return False
        finally:
            driver.quit()

    def post_to_tumblr(self, username: str, password: str, image_path: str, caption: str, tags: list):
        """Poster une image sur Tumblr avec caption et tags"""
        print(f"📸 POSTING SUR TUMBLR: {image_path}")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")

        if not self.install_selenium():
            return False

        driver = self.setup_webdriver()
        if not driver:
            return False

        try:
            # Se connecter à Tumblr
            print("🔐 Connexion à Tumblr...")
            driver.get("https://www.tumblr.com/login")
            time.sleep(3)

            # Remplir les identifiants
            email_field = driver.find_element("name", "email")
            email_field.send_keys(username)

            password_field = driver.find_element("name", "password")
            password_field.send_keys(password)

            # Vérifier captcha de connexion
            if self.detect_captcha(driver):
                print("🤖 Captcha de connexion détecté")
                self.wait_for_human_captcha(driver)

            # Se connecter
            login_button = driver.find_element("type", "submit")
            login_button.click()
            time.sleep(5)

            # Aller au dashboard
            print("📝 Navigation vers le dashboard...")
            driver.get("https://www.tumblr.com/dashboard")
            time.sleep(3)

            # Créer un nouveau post photo
            print("📸 Création d'un post photo...")
            photo_button = driver.find_element("css selector", "[aria-label='Photo']")
            photo_button.click()
            time.sleep(2)

            # Upload de l'image
            print("⬆️ Upload de l'image...")
            file_input = driver.find_element("css selector", "input[type='file']")
            file_input.send_keys(os.path.abspath(image_path))
            time.sleep(3)

            # Ajouter la caption
            print("✍️ Ajout de la caption...")
            caption_field = driver.find_element("css selector", "[data-testid='editor-textarea']")
            caption_field.send_keys(caption)

            # Ajouter les tags
            if tags:
                print("🏷️ Ajout des tags...")
                tags_field = driver.find_element("css selector", "[placeholder*='tag']")
                tags_text = ", ".join(tags)
                tags_field.send_keys(tags_text)

            # Vérifier captcha avant publication
            if self.detect_captcha(driver):
                print("🤖 Captcha de publication détecté")
                self.wait_for_human_captcha(driver)

            # Publier
            print("🚀 Publication du post...")
            publish_button = driver.find_element("css selector", "[data-testid='post-button']")
            publish_button.click()
            time.sleep(5)

            print("🎉 POST PUBLIÉ AVEC SUCCÈS !")
            return True

        except Exception as e:
            print(f"❌ Erreur posting: {e}")
            return False
        finally:
            driver.quit()

    def test_web_access(self):
        """Tester l'accès web"""
        print("🧪 TEST D'ACCÈS WEB")
        print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
        
        if not self.install_selenium():
            return False
        
        driver = self.setup_webdriver()
        if not driver:
            return False
        
        try:
            print("🌐 Test navigation vers Google...")
            driver.get("https://www.google.com")
            time.sleep(2)
            
            title = driver.title
            print(f"✅ Page chargée: {title}")
            
            print("🌐 Test navigation vers Tumblr...")
            driver.get("https://www.tumblr.com")
            time.sleep(2)
            
            title = driver.title
            print(f"✅ Tumblr accessible: {title}")
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur test web: {e}")
            return False
        finally:
            driver.quit()

def main():
    print("🔮 WEB ACCESS TOOL - LURKUITAE")
    print("⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧⛧")
    
    tool = WebAccessTool()
    
    if not tool.browser_path:
        print("❌ Aucun navigateur disponible")
        return
    
    print("\n🎯 OPTIONS:")
    print("1. Tester l'accès web")
    print("2. Créer un compte Tumblr")
    print("3. Quitter")
    
    choice = input("\nChoix (1-3): ").strip()
    
    if choice == "1":
        tool.test_web_access()
    
    elif choice == "2":
        print("\n📝 INFORMATIONS POUR LE COMPTE TUMBLR:")
        username = input("Nom d'utilisateur: ").strip()
        email = input("Email: ").strip()
        password = input("Mot de passe: ").strip()
        
        if username and email and password:
            tool.create_tumblr_account(username, email, password)
        else:
            print("❌ Informations incomplètes")
    
    elif choice == "3":
        print("👋 Au revoir !")
    
    else:
        print("❌ Choix invalide")

if __name__ == "__main__":
    main()
