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
  applyOxidationEffect,
  applyPolymer,
  applyIsomerization,
  applyChirality,
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
    v[b + S.BOND_COUNT] = 0;
    v[b + S.BOND_PARTNER_1] = -1;
    v[b + S.BOND_PARTNER_2] = -1;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      v[b + S.DNA_CACHE_START + d] = getDNAFloat(dna, i % 3, d, r.min, r.max);
    }
  }
  return { view: v, dna };
}

describe('Batch 06 audit — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY', () => {
  describe('OXIDATION (20)', () => {
    it('gates: mass unchanged without the law', () => {
      const buf = view(1);
      buf[S.CHARGE] = 1;
      buf[S.MASS] = 1.5;
      applyOxidationEffect(createLawState(), buf, 0, 1, 1);
      expect(buf[S.MASS]).toBe(1.5);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('OXIDATION'), LAW_INDEXES.OXIDATION)).toBe(true);
    });

    it('degrades mass proportionally to charge (charge 1, dt 1 → −0.001)', () => {
      const buf = view(1);
      buf[S.CHARGE] = 1;
      buf[S.MASS] = 1.5;
      applyOxidationEffect(lawsOn('OXIDATION'), buf, 0, 1, 1);
      expect(buf[S.MASS]).toBeCloseTo(1.499, 5);
    });

    it('is inert below the 0.3 charge threshold', () => {
      const buf = view(1);
      buf[S.CHARGE] = 0.1;
      buf[S.MASS] = 1.5;
      applyOxidationEffect(lawsOn('OXIDATION'), buf, 0, 1, 1);
      expect(buf[S.MASS]).toBe(1.5);
    });
  });

  describe('POLYMER (21)', () => {
    it('gates: zero force and no bond without the law', () => {
      const buf = view(2);
      buf[S.POS_X] = 100;
      buf[PARTICLE_STRIDE + S.POS_X] = 105;
      const f = applyPolymer(createLawState(), buf, 0, PARTICLE_STRIDE, 5, 0, 0, 5, 1);
      expect(f).toEqual({ ax: 0, ay: 0, az: 0 });
      expect(buf[S.BOND_COUNT]).toBe(0);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('POLYMER'), LAW_INDEXES.POLYMER)).toBe(true);
    });

    it('forms a bond and returns a spring force at dist 5', () => {
      const buf = view(2);
      buf[S.POS_X] = 100;
      buf[PARTICLE_STRIDE + S.POS_X] = 105;
      buf[S.BOND_COUNT] = 0;
      buf[S.BOND_PARTNER_1] = -1;
      buf[S.BOND_PARTNER_2] = -1;
      const f = applyPolymer(lawsOn('POLYMER'), buf, 0, PARTICLE_STRIDE, 5, 0, 0, 5, 1);
      expect(buf[S.BOND_COUNT]).toBe(1);
      expect(buf[S.BOND_PARTNER_1]).toBe(1); // jBase / PARTICLE_STRIDE
      expect(f.ax).toBeCloseTo(0.02, 5); // stiffness 0.02 × (5 − restLen 4)
      expect(f.ay).toBe(0);
      expect(f.az).toBe(0);
    });

    it('integration: solve() wires bond formation between close particles', () => {
      const world = makeWorld(2);
      world.view[S.POS_X] = 100;
      world.view[PARTICLE_STRIDE + S.POS_X] = 105;
      solve(world.view, 2, PARTICLE_STRIDE, lawsOn('POLYMER'), world.dna, WORLD, DT, () => 0.5);
      expect(world.view[S.BOND_COUNT]).toBeGreaterThanOrEqual(1);
      expect(world.view[S.BOND_PARTNER_1]).toBe(1);
    });
  });

  describe('ISOMERIZATION (22)', () => {
    it('gates: radius unchanged without the law', () => {
      const buf = view(1);
      buf[S.RADIUS] = 2;
      buf[S.AGE] = (Math.PI / 2) * 100;
      applyIsomerization(createLawState(), buf, 0, 1, 1);
      expect(buf[S.RADIUS]).toBe(2);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('ISOMERIZATION'), LAW_INDEXES.ISOMERIZATION)).toBe(true);
    });

    it('phase-modulates radius at sin=1 phase (age=50π → ×1.005)', () => {
      const buf = view(1);
      buf[S.RADIUS] = 2;
      buf[S.AGE] = (Math.PI / 2) * 100;
      applyIsomerization(lawsOn('ISOMERIZATION'), buf, 0, 1, 1);
      expect(buf[S.RADIUS]).toBeCloseTo(2.01, 5);
    });

    it('integration: solve() keeps the isomerisation phase factor (peak vs zero phase)', () => {
      const zero = makeWorld(1);
      const peak = makeWorld(1);
      zero.view[S.AGE] = 0;
      peak.view[S.AGE] = (Math.PI / 2) * 100;
      solve(zero.view, 1, PARTICLE_STRIDE, lawsOn('ISOMERIZATION'), zero.dna, WORLD, DT, () => 0.5);
      solve(peak.view, 1, PARTICLE_STRIDE, lawsOn('ISOMERIZATION'), peak.dna, WORLD, DT, () => 0.5);
      expect(peak.view[S.RADIUS] / zero.view[S.RADIUS]).toBeCloseTo(1.00125, 4);
    });
  });

  describe('CHIRALITY (23)', () => {
    it('gates: returns null without the law', () => {
      const buf = view(2);
      buf[S.DNA_CACHE_START + 4] = 1;
      buf[PARTICLE_STRIDE + S.DNA_CACHE_START + 4] = 1;
      expect(applyChirality(createLawState(), buf, 0, PARTICLE_STRIDE, 3, 4, 0, 5, 1)).toBeNull();
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('CHIRALITY'), LAW_INDEXES.CHIRALITY)).toBe(true);
    });

    it('deflects same-polarity pairs perpendicular to the separation vector', () => {
      const buf = view(2);
      buf[S.DNA_CACHE_START + 4] = 1;
      buf[PARTICLE_STRIDE + S.DNA_CACHE_START + 4] = 1;
      const f = applyChirality(lawsOn('CHIRALITY'), buf, 0, PARTICLE_STRIDE, 3, 4, 0, 5, 1);
      expect(f.ax).toBeCloseTo(-0.008, 5); // −dy·invDist·0.01
      expect(f.ay).toBeCloseTo(0.006, 5);  //  dx·invDist·0.01
      expect(f.az).toBe(0);
    });

    it('returns null for opposite-polarity pairs', () => {
      const buf = view(2);
      buf[S.DNA_CACHE_START + 4] = 1;
      buf[PARTICLE_STRIDE + S.DNA_CACHE_START + 4] = -1;
      expect(applyChirality(lawsOn('CHIRALITY'), buf, 0, PARTICLE_STRIDE, 3, 4, 0, 5, 1)).toBeNull();
    });
  });
});
