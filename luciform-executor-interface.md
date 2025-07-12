# Luciform Executor Interface: `@lurkuitae/luciform-executor`

## Purpose

The `@lurkuitae/luciform-executor` package is responsible for taking a parsed `LuciformDocument` and executing the operations defined within it. It acts as the "Conductor" of the ritual, translating structured actions into system commands or other effects.

## Main Interface

```typescript
export async function executeLuciform(
  document: LuciformDocument,
  logRitual: (message: string, logFileName?: string) => Promise<void>,
  getAIHelp: (rawContent: string, reason: string) => Promise<ActionNode>,
  logFileName?: string
): Promise<void>
```

*   `document`: The `LuciformDocument` object, typically received from the `luciform-ai-parser`.
*   `logRitual`: A logging function to record execution progress and outcomes.
*   `getAIHelp`: A function (from `@lurkuitae/luciform-ai-interface`) to call when an `AIHelpRequestActionNode` is encountered.
*   `logFileName`: Optional. The name of the log file.

## Internal Logic

*   **Iterates through PAS Nodes**: Processes each step (`PasNode`) in the `LuciformDocument`.
*   **Handles `AIHelpRequestActionNode`**: If a step's action is an `AIHelpRequestActionNode`, it calls the provided `getAIHelp` function to resolve the ambiguity before attempting execution.
*   **Dispatches Operations**: Based on the `type` of the `Operation` (e.g., `shell_command`, `create_file`, `message`), it dispatches to the appropriate internal handler.

## Key Components

*   `index.ts`: Contains the main `executeLuciform` function and the dispatch logic.
*   `batch_editor.ts`: (Planned) Handles batch operations like file modifications.
*   `llm_interface.ts`: (Planned) Direct LLM interaction for specific execution needs.
*   `llm_oracle.ts`: (Planned) Provides LLM-based interpretation for operations.

## Current State & Notes

*   The executor currently has placeholder implementations for `shell_command`, `create_file`, and `message` operations.
*   It correctly integrates with the `AIHelpRequestActionNode` by calling the `getAIHelp` function passed to it.
*   Further development will involve implementing the full logic for each `Operation` type and integrating with system-level commands.
