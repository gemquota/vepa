// AUDIT AGENT 4 — Batch 16: RESONANCE(60) / FLUX(61) / IONIZATION(62) / DISCHARGE(63)
import { describe, it, expect } from 'vitest';
import {
  LAW_INDEXES,
  PARTICLE_STRIDE,
  MAX_PARTICLES,
  STRIDE_INDEXES as S,
  DNA_INDEXES as D,
  DNA_RANGES,
} from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createLawState, set, isSet } from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from '../../src/dna/dnaBuffer.js';
import { solve } from '../../src/physics/solver.js';

const WORLD = 2000;
const DT = 0.25;
const rng = () => 0.5;

function makeWorld(count = 2, spacing = 10) {
  const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
  const view = buf.view;
  const dna = createDNABuffer();
  loadDefaults(dna, DNA_RANGES);
  for (let i = 0; i < count; i++) {
    const b = i * PARTICLE_STRIDE;
    view[b + S.POS_X] = 100 + i * spacing;
    view[b + S.POS_Y] = 100;
    view[b + S.POS_Z] = 100;
    view[b + S.VEL_X] = 0;
    view[b + S.VEL_Y] = 0;
    view[b + S.VEL_Z] = 0;
    view[b + S.MASS] = 1.5;
    view[b + S.SPECIES_ID] = i;
    view[b + S.DEAD] = 0;
    view[b + S.ENERGY] = 100;
    view[b + S.RADIUS] = 0.6;
    view[b + S.SIGNAL] = 0;
    view[b + S.MEMORY] = 0;
    view[b + S.CHARGE] = 0;
    view[b + S.TEMPERATURE] = 0;
    view[b + S.SOUL] = 0;
    view[b + S.ALPHA] = 1;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      view[b + S.DNA_CACHE_START + d] = getDNAFloat(dna, i, d, r.min, r.max);
    }
  }
  return { view, dna };
}

function setDNA(view, idx, dnaIndex, value) {
  view[idx * PARTICLE_STRIDE + S.DNA_CACHE_START + dnaIndex] = value;
}

function pairDist(view) {
  const b0 = 0;
  const b1 = PARTICLE_STRIDE;
  return Math.hypot(
    view[b0 + S.POS_X] - view[b1 + S.POS_X],
    view[b0 + S.POS_Y] - view[b1 + S.POS_Y],
    view[b0 + S.POS_Z] - view[b1 + S.POS_Z],
  );
}

describe('Batch 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE', () => {
  it('RESONANCE attracts actively-pulsing particles with matching PULSE_RATE', () => {
    const w = makeWorld(2, 20);
    w.view[S.SIGNAL] = 1.0;
    w.view[PARTICLE_STRIDE + S.SIGNAL] = 1.0;
    setDNA(w.view, 0, D.PULSE_RATE, 0.5);
    setDNA(w.view, 1, D.PULSE_RATE, 0.5);
    const st = createLawState();
    set(st, LAW_INDEXES.RESONANCE);
    expect(isSet(st, LAW_INDEXES.RESONANCE)).toBe(true);
    const d0 = pairDist(w.view);
    for (let t = 0; t < 60; t++) solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(pairDist(w.view)).toBeLessThan(d0 - 0.05);

    // Gate: silent pair (no SIGNAL) → no resonance force, positions stable
    const w2 = makeWorld(2, 20);
    const st2 = createLawState();
    set(st2, LAW_INDEXES.RESONANCE);
    const d20 = pairDist(w2.view);
    for (let t = 0; t < 60; t++) solve(w2.view, 2, PARTICLE_STRIDE, st2, w2.dna, WORLD, DT, rng);
    expect(Math.abs(pairDist(w2.view) - d20)).toBeLessThan(1e-3);
  });

  it('FLUX pushes particles along the stored-charge gradient', () => {
    const w = makeWorld(2, 10);
    w.view[S.CHARGE] = 0.0;
    w.view[PARTICLE_STRIDE + S.CHARGE] = 2.0;
    const st = createLawState();
    set(st, LAW_INDEXES.FLUX);
    expect(isSet(st, LAW_INDEXES.FLUX)).toBe(true);
    const x0 = w.view[S.POS_X];
    for (let t = 0; t < 30; t++) solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(w.view[S.POS_X]).toBeGreaterThan(x0 + 0.5); // lower-charge particle follows gradient

    // Gate: no law → no movement
    const w2 = makeWorld(2, 10);
    w2.view[S.CHARGE] = 0.0;
    w2.view[PARTICLE_STRIDE + S.CHARGE] = 2.0;
    const none = createLawState();
    solve(w2.view, 2, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rng);
    expect(w2.view[S.POS_X]).toBe(100);
  });

  it('IONIZATION strips charge onto particles on hard contact', () => {
    const w = makeWorld(2, 2); // dist 2 ≤ 3 (contact)
    setDNA(w.view, 0, D.POLARITY, 1.0);
    setDNA(w.view, 1, D.POLARITY, 1.0);
    w.view[S.VEL_X] = 1.0;
    w.view[PARTICLE_STRIDE + S.VEL_X] = -1.0; // relSpeed 2
    const st = createLawState();
    set(st, LAW_INDEXES.IONIZATION);
    expect(isSet(st, LAW_INDEXES.IONIZATION)).toBe(true);
    solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(w.view[S.CHARGE]).toBeGreaterThan(0);
    expect(w.view[PARTICLE_STRIDE + S.CHARGE]).toBeGreaterThan(0);

    // Gate: no law → charge stays zero
    const w2 = makeWorld(2, 2);
    setDNA(w2.view, 0, D.POLARITY, 1.0);
    setDNA(w2.view, 1, D.POLARITY, 1.0);
    w2.view[S.VEL_X] = 1.0;
    w2.view[PARTICLE_STRIDE + S.VEL_X] = -1.0;
    const none = createLawState();
    solve(w2.view, 2, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rng);
    expect(w2.view[S.CHARGE]).toBe(0);
    expect(w2.view[PARTICLE_STRIDE + S.CHARGE]).toBe(0);
  });

  it('DISCHARGE converts stored charge into motion and heat, resetting charge', () => {
    const w = makeWorld(1);
    w.view[S.CHARGE] = 1.5;
    w.view[S.TEMPERATURE] = 0.0;
    w.view[S.VEL_X] = 0.0;
    const st = createLawState();
    set(st, LAW_INDEXES.DISCHARGE);
    expect(isSet(st, LAW_INDEXES.DISCHARGE)).toBe(true);
    solve(w.view, 1, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(w.view[S.CHARGE]).toBe(0);
    expect(w.view[S.TEMPERATURE]).toBeGreaterThan(0);
    expect(w.view[S.VEL_X]).not.toBe(0);

    // Gate: no law → charge retained, no heat
    const w2 = makeWorld(1);
    w2.view[S.CHARGE] = 1.5;
    const none = createLawState();
    solve(w2.view, 1, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rng);
    expect(w2.view[S.CHARGE]).toBe(1.5);
    expect(w2.view[S.TEMPERATURE]).toBe(0);
  });
});
