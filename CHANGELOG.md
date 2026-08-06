# CHANGELOG — VEPA

> **Current release:** v4.6.23 (2026-08-06) — full history in `v4/CHANGELOG.md`.

## 4.0.0 — 2026-08-01
VEPA v4 (Integrated Intelligence) shipped in `v4/`. See `v4/CHANGELOG.md`. 



## [2.6.0] - 2026-07-29
### Added
- **Accretion Gene Fusion:** When particles merge via accretion, their DNA caches blend — the survivor acquires genetic traits from the consumed particle proportional to mass ratio.
- **Cloning Reproduction:** When genetics laws are inactive, spawning defaults to cloning — offspring are near-identical copies of a random parent with slight mutation noise.
- **Pair-Based Breeding:** Sexual reproduction now prefers nearby same-species mates within 200 units, creating more realistic breeding pairs rather than random global parents.
- **Predation Gene Absorption:** When TRACKING law is active and a larger particle collides with a smaller one, the predator absorbs DNA traits from the prey (5 random traits blended at 5% per collision) and transfers mass.
- **Non-Overlapping Polymer/Bond Structures:** Added hard-sphere constraint resolution for all particles — bonded pairs are pulled to their equilibrium distance based on combined radii, preventing overlap while maintaining structural integrity.
- **Biological Particle Variance:** Life-cycle now includes age-based color drift, mass fluctuation tied to energy reserves, and bio-rhythm energy pulses — making each particle visually and behaviorally unique over its lifetime.
- **Massive DNA Tab Expansion:** Completely rewritten analytics panel with overview stats banner (population, avg mass/energy/velocity, bonded count, max bonds), per-species breakdown with 4-metric summaries, species trait profiles showing Force/Viscosity/Birth Rate/Death Rate/Mutation/Polarity averages, detailed genetics summary with lineage tree, genetic diversity heat indicator, ASCII population density heatmap, and 4 real-time histogram charts (mass distribution, energy distribution, age demographics, velocity distribution).
- **New DNA Tab Charts:** Added 4 canvas-based histograms (mass-histogram, energy-distribution, age-demographics, velocity-distribution) that update in real-time with the simulation.
## [2.5.0] - 2026-07-29
### Added
- **DNA & Genetics Expansion:** Extended DNA system from 42 to 64 parameters with 22 new genetic control traits (Dominance, Crossover Rate, Allele Count, Heterozygote, Epigenetic Rate, HGT Rate, Repair Efficiency, Drift Rate, Selection Sensitivity, Speciation Threshold, Adaptation Rate, Lamarckian, Transposon Rate, Gene Silencing, Recombination Bias, Mutagen Sensitivity, Telomere Length, Ploidy Level, Codon Bias, Regulatory Depth, Gene Duplication, Heterosis).
- **7 New Genetics Laws:** MENDEL (Mendelian inheritance with dominant/recessive alleles), CROSSOVER (genetic recombination during reproduction), HORIZ (horizontal gene transfer between particles), EPIGEN (epigenetic modifications), DRIFT (neutral genetic drift), SPECIATE (speciation from genetic divergence), PLOIDY (polyploidy effects on genome).
- **Genetics Engine:** Complete genetics reproduction system in physics worker with allele-based inheritance, single-point crossover, dominance expression, heterozygote advantage, and mutation.
- **Horizontal Gene Transfer:** Particles can exchange genetic material directly during close interactions.
- **Epigenetic System:** Environmental entropy can modify gene expression without changing DNA sequence.
- **Genetic Drift:** Neutral random fluctuations in allele frequencies over time.
- **Speciation Monitoring:** Genetic distance tracking with automatic new species assignment at threshold divergence.
- **Polyploidy Effects:** Chromosome set count modulates phenotype expression noise and mutation robustness.
- **Genetics Analytics:** New GENETICS section in DNA tab showing species count, crossover events, speciation events, HGT events, species lineage, and genetic diversity heat indicator.
- **Enhanced Lineage Tracker:** Dual-parent ancestry tracking, crossover history, speciation event logging, HGT event logging, epigenetic mark tracking, genetic distance calculation, comprehensive report generation.
- **Genetics DNA Category:** New GENETICS category in DNA accordion with all 22 genetic control parameters.
- **Genetics Law UI:** 7 new law toggles in BIOL tab with custom SVG icons and HELP_DB entries.
## [2.4.0] - 2026-07-26
### Fixed
- **NaN Guard System:** Added comprehensive NaN/Infinity validation to Worker physics loop. Position, velocity, mass, and energy are now validated every frame with automatic recovery.
- **Accretion Double-Consumption Bug:** Fixed inner force loop to skip dead particles, preventing same particle from being absorbed multiple times per frame.
- **MAX_FORCE Clamp:** Added global force magnitude clamp (50.0) after force accumulation to prevent numerical instability.
- **MAX_INTERACTIONS Throttle:** Added 500-interaction-per-particle limit to prevent frame time spikes in dense clusters.
- **Energy Bounds:** Added explicit ENERGY clamp to [0, 200] range after all energy modifications.
- **Division-by-Zero in Accretion:** Added epsilon to color blending ratio denominator.
- **Timeline Deep Clone:** Fixed species RGB array shallow clone in TimelineEngine snapshot.

