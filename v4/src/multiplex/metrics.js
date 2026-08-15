// ============================================================================
// VEPA v4 — Chaos Multiplex: fitness metrics (P1 extraction from multiplex.js)
// Pure computation over shard state: raw per-shard metrics, the full fitness
// report (min-max normalization + modes + delta + weighted composite), and
// aggregate summaries. No DOM, no controller state — everything is a function
// of the shard/multiplex objects passed in.
// ============================================================================

import { WORLD_SIZE, PARTICLE_STRIDE, STRIDE_INDEXES } from '../constants.js';
import { MULTIPLEX_DEFAULTS } from './defaults.js';

const S = STRIDE_INDEXES;

/** The 14 fitness metrics exposed to the FIT tab (weighted composite). */
export const FITNESS_METRICS = Object.freeze([
  'population',
  'growth',
  'longevity',
  'stability',
  'energy',
  'reserves',
  'armor',
  'mobility',
  'signal',
  'bonds',
  'diversity',
  'exploration',
  'novelty',
  'delta',
]);

/** The 13 base metrics (delta is derived, not measured). */
export const BASE_FITNESS_METRICS = FITNESS_METRICS.filter((m) => m !== 'delta');

/** Rolling alive-count window length feeding GROWTH / STABILITY. */
export const ALIVE_WINDOW_SIZE = 32;

/** Spatial bins per axis for the EXPLORATION metric (4×4×4 = 64 bins). */
export const EXPLORATION_BINS = 4;

/** Count living particles in a shard buffer. */
export function countAlive(shard) {
  if (!shard || !shard.view) return 0;
  let alive = 0;
  const n = Math.min(shard.count || 0, (shard.view.length / PARTICLE_STRIDE) | 0);
  for (let p = 0; p < n; p++) {
    if (shard.view[p * PARTICLE_STRIDE + S.DEAD] === 0) alive++;
  }
  return alive;
}

/** Roll the alive-count window (cap ALIVE_WINDOW_SIZE) and update prevAlive. */
export function updateShardWindow(shard) {
  const alive = countAlive(shard);
  if (!shard.aliveWindow) shard.aliveWindow = [];
  shard.aliveWindow.push(alive);
  if (shard.aliveWindow.length > ALIVE_WINDOW_SIZE) shard.aliveWindow.shift();
  shard.prevAlive = alive;
}

/**
 * Build a metrics-compatible shard view from a World-aggregate snapshot
 * (for follow-mode). The aggregate flattens typed arrays to plain Arrays;
 * computeShardMetrics only reads them by index, so the mapping is direct.
 */
export function shardFromSnapshot(snap) {
  return {
    view: snap.particle.buffer,
    dna: snap.dna,
    sourceDna: snap.sourceDna,
    count: snap.particleCount,
    speciesCount: snap.speciesCount,
    maxCount: snap.particle.maxParticles,
    aliveWindow: snap.aliveWindow,
    prevAlive: snap.prevAlive,
  };
}

/**
 * Raw fitness metrics for one shard. All values are bounded: rates are
 * normalized (0-1), means are plain averages over living particles, and
 * novelty is a 0-1 normalized mean genome distance vs the source DNA.
 */
