// ============================================================================
// VEPA v4 — World Aggregate Tests
//
// Verifies the first-class World aggregate (src/world/world.js): composition
// from the sub-state modules, deep snapshot/restore round-trips (the canonical
// worker GET_STATE / RESTORE payloads), JSON serialization for persistence,
// clock advancement, and the World → Observation report boundary.
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  createWorld,
  snapshotWorld,
  restoreWorld,
  serializeWorld,
  deserializeWorld,
  advanceWorld,
  worldReport,
  WORLD_VERSION,
} from '../../src/world/world.js';
import { set as setLaw, isSet } from '../../src/state/lawState.js';
import { setDNA } from '../../src/dna/dnaBuffer.js';
import { STRIDE_INDEXES, WORLD_SIZE, MAX_PARTICLES } from '../../src/constants.js';

const S = STRIDE_INDEXES;
const STRIDE = 100; // PARTICLE_STRIDE — kept local for tests

function seedWorld(overrides = {}) {
  const world = createWorld({
    name: 'Test World',
    seed: 42,
    speciesCount: 3,
    stride: STRIDE,
    ...overrides,
  });
  // Place three live particles with distinct state + one dead slot.
  for (let i = 0; i < 3; i++) {
    const b = i * STRIDE;
    world.particle.view[b + S.POS_X] = i + 1;
    world.particle.view[b + S.POS_Y] = (i + 1) * 10;
    world.particle.view[b + S.POS_Z] = 0.5;
    world.particle.view[b + S.VEL_X] = 0.1 * i;
    world.particle.view[b + S.MASS] = 1 + i;
    world.particle.view[b + S.SPECIES_ID] = i % 2;
    world.particle.view[b + S.DEAD] = 0;
  }
  world.population.count = 3;
  return world;
}

describe('createWorld', () => {
  it('composes fresh sub-state with defaults', () => {
    const world = createWorld();
    expect(world.version).toBe(WORLD_VERSION);
    expect(world.worldParams).toBeTruthy();
    expect(world.worldParams.WORLD_SIZE).toBe(WORLD_SIZE);
    expect(world.lawState).toBeTruthy();
    expect(world.dna).toBeInstanceOf(Uint16Array);
    expect(world.particle.view).toBeInstanceOf(Float32Array);
    expect(world.particle.stride).toBe(STRIDE);
    expect(world.population).toEqual({ count: 0, speciesCount: 0 });
    expect(world.time.tick).toBe(0);
    expect(world.metadata.name).toBe('Unnamed World');
  });

  it('honors overrides for every sub-state', () => {
    const world = createWorld({
      name: 'Fork',
      seed: 7,
      count: 12,
      speciesCount: 5,
      tick: 99,
      worldSize: 2500,
      maxParticles: 2000,
      stride: 64,
    });
    expect(world.metadata.name).toBe('Fork');
    expect(world.metadata.seed).toBe(7);
    expect(world.population.count).toBe(12);
    expect(world.population.speciesCount).toBe(5);
    expect(world.time.tick).toBe(99);
    expect(world.worldSize).toBe(2500);
    expect(world.particle.maxParticles).toBe(2000);
    expect(world.particle.stride).toBe(64);
  });

  it('derives worldSize from worldParams when not overridden', () => {
    const params = { WORLD_SIZE: 9000 };
    const world = createWorld({ worldParams: params });
    expect(world.worldSize).toBe(9000);
  });
});

