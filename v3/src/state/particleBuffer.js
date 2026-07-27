import { STRIDE_INDEXES } from '../constants.js';

/**
 * Create a SharedArrayBuffer-backed particle storage.
 * @param {number} maxParticles - Maximum number of particles
 * @param {number} stride - Floats per particle (must match PARTICLE_STRIDE)
 * @returns {{ buffer: SharedArrayBuffer, view: Float32Array }}
 */
export function createParticleBuffer(maxParticles, stride) {
    const byteLength = maxParticles * stride * Float32Array.BYTES_PER_ELEMENT;
    const buffer = new SharedArrayBuffer(byteLength);
    const view = new Float32Array(buffer);
    return { buffer, view };
}

/**
 * Read all fields of a particle into a plain object.
 */
export function getParticle(buffer, index, stride) {
    const view = new Float32Array(buffer);
    const base = index * stride;
    const S = STRIDE_INDEXES;
    return {
        x: view[base + S.POS_X],
        y: view[base + S.POS_Y],
        z: view[base + S.POS_Z],
        vx: view[base + S.VEL_X],
        vy: view[base + S.VEL_Y],
        vz: view[base + S.VEL_Z],
        mass: view[base + S.MASS],
        speciesId: view[base + S.SPECIES_ID],
        energy: view[base + S.ENERGY],
        age: view[base + S.AGE],
        dead: view[base + S.DEAD],
        colorR: view[base + S.COLOR_R],
        colorG: view[base + S.COLOR_G],
        colorB: view[base + S.COLOR_B],
        radius: view[base + S.RADIUS],
        signal: view[base + S.SIGNAL],
        bondCount: view[base + S.BOND_COUNT],
        memory: view[base + S.MEMORY],
        hunger: view[base + S.HUNGER],
        armor: view[base + S.ARMOR],
    };
}

/**
 * Write particle data from a plain object (only defined fields are written).
 */
export function setParticle(buffer, index, stride, data) {
    const view = new Float32Array(buffer);
    const base = index * stride;
    const S = STRIDE_INDEXES;
    if (data.x !== undefined) view[base + S.POS_X] = data.x;
    if (data.y !== undefined) view[base + S.POS_Y] = data.y;
    if (data.z !== undefined) view[base + S.POS_Z] = data.z;
    if (data.vx !== undefined) view[base + S.VEL_X] = data.vx;
    if (data.vy !== undefined) view[base + S.VEL_Y] = data.vy;
    if (data.vz !== undefined) view[base + S.VEL_Z] = data.vz;
    if (data.mass !== undefined) view[base + S.MASS] = data.mass;
    if (data.speciesId !== undefined) view[base + S.SPECIES_ID] = data.speciesId;
    if (data.energy !== undefined) view[base + S.ENERGY] = data.energy;
    if (data.age !== undefined) view[base + S.AGE] = data.age;
    if (data.dead !== undefined) view[base + S.DEAD] = data.dead;
    if (data.colorR !== undefined) view[base + S.COLOR_R] = data.colorR;
    if (data.colorG !== undefined) view[base + S.COLOR_G] = data.colorG;
    if (data.colorB !== undefined) view[base + S.COLOR_B] = data.colorB;
    if (data.radius !== undefined) view[base + S.RADIUS] = data.radius;
    if (data.signal !== undefined) view[base + S.SIGNAL] = data.signal;
    if (data.bondCount !== undefined) view[base + S.BOND_COUNT] = data.bondCount;
    if (data.memory !== undefined) view[base + S.MEMORY] = data.memory;
    if (data.hunger !== undefined) view[base + S.HUNGER] = data.hunger;
    if (data.armor !== undefined) view[base + S.ARMOR] = data.armor;
}

// ── Fast position getters/setters ──

export function getX(buffer, index, stride) {
    return new Float32Array(buffer)[index * stride + STRIDE_INDEXES.POS_X];
}

