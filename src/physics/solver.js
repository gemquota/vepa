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
  LAW_COUNT,
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
  applyThermalJitter,
  applyColdDamping,
  applyConvection,
  applyTimeDilation,
  applyDimensionality,
  applyChaos,
  applyOrder,
  applyFate,
  advanceFateClock,
  applyWill,
  applySoul,
  applySoulDecay,
  applyMind,
  applyVoid,
  applyBond,
  applyReduction,
  applyTelepathy,
  applyClairvoyance,
  applyPrecognition,
  applyMelt,
  applyBoil,
  applyCondense,
  applyDeposit,
  applyExothermic,
  applyAstral,
  applyAstralInfluence,
  applyGlowEffect,
  applyEnergyTransfer,
  applyRadiationDamage,
  applyTrackingBehavior,
  applyPredation,
  applyGenotypeMutation,
  applyPhenotype,
  applySolvation,
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
  applySingularityForce,
  applySingularityAbsorb,
  applyEntanglePair,
  applyEntanglement,
  applyHistoryWrite,
  applyHistoryForce,
  applyHistoryCalc,
  setBuffer,
} from './laws.js';
import { createSynergyCache } from './synergy.js';
import { applyAlloy, isBondedPair, mergeParticles } from './mergePhysics.js';
import { applyTide, applyFriction, applyElasticity, applyTurbulence, applyCentripetal, applyRotation } from './lawgroups/physicsLaws.js';
import { applyAdiabatic, applyCompression, applyExpansion, applyEquilibrium, applyLatentHeat, applyRunaway } from './lawgroups/thermoLaws.js';
import { applySymbiosis, applyParasite, applyHibernation, applyImmunity } from './lawgroups/biologyLaws.js';
import { applyElectrolysis, applyPhotolysis, applyPrecipitation, applyNeutralization, applyStoichiometry, applyAutocatalysis } from './lawgroups/chemistryLaws.js';
import { applyAntenna, applyShielding, applyPolarization } from './lawgroups/emLaws.js';
import { applyNavigation, applyEncryption } from './lawgroups/infoLaws.js';
import { applyConsciousness, applyPerception, applySynchronicity } from './lawgroups/metaLaws.js';
import { applySuperposition, applyTunneling, applyDecoherence, applyWaveParticle, applyUncertainty, applyTeleport, applyObserver, applyPlanck, applyCoherence, applyBosonic, applyFermionic, applySpin, applySpectral, applyWavefunction, applyHyperplane, applyAntimatter } from './lawgroups/quantumLaws.js';
import { ensureFields, fieldsEnabled, advanceFields, sampleFieldForces, wellForce, resolveWall, portalAt } from './fields.js';

// ── Solver Constants ──

const MAX_FORCE = 50.0;
const DEFAULT_MAX_INTERACTIONS = 500; // live override: WP.MAX_INTERACTIONS
const MAX_VELOCITY = 10.0;
// Gravity scaled with world size so gravitational pull stays effective at the
// larger inter-particle distances of a bigger world (baseline: 240³ world).
const G = 0.2 * (WORLD_SIZE / 240) ** 2;   // lower gravity so particles don't instantly clump
const DEFAULT_DT = 1.0;

// Preallocated neighbor buffer (avoids GC during solve)
const DEFAULT_NEIGHBOR_BUF = 2000;    // live override: WP.NEIGHBOR_BUF
let _neighborBuf = new Array(DEFAULT_NEIGHBOR_BUF);
function ensureNeighborBuf(cap) {
  if (_neighborBuf.length < cap) _neighborBuf = new Array(cap);
  return _neighborBuf;
}

// ── Spatial Grid (module-scoped, reused across ticks) ──

let _grid = null;
let _gridFingerprint = '';

