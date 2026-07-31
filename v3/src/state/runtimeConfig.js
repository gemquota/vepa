/**
 * VEPA v3 — Mutable runtime tunables
 * Shared across modules so settings sliders take effect without rebuilds.
 */
export const runtimeConfig = {
  starMass: 12,        // mass threshold for gravitational collapse (star)
  visualScale: 1.0,    // global particle size multiplier
  globalAlpha: 1.0,    // global particle opacity multiplier
  simSpeed: 1.0,       // physics time-step multiplier
};
