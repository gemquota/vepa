# Batch 29 — SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE

Laws under audit (indices 112-115):

- **SUPERPOSITION** (index 112, quantum / INDIGO)
- **TUNNELING** (index 113, quantum / INDIGO)
- **DECOHERENCE** (index 114, quantum / INDIGO)
- **WAVE_PARTICLE** (index 115, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SUPERPOSITION | ✅ PASS | `batch_29.test.js` — "SUPERPOSITION adds random velocity-spread force": direct `applySuperposition(buf,0,1,rngHigh)` → ax=ay=0.8; solver (k=0.05, prng 0.9) → |VEL_X| > 0.001 after 1 tick; law-off gate: velocity frozen. |
| TUNNELING | ⚠️ REPAIRED (1 attempt) | `batch_29.test.js` — "TUNNELING phase-shifts position when triggered": direct k=200 prng 0.9 → POS 100→103.6 (hop radius×6); solver (k=0.5, prng 0.0009) → POS 100→96.4 after 1 tick; law-off gate: frozen. See repair notes. |
| DECOHERENCE | ✅ PASS | `batch_29.test.js` — "DECOHERENCE damps velocity and radiates SIGNAL": direct VEL 5 → ax=−0.05, SIGNAL+0.001; solver: VEL < 5−0.001 and SIGNAL > 0.0005 after 10 ticks; law-off gate: frozen. |
| WAVE_PARTICLE | ✅ PASS | `batch_29.test.js` — "WAVE_PARTICLE damps slow (wave) and amplifies fast (particle) motion": direct VEL 0.2 → damping ax<0, VEL 5 → ax=+0.05, VEL 1 → null; solver: fast VEL grows >5, slow VEL shrinks <0.2. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_29.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **TUNNELING repair (v4/src/physics/solver.js)**: `applyTunneling` writes the hop directly to the buffer, but the solver's per-particle writeback used the stale local `px` read at iteration start, erasing the hop every tick (position stayed at 100). Fixed by reconciling the local position with the buffer after the per-particle law section: `px = view[iBase+S.POS_X] + softbodyDX` (the `softbodyDX` delta captured after the pair loop preserves the COLL softbody push while folding in buffer position mutations).
- Full v4 suite (47 files / 420 tests) passes after repair, including the COLL batch.
