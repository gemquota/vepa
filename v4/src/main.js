/**
 * VEPA v3 — Main Bootstrap
 * SharedArrayBuffer optional — falls back to ArrayBuffer + main-thread tick.
 */
// === DEBUG OVERLAY ===
// One collapsible overlay collects every debug message since page start.
// Tap its header to copy the whole log as JSON; toggle in SETTINGS → DEBUG.
import { initDebug, logDebug, isDebugVisible, updateLiveStats } from './debug.js';
import { EventBus } from './core/eventBus.js';
import { SplitMix32 as PRNG } from './core/prng.js';
import { WORLD_SIZE, PARTICLE_STRIDE, MAX_PARTICLES, MAX_SPECIES, DEFAULT_PARTICLES_PER_SPECIES, STRIDE_INDEXES, DNA_INDEXES, DNA_RANGES, LAW_INDEXES, LAW_COUNT, LAW_CATEGORIES } from './constants.js';
import { createParticleBuffer, setX, setY, setVelocity, setMass, setSpeciesId, setEnergy } from './state/particleBuffer.js';
import { createLawState, set as lawSet, clear as lawClear, getActiveCount as getLawCount } from './state/lawState.js';
import { runtimeConfig } from './state/runtimeConfig.js';
import { createWorldParams, applyWorldParam, spawnCaps } from './state/worldParams.js';
import { sampleSpawnPosition, buildSpawnCentres, initialPopulationTarget, perSpeciesAllocation } from './spawn/distribution.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from './dna/dnaBuffer.js';
import { createRenderer, resize as resizeRenderer, paintBackground } from './render/renderer.js';
import { syncSprites } from './render/spriteSync.js';
import { initUI } from './ui/ui.js';
import { initCamera, resetCamera, setWorldSize } from './ui/camera.js';
import { solve, resetOffspringRing, drainOffspring } from './physics/solver.js';
import { createInsightEngine, update as updateInsight } from './engines/insightEngine.js';
import { createNarrativeEngine, update as updateNarrative } from './engines/narrativeEngine.js';
import { createLineageTracker, trackBirth, trackDeath } from './engines/lineageTracker.js';
import { createGoalEngine, setCurrentValue as setGoalValue, update as updateGoal } from './engines/goalEngine.js';
import { createTimelineEngine, snapshot as timelineSnapshot, getTimeline as getTimelineList, clearTimeline as clearTimelineEngine, scrub as timelineScrub } from './engines/timelineEngine.js';
import { createMultiplexController } from './multiplex/multiplexUI.js';
initDebug();
logDebug('main module loaded');



const SUBSTEPS = 4;
const DT = 0.25;

let bus, prng, particleBuffer, particleView, lawState, dnaBuffer, renderer;
// v4 — intelligence engines
let insightEngine, narrativeEngine, lineageEngine, goalEngine, timelineEngine;
let prevDead = new Uint8Array(0);
let timelineRecording = false;
const TIMELINE_SNAPSHOT_INTERVAL = 150;
let particleCount = 0, speciesCount = 5, tick = 0, paused = false;
let multiplexController = null;
let worldSize = WORLD_SIZE;
// World parameters — single source of truth (WORLD panel sliders).
// Mirrored into runtimeConfig.worldParams so the solver reads live values.
let worldParams = createWorldParams();
runtimeConfig.worldParams = worldParams;
let spawnRate = worldParams.SPAWN_RATE;
let spawnAccumulator = 0;
// Begin with all laws disabled — movement and interaction only exist once
// a law is enabled. Presets (and the user) turn laws on explicitly.
const DEFAULT_LAWS = [];

/** Wrap PRNG as a callable function (solver calls prng() not prng.next()) */
function rng() { return prng.next(); }

