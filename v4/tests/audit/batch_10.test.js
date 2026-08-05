import { describe, it, expect } from 'vitest';
import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_RANGES, LAW_INDEXES, MAX_PARTICLES } from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createLawState, set, isSet } from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from '../../src/dna/dnaBuffer.js';
import { applySoul, applyMind, applyVoid, applyBond } from '../../src/physics/laws.js';
import { solve } from '../../src/physics/solver.js';

const WORLD = 2000;
const DT = 0.25;
const rng = () => 0.5;

function view(n) {
  return new Float32Array(n * PARTICLE_STRIDE);
}

function seed(buf, n) {
  for (let i = 0; i < n; i++) {
    const b = i * PARTICLE_STRIDE;
    buf[b + S.POS_X] = 100;
    buf[b + S.POS_Y] = 100;
    buf[b + S.POS_Z] = 100;
    buf[b + S.VEL_X] = 0;
    buf[b + S.VEL_Y] = 0;
    buf[b + S.VEL_Z] = 0;
    buf[b + S.MASS] = 1.5;
    buf[b + S.RADIUS] = 1.0;
    buf[b + S.ENERGY] = 100;
    buf[b + S.DEAD] = 0;
    buf[b + S.SPECIES_ID] = 0;
    buf[b + S.BOND_COUNT] = 0;
    buf[b + S.BOND_PARTNER_1] = -1;
    buf[b + S.BOND_PARTNER_2] = -1;
    buf[b + S.DNA_CACHE_START + 8] = 1.0; // STIFFNESS
  }
}

function makeWorld(count, mutate) {
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
    v[b + S.ENERGY] = 100;
    v[b + S.RADIUS] = 1.0;
    v[b + S.BOND_COUNT] = 0;
    v[b + S.BOND_PARTNER_1] = -1;
    v[b + S.BOND_PARTNER_2] = -1;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      v[b + S.DNA_CACHE_START + d] = getDNAFloat(dna, i % 3, d, r.min, r.max);
    }
  }
  if (mutate) mutate(v, dna);
  return { view: v, dna };
}

