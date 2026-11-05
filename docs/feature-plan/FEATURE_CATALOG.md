# VEPA Feature Catalog

**Purpose:** a normalized inventory of feature concepts described across the field manual, implementation plan, and RRP intent records.

**Status:** catalogued from planning material; runtime status remains unverified unless an item is explicitly linked to current source and tests in [TRACEABILITY.md](TRACEABILITY.md).

## 1. Field-manual controls and recipes

These letter labels come from `GUIDE.md`. They are tuning/interaction concepts, not the same namespace as the RRP release sets below.

| ID | Concept | Intended effect | Important qualification |
|---|---|---|---|
| FM-A | Kinetic Buffer | Balance attraction/force with viscosity and jitter so clusters settle rather than oscillate or explode | Recipe values are starting points, not universal stable settings |
| FM-B | Geometric Lock | Combine symmetry, stiffness, and torque to encourage non-circular interlocking structures | Validate against actual solver ranges and current DNA schema |
| FM-C | Social Oscillator | Couple signal response, pulse rate, and alpha/state to produce propagating group activity | Requires signal propagation to be active and measurable |
| FM-D | Boundary Condition | Select periodic wrap, solid bounce, open/void escape, or sticky boundary behaviour | Confirm current boundary-law names and semantics in code |
| FM-E | Categorical Law Colors | Use category-based colour encoding to distinguish law families | Presentation-only unless the runtime uses colour as more than display metadata |
| FM-F | Evolutionary Coloring | Let colour reflect evolving/species state to expose change over time | Define stable mappings and accessibility expectations |

## 2. Cross-cutting world and interaction systems

| ID | Capability | Intended behaviour | Key dependencies / safeguards |
|---|---|---|---|
| X-01 | Dish as Medium | A coarse 3D field grid carries WIND, EM, THERMAL, and INFO; gradients influence particles | Field schema, bounded writes, deterministic updates, grid scaling |
| X-02 | Walls and portals | Configurable border/ring/cross barriers and paired portals | Clarify decorative vs impassable walls; cap field writes; deterministic transfer |
| X-03 | Civilizations | Detect or declare groups, assign roles, build territory structures, and trade | Group registry, membership lifecycle, treasury accounting, overlays |
| X-04 | Living world / ecology | Speciation, extinct-slot reuse, biodiversity, population trends, food webs, niche analysis | Species-slot invariants, event cooldowns, deterministic reproduction |
| X-05 | World events | Detect famine, bloom, and collapse from metrics plus confirming conditions; apply reversible responses | Event hysteresis, cooldowns, undo/checkpoint, journal |
| X-06 | Performance controls | Expose grid resolution, per-cell cap, interaction cap, and neighbour buffer | Clearly state fidelity/performance trade-offs; benchmark matrix |
| X-07 | Deep time | Tick-based epochs, restorable snapshots, time speed, extinction/recovery thresholds | Snapshot bounds, solver stability, persistence validation |
| X-08 | Memory and culture | Persistent species/group memory, transmission, condition-driven adaptation | Keep arrays aligned through births, deaths, speciation, and slot reuse |
| X-09 | Agency and narrative | Goal-directed species and bounded narrative actions; journal milestones | Rate limits, explicit permissions, reversible changes |
| X-10 | Tools and artifacts | Treasury-funded tools, weapons, and barriers with upkeep/decay | Economy bounds, ownership, write budgets |
| X-11 | Society and governance | Group policies, alliances, conflict, migration, and trade effects | Cooldowns, bounded policy changes, reversible territory effects |
| X-12 | Infrastructure and energy | Resource extraction, energy sharing, roads, and long-horizon structures | Energy conservation, construction caps, multi-tick state consistency |
| X-13 | Chaos multiplex | Independent shards, fitness metrics, variation controls, optional import/export | Isolation, deterministic seeds, explicit import semantics |
| X-14 | Intelligence/lineage/timeline | Cluster insight, births/deaths, lineage depth, snapshots, scrubbing, and goal logs | Memory cost limits, lifecycle correctness, reproducible replay |
| X-15 | Reproduction tiers | Three-tier reproduction concept described in the guide | Exact tiers and thresholds must be checked against current implementation |

## 3. RRP release-set catalogue

The RRP letters below refer to planned release sets. They are distinct from FM-A–FM-F above. The design narrative describes an 18-set lifecycle across six three-set documents. The sequence is a dependency map, not proof that every set shipped.

### E · F · A: Matter, civilizations, living world

| Set | Focus | Main design elements |
|---|---|---|
| E / E.1 | Matter and medium | Vector/scalar fields, generalized advection, wall flags, biomes, portals, gravity wells, opt-in hard collisions through COLL |
| F | Civilizations | Group registry, construction, treasury/trade, market fields, group analytics |
| A | Living world | Isolation-driven speciation, recycled species slots, ecosystem analytics, confirmed world events, shard-level evolution |

