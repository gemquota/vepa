/**
 * VEPA4 — World parameter state (single source of truth)
 *
 * All sliders in the WORLD panel map 1:1 onto these definitions. The UI
 * (worldPanel.js) renders from WORLD_PARAM_DEFS, the main thread stores the
 * live state via createWorldParams()/applyWorldParam(), and the solver reads
 * the same state through runtimeConfig.worldParams (shared module instance —
 * VEPA runs the solver on the main thread).
 */
import { WORLD_SIZE, MAX_PARTICLES } from '../constants.js';

export const WORLD_PARAM_DEFS = [
  // ── SPACE ──
  { key: 'WORLD_SIZE', label: 'WORLD SIZE', min: 50, max: 20000, default: WORLD_SIZE, step: 100, group: 'SPACE', subgroup: 'WORLD' },
  { key: 'GROUND_HEIGHT', label: 'GROUND HEIGHT', min: 0, max: 1, default: 0.9, step: 0.05, group: 'SPACE', subgroup: 'WORLD' },
  { key: 'PARTICLE_COUNT', label: 'PARTICLE COUNT', min: 100, max: 20000, default: 1000, step: 100, group: 'SPACE', subgroup: 'POPULATION' },
  { key: 'INITIAL_POP', label: 'INITIAL POPULATION', min: 10, max: 5000, default: 250, step: 10, group: 'SPACE', subgroup: 'POPULATION' },
  { key: 'MAX_POP', label: 'MAX POPULATION', min: 100, max: 50000, default: 5000, step: 100, group: 'SPACE', subgroup: 'POPULATION' },
  { key: 'SHAPE', label: 'DISTRIBUTION', min: 0, max: 1, default: 0, step: 0.05, group: 'SPACE', subgroup: 'DISTRIBUTION' },
  { key: 'SPAWN_CENTRES', label: 'CENTRES', min: 1, max: 64, default: 1, step: 1, group: 'SPACE', subgroup: 'DISTRIBUTION' },
  { key: 'SPAWN_CENTRE_RANDOM', label: 'CENTRE SCATTER', min: 0, max: 1, default: 0.5, step: 0.05, group: 'SPACE', subgroup: 'DISTRIBUTION' },
  { key: 'SPAWN_CENTRE_BIAS', label: 'CENTRE BIAS', min: 0, max: 1, default: 0, step: 0.05, group: 'SPACE', subgroup: 'DISTRIBUTION' },
  // ── PHYSICS ──
  { key: 'GLOBAL_G', label: 'GRAVITY STRENGTH', min: 0, max: 20, default: 1, step: 1, group: 'PHYSICS', subgroup: 'FORCES' },
  { key: 'WIND', label: 'WIND FORCE', min: 0, max: 5, default: 0, step: 0.5, group: 'PHYSICS', subgroup: 'FORCES' },
  { key: 'DAMPING', label: 'MOTION DAMPING %', min: 0, max: 100, default: 0, step: 1, group: 'PHYSICS', subgroup: 'MOTION' },
  { key: 'VISCOSITY', label: 'GLOBAL VISCOSITY', min: 0.5, max: 1, default: 1, step: 0.01, group: 'PHYSICS', subgroup: 'MOTION' },
  { key: 'ENTROPY', label: 'ENTROPY', min: 0, max: 2, default: 1, step: 0.05, group: 'PHYSICS', subgroup: 'MOTION' },
  { key: 'WALL_REFLECT', label: 'WALL REFLECT', min: 0, max: 2, default: 1, step: 0.05, group: 'PHYSICS', subgroup: 'MOTION' }, // 0 = 100% absorption, 1 = 100% reflect, 2 = 200% reflect
  { key: 'RESONANCE_Q', label: 'RESONANCE Q', min: 1, max: 20, default: 10, step: 1, group: 'PHYSICS', subgroup: 'SIGNAL' }, // resonance bandwidth = 1/Q (law-RRP RESONANCE gate)
  // ── ENVIRONMENT ──
  { key: 'HEAT_CAPACITY', label: 'HEAT CAPACITY', min: 0.1, max: 10, default: 1, step: 0.5, group: 'ENVIRONMENT', subgroup: 'THERMAL' },
  { key: 'LIGHT_LEVEL', label: 'LIGHT LEVEL', min: 0, max: 2, default: 0.5, step: 0.1, group: 'ENVIRONMENT', subgroup: 'THERMAL' },
  { key: 'RADIATION_LEVEL', label: 'RADIATION LEVEL', min: 0, max: 5, default: 1, step: 0.5, group: 'ENVIRONMENT', subgroup: 'THERMAL' },
  { key: 'CRITICAL_TEMP', label: 'CRITICAL TEMP', min: 0.05, max: 0.5, default: 0.2, step: 0.05, group: 'ENVIRONMENT', subgroup: 'THERMAL' }, // T_C shared by SUPERCONDUCTIVITY (unbind above) + BOSONIC (BEC below)
  { key: 'SPAWN_RATE', label: 'REGULAR SPAWN /S', min: 0, max: 100, default: 5, step: 1, group: 'ENVIRONMENT', subgroup: 'POPULATION' },
  // ── BIOLOGY ──
  { key: 'SPECIES_INTERACTION', label: 'SPECIES INTERACTION', min: -2, max: 2, default: 1, step: 0.1, group: 'BIOLOGY', subgroup: 'INTERACTION' },
  { key: 'ENERGY_TRANSFER', label: 'ENERGY TRANSFER', min: 0, max: 2, default: 1, step: 0.1, group: 'BIOLOGY', subgroup: 'INTERACTION' },
  { key: 'MUTATION_RATE', label: 'MUTATION RATE', min: 0, max: 5, default: 1, step: 0.1, group: 'BIOLOGY', subgroup: 'LIFE CYCLE' },
  { key: 'DECAY_RATE', label: 'DECAY RATE', min: 0, max: 2, default: 1, step: 0.05, group: 'BIOLOGY', subgroup: 'LIFE CYCLE' },
];

const DEF_BY_KEY = new Map(WORLD_PARAM_DEFS.map((d) => [d.key, d]));

export function clampWorldParam(key, value) {
  const def = DEF_BY_KEY.get(key);
  if (!def) return value;
  let v = Number.isFinite(value) ? value : def.default;
  return Math.min(def.max, Math.max(def.min, v));
}

/** Fresh world-param state (all defaults). */
export function createWorldParams() {
  const state = {};
  for (const d of WORLD_PARAM_DEFS) state[d.key] = d.default;
  return state;
}

/** Apply one slider change, clamped to the param's range. Returns new state. */
export function applyWorldParam(state, key, value) {
  const def = DEF_BY_KEY.get(key);
  if (!def) return state;
  return { ...state, [key]: clampWorldParam(key, value) };
}

/** Caps enforced when spawning: PARTICLE_COUNT / MAX_POP bound the buffer. */
export function spawnCaps(state) {
  return {
    hardCap: Math.min(Math.round(clampWorldParam('PARTICLE_COUNT', state.PARTICLE_COUNT)), MAX_PARTICLES),
    softCap: Math.min(Math.round(clampWorldParam('MAX_POP', state.MAX_POP)), MAX_PARTICLES),
  };
}

export function worldParamDef(key) {
  return DEF_BY_KEY.get(key) || null;
}
