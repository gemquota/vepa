// ============================================================================
// VEPA v4 — Physics Law Group
// TIDE / FRICTION / ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION
// Stateless per-particle and pairwise law functions over the flat particle
// buffer. Force laws return {ax, ay, az} for the solver to integrate; state
// mutations are written directly to the buffer. Never write NaN/Infinity.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D } from '../../constants.js';

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
 * FRICTION — velocity-dependent drag: force = -v * k.
 */
export function applyFriction(view, iBase, k) {
  const vx = nanGuard(view[iBase + S.VEL_X]);
  const vy = nanGuard(view[iBase + S.VEL_Y]);
  const vz = nanGuard(view[iBase + S.VEL_Z]);
  return {
    ax: clamp(-vx * k, -50, 50),
    ay: clamp(-vy * k, -50, 50),
    az: clamp(-vz * k, -50, 50),
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
  const mag = (overlap * k) / (mI + mJ);
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
