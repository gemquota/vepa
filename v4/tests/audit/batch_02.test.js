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

describe('Batch 02 — COLL / ACCR / PLANETARY / LIFE (indices 4-7)', () => {
  it('COLL: approaching particles bounce — momentum exchange along the normal', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      if (i === 0) { v[b + S.POS_X] = 1000; v[b + S.VEL_X] = 1; }
      else { v[b + S.POS_X] = 1002; v[b + S.VEL_X] = -1; }
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.COLL);
    expect(isSet(laws, LAW_INDEXES.COLL)).toBe(true);
    for (let t = 0; t < 16; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    // Closing speed (v_i − v_j = 2.0) must be reduced by the bounce impulse.
    const closing = view[S.VEL_X] - view[PARTICLE_STRIDE + S.VEL_X];
    expect(closing).toBeLessThan(2.0);
    // Pair must not have crossed: i stays left of j, near contact.
    const sep = view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X];
    expect(sep).toBeGreaterThan(0);
    expect(sep).toBeLessThan(2.0);
  });

  it('COLL gate: without COLL, overlapping particles pass through each other', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      if (i === 0) { v[b + S.POS_X] = 1000; v[b + S.VEL_X] = 1; }
      else { v[b + S.POS_X] = 1002; v[b + S.VEL_X] = -1; }
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 20; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X]).toBeLessThan(0); // crossed
  });

  it('ACCR: a larger body absorbs mass from an overlapping smaller neighbour', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      if (i === 0) { v[b + S.POS_X] = 1000; v[b + S.MASS] = 10; }
      else { v[b + S.POS_X] = 1000.5; v[b + S.MASS] = 1.5; }
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.COLL);
    set(laws, LAW_INDEXES.ACCR);
    expect(isSet(laws, LAW_INDEXES.ACCR)).toBe(true);
    const mBig0 = view[S.MASS];
    const mSmall0 = view[PARTICLE_STRIDE + S.MASS];
    solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    const gained = view[S.MASS] - mBig0;
    const lost = mSmall0 - view[PARTICLE_STRIDE + S.MASS];
    expect(gained).toBeGreaterThan(0);
    expect(lost).toBeGreaterThan(0);
    expect(gained).toBeCloseTo(lost, 6); // mass conserved
  });

  it('ACCR gate: without ACCR, overlapping particles do not exchange mass', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      if (i === 0) { v[b + S.POS_X] = 1000; v[b + S.MASS] = 10; }
      else { v[b + S.POS_X] = 1000.5; v[b + S.MASS] = 1.5; }
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.COLL);
    solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.MASS]).toBe(10);
    expect(view[PARTICLE_STRIDE + S.MASS]).toBe(1.5);
  });

  it('PLANETARY: particles are pulled toward the world centre', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.POS_X] = 100; v[b + S.POS_Y] = 100; v[b + S.POS_Z] = 100;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.PLANETARY);
    expect(isSet(laws, LAW_INDEXES.PLANETARY)).toBe(true);
    const center = WORLD / 2;
    const d0 = Math.hypot(view[S.POS_X] - center, view[S.POS_Y] - center, view[S.POS_Z] - center);
    for (let t = 0; t < 200; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    const d1 = Math.hypot(view[S.POS_X] - center, view[S.POS_Y] - center, view[S.POS_Z] - center);
    expect(d1).toBeLessThan(d0);
    expect(view[S.VEL_X]).toBeGreaterThan(0); // drift toward +x centre
    expect(view[S.VEL_Y]).toBeGreaterThan(0); // drift toward +y centre
    expect(view[S.VEL_Z]).toBeGreaterThan(0); // drift toward +z centre
  });

  it('PLANETARY gate: without PLANETARY, no central pull', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.POS_X] = 100; v[b + S.POS_Y] = 100; v[b + S.POS_Z] = 100;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 200; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.VEL_X]).toBe(0);
    expect(view[S.POS_X]).toBe(100);
  });

  it('LIFE: metabolic energy decay (ENERGY_EFFICIENCY=0 ⇒ −0.01/tick)', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.DNA_CACHE_START + 34] = 0; // ENERGY_EFFICIENCY
      v[b + S.DNA_CACHE_START + 12] = 1e-6; // MUTATION → negligible bio-pulse noise
      v[b + S.ENERGY] = 100;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.LIFE);
    expect(isSet(laws, LAW_INDEXES.LIFE)).toBe(true);
    for (let t = 0; t < 100; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.ENERGY]).toBeLessThan(100);
    expect(view[S.ENERGY]).toBeCloseTo(99.0, 3);
  });

  it('LIFE: starvation kills when HUNGER exceeds the cap', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.HUNGER] = 100;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.LIFE);
    solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.DEAD]).toBe(1);
  });

  it('LIFE gate: without LIFE, energy is untouched', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.ENERGY] = 100;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 20; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, rng);
    expect(view[S.ENERGY]).toBe(100);
  });
});
