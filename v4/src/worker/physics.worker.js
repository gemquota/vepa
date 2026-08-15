// ============================================================================
// VEPA v4 — Physics Worker
// Web Worker that runs the physics simulation off the main thread.
// Handles INIT, CONFIG, TOGGLE_LAW, TICK, GET_STATE, RESTORE, and PING
// messages. Falls back to ArrayBuffer + main-thread copy-back if
// SharedArrayBuffer is unavailable.
// ============================================================================

import { solve, drainOffspring, resetOffspringRing } from '../physics/solver.js';
import {
  createLawState,
  toggle as toggleLaw,
  set as setLaw,
  clear as clearLaw,
  isSet,
  serialize as serializeLawState,
  deserialize as deserializeLawState,
} from '../state/lawState.js';
import { createWorld, snapshotWorld, restoreWorld } from '../world/world.js';
import {
  PARTICLE_STRIDE,
  MAX_PARTICLES,
  WORLD_SIZE,
  LAW_COUNT,
} from '../constants.js';

// ── Worker State ──

let particleBuffer = null;   // SharedArrayBuffer (or fallback ArrayBuffer)
let particleView = null;     // Float32Array view over particleBuffer
let particleCount = 0;
let stride = PARTICLE_STRIDE;
let worldSize = WORLD_SIZE;
let lawState = createLawState();
let dnaBuffer = null;        // SharedArrayBuffer for species DNA
let dnaView = null;          // Uint16Array view over dnaBuffer
let dt = 1.0;
let tickCount = 0;
let hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';

// ── Fallback State (no SharedArrayBuffer) ──

let fallbackBuffer = null;
let fallbackView = null;
let fallbackActive = false;

// ── Message Handler ──

self.onmessage = function onWorkerMessage(event) {
  const msg = event.data;
  if (!msg || !msg.type) return;

  switch (msg.type) {
    case 'INIT':
      handleInit(msg);
      break;

    case 'CONFIG':
      handleConfig(msg);
      break;

    case 'TOGGLE_LAW':
      handleToggleLaw(msg);
      break;

    case 'TICK':
      handleTick(msg);
      break;

    case 'GET_STATE':
      handleGetState();
      break;

    case 'RESTORE':
      handleRestore(msg);
      break;

    case 'PING':
      self.postMessage({ type: 'PONG', tickCount });
      break;

    default:
      self.postMessage({
        type: 'ERROR',
        error: `Unknown message type: ${msg.type}`,
      });
  }
};

// ── INIT Handler ──

function handleInit(msg) {
  const {
    buffer: sharedBuffer,
    count,
    config,
    dnaBuffer: sharedDna,
  } = msg;

  // Determine if we have SharedArrayBuffer
  if (sharedBuffer instanceof SharedArrayBuffer) {
    hasSharedArrayBuffer = true;
    particleBuffer = sharedBuffer;
    particleView = new Float32Array(particleBuffer);
  } else if (sharedBuffer instanceof ArrayBuffer) {
    // Fallback: main thread passed a regular ArrayBuffer (copy-on-write)
    hasSharedArrayBuffer = false;
    fallbackActive = true;
    fallbackBuffer = sharedBuffer;
    fallbackView = new Float32Array(fallbackBuffer);
    particleView = fallbackView;
  } else {
    self.postMessage({
      type: 'ERROR',
      error: 'INIT: Invalid buffer type. Expected SharedArrayBuffer or ArrayBuffer.',
    });
    return;
  }

  particleCount = count || 0;
  stride = PARTICLE_STRIDE;
  resetOffspringRing();
  tickCount = 0;

  // Deterministic seed — same seed ⇒ identical world evolution. Falls back
  // to Date.now() when the caller does not supply one.
  if (msg.seed !== undefined) {
    _prngState = msg.seed | 0;
  }

  // Apply initial config
  if (config) {
    applyConfig(config);
  }

  // DNA buffer
  if (sharedDna instanceof SharedArrayBuffer) {
    dnaBuffer = sharedDna;
    dnaView = new Uint16Array(dnaBuffer);
  } else if (sharedDna instanceof ArrayBuffer) {
    dnaBuffer = sharedDna;
    dnaView = new Uint16Array(dnaBuffer);
  } else {
    // Create default empty DNA buffer
    const dnaByteLength = 64 * 64 * Uint16Array.BYTES_PER_ELEMENT;
    if (typeof SharedArrayBuffer !== 'undefined') {
      dnaBuffer = new SharedArrayBuffer(dnaByteLength);
    } else {
      dnaBuffer = new ArrayBuffer(dnaByteLength);
    }
    dnaView = new Uint16Array(dnaBuffer);
  }

  self.postMessage({
    type: 'INIT_COMPLETE',
    tickCount: 0,
    hasSharedArrayBuffer,
    particleCount,
    lawState: serializeLawState(lawState),
  });
}

