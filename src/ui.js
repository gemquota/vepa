import { DNA_META, DNA_RANGES, HELP_DB } from './constants.js';

let currentSpeciesIdx = 0;
const narrativeHistory = [];

const WORLD_CATEGORIES = {
    "BASIC": { keys: ["count", "G", "dt", "spawnRate"], minLevel: 0 },
    "DIMENSIONS": { keys: ["dimX", "dimY", "dimZ", "baseSize"], minLevel: 0 },
    "DISTRIBUTION": { keys: ["spreadX", "spreadY", "spreadZ", "shape"], minLevel: 0 },
    "ENTROPY": { keys: ["entropy"], minLevel: 0 }
};

const DNA_CATEGORIES = {
    "BASIC": { keys: ["Force", "Viscosity", "Birth Rate", "Death Rate"], minLevel: 0 },
    "MOTION": { keys: ["Torque", "Jitter", "Tidal", "Stiffness", "Hidden Mass", "Inertia", "Friction", "Max Velocity"], minLevel: 0 },
    "SIGNALING": { keys: ["Signal Resp", "Pulse Rate", "Neighborhood Radius", "Signal Strength", "Signal Decay", "Propagation Speed", "Tuning Ch1", "Tuning Ch2", "Tuning Ch3", "Tuning Ch4"], minLevel: 0 },
    "ADVANCED": { keys: ["Mutation", "Fusion", "Fusion Momentum", "Fusion Time", "Base Radius", "Elasticity", "Bond Angle"], minLevel: 0 },
    "CORE TRAITS": { keys: ["C1 (Polarity)", "C2 (Alpha)", "C3 (Symmetry)", "Conductivity", "Magnetic Moment"], minLevel: 0 },
    "BIOLOGY": { keys: ["Energy Efficiency", "Sex Chance", "Predation Bias"], minLevel: 0 },
    "CHEMISTRY": { keys: ["Reaction Threshold", "Catalysis", "Heat Output", "Memory Decay"], minLevel: 0 }
};

class HelpPanel {
    constructor() { this.el = document.getElementById('help-panel'); this.state = { activeKey: null, level: 2 }; }
    open(key, level = 2) { this.state.activeKey = key; this.state.level = level; this.render(); this.el.classList.remove('hidden'); }
    close() { this.el.classList.add('hidden'); }
    render() {
        const data = HELP_DB[this.state.activeKey]; if (!data) return;
        const layers = [{ title: 'HINT', content: data.layers.hint }, { title: 'EXPLANATION', content: data.layers.explanation }, { title: 'SYSTEM', content: data.layers.system }, { title: 'ADVANCED', content: data.layers.advanced }];
        let html = `<div class="help-header"><span style="color:var(--warn); font-weight:bold;">${this.state.activeKey}</span><span class="help-close" onclick="window.closeHelp()">[X]</span></div>`;
        layers.slice(0, this.state.level).forEach(layer => { html += `<div class="help-layer"><div class="help-layer-title">${layer.title}</div><div class="help-layer-content">${layer.content}</div></div>`; });
        this.el.innerHTML = html;
    }
}

class Tooltip {
    constructor() { this.el = document.getElementById('tooltip'); }
    show(key, x, y) {
        const data = HELP_DB[key]; if (!data) return;
        this.el.innerHTML = `<div><strong>${key}</strong></div><div style="font-size: 8px; margin-top: 3px;">${data.layers.hint}</div><button class="tooltip-btn" onclick="window.openHelp('${key}'); window.hideTooltip();">📖</button>`;
        this.el.style.left = Math.min(window.innerWidth - 160, x) + 'px'; this.el.style.top = (y - 60) + 'px'; this.el.classList.remove('hidden');
    }
    hide() { this.el.classList.add('hidden'); }
}

const helpPanel = new HelpPanel(); const tooltip = new Tooltip();

// UI EVENT BUS HELPERS
const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

