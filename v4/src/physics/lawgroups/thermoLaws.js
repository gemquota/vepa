// ============================================================================
// VEPA v4 — Thermodynamics Law Group
// ADIABATIC / COMPRESSION / EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY
// Stateless per-particle and pairwise law functions over the flat particle
// buffer. These laws mutate buffer state directly and return null. Never
// write NaN/Infinity.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D, LAW_INDEXES, DNA_RANGES } from '../../constants.js';
import { isSet } from '../../state/lawState.js';
import { getDNAFloat } from '../../dna/dnaBuffer.js';
import { buffer_global, readDNA, worldParams } from '../lawsState.js';

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function nanGuard(v) {
  return Number.isFinite(v) ? v : 0;
}

/**
 * ADIABATIC — convert kinetic energy to TEMPERATURE, conserving total energy:
 * damp speed by a small fraction and add the removed kinetic energy to the
 * particle's temperature. Returns the velocity-reduction force.
 */
export function applyAdiabatic(view, iBase, k) {
  const vx = view[iBase + S.VEL_X];
  const vy = view[iBase + S.VEL_Y];
  const vz = view[iBase + S.VEL_Z];
  const speed = Math.hypot(vx, vy, vz);
  if (speed < 1e-9 || k <= 0) return null;
  const mass = Math.max(nanGuard(view[iBase + S.MASS]), 0.001);
  const dv = Math.min(speed * k, speed * 0.9);
  const newSpeed = speed - dv;
  const removed = 0.5 * mass * (speed * speed - newSpeed * newSpeed);
  view[iBase + S.TEMPERATURE] = nanGuard((view[iBase + S.TEMPERATURE] || 0) + removed);
  const damp = dv / speed;
  return {
    ax: clamp(nanGuard(-vx * damp), -50, 50),
    ay: clamp(nanGuard(-vy * damp), -50, 50),
    az: clamp(nanGuard(-vz * damp), -50, 50),
  };
}

/**
 * COMPRESSION — when dist < (rI + rJ) * 2, shrink both RADII slightly and
 * raise both TEMPERATUREs (pressure squeeze).
 */
export function applyCompression(view, iBase, jBase, dist, k) {
  const rI = view[iBase + S.RADIUS];
  const rJ = view[jBase + S.RADIUS];
  if (dist >= (rI + rJ) * 2) return null;
  const shrinkI = Math.min(rI * k, rI * 0.25);
  const shrinkJ = Math.min(rJ * k, rJ * 0.25);
  const dT = k;
  view[iBase + S.RADIUS] = nanGuard(Math.max(0.02, rI - shrinkI));
  view[jBase + S.RADIUS] = nanGuard(Math.max(0.02, rJ - shrinkJ));
  view[iBase + S.TEMPERATURE] = nanGuard((view[iBase + S.TEMPERATURE] || 0) + dT);
  view[jBase + S.TEMPERATURE] = nanGuard((view[jBase + S.TEMPERATURE] || 0) + dT);
  return null;
}

/**
 * EXPANSION — when TEMPERATURE < 0.3, grow RADIUS toward the DNA BASE_RADIUS
 * (clamped) and cool slightly.
 */
export function applyExpansion(view, iBase, k) {
  const t = view[iBase + S.TEMPERATURE];
  if (t >= 0.3) return null;
  const r = view[iBase + S.RADIUS];
  const base = view[iBase + S.DNA_CACHE_START + D.BASE_RADIUS];
  if (base > r) {
    const growth = clamp((base - r) * k, 0, base - r);
    view[iBase + S.RADIUS] = nanGuard(r + growth);
  }
  view[iBase + S.TEMPERATURE] = nanGuard(t - k * 0.1);
  return null;
}

/**
 * EQUILIBRIUM — symmetric conduction: exchange TEMPERATURE toward the pair
 * mean, conserving total.
 */
export function applyEquilibrium(view, iBase, jBase, k) {
  const tI = view[iBase + S.TEMPERATURE] || 0;
  const tJ = view[jBase + S.TEMPERATURE] || 0;
  const dt = (tJ - tI) * k;
  view[iBase + S.TEMPERATURE] = nanGuard(tI + dt);
  view[jBase + S.TEMPERATURE] = nanGuard(tJ - dt);
  return null;
}

/**
 * LATENT_HEAT — phase buffering: hot particles convert TEMPERATURE to ENERGY,
 * cold particles convert ENERGY back to TEMPERATURE.
 */
