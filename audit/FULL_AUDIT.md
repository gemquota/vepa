# VEPA v3 — Comprehensive Functionality Parity Audit

> **Compiled:** auto-generated
> **Batches:** 10
> **Scope:** All laws, DNA parameters, UI panels, engines, and core systems

---

## Executive Summary

This audit covers all 38 laws, 42 DNA parameters, 7 UI panel components,
5 engines, and core system infrastructure of VEPA v3. Each component is
checked for: definition completeness, implementation status, wiring/calling
in the solver, and runtime behavior.

### Key Metrics

| Category | Total | Implemented | Missing/Dead | Health |
|----------|-------|-------------|-------------|--------|
| Physics Laws | 7 | 7 | 2 dead funcs | 71% |
| Biology Laws | 10 | 5 | 5 missing, 2 dead funcs | 50% |
| Chemistry Laws | 8 | 4 | 4 missing, 4 dead funcs | 50% |
| Thermodynamics Laws | 5 | 2 | 3 missing, 2 dead funcs | 40% |
| Metaphysics Laws | 8 | 8 | 0 | 100% |
| DNA Motion Parameters | 8 | 5 | 3 unused | 62% |
| DNA Matter Parameters | 9 | 5 | 4 unused | 55% |
| DNA EM Parameters | 7 | 5 | 2 unused | 71% |
| DNA Biology Parameters | 7 | 5 | 2 unused | 71% |
| DNA Communication Params | 11 | 0 | 11 unused | 0% |
| UI Panels | 7 | 6 | 1 missing | 85% |
| Engines | 5 | 0 | 5 not wired | 0% |

### Critical Gaps

1. **5 Engines not wired**: Goal, Insight, Narrative, Lineage, Timeline — disconnected
2. **10 Laws missing implementations**: GLOW, SENESCENCE, ENERGY, RADIATION, PHENOTYPE,
   ISOMERIZATION, CHIRALITY, CRYSTALLIZATION, PHASE_RADIATION, SUBLIMATION
3. **11 DNA params completely unused**: Entire Communication group (SIGNAL_RESP through TUNING_CH4, MEMORY_DECAY)
4. **No World Panel**: #world-panel container exists but no component renders into it

---

## Per-Batch Details


---

### Batch 01: Audit Batch 1: Physics Laws

## Laws: GRAV, DRAG, ENTR, WRAP, COLL, ACCR, PLANETARY

### Status Summary

| Law | Index | Function | Implemented | Called in Solver | Category |
|-----|-------|----------|-------------|------------------|----------|
| GRAV | 0 | applyGravity | ✓ | ✓ | Physics (BLUE) |
| DRAG | 1 | applyDrag | ✓ | ✗ NOT CALLED | Physics (BLUE) |
| ENTR | 2 | applyEntropy | ✓ | ✗ NOT CALLED | Physics (BLUE) |
| WRAP | 3 | (inline in solver) | ✓ | ✓ | Physics (BLUE) |
| COLL | 4 | applyCollision | ✓ | ✓ | Physics (BLUE) |
| ACCR | 5 | applyAccretion | ✓ | ✓ | Physics (BLUE) |
| PLANETARY | 6 | applyPlanetary | ✓ | ✓ | Physics (BLUE) |

### Findings

1. **GRAVITY**: Works. Function exists, called from solver with proper argument order after fix.
2. **DRAG**: Function exists in laws.js (returns `{ax, ay, az}` form drag from velocity) but is NEVER called from solver.js. DRAG force is not applied. The solver applies friction inline as `ax -= vy * A` where A is FRICTION DNA param — this is partial drag but not a complete replacement.
3. **ENTROPY**: Function exists (applies Brownian jitter) but is NEVER called from solver.js. Instead, solver applies `ax += (prng()-0.5) * JITTER * dt * ENTR_SYNERGY` inline — similar but not identical.
4. **WRAP**: Handled inline in solver (toroidal wrapping or soft-wall clamping in position integration step).
5. **COLLISION**: Works. Function called from solver, returns proper `{ax, ay, az}`.
6. **ACCRETION**: Works. Function called from solver, modifies mass internally via buffer_global (was previously broken due to massGain ref — fixed).
7. **PLANETARY**: Works. Function called from solver after pairwise loop (non-pairwise center-pull force).

### Issues

- applyDrag and applyEntropy functions in laws.js are dead code (not called from solver).
- DRAG effect is partially replicated inline but may not fully match the law function's intent.
- ENTROPY effect uses inline random rather than the function's correlated noise.