### Removed
- **Dead Code: NarrativeEngine** (src/narrativeEngine.js) — instantiated but never called; superseded by NarrativeConsciousness.
- **Dead Code: LevelEngine** (src/levelEngine.js) — exported but never imported or used.
- **Dead Code: Visual Buffer** — Float32Array allocated and transferred to Worker but never read; rendering reads directly from particle buffer.
- **Redundant Files:** Removed backup/, .claude/, .specify/, .tests/, .tickets/, vepa-deploy.zip, combined.txt, deploy_payload.json, serve_vepa.py, test files.

### Changed
- **Updated .gitignore:** Added comprehensive exclusions for build artifacts, vendored deps, backups, and test artifacts.
- **Worker Architecture Constants:** Documented MAX_FORCE=50.0, MAX_INTERACTIONS=500, STRIDE=64, species_limit=12, GRID_SIZE=10 as authoritative values.
# VEPA (Vector Emergent Physics Automata) Changelog

All notable changes to this project will be documented in this file.

## [2.3.0] - 2026-05-17
### Added
- **Selective Chaos System (VEPA-B9-01):** Replaced the single-action chaos button with a granular entropy injection menu.
- **Chaos Categories:** Selective randomization for DNA, Biological traits, and Physics/World constants.
- **Interactive Chaos Dialog:** New UI overlay for choosing the target systems for entropy injection.

## [2.2.0] - 2026-04-24
### Added
- **Drone Personality Expansion (VEPA-B11-01):** Integrated 75 unique snarky comments for B-4RK.
- **Context-Sensitive Feedback:** The drone now provides specific commentary based on the simulation parameter currently being scanned in help-mode.
- **Expanded IDLE & RANDOM Behaviors:** Added a wide variety of background drone dialogue.

## [2.1.0] - 2026-04-17
### Added
- **Nuclear Rewrite (Architectural Overhaul):** Complete transition to an ES Module architecture (`src/`), decoupling logic from the entry point.
- **Worker-Threaded Physics Engine:** Offloaded all N-body calculations to a dedicated Web Worker (`physics.worker.js`) using high-performance Typed Arrays (`Stride 18`).
- **PixiJS Rendering Pipeline:** Integrated PixiJS v8 for hardware-accelerated particle rendering, significantly increasing the supported particle count.
- **4-Channel Neural Communication:** Particles now feature a sophisticated communication system with independent Signal Strength, Decay, Propagation Speed, and 4-Channel Tuning.
- **DNA-Based Neighborhoods:** Interaction range is now controlled via a species-level `Neighborhood Radius` DNA parameter.
- **Advanced Fusion Logic:** Introduced `Fusion Momentum` and `Fusion Time` constraints to simulate complex accretion dynamics.
- **Dynamic Species Management:** Added the ability to add and remove species in real-time.
- **Modern Tabbed UI:** Completely redesigned the control interface with persistent tabs (WORLD, PHYS, SPEC) and dynamic slider generation.
- **External Stylesheets:** Moved all UI presentation logic to `style.css`.
- **Global Field Constants:** Added explicit control over Gravity (G), Sim Speed (dt), and Drag Coefficient.

## [1.1.0] - 2026-03-03
### Added
- **Visual & Render Layer (Batch 2):** Introduced the [Render] category in the DNA interface.
- **Trails System:** Implemented movement trails controlled by the "Trail Life" parameter (combining length and fade).
- **Aesthetic DNA:** Added "Glow Intensity", "Pulse Opacity", and "Particle Opacity" to species profiles.
- **Pulse Sync:** Pulse Opacity now oscillates based on the "Pulse Rate" DNA parameter.
- **Initial Mass Distributions:** Implemented 6 distinct startup patterns in the WORLD tab: Soup, Big Bang, Bipolar, Galaxy, Grid, and Uniform.
- **Spread Control:** Added a dedicated slider to control the spatial extent of initial distributions.

