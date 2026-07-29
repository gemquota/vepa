# Audit Batch 5: DNA Parameters — Motion + Matter Groups

## Motion Params: FORCE, VISCOSITY, TORQUE, JITTER, TIDAL, INERTIA, FRICTION, MAX_VELOCITY

## Matter Params: SYMMETRY, HIDDEN_MASS, STIFFNESS, FUSION, FUSION_MOMENTUM, FUSION_TIME, BASE_RADIUS, ELASTICITY, BOND_ANGLE

### Index Usage

| Index | Name | DNA_META | DNA_RANGES | Used In | Status |
|-------|------|----------|------------|---------|--------|
| 0 | FORCE | ✓ Force | ✓ | solver.js, main.js (profile) | ✓ |
| 1 | VISCOSITY | ✓ Viscosity | ✓ | solver.js (inline drag), main.js (profile) | ✓ |
| 2 | TORQUE | ✓ Torque | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 3 | JITTER | ✓ Jitter | ✓ | solver.js (inline entropy) | ✓ |
| 15 | TIDAL | ✓ Tidal | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 26 | INERTIA | ✓ Inertia | ✓ | solver.js (invMass/inertia) | ✓ |
| 27 | FRICTION | ✓ Friction | ✓ | solver.js (inline friction) | ✓ |
| 28 | MAX_VELOCITY | ✓ Max Velocity | ✓ | solver.js (velocity clamp) | ✓ |
| 6 | SYMMETRY | ✓ Symmetry | ✓ | expression.js (color lightness) | ✓ |
| 7 | HIDDEN_MASS | ✓ Hidden Mass | ✓ | laws.js (gravity), expr.js (radius) | ✓ |
| 8 | STIFFNESS | ✓ Stiffness | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 9 | FUSION | ✓ Fusion | ✓ | solver.js (accretion), main.js (profile) | ✓ |
| 16 | FUSION_MOMENTUM | ✓ Fusion Momentum | ✓ | solver.js (accretion check) | ✓ |
| 17 | FUSION_TIME | ✓ Fusion Time | ✓ | NOT USED ANYWHERE | ✗ DEAD |
| 29 | BASE_RADIUS | ✓ Base Radius | ✓ | solver.js (radius), expr.js (radius) | ✓ |
| 30 | ELASTICITY | ✓ Elasticity | ✓ | laws.js (collision bounce) | ✓ |
| 31 | BOND_ANGLE | ✓ Bond Angle | ✓ | NOT USED ANYWHERE | ✗ DEAD |

### Issues

- 4 parameters are defined but UNUSED: TORQUE, TIDAL, STIFFNESS, FUSION_TIME, BOND_ANGLE
- These are dead code in DNA_META/DNA_RANGES — they show in the DNA panel but have no effect
