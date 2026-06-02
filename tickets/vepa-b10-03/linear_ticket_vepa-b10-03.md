---
id: vepa-b10-03
title: "Universal Help Coverage & Codex Data Scaffolding"
status: Done
priority: Medium
order: 30
created: 2026-04-24
updated: 2026-04-24
links:
  - url: ../vepa-epic-07/linear_ticket_vepa-epic-07.md
    title: Parent Ticket
---

# Description

## Problem to solve
Many UI elements lack help tooltips. We need to map EVERY interactive element to a `HELP_DB` entry. Simultaneously, we need to scaffold the `codex/` directory to hold more detailed documentation and lore for each element.

## Solution
- Audit all UI components (World Sliders, DNA Accordion, Species List, Control Bar).
- Add missing entries to `HELP_DB` in `src/constants.js`.
- Create `codex/` directory and initial JSON/Markdown files for the interactive database.

## Implementation Details
- Update `src/constants.js` with comprehensive `HELP_DB` entries.
- Create `codex/entries.json` or similar structure.
- Implement help keys for all buttons and sliders.
