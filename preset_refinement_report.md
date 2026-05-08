# VEPA Presets: Research, Physics & Simulation Context

This report compiles real-world physics, biological concepts, and standard simulation techniques (from industry/academic references) to ground the 9 presets configured in VEPA. It details how others simulate these systems and how those approaches mapped onto the final parameters chosen for `PRIME_DEFAULT` and the 8 distinct presets.

---

## 1. PRIME_DEFAULT
*   **Concept**: Baseline control universe.
*   **Implementation**: A balanced Newton/Euler environment with moderate gravity (G=0.15), fluid drag, and elastic collisions. It explicitly defines the "Sol" (Yellow, High Attraction/Fusion), "Aether" (Blue, Fluid/Responsive), and "Void" (Red, Repulsive/Mutative) species as the baseline tri-state.

## 2. VOID_CORE
*   **Concept**: Black hole singularity with Hawking Radiation (Evaporative Decay).
*   **Real Physics**: A non-rotating Schwarzschild black hole has an event horizon where $R_s = \frac{2GM}{c^2}$. Due to quantum effects, it emits thermal radiation (Hawking Radiation). The mass loss rate is proportional to $\frac{1}{M^2}$, meaning smaller black holes evaporate faster and hotter.
*   **How Others Simulate It**: 
    *   *Academia/Numerical Relativity*: Frameworks like the Einstein Toolkit solve semi-classical Einstein equations.
    *   *Particle Systems (Python/C++)*: Typically simulated using "Tunneling Methods" where particles spawn at $R_s$, carrying away mass from the central body using the Stefan-Boltzmann law.
*   **VEPA Application**: `pure.void` is active. The central "Singularity" species has extreme `Force` (2.0) pulling everything in. The "Hawking_Radiation" species has negative `Force` (-1.0), acting as the expelled energy that cannot reproduce (`Birth Rate` 0.0), mimicking the mass loss of the core.

## 3. NEURAL_DRIFT
*   **Concept**: Distributed mesh network with elastic routing and topology decay.
*   **Real Physics/Network Theory**: Mesh networks rely on nodes finding shortest paths or maintaining stable "tethers" (links) that degrade if signal-to-noise ratios drop.
*   **How Others Simulate It**: 
    *   *JS/Canvas Demos*: Developers use Hooke's Law ($F = -kx$) to create spring-like restoring forces between nodes within a specific `connectionDistance`. They usually apply friction/damping to prevent infinite oscillation.
*   **VEPA Application**: We rely on `pure.bond` and high `Jitter`. "Synapse" nodes form the core network. "Glial" nodes have high `Pulse Rate` to act as signal boosters. The `Neighborhood Radius` is significantly expanded (150) with high `Signal Decay` (0.95), mimicking the exact Hooke's Law tethering seen in standard JS mesh simulations.

## 4. SOLAR_FLARE
*   **Concept**: High-energy radiation emitter.
*   **Real Physics**: Coronal mass ejections and high-energy photon bursts. Radiation decreases quadratically with distance (Inverse Square Law) and disrupts biological DNA (sterilization/mutation).
*   **How Others Simulate It**: 
    *   *Games/Sims*: Often modeled via a 3D voxel grid or ray-casting where energy values decay over distance. Affected agents in the grid take damage or lose traits.
*   **VEPA Application**: `pure.rad` enables a 3D voxel grid. "Plasma" emits the radiation, while the outer "Corona" species has extreme `Jitter`. High `Heat Output` physically pushes and mutates biological agents caught in the flare radius.

## 5. CRYSTAL_LATTICE
*   **Concept**: Rigid lattice structures with conductive heat/energy flow.
*   **Real Physics**: Atoms in a crystal are locked in a lattice. Heat transfers via phonons (lattice vibrations) or free electrons.
*   **How Others Simulate It**: 
    *   *Molecular Dynamics*: LAMMPS or similar tools use Lennard-Jones potentials to simulate the steep repulsive forces that keep atoms properly spaced.
*   **VEPA Application**: `Viscosity` is pushed to 0.99 (near frozen). `Stiffness` (Lennard-Jones equivalent) is pushed to 5.0. A strict `Bond Angle` of 90 degrees forces geometric lattice formation, while high `Conductivity` shares internal state energy between the "Node" species.

## 6. PREDATOR_SWARM
*   **Concept**: Emergent swarm intelligence and predator-prey dynamics.
*   **Real Physics/Biology**: Boids algorithm (Reynolds, 1987) uses Separation, Alignment, and Cohesion. Predator-prey models use Lotka-Volterra equations.
*   **How Others Simulate It**: 
    *   *Swarm Sims*: Often use vision cones and steering behaviors. Prey flee when a predator enters their radius.
*   **VEPA Application**: The "Hunter" species has extreme `Predation Bias` (20.0), directly attracted to smaller mass. The "Prey" species has higher `Max Velocity` (40) to flee. `drag` is disabled globally to keep the chase perpetual.

## 7. KINETIC_GAS
*   **Concept**: Kinetic theory of gases in a closed system.
*   **Real Physics**: Gas molecules are in constant random motion. Macroscopic properties (pressure, temperature) emerge from perfectly elastic microscopic collisions.
*   **How Others Simulate It**: 
    *   *Physics Engines*: Bouncing balls in a box. Gravity is 0. Coefficient of restitution is 1.0 (perfectly elastic). No drag.
*   **VEPA Application**: `grav` and `drag` are disabled. `coll` and `wrap` are enabled. "Hot_Gas" has normal jitter, "Cold_Gas" has half the jitter. `Viscosity` and `Elasticity` are 1.0 (perfectly elastic, no damping).

## 8. SYMBIOTIC_LOOP
*   **Concept**: Ecosystem driven by energy sharing and horizontal gene transfer.
*   **Real Physics/Biology**: Endosymbiosis theory. Mutualistic relationships where species swap nutrients/genes for survival.
*   **How Others Simulate It**: 
    *   *Alife Sims (e.g., Tierra, Avida)*: Digital organisms share CPU cycles or memory blocks to survive culling sweeps.
*   **VEPA Application**: Global `ener` (energy conservation) is enabled. The "Host" relies on the "Symbiote" which has 10x `Energy Efficiency`. Extreme `Sex Chance` (0.8) and `Mutation` (1.0) drive rapid evolutionary adaptation.

## 9. CHRONOS_FLUX
*   **Concept**: Temporal anomaly, high inertia, tidal stretching.
*   **Real Physics**: Time dilation near massive bodies. Spaghettification (tidal forces) where the gravity gradient across an object tears it apart.
*   **How Others Simulate It**: 
    *   *General Relativity Visualizers*: Often simulate "slowed time" by increasing the computational $\Delta t$ scaling factor, or physically scaling up inertia so objects take vastly longer to accelerate/decelerate.
*   **VEPA Application**: "Temporal_Mass" has high `Inertia` (2.0) and negative `Force`. Active `Tidal` forces (1.0) stretch the "Tachyon" particles (which have low inertia) into long, slow-moving strings across the repulsive fields.
