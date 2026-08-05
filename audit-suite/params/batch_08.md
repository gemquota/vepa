# Batch 08 — rotateSensitivity / panSensitivity / DNA.FORCE / DNA.VISCOSITY

Params under audit: rotateSensitivity / panSensitivity / DNA.FORCE / DNA.VISCOSITY

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| rotateSensitivity | ✅ PASS | params_batch_08.test.js — setCameraConfig persists; resetCamera restores 1.0 |
| panSensitivity | ✅ PASS | params_batch_08.test.js — setCameraConfig persists; resetCamera restores 1.0 |
| DNA.FORCE | ⚠️ REPAIRED | params_batch_08.test.js — positive amplifies gravity pull, negative repels (GRAV); was completely dead, wired into applyGravity (±100 → ±2 scale) |
| DNA.VISCOSITY | ✅ PASS | params_batch_08.test.js — 0.9 decays faster than 0.99 (DRAG) |

## Notes

## Notes

- REPAIRS: DNA.FORCE was completely dead (no physics reads anywhere) — wired into applyGravity (±100 → ±2 scale, negative = repel). resetCamera now restores all configurable camera fields (focalLength/ortho/sensitivities).
- Test file: `v4/tests/audit/params_batch_08.test.js`
