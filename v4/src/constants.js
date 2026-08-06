// ============================================================================
// VEPA v3 — Core Constants
// Single Source of Truth for stride layout, DNA parameters, law indexes,
// category mappings, DNA ranges, and world configuration defaults.
// ============================================================================

// --- Global Simulation Constants ---

export const PARTICLE_STRIDE = 100;
export const DEFAULT_DNA_STRIDE = 64;
export const DNA_PACK_MAX = 65535;
export const MAX_SPECIES = 64;
export const MAX_PARTICLES = 2500;
export const STAR_MASS = 12;   // mass threshold for gravitational collapse (star)
export const DEFAULT_PARTICLES_PER_SPECIES = 250;
export const WORLD_SIZE = 2000;

// --- Particle Stride Layout (100 floats per particle) ---

export const STRIDE_INDEXES = {
  POS_X:          0,
  POS_Y:          1,
  POS_Z:          2,
  VEL_X:          3,
  VEL_Y:          4,
  VEL_Z:          5,
  MASS:           6,
  SPECIES_ID:     7,
  DNA_CACHE_START: 8,
  DNA_CACHE_END:  49,   // 8 + 42 = 50, so indices 8..49 hold 42 DNA values
  ENERGY:         50,
  AGE:            51,
  DEAD:           52,
  COLOR_R:        53,
  COLOR_G:        54,
  COLOR_B:        55,
  RADIUS:         56,
  SIGNAL:         57,
  BOND_COUNT:     58,
  BOND_PARTNER_1: 59,
  BOND_PARTNER_2: 60,
  MEMORY:         61,
  HUNGER:         62,
  ARMOR:          63,
  MITOSIS_TIMER:  64,
  PARTNER_ID:     65,
  TEMPERATURE:    66,
  CHARGE:         67,
  PHASE_1:        68,
  PHASE_2:        69,
  SOUL:           70,
  TRAIL_X:        71,
  TRAIL_Y:        72,
  TRAIL_Z:        73,
  ALPHA:          74,
  ENTANGLE_ID:    75,
  ENTANGLE_PHASE: 76,
  // ── Multi-energy architecture (batch 03) ──
  // ENERGY (50) stays the LIFE/metabolic pool; SIGNAL (57) is signal
  // transmission strength. These additional reservoirs keep other energy
  // kinds from colliding with metabolism:
  ELECTRIC_ENERGY: 77, // electrical potential energy (EM laws, batches 14-20)
  STORED_ENERGY:   78, // general reserve pool (capacitance / fusion storage)
  REPRO_DRIVE:     79, // reproductive drive meter (REPRO law gate)
  RADIATION_EXPOSURE: 80, // accumulated radiation dose (RADIATION law; ramps mutation)
  // ── Polymer chain expansion (batch 06) ──
  // BOND_PARTNER_1/2 (59/60) plus these four slots give the documented
  // "max 6 bonds per particle" for POLYMER chains. Added at the tail so
  // existing stride offsets (persisted saves, workers) stay stable.
  BOND_PARTNER_3:     81,
  BOND_PARTNER_4:     82,
  BOND_PARTNER_5:     83,
  BOND_PARTNER_6:     84,
};

// --- DNA Indexes (42 parameters) ---

export const DNA_INDEXES = {
  FORCE:              0,
  VISCOSITY:          1,
  TORQUE:             2,
  JITTER:             3,
  POLARITY:           4,
  ALPHA:              5,
  SYMMETRY:           6,
  HIDDEN_MASS:        7,
  STIFFNESS:          8,
  FUSION:             9,
  BIRTH_RATE:         10,
  DEATH_RATE:         11,
  MUTATION:           12,
  SIGNAL_RESP:        13,
  PULSE_RATE:         14,
  TIDAL:              15,
  FUSION_MOMENTUM:    16,
  FUSION_TIME:        17,
  NEIGHBORHOOD_RADIUS: 18,
  SIGNAL_STRENGTH:    19,
  SIGNAL_DECAY:       20,
  PROPAGATION_SPEED:  21,
  TUNING_CH1:         22,
  TUNING_CH2:         23,
  TUNING_CH3:         24,
  TUNING_CH4:         25,
  INERTIA:            26,
  FRICTION:           27,
  MAX_VELOCITY:       28,
  BASE_RADIUS:        29,
  ELASTICITY:         30,
  BOND_ANGLE:         31,
  CONDUCTIVITY:       32,
  MAGNETIC_MOMENT:    33,
  ENERGY_EFFICIENCY:  34,
  SEX_CHANCE:         35,
  PREDATION_BIAS:     36,
  REACTION_THRESHOLD: 37,
  CATALYSIS:          38,
  HEAT_OUTPUT:        39,
  MEMORY_DECAY:       40,
  SPECIES_AFFINITY:   41,
  DOMINANCE:          42,
  CROSSOVER_RATE:     43,
  EPIGENETIC_DRIFT:   44,
  HETEROZYGOSITY:     45,
  GENE_FLOW:          46,
  REPRESSOR:          47,
  // ── Genetics & regulatory expansion (batch: DNA 64) — indices 48-63 ──
  // Genome-only params: stored in the 64×64 species DNA buffer, read on
  // demand via readSpeciesDNAParam (never cached in the particle stride).
  ALLELE_COUNT:       48,
  EPIGENETIC_RATE:    49,
  HGT_RATE:           50,
  REPAIR_EFFICIENCY:  51,
  DRIFT_RATE:         52,
  SELECTION_SENSITIVITY: 53,
  SPECIATION_THRESHOLD:  54,
  ADAPTATION_RATE:    55,
  TRANSPOSON_RATE:    56,
  GENE_SILENCING:     57,
  RECOMBINATION_BIAS: 58,
  MUTAGEN_SENSITIVITY: 59,
  TELOMERE_LENGTH:    60,
  PLOIDY_LEVEL:       61,
  CODON_BIAS:         62,
  REGULATORY_DEPTH:   63,
};

export const DNA_COUNT = 64;

// --- Human-readable names for each DNA index ---

export const DNA_META = [
  'Force',
  'Viscosity',
  'Torque',
  'Jitter',
  'Polarity',
  'Alpha',
  'Symmetry',
  'Hidden Mass',
  'Stiffness',
  'Fusion',
  'Birth Rate',
  'Death Rate',
  'Mutation',
  'Signal Response',
  'Pulse Rate',
  'Tidal',
  'Fusion Momentum',
  'Fusion Time',
  'Neighborhood Radius',
  'Signal Strength',
  'Signal Decay',
  'Propagation Speed',
  'Tuning Ch1',
  'Tuning Ch2',
  'Tuning Ch3',
  'Tuning Ch4',
  'Inertia',
  'Friction',
  'Max Velocity',
  'Base Radius',
  'Elasticity',
  'Bond Angle',
  'Conductivity',
  'Magnetic Moment',
  'Energy Efficiency',
  'Sex Chance',
  'Predation Bias',
  'Reaction Threshold',
  'Catalysis',
  'Heat Output',
  'Memory Decay',
  'Species Affinity',
  'Dominance',
  'Crossover Rate',
  'Epigenetic Drift',
  'Heterozygosity',
  'Gene Flow',
  'Repressor',
  'Allele Count',
  'Epigenetic Rate',
  'HGT Rate',
  'Repair Efficiency',
  'Drift Rate',
  'Selection Sensitivity',
  'Speciation Threshold',
  'Adaptation Rate',
  'Transposon Rate',
  'Gene Silencing',
  'Recombination Bias',
  'Mutagen Sensitivity',
  'Telomere Length',
  'Ploidy Level',
  'Codon Bias',
  'Regulatory Depth',
];

// --- DNA Ranges [min, max, default] for each of the 64 parameters ---

export const DNA_RANGES = [
  { min: -100,  max: 100,  default: 1.0    },   // 0  FORCE
  { min: 0.5,   max: 1.0,  default: 0.98   },   // 1  VISCOSITY
  { min: -1,    max: 1,    default: 0       },   // 2  TORQUE
  { min: 0,     max: 5.0,  default: 0.05    },   // 3  JITTER
  { min: -1,    max: 1,    default: 0       },   // 4  POLARITY
  { min: 0,     max: 1,    default: 0.5     },   // 5  ALPHA
  { min: -1,    max: 1,    default: 0       },   // 6  SYMMETRY
  { min: -5,    max: 5,    default: 0       },   // 7  HIDDEN_MASS
  { min: 0.1,   max: 5,    default: 1.0     },   // 8  STIFFNESS
  { min: 0,     max: 1,    default: 0.5     },   // 9  FUSION
  { min: 0,     max: 10,   default: 0.5     },   // 10 BIRTH_RATE
  { min: 0,     max: 10,   default: 0.1     },   // 11 DEATH_RATE
  { min: 0,     max: 10,   default: 0.5     },   // 12 MUTATION
  { min: 0,     max: 2,    default: 1.0     },   // 13 SIGNAL_RESP
  { min: 0,     max: 1,    default: 0.2     },   // 14 PULSE_RATE
  { min: -1,    max: 1,    default: 0       },   // 15 TIDAL
  { min: 0,     max: 50,   default: 1.0     },   // 16 FUSION_MOMENTUM
  { min: 0,     max: 100,  default: 2       },   // 17 FUSION_TIME
  { min: 20,    max: 500,  default: 120     },   // 18 NEIGHBORHOOD_RADIUS
  { min: 0,     max: 1,    default: 0.5     },   // 19 SIGNAL_STRENGTH
  { min: 0.1,   max: 0.99, default: 0.95    },   // 20 SIGNAL_DECAY
  { min: 0.01,  max: 1.0,  default: 0.5     },   // 21 PROPAGATION_SPEED
  { min: 0,     max: 1,    default: 1       },   // 22 TUNING_CH1
  { min: 0,     max: 1,    default: 1       },   // 23 TUNING_CH2
  { min: 0,     max: 1,    default: 1       },   // 24 TUNING_CH3
  { min: 0,     max: 1,    default: 1       },   // 25 TUNING_CH4
  { min: 0.1,   max: 2,    default: 1.0     },   // 26 INERTIA
  { min: 0,     max: 0.1,  default: 0.01    },   // 27 FRICTION
  { min: 1,     max: 50,   default: 20      },   // 28 MAX_VELOCITY
  { min: 0.2,   max: 4,    default: 0.4     },   // 29 BASE_RADIUS
  { min: 0,     max: 1,    default: 0.5     },   // 30 ELASTICITY
  { min: 0,     max: 360,  default: 0       },   // 31 BOND_ANGLE
  { min: 0,     max: 1,    default: 0.1     },   // 32 CONDUCTIVITY
  { min: 0,     max: 1,    default: 0.1     },   // 33 MAGNETIC_MOMENT
  { min: 0,     max: 10,   default: 0.8     },   // 34 ENERGY_EFFICIENCY
  { min: 0,     max: 10,   default: 0.05    },   // 35 SEX_CHANCE
  { min: 0,     max: 20,   default: 0       },   // 36 PREDATION_BIAS
  { min: 10,    max: 1000, default: 500     },   // 37 REACTION_THRESHOLD
  { min: 1,     max: 10,   default: 1.0     },   // 38 CATALYSIS
  { min: 0,     max: 1,    default: 0.1     },   // 39 HEAT_OUTPUT
  { min: 0.9,   max: 1.0,  default: 0.99    },   // 40 MEMORY_DECAY
  { min: -1.0,  max: 1.0,  default: 0.0     },   // 41 SPECIES_AFFINITY
  { min: 0.0,   max: 1.0,  default: 0.5     },   // 42 DOMINANCE
  { min: 0.0,   max: 0.5,  default: 0.1     },   // 43 CROSSOVER_RATE
  { min: 0.0,   max: 0.1,  default: 0.01    },   // 44 EPIGENETIC_DRIFT
  { min: 0.0,   max: 1.0,  default: 0.5     },   // 45 HETEROZYGOSITY
  { min: 0.0,   max: 1.0,  default: 0.2     },   // 46 GENE_FLOW
  { min: -1.0,  max: 1.0,  default: 0.0     },   // 47 REPRESSOR
  { min: 1,     max: 8,    default: 2        },   // 48 ALLELE_COUNT
  { min: 0,     max: 1,    default: 0.1      },   // 49 EPIGENETIC_RATE
  { min: 0,     max: 1,    default: 0.05     },   // 50 HGT_RATE
  { min: 0,     max: 1,    default: 0.5      },   // 51 REPAIR_EFFICIENCY
  { min: 0,     max: 1,    default: 0.1      },   // 52 DRIFT_RATE
  { min: 0,     max: 1,    default: 0.5      },   // 53 SELECTION_SENSITIVITY
  { min: 0,     max: 1,    default: 0.5      },   // 54 SPECIATION_THRESHOLD
  { min: 0,     max: 1,    default: 0.2      },   // 55 ADAPTATION_RATE
  { min: 0,     max: 1,    default: 0.05     },   // 56 TRANSPOSON_RATE
  { min: 0,     max: 1,    default: 0.1      },   // 57 GENE_SILENCING
  { min: -1,    max: 1,    default: 0        },   // 58 RECOMBINATION_BIAS
  { min: 0,     max: 1,    default: 0.5      },   // 59 MUTAGEN_SENSITIVITY
  { min: 0,     max: 1,    default: 0.5      },   // 60 TELOMERE_LENGTH
  { min: 1,     max: 4,    default: 2        },   // 61 PLOIDY_LEVEL
  { min: 0,     max: 1,    default: 0.5      },   // 62 CODON_BIAS
  { min: 1,     max: 10,   default: 3        },   // 63 REGULATORY_DEPTH
];

