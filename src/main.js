import * as PIXI from 'pixi.js';
import { DNA_META, DNA_RANGES } from './constants';
import { setupUI, updateHUD, syncUI, renderInsights, renderSuggestions, renderNarrative, updateTimelineUI, notifyNewProposal } from './ui';
import { InsightEngine } from './insightEngine';
import { NarrativeEngine } from './narrativeEngine';
import { TimelineEngine } from './timelineEngine';
import { LineageTracker } from './lineageTracker';
import { EmergentParamEngine } from './emergentParamEngine';
import { PersistenceEngine } from './persistenceEngine';

// STRIDE 18: 0:x, 1:y, 2:z, 3:vx, 4:vy, 5:vz, 6:phase, 7:s1, 8:s2, 9:s3, 10:s4, 11:mass, 12:id, 13:dead, 14:R, 15:G, 16:B, 17:timer
const STRIDE = 18;

class VepaEngine {
    constructor() {
        this.app = new PIXI.Application();
        this.paused = false;
        this.laws = { grav: true, life: false, drag: true, jitter: true, G: 0.15, dt: 1.0, dragCoeff: 0.993 };
        this.worldConfig = { 
            count: 5000, entropy: 0.5, spawnRate: 0.0, baseSize: 0.05, 
            dimX: 10000, dimY: 10000, dimZ: 10000,
            spreadX: 0.5, spreadY: 0.5, spreadZ: 0.5,
            shape: 0 
        };
        this.zoom = 1.0; this.pan = { x: 0, y: 0, z: 0 }; 
        this.particles = null;
        this.simVersion = 0;
        this.focalLength = 3000;
        this.workerBusy = false;
        this._lastInsightCheck = 0;

        this.lineageTracker = new LineageTracker();
        this.species = [this.createSpecies(null)];
        this.insightEngine = new InsightEngine(this);
        this.narrativeEngine = new NarrativeEngine();
        this.timelineEngine = new TimelineEngine(this, this.insightEngine);
        this.emergentEngine = new EmergentParamEngine(this);
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
    }

    createSpecies(parentId = null) {
        const dna = DNA_RANGES.map(r => r.default);
        const record = this.lineageTracker.createSpecies(dna, parentId);
        const h = record.id * 45;
        return { 
            id: record.id, 
            name: record.name,
            color: `hsl(${h}, 70%, 50%)`, 
            rgb: this.hslToRgb(h / 360, 0.7, 0.5), 
            dna: dna 
        };
    }
    addSpecies() { if (this.species.length < 8) this.species.push(this.createSpecies(null)); }
    hslToRgb(h, s, l) {
        let r, g, b; const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
        return [r, g, b];
    }

    async initPixi() {
        await this.app.init({ background: '#000', resizeTo: window });
        document.body.appendChild(this.app.canvas);
        this.world = new PIXI.Container();
        this.app.stage.addChild(this.world);
        this.texture = this.app.renderer.generateTexture(new PIXI.Graphics().circle(0, 0, 4).fill(0xffffff));
        this.particleSprites = [];
        this.minimap = new PIXI.Graphics();
        this.minimap.x = 20; this.minimap.y = window.innerHeight - 120;
        this.app.stage.addChild(this.minimap);
    }

    setupInteraction() {
        let activePointers = new Map();
        
        this.app.canvas.addEventListener('wheel', (e) => { 
            this.zoom *= Math.pow(0.999, e.deltaY); 
        }, { passive: true });

        this.app.canvas.addEventListener('pointerdown', e => { 
            activePointers.set(e.pointerId, { lastY: e.clientY }); 
        });

        window.addEventListener('pointerup', e => { 
            activePointers.delete(e.pointerId); 
        });

        window.addEventListener('pointermove', e => {
            const p = activePointers.get(e.pointerId);
            if (!p) return;

            const dy = e.clientY - p.lastY;

            if (activePointers.size === 1) {
                // One finger drag: Zoom (Z-Pan)
                this.pan.z += dy * 30; 
                this.pan.z = Math.max(-this.focalLength + 500, Math.min(this.focalLength * 5, this.pan.z));
            }

            p.lastY = e.clientY;
        });
    }

    restartSim() {
        this.simVersion++;
        this.workerBusy = false;
        const count = this.worldConfig.count;
        this.particles = new Float32Array(count * STRIDE);
        this.particleSprites.forEach(s => s.destroy()); this.particleSprites = [];
        const side = Math.ceil(Math.pow(count, 1/3));
        const W = this.worldConfig.dimX, H = this.worldConfig.dimY, D = this.worldConfig.dimZ;
        const sX = this.worldConfig.spreadX, sY = this.worldConfig.spreadY, sZ = this.worldConfig.spreadZ;
        for (let i = 0; i < count; i++) {
            const ptr = i * STRIDE, sprite = new PIXI.Sprite(this.texture);
            sprite.anchor.set(0.5); this.world.addChild(sprite); this.particleSprites.push(sprite);
            const gx = (i % side) / side - 0.5, gy = (Math.floor(i / side) % side) / side - 0.5, gz = Math.floor(i / (side * side)) / side - 0.5;
            const rx = Math.random() - 0.5, ry = Math.random() - 0.5, rz = Math.random() - 0.5, ent = this.worldConfig.entropy;
            let px = (gx * (1-ent) + rx * ent), py = (gy * (1-ent) + ry * ent), pz = (gz * (1-ent) + rz * ent);
            if (this.worldConfig.shape > 0) {
                const d = Math.sqrt(px*px+py*py+pz*pz);
                if(d > 0.001) { const morph = this.worldConfig.shape; const mag = d*(1-morph)+0.5*morph; px=(px/d)*mag; py=(py/d)*mag; pz=(pz/d)*mag; }
            }
            this.particles[ptr] = px*W*sX; this.particles[ptr+1] = py*H*sY; this.particles[ptr+2] = pz*D*sZ;
            this.particles[ptr+11] = 1.0 + Math.random();
            const sp = this.species[Math.floor(Math.random() * this.species.length)];
            this.particles[ptr+12] = sp.id; this.particles[ptr+13] = 0;
            this.particles[ptr+14] = sp.rgb[0]; this.particles[ptr+15] = sp.rgb[1]; this.particles[ptr+16] = sp.rgb[2];
        }
        this.worker.postMessage({ type: 'init', data: { particles: this.particles }, version: this.simVersion });
    }

