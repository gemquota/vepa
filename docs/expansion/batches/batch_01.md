# VEPA Engine: World Physics Core Expansion (Batch 01)

This document provides a high-fidelity deep dive into the primary world parameters governing the VEPA (Vector Emergent Physics Automata) simulation. Each entry is calibrated for senior engineering personnel requiring a holistic understanding of the engine's mechanical and emergent properties.

---

## 1. count (Population Cap)

### BASIC
The `count` parameter represents the hard-coded population cap for a simulation instance. It defines the maximum number of active agents that can be instantiated within the `SharedArrayBuffer` memory block. This value is the primary constraint on the engine's spatial grid partitioning system, where the computational cost scales at O(N) relative to entity density.

### ADVANCED
The `count` parameter serves as the fundamental manifestation limit of the VEPA environment. By setting the upper bound of the entity buffer, it determines the maximum concurrent agent interactions possible before the engine triggers its memory-safe overflow protections. Senior operators must balance this value against the available hardware thread-pool to maintain real-time fidelity.

Increasing the population cap beyond the recommended hardware threshold can lead to "temporal jitter" as the spatial hash-grid struggles to index high-density clustering events. When entities exceed the optimal grid-cell occupancy, the neighbor-search algorithm's efficiency degrades, impacting the physics worker's ability to maintain a consistent frame-rate. Conversely, a low entity count can lead to sparse environments where emergent behaviors like swarm intelligence or lattice formation fail to manifest due to lack of critical mass.

### EXPERT
In the VEPA architecture, `count` is more than a simple integer; it is the allocation key for the multi-threaded physics pipeline. When the simulation initializes, the `SharedArrayBuffer` is carved into discrete strides based on this value, ensuring that each worker thread has a deterministic memory window for its assigned entity subset. This fixed-allocation strategy is what enables the "Nuclear" rewrite's high-performance throughput, but it also means that the `count` is often locked during active cycles to prevent catastrophic buffer misalignment.

From a spatial optimization perspective, the population cap interacts directly with the grid-partitioning resolution. The engine utilizes a dynamic hash-grid to minimize N-body interaction costs. As `count` increases, the engine must either increase the number of grid cells or accept higher occupancy per cell. If cell occupancy spikes, the interaction loop transitions from O(N) toward O(N²), which is the primary cause of simulation thermal death in high-density regimes.

Furthermore, the `count` parameter dictates the stochastic pressure within the birth/death lifecycle. In a full-buffer state, the `spawnRate` logic is suppressed, leading to a state of "Biological Stagnation" where no new genetic variation can enter the system until an existing agent decays. This creates a competitive environment where only the most "fit" entities (those with low `Death Rate` or high `Energy Efficiency`) survive, effectively turning the population cap into a driver for natural selection.

In multi-node deployments, the `count` also acts as a synchronization barrier. The Insight Engine uses this value to calibrate its cluster-detection sensitivity, assuming that a certain percentage of the population must be involved in a formation for it to be considered a "Macro-Structure." Adjusting the count mid-sim without re-initializing these engines can lead to "ghost clusters" or missed emergent events, as the statistical baselines are no longer valid.

The limit of the population is ultimately a trade-off between individual agent fidelity and systemic complexity. A high-count simulation might run at a lower sub-stepping resolution (high `dt`), sacrificing the accuracy of individual collisions to maintain the visual spectacle of massive swarms. Operators are encouraged to use the `count` as a strategic tool, scaling it down for surgical DNA debugging and up for macro-evolutionary stress testing.

Finally, the `count` is the primary factor in the engine's "Memory Footprint" metric. Each agent consumes a fixed number of bytes for its position, velocity, and 42-parameter DNA block. On systems with limited L3 cache, high population counts can lead to "cache thrashing," where the CPU spends more time fetching entity data from RAM than it does calculating physics vectors. Optimizing the count is therefore an exercise in hardware-alignment as much as it is in simulation design.

---

## 2. G (Global Gravity)

### BASIC
`G` represents the Strength of Attraction across the entire simulation space. It acts as a global force multiplier for the Newtonian 1/r² law, governing how aggressively particles pull toward one another. The engine implements a stability-clamped inverse-square function to prevent singularity-induced velocity spikes during near-zero distance interactions.

