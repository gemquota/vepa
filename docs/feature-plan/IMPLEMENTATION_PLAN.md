# VEPA Implementation Plan

This plan turns the feature catalog into a verifiable delivery process. It is intentionally status-neutral: historical plans contain milestone claims, but current completion must be established against the branch being delivered.

## Delivery rules

1. **Audit before changing.** Inspect current code, tests, build scripts, and generated specifications before implementing a feature.
2. **Keep the baseline.** Record the current commit, runtime behaviour, benchmark profile, and relevant tests before refactoring.
3. **Implement vertical slices.** Each slice includes state/model changes, integration, UI/inspection, persistence where applicable, tests, and documentation.
4. **Preserve compatibility deliberately.** Save formats, deterministic seeds, public events, law identifiers, DNA slots, and import/export contracts require explicit migration decisions.
5. **Do not mark planned behaviour as shipped.** A design document, changelog entry, or passing build alone is not feature-level proof.
6. **Prefer shared primitives.** Reuse field writes, metrics/events, undo/snapshot, group/economy, memory, and worker boundaries rather than parallel implementations.

## Phase 0: Establish an evidence baseline

- [ ] Confirm default branch, current version, and canonical runtime entry points.
- [ ] Inspect the existing generated `docs/spec/` tree and run its drift check.
- [ ] Run existing unit/integration tests and production build; record results and known failures.
- [ ] Capture representative solver benchmarks at sparse, default, dense, and stress populations.
- [ ] Map current implementations for fields, solver/laws, species lifecycle, groups, persistence, timeline, multiplex, workers, UI, and analytics.
- [ ] Compare the current source against the historical claims in `PLAN.md`; log mismatches rather than assuming the plan is current.
- **Exit gate:** baseline commit, test/build results, benchmark command/output, and a source-backed status for each catalog entry are recorded.

## Phase 1: Stabilize core contracts

- [ ] Define authoritative ownership for simulation state and worker/main-thread synchronisation.
- [ ] Define deterministic random-number use and what state is required for replay.
- [ ] Specify field schema, update cadence, write budget, and the single mutation API.
- [ ] Specify event/metrics ownership, confirmation gates, cooldowns, and journal format.
- [ ] Specify species/group/particle lifecycle invariants for all parallel buffers and registries.
- [ ] Specify snapshot/undo/save validation and memory limits.
- **Exit gate:** invariants have tests; state mutations have clear owners; determinism and recovery failures are diagnosable.

## Phase 2: Physics and environment

- [ ] Validate boundary modes and hard-collision semantics.
- [ ] Validate scalar/vector fields, advection, walls, portals, and gravity wells.
- [ ] Integrate field and boundary changes with deterministic stepping and persistence.
- [ ] Add tests for conservation claims, caps, collision edge cases, and repeatable seeded runs.
- **Exit gate:** the environment behaves consistently at boundaries and under high density; benchmarks show acceptable regression bounds.

## Phase 3: Ecology and reproduction

- [ ] Validate the reproduction tiers and DNA/trait ranges against current source.
- [ ] Implement or correct speciation triggers, slot recycling, extinction queues, and lineage continuity.
- [ ] Add ecosystem metrics, food-web/niche views, and world-event confirmation.
- [ ] Test births/deaths/speciation at slot limits, including save/load and replay.
- **Exit gate:** no stale references after lifecycle changes; metrics match fixture data; events are bounded and reversible.

## Phase 4: Civilizations and shared economy

- [ ] Validate group detection/declaration, membership changes, roles, and treasury invariants.
- [ ] Implement construction, roads, barriers, trade, markets, and energy sharing on shared field/economy APIs.
- [ ] Add governance, alliances/conflicts, artifacts, upkeep, and mega-structure progression in dependency order.
- [ ] Add bounded write budgets, cooldowns, accounting checks, and inspectable group analytics.
- **Exit gate:** no unbounded entity/field growth; transfers are accounted for; group lifecycle and replay tests pass.

## Phase 5: Memory, agency, and narrative

- [ ] Implement persistent species/group memory and cultural transmission only after lifecycle contracts are stable.
- [ ] Add metrics-driven adaptation with bounded rates.
- [ ] Add species goals and narrative actions with explicit authority, rate limits, checkpointing, and journaling.
- [ ] Add epochs, snapshots, restore, and extinction/recovery events with validated memory caps.
- **Exit gate:** all autonomous changes are explainable in the journal, bounded, and reproducible from saved state.

## Phase 6: Artifacts, infrastructure, and multiplex

- [ ] Add treasury-backed artifacts and upkeep.
- [ ] Add extraction, energy networks, roads, and capped multi-tick construction.
- [ ] Verify shard isolation, per-shard random streams, fitness metrics, and import-on-exit semantics.
- [ ] Benchmark multiplex workload separately from the primary world.
- **Exit gate:** shard runs remain isolated unless explicit transfer occurs; resource creation and transfer are bounded and tested.