async function boot() {
    console.log('[VEPA v3] Booting...');
    logDebug('boot: starting');
    const t0 = performance.now();

    bus = new EventBus();
    prng = new PRNG(Date.now());

    const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
    particleBuffer = buf.buffer;
    particleView = buf.view;
    const isShared = buf.isShared;
    console.log(`[VEPA v3] SharedArrayBuffer: ${isShared}`);
    logDebug('SharedArrayBuffer: ' + isShared);

    lawState = createLawState();
    dnaBuffer = createDNABuffer();
    loadDefaults(dnaBuffer, DNA_RANGES);

    // Apply default laws (GRAV, DRAG, WRAP, COLL)
    for (const name of DEFAULT_LAWS) {
        if (LAW_INDEXES[name] !== undefined) lawSet(lawState, LAW_INDEXES[name]);
    }

    spawnDefaultPopulation();

    const canvas = document.getElementById('sim-canvas');
    renderer = createRenderer(canvas, MAX_PARTICLES);
    resizeRenderer(renderer);
    refreshBackground();
    // Re-render on window resize
    window.addEventListener('resize', () => {
        if (renderer) resizeRenderer(renderer);
        refreshBackground();
    });
    // Also observe the canvas for layout changes
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
            if (renderer) resizeRenderer(renderer);
        });
        ro.observe(canvas);
    }
    initCamera(canvas, worldSize);

    // Init UI (includes HUD, all panels, event wiring)
    initUI(bus, lawState, dnaBuffer);
    wireEvents();

    // Chaos Multiplex — long-press the Chaos button opens the guided-evolution
    // grid; while active, the main sim freezes and shards take over the loop.
    multiplexController = createMultiplexController(bus, () => ({
        view: particleView,
        count: particleCount,
        dna: dnaBuffer,
        laws: lawState,
        speciesCount,
    }));
    window.openChaosMultiplex = () => { if (multiplexController) multiplexController.openModal(); };
    bus.on('multiplex:started', () => {
        paused = true;
        bus.emit('sim:paused', { paused: true });
    });
    bus.on('multiplex:exited', () => {
        paused = false;
        bus.emit('sim:paused', { paused: false });
    });

    // v4 — intelligence engine wiring
    insightEngine = createInsightEngine(bus, { scanInterval: 90, clusterRadius: 60, minClusterSize: 5 });
    narrativeEngine = createNarrativeEngine(bus);
    lineageEngine = createLineageTracker(bus);
    goalEngine = createGoalEngine(bus);
    timelineEngine = createTimelineEngine(bus, { autoSnapshotInterval: 0, maxSnapshots: 20 });
    setGoalValue(goalEngine, 'scanInterval', insightEngine.cfg.scanInterval);
    setGoalValue(goalEngine, 'clusterRadius', insightEngine.cfg.clusterRadius);
    setGoalValue(goalEngine, 'maxForce', runtimeConfig.maxForce);
    setGoalValue(goalEngine, 'drag', runtimeConfig.dragMultiplier);
    setGoalValue(goalEngine, 'birthRate', runtimeConfig.birthRate);
    setGoalValue(goalEngine, 'deathRate', runtimeConfig.deathRate);
    wireGoalEvents();
    prevDead = new Uint8Array(particleCount);

    requestAnimationFrame(renderLoop);

    const dt = (performance.now() - t0).toFixed(1);
    console.log(`[VEPA v3] Booted in ${dt}ms — ${particleCount} particles, ${speciesCount} species`);
    logDebug(`booted in ${dt}ms — ${particleCount} particles, ${speciesCount} species`);
    bus.emit('boot:complete', { particleCount, speciesCount, dt });
}

// Fallback colours for user-added species beyond the built-in profiles
// (matches the species panel's deterministic hue rotation).
const EXTRA_SPECIES_COLORS = [
    [120, 160, 255], [255, 140, 60], [180, 255, 120], [255, 120, 220],
    [120, 255, 220], [240, 220, 100], [160, 120, 255], [255, 160, 160],
];

function profileColor(s) {
    const p = SPECIES_PROFILES[s];
    if (p) return p.color;
    return EXTRA_SPECIES_COLORS[s % EXTRA_SPECIES_COLORS.length];
}

const SPECIES_PROFILES = [
    { name: 'Predator', color: [255, 80, 80], force: 1.2, viscosity: 0.95, birthRate: 0.3, predationBias: 0.8 },
    { name: 'Sol', color: [255, 200, 50], force: 0.8, viscosity: 0.97, birthRate: 0.1, fusion: 2.0 },
    { name: 'Life', color: [80, 255, 120], force: 1.0, viscosity: 0.98, birthRate: 0.5, mutation: 0.3 },
    { name: 'Aether', color: [120, 160, 255], force: 0.5, viscosity: 0.99, signalResp: 2.0, pulseRate: 0.3 },
    { name: 'Void', color: [100, 60, 140], force: -0.5, viscosity: 0.96, deathRate: 0.2, hiddenMass: 3.0 },
];

