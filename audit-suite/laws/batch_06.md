# Batch 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY

Laws under audit (indices 20-23):

- **OXIDATION** (index 20, chemistry / PURPLE)
- **POLYMER** (index 21, chemistry / PURPLE)
- **ISOMERIZATION** (index 22, chemistry / PURPLE)
- **CHIRALITY** (index 23, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| OXIDATION | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyOxidationEffect` no-op (gate / charge < 0.3); charge 1, mass 1.5, dt 1 → 1.499 (−charge·0.001). Gating `isSet` verified. |
| POLYMER | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyPolymer` gate returns `{0,0,0}` + no bond; dist 5 (< 10·synergy) fills `BOND_PARTNER_1 = 1`, `BOND_COUNT = 1`, spring force ax = 0.02 ((5−4)·0.02). Integration: `solve()` forms the bond between close particles. Gating `isSet` verified. |
| ISOMERIZATION | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_06.test.js` — direct call: radius 2.0 @ sin-phase peak → 2.01 (×1.005, dt 1, synergy 1). Integration: `solve()` radius ratio peak-vs-zero phase = 1.00125 (was broken: radius modulation overwritten by the mass-derived recompute in `solver.js`). Gating `isSet` verified. |
| CHIRALITY | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyChirality` null (gate / opposite polarity); same-polarity pair (dx 3, dy 4, dist 5) → ax −0.008, ay 0.006 (perpendicular deflection). Gating `isSet` verified. |

## Notes

- ISOMERIZATION repaired in `v4/src/physics/solver.js` (radius recompute, `src/physics/solver.js` ~line 1271):
  - Before: `view[iBase + S.RADIUS] = baseRadius * Math.pow(mass, 0.333);`
  - After: the base radius is computed into `radiusOut`, then multiplied by the ISOMERIZATION phase factor `1 + sin(age·0.01)·0.1·localTimeStep·synergy·0.05` when the law is set, then written. The per-particle `applyIsomerization` radius modulation was overwritten by the unconditional mass-derived recompute each tick, making the law dead at integration level.
  - Repair attempt count: 1 (implementation). One test assertion was tightened (ratio vs zero-phase world) — test-only change, no further implementation edits.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_06.test.js` (16 tests).
