# Batch 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY

Laws under audit (indices 16-19):

- **PHENOTYPE** (index 16, biology / GREEN)
- **CATALYSIS_LAW** (index 17, chemistry / PURPLE)
- **SOLVATION** (index 18, chemistry / PURPLE)
- **ACIDITY** (index 19, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PHENOTYPE | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_05.test.js` — direct call: radius 2.0 @ energy 200 → 2.5 (×1.25, synergy 1). Integration: `solve()` radius ratio energy 200 vs 100 = 1.25 (was broken: radius effect was overwritten by the mass-derived recompute in `solver.js`). Gating `isSet` verified. |
| CATALYSIS_LAW | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applyChemistry` multiplier 1.0 (gate) → 1.5 with CATALYSIS DNA 1.0 @ synergy 1 (×[1 + cat·0.5]). Gating `isSet` verified. |
| SOLVATION | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applySolvationEffect` 1.0 (gate / near-equal charges) → 1.4 with charge gap 2. Gating `isSet` verified. |
| ACIDITY | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applyAcidityEffect` no-op (gate / gap < 0.3); gap 2, dt 1 → neighbour energy 100 → 99.98, actor 50 → 50.01 (half returned). Gating `isSet` verified. |

## Notes

- PHENOTYPE repaired in `v4/src/physics/solver.js` (radius recompute, `src/physics/solver.js` ~line 1264):
  - Before: `view[iBase + S.RADIUS] = baseRadius * Math.pow(mass, 0.333);`
  - After: the base radius is computed into `radiusOut`, then multiplied by the PHENOTYPE energy factor `1 + (energy/200 − 0.5) · 0.5 · synergy` when the law is set, then written. The `applyPhenotype` per-particle call had its radius modulation overwritten by the unconditional mass-derived recompute each tick, making the law dead at integration level.
  - Repair attempt count: 1 (implementation). One test assertion was tightened (ratio vs frozen world) — test-only change, no further implementation edits.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_05.test.js` (15 tests).
