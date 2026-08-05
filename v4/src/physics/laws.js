// ============================================================================
// VEPA v3 — Law Force Computation
// Per-law force functions for the physics engine. Each function reads from
// the particle buffer and returns force contributions as {ax, ay, az}.
//
// Convention:
//   p1Ptr = subject particle base offset (index * stride)
//   p2Ptr = neighbor particle base offset (index * stride)
//   stride = PARTICLE_STRIDE (100)
//   DNA values accessed via: buffer[p1Ptr + DNA_CACHE_START + DNA_INDEX]
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES, DNA_INDEXES, DNA_RANGES, LAW_INDEXES } from '../constants.js';
import { isSet } from '../state/lawState.js';
import { runtimeConfig } from '../state/runtimeConfig.js';

/** Live world-param state (WORLD panel sliders). */
function worldParams() {
  return runtimeConfig.worldParams || {};
}

const S = STRIDE_INDEXES;
const D = DNA_INDEXES;
const DNA_BASE = S.DNA_CACHE_START;

/**
 * Read a species genome param (DNA buffer, 64×64 Uint16) as a float.
 * Genetics params 42-47 live only in the species genome, not the stride cache.
 */
function readSpeciesDNAParam(buf, sp, idx) {
  if (!buf) return 0;
  const raw = buf[sp * 64 + idx];
  if (idx < DNA_RANGES.length) {
    const { min, max } = DNA_RANGES[idx];
    return min + (raw / 65535) * (max - min);
  }
  return raw / 65535;
}

/** Write a float back into the species genome (quantized to uint16). */
function writeSpeciesDNAParam(buf, sp, idx, value) {
  if (!buf) return;
  const r = DNA_RANGES[idx] || { min: -1, max: 1 };
  const clamped = Math.max(r.min, Math.min(r.max, value));
  const normalized = (clamped - r.min) / (r.max - r.min);
  buf[sp * 64 + idx] = Math.round(normalized * 65535);
}

let buffer_global = null;

// HISTORY law — coarse spatial memory field (12^3 cells), reset per buffer
const HISTORY_DIM = 12;
const HISTORY_DECAY = 0.97;
let historyField = null;
let historyLast = null;
let historyTick = 0;
let historyBufferRef = null;
let historyComX = HISTORY_DIM * 0.5;
let historyComY = HISTORY_DIM * 0.5;
let historyComZ = HISTORY_DIM * 0.5;

// SINGULARITY law — collapse threshold (mass units)
const SINGULARITY_MASS = 20;

/**
 * Set the shared particle buffer reference.
 */
export function setBuffer(buffer) {
  buffer_global = buffer;
  if (buffer !== historyBufferRef) {
    historyBufferRef = buffer;
    historyField = new Float32Array(HISTORY_DIM * HISTORY_DIM * HISTORY_DIM);
    historyLast = new Uint32Array(HISTORY_DIM * HISTORY_DIM * HISTORY_DIM);
    historyTick = 0;
    historyComX = HISTORY_DIM * 0.5;
    historyComY = HISTORY_DIM * 0.5;
    historyComZ = HISTORY_DIM * 0.5;
  }
}

function readDNA(ptr, dnaIndex) {
  return buffer_global[ptr + DNA_BASE + dnaIndex];
}

function clamp(val, lo, hi) {
  if (val < lo) return lo;
  if (val > hi) return hi;
  return val;
}

function nanGuard(val) {
  return (val !== val) ? 0 : val;
}

