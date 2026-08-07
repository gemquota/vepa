// ============================================================================
// VEPA v4 — Chaos Multiplex Engine
// Renders X×Y concurrent simulations in a grid, all sharing one camera.
// Each shard is an independent { buffer, dna, laws, prng } derived from a
// source simulation (the selected shard) with per-aspect variation, so the
// guided-evolution workflow can compare many futures side by side.
// ============================================================================

import {
  WORLD_SIZE,
  PARTICLE_STRIDE,
  MAX_PARTICLES,
  STRIDE_INDEXES,
  DNA_RANGES,
  LAW_COUNT,
} from '../constants.js';
import { createParticleBuffer } from '../state/particleBuffer.js';
import { createDNABuffer, getDNAFloat, setDNAFloat } from '../dna/dnaBuffer.js';
import { createLawState } from '../state/lawState.js';
import { solve, drainOffspring } from '../physics/solver.js';
import { createRenderer, renderFrame, resize as resizeRenderer } from '../render/renderer.js';
import { initCamera } from '../ui/camera.js';
import { SplitMix32 } from '../core/prng.js';

const S = STRIDE_INDEXES;

export const MULTIPLEX_DEFAULTS = {
  cols: 2,
  rows: 2,
  randomizeLaws: true,
  randomizeDNA: true,
  randomizePopulation: true,
  variation: 0.5,
  deriveMode: 'clone', // 'clone' | 'spawn'
  autoIterate: false,        // regenerate all shards every autoIterateInterval ticks
  autoIterateInterval: 400,  // ticks between auto-iterations
  autoSelectFittest: false,  // after each iteration, select the shard with the most life
  simSpeed: 1.0,             // timescale multiplier for the shard grid
  paused: false,             // freeze shard stepping (main sim keeps running)
  maxIterations: 0,          // 0 = unlimited; auto-iterate stops at this count
  variationDrift: 0,         // per-iteration variation increase (evolutionary pressure)
  populationScale: 1.0,      // scales the dynamic per-shard population cap (0.25–1)
  seed: 0,                   // 0 = random source seed; >0 = deterministic runs
  substeps: 1,               // solver sub-steps per shard tick (1–8)
  lawVariation: 1,           // per-aspect multipliers on the master VARIATION knob
  dnaVariation: 1,
  popVariation: 1,
  keepSelected: false,       // iterate leaves the selected shard untouched (anchor)
  selectAfterIterate: 'none', // 'none' | 'fittest' | 'follow'
  importOnExit: true,        // exit imports the selected shard into the main world
  renderQuality: 'eco',      // 'eco' | 'full' — previews skip halos/grid, DPR 1.25
  fitnessWeights: {
    population: 1,
    growth: 0,
    longevity: 0,
    stability: 0,
    energy: 0,
    reserves: 0,
    armor: 0,
    mobility: 0,
    signal: 0,
    bonds: 0,
    diversity: 0,
    exploration: 0,
    novelty: 0,
    delta: 0,
  },
  fitnessModes: {
    population: 'max',
    growth: 'max',
    longevity: 'max',
    stability: 'max',
    energy: 'max',
    reserves: 'max',
    armor: 'max',
    mobility: 'max',
    signal: 'max',
    bonds: 'max',
    diversity: 'max',
    exploration: 'max',
    novelty: 'max',
    delta: 'max',
  },
};

/** Hard cap on concurrent shards (keeps the main thread usable). */
export const MAX_SHARDS = 16;

/** Floor for the dynamic per-shard population cap (keeps shards alive at 16×). */
export const MIN_SHARD_POPULATION = 250;

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
const BASE_FITNESS_METRICS = FITNESS_METRICS.filter((m) => m !== 'delta');

/** Rolling alive-count window length feeding GROWTH / STABILITY. */
export const ALIVE_WINDOW_SIZE = 32;

/** Spatial bins per axis for the EXPLORATION metric (4×4×4 = 64 bins). */
export const EXPLORATION_BINS = 4;

