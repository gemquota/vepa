# Physics Laws: Fundamental Interactions

The core physics of VEPA are governed by Newtonian and post-Newtonian interactions that define the "physicality" of the manifold. These laws are processed at ultra-high frequency within the `physics.worker.js`.

## 1. Global Gravity (GRAV)
The primary force of structure. Every particle attracts every other particle using a spatial-grid optimized inverse-square approximation.
$$F_g = \frac{G \cdot m_1 \cdot m_2}{r^2 + \epsilon}$$
*   **Softening Factor ($\epsilon$):** Prevents infinite forces at zero distance, avoiding "Numeric Explosions."
*   **Spatial Grid Optimization:** Interactions are capped by cell capacity (100) to ensure O(N) performance even in dense clusters.

## 2. Fluid Dynamics (DRAG)
Simulates environmental resistance. Drag is applied to the velocity vector every frame to prevent infinite acceleration and ensure energy dissipation.
$$\vec{v}_{new} = \vec{v}_{old} \cdot (1 - \text{drag})$$
*   **Global vs. Local:** `DRAG` (Global Law) applies a baseline friction to the entire universe, while the `Friction` DNA trait allows species to be "slick" or "sticky" regardless of global state.

## 3. Physical Containment (WRAP vs PLANET)
*   **WRAP (Toroidal Topology):** The universe is a continuous loop. $(x, y, z)$ coordinates are modulo-mapped to world dimensions. This eliminates edge bias and allows for infinite-feeling fields.
*   **PLANET (Terrestrial Mode):** Disables vertical wrapping and introduces a constant downward vector $\vec{g} = [0, g, 0]$. It also implements a solid ground collision at $y = H$ with friction and restitution.

## 4. Molecular Linking (BOND)
Implements a damped spring-mass system between species with high affinity.
$$F_b = k_{avg} \cdot (r - r_0) - \eta \cdot v_{rel}$$
*   **Averaged Stiffness ($k_{avg}$):** Ensures that both particles in a bond experience equal and opposite forces, maintaining system momentum.
*   **Relative Damping ($\eta$):** Essential for stability. It siphons energy out of the spring-oscillation to prevent the "Jitter Runaway" common in simple spring simulations.

## 5. Collision Resolution (COLL)
Implements elastic collisions between particles.
*   **Momentum Transfer:** $P = m \cdot v$ is conserved across the collision vector.
*   **Restitution (Elasticity):** Controlled by DNA. Species with high `Elasticity` bounce perfectly; low `Elasticity` species absorb impact energy (simulating soft bodies).

---
*Verified for Build B11*
