// ============================================================================
// VEPA v3 — Canvas2D Renderer
// GPU-free fallback renderer that draws particles directly to a 2D canvas.
// Designed as a drop-in until PixiJS 8.x is available; the API shape
// mirrors what a PixiJS backend would expose so spriteSync.js can target
// either path without branching in hot loops.
// ============================================================================

import { STRIDE_INDEXES } from '../constants.js';
import {
    computeColor,
    computeRadius,
    computeAlpha,
} from '../dna/expression.js';

// ── Constants ──────────────────────────────────────────────────────────────

const BG_COLOR     = '#0a0a0f';
const GRID_COLOR   = 'rgba(40, 50, 70, 0.25)';
const GRID_DIVISIONS = 8;   // grid lines per axis

// ── Canvas2D Renderer ──────────────────────────────────────────────────────

/**
 * Create a Canvas2D renderer bound to the given canvas element.
 *
 * @param {HTMLCanvasElement} canvas      - Target canvas
 * @param {number}           maxParticles - Upper bound on particle count (unused
 *                                          for Canvas2D, reserved for pool sizing)
 * @returns {object} Renderer state object
 *   { ctx, canvas, width, height, mode: 'canvas2d' }
 */
export function createRenderer(canvas, maxParticles) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas2D renderer: failed to acquire 2d context');
    }
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width  = Math.round(rect.width  * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);

    return {
        ctx,
        canvas,
        width:  rect.width,
        height: rect.height,
        dpr,
        mode: 'canvas2d',
        sprites: null,   // Canvas2D has no sprite pool
    };
}

/**
 * Handle canvas resize (call on window resize or layout change).
 *
 * @param {object} renderer - Renderer state from createRenderer
 */
export function resize(renderer) {
    const { ctx, canvas, dpr } = renderer;
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width  * dpr);
    const h = Math.round(rect.height * dpr);

    // Skip if dimensions haven't actually changed
    if (canvas.width === w && canvas.height === h) return;

    canvas.width  = w;
    canvas.height = h;
    renderer.width  = rect.width;
    renderer.height = rect.height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/**
 * Return the sprite container/pool (null for Canvas2D).
 */
export function getSprites(renderer) {
    return renderer.sprites;
}

/**
 * Tear down the renderer.
 */
export function destroy(renderer) {
    renderer.ctx = null;
    renderer.canvas = null;
}

// ── Frame Rendering ────────────────────────────────────────────────────────

/**
 * Draw a full frame of alive particles to the Canvas2D context.
 *
 * Steps:
 *  1. Clear to dark background
 *  2. Draw subtle reference grid
 *  3. For each alive particle, draw a filled circle
 *
 * @param {object}        renderer       - Renderer state
 * @param {SharedArrayBuffer|Float32Array} particleBuffer - Particle storage
 * @param {number}        particleCount  - Number of active particles
 * @param {number}        stride         - Floats per particle
 * @param {number}        worldSize      - World coordinate extent
 */
export function renderFrame(renderer, particleBuffer, particleCount, stride, worldSize) {
    const { ctx, width, height } = renderer;
    if (!ctx) return;

    const view = new Float32Array(particleBuffer);

    // ── 1. Clear ──
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // ── 2. Reference grid ──
    drawGrid(ctx, width, height);

    // ── 3. Particles ──
    const scaleX = width  / worldSize;
    const scaleY = height / worldSize;
    const halfWorld = worldSize * 0.5;
    // Perspective Z range: -halfWorld to +halfWorld, mapped to 0.5x to 2x scale
    const zScaleRange = 1.5;

    for (let i = 0; i < particleCount; i++) {
        const base = i * stride;

        // Skip dead particles (DEAD >= 1.0)
        if (view[base + STRIDE_INDEXES.DEAD] >= 0.99) continue;

        const x = view[base + STRIDE_INDEXES.POS_X];
        const y = view[base + STRIDE_INDEXES.POS_Y];
        const z = view[base + STRIDE_INDEXES.POS_Z] || 0;
        const speciesId = view[base + STRIDE_INDEXES.SPECIES_ID];

        // NaN guard — never draw broken coordinates
        if (x !== x || y !== y) continue;

        // Z perspective: closer Z → bigger, further Z → smaller
        const zNorm = z / halfWorld; // -1 to +1
        const zPerspective = 1.0 + zNorm * zScaleRange * 0.5; // 0.25 to 1.75
        const screenX = x * scaleX + (x - halfWorld) * zNorm * 0.05;
        const screenY = y * scaleY + (y - halfWorld) * zNorm * 0.05;

        // Phenotype expression
        const color  = computeColor(particleBuffer, speciesId, i, stride);
        const radius = computeRadius(particleBuffer, speciesId, i, stride);
        const alpha  = computeAlpha(particleBuffer, speciesId, i, stride);

        // Radius in screen pixels, scaled by Z perspective
        const screenR = radius * ((scaleX + scaleY) * 0.5) * zPerspective;

        // Skip fully transparent particles
        if (alpha < 0.001) continue;

        // Draw the particle
        ctx.globalAlpha = alpha * Math.min(1, zPerspective * 0.8 + 0.2);
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(screenR, 0.5), 0, Math.PI * 2);
        ctx.fill();
    }

    // Reset alpha for subsequent draws
    ctx.globalAlpha = 1.0;
}

// ── Internal Helpers ───────────────────────────────────────────────────────

/**
 * Draw a subtle reference grid across the canvas.
 */
function drawGrid(ctx, width, height) {
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 0.5;

    const stepX = width  / GRID_DIVISIONS;
    const stepY = height / GRID_DIVISIONS;

    ctx.beginPath();
    for (let i = 1; i < GRID_DIVISIONS; i++) {
        // Vertical lines
        const x = Math.round(i * stepX) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);

        // Horizontal lines
        const y = Math.round(i * stepY) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();
}
