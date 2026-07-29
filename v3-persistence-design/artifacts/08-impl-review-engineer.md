# Implementation Review: Engineer

**Focus:** Code correctness, edge cases, error handling, threading

## Finding 1: Checksum sync/async mismatch — CRITICAL
`computeChecksum` is async but `saveSnapshot` calls it as if synchronous. SHA-256 returns a Promise. Result: checksum field gets `[object Promise]` serialized as `{}`.

**Fix:** saveSnapshot is now async. SHA-256 awaited for user saves. CRC32 (sync) for auto-saves.

## Finding 2: loadSnapshot mutates before migration check — HIGH
Checksum field blanked on the original object before migration. If migration fails, original is already corrupted.

**Fix:** Snapshot is cloned at parse time. All operations on clone. Original untouched.

## Finding 3: tryAutoSave captures state at call time — MEDIUM
captureSnapshot() runs synchronously, but requestIdleCallback may fire 50-200ms later. State is stale.

**Fix:** Pass a thunk (zero-arg function) instead of snapshot object. Called at save execution time.

## Finding 4: No input validation on labels — MEDIUM
Labels with 10KB emoji or control characters cause index bloat and rendering issues.

**Fix:** Sanitize: max 128 chars, strip control chars.

## Finding 5: CRC32 defensiveness — LOW
computeChecksum now defensively blanks checksum field before hashing.
