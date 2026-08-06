# Batch 13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION

Laws under audit (indices 48-51). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| CLAIRVOYANCE | **Slight cost** (user: "1. Slight cost.") — predictive steering toward a neighbor's 3-tick velocity-extrapolated position stays, but sensing the future now drains a little energy: `ENERGY −= 0.02×synergy×dt` (floor 0) per prediction. | ✅ |
| PRECOGNITION | **Ditto** (user: "2. Ditto.") — collision-course anticipation (perpendicular dodge, dist 1–50, dot < 0) stays, and each dodge costs `ENERGY −= 0.02×synergy×dt` (floor 0). No drain when the pair is moving apart (no prediction happens). | ✅ |
| ASTRAL | **Keep ghosting + expand** (user: "3. That and further expansions would be ideal.") — souls still persist as fading ghosts (DEAD=0.5, ALPHA=soul×0.5, MASS=soul×0.1, SOUL ×=0.999/tick, removed <0.001), and ghosts now **influence the living** (matching the HELP_DB's "still exert forces on the living", which was never wired): a soft soul-pull draws nearby living particles toward the ghost (80-unit range), and **same-species kin receive a conserved sliver of its soul** before it dissipates (gift = soul×0.002×synergy×dt, both clamped — same transfer semantics as SOUL_LAW). | ✅ |
| PREDATION | **Keep jitter flee + match docs** (user: "4. Wym flee using jitter? Yeah do that. Always match the docs or help db.") — prey flee with jitter-based repulsion stays (JITTER DNA = erratic random motion, so high-jitter prey dart away hard). Added the docs' ecosystem rule: **a predator never hunts its own kind** (cross-species only, matching TRACK), and trait sampling switched from `Math.random()` to the sim PRNG. | ✅ |

## Implementation (v4.6.17)

- **CLAIRVOYANCE** — `applyClairvoyance(..., synergy, dt)` new signature: energy drain on the seer when a prediction force is applied. Solver passes `localTimeStep`.
- **PRECOGNITION** — `applyPrecognition(..., synergy, dt)` new signature: energy drain on the dodger when avoidance is applied (still gated by dist 1–50 and dot < 0).
- **ASTRAL** — per-ghost fade unchanged; new exported `applyAstralInfluence(ghostBase, livingBase, dx, dy, dz, dist, synergy, dt)` (soul-pull + conserved same-species gift). The solver's Phase 2b soul pass now queries the spatial grid for living neighbors within 80 units and applies the influence — bounded by `MAX_INTERACTIONS`, no O(n²) scan.
- **PREDATION** — `applyPredation(..., prng)` new signature + cross-species gate (same species → zero force, no absorption); DNA trait sampling uses the passed PRNG instead of `Math.random()`.
- Tests: `batch_13.test.js` rewritten to the confirmed specs (6 cases); `params_batch_15.test.js` PREDATION_BIAS case updated to a cross-species pair (predation is cross-species only). Full suite 572/572 green; `npx vite build` clean.
- HELP_DB entries updated for CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. slight cost 2. ditto 3. keep + expand (pull + kin blessing) 4. jitter flee + always match docs (cross-species, PRNG)
- [x] Implementation + tests (572/572)
- [x] Deployed to https://vepa-v4.vercel.app
