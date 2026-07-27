# Changelog: VEPA v3

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
