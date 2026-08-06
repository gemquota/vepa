# Batch 08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY

Laws under audit (indices 28-31). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| PHASE_RADIATION | **Follow irl behaviour** — Stefan-Boltzmann blackbody emission: every warm body radiates, hot bodies radiate disproportionately (T^4 curve), cooling TEMPERATURE and ENERGY while boosting SIGNAL glow. The old ENERGY > 50 doc hint and the 0.6 temperature threshold are both replaced. | ✅ |
| SUBLIMATION | **Sure** — documented low-mass + high-energy gate: requires temp > 0.5 AND ENERGY > 50, mass can sublimate down to a 0.02 floor (near-full evaporation), velocity burst switched from `Math.random()` to the sim PRNG, sublimation consumes extra energy and cools. | ✅ |
| TIME_DILATION | **Agent decision** (user: "you invented them you decide") — kept `localDt = 1 − soul×0.3×synergy` (70% max). Rationale: a stronger cap would make differential aging (AGE, reproduction timers) diverge too far between souls and destabilize the simulation. | ✅ (agent decision) |
| DIMENSIONALITY | **Make it stronger** — Z-drift amplitude raised 0.1 → 0.3 (3x), so 3D exploration is actually visible. | ✅ |

## Implementation (v4.6.9)

- **PHASE_RADIATION** — `applyPhaseRadiation` rewritten: gate `temp > 0.05`, `radiated = temp^4 × 0.05 × dt × synergy`; ENERGY −= radiated, TEMPERATURE −= radiated (clamped ≥ 0), SIGNAL += radiated (cap 1).
- **SUBLIMATION** — `applySublimation(lawState, view, base, dt, synergy, prng)` rewritten: gate `temp > 0.5 && energy > 50 && mass > 0.02`; MASS −= sublRate with 0.02 floor, VEL_X/Y += (prng()−0.5)×sublRate×5, ENERGY −= sublRate×20, TEMPERATURE −= sublRate×0.5. Solver call site passes `prng`.
- **TIME_DILATION** — unchanged (`localDt = 1 − soul×0.3×synergy`); HELP_DB documents the decision rationale.
- **DIMENSIONALITY** — Z-drift amplitude 0.1 → 0.3 (`(prng()−0.5)×0.3×synergy×dt`).
- **CRYSTALLIZATION repair (batch-07 follow-up)** — user reported lattices never form; `applyCrystallization` range widened 30 → 150 and pull 0.01 → 0.05 (same-species 3x = 0.15), so lattices engage at real spawn spacing.
- Tests: `batch_07.test.js` crystallization values updated (0.2 / 0.6 / no-op beyond 150); `batch_08.test.js` rewritten (T^4 curve, T^4 proportionality, near-zero gate, sublimation energy gate + floor + PRNG, dimensionality 0.15 kick). Full suite 550/550 green; `vite build` clean.
- HELP_DB entries updated for CRYSTALLIZATION / PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. irl blackbody 2. sure (energy gate + full evaporation) 3. agent decision (time dilation) 4. stronger Z drift
- [x] Crystallization absence diagnosed + repaired (range/strength)
- [x] Implementation + tests (550/550)
- [x] Deployed to https://vepa-v4.vercel.app
