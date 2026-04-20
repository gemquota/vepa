# Plan: Batch 3 - Sensing & Communication

**Date**: 2026-03-03 (Back-filled)

## 1. Neighborhood Radius & Dynamic Sampling
### Objective:
Replace static 3x3 neighbor cell sampling with dynamic range calculation based on the `Neighborhood Radius` parameter.

### Implementation:
- In `physics.worker.js`, calculate `range = Math.ceil(Math.sqrt(dna.radius2) / cellS)`.
- Update the nested loops for `ox, oy, oz` to use `-range` to `range`.
- Ensure interaction checks (`d2 < dna.radius2`) apply to all proximity-based forces.

## 2. Multi-Channel Communication
### Objective:
Implement a 4-channel signaling system where particles emit and respond to oscillatory signals.

### Implementation:
- **State**: Use indices 7-10 in the particle stride for Channels 1-4.
- **Emission**: Update signals each frame based on `Math.sin(phase) * strength * tuning[i]`.
- **Response**: In the proximity loop, calculate a weighted sum of neighbor signals using the responder's own `tuning` array.
- **Integration**: Convert the weighted signal into a physical force `f_sig = (sum_signals * resp) / distance`. Add this to the gravitational/DNA force.

## 3. Verification Strategy
- **Spatial Hash Test**: Verify that increasing `Neighborhood Radius` beyond 500 triggers search in more than the immediate adjacent cells.
- **Signal Test**: Create two species: one that pulses and one that is highly responsive. Confirm that the second species clusters around the first when signaling is active.
- **DNA Sync**: Ensure index 18 correctly maps to `radius2` in the worker transmission logic.
