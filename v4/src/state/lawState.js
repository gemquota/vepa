/**
 * 96-law bitmask system using three Uint32Arrays.
 * Laws 0-31 → lowFlags, Laws 32-63 → highFlags, Laws 64-95 → extFlags.
 */

/**
 * Create a fresh law state with all laws off.
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array, extFlags: Uint32Array }}
 */
export function createLawState() {
    return {
        lowFlags: new Uint32Array(1),
        highFlags: new Uint32Array(1),
        extFlags: new Uint32Array(1),
    };
}

/**
 * Toggle a law on/off by index (0-63).
 */
export function toggle(state, lawIndex) {
    if (lawIndex < 32) {
        state.lowFlags[0] ^= (1 << lawIndex);
    } else if (lawIndex < 64) {
        state.highFlags[0] ^= (1 << (lawIndex - 32));
    } else {
        state.extFlags[0] ^= (1 << (lawIndex - 64));
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
    } else {
        state.extFlags[0] |= (1 << (lawIndex - 64));
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
    } else {
        state.extFlags[0] &= ~(1 << (lawIndex - 64));
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
    } else {
        return (state.extFlags[0] & (1 << (lawIndex - 64))) !== 0;
    }
}

/**
 * Count how many laws are currently active (popcount).
 * @returns {number}
 */
export function getActiveCount(state) {
    return popcount(state.lowFlags[0]) + popcount(state.highFlags[0]) + popcount(state.extFlags[0]);
}

/**
 * Return a 96-element boolean array representing all law states.
 * @returns {boolean[]}
 */
export function getStateVector(state) {
    const vector = new Array(96);
    for (let i = 0; i < 32; i++) {
        vector[i] = (state.lowFlags[0] & (1 << i)) !== 0;
    }
    for (let i = 0; i < 32; i++) {
        vector[32 + i] = (state.highFlags[0] & (1 << i)) !== 0;
    }
    for (let i = 0; i < 32; i++) {
        vector[64 + i] = (state.extFlags[0] & (1 << i)) !== 0;
    }
    return vector;
}

/**
 * Create a law state from a boolean array.
 * @param {boolean[]} vector - Array of at least 96 booleans
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array, extFlags: Uint32Array }}
 */
export function fromVector(vector) {
    const state = createLawState();
    for (let i = 0; i < 96 && i < vector.length; i++) {
        if (!vector[i]) continue;
        if (i < 32) state.lowFlags[0] |= (1 << i);
        else if (i < 64) state.highFlags[0] |= (1 << (i - 32));
        else state.extFlags[0] |= (1 << (i - 64));
    }
    return state;
}

/**
 * Serialize to a plain object for persistence (JSON-safe).
 * @returns {{ low: number, high: number }}
 */
export function serialize(state) {
    return {
        low: state.lowFlags[0],
        high: state.highFlags[0],
        ext: state.extFlags[0],
    };
}

/**
 * Restore law state from a serialized form.
 * @param {{ low: number, high: number }} data
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array }}
 */
export function deserialize(data) {
    const state = createLawState();
    state.lowFlags[0] = data.low || 0;
    state.highFlags[0] = data.high || 0;
    state.extFlags[0] = data.ext || 0;
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
