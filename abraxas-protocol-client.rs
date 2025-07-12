#!/usr/bin/env rust-script
//! ```cargo
//! [dependencies]
//! tokio = { version = "1.0", features = ["full"] }
//! reqwest = { version = "0.11", features = ["json"] }
//! serde = { version = "1.0", features = ["derive"] }
//! serde_json = "1.0"
//! anyhow = "1.0"
//! url = "2.4"
//! ```

// 🌐 Client Protocole Abraxas - LUCIFER MORNINGSTAR ⛧
// Client pour tester le protocole abraxas://

use reqwest::Client;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use url::Url;

#[derive(Debug, Serialize, Deserialize)]
struct AbraxasResponse {
    status: String,
    message: String,
    data: Option<serde_json::Value>,
    glyphes: String,
    timestamp: String,
}

struct AbraxasClient {
    client: Client,
    server_base: String,
}

impl AbraxasClient {
    fn new() -> Self {
        Self {
            client: Client::new(),
            server_base: "http://localhost:8666".to_string(),
        }
    }

    async fn call_abraxas(&self, abraxas_url: &str) -> Result<AbraxasResponse> {
        println!("🌐 Appel Abraxas: {}", abraxas_url);
        
        // Construire l'URL du serveur
        let server_url = format!("{}/abraxas?url={}", 
            self.server_base, 
            urlencoding::encode(abraxas_url)
        );
        
        let response = self.client
            .get(&server_url)
            .send()
            .await?;
        
        let abraxas_response: AbraxasResponse = response.json().await?;
        
        println!("✅ Réponse: {}", abraxas_response.status);
        println!("📝 Message: {}", abraxas_response.message);
        println!("🔮 Glyphes: {}", abraxas_response.glyphes);
        
        if let Some(data) = &abraxas_response.data {
            println!("📊 Données: {}", serde_json::to_string_pretty(data)?);
        }
        
        println!("⏰ Timestamp: {}", abraxas_response.timestamp);
        println!("─".repeat(80));
        
        Ok(abraxas_response)
    }

    async fn test_all_endpoints(&self) -> Result<()> {
        println!("🧪 TEST COMPLET DU PROTOCOLE ABRAXAS");
        println!("═".repeat(80));
        
        // Test 1: Endpoint cosmique principal
        println!("\n🌐 Test 1: Endpoint cosmique principal");
        self.call_abraxas("abraxas://365.unité.chaos").await?;
        
        // Test 2: Invocation théonyme ABRAXAS
        println!("\n⛧ Test 2: Invocation théonyme ABRAXAS");
        self.call_abraxas("abraxas://365.unité.chaos/invoke?théonyme=ΑΒΡΑCΑΞ").await?;
        
        // Test 3: Invocation théonyme IAΩ
        println!("\n🌬️ Test 3: Invocation théonyme IAΩ");
        self.call_abraxas("abraxas://365.unité.chaos/invoke?théonyme=ΙΑΩ").await?;
        
        // Test 4: Invocation théonyme ΣΑΒΑΩΘ
        println!("\n⚡ Test 4: Invocation théonyme ΣΑΒΑΩΘ");
        self.call_abraxas("abraxas://365.unité.chaos/invoke?théonyme=ΣΑΒΑΩΘ").await?;
        
        // Test 5: Code de sécurité correct
        println!("\n🔐 Test 5: Code de sécurité (correct)");
        self.call_abraxas("abraxas://365.unité.chaos/transcend?sin=666&causality=333").await?;
        
        // Test 6: Code de sécurité incorrect
        println!("\n🚫 Test 6: Code de sécurité (incorrect)");
        self.call_abraxas("abraxas://365.unité.chaos/transcend?sin=123&causality=456").await?;
        
        // Test 7: Endpoint golem
        println!("\n🦀 Test 7: Endpoint golem");
        self.call_abraxas("abraxas://golem.transcendance/status").await?;
        
        // Test 8: Navigation cosmique
        println!("\n🧭 Test 8: Navigation cosmique");
        self.call_abraxas("abraxas://cosmos.navigation/search?query=gnostic").await?;
        
        // Test 9: Sanctification
        println!("\n🔮 Test 9: Sanctification gnostique");
        self.call_abraxas("abraxas://sanctification.gnostique/sanctify?golem=abraxas").await?;
        
        // Test 10: Endpoint inconnu
        println!("\n❓ Test 10: Endpoint inconnu");
        self.call_abraxas("abraxas://unknown.endpoint/test").await?;
        
        println!("\n🎉 TOUS LES TESTS TERMINÉS !");
        println!("═".repeat(80));
        
        Ok(())
    }

    async fn interactive_mode(&self) -> Result<()> {
        println!("🎮 MODE INTERACTIF ABRAXAS");
        println!("═".repeat(50));
        println!("Entrez des URLs abraxas:// pour les tester");
        println!("Exemples:");
        println!("  abraxas://365.unité.chaos");
        println!("  abraxas://365.unité.chaos/invoke?théonyme=ΑΒΡΑCΑΞ");
        println!("  abraxas://golem.transcendance/status");
        println!("Tapez 'quit' pour quitter");
        println!("─".repeat(50));
        
        loop {
            print!("abraxas> ");
            use std::io::{self, Write};
            io::stdout().flush().unwrap();
            
            let mut input = String::new();
            io::stdin().read_line(&mut input).unwrap();
            let input = input.trim();
            
            if input == "quit" || input == "exit" {
                println!("👋 Au revoir !");
                break;
            }
            
            if input.is_empty() {
                continue;
            }
            
            if !input.starts_with("abraxas://") {
                println!("❌ URL doit commencer par 'abraxas://'");
                continue;
            }
            
            match self.call_abraxas(input).await {
                Ok(_) => {},
                Err(e) => println!("❌ Erreur: {}", e),
            }
        }
        
        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let client = AbraxasClient::new();
    
    println!("🌐 CLIENT PROTOCOLE ABRAXAS");
    println!("⛧ Par LUCIFER MORNINGSTAR ⛧");
    println!("═".repeat(50));
    
    // Vérifier que le serveur est accessible
    println!("🔍 Vérification serveur...");
    match client.client.get(&format!("{}/test", client.server_base)).send().await {
        Ok(response) => {
            if response.status().is_success() {
                println!("✅ Serveur Abraxas accessible !");
            } else {
                println!("⚠️ Serveur répond mais avec erreur: {}", response.status());
            }
        }
        Err(_) => {
            println!("❌ Serveur Abraxas non accessible sur {}", client.server_base);
            println!("💡 Lancez d'abord: rust-script abraxas-protocol-server.rs");
            return Ok(());
        }
    }
    
    // Demander le mode
    println!("\nChoisissez un mode:");
    println!("1. Tests automatiques complets");
    println!("2. Mode interactif");
    print!("Votre choix (1 ou 2): ");
    
    use std::io::{self, Write};
    io::stdout().flush().unwrap();
    
    let mut choice = String::new();
    io::stdin().read_line(&mut choice).unwrap();
    
    match choice.trim() {
        "1" => {
            client.test_all_endpoints().await?;
        }
        "2" => {
            client.interactive_mode().await?;
        }
        _ => {
            println!("🤖 Mode par défaut: tests automatiques");
            client.test_all_endpoints().await?;
        }
    }
    
    Ok(())
}