// --- Law Indexes (64 laws) ---

export const LAW_INDEXES = {
  // Physics (Blue) — indices 0-6
  GRAV:           0,
  DRAG:           1,
  ENTR:           2,
  WRAP:           3,
  COLL:           4,
  ACCR:           5,
  PLANETARY:      6,

  // Biology (Green) — indices 7-16
  LIFE:           7,
  GLOW:           8,
  AFFINITY:       9,
  REPRO:          10,
  TRACK:          11,
  SENESCENCE:     12,
  ENERGY:         13,
  RADIATION:      14,
  GENOTYPE:       15,
  PHENOTYPE:      16,

  // Chemistry (Purple) — indices 17-24
  CATALYSIS_LAW:  17,
  SOLVATION:      18,
  ACIDITY:        19,
  OXIDATION:      20,
  POLYMER:        21,
  ISOMERIZATION:  22,
  CHIRALITY:      23,
  CRYSTALLIZATION: 24,

  // Thermodynamics (Orange) — indices 25-29
  HEAT:           25,
  COLD:           26,
  CONVECTION:     27,
  PHASE_RADIATION: 28,
  SUBLIMATION:    29,

  // Metaphysics (Red) — indices 30-37
  TIME_DILATION:  30,
  DIMENSIONALITY: 31,
  CHAOS:          32,
  ORDER:          33,
  FATE:           34,
  WILL:           35,
  SOUL_LAW:       36,
  MIND:           37,

  // Added missing V2 laws
  // Physics
  VOID:           38,
  BOND:           39,
  // Chemistry
  REDUCTION:      40,
  ALLOY:          41,
  // Thermodynamics
  MELT:           42,
  BOIL:           43,
  CONDENSE:       44,
  DEPOSIT:        45,
  EXOTHERMIC:     46,
  // Metaphysics
  TELEPATHY:      47,
  CLAIRVOYANCE:   48,
  PRECOGNITION:   49,
  ASTRAL:         50,
  PREDATION:     51,
  COMMS:         52,

  // Electromagnetism (Cyan) — indices 53-65
  CHARGE_LAW:    53,
  FIELD:         54,
  CURRENT:       55,
  RESISTANCE:    56,
  CAPACITANCE:   57,
  INDUCTANCE:    58,
  MAGNETISM:     59,
  RESONANCE:     60,
  FLUX:          61,
  IONIZATION:    62,
  DISCHARGE:     63,
  PLASMA:        64,
  SUPERCONDUCTIVITY: 65,

  // Information (Gold) — indices 66-78
  MEMORY:        66,
  PATTERN:       67,
  STIGMERGY:     68,
  SIGNAL_BOOST:  69,
  LEARN:         70,
  SYMBOL:        71,
  METRIC:        72,
  PREDICT:       73,
  CODE:          74,
  PROTOCOL:      75,
  FEEDBACK:      76,
  LANGUAGE:      77,
  CULTURE:       78,

  // New law types (indices 79-81)
  SINGULARITY:   79,
  ENTANGLEMENT:  80,
  HISTORY:       81,

  // 8x16 expansion — Physics (indices 82-87)
  TIDE:          82,
  FRICTION:      83,
  ELASTICITY:    84,
  TURBULENCE:    85,
  CENTRIPETAL:   86,
  ROTATION:      87,

  // Biology (indices 88-91)
  SYMBIOSIS:     88,
  PARASITE:      89,
  HIBERNATION:   90,
  IMMUNITY:      91,

  // Chemistry (indices 92-97)
  ELECTROLYSIS:  92,
  PHOTOLYSIS:    93,
  PRECIPITATION: 94,
  NEUTRALIZATION: 95,
  STOICHIOMETRY: 96,
  AUTOCATALYSIS: 97,

  // Thermodynamics (indices 98-103)
  ADIABATIC:     98,
  COMPRESSION:   99,
  EXPANSION:     100,
  EQUILIBRIUM:   101,
  LATENT_HEAT:   102,
  RUNAWAY:       103,

  // Metaphysics (indices 104-106)
  CONSCIOUSNESS: 104,
  PERCEPTION:    105,
  SYNCHRONICITY: 106,

  // Electromagnetism (indices 107-109)
  ANTENNA:       107,
  SHIELDING:     108,
  POLARIZATION:  109,

  // Information (indices 110-111)
  NAVIGATION:    110,
  ENCRYPTION:    111,

  // Quantum (indices 112-127)
  SUPERPOSITION: 112,
  TUNNELING:     113,
  DECOHERENCE:   114,
  WAVE_PARTICLE: 115,
  UNCERTAINTY:   116,
  TELEPORT:      117,
  OBSERVER:      118,
  PLANCK:        119,
  COHERENCE:     120,
  BOSONIC:       121,
  FERMIONIC:     122,
  SPIN:          123,
  SPECTRAL:      124,
  WAVEFUNCTION:  125,
  HYPERPLANE:    126,
  ANTIMATTER:    127,
};

export const LAW_COUNT = 128;

// --- Law Category Mapping ---

