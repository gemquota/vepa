# Audit Batch 7: DNA Parameters — Communication Group + Phenotype Expression

## Communication Params: SIGNAL_RESP, PULSE_RATE, NEIGHBORHOOD_RADIUS, SIGNAL_STRENGTH, SIGNAL_DECAY, PROPAGATION_SPEED, TUNING_CH1-4, MEMORY_DECAY

### Index Usage

| Index | Name | DNA_META | DNA_RANGES | Used In | Status |
|-------|------|----------|------------|---------|--------|
| 13 | SIGNAL_RESP | ✓ Signal Response | ✓ | NOT USED in solver/laws (main.js profile only) | ✗ |
| 14 | PULSE_RATE | ✓ Pulse Rate | ✓ | NOT USED in solver/laws (main.js profile only) | ✗ |
| 18 | NEIGHBORHOOD_RADIUS | ✓ Neighborhood Radius | ✓ | NOT USED ANYWHERE | ✗ |
| 19 | SIGNAL_STRENGTH | ✓ Signal Strength | ✓ | NOT USED ANYWHERE | ✗ |
| 20 | SIGNAL_DECAY | ✓ Signal Decay | ✓ | NOT USED ANYWHERE | ✗ |
| 21 | PROPAGATION_SPEED | ✓ Propagation Speed | ✓ | NOT USED ANYWHERE | ✗ |
| 22 | TUNING_CH1 | ✓ Tuning Ch1 | ✓ | NOT USED ANYWHERE | ✗ |
| 23 | TUNING_CH2 | ✓ Tuning Ch2 | ✓ | NOT USED ANYWHERE | ✗ |
| 24 | TUNING_CH3 | ✓ Tuning Ch3 | ✓ | NOT USED ANYWHERE | ✗ |
| 25 | TUNING_CH4 | ✓ Tuning Ch4 | ✓ | NOT USED ANYWHERE | ✗ |
| 40 | MEMORY_DECAY | ✓ Memory Decay | ✓ | NOT USED ANYWHERE | ✗ |

### Findings

The entire communication group (11 parameters) is essentially UNUSED in the current physics engine:
- SIGNAL_RESP and PULSE_RATE are set in main.js profiles but never consumed by any law/solver logic
- The remaining 9 params have zero references in solver.js or laws.js

This is a significant gap — the v2 codebase had signal propagation mechanics that have not been ported to v3.

### Phenotype Expression (expression.js)

| Function | Status | Notes |
|----------|--------|-------|
| computeColor | ✓ FIXED | Now reads particle COLOR_R/G/B as base, modulates with DNA |
| computeRadius | ✓ | Uses BASE_RADIUS, HIDDEN_MASS, MASS |
| computeAlpha | ✓ | Reads ALPHA DNA, SIGNAL, DEAD state |
| expressPhenotype | ✓ | Convenience wrapper calling all three |

### Issues

- 11 of 42 DNA parameters (26%) are completely unused in physics
- Communication/signal system is entirely missing
