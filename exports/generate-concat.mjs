#!/usr/bin/env node
/**
 * VEPA4 — minimal functional codebase concatenation generator.
 *
 * Bundles the headless-runnable core (constants → state → dna → physics →
 * spawn; no UI/render/worker glue) into ONE self-contained .mjs via a tiny
 * module registry. The output runs in Node: `node exports/vepa-codebase-concat.mjs`.
 *
 * Usage: node exports/generate-concat.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'exports', 'vepa-codebase-concat.mjs');

// Entries that define the headless core. UI (src/ui), render (src/render),
// engines (src/engines), multiplex (src/multiplex) and the browser worker
// (src/worker) are deliberately excluded — they need DOM/canvas/self.
const ENTRIES = [
  'src/core/prng.js', // SplitMix32 — sim-critical randomness
  'src/physics/solver.js',   // whole physics loop
  'src/spawn/distribution.js', // world building
];

const srcDir = path.join(ROOT, 'src');
const toKey = (f) => path.relative(ROOT, f).split(path.sep).join('/');
const fromKey = (k) => path.join(ROOT, ...k.split('/'));

function resolveSpec(spec, importerKey) {
  if (!spec.startsWith('.')) return null; // bare package import — not in core set
  const abs = path.resolve(fromKey(importerKey), '..', spec);
  return toKey(abs);
}

/** Parse `import { a, b as c } from './x.js'` blocks (incl. multi-line). */
function rewriteImports(source, importerKey) {
  const re = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]\s*;/g;
  let out = source;
  let match;
  while ((match = re.exec(source)) !== null) {
    const [stmt, specList, spec] = match;
    const key = resolveSpec(spec, importerKey);
    if (!key) throw new Error(`${importerKey}: bare import "${spec}" is not supported`);
    if (specList.trim().startsWith('*')) throw new Error(`${importerKey}: namespace imports unsupported`);
    const body = specList.replace(/^\{|\}$/g, '').trim();
    if (!body) throw new Error(`${importerKey}: empty/default import "${spec}" unsupported`);
    const pairs = body.split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
      const m = s.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
      if (!m) throw new Error(`${importerKey}: unparseable import "${s}"`);
      return [m[1], m[2] || m[1]];
    });
    const de = pairs.map(([local, imported]) => (local === imported ? local : `${local}: ${imported}`)).join(', ');
    const rewritten = `const { ${de} } = __import('${key}');`;
    out = out.replace(stmt, rewritten);
  }
  return out;
}

/** Rewrite `export X` declarations; collect exported names. */
function rewriteExports(source) {
  const exports = [];
  let out = source;

  // export const/let/var/function/class/async function  → plain declaration
  const declRe = /^export\s+(const|let|var|function|class|async\s+function)\s+(\w+)/gm;
  out = out.replace(declRe, (_m, kind, name) => {
    exports.push({ exported: name, local: name });
    return `${kind} ${name}`;
  });

  // standalone `export { a, b as c };` (defensive — none in the core set)
  const listRe = /^export\s*\{([\s\S]*?)\};\s*$/gm;
  out = out.replace(listRe, (_m, body) => {
    for (const s of body.split(',')) {
      const t = s.trim();
      if (!t) continue;
      const m = t.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
      if (!m) throw new Error(`unparseable export "${t}"`);
      exports.push({ exported: m[2] || m[1], local: m[1] });
    }
    return '';
  });

  if (/^export\s+default|^export\s*\*/m.test(out)) {
    throw new Error('default/star exports unsupported');
  }
  return { out, exports };
}

// ── Build module graph (dependency-first, cycle-guarded) ───────────────────
const seen = new Set();
const order = [];
function visit(key, stack) {
  if (seen.has(key)) return;
  if (stack.includes(key)) throw new Error(`import cycle: ${[...stack, key].join(' → ')}`);
  stack.push(key);
  const abs = fromKey(key);
  const source = fs.readFileSync(abs, 'utf8');
  const re = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]\s*;/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const dep = resolveSpec(m[2], key);
    if (dep) visit(dep, stack);
  }
  stack.pop();
  seen.add(key);
  order.push(key);
}
for (const e of ENTRIES) visit(e, []);

