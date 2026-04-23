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
        const totalDt = laws.dt || 1.0;
        const G = laws.G || 0.15;
        const W = world.dimX, H = world.dimY, D = world.dimZ;

        // Sub-stepping logic
        const numSubSteps = totalDt > 2.0 ? Math.min(200, Math.ceil(totalDt / 1.0)) : 1;
        const dt = totalDt / numSubSteps;

        for (let sub = 0; sub < numSubSteps; sub++) {
            const deadIndices = [];

            // 1. BIOLOGY
            for (let i = 0; i < count; i++) {
                const ptr = i * STRIDE;
                if (particles[ptr+13] > 0) {
                    if (sub === 0) deadIndices.push(i);
                    continue;
                }
                const dna = specDNA[particles[ptr+12]] || specDNA[0] || { force: 0.1 };
                if (laws.life) {
                    const cost = (0.01 + particles[ptr+11] * 0.001) / (dna.efficiency || 0.8);
                    particles[ptr+22] -= cost * dt;
                    particles[ptr+23] += dt;
                    if (particles[ptr+22] <= 0 || Math.random() < (dna.death || 0) * 0.01) {
                        particles[ptr+13] = 1;
                        if (sub === 0) deadIndices.push(i);
                    }
                }
            }

            // 2. PHYSICS
            for (let i = 0; i < count; i++) {
                const ptr = i * STRIDE;
                if (particles[ptr+13] > 0) continue;
                let ax = 0, ay = 0, az = 0;
                const dna = specDNA[particles[ptr+12]] || specDNA[0] || { force: 0.1 };

                if (laws.jitter) {
                    const j = 0.2;
                    ax += (Math.random()-0.5)*j; ay += (Math.random()-0.5)*j; az += (Math.random()-0.5)*j;
                }

                for (let j = 0; j < count; j++) {
                    if (i === j) continue;
                    const oPtr = j * STRIDE;
                    if (particles[oPtr+13] > 0) continue;

                    const dx = particles[oPtr] - particles[ptr], dy = particles[oPtr+1] - particles[ptr+1], dz = particles[oPtr+2] - particles[ptr+2];
                    const d2 = dx*dx + dy*dy + dz*dz + 2.0;
                    const d = Math.sqrt(d2);

                    if (laws.grav) {
                        const multiplier = (particles[ptr+12] === particles[oPtr+12]) ? (1.0 + (dna.affinity||0)) : (1.0 - (dna.affinity||0));
                        const f = (G * particles[oPtr+11] * (dna.force || 0.1) * multiplier) / d2;
                        ax += (dx/d)*f; ay += (dy/d)*f; az += (dz/d)*f;
                    }

                    if (laws.coll || laws.accr) {
                        const r1 = 2.0 + Math.sqrt(particles[ptr+11]), r2 = 2.0 + Math.sqrt(particles[oPtr+11]);
                        if (d < r1 + r2) {
                            if (laws.accr) {
                                const m1 = particles[ptr+11], m2 = particles[oPtr+11], totalM = m1 + m2;
                                particles[ptr+14] = (particles[ptr+14]*m1 + particles[oPtr+14]*m2)/totalM;
                                particles[ptr+15] = (particles[ptr+15]*m1 + particles[oPtr+15]*m2)/totalM;
                                particles[ptr+16] = (particles[ptr+16]*m1 + particles[oPtr+16]*m2)/totalM;
                                particles[ptr+11] = m1 + m2 * (dna.fusion||0.5);
                                particles[oPtr+13] = 1;
                            } else if (laws.coll) {
                                const nx=dx/d, ny=dy/d, nz=dz/d;
                                const relV = (particles[ptr+3]-particles[oPtr+3])*nx + (particles[ptr+4]-particles[oPtr+4])*ny + (particles[ptr+5]-particles[oPtr+5])*nz;
                                if (relV < 0) {
                                    const imp = -(1.5) * relV / (1/particles[ptr+11] + 1/particles[oPtr+11]);
                                    particles[ptr+3] += (imp/particles[ptr+11])*nx; particles[ptr+4] += (imp/particles[ptr+11])*ny; particles[ptr+5] += (imp/particles[ptr+11])*nz;
                                    particles[oPtr+3] -= (imp/particles[oPtr+11])*nx; particles[oPtr+4] -= (imp/particles[oPtr+11])*ny; particles[oPtr+5] -= (imp/particles[oPtr+11])*nz;
                                }
                            }
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

                if (particles[ptr] < -W/2) particles[ptr] += W; if (particles[ptr] > W/2) particles[ptr] -= W;
                if (particles[ptr+1] < -H/2) particles[ptr+1] += H; if (particles[ptr+1] > H/2) particles[ptr+1] -= H;
                if (particles[ptr+2] < -D/2) particles[ptr+2] += D; if (particles[ptr+2] > D/2) particles[ptr+2] -= D;
            }
        }
        self.postMessage({ type: 'update', particles, version });
    }
};
