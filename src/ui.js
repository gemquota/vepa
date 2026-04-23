import { DNA_META, DNA_RANGES, HELP_DB } from './constants.js';

let currentSpeciesIdx = 0;
let selectedSpeciesIndices = new Set([0]);
let selectionMode = false;
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
    "BIOLOGY": { keys: ["Energy Efficiency", "Sex Chance", "Predation Bias", "Species Affinity"], minLevel: 0 },
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

    window.toggleSelectionMode = (enabled) => {
        selectionMode = enabled;
        if (!enabled) {
            selectedSpeciesIndices.clear();
            selectedSpeciesIndices.add(currentSpeciesIdx);
        }
        renderSpeciesList(window.engine);
        renderDNAAccordion(window.engine);
    };

    window.selectAllSpecies = () => {
        const toggle = document.getElementById('selection-mode-toggle');
        if (toggle) {
            toggle.checked = true;
            selectionMode = true;
        }
        window.engine.species.forEach((_, idx) => selectedSpeciesIndices.add(idx));
        renderSpeciesList(window.engine);
        renderDNAAccordion(window.engine);
    };

    window.toggleSpeciesSelection = (idx, event) => {
        if (event) event.stopPropagation();
        if (selectedSpeciesIndices.has(idx)) {
            if (selectedSpeciesIndices.size > 1) selectedSpeciesIndices.delete(idx);
        } else {
            selectedSpeciesIndices.add(idx);
        }
        if (selectedSpeciesIndices.has(idx)) currentSpeciesIdx = idx;
        else if (selectedSpeciesIndices.size > 0) currentSpeciesIdx = Array.from(selectedSpeciesIndices)[0];
        
        renderSpeciesList(window.engine);
        renderDNAAccordion(window.engine);
    };

    window.updateDNA = (sIdx, rIdx, val, dId) => {
        const value = parseFloat(val);
        if (selectionMode && selectedSpeciesIndices.has(sIdx)) {
            selectedSpeciesIndices.forEach(idx => {
                emit('cmd:updateDNA', { sIdx: idx, rIdx, val: value });
                window.engine.species[idx].dna[rIdx] = value;
            });
        } else {
            emit('cmd:updateDNA', { sIdx, rIdx, val: value });
            if (window.engine.species[sIdx]) window.engine.species[sIdx].dna[rIdx] = value;
        }
        
        if (dId) {
            const el = document.getElementById(dId);
            if (el) el.innerText = value.toFixed(2);
            const row = el.closest('.slider-row');
            if (row) row.classList.toggle('zero-val', value === 0);
        }
    };

    window.handleDNAForceLog = (el, dnaIdx, dId) => {
        const pct = parseFloat(el.value);
        const minLog = Math.log(0.001), maxLog = Math.log(100);
        let val = 0;
        if (pct > 50.5) {
            const rangePct = (pct - 50) / 50;
            val = Math.exp(minLog + (maxLog - minLog) * rangePct);
        } else if (pct < 49.5) {
            const rangePct = (50 - pct) / 50;
            val = -Math.exp(minLog + (maxLog - minLog) * rangePct);
        } else {
            val = 0;
        }
        
        // Snapping
        const snaps = [0, 0.1, 0.5, 1, 10, 50, 100, -0.1, -0.5, -1, -10, -50, -100];
        for (const snap of snaps) {
            if (Math.abs(val - snap) < Math.abs(snap) * 0.15 || (snap === 0 && Math.abs(val) < 0.01)) {
                val = snap; break;
            }
        }

        window.updateDNA(currentSpeciesIdx, dnaIdx, val, dId);
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

const LAW_ICONS = {
    grav: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3" fill="var(--red-bright)"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" opacity="0.5"/><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" stroke-dasharray="2 2"/></svg>`,
    drag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12h14M2 8h10M2 16h18M18 8l4 4-4 4"/></svg>`,
    jitter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12l3-4 4 8 3-8 4 8 3-8 3 4"/></svg>`,
    wrap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4z" stroke-dasharray="4 2"/><path d="M20 12h3M1 12h3M12 1v3M12 20v3" stroke-linecap="round"/></svg>`,
    coll: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/><path d="M12 8v8" stroke-dasharray="2 2"/></svg>`,
    accr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="2"/><path d="M12 6v-4M12 22v-4M6 12h-4M22 12h-4" opacity="0.4"/><path d="M12 12L18 6M6 18L12 12" opacity="0.4"/><path d="M12 12L18 18M6 6L12 12" opacity="0.4"/><circle cx="12" cy="12" r="6" stroke-dasharray="3 3"/></svg>`,
    life: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"/><path d="M12 12c2 0 3-1 3-3s-1-3-3-3-3 1-3 3 1 3 3 3z"/><path d="M19 12c0 3.866-3.134 7-7 7s-7-3.134-7-7" opacity="0.5"/></svg>`,
    glow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4" fill="var(--red-bright)" fill-opacity="0.3"/><circle cx="12" cy="12" r="8" stroke-dasharray="4 4"/></svg>`,
    affinity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--red-bright)" fill-opacity="0.2"/></svg>`,
    reproduction: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="9" r="4"/><circle cx="15" cy="15" r="4"/></svg>`,
    tracking: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M12 8a4 4 0 100 8 4 4 0 000-8z" stroke-dasharray="2 1"/></svg>`,
    senescence: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20" opacity="0.2"/><path d="M12 12l7 7M5 5l7 7" stroke-dasharray="4 4"/><circle cx="12" cy="12" r="8" opacity="0.5"/></svg>`,
    genotype: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3c0 4.418 3.582 8 8 8s8-3.582 8-8"/><path d="M0 21c0-4.418 3.582-8 8-8s8 3.582 8 8"/></svg>`,
    phenotype: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="12" r="4"/></svg>`,
    void: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" stroke-dasharray="4 4"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" fill="currentColor"/></svg>`,
    bond: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 7l10 10M7 17L17 7"/><circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="17" r="3"/><circle cx="17" cy="7" r="3"/></svg>`,
    ener: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="var(--red-bright)" fill-opacity="0.3"/></svg>`,
    rad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" opacity="0.6"/></svg>`
};

