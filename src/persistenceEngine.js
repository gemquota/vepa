import { DNA_RANGES, DNA_META } from './constants.js';

export class PersistenceEngine {
    constructor(key = "VEPA_UNIVERSE") {
        this.key = key;
        this.presetsKey = "VEPA_PRESETS";
    }

    save(engine) {
        const state = {
            metaParams: engine.emergentEngine.metaParams,
            definitions: this.serializeDefinitions(engine.emergentEngine.definitions),
            rejected: Array.from(engine.emergentEngine.rejected),
            complexityLevel: engine.complexityLevel,
            simAge: engine.simAge,
            version: 3
        };
        localStorage.setItem(this.key, JSON.stringify(state));
    }

    load(engine) {
        const raw = localStorage.getItem(this.key);
        if (!raw) return false;

        try {
            const saved = JSON.parse(raw);
            engine.emergentEngine.metaParams = saved.metaParams || {};
            engine.emergentEngine.rejected = new Set(saved.rejected || []);
            engine.complexityLevel = saved.complexityLevel || 0;
            engine.simAge = saved.simAge || 0;
            
            Object.keys(saved.definitions || {}).forEach(key => {
                const name = key.replace(/_/g, ' ');
                const def = engine.emergentEngine.generateDefinition(name);
                if (def) {
                    engine.emergentEngine.definitions[key] = def;
                    engine.emergentEngine.spawnAcceptedParam({ key, def, name });
                }
            });
            return true;
        } catch (e) {
            console.error("Failed to load universe:", e);
            return false;
        }
    }

    serializeDefinitions(defs) {
        const out = {};
        Object.keys(defs).forEach(k => out[k] = { key: k });
        return out;
    }

    // --- PRESETS SYSTEM ---

    getPresets() {
        const raw = localStorage.getItem(this.presetsKey);
        const userPresets = raw ? JSON.parse(raw) : {};
        return { ...this.getDefaultPresets(), ...userPresets };
    }

