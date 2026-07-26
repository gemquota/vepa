# VEPA Engine: World Seeding & Entropy (Batch 04)

This document provides a high-fidelity deep dive into the world parameters governing spatial distribution of the initial particle population and stochastic noise injection within the VEPA (Vector Emergent Physics Automata) simulation. Each entry is calibrated for senior engineering personnel requiring a holistic understanding of the engine's seeding topology and entropy dynamics.

---

## 1. spreadX

**BASIC:**
Per-axis distribution scaling factor for the X dimension. `spreadX` controls the horizontal extent of the initial particle seeding pass, acting as a multiplier on `dimX` in the spawn coordinate calculation. Stored in `worldConfig.spreadX` with a range of 0.1–1.0. When combined with `spreadY` and `spreadZ`, it defines the cuboid bounding region for all five distribution modes (Soup, Big Bang, Bipolar, Galaxy, Grid).

**ADVANCED:**
`spreadX` determines the fraction of `dimX` that the spawn algorithm consumes during initialization. In Soup mode, spawn coordinates are computed as `(Math.random() - 0.5) * W * spread`, where `W` is `dimX` and `spread` is resolved from `worldConfig.spreadRadius` (defaulting to 1.0). Note that the current engine version reads a single `spreadRadius` value for all three axes rather than per-axis spread values — the `spreadX`/`spreadY`/`spreadZ` UI sliders are exposed in the Distribution accordion panel for future per-axis control and are stored in `worldConfig` but not yet consumed by the spawn code path.

The spawn loop uses a single spread scalar computed as `spread = this.worldConfig.spreadRadius || 1.0`. This scalar multiplies the per-axis world dimensions for each distribution type:
- **Soup:** `px = (Math.random() - 0.5) * W * spread` — uniform random fill across the spread-scaled extent
- **Grid:** Spacing computed as `(W * spread) / side` for equally-spaced lattice points
- **Big Bang:** Tight cluster of `±5` units regardless of spread (inherits legacy behavior)
- **Bipolar:** `px = side * W * 0.4 * spread + (Math.random()-0.5) * 100` — two opposed lobes
- **Galaxy:** Radial distance `r = Math.pow(Math.random(), 0.5) * W * 0.5 * spread`

Reducing `spreadX` (via the slider, once wired) concentrates the initial population into a narrower horizontal band, increasing local particle density by factors proportional to `1/spreadX`. This compression raises the probability of immediate high-energy collisions and cluster nucleation in the first `dt` steps.

**EXPERT:**
The spawn coordinate generation in `VepaEngine.buildParticleBuffers()` (src/main.js) loops through the population count and writes position values into the `SharedArrayBuffer` at `STRIDE_INDEXES.POS_X/Y/Z` offsets. The spread scalar directly controls the initial density matrix — a value of `0.1` concentrates all particles into 1% of the world volume, producing an initial mass density of `100×` the uniform case. This has direct consequences for the spatial hash grid on the first physics tick: cells near origin will saturate to `MAX_CELL_CAPACITY (100)`, triggering the neighbor-list truncation and effectively creating a "hot start" collision regime.

The per-axis spread values, once implemented, will replace `spreadRadius` and allow engineers to set different compression ratios per dimension. This enables anisotropic initial conditions: a flat disc (high X/Y, low Z), a vertical column (low X, high Y, low Z), or a thin sheet (high X, low Y, high Z). These anisotropic starts directly influence which emergent structures can form — disc distributions favour vortex formation, columns produce vertical stratification under gravity, and sheets create high-frequency lateral collision cascades.

From a reproducibility standpoint, the initial spawn coordinates are deterministic for the Grid distribution (based on index arithmetic) and stochastic for Soup/Big Bang/Bipolar/Galaxy (based on `Math.random()`). The VEPA engine does not currently seed the PRNG for the spawn phase, meaning runs with identical configuration will produce different initial coordinates unless the host environment provides seeded `Math.random()`. The `persistenceEngine.js` snapshot mechanism captures the full particle buffer post-spawn, including positions, so exact state can be restored regardless of PRNG state.

High spread combined with high `G` (global gravity) produces diffuse initial conditions that delay gravitational collapse, allowing small-scale structures to form before the global barycenter dominates. Low spread with high `G` produces rapid proto-singularity formation — the entire population collapses into a single dense cluster within tens of steps, which can trigger fusion cascades if the `FUSION` law is active. The interaction between spread and gravity is the primary control knob for the "violence" of the simulation's first epoch.

