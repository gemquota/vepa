# Batch 02 — COLL / ACCR / PLANETARY / LIFE

Laws under audit (indices 4-7). Status: 🗣 awaiting user confirmation.

## Proposed behavior

| Law | Proposed spec (current v4 behavior) | Status |
|-----|--------------------------------------|--------|
| COLL | Impulse bounce on overlap when the pair is closing (`relVelN > 0`): mass-weighted velocity exchange, bounciness from `ELASTICITY` DNA, softbody push separates overlapping bodies. Shared overlap block runs when COLL **or** ACCR is on. Off = pass-through. | 🗣 |
| ACCR | Mass transfer on overlap: bigger body absorbs smaller (or mutual dissolution when similar size), efficiency ×(0.5 + `FUSION` DNA); gates — relative approach speed < `FUSION_MOMENTUM`×2 and `AGE ≥ FUSION_TIME`×50; stars (`mass > starMass`) collapse-pull; runs standalone without COLL. Off = no mass exchange. | 🗣 |
| PLANETARY | Constant weak pull toward the world centre (`strength 0.001×synergy`, not inverse-square); ×1.5 with GRAV. Off = no central well. | 🗣 |
| LIFE | Metabolic energy decay ∝ (1−`ENERGY_EFFICIENCY`) × DECAY_RATE slider; photosynthesis +0.02×LIGHT_LEVEL; hunger +0.02/tick, HUNGER>100 → dead; bio-rhythm energy pulse; mass fluctuation only when ACCR is also on. Senescence is a **separate law** (SENESCENCE), not part of LIFE. | 🗣 |

## Open confirmation points

1. **LIFE energy = 0** — HELP_DB says "when energy hits 0, they die", but in v4 energy clamps to 0 and the particle stays alive (only HUNGER>100 or the SENESCENCE/ RADIATION laws kill). Should energy=0 set DEAD=1 under LIFE?
2. **ACCR gates** — confirm the repaired semantics: `FUSION_MOMENTUM` = max approach speed for merging, `FUSION_TIME` = maturity age gate (×50). OK as-is?
3. **PLANETARY constant pull** — confirm the central well should be a constant gentle pull (not inverse-square, so it reaches across the whole world).
4. **COLL/ACCR shared block** — confirm COLL's bounce also runs when only ACCR is on (so overlapping matter still gets pushed apart while merging).

## Status

- [ ] User confirmation → laws ✅ confirmed (or ⚠️ amended)