/** Append one freshly spawned particle at `pos` with the given species. */
function spawnSingleParticle(species, pos) {
    if (particleCount >= MAX_PARTICLES) return;
    const idx = particleCount;
    const ptr = idx * PARTICLE_STRIDE;
    setX(particleBuffer, idx, PARTICLE_STRIDE, pos.x);
    setY(particleBuffer, idx, PARTICLE_STRIDE, pos.y);
    particleView[ptr + STRIDE_INDEXES.POS_Z] = pos.z;
    setVelocity(particleBuffer, idx, PARTICLE_STRIDE, 0, 0, 0);
    setMass(particleBuffer, idx, PARTICLE_STRIDE, 1.0 + prng.nextFloat(0, 1.0));
    setSpeciesId(particleBuffer, idx, PARTICLE_STRIDE, species);
    setEnergy(particleBuffer, idx, PARTICLE_STRIDE, 50 + prng.nextFloat(0, 50));
    for (let d = 0; d < 42; d++) {
        const r = DNA_RANGES[d] || { min: -1, max: 1 };
        particleView[ptr + STRIDE_INDEXES.DNA_CACHE_START + d] = getDNAFloat(dnaBuffer, species, d, r.min, r.max);
    }
    const sp = SPECIES_PROFILES[species] || SPECIES_PROFILES[0];
    particleView[ptr + STRIDE_INDEXES.COLOR_R] = sp.color[0];
    particleView[ptr + STRIDE_INDEXES.COLOR_G] = sp.color[1];
    particleView[ptr + STRIDE_INDEXES.COLOR_B] = sp.color[2];
    particleView[ptr + STRIDE_INDEXES.DEAD] = 0;
    particleView[ptr + STRIDE_INDEXES.AGE] = 0;
    particleView[ptr + STRIDE_INDEXES.SIGNAL] = 0;
    particleView[ptr + STRIDE_INDEXES.BOND_COUNT] = 0;
    particleView[ptr + STRIDE_INDEXES.BOND_PARTNER_1] = -1;
    particleView[ptr + STRIDE_INDEXES.BOND_PARTNER_2] = -1;
    particleView[ptr + STRIDE_INDEXES.MEMORY] = 0;
    particleView[ptr + STRIDE_INDEXES.HUNGER] = 0;
    particleView[ptr + STRIDE_INDEXES.ARMOR] = prng.nextFloat(0, 0.5);
    particleView[ptr + STRIDE_INDEXES.MITOSIS_TIMER] = 0;
    particleView[ptr + STRIDE_INDEXES.PARTNER_ID] = -1;
    particleView[ptr + STRIDE_INDEXES.TEMPERATURE] = 0.5;
    particleView[ptr + STRIDE_INDEXES.CHARGE] = 0;
    particleView[ptr + STRIDE_INDEXES.ALPHA] = 0.8;
    particleView[ptr + STRIDE_INDEXES.RADIUS] = 0.6;
    particleView[ptr + STRIDE_INDEXES.ENTANGLE_ID] = -1;
    particleView[ptr + STRIDE_INDEXES.ENTANGLE_PHASE] = 0;
    particleCount++;
}

