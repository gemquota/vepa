# Batch 03 — SPAWN_CENTRE_BIAS / GLOBAL_G / WIND / DAMPING

Params under audit: SPAWN_CENTRE_BIAS / GLOBAL_G / WIND / DAMPING

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| SPAWN_CENTRE_BIAS | ✅ PASS | params_batch_03.test.js — bias 1 pins to centre; bias 0 makes centres irrelevant |
| GLOBAL_G | ✅ PASS | params_batch_03.test.js — 0 = no gravity; 2 pulls faster than 1 (solver effG) |
| WIND | ✅ PASS | params_batch_03.test.js — +X drift accumulates; 0 = no drift |
| DAMPING | ✅ PASS | params_batch_03.test.js — 50% decays 5→<0.1 in 20 ticks; 0 preserves velocity |

## Notes

- World-param pass added to solver.js (effG, wind, damping). Gate law WRAP used to run the solver.
- Test file: `v4/tests/audit/params_batch_03.test.js`
