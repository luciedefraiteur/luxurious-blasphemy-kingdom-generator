# Ritual Phase 3: Enactment - Executor Details (`@lurkuitae/luciform-executor`)

## Purpose

This document provides a deeper look into the `@lurkuitae/luciform-executor` package, the core component responsible for executing the structured operations defined within a `LuciformDocument`.

## Key Function: `executeLuciform`

```typescript
export async function executeLuciform(
  document: LuciformDocument,
  logRitual: (message: string, logFileName?: string) => Promise<void>,
  getAIHelp: (rawContent: string, reason: string) => Promise<ActionNode>, // Passed from Navigator
  logFileName?: string
): Promise<void>
```

*   **`document`**: The `LuciformDocument` to be executed. This document is expected to have been processed by the parser, and potentially by the AI interface to resolve ambiguities.
*   **`logRitual`**: A logging utility function, passed down from the `Codex Lurkuitae Navigator`, used to record the progress and outcomes of the execution.
*   **`getAIHelp`**: A crucial callback function. When the executor encounters an `AIHelpRequestActionNode`, it invokes this function (which is provided by the `@lurkuitae/luciform-ai-interface`) to get an AI-interpreted `ActionNode`.
*   **`logFileName`**: Optional. Specifies the log file for ritual events.

## Internal Workflow

The `executeLuciform` function orchestrates the execution of the ritual step-by-step:

1.  **Iterate PAS Nodes**: It loops through each `PasNode` in the `document.pas` array.
2.  **Resolve AI Help Requests**: For each `PasNode`, it first checks if its `action` is an `AIHelpRequestActionNode`.
    *   If it is, the `getAIHelp` function is called with the `rawContent` and `reason` from the request.
    *   The result (an `ActionNode` interpreted by the AI) replaces the `AIHelpRequestActionNode`.
    *   This ensures that even initially ambiguous parts of the Luciform are resolved into executable operations before proceeding.
3.  **Dispatch Operations**: Once a concrete `ActionNode` is available (either directly from parsing or after AI resolution), the executor uses a `switch` statement (or a similar dispatch mechanism) to call the appropriate handler function based on the `ActionNode.type`.

## Operation Handlers (`executeOperation` and others)

Internal to the executor, there are dedicated asynchronous functions for each type of `Operation`:

```typescript
async function executeOperation(operation: Operation, logRitual: (message: string, logFileName?: string) => Promise<void>, logFileName?: string): Promise<void>
```

This function acts as a central dispatcher for various `Operation` types:

*   **`shell_command`**: (Placeholder) Will execute a shell command using Node.js's `child_process` module. This involves handling `stdout`, `stderr`, and exit codes.
*   **`create_file`**: (Placeholder) Will create a new file at a specified `filePath` with provided `content`. This involves using Node.js's `fs/promises` module.
*   **`message`**: Logs a message to the console and the ritual log. This is a simple, non-interactive operation.
*   **Other Operations**: Future implementations will include handlers for `search_and_replace`, `insert`, `delete`, `append`, `llm_operation`, `ask_question`, `promenade`, and more complex operations like `transmute_file` or `navigate_file`.

## Error Handling

Each operation handler is designed to catch errors during its execution. These errors are logged, and depending on the severity or configuration, might halt the ritual or allow it to continue with a warning.

## Current State & Future Development

*   The `executeLuciform` function correctly iterates through `PasNode`s and dispatches `ActionNode`s.
*   The integration with `getAIHelp` for `AIHelpRequestActionNode` resolution is in place.
*   Current operation handlers (`shell_command`, `create_file`, `message`) are placeholders. The next steps involve implementing their full functionality, including robust error handling and interaction with the underlying system.
*   Integration with `batch_editor.ts` (for file modifications) and `llm_interface.ts` (for direct LLM calls during execution) will be completed in subsequent iterations.