function ensureGrid(dim, cellCap) {
  const fp = dim + '|' + cellCap;
  if (!_grid || _gridFingerprint !== fp) {
    _grid = createGrid(dim, cellCap);
    _gridFingerprint = fp;
  }
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
    (lawState.extFlags ? lawState.extFlags[0] === 0 : true) &&
    (lawState.quadFlags ? lawState.quadFlags[0] === 0 : true)
  ) return;

  // Per-tick law cache — the law state is fixed for the whole tick, so the
  // synergy multipliers and on/off flags are pure functions of it. Computing
  // them once (128 entries) instead of per particle/pair removes tens of
  // thousands of branch chains per tick from the hot loops.
  const syn = createSynergyCache(lawState);
  const active = new Uint8Array(LAW_COUNT);
  for (let i = 0; i < LAW_COUNT; i++) active[i] = isSet(lawState, i) ? 1 : 0;

  // World parameters (WORLD panel sliders) — read live from runtimeConfig.
  const WP = runtimeConfig.worldParams || {};
  const effG = G * (Number.isFinite(WP.GLOBAL_G) ? WP.GLOBAL_G : 1);

  // Performance knobs (SETUP > WORLD > PERFORMANCE) — read live; the grid is
  // rebuilt only when its resolution / cell cap changes.
  const maxInteractions = Math.max(8, Math.round(WP.MAX_INTERACTIONS ?? DEFAULT_MAX_INTERACTIONS));
  const neighborCap = Math.max(24, Math.round(WP.NEIGHBOR_BUF ?? DEFAULT_NEIGHBOR_BUF));
  const gridDim = Math.max(6, Math.min(64, Math.round(WP.GRID_DIM ?? 12)));
  const cellCap = Math.max(1, Math.min(500, Math.round(WP.CELL_CAP ?? 100)));
  const grid = ensureGrid(gridDim, cellCap);
  const nb = ensureNeighborBuf(neighborCap);

  // Field system (v8.2 E.1 — Matter & Medium): the dish itself. Rebuilt only
  // when its structural config (world size, dim, wall/well/portal layout)
  // changes; field strengths are read live. Ambient medium features (wind /
  // thermal / EM / info fields, gravity wells, portals) are active whenever
  // the sim runs (any law on — the zero-laws freeze above still applies);
  // walls are additionally gated by the COLL hard-matter toggle.
  const fieldsOn = fieldsEnabled(WP);
  let fieldSystem = null;
  if (fieldsOn) fieldSystem = ensureFields(worldSize, WP);

  // Fate clock — advances once per tick so species destiny points wander.
  advanceFateClock(dt);

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
  // v4.6.29: gravitational time dilation — the grid snapshot from Phase 1
  // feeds a softened potential (capped neighbourhood) so local time slows
  // beside massive bodies. Empty space runs at full speed.

  const localDt = new Float32Array(particleCount);
  const timeDilActive = active[LAW_INDEXES.TIME_DILATION];
  for (let i = 0; i < particleCount; i++) {
    const base = i * stride;
    let nBuf = null, nCount = 0;
    if (timeDilActive) {
      const px = view[base + S.POS_X];
      const py = view[base + S.POS_Y];
      const pz = view[base + S.POS_Z];
      if (Number.isFinite(px) && Number.isFinite(py) && Number.isFinite(pz)) {
        nCount = Math.min(getNeighbors(grid, px, py, pz, worldSize, nb, neighborCap), 24);
        nBuf = nb;
      }
    }
    localDt[i] = applyTimeDilation(
      lawState, view, base,
      syn[LAW_INDEXES.TIME_DILATION], nBuf, nCount, worldSize
    );
  }

  // ── Phase 2b: Astral souls — ghosts persist and fade. Soul particles
  //    (DEAD=0.5) are excluded from the pairwise/integration loop, so they
  //    are processed here when the ASTRAL law governs them. ──
  if (active[LAW_INDEXES.ASTRAL]) {
    const astralSynergy = syn[LAW_INDEXES.ASTRAL];
    for (let i = 0; i < particleCount; i++) {
      const base = i * stride;
      if (view[base + S.DEAD] >= 0.5) {
        applyAstral(lawState, view, base, dt, astralSynergy);
        // Ghost influence on living neighbours (bounded by the spatial grid,
        // which only contains alive particles).
        const gx = view[base + S.POS_X];
        const gy = view[base + S.POS_Y];
        const gz = view[base + S.POS_Z];
        if (!Number.isFinite(gx) || !Number.isFinite(gy) || !Number.isFinite(gz)) continue;
        const soul = view[base + S.SOUL];
        if (!Number.isFinite(soul) || soul < 0.01) continue;
        const gCount = getNeighbors(grid, gx, gy, gz, worldSize, nb, neighborCap);
        const gLimit = Math.min(gCount, maxInteractions);
        for (let n = 0; n < gLimit; n++) {
          const l = nb[n];
          const lBase = l * stride;
          if (view[lBase + S.DEAD] >= 0.5) continue;
          let gdx = view[lBase + S.POS_X] - gx;
          let gdy = view[lBase + S.POS_Y] - gy;
          let gdz = view[lBase + S.POS_Z] - gz;
          if (gdx > halfWorld) gdx -= worldSize;
          else if (gdx < -halfWorld) gdx += worldSize;
          if (gdy > halfWorld) gdy -= worldSize;
          else if (gdy < -halfWorld) gdy += worldSize;
          if (gdz > halfWorld) gdz -= worldSize;
          else if (gdz < -halfWorld) gdz += worldSize;
          const gDist = Math.sqrt(gdx * gdx + gdy * gdy + gdz * gdz);
          if (gDist < 1 || gDist > 80) continue;
          applyAstralInfluence(lawState, view, base, lBase, gdx, gdy, gdz, gDist, astralSynergy, dt);
        }
      }
    }
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
    // DISCHARGE aim: net direction toward the most opposite stored charge.
    let ddx = 0;
    let ddy = 0;
    let ddz = 0;
    let iAbsorbed = false; // consumed by a singularity's event horizon

    // ── Pairwise neighbor loop ──

    const nCount = getNeighbors(grid, px, py, pz, worldSize, nb, neighborCap);
    const limit = Math.min(nCount, maxInteractions);

    for (let n = 0; n < limit; n++) {
      const j = nb[n];
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

      if (active[LAW_INDEXES.GRAV]) {
        const gravSynergy = syn[LAW_INDEXES.GRAV];
        const gravForce = applyGravity(iBase, jBase, dx, dy, dz, dist, effG * gravSynergy);
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
      // COLL and ACCR are independent laws (confirmed batch-02 semantics):
      //  - COLL: softbody push + elastic bounce on overlap.
      //  - ACCR: mass fusion on overlap. FUSION_MOMENTUM DNA is the MINIMUM
      //    relative momentum required to fuse on impact — slower pairs bounce
      //    instead. FUSION_TIME DNA is how long sub-threshold pairs must stay
      //    in very close proximity before they fuse anyway (proximity dwell,
      //    tracked in the free MITOSIS_TIMER / PARTNER_ID stride fields).
      if (active[LAW_INDEXES.COLL] || active[LAW_INDEXES.ACCR]) {
        const m1 = view[iBase + S.MASS];
        const m2 = view[jBase + S.MASS];
        if (m1 <= 0 || m2 <= 0) continue;
        const r1 = view[iBase + S.RADIUS];
        const r2 = view[jBase + S.RADIUS];
        const overlap = (r1 + r2) - dist;
        const collOn = active[LAW_INDEXES.COLL];
        const accrOn = active[LAW_INDEXES.ACCR];

        // ACCR proximity-dwell bookkeeping: reset the timer whenever the
        // tracked partner leaves overlap range so "very close proximity"
        // means continuous contact, not a sum of separate grazes.
        if (accrOn) {
          const dwellPartner = view[iBase + S.PARTNER_ID] || -1;
          if (dwellPartner === j && !(overlap > 0 && dist > 0.01)) {
            view[iBase + S.MITOSIS_TIMER] = 0;
            view[iBase + S.PARTNER_ID] = -1;
          }
        }

        if (overlap > 0 && dist > 0.01) {
          // Collision normal (i → j)
          const invDist = 1.0 / dist;
          const nx = dx * invDist;
          const ny = dy * invDist;
          const nz = dz * invDist;

          // Relative velocity along normal
          const dvx = view[iBase + S.VEL_X] - view[jBase + S.VEL_X];
          const dvy = view[iBase + S.VEL_Y] - view[jBase + S.VEL_Y];
          const dvz = view[iBase + S.VEL_Z] - view[jBase + S.VEL_Z];
          const relVelN = dvx * nx + dvy * ny + dvz * nz;
          const relSpeed = Math.sqrt(dvx * dvx + dvy * dvy + dvz * dvz);

          // ── ACCR fusion gating (confirmed batch-02 semantics) ──
          // FUSION_MOMENTUM (DNA 16): minimum relative momentum to fuse on
          // impact; below it the pair bounces. FUSION_TIME (DNA 17): seconds
          // of continuous close proximity required for sub-threshold pairs
          // to fuse anyway.
          let fusing = false;
          if (accrOn) {
            const fusionMom = dnaI[DNA_INDEXES.FUSION_MOMENTUM] ?? 1.0;
            const fusionTime = dnaI[DNA_INDEXES.FUSION_TIME] ?? 2;
            const relMomentum = relSpeed * Math.min(m1, m2);
            fusing = relMomentum >= fusionMom;
            let dwell = view[iBase + S.MITOSIS_TIMER] || 0;
            if (!fusing) {
              if ((view[iBase + S.PARTNER_ID] || -1) === j) {
                dwell += localTimeStep;
              } else {
                dwell = localTimeStep;
                view[iBase + S.PARTNER_ID] = j;
              }
              if (dwell >= fusionTime) fusing = true;
            } else {
              dwell = 0;
              view[iBase + S.PARTNER_ID] = -1;
            }
            view[iBase + S.MITOSIS_TIMER] = dwell;
          }

          // ── COLL: softbody push + elastic bounce ──
          // Massive bodies squish instead of rigidly bouncing; fusing pairs
          // coalesce instead of bouncing apart.
          if (collOn && !fusing) {
            const isStarI = m1 > runtimeConfig.starMass;
            const isStarJ = m2 > runtimeConfig.starMass;
            const push = overlap * (isStarI || isStarJ ? 0.2 : 0.5);
            px -= nx * push;
            py -= ny * push;
            pz -= nz * push;

            // Bounce if approaching (relVelN > 0 along the i→j normal means
            // the pair is closing; a negative impulse along n separates them)
            if (relVelN > 0) {
              const elasticity = dnaI[DNA_INDEXES.ELASTICITY] || 0.5;
              const impulse = -(1 + elasticity) * relVelN / (m1 + m2);
              const bounceForce = impulse * m2;
              ax += bounceForce * nx;
              ay += bounceForce * ny;
              az += bounceForce * nz;
              // A collision is a measurement — collapse the wave (v4.6.29).
              if (active[LAW_INDEXES.WAVE_PARTICLE]) {
                view[iBase + S.WAVE_MEASURED] = 1;
                view[jBase + S.WAVE_MEASURED] = 1;
              }
            }
          } else if (accrOn && !collOn && relVelN > 0) {
            // Sub-threshold ACCR-only contact: the pair "bounces" — a gentle
            // elastic separation so matter does not silently pass through
            // while the dwell timer decides whether they fuse.
            const elasticity = dnaI[DNA_INDEXES.ELASTICITY] || 0.5;
            const impulse = -(1 + elasticity) * relVelN / (m1 + m2);
            const bounceForce = impulse * m2;
            ax += bounceForce * nx;
            ay += bounceForce * ny;
            az += bounceForce * nz;
          }

          // ── ACCR: true accretion — the pair becomes ONE body (v8.0.0) ──
          // When the fusion gate passes (momentum or dwell), the two particles
          // collapse into a single body: combined mass (× FUSION efficiency),
          // centre-of-mass position, momentum-conserving velocity, and
          // mass-weighted colour. Bonded pairs (BOND / POLYMER molecules) are
          // excluded — a bond is not accretion; the orbs stay separate and
          // attached. STOICHIOMETRY makes the merger exact (efficiency 1.0).
          if (accrOn && fusing) {
            // FUSION DNA (9): mass-merging efficiency multiplier (0..1 → 0.5..1.5).
            const fusionMult = 0.5 + (dnaI[DNA_INDEXES.FUSION] || 0.5);
            const eff = active[LAW_INDEXES.STOICHIOMETRY] ? 1.0 : fusionMult;
            if (!isBondedPair(view, iBase, jBase, stride)) {
              mergeParticles(view, iBase, jBase, stride, { fusionMult: eff, worldSize });
              // Fold the merged body back into the integration locals so the
              // writeback and radius update reflect the new single particle.
              px = view[iBase + S.POS_X];
              py = view[iBase + S.POS_Y];
              pz = view[iBase + S.POS_Z];
              vx = view[iBase + S.VEL_X];
              vy = view[iBase + S.VEL_Y];
              vz = view[iBase + S.VEL_Z];
              mass = view[iBase + S.MASS];
            }
          }
        }
      }

      // ── Affinity ──

      if (active[LAW_INDEXES.AFFINITY]) {
        const affinityForce = applyAffinity(lawState, view, iBase, jBase, dx, dy, dz, distSq, syn[LAW_INDEXES.AFFINITY]);
        if (affinityForce) {
          ax += affinityForce.ax;
          ay += affinityForce.ay;
          az += affinityForce.az;
        }
      }

      // ── Chemistry modifier ──

      if (
        active[LAW_INDEXES.CATALYSIS_LAW] ||
        active[LAW_INDEXES.SOLVATION] ||
        active[LAW_INDEXES.ACIDITY] ||
        active[LAW_INDEXES.CRYSTALLIZATION]
      ) {
        const chemMult = applyChemistry(lawState, view, iBase, jBase, distSq, syn[LAW_INDEXES.CATALYSIS_LAW]);
        if (chemMult !== 1.0) {
          ax *= chemMult;
          ay *= chemMult;
          az *= chemMult;
        }
      }

      // ── Polymer ──

      if (active[LAW_INDEXES.POLYMER]) {
        const polySynergy = syn[LAW_INDEXES.POLYMER];
        applyPolymer(lawState, view, iBase, jBase, dx, dy, dz, dist, polySynergy, stride);
      }



      // ── Bond ──

      if (active[LAW_INDEXES.BOND]) {
        const bondSynergy = syn[LAW_INDEXES.BOND];
        const bondForce = applyBond(lawState, view, iBase, jBase, stride, dx, dy, dz, dist, bondSynergy, nCount);
        if (bondForce) {
          ax += bondForce.ax;
          ay += bondForce.ay;
          az += bondForce.az;
        }
      }

      // ── Reduction ──

      if (active[LAW_INDEXES.REDUCTION]) {
        const redSynergy = syn[LAW_INDEXES.REDUCTION];
        applyReduction(iBase, jBase, stride, redSynergy);
      }

      // ── Alloy ──

      if (active[LAW_INDEXES.ALLOY]) {
        const alloySynergy = syn[LAW_INDEXES.ALLOY];
        applyAlloy(lawState, view, iBase, jBase, stride, dist, alloySynergy);
      }

      // ── Heat Transfer ──

      if (active[LAW_INDEXES.HEAT] || active[LAW_INDEXES.COLD]) {
        const heatSynergy = syn[LAW_INDEXES.HEAT];
        applyHeatTransfer(lawState, view, iBase, jBase, dist, localTimeStep, heatSynergy);
      }

      // ── Order ──

      if (active[LAW_INDEXES.ORDER]) {
        const orderForce = applyOrder(lawState, view, iBase, jBase, distSq, syn[LAW_INDEXES.ORDER]);
        if (orderForce) {
          ax += orderForce.ax;
          ay += orderForce.ay;
          az += orderForce.az;
        }
      }

      // ── Soul ──

      if (active[LAW_INDEXES.SOUL_LAW]) {
        const soulSynergy = syn[LAW_INDEXES.SOUL_LAW];
        applySoul(lawState, view, iBase, jBase, distSq, soulSynergy);
      }

      // ── Mind ──

      if (active[LAW_INDEXES.MIND]) {
        const mindSynergy = syn[LAW_INDEXES.MIND];
        const mindEffect = applyMind(lawState, view, iBase, jBase, distSq, mindSynergy);
        if (mindEffect && mindEffect.signalBoost) {
          view[iBase + S.SIGNAL] += mindEffect.signalBoost;
        }
      }

      // ── Energy Transfer ──
      if (active[LAW_INDEXES.ENERGY]) {
        const energySynergy = syn[LAW_INDEXES.ENERGY];
        applyEnergyTransfer(lawState, view, iBase, jBase, distSq, energySynergy);
      }

      // ── Solvation ──
      if (active[LAW_INDEXES.SOLVATION]) {
        const solvSynergy = syn[LAW_INDEXES.SOLVATION];
        const solvMult = applySolvationEffect(lawState, view, iBase, jBase, distSq, solvSynergy);
        if (solvMult !== 1.0) {
          ax *= solvMult;
          ay *= solvMult;
          az *= solvMult;
        }
        // Real-world solvation: solvent charge forces — opposite charges
        // attract, like charges repel (ions disperse through the medium).
        const solvForce = applySolvation(iBase, jBase, stride, dx, dy, dz, dist, solvSynergy);
        if (solvForce) {
          ax += solvForce.ax;
          ay += solvForce.ay;
          az += solvForce.az;
        }
      }

      // ── Acidity ──
      if (active[LAW_INDEXES.ACIDITY]) {
        const acidSynergy = syn[LAW_INDEXES.ACIDITY];
        applyAcidityEffect(lawState, view, iBase, jBase, localTimeStep, acidSynergy);
      }

      // ── Chirality ──
      if (active[LAW_INDEXES.CHIRALITY]) {
        const chirSynergy = syn[LAW_INDEXES.CHIRALITY];
        const chirForce = applyChirality(lawState, view, iBase, jBase, dx, dy, dz, dist, chirSynergy);
        if (chirForce) {
          ax += chirForce.ax;
          ay += chirForce.ay;
          az += chirForce.az;
        }
      }

      // ── Crystallization ──
      if (active[LAW_INDEXES.CRYSTALLIZATION]) {
        const crysSynergy = syn[LAW_INDEXES.CRYSTALLIZATION];
        const crysForce = applyCrystallization(lawState, view, iBase, jBase, dx, dy, dz, dist, crysSynergy);
        if (crysForce) {
          ax += crysForce.ax;
          ay += crysForce.ay;
          az += crysForce.az;
        }
      }

      // ── Signal exchange (communication DNA, gated by COMMS law) ──
      if (active[LAW_INDEXES.COMMS] && ((view[iBase + S.SIGNAL] || 0) > 0.01 || (view[jBase + S.SIGNAL] || 0) > 0.01)) {
        readDNAFromCache(view, jBase, _dnaJ);
        const sigForce = applySignalExchange(lawState, view, iBase, jBase, dx, dy, dz, dist, dnaI, _dnaJ, localTimeStep);
        if (sigForce) {
          ax += sigForce.ax;
          ay += sigForce.ay;
          az += sigForce.az;
        }
      }

      // ── Track ──
      if (active[LAW_INDEXES.TRACK]) {
        const trackSynergy = syn[LAW_INDEXES.TRACK];
        const trackForce = applyTrackingBehavior(lawState, view, iBase, jBase, dx, dy, dz, dist, trackSynergy);
        if (trackForce) {
          ax += trackForce.ax;
          ay += trackForce.ay;
          az += trackForce.az;
        }
      }

      // ── Predation (mass-difference pursuit + gene absorption) ──
      if (active[LAW_INDEXES.PREDATION]) {
        const predForce = applyPredation(iBase, jBase, stride, dx, dy, dz, dist, prng);
        if (predForce) {
          ax += predForce.ax;
          ay += predForce.ay;
          az += predForce.az;
        }
      }

      // Telepathy
      if (active[LAW_INDEXES.TELEPATHY]) {
        const telepathySynergy = syn[LAW_INDEXES.TELEPATHY];
        applyTelepathy(lawState, view, iBase, jBase, distSq, telepathySynergy, localTimeStep);
      }

      // Clairvoyance
      if (active[LAW_INDEXES.CLAIRVOYANCE]) {
        const clairvoyanceSynergy = syn[LAW_INDEXES.CLAIRVOYANCE];
        const clairForce = applyClairvoyance(lawState, view, iBase, jBase, dx, dy, dz, dist, clairvoyanceSynergy, localTimeStep);
        if (clairForce) {
          ax += clairForce.ax;
          ay += clairForce.ay;
          az += clairForce.az;
        }
      }

      // Precognition
      if (active[LAW_INDEXES.PRECOGNITION]) {
        const precogSynergy = syn[LAW_INDEXES.PRECOGNITION];
        const precogForce = applyPrecognition(lawState, view, iBase, jBase, dx, dy, dz, dist, precogSynergy, localTimeStep);
        if (precogForce) {
          ax += precogForce.ax;
          ay += precogForce.ay;
          az += precogForce.az;
        }
      }

      // ── Electromagnetism (pairwise) ──
      if (active[LAW_INDEXES.CHARGE_LAW]) {
        const chargeForce = applyChargeForce(iBase, jBase, dx, dy, dz, dist, 0.8 * syn[LAW_INDEXES.CHARGE_LAW]);
        if (chargeForce) {
          ax += chargeForce.ax;
          ay += chargeForce.ay;
          az += chargeForce.az;
        }
      }
      if (active[LAW_INDEXES.CAPACITANCE]) {
        const capForce = applyStoredChargeForce(iBase, jBase, dx, dy, dz, dist, 0.4);
        if (capForce) {
          ax += capForce.ax;
          ay += capForce.ay;
          az += capForce.az;
        }
      }
      if (active[LAW_INDEXES.MAGNETISM]) {
        const magForce = applyMagneticForce(iBase, jBase, dx, dy, dz, dist, 0.4 * syn[LAW_INDEXES.MAGNETISM]);
        if (magForce) {
          ax += magForce.ax;
          ay += magForce.ay;
          az += magForce.az;
        }
      }
      if (active[LAW_INDEXES.RESONANCE]) {
        const resForce = applyResonanceForce(iBase, jBase, dx, dy, dz, dist, 0.2);
        if (resForce) {
          ax += resForce.ax;
          ay += resForce.ay;
          az += resForce.az;
        }
      }
      if (active[LAW_INDEXES.FLUX]) {
        const fluxForce = applyFluxForce(iBase, jBase, dx, dy, dz, dist, 0.4);
        if (fluxForce) {
          ax += fluxForce.ax;
          ay += fluxForce.ay;
          az += fluxForce.az;
        }
      }
      if (active[LAW_INDEXES.INDUCTANCE]) applyInductance(iBase, jBase, dist, 0.05 * syn[LAW_INDEXES.INDUCTANCE]);
      if (active[LAW_INDEXES.CURRENT]) applyCurrentTransfer(iBase, jBase, distSq, 0.05 * syn[LAW_INDEXES.CURRENT]);
      if (active[LAW_INDEXES.IONIZATION]) {
        const relSpeed = Math.sqrt(
          (view[iBase + S.VEL_X] - view[jBase + S.VEL_X]) ** 2 +
          (view[iBase + S.VEL_Y] - view[jBase + S.VEL_Y]) ** 2 +
          (view[iBase + S.VEL_Z] - view[jBase + S.VEL_Z]) ** 2,
        );
        applyIonization(iBase, jBase, dist, relSpeed, 0.6 * syn[LAW_INDEXES.IONIZATION]);
      }
      if (active[LAW_INDEXES.DISCHARGE]) {
        // Spark direction: toward the neighbor whose stored charge is most
        // opposite to this particle's (the potential difference it will bridge).
        const ci = view[iBase + S.CHARGE] || 0;
        if (Math.abs(ci) >= 0.5) {
          const cj = view[jBase + S.CHARGE] || 0;
          const dq = cj - ci;
          const weight = (ci > 0 ? -dq : dq) / (dist + 1.0);
          if (weight > 0) {
            ddx += dx * weight;
            ddy += dy * weight;
            ddz += dz * weight;
          }
        }
      }

      // ── Information (pairwise) ──
      if (active[LAW_INDEXES.SYMBOL]) {
        const symForce = applySymbolForce(iBase, jBase, dx, dy, dz, dist, 0.3 * syn[LAW_INDEXES.SYMBOL]);
        if (symForce) {
          ax += symForce.ax;
          ay += symForce.ay;
          az += symForce.az;
        }
      }
      if (active[LAW_INDEXES.METRIC]) {
        const metForce = applyMetricForce(iBase, jBase, dx, dy, dz, dist, 0.2);
        if (metForce) {
          ax += metForce.ax;
          ay += metForce.ay;
          az += metForce.az;
        }
      }
      if (active[LAW_INDEXES.PREDICT]) {
        const predForce = applyPredictForce(iBase, jBase, dx, dy, dz, dist, 0.3 * syn[LAW_INDEXES.PREDICT]);
        if (predForce) {
          ax += predForce.ax;
          ay += predForce.ay;
          az += predForce.az;
        }
      }
      if (active[LAW_INDEXES.PATTERN]) {
        const patForce = applyPatternForce(iBase, jBase, dx, dy, dz, dist, 0.2);
        if (patForce) {
          ax += patForce.ax;
          ay += patForce.ay;
          az += patForce.az;
        }
      }
      if (active[LAW_INDEXES.STIGMERGY]) {
        const stigForce = applyStigmergyForce(iBase, jBase, 0.3 * syn[LAW_INDEXES.STIGMERGY]);
        if (stigForce) {
          ax += stigForce.ax;
          ay += stigForce.ay;
          az += stigForce.az;
        }
      }
      if (active[LAW_INDEXES.LEARN]) applyLearnAlign(iBase, jBase, 0.05 * syn[LAW_INDEXES.LEARN]);
      if (active[LAW_INDEXES.MEMORY]) applyMemoryRefresh(iBase, jBase);
      if (active[LAW_INDEXES.CODE]) applyCodeBlend(iBase, jBase, distSq, 0.05 * syn[LAW_INDEXES.CODE]);
      if (active[LAW_INDEXES.PROTOCOL]) applyProtocolSync(iBase, jBase, 0.1 * syn[LAW_INDEXES.PROTOCOL]);
      if (active[LAW_INDEXES.SIGNAL_BOOST]) applySignalBoost(iBase, jBase, 0.08 * syn[LAW_INDEXES.SIGNAL_BOOST]);
      if (active[LAW_INDEXES.SUPERCONDUCTIVITY]) {
        const scForce = applySuperconductivity(iBase, jBase, 0.05 * syn[LAW_INDEXES.SUPERCONDUCTIVITY]);
        if (scForce) {
          ax += scForce.ax;
          ay += scForce.ay;
          az += scForce.az;
        }
      }
      if (active[LAW_INDEXES.LANGUAGE]) applyLanguage(iBase, jBase, 0.25 * syn[LAW_INDEXES.LANGUAGE]);
      if (active[LAW_INDEXES.CULTURE]) applyCulture(iBase, jBase, 0.5 * syn[LAW_INDEXES.CULTURE]);

      // ── 8x16 expansion (pairwise) ──

      // Physics
      if (active[LAW_INDEXES.TIDE]) {
        const tideForce = applyTide(view, iBase, jBase, dx, dy, dz, dist, 0.3);
        if (tideForce) { ax += tideForce.ax; ay += tideForce.ay; az += tideForce.az; }
      }
      if (active[LAW_INDEXES.ELASTICITY]) {
        const elasForce = applyElasticity(view, iBase, jBase, dx, dy, dz, dist, 1.0);
        if (elasForce) { ax += elasForce.ax; ay += elasForce.ay; az += elasForce.az; }
      }

      // Biology
      if (active[LAW_INDEXES.SYMBIOSIS]) applySymbiosis(view, iBase, jBase, 0.5);
      if (active[LAW_INDEXES.PARASITE]) applyParasite(view, iBase, jBase, 0.5);

      // Chemistry
      if (active[LAW_INDEXES.ELECTROLYSIS]) applyElectrolysis(view, iBase, jBase, 0.5);
      if (active[LAW_INDEXES.PRECIPITATION]) applyPrecipitation(view, iBase, jBase, 0.5);
      if (active[LAW_INDEXES.NEUTRALIZATION]) applyNeutralization(view, iBase, jBase, 0.5);
      if (active[LAW_INDEXES.STOICHIOMETRY]) applyStoichiometry(view, iBase, jBase, 0.5);
      if (active[LAW_INDEXES.AUTOCATALYSIS]) applyAutocatalysis(view, iBase, jBase, 0.5);

      // Thermodynamics
      if (active[LAW_INDEXES.COMPRESSION]) applyCompression(view, iBase, jBase, dist, 0.5);
      if (active[LAW_INDEXES.EQUILIBRIUM]) applyEquilibrium(view, iBase, jBase, 0.3);

      // Electromagnetism
      if (active[LAW_INDEXES.POLARIZATION]) applyPolarization(view, iBase, jBase, 0.5);

      // Information
      if (active[LAW_INDEXES.NAVIGATION]) {
        const navForce = applyNavigation(view, iBase, jBase, dx, dy, dz, dist, 0.5);
        if (navForce) { ax += navForce.ax; ay += navForce.ay; az += navForce.az; }
      }

      // Metaphysics
      if (active[LAW_INDEXES.PERCEPTION]) {
        const perForce = applyPerception(view, iBase, jBase, dist, 0.5);
        if (perForce) { ax += perForce.ax; ay += perForce.ay; az += perForce.az; }
      }
      if (active[LAW_INDEXES.SYNCHRONICITY]) {
        const syncForce = applySynchronicity(view, iBase, jBase, 0.5);
        if (syncForce) { ax += syncForce.ax; ay += syncForce.ay; az += syncForce.az; }
      }

      // Quantum
      if (active[LAW_INDEXES.COHERENCE]) {
        const cohForce = applyCoherence(view, iBase, jBase, 0.5);
        if (cohForce) { ax += cohForce.ax; ay += cohForce.ay; az += cohForce.az; }
      }
      if (active[LAW_INDEXES.BOSONIC]) {
        const bosForce = applyBosonic(view, iBase, jBase, dx, dy, dz, dist, 0.5);
        if (bosForce) { ax += bosForce.ax; ay += bosForce.ay; az += bosForce.az; }
      }
      if (active[LAW_INDEXES.FERMIONIC]) {
        const ferForce = applyFermionic(view, iBase, jBase, dx, dy, dz, dist, 0.5);
        if (ferForce) { ax += ferForce.ax; ay += ferForce.ay; az += ferForce.az; }
      }
      if (active[LAW_INDEXES.OBSERVER]) {
        // WAVE_PARTICLE: a high-MEMORY observer measures the neighbour.
        if (active[LAW_INDEXES.WAVE_PARTICLE] && (view[iBase + S.MEMORY] || 0) > 0.5) {
          view[jBase + S.WAVE_MEASURED] = 1;
        }
        applyObserver(view, iBase, jBase, 0.5);
      }
      if (active[LAW_INDEXES.ANTIMATTER]) applyAntimatter(view, iBase, jBase, 0.5);

      // ── New law types (pairwise) ──

      // Singularity — extreme inward pull from a supermassive neighbour,
      // then absorption if i crosses the hole's event horizon.
      if (active[LAW_INDEXES.SINGULARITY]) {
        const singSynergy = syn[LAW_INDEXES.SINGULARITY];
        const singForce = applySingularityForce(iBase, jBase, dx, dy, dz, dist, 0.5 * singSynergy);
        if (singForce) {
          ax += singForce.ax;
          ay += singForce.ay;
          az += singForce.az;
        }
        if (applySingularityAbsorb(iBase, jBase, dist, singSynergy)) {
          iAbsorbed = true;
          break; // i was consumed — stop interacting with neighbours
        }
      }

      // Entanglement — touching particles forge a non-local quantum link.
      if (active[LAW_INDEXES.ENTANGLEMENT]) {
        applyEntanglePair(iBase, jBase, dist);
      }
    }

    // Consumed by an event horizon this tick — skip integration/lifecycle.
    if (iAbsorbed) continue;

    // Pairwise laws may mutate mass in-place (PREDATION absorption); fold any
    // such change into the local mass before integration and writeback.
    mass = view[iBase + S.MASS];
    if (!Number.isFinite(mass) || mass <= 0) mass = 0.001;

    // The collision/softbody pass pushes the local position directly; capture
    // that delta so per-particle position mutations can be folded in later
    // without discarding the push.
    const softbodyDX = px - view[iBase + S.POS_X];
    const softbodyDY = py - view[iBase + S.POS_Y];
    const softbodyDZ = pz - view[iBase + S.POS_Z];

    // ── Non-pairwise laws ──

    // Planetary gravity
    const planetSynergy = syn[LAW_INDEXES.PLANETARY];
    const planetForce = applyPlanetary(lawState, view, iBase, px, py, pz, worldSize, planetSynergy);
    if (planetForce) {
      ax += planetForce.ax;
      ay += planetForce.ay;
      az += planetForce.az;
    }

    // Void
    const voidSynergy = syn[LAW_INDEXES.VOID];
    const voidForce = applyVoid(lawState, view, iBase, px, py, pz, worldSize, voidSynergy);
    if (voidForce) {
      ax += voidForce.ax;
      ay += voidForce.ay;
      az += voidForce.az;
    }

    // Dimensionality
    vz += applyDimensionality(lawState, view, iBase, prng, localTimeStep,
      syn[LAW_INDEXES.DIMENSIONALITY]);

    // Chaos (deterministic Lorenz map — v4.6.29, no PRNG)
    applyChaos(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.CHAOS]);

    // Soul decay — souls dissipate slowly unless replenished
    applySoulDecay(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.SOUL_LAW]);

    // Fate — per-species drifting destiny point
    const fateForce = applyFate(lawState, view, iBase, px, py, pz, worldSize,
      syn[LAW_INDEXES.FATE]);
    if (fateForce) {
      ax += fateForce.ax;
      ay += fateForce.ay;
      az += fateForce.az;
    }

    // ── Electromagnetism (per-particle) ──
    if (active[LAW_INDEXES.FIELD]) {
      const fieldForce = applyFieldDrift(iBase, 0.3 * syn[LAW_INDEXES.FIELD]);
      if (fieldForce) {
        ax += fieldForce.ax;
        ay += fieldForce.ay;
        az += fieldForce.az;
      }
    }
    if (active[LAW_INDEXES.RESISTANCE]) {
      const resForce = applyResistance(iBase, vx, vy, vz, 0.03 * syn[LAW_INDEXES.RESISTANCE]);
      if (resForce) {
        ax += resForce.ax;
        ay += resForce.ay;
        az += resForce.az;
      }
    }
    if (active[LAW_INDEXES.CAPACITANCE]) {
      applyCapacitanceStore(iBase, 0.002);
    }
    if (active[LAW_INDEXES.DISCHARGE]) {
      const discForce = applyDischarge(iBase, prng, 0.8 * syn[LAW_INDEXES.DISCHARGE], ddx, ddy, ddz);
      if (discForce) {
        ax += discForce.ax;
        ay += discForce.ay;
        az += discForce.az;
      }
    }
    if (active[LAW_INDEXES.PLASMA]) {
      applyPlasma(iBase, 0.02 * syn[LAW_INDEXES.PLASMA]);
    }

    // ── Information (per-particle) ──
    if (active[LAW_INDEXES.STIGMERGY]) {
      applyTrailWrite(iBase, px, py, pz, vx, vy, vz);
    }
    if (active[LAW_INDEXES.MEMORY]) {
      applyMemoryDecay(iBase, 0.995, 0.5);
    }
    if (active[LAW_INDEXES.FEEDBACK]) {
      const fbForce = applyFeedback(iBase, 0.5 * syn[LAW_INDEXES.FEEDBACK]);
      if (fbForce) {
        ax += fbForce.ax;
        ay += fbForce.ay;
        az += fbForce.az;
      }
    }

    // ── 8x16 expansion (per-particle) ──
    const center = worldSize * 0.5;

    // Physics
    if (active[LAW_INDEXES.FRICTION]) {
      const frForce = applyFriction(view, iBase, 0.05);
      if (frForce) { ax += frForce.ax; ay += frForce.ay; az += frForce.az; }
    }
    if (active[LAW_INDEXES.TURBULENCE]) {
      const tbForce = applyTurbulence(view, iBase, 0.05, prng);
      if (tbForce) { ax += tbForce.ax; ay += tbForce.ay; az += tbForce.az; }
    }
    if (active[LAW_INDEXES.CENTRIPETAL]) {
      const cpForce = applyCentripetal(view, iBase, center, center, center, 0.0005);
      if (cpForce) { ax += cpForce.ax; ay += cpForce.ay; az += cpForce.az; }
    }
    if (active[LAW_INDEXES.ROTATION]) {
      const rotForce = applyRotation(view, iBase, center, center, center, 0.002);
      if (rotForce) { ax += rotForce.ax; ay += rotForce.ay; az += rotForce.az; }
    }

    // Biology
    if (active[LAW_INDEXES.HIBERNATION]) {
      const hibForce = applyHibernation(view, iBase, 0.5);
      if (hibForce) { ax += hibForce.ax; ay += hibForce.ay; az += hibForce.az; }
    }
    if (active[LAW_INDEXES.IMMUNITY]) applyImmunity(view, iBase, 0.5);

    // Chemistry
    if (active[LAW_INDEXES.PHOTOLYSIS]) applyPhotolysis(view, iBase, 0.5);

    // Thermodynamics
    if (active[LAW_INDEXES.ADIABATIC]) {
      const adForce = applyAdiabatic(view, iBase, 0.1);
      if (adForce) { ax += adForce.ax; ay += adForce.ay; az += adForce.az; }
    }
    if (active[LAW_INDEXES.LATENT_HEAT]) applyLatentHeat(view, iBase, 0.1);
    if (active[LAW_INDEXES.RUNAWAY]) applyRunaway(view, iBase, 0.1);

    // Metaphysics
    if (active[LAW_INDEXES.CONSCIOUSNESS]) applyConsciousness(view, iBase, 0.5);

    // Electromagnetism
    if (active[LAW_INDEXES.ANTENNA]) applyAntenna(view, iBase, 0.5);
    if (active[LAW_INDEXES.SHIELDING]) applyShielding(view, iBase, 0.5);

    // Information
    if (active[LAW_INDEXES.ENCRYPTION]) applyEncryption(view, iBase, 0.5);

    // Quantum
    if (active[LAW_INDEXES.SUPERPOSITION]) {
      const supForce = applySuperposition(view, iBase, 0.05, prng);
      if (supForce) { ax += supForce.ax; ay += supForce.ay; az += supForce.az; }
    }
    if (active[LAW_INDEXES.TUNNELING]) applyTunneling(view, iBase, 0.5, prng);
    if (active[LAW_INDEXES.DECOHERENCE]) {
      const decForce = applyDecoherence(view, iBase, 0.1);
      if (decForce) { ax += decForce.ax; ay += decForce.ay; az += decForce.az; }
    }
    if (active[LAW_INDEXES.WAVE_PARTICLE]) {
      const wpForce = applyWaveParticle(view, iBase, 0.1);
      if (wpForce) { ax += wpForce.ax; ay += wpForce.ay; az += wpForce.az; }
    }
    if (active[LAW_INDEXES.UNCERTAINTY]) {
      const uncForce = applyUncertainty(view, iBase, 0.1, prng);
      if (uncForce) { ax += uncForce.ax; ay += uncForce.ay; az += uncForce.az; }
    }
    if (active[LAW_INDEXES.TELEPORT]) applyTeleport(view, iBase, 0.5, prng);
    if (active[LAW_INDEXES.PLANCK]) applyPlanck(view, iBase, 0.5);
    if (active[LAW_INDEXES.SPIN]) {
      const spinForce = applySpin(view, iBase, 0.05, prng);
      if (spinForce) { ax += spinForce.ax; ay += spinForce.ay; az += spinForce.az; }
    }
    if (active[LAW_INDEXES.SPECTRAL]) applySpectral(view, iBase, 0.5);
    if (active[LAW_INDEXES.WAVEFUNCTION]) applyWavefunction(view, iBase, 0.5);
    if (active[LAW_INDEXES.HYPERPLANE]) {
      const hypForce = applyHyperplane(view, iBase, 1.0);
      if (hypForce) { ax += hypForce.ax; ay += hypForce.ay; az += hypForce.az; }
    }

    // Per-particle laws may mutate position in-place (TUNNELING, UNCERTAINTY,
    // TELEPORT, WAVEFUNCTION); fold those changes into the local position so
    // later phases and the final writeback see them — while keeping the
    // collision/softbody push captured above.
    px = view[iBase + S.POS_X] + softbodyDX;
    py = view[iBase + S.POS_Y] + softbodyDY;
    pz = view[iBase + S.POS_Z] + softbodyDZ;

    // ── New law types (per-particle) ──

    // Entanglement — correlated link lifecycle only (no-signaling): no forces,
    // no signal relay; the pair's shared phase decoheres and collapses on both
    // sides when a partner dies or the correlation expires.
    if (active[LAW_INDEXES.ENTANGLEMENT]) {
      applyEntanglement(iBase);
    }

    // History — write presence into the spatial memory field, then drift
    // along the local memory-field gradient (archaeology as a force).
    // ── Field system — advance the medium once per solve ──
  // Ambient seeding toward the FIELD_* sliders + diffusion/decay + advection.
  if (fieldsOn) {
    advanceFields(fieldSystem, dt, WP);
  }

  if (active[LAW_INDEXES.HISTORY]) {
      applyHistoryWrite(iBase, px, py, pz, worldSize);
      const histForce = applyHistoryForce(iBase, px, py, pz, worldSize, 0.8 * syn[LAW_INDEXES.HISTORY]);
      if (histForce) {
        ax += histForce.ax;
        ay += histForce.ay;
        az += histForce.az;
      }
    }

    // ── Field system (v8.2 E.1): ambient medium forces ──
    // Vector fields (WIND/EM) push along their flow; scalar fields
    // (THERMAL/INFO) push down-gradient; gravity wells pull radially.
    if (fieldsOn) {
      const ff = sampleFieldForces(fieldSystem, px, py, pz, WP);
      ax += ff.ax;
      ay += ff.ay;
      az += ff.az;
      const wf = wellForce(fieldSystem, px, py, pz, WP);
      ax += wf.ax;
      ay += wf.ay;
      az += wf.az;
    }

    // ── Drag ──

    if (active[LAW_INDEXES.DRAG]) {
      const viscosity = (dnaI[DNA_INDEXES.VISCOSITY] || 0.98) * (Number.isFinite(WP.VISCOSITY) ? WP.VISCOSITY : 1);
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
    if (active[LAW_INDEXES.ENTR]) {
      const jitter = (dnaI[DNA_INDEXES.JITTER] || 0.05) * (Number.isFinite(WP.ENTROPY) ? WP.ENTROPY : 1);
      const jitterMult = syn[LAW_INDEXES.ENTR];
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
    // Laws that wrote velocity deltas directly to the buffer during force
    // accumulation (CHAOS, DIMENSIONALITY, thermal currents) must be folded
    // into the local velocity before integration.
    vx = view[iBase + S.VEL_X];
    vy = view[iBase + S.VEL_Y];
    vz = view[iBase + S.VEL_Z];
    vx += (ax * localTimeStep * invMass) / inertia;
    vy += (ay * localTimeStep * invMass) / inertia;
    vz += (az * localTimeStep * invMass) / inertia;

    // Will — self-propulsion (applies boost along current velocity)
    const preWillVx = view[iBase + S.VEL_X];
    const preWillVy = view[iBase + S.VEL_Y];
    const preWillVz = view[iBase + S.VEL_Z];
    applyWill(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.WILL]);
    // Fold Will's in-place boost into the local velocity copy.
    vx += view[iBase + S.VEL_X] - preWillVx;
    vy += view[iBase + S.VEL_Y] - preWillVy;
    vz += view[iBase + S.VEL_Z] - preWillVz;

    // ── Global drag multiplier (goal-engine tunable) — gated by DRAG ──

    if (active[LAW_INDEXES.DRAG]) {
      vx *= runtimeConfig.dragMultiplier;
      vy *= runtimeConfig.dragMultiplier;
      vz *= runtimeConfig.dragMultiplier;
    }

    // ── World params: WIND (constant +X drift) + DAMPING (global decay) ──

    const worldDamp = Math.pow(1 - (Number.isFinite(WP.DAMPING) ? WP.DAMPING : 0) / 100, localTimeStep);
    if (worldDamp !== 1) {
      vx *= worldDamp;
      vy *= worldDamp;
      vz *= worldDamp;
    }
    if (WP.WIND) vx += WP.WIND * 0.5 * localTimeStep;

    // ── TORQUE DNA: rotational momentum — gently rotate the velocity vector
    //    around the Z axis (higher |TORQUE| = faster spin; sign = direction) ──
    const torque = dnaI[DNA_INDEXES.TORQUE] || 0;
    if (Math.abs(torque) > 0.001) {
      const ang = torque * 0.02 * localTimeStep;
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      const tvx = vx * c - vy * s;
      const tvy = vx * s + vy * c;
      vx = tvx;
      vy = tvy;
    }

    // ── Integration: position ──

    px += vx * localTimeStep;
    py += vy * localTimeStep;
    pz += vz * localTimeStep;

    // ── Velocity clamping ──
    // Runs AFTER the position step so wall-bounce velocities (set in the soft-
    // wall block below, e.g. WALL_REFLECT 2 → 200% bounce) get to move the
    // particle for one tick before the hard MAX_VELOCITY cap reins them in.

    const dnaMaxVel = dnaI[DNA_INDEXES.MAX_VELOCITY] || MAX_VELOCITY;
    const velLimit = Math.min(dnaMaxVel, MAX_VELOCITY);
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    if (speed > velLimit) {
      const vScale = velLimit / speed;
      vx *= vScale;
      vy *= vScale;
      vz *= vScale;
    }

    // ── Toroidal wrapping ──

    if (active[LAW_INDEXES.WRAP]) {
      px = ((px % worldSize) + worldSize) % worldSize;
      py = ((py % worldSize) + worldSize) % worldSize;
      pz = ((pz % worldSize) + worldSize) % worldSize;
    } else {
      // Clamp to world bounds (soft wall). WALL_REFLECT slider: 0 = 100%
      // absorption, 1 = 100% reflect (default), 2 = 200% reflect.
      const wallReflect = Number.isFinite(WP.WALL_REFLECT) ? WP.WALL_REFLECT : 1;
      if (px < 0) { px = 0; vx = Math.abs(vx) * wallReflect; }
      else if (px >= worldSize) { px = worldSize - 0.01; vx = -Math.abs(vx) * wallReflect; }
      if (py < 0) { py = 0; vy = Math.abs(vy) * wallReflect; }
      else if (py >= worldSize) { py = worldSize - 0.01; vy = -Math.abs(vy) * wallReflect; }
      if (pz < 0) { pz = 0; vz = Math.abs(vz) * wallReflect; }
      else if (pz >= worldSize) { pz = worldSize - 0.01; vz = -Math.abs(vz) * wallReflect; }
    }

    // ── Field medium: portals + hard walls (v8.2 E.1) ──
    // Portals teleport matter between paired cells (ambient feature - any
    // law on). Walls are impassable only while the COLL law (the hard-matter
    // toggle) is on; ghost laws (TUNNELING / TELEPORT / ASTRAL) pass through.
    // The response is velocity-only: push out of the wall cell and reflect
    // the velocity component pointing into it.
    if (fieldsOn && fieldSystem.portals.length > 0) {
      const dest = portalAt(fieldSystem, px, py, pz);
      if (dest) {
        px = dest.x;
        py = dest.y;
        pz = dest.z;
      }
    }
    if (
      active[LAW_INDEXES.COLL] &&
      fieldsOn &&
      fieldSystem.hasWalls &&
      !(active[LAW_INDEXES.TUNNELING] || active[LAW_INDEXES.TELEPORT] || active[LAW_INDEXES.ASTRAL])
    ) {
      const w = resolveWall(fieldSystem, px, py, pz, vx, vy, vz);
      px = w.px;
      py = w.py;
      pz = w.pz;
      vx = w.vx;
      vy = w.vy;
      vz = w.vz;
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
    if (active[LAW_INDEXES.BOND] || active[LAW_INDEXES.POLYMER]) {
      const nCount2 = getNeighbors(grid, px, py, pz, worldSize, nb, neighborCap);
      for (let n2 = 0; n2 < Math.min(nCount2, maxInteractions); n2++) {
        const bj = nb[n2];
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
        if (active[LAW_INDEXES.BOND]) {
          const sI = view[iBase + S.SPECIES_ID];
          const sB = view[bPtr + S.SPECIES_ID];
          const aff = dnaI[DNA_INDEXES.SPECIES_AFFINITY] || 0;
          if ((sI === sB && aff >= 0) || (sI !== sB && aff < 0)) {
            // BOND_ANGLE DNA (31): favoured cluster geometry — wider angles
            // reach farther, so the equilibrium bond distance stretches.
            const bondAngle = dnaI[DNA_INDEXES.BOND_ANGLE] || 0;
            const angleScale = 1 + Math.min(1, Math.abs(bondAngle) / 120);
            const eqDist = ((dnaI[DNA_INDEXES.BASE_RADIUS] || 5) * 2.5 + (view[bPtr + S.DNA_CACHE_START + DNA_INDEXES.BASE_RADIUS] || 5) * 2.5) * angleScale;
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
    // Laws may have modified particle mass in-place during the pair loop
    // (ALLOY fusion, accretion, chemistry mass transfer); fold the buffer
    // value back into the local copy so the writeback and radius update
    // reflect it.
    mass = view[iBase + S.MASS];
    view[iBase + S.MASS] = mass;
    // Age is the particle's own time coordinate (frame count since birth),
    // advanced here so oscillator phases and lifecycle gating progress with
    // or without the LIFE law. Frozen entirely when no laws are active.
    view[iBase + S.AGE] = (view[iBase + S.AGE] || 0) + localTimeStep;

    // ── Signal decay (emission + decay, gated by COMMS law) ──

    if (active[LAW_INDEXES.COMMS]) {
      applySignalDecay(lawState, view, iBase, dnaI, localTimeStep);
    }

    // ── Life cycle ──

    applyLifeCycle(lawState, view, iBase, dnaI, localTimeStep, prng,
      syn[LAW_INDEXES.LIFE] * runtimeConfig.deathRate, dnaBuffer);

    // ── Glow ──
    applyGlowEffect(lawState, view, iBase, dnaI, localTimeStep,
      syn[LAW_INDEXES.GLOW]);

    // ── Genotype ──
    applyGenotypeMutation(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.GENOTYPE], prng, dnaBuffer);

    // ── Radiation ──
    applyRadiationDamage(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.RADIATION], prng);

    // ── Phenotype ──
    applyPhenotype(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.PHENOTYPE]);

    // ── Oxidation ──
    applyOxidationEffect(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.OXIDATION]);

    // ── Isomerization ──
    applyIsomerization(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.ISOMERIZATION], prng, stride);

    // ── Phase Radiation ──
    applyPhaseRadiation(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.PHASE_RADIATION]);

    // ── Sublimation ──
    applySublimation(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.SUBLIMATION], prng);

    // ── Thermal jitter (HEAT) ──

    applyThermalJitter(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.HEAT], prng);

    // ── Cold damping (COLD) ──

    applyColdDamping(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.COLD]);

    // ── Convection ──

    applyConvection(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.CONVECTION]);

    // ── Reproduction ──

    const offspring = applyReproduction(lawState, view, iBase, dnaI, prng,
      syn[LAW_INDEXES.REPRO] * runtimeConfig.birthRate, dnaBuffer, localTimeStep);
    if (offspring) {
      _offspringRing[_ringWrite] = offspring;
      _ringWrite = (_ringWrite + 1) % OFFSPRING_RING_SIZE;
    }

    // ── Update radius from mass ──

    const baseRadius = dnaI[DNA_INDEXES.BASE_RADIUS] || 2.0;
    let radiusOut = baseRadius * Math.pow(mass, 0.333);
    if (active[LAW_INDEXES.PHENOTYPE]) {
      const energy = view[iBase + S.ENERGY];
      if (Number.isFinite(energy)) {
        radiusOut *= 1 + (energy / 200 - 0.5) * 0.5 * syn[LAW_INDEXES.PHENOTYPE];
      }
    }
    view[iBase + S.RADIUS] = radiusOut;

    // ── Expansion (runs after the mass-derived radius update so its growth
    //    toward the DNA base radius is not overwritten) ──
    if (active[LAW_INDEXES.EXPANSION]) applyExpansion(view, iBase, 0.1);

    // ── Melt ──
    applyMelt(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.MELT], dnaBuffer);

    // ── Boil ──
    applyBoil(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.BOIL], prng);

    // ── Condense ──
    applyCondense(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.CONDENSE]);

    // ── Deposit ──
    applyDeposit(lawState, view, iBase, localTimeStep,
      syn[LAW_INDEXES.DEPOSIT]);

    // ── Exothermic ──
    applyExothermic(lawState, view, iBase,
      localTimeStep, syn[LAW_INDEXES.EXOTHERMIC]);

  }

  // ── History — advance the memory-field clock once per solve ──
  if (active[LAW_INDEXES.HISTORY]) {
    applyHistoryCalc();
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
