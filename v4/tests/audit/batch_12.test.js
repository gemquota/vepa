import { describe, it, expect } from 'vitest';
import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_RANGES, LAW_INDEXES, MAX_PARTICLES } from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createLawState, set, isSet } from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from '../../src/dna/dnaBuffer.js';
import { applyCondense, applyDeposit, applyExothermic, applyTelepathy } from '../../src/physics/laws.js';
import { solve } from '../../src/physics/solver.js';

const WORLD = 2000;
const DT = 0.25;
const rng = () => 0.5;

function view(n) {
  return new Float32Array(n * PARTICLE_STRIDE);
}

function seed(buf, n) {
  for (let i = 0; i < n; i++) {
    const b = i * PARTICLE_STRIDE;
    buf[b + S.POS_X] = 100;
    buf[b + S.POS_Y] = 100;
    buf[b + S.POS_Z] = 100;
    buf[b + S.VEL_X] = 0;
    buf[b + S.VEL_Y] = 0;
    buf[b + S.VEL_Z] = 0;
    buf[b + S.MASS] = 1.5;
    buf[b + S.RADIUS] = 0.6;
    buf[b + S.ENERGY] = 100;
    buf[b + S.DEAD] = 0;
    buf[b + S.SPECIES_ID] = 0;
    buf[b + S.TEMPERATURE] = 0;
    buf[b + S.SIGNAL] = 0;
  }
}

function makeWorld(count, mutate) {
  const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
  const v = buf.view;
  const dna = createDNABuffer();
  loadDefaults(dna, DNA_RANGES);
  for (let i = 0; i < count; i++) {
    const b = i * PARTICLE_STRIDE;
    v[b + S.POS_X] = 100 + (i % 4) * 50;
    v[b + S.POS_Y] = 100 + Math.floor(i / 4) * 50;
    v[b + S.POS_Z] = 100;
    v[b + S.VEL_X] = 0;
    v[b + S.VEL_Y] = 0;
    v[b + S.VEL_Z] = 0;
    v[b + S.MASS] = 1.5;
    v[b + S.SPECIES_ID] = i % 3;
    v[b + S.DEAD] = 0;
    v[b + S.ENERGY] = 100;
    v[b + S.RADIUS] = 0.6;
    v[b + S.TEMPERATURE] = 0;
    v[b + S.SIGNAL] = 0;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      v[b + S.DNA_CACHE_START + d] = getDNAFloat(dna, i % 3, d, r.min, r.max);
    }
  }
  if (mutate) mutate(v, dna);
  return { view: v, dna };
}

