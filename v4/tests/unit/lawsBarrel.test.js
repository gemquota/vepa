import { describe, it, expect } from 'vitest';
import * as laws from '../../src/physics/laws.js';

// The exact import surface the solver consumes from './laws.js'. This list
// locks the barrel contract so the ongoing extraction of laws.js into the
// lawgroup modules can never silently drop a name the solver depends on.
const SOLVER_LAW_SURFACE = [
  // physics
  'applyGravity', 'applyCollision', 'applyAccretion', 'applyPlanetary',
  // lifecycle / biology
  'applyLifeCycle', 'applyReproduction', 'applyPredation', 'applySignalDecay',
  'applyAffinity', 'applyGenotypeMutation', 'applyPhenotype', 'applyTrackingBehavior',
  // chemistry
  'applyChemistry', 'applyPolymer', 'applyReduction', 'applyAlloy',
  'applySolvation', 'applySolvationEffect', 'applyAcidityEffect', 'applyOxidationEffect',
  'applyIsomerization', 'applyChirality', 'applyCrystallization', 'applyPhaseRadiation',
  'applySublimation', 'applyGlowEffect', 'applyEnergyTransfer', 'applyRadiationDamage',
  // thermo (migrated to lawgroups/thermoLaws.js)
  'applyHeatTransfer', 'applyThermalJitter', 'applyColdDamping', 'applyConvection',
  'applyMelt', 'applyBoil', 'applyCondense', 'applyDeposit', 'applyExothermic',
  // em (migrated to lawgroups/emLaws.js)
  'applyChargeForce', 'applyFieldDrift', 'applyCurrentTransfer', 'applyResistance',
  'applyCapacitanceStore', 'applyStoredChargeForce', 'applyInductance', 'applyMagneticForce',
  'applyResonanceForce', 'applyFluxForce', 'applyIonization', 'applyDischarge',
  'applyPlasma', 'applySuperconductivity',
  // meta / quantum
  'applyTimeDilation', 'applyDimensionality', 'applyChaos', 'applyOrder', 'applyFate',
  'applyWill', 'applySoul', 'applySoulDecay', 'applyMind', 'applyVoid', 'applyBond',
  'applyTelepathy', 'applyClairvoyance', 'applyPrecognition', 'applyAstral',
  'applyAstralInfluence', 'applyEntanglePair', 'applyEntanglement',
  // info
  'applyMemoryRefresh', 'applyMemoryDecay', 'applyPatternForce', 'applyTrailWrite',
  'applyStigmergyForce', 'applySignalBoost', 'applyLearnAlign', 'applySymbolForce',
  'applyMetricForce', 'applyPredictForce', 'applyCodeBlend', 'applyProtocolSync',
  'applyFeedback', 'applyLanguage', 'applyCulture', 'applySingularityForce',
  'applySingularityAbsorb', 'applySignalExchange',
  // history + shared state (migrated to lawsState.js)
  'applyHistoryWrite', 'applyHistoryForce', 'applyHistoryCalc', 'setBuffer',
  'advanceFateClock',
];

describe('laws.js barrel surface', () => {
  it('exposes every solver-imported law as a function', () => {
    const missing = [];
    const notFunction = [];
    for (const name of SOLVER_LAW_SURFACE) {
      if (!(name in laws)) missing.push(name);
      else if (typeof laws[name] !== 'function') notFunction.push(name);
    }
    expect(missing, `missing from barrel: ${missing.join(', ')}`).toEqual([]);
    expect(notFunction, `not functions: ${notFunction.join(', ')}`).toEqual([]);
  });

  it('still exposes the full legacy export surface (migrated names re-exported)', () => {
    // Spot-check the names migrated to lawgroup modules this cycle.
    for (const name of [
      'applyHeat', 'applyCold', 'applyMelt', 'applyBoil', 'applyCondense',
      'applyDeposit', 'applyExothermic', 'applyChargeForce', 'applyPlasma',
      'applySuperconductivity', 'applyHistoryWrite', 'applyHistoryCalc', 'applyHistoryForce',
    ]) {
      expect(typeof laws[name], name).toBe('function');
    }
  });

  it('does not grow unboundedly (barrel is a stable contract)', () => {
    const exported = Object.keys(laws);
    expect(exported.length).toBeGreaterThan(SOLVER_LAW_SURFACE.length);
  });
});
