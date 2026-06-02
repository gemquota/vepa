# VEPA-B9-02: Implement Aesthetic Render Parameters

## Description
The old SSoT mentioned specific visual rendering controls: Trail Life, Glow Intensity, Pulse Opacity, and Particle Opacity. This ticket extracts those hypotheticals and implements them as global render settings.

## status: Todo

---

# Development Plan

## Phase 1: Data Structure Updates
1.  **Modify `main.js` / `persistenceEngine.js`:** Add a `renderConfig` object to the engine state (or append to `worldConfig`).
    *   `trailFade` (0.0 to 1.0)
    *   `glowIntensity` (0.0 to 5.0)
    *   `pulseAmp` (0.0 to 1.0)
    *   `baseAlpha` (0.0 to 1.0)

## Phase 2: Canvas Rendering Integration
1.  **Modify `main.js` (or wherever PIXI/Canvas rendering occurs):**
    *   **Trail Fade:** Instead of a hardcoded clear, use `trailFade` to determine the opacity of the background fill overlay.
    *   **Glow Intensity:** Multiply the shadow blur or PIXI glow filter parameters by `glowIntensity`.
    *   **Base Alpha:** Apply `baseAlpha` globally to particle sprites/fills.

## Phase 3: UI Controls
1.  **Modify `ui.js`:** Create a new accordion or section under "WORLD" titled "AESTHETICS".
2.  Add range sliders for the four new parameters.
3.  Sync sliders with `cmd:updateRender` events.

## Phase 4: Presets Update
1.  Update `persistenceEngine.js` to save/load `renderConfig` alongside `worldConfig`.
