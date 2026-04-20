---
id: vepa-b5-01
title: "Advanced Biology: Efficiency, Sex & Predation (v1.4)"
status: Done
priority: High
order: 70
created: 2026-03-03
updated: 2026-04-20
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Biological systems are currently limited to spontaneous mitosis. We need more complex population dynamics: efficient metabolism, sexual reproduction (HGT), and active predation.

## Solution
1. Pass `energyEfficiency` (index 34), `sexChance` (index 35), and `predationBias` (index 36).
2. `Energy Efficiency`: Controls the `timer` (index 17) or a new `energy` state. High efficiency allows longer survival.
3. `Sex Chance`: During mitosis (`laws.life`), if `rand < sexChance`, pick a nearby neighbor and merge/crossover DNA instead of cloning.
4. `Predation Bias`: Bonus attraction force toward particles with significantly lower mass. If contact occurs, "eat" (accrete) the smaller one and gain a massive energy boost.

## Implementation Details
- Update `physics.worker.js` with new life cycle and predation logic.
- UI: Ensure "Biology" section is visible (minLevel 3).
