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
 *   node bench/solver.bench.mjs --scale              # scaling curve (N sweep)
 *   node bench/solver.bench.mjs --knobs              # MAX_INTERACTIONS × NEIGHBOR_BUF sweep
 *   node bench/solver.bench.mjs --report             # full dataset → public/bench-report/data.js
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
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

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
const SCALE_MODE = args.includes('--scale');
const KNOBS_MODE = args.includes('--knobs');
const REPORT_MODE = args.includes('--report');
const DEFAULT_ONLY = args.includes('--default-only');
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

// ── Scaling benchmark (rigor mode) ────────────────────────────────────────
// Median-of-rounds over independently seeded worlds, a one-off JIT warmup per
// count, and an adaptive time budget per round (≥2 ticks) — robust to GC/JIT
// outliers while bounded in wall time. μs/particle exposes the scaling shape:
// flat ≈ linear, rising ≈ superlinear (neighbour density growth).

function warmupCount(count, names) {
  const lawState = lawStateFor(names);
  const view = makeWorld(count, SEED);
  const rng = new SplitMix32((SEED ^ 0x1234abcd) | 0);
  const next = () => rng.next();
  const t0 = performance.now();
  let t = 0;
  // JIT is already warm from earlier counts in the same process; cap wall time
  // so a single slow tick can't dominate the harness.
  while (t < 10 && performance.now() - t0 < 200) {
    solve(view, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, next);
    t++;
  }
}

function timeRounds(count, names, rounds, budget) {
  warmupCount(count, names);
  const samples = [];
  let totalTicks = 0;
  for (let r = 0; r < rounds; r++) {
    const lawState = lawStateFor(names);
    const view = makeWorld(count, (SEED + r * 7919) | 0);
    const rng = new SplitMix32(((SEED + r * 7919) ^ 0x9e3779b9) | 0);
    const next = () => rng.next();
    let t = 0;
    const t0 = performance.now();
    while (performance.now() - t0 < budget || t < 2) {
      solve(view, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, next);
      t++;
    }
    samples.push((performance.now() - t0) / t);
    totalTicks += t;
  }
  samples.sort((a, b) => a - b);
  return {
    median: samples[Math.floor(samples.length / 2)],
    min: samples[0],
    max: samples[samples.length - 1],
    ticks: totalTicks,
  };
}

function scaleTable() {
  const rounds = Number(flag('--rounds', '5'));
  const budget = Number(flag('--budget', '1200'));
  const allNames = Object.keys(LAW_INDEXES);
  const rows = [];
  for (const count of PARTICLES) {
    const def = timeRounds(count, DEFAULT_LAWS, rounds, budget);
    const all = DEFAULT_ONLY ? null : timeRounds(count, allNames, rounds, budget);
    rows.push({
      count,
      bufferMB: Number((count * PARTICLE_STRIDE * 4 / 1e6).toFixed(1)),
      defMs: def.median,
      defRange: [def.min, def.max],
      defTicks: def.ticks,
      defUsPerParticle: def.median * 1000 / count,
      allMs: all ? all.median : null,
      allTicks: all ? all.ticks : 0,
      allUsPerParticle: all ? all.median * 1000 / count : null,
    });
  }
  if (JSON_OUT) return rows;
  console.log(`\nVEPA4 solver SCALING — ${rounds} rounds × ~${budget}ms, default laws (${DEFAULT_LAWS.length})${DEFAULT_ONLY ? '' : ` vs ALL ${LAW_COUNT} laws`}`);
  console.log('─'.repeat(108));
  console.log(`${'count'.padStart(8)} ${'bufMB'.padStart(7)} | ${'default ms/tick'.padStart(16)} (${'min'.padStart(8)}–${'max'.padStart(8)}) ${'tick/s'.padStart(8)} ${'μs/particle'.padStart(13)} | ${'all-laws ms/tick'.padStart(16)} ${'μs/particle'.padStart(13)}`);
  for (const r of rows) {
    console.log(
      `${String(r.count).padStart(8)} ${String(r.bufferMB).padStart(7)} | ` +
      `${r.defMs.toFixed(2).padStart(16)} (${r.defRange[0].toFixed(2).padStart(8)}–${r.defRange[1].toFixed(2).padStart(8)}) ` +
      `${(1000 / r.defMs).toFixed(1).padStart(8)} ${r.defUsPerParticle.toFixed(2).padStart(13)} | ` +
      `${r.allMs == null ? '—'.padStart(16) : r.allMs.toFixed(2).padStart(16)} ${r.allUsPerParticle == null ? '—'.padStart(13) : r.allUsPerParticle.toFixed(2).padStart(13)}`
    );
  }
  return rows;
}

