// ============================================================================
// VEPA v4 — World Aggregate
//
// The audit's central architectural recommendation, now concrete: a World is a
// first-class aggregate that owns every piece of simulation state the solver
// and application layer used to carry around separately — world parameters,
// law state, species genomes, the particle population, time and metadata.
//
// Before this module those concepts lived in scattered module-level variables
// (worldParams, lawState, dnaBuffer, particleBuffer, particleCount, tick,
// worldSize) in main.js, the worker and the multiplex controller. Everything
// now composes into one object with a stable shape:
//
//   world = {
//     version,                       // WORLD_VERSION (4)
//     worldParams,                   // WORLD panel sliders (plain object)
//     lawState,                      // 4×Uint32Array bitmask (state/lawState.js)
//     dna,                           // Uint16Array species genome table
//     particle: { buffer, view, isShared, stride, maxParticles },
//     worldSize,
//     population: { count, speciesCount },
//     time: { tick },
//     metadata: { name, seed, createdAt, note },
//   }
//
// The module is headless and pure: no module-level mutable state, no DOM, no
// worker globals. The same world object can be owned by the main thread, a Web
// Worker, a headless Node process, or a server — which is exactly the portability
// the simContext (P0) established for solver tunables, extended here to the
// whole world state.
//
// The aggregate also owns the canonical state-transfer boundary:
//   - snapshotWorld / restoreWorld  — deep in-memory copies (worker protocol
//     GET_STATE / RESTORE, timeline scrubs, multiplex shard restore).
//   - serializeWorld / deserializeWorld — JSON-safe persistence (presets,
//     world import/export, server round-trips).
//   - worldReport — the World → Observation boundary: a plain summary of what
//     the world is right now, consumed by engines and UI without touching
//     internal buffers.
// ============================================================================

import {
  MAX_PARTICLES,
  PARTICLE_STRIDE,
  STRIDE_INDEXES,
  WORLD_SIZE,
} from '../constants.js';
import { createWorldParams } from '../state/worldParams.js';
import {
  createLawState,
  deserialize as deserializeLawState,
  getActiveCount,
  serialize as serializeLawState,
} from '../state/lawState.js';
import { createParticleBuffer } from '../state/particleBuffer.js';
import { createDNABuffer } from '../dna/dnaBuffer.js';

export const WORLD_VERSION = 4;

/**
 * Build a World aggregate, composing the sub-state modules. Every field can be
 * overridden; absent fields fall back to fresh, deterministic defaults.
 * @param {object} [overrides]
 * @returns {object} the world aggregate (see header diagram)
 */
export function createWorld(overrides = {}) {
  const worldParams = overrides.worldParams ?? createWorldParams();
  // A fully-provided particle object (e.g. the worker wrapping its live
  // SharedArrayBuffer, or the multiplex controller wrapping shard buffers)
  // is used as-is — no allocation. Otherwise allocate at the given capacity.
  const particle =
    overrides.particle ??
    createParticleBuffer(
      overrides.maxParticles ?? MAX_PARTICLES,
      overrides.stride ?? PARTICLE_STRIDE,
    );
  return {
    version: WORLD_VERSION,
    worldParams,
    lawState: overrides.lawState ?? createLawState(),
    dna: overrides.dna ?? createDNABuffer(),
    particle: {
      buffer: particle.buffer,
      view: particle.view,
      isShared: particle.isShared,
      stride: overrides.stride ?? particle.stride ?? PARTICLE_STRIDE,
      maxParticles: overrides.maxParticles ?? particle.maxParticles ?? MAX_PARTICLES,
    },
    worldSize: overrides.worldSize ?? worldParams.WORLD_SIZE ?? WORLD_SIZE,
    population: {
      count: overrides.count ?? 0,
      speciesCount: overrides.speciesCount ?? 0,
    },
    time: { tick: overrides.tick ?? 0 },
    metadata: {
      name: overrides.name ?? 'Unnamed World',
      seed: overrides.seed ?? 0,
      createdAt: overrides.createdAt ?? Date.now(),
      note: overrides.note ?? '',
    },
  };
}

/**
 * Deep-copy the world into a plain object. Typed arrays are flattened to
 * regular arrays so the snapshot is JSON-safe AND structured-clone-safe
 * (postMessage, worker threads, localStorage). The particle payload copies only
 * the live region (count × stride floats), never the whole capacity buffer.
 *
 * @param {object} world
 * @param {{ includeParticles?: boolean }} [opts] — includeParticles defaults to
 *   true; pass false when the caller can read the shared buffer directly (the
 *   worker's GET_STATE path) and only needs counters + law/DNA state.
 */
export function snapshotWorld(world, opts = {}) {
  const includeParticles = opts.includeParticles ?? true;
  const snap = {
    version: world.version,
    worldParams: { ...world.worldParams },
    lawState: serializeLawState(world.lawState),
    dna: Array.from(world.dna),
    worldSize: world.worldSize,
    particleCount: world.population.count,
    speciesCount: world.population.speciesCount,
    tick: world.time.tick,
    metadata: { ...world.metadata },
  };
  if (includeParticles) {
    snap.particle = {
      stride: world.particle.stride,
      maxParticles: world.particle.maxParticles,
      buffer: Array.from(
        world.particle.view.subarray(0, world.population.count * world.particle.stride),
      ),
    };
  }
  return snap;
}

