---
id: vepa-b5-03
title: "Particle Memory System: Internal State State persistence (v1.4)"
status: Done
priority: Low
order: 90
created: 2026-03-03
updated: 2026-04-20
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Particles currently react to current frame inputs. We need memory for internal variables to enable complex temporal behaviors (e.g., persistent search, state memory).

## Solution
1. Pass `memoryDecay` (index 40) from DNA to the physics worker.
2. Repurpose `s1-s4` (indices 7-10) as both communication channels AND memory slots.
3. Every frame, decay these slots: `sX *= dna.memoryDecay`.
4. Allow `s1` to bias `Force` (Attraction) and `s2` to bias `Torque` (Rotation).
5. If `s3` is high, the particle is in a "memory-intensive state" (e.g., higher metabolism/faster movement).

## Implementation Details
- Update `physics.worker.js` to process internal memory state.
- Ensure `Memory Decay` is visible in the UI (minLevel 5).
