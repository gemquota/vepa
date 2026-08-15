// ============================================================================
// VEPA v4 — Physics Worker Protocol Test
//
// Headless verification that src/worker/physics.worker.js implements the
// documented protocol (INIT / CONFIG / TOGGLE_LAW / TICK / GET_STATE /
// RESTORE / PING → *_COMPLETE / STATE / PONG / ERROR), that a seeded worker
// evolves the world deterministically, and that a worker tick is
// byte-identical to the main-thread solver path given identical inputs.
//
// The worker runs in a child Node process (workerRunner.mjs) that owns the
// real worker file through a worker_threads shim — vitest's transform hooks
// cannot load project files inside nested worker threads, so the runner keeps
// the worker on a clean runtime, exactly as a browser would load it.
// ============================================================================

import { describe, it, expect, afterEach } from 'vitest';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import {
  createLawState,
  set as setLaw,
  serialize as serializeLawState,
} from '../../src/state/lawState.js';
import { createDNABuffer, loadDefaults } from '../../src/dna/dnaBuffer.js';
import {
  DNA_RANGES,
  LAW_COUNT,
  LAW_INDEXES,
  MAX_PARTICLES,
  PARTICLE_STRIDE,
  STRIDE_INDEXES,
  WORLD_SIZE,
} from '../../src/constants.js';
import { solve, drainOffspring, resetOffspringRing } from '../../src/physics/solver.js';
import { SplitMix32 } from '../../src/core/prng.js';

const DT = 0.25;
const SEED = 0xc0ffee;
const PARTICLE_COUNT = 250;

const S = STRIDE_INDEXES;
const RUNNER_PATH = fileURLToPath(new URL('./workerRunner.mjs', import.meta.url));

// Laws that exercise pairwise forces (GRAV, COLL), per-particle noise (ENTR),
// and stochastic lifecycle (LIFE, REPRO) — the paths most sensitive to PRNG
// stream and ordering.
const TEST_LAWS = [
  LAW_INDEXES.GRAV,
  LAW_INDEXES.DRAG,
  LAW_INDEXES.ENTR,
  LAW_INDEXES.COLL,
  LAW_INDEXES.LIFE,
  LAW_INDEXES.REPRO,
];

function lawsArray(enabled) {
  const arr = new Array(LAW_COUNT).fill(false);
  for (const i of enabled) arr[i] = true;
  return arr;
}

/** Deterministic 250-particle world; the PRNG stream here only seeds the
 *  world itself, not the simulation. */
function freshWorld() {
  const { buffer, view } = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
  const rng = new SplitMix32(SEED ^ 0x9e3779b9);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const b = i * PARTICLE_STRIDE;
    view[b + S.POS_X] = rng.next() * WORLD_SIZE;
    view[b + S.POS_Y] = rng.next() * WORLD_SIZE;
    view[b + S.POS_Z] = rng.next() * WORLD_SIZE;
    view[b + S.VEL_X] = (rng.next() - 0.5) * 20;
    view[b + S.VEL_Y] = (rng.next() - 0.5) * 20;
    view[b + S.VEL_Z] = (rng.next() - 0.5) * 20;
    view[b + S.MASS] = 0.5 + rng.next();
    view[b + S.SPECIES_ID] = i % 5;
    view[b + S.DEAD] = 0; // alive
  }
  return { buffer, view };
}

function freshDNA() {
  const dna = createDNABuffer();
  loadDefaults(dna, DNA_RANGES);
  return dna;
}

function viewToB64(view) {
  return Buffer.from(view.buffer, view.byteOffset, view.byteLength).toString('base64');
}

function b64ToView(b64) {
  const buf = Buffer.from(b64, 'base64');
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}

// ── Runner client ──

const runners = [];
function spawnRunner() {
  const child = spawn(process.execPath, [RUNNER_PATH], {
    stdio: ['pipe', 'pipe', 'inherit'],
  });
  let seq = 0;
  const pending = new Map();
  const rl = createInterface({ input: child.stdout });
  rl.on('line', (line) => {
    let m;
    try {
      m = JSON.parse(line);
    } catch {
      return;
    }
    if (m.id !== undefined && pending.has(m.id)) {
      const entry = pending.get(m.id);
      pending.delete(m.id);
      clearTimeout(entry.timer);
      entry.resolve(m);
    }
  });
  child.on('error', (e) => {
    for (const [, entry] of pending) {
      clearTimeout(entry.timer);
      entry.reject(e);
    }
    pending.clear();
  });
  const runner = {
    request(msg) {
      const id = ++seq;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          if (pending.delete(id)) reject(new Error(`timeout waiting for runner reply to ${msg.type}`));
        }, 15000);
        pending.set(id, { resolve, reject, timer });
        child.stdin.write(JSON.stringify({ id, ...msg }) + '\n');
      });
    },
    async terminate() {
      child.stdin.end();
      await new Promise((resolve) => {
        if (child.exitCode !== null) return resolve();
        child.once('exit', resolve);
      });
      child.kill();
    },
  };
  runners.push(runner);
  return runner;
}

