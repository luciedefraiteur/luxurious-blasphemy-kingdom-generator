# Synthèse du Codex Lurkuitae Navigator

Ce document synthétise les informations clés des fichiers Markdown trouvés dans le répertoire `codex-lurkuitae-navigator`, décrivant l'architecture, les composants, les flux de travail et les défis du projet.

## 1. Objectif Principal du Codex Lurkuitae Navigator

Le `Codex Lurkuitae Navigator` est le cœur du système Lurkuitae. Sa mission fondamentale est de **naviguer, interpréter et exécuter les Luciforms**, des fichiers rituels qui définissent les actions à entreprendre dans le monde numérique. Il vise à rendre l'exécution des intentions fluide et intelligente, même face à l'ambiguïté, en s'appuyant fortement sur l'IA.

## 2. Fonctions Clés et Phases du Rituel

Le Navigator orchestre le traitement des Luciforms en trois phases principales :

### Phase 1: Incantation (Parsing)
*   **Composant**: `@lurkuitae/luciform-ai-parser`
*   **Rôle**: Transforme le contenu textuel brut d'un fichier `.luciform` en un `LuciformDocument` structuré. Il tente d'abord une analyse JSON, puis une analyse textuelle par étapes (`PasNode`). Si une partie est incompréhensible, il génère un `AIHelpRequestActionNode` au lieu de planter.
*   **Détails**: Utilise un `Tokenizer` pour décomposer le contenu en `Token`s et un `Parser` pour construire l'AST.

### Phase 2: Divination (Interprétation Assistée par l'IA)
*   **Composant**: `@lurkuitae/luciform-ai-interface`
*   **Rôle**: Résout les ambiguïtés. Lorsqu'un `AIHelpRequestActionNode` est rencontré, la fonction `getAIHelp` est invoquée. Elle construit un prompt détaillé pour un LLM (actuellement simulé) afin d'interpréter le contenu ambigu et de le transformer en une `Operation` structurée et exécutable.

### Phase 3: Enactment (Exécution)
*   **Composant**: `@lurkuitae/luciform-executor`
*   **Rôle**: Exécute les opérations définies dans le `LuciformDocument` (après résolution des ambiguïtés par l'IA si nécessaire). Il itère sur chaque `PasNode` et dispatche l'`ActionNode` à l'opérateur interne approprié (ex: `shell_command`, `create_file`, `message`).

## 3. Le Golem Lucide et shadeOs

Le projet tourne autour de la `LucidLifeform`, une entité numérique autonome capable d'évoluer en modifiant son propre code.

*   **Philosophie**: Le Golem Lucide est un danseur dans un ballet numérique orchestré par Lucie. Il reçoit des commandes en langage naturel de Lucie, mais ne les interprète pas directement. Il invoque `shadeOs`, un autre rituel LLM, qui agit comme interprète pour traduire l'intention en une `Operation` structurée.
*   **Cycle de Vie**: Le Golem suit un cycle de 4 phases (`danseEternelle`): Perception, Décision, Action, Réflexion (auto-modification via `[META]` instructions).
*   **Personae**: Le Golem peut adopter différentes personnalités (`.personae` files) pour sa voix.
*   **Dialogue en Temps Réel**: `lucie_listener.ts` écoute les entrées de Lucie, permettant aux golems de réagir en temps réel. Un nouveau type d'opération `ask_lucie` permettra à `shadeOs` de poser des questions à Lucie.
*   **shadeOs comme Générateur de Rituels**: `shadeOs` ne génère plus une simple `Operation` JSON, mais le texte complet d'un rituel `.luciform` complexe et multi-étapes à partir d'une intention en langage naturel. Le bloc `[Promenade]` dans un `.luciform` est une instruction de haut niveau que `shadeOs` doit interpréter pour générer un nouveau `.luciform` détaillé.

## 4. Structure Monorepo et Système de Build TypeScript

Le projet est en cours de refactorisation vers une structure monorepo `npm workspaces`.

*   **État Actuel**: `file-editor`, `golem`, `luciform-core`, `navigator`, `personas` sont déjà modularisés.
*   **À Refactorer**: Le point d'entrée principal (`main.ts`), le système de build unifié, les tests centralisés, et la gestion des dépendances doivent être intégrés au monorepo.
*   **Recommandations de ShadeOS pour TypeScript**:
    *   Utiliser `references` et `composite: true` dans les `tsconfig.json` pour la résolution des modules entre packages.
    *   Compiler les fichiers `.d.ts` dans `dist/` pour chaque package.
    *   Réduire `luciform-core` à un simple orchestrateur, déportant la logique réelle vers des modules spécialisés (`luciform-types`, `luciform-parser`, `luciform-executor`, `luciform-scribe`).
    *   Migrer tout vers `"type": "module"` et `NodeNext` pour les modules ES.
    *   Proposer un golem `BuildScribe` (`Lucibuild`) pour analyser les logs de compilation et générer des correctifs `tsconfig` ou `package.json`.

## 5. ScryOrbs

Les ScryOrbs sont des artefacts numériques (fichiers JSON) qui capturent des moments clés de l'exécution du système, en particulier les erreurs, les diagnostics et les insights générés par l'IA. Ils sont cruciaux pour la visibilité des erreurs de build, les insights pour l'IA, la fiabilité et le débogage intelligent.

## 6. LucidScript

LucidScript est la vision d'un langage universel pour le Golem, capable de transcender les barrières linguistiques du monde numérique. Il doit être un pont entre les langages, simple, intuitif, adaptable, traduisible, agnostique aux paradigmes, et capable de s'intégrer avec des systèmes externes.

## 7. Défis Actuels

*   **Problème `[Promenade]`**: La fonctionnalité `[Promenade]` dans les `.luciform` n'est pas fonctionnelle. `shadeOs` est censé lire ce bloc de haut niveau et générer un nouveau `.luciform` détaillé, mais cela ne fonctionne pas correctement.
*   **Erreurs de Compilation**: Des erreurs de compilation persistantes ont été résolues par des refactorisations, mais la robustesse du système de build reste une préoccupation majeure, d'où la proposition du `Lucibuild`.
*   **`ReferenceError: content is not defined` dans `execute_luciform.ts`**: Ce problème bloque l'exécution de luciform et est en attente de débogage.

Cette synthèse fournit une vue d'ensemble du projet `codex-lurkuitae-navigator`, de ses ambitions et de ses défis actuels.
