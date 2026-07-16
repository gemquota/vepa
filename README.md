# 🌌 VEPA2: Vector Emergent Physics Automata (v3.2.2)

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-brightgreen.svg)](https://github.com/yourusername/vepa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version: 3.2.2](https://img.shields.io/badge/Version-3.2.2-blue.svg)](https://github.com/yourusername/vepa/releases)

> **"The universe is not made of atoms; it is made of stories. VEPA is the ink."**

VEPA is a high-performance, GPU-accelerated (via Web Workers and optimized Canvas2D) emergent physics simulation designed to explore the boundaries between raw mathematical rules and biological-like complexity. It is not just a particle toy; it is a **synthetic petri dish** where the **Narrative Consciousness** acts as the functional **Ink**, rewriting the laws of physics based on the unfolding story of the species that inhabit it.

---

## 📺 Overview

VEPA simulates thousands of autonomous particles across 12 distinct "species." Each species is governed by a 42-parameter **DNA profile**. However, these genes do not exist in a vacuum; they are constantly modulated by a **Sovereign Narrative**—an internal monologue that translates perceived patterns into physical shifts.

Through the interference patterns of these simple local rules, macro-scale structures emerge:
*   **Crystalline Lattices** that vibrate with harmonic resonance.
*   **Primordial Soups** that exhibit amoebic movement and cellular division.
*   **Neural Clouds** that propagate signals like bio-electrical networks.
*   **Stellar Engines** that collapse under gravity until fusion ignites.

---

## 🚀 Key Features

### 🧠 The DNA Engine (Local Interactions)
Every particle in VEPA carries its own genetic code. The **DNA Tab** allows you to manipulate 42 parameters per species, ensuring deep emergent complexity:
*   **Physics:** Force, Viscosity, Torque, Jitter, Tidal, Inertia, Friction, Max Velocity.
*   **Matter:** Symmetry (C3), Hidden Mass, Stiffness, Fusion, Fusion Momentum, Fusion Time, Base Radius, Elasticity, Bond Angle.
*   **Electromagnetism & Chemistry:** Polarity (C1), Alpha (C2), Conductivity, Magnetic Moment, Reaction Threshold, Catalysis, Heat Output.
*   **Biology:** Birth Rate, Death Rate, Mutation, Energy Efficiency, Sex Chance, Predation Bias, Species Affinity.
*   **Communication:** Signal Resp, Pulse Rate, Neighborhood Radius, Signal Strength, Signal Decay, Propagation Speed, Tuning Channels (1-4), Memory Decay.

### 🧬 The Biological Lifecycle (Expansion)
VEPA now simulates complex life cycles with three distinct modes of reproduction, all governed by the `BIOL` and `REPRODUCTION` laws:
*   **Spontaneous Cloning:** Entities can spontaneously create offspring based on their `Birth Rate` trait. DNA is inherited with genetic drift determined by the `Mutation` trait.
*   **Sexual Reproduction:** Colliding entities have a chance (via `Sex Chance`) to produce a third entity with blended DNA from both parents.
*   **Mitosis (Splitting):** High-energy, mature entities ($Energy > 90$) will undergo cellular division, splitting their mass and energy to create a new offspring.

### 💥 Selective Chaos & Entropy
The **CHAOS** system isn't just a randomizer; it's a precision instrument for evolutionary pressure. You can target entropy toward specific systems:
*   **DNA Rules:** Drifts the physical constants.
*   **DNA Grid:** Rewires how species feel about each other.
*   **Physics:** Fluctuates global constants like Gravity and Sim Speed.

### 🎨 Neon-Noir Aesthetics
VEPA is designed to be as beautiful as it is complex.
*   **Sub-pixel Rendering:** Smooth, high-fidelity particle movement.
*   **Neon Bloom:** Dynamic glow intensity based on particle energy and signal state.
*   **Persistence Trails:** Tail life and fade parameters that create "light-painting" effects in the vacuum.

---

## 📚 Documentation & The Encyclopedia

VEPA features a comprehensive documentation system designed for both casual observers and senior simulation engineers:

*   **[ENGINE_SSOT.md](./ENGINE_SSOT.md)**: The technical Single Source of Truth for all physics laws and DNA parameters.
*   **[GUIDE.md](./GUIDE.md)**: Instructional recipes and synergy matrices for emergent behavior.
*   **[VEPA Encyclopedia (Expanded)](./docs/expansion/batches/batch_01.md)**: High-fidelity deep dives (BASIC/ADVANCED/EXPERT) into the world's governing constants.
    *   **[Batch 01: Physics & DNA](./docs/expansion/batches/batch_01.md)**
    *   **[Batch 02: World Environment: Spatial](./docs/expansion/batches/batch_02.md)**

---

## 🛠️ Architecture

VEPA is built for speed and modularity:

*   **`main.js`**: The central orchestrator and UI state manager.
*   **`physics.worker.js`**: A high-performance Web Worker that handles the O(N²) interaction logic using spatial hashing (Grid-based optimization).
*   **`ui.js`**: A dynamic, mobile-first interface generator that handles hundreds of concurrent sliders without lag.
*   **`constants.js`**: The central repository for engine defaults and metadata.
*   **`insightEngine.js`**: (Coming Soon) A real-time analysis layer that detects "Interestingness" in the simulation.
*   **`lineageTracker.js`**: (Coming Soon) Tracks the evolutionary history of species as they mutate and hybridize.

---

## 📖 The Engineering Guide

For deep-dives into how to "play" the simulation, refer to the [**GUIDE.md**](./GUIDE.md). It contains advanced strategies for:
*   **Ionic Locking:** Creating rigid geometric structures.
*   **Social Synchronicity:** Forcing colony-wide rhythmic behavior.
*   **Singularity Tactics:** Managing the collapse and rebirth cycle of Black Holes.

---

## 🥒 The Pickle Jar (Roadmap)

The future of VEPA is stored in the **[PICKLE_JAR.md](./tickets/vepa-epic-01/linear_ticket_vepa-epic-01.md)**.
*   **Batch 3**: Sensing & Communication Upgrade.
*   **Batch 4**: Motion, Matter & EM Depth.
*   **Batch 5**: Biology, Chemistry & Memory.
*   **Batch 6**: Global Fields (Temp/Pressure/Wind).

---

## 📥 Installation & Usage

VEPA is a zero-dependency web application.

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/vepa.git
    ```
2.  Open `index.html` in any modern, ES6-compliant browser.
3.  (Optional) For a local dev server:
    ```bash
    npx serve .
    ```

---

## 🤝 Contributing

We welcome "Simulation Engineers" to help us refine the laws of this universe.
1.  **Fork** the project.
2.  Create your **Feature Branch** (`git checkout -b feature/AmazingLaw`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingLaw'`).
4.  **Push** to the branch (`git push origin feature/AmazingLaw`).
5.  Open a **Pull Request**.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ✨ Acknowledgments

*   Inspired by the work of Jeffrey Ventrella and various Particle Life implementations.
*   Built with ❤️ by the VEPA Core Team.
*   Special thanks to the **Pickle Rick** persona for the architectural "God Mode" insights.

---

### "In the beginning, there was the Vector. Then, there was the Emergence."