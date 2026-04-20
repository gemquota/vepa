---
id: vepa-b5-02
title: "Chemistry Category: Reactions, Catalysis & Heat Output (v1.4)"
status: Done
priority: Medium
order: 80
created: 2026-03-03
updated: 2026-04-20
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Interactions are force-based and static. We need "state changes" where species can transform based on local conditions (Chemistry).

## Solution
1. Pass `reactionThreshold` (index 37), `catalysis` (index 38), and `heatOutput` (index 39) from DNA to the physics worker.
2. If `localDensity` or `localCharge` exceeds `reactionThreshold`, trigger a "reaction":
    - Change `speciesID` (index 12) to a new species defined in a "reaction map."
    - Emit `heatOutput` which increases local entropy (jitter) for neighbors.
3. `Catalysis` should lower the `reactionThreshold` of nearby particles, creating chain reactions.

## Implementation Details
- Update `physics.worker.js` with chemistry step.
- Update `constants.js` to define basic "reaction" pairs if needed.
- UI: Add Chemistry sliders to a new DNA section (minLevel 4).
