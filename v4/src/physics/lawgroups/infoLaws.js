// ============================================================================
// VEPA v4 — Information Law Group (INFO)
// Pairwise and per-particle law functions: Navigation, Encryption.
// Each function returns a force object {ax, ay, az} or null. State mutations
// are NaN-guarded and clamped before being written back to the buffer.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D } from '../../constants.js';

function clamp(v, lo, hi) {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

function nanGuard(v) {
  return Number.isFinite(v) ? v : 0;
}

/**
 * Navigation — memory gradient steering.
 * If the neighbor's stored MEMORY exceeds this particle's, produce a force
 * toward the neighbor proportional to the memory difference, normalized by
 * distance.
 */
export function applyNavigation(view, iBase, jBase, dx, dy, dz, dist, k) {
  const memI = view[iBase + S.MEMORY];
  const memJ = view[jBase + S.MEMORY];
  if (!(memJ > memI)) return null;
  const strength = (memJ - memI) * k;
  const invDist = 1 / dist;
  return {
    ax: nanGuard(dx * invDist * strength),
    ay: nanGuard(dy * invDist * strength),
    az: nanGuard(dz * invDist * strength),
  };
}

/**
 * Encryption — robust, slowly-decaying signal coding.
 * Active signals decay much more slowly than baseline, are floored at 0.05 so
 * traces persist, and lose a little amplitude per tick on strong pulses.
 */
export function applyEncryption(view, iBase, k) {
  const signal = view[iBase + S.SIGNAL];
  if (!(signal > 0)) return null;
  let next = signal * (1 - 0.02 * k);
  if (next < 0.05) next = 0.05;
  if (next > 0.1) next -= 0.01 * k;
  view[iBase + S.SIGNAL] = clamp(nanGuard(next), 0, 10);
  return null;
}
