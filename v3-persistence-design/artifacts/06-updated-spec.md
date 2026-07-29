# VEPA v3 Persistent World Architecture — Updated Specification

**Status:** Final specification (incorporates improvements from adversarial reviews)

## 1. Design Goals
Full-state serialization, save/load with versioning, engine state homeostasis, save-before-experiment with undo UI, world timeline, persistent timeline, graveyard as gameplay.

## 2. Save Format
### 2.1 World Snapshot (Revised)
Each engine exposes a serialization adapter transforming internal state to a versioned DTO.

```typescript
interface EngineStatesDTO {
  goals: VersionedDTO;          // dtoVersion: 1
  personality: VersionedDTO;    // dtoVersion: 1
  emergentParams: VersionedDTO; // dtoVersion: 1
  lineageTracker: VersionedDTO; // dtoVersion: 1
  narrative: VersionedDTO;      // dtoVersion: 1
  timeline: VersionedDTO;       // dtoVersion: 1
}
```

### 2.2 ParticleBuffer — Float32Array
32-bit float precision (7 decimal digits) is sufficient for 500×500 world coordinates.

### 2.3 Versioning — Atomic Migration
Migration operates on a deep clone. Original untouched on failure. Registry keyed by "from->to".

### 2.4 Corruption — Two-Tier Checksum
Auto-saves: CRC32 (fast, <1ms). User saves: SHA-256 (strong). Backup key on every user save.

## 3. Event Bus Lifecycle
on() returns { off }. clear(event?) for group teardown. once() for auto-removing listeners.

## 4. GraveyardEngine
First-class engine with Event Bus subscription. Fixed-size 50-entry ring buffer. Deduplication within 100 frames. Reanimation mechanic.

## 5. Engine Homeostasis
Personality: traits pull toward 0.5 equilibrium + respond to simulation metrics. Lineage: auto-prune beyond 100 generations. Emergent params: rejection TTL of 5000 frames.

## 6. Save/Load Protocol
Three load modes: Restore (exact), Reset (same rules, new positions), Remix (combinatorial, warning). Worker init_ack handshake. Async checksum. Error surface with SaveError enum.

## 7. World Timeline
Chronological snapshot entries with auto-descriptions. World gallery with species preview, stats, last insight. Max 20 worlds, 100 snapshots per world.

## Implementation Priorities
P0: EventBus lifecycle, serialization adapters, SaveManager, snapshot capture, load protocol, error handling, three load modes, Float32Array.
P1: Auto-save via idle callback, personality homeostasis, GraveyardEngine, lineage pruning, rejection TTL, undo banner + Cmd+Z.
P2: Atomic migration, two-tier checksum, reanimation mechanic.
