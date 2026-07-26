# VEPA Law & Parameter Audit
**Version:** Committed (v2.1.0) — Worker STRIDE=64, 42 DNA params
**Date:** 2026-06-16

---

## PHASE 1: PHYSICS LAWS (9 laws)

### grav — Global Newtonian 1/r^2 Attraction
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-grav` → `laws.pure.grav` → `pure.grav` in worker
**Default:** ON
**Code (line 247):**
```
if (pure.grav) {
    const m1 = mass + (HIDDEN_MASS || 0);
    const m2 = oppMass + (oppHIDDEN_MASS || 0);
    forceMag = (G * m1 * m2 * FORCE * (affinity multiplier) * phenoMultiplier) / (d2 + 10.0);
}
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `FORCE (idx 0)` | Primary attraction multiplier. Scalar multiplied into force magnitude |
| `HIDDEN_MASS (idx 7)` | **NOT READ** — missing from worker |
| `SPECIES_AFFINITY (idx 41)` | Via `biol.affinity` law: same-species = 1+aff, different = 1-aff |
| `ALPHA (idx 5)` | Via `biol.phenotype`: `phenoMultiplier = 1.0 + ALPHA * 0.5` |
**Issues:**
- `HIDDEN_MASS` is defined in DNA_INDEXES and HELP_DB but is **never read** by the worker. The gravity calculation uses raw MASS only.
- `FORCE` DNA param reads from the **particle DNA cache**, not from `getDNA()` (species-level), so per-particle variation works but species-level defaults do not propagate to new particles correctly.

### drag — Fluid Motion Damping
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-drag` → `laws.pure.drag` → `pure.drag` in worker
**Default:** ON
**Code (line 377):**
```
const drag = pure.drag ? (1.0 - (FRICTION || 0.02)) : 1.0;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `FRICTION (idx 27)` | Velocity-dependent drag coefficient. 0 = no drag, 0.5 = high drag |
| `VISCOSITY (idx 1)` | Multiplied into total damping: `totalViscosity * drag` |
**Issues:** None. Correctly implemented.

### jitter — Brownian Motion / Entropy Injection
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-jitter` → `laws.pure.jitter` → `pure.jitter` in worker
**Default:** ON
**Code (line 200):**
```
const j = (entropy + JITTER) * 0.5;
ax += (Math.random()-0.5)*j;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `JITTER (idx 3)` | Added to world entropy, scaled by 0.5 for random force |
**Issues:** Naming mismatch: UI label says "ENTROPY" but the law key is `jitter`. The AGENTS.md references `entr` as entropy law, but this was renamed to `jitter` in the committed code.

### wrap — Toroidal Spatial Topology
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-wrap` → `laws.pure.wrap` → `pure.wrap` in worker
**Default:** ON
**Code (lines 233, 414):**
```
// Neighbor distance correction
if (pure.wrap) { dx -= W if dx > W/2, etc. }
// Position wrapping at end of loop
if (pure.wrap) { wrap position to ±W/2, ±H/2, ±D/2 }
```
**Affected DNA params:** None (purely topological)
**Issues:** The AGENTS.md describes wrap as a 4-state toggle (Periodic/Solid/Void/Sticky), but in the committed code it's a simple boolean on/off. The `boundaryType` world config parameter also handles boundary behavior but is **not read** by the worker (the worker only checks `pure.wrap`).

### coll — Physical Elastic Collisions
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-coll` → `laws.pure.coll` → `pure.coll` in worker
**Default:** ON
**Code (line 357):**
```
const imp = -(1.0 + ELASTICITY) * relV / (1/m1 + 1/m2);
// Apply impulse to both particles
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `ELASTICITY (idx 30)` | Bounce coefficient. 0 = inelastic, 1 = perfectly elastic |
**Issues:** Collision detection uses `r1 + r2` where `r = 1.0 + sqrt(mass)`. This does **not** use `BASE_RADIUS` or `RADIUS` from the particle stride, so all particles have the same size-mass relationship.

### accr — Mass Accretion (Fusion on Collision)
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-accr` → `laws.pure.accr` → `pure.accr` in worker
**Default:** ON
**Code (line 343):**
```
const addedMass = m2 * FUSION;
// Color blending: mix by mass ratio
particles[ptr].MASS += addedMass;
particles[oPtr].DEAD = 1;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `FUSION (idx 9)` | Fraction of opponent mass transferred on collision |
**Issues:** `FUSION_MOMENTUM` and `FUSION_TIME` DNA params are **never read**. The law always merges regardless of relative velocity or timing.

### planet — Planetary Gravity
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-planetary` → `laws.pure.planetary` → `pure.planetary` in worker
**Default:** OFF
**Code (lines 205, 406):**
```
ay += 0.2;  // Constant downward acceleration
// Floor collision at y = H/2
particles[ptr+1].POS_Y = H/2;
particles[ptr+1].VEL_Y *= -0.5;
```
**Affected DNA params:** None
**Issues:** Naming mismatch: Index.html uses `planetary` but AGENTS.md says `planet`.

