# VEPA EXPANDED DOCUMENTATION: BATCH 03
## World Setup: Boundaries & Scaling

This batch focuses on the fundamental spatial constraints and scaling laws that govern the VEPA environment. These parameters define the topology, extent, and initial conditions of the simulation volume, serving as the canvas upon which emergent behaviors are etched.

---

### 1. dimZ (Map Depth)

*   **BASIC:**
    Volumetric depth for 3D simulation, focal layer control, and volumetric extent. `Map Depth (Z)` sets the size of the world along the Z-axis, effectively extending the interaction field from a 2D plane into a 3D volume. It controls the depth layer for 3D-aware laws like Vortex or Sphere distribution. Z-axis scaling is essential for true volumetric clusters and complex 3D lattice formations, providing the necessary "room" for multi-layered structural emergence.

*   **ADVANCED:**
    The `dimZ` parameter extends the simulation beyond the two-dimensional plane, introducing a true volumetric coordinate system. By defining the depth of the interaction field, it allows for the emergence of complex structural topologies that are impossible in 2D, such as spherical shells and threaded filaments.

    In the VEPA engine, `dimZ` acts as a primary constraint for spatial grid partitioning. It ensures that 3D-aware laws, including certain distribution modes and gravitational calculations, respect the volumetric bounds of the world. This prevents coordinate overflow and ensures consistent energy density across all three axes.

*   **EXPERT:**
    At the expert level, `dimZ` is more than a simple spatial bound; it is a fundamental regulator of the system's dimensionality ($D$). When `dimZ` is set to near-zero, the engine effectively collapses into a 2.5D state, where Z-axis interactions are constrained but still influence focal rendering and parallax. However, as `dimZ` scales to match `dimX` and `dimY`, the simulation enters a fully volumetric regime, requiring the Insight Engine to track cluster density across three-dimensional voxels.

    This volumetric expansion significantly increases the state-space complexity of the simulation. In a true 3D field, the number of potential neighbors within a given `Neighborhood Radius` grows cubically rather than quadratically. This necessitates precise tuning of the `dimZ` parameter to balance structural complexity with the computational overhead of the spatial hashing algorithm used in the physics worker.

    The Z-axis also introduces the concept of "Focal Planes" into the rendering pipeline. Particles are sorted by their Z-position, allowing for complex occlusions and depth-of-field effects that enhance the observer's spatial awareness. This depth-sorting is not merely aesthetic; it allows for the visual identification of "Core" and "Shell" structures in dense 3D clusters.

    Furthermore, `dimZ` is intrinsically linked to the `DIME` (Dimensionality) Metaphysics Law. When `DIME` is active, particles can utilize the Z-axis to "phase" around collisions that would be unavoidable in a 2D plane. This leads to the emergence of "Interlaced Lattices," where two distinct species can occupy the same XY coordinates while remaining spatially separated along the Z-axis, creating a multi-layered ecosystem.

    The volumetric extent also governs the propagation of 3D wave-fronts. In a high-depth environment, `GLOW` pulses travel as expanding spheres rather than expanding circles. This change in propagation geometry fundamentally alters the speed and reach of signal-based coordination, as the energy of a sphere-wave dissipates at a rate of $1/r^2$ instead of $1/r$.

    Experts use `dimZ` to simulate "Gravitational Wells" with true volumetric depth. By increasing depth, the "Mass Density" of a region can be distributed more sparsely, preventing the instant collapse into a singularity that often plagues 2D high-gravity simulations. This allows for the formation of stable, rotating 3D "Galaxies" that exhibit complex spiral arm structures across multiple Z-layers.

    Finally, `dimZ` interaction with `BoundaryType` creates unique topological challenges. In a 3D `Periodic` world, the volume behaves as a 3-Torus ($T^3$). This triple-wrap topology creates a perfectly seamless environment where a particle moving along any axis eventually returns to its origin, allowing for the study of infinite volumetric fluid dynamics without the interference of rigid walls.

---

### 2. boundaryType (Spatial Containment)

