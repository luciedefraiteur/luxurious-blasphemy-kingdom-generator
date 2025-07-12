# Ritual Phase 1: Incantation - Overview

## Purpose

The Incantation phase is the initial step in processing a Luciform ritual. Its primary goal is to transform the raw textual content of a `.luciform` file into a structured, machine-readable `LuciformDocument`.

## Key Component

This phase is primarily handled by the `@lurkuitae/luciform-ai-parser` package.

## High-Level Flow

1.  **Input Acquisition**: The `Codex Lurkuitae Navigator` reads the raw string content of the `.luciform` file.
2.  **Parsing Attempt**: The `luciform-ai-parser` receives this raw content and attempts to interpret its structure.
3.  **Structured Output or AI Delegation**: The parser aims to produce a `LuciformDocument` where all actions are clearly defined. However, if it encounters ambiguous or unrecognized syntax, it intelligently delegates the interpretation of these parts to an AI, marking them for later resolution.

## Output

The output of the Incantation phase is a `LuciformDocument` object. This document represents the ritual's structure, with each step (`PasNode`) containing either a fully recognized `Operation` or an `AIHelpRequestActionNode` for parts that require AI interpretation.

## Next Steps

Once the Incantation phase is complete, the `LuciformDocument` is passed to the next phase of the ritual: **Divination**, where any `AIHelpRequestActionNode`s are resolved by an AI.
