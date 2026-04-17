# Research: Stellar Evolution & Hierarchical Matter (v1.6)

## Problem Statement
The current physics engine only supports local interactions via a spatial hash. This prevents the formation of large-scale structures like swarms, planetoids, and stars that exert universal gravitational influence.

## 1. The "Combined Gravity" Problem
- **Current state**: Gravity is 1/r², but only calculated within neighboring spatial cells (200px radius). This is why swarms don't feel "combined."
- **Proposed Solution**: 
    - Maintain a list of **Global Entities** (Planetoids, Stars).
    - Every particle, regardless of its position, calculates the gravitational pull from every Global Entity.
    - Since there will be few Global Entities (e.g., 5-20), this is O(N_particles * N_globals), which is very efficient.

## 2. Condensation & Fusion Logic
- **Particle-to-Solid Transition**:
    - Particles within a "Swarm" (defined by local density) with low relative velocity (v_rel < threshold) can "Condense."
    - Condensation merges multiple particles into a single `SolidObject`.
    - This reduces the total particle count, improving performance.
- **Solid-to-Star Transition**:
    - `SolidObject` mass increases as it absorbs nearby particles.
    - If `mass > StarThreshold`, the object ignites.
    - `type` changes from `planetoid` to `star`.

## 3. Stellar Physics
- **Radiation Pressure**: Stars emit a repulsive force (Inverse Square Law) that counters gravity. This creates a "habitable zone" where forces balance.
- **Mass Consumption**: Stars lose mass over time: `dm/dt = -fusion_constant`.
- **Radiation Effects**: Light from stars could increase the `energy` or `jitter` of nearby particles.

## 4. Implementation Details
- **Data Structure**: 
    - A new `celestials` array in the simulation state.
    - Each `celestial` has `x, y, vx, vy, mass, radius, type`.
- **Physics Loop Update**:
    - `updateCelestials()`: Handle gravity between celestials and their internal logic (fusion).
    - `updateParticles()`: Add global gravity from `celestials`.
    - `handleAccretion()`: Check if particles hit a celestial's radius and integrate them.

## 5. Performance Goals
- By merging clusters into single objects, we can maintain higher total mass in the simulation with fewer active entities.
- Spatial hash continues to handle local particle-to-particle interactions (DNA rules).
