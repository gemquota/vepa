# 🌌 VEPA v3: Vector Emergent Physics Automata

A clean-slate recreation of the emergent physics simulation with modular architecture.

## Quick Start

```bash
cd v3
npm install
npm run dev    # Start dev server with COOP/COEP headers
npm run build  # Production build
npm test       # Run unit tests
```

## Architecture

```
src/
├── core/           # EventBus, PRNG
├── state/          # ParticleBuffer, LawState, PresetManager
├── dna/            # DNABuffer, Expression (phenotype)
├── physics/        # SpatialGrid, Laws, Synergy, Solver
├── render/         # Canvas2D Renderer, SpriteSync
├── ui/             # HUD, LawPanel, DNAPanel, NarrativePanel
├── engines/        # Insight, Narrative, Goal, Lineage, Timeline
├── worker/         # Physics Web Worker
├── constants.js    # All indexes, ranges, defaults
└── main.js         # Bootstrap & orchestration
```

## Key Concepts

### DNA System (42 Parameters)
Each of the 64 species carries a unique 42-parameter DNA profile that controls behavior:
- **Motion**: Force, Viscosity, Torque, Jitter, Inertia, Friction
- **Matter**: Symmetry, Hidden Mass, Stiffness, Fusion, Elasticity
- **EM**: Polarity, Alpha, Conductivity, Magnetic Moment
- **Life**: Birth Rate, Death Rate, Mutation, Energy Efficiency
- **Signal**: Signal Response, Pulse Rate, Neighborhood Radius

### Law System (64 Laws)
Global laws toggle simulation behaviors:
- **Physics** (Blue): Gravity, Drag, Entropy, Wrap, Collision, Accretion
- **Biology** (Green): Life, Glow, Affinity, Reproduction, Tracking
- **Chemistry** (Purple): Catalysis, Solvation, Acidity, Oxidation
- **Thermodynamics** (Orange): Heat, Cold, Convection
- **Metaphysics** (Red): Time Dilation, Chaos, Order, Fate, Will, Soul

### Intelligence Layer
8+ engines communicate via EventBus:
- Cluster detection, narrative commentary, auto-tuning, lineage tracking
