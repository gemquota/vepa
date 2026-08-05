# Batch 18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL

Laws under audit (indices 68-71):

- **STIGMERGY** (index 68, information / GOLD)
- **SIGNAL_BOOST** (index 69, information / GOLD)
- **LEARN** (index 70, information / GOLD)
- **SYMBOL** (index 71, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| STIGMERGY | ✅ PASS | `v4/tests/audit/batch_18.test.js` — `applyTrailWrite(100,100,100, 1,0,0)` → TRAIL (108,100,100) (pos + vel·8); `applyStigmergyForce` toward a trail 8 units east → ax ≈ 0.2667 (k 0.3). Integration: `solve()` steers a follower toward a pre-laid trail (VEL_X > 0). Gating `isSet` verified. |
| SIGNAL_BOOST | ✅ PASS | `v4/tests/audit/batch_18.test.js` — signal 0.5 relays +0.04 to neighbour (k 0.08); silent particle relays nothing. Integration: `solve()` propagates signal to a quiet neighbour. Gating `isSet` verified. |
| LEARN | ✅ PASS | `v4/tests/audit/batch_18.test.js` — `applyLearnAlign` moves VEL_X 0 → +0.05 toward a v=10 neighbour (k 0.05, kk = k·0.1). Integration: `solve()` steers the stationary particle (0 < VEL_X < 10). Gating `isSet` verified. |
| SYMBOL | ✅ PASS | `v4/tests/audit/batch_18.test.js` — same-species with SPECIES_AFFINITY 1 → attraction ax ≈ 0.03 (dx 3, dist 5, k 0.3); different species → repulsion −0.015 (affinity flipped ×0.5). Integration: 40 ticks of `solve()` converge same-species flockmates. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no implementation repairs, no implementation files modified.
- Two test-setup corrections were made in `v4/tests/audit/batch_18.test.js` (test-only): the direct STIGMERGY check now seeds the follower's POS_X (trail offset was computed from origin otherwise), and the integration check asserts the follower's pull (the trail-writer itself has zero self-force within the tick, as trail write happens after its pair pass).
- Test file: `v4/tests/audit/batch_18.test.js` (15 tests).
