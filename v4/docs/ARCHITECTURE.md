# VEPA v4 — Architecture

This document is the living architecture record for VEPA v4, and the concrete
answer to the systems-theory audit (Parts 2/3/4/5/8/9). It fixes the ubiquitous
language, names the bounded contexts, states the layering rules, and records
what remains to be cleaned up.

The central thesis, now implemented:

> VEPA is no longer "a particle physics app". It is a **programmable
> artificial-world simulation and experimentation platform**. The fundamental
> operation is not "execute a request" but **"transform a World according to an
> active rule system"**.

---

## 1. Ubiquitous language

The domain model. Every term below is used consistently in code and docs.

| Term | Meaning | Lives in |
| --- | --- | --- |
| **World** | The aggregate root: parameters, law state, genomes, particle population, time, metadata. | `src/world/world.js` (`createWorld`) |
| **World Parameters** | The 25 WORLD-panel sliders (space/physics/environment/biology). | `src/state/worldParams.js` |
| **Law Set** | The active rule system — a 128-bit law bitmask. | `src/state/lawState.js` |
| **Law** | One composable rule (gravity, drag, reproduction, …) in a category (physics, biology, chemistry, thermodynamics, electromagnetism, information, metaphysics, quantum). | `src/physics/lawgroups/*.js` |
| **Simulation Context** | The portable solver tunables a tick may consult (force scale, drag, birth/death rates, star mass, world params). | `src/physics/simContext.js` |
| **Species** | A named genome lineage (roster of up to 64). | `src/spawn/population.js`, `src/dna/dnaBuffer.js` |
| **Genome / DNA** | 64 packed parameters per species (uint16 table). | `src/dna/dnaBuffer.js` |
| **Population** | The live agents (count + per-particle state). | `src/state/particleBuffer.js` |
| **Agent / Particle** | One fixed-stride record in the particle buffer: physical, biological, energetic, informational, reproductive, genetic-expression and interaction state. | `src/state/particleBuffer.js` |
| **Simulation Tick** | One state transition: grid → pairwise forces → integration → lifecycle. | `src/physics/solver.js` (`solve`) |
| **Lineage** | Birth/death ancestry graph. | `src/engines/lineageTracker.js` |
| **Timeline** | A circular buffer of snapshots for rewind/scrub. | `src/engines/timelineEngine.js` |
| **Observation** | Interpretation of the world: insight clusters, narrative, goals, metrics. | `src/engines/*.js` |
| **Shard** | One experimental world in the Chaos Multiplex grid (a World + variation knobs + fitness window). | `src/multiplex/shards.js` |
| **Fitness** | A weighted composite of 13 raw metrics over a shard. | `src/multiplex/metrics.js` |

---

## 2. Bounded contexts and layering

Four layers, each with a one-direction dependency rule. **Nothing imports
"up" a layer.** A layer may only depend on the layer(s) below it.

```
┌──────────────────────────────────────────────────────────────────┐
│  PRESENTATION   render/  ui/  debug.js                            │
│                 (canvas, panels, camera, sprite sync, overlays)   │
└──────────────────────────────┬───────────────────────────────────┘
                               │ reads state; emits bus commands
┌──────────────────────────────▼───────────────────────────────────┐
│  APPLICATION    main.js  engines/  (orchestration, interpretation)│
│                 owns the world handle; wires bus, controllers     │
└──────────────────────────────┬───────────────────────────────────┘
                               │ calls into the kernel
┌──────────────────────────────▼───────────────────────────────────┐
│  KERNEL         world/  physics/  state/  spawn/  dna/  core/     │
│                 (the 20-module headless core — no DOM, no worker) │
└──────────────────────────────┬───────────────────────────────────┘
                               │ pure functions over typed arrays
┌──────────────────────────────▼───────────────────────────────────┐
│  EXPERIMENTATION  multiplex/  worker/  bench/                     │
│                 (drives the kernel; not part of the kernel)       │
└──────────────────────────────────────────────────────────────────┘
```

### Layer contracts

- **Kernel (headless core)** — pure functions of their inputs. No DOM, no
  `self`/worker globals, no module-level mutable state, no `runtimeConfig`
  singleton. `solve()` takes a `simContext`; the World aggregate is a plain
  object. This is the portability guarantee: the same world runs identically
  on the main thread, in a Web Worker, in Node, or on a server.
