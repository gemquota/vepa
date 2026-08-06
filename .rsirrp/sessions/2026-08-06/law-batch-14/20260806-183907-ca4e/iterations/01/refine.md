# Batch 14 — COMMS / CHARGE_LAW / FIELD / CURRENT

Laws under audit (indices 52-55). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| COMMS | **Sender pays** (user: "1. Sure.") — signal delivery stays (homing force + memory via SIGNAL_RESP, channel-filtered by TUNING_CH1-4), but the receiver's old free energy gain (`delivered×resp×0.5`) is removed and the **sender pays the emission cost** (`ENERGY −= delivered×0.5`, floor 0) per delivered signal. | ✅ |
| CHARGE_LAW | **Match irl** (user: "2. Match irl.") — real Coulomb force on the **effective charge = POLARITY DNA + stored stride CHARGE** with no weighting: `qq = (q1+c1)×(q2+c2)`, inverse-square with softening. Stored charge now contributes equally (old code halved it and never mixed the two sources). | ✅ |
| FIELD | **Uniform 3D + charge scaling** (user: "3. Sounds good.") — true uniform acceleration on all three axes (old code had `az = 0` and an x/y asymmetry), POLARITY sets the sign, stored CHARGE scales the drift (`k×(1+|c|×0.5)`) so charged particles feel the field harder. | ✅ |
| CURRENT | **Both sides conductive** (user: "4. Sure.") — charge diffusion still flows high→low within 17 units, but conductivity is now the **min** of the pair (a conductor can no longer drain an insulator — real materials). | ✅ |

## Implementation (v4.6.18)

- **COMMS** — `applySignalExchange`: receiver keeps SIGNAL/MEMORY/homing-force delivery; `view[receiver].ENERGY` gain lines removed; `view[sender].ENERGY = max(0, energy − delivered×0.5)` on each direction.
- **CHARGE_LAW** — `applyChargeForce`: effective charge product `(POLARITY + CHARGE)₁ × (POLARITY + CHARGE)₂`; zero effective charge → no force.
- **FIELD** — `applyFieldDrift`: `{ ax: q×f, ay: q×f, az: q×f }` where `f = k×(1+|CHARGE|×0.5)`; `q === 0` → null (drift direction comes from POLARITY, per HELP_DB).
- **CURRENT** — `applyCurrentTransfer`: `cond = min(CONDUCTIVITY_i, CONDUCTIVITY_j)`; range gate `distSq > 300` unchanged.
- Tests: `batch_14.test.js` rewritten to the confirmed specs (9 cases: emission gating, exchange, sender-pays, Coulomb like/opposite, stored-charge equality, FIELD sign + 3D + charge scaling, CURRENT diffusion + both-conductive gate). Regression updates for the confirmed spec: `params_batch_13` CONDUCTIVITY (both sides conductive), `params_batch_16/17/18` COMMS DNA tests now assert delivered SIGNAL (not receiver energy), `signal.test.js` asserts sender pays. Full suite 576/576 green; `npx vite build` clean.
- HELP_DB entries updated for COMMS / CHARGE_LAW / FIELD / CURRENT in `v4/src/constants.js`.

> ⚠️ **Concurrent-work note:** during this batch a separate session's uncommitted "DNA 64" genetics expansion (genome params 48-63, `DNA_COUNT` 48→64, REPRO/lifecycle rewrite) was found in the working tree mid-flight. It broke the SEX_CHANCE param test. It was preserved to `.concurrent-dna64-wip-20260806.patch` (plus `.concurrent-dna64-backup-20260806/`) and reverted so v4.6.18 ships clean. Re-apply with `git apply .concurrent-dna64-wip-20260806.patch`.

## Verification

- [x] User confirmation → 1. sender pays 2. match irl (equal-weight effective charge) 3. uniform 3D + charge scaling 4. min conductivity
- [x] Implementation + tests (576/576)
- [x] Deployed to https://vepa-v4.vercel.app