function spawnDefaultPopulation(preserveDNA = false, keepSpecies = false) {
    const profiles = SPECIES_PROFILES;

    // Restart preserves the roster the user built; boot/reset restore it.
    if (!keepSpecies) speciesCount = Math.min(profiles.length, MAX_SPECIES);
    let idx = 0;
    // INITIAL_POP: total initial population distributed across species.
    const caps = spawnCaps(worldParams);
    const totalTarget = initialPopulationTarget(worldParams, caps);
    const perSpecies = perSpeciesAllocation(totalTarget, speciesCount);
    const groundH = Math.max(0, Math.min(1, worldParams.GROUND_HEIGHT));

    for (let s = 0; s < speciesCount; s++) {
        const p = profiles[s] || null;
        if (p && !preserveDNA) setDNAFromProfile(s, p);

        // Per-species 3D grid spanning the full world volume — populations
        // start interleaved across the dish instead of clumped in depth slabs.
        const gridDim = Math.max(2, Math.ceil(Math.cbrt(perSpecies)));
        const cellSize = (worldSize - 10) / gridDim;

        const centres = buildSpawnCentres(
            Math.max(1, Math.min(64, Math.round(worldParams.SPAWN_CENTRES) || 1)),
            worldParams.SPAWN_CENTRE_RANDOM,
            worldSize,
            prng,
        );

        for (let i = 0; i < perSpecies && idx < caps.hardCap; i++) {
            const ptr = idx * PARTICLE_STRIDE;
            const gx = i % gridDim;
            const gy = Math.floor(i / gridDim) % gridDim;
            const gz = Math.floor(i / (gridDim * gridDim));
            // Even-grid anchor with per-cell jitter for a natural look
            let px = 5 + gx * cellSize + cellSize * 0.5 + (prng.nextFloat(0, 1) - 0.5) * cellSize * 0.4;
            let py = 5 + gy * cellSize + cellSize * 0.5 + (prng.nextFloat(0, 1) - 0.5) * cellSize * 0.4;
            let pz = 5 + gz * cellSize + cellSize * 0.5 + (prng.nextFloat(0, 1) - 0.5) * cellSize * 0.4;
            // Distribution: shape 0 = perfectly even grid, 1 = fully random
            if (worldParams.SHAPE > 0) {
                px = px + (prng.nextFloat(0, worldSize) - px) * worldParams.SHAPE;
                py = py + (prng.nextFloat(0, worldSize) - py) * worldParams.SHAPE;
                pz = pz + (prng.nextFloat(0, worldSize) - pz) * worldParams.SHAPE;
            }
            // Centre bias: pull the particle toward a cluster centre
            if (worldParams.SPAWN_CENTRE_BIAS > 0 && centres.length > 0) {
                const c = centres[Math.floor(prng.nextFloat(0, centres.length))];
                px = px + (c.x - px) * worldParams.SPAWN_CENTRE_BIAS;
                py = py + (c.y - py) * worldParams.SPAWN_CENTRE_BIAS;
                pz = pz + (c.z - pz) * worldParams.SPAWN_CENTRE_BIAS;
            }
            // GROUND_HEIGHT: keep the initial population inside the ground band.
            if (groundH < 1) pz = Math.min(pz, Math.max(0, worldSize * groundH));
            setX(particleBuffer, idx, PARTICLE_STRIDE, px);
            setY(particleBuffer, idx, PARTICLE_STRIDE, py);
            particleView[ptr + STRIDE_INDEXES.POS_Z] = pz;
            setVelocity(particleBuffer, idx, PARTICLE_STRIDE, 0, 0, 0);
            setMass(particleBuffer, idx, PARTICLE_STRIDE, 1.0 + prng.nextFloat(0, 1.0));
            setSpeciesId(particleBuffer, idx, PARTICLE_STRIDE, s);
            setEnergy(particleBuffer, idx, PARTICLE_STRIDE, 50 + prng.nextFloat(0, 50));
            // Copy species DNA to particle DNA cache (stride 8-49)
            const dnaBase = s * 64;
            for (let d = 0; d < 42; d++) {
                const raw = dnaBuffer[dnaBase + d] || 0;
                const norm = raw / 65535;
                const r = DNA_RANGES[d] || { min: -1, max: 1 };
                particleView[ptr + STRIDE_INDEXES.DNA_CACHE_START + d] = norm * (r.max - r.min) + r.min;
            }
            // Initialize visual color from species profile
            // Colors set below (second block)
            // removed duplicate color init
            // removed duplicate color init
            // removed duplicate color init
            particleView[ptr + STRIDE_INDEXES.DEAD] = 0;
            particleView[ptr + STRIDE_INDEXES.AGE] = 0;
            particleView[ptr + STRIDE_INDEXES.SIGNAL] = 0;
            particleView[ptr + STRIDE_INDEXES.BOND_COUNT] = 0;
            particleView[ptr + STRIDE_INDEXES.BOND_PARTNER_1] = -1;
            particleView[ptr + STRIDE_INDEXES.BOND_PARTNER_2] = -1;
            particleView[ptr + STRIDE_INDEXES.MEMORY] = 0;
            particleView[ptr + STRIDE_INDEXES.HUNGER] = 0;
            particleView[ptr + STRIDE_INDEXES.ARMOR] = prng.nextFloat(0, 0.5);
            particleView[ptr + STRIDE_INDEXES.MITOSIS_TIMER] = 0;
            particleView[ptr + STRIDE_INDEXES.PARTNER_ID] = -1;
            particleView[ptr + STRIDE_INDEXES.TEMPERATURE] = 0.5;
            particleView[ptr + STRIDE_INDEXES.CHARGE] = 0;
            particleView[ptr + STRIDE_INDEXES.ELECTRIC_ENERGY] = 0;
            particleView[ptr + STRIDE_INDEXES.STORED_ENERGY] = 0;
            particleView[ptr + STRIDE_INDEXES.REPRO_DRIVE] = 0;
            particleView[ptr + STRIDE_INDEXES.RADIATION_EXPOSURE] = 0;
            particleView[ptr + STRIDE_INDEXES.PHASE_1] = 0;
            particleView[ptr + STRIDE_INDEXES.PHASE_2] = 0;
            particleView[ptr + STRIDE_INDEXES.SOUL] = 0;
            particleView[ptr + STRIDE_INDEXES.TRAIL_X] = 0;
            particleView[ptr + STRIDE_INDEXES.TRAIL_Y] = 0;
            particleView[ptr + STRIDE_INDEXES.TRAIL_Z] = 0;
            particleView[ptr + STRIDE_INDEXES.ENTANGLE_ID] = -1;
            particleView[ptr + STRIDE_INDEXES.ENTANGLE_PHASE] = 0;

            for (let d = 0; d < 42; d++) {
                particleView[ptr + STRIDE_INDEXES.DNA_CACHE_START + d] = getDNAFloat(dnaBuffer, s, d, DNA_RANGES[d].min, DNA_RANGES[d].max);
            }

            const col = profileColor(s);
            particleView[ptr + STRIDE_INDEXES.COLOR_R] = col[0];
            particleView[ptr + STRIDE_INDEXES.COLOR_G] = col[1];
            particleView[ptr + STRIDE_INDEXES.COLOR_B] = col[2];
            particleView[ptr + STRIDE_INDEXES.ALPHA] = 0.8;
            particleView[ptr + STRIDE_INDEXES.RADIUS] = 0.6;
            idx++;
        }
    }
    particleCount = idx;
}

/** Repaint the atmospheric backdrop canvas (sized to the viewport). */
function refreshBackground() {
    const bg = document.getElementById('bg-canvas');
    if (bg) paintBackground(bg);
}

