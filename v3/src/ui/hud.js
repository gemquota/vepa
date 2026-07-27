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

  bus.on('physics:tick', ({ tick: t, particleCount, speciesCount }) => {
    currentTick = t;
    if (el.particles) el.particles.textContent = `${particleCount} particles`;
    if (el.species) el.species.textContent = `${speciesCount} species`;
    if (el.tick) el.tick.textContent = `tick ${t}`;
  });

  // Also listen for direct stat updates
  bus.on('stats:update', ({ particleCount, speciesCount, tick: t }) => {
    if (particleCount !== undefined && el.particles) {
      el.particles.textContent = `${particleCount} particles`;
    }
    if (speciesCount !== undefined && el.species) {
      el.species.textContent = `${speciesCount} species`;
    }
    if (t !== undefined && el.tick) {
      el.tick.textContent = `tick ${t}`;
    }
  });
}
