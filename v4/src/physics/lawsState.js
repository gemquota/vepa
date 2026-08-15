// ============================================================================
// VEPA v4 — Shared Law State & Helpers
// Module-level mutable state that the law implementations may consult:
//   - the shared particle buffer reference (set via setBuffer),
//   - the HISTORY law's coarse spatial memory field,
//   - the FATE law's drifting destiny clock,
//   - the small numeric helpers (clamp / nanGuard / readDNA / worldParams).
// Extracted from laws.js so individual law groups can import exactly what
// they need without owning (or re-creating) the ambient state.
// ============================================================================

import { STRIDE_INDEXES, DNA_INDEXES } from '../constants.js';
import { runtimeConfig } from '../state/runtimeConfig.js';

const S = STRIDE_INDEXES;
const D = DNA_INDEXES;
const DNA_BASE = S.DNA_CACHE_START;

// Polymer chain bond slots (batch 06): the documented "max 6 bonds per
// particle". Not contiguous in the stride (2 legacy slots + 4 appended), so
// iterate this list rather than a numeric range. Shared by the POLYMER /
// POLYMERIZATION (chemistry) and BOND / ISOMERIZATION (physics) laws.
export const BOND_SLOTS = [
  S.BOND_PARTNER_1, S.BOND_PARTNER_2, S.BOND_PARTNER_3,
  S.BOND_PARTNER_4, S.BOND_PARTNER_5, S.BOND_PARTNER_6,
];

/** Live world-param state (WORLD panel sliders). */
export function worldParams() {
  return runtimeConfig.worldParams || {};
}

export let buffer_global = null;

// HISTORY law — coarse spatial memory field (12^3 cells), reset per buffer
export const HISTORY_DIM = 12;
export const HISTORY_DECAY = 0.97;
export let historyField = null;
export let historyLast = null;
export let historyTick = 0;
export let historyBufferRef = null;
export let historyComX = HISTORY_DIM * 0.5;
export let historyComY = HISTORY_DIM * 0.5;
export let historyComZ = HISTORY_DIM * 0.5;

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

export function readDNA(ptr, dnaIndex) {
  return buffer_global[ptr + DNA_BASE + dnaIndex];
}

export function clamp(val, lo, hi) {
  if (val < lo) return lo;
  if (val > hi) return hi;
  return val;
}

export function nanGuard(val) {
  return (val !== val) ? 0 : val;
}

// ── FATE clock — advances once per tick so species destiny points wander ──

let _fateTime = 0;
export function advanceFateClock(dt) { _fateTime += dt; }
export function getFateTime() { return _fateTime; }

// ── HISTORY law — accumulate presence into the spatial memory field ──

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
