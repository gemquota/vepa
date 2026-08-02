# Changelog: VEPA v4


## [4.1.0] - 2026-08-02

### PIZZAZ — Atmosphere & Micro-Interactions

#### Render
- **Motion trails**: the simulation canvas now fades each frame toward
  transparency (`destination-out`, 0.22/frame) instead of an opaque clear, so
  fast-moving particles streak like bioluminescent plankton. Trails freeze
  crisply while paused.
- **Particle glow**: every non-star particle gets a soft bloom halo (~2.4×
  radius, 30% alpha) under its crisp core; gravitational stars keep their
  radial-gradient corona.
- **Atmospheric backdrop**: new `#bg-canvas` layer behind the sim paints a
  deep-space radial gradient, three accent-hued nebula blobs, a deterministic
  starfield, and a cinematic vignette. Repaints on window resize.
- **CRT scanlines**: a subtle 1px repeating scanline texture sits over the
  simulation viewport (below the UI layer) for the neon-noir lab feel.
- **GLOW law** now applies a subtle additive warm lift after the frame instead
  of a pre-pass that would have fought the motion trails.

#### UI
- **Toolbar**: drop shadow + a slowly pulsing blue→red accent sheen along the
  bottom edge; buttons lift and glow blue on hover, orange pulse while active
  (play/pause), red glow on the chaos button.
- **Tabs**: active tab text glows red; hover gains a soft white shimmer.
- **HUD**: color-coded live stats — FPS green, population blue, species
  purple, tick dim.
- **Law toggles**: active law buttons gently pulse brightness.
- **Drawer**: hide/show now slides the drawer below the viewport (transform +
  visibility transition, 0.28s) instead of snapping with `display:none`, with
  a red accent hairline along its top edge.


## [4.0.4] - 2026-08-02

### Simulation
- **Spawn NaN bug fixed — no more instant clumping**: the spawn jitter called
  `prng.nextFloat()` with no arguments, but the SplitMix32 helper signature is
  `nextFloat(min, max)` — it returns `NaN` without them. Every particle spawned
  at `NaN`, and the solver's defensive reset then teleported the whole
  population to the world center on the first tick (this was also why only a
  single particle appeared visible in earlier builds). Jitter now uses
  `nextFloat(0, 1)`; headless verification shows the 1,250-particle population
  staying spread across the full world volume through tick 100+.


## [4.0.3] - 2026-08-02

### Simulation
- **Un-clumped spawn**: each species now spawns on its own grid spanning the
  full world volume, so populations start interleaved across the dish instead
  of every species occupying a contiguous depth slab (which read as dense
  clumps at boot).

### Camera
- **Pan direction fixed**: the view now follows the fingers on both axes
  (world shifts opposite the drag); horizontal pan was previously inverted.
- **Zoom no longer pans**: two-finger centroid drift under 10px is ignored
  during a pinch, so zooming in/out keeps the view still.
- **Easier rotation**: orbit sensitivity roughly doubled — mouse drag
  `0.003 → 0.006` rad/px, one-finger touch orbit `0.005 → 0.008` rad/px
  (still scaled by the settings-panel sensitivity multipliers).


## [4.0.2] - 2026-08-02

### UI
- **Drawer hide/show**: a dedicated `▼` button on the right of the tab bar
  fully hides the bottom drawer (unlike minimize, which keeps the tab strip);
  a floating `▲` pill at the bottom-center of the screen reopens it.
- **Camera recenter on drawer toggle**: the camera resets to the default
  world-centered view whenever the drawer is hidden or shown, so the dish
  never appears cut off or off-center after a layout change.

### Render
- **Removed leftover test overlay**: the red diagnostic dot and
  `particles=N` text drawn at canvas center are gone; the red "stuck
  particle" at the top edge of the drawer was this debug artifact.

### Simulation
- **Denser default population**: `DEFAULT_PARTICLES_PER_SPECIES` raised from
  50 to 250 (1,250 particles at boot), so the world reads as populated
  instead of a handful of scattered dots. Spatial-grid solver keeps the
  per-frame cost in the same range.


## [4.0.1] - 2026-08-02

### UI
- **Drawer Minimize button**: a dedicated `▁` button on the right of the tab
  bar collapses the bottom drawer to a thin strip (click `▔` to expand it
  again). State is per-session; hidden tab content resumes where it was.

