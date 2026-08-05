# VEPA v4 — Parameter Audit Spec (72 params)

> Every slider/parameter in the app is audited exactly like the law audit:
> one focused test + one gate test per param, conclusive validation, repair
> loop (≤3 attempts), status recorded in `batch_XX.md`, results combined.
>
> **Scope:** 22 world panel sliders · 8 settings/camera sliders · 42 DNA params
> = **72 params** → 18 batches × 4.
>
> **Baseline (already implemented before this audit):** the 22 world sliders
> now flow through `src/state/worldParams.js` (SSOT) → `runtimeConfig.worldParams`
> → `solver.js` / `laws.js` / `src/spawn/distribution.js`. Defaults were set to
> neutral values so the default simulation behaves exactly as before.

## How to validate

- **World physics/environment params** → `solve()` integration tests: set
  `runtimeConfig.worldParams.<KEY> = X`, run N ticks, assert the effect; then
  a gate test with the neutral value asserting no effect.
- **World spawn params** (WORLD_SIZE, GROUND_HEIGHT, PARTICLE_COUNT,
  INITIAL_POP, MAX_POP, SHAPE, SPAWN_CENTRES, SPAWN_CENTRE_RANDOM,
  SPAWN_CENTRE_BIAS) → `src/spawn/distribution.js` + `spawnCaps()` unit tests
  (pure functions).
- **Settings meta** (visualScale, globalAlpha, starMass, simSpeed) →
  `runtimeConfig` value + solver/renderer consumption checks.
- **Camera** (focalLength, ortho, rotateSensitivity, panSensitivity) →
  `src/ui/camera.js` (pure) — `setCameraConfig` + projection math.
- **DNA params** → `src/dna/dnaBuffer.js` set/get round-trip + solver
  consumption through the particle DNA cache (`STRIDE_INDEXES.DNA_CACHE_START`).

Shared helper: `v4/tests/audit/paramsHelpers.js` (`makeWorld`, `withWorldParam`,
`resetWorldParams`). Test files: `v4/tests/audit/params_batch_XX.test.js`.

## World panel (22) — defaults are neutral; status is post-baseline

| # | Key | Range / default | Expected behavior | Status |
|---|-----|------------------|-------------------|--------|
| 1 | WORLD_SIZE | 50–20000 / 2000 | World bounds; wrapping/clamping + spawns follow it | ✅ wired |
| 2 | GROUND_HEIGHT | 0–1 / 0.9 | Spawn z band = [0, worldSize·h]; h=1 → full volume | ✅ wired |
| 3 | PARTICLE_COUNT | 100–20000 / 1000 | Hard cap on live particles (min(MAX_PARTICLES)) | ✅ wired |
| 4 | INITIAL_POP | 10–5000 / 250 | Total initial population, split across species | ✅ wired |
| 5 | MAX_POP | 100–50000 / 5000 | Soft cap: regular spawn feed stops at it | ✅ wired |
| 6 | SHAPE | 0–1 / 0 | Spawn shape: 0=even grid, 1=fully random | ✅ wired |
| 7 | SPAWN_CENTRES | 1–64 / 1 | Number of cluster centres | ✅ wired |
| 8 | SPAWN_CENTRE_RANDOM | 0–1 / 0.5 | Centre placement: 0=grid, 1=random | ✅ wired |
| 9 | SPAWN_CENTRE_BIAS | 0–1 / 0 | Pull spawns toward centres (1=pinned) | ✅ wired |
| 10 | GLOBAL_G | 0–20 / 1 | Gravity multiplier (solver `effG = G·GLOBAL_G`) | ✅ wired |
| 11 | WIND | 0–5 / 0 | Constant +X drift: `vx += WIND·0.5·dt` per tick | ✅ wired |
| 12 | DAMPING | 0–100 / 0 | Global velocity decay: factor `(1−D/100)^dt` | ✅ wired |
| 13 | VISCOSITY | 0.5–1 / 1 | Multiplies DNA viscosity in DRAG drag factor | ✅ wired |
| 14 | ENTROPY | 0–2 / 1 | Multiplies ENTR jitter amplitude | ✅ wired |
| 15 | HEAT_CAPACITY | 0.1–10 / 1 | Divides HEAT/COLD transfer rate (higher = slower) | ✅ wired |
| 16 | LIGHT_LEVEL | 0–2 / 0.5 | LIFE photosynthesis: `+0.02·LIGHT·dt` energy | ✅ wired |
| 17 | RADIATION_LEVEL | 0–5 / 1 | Multiplies RADIATION law damage | ✅ wired |
| 18 | SPAWN_RATE | 0–100 / 5 | Regular spawn feed particles per second | ✅ wired |
| 19 | SPECIES_INTERACTION | −2–2 / 1 | Multiplies AFFINITY forces (neg = repel bias) | ✅ wired |
| 20 | ENERGY_TRANSFER | 0–2 / 1 | Multiplies ENERGY conduction rate | ✅ wired |
| 21 | MUTATION_RATE | 0–5 / 1 | Multiplies REPRO offspring DNA mutation | ✅ wired |
| 22 | DECAY_RATE | 0–2 / 1 | Multiplies LIFE metabolic decay | ✅ wired |

## Settings / camera (8)

