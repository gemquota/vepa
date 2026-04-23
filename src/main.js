import * as PIXI from 'pixi.js';
import { DNA_META, DNA_RANGES } from './constants.js';
import { setupUI, updateHUD, syncUI, renderInsights, renderSuggestions, renderNarrative, updateTimelineUI, notifyNewProposal, updatePlaybackUI, renderWorldAccordion, renderDNAAccordion, renderSpeciesList } from './ui.js';
import { InsightEngine } from './insightEngine.js';
import { NarrativeEngine } from './narrativeEngine.js';
import { TimelineEngine } from './timelineEngine.js';
import { LineageTracker } from './lineageTracker.js';
import { EmergentParamEngine } from './emergentParamEngine.js';
import { PersistenceEngine } from './persistenceEngine.js';
import { GoalSystem } from './goalEngine.js';
import { NarrativeConsciousness } from './narrativeConsciousness.js';
import { PersonalityCore } from './personalityEngine.js';

const STRIDE = 24;

class VepaEngine {
    constructor() {
        this.app = new PIXI.Application();
        this.paused = false;
        this.laws = { grav: true, drag: true, jitter: true, coll: true, accr: true, life: false, glow: false, G: 0.15, dt: 1.0 };
        this.worldConfig = { count: 800, dimX: 500, dimY: 500, dimZ: 500, spreadX: 0.8, spreadY: 0.8, spreadZ: 0.5, baseSize: 2.0 };
        this.zoom = 1.0; this.pan = { x: 0, y: 0, z: 0 }; 
        this.particles = null;
        this.simVersion = 0;
        this.simStep = 0;
        this.focalLength = 3000;
        this.workerBusy = false;
        this.simAge = 0;
        this.complexityLevel = 10; 

        this.lineageTracker = new LineageTracker();
        this.species = this.createDefaultSpecies();

        this.insightEngine = new InsightEngine(this);
        this.narrativeEngine = new NarrativeEngine();
        this.timelineEngine = new TimelineEngine(this, this.insightEngine);
        this.emergentEngine = new EmergentParamEngine(this);
        this.goalSystem = new GoalSystem(this);
        this.narrativeConsciousness = new NarrativeConsciousness(this);
        this.personality = new PersonalityCore();
        this.persistence = new PersistenceEngine();
        this.persistence.load(this);

        this.initPixi().then(() => {
            this.setupInteraction();
            this.worker = new Worker(new URL('./worker/physics.worker.js', import.meta.url), { type: 'module' });
            this.worker.onmessage = (e) => this.handleWorkerMessage(e);
            this.restartSim();
            setupUI(this); syncUI(this.laws);
            updatePlaybackUI(this.playbackMode || 'forward', this.paused);
            this.app.ticker.add(() => this.update());
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        const on = (name, fn) => window.addEventListener(name, (e) => fn(e.detail));
        on('cmd:chaos', () => this.triggerSmartChaos());
        on('cmd:pause', () => this.togglePause());
        on('cmd:restart', () => this.restartSim());
        on('cmd:hardReset', () => this.hardReset());
        on('cmd:playback', (mode) => this.setPlaybackMode(mode));
        on('cmd:toggleLaw', (k) => this.toggleLaw(k));
        on('cmd:updateDNA', ({ sIdx, rIdx, val }) => this.updateDNA(sIdx, rIdx, val));
        on('cmd:updateWorld', ({ key, val }) => this.updateWorld(key, val));
        on('cmd:updatePhysics', ({ key, val }) => this.updatePhysics(key, val));
        on('cmd:addSpecies', () => { this.addSpecies(); });
        on('ui:resized', () => this.recenter());
    }

    createDefaultSpecies() {
        const pairs = [{ pos: [1, 0, 0], neg: [0, 1, 1], name: 'RED/CYAN' }, { pos: [0, 1, 0], neg: [1, 0, 1], name: 'GREEN/MAGENTA' }, { pos: [0, 0, 1], neg: [1, 1, 0], name: 'BLUE/YELLOW' }];
        const spec = [];
        pairs.forEach((p) => {
            const s1 = this.createSpecies(); s1.name = p.name + "_POS"; s1.dna[4] = 1.0; s1.rgb = p.pos;
            s1.color = `rgb(${p.pos[0]*255},${p.pos[1]*255},${p.pos[2]*255})`; spec.push(s1);
            const s2 = this.createSpecies(); s2.name = p.name + "_NEG"; s2.dna[4] = -1.0; s2.rgb = p.neg;
            s2.color = `rgb(${p.neg[0]*255},${p.neg[1]*255},${p.neg[2]*255})`; spec.push(s2);
        });
        return spec;
    }

    createSpecies(parentId = null) {
        const dna = DNA_RANGES.map(r => r.default);
        const record = this.lineageTracker.createSpecies(dna, parentId);
        return { id: record.id, name: record.name, dna, color: null, rgb: null };
    }

    addSpecies() { if (this.species.length < 12) { this.species.push(this.createSpecies(null)); renderSpeciesList(this); } }

    async initPixi() {
        await this.app.init({ background: '#000', resizeTo: window });
        document.body.appendChild(this.app.canvas);
        this.world = new PIXI.Container();
        this.app.stage.addChild(this.world);
        this.envGraphics = new PIXI.Graphics();
        this.world.addChild(this.envGraphics);
        const g = new PIXI.Graphics(); g.circle(0, 0, 32).fill({ color: 0xffffff });
        this.texture = this.app.renderer.generateTexture(g);
        this.particleSprites = [];
        this.minimap = new PIXI.Graphics();
        this.minimap.x = 20; this.minimap.y = window.innerHeight - 120;
        this.app.stage.addChild(this.minimap);
    }

    setupInteraction() {
        let activePointers = new Map(), initialDistance = 0, initialZoom = 1.0;
        this.app.canvas.addEventListener('wheel', (e) => { 
            e.preventDefault();
            this.zoom *= Math.pow(0.999, e.deltaY); 
            this.applyLimits(); 
        }, { passive: false });

        this.app.canvas.addEventListener('pointerdown', e => { 
            e.preventDefault();
            activePointers.set(e.pointerId, { lastX: e.clientX, lastY: e.clientY }); 
            if (activePointers.size === 2) {
                const pts = Array.from(activePointers.values());
                initialDistance = Math.hypot(pts[0].lastX - pts[1].lastX, pts[0].lastY - pts[1].lastY);
                initialZoom = this.zoom;
            }
        });

        window.addEventListener('pointerup', e => { 
            activePointers.delete(e.pointerId); 
            if (activePointers.size < 2) initialDistance = 0; 
        });

        window.addEventListener('pointermove', e => {
            const p = activePointers.get(e.pointerId); if (!p) return;
            const dx = e.clientX - p.lastX, dy = e.clientY - p.lastY;
            
            if (activePointers.size === 1) {
                // Dragging moves the CAMERA, so the WORLD moves the same way as the drag (standard for many sims)
                // or dragging moves the world directly (dx/zoom).
                const sensitivity = 1.0 / this.zoom;
                this.pan.x += dx * sensitivity;
                this.pan.y += dy * sensitivity;
            } else if (activePointers.size === 2) {
                const pts = Array.from(activePointers.values());
                const dist = Math.hypot(pts[0].lastX - pts[1].lastX, pts[0].lastY - pts[1].lastY);
                if (initialDistance > 0) this.zoom = initialZoom * (dist / initialDistance);
            }
            
            p.lastX = e.clientX; p.lastY = e.clientY;
            this.applyLimits(); 
        }, { passive: false });
    }

    applyLimits() { 
        const minZoom = 0.005; this.zoom = Math.max(minZoom, Math.min(500, this.zoom));
        const limitX = this.worldConfig.dimX * 1.5; const limitY = this.worldConfig.dimY * 1.5;
        this.pan.x = Math.max(-limitX, Math.min(limitX, this.pan.x));
        this.pan.y = Math.max(-limitY, Math.min(limitY, this.pan.y));
    }

    restartSim() {
        this.simVersion++; this.workerBusy = false; this.simStep = 0;
        const count = this.worldConfig.count;
        this.particles = new Float32Array(count * STRIDE);
        this.particleSprites.forEach(s => s.destroy()); this.particleSprites = [];
        const W = this.worldConfig.dimX, H = this.worldConfig.dimY, D = this.worldConfig.dimZ;
        const sX = this.worldConfig.spreadX, sY = this.worldConfig.spreadY, sZ = this.worldConfig.spreadZ;
        for (let i = 0; i < count; i++) {
            const ptr = i * STRIDE, sprite = new PIXI.Sprite(this.texture);
            sprite.anchor.set(0.5); this.world.addChild(sprite); this.particleSprites.push(sprite);
            const spec = this.species[i % this.species.length];
            this.particles[ptr] = (Math.random()-0.5)*W*sX; this.particles[ptr+1] = (Math.random()-0.5)*H*sY; this.particles[ptr+2] = (Math.random()-0.5)*D*sZ;
            this.particles[ptr+11] = 1.0 + Math.random();
            this.particles[ptr+12] = spec.id; this.particles[ptr+13] = 0;
            this.particles[ptr+21] = spec.dna[4] || 0; // Polarity
            this.particles[ptr+22] = 100.0; // Energy
            this.particles[ptr+23] = 0; // Age
            const rgb = spec.rgb || [0.5, 0.5, 0.5];
            this.particles[ptr+14] = rgb[0]; this.particles[ptr+15] = rgb[1]; this.particles[ptr+16] = rgb[2];
        }
        this.worker.postMessage({ type: 'init', data: { particles: this.particles }, version: this.simVersion });
    }

    handleWorkerMessage(e) { 
        if (e.data.version !== this.simVersion) return;
        if (e.data.type === 'update') { this.particles = e.data.particles; this.workerBusy = false; this.simStep++; }
    }

    update() {
        if (!this.particles) return;
        if (!this.paused) {
            if (this.playbackMode === 'reverse' || this.playbackMode === 'rewind') {
                const slider = document.getElementById('timeline-slider');
                if (slider) {
                    const newVal = Math.max(0, parseInt(slider.value) - (this.playbackMode === 'rewind' ? 5 : 1));
                    slider.value = newVal; this.timelineEngine.restore(newVal, false);
                    if (newVal === 0) { this.paused = true; updatePlaybackUI(this.playbackMode, this.paused); }
                }
            } else {
                this.simAge++;
                if (!this.workerBusy) {
                    this.workerBusy = true;
                    this.worker.postMessage({ type: 'step', version: this.simVersion, config: { laws: this.laws, world: this.worldConfig, specDNA: this.species.map(s => this.getFlattenedDNA(s)) }, particles: this.particles });
                } else if (this.simAge % 200 === 0) { this.workerBusy = false; }
            }
        }

        if (!this.paused && this.simAge % 60 === 0) {
            const { insights, suggestions } = this.insightEngine.evaluate();
            renderInsights(insights); renderSuggestions(suggestions);
            this.timelineEngine.capture();
        }

        this.draw();
    }

    draw() {
        this.renderEnvironment();
        const cX = window.innerWidth/2, cY = window.innerHeight/2;
        const speciesMap = new Map(); this.species.forEach(s => speciesMap.set(s.id, s));
        this.minimap.clear().rect(0, 0, 100, 100).fill({ color: 0x000, alpha: 0.5 }).stroke({ color: 0x00ff41, width: 1 });
        
        for (let i = 0; i < this.particleSprites.length; i++) {
            const ptr = i * STRIDE, s = this.particleSprites[i];
            if (this.particles[ptr+13] > 0) { s.visible = false; continue; }
            
            // Camera-style pan application (add pan BEFORE projection)
            let x = this.particles[ptr] + this.pan.x, y = this.particles[ptr+1] + this.pan.y, z = this.particles[ptr+2] + this.pan.z;
            
            if (isNaN(x)) { x=y=z=0; }
            const depth = this.focalLength + z;
            if (depth <= 10) { s.visible = false; continue; }
            s.visible = true;
            const pScale = this.focalLength / depth;
            s.x = cX + x * pScale * this.zoom; s.y = cY + y * pScale * this.zoom;
            const mass = this.particles[ptr+11];
            const size = Math.sqrt(mass) * 2 * this.worldConfig.baseSize * pScale * this.zoom;
            s.scale.set(size / 32);
            const r = Math.floor(this.particles[ptr+14]*255), g = Math.floor(this.particles[ptr+15]*255), b = Math.floor(this.particles[ptr+16]*255);
            s.tint = (r << 16) | (g << 8) | b;
            if (i % 20 === 0) this.minimap.rect(50 + this.particles[ptr]/(this.worldConfig.dimX/100), 50 + this.particles[ptr+1]/(this.worldConfig.dimY/100), 1, 1).fill(s.tint);
        }
        updateHUD(Math.round(this.app.ticker.fps), this.worldConfig.count, this.simStep);
    }

    renderEnvironment() {
        const g = this.envGraphics; g.clear();
        const W = this.worldConfig.dimX, H = this.worldConfig.dimY, D = this.worldConfig.dimZ;
        const cX = window.innerWidth / 2, cY = window.innerHeight / 2;
        const project = (px, py, pz) => {
            const x = px + this.pan.x, y = py + this.pan.y, z = pz + this.pan.z;
            const pScale = this.focalLength / (this.focalLength + z);
            return { x: cX + x * pScale * this.zoom, y: cY + y * pScale * this.zoom, visible: (this.focalLength + z) > 0 };
        };
        const corners = [];
        for (let i = 0; i < 8; i++) {
            corners.push(project((i & 1 ? 1 : -1) * W / 2, (i & 2 ? 1 : -1) * H / 2, (i & 4 ? 1 : -1) * D / 2));
        }
        const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
        edges.forEach(([a, b]) => {
            if (corners[a].visible && corners[b].visible) {
                g.moveTo(corners[a].x, corners[a].y).lineTo(corners[b].x, corners[b].y).stroke({ color: 0x444444, width: 1, alpha: 0.2 });
            }
        });
    }

    getFlattenedDNA(s) { 
        return { 
            force: s.dna[0],
            birth: s.dna[10],
            death: s.dna[11],
            resp: s.dna[13],
            pulse: s.dna[14],
            strength: s.dna[19],
            decay: s.dna[20],
            speed: s.dna[21],
            tuning: [s.dna[22], s.dna[23], s.dna[24], s.dna[25]],
            fusion: s.dna[9],
            fusionMomentum: s.dna[16],
            fusionTime: s.dna[17],
            baseRadius: s.dna[29] || 2.0,
            elasticity: s.dna[30] || 0.5,
            efficiency: s.dna[34] || 0.8
        }; 
    }
    setPlaybackMode(mode) { this.playbackMode = mode; this.paused = false; updatePlaybackUI(this.playbackMode, this.paused); }
    updateDNA(sIdx, rIdx, val) { if(this.species[sIdx]) this.species[sIdx].dna[rIdx] = parseFloat(val); }
    updateWorld(key, val) { this.worldConfig[key] = parseFloat(val); }
    updatePhysics(key, val) { this.laws[key] = parseFloat(val); }
    triggerSmartChaos() { this.species.forEach(s => { s.dna = s.dna.map((v, i) => Math.random() * (DNA_RANGES[i].max - DNA_RANGES[i].min) + DNA_RANGES[i].min); }); this.restartSim(); }
    toggleLaw(k) { this.laws[k] = !this.laws[k]; syncUI(this.laws); }
    togglePause() { this.paused = !this.paused; updatePlaybackUI(this.playbackMode, this.paused); }
    hardReset() { if(confirm("Hard reset?")) { localStorage.clear(); location.reload(); } }
    recenter() {
        const panel = document.getElementById('main-panel');
        let bottomOffset = 0; 
        if (panel && !panel.classList.contains('hidden')) bottomOffset = panel.offsetHeight;
        const targetCenterY = (window.innerHeight - bottomOffset) / 2;
        this.pan.y = (targetCenterY - (window.innerHeight / 2)) / this.zoom;
        this.pan.x = 0; this.pan.z = 0;
    }
}
const engine = new VepaEngine(); window.engine = engine;
