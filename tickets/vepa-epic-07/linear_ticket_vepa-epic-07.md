---
id: vepa-epic-07
title: "[Epic] Codex Development & Universal UI Help"
status: Done
priority: High
order: 100
created: 2026-04-24
updated: 2026-04-24
---

# Description

## Problem to solve
The application needs a more robust and universal help system. Currently, many UI elements lack documentation, and the existing help tooltips are limited. Additionally, we want to build a rich, interactive sci-fi encyclopedia (The Codex) to provide deep context and lore, developed as an independent component first.

## Solution
1. **Help System Upgrade**: Improve tooltip behavior (click outside to close), move the Encyclopedia (📖) button to a standard top-right position in the HelpPanel, and ensure the '?' toggle works reliably.
2. **Universal Coverage**: Document EVERY UI element in `HELP_DB` and create corresponding Codex entries.
3. **Independent Codex App**: Develop a standalone interactive database in a new `codex/` directory.
4. **Integration**: Connect the main simulation's help system to the new Codex app.

## Implementation Plan
- Phase 1: Help UI Polish & Quickload Preset tooltips.
- Phase 2: Universal Help Coverage & Codex Scaffolding.
- Phase 3: Standalone Codex Development.
- Phase 4: Integration.
