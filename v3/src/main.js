/**
 * VEPA v3 — Main Bootstrap
 * Initializes EventBus, loads subsystems, starts render loop.
 * SharedArrayBuffer optional — falls back to ArrayBuffer + main-thread tick.
 */
import { EventBus } from './core/eventBus.js';
import { SplitMix32 as PRNG } from './core/prng.js';
import { WORLD_SIZE, PARTICLE_STRIDE, MAX_PARTICLES, DEFAULT_PARTICLES_PER_SPECIES, STRIDE_INDEXES, DNA_INDEXES, DNA_RANGES, LAW_INDEXES } from './constants.js';
import { createParticleBuffer, getX, getY, setX, setY, setVelocity, setMass, setSpeciesId, setEnergy } from './state/particleBuffer.js';
import { createLawState, set as lawSet } from './state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from './dna/dnaBuffer.js';
import { createRenderer, resize as resizeRenderer, renderFrame } from './render/renderer.js';
import { syncSprites } from './render/spriteSync.js';
import { initUI } from './ui/ui.js';
import { createHUD } from './ui/hud.js';
import { solve } from './physics/solver.js';

/* ── Constants ────────────────────────────────────────────────────── */
const SUBSTEPS = 4;
const DT = 0.25;

/* ── Global State ─────────────────────────────────────────────────── */
let bus;
let prng;
let particleBuffer;
let particleView;
let lawState;
let dnaBuffer;
let renderer;
let particleCount = 0;
let speciesCount = 5;
let tick = 0;
let paused = false;
let worldSize = WORLD_SIZE;
let useWorker = false;
let isShared = false;

/* ── Boot Sequence ────────────────────────────────────────────────── */
async function boot() {
    console.log('[VEPA v3] Booting...');
    const t0 = performance.now();

    // 1. Core infrastructure
    bus = new EventBus();
    prng = new PRNG(Date.now());

    // 2. State (SharedArrayBuffer or ArrayBuffer fallback)
    const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
    particleBuffer = buf.buffer;
    particleView = buf.view;
    isShared = buf.isShared;

    lawState = createLawState();
    dnaBuffer = createDNABuffer();
    loadDefaults(dnaBuffer, DNA_RANGES);

    // 3. Enable default laws
    const defaultLaws = ['GRAV', 'DRAG', 'ENTR', 'WRAP', 'COLL', 'LIFE', 'GLOW', 'REPRO', 'PHENOTYPE', 'GENOTYPE'];
    for (const name of defaultLaws) {
        if (LAW_INDEXES[name] !== undefined) lawSet(lawState, LAW_INDEXES[name]);
    }

    // 4. Spawn default particles
    spawnDefaultPopulation();

    // 5. Init renderer
    const canvas = document.getElementById('sim-canvas');
    renderer = createRenderer(canvas, MAX_PARTICLES);
    resizeRenderer(renderer);

    // 6. Init UI
    initUI(bus, lawState, dnaBuffer);
    createHUD(bus);

    // 7. Wire events
    wireEvents();

    // 8. Start render loop
    requestAnimationFrame(renderLoop);

    const dt = (performance.now() - t0).toFixed(1);
    console.log(`[VEPA v3] Booted in ${dt}ms — ${particleCount} particles, ${speciesCount} species, SharedArrayBuffer: ${isShared}`);
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
            particleView[ptr + STRIDE_INDEXES.POS_Z] = prng.nextFloat(-10, 10);
            setVelocity(particleBuffer, idx, PARTICLE_STRIDE, prng.nextFloat(-0.5, 0.5), prng.nextFloat(-0.5, 0.5), prng.nextFloat(-0.1, 0.1));
            setMass(particleBuffer, idx, PARTICLE_STRIDE, 1.0 + prng.nextFloat(0, 1.0));
            setSpeciesId(particleBuffer, idx, PARTICLE_STRIDE, s);
            setEnergy(particleBuffer, idx, PARTICLE_STRIDE, 50 + prng.nextFloat(0, 50));
            particleView[ptr + STRIDE_INDEXES.DEAD] = 0;
            particleView[ptr + STRIDE_INDEXES.AGE] = 0;

            for (let d = 0; d < 42; d++) {
                particleView[ptr + STRIDE_INDEXES.DNA_CACHE_START + d] = getDNAFloat(dnaBuffer, s, d, DNA_RANGES[d].min, DNA_RANGES[d].max);
            }

            particleView[ptr + STRIDE_INDEXES.COLOR_R] = p.color[0];
            particleView[ptr + STRIDE_INDEXES.COLOR_G] = p.color[1];
            particleView[ptr + STRIDE_INDEXES.COLOR_B] = p.color[2];
            particleView[ptr + STRIDE_INDEXES.ALPHA] = 0.8;
            particleView[ptr + STRIDE_INDEXES.RADIUS] = 2.0;
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

/* ── Event Wiring ─────────────────────────────────────────────────── */
function wireEvents() {
    bus.on('sim:pause', () => { paused = true; });
    bus.on('sim:resume', () => { paused = false; });
    bus.on('sim:restart', () => { tick = 0; });
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

    // Main-thread physics if SharedArrayBuffer unavailable
    if (!useWorker && particleView) {
        solve(particleView, particleCount, PARTICLE_STRIDE, lawState, dnaBuffer, worldSize, DT, prng);
        tick++;
        bus.emit('physics:tick', { tick, buffer: particleBuffer, particleCount });
    }

    // Render particles
    if (renderer && particleBuffer) {
        syncSprites(renderer, particleBuffer, particleCount, PARTICLE_STRIDE, worldSize, lawState);
    }
}

/* ── Window Exports ───────────────────────────────────────────────── */
window.togglePause = () => { paused = !paused; bus.emit(paused ? 'sim:pause' : 'sim:resume'); };
window.restartSim = () => bus.emit('sim:restart');
window.hardReset = () => bus.emit('sim:hardReset');

/* ── Start ────────────────────────────────────────────────────────── */
boot();
