# The Genomic Kernel: 42-Parameter DNA Processing

The 42-parameter genomic kernel is the core differentiator of the Architect Codex. By treating variables as "Genomic Laws," we define the fundamental constraints of a universe where every particle carries a unique blueprint for its physicality and survival.

## Kernel Categorization
The 42 parameters are distilled into functional clusters:
* **Mechanical:** Governing Inertia, Friction, Max Velocity, and Elasticity.
* **Biological:** Drivers of selection including Birth/Death rates, Mutation chance, and Sex chance.
* **Metabolic:** Energy conservation laws defining mass consumption and conservation. Metabolic efficiency is the primary driver of Genetic Drift.
* **Social Affinity:** Parameters determining clustering preference (homophilic) vs. symbiotic (heterophilic) relationships.

## Field-Based Genetics and Spatial Memory
The implementation of the parallel spatial manifold layer (`FIELD_GRID`) transforms the environment from a static backdrop into an active genomic actor. Through Field-Based Genetics, the "universe itself becomes heritable," where environmental geography shapes the evolutionary possibility space for every species.

### Grid Specifications
Each cell within the `FIELD_GRID[x,y,z]` contains environmental genomic modifiers:
* **Radiation:** Directly influences mutation rates and genetic stability.
* **Signal Conductivity:** Governs how effectively information propagates.
* **Mutation Bias:** Directs the "drift" of species DNA in specific directions.
* **Entropy Pressure:** Challenges the structural integrity of clusters and lattices.
* **Memory Retention & Thermal Noise:** Defines the "phase" of the system, from crystalline stability to gas-like chaos.

## GPU Genetic Operators
In the compute shader, mutation and reproduction are handled as parallel kernels.

### 1. Mutation Kernel (GLSL/WebGPU)
The following pseudo-code illustrates how the system applies genetic drift during reproductive events:

```glsl
// Genomic Drift Operation
void applyMutation(inout float dna[42], float globalMutationRate, float noise) {
    for(int i = 0; i < 42; i++) {
        // Only mutate if probability exceeds threshold
        if (fract(sin(float(i) * noise) * 43758.5453) < dna[BIOLOGICAL_MUTATION_CHANCE]) {
            float drift = (noise - 0.5) * dna[i] * globalMutationRate;
            dna[i] = clamp(dna[i] + drift, 0.0, 1.0);
        }
    }
}
```

### 2. Reproduction Logic (JavaScript Worker)
On the CPU side, reproduction creates a new entry in the `SharedArrayBuffer` by blending parent traits:

```javascript
function reproduce(parentA, parentB, targetOffset) {
    const crossover = Math.random();
    for (let i = 0; i < 42; i++) {
        // Crossover + small environmental noise
        const trait = (i < crossover * 42) ? parentA.dna[i] : parentB.dna[i];
        const mutation = (Math.random() - 0.5) * world.mutationBias;
        
        // Write back to the 24-word stride
        sabView[targetOffset + DNA_START + i] = clamp(trait + mutation, 0, 1);
    }
}
```

## Strategic Impact
The metabolic efficiency and energy conservation laws drive survival pressure. These laws force species to adapt to their selective geography, leading to the emergence of "tiny math empires" where resources and predation bias determine the rise and fall of entire lineages.
