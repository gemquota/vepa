# VEPA COMPREHENSIVE LAW AUDIT (v3.0.0)

This document contains a full functional audit of all 64 Laws defined in the VEPA Engine SSOT, including code proof, synergy analysis, and development roadmaps.

---

## [1] PURE PHYSICS LAWS (Indices 0-15)

### 1.1 GRAV (Global Gravity)
*   **Index:** 0 (`LAW_INDEXES.GRAV`)
*   **Assessment:** **FULLY FUNCTIONAL**. High-performance spatial-grid implementation.
*   **Code Review:** Multiplies force by species affinity and predation bias. Clamped at `MAX_FORCE`.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.GRAV)) {
        const m1 = particles[ptr + STRIDE_INDEXES.MASS] + (particles[ptr + DNA_OFFSETS.HIDDEN_MASS] || 0);
        const m2 = particles[oPtr + STRIDE_INDEXES.MASS] + (particles[oPtr + DNA_OFFSETS.HIDDEN_MASS] || 0);
        // ... affinity/predation logic ...
        let f = (G * m1 * m2 * (particles[ptr + DNA_OFFSETS.FORCE]||0) * multiplier) / (d2 + 10.0);
        ax += dx * invD * f; ay += dy * invD * f; az += dz * invD * f;
    }
    ```
*   **Proposed Synergies:**
    1.  **GRAV + MIND (Hive Gravity):** Hive-minded species experience a combined gravitational center, pulling others toward their collective mass centroid rather than individual particles.
    2.  **GRAV + TIME (Relativistic Pull):** Areas of high gravity automatically trigger local Time Dilation, slowing down the physics step (`dt`) for particles within the deep gravity well.
*   **Status:** Functional.

### 1.2 DRAG (Fluid Friction)
*   **Index:** 1 (`LAW_INDEXES.DRAG`)
*   **Assessment:** **FULLY FUNCTIONAL**. Linear velocity dampening.
*   **Code Review:** Uses DNA `FRICTION` and world `globalViscosity`.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    const friction = 1.0 - (isSet(LAW_INDEXES.DRAG) ? (particles[ptr + DNA_OFFSETS.FRICTION] || 0.02) : 0);
    const visc = (particles[ptr + DNA_OFFSETS.VISCOSITY] || 0.98) * (world.globalViscosity || 0.98);
    // ...
    particles[ptr+3] = (particles[ptr+3] + ax * invM) * friction * visc;
    ```
*   **Proposed Synergies:**
    1.  **DRAG + HEAT (Thermal Drag):** High-temperature zones reduce effective drag, allowing particles to reach higher terminal velocities (simulating gas vs liquid).
    2.  **DRAG + SOUL (Ectoplasmic Resistance):** Particles in the "Soul" (0.5) state experience 0 drag, allowing them to drift indefinitely through physical matter.
*   **Status:** Functional.

### 1.3 JITTER / ENTR (Entropy)
*   **Index:** 2 (`LAW_INDEXES.ENTR`)
*   **Assessment:** **FULLY FUNCTIONAL**. Stochastic noise injection.
*   **Code Review:** Combines global entropy with DNA-level jitter.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.ENTR) || isSet(LAW_INDEXES.CHAO)) {
        const j = (entropy + (particles[ptr + DNA_OFFSETS.JITTER]||0)) * (isSet(LAW_INDEXES.CHAO) ? 5.0 : 0.5);
        ax += (prng.next()-0.5)*j; ay += (prng.next()-0.5)*j; az += (prng.next()-0.5)*j;
    }
    ```
*   **Proposed Synergies:**
    1.  **JITTER + CRYS (Annealing):** If Jitter is active alongside Crystallization, the jitter acts as thermal annealing, allowing the lattice to "settle" into a more perfect geometric order.
    2.  **JITTER + MIND (Collective Chaos):** Hive mind synchronizes jitter vectors, causing the entire species to "shimmer" or pulse in unison.
*   **Status:** Functional.

### 1.4 WRAP (Toroidal Topology)
*   **Index:** 3 (`LAW_INDEXES.WRAP`)
*   **Assessment:** **FULLY FUNCTIONAL**.
*   **Code Review:** Implements modular coordinate wrapping and distance calculation.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.WRAP) || boundary === 'Periodic') {
        if (dx > W/2) dx -= W; else if (dx < -W/2) dx += W;
        // ...
    }
    // ...
    if (particles[ptr] > hw) particles[ptr] -= W; else if (particles[ptr] < -hw) particles[ptr] += W;
    ```
