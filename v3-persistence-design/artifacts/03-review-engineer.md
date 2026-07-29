# Review: Engineer Perspective

**Focus:** Code correctness, edge cases, performance, error handling

## Finding 1: Float64Array wrong type (High)
Spec shows Float64Array but Float32Array provides sufficient precision at half the size.

## Finding 2: Worker re-initialization incomplete (High)
No acknowledgment protocol after worker init. First frame reads stale state.

**Recommendation:** Worker must return init_ack; render loop waits for Promise.

## Finding 3: Auto-save causes frame drops (Medium)
Serializing 128K Float32 values on main thread blocks rendering.

**Recommendation:** Use requestIdleCallback; throttle to 30s real time.

## Finding 4: Checksum cost on every save (Medium)
SHA-256 on a 1MB blob blocks the main thread for 5-15ms.

**Recommendation:** Two-tier: CRC32 for auto-saves, SHA-256 for user saves.

## Finding 5: Migration registry couples to module order (Low)
Array-indexed migrations break when inserting new migrations for old versions.

**Recommendation:** Map keyed by "from->to" string.

## Finding 6: Graveyard memory bound too generous (Medium)
10% of particle count × 240 autosaves = ~24MB per session.

**Recommendation:** Fixed-size ring buffer (50 entries) with deduplication.

## Finding 7: No error handling surface (High)
Every failure mode (storage full, private browsing, parse error) is unhandled.

**Recommendation:** Formal SaveError codes with user-facing messages.
