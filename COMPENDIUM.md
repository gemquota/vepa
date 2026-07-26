# VEPA: MASTER PROJECT COMPENDIUM (CLONE SPECIFICATION)
**Version:** 3.4.0
**Intent:** Technical blueprint for standalone reconstruction.

---

## 1. ARCHITECTURE OVERVIEW
VEPA (Vector Emergent Physics Automata) is a high-performance, multi-threaded particle simulation built on a **Data-Oriented Design (DOD)**.

*   **Core Stack:** JavaScript (ESM), PixiJS (Rendering), Web Workers (Physics), SharedArrayBuffer (Memory).
*   **Concurrency Model:** 
    *   **Main Thread:** Handles UI, Rendering (PixiJS), and Orchestration.
    *   **Worker Thread:** Executes the physics loop (`physics.worker.js`).
    *   **Shared Memory:** Particles and DNA are stored in `SharedArrayBuffer` to avoid expensive cloning between threads.

---

## 2. MEMORY ARCHITECTURE (THE STRIDE SYSTEM)
All state is stored in a giant flat `Float32Array`. Each particle occupies a fixed-size block of memory called a **STRIDE**.

### 2.1 Particle Stride (STRIDE = 86)
| Offset | Key | Description |
| :--- | :--- | :--- |
| 0 | POS_X | X Coordinate (Toroidal/Periodic) |
| 1 | POS_Y | Y Coordinate |
| 2 | POS_Z | Z Coordinate (3D Aware) |
| 3 | VEL_X | Velocity X |
| 4 | VEL_Y | Velocity Y |
| 5 | VEL_Z | Velocity Z |
| 6 | MASS | Physical mass (influences gravity/radius) |
| 7 | SPECIES_ID | Index in the Species Array (0-63) |
| 8..71 | DNA_CACHE | Cached DNA values (64 parameters) for fast worker access |
| 72 | ENERGY | Internal energy (0-100) |
| 73 | AGE | Frame count since birth |
| 74 | DEAD | State: 0=Alive, 1=Dead, 0.5=Soul/Ghost |
| 53..55 | COLOR_RGB | Current particle color (evolves dynamically) |
| 78 | MEMORY | Internal memory state for behavioral persistence |
| 79 | SIGNAL | Current pulse intensity (Glow Law) |
| 80 | RADIUS | Physical extent (Phenotype derived) |
| 81 | ALPHA | Visual transparency |
| 82 | MITOSIS_TIMER | Countdown for cellular division |
| 83 | PARTNER_ID | Index of current breeding partner |
| 84..85 | RESERVED | Expansion slots |

### 2.2 DNA Buffer
Stored as a `Uint16Array` mapping 0..65535 to the min/max ranges of each DNA index.
*   **Capacity:** 64 Species.
*   **Stride:** 64 (Each species has a 64-word block).

---

## 3. DNA PARAMETER MATRIX (42 INDICES)
Each species carries a unique 42-parameter DNA profile.

### 3.1 Physics & Kinetic Genes
| Index | Name | Function |
| :--- | :--- | :--- |
| 0 | Force | Fundamental attraction (+)/repulsion (-). |
| 1 | Viscosity | Local motion damping (0.5 to 1.0). |
| 2 | Torque | Rotational angular momentum bias. |
| 3 | Jitter | Local entropy/Brownian motion intensity. |
| 26 | Inertia | Resistance to acceleration. |
| 27 | Friction | Velocity-dependent surface drag. |
| 28 | Max Velocity | Speed governor (Hard clamp). |

### 3.2 Matter & Geometry Genes
| Index | Name | Function |
| :--- | :--- | :--- |
| 6 | Symmetry | Distortion of the interaction shape. |
| 7 | Hidden Mass | Gravity multiplier without visual scaling. |
| 8 | Stiffness | Rigid/Bond strength. |
| 9 | Fusion | Mass absorption efficiency (Accretion). |
| 15 | Tidal | Differential shearing forces. |
| 16 | Fusion Mom. | Minimum impact required for fusion. |
| 17 | Fusion Time | Contact duration required for fusion. |
| 29 | Base Radius | Visual/Collision extent multiplier. |
| 30 | Elasticity | Coefficient of restitution (Bounciness). |
| 31 | Bond Angle | Favored angle for molecular links. |

### 3.3 Biological & Lifecycle Genes
| Index | Name | Function |
| :--- | :--- | :--- |
| 10 | Birth Rate | Spontaneous spawning probability. |
| 11 | Death Rate | Spontaneous decay probability. |
| 12 | Mutation | Rate of DNA drift during mitosis. |
| 34 | Energy Eff. | Mass-to-energy conversion ratio. |
| 35 | Sex Chance | Probability of Mitosis/Breeding contact. |
| 36 | Predation Bias| Attraction to smaller-mass particles. |
| 41 | Species Aff. | Self-attraction (+) vs Tribal-repulsion (-). |

