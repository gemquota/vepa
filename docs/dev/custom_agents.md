# Building a Custom Sub-Agent

Developers can extend VEPA by building their own "Watcher" agents that respond to simulation events.

## 1. Agent Architecture
A sub-agent is a functional module that listens to the `VepaEngine` event stream.

## 2. Implementation Guide
1.  **Register:** Add your agent to the `system/integration.js` loader.
2.  **Listen:** Subscribe to relevant events (e.g., `sim:step`, `entity:death`).
3.  **Act:** Perform calculations and optionally emit commands back to the engine.

## 3. Boilerplate Code
```javascript
export class MyCustomAgent {
    constructor(engine) {
        this.engine = engine;
        this.engine.eventBus.on('sim:step', (data) => this.think(data));
    }

    think(data) {
        if (data.activeParticles < 100) {
            this.engine.emit('cmd:smartChaos');
        }
    }
}
```

---
*Dev Manual v1.0*