// ============================================================================
// 1. GRAVITY
// ============================================================================
export function applyGravity(p1Ptr, p2Ptr, dx, dy, dz, dist, G) {
  const buf = buffer_global;
  const SOFTENING = 0.5;
  const m1 = readDNA(p1Ptr, D.HIDDEN_MASS) + buf[p1Ptr + S.MASS];
  const m2 = readDNA(p2Ptr, D.HIDDEN_MASS) + buf[p2Ptr + S.MASS];
  const dist2 = dist * dist + SOFTENING;
  let force = G * m1 * m2 / dist2;

  // FORCE DNA (0): pairwise gravity modifier — like signs multiply the pull
  // (both negative invert it into repulsion), opposite signs cancel each
  // other out leaving a gravitationally neutral pair. ±100 range → ±2 cap.
  const forceA = readDNA(p1Ptr, D.FORCE) || 0;
  const forceB = readDNA(p2Ptr, D.FORCE) || 0;
  if (forceA !== 0 || forceB !== 0) {
    const combined = forceA + forceB;
    if (Math.abs(combined) > 0.001) {
      const fScale = Math.max(-2, Math.min(2, combined / 25));
      force *= 1 + Math.abs(fScale) * 0.5;
      if (combined < 0) force = -force;
    } else {
      force = 0; // opposite signs cancel each other out
    }
  }

  // TIDAL DNA (15): differential structural forces — close encounters pull
  // harder (stronger with higher |TIDAL|).
  const tidal = readDNA(p1Ptr, D.TIDAL);
  if (Number.isFinite(tidal) && tidal !== 0) {
    force *= 1 + tidal * 0.5 * Math.max(0, 1 - dist / 100);
  }

  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

// ============================================================================
// 2. DRAG
// ============================================================================
export function applyDrag(vx, vy, vz, friction) {
  const damp = 1.0 - clamp(friction, 0, 1);
  return {
    ax: nanGuard(vx * damp - vx),
    ay: nanGuard(vy * damp - vy),
    az: nanGuard(vz * damp - vz),
  };
}

// ============================================================================
// 3. ENTROPY
// ============================================================================
export function applyEntropy(ax, ay, az, jitter, dt) {
  const scale = jitter * dt;
  const t0 = performance.now() * 2654435761;
  const r1 = ((t0 >>> 0) & 0xFFFF) / 32768.0 - 1.0;
  const r2 = (((t0 * 1103515245) >>> 0) & 0xFFFF) / 32768.0 - 1.0;
  const r3 = (((t0 * 214013) >>> 0) & 0xFFFF) / 32768.0 - 1.0;
  return {
    ax: nanGuard(ax + r1 * scale),
    ay: nanGuard(ay + r2 * scale),
    az: nanGuard(az + r3 * scale * 0.3),
  };
}

// ============================================================================
// 4. COLLISION
// ============================================================================
export function applyCollision(p1Ptr, p2Ptr, stride, dx, dy, dz, dist) {
  const buf = buffer_global;
  const m1 = buf[p1Ptr + S.MASS];
  const m2 = buf[p2Ptr + S.MASS];
  const r1 = buf[p1Ptr + S.RADIUS];
  const r2 = buf[p2Ptr + S.RADIUS];
  const overlap = (r1 + r2) - dist;

  if (overlap <= 0) return { ax: 0, ay: 0, az: 0 };

  const elasticity = readDNA(p1Ptr, D.ELASTICITY);
  const invDist = 1.0 / Math.max(dist, 0.01);
  const nx = dx * invDist;
  const ny = dy * invDist;
  const nz = dz * invDist;

  const dvx = buf[p1Ptr + S.VEL_X] - buf[p2Ptr + S.VEL_X];
  const dvy = buf[p1Ptr + S.VEL_Y] - buf[p2Ptr + S.VEL_Y];
  const dvz = buf[p1Ptr + S.VEL_Z] - buf[p2Ptr + S.VEL_Z];
  const relVelN = dvx * nx + dvy * ny + dvz * nz;

  if (relVelN > 0) return { ax: 0, ay: 0, az: 0 };

  const totalMass = m1 + m2;
  const impulse = -(1 + elasticity) * relVelN / totalMass;

  return {
    ax: nanGuard(impulse * m2 * nx),
    ay: nanGuard(impulse * m2 * ny),
    az: nanGuard(impulse * m2 * nz),
  };
}

// ============================================================================
// 5. ACCRETION
// ============================================================================
export function applyAccretion(p1Ptr, p2Ptr, stride, fusion, fusionMomentum) {
  const buf = buffer_global;
  const dx = buf[p2Ptr + S.POS_X] - buf[p1Ptr + S.POS_X];
  const dy = buf[p2Ptr + S.POS_Y] - buf[p1Ptr + S.POS_Y];
  const dz = buf[p2Ptr + S.POS_Z] - buf[p1Ptr + S.POS_Z];
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const r1 = buf[p1Ptr + S.RADIUS];
  const r2 = buf[p2Ptr + S.RADIUS];
  const m2 = buf[p2Ptr + S.MASS];

  if (dist < (r1 + r2) * fusion * 0.5) {
    const dvx = buf[p2Ptr + S.VEL_X] - buf[p1Ptr + S.VEL_X];
    const dvy = buf[p2Ptr + S.VEL_Y] - buf[p1Ptr + S.VEL_Y];
    const dvz = buf[p2Ptr + S.VEL_Z] - buf[p1Ptr + S.VEL_Z];
    const relSpeed = Math.sqrt(dvx * dvx + dvy * dvy + dvz * dvz);

    if (relSpeed < fusionMomentum * 2.0) {
      const m1 = buf[p1Ptr + S.MASS];
      const gain = m2 * 0.3;
      // Gene Fusion: blend DNA from consumed particle into survivor
      const dnaBlend = Math.min(1.0, gain / (m1 + 0.001));
      for (let t = 0; t < 42; t++) {
        const pv = buf[p1Ptr + S.DNA_CACHE_START + t] || 0;
        const ov = buf[p2Ptr + S.DNA_CACHE_START + t] || 0;
        buf[p1Ptr + S.DNA_CACHE_START + t] = pv + (ov - pv) * dnaBlend * 0.5;
      }
      // Color blending
      const ratio = gain / (m1 + gain + 0.001);
      buf[p1Ptr + S.COLOR_R] += (buf[p2Ptr + S.COLOR_R] - buf[p1Ptr + S.COLOR_R]) * ratio;
      buf[p1Ptr + S.COLOR_G] += (buf[p2Ptr + S.COLOR_G] - buf[p1Ptr + S.COLOR_G]) * ratio;
      buf[p1Ptr + S.COLOR_B] += (buf[p2Ptr + S.COLOR_B] - buf[p1Ptr + S.COLOR_B]) * ratio;

      buf[p1Ptr + S.MASS] += gain;
      buf[p2Ptr + S.MASS] = m2 - gain;
      if (buf[p2Ptr + S.MASS] <= 0.1) buf[p2Ptr + S.DEAD] = 1.0;
    }
  }
  return { ax: 0, ay: 0, az: 0 };
}

// ============================================================================
// 6. TRACKING (Attraction toward same-species neighbors)
// ============================================================================
export function applyTracking(p1Ptr, p2Ptr, stride, dx, dy, dz, dist) {
  const buf = buffer_global;
  const s1 = buf[p1Ptr + S.SPECIES_ID];
  const s2 = buf[p2Ptr + S.SPECIES_ID];
  if (s1 !== s2) return { ax: 0, ay: 0, az: 0 };

  const strength = 0.1;
  const invDist = 1.0 / Math.max(dist, 0.01);
  return {
    ax: nanGuard(dx * invDist * strength),
    ay: nanGuard(dy * invDist * strength),
    az: nanGuard(dz * invDist * strength),
  };
}

// ============================================================================
// 6b. PREDATION (Mass-difference based pursuit/flee + gene absorption on contact)
// ============================================================================
export function applyPredation(p1Ptr, p2Ptr, stride, dx, dy, dz, dist) {
  const buf = buffer_global;
  const mass1 = buf[p1Ptr + S.MASS];
  const mass2 = buf[p2Ptr + S.MASS];
  const massDiff = mass1 - mass2;
  if (Math.abs(massDiff) < 0.5) return { ax: 0, ay: 0, az: 0 };

  const r1 = buf[p1Ptr + S.RADIUS];
  const r2 = buf[p2Ptr + S.RADIUS];
  const invDist = 1.0 / Math.max(dist, 0.01);

  if (massDiff > 0.5) {
    // p1 is predator: pursue p2
    const predBias = readDNA(p1Ptr, D.PREDATION_BIAS) || 0;
    const strength = predBias * 0.1 * mass2 * invDist;
    const force = {
      ax: nanGuard(dx * invDist * strength),
      ay: nanGuard(dy * invDist * strength),
      az: nanGuard(dz * invDist * strength),
    };
    // Gene absorption on contact
    if (dist < r1 + r2 && predBias > 0.1) {
      const absorpRate = 0.05;
      for (let t = 0; t < 5; t++) {
        const trait = Math.floor(Math.random() * 42);
        const preyVal = buf[p2Ptr + S.DNA_CACHE_START + trait] || 0;
        const predVal = buf[p1Ptr + S.DNA_CACHE_START + trait] || 0;
        buf[p1Ptr + S.DNA_CACHE_START + trait] = predVal + (preyVal - predVal) * absorpRate;
      }
      // Mass transfer
      const transfer = Math.min(0.5, mass2 * 0.1);
      buf[p1Ptr + S.MASS] += transfer * 0.5;
      buf[p2Ptr + S.MASS] -= transfer;
    }
    return force;
  } else {
    // p1 is prey: flee from p2
    const jitter = readDNA(p1Ptr, D.JITTER) || 0.1;
    const strength = jitter * 0.2 * invDist;
    return {
      ax: nanGuard(-dx * invDist * strength),
      ay: nanGuard(-dy * invDist * strength),
      az: nanGuard(-dz * invDist * strength),
    };
  }
}

// ============================================================================
// 7. SOLVATION
// ============================================================================
export function applySolvation(p1Ptr, p2Ptr, stride, dx, dy, dz, dist) {
  const buf = buffer_global;
  const charge1 = buf[p1Ptr + S.CHARGE];
  const charge2 = buf[p2Ptr + S.CHARGE];
  if (charge1 * charge2 >= 0) return { ax: 0, ay: 0, az: 0 };

  const strength = 0.05 * Math.abs(charge1 - charge2);
  const invDist = 1.0 / Math.max(dist, 0.01);
  return {
    ax: nanGuard(dx * invDist * strength),
    ay: nanGuard(dy * invDist * strength),
    az: nanGuard(dz * invDist * strength),
  };
}

// ============================================================================
// 8. POLYMERIZATION
// ============================================================================
export function applyPolymerization(p1Ptr, p2Ptr, stride, dx, dy, dz, dist) {
  const buf = buffer_global;
  if (dist > 30) return { ax: 0, ay: 0, az: 0 };

  const bondCount = buf[p1Ptr + S.BOND_COUNT];
  if (bondCount >= 6) return { ax: 0, ay: 0, az: 0 };

  if (dist < 15) {
    const partnerSlot = S.BOND_PARTNER_1 + Math.floor(bondCount);
    if (partnerSlot <= S.BOND_PARTNER_2) {
      buf[p1Ptr + partnerSlot] = p2Ptr / stride;
      buf[p1Ptr + S.BOND_COUNT] = bondCount + 1;
    }
  }

  return { ax: 0, ay: 0, az: 0 };
}

// ============================================================================
// 9. ACIDITY
// ============================================================================
export function applyAcidity(p1Ptr, p2Ptr, stride, dt) {
  const buf = buffer_global;
  const charge1 = buf[p1Ptr + S.CHARGE];
  const charge2 = buf[p2Ptr + S.CHARGE];
  const conductivity = readDNA(p1Ptr, D.CONDUCTIVITY);

  if (Math.abs(charge1 - charge2) < 0.1) return { ax: 0, ay: 0, az: 0 };

  const transfer = (charge1 - charge2) * conductivity * dt * 0.1;
  buf[p1Ptr + S.CHARGE] -= transfer;
  buf[p2Ptr + S.CHARGE] += transfer;

  return { ax: 0, ay: 0, az: 0 };
}

// ============================================================================
// 10. OXIDATION
// ============================================================================
export function applyOxidation(p1Ptr, p2Ptr, stride, dt) {
  const buf = buffer_global;
  const charge1 = buf[p1Ptr + S.CHARGE];
  const charge2 = buf[p2Ptr + S.CHARGE];
  const conductivity = readDNA(p1Ptr, D.CONDUCTIVITY);
  const heatOutput = readDNA(p1Ptr, D.HEAT_OUTPUT);

  if (Math.abs(charge1 - charge2) < 0.1) return { ax: 0, ay: 0, az: 0 };

  const transfer = (charge1 - charge2) * conductivity * dt * 0.1;
  buf[p1Ptr + S.CHARGE] -= transfer;
  buf[p2Ptr + S.CHARGE] += transfer;

  const energyRelease = Math.abs(transfer) * heatOutput * 100.0;
  buf[p1Ptr + S.ENERGY] += energyRelease * 0.5;
  buf[p2Ptr + S.ENERGY] += energyRelease * 0.5;
  buf[p1Ptr + S.TEMPERATURE] += energyRelease * 0.01;
  buf[p2Ptr + S.TEMPERATURE] += energyRelease * 0.01;

  return { ax: 0, ay: 0, az: 0 };
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
// 13. GENOTYPE (Radiation field / DNA mutation)
// ============================================================================
export function applyGenotype(p1Ptr, stride, dt) {
  const buf = buffer_global;
  const mutationRate = readDNA(p1Ptr, D.MUTATION);
  const temperature = buf[p1Ptr + S.TEMPERATURE];

  if (mutationRate < 0.01) return { ax: 0, ay: 0, az: 0 };

  const mutProb = mutationRate * (1.0 + temperature) * dt * 0.01;
  if (mutProb < 0.001) return { ax: 0, ay: 0, az: 0 };

  const numMutations = Math.floor(mutProb * 3) + 1;
  const dnaStart = DNA_BASE;

  for (let m = 0; m < numMutations; m++) {
    const hashVal = Math.sin(p1Ptr * 127.1 + m * 311.7 + performance.now() * 0.001) * 43758.5453;
    const dnaIdx = Math.abs(Math.floor(hashVal)) % 42;
    const perturbHash = Math.sin(p1Ptr * 269.5 + dnaIdx * 183.3) * 43758.5453;
    const perturb = ((perturbHash - Math.floor(perturbHash)) * 2.0 - 1.0) * mutationRate * 0.05;
    buf[p1Ptr + dnaStart + dnaIdx] += perturb;
  }

  return { ax: 0, ay: 0, az: 0 };
}

// ============================================================================
// 14. PLANETARY (Atmospheric gravity — confirmed batch-02 semantics)
// ============================================================================
// A constant downward force toward the ground plane (z ≈ 0), simulating
// particles that are much smaller than the world and fall through a planet's
// atmosphere. Force is scaled by mass so the resulting acceleration is
// mass-independent — every particle falls at the same rate. Combined with
// GRAV the pull is ×1.5. With WRAP off the soft-wall clamp turns z = 0 into
// the ground; with WRAP on the planet world still falls toward the band.
export function applyPlanetary(lawState, view, base, px, py, pz, worldSize, synergy) {
  if (!isSet(lawState, LAW_INDEXES.PLANETARY)) return null; // LAW_INDEXES.PLANETARY = 6

  const mass = view[base + S.MASS] || 1.0;
  const strength = 0.02 * synergy;
  return {
    ax: 0,
    ay: 0,
    az: -strength * mass,
  };
}

// ============================================================================
// 15. LIFE CYCLE
// ============================================================================
export function applyLifeCycle(lawState, view, base, dnaParams, dt, prng, synergy) {
  if (!isSet(lawState, LAW_INDEXES.LIFE)) return; // LAW_INDEXES.LIFE = 7

  // AGE is advanced by the solver core each tick (frame count), not here.
  const age = view[base + S.AGE];

  let energy = view[base + S.ENERGY];
  const decayRate = 0.01 * (1 - dnaParams[34] * synergy) * (worldParams().DECAY_RATE ?? 1); // ENERGY_EFFICIENCY=34
  energy -= decayRate * dt;
  // Photosynthesis — LIGHT_LEVEL feeds a slow energy subsidy to life.
  energy += 0.02 * (worldParams().LIGHT_LEVEL ?? 0.5) * dt;
  // When the metabolic budget hits 0 the organism dies (confirmed batch-02
  // semantics). This is the LIFE metabolic path only — charge/electromagnetic
  // dynamics live in their own fields and laws and do not trigger it.
  if (energy <= 0) {
    view[base + S.ENERGY] = 0;
    view[base + S.DEAD] = 1.0;
    return;
  }
  view[base + S.ENERGY] = energy;

  let hunger = view[base + S.HUNGER] + dt * 0.02;
  if (hunger > 100) {
    view[base + S.DEAD] = 1.0;
    return;
  }
  view[base + S.HUNGER] = hunger;

  // === BIOLOGICAL VARIANCE ===
  const ageNorm = Math.min(1.0, age / 5000);
  const birthRate = Math.abs(dnaParams[10] || 0.5); // BIRTH_RATE=10
  const mutRate = Math.abs(dnaParams[12] || 0.5); // MUTATION=12

  // Age-based color drift (biological fading)
  view[base + S.COLOR_R] += (Math.sin(age * 0.001) * 2.0 * mutRate);
  view[base + S.COLOR_G] += (Math.cos(age * 0.0007) * 2.0 * mutRate);
  view[base + S.COLOR_B] += (Math.sin(age * 0.0013 + 1.0) * 2.0 * mutRate);

  // Mass fluctuation from metabolism — accretion-style mass gain/loss only
  // while the ACCR law governs it (LIFE alone must not grow/shrink mass).
  if (isSet(lawState, LAW_INDEXES.ACCR)) {
    const mass = view[base + S.MASS] || 1.0;
    const massFluctuation = (energy - 50) * 0.0001 * birthRate;
    view[base + S.MASS] += massFluctuation * dt;
  }

  // Bio-rhythm energy pulse
  const bioPulse = Math.sin(age * 0.01 * birthRate) * 0.5 * mutRate;
  view[base + S.ENERGY] += bioPulse * dt * 0.1;

  // Clamp values
  view[base + S.COLOR_R] = Math.max(0, Math.min(255, view[base + S.COLOR_R] || 0));
  view[base + S.COLOR_G] = Math.max(0, Math.min(255, view[base + S.COLOR_G] || 0));
  view[base + S.COLOR_B] = Math.max(0, Math.min(255, view[base + S.COLOR_B] || 0));
  view[base + S.MASS] = Math.max(0.1, Math.min(50, view[base + S.MASS] || 1));
  // === END BIOLOGICAL VARIANCE ===

  // Senescence (LAW_INDEXES.SENESCENCE = 12)
  if (isSet(lawState, LAW_INDEXES.SENESCENCE)) {
    const deathRate = dnaParams[11] * 0.001 * (1.0 + ageNorm * 0.5); // Older = higher death chance
    if (age > 500 && prng() < deathRate * dt) {
      view[base + S.DEAD] = 1.0;
      return;
    }
  }

  // Radiation damage lives in the standalone RADIATION law (applyRadiationDamage)
  // — applying it here as well would double-drain every irradiated organism.
}

// ============================================================================
// 16. SIGNAL DECAY
// ============================================================================
export function applySignalDecay(lawState, view, base, dnaParams, dt) {
  if (!isSet(lawState, LAW_INDEXES.COMMS)) return; // COMMS=52
  // v4 — communication DNA, gated by the COMMS law: oscillator emission + decay.
  const decay = dnaParams[20]; // SIGNAL_DECAY=20 (0.1–0.99)
  const pulseRate = dnaParams[14]; // PULSE_RATE=14 (0–1)
  const strength = dnaParams[19]; // SIGNAL_STRENGTH=19 (0–1)
  const memDecay = dnaParams[40]; // MEMORY_DECAY=40 (0.9–1.0)
  let signal = view[base + S.SIGNAL] || 0;
  signal *= Math.pow(Math.max(0.1, decay), dt);
  const phase = Math.sin((view[base + S.AGE] || 0) * 0.01 * (0.1 + pulseRate));
  if (phase > 0) {
    signal += phase * pulseRate * strength * dt * 0.05 * runtimeConfig.signalScale;
  }
  if (signal > 1) signal = 1;
  if (signal < 0) signal = 0;
  view[base + S.SIGNAL] = signal;
  // Memory trace decays toward zero each tick
  const mem = view[base + S.MEMORY] || 0;
  view[base + S.MEMORY] = mem * Math.pow(memDecay || 0.99, dt);
}

// ============================================================================
// 60. SIGNAL EXCHANGE — channel-filtered pairwise communication
// ============================================================================

/** Channel compatibility: normalized dot product of receiver × sender tuning (TUNING_CH1-4). */
function channelMatch(receiverDna, senderDna) {
  let dot = 0, rMag = 0, sMag = 0;
  for (let c = 0; c < 4; c++) {
    const r = receiverDna[22 + c] || 0;
    const s = senderDna[22 + c] || 0;
    dot += r * s;
    rMag += r * r;
    sMag += s * s;
  }
  if (rMag < 1e-6 || sMag < 1e-6) return 1.0; // untuned channels are open
  return Math.max(0, dot / Math.sqrt(rMag * sMag));
}

/**
 * Pairwise signal propagation. A particle's SIGNAL field radiates toward
 * neighbors within NEIGHBORHOOD_RADIUS; the receiver's SIGNAL_RESP converts
 * delivered signal into attraction force + energy, filtered by TUNING_CH*.
 * @returns {{ax:number,ay:number,az:number}|null} response force (or null)
 */
export function applySignalExchange(lawState, view, iBase, jBase, dx, dy, dz, dist, dnaI, dnaJ, dt) {
  if (!isSet(lawState, LAW_INDEXES.COMMS)) return null; // COMMS=52
  const sI = view[iBase + S.SIGNAL] || 0;
  const sJ = view[jBase + S.SIGNAL] || 0;
  if (sI < 0.01 && sJ < 0.01) return null;

  const nRadius = ((dnaI[18] || 120) + (dnaJ[18] || 120)) * 0.5; // NEIGHBORHOOD_RADIUS
  if (dist > nRadius) return null;

  const respI = dnaI[13] || 0;   // SIGNAL_RESP
  const respJ = dnaJ[13] || 0;
  const strI = dnaI[19] || 0;    // SIGNAL_STRENGTH
  const strJ = dnaJ[19] || 0;
  const propI = dnaI[21] || 0.5; // PROPAGATION_SPEED
  const propJ = dnaJ[21] || 0.5;
  const chI = channelMatch(dnaI, dnaJ); // i receives j
  const chJ = channelMatch(dnaJ, dnaI); // j receives i

  const invDist = 1.0 / Math.max(dist, 0.01);
  const scale = runtimeConfig.signalScale;
  let ax = 0, ay = 0, az = 0;

  // j → i
  if (sJ > 0.01 && respI > 0.01) {
    const delivered = sJ * strJ * propI * chI * dt * scale;
    view[iBase + S.SIGNAL] = Math.min(1, (view[iBase + S.SIGNAL] || 0) + delivered);
    view[iBase + S.MEMORY] = (view[iBase + S.MEMORY] || 0) + delivered;
    view[iBase + S.ENERGY] = (view[iBase + S.ENERGY] || 0) + delivered * respI * 0.5;
    const forceMag = respI * delivered * 0.05;
    ax += dx * invDist * forceMag;
    ay += dy * invDist * forceMag;
    az += dz * invDist * forceMag;
  }

  // i → j
  if (sI > 0.01 && respJ > 0.01) {
    const delivered = sI * strI * propJ * chJ * dt * scale;
    view[jBase + S.SIGNAL] = Math.min(1, (view[jBase + S.SIGNAL] || 0) + delivered);
    view[jBase + S.MEMORY] = (view[jBase + S.MEMORY] || 0) + delivered;
    view[jBase + S.ENERGY] = (view[jBase + S.ENERGY] || 0) + delivered * respJ * 0.5;
    const forceMag = respJ * delivered * 0.05;
    ax -= dx * invDist * forceMag;
    ay -= dy * invDist * forceMag;
    az -= dz * invDist * forceMag;
  }

  if (ax === 0 && ay === 0 && az === 0) return null;
  return { ax: nanGuard(ax), ay: nanGuard(ay), az: nanGuard(az) };
}


// ============================================================================
// 17. AFFINITY
// ============================================================================
export function applyAffinity(lawState, view, iBase, jBase, dx, dy, dz, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.AFFINITY)) return null; // AFFINITY=9
  if (distSq < 1) return null;

  const speciesI = view[iBase + S.SPECIES_ID];
  const speciesJ = view[jBase + S.SPECIES_ID];
  const affinityI = view[iBase + S.DNA_CACHE_START + 41]; // SPECIES_AFFINITY=41

  if (speciesI === speciesJ) {
    // Same-species cohesion: SPECIES_AFFINITY BOOSTS the attraction — the
    // pull grows with positive affinity and is inert at 0. Xenophobic
    // species (affinity < 0) get no same-species pull at all.
    const strength = 0.1 * Math.max(0, affinityI) * synergy * (worldParams().SPECIES_INTERACTION ?? 1);
    const invDist = 1 / Math.sqrt(distSq);
    return {
      ax: dx * invDist * strength,
      ay: dy * invDist * strength,
      az: dz * invDist * strength,
    };
  }

  if (affinityI < 0) {
    const strength = 0.05 * Math.abs(affinityI) * synergy * (worldParams().SPECIES_INTERACTION ?? 1);
    const invDist = 1 / Math.sqrt(distSq);
    return {
      ax: -dx * invDist * strength,
      ay: -dy * invDist * strength,
      az: -dz * invDist * strength,
    };
  }

  return null;
}

