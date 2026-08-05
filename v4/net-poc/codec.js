// ============================================================================
// VEPA Multiplayer — Binary snapshot codec (reference implementation)
// Implements docs/multiplayer/PROTOCOL.md §4–§5. Zero dependencies.
// Runs in Node and in the browser (ESM). All multi-byte fields are
// little-endian (DataView littleEndian=true).
// ============================================================================

export const PROTOCOL_VERSION = 1;
export const MAGIC = 0x41504556; // 'VEPA' as little-endian u32 (wire bytes 0x56 0x45 0x50 0x41)
export const SNAP_FULL = 0x01;
export const SNAP_DELTA = 0x02;
export const SNAP_ACK = 0x03;

// v4 stride indexes we touch (v4/src/constants.js STRIDE_INDEXES)
export const IDX = {
  POS_X: 0,
  POS_Y: 1,
  VEL_X: 3,
  VEL_Y: 4,
  SPECIES_ID: 7,
  ENERGY: 50,
  DEAD: 52,
  COLOR_R: 53,
  COLOR_G: 54,
  COLOR_B: 55,
  RADIUS: 56,
};

export const MAX_VEL = 50;
export const MAX_RADIUS = 50;
export const MAX_ENERGY = 200;

const LE = true;

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

// ---- Quantization ----------------------------------------------------------

export function quantizePos(v, W) {
  return clamp(Math.round(((v + W / 2) / W) * 65535), 0, 65535);
}
export function dequantizePos(q, W) {
  return (q / 65535) * W - W / 2;
}
export function quantizeVel(v) {
  return clamp(Math.round((v / MAX_VEL) * 32767), -32768, 32767);
}
export function dequantizeVel(q) {
  return (q / 32767) * MAX_VEL;
}
export function quantizeU8(v, scale) {
  return clamp(Math.round((v / scale) * 255), 0, 255);
}
export function dequantizeU8(q, scale) {
  return (q / 255) * scale;
}

// ---- Helpers ---------------------------------------------------------------

/** Scan a stride-N Float32Array for alive particle indices. */
export function collectAliveIds(view, count, stride) {
  const ids = [];
  for (let i = 0; i < count; i++) {
    if (view[i * stride + IDX.DEAD] < 0.5) ids.push(i);
  }
  return ids;
}

// ---- Encode ----------------------------------------------------------------

/**
 * Encode a binary snapshot frame.
 * @param {object} s
 * @param {number} s.type       SNAP_FULL | SNAP_DELTA
 * @param {number} s.tick       host tick
 * @param {number} s.seq        host snapshot sequence
 * @param {number} s.hostTimeMs host performance.now()
 * @param {number} s.worldSize  world extent
 * @param {number} s.simVersion sim config version
 * @param {{low:number,high:number,ext:number,quad:number}} s.law
 * @param {Array<{key:number,value:number}>} s.params
 * @param {Uint16Array|null} s.dna   64×dnaCount packed DNA (FULL only)
 * @param {Float32Array} s.particles stride-N particle buffer
 * @param {number} s.stride
 * @param {number} s.particleCount
 * @param {number[]} [s.aliveIds]    alive ids (default: scan buffer)
 * @returns {ArrayBuffer}
 */
export function encodeSnapshot(s) {
  const stride = s.stride || 100;
  const aliveIds = s.aliveIds || collectAliveIds(s.particles, s.particleCount, stride);
  const dnaCount = s.type === SNAP_FULL && s.dna ? s.dna.length / 64 : 0;
  const paramBytes = 5 * (s.params ? s.params.length : 0);
  const records = aliveIds.length;
  const size = 51 + paramBytes + 2 + 128 * dnaCount + 17 * records;
  const buf = new ArrayBuffer(size);
  const dv = new DataView(buf);

  dv.setUint32(0, MAGIC, LE);
  dv.setUint8(4, PROTOCOL_VERSION);
  dv.setUint8(5, s.type);
  dv.setUint32(6, s.tick >>> 0, LE);
  dv.setUint32(10, s.seq >>> 0, LE);
  dv.setFloat64(14, s.hostTimeMs, LE);
  dv.setUint16(22, s.particleCount, LE);
  dv.setUint16(24, records, LE);
  dv.setUint16(26, stride, LE);
  dv.setFloat32(28, s.worldSize, LE);
  dv.setUint16(32, s.simVersion, LE);

  const law = s.law || { low: 0, high: 0, ext: 0, quad: 0 };
  dv.setUint32(34, law.low >>> 0, LE);
  dv.setUint32(38, law.high >>> 0, LE);
  dv.setUint32(42, law.ext >>> 0, LE);
  dv.setUint32(46, law.quad >>> 0, LE);

  let o = 50;
  const params = s.params || [];
  dv.setUint8(o++, params.length);
  for (const p of params) {
    dv.setUint8(o++, p.key & 0xff);
    dv.setFloat32(o, p.value, LE);
    o += 4;
  }
  dv.setUint16(o, dnaCount, LE);
  o += 2;
  if (dnaCount > 0) {
    for (let i = 0; i < dnaCount * 64; i++) {
      dv.setUint16(o, s.dna[i] & 0xffff, LE);
      o += 2;
    }
  }

  const view = s.particles;
  const W = s.worldSize;
  for (let r = 0; r < records; r++) {
    const i = aliveIds[r];
    const p = i * stride;
    dv.setUint16(o, i, LE); o += 2;
    dv.setUint16(o, quantizePos(view[p + IDX.POS_X], W), LE); o += 2;
    dv.setUint16(o, quantizePos(view[p + IDX.POS_Y], W), LE); o += 2;
    dv.setInt16(o, quantizeVel(view[p + IDX.VEL_X]), LE); o += 2;
    dv.setInt16(o, quantizeVel(view[p + IDX.VEL_Y]), LE); o += 2;
    dv.setUint8(o++, view[p + IDX.SPECIES_ID] & 0xff);
    dv.setUint8(o++, quantizeU8(view[p + IDX.COLOR_R], 1));
    dv.setUint8(o++, quantizeU8(view[p + IDX.COLOR_G], 1));
    dv.setUint8(o++, quantizeU8(view[p + IDX.COLOR_B], 1));
    dv.setUint8(o++, quantizeU8(view[p + IDX.RADIUS], MAX_RADIUS));
    dv.setUint8(o++, quantizeU8(clamp(view[p + IDX.ENERGY], 0, MAX_ENERGY), MAX_ENERGY));
    let flags = view[p + IDX.DEAD] >= 0.5 ? 1 : 0;
    if (view[p + IDX.BOND_COUNT] > 0) flags |= 2;
    dv.setUint8(o++, flags);
  }
  return buf;
}

