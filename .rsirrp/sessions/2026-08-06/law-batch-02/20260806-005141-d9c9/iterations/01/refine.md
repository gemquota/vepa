# Batch 02 — COLL / ACCR / PLANETARY / LIFE

Laws under audit (indices 4-7). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| COLL | Impulse bounce on overlap when the pair is closing (`relVelN > 0`): mass-weighted velocity exchange, bounciness from `ELASTICITY` DNA, softbody push separates overlapping bodies. **Standalone from ACCR** — COLL alone is pure elastic bouncing. Pairs that are fusing under ACCR coalesce instead of bouncing. Off = pass-through. | ✅ |
| ACCR | Mass fusion on overlap. **`FUSION_MOMENTUM` (DNA 16) is the MINIMUM relative momentum to fuse on impact** — faster pairs merge, slower pairs bounce. **`FUSION_TIME` (DNA 17) is how long sub-threshold pairs must stay in very close proximity before they fuse anyway** (proximity dwell; leaving contact resets the clock). Efficiency ×(0.5 + `FUSION` DNA); stars (`mass > starMass`) collapse-pull. Runs standalone without COLL; sub-threshold ACCR-only contacts get a gentle elastic bounce so matter doesn't silently pass through. | ✅ |
| PLANETARY | **Constant downward gravity toward the ground plane (z ≈ 0)** — particles fall through a planet's atmosphere. Force is scaled by mass so acceleration is mass-independent (all particles fall at the same rate). ×1.5 with GRAV. With WRAP off the soft-wall clamp turns z = 0 into the ground. | ✅ |
| LIFE | Metabolic energy decay ∝ (1−`ENERGY_EFFICIENCY`) × DECAY_RATE slider; photosynthesis +0.02×LIGHT_LEVEL; **when the metabolic budget hits 0 the organism dies (energy-depletion death)** — the LIFE metabolic path only, not charge/electromagnetic energy (those live in their own fields/laws). Hunger +0.02/tick, HUNGER>100 → dead. Senescence is a separate law. | ✅ |

## Implementation (v4.6.3)

- `v4/src/physics/solver.js` — COLL/ACCR split:
  - Dwell bookkeeping in the free `MITOSIS_TIMER` / `PARTNER_ID` stride fields; timer resets when the tracked partner leaves overlap range.
  - `fusing = relMomentum >= FUSION_MOMENTUM || dwell >= FUSION_TIME` (relMomentum = relSpeed × min(m1, m2)).
  - COLL push + bounce only when NOT fusing; ACCR-only sub-threshold contacts get a gentle elastic bounce.
  - ACCR mass transfer (dissolution / star collapse / mutual blend) only when fusing.
- `v4/src/physics/laws.js`:
  - `applyPlanetary` → constant downward gravity (az = −0.02×synergy×mass).
  - `applyLifeCycle` → death when metabolic energy hits 0 (before bio-pulse, only under LIFE).
- Tests: `v4/tests/audit/batch_02.test.js` (14 tests) + `v4/tests/audit/params_batch_11.test.js` (FUSION gates rewritten for min-momentum + dwell). Full suite 510/510 green; `vite build` clean.
- HELP_DB entries for COLL / ACCR / PLANETARY / LIFE updated in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (4 amendments applied)
- [x] Implementation + tests (510/510)
- [x] Deployed to https://vepa-v4.vercel.app
