export const LAW_DATA = [
    {
        id: 'GRAV', name: 'Global Gravity', category: 'PHYSICS',
        desc: 'Fundamental attraction between mass-bearing entities. Governs large-scale structure and orbital dynamics.',
        synergies: [
            { with: ['TIME'], label: 'Relativistic Dilation', effect: 'Dense gravity wells slow local simulation time (localDt).', type: 'double' },
            { with: ['MIND'], label: 'Hive Centroid', effect: 'Species cluster toward their collective mass center.', type: 'double' },
            { with: ['COLL', 'ACCR'], label: 'PROTO_STAR', effect: 'High-density accretion triggers stellar mass growth and light emission.', type: 'triple' }
        ]
    },
    {
        id: 'DRAG', name: 'Fluid Friction', category: 'PHYSICS',
        desc: 'Linear velocity dampening based on medium viscosity. Prevents runaway kinetic energy.',
        synergies: [
            { with: ['HEAT'], label: 'Thermal Thinning', effect: 'High temperatures reduce drag coefficient.', type: 'double' },
            { with: ['SOUL'], label: 'Ectoplasmic Drift', effect: 'Persistence state ignores drag entirely.', type: 'double' },
            { with: ['ENTR', 'PLANET'], label: 'ATMOSPHERE', effect: 'Stable vertical layers of variable friction.', type: 'triple' }
        ]
    },
    {
        id: 'ENTR', name: 'Entropy (Jitter)', category: 'PHYSICS',
        desc: 'Stochastic noise injection. Simulates Brownian motion and prevents static equilibrium.',
        synergies: [
            { with: ['CRYS'], label: 'Annealing', effect: 'Noise allows crystalline lattices to settle into lower-energy states.', type: 'double' },
            { with: ['MIND'], label: 'Collective Shimmer', effect: 'Hive-mind synchronizes jitter vectors into a unified pulse.', type: 'double' },
            { with: ['COLD', 'DEPO'], label: 'FROST_FRACTAL', effect: 'Slow noise in cold zones drives complex branching growth.', type: 'triple' }
        ]
    },
    {
        id: 'WRAP', name: 'Toroidal Topology', category: 'PHYSICS',
        desc: 'Modular coordinate system. Particles exiting one boundary reappear on the opposite side.',
        synergies: [
            { with: ['TELE'], label: 'Wormhole Loop', effect: 'Boundary crossing has a chance to trigger random spatial jumps.', type: 'double' },
            { with: ['TIME'], label: 'Horizon Dilation', effect: 'Velocity increases near boundaries to simulate spatial compression.', type: 'double' },
            { with: ['TELE', 'DIME'], label: 'NON_EUCLIDEAN_FLUX', effect: 'Boundaries become portals to alternate dimensions.', type: 'triple' }
        ]
    },
    {
        id: 'COLL', name: 'Physical Collisions', category: 'PHYSICS',
        desc: 'Elastic impulse resolution. Prevents entity overlap and drives kinetic transfer.',
        synergies: [
            { with: ['RAD'], label: 'Impact Mutation', effect: 'Collisions between radioactive bodies trigger DNA drift.', type: 'double' },
            { with: ['EXOP'], label: 'Impact Fusion', effect: 'Collisions generate significant heat (Energy gain).', type: 'double' },
            { with: ['ACCR', 'OXID'], label: 'COMBUSTION_MERGE', effect: 'Fusion collisions result in explosive energy release.', type: 'triple' }
        ]
    },
    {
        id: 'ACCR', name: 'Mass Accretion', category: 'PHYSICS',
        desc: 'Merges colliding entities into a single, more massive survivor.',
        synergies: [
            { with: ['POLY'], label: 'Structural Chaining', effect: 'Accreted mass forms linear polymers instead of spheres.', type: 'double' },
            { with: ['REDU'], label: 'Endothermic Fusion', effect: 'Merging absorbs energy from the surrounding field.', type: 'double' },
            { with: ['GRAV', 'BOND', 'STIFF'], label: 'PLANETARY_CORE', effect: 'Stable, high-mass solid center formed through accretion.', type: 'quad' }
        ]
    },
    {
        id: 'PLANET', name: 'Planetary Gravity', category: 'PHYSICS',
        desc: 'Constant downward vector. Implements a ground boundary and atmospheric layering.',
        synergies: [
            { with: ['CONV'], label: 'Atmospheric Cells', effect: 'Vertical convection loops strengthened by constant gravity.', type: 'double' },
            { with: ['ACID'], label: 'Toxic Floor', effect: 'The ground boundary gains corrosive properties.', type: 'double' },
            { with: ['CONV', 'RADI', 'BOIL'], label: 'SOLAR_CONVECTION', effect: 'Deep vertical thermal loops found in stars.', type: 'quad' }
        ]
    },
    {
        id: 'VOID', name: 'Vacuum Pressure', category: 'PHYSICS',
        desc: 'Repulsive dispersion in low-density regions. Prevents total structural collapse.',
        synergies: [
            { with: ['SUBL'], label: 'Instant Evaporation', effect: 'Lone particles in the void lose mass until they join a cluster.', type: 'double' },
            { with: ['FATE'], label: 'Trajectory Lock', effect: 'Void particles move in straight lines until impact.', type: 'double' }
        ]
    },
    {
        id: 'BOND', name: 'Molecular Bonding', category: 'PHYSICS',
        desc: 'Elastic spring links between entities. Foundational for multi-cellular structures.',
        synergies: [
            { with: ['CRYS'], label: 'Lattice Hardening', effect: 'Bonding forces become near-infinite in crystalline states.', type: 'double' },
            { with: ['GLOW'], label: 'Signal Wire', effect: 'Signals propagate 10x faster through bonded chains.', type: 'double' }
        ]
    },
    {
        id: 'HEAT', name: 'Heat Output', category: 'THERMO',
        desc: 'Increases kinetic energy globally via stochastic thermal noise.',
        synergies: [
            { with: ['BOIL'], label: 'Vaporization', effect: 'Runaway thermal expansion and repulsive bursts.', type: 'double' },
            { with: ['DRAG'], label: 'Thermal Thinning', effect: 'Heat reduces effective fluid drag.', type: 'double' },
            { with: ['REPRO', 'RAD'], label: 'THERMAL_MUTATION', effect: 'Heat accelerates breeding while radiation corrupts results.', type: 'triple' }
        ]
    },
    {
        id: 'COLD', name: 'Cold Sink', category: 'THERMO',
        desc: 'Massive dampening of velocity vectors. Prevents kinetic escape.',
        synergies: [
            { with: ['CRYS'], label: 'Instant Lattice', effect: 'Low energy triggers immediate geometric snapping.', type: 'double' },
            { with: ['DEPO'], label: 'Frost Growth', effect: 'Particles instantly freeze upon entering cold zones.', type: 'double' }
        ]
    },
    {
        id: 'CONV', name: 'Convection', category: 'THERMO',
        desc: 'Vertical fluid flow based on internal energy. Hot rises, cold sinks.',
        synergies: [
            { with: ['PLANET'], label: 'Weather Layers', effect: 'Stable cyclonic patterns in gravitational environments.', type: 'double' },
            { with: ['VOID'], label: 'Cosmic Drift', effect: 'Energy gradients push matter toward or away from the void.', type: 'double' }
        ]
    },
    {
        id: 'RADI', name: 'Thermal Radiation', category: 'THERMO',
        desc: 'High-energy bodies emit repulsive waves proportional to temperature.',
        synergies: [
            { with: ['RAD'], label: 'Stellar Wind', effect: 'Combination of thermal repulsion and mutagenic fields.', type: 'double' },
            { with: ['ASTR'], label: 'Ghost Heat', effect: 'Repulsive waves that only affect Astral entities.', type: 'double' }
        ]
    },
    {
        id: 'SUBL', name: 'Sublimation', category: 'THERMO',
        desc: 'Phase transition from solid/cluster state directly to high-velocity vapor.',
        synergies: [
            { with: ['VOID'], label: 'Vacuum Boiling', effect: 'Lone particles sublimate at 5x speed in the void.', type: 'double' },
            { with: ['EXOP'], label: 'Explosive Decompression', effect: 'Chemical energy release triggers instant dispersion.', type: 'double' }
        ]
    },
    {
        id: 'MELT', name: 'Melting Point', category: 'THERMO',
        desc: 'Deconstruction of structural bonds in high-energy or high-density zones.',
        synergies: [
            { with: ['BOND'], label: 'Link Decay', effect: 'Bonds become elastic and eventually break at high temps.', type: 'double' },
            { with: ['ACID'], label: 'Corrosive Liquefaction', effect: 'Acid works faster on melted/loosened structures.', type: 'double' }
        ]
    },
    {
        id: 'BOIL', name: 'Boiling', category: 'THERMO',
        desc: 'Explosive volume expansion upon reaching high energy thresholds.',
        synergies: [
            { with: ['EXOP'], label: 'Steam Explosion', effect: 'Collision energy triggers instant boiling bursts.', type: 'double' },
            { with: ['CONV'], label: 'Thermal Geysers', effect: 'Boiling particles rise at 10x speed.', type: 'double' }
        ]
    },
    {
        id: 'BIOL', name: 'Life Lifecycle', category: 'BIOLOGY',
        desc: 'Master toggle for metabolism, aging, and population health.',
        synergies: [
            { with: ['TIME'], label: 'Biological Stasis', effect: 'Time dilation freezes biological decay.', type: 'double' },
            { with: ['SOUL'], label: 'Reincarnation', effect: 'Death triggers an identity-preserving respawn.', type: 'double' },
            { with: ['ENER', 'MIND'], label: 'HIVE_METABOLISM', effect: 'Shared energy pool and centralized control.', type: 'triple' }
        ]
    },
    {
        id: 'GLOW', name: 'Signaling', category: 'BIOLOGY',
        desc: 'Communication via visual pulses and spatio-temporal signal fields.',
        synergies: [
            { with: ['MIND'], label: 'Neural Pulse', effect: 'Signals from one are mirrored by the whole hive.', type: 'double' },
            { with: ['CATA'], label: 'Reaction Signal', effect: 'Pulses catalyze nearby chemical reactions.', type: 'double' }
        ]
    },
    {
        id: 'AFFIN', name: 'Species Affinity', category: 'BIOLOGY',
        desc: 'Selective attraction or repulsion based on species identity.',
        synergies: [
            { with: ['CHIR'], label: 'Chiral Selection', effect: 'Affinity only works between matching spin states.', type: 'double' },
            { with: ['ISOM'], label: 'Identity Flux', effect: 'Isomerization turns affinity into sudden repulsion.', type: 'double' }
        ]
    },
    {
        id: 'REPRO', name: 'Reproduction', category: 'BIOLOGY',
        desc: 'Governs spawning of new entities based on energy and spawn rates.',
        synergies: [
            { with: ['RAD'], label: 'Mutant Birth', effect: 'Offspring in radiation zones start with corrupted DNA.', type: 'double' },
            { with: ['POLY'], label: 'Mitosis', effect: 'Entities split into bonded pairs instead of spawning.', type: 'double' }
        ]
    },
    {
        id: 'TRACK', name: 'Tracking', category: 'BIOLOGY',
        desc: 'Target-based attraction bias. Foundation for predation and navigation.',
        synergies: [
            { with: ['CLAI'], label: 'Perfect Hunter', effect: 'Tracking vectors ignore jitter/chaos noise.', type: 'double' },
            { with: ['PREO'], label: 'Evasion Loop', effect: 'Hunters and prey enter complex orbital dances.', type: 'double' }
        ]
    },
    {
        id: 'SENES', name: 'Senescence', category: 'BIOLOGY',
        desc: 'Age-based metabolic decline. Increases energy tax over time.',
        synergies: [
            { with: ['TIME'], label: 'Eternal Youth', effect: 'Time dilation in dense clusters prevents aging.', type: 'double' },
            { with: ['ALLO'], label: 'Metamorphic Growth', effect: 'Entities change allotrope state as they age.', type: 'double' }
        ]
    },
    {
        id: 'GENO', name: 'Genotype Drift', category: 'BIOLOGY',
        desc: 'Continuous mutation of DNA parameters without breeding events.',
        synergies: [
            { with: ['MIND'], label: 'Convergent Evolution', effect: 'Hive forces drift toward the average species DNA.', type: 'double' },
            { with: ['CRYS'], label: 'Data Preservation', effect: 'Crystalline entities have zero genotype drift.', type: 'double' }
        ]
    },
    {
        id: 'PHENO', name: 'Phenotype', category: 'BIOLOGY',
        desc: 'Physical manifestation of DNA. Links traits to size and transparency.',
        synergies: [
            { with: ['DIME'], label: 'Visual Phasing', effect: 'Phasing entities become transparent proportional to dimension state.', type: 'double' },
            { with: ['HEAT'], label: 'Thermal Glow', effect: 'Internal energy increases visible glow intensity.', type: 'double' }
        ]
    },
    {
        id: 'ENER', name: 'Energy Conservation', category: 'BIOLOGY',
        desc: 'Strict metabolic accounting. Energy management is required for survival.',
        synergies: [
            { with: ['REDU'], label: 'Photosynthesis', effect: 'Direct conversion of heat to internal energy.', type: 'double' },
            { with: ['MIND'], label: 'Shared Battery', effect: 'Energy is perfectly distributed across species.', type: 'double' }
        ]
    },
    {
        id: 'RAD', name: 'Radiation', category: 'BIOLOGY',
        desc: 'Mutagenic emission from high-energy or specific radioactive entities.',
        synergies: [
            { with: ['GENO'], label: 'Hyper-Evolution', effect: 'Radiation triggers immediate genotype drift spikes.', type: 'double' },
            { with: ['ASTR'], label: 'Spectral Decay', effect: 'Ghost forms leave radiation trails in their wake.', type: 'double' }
        ]
    },
    {
        id: 'COND', name: 'Condensation', category: 'THERMO',
        desc: 'Local gravitational amplification in low-energy (cold) pockets.',
        synergies: [
            { with: ['COLL'], label: 'Droplet Formation', effect: 'Condensing particles form tight, elastic clusters.', type: 'double' },
            { with: ['SOLV'], label: 'Dissolving Mist', effect: 'Condensation traps solvent particles in dense clouds.', type: 'double' }
        ]
    },
    {
        id: 'DEPO', name: 'Deposition', category: 'THERMO',
        desc: 'Instant phase transition from vapor to solid upon contact with cold zones.',
        synergies: [
            { with: ['ORDE'], label: 'Grid Freezing', effect: 'Particles freeze into perfect grid alignment.', type: 'double' },
            { with: ['STIFF'], label: 'Brittle Growth', effect: 'Deposited matter has maximum stiffness but low elasticity.', type: 'double' }
        ]
    },
    {
        id: 'EXOP', name: 'Exothermic', category: 'THERMO',
        desc: 'Interactions release kinetic energy back into the global field.',
        synergies: [
            { with: ['OXID'], label: 'Chain Reaction', effect: 'Oxidation events trigger secondary exothermic bursts.', type: 'double' },
            { with: ['CATA'], label: 'Thermal Multiplier', effect: 'Catalysis doubles exothermic energy release.', type: 'double' }
        ]
    },
    {
        id: 'CATA', name: 'Catalysis', category: 'CHEMISTRY',
        desc: 'Interaction rate multiplier. Speeds up local systemic changes.',
        synergies: [
            { with: ['POLY'], label: 'Rapid Growth', effect: 'Polymerization speed is tripled.', type: 'double' },
            { with: ['GLOW'], label: 'Reaction Signal', effect: 'Signals trigger immediate catalytic spikes.', type: 'double' }
        ]
    },
    {
        id: 'SOLV', name: 'Solvation', category: 'CHEMISTRY',
        desc: 'Interaction force dampening. Foundational for liquid-state simulation.',
        synergies: [
            { with: ['ACID'], label: 'Digestive Fluid', effect: 'Bonds break while mass is consumed.', type: 'double' },
            { with: ['BOND'], label: 'Bond Decay', effect: 'Structural links weaken and dissolve over time.', type: 'double' }
        ]
    },
    {
        id: 'ACID', name: 'Acidity', category: 'CHEMISTRY',
        desc: 'Corrosive mass degradation on contact. Dissolves structures.',
        synergies: [
            { with: ['VOID'], label: 'Dissolving Void', effect: 'Acidic particles expand rapidly in sparse regions.', type: 'double' },
            { with: ['ALLO'], label: 'Identity Erosion', effect: 'Acid contact changes victim allotrope state.', type: 'double' }
        ]
    },
    {
        id: 'OXID', name: 'Oxidation', category: 'CHEMISTRY',
        desc: 'Energy release during interaction. Primary driver of combustion.',
        synergies: [
            { with: ['HEAT'], label: 'Thermal Runaway', effect: 'Oxidation injects extreme heat into the field.', type: 'double' },
            { with: ['GLOW'], label: 'Signaling Flash', effect: 'Reaction creates a high-intensity communication pulse.', type: 'double' }
        ]
    },
    {
        id: 'REDU', name: 'Reduction', category: 'CHEMISTRY',
        desc: 'Mass gain through energy absorption. Foundational for biological growth.',
        synergies: [
            { with: ['COLD'], label: 'Ice Growth', effect: 'Reduction is 10x more effective in cold zones.', type: 'double' },
            { with: ['RAD'], label: 'Energy Harvesting', effect: 'Entities gain energy from radiation fields.', type: 'double' }
        ]
    },
    {
        id: 'POLY', name: 'Polymerization', category: 'CHEMISTRY',
        desc: 'Rigid linear chaining. Foundations of multi-cellular architecture.',
        synergies: [
            { with: ['MIND'], label: 'Neural Net', effect: 'Chains act as a single contiguous intelligence.', type: 'double' },
            { with: ['CHIR'], label: 'Helical Chains', effect: 'Creation of rotating helical structures.', type: 'double' }
        ]
    },
    {
        id: 'ISOM', name: 'Isomerization', category: 'CHEMISTRY',
        desc: 'Spontaneous geometry reconfiguration. Random species state shifts.',
        synergies: [
            { with: ['SOUL'], label: 'Ancestral Memory', effect: 'Preserves memory slots during species shift.', type: 'double' },
            { with: ['GENO'], label: 'Mutation Catalyst', effect: 'Doubles the rate of genotype drift.', type: 'double' }
        ]
    },
    {
        id: 'CHIR', name: 'Chirality', category: 'CHEMISTRY',
        desc: 'Bonding compatibility based on spin. Forces left/right segregation.',
        synergies: [
            { with: ['BOND'], label: 'Chiral Links', effect: 'Bonds only form between identical spin states.', type: 'double' },
            { with: ['GRAV'], label: 'Chiral Gravity', effect: 'Mismatched spins repel each other.', type: 'double' }
        ]
    },
    {
        id: 'CRYS', name: 'Crystallization', category: 'CHEMISTRY',
        desc: 'Forces particles into rigid geometric lattices.',
        synergies: [
            { with: ['ORDE'], label: 'Lattice Lock', effect: 'Instant snapping to perfect hexagonal grids.', type: 'double' },
            { with: ['GENO'], label: 'Genetic Stability', effect: 'Stops all DNA drift within the crystal.', type: 'double' }
        ]
    },
    {
        id: 'ALLO', name: 'Allotropy', category: 'CHEMISTRY',
        desc: 'Phase shifting between species states without mass loss.',
        synergies: [
            { with: ['HEAT'], label: 'Phase Transition', effect: 'Identity changes based on internal energy level.', type: 'double' },
            { with: ['PLANET'], label: 'Sedimentation', effect: 'Entities become heavier states near the floor.', type: 'double' }
        ]
    },
    {
        id: 'TIME', name: 'Time Dilation', category: 'METAPHYSICS',
        desc: 'Local physics step (dt) scaling based on mass and velocity.',
        synergies: [
            { with: ['GRAV'], label: 'Relativistic Unity', effect: 'Dense wells freeze time for internal particles.', type: 'double' },
            { with: ['FATE'], label: 'Absolute Time', effect: 'Fated entities ignore local dilation.', type: 'double' }
        ]
    },
    {
        id: 'DIME', name: 'Dimensionality', category: 'METAPHYSICS',
        desc: 'Phasing logic allowing bypass of 3D collision constraints.',
        synergies: [
            { with: ['TELE'], label: 'Phase Jump', effect: 'Phasing triggers a random short-range teleport.', type: 'double' },
            { with: ['ASTR'], label: 'Spectral Form', effect: 'Total physical intangibility.', type: 'double' }
        ]
    },
    {
        id: 'CHAO', name: 'Chaos Factor', category: 'METAPHYSICS',
        desc: 'Extreme stochastic vector injection. Total non-linear behavior.',
        synergies: [
            { with: ['WILL'], label: 'Unbound Will', effect: 'Free will events become 100% likely.', type: 'double' },
            { with: ['ACCR'], label: 'Black Hole', effect: 'Runaway accretion radius.', type: 'double' }
        ]
    },
    {
        id: 'ORDE', name: 'Total Order', category: 'METAPHYSICS',
        desc: 'Absolute coordinate grid alignment and snapping.',
        synergies: [
            { with: ['FATE'], label: 'Taxi-cab Destiny', effect: 'Movement is restricted to grid axes.', type: 'double' },
            { with: ['MIND'], label: 'Geometric Mind', effect: 'Hive forms perfect squares or cubes.', type: 'double' }
        ]
    },
    {
        id: 'FATE', name: 'Determinism', category: 'METAPHYSICS',
        desc: 'Velocity lock. Disables all force-based acceleration.',
        synergies: [
            { with: ['SOUL'], label: 'Path Persistence', effect: 'Reincarnated entities follow their previous life path.', type: 'double' },
            { with: ['WILL'], label: 'Destiny Duel', effect: 'Will events can break the Fate lock for 1 frame.', type: 'double' }
        ]
    },
    {
        id: 'WILL', name: 'Free Will', category: 'METAPHYSICS',
        desc: 'Low-probability spontaneous velocity reversal.',
        synergies: [
            { with: ['CLAI'], label: 'Proactive Evasion', effect: 'Velocity reversal happens before impact.', type: 'double' },
            { with: ['MIND'], label: 'Collective Rebellion', effect: 'Single Will event flips the entire species direction.', type: 'double' }
        ]
    },
    {
        id: 'SOUL', name: 'Soul Persistence', category: 'METAPHYSICS',
        desc: 'Data reincarnation and identity preservation across cycles.',
        synergies: [
            { with: ['ASTR'], label: 'Possession', effect: 'Astral entities can force immediate revival of Souls.', type: 'double' },
            { with: ['PHENO'], label: 'Ghost Visuals', effect: 'Souls rendered as wireframe hollow circles.', type: 'double' }
        ]
    },
    {
        id: 'MIND', name: 'Hive Mind', category: 'METAPHYSICS',
        desc: 'Global telepathic state and velocity synchronization.',
        synergies: [
            { with: ['ENER'], label: 'Shared Battery', effect: 'Energy is equalized across all hive members.', type: 'double' },
            { with: ['GLOW'], label: 'Neural Pulse', effect: 'Immediate species-wide signal mirroring.', type: 'double' }
        ]
    },
    {
        id: 'TELE', name: 'Teleportation', category: 'METAPHYSICS',
        desc: 'Instant spatial relocation at random or boundary intervals.',
        synergies: [
            { with: ['RAD'], label: 'Wormhole Blast', effect: 'Teleportation leaves a radioactive wake.', type: 'double' },
            { with: ['WRAP'], label: 'Boundary Warp', effect: 'Edge crossing triggers random coordinates.', type: 'double' }
        ]
    },
    {
        id: 'CLAI', name: 'Clairvoyance', category: 'METAPHYSICS',
        desc: 'Look-ahead collision avoidance and boundary navigation.',
        synergies: [
            { with: ['PREO'], label: 'Navigation God', effect: 'Perfect traversal of obstacle courses.', type: 'double' },
            { with: ['TRACK'], label: 'Intercept', effect: 'Hunters predict prey future positions.', type: 'double' }
        ]
    },
    {
        id: 'PREO', name: 'Precognition', category: 'METAPHYSICS',
        desc: 'Proactive evasion of high-density or high-energy zones.',
        synergies: [
            { with: ['BOIL'], label: 'Thermal Evasion', effect: 'Entities flee hot spots before explosions.', type: 'double' },
            { with: ['VOID'], label: 'Void Balance', effect: 'Entities stay exactly at the void/cluster threshold.', type: 'double' }
        ]
    },
    {
        id: 'ASTR', name: 'Astral Projection', category: 'METAPHYSICS',
        desc: 'Separation of physical body from interaction sphere. Ghost state.',
        synergies: [
            { with: ['MIND'], label: 'Spectral Hive', effect: 'Entire species shifts into intangibility.', type: 'double' },
            { with: ['SOUL'], label: 'Life Link', effect: 'Astral entities can transfer mass to revive Souls.', type: 'double' }
        ]
    }
];
