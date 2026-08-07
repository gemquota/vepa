import { describe, it, expect } from 'vitest';
import {
  WORLD_SIZE,
  PARTICLE_STRIDE,
  MAX_PARTICLES,
  STRIDE_INDEXES,
  LAW_INDEXES,
} from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createDNABuffer } from '../../src/dna/dnaBuffer.js';
import { createLawState, set } from '../../src/state/lawState.js';
import { SplitMix32 } from '../../src/core/prng.js';
import {
  createMultiplex,
  startMultiplex,
  stopMultiplex,
  iterateMultiplex,
  stepMultiplex,
  selectShard,
  selectFittestShard,
  selectFollowShard,
  snapshotShard,
  restoreShard,
  copyShardToWorld,
  computeShardPopulationCap,
  getFitnessReport,
  MULTIPLEX_DEFAULTS,
  MIN_SHARD_POPULATION,
} from '../../src/multiplex/multiplex.js';

const S = STRIDE_INDEXES;

/** Build a minimal source sim: 4 particles, 2 species, laws off. */
function makeSource(particleCount = 4, laws = null) {
  const { buffer, view } = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
  view.fill(0);
  for (let i = 0; i < particleCount; i++) {
    const b = i * PARTICLE_STRIDE;
    view[b + S.POS_X] = 100 + i * 10;
    view[b + S.POS_Y] = 200;
    view[b + S.POS_Z] = 300;
    view[b + S.MASS] = 1.5;
    view[b + S.SPECIES_ID] = i % 2;
    view[b + S.ENERGY] = 80;
    view[b + S.DEAD] = 0;
    view[b + S.DNA_CACHE_START] = 0.5;
  }
  const dna = createDNABuffer();
  const lawState = laws || createLawState();
  return { buffer, view, count: particleCount, dna, laws: lawState, speciesCount: 2 };
}

describe('Chaos Multiplex core', () => {
  it('derives cols×rows shards from the source simulation', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(), { ...MULTIPLEX_DEFAULTS, cols: 2, rows: 2, variation: 0 }, null);
    expect(mx.active).toBe(true);
    expect(mx.shards.length).toBe(4);
    for (const shard of mx.shards) {
      expect(shard.count).toBe(4);
      expect(shard.view[0]).toBeCloseTo(100, 5); // cloned positions
    }
    stopMultiplex(mx);
    expect(mx.active).toBe(false);
    expect(mx.shards.length).toBe(0);
  });

  it('with variation disabled, shard DNA/laws match the source exactly', () => {
    const src = makeSource();
    const mx = createMultiplex(null);
    startMultiplex(mx, src, { ...MULTIPLEX_DEFAULTS, cols: 2, rows: 1, variation: 0, randomizeLaws: true, randomizeDNA: true }, null);
    for (const shard of mx.shards) {
      expect(shard.laws.lowFlags[0]).toBe(src.laws.lowFlags[0]);
      expect(shard.laws.highFlags[0]).toBe(src.laws.highFlags[0]);
      expect(shard.dna[0]).toBe(src.dna[0]);
    }
  });

  it('with laws off, stepping never moves shard particles', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(), { ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0 }, null);
    const before = Array.from(mx.shards[0].view.subarray(0, 4 * PARTICLE_STRIDE));
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE);
    const after = Array.from(mx.shards[0].view.subarray(0, 4 * PARTICLE_STRIDE));
    expect(after).toEqual(before);
  });

  it('iteration regenerates shards from the selected shard and bumps the counter', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(), { ...MULTIPLEX_DEFAULTS, cols: 2, rows: 2, variation: 0.4 }, null);
    selectShard(mx, 2);
    expect(mx.selected).toBe(2);
    const prevSeed = mx.sourceSeed;
    iterateMultiplex(mx);
    expect(mx.iteration).toBe(1);
    expect(mx.sourceSeed).not.toBe(prevSeed);
    expect(mx.shards.length).toBe(4);
    expect(mx.selected).toBe(2);
  });

  it('new defaults: auto-iterate cadence + auto-select fittest are present', () => {
    expect(MULTIPLEX_DEFAULTS.autoIterate).toBe(false);
    expect(MULTIPLEX_DEFAULTS.autoIterateInterval).toBe(400);
    expect(MULTIPLEX_DEFAULTS.autoSelectFittest).toBe(false);
    const mx = createMultiplex(null);
    expect(mx.tick).toBe(0);
  });

  it('autoIterate regenerates shards on the configured cadence', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(), {
      ...MULTIPLEX_DEFAULTS,
      cols: 2,
      rows: 1,
      variation: 0,
      autoIterate: true,
      autoIterateInterval: 2,
    }, null);
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE); // tick 1
    expect(mx.iteration).toBe(0);
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE); // tick 2 → auto-iterate
    expect(mx.iteration).toBe(1);
    expect(mx.shards.length).toBe(2);
  });

  it('selectFittestShard picks the shard with the most living particles', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(4), { ...MULTIPLEX_DEFAULTS, cols: 2, rows: 2, variation: 0 }, null);
    // All four shards start with 4 alive → first is fittest.
    selectFittestShard(mx);
    expect(mx.selected).toBe(0);
    // Kill two in shard 1 and three in shard 2 → shard 0 (4 alive) stays fittest.
    mx.shards[1].view[1 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[1].view[2 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[2].view[1 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[2].view[2 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[2].view[3 * PARTICLE_STRIDE + S.DEAD] = 1;
    selectFittestShard(mx);
    expect(mx.selected).toBe(0);
    // Kill all in shard 0 → shard 1 (2 alive) is now fittest.
    for (let p = 0; p < 4; p++) mx.shards[0].view[p * PARTICLE_STRIDE + S.DEAD] = 1;
    selectFittestShard(mx);
    expect(mx.selected).toBe(3); // shard 3 is untouched → 4 alive
  });

  it('autoSelectFittest keeps the fittest shard selected after an auto-iteration', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(4), {
      ...MULTIPLEX_DEFAULTS,
      cols: 2,
      rows: 1,
      variation: 0,
      autoIterate: true,
      autoIterateInterval: 1,
      autoSelectFittest: true,
    }, null);
    mx.shards[1].view[1 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[1].view[2 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[1].view[3 * PARTICLE_STRIDE + S.DEAD] = 1;
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE); // tick 1 → auto-iterate + fittest
    expect(mx.iteration).toBe(1);
    expect(mx.selected).toBe(0); // shard 0 had the most life before rebuild
  });
});

