# VEPA v3 Persistent World Architecture — Formal Specification

> **Version:** 3.0.0-draft  
> **Date:** 2026-07-29  
> **Status:** Draft specification  
> **Scope:** Persistence subsystem redesign, Event Bus lifecycle, engine state homeostasis

---

## 1. Design Goals

### Primary
1. **Full-state serialization** — every simulation entity must be savable and restorable exactly, enabling unbounded world persistence across sessions.
2. **Save/load protocol** — explicit user-facing save/load with versioning, migration, and corruption recovery.
3. **Engine state homeostasis** — all drifting values must be bounded and responsive to simulation state, not monotonically accumulating.

### Secondary
4. **Save-before-experiment** — automatic snapshot before destructive operations.
5. **Selective state loading** — load only specific layers (laws, species, particles) from a save.
6. **Offline world browsing** — inspect saved worlds without loading the simulation engine.
7. **Persistent timeline** — timeline snapshots survive across sessions.

---

## 2. Save Format Specification

### 2.1 World Snapshot Schema

```typescript
interface WorldSnapshot {
  version: number;            // Schema version for migration
  snapshotVersion: string;    // "3.0.0"
  timestamp: string;          // ISO 8601
  label: string;              // User-provided or auto-generated
  simAge: number;             // Total frames simulated

  // Core simulation state
  particles: ParticleBuffer;
  dnaBuffer: DnaBuffer;
  species: SpeciesRecord[];
  laws: LawState;
  worldConfig: WorldConfig;

  // Engine states
  engines: {
    goals: GoalSystemState;
    personality: PersonalityState;
    emergentParams: EmergentParamState;
    lineageTracker: LineageTrackerState;
    narrative: NarrativeState;
    timeline: TimelineState;
  };
}

interface ParticleBuffer {
  stride: number;             // Must match PARTICLE_STRIDE
  format: "flat" | "nested";
  data: number[];             // Flattened particle data
  deadCount: number;
}

interface DnaBuffer {
  stride: number;
  count: number;
  data: number[][];
}
```

### 2.2 Versioning & Migration

Each save carries a `version` integer. On load, if the version differs from the current schema version, a migration pipeline runs:

```
migrate(save, fromVersion, toVersion):
  for v = fromVersion; v < toVersion; v++:
    save = migrations[v](save)
  return save
```

### 2.3 Corruption Detection

Each save includes a SHA-256 checksum. On mismatch, attempt recovery from backup (.bak key in localStorage).

---

## 3. Event Bus Lifecycle

```typescript
class EventBus {
  on(event, fn): { off: () => void };
  off(event, fn): boolean;
  clear(event?): void;
  once(event, fn): void;
  emit(event, payload?): void;
  listenerCount(event): number;
}
```

---

## 4. Particle Lifecycle: Graveyard Buffer

A secondary buffer stores dead particle state at the moment of death (max: 10% of particle count). Dead particles can be browsed and reanimated.

---

## 5. Engine State Homeostasis

PersonalityCore traits oscillate toward 0.5 equilibrium and respond to simulation metrics. LineageTracker prunes lineages deeper than 100 generations. EmergentParam rejections expire after 5000 frames.

---

## 6. Save/Load Protocol

Auto-save on close (beforeunload), before destructive operations, and every 30 real seconds via requestIdleCallback. Load protocol runs migration pipeline, verifies checksum, restores engine states, re-initializes worker.

---

## 7. World Timeline (replaces save slots)

Chronological snapshot history with insight event log, not numeric version slots. World gallery shows species preview, stats, and last insight text.

---

*End of formal specification.*