// ── Emit ───────────────────────────────────────────────────────────────────
const parts = [];
parts.push(`// ============================================================================
// VEPA4 — Minimal Functional Concatenated Core (generated ${new Date().toISOString().slice(0, 10)})
//
// Single-file snapshot of the headless physics core. Every module keeps its
// own closure scope via the tiny __define/__import registry, so per-file
// private helpers (clamp, nanGuard, ...) cannot collide. No imports remain —
// the file is self-contained and runs in Node:
//
//     node exports/vepa-codebase-concat.mjs
//
// Modules (${order.length} files, dependency order):
${order.map((k) => `//   - ${k}`).join('\n')}
// Excluded by design (browser-only): src/ui, src/render, src/engines,
// src/multiplex, src/worker/physics.worker.js, src/main.js, src/debug.js.
// ============================================================================

const __modules = new Map();
function __define(key, factory) { __modules.set(key, factory()); }
function __import(key) {
  const mod = __modules.get(key);
  if (!mod) throw new Error('module not loaded: ' + key);
  return mod;
}
`);

for (const key of order) {
  let source = fs.readFileSync(fromKey(key), 'utf8');
  source = rewriteImports(source, key);
  const { out, exports: exps } = rewriteExports(source);
  const ret = exps.length ? `\n  return { ${exps.map((e) => (e.exported === e.local ? e.local : `${e.exported}: ${e.local}`)).join(', ')} };` : '\n  return {};';
  parts.push(`// ══════════════════════════════════════════════════════════════════════
// FILE: ${key}
// ══════════════════════════════════════════════════════════════════════
__define('${key}', () => {${out}${ret}
});
`);
}

// ── Headless smoke driver ───────────────────────────────────────────────────
parts.push(`// ══════════════════════════════════════════════════════════════════════
// HEADLESS SMOKE DRIVER — runs the core end-to-end and prints a summary.
// ══════════════════════════════════════════════════════════════════════
const {
  PARTICLE_STRIDE, STRIDE_INDEXES: S, DNA_RANGES, LAW_INDEXES, WORLD_SIZE,
} = __import('src/constants.js');
const { createLawState, set: lawSet, getActiveCount } = __import('src/state/lawState.js');
const { createDNABuffer, loadDefaults, getDNAFloat } = __import('src/dna/dnaBuffer.js');
const { createWorldParams } = __import('src/state/worldParams.js');
const { runtimeConfig } = __import('src/state/runtimeConfig.js');
const { SplitMix32 } = __import('src/core/prng.js');
const { solve, drainOffspring, resetOffspringRing } = __import('src/physics/solver.js');

const DEFAULT_LAWS = ['GRAV', 'DRAG', 'ENTR', 'WRAP', 'COLL', 'LIFE', 'GLOW', 'REPRO', 'PHENOTYPE', 'GENOTYPE'];

const dnaBuffer = createDNABuffer();
loadDefaults(dnaBuffer, DNA_RANGES);
runtimeConfig.worldParams = createWorldParams();

function makeWorld(count, seed = 20260810) {
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

const COUNT = 500;
const TICKS = 60;
const view = makeWorld(COUNT);
const state = lawStateFor(DEFAULT_LAWS);
const rng = new SplitMix32(0x9e3779b9);
const next = () => rng.next();

for (let t = 0; t < 20; t++) solve(view, COUNT, PARTICLE_STRIDE, state, dnaBuffer, WORLD_SIZE, 1.0, next); // warmup
const t0 = performance.now();
for (let t = 0; t < TICKS; t++) solve(view, COUNT, PARTICLE_STRIDE, state, dnaBuffer, WORLD_SIZE, 1.0, next);
const msPerTick = (performance.now() - t0) / TICKS;

let alive = 0, nan = 0, energy = 0, temp = 0;
for (let i = 0; i < COUNT; i++) {
  const b = i * PARTICLE_STRIDE;
  if (view[b + S.DEAD] === 0) alive++;
  for (let f = 0; f < PARTICLE_STRIDE; f++) if (!Number.isFinite(view[b + f])) nan++;
  energy += view[b + S.ENERGY];
  temp += view[b + S.TEMPERATURE];
}
const offspring = drainOffspring().length;
resetOffspringRing();

console.log('VEPA4 concatenated core — smoke run');
console.log('  particles      :', COUNT);
console.log('  laws active    :', getActiveCount(state), '(' + DEFAULT_LAWS.join(', ') + ')');
console.log('  ticks          :', TICKS, '| warmup 20');
console.log('  ms/tick        :', msPerTick.toFixed(3));
console.log('  alive          :', alive, '/', COUNT);
console.log('  mean energy    :', (energy / COUNT).toFixed(2));
console.log('  mean temp      :', (temp / COUNT).toFixed(3));
console.log('  NaN cells      :', nan);
console.log('  offspring      :', offspring);
if (nan > 0 || alive === 0) { console.error('SMOKE FAIL'); process.exitCode = 1; }
else console.log('SMOKE OK');
`);

fs.writeFileSync(OUT, parts.join('\n'));
console.log('wrote', OUT, `(${parts.join('\\n').length.toLocaleString()} chars, ${order.length} modules)`);
