# VEPA Planning Traceability

This matrix links normalized planning areas to source records and the evidence required before claiming current implementation. Paths in the source column refer to the original repository locations.

## Status definitions

- **Designed:** present in an RRP intent/design record.
- **Historical claim:** a milestone or guide describes behaviour as present/implemented.
- **Needs verification:** current code/tests have not been independently audited as part of this document refactor.
- **Verified:** may be used only after current source and test evidence is added.

The entries below begin as **Needs verification** unless otherwise stated. This avoids turning historical documentation into an unsupported implementation claim.

## Catalog traceability

| Catalog area | Primary source | Secondary source | Evidence needed for verification |
|---|---|---|---|
| FM-A–FM-D tuning recipes and boundary modes | `GUIDE.md`, §1 | current DNA ranges and law definitions | Current trait ranges, boundary dispatch, seeded behaviour tests |
| FM-E/F colour schemes | `GUIDE.md`, §1 | UI/render modules | Current mapping and rendering tests |
| Medium, fields, walls, portals, wells | `docs/dev/rrp-trilogy/intent.md` | `PLAN.md`, v8.2 milestone | Field schema, `writeField`, solver integration, deterministic field tests |
| Civilizations and economy | `docs/dev/rrp-trilogy/intent.md` | `PLAN.md`, v8.3 milestone | Group registry, accounting paths, membership lifecycle, analytics tests |
| Ecology/speciation/events | `docs/dev/rrp-trilogy/intent.md` | `GUIDE.md`, `PLAN.md`, v8.4 milestone | Slot reuse, speciation queue, metrics, event confirmation and undo tests |
| Performance knobs | `GUIDE.md`, performance section | `PLAN.md`, v8.5/v8.15.1/v8.16.2 milestones | Actual parameter wiring, benchmark reproduction, regression thresholds |
| Deep time and epochs | `docs/dev/rrp-trilogy-2/intent.md` | `PLAN.md`, v8.6 milestone | Tick-boundary transitions, snapshot restore, memory bounds |
| Memory and culture | `docs/dev/rrp-trilogy-2/intent.md` | `GUIDE.md`, v8.7 section | Buffer alignment, transmission rules, replay tests |
| Agency and narrative | `docs/dev/rrp-trilogy-2/intent.md` | `PLAN.md`, v8.8 milestone | Action authority, caps, undo/journal tests |
| Artifacts, governance, infrastructure | `docs/dev/rrp-trilogy-3/intent.md` | `GUIDE.md`, v8.9–v8.11 milestones | Registry/economy consistency, field write caps, multi-tick construction tests |
| Exotic matter, relativity, quantum macroscale | `docs/dev/rrp-trilogy-4/intent.md` | `PLAN.md`, v8.12–v8.14 milestones | State lifecycle, deterministic transitions, conservation/bounds tests |
| Stellar physics, synthetic life, cosmology | `docs/dev/rrp-trilogy-5/intent.md` | `PLAN.md`, v8.15–v8.17 milestones | Thresholds, upkeep, shard exchange, runaway stress tests |
| Entropy, awareness, observer lifecycle | `docs/dev/rrp-trilogy-6/intent.md` | `docs/dev/rrp-trilogy-6/traceability.md` | Rebirth/replay, measurable graduation, bounded observer action tests |
| Intelligence, lineage, timeline, engine wiring | `PLAN.md`, Steps 6–9 | current engine/UI modules and unit tests | Entry-point wiring, tests for metrics/lineage/timeline/goals |
| Chaos multiplex | `PLAN.md`, v4.6.24–v4.6.26 milestones | `docs/mechanics/chaos_multiplex.md` | Shard isolation, import semantics, fitness tests, reproducible benchmarks |

## RRP design-record map

| Record | Scope | State in this collection |
|---|---|---|
| `docs/dev/rrp-trilogy/intent.md` | E, F, A | Consolidated into catalog; original remains authoritative history |
| `docs/dev/rrp-trilogy-2/intent.md` | D, G, H | Consolidated into catalog; original remains authoritative history |
| `docs/dev/rrp-trilogy-3/intent.md` | I, J, K | Consolidated into catalog; original remains authoritative history |
| `docs/dev/rrp-trilogy-4/intent.md` | L, M, N | Consolidated into catalog; original remains authoritative history |
| `docs/dev/rrp-trilogy-5/intent.md` | O, P, Q | Consolidated into catalog; original remains authoritative history |
| `docs/dev/rrp-trilogy-6/intent.md` | R, S, T | Consolidated into catalog; original traceability matrix remains useful history |

The paired `mermaid.md` files are source diagrams. They are not duplicated into this planning set because the normalized catalog and implementation plan are intended to be the maintained human-readable index. Link to or regenerate diagrams only when a concrete workflow requires them.

## Verification log

| Date | Scope | Result | Evidence |
|---|---|---|---|
| Pending | Full catalog-to-source audit | Not run as part of documentation restructuring | Add source paths, test commands/results, and commit SHA after audit |

## Change control

When a feature changes:

1. Update the catalog's intended behaviour and dependencies.
2. Update the implementation plan if order or acceptance criteria change.
3. Add or amend a decision/risk entry if architecture or safety bounds change.
4. Add source and test evidence here, including the commit tested.
5. Do not delete a historical design decision just because implementation differs; record whether it was superseded, rejected, or left incomplete.

## Product roadmap and RB crosswalk