/** Spawn offspring produced by REPRO law into the particle buffer. */
function spawnOffspring() {
    const list = drainOffspring();
    if (!list.length) return;
    for (const off of list) {
        if (particleCount >= MAX_PARTICLES) break;
        const ptr = particleCount * PARTICLE_STRIDE;
        setX(particleBuffer, particleCount, PARTICLE_STRIDE, off.x);
        setY(particleBuffer, particleCount, PARTICLE_STRIDE, off.y);
        particleView[ptr + STRIDE_INDEXES.POS_Z] = off.z || 0;
        setVelocity(particleBuffer, particleCount, PARTICLE_STRIDE, off.vx || 0, off.vy || 0, off.vz || 0);
        setMass(particleBuffer, particleCount, PARTICLE_STRIDE, off.mass || 1.0);
        setSpeciesId(particleBuffer, particleCount, PARTICLE_STRIDE, off.speciesId);
        setEnergy(particleBuffer, particleCount, PARTICLE_STRIDE, off.energy || 60);
        if (off.dna && off.dna.length) {
            for (let d = 0; d < 42 && d < off.dna.length; d++) {
                particleView[ptr + STRIDE_INDEXES.DNA_CACHE_START + d] = off.dna[d];
            }
        }
        particleView[ptr + STRIDE_INDEXES.DEAD] = 0;
        particleView[ptr + STRIDE_INDEXES.AGE] = 0;
        particleView[ptr + STRIDE_INDEXES.SIGNAL] = 0;
        particleView[ptr + STRIDE_INDEXES.BOND_COUNT] = 0;
        particleView[ptr + STRIDE_INDEXES.BOND_PARTNER_1] = -1;
        particleView[ptr + STRIDE_INDEXES.BOND_PARTNER_2] = -1;
        particleView[ptr + STRIDE_INDEXES.MEMORY] = 0;
        particleView[ptr + STRIDE_INDEXES.HUNGER] = 0;
        particleView[ptr + STRIDE_INDEXES.ARMOR] = 0.2;
        particleView[ptr + STRIDE_INDEXES.MITOSIS_TIMER] = 0;
        particleView[ptr + STRIDE_INDEXES.PARTNER_ID] = -1;
        particleView[ptr + STRIDE_INDEXES.TEMPERATURE] = 0.5;
        particleView[ptr + STRIDE_INDEXES.CHARGE] = 0;
        particleView[ptr + STRIDE_INDEXES.SOUL] = 0;
        particleView[ptr + STRIDE_INDEXES.ENTANGLE_ID] = -1;
        particleView[ptr + STRIDE_INDEXES.ENTANGLE_PHASE] = 0;
        // Inherit the parents' intermediate colour when reproduction carried
        // one; otherwise fall back to the species base colour.
        const sp = SPECIES_PROFILES[off.speciesId] || SPECIES_PROFILES[0];
        const defR = sp ? sp.color[0] : 200;
        const defG = sp ? sp.color[1] : 200;
        const defB = sp ? sp.color[2] : 200;
        particleView[ptr + STRIDE_INDEXES.COLOR_R] = off.colorR != null ? Math.max(0, Math.min(255, off.colorR)) : defR;
        particleView[ptr + STRIDE_INDEXES.COLOR_G] = off.colorG != null ? Math.max(0, Math.min(255, off.colorG)) : defG;
        particleView[ptr + STRIDE_INDEXES.COLOR_B] = off.colorB != null ? Math.max(0, Math.min(255, off.colorB)) : defB;
        particleView[ptr + STRIDE_INDEXES.ALPHA] = 0.8;
        particleView[ptr + STRIDE_INDEXES.RADIUS] = 0.6;
        particleCount++;
        // v4 — lineage birth tracking
        if (lineageEngine) {
            trackBirth(lineageEngine, off.parentId != null ? off.parentId : -1, particleCount - 1, off.speciesId, 0);
        }
    }
}

