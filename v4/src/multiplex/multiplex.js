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
  DEFAULT_PARTICLES_PER_SPECIES,
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
};

/** Hard cap on concurrent shards (keeps the main thread usable). */
export const MAX_SHARDS = 16;

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
    config: { ...MULTIPLEX_DEFAULTS },
    shards: [],
    selected: 0,
    iteration: 0,
    sourceSeed: (Date.now() & 0x7fffffff) | 0,
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
  mx.config = { ...MULTIPLEX_DEFAULTS, ...(config || {}) };
  mx.active = true;
  mx.iteration = 0;
  mx.container = container || null;
  mx.sourceSeed = (Date.now() & 0x7fffffff) | 0;
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
  const source = mx.shards[mx.selected];
  mx.iteration++;
  mx.sourceSeed = ((mx.sourceSeed + 7919) & 0x7fffffff) | 0;
  buildShards(mx, source, true);
}

/** Advance physics on every shard by one step. */
export function stepMultiplex(mx, dt, simSpeed, worldSize) {
  for (const shard of mx.shards) {
    if (shard.count <= 0) continue;
    solve(
      shard.view,
      shard.count,
      PARTICLE_STRIDE,
      shard.laws,
      shard.dna,
      worldSize,
      dt * simSpeed,
      () => shard.prng.next(),
    );
    spawnShardOffspring(shard);
    shard.tick++;
  }
}

/** Render every shard to its canvas (shared camera). */
export function renderMultiplex(mx, worldSize) {
  for (const shard of mx.shards) {
    if (!shard.renderer) continue;
    if (shard.count > 0) {
      renderFrame(shard.renderer, shard.buffer, shard.count, PARTICLE_STRIDE, worldSize);
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

  const old = mx.shards;
  mx.shards = [];

  for (let i = 0; i < total; i++) {
    const seed = ((mx.sourceSeed + i * 104729) & 0x7fffffff) | 0;
    const shard = createShard(i, seed, source, mx.config);
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

function createShard(index, seed, source, config) {
  const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
  const dna = createDNABuffer();
  dna.set(source.dna.subarray ? source.dna.subarray(0, dna.length) : source.dna);

  const laws = createLawState();
  laws.lowFlags[0] = source.laws.lowFlags[0];
  laws.highFlags[0] = source.laws.highFlags[0];
  laws.extFlags[0] = source.laws.extFlags[0] || 0;

  const prng = new SplitMix32(seed);
  const shard = {
    id: index,
    buffer: buf.buffer,
    view: buf.view,
    dna,
    laws,
    prng,
    count: Math.min(source.count || 0, MAX_PARTICLES),
    speciesCount: source.speciesCount || 5,
    tick: 0,
    canvas: null,
    wrapper: null,
    renderer: null,
  };

  if (config.deriveMode === 'spawn') {
    spawnShardPopulation(shard);
  } else {
    shard.view.fill(0);
    shard.view.set(source.view.subarray(0, shard.count * PARTICLE_STRIDE));
  }
  applyVariation(shard, config);
  return shard;
}

function applyVariation(shard, config) {
  const v = config.variation || 0;
  if (v <= 0) return;
  const prng = shard.prng;

  if (config.randomizeLaws) {
    for (let l = 0; l < LAW_COUNT; l++) {
      if (prng.next() < v * 0.5) {
        if (l < 32) shard.laws.lowFlags[0] ^= (1 << l);
        else if (l < 64) shard.laws.highFlags[0] ^= (1 << (l - 32));
        else shard.laws.extFlags[0] ^= (1 << (l - 64));
      }
    }
  }

  if (config.randomizeDNA) {
    const spCount = Math.min(shard.speciesCount, 64);
    for (let s = 0; s < spCount; s++) {
      for (let p = 0; p < 42; p++) {
        if (prng.next() < v * 0.35) {
          const r = DNA_RANGES[p] || { min: 0, max: 1 };
          const span = r.max - r.min;
          const cur = getDNAFloat(shard.dna, s, p, r.min, r.max);
          const next = Math.max(r.min, Math.min(r.max, cur + (prng.next() - 0.5) * 2 * v * span));
          setDNAFloat(shard.dna, s, p, next, r.min, r.max);
        }
      }
    }
  }

  if (config.randomizePopulation) {
    for (let i = 0; i < shard.count; i++) {
      const b = i * PARTICLE_STRIDE;
      shard.view[b + S.POS_X] += (prng.next() - 0.5) * WORLD_SIZE * 0.03 * v;
      shard.view[b + S.POS_Y] += (prng.next() - 0.5) * WORLD_SIZE * 0.03 * v;
      shard.view[b + S.POS_Z] += (prng.next() - 0.5) * WORLD_SIZE * 0.03 * v;
      shard.view[b + S.VEL_X] += (prng.next() - 0.5) * 0.2 * v;
      shard.view[b + S.VEL_Y] += (prng.next() - 0.5) * 0.2 * v;
      shard.view[b + S.VEL_Z] += (prng.next() - 0.5) * 0.2 * v;
    }
  }
}

/** Fresh population for a shard (mirrors the default grid spawn). */
function spawnShardPopulation(shard) {
  shard.view.fill(0);
  const perSpecies = DEFAULT_PARTICLES_PER_SPECIES;
  const gridDim = Math.max(2, Math.ceil(Math.cbrt(perSpecies)));
  const cellSize = (WORLD_SIZE - 10) / gridDim;
  let idx = 0;
  for (let s = 0; s < Math.min(shard.speciesCount, 64); s++) {
    for (let i = 0; i < perSpecies && idx < MAX_PARTICLES; i++) {
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
      idx++;
    }
  }
  shard.count = idx;
}

/** Append offspring produced by the last solve() into this shard's buffer. */
function spawnShardOffspring(shard) {
  const list = drainOffspring();
  for (const off of list) {
    if (shard.count >= MAX_PARTICLES) break;
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
    shard.view[b + S.TEMPERATURE] = 0.5;
    shard.view[b + S.CHARGE] = 0;
    // Inherit the parents' intermediate colour when reproduction carried one
    shard.view[b + S.COLOR_R] = off.colorR != null ? Math.max(0, Math.min(255, off.colorR)) : 160;
    shard.view[b + S.COLOR_G] = off.colorG != null ? Math.max(0, Math.min(255, off.colorG)) : 160;
    shard.view[b + S.COLOR_B] = off.colorB != null ? Math.max(0, Math.min(255, off.colorB)) : 160;
    shard.count++;
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
    shard.renderer = createRenderer(canvas, MAX_PARTICLES);
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
