// ============================================================================
// VEPA v4 — Quantum Law Group
// 16 stateless quantum laws (SUPERPOSITION .. ANTIMATTER). Per-particle laws
// return a force object {ax, ay, az} or null and may mutate state directly;
// pairwise laws act on the i-j pair. All buffer writes are NaN-guarded.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D } from '../../constants.js';
import { buffer_global } from '../lawsState.js';

const FORCE_LIMIT = 50;
const ENERGY_MAX = 200;
const SIGNAL_MAX = 10;
const BOUND_MAX = 1e4;

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function nanGuard(v) {
  return Number.isFinite(v) ? v : 0;
}

export function applySuperposition(view, iBase, k, prng) {
  const amp = k * 2;
  return {
    ax: clamp(nanGuard((prng() - 0.5) * amp), -FORCE_LIMIT, FORCE_LIMIT),
    ay: clamp(nanGuard((prng() - 0.5) * amp), -FORCE_LIMIT, FORCE_LIMIT),
    az: clamp(nanGuard((prng() - 0.5) * amp), -FORCE_LIMIT, FORCE_LIMIT),
  };
}

export function applyTunneling(view, iBase, k, prng) {
  if (prng() < 0.005 * k) {
    const hop = nanGuard(view[iBase + S.RADIUS]) * 6;
    view[iBase + S.POS_X] = clamp(nanGuard(view[iBase + S.POS_X]) + (prng() < 0.5 ? -hop : hop), 0, BOUND_MAX);
    view[iBase + S.POS_Y] = clamp(nanGuard(view[iBase + S.POS_Y]) + (prng() < 0.5 ? -hop : hop), 0, BOUND_MAX);
    view[iBase + S.POS_Z] = clamp(nanGuard(view[iBase + S.POS_Z]) + (prng() < 0.5 ? -hop : hop), 0, BOUND_MAX);
  }
  return null;
}