export function computeShardMetrics(shard, worldSize = WORLD_SIZE) {
  const out = {
    population: 0,
    growth: 0,
    longevity: 0,
    stability: 1,
    energy: 0,
    reserves: 0,
    armor: 0,
    mobility: 0,
    signal: 0,
    bonds: 0,
    diversity: 0,
    exploration: 0,
    novelty: 0,
  };
  if (!shard || !shard.view) return out;
  const n = Math.min(shard.count || 0, (shard.view.length / PARTICLE_STRIDE) | 0);
  const binSize = Math.max(1, worldSize / EXPLORATION_BINS);
  const binCount = EXPLORATION_BINS ** 3;
  const bins = new Array(binCount).fill(0);
  const speciesCounts = new Map();
  let alive = 0;
  let ageSum = 0;
  let energySum = 0;
  let reservesSum = 0;
  let armorSum = 0;
  let mobilitySum = 0;
  let signalSum = 0;
  let bondsSum = 0;
  for (let p = 0; p < n; p++) {
    const b = p * PARTICLE_STRIDE;
    if (shard.view[b + S.DEAD] >= 0.5) continue;
    alive++;
    ageSum += shard.view[b + S.AGE] || 0;
    energySum += shard.view[b + S.ENERGY] || 0;
    reservesSum += shard.view[b + S.STORED_ENERGY] || 0;
    armorSum += shard.view[b + S.ARMOR] || 0;
    mobilitySum += Math.hypot(
      shard.view[b + S.VEL_X] || 0,
      shard.view[b + S.VEL_Y] || 0,
      shard.view[b + S.VEL_Z] || 0,
    );
    signalSum += shard.view[b + S.SIGNAL] || 0;
    bondsSum += shard.view[b + S.BOND_COUNT] || 0;
    const sp = shard.view[b + S.SPECIES_ID] | 0;
    speciesCounts.set(sp, (speciesCounts.get(sp) || 0) + 1);
    const bx = Math.max(0, Math.min(EXPLORATION_BINS - 1, Math.floor(shard.view[b + S.POS_X] / binSize)));
    const by = Math.max(0, Math.min(EXPLORATION_BINS - 1, Math.floor(shard.view[b + S.POS_Y] / binSize)));
    const bz = Math.max(0, Math.min(EXPLORATION_BINS - 1, Math.floor(shard.view[b + S.POS_Z] / binSize)));
    bins[bx * EXPLORATION_BINS * EXPLORATION_BINS + by * EXPLORATION_BINS + bz]++;
  }
  out.population = alive;
  out.growth = alive - (Number.isFinite(shard.prevAlive) ? shard.prevAlive : alive);
  if (alive > 0) {
    out.longevity = ageSum / alive;
    out.energy = energySum / alive;
    out.reserves = reservesSum / alive;
    out.armor = armorSum / alive;
    out.mobility = mobilitySum / alive;
    out.signal = signalSum / alive;
    out.bonds = bondsSum / alive;
    // Shannon evenness over the species present (J = H / ln(S)).
    const counts = [...speciesCounts.values()];
    if (counts.length > 1) {
      let h = 0;
      for (const c of counts) {
        const p = c / alive;
        h -= p * Math.log(p);
      }
      out.diversity = h / Math.log(counts.length);
    } else {
      out.diversity = counts.length === 1 ? 1 : 0;
    }
    // Spatial entropy over the 4×4×4 occupancy grid, normalized by ln(bins).
    let e = 0;
    for (const c of bins) {
      if (c > 0) {
        const p = c / alive;
        e -= p * Math.log(p);
      }
    }
    out.exploration = e / Math.log(binCount);
  }
  // Novelty: mean normalized genome distance vs the shard's source DNA.
  if (shard.dna && shard.sourceDna) {
    const spStride = 64;
    const spCount = Math.min(Math.max(1, shard.speciesCount || 1), 64);
    let sum = 0;
    for (let sp = 0; sp < spCount; sp++) {
      const base = sp * spStride;
      for (let p = 0; p < spStride; p++) {
        sum += Math.abs((shard.dna[base + p] || 0) - (shard.sourceDna[base + p] || 0));
      }
    }
    out.novelty = sum / (spCount * spStride * 65535);
  }
  // Stability: 1 - coefficient-of-variation² of the alive window (0-1).
  const win = shard.aliveWindow && shard.aliveWindow.length ? shard.aliveWindow : [alive];
  const mean = win.reduce((a, b) => a + b, 0) / win.length;
  if (win.length > 1 && mean > 0) {
    let variance = 0;
    for (const c of win) variance += (c - mean) * (c - mean);
    variance /= win.length;
    out.stability = Math.max(0, Math.min(1, 1 - variance / (mean * mean)));
  }
  return out;
}

