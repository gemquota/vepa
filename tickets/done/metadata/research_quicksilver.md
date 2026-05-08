# Research: Implement 'Quicksilver' Recipe

**Date**: 2026-03-02

## 1. Executive Summary
The `applyRecipe` function in `index.html` is currently a placeholder. The task is to implement the 'quicksilver' case, which sets specific physics parameters (Viscosity, Force, Elasticity) and visual styles (Silver color) to simulate a liquid metal behavior.

## 2. Technical Context
- **File**: `index.html`
- **Function**: `function applyRecipe(k)` (currently empty)
- **Data Structures**:
    - `species`: Array of 8 objects containing `rules` (DNA), `renderColor`, etc.
    - `DNA_META`: Maps indices to rule names. Index 0 = Force, Index 1 = Viscosity.
    - `globalPhysics`: Array containing global settings. Index 2 = Elasticity.
    - `renderSliders()`: Function to update the UI with new values.
    - `resetSim()`: Function to re-initialize particles (optional but often paired with recipes).

## 3. Findings & Analysis
- **Parameters**:
    - **Viscosity**: `species[i].rules[1].val`. Target: `0.98`.
    - **Force**: `species[i].rules[0].val`. Target: `-0.5` (Repulsion).
    - **Elasticity**: `globalPhysics[2].val`. Target: `~0.9` (High).
    - **Color**: `species[i].renderColor`. Target: Metallic/Silver (e.g., `hsl(0, 0%, 80%)`).
- **Implementation Logic**:
    - Input `k` will be `'quicksilver'`.
    - Iteration over `species` array is required to apply changes to all particle types.
    - `renderSliders()` must be called to reflect changes in the UI.
    - `init()` and `changeResolution()` are available if grid resets are needed, but likely not required for this task.

## 4. Technical Constraints
- No new libraries.
- Must work within the existing `index.html` structure.
- Must preserve the "God Mode" standard (efficient, clean code).

## 5. Architecture Documentation
The application uses a simple functional approach where global state (`species`, `globalPhysics`) drives the simulation loop (`physics()`, `draw()`). UI functions (`applyRecipe`, `changeResolution`) modify this global state.
