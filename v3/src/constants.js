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
export const MAX_PARTICLES = 5000;
export const DEFAULT_PARTICLES_PER_SPECIES = 100;
export const WORLD_SIZE = 400;

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
};

export const DNA_COUNT = 42;

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
];

// --- DNA Ranges [min, max, default] for each of the 42 parameters ---

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
  { min: 0.5,   max: 10,   default: 2.0     },   // 29 BASE_RADIUS
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
};

export const LAW_COUNT = 38;

// --- Law Category Mapping ---

export const LAW_CATEGORIES = {
  physics: {
    color: 'BLUE',
    laws: [
      LAW_INDEXES.GRAV,
      LAW_INDEXES.DRAG,
      LAW_INDEXES.ENTR,
      LAW_INDEXES.WRAP,
      LAW_INDEXES.COLL,
      LAW_INDEXES.ACCR,
      LAW_INDEXES.PLANETARY,
    ],
  },
  biology: {
    color: 'GREEN',
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
    ],
  },
  chemistry: {
    color: 'PURPLE',
    laws: [
      LAW_INDEXES.CATALYSIS_LAW,
      LAW_INDEXES.SOLVATION,
      LAW_INDEXES.ACIDITY,
      LAW_INDEXES.OXIDATION,
      LAW_INDEXES.POLYMER,
      LAW_INDEXES.ISOMERIZATION,
      LAW_INDEXES.CHIRALITY,
      LAW_INDEXES.CRYSTALLIZATION,
    ],
  },
  thermodynamics: {
    color: 'ORANGE',
    laws: [
      LAW_INDEXES.HEAT,
      LAW_INDEXES.COLD,
      LAW_INDEXES.CONVECTION,
      LAW_INDEXES.PHASE_RADIATION,
      LAW_INDEXES.SUBLIMATION,
    ],
  },
  metaphysics: {
    color: 'RED',
    laws: [
      LAW_INDEXES.TIME_DILATION,
      LAW_INDEXES.DIMENSIONALITY,
      LAW_INDEXES.CHAOS,
      LAW_INDEXES.ORDER,
      LAW_INDEXES.FATE,
      LAW_INDEXES.WILL,
      LAW_INDEXES.SOUL_LAW,
      LAW_INDEXES.MIND,
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
