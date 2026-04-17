import { DNA_META, DNA_RANGES, HELP_DB } from './constants';

let currentSpeciesIdx = 0;

class HelpPanel {
    constructor() {
        this.el = document.getElementById('help-panel');
        this.state = {
            activeKey: null,
            level: 2
        };
    }

    open(key, level = 2) {
        this.state.activeKey = key;
        this.state.level = level;
        this.render();
        this.el.classList.remove('hidden');
    }

    close() {
        this.el.classList.add('hidden');
    }

    render() {
        const data = HELP_DB[this.state.activeKey];
        if (!data) return;

        const layers = [
            { id: 'hint', title: 'HINT', content: data.layers.hint },
            { id: 'explanation', title: 'EXPLANATION', content: data.layers.explanation },
            { id: 'system', title: 'SYSTEM', content: data.layers.system },
            { id: 'advanced', title: 'ADVANCED', content: data.layers.advanced }
        ];

        let html = `
            <div class="help-header">
                <span style="color:var(--warn); font-weight:bold;">${this.state.activeKey}</span>
                <span class="help-close" onclick="window.closeHelp()">[X]</span>
            </div>
        `;

        layers.slice(0, this.state.level).forEach(layer => {
            html += `
                <div class="help-layer">
                    <div class="help-layer-title">${layer.title}</div>
                    <div class="help-layer-content">${layer.content}</div>
                </div>
            `;
        });

        if (this.state.level >= 3) {
            html += `
                <div class="help-thresholds">
                    <div class="help-layer-title">THRESHOLDS</div>
                    <div>Low: ${data.thresholds.low}</div>
                    <div>High: ${data.thresholds.high}</div>
                    <div>Extreme: ${data.thresholds.extreme}</div>
                </div>
            `;
        }

        this.el.innerHTML = html;
    }
}

const helpPanel = new HelpPanel();

export function setupUI(engine) {
    window.triggerSmartChaos = () => engine.triggerSmartChaos();
    window.togglePause = () => engine.togglePause();
    window.restartSim = () => engine.restartSim();
    window.toggleLaw = (k) => engine.toggleLaw(k);
    window.updateDNA = (sIdx, rIdx, val, dId) => engine.updateDNA(sIdx, rIdx, val, dId);
    window.updateWorld = (key, val, dId) => engine.updateWorld(key, val, dId);
    window.updatePhysics = (key, val, dId) => engine.updatePhysics(key, val, dId);
    window.openTab = (event, tabId) => {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
        if (tabId === 'tab-help') renderEncyclopaedia();
    };
    window.addSpecies = () => { engine.addSpecies(); renderSpeciesList(engine); };
    window.selectSpecies = (idx) => { currentSpeciesIdx = idx; renderSpeciesList(engine); renderDNASliders(engine); };
    
    window.openHelp = (key) => helpPanel.open(key, 2);
    window.openHelpDeep = (key) => helpPanel.open(key, 4);
    window.closeHelp = () => helpPanel.close();

    renderWorldSliders(engine);
    renderPhysicsSliders(engine);
    renderSpeciesList(engine);
    renderDNASliders(engine);
}

function attachLongPress(el, key) {
    let timer;
    const start = () => {
        timer = setTimeout(() => {
            window.openHelpDeep(key);
            timer = null;
        }, 600);
    };
    const end = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchend', end, { passive: true });
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', end);
}

function renderWorldSliders(engine) {
    const container = document.getElementById('world-sliders');
    if (!container) return;
    const items = [
        { name: 'Particle Count', key: 'count', min: 100, max: 10000, step: 100, val: 5000 },
        { name: 'Entropy (Grid-Chaos)', key: 'entropy', min: 0, max: 1, step: 0.01, val: 0.5 },
        { name: 'Spawn Rate', key: 'spawnRate', min: 0, max: 1, step: 0.01, val: 0.0 },
        { name: 'Shape (Cube-Sphere)', key: 'shape', min: 0, max: 1, step: 0.01, val: 0.0 },
        { name: 'Spread X', key: 'spreadX', min: 0.1, max: 1.0, step: 0.01, val: 0.5 },
        { name: 'Spread Y', key: 'spreadY', min: 0.1, max: 1.0, step: 0.01, val: 0.5 },
        { name: 'Spread Z', key: 'spreadZ', min: 0.1, max: 1.0, step: 0.01, val: 0.5 },
    ];
    container.innerHTML = '<h3>World Setup</h3>';
    items.forEach(it => {
        const row = document.createElement('div');
        row.className = 'slider-row';
        row.innerHTML = `
            <span class="slider-label">${it.name}: </span><span id="world-val-${it.key}">${it.val}</span>
            <input type="range" min="${it.min}" max="${it.max}" step="${it.step}" value="${it.val}" 
                   style="width: 100%;" oninput="window.updateWorld('${it.key}', this.value, 'world-val-${it.key}')">
        `;
        container.appendChild(row);
    });
}

