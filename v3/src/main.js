/**
 * VEPA v3 — Main Bootstrap
 * Initializes EventBus, loads subsystems, starts render loop.
 */
import { EventBus } from './core/eventBus.js';
import { SplitMix32 as PRNG } from './core/prng.js';
import { WORLD_SIZE, PARTICLE_STRIDE, MAX_PARTICLES, DEFAULT_PARTICLES_PER_SPECIES, STRIDE_INDEXES, DNA_INDEXES, DNA_RANGES, LAW_INDEXES } from './constants.js';
import { createParticleBuffer, setX, setY, setVelocity, setMass, setSpeciesId, setEnergy, getX, getY } from './state/particleBuffer.js';
import { createLawState, set as lawSet, isSet as lawIsSet } from './state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from './dna/dnaBuffer.js';
import { createRenderer, resize as resizeRenderer, renderFrame } from './render/renderer.js';
import { syncSprites } from './render/spriteSync.js';
import { initUI } from './ui/ui.js';
import { createHUD } from './ui/hud.js';
import { createInsightEngine, update as insightUpdate } from './engines/insightEngine.js';
import { createNarrativeEngine, update as narrativeUpdate } from './engines/narrativeEngine.js';
import { createGoalEngine, update as goalUpdate } from './engines/goalEngine.js';
import { createLineageTracker } from './engines/lineageTracker.js';
import { createTimelineEngine } from './engines/timelineEngine.js';
import { savePreset, loadPreset, listPresets, deletePreset } from './state/presetManager.js';

/* ── Global State ─────────────────────────────────────────────────── */
let bus;
let prng;
let particleBuffer;
let lawState;
let dnaBuffer;
let renderer;
let particleCount = 0;
let speciesCount = 5;
let tick = 0;
let paused = false;
let worldSize = WORLD_SIZE;
let worker = null;

// Intelligence engines
let insightEngine;
let narrativeEngine;
let goalEngine;
let lineageTracker;
let timelineEngine;

/* ── Boot Sequence ────────────────────────────────────────────────── */
async function boot() {
    console.log('[VEPA v3] Booting...');
    const t0 = performance.now();

    // 1. Core infrastructure
    bus = new EventBus();
    prng = new PRNG(Date.now());

    // 2. State
    particleBuffer = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
    lawState = createLawState();
    dnaBuffer = createDNABuffer();
    loadDefaults(dnaBuffer, DNA_RANGES);

    // 3. Enable default laws
    const defaultLaws = ['GRAV', 'DRAG', 'ENTR', 'WRAP', 'COLL', 'LIFE', 'GLOW', 'REPRO', 'PHENOTYPE', 'GENOTYPE'];
    for (const name of defaultLaws) {
        if (LAW_INDEXES[name] !== undefined) {
            lawSet(lawState, LAW_INDEXES[name]);
        }
    }

    // 4. Spawn default particles
    spawnDefaultPopulation();

    // 5. Init renderer
    const canvas = document.getElementById('sim-canvas');
    renderer = createRenderer(canvas, MAX_PARTICLES);
    resizeRenderer(renderer);

    // 6. Init intelligence engines
    insightEngine = createInsightEngine(bus, { scanInterval: 60, minClusterSize: 5, clusterRadius: 50 });
    narrativeEngine = createNarrativeEngine(bus, { maxLength: 200 });
    goalEngine = createGoalEngine(bus, { targets: { stability: 0.7, complexity: 0.5, diversity: 0.6 } });
    lineageTracker = createLineageTracker(bus);
    timelineEngine = createTimelineEngine(bus, { maxSnapshots: 100 });

    // 7. Init physics worker
    await initWorker();

    // 8. Init UI
    initUI(bus, lawState, dnaBuffer);
    createHUD(bus);

    // 9. Wire up bus events
    wireEvents();

    // 10. Start render loop
    requestAnimationFrame(renderLoop);

    const dt = (performance.now() - t0).toFixed(1);
    console.log(`[VEPA v3] Booted in ${dt}ms — ${particleCount} particles, ${speciesCount} species`);
    bus.emit('boot:complete', { particleCount, speciesCount, dt });
}

