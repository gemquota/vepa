# Batch 02 — COLL / ACCR / PLANETARY / LIFE

Laws under audit (indices 4-7):

- **COLL** (index 4, physics / BLUE)
- **ACCR** (index 5, physics / BLUE)
- **PLANETARY** (index 6, physics / BLUE)
- **LIFE** (index 7, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COLL | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_02.test.js` — "COLL: approaching particles bounce": closing speed 2.0 → ~1.3 after 16 ticks; pair stays on the correct side (separation 0.61, no crossing). Before the fix the pair crossed straight through (separation −40). Gate test confirms pass-through with COLL off. |
| ACCR | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "ACCR: a larger body absorbs mass": big body 10 → +0.06, small body 1.5 → −0.06 in one tick, mass conserved (Δ=6e-6). Gate test: masses unchanged with ACCR off. |
| PLANETARY | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "PLANETARY: particles are pulled toward the world centre": distance to centre 1558.8 → 1558.4 after 200 ticks, `VEL_X/Y/Z` all > 0 toward centre. Gate test: no motion with PLANETARY off. |
| LIFE | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "LIFE: metabolic energy decay": ENERGY 100 → 99.0 over 100 ticks (ENERGY_EFFICIENCY=0 ⇒ −0.01/tick); "LIFE: starvation kills": HUNGER=100 → DEAD=1 in one tick. Gate test: energy untouched with LIFE off. |

## Notes

- **REPAIR — COLL bounce condition (attempt 1):** the impulse was applied when `relVelN < 0`, but with the i→j collision normal the pair is *closing* when `relVelN > 0`, so approaching particles received no bounce and passed through each other (reproduced empirically: `approach i=(1020,v5) j=(980,v-5) dist=-40`). Separating pairs were also receiving a spurious impulse.
  - File: `v4/src/physics/solver.js` (inline collision block, formerly line ~344).
  - Before: `// Bounce if approaching\n          if (relVelN < 0) {`
  - After: `// Bounce if approaching (relVelN > 0 along the i→j normal means\n          // the pair is closing; a negative impulse along n separates them)\n          if (relVelN > 0) {`
  - Verified: approaching pair bounces (dist stays positive, closing speed drops); separating pair moves apart freely with velocities preserved; full unit suite (123 tests) still green.
- Validation method: integration-level `solve()` tests with `isSet()` gating; ACCR and COLL use the overlap path in the solver's pairwise block.