function renderPhysicsSliders(engine) {
    const container = document.getElementById('phys-sliders');
    if (!container) return;
    const items = [
        { name: 'Global G', key: 'G', min: 0, max: 2, step: 0.01, val: 0.15 },
        { name: 'Sim Speed', key: 'dt', min: 0, max: 5, step: 0.1, val: 1.0 },
        { name: 'Base Size', key: 'baseSize', min: 0.01, max: 0.5, step: 0.01, val: 0.05 },
        { name: 'Map Width (X)', key: 'dimX', min: 2000, max: 20000, step: 500, val: 10000 },
        { name: 'Map Height (Y)', key: 'dimY', min: 2000, max: 20000, step: 500, val: 10000 },
        { name: 'Map Depth (Z)', key: 'dimZ', min: 2000, max: 20000, step: 500, val: 10000 }
    ];
    container.innerHTML = '<h3>Simulation Scale</h3>';
    items.forEach(it => {
        const row = document.createElement('div');
        row.className = 'slider-row';
        row.innerHTML = `
            <span class="slider-label">${it.name}: </span><span id="phys-val-${it.key}">${it.val}</span>
            <input type="range" min="${it.min}" max="${it.max}" step="${it.step}" value="${it.val}" 
                   style="width: 100%;" oninput="window.updatePhysics('${it.key}', this.value, 'phys-val-${it.key}')">
        `;
        container.appendChild(row);
    });
}

function renderSpeciesList(engine) {
    const list = document.getElementById('species-list');
    if (!list) return;
    list.innerHTML = '';
    engine.species.forEach((s, idx) => {
        const div = document.createElement('div');
        div.className = `species-card ${idx === currentSpeciesIdx ? 'active' : ''}`;
        div.innerHTML = `<span>Species ${idx + 1}</span> <div style="width:10px; height:10px; background:${s.color}"></div>`;
        div.onclick = () => window.selectSpecies(idx);
        list.appendChild(div);
    });
}

function renderDNASliders(engine) {
    const container = document.getElementById('dna-sliders');
    if (!container) return;
    container.innerHTML = `<h3>Species ${currentSpeciesIdx + 1} DNA</h3>`;
    const spec = engine.species[currentSpeciesIdx];
    DNA_META.forEach((name, idx) => {
        const val = spec.dna[idx];
        const row = document.createElement('div');
        row.className = 'slider-row';
        const label = document.createElement('span');
        label.className = 'slider-label';
        label.innerText = `${name}: `;
        label.onclick = () => window.openHelp(name);
        attachLongPress(label, name);
        
        row.appendChild(label);
        
        const valSpan = document.createElement('span');
        valSpan.id = `dna-val-${idx}`;
        valSpan.innerText = val.toFixed(2);
        row.appendChild(valSpan);
        
        const input = document.createElement('input');
        input.type = 'range';
        input.min = DNA_RANGES[idx].min;
        input.max = DNA_RANGES[idx].max;
        input.step = 0.01;
        input.value = val;
        input.style.width = '100%';
        input.oninput = (e) => window.updateDNA(currentSpeciesIdx, idx, e.target.value, `dna-val-${idx}`);
        row.appendChild(input);
        
        container.appendChild(row);
    });
}

function renderEncyclopaedia() {
    const container = document.getElementById('encyclopaedia');
    if (!container) return;
    container.innerHTML = '<h3>Encyclopaedia</h3>';
    Object.entries(HELP_DB).forEach(([key, data]) => {
        const div = document.createElement('div');
        div.className = 'encyclopaedia-entry';
        div.innerHTML = `
            <h4>${key}</h4>
            <p>${data.layers.explanation}</p>
        `;
        div.onclick = () => window.openHelp(key);
        container.appendChild(div);
    });
}

export function updateHUD(fps, pCount) {
    const fpsEl = document.getElementById('fps'), pCountEl = document.getElementById('p-count');
    if (fpsEl) fpsEl.innerText = fps; if (pCountEl) pCountEl.innerText = pCount;
}

export function syncUI(laws) {
    Object.keys(laws).forEach(k => {
        const el = document.getElementById(`syn-${k}`);
        if(el) el.classList.toggle('active', laws[k]);
    });
}

export function renderInsights(insights) {
    const el = document.getElementById('insight-panel');
    if (!el) return;
    el.innerHTML = insights.map(i => `
        <div class="insight ${i.type}">
            <strong>${i.type.toUpperCase()}</strong>
            ${i.message}
        </div>
    `).join('');
}

export function renderSuggestions(suggestions) {
    const el = document.getElementById('suggestions-panel');
    if (!el) return;
    el.innerHTML = suggestions.map(s => `
        <div class="suggestion-card">
            <h4>${s.label}</h4>
            <p>${s.reason}</p>
            <button class="suggestion-btn" onclick='window.applySuggestion(${JSON.stringify(s.action)})'>APPLY</button>
        </div>
    `).join('');
}

window.applySuggestion = (action) => {
    if (action.type === 'law') {
        const current = window.engine.laws[action.key];
        window.engine.updatePhysics(action.key, current + action.delta);
    } else if (action.type === 'dna') {
        const dnaIdx = DNA_META.indexOf(action.key);
        if (dnaIdx !== -1) {
            window.engine.species.forEach((s, sIdx) => {
                const current = s.dna[dnaIdx];
                window.engine.updateDNA(sIdx, dnaIdx, current + action.delta);
            });
        }
    }
    // Re-render UI to show new values
    window.selectSpecies(currentSpeciesIdx); 
};