| # | Key | Range / default | Expected behavior | Status |
|---|-----|------------------|-------------------|--------|
| 23 | visualScale | 0.1–5 / 1 | Renderer particle-size multiplier | ✅ wired |
| 24 | globalAlpha | 0.1–1 / 1 | Renderer opacity multiplier | ✅ wired |
| 25 | starMass | 4–100 / 12 | Collapse threshold (solver + renderer) | ✅ wired |
| 26 | simSpeed | 0.1–10 / 1 | Physics time-step multiplier | ✅ wired |
| 27 | focalLength | 400–4000 / 1200 | Camera projection distance | ✅ wired |
| 28 | ortho | 0–1 / 0 | Perspective→orthographic blend | ✅ wired |
| 29 | rotateSensitivity | 0.1–5 / 1 | Orbit gesture multiplier | ✅ wired |
| 30 | panSensitivity | 0.1–5 / 1 | Pan gesture multiplier | ✅ wired |

## DNA params (42) — status is "to validate"; some may be decorative

| # | DNA key (idx) | Range | Mechanic to validate |
|---|---------------|-------|----------------------|
| 31 | FORCE (0) | −2–2 | Attraction/repulsion strength |
| 32 | VISCOSITY (1) | 0.5–1 | Per-particle drag factor |
| 33 | TORQUE (2) | 0–1 | Rotational momentum (visual or force) |
| 34 | JITTER (3) | 0–1 | Entropy jitter amplitude (ENTR law) |
| 35 | TIDAL (15) | 0–1 | Differential structural forces |
| 36 | INERTIA (26) | 0–2 | Acceleration resistance |
| 37 | FRICTION (27) | 0–1 | Velocity-dependent drag (DRAG law) |
| 38 | MAX_VELOCITY (28) | 1–10 | Terminal speed clamp |
| 39 | SYMMETRY (6) | 0–1 | Interaction shape distortion |
| 40 | HIDDEN_MASS (7) | 0–5 | Invisible mass multiplier |
| 41 | STIFFNESS (8) | 0–1 | Structural rigidity |
| 42 | FUSION (9) | 0–1 | Mass-merging efficiency |
| 43 | FUSION_MOMENTUM (16) | 0–5 | Min collision strength for merging |
| 44 | FUSION_TIME (17) | 0–1 | Temporal gating to growth |
| 45 | BASE_RADIUS (29) | 0.2–5 | Starting size |
| 46 | ELASTICITY (30) | 0–1 | Collision bounciness |
| 47 | BOND_ANGLE (31) | 0–1 | Favored cluster geometry |
| 48 | POLARITY (4) | −1–1 | Charge (CHARGE_LAW) |
| 49 | ALPHA (5) | 0–1 | Visual density / alpha |
| 50 | CONDUCTIVITY (32) | 0–1 | Charge/energy transfer rate |
| 51 | MAGNETIC_MOMENT (33) | 0–1 | Neighbor charge alignment |
| 52 | REACTION_THRESHOLD (37) | 0–1 | Mass limit for phase change |
| 53 | CATALYSIS (38) | 0–2 | Reaction speed multiplier |
| 54 | HEAT_OUTPUT (39) | 0–1 | Interaction energy byproduct |
| 55 | BIRTH_RATE (10) | 0–1 | Spontaneous reproduction chance |
| 56 | DEATH_RATE (11) | 0–1 | Spontaneous decay chance |
| 57 | MUTATION (12) | 0–1 | Offspring DNA randomness |
| 58 | ENERGY_EFFICIENCY (34) | 0–1 | Metabolic energy conversion |
| 59 | SEX_CHANCE (35) | 0–1 | Multi-parent reproduction probability |
| 60 | PREDATION_BIAS (36) | 0–1 | Attraction to lower-mass species |
| 61 | SPECIES_AFFINITY (41) | −2–2 | Same/different species bias |
| 62 | SIGNAL_RESP (13) | 0–2 | Neighbor pulse sensitivity |
| 63 | PULSE_RATE (14) | 0–2 | Oscillator frequency |
| 64 | NEIGHBORHOOD_RADIUS (18) | 0–2 | Range of influence |
| 65 | SIGNAL_STRENGTH (19) | 0–2 | Communication intensity |
| 66 | SIGNAL_DECAY (20) | 0–1 | Signal persistence |
| 67 | PROPAGATION_SPEED (21) | 0–1 | Signal travel speed |
| 68 | TUNING_CH1 (22) | 0–1 | Receptor filter channel 1 |
| 69 | TUNING_CH2 (23) | 0–1 | Receptor filter channel 2 |
| 70 | TUNING_CH3 (24) | 0–1 | Receptor filter channel 3 |
| 71 | TUNING_CH4 (25) | 0–1 | Receptor filter channel 4 |
| 72 | MEMORY_DECAY (40) | 0–1 | Internal state persistence |

## Repair rules

- Up to **3 attempts** per param; if still broken → mark **FAULTY** with evidence.
- Prefer fixing the underlying wiring (solver/laws/distribution/camera), not
  weakening tests. Adjust an existing test's expectations only when the spec
  legitimately changed (e.g., LIFE decay now requires `LIGHT_LEVEL = 0` to
  isolate metabolism — see `tests/audit/batch_02.test.js`).
- Never change `worldParams.js` defaults — they are the neutral baseline.
