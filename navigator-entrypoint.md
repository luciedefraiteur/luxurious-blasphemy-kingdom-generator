# Navigator Entry Point: `codex_lurkuitae_navigator.ts`

## Purpose

The `codex_lurkuitae_navigator.ts` file serves as the high-level entry point and orchestrator for processing `.luciform` files within the `codex-lurkuitae-navigator` system. Its primary role is to:

*   Read the content of a `.luciform` file.
*   Initiate the parsing process using the `luciform-ai-parser`.
*   Trigger the execution of the parsed luciform using the `luciform-executor`.
*   Handle top-level error reporting and logging for the entire luciform processing flow.

## Main Interface

```typescript
export async function codexLurkuitaeNavigator(
  luciformContent: string,
  context: RitualContext,
  logRitual: (message: string, logFileName?: string) => Promise<void>,
  logFileName?: string
): Promise<void>
```

*   `luciformContent`: The raw string content of the `.luciform` file to be processed.
*   `context`: A `RitualContext` object providing environmental and historical data for the ritual.
*   `logRitual`: A logging function to record events during the ritual execution.
*   `logFileName`: Optional. The name of the log file to write to.

## Interactions

This component interacts directly with:

*   **`@lurkuitae/luciform-ai-parser`**: Specifically, it calls `parseLuciformDocument` to convert the raw luciform content into a structured `LuciformDocument`.
*   **`@lurkuitae/luciform-executor`**: It calls `executeLuciform` to run the operations defined in the parsed `LuciformDocument`.
*   **`@lurkuitae/luciform-ai-interface`**: It passes the `getAIHelp` function from this module to the executor, enabling AI-assisted parsing and error handling at a lower level.

## Current State & Notes

*   This file has been refactored to delegate core parsing and execution responsibilities to dedicated packages (`luciform-ai-parser` and `luciform-executor`).
*   It now passes the `getAIHelp` function as a dependency to the executor, promoting better modularity and testability.
*   Error handling is centralized here, catching exceptions from both parsing and execution stages.
