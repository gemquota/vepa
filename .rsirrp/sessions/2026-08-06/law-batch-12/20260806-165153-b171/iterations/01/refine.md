# Batch 12 — CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY

Laws under audit (indices 44-47). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| CONDENSE | **Match real life** (user: "1. Match irl") — condensation is exothermic: a cool particle gains vapor mass **and releases latent heat** (warms as it accretes). Mass gain `(0.3−temp)×0.005×dt×synergy`, temperature gain `rate×2` clamped at 0.9 so it can't cross into boiling. Particles at/above 0.3 are already saturated — no change. | ✅ |
| DEPOSIT | **Ditto** (user: "2. Ditto") — real-life deposition (frost) is exothermic and skips the liquid phase: solid mass builds fast (`rate×3` mass, `rate×0.5` radius) and latent heat is released (`rate×2` temp, clamped 0.9). Gate at temp > 0.2. | ✅ |
| EXOTHERMIC | **Ditto** (user: "3. Ditto") — real-life exothermic reactions release heat while the reaction runs: a **bounded steady release** `ENERGY += 0.05×synergy×dt` (capped at 200) and `TEMPERATURE += 0.01×synergy×dt` (capped 0.9). Replaces the old unbounded `ENERGY ×= 1.1` exponential. | ✅ |
| TELEPATHY | **Add slight energy drain** (user: "4. Add slight energy drain") — same-species signal sharing now costs the receiver a small energy toll per transfer: `ENERGY −= 0.02×synergy×(dt\|1)` floored at 0, in addition to the existing 5% signal transfer. Different species still never share. | ✅ |

## Implementation (v4.6.16)

- **CONDENSE** — `applyCondense` unchanged mass logic, now `TEMPERATURE = min(0.9, temp + rate×2)` (was `+rate×0.1`, effectively inert).
- **DEPOSIT** — `applyDeposit` now `TEMPERATURE = min(0.9, temp + rate×2)` (was `+rate×0.05`); mass/radius accrual unchanged.
- **EXOTHERMIC** — `applyExothermic(lawState, view, base, dt, synergy)` new signature: bounded steady release (was `ENERGY ×= 1.1`, unbounded). Solver passes `localTimeStep`.
- **TELEPATHY** — `applyTelepathy(..., synergy, dt)` new signature: receiver drains `0.02×synergy×dt` energy per transfer (floor 0). Solver passes `localTimeStep` at the telepathy dispatch.
- **Multiplexer** — 4 more live settings, all visible in the right drawer during multiplexing: **SIM SPEED** slider (0.25–3×, scales each shard's effective timestep), **PAUSE GRID** checkbox (freezes shard stepping while the main sim keeps running), **MAX ITERS** number (0 = ∞, caps auto-iteration), **DRIFT** slider (0–0.05, raises VARIATION each generation as evolutionary pressure, capped at 1). `MULTIPLEX_DEFAULTS` extended; `stepMultiplex` early-returns when paused and scales dt via `simSpeed`; `iterateMultiplex` applies the drift.
- Tests: `batch_12.test.js` rewritten to the confirmed specs (8 cases), `multiplex.test.js` +5 (new defaults, pause freeze, sim-speed scaling, iteration cap, variation drift). Full suite 570/570 green; `vite build` clean.
- HELP_DB entries updated for CONDENSE / DEPOSIT / EXOTHERMIC / TELEPATHY in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. match irl (CONDENSE exothermic) 2. ditto (DEPOSIT exothermic frost) 3. ditto (EXOTHERMIC bounded steady release) 4. slight energy drain (TELEPATHY)
- [x] Implementation + tests (570/570)
- [x] Deployed to https://vepa-v4.vercel.app
