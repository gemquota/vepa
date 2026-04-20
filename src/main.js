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

// STRIDE 21: 0:x, 1:y, 2:z, 3:vx, 4:vy, 5:vz, 6:phase, 7:s1, 8:s2, 9:s3, 10:s4, 11:mass, 12:id, 13:dead, 14:R, 15:G, 16:B, 17:timer, 18:wx, 19:wy, 20:wz
const STRIDE = 21;

class VepaEngine {
    constructor() {
        this.app = new PIXI.Application();
        this.paused = false;
        // Expanded Laws (8 Total)
        this.laws = { 
            grav: true, life: false, drag: true, jitter: true,
            glow: true, wrap: false, coll: true, accr: true,
            G: 0.15, dt: 1.0, dragCoeff: 0.993 
        };
        this.worldConfig = { 
            count: 2000, entropy: 0.1, spawnRate: 0.05, 
            dimX: 4000, dimY: 4000, dimZ: 2000, 
            spreadX: 0.8, spreadY: 0.8, spreadZ: 0.5,
            baseSize: 0.05, shape: 0.1
        };
        this.zoom = 1.0; this.pan = { x: 0, y: 0, z: 0 }; 
        this.particles = null;
        this.simVersion = 0;
        this.focalLength = 3000;
        this.workerBusy = false;
        this._lastInsightCheck = 0;
        this.playbackMode = 'forward';
        this.complexityLevel = 0;
        this.simAge = 0;

        this.lineageTracker = new LineageTracker();
        
        // Initialize with 3 sets of primary/opposite color species
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
        const pairs = [
            { pos: [1, 0, 0], neg: [0, 1, 1], name: 'RED/CYAN' },
            { pos: [0, 1, 0], neg: [1, 0, 1], name: 'GREEN/MAGENTA' },
            { pos: [0, 0, 1], neg: [1, 1, 0], name: 'BLUE/YELLOW' }
        ];
        const spec = [];
        pairs.forEach((p, i) => {
            const s1 = this.createSpecies();
            s1.name = p.name + "_POS"; s1.dna[4] = 1.0; s1.rgb = p.pos;
            s1.color = `rgb(${p.pos[0]*255},${p.pos[1]*255},${p.pos[2]*255})`;
            spec.push(s1);

            const s2 = this.createSpecies();
            s2.name = p.name + "_NEG"; s2.dna[4] = -1.0; s2.rgb = p.neg;
            s2.color = `rgb(${p.neg[0]*255},${p.neg[1]*255},${p.neg[2]*255})`;
            spec.push(s2);
        });
        return spec;
    }

    createSpecies(parentId = null) {
        const dna = DNA_RANGES.map(r => r.default);
        // By design, some parameters like pulse rate should be zero if they do nothing
        dna[14] = 0; // Pulse Rate default 0
        dna[13] = 0; // Signal Resp default 0
        
        const record = this.lineageTracker.createSpecies(dna, parentId);
        return { 
            id: record.id, name: record.name, dna, color: null, rgb: null 
        };
    }

    addSpecies() { 
        if (this.species.length < 12) {
            this.species.push(this.createSpecies(null)); 
            renderSpeciesList(this);
        }
    }

    async initPixi() {
        await this.app.init({ background: '#000', resizeTo: window });
        document.body.appendChild(this.app.canvas);
        this.world = new PIXI.Container();
        this.app.stage.addChild(this.world);

        // Higher resolution base texture to reduce initial pixellation
        const g = new PIXI.Graphics();
        g.circle(0, 0, 32).fill({ color: 0xffffff });
        this.texture = this.app.renderer.generateTexture(g);

        this.particleSprites = [];
        this.minimap = new PIXI.Graphics();
        this.minimap.x = 20; this.minimap.y = window.innerHeight - 120;
        this.app.stage.addChild(this.minimap);
    }

    setupInteraction() {
        let activePointers = new Map(), initialDistance = 0, initialZoom = 1.0;
        this.app.canvas.addEventListener('wheel', (e) => { this.zoom *= Math.pow(0.999, e.deltaY); this.applyLimits(); }, { passive: true });
        this.app.canvas.addEventListener('pointerdown', e => { 
            activePointers.set(e.pointerId, { lastX: e.clientX, lastY: e.clientY }); 
            if (activePointers.size === 2) {
                const pts = Array.from(activePointers.values());
                initialDistance = Math.hypot(pts[0].lastX - pts[1].lastX, pts[0].lastY - pts[1].lastY);
                initialZoom = this.zoom;
            }
        });
        window.addEventListener('pointerup', e => { activePointers.delete(e.pointerId); if (activePointers.size < 2) initialDistance = 0; });
        window.addEventListener('pointermove', e => {
            const p = activePointers.get(e.pointerId); if (!p) return;
            const dx = e.clientX - p.lastX, dy = e.clientY - p.lastY;
            if (activePointers.size === 1) {
                const sensitivity = Math.max(0.05, this.zoom);
                this.pan.x += dx / sensitivity; this.pan.y += dy / sensitivity;
            } else if (activePointers.size === 2) {
                p.lastX = e.clientX; p.lastY = e.clientY;
                const pts = Array.from(activePointers.values());
                const dist = Math.hypot(pts[0].lastX - pts[1].lastX, pts[0].lastY - pts[1].lastY);
                if (initialDistance > 0) this.zoom = initialZoom * (dist / initialDistance);
            }
            this.applyLimits(); p.lastX = e.clientX; p.lastY = e.clientY;
        });
    }

