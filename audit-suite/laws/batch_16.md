# Batch 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE

Laws under audit (indices 60-63):

- **RESONANCE** (index 60, electromagnetism / CYAN)
- **FLUX** (index 61, electromagnetism / CYAN)
- **IONIZATION** (index 62, electromagnetism / CYAN)
- **DISCHARGE** (index 63, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| RESONANCE | ✅ PASS | `batch_16.test.js` — "RESONANCE attracts actively-pulsing particles with matching PULSE_RATE": SIGNAL=1 pair with PULSE_RATE 0.5/0.5 at 20 units → dist shrinks >0.05 over 60 solves; silent pair (no SIGNAL) → positions stable (±1e-3). |
| FLUX | ✅ PASS | `batch_16.test.js` — "FLUX pushes particles along the stored-charge gradient": CHARGE 0/2 pair at 10 units → lower-charge particle x moves >0.5 toward the gradient over 30 solves; law-off gate: x stays 100. |
| IONIZATION | ✅ PASS | `batch_16.test.js` — "IONIZATION strips charge onto particles on hard contact": POLARITY=1 pair at dist 2, relSpeed 2 → both CHARGE > 0 after 1 solve; law-off gate: both CHARGE stay 0. |
| DISCHARGE | ✅ PASS | `batch_16.test.js` — "DISCHARGE converts stored charge into motion and heat, resetting charge": CHARGE=1.5 → after 1 solve CHARGE=0, TEMPERATURE > 0, VEL_X ≠ 0; law-off gate: CHARGE stays 1.5, no heat. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_16.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- No repairs required; all four laws behave per LAW_HELP_DB.
- RESONANCE requires both particles to be actively signaling (SIGNAL > 0.01) and rewards matching PULSE_RATE via the `sync = 1 − |ΔPULSE_RATE|` term — verified with the silent-pair control.
