# Batch 08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY

Laws under audit (indices 28-31):

- **PHASE_RADIATION** (index 28, thermodynamics / ORANGE)
- **SUBLIMATION** (index 29, thermodynamics / ORANGE)
- **TIME_DILATION** (index 30, metaphysics / RED)
- **DIMENSIONALITY** (index 31, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PHASE_RADIATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applyPhaseRadiation` no-op (gate / temp ≤ 0.6); temp 1.0, dt 1 → energy −0.008, temp −0.008, signal +0.008. Integration: `solve()` lowers temp and raises signal. Gating `isSet` verified. |
| SUBLIMATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applySublimation` no-op (gate); temp 1.0, mass 1.5, dt 1 → mass −0.0025, temp −0.00125 (+ random velocity burst). Integration: `solve()` sublimates a hot massive particle. Gating `isSet` verified. |
| TIME_DILATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applyTimeDilation` 1.0 (gate / soul 0); soul 1.0 → localDt 0.7 (1 − soul·0.3). Integration: `solve()` high-soul particle advances AGE slower than soul-less (0.25 vs 0.175 dt). Gating `isSet` verified. |
| DIMENSIONALITY | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_08.test.js` — direct call: prng 1.0, dt 1 → VEL_Z +0.05. Integration: `solve()` now leaves VEL_Z ≠ 0 (was 0 — the kick was applied to the buffer in the force phase, then overwritten by the stale local velocity at integration). Gating `isSet` verified. |

## Notes

- DIMENSIONALITY repaired in two files (1 attempt):
  - `v4/src/physics/laws.js` (`applyDimensionality`, ~line 909): now `return force` after writing `view[base + S.VEL_Z] += force` (gate returns 0 instead of `undefined`).
  - `v4/src/physics/solver.js` (~line 843): call site changed from `applyDimensionality(...)` to `vz += applyDimensionality(...)`, folding the kick into the local velocity that is written back at integration. Previously the in-place buffer write was overwritten by the integration write of the stale local `vz`.
  - Repair attempt count: 1.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_08.test.js` (18 tests).
