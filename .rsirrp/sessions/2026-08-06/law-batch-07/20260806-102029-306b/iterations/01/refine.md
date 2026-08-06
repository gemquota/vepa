# Batch 07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION

Laws under audit (indices 24-27). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| CRYSTALLIZATION | **Add a bonus to same-species crystallization** — any pair within dist 1–30 is pulled toward the 8-unit lattice grid, and same-species pairs pull **3× stronger** (rigid clusters form between kin). | ✅ |
| HEAT | **Yes** — add temperature-driven thermal jitter: particles above 0.5 TEMPERATURE get random velocity kicks proportional to temperature (kinetic-theory thermal noise), on top of the existing pairwise conduction. | ✅ |
| COLD | **Sure** — add the documented velocity damping: particles below 0.5 TEMPERATURE have their velocity damped each tick, on top of the pairwise equalization. | ✅ |
| CONVECTION | **Unsure → decided by agent** — kept the documented buoyancy `(temp − 0.5) × 0.001 × dt × synergy` on +VEL_Y; deliberately **not** scaled by HEAT_CAPACITY (conduction already encodes capacity into the temperature field, so a second scaling would double-count). Note for the user: gravity is along −Z (PLANETARY), so +Y buoyancy is horizontal in VEPA's 3D space — switch to +Z (anti-gravity) on request. | ✅ (agent decision, amendable) |

## Implementation (v4.6.8)

- **CRYSTALLIZATION** — `applyCrystallization` now reads `SPECIES_ID` at both bases; same-species pairs multiply the lattice pull by 3.0 (`pullScale = sameSpecies ? 3.0 : 1.0`). Cross-species pairs keep the original 0.01×synergy pull.
- **HEAT** — new `applyThermalJitter(lawState, view, base, dt, synergy, prng)`: for temp > 0.5, adds `±(temp × 0.01 × dt × synergy)` random kick per axis (`(prng()−0.5)×2×kick`). Wired into the solver per-particle loop next to convection.
- **COLD** — new `applyColdDamping(lawState, view, base, dt, synergy)`: for temp < 0.5, multiplies VEL_X/Y/Z by `max(0, 1 − (0.5 − temp) × 0.1 × dt × synergy)`. Wired into the solver per-particle loop.
- **CONVECTION** — unchanged (documented formula kept, no HEAT_CAPACITY scaling).
- Tests: `tests/audit/batch_07.test.js` extended to 25 tests (crystallization cross-species 0.04 vs same-species 0.12 bonus, thermal jitter gate/threshold/value/integration, cold damping gate/threshold/value/integration, plus all prior heat transfer/convection coverage). Full suite 547/547 green; `vite build` clean.
- HELP_DB entries updated for all four laws in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. same-species bonus 2. yes jitter 3. sure damping 4. unsure (agent decision, amendable)
- [x] Implementation + tests (547/547)
- [x] Deployed to https://vepa-v4.vercel.app
