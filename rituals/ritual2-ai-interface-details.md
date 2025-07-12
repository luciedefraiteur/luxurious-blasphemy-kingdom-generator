# Ritual Phase 2: Divination - AI Interface Details (`@lurkuitae/luciform-ai-interface`)

## Purpose

This document delves into the specifics of the `@lurkuitae/luciform-ai-interface` package, which serves as the bridge between the Luciform system's deterministic logic and the interpretive capabilities of Large Language Models (LLMs).

## Key Function: `getAIHelp`

```typescript
export async function getAIHelp(
  rawContent: string,
  reason: string
): Promise<ActionNode>
```

*   **`rawContent`**: The exact string content from the Luciform's `[Action]` block that the `luciform-ai-parser` could not deterministically interpret.
*   **`reason`**: A concise explanation provided by the parser detailing *why* the `rawContent` was ambiguous (e.g., "JSON parsing failed", "Unknown legacy command"). This is crucial for guiding the AI's interpretation.
*   **Return Value**: A `Promise` that resolves to an `ActionNode`. Ideally, this will be a `JsonActionNode` containing a structured `Operation` that the AI has successfully inferred from the `rawContent` and `reason`. If the AI itself fails to interpret or returns an invalid structure, a fallback `ActionNode` (e.g., a `MessageActionNode` indicating AI failure) is returned.

## Internal Workflow (Planned Implementation)

1.  **Contextual Prompt Engineering**: The `getAIHelp` function will construct a highly specific and contextualized prompt for the LLM. This prompt will include:
    *   The problematic `rawContent`.
    *   The `reason` for the ambiguity.
    *   A clear instruction for the LLM to output a valid JSON object conforming to one of the predefined `Operation` types (e.g., `shell_command`, `create_file`, `message`, `promenade`).
    *   Examples of valid `Operation` JSON structures.
    *   Potentially, relevant `RitualContext` data (e.g., previous steps, current environment) to aid the AI's understanding.

2.  **LLM Invocation**: The constructed prompt is sent to a configured LLM service. This could involve:
    *   API calls to cloud-based LLMs (e.g., OpenAI, Gemini, Anthropic).
    *   Interactions with local LLM instances (e.g., Ollama).

3.  **Response Validation and Parsing**: Upon receiving a response from the LLM, the `getAIHelp` function will:
    *   Extract the relevant text (e.g., by stripping markdown code blocks).
    *   Attempt to parse the extracted text as a JSON object.
    *   Validate that the parsed JSON conforms to a known `Operation` interface.

4.  **Robust Error Handling**: If the LLM's response is malformed, irrelevant, or cannot be parsed into a valid `Operation`, the system must handle this gracefully. This might involve:
    *   Logging the AI's failure.
    *   Returning a default `MessageActionNode` to inform the user of the AI's inability to interpret.
    *   Potentially, returning another `AIHelpRequestActionNode` with a more specific error, allowing for further AI refinement or human intervention.

## Current State & Future Development

*   Currently, the `getAIHelp` function provides a **mocked response**. It logs the `rawContent` and `reason` and returns a simple `MessageActionNode` indicating that AI help was requested. This allows the overall system to compile and run, demonstrating the architectural flow without requiring live LLM calls.
*   Future development will focus on replacing this mock with actual LLM integration, implementing robust prompt engineering, and comprehensive response validation to ensure reliable AI-assisted interpretation.