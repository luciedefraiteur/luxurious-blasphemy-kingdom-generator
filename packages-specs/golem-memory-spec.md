# 📦 Package Spec: `golem-memory`
## Système de Mémoire pour Créatures Luciformes

**Inspiration**: `luciform-core/memory_weaver.ts` + `luciform-core/memory.ts`  
**Dépendances**: `luciform-types`, `golem-dna`

---

## 🎯 OBJECTIF

Créer un système de mémoire persistante pour les golems qui leur permet de :
- Se souvenir de leurs expériences passées
- Comprendre le contexte de leur environnement de travail
- Évoluer basé sur l'apprentissage
- Partager des souvenirs avec d'autres golems

---

## 📁 STRUCTURE DU PACKAGE

```
packages/golem-memory/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                    # Point d'entrée principal
│   ├── types/
│   │   ├── memory-types.ts         # Types mémoire
│   │   └── experience-types.ts     # Types expériences
│   ├── core/
│   │   ├── persistent-memory.ts    # Mémoire persistante
│   │   ├── working-memory.ts       # Mémoire de travail
│   │   └── memory-manager.ts       # Gestionnaire mémoire
│   ├── context/
│   │   ├── context-awareness.ts    # Conscience contexte
│   │   ├── directory-mapper.ts     # Cartographie répertoires
│   │   └── project-understanding.ts # Compréhension projet
│   ├── learning/
│   │   ├── experience-logger.ts    # Enregistrement expériences
│   │   ├── pattern-recognition.ts  # Reconnaissance motifs
│   │   └── knowledge-evolution.ts  # Évolution connaissances
│   └── sharing/
│       ├── memory-sharing.ts       # Partage mémoire
│       ├── collective-memory.ts    # Mémoire collective
│       └── memory-inheritance.ts   # Héritage mémoire
└── dist/                          # Fichiers compilés
```

---

## 🧠 COMPOSANTS PRINCIPAUX

### **1. Persistent Memory (`persistent-memory.ts`)**
```typescript
export interface GolemMemory {
  id: string;
  golemId: string;
  createdAt: Date;
  lastAccessed: Date;
  
  // Mémoire structurée
  experiences: Experience[];
  learnings: Learning[];
  contexts: ContextMemory[];
  relationships: GolemRelationship[];
  
  // Métadonnées
  memorySize: number;
  compressionLevel: number;
  importance: MemoryImportance;
}

export class PersistentMemory {
  async saveMemory(memory: GolemMemory): Promise<void>
  async loadMemory(golemId: string): Promise<GolemMemory | null>
  async updateMemory(golemId: string, updates: Partial<GolemMemory>): Promise<void>
  async compressOldMemories(golemId: string): Promise<void>
}
```

### **2. Context Awareness (`context-awareness.ts`)**
```typescript
export interface WorkingContext {
  currentDirectory: string;
  projectStructure: ProjectMap;
  recentFiles: FileActivity[];
  gitStatus: GitContext;
  activeTask: TaskContext;
  environmentVariables: Record<string, string>;
}

export class ContextAwareness {
  async scanCurrentContext(): Promise<WorkingContext>
  async updateContext(changes: ContextChange[]): Promise<void>
  async getRelevantContext(task: string): Promise<ContextMemory[]>
  async trackFileChanges(): Promise<FileActivity[]>
}
```

### **3. Experience Logger (`experience-logger.ts`)**
```typescript
export interface Experience {
  id: string;
  timestamp: Date;
  type: ExperienceType;
  action: string;
  context: WorkingContext;
  outcome: ExperienceOutcome;
  learnings: string[];
  emotionalImpact: EmotionalState;
}

export class ExperienceLogger {
  async logExperience(experience: Experience): Promise<void>
  async getExperiences(filter: ExperienceFilter): Promise<Experience[]>
  async analyzePatterns(): Promise<Pattern[]>
  async extractLearnings(experiences: Experience[]): Promise<Learning[]>
}
```

### **4. Memory Sharing (`memory-sharing.ts`)**
```typescript
export interface SharedMemory {
  sourceGolemId: string;
  targetGolemId: string;
  memoryFragment: MemoryFragment;
  shareType: ShareType;
  permissions: SharePermissions;
}

export class MemorySharing {
  async shareMemory(memory: MemoryFragment, targetGolem: string): Promise<void>
  async receiveSharedMemory(sharedMemory: SharedMemory): Promise<void>
  async mergeMemories(memories: MemoryFragment[]): Promise<MemoryFragment>
  async createCollectiveMemory(golemGroup: string[]): Promise<CollectiveMemory>
}
```

---

## 🔗 INTÉGRATION AVEC PACKAGES EXISTANTS

### **Avec `luciform-executor`**
```typescript
// Dans les opérations d'exécution
import { ExperienceLogger } from 'golem-memory';

export async function executeWithMemory(operation: Operation, context: RitualContext) {
  const experience = await executeOperation(operation);
  await ExperienceLogger.logExperience({
    action: operation.type,
    context: context,
    outcome: experience.success ? 'success' : 'failure',
    learnings: experience.insights
  });
}
```

### **Avec `golem-dna`**
```typescript
// Évolution basée sur la mémoire
import { GolemMemory } from 'golem-memory';
import { DNAMutator } from 'golem-dna';

export async function evolveBasedOnMemory(golemId: string) {
  const memory = await GolemMemory.loadMemory(golemId);
  const patterns = await memory.analyzeSuccessPatterns();
  await DNAMutator.mutateBasedOnLearnings(golemId, patterns);
}
```

---

## 📊 TYPES DE DONNÉES

### **Memory Types (`memory-types.ts`)**
```typescript
export enum MemoryImportance {
  CRITICAL = 'critical',
  HIGH = 'high', 
  MEDIUM = 'medium',
  LOW = 'low',
  EPHEMERAL = 'ephemeral'
}

export enum ExperienceType {
  TASK_EXECUTION = 'task_execution',
  COMMUNICATION = 'communication',
  LEARNING = 'learning',
  ERROR_HANDLING = 'error_handling',
  COLLABORATION = 'collaboration'
}

export interface MemoryFragment {
  id: string;
  content: any;
  type: MemoryType;
  importance: MemoryImportance;
  tags: string[];
  relatedMemories: string[];
}
```

---

## 🚀 FONCTIONNALITÉS AVANCÉES

### **1. Compression Intelligente**
- Compresser les vieux souvenirs moins importants
- Garder les patterns importants
- Optimiser l'espace mémoire

### **2. Recherche Sémantique**
- Rechercher dans les souvenirs par contexte
- Trouver des expériences similaires
- Recommandations basées sur l'historique

### **3. Mémoire Émotionnelle**
- Associer des états émotionnels aux expériences
- Influencer les décisions futures
- Créer des préférences personnalisées

### **4. Héritage Mémoire**
- Transmettre des souvenirs aux golems descendants
- Créer une lignée de connaissances
- Évolution culturelle des golems

---

## 📋 PACKAGE.JSON

```json
{
  "name": "golem-memory",
  "version": "0.1.0",
  "description": "Système de mémoire persistante pour créatures luciformes",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "luciform-types": "workspace:*",
    "golem-dna": "workspace:*",
    "sqlite3": "^5.1.6",
    "node-nlp": "^4.27.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

---

**🎯 Objectif**: Donner aux golems une vraie mémoire qui leur permet d'apprendre, de grandir et de devenir plus intelligents avec le temps, comme de vraies créatures vivantes.
