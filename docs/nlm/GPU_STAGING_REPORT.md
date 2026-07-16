# WebGPU Staging & Parity Report

Tracking the migration from CPU-bound calculations to WebGPU Compute Shaders.

## Kernel Implementation Status
| Kernel Type | Status | File / Reference | Parity Notes |
| :--- | :--- | :--- | :--- |
| **Position/Velocity Update** | **Implemented** | `computeShader.glsl.js` | Full parity with JS worker logic. |
| **Force Accumulation** | **In Progress** | `computeShader.glsl.js` | Currently testing N-body complexity optimization. |
| **Spatial Hashing** | **In Progress** | `spatialHash.glsl` | Implementing voxel-based neighborhood lookups. |
| **Genetic Mutation** | **Staged** | `mutation.glsl` | Porting reproductive kernel to the GPU side. |
| **Signal Propagation** | **Staged** | `signaling.glsl` | Designing 4-channel VRAM buffer for signaling. |

## Feature Parity Checklist
- [x] SharedArrayBuffer Integration
- [x] Basic Particle Rendering
- [ ] Fully GPU Resident DNA
- [ ] WebGPU Pipeline Bloom/FX
- [ ] Volumetric Fog / Gravitational Lensing

## Staging Timeline
1.  **Stage 1:** WebGPU-driven physics with JS-driven biology.
2.  **Stage 2:** Entire particle state resident on GPU.
3.  **Stage 3:** Real-time volumetricuniverse rendering.
