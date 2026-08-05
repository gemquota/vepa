# Batch 05 — PHENOTYPE / CATALYSIS_LAW / SOLVATION / ACIDITY

Laws under audit (indices 16-19):

- **PHENOTYPE** (index 16, biology / GREEN)
- **CATALYSIS_LAW** (index 17, chemistry / PURPLE)
- **SOLVATION** (index 18, chemistry / PURPLE)
- **ACIDITY** (index 19, chemistry / PURPLE)

## Validation results (confirmed spec, v4.6.6)

| Law | Status | Evidence |
|-----|--------|----------|
| PHENOTYPE | ✅ PASS | `v4/tests/audit/batch_05.test.js` — radius ×1.25 at energy 200 (direct + integration); colour expression: POLARITY −1 → red (R>B), +1 → blue (B>R) from HSL mapping. Gate: radius unchanged without the law. |
| CATALYSIS_LAW | ✅ PASS | Direct: chemMult 1.0 (gate) → ×1.5 with CATALYSIS 1.0. Free: energy untouched over 50 ticks. Solver: amplifies the AFFINITY pull >2× with CATALYSIS 5.0 (chemMult applies to pre-chemistry forces; the old CHARGE_LAW test was premised wrong and removed). |
| SOLVATION | ✅ PASS | Multiplier: ×1.4 at charge gap 2, 1.0 near-equal. Real-world forces via solve(): opposite charges (1/−1) attract (vx>0), like charges (1/1) repel (vx<0), gate (WRAP only) → vx=0. |
| ACIDITY | ✅ PASS | Direct: gap 2 → charge 1→0.98, −1→−0.98 (equalizing), energy untouched; inert below gap 0.3. Solver: gap 2 → <1.0 after 200 ticks, charge conserved, energy untouched. |

## Notes

- Validation method: integration-level `solve()` tests + direct law calls with `isSet()` gating.
- Repairs performed: SOLVATION force was dead code → wired + fixed magnitude (|q1−q2| → |q1×q2| so like charges repel) and direction (both signs); ACIDITY rewritten from ENERGY erosion to documented CHARGE equalization; PHENOTYPE gained colour expression; CATALYSIS test re-anchored to a force the multiplier actually amplifies.
- Full suite: 533/533 tests green (`v4/`); `vite build` clean.
