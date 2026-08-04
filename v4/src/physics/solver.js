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
import { runtimeConfig } from '../state/runtimeConfig.js';
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
  applyVoid,
  applyBond,
  applyReduction,
  applyAlloy,
  applyTelepathy,
  applyClairvoyance,
  applyPrecognition,
  applyMelt,
  applyBoil,
  applyCondense,
  applyDeposit,
  applyExothermic,
  applyAstral,
  applyGlowEffect,
  applyEnergyTransfer,
  applyRadiationDamage,
  applyTrackingBehavior,
  applyPredation,
  applyGenotypeMutation,
  applyPhenotype,
  applySolvationEffect,
  applyAcidityEffect,
  applyOxidationEffect,
  applyIsomerization,
  applyChirality,
  applyCrystallization,
  applyPhaseRadiation,
  applySublimation,
  applySignalExchange,
  applyChargeForce,
  applyFieldDrift,
  applyCurrentTransfer,
  applyResistance,
  applyCapacitanceStore,
  applyStoredChargeForce,
  applyInductance,
  applyMagneticForce,
  applyResonanceForce,
  applyFluxForce,
  applyIonization,
  applyDischarge,
  applyPlasma,
  applySuperconductivity,
  applyMemoryRefresh,
  applyMemoryDecay,
  applyPatternForce,
  applyTrailWrite,
  applyStigmergyForce,
  applySignalBoost,
  applyLearnAlign,
  applySymbolForce,
  applyMetricForce,
  applyPredictForce,
  applyCodeBlend,
  applyProtocolSync,
  applyFeedback,
  applyLanguage,
  applyCulture,
  setBuffer,
} from './laws.js';
import { computeSynergy } from './synergy.js';

// ── Solver Constants ──

const MAX_FORCE = 50.0;
const MAX_INTERACTIONS = 500;
const MAX_VELOCITY = 10.0;
// Gravity scaled with world size so gravitational pull stays effective at the
// larger inter-particle distances of a bigger world (baseline: 240³ world).
const G = 0.2 * (WORLD_SIZE / 240) ** 2;   // lower gravity so particles don't instantly clump
const DEFAULT_DT = 1.0;

/** Blend a neighbor's color into a subject particle (dissolution). */
function blendColor(view, subjBase, nbBase, ratio) {
  const si = STRIDE_INDEXES;
  view[subjBase + si.COLOR_R] += (view[nbBase + si.COLOR_R] - view[subjBase + si.COLOR_R]) * ratio;
  view[subjBase + si.COLOR_G] += (view[nbBase + si.COLOR_G] - view[subjBase + si.COLOR_G]) * ratio;
  view[subjBase + si.COLOR_B] += (view[nbBase + si.COLOR_B] - view[subjBase + si.COLOR_B]) * ratio;
}

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
 * @param {{ lowFlags: Uint32Array, highFlags: Uint32Array, extFlags: Uint32Array }} lawState - Active laws
 * @param {Uint16Array} dnaBuffer - Species DNA buffer [64 × 64] (unused — DNA read from stride cache)
 * @param {number} worldSize - World boundary size
 * @param {number} dt - Time step (default 1.0)
 * @param {Function} prng - PRNG function returning [0,1)
 */