### Camera
- **Perspective stretching fixed**: perspective depth is now computed in
  pixel space (`rz2 × px/unit × PERSPECTIVE_STRENGTH`) instead of raw world
  units, so depth can never exceed the focal length and invert the projection.
  With `WORLD_SIZE=2000` the old math put world-unit depth (±1700) past the
  focal distance (1200), producing the far-away/stretched look.
- **Default view fits the whole world**: `fitZoomForWorld()` now starts at
  zoom 1 (full dish visible at any world size) instead of the legacy
  `worldSize/120` over-zoom that left ~1 particle on screen.
- **Particles always visible**: the renderer clamps particle screen radius to
  a 1.5px minimum, so sub-pixel dots no longer vanish when the whole 2000³
  world is in view; wheel/pinch zoom in for close inspection.


## [4.0.0] - 2026-08-01

### Integrated Intelligence
- **Five intelligence engines wired into the simulation loop**: Insight (cluster
  detection), Narrative (4-voice commentary), Lineage (birth/death genealogy),
  Goal (self-tuning world constraints), and Timeline (record/scrub playback).
  Engines communicate exclusively through the EventBus; none touch the DOM.
- **World Intelligence Dashboard** (WORLD tab): live cluster count, lineage
  births/deaths/depth, snapshot count, recording toggle, timeline scrub slider,
  and a goal-adjustment log.
- **PREDATION law** (index 51, biology category): mass-difference pursuit,
  prey fleeing, DNA absorption and mass transfer on contact — restored as an
  explicit law toggle with full HELP_DB entry and law-grid icon.
- **Communication DNA system**: signal oscillator emission (PULSE_RATE ×
  SIGNAL_STRENGTH), channel-filtered propagation (TUNING_CH1-4 bandpass via
  normalized tuning dot product), NEIGHBORHOOD_RADIUS gating, PROPAGATION_SPEED
  pacing, SIGNAL_RESP response force + energy feed, and MEMORY accumulation
  with MEMORY_DECAY decay. Signals are now always-on (DNA-driven), not gated
  behind GLOW/TRACK toggles.
- **Offspring lineage anchors**: `applyReproduction` now returns `parentId` so
  every birth is traceable to its parent generation.
- **Goal-engine tunables**: `maxForce`, `dragMultiplier`, `birthRate`,
  `deathRate`, `scanInterval`, `clusterRadius` in `runtimeConfig`, consumed by
  the solver (force clamp ceiling/scale, global damping, REPRO/LIFE synergy
  scaling) and the insight engine (scan cadence/radius).

### Performance
- Renderer phenotype calls pass the shared Float32Array view directly (no
  per-particle `new Float32Array` allocation) — from v3 WIP.
- HUD throttles DOM writes (changed-value + tick % 10 gating).
- DNA analytics skips collection entirely while its tab is hidden.

### World Tuning (inherited v3 WIP)
- Sparse world: 5 species × 50 = 250 initial particles; `WORLD_SIZE` 2000;
  `BASE_RADIUS` range 0.2–4; gravity scaled with world size.

### Fixes
- Predation no longer conflated with TRACK law activation.
- Timeline scrub resets lineage tracking so restored dead flags don't double-log.

### Debug Overlay
- **Unified debug overlay** (`src/debug.js`): one collapsible panel collects
  every debug message since the page started (inline probe, module load, boot,
  restarts, chaos, world changes, errors, unhandled rejections).
- **Tap-to-copy**: tap the overlay header (or ⧉ COPY, or SETTINGS → DEBUG →
  COPY LOG) to copy the whole log as a single JSON object.
- **SETTINGS toggle**: DEBUG OVERLAY SHOW/HIDE, persisted in localStorage.
- Inline `index.html` probe now logs into the shared buffer instead of drawing
  a separate banner, and falls back to a plain banner after 3s if the module
  bundle fails to load.

### Testing
- New `tests/unit/engines.test.js` (insight, lineage, timeline, goal) and
  `tests/unit/signal.test.js` (pulse, propagation, channel filtering).
- 39/39 unit tests pass; vitest timeout raised to 15s for slow CI environments.


## [3.1.0] - 2026-07-29 (VEPA v3 history retained)

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
