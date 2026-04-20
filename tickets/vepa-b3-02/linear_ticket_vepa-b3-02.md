---
id: vepa-b3-02
title: "Multi-Channel Signal Propagation (v1.2)"
status: Done
priority: High
order: 30
created: 2026-03-03
updated: 2026-04-20
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Particles currently only emit a visual pulse (`particles[ptr+7]`) but don't communicate with neighbors. We need a system where "blinking" propagates signals through a multi-channel receiver system.

## Solution
1. Use `particles[ptr+7..10]` as the 4 signal channels.
2. `Signal Resp` (index 13) controls overall sensitivity to neighbor signals.
3. `Pulse Rate` (index 14) determines when a particle "fires" its own signal.
4. `Signal Strength` (index 19) is the amplitude of the signal.
5. `Signal Decay` (index 20) determines how fast the signal fades internally.
6. `Propagation Speed` (index 21) introduces a temporal delay.
7. `Tuning Ch1-4` (indices 22-25) are weights for how much each channel contributes to the particle's internal state.

## Implementation Details
- Update `physics.worker.js`:
    - In the proximity loop, read neighbor's signal strength.
    - Accumulate signal input based on `dna.tuning` and `dna.signalResp`.
    - Apply `signalDecay` to the internal signal state each frame.
    - When internal signal threshold is met, "fire" own pulse.
    - Signal input should influence physics (e.g., add to Force acceleration).
- UI: Ensure "Communication" section is visible in the DNA tab (minLevel 2).
