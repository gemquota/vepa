# GPU Migration Roadmap: From CPU Workers to Compute Shaders

To reach the 1M+ particle threshold, the system must transition from CPU-bound N-body calculations ($O(n^2)$) to GPU-accelerated compute shaders. This shift enables spatial optimizations that reduce complexity to $O(n \log n)$.

## Staged Migration Plan

### Stage 1: GPU Physics Only
Migration of position updates, velocity updates, and force accumulation to WebGPU compute shaders.

### Stage 2: Spatial Partitioning
Implementation of Spatial Hashing, octrees, and voxel neighborhoods. Includes SIMD genomic evaluation to ensure particles only interact with relevant neighbors.

### Stage 3: Fully GPU Resident Ecosystem
Keeping DNA, signals, and fields entirely on the GPU side to eliminate expensive readback bottlenecks.

### Stage 4: Volumetric Universe Rendering
Using compute-native data to enable density fog, gravitational lensing, and resonance halos as computationally cheap byproducts of the simulation.

## Functional Transformation
Following this migration, the CPU's role shifts from "primary processor" to "observer and historian." This layer—the Drone/Codex—focuses on analytics, historical documentation (Temporal Fossilization), and UI management, while the simulation functions as an autonomous, GPU-driven entity.
