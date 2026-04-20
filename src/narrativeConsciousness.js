class NarrativeIdentity {
    constructor(name, biasVector) {
        this.name = name;
        this.bias = biasVector; // how it interprets world
        this.weight = 1;
    }
}

export class NarrativeConsciousness {
    constructor(engine) {
        this.engine = engine;
        this.memory = [];
        this.identities = [
            new NarrativeIdentity("The Stabilizer", { stability: +1.0, entropy: -1.0 }),
            new NarrativeIdentity("The Diverger", { complexity: +1.0, entropy: +0.2 }),
            new NarrativeIdentity("The Observer", { stability: +0.1, complexity: +0.1, diversity: +0.1 }),
            new NarrativeIdentity("The Dissolver", { entropy: +1.0, stability: -0.5 })
        ];
        this.narrativeMode = "hybrid"; // observer | first_person | hybrid
        this.tone = "neutral interpretive tone";
    }

    setTone(tone) {
        this.tone = tone;
    }

    ingest(insights, goalSystem) {
        this.updateIdentityWeights(goalSystem);
        this.memory.push({
            time: Date.now(),
            insights: [...insights],
            goalDominant: goalSystem.inferDominantField()
        });

        if (this.memory.length > 50) {
            this.memory.shift();
        }
    }

    updateIdentityWeights(goalSystem) {
        this.identities.forEach(id => {
            let score = 0;
            goalSystem.goals.forEach(goal => {
                score += (id.bias[goal.name] || 0) * goal.value;
            });
            id.weight = Math.max(0, score);
        });

        // normalize
        const sum = this.identities.reduce((a, b) => a + b.weight, 0);
        if (sum > 0) {
            this.identities.forEach(i => i.weight /= sum);
        } else {
            this.identities.forEach(i => i.weight = 1 / this.identities.length);
        }
    }

    generateNarrative(insights, goalSystem, personality = null) {
        const field = goalSystem.inferDominantField();
        
        // Filter insights by personality if provided
        const weightedInsights = personality ? 
            insights.filter(i => personality.interpret(i) > 0.8) : 
            insights;

        const primaryVoices = this.identities
            .filter(i => i.weight > 0.25)
            .sort((a, b) => b.weight - a.weight);

        if (primaryVoices.length === 0) return "";

        const lines = primaryVoices.map(v => this.generateVoiceLine(v, weightedInsights, field));
        
        // Perspective shift
        let finalOutput = lines.join("\n");
        if (this.narrativeMode === "first_person") {
            finalOutput = finalOutput.replace(/The system/g, "I");
            finalOutput = finalOutput.replace(/system/g, "I"); // More aggressive first-person
        } else if (this.narrativeMode === "hybrid") {
            if (Math.random() < 0.2) finalOutput = `[${this.tone.toUpperCase()}] \n` + finalOutput;
        }

        return finalOutput;
    }

    generateVoiceLine(identity, insights, field) {
        const prefix = identity.name + ":";
        const primaryGoal = field.primary.name;
        
        const templates = {
            "The Stabilizer": [
                "System trends toward equilibrium formation.",
                "Structural coherence is reaching a stable phase.",
                "Observing a decrease in chaotic fluctuations."
            ],
            "The Diverger": [
                "Divergence patterns are accelerating.",
                "System is exploring new configuration spaces.",
                "I detect increasing complexity in agent interactions."
            ],
            "The Observer": [
                "System state remains within nominal interpretive bounds.",
                "Monitoring structural shifts across species boundaries.",
                "Data indicates a transition in global dynamics."
            ],
            "The Dissolver": [
                "Structural coherence is weakening.",
                "Entropy levels are beginning to dominate formation.",
                "Observing the breakdown of established patterns."
            ]
        };

        const list = templates[identity.name] || ["Observing simulation state."];
        let line = list[Math.floor(Math.random() * list.length)];

        // Contextual injection
        if (field.tension > 4 && identity.name === "The Observer") {
            line = "High tension detected between competing system goals.";
        }

        return `${prefix} ${line}`;
    }
}
