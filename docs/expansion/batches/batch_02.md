# VEPA EXPANDED DOCUMENTATION: BATCH 02
## WORLD ENVIRONMENT: SPATIAL

This batch covers the fundamental spatial and environmental parameters of the VEPA (Vector Emergent Physics Automata) engine. These parameters define the "Stage" upon which all biological and physical interactions occur.

---

### 1. PRESSURE
**ID:** `pressure`
**Category:** Physics / Thermodynamics

#### **BASIC**
Repulsive compression force that opposes gravitational collapse. It simulates ambient density-dependent repulsion, preventing infinite density in local clusters. Systemically, it acts as a subtractive component in N-body force calculations, scaling inversely with distance up to a 200-unit interaction threshold. High pressure values can stall star-like formations or drive explosive dispersion in high-density "soup" environments.

#### **ADVANCED**
Pressure functions as the primary thermodynamic counterbalance to gravitational attraction within the VEPA environment. By applying a distance-gated repulsive vector, it ensures that matter does not collapse into singular points, maintaining the structural integrity of emergent clusters. This parameter is critical for tuning the "breathability" of a simulation, allowing for loose, gaseous clouds or dense, rigid kernels depending on the balance between force and repulsion.

When tuned correctly, pressure enables the formation of stable, non-collapsing structures like planetary rings or multi-species lattices. It introduces a non-linear stability layer where the energy of attraction is dissipated through spatial rejection, effectively acting as a volume-occupancy proxy. Without pressure, the simulation tends toward total singularity or chaotic Brownian noise with no mid-scale organization.

#### **EXPERT**
At the implementation level, pressure is integrated directly into the gravitational force resolution loop. For every pair of particles within the 200-unit interaction horizon, the engine calculates a repulsive scalar: `pressure * (1.0 - d / 200) * 5.0`. This value is subtracted from the gravitational attraction constant, effectively creating a "soft" collision volume that scales with the density of the local neighborhood.

The 200-unit threshold is a hardcoded spatial constant that defines the maximum range of the compression field. Within this range, the repulsion is linear, peaking at distance zero. This ensures that even at extreme gravitational magnitudes, particles maintain a minimum separation distance unless the `ACCR` (Accretion) law is active and overrides the repulsion through mass-merging events.

Mathematically, pressure acts as a local entropy booster that is spatially aware. Unlike the `ENTR` law, which applies random jitter regardless of neighbor state, pressure responds specifically to the proximity of other matter. This makes it a superior tool for simulating fluid-like behaviors where particles "push" against each other to occupy volume, leading to emergent convection and flow patterns when combined with the `CONV` law.

In high-count simulations, the computational cost of pressure is minimal as it piggybacks on the existing N-body spatial grid search. By adjusting the pressure constant, an operator can shift the entire simulation from a cold, collapsing Newtonian system to a hot, expanding inflationary field. It is the primary dial for "Cosmic Inflation" effects, often used in the `VOID_CORE` preset to prevent the central singularity from becoming a performance bottleneck.

Advanced operators utilize pressure to create "Negative Gravity" zones by setting the base `Force` to zero and increasing `pressure`. This transforms the simulation into a pure repulsion field, ideal for testing the efficiency of the `WRAP` boundary logic or simulating the expansion of high-energy gases. The interplay between species-specific `Force` and global `pressure` is the cornerstone of complex ecological balance in VEPA 3.0.

---

### 2. WIND (X)
**ID:** `windX`
**Category:** Environment / Motion

#### **BASIC**
Global constant acceleration vector applied along the horizontal axis. It simulates a persistent directional flow, often used for "carousel" effects in toroidal space or terminal drift in planetary environments. Systemically, it is injected directly into the acceleration buffer before integration, bypassing the spatial grid to ensure absolute global consistency.

