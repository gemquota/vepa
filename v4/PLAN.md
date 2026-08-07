# Implementation Plan: VEPA v4 — Integrated Intelligence

**Date**: 2026-08-01 | **Status**: Complete | **Spec**: `SPEC.md`

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
