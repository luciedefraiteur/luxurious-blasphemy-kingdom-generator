# Règle "Anti-Vide" pour les Modifications de Code

Lors de la suppression de blocs de code ou de lignes, il est impératif de **ne jamais remplacer par une chaîne vide**.

**Problème rencontré**:
L'outil de remplacement peut échouer à trouver une correspondance exacte si la chaîne à remplacer contient des retours à la ligne ou une indentation complexe, ou si le remplacement par une chaîne vide altère la structure du fichier de manière inattendue, entraînant des erreurs de formatage ou de compilation.

**Solution**:
Remplacez toujours le code à supprimer par un commentaire approprié. Cela permet de maintenir la structure du fichier, d'éviter les problèmes de formatage et de laisser une trace claire de la modification.

**Exemples**:
- Pour une ligne de code: `// Ancienne ligne de code supprimée: someFunction();`
- Pour un bloc de code: `/*
   Ancien bloc de code supprimé:
   if (condition) {
     doSomething();
   }
*/`

Cette approche garantit une plus grande robustesse et clarté lors des modifications du code.