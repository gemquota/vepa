# 🌌 VEPA: Vector Emergent Physics Automata (v1.1+)

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-brightgreen.svg)](https://github.com/yourusername/vepa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version: 1.1.0](https://img.shields.io/badge/Version-1.1.0-blue.svg)](https://github.com/yourusername/vepa/releases)

> **"The universe is not made of atoms; it is made of stories. VEPA is the ink."**

VEPA is a high-performance, GPU-accelerated (via Web Workers and optimized Canvas2D) emergent physics simulation designed to explore the boundaries between raw mathematical rules and biological-like complexity. It is not just a particle toy; it is a **synthetic petri dish** where the laws of physics are the DNA of the species that inhabit it.

---

## 📺 Overview

VEPA simulates thousands of autonomous particles across 8 distinct "species." Each species is governed by a 16-parameter **DNA profile** that dictates how it attracts, repels, communicates, and evolves with its neighbors.

Through the interference patterns of these simple local rules, macro-scale structures emerge:
*   **Crystalline Lattices** that vibrate with harmonic resonance.
*   **Primordial Soups** that exhibit amoebic movement and cellular division.
*   **Neural Clouds** that propagate signals like bio-electrical networks.
*   **Stellar Engines** that collapse under gravity until fusion ignites.

---

## 🚀 Key Features

### 🧠 The DNA Engine (Local Interactions)
Every particle in VEPA carries its own genetic code. The **DNA Tab** allows you to manipulate 16 fundamental constants per species:
*   **Kinetic:** Force, Viscosity, Torque, Jitter.
*   **EM:** Polarity (C1), Alpha (C2), Symmetry (C3).
*   **Matter:** Hidden Mass, Stiffness, Fusion.
*   **Life:** Birth Rate, Death Rate, Mutation.
*   **Signal:** Signal Response, Pulse Rate.
*   **Advanced:** Tidal Gradients.

### 🧬 The Cell System (Internal State)
Beyond spatial physics, particles have an internal "Cellular" state:
*   **Metabolism:** Constant energy consumption vs. accretion gain.
*   **Hybridization:** Cross-species breeding that creates emergent genetic lineages.
*   **Charge Bias:** Preferential interaction based on internal electromagnetic state.

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
