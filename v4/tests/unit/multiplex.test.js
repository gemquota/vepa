import { describe, it, expect } from 'vitest';
import {
  WORLD_SIZE,
  PARTICLE_STRIDE,
  MAX_PARTICLES,
  STRIDE_INDEXES,
} from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createDNABuffer } from '../../src/dna/dnaBuffer.js';
import { createLawState } from '../../src/state/lawState.js';
import {
  createMultiplex,
  startMultiplex,
  stopMultiplex,
  iterateMultiplex,
  stepMultiplex,
  selectShard,
  MULTIPLEX_DEFAULTS,
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
});
