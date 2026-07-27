// ============================================================================
// VEPA v3 — DNA → Phenotype Expression
// Derives visual phenotype (color, radius, alpha) from a particle's DNA cache
// and runtime state (energy, age, signal, dead).  Pure functions — no side
// effects, no allocations beyond the returned object.
// ============================================================================

import { STRIDE_INDEXES, DNA_INDEXES, DNA_RANGES } from '../constants.js';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Clamp `v` to [lo, hi]. */
function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
}

/** Linearly interpolate `a → b` by `t ∈ [0,1]`. */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/** Map `v` from [inLo, inHi] to [outLo, outLo + range]. */
function mapRange(v, inLo, inHi, outLo, outHi) {
    if (inHi === inLo) return (outLo + outHi) * 0.5;
    const t = clamp((v - inLo) / (inHi - inLo), 0, 1);
    return lerp(outLo, outHi, t);
}

/**
 * Convert HSL (h∈[0,360), s∈[0,1], l∈[0,1]) to {r,g,b} in [0,255].
 * Pure math, no external dependencies.
 */
function hslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = ((h % 360) + 360) % 360;
    const x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
    const m = l - c / 2;
    let r1, g1, b1;
    if (hp < 60)       { r1 = c; g1 = x; b1 = 0; }
    else if (hp < 120) { r1 = x; g1 = c; b1 = 0; }
    else if (hp < 180) { r1 = 0; g1 = c; b1 = x; }
    else if (hp < 240) { r1 = 0; g1 = x; b1 = c; }
    else if (hp < 300) { r1 = x; g1 = 0; b1 = c; }
    else                { r1 = c; g1 = 0; b1 = x; }
    return {
        r: Math.round((r1 + m) * 255),
        g: Math.round((g1 + m) * 255),
        b: Math.round((b1 + m) * 255),
    };
}

// ── DNA parameter readers ──────────────────────────────────────────────────

/**
 * Read a DNA parameter from the particle's DNA cache slot.
 * DNA cache lives at particle buffer offsets DNA_CACHE_START .. DNA_CACHE_END.
 *
 * @param {Float32Array} particleView - Typed array view of the particle buffer
 * @param {number} base       - Particle start index (i * stride)
 * @param {number} dnaIndex   - Logical DNA index (0-41), maps to DNA_INDEXES
 * @returns {number} Raw float value from the cache
 */
function readDNAParam(particleView, base, dnaIndex) {
    return particleView[base + STRIDE_INDEXES.DNA_CACHE_START + dnaIndex];
}

/**
 * Read the normalized DNA parameter (remapped to [0,1] via DNA_RANGES).
 */
