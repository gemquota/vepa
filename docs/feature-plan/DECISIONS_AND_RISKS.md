# VEPA Decisions and Risks

This document consolidates recurring constraints from the GUIDE, PLAN, and RRP intent records. It records design direction, not proof that the corresponding mechanism is fully implemented.

## Architectural decisions

| ID | Decision | Rationale | Required verification |
|---|---|---|---|
| ADR-FP-01 | One authoritative field-mutation API | Avoid divergent write paths and make field effects inspectable/reversible | Search all writes; test caps, determinism, and undo behaviour |
| ADR-FP-02 | One event/metrics ownership path | Avoid competing aggregate state and inconsistent event detection | Trace metric production, event confirmation, journal, and consumers |
| ADR-FP-03 | Deterministic random decisions | Support reproducible seeds, replay, and debugging | Inventory RNG calls; test same seed/config/state yields matching outcomes |
| ADR-FP-04 | Explicit lifecycle invariants | Parallel particle buffers, species slots, groups, and shards must stay aligned | Test spawn/death/speciation/import/reset and save/load |
| ADR-FP-05 | Autonomous changes are bounded and inspectable | Prevent runaway agents/events and unexplained state changes | Rate limits, checkpoint/journal tests, action caps |
| ADR-FP-06 | Reuse existing law slots unless a law-budget change is approved | Later RRP designs state that the 128-law budget is full | Verify actual bitmask/law count; require a migration decision before widening |
| ADR-FP-07 | Measure performance by subsystem | Solver, worker overhead, rendering, multiplex, and memory costs differ | Repeatable benchmarks with environment, population, settings, and units |
| ADR-FP-08 | Separate design intent from implementation status | Plans and changelogs can become stale | Every verified claim links to current source and test evidence |
| ADR-FP-09 | Treat scientific language carefully | Exotic, quantum, relativistic, and awareness concepts are simulation mechanics, not validated physical theories or real sentience | UI and docs label approximations, assumptions, and diegetic effects |

## Cross-cutting risks

| Risk | Failure mode | Mitigation / acceptance check |
|---|---|---|
| State-buffer drift | Particle death/spawn/speciation leaves parallel arrays misaligned | Central lifecycle operations; assertions and randomized lifecycle tests |
| Non-determinism | Unseeded randomness, timing-dependent workers, or unordered updates break replay | Explicit RNG ownership; fixed tick boundaries; golden-run comparisons |
| Field-write runaway | Walls, roads, events, or exotic zones fill the grid or overwrite each other | Write budgets, per-tick caps, priority/ownership semantics, stress tests |
| Event storms | Threshold oscillation repeatedly triggers events and mutations | Detection/confirmation split, hysteresis, cooldown, journal review |
| Undo/snapshot growth | Full-world snapshots exhaust memory | Explicit retention limits, size estimates, eviction policy, recovery tests |
| Performance collapse | Pairwise work, dense fields, or multiplex shards overwhelm the solver | Spatial gather limits, allocation-free hot paths, benchmarks across density levels |
| Economy exploits | Trade, extraction, crafting, or shared power creates unbounded resources | Accounting invariants, upkeep, transaction logs, caps |
| Exotic-state cascades | Annihilation, conversion, supernovae, or shard exchange trigger chain reactions | Rate caps, cooldowns, conservation checks, bounded interaction radius |
| Time/relativity instability | Scaled timestep or dilation freezes or destabilizes simulation | Clamp ranges, stable solver envelope, extreme-value tests |
| Save/rebirth corruption | Partial state restoration silently loses lineage, epochs, or RNG state | Versioned schema, validation before mutation, rollback on failure |
| UI misrepresentation | Overlays suggest certainty or scientific validity not supported by the model | Show metric definitions, inputs, model assumptions, and status |
| Plan/source drift | Old plan text conflicts with current runtime | Automated spec drift checks plus manual traceability review |

## Decisions still requiring explicit resolution