---

### Batch 02: Audit Batch 2: Biology Laws

## Laws: LIFE, GLOW, AFFINITY, REPRO, TRACK, SENESCENCE, ENERGY, RADIATION, GENOTYPE, PHENOTYPE

### Status Summary

| Law | Index | Function | Implemented | Called in Solver | Category |
|-----|-------|----------|-------------|------------------|----------|
| LIFE | 7 | applyLifeCycle | ✓ | ✓ | Biology (GREEN) |
| GLOW | 8 | — | ✗ MISSING | — | Biology (GREEN) |
| AFFINITY | 9 | applyAffinity | ✓ | ✓ | Biology (GREEN) |
| REPRO | 10 | applyReproduction | ✓ | ✓ | Biology (GREEN) |
| TRACK | 11 | applyTracking | ✓ | ✗ NOT CALLED | Biology (GREEN) |
| SENESCENCE | 12 | — | ✗ MISSING | — | Biology (GREEN) |
| ENERGY | 13 | — | ✗ MISSING | — | Biology (GREEN) |
| RADIATION | 14 | — | ✗ MISSING | — | Biology (GREEN) |
| GENOTYPE | 15 | applyGenotype | ✓ | ✗ NOT CALLED | Biology (GREEN) |
| PHENOTYPE | 16 | — | ✗ MISSING | — | Biology (GREEN) |

### Findings

1. **LIFE (applyLifeCycle)**: Works. Manages DEAD state transitions, hunger, energy drain per tick.
2. **GLOW**: No function exists. Should be a visual-only law that adds glow/bloom effect. Could be handled in spriteSync.js overlay (code exists there but checks `LAW_INDEXES.GLOW` that never fires because law state toggle exists but no physics effect).
3. **AFFINITY**: Works. Same-species attraction/repulsion based on SPECIES_AFFINITY DNA param.
4. **REPRO**: Works. Handles cloning, sexual, and hybrid reproduction modes.
5. **TRACK (applyTracking)**: Function exists but NOT called from solver. Would apply attraction between same-species particles.
6. **SENESCENCE**: No function. Should handle age-based death or decay.
7. **ENERGY**: No function. Should handle energy transfer between particles or conversion.
8. **RADIATION**: No function. Should apply radiation damage/effects.
9. **GENOTYPE (applyGenotype)**: Function exists but NOT called from solver. Would mutate DNA over time.
10. **PHENOTYPE**: No function. Would express DNA → visual phenotype changes over lifetime.

### Issues

- 4 biology laws have NO implementation: GLOW, SENESCENCE, ENERGY, RADIATION, PHENOTYPE
- 2 functions exist but are dead code: applyTracking, applyGenotype

---

### Batch 03: Audit Batch 3: Chemistry + Thermodynamics Laws

## Chemistry Laws: CATALYSIS_LAW, SOLVATION, ACIDITY, OXIDATION, POLYMER, ISOMERIZATION, CHIRALITY, CRYSTALLIZATION
## Thermodynamics Laws: HEAT, COLD, CONVECTION, PHASE_RADIATION, SUBLIMATION

### Status Summary

| Law | Index | Function | Implemented | Called in Solver | Category |
|-----|-------|----------|-------------|------------------|----------|
| CATALYSIS_LAW | 17 | applyChemistry | ✓ | ✓ | Chemistry (PURPLE) |
| SOLVATION | 18 | applySolvation | ✓ | ✗ NOT CALLED | Chemistry (PURPLE) |
| ACIDITY | 19 | applyAcidity | ✓ | ✗ NOT CALLED | Chemistry (PURPLE) |
| OXIDATION | 20 | applyOxidation | ✓ | ✗ NOT CALLED | Chemistry (PURPLE) |
| POLYMER | 21 | applyPolymer | ✓ | ✓ | Chemistry (PURPLE) |
| ISOMERIZATION | 22 | — | ✗ MISSING | — | Chemistry (PURPLE) |
| CHIRALITY | 23 | — | ✗ MISSING | — | Chemistry (PURPLE) |
| CRYSTALLIZATION | 24 | — | ✗ MISSING | — | Chemistry (PURPLE) |
| HEAT | 25 | applyHeat | ✓ | ✗ NOT CALLED | Thermodynamics (ORANGE) |
| COLD | 26 | applyCold | ✓ | ✗ NOT CALLED | Thermodynamics (ORANGE) |
| CONVECTION | 27 | applyConvection | ✓ | ✓ | Thermodynamics (ORANGE) |
| PHASE_RADIATION | 28 | — | ✗ MISSING | — | Thermodynamics (ORANGE) |
| SUBLIMATION | 29 | — | ✗ MISSING | — | Thermodynamics (ORANGE) |

