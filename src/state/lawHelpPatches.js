/**
 * VEPA4 — LAW_HELP_DB patches (v8.0.0 "Matter & Union")
 *
 * The ACCR and ALLOY semantics changed in v8.0.0 (true merger instead of
 * gradual dissolution; mass-weighted colour blends). These four-tier entries
 * supersede the ACCR/ALLOY entries in src/constants.js; tooltip.js merges
 * them over the static table at load time.
 *
 *   MERGE  (ACCR / ALLOY)   — the pair becomes ONE body: combined mass
 *                             (× FUSION efficiency), centre-of-mass position,
 *                             momentum-conserving velocity, mass-weighted
 *                             colour (+ energy). ALLOY also mass-averages DNA.
 *   ATTACH (BOND / POLYMER)  — molecules stay as two separate attached orbs;
 *                             bonded pairs never merge.
 */

export const LAW_HELP_PATCHES = {
  ACCR: {
    hint: 'Accretion: overlapping bodies merge into one.',
    explanation:
      'When the fusion gate passes — FUSION_MOMENTUM DNA (minimum relative momentum to fuse on impact) or FUSION_TIME DNA (seconds of continuous close contact for slower pairs) — the pair collapses into a single body: combined mass (× FUSION DNA efficiency), centre-of-mass position, momentum-conserving velocity, and mass-weighted colour. Bonded pairs (BOND / POLYMER) are molecules and never accrete — they stay as separate attached orbs.',
    system:
      'True merger (v8.0.0): the survivor keeps its slot with MASS = (m1+m2)·(0.5+FUSION), colour and energy mass-weighted; the neighbour is marked DEAD. Proximity dwell is tracked per pair (PARTNER_ID / MITOSIS_TIMER) and resets when contact breaks. STOICHIOMETRY forces an exact merger (efficiency 1.0). Stars absorb whole bodies.',
    advanced:
      'Replaces the pre-8.0 gradual dissolution (≈4% mass per frame until the smaller body died). Momentum, centre-of-mass position and weighted colour are exact; total mass may shift by FUSION efficiency unless STOICHIOMETRY is active. Shares the mergeParticles core with ALLOY — see src/physics/mergePhysics.js.',
  },
  ALLOY: {
    hint: 'Alloying: different-species particles fuse into composites.',
    explanation:
      'Confirmed batch-11 (real-life behavior) + v8.0.0: two different-species particles that overlap dissolve into one homogeneous composite — full mass merge, per-particle DNA averaged (mass-weighted), colour blended (mass-weighted — the heavier partner dominates). The survivor keeps its species slot but behaves as the mix. Bonded pairs stay as separate attached orbs and never alloy.',
    system:
      'Overlap dist < (r1+r2)·0.5: MASS = m1+m2, DNA_CACHE = mass-weighted average of both, colours mass-weighted, j is marked DEAD. Bonded pairs are excluded. Gated by ALLOY.',
    advanced:
      'The colour blend was upgraded from a flat 50/50 average to a mass-weighted average in v8.0.0. Shares the mergeParticles core with ACCR — see src/physics/mergePhysics.js.',
  },
};