let activeInfoTab = 'physics';
window.switchInfoTab = (tab) => { activeInfoTab = tab; renderInfoModule(); };

    const renderInfoModule = () => {
        const container = document.getElementById('info-module');
        if (!container) return;
        
        const tabs = [
            { id: 'physics', label: 'PHYSICS' },
            { id: 'biology', label: 'BIOLOGY' },
            { id: 'energetics', label: 'ENERGY' }
        ];

        const pureMap = [
            { key: 'grav', help: 'GRAV', name: 'GLOBAL GRAVITY' },
            { key: 'drag', help: 'DRAG', name: 'MOTION DAMPING' },
            { key: 'jitter', help: 'ENTR', name: 'ENTROPY (JITTER)' },
            { key: 'wrap', help: 'WRAP', name: 'SCREEN WRAPPING' },
            { key: 'coll', help: 'COLL', name: 'PHYSICAL COLLISIONS' },
            { key: 'accr', help: 'ACCR', name: 'MASS ACCRETION' },
            { key: 'void', help: 'VOID', name: 'VACUUM PRESSURE' },
            { key: 'bond', help: 'BOND', name: 'MOLECULAR BOND' }
        ];
        
        const biolMap = [
            { key: 'life', help: 'BIOL', name: 'BIOLOGICAL LIFECYCLE' },
            { key: 'glow', help: 'GLOW', name: 'SIGNALING PULSES' },
            { key: 'affinity', help: 'Species Affinity', name: 'SPECIES AFFINITY' },
            { key: 'reproduction', help: 'Birth Rate', name: 'REPRODUCTION' },
            { key: 'tracking', help: 'Signal Resp', name: 'TRACKING' },
            { key: 'senescence', help: 'Death Rate', name: 'SENESCENCE' },
            { key: 'genotype', help: 'Mutation', name: 'GENOTYPE' },
            { key: 'phenotype', help: 'C2 (Alpha)', name: 'PHENOTYPE' }
        ];

        const energeticsMap = [
            { key: 'ener', help: 'ENER', name: 'ENERGY CONSERVATION' },
            { key: 'rad', help: 'RAD', name: 'RADIATION EMISSION' }
        ];

        const currentMap = activeInfoTab === 'physics' ? pureMap : (activeInfoTab === 'biology' ? biolMap : energeticsMap);
        const currentGroup = activeInfoTab === 'physics' ? 'pure' : 'biol';

        const renderGroup = (map, groupKey) => {
            return map.map(l => {
                const data = HELP_DB[l.help];
                const isActive = window.engine.laws[groupKey][l.key];
                const icon = LAW_ICONS[l.key] || '';
                const detail = data ? `
                    <div class="info-item-detail">
                        <p class="detail-exp">${data.layers.explanation}</p>
                        <p class="detail-sys">${data.layers.system || ''}</p>
                        <p class="detail-adv">${data.layers.advanced || ''}</p>
                    </div>
                ` : '';

                return `
                    <div class="info-item">
                        <div class="info-item-header">
                            <div class="info-item-identity">
                                <div class="law-icon">${icon}</div>
                                <span class="info-item-name">${l.name}</span>
                            </div>
                            <div id="info-sw-${l.key}" class="info-item-switch ${isActive ? 'active' : ''}" onclick="window.toggleLaw('${l.key}')"></div>
                        </div>
                        <div class="info-item-desc">${detail}</div>
                    </div>
                `;
            }).join('');
        };

        const tabHtml = `
            <div class="info-tabs">
                ${tabs.map(t => `<div class="info-tab ${activeInfoTab === t.id ? 'active' : ''}" onclick="window.switchInfoTab('${t.id}')">${t.label}</div>`).join('')}
            </div>
        `;

        const introHtml = `
            <div class="info-intro">
                <div class="intro-graphic">
                    <svg viewBox="0 0 100 20" preserveAspectRatio="none" fill="var(--red-bright)" fill-opacity="0.1">
                        <path d="M0 10 Q 25 0, 50 10 T 100 10 L 100 20 L 0 20 Z" />
                    </svg>
                </div>
                <h3>LAW_CODEX_v4.2</h3>
                <p>System-wide parameterization of emergent constraints. Use tabs to navigate specialized law layers.</p>
            </div>
        `;

        container.innerHTML = introHtml + tabHtml + `<div class="info-scroll-area">${renderGroup(currentMap, currentGroup)}</div>`;
    };

    window.openTab = (event, tabId) => {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        if (event) event.currentTarget.classList.add('active');
        if (tabId === 'tab-log') renderNarrativeLog();
        if (tabId === 'tab-dna') renderDNAAnalytics(window.engine);
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
        for (const snap of snaps) { if (rawVal > snap * 0.92 && rawVal < snap * 1.08) { rawVal = snap; snapped = true; el.value = ((Math.log(snap) - minLog) / (maxLog - minLog)) * 100; break; } }
        const finalVal = rawVal < 1 ? rawVal.toFixed(3) : (rawVal < 10 ? rawVal.toFixed(2) : Math.round(rawVal));
        if (updateFn === 'updatePhysics') emit('cmd:updatePhysics', { key, val: finalVal });
        else emit('cmd:updateWorld', { key, val: finalVal });
        const dId = (updateFn === 'updatePhysics' && (key === 'G' || key === 'dt')) ? `world-val-${key}` : `world-val-${key}`;
        const valEl = document.getElementById(dId); if (valEl) {
            valEl.innerText = finalVal;
            const row = valEl.closest('.slider-row');
            if (row) row.classList.toggle('zero-val', parseFloat(finalVal) === 0);
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
        { name: 'Spawn Rate', key: 'spawnRate', min: 1, max: 1000, val: 10, type: 'world', log: true, snaps: [1, 10, 50, 100, 500, 1000] },
        { name: 'Shape', key: 'shape', min: 0, max: 1, step: 0.05, val: engine.worldConfig.shape, type: 'world' },
        { name: 'Spread X', key: 'spreadX', min: 0.1, max: 1.0, step: 0.05, val: engine.worldConfig.spreadX, type: 'world' },
        { name: 'Spread Y', key: 'spreadY', min: 0.1, max: 1.0, step: 0.05, val: engine.worldConfig.spreadY, type: 'world' },
        { name: 'Spread Z', key: 'spreadZ', min: 0.1, max: 1.0, step: 0.05, val: engine.worldConfig.spreadZ, type: 'world' },
        { name: 'Global G', key: 'G', min: 0.001, max: 100, val: engine.laws.G, type: 'phys', log: true, snaps: [0.01, 0.1, 1, 10, 50, 100] },
        { name: 'Sim Speed', key: 'dt', min: 0.1, max: 1000, val: engine.laws.dt, type: 'phys', log: true, snaps: [1, 10, 100, 500, 1000] },
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
        const div = document.createElement('div'); 
        const isActive = (idx === currentSpeciesIdx);
        const isSelected = selectedSpeciesIndices.has(idx);
        div.className = `species-card ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`;
        
        let checkboxHtml = '';
        if (selectionMode) {
            checkboxHtml = `<input type="checkbox" class="species-card-checkbox" ${isSelected ? 'checked' : ''} onclick="window.toggleSpeciesSelection(${idx}, event)">`;
        }

        div.innerHTML = `${checkboxHtml}<span>${s.name}</span> <div style="width:10px; height:10px; background:${s.color}"></div>`;
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
            
            if (name === 'Force') {
                // Special case for Force log slider
                const absVal = Math.abs(val) || 0.001;
                const sign = val >= 0 ? 1 : -1;
                const minLog = Math.log(0.001), maxLog = Math.log(100);
                const percent = ((Math.log(absVal) - minLog) / (maxLog - minLog)) * 50;
                const totalPercent = val >= 0 ? 50 + percent : 50 - percent;
                
                row.innerHTML = `<span class="slider-label" onclick="window.showTooltip('${name}', event)">${name}: </span><span id="dna-val-${dnaIdx}">${val.toFixed(2)}</span>
                    <input type="range" min="0" max="100" step="0.1" value="${totalPercent}" style="width: 100%;" 
                    oninput="window.handleDNAForceLog(this, ${dnaIdx}, 'dna-val-${dnaIdx}')">`;
            } else {
                row.innerHTML = `<span class="slider-label" onclick="window.showTooltip('${name}', event)">${name}: </span><span id="dna-val-${dnaIdx}">${val.toFixed(2)}</span><input type="range" min="${DNA_RANGES[dnaIdx].min}" max="${DNA_RANGES[dnaIdx].max}" step="0.05" value="${val}" style="width: 100%;" oninput="window.updateDNA(${currentSpeciesIdx}, ${dnaIdx}, this.value, 'dna-val-${dnaIdx}')">`;
            }
            content.appendChild(row);
        });
        wrapper.appendChild(content); container.appendChild(wrapper);
    });
}