export function solve(particleBuffer, particleCount, stride, lawState, dnaBuffer, worldSize, dt, prng) {
  const grid = ensureGrid();
  setBuffer(particleBuffer);
  const view = particleBuffer; // Float32Array or SharedArrayBuffer view
  const S = STRIDE_INDEXES;
  const halfWorld = worldSize * 0.5;
  dt = dt || DEFAULT_DT;

  // Zero laws active → hard freeze. Nothing moves, decays, reproduces, or
  // interacts: no integration, no friction, no signal emission/exchange, no
  // lifecycle. Movement and interaction only exist while a law governs them.
  if (
    lawState.lowFlags[0] === 0 &&
    lawState.highFlags[0] === 0 &&
    (lawState.extFlags ? lawState.extFlags[0] === 0 : true)
  ) return;

  // Reusable DNA cache array (avoids allocation per particle)
  const dnaI = new Array(42);
  const _dnaJ = new Array(42);

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
    // Defensive: reset any corrupted position before grid lookups
    if (!Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(pz)) {
      px = worldSize * 0.5 + (prng() - 0.5) * 10;
      py = worldSize * 0.5 + (prng() - 0.5) * 10;
      pz = worldSize * 0.5 + (prng() - 0.5) * 10;
      vx = 0; vy = 0; vz = 0;
    }

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

      if (isSet(lawState, LAW_INDEXES.GRAV)) {
        const gravSynergy = computeSynergy(lawState, LAW_INDEXES.GRAV);
        const gravForce = applyGravity(iBase, jBase, dx, dy, dz, dist, G * gravSynergy);
        if (gravForce) {
          // Gravitational collapse: stars pull nearby matter much harder
          const mI = view[iBase + S.MASS];
          const mJ = view[jBase + S.MASS];
          const bigM = Math.max(mI, mJ);
          if (bigM > runtimeConfig.starMass) {
            const collapseMult = 1.0 + (bigM - runtimeConfig.starMass) * 0.08;
            ax += gravForce.ax * collapseMult;
            ay += gravForce.ay * collapseMult;
            az += gravForce.az * collapseMult;
          } else {
            ax += gravForce.ax;
            ay += gravForce.ay;
            az += gravForce.az;
          }
        }
      }

      // ── Collision + Accretion + Fragmentation ──

      if (isSet(lawState, LAW_INDEXES.COLL)) {
        const m1 = view[iBase + S.MASS];
        const m2 = view[jBase + S.MASS];
        if (m1 <= 0 || m2 <= 0) continue;
        const r1 = view[iBase + S.RADIUS];
        const r2 = view[jBase + S.RADIUS];
        const overlap = (r1 + r2) - dist;

        if (overlap > 0 && dist > 0.01) {
          // Collision normal (i → j)
          const invDist = 1.0 / dist;
          const nx = dx * invDist;
          const ny = dy * invDist;
          const nz = dz * invDist;

          // Softbody push: massive bodies squish instead of rigidly bouncing
          const isStarI = m1 > runtimeConfig.starMass;
          const isStarJ = m2 > runtimeConfig.starMass;
          const push = overlap * (isStarI || isStarJ ? 0.2 : 0.5);
          px -= nx * push;
          py -= ny * push;
          pz -= nz * push;

          // Relative velocity along normal
          const dvx = view[iBase + S.VEL_X] - view[jBase + S.VEL_X];
          const dvy = view[iBase + S.VEL_Y] - view[jBase + S.VEL_Y];
          const dvz = view[iBase + S.VEL_Z] - view[jBase + S.VEL_Z];
          const relVelN = dvx * nx + dvy * ny + dvz * nz;

          // Bounce if approaching
          if (relVelN < 0) {
            const elasticity = dnaI[DNA_INDEXES.ELASTICITY] || 0.5;
            const impulse = -(1 + elasticity) * relVelN / (m1 + m2);
            const bounceForce = impulse * m2;
            ax += bounceForce * nx;
            ay += bounceForce * ny;
            az += bounceForce * nz;
          }

          // ── Softbody dissolution + gravitational collapse ──
          if (isSet(lawState, LAW_INDEXES.ACCR)) {
            const relSpeed = Math.sqrt(dvx * dvx + dvy * dvy + dvz * dvz);
            const fusionMom = dnaI[DNA_INDEXES.FUSION_MOMENTUM] || 0.5;
            if (relSpeed < fusionMom * 2.0) {
              if (isStarI) {
                // Collapse: star pulls overlapping matter in and dissolves it
                const gain = m2 * 0.04 + 0.02 * (m1 / runtimeConfig.starMass);
                view[iBase + S.MASS] += gain;
                view[jBase + S.MASS] = Math.max(0, m2 - gain);
                if (view[jBase + S.MASS] <= 0.05) view[jBase + S.DEAD] = 1.0;
                blendColor(view, iBase, jBase, gain / Math.max(view[iBase + S.MASS], 0.001));
                mass = view[iBase + S.MASS];
              } else if (isStarJ) {
                // Neighbor star dissolves this particle
                const loss = m1 * 0.04;
                view[iBase + S.MASS] = Math.max(0, m1 - loss);
                view[jBase + S.MASS] += loss;
                if (view[iBase + S.MASS] <= 0.05) view[iBase + S.DEAD] = 1.0;
                mass = view[iBase + S.MASS];
              } else if (m1 > m2 * 2.0) {
                // Bigger body slowly absorbs the smaller (partial dissolution)
                const gain = m2 * 0.04;
                view[iBase + S.MASS] += gain;
                view[jBase + S.MASS] = Math.max(0, m2 - gain);
                if (view[jBase + S.MASS] <= 0.05) view[jBase + S.DEAD] = 1.0;
                blendColor(view, iBase, jBase, gain / Math.max(view[iBase + S.MASS], 0.001));
                mass = view[iBase + S.MASS];
              } else if (m2 > m1 * 2.0) {
                // This particle dissolves into the bigger neighbor
                const loss = m1 * 0.04;
                view[iBase + S.MASS] = Math.max(0, m1 - loss);
                view[jBase + S.MASS] += loss;
                if (view[iBase + S.MASS] <= 0.05) view[iBase + S.DEAD] = 1.0;
                mass = view[iBase + S.MASS];
              } else {
                // Similar size: mutual dissolution — blend mass and color
                const diff = (m2 - m1) * 0.02;
                view[iBase + S.MASS] += diff;
                view[jBase + S.MASS] -= diff;
                mass = view[iBase + S.MASS];
                const cR = (view[iBase + S.COLOR_R] + view[jBase + S.COLOR_R]) * 0.5;
                const cG = (view[iBase + S.COLOR_G] + view[jBase + S.COLOR_G]) * 0.5;
                const cB = (view[iBase + S.COLOR_B] + view[jBase + S.COLOR_B]) * 0.5;
                view[iBase + S.COLOR_R] += (cR - view[iBase + S.COLOR_R]) * 0.1;
                view[iBase + S.COLOR_G] += (cG - view[iBase + S.COLOR_G]) * 0.1;
                view[iBase + S.COLOR_B] += (cB - view[iBase + S.COLOR_B]) * 0.1;
                view[jBase + S.COLOR_R] += (cR - view[jBase + S.COLOR_R]) * 0.1;
                view[jBase + S.COLOR_G] += (cG - view[jBase + S.COLOR_G]) * 0.1;
                view[jBase + S.COLOR_B] += (cB - view[jBase + S.COLOR_B]) * 0.1;
              }
            }
          }
        }
      }

      // ── Affinity ──

      const affinitySynergy = computeSynergy(lawState, LAW_INDEXES.AFFINITY);
      const affinityForce = applyAffinity(lawState, view, iBase, jBase, dx, dy, dz, distSq, affinitySynergy);
      if (affinityForce) {
        ax += affinityForce.ax;
        ay += affinityForce.ay;
        az += affinityForce.az;
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
        applyPolymer(lawState, view, iBase, jBase, dx, dy, dz, dist, polySynergy);
      }



      // ── Bond ──

      if (isSet(lawState, LAW_INDEXES.BOND)) {
        const bondSynergy = computeSynergy(lawState, LAW_INDEXES.BOND);
        const bondForce = applyBond(lawState, view, iBase, jBase, stride, dx, dy, dz, dist, bondSynergy);
        if (bondForce) {
          ax += bondForce.ax;
          ay += bondForce.ay;
          az += bondForce.az;
        }
      }

      // ── Reduction ──

      if (isSet(lawState, LAW_INDEXES.REDUCTION)) {
        const redSynergy = computeSynergy(lawState, LAW_INDEXES.REDUCTION);
        applyReduction(iBase, jBase, stride, redSynergy);
      }

      // ── Alloy ──

      if (isSet(lawState, LAW_INDEXES.ALLOY)) {
        const alloySynergy = computeSynergy(lawState, LAW_INDEXES.ALLOY);
        applyAlloy(lawState, view, iBase, jBase, stride, dist, alloySynergy);
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
        ax += orderForce.ax;
        ay += orderForce.ay;
        az += orderForce.az;
      }

      // ── Fate ──

      const fateSynergy = computeSynergy(lawState, LAW_INDEXES.FATE);
      const fateForce = applyFate(lawState, view, iBase, jBase, dx, dy, dz, distSq, fateSynergy);
      if (fateForce) {
        ax += fateForce.ax;
        ay += fateForce.ay;
        az += fateForce.az;
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

      // ── Energy Transfer ──
      if (isSet(lawState, LAW_INDEXES.ENERGY)) {
        const energySynergy = computeSynergy(lawState, LAW_INDEXES.ENERGY);
        applyEnergyTransfer(lawState, view, iBase, jBase, distSq, energySynergy);
      }

      // ── Solvation ──
      if (isSet(lawState, LAW_INDEXES.SOLVATION)) {
        const solvSynergy = computeSynergy(lawState, LAW_INDEXES.SOLVATION);
        const solvMult = applySolvationEffect(lawState, view, iBase, jBase, distSq, solvSynergy);
        if (solvMult !== 1.0) {
          ax *= solvMult;
          ay *= solvMult;
          az *= solvMult;
        }
      }

      // ── Acidity ──
      if (isSet(lawState, LAW_INDEXES.ACIDITY)) {
        const acidSynergy = computeSynergy(lawState, LAW_INDEXES.ACIDITY);
        applyAcidityEffect(lawState, view, iBase, jBase, localTimeStep, acidSynergy);
      }

      // ── Chirality ──
      if (isSet(lawState, LAW_INDEXES.CHIRALITY)) {
        const chirSynergy = computeSynergy(lawState, LAW_INDEXES.CHIRALITY);
        const chirForce = applyChirality(lawState, view, iBase, jBase, dx, dy, dz, dist, chirSynergy);
        if (chirForce) {
          ax += chirForce.ax;
          ay += chirForce.ay;
          az += chirForce.az;
        }
      }

      // ── Crystallization ──
      if (isSet(lawState, LAW_INDEXES.CRYSTALLIZATION)) {
        const crysSynergy = computeSynergy(lawState, LAW_INDEXES.CRYSTALLIZATION);
        const crysForce = applyCrystallization(lawState, view, iBase, jBase, dx, dy, dz, dist, crysSynergy);
        if (crysForce) {
          ax += crysForce.ax;
          ay += crysForce.ay;
          az += crysForce.az;
        }
      }

      // ── Signal exchange (communication DNA, gated by COMMS law) ──
      if (isSet(lawState, LAW_INDEXES.COMMS) && ((view[iBase + S.SIGNAL] || 0) > 0.01 || (view[jBase + S.SIGNAL] || 0) > 0.01)) {
        readDNAFromCache(view, jBase, _dnaJ);
        const sigForce = applySignalExchange(lawState, view, iBase, jBase, dx, dy, dz, dist, dnaI, _dnaJ, localTimeStep);
        if (sigForce) {
          ax += sigForce.ax;
          ay += sigForce.ay;
          az += sigForce.az;
        }
      }

      // ── Track ──
      if (isSet(lawState, LAW_INDEXES.TRACK)) {
        const trackSynergy = computeSynergy(lawState, LAW_INDEXES.TRACK);
        const trackForce = applyTrackingBehavior(lawState, view, iBase, jBase, dx, dy, dz, dist, trackSynergy);
        if (trackForce) {
          ax += trackForce.ax;
          ay += trackForce.ay;
          az += trackForce.az;
        }
      }

      // ── Predation (mass-difference pursuit + gene absorption) ──
      if (isSet(lawState, LAW_INDEXES.PREDATION)) {
        const predForce = applyPredation(iBase, jBase, stride, dx, dy, dz, dist);
        if (predForce) {
          ax += predForce.ax;
          ay += predForce.ay;
          az += predForce.az;
        }
      }

      // Telepathy
      if (isSet(lawState, LAW_INDEXES.TELEPATHY)) {
        const telepathySynergy = computeSynergy(lawState, LAW_INDEXES.TELEPATHY);
        applyTelepathy(lawState, view, iBase, jBase, distSq, telepathySynergy);
      }

      // Clairvoyance
      if (isSet(lawState, LAW_INDEXES.CLAIRVOYANCE)) {
        const clairvoyanceSynergy = computeSynergy(lawState, LAW_INDEXES.CLAIRVOYANCE);
        const clairForce = applyClairvoyance(lawState, view, iBase, jBase, dx, dy, dz, dist, clairvoyanceSynergy);
        if (clairForce) {
          ax += clairForce.ax;
          ay += clairForce.ay;
          az += clairForce.az;
        }
      }

      // Precognition
      if (isSet(lawState, LAW_INDEXES.PRECOGNITION)) {
        const precogSynergy = computeSynergy(lawState, LAW_INDEXES.PRECOGNITION);
        const precogForce = applyPrecognition(lawState, view, iBase, jBase, dx, dy, dz, dist, precogSynergy);
        if (precogForce) {
          ax += precogForce.ax;
          ay += precogForce.ay;
          az += precogForce.az;
        }
      }

      // ── Electromagnetism (pairwise) ──
      if (isSet(lawState, LAW_INDEXES.CHARGE_LAW)) {
        const chargeForce = applyChargeForce(iBase, jBase, dx, dy, dz, dist, 0.8 * computeSynergy(lawState, LAW_INDEXES.CHARGE_LAW));
        if (chargeForce) {
          ax += chargeForce.ax;
          ay += chargeForce.ay;
          az += chargeForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.CAPACITANCE)) {
        const capForce = applyStoredChargeForce(iBase, jBase, dx, dy, dz, dist, 0.4);
        if (capForce) {
          ax += capForce.ax;
          ay += capForce.ay;
          az += capForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.MAGNETISM)) {
        const magForce = applyMagneticForce(iBase, jBase, dx, dy, dz, dist, 0.4 * computeSynergy(lawState, LAW_INDEXES.MAGNETISM));
        if (magForce) {
          ax += magForce.ax;
          ay += magForce.ay;
          az += magForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.RESONANCE)) {
        const resForce = applyResonanceForce(iBase, jBase, dx, dy, dz, dist, 0.2);
        if (resForce) {
          ax += resForce.ax;
          ay += resForce.ay;
          az += resForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.FLUX)) {
        const fluxForce = applyFluxForce(iBase, jBase, dx, dy, dz, dist, 0.4);
        if (fluxForce) {
          ax += fluxForce.ax;
          ay += fluxForce.ay;
          az += fluxForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.INDUCTANCE)) applyInductance(iBase, jBase, 0.05);
      if (isSet(lawState, LAW_INDEXES.CURRENT)) applyCurrentTransfer(iBase, jBase, distSq, 0.05 * computeSynergy(lawState, LAW_INDEXES.CURRENT));
      if (isSet(lawState, LAW_INDEXES.IONIZATION)) {
        const relSpeed = Math.sqrt(
          (view[iBase + S.VEL_X] - view[jBase + S.VEL_X]) ** 2 +
          (view[iBase + S.VEL_Y] - view[jBase + S.VEL_Y]) ** 2 +
          (view[iBase + S.VEL_Z] - view[jBase + S.VEL_Z]) ** 2,
        );
        applyIonization(iBase, jBase, dist, relSpeed, 0.6 * computeSynergy(lawState, LAW_INDEXES.IONIZATION));
      }

      // ── Information (pairwise) ──
      if (isSet(lawState, LAW_INDEXES.SYMBOL)) {
        const symForce = applySymbolForce(iBase, jBase, dx, dy, dz, dist, 0.3 * computeSynergy(lawState, LAW_INDEXES.SYMBOL));
        if (symForce) {
          ax += symForce.ax;
          ay += symForce.ay;
          az += symForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.METRIC)) {
        const metForce = applyMetricForce(iBase, jBase, dx, dy, dz, dist, 0.2);
        if (metForce) {
          ax += metForce.ax;
          ay += metForce.ay;
          az += metForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.PREDICT)) {
        const predForce = applyPredictForce(iBase, jBase, dx, dy, dz, dist, 0.3 * computeSynergy(lawState, LAW_INDEXES.PREDICT));
        if (predForce) {
          ax += predForce.ax;
          ay += predForce.ay;
          az += predForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.PATTERN)) {
        const patForce = applyPatternForce(iBase, jBase, dx, dy, dz, dist, 0.2);
        if (patForce) {
          ax += patForce.ax;
          ay += patForce.ay;
          az += patForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.STIGMERGY)) {
        const stigForce = applyStigmergyForce(iBase, jBase, 0.3 * computeSynergy(lawState, LAW_INDEXES.STIGMERGY));
        if (stigForce) {
          ax += stigForce.ax;
          ay += stigForce.ay;
          az += stigForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.LEARN)) applyLearnAlign(iBase, jBase, 0.05 * computeSynergy(lawState, LAW_INDEXES.LEARN));
      if (isSet(lawState, LAW_INDEXES.MEMORY)) applyMemoryRefresh(iBase, jBase);
      if (isSet(lawState, LAW_INDEXES.CODE)) applyCodeBlend(iBase, jBase, distSq, 0.05 * computeSynergy(lawState, LAW_INDEXES.CODE));
      if (isSet(lawState, LAW_INDEXES.PROTOCOL)) applyProtocolSync(iBase, jBase, 0.1 * computeSynergy(lawState, LAW_INDEXES.PROTOCOL));
      if (isSet(lawState, LAW_INDEXES.SIGNAL_BOOST)) applySignalBoost(iBase, jBase, 0.08 * computeSynergy(lawState, LAW_INDEXES.SIGNAL_BOOST));
      if (isSet(lawState, LAW_INDEXES.SUPERCONDUCTIVITY)) {
        const scForce = applySuperconductivity(iBase, jBase, 0.05 * computeSynergy(lawState, LAW_INDEXES.SUPERCONDUCTIVITY));
        if (scForce) {
          ax += scForce.ax;
          ay += scForce.ay;
          az += scForce.az;
        }
      }
      if (isSet(lawState, LAW_INDEXES.LANGUAGE)) applyLanguage(iBase, jBase, 0.25 * computeSynergy(lawState, LAW_INDEXES.LANGUAGE));
      if (isSet(lawState, LAW_INDEXES.CULTURE)) applyCulture(iBase, jBase, 0.5 * computeSynergy(lawState, LAW_INDEXES.CULTURE));
    }

    // ── Non-pairwise laws ──

    // Planetary gravity
    const planetSynergy = computeSynergy(lawState, LAW_INDEXES.PLANETARY);
    const planetForce = applyPlanetary(lawState, view, iBase, px, py, pz, worldSize, planetSynergy);
    if (planetForce) {
      ax += planetForce.ax;
      ay += planetForce.ay;
      az += planetForce.az;
    }

    // Void
    const voidSynergy = computeSynergy(lawState, LAW_INDEXES.VOID);
    const voidForce = applyVoid(lawState, view, iBase, px, py, pz, worldSize, voidSynergy);
    if (voidForce) {
      ax += voidForce.ax;
      ay += voidForce.ay;
      az += voidForce.az;
    }

    // Dimensionality
    applyDimensionality(lawState, view, iBase, prng, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.DIMENSIONALITY));

    // Chaos
    applyChaos(lawState, view, iBase, prng, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.CHAOS));

    // ── Electromagnetism (per-particle) ──
    if (isSet(lawState, LAW_INDEXES.FIELD)) {
      const fieldForce = applyFieldDrift(iBase, 0.3 * computeSynergy(lawState, LAW_INDEXES.FIELD));
      if (fieldForce) {
        ax += fieldForce.ax;
        ay += fieldForce.ay;
        az += fieldForce.az;
      }
    }
    if (isSet(lawState, LAW_INDEXES.RESISTANCE)) {
      const resForce = applyResistance(iBase, vx, vy, vz, 0.03 * computeSynergy(lawState, LAW_INDEXES.RESISTANCE));
      if (resForce) {
        ax += resForce.ax;
        ay += resForce.ay;
        az += resForce.az;
      }
    }
    if (isSet(lawState, LAW_INDEXES.CAPACITANCE)) {
      applyCapacitanceStore(iBase, 0.002);
    }
    if (isSet(lawState, LAW_INDEXES.DISCHARGE)) {
      const discForce = applyDischarge(iBase, prng, 0.8 * computeSynergy(lawState, LAW_INDEXES.DISCHARGE));
      if (discForce) {
        ax += discForce.ax;
        ay += discForce.ay;
        az += discForce.az;
      }
    }
    if (isSet(lawState, LAW_INDEXES.PLASMA)) {
      applyPlasma(iBase, 0.02 * computeSynergy(lawState, LAW_INDEXES.PLASMA));
    }

    // ── Information (per-particle) ──
    if (isSet(lawState, LAW_INDEXES.STIGMERGY)) {
      applyTrailWrite(iBase, px, py, pz, vx, vy, vz);
    }
    if (isSet(lawState, LAW_INDEXES.MEMORY)) {
      applyMemoryDecay(iBase, 0.995, 0.5);
    }
    if (isSet(lawState, LAW_INDEXES.FEEDBACK)) {
      const fbForce = applyFeedback(iBase, 0.5 * computeSynergy(lawState, LAW_INDEXES.FEEDBACK));
      if (fbForce) {
        ax += fbForce.ax;
        ay += fbForce.ay;
        az += fbForce.az;
      }
    }

    // ── Drag ──

    if (isSet(lawState, LAW_INDEXES.DRAG)) {
      const viscosity = dnaI[DNA_INDEXES.VISCOSITY] || 0.98;
      const dragFactor = Math.pow(viscosity, localTimeStep);
      ax -= vx * (1 - dragFactor) * 10;
      ay -= vy * (1 - dragFactor) * 10;
      az -= vz * (1 - dragFactor) * 10;

      // FRICTION DNA = velocity-dependent drag — same law family (kinetic
      // dampening). Gated with DRAG so no movement effect runs lawless.
      const friction = dnaI[DNA_INDEXES.FRICTION] || 0.01;
      ax -= vx * friction;
      ay -= vy * friction;
      az -= vz * friction;
    }

    // Entropy (jitter)
    if (isSet(lawState, LAW_INDEXES.ENTR)) {
      const jitter = dnaI[DNA_INDEXES.JITTER] || 0.05;
      const jitterMult = computeSynergy(lawState, LAW_INDEXES.ENTR);
      ax += (prng() - 0.5) * jitter * jitterMult * localTimeStep;
      ay += (prng() - 0.5) * jitter * jitterMult * localTimeStep;
      az += (prng() - 0.5) * jitter * jitterMult * 0.3 * localTimeStep;
    }

    // ── Force clamping (goal-engine tunable ceiling + global force scale) ──

    ax *= runtimeConfig.forceScale;
    ay *= runtimeConfig.forceScale;
    az *= runtimeConfig.forceScale;
    const forceMag = Math.sqrt(ax * ax + ay * ay + az * az);
    const forceCap = Math.min(MAX_FORCE, Math.max(0.1, runtimeConfig.maxForce));
    if (forceMag > forceCap) {
      const scale = forceCap / forceMag;
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

    // ── Global drag multiplier (goal-engine tunable) — gated by DRAG ──

    if (isSet(lawState, LAW_INDEXES.DRAG)) {
      vx *= runtimeConfig.dragMultiplier;
      vy *= runtimeConfig.dragMultiplier;
      vz *= runtimeConfig.dragMultiplier;
    }

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

    // Bond/Polymer non-overlap constraint
    if (isSet(lawState, LAW_INDEXES.BOND) || isSet(lawState, LAW_INDEXES.POLYMER)) {
      const nCount2 = getNeighbors(grid, px, py, pz, worldSize, _neighborBuf);
      for (let n2 = 0; n2 < Math.min(nCount2, MAX_INTERACTIONS); n2++) {
        const bj = _neighborBuf[n2];
        if (bj === i) continue;
        const bPtr = bj * stride;
        if (view[bPtr + S.DEAD] >= 0.5) continue;
        
        let bx = view[bPtr + S.POS_X] - px;
        let by = view[bPtr + S.POS_Y] - py;
        let bz = view[bPtr + S.POS_Z] - pz;
        
        if (bx > halfWorld) bx -= worldSize; else if (bx < -halfWorld) bx += worldSize;
        if (by > halfWorld) by -= worldSize; else if (by < -halfWorld) by += worldSize;
        if (bz > halfWorld) bz -= worldSize; else if (bz < -halfWorld) bz += worldSize;
        
        const bd2 = bx*bx + by*by + bz*bz;
        const bd = Math.sqrt(bd2 + 0.001);
        const rA = view[iBase + S.RADIUS] || 1.0;
        const rB = view[bPtr + S.RADIUS] || 1.0;
        const minDist = (rA + rB) * 1.0;
        
        if (bd < minDist) {
          const overlap = minDist - bd;
          const mTotal = mass + view[bPtr + S.MASS];
          const ratio = view[bPtr + S.MASS] / Math.max(mTotal, 0.001);
          px -= (bx/bd) * overlap * ratio;
          py -= (by/bd) * overlap * ratio;
          pz -= (bz/bd) * overlap * ratio;
        }
        
        // Bond equilibrium distance
        if (isSet(lawState, LAW_INDEXES.BOND)) {
          const sI = view[iBase + S.SPECIES_ID];
          const sB = view[bPtr + S.SPECIES_ID];
          const aff = dnaI[DNA_INDEXES.SPECIES_AFFINITY] || 0;
          if ((sI === sB && aff >= 0) || (sI !== sB && aff < 0)) {
            const eqDist = (dnaI[DNA_INDEXES.BASE_RADIUS] || 5) * 2.5 + (view[bPtr + S.DNA_CACHE_START + DNA_INDEXES.BASE_RADIUS] || 5) * 2.5;
            if (bd > eqDist && bd > 0.1) {
              const stiffness = dnaI[DNA_INDEXES.STIFFNESS] || 0.5;
              const pull = (bd - eqDist) * stiffness * 0.15;
              px += (bx/bd) * pull * 0.5;
              py += (by/bd) * pull * 0.5;
              pz += (bz/bd) * pull * 0.5;
            }
          }
        }
      }
    }

    // Final NaN guard — the bond/polymer block runs after the first guard
    if (
      !Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(pz) ||
      !Number.isFinite(vx) || !Number.isFinite(vy) || !Number.isFinite(vz) ||
      !Number.isFinite(mass)
    ) {
      px = worldSize * 0.5; py = worldSize * 0.5; pz = worldSize * 0.5;
      vx = 0; vy = 0; vz = 0; mass = 1.0;
    }
    view[iBase + S.POS_X] = px;
    view[iBase + S.POS_Y] = py;
    view[iBase + S.POS_Z] = pz;
    view[iBase + S.VEL_X] = vx;
    view[iBase + S.VEL_Y] = vy;
    view[iBase + S.VEL_Z] = vz;
    view[iBase + S.MASS] = mass;
    // Age is the particle's own time coordinate (frame count since birth),
    // advanced here so oscillator phases and lifecycle gating progress with
    // or without the LIFE law. Frozen entirely when no laws are active.
    view[iBase + S.AGE] = (view[iBase + S.AGE] || 0) + localTimeStep;

    // ── Signal decay (emission + decay, gated by COMMS law) ──

    if (isSet(lawState, LAW_INDEXES.COMMS)) {
      applySignalDecay(lawState, view, iBase, dnaI, localTimeStep);
    }

    // ── Life cycle ──

    applyLifeCycle(lawState, view, iBase, dnaI, localTimeStep, prng,
      computeSynergy(lawState, LAW_INDEXES.LIFE) * runtimeConfig.deathRate);

    // ── Glow ──
    applyGlowEffect(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.GLOW));

    // ── Genotype ──
    applyGenotypeMutation(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.GENOTYPE));

    // ── Radiation ──
    applyRadiationDamage(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.RADIATION));

    // ── Phenotype ──
    applyPhenotype(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.PHENOTYPE));

    // ── Oxidation ──
    applyOxidationEffect(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.OXIDATION));

    // ── Isomerization ──
    applyIsomerization(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.ISOMERIZATION));

    // ── Phase Radiation ──
    applyPhaseRadiation(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.PHASE_RADIATION));

    // ── Sublimation ──
    applySublimation(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.SUBLIMATION));

    // ── Convection ──

    applyConvection(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.CONVECTION));

    // ── Reproduction ──

    const offspring = applyReproduction(lawState, view, iBase, dnaI, prng,
      computeSynergy(lawState, LAW_INDEXES.REPRO) * runtimeConfig.birthRate, dnaBuffer);
    if (offspring) {
      _offspringRing[_ringWrite] = offspring;
      _ringWrite = (_ringWrite + 1) % OFFSPRING_RING_SIZE;
    }

    // ── Update radius from mass ──

    const baseRadius = dnaI[DNA_INDEXES.BASE_RADIUS] || 2.0;
    view[iBase + S.RADIUS] = baseRadius * Math.pow(mass, 0.333);

    // ── Melt ──
    applyMelt(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.MELT));

    // ── Boil ──
    applyBoil(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.BOIL));

    // ── Condense ──
    applyCondense(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.CONDENSE));

    // ── Deposit ──
    applyDeposit(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.DEPOSIT));

    // ── Exothermic ──
    applyExothermic(lawState, view, iBase,
      computeSynergy(lawState, LAW_INDEXES.EXOTHERMIC));

    // ── Astral ──
    applyAstral(lawState, view, iBase, localTimeStep,
      computeSynergy(lawState, LAW_INDEXES.ASTRAL));
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
