# Batch 18 — STIGMERGY / SIGNAL_BOOST / LEARN / SYMBOL

Laws under audit: STIGMERGY, SIGNAL_BOOST, LEARN, SYMBOL

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| STIGMERGY | Real pheromone trails: only moving particles lay a predicted-path marker (`speed ≥ 0.5` → `TRAIL = pos + v·8`); stopped particles' markers evaporate (lerp 8%/tick back to owner); follow force follows the gradient — `F = k·freshness/(1+dist·0.1)`, `freshness = 1/(1+ownerDist·0.02)` (stale markers pull weakly). | ✅ |
| SIGNAL_BOOST | Relay scaled by sender's SIGNAL_STRENGTH DNA (`s2 += s1·k·(0.5+strength·0.5)`); a legitimate strength 0 relays at ×0.5 (no `||` fallback swallow). | ✅ |
| LEARN | Confirmed as-is: velocity matching `v1 += (v2−v1)·k·0.1`. | ✅ |
| SYMBOL | Confirmed as-is: same-species attract by SPECIES_AFFINITY, cross-species repel at half. | ✅ |

## Confirmation

- [x] User confirmed / amended (Yes to all)
