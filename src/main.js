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
        this.laws = { grav: true, drag: true, jitter: true, coll: true, accr: true, life: true, glow: false, G: 0.15, dt: 1.0 };
        this.worldConfig = { count: 2000, dimX: 2000, dimY: 2000, dimZ: 2000, spreadX: 1.0, spreadY: 1.0, spreadZ: 1.0, baseSize: 1.0 };
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
        this.selectedParticleIndex = -1;

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
        const specs = [];
        
        // Species 1: Sol (Yellow) - High attraction, High fusion, stable
        const s1 = this.createSpecies();
        s1.name = "Sol";
        s1.dna[0] = 0.5;   // Force (attraction)
        s1.dna[9] = 0.8;   // Fusion
        s1.dna[10] = 0.05; // Birth Rate
        s1.rgb = [1, 1, 0];
        s1.color = "rgb(255, 255, 0)";
        specs.push(s1);

        // Species 2: Aether (Blue) - Fluid, cloud-like, responsive
        const s2 = this.createSpecies();
        s2.name = "Aether";
        s2.dna[1] = 0.99;  // Viscosity (slick)
        s2.dna[3] = 0.2;   // Jitter
        s2.dna[13] = 1.5;  // Signal Resp
        s2.rgb = [0, 0.5, 1];
        s2.color = "rgb(0, 127, 255)";
        specs.push(s2);

        // Species 3: Void (Red) - Repulsive, chaotic, high turnover
        const s3 = this.createSpecies();
        s3.name = "Void";
        s3.dna[0] = -0.5;  // Force (repulsion)
        s3.dna[12] = 0.2;  // Mutation
        s3.dna[11] = 0.08; // Death Rate
        s3.rgb = [1, 0, 0];
        s3.color = "rgb(255, 0, 0)";
        specs.push(s3);

        return specs;
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
    activePointers.set(e.pointerId, { lastX: e.clientX, lastY: e.clientY, startX: e.clientX, startY: e.clientY, startTime: Date.now() }); 
    if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        initialDistance = Math.hypot(pts[0].lastX - pts[1].lastX, pts[0].lastY - pts[1].lastY);
        initialZoom = this.zoom;
    }
});

window.addEventListener('pointerup', e => { 
    const data = activePointers.get(e.pointerId);
    if (data && activePointers.size === 1) {
        const dx = e.clientX - data.startX;
        const dy = e.clientY - data.startY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const duration = Date.now() - data.startTime;
        if (dist < 5 && duration < 200) {
            this.selectParticleAt(e.clientX, e.clientY);
        }
    }
    activePointers.delete(e.pointerId); 
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
        
        const side = Math.ceil(Math.pow(count, 1/3));
        const spacingX = (W * sX) / side;
        const spacingY = (H * sY) / side;
        const spacingZ = (D * sZ) / side;

        for (let i = 0; i < count; i++) {
            const ptr = i * STRIDE, sprite = new PIXI.Sprite(this.texture);
            sprite.anchor.set(0.5); this.world.addChild(sprite); this.particleSprites.push(sprite);
            const spec = this.species[i % this.species.length];
            
            const gx = i % side;
            const gy = Math.floor(i / side) % side;
            const gz = Math.floor(i / (side * side));
            
            this.particles[ptr] = (gx - side/2) * spacingX;
            this.particles[ptr+1] = (gy - side/2) * spacingY;
            this.particles[ptr+2] = (gz - side/2) * spacingZ;
            
            this.particles[ptr+11] = 1.0; 
            this.particles[ptr+12] = spec.id; this.particles[ptr+13] = 0;
            this.particles[ptr+21] = spec.dna[4] || 0; 
            this.particles[ptr+22] = 100.0; 
            this.particles[ptr+23] = 0; 
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

    selectParticleAt(screenX, screenY) {
        if (!this.particles) return;
        const cX = window.innerWidth / 2, cY = window.innerHeight / 2;
        let nearestIdx = -1, minDist = 40; // 40px click radius

        for (let i = 0; i < this.worldConfig.count; i++) {
            const ptr = i * STRIDE;
            if (this.particles[ptr+13] > 0) continue; 

            let x = this.particles[ptr] + this.pan.x, y = this.particles[ptr+1] + this.pan.y, z = this.particles[ptr+2] + this.pan.z;
            const depth = this.focalLength + z;
            if (depth <= 10) continue;
            
            const pScale = this.focalLength / depth;
            const px = cX + x * pScale * this.zoom;
            const py = cY + y * pScale * this.zoom;

            const dist = Math.hypot(screenX - px, screenY - py);
            if (dist < minDist) {
                minDist = dist;
                nearestIdx = i;
            }
        }

        this.selectedParticleIndex = nearestIdx;
        const panel = document.getElementById('particle-info-panel');
        if (panel) {
            if (nearestIdx === -1) panel.classList.add('hidden');
            else panel.classList.remove('hidden');
        }
    }

    getParticleData(idx) {
        const ptr = idx * STRIDE;
        const speciesIdx = Math.floor(this.particles[ptr+12]);
        const spec = this.species[speciesIdx] || { name: 'Unknown' };
        return {
            id: idx,
            species: spec.name,
            mass: this.particles[ptr+11].toFixed(2),
            energy: this.particles[ptr+22].toFixed(1),
            age: Math.floor(this.particles[ptr+23]),
            vel: Math.hypot(this.particles[ptr+3], this.particles[ptr+4], this.particles[ptr+5]).toFixed(2),
            pos: { x: Math.round(this.particles[ptr]), y: Math.round(this.particles[ptr+1]), z: Math.round(this.particles[ptr+2]) }
        };
    }

    draw() {
        this.renderEnvironment();
        const cX = window.innerWidth/2, cY = window.innerHeight/2;
        const speciesMap = new Map(); this.species.forEach(s => speciesMap.set(s.id, s));
        this.minimap.clear().rect(0, 0, 100, 100).fill({ color: 0x000, alpha: 0.5 }).stroke({ color: 0x00ff41, width: 1 });
        
        for (let i = 0; i < this.particleSprites.length; i++) {
            const ptr = i * STRIDE, s = this.particleSprites[i];
            if (this.particles[ptr+13] > 0) { s.visible = false; continue; }
            
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
            
            // Highlight selected particle
            if (i === this.selectedParticleIndex) {
                s.alpha = 1.0;
                s.scale.set(size / 32 * 1.5);
                // Draw a small ring or something? (Simple: larger size)
            } else {
                s.alpha = 0.8;
            }

            const r = Math.floor(this.particles[ptr+14]*255), g = Math.floor(this.particles[ptr+15]*255), b = Math.floor(this.particles[ptr+16]*255);
            s.tint = (r << 16) | (g << 8) | b;
            if (i % 20 === 0) this.minimap.rect(50 + this.particles[ptr]/(this.worldConfig.dimX/100), 50 + this.particles[ptr+1]/(this.worldConfig.dimY/100), 1, 1).fill(s.tint);
        }
        
        if (this.selectedParticleIndex !== -1) {
            import('./ui.js').then(ui => ui.updateParticleHUD(this.getParticleData(this.selectedParticleIndex)));
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
            efficiency: s.dna[34] || 0.8,
            affinity: s.dna[41] || 0.0
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
