export class TimelineEngine {
    constructor(engine, insightEngine) {
        this.engine = engine;
        this.insightEngine = insightEngine;
        this.frames = [];
        this.maxFrames = 300; // ~5 mins @ 1fps sampling
    }

    capture() {
        const state = this.snapshot();
        const { insights } = this.insightEngine.evaluate();

        this.frames.push({
            t: performance.now(),
            state,
            insights
        });

        if (this.frames.length > this.maxFrames) {
            this.frames.shift();
        }
    }

    snapshot() {
        return {
            species: this.engine.species.map(s => ({
                dna: [...s.dna],
                color: s.color,
                id: s.id
            })),
            laws: { ...this.engine.laws },
            world: { ...this.engine.worldConfig }
        };
    }

    getTimeline() {
        return this.frames;
    }

    restore(frameIndex) {
        const frame = this.frames[frameIndex];
        if (!frame) return;

        this.engine.species = frame.state.species.map(s => ({
            ...s,
            rgb: this.engine.hslToRgb(parseInt(s.color.match(/\d+/)[0]) / 360, 0.7, 0.5)
        }));
        this.engine.laws = { ...frame.state.laws };
        this.engine.worldConfig = { ...frame.state.world };
        
        // Signal worker or UI about the change if needed
        this.engine.restartSim();
    }
}