export function applyLatentHeat(view, iBase, k) {
  const t = view[iBase + S.TEMPERATURE] || 0;
  const energy = view[iBase + S.ENERGY] || 0;
  if (t > 1.0) {
    const dT = clamp((t - 1.0) * k, 0, t - 1.0);
    view[iBase + S.TEMPERATURE] = nanGuard(t - dT);
    view[iBase + S.ENERGY] = nanGuard(energy + dT);
  } else if (t < -0.5) {
    const want = clamp((-0.5 - t) * k, 0, -0.5 - t);
    const dT = Math.min(want, Math.max(0, energy));
    view[iBase + S.TEMPERATURE] = nanGuard(t + dT);
    view[iBase + S.ENERGY] = nanGuard(energy - dT);
  }
  return null;
}

/**
 * RUNAWAY — positive feedback: TEMPERATURE > 0.8 grows quadratically.
 */
export function applyRunaway(view, iBase, k) {
  const t = view[iBase + S.TEMPERATURE] || 0;
  if (t > 0.8) {
    const excess = t - 0.8;
    view[iBase + S.TEMPERATURE] = nanGuard(t + excess * excess * k);
  }
  return null;
}

// ============================================================================
// 11. HEAT
// ============================================================================
export function applyHeat(p1Ptr, stride, dt) {
  const buf = buffer_global;
  const temp = buf[p1Ptr + S.TEMPERATURE];
  const energyEfficiency = readDNA(p1Ptr, D.ENERGY_EFFICIENCY);

  if (temp < 0.01) return { ax: 0, ay: 0, az: 0 };

  const thermalScale = Math.sqrt(temp) * energyEfficiency * dt;
  const t = performance.now();
  const r1 = Math.sin(t * 12.9898 + p1Ptr * 78.233) * 43758.5453;
  const r2 = Math.sin(t * 78.233 + p1Ptr * 12.9898) * 43758.5453;
  const r3 = Math.sin(t * 43.111 + p1Ptr * 34.567) * 43758.5453;
  const n1 = (r1 - Math.floor(r1)) * 2.0 - 1.0;
  const n2 = (r2 - Math.floor(r2)) * 2.0 - 1.0;
  const n3 = (r3 - Math.floor(r3)) * 2.0 - 1.0;

  buf[p1Ptr + S.VEL_X] += n1 * thermalScale;
  buf[p1Ptr + S.VEL_Y] += n2 * thermalScale;
  buf[p1Ptr + S.VEL_Z] += n3 * thermalScale;
  buf[p1Ptr + S.TEMPERATURE] *= 0.99;

  return { ax: 0, ay: 0, az: 0 };
}

// ============================================================================
// 12. COLD
// ============================================================================
export function applyCold(p1Ptr, stride) {
  const buf = buffer_global;
  const temp = buf[p1Ptr + S.TEMPERATURE];

  if (temp >= 0.5) return { ax: 0, ay: 0, az: 0 };

  const coldFactor = 1.0 - (0.5 - temp);
  const damping = clamp(coldFactor, 0.1, 1.0);

  buf[p1Ptr + S.VEL_X] *= damping;
  buf[p1Ptr + S.VEL_Y] *= damping;
  buf[p1Ptr + S.VEL_Z] *= damping;

  for (let offset = S.VEL_X; offset <= S.VEL_Z; offset++) {
    if (buf[p1Ptr + offset] !== buf[p1Ptr + offset]) buf[p1Ptr + offset] = 0;
  }

  return { ax: 0, ay: 0, az: 0 };
}

// ============================================================================
// 21. HEAT TRANSFER
// ============================================================================
export function applyHeatTransfer(lawState, view, iBase, jBase, dist, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.HEAT) && !isSet(lawState, LAW_INDEXES.COLD)) return; // HEAT=25, COLD=26

  const tempI = view[iBase + S.TEMPERATURE];
  const tempJ = view[jBase + S.TEMPERATURE];
  const diff = tempI - tempJ;

  if (isSet(lawState, LAW_INDEXES.HEAT)) {
    const rate = 0.01 * dt * synergy / (worldParams().HEAT_CAPACITY ?? 1);
    view[iBase + S.TEMPERATURE] -= diff * rate;
    view[jBase + S.TEMPERATURE] += diff * rate;
  }

  if (isSet(lawState, LAW_INDEXES.COLD) && tempJ > tempI) {
    const rate = 0.015 * dt * synergy / (worldParams().HEAT_CAPACITY ?? 1);
    const tDec2 = -diff * rate;
    const tInc2 = -diff * rate;
    view[jBase + S.TEMPERATURE] -= (tDec2 !== tDec2) ? 0 : tDec2;
    view[iBase + S.TEMPERATURE] += (tInc2 !== tInc2) ? 0 : tInc2;
  }
}

