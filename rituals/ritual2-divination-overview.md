# Ritual Phase 2: Divination - Overview

## Purpose

The Divination phase is where the Luciform system leverages Artificial Intelligence to interpret and resolve ambiguities or complex natural language instructions that the deterministic parser could not fully understand. It transforms `AIHelpRequestActionNode`s into concrete, executable `Operation`s.

## Key Component

This phase is primarily handled by the `@lurkuitae/luciform-ai-interface` package, specifically its `getAIHelp` function.

## High-Level Flow

1.  **Trigger**: The `luciform-executor` (during the Enactment phase) encounters an `AIHelpRequestActionNode` within a `LuciformDocument`.
2.  **AI Invocation**: The `getAIHelp` function is called, passing the raw, ambiguous content and the reason for the parsing failure to the AI interface.
3.  **AI Interpretation**: The AI (a Large Language Model) processes the request, using its understanding of context and natural language to interpret the user's intent.
4.  **Structured Output**: The AI is prompted to return a structured JSON object representing a valid `Operation` that the system can execute.
5.  **Resolution**: The `AIHelpRequestActionNode` is replaced by the AI-interpreted `Operation`, allowing the execution to proceed.

## Output

The output of the Divination phase is a structured `Operation` (e.g., a `shell_command`, `create_file`, or `message` operation) that can be directly processed by the `luciform-executor`.

## Next Steps

Once an `AIHelpRequestActionNode` is successfully resolved into a concrete `Operation` during Divination, the `luciform-executor` proceeds to the **Enactment** phase to execute that operation.
