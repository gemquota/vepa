---
id: vepa-b4-03
title: "EM Depth: Conductivity & Magnetic Moment (v1.3)"
status: Done
priority: Low
order: 60
created: 2026-03-03
updated: 2026-04-20
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Electromagnetic interaction is currently limited to polarity attraction/repulsion. We need charge transfer (Conductivity) and rotational alignment (Magnetic Moment) to create dynamic field behaviors.

## Solution
1. Pass `conductivity` (index 32) and `magneticMoment` (index 33) from DNA to the physics worker.
2. In `physics.worker.js`, during collisions (`ACCR` or `COLL`):
    - Balance charges: `ptr[charge] = (ptr[charge] + oPtr[charge]) / 2` based on `conductivity`.
    - `charge` in VEPA is the `C1 (Polarity)` DNA rule (index 4) - but wait, rules are static!
    - We need *particle-level state* for charge. Currently, charge is a species rule.
    - We should transition "Charge" to a dynamic particle state if we want conductivity.

## Implementation Details
- Add `chargeState` to `STRIDE` (index 21? or repurpose one).
- Currently `STRIDE` is 21. `0-20` used.
- `physics.worker.js` needs to use `dna.conductivity` to equalize neighbor `chargeState`.
- `magneticMoment` should align `w (rotation)` vectors of neighbors if they have matching charges.
- UI: Ensure "EM" category is visible in the DNA tab (minLevel 2).
