# Batch 10 — SOUL_LAW / MIND / VOID / BOND (+ POLYMER chain bias)

Laws under audit (indices 36-39). Status: ✅ confirmed + implemented + validated.

## Confirmed spec (user amendments, 2026-08-06)

| Law | Confirmed behavior | Status |
|-----|--------------------|--------|
| SOUL_LAW | **Agent decision** (user: "you decide") — SOUL is a conserved shared field: same-species transfer drains the giver and credits the receiver, both capped to [0, 1] (keeps TIME_DILATION's 70% slowdown as the ceiling), plus slow per-particle decay (0.2%/tick) so souls must be replenished. | ✅ (agent decision) |
| MIND | **"Synergies are gunna be more interesting"** — the hivemind is now synergy-shaped: COMMS ×1.5, TELEPATHY ×2.0, ENERGY ×0.5 (hive-mind drain), POLYMER ×0.5 (polymerized overhead). The boost itself stays free. (The MIND+ENER −2.0 synergy from the docs was never wired — now it is, in v4's multiplier form.) | ✅ |
| VOID | **Yes** — strengthened (0.0005 → 0.004 base) and dark-energy scaled: the outward push grows with distance from the world centre `(0.3 + dist/(worldSize/2))`, opposing gravitational clustering harder at the edges. | ✅ |
| BOND | **Density bias** (user: join where there are more neighbours, not chain ends) — molecular bonds are short-range (~2× rest length, extended by local density `min(2, 1 + nCount×0.05)`) and break when stretched beyond range; force scales with density too. Registration uses all 6 shared bond slots. | ✅ |
| POLYMER | **Chain bias** (user: polymers should be more likely to create chains) — bond range scales with chainBias: 1.0 for free/tip partners (0-1 bonds), 0.5 (2), 0.25 (3+), so POLYMER grows linear chains instead of cross-linked webs. | ✅ |

## Implementation (v4.6.12)

- **SOUL_LAW** — `applySoul` now transfers reciprocally (`receiver += soul×0.001×synergy`, `giver −= same`, cap 1.0); new `applySoulDecay` (per-particle, `×= 1 − 0.002×dt×synergy`) wired into the solver's non-pairwise section.
- **MIND** — four new synergies in `synergy.js` (COMMS ×1.5, TELEPATHY ×2.0, ENERGY ×0.5, POLYMER ×0.5), all multiplying MIND's signal boost.
- **VOID** — `applyVoid` strength `0.004×synergy×(0.3 + dist/(worldSize×0.5))`.
- **BOND** — `applyBond(..., nCount)` now takes the neighbor count from the solver: `bondRange = (r1+r2)×1.1×2×densityBoost`, breaks bonds beyond that range (reciprocal cleared via `breakBondPair`), spring force ×densityBoost, registration across all 6 `BOND_SLOTS`.
- **POLYMER** — chain bias multiplier on the bonding range in `applyPolymer`.
- Tests: `batch_10.test.js` extended to 14 (soul cap + decay + reciprocal, MIND synergy stack, VOID 0.0016 radial push, BOND density boost + breaking + 6-slot registration, POLYMER chain bias). Full suite 556/556 green; `vite build` clean.
- HELP_DB entries updated for SOUL_LAW / MIND / VOID / BOND / POLYMER in `v4/src/constants.js`.

## Verification

- [x] User confirmation → 1. agent decision (soul field) 2. synergies (MIND) 3. yes (VOID) 4. chain vs density bias (POLYMER/BOND)
- [x] Implementation + tests (556/556)
- [x] Deployed to https://vepa-v4.vercel.app
