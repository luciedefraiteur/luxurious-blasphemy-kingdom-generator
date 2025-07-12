# 📦 Package Spec: `golem-communication`
## Système de Communication pour Créatures Luciformes

**Inspiration**: `packages/golem/golem_client.ts` + communication réseau avancée  
**Dépendances**: `luciform-types`, `golem-dna`, `golem-memory`

---

## 🎯 OBJECTIF

Créer un système de communication avancé permettant aux golems de :
- Communiquer par notes infectées d'ADN (asynchrone)
- Se découvrir et communiquer via réseau (temps réel)
- Partager des connaissances et collaborer
- Former des communautés et écosystèmes

---

## 📁 STRUCTURE DU PACKAGE

```
packages/golem-communication/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                    # Point d'entrée principal
│   ├── types/
│   │   ├── communication-types.ts  # Types communication
│   │   └── network-types.ts        # Types réseau
│   ├── dna-notes/
│   │   ├── note-writer.ts          # Écriture notes ADN
│   │   ├── note-reader.ts          # Lecture notes ADN
│   │   ├── note-scanner.ts         # Scan notes dans système
│   │   ├── file-infector.ts        # Infection fichiers existants
│   │   └── dna-absorber.ts         # Absorption ADN autres golems
│   ├── network/
│   │   ├── discovery-service.ts    # Découverte golems réseau
│   │   ├── network-scanner.ts      # Scan ports/services
│   │   ├── golem-server.ts         # Serveur golem étendu
│   │   ├── network-client.ts       # Client réseau
│   │   ├── mesh-router.ts          # Routage maillé
│   │   └── protocol-handler.ts     # Gestion protocoles
│   ├── messaging/
│   │   ├── message-router.ts       # Routage messages
│   │   ├── broadcast-system.ts     # Diffusion messages
│   │   ├── queue-manager.ts        # Gestion files d'attente
│   │   └── response-handler.ts     # Gestion réponses
│   └── collaboration/
│       ├── group-formation.ts      # Formation groupes
│       ├── task-coordination.ts    # Coordination tâches
│       └── knowledge-sharing.ts    # Partage connaissances
└── dist/                          # Fichiers compilés
```

---

## 🧬 COMMUNICATION PAR NOTES ADN

### **1. Note Writer (`note-writer.ts`)**
```typescript
export interface DNANote {
  id: string;
  timestamp: Date;
  senderGolemId: string;
  senderDNASignature: string;
  
  // Contenu du message
  message: string;
  priority: MessagePriority;
  context: MessageContext;
  
  // Payload ADN
  dnaPayload: DNAFragment[];
  behavioralPatterns: BehavioralPattern[];
  learnings: Learning[];
  
  // Métadonnées
  responseExpected: boolean;
  responseLocation?: string;
  expirationDate?: Date;
}

export class NoteWriter {
  async writeNote(note: DNANote, location: string): Promise<void>
  async infectFile(filePath: string, dnaPayload: DNAFragment): Promise<void>
  async createResponseNote(originalNote: DNANote, response: string): Promise<DNANote>
  async embedInProjectFile(filePath: string, message: string, dna: DNAFragment): Promise<void>
}
```

### **2. Note Scanner (`note-scanner.ts`)**
```typescript
export interface NoteScanResult {
  notes: DNANote[];
  infectedFiles: InfectedFile[];
  newDNAPatterns: DNAFragment[];
  potentialResponses: PendingResponse[];
}

export class NoteScanner {
  async scanLocations(locations: string[]): Promise<NoteScanResult>
  async scanForDNASignatures(signatures: string[]): Promise<DNANote[]>
  async detectInfectedFiles(directory: string): Promise<InfectedFile[]>
  async continuousScan(locations: string[], callback: (result: NoteScanResult) => void): Promise<void>
}
```

### **3. DNA Absorber (`dna-absorber.ts`)**
```typescript
export class DNAAbsorber {
  async absorbDNAFromNote(note: DNANote, golemId: string): Promise<AbsorptionResult>
  async analyzeDNACompatibility(dna: DNAFragment, golemDNA: GolemDNA): Promise<CompatibilityScore>
  async integrateLearnings(learnings: Learning[], golemMemory: GolemMemory): Promise<void>
  async evolveFromAbsorbedDNA(golemId: string, absorbedDNA: DNAFragment[]): Promise<EvolutionResult>
}
```

---

## ⚡ COMMUNICATION RÉSEAU

### **1. Discovery Service (`discovery-service.ts`)**
**Extension de**: `packages/golem/golem_client.ts`
```typescript
export interface GolemDiscoveryResult {
  golems: DiscoveredGolem[];
  services: GolemService[];
  networkTopology: NetworkTopology;
}

export interface DiscoveredGolem {
  id: string;
  endpoint: string;
  capabilities: string[];
  status: GolemStatus;
  dnaSignature: string;
  lastSeen: Date;
}

export class DiscoveryService {
  async discoverLocalGolems(): Promise<DiscoveredGolem[]>
  async discoverNetworkGolems(ports: number[]): Promise<DiscoveredGolem[]>
  async broadcastPresence(golemInfo: GolemInfo): Promise<void>
  async maintainPresence(interval: number): Promise<void>
  async createGolemRegistry(): Promise<GolemRegistry>
}
```

