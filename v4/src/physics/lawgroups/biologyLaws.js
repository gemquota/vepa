// ============================================================================
// VEPA v4 — Biology Laws (lawgroups)
// Stateless pairwise/per-particle law functions for the biology category.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D, DNA_RANGES, DNA_COUNT, LAW_INDEXES } from '../../constants.js';
import { isSet } from '../../state/lawState.js';
import { buffer_global, readDNA, worldParams } from '../lawsState.js';

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

function nanGuard(v) {
  return Number.isFinite(v) ? v : 0;
}

export function applySymbiosis(view, iBase, jBase, k) {
  if (view[iBase + S.SPECIES_ID] === view[jBase + S.SPECIES_ID]) return null;
  const eI = view[iBase + S.ENERGY];
  const eJ = view[jBase + S.ENERGY];
  const d = (eI - eJ) * k * 0.5;
  view[iBase + S.ENERGY] = clamp(nanGuard(eI - d), 0, 200);
  view[jBase + S.ENERGY] = clamp(nanGuard(eJ + d), 0, 200);
  return null;
}

export function applyParasite(view, iBase, jBase, k) {
  const massI = view[iBase + S.MASS];
  const massJ = view[jBase + S.MASS];
  if (massI >= massJ) return null;
  const eJ = view[jBase + S.ENERGY];
  const drain = Math.max(0, Math.min(0.05 * massJ, eJ - 5) * k);
  view[iBase + S.ENERGY] = clamp(nanGuard(view[iBase + S.ENERGY] + drain * 0.9), 0, 200);
  view[jBase + S.ENERGY] = clamp(nanGuard(eJ - drain), 0, 200);
  return null;
}

export function applyHibernation(view, iBase, k) {
  const energy = view[iBase + S.ENERGY];
  if (energy >= 30) return null;
  view[iBase + S.ENERGY] = clamp(nanGuard(energy + 0.05 * k), 0, 30);
  const damp = 0.2 * k;
  return {
    ax: nanGuard(-view[iBase + S.VEL_X] * damp),
    ay: nanGuard(-view[iBase + S.VEL_Y] * damp),
    az: nanGuard(-view[iBase + S.VEL_Z] * damp),
  };
}

export function applyImmunity(view, iBase, k) {
  view[iBase + S.ARMOR] = clamp(nanGuard(view[iBase + S.ARMOR] + 0.02 * k), 0, 5);
  if (view[iBase + S.ARMOR] > 0) {
    view[iBase + S.ENERGY] = clamp(nanGuard(view[iBase + S.ENERGY] + 0.01 * k), 0, 200);
  }
  return null;
}

// ============================================================================
// Legacy biology laws — migrated from laws.js (P0: laws.js → lawgroups)
// ============================================================================

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