### D · G · H: Memory and agency

| Set | Focus | Main design elements |
|---|---|---|
| D | Deep time and epochs | Tick-boundary eras, snapshots, extinction/recovery events, solver-time controls |
| G | Memory and culture | Persistent species/group memory, cultural transmission, field-driven behavioural adaptation |
| H | Agency and narrative | Bounded narrative actions, species goals, journaled milestones |

### I · J · K: Tools and societies

| Set | Focus | Main design elements |
|---|---|---|
| I | Tools and artifacts | Per-group inventories, treasury-funded crafting, upkeep/decay, tool/weapon/barrier effects |
| J | Society and governance | Policy vectors, alliances, conflicts, and policy-driven behaviour |
| K | Infrastructure and energy | Resource extraction, energy grids, roads, and capped mega-structures |

### L · M · N: Transforming the substrate

| Set | Focus | Main design elements |
|---|---|---|
| L | Exotic matter | Antimatter, dark/strange/negative-mass zones, particle state tags, bounded interactions |
| M | Relativity | Curvature field, signal lensing, time dilation, bounded mass-energy conversion |
| N | Quantum macroscale | Superposition, entanglement semantics, energy-gated tunnelling, observer-triggered collapse |

### O · P · Q: Cosmic scale

| Set | Focus | Main design elements |
|---|---|---|
| O | Stellar physics | Stellar wells, energy/radiance, black-hole thresholds, supernova shockwaves |
| P | Synthetic life | Non-DNA organisms, digital lineage copies, machine groups |
| Q | Cosmology | Cross-shard exchange, cosmic epochs, slow expansion/dark-energy model |

### R · S · T: Completion and rebirth

| Set | Focus | Main design elements |
|---|---|---|
| R | Entropy and rebirth | Heat death, contraction/reboot, upkeep-driven structural decay |
| S | Simulation awareness | Threshold-based in-world awareness, journaled player interventions, inspection UI |
| T | The observer | Bounded god-mode edits, measurable graduation predicate, new-game-plus seeded from prior runs |

## 4. Shared system contracts

All feature sets should reuse shared infrastructure where practical rather than creating competing state owners:

- **Fields:** one canonical field-write API; explicit field type and units; bounded writes and deterministic update cadence.
- **Events and metrics:** one event/metrics path; separate detection from confirmation; hysteresis and cooldowns for recurring events.
- **Reversibility:** world-changing automation and observer actions checkpoint before mutation where the undo system supports it.
- **Determinism:** seed all random decisions; define tick boundaries; ensure replay and save/load cover all authoritative state.
- **Lifecycle:** births, deaths, slot reuse, imports, and shard resets update every parallel state structure consistently.
- **Performance:** benchmark the actual hot path; separate solver, worker, render, memory, and persistence costs.
- **Presentation:** analytics must disclose their inputs and definitions; colour and overlays must not imply scientific certainty the model does not provide.

## 5. Scope cautions

Some RRP items explicitly reserve true sentience claims, rendered spacetime warping, unlimited cosmic scale, interstellar travel, and new law slots as out of scope or deferred. Preserve those boundaries unless a new decision record changes them.

The 128-law ceiling appears in later RRP plans as a constraint. Treat it as a design-time constraint to verify against the current law representation before extending the model.

## 6. Product roadmap requirements

