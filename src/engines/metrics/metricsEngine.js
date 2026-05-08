import { bus } from "../../core/eventBus.js";

export class MetricsEngine {

  compute(particles, time = Date.now(), frame = 0) {
    const STRIDE = 24;
    const count = particles.length / STRIDE;

    if (count === 0) return;

    let totalVel = 0;
    let velocities = [];
    let totalMass = 0;
    let signalValues = [];

    for (let i = 0; i < count; i++) {
      const ptr = i * STRIDE;

      const vx = particles[ptr+3];
      const vy = particles[ptr+4];
      const vz = particles[ptr+5];

      const speed = Math.sqrt(vx*vx + vy*vy + vz*vz);
      velocities.push(speed);
      totalVel += speed;

      totalMass += particles[ptr+11];
      signalValues.push(particles[ptr+14] || 0);
    }

    const avgVelocity = totalVel / count;

    const entropy = this.computeEntropy(velocities, 20);
    const coherence = this.computeCoherence(signalValues);
    const clusters = this.detectClusters(particles, STRIDE);

    const metrics = {
      particleCount: count,
      totalMass,
      avgVelocity,
      entropy,
      coherence,
      clusterCount: clusters.length,
      avgClusterSize: clusters.length > 0 ? clusters.reduce((acc, c) => acc + c.length, 0) / clusters.length : 0,
      clusters, // Now sending the full cluster arrays
      time,
      frame
    };

    bus.emit("metrics:updated", metrics);
  }

  // ... (computeEntropy and computeCoherence remain same)

  detectClusters(particles, STRIDE) {
    const threshold = 20;
    const visited = new Set();
    let clusters = [];

    const count = particles.length / STRIDE;

    const getPos = (i) => {
      const ptr = i * STRIDE;
      return [
        particles[ptr],
        particles[ptr+1],
        particles[ptr+2]
      ];
    };

    const dist = (a, b) => {
      const dx = a[0]-b[0];
      const dy = a[1]-b[1];
      const dz = a[2]-b[2];
      return Math.sqrt(dx*dx + dy*dy + dz*dz);
    };

    for (let i = 0; i < count; i++) {
      if (visited.has(i)) continue;
      // Skip dead particles
      if (particles[i * STRIDE + 13] > 0) continue;

      let stack = [i];
      let currentCluster = [];

      while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) continue;

        visited.add(current);
        currentCluster.push(current);

        const posA = getPos(current);

        // Optimization: only check nearby particles?
        // For now, keep it simple but skip dead ones.
        for (let j = 0; j < count; j++) {
          if (visited.has(j)) continue;
          if (particles[j * STRIDE + 13] > 0) continue;

          const posB = getPos(j);

          if (dist(posA, posB) < threshold) {
            stack.push(j);
          }
        }
      }

      if (currentCluster.length > 1) { // Only count groups of 2+ as clusters
        clusters.push(currentCluster);
      }
    }

    return clusters;
  }

}

export const metricsEngine = new MetricsEngine();
