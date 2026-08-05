import { describe, it, expect } from 'vitest';
import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_RANGES, LAW_INDEXES, MAX_PARTICLES } from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createLawState, set, isSet } from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from '../../src/dna/dnaBuffer.js';
import { setBuffer, applyReduction, applyAlloy, applyMelt, applyBoil } from '../../src/physics/laws.js';
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
    buf[b + S.RADIUS] = 0.6;
    buf[b + S.ENERGY] = 100;
    buf[b + S.DEAD] = 0;
    buf[b + S.SPECIES_ID] = 0;
    buf[b + S.TEMPERATURE] = 0;
    buf[b + S.CHARGE] = 0;
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
    v[b + S.RADIUS] = 0.6;
    v[b + S.TEMPERATURE] = 0;
    v[b + S.CHARGE] = 0;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      v[b + S.DNA_CACHE_START + d] = getDNAFloat(dna, i % 3, d, r.min, r.max);
    }
  }
  if (mutate) mutate(v, dna);
  return { view: v, dna };
}

describe('Batch 11 — REDUCTION / ALLOY / MELT / BOIL', () => {
  it('REDUCTION (40): charge neutralization toward the mean', () => {
    const buf = view(2);
    seed(buf, 2);
    buf[S.CHARGE] = 1.0;
    buf[PARTICLE_STRIDE + S.CHARGE] = 0.2;
    setBuffer(buf);
    applyReduction(0, PARTICLE_STRIDE, PARTICLE_STRIDE, 1);
    expect(buf[S.CHARGE]).toBeCloseTo(0.96, 5); // 1.0 - 0.8*0.05
    expect(buf[PARTICLE_STRIDE + S.CHARGE]).toBeCloseTo(0.24, 5); // 0.2 + 0.8*0.05
    // equal charges → no change
    const buf2 = view(2);
    seed(buf2, 2);
    buf2[S.CHARGE] = 0.5;
    buf2[PARTICLE_STRIDE + S.CHARGE] = 0.5;
    setBuffer(buf2);
    applyReduction(0, PARTICLE_STRIDE, PARTICLE_STRIDE, 1);
    expect(buf2[S.CHARGE]).toBe(0.5);
    expect(buf2[PARTICLE_STRIDE + S.CHARGE]).toBe(0.5);
  });

  it('REDUCTION integration: charges converge only when law enabled', () => {
    const on = makeWorld(2, (v) => {
      v[S.CHARGE] = 1.0;
      v[PARTICLE_STRIDE + S.CHARGE] = 0.2;
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.REDUCTION);
    expect(isSet(st, LAW_INDEXES.REDUCTION)).toBe(true);
    solve(on.view, 2, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    const diffOn = Math.abs(on.view[S.CHARGE] - on.view[PARTICLE_STRIDE + S.CHARGE]);
    expect(diffOn).toBeLessThan(0.8);

    const off = makeWorld(2, (v) => {
      v[S.CHARGE] = 1.0;
      v[PARTICLE_STRIDE + S.CHARGE] = 0.2;
      v[PARTICLE_STRIDE + S.SPECIES_ID] = 0;
    });
    solve(off.view, 2, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(Math.abs(off.view[S.CHARGE] - off.view[PARTICLE_STRIDE + S.CHARGE])).toBeCloseTo(0.8, 5);
  });

  it('ALLOY (41): cross-species fusion on overlap, gated by isSet', () => {
    const buf = view(2);
    seed(buf, 2);
    buf[PARTICLE_STRIDE + S.SPECIES_ID] = 1;
    const state = createLawState();
    set(state, LAW_INDEXES.ALLOY);
    expect(isSet(state, LAW_INDEXES.ALLOY)).toBe(true);
    applyAlloy(state, buf, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 0.3, 1);
    expect(buf[PARTICLE_STRIDE + S.DEAD]).toBe(1);
    expect(buf[S.MASS]).toBeCloseTo(1.65, 5); // 1.5 + 1.5*0.1
    // same species → no merge
    const same = view(2);
    seed(same, 2);
    applyAlloy(state, same, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 0.3, 1);
    expect(same[PARTICLE_STRIDE + S.DEAD]).toBe(0);
    // beyond overlap threshold → no merge
    const far = view(2);
    seed(far, 2);
    far[PARTICLE_STRIDE + S.SPECIES_ID] = 1;
    applyAlloy(state, far, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 2.0, 1);
    expect(far[PARTICLE_STRIDE + S.DEAD]).toBe(0);
    // gate off → no merge
    const off = view(2);
    seed(off, 2);
    off[PARTICLE_STRIDE + S.SPECIES_ID] = 1;
    applyAlloy(createLawState(), off, 0, PARTICLE_STRIDE, PARTICLE_STRIDE, 0.3, 1);
    expect(off[PARTICLE_STRIDE + S.DEAD]).toBe(0);
  });

  it('ALLOY integration: overlapping cross-species pair fuses in solve()', () => {
    const on = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.POS_X] = 100.3; // dist 0.3
    });
    const st = createLawState();
    set(st, LAW_INDEXES.ALLOY);
    solve(on.view, 2, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[PARTICLE_STRIDE + S.DEAD]).toBe(1);
    expect(on.view[S.MASS]).toBeGreaterThan(1.5);

    const off = makeWorld(2, (v) => {
      v[PARTICLE_STRIDE + S.POS_X] = 100.3;
    });
    solve(off.view, 2, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[PARTICLE_STRIDE + S.DEAD]).toBe(0);
    expect(off.view[S.MASS]).toBe(1.5);
  });

  it('MELT (42): hot particles lose mass and cool, gated by isSet', () => {
    const buf = view(1);
    seed(buf, 1);
    buf[S.TEMPERATURE] = 1.0;
    const state = createLawState();
    set(state, LAW_INDEXES.MELT);
    expect(isSet(state, LAW_INDEXES.MELT)).toBe(true);
    applyMelt(state, buf, 0, 1, 1);
    expect(buf[S.MASS]).toBeCloseTo(1.497, 5); // 1.5 - 0.3*0.01
    expect(buf[S.TEMPERATURE]).toBeLessThan(1.0);
    // below threshold (0.7) → unchanged
    const cool = view(1);
    seed(cool, 1);
    cool[S.TEMPERATURE] = 0.5;
    applyMelt(state, cool, 0, 1, 1);
    expect(cool[S.MASS]).toBe(1.5);
    // gate off → unchanged
    const off = view(1);
    seed(off, 1);
    off[S.TEMPERATURE] = 1.0;
    applyMelt(createLawState(), off, 0, 1, 1);
    expect(off[S.MASS]).toBe(1.5);
  });

  it('MELT integration: high-temperature particle sheds mass', () => {
    const on = makeWorld(1, (v) => {
      v[S.TEMPERATURE] = 1.0;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.MELT);
    solve(on.view, 1, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.MASS]).toBeLessThan(1.5);

    const off = makeWorld(1, (v) => {
      v[S.TEMPERATURE] = 1.0;
    });
    solve(off.view, 1, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.MASS]).toBe(1.5);
  });

  it('BOIL (43): very hot particles eject mass and cool, gated by isSet', () => {
    const buf = view(1);
    seed(buf, 1);
    buf[S.MASS] = 10;
    buf[S.TEMPERATURE] = 1.0;
    const state = createLawState();
    set(state, LAW_INDEXES.BOIL);
    expect(isSet(state, LAW_INDEXES.BOIL)).toBe(true);
    applyBoil(state, buf, 0, 1, 1);
    expect(buf[S.MASS]).toBeLessThan(10); // ejectMass = 10*0.002 = 0.02 > 0.01
    expect(buf[S.TEMPERATURE]).toBeLessThan(1.0);
    // below threshold (0.9) → unchanged
    const warm = view(1);
    seed(warm, 1);
    warm[S.MASS] = 10;
    warm[S.TEMPERATURE] = 0.5;
    applyBoil(state, warm, 0, 1, 1);
    expect(warm[S.MASS]).toBe(10);
    // ejection too small (mass 1.5 → ejectMass 0.003 < 0.01) → unchanged
    const small = view(1);
    seed(small, 1);
    small[S.TEMPERATURE] = 1.0;
    applyBoil(state, small, 0, 1, 1);
    expect(small[S.MASS]).toBe(1.5);
    // gate off → unchanged
    const off = view(1);
    seed(off, 1);
    off[S.MASS] = 10;
    off[S.TEMPERATURE] = 1.0;
    applyBoil(createLawState(), off, 0, 1, 1);
    expect(off[S.MASS]).toBe(10);
  });

  it('BOIL integration: hot massive particle ejects mass in solve()', () => {
    const on = makeWorld(1, (v) => {
      v[S.MASS] = 50; // at DT=0.25, ejectMass = 50*0.0005 = 0.025 > 0.01 threshold
      v[S.TEMPERATURE] = 1.0;
    });
    const st = createLawState();
    set(st, LAW_INDEXES.BOIL);
    solve(on.view, 1, PARTICLE_STRIDE, st, on.dna, WORLD, DT, rng);
    expect(on.view[S.MASS]).toBeLessThan(50);

    const off = makeWorld(1, (v) => {
      v[S.MASS] = 50;
      v[S.TEMPERATURE] = 1.0;
    });
    solve(off.view, 1, PARTICLE_STRIDE, createLawState(), off.dna, WORLD, DT, rng);
    expect(off.view[S.MASS]).toBe(50);
  });
});
