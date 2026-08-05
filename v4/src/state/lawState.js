/**
 * 128-law bitmask system using four Uint32Arrays.
 * Laws 0-31 → lowFlags, Laws 32-63 → highFlags, Laws 64-95 → extFlags,
 * Laws 96-127 → quadFlags.
 */

/**
 * Create a fresh law state with all laws off.
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array, extFlags: Uint32Array, quadFlags: Uint32Array }}
 */
export function createLawState() {
    return {
        lowFlags: new Uint32Array(1),
        highFlags: new Uint32Array(1),
        extFlags: new Uint32Array(1),
        quadFlags: new Uint32Array(1),
    };
}

/**
 * Toggle a law on/off by index (0-127).
 */
export function toggle(state, lawIndex) {
    if (lawIndex < 32) {
        state.lowFlags[0] ^= (1 << lawIndex);
    } else if (lawIndex < 64) {
        state.highFlags[0] ^= (1 << (lawIndex - 32));
    } else if (lawIndex < 96) {
        state.extFlags[0] ^= (1 << (lawIndex - 64));
    } else {
        state.quadFlags[0] ^= (1 << (lawIndex - 96));
    }
}

/**
 * Turn a law on (no-op if already on).
 */
export function set(state, lawIndex) {
    if (lawIndex < 32) {
        state.lowFlags[0] |= (1 << lawIndex);
    } else if (lawIndex < 64) {
        state.highFlags[0] |= (1 << (lawIndex - 32));
    } else if (lawIndex < 96) {
        state.extFlags[0] |= (1 << (lawIndex - 64));
    } else {
        state.quadFlags[0] |= (1 << (lawIndex - 96));
    }
}

/**
 * Turn a law off (no-op if already off).
 */
export function clear(state, lawIndex) {
    if (lawIndex < 32) {
        state.lowFlags[0] &= ~(1 << lawIndex);
    } else if (lawIndex < 64) {
        state.highFlags[0] &= ~(1 << (lawIndex - 32));
    } else if (lawIndex < 96) {
        state.extFlags[0] &= ~(1 << (lawIndex - 64));
    } else {
        state.quadFlags[0] &= ~(1 << (lawIndex - 96));
    }
}

/**
 * Check if a law is active.
 * @returns {boolean}
 */
export function isSet(state, lawIndex) {
    if (lawIndex < 32) {
        return (state.lowFlags[0] & (1 << lawIndex)) !== 0;
    } else if (lawIndex < 64) {
        return (state.highFlags[0] & (1 << (lawIndex - 32))) !== 0;
    } else if (lawIndex < 96) {
        return (state.extFlags[0] & (1 << (lawIndex - 64))) !== 0;
    } else {
        return (state.quadFlags[0] & (1 << (lawIndex - 96))) !== 0;
    }
}

/**
 * Count how many laws are currently active (popcount).
 * @returns {number}
 */
export function getActiveCount(state) {
    return popcount(state.lowFlags[0]) + popcount(state.highFlags[0]) + popcount(state.extFlags[0]) + popcount(state.quadFlags[0]);
}

/**
 * Return a 128-element boolean array representing all law states.
 * @returns {boolean[]}
 */
export function getStateVector(state) {
    const vector = new Array(128);
    for (let i = 0; i < 32; i++) {
        vector[i] = (state.lowFlags[0] & (1 << i)) !== 0;
    }
    for (let i = 0; i < 32; i++) {
        vector[32 + i] = (state.highFlags[0] & (1 << i)) !== 0;
    }
    for (let i = 0; i < 32; i++) {
        vector[64 + i] = (state.extFlags[0] & (1 << i)) !== 0;
    }
    for (let i = 0; i < 32; i++) {
        vector[96 + i] = (state.quadFlags[0] & (1 << i)) !== 0;
    }
    return vector;
}

/**
 * Create a law state from a boolean array.
 * @param {boolean[]} vector - Array of at least 128 booleans
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array, extFlags: Uint32Array, quadFlags: Uint32Array }}
 */
export function fromVector(vector) {
    const state = createLawState();
    for (let i = 0; i < 128 && i < vector.length; i++) {
        if (!vector[i]) continue;
        if (i < 32) state.lowFlags[0] |= (1 << i);
        else if (i < 64) state.highFlags[0] |= (1 << (i - 32));
        else if (i < 96) state.extFlags[0] |= (1 << (i - 64));
        else state.quadFlags[0] |= (1 << (i - 96));
    }
    return state;
}

/**
 * Serialize to a plain object for persistence (JSON-safe).
 * @returns {{ low: number, high: number, ext: number, quad: number }}
 */
export function serialize(state) {
    return {
        low: state.lowFlags[0],
        high: state.highFlags[0],
        ext: state.extFlags[0],
        quad: state.quadFlags[0],
    };
}

/**
 * Restore law state from a serialized form.
 * Accepts legacy { low, high, ext } objects — quad defaults to 0.
 * @param {{ low: number, high: number, ext?: number, quad?: number }} data
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array, extFlags: Uint32Array, quadFlags: Uint32Array }}
 */
export function deserialize(data) {
    const state = createLawState();
    state.lowFlags[0] = data.low || 0;
    state.highFlags[0] = data.high || 0;
    state.extFlags[0] = data.ext || 0;
    state.quadFlags[0] = data.quad || 0;
    return state;
}

// ── Internal helpers ──

function popcount(x) {
    x = x - ((x >>> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
    x = (x + (x >>> 4)) & 0x0F0F0F0F;
    x = x + (x >>> 8);
    x = x + (x >>> 16);
    return x & 0x3F;
}