#### **ADVANCED**
WindX represents the primary horizontal flux of the simulation environment. By introducing a constant bias to the velocity of every particle, it breaks the symmetry of the toroidal space and forces particles into a perpetual migration pattern. This is particularly effective for testing the robustness of species-tracking algorithms and signal propagation in high-drift scenarios.

When combined with the `WRAP` law, WindX creates a "Stream" effect where the entire population cycles through the viewport at a controlled rate. This prevents the formation of static, "stale" clusters and ensures that every entity is subjected to the full range of spatial interactions over time. It is a vital tool for preventing local minima in evolutionary simulations.

#### **EXPERT**
The implementation of WindX is a direct vector injection: `ax += windX`. This occurs outside the N-body and Law-processing blocks, making it one of the most computationally efficient ways to add kinetic energy to the system. Because it is applied uniformly to all particles regardless of mass, it functions as a Galilean transformation of the reference frame, rather than a physical force that respects inertia—though the subsequent velocity integration does respect the `Inertia` DNA trait.

In `PLANETARY` mode, WindX simulates atmospheric trade winds. When coupled with `dimY` constraints, it can create complex layering effects where particles at different heights experience different relative drifts due to the interaction with ground friction. This allows for the simulation of stratified ecosystems where "high-altitude" species are swept away while "ground-dwellers" remain stable.

From a narrative perspective, the `Diverger` often interprets high WindX as a "Great Migration" event. The constant horizontal pressure forces species to adapt their `Signal Resp` and `Tidal` traits to maintain cluster coherence. If a species cannot overcome the wind-induced separation through attraction, it will inevitably fragment, leading to a "Thin Soup" state where individual survival is prioritized over swarm intelligence.

Advanced use cases involve oscillating WindX via external scripts to simulate "Seasons" or "Tides". By pulsing the horizontal acceleration, an operator can induce rhythmic contractions and expansions in the population, driving a "Pump" mechanism that can accelerate mutation rates or trigger mass extinction events. It is the fundamental control for lateral system-wide momentum.

---

### 3. WIND (Y)
**ID:** `windY`
**Category:** Environment / Motion

#### **BASIC**
Global constant acceleration vector applied along the vertical axis. In standard space, it creates a persistent vertical drift; in `PLANETARY` mode, it functions as an additional gravity or buoyancy layer. Systemically, it is added to the total acceleration prior to velocity update, influencing the vertical traversal rate across the toroidal wrap horizon.

#### **ADVANCED**
WindY controls the "up-down" momentum of the simulation, often serving as a proxy for buoyancy or heavy-gravity environments. In a toroidal setup, it drives a continuous vertical cycle, forcing particles to encounter different horizontal "strata" if WindX is also present. This is essential for creating "Vortex" or "Cyclone" emergent behaviors when combined with high `Torque` DNA.

In planetary simulations, WindY is frequently used to counteract the default `PLANET` gravity, simulating a "Lift" force or a thick, buoyant atmosphere. This enables the existence of "Floaters"—species with low mass and high surface area that can effectively "surf" the vertical winds to avoid ground-level predation.

#### **EXPERT**
Technically, WindY is injected as `ay += windY`. In the physics worker, this is calculated alongside the `PLANET` gravity constant (0.2). If WindY is set to -0.2, it effectively negates planetary gravity for all particles, creating a pseudo-zero-G environment within a bounded ground/ceiling box. This is a common technique for simulating underwater or high-density gas environments.

The interaction between WindY and the `CONV` (Convection) law is particularly complex. `CONV` applies a vertical force based on a particle's internal `Energy` state (simulating heat-induced buoyancy). WindY acts as the "Background" flow upon which these thermal fluctuations are layered. If WindY is significantly stronger than the convection scalar, the thermal loops will be "stretched" or "collapsed" into a unidirectional flow.

Narratively, the `Stabilizer` views WindY as a "Sorting Force". Because the force is constant but its effect on velocity is moderated by `Inertia` and `Mass`, it effectively separates the population by weight over long time scales. Dense, heavy-mass species will sink or rise slower than lightweight ones, leading to vertical segregation of the biomass—a phenomenon known as "Atmospheric Stratification".

