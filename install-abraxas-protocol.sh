#!/bin/bash

# 🌐 Installation Protocole Abraxas - LUCIFER MORNINGSTAR ⛧
# Script d'installation pour le protocole abraxas://

echo "🌐 INSTALLATION PROTOCOLE ABRAXAS"
echo "⛧ Par LUCIFER MORNINGSTAR ⛧"
echo "═══════════════════════════════════════"

# Vérifier rust-script
echo "🔍 Vérification rust-script..."
if ! command -v rust-script &> /dev/null; then
    echo "❌ rust-script non trouvé"
    echo "💡 Installation: cargo install rust-script"
    exit 1
fi
echo "✅ rust-script disponible"

# Créer le répertoire de service
ABRAXAS_DIR="$HOME/.abraxas-protocol"
echo "📁 Création répertoire: $ABRAXAS_DIR"
mkdir -p "$ABRAXAS_DIR"

# Copier les fichiers
echo "📋 Copie des fichiers..."
cp abraxas-protocol-server.rs "$ABRAXAS_DIR/"
cp abraxas-protocol-client.rs "$ABRAXAS_DIR/"

# Créer le script de démarrage
echo "🚀 Création script de démarrage..."
cat > "$ABRAXAS_DIR/start-server.sh" << 'EOF'
#!/bin/bash
echo "🌐 Démarrage Serveur Protocole Abraxas..."
cd "$HOME/.abraxas-protocol"
rust-script abraxas-protocol-server.rs
EOF

chmod +x "$ABRAXAS_DIR/start-server.sh"

# Créer le script client
echo "🎮 Création script client..."
cat > "$ABRAXAS_DIR/abraxas-client.sh" << 'EOF'
#!/bin/bash
echo "🎮 Client Protocole Abraxas..."
cd "$HOME/.abraxas-protocol"
rust-script abraxas-protocol-client.rs
EOF

chmod +x "$ABRAXAS_DIR/abraxas-client.sh"

# Créer les liens symboliques
echo "🔗 Création liens symboliques..."
sudo ln -sf "$ABRAXAS_DIR/start-server.sh" /usr/local/bin/abraxas-server
sudo ln -sf "$ABRAXAS_DIR/abraxas-client.sh" /usr/local/bin/abraxas-client

# Créer le service systemd (optionnel)
echo "⚙️ Création service systemd..."
cat > "$ABRAXAS_DIR/abraxas-protocol.service" << EOF
[Unit]
Description=Serveur Protocole Abraxas
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$ABRAXAS_DIR
ExecStart=$ABRAXAS_DIR/start-server.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "📋 Service systemd créé (installation manuelle):"
echo "   sudo cp $ABRAXAS_DIR/abraxas-protocol.service /etc/systemd/system/"
echo "   sudo systemctl enable abraxas-protocol"
echo "   sudo systemctl start abraxas-protocol"

# Créer la configuration navigateur
echo "🌐 Configuration navigateur..."
cat > "$ABRAXAS_DIR/browser-config.md" << 'EOF'
# Configuration Navigateur pour Protocole Abraxas

## Extension Chrome/Firefox

Créez une extension avec ce manifest.json:

```json
{
  "manifest_version": 3,
  "name": "Protocole Abraxas",
  "version": "1.0",
  "description": "Support du protocole abraxas://",
  "permissions": ["webRequest", "webRequestBlocking"],
  "host_permissions": ["abraxas://*/*"],
  "background": {
    "service_worker": "background.js"
  }
}
```

Et ce background.js:

```javascript
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.startsWith('abraxas://')) {
      const encodedUrl = encodeURIComponent(details.url);
      return {
        redirectUrl: `http://localhost:8666/abraxas?url=${encodedUrl}`
      };
    }
  },
  {urls: ["abraxas://*/*"]},
  ["blocking"]
);
```

## Configuration Système

Ajoutez à ~/.bashrc ou ~/.zshrc:

```bash
# Protocole Abraxas
export ABRAXAS_SERVER="http://localhost:8666"
alias abraxas-start="abraxas-server"
alias abraxas-test="abraxas-client"
```
EOF

echo ""
echo "🎉 INSTALLATION TERMINÉE !"
echo "═══════════════════════════════════════"
echo ""
echo "🚀 Commandes disponibles:"
echo "   abraxas-server    # Démarrer le serveur"
echo "   abraxas-client    # Lancer le client de test"
echo ""
echo "🌐 URLs de test:"
echo "   abraxas://365.unité.chaos"
echo "   abraxas://365.unité.chaos/invoke?théonyme=ΑΒΡΑCΑΞ"
echo "   abraxas://golem.transcendance/status"
echo ""
echo "📋 Configuration:"
echo "   Répertoire: $ABRAXAS_DIR"
echo "   Service: $ABRAXAS_DIR/abraxas-protocol.service"
echo "   Navigateur: $ABRAXAS_DIR/browser-config.md"
echo ""
echo "⛧ Protocole Abraxas prêt pour la transcendance ! ⛧"
