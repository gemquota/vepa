// ============================================================================
// VEPA v4 — Metaphysics Law Group (META)
// Per-particle and pairwise law functions: Consciousness, Perception,
// Synchronicity.
// Each function returns a force object {ax, ay, az} or null. State mutations
// are NaN-guarded and clamped before being written back to the buffer.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D, LAW_INDEXES } from '../../constants.js';
import { isSet } from '../../state/lawState.js';
import { getFateTime } from '../lawsState.js';

function clamp(v, lo, hi) {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

function nanGuard(v) {
  return Number.isFinite(v) ? v : 0;
}

/**
 * Consciousness — slow self-regeneration.
 * Particles steadily regenerate ENERGY (capped at 200) and MEMORY (capped at
 * 1), the self-model that feeds navigation and other information laws.
 */
export function applyConsciousness(view, iBase, k) {
  view[iBase + S.ENERGY] = clamp(nanGuard(view[iBase + S.ENERGY] + 0.02 * k), 0, 200);
  view[iBase + S.MEMORY] = clamp(nanGuard(view[iBase + S.MEMORY] + 0.005 * k), 0, 1);
  return null;
}

/**
 * Perception — extended sensing.
 * Within twice the NEIGHBORHOOD_RADIUS, gently align this particle's velocity
 * toward the neighbor's velocity (awareness at a distance).
 */
export function applyPerception(view, iBase, jBase, dist, k) {
  const radius = view[iBase + S.DNA_CACHE_START + D.NEIGHBORHOOD_RADIUS];
  if (!(dist < radius * 2)) return null;
  return {
    ax: nanGuard((view[jBase + S.VEL_X] - view[iBase + S.VEL_X]) * 0.01 * k),
    ay: nanGuard((view[jBase + S.VEL_Y] - view[iBase + S.VEL_Y]) * 0.01 * k),
    az: nanGuard((view[jBase + S.VEL_Z] - view[iBase + S.VEL_Z]) * 0.01 * k),
  };
}

/**
 * Synchronicity — resonant phase alignment.
 * When PHASE_1 values are close (< 0.3), pull velocities together and move
 * both phases toward the pair mean (resonant entrainment).
 */
export function applySynchronicity(view, iBase, jBase, k) {
  const p1i = view[iBase + S.PHASE_1];
  const p1j = view[jBase + S.PHASE_1];
  if (!(Math.abs(p1i - p1j) < 0.3)) return null;
  const mean = (p1i + p1j) * 0.5;
  const t = clamp(k, 0, 1);
  view[iBase + S.PHASE_1] = nanGuard(p1i + (mean - p1i) * t);
  view[jBase + S.PHASE_1] = nanGuard(p1j + (mean - p1j) * t);
  return {
    ax: nanGuard((view[jBase + S.VEL_X] - view[iBase + S.VEL_X]) * 0.02 * k),
    ay: nanGuard((view[jBase + S.VEL_Y] - view[iBase + S.VEL_Y]) * 0.02 * k),
    az: nanGuard((view[jBase + S.VEL_Z] - view[iBase + S.VEL_Z]) * 0.02 * k),
  };
}

// ============================================================================
// Legacy metaphysics laws — migrated from laws.js (P0: laws.js → lawgroups)
// ============================================================================

// ============================================================================
// 23. TIME DILATION
// ============================================================================
export function applyTimeDilation(lawState, view, base, synergy) {
  if (!isSet(lawState, LAW_INDEXES.TIME_DILATION)) return 1.0; // TIME_DILATION=30
  const soul = view[base + S.SOUL];
  return 1.0 - soul * 0.3 * synergy;
}

// ============================================================================
// 24. DIMENSIONALITY
// ============================================================================
export function applyDimensionality(lawState, view, base, prng, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.DIMENSIONALITY)) return 0; // DIMENSIONALITY=31
  // Batch-08 confirmation ("make it stronger"): 0.1 -> 0.3 Z-drift amplitude.
  const force = (prng() - 0.5) * 0.3 * synergy * dt;
  view[base + S.VEL_Z] += force;
  return force;
}

