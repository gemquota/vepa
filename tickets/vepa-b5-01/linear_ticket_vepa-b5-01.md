---
id: vepa-b5-01
title: "Advanced Biology: Efficiency, Sex & Predation (v1.4)"
status: Todo
priority: High
order: 70
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Biological systems currently only have spontaneous mitosis. We need more complex population dynamics.

## Solution
Implement multi-parent reproduction, predation bonuses, and energy efficiency.

## Implementation Details
- Add Energy Efficiency, Sexual Reproduction Chance, and Predation Bias to DNA.
- Implement sexual reproduction logic (merging DNA from two parents).
- Implement predation bonus force when targeting lower-mass species.
- UI: Add Biology sliders to the DNA tab.