/** HSL → RGB (0-1 channels) — used by PHENOTYPE gene expression. */
function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [r + m, g + m, b + m];
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
export function applyPredation(p1Ptr, p2Ptr, stride, dx, dy, dz, dist, prng) {
  const buf = buffer_global;
  // A predator never hunts its own kind (matches TRACK's documented
  // ecosystem behavior — predation is strictly cross-species).
  if (buf[p1Ptr + S.SPECIES_ID] === buf[p2Ptr + S.SPECIES_ID]) {
    return { ax: 0, ay: 0, az: 0 };
  }
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
      const roll = (prng && typeof prng === 'function') ? prng : Math.random;
      for (let t = 0; t < 5; t++) {
        const trait = Math.floor(roll() * 42);
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
// 15. LIFE CYCLE
// ============================================================================
export function applyLifeCycle(lawState, view, base, dnaParams, dt, prng, synergy, dnaBuffer) {
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
    // TELOMERE_LENGTH (60, genome-only) — longer telomeres resist aging death.
    const telomere = dnaBuffer ? readSpeciesDNAParam(dnaBuffer, view[base + S.SPECIES_ID] || 0, 60) : 0.5;
    const deathRate = dnaParams[11] * 0.001 * (1.0 + ageNorm * 0.5) * (1 - telomere * 0.5);
    if (age > 500 && prng() < deathRate * dt) {
      view[base + S.DEAD] = 1.0;
      return;
    }
  }

  // Radiation damage lives in the standalone RADIATION law (applyRadiationDamage)
  // — applying it here as well would double-drain every irradiated organism.
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
  // Genetics & regulatory params (48-63, genome-only).
  const alleleCount = readSpeciesDNAParam(dnaBuffer, speciesId, 48);
  const epigeneticRate = readSpeciesDNAParam(dnaBuffer, speciesId, 49);
  const hgtRate = readSpeciesDNAParam(dnaBuffer, speciesId, 50);
  const repairEfficiency = readSpeciesDNAParam(dnaBuffer, speciesId, 51);
  const transposonRate = readSpeciesDNAParam(dnaBuffer, speciesId, 56);
  const geneSilencing = readSpeciesDNAParam(dnaBuffer, speciesId, 57);
  const recombinationBias = readSpeciesDNAParam(dnaBuffer, speciesId, 58);
  const ploidyLevel = readSpeciesDNAParam(dnaBuffer, speciesId, 61);

  const mutationRate = dnaParams[12] * 0.1; // MUTATION=12
  const offspringDna = new Array(DNA_COUNT);

  // --- Genetics: Crossover ---
  // Check BOND_PARTNER_1 for a potential second parent
  const partnerIdx = view[base + S.BOND_PARTNER_1];
  let hasTwoParents = false;
  const partnerDna = new Array(DNA_COUNT);

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
      // Fill genetics params (42-63) from species DNA buffer
      for (let d = 42; d < DNA_COUNT; d++) {
        partnerDna[d] = readSpeciesDNAParam(dnaBuffer, speciesId, d);
      }
    }
  }

  // --- Build offspring DNA with crossover, dominance, mutation ---
  for (let d = 0; d < DNA_COUNT; d++) {
    let parentA, parentB;

    if (d < 42) {
      // Core traits: use dnaParams (from stride cache)
      parentA = dnaParams[d] || 0;
      parentB = hasTwoParents ? (partnerDna[d] || 0) : parentA;
    } else {
      // Genetics params (42-63): read from species DNA buffer
      parentA = readSpeciesDNAParam(dnaBuffer, speciesId, d);
      parentB = hasTwoParents ? readSpeciesDNAParam(dnaBuffer, speciesId, d) : parentA;
    }

    let val;
    // PLOIDY_LEVEL (default 2) raises recombination; stays neutral at default.
    if (hasTwoParents && prng() < 0.5 + (ploidyLevel - 2) * 0.05) {
      // Sexual reproduction with dominance; ALLELE_COUNT (default 2) widens
      // the blend window; RECOMBINATION_BIAS skews which parent dominates.
      if (prng() < 0.3 + (alleleCount - 2) * 0.05) {
        // Crossover: blend both parents
        val = (parentA + parentB) * 0.5;
      } else if (prng() < Math.max(0, Math.min(1, dominance + recombinationBias * 0.3))) {
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

    // Apply mutation (scaled by repressor, REPAIR_EFFICIENCY, GENE_SILENCING;
    // TRANSPOSON_RATE amplifies the leap — a mobile-element burst).
    const effectiveMutation = mutationRate * (1 - repressor * 0.5)
      * (1 - repairEfficiency * 0.5)
      * (1 - geneSilencing * 0.3)
      * (1 + transposonRate * 4)
      * (worldParams().MUTATION_RATE ?? 1);
    val += (prng() - 0.5) * effectiveMutation * 10;

    // Apply epigenetic drift (non-heritable noise; EPIGENETIC_RATE scales it)
    val += (prng() - 0.5) * epigeneticDrift * 5 * (1 + epigeneticRate * 3);

    // Gene flow: horizontal transfer from other species (GENE_FLOW + HGT_RATE)
    if (prng() < geneFlow * 0.01 + hgtRate * 0.02) {
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
  // Genetics & regulatory params (48-63, genome-only).
  const alleleCount = readSpeciesDNAParam(dnaBuffer, speciesId, 48);
  const epigeneticRate = readSpeciesDNAParam(dnaBuffer, speciesId, 49);
  const hgtRate = readSpeciesDNAParam(dnaBuffer, speciesId, 50);
  const repairEfficiency = readSpeciesDNAParam(dnaBuffer, speciesId, 51);
  const driftRate = readSpeciesDNAParam(dnaBuffer, speciesId, 52);
  const selectionSensitivity = readSpeciesDNAParam(dnaBuffer, speciesId, 53);
  const speciationThreshold = readSpeciesDNAParam(dnaBuffer, speciesId, 54);
  const adaptationRate = readSpeciesDNAParam(dnaBuffer, speciesId, 55);
  const transposonRate = readSpeciesDNAParam(dnaBuffer, speciesId, 56);
  const geneSilencing = readSpeciesDNAParam(dnaBuffer, speciesId, 57);
  const mutagenSensitivity = readSpeciesDNAParam(dnaBuffer, speciesId, 59);
  const ploidyLevel = readSpeciesDNAParam(dnaBuffer, speciesId, 61);
  const codonBias = readSpeciesDNAParam(dnaBuffer, speciesId, 62);
  const regulatoryDepth = readSpeciesDNAParam(dnaBuffer, speciesId, 63);

  // Accumulated radiation dose (RADIATION law) ramps the mutation rate —
  // radiation increases mutation chance more and more over time.
  const exposure = view[base + S.RADIATION_EXPOSURE] || 0;

  let mutProb = mutationRate * (1.0 + temperature) * dt * 0.01 * synergy
    * (1 - repressor * 0.5)            // REPRESSOR dampens genetic drift
    * (1 - repairEfficiency * 0.6)     // REPAIR_EFFICIENCY mends damage
    * (1 / (1 + regulatoryDepth * 0.03)) // REGULATORY_DEPTH stabilizes expression
    * (1 + driftRate * 0.5)            // DRIFT_RATE adds neutral drift
    // MUTAGEN_SENSITIVITY scales how hard radiation dose ramps mutation
    * (1 + exposure * 0.05 * (0.5 + mutagenSensitivity * 1.5));
  if (mutProb < 0.001) return;

  const numMutations = Math.floor(mutProb * 3) + 1;
  const dnaStart = S.DNA_CACHE_START;

  for (let m = 0; m < numMutations; m++) {
    // Somatic drift — per-particle DNA cache (heritable through REPRO).
    const hashVal = Math.sin(base * 127.1 + m * 311.7 + performance.now() * 0.001) * 43758.5453;
    const dnaIdx = Math.abs(Math.floor(hashVal)) % 42;
    const perturbHash = Math.sin(base * 269.5 + dnaIdx * 183.3) * 43758.5453;
    // HETEROZYGOSITY + ALLELE_COUNT + PLOIDY_LEVEL widen variance;
    // GENE_SILENCING damps expression; CODON_BIAS biases the direction.
    const varScale = (1 + heterozygosity * 2
      + (alleleCount - 2) * 0.25
      + (ploidyLevel - 2) * 0.15)
      * (1 - geneSilencing * 0.4);
    const perturb = ((perturbHash - Math.floor(perturbHash)) * 2.0 - 1.0)
      * mutationRate * 0.05 * varScale * (0.5 + codonBias);
    const newVal = view[base + dnaStart + dnaIdx] + perturb;
    if (Number.isFinite(newVal)) {
      view[base + dnaStart + dnaIdx] = newVal;
    }

    // Epigenetic drift — extra non-heritable noise on the cache.
    if ((epigeneticDrift + epigeneticRate) > 0 && prng && prng() < 0.5) {
      const epiIdx = Math.abs(Math.floor(Math.sin(base * 91.7 + m * 173.1) * 43758.5453)) % 42;
      const epiNoise = (prng() - 0.5) * (epigeneticDrift + epigeneticRate * 2) * 2;
      view[base + dnaStart + epiIdx] += epiNoise;
    }

    // Gene flow — horizontal transfer of a foreign gene into the cache.
    if (dnaBuffer && prng && prng() < geneFlow * 0.01 + hgtRate * 0.02) {
      const otherSpecies = (Math.floor(prng() * 63) >= speciesId) ? (Math.floor(prng() * 63) + 1) : Math.floor(prng() * 63);
      const r = DNA_RANGES[dnaIdx] || { min: -1, max: 1 };
      const foreign = readSpeciesDNAParam(dnaBuffer, otherSpecies, dnaIdx);
      view[base + dnaStart + dnaIdx] += (foreign - view[base + dnaStart + dnaIdx]) * 0.1;
    }

    // Transposon jump — TRANSPOSON_RATE: a mobile element leaps to a random
    // locus with a larger, directionally-biased perturbation.
    if (prng && prng() < transposonRate * 0.05) {
      const jumpIdx = Math.abs(Math.floor(Math.sin(base * 137.9 + m * 219.7) * 43758.5453)) % 42;
      view[base + dnaStart + jumpIdx] += (prng() - 0.5) * mutationRate * 0.2 * (0.5 + codonBias);
    }
  }

  // Species-genome evolution — a rare heritable mutation written back to the
  // species DNA buffer, so evolution accumulates at the species level for
  // future spawns and offspring genetics. DNA and genetics are a major part
  // of VEPA, so this is slow but persistent.
  // SELECTION_SENSITIVITY strengthens heritable change; SPECIATION_THRESHOLD
  // (low = easy divergence) gates the write-back; ADAPTATION_RATE scales the leap.
  if (dnaBuffer && prng && prng() < crossoverRate * 0.0002 * dt
      * (0.2 + selectionSensitivity * 0.8)
      * (1 - speciationThreshold * 0.4)) {
    const gIdx = Math.abs(Math.floor(Math.sin(base * 53.7 + performance.now() * 0.0007) * 43758.5453)) % 42;
    const current = readSpeciesDNAParam(dnaBuffer, speciesId, gIdx);
    const gPerturb = (prng() - 0.5) * mutationRate * 0.02 * (0.5 + adaptationRate * 1.5);
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
  // Energy-driven size (batch-05 confirmation): ENERGY is the environment —
  // a well-fed particle (energy > 100) expresses a larger body, a starving
  // one shrinks, exactly like real organisms where nutrition affects size.
  const energyFactor = 1 + (energy / 200 - 0.5) * 0.5 * synergy;
  view[base + S.RADIUS] = radius * energyFactor;

  // Gene expression: the inherited genome (DNA cache) is translated into the
  // visible phenotype — POLARITY → hue, ALPHA → saturation, SYMMETRY →
  // lightness — so offspring inherit their species' look along with its DNA.
  const polarity = view[base + S.DNA_CACHE_START + 4];
  const alpha = view[base + S.DNA_CACHE_START + 5];
  const symmetry = view[base + S.DNA_CACHE_START + 6];
  if (Number.isFinite(polarity) && Number.isFinite(alpha) && Number.isFinite(symmetry)) {
    const hue = (polarity + 1) * 120; // POLARITY -1..1 → 0(red)..240(blue)
    const sat = Math.max(0, Math.min(1, alpha)); // ALPHA 0..1
    const light = Math.max(0.1, Math.min(0.9, 0.5 + symmetry * 0.4)); // SYMMETRY -1..1
    const [r, g, b] = hslToRgb(hue, sat, light);
    view[base + S.COLOR_R] = r * 255;
    view[base + S.COLOR_G] = g * 255;
    view[base + S.COLOR_B] = b * 255;
  }
}
