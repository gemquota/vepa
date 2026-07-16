import os
import json

def generate_js():
    dna_data = [
        ("Force", "Governs the primary attraction and repulsion between particles; positive values simulate gravitational clumping while negative values create expansive repulsive fields that prevent structural collapse.", -2, 2, 0.1),
        ("Viscosity", "Determines the rate of kinetic energy dissipation within the local neighborhood; high values simulate thick, honey-like fluids that dampen motion, whereas low values allow for high-velocity gas-like turbulence.", 0.8, 1.0, 0.98),
        ("Torque", "Applies a rotational force during neighbor interactions which induces angular momentum; this parameter is essential for the formation of stable orbital vortices and complex spinning cellular colonies.", -1, 1, 0),
        ("Jitter", "Introduces stochastic Brownian motion into the system to prevent static equilibrium; this constant vibration allows particle clusters to 'settle' into more efficient geometric configurations over time.", 0, 0.5, 0.05),
        ("C1 (Polarity)", "Represents the fundamental electromagnetic charge of the species; like charges exert a repulsive force while opposite charges attract, directly influencing the vibrant neon color shifts during interaction.", -1, 1, 0),
        ("C2 (Alpha)", "Controls the material density and visual transparency of the particle body; lower values create 'ghost' species that can occupy the same spatial coordinates without total visual occlusion.", 0, 1, 0.5),
        ("C3 (Symmetry)", "Warps the physical dimensions of the particle's interaction field; positive values stretch the influence horizontally while negative values induce a vertical elongation, breaking perfect circular symmetry.", -1, 1, 0),
        ("Hidden Mass", "Assigns an invisible mass multiplier that influences gravity and momentum without altering the visible size; this allows for the creation of 'dark matter' particles that exert massive physical influence.", -5, 5, 0),
        ("Stiffness", "Defines the rigidity of the local structural bonds during accretion; high stiffness results in brittle, rock-like formations while low stiffness allows for gel-like or cloud-like elastic behaviors.", 0.1, 5, 1.0),
        ("Fusion", "Determines the efficiency of mass transfer during a successful merger event; high values allow for rapid growth into massive entities while low values restrict the growth potential of individual colonies.", 0, 1, 0.5),
        ("Birth Rate", "Sets the statistical probability for spontaneous reproduction within high-energy clusters; this drives population expansion and is balanced against the metabolic costs of the local environment.", 0, 0.1, 0.01),
        ("Death Rate", "Controls the natural decay rate of the species due to simulated instability or radiation; high values prevent overpopulation by ensuring that older or isolated particles eventually dissolve.", 0, 0.1, 0.01),
        ("Mutation", "Governs the degree of genetic drift when new particles are spawned or merged; higher values ensure that offspring possess significantly varied physical constants compared to their progenitors.", 0, 0.5, 0.05),
        ("Signal Resp", "Determines how sensitively a particle responds to the communication blinks of its neighbors; high response values facilitate synchronized swarming behaviors and complex wave propagation.", 0, 2, 1.0),
        ("Pulse Rate", "Sets the frequency of the internal oscillator that drives signal emission; this creates a 'heartbeat' effect that is used by colonies to coordinate movement and signal-driven scaling.", 0, 1, 0.2),
        ("Tidal", "Calculates the force gradient across the diameter of a particle cluster; high tidal values can tear large accreted masses apart or create complex dragging effects in high-gravity zones.", -1, 1, 0),
        ("Fusion Momentum", "Defines the minimum relative momentum required to trigger an accretion event; if set to zero, particles will attempt to merge regardless of their impact velocity.", 0, 50, 5),
        ("Fusion Time", "The number of simulation ticks that two particles must remain in close proximity before they successfully fuse; setting this to zero allows for instantaneous merging upon contact.", 0, 100, 10),
        ("Neighborhood Radius", "Sets the maximum spatial range for all local DNA interactions and signal propagation; larger radii allow for more complex multi-neighbor calculations at the cost of processing density.", 20, 500, 120),
        ("Signal Strength", "Amplifies the magnitude of the signal emitted during each pulse cycle; this directly influences how far and how strongly a particle can communicate its internal state to the swarm.", 0, 1, 0.5),
        ("Signal Decay", "Determines the rate at which incoming signals fade over time within a particle's memory; high decay ensures short-term responses while low decay allows for sustained colonial states.", 0.1, 0.99, 0.95),
        ("Propagation Speed", "Controls the velocity at which communication signals travel through the medium; faster speeds allow for near-instantaneous swarm synchronization across vast distances.", 0.01, 1.0, 0.5),
        ("Tuning Ch1", "Adjusts the sensitivity of the species to information received on the first frequency channel; this allows for the creation of specialized roles within a multi-species ecosystem.", 0, 1, 1),
        ("Tuning Ch2", "Adjusts the sensitivity to the second communication channel; often used for coordinating defensive or repulsive swarm behaviors in response to specific environmental stimuli.", 0, 1, 1),
        ("Tuning Ch3", "Adjusts the sensitivity to the third communication channel; typically mapped to metabolic or reproductive signals that trigger colony growth phases.", 0, 1, 1),
        ("Tuning Ch4", "Adjusts the sensitivity to the fourth communication channel; enables complex four-state logic gates within the emerging neural structures of the particle swarm.", 0, 1, 1),
        ("Inertia", "Resistance to acceleration.", 0.1, 10, 1.0),
        ("Friction", "Velocity-dependent drag.", 0, 0.5, 0.02),
        ("Max Velocity", "Terminal speed limit.", 5, 200, 25.0),
        ("Base Radius", "Starting size before mass scaling.", 0.5, 10.0, 2.0),
        ("Elasticity", "Collision energy retention (bounciness).", 0, 1.0, 0.5),
        ("Bond Angle", "Favored cluster geometry.", 0, 3.14, 0),
        ("Conductivity", "Rate of charge/energy transfer on contact.", 0, 1, 0.5),
        ("Magnetic Moment", "Neighbor charge alignment.", -1, 1, 0.0),
        ("Energy Efficiency", "Mass-to-energy conversion ratio.", 0.5, 5, 0.8),
        ("Sex Chance", "Multi-parent reproduction probability.", 0, 1, 0.1),
        ("Predation Bias", "Bonus attraction toward lower-mass species.", 0, 50, 1.0),
        ("Reaction Threshold", "Mass limit for phase change.", 10, 100, 50.0),
        ("Catalysis", "Reaction speed multiplier.", 1, 10, 1.0),
        ("Heat Output", "Interaction energy byproduct.", 0, 1, 0.1),
        ("Memory Decay", "Internal state persistence over time.", 0.9, 1.0, 0.99),
        ("Species Affinity", "Attraction bias toward same (+) or different (-) species.", -1.0, 1.0, 0.0)
    ]

    law_indexes = {
        "GRAV": 0, "DRAG": 1, "ENTR": 2, "WRAP": 3, "COLL": 4, "ACCR": 5, "PLANET": 6, "VOID": 7, "BOND": 8,
        "HEAT": 9, "COLD": 10, "CONV": 11, "RADI": 12, "SUBL": 13, "MELT": 14, "BOIL": 15,
        "LIFE": 16, "GLOW": 17, "AFFINITY": 18, "REPRODUCTION": 19, "TRACKING": 20, "SENESCENCE": 21, "GENOTYPE": 22, "PHENOTYPE": 23, "ENER": 24, "RAD": 25,
        "COND": 26, "DEPO": 27, "EXOP": 28,
        "CATA": 32, "SOLV": 33, "ACID": 34, "OXID": 35, "REDU": 36, "POLY": 37, "ISOM": 38, "CHIR": 39, "CRYS": 40, "ALLO": 41,
        "TIME": 48, "DIME": 49, "CHAO": 50, "ORDE": 51, "FATE": 52, "WILL": 53, "SOUL": 54, "MIND": 55, "TELE": 56, "CLAI": 57, "PREO": 58, "ASTR": 59
    }
    
    law_indexes.update({
        "JITTER": 2, "PLANETARY": 6, "BIOL": 16, "REPRO": 19, "TRACK": 20, "SENES": 21, "GENO": 22, "PHENO": 23
    })

    law_map = {
        "pure": ['grav', 'drag', 'entr', 'wrap', 'coll', 'accr', 'planet', 'void', 'bond'],
        "biol": ['life', 'glow', 'affinity', 'reproduction', 'tracking', 'senescence', 'genotype', 'phenotype', 'ener', 'rad'],
        "chem": ['cata', 'solv', 'acid', 'oxid', 'redu', 'poly', 'isom', 'chir', 'crys', 'allo'],
        "thermo": ['heat', 'cold', 'conv', 'radi', 'subl', 'melt', 'boil', 'cond', 'depo', 'exop'],
        "meta": ['time', 'dime', 'chao', 'orde', 'fate', 'will', 'soul', 'mind', 'tele', 'clai', 'preo', 'astr']
    }

    stride_indexes = {
        "POS_X": 0, "POS_Y": 1, "POS_Z": 2, "VEL_X": 3, "VEL_Y": 4, "VEL_Z": 5, "MASS": 6, "SPECIES_ID": 7,
        "DNA_CACHE_START": 8, "DNA_CACHE_END": 49, "ENERGY": 50, "AGE": 51, "DEAD": 52,
        "COLOR_R": 53, "COLOR_G": 54, "COLOR_B": 55
    }

    dna_indexes = {}
    for i, (name, desc, mn, mx, df) in enumerate(dna_data):
        dna_indexes[name.upper().replace(" ", "_").replace("(", "").replace(")", "")] = i

    js_content = "/* GENERATED BY build_ssot.py - DO NOT EDIT MANUALLY */\n\n"
    js_content += "export const LAW_INDEXES = " + json.dumps(law_indexes, indent=4) + ";\n\n"
    js_content += "export const LAW_MAP = " + json.dumps(law_map, indent=4) + ";\n\n"
    js_content += "export const DNA_STRIDE = 64;\nexport const DNA_PACK_MAX = 65535;\n\n"
    js_content += "export const STRIDE_INDEXES = " + json.dumps(stride_indexes, indent=4) + ";\n\n"
    js_content += "export const DNA_INDEXES = " + json.dumps(dna_indexes, indent=4) + ";\n\n"

    js_content += "export const DNA_META = [\n"
    for name, desc, mn, mx, df in dna_data: js_content += f'    "{name}",\n'
    js_content += "];\n\nexport const DNA_DESCS = [\n"
    for name, desc, mn, mx, df in dna_data: js_content += f'    "{desc}",\n'
    js_content += "];\n\nexport const DNA_RANGES = [\n"
    for name, desc, mn, mx, df in dna_data: js_content += f'    {{ min: {mn}, max: {mx}, default: {df} }},\n'
    js_content += "];\n\n"
    
    js_content += """export const DRONE_COMMENTS = {
    "WELCOME": ["System online."],
    "SCAN": ["Analyzing..."],
    "IDLE": ["Waiting..."],
    "LATTICE_LOCK": ["Lattice Lock achieved."],
    "LEVEL_UP": ["Competency rising."]
};

"""
    help_db = {}
    for i, (name, desc, mn, mx, df) in enumerate(dna_data):
        help_db[name] = {
            "layers": {
                "hint": f"{name} parameter.",
                "explanation": desc,
                "system": f"Governs behavior relative to {name.lower()}.",
                "advanced": f"Range: {mn} to {mx}. Default: {df}."
            },
            "category": "Biology" if i > 10 else "Physics"
        }

    js_content += "export const HELP_DB = " + json.dumps(help_db, indent=4) + ";\n"
    
    with open('src/constants.js', 'w') as f:
        f.write(js_content)

if __name__ == "__main__":
    generate_js()
    print("Generated src/constants.js with FULL engine definitions.")