---

## 2. spreadY

**BASIC:**
Per-axis distribution scaling factor for the Y (vertical) dimension. `spreadY` controls the vertical extent of the initial particle seeding region. When the `PLANET` law is active, the Y-axis orientation determines the ground plane normal, making vertical spread the primary control for atmospheric depth versus surface-layer density during initialization.

**ADVANCED:**
The Y-axis spread interacts with the `planetary` law in a distinct way from X/Z. When `pure.planetary` is `true`, the physics worker applies a constant +0.2 acceleration on the Y-axis every sub-step regardless of position. This means particles spawned at high Y (low `spreadY` placing them near the top of the world) will undergo a longer "fall" before settling, accumulating kinetic energy that is dissipated through drag (`globalViscosity`) and collision inelasticity (`ELASTICITY` DNA).

In non-planetary mode, vertical spread functions identically to horizontal spread — it defines the Y-range of the spawn distribution. The Grid distribution calculates Y spacing as `(H * spread) / side` where `H` is `dimY`, and Soup mode uses `py = (Math.random() - 0.5) * H * spread`. Bipolar mode places lobes at `±0.4 * H * spread` on opposite Y sides of the origin.

**EXPERT:**
Vertical spread is the dominant factor for simulations that rely on gravitational settling to organize layers. In planetary mode, a low vertical spread (particles starting near the ground plane) produces immediate floor accumulation with minimal kinetic impact — useful for studying slow surface reactions and crystal growth. A high vertical spread produces a "raining" initialization where particles arrive at the surface with velocity proportional to fall distance, creating impact craters and splash dynamics that can seed secondary nucleation sites.

When `shape` (the world shape parameter) is set to non-zero values, the effective vertical extent of the population is further modulated. The `shape` parameter biases spawn positions in all three axes, but its effect is most pronounced on Y in planetary mode because the ground plane provides an asymmetric boundary condition — particles below the ground (Y < -dimY/2) are subject to `SOLID` or `VOID` boundary logic depending on `boundaryType`.

In the Bipolar distribution, the Y-axis receives equal treatment to X: half the population spawns at positive Y, half at negative Y, each lobe occupying `±0.4 * H * spread`. This creates two vertically separated populations that must overcome gravity and distance to interact, producing a controlled "mixing experiment" that tests the `SPECIES_AFFINITY` and `SEX_CHANCE` DNA parameters under spatial isolation stress.

The vertical spawn bias is also the primary mechanism for studying "thermal stratification" analogues in non-planetary mode. By spawning a dense sheet at low Y and a sparse mist at high Y, the upper particles experience less drag and lower collision frequency, allowing them to evolve along a completely different trajectory from the densely-packed lower layer. This "two-layer" initial condition frequently produces speciation events within the first 500 steps, as the two populations diverge under different local density regimes.

---

## 3. spreadZ

**BASIC:**
Per-axis distribution scaling factor for the Z (depth) dimension. `spreadZ` controls the depth extent of the initial seeding pass. In the current 3D-aware engine, depth spread determines the volumetric thickness of the initial particle cloud and directly controls how "3D" the initial state appears to the spatial hash grid in the physics worker.

**ADVANCED:**
The Z-axis spread functions analogously to X and Y in all distribution modes except Galaxy, where depth spread is scaled by an additional factor of 0.1: `pz = (Math.random() - 0.5) * D * 0.1 * spread`. This tenfold compression in Galaxy mode forces the initial population into a thin disc, mimicking the flattened geometry of spiral galaxies. In all other modes, Z spread is a direct 1:1 multiplier on `dimZ`.

The `dimZ` default is 500 (matching dimX and dimY), producing a cubic world volume. When `spreadZ` is reduced, the initial population occupies a sub-volume that is a thin slice of the total depth. This is useful for approximating 2D dynamics within a 3D engine — particles interact primarily in the XY plane because Z-variation is limited, but the Z-axis still provides escape routes for orbital and phase-shifting behaviors.

