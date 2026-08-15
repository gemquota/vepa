// ============================================================================
// VEPA v4 — Physics Law Group
// TIDE / FRICTION / ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION
// Stateless per-particle and pairwise law functions over the flat particle
// buffer. Force laws return {ax, ay, az} for the solver to integrate; state
// mutations are written directly to the buffer. Never write NaN/Infinity.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D, LAW_INDEXES } from '../../constants.js';
import { isSet } from '../../state/lawState.js';
import { buffer_global, readDNA, BOND_SLOTS } from '../lawsState.js';

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function nanGuard(v) {
  return Number.isFinite(v) ? v : 0;
}

/**
 * TIDE — long-range tidal pull on i toward j, ∝ massJ * k / dist.
 * Not inverse-square: reaches much farther than gravity.
 */
export function applyTide(view, iBase, jBase, dx, dy, dz, dist, k) {
  const massJ = nanGuard(view[jBase + S.MASS]);
  const mag = (massJ * k) / dist;
  const invDist = 1 / dist;
  return {
    ax: clamp(nanGuard(dx * invDist * mag), -50, 50),
    ay: clamp(nanGuard(dy * invDist * mag), -50, 50),
    az: clamp(nanGuard(dz * invDist * mag), -50, 50),
  };
}

/**
 * FRICTION — velocity-dependent drag: force = -v * k, scaled by VISCOSITY DNA
 * (batch-20, match irl). The removed kinetic energy is converted to heat:
 * real friction dissipates motion as temperature. Higher viscosity = more
 * damping (and more heating).
 */
export function applyFriction(view, iBase, k) {
  const vx = nanGuard(view[iBase + S.VEL_X]);
  const vy = nanGuard(view[iBase + S.VEL_Y]);
  const vz = nanGuard(view[iBase + S.VEL_Z]);
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  const visRaw = view[iBase + S.DNA_CACHE_START + D.VISCOSITY];
  const viscosity = Number.isFinite(visRaw) ? visRaw : 0.98;
  const damp = k * viscosity;
  if (speed > 1e-6) {
    view[iBase + S.TEMPERATURE] = Math.min(1, (view[iBase + S.TEMPERATURE] || 0) + speed * damp * 0.5);
  }
  return {
    ax: clamp(-vx * damp, -50, 50),
    ay: clamp(-vy * damp, -50, 50),
    az: clamp(-vz * damp, -50, 50),
  };
}

/**
 * ELASTICITY — soft restitution on contact. When dist < rI + rJ, push i away
 * from j along the normal; magnitude ∝ overlap * k / (combined mass) so light
 * particles bounce harder.
 */
export function applyElasticity(view, iBase, jBase, dx, dy, dz, dist, k) {
  const rI = view[iBase + S.RADIUS];
  const rJ = view[jBase + S.RADIUS];
  const overlap = rI + rJ - dist;
  if (overlap <= 0) return null;
  const mI = Math.max(nanGuard(view[iBase + S.MASS]), 0.001);
  const mJ = Math.max(nanGuard(view[jBase + S.MASS]), 0.001);
  // Coefficient of restitution from ELASTICITY DNA (0..1, default 0.5) —
  // real materials bounce less when less elastic (batch-20).
  const restRaw = view[iBase + S.DNA_CACHE_START + D.ELASTICITY];
  const rest = Number.isFinite(restRaw) ? restRaw : 0.5;
  const mag = (overlap * k * rest) / (mI + mJ);
  return {
    ax: clamp(nanGuard((-dx / dist) * mag), -50, 50),
    ay: clamp(nanGuard((-dy / dist) * mag), -50, 50),
    az: clamp(nanGuard((-dz / dist) * mag), -50, 50),
  };
}

/**
 * TURBULENCE — perpendicular pseudo-random kick. Picks a unit vector
 * perpendicular to the current velocity (or a random axis when nearly at
 * rest) and scales it by k.
 */
export function applyTurbulence(view, iBase, k, prng) {
  const vx = view[iBase + S.VEL_X];
  const vy = view[iBase + S.VEL_Y];
  const vz = view[iBase + S.VEL_Z];
  const speed = Math.hypot(vx, vy, vz);
  let nx, ny, nz;
  if (speed < 1e-6) {
    const theta = prng() * Math.PI * 2;
    const z = prng() * 2 - 1;
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    nx = r * Math.cos(theta);
    ny = r * Math.sin(theta);
    nz = z;
  } else {
    let tx = 1, ty = 0, tz = 0;
    if (Math.abs(vx) / speed > 0.9) {
      tx = 0;
      ty = 1;
      tz = 0;
    }
    nx = ty * vz - tz * vy;
    ny = tz * vx - tx * vz;
    nz = tx * vy - ty * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len;
    ny /= len;
    nz /= len;
  }
  return {
    ax: clamp(nanGuard(nx * k), -50, 50),
    ay: clamp(nanGuard(ny * k), -50, 50),
    az: clamp(nanGuard(nz * k), -50, 50),
  };
}

/**
 * CENTRIPETAL — harmonic pull toward (cx, cy, cz), ∝ distance.
 */
