#!/usr/bin/env node
/**
 * VEPA4 — Physics solver benchmark
 *
 * Headless throughput harness: builds a synthetic particle world and times
 * the solver in Node. Used to measure optimization impact and spot hot laws.
 *
 * Usage:
 *   node bench/solver.bench.mjs                      # default table
 *   node bench/solver.bench.mjs --laws               # per-law overhead breakdown
 *   node bench/solver.bench.mjs --all                # stress: every law on
 *   node bench/solver.bench.mjs --json               # machine-readable output
 *   node bench/solver.bench.mjs --particles 2500 --ticks 120 --warmup 40
 */

import {
  PARTICLE_STRIDE,
  STRIDE_INDEXES,
  LAW_INDEXES,
  DNA_RANGES,
  LAW_COUNT,
  WORLD_SIZE,
} from '../src/constants.js';
import { createLawState, set as lawSet } from '../src/state/lawState.js';
import { createDNABuffer, loadDefaults, getDNAFloat } from '../src/dna/dnaBuffer.js';
import { createWorldParams } from '../src/state/worldParams.js';
import { runtimeConfig } from '../src/state/runtimeConfig.js';
import { SplitMix32 } from '../src/core/prng.js';
import { solve } from '../src/physics/solver.js';

// ── Config ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i === -1 ? def : (args[i + 1] ?? def);
};

const PARTICLES = flag('--particles', '500,1000,2500').split(',').map(Number).filter(Boolean);
const TICKS = Number(flag('--ticks', '60'));
const WARMUP = Number(flag('--warmup', '20'));
const LAWS_MODE = args.includes('--laws');
const ALL_MODE = args.includes('--all');
const JSON_OUT = args.includes('--json');
const SEED = 20260807;

// Representative default law set (PRIME_DEFAULT preset).
const DEFAULT_LAWS = ['GRAV', 'DRAG', 'ENTR', 'WRAP', 'COLL', 'LIFE', 'GLOW', 'REPRO', 'PHENOTYPE', 'GENOTYPE'];

// Laws worth isolating in --laws mode (heavy or frequently toggled).
const SPOTLIGHT_LAWS = [
  'GRAV', 'COLL', 'ACCR', 'BOND', 'LIFE', 'REPRO', 'SIGNAL_EXCHANGE',
  'CHARGE_LAW', 'MAGNETISM', 'CURRENT', 'HEAT', 'TELEPATHY', 'SINGULARITY',
  'ENTANGLEMENT', 'HISTORY', 'STIGMERGY', 'PREDICT', 'POLYMER', 'TIDE', 'PLANETARY',
];

// ── World setup ─────────────────────────────────────────────────────────────

const dnaBuffer = createDNABuffer();
loadDefaults(dnaBuffer, DNA_RANGES);
runtimeConfig.worldParams = createWorldParams();
const S = STRIDE_INDEXES;

function makeWorld(count, seed = 1234) {
  const view = new Float32Array(count * PARTICLE_STRIDE);
  const rng = new SplitMix32(seed);
  for (let i = 0; i < count; i++) {
    const b = i * PARTICLE_STRIDE;
    view[b + S.POS_X] = rng.nextFloat(0, WORLD_SIZE);
    view[b + S.POS_Y] = rng.nextFloat(0, WORLD_SIZE);
    view[b + S.POS_Z] = rng.nextFloat(0, WORLD_SIZE);
    view[b + S.VEL_X] = rng.nextFloat(-1, 1);
    view[b + S.VEL_Y] = rng.nextFloat(-1, 1);
    view[b + S.VEL_Z] = rng.nextFloat(-1, 1);
    view[b + S.MASS] = 1.0;
    view[b + S.SPECIES_ID] = i % 5;
    view[b + S.ENERGY] = 50;
    view[b + S.AGE] = 0;
    view[b + S.DEAD] = 0;
    view[b + S.RADIUS] = 0.6;
    view[b + S.ALPHA] = 0.8;
    view[b + S.TEMPERATURE] = 0.5;
    view[b + S.CHARGE] = 0;
    for (let d = 0; d < 42; d++) {
      const r = DNA_RANGES[d] || { min: -1, max: 1 };
      view[b + S.DNA_CACHE_START + d] = getDNAFloat(dnaBuffer, view[b + S.SPECIES_ID], d, r.min, r.max);
    }
  }
  return view;
}

function lawStateFor(names) {
  const state = createLawState();
  for (const name of names) {
    if (LAW_INDEXES[name] !== undefined) lawSet(state, LAW_INDEXES[name]);
  }
  return state;
}

// ── Benchmark runners ───────────────────────────────────────────────────────

/** Run `ticks` solve() calls over an existing view; returns total ms. */
function timeTicks(view, count, names, ticks, next) {
  const lawState = lawStateFor(names);
  const t0 = performance.now();
  for (let t = 0; t < ticks; t++) solve(view, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, next);
  return performance.now() - t0;
}