**EXPERT:**
Depth spread is the least visually obvious but most structurally significant of the three spread parameters because it determines whether the simulation operates in an effective-2D or true-3D regime. When `spreadZ` is at maximum (1.0), particles occupy the full depth volume, and the spatial hash grid partitions along all three axes equally. The neighbor search cost scales with the cube of the interaction radius in 3D, so full-depth simulations with large `NEIGHBORHOOD_RADIUS` DNA values incur significantly higher per-particle computation costs than depth-compressed runs.

The Galaxy distribution's 0.1× depth compression is an intentional design choice that creates thin-disc initial conditions. In this mode, the population occupies `±5%` of the depth volume regardless of `dimZ`, ensuring that Galaxy starts always produce a flattened, disc-like geometry suitable for studying spiral arm formation and in-plane orbital dynamics. The particles' initial velocities in Galaxy mode are tangential (orbital), so the thin disc is kinetically supported against Z-axis collapse.

When per-axis spread values are fully wired (replacing `spreadRadius`), the Z-spread slider will enable a continuum of regimes: from true-3D isotropic (all spreads = 1.0) through pancake (Z << X/Y) and cigar (Z >> X/Y) to effectively-2D (Z near-zero). Each regime produces qualitatively different emergent dynamics because collision geometry, signal propagation, and cluster topology all depend on the spatial dimensionality of the particle distribution.

For lattice formation studies, Z-spread determines whether the resulting crystalline structures are 2D sheets, 3D close-packed lattices, or filament chains. The `BOND_ANGLE` DNA parameter produces different structural motifs depending on the dimensionality available: in thin-Z regimes, bond angle has only two degrees of freedom, constraining clusters to planar geometries; in full-Z regimes, the third degree of freedom enables true tetrahedral and octahedral coordination.

---

## 4. entropy

**BASIC:**
Global stochastic noise injection parameter. `entropy` controls the magnitude of random Brownian motion applied to every particle each physics tick. It acts as the system's "temperature floor" — a baseline level of randomness that prevents particles from settling into perfect static equilibrium. Stored in `worldConfig.entropy` with a default of 0.1 and UI range 0–1.

**ADVANCED:**
The `entropy` parameter is consumed in the physics worker as `const entropy = world.entropy || 0.1;` and feeds into two distinct mechanics:

1. **Jitter computation** — every sub-step, the acceleration vector receives a stochastic component: `const j = (entropy + (particles[ptr + DNA_OFFSETS.JITTER]||0)) * 0.5; ax += (Math.random()-0.5)*j;` (and similarly for ay, az). This produces a uniform-random acceleration kick in all three axes, scaled by the sum of global entropy and the particle's DNA `JITTER` value.

2. **Sublimation threshold** — when the `SUBL` (Sublimation) thermodynamic law is active, the condition for mass loss checks: `if (thermo.subl && (entropy + (particles[ptr + DNA_OFFSETS.JITTER]||0)) > 2.0)`. Entropy contributions above approximately 2.0 (accounting for DNA jitter) trigger spontaneous mass-to-energy conversion across all particles, creating a systemic phase change.

The UI exposes entropy as a linear slider (0–1, step 0.05). The "Randomize" preset assigns `this.worldConfig.entropy = Math.random() * 0.5`, keeping entropy in the 0–0.5 range for randomized starts.

**EXPERT:**
Entropy is the master noise floor of the VEPA simulation. Unlike the DNA-level `JITTER` parameter which is species-specific, `entropy` applies to all particles globally. This creates a baseline chaos level that every particle must contend with regardless of its evolved traits. A species with low `JITTER` DNA in a high-entropy world will still experience significant random acceleration, meaning there is no escape from the noise floor — evolution can optimize around it but cannot eliminate it.

The jitter computation is applied during the force accumulation phase of the physics loop, before velocity integration. This means the random kick is subject to the same `MAX_FORCE` clamp (50.0) and drag damping as all other forces. The effective magnitude of the jitter kick per sub-step is:

```
j_eff = (entropy + dna_jitter) * 0.5 * localDt
```

At default dt (1.0) with entropy=0.1 and no DNA jitter, the RMS random acceleration per particle per sub-step is approximately ±0.05 units. Over 60 sub-steps per second (at 60 FPS), this produces a random walk with RMS displacement of roughly ±0.05 × sqrt(60) ≈ ±0.39 units/second — enough to prevent perfect settling but small enough that gravity (G=1) still dominates.

