// ============================================================================
// VEPA v3 — Physics Solver
// Processes one tick of the simulation: grid → pairwise forces → integration
// → lifecycle. All particle state lives in the Float32Array buffer.
// ============================================================================

import {
  PARTICLE_STRIDE,
  STRIDE_INDEXES,
  DNA_INDEXES,
  LAW_INDEXES,
  WORLD_SIZE,
} from '../constants.js';
import { isAlive } from '../state/particleBuffer.js';
import { isSet } from '../state/lawState.js';
import { createGrid, clear, insert, getNeighbors } from './spatialGrid.js';
import {
  applyGravity,
  applyCollision,
  applyAccretion,
  applyPlanetary,
  applyLifeCycle,
  applySignalDecay,
  applyAffinity,
  applyReproduction,
  applyChemistry,
  applyPolymer,
  applyHeatTransfer,
  applyConvection,
  applyTimeDilation,
  applyDimensionality,
  applyChaos,
  applyOrder,
  applyFate,
  applyWill,
  applySoul,
  applyMind,
} from './laws.js';
import { computeSynergy } from './synergy.js';

// ── Solver Constants ──

const MAX_FORCE = 50.0;
const MAX_INTERACTIONS = 500;
const MAX_VELOCITY = 10.0;
const G = 0.5;
const DEFAULT_DT = 1.0;

// Preallocated neighbor buffer (avoids GC during solve)
const NEIGHBOR_BUF_SIZE = 2000;
const _neighborBuf = new Array(NEIGHBOR_BUF_SIZE);

// ── Spatial Grid (module-scoped, reused across ticks) ──

let _grid = null;

function ensureGrid() {
  if (!_grid) _grid = createGrid();
  return _grid;
}

// ── Read DNA cache from particle stride ──

function readDNAFromCache(view, base, dnaOut) {
  const start = STRIDE_INDEXES.DNA_CACHE_START;
  for (let d = 0; d < 42; d++) {
    dnaOut[d] = view[base + start + d];
  }
}

// ── Main Solver Entry ──

/**
 * Run one full physics tick.
 *
 * @param {Float32Array} particleBuffer - Particle state buffer (writable directly)
 * @param {number} particleCount - Number of particles in the buffer
 * @param {number} stride - Floats per particle (PARTICLE_STRIDE)
 * @param {{ lowFlags: Uint32Array, highFlags: Uint32Array }} lawState - Active laws
 * @param {Uint16Array} dnaBuffer - Species DNA buffer [64 × 64] (unused — DNA read from stride cache)
 * @param {number} worldSize - World boundary size
 * @param {number} dt - Time step (default 1.0)
 * @param {Function} prng - PRNG function returning [0,1)
 */
