# Implementation Review: Architect

**Focus:** Structural integrity, module boundaries, coupling, interfaces

## Finding 1: VepaPersistence is a god object (High)
Owns 7+ responsibilities: PersonalityCore, LineageTracker, EmergentParamEngine, GraveyardEngine, SaveManager, snapshot capture, engine restore, worker lifecycle, frame update.

**Recommendation:** Split into WorldManager, SnapshotService, SimulationOrchestrator. Current VepaPersistence remains as thin facade.

## Finding 2: Adapter registry uses import side-effects (Medium)
Adapters register themselves at module load time via `import "./adapters/personalityAdapter.js"`. Cannot test with separate registry instances.

**Recommendation:** Move to explicit registerAdapters() call. Add adapterRegistry.clear() for testability.

## Finding 3: Worker init_ack has dangling this reference (High)
`initWorker()` references `this._messageHandler` but is called as standalone function — `this` is undefined in strict mode.

**Fix:** Removed. initWorker now resolves/rejects on init_ack only. Message forwarding is caller's responsibility.
