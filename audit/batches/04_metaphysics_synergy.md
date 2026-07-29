# Audit Batch 4: Metaphysics Laws + Synergy System

## Laws: TIME_DILATION, DIMENSIONALITY, CHAOS, ORDER, FATE, WILL, SOUL_LAW, MIND

### Status Summary

| Law | Index | Function | Implemented | Called in Solver | Category |
|-----|-------|----------|-------------|------------------|----------|
| TIME_DILATION | 30 | applyTimeDilation | ✓ | ✓ | Metaphysics (RED) |
| DIMENSIONALITY | 31 | applyDimensionality | ✓ | ✓ | Metaphysics (RED) |
| CHAOS | 32 | applyChaos | ✓ | ✓ | Metaphysics (RED) |
| ORDER | 33 | applyOrder | ✓ | ✓ | Metaphysics (RED) |
| FATE | 34 | applyFate | ✓ | ✓ | Metaphysics (RED) |
| WILL | 35 | applyWill | ✓ | ✓ | Metaphysics (RED) |
| SOUL_LAW | 36 | applySoul | ✓ | ✓ | Metaphysics (RED) |
| MIND | 37 | applyMind | ✓ | ✓ | Metaphysics (RED) |

All 8 metaphysics laws are implemented and called from the solver. ✓

### Synergy System

Synergy file: `src/physics/synergy.js`
- 34 law index references for synergy computations
- Called 19 times from solver.js (every law checks synergy before applying)
- Returns multiplier [0.0, 2.0]

### Synergy Rules Implemented

| Combination | Multiplier | Effect |
|-------------|-----------|--------|
| GRAV + PLANETARY | ×1.5 | Gravitational strength boost |
| COLL + ACCR | ×1.2 | Accretion bonus |
| LIFE + REPRO + ENERGY | ×1.3 | Biological efficiency |
| GLOW + TRACK | ×1.5 | Signal propagation |
| CATALYSIS + SOLVATION + ACIDITY | ×2.0 | Chemical reaction rate |
| HEAT + COLD | ×0.5 | Mutual cancellation |
| CHAOS + ORDER | ×0.3 | Mutual cancellation |
| FATE + WILL | ×1.8 | Metaphysical power |

### Issues

- ENERGY law is NOT implemented (no function) but is checked in synergies — dead synergy path.
- All metaphysics laws are fully wired.
