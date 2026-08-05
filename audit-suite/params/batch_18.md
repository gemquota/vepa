# Batch 18 — DNA.TUNING_CH2 / DNA.TUNING_CH3 / DNA.TUNING_CH4 / DNA.MEMORY_DECAY

Params under audit: DNA.TUNING_CH2 / DNA.TUNING_CH3 / DNA.TUNING_CH4 / DNA.MEMORY_DECAY

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.TUNING_CH2 | ✅ PASS | channel 2 filter — channelMatch reads all 4 channels (dynamic dnaI[22+c]) |
| DNA.TUNING_CH3 | ✅ PASS | channel 3 filter — channelMatch |
| DNA.TUNING_CH4 | ✅ PASS | channel 4 filter — channelMatch |
| DNA.MEMORY_DECAY | ✅ PASS | memory persistence (already live) |

## Notes

## Notes

- Validated by params_batch_18.test.js (4 tests): TUNING_CH2/3/4 filter channel 2-4 pairs via channelMatch (dynamic `dnaI[22+c]` — all 4 channels live); MEMORY_DECAY controls memory-trace persistence.
- TUNING_CH2-4 were initially flagged dead, but channelMatch consumes all 4 dynamically — confirmed PASS.
- Test file: `v4/tests/audit/params_batch_18.test.js`
