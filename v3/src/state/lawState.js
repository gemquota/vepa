/**
 * 64-law bitmask system using two Uint32Arrays.
 * Laws 0-31 → lowFlags, Laws 32-63 → highFlags.
 */

/**
 * Create a fresh law state with all laws off.
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array }}
 */
export function createLawState() {
    return {
        lowFlags: new Uint32Array(1),
        highFlags: new Uint32Array(1),
    };
}

/**
 * Toggle a law on/off by index (0-63).
 */
export function toggle(state, lawIndex) {
    if (lawIndex < 32) {
        state.lowFlags[0] ^= (1 << lawIndex);
    } else {
        state.highFlags[0] ^= (1 << (lawIndex - 32));
    }
}

/**
 * Turn a law on (no-op if already on).
 */
export function set(state, lawIndex) {
    if (lawIndex < 32) {
        state.lowFlags[0] |= (1 << lawIndex);
    } else {
        state.highFlags[0] |= (1 << (lawIndex - 32));
    }
}

/**
 * Turn a law off (no-op if already off).
 */
export function clear(state, lawIndex) {
    if (lawIndex < 32) {
        state.lowFlags[0] &= ~(1 << lawIndex);
    } else {
        state.highFlags[0] &= ~(1 << (lawIndex - 32));
    }
}

/**
 * Check if a law is active.
 * @returns {boolean}
 */
export function isSet(state, lawIndex) {
    if (lawIndex < 32) {
        return (state.lowFlags[0] & (1 << lawIndex)) !== 0;
    } else {
        return (state.highFlags[0] & (1 << (lawIndex - 32))) !== 0;
    }
}

/**
 * Count how many laws are currently active (popcount).
 * @returns {number}
 */
export function getActiveCount(state) {
    return popcount(state.lowFlags[0]) + popcount(state.highFlags[0]);
}

/**
 * Return a 64-element boolean array representing all law states.
 * @returns {boolean[]}
 */
export function getStateVector(state) {
    const vector = new Array(64);
    for (let i = 0; i < 32; i++) {
        vector[i] = (state.lowFlags[0] & (1 << i)) !== 0;
    }
    for (let i = 0; i < 32; i++) {
        vector[32 + i] = (state.highFlags[0] & (1 << i)) !== 0;
    }
    return vector;
}

/**
 * Create a law state from a 64-element boolean array.
 * @param {boolean[]} vector - Array of 64 booleans
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array }}
 */
export function fromVector(vector) {
    const state = createLawState();
    for (let i = 0; i < 32; i++) {
        if (vector[i]) state.lowFlags[0] |= (1 << i);
    }
    for (let i = 0; i < 32; i++) {
        if (vector[32 + i]) state.highFlags[0] |= (1 << i);
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
    };
}

/**
 * Restore law state from a serialized form.
 * @param {{ low: number, high: number }} data
 * @returns {{ lowFlags: Uint32Array, highFlags: Uint32Array }}
 */
export function deserialize(data) {
    return {
        lowFlags: new Uint32Array([data.low]),
        highFlags: new Uint32Array([data.high]),
    };
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