// ============================================================================
// 18. REPRODUCTION
// ============================================================================
export function applyReproduction(lawState, view, base, dnaParams, prng, synergy, dnaBuffer, dt) {
  if (!isSet(lawState, LAW_INDEXES.REPRO)) return null; // REPRO=10

  const energy = view[base + S.ENERGY];
  const age = view[base + S.AGE];
  const birthRate = dnaParams[10]; // BIRTH_RATE=10

  // Reproductive drive is its own energy channel (REPRO_DRIVE stride field):
  // it accumulates from BIRTH_RATE over time and gates reproduction — a
  // particle cannot spawn from raw metabolic energy alone. Spawning consumes
  // the drive and half the parent's life energy.
  let drive = view[base + S.REPRO_DRIVE] || 0;
  drive += birthRate * 0.1 * (dt || 1) * synergy;
  if (drive > 100) drive = 100;
  view[base + S.REPRO_DRIVE] = drive;

  if (drive < 60 || age < 100) return null;
  if (prng() > birthRate * synergy * 0.01) return null;

  view[base + S.REPRO_DRIVE] = 0; // spawning consumes the drive
  view[base + S.ENERGY] = energy * 0.5;

  const px = view[base + S.POS_X];
  const py = view[base + S.POS_Y];
  const pz = view[base + S.POS_Z];
  const speciesId = view[base + S.SPECIES_ID];

  // Genetics params (indices 42-47) come from the species DNA buffer,
  // NOT from the per-particle stride cache (which only holds 0-41).
  const dominance = readSpeciesDNAParam(dnaBuffer, speciesId, 42);
  const crossoverRate = readSpeciesDNAParam(dnaBuffer, speciesId, 43);
  const epigeneticDrift = readSpeciesDNAParam(dnaBuffer, speciesId, 44);
  const heterozygosity = readSpeciesDNAParam(dnaBuffer, speciesId, 45);
  const geneFlow = readSpeciesDNAParam(dnaBuffer, speciesId, 46);
  const repressor = readSpeciesDNAParam(dnaBuffer, speciesId, 47);

  const mutationRate = dnaParams[12] * 0.1; // MUTATION=12
  const offspringDna = new Array(48);

  // --- Genetics: Crossover ---
  // Check BOND_PARTNER_1 for a potential second parent
  const partnerIdx = view[base + S.BOND_PARTNER_1];
  let hasTwoParents = false;
  const partnerDna = new Array(48);

  // SEX_CHANCE DNA (35): multi-parent reproduction probability — boosts the
  // crossover/second-parent chance above the species CROSSOVER_RATE baseline.
  const sexChance = Math.abs(dnaParams[35] || 0);
  if (partnerIdx >= 0 && prng() < crossoverRate * (1 + sexChance * 0.5)) {
    const partnerBase = partnerIdx * PARTICLE_STRIDE;
    const partnerSpecies = view[partnerBase + S.SPECIES_ID];
    if (partnerSpecies === speciesId) {
      hasTwoParents = true;
      // Read first 42 DNA values from partner's stride cache
      for (let d = 0; d < 42; d++) {
        partnerDna[d] = view[partnerBase + S.DNA_CACHE_START + d];
      }
      // Fill genetics params (42-47) from species DNA buffer
      for (let d = 42; d < 48; d++) {
        partnerDna[d] = readSpeciesDNAParam(dnaBuffer, speciesId, d);
      }
    }
  }

  // --- Build offspring DNA with crossover, dominance, mutation ---
  for (let d = 0; d < 48; d++) {
    let parentA, parentB;

    if (d < 42) {
      // Core traits: use dnaParams (from stride cache)
      parentA = dnaParams[d] || 0;
      parentB = hasTwoParents ? (partnerDna[d] || 0) : parentA;
    } else {
      // Genetics params (42-47): read from species DNA buffer
      parentA = readSpeciesDNAParam(dnaBuffer, speciesId, d);
      parentB = hasTwoParents ? readSpeciesDNAParam(dnaBuffer, speciesId, d) : parentA;
    }

    let val;
    if (hasTwoParents && prng() < 0.5) {
      // Sexual reproduction with dominance
      if (prng() < 0.3) {
        // Crossover: blend both parents
        val = (parentA + parentB) * 0.5;
      } else if (prng() < dominance) {
        // Dominant: favor higher magnitude
        val = Math.abs(parentA) > Math.abs(parentB) ? parentA : parentB;
      } else {
        // Recessive: favor lower magnitude
        val = Math.abs(parentA) < Math.abs(parentB) ? parentA : parentB;
      }
    } else {
      // Asexual: clone parent
      val = parentA;
    }

    // Apply mutation (scaled by repressor)
    const effectiveMutation = mutationRate * (1 - repressor * 0.5) * (worldParams().MUTATION_RATE ?? 1);
    val += (prng() - 0.5) * effectiveMutation * 10;

    // Apply epigenetic drift (non-heritable noise)
    val += (prng() - 0.5) * epigeneticDrift * 5;

    // Gene flow: horizontal transfer from other species
    if (prng() < geneFlow * 0.01) {
      const otherSpecies = Math.floor(prng() * 5) % 64;
      if (otherSpecies !== speciesId) {
        const foreignGene = readSpeciesDNAParam(dnaBuffer, otherSpecies, d);
        val += (foreignGene - val) * 0.1;
      }
    }

    offspringDna[d] = Math.max(-100, Math.min(100, val));
  }

  // Offspring colour = the parents' intermediate colour. Two parents blend
  // 50/50; a single parent clones its own colour, with slight mutation.
  let colorR = view[base + S.COLOR_R];
  let colorG = view[base + S.COLOR_G];
  let colorB = view[base + S.COLOR_B];
  if (hasTwoParents) {
    const partnerBase = partnerIdx * PARTICLE_STRIDE;
    colorR = (colorR + view[partnerBase + S.COLOR_R]) * 0.5;
    colorG = (colorG + view[partnerBase + S.COLOR_G]) * 0.5;
    colorB = (colorB + view[partnerBase + S.COLOR_B]) * 0.5;
  }
  const colorMut = Math.abs(mutationRate) * 12;
  colorR = Math.max(0, Math.min(255, colorR + (prng() - 0.5) * colorMut));
  colorG = Math.max(0, Math.min(255, colorG + (prng() - 0.5) * colorMut));
  colorB = Math.max(0, Math.min(255, colorB + (prng() - 0.5) * colorMut));

  return {
    parentId: Math.floor(base / PARTICLE_STRIDE),
    x: px + (prng() - 0.5) * 20,
    y: py + (prng() - 0.5) * 20,
    z: pz + (prng() - 0.5) * 20,
    vx: 0, vy: 0, vz: 0,
    speciesId,
    mass: view[base + S.MASS] * 0.8,
    energy: 60,
    dna: offspringDna,
    colorR, colorG, colorB,
  };
}