// ── CONFIG Handler ──

function handleConfig(msg) {
  const { config } = msg;
  if (config) {
    applyConfig(config);
  }

  // If new buffer provided, swap it in
  if (msg.buffer) {
    if (msg.buffer instanceof SharedArrayBuffer) {
      particleBuffer = msg.buffer;
      particleView = new Float32Array(particleBuffer);
      hasSharedArrayBuffer = true;
    } else if (msg.buffer instanceof ArrayBuffer) {
      fallbackBuffer = msg.buffer;
      fallbackView = new Float32Array(fallbackBuffer);
      particleView = fallbackView;
    }
  }

  // If new DNA buffer provided
  if (msg.dnaBuffer) {
    if (msg.dnaBuffer instanceof SharedArrayBuffer || msg.dnaBuffer instanceof ArrayBuffer) {
      dnaBuffer = msg.dnaBuffer;
      dnaView = new Uint16Array(dnaBuffer);
    }
  }

  self.postMessage({
    type: 'CONFIG_COMPLETE',
    particleCount,
    worldSize,
    lawState: serializeLawState(lawState),
  });
}

function applyConfig(config) {
  if (config.particleCount !== undefined) particleCount = config.particleCount;
  if (config.worldSize !== undefined) worldSize = config.worldSize;
  if (config.dt !== undefined) dt = config.dt;
  if (config.stride !== undefined) stride = config.stride;
  if (config.seed !== undefined) _prngState = config.seed | 0;

  // Restore law state from serialized form
  if (config.lawState) {
    if (typeof config.lawState === 'object' && 'low' in config.lawState) {
      lawState = deserializeLawState(config.lawState);
    }
  }

  // Set specific laws from array
  if (config.laws && Array.isArray(config.laws)) {
    lawState = createLawState();
    for (let i = 0; i < config.laws.length && i < LAW_COUNT; i++) {
      if (config.laws[i]) {
        setLaw(lawState, i);
      }
    }
  }
}

// ── TOGGLE_LAW Handler ──

function handleToggleLaw(msg) {
  const { lawIndex, forceOn, forceOff } = msg;

  if (typeof lawIndex !== 'number' || lawIndex < 0 || lawIndex >= LAW_COUNT) {
    self.postMessage({
      type: 'ERROR',
      error: `TOGGLE_LAW: Invalid law index ${lawIndex}. Must be 0-${LAW_COUNT - 1}.`,
    });
    return;
  }

  if (forceOn) {
    setLaw(lawState, lawIndex);
  } else if (forceOff) {
    clearLaw(lawState, lawIndex);
  } else {
    toggleLaw(lawState, lawIndex);
  }

  self.postMessage({
    type: 'LAW_TOGGLED',
    lawIndex,
    active: isSet(lawState, lawIndex),
    lawState: serializeLawState(lawState),
  });
}

// ── TICK Handler ──