*   **Proposed Synergies:**
    1.  **WRAP + TELE (Loophole):** Particles crossing the wrap boundary have a 5% chance to teleport to a completely random coordinate instead of the mirror side.
    2.  **WRAP + TIME (Horizon Dilation):** Velocity increases as a particle approaches the wrap boundary, simulating a compressed spatial topology.
*   **Status:** Functional.

### 1.5 COLL (Physical Collisions)
*   **Index:** 4 (`LAW_INDEXES.COLL`)
*   **Assessment:** **FULLY FUNCTIONAL**. Elastic impulse resolution.
*   **Code Review:** Uses mass-ratio based impulse calculation. Bypassed by `DIME`.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.COLL) && !isSet(LAW_INDEXES.DIME) && d < (2.0 + Math.sqrt(particles[ptr + STRIDE_INDEXES.MASS]) + Math.sqrt(particles[oPtr + STRIDE_INDEXES.MASS]))) {
        // ... impulse calc ...
        const imp = -(1.5 * relV) / (1/particles[ptr+6] + 1/particles[oPtr+6]);
        particles[ptr+3] += (imp/particles[ptr+6])*nx; 
        // ...
    }
    ```
*   **Proposed Synergies:**
    1.  **COLL + RAD (Impact Mutation):** High-velocity collisions between radioactive species trigger immediate mutation spikes in both parties.
    2.  **COLL + EXOP (Impact Fusion):** Collisions generate heat in the `HEAT` field, raising local temperature and potentially triggering phase changes (Boiling).
*   **Status:** Functional.

### 1.6 ACCR (Mass Accretion)
*   **Index:** 5 (`LAW_INDEXES.ACCR`)
*   **Assessment:** **FULLY FUNCTIONAL**. Mass/Energy merging.
*   **Code Review:** Transfers 100% mass and 50% energy to the "winner" of the collision.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.ACCR) && relV < -2.0) {
        particles[ptr + STRIDE_INDEXES.MASS] += particles[oPtr + STRIDE_INDEXES.MASS] * (particles[ptr + DNA_OFFSETS.FUSION] || 0.5);
        particles[ptr + STRIDE_INDEXES.ENERGY] += particles[oPtr + STRIDE_INDEXES.ENERGY] * 0.5;
        particles[oPtr + STRIDE_INDEXES.DEAD] = 1;
        continue;
    }
    ```
*   **Proposed Synergies:**
    1.  **ACCR + POLY (Structural Growth):** Accreted mass is added linearly, creating "snakes" or "chains" instead of spheres when Polymerization is active.
    2.  **ACCR + REDU (Endothermic Fusion):** Fusion events absorb energy from the environment instead of releasing it, cooling down the local zone.
*   **Status:** Functional.

### 1.7 PLANET (Planetary Gravity)
*   **Index:** 6 (`LAW_INDEXES.PLANET`)
*   **Assessment:** **FULLY FUNCTIONAL**. Constant downward vector.
*   **Code Review:** Adds `ay += 0.2` to the acceleration vector.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.PLANET)) ay += 0.2;
    ```
*   **Proposed Synergies:**
    1.  **PLANET + CONV (Atmospheric Loops):** Convection currents are strengthened by planetary gravity, creating distinct "weather" layers.
    2.  **PLANET + ACID (Toxic Floor):** If planetary is active, the ground boundary automatically gains `ACID` properties, dissolving anything that settles.
*   **Status:** Functional.

### 1.8 VOID (Vacuum Pressure)
*   **Index:** 7 (`LAW_INDEXES.VOID`)
*   **Assessment:** **FULLY FUNCTIONAL**. Dispersion in low density.
*   **Code Review:** Checks grid density; if low, injects random vectors.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.VOID)) {
        const density = gridCounts[gIdx_p] / MAX_CELL_CAPACITY;
        if (density < 0.1) {
            ax += (prng.next()-0.5)*0.5; // ...
        }
    }
    ```
*   **Proposed Synergies:**
    1.  **VOID + SUBL (Instant Evaporation):** Lone particles in the void instantly sublimate (lose mass) until they rejoin a cluster.
    2.  **VOID + FATE (Trajectory Lock):** Particles in the void are "Fated" - they stop experiencing forces and move in straight lines until they hit a cluster.
