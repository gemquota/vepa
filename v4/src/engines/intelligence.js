/**
 * VEPA v4 — Intelligence Orchestrator (P1 extraction from main.js)
 *
 * Owns the five interpretation engines (insight, narrative, lineage, goal,
 * timeline) and their per-tick orchestration, goal-adjustment application,
 * and timeline scrub/record bus wiring. Pure-function controller: all live
 * simulation state (particle view, counts, world size) is passed in through
 * getters, so main.js keeps its own counters and the module holds no hidden
 * population state.
 */
import { createInsightEngine, update as updateInsight } from './insightEngine.js';
import { createNarrativeEngine, update as updateNarrative } from './narrativeEngine.js';
import { createLineageTracker, trackBirth, trackDeath } from './lineageTracker.js';
import { createGoalEngine, setCurrentValue as setGoalValue, update as updateGoal } from './goalEngine.js';
import { createTimelineEngine, snapshot as timelineSnapshot, getTimeline as getTimelineList, clearTimeline as clearTimelineEngine, scrub as timelineScrub } from './timelineEngine.js';

const TIMELINE_SNAPSHOT_INTERVAL = 150;

export function createIntelligenceController(env) {
    const {
        bus,
        view,
        count,
        stride,
        indexes,
        worldSize,
        lawCount,
        fps,
        runtimeConfig,
        onRestore,
    } = env;

    // v4 — intelligence engines
    const insight = createInsightEngine(bus, { scanInterval: 90, clusterRadius: 60, minClusterSize: 5 });
    const narrative = createNarrativeEngine(bus);
    const lineage = createLineageTracker(bus);
    const goal = createGoalEngine(bus);
    const timeline = createTimelineEngine(bus, { autoSnapshotInterval: 0, maxSnapshots: 20 });
    setGoalValue(goal, 'scanInterval', insight.cfg.scanInterval);
    setGoalValue(goal, 'clusterRadius', insight.cfg.clusterRadius);
    setGoalValue(goal, 'maxForce', runtimeConfig.maxForce);
    setGoalValue(goal, 'drag', runtimeConfig.dragMultiplier);
    setGoalValue(goal, 'birthRate', runtimeConfig.birthRate);
    setGoalValue(goal, 'deathRate', runtimeConfig.deathRate);

    let prevDead = new Uint8Array(count());
    let timelineRecording = false;

    /** Wire goal-adjustment application + timeline scrub/record bus handlers. */
    function wireEvents() {
        bus.on('goal:adjusted', (adj) => {
            switch (adj.parameter) {
                case 'scanInterval': if (insight) insight.cfg.scanInterval = adj.newValue; break;
                case 'clusterRadius': if (insight) insight.cfg.clusterRadius = adj.newValue; break;
                case 'maxForce': runtimeConfig.maxForce = adj.newValue; break;
                case 'drag': runtimeConfig.dragMultiplier = adj.newValue; break;
                case 'birthRate': runtimeConfig.birthRate = adj.newValue; break;
                case 'deathRate': runtimeConfig.deathRate = adj.newValue; break;
            }
            bus.emit('goal:applied', adj);
        });
        bus.on('timeline:scrubTo', (tickIndex) => {
            const entry = timelineScrub(timeline, tickIndex);
            if (!entry || !entry.data) return;
            view().set(entry.data);
            const restored = { index: entry.index, tick: entry.tick };
            if (entry.metadata && entry.metadata.particleCount) restored.count = entry.metadata.particleCount;
            if (onRestore) onRestore(restored);
            prevDead = new Uint8Array(count());
            bus.emit('timeline:restored', restored);
        });
        bus.on('timeline:record', ({ enabled }) => {
            timelineRecording = !!enabled;
            bus.emit('timeline:recording', { enabled: timelineRecording, count: getTimelineList(timeline).length });
        });
        bus.on('timeline:clear', () => {
            clearTimelineEngine(timeline);
            bus.emit('timeline:cleared');
        });
    }
    wireEvents();

    /** Record a lineage birth (delegated from the spawn paths). */
    function birth(parentId, childId, speciesId) {
        if (lineage) trackBirth(lineage, parentId, childId, speciesId, 0);
    }

    /** Collect current simulation metrics for the goal engine + dashboard. */
    function computeMetrics() {
        const particleView = view();
        const particleCount = count();
        let alive = 0, energySum = 0;
        const speciesAlive = new Set();
        for (let i = 0; i < particleCount; i++) {
            const base = i * stride;
            if (particleView[base + indexes.DEAD] < 0.5 && (particleView[base + indexes.MASS] || 0) > 0) {
                alive++;
                energySum += particleView[base + indexes.ENERGY] || 0;
                speciesAlive.add(particleView[base + indexes.SPECIES_ID]);
            }
        }
        const clusterCount = insight && insight.lastClusters
            ? insight.lastClusters.clusters.length : 0;
        return {
            populationAlive: alive,
            speciesAlive: speciesAlive.size,
            clusterCount,
            avgEnergy: alive ? energySum / alive : 0,
            frameDelta: fps(),
            lawActiveCount: lawCount(),
        };
    }

    /** Run insight, narrative, lineage, timeline, and goal engines each tick. */
    function update(tick) {
        const particleView = view();
        const particleCount = count();
        if (!particleView || !particleCount) return;

        // Insight — spatio-temporal cluster detection
        if (insight) {
            updateInsight(insight, particleView, particleCount, stride, worldSize());
        }

        // Narrative — paced multi-voice commentary on engine events
        if (narrative) {
            updateNarrative(narrative, particleView, particleCount, stride);
        }

        // Lineage — death transitions (births are tracked via birth())
        if (lineage) {
            if (prevDead.length < particleCount) {
                const grown = new Uint8Array(particleCount);
                grown.set(prevDead);
                prevDead = grown;
            }
            for (let i = 0; i < particleCount; i++) {
                const base = i * stride;
                const dead = particleView[base + indexes.DEAD] >= 0.5 ? 1 : 0;
                if (dead && !prevDead[i]) {
                    let cause = 'unknown';
                    if ((particleView[base + indexes.HUNGER] || 0) >= 100) cause = 'starvation';
                    else if ((particleView[base + indexes.ENERGY] || 0) <= 0) cause = 'energy-depletion';
                    trackDeath(lineage, i, cause);
                }
                prevDead[i] = dead;
            }
        }

        // Timeline — recording snapshots on a fixed cadence. Captures only
        // the live region (count × stride), not the whole capacity buffer —
        // the same live-region discipline as World-aggregate snapshotWorld.
        if (timeline && timelineRecording && tick % TIMELINE_SNAPSHOT_INTERVAL === 0) {
            const data = particleView.subarray(0, particleCount * stride).slice();
            timelineSnapshot(timeline, data, { tick, particleCount });
            bus.emit('timeline:snapshot', { count: getTimelineList(timeline).length });
        }

        // Goal engine — evaluate and self-tune world constraints
        const metrics = computeMetrics();
        if (goal) {
            updateGoal(goal, metrics);
        }
        if (tick % 30 === 0) {
            bus.emit('sim:metrics', metrics);
        }
    }

    /** Reset intelligence state on simulation restart. */
    function reset() {
        prevDead = new Uint8Array(count());
        if (insight) { insight.frame = 0; insight.history = []; insight.lastClusters = null; }
        if (goal) { goal.frame = 0; goal.history = []; }
        if (timeline) clearTimelineEngine(timeline);
    }

    return { update, reset, birth };
}