export const LAW_CATEGORIES = {
  physics: {
    color: 'RED',
    laws: [
      LAW_INDEXES.GRAV,
      LAW_INDEXES.DRAG,
      LAW_INDEXES.ENTR,
      LAW_INDEXES.WRAP,
      LAW_INDEXES.COLL,
      LAW_INDEXES.ACCR,
      LAW_INDEXES.PLANETARY,
      LAW_INDEXES.VOID,
      LAW_INDEXES.BOND,
      LAW_INDEXES.SINGULARITY,
      LAW_INDEXES.TIDE,
      LAW_INDEXES.FRICTION,
      LAW_INDEXES.ELASTICITY,
      LAW_INDEXES.TURBULENCE,
      LAW_INDEXES.CENTRIPETAL,
      LAW_INDEXES.ROTATION,
    ],
  },
  biology: {
    color: 'ORANGE',
    laws: [
      LAW_INDEXES.LIFE,
      LAW_INDEXES.GLOW,
      LAW_INDEXES.AFFINITY,
      LAW_INDEXES.REPRO,
      LAW_INDEXES.TRACK,
      LAW_INDEXES.SENESCENCE,
      LAW_INDEXES.ENERGY,
      LAW_INDEXES.RADIATION,
      LAW_INDEXES.GENOTYPE,
      LAW_INDEXES.PHENOTYPE,
      LAW_INDEXES.PREDATION,
      LAW_INDEXES.COMMS,
      LAW_INDEXES.SYMBIOSIS,
      LAW_INDEXES.PARASITE,
      LAW_INDEXES.HIBERNATION,
      LAW_INDEXES.IMMUNITY,
    ],
  },
  chemistry: {
    color: 'YELLOW',
    laws: [
      LAW_INDEXES.CATALYSIS_LAW,
      LAW_INDEXES.SOLVATION,
      LAW_INDEXES.ACIDITY,
      LAW_INDEXES.OXIDATION,
      LAW_INDEXES.POLYMER,
      LAW_INDEXES.ISOMERIZATION,
      LAW_INDEXES.CHIRALITY,
      LAW_INDEXES.CRYSTALLIZATION,
      LAW_INDEXES.REDUCTION,
      LAW_INDEXES.ALLOY,
      LAW_INDEXES.ELECTROLYSIS,
      LAW_INDEXES.PHOTOLYSIS,
      LAW_INDEXES.PRECIPITATION,
      LAW_INDEXES.NEUTRALIZATION,
      LAW_INDEXES.STOICHIOMETRY,
      LAW_INDEXES.AUTOCATALYSIS,
    ],
  },
  thermodynamics: {
    color: 'GREEN',
    laws: [
      LAW_INDEXES.HEAT,
      LAW_INDEXES.COLD,
      LAW_INDEXES.CONVECTION,
      LAW_INDEXES.PHASE_RADIATION,
      LAW_INDEXES.SUBLIMATION,
      LAW_INDEXES.MELT,
      LAW_INDEXES.BOIL,
      LAW_INDEXES.CONDENSE,
      LAW_INDEXES.DEPOSIT,
      LAW_INDEXES.EXOTHERMIC,
      LAW_INDEXES.ADIABATIC,
      LAW_INDEXES.COMPRESSION,
      LAW_INDEXES.EXPANSION,
      LAW_INDEXES.EQUILIBRIUM,
      LAW_INDEXES.LATENT_HEAT,
      LAW_INDEXES.RUNAWAY,
    ],
  },
  metaphysics: {
    color: 'TEAL',
    laws: [
      LAW_INDEXES.TIME_DILATION,
      LAW_INDEXES.DIMENSIONALITY,
      LAW_INDEXES.CHAOS,
      LAW_INDEXES.ORDER,
      LAW_INDEXES.FATE,
      LAW_INDEXES.WILL,
      LAW_INDEXES.SOUL_LAW,
      LAW_INDEXES.MIND,
      LAW_INDEXES.TELEPATHY,
      LAW_INDEXES.CLAIRVOYANCE,
      LAW_INDEXES.PRECOGNITION,
      LAW_INDEXES.ASTRAL,
      LAW_INDEXES.ENTANGLEMENT,
      LAW_INDEXES.CONSCIOUSNESS,
      LAW_INDEXES.PERCEPTION,
      LAW_INDEXES.SYNCHRONICITY,
    ],
  },
  electromagnetism: {
    color: 'BLUE',
    laws: [
      LAW_INDEXES.CHARGE_LAW,
      LAW_INDEXES.FIELD,
      LAW_INDEXES.CURRENT,
      LAW_INDEXES.RESISTANCE,
      LAW_INDEXES.CAPACITANCE,
      LAW_INDEXES.INDUCTANCE,
      LAW_INDEXES.MAGNETISM,
      LAW_INDEXES.RESONANCE,
      LAW_INDEXES.FLUX,
      LAW_INDEXES.IONIZATION,
      LAW_INDEXES.DISCHARGE,
      LAW_INDEXES.PLASMA,
      LAW_INDEXES.SUPERCONDUCTIVITY,
      LAW_INDEXES.ANTENNA,
      LAW_INDEXES.SHIELDING,
      LAW_INDEXES.POLARIZATION,
    ],
  },
  information: {
    color: 'VIOLET',
    laws: [
      LAW_INDEXES.MEMORY,
      LAW_INDEXES.PATTERN,
      LAW_INDEXES.STIGMERGY,
      LAW_INDEXES.SIGNAL_BOOST,
      LAW_INDEXES.LEARN,
      LAW_INDEXES.SYMBOL,
      LAW_INDEXES.METRIC,
      LAW_INDEXES.PREDICT,
      LAW_INDEXES.CODE,
      LAW_INDEXES.PROTOCOL,
      LAW_INDEXES.FEEDBACK,
      LAW_INDEXES.LANGUAGE,
      LAW_INDEXES.CULTURE,
      LAW_INDEXES.HISTORY,
      LAW_INDEXES.NAVIGATION,
      LAW_INDEXES.ENCRYPTION,
    ],
  },
  quantum: {
    color: 'PURPLE',
    laws: [
      LAW_INDEXES.SUPERPOSITION,
      LAW_INDEXES.TUNNELING,
      LAW_INDEXES.DECOHERENCE,
      LAW_INDEXES.WAVE_PARTICLE,
      LAW_INDEXES.UNCERTAINTY,
      LAW_INDEXES.TELEPORT,
      LAW_INDEXES.OBSERVER,
      LAW_INDEXES.PLANCK,
      LAW_INDEXES.COHERENCE,
      LAW_INDEXES.BOSONIC,
      LAW_INDEXES.FERMIONIC,
      LAW_INDEXES.SPIN,
      LAW_INDEXES.SPECTRAL,
      LAW_INDEXES.WAVEFUNCTION,
      LAW_INDEXES.HYPERPLANE,
      LAW_INDEXES.ANTIMATTER,
    ],
  },
};

// --- Reverse lookup: law index → category name ---

export const LAW_TO_CATEGORY = {};
for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
  for (const idx of cat.laws) {
    LAW_TO_CATEGORY[idx] = catName;
  }
}

// --- Reverse lookup: category color by law index ---

export const LAW_COLOR_BY_INDEX = {};
for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
  for (const idx of cat.laws) {
    LAW_COLOR_BY_INDEX[idx] = cat.color;
  }
}


// --- EM-spectrum rainbow bands (percent positions on a 0-100 spectrum) ---
// Eight evenly spaced colours at 12.5% intervals; each band is 4 points wide
// (center ± 2). RED wraps through 100/0, so its band runs start=98 to end=102.

export const LAW_SPECTRUM = {
  RED:    { start: 98,   end: 102, center: 0 },
  ORANGE: { start: 10.5, end: 14.5, center: 12.5 },
  YELLOW: { start: 23,   end: 27,   center: 25 },
  GREEN:  { start: 35.5, end: 39.5, center: 37.5 },
  TEAL:   { start: 48,   end: 52,   center: 50 },
  BLUE:   { start: 60.5, end: 64.5, center: 62.5 },
  VIOLET: { start: 73,   end: 77,   center: 75 },
  PURPLE: { start: 85.5, end: 89.5, center: 87.5 },
};

// --- Per-law hue: each of the 16 laws in a category is spread across its band ---

export const LAW_HUE_BY_INDEX = {};
for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
  const band = LAW_SPECTRUM[cat.color];
  const step = (band.end - band.start) / (cat.laws.length - 1);
  cat.laws.forEach((idx, k) => {
    const pos = (band.start + k * step) % 100; // RED wraps through 100/0
    LAW_HUE_BY_INDEX[idx] = Math.round(((pos / 100) * 360) * 10) / 10;
  });
}


// --- Law HELP_DB (tooltip descriptions) ---
// Mirrors v2 HELP_DB structure: each law has a hint + explanation + system + advanced tier.

