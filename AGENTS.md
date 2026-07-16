# AGENTS.md — VEPA Workspace Initialization & Codebase Audit

> **Project:** VEPA — Vector Emergent Physics Automata
> **Version:** 3.3.0 (Working Tree: `new` branch, based on `master`)
> **Audit Hash:** `NUCLEAR_REWRITE_INIT_v3.3.0`
>
> This file is the canonical initialization prompt for any agent entering this workspace. It contains a complete codebase audit, architectural SSOT, conventions, and operational workflows. All agents **must** read this file first before any code modification.

---

## 1. PROJECT IDENTITY

VEPA is a **GPU-accelerated (Web Workers + Canvas2D/PixiJS) emergent physics simulation** — a synthetic petri dish where particles governed by 42-parameter DNA profiles interact under 64 global laws. A **Narrative Consciousness** layer acts as the functional "ink," rewriting physics based on the unfolding story of simulated species.

| Attribute | Value |
|-----------|-------|
| **Repository** | `github.com/gemquota/vepa.git` |
| **Branches** | `master` (stable), `new` (active development — **current**) |
| **Current Version | 2.5.0 |
| **License** | ISC |
| **Package Manager** | npm (with `package-lock.json`) |
| **Runtime** | Browser (ESM), Node.js (scripts only) |
| **Key Dependencies** | `pixi.js` ^8.18.1, `@playwright/test` ^1.60.0, `vite` ^8.0.8 |
| **Module System** | ESM (`"type": "module"` in `package.json`) |
| **Git Author** | ACE Sovereign Bot (`ace-bot@example.com`) |

---

## 2. COMPLETE CODEBASE AUDIT

### 2.1 Directory Tree & File Inventory

