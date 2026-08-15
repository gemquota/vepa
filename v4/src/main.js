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
import { WORLD_SIZE, PARTICLE_STRIDE, MAX_PARTICLES, MAX_SPECIES, STRIDE_INDEXES, DNA_RANGES, LAW_INDEXES, LAW_COUNT, LAW_CATEGORIES } from './constants.js';
import { set as lawSet, clear as lawClear, getActiveCount as getLawCount } from './state/lawState.js';
import { runtimeConfig } from './state/runtimeConfig.js';
import { applyWorldParam, spawnCaps } from './state/worldParams.js';
import { sampleSpawnPosition } from './spawn/distribution.js';
import { createPopulationController } from './spawn/population.js';
import { loadDefaults } from './dna/dnaBuffer.js';
import { createWorld } from './world/world.js';
import { createRenderer, resize as resizeRenderer, paintBackground } from './render/renderer.js';
import { syncSprites } from './render/spriteSync.js';
import { initUI } from './ui/ui.js';
import { initCamera, resetCamera, setWorldSize } from './ui/camera.js';
import { solve, resetOffspringRing } from './physics/solver.js';
import { simContextFromRuntimeConfig } from './physics/simContext.js';
import { createIntelligenceController } from './engines/intelligence.js';
import { createMultiplexController } from './multiplex/multiplexUI.js';
import { copyShardToWorld, summarizeMultiplex } from './multiplex/multiplex.js';
initDebug();
logDebug('main module loaded');



const SUBSTEPS = 4;
const DT = 0.25;

// The World aggregate (P2) — one handle owning worldParams, lawState, the DNA
// table and the particle buffer. The scalar counters below are derived,
// process-local telemetry passed through the aggregate's population/time and
// mirrored back on the paths that mutate them.
let bus, prng, world, renderer;
let population = null;
let intelligence = null;
let particleCount = 0, speciesCount = 5, tick = 0, paused = false;
let multiplexController = null;
let worldSize = WORLD_SIZE;
let spawnRate = 0;
let spawnAccumulator = 0;
// Begin with all laws disabled — movement and interaction only exist once
// a law is enabled. Presets (and the user) turn laws on explicitly.
const DEFAULT_LAWS = [];

/** Wrap PRNG as a callable function (solver calls prng() not prng.next()) */
function rng() { return prng.next(); }

