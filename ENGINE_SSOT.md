# VEPA ENGINE: SINGLE SOURCE OF TRUTH (SSoT)
**Version:** 3.0.0
**Project:** Vector Emergent Physics Automata

This document serves as the absolute reference for all engine capabilities and documentation in the current codebase.

---

## 1. DNA PARAMETERS (42 Indices)
These 42 parameters define how a species behaves and interacts with its environment and other species.

### [Physics & Motion]
*   **Force (0):** Primary attraction/repulsion. Positive pulls particles together; negative pushes them apart.
*   **Viscosity (1):** Kinetic energy dampening. Higher values freeze motion; lower values allow fast behavior.
*   **Torque (2):** Applies rotational momentum.
*   **Jitter (3):** Adds random Brownian motion (entropy).
*   **Tidal (15):** Applies differential forces across structures.
*   **Inertia (26):** Resistance to acceleration.
*   **Friction (27):** Velocity-dependent drag.
*   **Max Velocity (28):** Terminal speed limit.

### [Matter & Morphology]
*   **C3 (Symmetry) (6):** Distorts interaction shape.
*   **Hidden Mass (7):** Invisible mass multiplier.
*   **Stiffness (8):** Rigidity of structural bounds.
*   **Fusion (9):** Efficiency of mass-merging.
*   **Fusion Momentum (16):** Minimum collision strength for merging.
*   **Fusion Time (17):** Temporal gating to growth.
*   **Base Radius (29):** Starting size before mass scaling.
*   **Elasticity (30):** Collision energy retention (bounciness).
*   **Bond Angle (31):** Favored cluster geometry.

### [Electromagnetism & Chemistry]
*   **C1 (Polarity) (4):** Charge (like repels, opposite attracts).
*   **C2 (Alpha) (5):** Visual matter density.
*   **Conductivity (32):** Rate of charge/energy transfer on contact.
*   **Magnetic Moment (33):** Neighbor charge alignment.
*   **Reaction Threshold (37):** Mass limit for phase change.
*   **Catalysis (38):** Reaction speed multiplier.
*   **Heat Output (39):** Interaction energy byproduct.

### [Biology & Life]
*   **Birth Rate (10):** Spontaneous reproduction chance per frame.
*   **Death Rate (11):** Spontaneous decay chance.
*   **Mutation (12):** Randomness in offspring DNA.
*   **Energy Efficiency (34):** Mass-to-energy conversion ratio.
*   **Sex Chance (35):** Multi-parent reproduction probability.
*   **Predation Bias (36):** Bonus attraction toward lower-mass species.
*   **Species Affinity (41):** Attraction bias toward same (+) or different (-) species.

### [Communication & Memory]
*   **Signal Resp (13):** Sensitivity to neighboring pulses.
*   **Pulse Rate (14):** Internal oscillator frequency.
*   **Neighborhood Radius (18):** Range of influence.
*   **Signal Strength (19):** Intensity of communication.
*   **Signal Decay (20):** Persistence of signals.
*   **Propagation Speed (21):** Speed at which signals travel.
*   **Tuning Ch1-Ch4 (22-25):** Receptor filtering channels for complex logic.
*   **Memory Decay (40):** Internal state persistence over time.

---

## 2. WORLD LAWS (Global System Toggles)

### [Pure Physics Laws]
*   **grav:** Global Newtonian 1/r² attraction.
*   **drag:** Fluid motion damping.
*   **jitter:** Brownian motion/entropy injection.
*   **coll:** Physical elastic collisions.
*   **accr:** Mass accretion (fusion) on collision.
*   **wrap:** Toroidal spatial topology (screen wrap).
*   **planetary:** Constant downward gravity and solid floor collision.
*   **void:** Linear evaporative decay for large masses.
*   **bond:** Elastic molecular linking (Hooke's law).
*   **ener:** Global energy conservation tracking.
*   **rad:** High-energy radiation voxel grid (sterilization).

### [Biological Laws]
*   **life:** Enables metabolism, reproduction, and death logic.
*   **tracking:** Allows predator/prey vectors.
*   **glow, affinity, reproduction, senescence, genotype, phenotype:** Specialized biol overrides.

---

## 3. WORLD CONFIGURATION
*   **count:** Base particle count target.
*   **dimX, dimY, dimZ:** Physical dimensions of the simulation volume.
*   **spreadX, spreadY, spreadZ:** Starting spatial distribution ratios.
*   **baseSize:** Global scale multiplier.

---

## 4. PRESETS
1.  **PRIME_DEFAULT:** Balanced Newton/Euler physics (Sol, Aether, Void).
2.  **VOID_CORE:** High-gravity singularity with linear evaporative decay.
3.  **NEURAL_DRIFT:** Distributed mesh network with elastic tethers and damping.
4.  **SOLAR_FLARE:** High-energy radiation emitter (sterilization grid).
5.  **CRYSTAL_LATTICE:** Rigid structure with conductive energy flow.
6.  **PREDATOR_SWARM:** Aggressive, fast-moving tracking swarm.
7.  **KINETIC_GAS:** High-energy kinetic gas, perfectly elastic collisions.
8.  **SYMBIOTIC_LOOP:** Highly adaptive ecosystem driven by energy exchange.
9.  **CHRONOS_FLUX:** Temporal anomaly with high inertia and tidal stretching.

---

## 5. INTELLIGENCE ENGINES
*   **Insight Engine (V5):** Spatio-temporal cluster detection and pattern logging.
*   **Narrative Consciousness:** Multi-voice internal monologue (Stabilizer, Diverger, Observer, Dissolver).
*   **Goal Engine:** Auto-adjusts world constraints based on system stability and complexity metrics.
*   **Personality Engine:** Drives systemic bias toward Curiosity, Stability, or Chaos.
