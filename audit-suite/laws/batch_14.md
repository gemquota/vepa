# Batch 14 — COMMS / CHARGE_LAW / FIELD / CURRENT

Laws under audit (indices 52-55):

- **COMMS** (index 52, biology / GREEN)
- **CHARGE_LAW** (index 53, electromagnetism / CYAN)
- **FIELD** (index 54, electromagnetism / CYAN)
- **CURRENT** (index 55, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COMMS | ✅ PASS | `batch_14.test.js` — "COMMS emits signals over time and stays frozen when off": 4 particles, AGE=0, 120 solves → at least one SIGNAL > 1e-6; with no laws, SIGNAL=0.5 and MEMORY stay exact. "COMMS exchanges signal to a neighbour": sender SIGNAL=1, receiver 20 away → receiver SIGNAL > 0.1 after 10 solves. |
| CHARGE_LAW | ⚠️ REPAIRED (1 attempt) | `batch_14.test.js` — "CHARGE_LAW repels like charges and attracts opposite charges": POLARITY=1/1 pair at 10 units → dist grows >0.05 over 60 solves; POLARITY=1/−1 → dist shrinks >0.05; law-off gate: no movement. See repair notes. |
| FIELD | ✅ PASS | `batch_14.test.js` — "FIELD drifts particles along their POLARITY sign": POLARITY=+1 → VEL_Y > 0 after 1 solve; POLARITY=−1 → VEL_Y < 0; law-off gate: VEL_Y stays 0. |
| CURRENT | ✅ PASS | `batch_14.test.js` — "CURRENT diffuses stored charge between conductive neighbours": CHARGE 2/0 pair with CONDUCTIVITY 1 → after 10 solves charge1 < 2, charge2 > 0, |Δcharge| < 0.5; law-off gate: charge unchanged. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_14.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- **CHARGE_LAW repair (v4/src/physics/laws.js)**: `applyChargeForce` used `force = k*qq/(dist²+0.5)` along `dx` (toward the neighbor), which made like charges ATTRACT and opposite charges REPEL — the inverse of the HELP_DB contract ("Opposite charges attract, like charges repel") and of Coulomb's law. Flipped the sign to `force = -k*qq/(dist²+0.5)`. Existing direction-agnostic unit tests still pass.
- Full v4 unit suite (123 tests) still passes after repair.
