# 🌌 VEPA4: Vector Emergent Physics Automata

**Integrated Intelligence** — the intelligence engines are alive.

## Versioning & Commits

- **Product:** **VEPA4**; versions use **`major.minor.build`** (npm-semver-native) —
  current: **8.7.0** (legacy label `4.8.7`). Retroactive mapping of the v4 line:
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
npm test       # Unit tests (77 files / 738 tests)
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
- **The dish is a field (v8.2)** — SETUP > WORLD > ENVIRONMENT gains a MEDIUM
  subgroup: WIND/THERMAL/EM/INFO field sliders, gravity wells, paired portals,
  and wall presets (border/ring/cross) that become impassable hard matter while
  the COLL law is on.
- **Civilizations (v8.3)** — groups emerge and build: dense communicative
  clusters become groups (declared or detected) with leader/forager/builder
  roles and multi-species membership; they build nests/hives + roads into the
  field grid, trade treasury between close neighbours (market prices written
  onto the INFO field), and collapse when membership dies. Watch it all in
  DATA > 🏙️ CIVILIZATIONS: territory overlay, network graph, economy Sankey.
- **A living world (v8.4)** — species diverge: when a species' isolation
  (spread + wall pinning in the E fields) exceeds its SPECIATION_THRESHOLD, a
  third of its members split into a new species that claims an extinct-freed
  slot (queued at the 64-slot cap). DATA > 🌿 ECO tracks population curves,
  biodiversity, oscillation, the food-web and niches; world events (famine /
  bloom / collapse) are metrics-triggered, physics-confirmed, and respond
  reversibly through the undo ring + field writes. Multiplex shards now
  evolve their species independently.
- **Performance knobs (v8.5)** — SETUP > WORLD > PERFORMANCE exposes the
  solver's interaction budget live: GRID RESOLUTION, CELL PARTICLE CAP,
  MAX INTERACTIONS and NEIGHBOR BUFFER. Lowering MAX INTERACTIONS buys ~30%
  at dense populations in exchange for truncated pair physics; `vepa4 bench
  --knobs` sweeps the trade-off matrix.
- **Deep Time (v8.6)** — the world remembers: SETUP > WORLD > TIME adds TIME
  SPEED (0.1–10×, a real solver-dt change), EPOCH LENGTH, and extinction /
  recovery thresholds. Eras advance on the epoch boundary with full-world
  snapshots you can restore; population collapse and rebound are detected,
  journaled, and answered reversibly with drought / fertilization field
  writes. The benchmark report SPA now serves at `/bench-report/`.
- **Memory & Culture (v8.7)** — learned traits outlive the particles that
  learned them: per-species and per-group memory buffers persist across
  generations. Child species inherit their parent's culture on speciation,
  groups blend their members' memories into a collective, and each species'
  memory adapts to energy, density and extinction epochs.

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
