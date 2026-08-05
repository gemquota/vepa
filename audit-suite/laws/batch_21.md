# Batch 21 — ENTANGLEMENT / HISTORY / TIDE / FRICTION

Laws under audit (indices 80-83):

- **ENTANGLEMENT** (index 80, metaphysics / RED)
- **HISTORY** (index 81, information / GOLD)
- **TIDE** (index 82, physics / BLUE)
- **FRICTION** (index 83, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ENTANGLEMENT | ✅ PASS | `v4/tests/audit/batch_21.test.js` — link forms on contact (`ENTANGLE_ID` 1/0, `ENTANGLE_PHASE` ≈ 0.998 after 1 tick); non-local coupling converges velocities (rel 5.0 → < 5.0 over 150 ticks, link still live); phase forced to 0.02 snaps the link to `ENTANGLE_ID = -1`. Gate: no link with the law off. |
| HISTORY | ✅ PASS | `v4/tests/audit/batch_21.test.js` — two corner particles drift toward the shared memory-field COM: first ticks pull each toward the centre (VEL_X/Y/Z > 0), separation 3117.7 → 2702.7 over 120 ticks. Gate: no drift with the law off. |
| TIDE | ✅ PASS | `v4/tests/audit/batch_21.test.js` — light particle (mass 1.5) accelerates toward a mass-20 neighbour (VEL_X > 0), separation 100 → < 100 over 100 ticks. Gate: no mass coupling with TIDE off. |
| FRICTION | ✅ PASS | `v4/tests/audit/batch_21.test.js` — velocity-dependent drag slows a vx=5 particle to < 5 over 100 ticks (still positive). Gate: velocity preserved exactly with FRICTION off. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating (see `v4/tests/unit/lawCategories.test.js` for the `makeWorld`/`solve` pattern). ENTANGLEMENT dispatch is pairwise (`applyEntanglePair`) + per-particle (`applyEntanglement`); HISTORY is per-particle write/force + `applyHistoryCalc()` once per solve (`v4/src/physics/laws.js`, dispatched from `v4/src/physics/solver.js`); TIDE/FRICTION are `v4/src/physics/lawgroups/physicsLaws.js`.
- A single-particle HISTORY drift test initially overshot the COM (the accumulating trail pulls the particle back — documented "archaeology" behaviour), so the assertion was replaced with a two-particle convergence test, which is deterministic.
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.