/* ── Particle Spawning ────────────────────────────────────────────── */
function spawnDefaultPopulation() {
    const profiles = [
        { name: 'Predator', color: [255, 80, 80], force: 1.2, viscosity: 0.95, birthRate: 0.3, predationBias: 0.8 },
        { name: 'Sol', color: [255, 200, 50], force: 0.8, viscosity: 0.97, birthRate: 0.1, fusion: 2.0 },
        { name: 'Life', color: [80, 255, 120], force: 1.0, viscosity: 0.98, birthRate: 0.5, mutation: 0.3 },
        { name: 'Aether', color: [120, 160, 255], force: 0.5, viscosity: 0.99, signalResp: 2.0, pulseRate: 0.3 },
        { name: 'Void', color: [100, 60, 140], force: -0.5, viscosity: 0.96, deathRate: 0.2, hiddenMass: 3.0 },
    ];

    speciesCount = Math.min(profiles.length, MAX_SPECIES);
    let idx = 0;
    const perSpecies = DEFAULT_PARTICLES_PER_SPECIES;

    for (let s = 0; s < speciesCount; s++) {
        const p = profiles[s];
        setDNAFromProfile(s, p);

        for (let i = 0; i < perSpecies && idx < MAX_PARTICLES; i++) {
            const ptr = idx * PARTICLE_STRIDE;
            setX(particleBuffer, idx, PARTICLE_STRIDE, prng.nextFloat(50, worldSize - 50));
            setY(particleBuffer, idx, PARTICLE_STRIDE, prng.nextFloat(50, worldSize - 50));
            particleBuffer[ptr + STRIDE_INDEXES.POS_Z] = prng.nextFloat(-10, 10);
            setVelocity(particleBuffer, idx, PARTICLE_STRIDE, prng.nextFloat(-0.5, 0.5), prng.nextFloat(-0.5, 0.5), prng.nextFloat(-0.1, 0.1));
            setMass(particleBuffer, idx, PARTICLE_STRIDE, 1.0 + prng.nextFloat(0, 1.0));
            setSpeciesId(particleBuffer, idx, PARTICLE_STRIDE, s);
            setEnergy(particleBuffer, idx, PARTICLE_STRIDE, 50 + prng.nextFloat(0, 50));
            particleBuffer[ptr + STRIDE_INDEXES.DEAD] = 0;
            particleBuffer[ptr + STRIDE_INDEXES.AGE] = 0;

            // Copy DNA cache
            for (let d = 0; d < 42; d++) {
                const val = getDNAFloat(dnaBuffer, s, d, DNA_RANGES[d].min, DNA_RANGES[d].max);
                particleBuffer[ptr + STRIDE_INDEXES.DNA_CACHE_START + d] = val;
            }

            // Color
            particleBuffer[ptr + STRIDE_INDEXES.COLOR_R] = p.color[0];
            particleBuffer[ptr + STRIDE_INDEXES.COLOR_G] = p.color[1];
            particleBuffer[ptr + STRIDE_INDEXES.COLOR_B] = p.color[2];
            particleBuffer[ptr + STRIDE_INDEXES.ALPHA] = 0.8;
            particleBuffer[ptr + STRIDE_INDEXES.RADIUS] = 2.0;

            idx++;
        }
    }
    particleCount = idx;
}

function setDNAFromProfile(species, profile) {
    for (const [key, value] of Object.entries(profile)) {
        const paramIdx = DNA_INDEXES[key];
        if (paramIdx === undefined) continue;
        const r = DNA_RANGES[paramIdx];
        const clamped = Math.max(r.min, Math.min(r.max, value));
        const normalized = (clamped - r.min) / (r.max - r.min);
        dnaBuffer[species * 64 + paramIdx] = Math.round(normalized * 65535);
    }
}

