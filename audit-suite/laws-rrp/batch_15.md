# Batch 15 — RESISTANCE / CAPACITANCE / INDUCTANCE / MAGNETISM

Laws under audit: RESISTANCE, CAPACITANCE, INDUCTANCE, MAGNETISM

## Confirmed spec (user RRP, 2026-08-06)

| Law | Spec | Status |
|-----|------|--------|
| RESISTANCE | Material-dependent + thermal-Ohmic feedback: `damp = speed·k·(1 − CONDUCTIVITY·0.9)·(1 + TEMP·2)`; `TEMP += speed·k·(1 − CONDUCTIVITY·0.9)·0.5` (cap 1). Conductors glide, insulators resist; hotter particles slow more. | ✅ |
| CAPACITANCE | Store surplus energy as charge (`(ENERGY−50)·0.002`, clamp ±2 breakdown); bleed drains toward zero only — a depleted capacitor never flips sign from draining; same-sign stored charge repels pairwise. | ✅ |
| INDUCTANCE | Momentum-conserving velocity alignment scaled by magnetic coupling: `dv = (v_j − v_i)·k·couple`, `couple = |m1·m2|/(1 + dist·0.03)`; requires CONDUCTIVITY > 0 on both (real materials). | ✅ |
| MAGNETISM | `F = k·m1·m2/dist²` — aligned moments attract, opposing repel. MAGNETIC_MOMENT widened to [−1,1] (default 0.1) so both behaviors are reachable through normal DNA. | ✅ |

## Confirmation

- [x] User confirmed / amended (1. Yes. 2. Yes. 3. Yes. 4. Yes.)
