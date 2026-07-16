# Intelligence Engine Integration

VEPA's "Intelligence" is distributed across three decoupled engines that communicate via a central event bus.

## 1. Insight Engine
*   **Role:** Analyzes the physical state (SAB) for patterns.
*   **Outputs:** Clusters, "Interestingness" scores, and thermodynamic stability alerts.

## 2. Goal Engine
*   **Role:** Auto-adjusts parameters to maintain sim stability.
*   **Outputs:** World constant shifts (G, dt) and adaptive metabolic taxes.

## 3. Narrative Consciousness
*   **Role:** Translates data into story.
*   **Outputs:** Internal monologue logs (Observer, Dissolver, etc.) that provide a narrative layer to the raw physics.

## 4. The Intelligence Bus
All three engines hook into the `eventBus.js`:
```javascript
eventBus.on('state:update', (sab) => {
    insightEngine.analyze(sab);
});
eventBus.on('insight:discovery', (data) => {
    narrativeEngine.comment(data);
});
```

---
*Dev Manual v1.0*
