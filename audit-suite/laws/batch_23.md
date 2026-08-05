# Batch 23 — SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY

Laws under audit (indices 88-91):

- **SYMBIOSIS** (index 88, biology / GREEN)
- **PARASITE** (index 89, biology / GREEN)
- **HIBERNATION** (index 90, biology / GREEN)
- **IMMUNITY** (index 91, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SYMBIOSIS | ✅ PASS | `v4/tests/audit/batch_23.test.js` — different-species contact transfers energy rich → poor: pair 100/40 becomes < 100 / > 40 with total conserved (140) after 1 tick. Gate: energies untouched without the law. |
| PARASITE | ✅ PASS | `v4/tests/audit/batch_23.test.js` — mass-1 parasite drains a mass-5 host: parasite ENERGY > 100, host < 100 after 1 tick. Gate: no drain without the law. |
| HIBERNATION | ✅ PASS | `v4/tests/audit/batch_23.test.js` — starving particle (ENERGY 20, vx 5) regains energy (> 20) and is damped (< 5) in 1 tick; well-fed particle (ENERGY 50) is unaffected (energy 50, vx 5 preserved over 10 ticks). |
| IMMUNITY | ✅ PASS | `v4/tests/audit/batch_23.test.js` — ARMOR regenerates 0 → > 0.5 and ENERGY rises above 100 over 100 ticks. Gate: armour stays 0 without the law. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. Functions live in `v4/src/physics/lawgroups/biologyLaws.js`; the solver dispatches SYMBIOSIS/PARASITE pairwise and HIBERNATION/IMMUNITY per-particle (k = 0.5).
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.
