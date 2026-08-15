// ============================================================================
// VEPA v4 — Chaos Multiplex Engine
// Renders X×Y concurrent simulations in a grid, all sharing one camera.
// Each shard is an independent { buffer, dna, laws, prng } derived from a
// source simulation (the selected shard) with per-aspect variation, so the
// guided-evolution workflow can compare many futures side by side.
//
// P1 decomposition: pure shard construction (shards.js), fitness metrics
// (metrics.js) and the configuration surface (defaults.js) are extracted;
// this module keeps the controller lifecycle, the DOM grid, and the selection
// policies, and re-exports the shared surface so every importer of
// ./multiplex.js keeps working unchanged.
// ============================================================================

import {
  WORLD_SIZE,
  PARTICLE_STRIDE,
  MAX_PARTICLES,
} from '../constants.js';
import { runtimeConfig } from '../state/runtimeConfig.js';
import { solve } from '../physics/solver.js';
import { simContextFromRuntimeConfig } from '../physics/simContext.js';
import { createRenderer, renderFrame, resize as resizeRenderer } from '../render/renderer.js';
import { initCamera } from '../ui/camera.js';
import { MULTIPLEX_DEFAULTS } from './defaults.js';
import {
  BASE_FITNESS_METRICS,
  updateShardWindow,
  computeShardMetrics,
  shardFromSnapshot,
  getFitnessReport,
  summarizeMultiplex,
} from './metrics.js';
import {
  createShard,
  spawnShardOffspring,
  snapshotShard,
  restoreShard,
} from './shards.js';

/** Hard cap on concurrent shards (keeps the main thread usable). */
export const MAX_SHARDS = 16;

/** Floor for the dynamic per-shard population cap (keeps shards alive at 16×). */
export const MIN_SHARD_POPULATION = 250;

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
  // Live tunables are passed explicitly — the solver no longer reads the
  // module-level runtimeConfig singleton.
  const simContext = simContextFromRuntimeConfig(runtimeConfig);
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
        simContext,
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

// Re-export the shared surface extracted into sibling modules so importers of
// ./multiplex.js (main.js, multiplexUI.js, tests) keep working unchanged.
export { FITNESS_METRICS, ALIVE_WINDOW_SIZE, EXPLORATION_BINS } from './metrics.js';
export {
  MULTIPLEX_DEFAULTS,
  summarizeMultiplex,
  computeShardMetrics,
  getFitnessReport,
  snapshotShard,
  restoreShard,
};
