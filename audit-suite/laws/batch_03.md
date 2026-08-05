# Batch 03 — GLOW / AFFINITY / REPRO / TRACK

Laws under audit (indices 8-11):

- **GLOW** (index 8, biology / GREEN)
- **AFFINITY** (index 9, biology / GREEN)
- **REPRO** (index 10, biology / GREEN)
- **TRACK** (index 11, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| GLOW | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "GLOW: signaling particles regenerate energy": SIGNAL=1 → ENERGY 50 → 51.0 over 100 ticks (+0.01/tick). Gate test: energy stays 50 with GLOW off. |
| AFFINITY | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "AFFINITY: same-species particles with positive affinity attract": separation 100 → ~73 over 80 ticks; `VEL_X` of i > 0, of j < 0. Gate test: separation unchanged (100) with AFFINITY off. |
| REPRO | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "REPRO: mature, high-energy particles spawn offspring": `drainOffspring()` returns 1 child (parentId 0, energy 60); parent ENERGY 100 → 50. Gate test: no offspring with REPRO off. |
| TRACK | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "TRACK: predators chase lower-mass prey": predator (mass 2, PREDATION_BIAS 1) closes separation 100 → ~92 over 100 ticks and gains `VEL_X > 0`. Gate test: no chase with TRACK off. |

## Notes

- Validation method: integration-level `solve()` tests with `isSet()` gating; REPRO uses the exported `drainOffspring()` / `resetOffspringRing()` from `v4/src/physics/solver.js` to observe spawned children.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyGlowEffect`, `applyAffinity`, `applyReproduction`, `applyTrackingBehavior`).
