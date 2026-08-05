# Batch 02 — MAX_POP / SHAPE / SPAWN_CENTRES / SPAWN_CENTRE_RANDOM

Params under audit: MAX_POP / SHAPE / SPAWN_CENTRES / SPAWN_CENTRE_RANDOM

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| MAX_POP | ✅ PASS | params_batch_02.test.js — softCap = min(MAX_POP, MAX_PARTICLES) |
| SHAPE | ✅ PASS | params_batch_02.test.js — shape 1 pulls to uniform draw; shape 0 keeps grid anchors; mean near centre |
| SPAWN_CENTRES | ✅ PASS | params_batch_02.test.js — 1 = world middle; N = N distinct centres |
| SPAWN_CENTRE_RANDOM | ✅ PASS | params_batch_02.test.js — 0 = deterministic grid; 1 = scattered |

## Notes

- Test note: spread statistics cannot distinguish grid vs random (the grid is uniform); tests assert the mechanism instead.
- Test file: `v4/tests/audit/params_batch_02.test.js`
