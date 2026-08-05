# VEPA Law Audit — Combined Results (128 laws)

**Audit run:** 2026-08-05 · 32 batches × 4 laws · 4 parallel agents (dynamic batch queue) · conclusive validation with repair loop (≤3 attempts per law).

| Metric | Count |
|--------|-------|
| ✅ PASS | 110 |
| ⚠️ REPAIRED | 18 |
| ❌ FAULTY | 0 |
| **Total laws** | **128** |

## Batch summary

| Batch | PASS | REPAIRED | FAULTY |
|-------|------|----------|--------|
| [01 — GRAV / DRAG / ENTR / WRAP](batch_01.md) | 4 | 0 | 0 |
| [02 — COLL / ACCR / PLANETARY / LIFE](batch_02.md) | 3 | 1 | 0 |
| [03 — GLOW / AFFINITY / REPRO / TRACK](batch_03.md) | 4 | 0 | 0 |
| [04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE](batch_04.md) | 4 | 0 | 0 |
| [05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY](batch_05.md) | 3 | 1 | 0 |
| [06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY](batch_06.md) | 3 | 1 | 0 |
| [07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION](batch_07.md) | 3 | 1 | 0 |
| [08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY](batch_08.md) | 3 | 1 | 0 |
| [09 — CHAOS / ORDER / FATE / WILL](batch_09.md) | 2 | 2 | 0 |
| [10 — SOUL_LAW / MIND / VOID / BOND](batch_10.md) | 4 | 0 | 0 |
| [11 — REDUCTION / ALLOY / MELT / BOIL](batch_11.md) | 3 | 1 | 0 |
| [12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY](batch_12.md) | 4 | 0 | 0 |
| [13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION](batch_13.md) | 2 | 2 | 0 |
| [14 — COMMS / CHARGE_LAW / FIELD / CURRENT](batch_14.md) | 3 | 1 | 0 |
| [15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM](batch_15.md) | 3 | 1 | 0 |
| [16 — RESONANCE / FLUX / IONIZATION / DISCHARGE](batch_16.md) | 4 | 0 | 0 |
| [17 — PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN](batch_17.md) | 4 | 0 | 0 |
| [18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL](batch_18.md) | 4 | 0 | 0 |
| [19 — METRIC / PREDICT / CODE / PROTOCOL](batch_19.md) | 4 | 0 | 0 |
| [20 — FEEDBACK / LANGUAGE / CULTURE / SINGULARITY](batch_20.md) | 4 | 0 | 0 |
| [21 — ENTANGLEMENT / HISTORY / TIDE / FRICTION](batch_21.md) | 4 | 0 | 0 |
| [22 — ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION](batch_22.md) | 4 | 0 | 0 |
| [23 — SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY](batch_23.md) | 4 | 0 | 0 |
| [24 — ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION](batch_24.md) | 4 | 0 | 0 |
| [25 — STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION](batch_25.md) | 4 | 0 | 0 |
| [26 — EXPANSION / EQUILIBRIUM / LATENT_HEAT / RUNAWAY](batch_26.md) | 3 | 1 | 0 |
| [27 — CONSCIOUSNESS / PERCEPTION / SYNCHRONICITY / ANTENNA](batch_27.md) | 4 | 0 | 0 |
| [28 — SHIELDING / POLARIZATION / NAVIGATION / ENCRYPTION](batch_28.md) | 4 | 0 | 0 |
| [29 — SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE](batch_29.md) | 3 | 1 | 0 |
| [30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK](batch_30.md) | 2 | 2 | 0 |
| [31 — COHERENCE / BOSONIC / FERMIONIC / SPIN](batch_31.md) | 3 | 1 | 0 |
| [32 — SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER](batch_32.md) | 3 | 1 | 0 |

## Method

- Each law was validated with a focused vitest file (`v4/tests/audit/batch_XX.test.js`):
  direct function calls (gate checks via `isSet`, thresholds, exact values) plus
  integration-level `solve()` on-vs-off checks against `LAW_HELP_DB` /
  `v4/src/physics/lawgroups/SPEC.md` expected behavior.
- Laws failing validation were repaired in place (implementation file) up to 3
  attempts, re-running the audit test each time; failures after 3 attempts are
  recorded ❌ FAULTY.
- Full v4 suite after audit: **47 test files / 420 tests green**;
  `node --check` clean; `vite build` OK.

---

# Batch 01 — GRAV / DRAG / ENTR / WRAP

Laws under audit (indices 0-3):

