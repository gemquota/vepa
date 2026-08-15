// ============================================================================
// VEPA v4 — Simulation Context
// The explicit, portable set of tunables a solver tick may consult. solve()
// takes one of these as its final argument and never reads module-level
// mutable state — so the same world runs identically in the main thread, a
// Web Worker, a Node process, or a server. The app layer builds contexts from
// the live runtimeConfig singleton via simContextFromRuntimeConfig().
// ============================================================================

import { STAR_MASS } from '../constants.js';
import { createWorldParams } from '../state/worldParams.js';

// Static baseline — identical to a fresh runtimeConfig, but immutable (frozen)
// and free of any module-level mutable state.
export const SIM_CONTEXT_DEFAULTS = Object.freeze({
  worldParams: createWorldParams(),
  starMass: STAR_MASS,     // mass threshold for gravitational collapse (star)
  forceScale: 1.0,         // global force multiplier applied before clamping
  maxForce: 50.0,          // force clamp ceiling (must match solver MAX_FORCE)
  dragMultiplier: 1.0,     // global velocity damping multiplier (0.8–1.0)
  birthRate: 1.0,          // REPRO law synergy multiplier
  deathRate: 1.0,          // LIFE law synergy multiplier
});

/**
 * Build a simulation context, merging caller overrides over the baseline.
 * @param {Partial<typeof SIM_CONTEXT_DEFAULTS>} [overrides]
 * @returns {{ worldParams: object, starMass: number, forceScale: number,
 *   maxForce: number, dragMultiplier: number, birthRate: number, deathRate: number }}
 */
export function createSimContext(overrides = {}) {
  return {
    worldParams: overrides.worldParams ?? SIM_CONTEXT_DEFAULTS.worldParams,
    starMass: overrides.starMass ?? SIM_CONTEXT_DEFAULTS.starMass,
    forceScale: overrides.forceScale ?? SIM_CONTEXT_DEFAULTS.forceScale,
    maxForce: overrides.maxForce ?? SIM_CONTEXT_DEFAULTS.maxForce,
    dragMultiplier: overrides.dragMultiplier ?? SIM_CONTEXT_DEFAULTS.dragMultiplier,
    birthRate: overrides.birthRate ?? SIM_CONTEXT_DEFAULTS.birthRate,
    deathRate: overrides.deathRate ?? SIM_CONTEXT_DEFAULTS.deathRate,
  };
}

/**
 * Build a context mirroring the live runtimeConfig tunables (WORLD panel
 * sliders, goal-engine knobs). Use at the app boundary so the solver stays
 * isolated from the mutable singleton.
 * @param {{ worldParams: object, starMass: number, forceScale: number,
 *   maxForce: number, dragMultiplier: number, birthRate: number, deathRate: number }} runtimeConfig
 */
export function simContextFromRuntimeConfig(runtimeConfig) {
  return createSimContext({
    worldParams: runtimeConfig.worldParams,
    starMass: runtimeConfig.starMass,
    forceScale: runtimeConfig.forceScale,
    maxForce: runtimeConfig.maxForce,
    dragMultiplier: runtimeConfig.dragMultiplier,
    birthRate: runtimeConfig.birthRate,
    deathRate: runtimeConfig.deathRate,
  });
}
