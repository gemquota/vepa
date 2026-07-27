import { describe, it, expect } from 'vitest';
import { createDNABuffer, getDNA, setDNA, getDNAFloat, setDNAFloat, loadDefaults } from '../../src/dna/dnaBuffer.js';
import { DNA_RANGES, DNA_INDEXES } from '../../src/constants.js';

describe('DNABuffer', () => {
    it('creates a Uint16Array of correct size', () => {
        const buf = createDNABuffer();
        expect(buf).toBeInstanceOf(Uint16Array);
        expect(buf.length).toBe(64 * 64);
    });

    it('set/get raw DNA values', () => {
        const buf = createDNABuffer();
        setDNA(buf, 0, 0, 12345);
        expect(getDNA(buf, 0, 0)).toBe(12345);
    });

    it('setDNAFloat/getDNAFloat round-trip', () => {
        const buf = createDNABuffer();
        const idx = DNA_INDEXES.FORCE;
        const range = DNA_RANGES[idx];
        setDNAFloat(buf, 0, idx, 1.5, range.min, range.max);
        const val = getDNAFloat(buf, 0, idx, range.min, range.max);
        expect(val).toBeCloseTo(1.5, 2);
    });

    it('clamp out-of-range values', () => {
        const buf = createDNABuffer();
        const idx = DNA_INDEXES.FORCE;
        const range = DNA_RANGES[idx];
        setDNAFloat(buf, 0, idx, 1000, range.min, range.max);
        const val = getDNAFloat(buf, 0, idx, range.min, range.max);
        expect(val).toBeLessThanOrEqual(range.max);
        setDNAFloat(buf, 0, idx, -1000, range.min, range.max);
        const val2 = getDNAFloat(buf, 0, idx, range.min, range.max);
        expect(val2).toBeGreaterThanOrEqual(range.min);
    });

    it('loadDefaults fills all species', () => {
        const buf = createDNABuffer();
        loadDefaults(buf, DNA_RANGES);
        // Check that species 0 has non-zero default values
        const force = getDNAFloat(buf, 0, DNA_INDEXES.FORCE, DNA_RANGES[0].min, DNA_RANGES[0].max);
        expect(force).not.toBe(0);
    });

    it('species isolation', () => {
        const buf = createDNABuffer();
        setDNA(buf, 0, 0, 100);
        setDNA(buf, 1, 0, 200);
        expect(getDNA(buf, 0, 0)).toBe(100);
        expect(getDNA(buf, 1, 0)).toBe(200);
    });
});