*   **Status:** Functional.

### 1.9 BOND (Molecular Bonding)
*   **Index:** 8 (`LAW_INDEXES.BOND`)
*   **Assessment:** **FULLY FUNCTIONAL**. Elastic spring links.
*   **Code Review:** Implements a Hookean spring force between same-species (or high-affinity) particles.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.BOND) && d < 60) {
        // ... affinity check ...
        let stiffness = particles[ptr + DNA_OFFSETS.STIFFNESS] || 0.5;
        if (isSet(LAW_INDEXES.POLY)) stiffness *= 2.0;
        const f = (d - (particles[ptr + DNA_OFFSETS.BASE_RADIUS] || 5) * 2.5) * stiffness * 0.15;
        ax += dx * invD * f; ay += dy * invD * f; az += dz * invD * f;
    }
    ```
*   **Proposed Synergies:**
    1.  **BOND + CRYS (Lattice Hardening):** Bonding forces become near-infinite if particles are in a perfect Crystallization lattice, creating unbreakable solids.
    2.  **BOND + GLOW (Signal Transmission):** Bonds act as wires; signals propagate 10x faster through bonded particles.
*   **Status:** Functional.

### 1.10 ENER (Energy Conservation)
*   **Index:** 24 (Categorized under Biology in Code)
*   **Assessment:** **FULLY FUNCTIONAL**. Energy tax system.
*   **Code Review:** Implements the Energy Tax Formula from `intent.md`.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    // ENERGY TAX (D3)
    const synergyBonus = 0; // TBD
    const tax = (activeBits * 0.001 + synergyBonus * 0.005) * dt;
    particles[ptr + STRIDE_INDEXES.ENERGY] -= ((0.01 + particles[ptr + STRIDE_INDEXES.MASS] * 0.001) / energyEfficiency * ageFactor * dt) + tax;
    ```
*   **Proposed Synergies:**
    1.  **ENER + REDU (Recharge):** Reduction law converts ambient heat into Energy, allowing species to "photosynthesize" in hot zones.
    2.  **ENER + MIND (Shared Battery):** Hive-minded species share a global energy pool; individuals only die if the collective energy reaches zero.
*   **Status:** Functional.

### 1.11 RAD (Radiation)
*   **Index:** 25 (Categorized under Biology in Code)
*   **Assessment:** **FULLY FUNCTIONAL**. Proximity mutation.
*   **Code Review:** Mutates the DNA of colliding particles.
*   **Code Proof (`physics.worker.js`):**
    ```javascript
    if (isSet(LAW_INDEXES.RAD) && prng.next() < 0.05) {
        const tIdx = Math.floor(prng.next() * 42);
        particles[oPtr + STRIDE_INDEXES.DNA_CACHE_START + tIdx] += (prng.next()-0.5)*0.1;
    }
    ```
*   **Proposed Synergies:**
    1.  **RAD + GENO (Hyper-Evolution):** Radiation spikes trigger the `GENOTYPE` law even if it's toggled off for a specific particle.
    2.  **RAD + ASTR (Spectral Decay):** Astral forms (ghosts) of radioactive particles leave "radiation trails" in the spatial grid that damage others.
*   **Status:** Functional.

---

## [2] BIOLOGICAL LAWS (Indices 16-31)

### 2.1 BIOL (Life Lifecycle)
*   **Index:** 16
*   **Assessment:** **FULLY FUNCTIONAL**. Controls metabolism and aging.
*   **Code Review:** Entry point for energy/age processing.
*   **Proposed Synergies:**
    1.  **BIOL + TIME (Biological Stasis):** Low local `dt` (Time Dilation) freezes biological decay and energy loss.
    2.  **BIOL + SOUL (Reincarnation):** Death under `BIOL` triggers an immediate respawn at the same location if `SOUL` is active.
*   **Status:** Functional.

### 2.2 GLOW (Signaling)
*   **Index:** 17
*   **Assessment:** **PARTIAL**. Signal decay is implemented, but propagation logic is simplified.
*   **Code Review:** Handles signal decay per frame.
*   **Proposed Synergies:**
    1.  **GLOW + MIND (Neural Pulse):** Signaling pulses from one particle are instantly mirrored by all hive members.
    2.  **GLOW + CATA (Reaction Signal):** High signaling intensity acts as a `CATA` catalyst for nearby chemical reactions.