## [1.0.2] - 2026-03-03
### Added
- **Foundation Polish:** Finalized the core parameter set with calibrated ranges and sensible defaults.
- **Enhanced Tooltips:** Added comprehensive descriptions to all 16 DNA parameters and all biological/physics sliders.
- **Renamed C4 (Ghost):** Updated "Ghost" to "Hidden Mass" across UI and documentation to clarify its physical role as an invisible mass multiplier.
- **Parameter Clarification:** Refined interaction between Fusion (DNA) vs Accretion (Law) and Viscosity vs Stiffness to reduce conceptual overlap.
- **UI Consistency:** Minor interface cleanup including localized font scaling and improved button responsiveness.

## [0.8.6] - 2026-03-02
### Added
- **Bouncing Borders:** When "Wrap Edges" is disabled, the world boundaries now act as solid borders. Particles will bounce off the edges with a velocity multiplier controlled by the "Elasticity" parameter in the PHYS tab.

## [0.8.5] - 2026-03-02
### Added
- **Meta-Evolution UI:** Redesigned the entire interface with categorized parameter groups (Motion, Matter, Life, etc.).
- **Parameter Gating:** All DNA rules now start disabled by default (except base Force) and must be explicitly enabled via checkboxes.
- **Range Locking:** Added an "UNLOCK" toggle to edit the min/max ranges of any slider.
- **Configuration Management:** New "SYS" tab for Quick Save/Load (LocalStorage) and JSON Export/Import.
- **Advanced World Controls:** Added World Size slider, Wrap Edges toggle, and Variability/Density controls for re-seeding.

## [0.8.4] - 2026-03-02
### Fixed
- **Panning Logic:** Re-engineered panning using `PointerEvents` for robust support on both touch and mouse devices. Fixed a bug where panning was using stale initial coordinates.
- **Painting Logic:** Added a global pointer listener to properly reset the drawing state (`isDrawing`), fixing a bug where the brush would remain active after leaving the grid.

## [0.8.3] - 2026-03-02
### Added
- **Development Server:** Created `run.py` with automatic restart functionality on file changes.
- **Uniform Distribution Mode:** Added a "UNIFORM" distribution option in the WORLD tab with a dedicated "Spread / Variability" slider.
### Fixed
- **Painting Logic:** Corrected coordinate mapping in `gridData` to ensure brush strokes accurately reflect the DNA rules applied to physics.

## [0.8.2] - 2026-03-01
### Added
- **Contextual Help System:** Added "ⓘ" buttons next to every DNA parameter that trigger a detailed information tooltip.
- **Engineering Guide:** Created `vepa/GUIDE.md` containing parameter synergy matrices and quick-start recipes for emergent life.
- **In-Engine HELP Tab:** Added a dedicated tab for quick reference of parameter archetypes (Crystals, Amoebas, etc.).
- **Initial Spawn Clustering:** Particles now spawn in a denser central cluster (100x100) on reset to ensure they are immediately visible.
- **Improved UI Layout:** Optimized tab buttons and slider spacing for small Android screens.

## [0.8.1] - 2026-03-01
### Added
- **Error Diagnostics Layer:** Implemented a visible error log on the screen to capture and display JavaScript crashes in real-time.
- **NaN Death Shield:** Added checks to force and distance calculations to prevent invalid numerical states from propagating.
- **Robust Touch Tracking:** Completely rewrote the touch-panning logic using absolute coordinate tracking, fixing the "disappearing matter" bug on Android.
- **Loop Guard:** Wrapped the entire render and physics cycle in a safety block to prevent silent engine death.
- **Resolution Sync:** Fixed a initialization race condition that caused the grid data to be unpopulated on the first frame.

## [0.6.2] - 2026-03-01
### Added
- **Mobile Touch Pan Fix:** Replaced `e.movementX` with absolute touch coordinate tracking, ensuring smooth camera movement on Android devices.
- **Dynamic Grid Scaling:** Integrated the resolution (5x5 to 15x15) and scale (0.1x to 10.0x) parameters into the core physics engine.
- **Background Grid:** Added a visible coordinate grid to the world to provide spatial orientation when zoomed out.
- **Always-On UI Controls:** Moved the Play/Pause and Reset buttons to the header for persistent access.
- **NaN Safety:** Implemented coordinate validation to prevent the simulation from disappearing on invalid touch interactions.

## [0.6.1] - 2026-03-01
### Added
- **Elastic Collision Physics:** Particles now physically bounce off each other based on mass and a global Elasticity constant.
- **Spatio-Temporal DNA (Pulse Rate):** DNA nodes now support a pulse rate, causing attraction/repulsion forces to oscillate like a heartbeat.
- **Biological Aging:** Particles track their age and have a maximum lifespan. Rules can now be biased based on particle age (Age Bias).
- **Collision Fragmentation:** High-velocity impacts cause large particles to shatter into smaller fragments, conserving mass.
- **Visual Aging Feedback:** Particles now fade out as they approach their maximum age.
- **Global Physics Parameters:** Added "Elasticity" and "Collision Shatter" sliders to the Global config panel.

