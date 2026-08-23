/**
 * VEPA4 — Mutable runtime tunables
 * Shared across modules so settings sliders, goal-engine adjustments, and
 * signal tuning take effect without rebuilds.
 */
import { createWorldParams } from './worldParams.js';

export const runtimeConfig = {
  starMass: 12,        // mass threshold for gravitational collapse (star)
  visualScale: 1.0,    // global particle size multiplier
  globalAlpha: 1.0,    // global particle opacity multiplier
  simSpeed: 1.0,       // physics time-step multiplier
  // v4 — goal-engine adjustable knobs (bounded by GoalEngine parameter ranges)
  maxForce: 50.0,      // global force clamp ceiling (solver MAX_FORCE is hard cap)
  forceScale: 1.0,     // global force multiplier applied before clamping
  dragMultiplier: 1.0, // global velocity damping multiplier (0.8–1.0)
  birthRate: 1.0,      // REPRO law synergy multiplier (0.01–1.0)
  deathRate: 1.0,      // LIFE law synergy multiplier (0.01–1.0)
  signalScale: 1.0,    // global communication DNA multiplier
  // v8.17 — gravity engine: 'exact' (default, per-pair DNA-aware), 'bh'
  // (Barnes–Hut monopole, O(N log N)), or 'fmm' (BH + quadrupole correction,
  // ~10× more accurate at the same theta). gravTheta is the opening angle
  // (0 = exact traversal; 0.4–0.7 typical). See src/physics/octree.js.
  gravEngine: 'exact',
  gravTheta: 0.5,
  // v9.0 — compute engine: 'cpu' (default solver loop) or 'gpu' (WebGPU
  // compute shader for pairwise force hot loop; falls back to cpu in Node.js).
  // In the browser, 'gpu' offloads gravity + collision + charge forces to a
  // WGSL compute shader with atomic accumulation, cutting the pairwise loop
  // cost by 8-16× at scale.
  computeEngine: 'cpu',
  worldParams: createWorldParams(), // WORLD panel sliders (SPACE/PHYSICS/ENVIRONMENT/BIOLOGY)
};
