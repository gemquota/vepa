# Stellar Evolution Upgrade Implementation Plan

## Overview
Transform the simulation from a purely local particle-to-particle system into a hierarchical celestial engine. This includes the formation of swarms, the collapse of matter into solid cores (planetoids), and the ignition of stars (fusion) with global gravity and radiation pressure.

## Scope Definition (CRITICAL)
### In Scope
- **Celestial Entity System**: A new `celestials` array to track massive objects (Planetoids/Stars).
- **Global Gravity**: 1/r² pull from all `celestials` on all particles and other `celestials`.
- **Condensation Logic**: Automatic merging of high-density, low-velocity particle clusters into `celestials`.
- **Accretion**: Particles that collide with `celestials` are absorbed, increasing the celestial's mass.
- **Stellar Ignition**: High-mass planetoids transform into stars, emitting radiation and losing mass.
- **Radiation Pressure**: Stars exert a repulsive force on nearby matter.
### Out of Scope
- **Complex Chemistry**: Gas dynamics (like hydrogen vs. helium) are for later.
- **Detailed Surface Rendering**: Planetoids will remain as colored/textured circles for now.

## Current State Analysis
- **File**: `index.html:482` (Current `physics()` loop uses spatial hashing for local gravity/forces only).
- **File**: `index.html:565` (Current `draw()` loop only renders particles).
- **Current Fusion**: Only exists as a simple particle-to-particle merger.

## Implementation Phases

### Phase 1: Celestial Entity Foundation
- **Goal**: Establish the data structure for massive objects and ensure they persist through resets.
- **Steps**:
  1. [ ] Define `celestials = []` in the global state.
  2. [ ] Update `restartSim()` and `hardReset()` to clear `celestials`.
  3. [ ] Add a `drawCelestials()` call to the main rendering loop.
- **Verification**: Manually call `celestials.push(...)` in the console and verify a large circle appears on the canvas.

### Phase 2: Global Gravity & Accretion
- **Goal**: Make `celestials` attract everything and "eat" particles they touch.
- **Steps**:
  1. [ ] In `physics()`, loop through all particles and add 1/r² pull from each `celestial`.
  2. [ ] Implement `handleCelestialCollisions()`: If `dist(particle, celestial) < celestial.radius`, delete particle and increase celestial mass.
  3. [ ] Implement celestial-on-celestial gravity: Massive objects pull each other.
- **Verification**: Spawn a celestial and observe particles being sucked in like a vacuum.

### Phase 3: Condensation (Swarms to Solids)
- **Goal**: Detect when matter is "packed so tightly it can't move anymore" and collapse it.
- **Steps**:
  1. [ ] Inside the spatial hash loop, track the `totalMass` and `avgVel` of each cell.
  2. [ ] If `cellMass > CONDENSE_THRESHOLD` and `v_variance < STABLE_THRESHOLD`:
      - Create a new `celestial` at the cluster's center of mass.
      - Delete the contributing particles.
- **Verification**: Increase gravity/attraction and observe clusters spontaneously turning into solid cores.

### Phase 4: Stellar Ignition & Radiation
- **Goal**: High-mass objects become stars with unique physics.
- **Steps**:
  1. [ ] If `celestial.mass > STAR_MASS_THRESHOLD`, set `type = 'star'`.
  2. [ ] Add `dm/dt` mass loss to stars (simulating fusion fuel consumption).
  3. [ ] Implement **Radiation Pressure**: Stars push matter away with 1/r² force (offsetting gravity).
  4. [ ] Update `drawCelestials()` to give stars a massive neon glow and a pulsating core.
- **Verification**: Feed a planetoid until it ignites, then observe the surrounding cloud being pushed back by the radiation.

## Finalize
- Integrate these laws into the "Laws of Nature" UI toggle.