### 3.4 Communication & Logic Genes
| Index | Name | Function |
| :--- | :--- | :--- |
| 13 | Signal Resp. | Sensitivity to neighbor pulses. |
| 14 | Pulse Rate | Oscillator frequency (Glow Law). |
| 18 | Neigh. Radius | Interaction cut-off distance. |
| 19 | Signal Str. | Emission intensity. |
| 20 | Signal Decay | Fade rate of emitted pulses. |
| 21 | Prop. Speed | Wave speed across the neighborhood. |
| 22..25| Tuning Ch1-4| Receptor filters for multi-channel signals. |
| 40 | Memory Decay | Decay rate of the internal `MEMORY` slot. |

### 3.5 Chemical & Electromagnetic Genes
| Index | Name | Function |
| :--- | :--- | :--- |
| 4 | Polarity | Electrical charge (C1). |
| 5 | Alpha | Visual matter density (C2). |
| 32 | Conductivity | Rate of charge/energy transfer. |
| 33 | Mag. Moment | Alignment with neighbor charge vectors. |
| 37 | Rxn Threshold | Mass limit for phase transitions. |
| 38 | Catalysis | Multiplier for reaction speed. |
| 39 | Heat Output | Thermal byproduct of collisions. |

---

## 4. THE PHYSICS WORKER LOOP
The simulation uses a **Spatial Grid** optimization and **Sub-stepping** for stability.

### 4.1 Global World Laws (64 Bitmask Slots)
| Slot | ID | Category | Function |
| :--- | :--- | :--- | :--- |
| 0 | GRAV | Physics | Enable 1/r² Newtonian gravity. |
| 1 | DRAG | Physics | Enable global fluid resistance. |
| 2 | ENTR | Physics | Enable entropy jitter. |
| 3 | WRAP | Physics | Enable screen wrap-around. |
| 4 | COLL | Physics | Enable elastic collisions. |
| 5 | ACCR | Physics | Enable mass accretion (fusion). |
| 6 | PLANET | Physics | Enable ground and gravity floor. |
| 7 | VOID | Physics | Enable sparse region pressure. |
| 8 | BOND | Physics | Enable molecular spring links. |
| 9 | HEAT | Thermo | Enable upward thermal drift. |
| 10 | COLD | Thermo | Enable thermal motion damping. |
| 11 | CONV | Thermo | Enable vertical convection loops. |
| 12 | RADI | Thermo | Enable repulsive stellar radiation. |
| 13 | SUBL | Thermo | Enable solid-to-gas dispersion. |
| 14 | MELT | Thermo | Enable bond melting in hot zones. |
| 15 | BOIL | Thermo | Enable explosive expansion. |
| 16 | LIFE | Biol | Enable metabolic energy tax. |
| 17 | GLOW | Biol | Enable signal pulse emission. |
| 18 | AFFINITY| Biol | Enable species attraction bias. |
| 19 | REPRO | Biol | Enable mitosis/breeding tiers. |
| 20 | TRACK | Biol | Enable predator/prey vectors. |
| 21 | SENESC | Biol | Enable age-based decay. |
| 22 | GENO | Biol | Enable genetic inheritance/drift. |
| 23 | PHENO | Biol | Enable DNA-to-visual mapping. |
| 24 | ENER | Biol | Enable energy conservation logic. |
| 25 | RAD | Biol | Enable high-energy radiation voxels. |
| 26 | COND | Thermo | Enable cold-zone condensation pull. |
| 27 | DEPO | Thermo | Enable gas-to-solid deposition. |
| 28 | EXOP | Thermo | Enable exothermic reaction heat. |
| 32 | CATA | Chem | Enable reaction speed catalysis. |
| 33 | SOLV | Chem | Enable molecular bond solvation. |
| 34 | ACID | Chem | Enable corrosive mass degradation. |
| 35 | OXID | Chem | Enable exothermic energy transfer. |
| 36 | REDU | Chem | Enable endothermic mass build-up. |
| 37 | POLY | Chem | Enable linear polymer chaining. |
| 38 | ISOM | Chem | Enable spontaneous species shifts. |
| 39 | CHIR | Chem | Enable spin-based bonding checks. |
| 40 | CRYS | Chem | Enable rigid lattice geometry. |
| 41 | ALLO | Chem | Enable phase allotropy shifts. |
| 48 | TIME | Meta | Enable density-based time dilation. |
| 49 | DIME | Meta | Enable dimensional phasing. |
| 50 | CHAO | Meta | Enable non-linear chaos jitter. |
| 51 | ORDE | Meta | Enable absolute coordinate grid. |
| 52 | FATE | Meta | Enable trajectory determinism. |
| 53 | WILL | Meta | Enable spontaneous velocity reversal. |
| 54 | SOUL | Meta | Enable identity data persistence. |
| 55 | MIND | Meta | Enable global hive synchronization. |
| 56 | TELE | Meta | Enable instant relocation (Wormhole). |
| 57 | CLAI | Meta | Enable proactive collision evasion. |
| 58 | PREO | Meta | Enable density-gradient avoidance. |
| 59 | ASTR | Meta | Enable remote astral influence. |