## [0.5.0] - 2026-03-01
### Added
- **3D Charge Manifold:** Particles now track Color (Charge), Opacity (Phase), and Geometry (Shape: Triangle/Square/Circle).
- **Geometric Rendering:** Matter is now rendered as distinct primitives with alpha-blending and variable size scaling based on mass.
- **Smart Chaos Engine:** The Chaos button now selects from "Complexity Archetypes" (Crystal, Stellar, Swarm) to ensure emergent patterns are triggered.
- **Advanced Startup Distributions:** Added "Galaxy" (Gaussian density) and "Grid" (Crystalline lattice) initial states.
- **Morphological DNA:** Added `Alpha Bias` and `Shape Bias` sliders to the DNA kernel for complex geometric interactions.
- **Dynamic Mass Scaling:** Particle size and interaction volume are now calculated as `sqrt(mass)`, linking physics to visual scale.

## [0.4.2] - 2026-03-01
### Added
- **Inverse-Square Universal Gravity:** High-mass "Stars" now exert a global gravitational field on all nearby particles, enabling solar systems and orbital mechanics.
- **Persistent Seed Memory:** Added a MEMORY tab for saving and loading DNA/Grid configurations to the browser's local storage.
- **Massive Coordinate Space:** Decoupled world size from screen size. The universe is now a 4000x4000 field with viewport-centered zooming.
- **Charge Resonance Dim:** Particles with matching charges now gain a resonance attraction bonus, encouraging complex homogeneous cluster formation.
- **Global Config Panel:** Added sliders for SIM SPEED, GRAVITY CONSTANT, WORLD SCALE, and RESONANCE.
- **Persistent Chaos:** The Chaos button is now a permanent floating trigger at the top of the UI.

## [0.4.1] - 2026-03-01
### Added
- **Celestial Fusion Engine:** Particles can now combine into higher-mass "Stars" with blooming visual effects and increased gravitational influence.
- **Life-Cycle Dimensions:** Added `Birth` and `Death` parameters to DNA nodes, allowing rules to create or destroy matter.
- **Interactive Camera:** Added Pinch-to-Zoom and Drag-to-Pan support for multi-scale observation.
- **Matter Distribution Config:** Choose between "Soup," "Big Bang," or "Bipolar" initial states.
- **The Chaos Button:** One-tap randomization of all physics laws, grid patterns, and matter states.
- **Tabbed UI System:** Optimized interface for Android, separating DNA Editing, World Config, and Chaos Settings.

## [0.3.5] - 2026-03-01
### Added
- **5 New Physics Dimensions:** Thermal Jitter, Mass Coupling, Stiffness (Spring), Mutation Rate, and Tidal Shear.
- **Extended Node Inspector:** Scrollable UI for mobile to accommodate 9 distinct parameter sliders.
- **Mass-Dependent Dynamics:** Particle size and interaction strength now scale with randomized mass property.
- **Spring-Stiffness Logic:** Particles can now "snap" to specific relative distances, enabling rigid structures.
- **State Mutation:** Particles can now flip their "Charge" state based on proximity to specific DNA nodes.

## [0.3.0] - 2026-03-01
### Added
- **N-Dimensional Genomic Control:** Each cell in the $7\times7$ neighborhood grid now has a 4-parameter DNA vector (Spatial Force, Torque, Charge Bias, Viscosity).
- **Node Inspector Modal:** Tap any cell to open a slider-based interface for precise physical constant tuning.
- **Particle State (Charge):** Added internal charge property to particles, allowing for state-dependent logic (e.g., like charges attract/repel).
- **Chaos DNA Engine:** A randomization button to quickly explore the emergent parameter space.

### Changed
- Refactored physics loop to support multi-parameter calculations across PIC spatial hashing.
- Updated grid visualization to reflect node DNA (Color = Force, Intensity = Torque).

## [0.2.0] - 2026-03-01
### Added
- **Relative Neighborhood Kernel Editor:** Replaced "World Painting" with a $7\times7$ DNA grid representing relative distance to a particle.
- **Touch-Native UI:** Large on-screen buttons and tap/drag-to-paint grid controls optimized for Android.
- **PIC (Particle-In-Cell) Optimization:** Implemented spatial hashing to maintain 60FPS with high particle counts on mobile browsers.

### Changed
- Shifted from global logic zones to local interaction "DNA," allowing for more complex emergent "organisms."

## [0.1.0] - 2026-03-01
### Added
- **Initial VEPA Proof-of-Concept:** Standalone HTML/Canvas simulation engine.
- **Vector Physics Loop:** Continuous Euler integration with Friction and Quadratic Drag.
- **World Painting:** Initial system for painting global physical zones (Attract, Repel, Viscous, Spawn).
