// ============================================================================
// VEPA4 — Headless Solver Benchmark (Node.js, ESM)
// Generates per-law timing data for the benchmark report SPA.
//
// Usage:
//   node bench/solver.bench.mjs              # full report (scaling + matrix + sweeps + per-law)
//   node bench/solver.bench.mjs --laws       # per-law timing only (default count=5000)
//   node bench/solver.bench.mjs --all        # everything + per-law at each scaling point
//   node bench/solver.bench.mjs --json       # JSON output (no data.js)
//   node bench/solver.bench.mjs --count 10000 --rounds 3
//
// Outputs to public/bench-report/data.js (window.BENCH_DATA = {…})
// ============================================================================

import { performance } from 'node:perf_hooks';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Dynamic imports for the solver (Node.js ESM) ──

// We need to import the solver's benchmark-mode exports.
// The solver uses browser globals (SharedArrayBuffer, performance) — we
// polyfill what's needed.
if (typeof globalThis.SharedArrayBuffer === 'undefined') {
  globalThis.SharedArrayBuffer = ArrayBuffer;
}
if (typeof globalThis.performance === 'undefined') {
  globalThis.performance = { now: () => Date.now() };
}

const { solve, enableBenchMode, getLawTimings, getLastTickUs, drainOffspring, resetOffspringRing } = await import('../src/physics/solver.js');
const { createLawState, set, serialize } = await import('../src/state/lawState.js');
const { PARTICLE_STRIDE, LAW_COUNT, LAW_INDEXES, LAW_CATEGORIES, LAW_HELP_DB, WORLD_SIZE, MAX_PARTICLES, DNA_COUNT, DNA_INDEXES, DNA_RANGES, DEFAULT_DNA_STRIDE } = await import('../src/constants.js');
const { SplitMix32 } = await import('../src/core/prng.js');

// ── CLI args ──

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const num = (name, fallback) => {
  const idx = args.indexOf(name);
  return idx >= 0 && args[idx + 1] ? Number(args[idx + 1]) : fallback;
};

const LAWS_ONLY = flag('--laws');
const ALL = flag('--all');
const JSON_OUT = flag('--json');
const DEFAULT_COUNT = LAWS_ONLY ? 5000 : (ALL ? 5000 : 5000);
const COUNT = num('--count', DEFAULT_COUNT);
const ROUNDS = num('--rounds', 3);
const BUDGET = num('--budget', 500); // ms per measurement

// ── Default 10-law set (matches PRIME_DEFAULT) ──

const DEFAULT_LAWS = [
  'GRAV', 'DRAG', 'ENTR', 'WRAP', 'COLL', 'LIFE', 'GLOW', 'REPRO', 'PHENOTYPE', 'GENOTYPE'
];

// ── Particle buffer factory ──

function createParticleBuffer(count) {
  const buf = new Float32Array(count * PARTICLE_STRIDE);
  const rng = new SplitMix32(42);
  for (let i = 0; i < count; i++) {
    const base = i * PARTICLE_STRIDE;
    // Position: spread across the world
    buf[base + 0] = rng.nextFloat(0, WORLD_SIZE);
    buf[base + 1] = rng.nextFloat(0, WORLD_SIZE);
    buf[base + 2] = rng.nextFloat(0, WORLD_SIZE);
    // Velocity: small random
    buf[base + 3] = rng.nextFloat(-1, 1);
    buf[base + 4] = rng.nextFloat(-1, 1);
    buf[base + 5] = rng.nextFloat(-1, 1);
    // Mass: 0.5–3.0
    buf[base + 6] = rng.nextFloat(0.5, 3.0);
    // Species ID
    buf[base + 7] = Math.floor(rng.nextFloat(0, 5));
    // DNA cache: fill with random normalized values
    for (let d = 0; d < 42; d++) {
      buf[base + 8 + d] = rng.nextFloat(0, 1);
    }
    // Energy
    buf[base + 50] = rng.nextFloat(20, 80);
    // AGE
    buf[base + 51] = 0;
    // DEAD
    buf[base + 52] = 0;
    // COLOR
    buf[base + 53] = rng.nextFloat(0.3, 1);
    buf[base + 54] = rng.nextFloat(0.3, 1);
    buf[base + 55] = rng.nextFloat(0.3, 1);
    // RADIUS
    buf[base + 56] = 1.0 + buf[base + 6] * 0.5;
    // SIGNAL
    buf[base + 57] = rng.nextFloat(0, 0.5);
    // TEMPERATURE
    buf[base + 66] = rng.nextFloat(20, 30);
    // CHARGE
    buf[base + 67] = rng.nextFloat(-1, 1);
  }
  return buf;
}

