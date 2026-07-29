/**
 * VEPA v3 — Main Bootstrap
 * SharedArrayBuffer optional — falls back to ArrayBuffer + main-thread tick.
 */
import { EventBus } from './core/eventBus.js';
import { SplitMix32 as PRNG } from './core/prng.js';
import { WORLD_SIZE, PARTICLE_STRIDE, MAX_PARTICLES, MAX_SPECIES, DEFAULT_PARTICLES_PER_SPECIES, STRIDE_INDEXES, DNA_INDEXES, DNA_RANGES, LAW_INDEXES, LAW_COUNT, LAW_CATEGORIES } from './constants.js';
import { createParticleBuffer, getX, getY, setX, setY, setVelocity, setMass, setSpeciesId, setEnergy } from './state/particleBuffer.js';
import { createLawState, set as lawSet, clear as lawClear } from './state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from './dna/dnaBuffer.js';
import { createRenderer, resize as resizeRenderer, renderFrame } from './render/renderer.js';
import { syncSprites } from './render/spriteSync.js';
import { initUI } from './ui/ui.js';
import { solve, resetOffspringRing } from './physics/solver.js';

const SUBSTEPS = 4;
const DT = 0.25;

let bus, prng, particleBuffer, particleView, lawState, dnaBuffer, renderer;
let particleCount = 0, speciesCount = 5, tick = 0, paused = false;
let worldSize = WORLD_SIZE;
const DEFAULT_LAWS = ['GRAV', 'DRAG', 'WRAP', 'COLL'];

/** Wrap PRNG as a callable function (solver calls prng() not prng.next()) */
function rng() { return prng.next(); }

async function boot() {
    console.log('[VEPA v3] Booting...');
    const t0 = performance.now();

    bus = new EventBus();
    prng = new PRNG(Date.now());

    const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
    particleBuffer = buf.buffer;
    particleView = buf.view;
    const isShared = buf.isShared;
    console.log(`[VEPA v3] SharedArrayBuffer: ${isShared}`);

    lawState = createLawState();
    dnaBuffer = createDNABuffer();
    loadDefaults(dnaBuffer, DNA_RANGES);

    // No default laws — all behavior governed by toggled laws

    spawnDefaultPopulation();

    const canvas = document.getElementById('sim-canvas');
    renderer = createRenderer(canvas, MAX_PARTICLES);
    resizeRenderer(renderer);

    // Init UI (includes HUD, all panels, event wiring)
    initUI(bus, lawState, dnaBuffer);
    wireEvents();

    requestAnimationFrame(renderLoop);

    const dt = (performance.now() - t0).toFixed(1);
    console.log(`[VEPA v3] Booted in ${dt}ms — ${particleCount} particles, ${speciesCount} species`);
    bus.emit('boot:complete', { particleCount, speciesCount, dt });
}

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
            particleView[ptr + STRIDE_INDEXES.POS_Z] = 0;
            setVelocity(particleBuffer, idx, PARTICLE_STRIDE, 0, 0, 0);
            setMass(particleBuffer, idx, PARTICLE_STRIDE, 1.0 + prng.nextFloat(0, 1.0));
            setSpeciesId(particleBuffer, idx, PARTICLE_STRIDE, s);
            setEnergy(particleBuffer, idx, PARTICLE_STRIDE, 50 + prng.nextFloat(0, 50));
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
            particleView[ptr + STRIDE_INDEXES.PHASE_1] = 0;
            particleView[ptr + STRIDE_INDEXES.PHASE_2] = 0;
            particleView[ptr + STRIDE_INDEXES.SOUL] = 0;
            particleView[ptr + STRIDE_INDEXES.TRAIL_X] = 0;
            particleView[ptr + STRIDE_INDEXES.TRAIL_Y] = 0;
            particleView[ptr + STRIDE_INDEXES.TRAIL_Z] = 0;

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
    bus.on('sim:restart', () => {
        // Full simulation reset: respawn particles, clear laws, reset state
        prng = new PRNG(Date.now());
        // Clear buffer by zeroing all data
        particleView.fill(0);
        // Fresh law state (all off)
        lawState = createLawState();
        // Re-apply default laws
        for (const name of DEFAULT_LAWS) {
            if (LAW_INDEXES[name] !== undefined) lawSet(lawState, LAW_INDEXES[name]);
        }
        // Reset offspring ring
        resetOffspringRing();
        // Respawn
        spawnDefaultPopulation();
        tick = 0;
        paused = false;
        console.log('[VEPA v3] Simulation restarted');
        bus.emit('law:sync');
        bus.emit('sim:paused', { paused: false });
    });
    bus.on('sim:togglePause', () => { paused = !paused; bus.emit('sim:paused', { paused }); });
    bus.on('sim:hardReset', () => {
        console.log('[VEPA v3] Hard reset requested');
        location.reload();
    });
    bus.on('sim:chaos', () => {
        // Chaos mode: randomize all laws
        for (let i = 0; i < LAW_COUNT; i++) {
            if (Math.random() > 0.7) {
                if (Math.random() > 0.5) {
                    lawSet(lawState, i);
                } else {
                    lawClear(lawState, i);
                }
            }
        }
        bus.emit('law:sync');
        bus.emit('narrative:system', { text: 'Chaos invoked — laws randomized.' });
    });

    bus.on('sim:chaosClear', () => {
        // Clear all laws
        for (let i = 0; i < LAW_COUNT; i++) {
            lawClear(lawState, i);
        }
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
}

let lastFrameTime = 0, frameCount = 0, fps = 0;

function renderLoop(now) {
    requestAnimationFrame(renderLoop);
    frameCount++;
    if (now - lastFrameTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;
    }

    if (paused) return;

    // Main-thread physics
    if (particleView) {
        solve(particleView, particleCount, PARTICLE_STRIDE, lawState, dnaBuffer, worldSize, DT, rng);
        tick++;
        bus.emit('physics:tick', { tick, buffer: particleBuffer, particleCount, speciesCount });
    }

    // Render
    if (renderer && particleBuffer) {
        syncSprites(renderer, particleBuffer, particleCount, PARTICLE_STRIDE, worldSize, lawState);
    }
}

boot();