describe('Multiplex live settings (v4.6.16)', () => {
  /** Law state with EXOTHERMIC enabled — deterministic linear energy gain. */
  function exoLaw() {
    const laws = createLawState();
    set(laws, LAW_INDEXES.EXOTHERMIC);
    return laws;
  }

  it('new defaults: sim speed, pause, max iterations, drift present', () => {
    expect(MULTIPLEX_DEFAULTS.simSpeed).toBe(1.0);
    expect(MULTIPLEX_DEFAULTS.paused).toBe(false);
    expect(MULTIPLEX_DEFAULTS.maxIterations).toBe(0);
    expect(MULTIPLEX_DEFAULTS.variationDrift).toBe(0);
    const mx = createMultiplex(null);
    expect(mx.config.simSpeed).toBe(1.0);
    expect(mx.config.paused).toBe(false);
    expect(mx.config.maxIterations).toBe(0);
    expect(mx.config.variationDrift).toBe(0);
  });

  it('paused freezes the shard grid (no stepping, no tick advance)', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(), {
      ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0, paused: true,
    }, null);
    const before = mx.shards[0].view[S.ENERGY];
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE);
    expect(mx.shards[0].view[S.ENERGY]).toBe(before);
    expect(mx.tick).toBe(0);
    expect(mx.shards[0].tick).toBe(0);
  });

  it('simSpeed scales the shard timestep (2× speed → double per-step effect)', () => {
    const run = (simSpeed) => {
      const mx = createMultiplex(null);
      startMultiplex(mx, makeSource(4, exoLaw()), {
        ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0, simSpeed,
      }, null);
      stepMultiplex(mx, 0.25, 1, WORLD_SIZE);
      return mx.shards[0].view[S.ENERGY];
    };
    // With a law that grants +0.05/s, one 0.25s step at 1× gains 0.0125,
    // at 2× gains 0.025 (effDt = dt × simSpeed).
    const slow = run(1.0);
    const fast = run(2.0);
    expect(slow).toBeCloseTo(80.0125, 5);
    expect(fast).toBeCloseTo(80.025, 5);
    expect(fast - slow).toBeCloseTo(0.0125, 5);
  });

  it('maxIterations caps auto-iteration', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(), {
      ...MULTIPLEX_DEFAULTS,
      cols: 2, rows: 1, variation: 0,
      autoIterate: true, autoIterateInterval: 2, maxIterations: 1,
    }, null);
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE); // tick 1
    expect(mx.iteration).toBe(0);
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE); // tick 2 → iterate once
    expect(mx.iteration).toBe(1);
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE); // tick 3
    stepMultiplex(mx, 0.25, 1, WORLD_SIZE); // tick 4 → would iterate, capped
    expect(mx.iteration).toBe(1);
  });

  it('variationDrift raises variation each iteration, capped at 1', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(), {
      ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0.3, variationDrift: 0.05,
    }, null);
    iterateMultiplex(mx);
    expect(mx.config.variation).toBeCloseTo(0.35, 10);
    // Cap: near-full divergence cannot exceed 1.
    const capped = createMultiplex(null);
    startMultiplex(capped, makeSource(), {
      ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0.98, variationDrift: 0.05,
    }, null);
    iterateMultiplex(capped);
    expect(capped.config.variation).toBe(1);
  });
});

