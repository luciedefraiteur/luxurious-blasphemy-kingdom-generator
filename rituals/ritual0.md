# Ritual Flow: High-Level Overview (Ritual 0)

This document outlines the high-level flow of how a Luciform ritual is processed and executed within the `Codex Lurkuitae Navigator`.

## The Navigator's Orchestration

The `Codex Lurkuitae Navigator` acts as the central orchestrator, guiding the Luciform from its raw textual form to a series of executable actions. The process can be conceptualized in three main phases:

1.  **Incantation (Parsing)**: The raw Luciform content is interpreted and transformed into a structured, understandable format.
2.  **Divination (AI-Assisted Interpretation)**: Ambiguities or unknown elements within the Luciform are presented to an AI for intelligent interpretation and resolution.
3.  **Enactment (Execution)**: The fully interpreted and structured Luciform is translated into concrete actions performed on the system.

## Phase 1: Incantation (Parsing)

*   **Input**: A `.luciform` file (raw text content).
*   **Component**: `@lurkuitae/luciform-ai-parser`
*   **Process**: The parser attempts to break down the Luciform content into a `LuciformDocument`.
    *   It first tries to parse the entire content as a structured JSON object (for `.spell` files or fully defined JSON Luciforms).
    *   If that fails, it falls back to a text-based parsing, identifying `PasNode`s (steps) and their associated `[Action]` blocks.
    *   Within each `[Action]` block, it attempts to recognize known `Operation` types (e.g., `shell_command`, `create_file`, `message`).
*   **Output**: A `LuciformDocument` object. Crucially, if any part of an `[Action]` block cannot be understood by the parser, it generates an `AIHelpRequestActionNode` instead of failing. This node contains the raw, unparseable content and a reason for the failure.

## Phase 2: Divination (AI-Assisted Interpretation)

*   **Trigger**: An `AIHelpRequestActionNode` is encountered during the parsing or execution phase.
*   **Component**: `@lurkuitae/luciform-ai-interface`
*   **Process**: The `getAIHelp` function is invoked with the raw, ambiguous content and the reason for the ambiguity.
    *   (Currently mocked): In a full implementation, this component would construct a detailed prompt for an external LLM.
    *   The LLM would then interpret the ambiguous instruction and return a structured `Operation` (e.g., a JSON object representing a `shell_command`).
    *   The `AIHelpRequestActionNode` is then replaced by the AI-interpreted `Operation`.
*   **Output**: A structured `Operation` that the `Executor` can understand and act upon.

## Phase 3: Enactment (Execution)

*   **Input**: A `LuciformDocument` (potentially with `AIHelpRequestActionNode`s resolved by AI).
*   **Component**: `@lurkuitae/luciform-executor`
*   **Process**: The executor iterates through each `PasNode` in the `LuciformDocument`.
    *   For each `PasNode`, it examines the associated `ActionNode`.
    *   If the `ActionNode` is a structured `Operation`, the executor dispatches it to the appropriate internal handler (e.g., a function to run shell commands, create files, send messages).
    *   If an `AIHelpRequestActionNode` is still present (e.g., if the AI interpretation failed or was skipped), the executor would typically log an error or take a fallback action.
*   **Output**: Side effects on the system (e.g., files created, commands executed, messages displayed) and a log of the ritual's progress and outcome.

## Interplay and Resilience

The key to this ritual flow is its resilience. The system is designed not to crash on ambiguity but to seek intelligent assistance from an AI. This allows for more flexible and natural language-driven ritual definitions, where the AI fills in the gaps of explicit instruction.