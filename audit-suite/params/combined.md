# VEPA Parameter Audit — Combined Results (72 params)

**Audit run:** 2026-08-05 · 18 batches × 4 params (world 22 · settings/camera 8 · DNA 42) · conclusive validation with repair loop (≤3 attempts per param).

| Metric | Count |
|--------|-------|
| ✅ PASS | 63 |
| ⚠️ REPAIRED | 9 |
| ❌ FAULTY | 0 |
| **Total params** | **72** |

## Batch summary

| Batch | PASS | REPAIRED | FAULTY |
|-------|------|----------|--------|
| [01 — WORLD_SIZE / GROUND_HEIGHT / PARTICLE_COUNT / INITIAL_POP](batch_01.md) | 4 | 0 | 0 |
| [02 — MAX_POP / SHAPE / SPAWN_CENTRES / SPAWN_CENTRE_RANDOM](batch_02.md) | 4 | 0 | 0 |
| [03 — SPAWN_CENTRE_BIAS / GLOBAL_G / WIND / DAMPING](batch_03.md) | 4 | 0 | 0 |
| [04 — VISCOSITY / ENTROPY / HEAT_CAPACITY / LIGHT_LEVEL](batch_04.md) | 4 | 0 | 0 |
| [05 — RADIATION_LEVEL / SPAWN_RATE / SPECIES_INTERACTION / ENERGY_TRANSFER](batch_05.md) | 4 | 0 | 0 |
| [06 — MUTATION_RATE / DECAY_RATE / visualScale / globalAlpha](batch_06.md) | 4 | 0 | 0 |
| [07 — starMass / simSpeed / focalLength / ortho](batch_07.md) | 4 | 0 | 0 |
| [08 — rotateSensitivity / panSensitivity / DNA.FORCE / DNA.VISCOSITY](batch_08.md) | 3 | 1 | 0 |
| [09 — DNA.TORQUE / DNA.JITTER / DNA.TIDAL / DNA.INERTIA](batch_09.md) | 2 | 2 | 0 |
| [10 — DNA.FRICTION / DNA.MAX_VELOCITY / DNA.SYMMETRY / DNA.HIDDEN_MASS](batch_10.md) | 4 | 0 | 0 |
| [11 — DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME](batch_11.md) | 2 | 2 | 0 |
| [12 — DNA.BASE_RADIUS / DNA.ELASTICITY / DNA.BOND_ANGLE / DNA.POLARITY](batch_12.md) | 3 | 1 | 0 |
| [13 — DNA.ALPHA / DNA.CONDUCTIVITY / DNA.MAGNETIC_MOMENT / DNA.REACTION_THRESHOLD](batch_13.md) | 3 | 1 | 0 |
| [14 — DNA.CATALYSIS / DNA.HEAT_OUTPUT / DNA.BIRTH_RATE / DNA.DEATH_RATE](batch_14.md) | 3 | 1 | 0 |
| [15 — DNA.MUTATION / DNA.ENERGY_EFFICIENCY / DNA.SEX_CHANCE / DNA.PREDATION_BIAS](batch_15.md) | 3 | 1 | 0 |
| [16 — DNA.SPECIES_AFFINITY / DNA.SIGNAL_RESP / DNA.PULSE_RATE / DNA.NEIGHBORHOOD_RADIUS](batch_16.md) | 4 | 0 | 0 |
| [17 — DNA.SIGNAL_STRENGTH / DNA.SIGNAL_DECAY / DNA.PROPAGATION_SPEED / DNA.TUNING_CH1](batch_17.md) | 4 | 0 | 0 |
| [18 — DNA.TUNING_CH2 / DNA.TUNING_CH3 / DNA.TUNING_CH4 / DNA.MEMORY_DECAY](batch_18.md) | 4 | 0 | 0 |

## Repaired params (9)

| Param | Batch | Repair |
|-------|-------|--------|
| DNA.FORCE (0) | [08](batch_08.md) | Wired into `applyGravity` — ±100 → ±2 attraction/repulsion scale (was dead) |
| DNA.TORQUE (2) | [09](batch_09.md) | Wired into solver integration — velocity rotates around Z by `torque·0.02·dt` (was dead) |
| DNA.TIDAL (15) | [09](batch_09.md) | Wired into `applyGravity` — close-range differential boost `1 + tidal·0.5·(1−dist/100)` (was dead) |
| DNA.FUSION (9) | [11](batch_11.md) | Wired into ACCR — mass-transfer efficiency multiplier `0.5 + FUSION` (was dead) |
| DNA.FUSION_TIME (17) | [11](batch_11.md) | Wired into ACCR — maturity gate `AGE ≥ FUSION_TIME·50` (was dead) |
| DNA.BOND_ANGLE (31) | [12](batch_12.md) | Wired into BOND — equilibrium distance scale `1 + min(1, |angle|/120)` (was dead) |
| DNA.REACTION_THRESHOLD (37) | [13](batch_13.md) | Wired into AUTOCATALYSIS — mass gate (was dead) |
| DNA.HEAT_OUTPUT (39) | [14](batch_14.md) | Wired into `applyOxidationEffect` — charged oxidation releases `charge·HEAT_OUTPUT·0.05·dt` energy + temperature (was dead) |
| DNA.SEX_CHANCE (35) | [15](batch_15.md) | Wired into REPRO — crossover/second-parent probability `×(1 + SEX_CHANCE·0.5)` (was dead) |

## Method

1. Every param gets one focused solver/expression/state test + one gate test (neutral value = no effect).
2. Deterministic PRNGs (`lcg`/fixed sequences) — never `Math.random()` in the param suite.
3. Dead params are repaired in code (≤3 attempts), re-tested, then the manifest status is set.
4. World sliders flow through `src/state/worldParams.js` (SSOT) → `runtimeConfig.worldParams` → solver/laws/spawn; camera sliders through `src/ui/camera.js`; DNA params through the particle DNA cache (`STRIDE_INDEXES.DNA_CACHE_START`).
5. Full suite green: `cd v4 && npx vitest run` → 65 files / 503 tests.

## Key fixes beyond the repaired params

- 22 world sliders now all wired (previously 16 were `console.log` no-ops) via `worldParams.js` SSOT + `applyWorldParam`.
- `resetCamera()` restores focalLength/ortho/rotateSensitivity/panSensitivity (was partially reset).
- Renderer `depthAlpha` now multiplies by `runtimeConfig.globalAlpha` (was ignored).
- World params default to neutral values — the default simulation behaves exactly as before.