## Phase 7: Exotic and cosmic extensions

These are high-risk design extensions, not prerequisites for a stable core. Do not start until Phases 0–6 are verified.

- [ ] L: exotic-matter state, annihilation, conversion, and inverted-force rules.
- [ ] M: curvature, signal lensing, time dilation, and mass-energy accounting.
- [ ] N: superposition, entanglement, and tunnelling with deterministic collapse.
- [ ] O: stellar formation, collapse thresholds, and supernova events.
- [ ] P: synthetic entities and digital lineages with bounded upkeep.
- [ ] Q: cosmic epochs, cross-shard exchange, and controlled expansion.
- **Exit gate:** every extension has a precise state model, deterministic test fixtures, conservation/bounds checks where claimed, and stress tests for runaway effects.

## Phase 8: Entropy, awareness, and observer lifecycle

- [ ] R: implement slow entropy progression and validated seed/state-preserving rebirth.
- [ ] S: add diegetic awareness only as an explicit simulation mechanic; journal player interventions.
- [ ] T: define a deterministic, inspectable graduation predicate; cap and checkpoint observer actions; validate new-game-plus state.
- **Exit gate:** rebirth is reproducible, graduation is measurable, and observer actions cannot corrupt authoritative state.

## Phase 9: Release hardening

- [ ] Run syntax checks, complete test suite, production build, and performance benchmarks.
- [ ] Run deterministic replay/save-load tests across representative scenarios.
- [ ] Validate migration and recovery paths from pre-change saves where compatibility is promised.
- [ ] Check documentation generation/drift and verify source links.
- [ ] Record known limitations, benchmark environment, release notes, and maintainer review.
- **Exit gate:** acceptance criteria are met or explicitly waived with rationale; no unlabelled feature is represented as verified.

## Per-feature completion checklist

A feature is **Verified** only when all applicable checks are complete:

- [ ] User-visible behaviour and state transitions are specified.
- [ ] Dependencies and ownership boundaries are named.
- [ ] Source implementation exists in the current branch.
- [ ] Positive, negative, boundary, and lifecycle tests pass.
- [ ] Determinism/save-load/replay tests pass when state or randomness is involved.
- [ ] Performance and memory costs are measured when the feature affects hot paths or long-lived state.
- [ ] UI/analytics expose enough information to inspect the behaviour.
- [ ] Documentation and generated specs match the source.
- [ ] Risks, deferred scope, and compatibility effects are recorded.

## Product-roadmap alignment and RB extraction sequence

