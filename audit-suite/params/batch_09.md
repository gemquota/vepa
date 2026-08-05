# Batch 09 — DNA.TORQUE / DNA.JITTER / DNA.TIDAL / DNA.INERTIA

Params under audit: DNA.TORQUE / DNA.JITTER / DNA.TIDAL / DNA.INERTIA

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.TORQUE | ⚠️ REPAIRED | wired into solver integration — velocity rotates around Z by torque·0.02·dt (was dead) |
| DNA.JITTER | ✅ PASS | ENTR jitter amplitude (already live) |
| DNA.TIDAL | ⚠️ REPAIRED | wired into applyGravity — close-range differential boost (was dead) |
| DNA.INERTIA | ✅ PASS | acceleration resistance divisor (already live) |

## Notes

## Notes

- Validated by params_batch_09.test.js (4 tests): TORQUE rotates the velocity vector around Z while preserving speed; JITTER scales ENTR noise; TIDAL amplifies close-range gravity pull; INERTIA divides acceleration.
- REPAIRS (orchestrator): TORQUE + TIDAL were dead — wired into solver integration / applyGravity. (AGENTS errored pre-task; orchestrator completed + ran the suite.)
- Test file: `v4/tests/audit/params_batch_09.test.js`
