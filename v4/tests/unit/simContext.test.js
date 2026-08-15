import { describe, it, expect } from 'vitest';
import {
  PARTICLE_STRIDE,
  MAX_PARTICLES,
  STRIDE_INDEXES as S,
  LAW_INDEXES,
  DNA_RANGES,
} from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createLawState, set } from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults } from '../../src/dna/dnaBuffer.js';
import { solve } from '../../src/physics/solver.js';
import {
  SIM_CONTEXT_DEFAULTS,
  createSimContext,
  simContextFromRuntimeConfig,
} from '../../src/physics/simContext.js';
import { runtimeConfig } from '../../src/state/runtimeConfig.js';

const WORLD = 2000;
const DT = 0.25;
const TICKS = 20;
const rng = () => 0.5;

/** Two particles 10 apart with GRAV enabled (deterministic). */
function gravWorld() {
  const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
  const view = buf.view;
  const dna = createDNABuffer();
  loadDefaults(dna, DNA_RANGES);
  for (let i = 0; i < 2; i++) {
    const b = i * PARTICLE_STRIDE;
    view[b + S.POS_X] = i === 0 ? 995 : 1005;
    view[b + S.POS_Y] = 1000;
    view[b + S.POS_Z] = 1000;
    view[b + S.MASS] = 1.5;
    view[b + S.SPECIES_ID] = 0;
    view[b + S.DEAD] = 0;
    view[b + S.AGE] = 0;
    view[b + S.ENERGY] = 100;
    view[b + S.SIGNAL] = 0;
    view[b + S.TEMPERATURE] = 0;
    view[b + S.RADIUS] = 0.6;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { default: 0 };
      view[b + S.DNA_CACHE_START + d] = r.default ?? 0;
    }
  }
  const laws = createLawState();
  set(laws, LAW_INDEXES.GRAV);
  return { view, dna, laws };
}

function run(view, dna, laws, ctx) {
  for (let t = 0; t < TICKS; t++) solve(view, 2, PARTICLE_STRIDE, laws, dna, WORLD, DT, rng, ctx);
}

describe('simContext', () => {
  it('defaults mirror a fresh runtimeConfig baseline', () => {
    const ctx = createSimContext();
    expect(ctx.starMass).toBe(runtimeConfig.starMass);
    expect(ctx.forceScale).toBe(runtimeConfig.forceScale);
    expect(ctx.maxForce).toBe(runtimeConfig.maxForce);
    expect(ctx.dragMultiplier).toBe(runtimeConfig.dragMultiplier);
    expect(ctx.birthRate).toBe(runtimeConfig.birthRate);
    expect(ctx.deathRate).toBe(runtimeConfig.deathRate);
    expect(ctx.worldParams).toEqual(runtimeConfig.worldParams);
  });

  it('overrides merge over the baseline without mutating it', () => {
    const ctx = createSimContext({ starMass: 20, forceScale: 2.5 });
    expect(ctx.starMass).toBe(20);
    expect(ctx.forceScale).toBe(2.5);
    expect(ctx.maxForce).toBe(SIM_CONTEXT_DEFAULTS.maxForce);
    expect(ctx.birthRate).toBe(SIM_CONTEXT_DEFAULTS.birthRate);
    expect(SIM_CONTEXT_DEFAULTS.starMass).toBe(12); // baseline untouched
  });

  it('solve() parity: omitted context and explicit baseline context are identical', () => {
    const a = gravWorld();
    run(a.view, a.dna, a.laws);
    const b = gravWorld();
    run(b.view, b.dna, b.laws, createSimContext());
    expect(a.view[S.VEL_X]).toBe(b.view[S.VEL_X]);
    expect(a.view[PARTICLE_STRIDE + S.VEL_X]).toBe(b.view[PARTICLE_STRIDE + S.VEL_X]);
  });

  it('solver is isolated from runtimeConfig mutation (portable kernel)', () => {
    const baseline = gravWorld();
    run(baseline.view, baseline.dna, baseline.laws);
    const vx = baseline.view[S.VEL_X];
    expect(vx).toBeGreaterThan(0);

    // Neutralise gravity + forces in the app-layer singleton.
    const prevG = runtimeConfig.worldParams.GLOBAL_G;
    const prevF = runtimeConfig.forceScale;
    runtimeConfig.worldParams.GLOBAL_G = 0;
    runtimeConfig.forceScale = 0;
    try {
      // Default context is unaffected — identical physics.
      const iso = gravWorld();
      run(iso.view, iso.dna, iso.laws);
      expect(iso.view[S.VEL_X]).toBe(vx);

      // A runtimeConfig-derived context DOES carry the mutation.
      const live = gravWorld();
      run(live.view, live.dna, live.laws, simContextFromRuntimeConfig(runtimeConfig));
      expect(live.view[S.VEL_X]).toBe(0);
    } finally {
      runtimeConfig.worldParams.GLOBAL_G = prevG;
      runtimeConfig.forceScale = prevF;
    }
  });
});
