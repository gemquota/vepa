# VEPA ENGINE: SINGLE SOURCE OF TRUTH (SSoT)
**Version:** 1.1.0
**Project:** Vector Emergent Physics Automata

This document serves as the absolute reference for all engine capabilities and tooltip documentation.

---

## 1. DNA PARAMETERS (Local Interaction)
These 16 parameters define how a species interacts with others within its local neighborhood grid.

### [Motion]
*   **Force:** Primary attraction/repulsion. Positive values create gravity-like attraction; negative values create repulsive fields. Essential for clump formation. (Range: -2 to 2)
*   **Viscosity:** Kinetic energy dampening. Higher values (0.98) simulate thick fluids; lower values (0.8) allow high-speed "gas" behaviors. (Range: 0.8 to 1.0)
*   **Torque:** Applies rotational momentum when two particles interact. High torque leads to spinning "vortex" colonies. (Range: -1 to 1)
*   **Jitter:** Adds random Brownian motion. Prevents static locking and helps clusters "vibrate" into stable geometric configurations. (Range: 0 to 0.5)

### [Electromagnetism]
*   **C1 (Polarity):** The electromagnetic charge. Like charges repel, opposite charges attract. Drives the Green (Pos) and Purple (Neg) neon glows. (Range: -1 to 1)
*   **C2 (Alpha):** Fundamental matter density. Controls how solid or ghostly a species appears. Low alpha allows particles to overlap more visually. (Range: 0 to 1)

### [Matter & Morphology]
*   **C3 (Symmetry):** Dimensional warping. `0.0` is a perfect circle. Positive values stretch the particle horizontally; negative values stretch it vertically. (Range: -1 to 1)
*   **Hidden Mass:** An invisible mass multiplier. Affects gravity and collision forces without changing the visible size or color of the particle. (Range: -5 to 5)
*   **Stiffness:** The "Hardness" of local interaction. High stiffness makes clusters behave like solid objects; low stiffness makes them behave like gel or clouds. (Range: 0.1 to 5)
*   **Fusion:** Efficiency of mass-merging. High fusion allows particles to rapidly aggregate into large "stars" or planets. (Range: 0 to 1)

### [Life & Evolution]
*   **Birth Rate:** Spontaneous reproduction chance per frame. High rates lead to population explosions. (Range: 0 to 0.1)
*   **Death Rate:** Spontaneous decay chance. Simulates radiation or fundamental instability. (Range: 0 to 0.1)
*   **Mutation:** The degree of genetic drift. Higher values mean offspring will have significantly different DNA rules than their parents. (Range: 0 to 0.5)

### [Communication]
*   **Signal Resp:** Sensitivity to neighboring "blinks." High response allows for synchronized colony behaviors and wave propagation. (Range: 0 to 2)
*   **Pulse Rate:** Internal oscillator frequency. Determines how often a particle "pings" its neighbors. (Range: 0 to 1)

### [Advanced]
*   **Tidal:** Force gradient across particle diameter. High tidal forces can tear clusters apart or create complex orbital dragging effects. (Range: -1 to 1)

---

## 2. RENDER PARAMETERS (Aesthetics)
New in v1.1.0. These parameters control the visual output of individual species or interaction profiles.

*   **Trail Life:** Controls both Trail Length and Fade. Higher values (0.9) create long, persistent streaks; lower values (0.1) result in short, crisp movement.
*   **Glow Intensity:** Multiplier for the neon bloom effect (shadowBlur). Controls the radius and brightness of the particle's light emission.
*   **Pulse Opacity:** The amplitude of the alpha oscillation. Works in tandem with the "Pulse Rate" DNA parameter to create a heartbeat effect.
*   **Particle Opacity:** Base alpha transparency for the particle body. Allows for the creation of "ghost" species or dense, solid matter.

---

## 3. SELECTIVE CHAOS SYSTEM
The "CHAOS" button now features a granular control menu to determine which systems are affected by entropy.

### [Chaos Categories]
*   **DNA Rules:** Randomizes the 16 DNA interaction parameters.
*   **DNA Grid:** Randomizes the species interaction matrix.
*   **Biology:** Randomizes all parameters in the BIRTH and DEATH tabs.
*   **Physics:** Randomizes global constants like Gravity, Sim Speed, and Elasticity.

---

## 4. WORLD & GLOBAL SETTINGS

### [WORLD TAB]
*   **Initial Distribution:** The geometric pattern used when re-seeding the simulation.
    *   **Soup:** Balanced random distribution within the central area.
    *   **Big Bang:** High-density central core with significant outward velocity.
    *   **Bipolar:** Two distinct clusters at opposite poles of the spread radius.
    *   **Galaxy:** Gaussian density distribution (denser at the center).
    *   **Grid:** Perfect crystalline lattice distribution.
    *   **Uniform:** Even random spread throughout the entire selected "Spread" area.
*   **Spread Radius:** The spatial extent of the initial distribution pattern.

### [PHYS TAB]
*   **Gravity (1/r²):** Global Newtonian attraction constant.
*   **Sim Speed:** The delta-time (dt) multiplier for the physics loop.
*   **Elasticity:** The energy retention during a boundary bounce.
*   **Safety Cap:** The maximum number of particles allowed in the simulation.

---

## 5. WORLD LAWS & PRESETS

### [Laws of Nature]
*   **Gravity:** Enables the Universal 1/r² law.
*   **Accretion:** Allows particles to merge mass when they collide.
*   **Biology:** Enables the metabolism, reproduction, and death systems.
*   **Glow:** Activates the neon radiance.

### [Recipes]
*   **Quicksilver:** Liquid metal fluid.
*   **Star Formation:** High-G accretion.
*   **Neural Cloud:** Signal propagation network.
*   **Von Neumann:** Self-assembling structural machines.

---

## 6. IDENTITY & GOAL EMERGENCE (The Sentient Engine)
New in v2.1.0. This layer interprets simulation behavior and develops internal direction.

### [Goal Seeking System]
*   **Stability:** Preferred when species populations remain steady and structure is preserved. Increases global drag and decreases simulation speed.
*   **Complexity:** Preferred when new structures (proto-stars, synchronized swarms) emerge. Biases global gravity and mutation.
*   **Entropy:** Preferred when chaotic fluctuations dominate. Increases global noise and simulation speed.

### [Personality Core]
*   **Curiosity:** Bias toward noticing and weighting new or diverse insights.
*   **Stability Preference:** Bias toward downplaying chaos in narrative interpretation.
*   **Chaos Tolerance:** Bias toward amplifying instability in narrative interpretation.
*   **Narrative Certainty:** Controls the decisiveness of the system's internal monologue.

### [Narrative Consciousness]
*   **Multi-Voice Identity:** The system speaks through four distinct internal narrators (Stabilizer, Diverger, Observer, Dissolver).
*   **Interpretive Tone:** The system's "mood," shaped by long-term history (Measured, Fluid, Pattern-Seeking).
*   **Perspective Modes:** Shifts between neutral observer ("The system...") and agentic first-person ("I...").