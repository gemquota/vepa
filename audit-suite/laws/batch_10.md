# Batch 10 — SOUL_LAW / MIND / VOID / BOND

Laws under audit (indices 36-39):

- **SOUL_LAW** (index 36, metaphysics / RED)
- **MIND** (index 37, metaphysics / RED)
- **VOID** (index 38, physics / BLUE)
- **BOND** (index 39, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SOUL_LAW | ✅ PASS | `SOUL_LAW direct` — i soul 0 → 0.05 from neighbor soul 50 (distSq 100); no transfer cross-species, beyond 10k, or when off. `SOUL_LAW integration` — i soul > 0 with law on; 0 with law off. |
| MIND | ✅ PASS | `MIND direct` — same-species pair returns signalBoost 0.001 (distSq 100), ax=0; null cross-species, beyond 40k, and when off. `MIND integration` — i SIGNAL > 0 with law on; 0 with law off. |
| VOID | ✅ PASS | `VOID direct` — particle at (1100,1000,1000) in 2000³ world gets ax=+0.0005 outward; null exactly at center and when off. `VOID integration` — particle at x=1800 gains vx > 0; 0 with law off. |
| BOND | ✅ PASS | `BOND direct` — stretched pair (dist 3, rest 2.2, stiffness 1) returns ax=+0.04, registers BOND_COUNT=1 + BOND_PARTNER_1 on both sides, no double count on re-call; null beyond 30, stiffness<0.01, and when off. `BOND integration` — both particles BOND_COUNT=1 with law on; 0 with law off. |

## Notes

- Method: direct law-function calls (`applySoul`/`applyMind`/`applyVoid`/`applyBond` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_10.test.js` (8 tests, all pass).
- No repairs needed. Bond slots must be pre-initialized to −1 (seed does this); default 0 slot values would block registration, which is expected buffer hygiene, not a law fault.
