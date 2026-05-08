---
id: vepa-b4-01
title: "Advanced Motion: Inertia, Friction & Terminal Velocity (v1.3)"
status: Done
priority: Medium
order: 40
created: 2026-03-03
updated: 2026-04-20
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
The current motion model is purely force-based with a global drag coefficient. Particles lack "weight" (inertia) and species-specific resistance (friction). High-energy interactions can also lead to numerical instability without velocity capping.

## Solution
1. Pass `inertia` (index 26), `friction` (index 27), and `maxVelocity` (index 28) from DNA to the physics worker.
2. In `physics.worker.js`, use `inertia` to scale the acceleration: `accel *= (1.0 / dna.inertia)`.
3. Apply per-particle `friction`: `velocity *= (1.0 - dna.friction)`.
4. Clamp velocity magnitude to `dna.maxVelocity`.

## Implementation Details
- Update `src/main.js:getFlattenedDNA` to include these 3 parameters.
- Update `src/worker/physics.worker.js:step` to apply the motion logic.
- UI: Ensure "Motion" category is visible in the DNA tab (minLevel 1).
