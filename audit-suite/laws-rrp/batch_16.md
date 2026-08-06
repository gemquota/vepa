# Batch 16 — RESONANCE / FLUX / IONIZATION / DISCHARGE

Laws under audit: RESONANCE, FLUX, IONIZATION, DISCHARGE

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| RESONANCE | Sympathetic vibration with phase alignment: `F = k·s1·s2·sync·phaseSync/(dist+1)`; `phaseSync = 0.5+0.5·cos(Δphase·π/2)` (GLOW/COMMS oscillator); in-phase pairs amplify the weaker pulser's SIGNAL. | ✅ |
| FLUX | F = qE: direction by effective charge `q = POLARITY + CHARGE` — positive carriers move down the gradient, negative up it, neutrals (|q| ≤ 1e-3) follow the field lines (doc behavior). | ✅ |
| IONIZATION | Threshold impact (> 0.15) + conserved ion pair: `q_i = impact·s`, `q_j = −impact·s`, `s = sign(POLARITY_i+POLARITY_j) || 1`; already-charged pairs are not re-stripped. | ✅ |
| DISCHARGE | Spark aims along the potential difference: kick = |c|·k toward the most opposite stored charge (weighted gradient accumulation in the solver); random fallback with no nearby field. Threshold 0.5, heat, reset unchanged. | ✅ |

## Confirmation

- [x] User confirmed / amended (All yes)