export function solve(particleBuffer, particleCount, stride, lawState, dnaBuffer, worldSize, dt, prng) {
  const grid = ensureGrid();
  const view = particleBuffer; // Float32Array or SharedArrayBuffer view
  const S = STRIDE_INDEXES;
  const halfWorld = worldSize * 0.5;
  dt = dt || DEFAULT_DT;

  // Reusable DNA cache array (avoids allocation per particle)
  const dnaI = new Array(42);

  // ── Phase 1: Build spatial grid from alive particles ──

  clear(grid);

  for (let i = 0; i < particleCount; i++) {
    const base = i * stride;
    if (view[base + S.DEAD] >= 0.5) continue; // skip dead/soul
    if (view[base + S.MASS] <= 0) continue;

    const px = view[base + S.POS_X];
    const py = view[base + S.POS_Y];
    const pz = view[base + S.POS_Z];

    if (Number.isFinite(px) && Number.isFinite(py) && Number.isFinite(pz)) {
      insert(grid, i, px, py, pz, worldSize);
    }
  }

  // ── Phase 2: Compute time dilation per particle ──

  const localDt = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    localDt[i] = applyTimeDilation(
      lawState, view, i * stride,
      computeSynergy(lawState, LAW_INDEXES.TIME_DILATION)
    );
  }

  // ── Phase 3: Pairwise interactions + integration ──

  for (let i = 0; i < particleCount; i++) {
    const iBase = i * stride;

    // Skip dead particles
    if (view[iBase + S.DEAD] >= 0.5) continue;
    if (view[iBase + S.MASS] <= 0) continue;

    const localTimeStep = dt * localDt[i];
    if (localTimeStep <= 0) continue;

    // Read particle i DNA from stride cache (already decoded floats)
    readDNAFromCache(view, iBase, dnaI);

    // Current position and velocity
    let px = view[iBase + S.POS_X];
    let py = view[iBase + S.POS_Y];
    let pz = view[iBase + S.POS_Z];
    let vx = view[iBase + S.VEL_X];
    let vy = view[iBase + S.VEL_Y];
    let vz = view[iBase + S.VEL_Z];
    let mass = view[iBase + S.MASS];
    if (mass <= 0) mass = 0.001;

    // Accumulated force
    let ax = 0;
    let ay = 0;
    let az = 0;

    // ── Pairwise neighbor loop ──

    const nCount = getNeighbors(grid, px, py, pz, worldSize, _neighborBuf);
    const limit = Math.min(nCount, MAX_INTERACTIONS);

    for (let n = 0; n < limit; n++) {
      const j = _neighborBuf[n];
      if (j === i) continue;

      const jBase = j * stride;

      // Skip dead neighbors
      if (view[jBase + S.DEAD] >= 0.5) continue;
      if (view[jBase + S.MASS] <= 0) continue;

      // Toroidal distance
      let dx = view[jBase + S.POS_X] - px;
      let dy = view[jBase + S.POS_Y] - py;
      let dz = view[jBase + S.POS_Z] - pz;

      // Wrap distance to [-halfWorld, halfWorld]
      if (dx > halfWorld) dx -= worldSize;
      else if (dx < -halfWorld) dx += worldSize;
      if (dy > halfWorld) dy -= worldSize;
      else if (dy < -halfWorld) dy += worldSize;
      if (dz > halfWorld) dz -= worldSize;
      else if (dz < -halfWorld) dz += worldSize;

      const distSq = dx * dx + dy * dy + dz * dz;
      const dist = Math.sqrt(distSq);

      // ── Gravity ──

      const gravSynergy = computeSynergy(lawState, LAW_INDEXES.GRAV);
      const gravForce = applyGravity(lawState, view, iBase, jBase, dx, dy, dz, distSq, gravSynergy);
      if (gravForce) {
        ax += gravForce.fx;
        ay += gravForce.fy;
        az += gravForce.fz;
      }

      // ── Collision + Accretion ──

      if (isSet(lawState, LAW_INDEXES.COLL)) {
        const radiusI = view[iBase + S.RADIUS];
        const radiusJ = view[jBase + S.RADIUS];
        const overlap = (radiusI + radiusJ) - dist;

        const collision = applyCollision(view, iBase, jBase, dx, dy, dz, dist, overlap);
        if (collision) {
          ax += collision.fx;
          ay += collision.fy;
          az += collision.fz;

          // Accretion
          if (isSet(lawState, LAW_INDEXES.ACCR)) {
            const accretionSynergy = computeSynergy(lawState, LAW_INDEXES.ACCR);
            const massGain = applyAccretion(lawState, view, iBase, jBase, dist, dnaI, accretionSynergy);
            if (massGain > 0) {
              mass += massGain;
              view[iBase + S.MASS] = mass;
            }
          }
        }
      }

      // ── Affinity ──

      const affinitySynergy = computeSynergy(lawState, LAW_INDEXES.AFFINITY);
      const affinityForce = applyAffinity(lawState, view, iBase, jBase, dx, dy, dz, distSq, affinitySynergy);
      if (affinityForce) {
        ax += affinityForce.fx;
        ay += affinityForce.fy;
        az += affinityForce.fz;
      }

      // ── Chemistry modifier ──

      const chemSynergy = computeSynergy(lawState, LAW_INDEXES.CATALYSIS_LAW);
      const chemMult = applyChemistry(lawState, view, iBase, jBase, distSq, chemSynergy);
      if (chemMult !== 1.0) {
        ax *= chemMult;
        ay *= chemMult;
        az *= chemMult;
      }

      // ── Polymer ──

      if (isSet(lawState, LAW_INDEXES.POLYMER)) {
        const polySynergy = computeSynergy(lawState, LAW_INDEXES.POLYMER);
        applyPolymer(lawState, view, iBase, jBase, dist, polySynergy);
      }

      // ── Heat Transfer ──

      if (isSet(lawState, LAW_INDEXES.HEAT) || isSet(lawState, LAW_INDEXES.COLD)) {
        const heatSynergy = computeSynergy(lawState, LAW_INDEXES.HEAT);
        applyHeatTransfer(lawState, view, iBase, jBase, dist, localTimeStep, heatSynergy);
      }

      // ── Order ──

      const orderSynergy = computeSynergy(lawState, LAW_INDEXES.ORDER);
      const orderForce = applyOrder(lawState, view, iBase, jBase, distSq, orderSynergy);
      if (orderForce) {
        ax += orderForce.fx;
        ay += orderForce.fy;
        az += orderForce.fz;
      }

      // ── Fate ──

      const fateSynergy = computeSynergy(lawState, LAW_INDEXES.FATE);
      const fateForce = applyFate(lawState, view, iBase, jBase, dx, dy, dz, distSq, fateSynergy);
      if (fateForce) {
        ax += fateForce.fx;
        ay += fateForce.fy;
        az += fateForce.fz;
      }

      // ── Soul ──

      if (isSet(lawState, LAW_INDEXES.SOUL_LAW)) {
        const soulSynergy = computeSynergy(lawState, LAW_INDEXES.SOUL_LAW);
        applySoul(lawState, view, iBase, jBase, distSq, soulSynergy);
      }

      // ── Mind ──

      if (isSet(lawState, LAW_INDEXES.MIND)) {
        const mindSynergy = computeSynergy(lawState, LAW_INDEXES.MIND);
        const mindEffect = applyMind(lawState, view, iBase, jBase, distSq, mindSynergy);
        if (mindEffect && mindEffect.signalBoost) {
          view[iBase + S.SIGNAL] += mindEffect.signalBoost;
        }
      }
    }

    // ── Non-pairwise laws ──

    // Planetary gravity
    const planetSynergy = computeSynergy(lawState, LAW_INDEXES.PLANETARY);
    const planetForce = applyPlanetary(lawState, view, iBase, px, py, pz, worldSize, planetSynergy);
    if (planetForce) {
      ax += planetForce.fx;
      ay += planetForce.fy;
      az += planetForce.fz;
    }

    // Dimensionality
    applyDimensionality(lawState, view, iBase, prng, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.DIMENSIONALITY));

    // Chaos
    applyChaos(lawState, view, iBase, prng, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.CHAOS));

    // ── Drag ──

    if (isSet(lawState, LAW_INDEXES.DRAG)) {
      const viscosity = dnaI[DNA_INDEXES.VISCOSITY] || 0.98;
      const dragFactor = Math.pow(viscosity, localTimeStep);
      ax -= vx * (1 - dragFactor) * 10;
      ay -= vy * (1 - dragFactor) * 10;
      az -= vz * (1 - dragFactor) * 10;
    }

    // Friction
    const friction = dnaI[DNA_INDEXES.FRICTION] || 0.01;
    ax -= vx * friction;
    ay -= vy * friction;
    az -= vz * friction;

    // Entropy (jitter)
    if (isSet(lawState, LAW_INDEXES.ENTR)) {
      const jitter = dnaI[DNA_INDEXES.JITTER] || 0.05;
      const jitterMult = computeSynergy(lawState, LAW_INDEXES.ENTR);
      ax += (prng() - 0.5) * jitter * jitterMult * localTimeStep;
      ay += (prng() - 0.5) * jitter * jitterMult * localTimeStep;
      az += (prng() - 0.5) * jitter * jitterMult * 0.3 * localTimeStep;
    }

    // ── Force clamping ──

    const forceMag = Math.sqrt(ax * ax + ay * ay + az * az);
    if (forceMag > MAX_FORCE) {
      const scale = MAX_FORCE / forceMag;
      ax *= scale;
      ay *= scale;
      az *= scale;
    }

    // ── Integration: velocity (apply forces) ──

    const inertia = dnaI[DNA_INDEXES.INERTIA] || 1.0;
    const invMass = 1.0 / mass;
    vx += (ax * localTimeStep * invMass) / inertia;
    vy += (ay * localTimeStep * invMass) / inertia;
    vz += (az * localTimeStep * invMass) / inertia;

    // Will — self-propulsion (applies boost along current velocity)
    applyWill(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.WILL));

    // Re-read velocity (Will may have modified it in-place)
    vx = view[iBase + S.VEL_X] + (vx - view[iBase + S.VEL_X]);
    vy = view[iBase + S.VEL_Y] + (vy - view[iBase + S.VEL_Y]);
    vz = view[iBase + S.VEL_Z] + (vz - view[iBase + S.VEL_Z]);

    // ── Velocity clamping ──

    const dnaMaxVel = dnaI[DNA_INDEXES.MAX_VELOCITY] || MAX_VELOCITY;
    const velLimit = Math.min(dnaMaxVel, MAX_VELOCITY);
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    if (speed > velLimit) {
      const vScale = velLimit / speed;
      vx *= vScale;
      vy *= vScale;
      vz *= vScale;
    }

    // ── Integration: position ──

    px += vx * localTimeStep;
    py += vy * localTimeStep;
    pz += vz * localTimeStep;

    // ── Toroidal wrapping ──

    if (isSet(lawState, LAW_INDEXES.WRAP)) {
      px = ((px % worldSize) + worldSize) % worldSize;
      py = ((py % worldSize) + worldSize) % worldSize;
      pz = ((pz % worldSize) + worldSize) % worldSize;
    } else {
      // Clamp to world bounds (soft wall)
      if (px < 0) { px = 0; vx = Math.abs(vx) * 0.5; }
      else if (px >= worldSize) { px = worldSize - 0.01; vx = -Math.abs(vx) * 0.5; }
      if (py < 0) { py = 0; vy = Math.abs(vy) * 0.5; }
      else if (py >= worldSize) { py = worldSize - 0.01; vy = -Math.abs(vy) * 0.5; }
      if (pz < 0) { pz = 0; vz = Math.abs(vz) * 0.5; }
      else if (pz >= worldSize) { pz = worldSize - 0.01; vz = -Math.abs(vz) * 0.5; }
    }

    // ── NaN guard ──

    if (
      !Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(pz) ||
      !Number.isFinite(vx) || !Number.isFinite(vy) || !Number.isFinite(vz) ||
      !Number.isFinite(mass)
    ) {
      px = worldSize * 0.5 + (prng() - 0.5) * 10;
      py = worldSize * 0.5 + (prng() - 0.5) * 10;
      pz = worldSize * 0.5 + (prng() - 0.5) * 10;
      vx = 0;
      vy = 0;
      vz = 0;
      mass = 1.0;
    }

    // ── Write back to buffer ──

    view[iBase + S.POS_X] = px;
    view[iBase + S.POS_Y] = py;
    view[iBase + S.POS_Z] = pz;
    view[iBase + S.VEL_X] = vx;
    view[iBase + S.VEL_Y] = vy;
    view[iBase + S.VEL_Z] = vz;
    view[iBase + S.MASS] = mass;

    // ── Signal decay ──

    applySignalDecay(lawState, view, iBase, dnaI, localTimeStep);

    // ── Life cycle ──

    applyLifeCycle(lawState, view, iBase, dnaI, localTimeStep, prng,
      computeSynergy(lawState, LAW_INDEXES.LIFE));

    // ── Convection ──

    applyConvection(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.CONVECTION));

    // ── Reproduction ──

    const offspring = applyReproduction(lawState, view, iBase, dnaI, prng,
      computeSynergy(lawState, LAW_INDEXES.REPRO));
    if (offspring) {
      _offspringRing[_ringWrite] = offspring;
      _ringWrite = (_ringWrite + 1) % OFFSPRING_RING_SIZE;
    }

    // ── Update radius from mass ──

    const baseRadius = dnaI[DNA_INDEXES.BASE_RADIUS] || 2.0;
    view[iBase + S.RADIUS] = baseRadius * Math.pow(mass, 0.333) * 0.5;
  }
}

