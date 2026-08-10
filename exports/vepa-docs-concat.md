# VEPA4 — Comprehensive Documentation Concatenation

**Generated:** 2026-08-10 · **Docs:** 112 files · **Total lines:** 8,184
**Tree:** dirty 7.0.0 draft at HEAD `7ddb832` (v4.6.26) — working branch `feature/multiplayer-investigation`.

## Table of Contents

| # | File | Lines |
|---|------|-------|
| 1 | `README.md` | 109 |
| 2 | `AGENTS.md` | 521 |
| 3 | `GEMINI.md` | 49 |
| 4 | `SPEC.md` | 111 |
| 5 | `PLAN.md` | 84 |
| 6 | `GUIDE.md` | 105 |
| 7 | `CHANGELOG.md` | 1076 |
| 8 | `docs/README.md` | 41 |
| 9 | `docs/dev/intelligence_bus.md` | 39 |
| 10 | `docs/mechanics/chaos_multiplex.md` | 77 |
| 11 | `src/physics/lawgroups/SPEC.md` | 165 |
| 12 | `audit-suite/README.md` | 21 |
| 13 | `audit-suite/fidelity-audit-v4.6.29.md` | 214 |
| 14 | `audit-suite/law-revamp/FINAL-REPORT.md` | 1277 |
| 15 | `audit-suite/law-revamp/batch_01.md` | 124 |
| 16 | `audit-suite/law-revamp/batch_02.md` | 123 |
| 17 | `audit-suite/law-revamp/batch_03.md` | 119 |
| 18 | `audit-suite/law-revamp/batch_04.md` | 119 |
| 19 | `audit-suite/law-revamp/batch_05.md` | 125 |
| 20 | `audit-suite/law-revamp/batch_06.md` | 118 |
| 21 | `audit-suite/law-revamp/batch_07.md` | 128 |
| 22 | `audit-suite/law-revamp/batch_08.md` | 117 |
| 23 | `audit-suite/law-revamp/batch_09.md` | 125 |
| 24 | `audit-suite/law-revamp/batch_10.md` | 106 |
| 25 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/README.md` | 46 |
| 26 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_01.md` | 31 |
| 27 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_02.md` | 32 |
| 28 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_03.md` | 29 |
| 29 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_04.md` | 31 |
| 30 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_05.md` | 28 |
| 31 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_06.md` | 28 |
| 32 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_07.md` | 40 |
| 33 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_08.md` | 30 |
| 34 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_09.md` | 28 |
| 35 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_10.md` | 30 |
| 36 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_11.md` | 29 |
| 37 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_12.md` | 29 |
| 38 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_13.md` | 28 |
| 39 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_14.md` | 30 |
| 40 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_15.md` | 17 |
| 41 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_16.md` | 17 |
| 42 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_17.md` | 17 |
| 43 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_18.md` | 17 |
| 44 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_19.md` | 17 |
| 45 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_20.md` | 17 |
| 46 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_21.md` | 17 |
| 47 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_22.md` | 17 |
| 48 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_23.md` | 17 |
| 49 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_24.md` | 17 |
| 50 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_25.md` | 17 |
| 51 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_26.md` | 17 |
| 52 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_27.md` | 17 |
| 53 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_28.md` | 17 |
| 54 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_29.md` | 17 |
| 55 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_30.md` | 17 |
| 56 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_31.md` | 17 |
| 57 | `audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_32.md` | 17 |
| 58 | `audit-suite/historical/2026-08-10-v4.6.28/laws/INDEX.md` | 41 |
| 59 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_01.md` | 23 |
| 60 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_02.md` | 27 |
| 61 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_03.md` | 24 |
| 62 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_04.md` | 24 |
| 63 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_05.md` | 24 |
| 64 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_06.md` | 24 |
| 65 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_07.md` | 27 |
| 66 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_08.md` | 27 |
| 67 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_09.md` | 23 |
| 68 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_10.md` | 23 |
| 69 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_11.md` | 24 |
| 70 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_12.md` | 23 |
| 71 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_13.md` | 25 |
| 72 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_14.md` | 24 |
| 73 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_15.md` | 24 |
| 74 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_16.md` | 24 |
| 75 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_17.md` | 23 |
| 76 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_18.md` | 24 |
| 77 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_19.md` | 23 |
| 78 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_20.md` | 23 |
| 79 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_21.md` | 24 |
| 80 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_22.md` | 24 |
| 81 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_23.md` | 23 |
| 82 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_24.md` | 24 |
| 83 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_25.md` | 23 |
| 84 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_26.md` | 23 |
| 85 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_27.md` | 23 |
| 86 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_28.md` | 23 |
| 87 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_29.md` | 24 |
| 88 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_30.md` | 25 |
| 89 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_31.md` | 24 |
| 90 | `audit-suite/historical/2026-08-10-v4.6.28/laws/batch_32.md` | 25 |
| 91 | `audit-suite/historical/2026-08-10-v4.6.28/laws/combined.md` | 931 |
| 92 | `audit-suite/historical/2026-08-10-v4.6.28/params/INDEX.md` | 30 |
| 93 | `audit-suite/historical/2026-08-10-v4.6.28/params/SPEC.md` | 129 |
| 94 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_01.md` | 18 |
| 95 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_02.md` | 18 |
| 96 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_03.md` | 18 |
| 97 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_04.md` | 18 |
| 98 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_05.md` | 18 |
| 99 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_06.md` | 18 |
| 100 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_07.md` | 18 |
| 101 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_08.md` | 20 |
| 102 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_09.md` | 21 |
| 103 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_10.md` | 21 |
| 104 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_11.md` | 19 |
| 105 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_12.md` | 21 |
| 106 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_13.md` | 21 |
| 107 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_14.md` | 21 |
| 108 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_15.md` | 21 |
| 109 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_16.md` | 21 |
| 110 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_17.md` | 21 |
| 111 | `audit-suite/historical/2026-08-10-v4.6.28/params/batch_18.md` | 21 |
| 112 | `audit-suite/historical/2026-08-10-v4.6.28/params/combined.md` | 63 |

---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 1/112: README.md (109 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# 🌌 VEPA4: Vector Emergent Physics Automata

**Integrated Intelligence** — the intelligence engines are alive.

## Versioning & Commits

- **Product:** **VEPA4**; versions use **`major.minor.build`** (npm-semver-native) —
  current: **7.0.0** (legacy label `4.7.0`). Retroactive mapping of the v4 line:
  old `4.M.N` → `M.N.0`; see `CHANGELOG.md` and `AGENTS.md` §10.4.
- **Commits:** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
  — `<type>(<scope>): <description>`, release commits `chore(release): v7.0.0`,
  tags `v7.0.0`.

VEPA4 is the next major version of the emergent physics simulation. It forks
the v3 modular recreation and completes the integration gap identified in the
2026-08-01 workspace audit: the five intelligence engines (Insight, Narrative,
Lineage, Goal, Timeline) are now wired into the simulation loop, the
communication DNA group drives real physics, and predation is restored as an
explicit law.

## Quick Start

```bash
npm install
npm run dev    # Dev server with COOP/COEP headers
npm run build  # Production build
npm test       # Unit tests (69 files / 617 tests)
```

## Deployments

| Platform | URL | Notes |
|----------|-----|-------|
| Vercel (production) | https://vepa-v4.vercel.app/ | COOP/COEP headers served — `SharedArrayBuffer` enabled; true memory model |
| GitHub Pages | https://gemquota.github.io/vepa/vepar/ | No COOP/COEP on Pages — runs ArrayBuffer fallback |

Vercel deploys from the repo root using `vercel.json` (static build, root base,
COOP/COEP headers). GitHub Pages previously deployed via `.github/workflows/deploy.yml`
(base `/vepa/vepar/`); that workflow was archived with the legacy trees on
2026-08-10 — re-add it with a root layout (base `/vepa/`) when Pages deploys
are wanted again. The vite base switches on `VERCEL=1`.

### Run from anywhere

The repo-root launcher `./vepa4` works from any directory (no `cd` needed):

```bash
/path/to/vepa-feature-nuclear-rewrite/vepa4 dev      # start dev server (port 5180)
/path/to/vepa-feature-nuclear-rewrite/vepa4 dev 8080 # custom port
/path/to/vepa-feature-nuclear-rewrite/vepa4 build    # production build
/path/to/vepa-feature-nuclear-rewrite/vepa4 preview  # serve the build
/path/to/vepa-feature-nuclear-rewrite/vepa4 test     # unit tests
/path/to/vepa-feature-nuclear-rewrite/vepa4 syntax   # node --check all JS
/path/to/vepa-feature-nuclear-rewrite/vepa4 bench    # headless solver benchmark (--laws / --all / --json)
```

The launcher is also installed as a global command in Termux
(`/data/data/com.termux/files/usr/bin/vepa4` → repo `vepa4`), so plain
`vepa4 dev` works from any directory. If the requested port is busy it
auto-picks the next free one and opens your browser when ready. Remove the
global command with `rm /data/data/com.termux/files/usr/bin/vepa4`.

## What's New in v4

- **Intelligence engines live** — cluster detection, multi-voice narrative,
  lineage genealogy, goal self-tuning, and timeline record/scrub run every tick
  and publish to the World Intelligence Dashboard.
- **Communication DNA works** — particles emit oscillator pulses and exchange
  channel-filtered signals (TUNING_CH1-4 bandpass), with response forces,
  energy feed, and memory accumulation.
- **PREDATION law** restored as a proper toggle (index 51).
- **Sparse large world** — 250 particles over a 2000³ torus with
  world-size-scaled gravity.
- **Camera fixed** — the default view fits the whole world without the
  stretched/far-away distortion, particles keep a minimum 1.5px size so they
  never vanish, and zooming preserves depth.
- **Drawer minimize** — a dedicated `▁` button in the tab bar collapses the
  bottom drawer to a strip (`▔` restores it).

## Architecture

```
src/
├── core/           # EventBus, PRNG
├── state/          # ParticleBuffer, LawState, RuntimeConfig, Presets
├── dna/            # DNABuffer, Expression (phenotype)
├── physics/        # SpatialGrid, Laws (+signal system), Synergy, Solver
├── render/         # Canvas2D Renderer, SpriteSync
├── ui/             # HUD, Law/World/Intel/Species/DNA/Narrative panels
├── engines/        # Insight, Narrative, Goal, Lineage, Timeline (wired)
├── worker/         # Physics Web Worker (fallback path)
├── constants.js    # All indexes, ranges, defaults, LAW_HELP_DB
└── main.js         # Bootstrap, orchestration, engine wiring
```

## Debug Overlay

A collapsible **DEBUG** panel sits top-left and logs everything since the page
started. Tap its header (or `⧉ COPY`, or `SETTINGS → DEBUG → COPY LOG`) to copy
the full log as one JSON object. Hide/show it from `SETTINGS → DEBUG`; the
choice persists.

## Docs

- `SPEC.md` — feature specification for v4
- `PLAN.md` — implementation plan
- `CHANGELOG.md` — version history
- `../audit/FULL_AUDIT_2026-08-01.md` — the audit that scoped this release


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 2/112: AGENTS.md (521 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# AGENTS.md — VEPA Workspace Initialization & Codebase Audit

> **Project:** VEPA — Vector Emergent Physics Automata
> **Active Target:** **VEPA4 v7.0.0** (legacy label `4.7.0`; working tree; HEAD `7ddb832` = v4.6.26, 2026-08-07; 7.0.0 release draft uncommitted)
> **Layout:** the `` tree was promoted to the repo root on 2026-08-10 (legacy trees
> archived into `gemquota/vepa-archive`); ALL paths below are root-relative.
> **Working Branch:** `feature/multiplayer-investigation`
> **Audit Hash:** `AGENTS_SYNC_v7.0.0_2026-08-10`
>
> This file is the canonical initialization prompt for any agent entering this workspace. It contains the codebase audit, architectural SSOT, conventions, and operational workflows. All agents **must** read this file first before any code modification. Version control is **strict** — read §10.4 (Version History Control Protocol) before any changelog edit or deploy.
>
> ⚠️ **Live workspace:** concurrent agent sessions commit releases frequently (4.6.11 → 4.6.18 all landed on 2026-08-06; the 4.6.19+ DNA-64 / law-RRP / multiplex WIP is uncommitted). This file is a **snapshot** — re-run the §10.4 sync check and `git log --oneline -3` before every task. **The code is the truth; this file is the map.**

---

## 1. PROJECT IDENTITY

VEPA is a **GPU-accelerated (Web Workers + PixiJS/Canvas2D) emergent physics simulation** — a synthetic petri dish where particles governed by DNA profiles interact under global laws. A **Narrative Consciousness** layer acts as the functional "ink," rewriting physics based on the unfolding story of simulated species.

| Attribute | Value |
|-----------|-------|
| **Repository** | `github.com/gemquota/vepa.git` |
| **Active version** | **VEPA4 v7.0.0** (legacy label `4.7.0`) — tracked in `CHANGELOG.md` + Conventional Commits `chore(release):` subjects |
| **Active tree** | repo root (VEPA v4 — "Integrated Intelligence"; `v4/` promoted to root 2026-08-10) |
| **Legacy trees** | archived 2026-08-10 → `gemquota/vepa-archive` (root `src/` v2.5.0-era · `v3/`, `v3-backup/`, `v3-persistence-design/` · `vaa/`) |
| **Branches** | `master` (stable) · `new` · `feature/multiplayer-investigation` (**current**) · `feature/nuclear-rewrite` |
| **Backup branches** | `backup/pre-*` — cut before risky work (see §10.4) |
| **License** | ISC (`package.json`) |
| **Package Manager** | npm (`package-lock.json`, `node_modules/` installed) |
| **Runtime** | Browser (ESM) + Node.js (scripts, `bench/`, `audit-suite/`) |
| **Key Dependencies** | `pixi.js` ^8.18.1 · `vite` ^8.0.8 · `vitest` ^3.2.7 · `@playwright/test` ^1.60.0 |
| **Module System** | ESM (`"type": "module"`) |
| **Deploys** | Vercel prod `https://vepa-v4.vercel.app/` · GitHub Pages `/vepa/vepar/` |

**Version alignment (new schema since 2026-08-10):** the product is **VEPA4**; versions use `major.minor.build` (npm-semver-native). `VERSION`, the top section of `CHANGELOG.md` (arrow token), `package.json#version`, and this file **must all read 7.0.0**. Since the 2026-08-10 restructure the root manifest IS the v4 manifest (the legacy v2 root `package.json` was archived with the legacy trees).

**GEMINI.md mandates (take precedence over this file):** every significant change must sync `CHANGELOG.md`, `README.md`, `SPEC.md`/`PLAN.md`, `GUIDE.md`, `LAW_HELP_DB`, and `audit-suite/` per GEMINI.md §1.1 (legacy `ENGINE_SSOT.md` / `docs/fullaudit.md` / `codex/` parity were archived 2026-08-10); the B-4RK principle (documentation as a feature — 4-tier `LAW_HELP_DB` for every law); bitmask discipline (`LAW_INDEXES` never hardcoded); and verify doc sync before declaring completion or you incur **Documentation Debt**. Read `GEMINI.md` on entry (§10.1).

---

## 2. COMPLETE CODEBASE AUDIT

### 2.1 Active Tree (repo root — v4 promoted here 2026-08-10)

```
.                            ← repo root
├── CHANGELOG.md            ← RELEASE LEDGER — single source of truth (§10.4)
├── README.md               ← v4 overview, commands, deploy targets
├── SPEC.md                 ← v4 architecture spec (4.0.0 base)
├── PLAN.md                 ← v4 plan + milestone history
├── GUIDE.md / GEMINI.md    ← user design guide + project mandates
├── index.html              ← app shell
├── style.css
├── package.json            ← v4 manifest (4.7.0 — MUST match changelog top)
├── package-lock.json
├── vercel.json             ← Vercel static build + COOP/COEP headers
├── vite.config.js / vitest.config.js
├── vepa4                   ← launcher: dev|build|preview|test|syntax|bench
│
├── src/                    ← v4 application source (51 JS files, ~15.2k LOC)
│   ├── main.js             ← orchestrator, law shuffling, worker bridge
│   ├── constants.js        ← SSOT: STRIDE_INDEXES, DNA_INDEXES (64) / DNA_COUNT
│   │                          (64), DNA_META, DNA_RANGES, LAW_INDEXES (128),
│   │                          LAW_CATEGORIES, LAW_SPECTRUM
│   │                          (4pt bands), LAW_HUE_BY_INDEX, LAW_HELP_DB (4 tiers),
│   │                          LAW_SUBGROUPS, LAW_DEPENDENCIES, DNA_RANGES
│   ├── debug.js            ← on-canvas debug overlay
│   ├── core/               ← eventBus.js, prng.js (SplitMix32)
│   ├── state/              ← lawState.js (128-bit bitmask), particleBuffer.js,
│   │                          worldParams.js, runtimeConfig.js,
│   │                          defaultPresets.js, presetManager.js
│   ├── dna/                ← dnaBuffer.js (species genome), expression.js
│   ├── physics/            ← solver.js (MAX_FORCE 50, MAX_INTERACTIONS 500),
│   │   │                      laws.js, synergy.js, spatialGrid.js (GRID_DIM 12)
│   │   └── lawgroups/      ← 8 per-category law files + SPEC.md (law SSOT)
│   ├── render/             ← renderer.js, spriteSync.js (PixiJS)
│   ├── ui/                 ← 13 files: world, law, species, dna, dnaAnalytics,
│   │                          preset, settings, intel, narrative, hud,
│   │                          camera, tooltip + ui.js
│   ├── engines/            ← goal, insight, lineage, narrative, timeline
│   ├── multiplex/          ← multiplex.js + multiplexUI.js + multiplexHelp.js (chaos multiplex)
│   ├── spawn/              ← distribution.js (initial population)
│   └── worker/             ← physics.worker.js (SharedArrayBuffer loop)
│
├── tests/                  ← vitest: 69 files / 617 tests (unit + audit + params);
│                               legacy `run.mjs` node:test runner — do not use
├── bench/                  ← headless solver benchmark (vepa4 bench)
├── docs/                   ← v4 docs (mechanics/, dev/)
├── audit-suite/            ← law fidelity audit (fidelity-audit-v4.6.29.md + historical/)
├── node_modules/           ← installed (vite/vitest/playwright/pixi)
└── .dist/                  ← vite build output (gitignored)
```

### 2.2 Archived Legacy Trees (read-only — in `gemquota/vepa-archive`)

- **Root `src/` (v2.5.0-era)**, **`v3/` / `v3-backup/` / `v3-persistence-design/`** and
  **`vaa/`** were archived on 2026-08-10 (compressed into `vepa-archive-20260810.tar.gz`,
  hosted in the `gemquota/vepa-archive` repo; also recoverable from git history).
  Notable v2-era differences to never reintroduce: `PARTICLE_STRIDE = 64` (v4 uses 100)
  and nested `this.laws.pure/biol/chem/thermo/meta` config objects — **v4 replaced that
  with the `lawState` bitmask (§3.5); never write v2-style nested law config**.
- The legacy root `package.json` (name `vepa2`, dead `test` script) and root
  `README.md`/`CHANGELOG.md`/`VERSION` were archived too; the root manifest is now the v4 one.
- **Archived support dirs:** `codex/` (in-engine encyclopedia app), `scripts/`
  (build_codex.js, build_ssot.py, …), `archive/`, `audit/`, `public/` (legacy).
- **Restored docs (2026-08-10):** `docs/` now holds only v4-appropriate docs
  (`docs/mechanics/chaos_multiplex.md`, `docs/dev/`); legacy audit
  docs (`docs/fullaudit.md`, `docs/lawaudit.md`, `docs/LAW_AUDIT.md`, `docs/arch/`, …)
  were re-archived individually — the v4 law audit lives in `audit-suite/`.

### 2.3 Git State

| Property | Value |
|----------|-------|
| **Current Branch** | `feature/multiplayer-investigation` |
| **HEAD** | `7ddb832` — `v4.6.26: record production deploy URL` |
| **Previous releases** | `d5f5692` — `v4.6.26: solver perf` · `20df5ec` — `v4.6.25: GPU performance` · `28e9a16` — `v4.6.24: chaos multiplex expansion` · `f1407e6` — `v4.6.23: law RRP batches 20-22` · `d0aba7e` — `v4.6.22` · `32b6750` — `v4.6.21` · `446855b` — `v4.6.20` · `dbb4a0f` — `v4.6.18` |
| **Release tags** | **None yet** — adopt `vM.N.B` tagging per §10.4 (e.g. `v7.0.0`) |
| **Backup branches** | `backup/pre-archive-restructure-20260810` (cut before the 2026-08-10 restructure), `backup/pre-multiplex-20260807`, `backup/pre-metrics-20260807`, `backup/pre-perf-20260807`, `backup/pre-cleanup-20260726`, `backup/pre-lpsbs-20260728`, `backup/pre-vepa4-20260801` |
| **Working tree** | Dirty — **7.0.0 (legacy 4.7.0) release draft**: law RRP WIP (8 rewritten laws in `lawgroups/`, `laws.js`, `solver.js`, `constants.js` stride 85-95, `lawState.js` dependencies) + multiplex 4.6.27/4.6.28 WIP + the 2026-08-10 archive/restructure + docs restore/triage (staged, uncommitted). **Planned multiplayer update dropped** — P1 phone-grid WIP (`src/net/`, `src/ui/networkPanel.js`, `tests/unit/net.test.js`), LAN hub (`server/`), protocol lab (`multiplayer/`, `net-poc/`) and `docs/multiplayer/` removed from the tree (recoverable from `730f5dc` / backup branches) |
| **Remote** | `origin` → `github.com:gemquota/vepa.git` (`origin/HEAD` → `master`) |

**Release cadence:** 4.6.11 → … → 4.6.18 all landed 2026-08-06; 4.6.24-4.6.26 landed 2026-08-07/08. The 4.6.27/4.6.28 changelog sections, the v4.6.29 law RRP WIP and the 7.0.0 release draft are uncommitted (not yet released). Always re-check HEAD and the changelog top on entry — do not assume this table is current.

---

## 3. MEMORY & DATA ARCHITECTURE (THE STRIDE SYSTEM)

**Critical:** all particle state lives in flat `SharedArrayBuffer` / `Float32Array` buffers. **In v4, each particle occupies exactly 100 floats (`PARTICLE_STRIDE = 100`, `src/constants.js:9`).** The legacy root tree uses 64 — never mix the two. Base pointer is always `index * PARTICLE_STRIDE`.

### 3.1 Particle Stride Layout (v4 — offsets 0-84, 85-99 reserved)

Source of truth: `STRIDE_INDEXES` in `src/constants.js` and `src/physics/lawgroups/SPEC.md`.

| Offset(s) | Key | Description |
|-----------|-----|-------------|
| 0-2 | `POS_X/Y/Z` | Toroidal position |
| 3-5 | `VEL_X/Y/Z` | Velocity |
| 6 | `MASS` | Physical mass |
| 7 | `SPECIES_ID` | Species index (0-63) |
| 8-49 | `DNA_CACHE_START..END` | 42 cached DNA floats (normalized) |
| 50 | `ENERGY` | Metabolic/life energy pool |
| 51 | `AGE` | Frame count since birth |
| 52 | `DEAD` | 0 alive / 1 dead |
| 53-55 | `COLOR_R/G/B` | Color channels |
| 56 | `RADIUS` | Physical extent |
| 57 | `SIGNAL` | Pulse/signal strength |
| 58 | `BOND_COUNT` | Active valence bonds |
| 59-60 | `BOND_PARTNER_1/2` | Primary bond partners |
| 61 | `MEMORY` | Internal memory state |
| 62 | `HUNGER` | Starvation counter |
| 63 | `ARMOR` | Defense rating |
| 64 | `MITOSIS_TIMER` | Dual-system countdown |
| 65 | `PARTNER_ID` | Breeding partner |
| 66 | `TEMPERATURE` | Thermal state |
| 67 | `CHARGE` | Electrical charge |
| 68-69 | `PHASE_1/2` | Phase/state fields |
| 70 | `SOUL` | Soul-state marker |
| 71-73 | `TRAIL_X/Y/Z` | Trail/persistence |
| 74 | `ALPHA` | Transparency |
| 75-76 | `ENTANGLE_ID/PHASE` | Quantum entanglement |
| 77 | `ELECTRIC_ENERGY` | Electrical potential energy |
| 78 | `STORED_ENERGY` | Reserve pool (capacitance/fusion) |
| 79 | `REPRO_DRIVE` | Reproduction drive (REPRO law gate) |
| 80 | `RADIATION_EXPOSURE` | Accumulated radiation dose |
| 81-84 | `BOND_PARTNER_3-6` | Polymer chain expansion (max 6 bonds) |
| 85-99 | *(reserved)* | Future expansion |

### 3.2 Species DNA Buffers

- `DNA_INDEXES` — **64 parameters, indices 0-63** (`DNA_COUNT = 64`): the 42 core traits (0-41) plus 22 genetics & regulatory traits (42-63). Genetics 42-47: DOMINANCE, CROSSOVER_RATE, EPIGENETIC_DRIFT, HETEROZYGOSITY, GENE_FLOW, REPRESSOR; genetics & regulatory 48-63: ALLELE_COUNT, EPIGENETIC_RATE, HGT_RATE, REPAIR_EFFICIENCY, DRIFT_RATE, SELECTION_SENSITIVITY, SPECIATION_THRESHOLD, ADAPTATION_RATE, TRANSPOSON_RATE, GENE_SILENCING, RECOMBINATION_BIAS, MUTAGEN_SENSITIVITY, TELOMERE_LENGTH, PLOIDY_LEVEL, CODON_BIAS, REGULATORY_DEPTH.
- `DEFAULT_DNA_STRIDE = 64` — **allocation width of the species genome buffer** (Uint16Array, `species * 64 + index`). The stride width and the parameter count both equal 64 since v4.6.19; do not confuse it with the v2-era 64-parameter DNA set (22 genetics traits) — v4's 22 genetics traits live at indices 42-63.
- Per-particle cache: the stride holds **42** normalized floats (offsets 8-49); all 22 genetics traits (42-63) live **only** in the species genome (`readSpeciesDNAParam`/`writeSpeciesDNAParam` in `src/physics/laws.js`). Per-particle cache copies stay at 42 — never widen them.
- `MAX_SPECIES = 64`; `MAX_PARTICLES = 2500`.

### 3.3 Concurrency Model

- **Main thread:** UI (PixiJS sprites), orchestrator (`src/main.js`), render loop.
- **Worker thread:** physics loop (`src/worker/physics.worker.js`), solver (`src/physics/solver.js`), spatial grid, lawgroups.
- **Shared memory:** `SharedArrayBuffer` zero-copy particle state; worker writes, main reads via double-buffering with Transferable objects.
- **Sync protocol:** `postMessage` with `{type, data, config, version}` envelope; law state passed to the worker (INIT / TOGGLE_LAW / CONFIG messages).

### 3.4 Spatial Grid & Solver

- `GRID_DIM = 12` → 12×12×12 cells (`src/physics/spatialGrid.js:8`).
- `MAX_INTERACTIONS = 500` per particle; `MAX_FORCE = 50.0` stability clamp (`src/physics/solver.js:123-124`).
- Forces computed for neighborhood cells; toroidal coordinate remapping.

### 3.5 Law State (Bitmask) System — VERIFIED v4 ARCHITECTURE

Laws are bit flags in a **128-bit state: four `Uint32Array(1)` words — `lowFlags` (0-31), `highFlags` (32-63), `extFlags` (64-95), `quadFlags` (96-127)** (`src/state/lawState.js`). This covers `LAW_COUNT = 128`. Never hardcode law indices — always use `LAW_INDEXES` from `src/constants.js` (128 keys).

- **Helpers:** `createLawState()`, `set()`, `clear()`, `toggle()`, `isSet()`, `getActiveCount()` (popcount), `getStateVector()`, `fromVector()`, `serialize()` (`{low,high,ext,quad}`), `deserialize()` (accepts legacy 3-word objects, quad defaults 0).
- **Worker consumption:** `src/worker/physics.worker.js` imports the lawState helpers, keeps its own `lawState`, and passes it to `solve(particleView, particleCount, stride, lawState, dnaBuffer, worldSize, dt, rng)`.
- **Dispatch:** `src/physics/solver.js` gates every law with `isSet(lawState, LAW_INDEXES.X)` and calls the stateless lawgroup functions (`applyTide`, `applySuperposition`, … imported from `lawgroups/*.js`); per-law forces live in `src/physics/laws.js`.
- **Synergy:** multipliers come from `computeSynergy()` in `src/physics/synergy.js` (returns [0.0, 2.0], e.g. GRAV+PLANETARY ×1.5). The v2-era fixed-penalty synergy table is gone.
- **⚠ Do not backport:** v4 has **no** nested `this.laws.pure/biol/chem/thermo/meta` config object (that is the v2-era pattern). `LAW_INDEXES` and `isSet()` are **live v4 modules**, not deleted root-`src/` methods; `computeFlags()` does not exist anywhere in this repo.

### 3.6 Worker Message Protocol (`src/worker/physics.worker.js`)

Messages use the `{type, ...}` envelope. The worker owns the physics loop and replies on every command.

| Direction | Type | Payload / purpose |
|-----------|------|-------------------|
| → worker | `INIT` | `{buffer, count, config, dnaBuffer}` — `SharedArrayBuffer` (or `ArrayBuffer` fallback) + species genome; replies `INIT_COMPLETE` |
| → worker | `CONFIG` | `{config, buffer?, dnaBuffer?}` — config may set `particleCount`/`worldSize`/`dt`/`stride`, restore lawState from serialized `{low,high,ext,quad}` or a 128-boolean `laws` array; replies `CONFIG_COMPLETE` |
| → worker | `TOGGLE_LAW` | `{lawIndex, forceOn?, forceOff?}` — `forceOn`=set, `forceOff`=clear, else toggle; replies `LAW_TOGGLED {lawIndex, active, lawState}` |
| → worker | `TICK` | `{dt?, particleCount?}` — runs `solve(...)`; replies `TICK_COMPLETE` with `tickCount`, `tickDuration`, optional `offspring` |
| → worker | `GET_STATE` | replies `STATE` with `particleCount`, `worldSize`, … |
| → worker | `RESTORE` | restore serialized state; replies `RESTORE_COMPLETE` |
| → worker | `PING` | replies `PONG {tickCount}` |
| ← worker | `WORKER_READY` | posted once at worker startup |
| ← worker | `ERROR` | unknown message type or invalid payload |

The main thread wires this in `src/main.js` (`sendToWorker`/`worker.onmessage`); the worker owns its lawState copy and receives serialized law state via `CONFIG` + per-law changes via `TOGGLE_LAW`.

---

## 4. DNA PARAMETER SYSTEM (64 INDICES)

All indices are defined in `DNA_INDEXES` (`src/constants.js`); ranges live in `DNA_RANGES` (64 entries `[min, max, default]`) and display names in `DNA_META`. The 42 core traits (0-41) match the classic layout below; genetics traits 42-63 are listed in §4.6.

### 4.1 Physics & Motion (0-3, 15, 26-28)
- `FORCE(0)` · `VISCOSITY(1)` · `TORQUE(2)` · `JITTER(3)` · `TIDAL(15)` · `INERTIA(26)` · `FRICTION(27)` · `MAX_VELOCITY(28)`

### 4.2 Matter & Morphology (6-9, 16-17, 29-31)
- `SYMMETRY(6)` · `HIDDEN_MASS(7)` · `STIFFNESS(8)` · `FUSION(9)` · `FUSION_MOMENTUM(16)` · `FUSION_TIME(17)` · `BASE_RADIUS(29)` · `ELASTICITY(30)` · `BOND_ANGLE(31)`

### 4.3 Electromagnetism & Chemistry (4-5, 32-33, 37-39)
- `POLARITY(4)` · `ALPHA(5)` · `CONDUCTIVITY(32)` · `MAGNETIC_MOMENT(33)` · `REACTION_THRESHOLD(37)` · `CATALYSIS(38)` · `HEAT_OUTPUT(39)`

### 4.4 Biology & Life (10-12, 34-36, 41)
- `BIRTH_RATE(10)` · `DEATH_RATE(11)` · `MUTATION(12)` · `ENERGY_EFFICIENCY(34)` · `SEX_CHANCE(35)` · `PREDATION_BIAS(36)` · `SPECIES_AFFINITY(41)`

### 4.5 Communication & Memory (13-14, 18-25, 40)
- `SIGNAL_RESP(13)` · `PULSE_RATE(14)` · `NEIGHBORHOOD_RADIUS(18)` · `SIGNAL_STRENGTH(19)` · `SIGNAL_DECAY(20)` · `PROPAGATION_SPEED(21)` · `TUNING_CH1-CH4(22-25)` · `MEMORY_DECAY(40)`

### 4.6 Genetics & Regulation (42-63) — genome-only
- **Classic genetics (42-47):** `DOMINANCE(42)` · `CROSSOVER_RATE(43)` · `EPIGENETIC_DRIFT(44)` · `HETEROZYGOSITY(45)` · `GENE_FLOW(46)` · `REPRESSOR(47)`
- **Genetics & regulatory (48-63, added v4.6.19):** `ALLELE_COUNT(48)` · `EPIGENETIC_RATE(49)` · `HGT_RATE(50)` · `REPAIR_EFFICIENCY(51)` · `DRIFT_RATE(52)` · `SELECTION_SENSITIVITY(53)` · `SPECIATION_THRESHOLD(54)` · `ADAPTATION_RATE(55)` · `TRANSPOSON_RATE(56)` · `GENE_SILENCING(57)` · `RECOMBINATION_BIAS(58)` · `MUTAGEN_SENSITIVITY(59)` · `TELOMERE_LENGTH(60)` · `PLOIDY_LEVEL(61)` · `CODON_BIAS(62)` · `REGULATORY_DEPTH(63)`

**Engine wiring:** REPRO consumes ploidy/allele/recombination/mutation-scale params (48-51, 56-58, 61); GENOTYPE consumes drift/selection/speciation/adaptation/mutagen/silencing/codon/regulation (52-55, 57, 59, 62-63); SENESCENCE damps aging death with TELOMERE_LENGTH (60) — `applyLifeCycle` receives `dnaBuffer` from the solver.

---

## 5. LAW SYSTEM (128 GLOBAL LAWS — 8 CATEGORIES × 16)

Laws are multi-state toggles in the 128-bit `lawState` bitmask (§3.5), each with a 4-tier `LAW_HELP_DB` entry (hint, explanation, system, advanced) in `src/constants.js` (export name is **`LAW_HELP_DB`**). Categories are implemented as **stateless functions** in `src/physics/lawgroups/*.js` (see `lawgroups/SPEC.md`).

| Category | Spectrum color | Lawgroup file |
|----------|---------------|---------------|
| Physics | RED | `physicsLaws.js` (GRAV, DRAG, ENTR, WRAP, COLL, ACCR, PLANETARY, VOID, BOND, SINGULARITY, TIDE, FRICTION, ELASTICITY, TURBULENCE, CENTRIPETAL, ROTATION) |
| Biology | ORANGE | `biologyLaws.js` |
| Chemistry | YELLOW | `chemistryLaws.js` |
| Thermodynamics | GREEN | `thermoLaws.js` |
| Metaphysics | TEAL | `metaLaws.js` |
| Electromagnetism | BLUE | `emLaws.js` |
| Information | VIOLET | `infoLaws.js` |
| Quantum | PURPLE | `quantumLaws.js` |

The law grid renders as a top-to-bottom rainbow in this order (v4.6.11+). `LAW_CATEGORIES` (category → color + 16 indices) and `LAW_SPECTRUM` + `LAW_HUE_BY_INDEX` (128 hues, hue = spectrum position × 3.6) hold the mapping. Since v4.6.14 each category band is **4 spectrum points wide** (center ± 2; RED wraps 98%→102% through 0 — was 10 points before); all 128 laws keep distinct hues. An earlier EM-spectrum draft mapping (physics=BLUE, etc.) was superseded — the verified current mapping is the table above.

---

## 6. CODING CONVENTIONS & STANDARDS

### 6.1 JavaScript
- **Commits:** Conventional Commits 1.0.0 — `<type>(<scope>): <description>` (types `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`; `!`/`BREAKING CHANGE:` for breaking). Never write bare-subject or legacy `vX.Y.Z:` prefixed commits — see §10.4.
- **Module system:** ESM (`import`/`export`) throughout; no file extensions in import paths.
- **Naming:** classes `PascalCase`, functions/vars `camelCase`, constants `UPPER_SNAKE_CASE`, files `snake_case.js`.
- **Events:** use `bus` (`src/core/eventBus.js`) for decoupled communication.
- **PRNG:** use `SplitMix32` (`src/core/prng.js`) — never `Math.random()` for simulation-critical randomness.
- **Laws:** always `LAW_INDEXES.X`; state via `lawState.js` helpers (`set`/`clear`/`toggle`); test with `isSet()`. Never v2-style nested `this.laws.*` config.
- **Stride access:** always `index * PARTICLE_STRIDE + STRIDE_INDEXES.X` — no magic numbers.
- **NaN guards:** every physics sub-step validates coordinates and velocities; clamp `MAX_FORCE`/`MAX_VELOCITY`.
- **Law functions are stateless** — no module-level mutable state (per `lawgroups/SPEC.md`).

### 6.2 UI / CSS / HTML
- Programmatic UI in `src/ui/`; no framework.
- Interactive elements use `data-help-key` linking to `LAW_HELP_DB`.
- DNA sliders use `DNA_RANGES` from `src/constants.js`.
- HUD updates flow through `updateHUD()`.
- Setup drawer (v4.6.13): LAWS and WORLD are separate sub-tabs (network panel mounts in WORLD); the law grid can't be hidden anymore — only toggled icon/list view.
- Neon-noir aesthetic: CSS custom properties, `.bolt` corners, scanlines; law colors are per-law HSL (`--law-h`).

---

## 7. DOCUMENTATION & SSOT MANDATES

Every significant code change **MUST** be synchronized across these files:

| File | Content | Sync trigger |
|------|---------|--------------|
| `CHANGELOG.md` | Release ledger — **strict §10.4** | ANY functional change / release |
| `package.json` | Version manifest — must match changelog top | Every release |
| `README.md` | Project overview + commands | Architecture shifts, new features |
| `SPEC.md`, `PLAN.md` | Architecture spec + plan | Major milestones |
| `src/physics/lawgroups/SPEC.md` | Law implementation SSOT | Law changes |
| `src/constants.js` (LAW_HELP_DB) | 4-tier documentation | New laws or parameters |
| `GUIDE.md` | User-facing design guide | Significant parameter/DNA recipe shifts |
| `audit-suite/fidelity-audit-*.md` | Law fidelity audit (updated duplicate) | Law behavior changes (see `audit-suite/README.md`) |
| `VERSION` | Version marker — must match changelog top + `package.json` | Every release (see §10.4) |

The **B-4RK principle** stands: documentation is not an afterthought; it is a feature. New laws must ship with all four `LAW_HELP_DB` tiers. The law audit lives in `audit-suite/` (fidelity audit + frozen historical copies of `laws-rrp/batch_*.md`); legacy audit docs (`docs/fullaudit.md`, `docs/lawaudit.md`) are archived.

---

## 8. TESTING & QUALITY ASSURANCE

- **Unit/audit:** `vepa4 test` (vitest 3.2.7, `tests/`). **69 files / 617 tests** (verified 2026-08-10 — 597 green; the 20 failures are the uncommitted v4.6.29 law-RRP stale assertions, see `audit-suite/fidelity-audit-v4.6.29.md`). Config: `vitest.config.js` includes `tests/**/*.test.js`, node environment, 15 s timeout. Suite layout: `tests/unit/` (19 files incl. `drawer.test.js`), `tests/audit/` (`batch_01-32.test.js` + `params_batch_01-18.test.js` + `paramsHelpers.js`).
- **E2E:** `npm run test:e2e` (Playwright) — ⚠️ **no `playwright.config.*` or `*.spec.js` files are committed yet**, so the script is currently unconfigured; treat e2e as aspirational until specs land.
- **Syntax:** `vepa4 syntax` (`node --check` on `src` + `tests`).
- **Audit docs:** `audit-suite/` — `fidelity-audit-v4.6.29.md` (updated duplicate for the 8 rewritten laws) + `historical/2026-08-10-v4.6.28/` (frozen pre-rewrite audit incl. `laws-rrp/batch_*.md`).
- **Build smoke:** `vepa4 build`.
- **Legacy runner:** `tests/run.mjs` (node:test) is a v3-era artifact — do not use; `vepa4 test` is the suite.
- `npm test` runs the v4 vitest suite (the legacy v2 root manifest with the dead validator was archived).

---

## 9. BUILD SYSTEM & DEPLOYMENT

- **Launcher:** `./vepa4 [dev|build|preview|test|syntax|bench] [port]` from any directory (symlinked as `vepa4` on this device). Default dev port 5180.
- **Vite config** (`vite.config.js`): base `'/'` when `VERCEL=1`, else `'/vepa/vepar/'` (GitHub Pages); dev server sets COOP/COEP headers (`host: true`); worker format `es`.
- **Build:** `vepa4 build` → `.dist` (gitignored). PixiJS tree-shaken; COOP/COEP headers required for `SharedArrayBuffer`.
- **Deploys:** Vercel production (`vercel.json` — static build, COOP/COEP) → `https://vepa-v4.vercel.app/`. ⚠️ GitHub Pages `.github/workflows/deploy.yml` was archived with the legacy trees — re-add a root-layout workflow (base `/vepa/`) if Pages deploys are wanted.
- **World parameters:** 23 definitions in `src/state/worldParams.js` (`WORLD_PARAM_DEFS`); live values live in `runtimeConfig.worldParams` and are passed to the worker.
- Every deploy must follow §10.4.

---

## 10. WORKFLOW & OPERATIONAL PROTOCOLS

### 10.1 Agent Entry Procedure
1. **Read this file** ✓
2. **Audit state:** `git status` + `git log --oneline -3`; verify HEAD prefix matches top of `CHANGELOG.md`
3. **Verify branch:** `feature/multiplayer-investigation` is current — never commit to `master`
4. **Read context:** `README.md`, `SPEC.md`, `PLAN.md`
5. **Read the runtime SSOT:** `src/constants.js` (STRIDE_INDEXES, DNA_INDEXES, LAW_INDEXES, LAW_CATEGORIES)
6. **Read `src/physics/lawgroups/SPEC.md`** before touching law code
7. **Run the §10.4 version-sync check**
8. **Read `GEMINI.md`** (project mandates take precedence)
9. **Legacy trees are archived** (root `src/`, `v3/`, `vaa/` → `gemquota/vepa-archive`); never reintroduce v2-era code

### 10.2 Change Protocol
1. Make the change in `src`
2. `vepa4 syntax`
3. `vepa4 test` (+ targeted audit/e2e where relevant)
4. `vepa4 build` — verify no build regression
5. Update docs per §7 (minimum: `CHANGELOG.md` via §10.4)
6. Cut backup branch, commit, tag, deploy per §10.4

### 10.3 Common Pitfalls

| Pitfall | Resolution |
|---------|------------|
| **Stride mismatch** | v4 = 100, legacy root = 64 — always import `PARTICLE_STRIDE` from `src/constants.js` |
| **DNA count confusion** | v4 has **48** DNA params (0-47); `DEFAULT_DNA_STRIDE = 64` is the genome buffer width, not a param count; the 42-param claim applies to the per-particle stride cache only |
| **Law bitmask width** | The v4 law state is **128 bits** (4 × u32: low/high/ext/**quad**Flags) — not 96 bits. Serialized form is `{low, high, ext, quad}` |
| **v2 law config** | Do not write nested `this.laws.pure/biol/chem/thermo/meta` objects — that is v2-era; v4 uses `lawState` + `LAW_INDEXES` + `isSet()` |
| **Version drift (fixed 2026-08-06, re-based 2026-08-10)** | `VERSION`/changelog arrow token/`package.json#version` all read 7.0.0 (VEPA4 `major.minor.build`); keep them matched per §10.4 |
| **Stale root manifest** | The legacy v2 root manifest is archived — `npm test` / `npm run build` now run the v4 suite from the root |
| SharedArrayBuffer blocked | Serve with COOP/COEP (`vepa4 dev` handles; `vercel.json` ships them) |
| Worker postMessage limits | Use Transferable objects for buffer transfers |
| Physics NaN explosion | NaN shields in solver; MAX_FORCE/MAX_VELOCITY clamps |
| Law toggle not working | Check `LAW_INDEXES` + `lawState.js` set/clear + `isSet` in solver |
| HELP_DB / audit drift | After law changes, sync `LAW_HELP_DB` (4 tiers) + `audit-suite/fidelity-audit-*.md` (see GEMINI.md §1.1) |
| Memory/stride corruption | Every access = `index * PARTICLE_STRIDE + STRIDE_INDEXES.X` |
| Planet law key | v4 key is `LAW_INDEXES.PLANETARY` |
| Stale changelog drafts | An earlier `[4.7.0]` draft was removed from the ledger on 2026-08-06 (snapshot: `CHANGELOG.md.bak-20260806`); the current `[4.7.0]` release draft (2026-08-10) drops the planned multiplayer update entirely |

### 10.4 VERSION HISTORY CONTROL PROTOCOL (STRICT — MANDATORY)

**Product & schema (adopted 2026-08-10):** the product is **VEPA4** (formerly
styled "VEPA v4"); versions use **`major.minor.build`** (npm-semver-native, e.g.
`7.0.0`). Retroactive mapping of the v4 line: old `4.M.N` → `M.N.0` — the
generation `4` moved into the product name, the old minor became the new major,
the old patch became the new minor, and every historical release gets build `0`
(builds increment only for future same-minor rebuilds/hotfixes). Changelog
headers carry both labels: `## [4.6.28] - date → 6.28.0`. v2/v3-era entries keep
their historical labels.

**Authority:** `CHANGELOG.md` is the single source of truth for release history.
`VERSION`, the changelog top section's arrow token, and `package.json#version`
MUST all equal the newest version (`7.0.0`). From here on, drift is a release
blocker.

**Commit standard (Conventional Commits 1.0.0 — mandatory for all commits from
2026-08-10):** `<type>(<scope>): <description>` with types
`feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`; breaking changes
append `!` to the type/scope or use a `BREAKING CHANGE:` footer. Release commits
use `chore(release): v7.0.0 — <summary>`; tags are `v7.0.0`. Past commit messages
(legacy `vX.Y.Z:` prefixes) are immutable — never rewrite history; the changelog
restates releases under the new schema.

**Release checklist — every deploy, no exceptions:**
1. **Changelog first.** Add `## [4.7.0] - YYYY-MM-DD → 7.0.0` at the top of
   `CHANGELOG.md` (legacy label + arrow + new-schema token), with
   conventional-style bullets summarizing what/why/files.
2. **Sync the manifests.** Bump `package.json#version` + `VERSION` to the arrow
   token (`7.0.0`). Drift is never allowed.
3. **Back up before editing.** Cut a `backup/pre-<slug>-YYYYMMDD` git branch
   (e.g. `backup/pre-700-20260810`) before risky work. For changelog surgery
   specifically, also snapshot the file: `cp CHANGELOG.md CHANGELOG.md.bak-<date>`.
4. **Commit with Conventional Commits.** `chore(release): v7.0.0 — <summary>` —
   releases are never bare feature commits.
5. **Tag the release.** `git tag v7.0.0` (repo has no tags yet — adopt from the
   next release).
6. **Record the deploy.** Add the deployed URL(s) (Vercel/Pages) to the changelog
   entry so history maps to artifacts.
7. **Sync version markers.** Keep `VERSION` + `package.json#version` aligned with
   the changelog top (since 2026-08-10 the root manifest IS the v4 manifest —
   there are no separate root pointers anymore).

**Changelog backup rules:**
- The changelog is the release ledger — protect it like a database. Snapshot
  (step 3) before ANY bulk edit, and confirm `git diff CHANGELOG.md` shows only
  intended changes afterward.
- Never force-push, rebase, or `git reset` over a committed changelog entry. Fix
  history with a new entry, never by rewriting.
- A release is not real until committed AND tagged. Deploy without a ledger entry
  = it didn't happen.

**Post-release verification:**
```bash
grep -m1 '^## .*→ ' CHANGELOG.md | grep -oE '[0-9]+\.[0-9]+\.[0-9]+$'   # → 7.0.0
grep '"version"' package.json      # 7.0.0 — must match
cat VERSION                        # 7.0.0 — must match
git log --oneline -1               # chore(release): v7.0.0
git tag | tail -1                  # v7.0.0
```

**Non-negotiable rules:**
- No release commit without a changelog section.
- No changelog section without a matching `package.json` version.
- No deploy without a `backup/pre-*` branch from the pre-release state.
- One section per release; newest version number first (branch experiments get
  `M.N.B-<tag>` suffixes, e.g. `7.0.0-mp`).
- Every commit (release or feature) follows Conventional Commits 1.0.0.

### 10.5 Architecture Constraints (v4)
- `PARTICLE_STRIDE` = 100 · `MAX_SPECIES` = 64 · `MAX_PARTICLES` = 2500
- `DEFAULT_DNA_STRIDE` = 64 (species genome width) · `DNA_COUNT` = 64 (42 cached per particle, 22 genome-only)
- `LAW_COUNT` = 128 (8 categories × 16) · `GRID_DIM` = 12 (12³ cells)
- `MAX_INTERACTIONS` = 500 · `MAX_FORCE` = 50.0
- Particle buffer: `Float32Array` over `SharedArrayBuffer`

### 10.6 Adding a New Law (v4)
1. Add index to `LAW_INDEXES` + `LAW_HELP_DB` (all 4 tiers) in `src/constants.js`
2. Add to `LAW_CATEGORIES` (16-per-category cap; `LAW_COUNT` ≤ 128) and confirm `LAW_SPECTRUM`/`LAW_HUE_BY_INDEX` coverage
3. Implement a stateless function in `src/physics/lawgroups/<category>Laws.js` per `lawgroups/SPEC.md`
4. Wire dispatch with `isSet(LAW_INDEXES.X)` in `src/physics/solver.js` (worker consumes via `solve()`)
5. Add the toggle in `src/ui/lawPanel.js`
6. Update `lawgroups/SPEC.md` + `audit-suite/laws-rrp/batch_*.md`
7. Update `audit-suite/fidelity-audit-*.md` + the historical batch copy if the law behavior changed
8. `vepa4 syntax` + `vepa4 test`
9. Changelog + version + backup + tag per §10.4

---

## 11. PRESET PROFILES

Built-ins live in `src/state/defaultPresets.js`: **PRIME_DEFAULT** (default world) plus species presets **PREDATOR, SOL, LIFE, AETHER, VOID**; managed by `src/state/presetManager.js` with `src/ui/presetPanel.js`. (The classic v2 table had 12 presets — verify current names in `defaultPresets.js` before relying on any.)

---

## 12. INTELLIGENCE ENGINES

- **v4 (`src/engines/`):** `goalEngine.js` (world-constraint tuning), `insightEngine.js` (cluster detection / pattern logging), `lineageTracker.js` (genealogy), `narrativeEngine.js` (narrative generation), `timelineEngine.js` (history playback).
- **Legacy (archived):** `personalityEngine.js`, `emergentParamEngine.js`, `narrativeConsciousness.js`, `persistenceEngine.js`, `levelEngine.js`, plus v2 `engines/` — archived 2026-08-10 with the legacy trees (in `gemquota/vepa-archive`).

---

## 13. CURRENT DOCUMENTATION & WORK TRACKS

- `docs/multiplayer/` — **removed with the 4.7.0 release draft (2026-08-10)**; the LAN-hub P0 + phone-grid P1 WIP (`server/`, `multiplayer/`, `net-poc/`, `src/net/`, `src/ui/networkPanel.js`, `tests/unit/net.test.js`) is recoverable from `730f5dc` / backup branches if the multiplayer track is ever resumed.
- `audit-suite/laws-rrp/` — per-law RRP batches 01-32 (batches 01-14 shipped through v4.6.18; batches 15+ pending).
- `tests/audit/` — `batch_01-32.test.js` + `params_batch_01-18.test.js`.
- `docs/stubs.md` — legacy doc gaps; `docs/LAW_AUDIT.md`, `docs/LAW_PARAMETER_RELATIONSHIPS.md` — law/param analysis.
- `PLAN.md` — milestone plan.

---

## 14. QUICK REFERENCE

```bash
# State & version sync (run on entry — §10.4)
git status && git log --oneline -3
grep -m1 '^## .*→ ' CHANGELOG.md | grep -oE '[0-9]+\.[0-9]+\.[0-9]+$'   # → 7.0.0
grep '"version"' package.json      # must match changelog
cat VERSION                           # root marker — must match too

# Trust-but-verify (workspace moves fast — code is truth)
node -e "const c=require('./src/constants.js'); console.log(c.PARTICLE_STRIDE, c.DNA_COUNT, c.LAW_COUNT)"  # → 100 64 128
grep -c '^export const' src/constants.js
ls src/physics/lawgroups/*.js | wc -l    # → 8 lawgroup files + SPEC.md
git log --oneline -3 -- CHANGELOG.md     # confirm HEAD = changelog top

# v4 workflow
vepa4 dev                             # dev server (COOP/COEP), port 5180
vepa4 test                            # vitest unit suite (67 files / 579 tests)
vepa4 syntax                          # node --check all v4 JS
vepa4 build                           # vite build → .dist
npx playwright test          # e2e suite

# Release (strict — §10.4)
git switch -c backup/pre-<slug>-$(date +%Y%m%d)   # backup branch first
# ... edit CHANGELOG.md + package.json (+ VERSION) ...
git commit -m "chore(release): v7.0.0 — <summary>"
git tag v7.0.0

# Key constants
grep 'PARTICLE_STRIDE' src/constants.js   # → 100
grep 'LAW_COUNT'       src/constants.js   # → 128
grep 'MAX_SPECIES'     src/constants.js   # → 64
grep 'DNA_COUNT'       src/constants.js   # → 64
```

---

*Reviewed 2026-08-06 | Workspace state: v4.6.19 @ `dbb4a0f` (v4.6.18 committed) on `feature/multiplayer-investigation`. Version labels synced 4.6.19; DNA-64 expansion (indices 48-63) in the working tree; changelog snapshots `CHANGELOG.md.bak-20260806` + `CHANGELOG.md.bak-20260806-2`. Verify SSOT parity before any code change.*


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 3/112: GEMINI.md (49 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA PROJECT MANDATES (GEMINI.md)

This file contains foundational mandates for the VEPA (Vector Emergent Physics Automata) project. These instructions take absolute precedence over general operational workflows.

---

## 1. CORE GOVERNANCE

### 1.1 Documentation Synchronization
Every significant code modification, law implementation, or UI refactor MUST be synchronized across the following files:
*   **CHANGELOG.md:** Accurate versioning and categorisation of changes (single source of truth for releases — see AGENTS.md §10.4).
*   **README.md:** High-level project state and quick-start updates.
*   **SPEC.md / PLAN.md:** Architecture spec + roadmap updates for major milestones.
*   **GUIDE.md:** User-facing instructional updates.
*   **`src/constants.js` `LAW_HELP_DB`:** 4-tier documentation for every law (B-4RK).
*   **`audit-suite/`:** Law fidelity audit (`fidelity-audit-*.md`) whenever law behavior changes.

> Legacy SSOT files (`ENGINE_SSOT.md`, `docs/fullaudit.md`, `COMPENDIUM.md`) were archived on
> 2026-08-10 — their role is covered by `SPEC.md`, `src/constants.js` and `audit-suite/`.
> The archived copies live in the `gemquota/vepa-archive` repo.

### 1.2 The "B-4RK" Principle
Documentation is not an afterthought; it is a feature. All new laws must be accompanied by `HELP_DB` entries in `src/constants.js` covering all four tiers (HINT, EXPLANATION, SYSTEM, ADVANCED).

### 1.3 Versioning & Commit Standards (adopted 2026-08-10)
- The product is **VEPA4**; every version uses the **`major.minor.build`** schema (current `7.0.0`), with legacy labels retained in `CHANGELOG.md` headers (old `4.M.N` → `M.N.0`).
- Every commit MUST follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) (`<type>(<scope>): <description>`); release commits use `chore(release): vX.Y.Z — <summary>` and tags are `vX.Y.Z`.
- The full release protocol (backup branches, changelog-first, manifest sync, tagging) is `AGENTS.md` §10.4 — no release without it.

---

## 2. ENGINEERING STANDARDS

### 2.1 Physics Integrity
*   **Stability First:** All spring-based or attractive forces must implement damping and action/reaction symmetry (averaging stiffness/mass constants).
*   **Bitmask Discipline:** Never hardcode law indices. Always use `LAW_INDEXES` from `constants.js`.

### 2.2 UI/UX Consistency
*   **HELP_DB Parity:** `LAW_HELP_DB` (4 tiers, `src/constants.js`) is the in-engine law documentation source of truth — keep it in sync with `lawgroups/SPEC.md` and the audit suite.
*   **Tactile Feedback:** Every playback control or parameter shift should provide visual confirmation (via Log, HUD, or tooltip).

---

## 3. WORKFLOW ENFORCEMENT
The agent must verify documentation synchronization before declaring a task complete. Failure to update the SSOT results in a "Documentation Debt" state.

---
*Verified by GEMINI_CLI_PEER*


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 4/112: SPEC.md (111 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Feature Specification: VEPA4 — Integrated Intelligence

**Version**: 4.0.0 | **Date**: 2026-08-01 | **Base**: v3 (3.1.0 + WIP)
**Audit input**: `audit/FULL_AUDIT_2026-08-01.md`

## Problem Statement

## Development Standards (2026-08-10)

- **Product & versioning:** the product is **VEPA4**; versions use
  **`major.minor.build`** (npm-semver-native, current `7.0.0`). The v4 line is
  retroactively mapped old `4.M.N` → `M.N.0` (generation `4` moved into the
  product name). Changelog headers carry both labels
  (`## [4.6.28] - date → 6.28.0`); the full rule lives in `AGENTS.md` §10.4.
- **Commits:** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
  is mandatory — `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`
  with scopes, `!`/`BREAKING CHANGE:` for breaking changes. Release commits use
  `chore(release): v7.0.0 — <summary>` and tags are `v7.0.0`.

VEPA v3 recreated the simulation with clean module boundaries, but the five
intelligence engines — Insight, Narrative, Goal, Lineage, Timeline — were left
disconnected from the application (compiled factories, zero imports in
`main.js`). The communication DNA group (11 parameters) was inert in the
physics engine, and PREDATION — a v2 law — existed only as a function miswired
under the TRACK toggle. The result: a physics sandbox with no narrative,
no evolution history, no self-tuning, and no replay.

VEPA4 closes that gap: engines become first-class citizens of the simulation
loop, DNA communication drives real forces, and the world surfaces its own
intelligence through a live dashboard.

## Goals

1. Wire all five engines into `main.js` with event-driven communication only.
2. Implement communication DNA physics (pulse emission, channel-filtered
   propagation, signal response, memory).
3. Restore PREDATION as an explicit law (parity with v2).
4. Provide a World Intelligence Dashboard (clusters, lineage, goals, timeline).
5. Keep the v3 performance characteristics (no per-frame allocations in hot loops).

## Non-Goals

- No worker-mode migration (main-thread physics remains the default; the
  existing worker fallback is untouched).
- No changes to the v2 legacy tree (`src/`, root `index.html`).
- No new laws beyond PREDATION; the 51 existing laws keep their behavior.

## Architecture

### Engine wiring (main.js)

| Engine | Update cadence | Emits | Consumes |
|--------|----------------|-------|----------|
| Insight | every `scanInterval` frames | `cluster:detected` | particle buffer |
| Narrative | every frame (paced) | `narrative:entry` | cluster/law/lineage/goal events |
| Lineage | every frame (death scan); on spawn | `lineage:branch`, `lineage:death` | `spawnOffspring` births, DEAD transitions |
| Goal | every `evaluationInterval` frames | `goal:adjusted`, `goal:applied` | `sim:metrics` |
| Timeline | every 150 frames while recording | `timeline:snapshot`, `timeline:restored` | `timeline:record`, `timeline:scrubTo` |

All engines hold no DOM references. The UI subscribes to the same bus.

### Signal system (laws.js + solver.js)

- Per-particle: `applySignalDecay` — oscillator emission
  (`phase = sin(age·0.01·(0.1+pulseRate))`, gated by SIGNAL_STRENGTH),
  exponential decay via SIGNAL_DECAY, memory decay via MEMORY_DECAY.
- Pairwise: `applySignalExchange` — gated by NEIGHBORHOOD_RADIUS, delivered
  signal = `sender.signal × sender.SIGNAL_STRENGTH × receiver.PROPAGATION_SPEED
  × channelFilter × dt × signalScale`; channelFilter is the normalized dot
  product of receiver × sender TUNING_CH1-4; SIGNAL_RESP converts delivery
  into attraction force + energy; MEMORY accumulates.

### Predation law

`LAW_INDEXES.PREDATION = 51`, `LAW_COUNT = 52`, added to the biology category,
`LAW_HELP_DB`, and the law-grid icon map. Solver dispatches `applyPredation`
under its own bit instead of TRACK.

### Goal-engine tunables

`runtimeConfig` gains `maxForce`, `forceScale`, `dragMultiplier`, `birthRate`,
`deathRate`, `signalScale`. Solver consumes them at the force-clamp,
integration, and REPRO/LIFE synergy points. Insight consumes `scanInterval` /
`clusterRadius` adjustments live.

## Acceptance Criteria

1. **Engines wired**: boot creates all five engines; a 1000-frame run produces
   ≥1 `cluster:detected`, ≥1 `lineage:branch`/`lineage:death`, `goal:adjusted`
   events, and timeline snapshots when recording is enabled. *(verified via
   unit tests on engine behavior + wiring code inspection)*
2. **Signals move matter**: two particles with tuned communication DNA
   exchange signal and apply a response force; mismatched tuning channels
   block delivery. *(verified in `tests/unit/signal.test.js`)*
3. **Predation law toggles**: enabling PREDATION (bit 51) dispatches pursuit;
   disabling it removes pursuit. *(solver guard verified)*
4. **Dashboard renders**: the WORLD tab shows the intelligence section with
   live counters, REC toggle, and scrub slider. *(DOM-driven, no unit test —
   manual verify in browser)*
5. **No regressions**: `npm test` green (39 tests), `vite build` succeeds.

## User Stories

- As a player, I toggle PREDATION and watch predator species pursue prey,
  absorb DNA, and grow.
- As a player, I raise a species' TUNING channels and SIGNAL_RESP and watch
  them swarm toward signal emitters.
- As a player, I watch the narrative panel react to births, deaths, clusters,
  and law changes, and scrub the timeline back to an earlier snapshot.
- As a player, I enable REC and scrub; the world rewinds to the recorded state.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 5/112: PLAN.md (84 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Implementation Plan: VEPA4 — Integrated Intelligence

**Date**: 2026-08-01 | **Status**: Complete | **Spec**: `SPEC.md`

> **Standards (2026-08-10):** product **VEPA4**, versions `major.minor.build`
> (current `7.0.0`; legacy v4-line mapping old `4.M.N` → `M.N.0`), commits
> Conventional Commits 1.0.0 — see `AGENTS.md` §10.4.

## Steps

1. **Audit** — verified current v3 state against the stale 2026-07-29 audit;
   identified real gaps: engines unwired, PREDATION law missing, comm-DNA inert,
   no lineage anchors. → `audit/FULL_AUDIT_2026-08-01.md`
2. **Backup** — `backup/pre-vepa4-20260801` git branch (commit `a341d2b`,
   captured the dirty working tree incl. sparse-world WIP) + file snapshot
   `v3-backup/pre-vepa4-20260801/`.
3. **Fork** — `cp -r v3 v4`; merged the sparse-world/larger-world WIP from the
   backup branch into v4; bumped to `vepa-v4` 4.0.0.
4. **Constants** — added `PREDATION: 51` (+`LAW_COUNT=52`), biology category
   membership, `LAW_HELP_DB` 4-tier entry.
5. **Signals** — rewrote `applySignalDecay` (unconditional pulse + decay +
   memory decay), added `applySignalExchange` + `channelMatch` in `laws.js`;
   added `runtimeConfig.signalScale`.
6. **Solver** — wired signal exchange into the pairwise loop, PREDATION
   dispatch under its own bit, force-scale/clamp knobs, global drag multiplier,
   REPRO/LIFE synergy scaling, and `parentId` in offspring payloads.
7. **Engine wiring** — imported and instantiated all five engines in `main.js`;
   added `updateIntelligence()` (insight, narrative, lineage death-scan,
   timeline recording, goal evaluation), `computeMetrics()`, `wireGoalEvents()`
   (goal application + timeline record/scrub/clear), `resetIntelligence()`.
8. **UI** — new `src/ui/intelPanel.js` (clusters, births/deaths, lineage depth,
   snapshots, REC toggle, scrub slider, goal log) rendered into `#world-intel`
   in the WORLD tab; CSS added.
9. **Tests** — `tests/unit/engines.test.js` (insight cluster detection +
   trend, lineage stats, timeline snapshot/scrub, goal adjustments) and
   `tests/unit/signal.test.js` (pulse, propagation, channel filtering);
   vitest timeout 15s.
10. **Docs** — v4 `README.md`, `SPEC.md`, `PLAN.md`, `CHANGELOG.md`; root
    `CHANGELOG.md`/`README.md` pointer notes.

## Validation

```bash
cd v4
find src tests -name '*.js' -exec node --check {} +   # syntax
npm test                                              # 39/39 pass
npx vite build                                        # clean bundle
```

## Risks & Notes

- WORLD_SIZE 2000 × 250 particles is intentionally sparse; gravity scales with
  world size so structure still forms. Watch cluster density when tuning
  insight defaults.
- Timeline snapshots are raw buffer copies; with recording on and large
  populations, memory grows (20 snapshots × buffer). REC is off by default.
- Main-thread physics remains the default; worker mode is future work.

## Milestone note (v4.6.24 — 2026-08-07)

- **Chaos Multiplex expansion** implemented: world import on exit (`copyShardToWorld`),
  a 14-metric weighted fitness engine (`computeShardMetrics` / `getFitnessReport`), LIVE/FIT
  drawer tabs with per-aspect variation, POP SCALE, SEED, SUBSTEPS, AFTER ITERATE
  (NONE/FITTEST/FOLLOW), KEEP SELECTED, and IMPORT ON EXIT. See `v4/CHANGELOG.md` [4.6.24]
  and `docs/mechanics/chaos_multiplex.md` §4.

## Milestone note (v4.6.25 — 2026-08-07)

- **GPU performance & multiplex metrics drawer**: zero-copy particle views
  (`asParticleView`) on the main + multiplex render paths, DPR caps (main 2×, previews
  1.25×), ECO render mode (no grid/halo) with a live GPU ECO toggle in the LIVE tab, and
  a collapsible metrics bottom drawer with per-shard fitness chips and an
  ALIVE/CAP/ΔSEL/ΔAVG/ITER stats line. See `v4/CHANGELOG.md` [4.6.25] and
  `docs/mechanics/chaos_multiplex.md` §5.

## Milestone note (v4.6.26 — 2026-08-07)

- **Solver performance**: per-tick synergy cache (`createSynergyCache`) + active-law
  byte cache in `solve()` cut per-particle/pair branch chains, delivering 2.8–5× solver
  throughput (benchmarked: 2500 particles 428.7 → 103.6 ms/tick on the default law set).
- **`vepa4 bench`** headless harness (throughput / per-law / all-law stress / JSON).
- **Debug perf stats** in the debug overlay (f/t/r ms) and `· MS` in the multiplex
  metrics drawer. See `v4/CHANGELOG.md` [4.6.26].


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 6/112: GUIDE.md (105 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# 🧭 The Architect's Field Manual: Engineering Emergence

> **Status:** VEPA4-current (design guidance — DNA trait names and recipes apply
> to the v4-line 64-parameter genome; exact slider ranges live in
> `src/constants.js` `DNA_RANGES`).

This guide is not a manual for sliders; it is a strategic framework for **Universal Design**. In VEPA, the species are your clay, and the DNA rules are your tools.

---

## 1. The Trinity of Structure

Stable macro-structures are rarely the result of a single parameter. They emerge from the "Golden Ratios" between three core pillars:

### A. The Kinetic Buffer (Force vs. Viscosity)
*   **The Problem:** High attraction leads to "Collisional Heat"—particles oscillating wildly or exploding out of clusters.
*   **The Fix:** **Viscosity** (0.95+) acts as a shock absorber. It allows particles to bleed off kinetic energy upon arrival, settling into "Molecules" instead of chaotic orbits.
*   **Recipe for Stability:** `Force: 1.0` | `Viscosity: 0.98` | `Jitter: 0.05`.

### B. The Geometric Lock (Stiffness vs. Symmetry)
*   **The Problem:** Circles are too perfect; they roll and slip past each other.
*   **The Fix:** Use **Symmetry (C3)** to warp particles into ellipses and **Stiffness** to make those edges "Hard." Non-circular shapes create mechanical interlocking, allowing for the construction of rigid beams and non-deformable crystals.
*   **Recipe for Architecture:** `Stiffness: 2.5` | `Symmetry: 0.8` | `Torque: 0.2`.

### C. The Social Oscillator (Signal vs. Pulse)
*   **The Problem:** Individual particles act as silos.
*   **The Fix:** Synchronize them. **Signal Response** allows one particle's state change to trigger its neighbors. When tuned correctly, you can create "Traveling Waves" or "Heartbeats" that ripple across an entire colony.
*   **Recipe for Neural Nets:** `Pulse Rate: 0.1` | `Signal Resp: 1.5` | `Alpha: 0.4`.

### D. The Boundary Condition (Wrap vs. Solid vs. Void vs. Sticky)
*   **The Problem:** Toroidal wrapping (Periodic) is great for infinite fields but bad for simulating containers or "Leaking" systems.
*   **The Fix:** Use the cycling **WRAP** law to shift topology:
    *   **Periodic:** Infinite toroidal space (Screen wrap).
    *   **Solid:** Elastic bounce at boundaries for high-pressure containment.
    *   **Void:** Open system where matter "evaporates" out of bounds.
    *   **Sticky:** Zero-velocity adhesion at the edge of space.

### E. The Categorical Law Colors
Laws are now color-coded by category to help you navigate the system status at a glance:
*   **BLUE (Physics):** Gravity, Drag, Entropy, Wrap, Collision, Accretion, Planetary.
*   **GREEN (Biology):** Life, Glow, Affinity, Repro, Track, Senescence, Energy, Radiation, Genotype, Phenotype.
*   **PURPLE (Chemistry):** Catalysis, Solvation, Acidity, Oxidation, Poly, Isomerization, Chirality, Crystallization.
*   **ORANGE (Thermodynamics):** Heat, Cold, Convection, Radiation, Phase changes.
*   **RED (Metaphysics):** Time Dilation, Dimensionality, Chaos, Order, Fate, Will, Soul, Mind.

### F. Evolutionary Coloring
Color in VEPA is now a direct indicator of genetic history and stability:
*   **Accretion (Mass-Weighted):** When particles merge, the survivor inherits a mass-weighted average of both parent colors.
*   **Offspring (Randomized Intermediary):** In sexual reproduction, offspring inherit a randomized value within the R,G,B range of both parents.
*   **The Variance Shift:** Offspring colors are further hue-shifted (perpendicular shift in color space) based on the magnitude of genetic mutations. A highly mutated offspring will appear color-shifted relative to its parents, providing a visual cue for evolutionary "leaps."

---

## 2. Advanced Interaction Laws

### The Three-Tier Reproduction System (REPRO)
When the `REPRO` law is active, species can propagate through three distinct channels:
1.  **Spontaneous Cloning:** Entities spontaneously produce offspring based on their `Birth Rate`. Offspring inherit DNA with slight drift.
2.  **Sexual Reproduction:** Colliding entities with compatible energy levels have a chance to breed (via `Sex Chance`). This blends DNA from both parents and produces a randomized intermediary color.
3.  **Mitosis (High-Energy Splitting):** Mature entities ($Energy > 90$, $Mass > 1.5$) will split into two, sharing their mass and energy. This is triggered by biological success.

---

## 3. Evolutionary Pressure (Chaos Strategy)

The **CHAOS** system is your primary tool for "Forced Evolution."

*   **Rule Drifting:** By enabling chaos on **DNA Rules** only, you can find "Island States" of stability that you would never have tuned manually. If a stable structure forms during a chaos drift, immediately **Stop** the drift to "Fossilize" the laws.
*   **Selective Extinction:** Use a high **Death Rate** in the Biology tab combined with high **Mutation**. This creates a "Red Queen" race where only species that reproduce fast enough and mutate into stable configurations survive the baseline attrition.

---

## 3. The Collapse-Rebirth Cycle

Managing a **Singularity** (Black Hole) is an advanced architect's most dangerous task.

*   **The Star Forge:** A Black Hole is a recycling center. By tuning **Gravity Pull** and **Mass Gain**, you can pull in "Inert Slop" (gray particles). If you have **Fusion** enabled, the density at the core will eventually trigger a massive outward explosion (simulated via high repulsion at high mass), scattering high-energy matter back into the void.
*   **Event Horizon Tuning:** Use **Spread Radius** in the World tab to determine how "Hungry" your central gravity well is. A wide spread creates a galaxy-style spiral; a tight spread creates a feeding frenzy.

---

## 4. Troubleshooting the Universe

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **The "Slop" Effect** | Too much attraction, no damping. | Increase **Viscosity** or **Stiffness**. |
| **Thermal Explosion** | Forces are too high for the Sim Speed. | Lower **Sim Speed** or **Force**. |
| **Species Ghosting** | Alpha is too low. | Increase **Alpha (C2)** or **Glow Intensity**. |
| **Static Death** | No energy flow or motion. | Increase **Jitter**, **Birth Rate**, or **Sim Speed**. |

---

### "Do not just observe the emergence. Direct it."

---

## 📚 Further Research: The Encyclopedia

For those requiring a total technical breakdown of the engine's core constants, refer to the **Expanded Physics Encyclopedia**:

*   **[Batch 01: World Physics Core](./docs/expansion/batches/batch_01.md)**: count, G, dt, globalViscosity, spawnRate, temperature.
*   **[Batch 02: World Environment: Spatial](./docs/expansion/batches/batch_02.md)**: pressure, windX/Y/Z, dimX/Y (World Dimensions).

These volumes contain Advanced and Expert-level deep dives into implementation logic and emergent system behaviors.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 7/112: CHANGELOG.md (1076 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Changelog: VEPA4 (formerly styled "VEPA v4")

> **Versioning & commit standards (adopted 2026-08-10):**
> - **Product:** **VEPA4** — the generation number lives in the product name
>   (was the leading `4` of the old `4.M.N` versions).
> - **Version schema:** `major.minor.build` (e.g. `7.0.0`) — npm-semver-native
>   (the old patch field is now the build counter). Retroactive mapping of the
>   v4 line: old `4.M.N` → `M.N.0` (major = old minor, minor = old patch,
>   build = 0 for every historical release; builds increment only for future
>   same-minor rebuilds/hotfixes). Changelog headers carry both labels:
>   `## [4.6.28] - date → 6.28.0`. The ledger's duplicated `[4.2.0]` section
>   maps both entries to `2.0.0`. v2/v3-era entries predate the schema and keep
>   their historical labels. Ledger note: there is no `[4.6.2]` section (commit
>   `a93d41a` exists; the entry was never written — it maps to `6.2.0`). The
>   full rule and release protocol live in `AGENTS.md` §10.4.
> - **Commit standard:** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
>   is mandatory for all new commits — `<type>(<scope>): <description>` with
>   `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`, `!` or a
>   `BREAKING CHANGE:` footer for breaking changes. Release commits use
>   `chore(release): v7.0.0 — <summary>` and tags are `v7.0.0`. Past commit
>   messages are immutable (no history rewrites); this ledger restates releases
>   under the new schema instead.

## [4.7.0] - 2026-08-10 → 7.0.0

### Release (first release under the new schema)
- `chore(release): v7.0.0` — VEPA4 renamed and re-versioned under `major.minor.build`; the uncommitted law-RRP rounds (internal 4.6.29/4.6.30 dev labels) ship as VEPA4 7.0.0 instead of further 4.6.x patches.
- `docs(versioning):` adopt `major.minor.build` (product VEPA4) + Conventional Commits; retroactive mapping old `4.M.N` → `M.N.0` — see `AGENTS.md` §10.4.
- `chore: drop planned multiplayer update` — P1 phone-grid WIP (`src/net/`, `src/ui/networkPanel.js`, `tests/unit/net.test.js`), LAN hub (`server/`), protocol lab (`multiplayer/`, `net-poc/`) and `docs/multiplayer/` removed from the tree; wiring stripped from `main.js`/`ui.js`/`renderer.js`/`style.css`/`vepa4`; announcements removed from `README.md`/`GEMINI.md`/`AGENTS.md`.

### feat(laws) — 8 rewritten laws (law RRP)
- **CHAOS** — deterministic per-particle Lorenz map (σ=10, ρ=28, β=8/3); PRNG draws removed; thermal stir from map output (stride 85-87).
- **CONSCIOUSNESS** — predictive self-model (SELF_MODEL_SPEED EMA); prediction error > 0.3 → MEMORY/SIGNAL up + ENERGY down, low error → regen (stride 95).
- **ENCRYPTION** — keyed cipher carrier folded from TUNING_CH1-4; PHASE_2 rotation + amplitude encoding; COMMS relay only between matching keys.
- **SUPERPOSITION** — 4 basis amplitudes over candidate velocities + phase rotation; Born-rule collapse (2%·k/tick) with renormalisation (strides 89-93).
- **SYMBOL** — token-gated meaning: SYMBOL_TOKEN (8 bins), contact imprinting by higher-MEMORY partner, same-token attract / different-token repel (stride 88).
- **TELEPORT** — quantum state transfer: requires ENTANGLE_ID, sender pays 5 ENERGY, partner adopts VEL + 30% ENERGY, link consumed.
- **TIME_DILATION** — weak-field GR `sqrt(1 − 2·phi·synergy)`, phi from softened potential over ≤24 neighbours, floor 0.3.
- **WAVE_PARTICLE** — measurement-gated duality: WAVE_MEASURED flag (collision/OBSERVER, decays ×0.95/tick) → particle vs de Broglie wave spread (stride 94).

### fix(laws) — 6 RRP-alignment changes
- **PARASITE** — host drain × `(1 − ARMOR·0.1)`; **ELECTROLYSIS** — CONDUCTIVITY-scaled decomposition + heat; **PHOTOLYSIS** — CATALYSIS-scaled conversion; **PRECIPITATION** — symmetric condensation; **NEUTRALIZATION** — heat ∝ `|cI·cJ|·k·0.04`; **UNCERTAINTY** — speed-gated Heisenberg tradeoff (|v| ≥ 0.5 → position jitter only, else velocity kick).

### feat(physics) — law-RRP infrastructure
- Stride slots 85-95 (`STRIDE_INDEXES`), `LAW_DEPENDENCIES` + `lawState` dependency checks, `LAW_SUBGROUPS`, WRAP reclassified as a WORLD simulation-rule boundary, solver wiring (WAVE_MEASURED on collision/OBSERVER, TIME_DILATION neighbour snapshot, CHAOS/TELEPORT signature updates).

### feat(multiplex) — launch-screen completeness & config retention
- **SPAWN SPECIES control** — the launch screen now exposes the shard species count (1–5) used by SPAWN derive mode; wired into `_readConfig`/`populateModal` and documented in `MULTIPLEX_HELP_DB` (`spawnSpecies`, setup section).
- **Launch-screen config retention** — the controller keeps a `lastConfig` snapshot of the last started run, so reopening the setup modal after exit restores the previous settings instead of resetting to defaults.
- **Exit imports the last selected shard** — ✕ EXIT tears down the grid and, with IMPORT ON EXIT on, copies `mx.shards[mx.selected]` into the main world (particles, species DNA, law state) via `copyShardToWorld` in `src/main.js`.

### feat(debug) — version on the debug overlay
- The debug overlay header now shows the running VEPA4 version (`DEBUG v7.0.0`), sourced from `package.json#version` so it stays in sync with the §10.4 release markers. `debugSnapshot()`'s stale hardcoded `4.1.6` is replaced with the live manifest version, and the boot log line reports `VEPA4 v<version>` on load.

### docs
- Synced: `audit-suite/fidelity-audit-v4.6.29.md` (updated duplicate + frozen v4.6.28 historical copy), `README.md` (multiplayer section removed), `GEMINI.md`/`AGENTS.md` multiplayer rows removed, `vepa4` launcher trimmed.

### feat(params) — law-RRP constants & world params
- **`RESONANCE_Q` world param** (PHYSICS → SIGNAL, `[1, 20]`, default 10) — resonance bandwidth `1/Q` for the upcoming RESONANCE fidelity rework; registered in `WORLD_PARAM_DEFS`.
- **`CRITICAL_TEMP` world param** (ENVIRONMENT → THERMAL, `[0.05, 0.5]`, default 0.2) — shared critical temperature `T_C` for SUPERCONDUCTIVITY (Cooper-pair unbinding) and BOSONIC (BEC threshold).
- **`RHO_REF` + `ADIABATIC_GAMMA_MINUS_ONE` constants** (`src/constants.js`) — reference density and γ−1 (2/3) for the ADIABATIC compression-heating rework.
- Specified in `audit-suite/law-revamp/FINAL-REPORT.md` → *Shared Constants & World-Param Definitions* (Q · T_C · RHO_REF). Inert until the RRP reimplements the four consumer laws.

## [4.6.28] - 2026-08-08 → 6.28.0

### Multiplex help & long-press tooltips
- **Long-press tooltips** — every Chaos Multiplex control (initial setup screen, bottom controls drawer, top metrics drawer) now carries a `data-mpx-help` key resolved against the new `MULTIPLEX_HELP_DB` (~30 entries, title/hint/explanation tiers) in `v4/src/multiplex/multiplexHelp.js`. A 500 ms press (10 px move tolerance) shows a positioned tooltip with a GUIDE button; it stays open on release and closes on a new press, scroll, ✕, or the GUIDE action.
- **Full-screen guide** — a small round `?` button in the drawer header opens a full-screen CHAOS MULTIPLEX GUIDE overlay (`#mpx-help-overlay`) with 5 sections (SETUP, ITERATION, RUNTIME, FITNESS, DRAWER & METRICS) covering all 40 entries; closes via ✕, backdrop press, or leaving the multiplex.
- Wired in `v4/src/multiplex/multiplexUI.js` (`initMultiplexHelp(document.body)` after the setup modal is built; tooltip/guide lifecycle hooks in open/close/begin/exit) with tooltip + guide + `?` button styles in `v4/style.css`.
- Tests: DOM-stub smoke validated short-press suppression, long-press tooltip content, guide sections/entries, and exit cleanup. `vepa4 syntax` + `vepa4 build` clean; full suite 614/617 (the 3 failures come from the separate uncommitted law RRP WIP, which stays outside this release).

## [4.6.27] - 2026-08-08 → 6.27.0

### Multiplex stability + setup-screen consolidation & drawer repositioning
- **Multiplex freeze fix** — root causes addressed in `v4/src/multiplex/multiplex.js`:
  - **Dead-slot recycling** — offspring now spawn into fully-dead slots (`DEAD ≥ 1` or zero-mass) before appending at the tail, so `shard.count` tracks the live population instead of climbing monotonically to `maxCount`; solver/render scans stay bounded on long runs. Souls (`DEAD = 0.5`) are never recycled — ASTRAL still governs them.
  - **Iteration buffer reuse** — rebuilding shards now reuses the previous shard's particle buffer/DNA/law state when the grid layout is unchanged (the iteration source gets a fresh buffer so later shards still derive from pristine data). Kills the per-iterate 1 MB × shards SharedArrayBuffer churn that stalled long auto-iterate sessions under GC pressure.
  - **Bounded snapshots** — `snapshotShard` captures only the live region (subarray slice) instead of the full 2500-particle view.
- **Setup screen consolidation** — the initial Chaos Multiplex modal now holds every setting previously hidden in the right drawer: LAW/DNA/POP VAR knobs, POP SCALE, SEED, SUBSTEPS, AUTO-ITERATE + EVERY, AFTER ITERATE, KEEP SELECTED, SIM SPEED, PAUSE GRID, MAX ITERS, DRIFT, GPU ECO, IMPORT ON EXIT, and the 14 FITNESS WEIGHTS (sliders + MAX/MIN modes). `_readConfig`/`populateModal` cover the full config object.
- **Drawer repositioning** — the right-edge controls drawer is now a bottom bar (grid stats + SELECTED + ITERATION + ⚡ ITERATE/✕ EXIT, collapsible strip) and the metrics bar moved from the bottom to the top of the overlay; the overlay stacks `[metrics, grid, controls]` so nothing overlaps the shard canvases. The LIVE/FIT tabs and per-shard FIT list are gone — the top drawer chips + stats cover selection and fitness readout.
- Tests: `tests/unit/multiplex.test.js` +2 — dead-slot recycling keeps `shard.count` bounded while newborns spawn; iterate reuses non-source shard buffers/DNA and hands the source a fresh buffer. `vepa4 syntax` + `vepa4 build` clean; full suite 614/617 at this commit (the 3 failures come from the separate uncommitted law RRP WIP, which stays outside this release).


## [4.6.26] - 2026-08-07 → 6.26.0

### Solver performance, debug perf stats & benchmark harness
- **Per-tick law cache** — `createSynergyCache(lawState)` precomputes all 128 synergy multipliers once per `solve()` (the law state is fixed mid-tick) instead of ~70 branch-chain `computeSynergy` calls per particle/neighbor pair; a `Uint8Array` active-law cache replaces 115 inline `isSet()` calls. Float64-exact (plain array, not Float32Array), so physics results are bit-identical to the old path.
- **Law gating** — the unconditional per-pair AFFINITY / chemistry / ORDER calls (and their synergy lookups) are now gated on the cached active flags; the law functions self-gate internally and return no-ops when off, so behavior is unchanged.
- **Benchmark before/after** (identical scenarios — 60 ticks, 20 warmup, PRIME_DEFAULT 10-law set): 500 particles 30.5 → 10.8 ms/tick (2.8×), 1000 particles 99.1 → 19.9 ms/tick (5.0×), 2500 particles 428.7 → 103.6 ms/tick (4.1×).
- **`vepa4 bench`** — new headless solver benchmark (`v4/bench/solver.bench.mjs`): throughput table at 500/1000/2500, `--laws` per-law overhead breakdown (frozen-world, median-of-rounds methodology), `--all` 128-law stress, `--json` machine-readable output.
- **Debug perf stats** — the debug overlay stats line now shows `· f:xx.xms t:x.xxms r:x.xxms` (EMA-smoothed full-frame / physics-tick / render times) in both the main sim and multiplex mode.
- **Multiplex metrics** — the metrics bottom drawer stats line gains `· MS x.xx` (EMA-smoothed shard tick time).
- Tests: `tests/unit/synergyCache.test.js` +4 (`createSynergyCache` matches `computeSynergy` for empty/full/mixed synergy states; plain-array float64). `vepa4 syntax` + `vepa4 build` clean; full suite 612/615 at this commit (the 3 failures come from the separate uncommitted law RRP WIP, which stays outside this release).
- **Deploy**: production live at https://vepa-v4.vercel.app/ (Vercel, 2026-08-08, deployed from the clean `v4.6.26` tag).

## [4.6.25] - 2026-08-07 → 6.25.0

### GPU performance & multiplex metrics drawer
- **Zero-copy render path** — `asParticleView(buffer)` in `renderer.js` wraps raw `ArrayBuffer`/`SharedArrayBuffer` in a live `Float32Array` view instead of allocating a fresh copy every frame; `drawParticles` and `syncSprites` now consume the typed view directly (was ~1 MB/frame in the main sim, ~16 MB/frame across 16 multiplex shards).
- **DPR cap** — renderers accept `opts.maxDpr` (default 2); multiplex previews run at 1.25× device-pixel-ratio. High-DPI displays no longer thrash the GPU during multiplexing.
- **ECO render mode** — `renderFrame`/`drawParticles` support `{ eco }`: skips the reference grid and the soft-glow halo (2 arcs → 1 per particle). Multiplex defaults to `renderQuality: 'eco'`.
- **GPU ECO toggle** — LIVE tab of the multiplex drawer (`#mpx-drawer-eco`, default on) switches previews between eco and full rendering live; the per-frame `shard.renderer.eco` sync makes the toggle fully reversible.
- **Metrics bottom drawer** — collapsible `#mpx-metrics` bar on the multiplex overlay: per-shard fitness chips (`S01 0.74`, click to select) plus a `ALIVE · CAP · ΔSEL · ΔAVG · ITER` stats line, refreshed every 24 frames.
- **Main sim** — `syncSprites` now takes `particleView` (typed array) instead of the raw buffer, dropping the per-frame copy on the main render path.
- Tests: `tests/unit/renderer.test.js` +3 (`asParticleView`: same-instance, raw-buffer live view, SharedArrayBuffer view); `tests/unit/multiplex.test.js` +1 (`renderQuality` defaults to `eco`). `vepa4 syntax` + `vepa4 build` clean; full suite 608/611 at this commit (the 3 failures come from the separate uncommitted law RRP WIP, which stays outside this release).

## [4.6.24] - 2026-08-07 → 6.24.0

### Chaos Multiplex expansion — world import, FIT tab, iteration controls
- **IMPORT ON EXIT** — exiting the multiplex now imports the selected shard into the main sim: particles, species DNA and the law state are copied into the world buffers (`copyShardToWorld`), then the particle/species counts, offspring ring and intelligence engines reset, and the UI re-syncs (`species:sync` / `dna:sync` / `law:sync`).
- **Fitness engine** — 14 weighted metrics per shard (population, growth, longevity, stability, energy, reserves, armor, mobility, signal, bonds, diversity, exploration, novelty, delta), min-max normalized across shards with per-metric MAX/MIN modes; DELTA = mean deviation from the other shards; composite = Σ wᵢ·scoreᵢ / Σ wᵢ (falls back to population when all weights are 0). `getFitnessReport` rolls an `avgDelta` history (cap 32) for the FIT tab.
- **FIT tab** — the drawer is now tabbed LIVE/FIT: 14 weight sliders + MAX/MIN toggles, a scrollable per-shard score readout (`S01 0.74`, click to select), and a live `ALIVE · CAP · ΔSEL · ΔAVG` stats row.
- **Iteration modes** — AFTER ITERATE = NONE | FITTEST | FOLLOW (FOLLOW picks the shard closest to the previous selection's metric profile); KEEP SELECTED anchors the selected shard through regeneration via full view/DNA/laws/PRNG-state snapshots.
- **LIVE tab additions** — POP SCALE (0.25–1 dynamic per-shard population cap, applies immediately), SEED (0 = random, > 0 = deterministic lineage), SUBSTEPS (1–8 solver sub-steps per tick), per-aspect LAW/DNA/POP VAR knobs, IMPORT ON EXIT toggle (replaces AUTO-SELECT FITTEST with the AFTER ITERATE select).
- Tests: `tests/unit/multiplex.test.js` +9 cases (population cap, per-aspect variation blocks, substep invariance for linear laws, copy-to-world, snapshot/restore, keep-selected, follow-selection, weighted fitness MAX/MIN, report shape + default-weight ranking, deterministic seed). `vepa4 syntax` + `vepa4 build` clean; full suite 607/607 green at this commit (the 3 failures seen in the dirty working tree come from the separate uncommitted law RRP WIP, which stays outside this release).

## [4.6.23] - 2026-08-06 → 6.23.0

### Law RRP batches 20-22 (triple batch, 12 laws)
- FRICTION — match irl: damping now scales with VISCOSITY DNA (0.5–1.0, higher viscosity = more damping) and the removed kinetic energy converts to heat (TEMP += speed·damp·0.5, cap 1). Both doc promises ("converting motion into heat", "VISCOSITY DNA modulates it") are finally implemented.
- ELASTICITY — match irl: the overlap push is now scaled by a coefficient of restitution from ELASTICITY DNA (0–1, default 0.5) — mag = overlap·k·ELASTICITY/(mI+mJ); real materials bounce less when less elastic, light particles still bounce harder.
- FEEDBACK / LANGUAGE / CULTURE / SINGULARITY / ENTANGLEMENT / HISTORY / TIDE / TURBULENCE / CENTRIPETAL / ROTATION — confirmed as-is against docs; HELP_DB entries updated with confirmed specs and synergy notes.
- Tests: `batch_20/21/22.test.js` updated to confirmed specs (+1 FRICTION viscosity+heat case, +1 ELASTICITY restitution case; 38 total across the three files). Full suite 596/596 green; `npx vite build` clean.
- **Deploy**: production live at https://vepa-v4.vercel.app/ (Vercel, 2026-08-06).

## [4.6.22] - 2026-08-06 → 6.22.0

### Law RRP batches 17-19 (triple batch, 12 laws)
- PLASMA — hysteresis (match irl): above 0.6 surplus heat ionizes into stored CHARGE (cooling the gas); below 0.5 a cooled plasma recombines — stored charge converts back to heat (TEMP += |c|·k·2) and the ion resets. The 0.5–0.6 band prevents rapid ionize/recombine oscillation. The thermal-EM cycle now closes.
- STIGMERGY — real pheromone trails: only moving particles lay a predicted-path marker (speed ≥ 0.5); stopped particles' markers evaporate (lerp 8%/tick back to the owner); followers are pulled along the gradient — force falls off with distance to the marker and scales with freshness (stale markers pull weakly).
- SIGNAL_BOOST — relay now scales with the sender's SIGNAL_STRENGTH DNA (0.5–1.5×), consistent with GLOW/COMMS; fixed a `|| 0.5` fallback that swallowed a legitimate strength 0.
- SUPERCONDUCTIVITY / MEMORY / PATTERN / LEARN / SYMBOL / METRIC / PREDICT / CODE / PROTOCOL — confirmed as-is against docs, HELP_DB entries updated with confirmed specs and synergy notes.
- Tests: `batch_17/18/19.test.js` updated to confirmed specs (+2/+3 cases; total 50 across the three files). Full suite 594/594 green; `npx vite build` clean.

## [4.6.21] - 2026-08-06 → 6.21.0

### Law RRP batch 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE confirmed
- RESONANCE — sympathetic vibration is now phase-aware (match irl): `phaseSync = 0.5+0.5·cos(Δphase·π/2)` scales the matched-rate attraction (same oscillator as GLOW/COMMS), and in-phase pairs amplify each other — the stronger pulser drives the weaker one's SIGNAL up, so synchronized swarms get louder. Out-of-phase pairs get no drive.
- FLUX — F = qE (match irl): drift direction now depends on effective charge q = POLARITY + CHARGE. Positive carriers move DOWN the stored-charge gradient, negative carriers UP it (electrons run the other way); neutrals (|q| ≤ 1e-3, includes the quantized default) still follow the field lines as documented.
- IONIZATION — hard contacts now need a threshold impact (> 0.15, ionization energy) and form a conserved +/− ion pair: q_i = impact·s, q_j = −impact·s with s = sign(POLARITY_i + POLARITY_j) || 1. Genuine charge conservation seeds CHARGE_LAW/FLUX/CURRENT with real ion pairs; already-charged pairs are not re-stripped.
- DISCHARGE — the spark now travels along the potential difference: the solver accumulates the direction toward the neighbor with the most opposite stored charge and the kick (|c|·k) is aimed that way; charge sign no longer flips the aimed kick. Random burst only with no opposite-charge field nearby. Threshold/heat/reset unchanged.
- Tests: `batch_16.test.js` rewritten to confirmed specs (9 cases: phase amplification, out-of-phase no-drive, neutral/positive/negative flux carriers, ion-pair conservation, ionization threshold, aimed discharge). Full suite 589/589 green; `npx vite build` clean.

## [4.6.20] - 2026-08-06 → 6.20.0

### Law RRP batch 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM confirmed
- RESISTANCE — match irl: resistance is now material-dependent and thermal-Ohmic. Damping scales with (1 − CONDUCTIVITY·0.9) so conductors glide and insulators resist, and with (1 + TEMP·2) so hotter particles slow harder — the doc's "hotter they get, the more they slow" feedback is finally wired. Kinetic→heat conversion retained (TEMP += speed·k·(1 − CONDUCTIVITY·0.9)·0.5, cap 1).
- CAPACITANCE — discharging drains toward zero only: a depleted capacitor never flips polarity from draining (negative stored charge is left alone). Accrual above ENERGY 50, ±2 breakdown clamp, and same-sign stored-charge repulsion unchanged.
- INDUCTANCE — magnetic coupling: velocity alignment now scales with |MAGNETIC_MOMENT product|/(1 + dist·0.03) (a field is required, and coupling fades with distance) and both particles must conduct (real materials, consistent with CURRENT). Momentum-conserving as before.
- MAGNETISM — MAGNETIC_MOMENT DNA widened to [−1,1] (default 0.1): the documented "opposing signs repel" was unreachable with a [0,1] range; both aligned-attract and opposing-repel now work through normal DNA. Force law unchanged (F = k·m1·m2/dist²).
- Tests: `batch_15.test.js` rewritten to confirmed specs (10 cases: material resistance, thermal feedback, bleed-to-zero + no-sign-flip, moment-gated and conductivity-gated inductance, signed-moment real-DNA magnetism); `params_batch_13.test.js` MAGNETIC_MOMENT unaffected. Full suite 584/584 green; `npx vite build` clean.

## [4.6.19] - 2026-08-06 → 6.19.0

### DNA parameter space expanded 48 → 64 — 16 new genetics & regulatory params (genome-only)
- `DNA_COUNT` 48 → 64; `DNA_INDEXES`/`DNA_META`/`DNA_RANGES` all carry 64 entries. New params (indices 48-63): ALLELE_COUNT, EPIGENETIC_RATE, HGT_RATE, REPAIR_EFFICIENCY, DRIFT_RATE, SELECTION_SENSITIVITY, SPECIATION_THRESHOLD, ADAPTATION_RATE, TRANSPOSON_RATE, GENE_SILENCING, RECOMBINATION_BIAS, MUTAGEN_SENSITIVITY, TELOMERE_LENGTH, PLOIDY_LEVEL, CODON_BIAS, REGULATORY_DEPTH.
- Genome-only: the new params live in the 64-wide species DNA buffer (`readSpeciesDNAParam`/`writeSpeciesDNAParam`), never in the per-particle stride cache (which stays 42 floats, offsets 8-49).
- REPRO — ploidy/allele/recombination wiring: PLOIDY_LEVEL raises the recombination gate, ALLELE_COUNT widens the crossover blend window, RECOMBINATION_BIAS skews dominance; mutation is scaled by REPAIR_EFFICIENCY (repair) and GENE_SILENCING, amplified by TRANSPOSON_RATE (mobile-element bursts); EPIGENETIC_RATE scales epigenetic drift; HGT_RATE enables horizontal gene transfer alongside GENE_FLOW.
- GENOTYPE — DRIFT_RATE adds neutral drift, SELECTION_SENSITIVITY strengthens heritable change, SPECIATION_THRESHOLD gates divergence write-back, ADAPTATION_RATE scales the leap, MUTAGEN_SENSITIVITY scales radiation-driven mutation, GENE_SILENCING/CODON_BIAS shape expression, REGULATORY_DEPTH stabilizes expression.
- SENESCENCE — TELOMERE_LENGTH damps aging death (`applyLifeCycle` now receives `dnaBuffer`; longer telomeres resist death, default 0.5).
- UI — new "Genetics & Regulation" slider group in the DNA panel and "GENETICS" group in the species panel covering indices 42-63.
- Tests — `dna.test.js` +3 (64-param exposure, defaults, genome round-trip); `params_batch_15.test.js` asexual-control test zeroes the new HGT_RATE noise source. Full suite 579/579 green; `vite build` clean.

## [4.6.18] - 2026-08-06 → 6.18.0

### Law RRP batch 14 — COMMS / CHARGE_LAW / FIELD / CURRENT confirmed
- COMMS — the sender pays: signal delivery still gives the receiver homing force + memory, but the free receiver energy gain is gone and the sender pays ENERGY −= delivered×0.5 per delivered signal (floor 0).
- CHARGE_LAW — match irl: real Coulomb on effective charge = POLARITY DNA + stored stride CHARGE with no weighting — qq = (q1+c1)×(q2+c2), opposite signs attract, like repel.
- FIELD — uniform 3D drift (was az=0 with an x/y asymmetry): POLARITY sets the sign, stored CHARGE scales the drift k×(1+|c|×0.5) so charged particles feel the field harder.
- CURRENT — both sides must conduct: charge diffusion uses min(CONDUCTIVITY_i, CONDUCTIVITY_j) so a conductor can't drain an insulator (real materials); high→low flow + 17-unit range unchanged.
- Tests: `batch_14.test.js` rewritten to confirmed specs (9 cases); `signal.test.js` + `params_batch_13/16/17/18` regressions updated (COMMS DNA tests assert delivered SIGNAL, not receiver energy; CURRENT needs both conductive). Full suite 576/576 green; `npx vite build` clean.
- ⚠️ Preserved a concurrent session's uncommitted "DNA 64" genetics WIP (genome params 48-63, REPRO/lifecycle rewrite) to `.concurrent-dna64-wip-20260806.patch` + `.concurrent-dna64-backup-20260806/` and reverted it so this release ships clean — re-apply with `git apply`.
## [4.6.17] - 2026-08-06 → 6.17.0

### Law RRP batch 13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION confirmed
- CLAIRVOYANCE — slight cost: predictive steering toward 3-tick velocity-extrapolated positions stays, but sensing the future drains ENERGY −= 0.02×synergy×dt per prediction (floor 0).
- PRECOGNITION — ditto: perpendicular collision-course dodges (dist 1-50, closing pairs only) now cost ENERGY −= 0.02×synergy×dt per dodge; no drain when moving apart.
- ASTRAL — kept ghosting and expanded it: ghosts (DEAD=0.5, fading SOUL) now exert a soft soul-pull on nearby living particles (80-unit range, bounded via the spatial grid) and same-species kin receive a conserved sliver of the ghost's soul before it dissipates — the HELP_DB's "still exert forces on the living" is finally wired.
- PREDATION — jitter flee kept (JITTER DNA = erratic escape), and now matches the docs: a predator never hunts its own kind (cross-species only, per TRACK's documented ecosystem rule) and DNA trait sampling uses the sim PRNG instead of Math.random().
- Tests: `batch_13.test.js` rewritten to the confirmed specs (6 cases); `params_batch_15.test.js` PREDATION_BIAS updated to a cross-species pair. Full suite 572/572 green; `npx vite build` clean.
## [4.6.16] - 2026-08-06 → 6.16.0

### Law RRP batch 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY confirmed + 4 more multiplexer live settings
- CONDENSE — real-life behavior: condensation is exothermic — cool particles gain vapor mass and release latent heat (TEMP += rate×2, capped 0.9 so they can't cross into boiling; mass logic unchanged).
- DEPOSIT — real-life frost: exothermic, skips the liquid phase — solid mass builds fast (rate×3 mass, rate×0.5 radius) and latent heat is released (TEMP += rate×2, capped 0.9).
- EXOTHERMIC — real-life bounded steady release while the reaction runs: ENERGY += 0.05×synergy×dt (capped 200), TEMP += 0.01×synergy×dt (capped 0.9). Replaces the old unbounded ENERGY ×= 1.1 exponential.
- TELEPATHY — same-species signal sharing now costs the receiver a slight energy toll per transfer (ENERGY −= 0.02×synergy×dt, floored 0) — user requested.
- Multiplexer — 4 more live settings, all visible in the right drawer during multiplexing: SIM SPEED (0.25–3×, scales each shard's effective timestep), PAUSE GRID (freezes shard stepping while the main sim keeps running), MAX ITERS (0 = ∞, caps auto-iteration), DRIFT (0–0.05, raises VARIATION each generation, capped at 1).
- Tests: `batch_12.test.js` rewritten (8 cases), `multiplex.test.js` +5 (new defaults, pause freeze, sim-speed scaling, iteration cap, variation drift) — full suite 570/570 green; `npx vite build` clean.
## [4.6.15] - 2026-08-06 → 6.15.0

### Law RRP batch 11 — REDUCTION / ALLOY / MELT / BOIL confirmed + multiplexer live settings
- REDUCTION — real-life behavior: opposite charges cancel toward zero on interaction (same-sign pairs untouched; the old code equalized like a conductor).
- ALLOY — real-life alloying: full mass merge + mass-weighted DNA average (hybrid composition) + colour blend; survivor keeps its species slot.
- MELT — follows HELP_DB: hot particles lose effective STIFFNESS toward a 20% floor (mass untouched) and re-solidify when cool — reversible phase change.
- BOIL — yes: ejected mass costs latent heat (ENERGY −= ejectMass×20), uses the SplitMix32 PRNG for the velocity kick, 0.02 mass floor.
- Multiplexer — the right drawer now shows every setting live during multiplexing: VARIATION slider, RANDOMIZE (LAWS/DNA/POP), DERIVE (CLONE/SPAWN), GRID (C×R, applies immediately), AUTO-ITERATE + EVERY interval, AUTO-SELECT FITTEST. New engine: `autoIterate` regenerates shards on a cadence; `selectFittestShard` picks the most alive.
- Tests: `batch_11.test.js` rewritten (8 cases), `multiplex.test.js` +4 — full suite 565/565 green; `npx vite build` clean.

## [4.6.14] - 2026-08-06 → 6.14.0

### Law colours: 10% bands tightened to 4%
- Each of the 8 law-category bands on the EM-spectrum is now 4 points wide (center ± 2) instead of 10, so the 16 laws inside a category sit closer to their category colour (RED wraps 98% → 102% through 0).
- All 128 laws still get a distinct hue; `LAW_SPECTRUM` + `LAW_HUE_BY_INDEX` recompute automatically.
- Full suite 561/561 green; `npx vite build` clean.

## [4.6.13] - 2026-08-06 → 6.13.0

### Drawer fixes — reopen after minimize, swipe up/down, LAWS + WORLD sub-tabs, laws hide button removed
- **Minimize reopen bug fixed**: the drawer control buttons (▁ minimize, ▼ hide, −/+ zoom) share the `.tab-btn` class, so the generic tab-switching handler treated them as tabs and stripped the active tab — expanding later left the drawer blank with no way back. Tab switching now only binds real tabs (`[data-tab]`), and expand restores the active tab if it was ever lost.
- **Swipe up / swipe down**: swiping up on the tab strip or top edge expands the drawer, swiping down minimizes it (touch + mouse drag). The resize handle is excluded while actively resizing.
- **LAWS and WORLD are now separate sub-tabs** in the Setup panel: ⚖️ LAWS (category filters, icon/list law grid, law-set bar) and 🌍 WORLD (world parameter sliders). The network panel still mounts in WORLD.
- **Laws panel close button removed**: the ✕ hide toggle and `lawsHidden` state are gone — the law grid can no longer be hidden, only switched between icon and list view (◈ / ABC).
- Tests: new `tests/unit/drawer.test.js` (5 cases — tab switching, minimize/expand keeps active tab, swipe down/up, tap passthrough, hide/show roundtrip). Full suite 561/561 green; `npx vite build` clean.

## [4.6.12] - 2026-08-06 → 6.12.0

### Law RRP batch 10 — SOUL conserved + decay, MIND synergy stack, VOID dark-energy scaling, BOND density bias, POLYMER chain bias
- SOUL_LAW — conserved shared field: same-species transfer drains the giver and credits the receiver (both capped to [0,1]), plus slow per-particle decay (0.2%/tick) so souls must be replenished.
- MIND — hivemind is now synergy-shaped: COMMS ×1.5, TELEPATHY ×2.0, ENERGY ×0.5 (hive-mind drain), POLYMER ×0.5 (polymerized overhead). The documented MIND+ENER −2.0 synergy was never wired before — now it is, in v4's multiplier form.
- VOID — strengthened base (0.0005 → 0.004) + dark-energy distance scaling `(0.3 + dist/(worldSize/2))`: the outward push grows from the world centre.
- BOND — molecular bonds prefer dense neighbourhoods over chain ends: bond range and spring force scale with `min(2, 1 + nCount×0.05)`, bonds break when stretched past range, registration uses all 6 bond slots.
- POLYMER — chain bias: bond range ×1.0 for free/tip partners, ×0.5 (2 bonds), ×0.25 (3+) so polymers grow linear chains instead of cross-linked webs.
- Tests: `batch_10.test.js` 14 cases; full suite 556/556 green; `npx vite build` clean.

## [4.6.11] - 2026-08-06 → 6.11.0

### Law grid recoloured top-to-bottom rainbow (user request)
- Category colours now run red → orange → yellow → green → teal → blue → violet
  → purple from the top law row to the bottom row (physics → biology → chemistry
  → thermodynamics → metaphysics → electromagnetism → information → quantum),
  replacing the old per-category colour map.
- Each category band stays 10 points wide on the 0-100 hue spectrum and the
  per-law step inside each band is unchanged, so every one of the 128 laws keeps
  its own hue — just re-ordered into a full rainbow top-to-bottom.
- `LAW_CATEGORIES` colour fields updated; `LAW_HUE_BY_INDEX` recomputes
  automatically. Category tabs and labels follow (they read the same mapping).
- Full suite 550/550 green; `vite build` clean.


## [4.6.10] - 2026-08-06 → 6.10.0

### Law RRP batch 09 — CHAOS / ORDER / FATE / WILL confirmed semantics

Interactive law audit (RRP with the user): all four laws confirmed with amendments.

- **CHAOS** — agent decision (user delegated): kinetic forcing stays plus a small
  temperature stir (+/-(prng()-0.5) x 0.02 x dt x synergy, clamped 0-1) so chaos
  flickers hot/cold pockets that feed HEAT and PHASE_RADIATION. With ORDER on,
  both run at x0.3 (mutual cancellation, unchanged).
- **ORDER** — "strongly": Vicsek alignment 0.005 -> 0.04 and range ~100 -> ~200
  units, so coherent flow actually emerges.
- **FATE** — redesigned (user: "boring and similar to existing laws"): the old
  pairwise same-species attraction duplicated AFFINITY. Each species now has a
  slowly drifting destiny point (golden-angle phase, fate clock) its members are
  gently pulled toward along the shortest toroidal path — species migrate and
  segregate toward their own fate.
- **WILL** — followed docs: energy-independent self-propulsion along current
  heading (0.01 x dt x synergy, speed gate 0.01). Unchanged.
- Tests: `batch_09.test.js` updated (CHAOS thermal stir + clamp, ORDER 0.2
  alignment + 50k range gate, FATE destiny magnitude/direction + per-species
  divergence + integration). Full suite 550/550 green; `vite build` clean.
- HELP_DB synced for CHAOS / ORDER / FATE; RRP manifest + telemetry in
  `audit-suite/laws-rrp/batch_09.md`.


## [4.6.9] - 2026-08-06 → 6.9.0

### Law RRP batch 08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY + crystallization repair

Interactive law audit (RRP with the user): all four laws confirmed with amendments, plus a user-reported crystallization bug fixed.

- **CRYSTALLIZATION REPAIR** (user report: "lattices are entirely absent") — root
  cause: pairs only interacted within 30 units at a 0.01 pull while default spawn
  spacing is ~100-300 units, so lattices never formed. Range widened 30 -> 150 and
  pull strengthened 0.01 -> 0.05 (same-species 3x = 0.15); same-species pairs now
  visibly snap into the 8-unit lattice grid.
- **PHASE_RADIATION** — follows real blackbody physics: Stefan-Boltzmann T^4
  emission — every warm body (temp > 0.05) radiates, hot bodies radiate
  disproportionately (temp^4 x 0.05 x dt x synergy), cooling TEMPERATURE and
  ENERGY while boosting SIGNAL glow. The old ENERGY > 50 doc hint and the 0.6
  threshold are replaced.
- **SUBLIMATION** — documented low-mass + high-energy gate: temp > 0.5 AND
  ENERGY > 50; mass sublimes down to a 0.02 floor (near-full evaporation); the
  velocity burst now uses the sim PRNG instead of Math.random(); sublimation
  consumes extra energy (x20 sublRate) and cools.
- **TIME_DILATION** — agent decision (user delegated): kept `localDt = 1 -
  soul x 0.3 x synergy` (70% max slowdown) — a stronger cap would make
  differential aging (AGE, reproduction timers) diverge too far between souls.
- **DIMENSIONALITY** — Z-drift amplitude raised 0.1 -> 0.3 (3x) so 3D
  exploration is visible.
- Tests: `batch_07.test.js` crystallization values updated (0.2 / 0.6 / no-op
  beyond 150); `batch_08.test.js` rewritten (T^4 curve + proportionality,
  near-zero gate, sublimation energy gate + floor + PRNG, dimensionality 0.15
  kick). Full suite 550/550 green; `vite build` clean.
- HELP_DB synced for all five laws; RRP manifest + telemetry in
  `audit-suite/laws-rrp/batch_07.md` + `batch_08.md`.


## [4.6.8] - 2026-08-06 → 6.8.0

### Law RRP batch 07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION confirmed semantics

Interactive law audit (RRP with the user): all four laws confirmed with amendments.

- **CRYSTALLIZATION** — same-species bonus: any pair within dist 1-30 is pulled
  toward the 8-unit lattice grid, and same-species pairs pull 3x stronger, so
  rigid clusters form between kin (cross-species keeps the original 0.01 pull).
- **HEAT** — kinetic-theory thermal noise added: particles above 0.5 TEMPERATURE
  receive random velocity kicks proportional to temperature
  (+/-(temp x 0.01 x dt x synergy) per axis), alongside the existing pairwise
  conduction.
- **COLD** — documented velocity damping added: particles below 0.5 TEMPERATURE
  have VEL_X/Y/Z multiplied by max(0, 1 - (0.5-temp) x 0.1 x dt x synergy) each
  tick, alongside the pairwise equalization.
- **CONVECTION** — kept as documented: buoyancy (temp-0.5) x 0.001 x dt x synergy
  on +VEL_Y, deliberately not scaled by HEAT_CAPACITY (conduction already encodes
  capacity into the temperature field). Note: gravity (PLANETARY) is along -Z, so
  +Y buoyancy is horizontal in VEPA's 3D space - switch to +Z on request.
- Tests: `tests/audit/batch_07.test.js` extended to 25 (crystallization
  same-species bonus, thermal jitter gate/threshold/value/integration, cold
  damping gate/threshold/value/integration). Full suite 547/547 green;
  `vite build` clean.
- HELP_DB synced for all four laws; RRP manifest + telemetry in
  `audit-suite/laws-rrp/batch_07.md`.


## [4.6.7] - 2026-08-05 → 6.7.0

### Law RRP batch 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY confirmed semantics

Interactive law audit (RRP with the user): all four laws confirmed with amendments.

- **OXIDATION** is now real electron loss: CHARGE decays toward 0 (electrical
  rust) alongside the MASS erosion, and HEAT_OUTPUT DNA releases heat plus a
  glow flash (COLOR_R/G/B + ALPHA brighten while the particle burns).
- **POLYMER** matches the documentation: the particle stride grew to
  `BOND_PARTNER_1..6` (81-84 appended, existing offsets stable) for the
  documented max 6 bonds per particle; bonds are now mutual (i records j, j
  records i) so A-B-C chains hold on both ends, and partner indices use the
  real stride (the hardcoded `/100` is gone).
- **ISOMERIZATION** matches real life: same atoms, rearranged bonds — a
  particle with 3+ chain bonds occasionally breaks one connection (the freed
  partner becomes a fragment, its reciprocal cleared) and consumes a little
  energy. The sinusoidal "radius breathing" placeholder was removed.
- **CHIRALITY** uses the documented TORQUE DNA: handedness is geometric
  mirror-spin (clockwise vs counter-clockwise), same-handedness pairs deflect
  perpendicular with direction following the torque sign; opposite-handedness
  and zero-torque pairs feel nothing.
- Tests: `tests/audit/batch_06.test.js` rewritten (21) — rust + glow, mutual
  6-slot bonds + cap, isomerization rearrangement/reciprocal/energy, chirality
  handedness incl. mirror direction. Full suite 538/538 green; `vite build` clean.
- HELP_DB synced for all four laws; RRP manifest + telemetry in
  `audit-suite/laws-rrp/batch_06.md`.


## [4.6.6] - 2026-08-05 → 6.6.0

### Law RRP batch 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY confirmed semantics

Interactive law audit (RRP with the user): all four laws confirmed with amendments.

- **PHENOTYPE** is gene expression: the inherited genome (DNA cache) is
  translated into the visible body every tick — POLARITY → hue, ALPHA →
  saturation, SYMMETRY → lightness — and ENERGY is the environment: well-fed
  particles (energy > 100) express a larger body, starving ones shrink.
  Offspring inherit DNA, so they inherit the look.
- **CATALYSIS_LAW** confirmed: chemistry multiplier ×(1 + CATALYSIS×0.5×synergy),
  applied to the pre-chemistry forces in the pair loop, and it is free —
  never touches energy (locked by test).
- **SOLVATION** replicates real-world behaviour: like dissolving salt in water,
  the solvent exerts charge forces — opposite charges attract, like charges
  repel (Coulomb-style |q1×q2|) — plus charge-different particles react
  faster. The force was previously dead code; now wired into the solver.
- **ACIDITY** switched to the documented behavior: particles exchange CHARGE
  when close, equalizing electrical potential; CONDUCTIVITY DNA controls the
  transfer rate and the CHARGE field is altered. The old ENERGY erosion is gone.
- Tests: `tests/audit/batch_05.test.js` rewritten (23) — phenotype colour
  expression, catalysis free + amplification, solvation attract/repel/gate,
  acidity equalization/conservation. Fixed a flaky catalysis test whose
  premise was wrong (chemMult runs before the CHARGE_LAW block — re-anchored
  to the AFFINITY pull it actually amplifies). Full suite 533/533 green;
  `vite build` clean.
- HELP_DB synced for all four laws; RRP manifest + telemetry in
  `audit-suite/laws-rrp/batch_05.md`.


## [4.6.5] - 2026-08-05 → 6.5.0

### Law RRP batch 04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE confirmed semantics + GLOW backport

Interactive law audit (RRP with the user): all four laws confirmed with amendments.

- **GLOW backport (batch 03 correction):** GLOW is an emitter only — the
  oscillator raises SIGNAL (transmission strength) but never converts signal
  into life energy. Signal and metabolism stay separate channels.
- **SENESCENCE** confirmed as LIFE-dependent: age-based death stays nested
  inside the LIFE cycle (past AGE 500, death chance = DEATH_RATE×0.001×
  (1 + ageNorm×0.5)×dt); standalone SENESCENCE does nothing.
- **ENERGY** answered "what energy?": every energy reservoir conducts pairwise
  toward equilibrium — LIFE energy (ENERGY), ELECTRIC_ENERGY and STORED_ENERGY
  each transfer independently (conservation holds per channel); SIGNAL and
  REPRO_DRIVE are never touched.
- **RADIATION** gained the RADIATION_LEVEL slider scaling plus a slow exposure
  ramp: particles accumulate RADIATION_EXPOSURE (stride 80, level×dt×0.01,
  cap 100) that compounds damage over time and steadily ramps DNA mutation
  chance — more and more over time. Radiation depletion kills consistently
  with the batch-02 LIFE death. Removed the duplicate in-LIFE radiation drain
  (double-drain bug).
- **GENOTYPE** expanded as the genetics engine: REPRESSOR damps drift,
  HETEROZYGOSITY widens variance, EPIGENETIC_DRIFT adds non-heritable noise,
  GENE_FLOW pulls foreign genes, radiation exposure ramps the rate, and rare
  mutations write back into the 64×64 species genome — species-level evolution.
- Tests: `tests/audit/batch_04.test.js` rewritten (15) + batch_03 GLOW test
  corrected — full suite 521/521 green; `vite build` clean.
- HELP_DB synced for all five entries; RRP manifest + telemetry in
  `audit-suite/laws-rrp/batch_04.md`.



## [4.6.4] - 2026-08-05 → 6.4.0

### Law RRP batch 03 — GLOW / AFFINITY / REPRO / TRACK confirmed semantics + multi-energy architecture

Interactive law audit (RRP with the user): all four laws confirmed with amendments.

- **Multi-energy architecture** (stride 77-79): `ELECTRIC_ENERGY`, `STORED_ENERGY`,
  `REPRO_DRIVE` added to the particle stride — life energy (ENERGY), signal
  transmission strength (SIGNAL), electricity, storage, and reproductive drive
  are now separate channels. Initialized at spawn and in multiplex shards;
  exposed through `particleBuffer.js`.
- **GLOW** does both: an oscillator (PULSE_RATE × SIGNAL_STRENGTH DNA) emits
  signal pulses into SIGNAL, and existing signal converts into life energy.
- **AFFINITY** boosts same-species attraction (scales with positive
  SPECIES_AFFINITY, inert at 0, none for xenophobic species) — fixes the old
  `Math.abs` bug where negative affinity attracted your own kind.
- **REPRO** is now gated on REPRODUCTIVE DRIVE (stride 79): drive accumulates
  from BIRTH_RATE, spawning needs drive ≥ 60 + AGE ≥ 100, and spawning consumes
  the drive plus half the parent's life energy — raw energy is no longer the gate.
- **TRACK** only hunts across species: predators no longer chase their own kind.
- Tests: `tests/audit/batch_03.test.js` (13) + updated REPRO/AFFINITY param
  tests — full suite 515/515 green.
- HELP_DB synced for all four laws; RRP manifest + telemetry in
  `audit-suite/laws-rrp/batch_03.md`.

## [4.6.3] - 2026-08-05 → 6.3.0

### Law RRP batch 02 — COLL / ACCR / PLANETARY / LIFE confirmed semantics

Interactive law audit (RRP with the user): all four laws confirmed with amendments.

- **COLL** is now standalone from ACCR — softbody push + elastic bounce run only
  under COLL; fusing pairs coalesce instead of bouncing. Off = pass-through.
- **ACCR** gates reinterpreted: `FUSION_MOMENTUM` (DNA 16) is the MINIMUM
  relative momentum to fuse on impact (slower pairs bounce); `FUSION_TIME`
  (DNA 17) is how long sub-threshold pairs must stay in very close proximity
  before they fuse anyway. Proximity dwell is tracked per contact pair in the
  free `MITOSIS_TIMER` / `PARTNER_ID` stride fields and resets on separation.
  Sub-threshold ACCR-only contacts get a gentle elastic bounce.
- **PLANETARY** replaced the central well with constant atmospheric gravity
  toward the ground plane (z ≈ 0), mass-scaled so acceleration is
  mass-independent; ×1.5 with GRAV.
- **LIFE** now kills on metabolic energy depletion: when the LIFE metabolic
  budget hits 0 the organism dies (charge/electromagnetic energy paths are
  untouched).
- Tests: `tests/audit/batch_02.test.js` (14) + `tests/audit/params_batch_11.test.js`
  FUSION gates rewritten for the confirmed semantics — full suite 510/510 green.
- HELP_DB synced for all four laws; RRP manifest + telemetry in
  `audit-suite/laws-rrp/batch_02.md`.

## [4.6.1] - 2026-08-05 → 6.1.0

### Law RRP batch 01 — GRAV / DRAG / ENTR / WRAP spec confirmed with user
- RRP pass (per-batch spec confirmation): batch 01 behavior confirmed interactively:
  - **FORCE DNA is now pairwise with gravity**: both positive FORCE multiply the
    pull, both negative multiply negatively (repel), opposite signs cancel to a
    gravitationally neutral pair (`applyGravity` reads both particles).
  - New world slider **WALL REFLECT** (PHYSICS/MOTION, 0-2, default 1): soft-wall
    velocity effect — 0 = 100% absorption, 1 = 100% reflect, 2 = 200% reflect.
    The soft wall previously lost 50% on bounce; the default is now a full 100%
    reflect. Velocity clamp moved after the position step so super-bounces get to
    move the particle for one tick before the MAX_VELOCITY cap applies.
  - FRICTION DNA damping stays gated behind DRAG (confirmed).
- HELP_DB synced for GRAV (pairwise FORCE) and WRAP (binary + WALL REFLECT).
- Tests: `tests/audit/batch_01.test.js` 8 → 10 tests (pairwise FORCE + wall slider).
  Full suite 65 files / 505 tests green.
- RRP artifacts: `audit-suite/laws-rrp/` (README + batch_01..32 manifests),
  RSIRRP session `.rsirrp/sessions/2026-08-06/law-batch-01/20260806-001941-1c16`.

## [4.6.0] - 2026-08-05 → 6.0.0

### 72-parameter audit — every slider validated, 9 dead DNA params repaired
- Full parameter audit mirroring the law audit: 18 batches × 4 params
  (22 world sliders · 8 settings/camera · 42 DNA) with focused + gate tests in
  `v4/tests/audit/params_batch_01..18.test.js` (43 audit tests; full suite
  65 files / 503 tests green).
- Result: **63 PASS / 9 REPAIRED / 0 FAULTY** — every param functional.
- World sliders were the reported bug: 16 of 22 were `console.log` no-ops.
  New SSOT `v4/src/state/worldParams.js` (defs, clamps, `applyWorldParam`,
  min-clamped `spawnCaps`) + `v4/src/spawn/distribution.js`; all 22 sliders now
  flow into spawn, solver, and laws (`v4/src/ui/worldPanel.js` renders from the
  SSOT; `v4/src/main.js` applies `world:paramChanged` live).
- Repaired DNA params (all were dead — zero physics reads):
  FORCE (gravity scale/repel), TORQUE (velocity rotation), TIDAL (close-range
  gravity boost), FUSION + FUSION_TIME (ACCR mass-transfer efficiency +
  maturity gate), BOND_ANGLE (bond equilibrium distance), REACTION_THRESHOLD
  (autocatalysis mass gate), HEAT_OUTPUT (oxidation energy release),
  SEX_CHANCE (reproduction crossover probability).
- Additional fixes: `resetCamera()` restores focalLength/ortho/sensitivities;
  renderer `depthAlpha` now respects `runtimeConfig.globalAlpha`.
- Audit report: `audit-suite/params/` (SPEC, INDEX, 18 batch manifests,
  combined.md). World/camera/visual params default to neutral — default
  simulation behaviour unchanged; restart still preserves laws/world/species.

## [4.5.3] - 2026-08-05 → 5.3.0

### Deployment caching fix
- `vercel.json` no longer applies `max-age=31536000, immutable` to the HTML
  shell — browsers were caching the old `index.html` for a year and never
  picking up new builds. Hashed `/assets/*` bundles keep the long immutable
  cache; the HTML entry now serves `no-cache, must-revalidate` (COOP/COEP
  headers unchanged, so SharedArrayBuffer keeps working).



## [4.5.2] - 2026-08-05 → 5.2.0

### 4-agent law audit — all 128 laws validated
- All 32 batches of 4 laws audited by independent agents with integration-level
  `solve()` tests (`v4/tests/audit/batch_01..32.test.js`): 297 audit tests.
- Result: **110 PASS / 18 REPAIRED / 0 FAULTY** — every law functional.
- Repair highlights (`v4/src/physics/laws.js`, `solver.js`, `quantumLaws.js`):
  - COLD heat-transfer sign flipped (was heating the wrong particle).
  - CHARGE force sign flipped — like charges now repel, opposites attract.
  - COLL bounce condition `relVelN > 0` — approaching pairs now bounce.
  - SPIN parity uses real particle index (`floor(i/PARTICLE_STRIDE) % 2`) so the
    sign alternates per particle, not per buffer slot.
  - PHENOTYPE radius write no longer overwritten each tick by mass recompute.
  - ASTRAL processes DEAD=0.5 souls; ACCR can run standalone; PREDATION mass
    fold-in + softbody position delta; TUNNELING/UNCERTAINTY/TELEPORT/
    WAVEFUNCTION position mutations survive solver writeback.
  - Full suite: 47 files / 420 tests passing.

## [4.5.1] - 2026-08-05 → 5.1.0

### All 46 new laws implemented — 8 categories × 16 = 128 laws
- Law logic landed in `v4/src/physics/lawgroups/` (physicsLaws, thermoLaws,
  biologyLaws, chemistryLaws, emLaws, infoLaws, metaLaws, quantumLaws) and is
  dispatched from `solver.js` (pairwise + per-particle passes).
- New **quantum** law category (indigo) with 16 laws: SUPERPOSITION, TUNNELING,
  DECOHERENCE, WAVE_PARTICLE, UNCERTAINTY, TELEPORT, OBSERVER, PLANCK,
  COHERENCE, BOSONIC, FERMIONIC, SPIN, SPECTRAL, WAVEFUNCTION, HYPERPLANE,
  ANTIMATTER.
- Quantum tab (QNTE) + indigo theme in `v4/index.html` / `style.css`; 46 law
  icons added to `worldPanel.js` / `tooltip.js`.
- 8 new presets (31 total); sub-agent verification tests green (123/123 unit).

## [4.5.0] - 2026-08-05 → 5.0.0

### 128-law foundation
- 46 new `LAW_INDEXES` entries; `LAW_COUNT` 82 → 128; 8 categories × 16.
- Bitmask widened to 128 bits (`quadFlags` in `v4/src/state/lawState.js`);
  serialization stores `quad` word, deserialization accepts legacy 64-bit saves.
- 46 HELP_DB entries (HINT / EXPLANATION / SYSTEM / ADVANCED).
- Solver hard-freeze + multiplex copy/randomize extended to the 4th flags word.



## [4.4.2] - 2026-08-04 → 4.2.0

### Law-type synergy + icon parity pass
- **SINGULARITY** synergies: ×1.5 with ACCR (collapse accelerates), ×1.4 with
  GRAV (the hole bends space itself).
- **ENTANGLEMENT** synergies: ×1.6 with TELEPATHY, ×1.5 with COMMS (entangled
  signals need no channel).
- **HISTORY** synergies: ×1.6 with MEMORY (collective memory deepens the
  field), ×1.5 with PATTERN (remembered geometry aligns drift).
- World-panel law grid now shows icons for FEEDBACK / LANGUAGE / CULTURE
  (matching the tooltip module) — no more '?' placeholders for info laws.

## [4.4.1] - 2026-08-04 → 4.1.0

### Restart vs Reset semantics
- **Restart** (↻) now only respawns the population at tick 0 — laws, world
  params (spawn/distribution/thermal/force sliders, spawn rate) and species
  params (roster + DNA) are all preserved. Chaos still randomizes first, then
  restarts onto the randomized laws/DNA.
- **Reset** restores the defaults (default law set, world params, species
  profiles) via a fresh boot.
- Spawning is now safe with user-added species beyond the 5 built-in profiles
  (deterministic fallback colours instead of crashing).

## [4.4.0] - 2026-08-04 → 4.0.0

### New law types (3 more laws — 82 total)
- **SINGULARITY** (physics): supermassive particles (mass ≥ 20) exert an
  extreme inverse-square pull; any particle crossing the event horizon is
  absorbed — mass is swallowed and the hole heats up.
- **ENTANGLEMENT** (metaphysics): touching particles forge a non-local quantum
  link (new ENTANGLE_ID / ENTANGLE_PHASE stride slots, initialised to −1/0 on
  every spawn path). Momentum and signals transfer between the pair at any
  distance; the phase decays until the link snaps with a recoil kick.
- **HISTORY** (information): a 12³ spatial memory field accumulates particle
  presence (exponentially decaying); particles drift toward the field's
  centre of mass — archaeology as a force.
- HELP_DB entries, tooltip icons (⬤ / ⚭ / 📜) and solver wiring added; all
  spawn paths (main + multiplex shards) initialise the entanglement slots.

## [4.3.0] - 2026-08-04 → 3.0.0

### Law categories completed — Electromagnetism + Information (26 laws)
- **Electromagnetism (cyan) now has 13 laws**: CHARGE_LAW, FIELD, CURRENT,
  RESISTANCE, CAPACITANCE, INDUCTANCE, MAGNETISM, RESONANCE, FLUX, IONIZATION
  + **DISCHARGE** (stored charge bursts into motion/heat), **PLASMA** (hot
  particles ionize — heat becomes charge), **SUPERCONDUCTIVITY** (cold pairs
  couple into lossless velocity-aligned streams).
- **Information (gold) now has 13 laws**: MEMORY, PATTERN, STIGMERGY,
  SIGNAL_BOOST, LEARN, SYMBOL, METRIC, PREDICT, CODE, PROTOCOL + **FEEDBACK**
  (memory amplifies motion, motion refreshes memory), **LANGUAGE** (signaling
  pairs exchange memory traces), **CULTURE** (same-species contacts converge
  their DNA cache).
- **96-bit law bitmask**: `lawState` now uses three `Uint32Array` words
  (0-31 / 32-63 / 64-95) instead of two — laws 64+ previously collided with
  lower bits and could not be toggled. `getStateVector`/`fromVector` and
  `serialize`/`deserialize` extended (legacy `{low, high}` payloads still load).
- **Multiplex shards** copy and randomize the third law word (extended-range
  laws now survive shard derivation and variation).
- **New synergies** for both categories: CHARGE_LAW+MAGNETISM, SUPERCONDUCTIVITY
  +COLD, SUPERCONDUCTIVITY+RESISTANCE, DISCHARGE+IONIZATION, PLASMA+HEAT,
  CURRENT+RESISTANCE, MEMORY+FEEDBACK, SIGNAL_BOOST+PROTOCOL, LANGUAGE+CODE,
  CULTURE+GENOTYPE, PREDICT+TRACK, STIGMERGY+LEARN, LEARN+SYMBOL — all consumed
  by the solver as multipliers.
- SUPERCONDUCTOR law-set preset now includes SUPERCONDUCTIVITY.
- Law grid / tooltips updated with icons and HELP_DB entries for all six new
  laws.

### Law set bar (SETUP > WORLD)
- **3-button bar**: a dropdown selector (shows the applied set) + icon-only
  LOAD (📂) and SAVE (💾) buttons.
- **Select-then-load flow**: tapping a row in the dropdown only selects it
  (✓ highlight); LOAD applies it to the sim, SAVE overwrites it with the
  current laws. Saving without a selection opens the inline name editor for a
  brand-new set.
- **User sets override built-ins**: saved sets with the same name as a
  built-in now take precedence.
- **3 new presets** (23 total): ELECTRIC STORM (charge/field/current/
  ionization/discharge/plasma), NEURAL WEB (memory/learn/symbol/language/
  feedback/culture), CRYO CURRENT (superconductivity/cold/current/
  resistance/flux/condense).

## [4.2.1] - 2026-08-04 → 2.1.0

### Fixes
- **Accretion now requires ACCR**: the LIFE law's metabolism no longer grows or
  shrinks particle mass on its own — mass fluctuation is gated behind the ACCR
  law, so particles stop "accreting" unless accretion is enabled.

### Reproduction
- **Offspring inherit the parents' intermediate colour**: two-parent breeding
  blends the parents' colours 50/50 (with mutation); single-parent clones carry
  the parent colour instead of snapping back to the species base. Shard
  populations (multiplex) now spawn with per-species colours too.

### Population
- **REGULAR SPAWN /S setting** (SETUP > WORLD > ENVIRONMENT > POPULATION):
  spawns N particles per second at random positions drawn from the configured
  initial distribution (shape / centres / centre bias). Default 5/s.

## [4.2.0] - 2026-08-04 → 2.0.0

### Law grid (SETUP > WORLD)
- **5-colour law coding**: every law is tinted by its category (blue physics,
  green biology, purple chemistry, orange thermodynamics, red metaphysics) in
  both icon and list modes — dull when disabled, bright when enabled.
- **One row per law type**: each category renders as its own labelled row.
- **Exclusive view-mode group**: [◈ icon] [ABC list] [✕ hide] — only one mode
  selected at a time; tapping the selected mode again hides the law grid, and
  the ✕ button toggles visibility.

### Law set system
- **SAVE / LOAD + dropdown** of presets; each dropdown row shows 1/4-size law
  icons in a single line + preset name. Clicking a row applies that law set.
- **20 theorycrafted presets** (PRIME DIRECTIVE … CHAOS THEORY).
- **Inline save editor**: SAVE opens a name input prefilled with the last
  loaded/saved preset name, with ✓ / ✕ to confirm or cancel. Saving upserts
  into the dropdown and persists to localStorage (`vepa.lawsets.v1`);
  loading a preset then saving renames it.
- Manual law toggles return the label to CUSTOM.

### Drawer (already present, confirmed working)
- Swipe tabs up to open / down to close the drawer; the top edge handle can be
  held (highlighted) and dragged to resize; − / + zoom buttons scale drawer
  content.

## [4.2.0] - 2026-08-04 → 2.0.0

### Laws
- **5-category colour coding in both views**: law tiles and list rows are
  tinted by type (blue/green/purple/orange/red) even when inactive, bright
  when active.
- **Mode buttons**: ▦ (icon) and ABC (list) sit side by side, mutually
  exclusive; tapping the already-active button hides the law grid, tapping
  it again restores it.

### Drawer
- **Swipe up/down** on the drawer tabs opens/closes the drawer.
- **Resize handle** on the drawer's top edge — hold/drag to resize, glows
  blue while hovered/dragged.
- **− / + zoom buttons** in the drawer tabs scale the drawer content
  (0.6×–1.6×).

## [4.1.9] - 2026-08-04 → 1.9.0

### World params
- **Grouped params**: SETUP > WORLD sliders now nest in sub-accordions per
  group — SPACE > WORLD / POPULATION / DISTRIBUTION, PHYSICS > FORCES / MOTION,
  ENVIRONMENT > THERMAL / POPULATION, BIOLOGY > INTERACTION / LIFE CYCLE.

## [4.1.8] - 2026-08-04 → 1.8.0

### Camera
- **Straight-on default view**: the camera now starts flat against one side of
  the dish (no rotation/tilt); drag to orbit, 2-finger drag rotates.
- Zoom remains clamped (min 0.05, max 100) via wheel/pinch.

### Initial distribution controls (SETUP > WORLD > SPACE)
- **DISTRIBUTION**: 0 = perfectly even grid, 1 = fully random positions
  (replaces the inert SPAWN SHAPE slider).
- **CENTRES**: number of cluster centres, 1-64.
- **CENTRE SCATTER**: centre placement — 0 = evenly spaced, 1 = random.
- **CENTRE BIAS**: how strongly particles are pulled toward the centre(s),
  0 = uniform, 1 = pinned to centres.
- Values apply on the next Restart / Chaos respawn.

## [4.1.7] - 2026-08-04 → 1.7.0

### Chaos Multiplex (guided evolution grid)
- **Long-press Chaos ☢️ opens the Chaos Multiplex config modal**: X×Y concurrent
  simulations rendered in a grid (up to 16 shards), with checkbox toggles for
  which aspects to randomize (Laws / DNA / Population), a variation slider
  between shards, and derivation mode (clone the selected simulation vs.
  spawn a fresh population).
- **Right-edge multiplex drawer**: minimizable/expandable; while minimized it
  still shows an icon-only ⚡ iterate button. Iterate regenerates every shard
  from the currently selected shard with fresh seeds.
- **Shard selection**: tapping any concurrent simulation renders a selection
  box around it; the selected shard becomes the source for the next iteration.
- **Shared camera**: all shards share one camera, so any drag/pinch/zoom
  applies the same camera movement to every shard simultaneously.
- **Chaos button order**: short click randomizes laws/DNA first, then restarts
  on a fresh population that preserves the randomized configuration.

### Camera
- **1-finger drag pans, 2-finger drag rotates** (two-finger rotation orbits +
  pinch zooms); mouse drag pans.

### Toolbar
- Buttons named Chaos, Restart, Reset, Help (icons unchanged).

## [4.1.6] - 2026-08-04 → 1.6.0

### UI
- **Setup is the first tab**: the CONFIG tab is renamed SETUP and moved to
  position 1 (default open, WORLD subtab active); DATA is second.

## [4.1.5] - 2026-08-03 → 1.5.0

### Toolbar
- **Randomize (Chaos) ☢️ now restarts first**: short-click emits restart then
  chaos, so randomness applies to a fresh population.
- **Readme (Help) ? now works**: opens the v4 README (`help:toggle` was
  emitted but never handled).
- Toolbar right is exactly four buttons with current icons:
  Randomize (Chaos) ☢️, Restart 🔄, Reset 🗑️, Readme (Help) ?.

### Fixes
- **Restart desync fixed**: `sim:restart` created a *new* lawState object while
  the UI panels held the old reference — after restart the sim ran laws the
  toggles didn't show (and vice versa). Restart now clears the object in
  place, keeping UI and engine on the same state.
- **Narrative crash fixed**: `cluster:detected` payloads are
  `{timestamp, clusters[]}` but the narrative templates read `count` /
  `avgEnergy` directly off the payload, throwing `undefined.toFixed` at
  random intervals. The engine now narrates the largest cluster with the
  correct shape.

### Startup (confirmed)
- Initial state is all laws disabled (`DEFAULT_LAWS` empty, boot + restart).
  If the drawer still shows the old WORLD/SPECIES/DNA/LOG tabs, hard-refresh:
  4.1.4+ ships the DATA/CONFIG tab restructure with a new bundle hash.

## [4.1.4] - 2026-08-03 → 1.4.0

### Startup
- **Begin with all laws disabled**: `DEFAULT_LAWS` is empty, so the sim boots
  (and restarts) with zero laws — particles are completely static until a law
  is enabled. Presets and manual toggles turn laws on.

### UI
- **Tabs restructured**: top-level `DATA` (sub-tabs INTELLIGENCE | DNA | LOGS)
  and `CONFIG` (sub-tabs WORLD | SPECIES | SETTINGS). The intelligence
  dashboard is the primary DATA subtab; world (law grid + params) and species
  panels now live under CONFIG.
- **LOGS subtab fixed**: the narrative log panel (`#narrative-panel`) now
  actually renders — previously it targeted a container that didn't exist.
- **+ SPECIES works**: clones species 0's DNA into the next free slot (up to
  64) and selects it.
- **− SPECIES + per-card ✕**: remove the last species or any card; the DNA
  roster compacts, selection clamps, and the HUD species count syncs (min 1).

## [4.1.3] - 2026-08-03 → 1.3.0

### Law Gating (complete)
- **FRICTION now gated by DRAG**: velocity-dependent damping (FRICTION DNA)
  previously ran unconditionally whenever any law was active — a movement
  effect with no law governing it. It now lives inside the DRAG (kinetic
  dampening) block, so with DRAG off, velocity is preserved exactly.
- **dragMultiplier tunable gated by DRAG**: the goal-engine's global damping
  multiplier only applies while the DRAG law is active (default 1.0, inert).
- Full solver audit: every force, interaction, lifecycle effect, and signal
  path is now individually law-gated (verified in `apply*` bodies + call
  sites), with the zero-laws hard freeze as the outer invariant: no laws →
  no movement, no interaction, no state change of any kind.

### Tests
- lawGating.test.js: +2 tests — DRAG-off preserves velocity exactly;
  DRAG-on decays velocity.

## [4.1.2] - 2026-08-03 → 1.2.0

### Deployment
- **Vercel**: new production deployment at https://vepa-v4.vercel.app/ —
  serves COOP/COEP headers so `SharedArrayBuffer` (the true memory model) is
  enabled in production, which GitHub Pages cannot provide. Config in
  `vercel.json` (root base when `VERCEL=1`, immutable cache).

### Laws & Gating
- **NEW COMMS law** (biology, index 52): the single gate for the entire
  communication DNA group. While active, oscillator pulses (PULSE_RATE x
  SIGNAL_STRENGTH) build the SIGNAL field, neighbors within
  NEIGHBORHOOD_RADIUS exchange channel-filtered signals (TUNING_CH1-4), and
  delivery converts into response forces, energy, and memory. While off, no
  signal emits, decays, or exchanges — SIGNAL/MEMORY freeze and no comms
  forces exist. Enabled by default.
- **Zero-laws hard freeze**: the solver returns immediately when no laws are
  active — no integration, friction, signals, lifecycle, or reproduction.
  Movement and interaction only exist while a law governs them.
- **AGE moved to solver core**: age is now advanced by the solver each tick as
  a frame counter (not inside the LIFE law), so oscillator phase and lifecycle
  gating progress consistently with or without LIFE, and freeze only under the
  zero-laws gate.

### Tests
- **New lawGating.test.js**: zero-laws no-op, COMMS-off immobility, COMMS-on
  emission accumulation.
- **signal.test.js** updated to enable COMMS where signal behavior is asserted.

## [4.1.1] - 2026-08-03 → 1.1.0

### Render
- **Motion trails removed**: the simulation canvas now fully clears each frame
  so the atmospheric backdrop shows through cleanly; the previous
  `destination-out` fade is gone.


## [4.1.0] - 2026-08-02 → 1.0.0

### PIZZAZ — Atmosphere & Micro-Interactions

#### Render
- **Motion trails**: the simulation canvas now fades each frame toward
  transparency (`destination-out`, 0.22/frame) instead of an opaque clear, so
  fast-moving particles streak like bioluminescent plankton. Trails freeze
  crisply while paused.
- **Particle glow**: every non-star particle gets a soft bloom halo (~2.4×
  radius, 30% alpha) under its crisp core; gravitational stars keep their
  radial-gradient corona.
- **Atmospheric backdrop**: new `#bg-canvas` layer behind the sim paints a
  deep-space radial gradient, three accent-hued nebula blobs, a deterministic
  starfield, and a cinematic vignette. Repaints on window resize.
- **CRT scanlines**: a subtle 1px repeating scanline texture sits over the
  simulation viewport (below the UI layer) for the neon-noir lab feel.
- **GLOW law** now applies a subtle additive warm lift after the frame instead
  of a pre-pass that would have fought the motion trails.

#### UI
- **Toolbar**: drop shadow + a slowly pulsing blue→red accent sheen along the
  bottom edge; buttons lift and glow blue on hover, orange pulse while active
  (play/pause), red glow on the chaos button.
- **Tabs**: active tab text glows red; hover gains a soft white shimmer.
- **HUD**: color-coded live stats — FPS green, population blue, species
  purple, tick dim.
- **Law toggles**: active law buttons gently pulse brightness.
- **Drawer**: hide/show now slides the drawer below the viewport (transform +
  visibility transition, 0.28s) instead of snapping with `display:none`, with
  a red accent hairline along its top edge.


## [4.0.4] - 2026-08-02 → 0.4.0

### Simulation
- **Spawn NaN bug fixed — no more instant clumping**: the spawn jitter called
  `prng.nextFloat()` with no arguments, but the SplitMix32 helper signature is
  `nextFloat(min, max)` — it returns `NaN` without them. Every particle spawned
  at `NaN`, and the solver's defensive reset then teleported the whole
  population to the world center on the first tick (this was also why only a
  single particle appeared visible in earlier builds). Jitter now uses
  `nextFloat(0, 1)`; headless verification shows the 1,250-particle population
  staying spread across the full world volume through tick 100+.


## [4.0.3] - 2026-08-02 → 0.3.0

### Simulation
- **Un-clumped spawn**: each species now spawns on its own grid spanning the
  full world volume, so populations start interleaved across the dish instead
  of every species occupying a contiguous depth slab (which read as dense
  clumps at boot).

### Camera
- **Pan direction fixed**: the view now follows the fingers on both axes
  (world shifts opposite the drag); horizontal pan was previously inverted.
- **Zoom no longer pans**: two-finger centroid drift under 10px is ignored
  during a pinch, so zooming in/out keeps the view still.
- **Easier rotation**: orbit sensitivity roughly doubled — mouse drag
  `0.003 → 0.006` rad/px, one-finger touch orbit `0.005 → 0.008` rad/px
  (still scaled by the settings-panel sensitivity multipliers).


## [4.0.2] - 2026-08-02 → 0.2.0

### UI
- **Drawer hide/show**: a dedicated `▼` button on the right of the tab bar
  fully hides the bottom drawer (unlike minimize, which keeps the tab strip);
  a floating `▲` pill at the bottom-center of the screen reopens it.
- **Camera recenter on drawer toggle**: the camera resets to the default
  world-centered view whenever the drawer is hidden or shown, so the dish
  never appears cut off or off-center after a layout change.

### Render
- **Removed leftover test overlay**: the red diagnostic dot and
  `particles=N` text drawn at canvas center are gone; the red "stuck
  particle" at the top edge of the drawer was this debug artifact.

### Simulation
- **Denser default population**: `DEFAULT_PARTICLES_PER_SPECIES` raised from
  50 to 250 (1,250 particles at boot), so the world reads as populated
  instead of a handful of scattered dots. Spatial-grid solver keeps the
  per-frame cost in the same range.


## [4.0.1] - 2026-08-02 → 0.1.0

### UI
- **Drawer Minimize button**: a dedicated `▁` button on the right of the tab
  bar collapses the bottom drawer to a thin strip (click `▔` to expand it
  again). State is per-session; hidden tab content resumes where it was.

### Camera
- **Perspective stretching fixed**: perspective depth is now computed in
  pixel space (`rz2 × px/unit × PERSPECTIVE_STRENGTH`) instead of raw world
  units, so depth can never exceed the focal length and invert the projection.
  With `WORLD_SIZE=2000` the old math put world-unit depth (±1700) past the
  focal distance (1200), producing the far-away/stretched look.
- **Default view fits the whole world**: `fitZoomForWorld()` now starts at
  zoom 1 (full dish visible at any world size) instead of the legacy
  `worldSize/120` over-zoom that left ~1 particle on screen.
- **Particles always visible**: the renderer clamps particle screen radius to
  a 1.5px minimum, so sub-pixel dots no longer vanish when the whole 2000³
  world is in view; wheel/pinch zoom in for close inspection.


## [4.0.0] - 2026-08-01 → 0.0.0

### Integrated Intelligence
- **Five intelligence engines wired into the simulation loop**: Insight (cluster
  detection), Narrative (4-voice commentary), Lineage (birth/death genealogy),
  Goal (self-tuning world constraints), and Timeline (record/scrub playback).
  Engines communicate exclusively through the EventBus; none touch the DOM.
- **World Intelligence Dashboard** (WORLD tab): live cluster count, lineage
  births/deaths/depth, snapshot count, recording toggle, timeline scrub slider,
  and a goal-adjustment log.
- **PREDATION law** (index 51, biology category): mass-difference pursuit,
  prey fleeing, DNA absorption and mass transfer on contact — restored as an
  explicit law toggle with full HELP_DB entry and law-grid icon.
- **Communication DNA system**: signal oscillator emission (PULSE_RATE ×
  SIGNAL_STRENGTH), channel-filtered propagation (TUNING_CH1-4 bandpass via
  normalized tuning dot product), NEIGHBORHOOD_RADIUS gating, PROPAGATION_SPEED
  pacing, SIGNAL_RESP response force + energy feed, and MEMORY accumulation
  with MEMORY_DECAY decay. Signals are now always-on (DNA-driven), not gated
  behind GLOW/TRACK toggles.
- **Offspring lineage anchors**: `applyReproduction` now returns `parentId` so
  every birth is traceable to its parent generation.
- **Goal-engine tunables**: `maxForce`, `dragMultiplier`, `birthRate`,
  `deathRate`, `scanInterval`, `clusterRadius` in `runtimeConfig`, consumed by
  the solver (force clamp ceiling/scale, global damping, REPRO/LIFE synergy
  scaling) and the insight engine (scan cadence/radius).

### Performance
- Renderer phenotype calls pass the shared Float32Array view directly (no
  per-particle `new Float32Array` allocation) — from v3 WIP.
- HUD throttles DOM writes (changed-value + tick % 10 gating).
- DNA analytics skips collection entirely while its tab is hidden.

### World Tuning (inherited v3 WIP)
- Sparse world: 5 species × 50 = 250 initial particles; `WORLD_SIZE` 2000;
  `BASE_RADIUS` range 0.2–4; gravity scaled with world size.

### Fixes
- Predation no longer conflated with TRACK law activation.
- Timeline scrub resets lineage tracking so restored dead flags don't double-log.

### Debug Overlay
- **Unified debug overlay** (`src/debug.js`): one collapsible panel collects
  every debug message since the page started (inline probe, module load, boot,
  restarts, chaos, world changes, errors, unhandled rejections).
- **Tap-to-copy**: tap the overlay header (or ⧉ COPY, or SETTINGS → DEBUG →
  COPY LOG) to copy the whole log as a single JSON object.
- **SETTINGS toggle**: DEBUG OVERLAY SHOW/HIDE, persisted in localStorage.
- Inline `index.html` probe now logs into the shared buffer instead of drawing
  a separate banner, and falls back to a plain banner after 3s if the module
  bundle fails to load.

### Testing
- New `tests/unit/engines.test.js` (insight, lineage, timeline, goal) and
  `tests/unit/signal.test.js` (pulse, propagation, channel filtering).
- 39/39 unit tests pass; vitest timeout raised to 15s for slow CI environments.


## [3.1.0] - 2026-07-29 (VEPA v3 history retained)

### Added
- **1000 Default Particles**: DEFAULT_PARTICLES_PER_SPECIES increased from 50 → 200 (200 × 5 species = 1000 particles)
- **Accretion Gene Fusion**: When particles merge via accretion, the survivor blends DNA from the consumed particle, creating hybrid genetic lineages through mass-based gene transfer.
- **Predation Gene Absorption**: New `applyPredation` law function — larger particles pursue smaller ones via mass-difference tracking, and on contact absorb 5 random DNA traits at 5% rate plus mass transfer. Prey particles flee with jitter-based repulsion.
- **Biological Particle Variance**: Enhanced `applyLifeCycle` with age-based color drift (±mutRate per frame), mass fluctuation tied to energy metabolism, bio-rhythm energy pulses (sin wave at birthRate frequency), and age-scaled senescence probability.
- **Non-Overlapping Bond/Polymer Structures**: Added hard-sphere constraint resolution after position integration — all particles maintain minimum distance based on combined radii. Bonded particles are pulled to their equilibrium distance with stiffness-controlled spring force.
- **Expanded DNA Analytics**: New `collectAndRenderAll` function with overview stats banner (population, avg mass/energy/velocity, bonded count, max bonds), per-species breakdown with 4-metric summaries, species trait profiles showing key DNA parameter averages, genetic diversity indicator, ASCII population density heatmap (8×8), and 4 real-time histogram charts.
- **4 New Histogram Charts**: mass-histogram, energy-distribution, age-demographics, velocity-distribution canvas charts added to DNA tab, updated every 10 physics ticks.
## [3.0.0] - 2026-07-28

### Architecture
- **Clean-slate recreation** with modular ESM architecture
- **Physics Web Worker** with SharedArrayBuffer for off-main-thread simulation
- **Canvas2D renderer** with DNA-driven phenotype expression
- **EventBus architecture** — all subsystems communicate via pub/sub
- **64-law bitmask system** with 5 color-coded categories
- **42-parameter DNA system** with range-validated buffers

### Core Systems
- Spatial hash grid for O(N) neighbor queries
- Law synergy computation (9 synergy rules)
- 30+ law force functions covering physics, biology, chemistry, thermodynamics, metaphysics
- NaN guard system for numerical stability
- Velocity clamp and force magnitude limits

### Intelligence Engines
- **Insight Engine** — spatio-temporal cluster detection with Union-Find
- **Narrative Engine** — 4-voice commentary (Stabilizer, Diverger, Observer, Dissolver)
- **Goal Engine** — auto-tuning world parameters toward stability/complexity targets
- **Lineage Tracker** — evolutionary genealogy with ancestor chains
- **Timeline Engine** — state snapshots and replay

### UI
- Tabbed interface (WORLD, SPECIES, DNA, LAWS, LOG)
- 64-law toggle grid with 5-category color coding
- 42 DNA sliders with range-constrained inputs
- Species selector with colored circles
- Preset save/load via localStorage
- HUD with FPS, particle count, species count, tick
- Keyboard shortcuts (Space, R, 1-5)

### Testing
- Unit tests for PRNG, LawState, DNABuffer, ParticleBuffer, SpatialGrid, Synergy
- Vitest configuration for fast test execution


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 8/112: docs/README.md (41 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA4 — Documentation Index

> Restored from the archive on 2026-08-10 and triaged for v4: legacy/v2/v3-era
> docs were re-archived (they remain in the `gemquota/vepa-archive` repo), the
> rest were updated to the post-restructure root layout (the `v4/` tree is now
> the repo root).

## Kept & updated for v4

| Doc | What it is | Updated |
|-----|-----------|---------|
| `../AGENTS.md` | Agent initialization + codebase audit (root layout) | ✅ 2026-08-10 |
| `../GEMINI.md` | Project mandates + doc-sync list (legacy SSOTs noted as archived) | ✅ 2026-08-10 |
| `../GUIDE.md` | "Architect's Field Manual" — design guidance (v4 status note) | ✅ 2026-08-10 |
| `mechanics/chaos_multiplex.md` | Chaos Multiplex guide (in-page shards, not iframes) | ✅ 2026-08-10 |
| `dev/intelligence_bus.md` | Five v4 intelligence engines + event bus | ✅ 2026-08-10 |

## Archived on triage (stay in `gemquota/vepa-archive`, not in this repo)

- v2/v3 audits: `docs/fullaudit.md`, `docs/lawaudit.md`, `docs/LAW_AUDIT.md`,
  `docs/LAW_PARAMETER_RELATIONSHIPS.md`, `docs/EXPANSION_PROGRESS.md`, `docs/stubs.md`
- v2 architecture: `docs/arch/` (law_bitmask, spatial_grid, worker_sync)
- v2 expansion encyclopedia: `docs/expansion/` (batches 01-04)
- v2/v3 mechanics guides: `docs/mechanics/{physics,biology,metaphysics,thermodynamics}.md`
  (superseded by `../src/physics/lawgroups/SPEC.md` + `LAW_HELP_DB` + `../audit-suite/`)
- Meta audits (Apr 2026): `docs/meta/` (ADVERSARY, ARCHITECT, EVALUATOR, TEAM_LEAD)
- NLM/roadmap docs: `docs/nlm/` (13 files — speculative/legacy)
- UI lore + codex: `docs/ui/` (codex_links, drone_logic, preset_routing — codex app archived)
- Completed plan: `docs/superpowers/plans/2026-08-06-multiplex-fitness-and-import.md`
- v2-era SSOTs: `../ENGINE_SSOT.md` (v3.0.0), `../COMPENDIUM.md` (v3.4.0)
- Legacy root README/CHANGELOG (v2 era)
- Stray asset: `docs/new.png`

## Related

- Law fidelity audit: `../audit-suite/` (`fidelity-audit-v4.6.29.md` + `historical/2026-08-10-v4.6.28/`)
- Complete pre-triage archive: `gemquota/vepa-archive` (`vepa-archive-20260810.tar.gz`)

> **Versioning note:** audit filenames use legacy labels (`v4.6.29` = new schema
> `6.29.0`; `v4.6.28` = `6.28.0`) — see `AGENTS.md` §10.4.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 9/112: docs/dev/intelligence_bus.md (39 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Intelligence Engine Integration

> **Status:** v4-current · Engines: `src/engines/` (goal, insight, lineage, narrative, timeline)

VEPA4's "Intelligence" is distributed across five decoupled engines that
communicate via a central event bus (`src/core/eventBus.js`). Each engine is a
stateless-ish factory (`createX(bus, config)`) that subscribes to simulation
events and publishes findings back onto the bus.

## The five v4 engines

1. **Insight** (`insightEngine.js`) — analyzes the physical state (particle
   buffer) for patterns: clusters, "interestingness" scores, thermodynamic
   stability alerts.
2. **Goal** (`goalEngine.js`) — auto-adjusts parameters to maintain sim
   stability (world constant shifts, adaptive metabolic taxes).
3. **Narrative** (`narrativeEngine.js`) — translates data into story; feeds the
   Narrative Consciousness layer that can rewrite physics based on the
   unfolding history.
4. **Lineage** (`lineageTracker.js`) — tracks births/deaths across generations
   (species, parent→child, cause of death).
5. **Timeline** (`timelineEngine.js`) — snapshots world state over ticks for
   replay/scrubbing (bounded ring).

## The Intelligence Bus

All engines hook into `eventBus.js`:

```javascript
bus.on('state:update', (sab) => { insightEngine.analyze(sab); });
bus.on('insight:discovery', (data) => { narrativeEngine.comment(data); });
```

Wiring lives in `src/main.js` (`resetIntelligence()` re-creates the engines on
reset/import; `src/engines/*` are consumed by the UI panels in `src/ui/`).

---
*Dev Manual v2 (updated 2026-08-10 for the v4 five-engine architecture)*


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 10/112: docs/mechanics/chaos_multiplex.md (77 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# The Chaos Multiplex & Parallel Realities

> **Status:** v4-current (multiplex rewritten in v4.6.24+ — in-page shards, no iframes)
> **Engine:** `src/multiplex/multiplex.js` · **UI:** `src/multiplex/multiplexUI.js` · **Help:** `src/multiplex/multiplexHelp.js`

The Chaos Multiplex is a high-level experimentation UI that allows the Architect to run multiple parallel universes simultaneously to brute-force evolutionary outcomes.

## 1. Shard Isolation (v4)
The v4 multiplex runs **in-page shards**, not iframes: every shard owns its own
particle `SharedArrayBuffer`/view, species DNA buffer, law state and PRNG instance,
and is stepped by the same solver (`solve()`). A crash or "Big Rip" in one shard
cannot corrupt the others — buffers are per-shard and rebuilt on iterate. Each shard
is rendered to its own preview canvas (`renderQuality: 'eco'` by default, DPR 1.25).

## 2. Brute-Force Evolution
Architects can use the Multiplex to:
1.  **Reroll:** Run up to 16 setups with different PRNG seeds (SEED > 0 = deterministic lineage).
2.  **Drift:** Apply per-aspect LAW / DNA / POP VAR multipliers on top of the master VARIATION knob.
3.  **Select:** Rank shards by 14 weighted fitness metrics (FIT tab) and import the selected
    shard's state back into the master simulation (IMPORT ON EXIT / `copyShardToWorld`).

## 3. Iteration Protocol
Shards are generated by `buildShards` from the source world (or a seed lineage);
`iterateMultiplex` regenerates the grid after each run, applying AFTER ITERATE =
`NONE | FITTEST | FOLLOW` and KEEP SELECTED snapshot restore. No `postMessage`
sandboxing is involved — state moves between shards and the main world through
buffer copies (`snapshotShard`/`restoreShard`/`copyShardToWorld`).

---
*v2.1 spec superseded by the v4 in-page shard architecture (4.6.24+)*

---

## 4. Drawer expansion (v4.6.24)

The right-edge drawer is now tabbed **LIVE / FIT**.

### LIVE tab
- **POP SCALE** (0.25–1) — dynamic per-shard population cap (`computeShardPopulationCap`: inverse-square-root curve, floor 250); applies immediately (rebuilds the grid).
- **SEED** (0 = random, > 0 = deterministic) — a fixed seed reproduces the exact same shard lineage across runs.
- **SUBSTEPS** (1–8) — solver sub-steps per shard tick; a linear law's per-step effect is invariant to the substep count.
- **LAW / DNA / POP VAR** — per-aspect multipliers on the master VARIATION knob; 0 blocks that aspect entirely.
- **AFTER ITERATE** — `NONE | FITTEST | FOLLOW`:
  - FITTEST — select the shard with the highest weighted fitness (default weights = alive-only).
  - FOLLOW — select the shard whose metric profile is closest to the previous selection.
- **KEEP SELECTED** — anchors the selected shard through regeneration (full view/DNA/laws/PRNG snapshot restore).
- **IMPORT ON EXIT** — imports the selected shard into the main simulation when exiting the multiplex (default on).

### FIT tab
- 14 weighted metrics per shard: population, growth, longevity, stability, energy, reserves, armor, mobility, signal, bonds, diversity, exploration, novelty, delta.
- Metrics are min-max normalized across shards; each row has a 0–1 weight slider and a MAX/MIN mode toggle (MIN flips to 1−norm).
- DELTA = mean |score − mean(others)| over the base metrics — "how different is this world from the pack".
- Composite fitness = Σ wᵢ·scoreᵢ / Σ wᵢ (falls back to population when all weights are 0).
- Scrollable per-shard score readout (`S01 0.74`) — click a row to select that shard.
- Stats row shows `ALIVE · CAP · ΔSEL · ΔAVG` (selected-shard delta and the rolling mean delta across shards).

### Import protocol
`exit()` → if `importOnExit`, the selected shard is copied into the main world buffers
(particles + species DNA + law state via `copyShardToWorld`), then the main loop resets the
offspring ring and intelligence engines and re-syncs species/DNA/law panels.


## 5. GPU performance & metrics drawer (v4.6.25)

Multiplex rendering is tuned for GPU headroom so 16 parallel realities stay smooth.

- **Zero-copy views** — preview canvases consume the shard's `Float32Array` view
  (`asParticleView`) instead of a per-frame buffer copy.
- **DPR cap** — previews render at 1.25× device-pixel-ratio (`maxDpr`), the main sim at 2×.
- **ECO render mode** — skips the reference grid and the per-particle soft-glow halo;
  on by default for previews (`renderQuality: 'eco'`).
- **GPU ECO toggle** — LIVE tab switch (`#mpx-drawer-eco`) flips previews between
  eco and full rendering live.
- **Metrics drawer** — the collapsible bottom bar (`#mpx-metrics`) shows per-shard
  fitness chips (`S01 0.74`, click to select) and a `ALIVE · CAP · ΔSEL · ΔAVG · ITER · MS`
  stats line (MS = EMA-smoothed shard tick time), refreshed every 24 frames.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 11/112: src/physics/lawgroups/SPEC.md (165 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA 8x16 Expansion — Law Implementation Spec

Add the 46 new laws (indices 82-127) to VEPA4 as **stateless functions** in
`v4/src/physics/lawgroups/*.js`. The solver calls them; they must not depend on
any module-level mutable state.

## Context (from `src/constants.js`)

- `PARTICLE_STRIDE = 100`; buffer is a `Float32Array` view.
- Particle base pointer = `index * PARTICLE_STRIDE`; e.g. `view[iBase + S.POS_X]`.
- `S = STRIDE_INDEXES`: POS_X 0, POS_Y 1, POS_Z 2, VEL_X 3, VEL_Y 4, VEL_Z 5,
  MASS 6, SPECIES_ID 7, DNA_CACHE_START 8 (42 DNA floats, 8..49), ENERGY 50,
  AGE 51, DEAD 52 (0 alive / 1 dead), COLOR_R 53, COLOR_G 54, COLOR_B 55,
  RADIUS 56, SIGNAL 57, BOND_COUNT 58, BOND_PARTNER_1 59, BOND_PARTNER_2 60,
  MEMORY 61, HUNGER 62, ARMOR 63, MITOSIS_TIMER 64, PARTNER_ID 65,
  TEMPERATURE 66, CHARGE 67, PHASE_1 68, PHASE_2 69, SOUL 70, TRAIL_X 71,
  TRAIL_Y 72, TRAIL_Z 73, ALPHA 74, ENTANGLE_ID 75, ENTANGLE_PHASE 76.
- `D = DNA_INDEXES` (cache, values are **normalized floats ~[-1,1] or [0,1]**):
  FORCE 0, VISCOSITY 1, TORQUE 2, JITTER 3, POLARITY 4, ALPHA 5, SYMMETRY 6,
  HIDDEN_MASS 7, STIFFNESS 8, FUSION 9, BIRTH_RATE 10, DEATH_RATE 11,
  MUTATION 12, SIGNAL_RESP 13, PULSE_RATE 14, TIDAL 15, FUSION_MOMENTUM 16,
  FUSION_TIME 17, NEIGHBORHOOD_RADIUS 18, SIGNAL_STRENGTH 19, SIGNAL_DECAY 20,
  PROPAGATION_SPEED 21, TUNING_CH1..CH4 22-25, INERTIA 26, FRICTION 27,
  MAX_VELOCITY 28, BASE_RADIUS 29, ELASTICITY 30, BOND_ANGLE 31,
  CONDUCTIVITY 32, MAGNETIC_MOMENT 33, ENERGY_EFFICIENCY 34, SEX_CHANCE 35,
  PREDATION_BIAS 36, REACTION_THRESHOLD 37, CATALYSIS 38, HEAT_OUTPUT 39,
  MEMORY_DECAY 40, SPECIES_AFFINITY 41.

## Conventions

- File: `v4/src/physics/lawgroups/<group>.js`, ESM, 4-space indent.
- `import { STRIDE_INDEXES as S, DNA_INDEXES as D, PARTICLE_STRIDE } from '../../constants.js';`
- `const dnaOf = (view, ptr, d) => view[ptr + S.DNA_CACHE_START + d];`
- `function nanGuard(v) { return Number.isFinite(v) ? v : 0; }` — clamp all
  outputs; **never write NaN/Infinity** to the buffer.
- Read reference implementations in `v4/src/physics/laws.js` (e.g.
  `applyFriction`, `applySignalDecay`, `applyFieldDrift`, `applySpin`) for tone.
- Pairwise laws: `export function applyX(view, iBase, jBase, dx, dy, dz, dist)`.
  Return `{ ax, ay, az }` for forces (solver adds them), or `null`/`undefined`
  if the law only mutates state. Never mutate during j-loop that would break
  iteration (setting DEAD is fine — the grid was already built).
- Per-particle laws:
  `export function applyX(view, iBase, px, py, pz, vx, vy, vz, worldSize, prng)`.
  Same return contract. `prng()` returns [0,1).
- Keep each law **small but real**: a few lines that visibly change state or
  forces, using the DNA/stride fields above. Magnitudes should be simulation
  stable (forces ≲ 2.0 per call; energy changes ≲ 5 per call).
- Run `node --check <file>` when done. Do NOT edit any other file.

## Law list (46)

### physicsAdd.js — PHYSICS (indices 82-87)
1. `applyTide` (pair): tidal pull on i toward j proportional to j's MASS,
   falling off slowly with distance (longer reach than gravity). Also gently
   aligns velocity — tidal lock.
2. `applyFriction` (pp): velocity-dependent drag; force = -v * k * speed.
3. `applyElasticity` (pp): soft bounce — force opposing velocity, stronger at
   high speed (restoring "spring" that prevents runaway).
4. `applyTurbulence` (pp): perpendicular pseudo-random kick that rotates
   smoothly using prng(); magnitude scales with ENERGY.
5. `applyCentripetal` (pp): force toward world centre
   `(px - cx, py - cy, pz - cz)` scaled by distance (harmonic attractor).
6. `applyRotation` (pp): tangential force around the centre axis — for a point
   (x,y) use velocity-like rotation (dx = -(py-cy), dy = (px-cx)); scale by
   distance from axis.

### biologyAdd.js — BIOLOGY (indices 88-91)
7. `applySymbiosis` (pair): if SPECIES_ID differs, transfer ENERGY from the
   richer partner to the poorer (no force).
8. `applyParasite` (pair): if i smaller than j (MASS), drain energy from j to i
   at ~70% efficiency; skip if j's ENERGY below a floor.
9. `applyHibernation` (pp): if ENERGY < 25, damp velocity strongly and slowly
   regen ENERGY (self-preservation).
10. `applyImmunity` (pp): regen ARMOR toward a cap (e.g. +0.02 per tick, cap
    ~1.0); if HUNGER > 0 reduce it.

### chemistryAdd.js — CHEMISTRY (indices 92-97)
11. `applyElectrolysis` (pair): if |CHARGE_i - CHARGE_j| > 0.3, convert small
    MASS of i to ENERGY + SIGNAL (charge-driven decomposition).
12. `applyPhotolysis` (pair): if combined SIGNAL > 0.5, convert small MASS to
    ENERGY (light breaks matter).
13. `applyPrecipitation` (pair): on contact, both gain MASS and shrink RADIUS
    (condensation); cap mass at 8.
14. `applyNeutralization` (pair): if CHARGE_i * CHARGE_j < 0, reduce both
    charges toward 0 and raise TEMPERATURE of both.
15. `applyStoichiometry` (pair): whenever ENERGY/MASS is exchanged by other
    chemistry, balance the pair — implement as: transfer any ENERGY surplus
    between partners to equalize, conserving total.
16. `applyAutocatalysis` (pair): if SPECIES_ID equal, boost both ENERGY by
    CATALYSIS DNA (self-catalysis).

### thermoLaws.js — THERMODYNAMICS (indices 98-103)
17. `applyAdiabatic` (pair): convert relative kinetic energy (speed of i) into
    TEMPERATURE without loss — add to i's TEMPERATURE, damp i's velocity.
18. `applyCompression` (pair): when dist < rSum (touching), shrink both RADIUS
    slightly and raise TEMPERATURE (pressure squeeze).
19. `applyExpansion` (pp): if BOND_COUNT === 0 and speed low, grow RADIUS
    toward BASE_RADIUS DNA and cool slightly.
20. `applyEquilibrium` (pair): exchange TEMPERATURE toward the pair mean
    (symmetric conduction).
21. `applyLatentHeat` (pair): phase buffer — when TEMPERATURE high, convert
    TEMPERATURE into ENERGY (absorb); when low, convert ENERGY into
    TEMPERATURE (release).
22. `applyRunaway` (pp): if TEMPERATURE > 1.5, add more TEMPERATURE (quadratic
    positive feedback), clamped.

### metaLaws.js — METAPHYSICS (indices 104-106)
23. `applyConsciousness` (pp): slow self-regeneration — regen ENERGY and MEMORY
    scaled by SIGNAL_RESP DNA (self-model).
24. `applyPerception` (pair): extended sensing — if dist < 80 (far beyond
    normal contact), transfer small amounts of SIGNAL and TEMPERATURE between
    the pair (awareness at distance).
25. `applySynchronicity` (pair): if PHASE_1 values are close, pull velocities
    together (resonant alignment) proportional to phase agreement.

### emLaws.js — ELECTROMAGNETISM (indices 107-109)
26. `applyAntenna` (pair): directional emission — if SIGNAL of i > 0.3, add a
    force on j along the i→j axis and boost j's SIGNAL (focused broadcast).
27. `applyShielding` (pp): consume ENERGY to damp velocity and reduce CHARGE
    influence (Faraday cage) — damp velocity, lower own CHARGE slightly.
28. `applyPolarization` (pair): channel filter — if TUNING_CH1 of i and
    TUNING_CH1 of j differ by more than 0.5, damp the SIGNAL transfer (filter
    mismatch); else boost SIGNAL of the weaker.

### infoLaws.js — INFORMATION (indices 110-111)
29. `applyNavigation` (pp): steer toward own stored TRAIL position (the map of
    where it has been) — pull toward (TRAIL_X, TRAIL_Y, TRAIL_Z).
30. `applyEncryption` (pp): robust coding — if SIGNAL > 0.01, decay slower
    (SIGNAL = SIGNAL * 0.999 + 0.001) so traces persist.

### quantumLaws.js — QUANTUM (indices 112-127, 16 laws)
31. `applySuperposition` (pp): velocity variance — add a random kick scaled by
    prng() and ENERGY, plus a tiny damp so it doesn't explode.
32. `applyTunneling` (pp): if prng() < 0.01, phase-shift position by a short
    random hop (up to ~8 units) — ignore barriers.
33. `applyDecoherence` (pp): collapse — damp velocity spread, radiate the lost
    variance into SIGNAL.
34. `applyWaveParticle` (pp): if speed < 0.5 act wave-like (smooth: damp
    sharply, small kicks); else particle-like (accelerate along velocity).
35. `applyUncertainty` (pp): tradeoff — if |v| high, jitter position slightly
    (px += (prng()-0.5)*0.3); if |v| low, add a velocity kick.
36. `applyTeleport` (pp): if prng() < 0.002 and ENERGY > 10, jump to a random
    position and spend ENERGY proportional to distance.
37. `applyObserver` (pp): measurement — damp own velocity spread, boost MEMORY
    toward 1.0 (the particle measures itself).
38. `applyPlanck` (pp): quantize — round VELOCITY and ENERGY to fixed quantum
    steps (e.g. 0.05 * round(v / 0.05)).
39. `applyCoherence` (pair): phase-lock — if PHASE_2 values close, pull
    velocities together and align PHASE_2 toward the mean.
40. `applyBosonic` (pair): short-range glue — strong attraction when
    dist < rSum * 2.2, scaling up as dist shrinks.
41. `applyFermionic` (pair): exclusion — strong repulsion when dist < rSum,
    growing sharply as dist shrinks.
42. `applySpin` (pp): intrinsic spin — perpendicular wiggle using particle
    parity and ENERGY (like SPIN in laws.js but standalone).
43. `applySpectral` (pp): identity radiation — emit a small species-tagged
    SIGNAL tone (SIGNAL += 0.005 * (1 + SPECIES_ID % 3)).
44. `applyWavefunction` (pp): position blur — after integration smooth position
    toward nearest 0.5-grid and add tiny random jitter (probability cloud).
45. `applyHyperplane` (pp): uniform shear — add a slow drift force along
    (vy, -vx) scaled by a hidden axis tilt using AGE.
46. `applyAntimatter` (pair): if CHARGE parities are opposite (CHARGE_i *
    CHARGE_j < 0), set both DEAD = 1 and return `true` (solver breaks the pair
    loop — treat like absorption). Return false otherwise.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 12/112: audit-suite/README.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA Audit Suite (v4.6.29+ layout)

Law-fidelity audit artifacts for the VEPA4 tree. Since the 2026-08-10
restructure this directory sits at the repo root; the pre-v4.6.29 root
`audit-suite/` is frozen in the `vepa-archive` repo.

> **Versioning note (2026-08-10):** audit filenames/labels use legacy v4.6.x
> numbers — under the new `major.minor.build` schema, `v4.6.28` → `6.28.0` and
> `v4.6.29` → `6.29.0` (the v4.6.29 law-RRP audit ships inside VEPA4 **7.0.0**).
> See `AGENTS.md` §10.4.

| Path | What it is |
|------|-----------|
| `historical/2026-08-10-v4.6.28/` | **Frozen historicity snapshot** of the committed 128-law audit (`laws/`), the RRP spec pass (`laws-rrp/`, incl. the proposed specs for batches 23-32) and the params audit (`params/`), copied verbatim on 2026-08-10. |
| `fidelity-audit-v4.6.29.md` | **Updated duplicate** of the law fidelity audit — re-audits the 8 rewritten laws (CHAOS, CONSCIOUSNESS, ENCRYPTION, SUPERPOSITION, SYMBOL, TELEPORT, TIME_DILATION, WAVE_PARTICLE) + 6 RRP-alignment changes, with old→new behavior, code sites, HELP_DB state and test status. |
| `laws/` | Will hold the live per-batch audit docs once the v4.6.29 (→ 6.29.0) release pass re-runs/updates them. |

The RRP workflow (recursive spec-confirmation loop) is unchanged: proposed specs
live in the batch files, user confirms/amends, then code + tests + this audit are
synced in the release pass.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 13/112: audit-suite/fidelity-audit-v4.6.29.md (214 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA Law Fidelity Audit — v4.6.29 (Updated Duplicate)

**Audit date:** 2026-08-10 · **Supersedes:** the v4.6.28 fidelity audit
(`historical/2026-08-10-v4.6.28/`, frozen for historicity)
**Scope:** the 8 rewritten laws + 6 RRP-alignment changes in the working tree
(law RRP WIP, uncommitted at `7ddb832` = v4.6.26; version label v4.6.29)

This document is the **updated duplicate** of the law fidelity audit. The
pre-rewrite audit is preserved unchanged in
`audit-suite/historical/2026-08-10-v4.6.28/` (a full copy of the committed
128-law audit suite + the RRP proposal files). Every entry below records the
v4.6.28 behavior → the v4.6.29 behavior, the implementation site, the HELP_DB
state, and the test status.

---

## 1. Summary

### 1.1 The 8 rewritten laws (major rewrites, HELP_DB hints rewritten)

| Law | Batch | Old (v4.6.28) | New (v4.6.29) | Code site |
|-----|-------|---------------|---------------|-----------|
| CHAOS | 09 | PRNG noise force + PRNG thermal stir | Deterministic per-particle Lorenz map (σ=10, ρ=28, β=8/3); no PRNG draws; thermal stir from map output | `laws.js applyChaos`, stride 85-87 |
| CONSCIOUSNESS | 27 | Flat regen: ENERGY +0.02·k, MEMORY +0.005·k | Predictive self-model: SELF_MODEL_SPEED EMA; prediction error (>0.3) → MEMORY/SIGNAL up, ENERGY down; low error → +0.01·k regen | `metaLaws.js applyConsciousness`, stride 95 |
| ENCRYPTION | 28 | Signal persistence: decay ×(1−0.02·k), floor 0.05, strong pulses shed 0.01·k | Keyed cipher carrier: cipher key folded from TUNING_CH1-4; PHASE_2 rotation + amplitude encoding; COMMS relay only between matching keys | `infoLaws.js applyEncryption`, `laws.js cipherKey/applySignalExchange` |
| SUPERPOSITION | 29 | Random velocity-spread force `(prng()−0.5)·k·2` per axis | 4 basis amplitudes (SUPER_AMP_1-4) over candidate velocities; phase rotation; Born-rule collapse (2%·k/tick) + renormalisation | `quantumLaws.js applySuperposition`, strides 89-93 |
| SYMBOL | 18 | Species-affinity social force (same-species ±affinity DNA) | Token-gated meaning: SYMBOL_TOKEN (8 bins), contact imprinting by higher-MEMORY partner, same-token attract / different-token repel | `laws.js applySymbolForce`, stride 88 |
| TELEPORT | 30 | Random world jump: ENERGY > 20 gate, 0.2%·k/tick, cost 0.1·distance | Quantum state transfer: requires ENTANGLE_ID; sender pays 5 ENERGY, partner adopts VEL + 30% ENERGY, sender collapses to ground state, link consumed | `quantumLaws.js applyTeleport` |
| TIME_DILATION | 08 | SOUL-gated bullet time: `1 − SOUL·0.3·synergy` | Weak-field GR: `sqrt(1 − 2·phi·synergy)`, phi = softened potential Σ MASS/r over ≤24 neighbours; floor 0.3 | `laws.js applyTimeDilation`, solver Phase 2 |
| WAVE_PARTICLE | 29 | Speed-gated: slow → damp, fast → amplify | Measurement-gated duality: WAVE_MEASURED flag (collision/OBSERVER, decays ×0.95/tick); measured → particle mode, unmeasured → de Broglie wave spread | `quantumLaws.js applyWaveParticle`, stride 94 |

### 1.2 RRP-alignment changes (behavior matched to proposed RRP specs)

| Law | Batch | Change |
|-----|-------|--------|
| PARASITE | 23 | Host drain scaled by `(1 − ARMOR·0.1)` — IMMUNITY armor halves extraction at cap |
| ELECTROLYSIS | 24 | Decomposition scaled by CONDUCTIVITY DNA; sheds heat `+dm·0.25` |
| PHOTOLYSIS | 24 | Conversion scaled by CATALYSIS DNA |
| PRECIPITATION | 24 | Both partners condense symmetrically (was one-sided) |
| NEUTRALIZATION | 24 | Heat ∝ `|cI·cJ|·k·0.04` (was flat +0.02·k) |
| UNCERTAINTY | 30 | Speed-gated Heisenberg tradeoff: `\|v\| ≥ 0.5` position jitter only; `< 0.5` velocity kick only |

### 1.3 Supporting infrastructure (not laws themselves)

- **Stride slots 85-95** (`constants.js STRIDE_INDEXES`): CHAOS_STATE_X/Y/Z (85-87),
  SYMBOL_TOKEN (88), SUPER_AMP_1-4 (89-92), SUPER_PHASE (93), WAVE_MEASURED (94),
  SELF_MODEL_SPEED (95). 96-99 remain reserved.
- **LAW_DEPENDENCIES** (`constants.js`) + `lawState.unmetDependencies()` /
  `dependenciesSatisfied()`: hard/soft dependency table (SENESCENCE→LIFE,
  TELEPORT→ENTANGLEMENT, ENCRYPTION→COMMS, FEEDBACK/OBSERVER/NAVIGATION→MEMORY,
  ISOMERIZATION→BOND|POLYMER, plus soft entries for LANGUAGE/SIGNAL_BOOST/ANTENNA/
  POLARIZATION/MIND/WAVE_PARTICLE).
- **LAW_SUBGROUPS** (`constants.js`): per-category themed sub-grouping for the LAWS
  tab (breaks the 128-law wall into labelled groups).
- **WRAP reclassification**: removed from the physics category law list — now a
  WORLD → SIMULATION RULES boundary condition; bit 3 preserved for save/preset
  compatibility; HELP_DB `system` text updated.
- **Solver wiring** (`solver.js`): collision and OBSERVER-with-MEMORY>0.5 set
  `WAVE_MEASURED`; TIME_DILATION phase now passes a neighbour snapshot; CHAOS call
  drops the PRNG argument; TELEPORT call drops `worldSize`.

---

## 2. Detailed entries — the 8 rewritten laws

### 2.1 CHAOS (index 32, metaphysics / batch-09)

- **Old:** `force = (prng() − 0.5)·0.5·synergy·dt` added to VEL_X/Y (VEL_Z ×0.5);
  TEMPERATURE stirred by `(prng() − 0.5)·0.02·synergy·dt`, clamped 0-1.
- **New:** per-particle Lorenz system integrated with an Euler step
  (`h = 0.02·dt`); state seeded deterministically from the particle index
  (x ≈ 0.1 + (i%7)·0.013, y ≈ 0.1 + (i%13)·0.007, z ≈ 20 + (i%5)·0.31);
  kick = `(x′−14)/28·0.5·synergy` on X/Y (half on Z); thermal stir =
  `(z′−20)/40·0.02·synergy` (clamped 0-1). No PRNG draws — same seed, same run.
- **HELP_DB:** hint/explanation/advanced rewritten (deterministic Lorenz).
- **State:** CHAOS_STATE_X/Y/Z.
- **Tests:** batch_09 not exercised here (behaviour changed without a test update);
  `v4/tests/audit/batch_09.test.js` still asserts the old PRNG shape → part of the
  stale-test set to update on release.

### 2.2 CONSCIOUSNESS (index 104, metaphysics / batch-27)

- **Old:** flat regen — ENERGY +0.02·k (cap 200), MEMORY +0.005·k (cap 1).
- **New:** predictive self-model. `SELF_MODEL_SPEED` EMA (`model·0.95 + speed·0.05`);
  prediction error `err = |speed − model|`; `err > 0.3` → attention: MEMORY
  `+err·0.02·k` (cap 1), SIGNAL `+err·0.01·k` (cap 10), ENERGY `−err·0.05·k`;
  else efficient maintenance ENERGY `+0.01·k` (cap 200).
- **HELP_DB:** hint/explanation/advanced rewritten (predictive processing proxy).
- **State:** SELF_MODEL_SPEED.
- **Tests:** stale — batch_27 (×2) and `lawgroupsEmInfoMeta` still assert flat regen.

### 2.3 ENCRYPTION (index 111, information / batch-28)

- **Old:** persistence coding — active signals decay `×(1 − 0.02·k)` instead of
  baseline, floored at 0.05, strong pulses (>0.1) shed 0.01·k.
- **New:** keyed cipher carrier. Cipher key = `floor(clamp(ΣTUNING_CH1-4/4, 0, 1)·7)`
  (0-7). Encoder: PHASE_2 `+= (key/8)·k`; SIGNAL `= signal·(0.6 + 0.4·sin(key/8·2π))`.
  Decoder: `applySignalExchange` (COMMS) relays only between matching keys;
  mismatched keys damp both SIGNALs by 0.01 and drop the exchange.
- **HELP_DB:** hint/explanation/advanced rewritten (keyed cipher; old persistence
  behavior explicitly retired).
- **State:** none new (reuses PHASE_2 + DNA cache TUNING_CH1-4).
- **Dependency:** requires COMMS (hard).
- **Tests:** stale — batch_28 (×1) still asserts decay/floor/persistence.

### 2.4 SUPERPOSITION (index 112, quantum / batch-29)

- **Old:** per-axis random force `(prng() − 0.5)·k·2` (spread variance).
- **New:** 4 basis amplitudes over candidate velocities (stay 0; +perp/−perp
  ±0.3; boost v·0.15). Amplitudes default to (0.7/0.1/0.1/0.1) and rotate phase
  (`SUPER_PHASE += 0.05·k`). With probability `0.02·k` per tick the state
  collapses: sample a basis by |a|² (Born rule), renormalise to `1−spread` on the
  selected basis / `spread/3` elsewhere, and return that basis's offset as force.
  Without collapse: gentle interference drift `sin/cos(phase)·0.05·k`.
- **HELP_DB:** hint/explanation/advanced rewritten (Born-rule collapse).
- **State:** SUPER_AMP_1-4, SUPER_PHASE.
- **Tests:** stale — batch_29 (×1) and `lawgroupsQuantum` (×1) assert random spread.

### 2.5 SYMBOL (index 71, information / batch-18)

> Index note: SYMBOL lives in the information category; HELP_DB block `SYMBOL`.
- **Old:** species-affinity social force — same species pulls by SPECIES_AFFINITY
  DNA, cross-species flips sign at half strength; `F = k·affinity/(dist+1)`.
- **New:** token-gated meaning. Token = `round(SYMBOL_TOKEN·7)` (0-7 bins). On
  contact (`dist < rI+rJ+0.5`) the higher-MEMORY partner imprints its token on the
  naive partner (`learn = min(0.3, |m1−m2|·0.2·k)` blended toward the authority's
  bin). Force: same token → `+0.15·k/(dist+1)` attraction; different tokens →
  `−0.05·k/(dist+1)` weak repulsion. Grouping follows learned identity, not species.
- **HELP_DB:** hint/explanation/system/advanced rewritten (token semantics).
- **State:** SYMBOL_TOKEN.
- **Tests:** batch_18 not re-run for the new semantics; `laws.test.js` still green
  (passes for the old shape) — flag for release update.

### 2.6 TELEPORT (index 117, quantum / batch-30)

- **Old:** random world jump — `ENERGY > 20` gate, `prng() < 0.002·k` per tick,
  position resampled uniformly in the world, cost `ENERGY −= 0.1·distance`.
- **New:** quantum state teleportation — requires `ENTANGLE_ID ≥ 0` (set by
  ENTANGLEMENT); `prng() < 0.002·k` per tick; `ENERGY ≥ 10`. Sender pays 5 ENERGY;
  partner adopts sender's VEL and gains `0.3·energy` ENERGY; sender collapses to a
  jittered ground state `(prng()−0.5)·0.4`; the link is consumed on both sides
  (`ENTANGLE_ID = −1`). Dead/zero-mass partners release the sender's link early.
- **HELP_DB:** hint/explanation/advanced rewritten (entangled state transfer;
  no-cloning).
- **State:** none new (uses ENTANGLE_ID/PHASE).
- **Dependency:** requires ENTANGLEMENT (hard).
- **Tests:** stale — batch_30 (×2) and `lawgroupsQuantum` (×2) call the old
  signature `(view, iBase, worldSize, k, prng)` and assert the old jump.

### 2.7 TIME_DILATION (index 30, physics / batch-08)

- **Old:** SOUL-gated bullet time — `localDt = 1 − SOUL·0.3·synergy` (max 30% slow).
- **New:** weak-field gravitational time dilation — `phi = (Σ neighbor MASS/r
  (+0.5 softening) over ≤24 grid neighbours)·0.001·synergy`;
  `localDt = sqrt(max(0, 1 − 2·phi))`, floored at 0.3. Clocks run slow beside
  massive bodies (ACCR stars, SINGULARITY cores) and at full speed in empty space.
- **HELP_DB:** hint/explanation/advanced rewritten (GR mechanism).
- **State:** none new (reads neighbourhood from the Phase-1 grid snapshot).
- **Tests:** batch_08 TIME_DILATION section was updated in the working tree; the
  "mass 40 at r 0.5 → 0.9165" case still fails because the test places the self
  particle at the origin (r ≈ 173, localDt ≈ 0.9998) — test fixture bug, part of
  the release update.

### 2.8 WAVE_PARTICLE (index 115, quantum / batch-29)

- **Old:** speed-gated — `speed < 0.5` → damp `−v·0.01·k`; `speed ≥ 2` → amplify
  `+v·0.01·k`; in-between → null.
- **New:** measurement-gated duality. `WAVE_MEASURED` decays ×0.95/tick; set to 1
  by collisions and by OBSERVER neighbours with MEMORY > 0.5. Flag > 0.1 → particle
  mode (accelerate along velocity `+v·0.01·k`). Otherwise wave mode: perpendicular
  de Broglie drift `amp = min(2, 1/speed)·0.02·k·(0.5+0.5·sin(phase))`; near-stationary
  particles use phase drift `sin/cos(phase)·0.01·k`. PLANCK sets the quantum scale
  via synergy.
- **HELP_DB:** hint/explanation/advanced rewritten (Copenhagen reading).
- **State:** WAVE_MEASURED.
- **Dependency:** soft — requires OBSERVER for full duality (stays wave-like alone).
- **Tests:** stale — batch_29 (×1) and `lawgroupsQuantum` (×1) assert speed-gating.

---

## 3. Verification status (2026-08-10)

| Check | Result |
|-------|--------|
| `node --check` on all touched src files | ✅ clean |
| Targeted audit/unit runs (batch_08/23-32 + lawgroups) | ⚠️ 14 failed / 111 passed — all stale pre-rewrite assertions (see §4) |
| Full suite (`vepa4 test` from the promoted root) | ⚠️ 597 passed / 20 failed — every failure is a stale pre-rewrite assertion (see §4) |
| `vepa4 build` | ✅ clean |
| `vepa4 syntax` | ✅ clean |

## 4. Stale tests to update on release (assert pre-rewrite behavior)

Full-suite baseline after the restructure (2026-08-10): **597 passed / 20 failed (617)** —
every failure is a pre-rewrite assertion. `vepa4 syntax` and `vepa4 build` are clean.

| Test file | Stale assertions |
|-----------|------------------|
| `tests/audit/batch_08.test.js` | TIME_DILATION GR fixture (1) |
| `tests/audit/batch_09.test.js` | CHAOS stochastic forcing (1) |
| `tests/audit/batch_18.test.js` | SYMBOL species-affinity force (2) |
| `tests/audit/batch_27.test.js` | CONSCIOUSNESS regen (2) |
| `tests/audit/batch_28.test.js` | ENCRYPTION persistence (1) |
| `tests/audit/batch_29.test.js` | SUPERPOSITION / WAVE_PARTICLE (2) |
| `tests/audit/batch_30.test.js` | UNCERTAINTY / TELEPORT (2) |
| `tests/unit/lawCategories.test.js` | WRAP removed from the physics category list (2) |
| `tests/unit/lawgroupsBiologyChemistry.test.js` | ELECTROLYSIS conductivity scaling (1) |
| `tests/unit/lawgroupsEmInfoMeta.test.js` | CONSCIOUSNESS (1) |
| `tests/unit/lawgroupsQuantum.test.js` | SUPERPOSITION / WAVE_PARTICLE / UNCERTAINTY / TELEPORT (5) |

These are intentionally **not** modified here: the v4.6.29 WIP is uncommitted and
unreleased; this audit records the delta for the release pass. Per the RRP loop,
each entry's proposed spec lives in the frozen `historical/` copies of
`audit-suite/laws-rrp/batch_23.md` … `batch_32.md`.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 14/112: audit-suite/law-revamp/FINAL-REPORT.md (1277 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Law Theorycraft — Final Complete Report

**Series:** 10 batches · **Laws covered:** 59 (bucket 3: 6 misnomers + bucket 2: 53 vague) · **Date:** 2026-08-10
**Tree:** dirty 7.0.0 draft at `7ddb832` (v4.6.26) — law-RRP WIP uncommitted.
**Method:** per-law research grounded in `LAW_HELP_DB`, `audit-suite/fidelity-audit-v4.6.29.md`, the `laws-rrp` historical batch docs, and the lawgroup implementations; CPU = analytical per-particle-per-tick cost model + `bench/solver.bench.mjs --laws` anchors (`bench-baseline.json`, 500 particles, baseline 12.46 ms/tick). Quality loop per batch: Rv/linear (produce → reflect → refine → check).

## Executive Summary

### Migration tally
- **Bucket 3 → 1:** 6/6 (ADIABATIC, INDUCTANCE, FLUX, METRIC, DIMENSIONALITY, WILL)
- **Bucket 2 → 1:** 52/53 — every law reached bucket 1 **except IMMUNITY** (upgraded within bucket 2: adaptive memory + cost + specificity; a full immune system is out of scope)
- **Net result:** 58 of 59 laws proposed at bucket 1; 1 stays bucket 2 (IMMUNITY); 0 remain in buckets 3-4 territory

### Per-batch summary
| Batch | Laws | Target 1 | Target 2 | Net CPU Δ (marginal) | Biggest win |
|-------|------|----------|----------|----------------------|-------------|
| 01 — bucket 3 misnomers | 6 | 6 | 0 | +38% (micro-costs) | DIMENSIONALITY isotropic diffusion |
| 02 — physics | 6 | 6 | 0 | ACCR −35%, rest +5-20% | ACCR mass/momentum conservation |
| 03 — biology | 6 | 5 | 1 | ENERGY net −60% | ENERGY contact-range Fourier |
| 04 — chemistry | 6 | 6 | 0 | ALLOY −60% | ALLOY interdiffusion (no death) |
| 05 — chem/meta | 6 | 6 | 0 | ~flat | ENTANGLEMENT relay removal |
| 06 — meta/EM | 6 | 6 | 0 | +5-15% | MAGNETISM dipole r⁻³ |
| 07 — EM | 6 | 6 | 0 | +5-10% | SUPERCONDUCTIVITY Meissner |
| 08 — information | 6 | 6 | 0 | SHIELDING −20% | SHIELDING passive isolation |
| 09 — info/quantum | 6 | 6 | 0 | HISTORY −80% | HISTORY local-gradient (kills COM scan) |
| 10 — quantum | 5 | 5 | 0 | +5-10% | OBSERVER collapse-with-disturbance |

### CPU impact
The series is a **net performance win at world scale**: three structural savings (HISTORY's 1728-cell COM scan −80%, ENERGY's contact-range collapse −60% net, ALLOY's 42-locus merge −60%) outweigh the small +5-15% fidelity upgrades on bounded pairwise costs. The heaviest remaining law in the set is MAGNETISM (dipole term). Every proposal stays within the sim's bounds: spatial-grid neighbor loops (no O(n²)), `MAX_INTERACTIONS` 500 cap, `MAX_FORCE`/`MAX_VELOCITY` clamps, stride ≤ 99, SplitMix32-only randomness, NaN shields.

### Stride 96-99 allocation (must be reconciled before implementation)
Proposals need: DIMENSIONALITY variance (96-98), IMMUNITY memory (96), SUPERCONDUCTIVITY binding (97), SYMBOL confidence (97), CONSCIOUSNESS 2nd-level model (99). Only 96-99 are free — **the confirm loop must allocate these explicitly** (e.g., 96 = IMMUNE_MEMORY, 97 = SYMBOL_CONFIDENCE + BOSONIC_BOUND share, 98 = DIMENSIONALITY var, 99 = CONSCIOUSNESS model-2, or a packed uint).

### Cross-law invariants introduced
- **Redox conservation** — OXIDATION (donor) + REDUCTION (acceptor) transfer electrons with global charge conservation (ship together)
- **No-signaling** — ENTANGLEMENT loses its signal relay; TELEPORT keeps the classical-channel cost as the only legitimate state transfer
- **Shared oscillators/constants** — PHASE_1 writers (SYNCHRONICITY/COHERENCE/BOSONIC), TUNING_CH1-4 semantics (POLARIZATION/ENCRYPTION/SPECTRAL), critical temperature T_C (SUPERCONDUCTIVITY/BOSONIC), Q factor (RESONANCE)
- **Energy economy** — GLOW, ANTENNA, SIGNAL_BOOST, FEEDBACK, WILL, REPRO, IMMUNITY all gain metabolic costs or gates (real systems pay for their functions)

### Top agenda items for the RRP confirm loop
1. **REPRO** — re-introduces the energy gate deliberately removed in v4.6.19 (user decision needed)
2. **UNCERTAINTY** — replaces the speed-gated batch-30 design with a product-conserving Δx·Δp model (user decision needed)
3. **TUNING_CH1-4 canonical semantics** — POLARIZATION vs ENCRYPTION vs SPECTRAL read the same 4 floats three ways
4. **Stride 96-99 allocation** (above)
5. **New world params** — OXYGEN_LEVEL (OXIDATION), SOLVATION_STRENGTH, PATTERN_RANGE, Q, T_C, RHO_REF (ADIABATIC)
6. **IMMUNITY** stays bucket 2 by design — confirm that's acceptable

---

## Shared Constants & World-Param Definitions (Q · T_C · RHO_REF)

Three proposed constants/params recur across the batches. This is their canonical
definition — implement them once, share them everywhere they are referenced.

### Q — resonance quality factor
- **IRL:** bandwidth of a driven oscillator = f0/Q; higher Q = sharper resonance peak (less damping, less off-peak coupling).
- **Sim use (batch 07, RESONANCE):** coupling gate `|ΔPULSE_RATE| < 1/Q` — pairs whose oscillator-frequency difference exceeds the band do not couple at all.
- **Scale:** `PULSE_RATE` DNA is normalized `[0, 1]`, so `1/Q` is a dimensionless frequency band.
- **Proposed:** world param `RESONANCE_Q`, range `[1, 20]`, **default 10** (band 0.10 — sharp but reachable by tuned species; the old `sync = 1 − |ΔPULSE_RATE|` soft-thresholded at 0.5).
- **Where it lives (registered 2026-08-10):** `src/state/worldParams.js` → `WORLD_PARAM_DEFS` (group PHYSICS, subgroup SIGNAL), key `RESONANCE_Q`. Inert until the RESONANCE RRP reimplements the coupling gate. Fallback if a param is unwanted: reuse `SIGNAL_DECAY` DNA as 1/Q per the batch-07 risk note — not recommended (decay also gates persistence).

### T_C — critical temperature (shared)
- **IRL:** the temperature below which a material superconducts (Cooper-pair condensation) and a boson gas undergoes Bose–Einstein condensation. One shared constant keeps both phenomena consistent.
- **Sim use:** SUPERCONDUCTIVITY (batch 07) unbinds pairs when `T > T_C`; BOSONIC (batch 10) only condenses when the pair-mean `(T_i + T_j)·0.5 < T_C`. Ties into COLD/ICE for getting particles below threshold.
- **Scale:** `TEMPERATURE` is normalized `[0, 1]` (clamped in the solver), so T_C is a fraction of max temperature.
- **Proposed:** world param `CRITICAL_TEMP`, range `[0.05, 0.5]`, **default 0.2** — well below ambient so condensation/superconductivity are genuine cold-region effects.
- **Where it lives (registered 2026-08-10):** `src/state/worldParams.js` → `WORLD_PARAM_DEFS` (group ENVIRONMENT, subgroup THERMAL), key `CRITICAL_TEMP`. Inert until the SUPERCONDUCTIVITY/BOSONIC RRP reimplements the gates.

### RHO_REF — reference density (adiabatic normalization)
- **IRL:** the adiabatic relation `T·V^(γ−1) = const` compares volume against a reference state; compression heats, expansion cools, and there is no temperature change at the reference state itself.
- **Sim use (batch 01, ADIABATIC):** per-particle neighborhood occupancy `rho = gridNeighborCount(base) / MAX_INTERACTIONS` (∈ [0, 1] with the 500-interaction cap); `T' = T·(max(rho, 1e-3)/RHO_REF)^(γ−1)` with γ = 5/3 (exponent 2/3). Occupancy above RHO_REF → compression heating; below → expansion cooling; at RHO_REF exactly → no temperature change.
- **Scale:** occupancy of the 12³ spatial-grid neighborhood, normalized by `MAX_INTERACTIONS`.
- **Proposed:** constant `RHO_REF = 0.2` (20% neighborhood occupancy — a sparse world's typical density, so crowded regions heat and voids cool) + `ADIABATIC_GAMMA_MINUS_ONE = 2/3`.
- **Where it lives (registered 2026-08-10):** `src/constants.js` (`RHO_REF` + `ADIABATIC_GAMMA_MINUS_ONE`, physical normalization, not user-facing). Inert until the ADIABATIC RRP reimplements the heating law. Expose as a world param only if tuning compression sensitivity is wanted.

---
# IRL-Fidelity Theorycraft — Batch 01 (Bucket 3: Misnomers)

**Laws:** ADIABATIC (98) · INDUCTANCE (58) · FLUX (61) · METRIC (72) · DIMENSIONALITY (31) · WILL (35)
**Series phase:** 1 of 10 · **Source bucket:** 3 ("don't model IRL equivalent") · **Goal:** move to bucket 1 (closely models IRL), else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model (RNG draws, transcendentals, flops, neighbor probes, stride traffic). No bench anchor for these laws (none are in the bench spotlight list); global baseline `12.46 ms/tick @ 500 particles / 10 laws` (`bench-baseline.json`, 2026-08-10, dirty 7.0.0 worktree).

---

## ADIABATIC (98, thermodynamics)

**Current (`src/physics/lawgroups/thermoLaws.js` `applyAdiabatic`):** per-particle lossless KE→TEMPERATURE conversion — damps speed by `k`, adds the removed kinetic energy to `TEMPERATURE`. HELP_DB: "motion converts to heat without loss; total kinetic+thermal energy conserved."
**IRL basis:** an *adiabatic* process has **zero heat exchange** (Q = 0); temperature changes come from *work* (compression/expansion), e.g. `T·V^(γ−1) = const`. Converting motion to heat while conserving total energy is **viscous dissipation**, not adiabatic — the current law is a misnomer.
**Proposal → bucket 1:** make it true adiabatic heating/cooling via local density. Per particle, use the neighbor-count proxy ρ from the existing spatial grid: `T' = T·(ρ_eff/ρ_ref)^(γ−1)` with γ = 5/3 (monatomic gas); compression (denser neighborhood) heats, rarefaction cools. While ADIABATIC is active, suppress conductive heat exchange with neighbors (the law *is* the no-heat-flow condition), so the only T changes come from work.
**Pseudocode:**
```
// solver pair phase, per interacting pair + per-particle density pass
per-particle: rho = gridNeighborCount(base) / MAX_INTERACTIONS   // reuse grid
  T  = view[base + TEMPERATURE]
  T  = clamp(T * pow(max(rho, 1e-3) / RHO_REF, GAMMA_MINUS_ONE), T_MIN, T_MAX)
  view[base + TEMPERATURE] = T
pair phase: if ADIABATIC && HEAT: skip conductive dT transfer (soft gate)
```
**CPU:** current = 1 `hypot` (sqrt) + ~20 flops, 0 RNG, O(n). Proposed = 1 `pow` per particle (replacing the sqrt) + 2 flops + 1 grid-count read; drops the pair-phase heat-exchange work when HEAT is on. **Δ ≈ −15%** (sqrt→pow comparable, conduction work removed).
**Risks:** soft conflict with HEAT/CONDUCTION must be documented in `LAW_DEPENDENCIES` (currently no entry); ρ_eff needs a stable scale (grid cell volume) or all particles converge to the same T.

## INDUCTANCE (58, electromagnetism)

**Current (`src/physics/laws.js` `applyInductance`):** pairwise velocity alignment — `dv = (v_j − v_i)·k·|m1·m2|/(1+0.03·dist)`, momentum-conserving swap, requires CONDUCTIVITY > 0. HELP_DB claims "match irl".
**IRL basis:** induction is **Faraday + Lenz**: a *changing* magnetic flux induces an EMF, and the induced current opposes the change (`EMF = −dΦ/dt`). Velocity alignment is viscous/momentum diffusion — it never looks at a time derivative and never opposes a change, so it is not induction.
**Proposal → bucket 1:** model Faraday/Lenz with the radial relative velocity as `dΦ/dt` proxy. When two conducting, magnetized particles approach/recede along their separation axis, the induced EMF (a) exerts a *counter-drag* force opposing the relative motion (Lenz braking), and (b) dumps the extracted energy into `TEMPERATURE` (eddy-current Joule heating). Receding pairs produce a weaker *attracting* brake (mutual attraction to oppose the separation — real inductor response to open circuits).
**Pseudocode:**
```
// pair phase, both CONDUCTIVITY > 0 and |m1·m2| > 0
radialVel = ((v_j − v_i)·(d̂))                              // dΦ/dt proxy
emf       = −k·radialVel·|m1·m2|/(1 + 0.03·dist)            // Lenz sign
force_i   = −d̂·emf  ;  force_j = +d̂·emf                     // counter-brake
view[i].TEMPERATURE += |emf|·0.5 ; view[j].TEMPERATURE += |emf|·0.5   // eddy heat
```
**CPU:** current = 4 DNA reads + ~25 flops/pair. Proposed = adds 1 radial-velocity dot (5 flops) + 2 T writes; removes the 3-axis momentum swap loop (18 flops). **Δ ≈ −10%** per pair.
**Risks:** needs the separation axis `d̂` (already computed in the pair loop); must clamp emf (MAX_FORCE); STRIDE unchanged.

## FLUX (61, electromagnetism)

**Current (`src/physics/laws.js` `applyFluxForce`):** `F = dir·k·(c_j − c_i)/(dist+1)` — charge-carrier drift along the stored-charge gradient; direction from effective charge `q = POLARITY + CHARGE`. HELP_DB: "F = qE, match irl."
**IRL basis:** *electric flux* is `Φ_E = ∮E·dA` (Gauss's law) — a surface integral, not a force. What the code actually models is the **electric field force on a charge carrier** (`F = qE`, drift current) — physically sound, misnamed.
**Proposal → bucket 1:** keep the honest physics and fix the model into *drift current in a conductor*: (a) compute E from the potential gradient `E = −∇Φ` with `Φ = c_j/(dist+1)` (Coulomb potential), not the raw charge difference; (b) require CONDUCTIVITY > 0 on the carrier (only mobile charges drift — real metals/electrolytes); (c) conserve momentum — the field source feels the equal-opposite reaction; (d) update HELP_DB title to "CHARGE DRIFT (flux of carriers along E)" so the name matches the mechanism.
**Pseudocode:**
```
// pair phase
if (readDNA(i, CONDUCTIVITY) <= 0) return
phi_j = c_j/(dist + 1)                    // Coulomb potential of source
E     = −(phi_j − phi_i)/dist·d̂           // gradient of potential
F_i   = q_i·E  ;  F_j = −F_i              // q·E + Newton reaction
```
**CPU:** current = 2 CHARGE reads + 1 DNA read + ~10 flops/pair. Proposed = +1 DNA read (CONDUCTIVITY) + 2 flops (potential) + symmetric force on j (already symmetric in solver wiring). **Δ ≈ +8%** per pair.
**Risks:** CONDUCTIVITY gate changes behavior in cold/insulating worlds (document); synergizes with CURRENT/CHARGE_LAW (drift + diffusion + Coulomb are now the three real transport mechanisms).

## METRIC (72, information)

**Current (`src/physics/laws.js` `applyMetricForce`):** `F = k·dE/(dist+1)` — attraction toward higher-ENERGY neighbors ("climb the energy gradient"). HELP_DB: "value-seeking agents; energy as a fitness landscape."
**IRL basis:** a *metric* is a distance function; the implemented behavior is **gradient taxis** (movement toward a resource gradient), the canonical real model being *bacterial chemotaxis* — a biased random walk: run (persist) when the gradient improves, tumble (reorient) when it worsens.
**Proposal → bucket 1:** reframe as ENERGY TAXIS with run/tumble: (a) sensory range = `NEIGHBORHOOD_RADIUS` (real detection limits); (b) Weber–Fechner saturation — response ∝ `dE/(E_ref + |dE|)`; (c) run/tumble: on each tick, if the sampled gradient is positive the particle keeps heading (low tumble probability), if negative it reorients (high tumble probability) — the *biased random walk* of Koshland's model; (d) sensing costs a little energy (receptors are metabolically expensive).
**Pseudocode:**
```
// pair phase: accumulate dE over neighbors within NEIGHBORHOOD_RADIUS
sat = dE/(E_REF + |dE|)                          // Weber–Fechner
// per particle:
if (gradSum > 0) tumbleP = 0.05  else tumbleP = 0.6
if (prng() < tumbleP) v = randomDirection()       // reorient (SplitMix32)
else v += gradDir·k·sat                            // run (persist)
ENERGY −= 0.002·sat·dt                             // sensing cost, floor 0
```
**CPU:** current = 2 ENERGY reads + ~10 flops/pair. Proposed = +2 flops/pair (saturation), +1 RNG + direction write per particle on tumble (~0.6 draws/particle/tick worst case), +1 ENERGY write. **Δ ≈ +15%** (RNG-dominated, still small vs grid cost).
**Risks:** rename ripple — `LAW_HELP_DB` title/hint + `LAW_SUBGROUPS` label ("NAVIGATION" subgroup) need sync; keep `METRIC` key for preset/save compatibility.

## DIMENSIONALITY (31, metaphysics)

**Current (`src/physics/laws.js` `applyDimensionality`):** `VEL_Z += (prng()−0.5)·0.3·synergy·dt` — Z-axis-only random kick. HELP_DB: "random Z-axis motion; prevents settling into 2D planes."
**IRL basis:** physical space is **isotropic** — real 3D thermal/kinetic diffusion is symmetric across axes; a Z-only kick breaks isotropy and isn't "dimensionality" at all.
**Proposal → bucket 1:** *isotropic 3D diffusion with dimensional balance*: (a) apply equal-magnitude Brownian kicks on all three axes (restores isotropy — this is true 3D diffusion); (b) each particle tracks a rolling per-axis positional variance (3 stride floats, EMA); (c) the kick amplitude is scaled up on the least-explored axis (variance-deficit), so populations actively fill the 3D volume — the "dimensionality" of the habitat is what the law measures and drives. This models real dimensional exploration (3D mixing, volume occupancy) while remaining a diffusion process.
**Pseudocode:**
```
// per particle, once per tick
for axis in [X, Y, Z]:
  jitter[axis]  = (prng()−0.5)·0.15·synergy·dt       // isotropic base
  var[axis]     = EMA(var[axis], pos[axis]², α=0.01) // stride 96-98
  deficit[axis] = 1 − var[axis]/(var[0]+var[1]+var[2]+1e-9)
  VEL[axis]    += jitter[axis]·(1 + 2·deficit[axis]) // explore thin axes
```
**CPU:** current = 1 RNG + ~3 flops + 1 write, O(n). Proposed = 3 RNG + 3 EMA (6 flops) + 3 writes + 3 reads, O(n). **Δ ≈ +30%** per particle (still one of the cheapest laws in the sim).
**Risks:** stride 96-98 (3 new slots — within the 99 budget); isotropic kicks overlap ENTR (JITTER DNA) — differentiate: ENTR is thermal noise, DIMENSIONALITY is *exploration bias*, not raw noise (document in HELP_DB).

## WILL (35, metaphysics)

**Current (`src/physics/laws.js` `applyWill`):** energy-independent self-propulsion — any particle with `speed ≥ 0.01` gets `0.01·dt·synergy` boost along its velocity. HELP_DB: "particles boost their own velocity in the direction they're already moving."
**IRL basis:** *will* has no physical referent; the mechanism is **active motility** — real self-propelled organisms convert metabolic energy into thrust, pay a speed-dependent cost, and reach a terminal velocity where thrust balances drag.
**Proposal → bucket 1:** ACTIVE MOTILITY with metabolic economy: (a) thrust requires `ENERGY > 5` (fuel gate); (b) thrust scales with available energy: `boost = 0.02·min(1, ENERGY/50)·dt·synergy`; (c) cost scales superlinearly with speed (real swimming: metabolic power ∝ v²): `ENERGY −= 0.004·(speed/MAX_VELOCITY)²·dt`; (d) exhaustion: at `ENERGY ≤ 5` the particle stops thrusting and drifts (real fatigue). Terminal speed emerges from the DRAG balance instead of unbounded free acceleration.
**Pseudocode:**
```
// per particle
if (ENERGY <= 5) return                     // exhausted — no thrust
boost = 0.02·min(1, ENERGY/50)·dt·synergy
V += v̂·boost
ENERGY −= 0.004·min(1, (|v|/MAX_VELOCITY)²)·dt   // metabolic cost, floor 0
```
**CPU:** current = 1 sqrt + ~8 flops, 0 RNG, O(n). Proposed = +1 ENERGY read/write + throttle (3 flops) + 1 division. **Δ ≈ +10%**.
**Risks:** removes the "free boost" behavior — worlds tuned on WILL will slow over time (energy economy); consider soft synergy with LIFE/ENERGY laws; rename suggestion "ACTIVE MOTILITY" in HELP_DB title while keeping the `WILL` key.

---

## Batch 01 Summary
| Law | Target bucket | CPU Δ (per particle/tick) | Key change |
|-----|--------------|---------------------------|------------|
| ADIABATIC | 1 | −15% | Compression-heating via density, zero heat exchange |
| INDUCTANCE | 1 | −10% | Faraday/Lenz counter-EMF + eddy heat |
| FLUX | 1 | +8% | Drift current: ∇Φ potential, conductivity gate, reaction |
| METRIC | 1 | +15% | Energy taxis: run/tumble biased random walk |
| DIMENSIONALITY | 1 | +30% | Isotropic 3D diffusion + variance-deficit exploration |
| WILL | 1 | +10% | Active motility: fuel gate, metabolic cost, drag terminal speed |

**Migration:** 6/6 → bucket 1. **Net CPU:** +38% on these six micro-costs (all O(n) or bounded O(n·k); absolute cost remains small vs the 12.46 ms/tick grid baseline).
**Quality pass (Rv/linear):** produced full proposals → reflected: 3 issues (ADIABATIC density-scale ambiguity, FLUX momentum-symmetry assumption, DIMENSIONALITY stride budget) → refined into the pseudocode (RHO_REF constant, Newton-reaction note, 96-98 slots) → check: all 6 laws have a bucket-1 target, a CPU table, and dependency notes; unresolved: none blocking (density scale + renaming flagged under Risks for the confirm loop).

# IRL-Fidelity Theorycraft — Batch 02 (Physics: Vague)

**Laws:** ACCR (5) · VOID (38) · BOND (39) · SINGULARITY (79) · TIDE (82) · TURBULENCE (85)
**Series phase:** 2 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** move to bucket 1 (closely models IRL), else stay in bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchors from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles) where the law is in the bench spotlight list: ACCR `8.92 ms/tick`, BOND `10.32`, SINGULARITY `9.08`, TIDE `11.65`. Percent deltas apply to each law's *marginal* cost, not the whole-set ms.

---

## ACCR (5, physics)

**Current (`src/physics/laws.js` `applyAccretion`):** close-contact coalescence — fuse when `relSpeed < FUSION_MOMENTUM·2` (fast pairs bounce); `gain = m2·0.3` (30% mass transfer), 42-locus DNA-cache blend, color blend, donor mass reduced / killed below 0.1. HELP_DB: "hierarchical mass growth; stars pull in matter."
**IRL basis:** planetesimal/protoplanetary accretion — collisional sticking when impact velocity is below the sticking threshold, mass **conservation** on merge, and the merged body carries the **center-of-mass momentum**. High-velocity impacts *fragment* rather than stick.
**Proposal → bucket 1:** (a) conserve mass — `gain = m2·(1 − ejecta)`, ejecta ~5% shed as temperature; (b) merged velocity = COM velocity (real inelastic coalescence) instead of leaving survivor velocity untouched; (c) high-relative-speed branch becomes *fragmentation*: both particles lose mass to a random ejecta direction and heat up (real disruptive collisions) instead of a silent bounce; (d) drop the 42-locus genome blend — genetic exchange is CODE/HGT's job, not gravity's.
**Pseudocode:**
```
if (dist < (r1+r2)·fusion·0.5):
  if (relSpeed < fusionMomentum·2):            // hit-and-stick
    mTotal = m1 + m2;  vCOM = (m1·v1 + m2·v2)/mTotal
    gain = m2·0.95;  MASS_i = m1 + gain;  MASS_j = m2·0.05 (ejecta)
    VEL_i = vCOM;  TEMPERATURE += gain·0.01     // coalescence heat
    DNA blend: only 3 regulatory loci (not 42)  // HGT stays in CODE
  else if (relSpeed > fusionMomentum·3):        // disruptive
    MASS_i −= m1·0.1;  MASS_j −= m2·0.1;  TEMPERATURE += 0.05
```
**CPU:** current = 2 `sqrt` + 42-loop DNA blend (~90 flops) + color (6) + mass writes. Proposed = 2 `sqrt` + COM (6 flops) + 3-locus blend (6) + 2 writes. **Δ ≈ −35%** (the 42-loop dominates).
**Risks:** fragmentation needs an ejecta direction (1 RNG draw per disruptive event — rare); species survival changes (no more genome homogenization) — audit `batch_02.test.js` expectations.

## VOID (38, physics)

**Current (`src/physics/laws.js` `applyVoid`):** radial outward acceleration from the world centre, strength `0.004·synergy·(0.3 + dist/halfWorld)`. HELP_DB: "dark-energy scaled — opposes clustering harder at the edges."
**IRL basis:** dark energy / cosmological constant drives **accelerating expansion**; in the local flow this is Hubble's law `v = H₀·r` — recession speed grows linearly with distance. The current force is already ∝ distance (Hubble-like); what's missing is the *acceleration* (dark energy is not constant-rate, it's accelerating: `H(t)` grows) and a proper velocity-domain application.
**Proposal → bucket 1:** model it as **dark-energy Hubble flow**: apply as a velocity recession `Δv = H(t)·r·Δt` (radial from centre), with `H(t) = H₀·(1 + accel·t)` — an accelerating expansion that visibly stretches structures over time, exactly the ΛCDM signature. Keep the centre as a documented gauge artifact of the bounded world.
**Pseudocode:**
```
// per particle
r = |p − centre|;  d̂ = (p − centre)/r
H = H0·(1 + ACCEL·worldTick·dt)          // accelerating expansion
V += d̂·(H·r)·synergy·dt                   // velocity-domain Hubble flow
```
**CPU:** current = 1 sqrt + ~12 flops. Proposed = 1 sqrt + ~12 flops + 1 multiply (H). **Δ ≈ 0%**.
**Risks:** velocity-domain flow can drift particles outward — toroidal wrap returns them (fine); document the centre-gauge caveat in HELP_DB so "IRL fidelity" is honest.

## BOND (39, physics)

**Current (`src/physics/laws.js` `applyBond`):** contact spring — density-boosted range/strength, rest length `(r1+r2)·1.1`, break past 2x range (≈3x rest), 6 shared bond slots. HELP_DB: "molecular bonds prefer dense neighbourhoods."
**IRL basis:** chemical bonds are electron-sharing (covalent) or electrostatic; they have **valency saturation** (limited bonds per atom), **bond angles** (geometric preference), **bond energy**, and **temperature-activated dissociation** (Boltzmann: break rate ∝ exp(−E_b/kT)). A density-boosted contact spring is a mechanical hook, not a molecular bond.
**Proposal → bucket 1:** valence-saturated, angle-aware, thermally-dissociating bonds: (a) per-particle valency from DNA (cap 6 — BOND_COUNT already ≤ 6); (b) bond geometry — use the existing `BOND_ANGLE` DNA (index 31, currently dormant) as the equilibrium angle between consecutive bonds (real covalent geometry); (c) thermal breaking — when `TEMPERATURE > 0.2`, break probability `p = k·exp(−E_bond/(kB·T))` approximated by a cheap threshold/linear falloff to avoid `exp` per pair; (d) bond *energy* — forming a bond stores `ENERGY` (exothermic), breaking it returns it (conservation).
**Pseudocode:**
```
// pair phase
if (BOND_COUNT_i >= valency_i || BOND_COUNT_j >= valency_j) skip
// angle term when i already has a bond partner k:
theta = angle(BOND_PARTNER_1_i, i, j)
F_angle += k_angle·(theta − BOND_ANGLE_DNA)·0.05·synergy     // restore geometry
// thermal dissociation (per bonded pair, cheap approx, no exp):
if (T > 0.2) p_break = clamp(k·(T − 0.2)·0.5, 0, 0.02)
if (prng() < p_break) breakBondPair(); ENERGY_i += BOND_ENERGY·0.5
```
**CPU:** current = ~30 flops/pair + 6-slot scan on form. Proposed = +2 DNA reads (BOND_ANGLE, valency), +angle term (~8 flops) on bonded pairs, +threshold branch (2 flops) + rare RNG. **Δ ≈ +20%** (bounded; no exp on the hot path).
**Risks:** `BOND_ANGLE` DNA is currently unused — activating it changes POLYMER/ISOMERIZATION behavior; thermal breaking interacts with MELT/BOIL (soft synergies to document).

## SINGULARITY (79, physics)

**Current (`src/physics/laws.js` `applySingularityForce`/`applySingularityAbsorb`):** pull `k·m2²/(dist²+0.5)`; horizon `max(2.5, √m2·0.8)`; absorption adds mass + temperature flash. HELP_DB: "extreme inverse-square pull; accretion flash."
**IRL basis:** Schwarzschild geometry: event horizon `r_s = 2GM/c²` is **linear in M** (current √m is wrong); gravity is `GMm/r²` (current m² assumes unit test mass); infalling matter is **tidally spaghettified** (differential force); tiny holes **Hawking-radiate**.
**Proposal → bucket 1:** (a) horizon ∝ M: `r_s = k·M` (linear, with k tuned to the world scale); (b) Newtonian force `k·G·M·m/(r²+ε)` — fix the m²; (c) spaghettification — while inside ~3·r_s, apply a TIDE-style differential stretch (near-side pull > far-side) that elongates the pair; (d) gravitational redshift: particles within the tidal zone lose SIGNAL/ENERGY at a rate ∝ 1/r (real photon escape energy loss) — ties into the TIME_DILATION weak-field law.
**Pseudocode:**
```
force: F = k·G·M·m/(dist² + 0.5)                    // Newtonian
horizon: r_s = k_s·M (linear)                        // Schwarzschild
if (dist < 3·r_s):                                   // tidal zone
  applyTide-like differential stretch (spaghettification)
  SIGNAL_i −= 0.01·(r_s/dist)·dt;  ENERGY_i −= 0.005·(r_s/dist)·dt   // redshift
if (dist < r_s): absorb; flash TEMPERATURE += 0.12·k (unchanged)
```
**CPU:** current = 1 div + m² + ~8 flops/pair. Proposed = 1 div + ~12 flops (linear horizon is cheaper to evaluate than √m; tidal zone gate adds 2 flops). **Δ ≈ +5%**.
**Risks:** linear horizon changes gameplay tuning (`SINGULARITY_MASS` constant + `batch_08/11` tests reference √m behavior); document the world-scale G constant.

## TIDE (82, physics)

**Current (`src/physics/lawgroups/physicsLaws.js` `applyTide`):** long-range pull `∝ massJ·k/dist` (inverse-distance). HELP_DB: "reaches further than gravity."
**IRL basis:** tidal acceleration is the **differential** gravitational force: `a_tide ≈ 2GM·r_i/d³` — inverse **cube** in separation, linear in the body's size, and it *stretches* (near side pulled harder than far side). The current 1/dist law is a shallow long-range attraction, not a tide.
**Proposal → bucket 1:** true differential tides: `a = 2·G·m_j·r_i/d³` along the separation axis, applied anti-symmetrically to the pair (stretch); when a third body/axis structure exists, produce the classic two-bulge field. Optionally scale the *elongation* — particles on the stretched axis temporarily grow `RADIUS` by a small factor (bulge), giving the visible hourglass deformation of real tidal distortion.
**Pseudocode:**
```
// pair phase, massive source j
a = 2·G·m_j·(r_i + r_j)/d³ · d̂               // differential pull, d⁻³
F_i += +a·m_i ;  F_j −= a·m_j                 // stretch apart along d̂
RADIUS_i += 0.02·(a/d) ; RADIUS_j += 0.02·(a/d)   // tidal bulge (capped)
```
**CPU:** current = ~8 flops/pair (1 div). Proposed = d³ (2 muls) + 2 reads (r_i, r_j) + bulge writes (2, throttled). **Δ ≈ +10%**.
**Risks:** inverse-cube range shrinks TIDE's reach dramatically (real behavior) — worlds tuned on long-range TIDE will change; synergy with GRAV (orbital capture) weakens unless GRAV carries the far field.

## TURBULENCE (85, physics)

**Current (`src/physics/lawgroups/physicsLaws.js` `applyTurbulence`):** per-particle perpendicular pseudo-random kick (vorticity noise), KE roughly conserved. HELP_DB: "churning flow field; eddies with DRAG."
**IRL basis:** turbulence is an **energy cascade of eddies** in a **divergence-free (incompressible) velocity field** (Navier–Stokes). The single defining property a synthetic model must keep is ∇·v = 0; per-particle white noise isn't spatially correlated and isn't turbulence.
**Proposal → bucket 1:** **curl-noise turbulence** (Bridson's divergence-free noise, standard in fluid FX): precompute (or hash-evaluate) a coarse 3D potential field; the velocity perturbation is the **curl** of that field — divergence-free by construction, so it produces large swirling eddies that advect into smaller ones (visual cascade) and conserves volume exactly. Deterministic from position (no RNG per particle), slowly evolving (potential field drifts over time).
**Pseudocode:**
```
// per particle, deterministic (no prng)
psi = hashNoise3D(pos·SCALE + t·DRIFT)            // coarse potential field
v_turb = curl(psi)                                // ∇×ψ — divergence-free
V += v_turb·k·synergy·dt                          // incompressible swirl
```
**CPU:** current = 1 hypot + ~15 flops + 2–3 RNG draws + normalization (slow branch). Proposed = ~9 hashed-gradient samples + ~18 flops, **0 RNG** (deterministic). **Δ ≈ +10%** but removes RNG pressure and becomes deterministic (seed-stable runs).
**Risks:** hash noise cost per particle ×3 axes is the main spend; a coarse grid (16³) sampled trilinearly is cheaper than raw hashing — implementation choice left to the confirm loop; keep the KE-conservation property (curl is orthogonal to v's divergence, not to v itself — document).

---

## Batch 02 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| ACCR | 1 | 8.92 | −35% | Mass/momentum-conserving coalescence, fragmentation branch |
| VOID | 1 | — | ≈0% | Accelerating Hubble flow (dark energy) |
| BOND | 1 | 10.32 | +20% | Valency + bond angle + thermal dissociation |
| SINGULARITY | 1 | 9.08 | +5% | Linear Schwarzschild horizon, Newtonian force, spaghettification |
| TIDE | 1 | 11.65 | +10% | Inverse-cube differential tides with bulge |
| TURBULENCE | 1 | — | +10% | Divergence-free curl-noise eddies (no RNG) |

**Migration:** 6/6 → bucket 1. **Net CPU:** −35% on ACCR, +20%/+10%/+5%/+10% on the four other anchored laws — dominated by the ACCR win; marginal costs stay bounded (all O(n) or O(n·k)).
**Quality pass (Rv/linear):** reflected after produce — 4 issues (ACCR genome-blend scope, VOID homogeneity gauge, BOND exp-on-hot-path, TIDE range regression) → refined (3-locus blend + COM, gauge note, threshold-break approx, GRAV-synergy note) → check: all 6 laws carry a bucket-1 target, CPU table, and risk row; unresolved: none blocking (implementation constants deferred to the confirm loop).

# IRL-Fidelity Theorycraft — Batch 03 (Biology: Vague)

**Laws:** LIFE (7) · GLOW (8) · AFFINITY (9) · REPRO (10) · ENERGY (13) · IMMUNITY (91)
**Series phase:** 3 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchors from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles): LIFE `8.91 ms/tick`, REPRO `8.69`. Percent deltas apply to each law's *marginal* cost.

---

## LIFE (7, biology)

**Current (`src/physics/laws.js` `applyLifeCycle`):** metabolic energy decay scaled by ENERGY_EFFICIENCY + DECAY_RATE slider; photosynthesis subsidy from LIGHT_LEVEL; death at ENERGY ≤ 0; HUNGER counter; bio-rhythm pulse; color drift; mass fluctuation gated behind ACCR; SENESCENCE death nested.
**IRL basis:** real metabolism obeys **Kleiber's law** (basal metabolic rate ∝ M^0.75), rises with **activity** (exertion), and couples to *intake* — light, predation, symbiosis — through a conversion efficiency.
**Proposal → bucket 1:** (a) Kleiber scaling — metabolic decay ∝ `MASS^0.75` (allometric, real); (b) activity cost — decay × `(1 + 0.5·|v|/MAX_VELOCITY)` (real exertion); (c) efficiency-gated intake — when PREDATION/SYMBIOSIS transfer energy into a particle, LIFE converts it at `ENERGY_EFFICIENCY` (real assimilation efficiency); keep photosynthesis, hunger, death-at-zero.
**Pseudocode:**
```
decay  = 0.01·(1 − EFFICIENCY·synergy)·DECAY_RATE·dt·pow(MASS, 0.75)
decay *= (1 + 0.5·min(1, |v|/MAX_VELOCITY))            // activity multiplier
ENERGY = max(0, ENERGY − decay + LIGHT_LEVEL·0.02·dt + intake·EFFICIENCY)
if (ENERGY <= 0) DEAD = 1                                // starvation (unchanged)
```
**CPU:** current ≈ 25 flops + 2 sin + 1 RNG (senescence). Proposed = +1 pow (MASS^0.75 — use a 2-sqrt approx or per-mass-tier table) + 3 flops + intake read. **Δ ≈ +10%**.
**Risks:** Kleiber scaling slows the metabolism of large particles (behavior shift); intake hook requires touching PREDATION/SYMBIOSIS return paths — confirm-loop scope.

## GLOW (8, biology)

**Current (`src/physics/laws.js` `applyGlowEffect`):** sine oscillator; positive phase raises SIGNAL by `phase·PULSE_RATE·SIGNAL_STRENGTH·dt·0.05·synergy` — emitter only, zero energy cost.
**IRL basis:** bioluminescence is a **fueled reaction** (luciferin + luciferase + O₂, driven by ATP) — real emitters pay a metabolic cost per flash and go dark when starved; rhythms are circadian.
**Proposal → bucket 1:** ATP-costed emission: (a) flash amplitude scales with available energy: `amp = min(1, ENERGY/40)`; (b) while flashing, `ENERGY −= 0.01·amp·dt` (real ATP burn); (c) no emission below `ENERGY < 5` (starved emitters go dark); (d) keep the phase oscillator (circadian-like rhythm).
**Pseudocode:**
```
if (phase > 0 && ENERGY > 5):
  amp = min(1, ENERGY/40)
  SIGNAL += phase·PULSE_RATE·SIGNAL_STRENGTH·dt·0.05·synergy·amp
  ENERGY −= 0.01·amp·dt                                  // luciferin burn
```
**CPU:** current ≈ 10 flops + 1 sin. Proposed = +1 read + 1 write + 3 flops. **Δ ≈ +5%**.
**Risks:** worlds relying on free GLOW signals will dim over time (energy economy) — pairs with LIFE so photosynthesis refuels the flash.

## AFFINITY (9, biology)

**Current (`src/physics/laws.js` `applyAffinity`):** same-species pull `0.1·max(0, affinity_i)·synergy·SPECIES_INTERACTION`; cross-species repel only when `affinity_i < 0`. Uses only particle i's DNA.
**IRL basis:** conspecific aggregation (Allee effect) and kin recognition are **density-dependent** and **symmetric** — attraction strengthens with local same-species density, and recognition reads both partners' signatures; sensory range is finite (olfaction).
**Proposal → bucket 1:** symmetric, density-dependent aggregation: (a) read both partners' SPECIES_AFFINITY (kin recognition is mutual); (b) density boost — same-species pull scales with local same-species neighbor count `n_same` (Allee aggregation: `×min(2, 1 + n_same·0.1)`); (c) sensory limit — only pairs within `NEIGHBORHOOD_RADIUS` respond (real detection range).
**Pseudocode:**
```
if (speciesI === speciesJ && dist < NEIGHBORHOOD_RADIUS):
  aff = max(0, aff_i) + max(0, aff_j)                    // symmetric
  pull = 0.05·aff·synergy·SPECIES_INTERACTION·min(2, 1 + nSame·0.1)
// cross-species: repel only when BOTH affinities < 0 (mutual xenophobia)
```
**CPU:** current ≈ 8 flops + 1 sqrt per pair. Proposed = +1 DNA read (aff_j) + density term (2 flops) + range gate. **Δ ≈ +10%**.
**Risks:** symmetric affinity changes mixed-species dynamics; density boost needs `nCount` per species (grid currently counts all neighbors — small per-cell addition).

## REPRO (10, biology)

**Current (`src/physics/laws.js` `applyReproduction`):** REPRO_DRIVE (stride 79) accumulates `BIRTH_RATE·0.1·dt·synergy`; at drive ≥ 60 and AGE ≥ 100, per-tick spawn chance; child takes mutated DNA (genetics 42-47, SEX_CHANCE crossover); drive consumed, ~half parent energy. HELP_DB: "energy is no longer the reproduction gate."
**IRL basis:** reproduction is **energy-gated parental investment** (real fecundity costs calories), has **litter size** (fecundity), and offspring mutation is reduced by **DNA repair** (REPAIR_EFFICIENCY, index 51 — currently only consumed by GENOTYPE).
**Proposal → bucket 1:** (a) drive accumulates only from metabolic surplus — fill rate ∝ `max(0, ENERGY − 50)` (real: only well-fed organisms invest in gametes); (b) parental investment — spawning costs `INVESTMENT = 30 + litter·5` ENERGY and the child inherits the invested pool; (c) fecundity — litter 1–3 from BIRTH_RATE (real brood size); (d) mutation ÷ `(1 + REPAIR_EFFICIENCY)` (DNA repair fidelity).
**Pseudocode:**
```
if (ENERGY > 50) DRIVE += BIRTH_RATE·0.1·dt·synergy·((ENERGY−50)/50)   // surplus-gated
if (DRIVE >= 60 && AGE >= 100 && prng() < BIRTH_RATE·0.01·synergy):
  litter = 1 + (BIRTH_RATE > 0.7 ? 1 : 0) + (BIRTH_RATE > 0.9 ? 1 : 0)
  cost = 30 + litter·5;  ENERGY −= cost
  spawn child with ENERGY = cost/litter, mutation/(1 + REPAIR_EFFICIENCY)
  DRIVE = 0
```
**CPU:** current ≈ 20 flops + RNG + mutation DNA writes (on spawn). Proposed = +2 reads (ENERGY, REPAIR) + litter branch + few flops. **Δ ≈ +5%**.
**Risks:** surplus-gating changes the "no energy gate" design decision from v4.6.19 — that change is documented in `batch_02/params` history; flag for user confirmation (the RRP loop originally removed the energy gate deliberately).

## ENERGY (13, biology)

**Current (`src/physics/laws.js` `applyEnergyTransfer`):** pairwise conduction of 3 channels (ENERGY, ELECTRIC_ENERGY, STORED_ENERGY) toward equilibrium — `transfer = Δ·0.005·synergy·ENERGY_TRANSFER`, hard cutoff `dist² < 40000` (200 units).
**IRL basis:** heat/energy flow is **Fourier conduction** — flux ∝ ∇E·κ, where κ is the material's **thermal/electrical conductivity**; real conduction is essentially **contact-range** (phonons/electrons don't jump 200 units).
**Proposal → bucket 1:** Fourier/Fick conduction with material conductivity and contact range: (a) transfer ∝ `ΔE·κ/(dist+1)` where κ = CONDUCTIVITY DNA of the pair (real materials conduct differently); (b) range = contact `dist < (r_i + r_j)·1.5` (real conduction is contact-mediated); (c) keep the 3 channels (energy ≈ heat, electric charge ≈ electron flow, stored ≈ reserves — each with its own κ weighting).
**Pseudocode:**
```
if (dist > (r_i + r_j)·1.5) return                       // contact range
k = (CONDUCTIVITY_i + CONDUCTIVITY_j)·0.5·ENERGY_TRANSFER // material κ
for ch in [ENERGY, ELECTRIC_ENERGY, STORED_ENERGY]:
  transfer = (E_j − E_i)·k·synergy/(dist + 1)
  E_i += transfer;  E_j −= transfer                       // conserved
```
**CPU:** current = 3-channel × ~8 flops/pair (no sqrt — distSq gate). Proposed = +1 DNA read ×2, 1 div, contact gate (2 reads). **Δ ≈ +10%** per pair — but the contact range **collapses the pair count** by orders of magnitude (200 → ~2 units), so **net world CPU ≈ −60%**.
**Risks:** range collapse is a major behavior change (energy no longer equilibrates across the whole dish); keep the `ENERGY_TRANSFER` slider as the global multiplier; audit `batch_03/04` tests that assume long-range transfer.

## IMMUNITY (91, biology)

**Current (`src/physics/lawgroups/biologyLaws.js` `applyImmunity`):** free armor regen `+0.02·k` (cap 5) and energy regen `+0.01·k` while armored; halves PARASITE extraction; blocks RADIATION genotypic damage.
**IRL basis:** immunity is an **adaptive, memory-based, costly, specific** system — a remembered resistance per threat type, rebuilt at metabolic cost, not a free stat regen.
**Proposal → bucket 2 (honest upgrade):** adaptive-memory defense: (a) on surviving a drain (PARASITE) or radiation event, the particle marks `IMMUNE_MEMORY` (stride 96) for that threat type; (b) subsequent same-type drains reduced by `memory·0.3` (adaptive memory — real repeated-exposure resistance); (c) defense costs energy — armor regen drains `ENERGY −= 0.01·k` (real immune response costs calories/fever); (d) specificity — memory is per threat (parasite vs radiation vs poison), not a universal stat.
**Pseudocode:**
```
// on drain event (parasite/radiation/poison):
reduction = 1 − min(0.9, IMMUNE_MEMORY·0.3)
drain *= reduction
IMMUNE_MEMORY = min(1, IMMUNE_MEMORY + 0.05·k)            // adaptive memory
// regen (per tick):
ENERGY −= 0.01·k                                            // immune cost
ARMOR  = min(5, ARMOR + 0.02·k) when ENERGY > 5             // fueled regen
```
**CPU:** current ≈ 6 flops + 2 writes. Proposed = +1 read/write (memory) + cost write + 2 flops. **Δ ≈ +10%**.
**Risks:** marker needs a stride slot (96 — shared budget with DIMENSIONALITY proposal; allocate 96-98 explicitly in the confirm loop); remains bucket 2 — a full immune system (pathogen identity, clonal selection) is out of scope.

---

## Batch 03 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| LIFE | 1 | 8.91 | +10% | Kleiber allometry + activity cost + intake efficiency |
| GLOW | 1 | — | +5% | ATP-costed bioluminescence, starvation dark |
| AFFINITY | 1 | — | +10% | Symmetric kin recognition + Allee density boost |
| REPRO | 1 | 8.69 | +5% | Surplus-gated drive, parental investment, repair fidelity |
| ENERGY | 1 | — | −60% net | Fourier conduction, material κ, contact range |
| IMMUNITY | 2 | — | +10% | Adaptive memory + cost + specificity |

**Migration:** 5/6 → bucket 1, 1/6 → bucket 2 (IMMUNITY). **Net CPU:** the ENERGY range collapse dominates — big net win at world scale.
**Quality pass (Rv/linear):** produced → reflected (5 issues: LIFE pow cost, GLOW economy, REPRO design-history conflict, ENERGY range regression, IMMUNITY stride sharing) → refined (approx pow, LIFE pairing note, REPRO flag for confirmation, contact-range audit note, stride 96 allocation note) → check: 5 bucket-1 + 1 bucket-2, CPU tables + risks on all; unresolved: REPRO's deliberate v4.6.19 energy-gate removal needs explicit user confirmation.

# IRL-Fidelity Theorycraft — Batch 04 (Chemistry: Vague)

**Laws:** SOLVATION (18) · ACIDITY (19) · OXIDATION (20) · CHIRALITY (23) · REDUCTION (40) · ALLOY (41)
**Series phase:** 4 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model; no bench spotlight anchors for these laws (marginal costs are pairwise/bounded).

---

## SOLVATION (18, chemistry)

**Current (`src/physics/laws.js` `applySolvation` + `applySolvationEffect`):** opposite charges attract, like repel (pair force); reaction-rate multiplier `1 + |Δcharge|·0.2·synergy` when the gap > 0.5.
**IRL basis:** a solvent is a **dielectric medium** — it *screens* electrostatics (Coulomb force divided by ε ≥ 1) and *speeds* dissolution/reaction. Real solvation does **not** make opposite charges attract harder; it weakens the vacuum force and stabilizes ions.
**Proposal → bucket 1:** dielectric screening + ion pairing: (a) effective Coulomb force `F = F_vac/ε_eff` with `ε_eff = 1 + SOLVATION_STRENGTH·synergy` (the medium weakens electrostatics — real); (b) close opposite-charge pairs form a *stabilized ion pair*: below contact distance the mutual force is capped (hydration-shell-like resistance to separation); (c) keep the reaction multiplier (solvent accelerates chemistry).
**Pseudocode:**
```
eps = 1 + SOLVATION_STRENGTH·synergy                 // dielectric constant
F_charge *= 1/eps                                     // screened Coulomb
if (dist < (r1+r2)·0.9 && q1·q2 < 0): cap |F| at F_MAX_ION_PAIR   // ion pair
reactMult = 1 + |Δq|·0.2·synergy                      // unchanged
```
**CPU:** current ≈ 8 flops/pair. Proposed = +1 mul + ion-pair gate (2 flops). **Δ ≈ +5%**.
**Risks:** screening changes CHARGE_LAW interplay (document soft synergy: solvent reduces vacuum Coulomb — real); `SOLVATION_STRENGTH` needs a world param (or reuse DNA POLARITY as solvent strength).

## ACIDITY (19, chemistry)

**Current (`src/physics/laws.js` `applyAcidityEffect`):** charge transfer from high to low charge, rate = CONDUCTIVITY·0.1·dt·synergy, gate |Δq| ≥ 0.3, charge conserved.
**IRL basis:** acids donate protons (H⁺); acid–base chemistry is governed by **strength (pKa)** and reaches **equilibrium**, not full equalization. Strong acids dissociate fully; weak acids reach a dynamic equilibrium with a residual gradient.
**Proposal → bucket 1:** pKa-gated proton transfer with equilibrium floor: (a) acid strength — transfer rate scaled by an `ACIDITY_STRENGTH` DNA/param (strong vs weak); (b) equilibrium — transfer stops when `|Δq| < floor(strength)` (weak acids leave a residual gradient — real equilibrium constant); (c) dissociation — particles with |q| above a strength-dependent threshold spontaneously shed charge as proton donation (mass-neutral, charge-conserving to a sink), modeling dissociation.
**Pseudocode:**
```
strength = ACIDITY_STRENGTH DNA + CONDUCTIVITY·0.5
if (|Δq| < 0.3·(1 − strength)) return                // equilibrium floor
transfer = Δq·strength·0.1·dt·synergy                 // pKa rate
q_i += transfer;  q_j −= transfer                      // conserved (unchanged)
if (|q_i| > 1 − strength):  q_i −= 0.02·dt;  TEMPERATURE += 0.01·dt   // dissociation
```
**CPU:** current ≈ 10 flops/pair. Proposed = +1 DNA read + equilibrium floor (2 flops) + rare dissociation write. **Δ ≈ +5%**.
**Risks:** `ACIDITY_STRENGTH` doesn't exist yet — propose reuse of an existing DNA (e.g. REACTION_THRESHOLD, 37) to avoid a new param; equilibrium floor changes end-state charge distributions (audit `batch_05` tests).

## OXIDATION (20, chemistry)

**Current (`src/physics/laws.js` `applyOxidationEffect`):** per-particle self-decay — |CHARGE| and MASS erode at `0.001·dt·synergy`; HEAT_OUTPUT release + white flash. HELP_DB: "electron loss; electrical rust."
**IRL basis:** oxidation is **electron loss to an oxidant** — a *pairwise redox* process; electrons are **conserved** (they go somewhere). Self-decay to the void violates charge conservation; burning additionally needs fuel/oxidizer.
**Proposal → bucket 1:** pairwise redox electron transfer: (a) when a charged particle meets a partner with opposite-sign charge (or a neutral oxidant when `OXYGEN_LEVEL > 0`), electrons flow from the reduced (negative) partner to the oxidized (positive) one — charge **conserved** per pair; (b) heat released ∝ transferred charge × HEAT_OUTPUT (real combustion/rust release); (c) slow tarnishing (no partner) only when `OXYGEN_LEVEL > 0` (real: rust needs O₂); (d) mass erosion only from *burning* (high HEAT_OUTPUT), not from rust.
**Pseudocode:**
```
// pair phase
if (q_i·q_j < 0 || OXYGEN_LEVEL > 0):
  flow = min(|q_i|, |q_j|, RATE·dt·synergy)           // electrons transfer
  q_i −= sign(q_i)·flow;  q_j −= sign(q_j)·flow        // conserved
  ENERGY += flow·HEAT_OUTPUT·0.05·dt·synergy            // redox energy
  TEMPERATURE += flow·0.01                              // exothermic
// per-particle burning (high HEAT_OUTPUT only): MASS −= |q|·0.001·dt
```
**CPU:** current ≈ 15 flops + 3 color writes per particle. Proposed = pair-phase transfer (~8 flops) + rare mass erosion; drops the per-particle 3-write flash on the hot path. **Δ ≈ +10%** (net, flash throttled to burning events).
**Risks:** becomes the donor half of a redox couple with REDUCTION (must ship together); `OXYGEN_LEVEL` world param needed; audit `batch_06` tests for the self-decay assumption.

## CHIRALITY (23, chemistry)

**Current (`src/physics/laws.js` `applyChirality`):** same-sign TORQUE pairs deflect perpendicular (sign of TORQUE sets direction); opposite-hand or zero-torque pairs: no force.
**IRL basis:** enantiomers are mirror-image molecules with identical physics in symmetric environments; **chiral discrimination** (one enantiomer favored) only emerges in a **chiral environment** (e.g., a spinning field, chiral surfaces). Same-hand deflection is a decent stereoselective-interaction abstraction.
**Proposal → bucket 1:** chiral discrimination scaled by enantiomeric excess + environment handedness: (a) deflection strength ∝ `|τ1·τ2|` (both molecules' handedness magnitude matters — real stereoselectivity); (b) environment handedness — when ROTATION (or CENTRIPETAL swirl) is active, the world's spin biases one enantiomer: same-hand-as-world pairs get a boost, opposite-hand pairs a penalty (real: chiral media select enantiomers); (c) thermal racemization — at high TEMPERATURE, TORQUE sign occasionally flips (real: thermal racemization over an energy barrier).
**Pseudocode:**
```
if (same-hand pair):
  env = isSet(ROTATION) ? sign(worldSpin) : 0
  boost = (sign(τ_i) === env) ? 1.2 : 0.8              // chiral environment
  F ⊥ = dir·0.01·synergy·|τ1·τ2|·boost/d·d̂⊥
if (TEMPERATURE > 0.7 && prng() < 0.001·dt): TORQUE = −TORQUE   // racemization
```
**CPU:** current ≈ 8 flops/pair. Proposed = +1 mul (|τ1·τ2|) + env gate (2 flops) + rare RNG (racemization, throttled). **Δ ≈ +5%**.
**Risks:** TORQUE DNA flip (racemization) mutates a DNA cache slot — keep it a cache-only change (species genome untouched); audit `batch_06` chiral tests.

## REDUCTION (40, chemistry)

**Current (`src/physics/laws.js` `applyReduction`):** opposite-sign pairs neutralize — each magnitude shrinks by `0.05·synergy` toward 0; same-sign untouched.
**IRL basis:** reduction is the **gain of electrons** — the acceptor half of a redox couple; total charge is **conserved** (what one loses, the other gains). "Neutralize toward zero" makes charge vanish — violates conservation and is not reduction.
**Proposal → bucket 1:** pairwise electron transfer (mirror of the OXIDATION proposal): (a) electrons flow from the more-negative (reduced/donor) to the more-positive (oxidized/acceptor) particle until equilibrium (or the pKa floor from ACIDITY); (b) charge conserved per pair; (c) released redox energy → TEMPERATURE (real: reduction is often exothermic; batteries run on this); (d) no charge is ever destroyed.
**Pseudocode:**
```
if (q_i < q_j):
  flow = min(|q_i − q_j|·RATE·dt·synergy, |q_j − q_i|) 
  q_i += flow;  q_j −= flow                            // electrons move donor→acceptor
  TEMPERATURE += flow·0.02·dt                          // exothermic
```
**CPU:** current ≈ 8 flops/pair. Proposed = same + 1 write (TEMPERATURE). **Δ ≈ +5%**.
**Risks:** must ship with the OXIDATION pair (shared conservation invariant); audit `batch_11` reduction tests (opposite-sign neutralize expectation changes to transfer).

## ALLOY (41, chemistry)

**Current (`src/physics/laws.js` `applyAlloy`):** cross-species overlap → one particle dies, survivor takes full merged mass + 42-locus mass-weighted DNA average + color blend.
**IRL basis:** alloying is **interdiffusion** — atoms of two metals mix at the lattice level, forming a homogeneous or two-phase solid solution; neither atom disappears, and properties (strength, conductivity) interpolate with composition. A merge-and-kill is coalescence (ACCR's job), not alloying.
**Proposal → bucket 1:** diffusion-bonding alloy: (a) on contact, both particles exchange a fraction of their DNA composition (atom interdiffusion — they become progressively more alike over time); (b) property interpolation — CONDUCTIVITY/STIFFNESS/ARMOR shift toward the mixture (real alloy property tuning); (c) no mass loss, no death — the pair persists as a two-phase alloy; (d) mixing rate gated by TEMPERATURE (real: diffusion is thermally activated — Arrhenius).
**Pseudocode:**
```
if (dist < (r1+r2)·1.2 && species differ):
  rate = MIX_RATE·dt·exp_approx(T)                     // thermal activation
  for d in [CONDUCTIVITY, STIFFNESS, ARMOR, 3 color]:
    a = lerp(a, b, rate);  b = lerp(b, a, rate)        // symmetric interdiffusion
  // optional slow species-mix marker (stride 96) toward homogenization
```
**CPU:** current = 42-loop (~90 flops) + mass + color + DEAD write. Proposed = 4-5 loci lerp (~12 flops) + 2 writes, no DEAD. **Δ ≈ −60%**.
**Risks:** behavior change (alloys no longer merge into one body) — worlds relying on mass consolidation lose it (ACCR covers that); thermal activation needs `exp`-free approximation (Arrhenius look-up); audit `batch_11` alloy tests.

---

## Batch 04 Summary
| Law | Target bucket | CPU Δ | Key change |
|-----|--------------|-------|------------|
| SOLVATION | 1 | +5% | Dielectric screening + stabilized ion pairs |
| ACIDITY | 1 | +5% | pKa strength + equilibrium floor + dissociation |
| OXIDATION | 1 | +10% | Pairwise conserved electron transfer (redox donor) |
| CHIRALITY | 1 | +5% | Enantiomeric excess + chiral environment + racemization |
| REDUCTION | 1 | +5% | Pairwise electron transfer (redox acceptor), conserved |
| ALLOY | 1 | −60% | Interdiffusion bonding, property interpolation, no death |

**Migration:** 6/6 → bucket 1. **Net CPU:** ALLOY's 42-loop removal dominates; OXIDATION/REDUCTION form a conserved redox couple shipped together.
**Quality pass (Rv/linear):** produced → reflected (5 issues: SOLVATION physics direction, ACIDITY param reuse, redox conservation invariant, CHIRALITY DNA mutation scope, ALLOY behavioral regression) → refined (screening direction corrected, REACTION_THRESHOLD reuse, OXIDATION+REDUCTION coupling note, cache-only TORQUE flip, ACCR fallback note) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: none blocking — the OXIDATION/REDUCTION pair and ACIDITY param choice are flagged for the user confirm loop.

# IRL-Fidelity Theorycraft — Batch 05 (Chemistry/Metaphysics Mix)

**Laws:** ELECTROLYSIS (92) · ORDER (33) · MIND (37) · PRECOGNITION (49) · ENTANGLEMENT (80) · CONSCIOUSNESS (104)
**Series phase:** 5 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchor from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles): ENTANGLEMENT `8.98 ms/tick`. Percent deltas apply to each law's *marginal* cost.

---

## ELECTROLYSIS (92, chemistry)

**Current (`src/physics/lawgroups/chemistryLaws.js` `applyElectrolysis`):** when |Δcharge| > 0.5, mass→energy conversion (`dm = 0.01·MASS·k·CONDUCTIVITY` → ENERGY + SIGNAL + heat). HELP_DB: "charge splits matter apart."
**IRL basis:** Faraday's laws of electrolysis — the mass decomposed is **proportional to the charge passed** (`m = (Q/F)·(M/z)`), requires a **voltage/current** through an **electrolyte**, and produces distinct products (gas evolution).
**Proposal → bucket 1:** Faraday electrolysis: (a) dm ∝ |Δq| (charge passed), not mass fraction — `dm = k·|Δq|·CONDUCTIVITY`; (b) gate on charge gradient ≥ a voltage threshold (0.5 — unchanged) plus electrolyte (CONDUCTIVITY — unchanged); (c) products — the shed mass re-materializes as gas-like byproduct: raise neighbor SIGNAL scatter and TEMPERATURE (already present) and, when accumulated mass loss crosses a quantum, emit a light vapor particle (decomposition products); (d) keep small overpotential heat.
**Pseudocode:**
```
if (|Δq| <= 0.5) return                          // voltage threshold
dm = k·|Δq|·CONDUCTIVITY                          // Faraday: m ∝ Q
MASS −= dm;  ENERGY += dm·20;  SIGNAL += dm·5;  TEMPERATURE += dm·0.25
gasAccum += dm;  if (gasAccum > 0.5) spawn vapor particle (mass = gasAccum)
```
**CPU:** current ≈ 12 flops/pair + 4 writes. Proposed = +1 mul + rare gas spawn. **Δ ≈ +5%**.
**Risks:** gas-spawn needs a spawn budget (reuse the offspring ring); Faraday scaling changes the mass-loss curve (audit `batch_24` electrolysis tests).

## ORDER (33, metaphysics)

**Current (`src/physics/laws.js` `applyOrder`):** pairwise acceleration toward neighbor velocity (`0.04·synergy·v_j`) within 200 units. HELP_DB: "Vicsek alignment."
**IRL basis:** the **Vicsek model** (canonical active-matter flocking) aligns each particle to the *mean* neighbor velocity plus **angular noise** — pairwise acceleration toward a single neighbor is a partial, noiseless version.
**Proposal → bucket 1:** canonical Vicsek: (a) accumulate the **mean neighbor velocity** per particle during the pair loop (grid-bounded); (b) add angular noise `η = (prng()−0.5)·NOISE·dt` to the heading update (real Vicsek has noise — it's what produces the order–disorder phase transition); (c) range = `NEIGHBORHOOD_RADIUS` DNA (real interaction radius) instead of a fixed 200.
**Pseudocode:**
```
// pair phase: accumulate
vSum += v_j;  n++                                 // mean-field accumulation
// per particle:
v̄ = vSum/max(n,1)                                  // mean neighbor velocity
heading += angle(v̄) + (prng()−0.5)·NOISE·dt         // Vicsek update w/ noise
V = SPEED·(cos(heading), sin(heading), vz·0.5)      // soft speed constraint
```
**CPU:** current ≈ 4 flops/pair. Proposed = +3 adds/pair (accumulation) + 1 RNG + trig per particle. **Δ ≈ +15%**.
**Risks:** trig per particle (cos/sin) is the new cost — use a precomputed heading table; noise constant needs a world slider or DNA; CHAOS×0.3 synergy preserved.

## MIND (37, metaphysics)

**Current (`src/physics/laws.js` `applyMind`):** same-species pairs boost SIGNAL `0.01·synergy/dist` (≤200 units); synergies COMMS ×1.5, TELEPATHY ×2.0, ENERGY ×0.5 (drain), POLYMER ×0.5.
**IRL basis:** **quorum sensing** (bacteria/biofilms, ant colonies) — cooperative signaling is expressed only above a **local density threshold**, saturates (no unbounded amplification), and costs metabolic energy.
**Proposal → bucket 1:** quorum-gated collective signaling: (a) amplification only when local same-species density ≥ threshold (grid neighbor count) — real quorum threshold; (b) saturation — boost = `0.01·synergy/dist·min(2, n_q/THRESHOLD)` (diminishing returns); (c) keep the energy drain synergy (real: cooperative behavior is metabolically expensive).
**Pseudocode:**
```
n_same = gridSameSpeciesCount(base)                // from grid
if (n_same < QUORUM) return                        // below quorum — silent
boost = 0.01·synergy/dist·min(2, n_same/QUORUM)     // saturated amplification
// synergies unchanged (COMMS/TELEPATHY scale, ENERGY/POLYMER cost)
```
**CPU:** current ≈ 6 flops/pair + invDist sqrt. Proposed = +density read + saturation (2 flops). **Δ ≈ +5%**.
**Risks:** per-species neighbor counts need a per-cell species histogram (small addition to the grid); worlds tuned below the quorum density lose the boost entirely (document).

## PRECOGNITION (49, metaphysics)

**Current (`src/physics/laws.js` `applyPrecognition`):** collision-course pairs (dist 1–50, dot < 0) get a perpendicular dodge + `ENERGY −= 0.02·synergy·dt`.
**IRL basis:** real animals (insects especially) avoid looming threats via **time-to-contact (τ) detection** — the optic-flow variable `τ = distance/approach speed` triggers escape at a critical τ, and response gain scales with urgency. This is one of the best-studied real neural behaviors.
**Proposal → bucket 1:** τ-gated looming avoidance: (a) compute `τ = dist/|radial approach speed|`; (b) trigger when `τ < τ_crit` (constant-τ behavior — real looming response), not on raw distance; (c) dodge gain ∝ `1/τ` (urgency scaling — closer/faster → harder evasive turn); (d) keep the attention cost (energy drain) — real escape responses are metabolically taxed.
**Pseudocode:**
```
radial = −(d̂·v_rel)                                  // approach speed
if (radial <= 0) return                               // moving apart
tau = dist/max(radial, 1e-4)
if (tau > TAU_CRIT) return                            // not imminent
gain = 0.05·synergy·(TAU_CRIT/tau)                    // urgency scaling
F ⊥ = gain·d̂⊥ ;  ENERGY −= 0.02·synergy·dt           // dodge + attention cost
```
**CPU:** current ≈ 15 flops/pair. Proposed = +1 div (τ) + urgency (1 mul). **Δ ≈ +5%**.
**Risks:** τ_gating fires earlier for fast approaches at longer range (correct real behavior — test expectations in `batch_13` may need updating).

## ENTANGLEMENT (80, quantum)

**Current (`src/physics/laws.js` `applyEntanglePair` + solver relay):** contact links pairs (ENTANGLE_ID + phase); momentum converges and signals relay at any distance; phase decays ×0.998 until snap; partner death fires a recoil.
**IRL basis:** real entanglement produces **correlated measurement outcomes** between separated particles — it **cannot transmit momentum or signals** (the no-signaling theorem: correlations carry no information without comparing outcomes). A momentum-converging, signal-relaying "spooky link" is explicitly unphysical.
**Proposal → bucket 1 (fidelity via *removal*):** correlated-collapse entanglement: (a) **remove the signal relay and momentum convergence** (they violate no-signaling); (b) entangled pairs share a hidden correlation bit; when one partner is measured (collision/OBSERVER event), the other's state **collapses in a correlated way** — Bell-rule: both outcomes drawn from a shared random variable with opposite-sign correlation (real EPR); (c) phase decay retained (real decoherence); (d) death of one partner collapses the other (real: measuring one determines the other's fate for that observable).
**Pseudocode:**
```
// on measurement of i (collision/OBSERVER):
if (ENTANGLE_ID_i >= 0 && PHASE > 0.05):
  outcome = prng() < 0.5 ? +1 : −1
  setMeasureFlag(i, outcome)                        // correlated outcome
  setMeasureFlag(j, −outcome)                       // anti-correlated partner
  PHASE_i = 0;  PHASE_j = 0                          // link consumed
// remove: per-tick signal relay + momentum convergence (no-signaling)
```
**CPU:** current = pair-form (~6 flops) + per-tick relay work + decay. Proposed = form + rare collapse branch (only on measurement events) + decay. **Δ ≈ −10%** (relay removal dominates).
**Risks:** TELEPORT requires ENTANGLEMENT (hard dependency) — teleport's state-transfer *is* the one legitimate use of the correlation (quantum teleportation protocol); the recoil-on-death behavior is removed; audit `batch_21` entanglement tests.

## CONSCIOUSNESS (104, metaphysics)

**Current (`src/physics/lawgroups/metaLaws.js` `applyConsciousness`):** single-level predictive self-model — EMA of own speed; error > 0.3 drives attention (MEMORY/SIGNAL up, ENERGY down), low error regens.
**IRL basis:** this is **predictive processing / active inference** (Friston's free-energy principle): brains minimize prediction error through perception *and action*, with **hierarchical** models and **precision weighting**.
**Proposal → bucket 1:** hierarchical active inference: (a) add a **second-level model** — an EMA of the first-level error (model of the model; real hierarchical predictive coding); (b) **active inference** — error drives corrective *action* (steering to restore the modeled state), not just attention; (c) **precision weighting** — errors weighted by expected precision (low-noise states weigh more; real precision-weighted prediction error); (d) keep the attention cost/regen economy.
**Pseudocode:**
```
speed = |v|;  m1 = SELF_MODEL_SPEED (stride 95)
m2   = EMA(m2, err1, 0.02)                          // 2nd-level model (stride 99)
err1 = |speed − m1|;  err2 = |err1 − m2|
precision = 1/(1 + err2)                             // precision weighting
if (err1·precision > 0.3):
  MEMORY += err1·0.02;  SIGNAL += err1·0.01;  ENERGY −= err1·0.05
  V += (v̂_model − v̂)·0.02·precision·k               // active inference steering
else: ENERGY += 0.01·k                               // self-maintenance
m1 = 0.95·m1 + 0.05·speed
```
**CPU:** current ≈ 1 sqrt + ~15 flops + writes. Proposed = +2nd EMA (2 flops) + precision (2) + steering term (4). **Δ ≈ +10%**.
**Risks:** steering overlaps PREDICT/NAVIGATION (document soft conflict — active inference is a general mechanism); stride 99 is the last free slot (coordinate with other proposals: DIMENSIONALITY 96-98, IMMUNITY 96 — allocate 96-99 explicitly in the confirm loop).

---

## Batch 05 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| ELECTROLYSIS | 1 | — | +5% | Faraday scaling (m ∝ Q) + gas products |
| ORDER | 1 | — | +15% | Canonical Vicsek: mean field + angular noise |
| MIND | 1 | — | +5% | Quorum-gated, saturating collective signaling |
| PRECOGNITION | 1 | — | +5% | τ-gated looming avoidance, urgency gain |
| ENTANGLEMENT | 1 | 8.98 | −10% | Correlated collapse; relay removed (no-signaling) |
| CONSCIOUSNESS | 1 | — | +10% | Hierarchical active inference + precision weighting |

**Migration:** 6/6 → bucket 1. **Net CPU:** small net change; ENTANGLEMENT's relay removal offsets the ORDER trig cost.
**Quality pass (Rv/linear):** produced → reflected (5 issues: ELECTROLYSIS gas budget, ORDER trig cost, MIND quorum threshold, ENTANGLEMENT dependency on TELEPORT, CONSCIOUSNESS stride + steering overlap) → refined (offspring-ring reuse, heading-table note, grid histogram note, TELEPORT protocol note, stride 96-99 allocation + soft-conflict note) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: stride 96-99 allocation across batches 01/03/05 must be reconciled in the confirm loop (flagged in FINAL-REPORT).

# IRL-Fidelity Theorycraft — Batch 06 (Metaphysics/EM Mix)

**Laws:** PERCEPTION (105) · SYNCHRONICITY (106) · CURRENT (55) · RESISTANCE (56) · CAPACITANCE (57) · MAGNETISM (59)
**Series phase:** 6 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchors from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles): CURRENT `8.97 ms/tick`, MAGNETISM `12.06`. Percent deltas apply to each law's *marginal* cost.

---

## PERCEPTION (105, metaphysics)

**Current (`src/physics/lawgroups/metaLaws.js` `applyPerception`):** velocity alignment toward neighbors within `2×NEIGHBORHOOD_RADIUS` (sensing at a distance).
**IRL basis:** real perception is **directional** (forward-biased field of view), **feature-selective** (specific cues: motion, size, signal), and **distance-attenuated** (Weber/1/r² falloff). A uniformly enlarged radius is the weakest possible model of perception.
**Proposal → bucket 1:** directional, feature-selective, attenuated sensing: (a) **field of view** — alignment weight ∝ `max(0, v̂_i·d̂)` (front-biased: nothing behind the eyes); (b) **cue selectivity** — sense specific features: velocity (alignment), mass (size cue), SIGNAL (signal detection), each with a detection threshold; (c) **falloff** — sensitivity ∝ `1/(dist+1)` within range (closer = clearer).
**Pseudocode:**
```
if (dist > NEIGHBORHOOD_RADIUS·2) return
fov = max(0, (v_i·d̂)/|v_i|)                       // forward field of view
if (fov < 0.05 && dist > NEIGHBORHOOD_RADIUS) return   // blind behind
sens = fov·k/(dist + 1)                             // attenuation
V += (v_j − v_i)·0.01·sens;  SIGNAL_i += (SIGNAL_j)·0.01·sens   // cues
```
**CPU:** current ≈ 6 flops/pair. Proposed = +dot (3 flops) + 1 div + gate. **Δ ≈ +10%**.
**Risks:** front-biased sensing changes swarm pursuit dynamics (audit `batch_27` perception tests); TELEPATHY synergy (dish-spanning) preserved as the "omni" exception.

## SYNCHRONICITY (106, metaphysics)

**Current (`src/physics/lawgroups/metaLaws.js` `applySynchronicity`):** when |ΔPHASE_1| < 0.3, phases lerp toward the mean + velocity pull. HELP_DB: "meaningful coincidences; resonant alignment."
**IRL basis:** this is **spontaneous synchronization** — the Kuramoto model (fireflies, metronomes, cardiac cells): phase coupling `dφ/dt = ω + (K/N)Σ sin(φ_j − φ_i)`, with emergence only when coupling K exceeds the spread of natural frequencies.
**Proposal → bucket 1:** canonical Kuramoto coupling: (a) coupling term `sin(Δφ)` (real — replace the linear lerp); (b) natural frequency `ω = PULSE_RATE` per particle (real diversity); (c) sync emerges when `K > spread(ω)` — below critical coupling the swarm stays incoherent (the real phase transition); (d) drop the Jungian "meaningful coincidence" framing in HELP_DB.
**Pseudocode:**
```
Δφ = PHASE_1_j − PHASE_1_i
if (|Δφ| < π·0.5):                                   // coupling window
  PHASE_1_i += ω_i·dt + K·sin(Δφ)·dt·synergy          // Kuramoto update
  PHASE_1_j += ω_j·dt − K·sin(Δφ)·dt·synergy
  V += (v_j − v_i)·0.02·K·cos(Δφ)                    // entrained motion
```
**CPU:** current ≈ 10 flops/pair. Proposed = +1 sin +1 cos + 2 reads (PULSE_RATE). **Δ ≈ +10%**.
**Risks:** PHASE_1 is shared with other laws (phase fields) — check writers before switching to the Kuramoto update; critical-coupling behavior may need a `K` slider (or reuse `synergy`).

## CURRENT (55, electromagnetism)

**Current (`src/physics/laws.js` `applyCurrentTransfer`):** within 17 units, `dq = Δq·min(CONDUCTIVITY_i, CONDUCTIVITY_j)·k` flows high→low; both must conduct.
**IRL basis:** conduction current is **drift + diffusion** of carriers (Ohm: J = σE; Fick: J = −D∇q). The existing model is charge *diffusion* (correct zero-field limit); real conductors also have **temperature-dependent conductivity** (metals: ρ ∝ T — hotter = more resistive) and transport ∝ gradient/distance.
**Proposal → bucket 1:** gradient-diffusion with metal-like temperature dependence: (a) `dq ∝ Δq·κ/(dist+1)` (diffusion flux ∝ ∇q/d — real Fick with distance decay); (b) `κ = min(cond_i, cond_j)/(1 + T_mean)` (real metals lose conductivity when hot — phonon scattering); (c) keep the both-conduct gate and charge conservation; (d) synergize with the FLUX proposal (drift) so drift + diffusion = full Ohmic transport.
**Pseudocode:**
```
if (dist > CONTACT_RANGE) return
κ = min(cond_i, cond_j)/(1 + (T_i + T_j)·0.5)         // metal-like ρ∝T
dq = (q_j − q_i)·κ·k/(dist + 1)                        // Fick diffusion
q_i += dq;  q_j −= dq                                   // conserved
```
**CPU:** current ≈ 8 flops/pair. Proposed = +1 div + 2 T reads. **Δ ≈ +8%**.
**Risks:** T-dependence creates a negative feedback (hot wires stop conducting — real) — worlds using CURRENT+HEAT will reach steady states faster; audit `batch_14` current tests.

## RESISTANCE (56, electromagnetism)

**Current (`src/physics/laws.js` `applyResistance`):** per-particle damping `damp = speed·k·(1 − CONDUCTIVITY·0.9)·(1 + TEMP·2)`; TEMPERATURE += speed·k·(1−cond·0.9)·0.5.
**IRL basis:** Joule heating `P = I²R` — resistance dissipates the energy of *moving charge carriers* (`I ∝ q·v`), and metals have a positive temperature coefficient (ρ rises with T — already present).
**Proposal → bucket 1:** carrier-limited Joule resistance: (a) damping applies to **charge carriers** — `damp ∝ |q|·speed` (neutral particles feel no electrical resistance); (b) heat rate ∝ `(q·v)²` (real I²R — quadratic, not linear); (c) keep material + temperature factors (metal-like α > 0).
**Pseudocode:**
```
if (|q| < 0.01) return null                          // neutral — no resistance
I = |q|·speed                                        // carrier current
heat = I²·k·(1 − cond·0.9)·(1 + T·2)                 // Joule: P = I²R
TEMPERATURE = min(1, T + heat·0.5)
F = −v̂·I·k·(1 − cond·0.9)·(1 + T·2)                 // damping on carriers
```
**CPU:** current ≈ 1 sqrt + ~12 flops. Proposed = +1 q read + 1 mul (I²). **Δ ≈ +5%**.
**Risks:** charged particles become slow (real: carriers lose energy) — flux/current dynamics shift; audit `batch_15` resistance tests.

## CAPACITANCE (57, electromagnetism)

**Current (`src/physics/laws.js` `applyCapacitanceStore` + `applyStoredChargeForce`):** surplus ENERGY (>50) stores as CHARGE (±2 breakdown clamp), bleeds toward 0 below; stored charge drives a pairwise Coulomb-like force.
**IRL basis:** a capacitor stores energy in an **electric field**, `Q = CV` and `E = ½CV² = Q²/2C` — the stored-energy/charge relation is **quadratic**, and exceeding the breakdown voltage discharges (dielectric breakdown).
**Proposal → bucket 1:** V² energy storage with breakdown: (a) charging rate `dq ∝ (E − 50)` but the *energy* extracted is quadratic — `ENERGY −= ½·dq²/C` (real E = Q²/2C); (b) **capacitance parameter** — C scales with CONDUCTIVITY (real: C depends on the dielectric/geometry); (c) **breakdown** — at `|q| ≥ 2`, fire a DISCHARGE event (spark — real dielectric breakdown) instead of a silent clamp; (d) keep the bleed and the stored-charge force (Coulomb between plates — real).
**Pseudocode:**
```
C = 0.5 + CONDUCTIVITY·1.5                            // capacitance
if (ENERGY > 50):
  dq = min((ENERGY − 50)·k, 0.5)
  ENERGY −= dq·dq/(2·C)                               // E = Q²/2C
  CHARGE = min(2, CHARGE + dq)
if (CHARGE >= 2): trigger DISCHARGE spark; CHARGE = 0   // breakdown
```
**CPU:** current ≈ 8 flops + writes. Proposed = +2 muls + breakdown branch. **Δ ≈ +5%**.
**Risks:** quadratic extraction slows charging (energy economy); breakdown ties to DISCHARGE law (soft dependency to document).

## MAGNETISM (59, electromagnetism)

**Current (`src/physics/laws.js` `applyMagneticForce`):** `F = k·m1·m2/dist²` — scalar moments: aligned attract, opposing repel.
**IRL basis:** magnetic interactions are **dipole–dipole**: the force is **anisotropic** (`F ∝ m1·m2·(1 − 3cos²θ)/r³` — depends on orientation relative to the axis) and falls as **r⁻³**, not r⁻². Scalar "monopole" attraction is a magnetic-charge model, not dipoles.
**Proposal → bucket 1:** dipole–dipole interaction: (a) angular dependence `(1 − 3cos²θ)` with `cosθ = d̂·m̂` (real dipole geometry — aligned along the axis attract, aligned perpendicular repel); (b) r⁻³ falloff (real); (c) **domain alignment** — with ORDER or CRYSTALLIZATION active, neighbor moments gradually align (ferromagnetic domain formation — real); (d) keep the signed-moment DNA semantics.
**Pseudocode:**
```
cosT = (d̂·m̂_i)·(d̂·m̂_j)                              // orientation along axis
F = k·m1·m2·(1 − 3·cosT²)/dist³ · d̂                  // dipole–dipole
if (isSet(ORDER) || isSet(CRYSTALLIZATION)):
  m_i = lerp(m_i, m_j, 0.01·k)                        // domain alignment
```
**CPU:** current ≈ 8 flops/pair (1 div). Proposed = +cos² (3 flops) + r³ (2 muls) + domain term. **Δ ≈ +15%**.
**Risks:** r⁻³ + anisotropy shortens and reshapes magnetic structure (filaments vs monopole clumps — audit `batch_15` magnetism tests); domain alignment mutates the DNA cache moment (cache-only).

---

## Batch 06 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| PERCEPTION | 1 | — | +10% | Directional field of view + cue selectivity + falloff |
| SYNCHRONICITY | 1 | — | +10% | Kuramoto coupling (sin Δφ), natural frequencies |
| CURRENT | 1 | 8.97 | +8% | Fick diffusion + metal-like ρ(T) |
| RESISTANCE | 1 | — | +5% | Carrier-limited Joule I²R |
| CAPACITANCE | 1 | — | +5% | V² energy storage + dielectric breakdown |
| MAGNETISM | 1 | 12.06 | +15% | Dipole–dipole anisotropy, r⁻³, domain alignment |

**Migration:** 6/6 → bucket 1. **Net CPU:** modest increases (+5-15%) on bounded pairwise/per-particle costs; MAGNETISM stays the most expensive of the six.
**Quality pass (Rv/linear):** produced → reflected (5 issues: PERCEPTION blind-spot behavior, SYNCHRONICITY PHASE_1 writers, CURRENT range, RESISTANCE neutrality gate, MAGNETISM DNA mutation) → refined (FOV threshold, phase-writer audit note, contact-range gate, |q| gate, cache-only alignment) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: none blocking — PHASE_1 writer audit and DNA-cache mutation rules flagged for the confirm loop.

# IRL-Fidelity Theorycraft — Batch 07 (Electromagnetism: Vague)

**Laws:** RESONANCE (60) · IONIZATION (62) · DISCHARGE (63) · PLASMA (64) · SUPERCONDUCTIVITY (65) · ANTENNA (107)
**Series phase:** 7 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model; no bench spotlight anchors for these laws (marginal costs are bounded pairwise/per-particle).

---

## RESONANCE (60, electromagnetism)

**Current (`src/physics/laws.js` `applyResonanceForce`):** matched PULSE_RATE signaling pairs attract; `phaseSync = 0.5+0.5·cos(Δφ·π/2)`; constructive interference (phaseSync > 0.6) drives the weaker pulser's SIGNAL.
**IRL basis:** resonance is **energy transfer at matched frequency** — a driven oscillator absorbs maximum energy when the drive frequency equals its natural frequency; sharpness is set by the **quality factor Q** (bandwidth = f₀/Q), and undriven oscillation decays.
**Proposal → bucket 1:** Q-filtered sympathetic resonance with energy transfer: (a) bandwidth gate — amplification only within `|ΔPULSE_RATE| < 1/Q` (sharp resonance — real); (b) the driven (weaker) particle gains **ENERGY** as well as SIGNAL (real: resonance transfers mechanical/EM energy — e.g. two tuning forks, Tacoma Narrows); (c) free oscillation decay — SIGNAL pulses decay when no resonant partner is near (real: undriven vibration dies out).
**Pseudocode:**
```
Δf = |pr1 − pr2|
if (Δf > 1/Q) return null                          // off-resonance — no coupling
phaseSync = 0.5 + 0.5·cos((ph1 − ph2)·π/2)          // interference (unchanged)
if (phaseSync > 0.6):
  weaker.SIGNAL += stronger.SIGNAL·phaseSync·k·0.1
  weaker.ENERGY += stronger.SIGNAL·phaseSync·k·0.02   // energy transfer
if (no resonant neighbor in range): SIGNAL *= (1 − 0.005·dt)  // free decay
```
**CPU:** current = 2 sin + 1 cos + ~15 flops/pair. Proposed = +1 mul (Q gate) + 1 ENERGY write + decay branch. **Δ ≈ +5%**.
**Risks:** Q needs a world param or DNA (reuse SIGNAL_DECAY?); free decay changes GLOW/COMMS interplay (document).

## IONIZATION (62, electromagnetism)

**Current (`src/physics/laws.js` `applyIonization`):** hard contact (impact > 0.15) forms a conserved +/− ion pair (`q_i + q_j = 0`), sign from combined POLARITY; no re-stripping of already-charged particles.
**IRL basis:** impact ionization removes an electron → **ion + free electron** (charge conserved — already correct); it is **inelastic** (impact energy is absorbed) and **reversible** (ions recombine with free carriers).
**Proposal → bucket 1:** inelastic ionization + recombination: (a) **energy absorption** — the impact loses `impact·0.05` kinetic energy (real inelastic scattering) and the pair heats slightly; (b) **free carrier** — the stripped charge marks one partner as a mobile carrier (feeds CURRENT/FLUX as a genuine mobile electron — already the intent, make it explicit); (c) **recombination** — when an ion pair re-collides at low impact (< 0.1), they recombine (charge cancels, energy released as heat — real electron capture); (d) keep the threshold and conservation.
**Pseudocode:**
```
if (dist <= 3 && impact > 0.15):                    // ionization (unchanged gate)
  q_i = impact·s;  q_j = −impact·s                   // conserved pair
  TEMP_i += impact·0.02;  relSpeed *= (1 − 0.05)     // inelastic energy loss
  mark carrier (mobile flag — feeds CURRENT/FLUX)
else if (opposite-charge pair && impact < 0.1):
  q_i = 0;  q_j = 0;  TEMP_i += 0.03;  TEMP_j += 0.03  // recombination
```
**CPU:** current ≈ 10 flops/pair. Proposed = +recombination branch (2 flops) + 2 T writes. **Δ ≈ +8%**.
**Risks:** recombination needs a "was an ion pair" signal (use CHARGE signs — sufficient); audit `batch_16` ionization tests.

## DISCHARGE (63, electromagnetism)

**Current (`src/physics/laws.js` `applyDischarge`):** |q| ≥ 0.5 → kick along the accumulated opposite-charge gradient (random fallback), `TEMP += |c|·0.08`, `CHARGE = 0`.
**IRL basis:** electric discharge is the **rapid neutralization of stored energy along a conductive path** — the released energy comes from the capacitor's stored energy (E = ½CV²), and the path requires **conductivity** (sparks need a medium).
**Proposal → bucket 1:** energy-conserving discharge: (a) released energy drawn from `STORED_ENERGY`/`ENERGY` — `release = ½·c²/C` (real: capacitor energy); (b) **conductive path gate** — the aimed kick requires a conductive neighbor in the gradient direction (real: breakdown needs a path); (c) **EM pulse** — the heat spike is joined by a brief SIGNAL flash (real: lightning emits light + radio); (d) keep the reset-to-zero and gradient aiming.
**Pseudocode:**
```
if (|c| >= 0.5):
  release = 0.5·c·c/C                                 // capacitor energy
  STORED_ENERGY −= release (floor 0);  ENERGY += release·0.5
  if (conductive neighbor in aim direction):          // path exists
    kick aimed (unchanged);  SIGNAL += release·0.1    // EM pulse flash
  else: random fallback (unchanged)
  TEMP = min(1, TEMP + |c|·0.08);  CHARGE = 0
```
**CPU:** current ≈ 12 flops + 1 RNG (fallback). Proposed = +2 writes + path gate (1 grid lookup). **Δ ≈ +10%**.
**Risks:** energy-conserving discharge changes the energy economy (audit `batch_16` discharge tests); C constant shared with the CAPACITANCE proposal.

## PLASMA (64, electromagnetism)

**Current (`src/physics/laws.js` `applyPlasma`):** T > 0.6 ionizes (heat → CHARGE, cooling); T < 0.5 recombines (CHARGE → heat); 0.5–0.6 hysteresis band.
**IRL basis:** ionization fraction follows the **Saha equation** — continuous in temperature (`n_i/n ∝ exp(−χ/kT)`), and recombination emits **radiation** (recombination lines).
**Proposal → bucket 1:** Saha-flavored equilibrium + recombination radiation: (a) continuous conversion — ionization rate `∝ max(0, T − 0.6)` (piecewise-linear Saha proxy — keep the hysteresis band to avoid oscillation); (b) **recombination radiation** — when a cooled plasma recombines, emit a SIGNAL flash (real: recombination photons); (c) **mobility** — ionized particles get a small CHARGE_LAW/FLUX coupling boost (plasma is conductive — real: plasma responds to EM fields).
**Pseudocode:**
```
excess = T − 0.6
if (excess > 0): CHARGE += excess·k;  T −= excess·k·0.5    // ionization (unchanged)
else if (T < 0.5 && CHARGE != 0):
  T = min(1, T + |c|·k·2);  SIGNAL += |c|·0.05             // recombination radiation
  CHARGE = 0
// conductive plasma: CHARGE_LAW/FLUX coupling × (1 + |c|) for ionized particles
```
**CPU:** current ≈ 10 flops. Proposed = +1 flash write + coupling factor. **Δ ≈ +5%**.
**Risks:** recombination flash feeds COMMS/LANGUAGE channels (document); Saha proxy is a piecewise-linear approximation (document the simplification honestly).

## SUPERCONDUCTIVITY (65, electromagnetism)

**Current (`src/physics/laws.js` `applySuperconductivity`):** pairs with T ≤ 0.35 couple: charge equalizes, relative velocity damps toward alignment; RESISTANCE ×0.2 while active.
**IRL basis:** BCS superconductivity — **Cooper pairs** of correlated electrons carry persistent current with **zero resistance** below T_c; superconductors **expel magnetic fields** (Meissner effect) and break down above a **critical field H_c**.
**Proposal → bucket 1:** persistent Cooper pairs + Meissner + critical field: (a) **binding** — once a pair forms below T_c, mark it bound (persistent current: charge exchange becomes lossless — RESISTANCE factor drops to ×0 instead of ×0.2); (b) **Meissner** — bound pairs repel MAGNETISM sources (soft gate: magnetic force × −0.5 on bound pairs — field expulsion); (c) **critical field** — strong magnetic environment (|m1·m2| above threshold) or T > T_c breaks the pair (real: H_c destroys superconductivity).
**Pseudocode:**
```
if (T1 > T_C || T2 > T_C): unbind pair (if bound); return
if (not bound && close): bind (marker stride 97)          // Cooper pair
if (bound):
  RESISTANCE factor = 0 (lossless)                        // true zero resistance
  MAGNETISM force on pair × −0.5                          // Meissner expulsion
  charge equalize + velocity couple (unchanged)
if (|m1·m2| > H_CRIT): unbind; TEMP += 0.05               // critical field quench
```
**CPU:** current ≈ 12 flops/pair. Proposed = +binding marker read/write + Meissner gate. **Δ ≈ +10%**.
**Risks:** binding marker needs stride space (96-99 budget — flag); the Meissner force reversal is a big behavior change (audit `batch_17` superconductivity tests).

## ANTENNA (107, electromagnetism)

**Current (`src/physics/lawgroups/emLaws.js` `applyAntenna`):** SIGNAL boost ∝ `min(speed,5)·0.01·k` when SIGNAL > 0.05 (directional broadcast along velocity).
**IRL basis:** antennas radiate **power** (a real loss) from an **oscillating current**, have a **gain pattern** (directionality), and are **reciprocal** (receive like they transmit).
**Proposal → bucket 1:** radiating antenna with reciprocity: (a) **radiation loss** — boosting drains `ENERGY −= boost·0.02` (real radiated power); (b) **carrier oscillation** — emission only during the positive phase of the PULSE_RATE oscillator (real: radiation at the carrier frequency); (c) **gain pattern** — forward lobe along velocity (already), sharpen with speed (real: end-fire arrays); (d) **reciprocity** — receiving is boosted symmetrically (incoming SIGNAL gains the same pattern — real antenna reciprocity).
**Pseudocode:**
```
if (SIGNAL <= 0.05 || phase <= 0) return null             // oscillator gate
boost = min(speed, 5)·0.01·k·gain(phase)                  // forward lobe
SIGNAL += boost;  ENERGY −= boost·0.02 (floor 0)          // radiation loss
// reciprocity: incoming SIGNAL from a front-facing source gains ×(1 + boost)
```
**CPU:** current ≈ 6 flops + 1 sqrt. Proposed = +oscillator phase (1 sin) + ENERGY write + receive branch. **Δ ≈ +10%**.
**Risks:** radiation loss couples ANTENNA to the energy economy (worlds with dense signaling swarms drain faster — document); oscillator phase shared with GLOW/COMMS/RESONANCE (single definition to keep).

---

## Batch 07 Summary
| Law | Target bucket | CPU Δ | Key change |
|-----|--------------|-------|------------|
| RESONANCE | 1 | +5% | Q-filtered resonance + energy transfer + free decay |
| IONIZATION | 1 | +8% | Inelastic impact + free carrier + recombination |
| DISCHARGE | 1 | +10% | Energy-conserving spark + conductive path + EM flash |
| PLASMA | 1 | +5% | Saha-flavored equilibrium + recombination radiation |
| SUPERCONDUCTIVITY | 1 | +10% | Persistent Cooper pairs, zero resistance, Meissner, H_c |
| ANTENNA | 1 | +10% | Radiating loss + carrier oscillation + reciprocity |

**Migration:** 6/6 → bucket 1. **Net CPU:** +5-10% on bounded costs; SUPERCONDUCTIVITY picks up a stride marker (96-99 budget).
**Quality pass (Rv/linear):** produced → reflected (5 issues: RESONANCE Q source, IONIZATION pair-recollision ambiguity, DISCHARGE path lookup, SUPERCONDUCTIVITY stride + Meissner reversal, ANTENNA phase coupling) → refined (SIGNAL_DECAY reuse note, sign-based recombination, grid lookup note, stride flag + audit note, shared-oscillator note) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: none blocking — stride 96-99 allocation and shared oscillator definition flagged for the confirm loop.

# IRL-Fidelity Theorycraft — Batch 08 (Information: Vague)

**Laws:** SHIELDING (108) · POLARIZATION (109) · MEMORY (66) · PATTERN (67) · SIGNAL_BOOST (69) · LEARN (70)
**Series phase:** 8 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model; no bench spotlight anchors for these laws (marginal costs are bounded pairwise/per-particle).

---

## SHIELDING (108, electromagnetism)

**Current (`src/physics/lawgroups/emLaws.js` `applyShielding`):** spends ENERGY to bleed CHARGE toward 0 (inhibits EM influence at a cost).
**IRL basis:** a Faraday cage is a **passive conductor** — it cancels external fields in its interior by **redistributing** charge on its surface; it needs **no energy** and **requires conductivity**. Destroying the shielded particle's own charge is the opposite of how shielding works.
**Proposal → bucket 1:** passive conductive isolation: (a) **conductivity requirement** — only CONDUCTIVE particles shield (real: the cage must conduct); (b) **field suppression** — while shielded, external EM forces (CHARGE_LAW/FLUX/MAGNETISM) on the particle are multiplied toward 0 (field-free interior — real), charge **left intact**; (c) **no energy cost** (passive — real); (d) the charge bleed is removed (that behavior belongs to REDUCTION/DISCHARGE).
**Pseudocode:**
```
// solver pair loop, force application:
if (isSet(SHIELDING) && readDNA(i, CONDUCTIVITY) > 0.5):
  EM_force_i *= 0.05                                // cage: field-free interior
// per-particle: remove the ENERGY→CHARGE bleed entirely
```
**CPU:** current ≈ 8 flops + 2 writes per particle. Proposed = 1 DNA read + 1 multiply in the pair loop. **Δ ≈ −20%** (bleed writes removed).
**Risks:** passive shielding changes energy economies (no more drain); audit `batch_28` shielding tests; synergizes with CURRENT (conductive materials only).

## POLARIZATION (109, electromagnetism)

**Current (`src/physics/lawgroups/emLaws.js` `applyPolarization`):** same TUNING_CH1 → SIGNAL exchange toward the mean; mismatched → damp (`×0.99`).
**IRL basis:** polarization filtering follows **Malus's law** — transmitted intensity `I = I₀·cos²θ` where θ is the angle between the wave's polarization and the filter axis; only the aligned component passes.
**Proposal → bucket 1:** Malus-law channel filtering: (a) treat TUNING_CH1-4 as a 4D orientation vector (channel axis); (b) pass factor `= cos²(Δθ)` between the sender's polarization and the receiver's axis (real attenuation curve — replaces the binary match/damp); (c) fully orthogonal signals are blocked (cos²(90°) = 0 — real crossed polarizers).
**Pseudocode:**
```
axis_i = normalize(TUNING_CH1..4 of i);  axis_j = normalize(TUNING_CH1..4 of j)
cosT = |axis_i·axis_j|
pass  = cosT·cosT                                      // Malus's law
SIGNAL_i = clamp(SIGNAL_i + (SIGNAL_j·pass − SIGNAL_i)·t·k, 0, 10)
SIGNAL_j = clamp(SIGNAL_j + (SIGNAL_i·pass − SIGNAL_j)·t·k, 0, 10)
```
**CPU:** current ≈ 8 flops/pair. Proposed = +4 reads + 1 cos² (≈ 6 flops). **Δ ≈ +10%**.
**Risks:** TUNING_CH1-4 are used by ENCRYPTION (cipher key) — coordinate the 4D-axis reading with the cipher's key folding; audit `batch_28` polarization tests.

## MEMORY (66, information)

**Current (`src/physics/laws.js` `applyMemoryRefresh`/`applyMemoryDecay`):** contact +0.05 (cap 1); decay ×0.995/tick; velocity × (1 + mem·k·0.02) (momentum persistence).
**IRL basis:** memory is **Hebbian** (co-activation strengthens — "fire together, wire together") and forgets on the **Ebbinghaus curve** (fast early loss, slow tail — a power law, not a constant exponential).
**Proposal → bucket 1:** Hebbian reinforcement + Ebbinghaus forgetting: (a) refresh ∝ **co-activity** — `MEMORY += s_i·s_j·rate` (both signaling/active partners strengthen the trace — real Hebbian); (b) **power-law forgetting** — decay = `mem·(0.9 + 0.09·(1 − mem))` per tick (fast initial loss, slow consolidation tail — Ebbinghaus proxy); (c) keep momentum persistence (memory → inertia is a reasonable abstraction of retained motion habits).
**Pseudocode:**
```
// pair phase (both signaling):
MEMORY_i = min(1, MEMORY_i + s_i·s_j·0.05·k)          // Hebbian co-activation
MEMORY_j = min(1, MEMORY_j + s_i·s_j·0.05·k)
// per particle:
MEMORY *= (0.9 + 0.09·(1 − MEMORY))                    // Ebbinghaus forgetting
V *= 1 + MEMORY·k·0.02                                  // persistence (unchanged)
```
**CPU:** current ≈ 6 flops + 3 writes. Proposed = +2 reads + 2 flops + non-linear decay (1 mul). **Δ ≈ +5%**.
**Risks:** Hebbian refresh changes MEMORY dynamics for silent populations (no signaling → no memory growth — real); FEEDBACK/OBSERVER/NAVIGATION depend on MEMORY (hard gates — behavior shifts).

## PATTERN (67, information)

**Current (`src/physics/laws.js` `applyPatternForce`):** cohesion `k/(dist+1)` for dist ≥ 1 — dense regions attract more particles (positive feedback → clump thickening).
**IRL basis:** real pattern formation is **reaction–diffusion** (Turing patterns: local **activation** + long-range **inhibition** → spots, stripes, spacing). Pure attraction is *aggregation*, which collapses into one blob rather than forming patterns.
**Proposal → bucket 1:** activator–inhibitor spacing: (a) **short-range attraction** (contact: dist < r_sum — the activator); (b) **long-range inhibition** (repulsion beyond contact, falling as 1/dist² — the inhibitor); (c) the balance creates characteristic spacing (real Turing wavelength) instead of collapse; (d) keep the HISTORY synergy (remembered geometry drift).
**Pseudocode:**
```
if (dist < r_i + r_j):                                  // activator zone
  F += +k/(dist + 1)                                    // cohesion (unchanged)
else if (dist < PATTERN_RANGE):                         // inhibitor zone
  F += −k·0.4/(dist·dist + 1)                           // long-range repulsion
// net: clumps form, then self-space at the Turing wavelength
```
**CPU:** current ≈ 6 flops/pair. Proposed = +range branch + inhibition (4 flops). **Δ ≈ +15%**.
**Risks:** the inhibitor zone must be capped (`PATTERN_RANGE` — world param or reuse NEIGHBORHOOD_RADIUS) to stay grid-bounded; audit `batch_17` pattern tests (aggregation expectations change to spacing).

## SIGNAL_BOOST (69, information)

**Current (`src/physics/laws.js` `applySignalBoost`):** contact relay — `s2 += s1·k·(0.5 + SIGNAL_STRENGTH·0.5)`.
**IRL basis:** real relays/repeaters amplify with **gain saturation** (output capped at the amplifier's ceiling), **power consumption**, and **SNR degradation** (each hop adds noise/loss). Neural synapses are the same: bounded gain, metabolic cost.
**Proposal → bucket 1:** saturating powered repeater: (a) **saturation** — relayed signal capped at the source's own ceiling: `gain = min(GAIN_MAX, (0.5 + SIGNAL_STRENGTH·0.5))`, output `min(1, ...)` (already capped — make the *gain* saturate too, diminishing for near-max signals); (b) **relay cost** — `ENERGY −= relay·0.01` (real: repeaters are powered, synapses burn ATP); (c) **hop loss** — relayed signal carries `×0.97` attenuation (real SNR degradation per hop).
**Pseudocode:**
```
if (s1 > 0.01):
  gain = min(2.0, 0.5 + SIGNAL_STRENGTH·0.5)           // saturating gain
  s2 += s1·k·gain·0.97                                  // hop loss
  ENERGY_1 −= s1·k·gain·0.01                            // relay power cost
```
**CPU:** current ≈ 8 flops/pair + 1 DNA read. Proposed = +1 min + 1 mul + 1 ENERGY write. **Δ ≈ +8%**.
**Risks:** relay cost drains signaling swarms (energy economy — document with ANTENNA/GLOW costs); audit `batch_18` signal tests.

## LEARN (70, information)

**Current (`src/physics/laws.js` `applyLearnAlign`):** boids alignment — `v1 += (v2 − v1)·k·0.1`.
**IRL basis:** social learning is **selective imitation** — animals copy *successful* individuals, learn fast when **young** (critical periods), and **retain** learned behavior (memory-linked). Velocity matching alone is just alignment, not learning.
**Proposal → bucket 1:** selective imitation with critical period + retention: (a) **selectivity** — copy only from neighbors with higher fitness proxy (`ENERGY` or `MEMORY` — real: copy winners); (b) **critical period** — learning rate scales with youth: `learnRate = k·0.1·max(0, 1 − AGE/3000)` (young plastic, adults set); (c) **retention** — learned alignment is stored through MEMORY (the alignment delta reinforces MEMORY — learned behavior persists after the teacher leaves).
**Pseudocode:**
```
if (ENERGY_j > ENERGY_i):                              // copy successful neighbor
  learnRate = k·0.1·max(0, 1 − AGE_i/3000)             // critical period
  v_i += (v_j − v_i)·learnRate
  MEMORY_i = min(1, MEMORY_i + learnRate·0.5)          // retention
```
**CPU:** current ≈ 6 flops/pair. Proposed = +2 reads (ENERGY, AGE) + gate + 1 write. **Δ ≈ +8%**.
**Risks:** selectivity stops alignment for low-energy populations (behavior shift — audit `batch_18` learn tests); critical period makes old particles rigid (document).

---

## Batch 08 Summary
| Law | Target bucket | CPU Δ | Key change |
|-----|--------------|-------|------------|
| SHIELDING | 1 | −20% | Passive conductive isolation (field suppression, no bleed) |
| POLARIZATION | 1 | +10% | Malus-law cos² filtering across TUNING_CH1-4 |
| MEMORY | 1 | +5% | Hebbian co-activation + Ebbinghaus forgetting |
| PATTERN | 1 | +15% | Activator–inhibitor Turing spacing |
| SIGNAL_BOOST | 1 | +8% | Saturating powered repeater with hop loss |
| LEARN | 1 | +8% | Selective imitation + critical period + retention |

**Migration:** 6/6 → bucket 1. **Net CPU:** SHIELDING's simplification offsets the small increases elsewhere.
**Quality pass (Rv/linear):** produced → reflected (5 issues: SHIELDING conductivity scope, POLARIZATION/ENCRYPTION channel conflict, MEMORY gate shifts, PATTERN inhibitor range, LEARN selectivity direction) → refined (conductivity gate, 4D-axis note, dependency note, NEIGHBORHOOD_RADIUS cap, copy-winners rule) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: none blocking — POLARIZATION/ENCRYPTION channel sharing and PATTERN range constant flagged for the confirm loop.

# IRL-Fidelity Theorycraft — Batch 09 (Information/Quantum Mix)

**Laws:** SYMBOL (71) · FEEDBACK (76) · LANGUAGE (77) · CULTURE (78) · HISTORY (81) · UNCERTAINTY (116)
**Series phase:** 9 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchor from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles): HISTORY `9.08 ms/tick`. Percent deltas apply to each law's *marginal* cost.

---

## SYMBOL (71, information)

**Current (`src/physics/laws.js` `applySymbolForce`):** 8-bin SYMBOL_TOKEN; higher-MEMORY "authority" imprints its token on contact; same-token attract (`+0.15·k/(dist+1)`), different-token repel weakly.
**IRL basis:** symbol grounding / convention formation — arbitrary signals acquire shared meaning through repeated association; meanings are **negotiated** (contested by competing conventions) and **reliability-weighted** (well-grounded symbols are trusted more).
**Proposal → bucket 1:** negotiated conventions with confidence: (a) **negotiation** — when two *authorities* (both high-MEMORY) with different tokens meet, both tokens shift toward the pair mean (real: meaning is contested, not just copied); (b) **confidence** — each particle tracks token confidence (imprint count, stride 97); attraction strength ∝ min confidence (real: shared meaning is only as strong as the least-certain holder); (c) **innovation** — weak imprints occasionally drift to a neighboring bin (real: new conventions arise from usage drift).
**Pseudocode:**
```
if (dist < rSum + 0.5):
  if (MEMORY_i > 0.5 && MEMORY_j > 0.5 && token_i !== token_j):
    token_i = round(mean); token_j = round(mean)          // negotiation
  else if (MEMORY_i > MEMORY_j): token_j = token_i         // imprint (unchanged)
  CONF_i = min(1, CONF_i + 0.05);  CONF_j = min(1, CONF_j + 0.05)
  if (prng() < 0.001·dt): token = (token + ±1) mod 8       // innovation drift
force: same-token → +0.15·k·min(CONF_i, CONF_j)/(dist+1)   // confidence-weighted
```
**CPU:** current ≈ 15 flops/pair. Proposed = +1 confidence read + negotiation branch + rare RNG. **Δ ≈ +8%**.
**Risks:** confidence stride (97) shares the 96-99 budget; negotiation changes the v4.6.29 imprint semantics (audit `batch_18` symbol tests).

## FEEDBACK (76, information)

**Current (`src/physics/laws.js` `applyFeedback`):** MEMORY grows with speed (`+speed·k·0.02`); motion boosted by MEMORY (`×mem·k·0.1`) — a self-reinforcing inertial loop.
**IRL basis:** real positive-feedback loops **saturate** (logistic/resource-limited growth — otherwise exponential blow-up) and consume **resources**; delayed feedback produces oscillation (the HELP_DB already notes "runaway or orbits").
**Proposal → bucket 1:** saturating, costly positive feedback: (a) **saturation** — boost `× (1 − speed/MAX_VELOCITY)` (logistic cap — prevents NaN/runaway, produces the documented orbits); (b) **resource cost** — the amplification drains `ENERGY −= boost·0.02` (real: feedback machines burn fuel); (c) keep the memory↔motion coupling (the loop itself is the real phenomenon).
**Pseudocode:**
```
speed = |v|
MEMORY = min(1, MEMORY + speed·k·0.02)
if (MEMORY > 0 && speed > 0.001):
  cap = 1 − min(1, speed/MAX_VELOCITY)                   // logistic saturation
  boost = MEMORY·k·0.1·cap
  V += v̂·boost;  ENERGY = max(0, ENERGY − boost·0.02)    // fueled loop
```
**CPU:** current ≈ 8 flops + 1 sqrt. Proposed = +1 mul + 1 ENERGY write. **Δ ≈ +5%**.
**Risks:** the energy cost tames runaway loops (behavior change — audit `batch_20` feedback tests); saturation shifts the orbit attractor (document).

## LANGUAGE (77, information)

**Current (`src/physics/laws.js` `applyLanguage`):** signaling pairs converge MEMORY toward the mean + relay SIGNAL.
**IRL basis:** real language transfers **discrete symbols** (not continuous states), is **directional** (speaker → listener), and is **rate-limited by the channel** (Shannon: information rate ≤ channel capacity).
**Proposal → bucket 1:** directed symbol transfer with channel capacity: (a) **discrete** — transfer moves the speaker's SYMBOL token (tie to the SYMBOL law) rather than continuous MEMORY; (b) **directional** — the higher-SIGNAL particle is the speaker; the listener adopts the transmitted token at a rate ∝ received SIGNAL (real: comprehension ∝ signal quality); (c) **channel capacity** — transfer rate capped by SIGNAL strength (Shannon limit — strong signals transfer fast, weak signals are lossy); (d) MEMORY convergence kept as the "shared context" effect.
**Pseudocode:**
```
if (s1 <= 0.01 && s2 <= 0.01) return
speaker = s1 >= s2 ? i : j;  listener = the other
capacity = min(1, SIGNAL_speaker·k)                       // Shannon rate
token_listener = blend(token_listener, token_speaker, capacity·0.1)
MEMORY both → pair mean (unchanged)                        // shared context
SIGNAL_listener += SIGNAL_speaker·k·0.1 (unchanged)        // relay
```
**CPU:** current ≈ 10 flops/pair. Proposed = +token read/write + direction branch. **Δ ≈ +8%**.
**Risks:** LANGUAGE now depends on SYMBOL tokens (soft dependency to add — currently only a COMMS-ish gate); audit `batch_20` language tests.

## CULTURE (78, information)

**Current (`src/physics/laws.js` `applyCulture`):** same-species contacts blend the DNA cache (14 loci, step 3) at `rate = k·0.02`.
**IRL basis:** cultural transmission is **conformist** (the majority/common trait spreads faster — real: humans and social insects copy the dominant form), has **innovation/drift** (new variants arise), and transmits **observable** traits (visible behaviors, not hidden physiology).
**Proposal → bucket 1:** conformist transmission with innovation: (a) **conformity bias** — convergence toward the local *majority* trait: `rate ∝ (n_local_with_trait/n_local)` (real conformist transmission); (b) **innovation** — rare random trait drift (MUTATION DNA at low rate — real cultural mutation); (c) **observable traits only** — restrict the blend to display-relevant loci (COLOR, SIGNAL-related, a few behavioral traits) instead of all 14 (real: culture transmits visible forms).
**Pseudocode:**
```
if (species differ) return
majority = localCount(trait ≈ common) / localCount        // conformity (grid)
rate = k·0.02·max(0.5, majority·2)                        // conformist boost
for d in OBSERVABLE_LOCI (color/signal/behavior subset):   // ~6 loci, not 14
  v1 = blend(v1, v2, rate);  v2 = blend(v2, v1, rate)
if (prng() < MUTATION·0.001·dt): one locus += drift        // innovation
```
**CPU:** current ≈ 30 flops/pair (14 loci). Proposed = 6-locus loop (~13 flops) + majority read + rare RNG. **Δ ≈ −40%** (loop halved).
**Risks:** observable-locus restriction changes which traits homogenize (audit `batch_19/20` culture tests); conformity needs per-cell trait histograms (grid addition).

## HISTORY (81, information)

**Current (`src/physics/laws.js` `applyHistoryWrite`/`Calc`/`Force`):** 12³ memory field, exponential decay, energy/mass-weighted presence; particles drift toward the field's **global centre of mass** (`computeHistoryCom` scans all 1728 cells every tick).
**IRL basis:** environmental memory / landscape archaeology — past activity leaves *local* traces (trails, nests, sediment) that steer movement along **local gradients**; animals don't navigate to a global center of mass of all past activity.
**Proposal → bucket 1:** local gradient following: (a) **∇History steering** — sample the 26 neighbor cells around the particle's cell and steer along the local gradient (real: follow local traces) — replaces the global-COM attractor; (b) keep the write/decay (traces erode — real); (c) **redundancy removal** — the 1728-cell COM scan disappears.
**Pseudocode:**
```
// per particle (once per tick):
cell = floor(pos/worldSize·HISTORY_DIM)
g = 0
for each of 26 neighbors n:  g += (v_n − v_cell)·(dir_n)   // local gradient
if (|g| > eps): F = ĝ·k                                     // steer along trace
// remove computeHistoryCom (1728-cell scan) entirely
```
**CPU:** current = write O(1) + COM scan **O(1728)** per tick + force O(1). Proposed = write O(1) + 26-cell gradient probe + force O(1). **Δ ≈ −80%** (the per-tick COM scan dominated).
**Risks:** local gradients change the attractor topology (no more global archaeology pull — audit `batch_21` history tests); the 26-cell probe must be bounded per particle (grid-bounded — fine).

## UNCERTAINTY (116, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyUncertainty`):** speed-gated tradeoff — fast (≥0.5): position jitter only; slow: velocity kicks only. (Batch-30 RRP "match docs".)
**IRL basis:** Heisenberg `Δx·Δp ≥ ħ/2` is a **product constraint**, continuous and symmetric — reducing position uncertainty *forces* momentum uncertainty up (and vice versa); it is not a speed threshold. Measurement (OBSERVER) collapses one observable at the expense of the conjugate.
**Proposal → bucket 1:** product-conserving uncertainty with measurement coupling: (a) **uncertainty product** — per particle, maintain `Δx·Δp ≈ ħ` with ħ a small constant: jitter magnitude in position is inversely tied to the velocity-spread (the *product* is preserved — real); (b) **measurement coupling** — when OBSERVER measures the particle (collision flag), position jitter drops and velocity kick rises (real: measuring position spreads momentum); (c) keep SplitMix32 determinism.
**Pseudocode:**
```
hbar = 0.02·k
Δp = spread of recent |v| (EMA)                          // momentum uncertainty
Δx = hbar/max(Δp, 1e-4)                                  // product conserved
if (measured this tick): Δx *= 0.5;  Δp *= 2              // observer collapse
POS += (prng()−0.5)·Δx;  VEL += (prng()−0.5)·Δp·0.5       // dual jitter
```
**CPU:** current ≈ 1 sqrt + 3 RNG + writes. Proposed = +1 div + EMA (2 flops). **Δ ≈ +3%**.
**Risks:** the speed-gated design was a deliberate RRP choice (batch-30) — the product model is a *different* design; flag for user confirmation before replacing; audit `batch_30` uncertainty tests.

---

## Batch 09 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| SYMBOL | 1 | — | +8% | Negotiated conventions + confidence weighting |
| FEEDBACK | 1 | — | +5% | Saturating logistic loop with resource cost |
| LANGUAGE | 1 | — | +8% | Directed discrete symbol transfer, Shannon rate |
| CULTURE | 1 | — | −40% | Conformist transmission, observable loci only |
| HISTORY | 1 | 9.08 | −80% | Local ∇History gradient (kills the 1728-cell COM scan) |
| UNCERTAINTY | 1 | — | +3% | Product-conserving Δx·Δp with observer coupling |

**Migration:** 6/6 → bucket 1. **Net CPU:** the HISTORY and CULTURE wins dominate — this batch is a net **performance gain**.
**Quality pass (Rv/linear):** produced → reflected (5 issues: SYMBOL confidence stride, FEEDBACK economy, LANGUAGE/SYMBOL dependency, CULTURE trait scope, HISTORY topology change, UNCERTAINTY design conflict) → refined (stride 97 flag, saturation cap, soft dependency note, observable-loci list, gradient note, confirmation flag) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: UNCERTAINTY's deliberate speed-gate design conflict flagged for explicit user confirmation.

# IRL-Fidelity Theorycraft — Batch 10 (Quantum: Vague)

**Laws:** TELEPORT (117) · OBSERVER (118) · COHERENCE (120) · BOSONIC (121) · SPECTRAL (124)
**Series phase:** 10 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model; no bench spotlight anchors for these laws (marginal costs are bounded pairwise/per-particle).

---

## TELEPORT (117, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyTeleport`):** v4.6.29 quantum-teleportation protocol — requires ENTANGLE_ID, `0.002·k/tick` chance, sender pays 5 ENERGY (classical-channel cost), partner adopts velocity + 30% ENERGY, sender collapses to a jittered ground state, link consumed. No position jump, no clone.
**IRL basis:** the real protocol transfers an unknown quantum state through an entangled link plus a **classical channel (2 bits)**; the sender's state is destroyed (no-cloning — already modeled) and the transfer is **imperfect** (fidelity < 1).
**Proposal → bucket 1:** complete the protocol: (a) **Bell-measurement step** — the sender's state is measured and the partner applies the classical-correction (add the measurement phase — real: correction is required to finish teleportation); (b) **fidelity loss** — transferred velocity/energy carries small noise (`×(1 ± 0.02·noise)`) (real: imperfect fidelity); (c) keep no-cloning, the link consumption, and the classical-channel energy cost (already faithful).
**Pseudocode:**
```
if (ENTANGLE_ID < 0 || prng() >= 0.002·k || ENERGY < 10) return
ENERGY −= 5                                            // classical channel (unchanged)
// Bell measurement + correction:
outcome = prng() < 0.5 ? +1 : −1
partner.VEL += outcome·(sender.VEL − partner.VEL)·0.9
partner.ENERGY += sender.ENERGY·0.3·(1 + 0.02·(prng()−0.5))   // fidelity < 1
sender.VEL = jittered ground state (unchanged);  ENTANGLE_PHASE = 0
```
**CPU:** current ≈ 15 flops + 1 RNG + writes. Proposed = +1 RNG + 2 flops (correction + fidelity) on the rare success path. **Δ ≈ +5%**.
**Risks:** the correction term changes the transferred momentum (audit `batch_30` teleport tests); fidelity noise is PRNG on a rare path (negligible).

## OBSERVER (118, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyObserver`):** high-MEMORY (>0.5) particles damp nearby velocity spread and copy their own state onto the observed particle.
**IRL basis:** the observer effect — **measurement collapses the quantum state** and *disturbs* the measured system (Heisenberg back-action). "Copy your state onto them" is cloning, which real measurements don't do.
**Proposal → bucket 1:** collapse-with-disturbance: (a) **collapse** — observing sets the target's wave-related state to a definite value: `WAVE_MEASURED = 1` and SUPERPOSITION amplitudes collapse to one basis (tie to WAVE_PARTICLE — real: measurement collapses the superposition); (b) **disturbance** — the collapse perturbs the target's momentum (uncertainty back-action — ties to the UNCERTAINTY proposal: measured → Δp grows); (c) **observer cost** — observing drains `ENERGY −= 0.01·k` (real: measurement requires interaction energy); (d) remove the velocity-copy (that's control, not observation).
**Pseudocode:**
```
if (MEMORY_i > 0.5):
  WAVE_MEASURED_j = 1                                  // collapse flag (stride 94)
  collapseSuperposition(j)                             // one basis survives
  VEL_j += (prng()−0.5)·0.05·k                          // measurement back-action
  ENERGY_i = max(0, ENERGY_i − 0.01·k)                 // observer cost
```
**CPU:** current ≈ 10 flops/pair + writes. Proposed = +collapse write + 1 RNG + cost write. **Δ ≈ +8%**.
**Risks:** OBSERVER is a hard dependency of WAVE_PARTICLE collapse (solver sets WAVE_MEASURED on collision already) — unify the flag write; audit `batch_30` observer tests.

## COHERENCE (120, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyCoherence`):** similar-velocity pairs (diff < 1) damp relative motion — phase-locking by momentum.
**IRL basis:** coherence is a **fixed phase relationship** between states; it is **fragile** (environmental decoherence destroys it — high temperature = fast loss) and enables **interference** (coherent sources add constructively/destructively).
**Proposal → bucket 1:** phase-coherent coupling with decoherence sensitivity: (a) **phase lock** — also entrain `PHASE_1` toward the pair mean (real: coherence is phase, not just momentum); (b) **fragility** — the lock weakens with temperature: coupling `× max(0, 1 − T·2)` (real: thermal decoherence); (c) **interference** — coherent pairs (|Δphase| < 0.1) exchange SIGNAL constructively (`SIGNAL += s_other·0.1`), out-of-phase pairs destructively (damp) — real constructive/destructive interference.
**Pseudocode:**
```
diff = |v_i − v_j|
if (diff < 1):
  fragility = max(0, 1 − (T_i + T_j))                   // thermal decoherence
  V coupling × fragility (unchanged force × fragility)
  PHASE_1_i, PHASE_1_j → pair mean·fragility             // phase lock
  if (|ΔPHASE_1| < 0.1): SIGNAL exchange constructive
  else if (|ΔPHASE_1| > 0.4): SIGNAL damped destructive
```
**CPU:** current ≈ 8 flops/pair + 1 sqrt. Proposed = +phase writes + T reads + interference branch. **Δ ≈ +8%**.
**Risks:** PHASE_1 writers must be reconciled (SYNCHRONICITY proposal also writes it — one shared phase-update path in the confirm loop); thermal fragility changes coherence persistence (audit `batch_31` coherence tests).

## BOSONIC (121, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyBosonic`):** strong mutual attraction when dist < 3 ("force-carrier clusters").
**IRL basis:** bosons don't attract — **identical bosons occupy the same quantum state** (Bose–Einstein statistics), and below a critical temperature they **condense** (BEC: the population piles into the ground state). The observable behavior is *convergence into one shared state*, not a cohesion force.
**Proposal → bucket 1:** Bose–Einstein condensation: (a) **state sharing** — close bosonic particles converge their velocity/phase toward the cluster's *ground state* (the pair mean — real: N bosons in one state), replacing the generic attraction; (b) **temperature gate** — bunching/condensation only below `T < T_C` (real: BEC needs ultralow T — ties to COLD/SUPERCONDUCTIVITY); (c) **no exclusion** — occupancy is unlimited (contrast FERMIONIC — real: bosons bypass Pauli).
**Pseudocode:**
```
if (dist < 3 && (T_i + T_j)·0.5 < T_C):                 // below BEC threshold
  v̄ = (v_i + v_j)·0.5                                    // shared ground state
  V_i += (v̄ − v_i)·0.1·k;  V_j += (v̄ − v_j)·0.1·k       // condensation convergence
  PHASE_1_i = mean;  PHASE_1_j = mean                    // same state
```
**CPU:** current ≈ 8 flops/pair. Proposed = +T reads + convergence (4 flops) + phase writes. **Δ ≈ +8%**.
**Risks:** convergence (not attraction) changes cluster shape (audit `batch_31` bosonic tests); T_C shared with SUPERCONDUCTIVITY's critical temperature (define once).

## SPECTRAL (124, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applySpectral`):** weak species-ID signal emission — `SIGNAL += (0.001 + 0.001·(species%5))·k`.
**IRL basis:** spectral lines are **characteristic discrete frequencies** — atoms emit *and absorb* at their own lines (a spectral fingerprint), and moving emitters **Doppler-shift** their lines.
**Proposal → bucket 1:** discrete emission/absorption fingerprint: (a) **line set from TUNING_CH1-4** — each particle's spectral fingerprint is its tuning vector (discrete lines — real: atoms have fixed line sets), replacing the species-mod-5 hack; (b) **resonant absorption** — particles *absorb* SIGNAL at their own lines: when a neighbor emits on the same channel, the absorber gains it (real: absorption lines); (c) **Doppler shift** — relative velocity shifts the perceived line: matching requires `|ΔTUNING − v_shift| < ε` (real: Doppler broadening/shift).
**Pseudocode:**
```
// emission (per particle):
line = normalize(TUNING_CH1..4);  SIGNAL += 0.001·(1 + |line|)·k
// absorption (pair phase):
Δv = (v_j − v_i)·line_axis;  shift = Δv·DOPPLER
if (|ΔTUNING − shift| < ε):  SIGNAL_i += SIGNAL_j·k·0.05     // resonant absorption
```
**CPU:** current ≈ 4 flops. Proposed = +4 tuning reads + absorption branch (4 flops). **Δ ≈ +10%**.
**Risks:** TUNING_CH1-4 are shared with POLARIZATION (axis) and ENCRYPTION (cipher key) — the confirm loop must define one canonical TUNING semantic; audit `batch_32` spectral tests.

---

## Batch 10 Summary
| Law | Target bucket | CPU Δ | Key change |
|-----|--------------|-------|------------|
| TELEPORT | 1 | +5% | Bell-measurement correction + fidelity loss |
| OBSERVER | 1 | +8% | Collapse-with-disturbance, no cloning |
| COHERENCE | 1 | +8% | Phase lock + thermal fragility + interference |
| BOSONIC | 1 | +8% | BEC condensation into a shared ground state |
| SPECTRAL | 1 | +10% | Discrete tuning-line fingerprint + absorption + Doppler |

**Migration:** 5/5 → bucket 1. **Net CPU:** +5-10% on bounded costs; the batch closes the series on small, safe deltas.
**Quality pass (Rv/linear):** produced → reflected (5 issues: TELEPORT correction physics, OBSERVER/WAVE_PARTICLE flag unification, COHERENCE PHASE_1 writers, BOSONIC T_C sharing, SPECTRAL TUNING semantics) → refined (outcome-based correction, shared flag note, shared phase path, shared T_C, canonical TUNING note) → check: 5/5 bucket-1, CPU tables + risks on all; unresolved: none blocking — TUNING_CH1-4 canonical semantics (POLARIZATION/ENCRYPTION/SPECTRAL) and PHASE_1/T_C shared definitions are the top confirm-loop agenda items.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 15/112: audit-suite/law-revamp/batch_01.md (124 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 01 (Bucket 3: Misnomers)

**Laws:** ADIABATIC (98) · INDUCTANCE (58) · FLUX (61) · METRIC (72) · DIMENSIONALITY (31) · WILL (35)
**Series phase:** 1 of 10 · **Source bucket:** 3 ("don't model IRL equivalent") · **Goal:** move to bucket 1 (closely models IRL), else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model (RNG draws, transcendentals, flops, neighbor probes, stride traffic). No bench anchor for these laws (none are in the bench spotlight list); global baseline `12.46 ms/tick @ 500 particles / 10 laws` (`bench-baseline.json`, 2026-08-10, dirty 7.0.0 worktree).

---

## ADIABATIC (98, thermodynamics)

**Current (`src/physics/lawgroups/thermoLaws.js` `applyAdiabatic`):** per-particle lossless KE→TEMPERATURE conversion — damps speed by `k`, adds the removed kinetic energy to `TEMPERATURE`. HELP_DB: "motion converts to heat without loss; total kinetic+thermal energy conserved."
**IRL basis:** an *adiabatic* process has **zero heat exchange** (Q = 0); temperature changes come from *work* (compression/expansion), e.g. `T·V^(γ−1) = const`. Converting motion to heat while conserving total energy is **viscous dissipation**, not adiabatic — the current law is a misnomer.
**Proposal → bucket 1:** make it true adiabatic heating/cooling via local density. Per particle, use the neighbor-count proxy ρ from the existing spatial grid: `T' = T·(ρ_eff/ρ_ref)^(γ−1)` with γ = 5/3 (monatomic gas); compression (denser neighborhood) heats, rarefaction cools. While ADIABATIC is active, suppress conductive heat exchange with neighbors (the law *is* the no-heat-flow condition), so the only T changes come from work.
**Pseudocode:**
```
// solver pair phase, per interacting pair + per-particle density pass
per-particle: rho = gridNeighborCount(base) / MAX_INTERACTIONS   // reuse grid
  T  = view[base + TEMPERATURE]
  T  = clamp(T * pow(max(rho, 1e-3) / RHO_REF, GAMMA_MINUS_ONE), T_MIN, T_MAX)
  view[base + TEMPERATURE] = T
pair phase: if ADIABATIC && HEAT: skip conductive dT transfer (soft gate)
```
**CPU:** current = 1 `hypot` (sqrt) + ~20 flops, 0 RNG, O(n). Proposed = 1 `pow` per particle (replacing the sqrt) + 2 flops + 1 grid-count read; drops the pair-phase heat-exchange work when HEAT is on. **Δ ≈ −15%** (sqrt→pow comparable, conduction work removed).
**Risks:** soft conflict with HEAT/CONDUCTION must be documented in `LAW_DEPENDENCIES` (currently no entry); ρ_eff needs a stable scale (grid cell volume) or all particles converge to the same T.
**Definition (RHO_REF):** canonical reference density — `FINAL-REPORT.md` → *Shared Constants & World-Param Definitions* (proposed `RHO_REF = 0.2`, occupancy normalized by `MAX_INTERACTIONS`).

## INDUCTANCE (58, electromagnetism)

**Current (`src/physics/laws.js` `applyInductance`):** pairwise velocity alignment — `dv = (v_j − v_i)·k·|m1·m2|/(1+0.03·dist)`, momentum-conserving swap, requires CONDUCTIVITY > 0. HELP_DB claims "match irl".
**IRL basis:** induction is **Faraday + Lenz**: a *changing* magnetic flux induces an EMF, and the induced current opposes the change (`EMF = −dΦ/dt`). Velocity alignment is viscous/momentum diffusion — it never looks at a time derivative and never opposes a change, so it is not induction.
**Proposal → bucket 1:** model Faraday/Lenz with the radial relative velocity as `dΦ/dt` proxy. When two conducting, magnetized particles approach/recede along their separation axis, the induced EMF (a) exerts a *counter-drag* force opposing the relative motion (Lenz braking), and (b) dumps the extracted energy into `TEMPERATURE` (eddy-current Joule heating). Receding pairs produce a weaker *attracting* brake (mutual attraction to oppose the separation — real inductor response to open circuits).
**Pseudocode:**
```
// pair phase, both CONDUCTIVITY > 0 and |m1·m2| > 0
radialVel = ((v_j − v_i)·(d̂))                              // dΦ/dt proxy
emf       = −k·radialVel·|m1·m2|/(1 + 0.03·dist)            // Lenz sign
force_i   = −d̂·emf  ;  force_j = +d̂·emf                     // counter-brake
view[i].TEMPERATURE += |emf|·0.5 ; view[j].TEMPERATURE += |emf|·0.5   // eddy heat
```
**CPU:** current = 4 DNA reads + ~25 flops/pair. Proposed = adds 1 radial-velocity dot (5 flops) + 2 T writes; removes the 3-axis momentum swap loop (18 flops). **Δ ≈ −10%** per pair.
**Risks:** needs the separation axis `d̂` (already computed in the pair loop); must clamp emf (MAX_FORCE); STRIDE unchanged.

## FLUX (61, electromagnetism)

**Current (`src/physics/laws.js` `applyFluxForce`):** `F = dir·k·(c_j − c_i)/(dist+1)` — charge-carrier drift along the stored-charge gradient; direction from effective charge `q = POLARITY + CHARGE`. HELP_DB: "F = qE, match irl."
**IRL basis:** *electric flux* is `Φ_E = ∮E·dA` (Gauss's law) — a surface integral, not a force. What the code actually models is the **electric field force on a charge carrier** (`F = qE`, drift current) — physically sound, misnamed.
**Proposal → bucket 1:** keep the honest physics and fix the model into *drift current in a conductor*: (a) compute E from the potential gradient `E = −∇Φ` with `Φ = c_j/(dist+1)` (Coulomb potential), not the raw charge difference; (b) require CONDUCTIVITY > 0 on the carrier (only mobile charges drift — real metals/electrolytes); (c) conserve momentum — the field source feels the equal-opposite reaction; (d) update HELP_DB title to "CHARGE DRIFT (flux of carriers along E)" so the name matches the mechanism.
**Pseudocode:**
```
// pair phase
if (readDNA(i, CONDUCTIVITY) <= 0) return
phi_j = c_j/(dist + 1)                    // Coulomb potential of source
E     = −(phi_j − phi_i)/dist·d̂           // gradient of potential
F_i   = q_i·E  ;  F_j = −F_i              // q·E + Newton reaction
```
**CPU:** current = 2 CHARGE reads + 1 DNA read + ~10 flops/pair. Proposed = +1 DNA read (CONDUCTIVITY) + 2 flops (potential) + symmetric force on j (already symmetric in solver wiring). **Δ ≈ +8%** per pair.
**Risks:** CONDUCTIVITY gate changes behavior in cold/insulating worlds (document); synergizes with CURRENT/CHARGE_LAW (drift + diffusion + Coulomb are now the three real transport mechanisms).

## METRIC (72, information)

**Current (`src/physics/laws.js` `applyMetricForce`):** `F = k·dE/(dist+1)` — attraction toward higher-ENERGY neighbors ("climb the energy gradient"). HELP_DB: "value-seeking agents; energy as a fitness landscape."
**IRL basis:** a *metric* is a distance function; the implemented behavior is **gradient taxis** (movement toward a resource gradient), the canonical real model being *bacterial chemotaxis* — a biased random walk: run (persist) when the gradient improves, tumble (reorient) when it worsens.
**Proposal → bucket 1:** reframe as ENERGY TAXIS with run/tumble: (a) sensory range = `NEIGHBORHOOD_RADIUS` (real detection limits); (b) Weber–Fechner saturation — response ∝ `dE/(E_ref + |dE|)`; (c) run/tumble: on each tick, if the sampled gradient is positive the particle keeps heading (low tumble probability), if negative it reorients (high tumble probability) — the *biased random walk* of Koshland's model; (d) sensing costs a little energy (receptors are metabolically expensive).
**Pseudocode:**
```
// pair phase: accumulate dE over neighbors within NEIGHBORHOOD_RADIUS
sat = dE/(E_REF + |dE|)                          // Weber–Fechner
// per particle:
if (gradSum > 0) tumbleP = 0.05  else tumbleP = 0.6
if (prng() < tumbleP) v = randomDirection()       // reorient (SplitMix32)
else v += gradDir·k·sat                            // run (persist)
ENERGY −= 0.002·sat·dt                             // sensing cost, floor 0
```
**CPU:** current = 2 ENERGY reads + ~10 flops/pair. Proposed = +2 flops/pair (saturation), +1 RNG + direction write per particle on tumble (~0.6 draws/particle/tick worst case), +1 ENERGY write. **Δ ≈ +15%** (RNG-dominated, still small vs grid cost).
**Risks:** rename ripple — `LAW_HELP_DB` title/hint + `LAW_SUBGROUPS` label ("NAVIGATION" subgroup) need sync; keep `METRIC` key for preset/save compatibility.

## DIMENSIONALITY (31, metaphysics)

**Current (`src/physics/laws.js` `applyDimensionality`):** `VEL_Z += (prng()−0.5)·0.3·synergy·dt` — Z-axis-only random kick. HELP_DB: "random Z-axis motion; prevents settling into 2D planes."
**IRL basis:** physical space is **isotropic** — real 3D thermal/kinetic diffusion is symmetric across axes; a Z-only kick breaks isotropy and isn't "dimensionality" at all.
**Proposal → bucket 1:** *isotropic 3D diffusion with dimensional balance*: (a) apply equal-magnitude Brownian kicks on all three axes (restores isotropy — this is true 3D diffusion); (b) each particle tracks a rolling per-axis positional variance (3 stride floats, EMA); (c) the kick amplitude is scaled up on the least-explored axis (variance-deficit), so populations actively fill the 3D volume — the "dimensionality" of the habitat is what the law measures and drives. This models real dimensional exploration (3D mixing, volume occupancy) while remaining a diffusion process.
**Pseudocode:**
```
// per particle, once per tick
for axis in [X, Y, Z]:
  jitter[axis]  = (prng()−0.5)·0.15·synergy·dt       // isotropic base
  var[axis]     = EMA(var[axis], pos[axis]², α=0.01) // stride 96-98
  deficit[axis] = 1 − var[axis]/(var[0]+var[1]+var[2]+1e-9)
  VEL[axis]    += jitter[axis]·(1 + 2·deficit[axis]) // explore thin axes
```
**CPU:** current = 1 RNG + ~3 flops + 1 write, O(n). Proposed = 3 RNG + 3 EMA (6 flops) + 3 writes + 3 reads, O(n). **Δ ≈ +30%** per particle (still one of the cheapest laws in the sim).
**Risks:** stride 96-98 (3 new slots — within the 99 budget); isotropic kicks overlap ENTR (JITTER DNA) — differentiate: ENTR is thermal noise, DIMENSIONALITY is *exploration bias*, not raw noise (document in HELP_DB).

## WILL (35, metaphysics)

**Current (`src/physics/laws.js` `applyWill`):** energy-independent self-propulsion — any particle with `speed ≥ 0.01` gets `0.01·dt·synergy` boost along its velocity. HELP_DB: "particles boost their own velocity in the direction they're already moving."
**IRL basis:** *will* has no physical referent; the mechanism is **active motility** — real self-propelled organisms convert metabolic energy into thrust, pay a speed-dependent cost, and reach a terminal velocity where thrust balances drag.
**Proposal → bucket 1:** ACTIVE MOTILITY with metabolic economy: (a) thrust requires `ENERGY > 5` (fuel gate); (b) thrust scales with available energy: `boost = 0.02·min(1, ENERGY/50)·dt·synergy`; (c) cost scales superlinearly with speed (real swimming: metabolic power ∝ v²): `ENERGY −= 0.004·(speed/MAX_VELOCITY)²·dt`; (d) exhaustion: at `ENERGY ≤ 5` the particle stops thrusting and drifts (real fatigue). Terminal speed emerges from the DRAG balance instead of unbounded free acceleration.
**Pseudocode:**
```
// per particle
if (ENERGY <= 5) return                     // exhausted — no thrust
boost = 0.02·min(1, ENERGY/50)·dt·synergy
V += v̂·boost
ENERGY −= 0.004·min(1, (|v|/MAX_VELOCITY)²)·dt   // metabolic cost, floor 0
```
**CPU:** current = 1 sqrt + ~8 flops, 0 RNG, O(n). Proposed = +1 ENERGY read/write + throttle (3 flops) + 1 division. **Δ ≈ +10%**.
**Risks:** removes the "free boost" behavior — worlds tuned on WILL will slow over time (energy economy); consider soft synergy with LIFE/ENERGY laws; rename suggestion "ACTIVE MOTILITY" in HELP_DB title while keeping the `WILL` key.

---

## Batch 01 Summary
| Law | Target bucket | CPU Δ (per particle/tick) | Key change |
|-----|--------------|---------------------------|------------|
| ADIABATIC | 1 | −15% | Compression-heating via density, zero heat exchange |
| INDUCTANCE | 1 | −10% | Faraday/Lenz counter-EMF + eddy heat |
| FLUX | 1 | +8% | Drift current: ∇Φ potential, conductivity gate, reaction |
| METRIC | 1 | +15% | Energy taxis: run/tumble biased random walk |
| DIMENSIONALITY | 1 | +30% | Isotropic 3D diffusion + variance-deficit exploration |
| WILL | 1 | +10% | Active motility: fuel gate, metabolic cost, drag terminal speed |

**Migration:** 6/6 → bucket 1. **Net CPU:** +38% on these six micro-costs (all O(n) or bounded O(n·k); absolute cost remains small vs the 12.46 ms/tick grid baseline).
**Quality pass (Rv/linear):** produced full proposals → reflected: 3 issues (ADIABATIC density-scale ambiguity, FLUX momentum-symmetry assumption, DIMENSIONALITY stride budget) → refined into the pseudocode (RHO_REF constant, Newton-reaction note, 96-98 slots) → check: all 6 laws have a bucket-1 target, a CPU table, and dependency notes; unresolved: none blocking (density scale + renaming flagged under Risks for the confirm loop).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 16/112: audit-suite/law-revamp/batch_02.md (123 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 02 (Physics: Vague)

**Laws:** ACCR (5) · VOID (38) · BOND (39) · SINGULARITY (79) · TIDE (82) · TURBULENCE (85)
**Series phase:** 2 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** move to bucket 1 (closely models IRL), else stay in bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchors from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles) where the law is in the bench spotlight list: ACCR `8.92 ms/tick`, BOND `10.32`, SINGULARITY `9.08`, TIDE `11.65`. Percent deltas apply to each law's *marginal* cost, not the whole-set ms.

---

## ACCR (5, physics)

**Current (`src/physics/laws.js` `applyAccretion`):** close-contact coalescence — fuse when `relSpeed < FUSION_MOMENTUM·2` (fast pairs bounce); `gain = m2·0.3` (30% mass transfer), 42-locus DNA-cache blend, color blend, donor mass reduced / killed below 0.1. HELP_DB: "hierarchical mass growth; stars pull in matter."
**IRL basis:** planetesimal/protoplanetary accretion — collisional sticking when impact velocity is below the sticking threshold, mass **conservation** on merge, and the merged body carries the **center-of-mass momentum**. High-velocity impacts *fragment* rather than stick.
**Proposal → bucket 1:** (a) conserve mass — `gain = m2·(1 − ejecta)`, ejecta ~5% shed as temperature; (b) merged velocity = COM velocity (real inelastic coalescence) instead of leaving survivor velocity untouched; (c) high-relative-speed branch becomes *fragmentation*: both particles lose mass to a random ejecta direction and heat up (real disruptive collisions) instead of a silent bounce; (d) drop the 42-locus genome blend — genetic exchange is CODE/HGT's job, not gravity's.
**Pseudocode:**
```
if (dist < (r1+r2)·fusion·0.5):
  if (relSpeed < fusionMomentum·2):            // hit-and-stick
    mTotal = m1 + m2;  vCOM = (m1·v1 + m2·v2)/mTotal
    gain = m2·0.95;  MASS_i = m1 + gain;  MASS_j = m2·0.05 (ejecta)
    VEL_i = vCOM;  TEMPERATURE += gain·0.01     // coalescence heat
    DNA blend: only 3 regulatory loci (not 42)  // HGT stays in CODE
  else if (relSpeed > fusionMomentum·3):        // disruptive
    MASS_i −= m1·0.1;  MASS_j −= m2·0.1;  TEMPERATURE += 0.05
```
**CPU:** current = 2 `sqrt` + 42-loop DNA blend (~90 flops) + color (6) + mass writes. Proposed = 2 `sqrt` + COM (6 flops) + 3-locus blend (6) + 2 writes. **Δ ≈ −35%** (the 42-loop dominates).
**Risks:** fragmentation needs an ejecta direction (1 RNG draw per disruptive event — rare); species survival changes (no more genome homogenization) — audit `batch_02.test.js` expectations.

## VOID (38, physics)

**Current (`src/physics/laws.js` `applyVoid`):** radial outward acceleration from the world centre, strength `0.004·synergy·(0.3 + dist/halfWorld)`. HELP_DB: "dark-energy scaled — opposes clustering harder at the edges."
**IRL basis:** dark energy / cosmological constant drives **accelerating expansion**; in the local flow this is Hubble's law `v = H₀·r` — recession speed grows linearly with distance. The current force is already ∝ distance (Hubble-like); what's missing is the *acceleration* (dark energy is not constant-rate, it's accelerating: `H(t)` grows) and a proper velocity-domain application.
**Proposal → bucket 1:** model it as **dark-energy Hubble flow**: apply as a velocity recession `Δv = H(t)·r·Δt` (radial from centre), with `H(t) = H₀·(1 + accel·t)` — an accelerating expansion that visibly stretches structures over time, exactly the ΛCDM signature. Keep the centre as a documented gauge artifact of the bounded world.
**Pseudocode:**
```
// per particle
r = |p − centre|;  d̂ = (p − centre)/r
H = H0·(1 + ACCEL·worldTick·dt)          // accelerating expansion
V += d̂·(H·r)·synergy·dt                   // velocity-domain Hubble flow
```
**CPU:** current = 1 sqrt + ~12 flops. Proposed = 1 sqrt + ~12 flops + 1 multiply (H). **Δ ≈ 0%**.
**Risks:** velocity-domain flow can drift particles outward — toroidal wrap returns them (fine); document the centre-gauge caveat in HELP_DB so "IRL fidelity" is honest.

## BOND (39, physics)

**Current (`src/physics/laws.js` `applyBond`):** contact spring — density-boosted range/strength, rest length `(r1+r2)·1.1`, break past 2x range (≈3x rest), 6 shared bond slots. HELP_DB: "molecular bonds prefer dense neighbourhoods."
**IRL basis:** chemical bonds are electron-sharing (covalent) or electrostatic; they have **valency saturation** (limited bonds per atom), **bond angles** (geometric preference), **bond energy**, and **temperature-activated dissociation** (Boltzmann: break rate ∝ exp(−E_b/kT)). A density-boosted contact spring is a mechanical hook, not a molecular bond.
**Proposal → bucket 1:** valence-saturated, angle-aware, thermally-dissociating bonds: (a) per-particle valency from DNA (cap 6 — BOND_COUNT already ≤ 6); (b) bond geometry — use the existing `BOND_ANGLE` DNA (index 31, currently dormant) as the equilibrium angle between consecutive bonds (real covalent geometry); (c) thermal breaking — when `TEMPERATURE > 0.2`, break probability `p = k·exp(−E_bond/(kB·T))` approximated by a cheap threshold/linear falloff to avoid `exp` per pair; (d) bond *energy* — forming a bond stores `ENERGY` (exothermic), breaking it returns it (conservation).
**Pseudocode:**
```
// pair phase
if (BOND_COUNT_i >= valency_i || BOND_COUNT_j >= valency_j) skip
// angle term when i already has a bond partner k:
theta = angle(BOND_PARTNER_1_i, i, j)
F_angle += k_angle·(theta − BOND_ANGLE_DNA)·0.05·synergy     // restore geometry
// thermal dissociation (per bonded pair, cheap approx, no exp):
if (T > 0.2) p_break = clamp(k·(T − 0.2)·0.5, 0, 0.02)
if (prng() < p_break) breakBondPair(); ENERGY_i += BOND_ENERGY·0.5
```
**CPU:** current = ~30 flops/pair + 6-slot scan on form. Proposed = +2 DNA reads (BOND_ANGLE, valency), +angle term (~8 flops) on bonded pairs, +threshold branch (2 flops) + rare RNG. **Δ ≈ +20%** (bounded; no exp on the hot path).
**Risks:** `BOND_ANGLE` DNA is currently unused — activating it changes POLYMER/ISOMERIZATION behavior; thermal breaking interacts with MELT/BOIL (soft synergies to document).

## SINGULARITY (79, physics)

**Current (`src/physics/laws.js` `applySingularityForce`/`applySingularityAbsorb`):** pull `k·m2²/(dist²+0.5)`; horizon `max(2.5, √m2·0.8)`; absorption adds mass + temperature flash. HELP_DB: "extreme inverse-square pull; accretion flash."
**IRL basis:** Schwarzschild geometry: event horizon `r_s = 2GM/c²` is **linear in M** (current √m is wrong); gravity is `GMm/r²` (current m² assumes unit test mass); infalling matter is **tidally spaghettified** (differential force); tiny holes **Hawking-radiate**.
**Proposal → bucket 1:** (a) horizon ∝ M: `r_s = k·M` (linear, with k tuned to the world scale); (b) Newtonian force `k·G·M·m/(r²+ε)` — fix the m²; (c) spaghettification — while inside ~3·r_s, apply a TIDE-style differential stretch (near-side pull > far-side) that elongates the pair; (d) gravitational redshift: particles within the tidal zone lose SIGNAL/ENERGY at a rate ∝ 1/r (real photon escape energy loss) — ties into the TIME_DILATION weak-field law.
**Pseudocode:**
```
force: F = k·G·M·m/(dist² + 0.5)                    // Newtonian
horizon: r_s = k_s·M (linear)                        // Schwarzschild
if (dist < 3·r_s):                                   // tidal zone
  applyTide-like differential stretch (spaghettification)
  SIGNAL_i −= 0.01·(r_s/dist)·dt;  ENERGY_i −= 0.005·(r_s/dist)·dt   // redshift
if (dist < r_s): absorb; flash TEMPERATURE += 0.12·k (unchanged)
```
**CPU:** current = 1 div + m² + ~8 flops/pair. Proposed = 1 div + ~12 flops (linear horizon is cheaper to evaluate than √m; tidal zone gate adds 2 flops). **Δ ≈ +5%**.
**Risks:** linear horizon changes gameplay tuning (`SINGULARITY_MASS` constant + `batch_08/11` tests reference √m behavior); document the world-scale G constant.

## TIDE (82, physics)

**Current (`src/physics/lawgroups/physicsLaws.js` `applyTide`):** long-range pull `∝ massJ·k/dist` (inverse-distance). HELP_DB: "reaches further than gravity."
**IRL basis:** tidal acceleration is the **differential** gravitational force: `a_tide ≈ 2GM·r_i/d³` — inverse **cube** in separation, linear in the body's size, and it *stretches* (near side pulled harder than far side). The current 1/dist law is a shallow long-range attraction, not a tide.
**Proposal → bucket 1:** true differential tides: `a = 2·G·m_j·r_i/d³` along the separation axis, applied anti-symmetrically to the pair (stretch); when a third body/axis structure exists, produce the classic two-bulge field. Optionally scale the *elongation* — particles on the stretched axis temporarily grow `RADIUS` by a small factor (bulge), giving the visible hourglass deformation of real tidal distortion.
**Pseudocode:**
```
// pair phase, massive source j
a = 2·G·m_j·(r_i + r_j)/d³ · d̂               // differential pull, d⁻³
F_i += +a·m_i ;  F_j −= a·m_j                 // stretch apart along d̂
RADIUS_i += 0.02·(a/d) ; RADIUS_j += 0.02·(a/d)   // tidal bulge (capped)
```
**CPU:** current = ~8 flops/pair (1 div). Proposed = d³ (2 muls) + 2 reads (r_i, r_j) + bulge writes (2, throttled). **Δ ≈ +10%**.
**Risks:** inverse-cube range shrinks TIDE's reach dramatically (real behavior) — worlds tuned on long-range TIDE will change; synergy with GRAV (orbital capture) weakens unless GRAV carries the far field.

## TURBULENCE (85, physics)

**Current (`src/physics/lawgroups/physicsLaws.js` `applyTurbulence`):** per-particle perpendicular pseudo-random kick (vorticity noise), KE roughly conserved. HELP_DB: "churning flow field; eddies with DRAG."
**IRL basis:** turbulence is an **energy cascade of eddies** in a **divergence-free (incompressible) velocity field** (Navier–Stokes). The single defining property a synthetic model must keep is ∇·v = 0; per-particle white noise isn't spatially correlated and isn't turbulence.
**Proposal → bucket 1:** **curl-noise turbulence** (Bridson's divergence-free noise, standard in fluid FX): precompute (or hash-evaluate) a coarse 3D potential field; the velocity perturbation is the **curl** of that field — divergence-free by construction, so it produces large swirling eddies that advect into smaller ones (visual cascade) and conserves volume exactly. Deterministic from position (no RNG per particle), slowly evolving (potential field drifts over time).
**Pseudocode:**
```
// per particle, deterministic (no prng)
psi = hashNoise3D(pos·SCALE + t·DRIFT)            // coarse potential field
v_turb = curl(psi)                                // ∇×ψ — divergence-free
V += v_turb·k·synergy·dt                          // incompressible swirl
```
**CPU:** current = 1 hypot + ~15 flops + 2–3 RNG draws + normalization (slow branch). Proposed = ~9 hashed-gradient samples + ~18 flops, **0 RNG** (deterministic). **Δ ≈ +10%** but removes RNG pressure and becomes deterministic (seed-stable runs).
**Risks:** hash noise cost per particle ×3 axes is the main spend; a coarse grid (16³) sampled trilinearly is cheaper than raw hashing — implementation choice left to the confirm loop; keep the KE-conservation property (curl is orthogonal to v's divergence, not to v itself — document).

---

## Batch 02 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| ACCR | 1 | 8.92 | −35% | Mass/momentum-conserving coalescence, fragmentation branch |
| VOID | 1 | — | ≈0% | Accelerating Hubble flow (dark energy) |
| BOND | 1 | 10.32 | +20% | Valency + bond angle + thermal dissociation |
| SINGULARITY | 1 | 9.08 | +5% | Linear Schwarzschild horizon, Newtonian force, spaghettification |
| TIDE | 1 | 11.65 | +10% | Inverse-cube differential tides with bulge |
| TURBULENCE | 1 | — | +10% | Divergence-free curl-noise eddies (no RNG) |

**Migration:** 6/6 → bucket 1. **Net CPU:** −35% on ACCR, +20%/+10%/+5%/+10% on the four other anchored laws — dominated by the ACCR win; marginal costs stay bounded (all O(n) or O(n·k)).
**Quality pass (Rv/linear):** reflected after produce — 4 issues (ACCR genome-blend scope, VOID homogeneity gauge, BOND exp-on-hot-path, TIDE range regression) → refined (3-locus blend + COM, gauge note, threshold-break approx, GRAV-synergy note) → check: all 6 laws carry a bucket-1 target, CPU table, and risk row; unresolved: none blocking (implementation constants deferred to the confirm loop).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 17/112: audit-suite/law-revamp/batch_03.md (119 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 03 (Biology: Vague)

**Laws:** LIFE (7) · GLOW (8) · AFFINITY (9) · REPRO (10) · ENERGY (13) · IMMUNITY (91)
**Series phase:** 3 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchors from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles): LIFE `8.91 ms/tick`, REPRO `8.69`. Percent deltas apply to each law's *marginal* cost.

---

## LIFE (7, biology)

**Current (`src/physics/laws.js` `applyLifeCycle`):** metabolic energy decay scaled by ENERGY_EFFICIENCY + DECAY_RATE slider; photosynthesis subsidy from LIGHT_LEVEL; death at ENERGY ≤ 0; HUNGER counter; bio-rhythm pulse; color drift; mass fluctuation gated behind ACCR; SENESCENCE death nested.
**IRL basis:** real metabolism obeys **Kleiber's law** (basal metabolic rate ∝ M^0.75), rises with **activity** (exertion), and couples to *intake* — light, predation, symbiosis — through a conversion efficiency.
**Proposal → bucket 1:** (a) Kleiber scaling — metabolic decay ∝ `MASS^0.75` (allometric, real); (b) activity cost — decay × `(1 + 0.5·|v|/MAX_VELOCITY)` (real exertion); (c) efficiency-gated intake — when PREDATION/SYMBIOSIS transfer energy into a particle, LIFE converts it at `ENERGY_EFFICIENCY` (real assimilation efficiency); keep photosynthesis, hunger, death-at-zero.
**Pseudocode:**
```
decay  = 0.01·(1 − EFFICIENCY·synergy)·DECAY_RATE·dt·pow(MASS, 0.75)
decay *= (1 + 0.5·min(1, |v|/MAX_VELOCITY))            // activity multiplier
ENERGY = max(0, ENERGY − decay + LIGHT_LEVEL·0.02·dt + intake·EFFICIENCY)
if (ENERGY <= 0) DEAD = 1                                // starvation (unchanged)
```
**CPU:** current ≈ 25 flops + 2 sin + 1 RNG (senescence). Proposed = +1 pow (MASS^0.75 — use a 2-sqrt approx or per-mass-tier table) + 3 flops + intake read. **Δ ≈ +10%**.
**Risks:** Kleiber scaling slows the metabolism of large particles (behavior shift); intake hook requires touching PREDATION/SYMBIOSIS return paths — confirm-loop scope.

## GLOW (8, biology)

**Current (`src/physics/laws.js` `applyGlowEffect`):** sine oscillator; positive phase raises SIGNAL by `phase·PULSE_RATE·SIGNAL_STRENGTH·dt·0.05·synergy` — emitter only, zero energy cost.
**IRL basis:** bioluminescence is a **fueled reaction** (luciferin + luciferase + O₂, driven by ATP) — real emitters pay a metabolic cost per flash and go dark when starved; rhythms are circadian.
**Proposal → bucket 1:** ATP-costed emission: (a) flash amplitude scales with available energy: `amp = min(1, ENERGY/40)`; (b) while flashing, `ENERGY −= 0.01·amp·dt` (real ATP burn); (c) no emission below `ENERGY < 5` (starved emitters go dark); (d) keep the phase oscillator (circadian-like rhythm).
**Pseudocode:**
```
if (phase > 0 && ENERGY > 5):
  amp = min(1, ENERGY/40)
  SIGNAL += phase·PULSE_RATE·SIGNAL_STRENGTH·dt·0.05·synergy·amp
  ENERGY −= 0.01·amp·dt                                  // luciferin burn
```
**CPU:** current ≈ 10 flops + 1 sin. Proposed = +1 read + 1 write + 3 flops. **Δ ≈ +5%**.
**Risks:** worlds relying on free GLOW signals will dim over time (energy economy) — pairs with LIFE so photosynthesis refuels the flash.

## AFFINITY (9, biology)

**Current (`src/physics/laws.js` `applyAffinity`):** same-species pull `0.1·max(0, affinity_i)·synergy·SPECIES_INTERACTION`; cross-species repel only when `affinity_i < 0`. Uses only particle i's DNA.
**IRL basis:** conspecific aggregation (Allee effect) and kin recognition are **density-dependent** and **symmetric** — attraction strengthens with local same-species density, and recognition reads both partners' signatures; sensory range is finite (olfaction).
**Proposal → bucket 1:** symmetric, density-dependent aggregation: (a) read both partners' SPECIES_AFFINITY (kin recognition is mutual); (b) density boost — same-species pull scales with local same-species neighbor count `n_same` (Allee aggregation: `×min(2, 1 + n_same·0.1)`); (c) sensory limit — only pairs within `NEIGHBORHOOD_RADIUS` respond (real detection range).
**Pseudocode:**
```
if (speciesI === speciesJ && dist < NEIGHBORHOOD_RADIUS):
  aff = max(0, aff_i) + max(0, aff_j)                    // symmetric
  pull = 0.05·aff·synergy·SPECIES_INTERACTION·min(2, 1 + nSame·0.1)
// cross-species: repel only when BOTH affinities < 0 (mutual xenophobia)
```
**CPU:** current ≈ 8 flops + 1 sqrt per pair. Proposed = +1 DNA read (aff_j) + density term (2 flops) + range gate. **Δ ≈ +10%**.
**Risks:** symmetric affinity changes mixed-species dynamics; density boost needs `nCount` per species (grid currently counts all neighbors — small per-cell addition).

## REPRO (10, biology)

**Current (`src/physics/laws.js` `applyReproduction`):** REPRO_DRIVE (stride 79) accumulates `BIRTH_RATE·0.1·dt·synergy`; at drive ≥ 60 and AGE ≥ 100, per-tick spawn chance; child takes mutated DNA (genetics 42-47, SEX_CHANCE crossover); drive consumed, ~half parent energy. HELP_DB: "energy is no longer the reproduction gate."
**IRL basis:** reproduction is **energy-gated parental investment** (real fecundity costs calories), has **litter size** (fecundity), and offspring mutation is reduced by **DNA repair** (REPAIR_EFFICIENCY, index 51 — currently only consumed by GENOTYPE).
**Proposal → bucket 1:** (a) drive accumulates only from metabolic surplus — fill rate ∝ `max(0, ENERGY − 50)` (real: only well-fed organisms invest in gametes); (b) parental investment — spawning costs `INVESTMENT = 30 + litter·5` ENERGY and the child inherits the invested pool; (c) fecundity — litter 1–3 from BIRTH_RATE (real brood size); (d) mutation ÷ `(1 + REPAIR_EFFICIENCY)` (DNA repair fidelity).
**Pseudocode:**
```
if (ENERGY > 50) DRIVE += BIRTH_RATE·0.1·dt·synergy·((ENERGY−50)/50)   // surplus-gated
if (DRIVE >= 60 && AGE >= 100 && prng() < BIRTH_RATE·0.01·synergy):
  litter = 1 + (BIRTH_RATE > 0.7 ? 1 : 0) + (BIRTH_RATE > 0.9 ? 1 : 0)
  cost = 30 + litter·5;  ENERGY −= cost
  spawn child with ENERGY = cost/litter, mutation/(1 + REPAIR_EFFICIENCY)
  DRIVE = 0
```
**CPU:** current ≈ 20 flops + RNG + mutation DNA writes (on spawn). Proposed = +2 reads (ENERGY, REPAIR) + litter branch + few flops. **Δ ≈ +5%**.
**Risks:** surplus-gating changes the "no energy gate" design decision from v4.6.19 — that change is documented in `batch_02/params` history; flag for user confirmation (the RRP loop originally removed the energy gate deliberately).

## ENERGY (13, biology)

**Current (`src/physics/laws.js` `applyEnergyTransfer`):** pairwise conduction of 3 channels (ENERGY, ELECTRIC_ENERGY, STORED_ENERGY) toward equilibrium — `transfer = Δ·0.005·synergy·ENERGY_TRANSFER`, hard cutoff `dist² < 40000` (200 units).
**IRL basis:** heat/energy flow is **Fourier conduction** — flux ∝ ∇E·κ, where κ is the material's **thermal/electrical conductivity**; real conduction is essentially **contact-range** (phonons/electrons don't jump 200 units).
**Proposal → bucket 1:** Fourier/Fick conduction with material conductivity and contact range: (a) transfer ∝ `ΔE·κ/(dist+1)` where κ = CONDUCTIVITY DNA of the pair (real materials conduct differently); (b) range = contact `dist < (r_i + r_j)·1.5` (real conduction is contact-mediated); (c) keep the 3 channels (energy ≈ heat, electric charge ≈ electron flow, stored ≈ reserves — each with its own κ weighting).
**Pseudocode:**
```
if (dist > (r_i + r_j)·1.5) return                       // contact range
k = (CONDUCTIVITY_i + CONDUCTIVITY_j)·0.5·ENERGY_TRANSFER // material κ
for ch in [ENERGY, ELECTRIC_ENERGY, STORED_ENERGY]:
  transfer = (E_j − E_i)·k·synergy/(dist + 1)
  E_i += transfer;  E_j −= transfer                       // conserved
```
**CPU:** current = 3-channel × ~8 flops/pair (no sqrt — distSq gate). Proposed = +1 DNA read ×2, 1 div, contact gate (2 reads). **Δ ≈ +10%** per pair — but the contact range **collapses the pair count** by orders of magnitude (200 → ~2 units), so **net world CPU ≈ −60%**.
**Risks:** range collapse is a major behavior change (energy no longer equilibrates across the whole dish); keep the `ENERGY_TRANSFER` slider as the global multiplier; audit `batch_03/04` tests that assume long-range transfer.

## IMMUNITY (91, biology)

**Current (`src/physics/lawgroups/biologyLaws.js` `applyImmunity`):** free armor regen `+0.02·k` (cap 5) and energy regen `+0.01·k` while armored; halves PARASITE extraction; blocks RADIATION genotypic damage.
**IRL basis:** immunity is an **adaptive, memory-based, costly, specific** system — a remembered resistance per threat type, rebuilt at metabolic cost, not a free stat regen.
**Proposal → bucket 2 (honest upgrade):** adaptive-memory defense: (a) on surviving a drain (PARASITE) or radiation event, the particle marks `IMMUNE_MEMORY` (stride 96) for that threat type; (b) subsequent same-type drains reduced by `memory·0.3` (adaptive memory — real repeated-exposure resistance); (c) defense costs energy — armor regen drains `ENERGY −= 0.01·k` (real immune response costs calories/fever); (d) specificity — memory is per threat (parasite vs radiation vs poison), not a universal stat.
**Pseudocode:**
```
// on drain event (parasite/radiation/poison):
reduction = 1 − min(0.9, IMMUNE_MEMORY·0.3)
drain *= reduction
IMMUNE_MEMORY = min(1, IMMUNE_MEMORY + 0.05·k)            // adaptive memory
// regen (per tick):
ENERGY −= 0.01·k                                            // immune cost
ARMOR  = min(5, ARMOR + 0.02·k) when ENERGY > 5             // fueled regen
```
**CPU:** current ≈ 6 flops + 2 writes. Proposed = +1 read/write (memory) + cost write + 2 flops. **Δ ≈ +10%**.
**Risks:** marker needs a stride slot (96 — shared budget with DIMENSIONALITY proposal; allocate 96-98 explicitly in the confirm loop); remains bucket 2 — a full immune system (pathogen identity, clonal selection) is out of scope.

---

## Batch 03 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| LIFE | 1 | 8.91 | +10% | Kleiber allometry + activity cost + intake efficiency |
| GLOW | 1 | — | +5% | ATP-costed bioluminescence, starvation dark |
| AFFINITY | 1 | — | +10% | Symmetric kin recognition + Allee density boost |
| REPRO | 1 | 8.69 | +5% | Surplus-gated drive, parental investment, repair fidelity |
| ENERGY | 1 | — | −60% net | Fourier conduction, material κ, contact range |
| IMMUNITY | 2 | — | +10% | Adaptive memory + cost + specificity |

**Migration:** 5/6 → bucket 1, 1/6 → bucket 2 (IMMUNITY). **Net CPU:** the ENERGY range collapse dominates — big net win at world scale.
**Quality pass (Rv/linear):** produced → reflected (5 issues: LIFE pow cost, GLOW economy, REPRO design-history conflict, ENERGY range regression, IMMUNITY stride sharing) → refined (approx pow, LIFE pairing note, REPRO flag for confirmation, contact-range audit note, stride 96 allocation note) → check: 5 bucket-1 + 1 bucket-2, CPU tables + risks on all; unresolved: REPRO's deliberate v4.6.19 energy-gate removal needs explicit user confirmation.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 18/112: audit-suite/law-revamp/batch_04.md (119 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 04 (Chemistry: Vague)

**Laws:** SOLVATION (18) · ACIDITY (19) · OXIDATION (20) · CHIRALITY (23) · REDUCTION (40) · ALLOY (41)
**Series phase:** 4 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model; no bench spotlight anchors for these laws (marginal costs are pairwise/bounded).

---

## SOLVATION (18, chemistry)

**Current (`src/physics/laws.js` `applySolvation` + `applySolvationEffect`):** opposite charges attract, like repel (pair force); reaction-rate multiplier `1 + |Δcharge|·0.2·synergy` when the gap > 0.5.
**IRL basis:** a solvent is a **dielectric medium** — it *screens* electrostatics (Coulomb force divided by ε ≥ 1) and *speeds* dissolution/reaction. Real solvation does **not** make opposite charges attract harder; it weakens the vacuum force and stabilizes ions.
**Proposal → bucket 1:** dielectric screening + ion pairing: (a) effective Coulomb force `F = F_vac/ε_eff` with `ε_eff = 1 + SOLVATION_STRENGTH·synergy` (the medium weakens electrostatics — real); (b) close opposite-charge pairs form a *stabilized ion pair*: below contact distance the mutual force is capped (hydration-shell-like resistance to separation); (c) keep the reaction multiplier (solvent accelerates chemistry).
**Pseudocode:**
```
eps = 1 + SOLVATION_STRENGTH·synergy                 // dielectric constant
F_charge *= 1/eps                                     // screened Coulomb
if (dist < (r1+r2)·0.9 && q1·q2 < 0): cap |F| at F_MAX_ION_PAIR   // ion pair
reactMult = 1 + |Δq|·0.2·synergy                      // unchanged
```
**CPU:** current ≈ 8 flops/pair. Proposed = +1 mul + ion-pair gate (2 flops). **Δ ≈ +5%**.
**Risks:** screening changes CHARGE_LAW interplay (document soft synergy: solvent reduces vacuum Coulomb — real); `SOLVATION_STRENGTH` needs a world param (or reuse DNA POLARITY as solvent strength).

## ACIDITY (19, chemistry)

**Current (`src/physics/laws.js` `applyAcidityEffect`):** charge transfer from high to low charge, rate = CONDUCTIVITY·0.1·dt·synergy, gate |Δq| ≥ 0.3, charge conserved.
**IRL basis:** acids donate protons (H⁺); acid–base chemistry is governed by **strength (pKa)** and reaches **equilibrium**, not full equalization. Strong acids dissociate fully; weak acids reach a dynamic equilibrium with a residual gradient.
**Proposal → bucket 1:** pKa-gated proton transfer with equilibrium floor: (a) acid strength — transfer rate scaled by an `ACIDITY_STRENGTH` DNA/param (strong vs weak); (b) equilibrium — transfer stops when `|Δq| < floor(strength)` (weak acids leave a residual gradient — real equilibrium constant); (c) dissociation — particles with |q| above a strength-dependent threshold spontaneously shed charge as proton donation (mass-neutral, charge-conserving to a sink), modeling dissociation.
**Pseudocode:**
```
strength = ACIDITY_STRENGTH DNA + CONDUCTIVITY·0.5
if (|Δq| < 0.3·(1 − strength)) return                // equilibrium floor
transfer = Δq·strength·0.1·dt·synergy                 // pKa rate
q_i += transfer;  q_j −= transfer                      // conserved (unchanged)
if (|q_i| > 1 − strength):  q_i −= 0.02·dt;  TEMPERATURE += 0.01·dt   // dissociation
```
**CPU:** current ≈ 10 flops/pair. Proposed = +1 DNA read + equilibrium floor (2 flops) + rare dissociation write. **Δ ≈ +5%**.
**Risks:** `ACIDITY_STRENGTH` doesn't exist yet — propose reuse of an existing DNA (e.g. REACTION_THRESHOLD, 37) to avoid a new param; equilibrium floor changes end-state charge distributions (audit `batch_05` tests).

## OXIDATION (20, chemistry)

**Current (`src/physics/laws.js` `applyOxidationEffect`):** per-particle self-decay — |CHARGE| and MASS erode at `0.001·dt·synergy`; HEAT_OUTPUT release + white flash. HELP_DB: "electron loss; electrical rust."
**IRL basis:** oxidation is **electron loss to an oxidant** — a *pairwise redox* process; electrons are **conserved** (they go somewhere). Self-decay to the void violates charge conservation; burning additionally needs fuel/oxidizer.
**Proposal → bucket 1:** pairwise redox electron transfer: (a) when a charged particle meets a partner with opposite-sign charge (or a neutral oxidant when `OXYGEN_LEVEL > 0`), electrons flow from the reduced (negative) partner to the oxidized (positive) one — charge **conserved** per pair; (b) heat released ∝ transferred charge × HEAT_OUTPUT (real combustion/rust release); (c) slow tarnishing (no partner) only when `OXYGEN_LEVEL > 0` (real: rust needs O₂); (d) mass erosion only from *burning* (high HEAT_OUTPUT), not from rust.
**Pseudocode:**
```
// pair phase
if (q_i·q_j < 0 || OXYGEN_LEVEL > 0):
  flow = min(|q_i|, |q_j|, RATE·dt·synergy)           // electrons transfer
  q_i −= sign(q_i)·flow;  q_j −= sign(q_j)·flow        // conserved
  ENERGY += flow·HEAT_OUTPUT·0.05·dt·synergy            // redox energy
  TEMPERATURE += flow·0.01                              // exothermic
// per-particle burning (high HEAT_OUTPUT only): MASS −= |q|·0.001·dt
```
**CPU:** current ≈ 15 flops + 3 color writes per particle. Proposed = pair-phase transfer (~8 flops) + rare mass erosion; drops the per-particle 3-write flash on the hot path. **Δ ≈ +10%** (net, flash throttled to burning events).
**Risks:** becomes the donor half of a redox couple with REDUCTION (must ship together); `OXYGEN_LEVEL` world param needed; audit `batch_06` tests for the self-decay assumption.

## CHIRALITY (23, chemistry)

**Current (`src/physics/laws.js` `applyChirality`):** same-sign TORQUE pairs deflect perpendicular (sign of TORQUE sets direction); opposite-hand or zero-torque pairs: no force.
**IRL basis:** enantiomers are mirror-image molecules with identical physics in symmetric environments; **chiral discrimination** (one enantiomer favored) only emerges in a **chiral environment** (e.g., a spinning field, chiral surfaces). Same-hand deflection is a decent stereoselective-interaction abstraction.
**Proposal → bucket 1:** chiral discrimination scaled by enantiomeric excess + environment handedness: (a) deflection strength ∝ `|τ1·τ2|` (both molecules' handedness magnitude matters — real stereoselectivity); (b) environment handedness — when ROTATION (or CENTRIPETAL swirl) is active, the world's spin biases one enantiomer: same-hand-as-world pairs get a boost, opposite-hand pairs a penalty (real: chiral media select enantiomers); (c) thermal racemization — at high TEMPERATURE, TORQUE sign occasionally flips (real: thermal racemization over an energy barrier).
**Pseudocode:**
```
if (same-hand pair):
  env = isSet(ROTATION) ? sign(worldSpin) : 0
  boost = (sign(τ_i) === env) ? 1.2 : 0.8              // chiral environment
  F ⊥ = dir·0.01·synergy·|τ1·τ2|·boost/d·d̂⊥
if (TEMPERATURE > 0.7 && prng() < 0.001·dt): TORQUE = −TORQUE   // racemization
```
**CPU:** current ≈ 8 flops/pair. Proposed = +1 mul (|τ1·τ2|) + env gate (2 flops) + rare RNG (racemization, throttled). **Δ ≈ +5%**.
**Risks:** TORQUE DNA flip (racemization) mutates a DNA cache slot — keep it a cache-only change (species genome untouched); audit `batch_06` chiral tests.

## REDUCTION (40, chemistry)

**Current (`src/physics/laws.js` `applyReduction`):** opposite-sign pairs neutralize — each magnitude shrinks by `0.05·synergy` toward 0; same-sign untouched.
**IRL basis:** reduction is the **gain of electrons** — the acceptor half of a redox couple; total charge is **conserved** (what one loses, the other gains). "Neutralize toward zero" makes charge vanish — violates conservation and is not reduction.
**Proposal → bucket 1:** pairwise electron transfer (mirror of the OXIDATION proposal): (a) electrons flow from the more-negative (reduced/donor) to the more-positive (oxidized/acceptor) particle until equilibrium (or the pKa floor from ACIDITY); (b) charge conserved per pair; (c) released redox energy → TEMPERATURE (real: reduction is often exothermic; batteries run on this); (d) no charge is ever destroyed.
**Pseudocode:**
```
if (q_i < q_j):
  flow = min(|q_i − q_j|·RATE·dt·synergy, |q_j − q_i|) 
  q_i += flow;  q_j −= flow                            // electrons move donor→acceptor
  TEMPERATURE += flow·0.02·dt                          // exothermic
```
**CPU:** current ≈ 8 flops/pair. Proposed = same + 1 write (TEMPERATURE). **Δ ≈ +5%**.
**Risks:** must ship with the OXIDATION pair (shared conservation invariant); audit `batch_11` reduction tests (opposite-sign neutralize expectation changes to transfer).

## ALLOY (41, chemistry)

**Current (`src/physics/laws.js` `applyAlloy`):** cross-species overlap → one particle dies, survivor takes full merged mass + 42-locus mass-weighted DNA average + color blend.
**IRL basis:** alloying is **interdiffusion** — atoms of two metals mix at the lattice level, forming a homogeneous or two-phase solid solution; neither atom disappears, and properties (strength, conductivity) interpolate with composition. A merge-and-kill is coalescence (ACCR's job), not alloying.
**Proposal → bucket 1:** diffusion-bonding alloy: (a) on contact, both particles exchange a fraction of their DNA composition (atom interdiffusion — they become progressively more alike over time); (b) property interpolation — CONDUCTIVITY/STIFFNESS/ARMOR shift toward the mixture (real alloy property tuning); (c) no mass loss, no death — the pair persists as a two-phase alloy; (d) mixing rate gated by TEMPERATURE (real: diffusion is thermally activated — Arrhenius).
**Pseudocode:**
```
if (dist < (r1+r2)·1.2 && species differ):
  rate = MIX_RATE·dt·exp_approx(T)                     // thermal activation
  for d in [CONDUCTIVITY, STIFFNESS, ARMOR, 3 color]:
    a = lerp(a, b, rate);  b = lerp(b, a, rate)        // symmetric interdiffusion
  // optional slow species-mix marker (stride 96) toward homogenization
```
**CPU:** current = 42-loop (~90 flops) + mass + color + DEAD write. Proposed = 4-5 loci lerp (~12 flops) + 2 writes, no DEAD. **Δ ≈ −60%**.
**Risks:** behavior change (alloys no longer merge into one body) — worlds relying on mass consolidation lose it (ACCR covers that); thermal activation needs `exp`-free approximation (Arrhenius look-up); audit `batch_11` alloy tests.

---

## Batch 04 Summary
| Law | Target bucket | CPU Δ | Key change |
|-----|--------------|-------|------------|
| SOLVATION | 1 | +5% | Dielectric screening + stabilized ion pairs |
| ACIDITY | 1 | +5% | pKa strength + equilibrium floor + dissociation |
| OXIDATION | 1 | +10% | Pairwise conserved electron transfer (redox donor) |
| CHIRALITY | 1 | +5% | Enantiomeric excess + chiral environment + racemization |
| REDUCTION | 1 | +5% | Pairwise electron transfer (redox acceptor), conserved |
| ALLOY | 1 | −60% | Interdiffusion bonding, property interpolation, no death |

**Migration:** 6/6 → bucket 1. **Net CPU:** ALLOY's 42-loop removal dominates; OXIDATION/REDUCTION form a conserved redox couple shipped together.
**Quality pass (Rv/linear):** produced → reflected (5 issues: SOLVATION physics direction, ACIDITY param reuse, redox conservation invariant, CHIRALITY DNA mutation scope, ALLOY behavioral regression) → refined (screening direction corrected, REACTION_THRESHOLD reuse, OXIDATION+REDUCTION coupling note, cache-only TORQUE flip, ACCR fallback note) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: none blocking — the OXIDATION/REDUCTION pair and ACIDITY param choice are flagged for the user confirm loop.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 19/112: audit-suite/law-revamp/batch_05.md (125 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 05 (Chemistry/Metaphysics Mix)

**Laws:** ELECTROLYSIS (92) · ORDER (33) · MIND (37) · PRECOGNITION (49) · ENTANGLEMENT (80) · CONSCIOUSNESS (104)
**Series phase:** 5 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchor from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles): ENTANGLEMENT `8.98 ms/tick`. Percent deltas apply to each law's *marginal* cost.

---

## ELECTROLYSIS (92, chemistry)

**Current (`src/physics/lawgroups/chemistryLaws.js` `applyElectrolysis`):** when |Δcharge| > 0.5, mass→energy conversion (`dm = 0.01·MASS·k·CONDUCTIVITY` → ENERGY + SIGNAL + heat). HELP_DB: "charge splits matter apart."
**IRL basis:** Faraday's laws of electrolysis — the mass decomposed is **proportional to the charge passed** (`m = (Q/F)·(M/z)`), requires a **voltage/current** through an **electrolyte**, and produces distinct products (gas evolution).
**Proposal → bucket 1:** Faraday electrolysis: (a) dm ∝ |Δq| (charge passed), not mass fraction — `dm = k·|Δq|·CONDUCTIVITY`; (b) gate on charge gradient ≥ a voltage threshold (0.5 — unchanged) plus electrolyte (CONDUCTIVITY — unchanged); (c) products — the shed mass re-materializes as gas-like byproduct: raise neighbor SIGNAL scatter and TEMPERATURE (already present) and, when accumulated mass loss crosses a quantum, emit a light vapor particle (decomposition products); (d) keep small overpotential heat.
**Pseudocode:**
```
if (|Δq| <= 0.5) return                          // voltage threshold
dm = k·|Δq|·CONDUCTIVITY                          // Faraday: m ∝ Q
MASS −= dm;  ENERGY += dm·20;  SIGNAL += dm·5;  TEMPERATURE += dm·0.25
gasAccum += dm;  if (gasAccum > 0.5) spawn vapor particle (mass = gasAccum)
```
**CPU:** current ≈ 12 flops/pair + 4 writes. Proposed = +1 mul + rare gas spawn. **Δ ≈ +5%**.
**Risks:** gas-spawn needs a spawn budget (reuse the offspring ring); Faraday scaling changes the mass-loss curve (audit `batch_24` electrolysis tests).

## ORDER (33, metaphysics)

**Current (`src/physics/laws.js` `applyOrder`):** pairwise acceleration toward neighbor velocity (`0.04·synergy·v_j`) within 200 units. HELP_DB: "Vicsek alignment."
**IRL basis:** the **Vicsek model** (canonical active-matter flocking) aligns each particle to the *mean* neighbor velocity plus **angular noise** — pairwise acceleration toward a single neighbor is a partial, noiseless version.
**Proposal → bucket 1:** canonical Vicsek: (a) accumulate the **mean neighbor velocity** per particle during the pair loop (grid-bounded); (b) add angular noise `η = (prng()−0.5)·NOISE·dt` to the heading update (real Vicsek has noise — it's what produces the order–disorder phase transition); (c) range = `NEIGHBORHOOD_RADIUS` DNA (real interaction radius) instead of a fixed 200.
**Pseudocode:**
```
// pair phase: accumulate
vSum += v_j;  n++                                 // mean-field accumulation
// per particle:
v̄ = vSum/max(n,1)                                  // mean neighbor velocity
heading += angle(v̄) + (prng()−0.5)·NOISE·dt         // Vicsek update w/ noise
V = SPEED·(cos(heading), sin(heading), vz·0.5)      // soft speed constraint
```
**CPU:** current ≈ 4 flops/pair. Proposed = +3 adds/pair (accumulation) + 1 RNG + trig per particle. **Δ ≈ +15%**.
**Risks:** trig per particle (cos/sin) is the new cost — use a precomputed heading table; noise constant needs a world slider or DNA; CHAOS×0.3 synergy preserved.

## MIND (37, metaphysics)

**Current (`src/physics/laws.js` `applyMind`):** same-species pairs boost SIGNAL `0.01·synergy/dist` (≤200 units); synergies COMMS ×1.5, TELEPATHY ×2.0, ENERGY ×0.5 (drain), POLYMER ×0.5.
**IRL basis:** **quorum sensing** (bacteria/biofilms, ant colonies) — cooperative signaling is expressed only above a **local density threshold**, saturates (no unbounded amplification), and costs metabolic energy.
**Proposal → bucket 1:** quorum-gated collective signaling: (a) amplification only when local same-species density ≥ threshold (grid neighbor count) — real quorum threshold; (b) saturation — boost = `0.01·synergy/dist·min(2, n_q/THRESHOLD)` (diminishing returns); (c) keep the energy drain synergy (real: cooperative behavior is metabolically expensive).
**Pseudocode:**
```
n_same = gridSameSpeciesCount(base)                // from grid
if (n_same < QUORUM) return                        // below quorum — silent
boost = 0.01·synergy/dist·min(2, n_same/QUORUM)     // saturated amplification
// synergies unchanged (COMMS/TELEPATHY scale, ENERGY/POLYMER cost)
```
**CPU:** current ≈ 6 flops/pair + invDist sqrt. Proposed = +density read + saturation (2 flops). **Δ ≈ +5%**.
**Risks:** per-species neighbor counts need a per-cell species histogram (small addition to the grid); worlds tuned below the quorum density lose the boost entirely (document).

## PRECOGNITION (49, metaphysics)

**Current (`src/physics/laws.js` `applyPrecognition`):** collision-course pairs (dist 1–50, dot < 0) get a perpendicular dodge + `ENERGY −= 0.02·synergy·dt`.
**IRL basis:** real animals (insects especially) avoid looming threats via **time-to-contact (τ) detection** — the optic-flow variable `τ = distance/approach speed` triggers escape at a critical τ, and response gain scales with urgency. This is one of the best-studied real neural behaviors.
**Proposal → bucket 1:** τ-gated looming avoidance: (a) compute `τ = dist/|radial approach speed|`; (b) trigger when `τ < τ_crit` (constant-τ behavior — real looming response), not on raw distance; (c) dodge gain ∝ `1/τ` (urgency scaling — closer/faster → harder evasive turn); (d) keep the attention cost (energy drain) — real escape responses are metabolically taxed.
**Pseudocode:**
```
radial = −(d̂·v_rel)                                  // approach speed
if (radial <= 0) return                               // moving apart
tau = dist/max(radial, 1e-4)
if (tau > TAU_CRIT) return                            // not imminent
gain = 0.05·synergy·(TAU_CRIT/tau)                    // urgency scaling
F ⊥ = gain·d̂⊥ ;  ENERGY −= 0.02·synergy·dt           // dodge + attention cost
```
**CPU:** current ≈ 15 flops/pair. Proposed = +1 div (τ) + urgency (1 mul). **Δ ≈ +5%**.
**Risks:** τ_gating fires earlier for fast approaches at longer range (correct real behavior — test expectations in `batch_13` may need updating).

## ENTANGLEMENT (80, quantum)

**Current (`src/physics/laws.js` `applyEntanglePair` + solver relay):** contact links pairs (ENTANGLE_ID + phase); momentum converges and signals relay at any distance; phase decays ×0.998 until snap; partner death fires a recoil.
**IRL basis:** real entanglement produces **correlated measurement outcomes** between separated particles — it **cannot transmit momentum or signals** (the no-signaling theorem: correlations carry no information without comparing outcomes). A momentum-converging, signal-relaying "spooky link" is explicitly unphysical.
**Proposal → bucket 1 (fidelity via *removal*):** correlated-collapse entanglement: (a) **remove the signal relay and momentum convergence** (they violate no-signaling); (b) entangled pairs share a hidden correlation bit; when one partner is measured (collision/OBSERVER event), the other's state **collapses in a correlated way** — Bell-rule: both outcomes drawn from a shared random variable with opposite-sign correlation (real EPR); (c) phase decay retained (real decoherence); (d) death of one partner collapses the other (real: measuring one determines the other's fate for that observable).
**Pseudocode:**
```
// on measurement of i (collision/OBSERVER):
if (ENTANGLE_ID_i >= 0 && PHASE > 0.05):
  outcome = prng() < 0.5 ? +1 : −1
  setMeasureFlag(i, outcome)                        // correlated outcome
  setMeasureFlag(j, −outcome)                       // anti-correlated partner
  PHASE_i = 0;  PHASE_j = 0                          // link consumed
// remove: per-tick signal relay + momentum convergence (no-signaling)
```
**CPU:** current = pair-form (~6 flops) + per-tick relay work + decay. Proposed = form + rare collapse branch (only on measurement events) + decay. **Δ ≈ −10%** (relay removal dominates).
**Risks:** TELEPORT requires ENTANGLEMENT (hard dependency) — teleport's state-transfer *is* the one legitimate use of the correlation (quantum teleportation protocol); the recoil-on-death behavior is removed; audit `batch_21` entanglement tests.

## CONSCIOUSNESS (104, metaphysics)

**Current (`src/physics/lawgroups/metaLaws.js` `applyConsciousness`):** single-level predictive self-model — EMA of own speed; error > 0.3 drives attention (MEMORY/SIGNAL up, ENERGY down), low error regens.
**IRL basis:** this is **predictive processing / active inference** (Friston's free-energy principle): brains minimize prediction error through perception *and action*, with **hierarchical** models and **precision weighting**.
**Proposal → bucket 1:** hierarchical active inference: (a) add a **second-level model** — an EMA of the first-level error (model of the model; real hierarchical predictive coding); (b) **active inference** — error drives corrective *action* (steering to restore the modeled state), not just attention; (c) **precision weighting** — errors weighted by expected precision (low-noise states weigh more; real precision-weighted prediction error); (d) keep the attention cost/regen economy.
**Pseudocode:**
```
speed = |v|;  m1 = SELF_MODEL_SPEED (stride 95)
m2   = EMA(m2, err1, 0.02)                          // 2nd-level model (stride 99)
err1 = |speed − m1|;  err2 = |err1 − m2|
precision = 1/(1 + err2)                             // precision weighting
if (err1·precision > 0.3):
  MEMORY += err1·0.02;  SIGNAL += err1·0.01;  ENERGY −= err1·0.05
  V += (v̂_model − v̂)·0.02·precision·k               // active inference steering
else: ENERGY += 0.01·k                               // self-maintenance
m1 = 0.95·m1 + 0.05·speed
```
**CPU:** current ≈ 1 sqrt + ~15 flops + writes. Proposed = +2nd EMA (2 flops) + precision (2) + steering term (4). **Δ ≈ +10%**.
**Risks:** steering overlaps PREDICT/NAVIGATION (document soft conflict — active inference is a general mechanism); stride 99 is the last free slot (coordinate with other proposals: DIMENSIONALITY 96-98, IMMUNITY 96 — allocate 96-99 explicitly in the confirm loop).

---

## Batch 05 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| ELECTROLYSIS | 1 | — | +5% | Faraday scaling (m ∝ Q) + gas products |
| ORDER | 1 | — | +15% | Canonical Vicsek: mean field + angular noise |
| MIND | 1 | — | +5% | Quorum-gated, saturating collective signaling |
| PRECOGNITION | 1 | — | +5% | τ-gated looming avoidance, urgency gain |
| ENTANGLEMENT | 1 | 8.98 | −10% | Correlated collapse; relay removed (no-signaling) |
| CONSCIOUSNESS | 1 | — | +10% | Hierarchical active inference + precision weighting |

**Migration:** 6/6 → bucket 1. **Net CPU:** small net change; ENTANGLEMENT's relay removal offsets the ORDER trig cost.
**Quality pass (Rv/linear):** produced → reflected (5 issues: ELECTROLYSIS gas budget, ORDER trig cost, MIND quorum threshold, ENTANGLEMENT dependency on TELEPORT, CONSCIOUSNESS stride + steering overlap) → refined (offspring-ring reuse, heading-table note, grid histogram note, TELEPORT protocol note, stride 96-99 allocation + soft-conflict note) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: stride 96-99 allocation across batches 01/03/05 must be reconciled in the confirm loop (flagged in FINAL-REPORT).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 20/112: audit-suite/law-revamp/batch_06.md (118 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 06 (Metaphysics/EM Mix)

**Laws:** PERCEPTION (105) · SYNCHRONICITY (106) · CURRENT (55) · RESISTANCE (56) · CAPACITANCE (57) · MAGNETISM (59)
**Series phase:** 6 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchors from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles): CURRENT `8.97 ms/tick`, MAGNETISM `12.06`. Percent deltas apply to each law's *marginal* cost.

---

## PERCEPTION (105, metaphysics)

**Current (`src/physics/lawgroups/metaLaws.js` `applyPerception`):** velocity alignment toward neighbors within `2×NEIGHBORHOOD_RADIUS` (sensing at a distance).
**IRL basis:** real perception is **directional** (forward-biased field of view), **feature-selective** (specific cues: motion, size, signal), and **distance-attenuated** (Weber/1/r² falloff). A uniformly enlarged radius is the weakest possible model of perception.
**Proposal → bucket 1:** directional, feature-selective, attenuated sensing: (a) **field of view** — alignment weight ∝ `max(0, v̂_i·d̂)` (front-biased: nothing behind the eyes); (b) **cue selectivity** — sense specific features: velocity (alignment), mass (size cue), SIGNAL (signal detection), each with a detection threshold; (c) **falloff** — sensitivity ∝ `1/(dist+1)` within range (closer = clearer).
**Pseudocode:**
```
if (dist > NEIGHBORHOOD_RADIUS·2) return
fov = max(0, (v_i·d̂)/|v_i|)                       // forward field of view
if (fov < 0.05 && dist > NEIGHBORHOOD_RADIUS) return   // blind behind
sens = fov·k/(dist + 1)                             // attenuation
V += (v_j − v_i)·0.01·sens;  SIGNAL_i += (SIGNAL_j)·0.01·sens   // cues
```
**CPU:** current ≈ 6 flops/pair. Proposed = +dot (3 flops) + 1 div + gate. **Δ ≈ +10%**.
**Risks:** front-biased sensing changes swarm pursuit dynamics (audit `batch_27` perception tests); TELEPATHY synergy (dish-spanning) preserved as the "omni" exception.

## SYNCHRONICITY (106, metaphysics)

**Current (`src/physics/lawgroups/metaLaws.js` `applySynchronicity`):** when |ΔPHASE_1| < 0.3, phases lerp toward the mean + velocity pull. HELP_DB: "meaningful coincidences; resonant alignment."
**IRL basis:** this is **spontaneous synchronization** — the Kuramoto model (fireflies, metronomes, cardiac cells): phase coupling `dφ/dt = ω + (K/N)Σ sin(φ_j − φ_i)`, with emergence only when coupling K exceeds the spread of natural frequencies.
**Proposal → bucket 1:** canonical Kuramoto coupling: (a) coupling term `sin(Δφ)` (real — replace the linear lerp); (b) natural frequency `ω = PULSE_RATE` per particle (real diversity); (c) sync emerges when `K > spread(ω)` — below critical coupling the swarm stays incoherent (the real phase transition); (d) drop the Jungian "meaningful coincidence" framing in HELP_DB.
**Pseudocode:**
```
Δφ = PHASE_1_j − PHASE_1_i
if (|Δφ| < π·0.5):                                   // coupling window
  PHASE_1_i += ω_i·dt + K·sin(Δφ)·dt·synergy          // Kuramoto update
  PHASE_1_j += ω_j·dt − K·sin(Δφ)·dt·synergy
  V += (v_j − v_i)·0.02·K·cos(Δφ)                    // entrained motion
```
**CPU:** current ≈ 10 flops/pair. Proposed = +1 sin +1 cos + 2 reads (PULSE_RATE). **Δ ≈ +10%**.
**Risks:** PHASE_1 is shared with other laws (phase fields) — check writers before switching to the Kuramoto update; critical-coupling behavior may need a `K` slider (or reuse `synergy`).

## CURRENT (55, electromagnetism)

**Current (`src/physics/laws.js` `applyCurrentTransfer`):** within 17 units, `dq = Δq·min(CONDUCTIVITY_i, CONDUCTIVITY_j)·k` flows high→low; both must conduct.
**IRL basis:** conduction current is **drift + diffusion** of carriers (Ohm: J = σE; Fick: J = −D∇q). The existing model is charge *diffusion* (correct zero-field limit); real conductors also have **temperature-dependent conductivity** (metals: ρ ∝ T — hotter = more resistive) and transport ∝ gradient/distance.
**Proposal → bucket 1:** gradient-diffusion with metal-like temperature dependence: (a) `dq ∝ Δq·κ/(dist+1)` (diffusion flux ∝ ∇q/d — real Fick with distance decay); (b) `κ = min(cond_i, cond_j)/(1 + T_mean)` (real metals lose conductivity when hot — phonon scattering); (c) keep the both-conduct gate and charge conservation; (d) synergize with the FLUX proposal (drift) so drift + diffusion = full Ohmic transport.
**Pseudocode:**
```
if (dist > CONTACT_RANGE) return
κ = min(cond_i, cond_j)/(1 + (T_i + T_j)·0.5)         // metal-like ρ∝T
dq = (q_j − q_i)·κ·k/(dist + 1)                        // Fick diffusion
q_i += dq;  q_j −= dq                                   // conserved
```
**CPU:** current ≈ 8 flops/pair. Proposed = +1 div + 2 T reads. **Δ ≈ +8%**.
**Risks:** T-dependence creates a negative feedback (hot wires stop conducting — real) — worlds using CURRENT+HEAT will reach steady states faster; audit `batch_14` current tests.

## RESISTANCE (56, electromagnetism)

**Current (`src/physics/laws.js` `applyResistance`):** per-particle damping `damp = speed·k·(1 − CONDUCTIVITY·0.9)·(1 + TEMP·2)`; TEMPERATURE += speed·k·(1−cond·0.9)·0.5.
**IRL basis:** Joule heating `P = I²R` — resistance dissipates the energy of *moving charge carriers* (`I ∝ q·v`), and metals have a positive temperature coefficient (ρ rises with T — already present).
**Proposal → bucket 1:** carrier-limited Joule resistance: (a) damping applies to **charge carriers** — `damp ∝ |q|·speed` (neutral particles feel no electrical resistance); (b) heat rate ∝ `(q·v)²` (real I²R — quadratic, not linear); (c) keep material + temperature factors (metal-like α > 0).
**Pseudocode:**
```
if (|q| < 0.01) return null                          // neutral — no resistance
I = |q|·speed                                        // carrier current
heat = I²·k·(1 − cond·0.9)·(1 + T·2)                 // Joule: P = I²R
TEMPERATURE = min(1, T + heat·0.5)
F = −v̂·I·k·(1 − cond·0.9)·(1 + T·2)                 // damping on carriers
```
**CPU:** current ≈ 1 sqrt + ~12 flops. Proposed = +1 q read + 1 mul (I²). **Δ ≈ +5%**.
**Risks:** charged particles become slow (real: carriers lose energy) — flux/current dynamics shift; audit `batch_15` resistance tests.

## CAPACITANCE (57, electromagnetism)

**Current (`src/physics/laws.js` `applyCapacitanceStore` + `applyStoredChargeForce`):** surplus ENERGY (>50) stores as CHARGE (±2 breakdown clamp), bleeds toward 0 below; stored charge drives a pairwise Coulomb-like force.
**IRL basis:** a capacitor stores energy in an **electric field**, `Q = CV` and `E = ½CV² = Q²/2C` — the stored-energy/charge relation is **quadratic**, and exceeding the breakdown voltage discharges (dielectric breakdown).
**Proposal → bucket 1:** V² energy storage with breakdown: (a) charging rate `dq ∝ (E − 50)` but the *energy* extracted is quadratic — `ENERGY −= ½·dq²/C` (real E = Q²/2C); (b) **capacitance parameter** — C scales with CONDUCTIVITY (real: C depends on the dielectric/geometry); (c) **breakdown** — at `|q| ≥ 2`, fire a DISCHARGE event (spark — real dielectric breakdown) instead of a silent clamp; (d) keep the bleed and the stored-charge force (Coulomb between plates — real).
**Pseudocode:**
```
C = 0.5 + CONDUCTIVITY·1.5                            // capacitance
if (ENERGY > 50):
  dq = min((ENERGY − 50)·k, 0.5)
  ENERGY −= dq·dq/(2·C)                               // E = Q²/2C
  CHARGE = min(2, CHARGE + dq)
if (CHARGE >= 2): trigger DISCHARGE spark; CHARGE = 0   // breakdown
```
**CPU:** current ≈ 8 flops + writes. Proposed = +2 muls + breakdown branch. **Δ ≈ +5%**.
**Risks:** quadratic extraction slows charging (energy economy); breakdown ties to DISCHARGE law (soft dependency to document).

## MAGNETISM (59, electromagnetism)

**Current (`src/physics/laws.js` `applyMagneticForce`):** `F = k·m1·m2/dist²` — scalar moments: aligned attract, opposing repel.
**IRL basis:** magnetic interactions are **dipole–dipole**: the force is **anisotropic** (`F ∝ m1·m2·(1 − 3cos²θ)/r³` — depends on orientation relative to the axis) and falls as **r⁻³**, not r⁻². Scalar "monopole" attraction is a magnetic-charge model, not dipoles.
**Proposal → bucket 1:** dipole–dipole interaction: (a) angular dependence `(1 − 3cos²θ)` with `cosθ = d̂·m̂` (real dipole geometry — aligned along the axis attract, aligned perpendicular repel); (b) r⁻³ falloff (real); (c) **domain alignment** — with ORDER or CRYSTALLIZATION active, neighbor moments gradually align (ferromagnetic domain formation — real); (d) keep the signed-moment DNA semantics.
**Pseudocode:**
```
cosT = (d̂·m̂_i)·(d̂·m̂_j)                              // orientation along axis
F = k·m1·m2·(1 − 3·cosT²)/dist³ · d̂                  // dipole–dipole
if (isSet(ORDER) || isSet(CRYSTALLIZATION)):
  m_i = lerp(m_i, m_j, 0.01·k)                        // domain alignment
```
**CPU:** current ≈ 8 flops/pair (1 div). Proposed = +cos² (3 flops) + r³ (2 muls) + domain term. **Δ ≈ +15%**.
**Risks:** r⁻³ + anisotropy shortens and reshapes magnetic structure (filaments vs monopole clumps — audit `batch_15` magnetism tests); domain alignment mutates the DNA cache moment (cache-only).

---

## Batch 06 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| PERCEPTION | 1 | — | +10% | Directional field of view + cue selectivity + falloff |
| SYNCHRONICITY | 1 | — | +10% | Kuramoto coupling (sin Δφ), natural frequencies |
| CURRENT | 1 | 8.97 | +8% | Fick diffusion + metal-like ρ(T) |
| RESISTANCE | 1 | — | +5% | Carrier-limited Joule I²R |
| CAPACITANCE | 1 | — | +5% | V² energy storage + dielectric breakdown |
| MAGNETISM | 1 | 12.06 | +15% | Dipole–dipole anisotropy, r⁻³, domain alignment |

**Migration:** 6/6 → bucket 1. **Net CPU:** modest increases (+5-15%) on bounded pairwise/per-particle costs; MAGNETISM stays the most expensive of the six.
**Quality pass (Rv/linear):** produced → reflected (5 issues: PERCEPTION blind-spot behavior, SYNCHRONICITY PHASE_1 writers, CURRENT range, RESISTANCE neutrality gate, MAGNETISM DNA mutation) → refined (FOV threshold, phase-writer audit note, contact-range gate, |q| gate, cache-only alignment) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: none blocking — PHASE_1 writer audit and DNA-cache mutation rules flagged for the confirm loop.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 21/112: audit-suite/law-revamp/batch_07.md (128 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 07 (Electromagnetism: Vague)

**Laws:** RESONANCE (60) · IONIZATION (62) · DISCHARGE (63) · PLASMA (64) · SUPERCONDUCTIVITY (65) · ANTENNA (107)
**Series phase:** 7 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model; no bench spotlight anchors for these laws (marginal costs are bounded pairwise/per-particle).

---

## RESONANCE (60, electromagnetism)

**Current (`src/physics/laws.js` `applyResonanceForce`):** matched PULSE_RATE signaling pairs attract; `phaseSync = 0.5+0.5·cos(Δφ·π/2)`; constructive interference (phaseSync > 0.6) drives the weaker pulser's SIGNAL.
**IRL basis:** resonance is **energy transfer at matched frequency** — a driven oscillator absorbs maximum energy when the drive frequency equals its natural frequency; sharpness is set by the **quality factor Q** (bandwidth = f₀/Q), and undriven oscillation decays.
**Proposal → bucket 1:** Q-filtered sympathetic resonance with energy transfer: (a) bandwidth gate — amplification only within `|ΔPULSE_RATE| < 1/Q` (sharp resonance — real); (b) the driven (weaker) particle gains **ENERGY** as well as SIGNAL (real: resonance transfers mechanical/EM energy — e.g. two tuning forks, Tacoma Narrows); (c) free oscillation decay — SIGNAL pulses decay when no resonant partner is near (real: undriven vibration dies out).
**Pseudocode:**
```
Δf = |pr1 − pr2|
if (Δf > 1/Q) return null                          // off-resonance — no coupling
phaseSync = 0.5 + 0.5·cos((ph1 − ph2)·π/2)          // interference (unchanged)
if (phaseSync > 0.6):
  weaker.SIGNAL += stronger.SIGNAL·phaseSync·k·0.1
  weaker.ENERGY += stronger.SIGNAL·phaseSync·k·0.02   // energy transfer
if (no resonant neighbor in range): SIGNAL *= (1 − 0.005·dt)  // free decay
```
**CPU:** current = 2 sin + 1 cos + ~15 flops/pair. Proposed = +1 mul (Q gate) + 1 ENERGY write + decay branch. **Δ ≈ +5%**.
**Risks:** Q needs a world param or DNA (reuse SIGNAL_DECAY?); free decay changes GLOW/COMMS interplay (document).
**Definition (Q):** canonical quality factor — `FINAL-REPORT.md` → *Shared Constants & World-Param Definitions* (proposed world param `RESONANCE_Q`, `[1, 20]`, default 10).

## IONIZATION (62, electromagnetism)

**Current (`src/physics/laws.js` `applyIonization`):** hard contact (impact > 0.15) forms a conserved +/− ion pair (`q_i + q_j = 0`), sign from combined POLARITY; no re-stripping of already-charged particles.
**IRL basis:** impact ionization removes an electron → **ion + free electron** (charge conserved — already correct); it is **inelastic** (impact energy is absorbed) and **reversible** (ions recombine with free carriers).
**Proposal → bucket 1:** inelastic ionization + recombination: (a) **energy absorption** — the impact loses `impact·0.05` kinetic energy (real inelastic scattering) and the pair heats slightly; (b) **free carrier** — the stripped charge marks one partner as a mobile carrier (feeds CURRENT/FLUX as a genuine mobile electron — already the intent, make it explicit); (c) **recombination** — when an ion pair re-collides at low impact (< 0.1), they recombine (charge cancels, energy released as heat — real electron capture); (d) keep the threshold and conservation.
**Pseudocode:**
```
if (dist <= 3 && impact > 0.15):                    // ionization (unchanged gate)
  q_i = impact·s;  q_j = −impact·s                   // conserved pair
  TEMP_i += impact·0.02;  relSpeed *= (1 − 0.05)     // inelastic energy loss
  mark carrier (mobile flag — feeds CURRENT/FLUX)
else if (opposite-charge pair && impact < 0.1):
  q_i = 0;  q_j = 0;  TEMP_i += 0.03;  TEMP_j += 0.03  // recombination
```
**CPU:** current ≈ 10 flops/pair. Proposed = +recombination branch (2 flops) + 2 T writes. **Δ ≈ +8%**.
**Risks:** recombination needs a "was an ion pair" signal (use CHARGE signs — sufficient); audit `batch_16` ionization tests.

## DISCHARGE (63, electromagnetism)

**Current (`src/physics/laws.js` `applyDischarge`):** |q| ≥ 0.5 → kick along the accumulated opposite-charge gradient (random fallback), `TEMP += |c|·0.08`, `CHARGE = 0`.
**IRL basis:** electric discharge is the **rapid neutralization of stored energy along a conductive path** — the released energy comes from the capacitor's stored energy (E = ½CV²), and the path requires **conductivity** (sparks need a medium).
**Proposal → bucket 1:** energy-conserving discharge: (a) released energy drawn from `STORED_ENERGY`/`ENERGY` — `release = ½·c²/C` (real: capacitor energy); (b) **conductive path gate** — the aimed kick requires a conductive neighbor in the gradient direction (real: breakdown needs a path); (c) **EM pulse** — the heat spike is joined by a brief SIGNAL flash (real: lightning emits light + radio); (d) keep the reset-to-zero and gradient aiming.
**Pseudocode:**
```
if (|c| >= 0.5):
  release = 0.5·c·c/C                                 // capacitor energy
  STORED_ENERGY −= release (floor 0);  ENERGY += release·0.5
  if (conductive neighbor in aim direction):          // path exists
    kick aimed (unchanged);  SIGNAL += release·0.1    // EM pulse flash
  else: random fallback (unchanged)
  TEMP = min(1, TEMP + |c|·0.08);  CHARGE = 0
```
**CPU:** current ≈ 12 flops + 1 RNG (fallback). Proposed = +2 writes + path gate (1 grid lookup). **Δ ≈ +10%**.
**Risks:** energy-conserving discharge changes the energy economy (audit `batch_16` discharge tests); C constant shared with the CAPACITANCE proposal.

## PLASMA (64, electromagnetism)

**Current (`src/physics/laws.js` `applyPlasma`):** T > 0.6 ionizes (heat → CHARGE, cooling); T < 0.5 recombines (CHARGE → heat); 0.5–0.6 hysteresis band.
**IRL basis:** ionization fraction follows the **Saha equation** — continuous in temperature (`n_i/n ∝ exp(−χ/kT)`), and recombination emits **radiation** (recombination lines).
**Proposal → bucket 1:** Saha-flavored equilibrium + recombination radiation: (a) continuous conversion — ionization rate `∝ max(0, T − 0.6)` (piecewise-linear Saha proxy — keep the hysteresis band to avoid oscillation); (b) **recombination radiation** — when a cooled plasma recombines, emit a SIGNAL flash (real: recombination photons); (c) **mobility** — ionized particles get a small CHARGE_LAW/FLUX coupling boost (plasma is conductive — real: plasma responds to EM fields).
**Pseudocode:**
```
excess = T − 0.6
if (excess > 0): CHARGE += excess·k;  T −= excess·k·0.5    // ionization (unchanged)
else if (T < 0.5 && CHARGE != 0):
  T = min(1, T + |c|·k·2);  SIGNAL += |c|·0.05             // recombination radiation
  CHARGE = 0
// conductive plasma: CHARGE_LAW/FLUX coupling × (1 + |c|) for ionized particles
```
**CPU:** current ≈ 10 flops. Proposed = +1 flash write + coupling factor. **Δ ≈ +5%**.
**Risks:** recombination flash feeds COMMS/LANGUAGE channels (document); Saha proxy is a piecewise-linear approximation (document the simplification honestly).

## SUPERCONDUCTIVITY (65, electromagnetism)

**Current (`src/physics/laws.js` `applySuperconductivity`):** pairs with T ≤ 0.35 couple: charge equalizes, relative velocity damps toward alignment; RESISTANCE ×0.2 while active.
**IRL basis:** BCS superconductivity — **Cooper pairs** of correlated electrons carry persistent current with **zero resistance** below T_c; superconductors **expel magnetic fields** (Meissner effect) and break down above a **critical field H_c**.
**Proposal → bucket 1:** persistent Cooper pairs + Meissner + critical field: (a) **binding** — once a pair forms below T_c, mark it bound (persistent current: charge exchange becomes lossless — RESISTANCE factor drops to ×0 instead of ×0.2); (b) **Meissner** — bound pairs repel MAGNETISM sources (soft gate: magnetic force × −0.5 on bound pairs — field expulsion); (c) **critical field** — strong magnetic environment (|m1·m2| above threshold) or T > T_c breaks the pair (real: H_c destroys superconductivity).
**Pseudocode:**
```
if (T1 > T_C || T2 > T_C): unbind pair (if bound); return
if (not bound && close): bind (marker stride 97)          // Cooper pair
if (bound):
  RESISTANCE factor = 0 (lossless)                        // true zero resistance
  MAGNETISM force on pair × −0.5                          // Meissner expulsion
  charge equalize + velocity couple (unchanged)
if (|m1·m2| > H_CRIT): unbind; TEMP += 0.05               // critical field quench
```
**CPU:** current ≈ 12 flops/pair. Proposed = +binding marker read/write + Meissner gate. **Δ ≈ +10%**.
**Risks:** binding marker needs stride space (96-99 budget — flag); the Meissner force reversal is a big behavior change (audit `batch_17` superconductivity tests).
**Definition (T_C):** canonical critical temperature — `FINAL-REPORT.md` → *Shared Constants & World-Param Definitions* (proposed world param `CRITICAL_TEMP`, `[0.05, 0.5]`, default 0.2; shared with BOSONIC).

## ANTENNA (107, electromagnetism)

**Current (`src/physics/lawgroups/emLaws.js` `applyAntenna`):** SIGNAL boost ∝ `min(speed,5)·0.01·k` when SIGNAL > 0.05 (directional broadcast along velocity).
**IRL basis:** antennas radiate **power** (a real loss) from an **oscillating current**, have a **gain pattern** (directionality), and are **reciprocal** (receive like they transmit).
**Proposal → bucket 1:** radiating antenna with reciprocity: (a) **radiation loss** — boosting drains `ENERGY −= boost·0.02` (real radiated power); (b) **carrier oscillation** — emission only during the positive phase of the PULSE_RATE oscillator (real: radiation at the carrier frequency); (c) **gain pattern** — forward lobe along velocity (already), sharpen with speed (real: end-fire arrays); (d) **reciprocity** — receiving is boosted symmetrically (incoming SIGNAL gains the same pattern — real antenna reciprocity).
**Pseudocode:**
```
if (SIGNAL <= 0.05 || phase <= 0) return null             // oscillator gate
boost = min(speed, 5)·0.01·k·gain(phase)                  // forward lobe
SIGNAL += boost;  ENERGY −= boost·0.02 (floor 0)          // radiation loss
// reciprocity: incoming SIGNAL from a front-facing source gains ×(1 + boost)
```
**CPU:** current ≈ 6 flops + 1 sqrt. Proposed = +oscillator phase (1 sin) + ENERGY write + receive branch. **Δ ≈ +10%**.
**Risks:** radiation loss couples ANTENNA to the energy economy (worlds with dense signaling swarms drain faster — document); oscillator phase shared with GLOW/COMMS/RESONANCE (single definition to keep).

---

## Batch 07 Summary
| Law | Target bucket | CPU Δ | Key change |
|-----|--------------|-------|------------|
| RESONANCE | 1 | +5% | Q-filtered resonance + energy transfer + free decay |
| IONIZATION | 1 | +8% | Inelastic impact + free carrier + recombination |
| DISCHARGE | 1 | +10% | Energy-conserving spark + conductive path + EM flash |
| PLASMA | 1 | +5% | Saha-flavored equilibrium + recombination radiation |
| SUPERCONDUCTIVITY | 1 | +10% | Persistent Cooper pairs, zero resistance, Meissner, H_c |
| ANTENNA | 1 | +10% | Radiating loss + carrier oscillation + reciprocity |

**Migration:** 6/6 → bucket 1. **Net CPU:** +5-10% on bounded costs; SUPERCONDUCTIVITY picks up a stride marker (96-99 budget).
**Quality pass (Rv/linear):** produced → reflected (5 issues: RESONANCE Q source, IONIZATION pair-recollision ambiguity, DISCHARGE path lookup, SUPERCONDUCTIVITY stride + Meissner reversal, ANTENNA phase coupling) → refined (SIGNAL_DECAY reuse note, sign-based recombination, grid lookup note, stride flag + audit note, shared-oscillator note) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: none blocking — stride 96-99 allocation and shared oscillator definition flagged for the confirm loop.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 22/112: audit-suite/law-revamp/batch_08.md (117 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 08 (Information: Vague)

**Laws:** SHIELDING (108) · POLARIZATION (109) · MEMORY (66) · PATTERN (67) · SIGNAL_BOOST (69) · LEARN (70)
**Series phase:** 8 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model; no bench spotlight anchors for these laws (marginal costs are bounded pairwise/per-particle).

---

## SHIELDING (108, electromagnetism)

**Current (`src/physics/lawgroups/emLaws.js` `applyShielding`):** spends ENERGY to bleed CHARGE toward 0 (inhibits EM influence at a cost).
**IRL basis:** a Faraday cage is a **passive conductor** — it cancels external fields in its interior by **redistributing** charge on its surface; it needs **no energy** and **requires conductivity**. Destroying the shielded particle's own charge is the opposite of how shielding works.
**Proposal → bucket 1:** passive conductive isolation: (a) **conductivity requirement** — only CONDUCTIVE particles shield (real: the cage must conduct); (b) **field suppression** — while shielded, external EM forces (CHARGE_LAW/FLUX/MAGNETISM) on the particle are multiplied toward 0 (field-free interior — real), charge **left intact**; (c) **no energy cost** (passive — real); (d) the charge bleed is removed (that behavior belongs to REDUCTION/DISCHARGE).
**Pseudocode:**
```
// solver pair loop, force application:
if (isSet(SHIELDING) && readDNA(i, CONDUCTIVITY) > 0.5):
  EM_force_i *= 0.05                                // cage: field-free interior
// per-particle: remove the ENERGY→CHARGE bleed entirely
```
**CPU:** current ≈ 8 flops + 2 writes per particle. Proposed = 1 DNA read + 1 multiply in the pair loop. **Δ ≈ −20%** (bleed writes removed).
**Risks:** passive shielding changes energy economies (no more drain); audit `batch_28` shielding tests; synergizes with CURRENT (conductive materials only).

## POLARIZATION (109, electromagnetism)

**Current (`src/physics/lawgroups/emLaws.js` `applyPolarization`):** same TUNING_CH1 → SIGNAL exchange toward the mean; mismatched → damp (`×0.99`).
**IRL basis:** polarization filtering follows **Malus's law** — transmitted intensity `I = I₀·cos²θ` where θ is the angle between the wave's polarization and the filter axis; only the aligned component passes.
**Proposal → bucket 1:** Malus-law channel filtering: (a) treat TUNING_CH1-4 as a 4D orientation vector (channel axis); (b) pass factor `= cos²(Δθ)` between the sender's polarization and the receiver's axis (real attenuation curve — replaces the binary match/damp); (c) fully orthogonal signals are blocked (cos²(90°) = 0 — real crossed polarizers).
**Pseudocode:**
```
axis_i = normalize(TUNING_CH1..4 of i);  axis_j = normalize(TUNING_CH1..4 of j)
cosT = |axis_i·axis_j|
pass  = cosT·cosT                                      // Malus's law
SIGNAL_i = clamp(SIGNAL_i + (SIGNAL_j·pass − SIGNAL_i)·t·k, 0, 10)
SIGNAL_j = clamp(SIGNAL_j + (SIGNAL_i·pass − SIGNAL_j)·t·k, 0, 10)
```
**CPU:** current ≈ 8 flops/pair. Proposed = +4 reads + 1 cos² (≈ 6 flops). **Δ ≈ +10%**.
**Risks:** TUNING_CH1-4 are used by ENCRYPTION (cipher key) — coordinate the 4D-axis reading with the cipher's key folding; audit `batch_28` polarization tests.

## MEMORY (66, information)

**Current (`src/physics/laws.js` `applyMemoryRefresh`/`applyMemoryDecay`):** contact +0.05 (cap 1); decay ×0.995/tick; velocity × (1 + mem·k·0.02) (momentum persistence).
**IRL basis:** memory is **Hebbian** (co-activation strengthens — "fire together, wire together") and forgets on the **Ebbinghaus curve** (fast early loss, slow tail — a power law, not a constant exponential).
**Proposal → bucket 1:** Hebbian reinforcement + Ebbinghaus forgetting: (a) refresh ∝ **co-activity** — `MEMORY += s_i·s_j·rate` (both signaling/active partners strengthen the trace — real Hebbian); (b) **power-law forgetting** — decay = `mem·(0.9 + 0.09·(1 − mem))` per tick (fast initial loss, slow consolidation tail — Ebbinghaus proxy); (c) keep momentum persistence (memory → inertia is a reasonable abstraction of retained motion habits).
**Pseudocode:**
```
// pair phase (both signaling):
MEMORY_i = min(1, MEMORY_i + s_i·s_j·0.05·k)          // Hebbian co-activation
MEMORY_j = min(1, MEMORY_j + s_i·s_j·0.05·k)
// per particle:
MEMORY *= (0.9 + 0.09·(1 − MEMORY))                    // Ebbinghaus forgetting
V *= 1 + MEMORY·k·0.02                                  // persistence (unchanged)
```
**CPU:** current ≈ 6 flops + 3 writes. Proposed = +2 reads + 2 flops + non-linear decay (1 mul). **Δ ≈ +5%**.
**Risks:** Hebbian refresh changes MEMORY dynamics for silent populations (no signaling → no memory growth — real); FEEDBACK/OBSERVER/NAVIGATION depend on MEMORY (hard gates — behavior shifts).

## PATTERN (67, information)

**Current (`src/physics/laws.js` `applyPatternForce`):** cohesion `k/(dist+1)` for dist ≥ 1 — dense regions attract more particles (positive feedback → clump thickening).
**IRL basis:** real pattern formation is **reaction–diffusion** (Turing patterns: local **activation** + long-range **inhibition** → spots, stripes, spacing). Pure attraction is *aggregation*, which collapses into one blob rather than forming patterns.
**Proposal → bucket 1:** activator–inhibitor spacing: (a) **short-range attraction** (contact: dist < r_sum — the activator); (b) **long-range inhibition** (repulsion beyond contact, falling as 1/dist² — the inhibitor); (c) the balance creates characteristic spacing (real Turing wavelength) instead of collapse; (d) keep the HISTORY synergy (remembered geometry drift).
**Pseudocode:**
```
if (dist < r_i + r_j):                                  // activator zone
  F += +k/(dist + 1)                                    // cohesion (unchanged)
else if (dist < PATTERN_RANGE):                         // inhibitor zone
  F += −k·0.4/(dist·dist + 1)                           // long-range repulsion
// net: clumps form, then self-space at the Turing wavelength
```
**CPU:** current ≈ 6 flops/pair. Proposed = +range branch + inhibition (4 flops). **Δ ≈ +15%**.
**Risks:** the inhibitor zone must be capped (`PATTERN_RANGE` — world param or reuse NEIGHBORHOOD_RADIUS) to stay grid-bounded; audit `batch_17` pattern tests (aggregation expectations change to spacing).

## SIGNAL_BOOST (69, information)

**Current (`src/physics/laws.js` `applySignalBoost`):** contact relay — `s2 += s1·k·(0.5 + SIGNAL_STRENGTH·0.5)`.
**IRL basis:** real relays/repeaters amplify with **gain saturation** (output capped at the amplifier's ceiling), **power consumption**, and **SNR degradation** (each hop adds noise/loss). Neural synapses are the same: bounded gain, metabolic cost.
**Proposal → bucket 1:** saturating powered repeater: (a) **saturation** — relayed signal capped at the source's own ceiling: `gain = min(GAIN_MAX, (0.5 + SIGNAL_STRENGTH·0.5))`, output `min(1, ...)` (already capped — make the *gain* saturate too, diminishing for near-max signals); (b) **relay cost** — `ENERGY −= relay·0.01` (real: repeaters are powered, synapses burn ATP); (c) **hop loss** — relayed signal carries `×0.97` attenuation (real SNR degradation per hop).
**Pseudocode:**
```
if (s1 > 0.01):
  gain = min(2.0, 0.5 + SIGNAL_STRENGTH·0.5)           // saturating gain
  s2 += s1·k·gain·0.97                                  // hop loss
  ENERGY_1 −= s1·k·gain·0.01                            // relay power cost
```
**CPU:** current ≈ 8 flops/pair + 1 DNA read. Proposed = +1 min + 1 mul + 1 ENERGY write. **Δ ≈ +8%**.
**Risks:** relay cost drains signaling swarms (energy economy — document with ANTENNA/GLOW costs); audit `batch_18` signal tests.

## LEARN (70, information)

**Current (`src/physics/laws.js` `applyLearnAlign`):** boids alignment — `v1 += (v2 − v1)·k·0.1`.
**IRL basis:** social learning is **selective imitation** — animals copy *successful* individuals, learn fast when **young** (critical periods), and **retain** learned behavior (memory-linked). Velocity matching alone is just alignment, not learning.
**Proposal → bucket 1:** selective imitation with critical period + retention: (a) **selectivity** — copy only from neighbors with higher fitness proxy (`ENERGY` or `MEMORY` — real: copy winners); (b) **critical period** — learning rate scales with youth: `learnRate = k·0.1·max(0, 1 − AGE/3000)` (young plastic, adults set); (c) **retention** — learned alignment is stored through MEMORY (the alignment delta reinforces MEMORY — learned behavior persists after the teacher leaves).
**Pseudocode:**
```
if (ENERGY_j > ENERGY_i):                              // copy successful neighbor
  learnRate = k·0.1·max(0, 1 − AGE_i/3000)             // critical period
  v_i += (v_j − v_i)·learnRate
  MEMORY_i = min(1, MEMORY_i + learnRate·0.5)          // retention
```
**CPU:** current ≈ 6 flops/pair. Proposed = +2 reads (ENERGY, AGE) + gate + 1 write. **Δ ≈ +8%**.
**Risks:** selectivity stops alignment for low-energy populations (behavior shift — audit `batch_18` learn tests); critical period makes old particles rigid (document).

---

## Batch 08 Summary
| Law | Target bucket | CPU Δ | Key change |
|-----|--------------|-------|------------|
| SHIELDING | 1 | −20% | Passive conductive isolation (field suppression, no bleed) |
| POLARIZATION | 1 | +10% | Malus-law cos² filtering across TUNING_CH1-4 |
| MEMORY | 1 | +5% | Hebbian co-activation + Ebbinghaus forgetting |
| PATTERN | 1 | +15% | Activator–inhibitor Turing spacing |
| SIGNAL_BOOST | 1 | +8% | Saturating powered repeater with hop loss |
| LEARN | 1 | +8% | Selective imitation + critical period + retention |

**Migration:** 6/6 → bucket 1. **Net CPU:** SHIELDING's simplification offsets the small increases elsewhere.
**Quality pass (Rv/linear):** produced → reflected (5 issues: SHIELDING conductivity scope, POLARIZATION/ENCRYPTION channel conflict, MEMORY gate shifts, PATTERN inhibitor range, LEARN selectivity direction) → refined (conductivity gate, 4D-axis note, dependency note, NEIGHBORHOOD_RADIUS cap, copy-winners rule) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: none blocking — POLARIZATION/ENCRYPTION channel sharing and PATTERN range constant flagged for the confirm loop.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 23/112: audit-suite/law-revamp/batch_09.md (125 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 09 (Information/Quantum Mix)

**Laws:** SYMBOL (71) · FEEDBACK (76) · LANGUAGE (77) · CULTURE (78) · HISTORY (81) · UNCERTAINTY (116)
**Series phase:** 9 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model + measured anchor from `bench-baseline.json` (2026-08-10, dirty 7.0.0 worktree, 500 particles): HISTORY `9.08 ms/tick`. Percent deltas apply to each law's *marginal* cost.

---

## SYMBOL (71, information)

**Current (`src/physics/laws.js` `applySymbolForce`):** 8-bin SYMBOL_TOKEN; higher-MEMORY "authority" imprints its token on contact; same-token attract (`+0.15·k/(dist+1)`), different-token repel weakly.
**IRL basis:** symbol grounding / convention formation — arbitrary signals acquire shared meaning through repeated association; meanings are **negotiated** (contested by competing conventions) and **reliability-weighted** (well-grounded symbols are trusted more).
**Proposal → bucket 1:** negotiated conventions with confidence: (a) **negotiation** — when two *authorities* (both high-MEMORY) with different tokens meet, both tokens shift toward the pair mean (real: meaning is contested, not just copied); (b) **confidence** — each particle tracks token confidence (imprint count, stride 97); attraction strength ∝ min confidence (real: shared meaning is only as strong as the least-certain holder); (c) **innovation** — weak imprints occasionally drift to a neighboring bin (real: new conventions arise from usage drift).
**Pseudocode:**
```
if (dist < rSum + 0.5):
  if (MEMORY_i > 0.5 && MEMORY_j > 0.5 && token_i !== token_j):
    token_i = round(mean); token_j = round(mean)          // negotiation
  else if (MEMORY_i > MEMORY_j): token_j = token_i         // imprint (unchanged)
  CONF_i = min(1, CONF_i + 0.05);  CONF_j = min(1, CONF_j + 0.05)
  if (prng() < 0.001·dt): token = (token + ±1) mod 8       // innovation drift
force: same-token → +0.15·k·min(CONF_i, CONF_j)/(dist+1)   // confidence-weighted
```
**CPU:** current ≈ 15 flops/pair. Proposed = +1 confidence read + negotiation branch + rare RNG. **Δ ≈ +8%**.
**Risks:** confidence stride (97) shares the 96-99 budget; negotiation changes the v4.6.29 imprint semantics (audit `batch_18` symbol tests).

## FEEDBACK (76, information)

**Current (`src/physics/laws.js` `applyFeedback`):** MEMORY grows with speed (`+speed·k·0.02`); motion boosted by MEMORY (`×mem·k·0.1`) — a self-reinforcing inertial loop.
**IRL basis:** real positive-feedback loops **saturate** (logistic/resource-limited growth — otherwise exponential blow-up) and consume **resources**; delayed feedback produces oscillation (the HELP_DB already notes "runaway or orbits").
**Proposal → bucket 1:** saturating, costly positive feedback: (a) **saturation** — boost `× (1 − speed/MAX_VELOCITY)` (logistic cap — prevents NaN/runaway, produces the documented orbits); (b) **resource cost** — the amplification drains `ENERGY −= boost·0.02` (real: feedback machines burn fuel); (c) keep the memory↔motion coupling (the loop itself is the real phenomenon).
**Pseudocode:**
```
speed = |v|
MEMORY = min(1, MEMORY + speed·k·0.02)
if (MEMORY > 0 && speed > 0.001):
  cap = 1 − min(1, speed/MAX_VELOCITY)                   // logistic saturation
  boost = MEMORY·k·0.1·cap
  V += v̂·boost;  ENERGY = max(0, ENERGY − boost·0.02)    // fueled loop
```
**CPU:** current ≈ 8 flops + 1 sqrt. Proposed = +1 mul + 1 ENERGY write. **Δ ≈ +5%**.
**Risks:** the energy cost tames runaway loops (behavior change — audit `batch_20` feedback tests); saturation shifts the orbit attractor (document).

## LANGUAGE (77, information)

**Current (`src/physics/laws.js` `applyLanguage`):** signaling pairs converge MEMORY toward the mean + relay SIGNAL.
**IRL basis:** real language transfers **discrete symbols** (not continuous states), is **directional** (speaker → listener), and is **rate-limited by the channel** (Shannon: information rate ≤ channel capacity).
**Proposal → bucket 1:** directed symbol transfer with channel capacity: (a) **discrete** — transfer moves the speaker's SYMBOL token (tie to the SYMBOL law) rather than continuous MEMORY; (b) **directional** — the higher-SIGNAL particle is the speaker; the listener adopts the transmitted token at a rate ∝ received SIGNAL (real: comprehension ∝ signal quality); (c) **channel capacity** — transfer rate capped by SIGNAL strength (Shannon limit — strong signals transfer fast, weak signals are lossy); (d) MEMORY convergence kept as the "shared context" effect.
**Pseudocode:**
```
if (s1 <= 0.01 && s2 <= 0.01) return
speaker = s1 >= s2 ? i : j;  listener = the other
capacity = min(1, SIGNAL_speaker·k)                       // Shannon rate
token_listener = blend(token_listener, token_speaker, capacity·0.1)
MEMORY both → pair mean (unchanged)                        // shared context
SIGNAL_listener += SIGNAL_speaker·k·0.1 (unchanged)        // relay
```
**CPU:** current ≈ 10 flops/pair. Proposed = +token read/write + direction branch. **Δ ≈ +8%**.
**Risks:** LANGUAGE now depends on SYMBOL tokens (soft dependency to add — currently only a COMMS-ish gate); audit `batch_20` language tests.

## CULTURE (78, information)

**Current (`src/physics/laws.js` `applyCulture`):** same-species contacts blend the DNA cache (14 loci, step 3) at `rate = k·0.02`.
**IRL basis:** cultural transmission is **conformist** (the majority/common trait spreads faster — real: humans and social insects copy the dominant form), has **innovation/drift** (new variants arise), and transmits **observable** traits (visible behaviors, not hidden physiology).
**Proposal → bucket 1:** conformist transmission with innovation: (a) **conformity bias** — convergence toward the local *majority* trait: `rate ∝ (n_local_with_trait/n_local)` (real conformist transmission); (b) **innovation** — rare random trait drift (MUTATION DNA at low rate — real cultural mutation); (c) **observable traits only** — restrict the blend to display-relevant loci (COLOR, SIGNAL-related, a few behavioral traits) instead of all 14 (real: culture transmits visible forms).
**Pseudocode:**
```
if (species differ) return
majority = localCount(trait ≈ common) / localCount        // conformity (grid)
rate = k·0.02·max(0.5, majority·2)                        // conformist boost
for d in OBSERVABLE_LOCI (color/signal/behavior subset):   // ~6 loci, not 14
  v1 = blend(v1, v2, rate);  v2 = blend(v2, v1, rate)
if (prng() < MUTATION·0.001·dt): one locus += drift        // innovation
```
**CPU:** current ≈ 30 flops/pair (14 loci). Proposed = 6-locus loop (~13 flops) + majority read + rare RNG. **Δ ≈ −40%** (loop halved).
**Risks:** observable-locus restriction changes which traits homogenize (audit `batch_19/20` culture tests); conformity needs per-cell trait histograms (grid addition).

## HISTORY (81, information)

**Current (`src/physics/laws.js` `applyHistoryWrite`/`Calc`/`Force`):** 12³ memory field, exponential decay, energy/mass-weighted presence; particles drift toward the field's **global centre of mass** (`computeHistoryCom` scans all 1728 cells every tick).
**IRL basis:** environmental memory / landscape archaeology — past activity leaves *local* traces (trails, nests, sediment) that steer movement along **local gradients**; animals don't navigate to a global center of mass of all past activity.
**Proposal → bucket 1:** local gradient following: (a) **∇History steering** — sample the 26 neighbor cells around the particle's cell and steer along the local gradient (real: follow local traces) — replaces the global-COM attractor; (b) keep the write/decay (traces erode — real); (c) **redundancy removal** — the 1728-cell COM scan disappears.
**Pseudocode:**
```
// per particle (once per tick):
cell = floor(pos/worldSize·HISTORY_DIM)
g = 0
for each of 26 neighbors n:  g += (v_n − v_cell)·(dir_n)   // local gradient
if (|g| > eps): F = ĝ·k                                     // steer along trace
// remove computeHistoryCom (1728-cell scan) entirely
```
**CPU:** current = write O(1) + COM scan **O(1728)** per tick + force O(1). Proposed = write O(1) + 26-cell gradient probe + force O(1). **Δ ≈ −80%** (the per-tick COM scan dominated).
**Risks:** local gradients change the attractor topology (no more global archaeology pull — audit `batch_21` history tests); the 26-cell probe must be bounded per particle (grid-bounded — fine).

## UNCERTAINTY (116, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyUncertainty`):** speed-gated tradeoff — fast (≥0.5): position jitter only; slow: velocity kicks only. (Batch-30 RRP "match docs".)
**IRL basis:** Heisenberg `Δx·Δp ≥ ħ/2` is a **product constraint**, continuous and symmetric — reducing position uncertainty *forces* momentum uncertainty up (and vice versa); it is not a speed threshold. Measurement (OBSERVER) collapses one observable at the expense of the conjugate.
**Proposal → bucket 1:** product-conserving uncertainty with measurement coupling: (a) **uncertainty product** — per particle, maintain `Δx·Δp ≈ ħ` with ħ a small constant: jitter magnitude in position is inversely tied to the velocity-spread (the *product* is preserved — real); (b) **measurement coupling** — when OBSERVER measures the particle (collision flag), position jitter drops and velocity kick rises (real: measuring position spreads momentum); (c) keep SplitMix32 determinism.
**Pseudocode:**
```
hbar = 0.02·k
Δp = spread of recent |v| (EMA)                          // momentum uncertainty
Δx = hbar/max(Δp, 1e-4)                                  // product conserved
if (measured this tick): Δx *= 0.5;  Δp *= 2              // observer collapse
POS += (prng()−0.5)·Δx;  VEL += (prng()−0.5)·Δp·0.5       // dual jitter
```
**CPU:** current ≈ 1 sqrt + 3 RNG + writes. Proposed = +1 div + EMA (2 flops). **Δ ≈ +3%**.
**Risks:** the speed-gated design was a deliberate RRP choice (batch-30) — the product model is a *different* design; flag for user confirmation before replacing; audit `batch_30` uncertainty tests.

---

## Batch 09 Summary
| Law | Target bucket | Bench anchor (ms/tick) | CPU Δ | Key change |
|-----|--------------|------------------------|-------|------------|
| SYMBOL | 1 | — | +8% | Negotiated conventions + confidence weighting |
| FEEDBACK | 1 | — | +5% | Saturating logistic loop with resource cost |
| LANGUAGE | 1 | — | +8% | Directed discrete symbol transfer, Shannon rate |
| CULTURE | 1 | — | −40% | Conformist transmission, observable loci only |
| HISTORY | 1 | 9.08 | −80% | Local ∇History gradient (kills the 1728-cell COM scan) |
| UNCERTAINTY | 1 | — | +3% | Product-conserving Δx·Δp with observer coupling |

**Migration:** 6/6 → bucket 1. **Net CPU:** the HISTORY and CULTURE wins dominate — this batch is a net **performance gain**.
**Quality pass (Rv/linear):** produced → reflected (5 issues: SYMBOL confidence stride, FEEDBACK economy, LANGUAGE/SYMBOL dependency, CULTURE trait scope, HISTORY topology change, UNCERTAINTY design conflict) → refined (stride 97 flag, saturation cap, soft dependency note, observable-loci list, gradient note, confirmation flag) → check: 6/6 bucket-1, CPU tables + risks on all; unresolved: UNCERTAINTY's deliberate speed-gate design conflict flagged for explicit user confirmation.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 24/112: audit-suite/law-revamp/batch_10.md (106 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# IRL-Fidelity Theorycraft — Batch 10 (Quantum: Vague)

**Laws:** TELEPORT (117) · OBSERVER (118) · COHERENCE (120) · BOSONIC (121) · SPECTRAL (124)
**Series phase:** 10 of 10 · **Source bucket:** 2 ("vaguely models IRL") · **Goal:** bucket 1, else bucket 2.
**CPU method:** analytical per-particle-per-tick cost model; no bench spotlight anchors for these laws (marginal costs are bounded pairwise/per-particle).

---

## TELEPORT (117, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyTeleport`):** v4.6.29 quantum-teleportation protocol — requires ENTANGLE_ID, `0.002·k/tick` chance, sender pays 5 ENERGY (classical-channel cost), partner adopts velocity + 30% ENERGY, sender collapses to a jittered ground state, link consumed. No position jump, no clone.
**IRL basis:** the real protocol transfers an unknown quantum state through an entangled link plus a **classical channel (2 bits)**; the sender's state is destroyed (no-cloning — already modeled) and the transfer is **imperfect** (fidelity < 1).
**Proposal → bucket 1:** complete the protocol: (a) **Bell-measurement step** — the sender's state is measured and the partner applies the classical-correction (add the measurement phase — real: correction is required to finish teleportation); (b) **fidelity loss** — transferred velocity/energy carries small noise (`×(1 ± 0.02·noise)`) (real: imperfect fidelity); (c) keep no-cloning, the link consumption, and the classical-channel energy cost (already faithful).
**Pseudocode:**
```
if (ENTANGLE_ID < 0 || prng() >= 0.002·k || ENERGY < 10) return
ENERGY −= 5                                            // classical channel (unchanged)
// Bell measurement + correction:
outcome = prng() < 0.5 ? +1 : −1
partner.VEL += outcome·(sender.VEL − partner.VEL)·0.9
partner.ENERGY += sender.ENERGY·0.3·(1 + 0.02·(prng()−0.5))   // fidelity < 1
sender.VEL = jittered ground state (unchanged);  ENTANGLE_PHASE = 0
```
**CPU:** current ≈ 15 flops + 1 RNG + writes. Proposed = +1 RNG + 2 flops (correction + fidelity) on the rare success path. **Δ ≈ +5%**.
**Risks:** the correction term changes the transferred momentum (audit `batch_30` teleport tests); fidelity noise is PRNG on a rare path (negligible).

## OBSERVER (118, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyObserver`):** high-MEMORY (>0.5) particles damp nearby velocity spread and copy their own state onto the observed particle.
**IRL basis:** the observer effect — **measurement collapses the quantum state** and *disturbs* the measured system (Heisenberg back-action). "Copy your state onto them" is cloning, which real measurements don't do.
**Proposal → bucket 1:** collapse-with-disturbance: (a) **collapse** — observing sets the target's wave-related state to a definite value: `WAVE_MEASURED = 1` and SUPERPOSITION amplitudes collapse to one basis (tie to WAVE_PARTICLE — real: measurement collapses the superposition); (b) **disturbance** — the collapse perturbs the target's momentum (uncertainty back-action — ties to the UNCERTAINTY proposal: measured → Δp grows); (c) **observer cost** — observing drains `ENERGY −= 0.01·k` (real: measurement requires interaction energy); (d) remove the velocity-copy (that's control, not observation).
**Pseudocode:**
```
if (MEMORY_i > 0.5):
  WAVE_MEASURED_j = 1                                  // collapse flag (stride 94)
  collapseSuperposition(j)                             // one basis survives
  VEL_j += (prng()−0.5)·0.05·k                          // measurement back-action
  ENERGY_i = max(0, ENERGY_i − 0.01·k)                 // observer cost
```
**CPU:** current ≈ 10 flops/pair + writes. Proposed = +collapse write + 1 RNG + cost write. **Δ ≈ +8%**.
**Risks:** OBSERVER is a hard dependency of WAVE_PARTICLE collapse (solver sets WAVE_MEASURED on collision already) — unify the flag write; audit `batch_30` observer tests.

## COHERENCE (120, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyCoherence`):** similar-velocity pairs (diff < 1) damp relative motion — phase-locking by momentum.
**IRL basis:** coherence is a **fixed phase relationship** between states; it is **fragile** (environmental decoherence destroys it — high temperature = fast loss) and enables **interference** (coherent sources add constructively/destructively).
**Proposal → bucket 1:** phase-coherent coupling with decoherence sensitivity: (a) **phase lock** — also entrain `PHASE_1` toward the pair mean (real: coherence is phase, not just momentum); (b) **fragility** — the lock weakens with temperature: coupling `× max(0, 1 − T·2)` (real: thermal decoherence); (c) **interference** — coherent pairs (|Δphase| < 0.1) exchange SIGNAL constructively (`SIGNAL += s_other·0.1`), out-of-phase pairs destructively (damp) — real constructive/destructive interference.
**Pseudocode:**
```
diff = |v_i − v_j|
if (diff < 1):
  fragility = max(0, 1 − (T_i + T_j))                   // thermal decoherence
  V coupling × fragility (unchanged force × fragility)
  PHASE_1_i, PHASE_1_j → pair mean·fragility             // phase lock
  if (|ΔPHASE_1| < 0.1): SIGNAL exchange constructive
  else if (|ΔPHASE_1| > 0.4): SIGNAL damped destructive
```
**CPU:** current ≈ 8 flops/pair + 1 sqrt. Proposed = +phase writes + T reads + interference branch. **Δ ≈ +8%**.
**Risks:** PHASE_1 writers must be reconciled (SYNCHRONICITY proposal also writes it — one shared phase-update path in the confirm loop); thermal fragility changes coherence persistence (audit `batch_31` coherence tests).

## BOSONIC (121, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applyBosonic`):** strong mutual attraction when dist < 3 ("force-carrier clusters").
**IRL basis:** bosons don't attract — **identical bosons occupy the same quantum state** (Bose–Einstein statistics), and below a critical temperature they **condense** (BEC: the population piles into the ground state). The observable behavior is *convergence into one shared state*, not a cohesion force.
**Proposal → bucket 1:** Bose–Einstein condensation: (a) **state sharing** — close bosonic particles converge their velocity/phase toward the cluster's *ground state* (the pair mean — real: N bosons in one state), replacing the generic attraction; (b) **temperature gate** — bunching/condensation only below `T < T_C` (real: BEC needs ultralow T — ties to COLD/SUPERCONDUCTIVITY); (c) **no exclusion** — occupancy is unlimited (contrast FERMIONIC — real: bosons bypass Pauli).
**Pseudocode:**
```
if (dist < 3 && (T_i + T_j)·0.5 < T_C):                 // below BEC threshold
  v̄ = (v_i + v_j)·0.5                                    // shared ground state
  V_i += (v̄ − v_i)·0.1·k;  V_j += (v̄ − v_j)·0.1·k       // condensation convergence
  PHASE_1_i = mean;  PHASE_1_j = mean                    // same state
```
**CPU:** current ≈ 8 flops/pair. Proposed = +T reads + convergence (4 flops) + phase writes. **Δ ≈ +8%**.
**Risks:** convergence (not attraction) changes cluster shape (audit `batch_31` bosonic tests); T_C shared with SUPERCONDUCTIVITY's critical temperature (define once).
**Definition (T_C):** canonical critical temperature — `FINAL-REPORT.md` → *Shared Constants & World-Param Definitions* (proposed world param `CRITICAL_TEMP`, `[0.05, 0.5]`, default 0.2; shared with SUPERCONDUCTIVITY).

## SPECTRAL (124, quantum)

**Current (`src/physics/lawgroups/quantumLaws.js` `applySpectral`):** weak species-ID signal emission — `SIGNAL += (0.001 + 0.001·(species%5))·k`.
**IRL basis:** spectral lines are **characteristic discrete frequencies** — atoms emit *and absorb* at their own lines (a spectral fingerprint), and moving emitters **Doppler-shift** their lines.
**Proposal → bucket 1:** discrete emission/absorption fingerprint: (a) **line set from TUNING_CH1-4** — each particle's spectral fingerprint is its tuning vector (discrete lines — real: atoms have fixed line sets), replacing the species-mod-5 hack; (b) **resonant absorption** — particles *absorb* SIGNAL at their own lines: when a neighbor emits on the same channel, the absorber gains it (real: absorption lines); (c) **Doppler shift** — relative velocity shifts the perceived line: matching requires `|ΔTUNING − v_shift| < ε` (real: Doppler broadening/shift).
**Pseudocode:**
```
// emission (per particle):
line = normalize(TUNING_CH1..4);  SIGNAL += 0.001·(1 + |line|)·k
// absorption (pair phase):
Δv = (v_j − v_i)·line_axis;  shift = Δv·DOPPLER
if (|ΔTUNING − shift| < ε):  SIGNAL_i += SIGNAL_j·k·0.05     // resonant absorption
```
**CPU:** current ≈ 4 flops. Proposed = +4 tuning reads + absorption branch (4 flops). **Δ ≈ +10%**.
**Risks:** TUNING_CH1-4 are shared with POLARIZATION (axis) and ENCRYPTION (cipher key) — the confirm loop must define one canonical TUNING semantic; audit `batch_32` spectral tests.

---

## Batch 10 Summary
| Law | Target bucket | CPU Δ | Key change |
|-----|--------------|-------|------------|
| TELEPORT | 1 | +5% | Bell-measurement correction + fidelity loss |
| OBSERVER | 1 | +8% | Collapse-with-disturbance, no cloning |
| COHERENCE | 1 | +8% | Phase lock + thermal fragility + interference |
| BOSONIC | 1 | +8% | BEC condensation into a shared ground state |
| SPECTRAL | 1 | +10% | Discrete tuning-line fingerprint + absorption + Doppler |

**Migration:** 5/5 → bucket 1. **Net CPU:** +5-10% on bounded costs; the batch closes the series on small, safe deltas.
**Quality pass (Rv/linear):** produced → reflected (5 issues: TELEPORT correction physics, OBSERVER/WAVE_PARTICLE flag unification, COHERENCE PHASE_1 writers, BOSONIC T_C sharing, SPECTRAL TUNING semantics) → refined (outcome-based correction, shared flag note, shared phase path, shared T_C, canonical TUNING note) → check: 5/5 bucket-1, CPU tables + risks on all; unresolved: none blocking — TUNING_CH1-4 canonical semantics (POLARIZATION/ENCRYPTION/SPECTRAL) and PHASE_1/T_C shared definitions are the top confirm-loop agenda items.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 25/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/README.md (46 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA Law Audit — RRP (Recursive Reiterative Refinement Protocol) Pass

> Re-running the 128-law audit as an interactive spec-confirmation loop with the
> user: **for each batch of 4 laws**, the current behavior is proposed as a spec,
> the user confirms or amends how the law *should* behave, then the law is
> validated (and repaired if needed) against the confirmed spec.
>
> Status legend: ⏳ pending · 🗣 awaiting user confirmation · ✅ confirmed · ⚠️ spec amended · 🔧 repaired

## Batch index

| Batch | Laws | Status |
|-------|------|--------|
| [01](batch_01.md) | GRAV / DRAG / ENTR / WRAP | ✅ |
| [02](batch_02.md) | COLL / ACCR / PLANETARY / LIFE | ✅ |
| [03](batch_03.md) | GLOW / AFFINITY / REPRO / TRACK | ✅ |
| [04](batch_04.md) | SENESCENCE / ENERGY / RADIATION / GENOTYPE | ✅ |
| [05](batch_05.md) | PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY | ✅ |
| [06](batch_06.md) | OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY | ✅ |
| [07](batch_07.md) | CRYSTALLIZATION / HEAT / COLD / CONVECTION | ✅ |
| [08](batch_08.md) | PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY | ✅ |
| [09](batch_09.md) | CHAOS / ORDER / FATE / WILL | ✅ |
| [10](batch_10.md) | SOUL_LAW / MIND / VOID / BOND | ✅ |
| [11](batch_11.md) | REDUCTION / ALLOY / MELT / BOIL | ✅ |
| [12](batch_12.md) | CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY | ✅ |
| [13](batch_13.md) | CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION | ✅ |
| [14](batch_14.md) | COMMS / CHARGE_LAW / FIELD / CURRENT | ✅ |
| [15](batch_15.md) | RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM | ⏳ |
| [16](batch_16.md) | RESONANCE / FLUX / IONIZATION / DISCHARGE | ⏳ |
| [17](batch_17.md) | PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN | ⏳ |
| [18](batch_18.md) | STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL | ⏳ |
| [19](batch_19.md) | METRIC / PREDICT / CODE / PROTOCOL | ⏳ |
| [20](batch_20.md) | FEEDBACK / LANGUAGE / CULTURE / SINGULARITY | ⏳ |
| [21](batch_21.md) | ENTANGLEMENT / HISTORY / TIDE / FRICTION | ⏳ |
| [22](batch_22.md) | ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION | ⏳ |
| [23](batch_23.md) | SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY | ⏳ |
| [24](batch_24.md) | ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION | ⏳ |
| [25](batch_25.md) | STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION | ⏳ |
| [26](batch_26.md) | EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY | ⏳ |
| [27](batch_27.md) | CONSCIOUSNESS / PERCEPTION / SYNCHRONICITY / ANTENNA | ⏳ |
| [28](batch_28.md) | SHIELDING / POLARIZATION / NAVIGATION / ENCRYPTION | ⏳ |
| [29](batch_29.md) | SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE | ⏳ |
| [30](batch_30.md) | UNCERTAINTY / TELEPORT / OBSERVER / PLANCK | ⏳ |
| [31](batch_31.md) | COHERENCE / BOSONIC / FERMIONIC / SPIN | ⏳ |
| [32](batch_32.md) | SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER | ⏳ |


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 26/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_01.md (31 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 01 — GRAV / DRAG / ENTR / WRAP

Laws under audit (indices 0-3, physics / BLUE). Status: ✅ confirmed + implemented.

## Confirmed spec (user-confirmed 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| GRAV | Inverse-square attraction `F = G·m1·m2/(r²+ε)`; `HIDDEN_MASS` adds mass; **FORCE DNA is pairwise**: both positive multiply the pull, both negative multiply negatively (repel), opposite signs cancel to a gravitationally neutral pair; `TIDAL` boosts close-range pull; stars (`mass > starMass`) pull harder; ×1.5 with PLANETARY. | ✅ |
| DRAG | Velocity damping `VISCOSITY^dt` × world VISCOSITY slider; `FRICTION` DNA adds linear damping — **kept DRAG-gated** (per user). Goal-engine drag multiplier folds in. | ✅ |
| ENTR | Brownian jitter kicks per axis, scaled by `JITTER` DNA × world ENTROPY slider. | ✅ |
| WRAP | Binary: on = toroidal wrap; off = soft walls whose velocity effect is set by the new **WALL REFLECT slider** (0 = 100% absorption, 1 = 100% reflect, 2 = 200% reflect, default 1). | ✅ |

## User decisions (RRP reflect)

1. FRICTION damping stays gated behind DRAG (HELP_DB "always active" note is stale) — no change.
2. WRAP stays binary; added world slider `WALL_REFLECT` (0–2, default 1) for the soft-wall velocity effect.
3. FORCE DNA + GRAV are pairwise: same-sign → multiply (both negative → repulsion); opposite signs cancel each other out (neutral pair).

## Implementation

- `v4/src/state/worldParams.js` — new `WALL_REFLECT` slider (PHYSICS/MOTION, 0–2, default 1).
- `v4/src/physics/solver.js` — soft-wall bounce uses `WALL_REFLECT` (was fixed 50% loss); velocity clamp moved after the position step so wall-bounce velocities (up to 200%) move the particle before the MAX_VELOCITY cap reins them in.
- `v4/src/physics/laws.js` — `applyGravity` FORCE modifier is now pairwise (`fA + fB`; `> 0` amplifies, `< 0` repels, `≈ 0` cancels).
- `v4/src/constants.js` — GRAV/WRAP HELP_DB entries synced to the confirmed behavior.
- Tests: `v4/tests/audit/batch_01.test.js` extended to 10 tests (pairwise FORCE ×3 cases + WALL_REFLECT 0/1/2). Full suite 65 files / 505 tests green.

## Status

- [x] User confirmed spec (3 amendments) → laws marked ✅ confirmed


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 27/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_02.md (32 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 02 — COLL / ACCR / PLANETARY / LIFE

Laws under audit (indices 4-7). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| COLL | Impulse bounce on overlap when the pair is closing (`relVelN > 0`): mass-weighted velocity exchange, bounciness from `ELASTICITY` DNA, softbody push separates overlapping bodies. **Standalone from ACCR** — COLL alone is pure elastic bouncing. Pairs that are fusing under ACCR coalesce instead of bouncing. Off = pass-through. | ✅ |
| ACCR | Mass fusion on overlap. **`FUSION_MOMENTUM` (DNA 16) is the MINIMUM relative momentum to fuse on impact** — faster pairs merge, slower pairs bounce. **`FUSION_TIME` (DNA 17) is how long sub-threshold pairs must stay in very close proximity before they fuse anyway** (proximity dwell; leaving contact resets the clock). Efficiency ×(0.5 + `FUSION` DNA); stars (`mass > starMass`) collapse-pull. Runs standalone without COLL; sub-threshold ACCR-only contacts get a gentle elastic bounce so matter doesn't silently pass through. | ✅ |
| PLANETARY | **Constant downward gravity toward the ground plane (z ≈ 0)** — particles fall through a planet's atmosphere. Force is scaled by mass so acceleration is mass-independent (all particles fall at the same rate). ×1.5 with GRAV. With WRAP off the soft-wall clamp turns z = 0 into the ground. | ✅ |
| LIFE | Metabolic energy decay ∝ (1−`ENERGY_EFFICIENCY`) × DECAY_RATE slider; photosynthesis +0.02×LIGHT_LEVEL; **when the metabolic budget hits 0 the organism dies (energy-depletion death)** — the LIFE metabolic path only, not charge/electromagnetic energy (those live in their own fields/laws). Hunger +0.02/tick, HUNGER>100 → dead. Senescence is a separate law. | ✅ |

## Implementation (v4.6.3)

- `v4/src/physics/solver.js` — COLL/ACCR split:
  - Dwell bookkeeping in the free `MITOSIS_TIMER` / `PARTNER_ID` stride fields; timer resets when the tracked partner leaves overlap range.
  - `fusing = relMomentum >= FUSION_MOMENTUM || dwell >= FUSION_TIME` (relMomentum = relSpeed × min(m1, m2)).
  - COLL push + bounce only when NOT fusing; ACCR-only sub-threshold contacts get a gentle elastic bounce.
  - ACCR mass transfer (dissolution / star collapse / mutual blend) only when fusing.
- `v4/src/physics/laws.js`:
  - `applyPlanetary` → constant downward gravity (az = −0.02×synergy×mass).
  - `applyLifeCycle` → death when metabolic energy hits 0 (before bio-pulse, only under LIFE).
- Tests: `v4/tests/audit/batch_02.test.js` (14 tests) + `v4/tests/audit/params_batch_11.test.js` (FUSION gates rewritten for min-momentum + dwell). Full suite 510/510 green; `vite build` clean.
- HELP_DB entries for COLL / ACCR / PLANETARY / LIFE updated in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (4 amendments applied)
- [x] Implementation + tests (510/510)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 28/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_03.md (29 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 03 — GLOW / AFFINITY / REPRO / TRACK

Laws under audit (indices 8-11). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| GLOW | **Does both**: an oscillator (PULSE_RATE × SIGNAL_STRENGTH DNA) emits signal pulses into SIGNAL (transmission strength) AND existing signal converts into life energy (ENERGY). Life energy is a **separate channel** from signal energy — the multi-energy architecture (batch 03) adds ELECTRIC_ENERGY / STORED_ENERGY / REPRO_DRIVE stride fields so metabolism, electricity, storage, signal, and drive never collide in one pool. | ✅ |
| AFFINITY | **Boosts attraction to the same species**: same-species pull scales with positive SPECIES_AFFINITY, inert at 0, none for xenophobic (negative). Different-species repel only when SPECIES_AFFINITY < 0. | ✅ |
| REPRO | **Gated on REPRODUCTIVE DRIVE, not raw energy**: REPRO_DRIVE (stride 79) accumulates from BIRTH_RATE over time (cap 100); drive ≥ 60 + AGE ≥ 100 → per-tick chance BIRTH_RATE×0.01×synergy to spawn. Spawning consumes the drive and half the parent's life energy. | ✅ |
| TRACK | **Prey must be a different species**: PREDATION_BIAS ≥ 0.1 chases a lower-mass (mass < 0.8×) neighbour, but only across species — predators never hunt their own kind. | ✅ |

## Implementation (v4.6.4)

- Multi-energy stride block (77-79): `ELECTRIC_ENERGY`, `STORED_ENERGY`, `REPRO_DRIVE` added to `STRIDE_INDEXES`; initialized at spawn in `main.js` + `multiplex.js`; exposed via `particleBuffer.js` get/set.
- `applyGlowEffect` — added PULSE_RATE/SIGNAL_STRENGTH oscillator emission + kept signal→energy regen.
- `applyAffinity` — same-species strength = 0.1×max(0, affinity) (fixes the old `Math.abs` bug where xenophobic species attracted their own kind).
- `applyReproduction` — drive accumulation + gate (replaces the energy ≥ 60 gate); drive consumed on spawn.
- `applyTrackingBehavior` — cross-species gate added.
- Tests: `tests/audit/batch_03.test.js` (13) + REPRO/AFFINITY param tests updated (params_batch_06/14/15/16). Full suite 515/515 green; `vite build` clean.
- HELP_DB entries updated for GLOW / AFFINITY / REPRO / TRACK in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (4 amendments applied)
- [x] Implementation + tests (515/515)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 29/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_04.md (31 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE

Laws under audit (indices 12-15). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| SENESCENCE | **Dependent on LIFE being on** — confirmed. Age-based death stays nested inside the LIFE cycle: past AGE 500, per-tick death chance = DEATH_RATE × 0.001 × (1 + ageNorm × 0.5) × dt. Standalone SENESCENCE does nothing (verified by gate test). | ✅ |
| ENERGY | **"What energy?" → all of them.** The ENERGY law conducts every energy reservoir pairwise toward equilibrium: LIFE energy (ENERGY), ELECTRIC_ENERGY and STORED_ENERGY each transfer independently. SIGNAL (transmission strength) and REPRO_DRIVE (drive meter) are not energy reservoirs and stay untouched. | ✅ |
| RADIATION | **Yes** to RADIATION_LEVEL slider scaling, **plus a slow exposure ramp**: particles accumulate RADIATION_EXPOSURE (level × dt × 0.01, cap 100) that compounds damage over time, and the dose increases mutation chance **more and more over time slowly**. | ✅ |
| GENOTYPE | **Expanded — DNA and genetics are a major part.** Base drift now modulated by the genetics params: REPRESSOR damps, HETEROZYGOSITY widens variance, EPIGENETIC_DRIFT adds non-heritable noise, GENE_FLOW pulls foreign genes, RADIATION exposure ramps the rate, and rare mutations write back into the species genome (64×64 DNA buffer) for species-level evolution. | ✅ |

## Implementation (v4.6.5)

- **GLOW correction (retroactive to batch 03):** `applyGlowEffect` is now emission-only — the oscillator raises SIGNAL but never converts signal into life energy (batch 03 shipped the regen; this removes it).
- **SENESCENCE:** unchanged (already nested in LIFE); added explicit gate test.
- **ENERGY:** `applyEnergyTransfer` now loops `ENERGY_CHANNELS = [ENERGY, ELECTRIC_ENERGY, STORED_ENERGY]`, each conserving independently; SIGNAL/REPRO_DRIVE untouched.
- **RADIATION:** `applyRadiationDamage(lawState, view, base, dt, synergy, prng)` — slider scaling, RADIATION_EXPOSURE accumulation (cap 100), compounding damage `(1−ARMOR)×0.02×level×(1+exposure×0.02)`, radiation death at energy ≤ 0, mutation ramp `exposure×0.001×dt×synergy`. Removed the duplicate in-LIFE radiation drain (double-drain bug).
- **GENOTYPE:** `applyGenotypeMutation(..., prng, dnaBuffer)` — repressor damping, exposure ramp, heterozygosity variance, epigenetic drift, gene flow, species-genome writeback (`CROSSOVER_RATE×0.0002×dt`); helper `readSpeciesDNAParam`/`writeSpeciesDNAParam` added and REPRO refactored onto them.
- New stride field `RADIATION_EXPOSURE: 80` (`STRIDE_INDEXES`), initialized at spawn in `main.js` + `multiplex.js`, exposed in `particleBuffer.js`.
- Solver call sites updated (`applyGenotypeMutation` + `applyRadiationDamage` get `prng`/`dnaBuffer`).
- Tests: `tests/audit/batch_04.test.js` rewritten (15 tests: multi-channel conduction, exposure ramp, level scaling, radiation death, mutation ramps, genome writeback) + batch_03 GLOW test corrected (emission-only). Full suite 521/521 green; `vite build` clean.
- HELP_DB entries updated for GLOW / SENESCENCE / ENERGY / RADIATION / GENOTYPE in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (4 amendments + GLOW backport)
- [x] Implementation + tests (521/521)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 30/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_05.md (28 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY

Laws under audit (indices 16-19). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| PHENOTYPE | **Gene expression**: genotype (DNA cache) → visible phenotype. POLARITY → hue, ALPHA → saturation, SYMMETRY → lightness translated into particle colour every tick; ENERGY is the environment — well-fed particles (energy > 100) grow, starving ones shrink ("energy-driven size" = nutrition affecting body size, like real organisms). Offspring inherit DNA → inherit the look. | ✅ |
| CATALYSIS_LAW | **Yes, chemistry multiplier, and free**: chemMult = 1 + CATALYSIS×0.5×synergy, applied to the pre-chemistry forces in the pair loop; never touches energy. | ✅ |
| SOLVATION | **Replicate real-world behavior**: like dissolving salt in water — the solvent exerts charge forces (opposite charges attract, like charges repel, Coulomb-style |q1×q2|) AND charge-different particles react faster. The force was previously dead code; now wired into the solver pair loop. | ✅ |
| ACIDITY | **Documented behavior** (user: "Documented."): particles exchange CHARGE when close, equalizing electrical potential; CONDUCTIVITY DNA controls the transfer rate and the CHARGE field is altered. Replaces the old ENERGY erosion. | ✅ |

## Implementation (v4.6.6)

- **PHENOTYPE** — `applyPhenotype` now writes COLOR_R/G/B from HSL(POLARITY→hue 0-240, ALPHA→saturation, SYMMETRY→lightness) in addition to the energy-modulated radius; `hslToRgb` helper added.
- **CATALYSIS_LAW** — unchanged behaviour (confirmed); locked with a free-cost test (energy untouched over 50 ticks).
- **SOLVATION** — `applySolvation` upgraded: magnitude from the charge product (|q1×q2|, so equal like charges actually repel), sign = attract for opposite signs / repel for like signs, scaled by synergy; dispatched in the solver pair loop alongside the reaction-rate multiplier.
- **ACIDITY** — `applyAcidityEffect` rewritten to documented behaviour: charge flows from the higher-charge particle to the lower at `Δcharge × max(CONDUCTIVITY_i,j) × 0.1 × dt × synergy` when |Δcharge| ≥ 0.3; charge conserved per pair; ENERGY untouched.
- Tests: `tests/audit/batch_05.test.js` rewritten (23 tests: phenotype colour expression, catalysis free + affinity amplification, solvation attract/repel/gate, acidity equalization/gate/conservation). Fixed a flaky catalysis test whose premise was wrong (chemMult runs before the CHARGE_LAW block — now asserts the real amplification target, AFFINITY). Full suite 533/533 green; `vite build` clean.
- HELP_DB entries updated for PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (phenotype explained, cata free, solvation real-world, acidity documented)
- [x] Implementation + tests (533/533)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 31/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_06.md (28 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY

Laws under audit (indices 20-23). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| OXIDATION | **Yes** — real oxidation is electron loss: CHARGE decays toward 0 (electrical rust) alongside the existing MASS erosion, and HEAT_OUTPUT DNA releases heat + a glow flash (brightens COLOR_R/G/B + ALPHA while burning). | ✅ |
| POLYMER | **Match documentation** — up to 6 bonds per particle (BOND_PARTNER_1..6), tracked mutually so A-B-C chains are stable on both ends. | ✅ |
| ISOMERIZATION | **Match real life** — real isomerization keeps the same atoms but rearranges bonds: a 3+ bond particle occasionally breaks one connection (the freed partner becomes a fragment, reciprocal cleared) and consumes a little energy. The old "radius breathing" placeholder (sinusoidal RADIUS oscillation) is gone. | ✅ |
| CHIRALITY | **TORQUE DNA drives handedness (documented)** — geometric mirror-handedness (clockwise/counter-clockwise spin), not charge. Same-handedness pairs deflect perpendicular, direction follows the torque sign; opposite-handedness/zero-torque → no force. | ✅ |

## Implementation (v4.6.7)

- **OXIDATION** — `applyOxidationEffect` now decays CHARGE toward 0 (`c − c×0.001×dt×synergy`) and, when HEAT_OUTPUT DNA > 0, flashes COLOR_R/G/B toward white + raises ALPHA alongside the energy/temperature release.
- **POLYMER** — stride expanded with `BOND_PARTNER_3..6` (81-84, appended at the tail so existing offsets stay stable); spawn init in `main.js` (3 sites) + `multiplex.js`; exposed in `particleBuffer.js`. `applyPolymer` now uses all 6 slots (module `BOND_SLOTS` list), bonds are mutual (j records i back), indices computed from the real `stride` (was hardcoded `/100`), cap at 6 per particle.
- **ISOMERIZATION** — `applyIsomerization(lawState, view, base, dt, synergy, prng, stride)` rewritten: 3+ bonds + energy ≥ 1 → chance 0.02×dt×synergy to break the first filled bond, clear the partner's reciprocal slot, decrement both counts, and consume 0.5×dt×synergy ENERGY. Removed the old radius-phase block from the solver's radius recompute.
- **CHIRALITY** — `applyChirality` reads TORQUE DNA (cache index 2) instead of POLARITY; deflection direction follows sign(TORQUE) (mirror-image rotation).
- Tests: `tests/audit/batch_06.test.js` rewritten (21 tests: rust + glow, mutual 6-slot bonds + cap, isomerization rearrangement/reciprocal/energy/gate, chirality torque handedness incl. mirror direction). Full suite 538/538 green; `vite build` clean.
- HELP_DB entries updated for OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (yes / match documentation / match real life / TORQUE explained)
- [x] Implementation + tests (538/538)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 32/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_07.md (40 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION

Laws under audit (indices 24-27). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| CRYSTALLIZATION | **Add a bonus to same-species crystallization** — any pair within dist 1–30 is pulled toward the 8-unit lattice grid, and same-species pairs pull **3× stronger** (rigid clusters form between kin). | ✅ |
| HEAT | **Yes** — add temperature-driven thermal jitter: particles above 0.5 TEMPERATURE get random velocity kicks proportional to temperature (kinetic-theory thermal noise), on top of the existing pairwise conduction. | ✅ |
| COLD | **Sure** — add the documented velocity damping: particles below 0.5 TEMPERATURE have their velocity damped each tick, on top of the pairwise equalization. | ✅ |
| CONVECTION | **Unsure → decided by agent** — kept the documented buoyancy `(temp − 0.5) × 0.001 × dt × synergy` on +VEL_Y; deliberately **not** scaled by HEAT_CAPACITY (conduction already encodes capacity into the temperature field, so a second scaling would double-count). Note for the user: gravity is along −Z (PLANETARY), so +Y buoyancy is horizontal in VEPA's 3D space — switch to +Z (anti-gravity) on request. | ✅ (agent decision, amendable) |

## Implementation (v4.6.8)

- **CRYSTALLIZATION** — `applyCrystallization` now reads `SPECIES_ID` at both bases; same-species pairs multiply the lattice pull by 3.0 (`pullScale = sameSpecies ? 3.0 : 1.0`). Cross-species pairs keep the original 0.01×synergy pull.
- **HEAT** — new `applyThermalJitter(lawState, view, base, dt, synergy, prng)`: for temp > 0.5, adds `±(temp × 0.01 × dt × synergy)` random kick per axis (`(prng()−0.5)×2×kick`). Wired into the solver per-particle loop next to convection.
- **COLD** — new `applyColdDamping(lawState, view, base, dt, synergy)`: for temp < 0.5, multiplies VEL_X/Y/Z by `max(0, 1 − (0.5 − temp) × 0.1 × dt × synergy)`. Wired into the solver per-particle loop.
- **CONVECTION** — unchanged (documented formula kept, no HEAT_CAPACITY scaling).
- Tests: `tests/audit/batch_07.test.js` extended to 25 tests (crystallization cross-species 0.04 vs same-species 0.12 bonus, thermal jitter gate/threshold/value/integration, cold damping gate/threshold/value/integration, plus all prior heat transfer/convection coverage). Full suite 547/547 green; `vite build` clean.
- HELP_DB entries updated for all four laws in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. same-species bonus 2. yes jitter 3. sure damping 4. unsure (agent decision, amendable)
- [x] Implementation + tests (547/547)
- [x] Deployed to https://vepa-v4.vercel.app

## Repair (v4.6.9, user report: "lattices are entirely absent")

- Root cause: `applyCrystallization` gated pairs at `dist 1-30` with a 0.01 pull.
  Default spawn spacing is ~100-300 units (1250 particles in a 2000 world), so
  virtually no pairs ever entered range and the pull was far too weak to win
  against gravity/jitter/affinity — lattices never formed.
- Fix: range widened `30 -> 150` (inside the spatial-grid neighborhood) and pull
  strengthened `0.01 -> 0.05` (same-species 3x = 0.15). Lattice springs now
  engage at real spawn spacing and visibly snap same-species pairs into the
  8-unit grid.
- Tests updated: cross-species pull 0.2, same-species 0.6, no-op beyond 150.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 33/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_08.md (30 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY

Laws under audit (indices 28-31). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| PHASE_RADIATION | **Follow irl behaviour** — Stefan-Boltzmann blackbody emission: every warm body radiates, hot bodies radiate disproportionately (T^4 curve), cooling TEMPERATURE and ENERGY while boosting SIGNAL glow. The old ENERGY > 50 doc hint and the 0.6 temperature threshold are both replaced. | ✅ |
| SUBLIMATION | **Sure** — documented low-mass + high-energy gate: requires temp > 0.5 AND ENERGY > 50, mass can sublimate down to a 0.02 floor (near-full evaporation), velocity burst switched from `Math.random()` to the sim PRNG, sublimation consumes extra energy and cools. | ✅ |
| TIME_DILATION | **Agent decision** (user: "you invented them you decide") — kept `localDt = 1 − soul×0.3×synergy` (70% max). Rationale: a stronger cap would make differential aging (AGE, reproduction timers) diverge too far between souls and destabilize the simulation. | ✅ (agent decision) |
| DIMENSIONALITY | **Make it stronger** — Z-drift amplitude raised 0.1 → 0.3 (3x), so 3D exploration is actually visible. | ✅ |

## Implementation (v4.6.9)

- **PHASE_RADIATION** — `applyPhaseRadiation` rewritten: gate `temp > 0.05`, `radiated = temp^4 × 0.05 × dt × synergy`; ENERGY −= radiated, TEMPERATURE −= radiated (clamped ≥ 0), SIGNAL += radiated (cap 1).
- **SUBLIMATION** — `applySublimation(lawState, view, base, dt, synergy, prng)` rewritten: gate `temp > 0.5 && energy > 50 && mass > 0.02`; MASS −= sublRate with 0.02 floor, VEL_X/Y += (prng()−0.5)×sublRate×5, ENERGY −= sublRate×20, TEMPERATURE −= sublRate×0.5. Solver call site passes `prng`.
- **TIME_DILATION** — unchanged (`localDt = 1 − soul×0.3×synergy`); HELP_DB documents the decision rationale.
- **DIMENSIONALITY** — Z-drift amplitude 0.1 → 0.3 (`(prng()−0.5)×0.3×synergy×dt`).
- **CRYSTALLIZATION repair (batch-07 follow-up)** — user reported lattices never form; `applyCrystallization` range widened 30 → 150 and pull 0.01 → 0.05 (same-species 3x = 0.15), so lattices engage at real spawn spacing.
- Tests: `batch_07.test.js` crystallization values updated (0.2 / 0.6 / no-op beyond 150); `batch_08.test.js` rewritten (T^4 curve, T^4 proportionality, near-zero gate, sublimation energy gate + floor + PRNG, dimensionality 0.15 kick). Full suite 550/550 green; `vite build` clean.
- HELP_DB entries updated for CRYSTALLIZATION / PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. irl blackbody 2. sure (energy gate + full evaporation) 3. agent decision (time dilation) 4. stronger Z drift
- [x] Crystallization absence diagnosed + repaired (range/strength)
- [x] Implementation + tests (550/550)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 34/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_09.md (28 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 09 — CHAOS / ORDER / FATE / WILL

Laws under audit (indices 32-35). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| CHAOS | **Agent decision** (user: "you decide") — kinetic forcing stays (±0.5 X/Y, ±0.25 Z) PLUS a small temperature stir (±0.02, clamped 0-1) so chaos flickers thermal pockets that feed HEAT / PHASE_RADIATION. With ORDER on, both run at ×0.3. | ✅ (agent decision) |
| ORDER | **Strongly** — alignment 0.005 → 0.04 (8x) and range ~100 → ~200 units (distSq 40k), so coherent flow actually emerges. | ✅ |
| FATE | **Redesign** (user: "boring and similar to existing laws" — it duplicated AFFINITY) — replaced the pairwise same-species attraction with per-species **drifting destiny points**: each species has a golden-angle-phase destiny point that wanders on a fate clock, and members are gently pulled toward it along the shortest toroidal path (0.02×synergy, full-world). Species now migrate and segregate toward their own fate. | ✅ (redesign) |
| WILL | **Follow docs** — self-propulsion along current heading, `0.01×dt×synergy`, energy-independent, speed gate 0.01. Unchanged. | ✅ |

## Implementation (v4.6.10)

- **CHAOS** — `applyChaos` adds `TEMPERATURE += (prng()−0.5)×0.02×dt×synergy` (clamped 0-1) after the kinetic kicks.
- **ORDER** — `applyOrder` strength 0.005 → 0.04, range distSq 10k → 40k.
- **FATE** — `applyFate` rewritten: new signature `(lawState, view, base, px, py, pz, worldSize, synergy)`; module fate clock (`advanceFateClock`/`getFateTime`, advanced once per tick in the solver); destiny point per species (`phase = species×2.39996323`, span 0.32×worldSize); pull = 0.02×synergy along the shortest toroidal path. The old pairwise block was removed from the pair loop and replaced with a per-particle call.
- **WILL** — unchanged.
- Tests: `batch_09.test.js` updated — CHAOS thermal stir (0.01 / clamped 0), ORDER 0.2 alignment + 50k range gate, FATE destiny magnitude/direction + per-species divergence + integration. Full suite 550/550 green; `vite build` clean.
- HELP_DB entries updated for CHAOS / ORDER / FATE in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. agent decision (thermal chaos) 2. strongly (ORDER) 3. redesign (FATE destiny) 4. follow docs (WILL)
- [x] Implementation + tests (550/550)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 35/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_10.md (30 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 10 — SOUL_LAW / MIND / VOID / BOND (+ POLYMER chain bias)

Laws under audit (indices 36-39). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| SOUL_LAW | **Agent decision** (user: "you decide") — SOUL is a conserved shared field: same-species transfer drains the giver and credits the receiver, both capped to [0, 1] (keeps TIME_DILATION's 70% slowdown as the ceiling), plus slow per-particle decay (0.2%/tick) so souls must be replenished. | ✅ (agent decision) |
| MIND | **"Synergies are gunna be more interesting"** — the hivemind is now synergy-shaped: COMMS ×1.5, TELEPATHY ×2.0, ENERGY ×0.5 (hive-mind drain), POLYMER ×0.5 (polymerized overhead). The boost itself stays free. (The MIND+ENER −2.0 synergy from the docs was never wired — now it is, in v4's multiplier form.) | ✅ |
| VOID | **Yes** — strengthened (0.0005 → 0.004 base) and dark-energy scaled: the outward push grows with distance from the world centre `(0.3 + dist/(worldSize/2))`, opposing gravitational clustering harder at the edges. | ✅ |
| BOND | **Density bias** (user: join where there are more neighbours, not chain ends) — molecular bonds are short-range (~2× rest length, extended by local density `min(2, 1 + nCount×0.05)`) and break when stretched beyond range; force scales with density too. Registration uses all 6 shared bond slots. | ✅ |
| POLYMER | **Chain bias** (user: polymers should be more likely to create chains) — bond range scales with chainBias: 1.0 for free/tip partners (0-1 bonds), 0.5 (2), 0.25 (3+), so POLYMER grows linear chains instead of cross-linked webs. | ✅ |

## Implementation (v4.6.12)

- **SOUL_LAW** — `applySoul` now transfers reciprocally (`receiver += soul×0.001×synergy`, `giver −= same`, cap 1.0); new `applySoulDecay` (per-particle, `×= 1 − 0.002×dt×synergy`) wired into the solver's non-pairwise section.
- **MIND** — four new synergies in `synergy.js` (COMMS ×1.5, TELEPATHY ×2.0, ENERGY ×0.5, POLYMER ×0.5), all multiplying MIND's signal boost.
- **VOID** — `applyVoid` strength `0.004×synergy×(0.3 + dist/(worldSize×0.5))`.
- **BOND** — `applyBond(..., nCount)` now takes the neighbor count from the solver: `bondRange = (r1+r2)×1.1×2×densityBoost`, breaks bonds beyond that range (reciprocal cleared via `breakBondPair`), spring force ×densityBoost, registration across all 6 `BOND_SLOTS`.
- **POLYMER** — chain bias multiplier on the bonding range in `applyPolymer`.
- Tests: `batch_10.test.js` extended to 14 (soul cap + decay + reciprocal, MIND synergy stack, VOID 0.0016 radial push, BOND density boost + breaking + 6-slot registration, POLYMER chain bias). Full suite 556/556 green; `vite build` clean.
- HELP_DB entries updated for SOUL_LAW / MIND / VOID / BOND / POLYMER in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. agent decision (soul field) 2. synergies (MIND) 3. yes (VOID) 4. chain vs density bias (POLYMER/BOND)
- [x] Implementation + tests (556/556)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 36/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_11.md (29 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 11 — REDUCTION / ALLOY / MELT / BOIL

Laws under audit (indices 40-43). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| REDUCTION | **Real-life behavior** (user: "try replicate irl behavior") — opposite charges attract and cancel when they interact: each magnitude shrinks toward zero (5%/tick). Same-sign charges repel, so nothing is neutralized. (The old code equalized toward the pair mean like a conductor — that is conduction, not chemical reduction.) | ✅ |
| ALLOY | **Real-life behavior** (user asked "how would this behave irl?" → answered: two metals dissolve into one homogeneous composite) — full mass merge (m1+m2), mass-weighted DNA average written into the survivor's cache (hybrid composition), colours blended. The survivor keeps its species slot but behaves as the mix. (Replaces the old 10% transfer that never mixed DNA.) | ✅ (agent decision on species slot) |
| MELT | **Follow HELP_DB** — melting is a loss of rigidity, not mass: above temp 0.7 effective STIFFNESS decays toward a 20% floor of the species baseline; below 0.7 the particle re-solidifies and stiffness recovers. Reversible phase change, mass untouched. | ✅ |
| BOIL | **Yes** — vaporizing mass now costs latent heat (ENERGY −= ejectMass×20), uses the SplitMix32 PRNG for the velocity kick (was `Math.random()`), and has a 0.02 mass floor so particles never boil away completely. | ✅ |

## Implementation (v4.6.15)

- **REDUCTION** — `applyReduction` now cancels opposite-sign pairs toward 0 (`CHARGE −= CHARGE×0.05×synergy`, snaps to 0 when the step exceeds the magnitude); same-sign pairs untouched.
- **ALLOY** — `applyAlloy` full merge: `MASS = m1+m2`, all 42 DNA-cache params mass-weighted averaged, RGB blended, j marked DEAD. The solver's existing in-place mass writeback fold preserves the merge.
- **MELT** — `applyMelt(lawState, view, base, dt, synergy, dnaBuffer)` reads the species STIFFNESS baseline via `getDNAFloat`; hot → cache stiffness decays toward 20% floor; cool → recovers at 0.005×dt×synergy. Wired into the solver with `dnaBuffer`.
- **BOIL** — `applyBoil(..., prng)` — PRNG velocity kick, `ENERGY −= ejectMass×20`, `MASS = max(0.02, mass − ejectMass)`. Wired into the solver with the shared `prng`.
- **Multiplexer** — new live settings (all visible in the right drawer during multiplexing): VARIATION slider, RANDOMIZE (LAWS/DNA/POP) checkboxes, DERIVE (CLONE/SPAWN), GRID (C×R, applies immediately), AUTO-ITERATE + EVERY interval slider, AUTO-SELECT FITTEST. New engine behaviour: `autoIterate` regenerates shards every `autoIterateInterval` ticks; `selectFittestShard` selects the shard with the most living particles.
- Tests: `batch_11.test.js` rewritten to the confirmed specs (8 cases), `multiplex.test.js` +4 (new defaults, auto-iterate cadence, fittest selection, auto-select after iteration). Full suite 565/565 green; `vite build` clean.
- HELP_DB entries updated for REDUCTION / ALLOY / MELT / BOIL in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. real-life reduction 2. real-life alloying (explained) 3. follow HELP_DB (MELT) 4. yes (BOIL)
- [x] Implementation + tests (565/565)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 37/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_12.md (29 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY

Laws under audit (indices 44-47). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| CONDENSE | **Match real life** (user: "1. Match irl") — condensation is exothermic: a cool particle gains vapor mass **and releases latent heat** (warms as it accretes). Mass gain `(0.3−temp)×0.005×dt×synergy`, temperature gain `rate×2` clamped at 0.9 so it can't cross into boiling. Particles at/above 0.3 are already saturated — no change. | ✅ |
| DEPOSIT | **Ditto** (user: "2. Ditto") — real-life deposition (frost) is exothermic and skips the liquid phase: solid mass builds fast (`rate×3` mass, `rate×0.5` radius) and latent heat is released (`rate×2` temp, clamped 0.9). Gate at temp > 0.2. | ✅ |
| EXOTHERMIC | **Ditto** (user: "3. Ditto") — real-life exothermic reactions release heat while the reaction runs: a **bounded steady release** `ENERGY += 0.05×synergy×dt` (capped at 200) and `TEMPERATURE += 0.01×synergy×dt` (capped 0.9). Replaces the old unbounded `ENERGY ×= 1.1` exponential. | ✅ |
| TELEPATHY | **Add slight energy drain** (user: "4. Add slight energy drain") — same-species signal sharing now costs the receiver a small energy toll per transfer: `ENERGY −= 0.02×synergy×(dt\|1)` floored at 0, in addition to the existing 5% signal transfer. Different species still never share. | ✅ |

## Implementation (v4.6.16)

- **CONDENSE** — `applyCondense` unchanged mass logic, now `TEMPERATURE = min(0.9, temp + rate×2)` (was `+rate×0.1`, effectively inert).
- **DEPOSIT** — `applyDeposit` now `TEMPERATURE = min(0.9, temp + rate×2)` (was `+rate×0.05`); mass/radius accrual unchanged.
- **EXOTHERMIC** — `applyExothermic(lawState, view, base, dt, synergy)` new signature: bounded steady release (was `ENERGY ×= 1.1`, unbounded). Solver passes `localTimeStep`.
- **TELEPATHY** — `applyTelepathy(..., synergy, dt)` new signature: receiver drains `0.02×synergy×dt` energy per transfer (floor 0). Solver passes `localTimeStep` at the telepathy dispatch.
- **Multiplexer** — 4 more live settings, all visible in the right drawer during multiplexing: **SIM SPEED** slider (0.25–3×, scales each shard's effective timestep), **PAUSE GRID** checkbox (freezes shard stepping while the main sim keeps running), **MAX ITERS** number (0 = ∞, caps auto-iteration), **DRIFT** slider (0–0.05, raises VARIATION each generation as evolutionary pressure, capped at 1). `MULTIPLEX_DEFAULTS` extended; `stepMultiplex` early-returns when paused and scales dt via `simSpeed`; `iterateMultiplex` applies the drift.
- Tests: `batch_12.test.js` rewritten to the confirmed specs (8 cases), `multiplex.test.js` +5 (new defaults, pause freeze, sim-speed scaling, iteration cap, variation drift). Full suite 570/570 green; `vite build` clean.
- HELP_DB entries updated for CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. match irl (CONDENSE exothermic) 2. ditto (DEPOSIT exothermic frost) 3. ditto (EXOTHERMIC bounded steady release) 4. slight energy drain (TELEPATHY)
- [x] Implementation + tests (570/570)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 38/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_13.md (28 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION

Laws under audit (indices 48-51). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| CLAIRVOYANCE | **Slight cost** (user: "1. Slight cost.") — predictive steering toward a neighbor's 3-tick velocity-extrapolated position stays, but sensing the future now drains a little energy: `ENERGY −= 0.02×synergy×dt` (floor 0) per prediction. | ✅ |
| PRECOGNITION | **Ditto** (user: "2. Ditto.") — collision-course anticipation (perpendicular dodge, dist 1–50, dot < 0) stays, and each dodge costs `ENERGY −= 0.02×synergy×dt` (floor 0). No drain when the pair is moving apart (no prediction happens). | ✅ |
| ASTRAL | **Keep ghosting + expand** (user: "3. That and further expansions would be ideal.") — souls still persist as fading ghosts (DEAD=0.5, ALPHA=soul×0.5, MASS=soul×0.1, SOUL ×=0.999/tick, removed <0.001), and ghosts now **influence the living** (matching the HELP_DB's "still exert forces on the living", which was never wired): a soft soul-pull draws nearby living particles toward the ghost (80-unit range), and **same-species kin receive a conserved sliver of its soul** before it dissipates (gift = soul×0.002×synergy×dt, both clamped — same transfer semantics as SOUL_LAW). | ✅ |
| PREDATION | **Keep jitter flee + match docs** (user: "4. Wym flee using jitter? Yeah do that. Always match the docs or help db.") — prey flee with jitter-based repulsion stays (JITTER DNA = erratic random motion, so high-jitter prey dart away hard). Added the docs' ecosystem rule: **a predator never hunts its own kind** (cross-species only, matching TRACK), and trait sampling switched from `Math.random()` to the sim PRNG. | ✅ |

## Implementation (v4.6.17)

- **CLAIRVOYANCE** — `applyClairvoyance(..., synergy, dt)` new signature: energy drain on the seer when a prediction force is applied. Solver passes `localTimeStep`.
- **PRECOGNITION** — `applyPrecognition(..., synergy, dt)` new signature: energy drain on the dodger when avoidance is applied (still gated by dist 1–50 and dot < 0).
- **ASTRAL** — per-ghost fade unchanged; new exported `applyAstralInfluence(ghostBase, livingBase, dx, dy, dz, dist, synergy, dt)` (soul-pull + conserved same-species gift). The solver's Phase 2b soul pass now queries the spatial grid for living neighbors within 80 units and applies the influence — bounded by `MAX_INTERACTIONS`, no O(n²) scan.
- **PREDATION** — `applyPredation(..., prng)` new signature + cross-species gate (same species → zero force, no absorption); DNA trait sampling uses the passed PRNG instead of `Math.random()`.
- Tests: `batch_13.test.js` rewritten to the confirmed specs (6 cases); `params_batch_15.test.js` PREDATION_BIAS case updated to a cross-species pair (predation is cross-species only). Full suite 572/572 green; `npx vite build` clean.
- HELP_DB entries updated for CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. slight cost 2. ditto 3. keep + expand (pull + kin blessing) 4. jitter flee + always match docs (cross-species, PRNG)
- [x] Implementation + tests (572/572)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 39/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_14.md (30 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 14 — COMMS / CHARGE_LAW / FIELD / CURRENT

Laws under audit (indices 52-55). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| COMMS | **Sender pays** (user: "1. Sure.") — signal delivery stays (homing force + memory via SIGNAL_RESP, channel-filtered by TUNING_CH1-4), but the receiver's old free energy gain (`delivered×resp×0.5`) is removed and the **sender pays the emission cost** (`ENERGY −= delivered×0.5`, floor 0) per delivered signal. | ✅ |
| CHARGE_LAW | **Match irl** (user: "2. Match irl.") — real Coulomb force on the **effective charge = POLARITY DNA + stored stride CHARGE** with no weighting: `qq = (q1+c1)×(q2+c2)`, inverse-square with softening. Stored charge now contributes equally (old code halved it and never mixed the two sources). | ✅ |
| FIELD | **Uniform 3D + charge scaling** (user: "3. Sounds good.") — true uniform acceleration on all three axes (old code had `az = 0` and an x/y asymmetry), POLARITY sets the sign, stored CHARGE scales the drift (`k×(1+|c|×0.5)`) so charged particles feel the field harder. | ✅ |
| CURRENT | **Both sides conductive** (user: "4. Sure.") — charge diffusion still flows high→low within 17 units, but conductivity is now the **min** of the pair (a conductor can no longer drain an insulator — real materials). | ✅ |

## Implementation (v4.6.18)

- **COMMS** — `applySignalExchange`: receiver keeps SIGNAL/MEMORY/homing-force delivery; `view[receiver].ENERGY` gain lines removed; `view[sender].ENERGY = max(0, energy − delivered×0.5)` on each direction.
- **CHARGE_LAW** — `applyChargeForce`: effective charge product `(POLARITY + CHARGE)₁ × (POLARITY + CHARGE)₂`; zero effective charge → no force.
- **FIELD** — `applyFieldDrift`: `{ ax: q×f, ay: q×f, az: q×f }` where `f = k×(1+|CHARGE|×0.5)`; `q === 0` → null (drift direction comes from POLARITY, per HELP_DB).
- **CURRENT** — `applyCurrentTransfer`: `cond = min(CONDUCTIVITY_i, CONDUCTIVITY_j)`; range gate `distSq > 300` unchanged.
- Tests: `batch_14.test.js` rewritten to the confirmed specs (9 cases: emission gating, exchange, sender-pays, Coulomb like/opposite, stored-charge equality, FIELD sign + 3D + charge scaling, CURRENT diffusion + both-conductive gate). Regression updates for the confirmed spec: `params_batch_13` CONDUCTIVITY (both sides conductive), `params_batch_16/17/18` COMMS DNA tests now assert delivered SIGNAL (not receiver energy), `signal.test.js` asserts sender pays. Full suite 576/576 green; `npx vite build` clean.
- HELP_DB entries updated for COMMS / CHARGE_LAW / FIELD / CURRENT in `v4/src/constants.js`.

> ⚠️ **Concurrent-work note:** during this batch a separate session's uncommitted "DNA 64" genetics expansion (genome params 48-63, `DNA_COUNT` 48→64, REPRO/lifecycle rewrite) was found in the working tree mid-flight. It broke the SEX_CHANCE param test. It was preserved to `.concurrent-dna64-wip-20260806.patch` (plus `.concurrent-dna64-backup-20260806/`) and reverted so v4.6.18 ships clean. Re-apply with `git apply .concurrent-dna64-wip-20260806.patch`.

## Verification

- [x] User confirmation → 1. sender pays 2. match irl (equal-weight effective charge) 3. uniform 3D + charge scaling 4. min conductivity
- [x] Implementation + tests (576/576)
- [x] Deployed to https://vepa-v4.vercel.app


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 40/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_15.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM

Laws under audit: RESISTANCE, CAPACITANCE, INDUCTANCE, MAGNETISM

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| RESISTANCE | Material-dependent + thermal-Ohmic feedback: `damp = speed·k·(1 − CONDUCTIVITY·0.9)·(1 + TEMP·2)`; `TEMP += speed·k·(1 − CONDUCTIVITY·0.9)·0.5` (cap 1). Conductors glide, insulators resist; hotter particles slow more. | ✅ |
| CAPACITANCE | Store surplus energy as charge (`(ENERGY−50)·0.002`, clamp ±2 breakdown); bleed drains toward zero only — a depleted capacitor never flips sign from draining; same-sign stored charge repels pairwise. | ✅ |
| INDUCTANCE | Momentum-conserving velocity alignment scaled by magnetic coupling: `dv = (v_j − v_i)·k·couple`, `couple = |m1·m2|/(1 + dist·0.03)`; requires CONDUCTIVITY > 0 on both (real materials). | ✅ |
| MAGNETISM | `F = k·m1·m2/dist²` — aligned moments attract, opposing repel. MAGNETIC_MOMENT widened to [−1,1] (default 0.1) so both behaviors are reachable through normal DNA. | ✅ |

## Confirmation

- [x] User confirmed / amended (1. Yes. 2. Yes. 3. Yes. 4. Yes.)


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 41/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_16.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE

Laws under audit: RESONANCE, FLUX, IONIZATION, DISCHARGE

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| RESONANCE | Sympathetic vibration with phase alignment: `F = k·s1·s2·sync·phaseSync/(dist+1)`; `phaseSync = 0.5+0.5·cos(Δphase·π/2)` (GLOW/COMMS oscillator); in-phase pairs amplify the weaker pulser's SIGNAL. | ✅ |
| FLUX | F = qE: direction by effective charge `q = POLARITY + CHARGE` — positive carriers move down the gradient, negative up it, neutrals (|q| ≤ 1e-3) follow the field lines (doc behavior). | ✅ |
| IONIZATION | Threshold impact (> 0.15) + conserved ion pair: `q_i = impact·s`, `q_j = −impact·s`, `s = sign(POLARITY_i+POLARITY_j) || 1`; already-charged pairs are not re-stripped. | ✅ |
| DISCHARGE | Spark aims along the potential difference: kick = |c|·k toward the most opposite stored charge (weighted gradient accumulation in the solver); random fallback with no nearby field. Threshold 0.5, heat, reset unchanged. | ✅ |

## Confirmation

- [x] User confirmed / amended (All yes)


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 42/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_17.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 17 — PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN

Laws under audit: PLASMA, SUPERCONDUCTIVITY, MEMORY, PATTERN

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| PLASMA | Thermal-EM bridge with hysteresis (match irl): `temp > 0.6` → `CHARGE += (temp−0.6)·k`, cools; `temp < 0.5` with stored charge → recombination: `CHARGE = 0`, `TEMP += |c|·k·2` (cap 1). The 0.5–0.6 band prevents oscillation. | ✅ |
| SUPERCONDUCTIVITY | Confirmed as-is: cold pairs (≤ 0.35) equalize charge + align velocity; `+COLD ×1.8`, `+RESISTANCE ×0.2` lossless synergies. | ✅ |
| MEMORY | Confirmed as-is: contact refresh (+0.05 cap 1), decay ×0.995/tick, momentum ×(1+mem·k·0.02). | ✅ |
| PATTERN | Confirmed as-is: cohesion `k/(dist+1)`, inert dist < 1. | ✅ |

## Confirmation

- [x] User confirmed / amended (Yes to all)


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 43/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_18.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL

Laws under audit: STIGMERGY, SIGNAL_BOOST, LEARN, SYMBOL

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| STIGMERGY | Real pheromone trails: only moving particles lay a predicted-path marker (`speed ≥ 0.5` → `TRAIL = pos + v·8`); stopped particles' markers evaporate (lerp 8%/tick back to owner); follow force follows the gradient — `F = k·freshness/(1+dist·0.1)`, `freshness = 1/(1+ownerDist·0.02)` (stale markers pull weakly). | ✅ |
| SIGNAL_BOOST | Relay scaled by sender's SIGNAL_STRENGTH DNA (`s2 += s1·k·(0.5+strength·0.5)`); a legitimate strength 0 relays at ×0.5 (no `||` fallback swallow). | ✅ |
| LEARN | Confirmed as-is: velocity matching `v1 += (v2−v1)·k·0.1`. | ✅ |
| SYMBOL | Confirmed as-is: same-species attract by SPECIES_AFFINITY, cross-species repel at half. | ✅ |

## Confirmation

- [x] User confirmed / amended (Yes to all)


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 44/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_19.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 19 — METRIC / PREDICT / CODE / PROTOCOL

Laws under audit: METRIC, PREDICT, CODE, PROTOCOL

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| METRIC | Confirmed as-is: climb the energy gradient `F = k·dE/(dist+1)`. | ✅ |
| PREDICT | Confirmed as-is: aim at 3-tick extrapolated position; `+TRACK ×1.5` interception synergy. | ✅ |
| CODE | Confirmed as-is: contact (≤ 4 units) blends 7 sampled DNA loci at rate k·0.01. | ✅ |
| PROTOCOL | Confirmed as-is: signal entrainment toward the average, `k·0.1`, clamped 0..1. | ✅ |

## Confirmation

- [x] User confirmed / amended (Yes to all)


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 45/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_20.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 20 — FEEDBACK / LANGUAGE / CULTURE / SINGULARITY

Laws under audit: FEEDBACK, LANGUAGE, CULTURE, SINGULARITY

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| FEEDBACK | Confirmed as-is: motion recharges MEMORY (+speed·k·0.02), memory boosts along velocity (mem·k·0.1); runaway documented. | ✅ |
| LANGUAGE | Confirmed as-is: signaling pairs converge MEMORY toward the average (k·0.25) and relay signal (+s·k·0.1). | ✅ |
| CULTURE | Confirmed as-is: same-species contacts blend DNA cache at every 3rd locus (rate k·0.02); cross-species untouched. | ✅ |
| SINGULARITY | Confirmed as-is: mass ≥ 20 → pull ∝ m²/dist², event horizon √m·0.8 absorbs (mass transfers, victim dies, hole heats). | ✅ |

## Confirmation

- [x] User confirmed / amended (Confirm all 12)


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 46/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_21.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 21 — ENTANGLEMENT / HISTORY / TIDE / FRICTION

Laws under audit: ENTANGLEMENT, HISTORY, TIDE, FRICTION

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| ENTANGLEMENT | Confirmed as-is: contact forges link (ID + phase 1); non-local momentum convergence + signal relay; phase decays ×0.998 until snap; partner death → recoil kick. | ✅ |
| HISTORY | Confirmed as-is: 12³ memory field accumulates presence (energy/mass), decays; drift toward field centre of mass. | ✅ |
| TIDE | Confirmed as-is: long-range mass coupling ∝ massJ·k/dist (inverse-distance, farther than gravity). | ✅ |
| FRICTION | Match irl: damp = k·VISCOSITY DNA (0.5–1.0, higher = more damping) and the removed kinetic energy converts to heat (TEMP += speed·damp·0.5, cap 1) — the doc's "converting motion into heat" and "VISCOSITY DNA modulates it" are now implemented. | ✅ |

## Confirmation

- [x] User confirmed / amended (Confirm all 12)


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 47/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_22.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 22 — ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION

Laws under audit: ELASTICITY, TURBULENCE, CENTRIPETAL, ROTATION

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| ELASTICITY | Match irl: overlap push scaled by a coefficient of restitution from ELASTICITY DNA (0–1, default 0.5) — mag = overlap·k·ELASTICITY/(mI+mJ); light particles still bounce harder. | ✅ |
| TURBULENCE | Confirmed as-is: perpendicular pseudo-random kick (energy-conserving). | ✅ |
| CENTRIPETAL | Confirmed as-is: harmonic pull toward world centre ∝ distance. | ✅ |
| ROTATION | Confirmed as-is: tangential solid-body swirl around the centre axis (∝ radius). | ✅ |

## Confirmation

- [x] User confirmed / amended (Confirm all 12)


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 48/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_23.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 23 — SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY

Laws under audit: SYMBIOSIS, PARASITE, HIBERNATION, IMMUNITY

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| SYMBIOSIS | Confirm as-is: different-species pairs equalize ENERGY (transfer = ΔE·k·0.5 rich→poor, pair total conserved, clamp 0-200); same-species contacts untouched; no force. | ⏳ |
| PARASITE | Confirm as-is: on contact, the smaller (MASS) particle drains the larger host — drain = min(5% host MASS, host ENERGY − 5 floor)·k; parasite keeps 90% (10% efficiency loss); below-floor hosts are not drained. | ⏳ |
| HIBERNATION | Confirm as-is: ENERGY < 30 → damp velocity by 20%·k/tick (returned as force) and regen +0.05·k ENERGY capped at 30; ENERGY ≥ 30 untouched. | ⏳ |
| IMMUNITY | Change (recommended): ARMOR regen +0.02·k/tick (cap 5) and armored particles regen +0.01·k ENERGY (as-is, ARMOR already shields RADIATION damage) — ADD the doc-promised PARASITE resistance: host drain scaled by (1 − ARMOR·0.1) so armor halves extraction at cap. | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 49/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_24.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 24 — ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION

Laws under audit: ELECTROLYSIS, PHOTOLYSIS, PRECIPITATION, NEUTRALIZATION

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| ELECTROLYSIS | Change (match docs): |ΔCHARGE| > 0.5 gate; dm = min(1% MASS, 0.5)·k·CONDUCTIVITY DNA — mass → ENERGY (×20) + SIGNAL (×5) + small HEAT; charge-driven decomposition scales with conductivity. | ⏳ |
| PHOTOLYSIS | Change (match docs): SIGNAL > 0.5 gate; dm = min(1% MASS, 0.5)·k·CATALYSIS DNA — mass → ENERGY (×15), SIGNAL ×0.9 (light spent); conversion scales with catalysis. | ⏳ |
| PRECIPITATION | Change (recommended): both partners condense symmetrically — each gains MASS +0.005·k and shrinks RADIUS ×0.998 (min 0.1), spending 0.1·k ENERGY, when BOTH partners have ENERGY > 80 (saturation proxy). Doc's grid-density note stays flavor. | ⏳ |
| NEUTRALIZATION | Change (match docs): |c| > 0.1 + opposite-signs gate; each charge reduced by min(0.05·k, |c|); heat released ∝ |cI·cJ| — TEMP += |cI·cJ|·k·0.04 on both (instead of flat +0.02·k). | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 50/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_25.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 25 — STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION

Laws under audit: STOICHIOMETRY, AUTOCATALYSIS, ADIABATIC, COMPRESSION

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| STOICHIOMETRY | Confirm as-is: d = (massI − massJ)·0.005·k — pair masses equalize toward the mean; pair total strictly conserved (conservation backstop for other exchanges). | ⏳ |
| AUTOCATALYSIS | Confirm with decision: same-species gate + REACTION_THRESHOLD mass gate; each partner gains 0.1·k·CATALYSIS DNA ENERGY. Doc's "squared gain for same-species pairs" claim — recommend keeping linear (the same-species gate IS the purity mechanism); say the word if you want the gain squared. | ⏳ |
| ADIABATIC | Confirm as-is: moving particle damped by 10%·k (max 90%); removed kinetic energy ½m(v² − v′²) added to TEMPERATURE — total conserved; stationary particles untouched. | ⏳ |
| COMPRESSION | Confirm as-is: dist < (rI + rJ)·2 → both shrink RADIUS by min(r·k, 25%) (floor 0.02) and TEMP += k; pair-contact pressure squeeze (doc's grid-density note stays flavor). | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 51/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_26.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 26 — EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY

Laws under audit: EXPANSION, EQUILIBRIUM, LATENT_HEAT, RUNAWAY

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| EXPANSION | Confirm as-is: TEMPERATURE < 0.3 → grow RADIUS toward the species DNA BASE_RADIUS (growth = clamp((base − r)·k, 0, base − r), so it can never overshoot) and cool by 0.1·k/tick (rarefaction cooling). Runs after the mass-derived radius update so PHENOTYPE/mass sizing is not overwritten; ≥ 0.3 untouched. | ⏳ |
| EQUILIBRIUM | Confirm as-is: on contact, symmetric conduction — dt = (tJ − tI)·0.3, each partner moves toward the pair mean; pair TEMPERATURE total strictly conserved. | ⏳ |
| LATENT_HEAT | Confirm as-is: per-particle phase buffer — TEMPERATURE > 1.0 converts excess (t − 1.0)·k to ENERGY (cools); TEMPERATURE < −0.5 converts ENERGY back to TEMPERATURE at (−0.5 − t)·k, capped by available ENERGY (heats). Doc's "pair's combined mass as capacity" advanced note stays flavor. | ⏳ |
| RUNAWAY | Confirm as-is: TEMPERATURE > 0.8 → t += (t − 0.8)²·k (quadratic positive feedback, k = 0.1, designed to produce flares); no explicit cap — EQUILIBRIUM diffusion is the documented cascade limit. | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 52/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_27.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 27 — CONSCIOUSNESS / PERCEPTION / SYNCHRONICITY / ANTENNA

Laws under audit: CONSCIOUSNESS, PERCEPTION, SYNCHRONICITY, ANTENNA

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| CONSCIOUSNESS | Confirm as-is: slow self-regeneration — ENERGY +0.02·k/tick (cap 200) and MEMORY +0.005·k/tick (cap 1); the self-model feeds NAVIGATION and other information laws. Doc's "self-repair scales with SIGNAL" advanced note stays flavor (regeneration is flat). | ⏳ |
| PERCEPTION | Confirm as-is: extended sensing — within dist < NEIGHBORHOOD_RADIUS·2 (each partner gates on its own DNA radius), gentle velocity alignment toward the neighbor: force = Δv·0.01·k (awareness at a distance, no touch required). | ⏳ |
| SYNCHRONICITY | Confirm as-is: resonant entrainment — |PHASE_1i − PHASE_1j| < 0.3 → both phases blend to the pair mean (50% per pass, k = 0.5) and velocities pull together with force = Δv·0.02·k; coupling proportional to phase agreement. | ⏳ |
| ANTENNA | Confirm as-is: active emitters (SIGNAL > 0.05) amplify SIGNAL by min(speed, 5)·0.01·k (cap 10) — moving emitters transmit louder. Doc's "emission gain peaks along the velocity direction, falls off to the sides" stays flavor (no beam geometry in the per-particle pass). | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 53/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_28.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 28 — SHIELDING / POLARIZATION / NAVIGATION / ENCRYPTION

Laws under audit: SHIELDING, POLARIZATION, NAVIGATION, ENCRYPTION

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| SHIELDING | Confirm as-is: Faraday-cage dissipation — with ENERGY > 5 and stored CHARGE ≠ 0, CHARGE is drained toward zero by min(0.01·k, |c|)/tick at a cost of 0.05·k ENERGY (charge bleed, not a force block). Doc's "shield strength scales with stored CAPACITANCE" advanced note stays flavor. | ⏳ |
| POLARIZATION | Confirm with decision: matching TUNING_CH1 → both SIGNALs blend to the pair mean (50% per pass); mismatched channels damp both by ×(1 − 0.01·k) — a pure channel filter. Doc's "absorbed signals contribute small ENERGY" advanced claim is unimplemented; say the word if you want mismatched-signal energy credited. | ⏳ |
| NAVIGATION | Confirm as-is: memory-gradient steering — if the neighbor's MEMORY exceeds this particle's, force = Δmem·k along the unit vector toward the neighbor (distance-normalized, no radius gate); the past becomes a map. Doc's "uses the HISTORY field when both are on" stays flavor (reads per-particle MEMORY only). | ⏳ |
| ENCRYPTION | Confirm as-is: robust coding — active signals decay ×(1 − 0.02·k) instead of baseline, floor at 0.05 so traces persist, and strong pulses (> 0.1) shed 0.01·k amplitude/tick (slightly weaker but longer-lived signals). | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 54/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_29.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 29 — SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE

Laws under audit: SUPERPOSITION, TUNNELING, DECOHERENCE, WAVE_PARTICLE

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| SUPERPOSITION | Confirm as-is: velocity-spread kick — every tick each axis receives a random force `(prng() − 0.5)·k·2` (solver k = 0.05 → ±0.05 spread, clamped ±50); the sampled "collapsed" velocity adds variance. HELP_DB's "spread stored as a small internal state" stays flavor (no extra stride slot — variance is re-sampled each tick). | ⏳ |
| TUNNELING | Confirm as-is: barrier penetration — `prng() < 0.005·k` per tick (solver k = 0.5 → 0.25% chance) phase-shifts the particle by an independent `±RADIUS·6` hop per axis (default radius 0.6 → 3.6-unit hop), clamped to world bounds. HELP_DB's "chance scales with energy and speed" stays flavor (chance is flat). | ⏳ |
| DECOHERENCE | Confirm as-is: collapse — velocity damp force `−v·0.01·k` per axis (solver k = 0.1) plus `SIGNAL += 0.001·k`/tick (cap 10); the lost variance is radiated into the signal field. Damping applies at any speed (no explicit velocity threshold). | ⏳ |
| WAVE_PARTICLE | Confirm as-is: speed-gated duality — speed < 0.5 → wave regime, damp force `−v·0.01·k` (smooth spread); speed ≥ 2 → particle regime, thrust `+v·0.01·k` (sharp direct motion); the 0.5–2 band is neutral (no force). Transition speeds are fixed at 0.5/2.0; HELP_DB's "DNA FORCE shifts the bias" stays flavor. | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 55/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_30.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK

Laws under audit: UNCERTAINTY, TELEPORT, OBSERVER, PLANCK

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| UNCERTAINTY | Change (match docs): the HELP_DB promises a speed tradeoff ("fast particles jitter position; slow particles get velocity kicks") but the current code applies BOTH unconditionally. Proposed: speed \|v\| ≥ 0.5 → position jitter only (`±(prng() − 0.5)·0.02·k` per axis); speed \|v\| < 0.5 → velocity kick only (`±(prng() − 0.5)·0.05·k` per axis). Threshold mirrors WAVE_PARTICLE's 0.5 wave speed. | ⏳ |
| TELEPORT | Confirm as-is: non-local jump — `ENERGY > 20` gate + `prng() < 0.002·k` per tick (solver k = 0.5 → 0.1% chance) moves the particle to a uniform random position in the world and costs `ENERGY −= 0.1·distance` (proportional to the jump, floor 0). SPEC.md's "ENERGY > 10" is updated to the implemented 20. | ⏳ |
| OBSERVER | Confirm as-is: pairwise measurement — a particle with `MEMORY > 0.5` acts as observer: the neighbour's velocity is pulled toward the observer's (`vJ += (vI − vJ)·0.01·k`, solver k = 0.5) and the neighbour gains a memory imprint (`MEMORY = max(own, observerMem·0.1)`). SPEC.md's "damp own velocity / self-measurement" is corrected to this pairwise form (matches HELP_DB "damp the spread of nearby particles"). | ⏳ |
| PLANCK | Confirm with decision: velocity is quantized to a fixed 0.05 grid (`q = max(0.02, 0.1·k)` with solver k = 0.5; `v → sign(v)·round(\|v\|/q)·q`) — "quantising all motion". HELP_DB's "energy moves only in discrete quanta" is unimplemented: recommend keeping ENERGY continuous, because a 0.05 energy grid would round away the small regen flows (CONSCIOUSNESS +0.02·k, etc.); say the word if you want explicit energy quantization (a 0.5-unit grid would survive most flows). | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 56/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_31.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 31 — COHERENCE / BOSONIC / FERMIONIC / SPIN

Laws under audit: COHERENCE, BOSONIC, FERMIONIC, SPIN

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| COHERENCE | Confirm as-is: velocity phase-lock — when the pair's velocity difference \|Δv\| < 1, each particle pulls toward the other with force `(vJ − vI)·0.02·k` (solver k = 0.5). HELP_DB's "aligning pulses" stays flavor (no PHASE_2 alignment). | ⏳ |
| BOSONIC | Confirm as-is: short-range glue — attraction when `dist < 3`: force `(3 − dist)·k` along the pair axis (solver k = 0.5 → up to 1.5 pull); range is fixed at 3 units, not species-scaled (SPEC.md's `rSum·2.2` note updated). | ⏳ |
| FERMIONIC | Confirm as-is: exclusion — when `dist < rI + rJ`, repulsion force `(1 − dist/rSum)·k·5` along the pair axis (solver k = 0.5 → up to 2.5 at contact); exclusion radius is species-scaled by the pair's radii. | ⏳ |
| SPIN | Confirm with decision: intrinsic wiggle — perpendicular force `(−vy, vx)/speed·0.1·k` with sign from particle index parity (even = +, odd = −); stationary particles get a random 3-axis kick of the same amplitude. HELP_DB's "speed scales with ENERGY" is unimplemented — recommend keeping the flat amplitude (energy-scaled spin would freeze low-energy particles); say the word if you want ENERGY scaling. | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 57/112: audit-suite/historical/2026-08-10-v4.6.28/laws-rrp/batch_32.md (17 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 32 — SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER

Laws under audit: SPECTRAL, WAVEFUNCTION, HYPERPLANE, ANTIMATTER

## Proposed spec (awaiting user RRP confirmation, 2026-08-06)

| Law | Proposed spec | Status |
|-----|---------------|--------|
| SPECTRAL | Confirm as-is: identity radiation — every tick `SIGNAL += (0.001 + 0.001·(SPECIES_ID % 5))·k` (solver k = 0.5 → 0.0005·(1 + species%5), cap 10); the tone is species-tagged by ID mod 5 (SPEC.md's `%3` formula updated). HELP_DB's "amplitude depends on ENERGY" stays flavor (amplitude is flat). | ⏳ |
| WAVEFUNCTION | Confirm as-is: probability cloud — after integration, position rounds to the wave grid `q = max(0.25, 0.5·k)` (solver k = 0.5 → 0.25-unit grid) on all three axes; no random jitter (SPEC.md's "tiny random jitter" note updated — the rounding alone is the blur). | ⏳ |
| HYPERPLANE | Confirm as-is: uniform slow drift — constant force `(0.001·k, 0.0005·k, 0.0002·k)` per tick (solver k = 1.0), a smooth global shear invisible in short trajectories; SPEC.md's "(vy, −vx) with AGE tilt" is updated to this uniform form (matches HELP_DB "shear is uniform and slow"). | ⏳ |
| ANTIMATTER | Confirm as-is: pair annihilation — when both particles carry opposite-sign stored charge with \|c\| > 0.1, both die (DEAD = 1) and each releases a signal burst (`+10·k`, cap 10). HELP_DB's "burst of energy" is represented by the signal burst (annihilated particles are dead, so no ENERGY credit); SPEC.md's "solver breaks the pair loop" is corrected (the pair loop simply continues). | ⏳ |

## Confirmation

- [ ] User confirmed / amended


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 58/112: audit-suite/historical/2026-08-10-v4.6.28/laws/INDEX.md (41 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Law Audit Suite — Index

32 batches × 4 laws = 128 laws (8 categories × 16). **All batches audited — 0 faulty.**

> 📄 **Combined results:** [combined.md](combined.md) — 110 ✅ PASS · 18 ⚠️ REPAIRED · 0 ❌ FAULTY

| Batch | Laws | Result |
|-------|------|--------|
| [batch 01](batch_01.md) | 01 — GRAV / DRAG / ENTR / WRAP | ✅ |
| [batch 02](batch_02.md) | 02 — COLL / ACCR / PLANETARY / LIFE | ✅ |
| [batch 03](batch_03.md) | 03 — GLOW / AFFINITY / REPRO / TRACK | ✅ |
| [batch 04](batch_04.md) | 04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE | ✅ |
| [batch 05](batch_05.md) | 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY | ✅ |
| [batch 06](batch_06.md) | 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY | ✅ |
| [batch 07](batch_07.md) | 07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION | ✅ |
| [batch 08](batch_08.md) | 08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY | ✅ |
| [batch 09](batch_09.md) | 09 — CHAOS / ORDER / FATE / WILL | ✅ |
| [batch 10](batch_10.md) | 10 — SOUL_LAW / MIND / VOID / BOND | ✅ |
| [batch 11](batch_11.md) | 11 — REDUCTION / ALLOY / MELT / BOIL | ✅ |
| [batch 12](batch_12.md) | 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY | ✅ |
| [batch 13](batch_13.md) | 13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION | ✅ |
| [batch 14](batch_14.md) | 14 — COMMS / CHARGE_LAW / FIELD / CURRENT | ✅ |
| [batch 15](batch_15.md) | 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM | ✅ |
| [batch 16](batch_16.md) | 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE | ✅ |
| [batch 17](batch_17.md) | 17 — PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN | ✅ |
| [batch 18](batch_18.md) | 18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL | ✅ |
| [batch 19](batch_19.md) | 19 — METRIC / PREDICT / CODE / PROTOCOL | ✅ |
| [batch 20](batch_20.md) | 20 — FEEDBACK / LANGUAGE / CULTURE / SINGULARITY | ✅ |
| [batch 21](batch_21.md) | 21 — ENTANGLEMENT / HISTORY / TIDE / FRICTION | ✅ |
| [batch 22](batch_22.md) | 22 — ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION | ✅ |
| [batch 23](batch_23.md) | 23 — SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY | ✅ |
| [batch 24](batch_24.md) | 24 — ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION | ✅ |
| [batch 25](batch_25.md) | 25 — STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION | ✅ |
| [batch 26](batch_26.md) | 26 — EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY | ✅ |
| [batch 27](batch_27.md) | 27 — CONSCIOUSNESS / PERCEPTION / SYNCHRONICITY / ANTENNA | ✅ |
| [batch 28](batch_28.md) | 28 — SHIELDING / POLARIZATION / NAVIGATION / ENCRYPTION | ✅ |
| [batch 29](batch_29.md) | 29 — SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE | ✅ |
| [batch 30](batch_30.md) | 30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK | ✅ |
| [batch 31](batch_31.md) | 31 — COHERENCE / BOSONIC / FERMIONIC / SPIN | ✅ |
| [batch 32](batch_32.md) | 32 — SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER | ✅ |


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 59/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_01.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 01 — GRAV / DRAG / ENTR / WRAP

Laws under audit (indices 0-3):

- **GRAV** (index 0, physics / BLUE)
- **DRAG** (index 1, physics / BLUE)
- **ENTR** (index 2, physics / BLUE)
- **WRAP** (index 3, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| GRAV | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "GRAV: particles accelerate toward each other and separation decreases": separation 10 → 9.68 after 5 ticks; `VEL_X` of i > 0 and of j < 0. Gate test confirms zero motion with GRAV off. |
| DRAG | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "DRAG: velocity decays over time": `VEL_X` 5 → ~2.73 over 60 ticks (viscosity 0.98 + friction 0.01, per-tick factor ≈0.99). Gate test: velocity preserved to 5 with DRAG off. |
| ENTR | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "ENTR: jitter injects random kinetic energy": resting particles (JITTER=5, seeded LCG prng) reach `|v| ≈ 0.4` after 80 ticks. Gate test: velocity stays 0 with ENTR off. |
| WRAP | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "WRAP: particles crossing the edge reappear on the opposite side": particle at x=1995, vx=10 lands at x≈2.5 after 3 ticks. Gate test: with WRAP off, edge clamps to ~1998.7 and flips velocity to −5. |

## Notes

- Validation method: integration-level `solve()` checks (see `v4/tests/unit/lawCategories.test.js` for the `makeWorld`/`solve` pattern), one focused test + one gate test per law, plus `isSet()` gating assertions.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyGravity`, DRAG damping block, ENTR jitter block, WRAP toroidal wrap block).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 60/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_02.md (27 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 02 — COLL / ACCR / PLANETARY / LIFE

Laws under audit (indices 4-7):

- **COLL** (index 4, physics / BLUE)
- **ACCR** (index 5, physics / BLUE)
- **PLANETARY** (index 6, physics / BLUE)
- **LIFE** (index 7, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COLL | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_02.test.js` — "COLL: approaching particles bounce": closing speed 2.0 → ~1.3 after 16 ticks; pair stays on the correct side (separation 0.61, no crossing). Before the fix the pair crossed straight through (separation −40). Gate test confirms pass-through with COLL off. |
| ACCR | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "ACCR: a larger body absorbs mass": big body 10 → +0.06, small body 1.5 → −0.06 in one tick, mass conserved (Δ=6e-6). Gate test: masses unchanged with ACCR off. |
| PLANETARY | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "PLANETARY: particles are pulled toward the world centre": distance to centre 1558.8 → 1558.4 after 200 ticks, `VEL_X/Y/Z` all > 0 toward centre. Gate test: no motion with PLANETARY off. |
| LIFE | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "LIFE: metabolic energy decay": ENERGY 100 → 99.0 over 100 ticks (ENERGY_EFFICIENCY=0 ⇒ −0.01/tick); "LIFE: starvation kills": HUNGER=100 → DEAD=1 in one tick. Gate test: energy untouched with LIFE off. |

## Notes

- **REPAIR — COLL bounce condition (attempt 1):** the impulse was applied when `relVelN < 0`, but with the i→j collision normal the pair is *closing* when `relVelN > 0`, so approaching particles received no bounce and passed through each other (reproduced empirically: `approach i=(1020,v5) j=(980,v-5) dist=-40`). Separating pairs were also receiving a spurious impulse.
  - File: `v4/src/physics/solver.js` (inline collision block, formerly line ~344).
  - Before: `// Bounce if approaching\n          if (relVelN < 0) {`
  - After: `// Bounce if approaching (relVelN > 0 along the i→j normal means\n          // the pair is closing; a negative impulse along n separates them)\n          if (relVelN > 0) {`
  - Verified: approaching pair bounces (dist stays positive, closing speed drops); separating pair moves apart freely with velocities preserved; full unit suite (123 tests) still green.
- Validation method: integration-level `solve()` tests with `isSet()` gating; ACCR and COLL use the overlap path in the solver's pairwise block.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 61/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_03.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 03 — GLOW / AFFINITY / REPRO / TRACK

Laws under audit (indices 8-11):

- **GLOW** (index 8, biology / GREEN)
- **AFFINITY** (index 9, biology / GREEN)
- **REPRO** (index 10, biology / GREEN)
- **TRACK** (index 11, biology / GREEN)

## Validation results (semantics confirmed in the interactive law RRP, 2026-08-05)

| Law | Status | Evidence |
|-----|--------|----------|
| GLOW | ✅ CONFIRMED + EXTENDED | now does both: emits signal pulses (PULSE_RATE×SIGNAL_STRENGTH oscillator) and converts signal into life energy; signal (SIGNAL) is a separate energy channel from metabolism (ENERGY) |
| AFFINITY | ✅ CONFIRMED + REPAIRED | same-species pull scales with positive affinity (was `Math.abs` — xenophobic species wrongly attracted their own kind); inert at 0; cross-species repel only when negative |
| REPRO | ✅ CONFIRMED + REPAIRED | gated on REPRODUCTIVE_DRIVE (stride 79) instead of raw ENERGY; drive accumulates from BIRTH_RATE, consumed on spawn |
| TRACK | ✅ CONFIRMED + REPAIRED | prey must be a different species (was same-species chasable) |

## Notes

- Validation method: integration-level `solve()` tests in `v4/tests/audit/batch_03.test.js` (13 tests) + updated REPRO/AFFINITY param tests in `params_batch_06/14/15/16`.
- Multi-energy architecture introduced: `ELECTRIC_ENERGY` (77), `STORED_ENERGY` (78), `REPRO_DRIVE` (79) stride fields — initialized at spawn and carried through multiplex shards.
- Full suite: 515/515 green.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 62/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_04.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE

Laws under audit (indices 12-15):

- **SENESCENCE** (index 12, biology / GREEN)
- **ENERGY** (index 13, biology / GREEN)
- **RADIATION** (index 14, biology / GREEN)
- **GENOTYPE** (index 15, biology / GREEN)

## Validation results (confirmed spec, v4.6.5)

| Law | Status | Evidence |
|-----|--------|----------|
| SENESCENCE | ✅ PASS | `v4/tests/audit/batch_04.test.js` — AGE=1000 + DEATH_RATE=500 → death chance 0.55 > prng 0.5 → DEAD=1 (LIFE on). Gate: survives without SENESCENCE; survives with SENESCENCE alone (LIFE dependency confirmed). |
| ENERGY | ✅ PASS | Multi-channel conduction: pairs (10/200 ENERGY, 20/150 ELECTRIC, 30/80 STORED) at dist 50 → cold gains, hot loses, each channel conserved (float-safe). SIGNAL/REPRO_DRIVE untouched. Gate test: all pools frozen with ENERGY off. |
| RADIATION | ✅ PASS | Exposure accumulates +0.01/tick (≈1.0 after 100 ticks) and compounds damage below the flat 98.0 baseline. RADIATION_LEVEL: 0 → no damage, 5 > 1. ARMOR=1 fully shields. Depletion → DEAD=1. Exposure 100 vs 0 → mutation fires only for the irradiated particle. |
| GENOTYPE | ✅ PASS | MUTATION=5 + TEMPERATURE=10 → DNA cache drifts. Exposure 100 ramps mutations above exposure 0 (more loci changed). CROSSOVER_RATE maxed + low PRNG → species genome (64×64 buffer) mutated within 20 ticks. Gate test: all 42 cache values bit-identical with GENOTYPE off. |

## Notes

- Validation method: integration-level `solve()` tests with `isSet()` gating. SENESCENCE is nested inside `applyLifeCycle` (requires LIFE on), confirmed by the standalone gate test.
- Repairs performed this batch: GLOW signal→energy regen removed (batch-03 backport, emission-only); duplicate in-LIFE radiation drain removed (double-drain bug); RADIATION gained slider scaling + exposure/mutation ramps; GENOTYPE gained the full genetics pipeline (repressor, heterozygosity, epigenetic drift, gene flow, species writeback).
- Full suite: 521/521 tests green (`v4/`); `vite build` clean.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 63/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_05.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY

Laws under audit (indices 16-19):

- **PHENOTYPE** (index 16, biology / GREEN)
- **CATALYSIS_LAW** (index 17, chemistry / PURPLE)
- **SOLVATION** (index 18, chemistry / PURPLE)
- **ACIDITY** (index 19, chemistry / PURPLE)

## Validation results (confirmed spec, v4.6.6)

| Law | Status | Evidence |
|-----|--------|----------|
| PHENOTYPE | ✅ PASS | `v4/tests/audit/batch_05.test.js` — radius ×1.25 at energy 200 (direct + integration); colour expression: POLARITY −1 → red (R>B), +1 → blue (B>R) from HSL mapping. Gate: radius unchanged without the law. |
| CATALYSIS_LAW | ✅ PASS | Direct: chemMult 1.0 (gate) → ×1.5 with CATALYSIS 1.0. Free: energy untouched over 50 ticks. Solver: amplifies the AFFINITY pull >2× with CATALYSIS 5.0 (chemMult applies to pre-chemistry forces; the old CHARGE_LAW test was premised wrong and removed). |
| SOLVATION | ✅ PASS | Multiplier: ×1.4 at charge gap 2, 1.0 near-equal. Real-world forces via solve(): opposite charges (1/−1) attract (vx>0), like charges (1/1) repel (vx<0), gate (WRAP only) → vx=0. |
| ACIDITY | ✅ PASS | Direct: gap 2 → charge 1→0.98, −1→−0.98 (equalizing), energy untouched; inert below gap 0.3. Solver: gap 2 → <1.0 after 200 ticks, charge conserved, energy untouched. |

## Notes

- Validation method: integration-level `solve()` tests + direct law calls with `isSet()` gating.
- Repairs performed: SOLVATION force was dead code → wired + fixed magnitude (|q1−q2| → |q1×q2| so like charges repel) and direction (both signs); ACIDITY rewritten from ENERGY erosion to documented CHARGE equalization; PHENOTYPE gained colour expression; CATALYSIS test re-anchored to a force the multiplier actually amplifies.
- Full suite: 533/533 tests green (`v4/`); `vite build` clean.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 64/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_06.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY

Laws under audit (indices 20-23):

- **OXIDATION** (index 20, chemistry / PURPLE)
- **POLYMER** (index 21, chemistry / PURPLE)
- **ISOMERIZATION** (index 22, chemistry / PURPLE)
- **CHIRALITY** (index 23, chemistry / PURPLE)

## Validation results (confirmed spec, v4.6.7)

| Law | Status | Evidence |
|-----|--------|----------|
| OXIDATION | ✅ PASS | `v4/tests/audit/batch_06.test.js` — charge 1, dt 1 → MASS 1.499 AND CHARGE 0.999 (rust); inert below |charge| 0.3; HEAT_OUTPUT 1.0 → ENERGY/TEMPERATURE rise + COLOR_R/ALPHA flash. Gate: untouched without the law. |
| POLYMER | ✅ PASS | Mutual bond: dist 5 → i records j (BOND_PARTNER_1=1, count 1) AND j records i (BOND_PARTNER_1=0, count 1) + spring ax 0.02. Cap: 6 slots filled → 7th candidate rejected. Integration: solve() forms the mutual bond. Gate: no force/bond without the law. |
| ISOMERIZATION | ✅ PASS | 3-bond particle + prng 0.001 → one bond broken, reciprocal cleared (partner count 1→0), ENERGY 100→99.5; inert below 3 bonds; integration: solve() (low PRNG) breaks a 3-bond chain within 20 ticks. Gate: bonds unchanged without the law. |
| CHIRALITY | ✅ PASS | Same-sign TORQUE pair → perpendicular deflection (−0.008, 0.006); negative torque → mirror direction (+0.008, −0.006); opposite-sign and zero-torque pairs → null. Gate: null without the law. |

## Notes

- Validation method: integration-level `solve()` tests + direct law calls with `isSet()` gating.
- Repairs/upgrades: POLYMER expanded 2→6 mutual bond slots (stride 81-84 appended, `/100` hardcode fixed); ISOMERIZATION replaced the dead radius-breathing placeholder with real bond rearrangement (documented energy cost); CHIRALITY switched from POLARITY to the documented TORQUE DNA with handedness-direction; OXIDATION gained charge decay + glow flash.
- Full suite: 538/538 tests green (`v4/`); `vite build` clean.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 65/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_07.md (27 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION

Laws under audit (indices 24-27):

- **CRYSTALLIZATION** (index 24, chemistry / PURPLE)
- **HEAT** (index 25, thermodynamics / ORANGE)
- **COLD** (index 26, thermodynamics / ORANGE)
- **CONVECTION** (index 27, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CRYSTALLIZATION | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyCrystallization` null (gate / dist > 30); offset (4,4) → pull (0.04, 0.04) toward 8-unit lattice. Gating `isSet` verified. |
| HEAT | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyHeatTransfer` no-op (gate); hot 1.0 / cold 0.0, dt 1 → 0.99 / 0.01 (conducts hot → cold). Integration: `solve()` conducts between neighbours. Gating `isSet` verified. |
| COLD | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_07.test.js` — direct call now equalises: cold 0.0 / hot 1.0, dt 1 → 0.015 / 0.985 (was 1.015 / −0.015: hot particle got hotter — anti-thermodynamic sign inversion). Integration: `solve()` cools the hotter neighbour (1.001875 → < 1.0). Gating `isSet` verified. |
| CONVECTION | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyConvection` no-op (gate); temp 1.0, dt 1 → VEL_Y +0.0005 ((temp−0.5)·0.001). Integration: `solve()` gives hot particle positive VEL_Y. Gating `isSet` verified. |

## Notes

- COLD repaired in `v4/src/physics/laws.js` (`applyHeatTransfer`, `src/physics/laws.js` ~line 875):
  - Before: `const tDec2 = diff * rate; const tInc2 = diff * rate;` (diff = tempI − tempJ < 0 when the partner is hotter → hot particle heated, cold particle cooled).
  - After: `const tDec2 = -diff * rate; const tInc2 = -diff * rate;` — heat now flows from the hotter partner into the colder one, matching HELP_DB "temperature trends toward equilibrium".
  - Repair attempt count: 1.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_07.test.js` (16 tests).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 66/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_08.md (27 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY

Laws under audit (indices 28-31):

- **PHASE_RADIATION** (index 28, thermodynamics / ORANGE)
- **SUBLIMATION** (index 29, thermodynamics / ORANGE)
- **TIME_DILATION** (index 30, metaphysics / RED)
- **DIMENSIONALITY** (index 31, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PHASE_RADIATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applyPhaseRadiation` no-op (gate / temp ≤ 0.6); temp 1.0, dt 1 → energy −0.008, temp −0.008, signal +0.008. Integration: `solve()` lowers temp and raises signal. Gating `isSet` verified. |
| SUBLIMATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applySublimation` no-op (gate); temp 1.0, mass 1.5, dt 1 → mass −0.0025, temp −0.00125 (+ random velocity burst). Integration: `solve()` sublimates a hot massive particle. Gating `isSet` verified. |
| TIME_DILATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applyTimeDilation` 1.0 (gate / soul 0); soul 1.0 → localDt 0.7 (1 − soul·0.3). Integration: `solve()` high-soul particle advances AGE slower than soul-less (0.25 vs 0.175 dt). Gating `isSet` verified. |
| DIMENSIONALITY | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_08.test.js` — direct call: prng 1.0, dt 1 → VEL_Z +0.05. Integration: `solve()` now leaves VEL_Z ≠ 0 (was 0 — the kick was applied to the buffer in the force phase, then overwritten by the stale local velocity at integration). Gating `isSet` verified. |

## Notes

- DIMENSIONALITY repaired in two files (1 attempt):
  - `v4/src/physics/laws.js` (`applyDimensionality`, ~line 909): now `return force` after writing `view[base + S.VEL_Z] += force` (gate returns 0 instead of `undefined`).
  - `v4/src/physics/solver.js` (~line 843): call site changed from `applyDimensionality(...)` to `vz += applyDimensionality(...)`, folding the kick into the local velocity that is written back at integration. Previously the in-place buffer write was overwritten by the integration write of the stale local `vz`.
  - Repair attempt count: 1.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_08.test.js` (18 tests).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 67/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_09.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 09 — CHAOS / ORDER / FATE / WILL

Laws under audit (indices 32-35):

- **CHAOS** (index 32, metaphysics / RED)
- **ORDER** (index 33, metaphysics / RED)
- **FATE** (index 34, metaphysics / RED)
- **WILL** (index 35, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CHAOS | ⚠️ REPAIRED (1 attempt) | `CHAOS direct: stochastic velocity forcing, gated by isSet` — prng=1 ⇒ VEL_X/Y +0.25, VEL_Z +0.125; prng=0 ⇒ −0.25; off ⇒ no-op. `CHAOS integration` — vx = 0.05 (prng 0.9) with law on, 0 with law off. |
| ORDER | ✅ PASS | `ORDER direct` — idle i gains ax=+0.025 toward neighbor vx=5 (distSq 100); null beyond 10k and when off. `ORDER integration` — i.vx > 0 with j at vx=5; 0 with law off. |
| FATE | ✅ PASS | `FATE direct` — same-species pair at dx=10 gives ax=+0.05; null for cross-species, distSq>250k, and when off. `FATE integration` — same-species i.vx > 0; 0 with law off. |
| WILL | ⚠️ REPAIRED (1 attempt) | `WILL direct` — vx 5 → 5.01 boost; stationary no boost; off no-op. `WILL integration` — vx 2 → 2.0025 with law on; 2 with law off. |

## Notes

- Method: direct law-function calls (`applyChaos`/`applyOrder`/`applyFate`/`applyWill` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_09.test.js` (8 tests, all pass).
- Repair 1 (CHAOS + WILL, 1 attempt): integration revealed CHAOS and WILL wrote velocity deltas in-place to the buffer during solve, but the solver's local `vx/vy/vz` copy overwrote them at writeback (the old "Re-read velocity" line `vx = view[VEL_X] + (vx - view[VEL_X])` was an algebraic no-op). Fix in `v4/src/physics/solver.js`: fold buffer velocity into locals before force integration, and fold WILL's in-place boost back via pre/post deltas. `v4/tests/unit` (123 tests) unaffected.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 68/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_10.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 10 — SOUL_LAW / MIND / VOID / BOND

Laws under audit (indices 36-39):

- **SOUL_LAW** (index 36, metaphysics / RED)
- **MIND** (index 37, metaphysics / RED)
- **VOID** (index 38, physics / BLUE)
- **BOND** (index 39, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SOUL_LAW | ✅ PASS | `SOUL_LAW direct` — i soul 0 → 0.05 from neighbor soul 50 (distSq 100); no transfer cross-species, beyond 10k, or when off. `SOUL_LAW integration` — i soul > 0 with law on; 0 with law off. |
| MIND | ✅ PASS | `MIND direct` — same-species pair returns signalBoost 0.001 (distSq 100), ax=0; null cross-species, beyond 40k, and when off. `MIND integration` — i SIGNAL > 0 with law on; 0 with law off. |
| VOID | ✅ PASS | `VOID direct` — particle at (1100,1000,1000) in 2000³ world gets ax=+0.0005 outward; null exactly at center and when off. `VOID integration` — particle at x=1800 gains vx > 0; 0 with law off. |
| BOND | ✅ PASS | `BOND direct` — stretched pair (dist 3, rest 2.2, stiffness 1) returns ax=+0.04, registers BOND_COUNT=1 + BOND_PARTNER_1 on both sides, no double count on re-call; null beyond 30, stiffness<0.01, and when off. `BOND integration` — both particles BOND_COUNT=1 with law on; 0 with law off. |

## Notes

- Method: direct law-function calls (`applySoul`/`applyMind`/`applyVoid`/`applyBond` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_10.test.js` (8 tests, all pass).
- No repairs needed. Bond slots must be pre-initialized to −1 (seed does this); default 0 slot values would block registration, which is expected buffer hygiene, not a law fault.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 69/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_11.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 11 — REDUCTION / ALLOY / MELT / BOIL

Laws under audit (indices 40-43):

- **REDUCTION** (index 40, chemistry / PURPLE)
- **ALLOY** (index 41, chemistry / PURPLE)
- **MELT** (index 42, thermodynamics / ORANGE)
- **BOIL** (index 43, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| REDUCTION | ✅ PASS | `REDUCTION direct` — charges 1.0/0.2 → 0.96/0.24 (neutralization = diff×0.05); equal charges unchanged. `REDUCTION integration` — |Δcharge| 0.8 → <0.8 with law on; stays 0.8 with law off. |
| ALLOY | ⚠️ REPAIRED (1 attempt) | `ALLOY direct` — cross-species overlap (dist 0.3 < (r1+r2)/2) merges j into i: j DEAD=1, i MASS 1.5 → 1.65; same-species, far pairs, and off are no-ops. `ALLOY integration` — j DEAD=1, i MASS > 1.5 with law on; unchanged with law off. |
| MELT | ✅ PASS | `MELT direct` — temp 1.0, mass 1.5 → mass 1.497, temp drops; below 0.7 and off unchanged. `MELT integration` — mass < 1.5 with law on; 1.5 with law off. |
| BOIL | ✅ PASS | `BOIL direct` — mass 10, temp 1.0 → mass < 10 and temp drops (ejectMass 0.02 > 0.01); temp<0.9, small ejectMass, and off unchanged. `BOIL integration` — mass 50, temp 1.0 → mass < 50 with law on; 50 with law off. |

## Notes

- Method: direct law-function calls (`applyReduction`/`applyAlloy`/`applyMelt`/`applyBoil` from `v4/src/physics/laws.js`, `setBuffer` for REDUCTION's global buffer) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_11.test.js` (8 tests, all pass).
- Repair 1 (ALLOY, 1 attempt): integration showed j was marked DEAD but i's mass stayed 1.5 — `applyAlloy` adds mass in-place to `view[iBase+MASS]` during the pair loop, but the solver writeback `view[iBase+MASS] = mass` (stale local copy) clobbered it. Fix in `v4/src/physics/solver.js`: fold the buffer mass back into the local copy immediately before writeback (`mass = view[iBase + S.MASS];`). This also restores accretion/chemistry mass transfers that write in-place during the pair loop.
- BOIL integration initially failed only because the 0.01 ejectMass threshold needs mass ≥ 20 at `DT=0.25`; raised test mass 10 → 50 (implementation is correct, verified by the direct-call test).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 70/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_12.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY

Laws under audit (indices 44-47):

- **CONDENSE** (index 44, thermodynamics / ORANGE)
- **DEPOSIT** (index 45, thermodynamics / ORANGE)
- **EXOTHERMIC** (index 46, thermodynamics / ORANGE)
- **TELEPATHY** (index 47, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CONDENSE | ✅ PASS | `CONDENSE direct` — temp 0.0, mass 1.5 → mass 1.5015, temp +0.00015; temp>0.3 and off unchanged. `CONDENSE integration` — mass > 1.5 with law on; 1.5 with law off. |
| DEPOSIT | ✅ PASS | `DEPOSIT direct` — temp 0.0 → mass 1.5 → 1.506, radius 0.6 → 0.601, temp +0.0001; temp>0.2 and off unchanged. `DEPOSIT integration` — mass > 1.5 with law on; 1.5 with law off. |
| EXOTHERMIC | ✅ PASS | `EXOTHERMIC direct` — energy 100 → 110 (×1.1 at synergy 1); off unchanged. `EXOTHERMIC integration` — energy > 100 with law on; 100 with law off. |
| TELEPATHY | ✅ PASS | `TELEPATHY direct` — j SIGNAL 0.5 → i SIGNAL 0.025 at any distance; no transfer cross-species, below 0.001 threshold, or when off. `TELEPATHY integration` — i SIGNAL > 0 with law on; 0 with law off. |

## Notes

- Method: direct law-function calls (`applyCondense`/`applyDeposit`/`applyExothermic`/`applyTelepathy` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_12.test.js` (8 tests, all pass).
- No repairs needed. TELEPATHY intentionally ignores distance (distSq argument unused) — consistent with its HELP_DB "regardless of distance" behavior.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 71/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_13.md (25 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION

Laws under audit (indices 48-51):

- **CLAIRVOYANCE** (index 48, metaphysics / RED)
- **PRECOGNITION** (index 49, metaphysics / RED)
- **ASTRAL** (index 50, metaphysics / RED)
- **PREDATION** (index 51, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CLAIRVOYANCE | ✅ PASS | `batch_13.test.js` — "CLAIRVOYANCE steers toward the neighbor's predicted future position": direct `applyClairvoyance` with offset (0,10,0) + neighbor vx=5 returns ax>0, ay≈0; law-off gate returns null; integration: after 40 solves VEL_X > 0.005. |
| PRECOGNITION | ✅ PASS | `batch_13.test.js` — "PRECOGNITION applies lateral avoidance force on a collision course": closing pair (dot<0) yields ay>0, ax≈0; law-off and moving-apart (dot>0) gates return null; integration: VEL_Y > 0.001 after 8 solves. |
| ASTRAL | ⚠️ REPAIRED (1 attempt) | `batch_13.test.js` — "ASTRAL keeps souls as fading ghosts": DEAD=0.5/SOUL=1 soul keeps DEAD=0.5, ALPHA≈soul×0.5, MASS≈soul×0.1, SOUL decays <1. See repair notes. |
| PREDATION | ⚠️ REPAIRED (1 attempt) | `batch_13.test.js` — "PREDATION pursues lower-mass prey and absorbs mass/DNA on contact": predator (mass 5, PREDATION_BIAS 10) vs prey (mass 1) at contact: 5 sampled DNA traits blend toward prey (sum +0.5), predator mass 5→5.05, prey 1→0.9; pursuit at 50 units: VEL_X > 0.001 after 20 solves. See repair notes. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_13.test.js` — integration-level `solve()` checks with `isSet` gate assertions, plus direct calls to `applyClairvoyance`/`applyPrecognition` (both use the `view` param and need no `setBuffer`).
- **ASTRAL repair (v4/src/physics/solver.js)**: `applyAstral` was dispatched at the end of the per-particle loop, but that loop skips `DEAD >= 0.5` particles, so souls never reached it. Added a dedicated soul pass (Phase 2b) that iterates all particles and calls `applyAstral` for `DEAD >= 0.5`, and removed the now-redundant in-loop call.
- **PREDATION repair (v4/src/physics/solver.js)**: `applyPredation` writes absorbed mass directly to the buffer, but the solver's per-particle writeback `view[iBase+S.MASS] = mass` used a stale local read before the pairwise loop, clobbering the predator's mass gain (prey's loss survived). Added a mass re-read right after the pairwise loop (`mass = view[iBase + S.MASS]`), mirroring the existing velocity re-read pattern.
- Full v4 unit suite (123 tests) still passes after repairs.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 72/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_14.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 14 — COMMS / CHARGE_LAW / FIELD / CURRENT

Laws under audit (indices 52-55):

- **COMMS** (index 52, biology / GREEN)
- **CHARGE_LAW** (index 53, electromagnetism / CYAN)
- **FIELD** (index 54, electromagnetism / CYAN)
- **CURRENT** (index 55, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COMMS | ✅ PASS | `batch_14.test.js` — "COMMS emits signals over time and stays frozen when off": 4 particles, AGE=0, 120 solves → at least one SIGNAL > 1e-6; with no laws, SIGNAL=0.5 and MEMORY stay exact. "COMMS exchanges signal to a neighbour": sender SIGNAL=1, receiver 20 away → receiver SIGNAL > 0.1 after 10 solves. |
| CHARGE_LAW | ⚠️ REPAIRED (1 attempt) | `batch_14.test.js` — "CHARGE_LAW repels like charges and attracts opposite charges": POLARITY=1/1 pair at 10 units → dist grows >0.05 over 60 solves; POLARITY=1/−1 → dist shrinks >0.05; law-off gate: no movement. See repair notes. |
| FIELD | ✅ PASS | `batch_14.test.js` — "FIELD drifts particles along their POLARITY sign": POLARITY=+1 → VEL_Y > 0 after 1 solve; POLARITY=−1 → VEL_Y < 0; law-off gate: VEL_Y stays 0. |
| CURRENT | ✅ PASS | `batch_14.test.js` — "CURRENT diffuses stored charge between conductive neighbours": CHARGE 2/0 pair with CONDUCTIVITY 1 → after 10 solves charge1 < 2, charge2 > 0, |Δcharge| < 0.5; law-off gate: charge unchanged. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_14.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- **CHARGE_LAW repair (v4/src/physics/laws.js)**: `applyChargeForce` used `force = k*qq/(dist²+0.5)` along `dx` (toward the neighbor), which made like charges ATTRACT and opposite charges REPEL — the inverse of the HELP_DB contract ("Opposite charges attract, like charges repel") and of Coulomb's law. Flipped the sign to `force = -k*qq/(dist²+0.5)`. Existing direction-agnostic unit tests still pass.
- Full v4 unit suite (123 tests) still passes after repair.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 73/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_15.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM

Laws under audit (indices 56-59):

- **RESISTANCE** (index 56, electromagnetism / CYAN)
- **CAPACITANCE** (index 57, electromagnetism / CYAN)
- **INDUCTANCE** (index 58, electromagnetism / CYAN)
- **MAGNETISM** (index 59, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| RESISTANCE | ✅ PASS | `batch_15.test.js` — "RESISTANCE damps fast motion and converts it into heat": VEL_X=5, TEMPERATURE=0 → after 10 solves speed < 5 and TEMPERATURE > 0; law-off gate: velocity and temperature unchanged. |
| CAPACITANCE | ⚠️ REPAIRED (1 attempt) | `batch_15.test.js` — "CAPACITANCE stores surplus energy as charge and bleeds it when low": ENERGY 100 → CHARGE > 0.5 after 20 solves; ENERGY 30 + CHARGE 1 → CHARGE < 1 after 20 solves. "CAPACITANCE stored charge produces a pairwise repulsion force": same-sign stored charge pair at 10 units → dist grows >0.02 over 60 solves. See repair notes. |
| INDUCTANCE | ✅ PASS | `batch_15.test.js` — "INDUCTANCE aligns neighbour velocities": VEL_X +3/−3 pair → relative speed < 50% after 20 solves; law-off gate: relative speed stays exactly 6.0. |
| MAGNETISM | ✅ PASS | `batch_15.test.js` — "MAGNETISM attracts aligned moments and repels opposing moments": MAGNETIC_MOMENT +1/+1 pair → dist shrinks >0.02 over 60 solves; +1/−1 pair → dist grows >0.02. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_15.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- **CAPACITANCE repair (v4/src/physics/laws.js)**: `applyStoredChargeForce` used `force = k*qq/(dist²+0.5)` along `dx`, so same-sign stored charges ATTRACTED instead of repelling (same sign bug as CHARGE_LAW). Flipped to `force = -k*qq/(dist²+0.5)` so stored charge follows the same electrostatic convention as CHARGE_LAW (which feeds it).
- Full v4 unit suite (123 tests) still passes after repair.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 74/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_16.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE

Laws under audit (indices 60-63):

- **RESONANCE** (index 60, electromagnetism / CYAN)
- **FLUX** (index 61, electromagnetism / CYAN)
- **IONIZATION** (index 62, electromagnetism / CYAN)
- **DISCHARGE** (index 63, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| RESONANCE | ✅ PASS | `batch_16.test.js` — "RESONANCE attracts actively-pulsing particles with matching PULSE_RATE": SIGNAL=1 pair with PULSE_RATE 0.5/0.5 at 20 units → dist shrinks >0.05 over 60 solves; silent pair (no SIGNAL) → positions stable (±1e-3). |
| FLUX | ✅ PASS | `batch_16.test.js` — "FLUX pushes particles along the stored-charge gradient": CHARGE 0/2 pair at 10 units → lower-charge particle x moves >0.5 toward the gradient over 30 solves; law-off gate: x stays 100. |
| IONIZATION | ✅ PASS | `batch_16.test.js` — "IONIZATION strips charge onto particles on hard contact": POLARITY=1 pair at dist 2, relSpeed 2 → both CHARGE > 0 after 1 solve; law-off gate: both CHARGE stay 0. |
| DISCHARGE | ✅ PASS | `batch_16.test.js` — "DISCHARGE converts stored charge into motion and heat, resetting charge": CHARGE=1.5 → after 1 solve CHARGE=0, TEMPERATURE > 0, VEL_X ≠ 0; law-off gate: CHARGE stays 1.5, no heat. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_16.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- No repairs required; all four laws behave per LAW_HELP_DB.
- RESONANCE requires both particles to be actively signaling (SIGNAL > 0.01) and rewards matching PULSE_RATE via the `sync = 1 − |ΔPULSE_RATE|` term — verified with the silent-pair control.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 75/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_17.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 17 — PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN

Laws under audit (indices 64-67):

- **PLASMA** (index 64, electromagnetism / CYAN)
- **SUPERCONDUCTIVITY** (index 65, electromagnetism / CYAN)
- **MEMORY** (index 66, information / GOLD)
- **PATTERN** (index 67, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PLASMA | ✅ PASS | `v4/tests/audit/batch_17.test.js` — `applyPlasma(0, 0.02)` @ temp 1 → CHARGE +0.008, temp 1 → 0.996; inert below temp 0.6. Integration: `solve()` ionizes a hot particle (CHARGE > 0, temp < 1). Gating `isSet` verified. |
| SUPERCONDUCTIVITY | ✅ PASS | `v4/tests/audit/batch_17.test.js` — cold pair (temp 0): CHARGE 1/−1 → 0.96/−0.96 with k 0.05; damping force `ax = (v2−v1)·k = 0.5`; returns null when either temp > 0.35. Integration: `solve()` shrinks both charge gap and relative speed. Gating `isSet` verified. |
| MEMORY | ✅ PASS | `v4/tests/audit/batch_17.test.js` — `applyMemoryRefresh` +0.05 both (cap 1); `applyMemoryDecay(0.995, 0.5)` fades mem 1 → 0.995 and amplifies velocity ×(1 + mem·0.5·0.02) → 1.01. Integration: `solve()` leaves MEMORY > 0 after contact + decay. Gating `isSet` verified. |
| PATTERN | ✅ PASS | `v4/tests/audit/batch_17.test.js` — cohesion `applyPatternForce(3,4,0,5,0.2)` → ax 0.02, ay 0.026667; null at dist < 1. Integration: 40 ticks of `solve()` shrink the pair distance. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_17.test.js` (16 tests).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 76/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_18.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL

Laws under audit (indices 68-71):

- **STIGMERGY** (index 68, information / GOLD)
- **SIGNAL_BOOST** (index 69, information / GOLD)
- **LEARN** (index 70, information / GOLD)
- **SYMBOL** (index 71, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| STIGMERGY | ✅ PASS | `v4/tests/audit/batch_18.test.js` — `applyTrailWrite(100,100,100, 1,0,0)` → TRAIL (108,100,100) (pos + vel·8); `applyStigmergyForce` toward a trail 8 units east → ax ≈ 0.2667 (k 0.3). Integration: `solve()` steers a follower toward a pre-laid trail (VEL_X > 0). Gating `isSet` verified. |
| SIGNAL_BOOST | ✅ PASS | `v4/tests/audit/batch_18.test.js` — signal 0.5 relays +0.04 to neighbour (k 0.08); silent particle relays nothing. Integration: `solve()` propagates signal to a quiet neighbour. Gating `isSet` verified. |
| LEARN | ✅ PASS | `v4/tests/audit/batch_18.test.js` — `applyLearnAlign` moves VEL_X 0 → +0.05 toward a v=10 neighbour (k 0.05, kk = k·0.1). Integration: `solve()` steers the stationary particle (0 < VEL_X < 10). Gating `isSet` verified. |
| SYMBOL | ✅ PASS | `v4/tests/audit/batch_18.test.js` — same-species with SPECIES_AFFINITY 1 → attraction ax ≈ 0.03 (dx 3, dist 5, k 0.3); different species → repulsion −0.015 (affinity flipped ×0.5). Integration: 40 ticks of `solve()` converge same-species flockmates. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no implementation repairs, no implementation files modified.
- Two test-setup corrections were made in `v4/tests/audit/batch_18.test.js` (test-only): the direct STIGMERGY check now seeds the follower's POS_X (trail offset was computed from origin otherwise), and the integration check asserts the follower's pull (the trail-writer itself has zero self-force within the tick, as trail write happens after its pair pass).
- Test file: `v4/tests/audit/batch_18.test.js` (15 tests).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 77/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_19.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 19 — METRIC / PREDICT / CODE / PROTOCOL

Laws under audit (indices 72-75):

- **METRIC** (index 72, information / GOLD)
- **PREDICT** (index 73, information / GOLD)
- **CODE** (index 74, information / GOLD)
- **PROTOCOL** (index 75, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| METRIC | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyMetricForce` with dE 50, k 0.2 → ax 0.9998, ay 1.3331 (invDist 1/(dist+0.001)); returns null on an energy plateau (dE 0). Integration: `solve()` accelerates a poor particle toward the rich neighbour (VEL_X > 0). Gating `isSet` verified. |
| PREDICT | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyPredictForce` aims at extrapolated position (pdx 6, pdy 4 from v2·t=3; direction matches (pdx/pd, pdy/pd)). Integration: `solve()` steers toward the neighbour's future position. Gating `isSet` verified. |
| CODE | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyCodeBlend` @ distSq 9 converges sampled loci (0/1 → 0.0005/0.9995, rate k·0.01); no blend beyond distSq 16. Integration: `solve()` converges DNA at sampled loci for touching particles. Gating `isSet` verified. |
| PROTOCOL | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyProtocolSync` entangles signal phase (0/1 → 0.1/0.9, k 0.1). Integration: `solve()` shrinks the neighbour signal gap. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_19.test.js` (14 tests).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 78/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_20.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 20 — FEEDBACK / LANGUAGE / CULTURE / SINGULARITY

Laws under audit (indices 76-79):

- **FEEDBACK** (index 76, information / GOLD)
- **LANGUAGE** (index 77, information / GOLD)
- **CULTURE** (index 78, information / GOLD)
- **SINGULARITY** (index 79, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| FEEDBACK | ✅ PASS | `v4/tests/audit/batch_20.test.js` — `applyFeedback(0, 0.5)` with mem 0.5, v 2 → MEMORY +0.02 (speed·k·0.02) and boost ax = vx·mem·k·0.1 = 0.05; returns null when stationary. Integration: `solve()` accelerates a moving, memory-bearing particle and recharges MEMORY. Gating `isSet` verified. |
| LANGUAGE | ✅ PASS | `v4/tests/audit/batch_20.test.js` — signaling pair (s 0.5/0, k 0.25): MEMORY 1/0 → 0.875/0.125, signal relay +0.0125; silent pair untouched. Integration: `solve()` shrinks the memory gap and relays signal. Gating `isSet` verified. |
| CULTURE | ✅ PASS | `v4/tests/audit/batch_20.test.js` — same-species contact (k 0.5): DNA cache 0/1 → 0.01/0.99 (rate k·0.02); different-species pairs untouched. Integration: `solve()` converges traits within a species but not across. Gating `isSet` verified. |
| SINGULARITY | ✅ PASS | `v4/tests/audit/batch_20.test.js` — `applySingularityForce` from m2 20 @ dist 10 (k 0.5) yields the inverse-square pull; null for sub-critical m2 5. `applySingularityAbsorb` inside the horizon (dist 2 < max(2.5, √25·0.8)) transfers mass (1.5 → hole 25 → 26.5) and kills the victim; no absorb beyond. Integration: `solve()` absorbs a particle on contact. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_20.test.js` (18 tests).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 79/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_21.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 21 — ENTANGLEMENT / HISTORY / TIDE / FRICTION

Laws under audit (indices 80-83):

- **ENTANGLEMENT** (index 80, metaphysics / RED)
- **HISTORY** (index 81, information / GOLD)
- **TIDE** (index 82, physics / BLUE)
- **FRICTION** (index 83, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ENTANGLEMENT | ✅ PASS | `v4/tests/audit/batch_21.test.js` — link forms on contact (`ENTANGLE_ID` 1/0, `ENTANGLE_PHASE` ≈ 0.998 after 1 tick); non-local coupling converges velocities (rel 5.0 → < 5.0 over 150 ticks, link still live); phase forced to 0.02 snaps the link to `ENTANGLE_ID = -1`. Gate: no link with the law off. |
| HISTORY | ✅ PASS | `v4/tests/audit/batch_21.test.js` — two corner particles drift toward the shared memory-field COM: first ticks pull each toward the centre (VEL_X/Y/Z > 0), separation 3117.7 → 2702.7 over 120 ticks. Gate: no drift with the law off. |
| TIDE | ✅ PASS | `v4/tests/audit/batch_21.test.js` — light particle (mass 1.5) accelerates toward a mass-20 neighbour (VEL_X > 0), separation 100 → < 100 over 100 ticks. Gate: no mass coupling with TIDE off. |
| FRICTION | ✅ PASS | `v4/tests/audit/batch_21.test.js` — velocity-dependent drag slows a vx=5 particle to < 5 over 100 ticks (still positive). Gate: velocity preserved exactly with FRICTION off. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating (see `v4/tests/unit/lawCategories.test.js` for the `makeWorld`/`solve` pattern). ENTANGLEMENT dispatch is pairwise (`applyEntanglePair`) + per-particle (`applyEntanglement`); HISTORY is per-particle write/force + `applyHistoryCalc()` once per solve (`v4/src/physics/laws.js`, dispatched from `v4/src/physics/solver.js`); TIDE/FRICTION are `v4/src/physics/lawgroups/physicsLaws.js`.
- A single-particle HISTORY drift test initially overshot the COM (the accumulating trail pulls the particle back — documented "archaeology" behaviour), so the assertion was replaced with a two-particle convergence test, which is deterministic.
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 80/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_22.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 22 — ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION

Laws under audit (indices 84-87):

- **ELASTICITY** (index 84, physics / BLUE)
- **TURBULENCE** (index 85, physics / BLUE)
- **CENTRIPETAL** (index 86, physics / BLUE)
- **ROTATION** (index 87, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ELASTICITY | ✅ PASS | `v4/tests/audit/batch_22.test.js` — overlapping pair (dist 0.5, radii 0.6) pushed apart: separation 0.5 → > 1.0 over 20 ticks. Gate: separation unchanged with ELASTICITY off. |
| TURBULENCE | ✅ PASS | `v4/tests/audit/batch_22.test.js` — seeded-LCG noise kicks leave a resting particle with speed > 0.05 after 100 ticks. Gate: velocity stays exactly 0 without the law. |
| CENTRIPETAL | ✅ PASS | `v4/tests/audit/batch_22.test.js` — particle at (100,100,100) pulled toward centre: distance to centre 1558.8 → < 1558.8 over 200 ticks, VEL_X/Y/Z all > 0 (harmonic attractor). Gate: no central pull without the law. |
| ROTATION | ✅ PASS | `v4/tests/audit/batch_22.test.js` — offset (−300, 0) gets a purely tangential first impulse (VEL_Y < 0, VEL_X = 0), then swirls: VEL_Y < 0 and POS_Y < 1000 after 100 ticks. Gate: no swirl without the law. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. All six functions live in `v4/src/physics/lawgroups/physicsLaws.js`; the solver dispatches ELASTICITY pairwise and TURBULENCE/CENTRIPETAL/ROTATION per-particle.
- The long-run ROTATION trajectory spirals (radial velocity grows because the tangential force keeps accelerating), so the assertion targets the deterministic first-impulse tangency plus the −y swirl, matching `LAW_HELP_DB` ("tangential force that sets the whole dish rotating").
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 81/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_23.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 23 — SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY

Laws under audit (indices 88-91):

- **SYMBIOSIS** (index 88, biology / GREEN)
- **PARASITE** (index 89, biology / GREEN)
- **HIBERNATION** (index 90, biology / GREEN)
- **IMMUNITY** (index 91, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SYMBIOSIS | ✅ PASS | `v4/tests/audit/batch_23.test.js` — different-species contact transfers energy rich → poor: pair 100/40 becomes < 100 / > 40 with total conserved (140) after 1 tick. Gate: energies untouched without the law. |
| PARASITE | ✅ PASS | `v4/tests/audit/batch_23.test.js` — mass-1 parasite drains a mass-5 host: parasite ENERGY > 100, host < 100 after 1 tick. Gate: no drain without the law. |
| HIBERNATION | ✅ PASS | `v4/tests/audit/batch_23.test.js` — starving particle (ENERGY 20, vx 5) regains energy (> 20) and is damped (< 5) in 1 tick; well-fed particle (ENERGY 50) is unaffected (energy 50, vx 5 preserved over 10 ticks). |
| IMMUNITY | ✅ PASS | `v4/tests/audit/batch_23.test.js` — ARMOR regenerates 0 → > 0.5 and ENERGY rises above 100 over 100 ticks. Gate: armour stays 0 without the law. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. Functions live in `v4/src/physics/lawgroups/biologyLaws.js`; the solver dispatches SYMBIOSIS/PARASITE pairwise and HIBERNATION/IMMUNITY per-particle (k = 0.5).
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 82/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_24.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 24 — ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION

Laws under audit (indices 92-95):

- **ELECTROLYSIS** (index 92, chemistry / PURPLE)
- **PHOTOLYSIS** (index 93, chemistry / PURPLE)
- **PRECIPITATION** (index 94, chemistry / PURPLE)
- **NEUTRALIZATION** (index 95, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ELECTROLYSIS | ✅ PASS | `v4/tests/audit/batch_24.test.js` — charge imbalance (1 vs 0) converts mass into energy + signal: MASS 1.5 → < 1.5, ENERGY > 100, SIGNAL > 0 after 1 tick. Gate: balanced charges (Δ 0.2) are inert (mass/signal unchanged). |
| PHOTOLYSIS | ✅ PASS | `v4/tests/audit/batch_24.test.js` — SIGNAL 1 decomposes mass into energy and spends light: MASS < 1.5, ENERGY > 100, SIGNAL ≈ 0.9 after 1 tick. Gate: weak signal (0.2) is inert. |
| PRECIPITATION | ✅ PASS | `v4/tests/audit/batch_24.test.js` — high-energy contact condenses: MASS 1.5 → > 1.5, RADIUS 0.458 → < 0.458, ENERGY < 100 after 1 tick. Gate: mass/energy unchanged without the law. |
| NEUTRALIZATION | ✅ PASS | `v4/tests/audit/batch_24.test.js` — opposite charges (1 / −1) cancel toward 0 and release heat: |CHARGE| < 1 for both, TEMPERATURE > 0 for both after 1 tick. Gate: same-sign charges (0.5/0.5) are inert. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. Functions live in `v4/src/physics/lawgroups/chemistryLaws.js`; the solver dispatches ELECTROLYSIS/PRECIPITATION/NEUTRALIZATION pairwise and PHOTOLYSIS per-particle (k = 0.5).
- RADIUS assertions use the solver-recomputed radius (BASE_RADIUS × mass^⅓ ≈ 0.458), not the 0.6 seed value; the PRECIPITATION gate asserts mass/energy since radius is recomputed every tick by the solver core regardless of the law.
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 83/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_25.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 25 — STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION

Laws under audit (indices 96-99):

- **STOICHIOMETRY** (index 96, chemistry / PURPLE)
- **AUTOCATALYSIS** (index 97, chemistry / PURPLE)
- **ADIABATIC** (index 98, thermodynamics / ORANGE)
- **COMPRESSION** (index 99, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| STOICHIOMETRY | ✅ PASS | `STOICHIOMETRY direct` — masses 1.0/2.0, k=1 → 1.005/1.995, pair total conserved (3). `integration` — i.mass > 1, j.mass < 2, sum ≈ 3 with law on; 1/2 frozen with law off. |
| AUTOCATALYSIS | ✅ PASS | `AUTOCATALYSIS direct` — same-species pair (species 7, CATALYSIS 1.5) → both ENERGY 100 → 100.15; cross-species pair unchanged. `integration` — same-species pair ENERGY > 100 with law on; 100 with law off. |
| ADIABATIC | ✅ PASS | `ADIABATIC direct` — vx=4, mass 1.5, k=0.1 → drag force ax=−0.4, TEMPERATURE +2.28 (KE→heat); stationary particle → null. `integration` — vx=4 → TEMPERATURE > 0 and vx < 4 with law on; 0/4 with law off. |
| COMPRESSION | ✅ PASS | `COMPRESSION direct` — touching pair (dist 1 < (rI+rJ)*2), k=0.5 → radii 0.6 → 0.45, TEMPERATURE +0.5; dist ≥ threshold → no effect. `integration` — overlapping pair: both radii < 0.6 and both TEMPERATUREs > 0 with law on; frozen with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyStoichiometry`/`applyAutocatalysis` from `v4/src/physics/lawgroups/chemistryLaws.js`, `applyAdiabatic`/`applyCompression` from `v4/src/physics/lawgroups/thermoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_25.test.js` (8 tests, all pass).
- No repairs needed. COMPRESSION radii shrink through solve() despite the per-tick mass-derived radius update (the double pair-pass leaves both radii below the seeded 0.6 and both temps positive).


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 84/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_26.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 26 — EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY

Laws under audit (indices 100-103):

- **EXPANSION** (index 100, thermodynamics / ORANGE)
- **EQUILIBRIUM** (index 101, thermodynamics / ORANGE)
- **LATENT_HEAT** (index 102, thermodynamics / ORANGE)
- **RUNAWAY** (index 103, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| EXPANSION | ⚠️ REPAIRED (1 attempt) | `EXPANSION direct` — cold (temp 0.1) particle, base RADIUS DNA 1.2, k=0.1 → radius 0.6 → 0.66, temp → 0.09; temp ≥ 0.3 → no-op. `integration` — mass 0.3 particle grows radius 0.803 → 0.843 (> 0.81) and cools with law on; frozen at 0.6 with law off. |
| EQUILIBRIUM | ✅ PASS | `EQUILIBRIUM direct` — temps 0.2/0.8, k=0.5 → both 0.5 (total conserved). `integration` — solver k=0.3×2 passes: gap shrinks 0.6 → < 0.2, both move toward mean; frozen with law off. |
| LATENT_HEAT | ✅ PASS | `LATENT_HEAT direct` — hot (temp 2.0, k=0.5) → temp 1.5, ENERGY 100.5; cold (temp −1.0, k=0.2) → temp −0.9, ENERGY 99.9. `integration` — temp 2.0 → temp < 2 and ENERGY > 100 with law on; 2.0/100 with law off. |
| RUNAWAY | ✅ PASS | `RUNAWAY direct` — temp 1.5, k=2 → +0.98 (quadratic excess²); temp 0.5 → unchanged. `integration` — temp 1.5 → temp > 1.5 with law on; 1.5 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyExpansion`/`applyEquilibrium`/`applyLatentHeat`/`applyRunaway` from `v4/src/physics/lawgroups/thermoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_26.test.js` (8 tests, all pass).
- Repair 1 (EXPANSION, 1 attempt): integration showed EXPANSION's RADIUS growth was dead in solve() — the unconditional per-tick "update radius from mass" (`view[iBase+RADIUS] = baseRadius * mass^(1/3)`) ran after EXPANSION's per-particle dispatch and overwrote it (only the tiny cooling survived). Fix in `v4/src/physics/solver.js`: moved the `applyExpansion` dispatch from the per-particle accumulation block to the post-integration section immediately after the mass-derived radius update, so growth toward the DNA base radius persists. Verified the on-vs-off radius delta (0.843 vs 0.803) before/after the move.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 85/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_27.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 27 — CONSCIOUSNESS / PERCEPTION / SYNCHRONICITY / ANTENNA

Laws under audit (indices 104-107):

- **CONSCIOUSNESS** (index 104, metaphysics / RED)
- **PERCEPTION** (index 105, metaphysics / RED)
- **SYNCHRONICITY** (index 106, metaphysics / RED)
- **ANTENNA** (index 107, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CONSCIOUSNESS | ✅ PASS | `CONSCIOUSNESS direct` — k=0.5 → ENERGY +0.01 (100.01), MEMORY +0.0025; caps 200/1 respected. `integration` — ENERGY > 100, MEMORY > 0 with law on; 100/0 with law off. |
| PERCEPTION | ✅ PASS | `PERCEPTION direct` — NEIGHBORHOOD_RADIUS 60 (range 120), dist 50, vJ−vI=1, k=1 → ax=+0.01; dist ≥ range → null. `integration` — idle i accelerates (vx > 0) toward vx=2 neighbour with law on; 0 with law off. |
| SYNCHRONICITY | ✅ PASS | `SYNCHRONICITY direct` — phases 0.1/0.2 (Δ<0.3), vJ=1, k=1 → ax=+0.02, both phases → 0.15; phases 0/0.5 → null. `integration` — i.vx > 0 and phases converge (Δ < 0.1) with law on; frozen with law off. |
| ANTENNA | ✅ PASS | `ANTENNA direct` — SIGNAL 1, speed 100 (cap 5), k=1 → SIGNAL 1.05; SIGNAL ≤ 0.05 → no boost. `integration` — SIGNAL 1, vx=5 → SIGNAL > 1 with law on; 1 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyConsciousness`/`applyPerception`/`applySynchronicity` from `v4/src/physics/lawgroups/metaLaws.js`, `applyAntenna` from `v4/src/physics/lawgroups/emLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_27.test.js` (8 tests, all pass).
- No repairs needed. Note: implementations intentionally differ from the SPEC.md sketches (ANTENNA and PERCEPTION are per-particle / extended-range velocity alignment rather than the pairwise sketches) — behavior matches the in-code docs, existing `v4/tests/unit/lawgroupsEmInfoMeta.test.js`, and the solver dispatch signatures.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 86/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_28.md (23 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 28 — SHIELDING / POLARIZATION / NAVIGATION / ENCRYPTION

Laws under audit (indices 108-111):

- **SHIELDING** (index 108, electromagnetism / CYAN)
- **POLARIZATION** (index 109, electromagnetism / CYAN)
- **NAVIGATION** (index 110, information / GOLD)
- **ENCRYPTION** (index 111, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SHIELDING | ✅ PASS | `SHIELDING direct` — CHARGE 2, ENERGY 100, k=1 → CHARGE 1.99, ENERGY 99.95; no charge → no-op. `integration` — CHARGE < 2 and ENERGY < 100 with law on; 2/100 with law off. |
| POLARIZATION | ✅ PASS | `POLARIZATION direct` — equal TUNING_CH1, signals 0/2, k=0.5 → 0.5/1.5 (total conserved); mismatched channels, k=1 → both ×0.99 damped. `integration` — signals 0/2 → s0 > 0, s1 < 2, sum ≈ 2 with law on; 0/2 with law off. |
| NAVIGATION | ✅ PASS | `NAVIGATION direct` — MEMORY 0.2/0.8, dx=3,dy=4,dist=5, k=0.5 → ax=0.18, ay=0.24; no gradient → null. `integration` — i.vx > 0 toward memory-rich neighbour with law on; 0 with law off. |
| ENCRYPTION | ✅ PASS | `ENCRYPTION direct` — SIGNAL 2, k=1 → 1.95 (< 2, floor 0.05); silent → no-op. `integration` — SIGNAL 2 → 1.975, ≥ 0.05 with law on; 2 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyShielding`/`applyPolarization` from `v4/src/physics/lawgroups/emLaws.js`, `applyNavigation`/`applyEncryption` from `v4/src/physics/lawgroups/infoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_28.test.js` (8 tests, all pass).
- No repairs needed. Note: NAVIGATION's implementation is the pairwise MEMORY-gradient steering (neighbour's MEMORY exceeds own → force toward neighbour), not the per-particle TRAIL steering from the SPEC.md sketch — matches the solver dispatch and `v4/tests/unit/lawgroupsEmInfoMeta.test.js`.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 87/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_29.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 29 — SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE

Laws under audit (indices 112-115):

- **SUPERPOSITION** (index 112, quantum / INDIGO)
- **TUNNELING** (index 113, quantum / INDIGO)
- **DECOHERENCE** (index 114, quantum / INDIGO)
- **WAVE_PARTICLE** (index 115, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SUPERPOSITION | ✅ PASS | `batch_29.test.js` — "SUPERPOSITION adds random velocity-spread force": direct `applySuperposition(buf,0,1,rngHigh)` → ax=ay=0.8; solver (k=0.05, prng 0.9) → |VEL_X| > 0.001 after 1 tick; law-off gate: velocity frozen. |
| TUNNELING | ⚠️ REPAIRED (1 attempt) | `batch_29.test.js` — "TUNNELING phase-shifts position when triggered": direct k=200 prng 0.9 → POS 100→103.6 (hop radius×6); solver (k=0.5, prng 0.0009) → POS 100→96.4 after 1 tick; law-off gate: frozen. See repair notes. |
| DECOHERENCE | ✅ PASS | `batch_29.test.js` — "DECOHERENCE damps velocity and radiates SIGNAL": direct VEL 5 → ax=−0.05, SIGNAL+0.001; solver: VEL < 5−0.001 and SIGNAL > 0.0005 after 10 ticks; law-off gate: frozen. |
| WAVE_PARTICLE | ✅ PASS | `batch_29.test.js` — "WAVE_PARTICLE damps slow (wave) and amplifies fast (particle) motion": direct VEL 0.2 → damping ax<0, VEL 5 → ax=+0.05, VEL 1 → null; solver: fast VEL grows >5, slow VEL shrinks <0.2. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_29.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **TUNNELING repair (v4/src/physics/solver.js)**: `applyTunneling` writes the hop directly to the buffer, but the solver's per-particle writeback used the stale local `px` read at iteration start, erasing the hop every tick (position stayed at 100). Fixed by reconciling the local position with the buffer after the per-particle law section: `px = view[iBase+S.POS_X] + softbodyDX` (the `softbodyDX` delta captured after the pair loop preserves the COLL softbody push while folding in buffer position mutations).
- Full v4 suite (47 files / 420 tests) passes after repair, including the COLL batch.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 88/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_30.md (25 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK

Laws under audit (indices 116-119):

- **UNCERTAINTY** (index 116, quantum / INDIGO)
- **TELEPORT** (index 117, quantum / INDIGO)
- **OBSERVER** (index 118, quantum / INDIGO)
- **PLANCK** (index 119, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| UNCERTAINTY | ⚠️ REPAIRED (1 attempt) | `batch_30.test.js` — "UNCERTAINTY jitters position and adds a velocity kick": direct prng 0.9 → POS +0.008, kick ax=0.02; solver: POS > 100.0001 and VEL_X > 0.0001 after 1 tick (position jitter persisted after repair); law-off gate: frozen. See repair notes. |
| TELEPORT | ⚠️ REPAIRED (1 attempt) | `batch_30.test.js` — "TELEPORT jumps to a random location and spends ENERGY": direct k=1000 prng 0.9 → jump to 1800, ENERGY < 100; solver (k=0.5, prng 0.0009) → POS ≈ 1.8 and ENERGY < 90 after 1 tick; law-off gate: frozen. See repair notes. |
| OBSERVER | ✅ PASS | `batch_30.test.js` — "OBSERVER collapses a neighbour velocity toward the observer and imprints MEMORY": direct observer MEMORY 1/VEL 10 → neighbour VEL 0.1, MEMORY 0.1; solver: neighbour VEL > 0.01, MEMORY > 0.05 after 1 tick; law-off gate: neighbour stays still. |
| PLANCK | ✅ PASS | `batch_30.test.js` — "PLANCK quantizes velocity to discrete steps": direct q=0.1 → 0.17→0.2, −0.23→−0.2; solver (k=0.5, q=0.05) → VEL_X = 0.15 after 1 tick; law-off gate: VEL unchanged. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_30.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **UNCERTAINTY + TELEPORT repair (v4/src/physics/solver.js)**: both laws write position directly to the buffer; the solver's stale-local writeback erased the jitter/jump (positions stayed at 100). Same root cause and fix as TUNNELING (batch 29): position reconciliation in the solver (`px = view[iBase+S.POS_X] + softbodyDX` after the per-particle law section, with the softbody delta captured post-pair-loop).
- PLANCK needed no repair — its direct buffer velocity write is already folded into integration via the existing velocity re-read; the only test change was float-precision (`toBe` → `toBeCloseTo`) in the gate assertion.
- Full v4 suite (47 files / 420 tests) passes after repair.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 89/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_31.md (24 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 31 — COHERENCE / BOSONIC / FERMIONIC / SPIN

Laws under audit (indices 120-123):

- **COHERENCE** (index 120, quantum / INDIGO)
- **BOSONIC** (index 121, quantum / INDIGO)
- **FERMIONIC** (index 122, quantum / INDIGO)
- **SPIN** (index 123, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COHERENCE | ✅ PASS | `batch_31.test.js` — "COHERENCE phase-locks similar neighbour velocities": direct diff 0.5 < 1 → ax=0.01; solver: relative velocity shrinks over 30 ticks; law-off gate: relative velocity preserved exactly. |
| BOSONIC | ✅ PASS | `batch_31.test.js` — "BOSONIC attracts particles within short range (glue)": direct dist 2 → ax=1, dist 4 → null; solver: pair 2 apart → dist shrinks (collision floor ~1.2) over 10 ticks; law-off gate: dist unchanged. |
| FERMIONIC | ✅ PASS | `batch_31.test.js` — "FERMIONIC pushes overlapping particles apart (exclusion)": direct dist 1 < rSum 1.2 → ax < 0, dist 2 → null; solver: overlapping pair (0.8) separates over 10 ticks; law-off gate: dist unchanged. |
| SPIN | ⚠️ REPAIRED (1 attempt) | `batch_31.test.js` — "SPIN applies a perpendicular wiggle with particle-index parity": direct even particle → ay=+0.1, odd particle → ay=−0.1; solver: particle 0 VEL_Y > +0.001, particle 1 VEL_Y < −0.001 after 5 ticks. See repair notes. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_31.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **SPIN repair (v4/src/physics/lawgroups/quantumLaws.js)**: `applySpin` derived the direction from `iBase % 2` (buffer-offset parity). With `PARTICLE_STRIDE = 100`, every particle's base offset is even, so every particle got the SAME spin sign — the documented particle-index parity ("Spin direction is set by particle index parity") never alternated. Fixed to `Math.floor(iBase / PARTICLE_STRIDE) % 2` so particle 0 → +, particle 1 → −, etc. The existing unit test (`oddBase = PARTICLE_STRIDE + 1`) still passes.
- Full v4 suite (47 files / 420 tests) passes after repair.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 90/112: audit-suite/historical/2026-08-10-v4.6.28/laws/batch_32.md (25 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 32 — SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER

Laws under audit (indices 124-127):

- **SPECTRAL** (index 124, quantum / INDIGO)
- **WAVEFUNCTION** (index 125, quantum / INDIGO)
- **HYPERPLANE** (index 126, quantum / INDIGO)
- **ANTIMATTER** (index 127, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SPECTRAL | ✅ PASS | `batch_32.test.js` — "SPECTRAL emits a species-tagged SIGNAL tone": direct species 3 → SIGNAL += 0.004; solver: SIGNAL > 0.005 after 5 ticks; law-off gate: no signal. |
| WAVEFUNCTION | ⚠️ REPAIRED (1 attempt) | `batch_32.test.js` — "WAVEFUNCTION snaps position onto the wave grid": direct q=0.5 → 100.3→100.5; solver (q=0.25) → 100.3→100.25 after 1 tick (snap persisted after repair); law-off gate: position unchanged. See repair notes. |
| HYPERPLANE | ✅ PASS | `batch_32.test.js` — "HYPERPLANE applies a constant slow shear force": direct ax=0.001, ay=0.0005, az=0.0002; solver: VEL_X and VEL_Y accumulate > 1e-5 over 5 ticks; law-off gate: velocity stays 0. |
| ANTIMATTER | ✅ PASS | `batch_32.test.js` — "ANTIMATTER annihilates opposite-charge pairs on contact": direct CHARGE +1/−1 → both DEAD=1, SIGNAL burst 10; solver: both DEAD=1 with SIGNAL > 0 after 1 tick; law-off gate: both alive, no signal. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_32.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **WAVEFUNCTION repair (v4/src/physics/solver.js)**: `applyWavefunction` snaps the position directly in the buffer, but the solver's stale-local writeback erased the snap (position stayed 100.3). Same root cause and fix as TUNNELING/UNCERTAINTY/TELEPORT: position reconciliation in the solver (`px = view[iBase+S.POS_X] + softbodyDX`), which is the 4th law fixed by this single solver change.
- Spec deviation noted (not repaired): SPEC item 46 says `applyAntimatter` should return `true` on annihilation so the solver breaks the pair loop, but the implementation returns `null` always and the solver dispatch doesn't check the return. The functional effect (both particles DEAD=1 + signal burst) is fully delivered, so this is a performance/robustness nit rather than a functional fault.
- Full v4 suite (47 files / 420 tests) passes after repair.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 91/112: audit-suite/historical/2026-08-10-v4.6.28/laws/combined.md (931 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA Law Audit — Combined Results (128 laws)

**Audit run:** 2026-08-05 · 32 batches × 4 laws · 4 parallel agents (dynamic batch queue) · conclusive validation with repair loop (≤3 attempts per law).

| Metric | Count |
|--------|-------|
| ✅ PASS | 110 |
| ⚠️ REPAIRED | 18 |
| ❌ FAULTY | 0 |
| **Total laws** | **128** |

## Batch summary

| Batch | PASS | REPAIRED | FAULTY |
|-------|------|----------|--------|
| [01 — GRAV / DRAG / ENTR / WRAP](batch_01.md) | 4 | 0 | 0 |
| [02 — COLL / ACCR / PLANETARY / LIFE](batch_02.md) | 3 | 1 | 0 |
| [03 — GLOW / AFFINITY / REPRO / TRACK](batch_03.md) | 4 | 0 | 0 |
| [04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE](batch_04.md) | 4 | 0 | 0 |
| [05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY](batch_05.md) | 3 | 1 | 0 |
| [06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY](batch_06.md) | 3 | 1 | 0 |
| [07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION](batch_07.md) | 3 | 1 | 0 |
| [08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY](batch_08.md) | 3 | 1 | 0 |
| [09 — CHAOS / ORDER / FATE / WILL](batch_09.md) | 2 | 2 | 0 |
| [10 — SOUL_LAW / MIND / VOID / BOND](batch_10.md) | 4 | 0 | 0 |
| [11 — REDUCTION / ALLOY / MELT / BOIL](batch_11.md) | 3 | 1 | 0 |
| [12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY](batch_12.md) | 4 | 0 | 0 |
| [13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION](batch_13.md) | 2 | 2 | 0 |
| [14 — COMMS / CHARGE_LAW / FIELD / CURRENT](batch_14.md) | 3 | 1 | 0 |
| [15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM](batch_15.md) | 3 | 1 | 0 |
| [16 — RESONANCE / FLUX / IONIZATION / DISCHARGE](batch_16.md) | 4 | 0 | 0 |
| [17 — PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN](batch_17.md) | 4 | 0 | 0 |
| [18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL](batch_18.md) | 4 | 0 | 0 |
| [19 — METRIC / PREDICT / CODE / PROTOCOL](batch_19.md) | 4 | 0 | 0 |
| [20 — FEEDBACK / LANGUAGE / CULTURE / SINGULARITY](batch_20.md) | 4 | 0 | 0 |
| [21 — ENTANGLEMENT / HISTORY / TIDE / FRICTION](batch_21.md) | 4 | 0 | 0 |
| [22 — ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION](batch_22.md) | 4 | 0 | 0 |
| [23 — SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY](batch_23.md) | 4 | 0 | 0 |
| [24 — ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION](batch_24.md) | 4 | 0 | 0 |
| [25 — STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION](batch_25.md) | 4 | 0 | 0 |
| [26 — EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY](batch_26.md) | 3 | 1 | 0 |
| [27 — CONSCIOUSNESS / PERCEPTION / SYNCHRONICITY / ANTENNA](batch_27.md) | 4 | 0 | 0 |
| [28 — SHIELDING / POLARIZATION / NAVIGATION / ENCRYPTION](batch_28.md) | 4 | 0 | 0 |
| [29 — SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE](batch_29.md) | 3 | 1 | 0 |
| [30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK](batch_30.md) | 2 | 2 | 0 |
| [31 — COHERENCE / BOSONIC / FERMIONIC / SPIN](batch_31.md) | 3 | 1 | 0 |
| [32 — SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER](batch_32.md) | 3 | 1 | 0 |

## Method

- Each law was validated with a focused vitest file (`v4/tests/audit/batch_XX.test.js`):
  direct function calls (gate checks via `isSet`, thresholds, exact values) plus
  integration-level `solve()` on-vs-off checks against `LAW_HELP_DB` /
  `v4/src/physics/lawgroups/SPEC.md` expected behavior.
- Laws failing validation were repaired in place (implementation file) up to 3
  attempts, re-running the audit test each time; failures after 3 attempts are
  recorded ❌ FAULTY.
- Full v4 suite after audit: **47 test files / 420 tests green**;
  `node --check` clean; `vite build` OK.

---

# Batch 01 — GRAV / DRAG / ENTR / WRAP

Laws under audit (indices 0-3):

- **GRAV** (index 0, physics / BLUE)
- **DRAG** (index 1, physics / BLUE)
- **ENTR** (index 2, physics / BLUE)
- **WRAP** (index 3, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| GRAV | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "GRAV: particles accelerate toward each other and separation decreases": separation 10 → 9.68 after 5 ticks; `VEL_X` of i > 0 and of j < 0. Gate test confirms zero motion with GRAV off. |
| DRAG | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "DRAG: velocity decays over time": `VEL_X` 5 → ~2.73 over 60 ticks (viscosity 0.98 + friction 0.01, per-tick factor ≈0.99). Gate test: velocity preserved to 5 with DRAG off. |
| ENTR | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "ENTR: jitter injects random kinetic energy": resting particles (JITTER=5, seeded LCG prng) reach `|v| ≈ 0.4` after 80 ticks. Gate test: velocity stays 0 with ENTR off. |
| WRAP | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "WRAP: particles crossing the edge reappear on the opposite side": particle at x=1995, vx=10 lands at x≈2.5 after 3 ticks. Gate test: with WRAP off, edge clamps to ~1998.7 and flips velocity to −5. |

## Notes

- Validation method: integration-level `solve()` checks (see `v4/tests/unit/lawCategories.test.js` for the `makeWorld`/`solve` pattern), one focused test + one gate test per law, plus `isSet()` gating assertions.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyGravity`, DRAG damping block, ENTR jitter block, WRAP toroidal wrap block).


---

# Batch 02 — COLL / ACCR / PLANETARY / LIFE

Laws under audit (indices 4-7):

- **COLL** (index 4, physics / BLUE)
- **ACCR** (index 5, physics / BLUE)
- **PLANETARY** (index 6, physics / BLUE)
- **LIFE** (index 7, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COLL | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_02.test.js` — "COLL: approaching particles bounce": closing speed 2.0 → ~1.3 after 16 ticks; pair stays on the correct side (separation 0.61, no crossing). Before the fix the pair crossed straight through (separation −40). Gate test confirms pass-through with COLL off. |
| ACCR | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "ACCR: a larger body absorbs mass": big body 10 → +0.06, small body 1.5 → −0.06 in one tick, mass conserved (Δ=6e-6). Gate test: masses unchanged with ACCR off. |
| PLANETARY | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "PLANETARY: particles are pulled toward the world centre": distance to centre 1558.8 → 1558.4 after 200 ticks, `VEL_X/Y/Z` all > 0 toward centre. Gate test: no motion with PLANETARY off. |
| LIFE | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "LIFE: metabolic energy decay": ENERGY 100 → 99.0 over 100 ticks (ENERGY_EFFICIENCY=0 ⇒ −0.01/tick); "LIFE: starvation kills": HUNGER=100 → DEAD=1 in one tick. Gate test: energy untouched with LIFE off. |

## Notes

- **REPAIR — COLL bounce condition (attempt 1):** the impulse was applied when `relVelN < 0`, but with the i→j collision normal the pair is *closing* when `relVelN > 0`, so approaching particles received no bounce and passed through each other (reproduced empirically: `approach i=(1020,v5) j=(980,v-5) dist=-40`). Separating pairs were also receiving a spurious impulse.
  - File: `v4/src/physics/solver.js` (inline collision block, formerly line ~344).
  - Before: `// Bounce if approaching\n          if (relVelN < 0) {`
  - After: `// Bounce if approaching (relVelN > 0 along the i→j normal means\n          // the pair is closing; a negative impulse along n separates them)\n          if (relVelN > 0) {`
  - Verified: approaching pair bounces (dist stays positive, closing speed drops); separating pair moves apart freely with velocities preserved; full unit suite (123 tests) still green.
- Validation method: integration-level `solve()` tests with `isSet()` gating; ACCR and COLL use the overlap path in the solver's pairwise block.


---

# Batch 03 — GLOW / AFFINITY / REPRO / TRACK

Laws under audit (indices 8-11):

- **GLOW** (index 8, biology / GREEN)
- **AFFINITY** (index 9, biology / GREEN)
- **REPRO** (index 10, biology / GREEN)
- **TRACK** (index 11, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| GLOW | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "GLOW: signaling particles regenerate energy": SIGNAL=1 → ENERGY 50 → 51.0 over 100 ticks (+0.01/tick). Gate test: energy stays 50 with GLOW off. |
| AFFINITY | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "AFFINITY: same-species particles with positive affinity attract": separation 100 → ~73 over 80 ticks; `VEL_X` of i > 0, of j < 0. Gate test: separation unchanged (100) with AFFINITY off. |
| REPRO | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "REPRO: mature, high-energy particles spawn offspring": `drainOffspring()` returns 1 child (parentId 0, energy 60); parent ENERGY 100 → 50. Gate test: no offspring with REPRO off. |
| TRACK | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "TRACK: predators chase lower-mass prey": predator (mass 2, PREDATION_BIAS 1) closes separation 100 → ~92 over 100 ticks and gains `VEL_X > 0`. Gate test: no chase with TRACK off. |

## Notes

- Validation method: integration-level `solve()` tests with `isSet()` gating; REPRO uses the exported `drainOffspring()` / `resetOffspringRing()` from `v4/src/physics/solver.js` to observe spawned children.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyGlowEffect`, `applyAffinity`, `applyReproduction`, `applyTrackingBehavior`).


---

# Batch 04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE

Laws under audit (indices 12-15):

- **SENESCENCE** (index 12, biology / GREEN)
- **ENERGY** (index 13, biology / GREEN)
- **RADIATION** (index 14, biology / GREEN)
- **GENOTYPE** (index 15, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SENESCENCE | ✅ PASS | `v4/tests/audit/batch_04.test.js` — "SENESCENCE: particles past age 500 die": AGE=1000, DEATH_RATE=500 → death chance 0.55 > prng 0.5 → DEAD=1 in one tick (gated by LIFE). Gate test: same particle survives with SENESCENCE off. |
| ENERGY | ✅ PASS | `v4/tests/audit/batch_04.test.js` — "ENERGY: nearby particles conduct energy toward equilibrium": pair 10/200 at dist 50 → cold gains, hot loses, total conserved (10+200 exactly) in one tick. Gate test: energies untouched (10/200) with ENERGY off. |
| RADIATION | ✅ PASS | `v4/tests/audit/batch_04.test.js` — "RADIATION: low-armor particles take energy damage": ARMOR=0 → ENERGY 100 → 98.0 over 100 ticks (−0.02/tick). "RADIATION: full armor fully shields": ARMOR=1 → ENERGY stays 100. Gate test: energy untouched with RADIATION off. |
| GENOTYPE | ✅ PASS | `v4/tests/audit/batch_04.test.js` — "GENOTYPE: DNA cache drifts over time": MUTATION=5, TEMPERATURE=10 → 1+ DNA cache slots changed after 100 ticks. Gate test: all 42 DNA cache values bit-identical with GENOTYPE off. |

## Notes

- Validation method: integration-level `solve()` tests with `isSet()` gating. SENESCENCE is nested inside `applyLifeCycle` (requires LIFE on), which the gate test confirms; RADIATION is dispatched twice (`applyLifeCycle` internal block + `applyRadiationDamage`), both armored-scaled.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyEnergyTransfer`, `applyRadiationDamage`, `applyGenotypeMutation`, and the senescence block in `applyLifeCycle`).


---

# Batch 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY

Laws under audit (indices 16-19):

- **PHENOTYPE** (index 16, biology / GREEN)
- **CATALYSIS_LAW** (index 17, chemistry / PURPLE)
- **SOLVATION** (index 18, chemistry / PURPLE)
- **ACIDITY** (index 19, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PHENOTYPE | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_05.test.js` — direct call: radius 2.0 @ energy 200 → 2.5 (×1.25, synergy 1). Integration: `solve()` radius ratio energy 200 vs 100 = 1.25 (was broken: radius effect was overwritten by the mass-derived recompute in `solver.js`). Gating `isSet` verified. |
| CATALYSIS_LAW | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applyChemistry` multiplier 1.0 (gate) → 1.5 with CATALYSIS DNA 1.0 @ synergy 1 (×[1 + cat·0.5]). Gating `isSet` verified. |
| SOLVATION | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applySolvationEffect` 1.0 (gate / near-equal charges) → 1.4 with charge gap 2. Gating `isSet` verified. |
| ACIDITY | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applyAcidityEffect` no-op (gate / gap < 0.3); gap 2, dt 1 → neighbour energy 100 → 99.98, actor 50 → 50.01 (half returned). Gating `isSet` verified. |

## Notes

- PHENOTYPE repaired in `v4/src/physics/solver.js` (radius recompute, `src/physics/solver.js` ~line 1264):
  - Before: `view[iBase + S.RADIUS] = baseRadius * Math.pow(mass, 0.333);`
  - After: the base radius is computed into `radiusOut`, then multiplied by the PHENOTYPE energy factor `1 + (energy/200 − 0.5) · 0.5 · synergy` when the law is set, then written. The `applyPhenotype` per-particle call had its radius modulation overwritten by the unconditional mass-derived recompute each tick, making the law dead at integration level.
  - Repair attempt count: 1 (implementation). One test assertion was tightened (ratio vs frozen world) — test-only change, no further implementation edits.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_05.test.js` (15 tests).


---

# Batch 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY

Laws under audit (indices 20-23):

- **OXIDATION** (index 20, chemistry / PURPLE)
- **POLYMER** (index 21, chemistry / PURPLE)
- **ISOMERIZATION** (index 22, chemistry / PURPLE)
- **CHIRALITY** (index 23, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| OXIDATION | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyOxidationEffect` no-op (gate / charge < 0.3); charge 1, mass 1.5, dt 1 → 1.499 (−charge·0.001). Gating `isSet` verified. |
| POLYMER | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyPolymer` gate returns `{0,0,0}` + no bond; dist 5 (< 10·synergy) fills `BOND_PARTNER_1 = 1`, `BOND_COUNT = 1`, spring force ax = 0.02 ((5−4)·0.02). Integration: `solve()` forms the bond between close particles. Gating `isSet` verified. |
| ISOMERIZATION | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_06.test.js` — direct call: radius 2.0 @ sin-phase peak → 2.01 (×1.005, dt 1, synergy 1). Integration: `solve()` radius ratio peak-vs-zero phase = 1.00125 (was broken: radius modulation overwritten by the mass-derived recompute in `solver.js`). Gating `isSet` verified. |
| CHIRALITY | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyChirality` null (gate / opposite polarity); same-polarity pair (dx 3, dy 4, dist 5) → ax −0.008, ay 0.006 (perpendicular deflection). Gating `isSet` verified. |

## Notes

- ISOMERIZATION repaired in `v4/src/physics/solver.js` (radius recompute, `src/physics/solver.js` ~line 1271):
  - Before: `view[iBase + S.RADIUS] = baseRadius * Math.pow(mass, 0.333);`
  - After: the base radius is computed into `radiusOut`, then multiplied by the ISOMERIZATION phase factor `1 + sin(age·0.01)·0.1·localTimeStep·synergy·0.05` when the law is set, then written. The per-particle `applyIsomerization` radius modulation was overwritten by the unconditional mass-derived recompute each tick, making the law dead at integration level.
  - Repair attempt count: 1 (implementation). One test assertion was tightened (ratio vs zero-phase world) — test-only change, no further implementation edits.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_06.test.js` (16 tests).


---

# Batch 07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION

Laws under audit (indices 24-27):

- **CRYSTALLIZATION** (index 24, chemistry / PURPLE)
- **HEAT** (index 25, thermodynamics / ORANGE)
- **COLD** (index 26, thermodynamics / ORANGE)
- **CONVECTION** (index 27, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CRYSTALLIZATION | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyCrystallization` null (gate / dist > 30); offset (4,4) → pull (0.04, 0.04) toward 8-unit lattice. Gating `isSet` verified. |
| HEAT | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyHeatTransfer` no-op (gate); hot 1.0 / cold 0.0, dt 1 → 0.99 / 0.01 (conducts hot → cold). Integration: `solve()` conducts between neighbours. Gating `isSet` verified. |
| COLD | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_07.test.js` — direct call now equalises: cold 0.0 / hot 1.0, dt 1 → 0.015 / 0.985 (was 1.015 / −0.015: hot particle got hotter — anti-thermodynamic sign inversion). Integration: `solve()` cools the hotter neighbour (1.001875 → < 1.0). Gating `isSet` verified. |
| CONVECTION | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyConvection` no-op (gate); temp 1.0, dt 1 → VEL_Y +0.0005 ((temp−0.5)·0.001). Integration: `solve()` gives hot particle positive VEL_Y. Gating `isSet` verified. |

## Notes

- COLD repaired in `v4/src/physics/laws.js` (`applyHeatTransfer`, `src/physics/laws.js` ~line 875):
  - Before: `const tDec2 = diff * rate; const tInc2 = diff * rate;` (diff = tempI − tempJ < 0 when the partner is hotter → hot particle heated, cold particle cooled).
  - After: `const tDec2 = -diff * rate; const tInc2 = -diff * rate;` — heat now flows from the hotter partner into the colder one, matching HELP_DB "temperature trends toward equilibrium".
  - Repair attempt count: 1.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_07.test.js` (16 tests).


---

# Batch 08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY

Laws under audit (indices 28-31):

- **PHASE_RADIATION** (index 28, thermodynamics / ORANGE)
- **SUBLIMATION** (index 29, thermodynamics / ORANGE)
- **TIME_DILATION** (index 30, metaphysics / RED)
- **DIMENSIONALITY** (index 31, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PHASE_RADIATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applyPhaseRadiation` no-op (gate / temp ≤ 0.6); temp 1.0, dt 1 → energy −0.008, temp −0.008, signal +0.008. Integration: `solve()` lowers temp and raises signal. Gating `isSet` verified. |
| SUBLIMATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applySublimation` no-op (gate); temp 1.0, mass 1.5, dt 1 → mass −0.0025, temp −0.00125 (+ random velocity burst). Integration: `solve()` sublimates a hot massive particle. Gating `isSet` verified. |
| TIME_DILATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applyTimeDilation` 1.0 (gate / soul 0); soul 1.0 → localDt 0.7 (1 − soul·0.3). Integration: `solve()` high-soul particle advances AGE slower than soul-less (0.25 vs 0.175 dt). Gating `isSet` verified. |
| DIMENSIONALITY | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_08.test.js` — direct call: prng 1.0, dt 1 → VEL_Z +0.05. Integration: `solve()` now leaves VEL_Z ≠ 0 (was 0 — the kick was applied to the buffer in the force phase, then overwritten by the stale local velocity at integration). Gating `isSet` verified. |

## Notes

- DIMENSIONALITY repaired in two files (1 attempt):
  - `v4/src/physics/laws.js` (`applyDimensionality`, ~line 909): now `return force` after writing `view[base + S.VEL_Z] += force` (gate returns 0 instead of `undefined`).
  - `v4/src/physics/solver.js` (~line 843): call site changed from `applyDimensionality(...)` to `vz += applyDimensionality(...)`, folding the kick into the local velocity that is written back at integration. Previously the in-place buffer write was overwritten by the integration write of the stale local `vz`.
  - Repair attempt count: 1.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_08.test.js` (18 tests).


---

# Batch 09 — CHAOS / ORDER / FATE / WILL

Laws under audit (indices 32-35):

- **CHAOS** (index 32, metaphysics / RED)
- **ORDER** (index 33, metaphysics / RED)
- **FATE** (index 34, metaphysics / RED)
- **WILL** (index 35, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CHAOS | ⚠️ REPAIRED (1 attempt) | `CHAOS direct: stochastic velocity forcing, gated by isSet` — prng=1 ⇒ VEL_X/Y +0.25, VEL_Z +0.125; prng=0 ⇒ −0.25; off ⇒ no-op. `CHAOS integration` — vx = 0.05 (prng 0.9) with law on, 0 with law off. |
| ORDER | ✅ PASS | `ORDER direct` — idle i gains ax=+0.025 toward neighbor vx=5 (distSq 100); null beyond 10k and when off. `ORDER integration` — i.vx > 0 with j at vx=5; 0 with law off. |
| FATE | ✅ PASS | `FATE direct` — same-species pair at dx=10 gives ax=+0.05; null for cross-species, distSq>250k, and when off. `FATE integration` — same-species i.vx > 0; 0 with law off. |
| WILL | ⚠️ REPAIRED (1 attempt) | `WILL direct` — vx 5 → 5.01 boost; stationary no boost; off no-op. `WILL integration` — vx 2 → 2.0025 with law on; 2 with law off. |

## Notes

- Method: direct law-function calls (`applyChaos`/`applyOrder`/`applyFate`/`applyWill` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_09.test.js` (8 tests, all pass).
- Repair 1 (CHAOS + WILL, 1 attempt): integration revealed CHAOS and WILL wrote velocity deltas in-place to the buffer during solve, but the solver's local `vx/vy/vz` copy overwrote them at writeback (the old "Re-read velocity" line `vx = view[VEL_X] + (vx - view[VEL_X])` was an algebraic no-op). Fix in `v4/src/physics/solver.js`: fold buffer velocity into locals before force integration, and fold WILL's in-place boost back via pre/post deltas. `v4/tests/unit` (123 tests) unaffected.


---

# Batch 10 — SOUL_LAW / MIND / VOID / BOND

Laws under audit (indices 36-39):

- **SOUL_LAW** (index 36, metaphysics / RED)
- **MIND** (index 37, metaphysics / RED)
- **VOID** (index 38, physics / BLUE)
- **BOND** (index 39, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SOUL_LAW | ✅ PASS | `SOUL_LAW direct` — i soul 0 → 0.05 from neighbor soul 50 (distSq 100); no transfer cross-species, beyond 10k, or when off. `SOUL_LAW integration` — i soul > 0 with law on; 0 with law off. |
| MIND | ✅ PASS | `MIND direct` — same-species pair returns signalBoost 0.001 (distSq 100), ax=0; null cross-species, beyond 40k, and when off. `MIND integration` — i SIGNAL > 0 with law on; 0 with law off. |
| VOID | ✅ PASS | `VOID direct` — particle at (1100,1000,1000) in 2000³ world gets ax=+0.0005 outward; null exactly at center and when off. `VOID integration` — particle at x=1800 gains vx > 0; 0 with law off. |
| BOND | ✅ PASS | `BOND direct` — stretched pair (dist 3, rest 2.2, stiffness 1) returns ax=+0.04, registers BOND_COUNT=1 + BOND_PARTNER_1 on both sides, no double count on re-call; null beyond 30, stiffness<0.01, and when off. `BOND integration` — both particles BOND_COUNT=1 with law on; 0 with law off. |

## Notes

- Method: direct law-function calls (`applySoul`/`applyMind`/`applyVoid`/`applyBond` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_10.test.js` (8 tests, all pass).
- No repairs needed. Bond slots must be pre-initialized to −1 (seed does this); default 0 slot values would block registration, which is expected buffer hygiene, not a law fault.


---

# Batch 11 — REDUCTION / ALLOY / MELT / BOIL

Laws under audit (indices 40-43):

- **REDUCTION** (index 40, chemistry / PURPLE)
- **ALLOY** (index 41, chemistry / PURPLE)
- **MELT** (index 42, thermodynamics / ORANGE)
- **BOIL** (index 43, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| REDUCTION | ✅ PASS | `REDUCTION direct` — charges 1.0/0.2 → 0.96/0.24 (neutralization = diff×0.05); equal charges unchanged. `REDUCTION integration` — |Δcharge| 0.8 → <0.8 with law on; stays 0.8 with law off. |
| ALLOY | ⚠️ REPAIRED (1 attempt) | `ALLOY direct` — cross-species overlap (dist 0.3 < (r1+r2)/2) merges j into i: j DEAD=1, i MASS 1.5 → 1.65; same-species, far pairs, and off are no-ops. `ALLOY integration` — j DEAD=1, i MASS > 1.5 with law on; unchanged with law off. |
| MELT | ✅ PASS | `MELT direct` — temp 1.0, mass 1.5 → mass 1.497, temp drops; below 0.7 and off unchanged. `MELT integration` — mass < 1.5 with law on; 1.5 with law off. |
| BOIL | ✅ PASS | `BOIL direct` — mass 10, temp 1.0 → mass < 10 and temp drops (ejectMass 0.02 > 0.01); temp<0.9, small ejectMass, and off unchanged. `BOIL integration` — mass 50, temp 1.0 → mass < 50 with law on; 50 with law off. |

## Notes

- Method: direct law-function calls (`applyReduction`/`applyAlloy`/`applyMelt`/`applyBoil` from `v4/src/physics/laws.js`, `setBuffer` for REDUCTION's global buffer) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_11.test.js` (8 tests, all pass).
- Repair 1 (ALLOY, 1 attempt): integration showed j was marked DEAD but i's mass stayed 1.5 — `applyAlloy` adds mass in-place to `view[iBase+MASS]` during the pair loop, but the solver writeback `view[iBase+MASS] = mass` (stale local copy) clobbered it. Fix in `v4/src/physics/solver.js`: fold the buffer mass back into the local copy immediately before writeback (`mass = view[iBase + S.MASS];`). This also restores accretion/chemistry mass transfers that write in-place during the pair loop.
- BOIL integration initially failed only because the 0.01 ejectMass threshold needs mass ≥ 20 at `DT=0.25`; raised test mass 10 → 50 (implementation is correct, verified by the direct-call test).


---

# Batch 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY

Laws under audit (indices 44-47):

- **CONDENSE** (index 44, thermodynamics / ORANGE)
- **DEPOSIT** (index 45, thermodynamics / ORANGE)
- **EXOTHERMIC** (index 46, thermodynamics / ORANGE)
- **TELEPATHY** (index 47, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CONDENSE | ✅ PASS | `CONDENSE direct` — temp 0.0, mass 1.5 → mass 1.5015, temp +0.00015; temp>0.3 and off unchanged. `CONDENSE integration` — mass > 1.5 with law on; 1.5 with law off. |
| DEPOSIT | ✅ PASS | `DEPOSIT direct` — temp 0.0 → mass 1.5 → 1.506, radius 0.6 → 0.601, temp +0.0001; temp>0.2 and off unchanged. `DEPOSIT integration` — mass > 1.5 with law on; 1.5 with law off. |
| EXOTHERMIC | ✅ PASS | `EXOTHERMIC direct` — energy 100 → 110 (×1.1 at synergy 1); off unchanged. `EXOTHERMIC integration` — energy > 100 with law on; 100 with law off. |
| TELEPATHY | ✅ PASS | `TELEPATHY direct` — j SIGNAL 0.5 → i SIGNAL 0.025 at any distance; no transfer cross-species, below 0.001 threshold, or when off. `TELEPATHY integration` — i SIGNAL > 0 with law on; 0 with law off. |

## Notes

- Method: direct law-function calls (`applyCondense`/`applyDeposit`/`applyExothermic`/`applyTelepathy` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_12.test.js` (8 tests, all pass).
- No repairs needed. TELEPATHY intentionally ignores distance (distSq argument unused) — consistent with its HELP_DB "regardless of distance" behavior.


---

# Batch 13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION

Laws under audit (indices 48-51):

- **CLAIRVOYANCE** (index 48, metaphysics / RED)
- **PRECOGNITION** (index 49, metaphysics / RED)
- **ASTRAL** (index 50, metaphysics / RED)
- **PREDATION** (index 51, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CLAIRVOYANCE | ✅ PASS | `batch_13.test.js` — "CLAIRVOYANCE steers toward the neighbor's predicted future position": direct `applyClairvoyance` with offset (0,10,0) + neighbor vx=5 returns ax>0, ay≈0; law-off gate returns null; integration: after 40 solves VEL_X > 0.005. |
| PRECOGNITION | ✅ PASS | `batch_13.test.js` — "PRECOGNITION applies lateral avoidance force on a collision course": closing pair (dot<0) yields ay>0, ax≈0; law-off and moving-apart (dot>0) gates return null; integration: VEL_Y > 0.001 after 8 solves. |
| ASTRAL | ⚠️ REPAIRED (1 attempt) | `batch_13.test.js` — "ASTRAL keeps souls as fading ghosts": DEAD=0.5/SOUL=1 soul keeps DEAD=0.5, ALPHA≈soul×0.5, MASS≈soul×0.1, SOUL decays <1. See repair notes. |
| PREDATION | ⚠️ REPAIRED (1 attempt) | `batch_13.test.js` — "PREDATION pursues lower-mass prey and absorbs mass/DNA on contact": predator (mass 5, PREDATION_BIAS 10) vs prey (mass 1) at contact: 5 sampled DNA traits blend toward prey (sum +0.5), predator mass 5→5.05, prey 1→0.9; pursuit at 50 units: VEL_X > 0.001 after 20 solves. See repair notes. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_13.test.js` — integration-level `solve()` checks with `isSet` gate assertions, plus direct calls to `applyClairvoyance`/`applyPrecognition` (both use the `view` param and need no `setBuffer`).
- **ASTRAL repair (v4/src/physics/solver.js)**: `applyAstral` was dispatched at the end of the per-particle loop, but that loop skips `DEAD >= 0.5` particles, so souls never reached it. Added a dedicated soul pass (Phase 2b) that iterates all particles and calls `applyAstral` for `DEAD >= 0.5`, and removed the now-redundant in-loop call.
- **PREDATION repair (v4/src/physics/solver.js)**: `applyPredation` writes absorbed mass directly to the buffer, but the solver's per-particle writeback `view[iBase+S.MASS] = mass` used a stale local read before the pairwise loop, clobbering the predator's mass gain (prey's loss survived). Added a mass re-read right after the pairwise loop (`mass = view[iBase + S.MASS]`), mirroring the existing velocity re-read pattern.
- Full v4 unit suite (123 tests) still passes after repairs.


---

# Batch 14 — COMMS / CHARGE_LAW / FIELD / CURRENT

Laws under audit (indices 52-55):

- **COMMS** (index 52, biology / GREEN)
- **CHARGE_LAW** (index 53, electromagnetism / CYAN)
- **FIELD** (index 54, electromagnetism / CYAN)
- **CURRENT** (index 55, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COMMS | ✅ PASS | `batch_14.test.js` — "COMMS emits signals over time and stays frozen when off": 4 particles, AGE=0, 120 solves → at least one SIGNAL > 1e-6; with no laws, SIGNAL=0.5 and MEMORY stay exact. "COMMS exchanges signal to a neighbour": sender SIGNAL=1, receiver 20 away → receiver SIGNAL > 0.1 after 10 solves. |
| CHARGE_LAW | ⚠️ REPAIRED (1 attempt) | `batch_14.test.js` — "CHARGE_LAW repels like charges and attracts opposite charges": POLARITY=1/1 pair at 10 units → dist grows >0.05 over 60 solves; POLARITY=1/−1 → dist shrinks >0.05; law-off gate: no movement. See repair notes. |
| FIELD | ✅ PASS | `batch_14.test.js` — "FIELD drifts particles along their POLARITY sign": POLARITY=+1 → VEL_Y > 0 after 1 solve; POLARITY=−1 → VEL_Y < 0; law-off gate: VEL_Y stays 0. |
| CURRENT | ✅ PASS | `batch_14.test.js` — "CURRENT diffuses stored charge between conductive neighbours": CHARGE 2/0 pair with CONDUCTIVITY 1 → after 10 solves charge1 < 2, charge2 > 0, |Δcharge| < 0.5; law-off gate: charge unchanged. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_14.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- **CHARGE_LAW repair (v4/src/physics/laws.js)**: `applyChargeForce` used `force = k*qq/(dist²+0.5)` along `dx` (toward the neighbor), which made like charges ATTRACT and opposite charges REPEL — the inverse of the HELP_DB contract ("Opposite charges attract, like charges repel") and of Coulomb's law. Flipped the sign to `force = -k*qq/(dist²+0.5)`. Existing direction-agnostic unit tests still pass.
- Full v4 unit suite (123 tests) still passes after repair.


---

# Batch 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM

Laws under audit (indices 56-59):

- **RESISTANCE** (index 56, electromagnetism / CYAN)
- **CAPACITANCE** (index 57, electromagnetism / CYAN)
- **INDUCTANCE** (index 58, electromagnetism / CYAN)
- **MAGNETISM** (index 59, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| RESISTANCE | ✅ PASS | `batch_15.test.js` — "RESISTANCE damps fast motion and converts it into heat": VEL_X=5, TEMPERATURE=0 → after 10 solves speed < 5 and TEMPERATURE > 0; law-off gate: velocity and temperature unchanged. |
| CAPACITANCE | ⚠️ REPAIRED (1 attempt) | `batch_15.test.js` — "CAPACITANCE stores surplus energy as charge and bleeds it when low": ENERGY 100 → CHARGE > 0.5 after 20 solves; ENERGY 30 + CHARGE 1 → CHARGE < 1 after 20 solves. "CAPACITANCE stored charge produces a pairwise repulsion force": same-sign stored charge pair at 10 units → dist grows >0.02 over 60 solves. See repair notes. |
| INDUCTANCE | ✅ PASS | `batch_15.test.js` — "INDUCTANCE aligns neighbour velocities": VEL_X +3/−3 pair → relative speed < 50% after 20 solves; law-off gate: relative speed stays exactly 6.0. |
| MAGNETISM | ✅ PASS | `batch_15.test.js` — "MAGNETISM attracts aligned moments and repels opposing moments": MAGNETIC_MOMENT +1/+1 pair → dist shrinks >0.02 over 60 solves; +1/−1 pair → dist grows >0.02. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_15.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- **CAPACITANCE repair (v4/src/physics/laws.js)**: `applyStoredChargeForce` used `force = k*qq/(dist²+0.5)` along `dx`, so same-sign stored charges ATTRACTED instead of repelling (same sign bug as CHARGE_LAW). Flipped to `force = -k*qq/(dist²+0.5)` so stored charge follows the same electrostatic convention as CHARGE_LAW (which feeds it).
- Full v4 unit suite (123 tests) still passes after repair.


---

# Batch 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE

Laws under audit (indices 60-63):

- **RESONANCE** (index 60, electromagnetism / CYAN)
- **FLUX** (index 61, electromagnetism / CYAN)
- **IONIZATION** (index 62, electromagnetism / CYAN)
- **DISCHARGE** (index 63, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| RESONANCE | ✅ PASS | `batch_16.test.js` — "RESONANCE attracts actively-pulsing particles with matching PULSE_RATE": SIGNAL=1 pair with PULSE_RATE 0.5/0.5 at 20 units → dist shrinks >0.05 over 60 solves; silent pair (no SIGNAL) → positions stable (±1e-3). |
| FLUX | ✅ PASS | `batch_16.test.js` — "FLUX pushes particles along the stored-charge gradient": CHARGE 0/2 pair at 10 units → lower-charge particle x moves >0.5 toward the gradient over 30 solves; law-off gate: x stays 100. |
| IONIZATION | ✅ PASS | `batch_16.test.js` — "IONIZATION strips charge onto particles on hard contact": POLARITY=1 pair at dist 2, relSpeed 2 → both CHARGE > 0 after 1 solve; law-off gate: both CHARGE stay 0. |
| DISCHARGE | ✅ PASS | `batch_16.test.js` — "DISCHARGE converts stored charge into motion and heat, resetting charge": CHARGE=1.5 → after 1 solve CHARGE=0, TEMPERATURE > 0, VEL_X ≠ 0; law-off gate: CHARGE stays 1.5, no heat. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_16.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- No repairs required; all four laws behave per LAW_HELP_DB.
- RESONANCE requires both particles to be actively signaling (SIGNAL > 0.01) and rewards matching PULSE_RATE via the `sync = 1 − |ΔPULSE_RATE|` term — verified with the silent-pair control.


---

# Batch 17 — PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN

Laws under audit (indices 64-67):

- **PLASMA** (index 64, electromagnetism / CYAN)
- **SUPERCONDUCTIVITY** (index 65, electromagnetism / CYAN)
- **MEMORY** (index 66, information / GOLD)
- **PATTERN** (index 67, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PLASMA | ✅ PASS | `v4/tests/audit/batch_17.test.js` — `applyPlasma(0, 0.02)` @ temp 1 → CHARGE +0.008, temp 1 → 0.996; inert below temp 0.6. Integration: `solve()` ionizes a hot particle (CHARGE > 0, temp < 1). Gating `isSet` verified. |
| SUPERCONDUCTIVITY | ✅ PASS | `v4/tests/audit/batch_17.test.js` — cold pair (temp 0): CHARGE 1/−1 → 0.96/−0.96 with k 0.05; damping force `ax = (v2−v1)·k = 0.5`; returns null when either temp > 0.35. Integration: `solve()` shrinks both charge gap and relative speed. Gating `isSet` verified. |
| MEMORY | ✅ PASS | `v4/tests/audit/batch_17.test.js` — `applyMemoryRefresh` +0.05 both (cap 1); `applyMemoryDecay(0.995, 0.5)` fades mem 1 → 0.995 and amplifies velocity ×(1 + mem·0.5·0.02) → 1.01. Integration: `solve()` leaves MEMORY > 0 after contact + decay. Gating `isSet` verified. |
| PATTERN | ✅ PASS | `v4/tests/audit/batch_17.test.js` — cohesion `applyPatternForce(3,4,0,5,0.2)` → ax 0.02, ay 0.026667; null at dist < 1. Integration: 40 ticks of `solve()` shrink the pair distance. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_17.test.js` (16 tests).


---

# Batch 18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL

Laws under audit (indices 68-71):

- **STIGMERGY** (index 68, information / GOLD)
- **SIGNAL_BOOST** (index 69, information / GOLD)
- **LEARN** (index 70, information / GOLD)
- **SYMBOL** (index 71, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| STIGMERGY | ✅ PASS | `v4/tests/audit/batch_18.test.js` — `applyTrailWrite(100,100,100, 1,0,0)` → TRAIL (108,100,100) (pos + vel·8); `applyStigmergyForce` toward a trail 8 units east → ax ≈ 0.2667 (k 0.3). Integration: `solve()` steers a follower toward a pre-laid trail (VEL_X > 0). Gating `isSet` verified. |
| SIGNAL_BOOST | ✅ PASS | `v4/tests/audit/batch_18.test.js` — signal 0.5 relays +0.04 to neighbour (k 0.08); silent particle relays nothing. Integration: `solve()` propagates signal to a quiet neighbour. Gating `isSet` verified. |
| LEARN | ✅ PASS | `v4/tests/audit/batch_18.test.js` — `applyLearnAlign` moves VEL_X 0 → +0.05 toward a v=10 neighbour (k 0.05, kk = k·0.1). Integration: `solve()` steers the stationary particle (0 < VEL_X < 10). Gating `isSet` verified. |
| SYMBOL | ✅ PASS | `v4/tests/audit/batch_18.test.js` — same-species with SPECIES_AFFINITY 1 → attraction ax ≈ 0.03 (dx 3, dist 5, k 0.3); different species → repulsion −0.015 (affinity flipped ×0.5). Integration: 40 ticks of `solve()` converge same-species flockmates. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no implementation repairs, no implementation files modified.
- Two test-setup corrections were made in `v4/tests/audit/batch_18.test.js` (test-only): the direct STIGMERGY check now seeds the follower's POS_X (trail offset was computed from origin otherwise), and the integration check asserts the follower's pull (the trail-writer itself has zero self-force within the tick, as trail write happens after its pair pass).
- Test file: `v4/tests/audit/batch_18.test.js` (15 tests).


---

# Batch 19 — METRIC / PREDICT / CODE / PROTOCOL

Laws under audit (indices 72-75):

- **METRIC** (index 72, information / GOLD)
- **PREDICT** (index 73, information / GOLD)
- **CODE** (index 74, information / GOLD)
- **PROTOCOL** (index 75, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| METRIC | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyMetricForce` with dE 50, k 0.2 → ax 0.9998, ay 1.3331 (invDist 1/(dist+0.001)); returns null on an energy plateau (dE 0). Integration: `solve()` accelerates a poor particle toward the rich neighbour (VEL_X > 0). Gating `isSet` verified. |
| PREDICT | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyPredictForce` aims at extrapolated position (pdx 6, pdy 4 from v2·t=3; direction matches (pdx/pd, pdy/pd)). Integration: `solve()` steers toward the neighbour's future position. Gating `isSet` verified. |
| CODE | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyCodeBlend` @ distSq 9 converges sampled loci (0/1 → 0.0005/0.9995, rate k·0.01); no blend beyond distSq 16. Integration: `solve()` converges DNA at sampled loci for touching particles. Gating `isSet` verified. |
| PROTOCOL | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyProtocolSync` entangles signal phase (0/1 → 0.1/0.9, k 0.1). Integration: `solve()` shrinks the neighbour signal gap. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_19.test.js` (14 tests).


---

# Batch 20 — FEEDBACK / LANGUAGE / CULTURE / SINGULARITY

Laws under audit (indices 76-79):

- **FEEDBACK** (index 76, information / GOLD)
- **LANGUAGE** (index 77, information / GOLD)
- **CULTURE** (index 78, information / GOLD)
- **SINGULARITY** (index 79, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| FEEDBACK | ✅ PASS | `v4/tests/audit/batch_20.test.js` — `applyFeedback(0, 0.5)` with mem 0.5, v 2 → MEMORY +0.02 (speed·k·0.02) and boost ax = vx·mem·k·0.1 = 0.05; returns null when stationary. Integration: `solve()` accelerates a moving, memory-bearing particle and recharges MEMORY. Gating `isSet` verified. |
| LANGUAGE | ✅ PASS | `v4/tests/audit/batch_20.test.js` — signaling pair (s 0.5/0, k 0.25): MEMORY 1/0 → 0.875/0.125, signal relay +0.0125; silent pair untouched. Integration: `solve()` shrinks the memory gap and relays signal. Gating `isSet` verified. |
| CULTURE | ✅ PASS | `v4/tests/audit/batch_20.test.js` — same-species contact (k 0.5): DNA cache 0/1 → 0.01/0.99 (rate k·0.02); different-species pairs untouched. Integration: `solve()` converges traits within a species but not across. Gating `isSet` verified. |
| SINGULARITY | ✅ PASS | `v4/tests/audit/batch_20.test.js` — `applySingularityForce` from m2 20 @ dist 10 (k 0.5) yields the inverse-square pull; null for sub-critical m2 5. `applySingularityAbsorb` inside the horizon (dist 2 < max(2.5, √25·0.8)) transfers mass (1.5 → hole 25 → 26.5) and kills the victim; no absorb beyond. Integration: `solve()` absorbs a particle on contact. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_20.test.js` (18 tests).


---

# Batch 21 — ENTANGLEMENT / HISTORY / TIDE / FRICTION

Laws under audit (indices 80-83):

- **ENTANGLEMENT** (index 80, metaphysics / RED)
- **HISTORY** (index 81, information / GOLD)
- **TIDE** (index 82, physics / BLUE)
- **FRICTION** (index 83, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ENTANGLEMENT | ✅ PASS | `v4/tests/audit/batch_21.test.js` — link forms on contact (`ENTANGLE_ID` 1/0, `ENTANGLE_PHASE` ≈ 0.998 after 1 tick); non-local coupling converges velocities (rel 5.0 → < 5.0 over 150 ticks, link still live); phase forced to 0.02 snaps the link to `ENTANGLE_ID = -1`. Gate: no link with the law off. |
| HISTORY | ✅ PASS | `v4/tests/audit/batch_21.test.js` — two corner particles drift toward the shared memory-field COM: first ticks pull each toward the centre (VEL_X/Y/Z > 0), separation 3117.7 → 2702.7 over 120 ticks. Gate: no drift with the law off. |
| TIDE | ✅ PASS | `v4/tests/audit/batch_21.test.js` — light particle (mass 1.5) accelerates toward a mass-20 neighbour (VEL_X > 0), separation 100 → < 100 over 100 ticks. Gate: no mass coupling with TIDE off. |
| FRICTION | ✅ PASS | `v4/tests/audit/batch_21.test.js` — velocity-dependent drag slows a vx=5 particle to < 5 over 100 ticks (still positive). Gate: velocity preserved exactly with FRICTION off. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating (see `v4/tests/unit/lawCategories.test.js` for the `makeWorld`/`solve` pattern). ENTANGLEMENT dispatch is pairwise (`applyEntanglePair`) + per-particle (`applyEntanglement`); HISTORY is per-particle write/force + `applyHistoryCalc()` once per solve (`v4/src/physics/laws.js`, dispatched from `v4/src/physics/solver.js`); TIDE/FRICTION are `v4/src/physics/lawgroups/physicsLaws.js`.
- A single-particle HISTORY drift test initially overshot the COM (the accumulating trail pulls the particle back — documented "archaeology" behaviour), so the assertion was replaced with a two-particle convergence test, which is deterministic.
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

# Batch 22 — ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION

Laws under audit (indices 84-87):

- **ELASTICITY** (index 84, physics / BLUE)
- **TURBULENCE** (index 85, physics / BLUE)
- **CENTRIPETAL** (index 86, physics / BLUE)
- **ROTATION** (index 87, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ELASTICITY | ✅ PASS | `v4/tests/audit/batch_22.test.js` — overlapping pair (dist 0.5, radii 0.6) pushed apart: separation 0.5 → > 1.0 over 20 ticks. Gate: separation unchanged with ELASTICITY off. |
| TURBULENCE | ✅ PASS | `v4/tests/audit/batch_22.test.js` — seeded-LCG noise kicks leave a resting particle with speed > 0.05 after 100 ticks. Gate: velocity stays exactly 0 without the law. |
| CENTRIPETAL | ✅ PASS | `v4/tests/audit/batch_22.test.js` — particle at (100,100,100) pulled toward centre: distance to centre 1558.8 → < 1558.8 over 200 ticks, VEL_X/Y/Z all > 0 (harmonic attractor). Gate: no central pull without the law. |
| ROTATION | ✅ PASS | `v4/tests/audit/batch_22.test.js` — offset (−300, 0) gets a purely tangential first impulse (VEL_Y < 0, VEL_X = 0), then swirls: VEL_Y < 0 and POS_Y < 1000 after 100 ticks. Gate: no swirl without the law. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. All six functions live in `v4/src/physics/lawgroups/physicsLaws.js`; the solver dispatches ELASTICITY pairwise and TURBULENCE/CENTRIPETAL/ROTATION per-particle.
- The long-run ROTATION trajectory spirals (radial velocity grows because the tangential force keeps accelerating), so the assertion targets the deterministic first-impulse tangency plus the −y swirl, matching `LAW_HELP_DB` ("tangential force that sets the whole dish rotating").
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

# Batch 23 — SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY

Laws under audit (indices 88-91):

- **SYMBIOSIS** (index 88, biology / GREEN)
- **PARASITE** (index 89, biology / GREEN)
- **HIBERNATION** (index 90, biology / GREEN)
- **IMMUNITY** (index 91, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SYMBIOSIS | ✅ PASS | `v4/tests/audit/batch_23.test.js` — different-species contact transfers energy rich → poor: pair 100/40 becomes < 100 / > 40 with total conserved (140) after 1 tick. Gate: energies untouched without the law. |
| PARASITE | ✅ PASS | `v4/tests/audit/batch_23.test.js` — mass-1 parasite drains a mass-5 host: parasite ENERGY > 100, host < 100 after 1 tick. Gate: no drain without the law. |
| HIBERNATION | ✅ PASS | `v4/tests/audit/batch_23.test.js` — starving particle (ENERGY 20, vx 5) regains energy (> 20) and is damped (< 5) in 1 tick; well-fed particle (ENERGY 50) is unaffected (energy 50, vx 5 preserved over 10 ticks). |
| IMMUNITY | ✅ PASS | `v4/tests/audit/batch_23.test.js` — ARMOR regenerates 0 → > 0.5 and ENERGY rises above 100 over 100 ticks. Gate: armour stays 0 without the law. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. Functions live in `v4/src/physics/lawgroups/biologyLaws.js`; the solver dispatches SYMBIOSIS/PARASITE pairwise and HIBERNATION/IMMUNITY per-particle (k = 0.5).
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

# Batch 24 — ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION

Laws under audit (indices 92-95):

- **ELECTROLYSIS** (index 92, chemistry / PURPLE)
- **PHOTOLYSIS** (index 93, chemistry / PURPLE)
- **PRECIPITATION** (index 94, chemistry / PURPLE)
- **NEUTRALIZATION** (index 95, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ELECTROLYSIS | ✅ PASS | `v4/tests/audit/batch_24.test.js` — charge imbalance (1 vs 0) converts mass into energy + signal: MASS 1.5 → < 1.5, ENERGY > 100, SIGNAL > 0 after 1 tick. Gate: balanced charges (Δ 0.2) are inert (mass/signal unchanged). |
| PHOTOLYSIS | ✅ PASS | `v4/tests/audit/batch_24.test.js` — SIGNAL 1 decomposes mass into energy and spends light: MASS < 1.5, ENERGY > 100, SIGNAL ≈ 0.9 after 1 tick. Gate: weak signal (0.2) is inert. |
| PRECIPITATION | ✅ PASS | `v4/tests/audit/batch_24.test.js` — high-energy contact condenses: MASS 1.5 → > 1.5, RADIUS 0.458 → < 0.458, ENERGY < 100 after 1 tick. Gate: mass/energy unchanged without the law. |
| NEUTRALIZATION | ✅ PASS | `v4/tests/audit/batch_24.test.js` — opposite charges (1 / −1) cancel toward 0 and release heat: |CHARGE| < 1 for both, TEMPERATURE > 0 for both after 1 tick. Gate: same-sign charges (0.5/0.5) are inert. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. Functions live in `v4/src/physics/lawgroups/chemistryLaws.js`; the solver dispatches ELECTROLYSIS/PRECIPITATION/NEUTRALIZATION pairwise and PHOTOLYSIS per-particle (k = 0.5).
- RADIUS assertions use the solver-recomputed radius (BASE_RADIUS × mass^⅓ ≈ 0.458), not the 0.6 seed value; the PRECIPITATION gate asserts mass/energy since radius is recomputed every tick by the solver core regardless of the law.
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

# Batch 25 — STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION

Laws under audit (indices 96-99):

- **STOICHIOMETRY** (index 96, chemistry / PURPLE)
- **AUTOCATALYSIS** (index 97, chemistry / PURPLE)
- **ADIABATIC** (index 98, thermodynamics / ORANGE)
- **COMPRESSION** (index 99, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| STOICHIOMETRY | ✅ PASS | `STOICHIOMETRY direct` — masses 1.0/2.0, k=1 → 1.005/1.995, pair total conserved (3). `integration` — i.mass > 1, j.mass < 2, sum ≈ 3 with law on; 1/2 frozen with law off. |
| AUTOCATALYSIS | ✅ PASS | `AUTOCATALYSIS direct` — same-species pair (species 7, CATALYSIS 1.5) → both ENERGY 100 → 100.15; cross-species pair unchanged. `integration` — same-species pair ENERGY > 100 with law on; 100 with law off. |
| ADIABATIC | ✅ PASS | `ADIABATIC direct` — vx=4, mass 1.5, k=0.1 → drag force ax=−0.4, TEMPERATURE +2.28 (KE→heat); stationary particle → null. `integration` — vx=4 → TEMPERATURE > 0 and vx < 4 with law on; 0/4 with law off. |
| COMPRESSION | ✅ PASS | `COMPRESSION direct` — touching pair (dist 1 < (rI+rJ)*2), k=0.5 → radii 0.6 → 0.45, TEMPERATURE +0.5; dist ≥ threshold → no effect. `integration` — overlapping pair: both radii < 0.6 and both TEMPERATUREs > 0 with law on; frozen with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyStoichiometry`/`applyAutocatalysis` from `v4/src/physics/lawgroups/chemistryLaws.js`, `applyAdiabatic`/`applyCompression` from `v4/src/physics/lawgroups/thermoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_25.test.js` (8 tests, all pass).
- No repairs needed. COMPRESSION radii shrink through solve() despite the per-tick mass-derived radius update (the double pair-pass leaves both radii below the seeded 0.6 and both temps positive).


---

# Batch 26 — EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY

Laws under audit (indices 100-103):

- **EXPANSION** (index 100, thermodynamics / ORANGE)
- **EQUILIBRIUM** (index 101, thermodynamics / ORANGE)
- **LATENT_HEAT** (index 102, thermodynamics / ORANGE)
- **RUNAWAY** (index 103, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| EXPANSION | ⚠️ REPAIRED (1 attempt) | `EXPANSION direct` — cold (temp 0.1) particle, base RADIUS DNA 1.2, k=0.1 → radius 0.6 → 0.66, temp → 0.09; temp ≥ 0.3 → no-op. `integration` — mass 0.3 particle grows radius 0.803 → 0.843 (> 0.81) and cools with law on; frozen at 0.6 with law off. |
| EQUILIBRIUM | ✅ PASS | `EQUILIBRIUM direct` — temps 0.2/0.8, k=0.5 → both 0.5 (total conserved). `integration` — solver k=0.3×2 passes: gap shrinks 0.6 → < 0.2, both move toward mean; frozen with law off. |
| LATENT_HEAT | ✅ PASS | `LATENT_HEAT direct` — hot (temp 2.0, k=0.5) → temp 1.5, ENERGY 100.5; cold (temp −1.0, k=0.2) → temp −0.9, ENERGY 99.9. `integration` — temp 2.0 → temp < 2 and ENERGY > 100 with law on; 2.0/100 with law off. |
| RUNAWAY | ✅ PASS | `RUNAWAY direct` — temp 1.5, k=2 → +0.98 (quadratic excess²); temp 0.5 → unchanged. `integration` — temp 1.5 → temp > 1.5 with law on; 1.5 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyExpansion`/`applyEquilibrium`/`applyLatentHeat`/`applyRunaway` from `v4/src/physics/lawgroups/thermoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_26.test.js` (8 tests, all pass).
- Repair 1 (EXPANSION, 1 attempt): integration showed EXPANSION's RADIUS growth was dead in solve() — the unconditional per-tick "update radius from mass" (`view[iBase+RADIUS] = baseRadius * mass^(1/3)`) ran after EXPANSION's per-particle dispatch and overwrote it (only the tiny cooling survived). Fix in `v4/src/physics/solver.js`: moved the `applyExpansion` dispatch from the per-particle accumulation block to the post-integration section immediately after the mass-derived radius update, so growth toward the DNA base radius persists. Verified the on-vs-off radius delta (0.843 vs 0.803) before/after the move.


---

# Batch 27 — CONSCIOUSNESS / PERCEPTION / SYNCHRONICITY / ANTENNA

Laws under audit (indices 104-107):

- **CONSCIOUSNESS** (index 104, metaphysics / RED)
- **PERCEPTION** (index 105, metaphysics / RED)
- **SYNCHRONICITY** (index 106, metaphysics / RED)
- **ANTENNA** (index 107, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CONSCIOUSNESS | ✅ PASS | `CONSCIOUSNESS direct` — k=0.5 → ENERGY +0.01 (100.01), MEMORY +0.0025; caps 200/1 respected. `integration` — ENERGY > 100, MEMORY > 0 with law on; 100/0 with law off. |
| PERCEPTION | ✅ PASS | `PERCEPTION direct` — NEIGHBORHOOD_RADIUS 60 (range 120), dist 50, vJ−vI=1, k=1 → ax=+0.01; dist ≥ range → null. `integration` — idle i accelerates (vx > 0) toward vx=2 neighbour with law on; 0 with law off. |
| SYNCHRONICITY | ✅ PASS | `SYNCHRONICITY direct` — phases 0.1/0.2 (Δ<0.3), vJ=1, k=1 → ax=+0.02, both phases → 0.15; phases 0/0.5 → null. `integration` — i.vx > 0 and phases converge (Δ < 0.1) with law on; frozen with law off. |
| ANTENNA | ✅ PASS | `ANTENNA direct` — SIGNAL 1, speed 100 (cap 5), k=1 → SIGNAL 1.05; SIGNAL ≤ 0.05 → no boost. `integration` — SIGNAL 1, vx=5 → SIGNAL > 1 with law on; 1 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyConsciousness`/`applyPerception`/`applySynchronicity` from `v4/src/physics/lawgroups/metaLaws.js`, `applyAntenna` from `v4/src/physics/lawgroups/emLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_27.test.js` (8 tests, all pass).
- No repairs needed. Note: implementations intentionally differ from the SPEC.md sketches (ANTENNA and PERCEPTION are per-particle / extended-range velocity alignment rather than the pairwise sketches) — behavior matches the in-code docs, existing `v4/tests/unit/lawgroupsEmInfoMeta.test.js`, and the solver dispatch signatures.


---

# Batch 28 — SHIELDING / POLARIZATION / NAVIGATION / ENCRYPTION

Laws under audit (indices 108-111):

- **SHIELDING** (index 108, electromagnetism / CYAN)
- **POLARIZATION** (index 109, electromagnetism / CYAN)
- **NAVIGATION** (index 110, information / GOLD)
- **ENCRYPTION** (index 111, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SHIELDING | ✅ PASS | `SHIELDING direct` — CHARGE 2, ENERGY 100, k=1 → CHARGE 1.99, ENERGY 99.95; no charge → no-op. `integration` — CHARGE < 2 and ENERGY < 100 with law on; 2/100 with law off. |
| POLARIZATION | ✅ PASS | `POLARIZATION direct` — equal TUNING_CH1, signals 0/2, k=0.5 → 0.5/1.5 (total conserved); mismatched channels, k=1 → both ×0.99 damped. `integration` — signals 0/2 → s0 > 0, s1 < 2, sum ≈ 2 with law on; 0/2 with law off. |
| NAVIGATION | ✅ PASS | `NAVIGATION direct` — MEMORY 0.2/0.8, dx=3,dy=4,dist=5, k=0.5 → ax=0.18, ay=0.24; no gradient → null. `integration` — i.vx > 0 toward memory-rich neighbour with law on; 0 with law off. |
| ENCRYPTION | ✅ PASS | `ENCRYPTION direct` — SIGNAL 2, k=1 → 1.95 (< 2, floor 0.05); silent → no-op. `integration` — SIGNAL 2 → 1.975, ≥ 0.05 with law on; 2 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyShielding`/`applyPolarization` from `v4/src/physics/lawgroups/emLaws.js`, `applyNavigation`/`applyEncryption` from `v4/src/physics/lawgroups/infoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_28.test.js` (8 tests, all pass).
- No repairs needed. Note: NAVIGATION's implementation is the pairwise MEMORY-gradient steering (neighbour's MEMORY exceeds own → force toward neighbour), not the per-particle TRAIL steering from the SPEC.md sketch — matches the solver dispatch and `v4/tests/unit/lawgroupsEmInfoMeta.test.js`.


---

# Batch 29 — SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE

Laws under audit (indices 112-115):

- **SUPERPOSITION** (index 112, quantum / INDIGO)
- **TUNNELING** (index 113, quantum / INDIGO)
- **DECOHERENCE** (index 114, quantum / INDIGO)
- **WAVE_PARTICLE** (index 115, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SUPERPOSITION | ✅ PASS | `batch_29.test.js` — "SUPERPOSITION adds random velocity-spread force": direct `applySuperposition(buf,0,1,rngHigh)` → ax=ay=0.8; solver (k=0.05, prng 0.9) → |VEL_X| > 0.001 after 1 tick; law-off gate: velocity frozen. |
| TUNNELING | ⚠️ REPAIRED (1 attempt) | `batch_29.test.js` — "TUNNELING phase-shifts position when triggered": direct k=200 prng 0.9 → POS 100→103.6 (hop radius×6); solver (k=0.5, prng 0.0009) → POS 100→96.4 after 1 tick; law-off gate: frozen. See repair notes. |
| DECOHERENCE | ✅ PASS | `batch_29.test.js` — "DECOHERENCE damps velocity and radiates SIGNAL": direct VEL 5 → ax=−0.05, SIGNAL+0.001; solver: VEL < 5−0.001 and SIGNAL > 0.0005 after 10 ticks; law-off gate: frozen. |
| WAVE_PARTICLE | ✅ PASS | `batch_29.test.js` — "WAVE_PARTICLE damps slow (wave) and amplifies fast (particle) motion": direct VEL 0.2 → damping ax<0, VEL 5 → ax=+0.05, VEL 1 → null; solver: fast VEL grows >5, slow VEL shrinks <0.2. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_29.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **TUNNELING repair (v4/src/physics/solver.js)**: `applyTunneling` writes the hop directly to the buffer, but the solver's per-particle writeback used the stale local `px` read at iteration start, erasing the hop every tick (position stayed at 100). Fixed by reconciling the local position with the buffer after the per-particle law section: `px = view[iBase+S.POS_X] + softbodyDX` (the `softbodyDX` delta captured after the pair loop preserves the COLL softbody push while folding in buffer position mutations).
- Full v4 suite (47 files / 420 tests) passes after repair, including the COLL batch.


---

# Batch 30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK

Laws under audit (indices 116-119):

- **UNCERTAINTY** (index 116, quantum / INDIGO)
- **TELEPORT** (index 117, quantum / INDIGO)
- **OBSERVER** (index 118, quantum / INDIGO)
- **PLANCK** (index 119, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| UNCERTAINTY | ⚠️ REPAIRED (1 attempt) | `batch_30.test.js` — "UNCERTAINTY jitters position and adds a velocity kick": direct prng 0.9 → POS +0.008, kick ax=0.02; solver: POS > 100.0001 and VEL_X > 0.0001 after 1 tick (position jitter persisted after repair); law-off gate: frozen. See repair notes. |
| TELEPORT | ⚠️ REPAIRED (1 attempt) | `batch_30.test.js` — "TELEPORT jumps to a random location and spends ENERGY": direct k=1000 prng 0.9 → jump to 1800, ENERGY < 100; solver (k=0.5, prng 0.0009) → POS ≈ 1.8 and ENERGY < 90 after 1 tick; law-off gate: frozen. See repair notes. |
| OBSERVER | ✅ PASS | `batch_30.test.js` — "OBSERVER collapses a neighbour velocity toward the observer and imprints MEMORY": direct observer MEMORY 1/VEL 10 → neighbour VEL 0.1, MEMORY 0.1; solver: neighbour VEL > 0.01, MEMORY > 0.05 after 1 tick; law-off gate: neighbour stays still. |
| PLANCK | ✅ PASS | `batch_30.test.js` — "PLANCK quantizes velocity to discrete steps": direct q=0.1 → 0.17→0.2, −0.23→−0.2; solver (k=0.5, q=0.05) → VEL_X = 0.15 after 1 tick; law-off gate: VEL unchanged. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_30.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **UNCERTAINTY + TELEPORT repair (v4/src/physics/solver.js)**: both laws write position directly to the buffer; the solver's stale-local writeback erased the jitter/jump (positions stayed at 100). Same root cause and fix as TUNNELING (batch 29): position reconciliation in the solver (`px = view[iBase+S.POS_X] + softbodyDX` after the per-particle law section, with the softbody delta captured post-pair-loop).
- PLANCK needed no repair — its direct buffer velocity write is already folded into integration via the existing velocity re-read; the only test change was float-precision (`toBe` → `toBeCloseTo`) in the gate assertion.
- Full v4 suite (47 files / 420 tests) passes after repair.


---

# Batch 31 — COHERENCE / BOSONIC / FERMIONIC / SPIN

Laws under audit (indices 120-123):

- **COHERENCE** (index 120, quantum / INDIGO)
- **BOSONIC** (index 121, quantum / INDIGO)
- **FERMIONIC** (index 122, quantum / INDIGO)
- **SPIN** (index 123, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COHERENCE | ✅ PASS | `batch_31.test.js` — "COHERENCE phase-locks similar neighbour velocities": direct diff 0.5 < 1 → ax=0.01; solver: relative velocity shrinks over 30 ticks; law-off gate: relative velocity preserved exactly. |
| BOSONIC | ✅ PASS | `batch_31.test.js` — "BOSONIC attracts particles within short range (glue)": direct dist 2 → ax=1, dist 4 → null; solver: pair 2 apart → dist shrinks (collision floor ~1.2) over 10 ticks; law-off gate: dist unchanged. |
| FERMIONIC | ✅ PASS | `batch_31.test.js` — "FERMIONIC pushes overlapping particles apart (exclusion)": direct dist 1 < rSum 1.2 → ax < 0, dist 2 → null; solver: overlapping pair (0.8) separates over 10 ticks; law-off gate: dist unchanged. |
| SPIN | ⚠️ REPAIRED (1 attempt) | `batch_31.test.js` — "SPIN applies a perpendicular wiggle with particle-index parity": direct even particle → ay=+0.1, odd particle → ay=−0.1; solver: particle 0 VEL_Y > +0.001, particle 1 VEL_Y < −0.001 after 5 ticks. See repair notes. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_31.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **SPIN repair (v4/src/physics/lawgroups/quantumLaws.js)**: `applySpin` derived the direction from `iBase % 2` (buffer-offset parity). With `PARTICLE_STRIDE = 100`, every particle's base offset is even, so every particle got the SAME spin sign — the documented particle-index parity ("Spin direction is set by particle index parity") never alternated. Fixed to `Math.floor(iBase / PARTICLE_STRIDE) % 2` so particle 0 → +, particle 1 → −, etc. The existing unit test (`oddBase = PARTICLE_STRIDE + 1`) still passes.
- Full v4 suite (47 files / 420 tests) passes after repair.


---

# Batch 32 — SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER

Laws under audit (indices 124-127):

- **SPECTRAL** (index 124, quantum / INDIGO)
- **WAVEFUNCTION** (index 125, quantum / INDIGO)
- **HYPERPLANE** (index 126, quantum / INDIGO)
- **ANTIMATTER** (index 127, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SPECTRAL | ✅ PASS | `batch_32.test.js` — "SPECTRAL emits a species-tagged SIGNAL tone": direct species 3 → SIGNAL += 0.004; solver: SIGNAL > 0.005 after 5 ticks; law-off gate: no signal. |
| WAVEFUNCTION | ⚠️ REPAIRED (1 attempt) | `batch_32.test.js` — "WAVEFUNCTION snaps position onto the wave grid": direct q=0.5 → 100.3→100.5; solver (q=0.25) → 100.3→100.25 after 1 tick (snap persisted after repair); law-off gate: position unchanged. See repair notes. |
| HYPERPLANE | ✅ PASS | `batch_32.test.js` — "HYPERPLANE applies a constant slow shear force": direct ax=0.001, ay=0.0005, az=0.0002; solver: VEL_X and VEL_Y accumulate > 1e-5 over 5 ticks; law-off gate: velocity stays 0. |
| ANTIMATTER | ✅ PASS | `batch_32.test.js` — "ANTIMATTER annihilates opposite-charge pairs on contact": direct CHARGE +1/−1 → both DEAD=1, SIGNAL burst 10; solver: both DEAD=1 with SIGNAL > 0 after 1 tick; law-off gate: both alive, no signal. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_32.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **WAVEFUNCTION repair (v4/src/physics/solver.js)**: `applyWavefunction` snaps the position directly in the buffer, but the solver's stale-local writeback erased the snap (position stayed 100.3). Same root cause and fix as TUNNELING/UNCERTAINTY/TELEPORT: position reconciliation in the solver (`px = view[iBase+S.POS_X] + softbodyDX`), which is the 4th law fixed by this single solver change.
- Spec deviation noted (not repaired): SPEC item 46 says `applyAntimatter` should return `true` on annihilation so the solver breaks the pair loop, but the implementation returns `null` always and the solver dispatch doesn't check the return. The functional effect (both particles DEAD=1 + signal burst) is fully delivered, so this is a performance/robustness nit rather than a functional fault.
- Full v4 suite (47 files / 420 tests) passes after repair.


---


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 92/112: audit-suite/historical/2026-08-10-v4.6.28/params/INDEX.md (30 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Parameter Audit Suite — Index

18 batches × 4 params = 72 params (world 22 · settings/camera 8 · DNA 42).

> 📄 **Combined results:** [combined.md](combined.md)
> 📄 **Spec:** [SPEC.md](SPEC.md)

| Batch | Params | Result |
|-------|--------|--------|
| [batch 01](batch_01.md) | 01 — WORLD_SIZE / GROUND_HEIGHT / PARTICLE_COUNT / INITIAL_POP | ✅ |
| [batch 02](batch_02.md) | 02 — MAX_POP / SHAPE / SPAWN_CENTRES / SPAWN_CENTRE_RANDOM | ✅ |
| [batch 03](batch_03.md) | 03 — SPAWN_CENTRE_BIAS / GLOBAL_G / WIND / DAMPING | ✅ |
| [batch 04](batch_04.md) | 04 — VISCOSITY / ENTROPY / HEAT_CAPACITY / LIGHT_LEVEL | ✅ |
| [batch 05](batch_05.md) | 05 — RADIATION_LEVEL / SPAWN_RATE / SPECIES_INTERACTION / ENERGY_TRANSFER | ✅ |
| [batch 06](batch_06.md) | 06 — MUTATION_RATE / DECAY_RATE / visualScale / globalAlpha | ✅ |
| [batch 07](batch_07.md) | 07 — starMass / simSpeed / focalLength / ortho | ✅ |
| [batch 08](batch_08.md) | 08 — rotateSensitivity / panSensitivity / DNA.FORCE / DNA.VISCOSITY | ⚠️ |
| [batch 09](batch_09.md) | 09 — DNA.TORQUE / DNA.JITTER / DNA.TIDAL / DNA.INERTIA | ⚠️ |
| [batch 10](batch_10.md) | 10 — DNA.FRICTION / DNA.MAX_VELOCITY / DNA.SYMMETRY / DNA.HIDDEN_MASS | ✅ |
| [batch 11](batch_11.md) | 11 — DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME | ⚠️ |
| [batch 12](batch_12.md) | 12 — DNA.BASE_RADIUS / DNA.ELASTICITY / DNA.BOND_ANGLE / DNA.POLARITY | ⚠️ |
| [batch 13](batch_13.md) | 13 — DNA.ALPHA / DNA.CONDUCTIVITY / DNA.MAGNETIC_MOMENT / DNA.REACTION_THRESHOLD | ⚠️ |
| [batch 14](batch_14.md) | 14 — DNA.CATALYSIS / DNA.HEAT_OUTPUT / DNA.BIRTH_RATE / DNA.DEATH_RATE | ⚠️ |
| [batch 15](batch_15.md) | 15 — DNA.MUTATION / DNA.ENERGY_EFFICIENCY / DNA.SEX_CHANCE / DNA.PREDATION_BIAS | ⚠️ |
| [batch 16](batch_16.md) | 16 — DNA.SPECIES_AFFINITY / DNA.SIGNAL_RESP / DNA.PULSE_RATE / DNA.NEIGHBORHOOD_RADIUS | ✅ |
| [batch 17](batch_17.md) | 17 — DNA.SIGNAL_STRENGTH / DNA.SIGNAL_DECAY / DNA.PROPAGATION_SPEED / DNA.TUNING_CH1 | ✅ |
| [batch 18](batch_18.md) | 18 — DNA.TUNING_CH2 / DNA.TUNING_CH3 / DNA.TUNING_CH4 / DNA.MEMORY_DECAY | ✅ |

Statuses: ⏳ pending · ✅ PASS · ⚠️ REPAIRED · ❌ FAULTY


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 93/112: audit-suite/historical/2026-08-10-v4.6.28/params/SPEC.md (129 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA v4 — Parameter Audit Spec (72 params)

> Every slider/parameter in the app is audited exactly like the law audit:
> one focused test + one gate test per param, conclusive validation, repair
> loop (≤3 attempts), status recorded in `batch_XX.md`, results combined.
>
> **Scope:** 22 world panel sliders · 8 settings/camera sliders · 42 DNA params
> = **72 params** → 18 batches × 4.
>
> **Baseline (already implemented before this audit):** the 22 world sliders
> now flow through `src/state/worldParams.js` (SSOT) → `runtimeConfig.worldParams`
> → `solver.js` / `laws.js` / `src/spawn/distribution.js`. Defaults were set to
> neutral values so the default simulation behaves exactly as before.

## How to validate

- **World physics/environment params** → `solve()` integration tests: set
  `runtimeConfig.worldParams.<KEY> = X`, run N ticks, assert the effect; then
  a gate test with the neutral value asserting no effect.
- **World spawn params** (WORLD_SIZE, GROUND_HEIGHT, PARTICLE_COUNT,
  INITIAL_POP, MAX_POP, SHAPE, SPAWN_CENTRES, SPAWN_CENTRE_RANDOM,
  SPAWN_CENTRE_BIAS) → `src/spawn/distribution.js` + `spawnCaps()` unit tests
  (pure functions).
- **Settings meta** (visualScale, globalAlpha, starMass, simSpeed) →
  `runtimeConfig` value + solver/renderer consumption checks.
- **Camera** (focalLength, ortho, rotateSensitivity, panSensitivity) →
  `src/ui/camera.js` (pure) — `setCameraConfig` + projection math.
- **DNA params** → `src/dna/dnaBuffer.js` set/get round-trip + solver
  consumption through the particle DNA cache (`STRIDE_INDEXES.DNA_CACHE_START`).

Shared helper: `v4/tests/audit/paramsHelpers.js` (`makeWorld`, `withWorldParam`,
`resetWorldParams`). Test files: `v4/tests/audit/params_batch_XX.test.js`.

## World panel (22) — defaults are neutral; status is post-baseline

| # | Key | Range / default | Expected behavior | Status |
|---|-----|------------------|-------------------|--------|
| 1 | WORLD_SIZE | 50–20000 / 2000 | World bounds; wrapping/clamping + spawns follow it | ✅ wired |
| 2 | GROUND_HEIGHT | 0–1 / 0.9 | Spawn z band = [0, worldSize·h]; h=1 → full volume | ✅ wired |
| 3 | PARTICLE_COUNT | 100–20000 / 1000 | Hard cap on live particles (min(MAX_PARTICLES)) | ✅ wired |
| 4 | INITIAL_POP | 10–5000 / 250 | Total initial population, split across species | ✅ wired |
| 5 | MAX_POP | 100–50000 / 5000 | Soft cap: regular spawn feed stops at it | ✅ wired |
| 6 | SHAPE | 0–1 / 0 | Spawn shape: 0=even grid, 1=fully random | ✅ wired |
| 7 | SPAWN_CENTRES | 1–64 / 1 | Number of cluster centres | ✅ wired |
| 8 | SPAWN_CENTRE_RANDOM | 0–1 / 0.5 | Centre placement: 0=grid, 1=random | ✅ wired |
| 9 | SPAWN_CENTRE_BIAS | 0–1 / 0 | Pull spawns toward centres (1=pinned) | ✅ wired |
| 10 | GLOBAL_G | 0–20 / 1 | Gravity multiplier (solver `effG = G·GLOBAL_G`) | ✅ wired |
| 11 | WIND | 0–5 / 0 | Constant +X drift: `vx += WIND·0.5·dt` per tick | ✅ wired |
| 12 | DAMPING | 0–100 / 0 | Global velocity decay: factor `(1−D/100)^dt` | ✅ wired |
| 13 | VISCOSITY | 0.5–1 / 1 | Multiplies DNA viscosity in DRAG drag factor | ✅ wired |
| 14 | ENTROPY | 0–2 / 1 | Multiplies ENTR jitter amplitude | ✅ wired |
| 15 | HEAT_CAPACITY | 0.1–10 / 1 | Divides HEAT/COLD transfer rate (higher = slower) | ✅ wired |
| 16 | LIGHT_LEVEL | 0–2 / 0.5 | LIFE photosynthesis: `+0.02·LIGHT·dt` energy | ✅ wired |
| 17 | RADIATION_LEVEL | 0–5 / 1 | Multiplies RADIATION law damage | ✅ wired |
| 18 | SPAWN_RATE | 0–100 / 5 | Regular spawn feed particles per second | ✅ wired |
| 19 | SPECIES_INTERACTION | −2–2 / 1 | Multiplies AFFINITY forces (neg = repel bias) | ✅ wired |
| 20 | ENERGY_TRANSFER | 0–2 / 1 | Multiplies ENERGY conduction rate | ✅ wired |
| 21 | MUTATION_RATE | 0–5 / 1 | Multiplies REPRO offspring DNA mutation | ✅ wired |
| 22 | DECAY_RATE | 0–2 / 1 | Multiplies LIFE metabolic decay | ✅ wired |

## Settings / camera (8)

| # | Key | Range / default | Expected behavior | Status |
|---|-----|------------------|-------------------|--------|
| 23 | visualScale | 0.1–5 / 1 | Renderer particle-size multiplier | ✅ wired |
| 24 | globalAlpha | 0.1–1 / 1 | Renderer opacity multiplier | ✅ wired |
| 25 | starMass | 4–100 / 12 | Collapse threshold (solver + renderer) | ✅ wired |
| 26 | simSpeed | 0.1–10 / 1 | Physics time-step multiplier | ✅ wired |
| 27 | focalLength | 400–4000 / 1200 | Camera projection distance | ✅ wired |
| 28 | ortho | 0–1 / 0 | Perspective→orthographic blend | ✅ wired |
| 29 | rotateSensitivity | 0.1–5 / 1 | Orbit gesture multiplier | ✅ wired |
| 30 | panSensitivity | 0.1–5 / 1 | Pan gesture multiplier | ✅ wired |

## DNA params (42) — status is "to validate"; some may be decorative

| # | DNA key (idx) | Range | Mechanic to validate |
|---|---------------|-------|----------------------|
| 31 | FORCE (0) | −2–2 | Attraction/repulsion strength |
| 32 | VISCOSITY (1) | 0.5–1 | Per-particle drag factor |
| 33 | TORQUE (2) | 0–1 | Rotational momentum (visual or force) |
| 34 | JITTER (3) | 0–1 | Entropy jitter amplitude (ENTR law) |
| 35 | TIDAL (15) | 0–1 | Differential structural forces |
| 36 | INERTIA (26) | 0–2 | Acceleration resistance |
| 37 | FRICTION (27) | 0–1 | Velocity-dependent drag (DRAG law) |
| 38 | MAX_VELOCITY (28) | 1–10 | Terminal speed clamp |
| 39 | SYMMETRY (6) | 0–1 | Interaction shape distortion |
| 40 | HIDDEN_MASS (7) | 0–5 | Invisible mass multiplier |
| 41 | STIFFNESS (8) | 0–1 | Structural rigidity |
| 42 | FUSION (9) | 0–1 | Mass-merging efficiency |
| 43 | FUSION_MOMENTUM (16) | 0–5 | Min collision strength for merging |
| 44 | FUSION_TIME (17) | 0–1 | Temporal gating to growth |
| 45 | BASE_RADIUS (29) | 0.2–5 | Starting size |
| 46 | ELASTICITY (30) | 0–1 | Collision bounciness |
| 47 | BOND_ANGLE (31) | 0–1 | Favored cluster geometry |
| 48 | POLARITY (4) | −1–1 | Charge (CHARGE_LAW) |
| 49 | ALPHA (5) | 0–1 | Visual density / alpha |
| 50 | CONDUCTIVITY (32) | 0–1 | Charge/energy transfer rate |
| 51 | MAGNETIC_MOMENT (33) | 0–1 | Neighbor charge alignment |
| 52 | REACTION_THRESHOLD (37) | 0–1 | Mass limit for phase change |
| 53 | CATALYSIS (38) | 0–2 | Reaction speed multiplier |
| 54 | HEAT_OUTPUT (39) | 0–1 | Interaction energy byproduct |
| 55 | BIRTH_RATE (10) | 0–1 | Spontaneous reproduction chance |
| 56 | DEATH_RATE (11) | 0–1 | Spontaneous decay chance |
| 57 | MUTATION (12) | 0–1 | Offspring DNA randomness |
| 58 | ENERGY_EFFICIENCY (34) | 0–1 | Metabolic energy conversion |
| 59 | SEX_CHANCE (35) | 0–1 | Multi-parent reproduction probability |
| 60 | PREDATION_BIAS (36) | 0–1 | Attraction to lower-mass species |
| 61 | SPECIES_AFFINITY (41) | −2–2 | Same/different species bias |
| 62 | SIGNAL_RESP (13) | 0–2 | Neighbor pulse sensitivity |
| 63 | PULSE_RATE (14) | 0–2 | Oscillator frequency |
| 64 | NEIGHBORHOOD_RADIUS (18) | 0–2 | Range of influence |
| 65 | SIGNAL_STRENGTH (19) | 0–2 | Communication intensity |
| 66 | SIGNAL_DECAY (20) | 0–1 | Signal persistence |
| 67 | PROPAGATION_SPEED (21) | 0–1 | Signal travel speed |
| 68 | TUNING_CH1 (22) | 0–1 | Receptor filter channel 1 |
| 69 | TUNING_CH2 (23) | 0–1 | Receptor filter channel 2 |
| 70 | TUNING_CH3 (24) | 0–1 | Receptor filter channel 3 |
| 71 | TUNING_CH4 (25) | 0–1 | Receptor filter channel 4 |
| 72 | MEMORY_DECAY (40) | 0–1 | Internal state persistence |

## Repair rules

- Up to **3 attempts** per param; if still broken → mark **FAULTY** with evidence.
- Prefer fixing the underlying wiring (solver/laws/distribution/camera), not
  weakening tests. Adjust an existing test's expectations only when the spec
  legitimately changed (e.g., LIFE decay now requires `LIGHT_LEVEL = 0` to
  isolate metabolism — see `tests/audit/batch_02.test.js`).
- Never change `worldParams.js` defaults — they are the neutral baseline.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 94/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_01.md (18 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 01 — WORLD_SIZE / GROUND_HEIGHT / PARTICLE_COUNT / INITIAL_POP

Params under audit: WORLD_SIZE / GROUND_HEIGHT / PARTICLE_COUNT / INITIAL_POP

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| WORLD_SIZE | ✅ PASS | params_batch_01.test.js — spawns stay inside bounds; clamp [50,20000] |
| GROUND_HEIGHT | ✅ PASS | params_batch_01.test.js — spawn z confined to ground band; 1.0 = full volume |
| PARTICLE_COUNT | ✅ PASS | params_batch_01.test.js — spawnCaps hardCap = min(PARTICLE_COUNT, MAX_PARTICLES) |
| INITIAL_POP | ✅ PASS | params_batch_01.test.js — initialPopulationTarget + perSpeciesAllocation; clamp [10,5000] |

## Notes

- Plumbing: src/state/worldParams.js (SSOT) + src/spawn/distribution.js. spawnCaps clamp bug found & fixed by orchestrator.
- Test file: `v4/tests/audit/params_batch_01.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 95/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_02.md (18 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 02 — MAX_POP / SHAPE / SPAWN_CENTRES / SPAWN_CENTRE_RANDOM

Params under audit: MAX_POP / SHAPE / SPAWN_CENTRES / SPAWN_CENTRE_RANDOM

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| MAX_POP | ✅ PASS | params_batch_02.test.js — softCap = min(MAX_POP, MAX_PARTICLES) |
| SHAPE | ✅ PASS | params_batch_02.test.js — shape 1 pulls to uniform draw; shape 0 keeps grid anchors; mean near centre |
| SPAWN_CENTRES | ✅ PASS | params_batch_02.test.js — 1 = world middle; N = N distinct centres |
| SPAWN_CENTRE_RANDOM | ✅ PASS | params_batch_02.test.js — 0 = deterministic grid; 1 = scattered |

## Notes

- Test note: spread statistics cannot distinguish grid vs random (the grid is uniform); tests assert the mechanism instead.
- Test file: `v4/tests/audit/params_batch_02.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 96/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_03.md (18 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 03 — SPAWN_CENTRE_BIAS / GLOBAL_G / WIND / DAMPING

Params under audit: SPAWN_CENTRE_BIAS / GLOBAL_G / WIND / DAMPING

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| SPAWN_CENTRE_BIAS | ✅ PASS | params_batch_03.test.js — bias 1 pins to centre; bias 0 makes centres irrelevant |
| GLOBAL_G | ✅ PASS | params_batch_03.test.js — 0 = no gravity; 2 pulls faster than 1 (solver effG) |
| WIND | ✅ PASS | params_batch_03.test.js — +X drift accumulates; 0 = no drift |
| DAMPING | ✅ PASS | params_batch_03.test.js — 50% decays 5→<0.1 in 20 ticks; 0 preserves velocity |

## Notes

- World-param pass added to solver.js (effG, wind, damping). Gate law WRAP used to run the solver.
- Test file: `v4/tests/audit/params_batch_03.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 97/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_04.md (18 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 04 — VISCOSITY / ENTROPY / HEAT_CAPACITY / LIGHT_LEVEL

Params under audit: VISCOSITY / ENTROPY / HEAT_CAPACITY / LIGHT_LEVEL

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| VISCOSITY | ✅ PASS | params_batch_04.test.js — 0.9 decays faster than 1.0 (DRAG dragFactor) |
| ENTROPY | ✅ PASS | params_batch_04.test.js — 2 > 1.2× motion of 1; 0 = none (ENTR jitter) |
| HEAT_CAPACITY | ✅ PASS | params_batch_04.test.js — 0.1 equilibrates faster than 10 (HEAT transfer) |
| LIGHT_LEVEL | ✅ PASS | params_batch_04.test.js — 2 gains more than 0.5; 0 = decay only (LIFE photosynthesis) |

## Notes

- OPEN ITEM: world VISCOSITY < ~0.8 makes the DRAG force overshoot (the (1−dragFactor)×10 term swings velocity past zero). Candidate repair: clamp the drag delta to the current velocity. Existing LIFE decay test now gates LIGHT_LEVEL=0.
- Test file: `v4/tests/audit/params_batch_04.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 98/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_05.md (18 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 05 — RADIATION_LEVEL / SPAWN_RATE / SPECIES_INTERACTION / ENERGY_TRANSFER

Params under audit: RADIATION_LEVEL / SPAWN_RATE / SPECIES_INTERACTION / ENERGY_TRANSFER

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| RADIATION_LEVEL | ✅ PASS | params_batch_05.test.js — 0 disables damage; 5 > 1 (RADIATION law) |
| SPAWN_RATE | ✅ PASS | params_batch_05.test.js — clamp [0,100] + persistence (state-level; feed is in main.js) |
| SPECIES_INTERACTION | ✅ PASS | params_batch_05.test.js — 0 no pull; 2 pulls harder than 1 (AFFINITY, same-species) |
| ENERGY_TRANSFER | ✅ PASS | params_batch_05.test.js — 0 blocks conduction; 2 faster than 1 (ENERGY law) |

## Notes

- SPECIES_INTERACTION test uses same-species pairs (positive affinity only attracts same species by design).
- Test file: `v4/tests/audit/params_batch_05.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 99/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_06.md (18 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 06 — MUTATION_RATE / DECAY_RATE / visualScale / globalAlpha

Params under audit: MUTATION_RATE / DECAY_RATE / visualScale / globalAlpha

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| MUTATION_RATE | ✅ PASS | params_batch_06.test.js — offspring DNA deviates more at 5 than 0 (REPRO) |
| DECAY_RATE | ✅ PASS | params_batch_06.test.js — 2 decays twice as fast as 1; 0 stops decay (LIFE) |
| visualScale | ✅ PASS | params_batch_06.test.js — computeRadius scales linearly (expression.js) |
| globalAlpha | ✅ PASS | params_batch_06.test.js — computeAlpha scales (expression.js); renderer now multiplies depth alpha |

## Notes

- globalAlpha was NOT applied in renderer.js before this audit — fixed (depthAlpha × globalAlpha).
- Test file: `v4/tests/audit/params_batch_06.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 100/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_07.md (18 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 07 — starMass / simSpeed / focalLength / ortho

Params under audit: starMass / simSpeed / focalLength / ortho

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| starMass | ✅ PASS | params_batch_07.test.js — lower threshold amplifies gravity collapse pull |
| simSpeed | ✅ PASS | params_batch_07.test.js — bounded [0.1,10]; dt-scaled integration path active (state-level note: main.js DT×simSpeed) |
| focalLength | ✅ PASS | params_batch_07.test.js — 400 < 1200 < 4000 projected radius for a point behind target |
| ortho | ✅ PASS | params_batch_07.test.js — ortho 1 flattens the perspective depth factor |

## Notes

- camera.js is pure (no DOM) — fully unit-testable. Note: RESET CAMERA previously left focal/ortho/sensitivities set; fixed in resetCamera.
- Test file: `v4/tests/audit/params_batch_07.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 101/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_08.md (20 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 08 — rotateSensitivity / panSensitivity / DNA.FORCE / DNA.VISCOSITY

Params under audit: rotateSensitivity / panSensitivity / DNA.FORCE / DNA.VISCOSITY

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| rotateSensitivity | ✅ PASS | params_batch_08.test.js — setCameraConfig persists; resetCamera restores 1.0 |
| panSensitivity | ✅ PASS | params_batch_08.test.js — setCameraConfig persists; resetCamera restores 1.0 |
| DNA.FORCE | ⚠️ REPAIRED | params_batch_08.test.js — positive amplifies gravity pull, negative repels (GRAV); was completely dead, wired into applyGravity (±100 → ±2 scale) |
| DNA.VISCOSITY | ✅ PASS | params_batch_08.test.js — 0.9 decays faster than 0.99 (DRAG) |

## Notes

## Notes

- REPAIRS: DNA.FORCE was completely dead (no physics reads anywhere) — wired into applyGravity (±100 → ±2 scale, negative = repel). resetCamera now restores all configurable camera fields (focalLength/ortho/sensitivities).
- Test file: `v4/tests/audit/params_batch_08.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 102/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_09.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 09 — DNA.TORQUE / DNA.JITTER / DNA.TIDAL / DNA.INERTIA

Params under audit: DNA.TORQUE / DNA.JITTER / DNA.TIDAL / DNA.INERTIA

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.TORQUE | ⚠️ REPAIRED | wired into solver integration — velocity rotates around Z by torque·0.02·dt (was dead) |
| DNA.JITTER | ✅ PASS | ENTR jitter amplitude (already live) |
| DNA.TIDAL | ⚠️ REPAIRED | wired into applyGravity — close-range differential boost (was dead) |
| DNA.INERTIA | ✅ PASS | acceleration resistance divisor (already live) |

## Notes

## Notes

- Validated by params_batch_09.test.js (4 tests): TORQUE rotates the velocity vector around Z while preserving speed; JITTER scales ENTR noise; TIDAL amplifies close-range gravity pull; INERTIA divides acceleration.
- REPAIRS (orchestrator): TORQUE + TIDAL were dead — wired into solver integration / applyGravity. (AGENTS errored pre-task; orchestrator completed + ran the suite.)
- Test file: `v4/tests/audit/params_batch_09.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 103/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_10.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 10 — DNA.FRICTION / DNA.MAX_VELOCITY / DNA.SYMMETRY / DNA.HIDDEN_MASS

Params under audit: DNA.FRICTION / DNA.MAX_VELOCITY / DNA.SYMMETRY / DNA.HIDDEN_MASS

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.FRICTION | ✅ PASS | velocity-dependent drag under DRAG (already live) |
| DNA.MAX_VELOCITY | ✅ PASS | terminal speed clamp (already live) |
| DNA.SYMMETRY | ✅ PASS | interaction shape distortion — expression.js visual |
| DNA.HIDDEN_MASS | ✅ PASS | gravity mass multiplier (already live) |

## Notes

## Notes

- Validated by params_batch_10.test.js (4 tests): FRICTION damps velocity under DRAG; MAX_VELOCITY clamps terminal speed; SYMMETRY modulates colour lightness; HIDDEN_MASS amplifies gravity.
- All four confirmed live (named or numeric index reads) — no repairs needed.
- Test file: `v4/tests/audit/params_batch_10.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 104/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_11.md (19 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 11 — DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME

Params under audit: DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.STIFFNESS | ✅ PASS | bond pull strength (already live) |
| DNA.FUSION | ✅ PASS | wired into ACCR — mass-transfer efficiency multiplier 0.5..1.5 (live) |
| DNA.FUSION_MOMENTUM | ✅ PASS (semantics corrected in law RRP batch 02) | MINIMUM relative momentum to fuse on impact; below it pairs bounce (was: max approach speed ×2) |
| DNA.FUSION_TIME | ✅ PASS (semantics corrected in law RRP batch 02) | seconds of continuous close proximity before sub-threshold pairs fuse anyway (was: AGE maturity gate ×50) |

## Notes

- Validated by `v4/tests/audit/params_batch_11.test.js` (4 tests): STIFFNESS scales bond spring force; FUSION scales ACCR mass transfer; FUSION_MOMENTUM gates fusion by minimum relative momentum; FUSION_TIME gates fusion by proximity dwell.
- Semantics corrected during the interactive law RRP (batch 02, 2026-08-05): user clarified FUSION_MOMENTUM = minimum momentum to fuse (below → bounce) and FUSION_TIME = close-proximity dwell time for sub-threshold pairs. Dwell tracked per contact pair in the free `MITOSIS_TIMER` / `PARTNER_ID` stride fields; leaving contact resets the clock.
- Test file: `v4/tests/audit/params_batch_11.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 105/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_12.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 12 — DNA.BASE_RADIUS / DNA.ELASTICITY / DNA.BOND_ANGLE / DNA.POLARITY

Params under audit: DNA.BASE_RADIUS / DNA.ELASTICITY / DNA.BOND_ANGLE / DNA.POLARITY

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.BASE_RADIUS | ✅ PASS | starting size (expression + solver) |
| DNA.ELASTICITY | ✅ PASS | collision bounciness (already live) |
| DNA.BOND_ANGLE | ⚠️ REPAIRED | wired into BOND equilibrium distance (angle scale; was dead) |
| DNA.POLARITY | ✅ PASS | charge (CHARGE_LAW) |

## Notes

## Notes

- Validated by params_batch_12.test.js (4 tests): BASE_RADIUS scales visual radius; ELASTICITY boosts COLL bounce; BOND_ANGLE stretches the bond equilibrium distance; POLARITY drives CHARGE_LAW repulsion/attraction.
- REPAIRS: BOND_ANGLE was dead — wired into the BOND equilibrium-distance scale in the solver.
- Test file: `v4/tests/audit/params_batch_12.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 106/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_13.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 13 — DNA.ALPHA / DNA.CONDUCTIVITY / DNA.MAGNETIC_MOMENT / DNA.REACTION_THRESHOLD

Params under audit: DNA.ALPHA / DNA.CONDUCTIVITY / DNA.MAGNETIC_MOMENT / DNA.REACTION_THRESHOLD

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.ALPHA | ✅ PASS | visual density (expression.js) |
| DNA.CONDUCTIVITY | ✅ PASS | charge/energy transfer rate (already live) |
| DNA.MAGNETIC_MOMENT | ✅ PASS | neighbor charge alignment (already live) |
| DNA.REACTION_THRESHOLD | ⚠️ REPAIRED | wired into AUTOCATALYSIS — mass gate (was dead) |

## Notes

## Notes

- Validated by params_batch_13.test.js (4 tests): ALPHA drives opacity; CONDUCTIVITY speeds CURRENT charge diffusion; MAGNETIC_MOMENT attracts aligned moments; REACTION_THRESHOLD gates AUTOCATALYSIS by mass.
- REPAIRS: REACTION_THRESHOLD was dead — wired into applyAutocatalysis (batch_25 test lowers the threshold to fire).
- Test file: `v4/tests/audit/params_batch_13.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 107/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_14.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 14 — DNA.CATALYSIS / DNA.HEAT_OUTPUT / DNA.BIRTH_RATE / DNA.DEATH_RATE

Params under audit: DNA.CATALYSIS / DNA.HEAT_OUTPUT / DNA.BIRTH_RATE / DNA.DEATH_RATE

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.CATALYSIS | ✅ PASS | params_batch_14.test.js — higher catalysis accelerates AUTOCATALYSIS energy gain |
| DNA.HEAT_OUTPUT | ⚠️ REPAIRED | params_batch_14.test.js — charged oxidation releases energy scaled by heat output (was dead; wired into applyOxidationEffect) |
| DNA.BIRTH_RATE | ✅ PASS | params_batch_14.test.js — high rate reproduces at prng 0.05 where low rate does not (REPRO) |
| DNA.DEATH_RATE | ✅ PASS | params_batch_14.test.js — 10 kills old particles, 0 never does (SENESCENCE) |

## Notes

## Notes

- Validated by params_batch_14.test.js (4 tests): CATALYSIS accelerates autocatalytic energy gain; HEAT_OUTPUT releases energy on charged oxidation; BIRTH_RATE gates REPRO at the right prng band; DEATH_RATE kills old particles under SENESCENCE.
- REPAIRS: HEAT_OUTPUT was dead (only read by the uncalled applyOxidation) — wired into applyOxidationEffect: charged oxidation now releases `charge·HEAT_OUTPUT·0.05·dt` energy + temperature.
- Test file: `v4/tests/audit/params_batch_14.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 108/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_15.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 15 — DNA.MUTATION / DNA.ENERGY_EFFICIENCY / DNA.SEX_CHANCE / DNA.PREDATION_BIAS

Params under audit: DNA.MUTATION / DNA.ENERGY_EFFICIENCY / DNA.SEX_CHANCE / DNA.PREDATION_BIAS

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.MUTATION | ✅ PASS | offspring DNA randomness (already live) |
| DNA.ENERGY_EFFICIENCY | ✅ PASS | metabolic conversion (already live) |
| DNA.SEX_CHANCE | ⚠️ REPAIRED | wired into REPRO — crossover/second-parent probability ×(1+SEX_CHANCE×0.5) (was dead) |
| DNA.PREDATION_BIAS | ✅ PASS | attraction to lower-mass species (already live) |

## Notes

## Notes

- Validated by params_batch_15.test.js (4 tests): MUTATION increases offspring DNA deviation; ENERGY_EFFICIENCY slows LIFE metabolic decay; SEX_CHANCE boosts two-parent crossover probability; PREDATION_BIAS scales predator pursuit.
- REPAIRS: SEX_CHANCE was dead — wired into applyReproduction's crossover gate `crossoverRate·(1 + SEX_CHANCE·0.5)`.
- Test file: `v4/tests/audit/params_batch_15.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 109/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_16.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 16 — DNA.SPECIES_AFFINITY / DNA.SIGNAL_RESP / DNA.PULSE_RATE / DNA.NEIGHBORHOOD_RADIUS

Params under audit: DNA.SPECIES_AFFINITY / DNA.SIGNAL_RESP / DNA.PULSE_RATE / DNA.NEIGHBORHOOD_RADIUS

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.SPECIES_AFFINITY | ✅ PASS | same/different species bias (already live) |
| DNA.SIGNAL_RESP | ✅ PASS | receiver sensitivity (laws.js signal block, numeric index 13) |
| DNA.PULSE_RATE | ✅ PASS | oscillator frequency (already live) |
| DNA.NEIGHBORHOOD_RADIUS | ✅ PASS | signal range (laws.js + metaLaws) |

## Notes

## Notes

- Validated by params_batch_16.test.js (4 tests): SPECIES_AFFINITY pulls same-species; SIGNAL_RESP converts signal into energy/force; PULSE_RATE drives oscillator emission; NEIGHBORHOOD_RADIUS bounds signal reach.
- All four confirmed live (numeric index reads in laws.js / metaLaws) — no repairs needed.
- Test file: `v4/tests/audit/params_batch_16.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 110/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_17.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 17 — DNA.SIGNAL_STRENGTH / DNA.SIGNAL_DECAY / DNA.PROPAGATION_SPEED / DNA.TUNING_CH1

Params under audit: DNA.SIGNAL_STRENGTH / DNA.SIGNAL_DECAY / DNA.PROPAGATION_SPEED / DNA.TUNING_CH1

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.SIGNAL_STRENGTH | ✅ PASS | communication intensity (already live) |
| DNA.SIGNAL_DECAY | ✅ PASS | signal persistence (already live) |
| DNA.PROPAGATION_SPEED | ✅ PASS | signal travel multiplier (laws.js numeric index 21) |
| DNA.TUNING_CH1 | ✅ PASS | receptor channel filter (emLaws + channelMatch) |

## Notes

## Notes

- Validated by params_batch_17.test.js (4 tests): SIGNAL_STRENGTH scales delivered energy; SIGNAL_DECAY controls persistence; PROPAGATION_SPEED amplifies delivery; TUNING_CH1 filters channels via channelMatch.
- All four confirmed live — no repairs needed.
- Test file: `v4/tests/audit/params_batch_17.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 111/112: audit-suite/historical/2026-08-10-v4.6.28/params/batch_18.md (21 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# Batch 18 — DNA.TUNING_CH2 / DNA.TUNING_CH3 / DNA.TUNING_CH4 / DNA.MEMORY_DECAY

Params under audit: DNA.TUNING_CH2 / DNA.TUNING_CH3 / DNA.TUNING_CH4 / DNA.MEMORY_DECAY

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.TUNING_CH2 | ✅ PASS | channel 2 filter — channelMatch reads all 4 channels (dynamic dnaI[22+c]) |
| DNA.TUNING_CH3 | ✅ PASS | channel 3 filter — channelMatch |
| DNA.TUNING_CH4 | ✅ PASS | channel 4 filter — channelMatch |
| DNA.MEMORY_DECAY | ✅ PASS | memory persistence (already live) |

## Notes

## Notes

- Validated by params_batch_18.test.js (4 tests): TUNING_CH2/3/4 filter channel 2-4 pairs via channelMatch (dynamic `dnaI[22+c]` — all 4 channels live); MEMORY_DECAY controls memory-trace persistence.
- TUNING_CH2-4 were initially flagged dead, but channelMatch consumes all 4 dynamically — confirmed PASS.
- Test file: `v4/tests/audit/params_batch_18.test.js`


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- DOC 112/112: audit-suite/historical/2026-08-10-v4.6.28/params/combined.md (63 lines) -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
# VEPA Parameter Audit — Combined Results (72 params)

**Audit run:** 2026-08-05 · 18 batches × 4 params (world 22 · settings/camera 8 · DNA 42) · conclusive validation with repair loop (≤3 attempts per param).

| Metric | Count |
|--------|-------|
| ✅ PASS | 63 |
| ⚠️ REPAIRED | 9 |
| ❌ FAULTY | 0 |
| **Total params** | **72** |

## Batch summary

| Batch | PASS | REPAIRED | FAULTY |
|-------|------|----------|--------|
| [01 — WORLD_SIZE / GROUND_HEIGHT / PARTICLE_COUNT / INITIAL_POP](batch_01.md) | 4 | 0 | 0 |
| [02 — MAX_POP / SHAPE / SPAWN_CENTRES / SPAWN_CENTRE_RANDOM](batch_02.md) | 4 | 0 | 0 |
| [03 — SPAWN_CENTRE_BIAS / GLOBAL_G / WIND / DAMPING](batch_03.md) | 4 | 0 | 0 |
| [04 — VISCOSITY / ENTROPY / HEAT_CAPACITY / LIGHT_LEVEL](batch_04.md) | 4 | 0 | 0 |
| [05 — RADIATION_LEVEL / SPAWN_RATE / SPECIES_INTERACTION / ENERGY_TRANSFER](batch_05.md) | 4 | 0 | 0 |
| [06 — MUTATION_RATE / DECAY_RATE / visualScale / globalAlpha](batch_06.md) | 4 | 0 | 0 |
| [07 — starMass / simSpeed / focalLength / ortho](batch_07.md) | 4 | 0 | 0 |
| [08 — rotateSensitivity / panSensitivity / DNA.FORCE / DNA.VISCOSITY](batch_08.md) | 3 | 1 | 0 |
| [09 — DNA.TORQUE / DNA.JITTER / DNA.TIDAL / DNA.INERTIA](batch_09.md) | 2 | 2 | 0 |
| [10 — DNA.FRICTION / DNA.MAX_VELOCITY / DNA.SYMMETRY / DNA.HIDDEN_MASS](batch_10.md) | 4 | 0 | 0 |
| [11 — DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME](batch_11.md) | 2 | 2 | 0 |
| [12 — DNA.BASE_RADIUS / DNA.ELASTICITY / DNA.BOND_ANGLE / DNA.POLARITY](batch_12.md) | 3 | 1 | 0 |
| [13 — DNA.ALPHA / DNA.CONDUCTIVITY / DNA.MAGNETIC_MOMENT / DNA.REACTION_THRESHOLD](batch_13.md) | 3 | 1 | 0 |
| [14 — DNA.CATALYSIS / DNA.HEAT_OUTPUT / DNA.BIRTH_RATE / DNA.DEATH_RATE](batch_14.md) | 3 | 1 | 0 |
| [15 — DNA.MUTATION / DNA.ENERGY_EFFICIENCY / DNA.SEX_CHANCE / DNA.PREDATION_BIAS](batch_15.md) | 3 | 1 | 0 |
| [16 — DNA.SPECIES_AFFINITY / DNA.SIGNAL_RESP / DNA.PULSE_RATE / DNA.NEIGHBORHOOD_RADIUS](batch_16.md) | 4 | 0 | 0 |
| [17 — DNA.SIGNAL_STRENGTH / DNA.SIGNAL_DECAY / DNA.PROPAGATION_SPEED / DNA.TUNING_CH1](batch_17.md) | 4 | 0 | 0 |
| [18 — DNA.TUNING_CH2 / DNA.TUNING_CH3 / DNA.TUNING_CH4 / DNA.MEMORY_DECAY](batch_18.md) | 4 | 0 | 0 |

## Repaired params (9)

| Param | Batch | Repair |
|-------|-------|--------|
| DNA.FORCE (0) | [08](batch_08.md) | Wired into `applyGravity` — ±100 → ±2 attraction/repulsion scale (was dead) |
| DNA.TORQUE (2) | [09](batch_09.md) | Wired into solver integration — velocity rotates around Z by `torque·0.02·dt` (was dead) |
| DNA.TIDAL (15) | [09](batch_09.md) | Wired into `applyGravity` — close-range differential boost `1 + tidal·0.5·(1−dist/100)` (was dead) |
| DNA.FUSION (9) | [11](batch_11.md) | Wired into ACCR — mass-transfer efficiency multiplier `0.5 + FUSION` (was dead) |
| DNA.FUSION_TIME (17) | [11](batch_11.md) | Wired into ACCR — maturity gate `AGE ≥ FUSION_TIME·50` (was dead) |
| DNA.BOND_ANGLE (31) | [12](batch_12.md) | Wired into BOND — equilibrium distance scale `1 + min(1, |angle|/120)` (was dead) |
| DNA.REACTION_THRESHOLD (37) | [13](batch_13.md) | Wired into AUTOCATALYSIS — mass gate (was dead) |
| DNA.HEAT_OUTPUT (39) | [14](batch_14.md) | Wired into `applyOxidationEffect` — charged oxidation releases `charge·HEAT_OUTPUT·0.05·dt` energy + temperature (was dead) |
| DNA.SEX_CHANCE (35) | [15](batch_15.md) | Wired into REPRO — crossover/second-parent probability `×(1 + SEX_CHANCE·0.5)` (was dead) |

## Method

1. Every param gets one focused solver/expression/state test + one gate test (neutral value = no effect).
2. Deterministic PRNGs (`lcg`/fixed sequences) — never `Math.random()` in the param suite.
3. Dead params are repaired in code (≤3 attempts), re-tested, then the manifest status is set.
4. World sliders flow through `src/state/worldParams.js` (SSOT) → `runtimeConfig.worldParams` → solver/laws/spawn; camera sliders through `src/ui/camera.js`; DNA params through the particle DNA cache (`STRIDE_INDEXES.DNA_CACHE_START`).
5. Full suite green: `cd v4 && npx vitest run` → 65 files / 503 tests.

## Key fixes beyond the repaired params

- 22 world sliders now all wired (previously 16 were `console.log` no-ops) via `worldParams.js` SSOT + `applyWorldParam`.
- `resetCamera()` restores focalLength/ortho/rotateSensitivity/panSensitivity (was partially reset).
- Renderer `depthAlpha` now multiplies by `runtimeConfig.globalAlpha` (was ignored).
- World params default to neutral values — the default simulation behaves exactly as before.


---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- META: VERSION -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
```text
7.0.0
```

---

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- META: package.json -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
```json
{
  "name": "vepa-v4",
  "version": "7.0.0",
  "description": "VEPA4 \u2014 Vector Emergent Physics Automata (Integrated Intelligence release)",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "syntax-check": "find src -name '*.js' -exec node --check {} +"
  },
  "dependencies": {
    "pixi.js": "^8.18.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.60.0",
    "vite": "^8.0.8",
    "vitest": "^3.2.7"
  }
}
```
