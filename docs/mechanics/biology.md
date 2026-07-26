# Biology Laws: Ecosystem Emergence

VEPA simulates the core components of biological life: metabolism, reproduction, and evolutionary decay. These laws transform the simulation from a physics toy into a living manifold.

## 1. Metabolism (BIOL + ENER)
Particles are not eternal; they require energy to persist and act.
*   **Energy Tax (D3):** Particles lose energy every frame based on their mass and kinetic activity. The more laws are active in the universe, the higher the "Systemic Tax," simulating the cost of complex reality.
*   **Energy Efficiency:** A DNA trait that scales the metabolic cost. Species with high `Energy Efficiency` can survive in sparse, low-resource regions.
*   **Starvation:** If energy reaches 0, the particle's `DEAD` flag is set. It may leave behind a "Ghost" if `SOUL` is active.

## 2. Reproduction Models (REPRO)
The `REPRO` law enables three distinct biological pathways:
1.  **Asexual Cloning:** Spontaneous birth based on the `Birth Rate` trait. Used by pioneer species to fill the void.
2.  **Mitosis:** Division occurs when `Energy > 90` and `Mass > 1.5`. The parent splits into two offspring, sharing mass and energy.
3.  **Sexual Hybridization:** Occurs during high-momentum collisions if the `Sex Chance` check passes. DNA is cross-propagated, creating a hybrid species with averaged traits.

## 3. Evolutionary Pressure (SENES + GENO)
*   **SENES (Senescence):** Simulates aging. Particles track their `AGE`, and the probability of spontaneous death increases linearly after a specific threshold. This forces population turnover and prevents eternal monocultures.
*   **GENO (Genotype Drift):** DNA is not fixed. It drifts slightly during reproduction or via external triggers like `RAD` (Radiation). This allows for the exploration of new survival niches and the emergence of specialized sub-species.

## 4. Predation & Affinity
*   **Predation Bias:** A DNA trait that applies attraction forces toward lower-mass particles. This creates hunter-prey hierarchies where larger species actively seek out and "consume" smaller ones (via Fusion/Accretion).
*   **Species Affinity:** Controls tribalism. Positive values cause species to cluster together; negative values cause them to seek diversity or act as solitary predators.

---
*Verified for Build B11*