### void — Linear Evaporative Decay
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-void` → `laws.pure.void` → `pure.void` in worker
**Default:** OFF
**Code (line 129):**
```
if (pure.void && mass > 1.0) {
    particles[ptr+6] -= 0.001 * localDt;
}
```
**Affected DNA params:** None (operates on MASS directly)
**Issues:** Implementation is trivial — constant mass drain on heavy particles. No DNA parameter influence.

### bond — Elastic Molecular Linking
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-bond` → `laws.pure.bond` → `pure.bond` in worker
**Default:** OFF
**Code (line 288):**
```
const targetD = (BASE_RADIUS || 5) * 2.5;
const stiffness = (STIFFNESS || 0.5) * 0.02;
const displacement = d - targetD;
const springForce = -stiffness * displacement;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `BASE_RADIUS (idx 29)` | Determines rest length of bond: `targetD = BASE_RADIUS * 2.5` |
| `STIFFNESS (idx 8)` | Spring constant for Hooke's law |
| `BOND_ANGLE (idx 31)` | Used for angular preference: `targetAngle = BOND_ANGLE * PI / 180` |
**Issues:** No per-particle bond registry — all nearby particles within range experience the spring force, not just bonded pairs. This is a field effect, not a discrete bond.

---

## PHASE 2: BIOLOGY LAWS (10 laws)

### life — Enables Metabolism & Death Logic
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-life` → `laws.biol.life` → `biol.life` in worker
**Default:** ON
**Code (line 89):**
```
const cost = (0.01 + MASS * 0.001) / ENERGY_EFFICIENCY;
ENERGY -= cost * dt;
AGE += dt;
if (ENERGY <= 0 || (senescence && random < deathRate * 0.001)) { DEAD = 1; }
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `ENERGY_EFFICIENCY (idx 34)` | Divides metabolic cost: higher = less energy used |
| `DEATH_RATE (idx 11)` | Death probability per frame (scaled by senescence) |
| `MASS (STRIDE_INDEXES.6)` | Metabolic cost scales with mass |
| `ENERGY (STRIDE_INDEXES.72)` | Tracked and consumed |
| `AGE (STRIDE_INDEXES.73)` | Incremented each frame |
**Issues:** None between life+senescence interaction.

### glow — Visual Signaling Pulses
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-glow` → `laws.biol.glow` → `biol.glow` in worker
**Default:** OFF
**Code (line 124):**
```
if (biol.glow) {
    const pulseRate = PULSE_RATE || 0;
    if (Math.random() < pulseRate * 0.01) {
        particles[ptr + STRIDE_INDEXES.SIGNAL] = Math.min(1.0, ...);
    }
}
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `PULSE_RATE (idx 14)` | Frequency of signal emission |
**Issues:** The `SIGNAL` field is set but there is **no visualization** of signal pulses in the draw() function. The signal value is stored but never rendered. `SIGNAL_STRENGTH`, `SIGNAL_DECAY`, and `PROPAGATION_SPEED` are **never read**.

### affinity — Species-Specific Attraction/Repulsion
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-affinity` → `laws.biol.affinity` → `biol.affinity` in worker
**Default:** OFF
**Code (line 248):**
```
const affinity = particles[ptr + DNA_OFFSETS.SPECIES_AFFINITY] || 0;
const sameSpecies = species_id == opp_species_id;
const multiplier = sameSpecies ? (1.0 + affinity) : (1.0 - affinity);
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `SPECIES_AFFINITY (idx 41)` | Bias: positive = same-species attraction, negative = different-species attraction |
**Issues:** The multiplier is applied within `pure.grav`'s force calculation, not as a separate force. If `pure.grav` is off, affinity has no effect.

### reproduction — Spontaneous Spawning
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-reproduction` → `laws.biol.reproduction` → `biol.reproduction` in worker
**Default:** ON
**Code (line 143):**
```
if (biol.reproduction && aliveCount < count && Math.random() < spawnRate * 0.01) {
    // Respawn a dead particle with random position, velocity, species_id
}
```
**Affected DNA params:** None (uses world `spawnRate` config, not DNA)
**Issues:** `BIRTH_RATE` and `FERTILITY` DNA params are **never read**. Reproduction uses fixed random species assignment. `SEX_CHANCE` is never read.