*   **BASIC:**
    Spatial containment logic (Solid/Periodic/Void/Sticky), gravity settlement, and tracking bias. `boundaryType` determines what happens when particles reach the edge of the world. Options include `Periodic` (Toroidal Wrap), `Solid` (Bounce), `Void` (Deletion), and `Sticky` (Zero Velocity). Periodic boundaries are essential for continuous field simulations without edge effects, while Solid boundaries are used for terrestrial environments.

*   **ADVANCED:**
    The `boundaryType` defines the topological "shape" of the universe and its interaction with matter at the limits of the coordinate system. By switching between Periodic and Solid modes, the engineer can choose between an infinite-looping toroidal space or a constrained, box-like environment.

    Sticky and Void boundaries provide mechanisms for mass removal and energy sink formation. A `Sticky` boundary simulates an adhesive event horizon, effectively freezing particles upon contact, while `Void` boundaries act as absolute sinks, purging any matter that crosses the system threshold to maintain equilibrium.

*   **EXPERT:**
    The selection of `boundaryType` fundamentally alters the conservation laws within the VEPA environment. In a `Periodic` topology, momentum and energy are perfectly conserved as they cycle through the wrap-around points ($x_{max} \to x_{min}$), creating a "closed-loop" system ideal for observing long-term thermal equilibrium. This mode eliminates "edge bias," ensuring that clusters are formed solely through local DNA interactions rather than boundary reflections.

    Conversely, the `Solid` boundary introduces "Reflective Feedback," where the world edges act as rigid planes. This leads to the formation of "Boundary Layers," where particles accumulate due to reflected pressure, simulating a terrestrial or containerized environment. This mode is often paired with the `PLANET` law to create stable ground-state architectures where gravity and floor-collisions govern the global layout.

    When `Solid` boundaries are used with `Torque`, they create "Vortex Compression." As rotating clusters hit the world edge, they are forced to flatten and re-orient their angular momentum, leading to the emergence of "Wall-Following" behaviors. This can be used to simulate biological entities searching for exits or navigating the internal geometry of a vessel.

    The `Sticky` type represents a "Lossy System" where kinetic energy is converted into static potential. Particles that hit a `Sticky` boundary are stripped of their velocity vectors, becoming "Anchors" for future accretion. Over time, this results in the formation of a "Crystalline Crust" at the world's edge, which can grow inward to eventually consume the entire simulation volume if not managed.

    `Void` boundaries, however, are used for "Entropy Management." They allow the system to shed excess mass during runaway reproduction events, effectively acting as a cooling vent for the simulation's metabolic engine. In a `Void` world, only species that can maintain central cohesion or develop "Evasion DNA" will survive, as the edges represent certain death.

    The interaction between `boundaryType` and `WRAP` is particularly subtle. If `WRAP` is disabled while `boundaryType` is set to `Periodic`, the engine may experience "Coordinate Drift," where particles move beyond the rendering bounds but continue to be processed. Expert tuning ensures that the `boundaryType` logic is always synchronized with the global `WRAP` law to prevent such memory leaks and maintain SSOT integrity.

    Finally, `boundaryType` can be used to simulate "Pressure Chambers." By combining `Solid` boundaries with high `Force` repulsion, the engineer can create a high-pressure environment where matter is squeezed into ultra-dense states. This is a primary method for testing the `Reaction Threshold` and `Crystallization` laws under extreme systemic stress.

---

### 3. baseSize (Global Scaling)

*   **BASIC:**
    Global world scale multiplier, visual scaling, and contact area for collisions/glow. `baseSize` scales the visual representation of all particles and interactions, acting as a global rendering scale factor. It can be used to "zoom in" on micro-interactions or see the "big picture" without changing the underlying physics logic, ensuring that the visual interface remains readable across different world magnitudes.

