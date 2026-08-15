// ============================================================================
// VEPA v4 — Headless Worker Host
//
// Node's ESM worker_threads do not provide the browser-style Web Worker
// globals (self / postMessage / onmessage) that src/worker/physics.worker.js
// is written against. This host shim maps them onto worker_threads'
// parentPort, then loads the real worker module.
//
// Messages arriving before the worker module finishes importing are buffered
// and replayed once it is ready (the worker file assigns self.onmessage only
// during its import).
//
// Used only by tests/unit/workerProtocol.test.js.
// ============================================================================

import { parentPort } from 'node:worker_threads';

globalThis.self = globalThis;
globalThis.postMessage = (msg) => parentPort.postMessage(msg);
globalThis.onmessage = null;

let ready = false;
const buffered = [];
parentPort.on('message', (data) => {
  if (!ready) {
    buffered.push(data);
    return;
  }
  if (typeof globalThis.onmessage === 'function') {
    globalThis.onmessage({ data });
  }
});

await import(new URL('../../src/worker/physics.worker.js', import.meta.url));

ready = true;
for (const data of buffered) {
  if (typeof globalThis.onmessage === 'function') {
    globalThis.onmessage({ data });
  }
}