/**
 * Dynamic per-shard population cap: the more shards run at once, the smaller
 * each shard's population gets (inverse-square-root curve), so the combined
 * physics budget stays bounded. `scale` (0.25–1) is the live POP SCALE knob.
 */
export function computeShardPopulationCap(total, scale = 1) {
  const count = Math.max(1, Math.round(total) || 1);
  const base = Math.floor(MAX_PARTICLES / Math.sqrt(count));
  const scaled = Math.floor(base * Math.max(0.1, Math.min(1, parseFloat(scale) || 1)));
  return Math.max(MIN_SHARD_POPULATION, Math.min(MAX_PARTICLES, scaled));
}

/** Species colour palette for freshly spawned shard populations. */
const SHARD_SPECIES_COLORS = [
  [255, 80, 80],
  [255, 200, 50],
  [80, 255, 120],
  [120, 160, 255],
  [100, 60, 140],
];

/**
 * Create a fresh multiplex state object.
 */
export function createMultiplex(bus) {
  return {
    bus,
    active: false,
    config: {
      ...MULTIPLEX_DEFAULTS,
      fitnessWeights: { ...MULTIPLEX_DEFAULTS.fitnessWeights },
      fitnessModes: { ...MULTIPLEX_DEFAULTS.fitnessModes },
    },
    shards: [],
    selected: 0,
    iteration: 0,
    tick: 0,
    populationCap: 0,
    sourceSeed: (Date.now() & 0x7fffffff) | 0,
    worldSize: WORLD_SIZE,
    deltaHistory: [],
    container: null,
    onResize: null,
  };
}

/**
 * Enter multiplex mode: derive cols×rows shards from `source` (the main sim
 * or a selected shard) and mount the grid into `container`.
 */
export function startMultiplex(mx, source, config, container) {
  stopMultiplex(mx);
  mx.config = {
    ...MULTIPLEX_DEFAULTS,
    ...(config || {}),
    fitnessWeights: { ...((config && config.fitnessWeights) || MULTIPLEX_DEFAULTS.fitnessWeights) },
    fitnessModes: { ...((config && config.fitnessModes) || MULTIPLEX_DEFAULTS.fitnessModes) },
  };
  mx.active = true;
  mx.iteration = 0;
  mx.tick = 0;
  mx.container = container || null;
  const seed = Math.max(1, Math.round(mx.config.seed) || 0);
  mx.sourceSeed = seed > 0 ? (seed & 0x7fffffff) | 0 : (Date.now() & 0x7fffffff) | 0;
  buildShards(mx, source, false);
}

/**
 * Leave multiplex mode: tear down shards and their canvases.
 */
export function stopMultiplex(mx) {
  for (const shard of mx.shards) {
    if (shard.wrapper && shard.wrapper.parentNode) {
      shard.wrapper.parentNode.removeChild(shard.wrapper);
    }
  }
  if (mx.onResize && typeof window !== 'undefined') {
    window.removeEventListener('resize', mx.onResize);
    mx.onResize = null;
  }
  mx.shards = [];
  mx.active = false;
  mx.container = null;
}

/**
 * Regenerate every shard from the currently selected shard (new seeds).
 */
export function iterateMultiplex(mx) {
  if (!mx.active || mx.shards.length === 0) return;
  const cfg = mx.config || {};
  // Evolutionary pressure: each generation drifts the variation upward so
  // later generations explore more broadly (capped at full divergence).
  const drift = Math.max(0, Math.min(0.1, parseFloat(cfg.variationDrift) || 0));
  if (drift > 0) cfg.variation = Math.min(1, (cfg.variation || 0) + drift);
  const keepIndex = mx.selected;
  const prevSnapshot = snapshotShard(mx.shards[keepIndex]);
  const source = mx.shards[keepIndex];
  mx.iteration++;
  mx.sourceSeed = ((mx.sourceSeed + 7919) & 0x7fffffff) | 0;
  buildShards(mx, source, true);
  // Anchor: keep-selected leaves the previous selection untouched.
  if (cfg.keepSelected && mx.shards[keepIndex]) {
    restoreShard(mx.shards[keepIndex], prevSnapshot);
  }
  // Post-iterate selection policy ('none' | 'fittest' | 'follow').
  const mode = cfg.selectAfterIterate || (cfg.autoSelectFittest ? 'fittest' : 'none');
  if (mode === 'fittest') selectFittestShard(mx);
  else if (mode === 'follow') selectFollowShard(mx, prevSnapshot, cfg.keepSelected ? keepIndex : -1);
}

