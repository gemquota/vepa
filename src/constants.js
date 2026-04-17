export const DNA_META = [
    "Force",
    "Viscosity",
    "Torque",
    "Jitter",
    "C1 (Polarity)",
    "C2 (Alpha)",
    "C3 (Symmetry)",
    "Hidden Mass",
    "Stiffness",
    "Fusion",
    "Birth Rate",
    "Death Rate",
    "Mutation",
    "Signal Resp",
    "Pulse Rate",
    "Tidal",
    "Fusion Momentum",
    "Fusion Time",
    "Neighborhood Radius",
    "Signal Strength",
    "Signal Decay",
    "Propagation Speed",
    "Tuning Ch1",
    "Tuning Ch2",
    "Tuning Ch3",
    "Tuning Ch4",
];

export const HELP_DB = {
    "Force": {
        layers: {
            hint: "Controls attraction vs repulsion between particles.",
            explanation: "Positive values pull particles together like gravity, while negative values push them apart.",
            system: "Force defines the baseline structure of the simulation. High positive values create clustering and collapse, while negative values generate expansion and dispersion.",
            advanced: "At scale, strong positive force leads to gravitational analogues such as orbital systems and collapse cores. Negative regimes resemble dark-energy-like expansion fields."
        },
        thresholds: {
            low: "Weak interactions, particles drift loosely.",
            high: "Strong clustering and aggregation.",
            extreme: "Runaway collapse or explosive dispersion."
        },
        interactions: [
            { with: ["Viscosity"], effect: "Controls whether clusters stabilize or remain turbulent." },
            { with: ["Hidden Mass"], effect: "Amplifies gravitational dominance." }
        ],
        category: "Physics"
    },
    "Viscosity": {
        layers: {
            hint: "Controls how quickly motion slows down.",
            explanation: "Higher viscosity dampens movement like thick fluid, while lower values allow fast, chaotic motion.",
            system: "Viscosity determines whether structures stabilize or remain kinetic. High viscosity freezes formations, low viscosity promotes turbulence.",
            advanced: "In combination with force fields, viscosity acts as a phase controller between gas-like, liquid-like, and solid-like emergent states."
        },
        thresholds: {
            low: "Chaotic, high-speed motion.",
            high: "Stable, slow-moving clusters.",
            extreme: "Near-static structures."
        },
        interactions: [
            { with: ["Force"], effect: "Balances collapse vs stability." },
            { with: ["Jitter"], effect: "Determines noise vs damping equilibrium." }
        ],
        category: "Physics"
    },
    "Torque": {
        layers: {
            hint: "Adds rotational motion to interactions.",
            explanation: "Applies sideways forces that cause particles to spin around each other.",
            system: "Torque introduces angular momentum, enabling orbiting systems and vortex-like behavior.",
            advanced: "Sustained torque fields can produce stable orbital shells, rotating lattices, or chaotic spin turbulence depending on damping."
        },
        thresholds: {
            low: "Minimal rotation.",
            high: "Strong orbital behavior.",
            extreme: "Chaotic spinning systems."
        },
        interactions: [
            { with: ["Force"], effect: "Creates orbital instead of direct collapse." },
            { with: ["Viscosity"], effect: "Controls whether rotation stabilizes or dissipates." }
        ],
        category: "Physics"
    },
    "Jitter": {
        layers: {
            hint: "Adds random motion.",
            explanation: "Simulates Brownian motion to keep particles from settling completely.",
            system: "Jitter prevents static equilibrium and encourages exploration of state space.",
            advanced: "Acts as thermal noise. In low-viscosity systems it drives chaos; in high-viscosity systems it enables slow annealing toward stable configurations."
        },
        thresholds: {
            low: "Stable, predictable motion.",
            high: "Chaotic fluctuations.",
            extreme: "Structure breakdown."
        },
        interactions: [
            { with: ["Viscosity"], effect: "Defines thermal vs frozen regimes." }
        ],
        category: "Physics"
    },
    "C1 (Polarity)": {
        layers: {
            hint: "Defines particle charge.",
            explanation: "Like values repel, opposite values attract.",
            system: "Polarity creates selective attraction, enabling structured patterns beyond uniform gravity.",
            advanced: "High polarity differentiation leads to charge segregation, lattice formation, and alternating field structures."
        },
        thresholds: {
            low: "Weak charge effects.",
            high: "Strong attraction/repulsion patterns.",
            extreme: "Sharp charge segregation."
        },
        interactions: [
            { with: ["Signal Strength"], effect: "Charge can influence communication patterns." }
        ],
        category: "Electromagnetism"
    },
    "C2 (Alpha)": {
        layers: {
            hint: "Controls transparency and density.",
            explanation: "Lower values create ghost-like particles, higher values make them visually dense.",
            system: "Alpha affects visual overlap and perceived density but can also influence interaction readability.",
            advanced: "Extreme low values simulate non-occluding matter layers, useful for multi-species overlap systems."
        },
        thresholds: {
            low: "Transparent, ghost-like.",
            high: "Opaque and solid-looking.",
            extreme: "Visual dominance or invisibility."
        },
        interactions: [],
        category: "Rendering"
    },
    "C3 (Symmetry)": {
        layers: {
            hint: "Distorts interaction shape.",
            explanation: "Alters how influence spreads spatially.",
            system: "Breaks radial symmetry, enabling directional bias in interactions.",
            advanced: "High asymmetry can produce filament structures, directional flows, and anisotropic clustering."
        },
        thresholds: {
            low: "Uniform interactions.",
            high: "Directional bias.",
            extreme: "Highly distorted fields."
        },
        interactions: [],
        category: "Physics"
    },
    "Hidden Mass": {
        layers: {
            hint: "Adds invisible mass.",
            explanation: "Increases gravitational influence without changing visible size.",
            system: "Hidden Mass decouples visual scale from physical influence.",
            advanced: "Enables dark-matter-like systems where unseen structures govern visible dynamics."
        },
        thresholds: {
            low: "Minimal hidden influence.",
            high: "Strong unseen forces.",
            extreme: "Invisible structural dominance."
        },
        interactions: [
            { with: ["Force"], effect: "Amplifies gravitational pull." }
        ],
        category: "Physics"
    },
    "Stiffness": {
        layers: {
            hint: "Controls rigidity of structures.",
            explanation: "Higher values make formations rigid, lower values allow flexibility.",
            system: "Stiffness determines whether clusters behave like solids or fluids.",
            advanced: "High stiffness supports crystalline lattices; low stiffness enables organic, deformable structures."
        },
        thresholds: {
            low: "Soft, flexible clusters.",
            high: "Rigid formations.",
            extreme: "Brittle structures."
        },
        interactions: [],
        category: "Matter"
    },
    "Fusion": {
        layers: {
            hint: "Controls how efficiently particles merge.",
            explanation: "Higher values increase mass gained during collisions.",
            system: "Fusion governs growth dynamics and entity scaling.",
            advanced: "High fusion leads to hierarchical mass structures and proto-celestial bodies."
        },
        thresholds: {
            low: "Slow growth.",
            high: "Rapid accumulation.",
            extreme: "Runaway mass dominance."
        },
        interactions: [
            { with: ["Fusion Time"], effect: "Controls merge speed." },
            { with: ["Fusion Momentum"], effect: "Controls collision requirements." }
        ],
        category: "Matter"
    },
    "Birth Rate": {
        layers: {
            hint: "Controls reproduction frequency.",
            explanation: "Higher values increase spontaneous spawning.",
            system: "Birth Rate drives population expansion.",
            advanced: "High birth + low death leads to exponential population explosions."
        },
        thresholds: {
            low: "Sparse populations.",
            high: "Rapid growth.",
            extreme: "Overpopulation."
        },
        interactions: [
            { with: ["Death Rate"], effect: "Defines population equilibrium." }
        ],
        category: "Biology"
    },
    "Death Rate": {
        layers: {
            hint: "Controls decay rate.",
            explanation: "Higher values remove particles faster.",
            system: "Death Rate stabilizes population size.",
            advanced: "Acts as entropy pressure preventing runaway growth."
        },
        thresholds: {
            low: "Long-lived particles.",
            high: "Rapid decay.",
            extreme: "Population collapse."
        },
        interactions: [
            { with: ["Birth Rate"], effect: "Balances ecosystem." }
        ],
        category: "Biology"
    },
    "Mutation": {
        layers: {
            hint: "Controls variation in offspring.",
            explanation: "Higher values increase randomness in new particles.",
            system: "Mutation introduces diversity and exploration of parameter space.",
            advanced: "High mutation prevents convergence but destabilizes specialization."
        },
        thresholds: {
            low: "Stable traits.",
            high: "Diverse population.",
            extreme: "Chaotic evolution."
        },
        interactions: [],
        category: "Biology"
    },
    "Signal Resp": {
        layers: {
            hint: "Controls response to signals.",
            explanation: "Higher values increase sensitivity to neighbors.",
            system: "Signal Response enables coordinated behavior.",
            advanced: "High responsiveness creates swarm intelligence and wave propagation."
        },
        thresholds: {
            low: "Independent particles.",
            high: "Coordinated movement.",
            extreme: "Over-synchronization."
        },
        interactions: [
            { with: ["Signal Strength"], effect: "Defines communication intensity." }
        ],
        category: "Communication"
    },
    "Pulse Rate": {
        layers: {
            hint: "Controls signal frequency.",
            explanation: "Defines how often particles emit signals.",
            system: "Pulse Rate creates rhythmic behavior.",
            advanced: "Enables synchronized oscillations and timing-based coordination."
        },
        thresholds: {
            low: "Slow pulses.",
            high: "Rapid signaling.",
            extreme: "Continuous oscillation."
        },
        interactions: [],
        category: "Communication"
    },
    "Tidal": {
        layers: {
            hint: "Applies differential forces across structures.",
            explanation: "Creates stretching or tearing forces.",
            system: "Tidal forces destabilize large clusters.",
            advanced: "High tidal fields simulate gravitational shear and fragmentation."
        },
        thresholds: {
            low: "Stable clusters.",
            high: "Distortion effects.",
            extreme: "Structural tearing."
        },
        interactions: [],
        category: "Physics"
    },
    "Fusion Momentum": {
        layers: {
            hint: "Sets minimum collision strength for merging.",
            explanation: "Particles must hit hard enough to fuse.",
            system: "Prevents passive merging.",
            advanced: "High values create selective fusion events."
        },
        thresholds: {
            low: "Easy merging.",
            high: "Selective merging.",
            extreme: "Rare fusion events."
        },
        interactions: [
            { with: ["Fusion"], effect: "Controls growth efficiency." }
        ],
        category: "Matter"
    },
    "Fusion Time": {
        layers: {
            hint: "Controls how long fusion takes.",
            explanation: "Particles must remain in contact before merging.",
            system: "Introduces temporal gating to growth.",
            advanced: "High values allow formation of temporary bonded structures."
        },
        thresholds: {
            low: "Instant merging.",
            high: "Delayed fusion.",
            extreme: "Rare completion."
        },
        interactions: [],
        category: "Matter"
    },
    "Neighborhood Radius": {
        layers: {
            hint: "Controls interaction range.",
            explanation: "Defines how far particles can influence others.",
            system: "Larger radius increases connectivity.",
            advanced: "High radius creates global coupling and emergent network behavior."
        },
        thresholds: {
            low: "Local interactions.",
            high: "Wide influence.",
            extreme: "Global coupling."
        },
        interactions: [],
        category: "Physics"
    },
    "Signal Strength": {
        layers: {
            hint: "Controls signal intensity.",
            explanation: "Stronger signals travel further and affect more particles.",
            system: "Defines communication reach.",
            advanced: "High strength enables large-scale synchronization waves."
        },
        thresholds: {
            low: "Weak communication.",
            high: "Strong signals.",
            extreme: "System-wide influence."
        },
        interactions: [
            { with: ["Signal Decay"], effect: "Controls signal persistence." }
        ],
        category: "Communication"
    },
    "Signal Decay": {
        layers: {
            hint: "Controls how long signals last.",
            explanation: "Higher values make signals fade slower.",
            system: "Defines memory of communication.",
            advanced: "Low decay creates persistent states resembling memory fields."
        },
        thresholds: {
            low: "Short-lived signals.",
            high: "Persistent signals.",
            extreme: "Near-permanent influence."
        },
        interactions: [],
        category: "Communication"
    },
    "Propagation Speed": {
        layers: {
            hint: "Controls how fast signals travel.",
            explanation: "Higher values increase signal speed.",
            system: "Defines temporal coordination scale.",
            advanced: "High speed collapses delay, creating near-instant global behavior."
        },
        thresholds: {
            low: "Slow communication.",
            high: "Fast propagation.",
            extreme: "Instant synchronization."
        },
        interactions: [],
        category: "Communication"
    },
    "Tuning Ch1": {
        layers: {
            hint: "Controls sensitivity to channel 1.",
            explanation: "Filters incoming signals.",
            system: "Defines specialization roles.",
            advanced: "Enables multi-channel logic and division of labor."
        },
        thresholds: {
            low: "Ignores signals.",
            high: "Highly sensitive.",
            extreme: "Dominant channel."
        },
        interactions: [],
        category: "Communication"
    },
    "Tuning Ch2": {
        layers: {
            hint: "Controls sensitivity to channel 2.",
            explanation: "Filters incoming signals.",
            system: "Defines behavioral specialization.",
            advanced: "Used for defensive or reactive roles."
        },
        thresholds: {
            low: "Ignores signals.",
            high: "Highly sensitive.",
            extreme: "Dominant channel."
        },
        interactions: [],
        category: "Communication"
    },
    "Tuning Ch3": {
        layers: {
            hint: "Controls sensitivity to channel 3.",
            explanation: "Filters incoming signals.",
            system: "Often linked to growth or metabolism.",
            advanced: "Can coordinate expansion phases."
        },
        thresholds: {
            low: "Inactive.",
            high: "Responsive.",
            extreme: "Overactive."
        },
        interactions: [],
        category: "Communication"
    },
    "Tuning Ch4": {
        layers: {
            hint: "Controls sensitivity to channel 4.",
            explanation: "Filters incoming signals.",
            system: "Enables higher-order coordination.",
            advanced: "Supports multi-state logic and proto-neural behavior."
        },
        thresholds: {
            low: "Inactive.",
            high: "Responsive.",
            extreme: "Complex signaling dominance."
        },
        interactions: [],
        category: "Communication"
    }
};