/* ── Physics Worker ───────────────────────────────────────────────── */
async function initWorker() {
    try {
        worker = new Worker(new URL('./worker/physics.worker.js', import.meta.url), { type: 'module' });

        worker.onmessage = (e) => {
            const { type } = e.data;
            if (type === 'TICK_COMPLETE') {
                tick++;
                bus.emit('physics:tick', { tick, buffer: particleBuffer, particleCount });
            }
        };

        worker.onerror = (err) => console.error('[VEPA v3] Worker error:', err);

        const buffer = particleBuffer.buffer;
        worker.postMessage({
            type: 'INIT',
            buffer,
            config: {
                particleCount,
                speciesCount,
                stride: PARTICLE_STRIDE,
                worldSize,
                dnaBuffer: dnaBuffer.slice(),
                lawState: { low: lawState.lowFlags[0], high: lawState.highFlags[0] },
            }
        }, [buffer]);

        particleBuffer = new Float32Array(buffer);
        console.log('[VEPA v3] Physics worker initialized');
    } catch (err) {
        console.warn('[VEPA v3] Worker init failed, running main thread:', err.message);
        worker = null;
    }
}

/* ── Event Wiring ─────────────────────────────────────────────────── */
function wireEvents() {
    // Intelligence engine updates on tick
    bus.on('physics:tick', ({ tick: t }) => {
        if (t % 60 === 0 && particleCount > 0) {
            insightUpdate(insightEngine, particleBuffer, particleCount, PARTICLE_STRIDE, worldSize);
        }
        if (t % 30 === 0) {
            narrativeUpdate(narrativeEngine, particleBuffer, particleCount, PARTICLE_STRIDE);
        }
        if (t % 120 === 0) {
            goalUpdate(goalEngine, {
                particleCount,
                speciesCount,
                avgEnergy: 50,
                stability: 0.5,
            });
        }
    });

    // Law toggle → worker
    bus.on('law:toggled', ({ lawIndex, active }) => {
        if (worker) {
            worker.postMessage({
                type: 'TOGGLE_LAW',
                lawIndex,
                lawState: { low: lawState.lowFlags[0], high: lawState.highFlags[0] }
            });
        }
    });

    // DNA change → worker
    bus.on('dna:changed', ({ species, param, value }) => {
        if (worker) {
            worker.postMessage({
                type: 'CONFIG',
                dnaBuffer: dnaBuffer.slice(),
            });
        }
    });

    // Preset save/load
    bus.on('preset:save', ({ name }) => {
        savePreset(name, { lawState, dnaBuffer, worldParams: { worldSize }, speciesCount });
    });

    bus.on('preset:load', ({ name }) => {
        const preset = loadPreset(name);
        if (preset && preset.lawState) {
            lawState.lowFlags[0] = preset.lawState.low;
            lawState.highFlags[0] = preset.lawState.high;
            if (preset.dnaBuffer) {
                for (let i = 0; i < preset.dnaBuffer.length && i < dnaBuffer.length; i++) {
                    dnaBuffer[i] = preset.dnaBuffer[i];
                }
            }
            if (worker) {
                worker.postMessage({ type: 'RESTORE', lawState: preset.lawState, dnaBuffer: preset.dnaBuffer });
            }
        }
    });

    // Sim controls
    bus.on('sim:pause', () => { paused = true; });
    bus.on('sim:resume', () => { paused = false; });
    bus.on('sim:restart', () => {
        tick = 0;
        if (worker) worker.postMessage({ type: 'TICK' });
    });
}

/* ── Render Loop ──────────────────────────────────────────────────── */
let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;

function renderLoop(now) {
    requestAnimationFrame(renderLoop);
    frameCount++;
    if (now - lastFrameTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;
    }

    if (paused) return;

    if (worker) {
        worker.postMessage({ type: 'TICK' });
    }

    // Render
    if (renderer && particleBuffer) {
        syncSprites(renderer, particleBuffer, particleCount, PARTICLE_STRIDE, worldSize, lawState);
    }
}

/* ── Window Exports ───────────────────────────────────────────────── */
window.setPlaybackMode = (mode) => bus.emit('playback:mode', { mode });
window.togglePause = () => bus.emit(paused ? 'sim:resume' : 'sim:pause');
window.restartSim = () => bus.emit('sim:restart');
window.hardReset = () => bus.emit('sim:hardReset');

/* ── Start ────────────────────────────────────────────────────────── */
boot();