```
vepa-feature-nuclear-rewrite/
├── AGENTS.md                          ← THIS FILE (workspace initialization)
├── CHANGELOG.md                       ← Versioned change history (current: 3.4.0)
├── COMPENDIUM.md                      ← Master project compendium / clone specification
├── ENGINE_SSOT.md                     ← Single Source of Truth for engine parameters & laws
├── GEMINI.md                          ← Foundational project mandates (takes precedence)
├── GUIDE.md                           ← Architect's field manual / emergent behavior recipes
├── README.md                          ← Project overview & quick-start
├── VERSION                            ← Plain-text version string ("3.3.0")
├── combined.txt                       ← Monolithic concatenated context file (29K+ lines)
├── index.html                         ← Main application entry point (Particle God UI shell)
├── package.json                       ← npm manifest
├── package-lock.json                  ← npm lockfile
├── style.css                          ← Main application styles (~1,469 lines)
│
├── src/                               ← APPLICATION SOURCE (~6,914 LOC JS)
│   ├── main.js                        ← Central orchestrator, VepaEngine class (1,251 LOC)
│   ├── ui.js                          ← UI layer — menus, sliders, panels (2,224 LOC)
│   ├── constants.js                   ← All engine constants, HELP_DB, DNA_META (1,180 LOC)
│   ├── insightEngine.js               ← Spatio-temporal cluster detection & pattern logging
│   ├── narrativeConsciousness.js      ← Multi-voice internal monologue
│   ├── narrativeEngine.js             ← Narrative generation engine
│   ├── goalEngine.js                  ← Auto-adjusts world constraints
│   ├── personalityEngine.js           ← Systemic bias (Curiosity, Stability, Chaos)
│   ├── emergentParamEngine.js         ← Emergent parameter discovery
│   ├── lineageTracker.js              ← Evolutionary history tracking
│   ├── persistenceEngine.js           ← Save/load state persistence
│   ├── timelineEngine.js              ← Timeline / history playback engine
│   ├── levelEngine.js                 ← Level/scenario configuration (34 LOC)
│   │
│   ├── core/
│   │   ├── eventBus.js                ← Simple pub/sub event bus (16 LOC)
│   │   └── prng.js                    ← SplitMix32 PRNG implementation
│   │
│   ├── system/
│   │   └── integration.js             ← System wiring / bootstrap integration
│   │
│   ├── worker/
│   │   └── physics.worker.js          ← Web Worker: O(N²) physics with spatial hashing (296 LOC)
│   │
│   └── engines/
│       ├── analysis/analysisEngine.js
│       ├── cluster/clusterEngine.js
│       ├── memory/memoryEngine.js
│       ├── metrics/metricsEngine.js + derivedMetrics.js
│       ├── policy/policyEngine.js
│       └── prediction/predictionEngine.js
│
├── scripts/                           ← BUILD TOOLS (Python + Node.js)
│   ├── build_codex.js                 ← Builds Codex JSON from HELP_DB + synergy data
│   ├── build_ssot.py                  ← SSOT documentation generator from constants
│   ├── inject_physics_bus.py          ← Physics bus code injection
│   ├── restore_from_combined.py       ← Restore source from combined.txt backup
│   ├── run.py                         ← Python runner utility
│   ├── run.sh                         ← Shell runner utility
│   └── setup_vepa_architecture.py     ← Architecture setup scaffolding
│
├── codex/                             ← IN-ENGINE DOCUMENTATION (standalone HTML app)
│   ├── index.html                     ← Codex app shell (HG2G database style)
│   ├── main.js                        ← Codex app logic (169 LOC)
│   ├── style.css                      ← Codex-specific styles (144 LOC)
│   ├── entries.json                   ← Encyclopedia entries (1,453 lines)
│   ├── synergyData.js                 ← Law synergy definitions (419 LOC)
│   └── synergyGraph.js                ← Synergy graph visualization (205 LOC)
│
├── docs/                              ← EXTENDED DOCUMENTATION
│   ├── fullaudit.md                   ← Ultra-system audit — all 42 traits + 28 world params
│   ├── lawaudit.md                    ← Comprehensive law audit — all 64 laws with code proof
│   ├── stubs.md                       ← Documentation stubs & roadmap (prioritized gaps)
│   ├── EXPANSION_PROGRESS.md          ← Doc expansion batch progress (1-3 done, 4-15 pending)
│   ├── arch/                          ← (Stubs) spatial_grid, worker_sync, law_bitmask
│   ├── mechanics/                     ← (Stubs) metaphysics, chaos_multiplex, thermodynamics
│   ├── ui/                            ← (Stubs) drone_logic, codex_links, preset_routing
│   ├── dev/                           ← (Stubs) intelligence_bus, custom_agents
│   ├── nlm/                           ← NLM documentation (10 docs + glossary + performance)
│   ├── meta/                          ← Persona docs (ADVERSARY, ARCHITECT, EVALUATOR, TEAM_LEAD)
│   └── expansion/batches/             ← Deep-dive encyclopedia batches (01-03 done)
│
├── archive/                           ← HISTORICAL ARTIFACTS
│   ├── PICKLE_JAR.md                  ← Historical roadmap
│   ├── legacy_index.html              ← Legacy app shell
│   ├── new.html                       ← Previous-gen app shell
│   ├── synergy_graph.html             ← Standalone synergy graph
│   └── ssot/ENGINE_SSOT_v1.1.0.md     ← Archived SSOT version
│
├── .git/                              ← Git repo (1 commit on `new`)
├── .gitignore                         ← node_modules/, *.log, __pycache__/, *.pyc, .DS_Store
├── .dist/                             ← Vite build output (gitignored)
├── .node_modules/                     ← Pre-vendored node_modules
├── .tests/                            ← Test artifacts (screenshots, video, validate_engine.py)
├── .tickets/                          ← Linear-style tickets (done/ + active)
└── .omg/                              ← OMG framework state (learn-watch.json)
```

### 2.2 Source Code Size Breakdown

| File | Lines | Role |
|------|-------|------|
| `src/ui.js` | 2,224 | UI rendering, panels, accordions, HUD |
| `src/main.js` | 1,251 | Engine orchestrator, init, render loop |
| `src/constants.js` | 1,180 | All constants, HELP_DB, DNA_META, LAW_INDEXES |
| `src/worker/physics.worker.js` | 296 | Physics solver (spatial grid, laws, forces) |
| `src/insightEngine.js` | 296 | Pattern detection & logging |
| `src/persistenceEngine.js` | 368 | Save/load to localStorage |
| `src/ui.js (codex/main.js)` | 169 | Standalone codex app |
| Total `src/` | ~6,914 | All application logic |
| `style.css` | 1,469 | Application styles |
| `index.html` | 488 | Application HTML shell |
| Combined total (JS+CSS+HTML) | ~8,871 | Source surface area |