describe('Multiplex fitness + iteration (v4.6.24)', () => {
  /** Law state with EXOTHERMIC enabled — deterministic linear energy gain. */
  function exoLaw() {
    const laws = createLawState();
    set(laws, LAW_INDEXES.EXOTHERMIC);
    return laws;
  }

  it('new defaults: pop scale, seed, substeps, keep-selected, iterate mode, import-on-exit', () => {
    expect(MULTIPLEX_DEFAULTS.populationScale).toBe(1);
    expect(MULTIPLEX_DEFAULTS.seed).toBe(0);
    expect(MULTIPLEX_DEFAULTS.substeps).toBe(1);
    expect(MULTIPLEX_DEFAULTS.keepSelected).toBe(false);
    expect(MULTIPLEX_DEFAULTS.selectAfterIterate).toBe('none');
    expect(MULTIPLEX_DEFAULTS.importOnExit).toBe(true);
    const mx = createMultiplex(null);
    expect(mx.config.populationScale).toBe(1);
    expect(mx.config.importOnExit).toBe(true);
    expect(mx.deltaHistory).toEqual([]);
  });

  it('computeShardPopulationCap respects shard count and the POP SCALE knob', () => {
    const single = computeShardPopulationCap(1, 1);
    const many = computeShardPopulationCap(16, 1);
    expect(many).toBeLessThan(single);
    expect(computeShardPopulationCap(16, 0.25)).toBeLessThan(computeShardPopulationCap(16, 1));
    // Floor + ceiling
    expect(single).toBeGreaterThanOrEqual(MIN_SHARD_POPULATION);
    expect(single).toBeLessThanOrEqual(MAX_PARTICLES);
    expect(computeShardPopulationCap(1, 1)).toBe(computeShardPopulationCap(1, 1));
  });

  it('per-aspect variation knobs zero out their aspect at full master variation', () => {
    const laws = createLawState();
    set(laws, LAW_INDEXES.GRAV);
    const source = { ...makeSource(8), laws };
    const mk = (cfg) => {
      const mx = createMultiplex(null);
      startMultiplex(mx, source, {
        ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1,
        variation: 1, randomizeLaws: true, randomizeDNA: true, randomizePopulation: true,
        ...cfg,
      }, null);
      return mx.shards[0];
    };
    const lawBlocked = mk({ lawVariation: 0 });
    expect(lawBlocked.laws.lowFlags[0]).toBe(source.laws.lowFlags[0]);
    expect(lawBlocked.laws.highFlags[0]).toBe(source.laws.highFlags[0]);
    const dnaBlocked = mk({ dnaVariation: 0 });
    let dnaSame = true;
    for (let i = 0; i < dnaBlocked.dna.length; i++) {
      if (dnaBlocked.dna[i] !== source.dna[i]) { dnaSame = false; break; }
    }
    expect(dnaSame).toBe(true);
    const popBlocked = mk({ popVariation: 0 });
    expect(popBlocked.view[0 * PARTICLE_STRIDE + S.POS_X]).toBe(source.view[0]);
  });

  it('substeps: linear-law energy gain with substeps=4 equals substeps=1', () => {
    const run = (substeps) => {
      const mx = createMultiplex(null);
      startMultiplex(mx, makeSource(4, exoLaw()), {
        ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0, substeps,
      }, null);
      stepMultiplex(mx, 0.25, 1, WORLD_SIZE);
      return mx.shards[0].view[S.ENERGY];
    };
    expect(run(1)).toBeCloseTo(80.0125, 5);
    expect(Math.abs(run(4) - run(1))).toBeLessThan(1e-4);
  });

  it('copyShardToWorld copies particles, DNA and laws into the target world', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(5), { ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0 }, null);
    const shard = mx.shards[0];
    const target = makeSource(1);
    target.view.fill(0);
    const res = copyShardToWorld(shard, { view: target.view, dna: target.dna, laws: target.laws });
    expect(res.count).toBe(5);
    expect(res.speciesCount).toBe(2);
    for (let p = 0; p < 5; p++) {
      const b = p * PARTICLE_STRIDE;
      expect(target.view[b + S.POS_X]).toBe(shard.view[b + S.POS_X]);
      expect(target.view[b + S.DEAD]).toBe(shard.view[b + S.DEAD]);
    }
    expect(target.dna[0]).toBe(shard.dna[0]);
    expect(target.laws.lowFlags[0]).toBe(shard.laws.lowFlags[0]);
    expect(target.laws.highFlags[0]).toBe(shard.laws.highFlags[0]);
  });

  it('snapshotShard/restoreShard round-trip view, DNA, laws, counters and PRNG state', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(4), { ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0.3 }, null);
    const shard = mx.shards[0];
    const snap = snapshotShard(shard);
    const prngBefore = shard.prng.next();
    shard.view[0] = 999;
    shard.view[1] = 999;
    shard.dna[0] = 0;
    shard.laws.lowFlags[0] ^= 0xffffffff;
    shard.count = 1;
    shard.offspring = 123;
    restoreShard(shard, snap);
    expect(shard.count).toBe(4);
    expect(shard.offspring).toBe(0);
    expect(shard.view[0]).toBe(snap.view[0]);
    expect(shard.view[1]).toBe(snap.view[1]);
    expect(shard.dna[0]).toBe(snap.dna[0]);
    expect(shard.laws.lowFlags[0]).toBe(snap.laws.lowFlags);
    // PRNG continues from the snapshotted state.
    shard.view[0] = 100;
    const after = shard.prng.next();
    const fresh = new SplitMix32(snap.prngState);
    fresh.next(); // advance past prngBefore's one draw
    expect(after).toBe(prngBefore);
    void fresh;
  });

  it('keepSelected: iterate preserves the selected shard view, DNA and laws exactly', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(6), {
      ...MULTIPLEX_DEFAULTS, cols: 2, rows: 1, variation: 0.5, keepSelected: true,
    }, null);
    selectShard(mx, 1);
    const viewBefore = Array.from(mx.shards[1].view.subarray(0, 6 * PARTICLE_STRIDE));
    const dnaBefore = Array.from(mx.shards[1].dna);
    const lowBefore = mx.shards[1].laws.lowFlags[0];
    iterateMultiplex(mx);
    expect(mx.iteration).toBe(1);
    expect(mx.selected).toBe(1);
    expect(Array.from(mx.shards[1].view.subarray(0, 6 * PARTICLE_STRIDE))).toEqual(viewBefore);
    expect(Array.from(mx.shards[1].dna)).toEqual(dnaBefore);
    expect(mx.shards[1].laws.lowFlags[0]).toBe(lowBefore);
  });

  it("selectFollowShard picks the shard closest to the previous selection (skipping itself)", () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(4), { ...MULTIPLEX_DEFAULTS, cols: 3, rows: 1, variation: 0 }, null);
    // Shard 0 is clearly different (nearly dead); shard 2 is identical to shard 1.
    for (let p = 1; p < 4; p++) mx.shards[0].view[p * PARTICLE_STRIDE + S.DEAD] = 1;
    selectShard(mx, 1);
    const snap = snapshotShard(mx.shards[1]);
    selectFollowShard(mx, snap, 1);
    expect(mx.selected).toBe(2);
  });

  it('fitness weights: energy-only weight picks the highest-energy shard; min-mode picks the lowest', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(4), { ...MULTIPLEX_DEFAULTS, cols: 3, rows: 1, variation: 0 }, null);
    mx.shards[0].view[0 * PARTICLE_STRIDE + S.ENERGY] = 120;
    mx.shards[1].view[0 * PARTICLE_STRIDE + S.ENERGY] = 40;
    mx.shards[2].view[0 * PARTICLE_STRIDE + S.ENERGY] = 200;
    mx.config.fitnessWeights = { ...MULTIPLEX_DEFAULTS.fitnessWeights, energy: 1 };
    selectFittestShard(mx);
    expect(mx.selected).toBe(2);
    mx.config.fitnessModes = { ...MULTIPLEX_DEFAULTS.fitnessModes, energy: 'min' };
    selectFittestShard(mx);
    expect(mx.selected).toBe(1);
  });

  it('getFitnessReport returns per-shard fitness and default weights reproduce alive-only ranking', () => {
    const mx = createMultiplex(null);
    startMultiplex(mx, makeSource(4), { ...MULTIPLEX_DEFAULTS, cols: 2, rows: 2, variation: 0 }, null);
    mx.shards[1].view[1 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[1].view[2 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[2].view[1 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[2].view[2 * PARTICLE_STRIDE + S.DEAD] = 1;
    mx.shards[2].view[3 * PARTICLE_STRIDE + S.DEAD] = 1;
    const report = getFitnessReport(mx);
    expect(report.perShard).toHaveLength(4);
    expect(Array.isArray(report.perShard)).toBe(true);
    expect(typeof report.avgDelta).toBe('number');
    expect(Array.isArray(report.rollingDelta)).toBe(true);
    for (const e of report.perShard) {
      expect(typeof e.fitness).toBe('number');
      expect(Number.isFinite(e.fitness)).toBe(true);
      expect(e.metrics).toHaveProperty('population');
      expect(e.metrics).toHaveProperty('delta');
    }
    // Alive counts: shard0=4, shard1=2, shard2=1, shard3=4.
    const byId = Object.fromEntries(report.perShard.map((e) => [e.id, e]));
    expect(byId[0].fitness).toBeCloseTo(1);
    expect(byId[1].fitness).toBeCloseTo(1 / 3, 6);
    expect(byId[2].fitness).toBeCloseTo(0);
    expect(byId[3].fitness).toBeCloseTo(1);
    selectFittestShard(mx);
    expect(mx.selected).toBe(0);
    // Fitness ranking survives iteration via the default alive-only weights.
    const iter = createMultiplex(null);
    startMultiplex(iter, makeSource(4), {
      ...MULTIPLEX_DEFAULTS, cols: 2, rows: 1, variation: 0,
      autoIterate: true, autoIterateInterval: 1, autoSelectFittest: true,
    }, null);
    iter.shards[1].view[1 * PARTICLE_STRIDE + S.DEAD] = 1;
    iter.shards[1].view[2 * PARTICLE_STRIDE + S.DEAD] = 1;
    iter.shards[1].view[3 * PARTICLE_STRIDE + S.DEAD] = 1;
    stepMultiplex(iter, 0.25, 1, WORLD_SIZE);
    expect(iter.iteration).toBe(1);
    expect(iter.selected).toBe(0);
  });

  it('config seed > 0 makes the shard lineage deterministic', () => {
    const mk = () => {
      const mx = createMultiplex(null);
      startMultiplex(mx, makeSource(4), {
        ...MULTIPLEX_DEFAULTS, cols: 1, rows: 1, variation: 0.5, seed: 42,
      }, null);
      return mx;
    };
    const a = mk();
    const b = mk();
    expect(a.sourceSeed).toBe(42);
    expect(b.sourceSeed).toBe(42);
    expect(Array.from(a.shards[0].view)).toEqual(Array.from(b.shards[0].view));
  });
});
