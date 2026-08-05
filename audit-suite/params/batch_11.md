# Batch 11 — DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME

Params under audit: DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.STIFFNESS | ✅ PASS | bond pull strength (already live) |
| DNA.FUSION | ✅ PASS | wired into ACCR — mass-transfer efficiency multiplier 0.5..1.5 (live) |
| DNA.FUSION_MOMENTUM | ✅ PASS (semantics corrected in law RRP batch 02) | MINIMUM relative momentum to fuse on impact; below it pairs bounce (was: max approach speed ×2) |
| DNA.FUSION_TIME | ✅ PASS (semantics corrected in law RRP batch 02) | seconds of continuous close proximity before sub-threshold pairs fuse anyway (was: AGE maturity gate ×50) |

## Notes

- Validated by `v4/tests/audit/params_batch_11.test.js` (4 tests): STIFFNESS scales bond spring force; FUSION scales ACCR mass transfer; FUSION_MOMENTUM gates fusion by minimum relative momentum; FUSION_TIME gates fusion by proximity dwell.
- Semantics corrected during the interactive law RRP (batch 02, 2026-08-05): user clarified FUSION_MOMENTUM = minimum momentum to fuse (below → bounce) and FUSION_TIME = close-proximity dwell time for sub-threshold pairs. Dwell tracked per contact pair in the free `MITOSIS_TIMER` / `PARTNER_ID` stride fields; leaving contact resets the clock.
- Test file: `v4/tests/audit/params_batch_11.test.js`