The accepted roadmap and RB source set live in the separate [DayneK/vepa repository](https://github.com/DayneK/vepa). Links preserve provenance and do not imply that the source documents were copied into this repository.

| Product requirement / roadmap area | Catalog mapping | RB technical mapping | Status in source audit | Evidence required |
|---|---|---|---|---|
| Vision, emergence and governing principles | PR-01, PR-08, PR-14 | MASTER_SPEC §§1–5; RB-00–RB-11 | Design authority recorded; per-feature acceptance open | Separate acceptance for each rung; state/event evidence; no real-consciousness claim |
| Mobile-first experience, starter scenarios and seed provenance | PR-02, PR-03 | RB-00, RB-02, RB-03, RB-04, RB-08, RB-10 | Five starter scenarios and deterministic text-to-seed retention reported as unit-tested groundwork; full first-run/progression acceptance open | Current-source verification, browser tests, scenario fixtures and seed/config round-trip |
| Canonical configuration and law fidelity | PR-04, PR-05 | RB-03, RB-04, RB-05, RB-06, RB-09 | Partial restart staging reported; global atomicity, provenance and migration remain open | Cross-entry-point restart tests, schema validation, per-law semantics and migration fixtures |
| Replay, save/load, recovery and provenance | PR-06, PR-07, PR-08 | RB-01, RB-03, RB-04, RB-05, RB-09, RB-10 | Existing saves/undo and subsystem seams are partial evidence, not replay/recovery acceptance | State/RNG/cadence inventory, round-trip tests, failure injection and divergence reporting |
| Modular application shell and contracts | RB-01, RB-02, RB-11 | MASTER_SPEC §§3–5 | Proposed architecture; full ownership and teardown parity remain future work | Manifests, dependency graph, owner/cycle validation, integration tests and browser parity |
| Solver correctness and performance | PR-10 | RB-05, RB-06 | Exact CPU and approximate/GPU-assisted paths described in historical baseline; benchmark/fidelity acceptance open | Refresh backend inventory; differential tests; reproducible subsystem benchmarks |
| Selected GPU-rendered 3D direction | PR-09 | RB-02, RB-08 | Canvas2D/Pixi baseline described; target GPU 3D not evidenced as implemented or browser-verified | Real-browser GPU 3D tests, screenshots, camera/interpolation and explicit fallback tests |
| Optional remote/hosted execution | PR-11, PR-12 | RB-07, RB-09, RB-11 | No cloud simulation transport/provider contract evidenced in source baseline; proposal only | Security review, cost/retention/tenancy decision, auth/transport tests, checkpoint continuity and rollback |
| Emergent systems and observability | PR-01, PR-08 | RB-04, RB-05, RB-06, RB-10 | Existing systems partial; end-to-end provenance and replay evidence open | Event fixtures, detection vs confirmation, bounded actions, metric definitions and evidence links |
| Release governance and experimental isolation | PR-13, PR-14 | MASTER_SPEC §§4–6; RB-01–RB-11 | Constraints accepted; release-level evidence incomplete | Full test/build/browser suite, recovery/migration evidence, benchmarks, release notes and maintainer review |

## RB source map and status provenance

| Source record | Role in this plan | Status caveat |
|---|---|---|
| [VEPA Roadmap v4-5](https://github.com/DayneK/vepa/blob/main/VEPA_Roadmap_v4-5.md) | Accepted product decisions, phases, exclusions and final checklist | Product authority, not implementation report |
| [docs/ROADMAP_V4.md](https://github.com/DayneK/vepa/blob/main/docs/ROADMAP_V4.md) | Companion roadmap and rationale relative to historical PLAN | Companion target; root roadmap remains canonical |
| [RB MASTER_SPEC](https://github.com/DayneK/vepa/blob/main/docs/spec/rb/MASTER_SPEC.md) | Combined target architecture and cross-cutting contracts | Proposed design; not implementation authorization |
| [RB 00–11 specifications](https://github.com/DayneK/vepa/tree/main/docs/spec/rb) | Baseline and subsystem contracts | Mix of design targets and historical source observations; refresh before use |
| [ROADMAP_CROSSWALK](https://github.com/DayneK/vepa/blob/main/docs/spec/rb/ROADMAP_CROSSWALK.md) | Requirement and phase mapping | Mapping is not completion evidence |
| [ROADMAP_PROGRESS](https://github.com/DayneK/vepa/blob/main/docs/spec/rb/ROADMAP_PROGRESS.md) | Dated implementation/evidence status and actionable work queues | Dated 2026-10-15; reports browser acceptance blocked by missing libglib-2.0.so.0; refresh against target commit |
| [Module decomposition](https://github.com/DayneK/vepa/blob/main/docs/systems/module-decomposition.md) | Proposed boundaries and responsibility partition | Verify against actual imports, mutable state and test seams |
| [Meta-model](https://github.com/DayneK/vepa/blob/main/docs/systems/meta-model.md) | Shared vocabulary for entities, state and system relations | Semantic model does not prove runtime schema |
| [Complete systems atlas](https://github.com/DayneK/vepa/blob/main/docs/systems/complete-atlas.md) | Broad inventory of system/roadmap variants | Generated reference dated 2026-09-21; source files remain canonical and variants are not all approved scope |

## Verification log

| Date | Scope | Result | Evidence |
|---|---|---|---|
| Pending | Full catalog-to-source audit in target repository | Not run as part of this documentation integration | Record target commit, commands, test/build/browser results and benchmarks |
| 2026-10-15 (source report) | RB proposal's historical baseline | Browser acceptance not verified; Chromium host dependency missing | See linked ROADMAP_PROGRESS; this is source-reported, not a test run performed by this integration |

## Cross-repository maintenance rule

When source documentation changes, compare the accepted product roadmap first, then RB technical contracts and dated progress evidence. Update this plan only where new material adds requirements, clarifies dependencies or changes acceptance criteria. Keep source links and date/commit context; do not mirror entire master specs into this directory or allow duplicated copies to drift. If a source repository moves or disappears, record the provenance break rather than silently substituting another source.