Operators can use WindY to trigger "Mass Fallback" events, where a sudden increase in downward wind forces the entire population into the ground-plane, testing their `Elasticity` and `Collision` resolution under extreme pressure. It is also the primary mechanism for simulating "Rain" or "Snow" effects, where particles are spawned at the ceiling and swept downward at a constant terminal velocity.

---

### 4. WIND (Z)
**ID:** `windZ`
**Category:** Environment / Motion

#### **BASIC**
Global constant acceleration vector applied along the depth axis. It controls the "in-out" drift in 3D-aware simulations, enabling volumetric migration patterns. Systemically, it influences the Z-position wrap-around logic, ensuring that clusters don't remain stuck in a single depth plane.

#### **ADVANCED**
WindZ is the third dimension of the global flow, essential for true volumetric simulation. It prevents the simulation from collapsing into a pseudo-2D state by forcing particles to move through the depth layers of the spatial grid. This is vital for the health of 3D lattice structures, as it ensures that energy and signals are distributed across the entire 1000x1000x1000 volume.

In simulations utilizing the `Sphere` or `Cylinder` distribution types, WindZ adds a "Spin" or "Tunneling" effect. By pushing particles through the Z-axis, it creates a sense of depth and motion that is visually striking and physically necessary for avoiding "Grid Locking" in high-density regions.

#### **EXPERT**
Implementation: `az += windZ`. While WindX and WindY are often the primary drivers of visual motion on a 2D screen, WindZ is the "Invisible Hand" that manages the spatial grid density along the depth axis. By shifting particles between Z-cells, WindZ forces the `GRID_SIZE` optimization to frequently re-evaluate neighbor pairs, preventing "Ghost Bonds" that can occur when particles remain perfectly stationary in a cell.

The Z-axis is often the least constrained by laws like `PLANET` (which only affects Y). This makes WindZ a "Pure" drift parameter that can be used to simulate the expansion of the universe in a 3D-toroidal manifold. It is the primary tool for creating "Infinite Void" effects, where particles seem to emerge from the distance and disappear into the foreground.

From an engineering perspective, WindZ is critical for testing the `invD` (inverse depth) projection logic in the rendering layer. High WindZ values cause particles to rapidly scale and fade as they move through the `focalLength` (3000 units). This stresses the PIXI sprite management and ensures that the engine can handle fast-moving volumetric data without visual artifacts or depth-sorting glitches.

In the `NEURAL_DRIFT` preset, WindZ is often used to create "Longitudinal Waves". By applying a Z-axis bias, the operator can induce waves of signal propagation that move "through" the mesh rather than just "across" it. This adds a layer of complexity to the hive-mind logic, as signals must now account for a three-dimensional propagation delay.

---

### 5. DIMENSION (X) / WIDTH
**ID:** `dimX`
**Category:** World / Spatial

#### **BASIC**
The horizontal extent of the simulation space. It defines the toroidal wrap-around point and the bounding box for all spatial interactions. Systemically, it is used to calculate the spatial grid partitions and the `invW` scaling factor, directly impacting the performance and resolution of the N-body search.

#### **ADVANCED**
DimX sets the "Stage" for horizontal movement. It determines how far a particle must travel before it "wraps" back to the other side, effectively defining the wavelength of any emergent horizontal patterns. A larger DimX allows for more sparse distributions and reduces the frequency of "Global Coupling" where a single particle's signal reaches everyone instantly.

Adjusting DimX is the primary way to control population density without changing the `count` parameter. By expanding the width, an operator can "cool" the simulation, reducing the number of collisions and allowing for more stable, isolated development of species. Conversely, shrinking DimX "heats" the system, forcing frequent interactions and aggressive competition.

