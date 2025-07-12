# AI Interface: `@lurkuitae/luciform-ai-interface`

## Purpose

The `@lurkuitae/luciform-ai-interface` package provides a standardized way for the Luciform system to interact with Large Language Models (LLMs). Its primary function is to take raw, unparseable content (identified by the parser as an `AIHelpRequestActionNode`) and query an LLM to interpret it into a structured, executable `Operation`.

## Main Interface

```typescript
export async function getAIHelp(
  rawContent: string,
  reason: string
): Promise<ActionNode>
```

*   `rawContent`: The raw string content that the parser failed to understand.
*   `reason`: A brief explanation from the parser about why it couldn't process the `rawContent`.
*   **Returns**: A `Promise` that resolves to an `ActionNode`. In a fully implemented system, this `ActionNode` would typically be a `JsonActionNode` containing a valid `Operation` interpreted by the AI. For now, it returns a mocked `message` action.

## Internal Logic (Planned)

1.  **Prompt Construction**: The `getAIHelp` function will construct a detailed prompt for the LLM. This prompt will include:
    *   The `rawContent` that needs interpretation.
    *   The `reason` for the parsing failure.
    *   Contextual information from the `RitualContext` (e.g., previous steps, current state).
    *   A clear instruction to the LLM to output a valid JSON `Operation` from a predefined set of types (e.g., `create_file`, `shell_command`, `message`, `promenade`).
2.  **LLM Invocation**: It will call an underlying LLM service (e.g., OpenAI, Gemini, local Ollama models) with the constructed prompt.
3.  **Response Validation & Parsing**: The LLM's response (expected to be a JSON string) will be validated and parsed into an `Operation` object.
4.  **Error Handling**: If the LLM fails to provide a valid `Operation` (e.g., returns malformed JSON, or an irrelevant response), the `getAIHelp` function should return a fallback `ActionNode` (e.g., a `message` indicating AI failure, or another `AIHelpRequestActionNode` with a more specific reason).

## Current State & Notes

*   Currently, the `getAIHelp` function provides a mocked response, returning a simple `message` action. This allows the build process to complete and the overall architecture to be tested without requiring live LLM integration.
*   The actual LLM integration logic will be implemented in a future iteration, replacing the mocked response.
*   This module is designed to be the bridge between the deterministic parsing logic and the flexible, interpretive capabilities of an LLM.
