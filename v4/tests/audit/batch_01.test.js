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

// Deterministic LCG so the ENTR jitter test is reproducible.
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

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

describe('Batch 01 — GRAV / DRAG / ENTR / WRAP (indices 0-3)', () => {
  it('GRAV: particles accelerate toward each other and separation decreases', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      v[b + S.POS_X] = i === 0 ? 995 : 1005;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.GRAV);
    expect(isSet(laws, LAW_INDEXES.GRAV)).toBe(true);
    const d0 = view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X];
    for (let t = 0; t < 5; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    const d1 = view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X];
    expect(d1).toBeLessThan(d0);
    expect(view[S.VEL_X]).toBeGreaterThan(0);              // i pulled toward j (+x)
    expect(view[PARTICLE_STRIDE + S.VEL_X]).toBeLessThan(0); // j pulled toward i (-x)
  });

  it('GRAV gate: with GRAV off, resting particles never move', () => {
    const { view, dna } = makeWorld(2, (v, dna, b, i) => {
      v[b + S.POS_X] = i === 0 ? 995 : 1005;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 20; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.VEL_X]).toBe(0);
    expect(view[PARTICLE_STRIDE + S.VEL_X]).toBe(0);
    expect(view[PARTICLE_STRIDE + S.POS_X] - view[S.POS_X]).toBeCloseTo(10, 5);
  });

  it('DRAG: velocity decays over time (viscosity damping)', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.VEL_X] = 5;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.DRAG);
    set(laws, LAW_INDEXES.WRAP);
    const v0 = view[S.VEL_X];
    for (let t = 0; t < 60; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(Math.abs(view[S.VEL_X])).toBeLessThan(Math.abs(v0));
    expect(view[S.VEL_X]).toBeGreaterThan(0); // decays, does not reverse
  });

  it('DRAG gate: without DRAG, velocity is preserved exactly', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.VEL_X] = 5;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 60; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.VEL_X]).toBeCloseTo(5, 5);
  });

  it('ENTR: jitter injects random kinetic energy (velocity leaves zero)', () => {
    const { view, dna } = makeWorld(2, (v, dna, b) => {
      v[b + S.DNA_CACHE_START + 3] = 5; // JITTER
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.ENTR);
    set(laws, LAW_INDEXES.WRAP);
    const prng = lcg(12345);
    for (let t = 0; t < 80; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, prng);
    const speed = Math.hypot(view[S.VEL_X], view[S.VEL_Y], view[S.VEL_Z]);
    expect(speed).toBeGreaterThan(0.2);
  });

  it('ENTR gate: without ENTR, no force means velocity stays zero', () => {
    const { view, dna } = makeWorld(2, (v, dna, b) => {
      v[b + S.DNA_CACHE_START + 3] = 5;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    const prng = lcg(12345);
    for (let t = 0; t < 80; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, prng);
    expect(view[S.VEL_X]).toBe(0);
    expect(view[S.VEL_Y]).toBe(0);
  });

  it('WRAP: particles crossing the edge reappear on the opposite side', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.POS_X] = WORLD - 5;
      v[b + S.VEL_X] = 10;
    });
    const laws = createLawState();
    set(laws, LAW_INDEXES.WRAP);
    for (let t = 0; t < 3; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.POS_X]).toBeGreaterThan(0);
    expect(view[S.POS_X]).toBeLessThan(10);
  });

  it('WRAP gate: without WRAP, edges reflect (clamp + velocity flip)', () => {
    const { view, dna } = makeWorld(1, (v, dna, b) => {
      v[b + S.POS_X] = WORLD - 5;
      v[b + S.VEL_X] = 10;
    });
    const laws = createLawState();
    // GLOW with zero SIGNAL keeps the sim running without adding any force.
    set(laws, LAW_INDEXES.GLOW);
    for (let t = 0; t < 3; t++) solve(view, 1, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng);
    expect(view[S.POS_X]).toBeGreaterThan(WORLD - 2);
    expect(view[S.VEL_X]).toBeLessThan(0);
  });
});
