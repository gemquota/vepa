// ============================================================================
// VEPA v4 — Chemistry Laws (lawgroups)
// Stateless pairwise/per-particle law functions for the chemistry category.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D, LAW_INDEXES } from '../../constants.js';
import { isSet } from '../../state/lawState.js';
import { buffer_global, readDNA, BOND_SLOTS } from '../lawsState.js';

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

function nanGuard(v) {
  return Number.isFinite(v) ? v : 0;
}

export function applyElectrolysis(view, iBase, jBase, k) {
  const chargeI = view[iBase + S.CHARGE];
  const chargeJ = view[jBase + S.CHARGE];
  if (Math.abs(chargeI - chargeJ) <= 0.5) return null;
  const dm = Math.min(0.01 * view[iBase + S.MASS], 0.5) * k;
  view[iBase + S.MASS] = Math.max(0.001, nanGuard(view[iBase + S.MASS] - dm));
  view[iBase + S.ENERGY] = clamp(nanGuard(view[iBase + S.ENERGY] + dm * 20), 0, 200);
  view[iBase + S.SIGNAL] = Math.max(0, nanGuard(view[iBase + S.SIGNAL] + dm * 5));
  return null;
}

export function applyPhotolysis(view, iBase, k) {
  if (view[iBase + S.SIGNAL] <= 0.5) return null;
  const dm = Math.min(0.01 * view[iBase + S.MASS], 0.5) * k;
  view[iBase + S.MASS] = Math.max(0.001, nanGuard(view[iBase + S.MASS] - dm));
  view[iBase + S.ENERGY] = clamp(nanGuard(view[iBase + S.ENERGY] + dm * 15), 0, 200);
  view[iBase + S.SIGNAL] = nanGuard(view[iBase + S.SIGNAL] * 0.9);
  return null;
}

export function applyPrecipitation(view, iBase, jBase, k) {
  if (view[iBase + S.ENERGY] <= 80 || view[jBase + S.ENERGY] <= 80) return null;
  view[iBase + S.MASS] = nanGuard(view[iBase + S.MASS] + 0.005 * k);
  view[iBase + S.RADIUS] = Math.max(0.1, nanGuard(view[iBase + S.RADIUS] * 0.998));
  view[iBase + S.ENERGY] = clamp(nanGuard(view[iBase + S.ENERGY] - 0.1 * k), 0, 200);
  return null;
}

export function applyNeutralization(view, iBase, jBase, k) {
  const cI = view[iBase + S.CHARGE];
  const cJ = view[jBase + S.CHARGE];
  if (Math.abs(cI) <= 0.1 || Math.abs(cJ) <= 0.1 || Math.sign(cI) === Math.sign(cJ)) return null;
  const step = 0.05 * k;
  view[iBase + S.CHARGE] = nanGuard(cI - Math.sign(cI) * Math.min(step, Math.abs(cI)));
  view[jBase + S.CHARGE] = nanGuard(cJ - Math.sign(cJ) * Math.min(step, Math.abs(cJ)));
  view[iBase + S.TEMPERATURE] = nanGuard(view[iBase + S.TEMPERATURE] + 0.02 * k);
  view[jBase + S.TEMPERATURE] = nanGuard(view[jBase + S.TEMPERATURE] + 0.02 * k);
  return null;
}

export function applyStoichiometry(view, iBase, jBase, k) {
  const massI = view[iBase + S.MASS];
  const massJ = view[jBase + S.MASS];
  const d = (massI - massJ) * 0.005 * k;
  view[iBase + S.MASS] = Math.max(0.001, nanGuard(massI - d));
  view[jBase + S.MASS] = Math.max(0.001, nanGuard(massJ + d));
  return null;
}