// ============================================================================
// 25. CHAOS
// ============================================================================
export function applyChaos(lawState, view, base, prng, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.CHAOS)) return; // CHAOS=32
  const force = (prng() - 0.5) * 0.5 * synergy * dt;
  view[base + S.VEL_X] += force;
  view[base + S.VEL_Y] += force;
  view[base + S.VEL_Z] += force * 0.5;
  // Thermal chaos (batch-09 agent decision): chaos also stirs TEMPERATURE,
  // flickering hot/cold pockets that feed HEAT / PHASE_RADIATION dynamics.
  const tempStir = (prng() - 0.5) * 0.02 * synergy * dt;
  const temp = view[base + S.TEMPERATURE] + tempStir;
  view[base + S.TEMPERATURE] = Number.isFinite(temp) ? Math.max(0, Math.min(1, temp)) : view[base + S.TEMPERATURE];
}

// ============================================================================
// 26. ORDER
// ============================================================================
export function applyOrder(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.ORDER)) return null; // ORDER=33
  // Batch-09 confirmation ("strongly"): alignment 0.005 -> 0.04, range
  // ~100 -> ~200 units, so coherent flow actually emerges.
  if (distSq > 40000) return null;

  const strength = 0.04 * synergy;
  return {
    ax: view[jBase + S.VEL_X] * strength,
    ay: view[jBase + S.VEL_Y] * strength,
    az: view[jBase + S.VEL_Z] * strength,
  };
}

// ============================================================================
// 27. FATE
// ============================================================================
// Fate (batch-09 redesign — user: "boring and similar to existing laws"):
// the old pairwise same-species attraction duplicated AFFINITY. Now every
// species has a drifting "destiny" point (golden-angle phase per species,
// slowly wandering on a clock) that its members are gently pulled toward —
// species migrate and segregate toward their own fate.

export function applyFate(lawState, view, base, px, py, pz, worldSize, synergy) {
  if (!isSet(lawState, LAW_INDEXES.FATE)) return null; // FATE=34
  const species = view[base + S.SPECIES_ID] || 0;
  const phase = species * 2.39996323; // golden-angle offset, unique per species
  const t = getFateTime() * 0.0004;
  const span = worldSize * 0.32;
  let dx = worldSize * 0.5 + span * Math.sin(t + phase) - px;
  let dy = worldSize * 0.5 + span * Math.cos(t * 0.8 + phase * 1.3) - py;
  let dz = worldSize * 0.5 + span * Math.sin(t * 0.6 + phase * 1.7) - pz;
  // Shortest toroidal path to the destiny point
  if (dx > worldSize * 0.5) dx -= worldSize; else if (dx < -worldSize * 0.5) dx += worldSize;
  if (dy > worldSize * 0.5) dy -= worldSize; else if (dy < -worldSize * 0.5) dy += worldSize;
  if (dz > worldSize * 0.5) dz -= worldSize; else if (dz < -worldSize * 0.5) dz += worldSize;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (dist < 1) return { ax: 0, ay: 0, az: 0 };
  const strength = 0.02 * synergy;
  return {
    ax: (dx / dist) * strength,
    ay: (dy / dist) * strength,
    az: (dz / dist) * strength,
  };
}

// ============================================================================
// 28. WILL (Self-propulsion)
// ============================================================================
export function applyWill(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.WILL)) return; // WILL=35

  const vx = view[base + S.VEL_X];
  const vy = view[base + S.VEL_Y];
  const vz = view[base + S.VEL_Z];
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  if (speed < 0.01) return;

  const boost = 0.01 * dt * synergy;
  const boostX = (vx / speed) * boost;
  const boostY = (vy / speed) * boost;
  const boostZ = (vz / speed) * boost;
  if (Number.isFinite(boostX)) view[base + S.VEL_X] += boostX;
  if (Number.isFinite(boostY)) view[base + S.VEL_Y] += boostY;
  if (Number.isFinite(boostZ)) view[base + S.VEL_Z] += boostZ;
}