The sequence below aligns the existing RRP inventory to the accepted product roadmap and proposed RB module boundaries. Product acceptance remains governed by [the root roadmap](https://github.com/DayneK/vepa/blob/main/VEPA_Roadmap_v4-5.md); this plan is not a claim that any phase is complete.

### Phase A: Re-baseline and freeze acceptance contracts

- [ ] Record target repository HEAD, default branch, package scripts, entry points, tests, generated specs and working-tree state.
- [ ] Refresh the dated RB progress report against the exact target commit; separate source facts, test results, browser results and benchmarks.
- [ ] Run the real-browser suite in a supported environment; the source report says Chromium could not start because libglib-2.0.so.0 was missing.
- [ ] Create baseline fixtures for five starter scenarios, seed conversion, core controls, overlays, saves/import/export/undo and worker fallbacks.
- [ ] Map each accepted roadmap requirement to catalog IDs, implementation owners and acceptance evidence.
- **Exit gate:** commit-pinned baseline, commands/results, known failures, browser evidence and benchmark environment are recorded.

### Phase B: Configuration and state safety

- [ ] Define canonical state partitions for simulation, presentation and execution metadata.
- [ ] Route world/law/genome/species/preset/import changes through validated commands and coherent transactions.
- [ ] Enforce restart-only application of every physics-affecting change across UI, presets, imports, workers and adapters.
- [ ] Define schema versions, deterministic migrations, original-config preservation, undo boundaries and rollback on failure.
- [ ] Capture state required for each advertised replay guarantee, including RNG, clocks/cadence and mutable subsystem state where needed.
- **Exit gate:** tests prove no mid-run physics mutation, no partial mutation on invalid input, preserved recovery data and documented replay limits.

### Phase C: Modular seams without a big-bang rewrite

- [ ] Define versioned module manifests and narrow ports for world read models, commands, tick source, renderer, events and persistence.
- [ ] Extract pure schemas/helpers, then session/world lifecycle, then UI/read models and renderer adapters, then solver stages.
- [ ] Keep the legacy entry facade until callers and parity fixtures migrate.
- [ ] Validate dependency cycles, missing capabilities, incompatible contracts and duplicate state ownership.
- [ ] Ensure startup/teardown are idempotent and dispose listeners, workers, timers, transport, renderer and cached views.
- **Exit gate:** modules are contract-testable and integrated single-package app passes characterization tests.

### Phase D: Solver, laws and performance evidence

- [ ] Describe each law's semantics, dependencies, state/read/write set, cadence/order, stability bounds, backend support and approximation.
- [ ] Keep exact CPU as correctness reference; compare accelerated paths against equivalent workloads.
- [ ] Benchmark simulation TPS/tick latency, rendering FPS/frame time, memory, allocation/GC, worker/queue overhead and persistence separately.
- [ ] Include mobile/reference hardware, density, population, law mix, fields and seeds; report warmup, median/p95 and accuracy/error.
- [ ] Permit performance degradation only in designated rendering layers, never in laws, state, event outcomes or deterministic progression.
- **Exit gate:** reproducible benchmark report, explicit fidelity envelope and regression limits.

### Phase E: Selected renderer and product progression

- [ ] Implement GPU-rendered 3D behind the renderer port; current Canvas2D/Pixi is baseline or explicit fallback, not target completion.
- [ ] Verify camera, resize/DPR, drawer states, touch interaction, law colors, particle densities, selection/help and frame interpolation in a real browser.
- [ ] Complete the physics-only tutorial and spoiler-safe progression with separate acceptance criteria for each emergence rung.
- [ ] Confirm five starter scenarios and deterministic text-to-seed provenance in first-run and saved-world paths.
- **Exit gate:** browser evidence and per-rung acceptance are recorded; fallback never changes simulation outcomes.

### Phase F: Emergent history and civilization systems

- [ ] Stabilize species/lineage lifecycle and event/metrics contracts before deeper memory, culture, agency or narrative behaviour.
- [ ] Ensure civilization, relationships, technology and notable-event records are traceable to modelled state and rules.
- [ ] Distinguish observation, derived metric, inference and uncertainty in analytics and story summaries.
- [ ] Keep automatic actions bounded, inspectable, journaled and reversible/checkpointed where supported.
- **Exit gate:** event classes and lineage changes have deterministic fixtures and evidence-linked inspection.

### Phase G: Persistence, replay, sharing and operations

- [ ] Verify save/load round trips, migrations, incompatible-import rejection, protected recovery and divergence reporting.
- [ ] Complete replay verification before fast-forward, challenges, public leaderboards or gallery ranking.
- [ ] Keep worlds unlisted by default; require explicit publication and preserve read-only visitor defaults.
- [ ] Treat hosted compute as optional until security, cost, retention, tenancy, recovery and rollback decisions are approved.
- [ ] Verify hosting economics and operational rollback before hosted-world launch.
- **Exit gate:** each launched capability meets its exact roadmap acceptance checklist.

### Phase H: Research and deferred extensions

- [ ] Consider RRP sets L–T and speculative capabilities only after core roadmap phases pass their gates.
- [ ] Run experiments in separate worlds/saves with hypothesis, success criteria, cost profile, reproducibility limits and promote/revise/abandon decision.
- [ ] Do not imply real consciousness or validated physical theory from fictional or approximate simulation mechanics.
- **Exit gate:** explicit research decision and isolation evidence.

## RB module-to-phase map

| Module | Earliest useful phase | Dependencies | Required exit evidence |
|---|---|---|---|
| RB-00 Baseline | A | None | Commit-pinned inventory, fixtures, tests and benchmarks |
| RB-01 Shell/orchestrator | C | Baseline, state/command contracts | Lifecycle, composition validation and browser parity |
| RB-02 Visual shell/UI | C–E | Shell, command/read-model contracts | Interaction and visual browser tests |
| RB-03 World parameters | B | Canonical state and validation | Restart-only changes, migration and provenance tests |
| RB-04 Species/genome | B, then F | Canonical state and lifecycle contracts | Slot/buffer invariants and replay fixtures |
| RB-05 Law ontology | B–D | Config contract, solver ownership | Per-law semantics and fidelity evidence |
| RB-06 Solver/performance | A, then D | State ownership and deterministic tick contract | Correctness oracle and reproducible benchmarks |
| RB-07 Execution/cloud | C; remote only in G | Compute port, persistence guarantees | Local fallback, transport security and recovery tests |
| RB-08 Renderer | A baseline, then E target | RenderFrame contract | GPU 3D browser acceptance and explicit fallback |
| RB-09 Persistence | A–B, then G | Canonical state/schema | Migration, integrity, recovery and replay tests |
| RB-10 Emergent/observability | B, then F | Events, metrics, lifecycle and provenance | Bounded effects and evidence-grounded histories |
| RB-11 Module integration | C | Module manifests/contracts | Cycle/owner checks, integrated build and contract suite |