export function setupUI(engine) {
    window.triggerSmartChaos = () => emit('cmd:chaos');
    window.togglePause = () => emit('cmd:pause');
    window.restartSim = () => emit('cmd:restart');
    window.hardReset = () => { if(confirm("Hard reset?")) emit('cmd:hardReset'); };
    window.setPlaybackMode = (mode) => emit('cmd:playback', mode);
    window.toggleLaw = (k) => emit('cmd:toggleLaw', k);
    window.handleLawClick = (lawKey, helpKey, e) => {
        if (document.body.classList.contains('help-mode-active')) {
            window.showTooltip(helpKey, e);
        } else {
            window.toggleLaw(lawKey);
        }
    };
    window.updateDNA = (sIdx, rIdx, val, dId) => {
        emit('cmd:updateDNA', { sIdx, rIdx, val });
        if (dId) {
            const el = document.getElementById(dId);
            if (el) el.innerText = val;
            const row = el.closest('.slider-row');
            if (row) row.classList.toggle('zero-val', parseFloat(val) === 0);
        }
    };
    window.updateWorld = (key, val, dId) => {
        emit('cmd:updateWorld', { key, val });
        if (dId) {
            const el = document.getElementById(dId);
            if (el) el.innerText = val;
            const row = el.closest('.slider-row');
            if (row) row.classList.toggle('zero-val', parseFloat(val) === 0);
        }
    };
    window.updatePhysics = (key, val, dId) => {
        emit('cmd:updatePhysics', { key, val });
        if (dId) {
            const el = document.getElementById(dId);
            if (el) el.innerText = val;
            const row = el.closest('.slider-row');
            if (row) row.classList.toggle('zero-val', parseFloat(val) === 0);
        }
    };
    
    window.toggleTopBar = (force) => {
        const bar = document.getElementById('top-bar');
        const collapse = (force !== undefined) ? force : !bar.classList.contains('collapsed');
        bar.classList.toggle('collapsed', collapse);
        emit('ui:resized');
    };

    window.toggleMainPanel = (force) => {
        const panel = document.getElementById('main-panel');
        const hide = (force !== undefined) ? !force : !panel.classList.contains('hidden');
        panel.classList.toggle('hidden', hide);
        if (hide) {
            // Closing the menu itself rehides the info module
            const infoMod = document.getElementById('info-module');
            const infoBtn = document.getElementById('info-module-toggle');
            if (infoMod) infoMod.classList.add('hidden');
            if (infoBtn) infoBtn.classList.remove('active');
            const arrow = document.getElementById('info-module-arrow');
            if (arrow) arrow.innerText = '▼';
        }
        emit('ui:resized');
    };

    window.toggleInfoModule = () => {
        const mod = document.getElementById('info-module');
        const btn = document.getElementById('info-module-toggle');
        const arrow = document.getElementById('info-module-arrow');
        const active = mod.classList.toggle('hidden');
        btn.classList.toggle('active', !active);
        if (arrow) arrow.innerText = active ? '▼' : '▲';
        if (!active) renderInfoModule();
        emit('ui:resized');
    };

    const renderInfoModule = () => {
        const container = document.getElementById('info-module');
        if (!container) return;
        const lawMap = [
            { key: 'grav', help: 'GRAV', name: 'GLOBAL GRAVITY' },
            { key: 'life', help: 'BIOL', name: 'BIOLOGICAL LIFECYCLE' },
            { key: 'drag', help: 'DRAG', name: 'MOTION DAMPING' },
            { key: 'jitter', help: 'ENTR', name: 'ENTROPY (JITTER)' },
            { key: 'glow', help: 'GLOW', name: 'SIGNALING PULSES' },
            { key: 'wrap', help: 'WRAP', name: 'SCREEN WRAPPING' },
            { key: 'coll', help: 'COLL', name: 'PHYSICAL COLLISIONS' },
            { key: 'accr', help: 'ACCR', name: 'MASS ACCRETION' }
        ];
        
        container.innerHTML = lawMap.map(l => {
            const data = HELP_DB[l.help];
            const isActive = window.engine.laws[l.key];
            return `
                <div class="info-item">
                    <div class="info-item-header">
                        <span class="info-item-name">${l.name}</span>
                        <div id="info-sw-${l.key}" class="info-item-switch ${isActive ? 'active' : ''}" onclick="window.toggleLaw('${l.key}')"></div>
                    </div>
                    <div class="info-item-desc">${data ? data.layers.explanation : ''}</div>
                </div>
            `;
        }).join('');
    };

    window.openTab = (event, tabId) => {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        if (event) event.currentTarget.classList.add('active');
        if (tabId === 'tab-log') renderNarrativeLog();
        emit('ui:resized');
    };

    window.toggleAccSection = (id) => {
        const target = document.getElementById(id);
        target.classList.toggle('active');
        emit('ui:resized');
    };

    window.toggleHelpMode = () => {
        const active = document.body.classList.toggle('help-mode-active');
        document.getElementById('help-toggle').classList.toggle('active', active);
    };

    window.openHelp = (key) => helpPanel.open(key, 2);
    window.closeHelp = () => helpPanel.close();
    window.showTooltip = (key, e) => { 
        if (e) e.stopPropagation(); 
        const target = e ? e.target : null;
        const x = e ? e.clientX : window.innerWidth / 2;
        const y = e ? e.clientY : window.innerHeight / 2;
        tooltip.show(key, x, y); 
    };
    window.hideTooltip = () => {
        if (!tooltip.el.classList.contains('hidden')) {
            tooltip.hide();
            window._tooltipJustClosed = true;
            setTimeout(() => window._tooltipJustClosed = false, 200);
        }
    };

    window.notifyNewProposal = notifyNewProposal;
    window.renderEmergentSliders = renderEmergentSliders;

    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('help-mode-active')) {
            // Find the closest element with an onclick that looks like it has a help key
            // or a label/span with text that matches a HELP_DB key.
            const target = e.target;
            let helpKey = null;

            // 1. Check if it's a slider label
            if (target.classList.contains('slider-label')) {
                helpKey = target.innerText.replace(':', '').trim();
            } 
            // 2. Check for manual handleLawClick
            else if (target.hasAttribute('onclick')) {
                const attr = target.getAttribute('onclick');
                const match = attr.match(/handleLawClick\(['"].*?['"],\s*['"](.*?)['"]/);
                if (match) helpKey = match[1];
            }
            // 3. Fallback to text content if it's short and matches a key
            if (!helpKey && target.innerText.length < 30) {
                const txt = target.innerText.trim();
                if (HELP_DB[txt]) helpKey = txt;
            }

            if (helpKey) {
                e.preventDefault();
                e.stopPropagation();
                
                // Add visual feedback
                target.classList.add('help-highlight');
                setTimeout(() => target.classList.remove('help-highlight'), 600);

                window.showTooltip(helpKey, e);
                return;
            }
        }
    }, true); // Use capture phase to intercept before other handlers

    document.addEventListener('mousedown', (e) => {
        // Handle tooltip closing first
        if (!tooltip.el.classList.contains('hidden')) {
            if (!tooltip.el.contains(e.target)) {
                window.hideTooltip();
                // We don't stopPropagation here because we want the tap to potentially do other things
                // but we DO want to skip the main panel closing in this same event.
                return; 
            }
        }

        if (window._tooltipJustClosed) return;

        const panel = document.getElementById('main-panel');
        if (panel && !panel.contains(e.target) && !panel.classList.contains('hidden')) {
            if (!e.target.closest('.squashed-drawer') && !e.target.closest('.tab-link') && !e.target.closest('.squashed-top-bar') && !e.target.closest('.playback-bar-container') && !e.target.closest('.tooltip-btn') && !e.target.closest('.help-panel')) {
                window.toggleMainPanel(false);
            }
        }
    });

    const handle = document.getElementById('drawer-resize-handle');
    let isResizing = false;
    const startResize = () => { isResizing = true; document.body.style.cursor = 'ns-resize'; };
    const doResize = (e) => {
        if (!isResizing) return;
        const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
        const vh = ((window.innerHeight - clientY) / window.innerHeight) * 100;
        const clamped = Math.max(20, Math.min(80, vh));
        document.documentElement.style.setProperty('--drawer-h', clamped + 'vh');
        emit('ui:resized');
    };
    const stopResize = () => { isResizing = false; document.body.style.cursor = 'default'; };

    handle.addEventListener('mousedown', startResize);
    handle.addEventListener('touchstart', startResize, { passive: true });
    window.addEventListener('mousemove', doResize);
    window.addEventListener('touchmove', doResize, { passive: false });
    window.addEventListener('mouseup', stopResize);
    window.addEventListener('touchend', stopResize);

    window.handleLogSlider = (el, min, max, snapsStr, key, updateFn) => {
        const snaps = snapsStr.split(',').map(Number);
        const percent = parseFloat(el.value);
        const minLog = Math.log(min), maxLog = Math.log(max);
        let rawVal = Math.exp(minLog + (maxLog - minLog) * (percent / 100));
        let snapped = false;
        for (const snap of snaps) { if (rawVal > snap * 0.85 && rawVal < snap * 1.15) { rawVal = snap; snapped = true; el.value = ((Math.log(snap) - minLog) / (maxLog - minLog)) * 100; break; } }
        const finalVal = snapped ? rawVal : Math.round(rawVal);
        if (updateFn === 'updatePhysics') emit('cmd:updatePhysics', { key, val: finalVal });
        else emit('cmd:updateWorld', { key, val: finalVal });
        const dId = `world-val-${key}`; const valEl = document.getElementById(dId); if (valEl) {
            valEl.innerText = finalVal;
            const row = valEl.closest('.slider-row');
            if (row) row.classList.toggle('zero-val', finalVal === 0);
        }
    };

    setTimeout(() => { window.toggleTopBar(false); window.toggleMainPanel(false); }, 200);

    renderWorldAccordion(engine); renderSpeciesList(engine); renderDNAAccordion(engine);
}