async function boot() {
    console.log('[VEPA v4] Booting...');
    logDebug('boot: starting');
    const t0 = performance.now();

    bus = new EventBus();
    prng = new PRNG(Date.now());

    // The World aggregate owns every state bundle (params, laws, DNA, buffer).
    world = createWorld({
        name: 'VEPA World',
        seed: Date.now(),
        worldSize,
        speciesCount,
    });
    // Mirrored into runtimeConfig.worldParams so the solver reads live values.
    runtimeConfig.worldParams = world.worldParams;
    spawnRate = world.worldParams.SPAWN_RATE;
    const isShared = world.particle.isShared;
    console.log(`[VEPA v4] SharedArrayBuffer: ${isShared}`);
    logDebug('SharedArrayBuffer: ' + isShared);

    loadDefaults(world.dna, DNA_RANGES);

    // Apply default laws (GRAV, DRAG, WRAP, COLL)
    for (const name of DEFAULT_LAWS) {
        if (LAW_INDEXES[name] !== undefined) lawSet(world.lawState, LAW_INDEXES[name]);
    }

    // Population controller — species profiles + spawn paths (P1 extraction).
    population = createPopulationController({
        view: () => world.particle.view,
        buffer: () => world.particle.buffer,
        dna: () => world.dna,
        worldParams: () => world.worldParams,
        worldSize: () => worldSize,
        rng: () => prng,
        onBirth: (parentId, childId, speciesId) => intelligence.birth(parentId, childId, speciesId),
    });
    const initial = population.spawnDefaultPopulation(0, speciesCount);
    particleCount = initial.count;
    speciesCount = initial.speciesCount;

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
    initUI(bus, world.lawState, world.dna);
    wireEvents();

    // Chaos Multiplex — long-press the Chaos button opens the guided-evolution
    // grid; while active, the main sim freezes and shards take over the loop.
    multiplexController = createMultiplexController(bus, () => ({
        view: world.particle.view,
        count: particleCount,
        dna: world.dna,
        laws: world.lawState,
        speciesCount,
    }), (shard) => {
        // Import the selected multiplex shard into the main world.
        const imported = copyShardToWorld(shard, { view: world.particle.view, dna: world.dna, laws: world.lawState });
        particleCount = imported.count;
        speciesCount = imported.speciesCount;
        world.population.count = particleCount;
        world.population.speciesCount = speciesCount;
        resetOffspringRing();
        intelligence.reset();
        bus.emit('species:sync', { count: speciesCount });
        bus.emit('dna:sync');
        bus.emit('law:sync');
        logDebug(`multiplex import: ${imported.count} particles / ${imported.speciesCount} species`);
    });
    window.openChaosMultiplex = () => { if (multiplexController) multiplexController.openModal(); };
    bus.on('multiplex:started', () => {
        paused = true;
        bus.emit('sim:paused', { paused: true });
    });
    bus.on('multiplex:exited', () => {
        paused = false;
        bus.emit('sim:paused', { paused: false });
    });

    // v4 — intelligence engine orchestration (P1 extraction)
    intelligence = createIntelligenceController({
        bus,
        view: () => world.particle.view,
        count: () => particleCount,
        stride: PARTICLE_STRIDE,
        indexes: STRIDE_INDEXES,
        worldSize: () => worldSize,
        lawCount: () => getLawCount(world.lawState),
        fps: () => fps,
        runtimeConfig,
        onRestore: ({ count, tick: restoredTick }) => {
            if (count !== undefined) particleCount = count;
            if (restoredTick !== undefined) tick = restoredTick;
        },
    });

    requestAnimationFrame(renderLoop);

    const dt = (performance.now() - t0).toFixed(1);
    console.log(`[VEPA v3] Booted in ${dt}ms — ${particleCount} particles, ${speciesCount} species`);
    logDebug(`booted in ${dt}ms — ${particleCount} particles, ${speciesCount} species`);
    bus.emit('boot:complete', { particleCount, speciesCount, dt });
}

/** Repaint the atmospheric backdrop canvas (sized to the viewport). */
function refreshBackground() {
    const bg = document.getElementById('bg-canvas');
    if (bg) paintBackground(bg);
}

