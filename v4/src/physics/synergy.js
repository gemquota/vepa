// ============================================================================
// VEPA v3 — Law Synergy Computation
// When multiple laws are active simultaneously, they modify each other's
// effects through multiplier synergies. Returns a multiplier in [0.0, 2.0].
// ============================================================================

import { LAW_INDEXES } from '../constants.js';
import { isSet } from '../state/lawState.js';

/**
 * Compute the synergy multiplier for a given law based on which
 * other laws are currently active.
 *
 * @param {{ lowFlags: Uint32Array, highFlags: Uint32Array }} lawState
 * @param {number} lawIndex - The law to compute synergy for
 * @returns {number} Multiplier in [0.0, 2.0]
 */
export function computeSynergy(lawState, lawIndex) {
  let mult = 1.0;

  // ── Physics synergies ──

  // GRAV + PLANETARY → gravitational strength ×1.5
  if (lawIndex === LAW_INDEXES.GRAV && isSet(lawState, LAW_INDEXES.PLANETARY)) {
    mult *= 1.5;
  }
  if (lawIndex === LAW_INDEXES.PLANETARY && isSet(lawState, LAW_INDEXES.GRAV)) {
    mult *= 1.5;
  }

  // COLL + ACCR → accretion bonus ×1.2
  if (lawIndex === LAW_INDEXES.ACCR && isSet(lawState, LAW_INDEXES.COLL)) {
    mult *= 1.2;
  }

  // ── Biology synergies ──

  // LIFE + REPRO + ENERGY → biological efficiency ×1.3
  // (only fires when all three are active)
  if (
    lawIndex === LAW_INDEXES.LIFE ||
    lawIndex === LAW_INDEXES.REPRO ||
    lawIndex === LAW_INDEXES.ENERGY
  ) {
    if (
      isSet(lawState, LAW_INDEXES.LIFE) &&
      isSet(lawState, LAW_INDEXES.REPRO) &&
      isSet(lawState, LAW_INDEXES.ENERGY)
    ) {
      mult *= 1.3;
    }
  }

  // GLOW + SIGNAL → signal propagation ×1.5
  if (lawIndex === LAW_INDEXES.GLOW && isSet(lawState, LAW_INDEXES.TRACK)) {
    mult *= 1.5;
  }
  if (lawIndex === LAW_INDEXES.TRACK && isSet(lawState, LAW_INDEXES.GLOW)) {
    mult *= 1.5;
  }

  // ── Chemistry synergies ──

  // CATALYSIS + SOLVATION + ACIDITY → chemical reaction rate ×2.0
  if (
    lawIndex === LAW_INDEXES.CATALYSIS_LAW ||
    lawIndex === LAW_INDEXES.SOLVATION ||
    lawIndex === LAW_INDEXES.ACIDITY
  ) {
    if (
      isSet(lawState, LAW_INDEXES.CATALYSIS_LAW) &&
      isSet(lawState, LAW_INDEXES.SOLVATION) &&
      isSet(lawState, LAW_INDEXES.ACIDITY)
    ) {
      mult *= 2.0;
    }
  }

  // ── Thermodynamics synergies ──

  // HEAT + COLD → cancel each other (×0.5 each)
  if (lawIndex === LAW_INDEXES.HEAT && isSet(lawState, LAW_INDEXES.COLD)) {
    mult *= 0.5;
  }
  if (lawIndex === LAW_INDEXES.COLD && isSet(lawState, LAW_INDEXES.HEAT)) {
    mult *= 0.5;
  }

  // ── Metaphysics synergies ──

  // CHAOS + ORDER → cancel each other (×0.3 each)
  if (lawIndex === LAW_INDEXES.CHAOS && isSet(lawState, LAW_INDEXES.ORDER)) {
    mult *= 0.3;
  }
  if (lawIndex === LAW_INDEXES.ORDER && isSet(lawState, LAW_INDEXES.CHAOS)) {
    mult *= 0.3;
  }

  // FATE + WILL → metaphysical power ×1.8
  if (lawIndex === LAW_INDEXES.FATE && isSet(lawState, LAW_INDEXES.WILL)) {
    mult *= 1.8;
  }
  if (lawIndex === LAW_INDEXES.WILL && isSet(lawState, LAW_INDEXES.FATE)) {
    mult *= 1.8;
  }

  // Clamp to [0.0, 2.0]
  if (mult < 0.0) mult = 0.0;
  if (mult > 2.0) mult = 2.0;

  return mult;
}