export function renderWorldAccordion(engine) {
    const container = document.getElementById('world-accordion'); if (!container) return; container.innerHTML = '';
    const level = engine.complexityLevel || 0;
    const allWorldParams = [
        { name: 'Particle Count', key: 'count', min: 10, max: 50000, val: engine.worldConfig.count, type: 'world', log: true, snaps: [10, 100, 500, 1000, 5000, 10000, 50000] },
        { name: 'Entropy', key: 'entropy', min: 0, max: 1, step: 0.05, val: engine.worldConfig.entropy, type: 'world' },
        { name: 'Spawn Rate', key: 'spawnRate', min: 0, max: 5, step: 0.05, val: engine.worldConfig.spawnRate, type: 'world' },
        { name: 'Shape', key: 'shape', min: 0, max: 1, step: 0.05, val: engine.worldConfig.shape, type: 'world' },
        { name: 'Spread X', key: 'spreadX', min: 0.1, max: 1.0, step: 0.05, val: engine.worldConfig.spreadX, type: 'world' },
        { name: 'Spread Y', key: 'spreadY', min: 0.1, max: 1.0, step: 0.05, val: engine.worldConfig.spreadY, type: 'world' },
        { name: 'Spread Z', key: 'spreadZ', min: 0.1, max: 1.0, step: 0.05, val: engine.worldConfig.spreadZ, type: 'world' },
        { name: 'Global G', key: 'G', min: 0, max: 2, step: 0.05, val: engine.laws.G, type: 'phys' },
        { name: 'Sim Speed', key: 'dt', min: 0, max: 5, step: 0.1, val: engine.laws.dt, type: 'phys' },
        { name: 'Base Size', key: 'baseSize', min: 0.1, max: 10, step: 0.1, val: engine.worldConfig.baseSize, type: 'world' },
        { name: 'Map Width (X)', key: 'dimX', min: 100, max: 50000, val: engine.worldConfig.dimX, type: 'world', log: true, snaps: [100, 500, 1000, 5000, 10000, 20000, 50000] },
        { name: 'Map Height (Y)', key: 'dimY', min: 100, max: 50000, val: engine.worldConfig.dimY, type: 'world', log: true, snaps: [100, 500, 1000, 5000, 10000, 20000, 50000] },
        { name: 'Map Depth (Z)', key: 'dimZ', min: 100, max: 50000, val: engine.worldConfig.dimZ, type: 'world', log: true, snaps: [100, 500, 1000, 5000, 10000, 20000, 50000] }
    ];
    let sectionIdx = 0;
    Object.entries(WORLD_CATEGORIES).forEach(([catName, config]) => {
        if (level < config.minLevel) return;
        const sectionId = `world-cat-${sectionIdx++}`;
        const wrapper = document.createElement('div'); wrapper.className = 'acc-wrapper' + (sectionIdx === 1 ? ' active' : ''); wrapper.id = sectionId;
        const header = document.createElement('div'); header.className = 'tier-1-header'; header.innerText = catName; header.onclick = () => window.toggleAccSection(sectionId); wrapper.appendChild(header);
        const content = document.createElement('div'); content.className = 'tier-3-container';
        config.keys.forEach(k => {
            const it = allWorldParams.find(p => p.key === k); if (!it) return;
            const row = document.createElement('div'); row.className = 'slider-row'; 
            if (it.val === 0) row.classList.add('zero-val');
            const updateFn = it.type === 'phys' ? 'updatePhysics' : 'updateWorld';
            if (it.log) {
                const minLog = Math.log(it.min), maxLog = Math.log(it.max), valLog = Math.log(it.val), percent = ((valLog - minLog) / (maxLog - minLog)) * 100;
                let notchesHtml = '<div class="slider-notches">' + it.snaps.map(snap => { const snapPct = ((Math.log(snap) - minLog) / (maxLog - minLog)) * 100; return `<div class="notch" style="left: ${snapPct}%;" data-val="${snap}"></div>`; }).join('') + '</div>';
                row.innerHTML = `<span class="slider-label" onclick="window.showTooltip('${it.name}', event)">${it.name}: </span><span id="world-val-${it.key}">${it.val}</span><div class="log-slider-container"><input type="range" min="0" max="100" step="0.1" value="${percent}" style="width: 100%;" oninput="window.handleLogSlider(this, ${it.min}, ${it.max}, '${it.snaps.join(',')}', '${it.key}', '${updateFn}')">${notchesHtml}</div>`;
            } else {
                row.innerHTML = `<span class="slider-label" onclick="window.showTooltip('${it.name}', event)">${it.name}: </span><span id="world-val-${it.key}">${it.val}</span><input type="range" min="${it.min}" max="${it.max}" step="${it.step}" value="${it.val}" style="width: 100%;" oninput="window.${updateFn}('${it.key}', this.value, 'world-val-${it.key}')">`;
            }
            content.appendChild(row);
        });
        wrapper.appendChild(content); container.appendChild(wrapper);
    });
}