// ============================================================================
// 19. CHEMISTRY MODIFIER
// ============================================================================
// 19. CHEMISTRY MODIFIER
// ============================================================================
export function applyChemistry(lawState, view, iBase, jBase, distSq, synergy) {
  let multiplier = 1.0;

  if (isSet(lawState, LAW_INDEXES.CATALYSIS_LAW)) { // CATALYSIS_LAW=17
    const catI = view[iBase + S.DNA_CACHE_START + 38]; // CATALYSIS=38
    multiplier *= 1.0 + catI * 0.5 * synergy;
  }

  if (isSet(lawState, LAW_INDEXES.SOLVATION)) multiplier *= 1.2; // SOLVATION=18

  if (isSet(lawState, LAW_INDEXES.ACIDITY)) { // ACIDITY=19
    const chargeI = view[iBase + S.CHARGE];
    const chargeJ = view[jBase + S.CHARGE];
    const polarity = Math.abs(chargeI - chargeJ);
    multiplier *= 1.0 + polarity * 0.3;
  }

  if (isSet(lawState, LAW_INDEXES.CRYSTALLIZATION) && distSq < 100) { // CRYSTALLIZATION=24
    multiplier *= 1.5;
  }

  return multiplier;
}

// ============================================================================
// 20. POLYMER (bond formation)
// ============================================================================
export function applyPolymer(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
  if (!isSet(lawState, LAW_INDEXES.POLYMER)) return { ax: 0, ay: 0, az: 0 };
  if (dist > 25) return { ax: 0, ay: 0, az: 0 };

  const bondCount = view[iBase + S.BOND_COUNT];
  const jIdx = jBase / 100;
  let alreadyBonded = false;
  for (let slot = S.BOND_PARTNER_1; slot <= S.BOND_PARTNER_1 + 1; slot++) {
    if (view[iBase + slot] === jIdx) { alreadyBonded = true; break; }
  }
  if (!alreadyBonded && bondCount < 2 && dist < 10 * synergy) {
    for (let slot = S.BOND_PARTNER_1; slot <= S.BOND_PARTNER_1 + 1; slot++) {
      if (view[iBase + slot] < 0) {
        view[iBase + slot] = jIdx;
        view[iBase + S.BOND_COUNT] = bondCount + 1;
        break;
      }
    }
  }
  // Spring force to maintain polymer chain
  if (dist < 0.1) return { ax: 0, ay: 0, az: 0 };
  const stiffness = 0.02 * synergy;
  const restLen = 4.0;
  const displacement = dist - restLen;
  const forceMag = stiffness * displacement;
  const invDist = 1.0 / dist;
  return {
    ax: dx * invDist * forceMag,
    ay: dy * invDist * forceMag,
    az: dz * invDist * forceMag,
  };
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
  const force = (prng() - 0.5) * 0.1 * synergy * dt;
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
}

// ============================================================================
// 26. ORDER
// ============================================================================
export function applyOrder(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.ORDER)) return null; // ORDER=33
  if (distSq > 10000) return null;

  const strength = 0.005 * synergy;
  return {
    ax: view[jBase + S.VEL_X] * strength,
    ay: view[jBase + S.VEL_Y] * strength,
    az: view[jBase + S.VEL_Z] * strength,
  };
}

// ============================================================================
// 27. FATE
// ============================================================================
export function applyFate(lawState, view, iBase, jBase, dx, dy, dz, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.FATE)) return null; // FATE=34
  if (distSq < 1 || distSq > 250000) return null;

  const speciesI = view[iBase + S.SPECIES_ID];
  const speciesJ = view[jBase + S.SPECIES_ID];
  if (speciesI !== speciesJ) return null;

  const strength = 0.05 * synergy;
  const invDist = 1 / Math.sqrt(distSq);
  return {
    ax: dx * invDist * strength,
    ay: dy * invDist * strength,
    az: dz * invDist * strength,
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
  const soulBoost = soulJ * 0.001 * synergy;
  if (Number.isFinite(soulBoost)) {
    view[iBase + S.SOUL] += soulBoost;
  }
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
// 31. VOID — Vacuum pressure / cosmological constant
// ============================================================================
export function applyVoid(lawState, view, base, px, py, pz, worldSize, synergy) {
  if (!isSet(lawState, LAW_INDEXES.VOID)) return null;
  const cx = worldSize * 0.5;
  const cy = worldSize * 0.5;
  const cz = worldSize * 0.5;
  const dx = px - cx;
  const dy = py - cy;
  const dz = pz - cz;
  const distSq = dx * dx + dy * dy + dz * dz;
  if (distSq < 1) return null;
  const strength = 0.0005 * synergy;
  const invDist = 1 / Math.sqrt(distSq);
  return {
    ax: dx * invDist * strength,
    ay: dy * invDist * strength,
    az: dz * invDist * strength,
  };
}

// ============================================================================
// 32. BOND — Spring-like molecular bonding
// ============================================================================
export function applyBond(lawState, view, iBase, jBase, stride, dx, dy, dz, dist, synergy) {
  if (!isSet(lawState, LAW_INDEXES.BOND)) return null;
  if (dist < 0.1 || dist > 30) return null;
  const stiffness = view[iBase + S.DNA_CACHE_START + 8]; // STIFFNESS
  if (!Number.isFinite(stiffness) || stiffness < 0.01) return null;
  // Edge-to-edge rest length: particles touch at their radii
  const r1 = view[iBase + S.RADIUS];
  const r2 = view[jBase + S.RADIUS];
  if (!Number.isFinite(r1) || !Number.isFinite(r2)) return null;
  const restLength = (r1 + r2) * 1.1; // slight buffer to avoid overlap
  // Spring force: F = -k * (dist - restLength)
  const displacement = dist - restLength;
  const forceMag = stiffness * displacement * 0.05 * synergy;
  const invDist = 1.0 / Math.max(dist, 0.01);
  const fx = dx * invDist * forceMag;
  const fy = dy * invDist * forceMag;
  const fz = dz * invDist * forceMag;
  if (!Number.isFinite(fx)) return null;
  // Register bond bilaterally
  const jIdx = jBase / stride;
  const iIdx = iBase / stride;
  // Check if already bonded
  for (let slot = S.BOND_PARTNER_1; slot <= S.BOND_PARTNER_1 + 1; slot++) {
    if (view[iBase + slot] === jIdx || view[jBase + slot] === iIdx) {
      return { ax: fx, ay: fy, az: fz };
    }
  }
  // Find empty slot on i
  for (let slot = S.BOND_PARTNER_1; slot <= S.BOND_PARTNER_1 + 1; slot++) {
    if (view[iBase + slot] < 0) {
      view[iBase + slot] = jIdx;
      view[iBase + S.BOND_COUNT] += 1;
      break;
    }
  }
  // Find empty slot on j
  for (let slot = S.BOND_PARTNER_1; slot <= S.BOND_PARTNER_1 + 1; slot++) {
    if (view[jBase + slot] < 0) {
      view[jBase + slot] = iIdx;
      view[jBase + S.BOND_COUNT] += 1;
      break;
    }
  }
  return { ax: fx, ay: fy, az: fz };
}

// ============================================================================
// 33. REDUCTION — Charge neutralization
// ============================================================================
export function applyReduction(b1Ptr, b2Ptr, stride, synergy) {
  const buf = buffer_global;
  const charge1 = buf[b1Ptr + S.CHARGE];
  const charge2 = buf[b2Ptr + S.CHARGE];
  if (!Number.isFinite(charge1) || !Number.isFinite(charge2)) return;
  const diff = charge1 - charge2;
  const neutralization = diff * 0.05 * synergy;
  buf[b1Ptr + S.CHARGE] -= neutralization;
  buf[b2Ptr + S.CHARGE] += neutralization;
}

// ============================================================================
// 34. ALLOY — Cross-species fusion
// ============================================================================
export function applyAlloy(lawState, view, iBase, jBase, stride, dist, synergy) {
  if (!isSet(lawState, LAW_INDEXES.ALLOY)) return;
  const speciesI = view[iBase + S.SPECIES_ID];
  const speciesJ = view[jBase + S.SPECIES_ID];
  if (speciesI === speciesJ) return;
  const r1 = view[iBase + S.RADIUS];
  const r2 = view[jBase + S.RADIUS];
  if (dist > (r1 + r2) * 0.5) return;
  // Merge j into i
  const m2 = view[jBase + S.MASS];
  view[iBase + S.MASS] += m2 * 0.1 * synergy;
  view[jBase + S.DEAD] = 1.0;
  // Blend colors
  view[iBase + S.COLOR_R] = (view[iBase + S.COLOR_R] + view[jBase + S.COLOR_R]) * 0.5;
  view[iBase + S.COLOR_G] = (view[iBase + S.COLOR_G] + view[jBase + S.COLOR_G]) * 0.5;
  view[iBase + S.COLOR_B] = (view[iBase + S.COLOR_B] + view[jBase + S.COLOR_B]) * 0.5;
}

// ============================================================================
// 35. MELT — High temp particles lose mass
// ============================================================================
export function applyMelt(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.MELT)) return;
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(temp) || temp < 0.7) return;
  const mass = view[base + S.MASS];
  const meltRate = (temp - 0.7) * 0.01 * dt * synergy;
  const newMass = mass - meltRate;
  if (newMass > 0.1) {
    view[base + S.MASS] = newMass;
    view[base + S.TEMPERATURE] -= meltRate * 0.5;
  }
}