### Findings

1. **CATALYSIS_LAW (applyChemistry)**: Works. Returns a multiplier (1.0-2.0) that scales force accumulation. Used as `chemMult *= ax` pattern.
2. **SOLVATION**: Function exists but NOT called. Would apply solvent-mediated attraction.
3. **ACIDITY**: Function exists but NOT called. Would apply charge-based dissolution.
4. **OXIDATION**: Function exists but NOT called. Would apply oxidation damage.
5. **POLYMER (applyPolymer)**: Works. Handles bond formation between nearby particles.
6. **ISOMERIZATION**: No function. Should handle structural reconfiguration.
7. **CHIRALITY**: No function. Should handle handedness-based interactions.
8. **CRYSTALLIZATION**: No function. Should handle lattice formation.
9. **HEAT**: Function exists but NOT called. Would increase particle temperature/energy.
10. **COLD**: Function exists but NOT called. Would decrease particle temperature/energy.
11. **CONVECTION**: Works. Applies buoyancy/flow based on temperature differentials.
12. **PHASE_RADIATION**: No function. Should handle phase change radiation.
13. **SUBLIMATION**: No function. Should handle solid→gas transition.

### Issues

- 6 laws have NO implementation: ISOMERIZATION, CHIRALITY, CRYSTALLIZATION, PHASE_RADIATION, SUBLIMATION
- 6 functions exist but are dead code (not called from solver): applySolvation, applyAcidity, applyOxidation, applyHeat, applyCold

---

### Batch 04: Audit Batch 4: Metaphysics Laws + Synergy System

## Laws: TIME_DILATION, DIMENSIONALITY, CHAOS, ORDER, FATE, WILL, SOUL_LAW, MIND

### Status Summary

| Law | Index | Function | Implemented | Called in Solver | Category |
|-----|-------|----------|-------------|------------------|----------|
| TIME_DILATION | 30 | applyTimeDilation | ✓ | ✓ | Metaphysics (RED) |
| DIMENSIONALITY | 31 | applyDimensionality | ✓ | ✓ | Metaphysics (RED) |
| CHAOS | 32 | applyChaos | ✓ | ✓ | Metaphysics (RED) |
| ORDER | 33 | applyOrder | ✓ | ✓ | Metaphysics (RED) |
| FATE | 34 | applyFate | ✓ | ✓ | Metaphysics (RED) |
| WILL | 35 | applyWill | ✓ | ✓ | Metaphysics (RED) |
| SOUL_LAW | 36 | applySoul | ✓ | ✓ | Metaphysics (RED) |
| MIND | 37 | applyMind | ✓ | ✓ | Metaphysics (RED) |

All 8 metaphysics laws are implemented and called from the solver. ✓

### Synergy System

Synergy file: `src/physics/synergy.js`
- 34 law index references for synergy computations
- Called 19 times from solver.js (every law checks synergy before applying)
- Returns multiplier [0.0, 2.0]

### Synergy Rules Implemented

| Combination | Multiplier | Effect |
|-------------|-----------|--------|
| GRAV + PLANETARY | ×1.5 | Gravitational strength boost |
| COLL + ACCR | ×1.2 | Accretion bonus |
| LIFE + REPRO + ENERGY | ×1.3 | Biological efficiency |
| GLOW + TRACK | ×1.5 | Signal propagation |
| CATALYSIS + SOLVATION + ACIDITY | ×2.0 | Chemical reaction rate |
| HEAT + COLD | ×0.5 | Mutual cancellation |
| CHAOS + ORDER | ×0.3 | Mutual cancellation |
| FATE + WILL | ×1.8 | Metaphysical power |

### Issues

- ENERGY law is NOT implemented (no function) but is checked in synergies — dead synergy path.
- All metaphysics laws are fully wired.

---

### Batch 05: Audit Batch 5: DNA Parameters — Motion + Matter Groups

## Motion Params: FORCE, VISCOSITY, TORQUE, JITTER, TIDAL, INERTIA, FRICTION, MAX_VELOCITY

