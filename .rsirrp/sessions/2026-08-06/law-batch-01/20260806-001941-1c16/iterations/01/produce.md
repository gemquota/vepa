# Batch 01 — GRAV / DRAG / ENTR / WRAP

Laws under audit (indices 0-3, physics / BLUE).

## Proposed behavior (awaiting user confirmation)

| Law | Proposed spec (current v4 behavior) | Status |
|-----|--------------------------------------|--------|
| GRAV | Newtonian inverse-square attraction `F = G·m1·m2/(r²+ε)` between every pair, with `G` scaled to world size; `HIDDEN_MASS` DNA adds to mass; `FORCE` DNA amplifies pull or inverts to repulsion when negative; `TIDAL` DNA boosts close-range pull; stars (`mass > starMass`) get a collapse multiplier; +1.5× with PLANETARY. Off = no gravitational force. | 🗣 |
| DRAG | Velocity-dependent damping: drag factor `viscosity^dt` from `VISCOSITY` DNA × world `VISCOSITY` slider; `FRICTION` DNA adds linear damping; goal-engine `dragMultiplier` folds in. Off = velocity preserved (no decay). | 🗣 |
| ENTR | Brownian jitter: random ±force kicks per axis scaled by `JITTER` DNA × world `ENTROPY` slider — thermal noise floor that prevents static equilibrium. Off = no jitter. | 🗣 |
| WRAP | Binary: on = toroidal wrap (exit one edge, re-enter opposite); off = soft-wall clamp (bounce with 50% velocity loss). | 🗣 |

## Open confirmation points

1. **FRICTION gating** — HELP_DB says friction is "always active", but in v4 the `FRICTION` DNA damping only runs under DRAG. Keep DRAG-gated, or make friction always active?
2. **WRAP multi-state** — HELP_DB mentions "state 1-3 control wrap behavior", but v4 law state is binary (on/off). Keep binary, or add states (off / wrap / reflect)?
3. **GRAV negative force** — HELP_DB says "negative force expands them", but the GRAV law itself is always attractive; the `FORCE` DNA is what inverts it. Confirm that's the intended split.

## Status

- [ ] User confirmation → mark laws ✅ confirmed (or ⚠️ amended with user's wording)