### tracking — Predator/Prey Vectors
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-tracking` → `laws.biol.tracking` → `biol.tracking` in worker
**Default:** OFF
**Code (line 271):**
```
if (biol.tracking) {
    const predBias = PREDATION_BIAS || 0;
    if (predBias > 0) {
        // Attraction toward lower-mass particles
        const massDiff = oppMass - mass;
        ax += dx/d * predBias * massDiff * 0.001 * phenoMultiplier;
    }
}
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `PREDATION_BIAS (idx 36)` | Strength of attraction toward different-mass particles |
**Issues:** Only attracts toward lower-mass particles (predation). Does **not** repel from higher-mass particles (no flee behavior). `TRACKING` in AGENTS.md describes full pursuit behavior which is not implemented.

### senescence — Aging-Related Decay
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-senescence` → `laws.biol.senescence` → `biol.senescence` in worker
**Default:** ON
**Code (line 96):**
```
const deathProb = biol.senescence ? deathRate : 0;
if (ENERGY <= 0 || Math.random() < deathProb * 0.001) { DEAD = 1; }
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `DEATH_RATE (idx 11)` | Scaled by 0.001 for per-frame death probability |
**Issues:** No `LIFESPAN` or `IMMUNITY` checks. Death is purely stochastic, not age-threshold-based.

### genotype — DNA Mutation
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-genotype` → `laws.biol.genotype` → `biol.genotype` in worker
**Default:** ON
**Code (line 103):**
```
const trait = Math.floor(Math.random() * 42);
particles[ptr + DNA_CACHE_START + trait] += (Math.random()-0.5) * 0.1;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `MUTATION (idx 12)` | Mutation rate — **NOT USED** despite being checked. The mutation probability is hardcoded to `0.001 * dt` |
**Issues:** `MUTATION` DNA param is **defined but never read**. The mutation probability is constant. Mutation directly modifies the particle DNA cache rather than the species-level DNA buffer, so mutations are not heritable.

### phenotype — Physical DNA Expression
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-phenotype` → `laws.biol.phenotype` → `biol.phenotype` in worker
**Default:** ON
**Code (line 243):**
```
phenoMultiplier = 1.0 + (ALPHA || 0.5) * 0.5;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `ALPHA (idx 5)` | Visual matter density, affects interaction range |
**Issues:** Only affects interaction range multiplier. Does **not** affect visual rendering (particles always render at size determined by `sqrt(MASS) * baseSize`).

