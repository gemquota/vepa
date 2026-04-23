---
id: vepa-b7-04
title: "Expand Law Info UI with SVG icons and detailed graphics"
status: Done
priority: Medium
order: 15
created: 2026-04-24
updated: 2026-04-24
links:
  - url: ../vepa-epic-06/linear_ticket_vepa-epic-06.md
    title: Parent Ticket
---

# Description

## Problem to solve
The "Law Info" (formerly Parameter Intel) module was too simple. It needed a more "graphic" feel with introductory descriptions and distinct complex SVG icons for each law to improve immersion and clarity.

## Solution
1. Renamed "Parameter Intel" to "LAW INFO".
2. Added a high-fidelity graphic introductory section.
3. Designed and integrated 14+ unique complex SVG icons.
4. Surfaced multi-layered detail (`system`, `advanced`) from `HELP_DB`.
5. Improved visual separation and density with hover effects and borders.

## Implementation Details
- Updated `src/ui.js` with `LAW_ICONS` and expanded `renderInfoModule`.
- Updated `index.html` for renaming.
- Updated `style.css` with high-density codex styles.
