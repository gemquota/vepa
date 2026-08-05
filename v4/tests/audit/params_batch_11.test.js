import { describe, it, expect } from 'vitest';
import { makeWorld, lawsWith, PARTICLE_STRIDE, S, WORLD } from './paramsHelpers.js';
import { LAW_INDEXES } from '../../src/constants.js';
import { solve } from '../../src/physics/solver.js';

describe('Batch 11 — DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME', () => {
  it('STIFFNESS: stiffer bonds pull harder toward rest length (BOND)', () => {
    const run = (stiffness) => {
      const { view, dna } = makeWorld(2, (v, d, b) => {
        if (b === 0) {
          v[b + S.POS_X] = 990;
          v[b + S.DNA_CACHE_START + 8] = stiffness; // STIFFNESS
        }
      });
      const laws = lawsWith(LAW_INDEXES.BOND, LAW_INDEXES.WRAP);
      for (let t = 0; t < 10; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, () => 0.5);
      return view[S.POS_X];
    };
    expect(run(5)).toBeGreaterThan(run(0.1));
  });

  it('FUSION: higher fusion efficiency transfers more mass on overlap (ACCR)', () => {
    const run = (fusion) => {
      const { view, dna } = makeWorld(2, (v, d, b) => {
        v[b + S.MASS] = b === 0 ? 10 : 4;
        if (b === 0) {
          v[b + S.POS_X] = 999;
          v[b + S.DNA_CACHE_START + 9] = fusion; // FUSION
        } else {
          v[b + S.POS_X] = 1000;
        }
      });
      const laws = lawsWith(LAW_INDEXES.ACCR, LAW_INDEXES.WRAP);
      for (let t = 0; t < 1; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, () => 0.5);
      return view[S.MASS];
    };
    expect(run(1)).toBeGreaterThan(run(0));
  });

  it('FUSION_MOMENTUM: generous thresholds let faster collisions merge (ACCR)', () => {
    const run = (fusionMom) => {
      const { view, dna } = makeWorld(2, (v, d, b) => {
        v[b + S.MASS] = b === 0 ? 10 : 1;
        if (b === 0) {
          v[b + S.POS_X] = 999;
          v[b + S.DNA_CACHE_START + 16] = fusionMom; // FUSION_MOMENTUM
          v[b + S.DNA_CACHE_START + 17] = 0;         // FUSION_TIME → mature immediately
        } else {
          v[b + S.POS_X] = 1000;
          v[b + S.VEL_X] = -2; // 2.0 relative approach speed
        }
      });
      const laws = lawsWith(LAW_INDEXES.ACCR, LAW_INDEXES.WRAP);
      for (let t = 0; t < 1; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, () => 0.5);
      return view[S.MASS];
    };
    expect(run(1.5)).toBeGreaterThan(run(0.5));
  });

  it('FUSION_TIME: mass transfer gated by AGE maturity; 0 allows immediate merging (ACCR)', () => {
    const run = (fusionTime, age) => {
      const { view, dna } = makeWorld(2, (v, d, b) => {
        v[b + S.MASS] = b === 0 ? 10 : 1;
        v[b + S.DNA_CACHE_START + 17] = fusionTime;   // FUSION_TIME on both partners
        if (b === 0) {
          v[b + S.POS_X] = 999;
          v[b + S.AGE] = age;
          v[b + S.DNA_CACHE_START + 16] = 1;          // FUSION_MOMENTUM generous gate
        } else {
          v[b + S.POS_X] = 1000;
        }
      });
      const laws = lawsWith(LAW_INDEXES.ACCR, LAW_INDEXES.WRAP);
      for (let t = 0; t < 1; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, 1.0, () => 0.5);
      return view[S.MASS];
    };
    expect(run(0, 0)).toBeGreaterThan(10.02);      // immature gate off → merges
    expect(run(1, 0)).toBeCloseTo(10, 3);          // too young → no merge
    expect(run(1, 100)).toBeGreaterThan(10.02);    // mature → merges
  });
});
