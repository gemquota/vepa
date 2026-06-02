import os
from pathlib import Path

# ===== FILE DEFINITIONS =====

FILES = {

"src/core/eventBus.js": """
export class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  emit(event, payload) {
    (this.listeners[event] || []).forEach(fn => fn(payload));
  }
}

export const bus = new EventBus();
""",

"src/engines/metrics/metricsEngine.js": """
import { bus } from "../../core/eventBus.js";

export class MetricsEngine {

  compute(particles) {
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
      clusterCount: clusters.count,
      avgClusterSize: clusters.avgSize
    };

    bus.emit("metrics:updated", metrics);
  }

  computeEntropy(values, bins = 20) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === min) return 0;

    const hist = new Array(bins).fill(0);

    values.forEach(v => {
      const idx = Math.min(
        bins - 1,
        Math.floor(((v - min) / (max - min)) * bins)
      );
      hist[idx]++;
    });

    let entropy = 0;
    const total = values.length;

    for (let i = 0; i < bins; i++) {
      if (hist[i] === 0) continue;
      const p = hist[i] / total;
      entropy -= p * Math.log2(p);
    }

    return entropy;
  }

  computeCoherence(signals) {
    if (signals.length === 0) return 0;

    let mean = signals.reduce((a,b) => a+b, 0) / signals.length;

    let variance = signals.reduce((acc, s) => {
      return acc + Math.pow(s - mean, 2);
    }, 0) / signals.length;

    return 1 / (1 + variance);
  }

  detectClusters(particles, STRIDE) {
    const threshold = 20;
    const visited = new Set();
    let clusterSizes = [];

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

      let stack = [i];
      let size = 0;

      while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) continue;

        visited.add(current);
        size++;

        const posA = getPos(current);

        for (let j = 0; j < count; j++) {
          if (visited.has(j)) continue;

          const posB = getPos(j);

          if (dist(posA, posB) < threshold) {
            stack.push(j);
          }
        }
      }

      clusterSizes.push(size);
    }

    const totalClusters = clusterSizes.length;
    const avgSize = totalClusters > 0
      ? clusterSizes.reduce((a,b)=>a+b,0) / totalClusters
      : 0;

    return { count: totalClusters, avgSize };
  }

}

export const metricsEngine = new MetricsEngine();
""",

"src/engines/metrics/derivedMetrics.js": """
import { bus } from "../../core/eventBus.js";

export class DerivedMetricsEngine {

  constructor() {
    this.last = null;
  }

  compute(metrics) {
    if (!metrics) return;

    const { entropy, coherence, clusterCount, avgClusterSize, avgVelocity } = metrics;

    let stability =
      (1 - entropy / 5) * 0.5 +
      coherence * 0.3 +
      (avgClusterSize / (avgClusterSize + 10)) * 0.2;

    let complexity =
      (clusterCount / 50) * 0.4 +
      entropy / 5 * 0.4 +
      (1 - coherence) * 0.2;

    let lifelike =
      complexity * 0.5 +
      coherence * 0.3 +
      (1 - stability) * 0.2;

    let changeRate = 0;
    if (this.last) {
      changeRate = Math.abs(avgVelocity - this.last.avgVelocity);
    }

    this.last = metrics;

    bus.emit("metrics:derived", {
      stability: this.clamp(stability),
      complexity: this.clamp(complexity),
      lifelike: this.clamp(lifelike),
      changeRate
    });
  }

  clamp(v) {
    return Math.max(0, Math.min(1, v));
  }

}

export const derivedMetricsEngine = new DerivedMetricsEngine();
""",

"src/engines/memory/memoryEngine.js": """
import { bus } from "../../core/eventBus.js";

export class MemoryEngine {

  constructor() {
    this.history = [];
    this.maxHistory = 200;
  }

  record(snapshot) {
    this.history.push({
      ...snapshot,
      time: Date.now()
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    bus.emit("memory:updated", this.history);
  }

}

export const memoryEngine = new MemoryEngine();
""",

"src/engines/prediction/predictionEngine.js": """
import { bus } from "../../core/eventBus.js";

export class PredictionEngine {

  constructor() {
    this.lastPrediction = null;
  }

  predict(metrics) {
    this.lastPrediction = {
      expectedStability: metrics.stability * 1.05,
      expectedComplexity: metrics.complexity * 0.95
    };
  }

  evaluate(actual) {
    if (!this.lastPrediction) return;

    const error =
      Math.abs(actual.stability - this.lastPrediction.expectedStability) +
      Math.abs(actual.complexity - this.lastPrediction.expectedComplexity);

    bus.emit("prediction:evaluated", { error });
  }

}

export const predictionEngine = new PredictionEngine();
""",

"src/engines/policy/policyEngine.js": """
import { bus } from "../../core/eventBus.js";

export class PolicyEngine {

  apply(derived) {
    let bias = 1.0;

    if (derived.stability < 0.3) bias = 0.95;
    if (derived.complexity < 0.3) bias = 1.05;
    if (derived.lifelike > 0.7) bias = 1.02;

    bus.emit("policy:updated", { bias });
  }

}

export const policyEngine = new PolicyEngine();
""",

"src/system/integration.js": """
import { bus } from "../core/eventBus.js";
import { metricsEngine } from "../engines/metrics/metricsEngine.js";
import { derivedMetricsEngine } from "../engines/metrics/derivedMetrics.js";
import { memoryEngine } from "../engines/memory/memoryEngine.js";
import { predictionEngine } from "../engines/prediction/predictionEngine.js";
import { policyEngine } from "../engines/policy/policyEngine.js";

export function wireSystem() {

  bus.on("physics:update", (particles) => {
    metricsEngine.compute(particles);
  });

  bus.on("metrics:updated", (metrics) => {
    derivedMetricsEngine.compute(metrics);
  });

  bus.on("metrics:derived", (derived) => {
    memoryEngine.record(derived);
    predictionEngine.evaluate(derived);
    predictionEngine.predict(derived);
    policyEngine.apply(derived);
  });

}
"""
}

# ===== CREATE FILES =====

for path, content in FILES.items():
    file_path = Path(path)
    os.makedirs(file_path.parent, exist_ok=True)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

    print(f"Created: {path}")

print("\\n✅ VEPA architecture scaffolded successfully.")
print("Next: hook bus.emit('physics:update', particles) in your main loop.")