# The Chaos Multiplex & Parallel Realities

The Chaos Multiplex is a high-level experimentation UI that allows the Architect to run multiple parallel universes simultaneously to brute-force evolutionary outcomes.

## 1. Iframe Sandboxing
The Multiplex uses a grid of iframes, each running an independent instance of the `VepaEngine`. This ensures that a crash or a "Big Rip" in one universe does not affect the master simulation.

## 2. Brute-Force Evolution
Architects can use the Multiplex to:
1.  **Reroll:** Run 12 identical setups with different PRNG seeds.
2.  **Drift:** Apply a slight "DNA Drift" to each instance.
3.  **Select:** Identify the most "interesting" universe (using the Insight Engine) and import its state back into the master simulation.

## 3. Multiplex Protocol
The master UI communicates with sandboxed iframes via `postMessage`.
*   **Export:** Captures the current `worldConfig`, `laws`, and `dnaBuffer`.
*   **Import:** Splicing the state from a successful parallel reality into the active SharedArrayBuffer.

---
*Experimental Physics Spec v2.1*

---

## 4. Drawer expansion (v4.6.24)

The right-edge drawer is now tabbed **LIVE / FIT**.

### LIVE tab
- **POP SCALE** (0.25–1) — dynamic per-shard population cap (`computeShardPopulationCap`: inverse-square-root curve, floor 250); applies immediately (rebuilds the grid).
- **SEED** (0 = random, > 0 = deterministic) — a fixed seed reproduces the exact same shard lineage across runs.
- **SUBSTEPS** (1–8) — solver sub-steps per shard tick; a linear law's per-step effect is invariant to the substep count.
- **LAW / DNA / POP VAR** — per-aspect multipliers on the master VARIATION knob; 0 blocks that aspect entirely.
- **AFTER ITERATE** — `NONE | FITTEST | FOLLOW`:
  - FITTEST — select the shard with the highest weighted fitness (default weights = alive-only).
  - FOLLOW — select the shard whose metric profile is closest to the previous selection.
- **KEEP SELECTED** — anchors the selected shard through regeneration (full view/DNA/laws/PRNG snapshot restore).
- **IMPORT ON EXIT** — imports the selected shard into the main simulation when exiting the multiplex (default on).

### FIT tab
- 14 weighted metrics per shard: population, growth, longevity, stability, energy, reserves, armor, mobility, signal, bonds, diversity, exploration, novelty, delta.
- Metrics are min-max normalized across shards; each row has a 0–1 weight slider and a MAX/MIN mode toggle (MIN flips to 1−norm).
- DELTA = mean |score − mean(others)| over the base metrics — "how different is this world from the pack".
- Composite fitness = Σ wᵢ·scoreᵢ / Σ wᵢ (falls back to population when all weights are 0).
- Scrollable per-shard score readout (`S01 0.74`) — click a row to select that shard.
- Stats row shows `ALIVE · CAP · ΔSEL · ΔAVG` (selected-shard delta and the rolling mean delta across shards).

### Import protocol
`exit()` → if `importOnExit`, the selected shard is copied into the main world buffers
(particles + species DNA + law state via `copyShardToWorld`), then the main loop resets the
offspring ring and intelligence engines and re-syncs species/DNA/law panels.


## 5. GPU performance & metrics drawer (v4.6.25)

Multiplex rendering is tuned for GPU headroom so 16 parallel realities stay smooth.

- **Zero-copy views** — preview canvases consume the shard's `Float32Array` view
  (`asParticleView`) instead of a per-frame buffer copy.
- **DPR cap** — previews render at 1.25× device-pixel-ratio (`maxDpr`), the main sim at 2×.
- **ECO render mode** — skips the reference grid and the per-particle soft-glow halo;
  on by default for previews (`renderQuality: 'eco'`).
- **GPU ECO toggle** — LIVE tab switch (`#mpx-drawer-eco`) flips previews between
  eco and full rendering live.
- **Metrics drawer** — the collapsible bottom bar (`#mpx-metrics`) shows per-shard
  fitness chips (`S01 0.74`, click to select) and a `ALIVE · CAP · ΔSEL · ΔAVG · ITER · MS`
  stats line (MS = EMA-smoothed shard tick time), refreshed every 24 frames.
