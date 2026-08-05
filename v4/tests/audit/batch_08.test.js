import { describe, it, expect } from 'vitest';
import {
  LAW_INDEXES,
  PARTICLE_STRIDE,
  STRIDE_INDEXES as S,
  MAX_PARTICLES,
  DNA_RANGES,
} from '../../src/constants.js';
import { createLawState, set, isSet } from '../../src/state/lawState.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from '../../src/dna/dnaBuffer.js';
import { solve } from '../../src/physics/solver.js';
import {
  applyPhaseRadiation,
  applySublimation,
  applyTimeDilation,
  applyDimensionality,
} from '../../src/physics/laws.js';

const WORLD = 2000;
const DT = 0.25;

function view(n) {
  return new Float32Array(n * PARTICLE_STRIDE);
}

function lawsOn(...names) {
  const st = createLawState();
  for (const name of names) set(st, LAW_INDEXES[name]);
  return st;
}

function makeWorld(count, opts = {}) {
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
    v[b + S.ENERGY] = opts.energy ?? 100;
    v[b + S.TEMPERATURE] = opts.temperature ?? 0;
    v[b + S.CHARGE] = opts.charge ?? 0;
    v[b + S.SOUL] = opts.soul ?? 0;
    v[b + S.RADIUS] = 0.6;
    v[b + S.BOND_PARTNER_1] = -1;
    v[b + S.BOND_PARTNER_2] = -1;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      v[b + S.DNA_CACHE_START + d] = getDNAFloat(dna, i % 3, d, r.min, r.max);
    }
  }
  return { view: v, dna };
}

describe('Batch 08 audit — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY', () => {
  describe('PHASE_RADIATION (28)', () => {
    it('gates: energy/temperature/signal unchanged without the law', () => {
      const buf = view(1);
      buf[S.TEMPERATURE] = 1;
      buf[S.ENERGY] = 100;
      applyPhaseRadiation(createLawState(), buf, 0, 1, 1);
      expect(buf[S.ENERGY]).toBe(100);
      expect(buf[S.TEMPERATURE]).toBe(1);
      expect(buf[S.SIGNAL]).toBe(0);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('PHASE_RADIATION'), LAW_INDEXES.PHASE_RADIATION)).toBe(true);
    });

    it('radiates excess heat (temp 1 → energy −0.008, signal +0.008)', () => {
      const buf = view(1);
      buf[S.TEMPERATURE] = 1;
      buf[S.ENERGY] = 100;
      applyPhaseRadiation(lawsOn('PHASE_RADIATION'), buf, 0, 1, 1);
      expect(buf[S.ENERGY]).toBeCloseTo(99.992, 5);
      expect(buf[S.TEMPERATURE]).toBeCloseTo(0.992, 5);
      expect(buf[S.SIGNAL]).toBeCloseTo(0.008, 5);
    });

    it('ignores cool particles (temp 0.5)', () => {
      const buf = view(1);
      buf[S.TEMPERATURE] = 0.5;
      buf[S.ENERGY] = 100;
      applyPhaseRadiation(lawsOn('PHASE_RADIATION'), buf, 0, 1, 1);
      expect(buf[S.ENERGY]).toBe(100);
      expect(buf[S.SIGNAL]).toBe(0);
    });

    it('integration: solve() radiates heat away and boosts signal', () => {
      const world = makeWorld(1, { temperature: 1 });
      solve(world.view, 1, PARTICLE_STRIDE, lawsOn('PHASE_RADIATION'), world.dna, WORLD, DT, () => 0.5);
      expect(world.view[S.TEMPERATURE]).toBeLessThan(1);
      expect(world.view[S.SIGNAL]).toBeGreaterThan(0);
    });
  });

  describe('SUBLIMATION (29)', () => {
    it('gates: mass/temperature unchanged without the law', () => {
      const buf = view(1);
      buf[S.TEMPERATURE] = 1;
      buf[S.MASS] = 1.5;
      applySublimation(createLawState(), buf, 0, 1, 1);
      expect(buf[S.MASS]).toBe(1.5);
      expect(buf[S.TEMPERATURE]).toBe(1);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('SUBLIMATION'), LAW_INDEXES.SUBLIMATION)).toBe(true);
    });

    it('converts hot mass to vapour (temp 1, mass 1.5 → −0.0025, temp −0.00125)', () => {
      const buf = view(1);
      buf[S.TEMPERATURE] = 1;
      buf[S.MASS] = 1.5;
      applySublimation(lawsOn('SUBLIMATION'), buf, 0, 1, 1);
      expect(buf[S.MASS]).toBeCloseTo(1.4975, 5);
      expect(buf[S.TEMPERATURE]).toBeCloseTo(0.99875, 5);
    });

    it('integration: solve() sublimates a hot, massive particle', () => {
      const world = makeWorld(1, { temperature: 1 });
      world.view[S.MASS] = 1.5;
      solve(world.view, 1, PARTICLE_STRIDE, lawsOn('SUBLIMATION'), world.dna, WORLD, DT, () => 0.5);
      expect(world.view[S.MASS]).toBeLessThan(1.5);
    });
  });

  describe('TIME_DILATION (30)', () => {
    it('gates: localDt stays 1.0 without the law', () => {
      const buf = view(1);
      buf[S.SOUL] = 1;
      expect(applyTimeDilation(createLawState(), buf, 0, 1)).toBe(1);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('TIME_DILATION'), LAW_INDEXES.TIME_DILATION)).toBe(true);
    });

    it('slows high-soul particles (soul 1 → localDt 0.7)', () => {
      const buf = view(1);
      buf[S.SOUL] = 1;
      expect(applyTimeDilation(lawsOn('TIME_DILATION'), buf, 0, 1)).toBeCloseTo(0.7, 5);
    });

    it('leaves soul-less particles at full time speed', () => {
      const buf = view(1);
      buf[S.SOUL] = 0;
      expect(applyTimeDilation(lawsOn('TIME_DILATION'), buf, 0, 1)).toBe(1);
    });

    it('integration: high-soul particle advances AGE slower than a soul-less one', () => {
      const world = makeWorld(2);
      world.view[S.SOUL] = 0;
      world.view[PARTICLE_STRIDE + S.SOUL] = 1;
      solve(world.view, 2, PARTICLE_STRIDE, lawsOn('TIME_DILATION'), world.dna, WORLD, DT, () => 0.5);
      expect(world.view[PARTICLE_STRIDE + S.AGE]).toBeLessThan(world.view[S.AGE]);
    });
  });

  describe('DIMENSIONALITY (31)', () => {
    it('gates: VEL_Z unchanged without the law', () => {
      const buf = view(1);
      applyDimensionality(createLawState(), buf, 0, () => 1.0, 1, 1);
      expect(buf[S.VEL_Z]).toBe(0);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('DIMENSIONALITY'), LAW_INDEXES.DIMENSIONALITY)).toBe(true);
    });

    it('perturbs Z velocity via prng (prng 1.0, dt 1 → VEL_Z +0.05)', () => {
      const buf = view(1);
      applyDimensionality(lawsOn('DIMENSIONALITY'), buf, 0, () => 1.0, 1, 1);
      expect(buf[S.VEL_Z]).toBeCloseTo(0.05, 5);
    });

    it('integration: solve() perturbs VEL_Z in 3D space', () => {
      const world = makeWorld(1);
      solve(world.view, 1, PARTICLE_STRIDE, lawsOn('DIMENSIONALITY'), world.dna, WORLD, DT, () => 1.0);
      expect(world.view[S.VEL_Z]).not.toBe(0);
    });
  });
});