### 2.3 Git State

| Property | Value |
|----------|-------|
| **Current Branch** | `new` (diverged from `master`) |
| **Commits** | 1 (`0938645 VEPA: Nuclear Rewrite Initial State`) |
| **Working Tree** | Dirty — 105 files changed (+19,036 / -25,855) |
| **Untracked** | ~40+ files (.dist/, .tests/, .tickets/, docs/, scripts/, restored files) |
| **Remote** | `origin` → `github.com:gemquota/vepa.git` |

**Important:** The working tree has a large diff because this is a "nuclear rewrite" state. Many files were removed from tracking (old dist, old tickets, old tests) and new files are untracked. Changes should be committed to the `new` branch.

---

## 3. MEMORY & DATA ARCHITECTURE (THE STRIDE SYSTEM)

This is the **most critical architectural concept** in VEPA. All particle state is stored in flat `SharedArrayBuffer` / `Float32Array` buffers. Each particle occupies exactly **100 floats** (the STRIDE).

### 3.1 Particle Stride Layout (0-99)

| Offset(s) | Key | Type | Description |
|-----------|-----|------|-------------|
| 0 | `POS_X` | f32 | X coordinate (toroidal) |
| 1 | `POS_Y` | f32 | Y coordinate |
| 2 | `POS_Z` | f32 | Z coordinate (3D aware) |
| 3 | `VEL_X` | f32 | Velocity X |
| 4 | `VEL_Y` | f32 | Velocity Y |
| 5 | `VEL_Z` | f32 | Velocity Z |
| 6 | `MASS` | f32 | Physical mass |
| 7 | `SPECIES_ID` | f32 | Species index (0-63) |
| 8-71 | `DNA_CACHE` | f32 | Cached DNA (64 params at 8+idx) |
| 72 | `ENERGY` | f32 | Internal energy (0-200) |
| 73 | `AGE` | f32 | Frame count since birth |
| 74 | `DEAD` | f32 | 0=Alive, 1=Dead, 0.5=Soul |
| 75-77 | `COLOR_R/G/B` | f32 | Color channels |
| 78 | `MEMORY` | f32 | Internal memory state |
| 79 | `SIGNAL` | f32 | Pulse intensity |
| 80 | `RADIUS` | f32 | Physical extent (phenotype derived) |
| 81 | `ALPHA` | f32 | Visual transparency |
| 82 | `MITOSIS_TIMER` | f32 | Dual-system countdown |
| 83 | `PARTNER_ID` | f32 | Breeding partner reference |
| 84 | `HUNGER` | f32 | Starvation counter (0-100) |
| 85 | `ARMOR` | f32 | Defense/integrity rating |
| 86 | `BOND_COUNT` | f32 | Active valence connections |
| 87 | `CHAIN_LENGTH` | f32 | Polymerization chain length |
| 88-93 | `BOND_PARTNER_1-6` | f32 | Bond partner indices |
| 94 | `SPECIES_CLASS` | f32 | Tier (0=Base...4=Polymer) |
| 95 | `COMBAT_STATE` | f32 | 0=Idle, 1=Pursuit, 2=Attack, 3=Flee |
| 96-98 | `STIGMERGY_X/Y/Z` | f32 | Local pheromone field readings |
| 99 | `RESERVED_3` | f32 | Future expansion |

### 3.2 Species DNA Buffer (64 × 64)

A separate `SharedArrayBuffer` of shape `[64 species][64 DNA values]`. Each species has 42 DNA parameters (indices 0-41), stored as `Uint16Array` (packed 0-65535, mapped to float ranges via `DNA_RANGES`).

### 3.3 Concurrency Model

- **Main Thread:** UI (PixiJS sprites), orchestrator (`VepaEngine`), rendering loop
- **Worker Thread:** Physics loop (`physics.worker.js`), spatial grid, law computation
- **Shared Memory:** `SharedArrayBuffer` for zero-copy particle state. Worker writes, main thread reads via double-buffering with Transferable Objects
- **Sync Protocol:** Message passing via `postMessage` with `{type, data, config, version}` envelope

### 3.4 Spatial Grid (N-Body Optimization)