### ADVANCED
Global Gravity is the primary architect of structure in the VEPA universe. It defines the baseline "tension" of the world, pulling disparate agents into coherent clusters, filaments, and planetary bodies. While individual species may have DNA-level `Force` modifiers, the `G` parameter sets the universal constant that all local interactions must overcome.

High `G` values drive rapid gravitational collapse, leading to the formation of dense, high-mass singularities and stable orbital systems. In this regime, the simulation behaves like a celestial laboratory, where the primary challenge is preventing total system "crunch." Low `G` values, by contrast, allow Brownian motion and internal species forces to dominate, resulting in a "Gaseous" state where structure is fleeting and agents remain largely independent.

### EXPERT
The implementation of `G` in the VEPA worker thread utilizes a distance-squared attenuation with a "Softening Factor" ($\epsilon$) to handle the N-body problem. This softening factor is dynamically linked to the `G` magnitude; as gravity increases, the engine hardens the collision bounds to prevent agents from overlapping and generating infinite force vectors. This clamping is essential for maintaining the integrity of the SSOT (Single Source of Truth), as it ensures that even the most extreme gravitational events remain reproducible and deterministic.

In complex ecosystems, `G` interacts non-linearly with the `Viscosity` and `dt` parameters. A high-gravity world requires more frequent integration steps (smaller `dt`) to accurately resolve the high-velocity curves of close-approach orbits. If `G` is set too high relative to the simulation speed, agents will "tunnel" through each other or be ejected from the simulation volume at speeds exceeding `Max Velocity`. This "Numerical Instability" is the senior engineer's greatest adversary when tuning high-energy presets.

Furthermore, `G` is the driving force behind the `accr` (Accretion) law. In high-gravity environments, collision momentum is amplified, making it significantly easier for particles to reach the `Fusion Momentum` threshold required for merging. This creates a positive feedback loop: gravity creates mass, and mass creates more gravity. Without a corresponding `Death Rate` or `VOID` evaporative decay, a high-G world will eventually consolidate into a single, massive entity, effectively ending the evolutionary cycle.

The interaction between `G` and the spatial grid is also noteworthy. The Insight Engine monitors the "Gravitational Potential" of different grid cells to identify emerging hotspots. These hotspots are then prioritized for higher-resolution monitoring by the Narrative Consciousness. When `G` is modulated in real-time, the engine must recalculate the "Clustering Probability Matrix," which can cause momentary surges in CPU load as the engine re-assesses the stability of every existing formation.

Beyond simple attraction, `G` can be inverted to create "Universal Expansion" regimes. By setting `G` to a negative value, the engine simulates a dark-energy-like field where every particle repels every other particle. This is particularly useful for "De-stressing" a simulation that has become too dense, as it forces clusters to fragment and redistributes mass across the entire toroidal volume.

In the context of the `planetary` law, `G` is redirected to act as a constant downward vector ($g$), simulating a terrestrial surface. In this mode, the 1/r² attraction is often suppressed in favor of the global down-force, shifting the simulation's focus from orbital mechanics to pile-dynamics and fluid flow. This versatility makes `G` the single most powerful slider in the operator's toolkit for defining the simulation's "Physical Flavor."

---

## 3. dt (Sim Speed / Time Delta)

### BASIC
`dt` (Delta Time) defines the integration resolution or "Time-Step" of the physics engine. It controls the granularity of time, where smaller values provide higher accuracy for fast-moving interactions and larger values accelerate the simulation's overall evolution. The engine employs sub-stepping techniques to prevent "tunneling," where particles might skip past each other between frames.

### ADVANCED
The `dt` parameter is the master clock of the VEPA simulation. It determines the balance between "Simulated Real-Time" and "Computational Accuracy." By adjusting the time-step, operators can choose to zoom in on the micro-seconds of a high-speed collision or fast-forward through eons of genetic drift.

A low `dt` (high resolution) is mandatory for stable physics in high-energy or high-density environments. It ensures that force calculations are applied frequently enough to capture the rapid changes in acceleration that occur during close-range encounters. Conversely, a high `dt` (low resolution) allows for rapid "Macro-Evolutionary" testing, but increases the risk of particles tunneling through boundaries or failing to resolve elastic collisions correctly, leading to "Energy Leaks" in the system.

