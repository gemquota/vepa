# Review: Player Perspective

**Focus:** UX, workflow, mental model, discoverability, feedback

## Finding 1: "Save slot" is an implementation concept (High)
Users don't think in versioned slots. They think in worlds with histories.

**Recommendation:** Replace with World Timeline — chronological snapshot entries with auto-generated descriptions.

## Finding 2: Selective loading needs guardrails (High)
Checkboxes without context will be treated as "makes things load faster."

**Recommendation:** Three modes: Restore (exact), Reset (same rules, new positions), Remix (combinatorial, with warning).

## Finding 3: Auto-save should be silent but discoverable (Medium)
If invisible, users won't trust it. If noisy, it's annoying.

**Recommendation:** Subtle pulsing dot. Hover text. Resume banner on page load.

## Finding 4: Timeline needs a story view (Medium)
Persistent frames are useless without surfacing what changed.

**Recommendation:** Persist Insight Engine event log alongside timeline. Display as readable story.

## Finding 5: Save-before-experiment needs undo UI (Medium)
Users won't know a snapshot was taken.

**Recommendation:** Undo banner after destructive ops ("Mutation applied [UNDO]"). Cmd+Z support.

## Finding 6: Graveyard is a game mechanic (Medium)
Dead particles are history and memorials, not just data.

**Recommendation:** HUD count ("47 souls"), species death panel, reanimation button.

## Finding 7: No world discovery (Low)
After a month, 20 worlds all look the same in a list.

**Recommendation:** World gallery with species preview, mini canvas, stats line, last insight text.