function handleTick(msg) {
  if (!particleView) {
    self.postMessage({
      type: 'ERROR',
      error: 'TICK: No particle buffer initialized. Send INIT first.',
    });
    return;
  }

  if (msg.particleCount !== undefined) particleCount = msg.particleCount;
  if (msg.dt !== undefined) dt = msg.dt;

  const tickStart = performance.now();

  // Run the solver
  solve(
    particleView,
    particleCount,
    stride,
    lawState,
    dnaView,
    worldSize,
    dt,
    prng
  );

  // Collect offspring
  const offspring = drainOffspring();

  tickCount++;
  const tickDuration = performance.now() - tickStart;

  // Post result back to main thread
  const reply = {
    type: 'TICK_COMPLETE',
    tickCount,
    tickDuration,
    particleCount,
  };

  if (offspring.length > 0) {
    reply.offspring = offspring;
  }

  self.postMessage(reply);
}

// ── GET_STATE Handler ──
//
// The worker's state is defined in terms of the World aggregate (P2): build a
// world wrapper over the live buffers, then snapshot it. The particle payload
// is omitted (includeParticles:false) because the caller can read the shared
// buffer directly — the snapshot carries counters, law state and DNA, which is
// all a sync point needs.

function buildWorkerWorld() {
  return createWorld({
    particle: {
      buffer: particleBuffer,
      view: particleView,
      isShared: hasSharedArrayBuffer,
      stride,
      maxParticles: MAX_PARTICLES,
    },
    dna: dnaView,
    lawState,
    count: particleCount,
    worldSize,
    tick: tickCount,
  });
}

function handleGetState() {
  const snap = snapshotWorld(buildWorkerWorld(), { includeParticles: false });
  self.postMessage({
    type: 'STATE',
    particleCount: snap.particleCount,
    worldSize: snap.worldSize,
    tickCount: snap.tick,
    lawState: snap.lawState,
    speciesCount: snap.speciesCount,
    hasSharedArrayBuffer,
  });
}

// ── RESTORE Handler ──
//
// restoreWorld writes the snapshot back into the worker's live buffers and
// law state, then the loose counters are re-synced for the TICK path.

function handleRestore(msg) {
  // Protocol field name: tickCount (legacy) vs aggregate field: tick.
  const payload = { ...msg };
  if (payload.tickCount !== undefined && payload.tick === undefined) {
    payload.tick = payload.tickCount;
  }
  const world = buildWorkerWorld();
  restoreWorld(world, payload);
  lawState = world.lawState;
  particleCount = world.population.count;
  tickCount = world.time.tick;
  worldSize = world.worldSize;

  self.postMessage({
    type: 'RESTORE_COMPLETE',
    tickCount,
    lawState: serializeLawState(lawState),
  });
}

// ── PRNG for Worker ──

// SplitMix32-style PRNG (deterministic, fast, no Math.random dependency).
// Identical algorithm to src/core/prng.js SplitMix32, so a worker tick with
// seed S evolves the world byte-identically to a main-thread solve using
// `new SplitMix32(S)`. Default seed stays wall-clock for callers that do not
// opt into determinism.
let _prngState = Date.now() | 0;

function prng() {
  let z = (_prngState + 0x9e3779b9) | 0;
  _prngState = z;
  z = (z ^ (z >>> 16)) | 0;
  z = Math.imul(z, 0x21f0aaad);
  z = z ^ (z >>> 15);
  z = Math.imul(z, 0x735a2d97);
  z = z ^ (z >>> 15);
  return (z >>> 0) / 4294967296;
}

// ── Main-Thread Fallback Mode ──

// When SharedArrayBuffer is unavailable, the worker runs in a simple
// request/response loop: main thread sends buffer copies, worker
// processes them and sends them back. This is slower but functional.
//
// The TICK handler above already works for both modes:
// - SharedArrayBuffer: solver writes directly, main thread sees changes
// - ArrayBuffer: worker sends TICK_COMPLETE, main thread must copy state back
//
// The main thread should check hasSharedArrayBuffer in INIT_COMPLETE
// and decide whether to re-copy the buffer after each TICK_COMPLETE.

self.postMessage({ type: 'WORKER_READY' });