afterEach(async () => {
  while (runners.length) {
    const r = runners.pop();
    await r.terminate();
  }
});

const INIT_CONFIG = {
  dt: DT,
  worldSize: WORLD_SIZE,
  laws: lawsArray(TEST_LAWS),
};

async function initRunner(seed = SEED, config = INIT_CONFIG) {
  const runner = spawnRunner();
  const world = freshWorld();
  const res = await runner.request({
    type: 'INIT',
    seed,
    count: PARTICLE_COUNT,
    world: viewToB64(world.view),
    config,
  });
  return { runner, world, res };
}

describe('Physics worker protocol', () => {
  it('INIT → INIT_COMPLETE with shared buffer and config applied', async () => {
    const { res } = await initRunner();
    expect(res.type).toBe('INIT_COMPLETE');
    expect(res.reply.particleCount).toBe(PARTICLE_COUNT);
    expect(res.reply.hasSharedArrayBuffer).toBe(true);
    expect(res.reply.tickCount).toBe(0);
    expect(res.reply.lawState).toBeTruthy();
    expect(res.buffer).toBeTruthy();
  });

  it('INIT without a valid buffer → ERROR', async () => {
    const runner = spawnRunner();
    const res = await runner.request({ type: 'INIT', seed: SEED, count: 10 });
    expect(res.type).toBe('ERROR');
    expect(res.error || res.reply?.error).toContain('Invalid buffer type');
  });

  it('TICK before INIT → ERROR', async () => {
    const runner = spawnRunner();
    const res = await runner.request({ type: 'TICK', expectError: true });
    expect(res.type).toBe('ERROR');
    expect(res.error || res.reply?.error).toContain('No particle buffer initialized');
  });

  it('TICK → TICK_COMPLETE increments tickCount and may emit offspring', async () => {
    const { runner } = await initRunner();
    const t1 = await runner.request({ type: 'TICK' });
    expect(t1.type).toBe('TICK_COMPLETE');
    expect(t1.reply.tickCount).toBe(1);
    expect(t1.reply.particleCount).toBe(PARTICLE_COUNT);
    expect(typeof t1.reply.tickDuration).toBe('number');

    const t2 = await runner.request({ type: 'TICK' });
    expect(t2.reply.tickCount).toBe(2);
    // REPRO is active, so offspring may be emitted on either tick.
    expect(Array.isArray(t2.reply.offspring) || t2.reply.offspring === undefined).toBe(true);
  });

  it('CONFIG updates runtime settings and law state', async () => {
    const { runner } = await initRunner();
    const res = await runner.request({
      type: 'CONFIG',
      config: {
        dt: 1.0,
        worldSize: 1000,
        laws: lawsArray([LAW_INDEXES.GRAV]),
        seed: SEED,
      },
    });
    expect(res.type).toBe('CONFIG_COMPLETE');
    expect(res.reply.worldSize).toBe(1000);
    expect(res.reply.lawState).toBeTruthy();
  });

  it('TOGGLE_LAW flips bits and echoes the serialized state', async () => {
    const { runner } = await initRunner();

    const on = await runner.request({
      type: 'TOGGLE_LAW',
      lawIndex: LAW_INDEXES.GRAV,
      forceOn: true,
    });
    expect(on.type).toBe('LAW_TOGGLED');
    expect(on.reply.active).toBe(true);

    const off = await runner.request({
      type: 'TOGGLE_LAW',
      lawIndex: LAW_INDEXES.GRAV,
      forceOff: true,
    });
    expect(off.type).toBe('LAW_TOGGLED');
    expect(off.reply.active).toBe(false);
  });

  it('TOGGLE_LAW out of range → ERROR', async () => {
    const { runner } = await initRunner();
    const res = await runner.request({ type: 'TOGGLE_LAW', lawIndex: LAW_COUNT + 50 });
    expect(res.type).toBe('ERROR');
    expect(res.error || res.reply?.error).toContain('Invalid law index');
  });

  it('GET_STATE → STATE snapshot', async () => {
    const { runner } = await initRunner();
    await runner.request({ type: 'TICK' });

    const res = await runner.request({ type: 'GET_STATE' });
    expect(res.type).toBe('STATE');
    expect(res.reply.particleCount).toBe(PARTICLE_COUNT);
    expect(res.reply.tickCount).toBe(1);
    expect(res.reply.worldSize).toBe(WORLD_SIZE);
    expect(res.reply.hasSharedArrayBuffer).toBe(true);
  });

  it('RESTORE replaces law state and counters', async () => {
    const { runner } = await initRunner();

    const target = createLawState();
    setLaw(target, LAW_INDEXES.ACCR);
    setLaw(target, LAW_INDEXES.CHAOS);
    const res = await runner.request({
      type: 'RESTORE',
      lawState: serializeLawState(target),
      particleCount: 123,
      tickCount: 77,
    });
    expect(res.type).toBe('RESTORE_COMPLETE');
    expect(res.reply.tickCount).toBe(77);

    const state = await runner.request({ type: 'GET_STATE' });
    expect(state.reply.particleCount).toBe(123);
    expect(state.reply.tickCount).toBe(77);
  });

  it('PING → PONG with current tick count', async () => {
    const { runner } = await initRunner();
    await runner.request({ type: 'TICK' });

    const res = await runner.request({ type: 'PING' });
    expect(res.type).toBe('PONG');
    expect(res.reply.tickCount).toBe(1);
  });

  it('unknown message type → ERROR', async () => {
    const { runner } = await initRunner();
    const res = await runner.request({ type: 'BOGUS' });
    expect(res.type).toBe('ERROR');
    expect(res.error || res.reply?.error).toContain('Unknown message type');
  });
});