// ============================================================================
// 36. BOIL — Very hot particles eject mass as energetic vapor
// ============================================================================
export function applyBoil(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.BOIL)) return;
  const temp = view[base + S.TEMPERATURE];
  if (!Number.isFinite(temp) || temp < 0.9) return;
  const mass = view[base + S.MASS];
  const boilRate = (temp - 0.9) * 0.02 * dt * synergy;
  const ejectMass = mass * boilRate;
  if (ejectMass > 0.01) {
    view[base + S.MASS] -= ejectMass;
    // Velocity boost from mass ejection
    view[base + S.VEL_X] += (Math.random() - 0.5) * ejectMass * 10;
    view[base + S.VEL_Y] += (Math.random() - 0.5) * ejectMass * 10;
    view[base + S.VEL_Z] += (Math.random() - 0.5) * ejectMass * 5;
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
  view[base + S.TEMPERATURE] += condenseRate * 0.1;
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
  view[base + S.TEMPERATURE] += depositRate * 0.05;
}

// ============================================================================
// 39. EXOTHERMIC — Energy amplification for all reactions
// ============================================================================
export function applyExothermic(lawState, view, base, synergy) {
  if (!isSet(lawState, LAW_INDEXES.EXOTHERMIC)) return;
  const energy = view[base + S.ENERGY];
  if (!Number.isFinite(energy)) return;
  const amp = 1.0 + 0.1 * synergy;
  view[base + S.ENERGY] *= amp;
}

// ============================================================================
// 40. TELEPATHY — Instant signal sharing within species
// ============================================================================
export function applyTelepathy(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.TELEPATHY)) return null;
  const speciesI = view[iBase + S.SPECIES_ID];
  const speciesJ = view[jBase + S.SPECIES_ID];
  if (speciesI !== speciesJ) return null;
  const signalJ = view[jBase + S.SIGNAL];
  if (!Number.isFinite(signalJ)) return null;
  const transfer = signalJ * 0.05 * synergy;
  if (transfer > 0.001) {
    view[iBase + S.SIGNAL] += transfer;
  }
  return null;
}

// ============================================================================
// 41. CLAIRVOYANCE — Predictive steering toward future positions
// ============================================================================
export function applyClairvoyance(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
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
  return {
    ax: predDx * invDist * strength,
    ay: predDy * invDist * strength,
    az: predDz * invDist * strength,
  };
}

// ============================================================================
// 42. PRECOGNITION — Collision anticipation and avoidance
// ============================================================================
export function applyPrecognition(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
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


// ============================================================================
// 44. GLOW — Signal emission produces visual brightness
// ============================================================================
export function applyGlowEffect(lawState, view, base, dnaParams, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.GLOW)) return;

  // GLOW emits signal pulses only (confirmed batch-04 correction): an
  // oscillator raises the particle's SIGNAL — its transmission strength —
  // when the phase is positive. With COMMS active the pulse propagates to
  // neighbours. GLOW does NOT convert signal into life energy: signal
  // (SIGNAL) and metabolism (ENERGY) are separate channels.
  const pulseRate = dnaParams[14] || 0.2;   // PULSE_RATE
  const strength = dnaParams[19] || 0.5;    // SIGNAL_STRENGTH
  const age = view[base + S.AGE] || 0;
  const signal = view[base + S.SIGNAL] || 0;

  const phase = Math.sin(age * 0.01 * (0.1 + pulseRate));
  if (phase > 0) {
    view[base + S.SIGNAL] = Math.max(0, signal + phase * pulseRate * strength * dt * 0.05 * synergy);
  }
}

// ============================================================================
// 45. ENERGY — Energy conduction between adjacent particles
// ============================================================================
// The ENERGY law balances every energy reservoir pairwise toward equilibrium:
// LIFE energy (ENERGY), ELECTRIC_ENERGY and STORED_ENERGY each conduct
// independently between neighbouring particles. SIGNAL (transmission
// strength) and REPRO_DRIVE (drive meter) are not energy reservoirs and are
// intentionally left untouched. Confirmed batch-04 interpretation of "what
// energy": all of them.
const ENERGY_CHANNELS = [S.ENERGY, S.ELECTRIC_ENERGY, S.STORED_ENERGY];

export function applyEnergyTransfer(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.ENERGY)) return null;
  if (distSq > 40000) return null;
  const rate = 0.005 * synergy * (worldParams().ENERGY_TRANSFER ?? 1);
  for (const ch of ENERGY_CHANNELS) {
    const energyI = view[iBase + ch];
    const energyJ = view[jBase + ch];
    if (!Number.isFinite(energyI) || !Number.isFinite(energyJ)) continue;
    const diff = energyJ - energyI;
    if (Math.abs(diff) < 0.1) continue;
    const transfer = diff * rate;
    view[iBase + ch] += transfer;
    view[jBase + ch] -= transfer;
  }
  return null;
}

// ============================================================================
// 46. RADIATION — Ambient radiation damages low-armor particles
// ============================================================================
export function applyRadiationDamage(lawState, view, base, dt, synergy, prng) {
  if (!isSet(lawState, LAW_INDEXES.RADIATION)) return;

  const armor = view[base + S.ARMOR];
  const energy = view[base + S.ENERGY];
  if (!Number.isFinite(armor) || !Number.isFinite(energy)) return;

  // The RADIATION_LEVEL slider scales the damage (confirmed batch-04 spec).
  const level = Number.isFinite(worldParams().RADIATION_LEVEL) ? worldParams().RADIATION_LEVEL : 1;

  // Exposure builds very slowly but keeps increasing over time (cap 100).
  // The accumulated dose both worsens the damage and ramps mutation chance.
  let exposure = view[base + S.RADIATION_EXPOSURE] || 0;
  exposure += level * dt * 0.01;
  if (exposure > 100) exposure = 100;
  view[base + S.RADIATION_EXPOSURE] = exposure;

  // Energy damage: ARMOR shields; exposure slowly compounds the dose.
  const damage = (1 - armor) * 0.02 * level * (1 + exposure * 0.02) * dt * synergy;
  if (damage > 0.001) {
    const newEnergy = energy - damage;
    if (newEnergy <= 0) {
      // Radiation depletion kills — consistent with the batch-02 LIFE death.
      view[base + S.ENERGY] = 0;
      view[base + S.DEAD] = 1.0;
    } else {
      view[base + S.ENERGY] = newEnergy;
    }
  }

  // Mutation ramp: the accumulated dose slowly increases the chance of DNA
  // damage — more and more over time as exposure climbs.
  const mutationRate = view[base + S.DNA_CACHE_START + 12] || 0.5;
  const mutProb = exposure * 0.001 * dt * synergy;
  if (prng && mutProb > 0 && prng() < mutProb) {
    const hashVal = Math.sin(base * 173.3 + performance.now() * 0.001) * 43758.5453;
    const dnaIdx = Math.abs(Math.floor(hashVal)) % 42;
    const perturb = (prng() - 0.5) * mutationRate * 0.05;
    const val = view[base + S.DNA_CACHE_START + dnaIdx];
    if (Number.isFinite(val)) view[base + S.DNA_CACHE_START + dnaIdx] = val + perturb;
  }
}

// ============================================================================
// 47. TRACK — Predation tracking
// ============================================================================
export function applyTrackingBehavior(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
  if (!isSet(lawState, LAW_INDEXES.TRACK)) return null;
  if (dist < 1) return null;
  const massI = view[iBase + S.MASS];
  const massJ = view[jBase + S.MASS];
  if (!Number.isFinite(massI) || !Number.isFinite(massJ)) return null;
  const predationBias = view[iBase + S.DNA_CACHE_START + 36];
  if (!Number.isFinite(predationBias) || predationBias < 0.1) return null;
  // Predation is cross-species: a predator never hunts its own kind.
  if (view[iBase + S.SPECIES_ID] === view[jBase + S.SPECIES_ID]) return null;
  if (massJ < massI * 0.8) {
    const strength = predationBias * 0.05 * synergy;
    const invDist = 1.0 / dist;
    return {
      ax: dx * invDist * strength,
      ay: dy * invDist * strength,
      az: dz * invDist * strength,
    };
  }
  return null;
}

