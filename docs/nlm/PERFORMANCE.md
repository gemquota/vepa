# Performance Benchmarking Framework

To ensure the VEPA engine escapes "CPU Gravity," we track performance across these core metrics.

## Core Metrics
*   **PPS (Particles Per Second):** Total particle updates processed per frame.
*   **Sync Latency:** Time taken to sync the `SharedArrayBuffer` between Worker and Main thread.
*   **Genomic Throughput:** Number of reproductive and mutation events processed per second.
*   **Render Overhead:** GPU time spent on depth-sorting and alpha-blending.

## Target Thresholds
| Stage | Particle Count | Framerate Target | Technology |
| :--- | :--- | :--- | :--- |
| **Baseline** | 10,000 | 60 FPS | CPU Worker + PixiJS |
| **Optimized** | 50,000 | 60 FPS | Spatial Hashing + SharedBuffer |
| **Advanced** | 250,000 | 30 FPS | WebGPU Compute (Stage 1) |
| **Cosmogenesis**| 1,000,000 | 30 FPS | Full GPU Residency (Stage 3) |

## Bottleneck Analysis
1.  **N^2 Complexity:** Currently mitigated by neighborhood radius checks.
2.  **Memory Access:** Aligned 24-word stride minimizes cache misses.
3.  **Readback Bottlenecks:** Future GPU stages focus on keeping DNA resident in VRAM.
