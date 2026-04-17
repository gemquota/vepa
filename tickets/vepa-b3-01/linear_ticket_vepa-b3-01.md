---
id: vepa-b3-01
title: "Implement Neighborhood Radius (v1.2)"
status: Done
priority: Medium
order: 20
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Currently, the physics engine uses a hard-coded grid for spatial hashing. We need a per-species "Neighborhood Radius" to control the range of influence for forces and signals.

## Solution
Implement a species-level `neighborhoodRadius` parameter and update the physics loop to use this value when sampling the spatial hash.

## Implementation Details
- Add `neighborhoodRadius` to species DNA metadata.
- Update spatial hashing sampling to respect per-species radius.
- UI: Add a master range slider for the radius.