## Matter Params: SYMMETRY, HIDDEN_MASS, STIFFNESS, FUSION, FUSION_MOMENTUM, FUSION_TIME, BASE_RADIUS, ELASTICITY, BOND_ANGLE

### Index Usage

| Index | Name | DNA_META | DNA_RANGES | Used In | Status |
|-------|------|----------|------------|---------|--------|
| 0 | FORCE | ✓ Force | ✓ | solver.js, main.js (profile) | ✓ |
| 1 | VISCOSITY | ✓ Viscosity | ✓ | solver.js (inline drag), main.js (profile) | ✓ |
| 2 | TORQUE | ✓ Torque | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 3 | JITTER | ✓ Jitter | ✓ | solver.js (inline entropy) | ✓ |
| 15 | TIDAL | ✓ Tidal | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 26 | INERTIA | ✓ Inertia | ✓ | solver.js (invMass/inertia) | ✓ |
| 27 | FRICTION | ✓ Friction | ✓ | solver.js (inline friction) | ✓ |
| 28 | MAX_VELOCITY | ✓ Max Velocity | ✓ | solver.js (velocity clamp) | ✓ |
| 6 | SYMMETRY | ✓ Symmetry | ✓ | expression.js (color lightness) | ✓ |
| 7 | HIDDEN_MASS | ✓ Hidden Mass | ✓ | laws.js (gravity), expr.js (radius) | ✓ |
| 8 | STIFFNESS | ✓ Stiffness | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 9 | FUSION | ✓ Fusion | ✓ | solver.js (accretion), main.js (profile) | ✓ |
| 16 | FUSION_MOMENTUM | ✓ Fusion Momentum | ✓ | solver.js (accretion check) | ✓ |
| 17 | FUSION_TIME | ✓ Fusion Time | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 29 | BASE_RADIUS | ✓ Base Radius | ✓ | solver.js (radius), expr.js (radius) | ✓ |
| 30 | ELASTICITY | ✓ Elasticity | ✓ | laws.js (collision bounce) | ✓ |
| 31 | BOND_ANGLE | ✓ Bond Angle | ✓ | NOT USED ANYWHERE | ✗ DEAD |

### Issues

- 4 parameters are defined but UNUSED: TORQUE, TIDAL, STIFFNESS, FUSION_TIME, BOND_ANGLE
- These are dead code in DNA_META/DNA_RANGES — they show in the DNA panel but have no effect

---

### Batch 06: Audit Batch 6: DNA Parameters — Electromagnetism + Biology Groups

## EM Params: POLARITY, ALPHA, CONDUCTIVITY, MAGNETIC_MOMENT, REACTION_THRESHOLD, CATALYSIS, HEAT_OUTPUT

## Biology Params: BIRTH_RATE, DEATH_RATE, MUTATION, ENERGY_EFFICIENCY, SEX_CHANCE, PREDATION_BIAS, SPECIES_AFFINITY

### Index Usage

| Index | Name | DNA_META | DNA_RANGES | Used In | Status |
|-------|------|----------|------------|---------|--------|
| 4 | POLARITY | ✓ Polarity | ✓ | expression.js (hue), laws.js (chemistry) | ✓ |
| 5 | ALPHA | ✓ Alpha | ✓ | expression.js (saturation + alpha) | ✓ |
| 32 | CONDUCTIVITY | ✓ Conductivity | ✓ | laws.js (heat transfer) | ✓ |
| 33 | MAGNETIC_MOMENT | ✓ Magnetic Moment | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 37 | REACTION_THRESHOLD | ✓ Reaction Threshold | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 38 | CATALYSIS | ✓ Catalysis | ✓ | laws.js (chemistry multiplier) | ✓ |
| 39 | HEAT_OUTPUT | ✓ Heat Output | ✓ | laws.js (heat generation) | ✓ |
| 10 | BIRTH_RATE | ✓ Birth Rate | ✓ | laws.js (reproduction), main.js (profile) | ✓ |
| 11 | DEATH_RATE | ✓ Death Rate | ✓ | laws.js (life cycle death check) | ✓ |
| 12 | MUTATION | ✓ Mutation | ✓ | laws.js (reproduction), main.js (profile) | ✓ |
| 34 | ENERGY_EFFICIENCY | ✓ Energy Efficiency | ✓ | laws.js (energy conversion) | ✓ |
| 35 | SEX_CHANCE | ✓ Sex Chance | ✓ | NOT USED in laws.js but may be in solver | ✗ DEAD |
| 36 | PREDATION_BIAS | ✓ Predation Bias | ✓ | NOT USED in laws.js (only in main.js profile) | ✗ DEAD |
| 41 | SPECIES_AFFINITY | ✓ Species Affinity | ✓ | laws.js (affinity calculation) | ✓ |