export function getY(buffer, index, stride) {
    return new Float32Array(buffer)[index * stride + STRIDE_INDEXES.POS_Y];
}

export function getZ(buffer, index, stride) {
    return new Float32Array(buffer)[index * stride + STRIDE_INDEXES.POS_Z];
}

export function setX(buffer, index, stride, value) {
    new Float32Array(buffer)[index * stride + STRIDE_INDEXES.POS_X] = value;
}

export function setY(buffer, index, stride, value) {
    new Float32Array(buffer)[index * stride + STRIDE_INDEXES.POS_Y] = value;
}

export function setZ(buffer, index, stride, value) {
    new Float32Array(buffer)[index * stride + STRIDE_INDEXES.POS_Z] = value;
}

// ── Velocity ──

export function getVelocity(buffer, index, stride) {
    const view = new Float32Array(buffer);
    const base = index * stride;
    const S = STRIDE_INDEXES;
    return {
        vx: view[base + S.VEL_X],
        vy: view[base + S.VEL_Y],
        vz: view[base + S.VEL_Z],
    };
}

export function setVelocity(buffer, index, stride, vx, vy, vz) {
    const view = new Float32Array(buffer);
    const base = index * stride;
    const S = STRIDE_INDEXES;
    view[base + S.VEL_X] = vx;
    view[base + S.VEL_Y] = vy;
    view[base + S.VEL_Z] = vz;
}

// ── Mass ──

export function getMass(buffer, index, stride) {
    return new Float32Array(buffer)[index * stride + STRIDE_INDEXES.MASS];
}

export function setMass(buffer, index, stride, mass) {
    new Float32Array(buffer)[index * stride + STRIDE_INDEXES.MASS] = mass;
}

// ── Species ──

export function getSpeciesId(buffer, index, stride) {
    return new Float32Array(buffer)[index * stride + STRIDE_INDEXES.SPECIES_ID];
}

export function setSpeciesId(buffer, index, stride, id) {
    new Float32Array(buffer)[index * stride + STRIDE_INDEXES.SPECIES_ID] = id;
}

// ── Life state ──

export function isAlive(buffer, index, stride) {
    return new Float32Array(buffer)[index * stride + STRIDE_INDEXES.DEAD] < 0.5;
}

export function kill(buffer, index, stride) {
    new Float32Array(buffer)[index * stride + STRIDE_INDEXES.DEAD] = 1.0;
}

// ── Energy ──

export function getEnergy(buffer, index, stride) {
    return new Float32Array(buffer)[index * stride + STRIDE_INDEXES.ENERGY];
}

export function setEnergy(buffer, index, stride, energy) {
    new Float32Array(buffer)[index * stride + STRIDE_INDEXES.ENERGY] = energy;
}

// ── DNA Cache ──

/**
 * Read the DNA cache for a particle into a plain array.
 * @returns {number[]} DNA parameter values from DNA_CACHE_START..DNA_CACHE_END
 */
export function getDNA(buffer, index, stride) {
    const view = new Float32Array(buffer);
    const base = index * stride;
    const start = STRIDE_INDEXES.DNA_CACHE_START;
    const end = STRIDE_INDEXES.DNA_CACHE_END;
    const dna = new Array(end - start);
    for (let i = start; i < end; i++) {
        dna[i - start] = view[base + i];
    }
    return dna;
}

/**
 * Write DNA cache values from an array into a particle.
 * @param {number[]} dnaArray - Array of float values to write into the DNA cache slots
 */
export function setDNA(buffer, index, stride, dnaArray) {
    const view = new Float32Array(buffer);
    const base = index * stride;
    const start = STRIDE_INDEXES.DNA_CACHE_START;
    const end = STRIDE_INDEXES.DNA_CACHE_END;
    const len = Math.min(dnaArray.length, end - start);
    for (let i = 0; i < len; i++) {
        view[base + start + i] = dnaArray[i];
    }
}
