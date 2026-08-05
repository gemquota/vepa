# Batch 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY

Laws under audit (indices 20-23):

- **OXIDATION** (index 20, chemistry / PURPLE)
- **POLYMER** (index 21, chemistry / PURPLE)
- **ISOMERIZATION** (index 22, chemistry / PURPLE)
- **CHIRALITY** (index 23, chemistry / PURPLE)

## Validation results (confirmed spec, v4.6.7)

| Law | Status | Evidence |
|-----|--------|----------|
| OXIDATION | ✅ PASS | `v4/tests/audit/batch_06.test.js` — charge 1, dt 1 → MASS 1.499 AND CHARGE 0.999 (rust); inert below |charge| 0.3; HEAT_OUTPUT 1.0 → ENERGY/TEMPERATURE rise + COLOR_R/ALPHA flash. Gate: untouched without the law. |
| POLYMER | ✅ PASS | Mutual bond: dist 5 → i records j (BOND_PARTNER_1=1, count 1) AND j records i (BOND_PARTNER_1=0, count 1) + spring ax 0.02. Cap: 6 slots filled → 7th candidate rejected. Integration: solve() forms the mutual bond. Gate: no force/bond without the law. |
| ISOMERIZATION | ✅ PASS | 3-bond particle + prng 0.001 → one bond broken, reciprocal cleared (partner count 1→0), ENERGY 100→99.5; inert below 3 bonds; integration: solve() (low PRNG) breaks a 3-bond chain within 20 ticks. Gate: bonds unchanged without the law. |
| CHIRALITY | ✅ PASS | Same-sign TORQUE pair → perpendicular deflection (−0.008, 0.006); negative torque → mirror direction (+0.008, −0.006); opposite-sign and zero-torque pairs → null. Gate: null without the law. |

## Notes

- Validation method: integration-level `solve()` tests + direct law calls with `isSet()` gating.
- Repairs/upgrades: POLYMER expanded 2→6 mutual bond slots (stride 81-84 appended, `/100` hardcode fixed); ISOMERIZATION replaced the dead radius-breathing placeholder with real bond rearrangement (documented energy cost); CHIRALITY switched from POLARITY to the documented TORQUE DNA with handedness-direction; OXIDATION gained charge decay + glow flash.
- Full suite: 538/538 tests green (`v4/`); `vite build` clean.
