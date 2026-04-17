---
id: vepa-b4-01
title: "Advanced Motion: Inertia, Friction & Max Velocity (v1.3)"
status: Todo
priority: Medium
order: 40
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
The current motion model is too simple for complex structures. We need species-level control over momentum and speed.

## Solution
Implement Inertia (resistance to acceleration), Friction (velocity-dependent drag), and a Max Velocity Cap.

## Implementation Details
- Add Inertia, Friction, and Max Velocity Cap to DNA.
- Update the physics integration to include these factors.
- UI: Add Motion sliders to the DNA tab.
