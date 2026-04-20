---
id: vepa-b3-01
title: "Implement Neighborhood Radius Sampling & Dynamic Hash (v1.2)"
status: Done
priority: High
order: 20
created: 2026-03-03
updated: 2026-04-20
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
The physics engine currently uses a fixed 3x3x3 grid sampling (radius 1) for spatial hashing. While `cellS` is 500 and the maximum `Neighborhood Radius` is 500, a particle at the edge of a cell might need to check more neighbors if the radius is large. Furthermore, `Neighborhood Radius` should be the master control for ALL proximity-based interactions (Gravity, Collisions, Signals).

## Solution
1. Update `physics.worker.js` to dynamically calculate the number of neighbor cells to sample based on `dna.radius` / `cellS`.
2. Ensure `Neighborhood Radius` (passed as `radius2`) correctly limits all interactions in the proximity loop.
3. Optimize the spatial hash if necessary (though 500px cells are large for 4000px world).

## Implementation Details
- In `physics.worker.js`, calculate `range = Math.ceil(sqrt(dna.radius2) / cellS)`.
- Loop from `-range` to `range` for `ox, oy, oz`.
- Verify `d2 < dna.radius2` for Gravity, Signal Propagation, and Attraction/Repulsion.
- UI: Ensure "Neighborhood Radius" slider is visible in the DNA tab under the "Physics" category (minLevel 1).