    getDefaultPresets() {
        // Shared base config
        const baseLaws = {
            pure: { grav: true, drag: true, jitter: true, coll: true, accr: true, wrap: true, void: false, bond: false, G: 0.15, dt: 1.0, ener: false, rad: false },
            biol: { life: true, glow: false, affinity: false, reproduction: true, tracking: false, senescence: true, genotype: true, phenotype: true, ener: false, rad: false },
            chem: { cata: false, solv: false, acid: false, oxid: false, redu: false, poly: false, isom: false, chir: false, crys: false, allo: false },
            thermo: { heat: false, cold: false, conv: false, radi: false, subl: false, melt: false, boil: false, cond: false, depo: false, exop: false },
            meta: { time: false, dime: false, chao: false, orde: false, fate: false, will: false, soul: false, mind: false, tele: false, clai: false, preo: false, astr: false }
        };
        const baseWorld = { count: 1500, dimX: 2000, dimY: 2000, dimZ: 2000, spreadX: 1.0, spreadY: 1.0, spreadZ: 1.0, baseSize: 1.2 };

        const createSet = (name, conduct, brief, quiz, share, pulse, rrps, force = 0.1, overrides = {}, description = "") => {
            // CRITICAL FIX: Use defaults from DNA_RANGES instead of hardcoded 0.1
            const dna = DNA_RANGES.map(r => r.default);
            
            dna[32] = conduct; // Conductivity
            dna[10] = brief;   // Birth Rate
            dna[3] = quiz;     // Jitter
            dna[41] = share;   // Affinity
            dna[14] = pulse;   // Pulse Rate
            dna[13] = rrps;    // Signal Resp
            dna[0] = force;    // Force
            if (overrides.dna) Object.entries(overrides.dna).forEach(([k,v]) => dna[k] = v);

            const speciesConfigs = overrides.species || [
                { name: name + "_Alpha", color: "#cc2424", rgb: [0.8, 0.1, 0.1], dnaMod: (d) => d },
                { name: name + "_Beta", color: "#24cc24", rgb: [0.1, 0.8, 0.1], dnaMod: (d) => d.map(v => v * 0.8) }
            ];

            const species = speciesConfigs.map((cfg, idx) => ({
                id: 100 + idx,
                name: cfg.name,
                dna: cfg.dnaMod ? cfg.dnaMod([...dna]) : [...dna],
                color: cfg.color,
                rgb: cfg.rgb
            }));

            return {
                name,
                description,
                laws_pure: { ...baseLaws.pure, ...(overrides.pure || {}) },
                laws_biol: { ...baseLaws.biol, ...(overrides.biol || {}) },
                laws_chem: { ...baseLaws.chem, ...(overrides.chem || {}) },
                laws_thermo: { ...baseLaws.thermo, ...(overrides.thermo || {}) },
                laws_meta: { ...baseLaws.meta, ...(overrides.meta || {}) },
                worldConfig: { ...baseWorld, ...(overrides.world || {}) },
                species: species,
                timestamp: 0
            };
        };

        return {
            "PRIME_DEFAULT": createSet("PRIME", 0.1, 0.5, 0.05, 0.0, 0.2, 1.0, 0.15, {
                world: { count: 1000, dimX: 500, dimY: 500, dimZ: 500, distributionType: 'Soup', spreadRadius: 1.0, spawnRate: 10 },
                species: [
                    { name: "Sol", color: "rgb(255, 255, 0)", rgb: [1, 1, 0], dnaMod: (d) => { d[0]=0.8; d[9]=0.8; d[10]=0.1; d[1]=0.95; d[41]=0.5; return d; } },
                    { name: "Aether", color: "rgb(0, 127, 255)", rgb: [0, 0.5, 1], dnaMod: (d) => { d[1]=0.99; d[3]=0.1; d[13]=2.0; d[18]=150; return d; } },
                    { name: "Void", color: "rgb(255, 0, 0)", rgb: [1, 0, 0], dnaMod: (d) => { d[0]=-1.5; d[12]=0.5; d[11]=0.2; d[1]=0.9; d[28]=40; return d; } }
                ]
            }, "Balanced emergent ecosystem for 1000 particles."),
            
            "VOID_CORE": createSet("VOID_CORE", 0.0, 0.01, 0.1, -0.8, 0.1, 0.05, 2.0, { 
                pure: { void: true, accr: true, G: 1.2, coll: false },
                world: { count: 600, baseSize: 3.0, distributionType: 'Big Bang', spreadRadius: 0.05 },
                species: [
                    { name: "Singularity", color: "rgb(200, 0, 255)", rgb: [0.8, 0, 1], dnaMod: (d) => { d[0]=10.0; d[1]=1.0; d[28]=50; return d; } },
                    { name: "Hawking_Radiation", color: "rgb(255, 255, 255)", rgb: [1, 1, 1], dnaMod: (d) => { d[0]=-2.0; d[10]=0.0; d[28]=100; return d; } }
                ]
            }, "Ultra-high gravity singularity with rapid mass accretion and expansion."),
            
            "NEURAL_DRIFT": createSet("NEURAL_DRIFT", 0.9, 0.05, 0.02, 0.5, 0.8, 2.5, 0.05, {
                pure: { bond: true, jitter: true, drag: true },
                world: { count: 2000, distributionType: 'Galaxy', spreadRadius: 1.5 },
                dna: { 1: 0.99, 18: 200, 19: 0.95, 20: 0.99 },
                species: [
                    { name: "Synapse", color: "rgb(0, 255, 255)", rgb: [0, 1, 1], dnaMod: (d) => d },
                    { name: "Glial", color: "rgb(0, 128, 128)", rgb: [0, 0.5, 0.5], dnaMod: (d) => { d[14]=0.2; d[1]=0.9; return d; } }
                ]
            }, "Interconnected mesh network with persistent elastic bonds."),
            
            "SOLAR_FLARE": createSet("SOLAR_FLARE", 0.1, 1.5, 2.0, -0.4, 0.9, 0.1, 0.1, {
                pure: { rad: true, entr: true, coll: true, accr: false },
                biol: { rad: true, life: true, glow: true },
                world: { count: 3000, distributionType: 'Big Bang', spreadRadius: 0.4 },
                dna: { 3: 5.0, 11: 0.5, 29: 4.0, 39: 1.0 },
                species: [
                    { name: "Plasma", color: "rgb(255, 128, 0)", rgb: [1, 0.5, 0], dnaMod: (d) => d },
                    { name: "Corona", color: "rgb(255, 50, 0)", rgb: [1, 0.2, 0], dnaMod: (d) => { d[3]=10.0; d[28]=80; return d; } }
                ]
            }, "High-turnover radiative plasma field with extreme kinetic jitter."),
            
            "CRYSTAL_LATTICE": createSet("CRYSTAL_LATTICE", 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.8, {
                pure: { coll: true, bond: true, drag: true, grav: true, G: 0.05 },
                world: { count: 1200, distributionType: 'Grid', spreadRadius: 1.0 },
                dna: { 1: 0.95, 8: 10.0, 30: 1.0, 31: 60 },
                species: [
                    { name: "Cation", color: "rgb(255, 255, 255)", rgb: [1, 1, 1], dnaMod: (d) => d },
                    { name: "Anion", color: "rgb(100, 100, 100)", rgb: [0.4, 0.4, 0.4], dnaMod: (d) => { d[0]=1.2; return d; } }
                ]
            }, "Geometric solid-state lattice with high rigidity and bonding."),
            
            "PREDATOR_SWARM": createSet("PREDATOR_SWARM", 0.1, 2.0, 0.2, 0.8, 0.5, 1.8, 0.4, {
                pure: { drag: true },
                biol: { tracking: true, affinity: true },
                world: { distributionType: 'Bipolar', spreadRadius: 1.2 },
                dna: { 28: 40, 36: 25.0, 1: 0.99 },
                species: [
                    { name: "Hunter", color: "rgb(255, 0, 50)", rgb: [1, 0, 0.2], dnaMod: (d) => { d[36]=50.0; d[28]=60; return d; } },
                    { name: "Prey", color: "rgb(50, 255, 100)", rgb: [0.2, 1, 0.4], dnaMod: (d) => { d[36]=0.0; d[10]=5.0; d[28]=30; return d; } }
                ]
            }, "Fast-acting hunting logic with species-specific tracking vectors."),
            
            "KINETIC_GAS": createSet("KINETIC_GAS", 0.5, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, {
                pure: { grav: false, drag: false, coll: true, wrap: true, jitter: true },
                world: { count: 1000, distributionType: 'Soup', spreadRadius: 1.5 },
                dna: { 1: 1.0, 30: 1.0, 28: 100 },
                species: [
                    { name: "Hot_Gas", color: "rgb(255, 100, 255)", rgb: [1, 0.4, 1], dnaMod: (d) => { d[28]=120; return d; } },
                    { name: "Cold_Gas", color: "rgb(100, 255, 255)", rgb: [0.4, 1, 1], dnaMod: (d) => { d[28]=40; return d; } }
                ]
            }, "Zero-gravity thermal expansion with maximum elastic rebound."),
            
            "SYMBIOTIC_LOOP": createSet("SYMBIOTIC_LOOP", 0.5, 1.2, 0.1, 0.95, 0.8, 2.0, 0.2, {
                biol: { life: true, ener: true, reproduction: true, glow: true },
                world: { count: 1800, distributionType: 'Soup', spreadRadius: 0.8 },
                dna: { 34: 8.0, 35: 0.9, 12: 1.5, 1: 0.98 },
                species: [
                    { name: "Host", color: "rgb(100, 255, 100)", rgb: [0.4, 1, 0.4], dnaMod: (d) => d },
                    { name: "Parasite", color: "rgb(255, 100, 100)", rgb: [1, 0.4, 0.4], dnaMod: (d) => { d[34]=15.0; d[0]=1.5; return d; } }
                ]
            }, "Closed-loop metabolic system with competitive energy consumption."),
            
            "CHRONOS_FLUX": createSet("CHRONOS_FLUX", 0.2, 0.1, 0.01, -0.6, 0.2, 0.2, -0.5, {
                pure: { drag: true, jitter: false, void: true },
                world: { distributionType: 'Galaxy', spreadRadius: 0.1 },
                dna: { 15: 5.0, 26: 5.0, 1: 0.9 },
                species: [
                    { name: "Temporal_Anchor", color: "rgb(200, 150, 0)", rgb: [0.8, 0.6, 0], dnaMod: (d) => { d[26]=10.0; return d; } },
                    { name: "Flux_Stream", color: "rgb(100, 0, 255)", rgb: [0.4, 0, 1], dnaMod: (d) => { d[1]=0.99; d[26]=0.2; return d; } }
                ]
            }, "Extreme inertia fields causing temporal drag and spatial tearing.")
        };
    }

