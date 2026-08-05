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
  applyPhenotype,
  applyChemistry,
  applySolvationEffect,
  applyAcidityEffect,
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

describe('Batch 05 audit — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY', () => {
  describe('PHENOTYPE (16)', () => {
    it('gates: radius unchanged without the law', () => {
      const buf = view(1);
      buf[S.RADIUS] = 2;
      buf[S.ENERGY] = 200;
      applyPhenotype(createLawState(), buf, 0, 1, 1);
      expect(buf[S.RADIUS]).toBe(2);
    });

    it('is flagged when the law is set', () => {
      const st = lawsOn('PHENOTYPE');
      expect(isSet(st, LAW_INDEXES.PHENOTYPE)).toBe(true);
    });

    it('scales radius with energy (energy 200, synergy 1 → ×1.25)', () => {
      const buf = view(1);
      buf[S.RADIUS] = 2;
      buf[S.ENERGY] = 200;
      applyPhenotype(lawsOn('PHENOTYPE'), buf, 0, 1, 1);
      expect(buf[S.RADIUS]).toBeCloseTo(2.5, 5);
    });

    it('integration: solve() keeps the phenotype radius factor (energy 200 → ×1.25 vs 100)', () => {
      const low = makeWorld(1, { energy: 100 });
      const high = makeWorld(1, { energy: 200 });
      solve(low.view, 1, PARTICLE_STRIDE, lawsOn('PHENOTYPE'), low.dna, WORLD, DT, () => 0.5);
      solve(high.view, 1, PARTICLE_STRIDE, lawsOn('PHENOTYPE'), high.dna, WORLD, DT, () => 0.5);
      expect(high.view[S.RADIUS] / low.view[S.RADIUS]).toBeCloseTo(1.25, 2);
    });
  });

  describe('CATALYSIS_LAW (17)', () => {
    it('gates: chemistry multiplier stays 1.0 without the law', () => {
      const buf = view(2);
      buf[S.DNA_CACHE_START + 38] = 1.0;
      expect(applyChemistry(createLawState(), buf, 0, PARTICLE_STRIDE, 25, 1)).toBe(1.0);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('CATALYSIS_LAW'), LAW_INDEXES.CATALYSIS_LAW)).toBe(true);
    });

    it('boosts chemistry multiplier via CATALYSIS DNA (1.0 → ×1.5)', () => {
      const buf = view(2);
      buf[S.DNA_CACHE_START + 38] = 1.0;
      expect(applyChemistry(lawsOn('CATALYSIS_LAW'), buf, 0, PARTICLE_STRIDE, 25, 1)).toBeCloseTo(1.5, 5);
    });

    it('solver: CATALYSIS_LAW amplifies the charge force (multiplier is applied)', () => {
      const run = (withCatalysis) => {
        const world = makeWorld(2);
        world.view[S.POS_X] = 100;
        world.view[PARTICLE_STRIDE + S.POS_X] = 104;
        world.view[S.CHARGE] = 1;
        world.view[PARTICLE_STRIDE + S.CHARGE] = 1;
        world.view[S.DNA_CACHE_START + 38] = 5.0;
        world.view[PARTICLE_STRIDE + S.DNA_CACHE_START + 38] = 5.0;
        const st = withCatalysis ? lawsOn('CHARGE_LAW', 'CATALYSIS_LAW') : lawsOn('CHARGE_LAW');
        for (let t = 0; t < 200; t++) {
          solve(world.view, 2, PARTICLE_STRIDE, st, world.dna, WORLD, DT, () => 0.5);
        }
        return world.view[S.VEL_X];
      };
      const base = run(false);
      const amplified = run(true);
      expect(amplified).toBeGreaterThan(base * 1.2);
    });
  });

  describe('SOLVATION (18)', () => {
    it('gates: returns 1.0 without the law', () => {
      const buf = view(2);
      buf[S.CHARGE] = 1;
      buf[PARTICLE_STRIDE + S.CHARGE] = -1;
      expect(applySolvationEffect(createLawState(), buf, 0, PARTICLE_STRIDE, 25, 1)).toBe(1.0);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('SOLVATION'), LAW_INDEXES.SOLVATION)).toBe(true);
    });

    it('amplifies forces with the charge gap (diff 2 → ×1.4)', () => {
      const buf = view(2);
      buf[S.CHARGE] = 1;
      buf[PARTICLE_STRIDE + S.CHARGE] = -1;
      expect(applySolvationEffect(lawsOn('SOLVATION'), buf, 0, PARTICLE_STRIDE, 25, 1)).toBeCloseTo(1.4, 5);
    });

    it('returns 1.0 for near-equal charges', () => {
      const buf = view(2);
      buf[S.CHARGE] = 0.2;
      buf[PARTICLE_STRIDE + S.CHARGE] = 0.1;
      expect(applySolvationEffect(lawsOn('SOLVATION'), buf, 0, PARTICLE_STRIDE, 25, 1)).toBe(1.0);
    });

    it('solver: SOLVATION amplifies like-charge repulsion (multiplier applied)', () => {
      const run = (withSolvation) => {
        const world = makeWorld(2);
        world.view[S.POS_X] = 100;
        world.view[PARTICLE_STRIDE + S.POS_X] = 104;
        world.view[S.CHARGE] = 1;
        world.view[PARTICLE_STRIDE + S.CHARGE] = 1;
        const st = withSolvation ? lawsOn('CHARGE_LAW', 'SOLVATION') : lawsOn('CHARGE_LAW');
        for (let t = 0; t < 200; t++) {
          solve(world.view, 2, PARTICLE_STRIDE, st, world.dna, WORLD, DT, () => 0.5);
        }
        return world.view[S.VEL_X];
      };
      const base = run(false);
      const amplified = run(true);
      expect(amplified).toBeGreaterThan(base * 1.2);
    });
  });

  describe('ACIDITY (19)', () => {
    it('gates: energies unchanged without the law', () => {
      const buf = view(2);
      buf[S.CHARGE] = 1;
      buf[PARTICLE_STRIDE + S.CHARGE] = -1;
      buf[S.ENERGY] = 50;
      buf[PARTICLE_STRIDE + S.ENERGY] = 100;
      applyAcidityEffect(createLawState(), buf, 0, PARTICLE_STRIDE, 1, 1);
      expect(buf[S.ENERGY]).toBe(50);
      expect(buf[PARTICLE_STRIDE + S.ENERGY]).toBe(100);
    });

    it('is flagged when the law is set', () => {
      expect(isSet(lawsOn('ACIDITY'), LAW_INDEXES.ACIDITY)).toBe(true);
    });

    it('damages the charged neighbour and returns half the energy (diff 2, dt 1 → −0.02)', () => {
      const buf = view(2);
      buf[S.CHARGE] = 1;
      buf[PARTICLE_STRIDE + S.CHARGE] = -1;
      buf[S.ENERGY] = 50;
      buf[PARTICLE_STRIDE + S.ENERGY] = 100;
      applyAcidityEffect(lawsOn('ACIDITY'), buf, 0, PARTICLE_STRIDE, 1, 1);
      expect(buf[PARTICLE_STRIDE + S.ENERGY]).toBeCloseTo(99.98, 5);
      expect(buf[S.ENERGY]).toBeCloseTo(50.01, 5);
    });

    it('is inert below the 0.3 charge-gap threshold', () => {
      const buf = view(2);
      buf[S.CHARGE] = 0.2;
      buf[PARTICLE_STRIDE + S.CHARGE] = 0.1;
      buf[S.ENERGY] = 50;
      buf[PARTICLE_STRIDE + S.ENERGY] = 100;
      applyAcidityEffect(lawsOn('ACIDITY'), buf, 0, PARTICLE_STRIDE, 1, 1);
      expect(buf[S.ENERGY]).toBe(50);
      expect(buf[PARTICLE_STRIDE + S.ENERGY]).toBe(100);
    });

    it('solver: acidic charge gap drains energy from both partners', () => {
      const world = makeWorld(2);
      world.view[S.POS_X] = 100;
      world.view[PARTICLE_STRIDE + S.POS_X] = 105;
      world.view[S.CHARGE] = 1;
      world.view[PARTICLE_STRIDE + S.CHARGE] = -1;
      world.view[S.ENERGY] = 100;
      world.view[PARTICLE_STRIDE + S.ENERGY] = 100;
      const e0 = world.view[S.ENERGY];
      const st = lawsOn('ACIDITY');
      for (let t = 0; t < 200; t++) {
        solve(world.view, 2, PARTICLE_STRIDE, st, world.dna, WORLD, DT, () => 0.5);
      }
      expect(world.view[S.ENERGY]).toBeLessThan(e0);
    });
  });
});