/**
 * Full fitness report: min-max normalizes the 13 base metrics across shards,
 * applies fitness modes (min → 1−norm), derives the per-shard DELTA metric
 * (mean deviation from the other shards), computes the weighted composite,
 * and pushes avgDelta into mx.deltaHistory (cap ALIVE_WINDOW_SIZE).
 */
export function getFitnessReport(mx) {
  const shards = mx.shards || [];
  const worldSize = mx.worldSize || WORLD_SIZE;
  const raw = shards.map((shard) => ({
    id: shard.id,
    metrics: computeShardMetrics(shard, worldSize),
  }));
  const weights = (mx.config && mx.config.fitnessWeights) || MULTIPLEX_DEFAULTS.fitnessWeights;
  const modes = (mx.config && mx.config.fitnessModes) || MULTIPLEX_DEFAULTS.fitnessModes;

  // Min-max normalize + mode flip on the base metrics.
  for (const key of BASE_FITNESS_METRICS) {
    let min = Infinity;
    let max = -Infinity;
    for (const r of raw) {
      const v = r.metrics[key];
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const span = max - min;
    const mode = modes[key];
    for (const r of raw) {
      const norm = span === 0 ? 0 : (r.metrics[key] - min) / span;
      r.metrics[key] = mode === 'min' ? 1 - norm : norm;
    }
  }

  // Delta: mean |score − mean(other shards)| over the base metrics.
  for (const r of raw) {
    let sum = 0;
    for (const key of BASE_FITNESS_METRICS) {
      let others = 0;
      let cnt = 0;
      for (const o of raw) {
        if (o === r) continue;
        others += o.metrics[key];
        cnt++;
      }
      const meanOthers = cnt ? others / cnt : 0;
      sum += Math.abs(r.metrics[key] - meanOthers);
    }
    r.metrics.delta = sum / BASE_FITNESS_METRICS.length;
  }
  {
    let min = Infinity;
    let max = -Infinity;
    for (const r of raw) {
      const v = r.metrics.delta;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const span = max - min;
    const mode = modes.delta;
    for (const r of raw) {
      const norm = span === 0 ? 0 : (r.metrics.delta - min) / span;
      r.metrics.delta = mode === 'min' ? 1 - norm : norm;
    }
  }

  // Weighted composite (falls back to population when all weights are 0).
  const weightSum = FITNESS_METRICS.reduce(
    (a, key) => a + Math.max(0, parseFloat(weights[key]) || 0),
    0,
  );
  const perShard = raw.map((r) => {
    let fitness;
    if (weightSum > 0) {
      fitness = FITNESS_METRICS.reduce(
        (a, key) => a + Math.max(0, parseFloat(weights[key]) || 0) * (r.metrics[key] || 0),
        0,
      ) / weightSum;
    } else {
      fitness = r.metrics.population || 0;
    }
    return { id: r.id, fitness, metrics: r.metrics };
  });

  const avgDelta = perShard.length
    ? perShard.reduce((a, e) => a + e.metrics.delta, 0) / perShard.length
    : 0;
  mx.deltaHistory = mx.deltaHistory || [];
  mx.deltaHistory.push(avgDelta);
  if (mx.deltaHistory.length > ALIVE_WINDOW_SIZE) mx.deltaHistory.shift();
  return { perShard, avgDelta, rollingDelta: mx.deltaHistory.slice() };
}

/** Aggregate stats for the drawer: shard count, living particles, cap. */
export function summarizeMultiplex(mx) {
  let alive = 0;
  for (const shard of mx.shards) {
    if (!shard || !shard.view) continue;
    const n = Math.min(shard.count || 0, (shard.view.length / PARTICLE_STRIDE) | 0);
    for (let p = 0; p < n; p++) {
      if (shard.view[p * PARTICLE_STRIDE + S.DEAD] === 0) alive++;
    }
  }
  return {
    shards: mx.shards.length,
    alive,
    populationCap: mx.populationCap || 0,
    totalBudget: (mx.populationCap || 0) * mx.shards.length,
  };
}