/** Advance physics on every shard by one step. */
export function stepMultiplex(mx, dt, simSpeed, worldSize) {
  const cfg = mx.config || {};
  if (cfg.paused) return; // frozen grid — the main sim keeps stepping
  const effDt = dt * simSpeed * Math.max(0.05, cfg.simSpeed || 1);
  const substeps = Math.max(1, Math.min(8, Math.round(cfg.substeps) || 1));
  const subDt = effDt / substeps;
  const t0 = performance.now();
  for (const shard of mx.shards) {
    if (shard.count <= 0) continue;
    for (let s = 0; s < substeps; s++) {
      solve(
        shard.view,
        shard.count,
        PARTICLE_STRIDE,
        shard.laws,
        shard.dna,
        worldSize,
        subDt,
        () => shard.prng.next(),
      );
    }
    spawnShardOffspring(shard);
    updateShardWindow(shard);
    shard.tick++;
  }
  const tickMs = performance.now() - t0;
  mx.lastTickMs = mx.lastTickMs === undefined ? tickMs : mx.lastTickMs * 0.85 + tickMs * 0.15;
  mx.tick++;
  mx.worldSize = worldSize;
  // Auto-iterate: hands-off guided evolution — regenerate every shard on a
  // fixed cadence and (optionally) keep the fittest shard selected.
  const interval = Math.max(1, Math.round(cfg.autoIterateInterval) || 400);
  const maxIter = Math.max(0, Math.round(cfg.maxIterations) || 0);
  const withinLimit = maxIter === 0 || mx.iteration < maxIter;
  if (cfg.autoIterate && mx.shards.length > 0 && withinLimit && (mx.tick % interval === 0)) {
    iterateMultiplex(mx);
    if (cfg.autoSelectFittest) selectFittestShard(mx);
  }
}

/** Select the highest-fitness shard (default weights = alive-only ranking). */
export function selectFittestShard(mx) {
  const report = getFitnessReport(mx);
  let best = -1;
  let bestFitness = -Infinity;
  for (const entry of report.perShard) {
    if (entry.fitness > bestFitness) {
      bestFitness = entry.fitness;
      best = entry.id;
    }
  }
  if (best >= 0) selectShard(mx, best);
}

/**
 * Select the shard whose metric profile is closest to `prevSnapshot` (the
 * previous selection) — "follow the world that was on screen". skipIndex
 * excludes one shard (used to skip the kept-selected anchor).
 */
