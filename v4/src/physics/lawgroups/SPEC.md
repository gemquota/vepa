# VEPA 8x16 Expansion — Law Implementation Spec

Add the 46 new laws (indices 82-127) to VEPA v4 as **stateless functions** in
`v4/src/physics/lawgroups/*.js`. The solver calls them; they must not depend on
any module-level mutable state.

## Context (from `src/constants.js`)

- `PARTICLE_STRIDE = 100`; buffer is a `Float32Array` view.
- Particle base pointer = `index * PARTICLE_STRIDE`; e.g. `view[iBase + S.POS_X]`.
- `S = STRIDE_INDEXES`: POS_X 0, POS_Y 1, POS_Z 2, VEL_X 3, VEL_Y 4, VEL_Z 5,
  MASS 6, SPECIES_ID 7, DNA_CACHE_START 8 (42 DNA floats, 8..49), ENERGY 50,
  AGE 51, DEAD 52 (0 alive / 1 dead), COLOR_R 53, COLOR_G 54, COLOR_B 55,
  RADIUS 56, SIGNAL 57, BOND_COUNT 58, BOND_PARTNER_1 59, BOND_PARTNER_2 60,
  MEMORY 61, HUNGER 62, ARMOR 63, MITOSIS_TIMER 64, PARTNER_ID 65,
  TEMPERATURE 66, CHARGE 67, PHASE_1 68, PHASE_2 69, SOUL 70, TRAIL_X 71,
  TRAIL_Y 72, TRAIL_Z 73, ALPHA 74, ENTANGLE_ID 75, ENTANGLE_PHASE 76.
- `D = DNA_INDEXES` (cache, values are **normalized floats ~[-1,1] or [0,1]**):
  FORCE 0, VISCOSITY 1, TORQUE 2, JITTER 3, POLARITY 4, ALPHA 5, SYMMETRY 6,
  HIDDEN_MASS 7, STIFFNESS 8, FUSION 9, BIRTH_RATE 10, DEATH_RATE 11,
  MUTATION 12, SIGNAL_RESP 13, PULSE_RATE 14, TIDAL 15, FUSION_MOMENTUM 16,
  FUSION_TIME 17, NEIGHBORHOOD_RADIUS 18, SIGNAL_STRENGTH 19, SIGNAL_DECAY 20,
  PROPAGATION_SPEED 21, TUNING_CH1..CH4 22-25, INERTIA 26, FRICTION 27,
  MAX_VELOCITY 28, BASE_RADIUS 29, ELASTICITY 30, BOND_ANGLE 31,
  CONDUCTIVITY 32, MAGNETIC_MOMENT 33, ENERGY_EFFICIENCY 34, SEX_CHANCE 35,
  PREDATION_BIAS 36, REACTION_THRESHOLD 37, CATALYSIS 38, HEAT_OUTPUT 39,
  MEMORY_DECAY 40, SPECIES_AFFINITY 41.

## Conventions

- File: `v4/src/physics/lawgroups/<group>.js`, ESM, 4-space indent.
- `import { STRIDE_INDEXES as S, DNA_INDEXES as D, PARTICLE_STRIDE } from '../../constants.js';`
- `const dnaOf = (view, ptr, d) => view[ptr + S.DNA_CACHE_START + d];`
- `function nanGuard(v) { return Number.isFinite(v) ? v : 0; }` — clamp all
  outputs; **never write NaN/Infinity** to the buffer.
- Read reference implementations in `v4/src/physics/laws.js` (e.g.
  `applyFriction`, `applySignalDecay`, `applyFieldDrift`, `applySpin`) for tone.
- Pairwise laws: `export function applyX(view, iBase, jBase, dx, dy, dz, dist)`.
  Return `{ ax, ay, az }` for forces (solver adds them), or `null`/`undefined`
  if the law only mutates state. Never mutate during j-loop that would break
  iteration (setting DEAD is fine — the grid was already built).
- Per-particle laws:
  `export function applyX(view, iBase, px, py, pz, vx, vy, vz, worldSize, prng)`.
  Same return contract. `prng()` returns [0,1).
