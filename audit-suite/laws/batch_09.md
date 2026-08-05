# Batch 09 — CHAOS / ORDER / FATE / WILL

Laws under audit (indices 32-35):

- **CHAOS** (index 32, metaphysics / RED)
- **ORDER** (index 33, metaphysics / RED)
- **FATE** (index 34, metaphysics / RED)
- **WILL** (index 35, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CHAOS | ⚠️ REPAIRED (1 attempt) | `CHAOS direct: stochastic velocity forcing, gated by isSet` — prng=1 ⇒ VEL_X/Y +0.25, VEL_Z +0.125; prng=0 ⇒ −0.25; off ⇒ no-op. `CHAOS integration` — vx = 0.05 (prng 0.9) with law on, 0 with law off. |
| ORDER | ✅ PASS | `ORDER direct` — idle i gains ax=+0.025 toward neighbor vx=5 (distSq 100); null beyond 10k and when off. `ORDER integration` — i.vx > 0 with j at vx=5; 0 with law off. |
| FATE | ✅ PASS | `FATE direct` — same-species pair at dx=10 gives ax=+0.05; null for cross-species, distSq>250k, and when off. `FATE integration` — same-species i.vx > 0; 0 with law off. |
| WILL | ⚠️ REPAIRED (1 attempt) | `WILL direct` — vx 5 → 5.01 boost; stationary no boost; off no-op. `WILL integration` — vx 2 → 2.0025 with law on; 2 with law off. |

## Notes

- Method: direct law-function calls (`applyChaos`/`applyOrder`/`applyFate`/`applyWill` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_09.test.js` (8 tests, all pass).
- Repair 1 (CHAOS + WILL, 1 attempt): integration revealed CHAOS and WILL wrote velocity deltas in-place to the buffer during solve, but the solver's local `vx/vy/vz` copy overwrote them at writeback (the old "Re-read velocity" line `vx = view[VEL_X] + (vx - view[VEL_X])` was an algebraic no-op). Fix in `v4/src/physics/solver.js`: fold buffer velocity into locals before force integration, and fold WILL's in-place boost back via pre/post deltas. `v4/tests/unit` (123 tests) unaffected.