*   **ADVANCED:**
    `baseSize` is the primary scalar for the engine's rendering pipeline and collision detection sensitivity. It decouples the mathematical coordinate system from the visual manifestation of matter, allowing for granular control over the "apparent density" of the simulation.

    Adjusting `baseSize` affects the "Contact Area" for elastic collisions and signaling pulses. Larger values increase the visual and functional overlap of particles, leading to more frequent interactions and a "thicker" feel to the emergent soup, while smaller values favor discrete, needle-like dynamics.

*   **EXPERT:**
    In the VEPA architecture, `baseSize` serves as the fundamental link between the `SSOT` (Single Source of Truth) state and the PixiJS rendering layer. While the physics worker operates on normalized mass units, the `baseSize` translates these units into pixel-space coordinates and hit-box radii. This scaling is non-linear; it influences not only the visual sprite size but also the "Aura Radius" used for `GLOW` pulses.

    An expert-level application of `baseSize` involves using it as a "Phase Transition Trigger." By scaling the global world size while keeping `dimX/Y` constant, the engineer can effectively compress or dilate the interaction space. This can force a "Critical Density" event where the mean free path of particles becomes shorter than their `Base Radius`, triggering instant crystallization.

    `baseSize` also dictates the "Collision Precision" of the engine. At very low `baseSize` values, the spatial grid becomes extremely dense, allowing for sub-pixel collision resolution that is essential for simulating microscopic biological processes. Conversely, high `baseSize` values are used for macro-scale celestial simulations where individual particle detail is less important than global mass distribution.

    Furthermore, `baseSize` interacts with the `PHENOTYPE` law to define the "Scaling Law" of a species. If `PHENOTYPE` is active, individual DNA traits may override the `baseSize` multiplier for specific particles, creating a diverse ecosystem of "Giant" and "Nano" species within the same world. This allows for the study of hierarchical structures where large "carrier" particles are influenced by the high-frequency vibrations of smaller neighbors.

    The global scale also affects the perceived "Viscosity" of the world. At a large `baseSize`, motion appears slower and more majestic, as particles must travel more screen-space to reach their neighbors. This "Temporal Dilation" effect is purely visual but critical for the observer's ability to track complex multi-particle interactions in real-time.

    Expert engineers often use `baseSize` to balance the "Visual Budget" of the simulation. By increasing `baseSize` and decreasing the `count` of particles, one can create a high-fidelity "Hero Particle" simulation with rich visual feedback. Alternatively, a low `baseSize` and high `count` enable the study of large-scale fluid dynamics where the individual particle is just a single voxel in a massive flow.

    Finally, `baseSize` is critical for the "Tactile Feedback" loop. Every parameter shift in the UI is scaled by `baseSize` before being presented to the user. This ensures that a 10% increase in `Force` feels just as significant in a micro-scale world as it does in a galactic-scale one, maintaining a consistent "feel" for the engine's controls.

---

### 4. shape (Geometric Bias)

*   **BASIC:**
    Distribution bias (Ellipticity) and galaxy/torque eccentricity. `shape` defines the geometric bias of the initial particle seeding. It controls the eccentricity and ellipticity of the world, influencing whether matter starts as a uniform cloud or a distorted formation. This parameter is foundational for setting the global orientation of the simulation.

*   **ADVANCED:**
    The `shape` parameter introduces geometric anisotropy into the simulation's initial state. By adjusting the eccentricity, the engineer can shift the world from a perfect sphere into an elliptical formation, mirroring the structural bias found in galactic disks or planetary rings.

    This geometric bias is crucial for jumpstarting rotational dynamics. When combined with distribution modes like `Spiral`, the `shape` eccentricity determines the "tightness" of the arms and the overall torque bias, favoring the emergence of elongated structures over simple isotropic clusters.