- **Application** — owns *one* `world` handle (`main.js` builds it via
  `createWorld`); coordinates controllers (`createPopulationController`,
  `createIntelligenceController`, `createMultiplexController`); owns counters
  it passes in/out of the controllers. No physics math lives here.
- **Presentation** — reads state through the renderer sync and bus events
  (`physics:tick`, `sim:metrics`, `law:sync`, `species:sync`); never mutates
  the particle buffer directly.
- **Experimentation** — Chaos Multiplex (shards), the worker protocol, and the
  benchmark harness. These *use* the kernel, they are not *part of* it, so
  they may be swapped, extended, or run headless independently.

---

## 3. State transfer: one canonical boundary

The World aggregate owns the canonical state-transfer operations, and every
subsystem that moves state now goes through them:

| Operation | Where |
| --- | --- |
| `snapshotWorld` / `restoreWorld` (deep in-memory copy, live-region only) | `src/world/world.js` |
| `serializeWorld` / `deserializeWorld` (JSON-safe persistence) | `src/world/world.js` |
| `worldReport` (World → Observation summary) | `src/world/world.js` |
| Worker `GET_STATE` / `RESTORE` | delegates to `snapshotWorld` / `restoreWorld` |
| Multiplex `snapshotShard` / `restoreShard` | delegates to `snapshotWorld` / `restoreWorld` |
| Timeline scrub | live-region particle copy (`count × stride`), not full-capacity |

---

## 4. Coupling findings (P5 — what remains)

The audit's "domain bleed" is now mostly resolved; the honest remainder:

1. **`constants.js` gravity** — `LAW_INDEXES`, `LAW_CATEGORIES`, `LAW_HELP_DB`,
   `STRIDE_INDEXES`, `DNA_RANGES`, and world constants all live in one file.
   Candidates for extraction: stride layout → `state/`, law metadata → `physics/`,
   DNA ranges → `dna/`. Low-risk mechanical split; left as the next P5 step.
2. **`runtimeConfig` is still an app-layer singleton** — the *solver* no longer
   reads it (P0), but `main.js`/`simContextFromRuntimeConfig`/multiplex still
   read it as the live-tunable source. It should become a value owned by the
   application and passed in, mirroring the simContext pattern.
3. **`initUI(bus, lawState, dnaBuffer)`** — the presentation layer receives two
   domain objects directly. Acceptable short-term (read-only UI sync), but the
   cleaner contract is a `world` getter or a read-only `worldReport`.
4. **Worker adoption is opt-in** — main-thread physics remains the default;
   the worker path is proven deterministic (byte-identical) but not yet the
   default transport. This is a performance/feature decision, not a
   correctness gap.

---

## 5. Future domain & capability horizon (P7)

The platform trajectory, now that the core is layered:

- **Deterministic headless execution** — already present: a seeded PRNG
  (`core/prng.js` SplitMix32) + `simContext` + the worker protocol's
  deterministic seed yield byte-identical evolution across the main thread,
  the worker, and Node. `vepa4 bench` is the canonical headless entry point.
- **Evolutionary experimentation** — Chaos Multiplex is a general
  "evolve N worlds, rank by fitness, keep/follow/import" runner. Its shards
  are now World aggregates, so a shard is a first-class world that can be
  snapshotted, serialized, and replayed like any other.
- **Benchmarking as a first-class capability** — `bench/solver.bench.mjs`
  (`vepa4 bench`) measures throughput, per-law cost, and all-law stress in
  headless JSON. With shards as worlds, the next step is benchmark-of-shards:
  run a multiplex generation headless and report per-shard fitness + ms/tick.

---

## 6. Done / roadmap status

- **P0 — portable solver kernel**: `simContext`, `laws.js` pure barrel (71 laws
  into 7 category modules), worker protocol. ✅
- **P1 — application God objects**: population controller, intelligence
  controller, multiplex split into `shards`/`metrics`/`defaults`. ✅
- **P2 — World aggregate**: `src/world/world.js`, worker + main.js elevated. ✅
- **P3 — aggregate adoption**: shards own Worlds; `snapshotShard`/`restoreShard`
  and `shardFromSnapshot` on the aggregate. ✅
- **P4 — bounded-context layering**: this document + the dependency rules. ✅
- **P5 — ubiquitous language + coupling audit**: language table + §4 findings. ✅
- **P6 — scalability**: timeline snapshots are live-region now; remaining
  items are §4 (constants split, runtimeConfig, worker default). ✅/partial
- **P7 — future domain horizon**: §5. ✅/ongoing