// ---- Decode ----------------------------------------------------------------

/**
 * Decode a binary snapshot frame (mirror of encodeSnapshot).
 * @returns {object} { type, tick, seq, hostTimeMs, particleCount, aliveCount,
 *   stride, worldSize, simVersion, law, params, dna, records: Array<object> }
 */
export function decodeSnapshot(buf) {
  const dv = buf instanceof DataView ? buf : new DataView(buf);
  const magic = dv.getUint32(0, LE);
  if (magic !== MAGIC) throw new Error('bad magic: not a VEPA snapshot frame');

  const out = {
    version: dv.getUint8(4),
    type: dv.getUint8(5),
    tick: dv.getUint32(6, LE),
    seq: dv.getUint32(10, LE),
    hostTimeMs: dv.getFloat64(14, LE),
    particleCount: dv.getUint16(22, LE),
    aliveCount: dv.getUint16(24, LE),
    stride: dv.getUint16(26, LE),
    worldSize: dv.getFloat32(28, LE),
    simVersion: dv.getUint16(32, LE),
    law: {
      low: dv.getUint32(34, LE),
      high: dv.getUint32(38, LE),
      ext: dv.getUint32(42, LE),
      quad: dv.getUint32(46, LE),
    },
    params: [],
    dna: null,
    records: [],
  };

  let o = 50;
  const paramCount = dv.getUint8(o++);
  for (let i = 0; i < paramCount; i++) {
    const key = dv.getUint8(o++);
    const value = dv.getFloat32(o, LE);
    o += 4;
    out.params.push({ key, value });
  }
  const dnaCount = dv.getUint16(o, LE);
  o += 2;
  if (dnaCount > 0) {
    out.dna = new Uint16Array(dnaCount * 64);
    for (let i = 0; i < dnaCount * 64; i++) {
      out.dna[i] = dv.getUint16(o, LE);
      o += 2;
    }
  }

  const W = out.worldSize;
  for (let r = 0; r < out.aliveCount; r++) {
    const rec = {};
    rec.id = dv.getUint16(o, LE); o += 2;
    rec.x = dv.getUint16(o, LE); o += 2;
    rec.y = dv.getUint16(o, LE); o += 2;
    rec.vx = dv.getInt16(o, LE); o += 2;
    rec.vy = dv.getInt16(o, LE); o += 2;
    rec.species = dv.getUint8(o++);
    rec.r = dv.getUint8(o++);
    rec.g = dv.getUint8(o++);
    rec.b = dv.getUint8(o++);
    rec.radius = dv.getUint8(o++);
    rec.energy = dv.getUint8(o++);
    rec.flags = dv.getUint8(o++);
    rec.xf = dequantizePos(rec.x, W);
    rec.yf = dequantizePos(rec.y, W);
    rec.vxf = dequantizeVel(rec.vx);
    rec.vyf = dequantizeVel(rec.vy);
    rec.radiusF = dequantizeU8(rec.radius, MAX_RADIUS);
    rec.energyF = dequantizeU8(rec.energy, MAX_ENERGY);
    rec.dead = (rec.flags & 1) !== 0;
    out.records.push(rec);
  }
  return out;
}

// ---- Apply (guest side) ----------------------------------------------------

/**
 * Apply a decoded snapshot into a stride-N Float32Array particle buffer.
 * FULL snapshots first mark every slot dead, then write alive records.
 * @param {Float32Array} view destination buffer
 * @param {object} snap decoded snapshot
 * @param {number} [stride] defaults to snap.stride
 */
export function applySnapshot(view, snap, stride = snap.stride) {
  if (snap.type === SNAP_FULL) {
    const total = Math.min(snap.particleCount, view.length / stride);
    for (let i = 0; i < total; i++) view[i * stride + IDX.DEAD] = 1;
  }
  for (const rec of snap.records) {
    const p = rec.id * stride;
    view[p + IDX.POS_X] = rec.xf;
    view[p + IDX.POS_Y] = rec.yf;
    view[p + IDX.VEL_X] = rec.vxf;
    view[p + IDX.VEL_Y] = rec.vyf;
    view[p + IDX.SPECIES_ID] = rec.species;
    view[p + IDX.COLOR_R] = rec.r / 255;
    view[p + IDX.COLOR_G] = rec.g / 255;
    view[p + IDX.COLOR_B] = rec.b / 255;
    view[p + IDX.RADIUS] = rec.radiusF;
    view[p + IDX.ENERGY] = rec.energyF;
    view[p + IDX.DEAD] = rec.dead ? 1 : 0;
  }
}

/** Simple snapshot-frame size for bandwidth estimates (no buffer needed). */
export function snapshotByteSize(aliveCount, params = 23, dnaCount = 0) {
  return 51 + 5 * params + 2 + 128 * dnaCount + 17 * aliveCount;
}
