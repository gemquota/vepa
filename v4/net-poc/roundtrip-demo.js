// ============================================================================
// VEPA Multiplayer — codec round-trip demo
// Builds a fake stride-100 particle world, encodes a FULL snapshot, decodes it
// on the "guest", applies it to a fresh buffer, and verifies parity + error
// bounds. Also measures encode/decode cost and per-rate bandwidth.
//
// Run:  node v4/net-poc/roundtrip-demo.js
// ============================================================================

import {
  encodeSnapshot, decodeSnapshot, applySnapshot, SNAP_FULL,
  collectAliveIds, quantizePos, dequantizePos, quantizeVel, dequantizeVel,
  quantizeU8, dequantizeU8, IDX, MAX_RADIUS, MAX_ENERGY,
} from './codec.js';

const STRIDE = 100;
const WORLD_SIZE = 2000;
const PARTICLE_COUNT = 1250; // default v4 population (5 species × 250)
const F32_TOL = 1e-3; // f32 storage rounding at world magnitude

// ── Deterministic fake world (no Math.random so the demo is reproducible) ──
let seed = 0xC0FFEE;
function rng() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }

const hostView = new Float32Array(PARTICLE_COUNT * STRIDE);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = i * STRIDE;
  hostView[p + IDX.POS_X] = rng() * WORLD_SIZE - WORLD_SIZE / 2;
  hostView[p + IDX.POS_Y] = rng() * WORLD_SIZE - WORLD_SIZE / 2;
  hostView[p + IDX.VEL_X] = (rng() - 0.5) * 6;
  hostView[p + IDX.VEL_Y] = (rng() - 0.5) * 6;
  hostView[p + IDX.SPECIES_ID] = Math.floor(rng() * 5);
  hostView[p + IDX.COLOR_R] = rng();
  hostView[p + IDX.COLOR_G] = rng();
  hostView[p + IDX.COLOR_B] = rng();
  hostView[p + IDX.RADIUS] = 1 + rng() * 7;
  hostView[p + IDX.ENERGY] = rng() * 200;
  hostView[p + IDX.DEAD] = rng() < 0.016 ? 1 : 0; // ~2% dead (spent/soul slots)
}

const aliveIds = collectAliveIds(hostView, PARTICLE_COUNT, STRIDE);
console.log(`world: ${PARTICLE_COUNT} slots, ${aliveIds.length} alive`);

// ── Host side: encode ──
const law = { low: 0x0000000f, high: 0x00000100, ext: 0x00000040, quad: 0x80000000 };
const params = [
  { key: 0, value: WORLD_SIZE },
  { key: 11, value: 0.9 },
  { key: 13, value: 1 },
];
const dna = new Uint16Array(5 * 64);
for (let i = 0; i < dna.length; i++) dna[i] = Math.floor(rng() * 65536);

const t0 = performance.now();
const buf = encodeSnapshot({
  type: SNAP_FULL, tick: 4821, seq: 77, hostTimeMs: 1234567.89,
  worldSize: WORLD_SIZE, simVersion: 3, law, params, dna,
  particles: hostView, stride: STRIDE, particleCount: PARTICLE_COUNT, aliveIds,
});
const t1 = performance.now();

// ── Guest side: decode + apply ──
const snap = decodeSnapshot(buf);
const t2 = performance.now();
const guestView = new Float32Array(PARTICLE_COUNT * STRIDE);
guestView.fill(0);
for (let i = 0; i < PARTICLE_COUNT; i++) guestView[i * STRIDE + IDX.DEAD] = 1;
applySnapshot(guestView, snap, STRIDE);
const t3 = performance.now();

console.log(`snapshot bytes: ${buf.byteLength} (${(buf.byteLength / 1024).toFixed(1)} KB)`);
console.log(`encode: ${((t1 - t0) * 1000).toFixed(0)} µs | decode: ${((t2 - t1) * 1000).toFixed(0)} µs | apply: ${((t3 - t2) * 1000).toFixed(0)} µs`);

// ── Parity check ──
const posStep = (WORLD_SIZE / 65535) / 2;        // half a quant step
const velStep = (MAX_RADIUS > 0 ? 1 : 1) * 50 / 32767 / 2;
const u8Step = (v, scale) => (scale / 255) / 2;  // half a quant step for u8
let maxPosErr = 0, maxVelErr = 0, maxRadErr = 0, maxEnergyErr = 0, bad = 0, badSpecies = 0, badColor = 0, badDead = 0, badGuest = 0;

for (const rec of snap.records) {
  const p = rec.id * STRIDE;
  maxPosErr = Math.max(maxPosErr, Math.abs(hostView[p + IDX.POS_X] - rec.xf), Math.abs(hostView[p + IDX.POS_Y] - rec.yf));
  maxVelErr = Math.max(maxVelErr, Math.abs(hostView[p + IDX.VEL_X] - rec.vxf), Math.abs(hostView[p + IDX.VEL_Y] - rec.vyf));
  maxRadErr = Math.max(maxRadErr, Math.abs(hostView[p + IDX.RADIUS] - rec.radiusF));
  maxEnergyErr = Math.max(maxEnergyErr, Math.abs(hostView[p + IDX.ENERGY] - rec.energyF));

  if (rec.species !== hostView[p + IDX.SPECIES_ID]) { bad++; badSpecies++; }
  if (Math.abs(rec.r / 255 - hostView[p + IDX.COLOR_R]) > 1 / 255 + 1e-9) { bad++; badColor++; }
  if ((hostView[p + IDX.DEAD] >= 0.5) !== rec.dead) { bad++; badDead++; }
  if (Math.abs(guestView[p + IDX.POS_X] - rec.xf) > F32_TOL || Math.abs(guestView[p + IDX.POS_Y] - rec.yf) > F32_TOL) { bad++; badGuest++; }
}

const pStep = posStep, vStep = velStep, rStep = u8Step(0, MAX_RADIUS), eStep = u8Step(0, MAX_ENERGY);
const ok = maxPosErr <= pStep + F32_TOL && maxVelErr <= vStep + F32_TOL && maxRadErr <= rStep + F32_TOL &&
           maxEnergyErr <= eStep + F32_TOL && bad === 0;

console.log(`parity: ${snap.records.length}/${aliveIds.length} records, ${bad} mismatches (species ${badSpecies}, color ${badColor}, dead ${badDead}, guest ${badGuest})`);
console.log(`max pos err: ${maxPosErr.toFixed(4)} (≤ ${(pStep + F32_TOL).toFixed(4)})`);
console.log(`max vel err: ${maxVelErr.toFixed(4)} (≤ ${(vStep + F32_TOL).toFixed(4)})`);
console.log(`max radius err: ${maxRadErr.toFixed(4)} (≤ ${rStep.toFixed(4)})`);
console.log(`max energy err: ${maxEnergyErr.toFixed(4)} (≤ ${eStep.toFixed(4)})`);
console.log(ok ? '✅ ROUND TRIP OK' : '❌ ROUND TRIP FAILED');

// ── Bandwidth at realistic rates ──
for (const rate of [20, 30]) {
  const perSec = buf.byteLength * rate;
  console.log(`@ ${rate} Hz: ${(perSec / 1024).toFixed(0)} KB/s per guest → ${(perSec * 4 / 1024).toFixed(0)} KB/s for 4 guests`);
}
process.exit(ok ? 0 : 1);
