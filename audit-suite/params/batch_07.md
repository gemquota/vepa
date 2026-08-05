# Batch 07 — starMass / simSpeed / focalLength / ortho

Params under audit: starMass / simSpeed / focalLength / ortho

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| starMass | ✅ PASS | params_batch_07.test.js — lower threshold amplifies gravity collapse pull |
| simSpeed | ✅ PASS | params_batch_07.test.js — bounded [0.1,10]; dt-scaled integration path active (state-level note: main.js DT×simSpeed) |
| focalLength | ✅ PASS | params_batch_07.test.js — 400 < 1200 < 4000 projected radius for a point behind target |
| ortho | ✅ PASS | params_batch_07.test.js — ortho 1 flattens the perspective depth factor |

## Notes

- camera.js is pure (no DOM) — fully unit-testable. Note: RESET CAMERA previously left focal/ortho/sensitivities set; fixed in resetCamera.
- Test file: `v4/tests/audit/params_batch_07.test.js`