describe('Batch 10 — SOUL_LAW / MIND / VOID / BOND', () => {
  it('SOUL_LAW (36): same-species soul sharing, gated by isSet', () => {
    const buf = view(2);
    seed(buf, 2);
    buf[PARTICLE_STRIDE + S.SOUL] = 50;
    const state = createLawState();
    set(state, LAW_INDEXES.SOUL_LAW);
    expect(isSet(state, LAW_INDEXES.SOUL_LAW)).toBe(true);
    applySoul(state, buf, 0, PARTICLE_STRIDE, 100, 1);
    expect(buf[S.SOUL]).toBeCloseTo(0.05, 5); // 50 * 0.001
    // different species → no transfer
    const buf2 = view(2);
    seed(buf2, 2);
    buf2[PARTICLE_STRIDE + S.SOUL] = 50;
    buf2[PARTICLE_STRIDE + S.SPECIES_ID] = 1;
    applySoul(state, buf2, 0, PARTICLE_STRIDE, 100, 1);
    expect(buf2[S.SOUL]).toBe(0);
    // beyond 10k distSq → no transfer
    const buf3 = view(2);
    seed(buf3, 2);
    buf3[PARTICLE_STRIDE + S.SOUL] = 50;
    applySoul(state, buf3, 0, PARTICLE_STRIDE, 20000, 1);
    expect(buf3[S.SOUL]).toBe(0);
    // gate off → no transfer
    const buf4 = view(2);
    seed(buf4, 2);
    buf4[PARTICLE_STRIDE + S.SOUL] = 50;
    applySoul(createLawState(), buf4, 0, PARTICLE_STRIDE, 100, 1);
    expect(buf4[S.SOUL]).toBe(0);
  });

  it('SOUL_LAW integration: soul accumulates from same-species neighbor', () => {
    const on = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
      v[PARTICLE_STRIDE + S.SOUL] = 50;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.SOUL_LAW);
    solve(on.view, 2, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.SOUL]).toBeGreaterThan(0);

    const off = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
      v[PARTICLE_STRIDE + S.SOUL] = 50;
    });
    solve(off.view, 2, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.SOUL]).toBe(0);
  });

  it('MIND (37): same-species signal boost, gated by isSet', () => {
    const buf = view(2);
    seed(buf, 2);
    const state = createLawState();
    set(state, LAW_INDEXES.MIND);
    expect(isSet(state, LAW_INDEXES.MIND)).toBe(true);
    const f = applyMind(state, buf, 0, PARTICLE_STRIDE, 100, 1);
    expect(f).not.toBeNull();
    expect(f.signalBoost).toBeCloseTo(0.001, 5); // 0.01 * (1/10)
    expect(f.ax).toBe(0);
    // different species → null
    buf[PARTICLE_STRIDE + S.SPECIES_ID] = 1;
    expect(applyMind(state, buf, 0, PARTICLE_STRIDE, 100, 1)).toBeNull();
    // beyond 40k distSq → null
    buf[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
    expect(applyMind(state, buf, 0, PARTICLE_STRIDE, 50000, 1)).toBeNull();
    // gate off → null
    expect(applyMind(createLawState(), buf, 0, PARTICLE_STRIDE, 100, 1)).toBeNull();
  });

  it('MIND integration: hivemind signal boost accumulates in solve()', () => {
    const on = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.MIND);
    solve(on.view, 2, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.SIGNAL]).toBeGreaterThan(0);

    const off = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
    });
    solve(off.view, 2, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.SIGNAL]).toBe(0);
  });

  it('VOID (38): outward pressure from world center, gated by isSet', () => {
    const buf = view(1);
    seed(buf, 1);
    const state = createLawState();
    set(state, LAW_INDEXES.VOID);
    expect(isSet(state, LAW_INDEXES.VOID)).toBe(true);
    const f = applyVoid(state, buf, 0, 1100, 1000, 1000, 2000, 1);
    expect(f).not.toBeNull();
    expect(f.ax).toBeCloseTo(0.0005, 5); // 100 * (1/100) * 0.0005
    // exactly at center → no force
    expect(applyVoid(state, buf, 0, 1000, 1000, 1000, 2000, 1)).toBeNull();
    // gate off → null
    expect(applyVoid(createLawState(), buf, 0, 1100, 1000, 1000, 2000, 1)).toBeNull();
  });

  it('VOID integration: off-center particle accelerates away from center', () => {
    const on = makeWorld(1, (v) => {
      v[S.POS_X] = 1800;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.VOID);
    solve(on.view, 1, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.VEL_X]).toBeGreaterThan(0);

    const off = makeWorld(1, (v) => {
      v[S.POS_X] = 1800;
    });
    solve(off.view, 1, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.VEL_X]).toBe(0);
  });

  it('BOND (39): spring force + bilateral bond registration, gated by isSet', () => {
    const buf = view(2);
    seed(buf, 2);
    const state = createLawState();
    set(state, LAW_INDEXES.BOND);
    expect(isSet(state, LAW_INDEXES.BOND)).toBe(true);
    // i at dist 3 from j, rest length (1+1)*1.1 = 2.2 → stretched spring pulls i toward j
    const f = applyBond(state, buf, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 3, 0, 0, 3, 1);
    expect(f).not.toBeNull();
    expect(f.ax).toBeCloseTo(0.04, 5); // 1.0 * 0.8 * 0.05
    expect(buf[S.BOND_COUNT]).toBe(1);
    expect(buf[PARTICLE_STRIDE + S.BOND_COUNT]).toBe(1);
    expect(buf[S.BOND_PARTNER_1]).toBe(1);
    expect(buf[PARTICLE_STRIDE + S.BOND_PARTNER_1]).toBe(0);
    // already-bonded re-call: force only, no double count
    const f2 = applyBond(state, buf, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 3, 0, 0, 3, 1);
    expect(f2).not.toBeNull();
    expect(buf[S.BOND_COUNT]).toBe(1);
    // beyond 30 dist → no bond
    const far = view(2);
    seed(far, 2);
    expect(applyBond(state, far, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 50, 0, 0, 50, 1)).toBeNull();
    // stiffness below 0.01 → no bond
    const soft = view(2);
    seed(soft, 2);
    soft[S.DNA_CACHE_START + 8] = 0.001;
    expect(applyBond(state, soft, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 3, 0, 0, 3, 1)).toBeNull();
    // gate off → null
    expect(applyBond(createLawState(), buf, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 3, 0, 0, 3, 1)).toBeNull();
  });

  it('BOND integration: nearby particles register bilateral bonds', () => {
    const on = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.POS_X] = 103; // dist 3
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.BOND);
    solve(on.view, 2, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.BOND_COUNT]).toBe(1);
    expect(on.view[PARTICLE_STRIDE + S.BOND_COUNT]).toBe(1);

    const off = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.POS_X] = 103;
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
    });
    solve(off.view, 2, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.BOND_COUNT]).toBe(0);
    expect(off.view[PARTICLE_STRIDE + S.BOND_COUNT]).toBe(0);
  });
});