describe('snapshotWorld / restoreWorld', () => {
  it('round-trips buffers, law state, DNA, counters and metadata', () => {
    const world = seedWorld();
    setLaw(world.lawState, 0); // GRAV
    setLaw(world.lawState, 63); // a high-flag law
    setDNA(world.dna, 1, 0, 12345);
    world.time.tick = 500;

    const snap = snapshotWorld(world);
    expect(snap.version).toBe(WORLD_VERSION);
    expect(snap.particleCount).toBe(3);
    expect(snap.tick).toBe(500);
    expect(snap.worldParams.WORLD_SIZE).toBe(WORLD_SIZE);
    expect(snap.dna.length).toBe(world.dna.length);
    // lawState serialized to plain flags (law 63 → bit 31 of highFlags)
    expect(snap.lawState.low).toBe(1);
    expect(snap.lawState.high).toBe(2147483648);
    // particle payload covers exactly the live region (3 × stride)
    expect(snap.particle.buffer.length).toBe(3 * STRIDE);

    // Mutate the world, then restore — everything comes back.
    world.particle.view.fill(9);
    world.population.count = 0;
    world.time.tick = 0;
    setLaw(world.lawState, 0);
    setDNA(world.dna, 1, 0, 0);

    restoreWorld(world, snap);
    expect(world.population.count).toBe(3);
    expect(world.time.tick).toBe(500);
    expect(isSet(world.lawState, 63)).toBe(true);
    expect(world.dna[1 * 64 + 0]).toBe(12345);
    expect(world.particle.view[1 * STRIDE + S.MASS]).toBe(2); // particle #1 mass
    expect(world.particle.view[2 * STRIDE + S.POS_Y]).toBe(30);
    expect(world.metadata.name).toBe('Test World');
  });

  it('includeParticles:false omits the particle payload', () => {
    const world = seedWorld();
    const snap = snapshotWorld(world, { includeParticles: false });
    expect(snap.particle).toBeUndefined();
    expect(snap.particleCount).toBe(3);
  });

  it('restore is safe with a partial snapshot', () => {
    const world = seedWorld();
    world.time.tick = 10;
    restoreWorld(world, { tick: 77 });
    expect(world.time.tick).toBe(77);
    expect(world.population.count).toBe(3); // untouched
    restoreWorld(world, null);
    expect(world.time.tick).toBe(77);
  });

  it('restore copies only the live region (snapshot shorter than capacity)', () => {
    const world = createWorld({ count: 0, stride: STRIDE });
    world.population.count = 2;
    // snapshot taken when only 2 particles are live
    const snap = snapshotWorld(world);
    world.particle.view.set([1, 2, 3]); // garbage beyond live region
    restoreWorld(world, snap);
    // live region zeroed by the snapshot copy (2 × stride from a 0-length live view)
    expect(Array.from(world.particle.view.subarray(0, 2 * STRIDE))).toEqual(
      new Array(2 * STRIDE).fill(0),
    );
  });
});

describe('serializeWorld / deserializeWorld', () => {
  it('round-trips through JSON (persistence shape)', () => {
    const world = seedWorld();
    setLaw(world.lawState, 5);
    setDNA(world.dna, 2, 3, 999);
    world.time.tick = 42;
    world.metadata.note = 'persisted';

    const json = serializeWorld(world);
    const restored = deserializeWorld(json);

    expect(restored.population.count).toBe(3);
    expect(restored.population.speciesCount).toBe(3);
    expect(restored.time.tick).toBe(42);
    expect(restored.metadata.name).toBe('Test World');
    expect(restored.metadata.note).toBe('persisted');
    expect(isSet(restored.lawState, 5)).toBe(true);
    expect(restored.dna[2 * 64 + 3]).toBe(999);
    expect(restored.particle.view[2 * STRIDE + S.POS_Y]).toBe(30);
    expect(restored.worldSize).toBe(WORLD_SIZE);
  });

  it('accepts a plain snapshot object', () => {
    const world = seedWorld();
    const restored = deserializeWorld(snapshotWorld(world));
    expect(restored.particle.view[0 * STRIDE + S.POS_X]).toBe(1);
  });
});

describe('advanceWorld', () => {
  it('advances the clock and returns the new tick', () => {
    const world = createWorld({ tick: 5 });
    expect(advanceWorld(world)).toBe(6);
    expect(advanceWorld(world, 3)).toBe(9);
    expect(world.time.tick).toBe(9);
  });
});

describe('worldReport', () => {
  it('produces the World → Observation summary', () => {
    const world = seedWorld();
    // 2 alive (species 0,1) + 1 dead
    world.particle.view[2 * STRIDE + S.DEAD] = 1;
    world.time.tick = 10;
    setLaw(world.lawState, 0);

    const report = worldReport(world);
    expect(report.tick).toBe(10);
    expect(report.worldSize).toBe(WORLD_SIZE);
    expect(report.population.total).toBe(3);
    expect(report.population.alive).toBe(2);
    expect(report.population.dead).toBe(1);
    expect(report.population.nan).toBe(0);
    expect(report.perSpecies).toEqual([
      { speciesId: 0, count: 1 },
      { speciesId: 1, count: 1 },
    ]);
    expect(report.laws.active).toBe(1);
  });

  it('flags NaN positions (numerical-health check)', () => {
    const world = seedWorld();
    world.particle.view[0] = NaN; // POS_X of particle 0
    const report = worldReport(world);
    expect(report.population.nan).toBe(1);
    expect(report.population.alive).toBe(2); // NaN particle not counted alive
  });
});
