# Batch 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY

Laws under audit (indices 20-23). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| OXIDATION | **Yes** — real oxidation is electron loss: CHARGE decays toward 0 (electrical rust) alongside the existing MASS erosion, and HEAT_OUTPUT DNA releases heat + a glow flash (brightens COLOR_R/G/B + ALPHA while burning). | ✅ |
| POLYMER | **Match documentation** — up to 6 bonds per particle (BOND_PARTNER_1..6), tracked mutually so A-B-C chains are stable on both ends. | ✅ |
| ISOMERIZATION | **Match real life** — real isomerization keeps the same atoms but rearranges bonds: a 3+ bond particle occasionally breaks one connection (the freed partner becomes a fragment, reciprocal cleared) and consumes a little energy. The old "radius breathing" placeholder (sinusoidal RADIUS oscillation) is gone. | ✅ |
| CHIRALITY | **TORQUE DNA drives handedness (documented)** — geometric mirror-handedness (clockwise/counter-clockwise spin), not charge. Same-handedness pairs deflect perpendicular, direction follows the torque sign; opposite-handedness/zero-torque → no force. | ✅ |

## Implementation (v4.6.7)

- **OXIDATION** — `applyOxidationEffect` now decays CHARGE toward 0 (`c − c×0.001×dt×synergy`) and, when HEAT_OUTPUT DNA > 0, flashes COLOR_R/G/B toward white + raises ALPHA alongside the energy/temperature release.
- **POLYMER** — stride expanded with `BOND_PARTNER_3..6` (81-84, appended at the tail so existing offsets stay stable); spawn init in `main.js` (3 sites) + `multiplex.js`; exposed in `particleBuffer.js`. `applyPolymer` now uses all 6 slots (module `BOND_SLOTS` list), bonds are mutual (j records i back), indices computed from the real `stride` (was hardcoded `/100`), cap at 6 per particle.
- **ISOMERIZATION** — `applyIsomerization(lawState, view, base, dt, synergy, prng, stride)` rewritten: 3+ bonds + energy ≥ 1 → chance 0.02×dt×synergy to break the first filled bond, clear the partner's reciprocal slot, decrement both counts, and consume 0.5×dt×synergy ENERGY. Removed the old radius-phase block from the solver's radius recompute.
- **CHIRALITY** — `applyChirality` reads TORQUE DNA (cache index 2) instead of POLARITY; deflection direction follows sign(TORQUE) (mirror-image rotation).
- Tests: `tests/audit/batch_06.test.js` rewritten (21 tests: rust + glow, mutual 6-slot bonds + cap, isomerization rearrangement/reciprocal/energy/gate, chirality torque handedness incl. mirror direction). Full suite 538/538 green; `vite build` clean.
- HELP_DB entries updated for OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (yes / match documentation / match real life / TORQUE explained)
- [x] Implementation + tests (538/538)
- [x] Deployed to https://vepa-v4.vercel.app
