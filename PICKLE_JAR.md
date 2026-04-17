# THE PICKLE JAR 🥒

This is the roadmap for the next evolution of VEPA.

## [Batch 2] Visual & Render Layer (v1.1)
*   **New [Render] category in DNA**
*   **Parameters:**
    *   **Trail Length:** Persistence of particle movement trails.
    *   **Glow Intensity:** Multiplier for neon radiance.
    *   **Pulse Opacity:** Controls the alpha oscillation of the blink.
    *   **Particle Opacity:** Base alpha for the particle body.
    *   **Trail Fade:** Decay rate for the rendered trail tail.

## [Batch 3] Sensing & Communication Upgrade (v1.2)
*   **Neighborhood Radius:** Per-species master range multiplier for force + signals.
*   **Expanded Communication:**
    *   **Signal Strength:** Amplitude of the blink signal.
    *   **Signal Decay:** Rate at which the signal dissipates through neighbors.
    *   **Signal Channels (1–4):** Independent channels for signal differentiation.
    *   **Receiver Tuning:** Sensitivity bias to specific channels.
    *   **Propagation Speed:** Delay in signal wave traversal.

## [Batch 4] Motion, Matter & EM Depth (v1.3)
*   **Motion Additions:**
    *   **Inertia:** Resistance to acceleration.
    *   **Friction:** Velocity-dependent drag (independent of global Viscosity).
    *   **Max Velocity Cap:** Hard speed limit for species.
*   **Matter Additions:**
    *   **Base Radius:** Fundamental size without mass influence.
    *   **Per-species Elasticity:** Local collision bounce factor.
    *   **Bond Angle Preference:** Favored angles for cluster formation (Crystal tuning).
*   **EM Additions:**
    *   **Conductivity:** Rate of charge transfer on collision.
    *   **Magnetic Moment:** Rotational alignment in proximity.

## [Batch 5] Biology, Chemistry & Memory (v1.4)
*   **Biology Additions:**
    *   **Energy Efficiency:** Ratio of mass-to-energy conversion.
    *   **Sexual Reproduction Chance:** Probability of multi-parent offspring.
    *   **Predation Bias:** Bonus force when targeting lower-mass particles.
*   **New [Chemistry] Category:**
    *   **Reaction Threshold:** Mass/Charge limit for "phase change."
    *   **Catalysis:** Speed multiplier for nearby reactions.
    *   **Heat Output:** Energy byproduct of interactions.
*   **Memory:**
    *   **State Memory Decay:** How long a particle "remembers" its last stimulus.
    *   **Memory Slots (0–4):** Storage for internal state variables.

## [Batch 6] Global, Chaos, Laws & Final Polish (v1.5+)
*   **Global Fields:**
    *   **Temperature:** Thermal jitter baseline.
    *   **Pressure:** Influence on density/repulsion.
    *   **Wind/Turbulence Vector:** Constant directional force field.
*   **Enhanced Selective Chaos:** Strength sliders per category + heritability bias.
*   **Expanded Laws of Nature:** More complex global interactions.
*   **More Recipes:** New presets for exotic emergent life.
*   **Boundary Types:** Void, Solid, Sticky, Periodic.
*   **LOD/Performance Controls:** Dynamic particle pruning and spatial hash tuning.
