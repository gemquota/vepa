// ============================================================================
// VEPA v4 — Chaos Multiplex: configuration surface (P1 extraction)
// The full set of tunable multiplex settings, shared by the controller
// (multiplex.js) and the fitness report (metrics.js) without a cycle.
// ============================================================================

export const MULTIPLEX_DEFAULTS = {
  cols: 2,
  rows: 2,
  randomizeLaws: true,
  randomizeDNA: true,
  randomizePopulation: true,
  variation: 0.5,
  deriveMode: 'clone', // 'clone' | 'spawn'
  autoIterate: false,        // regenerate all shards every autoIterateInterval ticks
  autoIterateInterval: 400,  // ticks between auto-iterations
  autoSelectFittest: false,  // after each iteration, select the shard with the most life
  simSpeed: 1.0,             // timescale multiplier for the shard grid
  paused: false,             // freeze shard stepping (main sim keeps running)
  maxIterations: 0,          // 0 = unlimited; auto-iterate stops at this count
  variationDrift: 0,         // per-iteration variation increase (evolutionary pressure)
  populationScale: 1.0,      // scales the dynamic per-shard population cap (0.25–1)
  seed: 0,                   // 0 = random source seed; >0 = deterministic runs
  substeps: 1,               // solver sub-steps per shard tick (1–8)
  lawVariation: 1,           // per-aspect multipliers on the master VARIATION knob
  dnaVariation: 1,
  popVariation: 1,
  keepSelected: false,       // iterate leaves the selected shard untouched (anchor)
  selectAfterIterate: 'none', // 'none' | 'fittest' | 'follow'
  importOnExit: true,        // exit imports the selected shard into the main world
  renderQuality: 'eco',      // 'eco' | 'full' — previews skip halos/grid, DPR 1.25
  fitnessWeights: {
    population: 1,
    growth: 0,
    longevity: 0,
    stability: 0,
    energy: 0,
    reserves: 0,
    armor: 0,
    mobility: 0,
    signal: 0,
    bonds: 0,
    diversity: 0,
    exploration: 0,
    novelty: 0,
    delta: 0,
  },
  fitnessModes: {
    population: 'max',
    growth: 'max',
    longevity: 'max',
    stability: 'max',
    energy: 'max',
    reserves: 'max',
    armor: 'max',
    mobility: 'max',
    signal: 'max',
    bonds: 'max',
    diversity: 'max',
    exploration: 'max',
    novelty: 'max',
    delta: 'max',
  },
};