// ============================================================================
// 48. GENOTYPE — DNA mutation from environmental stress
// ============================================================================
export function applyGenotypeMutation(lawState, view, base, dt, synergy, prng, dnaBuffer) {
  if (!isSet(lawState, LAW_INDEXES.GENOTYPE)) return;
  const mutationRate = view[base + S.DNA_CACHE_START + 12];
  const temperature = view[base + S.TEMPERATURE];
  if (!Number.isFinite(mutationRate) || !Number.isFinite(temperature)) return;
  if (mutationRate < 0.01) return;

  const speciesId = view[base + S.SPECIES_ID] || 0;
  // Genetics params (42-47) come from the species genome (DNA buffer).
  const crossoverRate = readSpeciesDNAParam(dnaBuffer, speciesId, 43);
  const epigeneticDrift = readSpeciesDNAParam(dnaBuffer, speciesId, 44);
  const heterozygosity = readSpeciesDNAParam(dnaBuffer, speciesId, 45);
  const geneFlow = readSpeciesDNAParam(dnaBuffer, speciesId, 46);
  const repressor = readSpeciesDNAParam(dnaBuffer, speciesId, 47);

  // Accumulated radiation dose (RADIATION law) ramps the mutation rate —
  // radiation increases mutation chance more and more over time.
  const exposure = view[base + S.RADIATION_EXPOSURE] || 0;

  let mutProb = mutationRate * (1.0 + temperature) * dt * 0.01 * synergy
    * (1 - repressor * 0.5)   // REPRESSOR dampens genetic drift
    * (1 + exposure * 0.05);  // radiation dose ramps mutation over time
  if (mutProb < 0.001) return;

  const numMutations = Math.floor(mutProb * 3) + 1;
  const dnaStart = S.DNA_CACHE_START;

  for (let m = 0; m < numMutations; m++) {
    // Somatic drift — per-particle DNA cache (heritable through REPRO).
    const hashVal = Math.sin(base * 127.1 + m * 311.7 + performance.now() * 0.001) * 43758.5453;
    const dnaIdx = Math.abs(Math.floor(hashVal)) % 42;
    const perturbHash = Math.sin(base * 269.5 + dnaIdx * 183.3) * 43758.5453;
    const varScale = 1 + heterozygosity * 2; // HETEROZYGOSITY widens variance
    const perturb = ((perturbHash - Math.floor(perturbHash)) * 2.0 - 1.0) * mutationRate * 0.05 * varScale;
    const newVal = view[base + dnaStart + dnaIdx] + perturb;
    if (Number.isFinite(newVal)) {
      view[base + dnaStart + dnaIdx] = newVal;
    }

    // Epigenetic drift — extra non-heritable noise on the cache.
    if (epigeneticDrift > 0 && prng && prng() < 0.5) {
      const epiIdx = Math.abs(Math.floor(Math.sin(base * 91.7 + m * 173.1) * 43758.5453)) % 42;
      const epiNoise = (prng() - 0.5) * epigeneticDrift * 2;
      view[base + dnaStart + epiIdx] += epiNoise;
    }

    // Gene flow — horizontal transfer of a foreign gene into the cache.
    if (dnaBuffer && prng && prng() < geneFlow * 0.01) {
      const otherSpecies = (Math.floor(prng() * 63) >= speciesId) ? (Math.floor(prng() * 63) + 1) : Math.floor(prng() * 63);
      const r = DNA_RANGES[dnaIdx] || { min: -1, max: 1 };
      const foreign = readSpeciesDNAParam(dnaBuffer, otherSpecies, dnaIdx);
      view[base + dnaStart + dnaIdx] += (foreign - view[base + dnaStart + dnaIdx]) * 0.1;
    }
  }

  // Species-genome evolution — a rare heritable mutation written back to the
  // species DNA buffer, so evolution accumulates at the species level for
  // future spawns and offspring genetics. DNA and genetics are a major part
  // of VEPA, so this is slow but persistent.
  if (dnaBuffer && prng && prng() < crossoverRate * 0.0002 * dt) {
    const gIdx = Math.abs(Math.floor(Math.sin(base * 53.7 + performance.now() * 0.0007) * 43758.5453)) % 42;
    const current = readSpeciesDNAParam(dnaBuffer, speciesId, gIdx);
    const gPerturb = (prng() - 0.5) * mutationRate * 0.02;
    writeSpeciesDNAParam(dnaBuffer, speciesId, gIdx, current + gPerturb);
  }
}

// ============================================================================
// 49. PHENOTYPE — Express DNA as visual trait modulation
// ============================================================================
export function applyPhenotype(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.PHENOTYPE)) return;
  const energy = view[base + S.ENERGY];
  const radius = view[base + S.RADIUS];
  if (!Number.isFinite(energy) || !Number.isFinite(radius)) return;
  const energyFactor = 1 + (energy / 200 - 0.5) * 0.5 * synergy;
  view[base + S.RADIUS] = radius * energyFactor;
}

// ============================================================================
// 50. SOLVATION — Increase reaction rate in solvent
// ============================================================================
export function applySolvationEffect(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, LAW_INDEXES.SOLVATION)) return 1.0;
  const chargeI = view[iBase + S.CHARGE];
  const chargeJ = view[jBase + S.CHARGE];
  if (!Number.isFinite(chargeI) || !Number.isFinite(chargeJ)) return 1.0;
  const polarity = Math.abs(chargeI - chargeJ);
  if (polarity > 0.5) {
    return 1.0 + polarity * 0.2 * synergy;
  }
  return 1.0;
}

// ============================================================================
// 51. ACIDITY — Acidic charge damages unprotected particles
// ============================================================================
export function applyAcidityEffect(lawState, view, iBase, jBase, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.ACIDITY)) return;
  const chargeI = view[iBase + S.CHARGE];
  const chargeJ = view[jBase + S.CHARGE];
  if (!Number.isFinite(chargeI) || !Number.isFinite(chargeJ)) return;
  const diff = Math.abs(chargeI - chargeJ);
  if (diff < 0.3) return;
  const acidDamage = diff * 0.01 * dt * synergy;
  const energyJ = view[jBase + S.ENERGY];
  if (Number.isFinite(energyJ)) {
    view[jBase + S.ENERGY] -= acidDamage;
    view[iBase + S.ENERGY] += acidDamage * 0.5;
  }
}

// ============================================================================
// 52. OXIDATION — Charge imbalance causes structural degradation
// ============================================================================
export function applyOxidationEffect(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.OXIDATION)) return;
  const charge = Math.abs(view[base + S.CHARGE]);
  if (!Number.isFinite(charge) || charge < 0.3) return;
  const mass = view[base + S.MASS];
  if (Number.isFinite(mass) && mass > 0.1) {
    view[base + S.MASS] -= charge * 0.001 * dt * synergy;
  }
  // HEAT_OUTPUT DNA (39): charged oxidation releases energy + temperature.
  const heatOutput = view[base + S.DNA_CACHE_START + D.HEAT_OUTPUT] || 0;
  if (heatOutput > 0.001) {
    const release = charge * heatOutput * 0.05 * dt * synergy;
    view[base + S.ENERGY] = Math.min(200, (view[base + S.ENERGY] || 0) + release);
    view[base + S.TEMPERATURE] = (view[base + S.TEMPERATURE] || 0) + release * 0.01;
  }
}

// ============================================================================
// 53. ISOMERIZATION — Structural rearrangement changes properties
// ============================================================================
export function applyIsomerization(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.ISOMERIZATION)) return;
  const age = view[base + S.AGE];
  if (!Number.isFinite(age)) return;
  const phase = Math.sin(age * 0.01) * 0.1 * dt * synergy;
  const radius = view[base + S.RADIUS];
  if (Number.isFinite(radius)) {
    view[base + S.RADIUS] = radius * (1 + phase * 0.05);
  }
}

// ============================================================================
// 54. CHIRALITY — Handedness affects interaction bias
// ============================================================================
export function applyChirality(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
  if (!isSet(lawState, LAW_INDEXES.CHIRALITY)) return null;
  if (dist < 1) return null;
  const polI = view[iBase + S.DNA_CACHE_START + 4];
  const polJ = view[jBase + S.DNA_CACHE_START + 4];
  if (!Number.isFinite(polI) || !Number.isFinite(polJ)) return null;
  if ((polI > 0 && polJ > 0) || (polI < 0 && polJ < 0)) {
    const strength = 0.01 * synergy;
    const invDist = 1.0 / dist;
    return {
      ax: -dy * invDist * strength,
      ay: dx * invDist * strength,
      az: 0,
    };
  }
  return null;
}

// ============================================================================
// 55. CRYSTALLIZATION — Particles align into ordered lattice
// ============================================================================
export function applyCrystallization(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
  if (!isSet(lawState, LAW_INDEXES.CRYSTALLIZATION)) return null;
  if (dist < 1 || dist > 30) return null;
  const gridSize = 8.0;
  const targetX = Math.round(dx / gridSize) * gridSize;
  const targetY = Math.round(dy / gridSize) * gridSize;
  const targetZ = Math.round(dz / gridSize) * gridSize;
  const pullX = (targetX - dx) * 0.01 * synergy;
  const pullY = (targetY - dy) * 0.01 * synergy;
  const pullZ = (targetZ - dz) * 0.01 * synergy;
  return {
    ax: pullX,
    ay: pullY,
    az: pullZ,
  };
}

// ============================================================================
// 56. PHASE_RADIATION — Hot particles radiate energy as light
// ============================================================================
export function applyPhaseRadiation(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.PHASE_RADIATION)) return;
  const temp = view[base + S.TEMPERATURE];
  const energy = view[base + S.ENERGY];
  if (!Number.isFinite(temp) || !Number.isFinite(energy)) return;
  if (temp > 0.6) {
    const radiated = (temp - 0.6) * 0.02 * dt * synergy;
    view[base + S.ENERGY] -= radiated;
    view[base + S.TEMPERATURE] -= radiated;
    view[base + S.SIGNAL] = Math.min(1, view[base + S.SIGNAL] + radiated);
  }
}

// ============================================================================
// 57. SUBLIMATION — Solid particles skip liquid phase
// ============================================================================
export function applySublimation(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, LAW_INDEXES.SUBLIMATION)) return;
  const temp = view[base + S.TEMPERATURE];
  const mass = view[base + S.MASS];
  if (!Number.isFinite(temp) || !Number.isFinite(mass)) return;
  if (temp > 0.5 && mass > 0.2) {
    const sublRate = (temp - 0.5) * 0.005 * dt * synergy;
    view[base + S.MASS] -= sublRate;
    view[base + S.VEL_X] += (Math.random() - 0.5) * sublRate * 5;
    view[base + S.VEL_Y] += (Math.random() - 0.5) * sublRate * 5;
    view[base + S.TEMPERATURE] -= sublRate * 0.5;
  }
}

// ============================================================================
// 11. ELECTROMAGNETISM (cyan)
// ============================================================================

/** CHARGE_LAW — Coulomb force from POLARITY DNA + stored stride CHARGE. */
export function applyChargeForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const q1 = readDNA(p1Ptr, D.POLARITY) || 0;
  const q2 = readDNA(p2Ptr, D.POLARITY) || 0;
  const c1 = buf[p1Ptr + S.CHARGE] || 0;
  const c2 = buf[p2Ptr + S.CHARGE] || 0;
  const qq = q1 * q2 + c1 * c2 * 0.5;
  if (qq === 0) return null;
  const force = -k * qq / (dist * dist + 0.5); // like charges repel, opposite attract
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** FIELD — uniform drift along POLARITY sign (per-particle). */
export function applyFieldDrift(p1Ptr, k) {
  const q = readDNA(p1Ptr, D.POLARITY) || 0;
  if (q === 0) return null;
  return { ax: q * k * 0.7, ay: q * k, az: 0 };
}

/** CURRENT — charge diffusion between conductive neighbors. */
export function applyCurrentTransfer(p1Ptr, p2Ptr, distSq, k) {
  const buf = buffer_global;
  if (distSq > 300) return;
  const cond = Math.max(readDNA(p1Ptr, D.CONDUCTIVITY) || 0, readDNA(p2Ptr, D.CONDUCTIVITY) || 0);
  if (cond <= 0) return;
  const dq = (buf[p2Ptr + S.CHARGE] - buf[p1Ptr + S.CHARGE]) * cond * k;
  if (dq === 0) return;
  buf[p1Ptr + S.CHARGE] += dq;
  buf[p2Ptr + S.CHARGE] -= dq;
}

