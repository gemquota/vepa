# Changelog: VEPA v3


## [Unreleased]

### Fixed
- **Spawn Jitter NaN Bug**: Initial particle positions called `prng.nextFloat()` with no arguments, producing NaN jitter and collapsing the whole population to the world center. Now uses `nextFloat(0, 1)`.

### Changed
- **Sparser Initial Distribution**: `DEFAULT_PARTICLES_PER_SPECIES` reduced 100 → 50 (5 species × 50 = 250 initial particles).
- **Larger World**: `WORLD_SIZE` increased 120 → 240, spreading the initial population over 8× the volume.


## [3.1.0] - 2026-07-29

### Added
- **1000 Default Particles**: DEFAULT_PARTICLES_PER_SPECIES increased from 50 → 200 (200 × 5 species = 1000 particles)
- **Accretion Gene Fusion**: When particles merge via accretion, the survivor blends DNA from the consumed particle, creating hybrid genetic lineages through mass-based gene transfer.
- **Predation Gene Absorption**: New `applyPredation` law function — larger particles pursue smaller ones via mass-difference tracking, and on contact absorb 5 random DNA traits at 5% rate plus mass transfer. Prey particles flee with jitter-based repulsion.
- **Biological Particle Variance**: Enhanced `applyLifeCycle` with age-based color drift (±mutRate per frame), mass fluctuation tied to energy metabolism, bio-rhythm energy pulses (sin wave at birthRate frequency), and age-scaled senescence probability.
- **Non-Overlapping Bond/Polymer Structures**: Added hard-sphere constraint resolution after position integration — all particles maintain minimum distance based on combined radii. Bonded particles are pulled to their equilibrium distance with stiffness-controlled spring force.
- **Expanded DNA Analytics**: New `collectAndRenderAll` function with overview stats banner (population, avg mass/energy/velocity, bonded count, max bonds), per-species breakdown with 4-metric summaries, species trait profiles showing key DNA parameter averages, genetic diversity indicator, ASCII population density heatmap (8×8), and 4 real-time histogram charts.
- **4 New Histogram Charts**: mass-histogram, energy-distribution, age-demographics, velocity-distribution canvas charts added to DNA tab, updated every 10 physics ticks.
## [3.0.0] - 2026-07-28

### Architecture
- **Clean-slate recreation** with modular ESM architecture
- **Physics Web Worker** with SharedArrayBuffer for off-main-thread simulation
- **Canvas2D renderer** with DNA-driven phenotype expression
- **EventBus architecture** — all subsystems communicate via pub/sub
- **64-law bitmask system** with 5 color-coded categories
- **42-parameter DNA system** with range-validated buffers

### Core Systems
- Spatial hash grid for O(N) neighbor queries
- Law synergy computation (9 synergy rules)
- 30+ law force functions covering physics, biology, chemistry, thermodynamics, metaphysics
- NaN guard system for numerical stability
- Velocity clamp and force magnitude limits

### Intelligence Engines
- **Insight Engine** — spatio-temporal cluster detection with Union-Find
- **Narrative Engine** — 4-voice commentary (Stabilizer, Diverger, Observer, Dissolver)
- **Goal Engine** — auto-tuning world parameters toward stability/complexity targets
- **Lineage Tracker** — evolutionary genealogy with ancestor chains
- **Timeline Engine** — state snapshots and replay

### UI
- Tabbed interface (WORLD, SPECIES, DNA, LAWS, LOG)
- 64-law toggle grid with 5-category color coding
- 42 DNA sliders with range-constrained inputs
- Species selector with colored circles
- Preset save/load via localStorage
- HUD with FPS, particle count, species count, tick
- Keyboard shortcuts (Space, R, 1-5)

### Testing
- Unit tests for PRNG, LawState, DNABuffer, ParticleBuffer, SpatialGrid, Synergy
- Vitest configuration for fast test execution
