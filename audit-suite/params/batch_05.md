# Batch 05 — RADIATION_LEVEL / SPAWN_RATE / SPECIES_INTERACTION / ENERGY_TRANSFER

Params under audit: RADIATION_LEVEL / SPAWN_RATE / SPECIES_INTERACTION / ENERGY_TRANSFER

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| RADIATION_LEVEL | ✅ PASS | params_batch_05.test.js — 0 disables damage; 5 > 1 (RADIATION law) |
| SPAWN_RATE | ✅ PASS | params_batch_05.test.js — clamp [0,100] + persistence (state-level; feed is in main.js) |
| SPECIES_INTERACTION | ✅ PASS | params_batch_05.test.js — 0 no pull; 2 pulls harder than 1 (AFFINITY, same-species) |
| ENERGY_TRANSFER | ✅ PASS | params_batch_05.test.js — 0 blocks conduction; 2 faster than 1 (ENERGY law) |

## Notes

- SPECIES_INTERACTION test uses same-species pairs (positive affinity only attracts same species by design).
- Test file: `v4/tests/audit/params_batch_05.test.js`