The interaction between entropy and the `SUBL` law creates a bifurcation: if the summed entropy+JITTER exceeds 2.0, particles with high enough combined values begin spontaneously losing mass. This acts as an entropy cap — the system cannot sustain combined noise past the sublimation threshold without undergoing mass dissipation, which reduces the total population and thus the available noise sources.

In the context of thermodynamic law interactions, entropy amplifies the `MELT` law's effect (which adds jitter proportional to energy: `meltJitter = (energy/100) * 0.5`). High global entropy combined with high-energy particles creates a "thermal runaway" scenario where melt-induced jitter plus baseline entropy produces forces that further increase collision frequency, generating more energy, which in turn increases melt jitter. This is a positive feedback loop that can drive the simulation into a "plasma" state where coherent structures dissolve.

The SMART_CHAOS system (controlled via the `SMART_CHAOS` key) is a separate mechanism — it injects Gaussian-distributed randomness into a subset of active configuration parameters to break local minima during long runs. While both involve noise, entropy operates at the physics layer (particle acceleration) while SMART_CHAOS operates at the meta-configuration layer (parameter mutations).

From a stability engineering perspective, entropy values above 0.5 begin to noticeably degrade the signal-to-noise ratio of `GLOW` pulse communication. Particles under high entropy experience random displacements that can exceed their `NEIGHBORHOOD_RADIUS` between pulses, causing them to miss signals they would otherwise receive. This creates a natural "communication ceiling" — species that evolve in high-entropy environments must develop either high `SIGNAL_STRENGTH` (to overcome noise with amplitude) or high `PROPAGATION_SPEED` (to broadcast before the particle drifts out of range).

---

## 5. cameraMode

**BASIC:**
Viewport interaction mode selector. `cameraMode` determines how touch and pointer input is interpreted for camera navigation. Two modes are available: `'panning'` (default, translates the viewport in screen-space) and `'orbital'` (rotates the viewport around the world origin). Stored in `worldConfig.cameraMode` with a default of `'panning'`, selectable via a dropdown in the UI's BASIC world accordion panel.

**ADVANCED:**
The camera mode is consumed by the VepaEngine touch/pointer handler (`src/main.js`, the `_setupInteraction()` method) to resolve distinct control schemes:

- **Panning mode (default):** Single-finger drag translates the viewport in screen-space (pan X/Y). Two-finger pinch adjusts zoom, and two-finger drag with rotation (when not locked) rotates the camera orbitally around the Z-axis. This is the recommended mode for 2D exploratory observation — it provides fast, intuitive lateral movement at the cost of limited depth perception.

- **Orbital mode:** Single-finger drag applies rotational deltas to the camera's Euler angles (`this.rotation.y += dx * 0.005; this.rotation.x -= dy * 0.005`, clamped to ±π/2 on X). Two-finger pinch still controls zoom, but two-finger drag is remapped to panning. This mode is designed for volumetric inspection of 3D clusters — the camera rotates around the world center, allowing the observer to view structures from all angles to assess Z-axis extent.

The sensitivity of both pan and rotation is inversely scaled by the current zoom level (`sensitivity = 1.0 / this.zoom`) to maintain consistent hand-to-screen-space mapping regardless of magnification.

When `cameraLocked` is `true` with cameraMode set to `'panning'`, all rotation is zeroed out (`this.rotation.x = 0; this.rotation.y = 0`) ensuring a strictly orthographic front-facing view at all times. This "locked pan" combination is the standard configuration for recording time-lapse sequences where spatial consistency between frames is required.

**EXPERT:**
The camera system operates on three independent state variables stored in the VepaEngine instance: `this.zoom` (scalar, default 1.0), `this.pan` (object with x/y/z, all default 0), and `this.rotation` (object with x/y Euler angles in radians, default 0). These values feed into the PixiJS rendering pipeline at each frame via the `world.transform` matrix.

In `'orbital'` mode, the rotation angles are applied such that the viewport orbits around the coordinate origin `(0,0,0)`. This is achieved by translating the world container by `-pan`, rotating by the Euler angles, then applying the zoom scale. The result is an orbiting camera with the look-at point fixed at the world center — ideal for examining the symmetry and depth structure of clusters that have formed near origin due to gravitational collapse.

In `'panning'` mode, the rotation is applied at a reduced relative scale and only on the Y-axis (horizontal rotation), preserving the sense of a 2D map with slight perspective hint. This mode uses smaller rotation increments per pointer-delta than orbital mode, making it suitable for fine-grained positioning during HUD overlay inspection.