// ── Main ────────────────────────────────────────────────────────────────────

// ── Knob sweep (performance settings) ────────────────────────────────
// Sweeps MAX_INTERACTIONS (pair-loop cap) × NEIGHBOR_BUF (neighbour gather
// cap) over a grid of values against a fixed particle count, timing each
// cell with the same median-of-rounds rigour as --scale. GRID_DIM / CELL_CAP
// are also live worldParams knobs but are not swept here (a resolution change
// rebuilds the grid and would confound the comparison).

function knobSweep() {
  const count = PARTICLES[0];
  const rounds = Number(flag('--rounds', '3'));
  const budget = Number(flag('--budget', '500'));
  const interactions = flag('--interactions', '100,500,2000').split(',').map(Number).filter(Boolean);
  const neighbors = flag('--neighbors', '500,2000,8000').split(',').map(Number).filter(Boolean);

  const WP = runtimeConfig.worldParams || (runtimeConfig.worldParams = {});
  const save = { MAX_INTERACTIONS: WP.MAX_INTERACTIONS, NEIGHBOR_BUF: WP.NEIGHBOR_BUF };

  const rows = [];
  for (const nbuf of neighbors) {
    const row = { neighbors: nbuf, cells: [] };
    for (const mi of interactions) {
      WP.NEIGHBOR_BUF = nbuf;
      WP.MAX_INTERACTIONS = mi;
      const t = timeRounds(count, DEFAULT_LAWS, rounds, budget);
      row.cells.push({ interactions: mi, msPerTick: t.median, minMs: t.min, maxMs: t.max });
    }
    rows.push(row);
  }

  Object.assign(WP, save);

  if (JSON_OUT) return { count, rows };
  console.log(`\nVEPA4 knob sweep — ${count} particles, default laws (${DEFAULT_LAWS.length}), ${rounds} rounds × ~${budget}ms`);
  console.log('NEIGHBOR_BUF (rows) × MAX_INTERACTIONS (cols) — ms/tick, median');
  console.log('─'.repeat(96));
  console.log(`${'NEIGHBOR\\INTERACT'.padStart(20)}${interactions.map((v) => String(v).padStart(12)).join('')}`);
  for (const row of rows) {
    const cells = row.cells.map((c) => c.msPerTick.toFixed(2).padStart(12)).join('');
    console.log(`${String(row.neighbors).padStart(20)}${cells}`);
  }
  return rows;
}

// ── Report generation (benchmark SPA dataset) ──────────────────────────
// Produces public/bench-report/data.js — a `window.BENCH_DATA` payload consumed by
// public/bench-report/index.html (served by Vite as /bench-report/). Sweeps each performance knob independently, the
// MAX_INTERACTIONS × NEIGHBOR_BUF interaction matrix, and the N scaling curve,
// all with the same median-of-rounds rigour as --scale/--knobs.

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_PATH = resolve(__dirname, '..', 'public', 'bench-report', 'data.js');

function csvFlag(name, fallback) {
  const raw = args.includes(name) ? flag(name) : fallback;
  return raw.split(',').map(Number).filter((n) => Number.isFinite(n) && n > 0);
}

function sweepKnob(name, values, count, rounds, budget) {
  const WP = runtimeConfig.worldParams;
  const saved = WP[name];
  const out = [];
  for (const v of values) {
    WP[name] = v;
    const t = timeRounds(count, DEFAULT_LAWS, rounds, budget);
    out.push({ value: v, msPerTick: t.median, minMs: t.min, maxMs: t.max, ticks: t.ticks });
  }
  if (saved === undefined) delete WP[name];
  else WP[name] = saved;
  return out;
}

