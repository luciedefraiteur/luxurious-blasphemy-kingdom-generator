#!/usr/bin/env rust-script
//! ```cargo
//! [dependencies]
//! tokio = { version = "1.0", features = ["full"] }
//! anyhow = "1.0"
//! ```

// 🧪 Test isolé pour diagnostiquer Gemini CLI
// Par LUCIFER MORNINGSTAR ⛧

use std::process::{Command, Stdio};
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader, BufWriter};
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    println!("🧪 TEST GEMINI CLI - Diagnostic isolé");
    println!("═══════════════════════════════════════");
    
    // Test 1: Vérifier que gemini existe
    println!("\n🔍 Test 1: Vérification existence de 'gemini'");
    match Command::new("which").arg("gemini").output() {
        Ok(output) => {
            if output.status.success() {
                let path = String::from_utf8_lossy(&output.stdout);
                println!("✅ Gemini trouvé: {}", path.trim());
            } else {
                println!("❌ Gemini non trouvé dans PATH");
                return Ok(());
            }
        }
        Err(e) => {
            println!("❌ Erreur vérification: {}", e);
            return Ok(());
        }
    }
    
    // Test 2: Lancer gemini et tester communication
    println!("\n🗣️ Test 2: Communication avec Gemini CLI");
    
    let mut child = Command::new("gemini")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;
    
    let stdin = child.stdin.take().unwrap();
    let stdout = child.stdout.take().unwrap();
    
    let mut writer = BufWriter::new(stdin);
    let mut reader = BufReader::new(stdout);
    
    println!("✅ Processus Gemini démarré");
    
    // Test 3: Envoyer un prompt simple
    println!("\n💬 Test 3: Envoi prompt simple");
    let test_prompt = "Dis juste 'Bonjour' en une ligne";
    
    println!("📤 Envoi: {}", test_prompt);
    writer.write_all(test_prompt.as_bytes()).await?;
    writer.write_all(b"\n").await?;
    writer.flush().await?;
    
    // Test 4: Lire la réponse avec timeout
    println!("\n⏰ Test 4: Lecture réponse (timeout 30s)");
    
    let mut response = String::new();
    match tokio::time::timeout(
        tokio::time::Duration::from_secs(30),
        reader.read_line(&mut response)
    ).await {
        Ok(Ok(bytes_read)) => {
            if bytes_read > 0 {
                println!("✅ Réponse reçue ({} bytes): {}", bytes_read, response.trim());
            } else {
                println!("⚠️ Aucun byte lu (EOF?)");
            }
        }
        Ok(Err(e)) => {
            println!("❌ Erreur lecture: {}", e);
        }
        Err(_) => {
            println!("⏰ Timeout après 30s - Gemini ne répond pas");
        }
    }
    
    // Test 5: Vérifier le processus
    println!("\n🔍 Test 5: État du processus");
    match child.try_wait() {
        Ok(Some(status)) => {
            println!("⚠️ Processus terminé avec status: {}", status);
        }
        Ok(None) => {
            println!("✅ Processus encore en vie");
        }
        Err(e) => {
            println!("❌ Erreur vérification processus: {}", e);
        }
    }
    
    // Test 6: Lire stderr pour diagnostics
    println!("\n📋 Test 6: Vérification stderr");
    if let Some(mut stderr) = child.stderr.take() {
        let mut stderr_reader = BufReader::new(stderr);
        let mut error_line = String::new();
        
        match tokio::time::timeout(
            tokio::time::Duration::from_secs(5),
            stderr_reader.read_line(&mut error_line)
        ).await {
            Ok(Ok(bytes)) if bytes > 0 => {
                println!("⚠️ Erreur stderr: {}", error_line.trim());
            }
            _ => {
                println!("✅ Pas d'erreur stderr");
            }
        }
    }
    
    // Nettoyage
    println!("\n🧹 Nettoyage...");
    let _ = child.kill();
    
    println!("\n🎯 DIAGNOSTIC TERMINÉ");
    println!("═══════════════════════════════════════");
    
    Ok(())
}