*   **EXPERT:**
    At the expert level, `shape` is used to define the "Symmetry Breaking" of the initial conditions. In a perfectly isotropic world, structures form randomly based on local fluctuations. However, by applying a non-zero `shape` eccentricity, the engineer can "seed" a global orientation, forcing the Insight Engine to detect emergent "Axes of Influence" that govern future growth.

    The interaction between `shape` and `Torque` is a primary driver of "Lattice Eccentricity." If a world is seeded with high ellipticity, the resulting structures will tend to align their `Bond Angles` with the major axis of the initial distribution. This creates "Filamental Order," where long-range chains are formed more easily along the world's "length" than its "width."

    `shape` also influences the "Angular Momentum Distribution" ($L$) of the seeding phase. In an elliptical world, particles on the major axis have higher potential energy relative to the center than those on the minor axis. When the simulation starts, this differential energy is converted into complex orbital paths that prevent the cluster from settling into a simple boring sphere.

    Furthermore, the `shape` parameter can be used to simulate "Tidal Stretching" at the systemic level. By setting an extreme eccentricity, the engineer can force particles into a needle-like formation, simulating the effects of a nearby massive black hole. This "Spaghettification" of the initial soup is a rigorous test for the `Stiffness` and `Bonding` laws of any species.

    Expert configurations often pair `shape` with `distributionType: Sphere` to create "Disk Galaxies." The `shape` value flattens the sphere along the Z-axis, while `Torque` provides the necessary spin to maintain the disk structure against gravitational collapse. This multi-parameter coordination is the hallmark of advanced VEPA engineering.

    In biological simulations, `shape` can be used to seed "Niche Environments." An elongated world might have high-density "Poles" and a low-density "Equator," forcing species to adapt to different pressure regimes. This leads to "Geographic Speciation," where the same starting DNA diverges into two distinct phenotypes based on their starting location in the elliptical field.

    Finally, `shape` is a critical input for the "Narrative Consciousness." The `Observer` voice will often comment on the "Structural Symmetry" of the world. A perfectly circular world might be described as "Stable and Harmonious," while a highly eccentric elliptical world might trigger warnings of "Impending Chaotic Divergence."

---

### 5. distributionType (Seeding Modes)

*   **BASIC:**
    Seeding modes (Soup/Spiral/Vortex/Sphere) and initial velocity vectors. `distributionType` selects the initial spatial arrangement of particles during a world restart. It determines how particles are seeded—ranging from a chaotic 'Soup' to ordered 'Spiral' or 'Vortex' patterns—and can include initial velocity vectors to jumpstart dynamic behaviors.

*   **ADVANCED:**
    `distributionType` is the "Big Bang" controller for the VEPA engine. It defines the starting configuration of matter, whether as a uniform `Soup`, a structured `Spiral`, or a high-energy `Vortex`. Each mode provides a unique starting point for evolutionary exploration.

    Structured modes like `Spiral` and `Vortex` do not just set positions; they also inject "Initial Kinetic State." This means particles start with pre-calculated velocity vectors, allowing the system to bypass the slow ramp-up of gravitational attraction and immediately enter a state of high-momentum interaction.

*   **EXPERT:**
    The `distributionType` selection is a critical choice for "Phase Space Initialization." A `Soup` distribution (Uniform Noise) represents a high-entropy state where structure must emerge entirely from DNA interactions. In contrast, a `Sphere` or `Vortex` distribution represents a low-entropy, highly ordered state where the challenge is to maintain that order against the eroding forces of `JITTER` and `ENTR` (Entropy).

    The `Spiral` mode implements a multi-arm logarithmic distribution, where particle density increases toward the center while velocity vectors are aligned for orbital stability. This is the ideal mode for studying "Galactic Evolution," as it sets up a balance between centrifugal expansion and gravitational collapse from frame zero.

    The `Vortex` mode is even more specialized, injecting a high-magnitude rotational vector that creates a "Shear Gradient." This is essential for studying "Fluid Turbulence" and the formation of "Vortex Streets." In this regime, the `distributionType` effectively defines the "Reynolds Number" of the initial state, determining whether the simulation will settle into laminar flow or erupt into chaotic eddies.

    `Sphere` distribution creates a dense central core with a rapidly decaying density gradient. This mode is used to simulate "Stellar Ignition" scenarios, where the central pressure is so high that `Fusion` events occur almost instantly. The resulting "Super-Massive" particle then governs the remaining gas cloud, creating a proto-planetary system.

    Expert engineers can also utilize "Custom Distributions" via the `SSOT` API. By injecting specific coordinate-velocity pairs, one can create "Multi-Body Collisions" or "Interacting Galaxies" to test the robustness of structural bonds. This level of control allows for the creation of "Benchmark Scenarios" that are used to validate the physics worker across different engine versions.

    The choice of distribution also affects the "Insight Engine's" early tracking. A `Spiral` distribution will immediately show high "Structural Coherence" scores, while a `Soup` will start at zero. Monitoring how these scores evolve from different initial distributions is a primary method for determining the "Fitness Landscape" of a given DNA sequence.

    Finally, `distributionType` interacts with `BoundaryType`. A `Vortex` in a `Solid` box will eventually "Self-Extinguish" as it hits the walls and loses momentum, while a `Vortex` in a `Periodic` world can continue to spin indefinitely, creating a stable "Global Flow" that carries all matter in a contiguous loop.

