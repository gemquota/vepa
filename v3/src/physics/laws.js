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

    if (relSpeed < fusionMomentum * 0.1) {
      const gain = m2 * 0.1;
      buf[p1Ptr + S.MASS] += gain;
      buf[p2Ptr + S.MASS] = m2 - gain;
      if (buf[p2Ptr + S.MASS] <= 0) buf[p2Ptr + S.DEAD] = 1.0;
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
export function applyPolymer(lawState, view, iBase, jBase, dist, synergy) {
  if (!isSet(lawState, 21)) return false; // POLYMER=21
  if (dist > 30) return false;

  const bondCount = view[iBase + S.BOND_COUNT];
  if (bondCount >= 6) return false;

  if (dist < 15 * synergy) {
    const partnerSlot = S.BOND_PARTNER_1 + Math.floor(bondCount);
    if (partnerSlot <= S.BOND_PARTNER_2) {
      view[iBase + partnerSlot] = jBase / 100;
      view[iBase + S.BOND_COUNT] = bondCount + 1;
      return true;
    }
  }
  return false;
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
    view[jBase + S.TEMPERATURE] -= diff * rate;
    view[iBase + S.TEMPERATURE] += diff * rate;
  }
}

// ============================================================================
// 22. CONVECTION
// ============================================================================
export function applyConvection(lawState, view, base, dt, synergy) {
  if (!isSet(lawState, 27)) return; // CONVECTION=27

  const temp = view[base + S.TEMPERATURE];
  const buoyancy = (temp - 0.5) * 0.001 * dt * synergy;
  view[base + S.VEL_Y] += buoyancy;
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
  view[base + S.VEL_X] += (vx / speed) * boost;
  view[base + S.VEL_Y] += (vy / speed) * boost;
  view[base + S.VEL_Z] += (vz / speed) * boost;
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
  view[iBase + S.SOUL] += soulJ * 0.001 * synergy;
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
