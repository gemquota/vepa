# Batch 03 — GLOW / AFFINITY / REPRO / TRACK

Laws under audit (indices 8-11):

- **GLOW** (index 8, biology / GREEN)
- **AFFINITY** (index 9, biology / GREEN)
- **REPRO** (index 10, biology / GREEN)
- **TRACK** (index 11, biology / GREEN)

## Validation results (semantics confirmed in the interactive law RRP, 2026-08-05)

| Law | Status | Evidence |
|-----|--------|----------|
| GLOW | ✅ CONFIRMED + EXTENDED | now does both: emits signal pulses (PULSE_RATE×SIGNAL_STRENGTH oscillator) and converts signal into life energy; signal (SIGNAL) is a separate energy channel from metabolism (ENERGY) |
| AFFINITY | ✅ CONFIRMED + REPAIRED | same-species pull scales with positive affinity (was `Math.abs` — xenophobic species wrongly attracted their own kind); inert at 0; cross-species repel only when negative |
| REPRO | ✅ CONFIRMED + REPAIRED | gated on REPRODUCTIVE_DRIVE (stride 79) instead of raw ENERGY; drive accumulates from BIRTH_RATE, consumed on spawn |
| TRACK | ✅ CONFIRMED + REPAIRED | prey must be a different species (was same-species chasable) |

## Notes

- Validation method: integration-level `solve()` tests in `v4/tests/audit/batch_03.test.js` (13 tests) + updated REPRO/AFFINITY param tests in `params_batch_06/14/15/16`.
- Multi-energy architecture introduced: `ELECTRIC_ENERGY` (77), `STORED_ENERGY` (78), `REPRO_DRIVE` (79) stride fields — initialized at spawn and carried through multiplex shards.
- Full suite: 515/515 green.
