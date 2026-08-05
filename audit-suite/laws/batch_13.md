# Batch 13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION

Laws under audit (indices 48-51):

- **CLAIRVOYANCE** (index 48, metaphysics / RED)
- **PRECOGNITION** (index 49, metaphysics / RED)
- **ASTRAL** (index 50, metaphysics / RED)
- **PREDATION** (index 51, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CLAIRVOYANCE | ✅ PASS | `batch_13.test.js` — "CLAIRVOYANCE steers toward the neighbor's predicted future position": direct `applyClairvoyance` with offset (0,10,0) + neighbor vx=5 returns ax>0, ay≈0; law-off gate returns null; integration: after 40 solves VEL_X > 0.005. |
| PRECOGNITION | ✅ PASS | `batch_13.test.js` — "PRECOGNITION applies lateral avoidance force on a collision course": closing pair (dot<0) yields ay>0, ax≈0; law-off and moving-apart (dot>0) gates return null; integration: VEL_Y > 0.001 after 8 solves. |
| ASTRAL | ⚠️ REPAIRED (1 attempt) | `batch_13.test.js` — "ASTRAL keeps souls as fading ghosts": DEAD=0.5/SOUL=1 soul keeps DEAD=0.5, ALPHA≈soul×0.5, MASS≈soul×0.1, SOUL decays <1. See repair notes. |
| PREDATION | ⚠️ REPAIRED (1 attempt) | `batch_13.test.js` — "PREDATION pursues lower-mass prey and absorbs mass/DNA on contact": predator (mass 5, PREDATION_BIAS 10) vs prey (mass 1) at contact: 5 sampled DNA traits blend toward prey (sum +0.5), predator mass 5→5.05, prey 1→0.9; pursuit at 50 units: VEL_X > 0.001 after 20 solves. See repair notes. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_13.test.js` — integration-level `solve()` checks with `isSet` gate assertions, plus direct calls to `applyClairvoyance`/`applyPrecognition` (both use the `view` param and need no `setBuffer`).
- **ASTRAL repair (v4/src/physics/solver.js)**: `applyAstral` was dispatched at the end of the per-particle loop, but that loop skips `DEAD >= 0.5` particles, so souls never reached it. Added a dedicated soul pass (Phase 2b) that iterates all particles and calls `applyAstral` for `DEAD >= 0.5`, and removed the now-redundant in-loop call.
- **PREDATION repair (v4/src/physics/solver.js)**: `applyPredation` writes absorbed mass directly to the buffer, but the solver's per-particle writeback `view[iBase+S.MASS] = mass` used a stale local read before the pairwise loop, clobbering the predator's mass gain (prey's loss survived). Added a mass re-read right after the pairwise loop (`mass = view[iBase + S.MASS]`), mirroring the existing velocity re-read pattern.
- Full v4 unit suite (123 tests) still passes after repairs.
