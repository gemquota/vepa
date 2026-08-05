# Batch 06 — MUTATION_RATE / DECAY_RATE / visualScale / globalAlpha

Params under audit: MUTATION_RATE / DECAY_RATE / visualScale / globalAlpha

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| MUTATION_RATE | ✅ PASS | params_batch_06.test.js — offspring DNA deviates more at 5 than 0 (REPRO) |
| DECAY_RATE | ✅ PASS | params_batch_06.test.js — 2 decays twice as fast as 1; 0 stops decay (LIFE) |
| visualScale | ✅ PASS | params_batch_06.test.js — computeRadius scales linearly (expression.js) |
| globalAlpha | ✅ PASS | params_batch_06.test.js — computeAlpha scales (expression.js); renderer now multiplies depth alpha |

## Notes

- globalAlpha was NOT applied in renderer.js before this audit — fixed (depthAlpha × globalAlpha).
- Test file: `v4/tests/audit/params_batch_06.test.js`
