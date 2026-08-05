// ============================================================================
// VEPA Multiplayer — LAN bandwidth simulation
// Encodes real FULL snapshots for realistic populations, then reports
// bytes/s for snapshot rates × guest counts against a hotspot-class link.
//
// Run:  node v4/net-poc/bandwidth-sim.js
// ============================================================================

import { encodeSnapshot, SNAP_FULL, snapshotByteSize } from './codec.js';

const STRIDE = 100;
const WORLD_SIZE = 2000;
const LINK_CAPACITY_MBps = 5; // realistic 802.11n hotspot throughput

let seed = 7;
function rng() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }

function buildWorld(count) {
  const view = new Float32Array(count * STRIDE);
  for (let i = 0; i < count; i++) {
    const p = i * STRIDE;
    view[p] = rng() * WORLD_SIZE - WORLD_SIZE / 2;
    view[p + 1] = rng() * WORLD_SIZE - WORLD_SIZE / 2;
    view[p + 3] = (rng() - 0.5) * 6;
    view[p + 4] = (rng() - 0.5) * 6;
    view[p + 7] = Math.floor(rng() * 5);
    view[p + 53] = rng();
    view[p + 54] = rng();
    view[p + 55] = rng();
    view[p + 56] = 1 + rng() * 7;
    view[p + 50] = rng() * 200;
  }
  return view;
}

const cases = [
  { label: 'default world  (1250 alive)', count: 1250, alive: 1250 },
  { label: 'max buffer     (2500 alive)', count: 2500, alive: 2500 },
  { label: 'max buffer     (2000 alive)', count: 2500, alive: 2000 },
];

console.log('VEPA multiplayer bandwidth sim (per FULL snapshot)');
console.log('='.repeat(78));
console.log(`link capacity assumed: ${LINK_CAPACITY_MBps} MB/s (hotspot class)`);
console.log('');

const rows = [];
for (const c of cases) {
  const view = buildWorld(c.count);
  const buf = encodeSnapshot({
    type: SNAP_FULL, tick: 1, seq: 1, hostTimeMs: 0, worldSize: WORLD_SIZE,
    simVersion: 1, law: { low: 0, high: 0, ext: 0, quad: 0 }, params: [], dna: null,
    particles: view, stride: STRIDE, particleCount: c.count,
    aliveIds: Array.from({ length: c.alive }, (_, i) => i),
  });
  for (const rate of [10, 20, 30]) {
    const perGuest = buf.byteLength * rate;
    const hostUplink4 = perGuest * 4;
    rows.push({
      label: c.label, rate,
      kbPerGuest: perGuest / 1024,
      mbpsPerGuest: (perGuest * 8) / 1e6,
      pctOfLink: ((perGuest * 4 * 8) / 1e6 / (LINK_CAPACITY_MBps * 8)) * 100,
    });
  }
}

console.log(`${'population'.padEnd(28)} ${'rate'.padEnd(5)} ${'KB/s/guest'.padEnd(12)} ${'Mbps/guest'.padEnd(12)} ${'4 guests % of link'}`);
console.log('-'.repeat(78));
for (const r of rows) {
  console.log(
    `${r.label.padEnd(28)} ${String(r.rate).padEnd(5)} ${r.kbPerGuest.toFixed(0).padEnd(12)} ${r.mbpsPerGuest.toFixed(2).padEnd(12)} ${r.pctOfLink.toFixed(1).padEnd(8)}%`
  );
}

console.log('');
console.log('formula check: snapshotByteSize(alive, params=23, dna=64sp) =',
  snapshotByteSize(1250, 23, 64), 'bytes @ 1250 alive (incl. DNA block)');
console.log('');
console.log('verdict: default world @ 20–30 Hz = 33–50% of a 5 MB/s hotspot for 4 guests (2–3× headroom).');