function setDNAFromProfile(species, profile) {
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
}function wireEvents() {
    bus.on('sim:pause', () => { paused = true; });
    bus.on('sim:resume', () => { paused = false; });
    bus.on('sim:restart', (opts = {}) => {
        // Restart = fresh population at tick 0 with the CURRENT configuration:
        // laws, world params and species params (roster + DNA) are untouched.
        // opts is accepted for compatibility (Chaos randomizes first, then
        // restarts onto the randomized laws/DNA — both are preserved here).
        prng = new PRNG(Date.now());
        // Clear buffer by zeroing all data
        particleView.fill(0);
        // Reset offspring ring
        resetOffspringRing();
        // Respawn with the current DNA + species roster (no defaulting)
        spawnDefaultPopulation(true, true);
        tick = 0;
        paused = false;
        resetIntelligence();
        bus.emit('species:sync', { count: speciesCount });
        logDebug('simulation restarted');
        console.log('[VEPA v3] Simulation restarted');
        resetCamera();
        bus.emit('law:sync');
        bus.emit('sim:paused', { paused: false });
    });
    // Species roster changes from the UI (add/remove species)
    bus.on('species:changed', ({ count }) => {
        speciesCount = Math.max(1, Math.min(count || 1, MAX_SPECIES));
    });

    bus.on('sim:togglePause', () => { paused = !paused; bus.emit('sim:paused', { paused }); });
    bus.on('sim:hardReset', () => {
        // Reset = restore defaults: a fresh boot re-applies the default law
        // set, world params and species profiles (nothing sim-state persists
        // to storage, so a reload is the honest way back to defaults).
        console.log('[VEPA v3] Hard reset requested');
        logDebug('hard reset requested', 'warn');
        location.reload();
    });
    // Readme (Help) button — open the v4 README
    bus.on('help:toggle', () => {
        window.open('https://github.com/gemquota/vepa/blob/new/v4/README.md', '_blank', 'noopener');
    });

    bus.on('sim:chaos', () => {
        // Chaos multiplexing: partition laws into groups with varying activation
        // Shuffle law indices
        const shuffled = [];
        for (let i = 0; i < LAW_COUNT; i++) shuffled.push(i);
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const groups = 3 + Math.floor(Math.random() * 3); // 3-5 groups
        const groupSize = Math.ceil(LAW_COUNT / groups);
        const intensity = 0.3 + Math.random() * 0.7;

        // Clear all laws first
        for (let i = 0; i < LAW_COUNT; i++) lawClear(lawState, i);

        // Apply group-based activation
        for (let g = 0; g < groups; g++) {
            const start = g * groupSize;
            const end = Math.min(start + groupSize, LAW_COUNT);
            const actProb = 0.4 + Math.random() * 0.6;
            if (Math.random() > 0.3) { // 70% chance group activates
                for (let j = start; j < end; j++) {
                    if (Math.random() < actProb) {
                        lawSet(lawState, shuffled[j]);
                    }
                }
            }
        }

        // Randomize some DNA for extra variation
        for (let s = 0; s < speciesCount; s++) {
            for (let p = 0; p < 42; p++) {
                if (Math.random() > 0.85) {
                    const r = DNA_RANGES[p];
                    const val = r.min + Math.random() * (r.max - r.min);
                    const clamped = Math.max(r.min, Math.min(r.max, val));
                    const normalized = (clamped - r.min) / (r.max - r.min);
                    dnaBuffer[s * 64 + p] = Math.round(normalized * 65535);
                }
            }
        }

        const active = getLawCount(lawState);
        logDebug(`chaos multiplexed: ${groups} groups, ${active} laws, ${Math.round(intensity*100)}% intensity`, 'warn');
        bus.emit('law:sync');
        bus.emit('narrative:system', { text: `Chaos multiplexed: ${groups} groups, ${active} laws, ${Math.round(intensity*100)}% intensity` });
    });

    bus.on('sim:chaosClear', () => {
        // Clear all laws
        for (let i = 0; i < LAW_COUNT; i++) {
            lawClear(lawState, i);
        }
        logDebug('all laws cleared', 'warn');
        bus.emit('law:sync');
        bus.emit('narrative:system', { text: 'All laws cleared.' });
    });

    bus.on('sim:chaosSelective', ({ categories }) => {
        // Build set of law indices to randomize based on category names
        const catMap = { physics: true, biology: true, chemistry: true, thermodynamics: true, metaphysics: true };
        const activeCats = {};
        for (const c of categories) { activeCats[c] = true; }
        for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
            if (!activeCats[catName]) continue;
            for (const idx of cat.laws) {
                if (Math.random() > 0.3) {
                    if (Math.random() > 0.5) {
                        lawSet(lawState, idx);
                    } else {
                        lawClear(lawState, idx);
                    }
                }
            }
        }
        bus.emit('law:sync');
        bus.emit('narrative:system', { text: 'Selective chaos applied.' });
    });

    bus.on('sim:playbackMode', ({ mode }) => {
        // Playback speed modes (just toggle pause for now, future: dt multiplier)
        switch (mode) {
            case 'rewind':
            case 'reverse':
                paused = true;
                bus.emit('sim:paused', { paused: true });
                break;
            case 'forward':
                paused = false;
                bus.emit('sim:paused', { paused: false });
                break;
            case 'fastforward':
                paused = false;
                // Future: multiply DT by 3
                bus.emit('sim:paused', { paused: false });
                break;
        }
    });
    bus.on('world:paramChanged', ({ key, value }) => {
        worldParams = applyWorldParam(worldParams, key, value);
        runtimeConfig.worldParams = worldParams;
        switch (key) {
            case 'WORLD_SIZE':
                worldSize = worldParams.WORLD_SIZE;
                setWorldSize(worldSize);
                logDebug('world size set to ' + worldSize);
                break;
            case 'SPAWN_RATE':
                spawnRate = worldParams.SPAWN_RATE;
                break;
            case 'PARTICLE_COUNT':
            case 'MAX_POP':
                // Caps are read live by spawnCaps() during spawn paths.
                break;
        }
        // GLOBAL_G / WIND / DAMPING / VISCOSITY / ENTROPY / HEAT_CAPACITY /
        // LIGHT_LEVEL / RADIATION_LEVEL / SPECIES_INTERACTION / ENERGY_TRANSFER /
        // MUTATION_RATE / DECAY_RATE / GROUND_HEIGHT / SHAPE / SPAWN_CENTRES /
        // SPAWN_CENTRE_RANDOM / SPAWN_CENTRE_BIAS / INITIAL_POP are applied
        // directly by the solver (runtimeConfig.worldParams) or spawn paths.
        // Emit event so other systems can react
        bus.emit('world:paramApplied', { key, value });
    });

}

let lastFrameTime = 0, frameCount = 0, fps = 0;

// ── v4: Intelligence engine orchestration ────────────────────────────────