// ── Offspring Ring Buffer ──

const OFFSPRING_RING_SIZE = 256;
const _offspringRing = new Array(OFFSPRING_RING_SIZE);
let _ringWrite = 0;
let _ringRead = 0;

/**
 * Drain any offspring produced during the last solve tick.
 * @returns {object[]} Array of offspring data objects
 */
export function drainOffspring() {
  const result = [];
  while (_ringRead !== _ringWrite) {
    const offspring = _offspringRing[_ringRead];
    if (offspring) result.push(offspring);
    _offspringRing[_ringRead] = null;
    _ringRead = (_ringRead + 1) % OFFSPRING_RING_SIZE;
  }
  return result;
}

/**
 * Reset the offspring ring (call on init/restart).
 */
export function resetOffspringRing() {
  _ringWrite = 0;
  _ringRead = 0;
  for (let i = 0; i < OFFSPRING_RING_SIZE; i++) {
    _offspringRing[i] = null;
  }
}

/**
 * Read DNA parameters for a species from the DNA buffer.
 * Returns an array of 42 float values.
 *
 * @param {Uint16Array} dnaBuffer - Species DNA buffer [64 × 64]
 * @param {number} speciesId - Species index (0-63)
 * @returns {number[]}
 */
export function readSpeciesDNA(dnaBuffer, speciesId) {
  const base = speciesId * 64;
  const dna = new Array(42);
  for (let d = 0; d < 42; d++) {
    dna[d] = dnaBuffer[base + d] || 0;
  }
  return dna;
}