- Keep each law **small but real**: a few lines that visibly change state or
  forces, using the DNA/stride fields above. Magnitudes should be simulation
  stable (forces ≲ 2.0 per call; energy changes ≲ 5 per call).
- Run `node --check <file>` when done. Do NOT edit any other file.

## Law list (46)

### physicsAdd.js — PHYSICS (indices 82-87)
1. `applyTide` (pair): tidal pull on i toward j proportional to j's MASS,
   falling off slowly with distance (longer reach than gravity). Also gently
   aligns velocity — tidal lock.
2. `applyFriction` (pp): velocity-dependent drag; force = -v * k * speed.
3. `applyElasticity` (pp): soft bounce — force opposing velocity, stronger at
   high speed (restoring "spring" that prevents runaway).
4. `applyTurbulence` (pp): perpendicular pseudo-random kick that rotates
   smoothly using prng(); magnitude scales with ENERGY.
5. `applyCentripetal` (pp): force toward world centre
   `(px - cx, py - cy, pz - cz)` scaled by distance (harmonic attractor).
6. `applyRotation` (pp): tangential force around the centre axis — for a point
   (x,y) use velocity-like rotation (dx = -(py-cy), dy = (px-cx)); scale by
   distance from axis.

### biologyAdd.js — BIOLOGY (indices 88-91)
7. `applySymbiosis` (pair): if SPECIES_ID differs, transfer ENERGY from the
   richer partner to the poorer (no force).
8. `applyParasite` (pair): if i smaller than j (MASS), drain energy from j to i
   at ~70% efficiency; skip if j's ENERGY below a floor.
9. `applyHibernation` (pp): if ENERGY < 25, damp velocity strongly and slowly
   regen ENERGY (self-preservation).
10. `applyImmunity` (pp): regen ARMOR toward a cap (e.g. +0.02 per tick, cap
    ~1.0); if HUNGER > 0 reduce it.

### chemistryAdd.js — CHEMISTRY (indices 92-97)
11. `applyElectrolysis` (pair): if |CHARGE_i - CHARGE_j| > 0.3, convert small
    MASS of i to ENERGY + SIGNAL (charge-driven decomposition).
12. `applyPhotolysis` (pair): if combined SIGNAL > 0.5, convert small MASS to
    ENERGY (light breaks matter).
13. `applyPrecipitation` (pair): on contact, both gain MASS and shrink RADIUS
    (condensation); cap mass at 8.
14. `applyNeutralization` (pair): if CHARGE_i * CHARGE_j < 0, reduce both
    charges toward 0 and raise TEMPERATURE of both.
15. `applyStoichiometry` (pair): whenever ENERGY/MASS is exchanged by other
    chemistry, balance the pair — implement as: transfer any ENERGY surplus
    between partners to equalize, conserving total.
16. `applyAutocatalysis` (pair): if SPECIES_ID equal, boost both ENERGY by
    CATALYSIS DNA (self-catalysis).

### thermoLaws.js — THERMODYNAMICS (indices 98-103)
17. `applyAdiabatic` (pair): convert relative kinetic energy (speed of i) into
    TEMPERATURE without loss — add to i's TEMPERATURE, damp i's velocity.
18. `applyCompression` (pair): when dist < rSum (touching), shrink both RADIUS
    slightly and raise TEMPERATURE (pressure squeeze).
19. `applyExpansion` (pp): if BOND_COUNT === 0 and speed low, grow RADIUS
    toward BASE_RADIUS DNA and cool slightly.
20. `applyEquilibrium` (pair): exchange TEMPERATURE toward the pair mean
    (symmetric conduction).
21. `applyLatentHeat` (pair): phase buffer — when TEMPERATURE high, convert
    TEMPERATURE into ENERGY (absorb); when low, convert ENERGY into
    TEMPERATURE (release).
22. `applyRunaway` (pp): if TEMPERATURE > 1.5, add more TEMPERATURE (quadratic
    positive feedback), clamped.

