import { describe, it, expect } from 'vitest';
import { EventBus } from '../../src/core/eventBus.js';
import { PARTICLE_STRIDE, STRIDE_INDEXES, MAX_PARTICLES } from '../../src/constants.js';
import { createParticleBuffer } from '../../src/state/particleBuffer.js';
import { createIntelligenceController } from '../../src/engines/intelligence.js';

const S = STRIDE_INDEXES;

function makeEnv(initialCount = 0) {
    const bus = new EventBus();
    const buf = createParticleBuffer(MAX_PARTICLES, PARTICLE_STRIDE);
    // Isolated runtime config — the controller only reads/writes these fields.
    const runtime = { maxForce: 1, dragMultiplier: 1, birthRate: 0, deathRate: 0 };
    const state = { count: initialCount, fps: 60, lawActive: 3 };
    const restores = [];
    const controller = createIntelligenceController({
        bus,
        view: () => buf.view,
        count: () => state.count,
        stride: PARTICLE_STRIDE,
        indexes: STRIDE_INDEXES,
        worldSize: () => 1000,
        lawCount: () => state.lawActive,
        fps: () => state.fps,
        runtimeConfig: runtime,
        onRestore: (r) => restores.push(r),
    });
    return { bus, buf, controller, state, runtime, restores };
}

describe('VEPA v4 Intelligence Controller', () => {
    it('records lineage births delegated from the spawn paths', () => {
        const { bus, controller } = makeEnv(1);
        const branches = [];
        bus.on('lineage:branch', (d) => branches.push(d));

        controller.birth(-1, 0, 2);
        expect(branches).toHaveLength(1);
        expect(branches[0]).toMatchObject({ parentId: -1, childId: 0, species: 2 });
    });

    it('emits sim:metrics every 30 ticks with live population stats', () => {
        const { bus, buf, controller, state } = makeEnv(2);
        const view = buf.view;
        view[0 * PARTICLE_STRIDE + S.MASS] = 1;
        view[0 * PARTICLE_STRIDE + S.ENERGY] = 5;
        view[0 * PARTICLE_STRIDE + S.SPECIES_ID] = 0;
        view[1 * PARTICLE_STRIDE + S.MASS] = 1;
        view[1 * PARTICLE_STRIDE + S.DEAD] = 1;

        const metrics = [];
        bus.on('sim:metrics', (m) => metrics.push(m));

        controller.update(1);
        expect(metrics).toHaveLength(0); // not a 30-boundary tick

        controller.update(30);
        expect(metrics).toHaveLength(1);
        expect(metrics[0]).toMatchObject({
            populationAlive: 1,
            speciesAlive: 1,
            avgEnergy: 5,
            lawActiveCount: 3,
            frameDelta: 60,
        });

        state.count = 3;
        state.lawActive = 7;
        view[2 * PARTICLE_STRIDE + S.MASS] = 1;
        view[2 * PARTICLE_STRIDE + S.ENERGY] = 15;
        view[2 * PARTICLE_STRIDE + S.SPECIES_ID] = 1;
        controller.update(60);
        expect(metrics[1].populationAlive).toBe(2);
        expect(metrics[1].speciesAlive).toBe(2);
        expect(metrics[1].avgEnergy).toBe(10);
        expect(metrics[1].lawActiveCount).toBe(7);
    });

    it('detects particle deaths and classifies their cause', () => {
        const { bus, buf, controller, state } = makeEnv(1);
        const view = buf.view;
        view[S.MASS] = 1;
        const deaths = [];
        bus.on('lineage:death', (d) => deaths.push(d));

        controller.update(1);
        expect(deaths).toHaveLength(0);

        // Starvation
        view[S.DEAD] = 1;
        view[S.HUNGER] = 100;
        controller.update(2);
        expect(deaths).toHaveLength(1);
        expect(deaths[0]).toMatchObject({ particleId: 0, cause: 'starvation' });

        // A second particle dying of energy depletion
        state.count = 2;
        view[1 * PARTICLE_STRIDE + S.MASS] = 1;
        view[1 * PARTICLE_STRIDE + S.DEAD] = 1;
        view[1 * PARTICLE_STRIDE + S.ENERGY] = 0;
        controller.update(3);
        expect(deaths[1]).toMatchObject({ particleId: 1, cause: 'energy-depletion' });
    });

    it('applies goal adjustments to the runtime config and re-emits them', () => {
        const { bus, controller, runtime } = makeEnv(1);
        const applied = [];
        bus.on('goal:applied', (a) => applied.push(a));

        bus.emit('goal:adjusted', { parameter: 'maxForce', newValue: 5 });
        bus.emit('goal:adjusted', { parameter: 'drag', newValue: 0.5 });
        bus.emit('goal:adjusted', { parameter: 'birthRate', newValue: 0.1 });
        bus.emit('goal:adjusted', { parameter: 'deathRate', newValue: 0.2 });

        expect(runtime).toMatchObject({ maxForce: 5, dragMultiplier: 0.5, birthRate: 0.1, deathRate: 0.2 });
        expect(applied).toHaveLength(4);
        expect(applied[0]).toEqual({ parameter: 'maxForce', newValue: 5 });
        expect(applied[3]).toEqual({ parameter: 'deathRate', newValue: 0.2 });
    });

    it('records timeline snapshots on the 150-tick cadence and scrubs them back', () => {
        const { bus, buf, controller, state, restores } = makeEnv(2);
        const view = buf.view;

        bus.emit('timeline:record', { enabled: true });
        view[0] = 42; // particle 0 position x
        controller.update(150); // snapshot boundary

        const restoredEvents = [];
        bus.on('timeline:restored', (r) => restoredEvents.push(r));

        // Move the particle, then scrub back to the snapshot
        view[0] = 99;
        bus.emit('timeline:scrubTo', 0);

        expect(view[0]).toBe(42);
        expect(restores).toHaveLength(1);
        expect(restores[0].index).toBe(0);
        expect(restores[0].count).toBe(2); // metadata.particleCount restored
        expect(restoredEvents[0].index).toBe(0);
        expect(state.count).toBe(2);
    });

    it('reset() clears the timeline so recording restarts from zero', () => {
        const { bus, buf, controller } = makeEnv(2);
        const view = buf.view;
        const recording = [];
        bus.on('timeline:recording', (r) => recording.push(r));

        bus.emit('timeline:record', { enabled: true });
        controller.update(150); // snapshot taken
        expect(recording[0].count).toBe(0);

        controller.reset();
        bus.emit('timeline:record', { enabled: false });
        expect(recording[1]).toMatchObject({ enabled: false, count: 0 });
    });
});
