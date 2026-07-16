import { HELP_DB } from '../src/constants.js';
import { LAW_DATA } from '../codex/synergyData.js';
import fs from 'fs';

const entries = {};

// 1. Populate from HELP_DB
Object.keys(HELP_DB).forEach(key => {
    const data = HELP_DB[key];
    entries[key] = {
        title: key.toUpperCase(),
        tags: [data.category],
        summary: data.layers.hint,
        basic: data.layers.explanation,
        advanced: data.layers.advanced,
        expert: data.layers.system,
        special: "SECURE_DATA_ENCRYPTED"
    };
});

// 2. Overlay from LAW_DATA (synergies)
LAW_DATA.forEach(law => {
    const key = law.id;
    if (entries[key]) {
        entries[key].title = law.name;
        entries[key].summary = law.desc;
        entries[key].synergies = {};
        law.synergies.forEach(syn => {
            const synKey = syn.with.join(' + ');
            entries[key].synergies[synKey] = syn.effect;
        });
    } else {
        // New entry not in HELP_DB?
        entries[key] = {
            title: law.name,
            tags: [law.category],
            summary: law.desc,
            synergies: {}
        };
        law.synergies.forEach(syn => {
            const synKey = syn.with.join(' + ');
            entries[key].synergies[synKey] = syn.effect;
        });
    }
});

// 3. Add the Special Graph entry
entries["SYNERGY_MAP"] = {
    "title": "Universal Synergy Matrix",
    "tags": ["System", "Emergence", "Interactive"],
    "summary": "Visual exploration of cross-category law interactions.",
    "basic": "The Synergy Matrix is an interactive topological map of the VEPA law space. It visualizes how individual laws interconnect to form complex emergent behaviors.",
    "advanced": "The Synergy Matrix is an interactive topological map of the VEPA law space. It visualizes how individual laws interconnect to form complex emergent behaviors.",
    "expert": "A node-based graph representation of the internal SYNERGY_MAP constant. Directed edges indicate functional dependencies.",
    "special": "The 'Map of Everything'. Navigating it is the path to the 'Particle God' status.",
    "synergies": {
        "basic": "Shows you what laws to turn on together.",
        "advanced": "Reveals hidden mechanics like 'Hive Metabolism' (MIND+ENER).",
        "expert": "Visualizes the complexity-growth vectors of the current simulation.",
        "special": "The graph itself is a lifeform in the 'MIND' law regime."
    },
    "type": "graph"
};

fs.writeFileSync('./codex/entries.json', JSON.stringify(entries, null, 4));
console.log('Codex entries generated successfully.');
