const STRIDE = 24;
let particles;

self.onmessage = (e) => {
    const { type, data, config, version } = e.data;
    if (type === 'init') {
        particles = data.particles;
    } else if (type === 'step') {
        if (e.data.particles) particles = e.data.particles;
        if (!particles) return;
        
        const count = particles.length / STRIDE;
        const { laws, world, specDNA } = config;
        const dt = laws.dt || 1.0;
        const G = laws.G || 0.15;
        const W = world.dimX, H = world.dimY, D = world.dimZ;
        const deadIndices = [];

        // 1. BIOLOGY & SIGNALS
        for (let i = 0; i < count; i++) {
            const ptr = i * STRIDE;
            if (particles[ptr+13] > 0) {
                deadIndices.push(i);
                continue;
            }

            const dna = specDNA[particles[ptr+12]] || specDNA[0] || { force: 0.1 };

            // Glow / Signals
            if (laws.glow) {
                const speed = dna.speed || 1.0;
                particles[ptr+6] = (particles[ptr+6] || 0) + (dna.pulse || 0) * 0.15 * dt * speed;
                const osc = Math.max(0, Math.sin(particles[ptr+6]));
                const strength = dna.strength || 0;
                const tuning = dna.tuning || [0,0,0,0];
                particles[ptr+7] = osc * strength * (tuning[0] || 0);
                particles[ptr+8] = osc * strength * (tuning[1] || 0);
                particles[ptr+9] = osc * strength * (tuning[2] || 0);
                particles[ptr+10] = osc * strength * (tuning[3] || 0);
            }

            // Life (Metabolism & Age)
            if (laws.life) {
                const cost = (0.01 + particles[ptr+11] * 0.001) / (dna.efficiency || 0.8);
                particles[ptr+22] -= cost * dt; // Energy
                particles[ptr+23] += dt; // Age
                if (particles[ptr+22] <= 0 || Math.random() < (dna.death || 0) * 0.01) {
                    particles[ptr+13] = 1; // Dead
                    deadIndices.push(i);
                }
            }
        }

        // 2. MITOSIS
        if (laws.life) {
            for (let i = 0; i < count; i++) {
                const ptr = i * STRIDE;
                if (particles[ptr+13] === 0 && particles[ptr+22] > 180) {
                    const dna = specDNA[particles[ptr+12]] || specDNA[0];
                    if (Math.random() < (dna.birth || 0) * 0.5 && deadIndices.length > 0) {
                        const oIdx = deadIndices.pop();
                        const oPtr = oIdx * STRIDE;
                        particles[oPtr+13] = 0; // Revive
                        particles[oPtr] = particles[ptr] + (Math.random()-0.5)*10;
                        particles[oPtr+1] = particles[ptr+1] + (Math.random()-0.5)*10;
                        particles[oPtr+2] = particles[ptr+2] + (Math.random()-0.5)*10;
                        particles[oPtr+3] = -particles[ptr+3]; particles[oPtr+4] = -particles[ptr+4]; particles[oPtr+5] = -particles[ptr+5];
                        particles[oPtr+11] = particles[ptr+11] * 0.5;
                        particles[ptr+11] *= 0.5;
                        particles[oPtr+12] = particles[ptr+12]; // Same species
                        particles[oPtr+22] = particles[ptr+22] = 80; // Split energy
                        // Inherit Color
                        particles[oPtr+14] = particles[ptr+14];
                        particles[oPtr+15] = particles[ptr+15];
                        particles[oPtr+16] = particles[ptr+16];
                    }
                }
            }
        }

        // 3. GRAVITY & COLLISIONS
        for (let i = 0; i < count; i++) {
            const ptr = i * STRIDE;
            if (particles[ptr+13] > 0) continue;

            let ax = 0, ay = 0, az = 0;
            const dna = specDNA[particles[ptr+12]] || specDNA[0] || { force: 0.1 };

            if (laws.jitter) {
                ax += (Math.random()-0.5) * 0.2;
                ay += (Math.random()-0.5) * 0.2;
                az += (Math.random()-0.5) * 0.2;
            }

            for (let j = 0; j < count; j++) {
                if (i === j) continue;
                const oPtr = j * STRIDE;
                if (particles[oPtr+13] > 0) continue;

                const dx = particles[oPtr] - particles[ptr];
                const dy = particles[oPtr+1] - particles[ptr+1];
                const dz = particles[oPtr+2] - particles[ptr+2];
                const d2 = dx*dx + dy*dy + dz*dz + 2.0;
                const d = Math.sqrt(d2);

                if (laws.grav) {
                    const affinity = dna.affinity || 0;
                    const sameSpecies = (particles[ptr+12] === particles[oPtr+12]);
                    const multiplier = sameSpecies ? (1.0 + affinity) : (1.0 - affinity);
                    const f = (G * particles[oPtr+11] * (dna.force || 0.1) * multiplier) / d2;
                    ax += (dx/d)*f; ay += (dy/d)*f; az += (dz/d)*f;
                }

                // Collisions / Accretion
                if (laws.coll || laws.accr) {
                    const oDna = specDNA[particles[oPtr+12]] || specDNA[0] || {};
                    const r1 = (dna.baseRadius || 2.0) + Math.sqrt(particles[ptr+11] || 1.0);
                    const r2 = (oDna.baseRadius || 2.0) + Math.sqrt(particles[oPtr+11] || 1.0);

                    if (d < (r1 + r2)) {
                        let fused = false;
                        if (laws.accr) {
                            // Instant accretion with color mixing
                            const m1 = particles[ptr+11], m2 = particles[oPtr+11];
                            const fEff = (dna.fusion !== undefined ? dna.fusion : 0.5);
                            const totalM = m1 + m2;
                            
                            // Weighted average color mixing
                            particles[ptr+14] = (particles[ptr+14] * m1 + particles[oPtr+14] * m2) / totalM;
                            particles[ptr+15] = (particles[ptr+15] * m1 + particles[oPtr+15] * m2) / totalM;
                            particles[ptr+16] = (particles[ptr+16] * m1 + particles[oPtr+16] * m2) / totalM;

                            const newM = m1 + m2 * fEff;
                            particles[ptr+11] = newM; 
                            particles[oPtr+13] = 1; // Mark dead
                            fused = true;
                        }
                        
                        if (!fused && laws.coll) {
                            const nx = dx/d, ny = dy/d, nz = dz/d;
                            const relV = (particles[ptr+3]-particles[oPtr+3])*nx + (particles[ptr+4]-particles[oPtr+4])*ny + (particles[ptr+5]-particles[oPtr+5])*nz;
                            if (relV < 0) {
                                const elast = ((dna.elasticity || 0.5) + (oDna.elasticity || 0.5)) / 2;
                                const m1 = particles[ptr+11], m2 = particles[oPtr+11];
                                const imp = -(1 + elast) * relV / (1/m1 + 1/m2);
                                particles[ptr+3] += (imp/m1)*nx; particles[ptr+4] += (imp/m1)*ny; particles[ptr+5] += (imp/m1)*nz;
                                particles[oPtr+3] -= (imp/m2)*nx; particles[oPtr+4] -= (imp/m2)*ny; particles[oPtr+5] -= (imp/m2)*nz;
                            }
                        }
                    } else {
                        // Slowly decay fusion timer if not in contact
                        particles[ptr+17] = Math.max(0, (particles[ptr+17] || 0) - 0.5);
                    }
                }
            }

            const drag = laws.drag ? 0.98 : 1.0;
            particles[ptr+3] = (particles[ptr+3] + ax) * drag;
            particles[ptr+4] = (particles[ptr+4] + ay) * drag;
            particles[ptr+5] = (particles[ptr+5] + az) * drag;

            particles[ptr] += particles[ptr+3] * dt;
            particles[ptr+1] += particles[ptr+4] * dt;
            particles[ptr+2] += particles[ptr+5] * dt;

            // Simple Wrap
            if (particles[ptr] < -W/2) particles[ptr] += W; if (particles[ptr] > W/2) particles[ptr] -= W;
            if (particles[ptr+1] < -H/2) particles[ptr+1] += H; if (particles[ptr+1] > H/2) particles[ptr+1] -= H;
            if (particles[ptr+2] < -D/2) particles[ptr+2] += D; if (particles[ptr+2] > D/2) particles[ptr+2] -= D;

            // Final NaN check for this particle
            if (isNaN(particles[ptr])) {
                particles[ptr] = (Math.random()-0.5)*100; particles[ptr+1] = (Math.random()-0.5)*100; particles[ptr+2] = (Math.random()-0.5)*100;
                particles[ptr+3] = particles[ptr+4] = particles[ptr+5] = 0;
            }
        }

        self.postMessage({ type: 'update', particles, version });
    }
};