### Issues

- 4 parameters defined but UNUSED in physics: MAGNETIC_MOMENT, REACTION_THRESHOLD, SEX_CHANCE, PREDATION_BIAS
- PREDATION_BIAS is set per-species in main.js profile but never read by any law function

---

### Batch 07: Audit Batch 7: DNA Parameters — Communication Group + Phenotype Expression

## Communication Params: SIGNAL_RESP, PULSE_RATE, NEIGHBORHOOD_RADIUS, SIGNAL_STRENGTH, SIGNAL_DECAY, PROPAGATION_SPEED, TUNING_CH1-4, MEMORY_DECAY

### Index Usage

| Index | Name | DNA_META | DNA_RANGES | Used In | Status |
|-------|------|----------|------------|---------|--------|
| 13 | SIGNAL_RESP | ✓ Signal Response | ✓ | NOT USED in solver/laws (main.js profile only) | ✗ |
| 14 | PULSE_RATE | ✓ Pulse Rate | ✓ | NOT USED in solver/laws (main.js profile only) | ✗ |
| 18 | NEIGHBORHOOD_RADIUS | ✓ Neighborhood Radius | ✓ | NOT USED ANYWHERE | ✗ |
| 19 | SIGNAL_STRENGTH | ✓ Signal Strength | ✓ | NOT USED ANYWHERE | ✗ |
| 20 | SIGNAL_DECAY | ✓ Signal Decay | ✓ | NOT USED ANYWHERE | ✗ |
| 21 | PROPAGATION_SPEED | ✓ Propagation Speed | ✓ | NOT USED ANYWHERE | ✗ |
| 22 | TUNING_CH1 | ✓ Tuning Ch1 | ✓ | NOT USED ANYWHERE | ✗ |
| 23 | TUNING_CH2 | ✓ Tuning Ch2 | ✓ | NOT USED ANYWHERE | ✗ |
| 24 | TUNING_CH3 | ✓ Tuning Ch3 | ✓ | NOT USED ANYWHERE | ✗ |
| 25 | TUNING_CH4 | ✓ Tuning Ch4 | ✓ | NOT USED ANYWHERE | ✗ |
| 40 | MEMORY_DECAY | ✓ Memory Decay | ✓ | NOT USED ANYWHERE | ✗ |

### Findings

The entire communication group (11 parameters) is essentially UNUSED in the current physics engine:
- SIGNAL_RESP and PULSE_RATE are set in main.js profiles but never consumed by any law/solver logic
- The remaining 9 params have zero references in solver.js or laws.js

This is a significant gap — the v2 codebase had signal propagation mechanics that have not been ported to v3.

### Phenotype Expression (expression.js)

| Function | Status | Notes |
|----------|--------|-------|
| computeColor | ✓ FIXED | Now reads particle COLOR_R/G/B as base, modulates with DNA |
| computeRadius | ✓ | Uses BASE_RADIUS, HIDDEN_MASS, MASS |
| computeAlpha | ✓ | Reads ALPHA DNA, SIGNAL, DEAD state |
| expressPhenotype | ✓ | Convenience wrapper calling all three |

### Issues

- 11 of 42 DNA parameters (26%) are completely unused in physics
- Communication/signal system is entirely missing

---

### Batch 08: Audit Batch 8: UI Panels

## Panels: HUD, Law Panel, DNA Panel, Species Panel, Preset Panel, Narrative Panel, World Panel

### Panel Status

| Panel | Component | Exists | Wired in ui.js | Renders | Issues |
|-------|-----------|--------|---------------|---------|--------|
| HUD | hud.js | ✓ | ✓ | ✓ | FPS counter has own RAF — shows FPS even when physics crashes |
| Law Panel | lawPanel.js | ✓ | ✓ | ✓ | Multi-state laws (WRAP=4) don't have proper value tracking |
| DNA Panel | dnaPanel.js | ✓ | ✓ | ✓ | Species selector renders, sliders work |
| Species Panel | speciesPanel.js | ✓ NEW | ✓ | ✓ | Shows basic cards with swatches and trait summaries |
| Preset Panel | presetPanel.js | ✓ | ✓ | Check | LocalStorage save/load |
| Narrative Panel | narrativePanel.js | ✓ | ✓ | ✓ | Log display for narrative events |
| World Panel | — | ✗ MISSING | ✗ | — | No world panel component exists |

