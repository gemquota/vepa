# Batch 07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION

Laws under audit (indices 24-27):

- **CRYSTALLIZATION** (index 24, chemistry / PURPLE)
- **HEAT** (index 25, thermodynamics / ORANGE)
- **COLD** (index 26, thermodynamics / ORANGE)
- **CONVECTION** (index 27, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CRYSTALLIZATION | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyCrystallization` null (gate / dist > 30); offset (4,4) → pull (0.04, 0.04) toward 8-unit lattice. Gating `isSet` verified. |
| HEAT | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyHeatTransfer` no-op (gate); hot 1.0 / cold 0.0, dt 1 → 0.99 / 0.01 (conducts hot → cold). Integration: `solve()` conducts between neighbours. Gating `isSet` verified. |
| COLD | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_07.test.js` — direct call now equalises: cold 0.0 / hot 1.0, dt 1 → 0.015 / 0.985 (was 1.015 / −0.015: hot particle got hotter — anti-thermodynamic sign inversion). Integration: `solve()` cools the hotter neighbour (1.001875 → < 1.0). Gating `isSet` verified. |
| CONVECTION | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyConvection` no-op (gate); temp 1.0, dt 1 → VEL_Y +0.0005 ((temp−0.5)·0.001). Integration: `solve()` gives hot particle positive VEL_Y. Gating `isSet` verified. |

## Notes

- COLD repaired in `v4/src/physics/laws.js` (`applyHeatTransfer`, `src/physics/laws.js` ~line 875):
  - Before: `const tDec2 = diff * rate; const tInc2 = diff * rate;` (diff = tempI − tempJ < 0 when the partner is hotter → hot particle heated, cold particle cooled).
  - After: `const tDec2 = -diff * rate; const tInc2 = -diff * rate;` — heat now flows from the hotter partner into the colder one, matching HELP_DB "temperature trends toward equilibrium".
  - Repair attempt count: 1.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_07.test.js` (16 tests).
