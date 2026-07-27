// ============================================================================
// VEPA v3 — Spatial Hash Grid
// 12x12x12 partitioning for O(N) neighbor lookups in the N-body simulation.
// ============================================================================

import { WORLD_SIZE } from '../constants.js';

export const GRID_DIM = 12;

/**
 * Create an empty spatial grid.
 * @returns {{ cells: number[][], counts: Int32Array, cellSize: number, dim: number }}
 */
export function createGrid() {
  const cellSize = WORLD_SIZE / GRID_DIM;
  const totalCells = GRID_DIM * GRID_DIM * GRID_DIM;
  const cells = new Array(totalCells);
  for (let i = 0; i < totalCells; i++) {
    cells[i] = [];
  }
  return {
    cells,
    counts: new Int32Array(totalCells),
    cellSize,
    dim: GRID_DIM,
  };
}

/**
 * Clear all cells back to empty.
 */
export function clear(grid) {
  for (let i = 0; i < grid.cells.length; i++) {
    grid.cells[i].length = 0;
    grid.counts[i] = 0;
  }
}

/**
 * Map a world coordinate to a cell index (toroidal).
 */
function toCell(coord, cellSize) {
  let c = Math.floor(coord / cellSize);
  c = ((c % GRID_DIM) + GRID_DIM) % GRID_DIM;
  return c;
}

/**
 * Compute flat cell index from 3D grid coordinates.
 */
function cellIndex(cx, cy, cz) {
  return cz * GRID_DIM * GRID_DIM + cy * GRID_DIM + cx;
}

/**
 * Insert a particle into the grid.
 * @param {object} grid - Grid returned by createGrid()
 * @param {number} index - Particle index in the buffer
 * @param {number} px - Particle X position
 * @param {number} py - Particle Y position
 * @param {number} pz - Particle Z position
 * @param {number} worldSize - World size for toroidal wrapping
 */
export function insert(grid, index, px, py, pz, worldSize) {
  const cx = toCell(px, grid.cellSize);
  const cy = toCell(py, grid.cellSize);
  const cz = toCell(pz, grid.cellSize);
  const ci = cellIndex(cx, cy, cz);
  const cell = grid.cells[ci];
  if (cell.length < 100) {
    cell.push(index);
    grid.counts[ci]++;
  }
}

/**
 * Get all neighbor indices from the 27-cell neighborhood.
 * Writes into preallocated output array for zero GC pressure.
 *
 * @param {object} grid
 * @param {number} px - Query particle X
 * @param {number} py - Query particle Y
 * @param {number} pz - Query particle Z
 * @param {number} worldSize
 * @param {number[]} out - Preallocated output array
 * @returns {number} number of neighbors written to out
 */
export function getNeighbors(grid, px, py, pz, worldSize, out) {
  const cx = toCell(px, grid.cellSize);
  const cy = toCell(py, grid.cellSize);
  const cz = toCell(pz, grid.cellSize);
  let count = 0;

  for (let dz = -1; dz <= 1; dz++) {
    const nz = ((cz + dz) % GRID_DIM + GRID_DIM) % GRID_DIM;
    for (let dy = -1; dy <= 1; dy++) {
      const ny = ((cy + dy) % GRID_DIM + GRID_DIM) % GRID_DIM;
      for (let dx = -1; dx <= 1; dx++) {
        const nx = ((cx + dx) % GRID_DIM + GRID_DIM) % GRID_DIM;
        const ci = cellIndex(nx, ny, nz);
        const cell = grid.cells[ci];
        for (let k = 0; k < cell.length; k++) {
          out[count++] = cell[k];
        }
      }
    }
  }
  return count;
}
