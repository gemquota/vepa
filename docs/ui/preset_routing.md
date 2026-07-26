# Preset Routing & DNA Splicing

VEPA's preset system is designed for modularity, allowing for the selective importation of simulation states.

## 1. Partial Loading (Data Routing)
Instead of a full state overwrite, the Preset Manager allows you to "Route" specific categories of data:
*   **Physics Only:** Load `laws` and `worldConfig` from a preset but keep the current DNA.
*   **DNA Only:** Load the 42-trait genetic buffer but keep the current environmental laws.
*   **Species Splicing:** Import the DNA of a single species (ID 0-11) from a saved state into the active simulation.

## 2. The Preview Engine
The Preset Manager includes a mini-renderer that runs a low-particle version of the preset in the background, allowing the user to "Peek" at the emergent behavior before committing to a full load.

---
*Operational Manual v1.2*