### metaLaws.js — METAPHYSICS (indices 104-106)
23. `applyConsciousness` (pp): slow self-regeneration — regen ENERGY and MEMORY
    scaled by SIGNAL_RESP DNA (self-model).
24. `applyPerception` (pair): extended sensing — if dist < 80 (far beyond
    normal contact), transfer small amounts of SIGNAL and TEMPERATURE between
    the pair (awareness at distance).
25. `applySynchronicity` (pair): if PHASE_1 values are close, pull velocities
    together (resonant alignment) proportional to phase agreement.

### emLaws.js — ELECTROMAGNETISM (indices 107-109)
26. `applyAntenna` (pair): directional emission — if SIGNAL of i > 0.3, add a
    force on j along the i→j axis and boost j's SIGNAL (focused broadcast).
27. `applyShielding` (pp): consume ENERGY to damp velocity and reduce CHARGE
    influence (Faraday cage) — damp velocity, lower own CHARGE slightly.
28. `applyPolarization` (pair): channel filter — if TUNING_CH1 of i and
    TUNING_CH1 of j differ by more than 0.5, damp the SIGNAL transfer (filter
    mismatch); else boost SIGNAL of the weaker.

### infoLaws.js — INFORMATION (indices 110-111)
29. `applyNavigation` (pp): steer toward own stored TRAIL position (the map of
    where it has been) — pull toward (TRAIL_X, TRAIL_Y, TRAIL_Z).
30. `applyEncryption` (pp): robust coding — if SIGNAL > 0.01, decay slower
    (SIGNAL = SIGNAL * 0.999 + 0.001) so traces persist.

### quantumLaws.js — QUANTUM (indices 112-127, 16 laws)
31. `applySuperposition` (pp): velocity variance — add a random kick scaled by
    prng() and ENERGY, plus a tiny damp so it doesn't explode.
32. `applyTunneling` (pp): if prng() < 0.01, phase-shift position by a short
    random hop (up to ~8 units) — ignore barriers.
33. `applyDecoherence` (pp): collapse — damp velocity spread, radiate the lost
    variance into SIGNAL.
34. `applyWaveParticle` (pp): if speed < 0.5 act wave-like (smooth: damp
    sharply, small kicks); else particle-like (accelerate along velocity).
35. `applyUncertainty` (pp): tradeoff — if |v| high, jitter position slightly
    (px += (prng()-0.5)*0.3); if |v| low, add a velocity kick.
36. `applyTeleport` (pp): if prng() < 0.002 and ENERGY > 10, jump to a random
    position and spend ENERGY proportional to distance.
37. `applyObserver` (pp): measurement — damp own velocity spread, boost MEMORY
    toward 1.0 (the particle measures itself).
38. `applyPlanck` (pp): quantize — round VELOCITY and ENERGY to fixed quantum
    steps (e.g. 0.05 * round(v / 0.05)).
39. `applyCoherence` (pair): phase-lock — if PHASE_2 values close, pull
    velocities together and align PHASE_2 toward the mean.
40. `applyBosonic` (pair): short-range glue — strong attraction when
    dist < rSum * 2.2, scaling up as dist shrinks.
41. `applyFermionic` (pair): exclusion — strong repulsion when dist < rSum,
    growing sharply as dist shrinks.
42. `applySpin` (pp): intrinsic spin — perpendicular wiggle using particle
    parity and ENERGY (like SPIN in laws.js but standalone).
43. `applySpectral` (pp): identity radiation — emit a small species-tagged
    SIGNAL tone (SIGNAL += 0.005 * (1 + SPECIES_ID % 3)).
44. `applyWavefunction` (pp): position blur — after integration smooth position
    toward nearest 0.5-grid and add tiny random jitter (probability cloud).
45. `applyHyperplane` (pp): uniform shear — add a slow drift force along
    (vy, -vx) scaled by a hidden axis tilt using AGE.
46. `applyAntimatter` (pair): if CHARGE parities are opposite (CHARGE_i *
    CHARGE_j < 0), set both DEAD = 1 and return `true` (solver breaks the pair
    loop — treat like absorption). Return false otherwise.
