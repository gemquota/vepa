# Batch 01 — WORLD_SIZE / GROUND_HEIGHT / PARTICLE_COUNT / INITIAL_POP

Params under audit: WORLD_SIZE / GROUND_HEIGHT / PARTICLE_COUNT / INITIAL_POP

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| WORLD_SIZE | ✅ PASS | params_batch_01.test.js — spawns stay inside bounds; clamp [50,20000] |
| GROUND_HEIGHT | ✅ PASS | params_batch_01.test.js — spawn z confined to ground band; 1.0 = full volume |
| PARTICLE_COUNT | ✅ PASS | params_batch_01.test.js — spawnCaps hardCap = min(PARTICLE_COUNT, MAX_PARTICLES) |
| INITIAL_POP | ✅ PASS | params_batch_01.test.js — initialPopulationTarget + perSpeciesAllocation; clamp [10,5000] |

## Notes

- Plumbing: src/state/worldParams.js (SSOT) + src/spawn/distribution.js. spawnCaps clamp bug found & fixed by orchestrator.
- Test file: `v4/tests/audit/params_batch_01.test.js`