export function applyDecoherence(view, iBase, k) {
  const vx = nanGuard(view[iBase + S.VEL_X]);
  const vy = nanGuard(view[iBase + S.VEL_Y]);
  const vz = nanGuard(view[iBase + S.VEL_Z]);
  view[iBase + S.SIGNAL] = clamp(nanGuard(view[iBase + S.SIGNAL]) + 0.001 * k, 0, SIGNAL_MAX);
  return {
    ax: clamp(-vx * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
    ay: clamp(-vy * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
    az: clamp(-vz * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
  };
}

export function applyWaveParticle(view, iBase, k) {
  const vx = nanGuard(view[iBase + S.VEL_X]);
  const vy = nanGuard(view[iBase + S.VEL_Y]);
  const vz = nanGuard(view[iBase + S.VEL_Z]);
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  if (speed < 0.5) {
    return {
      ax: clamp(-vx * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
      ay: clamp(-vy * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
      az: clamp(-vz * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
    };
  }
  if (speed >= 2) {
    return {
      ax: clamp(vx * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
      ay: clamp(vy * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
      az: clamp(vz * 0.01 * k, -FORCE_LIMIT, FORCE_LIMIT),
    };
  }
  return null;
}

export function applyUncertainty(view, iBase, k, prng) {
  view[iBase + S.POS_X] = clamp(nanGuard(view[iBase + S.POS_X]) + (prng() - 0.5) * 0.02 * k, 0, BOUND_MAX);
  view[iBase + S.POS_Y] = clamp(nanGuard(view[iBase + S.POS_Y]) + (prng() - 0.5) * 0.02 * k, 0, BOUND_MAX);
  view[iBase + S.POS_Z] = clamp(nanGuard(view[iBase + S.POS_Z]) + (prng() - 0.5) * 0.02 * k, 0, BOUND_MAX);
  return {
    ax: clamp((prng() - 0.5) * 0.05 * k, -FORCE_LIMIT, FORCE_LIMIT),
    ay: clamp((prng() - 0.5) * 0.05 * k, -FORCE_LIMIT, FORCE_LIMIT),
    az: clamp((prng() - 0.5) * 0.05 * k, -FORCE_LIMIT, FORCE_LIMIT),
  };
}

export function applyTeleport(view, iBase, worldSize, k, prng) {
  const energy = nanGuard(view[iBase + S.ENERGY]);
  if (energy > 20 && prng() < 0.002 * k) {
    const ox = nanGuard(view[iBase + S.POS_X]);
    const oy = nanGuard(view[iBase + S.POS_Y]);
    const oz = nanGuard(view[iBase + S.POS_Z]);
    const nx = prng() * worldSize;
    const ny = prng() * worldSize;
    const nz = prng() * worldSize;
    view[iBase + S.POS_X] = nx;
    view[iBase + S.POS_Y] = ny;
    view[iBase + S.POS_Z] = nz;
    const dist = Math.sqrt((nx - ox) * (nx - ox) + (ny - oy) * (ny - oy) + (nz - oz) * (nz - oz));
    view[iBase + S.ENERGY] = clamp(nanGuard(view[iBase + S.ENERGY]) - 0.1 * dist, 0, ENERGY_MAX);
  }
  return null;
}

export function applyObserver(view, iBase, jBase, k) {
  const memI = nanGuard(view[iBase + S.MEMORY]);
  if (memI > 0.5) {
    const vIx = nanGuard(view[iBase + S.VEL_X]);
    const vIy = nanGuard(view[iBase + S.VEL_Y]);
    const vIz = nanGuard(view[iBase + S.VEL_Z]);
    const vJx = nanGuard(view[jBase + S.VEL_X]);
    const vJy = nanGuard(view[jBase + S.VEL_Y]);
    const vJz = nanGuard(view[jBase + S.VEL_Z]);
    view[jBase + S.VEL_X] = vJx + (vIx - vJx) * 0.01 * k;
    view[jBase + S.VEL_Y] = vJy + (vIy - vJy) * 0.01 * k;
    view[jBase + S.VEL_Z] = vJz + (vIz - vJz) * 0.01 * k;
    view[jBase + S.MEMORY] = Math.max(nanGuard(view[jBase + S.MEMORY]), memI * 0.1);
  }
  return null;
}

export function applyPlanck(view, iBase, k) {
  const q = Math.max(0.02, 0.1 * k);
  const vx = nanGuard(view[iBase + S.VEL_X]);
  const vy = nanGuard(view[iBase + S.VEL_Y]);
  const vz = nanGuard(view[iBase + S.VEL_Z]);
  view[iBase + S.VEL_X] = Math.sign(vx) * Math.round(Math.abs(vx) / q) * q;
  view[iBase + S.VEL_Y] = Math.sign(vy) * Math.round(Math.abs(vy) / q) * q;
  view[iBase + S.VEL_Z] = Math.sign(vz) * Math.round(Math.abs(vz) / q) * q;
  return null;
}

export function applyCoherence(view, iBase, jBase, k) {
  const vIx = nanGuard(view[iBase + S.VEL_X]);
  const vIy = nanGuard(view[iBase + S.VEL_Y]);
  const vIz = nanGuard(view[iBase + S.VEL_Z]);
  const vJx = nanGuard(view[jBase + S.VEL_X]);
  const vJy = nanGuard(view[jBase + S.VEL_Y]);
  const vJz = nanGuard(view[jBase + S.VEL_Z]);
  const ddx = vIx - vJx;
  const ddy = vIy - vJy;
  const ddz = vIz - vJz;
  const diff = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
  if (diff < 1) {
    return {
      ax: clamp((vJx - vIx) * 0.02 * k, -FORCE_LIMIT, FORCE_LIMIT),
      ay: clamp((vJy - vIy) * 0.02 * k, -FORCE_LIMIT, FORCE_LIMIT),
      az: clamp((vJz - vIz) * 0.02 * k, -FORCE_LIMIT, FORCE_LIMIT),
    };
  }
  return null;
}

export function applyBosonic(view, iBase, jBase, dx, dy, dz, dist, k) {
  if (dist < 3) {
    const scale = (3 - dist) * k;
    const invDist = 1 / dist;
    return {
      ax: clamp(dx * invDist * scale, -FORCE_LIMIT, FORCE_LIMIT),
      ay: clamp(dy * invDist * scale, -FORCE_LIMIT, FORCE_LIMIT),
      az: clamp(dz * invDist * scale, -FORCE_LIMIT, FORCE_LIMIT),
    };
  }
  return null;
}

export function applyFermionic(view, iBase, jBase, dx, dy, dz, dist, k) {
  const rSum = nanGuard(view[iBase + S.RADIUS]) + nanGuard(view[jBase + S.RADIUS]);
  if (dist < rSum) {
    const scale = (1 - dist / rSum) * k * 5;
    const invDist = 1 / dist;
    return {
      ax: clamp(-dx * invDist * scale, -FORCE_LIMIT, FORCE_LIMIT),
      ay: clamp(-dy * invDist * scale, -FORCE_LIMIT, FORCE_LIMIT),
      az: clamp(-dz * invDist * scale, -FORCE_LIMIT, FORCE_LIMIT),
    };
  }
  return null;
}

export function applySpin(view, iBase, k, prng) {
  const vx = nanGuard(view[iBase + S.VEL_X]);
  const vy = nanGuard(view[iBase + S.VEL_Y]);
  const vz = nanGuard(view[iBase + S.VEL_Z]);
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  const sign = Math.floor(iBase / PARTICLE_STRIDE) % 2 === 0 ? 1 : -1;
  const amp = 0.1 * k * sign;
  if (speed > 0.1) {
    return {
      ax: clamp((-vy / speed) * amp, -FORCE_LIMIT, FORCE_LIMIT),
      ay: clamp((vx / speed) * amp, -FORCE_LIMIT, FORCE_LIMIT),
      az: 0,
    };
  }
  return {
    ax: clamp((prng() - 0.5) * 2 * amp, -FORCE_LIMIT, FORCE_LIMIT),
    ay: clamp((prng() - 0.5) * 2 * amp, -FORCE_LIMIT, FORCE_LIMIT),
    az: clamp((prng() - 0.5) * 2 * amp, -FORCE_LIMIT, FORCE_LIMIT),
  };
}

export function applySpectral(view, iBase, k) {
  const species = nanGuard(view[iBase + S.SPECIES_ID]);
  view[iBase + S.SIGNAL] = clamp(nanGuard(view[iBase + S.SIGNAL]) + (0.001 + 0.001 * (species % 5)) * k, 0, SIGNAL_MAX);
  return null;
}

export function applyWavefunction(view, iBase, k) {
  const q = Math.max(0.25, 0.5 * k);
  const px = nanGuard(view[iBase + S.POS_X]);
  const py = nanGuard(view[iBase + S.POS_Y]);
  const pz = nanGuard(view[iBase + S.POS_Z]);
  view[iBase + S.POS_X] = Math.round(px / q) * q;
  view[iBase + S.POS_Y] = Math.round(py / q) * q;
  view[iBase + S.POS_Z] = Math.round(pz / q) * q;
  return null;
}

export function applyHyperplane(view, iBase, k) {
  return {
    ax: clamp(0.001 * k, -FORCE_LIMIT, FORCE_LIMIT),
    ay: clamp(0.0005 * k, -FORCE_LIMIT, FORCE_LIMIT),
    az: clamp(0.0002 * k, -FORCE_LIMIT, FORCE_LIMIT),
  };
}

export function applyAntimatter(view, iBase, jBase, k) {
  const chargeI = nanGuard(view[iBase + S.CHARGE]);
  const chargeJ = nanGuard(view[jBase + S.CHARGE]);
  if ((chargeI > 0.1 && chargeJ < -0.1) || (chargeJ > 0.1 && chargeI < -0.1)) {
    view[iBase + S.DEAD] = 1;
    view[jBase + S.DEAD] = 1;
    view[iBase + S.SIGNAL] = Math.min(SIGNAL_MAX, nanGuard(view[iBase + S.SIGNAL]) + 10 * k);
    view[jBase + S.SIGNAL] = Math.min(SIGNAL_MAX, nanGuard(view[jBase + S.SIGNAL]) + 10 * k);
  }
  return null;
}

// ============================================================================
// Legacy quantum laws — migrated from laws.js (P0: laws.js → lawgroups)
// ============================================================================

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
