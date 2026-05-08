---
id: vepa-b7-01
title: "Reorganize Laws into Pure and Biol groups"
status: Done
priority: High
order: 10
created: 2026-04-24
updated: 2026-04-24
links:
  - url: ../vepa-epic-06/linear_ticket_vepa-epic-06.md
    title: Parent Ticket
---

# Description

## Problem to solve
Laws are currently a flat list or poorly organized. We need a clear distinction between pure physics and biological triggers.

## Solution
Update the engine and UI to group laws into 'pure' and 'biol'.

## Implementation Details
- Updated `VepaEngine` to use grouped `this.laws`.
- Updated `physics.worker.js` to read from groups.
- Updated `ui.js` to render grouped "PARAMETER INTEL" and synchronized UI.