### ener — Energy Conservation Tracking
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-ener` → `laws.biol.ener` → `biol.ener` in worker
**Default:** OFF
**Code (line 319):**
```
const diff = (myEnergy - oppEnergy) * 0.1;
myEnergy -= diff * localDt;
oppEnergy += diff * localDt;
```
**Affected DNA params:** None (operates on ENERGY stride field)
**Issues:** Simple energy diffusion between nearby particles. `CONDUCTIVITY` DNA param is **never read** — all particles transfer energy at the same rate (0.1).

### rad — High-Energy Radiation Grid
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-rad` → `laws.biol.rad` → `biol.rad` in worker
**Default:** OFF
**Code (lines 63, 109):**
```
// Decay radiation grid
radiationGrid[r] *= 0.95;
// Mass > 2.0 deposits radiation
radiationGrid[rIdx] += mass * 0.01;
// Mass < 1.0 takes damage from radiation
mass -= radiationGrid[rIdx] * 0.001 * dt;
```
**Affected DNA params:** None (uses grid-based radiation field)
**Issues:** `RADIOACTIVITY` DNA param is **never read**. All particles with MASS > 2.0 emit radiation equally.

---

## PHASE 3: CHEMISTRY LAWS (10 laws)

### cata — Catalysis
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-cata` → `laws.chem.cata` → `chem.cata` in worker
**Default:** OFF
**Code (line 312):**
```
const reactionScale = chem.cata ? (CATALYSIS || 1.0) : 1.0;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `CATALYSIS (idx 38)` | Speed multiplier for all chemistry reactions |
**Issues:** None. Used as a scalar multiplier for acid, redu, solv, etc.

### solv — Solvation (Mass Dissolution)
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-solv` → `laws.chem.solv` → `chem.solv` in worker
**Default:** OFF
**Code (line 257):**
```
if (chem.solv && mass > 5.0 && d < 100 * phenoMultiplier) {
    oppMass += 0.005 * localDt * reactionScale;
    mass -= 0.005 * localDt * reactionScale;
}
```
**Affected DNA params:** None (operates on MASS)
**Issues:** Dissolves heavy particles, transfers mass to lighter neighbors. Uses hardcoded mass threshold (5.0) and rate (0.005).

### acid — Acidity (Mass Degradation)
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-acid` → `laws.chem.acid` → `chem.acid` in worker
**Default:** OFF
**Code (line 316):**
```
if (chem.acid && d < 20) particles[oPtr + MASS] -= 0.005 * localDt * reactionScale;
```
**Affected DNA params:** None
**Issues:** Degrades opponent mass. No DNA parameter influence beyond catalysis scaling.

### oxid — Oxidation (Mass Loss)
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-oxid` → `laws.chem.oxid` → `chem.oxid` in worker
**Default:** OFF
**Code (line 137):**
```
if (chem.oxid && mass > 1.5) {
    mass -= 0.001 * localDt;
}
```
**Affected DNA params:** None
**Issues:** Trivial — constant mass drain on particles with MASS > 1.5.

### redu — Reduction (Mass Gain)
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-redu` → `laws.chem.redu` → `chem.redu` in worker
**Default:** OFF
**Code (line 317):**
```
if (chem.redu && d < 20) particles[ptr + MASS] += 0.005 * localDt * reactionScale;
```
**Affected DNA params:** None
**Issues:** Constant mass gain when near other particles. Complements `acid`.

### poly — Polymerization
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-poly` → `laws.chem.poly` → `chem.poly` in worker
**Default:** OFF
**Code (line 262):**
```
if (chem.poly && d < 25 * phenoMultiplier) {
    const stiff = (STIFFNESS || 0.5);
    // Spring-like force toward midpoint with rotation
    const polyRadius = 10 + stiff * 5;
    if (d > polyRadius) { /* pull together */ }
    if (d < polyRadius) { /* push apart */ }
    // Add rotation based on BOND_ANGLE
}
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `STIFFNESS (idx 8)` | Target distance and bond rigidity |
| `BOND_ANGLE (idx 31)` | Rotational alignment between particles |
**Issues:** Not a true polymerization — no chain tracking, no valence limits. It's a pairwise bond-like force between all nearby particles.