export function renderSpeciesList(engine) {
    const list = document.getElementById('species-list'); if (!list) return; list.innerHTML = '';
    engine.species.forEach((s, idx) => {
        const div = document.createElement('div'); div.className = `species-card ${idx === currentSpeciesIdx ? 'active' : ''}`;
        div.innerHTML = `<span>${s.name}</span> <div style="width:10px; height:10px; background:${s.color}"></div>`;
        div.onclick = () => window.selectSpecies(idx); list.appendChild(div);
    });
}

export function renderDNAAccordion(engine) {
    const container = document.getElementById('dna-accordion'); if (!container) return; container.innerHTML = '';
    const spec = engine.species[currentSpeciesIdx]; if (!spec) return;
    const level = engine.complexityLevel || 0;
    let sectionIdx = 0;
    Object.entries(DNA_CATEGORIES).forEach(([catName, config], idx) => {
        if (level < config.minLevel) return;
        const sectionId = `dna-cat-${sectionIdx++}`;
        const wrapper = document.createElement('div'); wrapper.className = 'acc-wrapper' + (sectionIdx === 1 ? ' active' : ''); wrapper.id = sectionId;
        const header = document.createElement('div'); header.className = 'tier-1-header'; header.innerText = catName; header.onclick = () => window.toggleAccSection(sectionId); wrapper.appendChild(header);
        const content = document.createElement('div'); content.className = 'tier-3-container';
        config.keys.forEach(name => {
            const dnaIdx = DNA_META.indexOf(name); if (dnaIdx === -1) return;
            const val = spec.dna[dnaIdx]; const row = document.createElement('div'); row.className = 'slider-row';
            if (val === 0) row.classList.add('zero-val');
            row.innerHTML = `<span class="slider-label" onclick="window.showTooltip('${name}', event)">${name}: </span><span id="dna-val-${dnaIdx}">${val.toFixed(2)}</span><input type="range" min="${DNA_RANGES[dnaIdx].min}" max="${DNA_RANGES[dnaIdx].max}" step="0.05" value="${val}" style="width: 100%;" oninput="window.updateDNA(${currentSpeciesIdx}, ${dnaIdx}, this.value, 'dna-val-${dnaIdx}')">`;
            content.appendChild(row);
        });
        wrapper.appendChild(content); container.appendChild(wrapper);
    });
}