/**
 * Write a snapshot back into the world. Buffers are copied in place (the
 * world's existing ArrayBuffer/SharedArrayBuffer and views stay alive, so
 * renderers and workers holding the old view keep working). Missing snapshot
 * fields leave the corresponding world state untouched.
 *
 * @param {object} world
 * @param {object} snapshot - output of snapshotWorld (or a partial one)
 * @returns {object} the same world (mutated)
 */
export function restoreWorld(world, snapshot) {
  if (!snapshot) return world;
  if (snapshot.worldParams) world.worldParams = { ...snapshot.worldParams };
  if (snapshot.lawState) world.lawState = deserializeLawState(snapshot.lawState);
  if (snapshot.dna) {
    const n = Math.min(snapshot.dna.length, world.dna.length);
    world.dna.set(snapshot.dna.subarray ? snapshot.dna.subarray(0, n) : snapshot.dna.slice(0, n));
  }
  if (snapshot.particle && snapshot.particle.buffer) {
    const n = Math.min(snapshot.particle.buffer.length, world.particle.view.length);
    world.particle.view.set(
      snapshot.particle.buffer.subarray
        ? snapshot.particle.buffer.subarray(0, n)
        : snapshot.particle.buffer.slice(0, n),
    );
  }
  if (snapshot.worldSize !== undefined) world.worldSize = snapshot.worldSize;
  if (snapshot.particleCount !== undefined) world.population.count = snapshot.particleCount;
  if (snapshot.speciesCount !== undefined) world.population.speciesCount = snapshot.speciesCount;
  if (snapshot.tick !== undefined) world.time.tick = snapshot.tick;
  if (snapshot.metadata) world.metadata = { ...world.metadata, ...snapshot.metadata };
  return world;
}

/**
 * JSON-stringify the whole world (particles included) for persistence,
 * presets, world import/export and server round-trips.
 * @param {object} world
 * @returns {string}
 */
export function serializeWorld(world) {
  return JSON.stringify(snapshotWorld(world, { includeParticles: true }));
}

/**
 * Rebuild a world from serializedWorld output (or a plain snapshot object).
 * Buffers are freshly allocated at the snapshot's capacity; live particles are
 * copied back exactly.
 * @param {string|object} data
 * @returns {object} a new world aggregate
 */
export function deserializeWorld(data) {
  const snap = typeof data === 'string' ? JSON.parse(data) : data;
  const world = createWorld({
    worldParams: snap.worldParams,
    lawState: deserializeLawState(snap.lawState),
    maxParticles: snap.particle?.maxParticles ?? MAX_PARTICLES,
    stride: snap.particle?.stride ?? PARTICLE_STRIDE,
    worldSize: snap.worldSize,
    count: snap.particleCount ?? 0,
    speciesCount: snap.speciesCount ?? 0,
    tick: snap.tick ?? 0,
    seed: snap.metadata?.seed,
    name: snap.metadata?.name,
    note: snap.metadata?.note,
  });
  if (snap.dna) {
    const n = Math.min(snap.dna.length, world.dna.length);
    world.dna.set(snap.dna.slice(0, n));
  }
  if (snap.particle?.buffer) {
    const n = Math.min(snap.particle.buffer.length, world.particle.view.length);
    world.particle.view.set(snap.particle.buffer.slice(0, n));
  }
  return world;
}

/**
 * Advance the world clock. Returns the new tick.
 * @param {object} world
 * @param {number} [ticks=1]
 * @returns {number}
 */
export function advanceWorld(world, ticks = 1) {
  world.time.tick += ticks;
  return world.time.tick;
}

/**
 * World → Observation boundary. Produces a plain, buffer-free summary of the
 * world's current state for engines and UI: population census (alive / dead /
 * NaN), per-species distribution, active law count and the clock.
 * @param {object} world
 * @returns {object} report (see shape below)
 */
export function worldReport(world) {
  const view = world.particle.view;
  const stride = world.particle.stride;
  const count = world.population.count;
  const DEAD = STRIDE_INDEXES.DEAD;
  const SPECIES = STRIDE_INDEXES.SPECIES_ID;
  let alive = 0;
  let dead = 0;
  let nanPos = 0;
  const perSpecies = new Map();
  for (let i = 0; i < count; i++) {
    const b = i * stride;
    if (view[b + DEAD] >= 0.5) {
      dead++;
      continue;
    }
    const px = view[b];
    const py = view[b + 1];
    if (px !== px || py !== py) {
      nanPos++; // unhealthy particle: neither alive nor dead (debug census convention)
      continue;
    }
    alive++;
    const s = view[b + SPECIES];
    perSpecies.set(s, (perSpecies.get(s) || 0) + 1);
  }
  return {
    tick: world.time.tick,
    worldSize: world.worldSize,
    population: {
      total: count,
      alive,
      dead,
      nan: nanPos,
      species: world.population.speciesCount,
    },
    perSpecies: Array.from(perSpecies, ([speciesId, n]) => ({ speciesId, count: n }))
      .sort((a, b) => a.speciesId - b.speciesId),
    laws: { active: getActiveCount(world.lawState) },
  };
}
