# Parameter Audit Suite — Index

18 batches × 4 params = 72 params (world 22 · settings/camera 8 · DNA 42).

> 📄 **Combined results:** [combined.md](combined.md)
> 📄 **Spec:** [SPEC.md](SPEC.md)

| Batch | Params | Result |
|-------|--------|--------|
| [batch 01](batch_01.md) | 01 — WORLD_SIZE / GROUND_HEIGHT / PARTICLE_COUNT / INITIAL_POP | ✅ |
| [batch 02](batch_02.md) | 02 — MAX_POP / SHAPE / SPAWN_CENTRES / SPAWN_CENTRE_RANDOM | ✅ |
| [batch 03](batch_03.md) | 03 — SPAWN_CENTRE_BIAS / GLOBAL_G / WIND / DAMPING | ✅ |
| [batch 04](batch_04.md) | 04 — VISCOSITY / ENTROPY / HEAT_CAPACITY / LIGHT_LEVEL | ✅ |
| [batch 05](batch_05.md) | 05 — RADIATION_LEVEL / SPAWN_RATE / SPECIES_INTERACTION / ENERGY_TRANSFER | ✅ |
| [batch 06](batch_06.md) | 06 — MUTATION_RATE / DECAY_RATE / visualScale / globalAlpha | ✅ |
| [batch 07](batch_07.md) | 07 — starMass / simSpeed / focalLength / ortho | ✅ |
| [batch 08](batch_08.md) | 08 — rotateSensitivity / panSensitivity / DNA.FORCE / DNA.VISCOSITY | ⚠️ |
| [batch 09](batch_09.md) | 09 — DNA.TORQUE / DNA.JITTER / DNA.TIDAL / DNA.INERTIA | ⚠️ |
| [batch 10](batch_10.md) | 10 — DNA.FRICTION / DNA.MAX_VELOCITY / DNA.SYMMETRY / DNA.HIDDEN_MASS | ✅ |
| [batch 11](batch_11.md) | 11 — DNA.STIFFNESS / DNA.FUSION / DNA.FUSION_MOMENTUM / DNA.FUSION_TIME | ⚠️ |
| [batch 12](batch_12.md) | 12 — DNA.BASE_RADIUS / DNA.ELASTICITY / DNA.BOND_ANGLE / DNA.POLARITY | ⚠️ |
| [batch 13](batch_13.md) | 13 — DNA.ALPHA / DNA.CONDUCTIVITY / DNA.MAGNETIC_MOMENT / DNA.REACTION_THRESHOLD | ⚠️ |
| [batch 14](batch_14.md) | 14 — DNA.CATALYSIS / DNA.HEAT_OUTPUT / DNA.BIRTH_RATE / DNA.DEATH_RATE | ⚠️ |
| [batch 15](batch_15.md) | 15 — DNA.MUTATION / DNA.ENERGY_EFFICIENCY / DNA.SEX_CHANCE / DNA.PREDATION_BIAS | ⚠️ |
| [batch 16](batch_16.md) | 16 — DNA.SPECIES_AFFINITY / DNA.SIGNAL_RESP / DNA.PULSE_RATE / DNA.NEIGHBORHOOD_RADIUS | ✅ |
| [batch 17](batch_17.md) | 17 — DNA.SIGNAL_STRENGTH / DNA.SIGNAL_DECAY / DNA.PROPAGATION_SPEED / DNA.TUNING_CH1 | ✅ |
| [batch 18](batch_18.md) | 18 — DNA.TUNING_CH2 / DNA.TUNING_CH3 / DNA.TUNING_CH4 / DNA.MEMORY_DECAY | ✅ |

Statuses: ⏳ pending · ✅ PASS · ⚠️ REPAIRED · ❌ FAULTY
