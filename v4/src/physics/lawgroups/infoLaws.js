// ============================================================================
// VEPA v4 — Information Law Group (INFO)
// Pairwise and per-particle law functions: Navigation, Encryption.
// Each function returns a force object {ax, ay, az} or null. State mutations
// are NaN-guarded and clamped before being written back to the buffer.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D, LAW_INDEXES } from '../../constants.js';
import { isSet } from '../../state/lawState.js';
import { runtimeConfig } from '../../state/runtimeConfig.js';
import { buffer_global, readDNA } from '../lawsState.js';

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

// ============================================================================
// Legacy information laws — migrated from laws.js (P0: laws.js → lawgroups)
// ============================================================================

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

  // j → i: the receiver gains signal + memory + homing force, the sender
  // pays the emission cost (confirmed batch-14: signalling is no longer a
  // free energy source).
  if (sJ > 0.01 && respI > 0.01) {
    const delivered = sJ * strJ * propI * chI * dt * scale;
    view[iBase + S.SIGNAL] = Math.min(1, (view[iBase + S.SIGNAL] || 0) + delivered);
    view[iBase + S.MEMORY] = (view[iBase + S.MEMORY] || 0) + delivered;
    const eJ = view[jBase + S.ENERGY];
    if (Number.isFinite(eJ)) view[jBase + S.ENERGY] = Math.max(0, eJ - delivered * 0.5);
    const forceMag = respI * delivered * 0.05;
    ax += dx * invDist * forceMag;
    ay += dy * invDist * forceMag;
    az += dz * invDist * forceMag;
  }

  // i → j: symmetric — i pays when j receives.
  if (sI > 0.01 && respJ > 0.01) {
    const delivered = sI * strI * propJ * chJ * dt * scale;
    view[jBase + S.SIGNAL] = Math.min(1, (view[jBase + S.SIGNAL] || 0) + delivered);
    view[jBase + S.MEMORY] = (view[jBase + S.MEMORY] || 0) + delivered;
    const eI = view[iBase + S.ENERGY];
    if (Number.isFinite(eI)) view[iBase + S.ENERGY] = Math.max(0, eI - delivered * 0.5);
    const forceMag = respJ * delivered * 0.05;
    ax -= dx * invDist * forceMag;
    ay -= dy * invDist * forceMag;
    az -= dz * invDist * forceMag;
  }

  if (ax === 0 && ay === 0 && az === 0) return null;
  return { ax: nanGuard(ax), ay: nanGuard(ay), az: nanGuard(az) };
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

/** STIGMERGY — lay a predicted-path trail marker, or let it evaporate.
 * Batch-17 (match irl): only moving particles lay pheromone (speed gate);
 * a stopped particle's marker melts back toward it (evaporation), so trails
 * fade instead of persisting forever. */
export function applyTrailWrite(p1Ptr, px, py, pz, vx, vy, vz) {
  const buf = buffer_global;
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  if (speed >= 0.5) {
    buf[p1Ptr + S.TRAIL_X] = px + vx * 8.0;
    buf[p1Ptr + S.TRAIL_Y] = py + vy * 8.0;
    buf[p1Ptr + S.TRAIL_Z] = pz + vz * 8.0;
  } else {
    // Evaporation: the marker melts back toward the owner's position.
    buf[p1Ptr + S.TRAIL_X] += (px - buf[p1Ptr + S.TRAIL_X]) * 0.08;
    buf[p1Ptr + S.TRAIL_Y] += (py - buf[p1Ptr + S.TRAIL_Y]) * 0.08;
    buf[p1Ptr + S.TRAIL_Z] += (pz - buf[p1Ptr + S.TRAIL_Z]) * 0.08;
  }
}

/** STIGMERGY — follow a neighbor's trail marker along the pheromone gradient.
 * Batch-17 (match irl): the pull falls off with distance to the marker and
 * scales with freshness — a marker far from its owner's current position is
 * stale (evaporated) and pulls weakly. */
export function applyStigmergyForce(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const tx = buf[p2Ptr + S.TRAIL_X] || 0;
  const ty = buf[p2Ptr + S.TRAIL_Y] || 0;
  const tz = buf[p2Ptr + S.TRAIL_Z] || 0;
  const ddx = tx - buf[p1Ptr + S.POS_X];
  const ddy = ty - buf[p1Ptr + S.POS_Y];
  const ddz = tz - buf[p1Ptr + S.POS_Z];
  const dd = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz) + 1.0;
  // Freshness: how close the marker is to its owner's current position.
  const ownerDx = tx - buf[p2Ptr + S.POS_X];
  const ownerDy = ty - buf[p2Ptr + S.POS_Y];
  const ownerDz = tz - buf[p2Ptr + S.POS_Z];
  const ownerDist = Math.sqrt(ownerDx * ownerDx + ownerDy * ownerDy + ownerDz * ownerDz);
  const freshness = 1.0 / (1.0 + ownerDist * 0.02);
  // Distance falloff: pheromone strength drops with distance from the marker.
  const falloff = 1.0 / (1.0 + dd * 0.1);
  return {
    ax: nanGuard((ddx / dd) * k * freshness * falloff),
    ay: nanGuard((ddy / dd) * k * freshness * falloff),
    az: nanGuard((ddz / dd) * k * freshness * falloff),
  };
}

/** SIGNAL_BOOST — relay signal to a neighbor on contact.
 * Batch-17: the relay scales with the sender's SIGNAL_STRENGTH DNA (0.5..1.5×),
 * consistent with GLOW/COMMS — stronger emitters relay more. */
export function applySignalBoost(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const s1 = buf[p1Ptr + S.SIGNAL] || 0;
  if (s1 > 0.01) {
    const strengthRaw = readDNA(p1Ptr, D.SIGNAL_STRENGTH);
    const strength = Number.isFinite(strengthRaw) ? strengthRaw : 0.5;
    buf[p2Ptr + S.SIGNAL] = Math.min(1, (buf[p2Ptr + S.SIGNAL] || 0) + s1 * k * (0.5 + strength * 0.5));
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
