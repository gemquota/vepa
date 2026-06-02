# Quicksilver Recipe Implementation Plan

## Overview
Implement the 'quicksilver' case in the `applyRecipe` function to create a liquid metal simulation preset.

## Scope Definition
### In Scope
- Modify `index.html` to add logic for `case 'quicksilver'` inside `applyRecipe`.
- Set Viscosity to `0.98` (High).
- Set Force to `-0.5` (Repulsion).
- Set Elasticity to `0.9` (High bounce).
- Set visual style to Silver.
- Update UI sliders.

### Out of Scope
- Creating new recipes not listed.
- Refactoring the entire engine.

## Implementation Phases
### Phase 1: Engine Logic
- **Goal**: Implement the parameter changes.
- **Steps**:
  1. [ ] Locate `function applyRecipe(k)` in `index.html`.
  2. [ ] Add `case 'quicksilver':` logic.
  3. [ ] Iterate through `species` array:
     - Set `rules[0].val` (Force) to `-0.5`.
     - Set `rules[1].val` (Viscosity) to `0.98`.
     - Set `renderColor` to `hsl(0, 0%, 80%)`.
  4. [ ] Set `globalPhysics[2].val` (Elasticity) to `0.9`.
  5. [ ] Call `renderSliders()` and `renderPalette()` to update UI.
- **Verification**:
  - Click 'Quicksilver' button.
  - Verify Viscosity slider shows `0.98`.
  - Verify particles repel and move like thick liquid.
  - Verify particles are silver.
