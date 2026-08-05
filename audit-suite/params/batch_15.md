# Batch 15 — DNA.MUTATION / DNA.ENERGY_EFFICIENCY / DNA.SEX_CHANCE / DNA.PREDATION_BIAS

Params under audit: DNA.MUTATION / DNA.ENERGY_EFFICIENCY / DNA.SEX_CHANCE / DNA.PREDATION_BIAS

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.MUTATION | ✅ PASS | offspring DNA randomness (already live) |
| DNA.ENERGY_EFFICIENCY | ✅ PASS | metabolic conversion (already live) |
| DNA.SEX_CHANCE | ⚠️ REPAIRED | wired into REPRO — crossover/second-parent probability ×(1+SEX_CHANCE×0.5) (was dead) |
| DNA.PREDATION_BIAS | ✅ PASS | attraction to lower-mass species (already live) |

## Notes

## Notes

- Validated by params_batch_15.test.js (4 tests): MUTATION increases offspring DNA deviation; ENERGY_EFFICIENCY slows LIFE metabolic decay; SEX_CHANCE boosts two-parent crossover probability; PREDATION_BIAS scales predator pursuit.
- REPAIRS: SEX_CHANCE was dead — wired into applyReproduction's crossover gate `crossoverRate·(1 + SEX_CHANCE·0.5)`.
- Test file: `v4/tests/audit/params_batch_15.test.js`