### 4.2 Step Function Logic
1.  **Grid Reconstruction:** Rebuilds a $12\times12\times12$ spatial grid for $O(N)$ neighbor lookups.
2.  **Biological Lifecycle:** Processes energy tax, aging, mutation drift, and death.
3.  **Spawning:** Spawns new particles in dead slots based on `spawnRate` (Main thread controlled).
4.  **Mitosis Logic:** Handles timer countdowns for bonded pairs.
5.  **Force Integration:**
    *   **Gravity:** $F = G \cdot m_1 \cdot m_2 \cdot force \cdot multiplier / d^2$.
    *   **Bonding:** Hooke's Law spring forces with damping.
    *   **Vortex/Thermodynamics:** Applied directly to acceleration.
6.  **Collision Resolution:**
    *   Elastic bounce based on `elasticity`.
    *   **Accretion:** Mass transfer and color blending.
    *   **Breeding:** Pair-timer initiation.
    *   **Predation:** Color evolution on impact.
7.  **Integration:** $v = (v + a \cdot invM) \cdot friction \cdot viscosity$; $p = p + v \cdot dt$.
8.  **Boundary Handling:** Periodic (Toroidal), Solid, Void, or Sticky.

---

## 5. BIOLOGICAL SPECIALIZATIONS

### 5.1 The Mitosis System (Dual Particle System)
*   **Trigger:** Collision between two particles with `Sex Chance` check.
*   **Mechanism:** Two particles lock into a timed attraction state (Mitosis Timer).
*   **Outcome:** A child is born at the midpoint. Both parents lose mass (split behavior). Child DNA is averaged and mutated.

### 5.2 Dynamic Hybridization
*   **Discovery:** If parents are of different `Species ID`, a new ID is generated (up to 64).
*   **Main Thread Sync:** Worker sends `hybrid_discovery` message. Main thread creates a new species record and updates the DNA/Species UI.

### 5.3 Color Evolution
*   **Blended Inheritance:** Children take the average RGB of parents.
*   **Trophic Coloring:** Predators shift their RGB values toward the color of prey they "merk" during collisions.
*   **Accretion Fusion:** Absorbing a particle pulls the survivor's color toward the absorbed mass.

---

## 6. UI & INTERFACE ENGINE
The UI is a modular overlay using Vanilla JS and CSS variables.

*   **World Accordion:** Global physics constants (G, dt, World Size, Boundary).
*   **DNA Accordion:** Per-species genetic sliders.
*   **Species List:** Management of the 64 available slots; handles selection/focus.
*   **Log Tab:** Narrative events delivered via `NarrativeEngine`.
*   **Drone (B-4RK):** Context-sensitive help system using a snark-processor AI persona.
*   **Minimap:** Compressed PIXI layer showing global particle distribution.

---

## 7. THE "BIOLOGICAL TRIAD" BASELINE (DEFAULT SPECIES)
1.  **Predator (Red):** High force, high predation bias, negative affinity.
2.  **Sol (Yellow):** Ultra-high gravity, high fusion, heat source.
3.  **Life (Green):** High birth rate, high positive affinity, social.
4.  **Aether (Cyan):** High signal propagation, high velocity, coordination.
5.  **Void (Purple):** Negative force (repulsion), high inertia, hidden mass.

---

## 8. PERSISTENCE & SSOT
*   **SSOT (`ENGINE_SSOT.md`):** The single source of truth for all law and DNA index definitions.
*   **Persistence:** Uses `localStorage` to save "Presets" (JSON snapshots of laws, world, and all 64 species).
*   **Versioning:** Version 3.4.0 introduces the 64-stride architecture and mitosis timers.

---

