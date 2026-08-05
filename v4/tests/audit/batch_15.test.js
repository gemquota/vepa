// AUDIT AGENT 4 — Batch 15: RESISTANCE(56) / CAPACITANCE(57) / INDUCTANCE(58) / MAGNETISM(59)
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

describe('Batch 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM', () => {
  it('RESISTANCE damps fast motion and converts it into heat', () => {
    const w = makeWorld(1);
    w.view[S.VEL_X] = 5.0;
    w.view[S.TEMPERATURE] = 0.0;
    const st = createLawState();
    set(st, LAW_INDEXES.RESISTANCE);
    expect(isSet(st, LAW_INDEXES.RESISTANCE)).toBe(true);
    const v0 = w.view[S.VEL_X];
    for (let t = 0; t < 10; t++) solve(w.view, 1, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(Math.abs(w.view[S.VEL_X])).toBeLessThan(Math.abs(v0));
    expect(w.view[S.TEMPERATURE]).toBeGreaterThan(0);

    // Gate: no law → velocity and temperature unchanged
    const w2 = makeWorld(1);
    w2.view[S.VEL_X] = 5.0;
    const none = createLawState();
    for (let t = 0; t < 10; t++) solve(w2.view, 1, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rng);
    expect(w2.view[S.VEL_X]).toBe(5.0);
    expect(w2.view[S.TEMPERATURE]).toBe(0.0);
  });

  it('CAPACITANCE stores surplus energy as charge and bleeds it when low', () => {
    // ENERGY 100 > 50 → charge accrues
    const w = makeWorld(1);
    w.view[S.ENERGY] = 100;
    const st = createLawState();
    set(st, LAW_INDEXES.CAPACITANCE);
    expect(isSet(st, LAW_INDEXES.CAPACITANCE)).toBe(true);
    for (let t = 0; t < 20; t++) solve(w.view, 1, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(w.view[S.CHARGE]).toBeGreaterThan(0.5);

    // ENERGY 30 < 50 → charge bleeds toward zero
    const w2 = makeWorld(1);
    w2.view[S.ENERGY] = 30;
    w2.view[S.CHARGE] = 1.0;
    const st2 = createLawState();
    set(st2, LAW_INDEXES.CAPACITANCE);
    for (let t = 0; t < 20; t++) solve(w2.view, 1, PARTICLE_STRIDE, st2, w2.dna, WORLD, DT, rng);
    expect(w2.view[S.CHARGE]).toBeLessThan(1.0);
  });

  it('CAPACITANCE stored charge produces a pairwise repulsion force', () => {
    const w = makeWorld(2, 10);
    w.view[S.CHARGE] = 1.0;
    w.view[PARTICLE_STRIDE + S.CHARGE] = 1.0;
    const st = createLawState();
    set(st, LAW_INDEXES.CAPACITANCE);
    const d0 = pairDist(w.view);
    for (let t = 0; t < 60; t++) solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(pairDist(w.view)).toBeGreaterThan(d0 + 0.02);
  });

  it('INDUCTANCE aligns neighbour velocities (relative motion damps)', () => {
    const w = makeWorld(2, 10);
    w.view[S.VEL_X] = 3.0;
    w.view[PARTICLE_STRIDE + S.VEL_X] = -3.0;
    const st = createLawState();
    set(st, LAW_INDEXES.INDUCTANCE);
    expect(isSet(st, LAW_INDEXES.INDUCTANCE)).toBe(true);
    const rel0 = Math.abs(w.view[S.VEL_X] - w.view[PARTICLE_STRIDE + S.VEL_X]);
    for (let t = 0; t < 20; t++) solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    const rel1 = Math.abs(w.view[S.VEL_X] - w.view[PARTICLE_STRIDE + S.VEL_X]);
    expect(rel1).toBeLessThan(rel0 * 0.5);

    // Gate: no law → relative velocity preserved
    const w2 = makeWorld(2, 10);
    w2.view[S.VEL_X] = 3.0;
    w2.view[PARTICLE_STRIDE + S.VEL_X] = -3.0;
    const none = createLawState();
    for (let t = 0; t < 20; t++) solve(w2.view, 2, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rng);
    expect(Math.abs(w2.view[S.VEL_X] - w2.view[PARTICLE_STRIDE + S.VEL_X])).toBe(6.0);
  });

  it('MAGNETISM attracts aligned moments and repels opposing moments', () => {
    // Aligned (+1, +1) → attract
    const w = makeWorld(2, 10);
    setDNA(w.view, 0, D.MAGNETIC_MOMENT, 1.0);
    setDNA(w.view, 1, D.MAGNETIC_MOMENT, 1.0);
    const st = createLawState();
    set(st, LAW_INDEXES.MAGNETISM);
    expect(isSet(st, LAW_INDEXES.MAGNETISM)).toBe(true);
    const d0 = pairDist(w.view);
    for (let t = 0; t < 60; t++) solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(pairDist(w.view)).toBeLessThan(d0 - 0.02);

    // Opposing (+1, -1) → repel
    const w2 = makeWorld(2, 10);
    setDNA(w2.view, 0, D.MAGNETIC_MOMENT, 1.0);
    setDNA(w2.view, 1, D.MAGNETIC_MOMENT, -1.0);
    const st2 = createLawState();
    set(st2, LAW_INDEXES.MAGNETISM);
    const d20 = pairDist(w2.view);
    for (let t = 0; t < 60; t++) solve(w2.view, 2, PARTICLE_STRIDE, st2, w2.dna, WORLD, DT, rng);
    expect(pairDist(w2.view)).toBeGreaterThan(d20 + 0.02);
  });
});
