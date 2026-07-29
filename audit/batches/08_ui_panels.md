# Audit Batch 8: UI Panels

## Panels: HUD, Law Panel, DNA Panel, Species Panel, Preset Panel, Narrative Panel, World Panel

### Panel Status

| Panel | Component | Exists | Wired in ui.js | Renders | Issues |
|-------|-----------|--------|---------------|---------|--------|
| HUD | hud.js | ✓ | ✓ | ✓ | FPS counter has own RAF — shows FPS even when physics crashes |
| Law Panel | lawPanel.js | ✓ | ✓ | ✓ | Multi-state laws (WRAP=4) don't have proper value tracking |
| DNA Panel | dnaPanel.js | ✓ | ✓ | ✓ | Species selector renders, sliders work |
| Species Panel | speciesPanel.js | ✓ NEW | ✓ | ✓ | Shows basic cards with swatches and trait summaries |
| Preset Panel | presetPanel.js | ✓ | ✓ | Check | LocalStorage save/load |
| Narrative Panel | narrativePanel.js | ✓ | ✓ | ✓ | Log display for narrative events |
| World Panel | — | ✗ MISSING | ✗ | — | No world panel component exists |

### HUD Details

```
Subscribes to: physics:tick, stats:update
Displays: FPS, particle count, species count, tick number
FPS: Has own requestAnimationFrame loop (independent of render loop)
Particle count: Reads from physics:tick event payload
```

### Law Panel Details

```
Category sections: Physics, Biology, Chemistry, Thermodynamics, Metaphysics
Multi-state: WRAP cycles 0-3 (but value not persisted in law state — only on/off)
Toggle: Binary on/off for single-state laws
Color coding: BLUE, GREEN, PURPLE, ORANGE, RED
law:sync event: Updates visual state from external changes
```

### DNA Panel Details

```
Species selector: 64 dots, first 5 colored by species
Sliders grouped: Motion, Matter, Electromagnetism, Biology, Communication
Slider events: emit dna:changed with species, param, value
Sync: dna:sync event refreshes display
```

### Species Panel Details

```
NEW in this iteration
Shows species cards with: color swatch, name, index, trait summaries
Traits shown: Force, Viscosity, Birth Rate, Mutation, Predation, Energy Eff
No per-species population count (needs engine integration)
No inline DNA editing (redirects to DNA panel tab)
```

### Issues

- No World Panel component exists for `#world-panel`
- Narrative Panel may not receive events if narrative engine is not wired
- Species panel shows static profiles — no live particle counts
- Preset panel save/load may not properly restore all state
