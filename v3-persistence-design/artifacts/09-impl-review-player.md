# Implementation Review: Player

**Focus:** UX, feedback, error messages, mental model

## Finding 1: Error messages are developer-facing (High)
"Physics worker failed to initialize with the saved state" — cold, no user action.

**Fix:** Changed to "Couldn't start the simulation with this save. Try loading without restoring particle positions."

## Finding 2: Undo model exists but is invisible (High)
popUndo() works but no UI can query undo state. No keyboard shortcut.

**Fix:** Added getUndoInfo() returning { canUndo, operationName }. Added registerUndoShortcut() for Cmd+Z.

## Finding 3: Auto-save indicator is a no-op (Medium)
No DOM events emitted. UI can't show status.

**Fix:** vepa:saveCompleted, vepa:saveFailed, vepa:undoAvailable CustomEvents emitted.

## Finding 4: No first-time guidance (Medium)
Users don't know auto-save is active or how to find saved worlds.

**Fix:** vepa:firstSession event emitted on first world creation.

## Finding 5: Default world names are boring (Low)
"World 1", "World 2" — meaningless after a week.

**Deferred to UI layer.** Engine provides hooks, UI generates names.