    handleWorkerMessage(e) { 
        if (e.data.type === 'update' && e.data.version === this.simVersion) {
            this.particles = e.data.particles;
            this.workerBusy = false;
        }
    }

    update() {
        if (this.paused || !this.particles) return;
        if (!this.workerBusy) {
            this.workerBusy = true;
            this.worker.postMessage({ type: 'step', version: this.simVersion, config: { laws: this.laws, world: this.worldConfig, specDNA: this.species.map(s => this.getFlattenedDNA(s)) } });
        }

        this.minimap.clear().rect(0, 0, 100, 100).fill({ color: 0x000, alpha: 0.5 }).stroke({ color: 0x00ff41, width: 1 });
        let aliveCount = 0;
        const centerX = window.innerWidth/2, centerY = window.innerHeight/2;

        for (let i = 0; i < this.particleSprites.length; i++) {
            const ptr = i * STRIDE, s = this.particleSprites[i];
            if (this.particles[ptr+13] > 0) { s.visible = false; continue; }
            s.visible = true; aliveCount++;
            
            const x = this.particles[ptr] + this.pan.x, y = this.particles[ptr+1] + this.pan.y, z = this.particles[ptr+2] + this.pan.z;
            const pScale = this.focalLength / (this.focalLength + z);
            
            s.x = centerX + x * pScale * this.zoom;
            s.y = centerY + y * pScale * this.zoom;
            const sigSum = this.particles[ptr+7] + this.particles[ptr+8] + this.particles[ptr+9] + this.particles[ptr+10];
            s.scale.set((Math.sqrt(this.particles[ptr+11]) * this.worldConfig.baseSize + sigSum * 0.8) * pScale * this.zoom);
            s.alpha = Math.max(0.05, pScale * 0.5);

            const r = Math.floor(this.particles[ptr+14]*255), g = Math.floor(this.particles[ptr+15]*255), b = Math.floor(this.particles[ptr+16]*255);
            s.tint = (r << 16) | (g << 8) | b;
            if (i % 20 === 0) this.minimap.rect(50 + x/(this.worldConfig.dimX/100), 50 + y/(this.worldConfig.dimY/100), 1, 1).fill(s.tint);
        }

        if (performance.now() - this._lastInsightCheck > 1000) {
            this._lastInsightCheck = performance.now();
            const { insights, suggestions } = this.insightEngine.evaluate();
            renderInsights(insights);
            renderSuggestions(suggestions);
            
            const narrative = this.narrativeEngine.update(insights);
            if (narrative) renderNarrative(narrative);

            this.emergentEngine.ingest(insights);

            this.timelineEngine.capture();
            updateTimelineUI(this.timelineEngine.getTimeline().length - 1);
        }

        updateHUD(Math.round(this.app.ticker.FPS), aliveCount);
    }

    getFlattenedDNA(s) {
        const dnaCopy = [...s.dna];
        this.emergentEngine.applyMetaParams(dnaCopy);
        const d = dnaCopy;
        return { fusionMomentum: d[16], fusionTime: d[17], radius2: Math.pow(d[18], 2), pulse: d[14], strength: d[19], decay: d[20], speed: d[21], tuning: [d[22], d[23], d[24], d[25]] };
    }

    updateDNA(sIdx, rIdx, val, dId) { if(this.species[sIdx]) this.species[sIdx].dna[rIdx] = parseFloat(val); if (dId) document.getElementById(dId).innerText = val; }
    updateWorld(key, val, dId) { this.worldConfig[key] = parseFloat(val); if (dId) document.getElementById(dId).innerText = val; }
    updatePhysics(key, val, dId) { this.laws[key] = parseFloat(val); if (dId) document.getElementById(dId).innerText = val; }
    triggerSmartChaos() { this.species.forEach(s => { s.dna = s.dna.map((v, i) => Math.random() * (DNA_RANGES[i].max - DNA_RANGES[i].min) + DNA_RANGES[i].min); }); this.restartSim(); }
    toggleLaw(k) { this.laws[k] = !this.laws[k]; syncUI(this.laws); }
    togglePause() { this.paused = !this.paused; }
    hardReset() { location.reload(); }
}
const engine = new VepaEngine();
window.engine = engine;