### EXPERT
Technically, `dt` is the scalar applied to the velocity and acceleration vectors during the Euler-Verlet integration phase. In the VEPA worker, this is implemented as a semi-implicit integration to maintain energy conservation across millions of particles. When `dt` is fluctuated, the engine must perform a "Momentum Rescaling" to ensure that existing velocities don't suddenly jump or stall, maintaining the continuity of motion within the SSOT.

The concept of "Sub-stepping" is intrinsically tied to `dt`. If the engine detects a high `G` or high `spawnRate` event, it can internally divide the `dt` into multiple smaller steps within a single frame. This prevents the "Tunneling Phenomenon," where an agent's velocity is so high that its position at $t+1$ is on the other side of a solid boundary, effectively bypassing the collision logic at $t$. Proper sub-stepping is the difference between a professional simulation and a "broken" one.

In the Metaphysics layer, the `time` law (Time Dilation) operates by locally modulating the `dt` for specific spatial voxels. Regions of high mass or high "Complexity" can be assigned a smaller `dt`, allowing the engine to resolve their intricate interactions with higher fidelity while the rest of the simulation runs at a standard speed. This "Heterogeneous Time" is a cutting-edge feature of the VEPA engine, enabling the simulation of relativistic-like effects without the overhead of a full Einsteinian model.

Adjusting `dt` also has a profound impact on the `Life` law. Since birth and death chances are checked once per step, increasing `dt` effectively increases the "Metabolic Rate" of every entity. A species that is stable at `dt=0.016` might rapidly go extinct at `dt=0.1` because their decay rate is out-pacing their reproductive cycle in "Simulation Time." Senior operators use this to stress-test the robustness of genetic lines against "Temporal Flux" events.

From a performance perspective, `dt` is a "Complexity Multiplier." While it doesn't change the number of particles (that's `count`), it determines how many times the physics loop is executed before the frame is handed back to the PIXI renderer. A high-resolution simulation with 4x sub-stepping is effectively doing 4x the work, which can lead to thermal throttling on mobile-tier hardware.

Finally, `dt` is the primary variable for the "Rewind" and "Reverse" functions. By setting `dt` to a negative value, the engine attempts to invert the velocity vectors and "undo" the simulation. However, due to the entropy injected by `jitter` and `temperature`, perfect reversal is impossible—this is known as the "Arrow of Entropy" within the VEPA documentation. The `dt` slider is thus not just a speed control, but a portal into the simulation's temporal topology.

---

## 4. globalViscosity (Environmental Friction)

### BASIC
`globalViscosity` represents the friction or "Thickness" of the medium through which entities move. It acts as a kinetic energy dampener, applying a velocity multiplier (e.g., 0.98x) to every particle at the end of each frame. High viscosity freezes formations into stable structures, while low values allow for fast, chaotic, and turbulent motion.

### ADVANCED
Viscosity is the "Phase Controller" of the VEPA engine. It determines whether the simulation behaves like a gas, a liquid, or a solid. By draining kinetic energy from the system, it allows gravitational and electromagnetic forces to settle into stable configurations, rather than remaining in a state of permanent chaotic agitation.

In high-viscosity regimes, the environment feels like thick syrup or "Aether," where particles quickly lose their momentum and come to rest. This is ideal for observing "Crystalline Growth" and the formation of complex, multi-agent "Machines." In low-viscosity regimes, the world is a high-energy "Kinetic Gas," where particles retain their velocity for long periods, leading to frequent collisions and a high rate of genetic exchange.

### EXPERT
The mathematical implementation of `globalViscosity` is a simple but effective velocity attenuation: $v_{t+1} = v_t \times (1 - \text{viscosity} \times dt)$. This creates an exponential decay of kinetic energy that is independent of mass, ensuring that even the largest entities eventually succumb to environmental drag. This "Global Dampening" is essential for preventing the simulation from reaching a "Singularity of Motion," where forces accumulate until the system crashes.

