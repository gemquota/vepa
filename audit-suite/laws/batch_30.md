# Batch 30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK

Laws under audit (indices 116-119):

- **UNCERTAINTY** (index 116, quantum / INDIGO)
- **TELEPORT** (index 117, quantum / INDIGO)
- **OBSERVER** (index 118, quantum / INDIGO)
- **PLANCK** (index 119, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| UNCERTAINTY | ⚠️ REPAIRED (1 attempt) | `batch_30.test.js` — "UNCERTAINTY jitters position and adds a velocity kick": direct prng 0.9 → POS +0.008, kick ax=0.02; solver: POS > 100.0001 and VEL_X > 0.0001 after 1 tick (position jitter persisted after repair); law-off gate: frozen. See repair notes. |
| TELEPORT | ⚠️ REPAIRED (1 attempt) | `batch_30.test.js` — "TELEPORT jumps to a random location and spends ENERGY": direct k=1000 prng 0.9 → jump to 1800, ENERGY < 100; solver (k=0.5, prng 0.0009) → POS ≈ 1.8 and ENERGY < 90 after 1 tick; law-off gate: frozen. See repair notes. |
| OBSERVER | ✅ PASS | `batch_30.test.js` — "OBSERVER collapses a neighbour velocity toward the observer and imprints MEMORY": direct observer MEMORY 1/VEL 10 → neighbour VEL 0.1, MEMORY 0.1; solver: neighbour VEL > 0.01, MEMORY > 0.05 after 1 tick; law-off gate: neighbour stays still. |
| PLANCK | ✅ PASS | `batch_30.test.js` — "PLANCK quantizes velocity to discrete steps": direct q=0.1 → 0.17→0.2, −0.23→−0.2; solver (k=0.5, q=0.05) → VEL_X = 0.15 after 1 tick; law-off gate: VEL unchanged. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_30.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **UNCERTAINTY + TELEPORT repair (v4/src/physics/solver.js)**: both laws write position directly to the buffer; the solver's stale-local writeback erased the jitter/jump (positions stayed at 100). Same root cause and fix as TUNNELING (batch 29): position reconciliation in the solver (`px = view[iBase+S.POS_X] + softbodyDX` after the per-particle law section, with the softbody delta captured post-pair-loop).
- PLANCK needed no repair — its direct buffer velocity write is already folded into integration via the existing velocity re-read; the only test change was float-precision (`toBe` → `toBeCloseTo`) in the gate assertion.
- Full v4 suite (47 files / 420 tests) passes after repair.
