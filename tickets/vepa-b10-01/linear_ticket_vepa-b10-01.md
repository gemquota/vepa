---
id: vepa-b10-01
title: "Quickload Preset Tooltips & Help Integration"
status: Done
priority: High
order: 10
created: 2026-04-24
updated: 2026-04-24
links:
  - url: ../vepa-epic-07/linear_ticket_vepa-epic-07.md
    title: Parent Ticket
---

# Description

## Problem to solve
Quickload presets (numbered buttons 1-9) lack descriptive tooltips that show their name and description. Additionally, they should be integrated into the help mode system so users can learn about the presets themselves.

## Solution
- Update `renderQuickPresets` to ensure `onmouseenter` tooltips show both name and description.
- Add help keys for the Quick Preset module to `HELP_DB`.
- Ensure the tooltip system handles preset data correctly even in help mode.

## Implementation Details
- Modify `src/ui.js`: `renderQuickPresets` and `showPresetTooltip`.
- Update `src/constants.js`: Add `PRESETS` entries to `HELP_DB`.
