import { bus } from "../core/eventBus.js";
const STRIDE = 24;
let particles;
let radiationGrid;
const RAD_RES = 20;
let frame = 0;

// Spatial Grid for Optimization
const GRID_SIZE = 10;
let spatialGrid = [];
let gridMeta = { res: GRID_SIZE, cellSize: 50 };

self.onmessage = (e) => {
    const { type, data, config, version } = e.data;
    if (type === 'init') {
        particles = data.particles;
        radiationGrid = new Float32Array(RAD_RES * RAD_RES * RAD_RES);
    } else if (type === 'step') {
        frame++;
        if (e.data.particles) particles = e.data.particles;
        if (!particles) return;
        
        const count = particles.length / STRIDE;
        const { laws, world, specDNA } = config;
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

        gridMeta.cellSize = Math.max(W, H, D) / GRID_SIZE;

        // 0. Spatial Grid Construction
        spatialGrid = new Array(GRID_SIZE * GRID_SIZE * GRID_SIZE).fill(null).map(() => []);
        for (let i = 0; i < count; i++) {
            const ptr = i * STRIDE;
            if (particles[ptr+13] > 0) continue;
            const gx = Math.floor(((particles[ptr] / W) + 0.5) * GRID_SIZE);
            const gy = Math.floor(((particles[ptr+1] / H) + 0.5) * GRID_SIZE);
            const gz = Math.floor(((particles[ptr+2] / D) + 0.5) * GRID_SIZE);
            if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE && gz >= 0 && gz < GRID_SIZE) {
                spatialGrid[gx * GRID_SIZE * GRID_SIZE + gy * GRID_SIZE + gz].push(i);
            }
        }

        // Sub-stepping logic
        const numSubSteps = totalDt > 2.0 ? Math.min(200, Math.ceil(totalDt / 1.0)) : 1;
        let dt = totalDt / numSubSteps;

        // METAPHYSICS: Time Dilation
        if (meta.time) dt *= 0.2;

        for (let sub = 0; sub < numSubSteps; sub++) {
            const deadIndices = [];

            // 1. BIOLOGY & SPAWNING
            let aliveCount = 0;
            for (let i = 0; i < count; i++) {
                const ptr = i * STRIDE;
                if (particles[ptr+13] > 0) {
                    deadIndices.push(i);
                    continue;
                }
                aliveCount++;
                const dna = specDNA[particles[ptr+12]] || specDNA[0] || { force: 0.1 };

                if (biol.life) {
                    const cost = (0.01 + particles[ptr+11] * 0.001) / (dna.energyEfficiency || 0.8);
                    particles[ptr+22] -= cost * dt;
                    particles[ptr+23] += dt;
                    if (particles[ptr+22] <= 0 || Math.random() < ((dna.death || 0) * 0.01)) {
                        particles[ptr+13] = 1;
                        aliveCount--;
                    }
                }
            }

            // SPAWN LOGIC
            if (biol.reproduction && aliveCount < count && Math.random() < (spawnRate * 0.01 * dt)) {
                const spawnCount = Math.min(deadIndices.length, Math.ceil(spawnRate * dt));
                for (let s = 0; s < spawnCount; s++) {
                    const idx = deadIndices.pop();
                    if (idx === undefined) break;
                    const ptr = idx * STRIDE;
                    const specIdx = Math.floor(Math.random() * specDNA.length);
                    const dna = specDNA[specIdx];
                    if (Math.random() < (dna.birth || 0.1)) {
                        particles[ptr] = (Math.random() - 0.5) * W;
                        particles[ptr+1] = (Math.random() - 0.5) * H;
                        particles[ptr+2] = (Math.random() - 0.5) * D;
                        particles[ptr+3] = (Math.random() - 0.5) * 2;
                        particles[ptr+4] = (Math.random() - 0.5) * 2;
                        particles[ptr+5] = (Math.random() - 0.5) * 2;
                        particles[ptr+11] = 1.0; 
                        particles[ptr+12] = specIdx;
                        particles[ptr+13] = 0;
                        particles[ptr+22] = 100.0;
                        particles[ptr+23] = 0;
                        aliveCount++;
                    }
                }
            }

            // 2. PHYSICS
            for (let i = 0; i < count; i++) {
                const ptr = i * STRIDE;
                if (particles[ptr+13] > 0) continue;
                let ax = 0, ay = 0, az = 0;
                const dna = specDNA[particles[ptr+12]] || specDNA[0] || { force: 0.1 };

                // THERMODYNAMICS: Heat/Cold
                if (thermo.heat) { ax += (Math.random()-0.5)*0.5; ay += (Math.random()-0.5)*0.5; az += (Math.random()-0.5)*0.5; }
                if (thermo.cold) { particles[ptr+3] *= 0.95; particles[ptr+4] *= 0.95; particles[ptr+5] *= 0.95; }

                // METAPHYSICS: Chaos/Order
                if (meta.chao) { ax += (Math.random()-0.5)*2; ay += (Math.random()-0.5)*2; az += (Math.random()-0.5)*2; }
                if (meta.orde) {
                    particles[ptr] = Math.round(particles[ptr]/50)*50;
                    particles[ptr+1] = Math.round(particles[ptr+1]/50)*50;
                    particles[ptr+2] = Math.round(particles[ptr+2]/50)*50;
                }

                if (pure.jitter) {
                    const j = (entropy + (dna.jitter || 0)) * 0.5;
                    ax += (Math.random()-0.5)*j; ay += (Math.random()-0.5)*j; az += (Math.random()-0.5)*j;
                }

                // SPECIES-SPECIFIC JITTER (Always active if DNA > 0)
                if (!pure.jitter && (dna.jitter || 0) > 0) {
                    const j = (dna.jitter || 0) * 0.5;
                    ax += (Math.random()-0.5)*j; ay += (Math.random()-0.5)*j; az += (Math.random()-0.5)*j;
                }

                // PLANETARY: Directional Gravity
                if (pure.planetary) {
                    ay += 0.2; 
                }

                const gx = Math.floor(((particles[ptr] / W) + 0.5) * GRID_SIZE);
                const gy = Math.floor(((particles[ptr+1] / H) + 0.5) * GRID_SIZE);
                const gz = Math.floor(((particles[ptr+2] / D) + 0.5) * GRID_SIZE);

                for (let ox = -1; ox <= 1; ox++) {
                    for (let oy = -1; oy <= 1; oy++) {
                        for (let oz = -1; oz <= 1; oz++) {
                            let nx = gx + ox, ny = gy + oy, nz = gz + oz;
                            if (nx < 0) nx += GRID_SIZE; if (nx >= GRID_SIZE) nx -= GRID_SIZE;
                            if (ny < 0) ny += GRID_SIZE; if (ny >= GRID_SIZE) ny -= GRID_SIZE;
                            if (nz < 0) nz += GRID_SIZE; if (nz >= GRID_SIZE) nz -= GRID_SIZE;

                            const cell = spatialGrid[nx * GRID_SIZE * GRID_SIZE + ny * GRID_SIZE + nz];
                            for (const j of cell) {
                                if (i === j) continue;
                                const oPtr = j * STRIDE;
                                let dx = particles[oPtr] - particles[ptr], dy = particles[oPtr+1] - particles[ptr+1], dz = particles[oPtr+2] - particles[ptr+2];
                                
                                if (pure.wrap) {
                                    if (dx > W/2) dx -= W; else if (dx < -W/2) dx += W;
                                    if (dy > H/2) dy -= H; else if (dy < -H/2) dy += H;
                                    if (dz > D/2) dz -= D; else if (dz < -D/2) dz += D;
                                }

                                const d2 = dx*dx + dy*dy + dz*dz + 1.0;
                                const d = Math.sqrt(d2);

                                // PHYSICS: Gravity
                                if (pure.grav) {
                                    const multiplier = (particles[ptr+12] === particles[oPtr+12]) ? (1.0 + (dna.speciesAffinity||0)) : (1.0 - (dna.speciesAffinity||0));
                                    // Softening to prevent singularity
                                    const softening = 10.0;
                                    const forceMag = (G * particles[oPtr+11] * (dna.force || 0.1) * multiplier) / (d2 + softening);
                                    // Clamp max force per interaction
                                    const clampedForce = Math.min(500, Math.max(-500, forceMag));
                                    ax += (dx/d)*clampedForce; ay += (dy/d)*clampedForce; az += (dz/d)*clampedForce;
                                }

                                // CHEMISTRY: Acidity & Reduction
                                if (chem.acid && d < 10) particles[ptr+11] *= 0.99;
                                if (chem.redu && d < 10) particles[ptr+11] *= 1.01;

                                // CHEMISTRY: Polymerization (Chaining)
                                if (chem.poly && d < 15) {
                                    const spring = 0.05 * (d - 12);
                                    ax += (dx/d)*spring; ay += (dy/d)*spring; az += (dz/d)*spring;
                                }

                                if (pure.coll || pure.accr) {
                                    const r1 = 1.0 + Math.sqrt(particles[ptr+11]), r2 = 1.0 + Math.sqrt(particles[oPtr+11]);
                                    if (d < r1 + r2) {
                                        if (pure.accr) {
                                            const m1 = particles[ptr+11], m2 = particles[oPtr+11], totalM = m1 + m2;
                                            particles[ptr+14] = (particles[ptr+14] * m1 + particles[oPtr+14] * m2) / totalM;
                                            particles[ptr+15] = (particles[ptr+15] * m1 + particles[oPtr+15] * m2) / totalM;
                                            particles[ptr+16] = (particles[ptr+16] * m1 + particles[oPtr+16] * m2) / totalM;
                                            particles[ptr+11] = m1 + m2 * (dna.fusion||0.5);
                                            particles[oPtr+13] = 1;
                                        } else if (pure.coll) {
                                            const nx=dx/d, ny=dy/d, nz=dz/d;
                                            const relV = (particles[ptr+3]-particles[oPtr+3])*nx + (particles[ptr+4]-particles[oPtr+4])*ny + (particles[ptr+5]-particles[oPtr+5])*nz;
                                            if (relV < 0) {
                                                const elasticity = dna.elasticity || 0.5;
                                                const imp = -(1.0 + elasticity) * relV / (1/particles[ptr+11] + 1/particles[oPtr+11]);
                                                particles[ptr+3] += (imp/particles[ptr+11])*nx; particles[ptr+4] += (imp/particles[ptr+11])*ny; particles[ptr+5] += (imp/particles[ptr+11])*nz;
                                                particles[oPtr+3] -= (imp/particles[oPtr+11])*nx; particles[oPtr+4] -= (imp/particles[oPtr+11])*ny; particles[oPtr+5] -= (imp/particles[oPtr+11])*nz;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                const drag = pure.drag ? (1.0 - (dna.friction || 0.02)) : 1.0;
                const speciesViscosity = dna.viscosity !== undefined ? dna.viscosity : 0.98;
                const globalViscosity = world.globalViscosity !== undefined ? world.globalViscosity : 0.98;
                const totalViscosity = speciesViscosity * globalViscosity;
                
                particles[ptr+3] = (particles[ptr+3] + ax) * drag * totalViscosity;
                particles[ptr+4] = (particles[ptr+4] + ay) * drag * totalViscosity;
                particles[ptr+5] = (particles[ptr+5] + az) * drag * totalViscosity;

                // Speed Limit
                const maxV = dna.maxVelocity || 20;
                const speedSq = particles[ptr+3]**2 + particles[ptr+4]**2 + particles[ptr+5]**2;
                if (speedSq > maxV**2) {
                    const scale = maxV / Math.sqrt(speedSq);
                    particles[ptr+3] *= scale; particles[ptr+4] *= scale; particles[ptr+5] *= scale;
                }

                particles[ptr] += particles[ptr+3] * dt;
                particles[ptr+1] += particles[ptr+4] * dt;
                particles[ptr+2] += particles[ptr+5] * dt;

                // NaN PROTECTION & BOUNDARY SANITY
                if (isNaN(particles[ptr]) || isNaN(particles[ptr+1]) || isNaN(particles[ptr+2]) || 
                    Math.abs(particles[ptr]) > W * 10 || Math.abs(particles[ptr+1]) > H * 10 || Math.abs(particles[ptr+2]) > D * 10) {
                    particles[ptr] = (Math.random()-0.5)*W;
                    particles[ptr+1] = (Math.random()-0.5)*H;
                    particles[ptr+2] = (Math.random()-0.5)*D;
                    particles[ptr+3] = particles[ptr+4] = particles[ptr+5] = 0;
                }

                if (pure.planetary) {
                    const floor = H / 2;
                    if (particles[ptr+1] > floor) {
                        particles[ptr+1] = floor;
                        particles[ptr+4] *= -0.5; // Bounce with damping
                        particles[ptr+3] *= 0.9; // Friction
                        particles[ptr+5] *= 0.9; // Friction
                    }
                }

                if (pure.wrap) {
                    if (particles[ptr] < -W/2) particles[ptr] += W; if (particles[ptr] > W/2) particles[ptr] -= W;
                    if (particles[ptr+1] < -H/2) particles[ptr+1] += H; if (particles[ptr+1] > H/2) particles[ptr+1] -= H;
                    if (particles[ptr+2] < -D/2) particles[ptr+2] += D; if (particles[ptr+2] > D/2) particles[ptr+2] -= D;
                }
            }
        }
        self.postMessage({ type: 'update', particles, version });
    }
};