function readDNANorm(particleView, base, dnaIndex) {
    const raw = readDNAParam(particleView, base, dnaIndex);
    const range = DNA_RANGES[dnaIndex];
    return clamp((raw - range.min) / (range.max - range.min), 0, 1);
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Compute the display color of a particle from its DNA and runtime state.
 *
 * Color model (HSL-based):
 *  - POLARITY (C1) → Hue:  negative = cool blue/cyan (180-270°),
 *                             neutral = green (120°),
 *                             positive = warm red/orange (0-60°)
 *  - ALPHA DNA (C2) → Saturation:  low alpha = desaturated, high = vivid
 *  - SYMMETRY DNA (C3) → Lightness: negative = darker, positive = brighter
 *
 * Runtime modifiers:
 *  - ENERGY boosts lightness (up to +15%)
 *  - AGE boosts saturation (up to +20% for mature particles)
 *
 * @param {Float32Array} particleBuffer - Raw particle SharedArrayBuffer view
 * @param {number} speciesId           - Species index (unused for now, reserved)
 * @param {number} particleIndex       - Particle index in the buffer
 * @param {number} stride              - Floats per particle
 * @returns {{ r: number, g: number, b: number }} RGB in [0, 255]
 */
export function computeColor(particleBuffer, speciesId, particleIndex, stride) {
    const view = new Float32Array(particleBuffer);
    const base = particleIndex * stride;

    // ── Read DNA parameters ──
    const polarity = readDNAParam(view, base, DNA_INDEXES.POLARITY);     // -1..1
    const alphaDNA = readDNAParam(view, base, DNA_INDEXES.ALPHA);        // 0..1
    const symmetry = readDNAParam(view, base, DNA_INDEXES.SYMMETRY);     // -1..1

    // ── Read runtime state ──
    const energy = view[base + STRIDE_INDEXES.ENERGY];   // 0..200
    const age    = view[base + STRIDE_INDEXES.AGE];       // frames

    // ── HSL derivation ──

    // Hue: map polarity [-1, 1] → [240, 120, 0] (cool → mid → warm)
    // We wrap around so negative polarity yields blue-cyan, positive yields red-orange
    let hue;
    if (polarity >= 0) {
        hue = mapRange(polarity, 0, 1, 120, 0);          // green → red
    } else {
        hue = mapRange(polarity, -1, 0, 240, 120);        // blue → green
    }

    // Saturation: ALPHA DNA param controls base saturation [0.25 .. 1.0]
    let sat = mapRange(alphaDNA, 0, 1, 0.25, 1.0);

    // Lightness: SYMMETRY DNA param controls base lightness [0.35 .. 0.65]
    let lit = mapRange(symmetry, -1, 1, 0.35, 0.65);

    // ── Runtime modifiers ──

    // Energy boost: higher energy → brighter (up to +0.15 lightness)
    // Energy range is typically 0..200, normalize around 100
    const energyFactor = clamp(energy / 200, 0, 1);
    lit += energyFactor * 0.15;

    // Age saturation boost: mature particles (age > 500 frames) → more vivid
    const ageFactor = clamp(age / 1000, 0, 1);
    sat += ageFactor * 0.2;

    // Clamp final values
    sat = clamp(sat, 0, 1);
    lit = clamp(lit, 0, 0.85);

    return hslToRgb(hue, sat, lit);
}

/**
 * Compute the visual radius of a particle from its DNA and mass.
 *
 * Formula:
 *  radius = BASE_RADIUS × (1 + mass × 0.1) × hiddenMassScale
 *
 * where hiddenMassScale = 1 + HIDDEN_MASS × 0.2
 * (HIDDEN_MASS ranges [-5, 5], so scale ∈ [0, 2])
 *
 * @returns {number} Visual radius in world units (≥ 0.3)
 */
export function computeRadius(particleBuffer, speciesId, particleIndex, stride) {
    const view = new Float32Array(particleBuffer);
    const base = particleIndex * stride;

    const baseRadius = readDNAParam(view, base, DNA_INDEXES.BASE_RADIUS);
    const hiddenMass = readDNAParam(view, base, DNA_INDEXES.HIDDEN_MASS);
    const mass       = view[base + STRIDE_INDEXES.MASS];

    // Mass scaling: each unit of mass adds 10% to radius
    const massScale = 1 + mass * 0.1;

    // Hidden mass multiplier: HIDDEN_MASS ∈ [-5, 5] → multiplier ∈ [0, 2]
    const hiddenScale = 1 + hiddenMass * 0.2;

    const radius = baseRadius * massScale * Math.max(hiddenScale, 0);

    // Floor at 0.3 so dead/zero-mass particles remain visible
    return Math.max(radius, 0.3);
}

/**
 * Compute the visual alpha (opacity) of a particle.
 *
 * Base alpha comes from the ALPHA DNA param (0..1).
 * Modifiers:
 *  - SIGNAL state: particles actively signaling get a glow boost (+0.3)
 *  - DEAD state:
 *      0   = alive (full alpha)
 *      0.5 = soul (semi-transparent, alpha × 0.4)
 *      1.0 = dead (nearly invisible, alpha × 0.1)
 *
 * @returns {number} Alpha ∈ [0, 1]
 */
export function computeAlpha(particleBuffer, speciesId, particleIndex, stride) {
    const view = new Float32Array(particleBuffer);
    const base = particleIndex * stride;

    const alphaDNA = readDNAParam(view, base, DNA_INDEXES.ALPHA);
    const signal   = view[base + STRIDE_INDEXES.SIGNAL];
    const dead     = view[base + STRIDE_INDEXES.DEAD];

    let alpha = alphaDNA;

    // Signal glow: boost alpha when the particle is emitting a pulse
    if (signal > 0.01) {
        alpha = Math.min(alpha + signal * 0.3, 1.0);
    }

    // Dead state modulation
    if (dead >= 0.99) {
        // Fully dead — ghost, barely visible
        alpha *= 0.1;
    } else if (dead >= 0.4) {
        // Soul state — semi-transparent spirit form
        alpha *= 0.4;
    }

    return clamp(alpha, 0, 1);
}

/**
 * Express the full visual phenotype for a single particle.
 *
 * Convenience wrapper that calls computeColor, computeRadius, and computeAlpha
 * and bundles the results into one object.
 *
 * @param {Float32Array} particleBuffer - SharedArrayBuffer particle storage
 * @param {number} speciesId            - Species index
 * @param {number} particleIndex        - Particle index
 * @param {number} stride               - Floats per particle
 * @returns {{ r: number, g: number, b: number, radius: number, alpha: number }}
 */
export function expressPhenotype(particleBuffer, speciesId, particleIndex, stride) {
    const color  = computeColor(particleBuffer, speciesId, particleIndex, stride);
    const radius = computeRadius(particleBuffer, speciesId, particleIndex, stride);
    const alpha  = computeAlpha(particleBuffer, speciesId, particleIndex, stride);
    return { ...color, radius, alpha };
}
