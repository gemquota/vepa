# Batch 17 — DNA.SIGNAL_STRENGTH / DNA.SIGNAL_DECAY / DNA.PROPAGATION_SPEED / DNA.TUNING_CH1

Params under audit: DNA.SIGNAL_STRENGTH / DNA.SIGNAL_DECAY / DNA.PROPAGATION_SPEED / DNA.TUNING_CH1

## Validation results

| Param | Status | Evidence |
|-------|--------|----------|
| DNA.SIGNAL_STRENGTH | ✅ PASS | communication intensity (already live) |
| DNA.SIGNAL_DECAY | ✅ PASS | signal persistence (already live) |
| DNA.PROPAGATION_SPEED | ✅ PASS | signal travel multiplier (laws.js numeric index 21) |
| DNA.TUNING_CH1 | ✅ PASS | receptor channel filter (emLaws + channelMatch) |

## Notes

## Notes

- Validated by params_batch_17.test.js (4 tests): SIGNAL_STRENGTH scales delivered energy; SIGNAL_DECAY controls persistence; PROPAGATION_SPEED amplifies delivery; TUNING_CH1 filters channels via channelMatch.
- All four confirmed live — no repairs needed.
- Test file: `v4/tests/audit/params_batch_17.test.js`
