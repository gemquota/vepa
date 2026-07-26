# Worker Synchronization Protocol

> **Files:** `src/main.js` ↔ `src/worker/physics.worker.js` | **Protocol:** Message-passing via `postMessage`

## Overview

VEPA uses a dedicated Web Worker (`physics.worker.js`) for all physics computation. The main thread (`main.js`) handles rendering (PixiJS) and UI. Communication uses a structured message-passing protocol with **SharedArrayBuffer** for zero-copy particle data transfer.

## Memory Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SharedArrayBuffer                     │
├─────────────────────────────────────────────────────────┤
│  Particle Buffer (Float32Array)                         │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬───  │
│  │ P0  │ P1  │ P2  │ P3  │ ... │ Pn  │     │     │     │
│  │ 86  │ 86  │ 86  │ 86  │     │ 86  │     │     │     │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴───  │
│  Each particle = 86 × Float32 = 344 bytes               │
├─────────────────────────────────────────────────────────┤
│  DNA Buffer (Uint16Array, via SharedArrayBuffer)         │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬───  │
│  │ Sp0  │ Sp1  │ Sp2  │ ...  │ Sp63 │      │      │     │
│  │ 64   │ 64   │ 64   │      │ 64   │      │      │     │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┴───  │
│  Each species = 64 × Uint16 = 128 bytes                 │
└─────────────────────────────────────────────────────────┘
```

### Particle Stride Layout (86 elements per particle)

| Offset | Field | Type | Description |
|--------|-------|------|-------------|
| 0-2 | POS_X/Y/Z | Float32 | Spatial coordinates |
| 3-5 | VEL_X/Y/Z | Float32 | Velocity components |
| 6 | MASS | Float32 | Physical mass |
| 7 | SPECIES_ID | Float32 | Species index (0-63) |
| 8-71 | DNA_CACHE | Float32×64 | Cached DNA for fast per-particle access |
| 72 | ENERGY | Float32 | Internal energy (0-100) |
| 73 | AGE | Float32 | Frame count since birth |
| 74 | DEAD | Float32 | 0=alive, 1=dead, 0.5=soul |
| 75-77 | COLOR_RGB | Float32×3 | Current rendering color |
| 78 | MEMORY | Float32 | Internal state persistence |
| 79 | SIGNAL | Float32 | Pulse intensity (glow) |
| 80 | RADIUS | Float32 | Visual extent |
| 81 | ALPHA | Float32 | Transparency |
| 82 | MITOSIS_TIMER | Float32 | Cell division countdown |
| 83 | PARTNER_ID | Float32 | Breeding partner index |
| 84-85 | RESERVED | Float32×2 | Future expansion |

## Message Protocol

### Main → Worker

| Type | Payload | When |
|------|---------|------|
| `init` | `{ particles, dnaBuffer?, config }` | On startup or species reset |
| `step` | `{ config, lowFlags, highFlags, version }` | Every simulation frame |

### Worker → Main

| Type | Payload | When |
|------|---------|------|
| `update` | `{ particles, version }` | Every frame after physics step |
| `hybrid_discovery` | `{ dna, rgb, parents }` | When interbreeding creates new species |

## Double-Buffering & Frame Sync

The main thread maintains two particle buffers:

```javascript
this.particles = new Float32Array(count * STRIDE);        // Front buffer (rendering)
this.previousParticles = new Float32Array(count * STRIDE); // Back buffer (interpolation)
```

**Frame flow:**
1. Main thread sends `step` message to worker with current config
2. Worker processes physics in background (non-blocking)
3. Worker posts `update` message back with modified particle buffer
4. Main thread snapshots current particles into `previousParticles`
5. Main thread replaces `particles` reference with worker's output
6. Interpolation between `previousParticles` and `particles` for smooth rendering

**Sync lock** (v3.2.1): A `workerBusy` flag prevents sending a new step before the previous one completes, preventing "temporal stutter."

## SharedArrayBuffer Security

`SharedArrayBuffer` requires specific HTTP headers to function in browsers:

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

When unavailable, the engine falls back to regular `ArrayBuffer` (with cloning overhead).

## DNA Buffer Access

The `dnaView` (Uint16Array over SharedArrayBuffer) maps DNA parameter ranges:

```javascript
// In main.js — writing species DNA to buffer
const offset = sIdx * (DNA_STRIDE * 2); // 128 Uint16 elements per species
for (let d = 0; d < 64; d++) {
    this.dnaView[offset + d] = this.denormalizeDNAValue(d, species[d] || 0);
}

// In worker — creating per-particle DNA cache on spawn
particles[ptr + DNA_CACHE_START + d] = spec.dna[d] || 0;
```

The DNA buffer uses Uint16 (packed range 0-65535), while the particle DNA cache uses Float32 for fast worker access and per-particle mutation.
