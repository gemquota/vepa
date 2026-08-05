import { describe, it, expect } from 'vitest';
import {
  PARTICLE_STRIDE, MAX_PARTICLES, STRIDE_INDEXES as S, DNA_RANGES, LAW_INDEXES,
} from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createLawState, set, isSet } from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults } from '../../src/dna/dnaBuffer.js';
import { solve, drainOffspring, resetOffspringRing } from '../../src/physics/solver.js';

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

describe('Batch 03 — GLOW / AFFINITY / REPRO / TRACK (indices 8-11)', () => {
  it('GLOW: signaling particles regenerate energy', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.SIGNAL] = 1;
      v[b + S.ENERGY] = 50;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.GLOW);
    expect(isSet(laws, LAW_INDEXES.GLOW)).toBe(true);
    for (let t = 0; t < 100; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.ENERGY]).toBeGreaterThan(50);
    expect(view[S.ENERGY]).toBeCloseTo(51.0, 3); // +0.01/tick × 100
  });

  it('GLOW gate: without GLOW, energy is untouched', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.SIGNAL] = 1;
      v[b + S.ENERGY] = 50;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 100; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.ENERGY]).toBe(50);
  });

  it('AFFINITY: same-species particles with positive affinity attract', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      v[b + S.POS_X] = i === 0 ? 950 : 1050;
      v[b + S.DNA_CACHE_START + 41] = 1; // SPECIES_AFFINITY
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.AFFINITY);
    expect(isSet(laws, LAW_INDEXES.AFFINITY)).toBe(true);
    const d0 = view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X];
    for (let t = 0; t < 80; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    const d1 = view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X];
    expect(d1).toBeLessThan(d0);
    expect(view[S.VEL_X]).toBeGreaterThan(0);               // pulled toward j
    expect(view[PARTICLE_STRIDE + S.VEL_X]).toBeLessThan(0); // pulled toward i
  });

  it('AFFINITY gate: without AFFINITY, separation is unchanged', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      v[b + S.POS_X] = i === 0 ? 950 : 1050;
      v[b + S.DNA_CACHE_START + 41] = 1;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 80; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X]).toBeCloseTo(100, 5);
  });

  it('REPRO: mature, high-energy particles spawn offspring', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.AGE] = 500;
      v[b + S.ENERGY] = 100;
      v[b + S.DNA_CACHE_START + 10] = 100; // BIRTH_RATE
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.REPRO);
    expect(isSet(laws, LAW_INDEXES.REPRO)).toBe(true);
    resetOffspringRing();
    solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    const kids = drainOffspring();
    expect(kids).toHaveLength(1);
    expect(kids[0].parentId).toBe(0);
    expect(kids[0].energy).toBe(60);
    expect(view[S.ENERGY]).toBe(50); // parent pays half its energy
  });

  it('REPRO gate: without REPRO, no offspring are produced', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.AGE] = 500;
      v[b + S.ENERGY] = 100;
      v[b + S.DNA_CACHE_START + 10] = 100;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    resetOffspringRing();
    solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(drainOffspring()).toHaveLength(0);
  });

  it('TRACK: predators chase lower-mass prey', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      if (i === 0) {
        v[b + S.POS_X] = 950;
        v[b + S.MASS] = 2.0;
        v[b + S.DNA_CACHE_START + 36] = 1; // PREDATION_BIAS
      } else {
        v[b + S.POS_X] = 1050;
        v[b + S.MASS] = 1.0;
      }
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.TRACK);
    expect(isSet(laws, LAW_INDEXES.TRACK)).toBe(true);
    const d0 = view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X];
    for (let t = 0; t < 100; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    const d1 = view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X];
    expect(d1).toBeLessThan(d0);
    expect(view[S.VEL_X]).toBeGreaterThan(0); // predator accelerated toward prey
  });

  it('TRACK gate: without TRACK, predators do not chase', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      if (i === 0) {
        v[b + S.POS_X] = 950;
        v[b + S.MASS] = 2.0;
        v[b + S.DNA_CACHE_START + 36] = 1;
      } else {
        v[b + S.POS_X] = 1050;
        v[b + S.MASS] = 1.0;
      }
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 100; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.VEL_X]).toBe(0);
    expect(view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X]).toBeCloseTo(100, 5);
  });
});
