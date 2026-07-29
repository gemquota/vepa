# Audit Batch 9: Engines

## Engines: Goal, Insight, Narrative, Lineage, Timeline

### Engine Status

| Engine | File | Functions | Wired in main.js | Status |
|--------|------|-----------|-----------------|--------|
| Goal | goalEngine.js | createGoalEngine, update, setCurrentValue, getGoals, getHistory | ✗ NOT WIRED | DISCONNECTED |
| Insight | insightEngine.js | createInsightEngine, update, clusterTrend | ✗ NOT WIRED | DISCONNECTED |
| Narrative | narrativeEngine.js | createNarrativeEngine, update | ✗ NOT WIRED | DISCONNECTED |
| Lineage | lineageTracker.js | createLineageTracker, trackBirth, trackDeath, getStats, getAncestors, getAlive | ✗ NOT WIRED | DISCONNECTED |
| Timeline | timelineEngine.js | createTimelineEngine, snapshot, scrub, getTimeline, getSnapshot, getLatest, clearTimeline, tick | ✗ NOT WIRED | DISCONNECTED |

### Analysis

**ALL FIVE ENGINES ARE COMPLETELY DISCONNECTED FROM THE APPLICATION.**

The engines exist as files with complete implementations (exported functions, internal logic) but are never imported, instantiated, or called in `main.js`. The boot sequence creates the buffer, law state, DNA buffer, renderer, and UI — then starts the render loop — without initializing any of the engines.

This means:
- No goal-based auto-tuning of world parameters
- No spatio-temporal cluster detection
- No narrative/consciousness text generation
- No evolutionary lineage tracking
- No timeline recording or playback

These were core features of v2 that have not been re-integrated into v3.

### Engine Details (what each provides)

**goalEngine.js**: Adjusts world constraints toward stability/complexity targets. Tracks current values against target ranges, reports history.

**insightEngine.js**: Detects particle clusters spatio-temporally, computes "interestingness" scores, logs pattern events.

**narrativeEngine.js**: Generates text descriptions of simulation events (births, deaths, mergers, extinctions).

**lineageTracker.js**: Records parent→offspring relationships, builds ancestry trees, reports alive/dead stats per lineage.

**timelineEngine.js**: Captures simulation snapshots at intervals, enables scrubbing playback.
