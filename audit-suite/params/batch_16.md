# Batch 16 — DNA.SPECIES_AFFINITY / DNA.SIGNAL_RESP / DNA.PULSE_RATE / DNA.NEIGHBORHOOD_RADIUS

Params under audit: DNA.SPECIES_AFFINITY / DNA.SIGNAL_RESP / DNA.PULSE_RATE / DNA.NEIGHBORHOOD_RADIUS

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.SPECIES_AFFINITY | ✅ PASS | same/different species bias (already live) |
| DNA.SIGNAL_RESP | ✅ PASS | receiver sensitivity (laws.js signal block, numeric index 13) |
| DNA.PULSE_RATE | ✅ PASS | oscillator frequency (already live) |
| DNA.NEIGHBORHOOD_RADIUS | ✅ PASS | signal range (laws.js + metaLaws) |

## Notes

## Notes

- Validated by params_batch_16.test.js (4 tests): SPECIES_AFFINITY pulls same-species; SIGNAL_RESP converts signal into energy/force; PULSE_RATE drives oscillator emission; NEIGHBORHOOD_RADIUS bounds signal reach.
- All four confirmed live (numeric index reads in laws.js / metaLaws) — no repairs needed.
- Test file: `v4/tests/audit/params_batch_16.test.js`