window.addSpecies = () => emit('cmd:addSpecies');
window.selectSpecies = (idx) => { 
    currentSpeciesIdx = idx; 
    renderSpeciesList(window.engine); 
    renderDNAAccordion(window.engine); 
    emit('ui:resized');
};

let lastLogRenderedCount = 0;
function renderNarrativeLog() {
    const container = document.getElementById('narrative-log'); if (!container) return;
    if (lastLogRenderedCount === 0) container.innerHTML = '<h3>System Log</h3>';
    const newEntries = narrativeHistory.slice(lastLogRenderedCount);
    newEntries.reverse().forEach(entry => {
        const div = document.createElement('div'); div.className = 'log-entry';
        div.innerHTML = `<span class="log-time">[${entry.time}]</span> <span>${entry.text}</span>`;
        const h3 = container.querySelector('h3'); if (h3 && h3.nextSibling) container.insertBefore(div, h3.nextSibling); else container.appendChild(div);
    });
    lastLogRenderedCount = narrativeHistory.length;
}

export function updateHUD(fps, pCount, simStep = 0) { 
    const fpsEl = document.getElementById('fps'), pCountEl = document.getElementById('p-count'), stepEl = document.getElementById('sim-step'); 
    if (fpsEl) fpsEl.innerText = fps; 
    if (pCountEl) pCountEl.innerText = pCount; 
    if (stepEl) stepEl.innerText = simStep;
}
export function syncUI(laws) { 
    // Sync all 8 law switches
    const keys = ['grav', 'life', 'drag', 'jitter', 'glow', 'wrap', 'coll', 'accr'];
    keys.forEach(k => { 
        const el = document.getElementById(`syn-${k}`); 
        if(el) el.classList.toggle('active', !!laws[k]); 

        const infoSw = document.getElementById(`info-sw-${k}`);
        if(infoSw) infoSw.classList.toggle('active', !!laws[k]);
    }); 
}

