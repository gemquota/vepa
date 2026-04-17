// STRIDE 18: 0:x, 1:y, 2:z, 3:vx, 4:vy, 5:vz, 6:phase, 7:s1, 8:s2, 9:s3, 10:s4, 11:mass, 12:id, 13:dead, 14:R, 15:G, 16:B, 17:timer
const STRIDE = 18;
let particles;
let cellS = 500;

self.onmessage = (e) => {
    const { type, data, config, version } = e.data;
    if (type === 'init') {
        particles = data.particles;
    } else if (type === 'step') {
        if (!particles) return;
        step(config.laws, config.specDNA, config.world);
        self.postMessage({ type: 'update', particles, version });
    }
};

function step(laws, specDNA, world) {
    const count = particles.length / STRIDE;
    const dt = laws.dt || 1.0, G = laws.G !== undefined ? laws.G : 0.15;
    const pic = new Map();
    const W = world.dimX, H = world.dimY, D = world.dimZ;

    for (let i = 0; i < count; i++) {
        const ptr = i * STRIDE;
        if (particles[ptr + 13] > 0 && Math.random() < world.spawnRate * 0.05) {
            particles[ptr] = (Math.random()-0.5)*W*0.3;
            particles[ptr+1] = (Math.random()-0.5)*H*0.3;
            particles[ptr+2] = (Math.random()-0.5)*D*0.3;
            particles[ptr+3] = particles[ptr+4] = particles[ptr+5] = 0;
            particles[ptr+11] = 1.0; particles[ptr+13] = 0; particles[ptr+17] = 0;
        }
        if (particles[ptr + 13] > 0) continue;
        const spId = particles[ptr + 12], dna = specDNA[spId] || specDNA[0];
        particles[ptr + 6] += dna.pulse * 0.15 * dt;
        particles[ptr + 7] = Math.max(0, Math.sin(particles[ptr + 6])) * dna.strength;
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
        for (let oz = -1; oz <= 1; oz++) {
            for (let oy = -1; oy <= 1; oy++) {
                for (let ox = -1; ox <= 1; ox++) {
                    const key = ((gx+ox) << 20) | ((gy+oy) << 10) | (gz+oz);
                    const neighbors = pic.get(key);
                    if (!neighbors) continue;
                    neighbors.forEach(oIdx => {
                        if (i === oIdx) return;
                        const oPtr = oIdx * STRIDE;
                        if (particles[oPtr + 13] > 0) return;
                        const dx = particles[oPtr]-particles[ptr], dy = particles[oPtr+1]-particles[ptr+1], dz = particles[oPtr+2]-particles[ptr+2];
                        const d2 = dx*dx + dy*dy + dz*dz, r1 = Math.sqrt(particles[ptr+11]), r2 = Math.sqrt(particles[oPtr+11]);
                        if (d2 < (r1 + r2) * (r1 + r2)) {
                            inContact = true;
                            const rvx = particles[oPtr+3]-particles[ptr+3], rvy = particles[oPtr+4]-particles[ptr+4], rvz = particles[oPtr+5]-particles[ptr+5];
                            const relMom = Math.sqrt(rvx*rvx + rvy*rvy + rvz*rvz) * (particles[ptr+11] + particles[oPtr+11]);
                            if (relMom >= dna.fusionMomentum) {
                                particles[ptr+17] += 1;
                                if (particles[ptr+17] >= dna.fusionTime) {
                                    const m1 = particles[ptr+11], m2 = particles[oPtr+11], newM = m1 + m2;
                                    particles[ptr+3] = (particles[ptr+3]*m1 + particles[oPtr+3]*m2) / newM;
                                    particles[ptr+4] = (particles[ptr+4]*m1 + particles[oPtr+4]*m2) / newM;
                                    particles[ptr+5] = (particles[ptr+5]*m1 + particles[oPtr+5]*m2) / newM;
                                    particles[ptr+14] = (particles[ptr+14]*m1 + particles[oPtr+14]*m2) / newM;
                                    particles[ptr+15] = (particles[ptr+15]*m1 + particles[oPtr+15]*m2) / newM;
                                    particles[ptr+16] = (particles[ptr+16]*m1 + particles[oPtr+16]*m2) / newM;
                                    particles[ptr+11] = newM; particles[oPtr+13] = 1; particles[ptr+17] = 0;
                                }
                            }
                        }
                    });
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
        const gx = Math.floor((px + W/2)/cellS), gy = Math.floor((py + H/2)/cellS), gz = Math.floor((pz + D/2)/cellS);
        for (let oz = -1; oz <= 1; oz++) {
            for (let oy = -1; oy <= 1; oy++) {
                for (let ox = -1; ox <= 1; ox++) {
                    const key = ((gx+ox) << 20) | ((gy+oy) << 10) | (gz+oz);
                    const neighbors = pic.get(key);
                    if (neighbors) {
                        neighbors.forEach(oIdx => {
                            const oPtr = oIdx * STRIDE;
                            if (i === oIdx || particles[oPtr+13] > 0) return;
                            const dx = particles[oPtr]-px, dy = particles[oPtr+1]-py, dz = particles[oPtr+2]-pz, d2 = dx*dx + dy*dy + dz*dz;
                            if (d2 < dna.radius2 && d2 > 0.1) {
                                const d = Math.sqrt(d2), f = (G * particles[oPtr+11]) / d2;
                                ax += (dx/d)*f; ay += (dy/d)*f; az += (dz/d)*f;
                            }
                        });
                    }
                }
            }
        }
        if (laws.jitter) { ax += (Math.random()-0.5)*0.15; ay += (Math.random()-0.5)*0.15; az += (Math.random()-0.5)*0.15; }
        const drag = laws.drag ? laws.dragCoeff : 1.0;
        particles[ptr+3] = (particles[ptr+3]+ax)*drag; particles[ptr+4] = (particles[ptr+4]+ay)*drag; particles[ptr+5] = (particles[ptr+5]+az)*drag;
        particles[ptr] += particles[ptr+3]*dt; particles[ptr+1] += particles[ptr+4]*dt; particles[ptr+2] += particles[ptr+5]*dt;

        // Boundary checks
        if (particles[ptr] < -W/2) { particles[ptr] = -W/2; particles[ptr+3] *= -0.5; }
        if (particles[ptr] > W/2) { particles[ptr] = W/2; particles[ptr+3] *= -0.5; }
        if (particles[ptr+1] < -H/2) { particles[ptr+1] = -H/2; particles[ptr+4] *= -0.5; }
        if (particles[ptr+1] > H/2) { particles[ptr+1] = H/2; particles[ptr+4] *= -0.5; }
        if (particles[ptr+2] < -D/2) { particles[ptr+2] = -D/2; particles[ptr+5] *= -0.5; }
        if (particles[ptr+2] > D/2) { particles[ptr+2] = D/2; particles[ptr+5] *= -0.5; }
    }
}