#### **EXPERT**
At the core of the physics worker, `W` (dimX) and its inverse `invW` are foundational constants. They are used in the spatial grid reconstruction to map every particle's `POS_X` to a grid cell coordinate: `gx = Math.floor(((px * invW) + 0.5) * (GRID_SIZE - 1))`. This mapping is the bottleneck of the entire engine; any change to DimX requires a total rebuild of the grid to maintain spatial accuracy.

The toroidal wrap logic depends on the half-width `hw = W / 2`. When a particle's position exceeds `hw`, it is shifted by `W` in the opposite direction. This creates a seamless, non-Euclidean space where there are no "Edges", only "Horizons". This is mathematically equivalent to simulating the surface of a 3D donut (torus) projected onto a flat coordinate system.

DimX also influences the `dx` calculation in pair-wise forces. To support wrap-around interactions, the engine must check if the shortest distance between two particles is "across the seam". This is done via: `if (dx > hw) dx -= W; else if (dx < -hw) dx += W;`. This logic ensures that gravitational attraction and collisions work correctly even when particles are on opposite sides of the screen.

In high-performance scenarios, operators must balance DimX against the `GRID_SIZE`. If DimX is too large relative to the number of cells, the grid becomes sparse and inefficient. If it is too small, cells become overcrowded, hitting the `MAX_CELL_CAPACITY` (100) and causing particles to "ignore" each other—a phenomenon known as "Density Blindness". Optimal DimX for 1000 particles is usually between 800 and 1500 units.

---

### 6. DIMENSION (Y) / HEIGHT
**ID:** `dimY`
**Category:** World / Spatial

#### **BASIC**
The vertical extent of the simulation space. It defines the wrap-around point for the Y-axis and, in `PLANETARY` mode, the total height from ground to ceiling. Systemically, it is used for vertical spatial grid partitioning and the `invH` scaling factor, governing the resolution of vertical interactions.

#### **ADVANCED**
DimY defines the "Depth" or "Height" of the world's vertical axis. In standard toroidal mode, it acts identically to DimX, providing a vertical wrap-around. However, in `PLANETARY` mode, it creates a hard boundary at `H/2`, simulating a floor. This transforms the simulation from a free-floating space into a terrestrial environment where height becomes a precious resource.

By increasing DimY, an operator can simulate a deep atmosphere or a vast ocean. This allows for more vertical diversity in species behavior, where some might evolve to stay near the "Sky" (the top wrap-around or ceiling) while others stay pinned to the floor. It is the fundamental parameter for creating "Gravity Wells" and "High-Altitude" niches.

#### **EXPERT**
Implementation: `H` (dimY) and `invH`. The vertical grid coordinate `gy` is calculated as: `gy = Math.floor(((py * invH) + 0.5) * (GRID_SIZE - 1))`. Like DimX, this is central to the spatial partitioning logic. In `PLANETARY` mode, the wrap logic for Y is disabled and replaced with collision checks against `hh = H / 2`.

When `PLANET` is active, the ground is located at `py = H / 2`. Particles hitting this limit have their vertical velocity reversed and scaled by 0.8: `if (py > hh) { py = hh; vy *= -0.8; }`. This creates a bouncy, high-friction surface. The total Height `H` thus determines the "Ceiling" of the world; if a particle travels too far "Up" (negative Y), it will eventually hit the upper boundary, which may wrap or block depending on the `Boundary` setting.

The interaction between DimY and the `CONV` (Convection) law is critical. Convection forces are scaled by the vertical position relative to the "Ground" and "Ceiling". In a small DimY, convection loops are tight and energetic. In a large DimY, they become slow, sweeping cycles that can take thousands of frames to complete, allowing for the formation of distinct atmospheric layers with different species compositions.

From a UI perspective, DimY is often linked to the camera's panning limits. If the world is very "Tall", the camera must be able to scroll or zoom out significantly to see the whole system. The `Minimap` also uses `dimY` to normalize the vertical position of entities: `50 + py / (dimY / 100)`. This ensures that the macro-view always reflects the true proportions of the simulation volume.
