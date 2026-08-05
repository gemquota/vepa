# Batch 03 — GLOW / AFFINITY / REPRO / TRACK

Laws under audit (indices 8-11). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| GLOW | **Does both**: an oscillator (PULSE_RATE × SIGNAL_STRENGTH DNA) emits signal pulses into SIGNAL (transmission strength) AND existing signal converts into life energy (ENERGY). Life energy is a **separate channel** from signal energy — the multi-energy architecture (batch 03) adds ELECTRIC_ENERGY / STORED_ENERGY / REPRO_DRIVE stride fields so metabolism, electricity, storage, signal, and drive never collide in one pool. | ✅ |
| AFFINITY | **Boosts attraction to the same species**: same-species pull scales with positive SPECIES_AFFINITY, inert at 0, none for xenophobic (negative). Different-species repel only when SPECIES_AFFINITY < 0. | ✅ |
| REPRO | **Gated on REPRODUCTIVE DRIVE, not raw energy**: REPRO_DRIVE (stride 79) accumulates from BIRTH_RATE over time (cap 100); drive ≥ 60 + AGE ≥ 100 → per-tick chance BIRTH_RATE×0.01×synergy to spawn. Spawning consumes the drive and half the parent's life energy. | ✅ |
| TRACK | **Prey must be a different species**: PREDATION_BIAS ≥ 0.1 chases a lower-mass (mass < 0.8×) neighbour, but only across species — predators never hunt their own kind. | ✅ |

## Implementation (v4.6.4)

- Multi-energy stride block (77-79): `ELECTRIC_ENERGY`, `STORED_ENERGY`, `REPRO_DRIVE` added to `STRIDE_INDEXES`; initialized at spawn in `main.js` + `multiplex.js`; exposed via `particleBuffer.js` get/set.
- `applyGlowEffect` — added PULSE_RATE/SIGNAL_STRENGTH oscillator emission + kept signal→energy regen.
- `applyAffinity` — same-species strength = 0.1×max(0, affinity) (fixes the old `Math.abs` bug where xenophobic species attracted their own kind).
- `applyReproduction` — drive accumulation + gate (replaces the energy ≥ 60 gate); drive consumed on spawn.
- `applyTrackingBehavior` — cross-species gate added.
- Tests: `tests/audit/batch_03.test.js` (13) + REPRO/AFFINITY param tests updated (params_batch_06/14/15/16). Full suite 515/515 green; `vite build` clean.
- HELP_DB entries updated for GLOW / AFFINITY / REPRO / TRACK in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (4 amendments applied)
- [x] Implementation + tests (515/515)
- [x] Deployed to https://vepa-v4.vercel.app
