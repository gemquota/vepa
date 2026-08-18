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

## Milestone note (v8.7.0 — 2026-08-18)

- **Set G — Memory & Culture** (build 2 of the RRP D·G·H trilogy): persistent
  per-species / per-group memory buffers (`src/state/memoryBuffers.js`) outlive
  particles and generations; child species inherit parent culture on
  speciation, groups blend member memories into a collective, and species
  memory adapts to energy / density / extinction-epoch conditions, decaying
  without rehearsal. See `CHANGELOG.md` [8.7.0].

## Milestone note (v8.6.0 — 2026-08-18)

- **Set D — Deep Time & Epochs** (build 1 of the RRP D·G·H trilogy; design in
  `docs/dev/rrp-trilogy-2/`): the world advances through named eras on a tick
  boundary (`src/engines/epochEngine.js`) with restorable full-world snapshots
  (capped at 16); extinction / recovery are threshold-gated population deltas,
  answered reversibly via undo checkpoint + INFO field writes. The new TIME
  world-param group exposes TIME SPEED (live `runtimeConfig.simSpeed`), EPOCH
  LENGTH, and the two thresholds. The benchmark SPA now serves from
  `public/bench-report/`. See `CHANGELOG.md` [8.6.0].

## Milestone note (v8.5.0 — 2026-08-18)

- **Performance knobs**: the spatial-grid resolution / per-cell cap / neighbour
  gather cap (`src/physics/spatialGrid.js`) and the pair-interaction budget
  (`src/physics/solver.js`) are now runtime-tunable from a new SETUP > WORLD >
  PERFORMANCE accordion (`MAX_INTERACTIONS`, `NEIGHBOR_BUF`, `GRID_DIM`,
  `CELL_CAP`). `bench/solver.bench.mjs --knobs` sweeps the
  MAX_INTERACTIONS × NEIGHBOR_BUF matrix (median-of-rounds). Measured: ~30%
  throughput at 10k particles by lowering MAX_INTERACTIONS 500 → 100. See
  `CHANGELOG.md` [8.5.0].

## Milestone note (v8.4.0 — 2026-08-18)

- **Set A — Living World** (build 3, completing the E·F·A trilogy): DNA-slot
  speciation (`src/engines/speciation.js`) splits qualifying species under the
  SPECIATION_THRESHOLD × field-isolation gate, children claim extinct-freed
  slots (queue at cap), with burst/extinction events; the ECO sub-tab
  (DATA > 🌿) shows population curves, biodiversity, oscillation, food-web and
  niches via the metrics ring (`src/engines/ecoEngine.js`); world events
  (`src/engines/worldEvents.js`) are metrics-triggered + physics-confirmed and
  respond through undo-ring checkpoints + field writes; multiplex shards now
  evolve species independently. See `CHANGELOG.md` [8.4.0].

## Milestone note (v8.3.0 — 2026-08-18)

- **Set F — Civilizations** (build 2 of the RRP E·F·A trilogy): the group registry
  (`src/state/groupRegistry.js`) brings declared + detected groups with
  leader/forager/builder roles, unbounded multi-species membership (stride
  GROUP_ID 96 / GROUP_ROLE 97), and collapse death; construction
  (`src/state/construction.js`) writes nests/hives + roads into the E.1 field
  grid with griefing caps; the economy (`src/state/economy.js`) adds treasury,
  pairwise trade and grid market prices; DATA > 🏙️ CIVILIZATIONS shows the
  territory overlay, network graph and economy Sankey. See `CHANGELOG.md` [8.3.0].

## Milestone note (v8.2.0 — 2026-08-18)

- **Set E.1 — Matter & Medium** (first build of the RRP E·F·A trilogy; design in
  `docs/dev/rrp-trilogy/`): the dish becomes a field — `src/physics/fields.js` adds a
  coarse 3D field grid (12³–24³, auto-scaled) with vector (WIND/EM) + scalar
  (THERMAL/INFO) fields, COLL-gated impassable walls (hard-matter toggle), gravity
  wells, and paired portals; 11 new MEDIUM world sliders; gradient-force coupling,
  generalized advection, and the unified `writeField` API. See `CHANGELOG.md` [8.2.0].
