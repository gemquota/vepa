# Audit Batch 1: Physics Laws

## Laws: GRAV, DRAG, ENTR, WRAP, COLL, ACCR, PLANETARY

### Status Summary

| Law | Index | Function | Implemented | Called in Solver | Category |
|-----|-------|----------|-------------|------------------|----------|
| GRAV | 0 | applyGravity | ✓ | ✓ | Physics (BLUE) |
| DRAG | 1 | applyDrag | ✓ | ✗ NOT CALLED | Physics (BLUE) |
| ENTR | 2 | applyEntropy | ✓ | ✗ NOT CALLED | Physics (BLUE) |
| WRAP | 3 | (inline in solver) | ✓ | ✓ | Physics (BLUE) |
| COLL | 4 | applyCollision | ✓ | ✓ | Physics (BLUE) |
| ACCR | 5 | applyAccretion | ✓ | ✓ | Physics (BLUE) |
| PLANETARY | 6 | applyPlanetary | ✓ | ✓ | Physics (BLUE) |

### Findings

1. **GRAVITY**: Works. Function exists, called from solver with proper argument order after fix.
2. **DRAG**: Function exists in laws.js (returns `{ax, ay, az}` form drag from velocity) but is NEVER called from solver.js. DRAG force is not applied. The solver applies friction inline as `ax -= vy * A` where A is FRICTION DNA param — this is partial drag but not a complete replacement.
3. **ENTROPY**: Function exists (applies Brownian jitter) but is NEVER called from solver.js. Instead, solver applies `ax += (prng()-0.5) * JITTER * dt * ENTR_SYNERGY` inline — similar but not identical.
4. **WRAP**: Handled inline in solver (toroidal wrapping or soft-wall clamping in position integration step).
5. **COLLISION**: Works. Function called from solver, returns proper `{ax, ay, az}`.
6. **ACCRETION**: Works. Function called from solver, modifies mass internally via buffer_global (was previously broken due to massGain ref — fixed).
7. **PLANETARY**: Works. Function called from solver after pairwise loop (non-pairwise center-pull force).

### Issues

- applyDrag and applyEntropy functions in laws.js are dead code (not called from solver).
- DRAG effect is partially replicated inline but may not fully match the law function's intent.
- ENTROPY effect uses inline random rather than the function's correlated noise.
