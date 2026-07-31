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
export const DEFAULT_PARTICLES_PER_SPECIES = 200;
export const WORLD_SIZE = 120;

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
};

export const DNA_COUNT = 48;

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
  { min: 0.5,   max: 10,   default: 1.5     },   // 29 BASE_RADIUS
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
};

export const LAW_COUNT = 51;

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
      LAW_INDEXES.VOID,
      LAW_INDEXES.BOND,
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
      LAW_INDEXES.REDUCTION,
      LAW_INDEXES.ALLOY,
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
      LAW_INDEXES.MELT,
      LAW_INDEXES.BOIL,
      LAW_INDEXES.CONDENSE,
      LAW_INDEXES.DEPOSIT,
      LAW_INDEXES.EXOTHERMIC,
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
      LAW_INDEXES.TELEPATHY,
      LAW_INDEXES.CLAIRVOYANCE,
      LAW_INDEXES.PRECOGNITION,
      LAW_INDEXES.ASTRAL,
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


// --- Law HELP_DB (tooltip descriptions) ---
// Mirrors v2 HELP_DB structure: each law has a hint + explanation + system + advanced tier.

export const LAW_HELP_DB = {
  GRAV: {
    hint: "Universal gravitational attraction between all particles.",
    explanation: "Newtonian gravity: F = G*m1*m2/r². Positive force collapses structures; negative force expands them.",
    system: "Fundamental force driving cluster formation and orbital dynamics. Uses HIDDEN_MASS for dark-matter effects.",
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
    system: "Multi-state law: state 1-3 control wrap behavior. Essential for uniform spatial distribution.",
  },
  COLL: {
    hint: "Physical collisions with momentum exchange.",
    explanation: "Particles bounce off each other based on ELASTICITY DNA. Overlapping particles are pushed apart.",
    system: "Impulse-based collision response with mass-weighted velocity exchange. ELASTICITY controls bounciness.",
  },
  ACCR: {
    hint: "Mass accretion on collision.",
    explanation: "When particles collide with sufficient force, they merge. FUSION and FUSION_MOMENTUM DNA control efficiency.",
    system: "Hierarchical mass growth. High fusion leads to proto-celestial body formation.",
  },
  PLANETARY: {
    hint: "Central gravity well at world center.",
    explanation: "All particles experience a gentle pull toward the center of the world, creating a planetary gravity well.",
    system: "Creates a central attractor. Unlike v2's floor bounce, this is a continuous central gravity field.",
  },
  VOID: {
    hint: "Vacuum pressure: empty space pushes particles apart.",
    explanation: "Creates an outward pressure gradient, opposing gravity. Prevents complete gravitational collapse.",
    system: "Acts as cosmological constant / dark energy. Balances gravitational clustering with expansion.",
  },
  BOND: {
    hint: "Molecular bonding between nearby particles.",
    explanation: "Particles can form bonds when close. Bonded pairs experience spring-like restorative forces.",
    system: "Bonds are tracked via BOND_COUNT and BOND_PARTNER slots. Spring force based on STIFFNESS DNA.",
  },
  LIFE: {
    hint: "Biological lifecycle: energy cost, aging, death.",
    explanation: "Particles consume energy over time (based on ENERGY_EFFICIENCY). When energy hits 0, they die.",
    system: "Core ecosystem loop. Also includes hunger tracking and senescence (age-based death).",
  },
  GLOW: {
    hint: "Signaling pulses: particles emit periodic signals.",
    explanation: "Particles pulse with signal strength based on PULSE_RATE DNA. Signals propagate to neighbors.",
    system: "Communication layer. SIGNAL_STRENGTH and SIGNAL_RESP DNA control emission and reception.",
  },
  AFFINITY: {
    hint: "Species-based attraction or repulsion.",
    explanation: "Same-species particles attract; different-species repel if SPECIES_AFFINITY is negative.",
    system: "Uses SPECIES_AFFINITY DNA (index 41). Positive = gregarious, negative = xenophobic.",
  },
  REPRO: {
    hint: "Asexual reproduction: particles spawn offspring.",
    explanation: "When energy > 60 and age > 100, particles have a chance to spawn a child with mutated DNA.",
    system: "MUTATION DNA controls offspring variation. Offspring inherit parent DNA with random perturbations.",
  },
  TRACK: {
    hint: "Predation tracking: particles chase lower-mass prey.",
    explanation: "Particles with high PREDATION_BIAS are attracted to particles with lower mass.",
    system: "Creates predator-prey dynamics. Combines with LIFE and REPRO for full ecosystem simulation.",
  },
  SENESCENCE: {
    hint: "Age-based death: old particles die off.",
    explanation: "Particles past age 500 have increasing death probability based on DEATH_RATE DNA.",
    system: "Prevents immortal particles. Enables generational turnover and evolutionary pressure.",
  },
  ENERGY: {
    hint: "Energy conservation: particles exchange energy.",
    explanation: "Nearby particles transfer energy toward equilibrium, like thermal conduction.",
    system: "Balances energy distribution. Prevents energy hoarding by high-mass particles.",
  },
  RADIATION: {
    hint: "Background radiation damages unprotected particles.",
    explanation: "Particles with low ARMOR take energy damage from ambient radiation.",
    system: "ARMOR DNA provides radiation shielding. Adds environmental pressure to ecosystem.",
  },
  GENOTYPE: {
    hint: "Genetic drift: DNA mutates over time.",
    explanation: "Particles' DNA parameters drift randomly over time, influenced by temperature.",
    system: "Enables long-term evolution. Hotter particles mutate faster. MUTATION DNA controls rate.",
  },
  PHENOTYPE: {
    hint: "Visual phenotype expression from DNA.",
    explanation: "Particle appearance (color, size, opacity) is derived from DNA parameters.",
    system: "POLARITY → hue, ALPHA → saturation, SYMMETRY → lightness. Energy and age modulate.",
  },
  CATALYSIS_LAW: {
    hint: "Catalysis: reactions happen faster.",
    explanation: "Increases the multiplier for all chemical interactions. Speeds up reactions.",
    system: "CATALYSIS DNA (index 38) controls the multiplier. Higher = more reactive.",
  },
  SOLVATION: {
    hint: "Solvation: particles dissolve each other.",
    explanation: "Particles with charge differences exert solvation forces. Like charges repel, opposites attract.",
    system: "Uses POLARITY DNA as charge. Combined with ACIDITY and OXIDATION for full chemistry.",
  },
  ACIDITY: {
    hint: "Acidic charge transfer between particles.",
    explanation: "Particles exchange charge when close, equalizing their electrical potential.",
    system: "CONDUCTIVITY DNA controls transfer rate. Alters CHARGE field in the particle buffer.",
  },
  OXIDATION: {
    hint: "Oxidation: charge transfer with energy release.",
    explanation: "Like acidity but releases heat energy. Particles glow brighter after oxidation events.",
    system: "HEAT_OUTPUT DNA controls energy release. Increases TEMPERATURE and ENERGY.",
  },
  POLYMER: {
    hint: "Polymerization: particles form chain bonds.",
    explanation: "Particles can link into polymer chains by establishing bond connections with neighbors.",
    system: "Bond slots (BOND_PARTNER_1/2) track chain topology. Max 6 bonds per particle.",
  },
  ISOMERIZATION: {
    hint: "Isomerization: bond topology rearrangement.",
    explanation: "Particles with many bonds may release some, creating free fragments.",
    system: "Random bond-breaking events for particles with 3+ bonds. Consumes energy.",
  },
  CHIRALITY: {
    hint: "Chirality: rotational bias from torque.",
    explanation: "Particles with TORQUE DNA receive perpendicular velocity components, inducing spin.",
    system: "Creates rotational dynamics. Positive torque = clockwise, negative = counterclockwise.",
  },
  CRYSTALLIZATION: {
    hint: "Crystallization: same-species rigid lattice formation.",
    explanation: "Same-species particles damp relative velocity when close, forming rigid clusters.",
    system: "Damps relative velocity between same-species neighbors. Creates crystalline structures.",
  },
  HEAT: {
    hint: "Thermal motion: heat adds random jitter to hot particles.",
    explanation: "Particles with high TEMPERATURE receive random velocity kicks proportional to temperature.",
    system: "TEMPERATURE field drives thermal noise. Heat spreads through neighbor conduction.",
  },
  COLD: {
    hint: "Cold slows particles down.",
    explanation: "Particles with low TEMPERATURE have their velocity damped. Cold = less motion.",
    system: "Slows particles below 0.5 temperature. Temperature trends toward equilibrium.",
  },
  CONVECTION: {
    hint: "Convection: buoyant vertical motion from temperature.",
    explanation: "Hot particles rise (positive Y velocity), creating convection currents.",
    system: "Buoyancy = (temp - 0.5) * 0.001. Drives large-scale circulation patterns.",
  },
  PHASE_RADIATION: {
    hint: "Blackbody radiation: hot particles emit energy.",
    explanation: "Particles with energy above 50 radiate excess energy, cooling down.",
    system: "Radiated energy boosts SIGNAL for visual glow. Prevents energy runaway.",
  },
  SUBLIMATION: {
    hint: "Sublimation: low-mass hot particles turn to gas.",
    explanation: "Particles with low mass and high energy may sublimate, losing mass and gaining velocity.",
    system: "Direct solid→gas transition. Reduces mass and adds velocity burst.",
  },
  MELT: {
    hint: "Melting: hot particles lose structural integrity.",
    explanation: "High temperature softens particles, reducing their effective stiffness.",
    system: "STIFFNESS DNA is reduced proportionally to temperature above threshold.",
  },
  BOIL: {
    hint: "Boiling: very hot particles eject mass.",
    explanation: "Particles above boiling temperature shed mass as energetic vapor.",
    system: "Mass is converted to velocity for the ejected fraction. Consumes energy.",
  },
  CONDENSE: {
    hint: "Condensation: cool particles gain mass from vapor.",
    explanation: "Low-energy particles can absorb ambient energy and increase mass.",
    system: "Opposite of boiling. Energy → mass conversion at low temperatures.",
  },
  DEPOSIT: {
    hint: "Deposition: vapor directly solidifies on cold particles.",
    explanation: "Skip the liquid phase: cold particles directly accrete mass from the environment.",
    system: "Gas→solid phase transition. Rapid mass gain for cold, slow particles.",
  },
  EXOTHERMIC: {
    hint: "Exothermic reactions release extra energy.",
    explanation: "Chemical reactions produce more energy than they consume. Amplifies energy dynamics.",
    system: "All interaction energy transfers are amplified by 1.5x. Net energy increase.",
  },
  TIME_DILATION: {
    hint: "Time dilation: SOUL slows local time.",
    explanation: "Particles with high SOUL experience slower local time, giving them more frames to react.",
    system: "localDt = 1.0 - soul * 0.3. SOUL = 1.0 → 70% time speed. Enables bullet-time effects.",
  },
  DIMENSIONALITY: {
    hint: "Dimensional drift: random Z-axis motion.",
    explanation: "Particles receive small random forces in the Z dimension, exploring 3D space.",
    system: "Subtle Z-axis perturbation. Prevents particles from settling into pure 2D planes.",
  },
  CHAOS: {
    hint: "Chaos: strong random forces, system instability.",
    explanation: "Large random forces applied to all particles. Destabilizes structures, creates turbulence.",
    system: "Strong stochastic forcing. Amplified by CHAOS synergy with ORDER (mutual cancellation).",
  },
  ORDER: {
    hint: "Order: velocity alignment, system convergence.",
    explanation: "Particles align their velocity with nearby particles, creating coherent flow.",
    system: "Like Vicsek model alignment. Counteracts CHAOS. Drives system toward ordered states.",
  },
  FATE: {
    hint: "Fate: same-species long-range attraction.",
    explanation: "Particles of the same species are gently attracted across long distances.",
    system: "Long-range (dist² < 250k) same-species attraction. Creates species segregation.",
  },
  WILL: {
    hint: "Will: self-propulsion along current velocity.",
    explanation: "Particles boost their own velocity in the direction they're already moving.",
    system: "Self-propulsion model. Energy-independent: any particle with velocity gets a boost.",
  },
  SOUL_LAW: {
    hint: "Soul: ethereal energy shared between same-species.",
    explanation: "Same-species particles share SOUL energy. Soul accumulates from neighbors.",
    system: "Soul acts as a secondary energy field. Used by TIME_DILATION for local time control.",
  },
  MIND: {
    hint: "Hivemind: collective consciousness signal boost.",
    explanation: "Same-species particles share signal strength, amplifying communication.",
    system: "Signal boost propagates through same-species networks. Creates emergent group behavior.",
  },
  TELEPATHY: {
    hint: "Telepathy: instant information sharing across species.",
    explanation: "All particles of the same species share their SIGNAL state instantly, regardless of distance.",
    system: "Global signal synchronization within species. Bypasses physical propagation limits.",
  },
  CLAIRVOYANCE: {
    hint: "Clairvoyance: particles sense future positions.",
    explanation: "Particles adjust their velocity toward where neighbors will be, not where they are.",
    system: "Predictive steering: uses velocity extrapolation for neighbor targeting.",
  },
  PRECOGNITION: {
    hint: "Precognition: collision anticipation and avoidance.",
    explanation: "Particles predict upcoming collisions and adjust course to avoid them.",
    system: "Anticipatory collision avoidance. Reduces collision frequency at the cost of smoothness.",
  },
  ASTRAL: {
    hint: "Astral projection: souls leave bodies on death.",
    explanation: "When a particle dies, its SOUL persists as a ghost, continuing to influence nearby particles.",
    system: "DEAD=0.5 soul state. Ghosts have reduced alpha but still exert forces on the living.",
  },
  REDUCTION: {
    hint: "Reduction: charge is neutralized between particles.",
    explanation: "Opposite charges cancel out when particles interact, reducing net charge differentials.",
    system: "Chemical reduction. Opposite to OXIDATION. Lowers charge magnitude toward zero.",
  },
  ALLOY: {
    hint: "Alloying: different-species particles fuse into composites.",
    explanation: "Particles of different species can merge, creating hybrid particles with mixed DNA.",
    system: "Cross-species fusion. Creates hybrid offspring with averaged DNA from both parents.",
  },
};
