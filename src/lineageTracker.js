export class LineageTracker {
    constructor() {
        this.speciesMap = new Map(); // id → record
        this.nextId = 0;
        this.crossoverEvents = [];
        this.speciationEvents = [];
        this.hgtEvents = [];
    }

    createSpecies(dna, parentId = null, parent2Id = null) {
        const id = this.nextId++;

        const record = {
            id,
            parentId,
            parent2Id, // Second parent for sexual reproduction
            dna: [...dna],
            birthTime: Date.now(),
            children: [],
            mutations: [],
            crossoverHistory: [],
            epigeneticMarks: [],
            history: [],
            name: this.generateName(id),
            geneticDiversity: 0,
            ploidy: 2
        };

        this.speciesMap.set(id, record);

        if (parentId !== null) {
            const parent = this.speciesMap.get(parentId);
            if (parent) parent.children.push(id);
        }
        if (parent2Id !== null && parent2Id !== parentId) {
            const parent2 = this.speciesMap.get(parent2Id);
            if (parent2) parent2.children.push(id);
        }

        return record;
    }

    generateName(id) {
        const roots = ["Astra", "Virex", "Klyne", "Orin", "Zetha", "Myra", "Nylo", "Pyra",
                       "Sylva", "Korath", "Veyla", "Thryn", "Mycel", "Xenon", "Phyra", "Zynth"];
        const suffix = Math.floor(id / roots.length);
        const prefix = roots[id % roots.length];
        if (suffix === 0) return prefix;
        return `${prefix}-${suffix}`;
    }

    recordCrossover(parentId1, parentId2, childId, crossoverPoint) {
        this.crossoverEvents.push({
            parent1: parentId1,
            parent2: parentId2,
            child: childId,
            point: crossoverPoint,
            time: Date.now()
        });
        const record = this.speciesMap.get(childId);
        if (record) {
            record.crossoverHistory.push({
                from: [parentId1, parentId2],
                point: crossoverPoint,
                time: Date.now()
            });
        }
    }

    recordSpeciation(parentId, childId, geneticDistance) {
        this.speciationEvents.push({
            parent: parentId,
            child: childId,
            distance: geneticDistance,
            time: Date.now()
        });
        const record = this.speciesMap.get(childId);
        if (record) {
            record.history.push({
                time: Date.now(),
                type: 'speciation',
                note: `Speciation from ${parentId} at distance ${geneticDistance.toFixed(3)}`
            });
        }
        const parent = this.speciesMap.get(parentId);
        if (parent) {
            parent.history.push({
                time: Date.now(),
                type: 'speciation_event',
                note: `Child ${childId} diverged into new species`
            });
        }
    }

    recordHGT(recipientId, donorId, traitsTransferred) {
        this.hgtEvents.push({
            recipient: recipientId,
            donor: donorId,
            traits: traitsTransferred,
            time: Date.now()
        });
        const record = this.speciesMap.get(recipientId);
        if (record) {
            record.history.push({
                time: Date.now(),
                type: 'hgt',
                note: `Horizontal transfer from ${donorId}: ${traitsTransferred} traits`
            });
        }
    }

    recordMutation(childId, parentId, deltaDNA) {
        const record = this.speciesMap.get(childId);
        if (record) {
            record.mutations.push({
                from: parentId,
                delta: deltaDNA,
                time: Date.now()
            });
        }
    }

    recordEpigenetic(id, trait, delta) {
        const record = this.speciesMap.get(id);
        if (record) {
            record.epigeneticMarks.push({
                trait,
                delta,
                time: Date.now()
            });
            if (record.epigeneticMarks.length > 50) {
                record.epigeneticMarks.shift();
            }
        }
    }

    recordEvent(id, type, note) {
        const record = this.speciesMap.get(id);
        if (record) {
            record.history.push({
                time: Date.now(),
                type,
                note
            });
            if (record.history.length > 20) {
                record.history.shift();
            }
        }
    }

    getAncestry(id) {
        const chain = [];
        let current = this.speciesMap.get(id);
        while (current) {
            chain.push({ name: current.name, id: current.id });
            current = this.speciesMap.get(current.parentId);
        }
        return chain.reverse();
    }

    getGeneticsReport() {
        return {
            totalSpecies: this.speciesMap.size,
            totalCrossoverEvents: this.crossoverEvents.length,
            totalSpeciationEvents: this.speciationEvents.length,
            totalHGTEvents: this.hgtEvents.length,
            species: Array.from(this.speciesMap.values()).map(s => ({
                id: s.id,
                name: s.name,
                parentId: s.parentId,
                children: s.children.length,
                mutationCount: s.mutations.length,
                history: s.history.slice(-5)
            }))
        };
    }

    getGeneticDistance(id1, id2) {
        const s1 = this.speciesMap.get(id1);
        const s2 = this.speciesMap.get(id2);
        if (!s1 || !s2) return Infinity;
        let dist = 0;
        for (let i = 0; i < Math.min(s1.dna.length, s2.dna.length); i++) {
            dist += (s1.dna[i] - s2.dna[i]) ** 2;
        }
        return Math.sqrt(dist);
    }
}
