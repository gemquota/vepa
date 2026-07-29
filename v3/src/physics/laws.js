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

import { STRIDE_INDEXES, DNA_INDEXES } from '../constants.js';
import { isSet } from '../state/lawState.js';

const S = STRIDE_INDEXES;
const D = DNA_INDEXES;
const DNA_BASE = S.DNA_CACHE_START;

let buffer_global = null;

/**
 * Set the shared particle buffer reference.
 */
export function setBuffer(buffer) {
  buffer_global = buffer;
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
  const force = G * m1 * m2 / dist2;
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

    // Merge when particles are close and moving slowly
    // fusionMomentum defines max relative speed for merging (higher = can merge faster collisions)
    if (relSpeed < fusionMomentum * 2.0) {
      const gain = m2 * 0.3;
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
// 14. PLANETARY (Central gravity well)
// ============================================================================
export function applyPlanetary(lawState, view, base, px, py, pz, worldSize, synergy) {
  if (!isSet(lawState, 6)) return null; // LAW_INDEXES.PLANETARY = 6

  const cx = worldSize * 0.5;
  const cy = worldSize * 0.5;
  const cz = worldSize * 0.5;
  const dx = cx - px;
  const dy = cy - py;
  const dz = cz - pz;
  const distSq = dx * dx + dy * dy + dz * dz;
  if (distSq < 1) return null;

  const strength = 0.001 * synergy;
  const invDist = 1 / Math.sqrt(distSq);
  return {
    ax: dx * invDist * strength,
    ay: dy * invDist * strength,
    az: dz * invDist * strength,
  };
}

// ============================================================================
// 15. LIFE CYCLE
// ============================================================================
export function applyLifeCycle(lawState, view, base, dnaParams, dt, prng, synergy) {
  if (!isSet(lawState, 7)) return; // LAW_INDEXES.LIFE = 7

  const age = view[base + S.AGE] + dt;
  view[base + S.AGE] = age;

  let energy = view[base + S.ENERGY];
  const decayRate = 0.01 * (1 - dnaParams[34] * synergy); // ENERGY_EFFICIENCY=34
  energy -= decayRate * dt;
  if (energy < 0) energy = 0;
  view[base + S.ENERGY] = energy;

  let hunger = view[base + S.HUNGER] + dt * 0.02;
  if (hunger > 100) {
    view[base + S.DEAD] = 1.0;
    return;
  }
  view[base + S.HUNGER] = hunger;

  // Senescence (LAW_INDEXES.SENESCENCE = 12)
  if (isSet(lawState, 12)) {
    const deathRate = dnaParams[11] * 0.001; // DEATH_RATE=11
    if (age > 500 && prng() < deathRate * dt) {
      view[base + S.DEAD] = 1.0;
      return;
    }
  }

  // Radiation (LAW_INDEXES.RADIATION = 14)
  if (isSet(lawState, 14)) {
    const armor = view[base + S.ARMOR];
    energy -= (0.1 - armor * 0.01) * dt;
    if (energy <= 0) {
      view[base + S.DEAD] = 1.0;
    }
    view[base + S.ENERGY] = Math.max(0, energy);
  }
}

// ============================================================================
// 16. SIGNAL DECAY
// ============================================================================
export function applySignalDecay(lawState, view, base, dnaParams, dt) {
  if (!isSet(lawState, 8) && !isSet(lawState, 11)) return; // GLOW=8, TRACK=11

  const decay = dnaParams[20]; // SIGNAL_DECAY=20
  let signal = view[base + S.SIGNAL];
  signal *= Math.pow(decay, dt);

  const pulseRate = dnaParams[14]; // PULSE_RATE=14
  signal += pulseRate * dt * 0.01;
  if (signal > 1) signal = 1;
  view[base + S.SIGNAL] = signal;
}

// ============================================================================
// 17. AFFINITY
// ============================================================================
export function applyAffinity(lawState, view, iBase, jBase, dx, dy, dz, distSq, synergy) {
  if (!isSet(lawState, 9)) return null; // AFFINITY=9
  if (distSq < 1) return null;

  const speciesI = view[iBase + S.SPECIES_ID];
  const speciesJ = view[jBase + S.SPECIES_ID];
  const affinityI = view[iBase + S.DNA_CACHE_START + 41]; // SPECIES_AFFINITY=41

  if (speciesI === speciesJ) {
    const strength = 0.1 * Math.abs(affinityI) * synergy;
    const invDist = 1 / Math.sqrt(distSq);
    return {
      ax: dx * invDist * strength,
      ay: dy * invDist * strength,
      az: dz * invDist * strength,
    };
  }

  if (affinityI < 0) {
    const strength = 0.05 * Math.abs(affinityI) * synergy;
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
export function applyReproduction(lawState, view, base, dnaParams, prng, synergy) {
  if (!isSet(lawState, 10)) return null; // REPRO=10

  const energy = view[base + S.ENERGY];
  const age = view[base + S.AGE];
  const birthRate = dnaParams[10]; // BIRTH_RATE=10

  if (energy < 60 || age < 100) return null;
  if (prng() > birthRate * synergy * 0.01) return null;

  view[base + S.ENERGY] = energy * 0.5;

  const px = view[base + S.POS_X];
  const py = view[base + S.POS_Y];
  const pz = view[base + S.POS_Z];
  const speciesId = view[base + S.SPECIES_ID];

  const mutationRate = dnaParams[12] * 0.1; // MUTATION=12
  const offspringDna = new Array(42);
  for (let d = 0; d < 42; d++) {
    const val = dnaParams[d] + (prng() - 0.5) * mutationRate * 10;
    offspringDna[d] = Math.max(-100, Math.min(100, val));
  }

  return {
    x: px + (prng() - 0.5) * 20,
    y: py + (prng() - 0.5) * 20,
    z: pz + (prng() - 0.5) * 20,
    vx: 0, vy: 0, vz: 0,
    speciesId,
    mass: view[base + S.MASS] * 0.8,
    energy: 60,
    dna: offspringDna,
  };
}

// ============================================================================
// 19. CHEMISTRY MODIFIER
// ============================================================================
export function applyChemistry(lawState, view, iBase, jBase, distSq, synergy) {
  let multiplier = 1.0;

  if (isSet(lawState, 17)) { // CATALYSIS_LAW=17
    const catI = view[iBase + S.DNA_CACHE_START + 38]; // CATALYSIS=38
    multiplier *= 1.0 + catI * 0.5 * synergy;
  }

  if (isSet(lawState, 18)) multiplier *= 1.2; // SOLVATION=18

  if (isSet(lawState, 19)) { // ACIDITY=19
    const chargeI = view[iBase + S.CHARGE];
    const chargeJ = view[jBase + S.CHARGE];
    const polarity = Math.abs(chargeI - chargeJ);
    multiplier *= 1.0 + polarity * 0.3;
  }

  if (isSet(lawState, 24) && distSq < 100) { // CRYSTALLIZATION=24
    multiplier *= 1.5;
  }

  return multiplier;
}

// ============================================================================
// 20. POLYMER (bond formation)
// ============================================================================
export function applyPolymer(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
  if (!isSet(lawState, 21)) return { ax: 0, ay: 0, az: 0 };
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
  if (!isSet(lawState, 25) && !isSet(lawState, 26)) return; // HEAT=25, COLD=26

  const tempI = view[iBase + S.TEMPERATURE];
  const tempJ = view[jBase + S.TEMPERATURE];
  const diff = tempI - tempJ;

  if (isSet(lawState, 25)) {
    const rate = 0.01 * dt * synergy;
    view[iBase + S.TEMPERATURE] -= diff * rate;
    view[jBase + S.TEMPERATURE] += diff * rate;
  }

  if (isSet(lawState, 26) && tempJ > tempI) {
    const rate = 0.015 * dt * synergy;
    const tDec2 = diff * rate;
    const tInc2 = diff * rate;
    view[jBase + S.TEMPERATURE] -= (tDec2 !== tDec2) ? 0 : tDec2;
    view[iBase + S.TEMPERATURE] += (tInc2 !== tInc2) ? 0 : tInc2;
  }
}

// ============================================================================
// 22. CONVECTION
// ============================================================================
export function applyConvection(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, 27)) return; // CONVECTION=27

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
  if (!isSet(lawState, 30)) return 1.0; // TIME_DILATION=30
  const soul = view[base + S.SOUL];
  return 1.0 - soul * 0.3 * synergy;
}

// ============================================================================
// 24. DIMENSIONALITY
// ============================================================================
export function applyDimensionality(lawState, view, base, prng, dt, synergy) {
  if (!isSet(lawState, 31)) return; // DIMENSIONALITY=31
  const force = (prng() - 0.5) * 0.1 * synergy * dt;
  view[base + S.VEL_Z] += force;
}

// ============================================================================
// 25. CHAOS
// ============================================================================
export function applyChaos(lawState, view, base, prng, dt, synergy) {
  if (!isSet(lawState, 32)) return; // CHAOS=32
  const force = (prng() - 0.5) * 0.5 * synergy * dt;
  view[base + S.VEL_X] += force;
  view[base + S.VEL_Y] += force;
  view[base + S.VEL_Z] += force * 0.5;
}

// ============================================================================
// 26. ORDER
// ============================================================================
export function applyOrder(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, 33)) return null; // ORDER=33
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
  if (!isSet(lawState, 34)) return null; // FATE=34
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
  if (!isSet(lawState, 35)) return; // WILL=35

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
  if (!isSet(lawState, 36)) return; // SOUL_LAW=36
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
  if (!isSet(lawState, 37)) return null; // MIND=37
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
  if (!isSet(lawState, 38)) return null;
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
  if (!isSet(lawState, 39)) return null;
  if (dist < 0.1 || dist > 20) return null;
  const stiffness = view[iBase + S.DNA_CACHE_START + 8]; // STIFFNESS
  if (!Number.isFinite(stiffness) || stiffness < 0.01) return null;
  // Spring force: F = -k * (dist - restLength)
  const restLength = 3.0;
  const displacement = dist - restLength;
  const forceMag = stiffness * displacement * 0.05 * synergy;
  const invDist = 1.0 / dist;
  const fx = dx * invDist * forceMag;
  const fy = dy * invDist * forceMag;
  const fz = dz * invDist * forceMag;
  if (!Number.isFinite(fx)) return null;
  // Register bond bilaterally (both particles track each other)
  const jIdx = jBase / stride;
  const iIdx = iBase / stride;
  // Check if already bonded
  for (let slot = S.BOND_PARTNER_1; slot <= S.BOND_PARTNER_2; slot++) {
    if (view[iBase + slot] === jIdx || view[jBase + slot] === iIdx) {
      // Already bonded — return spring force only
      return { ax: fx, ay: fy, az: fz };
    }
  }
  // Find empty slot on i
  for (let slot = S.BOND_PARTNER_1; slot <= S.BOND_PARTNER_2; slot++) {
    if (view[iBase + slot] < 0) {
      view[iBase + slot] = jIdx;
      view[iBase + S.BOND_COUNT] += 1;
      break;
    }
  }
  // Find empty slot on j
  for (let slot = S.BOND_PARTNER_1; slot <= S.BOND_PARTNER_2; slot++) {
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
  if (!isSet(lawState, 41)) return;
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
  if (!isSet(lawState, 42)) return;
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
  if (!isSet(lawState, 43)) return;
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
  if (!isSet(lawState, 44)) return;
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
  if (!isSet(lawState, 45)) return;
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
  if (!isSet(lawState, 46)) return;
  const energy = view[base + S.ENERGY];
  if (!Number.isFinite(energy)) return;
  const amp = 1.0 + 0.1 * synergy;
  view[base + S.ENERGY] *= amp;
}

// ============================================================================
// 40. TELEPATHY — Instant signal sharing within species
// ============================================================================
export function applyTelepathy(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, 47)) return null;
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
  if (!isSet(lawState, 48)) return null;
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
  if (!isSet(lawState, 49)) return null;
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
  if (!isSet(lawState, 50)) return;
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
export function applyGlowEffect(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, 8)) return;
  const signal = view[base + S.SIGNAL];
  if (!Number.isFinite(signal) || signal < 0.01) return;
  const energy = view[base + S.ENERGY];
  if (Number.isFinite(energy)) {
    view[base + S.ENERGY] += signal * 0.01 * dt * synergy;
  }
}