Viscosity is the primary antagonist to `G` and `Force`. While gravity pulls particles together, viscosity prevents them from orbiting forever in a state of "Eternal Fall." It allows for the "Capture" of particles into stable shells, as it saps the velocity required to escape a gravitational well. Without viscosity, the VEPA engine would struggle to produce anything other than chaotic orbits; with it, we see the emergence of planetary cores and stable biological niches.

In the `Physics` law category, `drag` is the toggle that activates this global multiplier. However, individual species can have a DNA-level `Viscosity` trait that allows them to "Slick" through the environment or "Stick" to their neighbors. This "Differential Viscosity" is a powerful tool for creating heterogeneous ecosystems where some species are fast-moving predators while others are slow-moving, sessile "Plants."

The interaction between viscosity and the `jitter` (temperature) parameter is what defines the "Thermal Equilibrium" of the world. Viscosity removes energy, while temperature injects it. By balancing these two sliders, an operator can create a "Liquid Phase" where particles are held together by attraction but still have enough internal agitation to move past each other, allowing for fluid-like flows and emergent convection patterns.

Furthermore, viscosity is used by the Insight Engine to determine the "Structural Integrity" of clusters. A cluster formed in high viscosity is considered "Stable" and given a unique ID for tracking. A cluster in low viscosity is flagged as "Transient," as it is likely to fragment at the next high-energy collision. This categorization is vital for the Narrative Consciousness to describe the world accurately.

In advanced presets like `NEURAL_DRIFT`, viscosity is modulated dynamically based on signal propagation. High-activity areas of the "Brain" become more viscous to "Solidify" memories, while low-activity areas remain fluid. This mimics the "Synaptic Plasticity" of biological brains and is a testament to the depth of the VEPA physics worker's flexibility.

---

## 5. spawnRate (Birth Pressure)

### BASIC
`spawnRate` governs the frequency of spontaneous entity generation within the simulation. It represents the "Birth Pressure" of the world, determining how often the engine attempts to re-initialize a dead particle slot with a new agent. This stochastic re-initialization is the primary driver for population recovery after a mass-extinction event.

### ADVANCED
The `spawnRate` is the engine's "Biological Engine Starter." It defines the rate at which new life is injected into the system, independent of existing reproduction cycles. In a barren world, a high spawn rate will quickly fill the simulation volume with diverse, randomized agents, creating the "Primordial Soup" from which complex life can emerge.

This parameter is critical for maintaining population diversity. While horizontal gene transfer and cloning (driven by `Sex Chance` and `Birth Rate` DNA) can lead to specialized species, the global `spawnRate` ensures a steady influx of "Wild-Type" DNA, preventing the simulation from settling into a genetic dead-end. It is the "Mutation Background Noise" that keeps the evolutionary gears turning.

### EXPERT
In the worker thread, `spawnRate` is implemented as a probability check per frame: if $rand() < spawnRate$, the engine scans the particle buffer for the first index marked as `DEAD`. If a slot is found, it is "Re-born" at a random spatial coordinate with DNA synthesized from the current `PRIME_DEFAULT` or a weighted average of active species. This "Dead-Slot Re-cycling" is what keeps the memory footprint constant even as populations fluctuate.

The `spawnRate` acts as the primary counter-force to the `Death Rate` (entropy). In a "Closed" ecosystem, operators typically set the spawn rate to a low value, forcing the population to sustain itself through internal reproduction. In an "Open" ecosystem, a high spawn rate creates a state of "Constant Influx," where new species are constantly competing for space and energy, leading to a much higher rate of "Macro-Evolutionary Turnover."

There is a subtle but vital interaction between `spawnRate` and the `Distribution` type. If the distribution is set to "Spiral" or "Vortex," the new particles are spawned with initial velocity vectors that match the global flow. This ensures that the "Immigrant" particles are immediately integrated into the world's dynamics, rather than appearing as static "Obstacles" that disrupt existing formations.

The Insight Engine tracks the "Spawn Density" of different world quadrants to identify "Biological Hotspots." If the `spawnRate` is high in a region with low mass, the engine may trigger a "Genesis Event" notification in the Log. Conversely, if new spawns are immediately dying (due to high `RAD` or `ACID` laws), the Narrative Consciousness will report on the "Hostility" of the environment.