export const DNA_RANGES = [
    { min: -2, max: 2, default: 0.1 },
    { min: 0.8, max: 1.0, default: 0.98 },
    { min: -1, max: 1, default: 0 },
    { min: 0, max: 0.5, default: 0.05 },
    { min: -1, max: 1, default: 0 },
    { min: 0, max: 1, default: 0.5 },
    { min: -1, max: 1, default: 0 },
    { min: -5, max: 5, default: 0 },
    { min: 0.1, max: 5, default: 1.0 },
    { min: 0, max: 1, default: 0.5 },
    { min: 0, max: 0.1, default: 0.01 },
    { min: 0, max: 0.1, default: 0.01 },
    { min: 0, max: 0.5, default: 0.05 },
    { min: 0, max: 2, default: 1.0 },
    { min: 0, max: 1, default: 0.2 },
    { min: -1, max: 1, default: 0 },
    { min: 0, max: 50, default: 5 },
    { min: 0, max: 100, default: 10 },
    { min: 20, max: 500, default: 120 },
    { min: 0, max: 1, default: 0.5 },
    { min: 0.1, max: 0.99, default: 0.95 },
    { min: 0.01, max: 1.0, default: 0.5 },
    { min: 0, max: 1, default: 1 },
    { min: 0, max: 1, default: 1 },
    { min: 0, max: 1, default: 1 },
    { min: 0, max: 1, default: 1 },
];