// ============================================================================
// 29. SOUL
// ============================================================================
export function applySoul(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.SOUL_LAW)) return; // SOUL_LAW=36
  if (distSq > 10000) return;

  const speciesI = view[iBase + S.SPECIES_ID];
  const speciesJ = view[jBase + S.SPECIES_ID];
  if (speciesI !== speciesJ) return;

  const soulJ = view[jBase + S.SOUL];
  const soulI = view[iBase + S.SOUL];
  const transfer = soulJ * 0.001 * synergy;
  if (Number.isFinite(transfer) && transfer > 0) {
    // Batch-10 (agent decision): soul is a conserved shared field — the giver
    // loses what the receiver gains, and both are capped to [0, 1] so
    // TIME_DILATION's 70% max slowdown stays the ceiling.
    view[iBase + S.SOUL] = Math.min(1, soulI + transfer);
    view[jBase + S.SOUL] = Math.max(0, soulJ - transfer);
  }
}

// Soul dissipates slowly when it is not being replenished (batch-10 decision).
export function applySoulDecay(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.SOUL_LAW)) return; // SOUL_LAW=36
  const soul = view[base + S.SOUL];
  if (!Number.isFinite(soul) || soul <= 0) return;
  view[base + S.SOUL] = Math.max(0, soul * (1 - 0.002 * dt * synergy));
}

// ============================================================================
// 30. MIND (Collective hivemind)
// ============================================================================
export function applyMind(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.MIND)) return null; // MIND=37
  if (distSq > 40000) return null;

  const speciesI = view[iBase + S.SPECIES_ID];
  const speciesJ = view[jBase + S.SPECIES_ID];
  if (speciesI !== speciesJ) return null;

  const strength = 0.01 * synergy;
  const invDist = 1 / Math.sqrt(distSq);
  return { ax: 0, ay: 0, az: 0, signalBoost: strength * invDist };
}

// ============================================================================
// 40. TELEPATHY — Instant signal sharing within species
// ============================================================================
export function applyTelepathy(lawState, view, iBase, jBase, distSq, synergy, dt) {
  if (!isSet(lawState, LAW_INDEXES.TELEPATHY)) return null;
  const speciesI = view[iBase + S.SPECIES_ID];
  const speciesJ = view[jBase + S.SPECIES_ID];
  if (speciesI !== speciesJ) return null;
  const signalJ = view[jBase + S.SIGNAL];
  if (!Number.isFinite(signalJ)) return null;
  const transfer = signalJ * 0.05 * synergy;
  if (transfer > 0.001) {
    view[iBase + S.SIGNAL] += transfer;
    // The receiver pays a slight energy cost for the shared channel.
    const energy = view[iBase + S.ENERGY];
    if (Number.isFinite(energy)) {
      view[iBase + S.ENERGY] = Math.max(0, energy - 0.02 * synergy * (dt || 1));
    }
  }
  return null;
}

// ============================================================================
// 41. CLAIRVOYANCE — Predictive steering toward future positions
// ============================================================================
export function applyClairvoyance(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy, dt) {
  if (!isSet(lawState, LAW_INDEXES.CLAIRVOYANCE)) return null;
  if (dist < 1) return null;
  // Predict where neighbor will be based on its velocity
  const vx_j = view[jBase + S.VEL_X];
  const vy_j = view[jBase + S.VEL_Y];
  const vz_j = view[jBase + S.VEL_Z];
  const predDx = (dx + vx_j * 3) - dx;
  const predDy = (dy + vy_j * 3) - dy;
  const predDz = (dz + vz_j * 3) - dz;
  const strength = 0.02 * synergy;
  const invDist = 1.0 / dist;
  // Sensing the future costs a little energy (confirmed batch-13).
  const energy = view[iBase + S.ENERGY];
  if (Number.isFinite(energy)) {
    view[iBase + S.ENERGY] = Math.max(0, energy - 0.02 * synergy * (dt || 1));
  }
  return {
    ax: predDx * invDist * strength,
    ay: predDy * invDist * strength,
    az: predDz * invDist * strength,
  };
}

