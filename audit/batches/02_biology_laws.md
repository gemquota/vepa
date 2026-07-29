# Audit Batch 2: Biology Laws

## Laws: LIFE, GLOW, AFFINITY, REPRO, TRACK, SENESCENCE, ENERGY, RADIATION, GENOTYPE, PHENOTYPE

### Status Summary

| Law | Index | Function | Implemented | Called in Solver | Category |
|-----|-------|----------|-------------|------------------|----------|
| LIFE | 7 | applyLifeCycle | ✓ | ✓ | Biology (GREEN) |
| GLOW | 8 | — | ✗ MISSING | — | Biology (GREEN) |
| AFFINITY | 9 | applyAffinity | ✓ | ✓ | Biology (GREEN) |
| REPRO | 10 | applyReproduction | ✓ | ✓ | Biology (GREEN) |
| TRACK | 11 | applyTracking | ✓ | ✗ NOT CALLED | Biology (GREEN) |
| SENESCENCE | 12 | — | ✗ MISSING | — | Biology (GREEN) |
| ENERGY | 13 | — | ✗ MISSING | — | Biology (GREEN) |
| RADIATION | 14 | — | ✗ MISSING | — | Biology (GREEN) |
| GENOTYPE | 15 | applyGenotype | ✓ | ✗ NOT CALLED | Biology (GREEN) |
| PHENOTYPE | 16 | — | ✗ MISSING | — | Biology (GREEN) |

### Findings

1. **LIFE (applyLifeCycle)**: Works. Manages DEAD state transitions, hunger, energy drain per tick.
2. **GLOW**: No function exists. Should be a visual-only law that adds glow/bloom effect. Could be handled in spriteSync.js overlay (code exists there but checks `LAW_INDEXES.GLOW` that never fires because law state toggle exists but no physics effect).
3. **AFFINITY**: Works. Same-species attraction/repulsion based on SPECIES_AFFINITY DNA param.
4. **REPRO**: Works. Handles cloning, sexual, and hybrid reproduction modes.
5. **TRACK (applyTracking)**: Function exists but NOT called from solver. Would apply attraction between same-species particles.
6. **SENESCENCE**: No function. Should handle age-based death or decay.
7. **ENERGY**: No function. Should handle energy transfer between particles or conversion.
8. **RADIATION**: No function. Should apply radiation damage/effects.
9. **GENOTYPE (applyGenotype)**: Function exists but NOT called from solver. Would mutate DNA over time.
10. **PHENOTYPE**: No function. Would express DNA → visual phenotype changes over lifetime.

### Issues

- 4 biology laws have NO implementation: GLOW, SENESCENCE, ENERGY, RADIATION, PHENOTYPE
- 2 functions exist but are dead code: applyTracking, applyGenotype