### isom — Isomerization
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-isom` → `laws.chem.isom` → `chem.isom` in worker
**Default:** OFF
**Code (line 133):**
```
if (chem.isom && Math.random() < MUTATION * 0.001 * dt) {
    // Random species ID shift
    particles[ptr + SPECIES_ID] = Math.floor(Math.random() * 12);
}
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `MUTATION (idx 12)` | Probability of species identity shift |
**Issues:** Randomly changes species ID. Uses MUTATION rate which was intended for genotype.

### chir — Chirality
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-chir` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `chem.chir` check exists in worker
**Affected DNA params:** None (unimplemented)
**Issues:** Toggle exists in UI but law has **zero effect** in the physics worker.

### crys — Crystallization
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-crys` → `laws.chem.crys` → `chem.crys` in worker
**Default:** OFF
**Code (line 302):**
```
if (chem.crys && d < 30 * phenoMultiplier) {
    // Strong velocity dampening toward zero
    particles[ptr+3] *= 0.9; particles[oPtr+3] *= 0.9;
    // Rotation toward 45-degree angle
}
```
**Affected DNA params:** None
**Issues:** Simple velocity dampening and rotation alignment. No true lattice formation.

### allo — Allotropy
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-allo` → `laws.chem.allo` → `chem.allo` in worker
**Default:** OFF
**Code (line 325):**
```
if (chem.allo && d < 10 && Math.random() < 0.01 * localDt) {
    SPECIES_ID = (SPECIES_ID + 1) % 12;
}
```
**Affected DNA params:** None
**Issues:** Random species cycling on close contact. No DNA parameter influence.

---

## PHASE 4: THERMODYNAMICS LAWS (10 laws)

### heat — Global Kinetic Energy Injection
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-heat` → `laws.thermo.heat` → `thermo.heat` in worker
**Default:** OFF
**Code (line 175):**
```
ax += (Math.random()-0.5) * 0.5;
```
**Affected DNA params:** None — adds random noise to all particles equally
**Issues:** Very mild effect (magnitude 0.5). No relation to `HEAT_OUTPUT` DNA param.

### cold — Global Velocity Dampening
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-cold` → `laws.thermo.cold` → `thermo.cold` in worker
**Default:** OFF
**Code (line 176):**
```
particles[ptr+3] *= 0.95;
```
**Affected DNA params:** None
**Issues:** Simple 5% velocity reduction per sub-step. Very aggressive — particles freeze nearly instantly.

### conv — Convection (Vertical Flow)
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-conv` → `laws.thermo.conv` → `thermo.conv` in worker
**Default:** OFF
**Code (line 195):**
```
const heatEffect = HEAT_OUTPUT || 0.1;
ay -= heatEffect * 0.1 * localDt;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `HEAT_OUTPUT (idx 39)` | Controls upward acceleration magnitude |
**Issues:** Only applies negative Y acceleration (upward). No full convection cycle (rising hot, falling cold).

### radi — Radiation
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-radi` → `laws.thermo.radi` → `thermo.radi` in worker
**Default:** OFF
**Code (line 177):**
```
particles[ptr + MASS] -= 0.001 * localDt;
```
**Affected DNA params:** None
**Issues:** Trivial — constant mass drain. No distance-based radiation, no inverse-square falloff.

### subl — Sublimation
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-subl` → `laws.thermo.subl` → `thermo.subl` in worker
**Default:** OFF
**Code (line 179):**
```
if (entropy + JITTER > 2.0) {
    MASS -= 0.005 * localDt;
    ENERGY += 0.01 * localDt;
}
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `JITTER (idx 3)` | Added to world entropy threshold check |
**Issues:** Threshold of 2.0 is high — only activates at world entropy > ~1.5 plus JITTER.