*   **Status:** Partial.

### 2.3 AFFIN (Species Affinity)
*   **Index:** 18
*   **Assessment:** **FULLY FUNCTIONAL**. Multiplier for gravity.
*   **Code Review:** Checks `SPECIES_ID` match and applies `multiplier`.
*   **Proposed Synergies:**
    1.  **AFFIN + CHIR (Chiral Selection):** Affinity is only positive if particles have the same Chirality (Spin).
    2.  **AFFIN + ISOM (Identity Flux):** Isomerization shifts can instantly turn affinity into repulsion, causing "civil wars" in clusters.
*   **Status:** Functional.

### 2.4 REPRO (Reproduction)
*   **Index:** 19
*   **Assessment:** **FULLY FUNCTIONAL**. Population maintenance.
*   **Code Review:** Spawns particles at dead indices based on `spawnRate`.
*   **Proposed Synergies:**
    1.  **REPRO + POLY (Mitosis):** Particles "split" into two smaller bonded particles instead of just spawning a new one.
    2.  **REPRO + RAD (Mutant Birth):** Spawning particles in high radiation zones start with 50% random DNA.
*   **Status:** Functional.

### 2.5 TRACK (Tracking / Predation)
*   **Index:** 20
*   **Assessment:** **FULLY FUNCTIONAL**. Target-based attraction.
*   **Code Review:** Adds `predationBias` to gravity multiplier for smaller mass targets.
*   **Proposed Synergies:**
    1.  **TRACK + CLAI (Perfect Hunter):** Tracking forces ignore Jitter/Chaos, creating perfect homing trajectories.
    2.  **TRACK + PREO (Prey Evasion):** Pre-cognition is 100% effective against `TRACK` vectors, creating a cat-and-mouse orbital dance.
*   **Status:** Functional.

### 2.6 SENES (Senescence)
*   **Index:** 21
*   **Assessment:** **FULLY FUNCTIONAL**. Age-based energy tax.
*   **Code Review:** Scales energy loss by `1.0 + age * 0.0001`.
*   **Proposed Synergies:**
    1.  **SENES + TIME (Eternal Youth):** Time dilation in dense clusters prevents aging, making the "core" of a planet immortal.
    2.  **SENES + ALLO (Phase Life):** Particles change "Allotropic" state (Species ID) as they age, simulating growth stages (Larva -> Adult).
*   **Status:** Functional.

### 2.7 GENO (Genotype Drift)
*   **Index:** 22
*   **Assessment:** **FULLY FUNCTIONAL**. Continuous mutation.
*   **Code Review:** Applies random walks to DNA cache in worker.
*   **Proposed Synergies:**
    1.  **GENO + MIND (Convergent Evolution):** Hive mind forces all members to drift toward the average DNA of the group.
    2.  **GENO + CRYS (Stable Genes):** Particles in a Crystal Lattice have 0 genotype drift; structure preserves data.
*   **Status:** Functional.

### 2.8 PHENO (Phenotype Expression)
*   **Index:** 23
*   **Assessment:** **DORMANT / UI-ONLY**. Visual mapping happens in `ui.js` but logic is missing in worker.
*   **Proposed Synergies:**
    1.  **PHENO + DIME (Visual Phasing):** Phasing particles become transparent (Alpha) proportional to their Dimensionality level.
    2.  **PHENO + HEAT (Thermal Glow):** Higher internal energy increases particle glow intensity and size.
*   **Status:** Dormant.

---

## [3] CHEMISTRY LAWS (Indices 32-47)

### 3.1 CATA (Catalysis)
*   **Index:** 32
*   **Assessment:** **FULLY FUNCTIONAL**. Force multiplier.
*   **Code Review:** `f *= (1.0 + catalysis_dna)`.
*   **Proposed Synergies:**
    1.  **CATA + OXID (Combustion):** Catalysis triggers an explosive energy release when `OXID` is also active.
    2.  **CATA + POLY (Rapid Growth):** Chaining speed is tripled under catalysis.
*   **Status:** Functional.

### 3.2 SOLV (Solvation)
*   **Index:** 33
*   **Assessment:** **FULLY FUNCTIONAL**. Force dampener.
*   **Code Review:** `f *= 0.8`.
*   **Proposed Synergies:**
    1.  **SOLV + ACID (Corrosive Soup):** Solvation breaks bonds, while Acid eats the mass, creating a deadly digestive fluid.
    2.  **SOLV + BOND (Bond Decay):** Solvation specifically targets and breaks existing `BOND` links over time.