The relationship between `cameraMode` and `focalLength` is significant for depth perception. `focalLength` (default 3000) controls the perspective projection's vanishing point distance. In orbital mode, a short focal length (500–1000) exaggerates perspective distortion, making near particles appear larger and enhancing depth cues — useful for assessing cluster thickness. A long focal length (5000+) flattens perspective toward orthographic, which is preferred for precise spatial measurements and species tracking.

The camera mode has no effect on the physics simulation — it is purely an observation tool. However, it profoundly affects the operator's ability to detect emergent structures. The Insight Engine analysis is computed on the particle buffer directly, independent of viewport state, so switching camera modes mid-simulation does not disrupt data collection or pattern detection.

The mouse wheel (or equivalent scroll gesture) is always mapped to zoom in both modes, with the zoom factor compounding multiplicatively. Zoom values are not clamped at the engine level, but the renderer may exhibit floating-point precision artifacts below zoom < 0.01 or above zoom > 100 — the practical usable range is approximately 0.1 to 50.

---

## 6. cameraLocked

**BASIC:**
Viewport lock toggle. `cameraLocked` is a boolean flag stored in `worldConfig.cameraLocked` (default `false`) that, when enabled, suppresses all rotational camera movement and forces the viewport into a strictly orthographic panning mode. Single-finger drag continues to pan, two-finger gesture continues to zoom, but any rotation (either explicit via orbital mode or implicit via two-finger twist in panning mode) is clamped to zero.

**ADVANCED:**
When `cameraLocked` is true, the touch/pointer handler enforces two constraints:

1. **Single-finger rotation suppression:** In `'panning'` mode, `cameraLocked` forces the single-finger handler into pure translation, and explicitly zeros the rotation angles every frame: `this.rotation.x = 0; this.rotation.y = 0;`. In `'orbital'` mode, `cameraLocked` overrides the pointer dispatch — single-finger input is reassigned from rotation to panning, effectively demoting orbital mode to panning mode.

2. **Two-finger rotation suppression:** In `'panning'` mode, the two-finger handler condition is `if (mode === 'panning' && !this.worldConfig.cameraLocked) { /* rotate */ } else { /* pan */ }`. When locked, two-finger gestures always result in panning, never rotation.

The net effect is that `cameraLocked` transforms any camera mode into a "safe pan + zoom" mode where the view orientation remains fixed. This is the standard state for quantitative observation where consistent framing is required across simulation steps.

**EXPERT:**
At the implementation level, `cameraLocked` does not bypass or short-circuit the input event handler — events are still fully processed and coordinates are still tracked. Instead, it acts as a state guard that switches code paths within the existing handler. The performance benefit is negligible (a few boolean checks per frame), but the behavioral guarantee is critical: when locked, the viewport transformation matrix converges to a pure translation + scale, with no rotational component.

This purity of transformation is important for the PixiJS rendering pipeline's culling and sorting logic. When rotation is active, the `PIXI.Container`'s `getBounds()` method must compute an axis-aligned bounding box of the rotated container, which can be larger than the screen, potentially including off-screen particles in the draw call. When `cameraLocked` keeps rotation at zero, the bounding box is tight to the visible area, marginally improving culling efficiency — though the savings are only measurable at populations above 10,000 particles.

The `cameraLocked` flag is also serialized/deserialized via the `persistenceEngine.js` snapshot system. This means a saved simulation state remembers whether the view was locked, allowing replay sessions to restore the exact visual framing used during the original observation. This is essential for reproducible visual documentation — two different operators loading the same snapshot with different view states might draw different conclusions about the same particle configuration.

In practice, `cameraLocked` is typically set after the operator has positioned the viewport to their preferred framing. The workflow is: 1) run the simulation to the epoch of interest, 2) adjust pan/zoom/orbit to best reveal the emergent structure, 3) enable `cameraLocked`, 4) record or screenshare without fear of accidental viewport drift. This "set and lock" protocol is the recommended practice for all documentation-grade observation sessions.

The `cameraLocked` parameter does not affect the `history` timeline scrubbing or the `MINIMAP` overlay — those systems maintain their own independent viewport state. The minimap always renders a top-down (unrotated) view of the entire world extent, regardless of camera lock or mode, providing a consistent spatial reference even when the main viewport is rotated or zoomed.
