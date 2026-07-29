# Audit Batch 6: DNA Parameters — Electromagnetism + Biology Groups

## EM Params: POLARITY, ALPHA, CONDUCTIVITY, MAGNETIC_MOMENT, REACTION_THRESHOLD, CATALYSIS, HEAT_OUTPUT

## Biology Params: BIRTH_RATE, DEATH_RATE, MUTATION, ENERGY_EFFICIENCY, SEX_CHANCE, PREDATION_BIAS, SPECIES_AFFINITY

### Index Usage

| Index | Name | DNA_META | DNA_RANGES | Used In | Status |
|-------|------|----------|------------|---------|--------|
| 4 | POLARITY | ✓ Polarity | ✓ | expression.js (hue), laws.js (chemistry) | ✓ |
| 5 | ALPHA | ✓ Alpha | ✓ | expression.js (saturation + alpha) | ✓ |
| 32 | CONDUCTIVITY | ✓ Conductivity | ✓ | laws.js (heat transfer) | ✓ |
| 33 | MAGNETIC_MOMENT | ✓ Magnetic Moment | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 37 | REACTION_THRESHOLD | ✓ Reaction Threshold | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 38 | CATALYSIS | ✓ Catalysis | ✓ | laws.js (chemistry multiplier) | ✓ |
| 39 | HEAT_OUTPUT | ✓ Heat Output | ✓ | laws.js (heat generation) | ✓ |
| 10 | BIRTH_RATE | ✓ Birth Rate | ✓ | laws.js (reproduction), main.js (profile) | ✓ |
| 11 | DEATH_RATE | ✓ Death Rate | ✓ | laws.js (life cycle death check) | ✓ |
| 12 | MUTATION | ✓ Mutation | ✓ | laws.js (reproduction), main.js (profile) | ✓ |
| 34 | ENERGY_EFFICIENCY | ✓ Energy Efficiency | ✓ | laws.js (energy conversion) | ✓ |
| 35 | SEX_CHANCE | ✓ Sex Chance | ✓ | NOT USED in laws.js but may be in solver | ✗ DEAD |
| 36 | PREDATION_BIAS | ✓ Predation Bias | ✓ | NOT USED in laws.js (only in main.js profile) | ✗ DEAD |
| 41 | SPECIES_AFFINITY | ✓ Species Affinity | ✓ | laws.js (affinity calculation) | ✓ |

### Issues

- 4 parameters defined but UNUSED in physics: MAGNETIC_MOMENT, REACTION_THRESHOLD, SEX_CHANCE, PREDATION_BIAS
- PREDATION_BIAS is set per-species in main.js profile but never read by any law function