// ============================================================================
// 21b. THERMAL JITTER (HEAT) — hot particles get kinetic-theory random kicks
// ============================================================================
export function applyThermalJitter(lawState, view, base, dt, synergy, prng) {
  if (!isSet(lawState, LAW_INDEXES.HEAT)) return; // HEAT=25
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(temp) || temp <= 0.5) return;
  const kick = temp * 0.01 * dt * synergy;
  view[base + S.VEL_X] += (prng() - 0.5) * 2 * kick;
  view[base + S.VEL_Y] += (prng() - 0.5) * 2 * kick;
  view[base + S.VEL_Z] += (prng() - 0.5) * 2 * kick;
}

// ============================================================================
// 21c. COLD DAMPING — cold particles (< 0.5 TEMP) are slowed toward stillness
// ============================================================================
export function applyColdDamping(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.COLD)) return; // COLD=26
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(temp) || temp >= 0.5) return;
  const damp = Math.max(0, 1 - (0.5 - temp) * 0.1 * dt * synergy);
  view[base + S.VEL_X] *= damp;
  view[base + S.VEL_Y] *= damp;
  view[base + S.VEL_Z] *= damp;
}

// ============================================================================
// 22. CONVECTION
// ============================================================================
export function applyConvection(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.CONVECTION)) return; // CONVECTION=27

  const temp = view[base + S.TEMPERATURE];
  const buoyancy = (temp - 0.5) * 0.001 * dt * synergy;
  if (Number.isFinite(buoyancy)) {
    view[base + S.VEL_Y] += buoyancy;
  }
}

// ============================================================================
// 35. MELT — High temp particles lose mass
// ============================================================================
export function applyMelt(lawState, view, base, dt, synergy, dnaBuffer) {
  if (!isSet(lawState, LAW_INDEXES.MELT)) return;
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(temp)) return;
  const stiffness = view[base + S.DNA_CACHE_START + D.STIFFNESS];
  if (!Number.isFinite(stiffness)) return;
  const speciesId = view[base + S.SPECIES_ID];
  const range = DNA_RANGES[D.STIFFNESS] || { min: 0.1, max: 5, default: 1 };
  const baseline = dnaBuffer && dnaBuffer.length
    ? getDNAFloat(dnaBuffer, speciesId, D.STIFFNESS, range.min, range.max)
    : (stiffness > 0 ? stiffness : range.default);
  if (temp >= 0.7) {
    // Melt (per HELP_DB): heat softens the particle — effective stiffness
    // decays toward a 20% floor while hot. Real melting loses rigidity, not
    // mass, and it is reversible below the melt point.
    const floor = baseline * 0.2;
    const rate = (temp - 0.7) * 0.02 * dt * synergy;
    view[base + S.DNA_CACHE_START + D.STIFFNESS] = Math.max(floor, stiffness - rate);
  } else if (stiffness < baseline - 1e-6) {
    // Re-solidify: stiffness recovers toward the species baseline.
    view[base + S.DNA_CACHE_START + D.STIFFNESS] = Math.min(baseline, stiffness + 0.005 * dt * synergy);
  }
}

// ============================================================================
// 36. BOIL — Very hot particles eject mass as energetic vapor
// ============================================================================
export function applyBoil(lawState, view, base, dt, synergy, prng) {
  if (!isSet(lawState, LAW_INDEXES.BOIL)) return;
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(temp) || temp < 0.9) return;
  const mass = view[base + S.MASS];
  const boilRate = (temp - 0.9) * 0.02 * dt * synergy;
  const ejectMass = mass * boilRate;
  if (ejectMass > 0.01) {
    // Boil: vaporizing mass is energetic — the ejected fraction becomes
    // kinetic energy and costs latent heat (ENERGY), with a mass floor so
    // particles never boil away completely.
    view[base + S.MASS] = Math.max(0.02, mass - ejectMass);
    const rnd = prng || Math.random;
    view[base + S.VEL_X] += (rnd() - 0.5) * ejectMass * 10;
    view[base + S.VEL_Y] += (rnd() - 0.5) * ejectMass * 10;
    view[base + S.VEL_Z] += (rnd() - 0.5) * ejectMass * 5;
    view[base + S.ENERGY] = Math.max(0, (view[base + S.ENERGY] || 0) - ejectMass * 20);
    view[base + S.TEMPERATURE] -= boilRate * 0.3;
  }
}

