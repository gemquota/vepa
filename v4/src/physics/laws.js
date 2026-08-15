// ============================================================================
// VEPA v4 — Law Barrel
// Every law implementation now lives in `src/physics/lawgroups/*.js` (or
// `lawsState.js` for shared law state/helpers); this module re-exports every
// name the solver and the test suites import from './laws.js', so the import
// surface is stable while the extraction continues.
//
// Convention (kept from the original laws.js):
//   p1Ptr = subject particle base offset (index * stride)
//   p2Ptr = neighbor particle base offset (index * stride)
//   stride = PARTICLE_STRIDE (100)
//   DNA values accessed via: buffer[p1Ptr + DNA_CACHE_START + DNA_INDEX]
// ============================================================================

// Shared law state & helpers (lawsState.js)
export { setBuffer, advanceFateClock, getFateTime } from './lawsState.js';
export { applyHistoryWrite, applyHistoryCalc, applyHistoryForce } from './lawsState.js';

// Physics (Blue)
export {
  applyGravity,        // GRAV=0
  applyDrag,           // DRAG=1
  applyEntropy,        // ENTR=2
  applyCollision,      // COLL=4
  applyAccretion,      // ACCR=5
  applyPlanetary,      // PLANETARY=6
  applyVoid,           // VOID=38
  applyBond,           // BOND=39
  applySingularityForce,  // SINGULARITY=79
  applySingularityAbsorb, // SINGULARITY=79
} from './lawgroups/physicsLaws.js';

// Biology (Green)
export {
  applyTracking,       // TRACK=11
  applyPredation,      // PREDATION=51
  applyGenotype,       // GENOTYPE=15
  applyLifeCycle,      // LIFE=7
  applyAffinity,       // AFFINITY=9
  applyReproduction,   // REPRO=10
  applyGlowEffect,     // GLOW=8
  applyEnergyTransfer, // ENERGY=13
  applyRadiationDamage,  // RADIATION=14
  applyTrackingBehavior, // TRACK=11
  applyGenotypeMutation, // GENOTYPE=15
  applyPhenotype,      // PHENOTYPE=16
} from './lawgroups/biologyLaws.js';

// Chemistry (Purple)
export {
  applySolvation,      // SOLVATION=18
  applyPolymerization, // legacy bond-grow variant
  applyAcidity,        // ACIDITY=19
  applyOxidation,      // OXIDATION=20
  applyChemistry,      // CATALYSIS_LAW=17 modifier
  applyPolymer,        // POLYMER=21
  applyReduction,      // REDUCTION=40
  applyAlloy,          // ALLOY=41
  applySolvationEffect,  // SOLVATION=18
  applyAcidityEffect,    // ACIDITY=19
  applyOxidationEffect,  // OXIDATION=20
  applyIsomerization,    // ISOMERIZATION=22
  applyChirality,        // CHIRALITY=23
  applyCrystallization,  // CRYSTALLIZATION=24
} from './lawgroups/chemistryLaws.js';

// Thermodynamics (Orange)
export {
  applyHeat,           // HEAT=25
  applyCold,           // COLD=26
  applyHeatTransfer,   // HEAT=25 / COLD=26
  applyThermalJitter,  // HEAT=25
  applyColdDamping,    // COLD=26
  applyConvection,     // CONVECTION=27
  applyMelt,           // MELT=42
  applyBoil,           // BOIL=43
  applyCondense,       // CONDENSE=44
  applyDeposit,        // DEPOSIT=45
  applyExothermic,     // EXOTHERMIC=46
  applyPhaseRadiation, // PHASE_RADIATION=28
  applySublimation,    // SUBLIMATION=29
} from './lawgroups/thermoLaws.js';

// Metaphysics (Red)
export {
  applyTimeDilation,   // TIME_DILATION=30
  applyDimensionality, // DIMENSIONALITY=31
  applyChaos,          // CHAOS=32
  applyOrder,          // ORDER=33
  applyFate,           // FATE=34
  applyWill,           // WILL=35
  applySoul,           // SOUL_LAW=36
  applySoulDecay,      // SOUL_LAW=36
  applyMind,           // MIND=37
  applyTelepathy,      // TELEPATHY=47
  applyClairvoyance,   // CLAIRVOYANCE=48
  applyPrecognition,   // PRECOGNITION=49
  applyAstral,         // ASTRAL=50
  applyAstralInfluence, // ASTRAL=50
} from './lawgroups/metaLaws.js';

// Electromagnetism (Cyan)
export {
  applyChargeForce,       // CHARGE_LAW=53
  applyFieldDrift,        // FIELD=54
  applyCurrentTransfer,   // CURRENT=55
  applyResistance,        // RESISTANCE=56
  applyCapacitanceStore,  // CAPACITANCE=57
  applyStoredChargeForce, // CAPACITANCE=57
  applyInductance,        // INDUCTANCE=58
  applyMagneticForce,     // MAGNETISM=59
  applyResonanceForce,    // RESONANCE=60
  applyFluxForce,         // FLUX=61
  applyIonization,        // IONIZATION=62
  applyDischarge,         // DISCHARGE=63
  applyPlasma,            // PLASMA=64
  applySuperconductivity, // SUPERCONDUCTIVITY=65
} from './lawgroups/emLaws.js';

// Information (Gold)
export {
  applySignalDecay,    // COMMS=52
  applySignalExchange, // COMMS=52
  applyMemoryRefresh,  // MEMORY=66
  applyMemoryDecay,    // MEMORY=66
  applyPatternForce,   // PATTERN=67
  applyTrailWrite,     // STIGMERGY=68
  applyStigmergyForce, // STIGMERGY=68
  applySignalBoost,    // SIGNAL_BOOST=69
  applyLearnAlign,     // LEARN=70
  applySymbolForce,    // SYMBOL=71
  applyMetricForce,    // METRIC=72
  applyPredictForce,   // PREDICT=73
  applyCodeBlend,      // CODE=74
  applyProtocolSync,   // PROTOCOL=75
  applyFeedback,       // FEEDBACK=76
  applyLanguage,       // LANGUAGE=77
  applyCulture,        // CULTURE=78
} from './lawgroups/infoLaws.js';

// Quantum (indices 112-127)
export {
  applyEntanglePair,   // ENTANGLEMENT=80
  applyEntanglement,   // ENTANGLEMENT=80
} from './lawgroups/quantumLaws.js';
