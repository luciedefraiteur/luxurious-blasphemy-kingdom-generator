# Ritual Phase 3: Enactment - Overview

## Purpose

The Enactment phase is the final stage of a Luciform ritual, where the structured `LuciformDocument` is translated into concrete actions performed on the system. This phase brings the ritual to life, executing the intentions defined within the Luciform.

## Key Component

This phase is primarily handled by the `@lurkuitae/luciform-executor` package.

## High-Level Flow

1.  **Input**: A `LuciformDocument` object, which has ideally passed through the Incantation and Divination phases, meaning all its `ActionNode`s are either directly recognized `Operation`s or have been resolved by AI from `AIHelpRequestActionNode`s.
2.  **Iterative Processing**: The `luciform-executor` iterates through each `PasNode` (step) within the `LuciformDocument`.
3.  **Action Dispatch**: For each `PasNode`, the executor examines its `ActionNode`:
    *   If it's a recognized `Operation` (e.g., `JsonActionNode` containing a `shell_command`), the executor dispatches it to the appropriate internal handler responsible for that specific type of operation.
    *   If, for any reason, an `AIHelpRequestActionNode` is still present (e.g., if AI interpretation failed or was skipped), the executor will handle this gracefully, typically by logging an error or taking a predefined fallback action.
4.  **System Interaction**: The handlers perform the actual work, interacting with the underlying operating system, file system, or other services as required by the `Operation`.

## Output

The Enactment phase produces side effects on the system (e.g., files are created or modified, shell commands are run, messages are displayed). It also generates a detailed log of the ritual's execution, including successes, failures, and any relevant output.

## Interplay with Other Phases

*   **Dependency on Incantation & Divination**: The quality and completeness of the `LuciformDocument` (output from Incantation and Divination) directly impact the success of the Enactment phase. A well-parsed and AI-interpreted document leads to smoother execution.
*   **Feedback Loop**: The execution process can generate new information or errors that might feed back into future Incantation or Divination cycles (e.g., if a shell command fails, a new ScryOrb might be generated).
