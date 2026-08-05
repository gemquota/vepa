# Batch 01 — GRAV / DRAG / ENTR / WRAP

Laws under audit (indices 0-3):

- **GRAV** (index 0, physics / BLUE)
- **DRAG** (index 1, physics / BLUE)
- **ENTR** (index 2, physics / BLUE)
- **WRAP** (index 3, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| GRAV | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "GRAV: particles accelerate toward each other and separation decreases": separation 10 → 9.68 after 5 ticks; `VEL_X` of i > 0 and of j < 0. Gate test confirms zero motion with GRAV off. |
| DRAG | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "DRAG: velocity decays over time": `VEL_X` 5 → ~2.73 over 60 ticks (viscosity 0.98 + friction 0.01, per-tick factor ≈0.99). Gate test: velocity preserved to 5 with DRAG off. |
| ENTR | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "ENTR: jitter injects random kinetic energy": resting particles (JITTER=5, seeded LCG prng) reach `|v| ≈ 0.4` after 80 ticks. Gate test: velocity stays 0 with ENTR off. |
| WRAP | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "WRAP: particles crossing the edge reappear on the opposite side": particle at x=1995, vx=10 lands at x≈2.5 after 3 ticks. Gate test: with WRAP off, edge clamps to ~1998.7 and flips velocity to −5. |

## Notes

- Validation method: integration-level `solve()` checks (see `v4/tests/unit/lawCategories.test.js` for the `makeWorld`/`solve` pattern), one focused test + one gate test per law, plus `isSet()` gating assertions.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyGravity`, DRAG damping block, ENTR jitter block, WRAP toroidal wrap block).
