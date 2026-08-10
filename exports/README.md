# VEPA4 — Concatenated Snapshots

Machine-readable single-file exports of the working tree (dirty 7.0.0 draft,
branch `feature/multiplayer-investigation`, HEAD `7ddb832`).

| File | What it is | Regenerate |
|------|------------|------------|
| `vepa-codebase-concat.mjs` | Minimal functional core — 20 headless-runnable modules (constants → state → dna → physics → spawn) merged into one self-contained ESM file via a `__define`/`__import` registry. No UI/render/worker glue. | `node exports/generate-concat.mjs` |
| `vepa-docs-concat.md` | Comprehensive documentation — all 112 markdown docs (root, `docs/`, `audit-suite/` incl. law-revamp + historical, `src/physics/lawgroups/SPEC.md`) + `VERSION` + `package.json`, with a TOC. | `node exports/generate-docs-concat.mjs` |

**Verify the codebase snapshot runs:**
```bash
node exports/vepa-codebase-concat.mjs   # headless smoke: 500 particles, 60 ticks
```
