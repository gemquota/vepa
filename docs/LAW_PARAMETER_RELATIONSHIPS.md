# VEPA Law–Parameter Relationship Matrix

**Generated:** 2026-06-16  
**Audit Basis:** Committed v2.1.0 codebase (worker STRIDE=64, 42 DNA params)  
**Coverage:** 53 laws × 42 DNA parameters + world parameters — all cross-referenced

---

## TABLE OF CONTENTS

1. [Relationship Matrix Layout](#1-relationship-matrix-layout)
2. [Phase 1: Physics Laws (pure)](#2-phase-1-physics-laws-pure)
3. [Phase 2: Biology Laws (biol)](#3-phase-2-biology-laws-biol)
4. [Phase 3: Chemistry Laws (chem)](#4-phase-3-chemistry-laws-chem)
5. [Phase 4: Thermodynamics Laws (thermo)](#5-phase-4-thermodynamics-laws-thermo)
6. [Phase 5: Metaphysics Laws (meta)](#6-phase-5-metaphysics-laws-meta)
7. [DNA Parameter Master Index](#7-dna-parameter-master-index)
8. [World Parameter Cross-Reference](#8-world-parameter-cross-reference)
9. [Implementation Gap Summary](#9-implementation-gap-summary)
10. [Synergy System Map](#10-synergy-system-map)
11. [Critical Findings](#11-critical-findings)

---

## 1. Relationship Matrix Layout

Each law entry shows:

- **Toggle ID:** HTML/DOM toggle element ID
- **Law Key:** `laws.{category}.{key}` (as stored in engine state)
- **Default:** ON/OFF
- **Effect:** What the law does at the simulation level
- **Parameters Read:** Every DNA param, world param, and particle field the law touches
- **Code Location:** Exact line(s) in `src/worker/physics.worker.js`
- **Status:** ✅ Implemented | ⚠️ Partial | ❌ No worker effect
- **Issues:** Known bugs, missing features, or design concerns

### Legend

| Symbol | Meaning |
|--------|---------|
| `DNA:XXX` | DNA parameter (index from DNA_INDEXES) |
| `FIELD:XXX` | Particle stride field (from STRIDE_INDEXES) |
| `WORLD:XXX` | World configuration parameter |
| `LAW:XXX` | Another law this interacts with |
| `(unused)` | Parameter defined in DNA_INDEXES but never read by worker |
| `(stub)` | Law toggle exists in UI but has zero worker effect |

---

## 2. Phase 1: Physics Laws (pure)

### 2.1 grav — Global Gravity

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-grav` |
| **Law Key** | `laws.pure.grav` |
| **Default** | ON |
| **Status** | ✅ Implemented |
| **Worker Lines** | 247–258 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `WORLD:G` | `laws.pure.G` — gravitational constant (default 0.15) | Scales entire force magnitude |
| `FIELD:MASS` | Particle mass (stride offset 6) | `F = G * m1 * m2 * FORCE / d²` |
| `FIELD:SPECIES_ID` | Species index | Used for affinity comparison |
| `DNA:FORCE` (idx 0) | Primary attraction multiplier | Direct scalar on force magnitude |
| `DNA:SPECIES_AFFINITY` (idx 41) | Species bias, read via `biol.affinity` check | Modifies attraction: same-species = 1+aff, different = 1−aff |
| `DNA:ALPHA` (idx 5) | Phenotype multiplier (via `biol.phenotype`) | `phenoMultiplier = 1.0 + ALPHA * 0.5` |
| `LAW:affinity` | Whether species affinity affects gravity | Gates the `SPECIES_AFFINITY` multiplier |
| `LAW:phenotype` | Whether ALPHA modulates force | Gates the phenoMultiplier |

**Verification:**
- `F = (G * m1 * m2 * FORCE * affinityMult * phenoMult) / (d² + 10.0)` ✓
- `FORCE` from per-particle DNA cache ✓
- `SPECIES_AFFINITY` correctly gates on `affinity` law ✓
- Uses `d² + 10.0` softening (epsilon ≈ 3.16) to prevent singularities ✓

**Issues:**
- `DNA:HIDDEN_MASS` (idx 7) is **never read** — gravity uses raw `FIELD:MASS` only
- Species-level DNA (`getDNA()`) raw value not used: the worker reads per-particle `DNA_CACHE` which is initialized from `spec.dna[]` in `main.js` line 471

---

### 2.2 drag — Motion Damping

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-drag` |
| **Law Key** | `laws.pure.drag` |
| **Default** | ON |
| **Status** | ✅ Implemented |
| **Worker Lines** | 376–380 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:FRICTION` (idx 27) | Per-particle drag coefficient | `drag = 1.0 − FRICTION` (default 0.02 → drag=0.98) |
| `DNA:VISCOSITY` (idx 1) | Per-particle viscosity | Multiplied with world globalViscosity: `totalViscosity = VISCOSITY × globalViscosity` |
| `WORLD:globalViscosity` | Global viscosity multiplier | Scales all particles' velocity damping |

**Verification:**
```
velocity *= (drag) * totalViscosity
drag = pure.drag ? (1.0 − FRICTION) : 1.0
totalViscosity = VISCOSITY * globalViscosity
```
Both FRICTION and VISCOSITY correctly applied ✓

**Issues:** None found.

---

### 2.3 jitter (UI: ENTR) — Entropy/Brownian Motion

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-jitter` |
| **Law Key** | `laws.pure.jitter` |
| **Default** | ON |
| **Status** | ✅ Implemented |
| **Worker Lines** | 200–204 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `WORLD:entropy` | Global entropy level | `j = (entropy + JITTER) * 0.5` |
| `DNA:JITTER` (idx 3) | Per-particle Brownian noise | Added to world entropy before scaling |
| `LAW:thermo.subl` | Sublimation law | Reads the same `entropy + JITTER` sum for phase change |

**Verification:**
```
ax += (random−0.5) * (entropy + JITTER) * 0.5
```
Random vector added to acceleration each frame ✓

**Issues:**
- Naming inconsistency: law key is `jitter` but AGENTS.md and HELP_DB call it `entr` (ENTROPY)
- The `pure.jitter` boolean gates this law, but the entropy + JITTER calculation also applies when `subl` is on (line 183): `thermo.subl && (entropy + JITTER) > 2.0` — this reads JITTER even when jitter law is OFF

---

### 2.4 wrap — Spatial Topology

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-wrap` |
| **Law Key** | `laws.pure.wrap` |
| **Default** | ON |
| **Status** | ✅ Implemented |
| **Worker Lines** | 233–236 (neighbor wrapping), 414–417 (position wrapping) |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `WORLD:dimX` | World width | Wrapping threshold at ±W/2 |
| `WORLD:dimY` | World height | Wrapping threshold at ±H/2 |
| `WORLD:dimZ` | World depth | Wrapping threshold at ±D/2 |

**Effect:** Two wrapping modes:
1. **Neighbor distance correction** (lines 233–236): When computing distances between particles, if `wrap` is on, corrects for toroidal topology
2. **Position wrapping** (lines 414–417): After position update, wraps particles back into the world bounds

**Issues:**
- AGENTS.md describes wrap as a **4-state toggle** (Periodic/Solid/Void/Sticky) but it's implemented as binary on/off
- The `worldConfig.boundaryType` config parameter is **never read** by the worker
- No non-wrapping boundary enforcement exists (particles can escape if wrap is off)

---

### 2.5 coll — Physical Collisions

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-coll` |
| **Law Key** | `laws.pure.coll` |
| **Default** | ON |
| **Status** | ✅ Implemented |
| **Worker Lines** | 357–365 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:ELASTICITY` (idx 30) | Bounce coefficient | `impulse = −(1.0 + ELASTICITY) * relV / (1/m1 + 1/m2)` |
| `FIELD:MASS` | Mass for impulse calculation | `impulse / mass` determines velocity change |
| `FIELD:VEL_X/Y/Z` | Relative velocity | Normal component determines impulse magnitude |

**Verification:**
```
impulse = −(1.0 + ELASTICITY) * relativeVelocity / (1/mass1 + 1/mass2)
```
Standard elastic collision with coefficient of restitution ✓
ELASTICITY=0 → perfectly inelastic; ELASTICITY=1 → perfectly elastic ✓

**Issues:**
- Collision detection radius uses `1.0 + sqrt(MASS)`, **not** `DNA:BASE_RADIUS` (idx 29) or `FIELD:RADIUS` (stride idx 80)
- No size/shape variation from DNA parameters — all particles have the same mass→radius relationship
- `DNA:BASE_RADIUS` is defined and documented but never used in collision detection

---

### 2.6 accr — Mass Accretion (Fusion)

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-accr` |
| **Law Key** | `laws.pure.accr` |
| **Default** | ON |
| **Status** | ✅ Implemented |
| **Worker Lines** | 343–355 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:FUSION` (idx 9) | Fraction of mass transferred | `addedMass = m2 * FUSION` |
| `FIELD:MASS` | Both particles' masses | Acceptor gains mass, donor dies |
| `FIELD:COLOR_R/G/B` | Color blending | Weighted blend by mass ratio |
| `LAW:coll` | Collision check | Only triggers when `!pure.coll || d < r1+r2` |

**Verification:**
```
addedMass = m2 * FUSION
MASS += addedMass
COLOR += (otherColor − COLOR) * ratio
doener.DEAD = 1
```
FUSION correctly controls what fraction of mass is absorbed ✓

**Issues:**
- `DNA:FUSION_MOMENTUM` (idx 16) is **never read** — no velocity threshold for fusion
- `DNA:FUSION_TIME` (idx 17) is **never read** — fusion is instantaneous on contact
- Accretion always succeeds on collision regardless of relative velocity

---

### 2.7 planetary — Planetary Mode

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-planetary` |
| **Law Key** | `laws.pure.planetary` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 205 (gravity), 406–410 (floor) |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `WORLD:dimY` | World height | Floor at Y = H/2 |
| `FIELD:POS_Y` | Vertical position | Clamped to floor |
| `FIELD:VEL_Y` | Vertical velocity | Reversed with −0.5 coefficient on floor contact |

**Effect:**
1. Constant downward acceleration: `ay += 0.2` (line 205)
2. Floor collision: if `POS_Y > H/2`, clamp to H/2 and reverse velocity (line 406–410)

**Issues:**
- Naming mismatch: law key is `planetary`, AGENTS.md says `planet`
- No varying gravity strength (always `0.2`)
- No per-particle gravity influence

---

### 2.8 void — Vacuum Evaporation

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-void` |
| **Law Key** | `laws.pure.void` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 131–133 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:MASS` | Particle mass | Only particles with mass > 1.0 decay |
| (implicit dt) | Time step | `mass −= 0.002 * dt` per frame |

**Effect:** Linear evaporative decay: particles with mass > 1.0 lose 0.002 * dt mass per frame.

**Issues:** None found, but the effect is minimal (0.002 mass/frame).

---

### 2.9 bond — Molecular Bonding

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-bond` |
| **Law Key** | `laws.pure.bond` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 299–310 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:SPECIES_AFFINITY` (idx 41) | Determines bond compatibility | Same species + affinity ≥ 0, or different + affinity < 0 |
| `DNA:BASE_RADIUS` (idx 29) | Target bond distance | `targetD = BASE_RADIUS * 2.5` |
| `DNA:STIFFNESS` (idx 8) | Spring constant | `k = STIFFNESS * 0.15` |
| `FIELD:SPECIES_ID` | Species comparison | Determines if same-species bonding applies |
| `LAW:phenotype` | Scales interaction range | `d < 60 * phenoMultiplier` |
| `LAW:affinity` | Species affinity check | Controls which affinity sign bonds attract |

**Verification:**
```
stretch = d − (BASE_RADIUS * 2.5)
force = stretch * (STIFFNESS * 0.15)
```
Harmonic spring force toward equilibrium distance ✓

**Issues:**
- `FIELD:BOND_COUNT` and `FIELD:BOND_PARTNER_1-6` stride slots (86–93) are **never written** — no actual valence tracking exists
- `DNA:BOND_ANGLE` (idx 31) is defined for polymer geometry but not used here
- Bonding is purely instantaneous force-based (no persistent links)

---

## 3. Phase 2: Biology Laws (biol)

### 3.1 life — Biological Lifecycle

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-life` |
| **Law Key** | `laws.biol.life` |
| **Default** | ON |
| **Status** | ✅ Implemented |
| **Worker Lines** | 103–117 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:ENERGY_EFFICIENCY` (idx 34) | Energy consumption rate | `cost = (0.01 + MASS * 0.001) / ENERGY_EFFICIENCY` |
| `DNA:DEATH_RATE` (idx 11) | Spontaneous death probability | Death when `senescence` is ON: `deathProb = DEATH_RATE` |
| `FIELD:MASS` | Metabolic cost scaling | Heavier particles cost more energy |
| `FIELD:ENERGY` | Internal energy | Depleted each frame; death at ≤ 0 |
| `FIELD:AGE` | Frame count | Incremented each frame |
| `LAW:senescence` | Enables age-related death | Gates DEATH_RATE probability |

**Verification:**
```
cost = (0.01 + MASS * 0.001) / ENERGY_EFFICIENCY
ENERGY −= cost * dt
deathProb = senescence ? DEATH_RATE : 0
death if ENERGY ≤ 0 or random < deathProb * 0.001 * dt
```
ENERGY_EFFICIENCY correctly modulates metabolic cost ✓
DEATH_RATE correctly gates senescence death ✓

**Issues:**
- `DNA:BIRTH_RATE` (idx 10) is **never read** — birth is controlled solely by `spawnRate` world param
- Death probability multiplier of `0.001 * dt` makes senescence extremely slow (0.1% per frame at DEATH_RATE=1)

---

### 3.2 glow — Bioluminescent Signaling

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-glow` |
| **Law Key** | `laws.biol.glow` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 126–129 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:PULSE_RATE` (idx 14) | Oscillation frequency | `pulse = sin(frame * PULSE_RATE)`; energy modulated by pulse * 0.1 |
| `FIELD:SIGNAL` | Stride slot 79 | Written but also read in rendering? |

**Verification:**
```
pulse = sin(frame * PULSE_RATE)
ENERGY += pulse * 0.1 * dt
```

**Issues:**
- `FIELD:SIGNAL` (stride idx 79) is **never explicitly written** by glow; glow writes to ENERGY, not SIGNAL
- `DNA:SIGNAL_STRENGTH` (idx 19), `DNA:SIGNAL_DECAY` (idx 20), `DNA:PROPAGATION_SPEED` (idx 21) are all **unused**
- The four TUNING channel DNA params are **unused**
- `DNA:SIGNAL_RESP` is **unused** — no other particle responds to signals

---

### 3.3 affinity — Species Affinity

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-affinity` |
| **Law Key** | `laws.biol.affinity` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 249–254 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:SPECIES_AFFINITY` (idx 41) | Attraction/repulsion bias | > 0: same-species attract, different repulse; < 0: opposite |
| `FIELD:SPECIES_ID` | Species comparison | Determines same-species multiplier |

**Effect:** Modifies gravity force: `multiplier = sameSpecies ? (1.0 + affinity) : (1.0 − affinity)`. When `affinity` is OFF, `multiplier` stays at 1.0.

**Issues:** None found. Implementation is clean.

---

### 3.4 reproduction — Particle Spawning

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-reproduction` |
| **Law Key** | `laws.biol.reproduction` |
| **Default** | ON |
| **Status** | ⚠️ Partial |
| **Worker Lines** | 145–164 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `WORLD:spawnRate` | Spawn frequency | `spawnRate * 0.01 * dt` chance per frame |
| `FIELD:DEAD` | Spawns into dead particle slots | Reuses dead indices |

**What it does:** Reuses dead particle slots. New particles get fixed defaults (mass=1.0, energy=100.0, random species 0-11). No DNA is inherited from parents.

**Issues:**
- `DNA:BIRTH_RATE` (idx 10) is **never read** — spawn rate is purely from world config
- `DNA:SEX_CHANCE` (idx 35) is **never read** — no multi-parent recombination exists
- `DNA:MUTATION` (idx 12) is **never read** — offspring get random species, not mutated parent DNA
- Spawned particles do NOT inherit DNA: they get random species IDs with no DNA cache initialization

---

### 3.5 tracking — Predator/Prey Behavior

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-tracking` |
| **Law Key** | `laws.biol.tracking` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 273–284 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:PREDATION_BIAS` (idx 36) | Predatory attraction strength | `trackForce = PREDATION_BIAS * 0.1 * preyMass / d` |
| `DNA:JITTER` (idx 3) | Flee randomness | `fleeForce = JITTER * 0.2 / d` (when fleeing from larger particle) |
| `FIELD:MASS` | Mass comparison | If target mass is smaller → pursuit; if larger → flee |
| `FIELD:POS_X/Y/Z` | Distance calculation | Spherical distance for force direction |

**Verification:**
```
if massDiff > 0.5:  // Predator (larger)
    trackForce = PREDATION_BIAS * 0.1 * preyMass / d
if massDiff < −0.5:  // Prey (smaller)
    fleeForce = JITTER * 0.2 / d
```
Correct pursuit/flee behavior based on mass ✓
PREDATION_BIAS correctly scales predatory attraction ✓

**Issues:** None found. Behavior matches AGENTS.md specification.

---

### 3.6 senescence — Death by Age

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-senescence` |
| **Law Key** | `laws.biol.senescence` |
| **Default** | ON |
| **Status** | ✅ Implemented (gated by `life`) |
| **Worker Lines** | 112–117 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:DEATH_RATE` (idx 11) | Per-frame death probability | Applied when `senescence && life` |

**Effect:** Multiplies `DEATH_RATE` into the death probability. When `senescence` is OFF, death probability = 0 (only energy depletion kills).

**Issues:** Only effective when `life` law is also ON (nested inside `if (biol.life)` block).

---

### 3.7 genotype — DNA Mutation/Drift

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-genotype` |
| **Law Key** | `laws.biol.genotype` |
| **Default** | ON |
| **Status** | ⚠️ Partial |
| **Worker Lines** | 119–123 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params read | `trait = random(0, 42)` — uniform random trait selection |

**Effect:** 0.1% chance per frame to mutate a random DNA cache entry by ±0.05.

**Issues:**
- `DNA:MUTATION` (idx 12) is **never read** — mutation strength is fixed at 0.1
- Mutations modify the **per-particle DNA cache**, not the **species-level DNA buffer** — mutations are not heritable
- Reproduction does NOT inherit mutated DNA from parents

---

### 3.8 phenotype — Modifier Expression

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-phenotype` |
| **Law Key** | `laws.biol.phenotype` |
| **Default** | ON |
| **Status** | ✅ Implemented |
| **Worker Lines** | 245, 263, 267, 299, 313, 318, 335, etc. |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:ALPHA` (idx 5) | Phenotype expression strength | `phenoMultiplier = 1.0 + ALPHA * 0.5` |

**Effect:** Scales interaction ranges and force magnitudes for gravity, solvation, polymerization, bonding, crystallization, exothermic reactions. When `phenotype` is OFF, `phenoMultiplier` is always 1.0.

**Issues:** None found. Correctly gates across multiple chemistry and physics laws.

---

### 3.9 ener — Energy Transfer

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-ener` |
| **Law Key** | `laws.biol.ener` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 321–323 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:ENERGY` | Both particles' energy | Equilibrates toward average: `diff = (e1 − e2) * 0.1` |

**Effect:** Both particles' energy converges toward each other at a rate of 10% of the difference per frame.

**Issues:**
- Ionic/charge-based energy transfer using `DNA:CONDUCTIVITY` or `DNA:MAGNETIC_MOMENT` is **not implemented** — transfer is uniform regardless of particle traits
- `DNA:CONDUCTIVITY` (idx 32) is **never read**
- `DNA:MAGNETIC_MOMENT` (idx 33) is **never read**

---

### 3.10 rad — Radiation Emission

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-rad` |
| **Law Key** | `laws.biol.rad` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 74–77 (decay), 109–124 (emission) |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:MASS` | Emission threshold | Mass > 2.0 emits radiation: `radiationGrid += (MASS − 2.0) * 0.1` |
| `FIELD:ENERGY` | Radiation damage | Grid value > 1.0 damages: `ENERGY −= (grid − 1.0) * 0.5` |
| `WORLD:dimX/Y/Z` | Grid coordinate mapping | Maps particle position to RAD_RES³ grid |

**Effect:** A 16×16×16 radiation grid accumulates emission from heavy particles and damages energy of nearby particles. Grid decays by 5% per frame.

**Issues:** None found. Clean implementation using a separate radiation overlay grid.

---

## 4. Phase 3: Chemistry Laws (chem)

### 4.1 cata — Catalysis

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-cata` |
| **Law Key** | `laws.chem.cata` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 315–317 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:CATALYSIS` (idx 38) | Reaction speed multiplier | `reactionScale = 1.0 + CATALYSIS * 0.1` |

**Effect:** Scale factor applied to `acid` and `redu` chemistry reaction rates. When `cata` is OFF, `reactionScale = 1.0`.

**Issues:** None. Correctly gated and parameterized.

---

### 4.2 solv — Solvation

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-solv` |
| **Law Key** | `laws.chem.solv` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 260–263 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:MASS` | Solvation trigger | Only if mass > 5.0 |
| `DNA:ALPHA` (idx 5) | Range via phenotype | Range = 100 * phenoMultiplier |

**Effect:** Weak repulsive force (0.5/d) from particles with mass > 5.0, acting as a "dissolving" field.

**Issues:** Force magnitude is constant (0.5/d) — no per-particle solvation strength parameter.

---

### 4.3 acid — Acidic Corrosion

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-acid` |
| **Law Key** | `laws.chem.acid` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 319 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params | Constant rate: mass −= 0.005 * dt * reactionScale |
| `LAW:cata` | Reaction scaling | Multiplied by reactionScale |

**Effect:** Proximity-based mass reduction (d < 20). Opponent particle loses mass at 0.005 per frame.

**Issues:**
- `DNA:REACTION_THRESHOLD` (idx 37) is **never read** — no mass limit for reaction to activate
- No per-particle acidity parameter

---

### 4.4 oxid — Oxidation

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-oxid` |
| **Law Key** | `laws.chem.oxid` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 135–137 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:MASS` | Oxidation trigger | Only if mass > 1.5 |

**Effect:** Self-damage: mass > 1.5 particles lose 0.05 energy per frame by oxidation.

**Issues:** Energy cost is constant — no per-particle oxidation sensitivity.

---

### 4.5 redu — Reduction

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-redu` |
| **Law Key** | `laws.chem.redu` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 320 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params | Constant rate: mass += 0.005 * dt * reactionScale |

**Effect:** Proximity-based mass gain (d < 20). Self-particle gains mass at 0.005 per frame.

**Issues:** No per-particle reduction efficiency parameter.

---

### 4.6 poly — Polymerization

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-poly` |
| **Law Key** | `laws.chem.poly` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 265–272 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:BOND_ANGLE` (idx 31) | Preferred alignment angle | `alignment = |cos(currentAngle − BOND_ANGLE)|` |
| `DNA:ALPHA` (idx 5) | Range via phenotype | Range = 25 * phenoMultiplier |

**Effect:** Attractive force aligned along `BOND_ANGLE` direction, creating chain-like polymer structures.

**Verification:**
```
alignment = |cos(currentAngle − BOND_ANGLE)|
polyForce = 2.0 * alignment
```
Correctly creates chains along preferred angle ✓

**Issues:**
- `FIELD:CHAIN_LENGTH` (stride idx 87) is **never written** — no chain tracking
- `FIELD:BOND_COUNT` (stride idx 86) is **never written**
- Polymerization is purely a force field, not persistent links

---

### 4.7 isom — Isomerization

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-isom` |
| **Law Key** | `laws.chem.isom` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 133–134 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:MUTATION` (idx 12) | Isomerization probability | `prob = MUTATION * 0.01 * dt` |

**Effect:** Random species change: particle switches to a random species (0-11) when isomerization triggers.

**Verification:**
```
random < MUTATION * 0.01 * dt  // chance per frame
SPECIES_ID = random(0, 11)
```
MUTATION correctly scales probability ✓

**Issues:** Species range is hardcoded 0-11 instead of using MAX_SPECIES.

---

### 4.8 chir — Chirality

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-chir` |
| **Law Key** | `laws.chem.chir` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `chem.chir` is **never checked** in the worker. No implementation exists.

---

### 4.9 crys — Crystallization

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-crys` |
| **Law Key** | `laws.chem.crys` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 312–318 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:BOND_ANGLE` (idx 31) | Crystal lattice angle | `diff = BOND_ANGLE − currentAngle` |
| `FIELD:MASS` | Opponent mass scaling | `crysForce = sin(diff) * 0.05 * oMass` |

**Effect:** Aligns particles toward a fixed angle relative to each other, creating crystal lattice geometry.

**Verification:**
```
diff = targetAngle − currentAngle
force = sin(diff) * 0.05 * oMass
```
Correctly rotates particles into alignment ✓

**Issues:** None found. Uses BOND_ANGLE correctly.

---

### 4.10 allo — Allotropy

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-allo` |
| **Law Key** | `laws.chem.allo` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 324–326 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params | 1% chance per frame to cycle species: `species_id = (species_id + 1) % 12` |

**Effect:** Close proximity (d < 10) causes random species transitions between crystalline allotropes.

**Issues:** No DNA parameter controls allotropy rate — hardcoded 1%.

---

## 5. Phase 4: Thermodynamics Laws (thermo)

### 5.1 heat — Thermal Jitter

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-heat` |
| **Law Key** | `laws.thermo.heat` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 195 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params | Random acceleration: `±0.5` on each axis |

**Effect:** Adds uniform random noise to acceleration (+ thermal energy).

**Issues:**
- `DNA:HEAT_OUTPUT` (idx 39) is **never read** — no per-particle heat contribution
- Heat is spatially uniform (same magnitude everywhere)

---

### 5.2 cold — Cold Damping

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-cold` |
| **Law Key** | `laws.thermo.cold` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 196 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params | Multiplicative damping: `velocity *= 0.95` each frame |

**Effect:** Reduces all velocity components by 5% per frame.

**Issues:** Cold is uniform — no per-particle thermal conductivity or cold resistance.

---

### 5.3 conv — Convection

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-conv` |
| **Law Key** | `laws.thermo.conv` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 197–199 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:HEAT_OUTPUT` (idx 39) | Convective buoyancy | `ay −= HEAT_OUTPUT * 0.1 * localDt` |

**Effect:** Vertical force (upward) proportional to particle's HEAT_OUTPUT, simulating thermal buoyancy.

**Verification:**
```
ay −= HEAT_OUTPUT * 0.1 * localDt
```
HEAT_OUTPUT correctly scales vertical lift ✓

**Issues:** Convection always pushes upward (no cold downdrafts).

---

### 5.4 radi — Thermal Radiation Mass Loss

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-radi` |
| **Law Key** | `laws.thermo.radi` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 197 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params | `mass −= 0.001 * localDt` |

**Effect:** All particles lose mass at a constant rate via thermal radiation.

**Issues:** Uniform loss rate — no per-particle emissivity parameter.

---

### 5.5 subl — Sublimation

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-subl` |
| **Law Key** | `laws.thermo.subl` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 183–185 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:JITTER` (idx 3) | Entropy contribution | `entropy + JITTER > 2.0` triggers sublimation |
| `WORLD:entropy` | Global entropy | Combined with JITTER for threshold check |

**Effect:** When local entropy exceeds threshold (2.0), mass converts to energy: `mass −= 0.005; energy += 0.01`.

**Issues:**
- Threshold (2.0) is always the same — no sublimation temperature parameter
- Reads JITTER from `DNA_OFFSETS.JITTER` (line 183) but particle's JITTER value never changes

---

### 5.6 melt — Melting (Viscosity Reduction)

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-melt` |
| **Law Key** | `laws.thermo.melt` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 187–189 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:ENERGY` | Melting energy | `meltJitter = (ENERGY / 100) * 0.5` |

**Effect:** Higher energy → more random acceleration (like melting into a fluid state).

**Verification:**
```
meltJitter = (ENERGY / 100) * 0.5
ax += (random−0.5) * meltJitter
```
ENERGY correctly scales the melt jitter ✓

**Issues:** None found.

---

### 5.7 boil — Boiling (Vaporization)

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-boil` |
| **Law Key** | `laws.thermo.boil` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 191–194 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:ENERGY` | Boiling threshold | Energy > 80 triggers boiling |
| (none) | No DNA params | `mass −= 0.01; jitter = 2.0` |

**Effect:** Particles with energy > 80 experience strong random acceleration (jitter=2.0) and mass loss.

**Issues:** Hardcoded threshold (80) — no per-particle boiling point parameter.

---

### 5.8 cond — Condensation

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-cond` |
| **Law Key** | `laws.thermo.cond` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `thermo.cond` is **never checked** in the worker.

---

### 5.9 depo — Deposition

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-depo` |
| **Law Key** | `laws.thermo.depo` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `thermo.depo` is **never checked** in the worker.

---

### 5.10 exop — Exothermic Reactions

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-exop` |
| **Law Key** | `laws.thermo.exop` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 335–337 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:HEAT_OUTPUT` (idx 39) | Exothermic energy release | `heat = HEAT_OUTPUT * 0.05 * reactionScale` |
| `LAW:cata` | Reaction scaling | Multiplied by reactionScale |
| `LAW:dime` | Phase-through gate | If `dime` AND symmetry check passes, exothermic is skipped |

**Effect:** Close proximity (d < 25) generates random acceleration proportional to HEAT_OUTPUT.

**Verification:**
```
heat = HEAT_OUTPUT * 0.05 * reactionScale
ax += (random−0.5) * heat
```
HEAT_OUTPUT correctly scales reaction energy ✓

**Issues:** None found.

---

## 6. Phase 5: Metaphysics Laws (meta)

### 6.1 time — Time Dilation

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-time` |
| **Law Key** | `laws.meta.time` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 188–192 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:POS_X/Y/Z` | Distance from center | `d2c = sqrt(x² + y² + z²)`; `localDt *= max(0.1, min(1.0, d2c / 200))` |

**Effect:** Particles closer to center experience slower time (reduced localDt), simulating gravitational time dilation.

**Verification:**
```
d2c = distance from center (0,0,0)
localDt *= clamp(d2c / 200, 0.1, 1.0)
```
✓ Particles at center (d2c ≈ 0) get `localDt *= 0.1` (90% slowdown)
✓ Particles far from center get normal time

**Issues:** No per-particle time dilation sensitivity parameter.

---

### 6.2 dime — Dimensional Phase-Through

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-dime` |
| **Law Key** | `laws.meta.dime` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 328–332 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `DNA:SYMMETRY` (idx 6) | Phase-through probability | `random < SYMMETRY * 0.5` → phaseThrough = true |
| `FIELD:SPECIES_ID` | Species | (SYMMETRY per-species via DNA) |

**Effect:** Particles can phase through each other (skip collision/accretion checks) with probability based on SYMMETRY.

**Verification:**
```
if meta.dime:
    phaseThrough = random < SYMMETRY * 0.5
```
SYMMETRY correctly scales phasing probability ✓

**Issues:** None found.

---

### 6.3 chao — Chaos Injection

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-chao` |
| **Law Key** | `laws.meta.chao` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 207–209 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params | 1% chance per frame: `random force ±5.0 on all axes` |

**Effect:** Occasional (1%) random large force injections (±5.0) creating chaotic trajectory changes.

**Issues:** No per-particle chaos sensitivity parameter.

---

### 6.4 orde — Total Order Damping

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-orde` |
| **Law Key** | `laws.meta.orde` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 383–385 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| (none) | No DNA params | `velocity *= 0.99` every frame |

**Effect:** Strong uniform velocity damping, forcing the system toward static equilibrium.

**Issues:** None found.

---

### 6.5 fate — Determinism

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-fate` |
| **Law Key** | `laws.meta.fate` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `meta.fate` is **never checked** in the worker.

---

### 6.6 will — Free Will (Velocity Resistance)

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-will` |
| **Law Key** | `laws.meta.will` |
| **Default** | OFF |
| **Status** | ✅ Implemented |
| **Worker Lines** | 387–391 |

**Parameters Read:**

| Parameter | Role | Impact |
|-----------|------|--------|
| `FIELD:ENERGY` | Willpower fuel | `resistance = 1.0 − min(ENERGY/100, 1.0) * 0.2` |

**Effect:** Energy-dependent velocity damping: more energy = more velocity reduction (counter-intuitive).

**Issues:** The implementation is **semantically inverted**: "free will" should increase with energy, but here higher energy causes MORE damping (less free movement). The formula causes high-energy particles to slow down more.

---

### 6.7 soul — Soul Persistence

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-soul` |
| **Law Key** | `laws.meta.soul` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `meta.soul` is **never checked** in the worker.

---

### 6.8 mind — Hive Mind

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-mind` |
| **Law Key** | `laws.meta.mind` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `meta.mind` is **never checked** in the worker.

---

### 6.9 tele — Teleportation

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-tele` |
| **Law Key** | `laws.meta.tele` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `meta.tele` is **never checked** in the worker.

---

### 6.10 clai — Clairvoyance

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-clai` |
| **Law Key** | `laws.meta.clai` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `meta.clai` is **never checked** in the worker.

---

### 6.11 preo — Precognition

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-preo` |
| **Law Key** | `laws.meta.preo` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `meta.preo` is **never checked** in the worker.

---

### 6.12 astr — Astral Projection

| Property | Value |
|----------|-------|
| **Toggle ID** | `syn-astr` |
| **Law Key** | `laws.meta.astr` |
| **Default** | OFF |
| **Status** | ❌ No worker effect |

**Parameters Read:** None

**Issues:** Toggle exists in UI but `meta.astr` is **never checked** in the worker.

---

## 7. DNA Parameter Master Index

Every DNA parameter indexed by its DNA_INDEXES position, showing which laws read it and its overall usage status.

### 7.1 USED DNA Parameters (21 of 42)

| Index | Name | Read By Laws | Read Count |
|-------|------|-------------|------------|
| 0 | `FORCE` | `grav` | 1 |
| 1 | `VISCOSITY` | `drag` | 1 |
| 2 | `TORQUE` | (direct physics — not law-gated) | 2 |
| 3 | `JITTER` | `jitter`, `subl`, `tracking` (flee) | 3 |
| 5 | `ALPHA` | `grav` (via `phenotype`), `solv`, `poly`, `bond`, `crys`, `exop` | 2+ |
| 6 | `SYMMETRY` | `dime` | 1 |
| 8 | `STIFFNESS` | `bond` | 1 |
| 9 | `FUSION` | `accr` | 1 |
| 11 | `DEATH_RATE` | `life` (via `senescence`) | 1 |
| 12 | `MUTATION` | `isom`, `genotype` (implicit) | 2 |
| 14 | `PULSE_RATE` | `glow` | 1 |
| 27 | `FRICTION` | `drag` | 1 |
| 28 | `MAX_VELOCITY` | (direct physics — velocity clamp) | 1 |
| 29 | `BASE_RADIUS` | `bond` | 1 |
| 30 | `ELASTICITY` | `coll` | 1 |
| 31 | `BOND_ANGLE` | `poly`, `crys` | 2 |
| 34 | `ENERGY_EFFICIENCY` | `life` | 1 |
| 36 | `PREDATION_BIAS` | `tracking` | 1 |
| 38 | `CATALYSIS` | `cata` | 1 |
| 39 | `HEAT_OUTPUT` | `conv`, `exop` | 2 |
| 41 | `SPECIES_AFFINITY` | `grav` (via `affinity`), `bond` | 2 |

### 7.2 UNUSED DNA Parameters (21 of 42)

| Index | Name | Category | Intended Role |
|-------|------|----------|--------------|
| 4 | `POLARITY` | Electromagnetism | Charge-based attraction/repulsion |
| 7 | `HIDDEN_MASS` | Matter | Invisible mass for gravity calculations |
| 10 | `BIRTH_RATE` | Biology | Per-species reproduction probability |
| 13 | `SIGNAL_RESP` | Communication | Sensitivity to neighbor pulses |
| 15 | `TIDAL` | Physics | Differential stretching forces |
| 16 | `FUSION_MOMENTUM` | Matter | Minimum collision velocity for accretion |
| 17 | `FUSION_TIME` | Matter | Contact duration required for fusion |
| 18 | `NEIGHBORHOOD_RADIUS` | Communication | Per-particle interaction range |
| 19 | `SIGNAL_STRENGTH` | Communication | Pulse amplitude |
| 20 | `SIGNAL_DECAY` | Communication | Signal persistence length |
| 21 | `PROPAGATION_SPEED` | Communication | Signal travel velocity |
| 22 | `TUNING_CH1` | Communication | Receptor filter channel 1 |
| 23 | `TUNING_CH2` | Communication | Receptor filter channel 2 |
| 24 | `TUNING_CH3` | Communication | Receptor filter channel 3 |
| 25 | `TUNING_CH4` | Communication | Receptor filter channel 4 |
| 26 | `INERTIA` | Physics | Acceleration resistance |
| 32 | `CONDUCTIVITY` | Chemistry | Charge/energy transfer rate |
| 33 | `MAGNETIC_MOMENT` | Chemistry | Neighbor charge alignment |
| 35 | `SEX_CHANCE` | Biology | Multi-parent reproduction |
| 37 | `REACTION_THRESHOLD` | Chemistry | Mass limit for phase change |
| 40 | `MEMORY_DECAY` | Communication | Internal state persistence |

---

## 8. World Parameter Cross-Reference

World parameters (`this.worldConfig`) and which laws depend on them:

| World Param | Default | Read By Laws | Role |
|-------------|---------|-------------|------|
| `count` | 1000 | (buffer allocation, not law-gated) | Particle count |
| `dimX` | 500 | `wrap`, `rad` | World dimensions |
| `dimY` | 500 | `wrap`, `rad`, `planetary` | World dimensions + floor height |
| `dimZ` | 500 | `wrap`, `rad` | World dimensions |
| `entropy` | 0.1 | `jitter`, `subl` | Global noise level |
| `spawnRate` | 10 | `reproduction` | New particle spawn frequency |
| `spreadX/Y/Z` | 1.0 | Initial placement (not law-gated) | Initial distribution spread |
| `baseSize` | 1.0 | (unused in worker) | Base particle size |
| `globalViscosity` | 0.98 | `drag` | Global velocity damping |
| `wind` | 0.0 | (unused in worker) | Global wind force |
| `shape` | 0.5 | (unused in worker) | Cluster shape bias |
| `groundHeight` | 0.9 | (unused in worker) | Ground plane |
| `cameraMode` | 'panning' | (UI only) | Camera control mode |
| `cameraLocked` | false | (UI only) | Camera lock |

**Law-level numeric parameters:**
| Param | Default | Read By | Role |
|-------|---------|---------|------|
| `laws.pure.G` | 0.15 | `grav` | Gravitational constant |
| `laws.pure.dt` | 1.0 | All laws (via `totalDt`) | Global time step |

---

## 9. Implementation Gap Summary

### 9.1 Laws With No Worker Effect (10)

| Law | Category | UI Toggle | Worker Check |
|-----|----------|-----------|-------------|
| `chir` | Chemistry | `syn-chir` ✅ | ❌ Never checked |
| `cond` | Thermodynamics | `syn-cond` ✅ | ❌ Never checked |
| `depo` | Thermodynamics | `syn-depo` ✅ | ❌ Never checked |
| `fate` | Metaphysics | `syn-fate` ✅ | ❌ Never checked |
| `soul` | Metaphysics | `syn-soul` ✅ | ❌ Never checked |
| `mind` | Metaphysics | `syn-mind` ✅ | ❌ Never checked |
| `tele` | Metaphysics | `syn-tele` ✅ | ❌ Never checked |
| `clai` | Metaphysics | `syn-clai` ✅ | ❌ Never checked |
| `preo` | Metaphysics | `syn-preo` ✅ | ❌ Never checked |
| `astr` | Metaphysics | `syn-astr` ✅ | ❌ Never checked |

### 9.2 Laws With Significant Gaps (5)

| Law | Gap |
|-----|-----|
| `reproduction` | BIRTH_RATE, SEX_CHANCE, MUTATION not read; no DNA inheritance |
| `genotype` | MUTATION not read; mutations not heritable (only per-particle DNA cache) |
| `accr` | FUSION_MOMENTUM, FUSION_TIME not read |
| `glow` | SIGNAL_STRENGTH, SIGNAL_DECAY, PROPAGATION_SPEED not read |
| `ener` | CONDUCTIVITY, MAGNETIC_MOMENT not read |

### 9.3 DNA Parameters Never Read (21)

All in section 7.2 above. The largest category is **Communication** (8 params: SIGNAL_RESP, SIGNAL_STRENGTH, SIGNAL_DECAY, PROPAGATION_SPEED, TUNING_CH1-4, MEMORY_DECAY).

---

## 10. Synergy System Map

The synergy system (`computeSynergyBonus()` referenced in AGENTS.md) produces emergent bonus/penalty effects when specific law pairs are active:

| Synergy | Effect | Currently Implemented? |
|---------|--------|----------------------|
| `MIND + ENER` | −2.0 (hive mind energy drain) | ❌ (MIND unimplemented) |
| `GRAV + TIME` | −1.5 (relativistic pull slowdown) | ⚠️ (both laws exist but no synergy coupling) |
| `ENTR + CRYS` | −1.0 (entropy fights crystallization) | ⚠️ (both laws exist but no synergy coupling) |
| `COLL + RAD` | −0.5 (collisions in radiation lose energy) | ⚠️ (both laws exist but no synergy coupling) |
| `RAD + GENO` | −1.0 (radiation damages genotype stability) | ⚠️ (both laws exist but no synergy coupling) |
| `POLY + MIND` | −2.0 (polymerized hivemind overhead) | ❌ (MIND unimplemented) |
| `ASTR + SOUL` | −1.5 (astral soul projection cost) | ❌ (both unimplemented) |

**Note:** The synergy system is **documented** in AGENTS.md but **not implemented** in `physics.worker.js`. The function `getSynergyBonus()` does not exist in the current committed code. Synergies exist only in the Codex documentation and `scripts/build_codex.js` data.

---

## 11. Critical Findings

### 11.1 Base Gravity Law (grav) Verification

The foundational law of the simulation is **fully functional**:

```
F = (G × m₁ × m₂ × FORCE × affinityMult × phenoMult) / (d² + 10.0)
```

- Inverse-square with softening (ε² = 10.0) ✓
- Cross-species affinity gating ✓
- Mass product in numerator ✓
- Phenotype expression scaling ✓
- Spatial grid optimization with toroidal correction ✓

**Issues:**
- `HIDDEN_MASS` (invisible mass) is ignored — all gravity uses visible `FIELD:MASS`
- `FORCE` DNA parameter CAN become negative, creating repulsion (potential feature, not bug)

### 11.2 Most Critical Gaps

1. **10 laws have zero effect** — user can toggle them but nothing happens
2. **21 DNA params are dead code** — defined, documented, slotted, but never read
3. **Reproduction system ignores all genetics** — spawns random-species particles with no DNA inheritance
4. **Mutation system doesn't propagate** — genotype modifies per-particle cache, not species DNA
5. **No signal network exists** — 8 communication DNA params (SIGNAL*, TUNING*) are completely unused
6. **No synergy calculations** — the documented synergy bonuses/penalties are not computed
7. **No persistent bonding** — BOND_COUNT, BOND_PARTNER_n, CHAIN_LENGTH stride slots are allocated but never written

### 11.3 Naming Issues

| Expected Name | Actual Name | Location |
|---------------|-------------|----------|
| `entr` (ENTROPY) | `jitter` | Law key and HELP_DB |
| `planet` | `planetary` | Law key |

### 11.4 Stride Slot Allocation Status

| Stride Index | Field | Written By Worker | Used By Worker |
|--------------|-------|-------------------|----------------|
| 0–2 | POS_X/Y/Z | ✓ | ✓ |
| 3–5 | VEL_X/Y/Z | ✓ | ✓ |
| 6 | MASS | ✓ | ✓ |
| 7 | SPECIES_ID | ✓ | ✓ |
| 8–49 | DNA_CACHE[0..41] | ✓ (via restartSim) | 21 of 42 read |
| 50 | ENERGY | ✓ | ✓ |
| 51 | AGE | ✓ | ✓ |
| 52 | DEAD | ✓ | ✓ |
| 53–55 | COLOR_R/G/B | ✓ | ✓ |
| 56–63 | **UNMAPPED** | ❌ | ❌ |

**Note:** Despite `STRIDE = 64`, only indices 0–55 have named mappings. Slots 56–63 are allocated but completely unused.

---

## APPENDIX: How to Read the Law State Flow

```
User clicks toggle → ui.js: `window.toggleLaw(key)` 
  → main.js: `engine.toggleLaw(k)` 
    → flips `this.laws.{category}[k]` boolean
    → calls `syncUI(this.laws)` for UI update
    → next frame: `worker.postMessage({ ..., config: { laws: this.laws, ... } })`
      → worker: `const { laws } = config; const pure = laws.pure || {}; ...`
        → law-specific code: `if (pure.grav) { ... }`
```

All 53 law toggles flow through this exact pipeline. The 10 unimplemented laws simply have no `if (xxx.xxx)` block in the worker.