### melt — Melting
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-melt` → `laws.thermo.melt` → `thermo.melt` in worker
**Default:** OFF
**Code (line 184):**
```
const meltJitter = (ENERGY / 100) * 0.5;
ax += (Math.random()-0.5) * meltJitter;
```
**Affected DNA params:** None (uses ENERGY field)
**Issues:** Adds jitter proportional to energy. No phase transition, no state change.

### boil — Boiling
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-boil` → `laws.thermo.boil` → `thermo.boil` in worker
**Default:** OFF
**Code (line 189):**
```
if (ENERGY > 80) {
    ax += (Math.random()-0.5) * 2.0;  // Strong jitter
    MASS -= 0.01 * localDt;  // Mass loss
}
```
**Affected DNA params:** None (uses ENERGY threshold)
**Issues:** `REACTION_THRESHOLD` DNA param is **never read** — hardcoded to 80 energy.

### cond — Condensation
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-cond` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `thermo.cond` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

### depo — Deposition
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-depo` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `thermo.depo` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

### exop — Exothermic Reactions
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-exop` → `laws.thermo.exop` → `thermo.exop` in worker
**Default:** OFF
**Code (line 335):**
```
const heat = (HEAT_OUTPUT || 0.1) * 0.05 * reactionScale;
ax += (Math.random()-0.5) * heat;
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `HEAT_OUTPUT (idx 39)` | Magnitude of exothermic jitter |
| `CATALYSIS (idx 38)` | Scaled via `reactionScale` when chem.cata is on |
**Issues:** Very weak effect (0.05 scaling factor).

---

## PHASE 5: METAPHYSICS LAWS (12 laws)

### time — Time Dilation
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-time` → `laws.meta.time` → `meta.time` in worker
**Default:** OFF
**Code (line 170):**
```
const d2c = distance from origin;
localDt *= clamp(d2c / 200, 0.1, 1.0);
```
**Affected DNA params:** None (uses position distance)
**Issues:** Time slows down closer to origin. No DNA parameter influence. The effect is tied to world position, not particle properties.

### dime — Dimensional Phasing
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-dime` → `laws.meta.dime` → `meta.dime` in worker
**Default:** OFF
**Code (line 330):**
```
const symmetry = SYMMETRY || 0.5;
if (Math.random() < symmetry * 0.5) phaseThrough = true;
// When phasing, collisions and exothermic are skipped
```
**Affected DNA params:**
| Param | Usage |
|-------|-------|
| `SYMMETRY (idx 6)` | Probability of phasing through other particles |
**Issues:** Correctly implemented. Phase-through probability scales with SYMMETRY.

### chao — Chaos Factor
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-chao` → `laws.meta.chao` → `meta.chao` in worker
**Default:** OFF
**Code (line 207):**
```
if (Math.random() < 0.01) {
    ax += (Math.random()-0.5) * 5.0;
}
```
**Affected DNA params:** None
**Issues:** 1% chance per frame of a large random impulse. No DNA influence. Very disruptive.

### orde — Total Order
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-orde` → `laws.meta.orde` → `meta.orde` in worker
**Default:** OFF
**Code (line 385):**
```
particles[ptr+3] *= 0.99; // Velocity dampening each frame
```
**Affected DNA params:** None
**Issues:** Constant 1% velocity reduction per sub-step. No threshold, no DNA influence. Extremely aggressive — particles stop moving almost instantly.

### fate — Determinism (Fixed Trajectories)
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-fate` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `meta.fate` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

### will — Free Will (Vector Negation)
**Status:** ✅ IMPLEMENTED
**Toggle:** `syn-will` → `laws.meta.will` → `meta.will` in worker
**Default:** OFF
**Code (line 389):**
```
const energyNorm = min(1.0, ENERGY / 100);
const resistance = 1.0 - energyNorm * 0.2;
particles[ptr+3] *= resistance;
```
**Affected DNA params:** None (uses ENERGY field)
**Issues:** Higher energy = more velocity resistance. This is the opposite of what "free will" would suggest (high energy should enable more movement). The implementation causes energy to dampen velocity.

### soul — Identity Persistence
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-soul` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `meta.soul` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

