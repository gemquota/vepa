# Feature Specification: VEPA v4 — Integrated Intelligence

**Version**: 4.0.0 | **Date**: 2026-08-01 | **Base**: v3 (3.1.0 + WIP)
**Audit input**: `audit/FULL_AUDIT_2026-08-01.md`

## Problem Statement

VEPA v3 recreated the simulation with clean module boundaries, but the five
intelligence engines — Insight, Narrative, Goal, Lineage, Timeline — were left
disconnected from the application (compiled factories, zero imports in
`main.js`). The communication DNA group (11 parameters) was inert in the
physics engine, and PREDATION — a v2 law — existed only as a function miswired
under the TRACK toggle. The result: a physics sandbox with no narrative,
no evolution history, no self-tuning, and no replay.

VEPA v4 closes that gap: engines become first-class citizens of the simulation
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
