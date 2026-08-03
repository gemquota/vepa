# Adversarial Review — VEPA v4 GitHub Pages Deployment

> **Audited artifact:** commit `5529239` on branch `new` — "v4.1.1: deploy v4 via gh-pages workflow (replaces v3 at /vepar/); drop motion trails"
> **Scope:** `.github/workflows/deploy.yml` (v3→v4 build swap), `v4/src/render/renderer.js` (motion-trail removal), `v4/CHANGELOG.md` ([4.1.1] entry), resulting `gh-pages` deployment at `https://gemquota.github.io/vepa/vepar/`
> **Method:** 5 independent adversarial agents, no shared findings, read-only audits, then combined synthesis
> **Reviewers:** #1 CI/CD Pipeline · #2 Git State & Hygiene · #3 Build & Runtime Integrity · #4 Renderer Change · #5 Docs & SSOT Compliance
> **Date:** 2026-08-03 | **Status:** Draft — findings spot-verified by synthesizer (see §6)

---

## 1. Executive Synthesis

**The deployment works, but the release it ships is mislabeled and half its intended runtime architecture is dead on arrival.**

The v4 site loads and is byte-for-byte identical to a local `vite build` (verified independently by Reviewers #1 and #3). The 200s, asset hashes, base paths, and `gh-pages` tree are all correct. However, the five reviews converge on three systemic problems that outweigh the mechanics:

1. **Cross-origin isolation is not achieved on GitHub Pages** (Reviewers #1 + #3, independently): the shipped `_headers` files are inert — Pages serves them as `application/octet-stream`. No COOP/COEP headers reach the browser, so `SharedArrayBuffer` always throws and the app runs permanently in `ArrayBuffer` fallback mode. The worker path that motivated the whole architecture is unreachable in production.
2. **The release is mis-versioned and undocumented** (Reviewers #2 + #3 + #5): changelog says `4.1.1`, `v4/package.json` and the in-app debug string say `4.1.0`, `package-lock.json` says `4.0.0`, and the root repo carries seven mutually inconsistent version claims. The v3→v4 production swap at `/vepa/vepar/` is recorded nowhere except the commit message.
3. **The workspace is one `git add -A` away from committing 61 MB of agent logs** (Reviewer #2, spot-verified): `vaa/` is untracked and unignored; `v4/node_modules` is an unignored symlink; `v4-server.log` is unignored.

Reviewer verdicts: **MINOR-ISSUES** (CI/CD), **ACCEPTABLE WITH HIGH-RISK EXCEPTIONS** (Git), **PASS / PARTIALLY FAILED** (Build/Runtime), **REQUEST CHANGES** (Renderer), **FAIL with pre-existing debt** (Docs/SSOT).

---

## 2. Consolidated Findings Matrix

Findings deduplicated across all five reviews; reviewer cross-references in brackets.

### CRITICAL

| ID | Finding | Reviewers |
|----|---------|-----------|
| C1 | `vaa/` (61 MB of rollout JSONL, possibly session data) is untracked and unignored — one `git add -A` permanently bloats history and leaks content | #2 |
| C2 | COOP/COEP never delivered on GitHub Pages (`_headers` inert, served as octet-stream) → `SharedArrayBuffer` always disabled; app runs degraded in production, dev/prod memory models diverge | #1, #3 |

### HIGH

| ID | Finding | Reviewers |
|----|---------|-----------|
| H1 | Release mis-versioned: commit/changelog `4.1.1` vs `package.json` `4.1.0` vs `debug.js` `4.1.0` vs `package-lock.json` `4.0.0` | #2, #3, #5 |
| H2 | v3 silently killed at `/vepa/vepar/`: old URLs hard-404, no redirect, no archive, no doc entry (root `CHANGELOG.md` untouched) | #1, #5 |
| H3 | Headline 4.1.0 feature (motion trails) removed 1 day later with a technically false changelog rationale, no UI/config toggle; loss of temporal motion blur risks strobing at high velocity | #4 |
| H4 | Systemic version/doc drift: 7 inconsistent version claims repo-wide; AGENTS.md contradicts itself on version and stride (100 vs 64 floats) | #2, #5 |
| H5 | Physics worker never built or instantiated: no `new Worker` anywhere in `v4/src`; `worker.format: 'es'` and README "fallback path" are fiction | #1, #3 |
| H6 | Documented QA gate broken: `.tests/validate_engine.py` does not exist (gitignored), yet `package.json` `test`/`validate` and AGENTS.md §8 mandate it | #5 |
| H7 | GitHub Pages deployment undocumented: no README/changelog states live URLs (`/vepa/`, `/vepa/vepar/`) or publish mechanics | #5 |

### MEDIUM

| ID | Finding | Reviewers |
|----|---------|-----------|
| M1 | `v4/node_modules` is a symlink to `../v3/node_modules` and is NOT ignored (trailing-slash rules don't match symlinks) | #2 |
| M2 | `v4-server.log` unignored (leaks dev URLs/IPs) | #2 |
| M3 | AGENTS.md §2 audit section stale: claims 1 commit (actual 64), VERSION 3.3.0 (actual 2.4.0), tree omits v4/.github/audit/ | #2, #5 |
| M4 | Third-party actions unpinned (`actions/checkout@v4`, `actions/setup-node@v4`, `peaceiris/actions-gh-pages@v4`) — supply-chain risk on a `contents: write` workflow | #1 |
| M5 | Force-push wipe (`keep_files: false` default) + push-only trigger, no `workflow_dispatch` → no safe manual rollback/redeploy path | #1 |
| M6 | Only composite-state normalization deleted from renderer — future unguarded `lighter`/`destination-out` post-pass silently corrupts every frame | #4 |
| M7 | Scope contamination: deploy swap + feature removal in one commit; `[4.1.1]` changelog covers only the renderer change | #2, #4, #5 |
| M8 | Root v2 live site loads a 404 script (`error_handler.js`, `index.html:8`) | #3 |
| M9 | `ENGINE_SSOT.md` has zero v4 coverage: 42 DNA / 51 laws documented vs actual v4 `DNA_COUNT=48` / `LAW_COUNT=52` | #5 |
| M10 | `v3/vite.config.js` still targets `base: '/vepa/vepar/'` — a stray v3 rebuild/deploy silently clobbers v4 in production | #5 |

### LOW / NIT

| ID | Finding | Reviewers |
|----|---------|-----------|
| L1 | `id-token: write` granted but unused in workflow | #1 |
| L2 | `pixi.js` declared in v4 but never imported (CI downloads it for nothing); stale `[VEPA v3]` log strings in v4 | #1, #3 |
| L3 | `renderer.paused` now write-only dead state (only consumer was deleted fade branch) | #4 |
| L4 | `TRAIL_X/Y/Z` stride fields (71–73) and spawn writes remain — write-only remnants of removed feature | #4 |
| L5 | Renderer change ships with zero tests (no vitest/screenshot coverage of clear/trail behavior) | #4 |
| L6 | Stale divergent branches (`origin/feature/nuclear-rewrite` 34 commits divergent); `master` is a placeholder 63 commits behind `new`; `origin/HEAD` points at master | #2 |
| L7 | `build.crossorigin: false` not honored in output (Vite 8 emits crossorigin attrs anyway) | #3 |
| N | NITs: npm cache only covers root (v4 `npm ci` cold each run); no `timeout-minutes`; Pages-branch config dependency; `_headers` exposed as downloadable octet-stream; hashed assets lack `immutable` cache header; stale comments in `spriteSync.js`/`renderer.js`; ResizeObserver path doesn't repaint backdrop; root changelog heading style drift | #1, #3, #4, #5 |

---

## 3. Consensus Alerts (independently confirmed by 2+ reviewers)

1. **COOP/COEP / SharedArrayBuffer is dead on GitHub Pages** — #1 (HIGH) + #3 (CRITICAL). Live headers verified absent by synthesizer: `server: GitHub.com`, no `cross-origin-*`; `/_headers` → `application/octet-stream`.
2. **Version drift cascade** — #2 (HIGH), #3 (LOW), #5 (HIGH). `4.1.1` / `4.1.0` / `4.1.0` / `4.0.0` / plus 7 root claims (`2.4.0`–`4.1.1`).
3. **Deploy swap undocumented** — #2 (NIT), #4 (MEDIUM), #5 (HIGH). The v3→v4 change at `/vepa/vepar/` appears in no changelog/README.
4. **Physics worker is dead code** — #1 (LOW), #3 (HIGH). Never bundled, never instantiated.
5. **Docs/AGENTS.md stale and self-contradictory** — #2, #5. The canonical init doc misleads every entering agent.

---

## 4. What Verified Clean (passes, for balance)

- **Build reproducibility:** local `cd v4 && npx vite build` reproduces the deployed hashes byte-for-byte (`index-DL8x0xNQ.js`, `index-0m7UvyDj.css`); sha256 matches (`b8b333c4…`). No build warnings.
- **Base paths:** `base: '/vepa/vepar/'` matches `deploy/vepar/`; all live asset URLs 200 (`/vepa/vepar/`, JS, CSS; root `/vepa/` + main bundle 200).
- **Commit hygiene:** `5529239` staged exactly the 3 intended files (17+/17−); commit message accurately names both changes; `origin/new` == HEAD; branch `new` per protocol.
- **Repo hygiene (tracked):** zero tracked `node_modules`, logs, `.dist`, or `vaa/` content; `combined.txt`, `server.log`, `deploy_payload.json`, `deploy_temp/`, `v3-backup/` all properly ignored.
- **gh-pages branch:** tip `702ec5b` = `deploy: 55292392…`; `.nojekyll` present; tree = v2 at root + v4 at `vepar/`; hashed assets mean no stale-cache risk despite `max-age=600`.
- **v4 test suite:** vitest passes (7 files / 39 tests).
- **Entry sanity:** all 22 v4 modules pass `node --check`; no `import.meta.env`, no `window.PIXI`, no app-level `fetch()` in bundle; deferred module in `<head>` makes `getElementById` boot safe.
- **Live verification (synthesizer):** `https://gemquota.github.io/vepa/vepar/` serves `<title>VEPA v4 — Integrated Intelligence</title>`; assets 200. CDN propagation lag ~2–3 min after workflow success.

---

## 5. Recommended Remediation Roadmap

**Immediate (prevent damage)**
1. Add `vaa/`, `/v4/node_modules`, `v4-server.log` (or `*.log`) to `.gitignore`. Do not run `git add -A` until done. — C1, M1, M2

**Short (fix the release labeling)**
2. Align versions to `4.1.1`: `v4/package.json`, `v4/src/debug.js:52`, regenerate `v4/package-lock.json`. — H1
3. Sync docs per AGENTS.md §7.1: add `### Deploy` line to `v4/CHANGELOG.md` [4.1.1], root `CHANGELOG.md` entry for the v3→v4 swap, "Deployment" section in `v4/README.md` with live URLs. — H2, H7, M7

**Medium (close the architecture/runtime gaps)**
4. Decide SAB stance explicitly: either document + surface the non-isolated fallback (boot-time debug log/banner when `crossOriginIsolated === false`) and delete misleading `_headers`, or move hosting to a platform honoring `_headers` (Netlify/Cloudflare Pages). — C2
5. Wire up or delete `v4/src/worker/physics.worker.js`; remove inert `worker.format: 'es'` and unused `pixi.js` dep. — H5, L2
6. Restore `validate_engine.py` or wire v4 vitest into root `npm test`; stop gitignoring the documented QA suite; produce v4 `ENGINE_SSOT`. — H6, M9
7. Resolve motion-trails decision: restore behind a config toggle (default 4.1.0 behavior) or document the real reason and add `source-over` state normalization at frame start. — H3, M6
8. Preserve v3: archive at `/vepa/v3/` or repoint `v3/vite.config.js` base away from `/vepa/vepar/`. — H2, M10

**Hardening (optional)**
9. Pin actions to full SHAs, trim `id-token: write`, add `workflow_dispatch` + `timeout-minutes`, document rollback (`git push origin <old-sha>:gh-pages --force`). — M4, M5, L1
10. Cleanup: fast-forward `master` to `new` / repoint `origin/HEAD`; delete or archive `origin/feature/nuclear-rewrite`; refresh AGENTS.md §1–2 from actual git state. — H4, L6, M3

---

## 6. Synthesizer Spot-Verification

Claims independently re-checked by the synthesizer before finalizing:

| Claim | Check | Result |
|-------|-------|--------|
| COOP/COEP absent live | `curl -sI …/vepa/vepar/` | ✅ Confirmed — only `server: GitHub.com`, no `cross-origin-*` headers |
| `_headers` inert on Pages | `curl -sI …/vepa/vepar/_headers` | ✅ Confirmed — `200 application/octet-stream` |
| `vaa/` 61 MB unignored | `du -sh vaa/` + `git check-ignore vaa` | ✅ Confirmed — 61M, not ignored |
| `v4/node_modules` symlink unignored | `ls -la` + `git check-ignore` | ✅ Confirmed — `-> ../v3/node_modules`, not ignored |
| Version drift | grep `v4/package.json`, `package-lock.json`, `src/debug.js` | ✅ Confirmed — 4.1.0 / 4.0.0 / 4.1.0 vs changelog 4.1.1 |
| Validator missing | `ls .tests/` | ✅ Confirmed — no such directory |
| Live v4 serving | curl title + assets | ✅ Confirmed — v4 title, assets 200 |

---

## 7. Individual Reviews

### Review #1 — CI/CD Pipeline & Deployment Infrastructure (Chandrasekhar)

**Verdict: MINOR-ISSUES**

**F1 — HIGH:** COOP/COEP headers never delivered; SAB silently disabled on live site. `_headers` (Netlify convention) is inert on GitHub Pages; served as static text. `particleBuffer.js:15-20` falls back to `ArrayBuffer`; `main.js:61` logs `SharedArrayBuffer: false`. Recommendation: remove misleading `_headers` or move hosting; add runtime banner when `crossOriginIsolated === false`.

**F2 — HIGH:** v3 silently killed; old URLs 404 with no redirect/archive/docs. Recoverable only via `git checkout 72d7269 -- vepar/`. Violates AGENTS.md §7.1 doc-sync mandate (root `CHANGELOG.md` untouched).

**F3 — MEDIUM:** Unpinned third-party actions (`checkout@v4`, `setup-node@v4`, `peaceiris/actions-gh-pages@v4`) — mutable major tags on a `contents: write` workflow.

**F4 — MEDIUM:** Force-push wipe (`keep_files: false`) + push-only trigger, no `workflow_dispatch` → fragile rollback story.

**F5 — LOW:** `id-token: write` granted but unused. (Positive: `GITHUB_TOKEN`, not a PAT — no long-lived secret.)

**F6 — LOW:** `pixi.js` declared but never imported; worker file never instantiated; stale `[VEPA v3]` strings.

**F7 — LOW:** README still references `yourusername/vepa` placeholders; deployment URLs absent.

**F8 — NITs:** npm cache covers root only; no `timeout-minutes`; silent dependency on Pages "deploy from branch" config; pre-existing `[INEFFECTIVE_DYNAMIC_IMPORT]` warning for root `src/ui.js`.

**Verified working:** reproducible build, correct base paths, correct gh-pages tree (25 files), deploy commit `702ec5b` ↔ `5529239`.

**Top 3 risks:** (1) SAB dead on arrival; (2) v3 unrecoverable by users; (3) one-way door deploy (no rollback/redeploy).

---

### Review #2 — Git State & Repo Hygiene (Lorentz)

**Verdict: ACCEPTABLE WITH HIGH-RISK EXCEPTIONS**

**C1 — CRITICAL:** `vaa/` (61 MB, rollout JSONL incl. possible session data) untracked and unignored; a single `git add -A` commits it permanently.

**H1 — HIGH:** Release mis-versioned: commit `v4.1.1` vs `package.json`/`debug.js` `4.1.0`.

**H2 — HIGH:** Systemic version drift — 7 distinct claims (`2.4.0`/`2.5.0`/`3.3.0`/`3.4.0`/`4.0.0`/`4.1.0`/`4.1.1`) across VERSION, package.json, README, AGENTS.md, CHANGELOGs.

**M1 — MEDIUM:** `v4/node_modules` symlink not ignored (trailing-slash patterns don't match symlinks); committing it stores a broken env-specific blob.

**M2 — MEDIUM:** `v4-server.log` unignored (dev URLs/IPs).

**M3 — MEDIUM:** AGENTS.md §2 stale: "1 commit" (actual 64), VERSION "3.3.0" (actual 2.4.0), dirty-state and tree claims outdated; omits v4/.github/audit/.

**L1 — LOW:** Stale divergent `origin/feature/nuclear-rewrite` (34 commits not in `new`); backup branches 1-commit off.

**L2 — LOW:** `master` is a single placeholder commit; `origin/HEAD` points at it → fresh clones default to a July 2026 snapshot.

**N1 — NIT:** Bundled commit defensible but changelog incomplete (deploy change unlogged; root CHANGELOG not updated).

**N2 — NIT:** v4.1.0 (`093b93d`) was never independently deployed/verified — gh-pages jumps `36e59ee` → `5529239`.

**N3 — Positive:** zero junk tracked; commit staged exactly the intended 3 files; `origin/new` == HEAD.

**Top 3 risks:** (1) accidental `vaa/` commit; (2) mis-versioned release amid 7 inconsistent claims; (3) stale canonical docs + unignored stray files.

---

### Review #3 — Build Output & Runtime Integrity (Goodall)

**Verdict: DEPLOYMENT INTEGRITY PASS / RUNTIME INTENT PARTIALLY FAILED**

**F1 — CRITICAL:** COOP/COEP never served; cross-origin isolation absent live; SAB always throws; worker path permanently unreachable; dev/prod memory models diverge.

**F2 — HIGH:** Physics worker never built or loaded — no worker chunk in `.dist`, zero `new Worker` in bundle; `worker.format: 'es'` inert; README "fallback path" is fiction.

**F3 — MEDIUM:** Root v2 live site loads 404 script `error_handler.js` (pre-existing, `index.html:8`); app still boots.

**F4 — LOW:** `build.crossorigin: false` not honored in output.

**F5 — LOW:** Version metadata drift (`4.1.0` vs commit `4.1.1`).

**F6 — LOW/NIT:** Caching safe (hashed assets) but no `immutable` header on hashed assets.

**F7 — NIT:** `_headers` exposed as downloadable octet-stream.

**Verified passes:** byte-identical local↔deployed build (sha256 match), correct base paths, all live URLs 200, 22 modules pass `node --check`, no `import.meta.env`/`window.PIXI`/`fetch()` in bundle, deferred module boot safe.

**Top 3 risks:** (1) false isolation guarantee; (2) dead worker fallback; (3) silent degradation (all failures are quiet, app boots fine degraded).

---

### Review #4 — Renderer Change Review (Descartes)

**Verdict: REQUEST CHANGES**

**F1 — HIGH:** Headline 4.1.0 feature removed 1 day later with false rationale ("backdrop shows through" — the `destination-out` fade already showed it), no toggle; removal of temporal blur risks strobing/aliasing for high-velocity presets (`KINETIC`/`SOLAR_FLARE`).

**F2 — MEDIUM:** Only composite-state normalization deleted (`globalCompositeOperation` reset); latent fragility — one unguarded post-pass corrupts all subsequent frames. Currently safe because `spriteSync.js` `save()/restore()`s.

**F3 — MEDIUM:** Scope contamination — deploy swap and feature removal in one commit; changelog documents only the renderer half.

**F4 — LOW:** `renderer.paused` now write-only dead state (`main.js:662` sets, nothing reads).

**F5 — LOW:** `TRAIL_X/Y/Z` stride fields (constants.js:52-54) and spawn zeroing (main.js:189-191) remain as write-only remnants.

**F6 — LOW:** Untested visual change — no trail/clearRect/renderFrame coverage in `v4/tests`.

**F7 — NIT:** Stale comments: `spriteSync.js:66-67` GLOW "(so it doesn't wash out the motion trails)"; `renderer.js:100-104` says "Clear to dark background" but now clears to transparent.

**F8 — NIT:** ResizeObserver path (main.js:86-88) doesn't repaint the backdrop, contradicting the new "backdrop shows through" premise.

**Top 3 risks:** (1) production-visible silent regression with no opt-out; (2) loss of composite-state self-healing; (3) feature/state drift (dead `paused`, `TRAIL_*`, stale comments, entangled revert).

---

### Review #5 — Documentation & SSOT Compliance (Carver)

**Verdict: FAIL with pre-existing debt**

**HIGH-01:** v4 version mismatch — changelog `4.1.1` vs `package.json` `4.1.0` vs `debug.js:52` `4.1.0` vs `package-lock.json` `4.0.0`; violates GEMINI.md §1.1 "accurate versioning."

**HIGH-02:** Root `CHANGELOG.md` not synced for the deploy/workflow change (head is `4.0.0`); violates AGENTS.md §7.1.

**HIGH-03:** Documented QA gate broken — `.tests/validate_engine.py` doesn't exist (ENOENT) and `.tests/` is gitignored; v4 covered only by its own vitest (passes, 39 tests).

**HIGH-04:** GitHub Pages deployment undocumented — zero matches for `vepar`/`gh-pages`/`github.io` in any README/changelog.

**MEDIUM-05:** `ENGINE_SSOT.md` zero v4 coverage; documents 42 DNA/51 laws vs v4's `DNA_COUNT=48`/`LAW_COUNT=52`; root `PARTICLE_STRIDE` is 64, contradicting AGENTS.md's 100.

**MEDIUM-06:** README stale — badge 2.4.0 vs package 2.5.0; v4 note says 4.0.0 (actual 4.1.1); DNA-count claims stale; `v4/SPEC.md` still 4.0.0.

**MEDIUM-07:** AGENTS.md internally contradictory on version (3.3.0/2.5.0/3.4.0/3.3.0 vs actual 2.4.0) and stride (100 vs 64 floats).

**LOW-08:** `[4.1.1]` entry omits the deploy half of the commit.

**LOW-09:** `v3/vite.config.js` still targets `/vepa/vepar/` — a v3 rebuild would clobber v4.

**NIT-10:** Root changelog heading style drift (`## 4.0.0 —` vs `[2.6.0]`); codex correctly untouched but its upstream SSOT is stale.

**Top 3 risks:** (1) version drift cascade; (2) undocumented live deployment + stale v3 base path; (3) SSOT/QA layer doesn't cover v4 and its validator doesn't exist.

---

*Synthesis compiled 2026-08-03 from 5 independent agent reviews. Individual reviews were run read-only; no files were modified by reviewers. Synthesizer spot-verification in §6.*

---

## 7. Follow-up — v4.1.2 (2026-08-03)

The next commit (`0e57edc v4.1.2: COMMS law gates all communication; zero-laws hard freeze`) addressed the user-reported physics bug plus several findings from this review:

| Finding | Status in 4.1.2 |
|---------|-----------------|
| C1 — `vaa/` (61 MB) untracked/unignored | **Fixed** — `vaa/` added to `.gitignore` along with `v4-server.log`, `.chromium.log`, `.tmp_*.mjs`, `v4/.shots/` |
| M1 — `v4/node_modules` symlink unignored | **Fixed** — explicit `v4/node_modules` rule (trailing-slash rules don't match symlinks) |
| M2 — `v4-server.log` unignored | **Fixed** |
| H1 — version drift (`4.1.1`/`4.1.0`/`4.0.0`) | **Fixed** — all bumped to `4.1.2`: `package.json`, `package-lock.json`, `src/debug.js`, `CHANGELOG.md` |
| C2 — no COOP/COEP on GitHub Pages | **Not addressed** — inherent GitHub Pages limitation; dev server still sends the headers (SharedArrayBuffer works in dev only) |
| H3/H5/H6/H7, M3-M9 | **Not addressed** — pre-existing debt, out of scope for the physics fix |

### Physics fix (user-reported, not from review)

- **New COMMS law** (biology, index 52) is the sole gate for signal emission, decay, and pairwise exchange. With COMMS off, `SIGNAL`/`MEMORY` freeze and no comms forces exist.
- **Zero-laws hard freeze**: `solve()` returns immediately when no laws are active — no movement, friction, signals, lifecycle, or reproduction.
- **AGE moved to solver core** as a frame counter so oscillator phase and lifecycle gating progress with or without `LIFE`.
- Verification: 42/42 vitest pass (`lawGating.test.js` added); headless-Chromium end-to-end check shows continuous motion with default laws and byte-identical particle cores across 18 s after UI "CLEAR ALL".
- Deployed to live: `https://gemquota.github.io/vepa/vepar/` serves `4.1.2` (bundle `index-B6VbQ-dW.js`).


---

## 8. Follow-up — Vercel deployment (2026-08-03)

Finding **C2** from this review ("COOP/COEP never delivered on GitHub Pages → SharedArrayBuffer always disabled") is now resolved on a parallel platform:

- **Production:** https://vepa-v4.vercel.app/ (project `gemquotas-projects/vepa-v4`)
- `vercel.json` serves `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` on every route.
- Verified in headless Chromium against the live URL: `crossOriginIsolated: true`, app logs `SharedArrayBuffer: true`, 1250 particles running.
- Deployment-config commit: `21fcd0b` (conditional vite base: `/` on Vercel, `/vepa/vepar/` on GitHub Pages).
- Project SSO protection was disabled at project level to make the URL public (team default protects `.vercel.app` URLs).

GitHub Pages remains the fallback deployment at `https://gemquota.github.io/vepa/vepar/` (ArrayBuffer mode).
