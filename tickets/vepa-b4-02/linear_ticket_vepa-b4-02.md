---
id: vepa-b4-02
title: "Advanced Matter: Base Radius & Per-Species Elasticity (v1.3)"
status: Done
priority: Medium
order: 50
created: 2026-03-03
updated: 2026-04-20
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Particles currently have a fixed relationship between mass and radius (`sqrt(mass)`). They also have a global elasticity. We need species-level control over their physical extent and "bounciness."

## Solution
1. Pass `baseRadius` (index 29), `elasticity` (index 30), and `bondAngle` (index 31) from DNA to the physics worker.
2. In `physics.worker.js`, calculate `totalRadius = dna.baseRadius + sqrt(mass)`.
3. Use per-species `elasticity` in collision resolution (replace global laws.elasticity).
4. Implement `bondAngle` preference: if particles are in a cluster, apply a torque/force to align them toward preferred angles (e.g., 90 deg for square lattices, 120 for hexagonal).

## Implementation Details
- Update `src/main.js:getFlattenedDNA` to include these 3 parameters.
- Update `src/worker/physics.worker.js:step` collision and structure logic.
- UI: Ensure "Matter" category is visible in the DNA tab (minLevel 2).
