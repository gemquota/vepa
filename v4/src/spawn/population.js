/**
 * VEPA v4 — Population controller
 *
 * Owns the species profiles and every way a particle enters the world
 * buffer: the initial population, the SPAWN_RATE feed, and REPRO offspring.
 * Extracted from main.js (P1: main.js → focused modules) so the bootstrap
 * file no longer carries ~250 lines of spawn/roster logic.
 *
 * The controller is a pure function of its inputs: `count` is passed in and
 * the new count is returned, so the caller (main.js) keeps its own counters
 * and there is no hidden module-level population state.
 */
import { PARTICLE_STRIDE, MAX_PARTICLES, MAX_SPECIES, STRIDE_INDEXES, DNA_INDEXES, DNA_RANGES } from '../constants.js';
import { setX, setY, setVelocity, setMass, setSpeciesId, setEnergy } from '../state/particleBuffer.js';
import { getDNAFloat } from '../dna/dnaBuffer.js';
import { spawnCaps } from '../state/worldParams.js';
import { buildSpawnCentres, initialPopulationTarget, perSpeciesAllocation } from './distribution.js';
import { drainOffspring } from '../physics/solver.js';

const S = STRIDE_INDEXES;

// Fallback colours for user-added species beyond the built-in profiles
// (matches the species panel's deterministic hue rotation).
export const EXTRA_SPECIES_COLORS = [
    [120, 160, 255], [255, 140, 60], [180, 255, 120], [255, 120, 220],
    [120, 255, 220], [240, 220, 100], [160, 120, 255], [255, 160, 160],
];

export const SPECIES_PROFILES = [
    { name: 'Predator', color: [255, 80, 80], force: 1.2, viscosity: 0.95, birthRate: 0.3, predationBias: 0.8 },
    { name: 'Sol', color: [255, 200, 50], force: 0.8, viscosity: 0.97, birthRate: 0.1, fusion: 2.0 },
    { name: 'Life', color: [80, 255, 120], force: 1.0, viscosity: 0.98, birthRate: 0.5, mutation: 0.3 },
    { name: 'Aether', color: [120, 160, 255], force: 0.5, viscosity: 0.99, signalResp: 2.0, pulseRate: 0.3 },
    { name: 'Void', color: [100, 60, 140], force: -0.5, viscosity: 0.96, deathRate: 0.2, hiddenMass: 3.0 },
];

/** Species colour: built-in profile colour, or the extra-colour rotation. */
export function profileColor(species) {
    const p = SPECIES_PROFILES[species];
    if (p) return p.color;
    return EXTRA_SPECIES_COLORS[species % EXTRA_SPECIES_COLORS.length];
}

/** Write a species profile's DNA knobs into the species genome buffer. */
export function setDNAFromProfile(dnaBuffer, species, profile) {
    const MAP = {
        force: 'FORCE', viscosity: 'VISCOSITY', birthRate: 'BIRTH_RATE',
        predationBias: 'PREDATION_BIAS', fusion: 'FUSION', mutation: 'MUTATION',
        signalResp: 'SIGNAL_RESP', pulseRate: 'PULSE_RATE', deathRate: 'DEATH_RATE',
        hiddenMass: 'HIDDEN_MASS',
    };
    for (const [key, value] of Object.entries(profile)) {
        const dnaKey = MAP[key];
        if (!dnaKey) continue;
        const paramIdx = DNA_INDEXES[dnaKey];
        if (paramIdx === undefined) continue;
        const r = DNA_RANGES[paramIdx];
        const clamped = Math.max(r.min, Math.min(r.max, value));
        const normalized = (clamped - r.min) / (r.max - r.min);
        dnaBuffer[species * 64 + paramIdx] = Math.round(normalized * 65535);
    }
}

/**
 * Create the population controller. `env` carries live getters so the
 * controller always reads the current world state:
 *   view/buffer — the particle Float32Array + backing buffer
 *   dna         — the species DNA buffer
 *   worldParams — live world-param object (WORLD panel sliders)
 *   worldSize   — current world size
 *   rng         — SplitMix32 instance (prng.nextFloat(lo, hi))
 *   onBirth     — optional (parentId, childId, speciesId) lineage hook
 */
