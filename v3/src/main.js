/**
 * VEPA v3 — Main Bootstrap
 * SharedArrayBuffer optional — falls back to ArrayBuffer + main-thread tick.
 */
import { EventBus } from './core/eventBus.js';
import { SplitMix32 as PRNG } from './core/prng.js';
import { WORLD_SIZE, PARTICLE_STRIDE, MAX_PARTICLES, MAX_SPECIES, DEFAULT_PARTICLES_PER_SPECIES, STRIDE_INDEXES, DNA_INDEXES, DNA_RANGES, LAW_INDEXES, LAW_COUNT, LAW_CATEGORIES } from './constants.js';
import { createParticleBuffer, getX, getY, setX, setY, setVelocity, setMass, setSpeciesId, setEnergy } from './state/particleBuffer.js';
import { createLawState, set as lawSet, clear as lawClear, getActiveCount as getLawCount } from './state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from './dna/dnaBuffer.js';
import { createRenderer, resize as resizeRenderer, renderFrame } from './render/renderer.js';
import { syncSprites } from './render/spriteSync.js';
import { initUI } from './ui/ui.js';
import { initCamera, resetCamera } from './ui/camera.js';
import { solve, resetOffspringRing } from './physics/solver.js';

const SUBSTEPS = 4;
const DT = 0.25;

let bus, prng, particleBuffer, particleView, lawState, dnaBuffer, renderer;
let particleCount = 0, speciesCount = 5, tick = 0, paused = false;
let worldSize = WORLD_SIZE;
const DEFAULT_LAWS = ['GRAV', 'DRAG', 'ENTR', 'WRAP', 'COLL', 'LIFE', 'REPRO', 'ENERGY', 'SENESCENCE', 'AFFINITY', 'FATE', 'GLOW', 'MIND', 'SOUL_LAW', 'ASTRAL', 'POLYMER', 'BOND', 'HEAT', 'CONVECTION'];

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

    // Apply default laws (GRAV, DRAG, WRAP, COLL)
    for (const name of DEFAULT_LAWS) {
        if (LAW_INDEXES[name] !== undefined) lawSet(lawState, LAW_INDEXES[name]);
    }

    spawnDefaultPopulation();

    const canvas = document.getElementById('sim-canvas');
    renderer = createRenderer(canvas, MAX_PARTICLES);
    resizeRenderer(renderer);
    // Re-render on window resize
    window.addEventListener('resize', () => {
        if (renderer) resizeRenderer(renderer);
    });
    // Also observe the canvas for layout changes
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
            if (renderer) resizeRenderer(renderer);
        });
        ro.observe(canvas);
    }
    initCamera(canvas);

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
            // Uniform grid distribution across the world
            const totalParticles = speciesCount * perSpecies;
            const gridCols = Math.ceil(Math.sqrt(totalParticles * (worldSize / worldSize)));
            const gridColsAdj = Math.max(1, Math.ceil(Math.sqrt(totalParticles)));
            const cols = gridColsAdj;
            const rows = Math.ceil(totalParticles / cols);
            const cellW = (worldSize - 10) / cols;
            const cellH = (worldSize - 10) / rows;
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            setX(particleBuffer, idx, PARTICLE_STRIDE, 5 + col * cellW + cellW * 0.5);
            setY(particleBuffer, idx, PARTICLE_STRIDE, 5 + row * cellH + cellH * 0.5);
            particleView[ptr + STRIDE_INDEXES.POS_Z] = 0;
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
            particleView[ptr + STRIDE_INDEXES.RADIUS] = 0.8;
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
        resetCamera();
        bus.emit('law:sync');
        bus.emit('sim:paused', { paused: false });
    });
    bus.on('sim:togglePause', () => { paused = !paused; bus.emit('sim:paused', { paused }); });
    bus.on('sim:hardReset', () => {
        console.log('[VEPA v3] Hard reset requested');
        location.reload();
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
        bus.emit('law:sync');
        bus.emit('narrative:system', { text: `Chaos multiplexed: ${groups} groups, ${active} laws, ${Math.round(intensity*100)}% intensity` });
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
    bus.on('world:paramChanged', ({ key, value }) => {
        switch (key) {
            case 'WORLD_SIZE':
                worldSize = Math.max(50, Math.min(4000, value));
                console.log('[VEPA] World size set to', worldSize);
                break;
            case 'GLOBAL_G':
                // Passed to solver via config — would need dynamic G integration
                console.log('[VEPA] G changed to', value);
                break;
            case 'DAMPING':
                // Applied in solver via drag law — stored for reference
                break;
            case 'SPAWN_RATE':
                // Would be used by an auto-spawn system
                break;
            case 'BASE_SIZE':
                // Applied per-particle via DNA
                break;
            case 'ENTROPY':
                // Entropy law intensity
                break;
            case 'VISCOSITY':
                // Global viscosity modifier
                break;
            case 'WIND':
                // Global wind force vector
                break;
            case 'HEAT_CAPACITY':
            case 'LIGHT_LEVEL':
            case 'RADIATION_LEVEL':
            case 'SPECIES_INTERACTION':
            case 'MUTATION_RATE':
            case 'ENERGY_TRANSFER':
            case 'DECAY_RATE':
                console.log('[VEPA] World param', key, '=', value);
                break;
            default:
                console.log('[VEPA] Unhandled world param:', key, value);
        }
        // Emit event so other systems can react
        bus.emit('world:paramApplied', { key, value });
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
        // On-screen debug overlay (shows first 2 seconds)
        if (tick <= 130) {
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

    // Render
    if (renderer && particleBuffer) {
        syncSprites(renderer, particleBuffer, particleCount, PARTICLE_STRIDE, worldSize, lawState);
    }
}

boot();
