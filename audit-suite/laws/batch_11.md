# Batch 11 — REDUCTION / ALLOY / MELT / BOIL

Laws under audit (indices 40-43):

- **REDUCTION** (index 40, chemistry / PURPLE)
- **ALLOY** (index 41, chemistry / PURPLE)
- **MELT** (index 42, thermodynamics / ORANGE)
- **BOIL** (index 43, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| REDUCTION | ✅ PASS | `REDUCTION direct` — charges 1.0/0.2 → 0.96/0.24 (neutralization = diff×0.05); equal charges unchanged. `REDUCTION integration` — |Δcharge| 0.8 → <0.8 with law on; stays 0.8 with law off. |
| ALLOY | ⚠️ REPAIRED (1 attempt) | `ALLOY direct` — cross-species overlap (dist 0.3 < (r1+r2)/2) merges j into i: j DEAD=1, i MASS 1.5 → 1.65; same-species, far pairs, and off are no-ops. `ALLOY integration` — j DEAD=1, i MASS > 1.5 with law on; unchanged with law off. |
| MELT | ✅ PASS | `MELT direct` — temp 1.0, mass 1.5 → mass 1.497, temp drops; below 0.7 and off unchanged. `MELT integration` — mass < 1.5 with law on; 1.5 with law off. |
| BOIL | ✅ PASS | `BOIL direct` — mass 10, temp 1.0 → mass < 10 and temp drops (ejectMass 0.02 > 0.01); temp<0.9, small ejectMass, and off unchanged. `BOIL integration` — mass 50, temp 1.0 → mass < 50 with law on; 50 with law off. |

## Notes

- Method: direct law-function calls (`applyReduction`/`applyAlloy`/`applyMelt`/`applyBoil` from `v4/src/physics/laws.js`, `setBuffer` for REDUCTION's global buffer) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_11.test.js` (8 tests, all pass).
- Repair 1 (ALLOY, 1 attempt): integration showed j was marked DEAD but i's mass stayed 1.5 — `applyAlloy` adds mass in-place to `view[iBase+MASS]` during the pair loop, but the solver writeback `view[iBase+MASS] = mass` (stale local copy) clobbered it. Fix in `v4/src/physics/solver.js`: fold the buffer mass back into the local copy immediately before writeback (`mass = view[iBase + S.MASS];`). This also restores accretion/chemistry mass transfers that write in-place during the pair loop.
- BOIL integration initially failed only because the 0.01 ejectMass threshold needs mass ≥ 20 at `DT=0.25`; raised test mass 10 → 50 (implementation is correct, verified by the direct-call test).