### mind — Hive Mind
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-mind` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `meta.mind` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

### tele — Teleportation
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-tele` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `meta.tele` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

### clai — Clairvoyance
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-clai` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `meta.clai` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

### preo — Precognition
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-preo` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `meta.preo` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

### astr — Astral Projection
**Status:** ❌ NOT IMPLEMENTED
**Toggle:** `syn-astr` present ✅ in HTML
**Default:** OFF
**Code:** N/A — no `meta.astr` check exists in worker
**Issues:** Toggle exists but law has **zero effect**.

---

## SUMMARY: IMPLEMENTATION GAPS

### Unimplemented Laws (Toggle exists, no worker effect)
| Law | Category | Expected Effect |
|-----|----------|----------------|
| `chir` | Chemistry | Spin-based bonding compatibility |
| `cond` | Thermodynamics | Condensation in low-energy zones |
| `depo` | Thermodynamics | Gas-to-solid phase transition |
| `fate` | Metaphysics | Fixed trajectory locking |
| `soul` | Metaphysics | Identity persistence across death |
| `mind` | Metaphysics | Telepathic state synchronization |
| `tele` | Metaphysics | Instant relocation at boundaries |
| `clai` | Metaphysics | Collision avoidance |
| `preo` | Metaphysics | High-density evasion |
| `astr` | Metaphysics | Ghost form interactions |

### Unused DNA Parameters (Defined but never read by worker)
| Index | Param | Category | Intended Effect |
|-------|-------|----------|----------------|
| 4 | `POLARITY` | Charge | Attraction/repulsion |
| 7 | `HIDDEN_MASS` | Mass | Invisible gravity influence |
| 10 | `BIRTH_RATE` | Bio | Reproduction probability |
| 13 | `SIGNAL_RESP` | Comm | Signal sensitivity |
| 15 | `TIDAL` | Physics | Differential forces |
| 16 | `FUSION_MOMENTUM` | Bio | Min velocity for merging |
| 17 | `FUSION_TIME` | Bio | Temporal gate for merging |
| 18 | `NEIGHBORHOOD_RADIUS` | Comm | Interaction range |
| 19 | `SIGNAL_STRENGTH` | Comm | Pulse amplitude |
| 20 | `SIGNAL_DECAY` | Comm | Signal persistence |
| 21 | `PROPAGATION_SPEED` | Comm | Signal travel velocity |
| 22-25 | `TUNING_CH1-4` | Comm | Receptor channels |
| 26 | `INERTIA` | Physics | Acceleration resistance |
| 32 | `CONDUCTIVITY` | Chem | Energy transfer rate |
| 33 | `MAGNETIC_MOMENT` | Chem | Charge alignment |
| 35 | `SEX_CHANCE` | Bio | Multi-parent probability |
| 37 | `REACTION_THRESHOLD` | Chem | Phase change mass limit |
| 40 | `MEMORY_DECAY` | Comm | Memory persistence |
| 41 | `SPECIES_AFFINITY` | Bio | (used via aff law but not directly) |

### Naming Inconsistencies
| HTML/UI Label | Law Key | Worker Check | AGENTS.md Name |
|---------------|---------|--------------|----------------|
| ENTR (HELP_DB) | `jitter` | `pure.jitter` | entr |
| PLANET (HELP_DB) | `planetary` | `pure.planetary` | planet |

### Critical Issues Found
1. **10 of 53 laws have no effect** — UI toggles exist but worker never checks them
2. **21 of 42 DNA parameters have no effect** — defined in DNA_INDEXES, documented in HELP_DB, but never read by the worker
3. **SIGNAL field is set but never rendered** — glow law writes to SIGNAL but draw() ignores it
4. **genotype mutations are not heritable** — mutations modify particle DNA cache but not the species-level DNA buffer
5. **Reproduction ignores all DNA parameters** — BIRTH_RATE, FERTILITY, SEX_CHANCE are never read
6. **No collision size from BASE_RADIUS** — collision detection uses `1.0 + sqrt(MASS)` instead of per-particle RADIUS