// ============================================================================
// 45. ENERGY — Thermal energy conduction between adjacent particles
// ============================================================================
export function applyEnergyTransfer(lawState, view, iBase, jBase, distSq, synergy) {
  if (!isSet(lawState, 13)) return null;
  if (distSq > 40000) return null;
  const energyI = view[iBase + S.ENERGY];
  const energyJ = view[jBase + S.ENERGY];
  if (!Number.isFinite(energyI) || !Number.isFinite(energyJ)) return null;
  const diff = energyJ - energyI;
  if (Math.abs(diff) < 0.1) return null;
  const rate = 0.005 * synergy;
  const transfer = diff * rate;
  view[iBase + S.ENERGY] += transfer;
  view[jBase + S.ENERGY] -= transfer;
  return null;
}

// ============================================================================
// 46. RADIATION — Ambient radiation damages low-armor particles
// ============================================================================
export function applyRadiationDamage(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, 14)) return;
  const armor = view[base + S.ARMOR];
  const energy = view[base + S.ENERGY];
  if (!Number.isFinite(armor) || !Number.isFinite(energy)) return;
  const damage = (1 - armor) * 0.02 * dt * synergy;
  if (damage > 0.001) {
    view[base + S.ENERGY] -= damage;
  }
}

// ============================================================================
// 47. TRACK — Predation tracking
// ============================================================================
export function applyTrackingBehavior(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
  if (!isSet(lawState, 11)) return null;
  if (dist < 1) return null;
  const massI = view[iBase + S.MASS];
  const massJ = view[jBase + S.MASS];
  if (!Number.isFinite(massI) || !Number.isFinite(massJ)) return null;
  const predationBias = view[iBase + S.DNA_CACHE_START + 36];
  if (!Number.isFinite(predationBias) || predationBias < 0.1) return null;
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
export function applyGenotypeMutation(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, 15)) return;
  const mutationRate = view[base + S.DNA_CACHE_START + 12];
  const temperature = view[base + S.TEMPERATURE];
  if (!Number.isFinite(mutationRate) || !Number.isFinite(temperature)) return;
  if (mutationRate < 0.01) return;
  const mutProb = mutationRate * (1.0 + temperature) * dt * 0.01 * synergy;
  if (mutProb < 0.001) return;
  const numMutations = Math.floor(mutProb * 3) + 1;
  const dnaStart = S.DNA_CACHE_START;
  for (let m = 0; m < numMutations; m++) {
    const hashVal = Math.sin(base * 127.1 + m * 311.7 + performance.now() * 0.001) * 43758.5453;
    const dnaIdx = Math.abs(Math.floor(hashVal)) % 42;
    const perturbHash = Math.sin(base * 269.5 + dnaIdx * 183.3) * 43758.5453;
    const perturb = ((perturbHash - Math.floor(perturbHash)) * 2.0 - 1.0) * mutationRate * 0.05;
    const newVal = view[base + dnaStart + dnaIdx] + perturb;
    if (Number.isFinite(newVal)) {
      view[base + dnaStart + dnaIdx] = newVal;
    }
  }
}

// ============================================================================
// 49. PHENOTYPE — Express DNA as visual trait modulation
// ============================================================================
export function applyPhenotype(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, 16)) return;
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
  if (!isSet(lawState, 18)) return 1.0;
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
  if (!isSet(lawState, 19)) return;
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
  if (!isSet(lawState, 20)) return;
  const charge = Math.abs(view[base + S.CHARGE]);
  if (!Number.isFinite(charge) || charge < 0.3) return;
  const mass = view[base + S.MASS];
  if (Number.isFinite(mass) && mass > 0.1) {
    view[base + S.MASS] -= charge * 0.001 * dt * synergy;
  }
}

// ============================================================================
// 53. ISOMERIZATION — Structural rearrangement changes properties
// ============================================================================
export function applyIsomerization(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, 22)) return;
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
  if (!isSet(lawState, 23)) return null;
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
  if (!isSet(lawState, 24)) return null;
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
  if (!isSet(lawState, 28)) return;
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
  if (!isSet(lawState, 29)) return;
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
