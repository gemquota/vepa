# Batch 14 — DNA.CATALYSIS / DNA.HEAT_OUTPUT / DNA.BIRTH_RATE / DNA.DEATH_RATE

Params under audit: DNA.CATALYSIS / DNA.HEAT_OUTPUT / DNA.BIRTH_RATE / DNA.DEATH_RATE

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.CATALYSIS | ✅ PASS | params_batch_14.test.js — higher catalysis accelerates AUTOCATALYSIS energy gain |
| DNA.HEAT_OUTPUT | ⚠️ REPAIRED | params_batch_14.test.js — charged oxidation releases energy scaled by heat output (was dead; wired into applyOxidationEffect) |
| DNA.BIRTH_RATE | ✅ PASS | params_batch_14.test.js — high rate reproduces at prng 0.05 where low rate does not (REPRO) |
| DNA.DEATH_RATE | ✅ PASS | params_batch_14.test.js — 10 kills old particles, 0 never does (SENESCENCE) |

## Notes

## Notes

- Validated by params_batch_14.test.js (4 tests): CATALYSIS accelerates autocatalytic energy gain; HEAT_OUTPUT releases energy on charged oxidation; BIRTH_RATE gates REPRO at the right prng band; DEATH_RATE kills old particles under SENESCENCE.
- REPAIRS: HEAT_OUTPUT was dead (only read by the uncalled applyOxidation) — wired into applyOxidationEffect: charged oxidation now releases `charge·HEAT_OUTPUT·0.05·dt` energy + temperature.
- Test file: `v4/tests/audit/params_batch_14.test.js`
