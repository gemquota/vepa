// ============================================================================
// VEPA v4 — Headless Worker Runner (child process)
//
// Spawned by tests/unit/workerProtocol.test.js via child_process. Runs in a
// fresh Node runtime (no vitest transform hooks), where it owns a
// worker_threads Worker running the real src/worker/physics.worker.js through
// the workerHost.mjs shim. Protocol messages are relayed over stdin/stdout as
// JSON lines; particle-buffer payloads travel as base64 because SABs cannot
// cross a process boundary.
// ============================================================================

import { createInterface } from 'node:readline';
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import {
  MAX_PARTICLES,
  PARTICLE_STRIDE,
  DNA_RANGES,
  LAW_COUNT,
} from '../../src/constants.js';
import { createDNABuffer, loadDefaults } from '../../src/dna/dnaBuffer.js';

const WORKER_HOST = fileURLToPath(new URL('./workerHost.mjs', import.meta.url));
const BYTES_PER_PARTICLE = PARTICLE_STRIDE * Float32Array.BYTES_PER_ELEMENT;

function b64ToView(b64) {
  const buf = Buffer.from(b64, 'base64');
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}

function viewToB64(view) {
  return Buffer.from(view.buffer, view.byteOffset, view.byteLength).toString('base64');
}

// ── Inner worker client ──

// Reply types are NOT the same as request types (PING → PONG, INIT →
// INIT_COMPLETE, …), so each request waits on its mapped reply type.
const REPLY_TYPES = {
  INIT: 'INIT_COMPLETE',
  CONFIG: 'CONFIG_COMPLETE',
  TOGGLE_LAW: 'LAW_TOGGLED',
  TICK: 'TICK_COMPLETE',
  GET_STATE: 'STATE',
  RESTORE: 'RESTORE_COMPLETE',
  PING: 'PONG',
  BOGUS: 'ERROR',
};

let inner = null;

function ensureInner() {
  if (inner) return inner;
  const worker = new Worker(WORKER_HOST, { type: 'module' });
  const queue = [];
  const waiters = [];
  worker.on('message', (m) => {
    const idx = waiters.findIndex((w) => w.type === m.type);
    if (idx !== -1) waiters.splice(idx, 1)[0].resolve(m);
    else queue.push(m);
  });
  worker.on('error', (e) => {
    for (const w of waiters.splice(0)) w.reject(e);
    process.stdout.write(JSON.stringify({ type: 'FATAL', error: e.message }) + '\n');
  });
  const request = (type, payload = {}, expectedReply) => {
    worker.postMessage({ type, ...payload });
    const replyType = expectedReply || REPLY_TYPES[type] || type;
    const found = queue.findIndex((m) => m.type === replyType);
    if (found !== -1) return Promise.resolve(queue.splice(found, 1)[0]);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`timeout waiting for reply ${replyType} to ${type}`)),
        10000,
      );
      waiters.push({
        type: replyType,
        resolve: (m) => {
          clearTimeout(timer);
          resolve(m);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
    });
  };
  inner = { worker, request };
  return inner;
}

// ── Shared particle buffer (SAB when the platform allows) ──

let particleView = null;

function allocParticleSAB() {
  const byteLength = MAX_PARTICLES * BYTES_PER_PARTICLE;
  let buffer;
  try {
    buffer = new SharedArrayBuffer(byteLength);
  } catch {
    buffer = new ArrayBuffer(byteLength);
  }
  particleView = new Float32Array(buffer);
  return buffer;
}

function currentBufferB64() {
  return particleView ? viewToB64(particleView) : null;
}

// ── Request handling ──

async function handle(msg) {
  switch (msg.type) {
    case 'INIT': {
      const buffer = allocParticleSAB();
      if (msg.world) {
        const world = b64ToView(msg.world);
        particleView.set(world.subarray(0, Math.min(world.length, particleView.length)));
      }
      const dna = createDNABuffer();
      loadDefaults(dna, DNA_RANGES);
      const worker = ensureInner();
      const reply = await worker.request(
        'INIT',
        {
          // A missing/undefined buffer reproduces the worker's ERROR path.
          buffer: msg.world ? buffer : null,
          count: msg.count,
          dnaBuffer: dna.buffer,
          config: msg.config,
          seed: msg.seed,
        },
        msg.world ? undefined : 'ERROR',
      );
      return { type: reply.type, reply, buffer: currentBufferB64() };
    }

    case 'CONFIG': {
      const worker = ensureInner();
      const reply = await worker.request('CONFIG', { config: msg.config });
      return { type: reply.type, reply, buffer: currentBufferB64() };
    }

    case 'TOGGLE_LAW': {
      const worker = ensureInner();
      const badIndex =
        typeof msg.lawIndex !== 'number' || msg.lawIndex < 0 || msg.lawIndex >= LAW_COUNT;
      const reply = await worker.request(
        'TOGGLE_LAW',
        {
          lawIndex: msg.lawIndex,
          forceOn: msg.forceOn,
          forceOff: msg.forceOff,
        },
        badIndex ? 'ERROR' : undefined,
      );
      return { type: reply.type, reply, buffer: currentBufferB64() };
    }

    case 'TICK': {
      const worker = ensureInner();
      const reply = await worker.request('TICK', {}, msg.expectError ? 'ERROR' : undefined);
      return { type: reply.type, reply, buffer: currentBufferB64() };
    }

    case 'GET_STATE': {
      const worker = ensureInner();
      const reply = await worker.request('GET_STATE', {});
      return { type: reply.type, reply, buffer: currentBufferB64() };
    }

    case 'RESTORE': {
      const worker = ensureInner();
      const reply = await worker.request('RESTORE', {
        lawState: msg.lawState,
        particleCount: msg.particleCount,
        tickCount: msg.tickCount,
      });
      return { type: reply.type, reply, buffer: currentBufferB64() };
    }

    case 'PING': {
      const worker = ensureInner();
      const reply = await worker.request('PING', {});
      return { type: reply.type, reply, buffer: currentBufferB64() };
    }

    case 'BOGUS': {
      const worker = ensureInner();
      const reply = await worker.request('BOGUS', {}, 'ERROR');
      return { type: reply.type, reply, buffer: currentBufferB64() };
    }

    case 'GET_BUFFER':
      return { type: 'BUFFER', buffer: currentBufferB64() };

    default:
      return { type: 'ERROR', error: `Runner: unknown message type ${msg.type}` };
  }
}

let inFlight = 0;

const rl = createInterface({ input: process.stdin });
rl.on('line', async (line) => {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    process.stdout.write(JSON.stringify({ id: undefined, type: 'ERROR', error: 'bad json' }) + '\n');
    return;
  }
  inFlight += 1;
  try {
    const out = await handle(msg);
    process.stdout.write(JSON.stringify({ id: msg.id, ...out }) + '\n');
  } catch (e) {
    process.stdout.write(JSON.stringify({ id: msg.id, type: 'ERROR', error: e.message }) + '\n');
  } finally {
    inFlight -= 1;
    maybeExit();
  }
});

// Exit once stdin closes and no reply is still in flight (the inner worker
// thread would otherwise keep the process alive forever).
function maybeExit() {
  if (rl.closed && inFlight === 0) process.exit(0);
}
rl.on('close', maybeExit);