    applyLimits() {
        const minZoom = 0.005; this.zoom = Math.max(minZoom, Math.min(500, this.zoom));
        const limitX = this.worldConfig.dimX * 1.5; const limitY = this.worldConfig.dimY * 1.5;
        this.pan.x = Math.max(-limitX, Math.min(limitX, this.pan.x));
        this.pan.y = Math.max(-limitY, Math.min(limitY, this.pan.y));
    }

    restartSim() {
        this.simVersion++; this.workerBusy = false;
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
            this.particles[ptr+18] = this.particles[ptr+19] = this.particles[ptr+20] = 0; // Rotation

            // Polarity-based default coloration
            let rgb = spec.rgb;
            if (!rgb) {
                const pol = spec.dna[4]; // C1
                if (pol > 0.05) rgb = [0.1, 1.0, 0.3];
                else if (pol < -0.05) rgb = [0.8, 0.2, 1.0];
                else rgb = [0.6, 0.6, 0.6];
            }
            this.particles[ptr+14] = rgb[0]; this.particles[ptr+15] = rgb[1]; this.particles[ptr+16] = rgb[2];
        }
        this.worker.postMessage({ type: 'init', data: { particles: this.particles }, version: this.simVersion });
    }

    handleWorkerMessage(e) { 
        if (e.data.version !== this.simVersion) return;
        if (e.data.type === 'update') { 
            this.particles = e.data.particles; 
            this.workerBusy = false; 
        } else if (e.data.type === 'error') {
            console.error("Worker error:", e.data.error);
            this.workerBusy = false;
        }
    }

    update() {
        if (this.paused || !this.particles) return;
        if (this.playbackMode === 'reverse' || this.playbackMode === 'rewind') {
            const step = this.playbackMode === 'rewind' ? 5 : 1, slider = document.getElementById('timeline-slider');
            if (slider) {
                const newVal = Math.max(0, parseInt(slider.value) - step); slider.value = newVal;
                this.timelineEngine.restore(newVal); document.getElementById('timeline-label').innerText = 'REPLAY: ' + newVal;
                if (newVal === 0) {
                    this.paused = true;
                    updatePlaybackUI(this.playbackMode, this.paused);
                }
            }
        } else {
            this.simAge++;
            this.checkComplexityUnlock();
            if (!this.workerBusy) {
                this.workerBusy = true;
                this.worker.postMessage({ type: 'step', version: this.simVersion, config: { laws: this.laws, world: this.worldConfig, specDNA: this.species.map(s => this.getFlattenedDNA(s)) } });
                this._workerLastSent = performance.now();
            } else if (performance.now() - this._workerLastSent > 5000) {
                // Emergency reset if worker is silent for 5 seconds
                console.warn("Worker timeout - resetting busy state");
                this.workerBusy = false;
            }
        }
        this.minimap.clear().rect(0, 0, 100, 100).fill({ color: 0x000, alpha: 0.5 }).stroke({ color: 0x00ff41, width: 1 });
        let aliveCount = 0; const cX = window.innerWidth/2, cY = window.innerHeight/2;
        for (let i = 0; i < this.particleSprites.length; i++) {
            const ptr = i * STRIDE, s = this.particleSprites[i];
            if (this.particles[ptr+13] > 0) { s.visible = false; continue; }
            s.visible = true; aliveCount++;
            
            const x = this.particles[ptr] + this.pan.x, y = this.particles[ptr+1] + this.pan.y, z = this.particles[ptr+2] + this.pan.z;
            const pScale = this.focalLength / (this.focalLength + z);
            s.x = cX + x * pScale * this.zoom; s.y = cY + y * pScale * this.zoom;
            
            const mass = this.particles[ptr+11];
            const sigSum = this.particles[ptr+7] + this.particles[ptr+8] + this.particles[ptr+9] + this.particles[ptr+10];
            const baseSize = (Math.sqrt(mass) * this.worldConfig.baseSize + sigSum * 0.8) * pScale * this.zoom;
            
            // CENTRIFUGAL SQUISH
            const wx = this.particles[ptr+18], wy = this.particles[ptr+19], wz = this.particles[ptr+20];
            const w2 = wx*wx + wy*wy + wz*wz;
            const spec = this.species.find(sp => sp.id === this.particles[ptr+12]) || this.species[0];
            const stiffness = spec.dna[8] || 1.0;
            const squishAmount = Math.min(0.5, (w2 * 0.0000005) / (stiffness + 0.1));
            
            // Scale and rotate to match spin vector (simplified projection)
            s.scale.x = (baseSize / 32) * (1.0 + squishAmount);
            s.scale.y = (baseSize / 32) * (1.0 - squishAmount);
            
            // Texture scale correction (since base texture is 64px wide, radius 32)
            // Already handled by /32

            if (w2 > 0.0001) {
                s.rotation = Math.atan2(wy, wx) + (this.simAge * wz * 0.01); 
            }

            s.alpha = Math.max(0.05, pScale * 0.5);
            const r = Math.floor(this.particles[ptr+14]*255), g = Math.floor(this.particles[ptr+15]*255), b = Math.floor(this.particles[ptr+16]*255);
            s.tint = (r << 16) | (g << 8) | b;

            // Promotion to graphics for very large bodies
            if (mass > 1000 && !s._isPlanet) {
                this.promoteToPlanet(i);
            }
            
            if (i % 20 === 0) this.minimap.rect(50 + x/(this.worldConfig.dimX/100), 50 + y/(this.worldConfig.dimY/100), 1, 1).fill(s.tint);
        }
        if (performance.now() - this._lastInsightCheck > 1000) {
            this._lastInsightCheck = performance.now(); 
            const { insights, suggestions } = this.insightEngine.evaluate();
            renderInsights(insights); 
            renderSuggestions(suggestions);
            
            this.goalSystem.evaluate(insights);
            this.goalSystem.applyGoalInfluence();
            this.personality.updateFromEvent(insights, this.goalSystem);
            this.personality.decayAndDrift();
            
            this.narrativeConsciousness.ingest(insights, this.goalSystem);
            const multiVoiceNarrative = this.narrativeConsciousness.generateNarrative(insights, this.goalSystem);
            if (multiVoiceNarrative) renderNarrative(multiVoiceNarrative);

            this.emergentEngine.ingest(insights); 
            this.timelineEngine.capture(); 
            updateTimelineUI(this.timelineEngine.getTimeline().length - 1);
        }
        updateHUD(Math.round(this.app.ticker.fps), aliveCount);
    }

    promoteToPlanet(idx) {
        const oldSprite = this.particleSprites[idx];
        const planet = new PIXI.Graphics();
        // Draw a shaded sphere-like object with better detail
        planet.circle(0, 0, 32)
              .fill({ color: 0xffffff, alpha: 1.0 });
        
        // Add a "core" for better depth
        planet.circle(0, 0, 24).fill({ color: 0xffffff, alpha: 0.1 });
        
        // Static highlight for 3D feel
        const highlight = new PIXI.Graphics();
        highlight.ellipse(-8, -8, 12, 8).fill({ color: 0xffffff, alpha: 0.4 });
        planet.addChild(highlight);
        
        planet.x = oldSprite.x; planet.y = oldSprite.y;
        planet.scale.set(oldSprite.scale.x, oldSprite.scale.y);
        planet.tint = oldSprite.tint;
        planet._isPlanet = true;
        
        this.world.removeChild(oldSprite);
        this.world.addChild(planet);
        this.particleSprites[idx] = planet;
        oldSprite.destroy();
    }

    checkComplexityUnlock() {
        const milestones = [500, 1500, 3000];
        if (this.complexityLevel < milestones.length && this.simAge >= milestones[this.complexityLevel]) {
            this.complexityLevel++;
            renderNarrative(`COMPLEXITY LEVEL ${this.complexityLevel} REACHED: New parameters unlocked.`);
            renderWorldAccordion(this);
            renderDNAAccordion(this);
            this.persistence.save(this);
        }
    }

    getFlattenedDNA(s) {
        const dnaCopy = [...s.dna]; this.emergentEngine.applyMetaParams(dnaCopy); const d = dnaCopy;
        return { fusionMomentum: d[16], fusionTime: d[17], radius2: Math.pow(d[18], 2), pulse: d[14], strength: d[19], decay: d[20], speed: d[21], tuning: [d[22], d[23], d[24], d[25]] };
    }

    setPlaybackMode(mode) {
        this.playbackMode = mode; this.paused = false;
        this.laws.dt = (mode === 'fastforward') ? 4.0 : 1.0;
        updatePlaybackUI(this.playbackMode, this.paused);
    }

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
    }
}
const engine = new VepaEngine(); window.engine = engine;