The accepted product roadmap in [VEPA_Roadmap_v4-5.md](https://github.com/DayneK/vepa/blob/main/VEPA_Roadmap_v4-5.md) is the product-level authority. This catalog groups its requirements into acceptance-oriented capabilities; it does not replace the roadmap's numbered requirements or final checklist.

| ID | Capability | Required outcome | Acceptance boundary |
|---|---|---|---|
| PR-01 | Emergence ladder | Particles → molecules → hunting clusters → metastructures → fictional awakening → minds → tribes, technology and culture | Each transition has explicit evidence and acceptance; no rung implies real consciousness |
| PR-02 | First-run experience | Mobile-first physics sandbox, short tutorial and progressive discovery without future-rung spoilers | Tutorial and progression tested in browser; help reveals concepts at the intended milestone |
| PR-03 | Starter scenarios and seeds | Primordial soup, head start, harsh world, peaceful, chaos; preserve exact seed text and derived seed | Test scenario identity, stable text-to-seed conversion, configuration and provenance |
| PR-04 | Canonical configuration | Versioned/validated laws, world parameters, species/genome and launch settings | Validate before execution; preserve original configuration when proposing corrections |
| PR-05 | Restart-only physics changes | Stage law and physics-affecting parameter changes; apply only on new-world start or explicit restart | No active-run mutation through UI, preset, import, worker or backend paths |
| PR-06 | Deterministic state and replay | Capture state, seed/RNG, tick/cadence, config, version and relevant event/intervention history | Define compatibility limits and report divergence honestly |
| PR-07 | Persistence and recovery | Versioned saves, safe import/export, protected recovery material and rollback paths | Invalid input cannot corrupt the active session or destroy the only good save |
| PR-08 | Evidence-grounded history | Link events, entities, lineages and highlights to observations and replay/checkpoint evidence | Separate observed state, derived metrics, inference and uncertainty |
| PR-09 | Selected renderer direction | GPU-rendered 3D, local rendering, state-faithful overlays and explicit fallbacks | Canvas2D/Pixi are baseline/compatibility paths, not completion of target 3D |
| PR-10 | Honest resource management | Separate simulation throughput, rendering performance, memory and storage; warn about costly capabilities | Adapt rendering only, never silently alter physics or progression |
| PR-11 | Optional hosted execution | Provider-neutral opt-in remote compute with cost, privacy, authentication, recovery and explicit authority | Local remains usable; no client secrets; continuity claims require full-state evidence |
| PR-12 | Sharing and privacy | Portable seeds/configuration, compatibility metadata, unlisted-by-default worlds and explicit publication | Reject incompatible imports rather than silently reinterpreting them; visitors read-only by default |
| PR-13 | Release governance | Reproducible tests/builds, browser verification, migration guidance, changelog, maintainer review and rollback where required | Any known defect blocks stable release under the accepted roadmap |
| PR-14 | Research isolation | Costly/speculative systems run in separate experimental worlds/saves | Promotion requires hypothesis, metrics, reproducibility limits and explicit decision |

## 7. RB technical module catalogue

RB-00 through RB-11 are technical design areas, not release-status labels. The source specs mix proposed targets with historical source observations; implementation status must be rechecked against the target repository and commit.

| ID | Module boundary | Core responsibility | Contract / key risk |
|---|---|---|---|
| RB-00 | Current program baseline | Record source snapshot, routes, state shapes, capabilities and parity fixtures | Snapshot facts expire; distinguish historical observations from current evidence |
| RB-01 | App shell and orchestrator | Thin composition root, capability probes, module registry and lifecycle; runtime owns session coordination | Reject cycles, missing dependencies and duplicate mutable-state ownership |
| RB-02 | Visual shell and UI modules | HUD, Setup, Saves, Data, Help and responsive panel composition | UI sends validated commands and consumes read models; no direct writes to world buffers |
| RB-03 | World parameter system | Canonical versioned config, validation, Easy/Advanced views and staged changes | Both modes use same values; physics changes restart-only; preserve provenance |
| RB-04 | Species and genome system | Genome schema, species roster, lifecycle and editing | Maintain buffer/registry alignment through birth, death, speciation, import and slot reuse |
| RB-05 | Law ontology and fidelity | Law metadata, dependencies, units, state, ordering, approximations and audit links | A UI tile is not proof of dispatch; law-budget changes need evidence and approval |
| RB-06 | Physics solver and performance | Deterministic tick stages, law kernels, constraints, integration, lifecycle and bounded emergent passes | Exact CPU is reference; report algorithm-specific fidelity, stability and benchmark evidence |
| RB-07 | Execution backends and cloud processing | Common compute-session interface for main thread, worker, GPU-assisted and optional remote adapters | Local default; versioned commands/acks, bounded snapshots, explicit authority and safe fallback |
| RB-08 | Local renderer and visualization | Consume immutable/versioned RenderFrames and deliver GPU-rendered 3D direction | Renderer owns no physics; test parity, device loss, interpolation, fallbacks and frame/tick consistency |
| RB-09 | State, presets and persistence | Canonical state partitions, snapshots, migrations, saves, undo and recovery | Pure preflight migrations, atomic writes, protected saves and honest replay guarantees |
| RB-10 | Emergent systems and observability | Emergent systems, metrics, event history, provenance and inspection projections | Bound actions; distinguish observation from inference; journal consequential changes |
| RB-11 | Module packages, development and integration | Versioned manifests, ports, contract tests, dependency graph and single-package build | Isolated development does not imply separate deployments; reject cycles and duplicate owners |

### Cross-module interfaces to standardize

- **Commands:** validated, versioned and acknowledged; include session, command identity and expected state/tick where applicable.
- **State ownership:** each mutable aggregate has one authoritative owner. UI, renderer, analytics and transport cannot become competing owners.
- **Events and frames:** typed/versioned envelopes carry session and sequence/tick identity; render snapshots are projections, not authoritative state.
- **Persistence:** schema/version metadata, migration outcome, provenance and compatibility status are explicit.
- **Capabilities:** report the backend actually active, not merely available; unsupported features and fallback losses are visible.
- **Verification:** module unit tests do not replace integration, replay, browser, numerical or performance acceptance where required.


## 8. Roadmap v4 requirements and acceptance crosswalk

The catalog above groups capabilities for planning. The full roadmap remains the authoritative source for detailed numbered requirements and its final acceptance checklist. The following crosswalk ensures none of its major product areas disappears during consolidation.

| Roadmap v4 area | Feature catalog links | Minimum acceptance evidence |
|---|---|---|
| 1. Vision and governing principles | PR-01, PR-06, PR-08, PR-14 | Emergence caused by explicit rules; deterministic provenance; uncertainty labels; no claims of real consciousness |
| 2. Product experience and visual direction | PR-02, PR-03, PR-09 | Neon-noir visual language; responsive mobile-browser interaction; physics-only first tutorial under two minutes; secret progression and rung-gated help; five starter scenarios |
| 3. Simulation foundations and laws | PR-04, PR-05, PR-10 | Canonical validated world configuration; inspectable law semantics and assumptions; explicit time/boundary assumptions; restart-only physics edits; deterministic tick/state tests |
| 4. Persistence, replay and provenance | PR-06, PR-07, PR-08 | Versioned save/export contract; integrity checks and safe recovery; documented replay compatibility/divergence; event/entity history linked to evidence |
| 5. Emergence ladder | PR-01, PR-08, PR-14 | Independent criteria for particles, molecules, hunting clusters, metastructures, fictional awakening and minds; tests for each transition; no rung inherits acceptance from another |
| 6. Resources, populations and environmental pressure | PR-04, PR-10, PR-14 | Explicit resource flows, transfers, migration, hazards and environmental effects; bounded writes; observable causal effects and reproducible scenarios |
| 7. Tribes, culture and civilisation | PR-01, PR-08, PR-14 | Rules and state for group identity, roles, technology, knowledge, relationships, family/towns and lost technology; distinguish genetic inheritance from cultural transmission |
| 8. Notable events, history and return experience | PR-06, PR-08 | Defined detection/confirmation criteria, event-to-entity/rule/checkpoint links, uncertainty labels, navigable history and useful return summaries |
| 9. Sharing, hosted worlds and community | PR-07, PR-11, PR-12 | Portable compatible state; unlisted by default; explicit publication; visitor permissions/moderation; hosted cost, privacy, recovery and rollback gates |
| 10. Monetisation and telemetry | PR-11, PR-12, PR-13 | Core simulation remains open; hosted service is the primary paid service direction; analytics opt-out; diagnostics separate from analytics; transparent retention/cost |
| 11. Architecture and implementation contracts | RB-00–RB-11, PR-04, PR-06, PR-09, PR-10 | Single authoritative state ownership; explicit module ports; resource budgets; render-only degradation; browser/release targets and lifecycle teardown |
| 12. Verification, acceptance and release governance | PR-13, all PR IDs | Requirement-to-evidence mapping; source-backed claims; reproducible tests/build/browser runs; known defects block stable release under the accepted roadmap |
| 13. Phased delivery roadmap | IMPLEMENTATION_PLAN.md | Execute phases in dependency order; each phase exits on evidence, not elapsed time or documentation completion |
| 14. Deferred and excluded scope | PR-14 and exclusions below | Explicitly defer research/expensive features; no accidental scope promotion from old RRP sets or system-roadmap variants |
| 15. Final acceptance checklist | TRACEABILITY.md | Treat the source roadmap's final checklist as the release gate; do not replace it with this abbreviated matrix |

### System ontology and gap-aware feature scope

The systems documentation describes multiple levels of reality that must not be conflated:

- **Runtime entity/state:** durable identity, authoritative state owner, lifecycle and serialization exist.
- **Operational proxy:** real behavior is wired and testable, but approximates the named domain concept.
- **Derived analytical projection:** inferred from observations and revisable; it does not itself cause simulation behavior.
- **Scaffold/design target:** ontology, registry shape or roadmap exists without end-to-end domain acceptance.

In particular, a group is not automatically a tribe or civilization; lineage is not automatically family; a treasury is not a complete economy; a field mark is not automatically a structure; and an analytics label is not a causal runtime mechanic. Each higher-level social system requires measurable formation, persistence, roles/relations, resource or information flows, lifecycle transitions and evidence appropriate to its claim.

The source systems documents identify family/kinship, individual recognition, general typed relationship history, and full tribe/polity/civilization continuity as areas where proxies and partial registries must not be mistaken for complete roadmap acceptance. Re-audit the current gap matrix before implementation because its source status is commit-dependent.
