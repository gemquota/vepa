import { describe, it, expect } from 'vitest';
import {
  PARTICLE_STRIDE, MAX_PARTICLES, STRIDE_INDEXES as S, DNA_RANGES, LAW_INDEXES,
} from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createLawState, set, isSet } from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults } from '../../src/dna/dnaBuffer.js';
import { solve } from '../../src/physics/solver.js';

const WORLD = 2000;
const DT = 0.25;
const rng = () => 0.5;

function makeWorld(count, setup) {
  const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
  const view = buf.view;
  const dna = createDNABuffer();
  loadDefaults(dna, DNA_RANGES);
  for (let i = 0; i < count; i++) {
    const b = i * PARTICLE_STRIDE;
    view[b + S.POS_X] = 1000;
    view[b + S.POS_Y] = 1000;
    view[b + S.POS_Z] = 1000;
    view[b + S.VEL_X] = 0; view[b + S.VEL_Y] = 0; view[b + S.VEL_Z] = 0;
    view[b + S.MASS] = 1.5;
    view[b + S.SPECIES_ID] = 0;
    view[b + S.DEAD] = 0;
    view[b + S.AGE] = 0;
    view[b + S.ENERGY] = 100;
    view[b + S.SIGNAL] = 0;
    view[b + S.HUNGER] = 0;
    view[b + S.ARMOR] = 0;
    view[b + S.TEMPERATURE] = 0;
    view[b + S.RADIUS] = 0.6;
    view[b + S.BOND_PARTNER_1] = -1;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      view[b + S.DNA_CACHE_START + d] = r.default ?? 0;
    }
    if (setup) setup(view, dna, b, i);
  }
  return { view, dna };
}

describe('Batch 04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE (indices 12-15)', () => {
  it('SENESCENCE: particles past age 500 die at a rate set by DEATH_RATE', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.AGE] = 1000;
      v[b + S.DNA_CACHE_START + 11] = 500; // DEATH_RATE → death chance 0.55 > prng 0.5
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.LIFE);
    set(laws, LAW_INDEXES.SENESCENCE);
    expect(isSet(laws, LAW_INDEXES.SENESCENCE)).toBe(true);
    solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.DEAD]).toBe(1);
  });

  it('SENESCENCE gate: without SENESCENCE, old particles survive the tick', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.AGE] = 1000;
      v[b + S.DNA_CACHE_START + 11] = 500;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.LIFE);
    solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.DEAD]).toBe(0);
  });

  it('ENERGY: nearby particles conduct energy toward equilibrium', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      v[b + S.POS_X] = i === 0 ? 1000 : 1050;
      v[b + S.ENERGY] = i === 0 ? 10 : 200;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.ENERGY);
    expect(isSet(laws, LAW_INDEXES.ENERGY)).toBe(true);
    const eCold = view[S.ENERGY];
    const eHot = view[PARTICLE_STRIDE + S.ENERGY];
    solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.ENERGY]).toBeGreaterThan(eCold);               // cold gains
    expect(view[PARTICLE_STRIDE + S.ENERGY]).toBeLessThan(eHot); // hot loses
    expect(view[S.ENERGY] + view[PARTICLE_STRIDE + S.ENERGY])
      .toBeCloseTo(eCold + eHot, 5); // total conserved
  });

  it('ENERGY gate: without ENERGY, energies are untouched', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      v[b + S.POS_X] = i === 0 ? 1000 : 1050;
      v[b + S.ENERGY] = i === 0 ? 10 : 200;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 20; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.ENERGY]).toBe(10);
    expect(view[PARTICLE_STRIDE + S.ENERGY]).toBe(200);
  });

  it('RADIATION: low-armor particles take energy damage over time', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.ENERGY] = 100;
      v[b + S.ARMOR] = 0;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.RADIATION);
    expect(isSet(laws, LAW_INDEXES.RADIATION)).toBe(true);
    for (let t = 0; t < 100; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.ENERGY]).toBeLessThan(100);
    expect(view[S.ENERGY]).toBeCloseTo(98.0, 3); // −0.02/tick × 100
  });

  it('RADIATION: full armor fully shields the particle', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.ENERGY] = 100;
      v[b + S.ARMOR] = 1;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.RADIATION);
    for (let t = 0; t < 100; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.ENERGY]).toBe(100);
  });

  it('RADIATION gate: without RADIATION, energy is untouched', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.ENERGY] = 100;
      v[b + S.ARMOR] = 0;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 100; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.ENERGY]).toBe(100);
  });

  it('GENOTYPE: DNA cache drifts over time under temperature stress', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.DNA_CACHE_START + 12] = 5; // MUTATION
      v[b + S.TEMPERATURE] = 10;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.GENOTYPE);
    expect(isSet(laws, LAW_INDEXES.GENOTYPE)).toBe(true);
    const before = new Float32Array(42);
    before.set(view.subarray(S.DNA_CACHE_START, S.DNA_CACHE_START + 42));
    for (let t = 0; t < 100; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    let changed = 0;
    for (let d = 0; d < 42; d++) {
      if (view[S.DNA_CACHE_START + d] !== before[d]) changed++;
    }
    expect(changed).toBeGreaterThan(0);
  });

  it('GENOTYPE gate: without GENOTYPE, the DNA cache is untouched', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.DNA_CACHE_START + 12] = 5;
      v[b + S.TEMPERATURE] = 10;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    const before = new Float32Array(42);
    before.set(view.subarray(S.DNA_CACHE_START, S.DNA_CACHE_START + 42));
    for (let t = 0; t < 100; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    for (let d = 0; d < 42; d++) {
      expect(view[S.DNA_CACHE_START + d]).toBe(before[d]);
    }
  });
});
