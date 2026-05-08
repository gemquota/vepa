# VEPA-B9-03: Implement Advanced Spatial Distributions

## Description
The old SSoT detailed multiple geometric patterns for initial simulation seeding: Soup, Big Bang, Bipolar, Galaxy, Grid, and Uniform, along with a "Spread Radius". This ticket implements these initial distribution modes.

## status: Todo

---

# Development Plan

## Phase 1: Config Expansion
1.  **Modify `main.js` / `constants.js`:** Add `distributionType` (String/Enum) and `spreadRadius` (Float) to `worldConfig`.

## Phase 2: Spawning Logic Engine
1.  **Modify `main.js` (Particle Initialization):** Rewrite the particle seeding loop to respect `distributionType`.
    *   **Soup:** Current behavior. Random within bounds.
    *   **Big Bang:** Spawn all particles near `(W/2, H/2, D/2)` but assign them extremely high radial velocities outward.
    *   **Bipolar:** Spawn 50% of particles near `(0, H/2, D/2)` and 50% near `(W, H/2, D/2)`.
    *   **Galaxy:** Gaussian distribution—higher density in the center, tapering off towards the edges. Add slight rotational velocity.
    *   **Grid:** Perfect 3D crystalline lattice distribution based on exact spacing calculated from particle count.
    *   **Uniform:** Even random spread constrained exactly to `spreadRadius`.

## Phase 3: UI Integration
1.  **Modify `ui.js`:** Add a dropdown/select menu in the "WORLD" accordion for `Distribution`.
2.  Add a slider for `Spread Radius`.
3.  Ensure changing the distribution type triggers a `cmd:restart` or prompts the user to restart the simulation to see the effect.
