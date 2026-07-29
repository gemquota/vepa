import { DNA_RANGES, DNA_INDEXES, DNA_STRIDE, DNA_PACK_MAX, STRIDE_INDEXES } from "../constants.js";
const STRIDE = 64;
const MAX_FORCE = 50.0;
const MAX_INTERACTIONS = 500;
let particles;
let dnaView;
let radiationGrid;
const RAD_RES = 16; // Slightly reduced for performance
let frame = 0;

function getDNA(sIdx, traitIdx) {
    if (!dnaView) return DNA_RANGES[traitIdx].default;
    const offset = sIdx * (DNA_STRIDE * 2);
    const norm = dnaView[offset + traitIdx] / DNA_PACK_MAX;
    const range = DNA_RANGES[traitIdx];
    return norm * (range.max - range.min) + range.min;
}

const DNA_OFFSETS = {};
for (const key in DNA_INDEXES) {
    DNA_OFFSETS[key] = STRIDE_INDEXES.DNA_CACHE_START + DNA_INDEXES[key];
}

function getDNAFromView(sIdx, traitIdx) {
    if (!dnaView) return DNA_RANGES[traitIdx].default;
    const offset = sIdx * (DNA_STRIDE * 2);
    const norm = dnaView[offset + traitIdx] / DNA_PACK_MAX;
    const range = DNA_RANGES[traitIdx];
    return norm * (range.max - range.min) + range.min;
}

function computeOffspringDNA(parent1Ptr, parent2Ptr, mutationRate, mendelActive, crossoverActive, crossoverRate, dominance, heterozygote) {
    // Returns an array of 42 expressed DNA values for the offspring
    const offspring = new Array(42);
    const numTraits = 42;
    
    // Phase 1: Crossover (if active) - swap trait segments between parents
    let p1Traits = new Array(numTraits);
    let p2Traits = new Array(numTraits);
    
    for (let t = 0; t < numTraits; t++) {
        p1Traits[t] = particles[parent1Ptr + STRIDE_INDEXES.DNA_CACHE_START + t] || 0;
        p2Traits[t] = particles[parent2Ptr + STRIDE_INDEXES.DNA_CACHE_START + t] || 0;
    }
    
    if (crossoverActive && crossoverRate > 0) {
        // Single-point crossover
        const cp = Math.floor(Math.random() * numTraits);
        if (Math.random() < crossoverRate) {
            for (let t = cp; t < numTraits; t++) {
                const tmp = p1Traits[t];
                p1Traits[t] = p2Traits[t];
                p2Traits[t] = tmp;
            }
        }
    }
    
    // Phase 2: Mendelian inheritance
    if (mendelActive) {
        for (let t = 0; t < numTraits; t++) {
            // Randomly select one allele from each parent (simulates gamete formation)
            const alleleA = Math.random() < 0.5 ? p1Traits[t] : (particles[parent1Ptr + STRIDE_INDEXES.DNA_CACHE_START + t] || 0);
            const alleleB = Math.random() < 0.5 ? p2Traits[t] : (particles[parent2Ptr + STRIDE_INDEXES.DNA_CACHE_START + t] || 0);
            
            if (Math.random() < dominance) {
                // Dominant expression: use the more extreme value
                offspring[t] = Math.abs(alleleA) > Math.abs(alleleB) ? alleleA : alleleB;
            } else {
                // Recessive/co-dominant: average with heterozygote advantage
                const avg = (alleleA + alleleB) / 2;
                const hetBonus = Math.abs(alleleA - alleleB) * heterozygote * 0.1;
                offspring[t] = avg + (Math.random() < 0.5 ? hetBonus : -hetBonus);
            }
        }
    } else {
        // Simple average inheritance
        for (let t = 0; t < numTraits; t++) {
            offspring[t] = (p1Traits[t] + p2Traits[t]) / 2;
        }
    }
    
    // Phase 3: Mutation
    if (mutationRate > 0) {
        for (let t = 0; t < numTraits; t++) {
            if (Math.random() < mutationRate * 0.01) {
                offspring[t] += (Math.random() - 0.5) * offspring[t] * 0.2;
            }
        }
    }
    
    return offspring;
}

function applyHorizontalTransfer(ptr, oPtr, baseHgtRate, dt) {
    // Direct genetic exchange between nearby particles
    // Read HGT rate from species DNA via getDNA
    let hgtRate = baseHgtRate;
    if (dnaView) {
        const sIdx = Math.floor(particles[ptr + STRIDE_INDEXES.SPECIES_ID]);
        hgtRate = getDNA(sIdx, 47) || baseHgtRate; // DNA_INDEXES.HGT_RATE = 47
    }
    if (Math.random() < hgtRate * dt) {
        const numTraits = 5; // Transfer a few random traits
        for (let t = 0; t < numTraits; t++) {
            const trait = Math.floor(Math.random() * 42);
            const donorVal = particles[oPtr + STRIDE_INDEXES.DNA_CACHE_START + trait] || 0;
            const recipientVal = particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + trait] || 0;
            // Blend towards donor
            particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + trait] = recipientVal + (donorVal - recipientVal) * 0.1;
        }
    }
}

function getSpeciesDNAValue(ptr, dnaIdx, defaultVal) {
    const sIdx = Math.floor(particles[ptr + STRIDE_INDEXES.SPECIES_ID]);
    return getDNA(sIdx, dnaIdx);
}

function getGeneticsParam(ptr, dnaIdx, defaultVal) {
    // Read a genetics control parameter (indices 42-63) from species DNA
    if (dnaView) {
        const sIdx = Math.floor(particles[ptr + STRIDE_INDEXES.SPECIES_ID]);
        const val = getDNA(sIdx, dnaIdx);
        return val !== undefined ? val : defaultVal;
    }
    return defaultVal;
}

function applyEpigenetics(ptr, entropy, dt) {
    // Environmental factors modify gene expression
    const epiRate = getGeneticsParam(ptr, 46, 0.01); // DNA_INDEXES.EPIGENETIC_RATE = 46
    if (Math.random() < epiRate * dt) {
        const trait = Math.floor(Math.random() * 42);
        const envEffect = (entropy - 0.5) * 0.1; // Environment pushes expression
        particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + trait] += envEffect;
    }
}