---

### 6. spreadRadius (Initial Density)

*   **BASIC:**
    Density of initial seeding and area scaling relative to dimensions. `spreadRadius` controls the density of the initial seeding by scaling the area over which particles are distributed. Lower values create tight, high-pressure clusters; higher values create a sparse, uniform field across the world dimensions.

*   **ADVANCED:**
    `spreadRadius` acts as the "Expansion Factor" for the initial distribution. It allows the engineer to concentrate the entire initial mass into a singular, high-density core or scatter it across the far reaches of the simulation volume.

    This parameter is a key regulator of "Initial Collision Frequency." A low `spreadRadius` forces immediate, intense interaction among the seeded particles, which is ideal for triggering rapid `Fusion` events and the early formation of massive "Seeder Bodies" that will eventually govern the world's dynamics.

*   **EXPERT:**
    At the expert level, `spreadRadius` is the primary tool for managing "Spatial Entropy." It defines the "Mean Inter-Particle Distance" ($\lambda$) at the start of the simulation. By tuning `spreadRadius` in relation to the `Neighborhood Radius`, the engineer can control the "Initial Connectivity" of the system.

    If $spreadRadius < Neighborhood Radius$, the simulation begins in a "Fully Connected" state, where every particle can immediately signal every other particle. This leads to instant global synchronization and often a rapid collapse into a singular mass, as the gravitational influence of the cluster is felt equally by all members.

    Conversely, a high `spreadRadius` creates a "Fragmented Initial State." Particles are isolated in small, disconnected pockets, forcing them to evolve in a "Resource-Poor" environment where they rarely encounter others. This "Seeding Isolation" is essential for studying "Allopatric Speciation" and the divergent evolution of isolated populations.

    `spreadRadius` also interacts dynamically with the `VOID` law. In a world with high vacuum pressure, a tight `spreadRadius` creates a "Habitable Island" surrounded by an expanding void. Particles that drift beyond the `spreadRadius` threshold are quickly evaporated by the `VOID` law, creating a sharp survival boundary.

    The parameter is also a major factor in "Heat Management." A low `spreadRadius` leads to high-frequency collisions, which can cause local temperatures to skyrocket if `Heat Output` is active. This can trigger premature `Melting` or `Boiling` phase changes, destroying any stable structures before they have a chance to form.

    Expert users often use `spreadRadius` to calibrate the "Energy Density" of the starting state. In a `PLANET` world, a tight `spreadRadius` at the "Top" of the map creates a high-velocity "Rain" effect as particles fall under gravity. This can be used to simulate atmospheric entry or the impact of a comet-swarm on a stable ground-state ecosystem.

    Finally, `spreadRadius` is the ultimate test of the "Spatio-Temporal Grid." An extremely low `spreadRadius` puts massive stress on a single grid cell, testing the engine's ability to handle "Sub-Cell Overcrowding." Ensuring the physics worker remains stable under these "Singularity-Like" conditions is a core requirement for any production-grade VEPA build.
