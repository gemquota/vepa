export class PersistenceEngine {
    constructor(key = "VEPA_UNIVERSE") {
        this.key = key;
    }

    save(engine) {
        const state = {
            metaParams: engine.emergentEngine.metaParams,
            definitions: this.serializeDefinitions(engine.emergentEngine.definitions),
            rejected: Array.from(engine.emergentEngine.rejected),
            complexityLevel: engine.complexityLevel,
            simAge: engine.simAge,
            version: 3
        };
        localStorage.setItem(this.key, JSON.stringify(state));
    }

    load(engine) {
        const raw = localStorage.getItem(this.key);
        if (!raw) return false;

        try {
            const saved = JSON.parse(raw);
            engine.emergentEngine.metaParams = saved.metaParams || {};
            engine.emergentEngine.rejected = new Set(saved.rejected || []);
            engine.complexityLevel = saved.complexityLevel || 0;
            engine.simAge = saved.simAge || 0;
            
            // Re-hydrate definitions (effects are functions, need re-mapping)
            Object.keys(saved.definitions || {}).forEach(key => {
                const name = key.replace(/_/g, ' ');
                const def = engine.emergentEngine.generateDefinition(name);
                if (def) {
                    engine.emergentEngine.definitions[key] = def;
                    // Re-inject into HelpDB
                    engine.emergentEngine.spawnAcceptedParam({ key, def, name });
                }
            });
            return true;
        } catch (e) {
            console.error("Failed to load universe:", e);
            return false;
        }
    }

    serializeDefinitions(defs) {
        // We only save keys, we re-hydrate logic from generateDefinition for safety/versioning
        const out = {};
        Object.keys(defs).forEach(k => out[k] = { key: k });
        return out;
    }
}