let lastInsightsHash = "";
export function renderInsights(insights) {
    const el = document.getElementById('insight-panel'); if (!el) return;
    const currentHash = insights.map(i => i.id).join("|"); if (currentHash === lastInsightsHash) return; lastInsightsHash = currentHash;
    el.innerHTML = insights.map(i => `<div class="insight ${i.type} menu-chunk"><div class="bolt t-l"></div><div class="bolt t-r"></div><div class="bolt b-l"></div><div class="bolt b-r"></div><div class="chunk-inner"><strong>${i.type.toUpperCase()}</strong> ${i.message}</div></div>`).join('');
}

export function renderSuggestions(suggestions) {
    const el = document.getElementById('suggestions-panel'); if (!el) return;
    el.innerHTML = suggestions.map(s => `<div class="suggestion-card menu-chunk"><div class="bolt t-l"></div><div class="bolt t-r"></div><div class="bolt b-l"></div><div class="bolt b-r"></div><div class="chunk-inner"><h4>${s.label}</h4><p>${s.reason}</p><button class="suggestion-btn" onclick='window.applySuggestion(${JSON.stringify(s.action)})'>✅</button></div></div>`).join('');
}

window.applySuggestion = (action) => {
    if (action.type === 'law') { const current = window.engine.laws[action.key]; emit('cmd:updatePhysics', { key: action.key, val: current + action.delta }); }
    else if (action.type === 'dna') { const dnaIdx = DNA_META.indexOf(action.key); if (dnaIdx !== -1) { window.engine.species.forEach((s, sIdx) => { const current = s.dna[dnaIdx]; emit('cmd:updateDNA', { sIdx, rIdx: dnaIdx, val: current + action.delta }); }); } }
    window.selectSpecies(currentSpeciesIdx);
    const el = document.getElementById('suggestions-panel'); if (el) el.innerHTML = '';
};

export function renderNarrative(text) {
    const el = document.getElementById('narrative-panel'); if (!el) return;
    el.innerText = text; el.classList.remove('fading');
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (narrativeHistory.length === 0 || narrativeHistory[narrativeHistory.length-1].text !== text) { narrativeHistory.push({ time, text }); if (narrativeHistory.length > 100) narrativeHistory.shift(); }
    if (window._narrativeTimer) clearTimeout(window._narrativeTimer); window._narrativeTimer = setTimeout(() => el.classList.add('fading'), 4000);
}