1. **Law capacity:** verify the current law representation and whether the 128-law ceiling remains binding before adding laws or changing bitmasks.
2. **State ownership:** confirm which structures are authoritative on the main thread, worker, or shared memory and document synchronization rules.
3. **Persistence contract:** define the exact saved state needed for deterministic replay, including RNG state, configuration, event history, lineage, epochs, and version metadata.
4. **Feature truth:** classify each catalog entry against current source as verified, partially implemented, designed, deferred, or absent.
5. **Performance targets:** define separate baseline and target thresholds for solver throughput, worker latency, rendering frame time, memory, and persistence.
6. **Scientific framing:** label simulated approximations and fictional mechanics clearly; avoid implying that emergent behaviour demonstrates real consciousness or reproduces physical quantum/relativistic phenomena.

## Historical notes

The historical PLAN includes milestone-specific test counts, performance numbers, and implementation descriptions. Treat them as dated claims tied to their recorded version and environment, not as current performance guarantees. Preserve original numbers only when their original benchmark setup can also be recovered.

## Product-authority decisions imported from RB / Roadmap v4

These decisions come from the accepted product roadmap and the RB translation in [DayneK/vepa](https://github.com/DayneK/vepa). They govern this combined plan unless the product roadmap is explicitly revised.

| ID | Decision | Consequence | Verification / approval gate |
|---|---|---|---|
| ADR-RB-01 | Accepted product roadmap outranks RB technical proposals and historical RRP plans | RB algorithms and old milestone language cannot override product requirements | Record conflicts and resolve via roadmap change control |
| ADR-RB-02 | GPU-rendered 3D is the selected renderer direction | Canvas2D/Pixi are baseline/compatibility or explicit fallback paths | Real-browser visual/interaction evidence and capability fallback tests |
| ADR-RB-03 | Physics-affecting law and parameter changes require new-world start or explicit restart | All entry points stage configuration; no active-run mutation | Test UI, preset, import, worker and adapter paths |
| ADR-RB-04 | Performance degradation may simplify only designated rendering layers | No hidden change to physics, law dispatch, event outcomes or deterministic progression | Report active backend and test outcomes across render-quality settings |
| ADR-RB-05 | Experimental features remain isolated to separate experimental worlds/saves | Research features cannot silently enter stable runs | Isolation, import/export and promotion tests |
| ADR-RB-06 | Local browser execution remains default; hosted/remote compute is optional | No account/network requirement for local boot; provider choice remains open | Offline smoke tests, explicit authority transitions and security review |
| ADR-RB-07 | Easy and Advanced are views over the same canonical values | Mode changes preserve values; Easy recipes define keys, formulas, units, bounds and reverse projection | Round-trip/conflict tests and domain review |
| ADR-RB-08 | Observations, derived metrics, inference and uncertain interpretations remain distinct | Analytics and story text cannot imply unsupported certainty | Provenance tests and UI review |
| ADR-RB-09 | Privacy defaults are explicit, including unlisted-by-default shared worlds and separate diagnostics/analytics | Publication and telemetry choices cannot be conflated | Default-state, opt-out, retention and access-control tests |
| ADR-RB-10 | Stable release is blocked by any known defect under the accepted roadmap | Severity alone cannot waive the release gate | Roadmap revision required for any exception |

## Additional risks introduced by modularization and target migration

| Risk | Failure mode | Mitigation / acceptance check |
|---|---|---|
| False modularity | Files split while sharing mutable singletons or hidden import side effects | Versioned manifests, narrow ports, owner graph, cycle checks and contract tests |
| Split-brain state | UI, worker, remote adapter or renderer independently mutates authoritative state | Single session authority; commands/acks; renderer and analytics remain read-only projections |
| Partial restart staging | One entry point applies laws/settings immediately while another stages them | Central command/transaction service and cross-entry-point tests |
| Render/compute confusion | GPU rendering is mistaken for GPU physics, or gravity pre-pass is described as full GPU simulation | Separate capability reporting and backend-specific fidelity tests |
| Remote continuity overclaim | Local/remote switch loses RNG, clocks or pending events while promising deterministic continuation | Require full checkpoint schema and replay proof; otherwise state limitations |
| Stale baseline | Historical RB counts/implementation claims treated as current | Pin audits to commit and refresh progress before implementation |
| Browser evidence gap | DOM stubs or test definitions treated as real-browser acceptance | Run supported Chromium/primary mobile browser and retain screenshots/results |
| Roadmap drift | Older RRP order causes speculative work to outrank accepted product phases | Product roadmap phases govern release priority; RRP remains subordinate inventory |
| Unapproved service assumptions | Cloud provider, cost, identity, retention or tenancy inferred from transport interface | Explicit ADR and security/operational acceptance before hosted implementation |
| False completion through docs | Consolidated plan appears to prove feature exists | Keep design, historical claim, implementation evidence and verified acceptance distinct |

## Open decisions carried forward

1. Which exact commit and browser/hardware environment define the refreshed baseline?
2. Which graphics API implements GPU-rendered 3D, and which fallback choices are explicitly offered?
3. What is the canonical schema and owner for each state aggregate, RNG stream, subsystem clock and event journal?
4. Which module boundaries are justified by actual imports, mutable state and test seams?
5. Which Easy-mode composites are approved, with exact keys, formulas, units, bounds and reverse mappings?
6. What fidelity/error guarantees are acceptable for each approximate or accelerated solver backend?
7. What provider, region, tenancy, price, retention and rollback contract would authorize hosted worlds?
8. What is the evidence-backed state of each roadmap phase after browser, replay, performance and recovery tests?


## Roadmap v4 product and scope constraints

| Constraint | Planning consequence | Required evidence |
|---|---|---|
| Mobile-browser-first, neon-noir experience | Design and verify primary flows for touch/small viewport; preserve the visual contract while keeping science inspection usable | Real-browser tests on target mobile-class devices and documented fallback behavior |
| Secret progression | Teach physics first; reveal rung labels/help only after progression reaches them | First-run tests verify tutorial duration and spoiler-safe unlock rules |
| Five starter scenarios and deterministic text-to-seed | Scenario identity and exact seed text are part of provenance, not incidental UI state | Stable conversion, scenario config round-trip and launch/replay fixtures |
| Replay honesty | Seed alone is insufficient if mutable state, RNG streams, clocks, versions or interventions are omitted | State inventory, compatibility matrix, replay differential tests and explicit divergence reporting |
| Safe persistence | A failed import/migration must not corrupt the active world or destroy the only good save | Preflight validation, atomic/rollback behavior and failure-injection tests |
| Evidence-linked emergence | Each rung requires causal model rules and observable state/history | Per-rung acceptance fixtures and source/event/checkpoint links |
| Distinct social and biological channels | Genetics, kinship, care, group membership, culture and institutions cannot be inferred interchangeably | Ontology tests and long-run transmission/continuity scenarios |
| Local-first with optional hosting | Hosted compute cannot become a prerequisite for local play | Offline launch, local fallback, explicit remote authority and security/cost review |
| Privacy and community safety | Shared worlds unlisted by default; publication explicit; diagnostics separate from analytics | Default/opt-out, permissions, retention, moderation and rollback tests |
| No silent performance degradation | Only designated rendering layers may degrade under pressure | Compare simulation state/outcomes across render-quality settings |
| Stable release gate | Any known defect blocks stable release under accepted roadmap policy | Reproducible release checks and maintainer-approved roadmap change if policy changes |
| Scope containment | Old RRP sets, 48 system roadmap variants and experimental research are not automatically release commitments | Traceable inclusion decision, isolated world/save and explicit promotion gate |

## Decomposition and audit governance

The source [DECOMPOSITION_PLAN.md](https://github.com/DayneK/vepa/blob/main/docs/DECOMPOSITION_PLAN.md) is explicitly proposed and says extraction has not been executed. This consolidated feature plan does not grant the pending approval. Any future extraction must be incremental, behavior-preserving, one module/commit at a time, and gated by tests and benchmark parity.

The source audit-remediation plan also includes backend correctness and provenance decisions. Reopening a resolved item requires current evidence and a specific regression or changed requirement; declaring it resolved requires its current executable gate and supporting evidence. Historical PLAN/changelog claims are leads, not a substitute for current acceptance.