function createDnaBuffer() {
  const buf = new Uint16Array(MAX_PARTICLES * 0 + DNA_COUNT * DNA_COUNT); // 64×64
  // Fill with defaults
  for (let s = 0; s < DNA_COUNT; s++) {
    for (let d = 0; d < DNA_COUNT; d++) {
      const range = DNA_RANGES[d];
      const def = range ? range[2] : 0.5;
      // Pack to uint16 (0–65535)
      buf[s * DNA_COUNT + d] = Math.round((def / (range ? range[1] : 1)) * 65535) || 32768;
    }
  }
  return buf;
}

// ── Law state builder ──

function buildLawState(lawNames) {
  const state = createLawState();
  for (const name of lawNames) {
    const idx = LAW_INDEXES[name];
    if (idx !== undefined) set(state, idx);
  }
  return state;
}

// ── Warm-up + measurement ──

function warmUp(count, lawState, dnaBuffer, rounds = 5) {
  const buf = createParticleBuffer(count);
  const splitmix = new SplitMix32(123);
  const rng = () => splitmix.next();
  for (let r = 0; r < rounds; r++) {
    solve(buf, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, rng);
    resetOffspringRing();
  }
}

function measure(count, lawState, dnaBuffer, budgetMs = BUDGET) {
  const buf = createParticleBuffer(count);
  const splitmix = new SplitMix32(456);
  const rng = () => splitmix.next();
  enableBenchMode(true);

  // Warm up
  for (let r = 0; r < 3; r++) {
    solve(buf, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, rng);
    resetOffspringRing();
  }

  // Measure
  const timings = [];
  const lawTimings = new Float64Array(LAW_COUNT);
  const tStart = performance.now();
  let ticks = 0;

  while (performance.now() - tStart < budgetMs) {
    solve(buf, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, rng);
    resetOffspringRing();
    ticks++;

    // Accumulate law timings
    const lt = getLawTimings();
    for (let l = 0; l < LAW_COUNT; l++) {
      lawTimings[l] += lt[l];
    }
  }

  enableBenchMode(false);
  const totalMs = performance.now() - tStart;
  const msPerTick = totalMs / ticks;

  return {
    count,
    bufferMB: +(count * PARTICLE_STRIDE * 4 / 1048576).toFixed(1),
    msPerTick: +msPerTick.toFixed(3),
    ticksPerSec: +(1000 / msPerTick).toFixed(2),
    usPerParticle: +(msPerTick * 1000 / count).toFixed(2),
    ticks,
    totalMs: +totalMs.toFixed(1),
    lawTimingsUs: Array.from(lawTimings).map(t => +(t / ticks).toFixed(2)), // avg µs/law/tick
  };
}

function measureTickUs(count, lawState, dnaBuffer) {
  const buf = createParticleBuffer(count);
  const splitmix = new SplitMix32(789);
  const rng = () => splitmix.next();
  enableBenchMode(true);

  // Warm up
  for (let r = 0; r < 3; r++) {
    solve(buf, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, rng);
    resetOffspringRing();
  }

  // Single tick measurement
  solve(buf, count, PARTICLE_STRIDE, lawState, dnaBuffer, WORLD_SIZE, 1.0, rng);
  const tickUs = getLastTickUs();

  const lt = getLawTimings();
  const lawUs = Array.from(lt);

  enableBenchMode(false);
  return { tickUs: +tickUs.toFixed(2), lawUs: lawUs.map(t => +t.toFixed(2)) };
}

// ── Scaling sweep ──

function scalingSweep(counts, lawNames) {
  const lawState = buildLawState(lawNames);
  const dnaBuffer = createDnaBuffer();
  const results = [];
  for (const count of counts) {
    process.stderr.write(`  Scaling N=${count.toLocaleString()}...`);
    const r = measure(count, lawState, dnaBuffer);
    results.push(r);
    process.stderr.write(` ${r.msPerTick.toFixed(1)} ms/tick\n`);
  }
  return results;
}

// ── Per-law sweep ──

