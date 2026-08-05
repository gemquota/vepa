# Batch 26 — EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY

Laws under audit (indices 100-103):

- **EXPANSION** (index 100, thermodynamics / ORANGE)
- **EQUILIBRIUM** (index 101, thermodynamics / ORANGE)
- **LATENT_HEAT** (index 102, thermodynamics / ORANGE)
- **RUNAWAY** (index 103, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| EXPANSION | ⚠️ REPAIRED (1 attempt) | `EXPANSION direct` — cold (temp 0.1) particle, base RADIUS DNA 1.2, k=0.1 → radius 0.6 → 0.66, temp → 0.09; temp ≥ 0.3 → no-op. `integration` — mass 0.3 particle grows radius 0.803 → 0.843 (> 0.81) and cools with law on; frozen at 0.6 with law off. |
| EQUILIBRIUM | ✅ PASS | `EQUILIBRIUM direct` — temps 0.2/0.8, k=0.5 → both 0.5 (total conserved). `integration` — solver k=0.3×2 passes: gap shrinks 0.6 → < 0.2, both move toward mean; frozen with law off. |
| LATENT_HEAT | ✅ PASS | `LATENT_HEAT direct` — hot (temp 2.0, k=0.5) → temp 1.5, ENERGY 100.5; cold (temp −1.0, k=0.2) → temp −0.9, ENERGY 99.9. `integration` — temp 2.0 → temp < 2 and ENERGY > 100 with law on; 2.0/100 with law off. |
| RUNAWAY | ✅ PASS | `RUNAWAY direct` — temp 1.5, k=2 → +0.98 (quadratic excess²); temp 0.5 → unchanged. `integration` — temp 1.5 → temp > 1.5 with law on; 1.5 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyExpansion`/`applyEquilibrium`/`applyLatentHeat`/`applyRunaway` from `v4/src/physics/lawgroups/thermoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_26.test.js` (8 tests, all pass).
- Repair 1 (EXPANSION, 1 attempt): integration showed EXPANSION's RADIUS growth was dead in solve() — the unconditional per-tick "update radius from mass" (`view[iBase+RADIUS] = baseRadius * mass^(1/3)`) ran after EXPANSION's per-particle dispatch and overwrote it (only the tiny cooling survived). Fix in `v4/src/physics/solver.js`: moved the `applyExpansion` dispatch from the per-particle accumulation block to the post-integration section immediately after the mass-derived radius update, so growth toward the DNA base radius persists. Verified the on-vs-off radius delta (0.843 vs 0.803) before/after the move.