/** Wire goal-adjustment application + timeline scrub/record bus handlers. */
function wireGoalEvents() {
    bus.on('goal:adjusted', (adj) => {
        switch (adj.parameter) {
            case 'scanInterval': if (insightEngine) insightEngine.cfg.scanInterval = adj.newValue; break;
            case 'clusterRadius': if (insightEngine) insightEngine.cfg.clusterRadius = adj.newValue; break;
            case 'maxForce': runtimeConfig.maxForce = adj.newValue; break;
            case 'drag': runtimeConfig.dragMultiplier = adj.newValue; break;
            case 'birthRate': runtimeConfig.birthRate = adj.newValue; break;
            case 'deathRate': runtimeConfig.deathRate = adj.newValue; break;
        }
        bus.emit('goal:applied', adj);
    });
    bus.on('timeline:scrubTo', (tickIndex) => {
        const entry = timelineScrub(timelineEngine, tickIndex);
        if (!entry || !entry.data) return;
        particleView.set(entry.data);
        if (entry.metadata && entry.metadata.particleCount) particleCount = entry.metadata.particleCount;
        prevDead = new Uint8Array(particleCount);
        tick = entry.tick;
        bus.emit('timeline:restored', { index: entry.index, tick: entry.tick });
    });
    bus.on('timeline:record', ({ enabled }) => {
        timelineRecording = !!enabled;
        bus.emit('timeline:recording', { enabled: timelineRecording, count: getTimelineList(timelineEngine).length });
    });
    bus.on('timeline:clear', () => {
        clearTimelineEngine(timelineEngine);
        bus.emit('timeline:cleared');
    });
}

/** Collect current simulation metrics for the goal engine + dashboard. */
function computeMetrics() {
    let alive = 0, energySum = 0;
    const speciesAlive = new Set();
    for (let i = 0; i < particleCount; i++) {
        const base = i * PARTICLE_STRIDE;
        if (particleView[base + STRIDE_INDEXES.DEAD] < 0.5 && (particleView[base + STRIDE_INDEXES.MASS] || 0) > 0) {
            alive++;
            energySum += particleView[base + STRIDE_INDEXES.ENERGY] || 0;
            speciesAlive.add(particleView[base + STRIDE_INDEXES.SPECIES_ID]);
        }
    }
    const clusterCount = insightEngine && insightEngine.lastClusters
        ? insightEngine.lastClusters.clusters.length : 0;
    return {
        populationAlive: alive,
        speciesAlive: speciesAlive.size,
        clusterCount,
        avgEnergy: alive ? energySum / alive : 0,
        frameDelta: fps,
        lawActiveCount: getLawCount(lawState),
    };
}

/** Run insight, narrative, lineage, timeline, and goal engines each tick. */
function updateIntelligence() {
    if (!particleView || !particleCount) return;

    // Insight — spatio-temporal cluster detection
    if (insightEngine) {
        updateInsight(insightEngine, particleView, particleCount, PARTICLE_STRIDE, worldSize);
    }

    // Narrative — paced multi-voice commentary on engine events
    if (narrativeEngine) {
        updateNarrative(narrativeEngine, particleView, particleCount, PARTICLE_STRIDE);
    }

    // Lineage — death transitions (births are tracked in spawnOffspring)
    if (lineageEngine) {
        if (prevDead.length < particleCount) {
            const grown = new Uint8Array(particleCount);
            grown.set(prevDead);
            prevDead = grown;
        }
        for (let i = 0; i < particleCount; i++) {
            const base = i * PARTICLE_STRIDE;
            const dead = particleView[base + STRIDE_INDEXES.DEAD] >= 0.5 ? 1 : 0;
            if (dead && !prevDead[i]) {
                let cause = 'unknown';
                if ((particleView[base + STRIDE_INDEXES.HUNGER] || 0) >= 100) cause = 'starvation';
                else if ((particleView[base + STRIDE_INDEXES.ENERGY] || 0) <= 0) cause = 'energy-depletion';
                trackDeath(lineageEngine, i, cause);
            }
            prevDead[i] = dead;
        }
    }

    // Timeline — recording snapshots on a fixed cadence
    if (timelineEngine && timelineRecording && tick % TIMELINE_SNAPSHOT_INTERVAL === 0) {
        const data = new Float32Array(particleView.buffer.slice(0));
        timelineSnapshot(timelineEngine, data, { tick, particleCount });
        bus.emit('timeline:snapshot', { count: getTimelineList(timelineEngine).length });
    }

    // Goal engine — evaluate and self-tune world constraints
    const metrics = computeMetrics();
    if (goalEngine) {
        updateGoal(goalEngine, metrics);
    }
    if (tick % 30 === 0) {
        bus.emit('sim:metrics', metrics);
    }
}

/** Reset intelligence state on simulation restart. */
function resetIntelligence() {
    prevDead = new Uint8Array(particleCount);
    if (insightEngine) { insightEngine.frame = 0; insightEngine.history = []; insightEngine.lastClusters = null; }
    if (goalEngine) { goalEngine.frame = 0; goalEngine.history = []; }
    if (timelineEngine) clearTimelineEngine(timelineEngine);
}