function perLawSweep(count, lawNames) {
  const dnaBuffer = createDnaBuffer();
  const results = [];

  // Baseline: all default laws
  const allLawsState = buildLawState(lawNames);
  process.stderr.write(`  All ${lawNames.length} laws...`);
  const allResult = measureTickUs(count, allLawsState, dnaBuffer);
  process.stderr.write(` ${allResult.tickUs} µs\n`);
  results.push({ law: 'ALL_DEFAULT', tickUs: allResult.tickUs, lawUs: allResult.lawUs });

  // One law at a time
  for (const name of lawNames) {
    const singleState = buildLawState([name]);
    process.stderr.write(`  Law ${name}...`);
    const r = measureTickUs(count, singleState, dnaBuffer);
    process.stderr.write(` ${r.tickUs} µs\n`);
    results.push({ law: name, tickUs: r.tickUs, lawUs: r.lawUs });
  }

  // Zero laws (freeze)
  const noState = buildLawState([]);
  process.stderr.write(`  Zero laws (freeze)...`);
  const noResult = measureTickUs(count, noState, dnaBuffer);
  process.stderr.write(` ${noResult.tickUs} µs\n`);
  results.push({ law: 'ZERO_LAWS', tickUs: noResult.tickUs, lawUs: noResult.lawUs });

  return results;
}

// ── All-128-law sweep ──

function allLawsSweep(count) {
  const dnaBuffer = createDnaBuffer();
  // Enable all 128 laws
  const allState = buildLawState([]);
  for (let i = 0; i < LAW_COUNT; i++) {
    set(allState, i);
  }
  process.stderr.write(`  All 128 laws...`);
  const r = measureTickUs(count, allState, dnaBuffer);
  process.stderr.write(` ${r.tickUs} µs\n`);
  return { law: 'ALL_128', tickUs: r.tickUs, lawUs: r.lawUs };
}

// ── Main ──

async function main() {
  console.error(`VEPA4 Solver Benchmark`);
  console.error(`  Particles: ${COUNT.toLocaleString()} | Rounds: ${ROUNDS} | Budget: ${BUDGET}ms`);
  console.error();

  const lawState = buildLawState(DEFAULT_LAWS);
  const dnaBuffer = createDnaBuffer();

  // Scaling
  let scalingData;
  if (!LAWS_ONLY) {
    console.error('─ Scaling sweep ─');
    const counts = [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000].filter(c => c <= MAX_PARTICLES);
    scalingData = scalingSweep(counts, DEFAULT_LAWS);
    console.error();
  }

  // Per-law timing
  console.error('─ Per-law timing ─');
  const perLawData = perLawSweep(COUNT, DEFAULT_LAWS);
  console.error();

  // Per-law at each scaling point (if --all)
  let scalingPerLaw = null;
  if (ALL) {
    console.error('─ Per-law at scaling points ─');
    const counts = [1000, 5000, 10000, 50000].filter(c => c <= MAX_PARTICLES);
    scalingPerLaw = {};
    for (const count of counts) {
      process.stderr.write(`  N=${count.toLocaleString()}:\n`);
      scalingPerLaw[count] = perLawSweep(count, DEFAULT_LAWS);
    }
    console.error();
  }

  // Build category map
  const categories = {};
  for (const [cat, info] of Object.entries(LAW_CATEGORIES)) {
    for (const idx of info.laws) {
      const name = Object.entries(LAW_INDEXES).find(([k, v]) => v === idx)?.[0] || `LAW_${idx}`;
      categories[name] = { category: cat, color: info.color, index: idx };
    }
  }

  // Build the output
  const output = {
    generatedAt: new Date().toISOString(),
    regeneratedBy: 'node bench/solver.bench.mjs',
    solver: {
      particleStride: PARTICLE_STRIDE,
      lawCount: LAW_COUNT,
      worldSize: WORLD_SIZE,
      defaultLawCount: DEFAULT_LAWS.length,
      defaultLaws: DEFAULT_LAWS,
    },
    reportParams: { count: COUNT, rounds: ROUNDS, budget: BUDGET },
    baseline: {
      GRID_DIM: 12,
      CELL_CAP: 100,
      MAX_INTERACTIONS: 500,
      NEIGHBOR_BUF: 2000,
    },
    categories,
    perLaw: perLawData.map(r => ({
      law: r.law,
      tickUs: r.tickUs,
      pctOfTotal: r.law !== 'ZERO_LAWS' && r.law !== 'ALL_DEFAULT' && r.law !== 'ALL_128'
        ? +(r.tickUs / (perLawData.find(d => d.law === 'ALL_DEFAULT')?.tickUs || 1) * 100).toFixed(2)
        : null,
      lawUs: r.lawUs,
    })),
  };

  if (scalingData) output.scaling = scalingData;
  if (scalingPerLaw) output.scalingPerLaw = scalingPerLaw;

  if (JSON_OUT) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    const outPath = resolve(ROOT, 'public/bench-report/data.js');
    const content = `// AUTO-GENERATED by \`node bench/solver.bench.mjs\` — do not edit by hand.\nwindow.BENCH_DATA = ${JSON.stringify(output, null, 2)};\n`;
    writeFileSync(outPath, content, 'utf8');
    console.error(`\n✓ Written to ${outPath}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
