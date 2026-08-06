# Batch 17 — PLASMA / SUPERCONDUCTIVITY / MEMORY / PATTERN

Laws under audit: PLASMA, SUPERCONDUCTIVITY, MEMORY, PATTERN

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| PLASMA | Thermal-EM bridge with hysteresis (match irl): `temp > 0.6` → `CHARGE += (temp−0.6)·k`, cools; `temp < 0.5` with stored charge → recombination: `CHARGE = 0`, `TEMP += |c|·k·2` (cap 1). The 0.5–0.6 band prevents oscillation. | ✅ |
| SUPERCONDUCTIVITY | Confirmed as-is: cold pairs (≤ 0.35) equalize charge + align velocity; `+COLD ×1.8`, `+RESISTANCE ×0.2` lossless synergies. | ✅ |
| MEMORY | Confirmed as-is: contact refresh (+0.05 cap 1), decay ×0.995/tick, momentum ×(1+mem·k·0.02). | ✅ |
| PATTERN | Confirmed as-is: cohesion `k/(dist+1)`, inert dist < 1. | ✅ |

## Confirmation

- [x] User confirmed / amended (Yes to all)