describe('Batch 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY', () => {
  it('CONDENSE (44): cool particles gain mass, gated by isSet', () => {
    const buf = view(1);
    seed(buf, 1);
    buf[S.TEMPERATURE] = 0.0;
    const state = createLawState();
    set(state, LAW_INDEXES.CONDENSE);
    expect(isSet(state, LAW_INDEXES.CONDENSE)).toBe(true);
    applyCondense(state, buf, 0, 1, 1);
    expect(buf[S.MASS]).toBeCloseTo(1.5015, 5); // 1.5 + 0.3*0.005
    expect(buf[S.TEMPERATURE]).toBeCloseTo(0.00015, 5);
    // above threshold (0.3) → unchanged
    const warm = view(1);
    seed(warm, 1);
    warm[S.TEMPERATURE] = 0.5;
    applyCondense(state, warm, 0, 1, 1);
    expect(warm[S.MASS]).toBe(1.5);
    // gate off → unchanged
    const off = view(1);
    seed(off, 1);
    off[S.TEMPERATURE] = 0.0;
    applyCondense(createLawState(), off, 0, 1, 1);
    expect(off[S.MASS]).toBe(1.5);
  });

  it('CONDENSE integration: cold particle accretes mass in solve()', () => {
    const on = makeWorld(1, (v) => {
      v[S.TEMPERATURE] = 0.0;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.CONDENSE);
    solve(on.view, 1, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.MASS]).toBeGreaterThan(1.5);

    const off = makeWorld(1, (v) => {
      v[S.TEMPERATURE] = 0.0;
    });
    solve(off.view, 1, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.MASS]).toBe(1.5);
  });

  it('DEPOSIT (45): cold particles gain mass and radius, gated by isSet', () => {
    const buf = view(1);
    seed(buf, 1);
    buf[S.TEMPERATURE] = 0.0;
    const state = createLawState();
    set(state, LAW_INDEXES.DEPOSIT);
    expect(isSet(state, LAW_INDEXES.DEPOSIT)).toBe(true);
    applyDeposit(state, buf, 0, 1, 1);
    expect(buf[S.MASS]).toBeCloseTo(1.506, 5); // 1.5 + 0.2*0.01*3
    expect(buf[S.RADIUS]).toBeCloseTo(0.601, 5); // 0.6 + 0.002*0.5
    // above threshold (0.2) → unchanged
    const warm = view(1);
    seed(warm, 1);
    warm[S.TEMPERATURE] = 0.5;
    applyDeposit(state, warm, 0, 1, 1);
    expect(warm[S.MASS]).toBe(1.5);
    // gate off → unchanged
    const off = view(1);
    seed(off, 1);
    off[S.TEMPERATURE] = 0.0;
    applyDeposit(createLawState(), off, 0, 1, 1);
    expect(off[S.MASS]).toBe(1.5);
  });

  it('DEPOSIT integration: cold particle grows in solve()', () => {
    const on = makeWorld(1, (v) => {
      v[S.TEMPERATURE] = 0.0;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.DEPOSIT);
    solve(on.view, 1, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.MASS]).toBeGreaterThan(1.5);

    const off = makeWorld(1, (v) => {
      v[S.TEMPERATURE] = 0.0;
    });
    solve(off.view, 1, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.MASS]).toBe(1.5);
  });

  it('EXOTHERMIC (46): energy amplification, gated by isSet', () => {
    const buf = view(1);
    seed(buf, 1);
    const state = createLawState();
    set(state, LAW_INDEXES.EXOTHERMIC);
    expect(isSet(state, LAW_INDEXES.EXOTHERMIC)).toBe(true);
    applyExothermic(state, buf, 0, 1);
    expect(buf[S.ENERGY]).toBeCloseTo(110, 5); // 100 * (1 + 0.1)
    // gate off → unchanged
    const off = view(1);
    seed(off, 1);
    applyExothermic(createLawState(), off, 0, 1);
    expect(off[S.ENERGY]).toBe(100);
  });

  it('EXOTHERMIC integration: energy grows in solve() only when enabled', () => {
    const on = makeWorld(1);
    const st = createLawState();
    set(st, LAW_INDEXES.EXOTHERMIC);
    solve(on.view, 1, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.ENERGY]).toBeGreaterThan(100);

    const off = makeWorld(1);
    solve(off.view, 1, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.ENERGY]).toBe(100);
  });

  it('TELEPATHY (47): same-species signal sharing, gated by isSet', () => {
    const buf = view(2);
    seed(buf, 2);
    buf[PARTICLE_STRIDE + S.SIGNAL] = 0.5;
    const state = createLawState();
    set(state, LAW_INDEXES.TELEPATHY);
    expect(isSet(state, LAW_INDEXES.TELEPATHY)).toBe(true);
    applyTelepathy(state, buf, 0, PARTICLE_STRIDE, 10000, 1);
    expect(buf[S.SIGNAL]).toBeCloseTo(0.025, 5); // 0.5 * 0.05
    // different species → no transfer
    const buf2 = view(2);
    seed(buf2, 2);
    buf2[PARTICLE_STRIDE + S.SIGNAL] = 0.5;
    buf2[PARTICLE_STRIDE + S.SPECIES_ID] = 1;
    applyTelepathy(state, buf2, 0, PARTICLE_STRIDE, 10000, 1);
    expect(buf2[S.SIGNAL]).toBe(0);
    // tiny signal below 0.001 transfer threshold → no change
    const buf3 = view(2);
    seed(buf3, 2);
    buf3[PARTICLE_STRIDE + S.SIGNAL] = 0.01;
    applyTelepathy(state, buf3, 0, PARTICLE_STRIDE, 10000, 1);
    expect(buf3[S.SIGNAL]).toBe(0);
    // gate off → no transfer
    const buf4 = view(2);
    seed(buf4, 2);
    buf4[PARTICLE_STRIDE + S.SIGNAL] = 0.5;
    applyTelepathy(createLawState(), buf4, 0, PARTICLE_STRIDE, 10000, 1);
    expect(buf4[S.SIGNAL]).toBe(0);
  });

  it('TELEPATHY integration: signal propagates between same-species particles', () => {
    const on = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
      v[PARTICLE_STRIDE + S.SIGNAL] = 0.5;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.TELEPATHY);
    solve(on.view, 2, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.SIGNAL]).toBeGreaterThan(0);

    const off = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
      v[PARTICLE_STRIDE + S.SIGNAL] = 0.5;
    });
    solve(off.view, 2, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.SIGNAL]).toBe(0);
  });
});
