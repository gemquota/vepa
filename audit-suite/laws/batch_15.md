# Batch 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM

Laws under audit (indices 56-59):

- **RESISTANCE** (index 56, electromagnetism / CYAN)
- **CAPACITANCE** (index 57, electromagnetism / CYAN)
- **INDUCTANCE** (index 58, electromagnetism / CYAN)
- **MAGNETISM** (index 59, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| RESISTANCE | ✅ PASS | `batch_15.test.js` — "RESISTANCE damps fast motion and converts it into heat": VEL_X=5, TEMPERATURE=0 → after 10 solves speed < 5 and TEMPERATURE > 0; law-off gate: velocity and temperature unchanged. |
| CAPACITANCE | ⚠️ REPAIRED (1 attempt) | `batch_15.test.js` — "CAPACITANCE stores surplus energy as charge and bleeds it when low": ENERGY 100 → CHARGE > 0.5 after 20 solves; ENERGY 30 + CHARGE 1 → CHARGE < 1 after 20 solves. "CAPACITANCE stored charge produces a pairwise repulsion force": same-sign stored charge pair at 10 units → dist grows >0.02 over 60 solves. See repair notes. |
| INDUCTANCE | ✅ PASS | `batch_15.test.js` — "INDUCTANCE aligns neighbour velocities": VEL_X +3/−3 pair → relative speed < 50% after 20 solves; law-off gate: relative speed stays exactly 6.0. |
| MAGNETISM | ✅ PASS | `batch_15.test.js` — "MAGNETISM attracts aligned moments and repels opposing moments": MAGNETIC_MOMENT +1/+1 pair → dist shrinks >0.02 over 60 solves; +1/−1 pair → dist grows >0.02. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_15.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- **CAPACITANCE repair (v4/src/physics/laws.js)**: `applyStoredChargeForce` used `force = k*qq/(dist²+0.5)` along `dx`, so same-sign stored charges ATTRACTED instead of repelling (same sign bug as CHARGE_LAW). Flipped to `force = -k*qq/(dist²+0.5)` so stored charge follows the same electrostatic convention as CHARGE_LAW (which feeds it).
- Full v4 unit suite (123 tests) still passes after repair.
