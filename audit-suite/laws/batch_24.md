# Batch 24 — ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION

Laws under audit (indices 92-95):

- **ELECTROLYSIS** (index 92, chemistry / PURPLE)
- **PHOTOLYSIS** (index 93, chemistry / PURPLE)
- **PRECIPITATION** (index 94, chemistry / PURPLE)
- **NEUTRALIZATION** (index 95, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ELECTROLYSIS | ✅ PASS | `v4/tests/audit/batch_24.test.js` — charge imbalance (1 vs 0) converts mass into energy + signal: MASS 1.5 → < 1.5, ENERGY > 100, SIGNAL > 0 after 1 tick. Gate: balanced charges (Δ 0.2) are inert (mass/signal unchanged). |
| PHOTOLYSIS | ✅ PASS | `v4/tests/audit/batch_24.test.js` — SIGNAL 1 decomposes mass into energy and spends light: MASS < 1.5, ENERGY > 100, SIGNAL ≈ 0.9 after 1 tick. Gate: weak signal (0.2) is inert. |
| PRECIPITATION | ✅ PASS | `v4/tests/audit/batch_24.test.js` — high-energy contact condenses: MASS 1.5 → > 1.5, RADIUS 0.458 → < 0.458, ENERGY < 100 after 1 tick. Gate: mass/energy unchanged without the law. |
| NEUTRALIZATION | ✅ PASS | `v4/tests/audit/batch_24.test.js` — opposite charges (1 / −1) cancel toward 0 and release heat: |CHARGE| < 1 for both, TEMPERATURE > 0 for both after 1 tick. Gate: same-sign charges (0.5/0.5) are inert. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. Functions live in `v4/src/physics/lawgroups/chemistryLaws.js`; the solver dispatches ELECTROLYSIS/PRECIPITATION/NEUTRALIZATION pairwise and PHOTOLYSIS per-particle (k = 0.5).
- RADIUS assertions use the solver-recomputed radius (BASE_RADIUS × mass^⅓ ≈ 0.458), not the 0.6 seed value; the PRECIPITATION gate asserts mass/energy since radius is recomputed every tick by the solver core regardless of the law.
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.