/**
 * Time a law set against a frozen world: restore the snapshot before every
 * tick so dynamics never drift between law sets (the ~1MB/tick copy overhead
 * is shared by every row). Runs `rounds` independent batches (fresh world
 * copy + fresh PRNG + 20 JIT/GC warmup ticks each) and returns the MEDIAN
 * ms/tick, which resists JIT/GC outliers.
 */
function timeFrozenTicks(frozen, count, names, ticks, rounds = 5) {
  const samples = [];
  for (let r = 0; r < rounds; r++) {
    const lawState = lawStateFor(names);
    const view = Float32Array.from(frozen);
    const rng = new SplitMix32((SEED + r * 7919) | 0);
    const next = () => rng.next();
    for (let t = 0; t < 20; t++) {
      view.set(frozen);
      solve(view, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, next);
    }
    const t0 = performance.now();
    for (let t = 0; t < ticks; t++) {
      view.set(frozen);
      solve(view, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, next);
    }
    samples.push((performance.now() - t0) / ticks);
  }
  samples.sort((a, b) => a - b);
  return samples[Math.floor(samples.length / 2)];
}

function run(count, names, ticks, warmup, seed) {
  const lawState = lawStateFor(names);
  const view = makeWorld(count, seed);
  const rng = new SplitMix32((seed ^ 0x9e3779b9) | 0);
  const next = () => rng.next();

  for (let t = 0; t < warmup; t++) solve(view, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, next);

  const totalMs = timeTicks(view, count, names, ticks, next);

  let alive = 0;
  let nan = 0;
  for (let i = 0; i < count; i++) {
    const b = i * PARTICLE_STRIDE;
    if (view[b + S.DEAD] < 0.5) alive++;
    const px = view[b + S.POS_X];
    if (px !== px) nan++;
  }

  return {
    count,
    laws: names.length,
    msPerTick: totalMs / ticks,
    ticksPerSec: ticks / (totalMs / 1000),
    alive,
    nan,
  };
}

function formatRow(r) {
  return `${String(r.count).padStart(8)}  ${r.msPerTick.toFixed(3).padStart(8)} ms/tick  ${r.ticksPerSec.toFixed(0).padStart(7)} ticks/s  alive ${String(r.alive).padStart(5)}  nan ${r.nan}`;
}

// ── Modes ───────────────────────────────────────────────────────────────────

function throughputTable() {
  const rows = PARTICLES.map((count) => run(count, DEFAULT_LAWS, TICKS, WARMUP));
  if (JSON_OUT) return rows;
  console.log(`\nVEPA4 solver benchmark — ${TICKS} ticks (${WARMUP} warmup), laws: ${DEFAULT_LAWS.join(', ')}`);
  console.log('─'.repeat(64));
  for (const r of rows) console.log(formatRow(r));
  return rows;
}

function stressTable() {
  const allNames = Object.keys(LAW_INDEXES);
  const rows = PARTICLES.map((count) => run(count, allNames, TICKS, WARMUP));
  if (JSON_OUT) return rows;
  console.log(`\nVEPA4 solver stress — ALL ${LAW_COUNT} laws on, ${TICKS} ticks (${WARMUP} warmup)`);
  console.log('─'.repeat(64));
  for (const r of rows) console.log(formatRow(r));
  return rows;
}

function perLawTable() {
  const count = PARTICLES[0];
  // Freeze one world state and restore it before EVERY tick, so each law set
  // is timed against identical input data — the Δ column isolates the law's
  // own per-tick cost with no world-evolution confound. A fresh PRNG per row
  // keeps the random stream identical across rows.
  const frozen = makeWorld(count, SEED);
  const baseMs = timeFrozenTicks(frozen, count, DEFAULT_LAWS, TICKS);
  const out = [{ law: '(baseline)', msPerTick: baseMs, deltaMs: 0, count, laws: DEFAULT_LAWS.length }];
  for (const name of SPOTLIGHT_LAWS) {
    const set = [...DEFAULT_LAWS];
    if (!set.includes(name)) set.push(name);
    const ms = timeFrozenTicks(frozen, count, set, TICKS);
    out.push({ law: name, msPerTick: ms, deltaMs: ms - baseMs, count, laws: set.length });
  }
  if (JSON_OUT) return out;
  console.log(`\nVEPA4 per-law overhead (${count} particles) — default set + law vs baseline`);
  console.log('─'.repeat(64));
  console.log(`${'law'.padEnd(18)} ${'ms/tick'.padStart(9)} ${'Δ ms'.padStart(8)}`);
  for (const r of out) console.log(`${r.law.padEnd(18)} ${r.msPerTick.toFixed(3).padStart(9)} ${r.deltaMs.toFixed(3).padStart(8)}`);
  return out;
}

// ── Main ────────────────────────────────────────────────────────────────────

const result = ALL_MODE ? stressTable() : LAWS_MODE ? perLawTable() : throughputTable();
if (JSON_OUT) console.log(JSON.stringify(result, null, 2));
