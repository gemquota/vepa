#!/usr/bin/env node
/**
 * VEPA4 — comprehensive documentation concatenation generator.
 * Merges every markdown doc in the repo (root, docs/, audit-suite/, law SSOT)
 * plus VERSION + package.json metadata into ONE file with a TOC.
 *
 * Usage: node exports/generate-docs-concat.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'exports', 'vepa-docs-concat.md');

const EXCLUDE_DIRS = new Set(['node_modules', '.dist', '.git', 'exports', '.rsirrp', 'bench', 'tests', 'src']);
const lines = (f) => fs.readFileSync(f, 'utf8').split('\n').length;

/** Walk for markdown files, sorted alphabetically, skipping excludes. */
function walkMd(dir, base = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) out.push(...walkMd(full, path.join(base, entry.name)));
    } else if (entry.name.endsWith('.md')) {
      out.push(path.join(base, entry.name));
    }
  }
  return out;
}

const rootDocs = ['README.md', 'AGENTS.md', 'GEMINI.md', 'SPEC.md', 'PLAN.md', 'GUIDE.md', 'CHANGELOG.md'];
// Docs outside the walk (src is skipped by walkMd) are loaded explicitly.
const specials = ['src/physics/lawgroups/SPEC.md'];
const all = new Map(); // relPath -> absPath
for (const f of walkMd(ROOT)) all.set(f, path.join(ROOT, f));
for (const f of specials) all.set(f, path.join(ROOT, f));

// Explicit ordering: root → docs/ → lawgroup SPEC → audit-suite → historical.
const ordered = [
  ...rootDocs.filter((f) => all.has(f)),
  ...[...all.keys()].filter((f) => f.startsWith('docs/')).sort(),
  'src/physics/lawgroups/SPEC.md',
  'audit-suite/README.md',
  'audit-suite/fidelity-audit-v4.6.29.md',
  ...[...all.keys()].filter((f) => f.startsWith('audit-suite/law-revamp/')).sort(),
  ...[...all.keys()].filter((f) => f.startsWith('audit-suite/historical/')).sort(),
].filter((f, i, a) => a.indexOf(f) === i && all.has(f));

const totalLines = ordered.reduce((n, f) => n + lines(all.get(f)), 0);

const parts = [];
parts.push(`# VEPA4 — Comprehensive Documentation Concatenation

**Generated:** ${new Date().toISOString().slice(0, 10)} · **Docs:** ${ordered.length} files · **Total lines:** ${totalLines.toLocaleString()}
**Tree:** dirty 7.0.0 draft at HEAD \`7ddb832\` (v4.6.26) — working branch \`feature/multiplayer-investigation\`.

## Table of Contents

| # | File | Lines |
|---|------|-------|
${ordered.map((f, i) => `| ${i + 1} | \`${f}\` | ${lines(all.get(f))} |`).join('\n')}

---
`);

for (const f of ordered) {
  const content = fs.readFileSync(all.get(f), 'utf8');
  parts.push(`<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC ${ordered.indexOf(f) + 1}/${ordered.length}: ${f} (${lines(all.get(f))} lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
${content.replace(/\s+$/, '\n')}

---
`);
}

// Metadata: VERSION + package.json (not markdown — fenced for readability).
parts.push(`<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- META: VERSION -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
\`\`\`text
${fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim()}
\`\`\`

---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- META: package.json -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
\`\`\`json
${fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8').trim()}
\`\`\`
`);

fs.writeFileSync(OUT, parts.join('\n'));
console.log('wrote', OUT, `(${parts.join('\\n').length.toLocaleString()} chars, ${ordered.length} docs + metadata)`);
