---
id: vepa-b5-03
title: "Particle Memory System (v1.4)"
status: Todo
priority: Low
order: 90
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Particles have no internal state memory. They react only to the current frame.

## Solution
Implement memory slots for storing internal variables that persist across frames.

## Implementation Details
- Add State Memory Decay and Memory Slots (0–4) to DNA.
- Implement internal memory buffer for particles to store last stimulus.
- Use memory to bias future interactions (e.g., persistent attraction after signal).
- UI: Add Memory sliders to the DNA tab.
