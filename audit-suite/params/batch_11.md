# Batch 11 — DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME

Params under audit: DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.STIFFNESS | ✅ PASS | bond pull strength (already live) |
| DNA.FUSION | ⚠️ REPAIRED | wired into ACCR — mass-transfer efficiency multiplier 0.5..1.5 (was dead) |
| DNA.FUSION_MOMENTUM | ✅ PASS | min collision speed for merging (already live) |
| DNA.FUSION_TIME | ⚠️ REPAIRED | wired into ACCR — maturity gate AGE ≥ FUSION_TIME×50 (was dead) |

## Notes

## Notes

- Validated by params_batch_11.test.js (4 tests): STIFFNESS scales bond spring force; FUSION scales ACCR mass transfer; FUSION_MOMENTUM gates merge by approach speed; FUSION_TIME gates merge by AGE maturity.
- REPAIRS: FUSION + FUSION_TIME were dead — wired into the ACCR collision block (existing batch_02 ACCR test now gates FUSION_TIME=0).
- Test file: `v4/tests/audit/params_batch_11.test.js`
