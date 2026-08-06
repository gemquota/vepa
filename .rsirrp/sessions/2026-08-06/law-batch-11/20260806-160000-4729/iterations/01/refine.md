# Batch 11 — REDUCTION / ALLOY / MELT / BOIL

Laws under audit (indices 40-43). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| REDUCTION | **Real-life behavior** (user: "try replicate irl behavior") — opposite charges attract and cancel when they interact: each magnitude shrinks toward zero (5%/tick). Same-sign charges repel, so nothing is neutralized. (The old code equalized toward the pair mean like a conductor — that is conduction, not chemical reduction.) | ✅ |
| ALLOY | **Real-life behavior** (user asked "how would this behave irl?" → answered: two metals dissolve into one homogeneous composite) — full mass merge (m1+m2), mass-weighted DNA average written into the survivor's cache (hybrid composition), colours blended. The survivor keeps its species slot but behaves as the mix. (Replaces the old 10% transfer that never mixed DNA.) | ✅ (agent decision on species slot) |
| MELT | **Follow HELP_DB** — melting is a loss of rigidity, not mass: above temp 0.7 effective STIFFNESS decays toward a 20% floor of the species baseline; below 0.7 the particle re-solidifies and stiffness recovers. Reversible phase change, mass untouched. | ✅ |
| BOIL | **Yes** — vaporizing mass now costs latent heat (ENERGY −= ejectMass×20), uses the SplitMix32 PRNG for the velocity kick (was `Math.random()`), and has a 0.02 mass floor so particles never boil away completely. | ✅ |

## Implementation (v4.6.15)

- **REDUCTION** — `applyReduction` now cancels opposite-sign pairs toward 0 (`CHARGE −= CHARGE×0.05×synergy`, snaps to 0 when the step exceeds the magnitude); same-sign pairs untouched.
- **ALLOY** — `applyAlloy` full merge: `MASS = m1+m2`, all 42 DNA-cache params mass-weighted averaged, RGB blended, j marked DEAD. The solver's existing in-place mass writeback fold preserves the merge.
- **MELT** — `applyMelt(lawState, view, base, dt, synergy, dnaBuffer)` reads the species STIFFNESS baseline via `getDNAFloat`; hot → cache stiffness decays toward 20% floor; cool → recovers at 0.005×dt×synergy. Wired into the solver with `dnaBuffer`.
- **BOIL** — `applyBoil(..., prng)` — PRNG velocity kick, `ENERGY −= ejectMass×20`, `MASS = max(0.02, mass − ejectMass)`. Wired into the solver with the shared `prng`.
- **Multiplexer** — new live settings (all visible in the right drawer during multiplexing): VARIATION slider, RANDOMIZE (LAWS/DNA/POP) checkboxes, DERIVE (CLONE/SPAWN), GRID (C×R, applies immediately), AUTO-ITERATE + EVERY interval slider, AUTO-SELECT FITTEST. New engine behaviour: `autoIterate` regenerates shards every `autoIterateInterval` ticks; `selectFittestShard` selects the shard with the most living particles.
- Tests: `batch_11.test.js` rewritten to the confirmed specs (8 cases), `multiplex.test.js` +4 (new defaults, auto-iterate cadence, fittest selection, auto-select after iteration). Full suite 565/565 green; `vite build` clean.
- HELP_DB entries updated for REDUCTION / ALLOY / MELT / BOIL in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. real-life reduction 2. real-life alloying (explained) 3. follow HELP_DB (MELT) 4. yes (BOIL)
- [x] Implementation + tests (565/565)
- [x] Deployed to https://vepa-v4.vercel.app
