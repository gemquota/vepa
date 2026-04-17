---
id: vepa-b4-03
title: "EM Depth: Conductivity & Magnetic Moment (v1.3)"
status: Todo
priority: Low
order: 60
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Electromagnetic interaction is currently limited to polarity attraction/repulsion.

## Solution
Implement charge transfer (Conductivity) and rotational alignment (Magnetic Moment).

## Implementation Details
- Add Conductivity and Magnetic Moment to DNA.
- Implement charge balancing on collision based on conductivity.
- Implement torque bias based on neighbor charge alignment.
- UI: Add EM sliders to the DNA tab.
