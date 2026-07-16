# VEPA Spatial Grid System

> **File:** `src/worker/physics.worker.js` | **Status:** Complete

## Overview

The Spatial Grid is the primary broad-phase optimization for VEPA's O(N²) physics loop. Instead of checking every particle against every other particle (O(N²)), it partitions the simulation volume into a **12×12×12 grid** (1,728 cells) and only checks particles in the same or adjacent cells.

```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│     │     │     │     │     │     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │     │     │     │     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │     │     │     │     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │  P  │     │     │     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │     │     │     │     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │     │     │     │     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │     │     │     │     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │     │     │     │     │     │     │     │     │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
                    Particle P checks 26 neighboring cells
```

## Grid Configuration

| Constant | Value | Description |
|----------|-------|-------------|
| `GRID_SIZE` | 12 | Cells per dimension (12×12×12 = 1,728 total) |
| `MAX_CELL_CAPACITY` | 100 | Max particles per cell before overflow |
| `gridBuffer` | `Int32Array(1728×100)` | Flat array: cell_index * capacity + slot |
| `gridCounts` | `Int32Array(1728)` | Particle count per cell |

## Grid Construction (per sub-step)

```javascript
gridCounts.fill(0);
for (let i = 0; i < count; i++) {
    const ptr = i * STRIDE;
    if (dead) continue;
    
    // Map particle position to grid cell (normalized 0..11)
    const gx = Math.floor(((particles[ptr + POS_X] * invW) + 0.5) * (GRID_SIZE - 1));
    const gy = Math.floor(((particles[ptr + POS_Y] * invH) + 0.5) * (GRID_SIZE - 1));
    const gz = Math.floor(((particles[ptr + POS_Z] * invD) + 0.5) * (GRID_SIZE - 1));
    
    // Clamp to valid range
    const gIdx = clamp(gx) * GRID_SIZE * GRID_SIZE + 
                 clamp(gy) * GRID_SIZE + 
                 clamp(gz);
    
    // Insert into cell (if space available)
    if (gridCounts[gIdx] < MAX_CELL_CAPACITY) {
        gridBuffer[gIdx * MAX_CELL_CAPACITY + gridCounts[gIdx]] = i;
        gridCounts[gIdx]++;
    }
}
```

## Particle Interaction Loop

For each particle, the worker iterates over particles in the same cell and all 26 neighboring cells (3×3×3 neighborhood). This gives O(N × K) complexity where K is the average particles per cell, instead of O(N²).

```javascript
for (let gz = -1; gz <= 1; gz++) {
    for (let gy = -1; gy <= 1; gy++) {
        for (let gx = -1; gx <= 1; gx++) {
            const nIdx = ((gz + gz0 + GRID_SIZE) % GRID_SIZE) * GRID_SIZE * GRID_SIZE +
                         ((gy + gy0 + GRID_SIZE) % GRID_SIZE) * GRID_SIZE +
                         ((gx + gx0 + GRID_SIZE) % GRID_SIZE);
            const cCount = gridCounts[nIdx];
            const cellOffset = nIdx * MAX_CELL_CAPACITY;
            for (let k = 0; k < cCount; k++) {
                const j = gridBuffer[cellOffset + k];
                // Compute pairwise force...
            }
        }
    }
}
```

## Toroidal (Periodic) Wrapping

When `WRAP` law or `Periodic` boundary is active, distance calculations use minimum-image convention:

```javascript
if (dx > W/2) dx -= W;
else if (dx < -W/2) dx += W;
// Same for dy, dz
```

This ensures particles near one edge correctly interact with particles near the opposite edge, while the grid index mapping also wraps modulo `GRID_SIZE`.

## Performance Characteristics

| Particle Count | Naive O(N²) Ops | Grid O(N·K) Ops | Speedup |
|---------------|-----------------|------------------|---------|
| 500 | 250,000 | ~5,000 | 50× |
| 1,000 | 1,000,000 | ~20,000 | 50× |
| 5,000 | 25,000,000 | ~500,000 | 50× |

The grid achieves ~50× speedup over naive O(N²) for uniformly distributed particles. Dense clusters may cause some cells to overflow `MAX_CELL_CAPACITY` (100), at which point particles in that cell are skipped.

## Limitations

- No dynamic cell sizing — GRID_SIZE is fixed at 12 regardless of world dimensions
- Cell overflow causes silent particle exclusion from interactions
- No multi-resolution: all cells are the same size regardless of particle density