// ============================================================================
// 42. PRECOGNITION — Collision anticipation and avoidance
// ============================================================================
export function applyPrecognition(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy, dt) {
  if (!isSet(lawState, LAW_INDEXES.PRECOGNITION)) return null;
  if (dist < 1 || dist > 50) return null;
  // Check if on collision course
  const vx_i = view[iBase + S.VEL_X];
  const vy_i = view[iBase + S.VEL_Y];
  const vz_i = view[iBase + S.VEL_Z];
  const relVx = view[jBase + S.VEL_X] - vx_i;
  const relVy = view[jBase + S.VEL_Y] - vy_i;
  const relVz = view[jBase + S.VEL_Z] - vz_i;
  const dot = dx * relVx + dy * relVy + dz * relVz;
  if (dot > 0) return null; // Moving apart
  const strength = 0.05 * synergy;
  const invDist = 1.0 / dist;
  // Anticipating the collision costs a little energy (confirmed batch-13).
  const energy = view[iBase + S.ENERGY];
  if (Number.isFinite(energy)) {
    view[iBase + S.ENERGY] = Math.max(0, energy - 0.02 * synergy * (dt || 1));
  }
  // Avoid by steering perpendicular to approach
  return {
    ax: -(dy * invDist) * strength,
    ay: (dx * invDist) * strength,
    az: 0,
  };
}

// ============================================================================
// 43. ASTRAL — Soul persists as ghost after death
// ============================================================================
export function applyAstral(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.ASTRAL)) return;
  if (view[base + S.DEAD] < 0.5) return; // Only affects dead/soul particles
  const soul = view[base + S.SOUL];
  if (!Number.isFinite(soul) || soul < 0.01) return;
  // Ghost persists, gradually fading
  view[base + S.ALPHA] = soul * 0.5;
  view[base + S.MASS] = soul * 0.1;
  // Ghost forces nearby living particles
  view[base + S.SOUL] *= 0.999;
  if (view[base + S.SOUL] < 0.001) {
    view[base + S.DEAD] = 1.0; // Fully dead, remove
  }
}

/**
 * ASTRAL ghost influence on one living neighbour (called from the solver's
 * soul pass over the spatial grid): the ghost exerts a soft soul-pull on the
 * living, and same-species kin receive a sliver of its soul before it fades
 * away (soul is conserved, matching SOUL_LAW's transfer semantics).
 */
export function applyAstralInfluence(lawState, view, ghostBase, livingBase, dx, dy, dz, dist, synergy, dt) {
  if (!isSet(lawState, LAW_INDEXES.ASTRAL)) return;
  const soul = view[ghostBase + S.SOUL];
  if (!Number.isFinite(soul) || soul < 0.01) return;
  const invDist = 1.0 / Math.max(dist, 0.01);
  const step = (dt || 1);
  // Soft soul-pull: the living drift gently toward the ghost (dx points
  // ghost → living, so negate it).
  const pull = soul * 0.02 * synergy * step;
  view[livingBase + S.VEL_X] -= dx * invDist * pull;
  view[livingBase + S.VEL_Y] -= dy * invDist * pull;
  view[livingBase + S.VEL_Z] -= dz * invDist * pull;
  // Same-species blessing: a conserved sliver of soul passes to living kin.
  if (view[ghostBase + S.SPECIES_ID] === view[livingBase + S.SPECIES_ID]) {
    const gift = soul * 0.002 * synergy * step;
    view[ghostBase + S.SOUL] = Math.max(0, soul - gift);
    view[livingBase + S.SOUL] = Math.min(1, (view[livingBase + S.SOUL] || 0) + gift);
  }
}
