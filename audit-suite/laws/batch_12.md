# Batch 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY

Laws under audit (indices 44-47):

- **CONDENSE** (index 44, thermodynamics / ORANGE)
- **DEPOSIT** (index 45, thermodynamics / ORANGE)
- **EXOTHERMIC** (index 46, thermodynamics / ORANGE)
- **TELEPATHY** (index 47, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CONDENSE | ✅ PASS | `CONDENSE direct` — temp 0.0, mass 1.5 → mass 1.5015, temp +0.00015; temp>0.3 and off unchanged. `CONDENSE integration` — mass > 1.5 with law on; 1.5 with law off. |
| DEPOSIT | ✅ PASS | `DEPOSIT direct` — temp 0.0 → mass 1.5 → 1.506, radius 0.6 → 0.601, temp +0.0001; temp>0.2 and off unchanged. `DEPOSIT integration` — mass > 1.5 with law on; 1.5 with law off. |
| EXOTHERMIC | ✅ PASS | `EXOTHERMIC direct` — energy 100 → 110 (×1.1 at synergy 1); off unchanged. `EXOTHERMIC integration` — energy > 100 with law on; 100 with law off. |
| TELEPATHY | ✅ PASS | `TELEPATHY direct` — j SIGNAL 0.5 → i SIGNAL 0.025 at any distance; no transfer cross-species, below 0.001 threshold, or when off. `TELEPATHY integration` — i SIGNAL > 0 with law on; 0 with law off. |

## Notes

- Method: direct law-function calls (`applyCondense`/`applyDeposit`/`applyExothermic`/`applyTelepathy` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_12.test.js` (8 tests, all pass).
- No repairs needed. TELEPATHY intentionally ignores distance (distSq argument unused) — consistent with its HELP_DB "regardless of distance" behavior.
