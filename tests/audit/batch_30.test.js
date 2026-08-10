// AUDIT AGENT 4 — Wave 2, Batch 30: UNCERTAINTY(116) / TELEPORT(117) / OBSERVER(118) / PLANCK(119)
import { describe, it, expect } from 'vitest';
import {
  LAW_INDEXES, PARTICLE_STRIDE, MAX_PARTICLES, STRIDE_INDEXES as S, DNA_RANGES,
} from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createLawState, set, isSet } from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults } from '../../src/dna/dnaBuffer.js';
import { solve } from '../../src/physics/solver.js';
import { applyUncertainty, applyTeleport, applyObserver, applyPlanck } from '../../src/physics/lawgroups/quantumLaws.js';

const WORLD = 2000;
const DT = 0.25;
const rngHigh = () => 0.9;
const rngLow = () => 0.0009;
const base = (i) => i * PARTICLE_STRIDE;

function makeWorld(count, spacing = 5) {
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
    view[b + S.AGE] = 0;
    view[b + S.ENERGY] = 100;
    view[b + S.SIGNAL] = 0;
    view[b + S.MEMORY] = 0;
    view[b + S.CHARGE] = 0;
    view[b + S.TEMPERATURE] = 0;
    view[b + S.RADIUS] = 0.6;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      view[b + S.DNA_CACHE_START + d] = r.default ?? 0;
    }
  }
  return { view, dna };
}

describe('Batch 30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK (indices 116-119)', () => {
  it('UNCERTAINTY jitters position and adds a velocity kick', () => {
    // Direct: prng 0.9 → pos +0.4*0.02 = 0.008, kick ax = 0.4*0.05 = 0.02
    const buf = new Float32Array(1 * PARTICLE_STRIDE);
    buf[S.POS_X] = 100; buf[S.POS_Y] = 100; buf[S.POS_Z] = 100;
    const f = applyUncertainty(buf, 0, 1, rngHigh);
    expect(buf[S.POS_X]).toBeCloseTo(100.008, 5);
    expect(f.ax).toBeCloseTo(0.02, 5);

    // Integration: solver k=0.1 → position jitter + velocity kick survive a tick
    const w = makeWorld(1);
    const st = createLawState();
    set(st, LAW_INDEXES.UNCERTAINTY);
    expect(isSet(st, LAW_INDEXES.UNCERTAINTY)).toBe(true);
    solve(w.view, 1, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rngHigh);
    expect(w.view[S.POS_X]).toBeGreaterThan(100 + 0.0001);
    expect(Math.abs(w.view[S.VEL_X])).toBeGreaterThan(0.0001);

    // Gate: no law → frozen
    const w2 = makeWorld(1);
    const none = createLawState();
    solve(w2.view, 1, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rngHigh);
    expect(w2.view[S.POS_X]).toBe(100);
    expect(w2.view[S.VEL_X]).toBe(0);
  });

  it('TELEPORT jumps to a random location and spends ENERGY', () => {
    // Direct: prng 0.9 < 0.002*1000 → jump to 0.9*2000 = 1800, energy spent
    const buf = new Float32Array(1 * PARTICLE_STRIDE);
    buf[S.POS_X] = 100; buf[S.POS_Y] = 100; buf[S.POS_Z] = 100;
    buf[S.ENERGY] = 100;
    const result = applyTeleport(buf, 0, 2000, 1000, rngHigh);
    expect(result).toBeNull();
    expect(buf[S.POS_X]).toBeCloseTo(1800, 3);
    expect(buf[S.ENERGY]).toBeLessThan(100);

    // Integration: solver k=0.5, prng 0.0009 < 0.001 → jump to 0.0009*2000 = 1.8
    const w = makeWorld(1);
    const st = createLawState();
    set(st, LAW_INDEXES.TELEPORT);
    expect(isSet(st, LAW_INDEXES.TELEPORT)).toBe(true);
    solve(w.view, 1, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rngLow);
    expect(w.view[S.POS_X]).toBeCloseTo(1.8, 1);
    expect(w.view[S.ENERGY]).toBeLessThan(90);

    // Gate: no law → position and energy frozen
    const w2 = makeWorld(1);
    const none = createLawState();
    solve(w2.view, 1, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rngLow);
    expect(w2.view[S.POS_X]).toBe(100);
    expect(w2.view[S.ENERGY]).toBe(100);
  });

  it('OBSERVER collapses a neighbour velocity toward the observer and imprints MEMORY', () => {
    // Direct: observer MEMORY 1, VEL 10 → j VEL = 0.1, j MEMORY = 0.1
    const buf = new Float32Array(2 * PARTICLE_STRIDE);
    buf[base(0) + S.MEMORY] = 1;
    buf[base(0) + S.VEL_X] = 10;
    const result = applyObserver(buf, base(0), base(1), 1);
    expect(result).toBeNull();
    expect(buf[base(1) + S.VEL_X]).toBeCloseTo(0.1, 5);
    expect(buf[base(1) + S.MEMORY]).toBeCloseTo(0.1, 5);

    // Integration: solver k=0.5 → neighbour VEL pulled to 0.05, MEMORY imprinted
    const w = makeWorld(2, 5);
    w.view[S.MEMORY] = 1;
    w.view[S.VEL_X] = 10;
    const st = createLawState();
    set(st, LAW_INDEXES.OBSERVER);
    expect(isSet(st, LAW_INDEXES.OBSERVER)).toBe(true);
    solve(w.view, 2, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rngHigh);
    expect(w.view[PARTICLE_STRIDE + S.VEL_X]).toBeGreaterThan(0.01);
    expect(w.view[PARTICLE_STRIDE + S.MEMORY]).toBeGreaterThan(0.05);

    // Gate: no law → neighbour velocity stays 0
    const w2 = makeWorld(2, 5);
    w2.view[S.MEMORY] = 1;
    w2.view[S.VEL_X] = 10;
    const none = createLawState();
    solve(w2.view, 2, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rngHigh);
    expect(w2.view[PARTICLE_STRIDE + S.VEL_X]).toBe(0);
  });

  it('PLANCK quantizes velocity to discrete steps', () => {
    // Direct: q = 0.1 → 0.17 → 0.2, −0.23 → −0.2
    const buf = new Float32Array(1 * PARTICLE_STRIDE);
    buf[S.VEL_X] = 0.17;
    buf[S.VEL_Y] = -0.23;
    const result = applyPlanck(buf, 0, 1);
    expect(result).toBeNull();
    expect(buf[S.VEL_X]).toBeCloseTo(0.2, 5);
    expect(buf[S.VEL_Y]).toBeCloseTo(-0.2, 5);

    // Integration: solver k=0.5 → q = 0.05 → 0.17 → 0.15
    const w = makeWorld(1);
    w.view[S.VEL_X] = 0.17;
    const st = createLawState();
    set(st, LAW_INDEXES.PLANCK);
    expect(isSet(st, LAW_INDEXES.PLANCK)).toBe(true);
    solve(w.view, 1, PARTICLE_STRIDE, st, w.dna, WORLD, DT, rngHigh);
    expect(w.view[S.VEL_X]).toBeCloseTo(0.15, 5);

    // Gate: no law → velocity unchanged
    const w2 = makeWorld(1);
    w2.view[S.VEL_X] = 0.17;
    const none = createLawState();
    solve(w2.view, 1, PARTICLE_STRIDE, none, w2.dna, WORLD, DT, rngHigh);
    expect(w2.view[S.VEL_X]).toBeCloseTo(0.17, 5);
  });
});