window.addSpecies = () => emit('cmd:addSpecies');
window.selectSpecies = (idx) => { 
    if (selectionMode) {
        window.toggleSpeciesSelection(idx);
    } else {
        currentSpeciesIdx = idx; 
        selectedSpeciesIndices.clear();
        selectedSpeciesIndices.add(idx);
        renderSpeciesList(window.engine); 
        renderDNAAccordion(window.engine); 
        emit('ui:resized');
    }
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

export function updateParticleHUD(data) {
    const s = document.getElementById('p-info-species'), m = document.getElementById('p-info-mass'), a = document.getElementById('p-info-age'), e = document.getElementById('p-info-energy'), v = document.getElementById('p-info-vel'), p = document.getElementById('p-info-pos');
    if (s) s.innerText = data.species;
    if (m) m.innerText = data.mass;
    if (a) a.innerText = data.age;
    if (e) e.innerText = data.energy;
    if (v) v.innerText = data.vel;
    if (p) p.innerText = `${data.pos.x}, ${data.pos.y}, ${data.pos.z}`;
}

export function syncUI(laws) { 
    // Sync all law switches in both groups
    const groups = ['pure', 'biol'];
    groups.forEach(g => {
        if (!laws[g]) return;
        Object.keys(laws[g]).forEach(k => {
            const val = laws[g][k];
            const el = document.getElementById(`syn-${k}`); 
            if(el) el.classList.toggle('active', !!val); 

            const infoSw = document.getElementById(`info-sw-${k}`);
            if(infoSw) infoSw.classList.toggle('active', !!val);
        });
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

export function renderDNAAnalytics(engine) {
    const container = document.getElementById('dna-analytics-container');
    if (!container) return;
    
    const counts = new Array(engine.species.length).fill(0);
    if (engine.particles) {
        const STRIDE = 24; // Constant for mapping
        for (let i = 0; i < engine.worldConfig.count; i++) {
            const ptr = i * STRIDE;
            if (engine.particles[ptr+13] === 0) {
                const sIdx = Math.floor(engine.particles[ptr+12]);
                if (counts[sIdx] !== undefined) counts[sIdx]++;
            }
        }
    }

    let html = `<h3>GENETIC_DRIFT</h3>`;
    engine.species.forEach((s, idx) => {
        const totalAlive = counts.reduce((a,b) => a+b, 0) || 1;
        const pct = ((counts[idx] / totalAlive) * 100).toFixed(1);
        html += `
            <div class="dna-stat-row">
                <div class="dna-stat-label">
                    <span style="color:${s.color}">■</span> ${s.name}
                </div>
                <div class="dna-stat-bar-bg">
                    <div class="dna-stat-bar" style="width:${pct}%; background:${s.color}"></div>
                </div>
                <div class="dna-stat-val">${counts[idx]} (${pct}%)</div>
            </div>
        `;
    });

    container.innerHTML = html;
}
