# Audit Batch 10: Core Systems

## Systems: Solver, Spatial Grid, Law Bitmask, Particle Buffer, Renderer, Initialization Flow

### Solver (solver.js)

| Export | Status |
|--------|--------|
| solve() | ✓ FIXED — force field names corrected, accretion fixed |
| drainOffspring() | ✓ Export exists, called from... check |
| resetOffspringRing() | ✓ |
| readSpeciesDNA() | ✓ |

### Spatial Grid (spatialGrid.js)

| Export | Status |
|--------|--------|
| createGrid() | ✓ |
| clear() | ✓ |
| insert() | ✓ |
| getNeighbors() | ✓ |

No issues found with the grid system.

### Law Bitmask (lawState.js)

| Export | Status |
|--------|--------|
| createLawState | ✓ |
| toggle | ✓ |
| set | ✓ |
| clear | ✓ |
| isSet | ✓ |
| serialize | ✓ |
| deserialize | ✓ |

No issues found.

### Particle Buffer (particleBuffer.js)

21 exports covering: create, read/write all particle fields (position, velocity, mass, species ID, DNA, energy, color, etc.). SharedArrayBuffer fallback to ArrayBuffer for GitHub Pages compatibility.

### Renderer (renderer.js + spriteSync.js)

Canvas2D-only render path (no PixiJS used despite being in package.json — tree-shaken out). PixiJS sprite path is stub-only.

### Initialization Flow (main.js)

```
boot()
  ├─ create EventBus, PRNG
  ├─ createParticleBuffer() → buffer + view
  ├─ createLawState() — all laws off by default
  ├─ createDNABuffer() + loadDefaults()
  ├─ Enable 10 default laws (GRAV, DRAG, ENTR, WRAP, COLL, LIFE, GLOW, REPRO, PHENOTYPE, GENOTYPE)
  ├─ spawnDefaultPopulation() — 5 species × 200 particles
  ├─ createRenderer() — Canvas2D
  ├─ initUI() — creates all panels
  ├─ wireEvents() — pause/resume/restart/togglePause
  └─ renderLoop() — requestAnimationFrame
       ├─ solve() — physics tick
       ├─ bus.emit('physics:tick') — event for HUD/engines
       └─ syncSprites() — Canvas2D redraw
```

### Issues

1. **No engine wiring**: Goal, Insight, Narrative, Lineage, Timeline engines never initialized
2. **No worker support**: physics.worker.js exists but main.js runs physics on main thread
3. **No world panel**: #world-panel div exists in HTML but no component renders into it
4. **renderLoop vs HUD FPS duplication**: Both renderLoop and HUD have their own RAF for FPS counting — redundant
5. **SharedArrayBuffer construction overhead**: Helper functions (setX, getX, etc.) create new Float32Array per call — acceptable for current particle count but wasteful
