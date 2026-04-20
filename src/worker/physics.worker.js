// STRIDE 24: 0:x, 1:y, 2:z, 3:vx, 4:vy, 5:vz, 6:phase, 7:s1, 8:s2, 9:s3, 10:s4, 11:mass, 12:id, 13:dead, 14:R, 15:G, 16:B, 17:timer, 18:wx, 19:wy, 20:wz, 21:charge, 22:energy, 23:age
const STRIDE = 24;
let particles;
let cellS = 500;

self.onmessage = (e) => {
    const { type, data, config, version } = e.data;
    try {
        if (type === 'init') {
            particles = data.particles;
        } else if (type === 'step') {
            if (!particles) return;
            step(config.laws, config.specDNA, config.world);
            self.postMessage({ type: 'update', particles, version });
        }
    } catch (err) {
        self.postMessage({ type: 'error', error: err.message, version });
    }
};

function step(laws, specDNA, world) {
    const count = particles.length / STRIDE;
    const dt = laws.dt || 1.0, G = laws.G !== undefined ? laws.G : 0.15;
    const pic = new Map();
    const W = world.dimX, H = world.dimY, D = world.dimZ;

    for (let i = 0; i < count; i++) {
        const ptr = i * STRIDE;
        // Advanced Biology: Metabolism & Mitosis
        if (laws.life && particles[ptr + 13] === 0) {
            const spId = particles[ptr + 12], dna = specDNA[spId] || specDNA[0];
            // Metabolism cost
            const cost = (0.01 + particles[ptr+11]*0.001) / (dna.efficiency || 0.8);
            particles[ptr+22] -= cost * dt;
            particles[ptr+23] += dt; // Age

            // Death if no energy or spontaneous death rate
            if (particles[ptr+22] <= 0 || Math.random() < (dna.death || 0) * 0.01) particles[ptr+13] = 1;

            // Mitosis (splitting)
            if (particles[ptr+22] > 180 && Math.random() < dna.birth * 0.5) {
                const gx = Math.floor((particles[ptr] + W/2)/cellS), gy = Math.floor((particles[ptr+1] + H/2)/cellS), gz = Math.floor((particles[ptr+2] + D/2)/cellS);
                const key = (gx << 20) | (gy << 10) | gz;

                // Find a dead slot
                for (let j = 0; j < count; j++) {
                    const oPtr = j * STRIDE;
                    if (particles[oPtr+13] > 0) {
                        particles[oPtr+13] = 0;
                        particles[oPtr] = particles[ptr] + (Math.random()-0.5)*10;
                        particles[oPtr+1] = particles[ptr+1] + (Math.random()-0.5)*10;
                        particles[oPtr+2] = particles[ptr+2] + (Math.random()-0.5)*10;
                        particles[oPtr+3] = -particles[ptr+3]; particles[oPtr+4] = -particles[ptr+4]; particles[oPtr+5] = -particles[ptr+5];
                        particles[oPtr+11] = particles[ptr+11] * 0.5;
                        particles[ptr+11] *= 0.5;
                        
                        // HGT (Sex Chance)
                        if (Math.random() < (dna.sex || 0)) {
                            const neighbors = pic.get(key);
                            particles[oPtr+12] = (neighbors && neighbors.length > 1) ? particles[neighbors[Math.floor(Math.random() * neighbors.length)] * STRIDE + 12] : particles[ptr+12];
                        } else {
                            particles[oPtr+12] = particles[ptr+12];
                        }
                        
                        particles[oPtr+22] = particles[ptr+22] = 80;
                        particles[oPtr+21] = particles[ptr+21]; // Charge inheritance
                        
                        if (dna.mutation > 0 && Math.random() < dna.mutation * 0.1) {
                            particles[oPtr+12] = (particles[oPtr+12] + 1) % Object.keys(specDNA).length;
                        }
                        break;
                    }
                }
            }
        }

        if (particles[ptr + 13] > 0) continue;
        
        const spId = particles[ptr + 12], dna = specDNA[spId] || specDNA[0];
        
        // GLOW & SIGNAL UPDATE
        if (laws.glow) {
            const speed = dna.speed || 1.0;
            particles[ptr + 6] += dna.pulse * 0.15 * dt * speed;
            const osc = Math.max(0, Math.sin(particles[ptr + 6]));
            particles[ptr + 7] = osc * dna.strength * dna.tuning[0];
            particles[ptr + 8] = osc * dna.strength * dna.tuning[1];
            particles[ptr + 9] = osc * dna.strength * dna.tuning[2];
            particles[ptr + 10] = osc * dna.strength * dna.tuning[3];
        } else {
            const mD = dna.memoryDecay || 0.99;
            const sD = dna.decay || 0.95; // Signal Decay (Index 20)
            const decay = mD * sD;
            particles[ptr + 7] *= decay;
            particles[ptr + 8] *= decay;
            particles[ptr + 9] *= decay;
            particles[ptr + 10] *= decay;
        }

        const gx = Math.floor((particles[ptr] + W/2)/cellS), gy = Math.floor((particles[ptr+1] + H/2)/cellS), gz = Math.floor((particles[ptr+2] + D/2)/cellS);
        const key = (gx << 20) | (gy << 10) | gz;
        if(!pic.has(key)) pic.set(key, []);
        pic.get(key).push(i);
    }

    for (let i = 0; i < count; i++) {
        const ptr = i * STRIDE;
        if (particles[ptr + 13] > 0) continue;
        const spId = particles[ptr + 12], dna = specDNA[spId] || specDNA[0];
        const gx = Math.floor((particles[ptr] + W/2)/cellS), gy = Math.floor((particles[ptr+1] + H/2)/cellS), gz = Math.floor((particles[ptr+2] + D/2)/cellS);
        let inContact = false;
        
        // COLL & ACCR check
        if (laws.coll || laws.accr) {
            const r1 = (dna.baseRadius || 1.0) + Math.sqrt(particles[ptr+11]);
            const range = Math.ceil((r1 + 50) / cellS); // 50 covers most large bodies
            for (let oz = -range; oz <= range; oz++) {
                for (let oy = -range; oy <= range; oy++) {
                    for (let ox = -range; ox <= range; ox++) {
                        const key = ((gx+ox) << 20) | ((gy+oy) << 10) | (gz+oz);
                        const neighbors = pic.get(key);
                        if (!neighbors) continue;
                        neighbors.forEach(oIdx => {
                            if (i === oIdx) return;
                            const oPtr = oIdx * STRIDE;
                            if (particles[oPtr + 13] > 0) return;
                            const oSpId = particles[oPtr + 12], oDna = specDNA[oSpId] || specDNA[0];
                            const dx = particles[oPtr]-particles[ptr], dy = particles[oPtr+1]-particles[ptr+1], dz = particles[oPtr+2]-particles[ptr+2];
                            const d2 = dx*dx + dy*dy + dz*dz, r2 = (oDna.baseRadius || 1.0) + Math.sqrt(particles[oPtr+11]);
                            if (d2 < (r1 + r2) * (r1 + r2)) {
                                inContact = true;
                                let fused = false;
                                if (laws.accr) {
                                    const rvx = particles[oPtr+3]-particles[ptr+3], rvy = particles[oPtr+4]-particles[ptr+4], rvz = particles[oPtr+5]-particles[ptr+5];
                                    const relMom = Math.sqrt(rvx*rvx + rvy*rvy + rvz*rvz) * (particles[ptr+11] + particles[oPtr+11]);
                                    if (relMom >= dna.fusionMomentum) {
                                        particles[ptr+17] += 1;
                                        if (particles[ptr+17] >= dna.fusionTime) {
                                            const m1 = particles[ptr+11], m2 = particles[oPtr+11], newM = m1 + m2 * (dna.fusion || 0.5);
                                            const v1x = particles[ptr+3], v1y = particles[ptr+4], v1z = particles[ptr+5], v2x = particles[oPtr+3], v2y = particles[oPtr+4], v2z = particles[oPtr+5];
                                            const rx = dx, ry = dy, rz = dz, p2x = v2x*m2, p2y = v2y*m2, p2z = v2z*m2;
                                            const Lx = ry*p2z - rz*p2y, Ly = rz*p2x - rx*p2z, Lz = rx*p2y - ry*p2x;
                                            const I1 = (0.4)*m1*m1, I2 = (0.4)*m2*m2, newI = (0.4)*newM*newM;
                                            const tMult = (dna.torque || 1.0);
                                            particles[ptr+18] = (particles[ptr+18]*I1 + particles[oPtr+18]*I2 + Lx * tMult) / newI;
                                            particles[ptr+19] = (particles[ptr+19]*I1 + particles[oPtr+19]*I2 + Ly * tMult) / newI;
                                            particles[ptr+20] = (particles[ptr+20]*I1 + particles[oPtr+20]*I2 + Lz * tMult) / newI;
                                            particles[ptr+14] = (particles[ptr+14]*m1 + particles[oPtr+14]*m2) / newM;
                                            particles[ptr+15] = (particles[ptr+15]*m1 + particles[oPtr+15]*m2) / newM;
                                            particles[ptr+16] = (particles[ptr+16]*m1 + particles[oPtr+16]*m2) / newM;
                                            particles[ptr+11] = newM; particles[oPtr+13] = 1; particles[ptr+17] = 0;
                                            particles[ptr+22] += 50; // Energy boost
                                            // Heat Output
                                            particles[ptr+3] += (Math.random()-0.5) * dna.heat;
                                            particles[ptr+4] += (Math.random()-0.5) * dna.heat;
                                            particles[ptr+5] += (Math.random()-0.5) * dna.heat;
                                            fused = true;
                                        }
                                    }
                                }
                                if (!fused && laws.coll) {
                                    const dist = Math.sqrt(d2) || 0.1;
                                    const nx = dx/dist, ny = dy/dist, nz = dz/dist;
                                    
                                    // Predation (Eating)
                                    if (dna.predation > 0 && particles[ptr+11] > particles[oPtr+11]*1.5) {
                                        particles[ptr+11] += particles[oPtr+11]*0.8;
                                        particles[ptr+22] += 20; // Energy boost
                                        particles[oPtr+13] = 1; // Dead
                                        fused = true;
                                    }

                                    // Chemistry: Reactions
                                    if (!fused && dna.rxnThresh > 0) {
                                        const localE = particles[ptr+22];
                                        const cat = oDna.catalysis || 1.0;
                                        if (localE > dna.rxnThresh / cat) {
                                            // Trigger transformation
                                            particles[ptr+12] = (particles[ptr+12] + 1) % Object.keys(specDNA).length;
                                            particles[ptr+22] *= 0.5; // Cost of reaction
                                            // Heat Output (Affects neighbor entropy)
                                            particles[oPtr+3] += (Math.random()-0.5) * dna.heat;
                                            particles[oPtr+4] += (Math.random()-0.5) * dna.heat;
                                            particles[oPtr+5] += (Math.random()-0.5) * dna.heat;
                                            fused = true; // Use fused to skip further collision in this frame
                                        }
                                    }

                                    if (!fused) {
                                        // Charge Transfer (Conductivity)
                                        if (dna.conductivity > 0 || oDna.conductivity > 0) {
                                            const cond = (dna.conductivity + oDna.conductivity) * 0.5;
                                            const avgQ = (particles[ptr+21] + particles[oPtr+21]) * 0.5;
                                            particles[ptr+21] += (avgQ - particles[ptr+21]) * cond;
                                            particles[oPtr+21] += (avgQ - particles[oPtr+21]) * cond;
                                        }

                                        // Bond Angle Torque (Alignment)
                                        if (dna.bondAngle > 0) {
                                            const tS = (dna.torque || 1.0) * 0.1;
                                            const bA = dna.bondAngle * Math.PI / 180;
                                            // Simplified alignment torque
                                            particles[ptr+18] += (ny - nz) * Math.sin(bA) * tS;
                                            particles[ptr+19] += (nz - nx) * Math.sin(bA) * tS;
                                            particles[ptr+20] += (nx - ny) * Math.sin(bA) * tS;
                                        }

                                        const relV = (particles[ptr+3]-particles[oPtr+3])*nx + (particles[ptr+4]-particles[oPtr+4])*ny + (particles[ptr+5]-particles[oPtr+5])*nz;
                                        if (relV < 0) {
                                            const elast = (dna.elasticity + oDna.elasticity) / 2;
                                            const imp = -(1 + elast) * relV / (1/particles[ptr+11] + 1/particles[oPtr+11]);
                                            particles[ptr+3] += (imp/particles[ptr+11])*nx; particles[ptr+4] += (imp/particles[ptr+11])*ny; particles[ptr+5] += (imp/particles[ptr+11])*nz;
                                            particles[oPtr+3] -= (imp/particles[oPtr+11])*nx; particles[oPtr+4] -= (imp/particles[oPtr+11])*ny; particles[oPtr+5] -= (imp/particles[oPtr+11])*nz;
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
        if (!inContact) particles[ptr+17] = Math.max(0, particles[ptr+17] - 1);
    }

    for (let i = 0; i < count; i++) {
        const ptr = i * STRIDE;
        if (particles[ptr + 13] > 0) continue;
        let ax = 0, ay = 0, az = 0;
        const px = particles[ptr], py = particles[ptr+1], pz = particles[ptr+2], spId = particles[ptr+12], dna = specDNA[spId] || specDNA[0];
        
        // GRAV check
        if (laws.grav) {
            const range = Math.ceil(Math.sqrt(dna.radius2) / cellS);
            const gx = Math.floor((px + W/2)/cellS), gy = Math.floor((py + H/2)/cellS), gz = Math.floor((pz + D/2)/cellS);
            for (let oz = -range; oz <= range; oz++) {
                for (let oy = -range; oy <= range; oy++) {
                    for (let ox = -range; ox <= range; ox++) {
                        const key = ((gx+ox) << 20) | ((gy+oy) << 10) | (gz+oz);
                        const neighbors = pic.get(key);
                        if (neighbors) {
                            neighbors.forEach(oIdx => {
                                const oPtr = oIdx * STRIDE;
                                if (i === oIdx || particles[oPtr+13] > 0) return;
                                const dx = particles[oPtr]-px, dy = particles[oPtr+1]-py, dz = particles[oPtr+2]-pz, d2 = dx*dx + dy*dy + dz*dz;
                                if (d2 < dna.radius2 && d2 > 0.1) {
                                    const d = Math.sqrt(d2);
                                    // Base force (Gravity/DNA Force)
                                    let f = (G * particles[oPtr+11] * dna.force) / d2;
                                    
                                    // Memory Bias (Internal state s1 increases attraction)
                                    f += (particles[ptr+7] * 2.0) / d;

                                    // Charge interaction (Using Dynamic Charge)
                                    const q1 = particles[ptr+21], q2 = particles[oPtr+21];
                                    const emF = (q1 * q2 * 5.0) / d2;
                                    f -= emF; // Opposites attract, like repels (Coulomb)

                                    // Predation Bias
                                    if (dna.predation > 0 && particles[ptr+11] > particles[oPtr+11]*1.5) {
                                        f += (dna.predation * 5.0) / d2;
                                    }

                                    // Signal-based force (Responsive)
                                    if (dna.resp > 0) {
                                        const sig = (particles[oPtr+7]*dna.tuning[0] + particles[oPtr+8]*dna.tuning[1] + particles[oPtr+9]*dna.tuning[2] + particles[oPtr+10]*dna.tuning[3]);
                                        f += (sig * dna.resp) / d; 
                                    }

                                    // Magnetic Moment (Rotational Alignment)
                                    if (dna.magnetic > 0) {
                                        const mS = dna.magnetic * 0.1;
                                        particles[ptr+18] += (particles[oPtr+18] - particles[ptr+18]) * mS;
                                        particles[ptr+19] += (particles[oPtr+19] - particles[ptr+19]) * mS;
                                        particles[ptr+20] += (particles[oPtr+20] - particles[ptr+20]) * mS;
                                    }

                                    ax += (dx/d)*f; ay += (dy/d)*f; az += (dz/d)*f;
                                }
                            });
                        }
                    }
                }
            }
        }
        
        if (laws.jitter) { ax += (Math.random()-0.5)*0.15; ay += (Math.random()-0.5)*0.15; az += (Math.random()-0.5)*0.15; }
        
        // Advanced Motion: Inertia & Friction
        const invInertia = 1.0 / (dna.inertia || 1.0);
        const friction = (dna.friction || 0.0);
        const globalDrag = laws.drag ? (laws.dragCoeff || 0.993) : 1.0;
        const netDrag = globalDrag * (1.0 - friction);

        particles[ptr+3] = (particles[ptr+3] + ax * invInertia) * netDrag;
        particles[ptr+4] = (particles[ptr+4] + ay * invInertia) * netDrag;
        particles[ptr+5] = (particles[ptr+5] + az * invInertia) * netDrag;

        // Max Velocity Cap
        const v2 = particles[ptr+3]**2 + particles[ptr+4]**2 + particles[ptr+5]**2;
        if (v2 > dna.maxVel**2) {
            const vMag = Math.sqrt(v2);
            particles[ptr+3] *= (dna.maxVel / vMag);
            particles[ptr+4] *= (dna.maxVel / vMag);
            particles[ptr+5] *= (dna.maxVel / vMag);
        }

        particles[ptr] += particles[ptr+3]*dt; particles[ptr+1] += particles[ptr+4]*dt; particles[ptr+2] += particles[ptr+5]*dt;

        // Boundary checks (WRAP vs BOUNCE)
        if (laws.wrap) {
            if (particles[ptr] < -W/2) particles[ptr] += W; if (particles[ptr] > W/2) particles[ptr] -= W;
            if (particles[ptr+1] < -H/2) particles[ptr+1] += H; if (particles[ptr+1] > H/2) particles[ptr+1] -= H;
            if (particles[ptr+2] < -D/2) particles[ptr+2] += D; if (particles[ptr+2] > D/2) particles[ptr+2] -= D;
        } else {
            if (particles[ptr] < -W/2) { particles[ptr] = -W/2; particles[ptr+3] *= -0.5; }
            if (particles[ptr] > W/2) { particles[ptr] = W/2; particles[ptr+3] *= -0.5; }
            if (particles[ptr+1] < -H/2) { particles[ptr+1] = -H/2; particles[ptr+4] *= -0.5; }
            if (particles[ptr+1] > H/2) { particles[ptr+1] = H/2; particles[ptr+4] *= -0.5; }
            if (particles[ptr+2] < -D/2) { particles[ptr+2] = -D/2; particles[ptr+5] *= -0.5; }
            if (particles[ptr+2] > D/2) { particles[ptr+2] = D/2; particles[ptr+5] *= -0.5; }
        }
    }
}
