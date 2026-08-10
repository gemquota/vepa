/**
 * VEPA v3 — HUD Overlay
 * Real-time stats display: FPS, particle count, species count, tick number.
 */
import { PARTICLE_STRIDE, STRIDE_INDEXES } from '../constants.js';

let fpsDisplay = 0;
let frameCount = 0;
let lastFpsTime = 0;
let rafId = null;

const el = {
  fps: null,
  particles: null,
  species: null,
  tick: null,
};

function readEl() {
  el.fps = document.getElementById('hud-fps');
  el.particles = document.getElementById('hud-particles');
  el.species = document.getElementById('hud-species');
  el.tick = document.getElementById('hud-tick');
  // Color-coded accents (FPS green, population blue, species purple, tick dim)
  if (el.fps) el.fps.classList.add('hud-fps');
  if (el.particles) el.particles.classList.add('hud-particles');
  if (el.species) el.species.classList.add('hud-species');
  if (el.tick) el.tick.classList.add('hud-tick');
}

function tick(now) {
  frameCount++;
  if (now - lastFpsTime >= 1000) {
    fpsDisplay = frameCount;
    frameCount = 0;
    lastFpsTime = now;
    if (el.fps) el.fps.textContent = `${fpsDisplay} FPS`;
  }
  rafId = requestAnimationFrame(tick);
}

/**
 * Compute alive particle count from the buffer.
 */
function countAlive(buffer, count) {
  if (!buffer) return 0;
  let alive = 0;
  for (let i = 0; i < count; i++) {
    if (buffer[i * PARTICLE_STRIDE + STRIDE_INDEXES.DEAD] < 0.5) {
      alive++;
    }
  }
  return alive;
}

/**
 * Create the HUD overlay. Subscribes to events and starts the FPS counter.
 *
 * @param {import('../core/eventBus.js').EventBus} bus
 */
export function createHUD(bus) {
  readEl();
  lastFpsTime = performance.now();
  rafId = requestAnimationFrame(tick);

  let currentTick = 0;
  let lastParticles = -1;
  let lastSpecies = -1;
  let lastTickShown = -1;

  // Throttle DOM writes: particle/species text only changes when the value
  // changes; tick counter only updates every 10 ticks (avoids 60 DOM writes/s).
  const updateStats = (particleCount, speciesCount, t) => {
    if (particleCount !== undefined && particleCount !== lastParticles && el.particles) {
      lastParticles = particleCount;
      el.particles.textContent = `${particleCount} particles`;
    }
    if (speciesCount !== undefined && speciesCount !== lastSpecies && el.species) {
      lastSpecies = speciesCount;
      el.species.textContent = `${speciesCount} species`;
    }
    if (t !== undefined && t !== lastTickShown && t % 10 === 0 && el.tick) {
      lastTickShown = t;
      el.tick.textContent = `tick ${t}`;
    }
  };

  bus.on('physics:tick', ({ tick: t, particleCount, speciesCount }) => {
    currentTick = t;
    updateStats(particleCount, speciesCount, t);
  });

  // Also listen for direct stat updates
  bus.on('stats:update', ({ particleCount, speciesCount, tick: t }) => {
    updateStats(particleCount, speciesCount, t);
  });
}