function renderLoop(now) {
    requestAnimationFrame(renderLoop);
    frameCount++;
    if (now - lastFrameTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;
    }

    // Chaos Multiplex mode — step + render every shard, shared camera.
    if (multiplexController && multiplexController.isActive()) {
        multiplexController.step(DT, runtimeConfig.simSpeed, worldSize);
        multiplexController.render(worldSize);
        return;
    }

    // Always render (so paused state still shows particles)
    // Physics only runs when not paused
    if (!paused) {
    // Main-thread physics
    if (particleView) {
        solve(particleView, particleCount, PARTICLE_STRIDE, lawState, dnaBuffer, worldSize, DT * runtimeConfig.simSpeed, rng);
        spawnOffspring();
        // Regular population feed — SPAWN_RATE particles per second, placed
        // randomly within the configured initial spawn distribution.
        // Capped by MAX_POP (soft cap) and PARTICLE_COUNT (hard cap).
        const caps = spawnCaps(worldParams);
        if (spawnRate > 0 && particleCount < caps.softCap) {
            spawnAccumulator += spawnRate * (DT * runtimeConfig.simSpeed);
            while (spawnAccumulator >= 1 && particleCount < caps.softCap) {
                spawnAccumulator -= 1;
                spawnSingleParticle(
                    Math.floor(prng.nextFloat(0, speciesCount)),
                    sampleSpawnPosition(worldParams, worldSize, prng),
                );
            }
        }
        tick++;
        updateIntelligence();
        updateLiveStats({ fps, tick, particles: particleCount, species: speciesCount, laws: getLawCount(lawState) });
        // On-screen canvas debug overlay (first 2 seconds, debug overlay only)
        if (isDebugVisible() && tick <= 130) {
            const dbg = renderer.ctx;
            if (dbg) {
                dbg.save();
                dbg.font = '10px monospace';
                dbg.fillStyle = 'rgba(0,0,0,0.7)';
                dbg.fillRect(4, 38, 320, tick === 1 ? 120 : 70);
                dbg.fillStyle = '#0f0';
                dbg.textAlign = 'left';
                dbg.textBaseline = 'top';
                let ly = 40;
                if (tick === 1) {
                    // Live particle count
                    let aliveCount = 0, deadCount = 0, nanPos = 0;
                    for (let di = 0; di < particleCount; di++) {
                        const dbb = di * PARTICLE_STRIDE;
                        const d = particleView[dbb + STRIDE_INDEXES.DEAD];
                        const px = particleView[dbb], py = particleView[dbb + 1];
                        if (d >= 0.5) deadCount++;
                        else if (px !== px || py !== py) nanPos++;
                        else aliveCount++;
                    }
                    dbg.fillStyle = '#ff0';
                    dbg.fillText('PARTICLES: ' + particleCount + ' | Alive: ' + aliveCount + ' Dead: ' + deadCount + ' NaN: ' + nanPos, 8, ly); ly += 14;
                    dbg.fillText('CANVAS: ' + renderer.width + 'x' + renderer.height + ' | Laws: ' + getLawCount(lawState), 8, ly); ly += 14;
                    const p0 = particleView[0], p1 = particleView[1], p2 = particleView[2];
                    const c0 = particleView[0 + STRIDE_INDEXES.COLOR_R], c1 = particleView[0 + STRIDE_INDEXES.COLOR_G], c2 = particleView[0 + STRIDE_INDEXES.COLOR_B];
                    const a = particleView[0 + STRIDE_INDEXES.ALPHA];
                    const d0 = particleView[0 + STRIDE_INDEXES.DEAD];
                    dbg.fillStyle = '#0ff';
                    dbg.fillText('POS: (' + p0.toFixed(1) + ',' + p1.toFixed(1) + ',' + p2.toFixed(1) + ') DEAD:' + d0.toFixed(2) + ' ALPHA:' + a.toFixed(2), 8, ly); ly += 14;
                    dbg.fillText('COLOR: rgb(' + c0 + ',' + c1 + ',' + c2 + ') | MASS:' + particleView[6].toFixed(2) + ' NRG:' + particleView[50].toFixed(1), 8, ly); ly += 14;
                    dbg.fillText('AGE:' + particleView[51].toFixed(0) + ' HUNGER:' + particleView[62].toFixed(2) + ' TEMP:' + particleView[66].toFixed(2), 8, ly); ly += 14;
                }
                // Always show FPS in debug
                dbg.fillStyle = '#0f0';
                dbg.fillText('FPS: ' + fps + ' TICK: ' + tick, 8, ly);
                dbg.restore();
            }
        }
        bus.emit('physics:tick', { tick, buffer: particleBuffer, particleCount, speciesCount });
    }

    } // end if (!paused)

    // Render (always, even when paused)
    if (renderer && particleBuffer) {
        renderer.paused = paused;
        syncSprites(renderer, particleBuffer, particleCount, PARTICLE_STRIDE, worldSize, lawState);
    }
}

// Global errors and unhandled rejections are captured by src/debug.js into
// the debug overlay (single message log for the whole page session).
boot().catch(e => {
    console.error('BOOT ERROR:', e);
    logDebug('BOOT ERROR: ' + (e.stack || e.message || e), 'error');
});