/** RESISTANCE — kinetic energy → heat + velocity damping (per-particle). */
export function applyResistance(p1Ptr, vx, vy, vz, k) {
  const buf = buffer_global;
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  if (speed < 0.01) return null;
  buf[p1Ptr + S.TEMPERATURE] = Math.min(1, (buf[p1Ptr + S.TEMPERATURE] || 0) + speed * k * 0.5);
  const damp = speed * k;
  return { ax: -vx * damp, ay: -vy * damp, az: -vz * damp };
}

/** CAPACITANCE — store surplus energy as charge (per-particle). */
export function applyCapacitanceStore(p1Ptr, k) {
  const buf = buffer_global;
  const energy = buf[p1Ptr + S.ENERGY] || 50;
  const delta = (energy - 50) * k;
  buf[p1Ptr + S.CHARGE] = clamp((buf[p1Ptr + S.CHARGE] || 0) + delta, -2, 2);
}

/** CAPACITANCE — pairwise force from stored charge. */
export function applyStoredChargeForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const c1 = buf[p1Ptr + S.CHARGE] || 0;
  const c2 = buf[p2Ptr + S.CHARGE] || 0;
  const qq = c1 * c2;
  if (qq === 0) return null;
  const force = -k * qq / (dist * dist + 0.5); // same-sign stored charge repels
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** INDUCTANCE — velocity alignment (magnetic coupling), in-place. */
export function applyInductance(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  for (const slot of [S.VEL_X, S.VEL_Y, S.VEL_Z]) {
    const dv = (buf[p2Ptr + slot] - buf[p1Ptr + slot]) * k;
    buf[p1Ptr + slot] += dv;
    buf[p2Ptr + slot] -= dv;
  }
}

/** MAGNETISM — aligned moments attract, opposing repel. */
export function applyMagneticForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const m1 = readDNA(p1Ptr, D.MAGNETIC_MOMENT) || 0;
  const m2 = readDNA(p2Ptr, D.MAGNETIC_MOMENT) || 0;
  const mm = m1 * m2;
  if (mm === 0) return null;
  const force = k * mm / (dist * dist + 0.5);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** RESONANCE — pulsing particles with similar PULSE_RATE attract. */
export function applyResonanceForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const s1 = buf[p1Ptr + S.SIGNAL] || 0;
  const s2 = buf[p2Ptr + S.SIGNAL] || 0;
  if (s1 <= 0.01 || s2 <= 0.01) return null;
  const sync = 1.0 - Math.abs((readDNA(p1Ptr, D.PULSE_RATE) || 0.5) - (readDNA(p2Ptr, D.PULSE_RATE) || 0.5));
  const sig = s1 * s2 * Math.max(0, sync);
  if (sig <= 0.001) return null;
  const force = k * sig / (dist + 1.0);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** FLUX — push along the stored-charge gradient. */
export function applyFluxForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const dq = (buf[p2Ptr + S.CHARGE] || 0) - (buf[p1Ptr + S.CHARGE] || 0);
  if (dq === 0) return null;
  const force = k * dq / (dist + 1.0);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** IONIZATION — hard contacts strip charge onto particles. */
export function applyIonization(p1Ptr, p2Ptr, dist, relSpeed, k) {
  const buf = buffer_global;
  if (dist > 3.0) return;
  const impact = Math.min(1, relSpeed * k);
  if (impact <= 0.01) return;
  if ((buf[p1Ptr + S.CHARGE] || 0) === 0) {
    buf[p1Ptr + S.CHARGE] = (readDNA(p1Ptr, D.POLARITY) || 0) * impact;
  }
  if ((buf[p2Ptr + S.CHARGE] || 0) === 0) {
    buf[p2Ptr + S.CHARGE] = (readDNA(p2Ptr, D.POLARITY) || 0) * impact;
  }
}

/** DISCHARGE — stored charge bursts into motion + heat (per-particle). */
export function applyDischarge(p1Ptr, prng, k) {
  const buf = buffer_global;
  const c = buf[p1Ptr + S.CHARGE] || 0;
  if (Math.abs(c) < 0.5) return null;
  const kick = c * k;
  const dir = prng ? (prng() - 0.5) * 2 : 0;
  buf[p1Ptr + S.TEMPERATURE] = Math.min(1, (buf[p1Ptr + S.TEMPERATURE] || 0) + Math.abs(c) * 0.08);
  buf[p1Ptr + S.CHARGE] = 0;
  return {
    ax: nanGuard(kick * 0.6),
    ay: nanGuard(kick * dir),
    az: nanGuard(kick * 0.2),
  };
}

/** PLASMA — hot particles ionize: surplus heat becomes stored charge. */
export function applyPlasma(p1Ptr, k) {
  const buf = buffer_global;
  const temp = buf[p1Ptr + S.TEMPERATURE] || 0;
  const excess = temp - 0.6;
  if (excess <= 0) return;
  const conv = excess * k;
  buf[p1Ptr + S.CHARGE] = clamp((buf[p1Ptr + S.CHARGE] || 0) + conv, -2, 2);
  buf[p1Ptr + S.TEMPERATURE] = temp - conv * 0.5;
}

/** SUPERCONDUCTIVITY — cold pairs couple: relative motion damped + charge equalized. */
export function applySuperconductivity(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const t1 = buf[p1Ptr + S.TEMPERATURE] || 0;
  const t2 = buf[p2Ptr + S.TEMPERATURE] || 0;
  if (t1 > 0.35 || t2 > 0.35) return null;
  const dq = ((buf[p2Ptr + S.CHARGE] || 0) - (buf[p1Ptr + S.CHARGE] || 0)) * k * 0.4;
  buf[p1Ptr + S.CHARGE] = (buf[p1Ptr + S.CHARGE] || 0) + dq;
  buf[p2Ptr + S.CHARGE] = (buf[p2Ptr + S.CHARGE] || 0) - dq;
  // Coupling force: damps the subject's motion toward the neighbor's velocity
  return {
    ax: nanGuard((buf[p2Ptr + S.VEL_X] - buf[p1Ptr + S.VEL_X]) * k),
    ay: nanGuard((buf[p2Ptr + S.VEL_Y] - buf[p1Ptr + S.VEL_Y]) * k),
    az: nanGuard((buf[p2Ptr + S.VEL_Z] - buf[p1Ptr + S.VEL_Z]) * k),
  };
}

// ============================================================================
// 12. INFORMATION (gold)
// ============================================================================

/** MEMORY — refresh the trace on contact. */
export function applyMemoryRefresh(p1Ptr, p2Ptr) {
  const buf = buffer_global;
  buf[p1Ptr + S.MEMORY] = Math.min(1, (buf[p1Ptr + S.MEMORY] || 0) + 0.05);
  buf[p2Ptr + S.MEMORY] = Math.min(1, (buf[p2Ptr + S.MEMORY] || 0) + 0.05);
}

/** MEMORY — decay + momentum persistence (per-particle). */
export function applyMemoryDecay(p1Ptr, decay, k) {
  const buf = buffer_global;
  const mem = buf[p1Ptr + S.MEMORY] || 0;
  if (mem <= 0) return;
  buf[p1Ptr + S.MEMORY] = mem * decay;
  buf[p1Ptr + S.VEL_X] *= 1.0 + mem * k * 0.02;
  buf[p1Ptr + S.VEL_Y] *= 1.0 + mem * k * 0.02;
  buf[p1Ptr + S.VEL_Z] *= 1.0 + mem * k * 0.02;
}

/** PATTERN — cohesion: dense regions pull particles together. */
export function applyPatternForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  if (dist < 1.0) return null;
  const force = k / (dist + 1.0);
  const invDist = 1.0 / dist;
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** STIGMERGY — write a predicted-path trail marker (per-particle). */
export function applyTrailWrite(p1Ptr, px, py, pz, vx, vy, vz) {
  const buf = buffer_global;
  buf[p1Ptr + S.TRAIL_X] = px + vx * 8.0;
  buf[p1Ptr + S.TRAIL_Y] = py + vy * 8.0;
  buf[p1Ptr + S.TRAIL_Z] = pz + vz * 8.0;
}

/** STIGMERGY — follow a neighbor's trail marker. */
export function applyStigmergyForce(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const tx = buf[p2Ptr + S.TRAIL_X] || 0;
  const ty = buf[p2Ptr + S.TRAIL_Y] || 0;
  const tz = buf[p2Ptr + S.TRAIL_Z] || 0;
  const ddx = tx - buf[p1Ptr + S.POS_X];
  const ddy = ty - buf[p1Ptr + S.POS_Y];
  const ddz = tz - buf[p1Ptr + S.POS_Z];
  const dd = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz) + 1.0;
  return {
    ax: nanGuard((ddx / dd) * k),
    ay: nanGuard((ddy / dd) * k),
    az: nanGuard((ddz / dd) * k),
  };
}

/** SIGNAL_BOOST — relay signal to a neighbor on contact. */
export function applySignalBoost(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const s1 = buf[p1Ptr + S.SIGNAL] || 0;
  if (s1 > 0.01) {
    buf[p2Ptr + S.SIGNAL] = Math.min(1, (buf[p2Ptr + S.SIGNAL] || 0) + s1 * k);
  }
}

/** LEARN — velocity matching (boids alignment), in-place. */
export function applyLearnAlign(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const kk = k * 0.1;
  for (const slot of [S.VEL_X, S.VEL_Y, S.VEL_Z]) {
    buf[p1Ptr + slot] += (buf[p2Ptr + slot] - buf[p1Ptr + slot]) * kk;
  }
}

/** SYMBOL — species affinity social force. */
export function applySymbolForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const same = buf[p1Ptr + S.SPECIES_ID] === buf[p2Ptr + S.SPECIES_ID];
  let affinity = readDNA(p1Ptr, D.SPECIES_AFFINITY) || 0;
  if (!same) affinity = -affinity * 0.5;
  if (affinity === 0) return null;
  const force = k * affinity / (dist + 1.0);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** METRIC — climb the energy gradient. */
export function applyMetricForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const dE = (buf[p2Ptr + S.ENERGY] || 50) - (buf[p1Ptr + S.ENERGY] || 50);
  if (dE === 0) return null;
  const force = k * dE / (dist + 1.0);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** PREDICT — aim at the neighbor's extrapolated position. */
export function applyPredictForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const t = 3.0;
  const pdx = dx + (buf[p2Ptr + S.VEL_X] - buf[p1Ptr + S.VEL_X]) * t;
  const pdy = dy + (buf[p2Ptr + S.VEL_Y] - buf[p1Ptr + S.VEL_Y]) * t;
  const pdz = dz + (buf[p2Ptr + S.VEL_Z] - buf[p1Ptr + S.VEL_Z]) * t;
  const pd = Math.sqrt(pdx * pdx + pdy * pdy + pdz * pdz) + 0.001;
  const force = k / (dist + 1.0);
  return {
    ax: nanGuard((pdx / pd) * force),
    ay: nanGuard((pdy / pd) * force),
    az: nanGuard((pdz / pd) * force),
  };
}