function reportMode() {
  const count = PARTICLES[0];
  const rounds = Number(flag('--rounds', '3'));
  const budget = Number(flag('--budget', '300'));
  const scaleCounts = csvFlag('--scale-counts', '1000,2500,5000,10000,25000');
  const interactions = csvFlag('--interactions', '100,500,2000');
  const neighbors = csvFlag('--neighbors', '500,2000,8000');
  const gridDims = csvFlag('--grid-dims', '8,12,16,24,32,48');
  const cellCaps = csvFlag('--cell-caps', '1,10,50,100,250,500');
  const maxInts = csvFlag('--max-interactions', '8,50,100,250,500,1000,2000');
  const neighborBufs = csvFlag('--neighbor-bufs', '24,100,500,1000,2000,4000,8000');

  const WP = runtimeConfig.worldParams;
  const baseline = { GRID_DIM: WP.GRID_DIM, CELL_CAP: WP.CELL_CAP, MAX_INTERACTIONS: WP.MAX_INTERACTIONS, NEIGHBOR_BUF: WP.NEIGHBOR_BUF };
  const restore = () => Object.assign(WP, baseline);

  // N scaling (default law set, default knobs).
  const scaling = [];
  for (const n of scaleCounts) {
    const t = timeRounds(n, DEFAULT_LAWS, rounds, budget);
    scaling.push({
      count: n,
      bufferMB: Number((n * PARTICLE_STRIDE * 4 / 1e6).toFixed(1)),
      msPerTick: t.median,
      minMs: t.min,
      maxMs: t.max,
      ticksPerSec: 1000 / t.median,
      usPerParticle: t.median * 1000 / n,
    });
  }

  // MAX_INTERACTIONS × NEIGHBOR_BUF interaction matrix at `count`.
  const matrix = [];
  for (const nbuf of neighbors) {
    const row = { neighbors: nbuf, cells: [] };
    for (const mi of interactions) {
      WP.NEIGHBOR_BUF = nbuf;
      WP.MAX_INTERACTIONS = mi;
      const t = timeRounds(count, DEFAULT_LAWS, rounds, budget);
      row.cells.push({ interactions: mi, msPerTick: t.median, minMs: t.min, maxMs: t.max });
    }
    matrix.push(row);
  }
  restore();

  const gridDim = sweepKnob('GRID_DIM', gridDims, count, rounds, budget);
  const cellCap = sweepKnob('CELL_CAP', cellCaps, count, rounds, budget);
  const maxInteractions = sweepKnob('MAX_INTERACTIONS', maxInts, count, rounds, budget);
  const neighborBuf = sweepKnob('NEIGHBOR_BUF', neighborBufs, count, rounds, budget);
  restore();

  const data = {
    generatedAt: new Date().toISOString(),
    regeneratedBy: 'node bench/solver.bench.mjs --report',
    solver: { particleStride: PARTICLE_STRIDE, lawCount: LAW_COUNT, worldSize: WORLD_SIZE, defaultLawCount: DEFAULT_LAWS.length, defaultLaws: DEFAULT_LAWS },
    reportParams: { count, rounds, budget },
    baseline,
    scaling,
    matrix,
    interactions,
    neighbors,
    gridDim,
    cellCap,
    maxInteractions,
    neighborBuf,
  };

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, `// AUTO-GENERATED by \`node bench/solver.bench.mjs --report\` — do not edit by hand.\nwindow.BENCH_DATA = ${JSON.stringify(data, null, 2)};\n`);
  console.log(`Report written → ${REPORT_PATH}`);
  if (JSON_OUT) console.log(JSON.stringify(data, null, 2));
  return data;
}

const result = REPORT_MODE ? reportMode()
  : KNOBS_MODE ? knobSweep()
  : SCALE_MODE ? scaleTable()
  : ALL_MODE ? stressTable()
  : LAWS_MODE ? perLawTable()
  : throughputTable();
if (JSON_OUT) console.log(JSON.stringify(result, null, 2));