export function applyAutocatalysis(view, iBase, jBase, k) {
  if (view[iBase + S.SPECIES_ID] !== view[jBase + S.SPECIES_ID]) return null;
  // REACTION_THRESHOLD DNA (37): mass limit for the phase change — the
  // catalytic reaction only fires once both bodies clear the threshold mass.
  const thrI = nanGuard(view[iBase + S.DNA_CACHE_START + D.REACTION_THRESHOLD]);
  const thrJ = nanGuard(view[jBase + S.DNA_CACHE_START + D.REACTION_THRESHOLD]);
  const threshold = Math.max(0, Math.min(1000, thrI || 0));
  if (view[iBase + S.MASS] < threshold || view[jBase + S.MASS] < (thrJ || threshold)) return null;
  const catI = clamp(nanGuard(view[iBase + S.DNA_CACHE_START + D.CATALYSIS]), 0.1, 2);
  const catJ = clamp(nanGuard(view[jBase + S.DNA_CACHE_START + D.CATALYSIS]), 0.1, 2);
  view[iBase + S.ENERGY] = clamp(nanGuard(view[iBase + S.ENERGY] + 0.1 * k * catI), 0, 200);
  view[jBase + S.ENERGY] = clamp(nanGuard(view[jBase + S.ENERGY] + 0.1 * k * catJ), 0, 200);
  return null;
}

// ============================================================================
// Legacy chemistry laws — migrated from laws.js (P0: laws.js → lawgroups)
// ============================================================================

