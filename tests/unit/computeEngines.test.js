import { describe, expect, it, afterEach } from 'vitest';
import { gpuComputeForcesSync } from '../../src/physics/gpuCompute.js';
import { fmmGravity } from '../../src/physics/fmm.js';
import { solve } from '../../src/physics/solver.js';
import { createLawState, set as lawSet } from '../../src/state/lawState.js';
import { LAW_INDEXES } from '../../src/constants.js';
import { runtimeConfig } from '../../src/state/runtimeConfig.js';
import { SplitMix32 } from '../../src/core/prng.js';
import { createWorldParams } from '../../src/state/worldParams.js';

const STRIDE = 100;
const WORLD = 100;

function cloud(count) {
  const view = new Float32Array(count * STRIDE);
  for (let i = 0; i < count; i++) {
    const b = i * STRIDE;
    view[b] = 10 + i * 7;
    view[b + 1] = 20 + i * 3;
    view[b + 2] = 30 + i * 5;
    view[b + 6] = 1 + i * 0.1;
    view[b + 56] = 1;
  }
  return view;
}

afterEach(() => {
  runtimeConfig.gravEngine = 'exact';
  runtimeConfig.computeEngine = 'cpu';
});

describe('compute engine fallbacks', () => {
  it('returns finite deterministic CPU fallback forces', () => {
    const view = cloud(4);
    const pairs = [{ i: 0, j: 1 }, { i: 0, j: 2 }, { i: 1, j: 3 }];
    const a = gpuComputeForcesSync(view, 4, pairs, { worldSize: WORLD, G: 0.2 });
    const b = gpuComputeForcesSync(view, 4, pairs, { worldSize: WORLD, G: 0.2 });
    expect(Array.from(a.fx)).toEqual(Array.from(b.fx));
    expect(Array.from(a.fy)).toEqual(Array.from(b.fy));
    expect(Array.from(a.fz)).toEqual(Array.from(b.fz));
    for (const values of [a.fx, a.fy, a.fz]) {
      expect(values.every(Number.isFinite)).toBe(true);
    }
  });
});

describe('FMM solver path', () => {
  it('produces finite forces for a toroidal cloud', () => {
    const view = cloud(12);
    const fx = new Float64Array(12);
    const fy = new Float64Array(12);
    const fz = new Float64Array(12);
    const result = fmmGravity(view, STRIDE, 12, WORLD, 0.2, fx, fy, fz);
    expect(result.nCells).toBeGreaterThan(0);
    expect(result.depth).toBeGreaterThan(0);
    expect([...fx, ...fy, ...fz].every(Number.isFinite)).toBe(true);
  });

  it('runs the dedicated fmm engine without corrupting particle state', () => {
    const view = cloud(32);
    const beforeMass = view[6];
    const laws = createLawState();
    lawSet(laws, LAW_INDEXES.GRAV);
    runtimeConfig.gravEngine = 'fmm';
    solve(view, 32, STRIDE, laws, null, WORLD, 0.1, new SplitMix32(7));
    expect(view[6]).toBe(beforeMass);
    for (let i = 0; i < view.length; i++) expect(Number.isFinite(view[i])).toBe(true);
    expect(view.some((value, i) => i % STRIDE === 3 && value !== 0)).toBe(true);
  });
});

describe('physics interaction budget', () => {
  it('does not change solver output when legacy adaptive-quality settings differ', () => {
    const count = 64;
    const initial = new Float32Array(count * STRIDE);
    for (let i = 0; i < count; i++) {
      const b = i * STRIDE;
      initial[b] = 50 + (i % 8) * 0.15;
      initial[b + 1] = 50 + (Math.floor(i / 8) % 8) * 0.15;
      initial[b + 2] = 50 + (i % 4) * 0.15;
      initial[b + 6] = 1;
      initial[b + 56] = 0.6;
    }

    const baselineParams = {
      ...createWorldParams(),
      AUTO_TUNE: 0,
      GRID_DIM: 12,
      CELL_CAP: 100,
      MAX_INTERACTIONS: 500,
      NEIGHBOR_BUF: 2000,
      QUALITY_MODE: 1,
      TARGET_FPS: 15,
      PAIRWISE_BUDGET: 8,
    };
    const originalParams = runtimeConfig.worldParams;
    const originalEngine = runtimeConfig.gravEngine;
    try {
      const adaptiveConfigView = initial.slice();
      const fixedConfigView = initial.slice();
      const adaptiveLaws = createLawState();
      const fixedLaws = createLawState();
      lawSet(adaptiveLaws, LAW_INDEXES.GRAV);
      lawSet(fixedLaws, LAW_INDEXES.GRAV);
      runtimeConfig.gravEngine = 'exact';
      runtimeConfig.worldParams = { ...baselineParams, QUALITY_MODE: 1, TARGET_FPS: 15, PAIRWISE_BUDGET: 8 };
      solve(adaptiveConfigView, count, STRIDE, adaptiveLaws, null, WORLD, 0.1, new SplitMix32(11));
      runtimeConfig.worldParams = { ...baselineParams, QUALITY_MODE: 0, TARGET_FPS: 60, PAIRWISE_BUDGET: 500 };
      solve(fixedConfigView, count, STRIDE, fixedLaws, null, WORLD, 0.1, new SplitMix32(11));
      expect(Array.from(adaptiveConfigView)).toEqual(Array.from(fixedConfigView));
    } finally {
      runtimeConfig.worldParams = originalParams || createWorldParams();
      runtimeConfig.gravEngine = originalEngine;
    }
  });
});