export function updateTimelineUI(max) {
    const slider = document.getElementById('timeline-slider'); if (!slider) return; slider.max = max;
    if (slider.value == max - 1 || max == 1) { slider.value = max; document.getElementById('timeline-label').innerText = 'LIVE'; }
}

window.onTimelineScrub = (e) => { 
    const val = parseInt(e.target.value), max = parseInt(e.target.max), label = document.getElementById('timeline-label'); 
    if (val === max) label.innerText = 'LIVE'; 
    else { 
        label.innerText = 'REPLAY: ' + val; 
        window.engine.timelineEngine.restore(val, false); 
    } 
};

window.onTimelineScrubEnd = (e) => {
    const val = parseInt(e.target.value), max = parseInt(e.target.max);
    if (val < max) {
        window.engine.timelineEngine.restore(val, true); // Sync worker when scrub ends
    }
};

setTimeout(() => { 
    const slider = document.getElementById('timeline-slider'); 
    if (slider) {
        slider.oninput = window.onTimelineScrub;
        slider.onchange = window.onTimelineScrubEnd;
    }
}, 100);

export function notifyNewProposal(name) {
    const el = document.getElementById('proposal-panel'); const p = window.engine.emergentEngine.pending[0]; if (!p) return;
    el.innerHTML = `<div class="menu-chunk"><div class="bolt t-l"></div><div class="bolt t-r"></div><div class="bolt b-l"></div><div class="bolt b-r"></div><div class="chunk-inner"><h3>NEW LAW DETECTED</h3><p><strong>${p.name}</strong></p><p style="font-size: 8px;">${p.def.description}</p><div class="proposal-actions"><button class="accept" onclick="window.acceptParam('${p.key}')" title="Accept">✅</button><button class="reject" onclick="window.rejectParam('${p.key}')" title="Reject">❌</button></div></div></div>`;
    el.classList.remove('hidden');
}

window.acceptParam = (key) => {
    const p = window.engine.emergentEngine.pending.find(x => x.key === key);
    if (p) { window.engine.emergentEngine.spawnAcceptedParam(p); window.engine.emergentEngine.pending = window.engine.emergentEngine.pending.filter(x => x.key !== key); renderNarrative('New law accepted: ' + p.name); }
    document.getElementById('proposal-panel').classList.add('hidden');
};

window.rejectParam = (key) => { window.engine.emergentEngine.rejected.add(key); window.engine.emergentEngine.pending = window.engine.emergentEngine.pending.filter(x => x.key !== key); document.getElementById('proposal-panel').classList.add('hidden'); };

export function renderEmergentSliders() {
    const settingsTab = document.getElementById('tab-settings'); let container = document.getElementById('emergent-sliders');
    if (!container) { container = document.createElement('div'); container.id = 'emergent-sliders'; container.className = 'settings-group'; settingsTab.appendChild(container); }
    container.innerHTML = '<h3>EMERGENT_LAWS</h3>';
    Object.entries(window.engine.emergentEngine.metaParams).forEach(([key, val]) => {
        const row = document.createElement('div'); row.className = 'slider-row'; const displayName = key.replace(/_/g, ' ');
        row.innerHTML = `<span class="slider-label" onclick="window.showTooltip('${displayName}', event)">${displayName}: </span><span id="meta-val-${key}">${val.toFixed(2)}</span><input type="range" min="0" max="1" step="0.01" value="${val}" style="width: 100%;" oninput="window.updateMetaParam('${key}', this.value)">`;
        container.appendChild(row);
    });
}

window.updateMetaParam = (key, val) => { window.engine.emergentEngine.metaParams[key] = parseFloat(val); document.getElementById(`meta-val-${key}`).innerText = val; };

export function updatePlaybackUI(mode, paused) {
    const btn = document.getElementById('play-pause-btn'); if (btn) btn.innerText = paused ? '▶' : '⏸';
    document.querySelectorAll('.play-btn').forEach(b => b.classList.remove('active'));
    const btns = document.querySelectorAll('.play-btn'); btns.forEach(b => { if (b.title.toLowerCase().includes(mode)) b.classList.add('active'); if (mode === 'forward' && b.title === 'Play') b.classList.add('active'); });
}
