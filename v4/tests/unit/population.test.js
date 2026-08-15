import { describe, it, expect, beforeEach } from 'vitest';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createDNABuffer, loadDefaults } from '../../src/dna/dnaBuffer.js';
import { createWorldParams } from '../../src/state/worldParams.js';
import { createLawState, set as lawSet } from '../../src/state/lawState.js';
import { SplitMix32 } from '../../src/core/prng.js';
import { solve, resetOffspringRing, drainOffspring } from '../../src/physics/solver.js';
import { WORLD_SIZE, PARTICLE_STRIDE, MAX_PARTICLES, STRIDE_INDEXES, DNA_RANGES, DNA_INDEXES, LAW_INDEXES } from '../../src/constants.js';
import {
    createPopulationController,
    SPECIES_PROFILES,
    EXTRA_SPECIES_COLORS,
    profileColor,
    setDNAFromProfile,
} from '../../src/spawn/population.js';

const S = STRIDE_INDEXES;

function makeEnv() {
    const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
    const dna = createDNABuffer();
    loadDefaults(dna, DNA_RANGES);
    const worldParams = createWorldParams();
    let prng = new SplitMix32(1234);
    const env = {
        view: () => buf.view,
        buffer: () => buf.buffer,
        dna: () => dna,
        worldParams: () => worldParams,
        worldSize: () => WORLD_SIZE,
        rng: () => prng,
    };
    return { env, buf, dna, worldParams, resetRng: (seed = 1234) => { prng = new SplitMix32(seed); } };
}

describe('species profiles', () => {
    it('defines the 5 built-in profiles with a colour and DNA knobs', () => {
        expect(SPECIES_PROFILES).toHaveLength(5);
        for (const p of SPECIES_PROFILES) {
            expect(p.name).toBeTruthy();
            expect(p.color).toHaveLength(3);
            expect(Object.keys(p).length).toBeGreaterThan(2);
        }
    });

    it('profileColor returns the profile colour and falls back to the extra rotation', () => {
        expect(profileColor(0)).toEqual([255, 80, 80]); // Predator
        expect(profileColor(2)).toEqual([80, 255, 120]); // Life
        expect(profileColor(5)).toEqual(EXTRA_SPECIES_COLORS[5 % EXTRA_SPECIES_COLORS.length]);
        expect(profileColor(99)).toEqual(EXTRA_SPECIES_COLORS[99 % EXTRA_SPECIES_COLORS.length]);
    });

    it('setDNAFromProfile quantizes profile knobs into the species genome', () => {
        const { dna } = makeEnv();
        setDNAFromProfile(dna, 0, { birthRate: 0.3 });
        const idx = DNA_INDEXES.BIRTH_RATE;
        const r = DNA_RANGES[idx];
        const expected = Math.round(((0.3 - r.min) / (r.max - r.min)) * 65535);
        expect(Math.abs(dna[0 * 64 + idx] - expected)).toBeLessThan(2);
        // Unmapped keys are ignored
        expect(() => setDNAFromProfile(dna, 0, { name: 'x' })).not.toThrow();
    });
});

describe('createPopulationController', () => {
    let setup;
    beforeEach(() => { setup = makeEnv(); resetOffspringRing(); });

    it('spawns the initial population and returns the new counts', () => {
        const pop = createPopulationController(setup.env);
        const { count, speciesCount } = pop.spawnDefaultPopulation(0, 5);
        expect(count).toBeGreaterThan(0);
        expect(speciesCount).toBe(5);
        // Every spawned particle is alive with a species id and profile colour
        for (let i = 0; i < count; i++) {
            const base = i * PARTICLE_STRIDE;
            expect(setup.buf.view[base + S.DEAD]).toBe(0);
            expect(setup.buf.view[base + S.SPECIES_ID]).toBeGreaterThanOrEqual(0);
            expect(setup.buf.view[base + S.SPECIES_ID]).toBeLessThan(5);
            expect(setup.buf.view[base + S.TEMPERATURE]).toBe(0.5);
            expect(setup.buf.view[base + S.BOND_PARTNER_1]).toBe(-1);
            expect(setup.buf.view[base + S.ENTANGLE_ID]).toBe(-1);
            expect(setup.buf.view[base + S.COLOR_R]).toBeGreaterThan(0);
        }
        // Every DNA cache locus must be a finite float (regression: a buffer
        // shadowing bug once wrote NaN into the cache, silently disabling REPRO).
        const p0 = 0 * PARTICLE_STRIDE + S.DNA_CACHE_START;
        for (let d = 0; d < 42; d++) {
            expect(Number.isFinite(setup.buf.view[p0 + d]), `dna cache[${d}]`).toBe(true);
        }
    });

    it('keepSpecies preserves the caller roster, preserveDNA keeps the genome', () => {
        const pop = createPopulationController(setup.env);
        // Seed the genome with a distinctive value, then preserve it.
        setup.dna[0 * 64 + 10] = 9999;
        const { count, speciesCount } = pop.spawnDefaultPopulation(0, 3, true, true);
        expect(speciesCount).toBe(3); // roster not reset to profile count
        expect(count).toBeGreaterThan(0);
        expect(setup.dna[0 * 64 + 10]).toBe(9999); // untouched
    });

    it('spawnSingleParticle appends at the given count and initializes stride fields', () => {
        const pop = createPopulationController(setup.env);
        let count = 0;
        count = pop.spawnSingleParticle(2, { x: 100, y: 200, z: 300 }, count);
        expect(count).toBe(1);
        const base = 0;
        expect(setup.buf.view[base + S.POS_X]).toBe(100);
        expect(setup.buf.view[base + S.POS_Y]).toBe(200);
        expect(setup.buf.view[base + S.POS_Z]).toBe(300);
        expect(setup.buf.view[base + S.SPECIES_ID]).toBe(2);
        expect(setup.buf.view[base + S.ENERGY]).toBeGreaterThanOrEqual(50);
        expect(setup.buf.view[base + S.ALPHA]).toBeCloseTo(0.8, 5);
        expect(setup.buf.view[base + S.RADIUS]).toBeCloseTo(0.6, 5);
        // DNA cache populated from the species genome
        const first = setup.buf.view[base + S.DNA_CACHE_START + 0];
        expect(Number.isFinite(first)).toBe(true);
    });

    it('spawnSingleParticle caps at MAX_PARTICLES', () => {
        const pop = createPopulationController(setup.env);
        expect(pop.spawnSingleParticle(0, { x: 0, y: 0, z: 0 }, MAX_PARTICLES)).toBe(MAX_PARTICLES);
    });

    it('spawnOffspring integrates REPRO offspring from the solver ring', () => {
        const pop = createPopulationController(setup.env);
        const { count } = pop.spawnDefaultPopulation(0, 1);
        const lawState = createLawState();
        lawSet(lawState, LAW_INDEXES.REPRO); // REPRO=10
        // REPRO needs drive >= 60 (~1200 ticks at default birth rate) and
        // age >= 100, so drive long enough for the first offspring to queue.
        const rng = new SplitMix32(42);
        const next = () => rng.next();
        let countNow = count;
        for (let t = 0; t < 3000 && countNow < MAX_PARTICLES; t++) {
            solve(setup.buf.view, countNow, PARTICLE_STRIDE, lawState, setup.dna, WORLD_SIZE, 1.0, next);
            const before = countNow;
            countNow = pop.spawnOffspring(countNow);
            if (countNow > before) break;
        }
        expect(countNow).toBeGreaterThan(count);
    });
});
