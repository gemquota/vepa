# VEPA Feature Plan

This directory is the consolidated planning surface for VEPA's feature concepts, implementation sequence, architectural constraints, and verification trail.

## Documents

| Document | Purpose |
|---|---|
| [Feature catalog](FEATURE_CATALOG.md) | Normalized inventory of the field-manual concepts and release-set designs |
| [Implementation plan](IMPLEMENTATION_PLAN.md) | Dependency-aware delivery sequence, gates, and completion criteria |
| [Decisions and risks](DECISIONS_AND_RISKS.md) | Cross-cutting architectural decisions, constraints, and failure modes |
| [Traceability](TRACEABILITY.md) | Links from planning claims to original design records and evidence needed to verify implementation |

## Authority and status rules

These documents reorganize existing planning material. They do not, by themselves, establish that every described feature exists in the current runtime.

Use the following status vocabulary:

- **Implemented claim**: an existing project document says the feature was implemented. This is a lead for verification, not independent proof.
- **Designed**: specified in an intent/design document, but implementation is not established here.
- **Proposed**: a candidate idea that still needs a decision or specification.
- **Verified**: source code and relevant tests/build evidence have been checked against explicit acceptance criteria.
- **Blocked / deferred**: a dependency, risk, or explicit scope decision prevents current delivery.

Do not promote an item to **Verified** without inspecting the current branch's code and tests. When implementation evidence conflicts with an older plan, current source and reproducible tests take precedence; retain the discrepancy in the traceability log rather than silently rewriting history.

## Reading order

1. Start with the feature catalog to understand scope.
2. Use the implementation plan to sequence work by dependency, not by document age alone.
3. Resolve shared constraints in decisions and risks before implementation.
4. Use traceability to connect each item to source records, code locations, and verification evidence.

## Source material consolidated

The collection was derived from:

- `GUIDE.md`: field-manual recipes, environmental controls, ecology, civilization, performance, and interaction guidance.
- `PLAN.md`: milestone history, implementation claims, and historical validation commands.
- `docs/dev/rrp-trilogy/intent.md` through `docs/dev/rrp-trilogy-6/intent.md`: E–T release-set designs.
- The corresponding RRP Mermaid diagrams and the R·S·T traceability matrix.

The source documents remain in their original locations. This planning directory is the structured index and synthesis, not a claim that the source records have been deleted or that their historical details are all current.

## RB modular-system integration

This plan also integrates the RB modular-system proposal and product/acceptance material reviewed in the separate [DayneK/vepa documentation tree](https://github.com/DayneK/vepa). These are cross-repository source references, not evidence that source files were copied or implementation was performed in this repository.

### Authority order

1. **Product decisions and acceptance:** [VEPA Roadmap v4-5](https://github.com/DayneK/vepa/blob/main/VEPA_Roadmap_v4-5.md). Its accepted decisions, phase exit criteria, exclusions and final acceptance checklist govern.
2. **Technical target architecture:** [RB Master Specification](https://github.com/DayneK/vepa/blob/main/docs/spec/rb/MASTER_SPEC.md) and subsystem specifications RB-00 through RB-11. These are proposed design contracts subordinate to the product roadmap.
3. **Requirement mapping:** [RB Roadmap Crosswalk](https://github.com/DayneK/vepa/blob/main/docs/spec/rb/ROADMAP_CROSSWALK.md).
4. **Implementation evidence:** [RB Roadmap Progress](https://github.com/DayneK/vepa/blob/main/docs/spec/rb/ROADMAP_PROGRESS.md), plus current source, tests, browser runs and benchmarks. Its source baseline is dated 2026-10-15 and must be refreshed before treating it as current.
5. **Existing feature/RRP history:** GUIDE.md, PLAN.md, and the RRP intent records listed above. Preserve their historical claims, but do not let them override newer accepted product decisions.

### Non-negotiable integration rules

- The accepted roadmap is product authority. GPU-rendered 3D is the selected target; physics-affecting law and parameter edits are staged and apply only on new-world start or explicit restart; performance degradation may simplify only designated rendering layers; experimental features remain in separate experimental worlds/saves.
- Preserve mobile-browser-first priority, five starter scenarios, deterministic text-to-seed provenance, spoiler-safe progression, explicit uncertainty, recoverability, privacy defaults, and separate measures for simulation, rendering, memory and storage.
- RB is a proposal, not authorization to implement every suggested algorithm or service. Open choices such as graphics API, remote provider, Easy-mode composite mappings and module packaging require explicit decisions and evidence.
- Keep legacy RRP feature sets as historical/planned scope. Do not schedule speculative cosmic or observer features ahead of the product roadmap's foundational phases by default.
- The source progress report says browser acceptance could not run because Chromium lacked libglib-2.0.so.0. Its browser stages are therefore not browser-verified, and no end-to-end RB section or roadmap phase should be treated as complete on that report alone.