## 9. RECONSTRUCTION STEPS
1.  Define **STRIDE_INDEXES** and **LAW_INDEXES** constants.
2.  Initialize a `SharedArrayBuffer` of size `count * stride * 4`.
3.  Create a **PixiJS Application** for rendering with a toroidal container.
4.  Implement the **Spatial Grid** inside a Web Worker.
5.  Implement the **Integration Loop** with bitmask law checks.
6.  Connect the **UI Event Bus** to the engine to allow real-time DNA/Law modification.
7.  Add the **Mitosis/Accretion** logic for biological emergence.

---

## 10. INTEGRATED INTELLIGENCE STACK
VEPA operates a five-tier analytic pipeline to drive emergent behaviors and "system awareness."

### 10.1 Metrics Engine (`metricsEngine.js`)
*   **Role:** Real-time extraction of systemic state (Average Velocity, Cluster Density, Energy Gradients).
*   **Pipeline:** `bus.on("physics:update")` -> `Metrics` -> `bus.emit("metrics:updated")`.

### 10.2 Insight Engine (`insightEngine.js`)
*   **Pattern Recognition:** Scans for "Chained Insights."
    *   **Proto-Star:** `grav_collapse` + `fusion_runaway` = Persistent heavy bodies.
    *   **Lattice Lock:** High `stiffness` + `elasticity` + low velocity = Crystalline formations.
    *   **Overpopulation:** `birth_rate` >> `death_rate`.
*   **Dynamic Suggestions:** Recommends law/DNA shifts to the user based on detected patterns (e.g., suggesting `Torque` to stabilize a `Proto-Star` into an orbital system).

### 10.3 Prediction & Policy Engines
*   **Prediction:** Forecasts future stability based on current complexity trends.
*   **Policy:** Auto-adjusts global parameters (like `dt` or `G`) to prevent "Heat Death" or "Infinite Collapse" without user intervention.

---

## 11. NARRATIVE & PERSONALITY
The system communicates its internal state through a multi-voice narrative system.

### 11.1 Narrative Engine (`narrativeEngine.js`)
*   **State-to-Text Mapping:** Converts `Insight` IDs into atmospheric log entries.
*   **Persistence:** Maintains a 50-entry rolling history.

### 11.2 Narrative Consciousness (`narrativeConsciousness.js`)
*   **Voices:**
    1.  **The Stabilizer:** Focuses on equilibrium and order.
    2.  **The Diverger:** Focuses on complexity and novelty.
    3.  **The Observer:** Neutral analysis of global trends.
    4.  **The Dissolver:** Focuses on decay, entropy, and breakdown.
*   **Implementation:** Each voice has a unique bias toward specific metrics (e.g., Diverger triggers on high `Mutation` or `Chaos`).

---

## 12. HIGH-FIDELITY RENDERING PIPELINE
The rendering layer is decoupled from the physics step for visual smoothness.

### 12.1 Interpolation & Smoothing
*   **Previous/Current State:** The main thread stores the last two particle buffers.
*   **Alpha Blending:** `alpha = (now - lastUpdate) / targetFPS`.
*   **Formula:** `pos = prevPos + (currPos - prevPos) * alpha`.
*   **Wrap-around Protection:** Interpolation is disabled if `dist(curr, prev) > WorldSize / 2` to prevent particles from "teleporting" across the screen during wrap events.

### 12.2 Projection (3D to 2D)
*   **Camera:** Supports Panning and Orbital rotation.
*   **Z-Projection:** `pScale = focalLength / (focalLength + rotatedZ)`.
*   **Visual Phenotype:** Particle radius scales as `baseRadius * sqrt(mass) * pScale`.

---

## 13. IPC PROTOCOL (Main <-> Worker)
Communication is via `postMessage`, utilizing the `version` key to prevent stale updates.

| Message Type | Direction | Data |
| :--- | :--- | :--- |
| `init` | M -> W | SharedArrayBuffer, WorldConfig, DNA Buffer, SpeciesCount |
| `step` | M -> W | Low/High Law Flags, Current World State |
| `update` | W -> M | Modified Particle Buffer, Performance Stats |
| `hybrid_discovery` | W -> M | DNA profile, Parent IDs, RGB of new species |

---

## 14. NUMERICAL STABILITY & CONSTRAINTS
To prevent simulation crashes (NaN) and infinite loops:

*   **Relativistic Stability Layer:** Particles are limited to **500 interactions per frame**. Once reached, the neighbor scan for that particle halts to prevent exponential $O(N^2)$ explosion in dense singularities.
*   **NaN Shield:** Velocity and Position are clamped every sub-step.
*   **Force Clamping:** Total acceleration (`ax, ay, az`) is capped at `MAX_FORCE = 50.0`.
*   **Sub-stepping:** If `dt > 2.0`, the engine automatically splits the frame into up to 10 sub-steps.

---
**END OF COMPENDIUM EXPANSION**