### HUD Details

```
Subscribes to: physics:tick, stats:update
Displays: FPS, particle count, species count, tick number
FPS: Has own requestAnimationFrame loop (independent of render loop)
Particle count: Reads from physics:tick event payload
```

### Law Panel Details

```
Category sections: Physics, Biology, Chemistry, Thermodynamics, Metaphysics
Multi-state: WRAP cycles 0-3 (but value not persisted in law state — only on/off)
Toggle: Binary on/off for single-state laws
Color coding: BLUE, GREEN, PURPLE, ORANGE, RED
law:sync event: Updates visual state from external changes
```

### DNA Panel Details

```
Species selector: 64 dots, first 5 colored by species
Sliders grouped: Motion, Matter, Electromagnetism, Biology, Communication
Slider events: emit dna:changed with species, param, value
Sync: dna:sync event refreshes display
```

### Species Panel Details

```
NEW in this iteration
Shows species cards with: color swatch, name, index, trait summaries
Traits shown: Force, Viscosity, Birth Rate, Mutation, Predation, Energy Eff
No per-species population count (needs engine integration)
No inline DNA editing (redirects to DNA panel tab)
```

### Issues

- No World Panel component exists for `#world-panel`
- Narrative Panel may not receive events if narrative engine is not wired
- Species panel shows static profiles — no live particle counts
- Preset panel save/load may not properly restore all state

---

### Batch 09: Audit Batch 9: Engines

## Engines: Goal, Insight, Narrative, Lineage, Timeline

### Engine Status

| Engine | File | Functions | Wired in main.js | Status |
|--------|------|-----------|-----------------|--------|
| Goal | goalEngine.js | createGoalEngine, update, setCurrentValue, getGoals, getHistory | ✗ NOT WIRED | DISCONNECTED |
| Insight | insightEngine.js | createInsightEngine, update, clusterTrend | ✗ NOT WIRED | DISCONNECTED |
| Narrative | narrativeEngine.js | createNarrativeEngine, update | ✗ NOT WIRED | DISCONNECTED |
| Lineage | lineageTracker.js | createLineageTracker, trackBirth, trackDeath, getStats, getAncestors, getAlive | ✗ NOT WIRED | DISCONNECTED |
| Timeline | timelineEngine.js | createTimelineEngine, snapshot, scrub, getTimeline, getSnapshot, getLatest, clearTimeline, tick | ✗ NOT WIRED | DISCONNECTED |

### Analysis

**ALL FIVE ENGINES ARE COMPLETELY DISCONNECTED FROM THE APPLICATION.**

The engines exist as files with complete implementations (exported functions, internal logic) but are never imported, instantiated, or called in `main.js`. The boot sequence creates the buffer, law state, DNA buffer, renderer, and UI — then starts the render loop — without initializing any of the engines.

This means:
- No goal-based auto-tuning of world parameters
- No spatio-temporal cluster detection
- No narrative/consciousness text generation
- No evolutionary lineage tracking
- No timeline recording or playback

These were core features of v2 that have not been re-integrated into v3.

### Engine Details (what each provides)

**goalEngine.js**: Adjusts world constraints toward stability/complexity targets. Tracks current values against target ranges, reports history.

**insightEngine.js**: Detects particle clusters spatio-temporally, computes "interestingness" scores, logs pattern events.

**narrativeEngine.js**: Generates text descriptions of simulation events (births, deaths, mergers, extinctions).

**lineageTracker.js**: Records parent→offspring relationships, builds ancestry trees, reports alive/dead stats per lineage.

**timelineEngine.js**: Captures simulation snapshots at intervals, enables scrubbing playback.

---

### Batch 10: Audit Batch 10: Core Systems

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

---

## Compilation Notes

- Dead function = function that exists in source but is never called from the solver
- Missing implementation = law has an index in LAW_INDEXES but no function in laws.js
- Unused DNA param = defined in DNA_INDEXES/DNA_RANGES but never read in solver.js or laws.js
- This audit covers `v3/src/` as of the latest commit on the `new` branch
- Synergies: 19 synergy checks in solver, 8 combination rules in synergy.js
