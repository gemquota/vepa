# Plan Review: Biology Expansion & Law Reorg

**Status**: ✅ APPROVED
**Reviewed**: 2026-04-24

## 1. Structural Integrity
- [x] **Atomic Phases**: Phases correctly separate Engine, Worker, and UI updates.
- [x] **Worktree Safe**: Assumes clean state.

*Architect Comments*: The plan is sound. Splitting the laws into groups is a necessary step for the requested biology expansion.

## 2. Specificity & Clarity
- [x] **File-Level Detail**: Specific files (`main.js`, `physics.worker.js`, `ui.js`) are targeted.
- [x] **No "Magic"**: Implementation details for the reorg are clear.

*Architect Comments*: Ensure `toggleLaw` in `main.js` is updated to handle nested paths if we use them, or use a flattening helper for the worker.

## 3. Verification & Safety
- [x] **Automated Tests**: No automated tests yet for UI, but verification steps are clear.
- [x] **Manual Steps**: Reproducible steps for UI check.

*Architect Comments*: We should ideally add a smoke test for the worker to ensure it doesn't crash with the new laws structure.

## 4. Architectural Risks
- **Worker Desync**: If the worker isn't updated simultaneously with the engine, laws might fail to apply.
- **UI State**: `syncUI` needs to be robust against nested paths.

## 5. Recommendations
- Update `toggleLaw` to support a path (e.g., `pure.grav`) or continue using flat keys but map them internally to the nested structure.