- 12×12×12 grid partitioning
- `MAX_CELL_CAPACITY = 100` particles per cell
- Toroidal coordinate re-mapping within grid
- Forces only computed for particles in same or adjacent cells (27-cell neighborhood)
- `MAX_INTERACTIONS = 500` per particle (relativistic stability layer)

### 3.5 Law Bitmask System

Laws are 64-bit flags split into `lowFlags` (bits 0-31) and `highFlags` (bits 32-63). Never hardcode law indices — always use `LAW_INDEXES` from `constants.js`. The `computeFlags()` function in `main.js` builds the bitmask from the `this.laws` state object.

**Categories & bit ranges:**

| Category | Bits | Indices | Count |
|----------|------|---------|-------|
| Physics | 0-15 | `GRAV`–`BOIL` | 16+ |
| Biology | 16-31 | `LIFE`–`EXOP` | 13 |
| Chemistry | 32-47 | `CATA`–`ALLO` | 10 |
| Metaphysics | 48-63 | `TIME`–`ASTR` | 12 |

---

## 4. DNA PARAMETER SYSTEM (42 INDICES)

Each species has 42 DNA parameters divided into 6 functional groups. All indices are defined in `DNA_INDEXES` in `src/constants.js` and accessed via `DNA_OFFSETS` in the worker.

### 4.1 Physics & Motion (Indices 0-3, 15, 26-28)
- `FORCE(0)`: Primary attraction/repulsion (±)
- `VISCOSITY(1)`: Kinetic dampening (0-1)
- `TORQUE(2)`: Rotational momentum
- `JITTER(3)`: Brownian motion entropy
- `TIDAL(15)`: Differential structural forces
- `INERTIA(26)`: Acceleration resistance
- `FRICTION(27)`: Velocity-dependent drag
- `MAX_VELOCITY(28)`: Terminal speed

### 4.2 Matter & Morphology (Indices 6-9, 16-17, 29-31)
- `SYMMETRY(6)`: C3 interaction shape distortion
- `HIDDEN_MASS(7)`: Invisible mass multiplier
- `STIFFNESS(8)`: Structural rigidity
- `FUSION(9)`: Mass-merging efficiency
- `FUSION_MOMENTUM(16)`: Minimum collision strength for merging
- `FUSION_TIME(17)`: Temporal gating to growth
- `BASE_RADIUS(29)`: Starting size
- `ELASTICITY(30)`: Collision bounciness
- `BOND_ANGLE(31)`: Favored cluster geometry

### 4.3 Electromagnetism & Chemistry (Indices 4-5, 32-33, 37-39)
- `POLARITY(4)`: Charge (C1)
- `ALPHA(5)`: Visual matter density (C2)
- `CONDUCTIVITY(32)`: Charge/energy transfer rate
- `MAGNETIC_MOMENT(33)`: Neighbor charge alignment
- `REACTION_THRESHOLD(37)`: Mass limit for phase change
- `CATALYSIS(38)`: Reaction speed multiplier
- `HEAT_OUTPUT(39)`: Interaction energy byproduct

### 4.4 Biology & Life (Indices 10-12, 34-36, 41)
- `BIRTH_RATE(10)`: Spontaneous reproduction chance
- `DEATH_RATE(11)`: Spontaneous decay chance
- `MUTATION(12)`: Offspring DNA randomness
- `ENERGY_EFFICIENCY(34)`: Mass→energy conversion
- `SEX_CHANCE(35)`: Multi-parent reproduction probability
- `PREDATION_BIAS(36)`: Attraction to lower-mass species
- `SPECIES_AFFINITY(41)`: Same/different species bias

### 4.5 Communication & Memory (Indices 13-14, 18-25, 40)
- `SIGNAL_RESP(13)`: Neighbor pulse sensitivity
- `PULSE_RATE(14)`: Internal oscillator frequency
- `NEIGHBORHOOD_RADIUS(18)`: Range of influence
- `SIGNAL_STRENGTH(19)`: Communication intensity
- `SIGNAL_DECAY(20)`: Signal persistence
- `PROPAGATION_SPEED(21)`: Signal travel speed
- `TUNING_CH1-CH4(22-25)`: Receptor filtering channels
- `MEMORY_DECAY(40)`: Internal state persistence

---