    savePreset(name, engine) {
        const presets = this.getRawUserPresets();
        presets[name] = {
            laws_pure: JSON.parse(JSON.stringify(engine.laws.pure)),
            laws_biol: JSON.parse(JSON.stringify(engine.laws.biol)),
            laws_chem: JSON.parse(JSON.stringify(engine.laws.chem)),
            laws_thermo: JSON.parse(JSON.stringify(engine.laws.thermo)),
            laws_meta: JSON.parse(JSON.stringify(engine.laws.meta)),
            worldConfig: JSON.parse(JSON.stringify(engine.worldConfig)),
            species: JSON.parse(JSON.stringify(engine.species)),
            timestamp: Date.now()
        };
        localStorage.setItem(this.presetsKey, JSON.stringify(presets));
    }

    getRawUserPresets() {
        const raw = localStorage.getItem(this.presetsKey);
        return raw ? JSON.parse(raw) : {};
    }

    deletePreset(name) {
        // Only delete from user presets
        const presets = this.getRawUserPresets();
        if (presets[name]) {
            delete presets[name];
            localStorage.setItem(this.presetsKey, JSON.stringify(presets));
        }
    }

    loadPreset(name, engine, selectedCategories) {
        const presets = this.getPresets();
        const preset = presets[name];
        if (!preset) return false;

        if (selectedCategories.has('laws_pure')) engine.laws.pure = { ...engine.laws.pure, ...preset.laws_pure };
        if (selectedCategories.has('laws_biol')) engine.laws.biol = { ...engine.laws.biol, ...preset.laws_biol };
        if (selectedCategories.has('laws_chem')) engine.laws.chem = { ...engine.laws.chem, ...preset.laws_chem };
        if (selectedCategories.has('laws_thermo')) engine.laws.thermo = { ...engine.laws.thermo, ...preset.laws_thermo };
        if (selectedCategories.has('laws_meta')) engine.laws.meta = { ...engine.laws.meta, ...preset.laws_meta };
        if (selectedCategories.has('worldConfig')) {
            engine.worldConfig = { ...engine.worldConfig, ...preset.worldConfig };
        }
        
        const speciesToLoad = [];
        preset.species.forEach((s, idx) => {
            if (selectedCategories.has(`species_${idx}`)) {
                speciesToLoad.push(s);
            }
        });

        if (speciesToLoad.length > 0) {
            engine.species = JSON.parse(JSON.stringify(speciesToLoad));
        }

        return true;
    }
}