Advanced operators use the `spawnRate` as a "Systemic Stressor." By suddenly spiking the spawn rate, one can simulate a "Plague" of new agents that disrupts a stable ecosystem. This is a common technique for testing the "Resilience" of long-lived species; if a species can survive a 10x spike in population pressure without going extinct, it is considered "Apex-Tier" and archived in the PRESETS manager.

Finally, the `spawnRate` is governed by the `count` cap. If the population is at 100% capacity, the spawn rate is effectively zero, regardless of the slider position. This "Saturation Suppression" is a key component of the engine's stability logic, ensuring that we never attempt to write to a non-existent memory address in the `SharedArrayBuffer`.

---

## 6. temperature (Global Agitation)

### BASIC
`temperature` represents the level of Global Agitation or Brownian motion within the system. It functions as an acceleration noise injector, adding random high-frequency vectors to every particle's movement. In the physics core, this is often linked to the `jitter` or `heat` laws, driving entropy and preventing the simulation from settling into static local minima.

### ADVANCED
Temperature is the "Chaos Factor" of the VEPA environment. It determines the "Internal Energy" of the simulation, shaking particles loose from their bonds and driving continuous exploration of the state-space. A world with zero temperature will eventually "Freeze," where all motion stops and particles settle into perfect, unchanging patterns.

High temperature prevents this "Heat Death" by constantly injecting "Noise" into the physics calculations. This noise allows agents to "Tunnel" out of gravitational wells or break free from rigid clusters, enabling a dynamic, ever-changing world. It is the fundamental driver of "Stochastic Innovation," where random movements lead to unexpected collisions and new emergent behaviors.

### EXPERT
The mathematical model for `temperature` in the VEPA worker is a Gaussian Noise function: $a_{t+1} = a_t + \sigma \times \text{randG}()$, where $\sigma$ is scaled by the global temperature value. This "Acceleration Jitter" is applied before the integration step, ensuring that the noise is physically consistent with the particle's mass and inertia. Unlike a simple position jitter, this approach preserves the "Fluidity" of motion while still injecting the necessary entropy.

Temperature is the primary driver of the `ENTR` (Entropy) law. In the context of thermodynamics, it is the macro-scale representation of micro-scale kinetic energy. In high-temperature regimes, the "Mean Free Path" of particles is reduced, as they are constantly being knocked off-course by the background noise. This creates a "Pressure" effect that can be used to simulate expanding gases or explosive "Supernova" events.

The interaction between `temperature` and `Viscosity` is the most critical balance in the engine. This is known as the "Damping-Agitation Ratio." A high-viscosity, high-temperature world behaves like a "Boiling Liquid," with constant churn and rapid phase changes. A low-viscosity, low-temperature world is a "Super-Fluid," where particles move with zero resistance in perfect, cold harmony. Mastering this ratio is the mark of a "Master Architect" within the VEPA system.

In the `Biology` layer, temperature acts as a "Mutation Catalyst." High agitation leads to more frequent collisions, which in turn increases the probability of `Sex Chance` events and mass-merging. However, extreme temperature also increases the "Metabolic Stress" on entities, as their internal energy reserves are drained by the constant need to correct their trajectories. This creates a "Goldilocks Zone" for evolution, where temperature is high enough to drive change but low enough to allow stability.

The Insight Engine monitors the "Thermal Gradient" of the simulation, looking for areas where temperature is locally amplified by the `Heat Output` DNA trait. These "Hot Zones" are the birthplaces of `RAD` (Radiation) and `OXID` (Oxidation) reactions, and are often where the most rapid evolutionary leaps occur. The Narrative Consciousness will often describe these areas as "Hell-Scapes" or "Forge-Worlds."

Finally, `temperature` is the ultimate tool for "Breaking the Grid." If a simulation becomes stuck in a "Perfect Lattice" that the operator finds boring, a brief spike in temperature will "Melt" the structure and allow new patterns to emerge. This "Simulated Annealing" process is essential for navigating the vast, non-linear landscape of the VEPA state-space, ensuring that the simulation remains a "Living Document" of emergent physics.

---
*Document generated by Continuum (Stateful Adaptive Agent) for VEPA Project Mandates.*