function applyGeneticDrift(ptr, baseDriftRate, dt) {
    // Neutral random fluctuations in gene expression
    const driftRate = getGeneticsParam(ptr, 49, baseDriftRate); // DNA_INDEXES.DRIFT_RATE = 49
    if (Math.random() < driftRate * dt) {
        const trait = Math.floor(Math.random() * 42);
        particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + trait] += (Math.random() - 0.5) * 0.05;
    }
}

function getGeneticDistance(ptr1, ptr2) {
    // Hamming-like distance on DNA cache
    let dist = 0;
    for (let t = 0; t < 10; t++) { // Sample first 10 traits for performance
        const d = (particles[ptr1 + STRIDE_INDEXES.DNA_CACHE_START + t] || 0) - (particles[ptr2 + STRIDE_INDEXES.DNA_CACHE_START + t] || 0);
        dist += d * d;
    }
    return Math.sqrt(dist);
}

function isFinite_f(v) { return typeof v === 'number' && isFinite(v); }
function clampFinite(v, fb) { return isFinite_f(v) ? v : (fb || 0); }

const GRID_SIZE = 10;
let spatialGrid = [];

self.onmessage = (e) => {
    const { type, data, config, version } = e.data;
    if (type === 'init') {
        particles = data.particles;
        if (data.dnaBuffer) dnaView = new Uint16Array(data.dnaBuffer);
        radiationGrid = new Float32Array(RAD_RES * RAD_RES * RAD_RES);
    } else if (type === 'step') {
        frame++;
        if (e.data.particles) particles = e.data.particles;
        if (!particles) return;
        
        const count = particles.length / STRIDE;
        const { laws, world } = config;
        const pure = laws.pure || {};
        const biol = laws.biol || {};
        const chem = laws.chem || {};
        const thermo = laws.thermo || {};
        const meta = laws.meta || {};

        const totalDt = pure.dt || 1.0;
        const G = pure.G || 0.15;
        const W = world.dimX, H = world.dimY, D = world.dimZ;
        const spawnRate = world.spawnRate || 10;
        const entropy = world.entropy || 0.1;

        // 0. Spatial Grid Construction
        spatialGrid = new Array(GRID_SIZE * GRID_SIZE * GRID_SIZE).fill(null).map(() => []);
        for (let i = 0; i < count; i++) {
            const ptr = i * STRIDE;
            if (particles[ptr + STRIDE_INDEXES.DEAD] > 0) continue;
            const gx = Math.floor(((particles[ptr + STRIDE_INDEXES.POS_X] / W) + 0.5) * (GRID_SIZE - 1));
            const gy = Math.floor(((particles[ptr + STRIDE_INDEXES.POS_Y] / H) + 0.5) * (GRID_SIZE - 1));
            const gz = Math.floor(((particles[ptr + STRIDE_INDEXES.POS_Z] / D) + 0.5) * (GRID_SIZE - 1));
            const gIdx = Math.max(0, Math.min(spatialGrid.length - 1, gx * GRID_SIZE * GRID_SIZE + gy * GRID_SIZE + gz));
            spatialGrid[gIdx].push(i);
        }

        // 0.1 Radiation Decay
        if (biol.rad) {
            for (let r = 0; r < radiationGrid.length; r++) {
                radiationGrid[r] *= 0.95;
            }
        }

        const numSubSteps = totalDt > 2.0 ? Math.min(20, Math.ceil(totalDt / 1.0)) : 1;
        let dt = totalDt / numSubSteps;

        for (let sub = 0; sub < numSubSteps; sub++) {
            const deadIndices = [];
            let aliveCount = 0;

            // 1. BIOLOGY & SPAWNING
            for (let i = 0; i < count; i++) {
                const ptr = i * STRIDE;
                if (particles[ptr + STRIDE_INDEXES.DEAD] > 0) {
                    deadIndices.push(i);
                    continue;
                }
                aliveCount++;

                const px = particles[ptr + STRIDE_INDEXES.POS_X];
                const py = particles[ptr + STRIDE_INDEXES.POS_Y];
                const pz = particles[ptr + STRIDE_INDEXES.POS_Z];

                if (biol.life) {
                    const energyEfficiency = particles[ptr + DNA_OFFSETS.ENERGY_EFFICIENCY] || 0.8;
                    const cost = (0.01 + particles[ptr + STRIDE_INDEXES.MASS] * 0.001) / energyEfficiency;
                    particles[ptr + STRIDE_INDEXES.ENERGY] -= cost * dt;
                    particles[ptr + STRIDE_INDEXES.AGE] += dt;

                    // Biological variance: age affects color, size, and energy
                    const age = particles[ptr + STRIDE_INDEXES.AGE] || 0;
                    const ageNorm = Math.min(1.0, age / 5000);
                    const birthRate = Math.abs(particles[ptr + DNA_OFFSETS.BIRTH_RATE] || 0.5);
                    const mutRate = Math.abs(particles[ptr + DNA_OFFSETS.MUTATION] || 0.5);
                    
                    // Older particles drift in color (biological fading/aging)
                    particles[ptr + STRIDE_INDEXES.COLOR_R] += (Math.sin(age * 0.001) * 0.001 * mutRate);
                    particles[ptr + STRIDE_INDEXES.COLOR_G] += (Math.cos(age * 0.0007) * 0.001 * mutRate);
                    particles[ptr + STRIDE_INDEXES.COLOR_B] += (Math.sin(age * 0.0013 + 1.0) * 0.001 * mutRate);
                    
                    // Mass fluctuates with energy (metabolism)
                    const energy = particles[ptr + STRIDE_INDEXES.ENERGY] || 50;
                    const massFluctuation = (energy - 50) * 0.0001 * birthRate;
                    particles[ptr + STRIDE_INDEXES.MASS] += massFluctuation * dt;
                    
                    // Biological pulse: energy oscillates with biological rhythm
                    const bioPulse = Math.sin(age * 0.01 * birthRate) * 0.5 * mutRate;
                    particles[ptr + STRIDE_INDEXES.ENERGY] += bioPulse * dt * 0.1;

                    const deathRate = particles[ptr + DNA_OFFSETS.DEATH_RATE] || 0.1;
                    const deathProb = biol.senescence ? deathRate * (1.0 + ageNorm * 0.5) : 0; // Older = higher death chance
                    if (particles[ptr + STRIDE_INDEXES.ENERGY] <= 0 || Math.random() < (deathProb * 0.001 * dt)) {
                        particles[ptr + STRIDE_INDEXES.DEAD] = 1;
                        aliveCount--;
                    }
                }

                if (biol.genotype) {
                    // Genetic drift (via DRIFT law if active, or default slow drift)
                    if (biol.drift) {
                        applyGeneticDrift(ptr, 0.002, dt);
                    } else if (Math.random() < 0.001 * dt) {
                        const trait = Math.floor(Math.random() * 42);
                        particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + trait] += (Math.random() - 0.5) * 0.1;
                    }
                    // Epigenetics (via EPIGEN law if active)
                    if (biol.epigen) {
                        applyEpigenetics(ptr, entropy, dt);
                    }
                }

                if (biol.rad) {
                    const gx = Math.floor(((px / W) + 0.5) * (RAD_RES - 1));
                    const gy = Math.floor(((py / H) + 0.5) * (RAD_RES - 1));
                    const gz = Math.floor(((pz / D) + 0.5) * (RAD_RES - 1));
                    const rIdx = Math.max(0, Math.min(radiationGrid.length - 1, gx * RAD_RES * RAD_RES + gy * RAD_RES + gz));
                    
                    if (particles[ptr + STRIDE_INDEXES.MASS] > 2.0) {
                        radiationGrid[rIdx] += (particles[ptr + STRIDE_INDEXES.MASS] - 2.0) * 0.1 * dt;
                    }
                    
                    if (radiationGrid[rIdx] > 1.0) {
                        particles[ptr + STRIDE_INDEXES.ENERGY] -= (radiationGrid[rIdx] - 1.0) * 0.5 * dt;
                    }
                }

                if (biol.glow) {
                    const pulse = Math.sin(frame * (particles[ptr + DNA_OFFSETS.PULSE_RATE] || 0.1));
                    particles[ptr + STRIDE_INDEXES.ENERGY] += pulse * 0.1 * dt;
                }

                if (pure.void && particles[ptr + STRIDE_INDEXES.MASS] > 1.0) {
                    particles[ptr + STRIDE_INDEXES.MASS] -= 0.002 * dt;
                }

                if (chem.isom && Math.random() < (particles[ptr + DNA_OFFSETS.MUTATION] || 0.01) * 0.01 * dt) {
                    particles[ptr + STRIDE_INDEXES.SPECIES_ID] = Math.floor(Math.random() * 12);
                }

                if (chem.oxid && particles[ptr + STRIDE_INDEXES.MASS] > 1.5) {
                    particles[ptr + STRIDE_INDEXES.ENERGY] -= 0.05 * dt;
                }
            }

            // SPAWN LOGIC (with genetics)
            if (biol.reproduction && aliveCount < count && Math.random() < (spawnRate * 0.01 * dt)) {
                const spawnCount = Math.min(deadIndices.length, Math.ceil(spawnRate * dt));
                for (let s = 0; s < spawnCount; s++) {
                    const idx = deadIndices.pop();
                    const ptr = idx * STRIDE;
                    
                    // Find parents for genetic inheritance (pair-based breeding prefers nearby same-species)
                    const liveIndices = [];
                    for (let pi = 0; pi < count; pi++) {
                        const pPtr = pi * STRIDE;
                        if (particles[pPtr + STRIDE_INDEXES.DEAD] === 0) liveIndices.push(pi);
                    }
                    
                    let parent1Ptr = null;
                    let parent2Ptr = null;
                    if (liveIndices.length > 0) {
                        // Parent 1: random live particle
                        const p1Idx = liveIndices[Math.floor(Math.random() * liveIndices.length)];
                        parent1Ptr = p1Idx * STRIDE;
                        
                        // Parent 2: prefer nearby same-species particle for pair breeding
                        if (liveIndices.length > 1) {
                            const p1Species = particles[parent1Ptr + STRIDE_INDEXES.SPECIES_ID];
                            const p1X = particles[parent1Ptr + STRIDE_INDEXES.POS_X];
                            const p1Y = particles[parent1Ptr + STRIDE_INDEXES.POS_Y];
                            const p1Z = particles[parent1Ptr + STRIDE_INDEXES.POS_Z];
                            
                            // Find closest same-species mate within range
                            let bestDist = 200; // Max breeding range
                            let bestMate = -1;
                            for (const pi of liveIndices) {
                                if (pi === p1Idx) continue;
                                const pPtr = pi * STRIDE;
                                if (particles[pPtr + STRIDE_INDEXES.SPECIES_ID] !== p1Species) continue;
                                const dx = particles[pPtr + STRIDE_INDEXES.POS_X] - p1X;
                                const dy = particles[pPtr + STRIDE_INDEXES.POS_Y] - p1Y;
                                const dz = particles[pPtr + STRIDE_INDEXES.POS_Z] - p1Z;
                                const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
                                if (d < bestDist) {
                                    bestDist = d;
                                    bestMate = pi;
                                }
                            }
                            if (bestMate !== -1) {
                                parent2Ptr = bestMate * STRIDE;
                            } else {
                                // Fallback: random second parent
                                let p2Idx;
                                do { p2Idx = liveIndices[Math.floor(Math.random() * liveIndices.length)]; } while (p2Idx === p1Idx);
                                parent2Ptr = p2Idx * STRIDE;
                            }
                        }
                    }
                    
                    particles[ptr + STRIDE_INDEXES.POS_X] = (Math.random() - 0.5) * W;
                    particles[ptr + STRIDE_INDEXES.POS_Y] = (Math.random() - 0.5) * H;
                    particles[ptr + STRIDE_INDEXES.POS_Z] = (Math.random() - 0.5) * D;
                    particles[ptr + STRIDE_INDEXES.VEL_X] = (Math.random() - 0.5) * 2;
                    particles[ptr + STRIDE_INDEXES.VEL_Y] = (Math.random() - 0.5) * 2;
                    particles[ptr + STRIDE_INDEXES.VEL_Z] = (Math.random() - 0.5) * 2;
                    particles[ptr + STRIDE_INDEXES.DEAD] = 0;
                    particles[ptr + STRIDE_INDEXES.AGE] = 0;
                    
                    if (parent1Ptr !== null && (biol.mendel || biol.crossover)) {
                        // Genetics-based inheritance
                        // MUTATION (index 12) is within the DNA cache (0-41), safe to use DNA_OFFSETS
                        const mutationRate = (particles[parent1Ptr + DNA_OFFSETS.MUTATION] || 0.5);
                        // Genetics control params (indices 42+) must use getGeneticsParam
                        const crossRate = getGeneticsParam(parent1Ptr, 43, 0.1); // DNA_INDEXES.CROSSOVER_RATE
                        const dominance = getGeneticsParam(parent1Ptr, 42, 0.7); // DNA_INDEXES.DOMINANCE
                        const hetAdv = getGeneticsParam(parent1Ptr, 45, 0.3); // DNA_INDEXES.HETEROZYGOTE
                        
                        const p2 = parent2Ptr !== null ? parent2Ptr : parent1Ptr;
                        const offspringDNA = computeOffspringDNA(
                            parent1Ptr, p2,
                            mutationRate, biol.mendel, biol.crossover,
                            crossRate, dominance, hetAdv
                        );
                        
                        // Copy offspring DNA to particle
                        for (let t = 0; t < 42; t++) {
                            particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + t] = offspringDNA[t];
                        }
                        
                        // Inherit species from primary parent with possible speciation
                        let speciesId = particles[parent1Ptr + STRIDE_INDEXES.SPECIES_ID];
                        if (biol.speciate && parent2Ptr !== null && parent1Ptr !== parent2Ptr) {
                            const gDist = getGeneticDistance(parent1Ptr, parent2Ptr);
                            const specThresh = getGeneticsParam(parent1Ptr, 51, 0.3); // DNA_INDEXES.SPECIATION_THRESHOLD
                            if (gDist > specThresh * 10) {
                                // Speciation event - assign new species
                                speciesId = Math.min(11, Math.floor(Math.random() * 12));
                            }
                        }
                        particles[ptr + STRIDE_INDEXES.SPECIES_ID] = speciesId;
                        
                        // Set mass (inherited with slight variation)
                        const parentMass = particles[parent1Ptr + STRIDE_INDEXES.MASS] || 1.0;
                        particles[ptr + STRIDE_INDEXES.MASS] = Math.max(0.5, parentMass * (0.8 + Math.random() * 0.4));
                        particles[ptr + STRIDE_INDEXES.ENERGY] = 100.0;
                        
                        // Color blends from parents
                        if (parent2Ptr !== null && parent1Ptr !== parent2Ptr) {
                            const r1 = particles[parent1Ptr + STRIDE_INDEXES.COLOR_R] || 0.5;
                            const g1 = particles[parent1Ptr + STRIDE_INDEXES.COLOR_G] || 0.5;
                            const b1 = particles[parent1Ptr + STRIDE_INDEXES.COLOR_B] || 0.5;
                            const r2 = particles[parent2Ptr + STRIDE_INDEXES.COLOR_R] || 0.5;
                            const g2 = particles[parent2Ptr + STRIDE_INDEXES.COLOR_G] || 0.5;
                            const b2 = particles[parent2Ptr + STRIDE_INDEXES.COLOR_B] || 0.5;
                            particles[ptr + STRIDE_INDEXES.COLOR_R] = (r1 + r2) / 2 + (Math.random() - 0.5) * 0.1;
                            particles[ptr + STRIDE_INDEXES.COLOR_G] = (g1 + g2) / 2 + (Math.random() - 0.5) * 0.1;
                            particles[ptr + STRIDE_INDEXES.COLOR_B] = (b1 + b2) / 2 + (Math.random() - 0.5) * 0.1;
                        } else {
                            particles[ptr + STRIDE_INDEXES.COLOR_R] = (particles[parent1Ptr + STRIDE_INDEXES.COLOR_R] || 0.5) + (Math.random() - 0.5) * 0.1;
                            particles[ptr + STRIDE_INDEXES.COLOR_G] = (particles[parent1Ptr + STRIDE_INDEXES.COLOR_G] || 0.5) + (Math.random() - 0.5) * 0.1;
                            particles[ptr + STRIDE_INDEXES.COLOR_B] = (particles[parent1Ptr + STRIDE_INDEXES.COLOR_B] || 0.5) + (Math.random() - 0.5) * 0.1;
                        }
                    } else if (parent1Ptr !== null) {
                        // Cloning reproduction: copy parent with slight variation
                        for (let t = 0; t < 42; t++) {
                            particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + t] = (particles[parent1Ptr + STRIDE_INDEXES.DNA_CACHE_START + t] || 0) + (Math.random() - 0.5) * 0.1;
                        }
                        particles[ptr + STRIDE_INDEXES.MASS] = Math.max(0.5, (particles[parent1Ptr + STRIDE_INDEXES.MASS] || 1.0) * (0.85 + Math.random() * 0.3));
                        particles[ptr + STRIDE_INDEXES.SPECIES_ID] = particles[parent1Ptr + STRIDE_INDEXES.SPECIES_ID] || 0;
                        particles[ptr + STRIDE_INDEXES.ENERGY] = 80.0;
                        particles[ptr + STRIDE_INDEXES.COLOR_R] = (particles[parent1Ptr + STRIDE_INDEXES.COLOR_R] || 0.5) + (Math.random() - 0.5) * 0.15;
                        particles[ptr + STRIDE_INDEXES.COLOR_G] = (particles[parent1Ptr + STRIDE_INDEXES.COLOR_G] || 0.5) + (Math.random() - 0.5) * 0.15;
                        particles[ptr + STRIDE_INDEXES.COLOR_B] = (particles[parent1Ptr + STRIDE_INDEXES.COLOR_B] || 0.5) + (Math.random() - 0.5) * 0.15;
                    } else {
                        // Simple spawn (no genetics, no clone target)
                        particles[ptr + STRIDE_INDEXES.MASS] = 1.0; 
                        particles[ptr + STRIDE_INDEXES.SPECIES_ID] = Math.floor(Math.random() * 12);
                        particles[ptr + STRIDE_INDEXES.ENERGY] = 100.0;
                    }
                    aliveCount++;
                }
            }

            // 2. PHYSICS & FORCES
            for (let i = 0; i < count; i++) {
                const ptr = i * STRIDE;
                if (particles[ptr + STRIDE_INDEXES.DEAD] > 0) continue;
                let ax = 0, ay = 0, az = 0;
                let interactionCount = 0;

                let localDt = dt;
                if (meta.time) {
                    const d2c = Math.sqrt(particles[ptr]**2 + particles[ptr+1]**2 + particles[ptr+2]**2);
                    localDt *= Math.max(0.1, Math.min(1.0, d2c / 200));
                }

                if (thermo.heat) { ax += (Math.random()-0.5)*0.5; ay += (Math.random()-0.5)*0.5; az += (Math.random()-0.5)*0.5; }
                if (thermo.cold) { particles[ptr+3] *= 0.95; particles[ptr+4] *= 0.95; particles[ptr+5] *= 0.95; }
                if (thermo.radi) { particles[ptr + STRIDE_INDEXES.MASS] -= 0.001 * localDt; }

                if (thermo.subl && (entropy + (particles[ptr + DNA_OFFSETS.JITTER]||0)) > 2.0) {
                    particles[ptr + STRIDE_INDEXES.MASS] -= 0.005 * localDt;
                    particles[ptr + STRIDE_INDEXES.ENERGY] += 0.01 * localDt;
                }

                if (thermo.melt) {
                    const meltJitter = (particles[ptr + STRIDE_INDEXES.ENERGY] / 100) * 0.5;
                    ax += (Math.random()-0.5)*meltJitter; ay += (Math.random()-0.5)*meltJitter; az += (Math.random()-0.5)*meltJitter;
                }

                if (thermo.boil && particles[ptr + STRIDE_INDEXES.ENERGY] > 80) {
                    const boilJitter = 2.0;
                    ax += (Math.random()-0.5)*boilJitter; ay += (Math.random()-0.5)*boilJitter; az += (Math.random()-0.5)*boilJitter;
                    particles[ptr + STRIDE_INDEXES.MASS] -= 0.01 * localDt;
                }

                if (thermo.conv) {
                    const heatEffect = particles[ptr + DNA_OFFSETS.HEAT_OUTPUT] || 0.1;
                    ay -= heatEffect * 0.1 * localDt;
                }

                if (pure.jitter) {
                    const j = (entropy + (particles[ptr + DNA_OFFSETS.JITTER]||0)) * 0.5;
                    ax += (Math.random()-0.5)*j; ay += (Math.random()-0.5)*j; az += (Math.random()-0.5)*j;
                }

                if (pure.planetary) ay += 0.2;

                if (meta.chao && Math.random() < 0.01) {
                    ax += (Math.random()-0.5) * 5.0; ay += (Math.random()-0.5) * 5.0; az += (Math.random()-0.5) * 5.0;
                }

                const gx = Math.floor(((particles[ptr + STRIDE_INDEXES.POS_X] / W) + 0.5) * (GRID_SIZE - 1));
                const gy = Math.floor(((particles[ptr + STRIDE_INDEXES.POS_Y] / H) + 0.5) * (GRID_SIZE - 1));
                const gz = Math.floor(((particles[ptr + STRIDE_INDEXES.POS_Z] / D) + 0.5) * (GRID_SIZE - 1));

                for (let ox = -1; ox <= 1; ox++) {
                    for (let oy = -1; oy <= 1; oy++) {
                        for (let oz = -1; oz <= 1; oz++) {
                            if (interactionCount >= MAX_INTERACTIONS) break;
                            let nx = gx + ox, ny = gy + oy, nz = gz + oz;
                            if (nx < 0) nx += GRID_SIZE; if (nx >= GRID_SIZE) nx -= GRID_SIZE;
                            if (ny < 0) ny += GRID_SIZE; if (ny >= GRID_SIZE) ny -= GRID_SIZE;
                            if (nz < 0) nz += GRID_SIZE; if (nz >= GRID_SIZE) nz -= GRID_SIZE;

                            const cell = spatialGrid[nx * GRID_SIZE * GRID_SIZE + ny * GRID_SIZE + nz];
                            if (!cell) continue;

                            for (const j of cell) {
                                if (i === j) continue;
                                if (interactionCount >= MAX_INTERACTIONS) break;
                                const oPtr = j * STRIDE;
                                if (particles[oPtr + STRIDE_INDEXES.DEAD] > 0) continue;
                                interactionCount++;
                                let dx = particles[oPtr + STRIDE_INDEXES.POS_X] - particles[ptr + STRIDE_INDEXES.POS_X];
                                let dy = particles[oPtr + STRIDE_INDEXES.POS_Y] - particles[ptr + STRIDE_INDEXES.POS_Y];
                                let dz = particles[oPtr + STRIDE_INDEXES.POS_Z] - particles[ptr + STRIDE_INDEXES.POS_Z];
                                
                                if (pure.wrap) {
                                    if (dx > W/2) dx -= W; else if (dx < -W/2) dx += W;
                                    if (dy > H/2) dy -= H; else if (dy < -H/2) dy += H;
                                    if (dz > D/2) dz -= D; else if (dz < -D/2) dz += D;
                                }

                                const d2 = dx*dx + dy*dy + dz*dz + 1.0;
                                const d = Math.sqrt(d2);

                                let phenoMultiplier = 1.0;
                                if (biol.phenotype) {
                                    phenoMultiplier = 1.0 + (particles[ptr + DNA_OFFSETS.ALPHA] || 0.5) * 0.5;
                                }
                                
                                if (biol.ploidy) {
                                    const ploidy = getGeneticsParam(ptr, 59, 2); // DNA_INDEXES.PLOIDY_LEVEL
                                    const regDepth = getGeneticsParam(ptr, 61, 0.3); // DNA_INDEXES.REGULATORY_DEPTH
                                    // Higher ploidy buffers expression noise
                                    phenoMultiplier *= 1.0 + (ploidy - 2) * 0.05 * regDepth;
                                }

                                if (pure.grav) {
                                    const affinity = biol.affinity ? (particles[ptr + DNA_OFFSETS.SPECIES_AFFINITY] || 0) : 0;
                                    const sameSpecies = (particles[ptr + STRIDE_INDEXES.SPECIES_ID] === particles[oPtr + STRIDE_INDEXES.SPECIES_ID]);
                                    const multiplier = sameSpecies ? (1.0 + affinity) : (1.0 - affinity);
                                    
                                    // G * M1 * M2 / r^2
                                    const forceMag = (G * particles[ptr + STRIDE_INDEXES.MASS] * particles[oPtr + STRIDE_INDEXES.MASS] * (particles[ptr + DNA_OFFSETS.FORCE]||0) * multiplier * phenoMultiplier) / (d2 + 10.0);
                                    ax += (dx/d)*forceMag; ay += (dy/d)*forceMag; az += (dz/d)*forceMag;
                                }

                                if (chem.solv && particles[ptr + STRIDE_INDEXES.MASS] > 5.0 && d < 100 * phenoMultiplier) {
                                    const solvForce = 0.5 / d;
                                    ax += (dx/d)*solvForce; ay += (dy/d)*solvForce; az += (dz/d)*solvForce;
                                }

                                if (chem.poly && d < 25 * phenoMultiplier) {
                                    // Polymerization: Chains particles into long strings using Bond Angle as preferred axis.
                                    const bAngle = (particles[ptr + DNA_OFFSETS.BOND_ANGLE] || 0) * Math.PI / 180;
                                    const cAngle = Math.atan2(dy, dx);
                                    const alignment = Math.abs(Math.cos(cAngle - bAngle)); 
                                    const polyForce = 2.0 * alignment; // Removed m2 for stability
                                    ax += (dx/d)*polyForce; ay += (dy/d)*polyForce; az += (dz/d)*polyForce;
                                }

                                if (biol.tracking) {
                                    const predBias = particles[ptr + DNA_OFFSETS.PREDATION_BIAS] || 0;
                                    const massDiff = particles[ptr + STRIDE_INDEXES.MASS] - particles[oPtr + STRIDE_INDEXES.MASS];
                                    if (massDiff > 0.5) {
                                        const trackForce = (predBias * 0.1 * particles[oPtr + STRIDE_INDEXES.MASS]) / d;
                                        ax += (dx/d)*trackForce; ay += (dy/d)*trackForce; az += (dz/d)*trackForce;
                                    } else if (massDiff < -0.5) {
                                        const fleeForce = (particles[ptr + DNA_OFFSETS.JITTER] || 0.1) * 0.2 / d;
                                        ax -= (dx/d)*fleeForce; ay -= (dy/d)*fleeForce; az -= (dz/d)*fleeForce;
                                    }
                                }

                                if ((particles[ptr + DNA_OFFSETS.TORQUE]||0) !== 0 && d < 100) {
                                    const tMag = particles[ptr + DNA_OFFSETS.TORQUE] * 0.1 / d;
                                    ax += -dy * tMag; ay += dx * tMag;
                                }

                                if (pure.bond && d < 60 * phenoMultiplier) {
                                    const affinity = particles[ptr + DNA_OFFSETS.SPECIES_AFFINITY] || 0;
                                    const sameSpecies = (particles[ptr + STRIDE_INDEXES.SPECIES_ID] === particles[oPtr + STRIDE_INDEXES.SPECIES_ID]);
                                    
                                    if ((sameSpecies && affinity >= 0) || (!sameSpecies && affinity < 0)) {
                                        const targetD = (particles[ptr + DNA_OFFSETS.BASE_RADIUS] || 5) * 2.5;
                                        const k = (particles[ptr + DNA_OFFSETS.STIFFNESS] || 0.5) * 0.15;
                                        const stretch = d - targetD;
                                        // Fix: Bond sign must be positive for attraction (towards dx)
                                        const f = stretch * k; 
                                        ax += (dx / d) * f; ay += (dy / d) * f; az += (dz / d) * f;
                                    }
                                }

                                if (chem.crys && d < 30 * phenoMultiplier) {
                                    const targetAngle = (particles[ptr + DNA_OFFSETS.BOND_ANGLE] || 0) * Math.PI / 180;
                                    const currentAngle = Math.atan2(dy, dx);
                                    const diff = targetAngle - currentAngle;
                                    const crysForce = Math.sin(diff) * 0.05 * particles[oPtr + STRIDE_INDEXES.MASS];
                                    ax += -Math.sin(currentAngle) * crysForce;
                                    ay += Math.cos(currentAngle) * crysForce;
                                }

                                let reactionScale = 1.0;
                                if (chem.cata) {
                                    reactionScale = 1.0 + (particles[oPtr + DNA_OFFSETS.CATALYSIS] || 1.0) * 0.1;
                                }

                                if (chem.acid && d < 20) particles[oPtr + STRIDE_INDEXES.MASS] -= 0.005 * localDt * reactionScale;
                                if (chem.redu && d < 20) particles[ptr + STRIDE_INDEXES.MASS] += 0.005 * localDt * reactionScale;

                                if (biol.ener && d < 20) {
                                    const diff = (particles[ptr + STRIDE_INDEXES.ENERGY] - particles[oPtr + STRIDE_INDEXES.ENERGY]) * 0.1;
                                    particles[ptr + STRIDE_INDEXES.ENERGY] -= diff * localDt;
                                    particles[oPtr + STRIDE_INDEXES.ENERGY] += diff * localDt;
                                }

                                if (chem.allo && d < 10 && Math.random() < 0.01 * localDt) {
                                    particles[ptr + STRIDE_INDEXES.SPECIES_ID] = (particles[ptr + STRIDE_INDEXES.SPECIES_ID] + 1) % 12;
                                }

                                let phaseThrough = false;
                                if (meta.dime) {
                                    const symmetry = (particles[ptr + DNA_OFFSETS.SYMMETRY] || 0.5);
                                    if (Math.random() < symmetry * 0.5) phaseThrough = true;
                                }

                                if (thermo.exop && d < 25 && !phaseThrough) {
                                    const heat = (particles[ptr + DNA_OFFSETS.HEAT_OUTPUT] || 0.1) * 0.05 * reactionScale;
                                    ax += (Math.random()-0.5)*heat; ay += (Math.random()-0.5)*heat;
                                }

                                if (biol.horiz && d < 15 && !phaseThrough) {
                                    const hgtRate = particles[ptr + DNA_OFFSETS.HGT_RATE] || 0.005;
                                    applyHorizontalTransfer(ptr, oPtr, hgtRate, localDt);
                                }

                                if ((pure.coll || pure.accr) && !phaseThrough) {
                                    const r1 = 1.0 + Math.sqrt(particles[ptr + STRIDE_INDEXES.MASS]), r2 = 1.0 + Math.sqrt(particles[oPtr + STRIDE_INDEXES.MASS]);
                                    if (d < r1 + r2) {
                                        if (pure.accr) {
                                            const m1 = particles[ptr + STRIDE_INDEXES.MASS];
                                            const m2 = particles[oPtr + STRIDE_INDEXES.MASS];
                                            const fusionEff = (particles[ptr + DNA_OFFSETS.FUSION]||0.5);
                                            const addedMass = m2 * fusionEff;
                                            
                                            // Gene Fusion: blend DNA from consumed particle into survivor
                                            const dnaBlend = Math.min(1.0, addedMass / (m1 + 0.001));
                                            for (let t = 0; t < 42; t++) {
                                                const pv = particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + t] || 0;
                                                const ov = particles[oPtr + STRIDE_INDEXES.DNA_CACHE_START + t] || 0;
                                                particles[ptr + STRIDE_INDEXES.DNA_CACHE_START + t] = pv + (ov - pv) * dnaBlend * 0.5;
                                            }
                                            
                                            // Intermediary Color Blending
                                            const ratio = addedMass / (m1 + addedMass + 0.001);
                                            particles[ptr + STRIDE_INDEXES.COLOR_R] += (particles[oPtr + STRIDE_INDEXES.COLOR_R] - particles[ptr + STRIDE_INDEXES.COLOR_R]) * ratio;
                                            particles[ptr + STRIDE_INDEXES.COLOR_G] += (particles[oPtr + STRIDE_INDEXES.COLOR_G] - particles[ptr + STRIDE_INDEXES.COLOR_G]) * ratio;
                                            particles[ptr + STRIDE_INDEXES.COLOR_B] += (particles[oPtr + STRIDE_INDEXES.COLOR_B] - particles[ptr + STRIDE_INDEXES.COLOR_B]) * ratio;

                                            particles[ptr + STRIDE_INDEXES.MASS] += addedMass;
                                            particles[oPtr + STRIDE_INDEXES.DEAD] = 1;
                                        } else if (pure.coll) {
                                            const nx=dx/d, ny=dy/d, nz=dz/d;
                                            const relV = (particles[ptr+3]-particles[oPtr+3])*nx + (particles[ptr+4]-particles[oPtr+4])*ny + (particles[ptr+5]-particles[oPtr+5])*nz;
                                            if (relV < 0) {
                                                const imp = -(1.0 + (particles[ptr + DNA_OFFSETS.ELASTICITY]||0.5)) * relV / (1/particles[ptr + STRIDE_INDEXES.MASS] + 1/particles[oPtr + STRIDE_INDEXES.MASS]);
                                                particles[ptr+3] += (imp/particles[ptr + STRIDE_INDEXES.MASS])*nx; particles[ptr+4] += (imp/particles[ptr + STRIDE_INDEXES.MASS])*ny; particles[ptr+5] += (imp/particles[ptr + STRIDE_INDEXES.MASS])*nz;
                                                particles[oPtr+3] -= (imp/particles[oPtr + STRIDE_INDEXES.MASS])*nx; particles[oPtr+4] -= (imp/particles[oPtr + STRIDE_INDEXES.MASS])*ny; particles[oPtr+5] -= (imp/particles[oPtr + STRIDE_INDEXES.MASS])*nz;
                                            }
                                        // Predation-based gene absorption
                                        if (biol.tracking && !pure.accr && d < r1 + r2) {
                                            const massDiff = particles[ptr + STRIDE_INDEXES.MASS] - particles[oPtr + STRIDE_INDEXES.MASS];
                                            if (Math.abs(massDiff) > 1.0) {
                                                // Larger particle absorbs DNA from smaller
                                                const predator = massDiff > 0 ? ptr : oPtr;
                                                const prey = massDiff > 0 ? oPtr : ptr;
                                                const absorpRate = 0.05;
                                                for (let t = 0; t < 5; t++) {
                                                    const trait = Math.floor(Math.random() * 42);
                                                    const preyVal = particles[prey + STRIDE_INDEXES.DNA_CACHE_START + trait] || 0;
                                                    const predVal = particles[predator + STRIDE_INDEXES.DNA_CACHE_START + trait] || 0;
                                                    particles[predator + STRIDE_INDEXES.DNA_CACHE_START + trait] = predVal + (preyVal - predVal) * absorpRate;
                                                }
                                                // Prey loses mass, predator gains some
                                                const massTransfer = Math.min(0.5, particles[prey + STRIDE_INDEXES.MASS] * 0.1);
                                                particles[ptr + STRIDE_INDEXES.MASS] -= massTransfer;
                                                particles[oPtr + STRIDE_INDEXES.MASS] += massTransfer;
                                            }
                                        }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Apply Mass-Normalized Acceleration (a = F/m)
                const mass = particles[ptr + STRIDE_INDEXES.MASS] || 1.0;
                const invMass = 1.0 / mass;
                
                const drag = pure.drag ? (1.0 - (particles[ptr + DNA_OFFSETS.FRICTION] || 0.02)) : 1.0;
                const totalViscosity = (particles[ptr + DNA_OFFSETS.VISCOSITY] || 0.98) * (world.globalViscosity || 0.98);

                // Update Velocity with Damping
                particles[ptr+3] = (particles[ptr+3] + ax * invMass) * drag * totalViscosity;
                particles[ptr+4] = (particles[ptr+4] + ay * invMass) * drag * totalViscosity;
                particles[ptr+5] = (particles[ptr+5] + az * invMass) * drag * totalViscosity;

                if (!isFinite_f(particles[ptr+3])) particles[ptr+3] = 0;
                if (!isFinite_f(particles[ptr+4])) particles[ptr+4] = 0;
                if (!isFinite_f(particles[ptr+5])) particles[ptr+5] = 0;

                if (meta.orde) {
                    particles[ptr+3] *= 0.99; particles[ptr+4] *= 0.99; particles[ptr+5] *= 0.99;
                }

                if (meta.will) {
                    const energyNorm = Math.min(1.0, (particles[ptr + STRIDE_INDEXES.ENERGY] || 0) / 100);
                    const resistance = 1.0 - energyNorm * 0.2; 
                    particles[ptr+3] *= resistance; particles[ptr+4] *= resistance; particles[ptr+5] *= resistance;
                }

                const maxV = (particles[ptr + DNA_OFFSETS.MAX_VELOCITY] || 20);
                const speedSq = particles[ptr+3]**2 + particles[ptr+4]**2 + particles[ptr+5]**2;
                if (speedSq > maxV**2) {
                    const scale = maxV / Math.sqrt(speedSq);
                    particles[ptr+3] *= scale; particles[ptr+4] *= scale; particles[ptr+5] *= scale;
                }

                particles[ptr + STRIDE_INDEXES.POS_X] += particles[ptr + STRIDE_INDEXES.VEL_X] * localDt;
                particles[ptr + STRIDE_INDEXES.POS_Y] += particles[ptr + STRIDE_INDEXES.VEL_Y] * localDt;
                particles[ptr + STRIDE_INDEXES.POS_Z] += particles[ptr + STRIDE_INDEXES.VEL_Z] * localDt;

                // Bond/Reposition constraint: resolve overlaps with bonded neighbors
                if (pure.bond || chem.poly) {
                    for (let ci = 0; ci < GRID_SIZE * GRID_SIZE * GRID_SIZE; ci++) {
                        const cell = spatialGrid[ci];
                        if (!cell) continue;
                        for (const bj of cell) {
                            if (i === bj) continue;
                            const bPtr = bj * STRIDE;
                            if (particles[bPtr + STRIDE_INDEXES.DEAD] > 0) continue;
                            
                            let bdx = particles[bPtr + STRIDE_INDEXES.POS_X] - particles[ptr + STRIDE_INDEXES.POS_X];
                            let bdy = particles[bPtr + STRIDE_INDEXES.POS_Y] - particles[ptr + STRIDE_INDEXES.POS_Y];
                            let bdz = particles[bPtr + STRIDE_INDEXES.POS_Z] - particles[ptr + STRIDE_INDEXES.POS_Z];
                            
                            if (pure.wrap) {
                                if (bdx > W/2) bdx -= W; else if (bdx < -W/2) bdx += W;
                                if (bdy > H/2) bdy -= H; else if (bdy < -H/2) bdy += H;
                                if (bdz > D/2) bdz -= D; else if (bdz < -D/2) bdz += D;
                            }
                            
                            const bd2 = bdx*bdx + bdy*bdy + bdz*bdz;
                            const bd = Math.sqrt(bd2 + 0.001);
                            
                            // Calculate combined radii
                            const rA = 1.0 + Math.sqrt(particles[ptr + STRIDE_INDEXES.MASS] || 1.0);
                            const rB = 1.0 + Math.sqrt(particles[bPtr + STRIDE_INDEXES.MASS] || 1.0);
                            const minDist = (rA + rB) * 1.0; // Hard-sphere minimum distance
                            
                            if (bd < minDist) {
                                // Particle-particle non-overlap constraint
                                const overlap = minDist - bd;
                                const totalMass = (particles[ptr + STRIDE_INDEXES.MASS] || 1.0) + (particles[bPtr + STRIDE_INDEXES.MASS] || 1.0);
                                const ratio = (particles[bPtr + STRIDE_INDEXES.MASS] || 1.0) / totalMass;
                                
                                particles[ptr + STRIDE_INDEXES.POS_X] -= (bdx/bd) * overlap * ratio;
                                particles[ptr + STRIDE_INDEXES.POS_Y] -= (bdy/bd) * overlap * ratio;
                                particles[ptr + STRIDE_INDEXES.POS_Z] -= (bdz/bd) * overlap * ratio;
                            }
                            
                            // If bonded, enforce equilibrium distance
                            if (pure.bond) {
                                const sameSpecies = (particles[ptr + STRIDE_INDEXES.SPECIES_ID] === particles[bPtr + STRIDE_INDEXES.SPECIES_ID]);
                                const affinity = particles[ptr + DNA_OFFSETS.SPECIES_AFFINITY] || 0;
                                if ((sameSpecies && affinity >= 0) || (!sameSpecies && affinity < 0)) {
                                    const eqDist = (particles[ptr + DNA_OFFSETS.BASE_RADIUS] || 5) * 2.5 + (particles[bPtr + DNA_OFFSETS.BASE_RADIUS] || 5) * 2.5;
                                    if (bd > eqDist) {
                                        // Pull bonded pair together
                                        const bondStrength = (particles[ptr + DNA_OFFSETS.STIFFNESS] || 0.5) * 0.3;
                                        const stretch = (bd - eqDist) * bondStrength;
                                        particles[ptr + STRIDE_INDEXES.POS_X] += (bdx/bd) * stretch * 0.5;
                                        particles[ptr + STRIDE_INDEXES.POS_Y] += (bdy/bd) * stretch * 0.5;
                                        particles[ptr + STRIDE_INDEXES.POS_Z] += (bdz/bd) * stretch * 0.5;
                                    }
                                }
                            }
                        }
                    }
                }

                if (!isFinite_f(particles[ptr + STRIDE_INDEXES.POS_X])) particles[ptr + STRIDE_INDEXES.POS_X] = (Math.random()-0.5) * W;
                if (!isFinite_f(particles[ptr + STRIDE_INDEXES.POS_Y])) particles[ptr + STRIDE_INDEXES.POS_Y] = (Math.random()-0.5) * H;
                if (!isFinite_f(particles[ptr + STRIDE_INDEXES.POS_Z])) particles[ptr + STRIDE_INDEXES.POS_Z] = (Math.random()-0.5) * D;

                if (!isFinite_f(particles[ptr + STRIDE_INDEXES.MASS])) particles[ptr + STRIDE_INDEXES.MASS] = 1.0;
                if (!isFinite_f(particles[ptr + STRIDE_INDEXES.ENERGY])) particles[ptr + STRIDE_INDEXES.ENERGY] = 50.0;

                particles[ptr + STRIDE_INDEXES.ENERGY] = Math.max(0, Math.min(200, particles[ptr + STRIDE_INDEXES.ENERGY]));

                if (pure.planetary) {
                    const floor = H / 2;
                    if (particles[ptr + STRIDE_INDEXES.POS_Y] > floor) {
                        particles[ptr + STRIDE_INDEXES.POS_Y] = floor;
                        particles[ptr + STRIDE_INDEXES.VEL_Y] *= -0.5;
                    }
                }

                if (pure.wrap) {
                    if (particles[ptr] < -W/2) particles[ptr] += W; if (particles[ptr] > W/2) particles[ptr] -= W;
                    if (particles[ptr+1] < -H/2) particles[ptr+1] += H; if (particles[ptr+1] > H/2) particles[ptr+1] -= H;
                    if (particles[ptr+2] < -D/2) particles[ptr+2] += D; if (particles[ptr+2] > D/2) particles[ptr+2] -= D;
                if (!pure.wrap) {
                    if (particles[ptr] < -W/2) { particles[ptr] = -W/2; particles[ptr+3] *= -0.5; }
                    if (particles[ptr] > W/2) { particles[ptr] = W/2; particles[ptr+3] *= -0.5; }
                    if (particles[ptr+1] < -H/2) { particles[ptr+1] = -H/2; particles[ptr+4] *= -0.5; }
                    if (particles[ptr+1] > H/2) { particles[ptr+1] = H/2; particles[ptr+4] *= -0.5; }
                    if (particles[ptr+2] < -D/2) { particles[ptr+2] = -D/2; particles[ptr+5] *= -0.5; }
                    if (particles[ptr+2] > D/2) { particles[ptr+2] = D/2; particles[ptr+5] *= -0.5; }
                }
                }
            }
        }
        self.postMessage({ type: 'update', particles, version });
    }
};
