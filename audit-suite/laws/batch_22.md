# Batch 22 — ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION

Laws under audit (indices 84-87):

- **ELASTICITY** (index 84, physics / BLUE)
- **TURBULENCE** (index 85, physics / BLUE)
- **CENTRIPETAL** (index 86, physics / BLUE)
- **ROTATION** (index 87, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ELASTICITY | ✅ PASS | `v4/tests/audit/batch_22.test.js` — overlapping pair (dist 0.5, radii 0.6) pushed apart: separation 0.5 → > 1.0 over 20 ticks. Gate: separation unchanged with ELASTICITY off. |
| TURBULENCE | ✅ PASS | `v4/tests/audit/batch_22.test.js` — seeded-LCG noise kicks leave a resting particle with speed > 0.05 after 100 ticks. Gate: velocity stays exactly 0 without the law. |
| CENTRIPETAL | ✅ PASS | `v4/tests/audit/batch_22.test.js` — particle at (100,100,100) pulled toward centre: distance to centre 1558.8 → < 1558.8 over 200 ticks, VEL_X/Y/Z all > 0 (harmonic attractor). Gate: no central pull without the law. |
| ROTATION | ✅ PASS | `v4/tests/audit/batch_22.test.js` — offset (−300, 0) gets a purely tangential first impulse (VEL_Y < 0, VEL_X = 0), then swirls: VEL_Y < 0 and POS_Y < 1000 after 100 ticks. Gate: no swirl without the law. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. All six functions live in `v4/src/physics/lawgroups/physicsLaws.js`; the solver dispatches ELASTICITY pairwise and TURBULENCE/CENTRIPETAL/ROTATION per-particle.
- The long-run ROTATION trajectory spirals (radial velocity grows because the tangential force keeps accelerating), so the assertion targets the deterministic first-impulse tangency plus the −y swirl, matching `LAW_HELP_DB` ("tangential force that sets the whole dish rotating").
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.