/** CODE — blend DNA cache loci between contacting particles. */
export function applyCodeBlend(p1Ptr, p2Ptr, distSq, k) {
  const buf = buffer_global;
  if (distSq > 16.0) return;
  const rate = k * 0.01;
  for (let d = 0; d < 42; d += 6) {
    const base = S.DNA_CACHE_START + d;
    const v1 = buf[p1Ptr + base];
    const v2 = buf[p2Ptr + base];
    buf[p1Ptr + base] = v1 + (v2 - v1) * rate;
    buf[p2Ptr + base] = v2 + (v1 - v2) * rate;
  }
}

/** PROTOCOL — entrain signal phase between neighbors. */
export function applyProtocolSync(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const s1 = buf[p1Ptr + S.SIGNAL] || 0;
  const s2 = buf[p2Ptr + S.SIGNAL] || 0;
  const d1 = (s2 - s1) * k;
  buf[p1Ptr + S.SIGNAL] = Math.max(0, Math.min(1, s1 + d1));
  buf[p2Ptr + S.SIGNAL] = Math.max(0, Math.min(1, s2 - d1));
}

/** FEEDBACK — memory amplifies motion and motion refreshes memory. */
export function applyFeedback(p1Ptr, k) {
  const buf = buffer_global;
  const mem = buf[p1Ptr + S.MEMORY] || 0;
  const vx = buf[p1Ptr + S.VEL_X] || 0;
  const vy = buf[p1Ptr + S.VEL_Y] || 0;
  const vz = buf[p1Ptr + S.VEL_Z] || 0;
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  buf[p1Ptr + S.MEMORY] = Math.min(1, mem + speed * k * 0.02);
  if (mem <= 0 || speed < 0.001) return null;
  // Self-propulsion along current velocity, scaled by the memory trace
  const boost = mem * k * 0.1;
  return {
    ax: nanGuard(vx * boost),
    ay: nanGuard(vy * boost),
    az: nanGuard(vz * boost),
  };
}

/** LANGUAGE — signaling pairs exchange memory traces (shared words). */
export function applyLanguage(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const s1 = buf[p1Ptr + S.SIGNAL] || 0;
  const s2 = buf[p2Ptr + S.SIGNAL] || 0;
  if (s1 <= 0.01 && s2 <= 0.01) return;
  const m1 = buf[p1Ptr + S.MEMORY] || 0;
  const m2 = buf[p2Ptr + S.MEMORY] || 0;
  const avg = (m1 + m2) * 0.5;
  buf[p1Ptr + S.MEMORY] = m1 + (avg - m1) * k;
  buf[p2Ptr + S.MEMORY] = m2 + (avg - m2) * k;
  if (s1 > 0.01) {
    buf[p2Ptr + S.SIGNAL] = Math.min(1, (buf[p2Ptr + S.SIGNAL] || 0) + s1 * k * 0.1);
  }
}

/** CULTURE — same-species contacts converge their DNA cache. */
export function applyCulture(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  if (buf[p1Ptr + S.SPECIES_ID] !== buf[p2Ptr + S.SPECIES_ID]) return;
  const rate = k * 0.02;
  for (let d = 0; d < 42; d += 3) {
    const base = S.DNA_CACHE_START + d;
    const v1 = buf[p1Ptr + base];
    const v2 = buf[p2Ptr + base];
    buf[p1Ptr + base] = v1 + (v2 - v1) * rate;
    buf[p2Ptr + base] = v2 + (v1 - v2) * rate;
  }
}

// ============================================================================
// 13. NEW LAW TYPES (singularity / entanglement / history)
// ============================================================================

/** SINGULARITY — extreme inward pull from a supermassive neighbour. */
export function applySingularityForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const m2 = buf[p2Ptr + S.MASS] || 0;
  if (m2 < SINGULARITY_MASS) return null;
  const force = k * (m2 * m2) / (dist * dist + 0.5);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/**
 * SINGULARITY — event horizon absorption. The subject (p1, a normal particle)
 * is consumed by the neighbouring singularity (p2). Returns true if absorbed.
 */
export function applySingularityAbsorb(p1Ptr, p2Ptr, dist, k) {
  const buf = buffer_global;
  const m2 = buf[p2Ptr + S.MASS] || 0;
  if (m2 < SINGULARITY_MASS) return false;
  const horizon = Math.max(2.5, Math.sqrt(m2) * 0.8);
  if (dist >= horizon) return false;
  const m1 = buf[p1Ptr + S.MASS] || 0;
  if (m1 <= 0) return false;
  buf[p2Ptr + S.MASS] = m2 + m1;
  buf[p2Ptr + S.TEMPERATURE] = Math.min(1, (buf[p2Ptr + S.TEMPERATURE] || 0) + 0.12 * k);
  buf[p1Ptr + S.MASS] = 0;
  buf[p1Ptr + S.DEAD] = 1;
  return true;
}

/** ENTANGLEMENT — contact pairs two unentangled particles into a quantum link. */
export function applyEntanglePair(p1Ptr, p2Ptr, dist) {
  const buf = buffer_global;
  if (buf[p1Ptr + S.ENTANGLE_ID] >= 0 || buf[p2Ptr + S.ENTANGLE_ID] >= 0) return;
  const rSum = (buf[p1Ptr + S.RADIUS] || 0.6) + (buf[p2Ptr + S.RADIUS] || 0.6);
  if (dist > rSum + 0.5) return;
  buf[p1Ptr + S.ENTANGLE_ID] = p2Ptr / PARTICLE_STRIDE;
  buf[p2Ptr + S.ENTANGLE_ID] = p1Ptr / PARTICLE_STRIDE;
  buf[p1Ptr + S.ENTANGLE_PHASE] = 1.0;
  buf[p2Ptr + S.ENTANGLE_PHASE] = 1.0;
}

/**
 * ENTANGLEMENT — non-local coupling (per-particle). Momentum converges with
 * the partner at any distance; signals relay through the link; the phase
 * decays until the link snaps with a recoil kick.
 */
export function applyEntanglement(p1Ptr, k, prng) {
  const buf = buffer_global;
  const partnerIdx = buf[p1Ptr + S.ENTANGLE_ID];
  if (partnerIdx < 0) return null;
  const phase = buf[p1Ptr + S.ENTANGLE_PHASE] || 0;
  buf[p1Ptr + S.ENTANGLE_PHASE] = phase * 0.998;

  const jBase = partnerIdx * PARTICLE_STRIDE;
  if (buf[jBase + S.DEAD] >= 0.5 || buf[jBase + S.MASS] <= 0) {
    // partner lost → recoil kick, link snaps
    buf[p1Ptr + S.ENTANGLE_ID] = -1;
    buf[p1Ptr + S.ENTANGLE_PHASE] = 0;
    if (prng) {
      return {
        ax: nanGuard((prng() - 0.5) * 0.8),
        ay: nanGuard((prng() - 0.5) * 0.8),
        az: nanGuard((prng() - 0.5) * 0.8),
      };
    }
    return null;
  }

  if (buf[p1Ptr + S.ENTANGLE_PHASE] < 0.05) {
    buf[p1Ptr + S.ENTANGLE_ID] = -1;
    buf[p1Ptr + S.ENTANGLE_PHASE] = 0;
    return null;
  }

  // non-local momentum exchange (returned as a force — survives integration)
  const dvx = (buf[jBase + S.VEL_X] - buf[p1Ptr + S.VEL_X]) * k * phase;
  const dvy = (buf[jBase + S.VEL_Y] - buf[p1Ptr + S.VEL_Y]) * k * phase;
  const dvz = (buf[jBase + S.VEL_Z] - buf[p1Ptr + S.VEL_Z]) * k * phase;

  // non-local signal relay (persists in stride)
  const sJ = buf[jBase + S.SIGNAL] || 0;
  if (sJ > 0.3) {
    buf[p1Ptr + S.SIGNAL] = Math.max(buf[p1Ptr + S.SIGNAL] || 0, sJ * phase);
  }

  return {
    ax: nanGuard(dvx),
    ay: nanGuard(dvy),
    az: nanGuard(dvz),
  };
}

/** HISTORY — accumulate presence into the spatial memory field. */
export function applyHistoryWrite(p1Ptr, px, py, pz, worldSize) {
  const buf = buffer_global;
  if (!historyField) return;
  const cx = Math.max(0, Math.min(HISTORY_DIM - 1, Math.floor((px / worldSize) * HISTORY_DIM)));
  const cy = Math.max(0, Math.min(HISTORY_DIM - 1, Math.floor((py / worldSize) * HISTORY_DIM)));
  const cz = Math.max(0, Math.min(HISTORY_DIM - 1, Math.floor((pz / worldSize) * HISTORY_DIM)));
  const c = cx + cy * HISTORY_DIM + cz * HISTORY_DIM * HISTORY_DIM;
  const dt = historyTick - (historyLast[c] || 0);
  const presence = (buf[p1Ptr + S.ENERGY] || 50) * 0.02 + (buf[p1Ptr + S.MASS] || 1) * 0.05;
  historyField[c] = historyField[c] * Math.pow(HISTORY_DECAY, dt) + presence;
  historyLast[c] = historyTick;
}

/** Advance the memory-field clock once per solve and refresh the centre of mass. */
export function applyHistoryCalc() {
  if (!historyField) return;
  historyTick++;
  computeHistoryCom();
}

/** Recompute the field centre of mass from the current memory field. */
function computeHistoryCom() {
  let sum = 0, sx = 0, sy = 0, sz = 0;
  for (let z = 0; z < HISTORY_DIM; z++) {
    for (let y = 0; y < HISTORY_DIM; y++) {
      for (let x = 0; x < HISTORY_DIM; x++) {
        const v = historyField[x + y * HISTORY_DIM + z * HISTORY_DIM * HISTORY_DIM] || 0;
        sum += v;
        sx += v * x;
        sy += v * y;
        sz += v * z;
      }
    }
  }
  if (sum < 1e-6) {
    historyComX = HISTORY_DIM * 0.5;
    historyComY = HISTORY_DIM * 0.5;
    historyComZ = HISTORY_DIM * 0.5;
    return;
  }
  historyComX = sx / sum;
  historyComY = sy / sum;
  historyComZ = sz / sum;
}

/** HISTORY — drift toward the field's centre of mass (global memory attractor). */
export function applyHistoryForce(p1Ptr, px, py, pz, worldSize, k) {
  if (!historyField) return null;
  const cellX = (px / worldSize) * HISTORY_DIM;
  const cellY = (py / worldSize) * HISTORY_DIM;
  const cellZ = (pz / worldSize) * HISTORY_DIM;
  const gx = historyComX - cellX;
  const gy = historyComY - cellY;
  const gz = historyComZ - cellZ;
  const gm = Math.sqrt(gx * gx + gy * gy + gz * gz);
  if (gm < 0.01) return null;
  return {
    ax: nanGuard((gx / gm) * k),
    ay: nanGuard((gy / gm) * k),
    az: nanGuard((gz / gm) * k),
  };
}
