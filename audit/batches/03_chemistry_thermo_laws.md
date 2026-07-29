# Audit Batch 3: Chemistry + Thermodynamics Laws

## Chemistry Laws: CATALYSIS_LAW, SOLVATION, ACIDITY, OXIDATION, POLYMER, ISOMERIZATION, CHIRALITY, CRYSTALLIZATION
## Thermodynamics Laws: HEAT, COLD, CONVECTION, PHASE_RADIATION, SUBLIMATION

### Status Summary

| Law | Index | Function | Implemented | Called in Solver | Category |
|-----|-------|----------|-------------|------------------|----------|
| CATALYSIS_LAW | 17 | applyChemistry | ✓ | ✓ | Chemistry (PURPLE) |
| SOLVATION | 18 | applySolvation | ✓ | ✗ NOT CALLED | Chemistry (PURPLE) |
| ACIDITY | 19 | applyAcidity | ✓ | ✗ NOT CALLED | Chemistry (PURPLE) |
| OXIDATION | 20 | applyOxidation | ✓ | ✗ NOT CALLED | Chemistry (PURPLE) |
| POLYMER | 21 | applyPolymer | ✓ | ✓ | Chemistry (PURPLE) |
| ISOMERIZATION | 22 | — | ✗ MISSING | — | Chemistry (PURPLE) |
| CHIRALITY | 23 | — | ✗ MISSING | — | Chemistry (PURPLE) |
| CRYSTALLIZATION | 24 | — | ✗ MISSING | — | Chemistry (PURPLE) |
| HEAT | 25 | applyHeat | ✓ | ✗ NOT CALLED | Thermodynamics (ORANGE) |
| COLD | 26 | applyCold | ✓ | ✗ NOT CALLED | Thermodynamics (ORANGE) |
| CONVECTION | 27 | applyConvection | ✓ | ✓ | Thermodynamics (ORANGE) |
| PHASE_RADIATION | 28 | — | ✗ MISSING | — | Thermodynamics (ORANGE) |
| SUBLIMATION | 29 | — | ✗ MISSING | — | Thermodynamics (ORANGE) |

### Findings

1. **CATALYSIS_LAW (applyChemistry)**: Works. Returns a multiplier (1.0-2.0) that scales force accumulation. Used as `chemMult *= ax` pattern.
2. **SOLVATION**: Function exists but NOT called. Would apply solvent-mediated attraction.
3. **ACIDITY**: Function exists but NOT called. Would apply charge-based dissolution.
4. **OXIDATION**: Function exists but NOT called. Would apply oxidation damage.
5. **POLYMER (applyPolymer)**: Works. Handles bond formation between nearby particles.
6. **ISOMERIZATION**: No function. Should handle structural reconfiguration.
7. **CHIRALITY**: No function. Should handle handedness-based interactions.
8. **CRYSTALLIZATION**: No function. Should handle lattice formation.
9. **HEAT**: Function exists but NOT called. Would increase particle temperature/energy.
10. **COLD**: Function exists but NOT called. Would decrease particle temperature/energy.
11. **CONVECTION**: Works. Applies buoyancy/flow based on temperature differentials.
12. **PHASE_RADIATION**: No function. Should handle phase change radiation.
13. **SUBLIMATION**: No function. Should handle solid→gas transition.

### Issues

- 6 laws have NO implementation: ISOMERIZATION, CHIRALITY, CRYSTALLIZATION, PHASE_RADIATION, SUBLIMATION
- 6 functions exist but are dead code (not called from solver): applySolvation, applyAcidity, applyOxidation, applyHeat, applyCold
