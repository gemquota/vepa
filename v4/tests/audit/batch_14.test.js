// AUDIT AGENT 4 — Batch 14: COMMS(52) / CHARGE_LAW(53) / FIELD(54) / CURRENT(55)
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
    view[b + S.AGE] = 0;
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

describe('Batch 14 — COMMS / CHARGE_LAW / FIELD / CURRENT', () => {
  it('COMMS emits signals over time and stays frozen when off', () => {
    // Emission: COMMS on → oscillator pulses accumulate into SIGNAL
    const w = makeWorld(4, 40);
    const st = createLawState();
    set(st, LAW_INDEXES.COMMS);
    expect(isSet(st, LAW_INDEXES.COMMS)).toBe(true);
    for (let t = 0; t < 120; t++) solve(w.view, 4, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    let emitted = 0;
    for (let i = 0; i < 4; i++) {
      if (w.view[i * PARTICLE_STRIDE + S.SIGNAL] > 1e-6) emitted++;
    }
    expect(emitted).toBeGreaterThan(0);

    // Gating: COMMS off (zero laws) → signals stay exactly as they were
    const w2 = makeWorld(2);
    w2.view[S.SIGNAL] = 0.5;
    const none = createLawState();
    solve(w2.view, 2, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rng);
    expect(w2.view[S.SIGNAL]).toBe(0.5);
    expect(w2.view[S.MEMORY]).toBe(0);
  });

  it('COMMS exchanges signal to a neighbour within radius', () => {
    const w = makeWorld(2, 20); // 20 apart — inside NEIGHBORHOOD_RADIUS (120)
    w.view[S.SIGNAL] = 1.0;
    w.view[S.AGE] = 0;
    w.view[PARTICLE_STRIDE + S.AGE] = 0;
    const st = createLawState();
    set(st, LAW_INDEXES.COMMS);
    for (let t = 0; t < 10; t++) solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(w.view[PARTICLE_STRIDE + S.SIGNAL]).toBeGreaterThan(0.1);
  });

  it('CHARGE_LAW repels like charges and attracts opposite charges', () => {
    // Like charges repel
    const w = makeWorld(2, 10);
    setDNA(w.view, 0, D.POLARITY, 1);
    setDNA(w.view, 1, D.POLARITY, 1);
    const st = createLawState();
    set(st, LAW_INDEXES.CHARGE_LAW);
    expect(isSet(st, LAW_INDEXES.CHARGE_LAW)).toBe(true);
    const d0 = pairDist(w.view);
    for (let t = 0; t < 60; t++) solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(pairDist(w.view)).toBeGreaterThan(d0 + 0.05);

    // Opposite charges attract
    const w2 = makeWorld(2, 10);
    setDNA(w2.view, 0, D.POLARITY, 1);
    setDNA(w2.view, 1, D.POLARITY, -1);
    const st2 = createLawState();
    set(st2, LAW_INDEXES.CHARGE_LAW);
    const d20 = pairDist(w2.view);
    for (let t = 0; t < 60; t++) solve(w2.view, 2, PARTICLE_STRIDE, st2, w2.dna, WORLD, DT, rng);
    expect(pairDist(w2.view)).toBeLessThan(d20 - 0.05);

    // Gate: no law → nothing moves
    const w3 = makeWorld(2, 10);
    setDNA(w3.view, 0, D.POLARITY, 1);
    setDNA(w3.view, 1, D.POLARITY, 1);
    const none = createLawState();
    solve(w3.view, 2, PARTICLE_STRIDE, none, w3.dna, WORLD, DT, rng);
    expect(w3.view[S.VEL_X]).toBe(0);
  });

  it('FIELD drifts particles along their POLARITY sign', () => {
    // Positive polarity → +y drift
    const w = makeWorld(2, 10);
    setDNA(w.view, 0, D.POLARITY, 1);
    const st = createLawState();
    set(st, LAW_INDEXES.FIELD);
    expect(isSet(st, LAW_INDEXES.FIELD)).toBe(true);
    solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(w.view[S.VEL_Y]).toBeGreaterThan(0);

    // Negative polarity → −y drift
    const w2 = makeWorld(2, 10);
    setDNA(w2.view, 0, D.POLARITY, -1);
    const st2 = createLawState();
    set(st2, LAW_INDEXES.FIELD);
    solve(w2.view, 2, PARTICLE_STRIDE, st2, w2.dna, WORLD, DT, rng);
    expect(w2.view[S.VEL_Y]).toBeLessThan(0);

    // Gate: no law → velocity stays zero
    const w3 = makeWorld(2, 10);
    setDNA(w3.view, 0, D.POLARITY, 1);
    const none = createLawState();
    solve(w3.view, 2, PARTICLE_STRIDE, none, w3.dna, WORLD, DT, rng);
    expect(w3.view[S.VEL_Y]).toBe(0);
  });

  it('CURRENT diffuses stored charge between conductive neighbours', () => {
    const w = makeWorld(2, 10);
    w.view[S.CHARGE] = 2.0;
    w.view[PARTICLE_STRIDE + S.CHARGE] = 0.0;
    setDNA(w.view, 0, D.CONDUCTIVITY, 1.0);
    setDNA(w.view, 1, D.CONDUCTIVITY, 1.0);
    const st = createLawState();
    set(st, LAW_INDEXES.CURRENT);
    expect(isSet(st, LAW_INDEXES.CURRENT)).toBe(true);
    for (let t = 0; t < 10; t++) solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rng);
    expect(w.view[S.CHARGE]).toBeLessThan(2.0);
    expect(w.view[PARTICLE_STRIDE + S.CHARGE]).toBeGreaterThan(0.0);
    expect(Math.abs(w.view[S.CHARGE] - w.view[PARTICLE_STRIDE + S.CHARGE])).toBeLessThan(0.5);

    // Gate: no law → charge stays put
    const w2 = makeWorld(2, 10);
    w2.view[S.CHARGE] = 2.0;
    setDNA(w2.view, 0, D.CONDUCTIVITY, 1.0);
    setDNA(w2.view, 1, D.CONDUCTIVITY, 1.0);
    const none = createLawState();
    solve(w2.view, 2, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rng);
    expect(w2.view[S.CHARGE]).toBe(2.0);
    expect(w2.view[PARTICLE_STRIDE + S.CHARGE]).toBe(0.0);
  });
});
