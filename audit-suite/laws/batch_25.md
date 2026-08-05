# Batch 25 — STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION

Laws under audit (indices 96-99):

- **STOICHIOMETRY** (index 96, chemistry / PURPLE)
- **AUTOCATALYSIS** (index 97, chemistry / PURPLE)
- **ADIABATIC** (index 98, thermodynamics / ORANGE)
- **COMPRESSION** (index 99, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| STOICHIOMETRY | ✅ PASS | `STOICHIOMETRY direct` — masses 1.0/2.0, k=1 → 1.005/1.995, pair total conserved (3). `integration` — i.mass > 1, j.mass < 2, sum ≈ 3 with law on; 1/2 frozen with law off. |
| AUTOCATALYSIS | ✅ PASS | `AUTOCATALYSIS direct` — same-species pair (species 7, CATALYSIS 1.5) → both ENERGY 100 → 100.15; cross-species pair unchanged. `integration` — same-species pair ENERGY > 100 with law on; 100 with law off. |
| ADIABATIC | ✅ PASS | `ADIABATIC direct` — vx=4, mass 1.5, k=0.1 → drag force ax=−0.4, TEMPERATURE +2.28 (KE→heat); stationary particle → null. `integration` — vx=4 → TEMPERATURE > 0 and vx < 4 with law on; 0/4 with law off. |
| COMPRESSION | ✅ PASS | `COMPRESSION direct` — touching pair (dist 1 < (rI+rJ)*2), k=0.5 → radii 0.6 → 0.45, TEMPERATURE +0.5; dist ≥ threshold → no effect. `integration` — overlapping pair: both radii < 0.6 and both TEMPERATUREs > 0 with law on; frozen with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyStoichiometry`/`applyAutocatalysis` from `v4/src/physics/lawgroups/chemistryLaws.js`, `applyAdiabatic`/`applyCompression` from `v4/src/physics/lawgroups/thermoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_25.test.js` (8 tests, all pass).
- No repairs needed. COMPRESSION radii shrink through solve() despite the per-tick mass-derived radius update (the double pair-pass leaves both radii below the seeded 0.6 and both temps positive).
