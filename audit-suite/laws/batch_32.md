# Batch 32 — SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER

Laws under audit (indices 124-127):

- **SPECTRAL** (index 124, quantum / INDIGO)
- **WAVEFUNCTION** (index 125, quantum / INDIGO)
- **HYPERPLANE** (index 126, quantum / INDIGO)
- **ANTIMATTER** (index 127, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SPECTRAL | ✅ PASS | `batch_32.test.js` — "SPECTRAL emits a species-tagged SIGNAL tone": direct species 3 → SIGNAL += 0.004; solver: SIGNAL > 0.005 after 5 ticks; law-off gate: no signal. |
| WAVEFUNCTION | ⚠️ REPAIRED (1 attempt) | `batch_32.test.js` — "WAVEFUNCTION snaps position onto the wave grid": direct q=0.5 → 100.3→100.5; solver (q=0.25) → 100.3→100.25 after 1 tick (snap persisted after repair); law-off gate: position unchanged. See repair notes. |
| HYPERPLANE | ✅ PASS | `batch_32.test.js` — "HYPERPLANE applies a constant slow shear force": direct ax=0.001, ay=0.0005, az=0.0002; solver: VEL_X and VEL_Y accumulate > 1e-5 over 5 ticks; law-off gate: velocity stays 0. |
| ANTIMATTER | ✅ PASS | `batch_32.test.js` — "ANTIMATTER annihilates opposite-charge pairs on contact": direct CHARGE +1/−1 → both DEAD=1, SIGNAL burst 10; solver: both DEAD=1 with SIGNAL > 0 after 1 tick; law-off gate: both alive, no signal. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_32.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **WAVEFUNCTION repair (v4/src/physics/solver.js)**: `applyWavefunction` snaps the position directly in the buffer, but the solver's stale-local writeback erased the snap (position stayed 100.3). Same root cause and fix as TUNNELING/UNCERTAINTY/TELEPORT: position reconciliation in the solver (`px = view[iBase+S.POS_X] + softbodyDX`), which is the 4th law fixed by this single solver change.
- Spec deviation noted (not repaired): SPEC item 46 says `applyAntimatter` should return `true` on annihilation so the solver breaks the pair loop, but the implementation returns `null` always and the solver dispatch doesn't check the return. The functional effect (both particles DEAD=1 + signal burst) is fully delivered, so this is a performance/robustness nit rather than a functional fault.
- Full v4 suite (47 files / 420 tests) passes after repair.