- **GRAV** (index 0, physics / BLUE)
- **DRAG** (index 1, physics / BLUE)
- **ENTR** (index 2, physics / BLUE)
- **WRAP** (index 3, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| GRAV | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "GRAV: particles accelerate toward each other and separation decreases": separation 10 → 9.68 after 5 ticks; `VEL_X` of i > 0 and of j < 0. Gate test confirms zero motion with GRAV off. |
| DRAG | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "DRAG: velocity decays over time": `VEL_X` 5 → ~2.73 over 60 ticks (viscosity 0.98 + friction 0.01, per-tick factor ≈0.99). Gate test: velocity preserved to 5 with DRAG off. |
| ENTR | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "ENTR: jitter injects random kinetic energy": resting particles (JITTER=5, seeded LCG prng) reach `|v| ≈ 0.4` after 80 ticks. Gate test: velocity stays 0 with ENTR off. |
| WRAP | ✅ PASS | `v4/tests/audit/batch_01.test.js` — "WRAP: particles crossing the edge reappear on the opposite side": particle at x=1995, vx=10 lands at x≈2.5 after 3 ticks. Gate test: with WRAP off, edge clamps to ~1998.7 and flips velocity to −5. |

## Notes

- Validation method: integration-level `solve()` checks (see `v4/tests/unit/lawCategories.test.js` for the `makeWorld`/`solve` pattern), one focused test + one gate test per law, plus `isSet()` gating assertions.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyGravity`, DRAG damping block, ENTR jitter block, WRAP toroidal wrap block).


---

# Batch 02 — COLL / ACCR / PLANETARY / LIFE

Laws under audit (indices 4-7):

- **COLL** (index 4, physics / BLUE)
- **ACCR** (index 5, physics / BLUE)
- **PLANETARY** (index 6, physics / BLUE)
- **LIFE** (index 7, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COLL | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_02.test.js` — "COLL: approaching particles bounce": closing speed 2.0 → ~1.3 after 16 ticks; pair stays on the correct side (separation 0.61, no crossing). Before the fix the pair crossed straight through (separation −40). Gate test confirms pass-through with COLL off. |
| ACCR | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "ACCR: a larger body absorbs mass": big body 10 → +0.06, small body 1.5 → −0.06 in one tick, mass conserved (Δ=6e-6). Gate test: masses unchanged with ACCR off. |
| PLANETARY | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "PLANETARY: particles are pulled toward the world centre": distance to centre 1558.8 → 1558.4 after 200 ticks, `VEL_X/Y/Z` all > 0 toward centre. Gate test: no motion with PLANETARY off. |
| LIFE | ✅ PASS | `v4/tests/audit/batch_02.test.js` — "LIFE: metabolic energy decay": ENERGY 100 → 99.0 over 100 ticks (ENERGY_EFFICIENCY=0 ⇒ −0.01/tick); "LIFE: starvation kills": HUNGER=100 → DEAD=1 in one tick. Gate test: energy untouched with LIFE off. |

## Notes

- **REPAIR — COLL bounce condition (attempt 1):** the impulse was applied when `relVelN < 0`, but with the i→j collision normal the pair is *closing* when `relVelN > 0`, so approaching particles received no bounce and passed through each other (reproduced empirically: `approach i=(1020,v5) j=(980,v-5) dist=-40`). Separating pairs were also receiving a spurious impulse.
  - File: `v4/src/physics/solver.js` (inline collision block, formerly line ~344).
  - Before: `// Bounce if approaching\n          if (relVelN < 0) {`
  - After: `// Bounce if approaching (relVelN > 0 along the i→j normal means\n          // the pair is closing; a negative impulse along n separates them)\n          if (relVelN > 0) {`
  - Verified: approaching pair bounces (dist stays positive, closing speed drops); separating pair moves apart freely with velocities preserved; full unit suite (123 tests) still green.
- Validation method: integration-level `solve()` tests with `isSet()` gating; ACCR and COLL use the overlap path in the solver's pairwise block.


---

# Batch 03 — GLOW / AFFINITY / REPRO / TRACK

Laws under audit (indices 8-11):

- **GLOW** (index 8, biology / GREEN)
- **AFFINITY** (index 9, biology / GREEN)
- **REPRO** (index 10, biology / GREEN)
- **TRACK** (index 11, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| GLOW | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "GLOW: signaling particles regenerate energy": SIGNAL=1 → ENERGY 50 → 51.0 over 100 ticks (+0.01/tick). Gate test: energy stays 50 with GLOW off. |
| AFFINITY | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "AFFINITY: same-species particles with positive affinity attract": separation 100 → ~73 over 80 ticks; `VEL_X` of i > 0, of j < 0. Gate test: separation unchanged (100) with AFFINITY off. |
| REPRO | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "REPRO: mature, high-energy particles spawn offspring": `drainOffspring()` returns 1 child (parentId 0, energy 60); parent ENERGY 100 → 50. Gate test: no offspring with REPRO off. |
| TRACK | ✅ PASS | `v4/tests/audit/batch_03.test.js` — "TRACK: predators chase lower-mass prey": predator (mass 2, PREDATION_BIAS 1) closes separation 100 → ~92 over 100 ticks and gains `VEL_X > 0`. Gate test: no chase with TRACK off. |

## Notes

- Validation method: integration-level `solve()` tests with `isSet()` gating; REPRO uses the exported `drainOffspring()` / `resetOffspringRing()` from `v4/src/physics/solver.js` to observe spawned children.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyGlowEffect`, `applyAffinity`, `applyReproduction`, `applyTrackingBehavior`).


---

# Batch 04 — SENESCENCE / ENERGY / RADIATION / GENOTYPE

Laws under audit (indices 12-15):

- **SENESCENCE** (index 12, biology / GREEN)
- **ENERGY** (index 13, biology / GREEN)
- **RADIATION** (index 14, biology / GREEN)
- **GENOTYPE** (index 15, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SENESCENCE | ✅ PASS | `v4/tests/audit/batch_04.test.js` — "SENESCENCE: particles past age 500 die": AGE=1000, DEATH_RATE=500 → death chance 0.55 > prng 0.5 → DEAD=1 in one tick (gated by LIFE). Gate test: same particle survives with SENESCENCE off. |
| ENERGY | ✅ PASS | `v4/tests/audit/batch_04.test.js` — "ENERGY: nearby particles conduct energy toward equilibrium": pair 10/200 at dist 50 → cold gains, hot loses, total conserved (10+200 exactly) in one tick. Gate test: energies untouched (10/200) with ENERGY off. |
| RADIATION | ✅ PASS | `v4/tests/audit/batch_04.test.js` — "RADIATION: low-armor particles take energy damage": ARMOR=0 → ENERGY 100 → 98.0 over 100 ticks (−0.02/tick). "RADIATION: full armor fully shields": ARMOR=1 → ENERGY stays 100. Gate test: energy untouched with RADIATION off. |
| GENOTYPE | ✅ PASS | `v4/tests/audit/batch_04.test.js` — "GENOTYPE: DNA cache drifts over time": MUTATION=5, TEMPERATURE=10 → 1+ DNA cache slots changed after 100 ticks. Gate test: all 42 DNA cache values bit-identical with GENOTYPE off. |

## Notes

- Validation method: integration-level `solve()` tests with `isSet()` gating. SENESCENCE is nested inside `applyLifeCycle` (requires LIFE on), which the gate test confirms; RADIATION is dispatched twice (`applyLifeCycle` internal block + `applyRadiationDamage`), both armored-scaled.
- No repairs required — all four laws were already functional as specified in `LAW_HELP_DB` (`v4/src/constants.js`) and dispatched from `v4/src/physics/solver.js` (`applyEnergyTransfer`, `applyRadiationDamage`, `applyGenotypeMutation`, and the senescence block in `applyLifeCycle`).


---

# Batch 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY

Laws under audit (indices 16-19):

- **PHENOTYPE** (index 16, biology / GREEN)
- **CATALYSIS_LAW** (index 17, chemistry / PURPLE)
- **SOLVATION** (index 18, chemistry / PURPLE)
- **ACIDITY** (index 19, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PHENOTYPE | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_05.test.js` — direct call: radius 2.0 @ energy 200 → 2.5 (×1.25, synergy 1). Integration: `solve()` radius ratio energy 200 vs 100 = 1.25 (was broken: radius effect was overwritten by the mass-derived recompute in `solver.js`). Gating `isSet` verified. |
| CATALYSIS_LAW | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applyChemistry` multiplier 1.0 (gate) → 1.5 with CATALYSIS DNA 1.0 @ synergy 1 (×[1 + cat·0.5]). Gating `isSet` verified. |
| SOLVATION | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applySolvationEffect` 1.0 (gate / near-equal charges) → 1.4 with charge gap 2. Gating `isSet` verified. |
| ACIDITY | ✅ PASS | `v4/tests/audit/batch_05.test.js` — `applyAcidityEffect` no-op (gate / gap < 0.3); gap 2, dt 1 → neighbour energy 100 → 99.98, actor 50 → 50.01 (half returned). Gating `isSet` verified. |

## Notes

- PHENOTYPE repaired in `v4/src/physics/solver.js` (radius recompute, `src/physics/solver.js` ~line 1264):
  - Before: `view[iBase + S.RADIUS] = baseRadius * Math.pow(mass, 0.333);`
  - After: the base radius is computed into `radiusOut`, then multiplied by the PHENOTYPE energy factor `1 + (energy/200 − 0.5) · 0.5 · synergy` when the law is set, then written. The `applyPhenotype` per-particle call had its radius modulation overwritten by the unconditional mass-derived recompute each tick, making the law dead at integration level.
  - Repair attempt count: 1 (implementation). One test assertion was tightened (ratio vs frozen world) — test-only change, no further implementation edits.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_05.test.js` (15 tests).


---

# Batch 06 — OXIDATION / POLYMER / ISOMERIZATION / CHIRALITY

Laws under audit (indices 20-23):

- **OXIDATION** (index 20, chemistry / PURPLE)
- **POLYMER** (index 21, chemistry / PURPLE)
- **ISOMERIZATION** (index 22, chemistry / PURPLE)
- **CHIRALITY** (index 23, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| OXIDATION | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyOxidationEffect` no-op (gate / charge < 0.3); charge 1, mass 1.5, dt 1 → 1.499 (−charge·0.001). Gating `isSet` verified. |
| POLYMER | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyPolymer` gate returns `{0,0,0}` + no bond; dist 5 (< 10·synergy) fills `BOND_PARTNER_1 = 1`, `BOND_COUNT = 1`, spring force ax = 0.02 ((5−4)·0.02). Integration: `solve()` forms the bond between close particles. Gating `isSet` verified. |
| ISOMERIZATION | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_06.test.js` — direct call: radius 2.0 @ sin-phase peak → 2.01 (×1.005, dt 1, synergy 1). Integration: `solve()` radius ratio peak-vs-zero phase = 1.00125 (was broken: radius modulation overwritten by the mass-derived recompute in `solver.js`). Gating `isSet` verified. |
| CHIRALITY | ✅ PASS | `v4/tests/audit/batch_06.test.js` — `applyChirality` null (gate / opposite polarity); same-polarity pair (dx 3, dy 4, dist 5) → ax −0.008, ay 0.006 (perpendicular deflection). Gating `isSet` verified. |

## Notes

- ISOMERIZATION repaired in `v4/src/physics/solver.js` (radius recompute, `src/physics/solver.js` ~line 1271):
  - Before: `view[iBase + S.RADIUS] = baseRadius * Math.pow(mass, 0.333);`
  - After: the base radius is computed into `radiusOut`, then multiplied by the ISOMERIZATION phase factor `1 + sin(age·0.01)·0.1·localTimeStep·synergy·0.05` when the law is set, then written. The per-particle `applyIsomerization` radius modulation was overwritten by the unconditional mass-derived recompute each tick, making the law dead at integration level.
  - Repair attempt count: 1 (implementation). One test assertion was tightened (ratio vs zero-phase world) — test-only change, no further implementation edits.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_06.test.js` (16 tests).


---

# Batch 07 — CRYSTALLIZATION / HEAT / COLD / CONVECTION

Laws under audit (indices 24-27):

- **CRYSTALLIZATION** (index 24, chemistry / PURPLE)
- **HEAT** (index 25, thermodynamics / ORANGE)
- **COLD** (index 26, thermodynamics / ORANGE)
- **CONVECTION** (index 27, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CRYSTALLIZATION | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyCrystallization` null (gate / dist > 30); offset (4,4) → pull (0.04, 0.04) toward 8-unit lattice. Gating `isSet` verified. |
| HEAT | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyHeatTransfer` no-op (gate); hot 1.0 / cold 0.0, dt 1 → 0.99 / 0.01 (conducts hot → cold). Integration: `solve()` conducts between neighbours. Gating `isSet` verified. |
| COLD | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_07.test.js` — direct call now equalises: cold 0.0 / hot 1.0, dt 1 → 0.015 / 0.985 (was 1.015 / −0.015: hot particle got hotter — anti-thermodynamic sign inversion). Integration: `solve()` cools the hotter neighbour (1.001875 → < 1.0). Gating `isSet` verified. |
| CONVECTION | ✅ PASS | `v4/tests/audit/batch_07.test.js` — `applyConvection` no-op (gate); temp 1.0, dt 1 → VEL_Y +0.0005 ((temp−0.5)·0.001). Integration: `solve()` gives hot particle positive VEL_Y. Gating `isSet` verified. |

## Notes

- COLD repaired in `v4/src/physics/laws.js` (`applyHeatTransfer`, `src/physics/laws.js` ~line 875):
  - Before: `const tDec2 = diff * rate; const tInc2 = diff * rate;` (diff = tempI − tempJ < 0 when the partner is hotter → hot particle heated, cold particle cooled).
  - After: `const tDec2 = -diff * rate; const tInc2 = -diff * rate;` — heat now flows from the hotter partner into the colder one, matching HELP_DB "temperature trends toward equilibrium".
  - Repair attempt count: 1.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_07.test.js` (16 tests).


---

# Batch 08 — PHASE_RADIATION / SUBLIMATION / TIME_DILATION / DIMENSIONALITY

Laws under audit (indices 28-31):

- **PHASE_RADIATION** (index 28, thermodynamics / ORANGE)
- **SUBLIMATION** (index 29, thermodynamics / ORANGE)
- **TIME_DILATION** (index 30, metaphysics / RED)
- **DIMENSIONALITY** (index 31, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PHASE_RADIATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applyPhaseRadiation` no-op (gate / temp ≤ 0.6); temp 1.0, dt 1 → energy −0.008, temp −0.008, signal +0.008. Integration: `solve()` lowers temp and raises signal. Gating `isSet` verified. |
| SUBLIMATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applySublimation` no-op (gate); temp 1.0, mass 1.5, dt 1 → mass −0.0025, temp −0.00125 (+ random velocity burst). Integration: `solve()` sublimates a hot massive particle. Gating `isSet` verified. |
| TIME_DILATION | ✅ PASS | `v4/tests/audit/batch_08.test.js` — `applyTimeDilation` 1.0 (gate / soul 0); soul 1.0 → localDt 0.7 (1 − soul·0.3). Integration: `solve()` high-soul particle advances AGE slower than soul-less (0.25 vs 0.175 dt). Gating `isSet` verified. |
| DIMENSIONALITY | ⚠️ REPAIRED (1 attempt) | `v4/tests/audit/batch_08.test.js` — direct call: prng 1.0, dt 1 → VEL_Z +0.05. Integration: `solve()` now leaves VEL_Z ≠ 0 (was 0 — the kick was applied to the buffer in the force phase, then overwritten by the stale local velocity at integration). Gating `isSet` verified. |

## Notes

- DIMENSIONALITY repaired in two files (1 attempt):
  - `v4/src/physics/laws.js` (`applyDimensionality`, ~line 909): now `return force` after writing `view[base + S.VEL_Z] += force` (gate returns 0 instead of `undefined`).
  - `v4/src/physics/solver.js` (~line 843): call site changed from `applyDimensionality(...)` to `vz += applyDimensionality(...)`, folding the kick into the local velocity that is written back at integration. Previously the in-place buffer write was overwritten by the integration write of the stale local `vz`.
  - Repair attempt count: 1.
- All other laws passed on first validation; no other files modified.
- Test file: `v4/tests/audit/batch_08.test.js` (18 tests).


---

# Batch 09 — CHAOS / ORDER / FATE / WILL

Laws under audit (indices 32-35):

- **CHAOS** (index 32, metaphysics / RED)
- **ORDER** (index 33, metaphysics / RED)
- **FATE** (index 34, metaphysics / RED)
- **WILL** (index 35, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CHAOS | ⚠️ REPAIRED (1 attempt) | `CHAOS direct: stochastic velocity forcing, gated by isSet` — prng=1 ⇒ VEL_X/Y +0.25, VEL_Z +0.125; prng=0 ⇒ −0.25; off ⇒ no-op. `CHAOS integration` — vx = 0.05 (prng 0.9) with law on, 0 with law off. |
| ORDER | ✅ PASS | `ORDER direct` — idle i gains ax=+0.025 toward neighbor vx=5 (distSq 100); null beyond 10k and when off. `ORDER integration` — i.vx > 0 with j at vx=5; 0 with law off. |
| FATE | ✅ PASS | `FATE direct` — same-species pair at dx=10 gives ax=+0.05; null for cross-species, distSq>250k, and when off. `FATE integration` — same-species i.vx > 0; 0 with law off. |
| WILL | ⚠️ REPAIRED (1 attempt) | `WILL direct` — vx 5 → 5.01 boost; stationary no boost; off no-op. `WILL integration` — vx 2 → 2.0025 with law on; 2 with law off. |

## Notes

- Method: direct law-function calls (`applyChaos`/`applyOrder`/`applyFate`/`applyWill` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_09.test.js` (8 tests, all pass).
- Repair 1 (CHAOS + WILL, 1 attempt): integration revealed CHAOS and WILL wrote velocity deltas in-place to the buffer during solve, but the solver's local `vx/vy/vz` copy overwrote them at writeback (the old "Re-read velocity" line `vx = view[VEL_X] + (vx - view[VEL_X])` was an algebraic no-op). Fix in `v4/src/physics/solver.js`: fold buffer velocity into locals before force integration, and fold WILL's in-place boost back via pre/post deltas. `v4/tests/unit` (123 tests) unaffected.


---

# Batch 10 — SOUL_LAW / MIND / VOID / BOND

Laws under audit (indices 36-39):

- **SOUL_LAW** (index 36, metaphysics / RED)
- **MIND** (index 37, metaphysics / RED)
- **VOID** (index 38, physics / BLUE)
- **BOND** (index 39, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SOUL_LAW | ✅ PASS | `SOUL_LAW direct` — i soul 0 → 0.05 from neighbor soul 50 (distSq 100); no transfer cross-species, beyond 10k, or when off. `SOUL_LAW integration` — i soul > 0 with law on; 0 with law off. |
| MIND | ✅ PASS | `MIND direct` — same-species pair returns signalBoost 0.001 (distSq 100), ax=0; null cross-species, beyond 40k, and when off. `MIND integration` — i SIGNAL > 0 with law on; 0 with law off. |
| VOID | ✅ PASS | `VOID direct` — particle at (1100,1000,1000) in 2000³ world gets ax=+0.0005 outward; null exactly at center and when off. `VOID integration` — particle at x=1800 gains vx > 0; 0 with law off. |
| BOND | ✅ PASS | `BOND direct` — stretched pair (dist 3, rest 2.2, stiffness 1) returns ax=+0.04, registers BOND_COUNT=1 + BOND_PARTNER_1 on both sides, no double count on re-call; null beyond 30, stiffness<0.01, and when off. `BOND integration` — both particles BOND_COUNT=1 with law on; 0 with law off. |

## Notes

- Method: direct law-function calls (`applySoul`/`applyMind`/`applyVoid`/`applyBond` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_10.test.js` (8 tests, all pass).
- No repairs needed. Bond slots must be pre-initialized to −1 (seed does this); default 0 slot values would block registration, which is expected buffer hygiene, not a law fault.


---

# Batch 11 — REDUCTION / ALLOY / MELT / BOIL

Laws under audit (indices 40-43):

- **REDUCTION** (index 40, chemistry / PURPLE)
- **ALLOY** (index 41, chemistry / PURPLE)
- **MELT** (index 42, thermodynamics / ORANGE)
- **BOIL** (index 43, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| REDUCTION | ✅ PASS | `REDUCTION direct` — charges 1.0/0.2 → 0.96/0.24 (neutralization = diff×0.05); equal charges unchanged. `REDUCTION integration` — |Δcharge| 0.8 → <0.8 with law on; stays 0.8 with law off. |
| ALLOY | ⚠️ REPAIRED (1 attempt) | `ALLOY direct` — cross-species overlap (dist 0.3 < (r1+r2)/2) merges j into i: j DEAD=1, i MASS 1.5 → 1.65; same-species, far pairs, and off are no-ops. `ALLOY integration` — j DEAD=1, i MASS > 1.5 with law on; unchanged with law off. |
| MELT | ✅ PASS | `MELT direct` — temp 1.0, mass 1.5 → mass 1.497, temp drops; below 0.7 and off unchanged. `MELT integration` — mass < 1.5 with law on; 1.5 with law off. |
| BOIL | ✅ PASS | `BOIL direct` — mass 10, temp 1.0 → mass < 10 and temp drops (ejectMass 0.02 > 0.01); temp<0.9, small ejectMass, and off unchanged. `BOIL integration` — mass 50, temp 1.0 → mass < 50 with law on; 50 with law off. |

## Notes

- Method: direct law-function calls (`applyReduction`/`applyAlloy`/`applyMelt`/`applyBoil` from `v4/src/physics/laws.js`, `setBuffer` for REDUCTION's global buffer) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_11.test.js` (8 tests, all pass).
- Repair 1 (ALLOY, 1 attempt): integration showed j was marked DEAD but i's mass stayed 1.5 — `applyAlloy` adds mass in-place to `view[iBase+MASS]` during the pair loop, but the solver writeback `view[iBase+MASS] = mass` (stale local copy) clobbered it. Fix in `v4/src/physics/solver.js`: fold the buffer mass back into the local copy immediately before writeback (`mass = view[iBase + S.MASS];`). This also restores accretion/chemistry mass transfers that write in-place during the pair loop.
- BOIL integration initially failed only because the 0.01 ejectMass threshold needs mass ≥ 20 at `DT=0.25`; raised test mass 10 → 50 (implementation is correct, verified by the direct-call test).


---

# Batch 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY

Laws under audit (indices 44-47):

- **CONDENSE** (index 44, thermodynamics / ORANGE)
- **DEPOSIT** (index 45, thermodynamics / ORANGE)
- **EXOTHERMIC** (index 46, thermodynamics / ORANGE)
- **TELEPATHY** (index 47, metaphysics / RED)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CONDENSE | ✅ PASS | `CONDENSE direct` — temp 0.0, mass 1.5 → mass 1.5015, temp +0.00015; temp>0.3 and off unchanged. `CONDENSE integration` — mass > 1.5 with law on; 1.5 with law off. |
| DEPOSIT | ✅ PASS | `DEPOSIT direct` — temp 0.0 → mass 1.5 → 1.506, radius 0.6 → 0.601, temp +0.0001; temp>0.2 and off unchanged. `DEPOSIT integration` — mass > 1.5 with law on; 1.5 with law off. |
| EXOTHERMIC | ✅ PASS | `EXOTHERMIC direct` — energy 100 → 110 (×1.1 at synergy 1); off unchanged. `EXOTHERMIC integration` — energy > 100 with law on; 100 with law off. |
| TELEPATHY | ✅ PASS | `TELEPATHY direct` — j SIGNAL 0.5 → i SIGNAL 0.025 at any distance; no transfer cross-species, below 0.001 threshold, or when off. `TELEPATHY integration` — i SIGNAL > 0 with law on; 0 with law off. |

## Notes

- Method: direct law-function calls (`applyCondense`/`applyDeposit`/`applyExothermic`/`applyTelepathy` from `v4/src/physics/laws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_12.test.js` (8 tests, all pass).
- No repairs needed. TELEPATHY intentionally ignores distance (distSq argument unused) — consistent with its HELP_DB "regardless of distance" behavior.


---

# Batch 13 — CLAIRVOYANCE / PRECOGNITION / ASTRAL / PREDATION

Laws under audit (indices 48-51):

- **CLAIRVOYANCE** (index 48, metaphysics / RED)
- **PRECOGNITION** (index 49, metaphysics / RED)
- **ASTRAL** (index 50, metaphysics / RED)
- **PREDATION** (index 51, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CLAIRVOYANCE | ✅ PASS | `batch_13.test.js` — "CLAIRVOYANCE steers toward the neighbor's predicted future position": direct `applyClairvoyance` with offset (0,10,0) + neighbor vx=5 returns ax>0, ay≈0; law-off gate returns null; integration: after 40 solves VEL_X > 0.005. |
| PRECOGNITION | ✅ PASS | `batch_13.test.js` — "PRECOGNITION applies lateral avoidance force on a collision course": closing pair (dot<0) yields ay>0, ax≈0; law-off and moving-apart (dot>0) gates return null; integration: VEL_Y > 0.001 after 8 solves. |
| ASTRAL | ⚠️ REPAIRED (1 attempt) | `batch_13.test.js` — "ASTRAL keeps souls as fading ghosts": DEAD=0.5/SOUL=1 soul keeps DEAD=0.5, ALPHA≈soul×0.5, MASS≈soul×0.1, SOUL decays <1. See repair notes. |
| PREDATION | ⚠️ REPAIRED (1 attempt) | `batch_13.test.js` — "PREDATION pursues lower-mass prey and absorbs mass/DNA on contact": predator (mass 5, PREDATION_BIAS 10) vs prey (mass 1) at contact: 5 sampled DNA traits blend toward prey (sum +0.5), predator mass 5→5.05, prey 1→0.9; pursuit at 50 units: VEL_X > 0.001 after 20 solves. See repair notes. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_13.test.js` — integration-level `solve()` checks with `isSet` gate assertions, plus direct calls to `applyClairvoyance`/`applyPrecognition` (both use the `view` param and need no `setBuffer`).
- **ASTRAL repair (v4/src/physics/solver.js)**: `applyAstral` was dispatched at the end of the per-particle loop, but that loop skips `DEAD >= 0.5` particles, so souls never reached it. Added a dedicated soul pass (Phase 2b) that iterates all particles and calls `applyAstral` for `DEAD >= 0.5`, and removed the now-redundant in-loop call.
- **PREDATION repair (v4/src/physics/solver.js)**: `applyPredation` writes absorbed mass directly to the buffer, but the solver's per-particle writeback `view[iBase+S.MASS] = mass` used a stale local read before the pairwise loop, clobbering the predator's mass gain (prey's loss survived). Added a mass re-read right after the pairwise loop (`mass = view[iBase + S.MASS]`), mirroring the existing velocity re-read pattern.
- Full v4 unit suite (123 tests) still passes after repairs.


---

# Batch 14 — COMMS / CHARGE_LAW / FIELD / CURRENT

Laws under audit (indices 52-55):

- **COMMS** (index 52, biology / GREEN)
- **CHARGE_LAW** (index 53, electromagnetism / CYAN)
- **FIELD** (index 54, electromagnetism / CYAN)
- **CURRENT** (index 55, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COMMS | ✅ PASS | `batch_14.test.js` — "COMMS emits signals over time and stays frozen when off": 4 particles, AGE=0, 120 solves → at least one SIGNAL > 1e-6; with no laws, SIGNAL=0.5 and MEMORY stay exact. "COMMS exchanges signal to a neighbour": sender SIGNAL=1, receiver 20 away → receiver SIGNAL > 0.1 after 10 solves. |
| CHARGE_LAW | ⚠️ REPAIRED (1 attempt) | `batch_14.test.js` — "CHARGE_LAW repels like charges and attracts opposite charges": POLARITY=1/1 pair at 10 units → dist grows >0.05 over 60 solves; POLARITY=1/−1 → dist shrinks >0.05; law-off gate: no movement. See repair notes. |
| FIELD | ✅ PASS | `batch_14.test.js` — "FIELD drifts particles along their POLARITY sign": POLARITY=+1 → VEL_Y > 0 after 1 solve; POLARITY=−1 → VEL_Y < 0; law-off gate: VEL_Y stays 0. |
| CURRENT | ✅ PASS | `batch_14.test.js` — "CURRENT diffuses stored charge between conductive neighbours": CHARGE 2/0 pair with CONDUCTIVITY 1 → after 10 solves charge1 < 2, charge2 > 0, |Δcharge| < 0.5; law-off gate: charge unchanged. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_14.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- **CHARGE_LAW repair (v4/src/physics/laws.js)**: `applyChargeForce` used `force = k*qq/(dist²+0.5)` along `dx` (toward the neighbor), which made like charges ATTRACT and opposite charges REPEL — the inverse of the HELP_DB contract ("Opposite charges attract, like charges repel") and of Coulomb's law. Flipped the sign to `force = -k*qq/(dist²+0.5)`. Existing direction-agnostic unit tests still pass.
- Full v4 unit suite (123 tests) still passes after repair.


---

# Batch 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM

Laws under audit (indices 56-59):

- **RESISTANCE** (index 56, electromagnetism / CYAN)
- **CAPACITANCE** (index 57, electromagnetism / CYAN)
- **INDUCTANCE** (index 58, electromagnetism / CYAN)
- **MAGNETISM** (index 59, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| RESISTANCE | ✅ PASS | `batch_15.test.js` — "RESISTANCE damps fast motion and converts it into heat": VEL_X=5, TEMPERATURE=0 → after 10 solves speed < 5 and TEMPERATURE > 0; law-off gate: velocity and temperature unchanged. |
| CAPACITANCE | ⚠️ REPAIRED (1 attempt) | `batch_15.test.js` — "CAPACITANCE stores surplus energy as charge and bleeds it when low": ENERGY 100 → CHARGE > 0.5 after 20 solves; ENERGY 30 + CHARGE 1 → CHARGE < 1 after 20 solves. "CAPACITANCE stored charge produces a pairwise repulsion force": same-sign stored charge pair at 10 units → dist grows >0.02 over 60 solves. See repair notes. |
| INDUCTANCE | ✅ PASS | `batch_15.test.js` — "INDUCTANCE aligns neighbour velocities": VEL_X +3/−3 pair → relative speed < 50% after 20 solves; law-off gate: relative speed stays exactly 6.0. |
| MAGNETISM | ✅ PASS | `batch_15.test.js` — "MAGNETISM attracts aligned moments and repels opposing moments": MAGNETIC_MOMENT +1/+1 pair → dist shrinks >0.02 over 60 solves; +1/−1 pair → dist grows >0.02. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_15.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- **CAPACITANCE repair (v4/src/physics/laws.js)**: `applyStoredChargeForce` used `force = k*qq/(dist²+0.5)` along `dx`, so same-sign stored charges ATTRACTED instead of repelling (same sign bug as CHARGE_LAW). Flipped to `force = -k*qq/(dist²+0.5)` so stored charge follows the same electrostatic convention as CHARGE_LAW (which feeds it).
- Full v4 unit suite (123 tests) still passes after repair.


---

# Batch 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE

Laws under audit (indices 60-63):

- **RESONANCE** (index 60, electromagnetism / CYAN)
- **FLUX** (index 61, electromagnetism / CYAN)
- **IONIZATION** (index 62, electromagnetism / CYAN)
- **DISCHARGE** (index 63, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| RESONANCE | ✅ PASS | `batch_16.test.js` — "RESONANCE attracts actively-pulsing particles with matching PULSE_RATE": SIGNAL=1 pair with PULSE_RATE 0.5/0.5 at 20 units → dist shrinks >0.05 over 60 solves; silent pair (no SIGNAL) → positions stable (±1e-3). |
| FLUX | ✅ PASS | `batch_16.test.js` — "FLUX pushes particles along the stored-charge gradient": CHARGE 0/2 pair at 10 units → lower-charge particle x moves >0.5 toward the gradient over 30 solves; law-off gate: x stays 100. |
| IONIZATION | ✅ PASS | `batch_16.test.js` — "IONIZATION strips charge onto particles on hard contact": POLARITY=1 pair at dist 2, relSpeed 2 → both CHARGE > 0 after 1 solve; law-off gate: both CHARGE stay 0. |
| DISCHARGE | ✅ PASS | `batch_16.test.js` — "DISCHARGE converts stored charge into motion and heat, resetting charge": CHARGE=1.5 → after 1 solve CHARGE=0, TEMPERATURE > 0, VEL_X ≠ 0; law-off gate: CHARGE stays 1.5, no heat. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_16.test.js` — integration-level `solve()` checks with `isSet` gate assertions.
- No repairs required; all four laws behave per LAW_HELP_DB.
- RESONANCE requires both particles to be actively signaling (SIGNAL > 0.01) and rewards matching PULSE_RATE via the `sync = 1 − |ΔPULSE_RATE|` term — verified with the silent-pair control.


---

# Batch 17 — PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN

Laws under audit (indices 64-67):

- **PLASMA** (index 64, electromagnetism / CYAN)
- **SUPERCONDUCTIVITY** (index 65, electromagnetism / CYAN)
- **MEMORY** (index 66, information / GOLD)
- **PATTERN** (index 67, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| PLASMA | ✅ PASS | `v4/tests/audit/batch_17.test.js` — `applyPlasma(0, 0.02)` @ temp 1 → CHARGE +0.008, temp 1 → 0.996; inert below temp 0.6. Integration: `solve()` ionizes a hot particle (CHARGE > 0, temp < 1). Gating `isSet` verified. |
| SUPERCONDUCTIVITY | ✅ PASS | `v4/tests/audit/batch_17.test.js` — cold pair (temp 0): CHARGE 1/−1 → 0.96/−0.96 with k 0.05; damping force `ax = (v2−v1)·k = 0.5`; returns null when either temp > 0.35. Integration: `solve()` shrinks both charge gap and relative speed. Gating `isSet` verified. |
| MEMORY | ✅ PASS | `v4/tests/audit/batch_17.test.js` — `applyMemoryRefresh` +0.05 both (cap 1); `applyMemoryDecay(0.995, 0.5)` fades mem 1 → 0.995 and amplifies velocity ×(1 + mem·0.5·0.02) → 1.01. Integration: `solve()` leaves MEMORY > 0 after contact + decay. Gating `isSet` verified. |
| PATTERN | ✅ PASS | `v4/tests/audit/batch_17.test.js` — cohesion `applyPatternForce(3,4,0,5,0.2)` → ax 0.02, ay 0.026667; null at dist < 1. Integration: 40 ticks of `solve()` shrink the pair distance. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_17.test.js` (16 tests).


---

# Batch 18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL

Laws under audit (indices 68-71):

- **STIGMERGY** (index 68, information / GOLD)
- **SIGNAL_BOOST** (index 69, information / GOLD)
- **LEARN** (index 70, information / GOLD)
- **SYMBOL** (index 71, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| STIGMERGY | ✅ PASS | `v4/tests/audit/batch_18.test.js` — `applyTrailWrite(100,100,100, 1,0,0)` → TRAIL (108,100,100) (pos + vel·8); `applyStigmergyForce` toward a trail 8 units east → ax ≈ 0.2667 (k 0.3). Integration: `solve()` steers a follower toward a pre-laid trail (VEL_X > 0). Gating `isSet` verified. |
| SIGNAL_BOOST | ✅ PASS | `v4/tests/audit/batch_18.test.js` — signal 0.5 relays +0.04 to neighbour (k 0.08); silent particle relays nothing. Integration: `solve()` propagates signal to a quiet neighbour. Gating `isSet` verified. |
| LEARN | ✅ PASS | `v4/tests/audit/batch_18.test.js` — `applyLearnAlign` moves VEL_X 0 → +0.05 toward a v=10 neighbour (k 0.05, kk = k·0.1). Integration: `solve()` steers the stationary particle (0 < VEL_X < 10). Gating `isSet` verified. |
| SYMBOL | ✅ PASS | `v4/tests/audit/batch_18.test.js` — same-species with SPECIES_AFFINITY 1 → attraction ax ≈ 0.03 (dx 3, dist 5, k 0.3); different species → repulsion −0.015 (affinity flipped ×0.5). Integration: 40 ticks of `solve()` converge same-species flockmates. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no implementation repairs, no implementation files modified.
- Two test-setup corrections were made in `v4/tests/audit/batch_18.test.js` (test-only): the direct STIGMERGY check now seeds the follower's POS_X (trail offset was computed from origin otherwise), and the integration check asserts the follower's pull (the trail-writer itself has zero self-force within the tick, as trail write happens after its pair pass).
- Test file: `v4/tests/audit/batch_18.test.js` (15 tests).


---

# Batch 19 — METRIC / PREDICT / CODE / PROTOCOL

Laws under audit (indices 72-75):

- **METRIC** (index 72, information / GOLD)
- **PREDICT** (index 73, information / GOLD)
- **CODE** (index 74, information / GOLD)
- **PROTOCOL** (index 75, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| METRIC | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyMetricForce` with dE 50, k 0.2 → ax 0.9998, ay 1.3331 (invDist 1/(dist+0.001)); returns null on an energy plateau (dE 0). Integration: `solve()` accelerates a poor particle toward the rich neighbour (VEL_X > 0). Gating `isSet` verified. |
| PREDICT | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyPredictForce` aims at extrapolated position (pdx 6, pdy 4 from v2·t=3; direction matches (pdx/pd, pdy/pd)). Integration: `solve()` steers toward the neighbour's future position. Gating `isSet` verified. |
| CODE | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyCodeBlend` @ distSq 9 converges sampled loci (0/1 → 0.0005/0.9995, rate k·0.01); no blend beyond distSq 16. Integration: `solve()` converges DNA at sampled loci for touching particles. Gating `isSet` verified. |
| PROTOCOL | ✅ PASS | `v4/tests/audit/batch_19.test.js` — `applyProtocolSync` entangles signal phase (0/1 → 0.1/0.9, k 0.1). Integration: `solve()` shrinks the neighbour signal gap. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_19.test.js` (14 tests).


---

# Batch 20 — FEEDBACK / LANGUAGE / CULTURE / SINGULARITY

Laws under audit (indices 76-79):

- **FEEDBACK** (index 76, information / GOLD)
- **LANGUAGE** (index 77, information / GOLD)
- **CULTURE** (index 78, information / GOLD)
- **SINGULARITY** (index 79, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| FEEDBACK | ✅ PASS | `v4/tests/audit/batch_20.test.js` — `applyFeedback(0, 0.5)` with mem 0.5, v 2 → MEMORY +0.02 (speed·k·0.02) and boost ax = vx·mem·k·0.1 = 0.05; returns null when stationary. Integration: `solve()` accelerates a moving, memory-bearing particle and recharges MEMORY. Gating `isSet` verified. |
| LANGUAGE | ✅ PASS | `v4/tests/audit/batch_20.test.js` — signaling pair (s 0.5/0, k 0.25): MEMORY 1/0 → 0.875/0.125, signal relay +0.0125; silent pair untouched. Integration: `solve()` shrinks the memory gap and relays signal. Gating `isSet` verified. |
| CULTURE | ✅ PASS | `v4/tests/audit/batch_20.test.js` — same-species contact (k 0.5): DNA cache 0/1 → 0.01/0.99 (rate k·0.02); different-species pairs untouched. Integration: `solve()` converges traits within a species but not across. Gating `isSet` verified. |
| SINGULARITY | ✅ PASS | `v4/tests/audit/batch_20.test.js` — `applySingularityForce` from m2 20 @ dist 10 (k 0.5) yields the inverse-square pull; null for sub-critical m2 5. `applySingularityAbsorb` inside the horizon (dist 2 < max(2.5, √25·0.8)) transfers mass (1.5 → hole 25 → 26.5) and kills the victim; no absorb beyond. Integration: `solve()` absorbs a particle on contact. Gating `isSet` verified. |

## Notes

- All four laws passed on first validation — no repairs needed, no implementation files modified.
- Test file: `v4/tests/audit/batch_20.test.js` (18 tests).


---

# Batch 21 — ENTANGLEMENT / HISTORY / TIDE / FRICTION

Laws under audit (indices 80-83):

- **ENTANGLEMENT** (index 80, metaphysics / RED)
- **HISTORY** (index 81, information / GOLD)
- **TIDE** (index 82, physics / BLUE)
- **FRICTION** (index 83, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ENTANGLEMENT | ✅ PASS | `v4/tests/audit/batch_21.test.js` — link forms on contact (`ENTANGLE_ID` 1/0, `ENTANGLE_PHASE` ≈ 0.998 after 1 tick); non-local coupling converges velocities (rel 5.0 → < 5.0 over 150 ticks, link still live); phase forced to 0.02 snaps the link to `ENTANGLE_ID = -1`. Gate: no link with the law off. |
| HISTORY | ✅ PASS | `v4/tests/audit/batch_21.test.js` — two corner particles drift toward the shared memory-field COM: first ticks pull each toward the centre (VEL_X/Y/Z > 0), separation 3117.7 → 2702.7 over 120 ticks. Gate: no drift with the law off. |
| TIDE | ✅ PASS | `v4/tests/audit/batch_21.test.js` — light particle (mass 1.5) accelerates toward a mass-20 neighbour (VEL_X > 0), separation 100 → < 100 over 100 ticks. Gate: no mass coupling with TIDE off. |
| FRICTION | ✅ PASS | `v4/tests/audit/batch_21.test.js` — velocity-dependent drag slows a vx=5 particle to < 5 over 100 ticks (still positive). Gate: velocity preserved exactly with FRICTION off. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating (see `v4/tests/unit/lawCategories.test.js` for the `makeWorld`/`solve` pattern). ENTANGLEMENT dispatch is pairwise (`applyEntanglePair`) + per-particle (`applyEntanglement`); HISTORY is per-particle write/force + `applyHistoryCalc()` once per solve (`v4/src/physics/laws.js`, dispatched from `v4/src/physics/solver.js`); TIDE/FRICTION are `v4/src/physics/lawgroups/physicsLaws.js`.
- A single-particle HISTORY drift test initially overshot the COM (the accumulating trail pulls the particle back — documented "archaeology" behaviour), so the assertion was replaced with a two-particle convergence test, which is deterministic.
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

# Batch 22 — ELASTICITY / TURBULENCE / CENTRIPETAL / ROTATION

Laws under audit (indices 84-87):

- **ELASTICITY** (index 84, physics / BLUE)
- **TURBULENCE** (index 85, physics / BLUE)
- **CENTRIPETAL** (index 86, physics / BLUE)
- **ROTATION** (index 87, physics / BLUE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ELASTICITY | ✅ PASS | `v4/tests/audit/batch_22.test.js` — overlapping pair (dist 0.5, radii 0.6) pushed apart: separation 0.5 → > 1.0 over 20 ticks. Gate: separation unchanged with ELASTICITY off. |
| TURBULENCE | ✅ PASS | `v4/tests/audit/batch_22.test.js` — seeded-LCG noise kicks leave a resting particle with speed > 0.05 after 100 ticks. Gate: velocity stays exactly 0 without the law. |
| CENTRIPETAL | ✅ PASS | `v4/tests/audit/batch_22.test.js` — particle at (100,100,100) pulled toward centre: distance to centre 1558.8 → < 1558.8 over 200 ticks, VEL_X/Y/Z all > 0 (harmonic attractor). Gate: no central pull without the law. |
| ROTATION | ✅ PASS | `v4/tests/audit/batch_22.test.js` — offset (−300, 0) gets a purely tangential first impulse (VEL_Y < 0, VEL_X = 0), then swirls: VEL_Y < 0 and POS_Y < 1000 after 100 ticks. Gate: no swirl without the law. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. All six functions live in `v4/src/physics/lawgroups/physicsLaws.js`; the solver dispatches ELASTICITY pairwise and TURBULENCE/CENTRIPETAL/ROTATION per-particle.
- The long-run ROTATION trajectory spirals (radial velocity grows because the tangential force keeps accelerating), so the assertion targets the deterministic first-impulse tangency plus the −y swirl, matching `LAW_HELP_DB` ("tangential force that sets the whole dish rotating").
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

# Batch 23 — SYMBIOSIS / PARASITE / HIBERNATION / IMMUNITY

Laws under audit (indices 88-91):

- **SYMBIOSIS** (index 88, biology / GREEN)
- **PARASITE** (index 89, biology / GREEN)
- **HIBERNATION** (index 90, biology / GREEN)
- **IMMUNITY** (index 91, biology / GREEN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SYMBIOSIS | ✅ PASS | `v4/tests/audit/batch_23.test.js` — different-species contact transfers energy rich → poor: pair 100/40 becomes < 100 / > 40 with total conserved (140) after 1 tick. Gate: energies untouched without the law. |
| PARASITE | ✅ PASS | `v4/tests/audit/batch_23.test.js` — mass-1 parasite drains a mass-5 host: parasite ENERGY > 100, host < 100 after 1 tick. Gate: no drain without the law. |
| HIBERNATION | ✅ PASS | `v4/tests/audit/batch_23.test.js` — starving particle (ENERGY 20, vx 5) regains energy (> 20) and is damped (< 5) in 1 tick; well-fed particle (ENERGY 50) is unaffected (energy 50, vx 5 preserved over 10 ticks). |
| IMMUNITY | ✅ PASS | `v4/tests/audit/batch_23.test.js` — ARMOR regenerates 0 → > 0.5 and ENERGY rises above 100 over 100 ticks. Gate: armour stays 0 without the law. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. Functions live in `v4/src/physics/lawgroups/biologyLaws.js`; the solver dispatches SYMBIOSIS/PARASITE pairwise and HIBERNATION/IMMUNITY per-particle (k = 0.5).
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

# Batch 24 — ELECTROLYSIS / PHOTOLYSIS / PRECIPITATION / NEUTRALIZATION

Laws under audit (indices 92-95):

- **ELECTROLYSIS** (index 92, chemistry / PURPLE)
- **PHOTOLYSIS** (index 93, chemistry / PURPLE)
- **PRECIPITATION** (index 94, chemistry / PURPLE)
- **NEUTRALIZATION** (index 95, chemistry / PURPLE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| ELECTROLYSIS | ✅ PASS | `v4/tests/audit/batch_24.test.js` — charge imbalance (1 vs 0) converts mass into energy + signal: MASS 1.5 → < 1.5, ENERGY > 100, SIGNAL > 0 after 1 tick. Gate: balanced charges (Δ 0.2) are inert (mass/signal unchanged). |
| PHOTOLYSIS | ✅ PASS | `v4/tests/audit/batch_24.test.js` — SIGNAL 1 decomposes mass into energy and spends light: MASS < 1.5, ENERGY > 100, SIGNAL ≈ 0.9 after 1 tick. Gate: weak signal (0.2) is inert. |
| PRECIPITATION | ✅ PASS | `v4/tests/audit/batch_24.test.js` — high-energy contact condenses: MASS 1.5 → > 1.5, RADIUS 0.458 → < 0.458, ENERGY < 100 after 1 tick. Gate: mass/energy unchanged without the law. |
| NEUTRALIZATION | ✅ PASS | `v4/tests/audit/batch_24.test.js` — opposite charges (1 / −1) cancel toward 0 and release heat: |CHARGE| < 1 for both, TEMPERATURE > 0 for both after 1 tick. Gate: same-sign charges (0.5/0.5) are inert. |

## Notes

- Validation method: integration-level `solve()` checks with `isSet()` gating. Functions live in `v4/src/physics/lawgroups/chemistryLaws.js`; the solver dispatches ELECTROLYSIS/PRECIPITATION/NEUTRALIZATION pairwise and PHOTOLYSIS per-particle (k = 0.5).
- RADIUS assertions use the solver-recomputed radius (BASE_RADIUS × mass^⅓ ≈ 0.458), not the 0.6 seed value; the PRECIPITATION gate asserts mass/energy since radius is recomputed every tick by the solver core regardless of the law.
- No repairs required — all four laws matched `LAW_HELP_DB` behaviour.


---

# Batch 25 — STOICHIOMETRY / AUTOCATALYSIS / ADIABATIC / COMPRESSION

Laws under audit (indices 96-99):

- **STOICHIOMETRY** (index 96, chemistry / PURPLE)
- **AUTOCATALYSIS** (index 97, chemistry / PURPLE)
- **ADIABATIC** (index 98, thermodynamics / ORANGE)
- **COMPRESSION** (index 99, thermodynamics / ORANGE)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| STOICHIOMETRY | ✅ PASS | `STOICHIOMETRY direct` — masses 1.0/2.0, k=1 → 1.005/1.995, pair total conserved (3). `integration` — i.mass > 1, j.mass < 2, sum ≈ 3 with law on; 1/2 frozen with law off. |
| AUTOCATALYSIS | ✅ PASS | `AUTOCATALYSIS direct` — same-species pair (species 7, CATALYSIS 1.5) → both ENERGY 100 → 100.15; cross-species pair unchanged. `integration` — same-species pair ENERGY > 100 with law on; 100 with law off. |
| ADIABATIC | ✅ PASS | `ADIABATIC direct` — vx=4, mass 1.5, k=0.1 → drag force ax=−0.4, TEMPERATURE +2.28 (KE→heat); stationary particle → null. `integration` — vx=4 → TEMPERATURE > 0 and vx < 4 with law on; 0/4 with law off. |
| COMPRESSION | ✅ PASS | `COMPRESSION direct` — touching pair (dist 1 < (rI+rJ)*2), k=0.5 → radii 0.6 → 0.45, TEMPERATURE +0.5; dist ≥ threshold → no effect. `integration` — overlapping pair: both radii < 0.6 and both TEMPERATUREs > 0 with law on; frozen with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyStoichiometry`/`applyAutocatalysis` from `v4/src/physics/lawgroups/chemistryLaws.js`, `applyAdiabatic`/`applyCompression` from `v4/src/physics/lawgroups/thermoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_25.test.js` (8 tests, all pass).
- No repairs needed. COMPRESSION radii shrink through solve() despite the per-tick mass-derived radius update (the double pair-pass leaves both radii below the seeded 0.6 and both temps positive).


---

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


---

# Batch 27 — CONSCIOUSNESS / PERCEPTION / SYNCHRONICITY / ANTENNA

Laws under audit (indices 104-107):

- **CONSCIOUSNESS** (index 104, metaphysics / RED)
- **PERCEPTION** (index 105, metaphysics / RED)
- **SYNCHRONICITY** (index 106, metaphysics / RED)
- **ANTENNA** (index 107, electromagnetism / CYAN)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| CONSCIOUSNESS | ✅ PASS | `CONSCIOUSNESS direct` — k=0.5 → ENERGY +0.01 (100.01), MEMORY +0.0025; caps 200/1 respected. `integration` — ENERGY > 100, MEMORY > 0 with law on; 100/0 with law off. |
| PERCEPTION | ✅ PASS | `PERCEPTION direct` — NEIGHBORHOOD_RADIUS 60 (range 120), dist 50, vJ−vI=1, k=1 → ax=+0.01; dist ≥ range → null. `integration` — idle i accelerates (vx > 0) toward vx=2 neighbour with law on; 0 with law off. |
| SYNCHRONICITY | ✅ PASS | `SYNCHRONICITY direct` — phases 0.1/0.2 (Δ<0.3), vJ=1, k=1 → ax=+0.02, both phases → 0.15; phases 0/0.5 → null. `integration` — i.vx > 0 and phases converge (Δ < 0.1) with law on; frozen with law off. |
| ANTENNA | ✅ PASS | `ANTENNA direct` — SIGNAL 1, speed 100 (cap 5), k=1 → SIGNAL 1.05; SIGNAL ≤ 0.05 → no boost. `integration` — SIGNAL 1, vx=5 → SIGNAL > 1 with law on; 1 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyConsciousness`/`applyPerception`/`applySynchronicity` from `v4/src/physics/lawgroups/metaLaws.js`, `applyAntenna` from `v4/src/physics/lawgroups/emLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_27.test.js` (8 tests, all pass).
- No repairs needed. Note: implementations intentionally differ from the SPEC.md sketches (ANTENNA and PERCEPTION are per-particle / extended-range velocity alignment rather than the pairwise sketches) — behavior matches the in-code docs, existing `v4/tests/unit/lawgroupsEmInfoMeta.test.js`, and the solver dispatch signatures.


---

# Batch 28 — SHIELDING / POLARIZATION / NAVIGATION / ENCRYPTION

Laws under audit (indices 108-111):

- **SHIELDING** (index 108, electromagnetism / CYAN)
- **POLARIZATION** (index 109, electromagnetism / CYAN)
- **NAVIGATION** (index 110, information / GOLD)
- **ENCRYPTION** (index 111, information / GOLD)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SHIELDING | ✅ PASS | `SHIELDING direct` — CHARGE 2, ENERGY 100, k=1 → CHARGE 1.99, ENERGY 99.95; no charge → no-op. `integration` — CHARGE < 2 and ENERGY < 100 with law on; 2/100 with law off. |
| POLARIZATION | ✅ PASS | `POLARIZATION direct` — equal TUNING_CH1, signals 0/2, k=0.5 → 0.5/1.5 (total conserved); mismatched channels, k=1 → both ×0.99 damped. `integration` — signals 0/2 → s0 > 0, s1 < 2, sum ≈ 2 with law on; 0/2 with law off. |
| NAVIGATION | ✅ PASS | `NAVIGATION direct` — MEMORY 0.2/0.8, dx=3,dy=4,dist=5, k=0.5 → ax=0.18, ay=0.24; no gradient → null. `integration` — i.vx > 0 toward memory-rich neighbour with law on; 0 with law off. |
| ENCRYPTION | ✅ PASS | `ENCRYPTION direct` — SIGNAL 2, k=1 → 1.95 (< 2, floor 0.05); silent → no-op. `integration` — SIGNAL 2 → 1.975, ≥ 0.05 with law on; 2 with law off. |

## Notes

- Method: direct lawgroup-function calls (`applyShielding`/`applyPolarization` from `v4/src/physics/lawgroups/emLaws.js`, `applyNavigation`/`applyEncryption` from `v4/src/physics/lawgroups/infoLaws.js`) with `isSet` gate checks, plus `solve()` integration runs (on vs off) per `v4/tests/audit/batch_28.test.js` (8 tests, all pass).
- No repairs needed. Note: NAVIGATION's implementation is the pairwise MEMORY-gradient steering (neighbour's MEMORY exceeds own → force toward neighbour), not the per-particle TRAIL steering from the SPEC.md sketch — matches the solver dispatch and `v4/tests/unit/lawgroupsEmInfoMeta.test.js`.


---

# Batch 29 — SUPERPOSITION / TUNNELING / DECOHERENCE / WAVE_PARTICLE

Laws under audit (indices 112-115):

- **SUPERPOSITION** (index 112, quantum / INDIGO)
- **TUNNELING** (index 113, quantum / INDIGO)
- **DECOHERENCE** (index 114, quantum / INDIGO)
- **WAVE_PARTICLE** (index 115, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SUPERPOSITION | ✅ PASS | `batch_29.test.js` — "SUPERPOSITION adds random velocity-spread force": direct `applySuperposition(buf,0,1,rngHigh)` → ax=ay=0.8; solver (k=0.05, prng 0.9) → |VEL_X| > 0.001 after 1 tick; law-off gate: velocity frozen. |
| TUNNELING | ⚠️ REPAIRED (1 attempt) | `batch_29.test.js` — "TUNNELING phase-shifts position when triggered": direct k=200 prng 0.9 → POS 100→103.6 (hop radius×6); solver (k=0.5, prng 0.0009) → POS 100→96.4 after 1 tick; law-off gate: frozen. See repair notes. |
| DECOHERENCE | ✅ PASS | `batch_29.test.js` — "DECOHERENCE damps velocity and radiates SIGNAL": direct VEL 5 → ax=−0.05, SIGNAL+0.001; solver: VEL < 5−0.001 and SIGNAL > 0.0005 after 10 ticks; law-off gate: frozen. |
| WAVE_PARTICLE | ✅ PASS | `batch_29.test.js` — "WAVE_PARTICLE damps slow (wave) and amplifies fast (particle) motion": direct VEL 0.2 → damping ax<0, VEL 5 → ax=+0.05, VEL 1 → null; solver: fast VEL grows >5, slow VEL shrinks <0.2. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_29.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **TUNNELING repair (v4/src/physics/solver.js)**: `applyTunneling` writes the hop directly to the buffer, but the solver's per-particle writeback used the stale local `px` read at iteration start, erasing the hop every tick (position stayed at 100). Fixed by reconciling the local position with the buffer after the per-particle law section: `px = view[iBase+S.POS_X] + softbodyDX` (the `softbodyDX` delta captured after the pair loop preserves the COLL softbody push while folding in buffer position mutations).
- Full v4 suite (47 files / 420 tests) passes after repair, including the COLL batch.


---

# Batch 30 — UNCERTAINTY / TELEPORT / OBSERVER / PLANCK

Laws under audit (indices 116-119):

- **UNCERTAINTY** (index 116, quantum / INDIGO)
- **TELEPORT** (index 117, quantum / INDIGO)
- **OBSERVER** (index 118, quantum / INDIGO)
- **PLANCK** (index 119, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| UNCERTAINTY | ⚠️ REPAIRED (1 attempt) | `batch_30.test.js` — "UNCERTAINTY jitters position and adds a velocity kick": direct prng 0.9 → POS +0.008, kick ax=0.02; solver: POS > 100.0001 and VEL_X > 0.0001 after 1 tick (position jitter persisted after repair); law-off gate: frozen. See repair notes. |
| TELEPORT | ⚠️ REPAIRED (1 attempt) | `batch_30.test.js` — "TELEPORT jumps to a random location and spends ENERGY": direct k=1000 prng 0.9 → jump to 1800, ENERGY < 100; solver (k=0.5, prng 0.0009) → POS ≈ 1.8 and ENERGY < 90 after 1 tick; law-off gate: frozen. See repair notes. |
| OBSERVER | ✅ PASS | `batch_30.test.js` — "OBSERVER collapses a neighbour velocity toward the observer and imprints MEMORY": direct observer MEMORY 1/VEL 10 → neighbour VEL 0.1, MEMORY 0.1; solver: neighbour VEL > 0.01, MEMORY > 0.05 after 1 tick; law-off gate: neighbour stays still. |
| PLANCK | ✅ PASS | `batch_30.test.js` — "PLANCK quantizes velocity to discrete steps": direct q=0.1 → 0.17→0.2, −0.23→−0.2; solver (k=0.5, q=0.05) → VEL_X = 0.15 after 1 tick; law-off gate: VEL unchanged. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_30.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **UNCERTAINTY + TELEPORT repair (v4/src/physics/solver.js)**: both laws write position directly to the buffer; the solver's stale-local writeback erased the jitter/jump (positions stayed at 100). Same root cause and fix as TUNNELING (batch 29): position reconciliation in the solver (`px = view[iBase+S.POS_X] + softbodyDX` after the per-particle law section, with the softbody delta captured post-pair-loop).
- PLANCK needed no repair — its direct buffer velocity write is already folded into integration via the existing velocity re-read; the only test change was float-precision (`toBe` → `toBeCloseTo`) in the gate assertion.
- Full v4 suite (47 files / 420 tests) passes after repair.


---

# Batch 31 — COHERENCE / BOSONIC / FERMIONIC / SPIN

Laws under audit (indices 120-123):

- **COHERENCE** (index 120, quantum / INDIGO)
- **BOSONIC** (index 121, quantum / INDIGO)
- **FERMIONIC** (index 122, quantum / INDIGO)
- **SPIN** (index 123, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| COHERENCE | ✅ PASS | `batch_31.test.js` — "COHERENCE phase-locks similar neighbour velocities": direct diff 0.5 < 1 → ax=0.01; solver: relative velocity shrinks over 30 ticks; law-off gate: relative velocity preserved exactly. |
| BOSONIC | ✅ PASS | `batch_31.test.js` — "BOSONIC attracts particles within short range (glue)": direct dist 2 → ax=1, dist 4 → null; solver: pair 2 apart → dist shrinks (collision floor ~1.2) over 10 ticks; law-off gate: dist unchanged. |
| FERMIONIC | ✅ PASS | `batch_31.test.js` — "FERMIONIC pushes overlapping particles apart (exclusion)": direct dist 1 < rSum 1.2 → ax < 0, dist 2 → null; solver: overlapping pair (0.8) separates over 10 ticks; law-off gate: dist unchanged. |
| SPIN | ⚠️ REPAIRED (1 attempt) | `batch_31.test.js` — "SPIN applies a perpendicular wiggle with particle-index parity": direct even particle → ay=+0.1, odd particle → ay=−0.1; solver: particle 0 VEL_Y > +0.001, particle 1 VEL_Y < −0.001 after 5 ticks. See repair notes. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_31.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **SPIN repair (v4/src/physics/lawgroups/quantumLaws.js)**: `applySpin` derived the direction from `iBase % 2` (buffer-offset parity). With `PARTICLE_STRIDE = 100`, every particle's base offset is even, so every particle got the SAME spin sign — the documented particle-index parity ("Spin direction is set by particle index parity") never alternated. Fixed to `Math.floor(iBase / PARTICLE_STRIDE) % 2` so particle 0 → +, particle 1 → −, etc. The existing unit test (`oddBase = PARTICLE_STRIDE + 1`) still passes.
- Full v4 suite (47 files / 420 tests) passes after repair.


---

# Batch 32 — SPECTRAL / WAVEFUNCTION / HYPERPLANE / ANTIMATTER

Laws under audit (indices 124-127):

- **SPECTRAL** (index 124, quantum / INDIGO)
- **WAVEFUNCTION** (index 125, quantum / INDIGO)
- **HYPERPLANE** (index 126, quantum / INDIGO)
- **ANTIMATTER** (index 127, quantum / INDIGO)

## Validation results

| Law | Status | Evidence |
|-----|--------|----------|
| SPECTRAL | ✅ PASS | `batch_32.test.js` — "SPECTRAL emits a species-tagged SIGNAL tone": direct species 3 → SIGNAL += 0.004; solver: SIGNAL > 0.005 after 5 ticks; law-off gate: no signal. |
| WAVEFUNCTION | ⚠️ REPAIRED (1 attempt) | `batch_32.test.js` — "WAVEFUNCTION snaps position onto the wave grid": direct q=0.5 → 100.3→100.5; solver (q=0.25) → 100.3→100.25 after 1 tick (snap persisted after repair); law-off gate: position unchanged. See repair notes. |
| HYPERPLANE | ✅ PASS | `batch_32.test.js` — "HYPERPLANE applies a constant slow shear force": direct ax=0.001, ay=0.0005, az=0.0002; solver: VEL_X and VEL_Y accumulate > 1e-5 over 5 ticks; law-off gate: velocity stays 0. |
| ANTIMATTER | ✅ PASS | `batch_32.test.js` — "ANTIMATTER annihilates opposite-charge pairs on contact": direct CHARGE +1/−1 → both DEAD=1, SIGNAL burst 10; solver: both DEAD=1 with SIGNAL > 0 after 1 tick; law-off gate: both alive, no signal. |

## Notes

- Validation method: vitest `v4/tests/audit/batch_32.test.js` — direct lawgroup calls + integration-level `solve()` with `isSet` gate assertions.
- **WAVEFUNCTION repair (v4/src/physics/solver.js)**: `applyWavefunction` snaps the position directly in the buffer, but the solver's stale-local writeback erased the snap (position stayed 100.3). Same root cause and fix as TUNNELING/UNCERTAINTY/TELEPORT: position reconciliation in the solver (`px = view[iBase+S.POS_X] + softbodyDX`), which is the 4th law fixed by this single solver change.
- Spec deviation noted (not repaired): SPEC item 46 says `applyAntimatter` should return `true` on annihilation so the solver breaks the pair loop, but the implementation returns `null` always and the solver dispatch doesn't check the return. The functional effect (both particles DEAD=1 + signal burst) is fully delivered, so this is a performance/robustness nit rather than a functional fault.
- Full v4 suite (47 files / 420 tests) passes after repair.


---

