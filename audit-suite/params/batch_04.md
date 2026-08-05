# Batch 04 — VISCOSITY / ENTROPY / HEAT_CAPACITY / LIGHT_LEVEL

Params under audit: VISCOSITY / ENTROPY / HEAT_CAPACITY / LIGHT_LEVEL

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| VISCOSITY | ✅ PASS | params_batch_04.test.js — 0.9 decays faster than 1.0 (DRAG dragFactor) |
| ENTROPY | ✅ PASS | params_batch_04.test.js — 2 > 1.2× motion of 1; 0 = none (ENTR jitter) |
| HEAT_CAPACITY | ✅ PASS | params_batch_04.test.js — 0.1 equilibrates faster than 10 (HEAT transfer) |
| LIGHT_LEVEL | ✅ PASS | params_batch_04.test.js — 2 gains more than 0.5; 0 = decay only (LIFE photosynthesis) |

## Notes

- OPEN ITEM: world VISCOSITY < ~0.8 makes the DRAG force overshoot (the (1−dragFactor)×10 term swings velocity past zero). Candidate repair: clamp the drag delta to the current velocity. Existing LIFE decay test now gates LIGHT_LEVEL=0.
- Test file: `v4/tests/audit/params_batch_04.test.js`
