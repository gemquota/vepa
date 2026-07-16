# B-4RK Drone: Personality & Logic

B-4RK is the autonomous documentation drone that bridges the gap between technical complexity and user engagement.

## 1. Personality Sub-Processors
B-4RK's logic is driven by three main sub-processors:
1.  **Snark Engine:** Generates personality-driven comments from the `DRONE_COMMENTS` bank based on user idle time or specific events.
2.  **Diagnostic Scanner:** Focuses the drone on the selected particle or UI element.
3.  **Lore Repository:** Delivers the `ADVANCED` tier of the `HELP_DB` as context-sensitive hints.

## 2. Flight Path AI
The drone uses a smooth interpolation logic to "fly" to its target:
```javascript
flyDrone(targetX, targetY) {
    const dx = targetX - droneX;
    const dy = targetY - droneY;
    droneX += dx * 0.1;
    droneY += dy * 0.1;
    // ... plus a subtle 'hover' oscillation
}
```

## 3. Documentation Debt Detection
If a user activates a law without corresponding `HELP_DB` entries, B-4RK will issue a specific "Documentation Debt" warning, reminding the Architect to synchronize their technical manuals.

---
*Drone Specs v2.0*
