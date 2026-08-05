# Batch 04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE

Laws under audit (indices 12-15). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| SENESCENCE | **Dependent on LIFE being on** — confirmed. Age-based death stays nested inside the LIFE cycle: past AGE 500, per-tick death chance = DEATH_RATE × 0.001 × (1 + ageNorm × 0.5) × dt. Standalone SENESCENCE does nothing (verified by gate test). | ✅ |
| ENERGY | **"What energy?" → all of them.** The ENERGY law conducts every energy reservoir pairwise toward equilibrium: LIFE energy (ENERGY), ELECTRIC_ENERGY and STORED_ENERGY each transfer independently. SIGNAL (transmission strength) and REPRO_DRIVE (drive meter) are not energy reservoirs and stay untouched. | ✅ |
| RADIATION | **Yes** to RADIATION_LEVEL slider scaling, **plus a slow exposure ramp**: particles accumulate RADIATION_EXPOSURE (level × dt × 0.01, cap 100) that compounds damage over time, and the dose increases mutation chance **more and more over time slowly**. | ✅ |
| GENOTYPE | **Expanded — DNA and genetics are a major part.** Base drift now modulated by the genetics params: REPRESSOR damps, HETEROZYGOSITY widens variance, EPIGENETIC_DRIFT adds non-heritable noise, GENE_FLOW pulls foreign genes, RADIATION exposure ramps the rate, and rare mutations write back into the species genome (64×64 DNA buffer) for species-level evolution. | ✅ |

## Implementation (v4.6.5)

- **GLOW correction (retroactive to batch 03):** `applyGlowEffect` is now emission-only — the oscillator raises SIGNAL but never converts signal into life energy (batch 03 shipped the regen; this removes it).
- **SENESCENCE:** unchanged (already nested in LIFE); added explicit gate test.
- **ENERGY:** `applyEnergyTransfer` now loops `ENERGY_CHANNELS = [ENERGY, ELECTRIC_ENERGY, STORED_ENERGY]`, each conserving independently; SIGNAL/REPRO_DRIVE untouched.
- **RADIATION:** `applyRadiationDamage(lawState, view, base, dt, synergy, prng)` — slider scaling, RADIATION_EXPOSURE accumulation (cap 100), compounding damage `(1−ARMOR)×0.02×level×(1+exposure×0.02)`, radiation death at energy ≤ 0, mutation ramp `exposure×0.001×dt×synergy`. Removed the duplicate in-LIFE radiation drain (double-drain bug).
- **GENOTYPE:** `applyGenotypeMutation(..., prng, dnaBuffer)` — repressor damping, exposure ramp, heterozygosity variance, epigenetic drift, gene flow, species-genome writeback (`CROSSOVER_RATE×0.0002×dt`); helper `readSpeciesDNAParam`/`writeSpeciesDNAParam` added and REPRO refactored onto them.
- New stride field `RADIATION_EXPOSURE: 80` (`STRIDE_INDEXES`), initialized at spawn in `main.js` + `multiplex.js`, exposed in `particleBuffer.js`.
- Solver call sites updated (`applyGenotypeMutation` + `applyRadiationDamage` get `prng`/`dnaBuffer`).
- Tests: `tests/audit/batch_04.test.js` rewritten (15 tests: multi-channel conduction, exposure ramp, level scaling, radiation death, mutation ramps, genome writeback) + batch_03 GLOW test corrected (emission-only). Full suite 521/521 green; `vite build` clean.
- HELP_DB entries updated for GLOW / SENESCENCE / ENERGY / RADIATION / GENOTYPE in `v4/src/constants.js`.

## Verification

- [x] User confirmation → laws confirmed (4 amendments + GLOW backport)
- [x] Implementation + tests (521/521)
- [x] Deployed to https://vepa-v4.vercel.app
