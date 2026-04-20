# Research: Batch 3 - Sensing & Communication

**Status**: Verified (2026-04-20)

## 1. Neighborhood Radius Sampling
The physics engine uses a dynamic spatial hash to handle varying interaction ranges.
- **DNA Index**: 18 (`Neighborhood Radius`).
- **Storage**: DNA index 18 is squared and passed as `radius2` to the worker.
- **Worker Logic**: `range = Math.ceil(Math.sqrt(dna.radius2) / cellS)`. This determines how many adjacent grid cells (size 500) to search.
- **Verification**: Particles correctly identify and interact with neighbors within their specific `Neighborhood Radius`. Large radii trigger searches in more distant cells.

## 2. Multi-Channel Signal Propagation
A 4-channel signaling system allows for complex emergent behaviors.
- **Signal Channels**: `particles[ptr + 7..10]` represent Channels 1-4.
- **Emission**: Controlled by `pulse` (DNA 14), `strength` (DNA 19), and `tuning` (DNA 22-25). 
- **Response**: Controlled by `resp` (DNA 13) and `tuning`. 
- **Mechanism**: Particles emit signals based on a sine oscillation of their `phase`. Neighbors "listen" using their own `tuning` weights, filtering the incoming signals.
- **Effect**: Signals result in an additional force `f += (sig * dna.resp) / d`, which can be attractive or repulsive.

## 3. Integration with Gravity
Signal-based forces are integrated directly into the `GRAV` law loop.
- **Physics Worker**: Line 195-199 in `physics.worker.js`.
- **Logic**: If `dna.resp > 0`, the sum of weighted neighbor signals is calculated. This sum modulates the force applied to the particle, allowing species to "seek" or "avoid" signaling neighbors.