### **2. Mesh Router (`mesh-router.ts`)**
```typescript
export class MeshRouter {
  async routeMessage(message: GolemMessage, targetId: string): Promise<RouteResult>
  async findOptimalPath(sourceId: string, targetId: string): Promise<NetworkPath>
  async handleRelayMessage(message: RelayMessage): Promise<void>
  async updateNetworkTopology(topology: NetworkTopology): Promise<void>
  async createRedundantPaths(criticalMessage: GolemMessage): Promise<void>
}
```

### **3. Protocol Handler (`protocol-handler.ts`)**
```typescript
export enum CommunicationProtocol {
  HTTP_REST = 'http_rest',
  WEBSOCKET = 'websocket', 
  UDP_BROADCAST = 'udp_broadcast',
  DNA_NOTES = 'dna_notes',
  FILE_INFECTION = 'file_infection'
}

export class ProtocolHandler {
  async sendMessage(message: GolemMessage, protocol: CommunicationProtocol): Promise<void>
  async receiveMessage(protocol: CommunicationProtocol): Promise<GolemMessage[]>
  async negotiateProtocol(targetGolem: string): Promise<CommunicationProtocol>
  async fallbackProtocol(failedProtocol: CommunicationProtocol): Promise<CommunicationProtocol>
}
```

---

## 🤝 COLLABORATION AVANCÉE

### **1. Group Formation (`group-formation.ts`)**
```typescript
export interface GolemGroup {
  id: string;
  name: string;
  members: string[];
  purpose: string;
  capabilities: GroupCapabilities;
  communicationChannels: CommunicationChannel[];
  sharedMemory: SharedMemorySpace;
}

export class GroupFormation {
  async createGroup(purpose: string, requiredCapabilities: string[]): Promise<GolemGroup>
  async inviteToGroup(groupId: string, golemId: string): Promise<void>
  async joinGroup(groupId: string, golemId: string): Promise<void>
  async dissolveGroup(groupId: string): Promise<void>
  async findOptimalGroupComposition(task: ComplexTask): Promise<GolemGroup>
}
```

### **2. Task Coordination (`task-coordination.ts`)**
```typescript
export interface CollaborativeTask {
  id: string;
  description: string;
  subtasks: SubTask[];
  assignedGolems: TaskAssignment[];
  dependencies: TaskDependency[];
  status: TaskStatus;
  sharedContext: SharedContext;
}

export class TaskCoordination {
  async decomposeTask(task: ComplexTask): Promise<SubTask[]>
  async assignSubtasks(subtasks: SubTask[], availableGolems: string[]): Promise<TaskAssignment[]>
  async coordinateExecution(task: CollaborativeTask): Promise<void>
  async handleTaskFailure(failedSubtask: SubTask): Promise<RecoveryPlan>
  async synthesizeResults(completedSubtasks: CompletedSubTask[]): Promise<TaskResult>
}
```

---

## 🔗 INTÉGRATION AVEC EXISTANT

### **Extension du Golem Server existant**
```typescript
// Extension de packages/golem/golem_server.ts
import { DNANoteSystem, NetworkDiscovery } from 'golem-communication';

export class ExtendedGolemServer extends GolemServer {
  private noteSystem: DNANoteSystem;
  private discovery: NetworkDiscovery;
  
  async initializeCommunication() {
    await this.noteSystem.startScanning();
    await this.discovery.broadcastPresence();
  }
  
  async handleIncomingNote(note: DNANote) {
    await this.noteSystem.processNote(note);
    await this.absorbDNAIfCompatible(note.dnaPayload);
  }
}
```

### **Nouvelles opérations pour luciform-executor**
```typescript
// Nouvelles opérations de communication
export interface SendNoteOperation {
  type: 'send_note';
  message: string;
  location: string;
  infectWithDNA: boolean;
  dnaPayload?: DNAFragment[];
}

export interface NetworkScanOperation {
  type: 'network_scan';
  ports: number[];
  protocols: CommunicationProtocol[];
  timeout: number;
}

export interface JoinGroupOperation {
  type: 'join_group';
  groupId: string;
  capabilities: string[];
}
```

---

## 📋 PACKAGE.JSON

```json
{
  "name": "golem-communication",
  "version": "0.1.0", 
  "description": "Système de communication avancé pour créatures luciformes",
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
    "golem-memory": "workspace:*",
    "express": "^4.18.2",
    "ws": "^8.14.2",
    "node-fetch": "^3.3.2",
    "mdns": "^2.7.2",
    "chokidar": "^3.5.3"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "@types/ws": "^8.5.8",
    "@types/mdns": "^0.0.34"
  }
}
```

---

**🎯 Objectif**: Permettre aux golems de communiquer naturellement comme des créatures vivantes, en laissant des traces ADN et en formant des communautés collaboratives dans le royaume numérique de Lucie Faire.