// ============================================================================
// 37. CONDENSE — Cool particles gain mass
// ============================================================================
export function applyCondense(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.CONDENSE)) return;
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(temp) || temp > 0.3) return;
  const mass = view[base + S.MASS];
  const condenseRate = (0.3 - temp) * 0.005 * dt * synergy;
  view[base + S.MASS] = mass + condenseRate;
  // Real-life condensation releases latent heat — the particle warms as it
  // gains vapor mass (clamped so it can't cross into boiling).
  view[base + S.TEMPERATURE] = Math.min(0.9, temp + condenseRate * 2);
}

// ============================================================================
// 38. DEPOSIT — Gas directly solidifies on cold particles
// ============================================================================
export function applyDeposit(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.DEPOSIT)) return;
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(temp) || temp > 0.2) return;
  const mass = view[base + S.MASS];
  const depositRate = (0.2 - temp) * 0.01 * dt * synergy;
  view[base + S.MASS] = mass + depositRate * 3;
  view[base + S.RADIUS] = view[base + S.RADIUS] + depositRate * 0.5;
  // Real-life deposition (frost) is exothermic — it skips the liquid phase,
  // builds solid mass fast, and releases latent heat as it forms.
  view[base + S.TEMPERATURE] = Math.min(0.9, temp + depositRate * 2);
}

// ============================================================================
// 39. EXOTHERMIC — Energy amplification for all reactions
// ============================================================================
export function applyExothermic(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.EXOTHERMIC)) return;
  const energy = view[base + S.ENERGY];
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(energy) || !Number.isFinite(temp)) return;
  // Real-life exothermic reactions release heat while the reaction runs —
  // a bounded steady release (the old ENERGY ×= 1.1 was an unbounded
  // exponential). Capped at the ENERGY ceiling and below boiling.
  view[base + S.ENERGY] = Math.min(200, energy + 0.05 * synergy * dt);
  view[base + S.TEMPERATURE] = Math.min(0.9, temp + 0.01 * synergy * dt);
}

// ============================================================================
// Legacy thermo laws — migrated from laws.js (P0: laws.js → lawgroups)
// ============================================================================

// ============================================================================
// 56. PHASE_RADIATION — Hot particles radiate energy as light
// ============================================================================
export function applyPhaseRadiation(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.PHASE_RADIATION)) return;
  const temp = view[base + S.TEMPERATURE];
  const energy = view[base + S.ENERGY];
  if (!Number.isFinite(temp) || !Number.isFinite(energy)) return;
  // Batch-08 confirmation ("follow irl behaviour"): Stefan-Boltzmann blackbody
  // emission — every warm body radiates, hot bodies radiate disproportionately
  // (T^4 curve), cooling both TEMPERATURE and ENERGY and glowing via SIGNAL.
  if (temp > 0.05) {
    const radiated = temp * temp * temp * temp * 0.05 * dt * synergy;
    if (radiated > 0) {
      // Energy floor 0: radiation cools and dims a body, it can never drive
      // ENERGY negative (the unclamped drain let hot bodies crater ENERGY
      // below zero every tick once multiple heat sources compounded).
      view[base + S.ENERGY] = Math.max(0, energy - radiated);
      view[base + S.TEMPERATURE] = Math.max(0, view[base + S.TEMPERATURE] - radiated);
      view[base + S.SIGNAL] = Math.min(1, view[base + S.SIGNAL] + radiated);
    }
  }
}

// ============================================================================
// 57. SUBLIMATION — Solid particles skip liquid phase
// ============================================================================
export function applySublimation(lawState, view, base, dt, synergy, prng) {
  if (!isSet(lawState, LAW_INDEXES.SUBLIMATION)) return;
  const temp = view[base + S.TEMPERATURE];
  const mass = view[base + S.MASS];
  const energy = view[base + S.ENERGY];
  if (!Number.isFinite(temp) || !Number.isFinite(mass) || !Number.isFinite(energy)) return;
  // Batch-08 confirmation ("sure"): documented low-mass + high-energy gate;
  // mass can sublimate almost fully away (floor 0.02); burst uses the sim PRNG.
  if (temp > 0.5 && energy > 50 && mass > 0.02) {
    const sublRate = (temp - 0.5) * 0.005 * dt * synergy;
    view[base + S.MASS] = Math.max(0.02, view[base + S.MASS] - sublRate);
    view[base + S.VEL_X] += (prng() - 0.5) * sublRate * 5;
    view[base + S.VEL_Y] += (prng() - 0.5) * sublRate * 5;
    view[base + S.ENERGY] = Math.max(0, view[base + S.ENERGY] - sublRate * 20);
    view[base + S.TEMPERATURE] = Math.max(0, view[base + S.TEMPERATURE] - sublRate * 0.5);
  }
}