export function createPopulationController(env) {
    const view = () => env.view();
    const buffer = () => env.buffer();
    const dna = () => env.dna();
    const worldParams = () => env.worldParams();
    const worldSize = () => env.worldSize();
    const rng = () => env.rng();
    const onBirth = env.onBirth || (() => {});

    /** Append one freshly spawned particle at `pos` with the given species. */
    function spawnSingleParticle(species, pos, count) {
        if (count >= MAX_PARTICLES) return count;
        const idx = count;
        const ptr = idx * PARTICLE_STRIDE;
        const buf = buffer();
        setX(buf, idx, PARTICLE_STRIDE, pos.x);
        setY(buf, idx, PARTICLE_STRIDE, pos.y);
        view()[ptr + S.POS_Z] = pos.z;
        setVelocity(buf, idx, PARTICLE_STRIDE, 0, 0, 0);
        setMass(buf, idx, PARTICLE_STRIDE, 1.0 + rng().nextFloat(0, 1.0));
        setSpeciesId(buf, idx, PARTICLE_STRIDE, species);
        setEnergy(buf, idx, PARTICLE_STRIDE, 50 + rng().nextFloat(0, 50));
        for (let d = 0; d < 42; d++) {
            const r = DNA_RANGES[d] || { min: -1, max: 1 };
            view()[ptr + S.DNA_CACHE_START + d] = getDNAFloat(dna(), species, d, r.min, r.max);
        }
        const sp = SPECIES_PROFILES[species] || SPECIES_PROFILES[0];
        view()[ptr + S.COLOR_R] = sp.color[0];
        view()[ptr + S.COLOR_G] = sp.color[1];
        view()[ptr + S.COLOR_B] = sp.color[2];
        view()[ptr + S.DEAD] = 0;
        view()[ptr + S.AGE] = 0;
        view()[ptr + S.SIGNAL] = 0;
        view()[ptr + S.BOND_COUNT] = 0;
        view()[ptr + S.BOND_PARTNER_1] = -1;
        view()[ptr + S.BOND_PARTNER_2] = -1;
        view()[ptr + S.BOND_PARTNER_3] = -1;
        view()[ptr + S.BOND_PARTNER_4] = -1;
        view()[ptr + S.BOND_PARTNER_5] = -1;
        view()[ptr + S.BOND_PARTNER_6] = -1;
        view()[ptr + S.MEMORY] = 0;
        view()[ptr + S.HUNGER] = 0;
        view()[ptr + S.ARMOR] = rng().nextFloat(0, 0.5);
        view()[ptr + S.MITOSIS_TIMER] = 0;
        view()[ptr + S.PARTNER_ID] = -1;
        view()[ptr + S.TEMPERATURE] = 0.5;
        view()[ptr + S.CHARGE] = 0;
        view()[ptr + S.ALPHA] = 0.8;
        view()[ptr + S.RADIUS] = 0.6;
        view()[ptr + S.ENTANGLE_ID] = -1;
        view()[ptr + S.ENTANGLE_PHASE] = 0;
        return count + 1;
    }

    /**
     * Seed the initial population across the configured species roster.
     * Returns { count, speciesCount } — the caller keeps its own counters.
     */
    function spawnDefaultPopulation(count, speciesCount, preserveDNA = false, keepSpecies = false) {
        const profiles = SPECIES_PROFILES;

        // Restart preserves the roster the user built; boot/reset restore it.
        if (!keepSpecies) speciesCount = Math.min(profiles.length, MAX_SPECIES);
        let idx = count;
        // INITIAL_POP: total initial population distributed across species.
        const wp = worldParams();
        const caps = spawnCaps(wp);
        const totalTarget = initialPopulationTarget(wp, caps);
        const perSpecies = perSpeciesAllocation(totalTarget, speciesCount);
        const groundH = Math.max(0, Math.min(1, wp.GROUND_HEIGHT));
        const buf = buffer();
        const v = view();
        const ws = worldSize();
        const r = rng();
        const db = dna();

        for (let s = 0; s < speciesCount; s++) {
            const p = profiles[s] || null;
            if (p && !preserveDNA) setDNAFromProfile(db, s, p);

            // Per-species 3D grid spanning the full world volume — populations
            // start interleaved across the dish instead of clumped in depth slabs.
            const gridDim = Math.max(2, Math.ceil(Math.cbrt(perSpecies)));
            const cellSize = (ws - 10) / gridDim;

            const centres = buildSpawnCentres(
                Math.max(1, Math.min(64, Math.round(wp.SPAWN_CENTRES) || 1)),
                wp.SPAWN_CENTRE_RANDOM,
                ws,
                r,
            );

            for (let i = 0; i < perSpecies && idx < caps.hardCap; i++) {
                const ptr = idx * PARTICLE_STRIDE;
                const gx = i % gridDim;
                const gy = Math.floor(i / gridDim) % gridDim;
                const gz = Math.floor(i / (gridDim * gridDim));
                // Even-grid anchor with per-cell jitter for a natural look
                let px = 5 + gx * cellSize + cellSize * 0.5 + (r.nextFloat(0, 1) - 0.5) * cellSize * 0.4;
                let py = 5 + gy * cellSize + cellSize * 0.5 + (r.nextFloat(0, 1) - 0.5) * cellSize * 0.4;
                let pz = 5 + gz * cellSize + cellSize * 0.5 + (r.nextFloat(0, 1) - 0.5) * cellSize * 0.4;
                // Distribution: shape 0 = perfectly even grid, 1 = fully random
                if (wp.SHAPE > 0) {
                    px = px + (r.nextFloat(0, ws) - px) * wp.SHAPE;
                    py = py + (r.nextFloat(0, ws) - py) * wp.SHAPE;
                    pz = pz + (r.nextFloat(0, ws) - pz) * wp.SHAPE;
                }
                // Centre bias: pull the particle toward a cluster centre
                if (wp.SPAWN_CENTRE_BIAS > 0 && centres.length > 0) {
                    const c = centres[Math.floor(r.nextFloat(0, centres.length))];
                    px = px + (c.x - px) * wp.SPAWN_CENTRE_BIAS;
                    py = py + (c.y - py) * wp.SPAWN_CENTRE_BIAS;
                    pz = pz + (c.z - pz) * wp.SPAWN_CENTRE_BIAS;
                }
                // GROUND_HEIGHT: keep the initial population inside the ground band.
                if (groundH < 1) pz = Math.min(pz, Math.max(0, ws * groundH));
                setX(buf, idx, PARTICLE_STRIDE, px);
                setY(buf, idx, PARTICLE_STRIDE, py);
                v[ptr + S.POS_Z] = pz;
                setVelocity(buf, idx, PARTICLE_STRIDE, 0, 0, 0);
                setMass(buf, idx, PARTICLE_STRIDE, 1.0 + r.nextFloat(0, 1.0));
                setSpeciesId(buf, idx, PARTICLE_STRIDE, s);
                setEnergy(buf, idx, PARTICLE_STRIDE, 50 + r.nextFloat(0, 50));
                // Copy species DNA to particle DNA cache (stride 8-49)
                const dnaBase = s * 64;
                for (let d = 0; d < 42; d++) {
                    const raw = db[dnaBase + d] || 0;
                    const norm = raw / 65535;
                    const dr = DNA_RANGES[d] || { min: -1, max: 1 };
                    v[ptr + S.DNA_CACHE_START + d] = norm * (dr.max - dr.min) + dr.min;
                }
                v[ptr + S.DEAD] = 0;
                v[ptr + S.AGE] = 0;
                v[ptr + S.SIGNAL] = 0;
                v[ptr + S.BOND_COUNT] = 0;
                v[ptr + S.BOND_PARTNER_1] = -1;
                v[ptr + S.BOND_PARTNER_2] = -1;
                v[ptr + S.BOND_PARTNER_3] = -1;
                v[ptr + S.BOND_PARTNER_4] = -1;
                v[ptr + S.BOND_PARTNER_5] = -1;
                v[ptr + S.BOND_PARTNER_6] = -1;
                v[ptr + S.MEMORY] = 0;
                v[ptr + S.HUNGER] = 0;
                v[ptr + S.ARMOR] = r.nextFloat(0, 0.5);
                v[ptr + S.MITOSIS_TIMER] = 0;
                v[ptr + S.PARTNER_ID] = -1;
                v[ptr + S.TEMPERATURE] = 0.5;
                v[ptr + S.CHARGE] = 0;
                v[ptr + S.ELECTRIC_ENERGY] = 0;
                v[ptr + S.STORED_ENERGY] = 0;
                v[ptr + S.REPRO_DRIVE] = 0;
                v[ptr + S.RADIATION_EXPOSURE] = 0;
                v[ptr + S.PHASE_1] = 0;
                v[ptr + S.PHASE_2] = 0;
                v[ptr + S.SOUL] = 0;
                v[ptr + S.TRAIL_X] = 0;
                v[ptr + S.TRAIL_Y] = 0;
                v[ptr + S.TRAIL_Z] = 0;
                v[ptr + S.ENTANGLE_ID] = -1;
                v[ptr + S.ENTANGLE_PHASE] = 0;

                for (let d = 0; d < 42; d++) {
                    v[ptr + S.DNA_CACHE_START + d] = getDNAFloat(db, s, d, DNA_RANGES[d].min, DNA_RANGES[d].max);
                }

                const col = profileColor(s);
                v[ptr + S.COLOR_R] = col[0];
                v[ptr + S.COLOR_G] = col[1];
                v[ptr + S.COLOR_B] = col[2];
                v[ptr + S.ALPHA] = 0.8;
                v[ptr + S.RADIUS] = 0.6;
                idx++;
            }
        }
        return { count: idx, speciesCount };
    }

    /**
     * Integrate REPRO offspring queued by the solver into the buffer.
     * Returns the new particle count.
     */
    function spawnOffspring(count) {
        const list = drainOffspring();
        if (!list.length) return count;
        const buf = buffer();
        const v = view();
        for (const off of list) {
            if (count >= MAX_PARTICLES) break;
            const ptr = count * PARTICLE_STRIDE;
            setX(buf, count, PARTICLE_STRIDE, off.x);
            setY(buf, count, PARTICLE_STRIDE, off.y);
            v[ptr + S.POS_Z] = off.z || 0;
            setVelocity(buf, count, PARTICLE_STRIDE, off.vx || 0, off.vy || 0, off.vz || 0);
            setMass(buf, count, PARTICLE_STRIDE, off.mass || 1.0);
            setSpeciesId(buf, count, PARTICLE_STRIDE, off.speciesId);
            setEnergy(buf, count, PARTICLE_STRIDE, off.energy || 60);
            if (off.dna && off.dna.length) {
                for (let d = 0; d < 42 && d < off.dna.length; d++) {
                    v[ptr + S.DNA_CACHE_START + d] = off.dna[d];
                }
            }
            v[ptr + S.DEAD] = 0;
            v[ptr + S.AGE] = 0;
            v[ptr + S.SIGNAL] = 0;
            v[ptr + S.BOND_COUNT] = 0;
            v[ptr + S.BOND_PARTNER_1] = -1;
            v[ptr + S.BOND_PARTNER_2] = -1;
            v[ptr + S.BOND_PARTNER_3] = -1;
            v[ptr + S.BOND_PARTNER_4] = -1;
            v[ptr + S.BOND_PARTNER_5] = -1;
            v[ptr + S.BOND_PARTNER_6] = -1;
            v[ptr + S.MEMORY] = 0;
            v[ptr + S.HUNGER] = 0;
            v[ptr + S.ARMOR] = 0.2;
            v[ptr + S.MITOSIS_TIMER] = 0;
            v[ptr + S.PARTNER_ID] = -1;
            v[ptr + S.TEMPERATURE] = 0.5;
            v[ptr + S.CHARGE] = 0;
            v[ptr + S.SOUL] = 0;
            v[ptr + S.ENTANGLE_ID] = -1;
            v[ptr + S.ENTANGLE_PHASE] = 0;
            // Inherit the parents' intermediate colour when reproduction carried
            // one; otherwise fall back to the species base colour.
            const sp = SPECIES_PROFILES[off.speciesId] || SPECIES_PROFILES[0];
            const defR = sp ? sp.color[0] : 200;
            const defG = sp ? sp.color[1] : 200;
            const defB = sp ? sp.color[2] : 200;
            v[ptr + S.COLOR_R] = off.colorR != null ? Math.max(0, Math.min(255, off.colorR)) : defR;
            v[ptr + S.COLOR_G] = off.colorG != null ? Math.max(0, Math.min(255, off.colorG)) : defG;
            v[ptr + S.COLOR_B] = off.colorB != null ? Math.max(0, Math.min(255, off.colorB)) : defB;
            v[ptr + S.ALPHA] = 0.8;
            v[ptr + S.RADIUS] = 0.6;
            count++;
            // v4 — lineage birth tracking
            onBirth(off.parentId != null ? off.parentId : -1, count - 1, off.speciesId);
        }
        return count;
    }

    return {
        spawnSingleParticle,
        spawnDefaultPopulation,
        spawnOffspring,
    };
}
