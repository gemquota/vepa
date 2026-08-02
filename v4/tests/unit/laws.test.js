import { describe, it, expect } from 'vitest';
import { createLawState, toggle, set, clear, isSet, getActiveCount, getStateVector, serialize, deserialize } from '../../src/state/lawState.js';

describe('LawState', () => {
    it('starts with all laws off', () => {
        const state = createLawState();
        expect(getActiveCount(state)).toBe(0);
    });

    it('set and isSet work for low-range laws (0-31)', () => {
        const state = createLawState();
        set(state, 0);
        expect(isSet(state, 0)).toBe(true);
        set(state, 15);
        expect(isSet(state, 15)).toBe(true);
        expect(getActiveCount(state)).toBe(2);
    });

    it('set and isSet work for high-range laws (32-63)', () => {
        const state = createLawState();
        set(state, 35);
        expect(isSet(state, 35)).toBe(true);
        set(state, 63);
        expect(isSet(state, 63)).toBe(true);
        expect(getActiveCount(state)).toBe(2);
    });

    it('toggle flips state', () => {
        const state = createLawState();
        toggle(state, 5);
        expect(isSet(state, 5)).toBe(true);
        toggle(state, 5);
        expect(isSet(state, 5)).toBe(false);
    });

    it('clear removes a law', () => {
        const state = createLawState();
        set(state, 10);
        expect(isSet(state, 10)).toBe(true);
        clear(state, 10);
        expect(isSet(state, 10)).toBe(false);
    });

    it('getStateVector returns correct boolean array', () => {
        const state = createLawState();
        set(state, 0);
        set(state, 35);
        const vec = getStateVector(state);
        expect(vec).toHaveLength(64);
        expect(vec[0]).toBe(true);
        expect(vec[35]).toBe(true);
        expect(vec[1]).toBe(false);
    });

    it('serialize/deserialize round-trip', () => {
        const state = createLawState();
        set(state, 0);
        set(state, 35);
        set(state, 63);
        const data = serialize(state);
        const restored = deserialize(data);
        expect(isSet(restored, 0)).toBe(true);
        expect(isSet(restored, 35)).toBe(true);
        expect(isSet(restored, 63)).toBe(true);
        expect(isSet(restored, 1)).toBe(false);
    });
});
