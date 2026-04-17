---
id: vepa-b5-02
title: "Chemistry Category: Reactions, Catalysis & Heat (v1.4)"
status: Todo
priority: Medium
order: 80
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Interactions are currently limited to forces and mass fusion. We need "phase changes" and environmental effects.

## Solution
Implement a Chemistry category for mass/charge-triggered reactions and heat output.

## Implementation Details
- Add Reaction Threshold, Catalysis, and Heat Output to DNA.
- Implement state transformations when mass/charge reaches the reaction threshold.
- Implement "Heat" as a byproduct of collisions/reactions (linked to global temperature).
- UI: Add Chemistry sliders to a new DNA tab section.