export function selectFollowShard(mx, prevSnapshot, skipIndex = -1) {
  if (!mx.shards.length || !prevSnapshot) return;
  const worldSize = mx.worldSize || WORLD_SIZE;
  const prev = computeShardMetrics(shardFromSnapshot(prevSnapshot), worldSize);
  const candidates = [];
  for (const shard of mx.shards) {
    if (skipIndex >= 0 && shard.id === skipIndex) continue;
    candidates.push({ id: shard.id, metrics: computeShardMetrics(shard, worldSize) });
  }
  if (!candidates.length) return;
  // Min-max normalize each base metric across prev + candidates, then pick
  // the candidate with the smallest total normalized distance to prev.
  const normPrev = {};
  const normCand = candidates.map((c) => ({ id: c.id, norm: {} }));
  for (const key of BASE_FITNESS_METRICS) {
    let min = Infinity;
    let max = -Infinity;
    for (const c of candidates) {
      const v = c.metrics[key];
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (prev[key] < min) min = prev[key];
    if (prev[key] > max) max = prev[key];
    const span = max - min;
    normPrev[key] = span === 0 ? 0 : (prev[key] - min) / span;
    for (let i = 0; i < candidates.length; i++) {
      normCand[i].norm[key] = span === 0 ? 0 : (candidates[i].metrics[key] - min) / span;
    }
  }
  let bestId = -1;
  let bestDist = Infinity;
  for (const c of normCand) {
    let dist = 0;
    for (const key of BASE_FITNESS_METRICS) dist += Math.abs(c.norm[key] - normPrev[key]);
    if (dist < bestDist - 1e-12) {
      bestDist = dist;
      bestId = c.id;
    }
  }
  if (bestId >= 0) selectShard(mx, bestId);
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

/** Count living particles in a shard buffer. */
function countAlive(shard) {
  if (!shard || !shard.view) return 0;
  let alive = 0;
  const n = Math.min(shard.count || 0, (shard.view.length / PARTICLE_STRIDE) | 0);
  for (let p = 0; p < n; p++) {
    if (shard.view[p * PARTICLE_STRIDE + S.DEAD] === 0) alive++;
  }
  return alive;
}

/** Roll the alive-count window (cap ALIVE_WINDOW_SIZE) and update prevAlive. */
function updateShardWindow(shard) {
  const alive = countAlive(shard);
  if (!shard.aliveWindow) shard.aliveWindow = [];
  shard.aliveWindow.push(alive);
  if (shard.aliveWindow.length > ALIVE_WINDOW_SIZE) shard.aliveWindow.shift();
  shard.prevAlive = alive;
}

/** Build a metrics-compatible shard view from a snapshot (for follow-mode). */
function shardFromSnapshot(snap) {
  return {
    view: snap.view,
    dna: snap.dna,
    sourceDna: snap.sourceDna,
    count: snap.count,
    speciesCount: snap.speciesCount,
    maxCount: snap.maxCount,
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

/** Full snapshot of a shard's view, DNA, laws, PRNG and counters. */
export function snapshotShard(shard) {
  return {
    view: shard.view.slice(),
    dna: shard.dna ? shard.dna.slice() : null,
    sourceDna: shard.sourceDna ? shard.sourceDna.slice() : null,
    laws: {
      lowFlags: shard.laws ? shard.laws.lowFlags[0] : 0,
      highFlags: shard.laws ? shard.laws.highFlags[0] : 0,
      extFlags: shard.laws && shard.laws.extFlags ? shard.laws.extFlags[0] : 0,
      quadFlags: shard.laws && shard.laws.quadFlags ? shard.laws.quadFlags[0] : 0,
    },
    prngState: shard.prng ? shard.prng.state | 0 : 0,
    count: shard.count,
    speciesCount: shard.speciesCount,
    maxCount: shard.maxCount,
    tick: shard.tick,
    offspring: shard.offspring || 0,
    aliveWindow: shard.aliveWindow ? shard.aliveWindow.slice() : [],
    prevAlive: shard.prevAlive,
  };
}

/** Restore a snapshot onto a (freshly built) shard — keep-selected anchor. */
export function restoreShard(shard, snap) {
  if (!shard || !snap) return;
  shard.view.fill(0);
  shard.view.set(snap.view);
  if (shard.dna && snap.dna) shard.dna.set(snap.dna);
  if (shard.sourceDna && snap.sourceDna) shard.sourceDna.set(snap.sourceDna);
  if (shard.laws && snap.laws) {
    shard.laws.lowFlags[0] = snap.laws.lowFlags;
    shard.laws.highFlags[0] = snap.laws.highFlags;
    if (shard.laws.extFlags) shard.laws.extFlags[0] = snap.laws.extFlags;
    if (shard.laws.quadFlags) shard.laws.quadFlags[0] = snap.laws.quadFlags;
  }
  if (shard.prng) shard.prng.state = snap.prngState | 0;
  shard.count = snap.count;
  shard.speciesCount = snap.speciesCount;
  shard.maxCount = snap.maxCount;
  shard.tick = snap.tick;
  shard.offspring = snap.offspring;
  shard.aliveWindow = snap.aliveWindow ? snap.aliveWindow.slice() : [];
  shard.prevAlive = snap.prevAlive;
}

/**
 * Copy a shard into the main world buffers. Returns the imported population
 * so the caller can sync particle/species counts and downstream systems.
 */
export function copyShardToWorld(shard, target) {
  const count = Math.max(0, Math.min(shard.count || 0, MAX_PARTICLES));
  target.view.fill(0);
  if (count > 0) target.view.set(shard.view.subarray(0, count * PARTICLE_STRIDE));
  if (target.dna && shard.dna) target.dna.set(shard.dna);
  if (target.laws && shard.laws) {
    target.laws.lowFlags[0] = shard.laws.lowFlags[0];
    target.laws.highFlags[0] = shard.laws.highFlags[0];
    if (target.laws.extFlags && shard.laws.extFlags) target.laws.extFlags[0] = shard.laws.extFlags[0];
    if (target.laws.quadFlags && shard.laws.quadFlags) target.laws.quadFlags[0] = shard.laws.quadFlags[0];
  }
  return { count, speciesCount: shard.speciesCount || 5 };
}

/** Render every shard to its canvas (shared camera). */
export function renderMultiplex(mx, worldSize) {
  const eco = (mx.config && mx.config.renderQuality) !== 'full';
  for (const shard of mx.shards) {
    if (!shard.renderer) continue;
    if (shard.count > 0) {
      // Pass the typed view (zero-copy) + eco flags for the preview canvases.
      shard.renderer.eco = eco;
      renderFrame(shard.renderer, shard.view, shard.count, PARTICLE_STRIDE, worldSize, { eco });
    } else {
      const { ctx, width, height } = shard.renderer;
      ctx.clearRect(0, 0, width, height);
    }
  }
}

/** Re-measure every shard canvas (call after layout changes). */
export function resizeMultiplex(mx) {
  for (const shard of mx.shards) {
    if (shard.renderer) resizeRenderer(shard.renderer);
  }
}

/** Select a shard by index and surface the selection box. */
export function selectShard(mx, index) {
  if (!mx.shards.length) return;
  mx.selected = Math.max(0, Math.min(index, mx.shards.length - 1));
  for (let i = 0; i < mx.shards.length; i++) {
    if (mx.shards[i].wrapper) {
      mx.shards[i].wrapper.classList.toggle('selected', i === mx.selected);
    }
  }
  if (mx.bus) mx.bus.emit('multiplex:selected', { index: mx.selected, total: mx.shards.length });
}

// ── Shard construction ──────────────────────────────────────────────────────

function buildShards(mx, source, fromShard) {
  let { cols, rows } = mx.config;
  cols = Math.max(1, Math.min(4, Math.round(cols) || 1));
  rows = Math.max(1, Math.min(4, Math.round(rows) || 1));
  mx.config.cols = cols;
  mx.config.rows = rows;
  const total = Math.max(1, Math.min(MAX_SHARDS, cols * rows));
  mx.populationCap = computeShardPopulationCap(total, mx.config.populationScale);

  const old = mx.shards;
  mx.shards = [];

  for (let i = 0; i < total; i++) {
    const seed = ((mx.sourceSeed + i * 104729) & 0x7fffffff) | 0;
    const shard = createShard(i, seed, source, mx.config, mx.populationCap);
    // Reuse the DOM cell when the grid layout is unchanged so canvases,
    // renderers, and the selection box survive iteration.
    const prev = old[i];
    if (prev) {
      shard.wrapper = prev.wrapper;
      shard.canvas = prev.canvas;
      shard.renderer = prev.renderer;
    }
    mx.shards.push(shard);
  }

  // Tear down surplus cells from a previously larger grid.
  for (let i = total; i < old.length; i++) {
    if (old[i].wrapper && old[i].wrapper.parentNode) {
      old[i].wrapper.parentNode.removeChild(old[i].wrapper);
    }
  }

  mx.selected = Math.min(mx.selected, total - 1);
  mountShards(mx);
  selectShard(mx, mx.selected);

  // First mount: canvases only get real dimensions after a layout pass.
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => resizeMultiplex(mx));
  }
  void fromShard;
}

function createShard(index, seed, source, config, maxCount) {
  const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
  const dna = createDNABuffer();
  dna.set(source.dna.subarray ? source.dna.subarray(0, dna.length) : source.dna);

  const laws = createLawState();
  laws.lowFlags[0] = source.laws.lowFlags[0];
  laws.highFlags[0] = source.laws.highFlags[0];
  laws.extFlags[0] = source.laws.extFlags[0] || 0;
  laws.quadFlags[0] = source.laws.quadFlags[0] || 0;

  const prng = new SplitMix32(seed);
  const shard = {
    id: index,
    buffer: buf.buffer,
    view: buf.view,
    dna,
    sourceDna: dna.slice(), // pre-variation genome this shard derived from
    laws,
    prng,
    maxCount,
    count: Math.min(source.count || 0, maxCount),
    speciesCount: source.speciesCount || 5,
    tick: 0,
    offspring: 0,
    aliveWindow: [],
    prevAlive: 0,
    canvas: null,
    wrapper: null,
    renderer: null,
  };

  if (config.deriveMode === 'spawn') {
    spawnShardPopulation(shard);
  } else {
    shard.view.fill(0);
    if (shard.count > 0) {
      shard.view.set(source.view.subarray(0, shard.count * PARTICLE_STRIDE));
    }
  }
  applyVariation(shard, config);
  shard.prevAlive = countAlive(shard);
  shard.aliveWindow = [shard.prevAlive];
  return shard;
}

function applyVariation(shard, config) {
  const v = config.variation || 0;
  if (v <= 0) return;
  const prng = shard.prng;
  // Per-aspect multipliers (0 blocks that aspect entirely, 1 = master knob).
  const aspect = (x) => {
    const n = parseFloat(x);
    return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 1;
  };
  const lawV = aspect(config.lawVariation);
  const dnaV = aspect(config.dnaVariation);
  const popV = aspect(config.popVariation);

  if (config.randomizeLaws && lawV > 0) {
    for (let l = 0; l < LAW_COUNT; l++) {
      if (prng.next() < v * lawV * 0.5) {
        if (l < 32) shard.laws.lowFlags[0] ^= (1 << l);
        else if (l < 64) shard.laws.highFlags[0] ^= (1 << (l - 32));
        else if (l < 96) shard.laws.extFlags[0] ^= (1 << (l - 64));
        else shard.laws.quadFlags[0] ^= (1 << (l - 96));
      }
    }
  }

  if (config.randomizeDNA) {
    const spCount = Math.min(shard.speciesCount, 64);
    for (let s = 0; s < spCount; s++) {
      for (let p = 0; p < 42; p++) {
        if (prng.next() < v * dnaV * 0.35) {
          const r = DNA_RANGES[p] || { min: 0, max: 1 };
          const span = r.max - r.min;
          const cur = getDNAFloat(shard.dna, s, p, r.min, r.max);
          const next = Math.max(r.min, Math.min(r.max, cur + (prng.next() - 0.5) * 2 * v * dnaV * span));
          setDNAFloat(shard.dna, s, p, next, r.min, r.max);
        }
      }
    }
  }

  if (config.randomizePopulation && popV > 0) {
    for (let i = 0; i < shard.count; i++) {
      const b = i * PARTICLE_STRIDE;
      shard.view[b + S.POS_X] += (prng.next() - 0.5) * WORLD_SIZE * 0.03 * v * popV;
      shard.view[b + S.POS_Y] += (prng.next() - 0.5) * WORLD_SIZE * 0.03 * v * popV;
      shard.view[b + S.POS_Z] += (prng.next() - 0.5) * WORLD_SIZE * 0.03 * v * popV;
      shard.view[b + S.VEL_X] += (prng.next() - 0.5) * 0.2 * v * popV;
      shard.view[b + S.VEL_Y] += (prng.next() - 0.5) * 0.2 * v * popV;
      shard.view[b + S.VEL_Z] += (prng.next() - 0.5) * 0.2 * v * popV;
    }
  }
}

/** Fresh population for a shard (mirrors the default grid spawn). */
function spawnShardPopulation(shard) {
  shard.view.fill(0);
  const species = Math.min(shard.speciesCount || 5, 64);
  // Balance species evenly when the dynamic cap is below the default spawn.
  const perSpecies = Math.max(1, Math.floor(shard.maxCount / species));
  const gridDim = Math.max(2, Math.ceil(Math.cbrt(perSpecies)));
  const cellSize = (WORLD_SIZE - 10) / gridDim;
  let idx = 0;
  for (let s = 0; s < species; s++) {
    for (let i = 0; i < perSpecies && idx < shard.maxCount; i++) {
      const b = idx * PARTICLE_STRIDE;
      const gx = i % gridDim;
      const gy = Math.floor(i / gridDim) % gridDim;
      const gz = Math.floor(i / (gridDim * gridDim));
      const jx = (shard.prng.next() - 0.5) * cellSize * 0.4;
      const jy = (shard.prng.next() - 0.5) * cellSize * 0.4;
      const jz = (shard.prng.next() - 0.5) * cellSize * 0.4;
      shard.view[b + S.POS_X] = 5 + gx * cellSize + cellSize * 0.5 + jx;
      shard.view[b + S.POS_Y] = 5 + gy * cellSize + cellSize * 0.5 + jy;
      shard.view[b + S.POS_Z] = 5 + gz * cellSize + cellSize * 0.5 + jz;
      shard.view[b + S.MASS] = 1.0 + shard.prng.next();
      shard.view[b + S.SPECIES_ID] = s;
      shard.view[b + S.ENERGY] = 50 + shard.prng.next() * 50;
      shard.view[b + S.DEAD] = 0;
      shard.view[b + S.AGE] = 0;
      const col = SHARD_SPECIES_COLORS[s % SHARD_SPECIES_COLORS.length];
      shard.view[b + S.COLOR_R] = col[0];
      shard.view[b + S.COLOR_G] = col[1];
      shard.view[b + S.COLOR_B] = col[2];
      for (let d = 0; d < 42; d++) {
        const r = DNA_RANGES[d] || { min: -1, max: 1 };
        shard.view[b + S.DNA_CACHE_START + d] =
          getDNAFloat(shard.dna, s, d, r.min, r.max);
      }
      shard.view[b + S.ELECTRIC_ENERGY] = 0;
      shard.view[b + S.STORED_ENERGY] = 0;
      shard.view[b + S.REPRO_DRIVE] = 0;
      shard.view[b + S.RADIATION_EXPOSURE] = 0;
      shard.view[b + S.ENTANGLE_ID] = -1;
      shard.view[b + S.ENTANGLE_PHASE] = 0;
      idx++;
    }
  }
  shard.count = idx;
}

/** Append offspring produced by the last solve() into this shard's buffer. */
function spawnShardOffspring(shard) {
  const list = drainOffspring();
  for (const off of list) {
    if (shard.count >= shard.maxCount) break;
    const b = shard.count * PARTICLE_STRIDE;
    shard.view[b + S.POS_X] = off.x;
    shard.view[b + S.POS_Y] = off.y;
    shard.view[b + S.POS_Z] = off.z || 0;
    shard.view[b + S.VEL_X] = off.vx || 0;
    shard.view[b + S.VEL_Y] = off.vy || 0;
    shard.view[b + S.VEL_Z] = off.vz || 0;
    shard.view[b + S.MASS] = off.mass || 1.0;
    shard.view[b + S.SPECIES_ID] = off.speciesId;
    shard.view[b + S.ENERGY] = off.energy || 60;
    if (off.dna && off.dna.length) {
      for (let d = 0; d < 42 && d < off.dna.length; d++) {
        shard.view[b + S.DNA_CACHE_START + d] = off.dna[d];
      }
    }
    shard.view[b + S.DEAD] = 0;
    shard.view[b + S.AGE] = 0;
    shard.view[b + S.SIGNAL] = 0;
    shard.view[b + S.MEMORY] = 0;
    shard.view[b + S.HUNGER] = 0;
    shard.view[b + S.ARMOR] = 0.2;
    shard.view[b + S.MITOSIS_TIMER] = 0;
    shard.view[b + S.PARTNER_ID] = -1;
    shard.view[b + S.BOND_COUNT] = 0;
    shard.view[b + S.BOND_PARTNER_1] = -1;
    shard.view[b + S.BOND_PARTNER_2] = -1;
      shard.view[b + S.BOND_PARTNER_3] = -1;
      shard.view[b + S.BOND_PARTNER_4] = -1;
      shard.view[b + S.BOND_PARTNER_5] = -1;
      shard.view[b + S.BOND_PARTNER_6] = -1;
    shard.view[b + S.TEMPERATURE] = 0.5;
    shard.view[b + S.CHARGE] = 0;
    shard.view[b + S.ELECTRIC_ENERGY] = 0;
    shard.view[b + S.STORED_ENERGY] = 0;
    shard.view[b + S.REPRO_DRIVE] = 0;
    shard.view[b + S.RADIATION_EXPOSURE] = 0;
    shard.view[b + S.ENTANGLE_ID] = -1;
    shard.view[b + S.ENTANGLE_PHASE] = 0;
    // Inherit the parents' intermediate colour when reproduction carried one
    shard.view[b + S.COLOR_R] = off.colorR != null ? Math.max(0, Math.min(255, off.colorR)) : 160;
    shard.view[b + S.COLOR_G] = off.colorG != null ? Math.max(0, Math.min(255, off.colorG)) : 160;
    shard.view[b + S.COLOR_B] = off.colorB != null ? Math.max(0, Math.min(255, off.colorB)) : 160;
    shard.count++;
    shard.offspring = (shard.offspring || 0) + 1;
  }
}

// ── DOM: grid + canvases ────────────────────────────────────────────────────

function mountShards(mx) {
  if (!mx.container) return;
  const { cols, rows } = mx.config;
  mx.container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  mx.container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  for (const shard of mx.shards) {
    if (shard.wrapper) continue; // reused from a previous build

    const wrap = document.createElement('div');
    wrap.className = 'shard-cell';
    wrap.dataset.shardLabel = 'S' + String(shard.id + 1).padStart(2, '0');
    const canvas = document.createElement('canvas');
    canvas.className = 'shard-canvas';
    wrap.appendChild(canvas);
    mx.container.appendChild(wrap);

    shard.wrapper = wrap;
    shard.canvas = canvas;
    shard.renderer = createRenderer(canvas, MAX_PARTICLES, { maxDpr: 1.25, eco: true });
    // The camera module keeps a single shared camera object, so gestures on
    // any shard move every shard (and the main sim) simultaneously.
    initCamera(canvas, WORLD_SIZE);

    // Tap = select (drag gestures are handled by the shared camera).
    let downX = 0, downY = 0, downT = 0;
    canvas.addEventListener('pointerdown', (e) => {
      downX = e.clientX;
      downY = e.clientY;
      downT = performance.now();
    });
    canvas.addEventListener('pointerup', (e) => {
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      if (dx * dx + dy * dy < 64 && performance.now() - downT < 450) {
        selectShard(mx, shard.id);
      }
    });
  }

  if (!mx.onResize) {
    mx.onResize = () => resizeMultiplex(mx);
    window.addEventListener('resize', mx.onResize);
  }
}