function wireEvents() {
    bus.on('sim:pause', () => { paused = true; });
    bus.on('sim:resume', () => { paused = false; });
    bus.on('sim:restart', (opts = {}) => {
        // Restart = fresh population at tick 0 with the CURRENT configuration:
        // laws, world params and species params (roster + DNA) are untouched.
        // opts is accepted for compatibility (Chaos randomizes first, then
        // restarts onto the randomized laws/DNA — both are preserved here).
        prng = new PRNG(Date.now());
        // Clear buffer by zeroing all data
        world.particle.view.fill(0);
        // Reset offspring ring
        resetOffspringRing();
        // Respawn with the current DNA + species roster (no defaulting)
        const respawn = population.spawnDefaultPopulation(particleCount, speciesCount, true, true);
        particleCount = respawn.count;
        speciesCount = respawn.speciesCount;
        world.population.count = particleCount;
        world.population.speciesCount = speciesCount;
        tick = 0;
        world.time.tick = 0;
        paused = false;
        intelligence.reset();
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
        for (let i = 0; i < LAW_COUNT; i++) lawClear(world.lawState, i);

        // Apply group-based activation
        for (let g = 0; g < groups; g++) {
            const start = g * groupSize;
            const end = Math.min(start + groupSize, LAW_COUNT);
            const actProb = 0.4 + Math.random() * 0.6;
            if (Math.random() > 0.3) { // 70% chance group activates
                for (let j = start; j < end; j++) {
                    if (Math.random() < actProb) {
                        lawSet(world.lawState, shuffled[j]);
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
                    world.dna[s * 64 + p] = Math.round(normalized * 65535);
                }
            }
        }

        const active = getLawCount(world.lawState);
        logDebug(`chaos multiplexed: ${groups} groups, ${active} laws, ${Math.round(intensity*100)}% intensity`, 'warn');
        bus.emit('law:sync');
        bus.emit('narrative:system', { text: `Chaos multiplexed: ${groups} groups, ${active} laws, ${Math.round(intensity*100)}% intensity` });
    });

    bus.on('sim:chaosClear', () => {
        // Clear all laws
        for (let i = 0; i < LAW_COUNT; i++) {
            lawClear(world.lawState, i);
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
                        lawSet(world.lawState, idx);
                    } else {
                        lawClear(world.lawState, idx);
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
        world.worldParams = applyWorldParam(world.worldParams, key, value);
        runtimeConfig.worldParams = world.worldParams;
        switch (key) {
            case 'WORLD_SIZE':
                worldSize = world.worldParams.WORLD_SIZE;
                world.worldSize = worldSize;
                setWorldSize(worldSize);
                logDebug('world size set to ' + worldSize);
                break;
            case 'SPAWN_RATE':
                spawnRate = world.worldParams.SPAWN_RATE;
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
// Performance telemetry — exponentially-smoothed phase timings fed to the
// debug overlay (updateLiveStats) so the render loop's cost profile is
// visible live: f = full frame, t = physics tick, r = render.
let perfFrameMs = 0, perfTickMs = 0, perfRenderMs = 0;
const PERF_EMA = 0.15;
function emaPerf(prev, next) { return prev + (next - prev) * PERF_EMA; }

function renderLoop(now) {
    const loopStart = performance.now();
    requestAnimationFrame(renderLoop);
    frameCount++;
    if (now - lastFrameTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;
    }

    // Chaos Multiplex mode — step + render every shard, shared camera.
    if (multiplexController && multiplexController.isActive()) {
        const stepStart = loopStart;
        multiplexController.step(DT, runtimeConfig.simSpeed, worldSize);
        const stepEnd = performance.now();
        multiplexController.render(worldSize);
        const loopEnd = performance.now();
        perfTickMs = emaPerf(perfTickMs, stepEnd - stepStart);
        perfRenderMs = emaPerf(perfRenderMs, loopEnd - stepEnd);
        perfFrameMs = emaPerf(perfFrameMs, loopEnd - loopStart);
        const mx = multiplexController.mx || {};
        // summarizeMultiplex scans every shard particle — throttle to ~5 Hz.
        if (frameCount % 12 === 0) updateLiveStats({
            fps,
            tick: mx.tick || 0,
            particles: summarizeMultiplex(mx).alive,
            species: 0,
            laws: 0,
            frameMs: perfFrameMs,
            tickMs: perfTickMs,
            renderMs: perfRenderMs,
        });
        return;
    }

    // Always render (so paused state still shows particles)
    // Physics only runs when not paused
    if (!paused) {
    // Main-thread physics
    if (world.particle.view) {
        const tickStart = performance.now();
        solve(world.particle.view, particleCount, PARTICLE_STRIDE, world.lawState, world.dna, worldSize, DT * runtimeConfig.simSpeed, rng, simContextFromRuntimeConfig(runtimeConfig));
        particleCount = population.spawnOffspring(particleCount);
        // Regular population feed — SPAWN_RATE particles per second, placed
        // randomly within the configured initial spawn distribution.
        // Capped by MAX_POP (soft cap) and PARTICLE_COUNT (hard cap).
        const caps = spawnCaps(world.worldParams);
        if (spawnRate > 0 && particleCount < caps.softCap) {
            spawnAccumulator += spawnRate * (DT * runtimeConfig.simSpeed);
            while (spawnAccumulator >= 1 && particleCount < caps.softCap) {
                spawnAccumulator -= 1;
                particleCount = population.spawnSingleParticle(
                    Math.floor(prng.nextFloat(0, speciesCount)),
                    sampleSpawnPosition(world.worldParams, worldSize, prng),
                    particleCount,
                );
            }
        }
        world.population.count = particleCount;
        tick++;
        world.time.tick = tick;
        intelligence.update(tick);
        perfTickMs = emaPerf(perfTickMs, performance.now() - tickStart);
        updateLiveStats({ fps, tick, particles: particleCount, species: speciesCount, laws: getLawCount(world.lawState), frameMs: perfFrameMs, tickMs: perfTickMs, renderMs: perfRenderMs });
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
                        const d = world.particle.view[dbb + STRIDE_INDEXES.DEAD];
                        const px = world.particle.view[dbb], py = world.particle.view[dbb + 1];
                        if (d >= 0.5) deadCount++;
                        else if (px !== px || py !== py) nanPos++;
                        else aliveCount++;
                    }
                    dbg.fillStyle = '#ff0';
                    dbg.fillText('PARTICLES: ' + particleCount + ' | Alive: ' + aliveCount + ' Dead: ' + deadCount + ' NaN: ' + nanPos, 8, ly); ly += 14;
                    dbg.fillText('CANVAS: ' + renderer.width + 'x' + renderer.height + ' | Laws: ' + getLawCount(world.lawState), 8, ly); ly += 14;
                    const p0 = world.particle.view[0], p1 = world.particle.view[1], p2 = world.particle.view[2];
                    const c0 = world.particle.view[0 + STRIDE_INDEXES.COLOR_R], c1 = world.particle.view[0 + STRIDE_INDEXES.COLOR_G], c2 = world.particle.view[0 + STRIDE_INDEXES.COLOR_B];
                    const a = world.particle.view[0 + STRIDE_INDEXES.ALPHA];
                    const d0 = world.particle.view[0 + STRIDE_INDEXES.DEAD];
                    dbg.fillStyle = '#0ff';
                    dbg.fillText('POS: (' + p0.toFixed(1) + ',' + p1.toFixed(1) + ',' + p2.toFixed(1) + ') DEAD:' + d0.toFixed(2) + ' ALPHA:' + a.toFixed(2), 8, ly); ly += 14;
                    dbg.fillText('COLOR: rgb(' + c0 + ',' + c1 + ',' + c2 + ') | MASS:' + world.particle.view[6].toFixed(2) + ' NRG:' + world.particle.view[50].toFixed(1), 8, ly); ly += 14;
                    dbg.fillText('AGE:' + world.particle.view[51].toFixed(0) + ' HUNGER:' + world.particle.view[62].toFixed(2) + ' TEMP:' + world.particle.view[66].toFixed(2), 8, ly); ly += 14;
                }
                // Always show FPS in debug
                dbg.fillStyle = '#0f0';
                dbg.fillText('FPS: ' + fps + ' TICK: ' + tick, 8, ly);
                dbg.restore();
            }
        }
        bus.emit('physics:tick', { tick, buffer: world.particle.buffer, particleCount, speciesCount });
    }

    } // end if (!paused)

    // Render (always, even when paused)
    if (renderer && world.particle.buffer) {
        const renderStart = performance.now();
        renderer.paused = paused;
        syncSprites(renderer, world.particle.view, particleCount, PARTICLE_STRIDE, worldSize, world.lawState);
        perfRenderMs = emaPerf(perfRenderMs, performance.now() - renderStart);
        perfFrameMs = emaPerf(perfFrameMs, performance.now() - loopStart);
    }
}

// Global errors and unhandled rejections are captured by src/debug.js into
// the debug overlay (single message log for the whole page session).
boot().catch(e => {
    console.error('BOOT ERROR:', e);
    logDebug('BOOT ERROR: ' + (e.stack || e.message || e), 'error');
});
