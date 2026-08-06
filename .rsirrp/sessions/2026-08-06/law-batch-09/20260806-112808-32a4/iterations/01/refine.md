# Batch 09 — CHAOS / ORDER / FATE / WILL

Laws under audit (indices 32-35). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| CHAOS | **Agent decision** (user: "you decide") — kinetic forcing stays (±0.5 X/Y, ±0.25 Z) PLUS a small temperature stir (±0.02, clamped 0-1) so chaos flickers thermal pockets that feed HEAT / PHASE_RADIATION. With ORDER on, both run at ×0.3. | ✅ (agent decision) |
| ORDER | **Strongly** — alignment 0.005 → 0.04 (8x) and range ~100 → ~200 units (distSq 40k), so coherent flow actually emerges. | ✅ |
| FATE | **Redesign** (user: "boring and similar to existing laws" — it duplicated AFFINITY) — replaced the pairwise same-species attraction with per-species **drifting destiny points**: each species has a golden-angle-phase destiny point that wanders on a fate clock, and members are gently pulled toward it along the shortest toroidal path (0.02×synergy, full-world). Species now migrate and segregate toward their own fate. | ✅ (redesign) |
| WILL | **Follow docs** — self-propulsion along current heading, `0.01×dt×synergy`, energy-independent, speed gate 0.01. Unchanged. | ✅ |

## Implementation (v4.6.10)

- **CHAOS** — `applyChaos` adds `TEMPERATURE += (prng()−0.5)×0.02×dt×synergy` (clamped 0-1) after the kinetic kicks.
- **ORDER** — `applyOrder` strength 0.005 → 0.04, range distSq 10k → 40k.
- **FATE** — `applyFate` rewritten: new signature `(lawState, view, base, px, py, pz, worldSize, synergy)`; module fate clock (`advanceFateClock`/`getFateTime`, advanced once per tick in the solver); destiny point per species (`phase = species×2.39996323`, span 0.32×worldSize); pull = 0.02×synergy along the shortest toroidal path. The old pairwise block was removed from the pair loop and replaced with a per-particle call.
- **WILL** — unchanged.
- Tests: `batch_09.test.js` updated — CHAOS thermal stir (0.01 / clamped 0), ORDER 0.2 alignment + 50k range gate, FATE destiny magnitude/direction + per-species divergence + integration. Full suite 550/550 green; `vite build` clean.
- HELP_DB entries updated for CHAOS / ORDER / FATE in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. agent decision (thermal chaos) 2. strongly (ORDER) 3. redesign (FATE destiny) 4. follow docs (WILL)
- [x] Implementation + tests (550/550)
- [x] Deployed to https://vepa-v4.vercel.app