// ============================================================================
// 7. SOLVATION
// ============================================================================
export function applySolvation(p1Ptr, p2Ptr, stride, dx, dy, dz, dist, synergy) {
  const buf = buffer_global;
  const charge1 = buf[p1Ptr + S.CHARGE];
  const charge2 = buf[p2Ptr + S.CHARGE];
  if (charge1 === 0 || charge2 === 0) return { ax: 0, ay: 0, az: 0 };

  const strength = 0.05 * Math.abs(charge1 * charge2) * (synergy || 1);
  const invDist = 1.0 / Math.max(dist, 0.01);
  // Real-world solvation (batch-05 confirmation): the solvent pulls
  // opposite-charge ions together and pushes like charges apart — the same
  // Coulomb rule that dissolves salt crystals and keeps ions dispersed.
  const sign = charge1 * charge2 < 0 ? 1 : -1;
  return {
    ax: nanGuard(dx * invDist * strength * sign),
    ay: nanGuard(dy * invDist * strength * sign),
    az: nanGuard(dz * invDist * strength * sign),
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
export function applyPolymer(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy, stride) {
  if (!isSet(lawState, LAW_INDEXES.POLYMER)) return { ax: 0, ay: 0, az: 0 };
  if (dist > 25) return { ax: 0, ay: 0, az: 0 };

  // Batch-06 confirmation ("match documentation"): up to 6 bonds per particle
  // (BOND_PARTNER_1..6), tracked mutually — when i chains to j, j chains back
  // to i, so A-B-C topology is stable on both ends.
  const iIdx = Math.round(iBase / stride);
  const jIdx = Math.round(jBase / stride);
  const bondCount = view[iBase + S.BOND_COUNT];
  const jBondCount = view[jBase + S.BOND_COUNT];

  let alreadyBonded = false;
  for (const slot of BOND_SLOTS) {
    if (view[iBase + slot] === jIdx || view[jBase + slot] === iIdx) {
      alreadyBonded = true;
      break;
    }
  }
  // Batch-10: chain bias — polymers prefer extending chains: free/tip
  // particles (0-1 bonds) bond eagerly, well-connected particles (3+) are
  // avoided, so POLYMER grows linear chains instead of cross-linked webs.
  const chainBias = jBondCount <= 1 ? 1.0 : (jBondCount >= 3 ? 0.25 : 0.5);
  if (!alreadyBonded && bondCount < 6 && jBondCount < 6 && dist < 10 * synergy * chainBias) {
    for (const slot of BOND_SLOTS) {
      if (view[iBase + slot] < 0) {
        view[iBase + slot] = jIdx;
        view[iBase + S.BOND_COUNT] = bondCount + 1;
        break;
      }
    }
    for (const slot of BOND_SLOTS) {
      if (view[jBase + slot] < 0) {
        view[jBase + slot] = iIdx;
        view[jBase + S.BOND_COUNT] = jBondCount + 1;
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
// 33. REDUCTION — Charge neutralization
// ============================================================================
export function applyReduction(b1Ptr, b2Ptr, stride, synergy) {
  const buf = buffer_global;
  const charge1 = buf[b1Ptr + S.CHARGE];
  const charge2 = buf[b2Ptr + S.CHARGE];
  if (!Number.isFinite(charge1) || !Number.isFinite(charge2)) return;
  // Real-life reduction: opposite charges attract and cancel out when they
  // interact; same-sign charges repel, so nothing gets neutralized.
  if (charge1 * charge2 >= 0) return;
  const rate = 0.05 * synergy;
  const d1 = charge1 * rate;
  const d2 = charge2 * rate;
  buf[b1Ptr + S.CHARGE] = Math.abs(charge1) <= Math.abs(d1) ? 0 : charge1 - d1;
  buf[b2Ptr + S.CHARGE] = Math.abs(charge2) <= Math.abs(d2) ? 0 : charge2 - d2;
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
  // Real-life alloying: the two materials dissolve into one homogeneous
  // composite — full mass merge, DNA averaged (hybrid composition), colour
  // blended. The survivor keeps its species slot but behaves as the mix.
  const m1 = view[iBase + S.MASS];
  const m2 = view[jBase + S.MASS];
  const total = m1 + m2;
  const w2 = total > 0 ? m2 / total : 0.5;
  view[iBase + S.MASS] = total;
  view[jBase + S.DEAD] = 1.0;
  for (let d = 0; d < 42; d++) {
    const a = view[iBase + S.DNA_CACHE_START + d];
    const b = view[jBase + S.DNA_CACHE_START + d];
    if (Number.isFinite(a) && Number.isFinite(b)) {
      view[iBase + S.DNA_CACHE_START + d] = a + (b - a) * w2;
    }
  }
  view[iBase + S.COLOR_R] = (view[iBase + S.COLOR_R] + view[jBase + S.COLOR_R]) * 0.5;
  view[iBase + S.COLOR_G] = (view[iBase + S.COLOR_G] + view[jBase + S.COLOR_G]) * 0.5;
  view[iBase + S.COLOR_B] = (view[iBase + S.COLOR_B] + view[jBase + S.COLOR_B]) * 0.5;
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
  const diff = chargeJ - chargeI;
  if (Math.abs(diff) < 0.3) return;
  // Documented behavior (batch-05 confirmation): acid/base exchange equalizes
  // electrical potential. CONDUCTIVITY DNA controls the transfer rate and the
  // CHARGE field is altered — charge flows from the higher-charge particle to
  // the lower until the gap closes. ENERGY is untouched.
  const condI = view[iBase + S.DNA_CACHE_START + 32] || 0;
  const condJ = view[jBase + S.DNA_CACHE_START + 32] || 0;
  const conductivity = Math.max(condI, condJ);
  if (conductivity <= 0) return;
  const transfer = diff * conductivity * 0.1 * dt * synergy;
  view[iBase + S.CHARGE] += transfer;
  view[jBase + S.CHARGE] -= transfer;
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
  // Batch-06 confirmation: real oxidation is electron loss — the charge
  // magnitude drifts toward 0 at the same rate (the particle rusts
  // electrically) instead of only eating mass.
  const c = view[base + S.CHARGE];
  if (Number.isFinite(c) && c !== 0) {
    const decay = c * 0.001 * dt * synergy;
    view[base + S.CHARGE] = Math.abs(c) <= Math.abs(decay) ? 0 : c - decay;
  }

  // HEAT_OUTPUT DNA (39): charged oxidation releases energy + temperature and
  // the particle flashes brighter (glow) as it burns.
  const heatOutput = view[base + S.DNA_CACHE_START + D.HEAT_OUTPUT] || 0;
  if (heatOutput > 0.001) {
    const release = charge * heatOutput * 0.05 * dt * synergy;
    view[base + S.ENERGY] = Math.min(200, (view[base + S.ENERGY] || 0) + release);
    view[base + S.TEMPERATURE] = (view[base + S.TEMPERATURE] || 0) + release * 0.01;
    if (release > 0.0001) {
      const flash = release * 40;
      view[base + S.COLOR_R] = Math.min(255, (view[base + S.COLOR_R] || 0) + flash);
      view[base + S.COLOR_G] = Math.min(255, (view[base + S.COLOR_G] || 0) + flash);
      view[base + S.COLOR_B] = Math.min(255, (view[base + S.COLOR_B] || 0) + flash);
      view[base + S.ALPHA] = Math.min(1, (view[base + S.ALPHA] || 0) + release * 0.1);
    }
  }
}

// ============================================================================
// 53. ISOMERIZATION — Structural rearrangement changes properties
// ============================================================================
export function applyIsomerization(lawState, view, base, dt, synergy, prng, stride) {
  if (!isSet(lawState, LAW_INDEXES.ISOMERIZATION)) return;
  // Batch-06 confirmation ("match real life"): real isomerization keeps the
  // same atoms but rearranges the bonds. A particle with 3+ chain bonds
  // occasionally breaks one connection — the freed partner becomes a fragment
  // (its reciprocal bond is cleared too) — and the rearrangement consumes a
  // little energy. The old "radius breathing" placeholder is gone.
  const bondCount = view[base + S.BOND_COUNT];
  if (!Number.isFinite(bondCount) || bondCount < 3) return;
  const energy = view[base + S.ENERGY];
  if (!Number.isFinite(energy) || energy < 1) return;
  const chance = 0.02 * dt * synergy;
  if (prng && prng() >= chance) return;

  const iIdx = Math.round(base / stride);
  for (const slot of BOND_SLOTS) {
    const partnerIdx = view[base + slot];
    if (partnerIdx >= 0) {
      const partnerBase = Math.round(partnerIdx) * stride;
      if (Number.isFinite(partnerBase) && partnerBase >= 0 && partnerBase < view.length) {
        for (const pSlot of BOND_SLOTS) {
          if (view[partnerBase + pSlot] === iIdx) {
            view[partnerBase + pSlot] = -1;
            view[partnerBase + S.BOND_COUNT] = Math.max(0, (view[partnerBase + S.BOND_COUNT] || 0) - 1);
            break;
          }
        }
      }
      view[base + slot] = -1;
      view[base + S.BOND_COUNT] = Math.max(0, bondCount - 1);
      break;
    }
  }
  // Isomerization consumes energy (documented).
  view[base + S.ENERGY] = Math.max(0, energy - 0.5 * dt * synergy);
}

// ============================================================================
// 54. CHIRALITY — Handedness affects interaction bias
// ============================================================================
export function applyChirality(lawState, view, iBase, jBase, dx, dy, dz, dist, synergy) {
  if (!isSet(lawState, LAW_INDEXES.CHIRALITY)) return null;
  if (dist < 1) return null;
  // Batch-06 confirmation (documented): handedness comes from TORQUE DNA
  // (rotational momentum), not POLARITY — real chirality is geometric
  // mirror-handedness (clockwise vs counter-clockwise spin), not charge.
  const torqueI = view[iBase + S.DNA_CACHE_START + D.TORQUE];
  const torqueJ = view[jBase + S.DNA_CACHE_START + D.TORQUE];
  if (!Number.isFinite(torqueI) || !Number.isFinite(torqueJ)) return null;
  if (torqueI === 0 || torqueJ === 0) return null;
  // Same-handedness pairs deflect perpendicular to their separation; the
  // deflection direction follows the handedness sign (left vs right mirror
  // image rotate opposite ways). Opposite-handedness pairs: no force.
  if ((torqueI > 0 && torqueJ > 0) || (torqueI < 0 && torqueJ < 0)) {
    const strength = 0.01 * synergy;
    const invDist = 1.0 / dist;
    const dir = torqueI > 0 ? 1 : -1;
    return {
      ax: -dy * invDist * strength * dir,
      ay: dx * invDist * strength * dir,
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
  // Batch-07 repair: range widened 30 -> 150 so lattices actually form at
  // default spawn spacing (~100-300 units), pull strengthened 0.01 -> 0.05.
  if (dist < 1 || dist > 150) return null;
  const gridSize = 8.0;
  const targetX = Math.round(dx / gridSize) * gridSize;
  const targetY = Math.round(dy / gridSize) * gridSize;
  const targetZ = Math.round(dz / gridSize) * gridSize;
  // Same-species pairs crystallize 3x stronger (batch-07 confirmation)
  const sameSpecies = view[iBase + S.SPECIES_ID] === view[jBase + S.SPECIES_ID];
  const pullScale = sameSpecies ? 3.0 : 1.0;
  const pullX = (targetX - dx) * 0.05 * synergy * pullScale;
  const pullY = (targetY - dy) * 0.05 * synergy * pullScale;
  const pullZ = (targetZ - dz) * 0.05 * synergy * pullScale;
  return {
    ax: pullX,
    ay: pullY,
    az: pullZ,
  };
}