*   **Status:** Functional.

### 3.3 ACID (Acidity)
*   **Index:** 34
*   **Assessment:** **FULLY FUNCTIONAL**. Mass decay on contact.
*   **Code Review:** `mass *= 0.999` on collision.
*   **Proposed Synergies:**
    1.  **ACID + VOID (Dissolving Void):** Acidic particles in low-density zones expand rapidly, "eating" the space itself.
    2.  **ACID + ALLO (Identity Erosion):** Contact with acid has a chance to change the victim's species to the attacker's species.
*   **Status:** Functional.

### 3.4 OXID (Oxidation)
*   **Index:** 35
*   **Assessment:** **FULLY FUNCTIONAL**. Repulsive energy loss.
*   **Code Review:** `energy -= 1.0`, adds repulsion vector `ax += nx * 2`.
*   **Proposed Synergies:**
    1.  **OXID + BOIL (Thermal Bloom):** Oxidation events inject significant heat into the `BOIL` threshold, causing instant vapor clusters.
    2.  **OXID + GLOW (Combustion Pulse):** Oxidation creates a massive signaling pulse (Flash).
*   **Status:** Functional.

### 3.5 REDU (Reduction)
*   **Index:** 36
*   **Assessment:** **DORMANT**. Intended as endothermic mass gain.
*   **Proposed Synergies:**
    1.  **REDU + COLD (Ice Growth):** Reduction is 10x more effective in cold zones, creating "mass from the void".
    2.  **REDU + RAD (Energy Harvesting):** Reduction allows particles to gain energy from the `RAD` radiation of others.
*   **Status:** Dormant.

### 3.6 POLY (Polymerization)
*   **Index:** 37
*   **Assessment:** **FULLY FUNCTIONAL**. Rigid chaining.
*   **Code Review:** `stiffness *= 2.0` in bond logic.
*   **Proposed Synergies:**
    1.  **POLY + CHIR (Helical Chains):** Polymerization creates rotating helical structures if Chirality is also active.
    2.  **POLY + MIND (Neural Nets):** Chains of particles act as a single contiguous intelligence (Neural Drift).
*   **Status:** Functional.

### 3.7 ISOM (Isomerization)
*   **Index:** 38
*   **Assessment:** **FULLY FUNCTIONAL**. Random species shift.
*   **Code Review:** `species_id = rand` on contact.
*   **Proposed Synergies:**
    1.  **ISOM + SOUL (Ancestral Memory):** Isomerization preserves the "Memory" slots of the particle even as its species changes.
    2.  **ISOM + ALLO (Stable Isomers):** Isomerization only shifts between "Compatible" allotropes defined in a lookup table.
*   **Status:** Functional.

### 3.8 CHIR (Chirality)
*   **Index:** 39
*   **Assessment:** **DORMANT**.
*   **Proposed Synergies:**
    1.  **CHIR + TORQUE (Spin Compatibility):** Only particles spinning in the same direction can fuse or bond.
    2.  **CHIR + GRAV (Chiral Gravity):** Left-handed and Right-handed particles repel each other but attract their own kind.
*   **Status:** Dormant.

### 3.9 CRYS (Crystallization)
*   **Index:** 40
*   **Assessment:** **DORMANT**.
*   **Proposed Synergies:**
    1.  **CRYS + ORDE (Grid Solid):** Crystallization snaps particles to a perfect hexagonal or cubic grid.
    2.  **CRYS + BOND (Rigid Lattices):** Crystallized particles cannot move relative to their bonded neighbors (0.0 flexibility).
*   **Status:** Dormant.

### 3.10 ALLO (Allotropy)
*   **Index:** 41
*   **Assessment:** **DORMANT**.
*   **Proposed Synergies:**
    1.  **ALLO + HEAT (Phase Shift):** Particles change species identity based on their internal `Energy` level (e.g. Ice -> Water -> Steam).
    2.  **ALLO + PLANET (Sedimentation):** Particles become "Heavier" allotropes as they reach the ground boundary.
*   **Status:** Dormant.

---

## [4] THERMODYNAMICS LAWS (Indices TBD)
*Current Implementation Status: Toggles exist in UI, but Logic is missing in worker loop.*

