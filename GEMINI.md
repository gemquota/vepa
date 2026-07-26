# VEPA PROJECT MANDATES (GEMINI.md)

This file contains foundational mandates for the VEPA (Vector Emergent Physics Automata) project. These instructions take absolute precedence over general operational workflows.

---

## 1. CORE GOVERNANCE

### 1.1 Documentation Synchronization
Every significant code modification, law implementation, or UI refactor MUST be synchronized across the following files:
*   **CHANGELOG.md:** Accurate versioning and categorisation of changes.
*   **README.md:** High-level project state and quick-start updates.
*   **GUIDE.md:** User-facing instructional updates.
*   **ENGINE_SSOT.md:** Technical parity with the `physics.worker.js` and `constants.js`.
*   **docs/fullaudit.md:** Updated whenever parameters or law indices shift.

### 1.2 The "B-4RK" Principle
Documentation is not an afterthought; it is a feature. All new laws must be accompanied by `HELP_DB` entries in `src/constants.js` covering all four tiers (HINT, EXPLANATION, SYSTEM, ADVANCED).

---

## 2. ENGINEERING STANDARDS

### 2.1 Physics Integrity
*   **Stability First:** All spring-based or attractive forces must implement damping and action/reaction symmetry (averaging stiffness/mass constants).
*   **Bitmask Discipline:** Never hardcode law indices. Always use `LAW_INDEXES` from `constants.js`.

### 2.2 UI/UX Consistency
*   **Codex Parity:** The Codex must remain the primary in-engine source of truth. Any change to `ENGINE_SSOT.md` should be reflected in the Codex JSON data.
*   **Tactile Feedback:** Every playback control or parameter shift should provide visual confirmation (via Log, HUD, or Drone comments).

---

## 3. WORKFLOW ENFORCEMENT
The agent must verify documentation synchronization before declaring a task complete. Failure to update the SSOT results in a "Documentation Debt" state.

---
*Verified by GEMINI_CLI_PEER*
