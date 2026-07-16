import { LAW_DATA } from './synergyData.js';

export class LawSynergyGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.selectedNode = null;
        this.hoverNode = null;
        this.width = 800;
        this.height = 600;
        this.physicsSteps = 200; // Initial steps to stabilize layout
    }

    init() {
        if (!this.canvas) return;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Initialize nodes with random positions
        LAW_DATA.forEach((data) => {
            this.nodes.push({
                ...data,
                x: (this.width / 2) + (Math.random() - 0.5) * 400,
                y: (this.height / 2) + (Math.random() - 0.5) * 300,
                vx: 0, vy: 0,
                radius: 20,
                color: this.getCategoryColor(data.category)
            });
        });

        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));

        this.animate();
    }

    getCategoryColor(cat) {
        switch(cat) {
            case 'PHYSICS': return '#cc2424';
            case 'THERMO': return '#ff9500';
            case 'BIOLOGY': return '#00ff88';
            case 'CHEMISTRY': return '#ff00ff';
            case 'METAPHYSICS': return '#00d2ff';
            default: return '#ffffff';
        }
    }

    resize() {
        const parent = this.canvas.parentElement;
        if (!parent) return;
        this.width = parent.clientWidth || window.innerWidth || 800;
        this.height = parent.clientHeight || window.innerHeight || 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.hoverNode = null;
        for (const node of this.nodes) {
            const d = Math.hypot(node.x - x, node.y - y);
            if (d < node.radius + 5) {
                this.hoverNode = node;
                break;
            }
        }
    }

    handleMouseDown(e) {
        if (this.hoverNode) {
            this.selectedNode = this.hoverNode;
            this.dispatchSelectEvent(this.selectedNode);
        } else {
            // Check if we clicked the overlay
            const details = document.getElementById('synergy-details');
            const rect = details.getBoundingClientRect();
            const x = e.clientX, y = e.clientY;
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                return; // Click inside overlay, do nothing
            }
            this.selectedNode = null;
            this.dispatchSelectEvent(null);
        }
    }

    dispatchSelectEvent(node) {
        window.dispatchEvent(new CustomEvent('synergy-select', { detail: node }));
    }

    animate() {
        this.updatePhysics();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    updatePhysics() {
        const k = 0.05; // Spring constant
        const repulsion = 1500;
        const centerGravity = 0.01;

        for (let i = 0; i < this.nodes.length; i++) {
            const n1 = this.nodes[i];
            
            // 1. Repulsion from all other nodes
            for (let j = 0; j < this.nodes.length; j++) {
                if (i === j) continue;
                const n2 = this.nodes[j];
                const dx = n1.x - n2.x;
                const dy = n1.y - n2.y;
                const d2 = dx*dx + dy*dy + 1;
                const force = repulsion / d2;
                n1.vx += (dx / Math.sqrt(d2)) * force;
                n1.vy += (dy / Math.sqrt(d2)) * force;
            }

            // 2. Attraction to links (synergies)
            n1.synergies.forEach(syn => {
                syn.with.forEach(id => {
                    const n2 = this.nodes.find(n => n.id === id);
                    if (n2) {
                        const dx = n2.x - n1.x;
                        const dy = n2.y - n1.y;
                        const d = Math.hypot(dx, dy);
                        n1.vx += dx * k;
                        n1.vy += dy * k;
                    }
                });
            });

            // 3. Center Gravity
            n1.vx += (this.width / 2 - n1.x) * centerGravity;
            n1.vy += (this.height / 2 - n1.y) * centerGravity;

            // Damping
            n1.vx *= 0.9;
            n1.vy *= 0.9;
        }

        // Apply velocities
        this.nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            // Bound clamping
            n.x = Math.max(20, Math.min(this.width - 20, n.x));
            n.y = Math.max(20, Math.min(this.height - 20, n.y));
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Links
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);
        this.nodes.forEach(n1 => {
            n1.synergies.forEach(syn => {
                syn.with.forEach(id => {
                    const n2 = this.nodes.find(n => n.id === id);
                    if (n2) {
                        const isMain = this.selectedNode === n1 || this.selectedNode === n2;
                        this.ctx.globalAlpha = isMain ? 0.6 : 0.1;
                        this.ctx.strokeStyle = isMain ? '#cc2424' : '#333';
                        this.ctx.beginPath();
                        this.ctx.moveTo(n1.x, n1.y);
                        this.ctx.lineTo(n2.x, n2.y);
                        this.ctx.stroke();
                    }
                });
            });
        });
        this.ctx.setLineDash([]);
        this.ctx.globalAlpha = 1.0;

        // Nodes
        this.nodes.forEach(node => {
            const isSelected = this.selectedNode === node;
            const isHovered = this.hoverNode === node;

            if (isSelected) {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(204, 36, 36, 0.2)';
                this.ctx.fill();
            }

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = isHovered ? node.color : '#000';
            this.ctx.fill();
            this.ctx.strokeStyle = isSelected ? '#fff' : node.color;
            this.ctx.lineWidth = isSelected ? 3 : 1.5;
            this.ctx.stroke();

            this.ctx.fillStyle = isHovered ? '#000' : '#fff';
            this.ctx.font = 'bold 8px "JetBrains Mono"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(node.id, node.x, node.y + 3);
        });
    }
}
