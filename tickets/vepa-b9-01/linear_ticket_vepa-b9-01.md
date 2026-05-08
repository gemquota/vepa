# VEPA-B9-01: Implement Selective Chaos System

## Description
The old SSoT referenced a "Selective Chaos System" that allowed granular control over what parts of the simulation were randomized, rather than a single chaotic button. This ticket implements that hypothetical feature.

## status: Todo

---

# Development Plan

## Phase 1: Engine Logic Expansion
1.  **Modify `main.js`:** Update `triggerSmartChaos(options)` to accept an options object defining which systems to scramble.
2.  **Chaos Categories:**
    *   `dna`: Randomize the 42 DNA parameters for all existing species.
    *   `biology`: specifically target indices 10, 11, 12, 34, 35, 36, 41 (Birth, Death, Mutation, Energy Efficiency, Sex Chance, Predation Bias, Affinity).
    *   `physics`: Randomize global pure laws and `worldConfig` (e.g., `G`, `dt`, `baseSize`).

## Phase 2: UI Implementation
1.  **Modify `ui.js`:** Replace the current single-action "CHAOS" button with a toggle that opens a small sub-menu.
2.  **Menu Options:** Add checkboxes or specific buttons for:
    *   "CHAOS: DNA"
    *   "CHAOS: BIOLOGY"
    *   "CHAOS: PHYSICS"
    *   "CHAOS: TOTAL"
3.  **Event Dispatch:** Ensure `emit('cmd:chaos', { target: '...' })` passes the correct context back to the engine.

## Phase 3: Testing & Validation
1.  Trigger 'Biology' chaos and verify pure physics laws remain untouched.
2.  Trigger 'Physics' chaos and verify species DNA remains stable.
