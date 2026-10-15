# Commit-Pinned Implementation Audit

**Audit date:** 2026-10-15  
**Target repository:** [gemquota/vepa](https://github.com/gemquota/vepa)  
**Runtime baseline:** [`24b56aff316d6de5a960943d6bcb9192a8d569ce`](https://github.com/gemquota/vepa/commit/24b56aff316d6de5a960943d6bcb9192a8d569ce) (`master`)  
**Planning branch:** `docs/integrate-rb-feature-plan`  
**Planning PR:** [#4](https://github.com/gemquota/vepa/pull/4), documentation-only  
**Scope:** Source/spec/test-surface inspection. No runtime code was changed.

## Executive finding

VEPA has a substantial legacy simulation and research substrate, but the accepted Roadmap v4 target is not yet evidenced as complete. The most consequential gaps are not simply missing feature modules: there are mismatches between advertised backend capability and the active execution path, an existing performance-quality control that changes simulation interactions, and a save format that snapshots world buffers but does not preserve enough state to promise deterministic continuation/replay.

This is a source inspection, not a successful test run. Status terms below are intentionally conservative:

- **Present:** directly located in current source.
- **Partial / constrained:** some implementation exists, but the roadmap contract is broader or key paths are missing.
- **Not evidenced:** no adequate implementation/acceptance evidence was found in the inspected source and generated specification; this is not a claim that no related code exists anywhere.
- **Not run:** executable validation could not be performed in this audit environment.

## Findings requiring attention

### P1. The selected GPU compute backend is not active in the solver

**Status: Present as a prototype, not active in the authoritative solver path.**

Evidence:
- [`src/physics/solver.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/physics/solver.js) imports `gpuComputeForcesSync`, but the v9.0 pre-pass sets `const _useGPU = false`. The branch that constructs pairs and consumes the computed forces is therefore unreachable.
- [`src/worker/physics.worker.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/worker/physics.worker.js) probes `createGPUContext()` when GPU is selected and reports `gpuAvailable`, but its tick handler calls `solve(...)`; the inspected tick path does not dispatch `gpuComputeForces` or pass the GPU context into the solver.
- [`src/ui/settingsPanel.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/ui/settingsPanel.js) tells users the worker will use WebGPU when available.
- [`src/physics/gpuCompute.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/physics/gpuCompute.js) contains a WebGPU gravity/collision kernel, and [`tests/e2e/physics-worker.spec.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/tests/e2e/physics-worker.spec.js) contains an optional direct kernel parity test. A direct kernel test is not proof that the active simulation uses that kernel.

**Impact:** UI capability reporting can be mistaken for active execution. Do not claim GPU-accelerated simulation from the existence of a shader, a selected setting, or a successful adapter probe.

**Next action:** Either integrate a real GPU execution path with explicit CPU fallback and end-to-end instrumentation, or change the UI/status contract to say GPU compute is experimental/unavailable in the active solver. Test that the reported active backend matches observed tick dispatch.

### P1. Adaptive interaction budgeting changes simulation work under performance pressure

**Status: Present; conflicts with the Roadmap v4 constraint that performance degradation may simplify designated rendering layers only.**

Evidence: [`src/physics/solver.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/physics/solver.js) derives `adaptiveInteractions` from target FPS and population, then reduces `maxInteractions` when `QUALITY_MODE` is enabled. The same value limits neighbour interactions used by the physics loop. The solver also has configurable neighbour and cell caps.

**Impact:** Worlds can receive different interaction coverage as population or target FPS changes. That is a simulation/fidelity change, not merely a renderer-quality adjustment, and can undermine replay comparisons and claims that quality adaptation preserves physics.

**Next action:** Separate render-quality adaptation from solver approximation. Keep solver budgets fixed for a given world configuration, or expose them as explicit physics parameters whose changes require a new world/restart and are recorded in provenance. Add a test that render-quality changes do not change physics state for the same initial state and configuration.

### P1. World saves are not sufficient for deterministic continuation or replay

**Status: Partial.**

Evidence: [`src/state/worldSave.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/state/worldSave.js) captures particle data, species DNA, four law-state words, world parameters, selected runtime knobs, world size and tick. It does not capture the main PRNG state, worker PRNG state, event/intervention journal, or the mutable state of emergent engines/registries (for example groups, lineage, epochs, memory, economy and timeline). The main bootstrap initializes the PRNG from `Date.now()` in [`src/main.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/main.js). The save parser checks the format and rejects versions newer than the supported version, but the inspected format does not define a migration chain.

**Impact:** A save can restore a snapshot of visible world buffers without restoring the full causal state required to continue identically. Existing byte-identical buffer round-trip tests, if passing, would establish snapshot fidelity, not deterministic future replay.

**Next action:** Define the canonical state inventory and ownership first. Add versioned PRNG state, subsystem/engine state, event/intervention history, solver/backend identity and compatibility metadata. Implement atomic preflight/restore and explicit migration results. Until then, describe this as save/restore of a world snapshot, not deterministic replay.

### P1. Roadmap target renderer is not implemented in the active renderer

**Status: Not implemented in the inspected active renderer.**

Evidence: [`src/render/renderer.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/render/renderer.js) explicitly creates a Canvas2D context with `canvas.getContext('2d')`; [`src/main.js`](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/src/main.js) uses `createRenderer` for the main canvas. The package declares PixiJS, but the inspected active renderer is Canvas2D. The WebGPU compute shader is separate from rendering.

**Impact:** Existing 2D rendering or WebGPU force-kernel work must not be reported as delivery of the selected GPU-rendered 3D renderer.

**Next action:** Create a renderer interface and a real 3D implementation/fallback contract, then verify overlays, camera/touch interaction, device-loss behavior, and parity against a canonical render frame. Keep rendering and physics backend claims separate.

## Roadmap capability classification

| Roadmap capability | Audit status | Evidence / limit |
|---|---|---|
| Core particle simulation and large law catalogue | **Present, but not fully verified** | Runtime constants declare 136 laws; solver and lawgroups exist. Generated spec reports implementation candidates for 90/136 laws and test references for 128/136, which are evidence counts, not proof of correctness or passing tests. |
| Physics worker and main-thread fallback | **Present** | Worker init/tick protocol exists; browser acceptance has not been run in this audit. |
| WebGPU compute | **Partial / inactive in solver** | Shader and optional direct parity test exist, but active solver branch is hard-disabled with `_useGPU = false`; worker GPU availability probe does not establish GPU tick execution. |
| GPU-rendered 3D | **Not implemented in active renderer** | Main renderer requests Canvas2D context. |
| Deterministic state/replay | **Partial** | Snapshot captures core arrays/config, but omits PRNG and emergent subsystem state/history required for deterministic continuation. |
| Save/export/restore | **Present, partial contract** | Versioned JSON export/import, IndexedDB/localStorage adapter, and undo ring exist. Migration chain, protected recovery guarantees and atomic failure behavior still need explicit acceptance evidence. |
| Five roadmap starter scenarios and deterministic text-to-seed provenance | **Not evidenced** | `PRIME_DEFAULT` is a single starter preset with five species and a law set. The inspected files do not establish the five named Roadmap scenarios or stable text-to-seed provenance. |
| Emergent group/social/economy systems | **Partial / proxy-rich** | Group registry, membership/roles, treasury, artifacts, policy, infrastructure and mega-structure fields exist. These do not by themselves prove complete kinship, cultural transmission, polity continuity or civilization acceptance. |
| Evidence-grounded narrative/history | **Partial** | Insight, narrative, lineage, goal and timeline engines are wired in `main.js`; source/event/checkpoint provenance and uncertainty contracts need dedicated acceptance tests. |
| Mobile-first first-run flow and spoiler-safe progression | **Not evidenced by this source audit** | No real-browser mobile acceptance was run and no commit-pinned test evidence was located for the full progression contract. |
| Local-first/offline operation | **Partially supported** | Browser runtime and worker fallback exist; offline smoke testing was not run. |
| Rendering-only performance degradation | **Conflicts with current solver behavior** | `QUALITY_MODE` changes the neighbour interaction budget used by physics. |
| Stable release verification | **Not established** | Vercel status is successful for the baseline and PR preview; this is not a substitute for unit, spec-drift, numerical, or browser acceptance. |

## Generated specification evidence

The generated specification tree at the baseline reports:
- 100-float particle stride, DNA count 64 and 136 declared/mapped laws.
- 601 scanned input files, including 91 testing-area files.
- 131/136 law records with solver gate references, 90/136 with implementation candidates and 128/136 with test references.
- Manual implementation/evidence review still called out for multiple laws, including BUOYANCY, SENESCENCE, ELECTRIC_FIELD, MASS_INERTIA, INERTIA, DRAG, ENTR, COLL, ACCR, PLANETARY, LIFE, GLOW, REPRO and others.

Source: [generated coverage/drift report](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/docs/spec/review/coverage-gaps.md) and [law traceability](https://github.com/gemquota/vepa/blob/24b56aff316d6de5a960943d6bcb9192a8d569ce/docs/spec/traceability/laws.md).

These are static generator outputs. They are not a fresh test run, and a test reference means a test is linked to a law, not that the test passed.

## Verification performed and not performed

- **Performed:** inspected the pinned source for package scripts, generated specs, solver, worker, GPU compute module, active renderer, PRNG initialization, save/restore, preset, group registry and E2E test definitions.
- **Observed CI/deployment:** GitHub commit status reports Vercel success for the baseline and documentation PR preview. No GitHub Actions workflow runs were returned for either commit.
- **Not run:** `npm test`, `npm run syntax-check`, `npm run build`, `npm run spec:check`, Playwright/E2E, mobile browser, deterministic replay, long-run civilization acceptance, or renderer/solver benchmarks. This environment could not resolve `github.com` for a local clone, so the test suite could not be executed locally.
- **No runtime code changed in this audit branch.** The first bounded implementation follow-up is tracked separately in [PR #5](https://github.com/gemquota/vepa/pull/5): truthful CPU-backend reporting and removal of implicit adaptive interaction budgeting. That PR is open; its tests have not been run in this environment.

## Recommended implementation order

1. **Make capability reporting truthful:** first follow-up [PR #5](https://github.com/gemquota/vepa/pull/5) defaults the UI/runtime to the active CPU path and removes the misleading GPU selector. It is not merged or runtime-tested yet; end-to-end GPU dispatch remains future work.
2. **Protect physics fidelity:** PR #5 removes automatic FPS/population-based neighbour-budget reduction and adds a regression test. It does not resolve the separate semantics of `AUTO_TUNE`, `NEIGHBOR_BUF`, `CELL_CAP`, or `EXPENSIVE_LAW_CADENCE`; audit these next and add state-equality tests.
3. **Specify canonical state and replay:** inventory all mutable state, RNG streams, clocks, pending events and interventions; implement checkpoint/replay compatibility before promising determinism.
4. **Run the baseline gates:** install from lockfile; run unit tests, syntax check, build, `spec:check`, Playwright and supported mobile-browser smoke tests. Record command output and exact environment.
5. **Verify law semantics:** use the generated law matrix to prioritize the 46 law records with missing/incomplete implementation evidence; distinguish intentionally descriptive/meta laws from missing executable behavior.
6. **Build the roadmap experience in dependency order:** canonical scenario/seed provenance, restart-only config staging, safe persistence, mobile first-run/progression, evidence-linked emergence, and then GPU 3D rendering and higher-level civilization acceptance.
7. **Keep refactoring approval-gated:** do not execute the proposed monolith decomposition merely because it appears in the plan. First add behavior/parity tests and benchmarks, then extract one bounded module at a time.

## Remediation follow-up (separate, unmerged PRs)

The first two high-priority findings have implementation proposals in separate branches. These links record the remediation status without treating the fixes as merged or verified:

- [PR #6: Report CPU as the active physics backend until GPU dispatch is integrated](https://github.com/gemquota/vepa/pull/6). Defaults to CPU, disables GPU selection in the settings UI, normalizes stale GPU settings, and reports the actual worker backend. **Open; tests/build not run.**
- [PR #7: Keep automatic quality adaptation out of physics fidelity](https://github.com/gemquota/vepa/pull/7). Uses the configured interaction cap consistently, retires the legacy adaptive-physics controls from the UI while preserving old save keys, and adds a regression test. **Open; tests/build not run.**

These PRs intentionally do not implement GPU dispatch, complete deterministic replay, or the 3D renderer. Do not mark the related roadmap acceptance criteria verified until the relevant tests run and the PRs are reviewed/merged.

## Audit disposition

The current repository is a capable, feature-rich particle simulation with several research systems, but the accepted Roadmap v4 is a broader product target. Treat the capabilities above as partial until the specified acceptance evidence exists. No stable-release or full-roadmap-completion claim is supported by this audit.
