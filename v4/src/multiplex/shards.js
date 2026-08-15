// ============================================================================
// VEPA v4 — Chaos Multiplex: shard construction (P1 extraction from multiplex.js)
// Pure shard factory: builds an independent { buffer, dna, laws, prng } shard
// from a source simulation, applies per-aspect variation, spawns fresh
// populations, drains solver offspring, and snapshots/restores shard state.
// No DOM, no controller state — everything is a function of the inputs.
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
import { drainOffspring } from '../physics/solver.js';
import { SplitMix32 } from '../core/prng.js';
import { createWorld, snapshotWorld, restoreWorld } from '../world/world.js';
import { countAlive } from './metrics.js';

const S = STRIDE_INDEXES;

/** Species colour palette for freshly spawned shard populations. */
const SHARD_SPECIES_COLORS = [
  [255, 80, 80],
  [255, 200, 50],
  [80, 255, 120],
  [120, 160, 255],
  [100, 60, 140],
];

export function createShard(index, seed, source, config, maxCount) {
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

  // P3 — every shard owns a World aggregate wrapping the same buffers. The
  // flat fields (view/dna/laws/count/tick) stay for the hot solver/metrics
  // paths; snapshot/restore go through the aggregate's canonical boundary.
  shard.world = buildShardWorld(shard);
  return shard;
}

/** Wrap a shard's buffers in a World aggregate (no allocation — same views). */
function buildShardWorld(shard) {
  return createWorld({
    particle: {
      buffer: shard.buffer,
      view: shard.view,
      isShared: typeof SharedArrayBuffer !== 'undefined' && shard.buffer instanceof SharedArrayBuffer,
      stride: PARTICLE_STRIDE,
      maxParticles: shard.maxCount,
    },
    dna: shard.dna,
    lawState: shard.laws,
    count: shard.count,
    speciesCount: shard.speciesCount,
    worldSize: WORLD_SIZE,
    tick: shard.tick,
    name: `Shard ${shard.id}`,
    seed: shard.id,
  });
}

/** Mirror the shard's flat runtime counters into its World aggregate. */
function syncShardWorld(shard) {
  shard.world.population.count = shard.count;
  shard.world.population.speciesCount = shard.speciesCount;
  shard.world.time.tick = shard.tick;
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
export function spawnShardOffspring(shard) {
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

/**
 * Full snapshot of a shard via the World aggregate (canonical shape:
 * version/worldParams/lawState/dna/particle/worldSize/particleCount/
 * speciesCount/tick/metadata), plus the shard-local extras the aggregate
 * doesn't model (PRNG stream, offspring tally, alive window, source genome).
 */
export function snapshotShard(shard) {
  syncShardWorld(shard);
  const snap = snapshotWorld(shard.world, { includeParticles: true });
  snap.prngState = shard.prng ? shard.prng.state | 0 : 0;
  snap.offspring = shard.offspring || 0;
  snap.aliveWindow = shard.aliveWindow ? shard.aliveWindow.slice() : [];
  snap.prevAlive = shard.prevAlive;
  snap.sourceDna = shard.sourceDna ? shard.sourceDna.slice() : null;
  return snap;
}

/** Restore a snapshot onto a (freshly built) shard — keep-selected anchor. */
export function restoreShard(shard, snap) {
  if (!shard || !snap) return;
  restoreWorld(shard.world, snap);
  // restoreWorld reassigns lawState; re-sync the flat fields from the world.
  shard.laws = shard.world.lawState;
  shard.count = shard.world.population.count;
  shard.speciesCount = shard.world.population.speciesCount;
  shard.tick = shard.world.time.tick;
  if (shard.prng) shard.prng.state = snap.prngState | 0;
  shard.offspring = snap.offspring;
  shard.aliveWindow = snap.aliveWindow ? snap.aliveWindow.slice() : [];
  shard.prevAlive = snap.prevAlive;
  if (shard.sourceDna && snap.sourceDna) shard.sourceDna.set(snap.sourceDna);
}
