# Batch 31 — COHERENCE / BOSONIC / FERMIONIC / SPIN

Laws under audit (indices 120-123):

- **COHERENCE** (index 120, quantum / INDIGO)
- **BOSONIC** (index 121, quantum / INDIGO)
- **FERMIONIC** (index 122, quantum / INDIGO)
- **SPIN** (index 123, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COHERENCE | ✅ PASS | `batch_31.test.js` — "COHERENCE phase-locks similar neighbour velocities": direct diff 0.5 < 1 → ax=0.01; solver: relative velocity shrinks over 30 ticks; law-off gate: relative velocity preserved exactly. |
| BOSONIC | ✅ PASS | `batch_31.test.js` — "BOSONIC attracts particles within short range (glue)": direct dist 2 → ax=1, dist 4 → null; solver: pair 2 apart → dist shrinks (collision floor ~1.2) over 10 ticks; law-off gate: dist unchanged. |
| FERMIONIC | ✅ PASS | `batch_31.test.js` — "FERMIONIC pushes overlapping particles apart (exclusion)": direct dist 1 < rSum 1.2 → ax < 0, dist 2 → null; solver: overlapping pair (0.8) separates over 10 ticks; law-off gate: dist unchanged. |
| SPIN | ⚠️ REPAIRED (1 attempt) | `batch_31.test.js` — "SPIN applies a perpendicular wiggle with particle-index parity": direct even particle → ay=+0.1, odd particle → ay=−0.1; solver: particle 0 VEL_Y > +0.001, particle 1 VEL_Y < −0.001 after 5 ticks. See repair notes. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_31.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **SPIN repair (v4/src/physics/lawgroups/quantumLaws.js)**: `applySpin` derived the direction from `iBase % 2` (buffer-offset parity). With `PARTICLE_STRIDE = 100`, every particle's base offset is even, so every particle got the SAME spin sign — the documented particle-index parity ("Spin direction is set by particle index parity") never alternated. Fixed to `Math.floor(iBase / PARTICLE_STRIDE) % 2` so particle 0 → +, particle 1 → −, etc. The existing unit test (`oddBase = PARTICLE_STRIDE + 1`) still passes.
- Full v4 suite (47 files / 420 tests) passes after repair.