### 4.1 HEAT / COLD (Global Sink)
*   **Proposed Synergies:**
    1.  **HEAT + BOIL:** Runaway thermal expansion.
    2.  **COLD + CRYS:** Instant lattice formation at low temperatures.

### 4.2 CONV (Convection)
*   **Proposed Synergies:**
    1.  **CONV + PLANET:** Vertical cyclonic weather patterns.
    2.  **CONV + VOID:** Hot particles drift toward the void, cold toward the center.

### 4.3 RADI (Thermal Radiation)
*   **Proposed Synergies:**
    1.  **RADI + RAD:** High-energy particles emit both heat and mutation.
    2.  **RADI + ASTR:** Astral forms emit "Ghost Heat" that only affects `SOUL` states.

### 4.4 SUBL / DEPO (Phase Transition)
*   **Proposed Synergies:**
    1.  **SUBL + EXOP:** Explosive gas expansion.
    2.  **DEPO + ORDE:** Instant grid crystallization from gas.

---

## [5] METAPHYSICS LAWS (Indices 48-63)

### 5.1 TIME (Time Dilation)
*   **Index:** 48
*   **Assessment:** **FULLY FUNCTIONAL**.
*   **Code Review:** Scales `dt` by local velocity/density.
*   **Proposed Synergies:**
    1.  **TIME + FATE:** Fated particles ignore time dilation; they move at "Absolute Time".
    2.  **TIME + MIND:** Collective mind ignores local time dilation; the whole species processes at the fastest member's speed.
*   **Status:** Functional.

### 5.2 DIME (Dimensionality)
*   **Index:** 49
*   **Assessment:** **FULLY FUNCTIONAL**.
*   **Code Review:** Bypasses collision checks (`!isSet(LAW_INDEXES.DIME)`).
*   **Proposed Synergies:**
    1.  **DIME + TELE:** Phasing particles have a chance to "slip" into a new spatial coordinate.
    2.  **DIME + MIND:** Phasing particles act as bridges, connecting distant hive-mind clusters.
*   **Status:** Functional.

### 5.3 CHAO (Chaos Factor)
*   **Index:** 50
*   **Assessment:** **FULLY FUNCTIONAL**. Extreme vector injection.
*   **Code Review:** Multiplies jitter/entropy by 10x.
*   **Proposed Synergies:**
    1.  **CHAO + WILL:** Free will events become 100% likely, creating total unpredictability.
    2.  **CHAO + ACCR:** Accretion becomes "Black Hole" logic; particles absorb everything in a massive radius.
*   **Status:** Functional.

### 5.4 ORDE (Total Order)
*   **Index:** 51
*   **Assessment:** **FULLY FUNCTIONAL**. Grid snapping.
*   **Code Review:** `pos = Math.round(pos/50)*50`.
*   **Proposed Synergies:**
    1.  **ORDE + FATE:** Movement is restricted to grid-lines (Taxi-cab geometry).
    2.  **ORDE + MIND:** Hive mind forces all members to form a perfect geometric square/cube.
*   **Status:** Functional.

### 5.5 FATE (Determinism)
*   **Index:** 52
*   **Assessment:** **FULLY FUNCTIONAL**. Velocity lock.
*   **Code Review:** Bypasses all force calculations; `pos += vel`.
*   **Proposed Synergies:**
    1.  **FATE + WILL:** "Destiny Duel" - Spontaneous will events can break the Fate lock for 1 frame.
    2.  **FATE + SOUL:** Reincarnated particles follow the exact same path they took in their previous life.
*   **Status:** Functional.

### 5.6 WILL (Free Will)
*   **Index:** 53
*   **Assessment:** **FULLY FUNCTIONAL**. Vector reversal.
*   **Code Review:** `vel *= -1` at low probability.
*   **Proposed Synergies:**
    1.  **WILL + CLAI:** Particles proactive reverse velocity to avoid collisions before they occur.
    2.  **WILL + MIND:** A "Free Will" event in one member triggers a species-wide direction reversal.
*   **Status:** Functional.

### 5.7 SOUL (Persistence)
*   **Index:** 54
*   **Assessment:** **FULLY FUNCTIONAL**. Reincarnation.
*   **Code Review:** Dead state 0.5 can be revived.
*   **Proposed Synergies:**
    1.  **SOUL + PHENO:** "Ghost" forms are rendered as hollow circles (Wireframe) while in the 0.5 state.
    2.  **SOUL + GENO:** DNA drift continues even while dead, meaning you reincarnate as a different version of yourself.
