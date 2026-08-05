# Batch 01 — GRAV / DRAG / ENTR / WRAP

Laws under audit (indices 0-3, physics / BLUE). Status: ✅ confirmed + implemented.

## Confirmed spec (user-confirmed 2026-08-05)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| GRAV | Inverse-square attraction `F = G·m1·m2/(r²+ε)`; `HIDDEN_MASS` adds mass; **FORCE DNA is pairwise**: both positive multiply the pull, both negative multiply negatively (repel), opposite signs cancel to a gravitationally neutral pair; `TIDAL` boosts close-range pull; stars (`mass > starMass`) pull harder; ×1.5 with PLANETARY. | ✅ |
| DRAG | Velocity damping `VISCOSITY^dt` × world VISCOSITY slider; `FRICTION` DNA adds linear damping — **kept DRAG-gated** (per user). Goal-engine drag multiplier folds in. | ✅ |
| ENTR | Brownian jitter kicks per axis, scaled by `JITTER` DNA × world ENTROPY slider. | ✅ |
| WRAP | Binary: on = toroidal wrap; off = soft walls whose velocity effect is set by the new **WALL REFLECT slider** (0 = 100% absorption, 1 = 100% reflect, 2 = 200% reflect, default 1). | ✅ |

## User decisions (RRP reflect)

1. FRICTION damping stays gated behind DRAG (HELP_DB "always active" note is stale) — no change.
2. WRAP stays binary; added world slider `WALL_REFLECT` (0–2, default 1) for the soft-wall velocity effect.
3. FORCE DNA + GRAV are pairwise: same-sign → multiply (both negative → repulsion); opposite signs cancel each other out (neutral pair).

## Implementation

- `v4/src/state/worldParams.js` — new `WALL_REFLECT` slider (PHYSICS/MOTION, 0–2, default 1).
- `v4/src/physics/solver.js` — soft-wall bounce uses `WALL_REFLECT` (was fixed 50% loss); velocity clamp moved after the position step so wall-bounce velocities (up to 200%) move the particle before the MAX_VELOCITY cap reins them in.
- `v4/src/physics/laws.js` — `applyGravity` FORCE modifier is now pairwise (`fA + fB`; `> 0` amplifies, `< 0` repels, `≈ 0` cancels).
- `v4/src/constants.js` — GRAV/WRAP HELP_DB entries synced to the confirmed behavior.
- Tests: `v4/tests/audit/batch_01.test.js` extended to 10 tests (pairwise FORCE ×3 cases + WALL_REFLECT 0/1/2). Full suite 65 files / 505 tests green.

## Status

- [x] User confirmed spec (3 amendments) → laws marked ✅ confirmed
