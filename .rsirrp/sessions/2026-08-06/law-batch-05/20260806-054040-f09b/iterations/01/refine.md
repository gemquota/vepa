# Batch 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY

Laws under audit (indices 16-19). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| PHENOTYPE | **Gene expression**: genotype (DNA cache) → visible phenotype. POLARITY → hue, ALPHA → saturation, SYMMETRY → lightness translated into particle colour every tick; ENERGY is the environment — well-fed particles (energy > 100) grow, starving ones shrink ("energy-driven size" = nutrition affecting body size, like real organisms). Offspring inherit DNA → inherit the look. | ✅ |
| CATALYSIS_LAW | **Yes, chemistry multiplier, and free**: chemMult = 1 + CATALYSIS×0.5×synergy, applied to the pre-chemistry forces in the pair loop; never touches energy. | ✅ |
| SOLVATION | **Replicate real-world behavior**: like dissolving salt in water — the solvent exerts charge forces (opposite charges attract, like charges repel, Coulomb-style |q1×q2|) AND charge-different particles react faster. The force was previously dead code; now wired into the solver pair loop. | ✅ |
| ACIDITY | **Documented behavior** (user: "Documented."): particles exchange CHARGE when close, equalizing electrical potential; CONDUCTIVITY DNA controls the transfer rate and the CHARGE field is altered. Replaces the old ENERGY erosion. | ✅ |

## Implementation (v4.6.6)

- **PHENOTYPE** — `applyPhenotype` now writes COLOR_R/G/B from HSL(POLARITY→hue 0-240, ALPHA→saturation, SYMMETRY→lightness) in addition to the energy-modulated radius; `hslToRgb` helper added.
- **CATALYSIS_LAW** — unchanged behaviour (confirmed); locked with a free-cost test (energy untouched over 50 ticks).
- **SOLVATION** — `applySolvation` upgraded: magnitude from the charge product (|q1×q2|, so equal like charges actually repel), sign = attract for opposite signs / repel for like signs, scaled by synergy; dispatched in the solver pair loop alongside the reaction-rate multiplier.
- **ACIDITY** — `applyAcidityEffect` rewritten to documented behaviour: charge flows from the higher-charge particle to the lower at `Δcharge × max(CONDUCTIVITY_i,j) × 0.1 × dt × synergy` when |Δcharge| ≥ 0.3; charge conserved per pair; ENERGY untouched.
- Tests: `tests/audit/batch_05.test.js` rewritten (23 tests: phenotype colour expression, catalysis free + affinity amplification, solvation attract/repel/gate, acidity equalization/gate/conservation). Fixed a flaky catalysis test whose premise was wrong (chemMult runs before the CHARGE_LAW block — now asserts the real amplification target, AFFINITY). Full suite 533/533 green; `vite build` clean.
- HELP_DB entries updated for PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (phenotype explained, cata free, solvation real-world, acidity documented)
- [x] Implementation + tests (533/533)
- [x] Deployed to https://vepa-v4.vercel.app