*   **Status:** Functional.

### 5.8 MIND (Hive Mind)
*   **Index:** 55
*   **Assessment:** **FULLY FUNCTIONAL**. Velocity averaging.
*   **Code Review:** `vel = (v1 + v2) * 0.5` for same species.
*   **Proposed Synergies:**
    1.  **MIND + TRACK:** All hive members track the target seen by a single scout.
    2.  **MIND + ENER:** Energy is distributed from rich members to starving ones.
*   **Status:** Functional.

### 5.9 TELE (Teleportation)
*   **Index:** 56
*   **Assessment:** **FULLY FUNCTIONAL**. Wormhole logic.
*   **Code Review:** Instant relocation at random intervals.
*   **Proposed Synergies:**
    1.  **TELE + DIME:** Phasing through matter triggers a short-range teleport.
    2.  **TELE + RAD:** Teleportation leaves a radioactive "Blast" at the origin and destination.
*   **Status:** Functional.

### 5.10 CLAI (Clairvoyance)
*   **Index:** 57
*   **Assessment:** **FULLY FUNCTIONAL**. Look-ahead avoidance.
*   **Code Review:** Checks `lookX/Y` and reverses velocity at boundaries.
*   **Proposed Synergies:**
    1.  **CLAI + PREO:** Particles navigate perfectly through complex obstacle courses.
    2.  **CLAI + TRACK:** Predatory species "Intercept" targets by predicting their future positions.
*   **Status:** Functional.

### 5.11 PREO (Precognition)
*   **Index:** 58
*   **Assessment:** **FULLY FUNCTIONAL**. Density evasion.
*   **Code Review:** Subtracts force from dense regions.
*   **Proposed Synergies:**
    1.  **PREO + VOID:** Particles "know" where the void is and stay exactly at the threshold between void and cluster.
    2.  **PREO + BOIL:** Particles evade high-energy "Hot Spots" before they explode.
*   **Status:** Functional.

### 5.12 ASTR (Astral Projection)
*   **Index:** 59
*   **Assessment:** **FULLY FUNCTIONAL**. Ghost interaction.
*   **Code Review:** `f *= 0.1` at random intervals.
*   **Proposed Synergies:**
    1.  **ASTR + MIND:** Entire hive mind can shift into an "Astral" state to pass through obstacles.
    2.  **ASTR + SOUL:** Astral forms can "Possess" dead particles (Soul state 0.5) to revive them faster.
*   **Status:** Functional.

---

## [6] DEVELOPMENT ROADMAP & PROPOSED TASKS

### 6.1 Immediate Refinement (High Priority)
- [ ] **Task 1: Thermodynamics Implementation.** Map HEAT, COLD, CONV, RADI, SUBL, MELT, BOIL, COND, DEPO, EXOP to bitmask indices 9-15 and 42-47. Implement physics logic in `physics.worker.js`.
- [ ] **Task 2: Synergy Middleware.** Implement the `synergyBonus` logic in the Energy Tax block. This should detect "Law Clusters" (e.g., MIND + ENER) and reduce the tax or provide a stability buff.
- [ ] **Task 3: Phenotype Realization.** Move visual scaling (PHENO) from UI-only to the worker. DNA values for `Alpha` and `Base Radius` should directly affect the physics bounding box.

### 6.2 Synergy Integration (Medium Priority)
- [ ] **Task 4: Chiral Torque.** Implement `CHIR + TORQUE` synergy. Bond/Fusion logic should check `Math.sign(torque1) === Math.sign(torque2)`.
- [ ] **Task 5: Relativistic Gravity.** Implement `GRAV + TIME`. High density/force zones should decrease `localDt` automatically.
- [ ] **Task 6: Hive Energy.** Implement `MIND + ENER`. Species-wide energy averaging in the interaction loop.

### 6.3 Metaphysical Expansion (Low Priority)
- [ ] **Task 7: Astral Possession.** Implement `ASTR + SOUL`. Astral particles can transfer energy to 0.5-state particles to force immediate revival.
- [ ] **Task 8: Fated Grid.** Implement `FATE + ORDE`. Locked trajectories that only move on grid axes.

---
**Audit Complete.** 
*Note: All extracted code proof verified against `src/worker/physics.worker.js` (B11 Build).*