## 5. LAW SYSTEM (64 GLOBAL LAWS)

Laws are multi-state toggles organized in 5 categories. Each law has a `HELP_DB` entry in `src/constants.js` with 4 tiers (HINT, EXPLANATION, SYSTEM, ADVANCED).

### 5.1 Physics Laws (Blue — UI color)
`grav`, `drag`, `entr`, `wrap`(4-state), `coll`, `accr`, `planet`, `void`, `bond`

### 5.2 Biology Laws (Green)
`life`, `glow`, `affinity`, `reproduction`(4-tier), `tracking`, `senescence`, `genotype`, `phenotype`, `ener`, `rad`

### 5.3 Chemistry Laws (Purple)
`cata`, `solv`, `acid`, `oxid`, `redu`, `poly`, `isom`, `chir`, `crys`, `allo`

### 5.4 Thermodynamics Laws (Orange)
`heat`, `cold`, `conv`, `radi`, `subl`, `melt`, `boil`, `cond`, `depo`, `exop`

### 5.5 Metaphysics Laws (Red)
`time`, `dime`, `harmony`(3-state), `fate`, `will`, `soul`, `mind`, `tele`, `clai`, `preo`, `astr`

### 5.6 Synergy System (from `physics.worker.js`)

Law synergies via `computeSynergyBonus()` — specific law combinations produce emergent bonus/penalty effects:

| Synergy | Effect |
|---------|--------|
| `MIND + ENER` | −2.0 (hive mind energy drain) |
| `GRAV + TIME` | −1.5 (relativistic pull slowdown) |
| `ENTR + CRYS` | −1.0 (entropy fights crystallization) |
| `COLL + RAD` | −0.5 (collisions in radiation field lose energy) |
| `RAD + GENO` | −1.0 (radiation damages genotype stability) |
| `POLY + MIND` | −2.0 (polymerized hivemind overhead) |
| `ASTR + SOUL` | −1.5 (astral soul projection cost) |

---

## 6. CODING CONVENTIONS & STANDARDS

### 6.1 JavaScript Conventions