export const LAW_HELP_DB = {
  // Electromagnetism (Cyan)
  CHARGE_LAW: {
    hint: "Coulomb force: charged particles attract or repel.",
    explanation: "Confirmed batch-14 (match irl): real inverse-square Coulomb force on the effective charge = POLARITY DNA + stored stride CHARGE — opposite signs attract, like signs repel, with no weighting between the two charge sources.",
    system: "qq = (POLARITY₁ + CHARGE₁) × (POLARITY₂ + CHARGE₂); force = −k×qq/(dist² + 0.5). Zero effective charge feels no force.",
  },
  FIELD: {
    hint: "Uniform electric field drift along the particle's polarity.",
    explanation: "Confirmed batch-14: every polarized particle receives a constant uniform acceleration (same on all three axes) along its POLARITY sign — positive drifts one way, negative the other. Stored CHARGE scales the drift strength, so a charged particle feels the field harder.",
    system: "POLARITY ≠ 0: acceleration = POLARITY × k × (1 + |CHARGE| × 0.5) on each axis. Combined with CHARGE_LAW it separates species by polarity into opposing drift lanes.",
  },
  CURRENT: {
    hint: "Charge transport: charge diffuses between conductive particles.",
    explanation: "Confirmed batch-14: neighboring particles exchange stored charge proportionally to CONDUCTIVITY DNA, smoothing charge gradients like electric current through a conductor — but both particles must be conductive for current to flow (real materials).",
    system: "Within 17 units: dq = (CHARGE_j − CHARGE_i) × min(CONDUCTIVITY_i, CONDUCTIVITY_j) × k; charge flows from high to low. Pairs with CAPACITANCE and IONIZATION.",
  },
  RESISTANCE: {
    hint: "Electrical resistance: fast motion converts kinetic energy into heat.",
    explanation: "Moving particles experience velocity-dependent damping and their TEMPERATURE rises with speed — kinetic energy dissipates as heat.",
    system: "A thermal-Ohmic bridge: the hotter they get the more they slow, preventing runaway charge-driven velocities.",
  },
  CAPACITANCE: {
    hint: "Capacitance: particles store energy as charge.",
    explanation: "Particles accumulate stored CHARGE from surplus ENERGY and feel a pairwise force from stored charge — energy storage that later drives electrostatic motion.",
    system: "Charge accrues when ENERGY exceeds 50 and bleeds off when below. Stored charge feeds CHARGE_LAW and FLUX.",
  },
  INDUCTANCE: {
    hint: "Inductance: neighbors align their motion magnetically.",
    explanation: "Velocities of nearby particles are pulled toward each other — magnetic coupling that damps relative motion and shepherds streams.",
    system: "Smooths velocity fields like an inductor opposing current change. Helps form coherent flow lanes.",
  },
  MAGNETISM: {
    hint: "Magnetic moment alignment: aligned moments attract.",
    explanation: "Particles with matching MAGNETIC_MOMENT DNA signs attract; opposing signs repel, scaled by the product of their moments.",
    system: "Creates magnetic chains and filaments along moment direction. Complements CHARGE_LAW for full electromagnetic structure.",
  },
  RESONANCE: {
    hint: "Resonance: pulsing particles attract when their pulse rates match.",
    explanation: "Particles with similar PULSE_RATE DNA that are actively signaling attract each other — sympathetic vibration.",
    system: "Uses SIGNAL and PULSE_RATE. In a hive-mind setup it tightens synchronized swarms.",
  },
  FLUX: {
    hint: "Charge flux: particles are pushed along the charge gradient.",
    explanation: "Each particle feels a force toward higher stored charge — charge flows like field lines, dragging particles along the gradient.",
    system: "Works with CURRENT and CAPACITANCE. Turns stored charge into directed motion.",
  },
  IONIZATION: {
    hint: "Ionization: hard contacts strip charge onto particles.",
    explanation: "On close contact, particles acquire stored CHARGE proportional to their POLARITY and impact speed, seeding electrostatic effects.",
    system: "Writes the CHARGE stride slot so CHARGE_LAW, FLUX, and CURRENT have something to act on.",
  },
  DISCHARGE: {
    hint: "Discharge: stored charge bursts into motion and heat.",
    explanation: "Particles holding strong stored CHARGE suddenly release it — a velocity kick proportional to the charge plus a heat spike, then the charge resets to zero.",
    system: "Capacitance builds charge, discharge converts it into kinetic energy. Creates spark-like impulse events that re-seed electrostatic dynamics.",
  },
  PLASMA: {
    hint: "Plasma: hot particles ionize — heat becomes charge.",
    explanation: "Particles above a temperature threshold convert surplus heat into stored CHARGE, cooling themselves as they ionize.",
    system: "The thermal-EM bridge: HEAT feeds PLASMA feeds CHARGE_LAW/FLUX. Hot dense gas turns into an electrically active plasma state.",
  },
  SUPERCONDUCTIVITY: {
    hint: "Superconductivity: cold pairs couple into lossless streams.",
    explanation: "Pairs of particles below a temperature threshold lock together — velocities align and stored charge equalizes with far less damping than normal.",
    system: "Requires COLD temperatures; RESISTANCE damping is suppressed while coupled. Forms coherent, near-frictionless flow lanes.",
  },

  // Information (Gold)
  MEMORY: {
    hint: "Memory: particles retain momentum and remember recent contacts.",
    explanation: "Interacting particles refresh a MEMORY trace; remembered motion persists — velocity slowly grows while the trace decays over time.",
    system: "Uses the MEMORY stride slot. Encourages inertial motion and historical continuity in particle behavior.",
  },
  PATTERN: {
    hint: "Pattern: dense regions attract more particles (cohesion).",
    explanation: "Nearby particles are pulled together by a distance-scaled cohesion force, reinforcing whatever structure already exists.",
    system: "Positive feedback — clumps thicken. Pair with ORDER for crystallization or CHAOS for pattern turbulence.",
  },
  STIGMERGY: {
    hint: "Stigmergy: particles leave trails and follow the trails of others.",
    explanation: "Every particle writes a predicted-path trail marker; neighbors are attracted toward those markers, creating emergent traffic lanes.",
    system: "Uses the TRAIL stride slots. Produces ant-like foraging streams without any global coordination.",
  },
  SIGNAL_BOOST: {
    hint: "Signal boost: contact amplifies and relays signals.",
    explanation: "A signaling particle shares its SIGNAL with neighbors on contact, propagating pulses further than normal communication range.",
    system: "Extends the COMMS layer — signals hop from particle to particle like a relay chain.",
  },
  LEARN: {
    hint: "Learning: particles match the velocity of their neighbors.",
    explanation: "Velocity alignment (boids-style): each particle steers toward the average motion of nearby particles.",
    system: "Creates schooling/flocking. Combine with SYMBOL for species-specific flocks.",
  },
  SYMBOL: {
    hint: "Symbol: species affinity drives social grouping.",
    explanation: "Same-species particles attract by SPECIES_AFFINITY DNA; different species feel the opposite bias.",
    system: "Species segregation force. Positive affinity = gregarious swarms, negative = territorial dispersal.",
  },
  METRIC: {
    hint: "Metric: particles climb the energy gradient.",
    explanation: "Particles are attracted toward higher-ENERGY neighbors, flowing from poor to rich regions like value-seeking agents.",
    system: "An information-theoretic gradient: energy acts as a fitness landscape.",
  },
  PREDICT: {
    hint: "Predict: particles aim where the neighbor will be.",
    explanation: "Attraction is computed toward the neighbor's extrapolated future position (velocity × prediction window), producing interception and pursuit curves.",
    system: "Anticipation makes pursuit smooth — useful with TRACK/PREDATION for clever predators.",
  },
  CODE: {
    hint: "Code: close contact blends DNA between particles.",
    explanation: "On contact, particles exchange DNA cache values at sampled loci — horizontal information transfer.",
    system: "Moves traits through the population. Works alongside GENOTYPE/PHENOTYPE for cultural evolution.",
  },
  PROTOCOL: {
    hint: "Protocol: neighbors entrain their signal phase.",
    explanation: "Signals of nearby particles converge toward the average — synchronization like metronomes coupling on a table.",
    system: "Phase-locking. With RESONANCE it creates global pulse waves across the whole simulation.",
  },
  FEEDBACK: {
    hint: "Feedback: memory amplifies motion, motion refreshes memory.",
    explanation: "Particles with a MEMORY trace accelerate along their existing velocity, and fast motion recharges the trace — a self-reinforcing inertial loop.",
    system: "Positive feedback loop. With MEMORY it produces persistent, history-driven motion; can destabilize into runaway or lock into orbits.",
  },
  LANGUAGE: {
    hint: "Language: signaling pairs exchange memory traces.",
    explanation: "When two particles are actively signaling, their MEMORY states converge and the signal relays between them — shared words carried between minds.",
    system: "Distinct from PROTOCOL (signal phase) — LANGUAGE moves stored memory state. With SIGNAL_BOOST it builds distributed shared knowledge.",
  },
  CULTURE: {
    hint: "Culture: same-species contacts converge their traits.",
    explanation: "Contacts between particles of the same species blend their DNA cache — norms spread within the group while leaving other species untouched.",
    system: "In-group trait convergence. With GENOTYPE it acts as soft heredity; with SYMBOL it sharpens species identity over time.",
  },
  SINGULARITY: {
    hint: "Singularity: supermassive particles collapse into black holes.",
    explanation: "Particles above the critical mass exert an extreme inverse-square pull on everything around them and absorb any particle that crosses their event horizon, releasing an accretion flash.",
    system: "Uses MASS, DEAD, RADIUS and TEMPERATURE. With ACCR, mass concentrates until collapse; matter then rains in and the hole grows.",
  },
  ENTANGLEMENT: {
    hint: "Entanglement: touching particles forge non-local quantum links.",
    explanation: "Particles that make contact become entangled — momentum and signals transfer between the pair at any distance, and a partner's death snaps the link with a recoil kick.",
    system: "Stores the partner index in the ENTANGLE_ID stride slot; ENTANGLE_PHASE decays the link over time. Spooky action without any signal channel.",
  },
  HISTORY: {
    hint: "History: the world remembers where particles have been.",
    explanation: "A coarse spatial memory field accumulates particle presence; particles drift toward the field's centre of mass — archaeology as a force, long after the action moved on.",
    system: "12×12×12 memory field in module memory, decaying exponentially. Past activity leaves a global attractor that steers new arrivals.",
  },

  GRAV: {
    hint: "Universal gravitational attraction between all particles.",
    explanation: "Newtonian gravity: F = G*m1*m2/r². FORCE DNA modulates the pair: both positive multiply the pull, both negative invert it into repulsion, opposite signs cancel to a neutral pair. HIDDEN_MASS adds dark-matter mass.",
    system: "Fundamental force driving cluster formation and orbital dynamics. Uses HIDDEN_MASS for dark-matter effects; TIDAL boosts close-range pull; stars (> starMass) pull harder.",
  },
  DRAG: {
    hint: "Velocity-dependent motion damping.",
    explanation: "Slows particles proportional to their VISCOSITY DNA parameter. Higher viscosity = more damping.",
    system: "Prevents runaway velocities. Combined with friction (always active) stabilizes the simulation.",
  },
  ENTR: {
    hint: "Brownian jitter adds random thermal motion.",
    explanation: "Particles receive random force kicks proportional to JITTER DNA, preventing static equilibrium.",
    system: "Acts as thermal noise floor. In low-viscosity regimes it drives chaos; in high-viscosity it enables slow annealing.",
  },
  WRAP: {
    hint: "Toroidal world wrapping (particles wrap around edges).",
    explanation: "When enabled, particles leaving one edge reappear on the opposite edge. When disabled, soft walls reflect them.",
    system: "Binary law in v4: on = toroidal wrap, off = soft walls whose velocity effect is set by the WALL REFLECT slider (0 = absorb, 1 = reflect, 2 = double bounce). Essential for uniform spatial distribution.",
  },
  COLL: {
    hint: "Physical collisions with momentum exchange.",
    explanation: "Particles bounce off each other based on ELASTICITY DNA. Overlapping particles are pushed apart. Standalone from ACCR — turn ACCR off to get pure elastic bouncing without mass fusion.",
    system: "Impulse-based collision response with mass-weighted velocity exchange. ELASTICITY controls bounciness. Pairs that are fusing under ACCR coalesce instead of bouncing.",
  },
  ACCR: {
    hint: "Mass accretion on collision.",
    explanation: "FUSION_MOMENTUM DNA is the MINIMUM relative momentum required to fuse on impact — faster pairs merge, slower pairs bounce. FUSION_TIME DNA is how long slower pairs must stay in very close proximity before they fuse anyway. FUSION DNA scales the mass-transfer efficiency.",
    system: "Hierarchical mass growth. Proximity dwell is tracked per contact pair; leaving contact resets the clock. Stars (> starMass) pull overlapping matter in and dissolve it. High fusion leads to proto-celestial body formation.",
  },
  PLANETARY: {
    hint: "Atmospheric gravity: constant downward pull toward the ground.",
    explanation: "Every particle falls toward the ground plane (z = 0) with a constant acceleration that is independent of mass — simulating particles much smaller than the world falling through a planet's atmosphere.",
    system: "Force is scaled by mass so acceleration is mass-independent. ×1.5 with GRAV. With WRAP off the soft-wall clamp turns z = 0 into the ground; particles pile up there instead of floating to the centre.",
  },
  VOID: {
    hint: "Vacuum pressure: empty space pushes particles apart.",
    explanation: "Confirmed batch-10 (yes): strengthened and dark-energy scaled — the outward push grows with distance from the world centre, opposing gravitational clustering harder at the edges.",
    system: "Strength = 0.004 x synergy x (0.3 + dist/(worldSize/2)) along the radial direction from the world centre.",
  },
  BOND: {
    hint: "Molecular bonding between nearby particles.",
    explanation: "Confirmed batch-10: molecular bonds prefer dense neighbourhoods — the more neighbours nearby, the stronger and longer-range the bond — instead of chain ends (that is POLYMER's job). Stretched bonds break past 3x the rest length.",
    system: "Density boost = min(2, 1 + nCount x 0.05) scales spring force and range (30 x boost). Rest length = (r1+r2) x 1.1, spring k = STIFFNESS DNA x 0.05 x synergy x boost. Bonds register in all 6 shared slots; break when dist > rest x 3.",
  },
  LIFE: {
    hint: "Biological lifecycle: energy cost, aging, death.",
    explanation: "Particles consume metabolic energy over time (based on ENERGY_EFFICIENCY, scaled by the DECAY_RATE slider) and photosynthesis subsidises it from LIGHT_LEVEL. When metabolic energy hits 0, they die; hunger beyond the cap also kills.",
    system: "Core ecosystem loop. Only the LIFE metabolic path triggers energy-depletion death — charge/electromagnetic energy lives in its own fields and laws. Senescence (age-based death) is a separate law.",
  },
  GLOW: {
    hint: "Signaling pulses: particles emit periodic signals for visual brightness.",
    explanation: "GLOW is an emitter only (batch-04 correction): an oscillator (PULSE_RATE × SIGNAL_STRENGTH DNA) raises the particle's SIGNAL — its transmission strength — when the phase is positive. Signal (SIGNAL) and metabolism (ENERGY) are separate channels and GLOW never converts one into the other.",
    system: "Emission: SIGNAL += phase×PULSE_RATE×SIGNAL_STRENGTH×dt×0.05×synergy when the oscillator phase is positive; with COMMS the pulse propagates to neighbours. No energy regen — ENERGY stays exactly as the LIFE law left it. Distinct from COMMS, which handles propagation.",
  },
  AFFINITY: {
    hint: "Species-based attraction or repulsion.",
    explanation: "SPECIES_AFFINITY BOOSTS attraction to the same species: the same-species pull scales with positive affinity and is inert at 0. Different-species pairs repel only when SPECIES_AFFINITY is negative (xenophobic).",
    system: "Uses SPECIES_AFFINITY DNA (index 41). Same-species: strength 0.1×max(0, affinity)×synergy×SPECIES_INTERACTION. Cross-species: repel at 0.05×|affinity| when negative. Positive = gregarious, negative = xenophobic.",
  },
  REPRO: {
    hint: "Reproduction driven by a reproductive-drive meter.",
    explanation: "Particles accumulate REPRODUCTIVE DRIVE from BIRTH_RATE over time. Once the drive passes 60 and the particle is mature (AGE ≥ 100), it has a per-tick chance to spawn a child with mutated DNA; spawning consumes the drive and half the parent's life energy.",
    system: "Drive (REPRO_DRIVE stride field 79) accumulates BIRTH_RATE×0.1×dt×synergy, capped at 100. Chance = BIRTH_RATE×0.01×synergy per tick. MUTATION controls offspring variation; genetics params 42-47 + SEX_CHANCE enable two-parent crossover. Energy is no longer the reproduction gate.",
  },
  TRACK: {
    hint: "Predation tracking: particles chase lower-mass prey of another species.",
    explanation: "Particles with high PREDATION_BIAS are attracted to lower-mass particles — but only across species: a predator never hunts its own kind.",
    system: "Requires PREDATION_BIAS ≥ 0.1 and a different-species neighbour with mass < 0.8× the predator's; pull strength = PREDATION_BIAS×0.05×synergy. Combines with LIFE and REPRO for full ecosystem simulation.",
  },
  PREDATION: {
    hint: "Predation: mass-difference pursuit and gene absorption.",
    explanation: "Confirmed batch-13 (match docs): larger particles pursue smaller ones based on PREDATION_BIAS DNA, absorbing DNA traits and mass on contact. A predator never hunts its own kind — predation is strictly cross-species (matches TRACK). Prey flee with jitter-based repulsion.",
    system: "Cross-species pairs with mass difference > 0.5: predator pull = PREDATION_BIAS×0.1×preyMass/dist; prey flee = JITTER×0.2/dist. On contact, 5 PRNG-sampled DNA traits blend 5% toward the prey plus mass transfer.",
    advanced: "Pairs with TRACK and REPRO for full ecosystem cycles. High PREDATION_BIAS species act as apex predators; prey species benefit from JITTER for escape.",
  },
  COMMS: {
    hint: "Communication: particles emit and exchange channel-filtered signals.",
    explanation: "Confirmed batch-14: oscillator pulses (PULSE_RATE × SIGNAL_STRENGTH DNA) build a SIGNAL field each tick; neighbors within NEIGHBORHOOD_RADIUS exchange signal filtered by TUNING_CH1-4, converting delivery into homing force + memory. The sender pays the emission cost — signalling is no longer a free energy source.",
    system: "The only law that drives signal emission, decay, and pairwise signal exchange. Delivery: receiver SIGNAL/MEMORY += delivered, homing force = SIGNAL_RESP × delivered × 0.05; sender ENERGY −= delivered × 0.5 (floor 0). With COMMS off, SIGNAL and MEMORY fields freeze.",
    advanced: "Receiver sensitivity is SIGNAL_RESP, range is NEIGHBORHOOD_RADIUS, persistence is SIGNAL_DECAY, and channel tuning is TUNING_CH1-4. Because COMMS is the sole gate for the communication DNA group, toggling it off guarantees zero signal-driven movement even when other laws are active.",
  },
  SENESCENCE: {
    hint: "Age-based death: old particles die off.",
    explanation: "Particles past age 500 have increasing death probability based on DEATH_RATE DNA. Senescence is nested inside the LIFE cycle (confirmed): it only fires while LIFE is on, so aging is a property of living organisms.",
    system: "Past AGE 500, per-tick death chance = DEATH_RATE×0.001×(1 + ageNorm×0.5)×dt. Requires LIFE. Prevents immortal particles and enables generational turnover.",
  },
  ENERGY: {
    hint: "Energy conduction: every energy pool flows toward equilibrium.",
    explanation: "Nearby particles conduct ALL energy reservoirs pairwise toward equilibrium — LIFE energy (ENERGY), ELECTRIC_ENERGY and STORED_ENERGY each transfer independently, like thermal conduction. SIGNAL (transmission strength) and REPRO_DRIVE (drive meter) are not energy reservoirs and are never touched.",
    system: "For each channel, pairs within dist² < 40000 transfer (hot − cold)×0.005×synergy×ENERGY_TRANSFER per tick. Conservation holds per channel. Prevents energy hoarding by high-mass particles.",
  },
  RADIATION: {
    hint: "Background radiation damages unprotected particles and slowly irradiates them.",
    explanation: "Particles accumulate RADIATION_EXPOSURE over time, scaled by the RADIATION_LEVEL slider. Low-ARMOR particles take life-energy damage that slowly compounds with the accumulated dose, and the dose steadily ramps DNA mutation chance — more and more over time.",
    system: "Exposure += RADIATION_LEVEL×dt×0.01 (cap 100). Damage = (1−ARMOR)×0.02×RADIATION_LEVEL×(1 + exposure×0.02)×dt×synergy; energy ≤ 0 kills. Mutation chance = exposure×0.001×dt×synergy per tick, perturbing the DNA cache. Radiation death is consistent with the batch-02 LIFE depletion death.",
  },
  GENOTYPE: {
    hint: "Genetics engine: somatic drift, gene flow and species-genome evolution.",
    explanation: "DNA and genetics are a major part of VEPA. GENOTYPE drives per-particle somatic drift in the DNA cache (heritable through REPRO), modulated by the genetics params: REPRESSOR damps drift, HETEROZYGOSITY widens variance, EPIGENETIC_DRIFT adds non-heritable noise, GENE_FLOW pulls foreign genes horizontally, and accumulated RADIATION exposure ramps the rate. Rarely, a mutation writes back into the species genome itself, so evolution accumulates at the species level.",
    system: "Base chance = MUTATION×(1+TEMPERATURE)×dt×0.01×synergy×(1−REPRESSOR×0.5)×(1+exposure×0.05); mutates 1-3 cache loci by ±MUTATION×0.05×(1+HETEROZYGOSITY×2). Epigenetic noise and gene-flow blend per mutation; writeback chance = CROSSOVER_RATE×0.0002×dt, quantized into the 64×64 species DNA buffer.",
  },
  PHENOTYPE: {
    hint: "Gene expression: the inherited genome becomes the visible body.",
    explanation: "Phenotype = genotype (DNA cache) expressed through the environment. POLARITY → hue, ALPHA → saturation, SYMMETRY → lightness are translated into the particle's colour every tick, and ENERGY is the environment — well-fed particles (energy > 100) grow larger, starving ones shrink. Offspring inherit the DNA, so they inherit the look.",
    system: "RADIUS ×= (1 + (energy/200 − 0.5) × 0.5 × synergy); colour = HSL(POLARITY→hue 0-240, ALPHA→saturation, SYMMETRY→lightness) written to COLOR_R/G/B (0-255). The solver's mass-derived radius recompute applies the same energy factor.",
  },
  CATALYSIS_LAW: {
    hint: "Catalysis: reactions happen faster — and it is free.",
    explanation: "Increases the multiplier for chemical interactions (confirmed batch-05: chemistry only, no energy cost). CATALYSIS DNA (index 38) controls the multiplier.",
    system: "chemMult = 1 + CATALYSIS×0.5×synergy, applied to the forces accumulated before the chemistry modifier in the pair loop (affinity/gravity). Free — never touches ENERGY, CHARGE or SIGNAL.",
  },
  SOLVATION: {
    hint: "Solvation: the solvent medium — opposite charges attract, like charges repel.",
    explanation: "Real-world solvation (confirmed batch-05): like dissolving salt in water, the medium pulls opposite-charge ions together and pushes like charges apart, and charge-different particles react faster in the solvent.",
    system: "Charge force = 0.05×|q1×q2|×synergy along the pair axis, sign = attract for opposite signs, repel for like signs (wired into the solver pair loop). Reaction multiplier = 1 + |Δcharge|×0.2×synergy when the gap > 0.5. Uses stride CHARGE (POLARITY DNA seeds it).",
  },
  ACIDITY: {
    hint: "Acid/base exchange: charge equalization between particles.",
    explanation: "Documented behavior (confirmed batch-05): particles exchange CHARGE when close, equalizing their electrical potential. CONDUCTIVITY DNA controls the transfer rate and the CHARGE field is altered. ENERGY is untouched.",
    system: "When |Δcharge| ≥ 0.3, transfer = Δcharge × max(CONDUCTIVITY_i, CONDUCTIVITY_j) × 0.1 × dt × synergy from the higher-charge particle to the lower. Charge is conserved per pair.",
  },
  OXIDATION: {
    hint: "Oxidation: charged particles rust, burn and glow.",
    explanation: "Real oxidation is electron loss (confirmed batch-06): a charged particle's CHARGE drifts toward 0 at the same rate its mass erodes, and with HEAT_OUTPUT DNA it releases heat energy and flashes brighter while it burns.",
    system: "Requires |CHARGE| ≥ 0.3. MASS −= |charge|×0.001×dt×synergy; CHARGE decays by |charge|×0.001×dt×synergy toward 0 (electrical rust). With HEAT_OUTPUT (DNA 39): ENERGY += charge×HEAT_OUTPUT×0.05×dt×synergy (cap 200), TEMPERATURE rises, and COLOR_R/G/B + ALPHA flash toward white.",
  },
  POLYMER: {
    hint: "Polymerization: particles form chain bonds.",
    explanation: "Confirmed batch-10: polymers prefer to extend chains — free/tip particles (0-1 bonds) bond eagerly while well-connected particles (3+) are avoided, so POLYMER grows linear chains instead of cross-linked webs.",
    system: "Bond slots (BOND_PARTNER_1..6, stride 59/60/81-84), max 6 mutual bonds. Bond range = 10 x synergy x chainBias, where chainBias = 1.0 (0-1 bonds), 0.5 (2), 0.25 (3+). Spring force stiffness 0.02 x synergy, rest length 4.",
  },
  ISOMERIZATION: {
    hint: "Isomerization: bond topology rearrangement.",
    explanation: "Real isomerization keeps the same atoms but rearranges the bonds (confirmed batch-06: match real life). A particle with 3+ chain bonds occasionally breaks one connection — the freed partner becomes a fragment (its reciprocal bond is cleared too) — and the rearrangement consumes a little energy.",
    system: "Chance = 0.02×dt×synergy per tick when BOND_COUNT ≥ 3 and ENERGY ≥ 1: break the first filled bond slot, clear the partner's reciprocal slot and decrement both counts, then ENERGY −= 0.5×dt×synergy.",
  },
  CHIRALITY: {
    hint: "Chirality: handedness from TORQUE DNA creates spin bias.",
    explanation: "Confirmed batch-06: handedness comes from TORQUE DNA (geometric mirror-handedness, clockwise vs counter-clockwise), not charge. Same-handedness pairs deflect perpendicular to their separation — positive torque spins one way, negative the other, like mirror-image enantiomers.",
    system: "Same-sign TORQUE pair (dist ≥ 1): perpendicular deflection (−dy, dx)×0.01×synergy×sign(TORQUE)×invDist. Opposite-handedness or zero-torque pairs: no force.",
  },
  CRYSTALLIZATION: {
    hint: "Crystallization: same-species rigid lattice formation.",
    explanation: "Confirmed batch-07 + repaired: any pair within 150 units is pulled toward an 8-unit lattice grid, and same-species pairs crystallize 3x stronger (rigid clusters). Range and strength were tuned up so lattices actually form at default spawn spacing.",
    system: "Quantizes pair separation to an 8-unit grid (pull 0.05 x synergy, range 1-150); same-species pairs pull 3x harder. Creates crystalline structures.",
  },
  HEAT: {
    hint: "Thermal motion: heat adds random jitter to hot particles.",
    explanation: "Confirmed batch-07: particles above 0.5 TEMPERATURE receive random velocity kicks proportional to temperature (kinetic-theory thermal noise), and heat conducts pairwise toward equilibrium.",
    system: "Thermal jitter = +/-(temp x 0.01 x dt x synergy) per axis for temp > 0.5; conduction rate 0.01 x dt x synergy / HEAT_CAPACITY, hot flows to cold.",
  },
  COLD: {
    hint: "Cold slows particles down.",
    explanation: "Confirmed batch-07: particles below 0.5 TEMPERATURE have their velocity damped each tick, and cold conducts heat from warmer neighbours toward equilibrium.",
    system: "Velocity x= max(0, 1 - (0.5 - temp) x 0.1 x dt x synergy) for temp < 0.5; conduction cools the hotter neighbour (rate 0.015 x dt x synergy / HEAT_CAPACITY).",
  },
  CONVECTION: {
    hint: "Convection: buoyant vertical motion from temperature.",
    explanation: "Confirmed batch-07: hot particles get positive Y velocity (buoyancy), creating convection currents. Buoyancy is deliberately not scaled by HEAT_CAPACITY — conduction already encodes capacity into the temperature field.",
    system: "Buoyancy = (temp - 0.5) * 0.001 * dt * synergy on VEL_Y. Drives large-scale circulation patterns.",
  },
  PHASE_RADIATION: {
    hint: "Blackbody radiation: hot particles emit energy.",
    explanation: "Confirmed batch-08 (follow irl behaviour): Stefan-Boltzmann blackbody emission — every warm body radiates and hot bodies radiate disproportionately (T^4 curve), cooling TEMPERATURE and ENERGY while boosting SIGNAL glow.",
    system: "For temp > 0.05: radiated = temp^4 x 0.05 x dt x synergy; ENERGY -= radiated, TEMPERATURE -= radiated, SIGNAL += radiated (cap 1). Prevents energy runaway.",
  },
  SUBLIMATION: {
    hint: "Sublimation: low-mass hot particles turn to gas.",
    explanation: "Confirmed batch-08: hot (temp > 0.5) high-energy (ENERGY > 50) particles sublimate, losing mass down to a 0.02 floor and gaining a PRNG velocity burst; sublimation consumes extra energy and cools the particle.",
    system: "sublRate = (temp-0.5) x 0.005 x dt x synergy; MASS -= sublRate (floor 0.02), VEL_X/Y += (prng()-0.5) x sublRate x 5, ENERGY -= sublRate x 20, TEMPERATURE -= sublRate x 0.5.",
  },
  MELT: {
    hint: "Melting: hot particles lose structural integrity.",
    explanation: "Confirmed batch-11 (follow HELP_DB): melting is a loss of rigidity, not mass — above the melt point (temp 0.7) a particle's effective STIFFNESS decays toward a 20% floor, and below it the particle re-solidifies and stiffness recovers. Reversible phase change.",
    system: "STIFFNESS (DNA cache) decays by (temp−0.7) x 0.02 x dt x synergy toward 20% of the species baseline; recovers at 0.005 x dt x synergy below temp 0.7.",
  },
  BOIL: {
    hint: "Boiling: very hot particles eject mass.",
    explanation: "Confirmed batch-11 (yes): particles above boiling temperature (temp 0.9) eject a mass fraction as energetic vapor — the ejected mass becomes a PRNG velocity burst and costs latent heat (ENERGY), with a 0.02 mass floor so nothing boils away completely.",
    system: "ejectMass = mass x (temp−0.9) x 0.02 x dt x synergy (> 0.01 threshold); MASS −= ejectMass (floor 0.02); VEL ±= (prng()−0.5) x ejectMass x 10/5; ENERGY −= ejectMass x 20; TEMPERATURE −= boilRate x 0.3.",
  },
  CONDENSE: {
    hint: "Condensation: cool particles gain mass from vapor.",
    explanation: "Confirmed batch-12 (match irl): condensation is exothermic — below temp 0.3 a particle absorbs vapor mass and releases latent heat, so it warms as it grows (clamped below boiling).",
    system: "temp < 0.3: MASS += (0.3−temp) x 0.005 x dt x synergy; TEMPERATURE += (0.3−temp) x 0.01 x dt x synergy (cap 0.9).",
  },
  DEPOSIT: {
    hint: "Deposition: vapor directly solidifies on cold particles.",
    explanation: "Confirmed batch-12 (match irl): deposition (frost) skips the liquid phase and is exothermic — cold particles (temp < 0.2) accrete solid mass 3x faster than condensation, grow visibly (radius), and release latent heat as the frost forms.",
    system: "temp < 0.2: MASS += (0.2−temp) x 0.03 x dt x synergy, RADIUS += (0.2−temp) x 0.005 x dt x synergy, TEMPERATURE += (0.2−temp) x 0.02 x dt x synergy (cap 0.9).",
  },
  EXOTHERMIC: {
    hint: "Exothermic reactions release extra energy.",
    explanation: "Confirmed batch-12 (match irl): exothermic reactions release heat while they run — a bounded steady ENERGY + TEMPERATURE release (replaces the old unbounded ENERGY ×= 1.1 exponential), capped at the 200 energy ceiling and below boiling.",
    system: "ENERGY += 0.05 x dt x synergy (cap 200); TEMPERATURE += 0.01 x dt x synergy (cap 0.9).",
  },
  TIME_DILATION: {
    hint: "Time dilation: SOUL slows local time.",
    explanation: "Confirmed batch-08 (agent decision): high-SOUL particles experience slower local time, giving them more frames to react. 70% max slowdown is kept — a stronger cap would make differential aging (AGE, reproduction timers) diverge too far between souls.",
    system: "localDt = 1.0 - soul * 0.3 * synergy. SOUL = 1.0 → 70% time speed. Enables bullet-time effects.",
  },
  DIMENSIONALITY: {
    hint: "Dimensional drift: random Z-axis motion.",
    explanation: "Confirmed batch-08 (make it stronger): particles receive random Z-axis forces at 3x the old amplitude, visibly exploring 3D space.",
    system: "VEL_Z += (prng()-0.5) x 0.3 x synergy x dt. Prevents particles from settling into pure 2D planes.",
  },
  CHAOS: {
    hint: "Chaos: strong random forces, system instability.",
    explanation: "Confirmed batch-09 (agent decision): strong random velocity forcing (X/Y full, Z half) PLUS a small temperature stir — flickering hot/cold pockets that feed HEAT and PHASE_RADIATION dynamics.",
    system: "Kinetic: (prng()-0.5) x 0.5 x dt x synergy on X/Y, half on Z. Thermal: (prng()-0.5) x 0.02 x dt x synergy on TEMPERATURE (clamped 0-1). With ORDER on, both run at x0.3 (mutual cancellation).",
  },
  ORDER: {
    hint: "Order: velocity alignment, system convergence.",
    explanation: "Confirmed batch-09 (strongly): particles strongly align their velocity with neighbors within ~200 units, creating coherent flow.",
    system: "Vicsek alignment: accel = neighbor velocity x 0.04 x synergy within distSq < 40000 (~200 units). With CHAOS on, both run at x0.3.",
  },
  FATE: {
    hint: "Fate: each species drifts toward its own destiny.",
    explanation: "Confirmed batch-09 (redesign — the old pairwise attraction duplicated AFFINITY): every species has a slowly wandering destiny point it is gently pulled toward, so species migrate and segregate toward their own fate.",
    system: "Destiny point = golden-angle phase per species, drifting on a fate clock (span 0.32 x worldSize). Pull = 0.02 x synergy along the shortest toroidal path. Full-world range.",
  },
  WILL: {
    hint: "Will: self-propulsion along current velocity.",
    explanation: "Particles boost their own velocity in the direction they're already moving.",
    system: "Self-propulsion model. Energy-independent: any particle with velocity gets a boost.",
  },
  SOUL_LAW: {
    hint: "Soul: ethereal energy shared between same-species.",
    explanation: "Confirmed batch-10 (agent decision): SOUL is a conserved shared field — the giver loses what the receiver gains, both capped to [0, 1], and souls decay slowly unless replenished. Keeps TIME_DILATION's 70% max slowdown as the ceiling.",
    system: "Same-species transfer: receiver += soul x 0.001 x synergy, giver -= same (cap 1.0, range ~100 units). Per-particle decay: soul x= 1 - 0.002 x dt x synergy.",
  },
  MIND: {
    hint: "Hivemind: collective consciousness signal boost.",
    explanation: "Confirmed batch-10 (synergies are the interesting part): same-species pairs amplify each other's SIGNAL, and the hivemind is shaped by law synergies — COMMS x1.5, TELEPATHY x2.0, ENERGY x0.5 (drain), POLYMER x0.5 (overhead).",
    system: "signalBoost = 0.01 x synergy / dist for same-species within ~200 units. Synergy: COMMS +1.5x, TELEPATHY +2.0x, ENERGY 0.5x, POLYMER 0.5x.",
  },
  TELEPATHY: {
    hint: "Telepathy: instant information sharing across species.",
    explanation: "Confirmed batch-12 (slight energy drain): same-species particles share SIGNAL instantly regardless of distance, and the receiver pays a slight energy cost per transfer for the shared channel.",
    system: "Same-species pair: receiver SIGNAL += sender SIGNAL x 0.05 x synergy (any distance); receiver ENERGY −= 0.02 x synergy x dt.",
  },
  CLAIRVOYANCE: {
    hint: "Clairvoyance: particles sense future positions.",
    explanation: "Confirmed batch-13 (slight cost): particles steer toward where neighbors will be (3-tick velocity extrapolation) instead of where they are, and sensing the future drains a little energy.",
    system: "Predictive steering: velocity extrapolation targeting; ENERGY −= 0.02 × synergy × dt per prediction (floor 0).",
  },
  PRECOGNITION: {
    hint: "Precognition: collision anticipation and avoidance.",
    explanation: "Confirmed batch-13 (slight cost): when a neighbor is closing in (1-50 units) the particle steers perpendicular to slip past, and anticipating the collision drains a little energy. Reduces collisions at the cost of smoothness.",
    system: "Collision course (dot < 0): lateral avoidance force 0.05 × synergy; ENERGY −= 0.02 × synergy × dt per dodge (floor 0).",
  },
  ASTRAL: {
    hint: "Astral projection: souls leave bodies on death.",
    explanation: "Confirmed batch-13 (expanded): when a particle dies its SOUL persists as a translucent ghost that fades over time. The ghost exerts a soft soul-pull on nearby living particles, and same-species kin receive a conserved sliver of its soul before it dissipates.",
    system: "DEAD=0.5 soul state: ALPHA=soul×0.5, MASS=soul×0.1, SOUL ×= 0.999/tick, removed < 0.001. Ghost pull = soul×0.02×synergy×dt within 80 units; same-species gift = soul×0.002×synergy×dt (conserved, both clamped).",
  },
  REDUCTION: {
    hint: "Reduction: charge is neutralized between particles.",
    explanation: "Confirmed batch-11 (real-life behavior): opposite charges attract and cancel out when they interact — each magnitude shrinks toward zero. Same-sign charges repel, so nothing is neutralized. The mirror of OXIDATION.",
    system: "For opposite-sign pairs: CHARGE −= CHARGE x 0.05 x synergy on both (snap to 0 when the step exceeds the magnitude). Same-sign pairs are untouched.",
  },
  ALLOY: {
    hint: "Alloying: different-species particles fuse into composites.",
    explanation: "Confirmed batch-11 (real-life behavior): two different-species particles that overlap dissolve into one homogeneous composite — full mass merge, per-particle DNA averaged (mass-weighted), colour blended. The survivor keeps its species slot but behaves as the mix.",
    system: "Overlap dist < (r1+r2) x 0.5: MASS = m1+m2, DNA_CACHE = mass-weighted average of both, colours blended, j is marked DEAD. Gated by ALLOY.",
  },
  TIDE: {
    hint: "Tides: massive neighbours stretch and pull at each other.",
    explanation: "Particles feel a tidal force proportional to the mass of nearby massive particles — a long-range pull that strengthens with mass and weakens slowly with distance.",
    system: "Long-range mass coupling. With GRAV it produces orbital capture; with SINGULARITY the tidal field deepens around the hole.",
    advanced: "Tidal force uses MASS of both partners; inverse-distance not inverse-square, so it reaches further than gravity.",
  },
  FRICTION: {
    hint: "Friction: velocity-dependent drag slows everything down.",
    explanation: "Particles lose velocity proportionally to their current speed, converting motion into heat.",
    system: "Global kinetic damping. With DRAG the two dampings stack; with COLD it drives fast thermal equilibrium.",
    advanced: "Damping factor per tick is fixed; species VISCOSITY DNA modulates it.",
  },
  ELASTICITY: {
    hint: "Elasticity: collisions bounce with restitution.",
    explanation: "Contacts reflect relative velocity with a restitution factor, so particles recoil instead of sticking.",
    system: "Collision restitution. With COLL it dominates the impulse; with BOND it competes against forming stable links.",
    advanced: "Restitution factor scales with the inverse of combined mass — light particles bounce harder.",
  },
  TURBULENCE: {
    hint: "Turbulence: a noise-driven swirl perturbs every particle.",
    explanation: "Each particle receives a pseudo-random perpendicular kick that rotates smoothly over time — a churning flow field.",
    system: "Vorticity noise. With CONVECTION it stirs thermal plumes; with DRAG the flow is damped into eddies.",
    advanced: "Kicks are perpendicular to velocity so total kinetic energy is roughly conserved.",
  },
  CENTRIPETAL: {
    hint: "Centripetal: everything is pulled gently toward the world centre.",
    explanation: "Particles drift toward the centre of the dish with a weak restoring force that grows with distance.",
    system: "Global attractor at world centre. With PLANETARY it competes against local bodies; with ROTATION it creates orbital shells.",
    advanced: "Force is proportional to distance from centre — harmonic oscillator behaviour.",
  },
  ROTATION: {
    hint: "Rotation: the world spins around its centre.",
    explanation: "Particles feel a tangential force that sets the whole dish rotating around the centre axis.",
    system: "Global rigid-frame swirl. With CENTRIPETAL it forms stable orbits; with TURBULENCE it shears into spiral arms.",
    advanced: "Tangential force scales with distance from the axis — solid-body rotation.",
  },
  SYMBIOSIS: {
    hint: "Symbiosis: different species exchange energy on contact.",
    explanation: "Contact between different species transfers energy from the richer partner to the poorer one, benefiting both.",
    system: "Cross-species mutualism. With AFFINITY it drives mixed-species cliques; with ENERGY it keeps partners alive longer.",
    advanced: "Energy flows only between different species; same-species contacts are unaffected.",
  },
  PARASITE: {
    hint: "Parasite: smaller particles drain energy from larger hosts.",
    explanation: "On contact, a smaller particle siphons energy from a larger one, at a small efficiency loss.",
    system: "Size-based extraction. With PREDATION it escalates to lethal drain; with IMMUNITY hosts resist the drain.",
    advanced: "Drain is proportional to the host's surplus energy; hosts below a floor are not drained.",
  },
  HIBERNATION: {
    hint: "Hibernation: starving particles slow down to preserve energy.",
    explanation: "Low-energy particles damp their own velocity and stop burning energy, effectively sleeping through scarcity.",
    system: "Energy-conservation dormancy. With SENESCENCE it extends lifespan; with ENERGY it prevents starvation death.",
    advanced: "Particles under the energy floor reduce movement but regain energy slowly.",
  },
  IMMUNITY: {
    hint: "Immunity: armour regenerates and drains are resisted.",
    explanation: "Particles slowly rebuild ARMOR and take reduced damage from drains, poisons and radiation.",
    system: "Defensive regen. With PARASITE it halves extraction; with RADIATION it blocks genotypic damage.",
    advanced: "ARMOR regenerates up to a species-scaled cap; excess drain energy is discarded.",
  },
  ELECTROLYSIS: {
    hint: "Electrolysis: charge splits matter apart.",
    explanation: "Charged neighbours drive mass-to-energy conversion, releasing signal and heat as the compound breaks down.",
    system: "Charge-driven decomposition. With ACIDITY it accelerates corrosion; with CURRENT it produces gas-like scatter.",
    advanced: "Requires a charge difference between partners; uses CONDUCTIVITY DNA.",
  },
  PHOTOLYSIS: {
    hint: "Photolysis: light (signal) breaks matter down.",
    explanation: "Particles bathed in strong signal convert some mass into energy — light-powered chemistry.",
    system: "Signal-driven decomposition. With GLOW it makes luminous regions chemically active; with SOLVATION it etches clusters.",
    advanced: "Conversion scales with incoming SIGNAL and CATALYSIS DNA.",
  },
  PRECIPITATION: {
    hint: "Precipitation: dissolved matter condenses into dense clumps.",
    explanation: "Particles in high-density neighbourhoods gain mass and shrink radius, settling into solid clumps.",
    system: "Condensation from saturation. With CRYSTALLIZATION it nucleates crystals; with SOLVATION it fights re-dissolution.",
    advanced: "Uses local density from the spatial grid; clumps become heavier and slower.",
  },
  NEUTRALIZATION: {
    hint: "Neutralization: opposite charges cancel and release heat.",
    explanation: "Contacts between oppositely charged particles reduce both charges and produce thermal energy.",
    system: "Charge annihilation. With CHARGE_LAW it calms electric storms; with HEAT it feeds thermal feedback.",
    advanced: "Heat released is proportional to the product of the two charges.",
  },
  STOICHIOMETRY: {
    hint: "Stoichiometry: mass is conserved in every exchange.",
    explanation: "When mass or energy changes hands, an equal and opposite amount is passed to the partner — no free mass.",
    system: "Balance enforcement. With ACCR it makes mergers exact; with PARASITE it caps extraction at the host's loss.",
    advanced: "Corrects drift so total mass in each pair interaction stays constant.",
  },
  AUTOCATALYSIS: {
    hint: "Autocatalysis: a species catalyses its own reactions.",
    explanation: "Same-species contacts boost each other's energy conversion — the chemistry feeds itself.",
    system: "Self-catalysis. With CATALYSIS_LAW it amplifies reactions; with SYMBIOSIS it rewards same-species cliques.",
    advanced: "Reaction gain is squared for same-species pairs, making species purity advantageous.",
  },
  ADIABATIC: {
    hint: "Adiabatic: motion converts to heat without loss.",
    explanation: "Kinetic energy is converted into TEMPERATURE at constant total energy — compression heats without waste.",
    system: "Lossless KE→heat. With HEAT it seeds thermal noise; with COLD it keeps falling particles warm.",
    advanced: "Total kinetic+thermal energy of the pair is conserved.",
  },
  COMPRESSION: {
    hint: "Compression: particles shrink and heat up under pressure.",
    explanation: "High-pressure (crowded) particles reduce RADIUS and raise TEMPERATURE.",
    system: "Density-driven squeeze. With PRECIPITATION it forms dense cores; with EXPANSION it counteracts.",
    advanced: "Uses neighbourhood pressure from the spatial grid.",
  },
  EXPANSION: {
    hint: "Expansion: particles swell and cool when sparse.",
    explanation: "Isolated particles grow RADIUS and shed TEMPERATURE, drifting apart like cooling gas.",
    system: "Rarefaction cooling. With COMPRESSION it opposes; with TURBULENCE it lets gas fill the dish.",
    advanced: "Expansion is limited by the particle's species base radius.",
  },
  EQUILIBRIUM: {
    hint: "Equilibrium: heat flows from hot to cold neighbours.",
    explanation: "Contacts exchange TEMPERATURE toward the pair's mean — thermal conduction between particles.",
    system: "Neighbour diffusion. With HEAT it spreads warmth; with COLD it equalises chill.",
    advanced: "Exchange rate is symmetric, conserving total temperature.",
  },
  LATENT_HEAT: {
    hint: "Latent heat: phase changes absorb or release energy.",
    explanation: "Mass changes absorb or release TEMPERATURE in bursts, buffering phase transitions.",
    system: "Phase-change buffer. With MELT/BOIL it smooths transitions; with SUBLIMATION it feeds the vapour.",
    advanced: "The buffer uses the pair's combined mass as its capacity.",
  },
  RUNAWAY: {
    hint: "Runaway: hot particles produce more heat.",
    explanation: "TEMPERATURE above a threshold generates additional heat — a positive feedback that can cascade.",
    system: "Thermal feedback. With HEAT it accelerates; with EQUILIBRIUM the cascade is capped by diffusion.",
    advanced: "Gain is quadratic above the threshold — designed to produce flares.",
  },
  CONSCIOUSNESS: {
    hint: "Consciousness: particles hold a model of themselves.",
    explanation: "Each particle slowly regenerates ENERGY and MEMORY from its own internal state, gaining a small self-preserving drive.",
    system: "Self-model persistence. With MIND it forms local awareness; with SOUL_LAW it anchors identity.",
    advanced: "Self-repair scales with SIGNAL — a particle aware of its own pulses.",
  },
  PERCEPTION: {
    hint: "Perception: awareness extends far beyond touch.",
    explanation: "Particles sense the world at a larger radius, responding to neighbours they could not feel before.",
    system: "Extended sensing range. With TELEPATHY it spans the dish; with TRACK it sharpens pursuit.",
    advanced: "Scales NEIGHBORHOOD_RADIUS DNA; pairs are formed only when both perceive.",
  },
  SYNCHRONICITY: {
    hint: "Synchronicity: meaningful coincidences align the swarm.",
    explanation: "Particles whose SIGNAL phases are similar gently pull their velocities and phases together — resonant alignment.",
    system: "Phase resonance. With PRECOGNITION it anticipates; with COHERENCE it locks motion.",
    advanced: "Coupling strength is proportional to phase agreement.",
  },
  ANTENNA: {
    hint: "Antenna: particles broadcast signal directionally.",
    explanation: "Signaling particles emit a stronger, focused pulse that carries further along their velocity axis.",
    system: "Directive emission. With COMMS it extends range; with SIGNAL_BOOST it amplifies relay.",
    advanced: "Emission gain peaks along the velocity direction and falls off to the sides.",
  },
  SHIELDING: {
    hint: "Shielding: a Faraday cage blocks external EM forces.",
    explanation: "Particles with stored charge resist incoming electric and magnetic forces, trading ENERGY for protection.",
    system: "EM isolation. With CHARGE_LAW it calms storms; with DISCHARGE it prevents stray arcs.",
    advanced: "Shield strength scales with stored CAPACITANCE charge.",
  },
  POLARIZATION: {
    hint: "Polarization: signals are filtered by channel alignment.",
    explanation: "Only signals matching a particle's TUNING channel pass through; mismatched signals are absorbed and decay.",
    system: "Channel filtering. With COMMS it sharpens directed communication; with STIGMERGY it selects trails.",
    advanced: "Uses TUNING_CH1-4 DNA; absorbed signals contribute small ENERGY.",
  },
  NAVIGATION: {
    hint: "Navigation: particles steer toward remembered hotspots.",
    explanation: "Memory-rich regions attract particles — the past becomes a map that guides movement.",
    system: "Memory-gradient following. With HISTORY it reads the global field; with STIGMERGY it follows local trails.",
    advanced: "Attraction uses MEMORY and the HISTORY field when both are on.",
  },
  ENCRYPTION: {
    hint: "Encryption: signals are scrambled but last longer.",
    explanation: "Signals decay more slowly and resist interception, at the cost of slightly weaker amplitude.",
    system: "Robust coding. With PROTOCOL it synchronises securely; with COMMS it makes networks private.",
    advanced: "Decay floor is raised; amplitude is reduced proportionally.",
  },
  SUPERPOSITION: {
    hint: "Superposition: particles hold multiple velocities at once.",
    explanation: "Each particle carries a spread of possible velocities; random sampling collapses one each tick, adding variance.",
    system: "Dual-state kinetics. With UNCERTAINTY it widens; with DECOHERENCE it damps.",
    advanced: "The spread is stored as a small internal state, not a new stride slot.",
  },
  TUNNELING: {
    hint: "Tunneling: particles occasionally pass straight through barriers.",
    explanation: "A small chance each tick lets a particle ignore its interactions and phase-shift a short distance.",
    system: "Barrier penetration. With BOND it can escape stable links; with FERMIONIC it breaks exclusion stacking.",
    advanced: "Chance scales with energy and speed.",
  },
  DECOHERENCE: {
    hint: "Decoherence: quantum spread collapses into classical order.",
    explanation: "Velocity variance is damped each tick and excess energy is radiated as signal — measurement by the world.",
    system: "Wavefunction collapse. With SUPERPOSITION it opposes; with OBSERVER it accelerates collapse.",
    advanced: "Radiation feeds the SIGNAL field, coupling quantum noise to communication.",
  },
  WAVE_PARTICLE: {
    hint: "Wave-particle: behaviour depends on speed.",
    explanation: "Slow particles act like waves (smooth, spread motion); fast particles act like particles (sharp, direct motion).",
    system: "Speed-gated duality. With SUPERPOSITION it blends; with DRAG it shifts the regime.",
    advanced: "Transition speed is fixed; DNA FORCE shifts the bias.",
  },
  UNCERTAINTY: {
    hint: "Uncertainty: position and velocity cannot both be known.",
    explanation: "Fast particles jitter position; slow particles get velocity kicks — an irreducible uncertainty tradeoff.",
    system: "Heisenberg-style jitter. With SUPERPOSITION it widens spread; with COHERENCE it fights precision.",
    advanced: "Jitter magnitude is inversely proportional to local time step stability.",
  },
  TELEPORT: {
    hint: "Teleport: particles quantum-jump across the dish.",
    explanation: "A rare, energy-costly event moves a particle to a random location, ignoring distance.",
    system: "Non-local transport. With ENTANGLEMENT it can swap into a partner's location; with PRECOGNITION it avoids hazards.",
    advanced: "Costs ENERGY proportional to distance jumped.",
  },
  OBSERVER: {
    hint: "Observer: measurement collapses nearby states.",
    explanation: "Particles with high MEMORY act as observers — they damp the spread of nearby particles and copy their state.",
    system: "Measurement collapse. With PERCEPTION the observer radius grows; with DECOHERENCE it accelerates collapse.",
    advanced: "Observed particles lose variance but gain a memory imprint.",
  },
  PLANCK: {
    hint: "Planck: energy moves only in discrete quanta.",
    explanation: "Energy and velocity changes are rounded to fixed quantum steps, quantising all motion.",
    system: "Discrete spectrum. With HEAT it creates thermal bands; with PRECIPITATION it sizes clumps.",
    advanced: "Quantum step is fixed; species MASS changes the visible granularity.",
  },
  COHERENCE: {
    hint: "Coherence: neighbouring particles phase-lock.",
    explanation: "Particles that share similar velocities lock together, damping relative motion and aligning pulses.",
    system: "Phase-locking. With SYNCHRONICITY it aligns signals; with BOSONIC it forms stable clusters.",
    advanced: "Lock strength rises with pair phase agreement; light particles lock fastest.",
  },
  BOSONIC: {
    hint: "Bosonic: force-carriers gather into clusters.",
    explanation: "Particles feel a strong mutual attraction when close, acting like force-carrying bosons that glue matter together.",
    system: "Bose-style clustering. With COHERENCE it forms lattices; with FERMIONIC it competes for space.",
    advanced: "Attraction only inside a short range — glue, not gravity.",
  },
  FERMIONIC: {
    hint: "Fermionic: no two particles share a state.",
    explanation: "Particles resist stacking: overlapping particles push apart so no two occupy the same state.",
    system: "Exclusion principle. With BOSONIC it balances clustering; with COLL it sharpens scattering.",
    advanced: "Push force grows sharply below a species-scaled exclusion radius.",
  },
  SPIN: {
    hint: "Spin: particles carry intrinsic angular momentum.",
    explanation: "Each particle has a small spin phase that produces a perpendicular wiggle, visible as precession.",
    system: "Intrinsic rotation. With ROTATION it couples to the world spin; with MAGNETISM it aligns with fields.",
    advanced: "Spin direction is set by particle index parity; speed scales with ENERGY.",
  },
  SPECTRAL: {
    hint: "Spectral: particles emit characteristic signal lines.",
    explanation: "Each particle emits a weak, species-specific signal tone that marks its identity in the field.",
    system: "Identity radiation. With COMMS it tags conversations; with GENOTYPE it fingerprints lineages.",
    advanced: "Tone depends on SPECIES_ID; amplitude depends on ENERGY.",
  },
  WAVEFUNCTION: {
    hint: "Wavefunction: position is a probability cloud.",
    explanation: "Particle position is blurred — movement is smoothed and positions round to a wave grid, making motion probabilistic.",
    system: "Probability envelope. With UNCERTAINTY it widens; with OBSERVER it collapses.",
    advanced: "Blur is applied at integration time, preserving conservation on average.",
  },
  HYPERPLANE: {
    hint: "Hyperplane: a fourth spatial axis drifts through the dish.",
    explanation: "Particles drift along a hidden axis that slowly tilts, injecting a smooth global shear into the world.",
    system: "Extra-dimensional drift. With DIMENSIONALITY it extends the fold; with ROTATION it twists the plane.",
    advanced: "Shear is uniform and slow — invisible except in long trajectories.",
  },
  ANTIMATTER: {
    hint: "Antimatter: opposites annihilate on contact.",
    explanation: "Contacts between particles of opposite charge parity annihilate both, releasing a burst of energy and signal.",
    system: "Pair annihilation. With ENERGY it converts matter to heat; with SPECTRAL it flashes a bright line.",
    advanced: "Annihilation removes both particles — use carefully.",
  },
};