export function applyCentripetal(view, iBase, cx, cy, cz, k) {
  const px = view[iBase + S.POS_X];
  const py = view[iBase + S.POS_Y];
  const pz = view[iBase + S.POS_Z];
  return {
    ax: clamp(nanGuard((cx - px) * k), -50, 50),
    ay: clamp(nanGuard((cy - py) * k), -50, 50),
    az: clamp(nanGuard((cz - pz) * k), -50, 50),
  };
}

/**
 * ROTATION — tangential force around the vertical axis through (cx, cy, cz):
 * rotate the (x, y) offset vector by 90° and scale by k.
 */
export function applyRotation(view, iBase, cx, cy, cz, k) {
  const ox = view[iBase + S.POS_X] - cx;
  const oy = view[iBase + S.POS_Y] - cy;
  return {
    ax: clamp(nanGuard(-oy * k), -50, 50),
    ay: clamp(nanGuard(ox * k), -50, 50),
    az: 0,
  };
}

// ============================================================================
// Legacy physics laws — migrated from laws.js (P0: laws.js → lawgroups)
// ============================================================================

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
  // Batch-10 ("yes"): strengthened and dark-energy scaled — the push grows
  // with distance from the centre, opposing gravitational clustering harder
  // at the edges.
  const dist = Math.sqrt(distSq);
  const norm = dist / (worldSize * 0.5);
  const strength = 0.004 * synergy * (0.3 + norm);
  const invDist = 1 / dist;
  return {
    ax: dx * invDist * strength,
    ay: dy * invDist * strength,
    az: dz * invDist * strength,
  };
}

// ============================================================================
// 32. BOND — Spring-like molecular bonding
// ============================================================================
// Clear a bilateral bond between i and j if one exists.
function breakBondPair(view, iBase, jBase, stride) {
  const jIdx = jBase / stride;
  const iIdx = iBase / stride;
  for (const slot of BOND_SLOTS) {
    if (view[iBase + slot] === jIdx) {
      view[iBase + slot] = -1;
      view[iBase + S.BOND_COUNT] = Math.max(0, view[iBase + S.BOND_COUNT] - 1);
      break;
    }
  }
  for (const slot of BOND_SLOTS) {
    if (view[jBase + slot] === iIdx) {
      view[jBase + slot] = -1;
      view[jBase + S.BOND_COUNT] = Math.max(0, view[jBase + S.BOND_COUNT] - 1);
      break;
    }
  }
}

export function applyBond(lawState, view, iBase, jBase, stride, dx, dy, dz, dist, synergy, nCount) {
  if (!isSet(lawState, LAW_INDEXES.BOND)) return null;
  // Batch-10: molecular bonds prefer dense neighbourhoods — places with more
  // neighbours to bond to — instead of chain ends (that is POLYMER's job).
  const densityBoost = Math.min(2.0, 1 + (nCount || 0) * 0.05);
  if (dist < 0.1) return null;
  const stiffness = view[iBase + S.DNA_CACHE_START + 8]; // STIFFNESS
  if (!Number.isFinite(stiffness) || stiffness < 0.01) return null;
  // Edge-to-edge rest length: particles touch at their radii
  const r1 = view[iBase + S.RADIUS];
  const r2 = view[jBase + S.RADIUS];
  if (!Number.isFinite(r1) || !Number.isFinite(r2)) return null;
  const restLength = (r1 + r2) * 1.1; // slight buffer to avoid overlap
  // Molecular bonds are short-range: they form within ~2x the rest length
  // (extended by local density) and break when stretched beyond that, instead
  // of holding forever.
  const bondRange = restLength * 2 * densityBoost;
  if (dist > bondRange) {
    breakBondPair(view, iBase, jBase, stride);
    return null;
  }
  // Spring force: F = -k * (dist - restLength); denser neighbourhoods bond harder
  const displacement = dist - restLength;
  const forceMag = stiffness * displacement * 0.05 * synergy * densityBoost;
  const invDist = 1.0 / Math.max(dist, 0.01);
  const fx = dx * invDist * forceMag;
  const fy = dy * invDist * forceMag;
  const fz = dz * invDist * forceMag;
  if (!Number.isFinite(fx)) return null;
  // Register bond bilaterally across all 6 shared slots (consistent with POLYMER)
  const jIdx = jBase / stride;
  const iIdx = iBase / stride;
  for (const slot of BOND_SLOTS) {
    if (view[iBase + slot] === jIdx || view[jBase + slot] === iIdx) {
      return { ax: fx, ay: fy, az: fz };
    }
  }
  if (view[iBase + S.BOND_COUNT] < 6 && view[jBase + S.BOND_COUNT] < 6) {
    for (const slot of BOND_SLOTS) {
      if (view[iBase + slot] < 0) {
        view[iBase + slot] = jIdx;
        view[iBase + S.BOND_COUNT] += 1;
        break;
      }
    }
    for (const slot of BOND_SLOTS) {
      if (view[jBase + slot] < 0) {
        view[jBase + slot] = iIdx;
        view[jBase + S.BOND_COUNT] += 1;
        break;
      }
    }
  }
  return { ax: fx, ay: fy, az: fz };
}

// ============================================================================
// 13. NEW LAW TYPES — SINGULARITY
// ============================================================================

// SINGULARITY law — collapse threshold (mass units)
const SINGULARITY_MASS = 20;

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