- **Module System:** ESM (`import`/`export`) throughout
- **Formatting:** No formatter configured; maintain consistent style with existing codebase
- **Naming:**
  - Classes: `PascalCase` (e.g., `VepaEngine`, `InsightEngine`, `LineageTracker`)
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE` (e.g., `DNA_STRIDE`, `LAW_INDEXES`, `MAX_FORCE`)
  - Files: `snake_case.js` (lowercase, underscores)
- **Event System:** Use `bus` (EventBus) from `./core/eventBus.js` for decoupled communication
- **PRNG:** Use `SplitMix32` from `./core/prng.js` — never use `Math.random()` for simulation-critical randomness
- **State Objects:** Engine state is in `this` (VepaEngine instance). Worker state is module-scoped
- **Flags:** Never hardcode law bit indices — always reference `LAW_INDEXES.GRAV` etc.
- **DNA Offsets:** In the worker, use `DNA_OFFSETS` (built from `DNA_INDEXES + STRIDE_INDEXES.DNA_CACHE_START`)
- **Stride Access:** Always compute particle pointer as `i * STRIDE` where `i` is particle index
- **NaN Guards:** Every physics sub-step must validate coordinates and velocities for NaN
- **No file extensions** in import paths (bare module specifiers resolve via Node.js/bundler)

### 6.2 UI Conventions

- UI is built programmatically in `src/ui.js` — no framework
- All UI elements use the `chunk-type-*` CSS class system for menu panel theming
- Every interactive element should have a `data-help-key` attribute linking to `HELP_DB`
- SVG icons preferred over emoji for toolbar buttons
- DNA sliders must use `DNA_RANGES` from `constants.js` for min/max/default/step
- HUD updates flow through `updateHUD()` → stats display
- Color categories: BLUE=Physics, GREEN=Biology, PURPLE=Chemistry, ORANGE=Thermodynamics, RED=Metaphysics
- Law toggle icons show numeric state indicators for multi-state laws (0-3 for Wrap, 0-2 for Thermal/Harmony)
- `window.*` globals for function callbacks from inline HTML event handlers

### 6.3 CSS Conventions

- CSS custom properties (variables) in `:root` / `.theme-sanguine`
- `.bolt` pseudo-elements for corner decorations on menu panels
- `.chunk-inner` for panel content containers
- BEM-ish naming: `.side-bar`, `.playback-bar-container`, `.quick-presets-container`
- Neon-noir aesthetic: glow effects, scanlines, high-contrast borders

### 6.4 HTML Conventions

- Single-page app architecture (`index.html` as shell)
- Dynamic content injected by `ui.js`
- Codex is a separate standalone HTML app (`codex/index.html`)

---

## 7. DOCUMENTATION & SSOT MANDATES

### 7.1 Documentation Synchronization (GEMINI.md Mandate)

Every significant code change **MUST** be synchronized across these files:

| File | Content | Sync Trigger |
|------|---------|--------------|
| `CHANGELOG.md` | Versioned change log | Any functional change |
| `README.md` | Project overview | Architecture shifts, new features |
| `GUIDE.md` | User-facing recipes | New emergent behaviors |
| `ENGINE_SSOT.md` | Technical SSOT | Law/DNA changes, parameter shifts |
| `docs/fullaudit.md` | System audit | Parameter/law index changes |
| `docs/lawaudit.md` | Law audit | New laws, law behavior changes |
| `src/constants.js` (HELP_DB) | 4-tier documentation | New laws or parameters |
| `codex/entries.json` | In-engine encyclopedia | After HELP_DB changes |

### 7.2 The B-4RK Principle
Documentation is not an afterthought; it is a feature. All new laws **must** be accompanied by `HELP_DB` entries covering all four tiers (HINT, EXPLANATION, SYSTEM, ADVANCED).

### 7.3 Codex Parity
The Codex (`codex/index.html`) must remain the primary in-engine source of truth. Changes to `ENGINE_SSOT.md` should be reflected in `codex/entries.json` via `scripts/build_codex.js`.

### 7.4 Documentation Expansion
See `docs/stubs.md` for the prioritized list of documentation gaps. Expansion progress is tracked in `docs/EXPANSION_PROGRESS.md` across 15 batches (batches 01-03 complete, 04-15 pending).

---

## 8. TESTING & QUALITY ASSURANCE

### 8.1 Test Infrastructure

- **Playwright** (`@playwright/test` ^1.60.0) available as dev dependency
- **Python validator** at `.tests/validate_engine.py` — runs three test suites:
  1. `test_js_syntax()` — `node --check` on all `src/**/*.js` files
  2. `test_ssot_alignment()` — Verifies DNA params and law names match between `ENGINE_SSOT.md` and `src/constants.js`
  3. `test_law_coverage()` — Checks all laws have `HELP_DB` entries

### 8.2 How to Run Tests

```bash
# Python validation suite
python3 .tests/validate_engine.py

# JavaScript syntax check (all modules)
find src -name '*.js' -exec node --check {} \;