describe('Physics worker determinism', () => {
  it('same seed ⇒ identical world evolution across runners', async () => {
    const a = await initRunner(SEED);
    const b = await initRunner(SEED);

    for (let i = 0; i < 3; i++) {
      await a.runner.request({ type: 'TICK' });
      await b.runner.request({ type: 'TICK' });
    }

    const bufA = await a.runner.request({ type: 'GET_BUFFER' });
    const bufB = await b.runner.request({ type: 'GET_BUFFER' });
    expect(Array.from(b64ToView(bufA.buffer))).toEqual(Array.from(b64ToView(bufB.buffer)));
  });

  it('different seeds ⇒ divergent worlds (PRNG is actually consumed)', async () => {
    const a = await initRunner(SEED);
    const b = await initRunner(SEED + 1);

    await a.runner.request({ type: 'TICK' });
    await b.runner.request({ type: 'TICK' });

    const bufA = await a.runner.request({ type: 'GET_BUFFER' });
    const bufB = await b.runner.request({ type: 'GET_BUFFER' });
    expect(Array.from(b64ToView(bufA.buffer))).not.toEqual(Array.from(b64ToView(bufB.buffer)));
  });
});

describe('Worker vs main-thread solver parity', () => {
  it('worker tick is byte-identical to a main-thread solve with the same seed', async () => {
    const { runner, world } = await initRunner(SEED);

    // Main-thread side: pristine copy of the identical initial world. Both
    // sides consume one continuous PRNG stream from the same seed, so tick
    // n+1 on each side starts from bit-identical state and consumes the same
    // number of draws in the same order.
    const mainView = new Float32Array(world.view.length);
    mainView.set(world.view);
    const mainLaws = createLawState();
    for (const i of TEST_LAWS) setLaw(mainLaws, i);
    const mainDNA = freshDNA();
    const rng = new SplitMix32(SEED);

    for (let tick = 1; tick <= 3; tick++) {
      await runner.request({ type: 'TICK' });

      resetOffspringRing();
      solve(
        mainView,
        PARTICLE_COUNT,
        PARTICLE_STRIDE,
        mainLaws,
        mainDNA,
        WORLD_SIZE,
        DT,
        rng.next.bind(rng),
      );
      drainOffspring();

      const workerBuf = await runner.request({ type: 'GET_BUFFER' });
      expect(Array.from(b64ToView(workerBuf.buffer))).toEqual(Array.from(mainView));
    }
  });
});
