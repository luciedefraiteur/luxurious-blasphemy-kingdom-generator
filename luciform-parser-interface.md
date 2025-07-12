# Luciform Parser Interface: `@lurkuitae/luciform-ai-parser`

## Purpose

The `@lurkuitae/luciform-ai-parser` package is responsible for transforming the raw string content of a `.luciform` file into a structured `LuciformDocument` object. Its key feature is its ability to intelligently handle ambiguous or unrecognized syntax by delegating to an AI assistant.

## Main Interface

```typescript
export function parseLuciformDocument(
  luciformContent: string,
  logRitual: (message: string, logFileName?: string) => Promise<void>,
  logFileName?: string
): LuciformDocument
```

*   `luciformContent`: The raw string content of the `.luciform` file.
*   `logRitual`: A logging function to record parsing events and errors.
*   `logFileName`: Optional. The name of the log file.
*   **Returns**: A `LuciformDocument` object, representing the parsed structure of the luciform.

## Internal Logic & AI Delegation

The parser employs a multi-stage parsing strategy:

1.  **JSON Parsing**: Attempts to parse the entire content as a JSON object (for structured spell files).
2.  **Text-Based PAS Parsing**: If not JSON, it falls back to parsing the document into `PasNode`s based on `---PAS---` separators.
3.  **Action Block Parsing**: For each `PasNode`, it attempts to parse the `[Action]` block:
    *   **JSON Operation**: Tries to interpret the action as a structured JSON `Operation`.
    *   **Known Keywords**: Checks for specific keywords (e.g., `promenade:`).
    *   **Legacy Commands**: Supports older `§` prefixed commands.
4.  **AI Delegation (`AIHelpRequestActionNode`)**: If all standard parsing strategies fail for an action block, the parser does *not* throw an error. Instead, it generates a special `AIHelpRequestActionNode`. This node encapsulates the raw, unparseable content and a reason for the parsing failure. This `AIHelpRequestActionNode` is then passed down to the executor, which will, in turn, invoke the AI interface to resolve the ambiguity.

## Key Components

*   `tokenizer.ts`: Breaks down the raw luciform content into a stream of `Token`s.
*   `types.ts`: Defines the `TokenType` enum and `Token` interface specific to this parser.
*   `parser.ts`: Contains the core parsing logic, including the `parseLuciformDocument` function and the AI delegation mechanism.

## Relationship to `@lurkuitae/luciform-types`

This parser relies heavily on the shared type definitions from `@lurkuitae/luciform-types` for `LuciformDocument`, `Operation`, `ActionNode`, and `AIHelpRequestActionNode`.