# Vite build check
npx vite build 2>&1 | head -30
```

### 8.3 Testing Principles

- Always run `python3 .tests/validate_engine.py` after any constants/DNA/law changes
- Verify syntax after any JS edits: `find src -name '*.js' -exec node --check {} +`
- Test the app by opening `index.html` in a browser (or use `npx serve .`)
- Use Playwright for headless integration tests if adding complex UI flows
- Do not fix unrelated test failures or bugs

---

## 9. BUILD SYSTEM & DEPLOYMENT

### 9.1 Vite Build

```bash
npx vite build          # Produces .dist/ with optimized bundles
npx vite build --watch  # Watch mode for development
```

Output goes to `.dist/` (gitignored). PixiJS is tree-shaken during build. Cross-origin isolation headers (COOP/COEP) needed for `SharedArrayBuffer`.

### 9.2 Scripts

| Script | Purpose | Runtime |
|--------|---------|---------|
| `scripts/build_codex.js` | Builds `codex/entries.json` from HELP_DB + synergy data | Node.js |
| `scripts/build_ssot.py` | Generates SSOT markdown from constants | Python 3 |
| `scripts/inject_physics_bus.py` | Physics bus code injection | Python 3 |
| `scripts/restore_from_combined.py` | Restore source from `combined.txt` | Python 3 |
| `scripts/run.py` | Python runner for simulation control | Python 3 |
| `scripts/run.sh` | Shell runner | Bash |
| `scripts/setup_vepa_architecture.py` | Architecture scaffolding | Python 3 |

Python scripts require stdlib only (Python 3.10+). All paths are relative to repo root.

### 9.3 Static Server (Development)

```bash
npx serve .             # Serves on localhost:3000
npx vite                # Vite dev server with HMR
```

Necessary HTTP headers for SharedArrayBuffer:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

---

## 10. WORKFLOW & OPERATIONAL PROTOCOLS

### 10.1 Agent Entry Procedure

1. **Read this file** (AGENTS.md) — you are doing this now ✓
2. **Audit git state:** `git status` to see current dirty/untracked state
3. **Verify branch:** Should be on `new` — if on `master`, switch
4. **Check src/constants.js** for the current HELP_DB and LAW_INDEXES — this is the runtime SSOT
5. **Check ENGINE_SSOT.md** for the documented SSOT — ensure parity with code
6. **Check docs/stubs.md** for known documentation gaps
7. **Read GEMINI.md** for project mandates (takes precedence over general instructions)

### 10.2 Change Protocol

1. **Make the change** in source files
2. **Validate syntax:** `find src -name '*.js' -exec node --check {} +`
3. **Run tests:** `python3 .tests/validate_engine.py`
4. **Update documentation** per Section 7 (minimum: CHANGELOG.md + ENGINE_SSOT.md)
5. **Rebuild Codex** if HELP_DB changed: `node scripts/build_codex.js`
6. **Verify no regressions:** open `index.html` and check the simulation loads
7. **Stage and commit:** `git add -A && git commit -m "description"`

### 10.3 Common Pitfalls

| Pitfall | Resolution |
|---------|------------|
| **SharedArrayBuffer not supported** | Ensure page served with COOP/COEP headers; check browser support |
| **Worker postMessage size limits** | Use `Transferable` objects for buffer transfers |
| **Physics NaN explosion** | Check NaN shields in worker; verify MAX_VELOCITY clamp |
| **UI/DNA slider mismatch** | Verify DNA_RANGES matches 42-parameter layout; check STRIDE_INDEXES |
| **Law toggle not working** | Check `computeFlags()` in main.js; ensure law is in correct category map |
| **Codex entries stale** | Re-run `node scripts/build_codex.js` after HELP_DB changes |
| **Memory/stride corruption** | Verify all buffer accesses use `STRIDE * index + offset` pattern |
| **Race condition in buffer sync** | Check double-buffering sync lock in main.js render loop |
| **Flickering particles** | Check zero-alpha coercion bug (see CHANGELOG 2.4.4); verify Z-sorting |
| **Planetary law not working** | Historical naming bug: key is `planet` not `planetary` |

### 10.4 Adding a New Law (Step-by-Step)

1. Add index to `LAW_INDEXES` in `src/constants.js`
2. Add to `LAW_MAP` category array
3. Add `HELP_DB` entry with all 4 tiers
4. Add default state in `VepaEngine.laws` in `src/main.js`
5. Add logic in `physics.worker.js` (use `isSet(LAW_INDEXES.YOUR_LAW)`)
6. Register in `computeFlags()` in `src/main.js`
7. Add UI toggle in `src/ui.js` (category section)
8. Update `ENGINE_SSOT.md` and `docs/fullaudit.md`
9. Rebuild codex: `node scripts/build_codex.js`
10. Run validation: `python3 .tests/validate_engine.py`
11. Update `CHANGELOG.md`

### 10.5 Important Architecture Constraints

- **Species limit:** 64 species (DNA buffer `[64 × 64]`)
- **Particle stride:** 64 floats per particle
- **Grid resolution:** 12×12×12 cells
- **Max cell capacity:** 100 particles/cell
- **Max interactions:** 500/particle/frame (worker throttle)
- **Max sub-steps:** 10 per frame (tunneling prevention)
- **Max force clamp:** 50.0 (stability layer)
- **DNA buffer type:** `Uint16Array` (packed 0-65535)
- **Particle buffer type:** `Float32Array`
- **Color evolution:** Accretion (mass-weighted), Predation (shift toward prey), Breeding (averaged + hue mutation)
- **Reproduction tiers:** Cloning → Sexual → Mitosis → Hybridization

---

## 11. KEY PRESET PROFILES (PRIME_DEFAULT)

| Species | Color | Role | Force | Viscosity | Key Traits |
|---------|-------|------|-------|-----------|------------|
| **Predator** | Red | Aggressive hunter | 0.4 | — | High predation bias, negative affinity |
| **Sol** | Yellow | Stellar core | 1.0 | 0.99 | High fusion, stable attractor |
| **Life** | Green | Biological reproducer | — | — | High birth rate, energy efficiency |
| **Aether** | Cyan | Social swarmer | 0.4 | — | High signal response, positive affinity |
| **Void** | Purple | Ethereal field | 0.05 | 0.995 | Low alpha, near-static, minimal influence |

**Other built-in presets:** VOID_CORE, NEURAL_DRIFT, SOLAR_FLARE, CRYSTAL_LATTICE, PREDATOR_SWARM, KINETIC_GAS, SYMBIOTIC_LOOP, CHRONOS_FLUX

---

## 12. INTELLIGENCE ENGINES

VEPA contains several "intelligence" engines that operate above the physics layer:

- **Insight Engine** (`src/insightEngine.js`): Spatio-temporal cluster detection and "interestingness" scoring with pattern logging
- **Narrative Consciousness** (`src/narrativeConsciousness.js`): 4-voice monologue (Stabilizer, Diverger, Observer, Dissolver)
- **Goal Engine** (`src/goalEngine.js`): Auto-tunes world constraints toward stability/complexity targets
- **Personality Engine** (`src/personalityEngine.js`): Drives systemic bias (Curiosity, Stability, Chaos)
- **Lineage Tracker** (`src/lineageTracker.js`): Tracks evolutionary genealogy
- **Timeline Engine** (`src/timelineEngine.js`): History recording and scrubbing playback
- **Emergent Param Engine** (`src/emergentParamEngine.js`): Discovers emergent parameter configurations

---

## 13. CURRENT DOCUMENTATION GAPS (from `docs/stubs.md`)

| Priority | Topic | Stub Location |
|----------|-------|---------------|
| **CRITICAL** | Spatial Grid & N-Body Optimization | `docs/arch/spatial_grid.md` |
| **CRITICAL** | SharedArrayBuffer & Worker Sync | `docs/arch/worker_sync.md` |
| **CRITICAL** | Law Bitmask System (64-bit) | `docs/arch/law_bitmask.md` |
| **HIGH** | Metaphysical Laws Practitioner Guide | `docs/mechanics/metaphysics.md` |
| **HIGH** | Chaos Multiplex & Parallel Realities | `docs/mechanics/chaos_multiplex.md` |
| **HIGH** | Thermodynamics & Phase Transitions | `docs/mechanics/thermodynamics.md` |
| **MEDIUM** | Expansion Batch 04 (spread, seed, entropy) | `docs/expansion/batches/batch_04.md` |
| **MEDIUM** | Expansion Batch 05 (DNA Kinetic Traits) | `docs/expansion/batches/batch_05.md` |

---

## 14. QUICK REFERENCE

```bash
# Git
git log --oneline                        # View history
git diff --stat HEAD                     # Uncommitted changes
git status                               # Working tree state

# Validation
python3 .tests/validate_engine.py        # Run test suite
find src -name '*.js' -exec node --check {} +  # Syntax check

# Build
npx vite build                           # Production build
node scripts/build_codex.js              # Rebuild codex entries from HELP_DB
python3 scripts/build_ssot.py            # Regenerate SSOT from constants

# Serve
npx serve .                              # Static HTTP server

# File counts
find src -name '*.js' | wc -l            # → 20 source files
wc -l src/**/*.js src/*.js               # → ~6,914 LOC total
wc -l style.css index.html               # → ~1,957 LOC UI surface

# Verify key constants before editing
grep "PARTICLE_STRIDE" src/constants.js              # → 100
grep 'DNA_STRIDE' src/constants.js       # → 64
grep 'MAX_CELL_CAPACITY' src/worker/physics.worker.js  # → 100
grep 'MAX_INTERACTIONS' src/worker/physics.worker.js   # → 500
grep 'MAX_FORCE' src/worker/physics.worker.js           # → 50.0
```

---

*Generated 2026-06-13 | Workspace initialization audit complete. Verify SSOT parity before any code change.*
