# Thermodynamics & Phase Transitions

> **Category:** THERMO | **Status:** Functional | **Slots:** Indices 9-15, 26-28

## Overview

The thermodynamic law group governs energy flow, phase transitions, and climate effects within VEPA. These laws create macroscopic weather patterns, phase-change cycles, and thermal feedback loops.

## Thermal Cycling System

The HEAT/COLD/thermal laws operate on a 3-state cycling toggle (None → HEAT → COLD):

```
State 0 (OFF):   No thermal effects
State 1 (HEAT):  Upward thermal drift + entropy
State 2 (COLD):  Motion dampening + condensation
```

## Law Reference

### HEAT — Thermal Updraft (Index 9)
**Effect:** Applies upward velocity bias proportional to particle temperature. Creates convection columns.

```javascript
if (isSet(HEAT)) {
    particles[ptr+4] += (0.05 * temp * dt); // ay += heat_lift
}
```

### COLD — Thermal Damping (Index 10)
**Effect:** Reduces particle kinetic energy globally. Creates sinking cold fronts.

### CONV — Convection (Index 11)
**Effect:** Creates cyclic vertical flow loops. Particles rise when hot, sink when cool, producing Rayleigh-Bénard convection cells:

```
    ┌─────────────────────────────────────┐
    │  ↓     ↑     ↓     ↑     ↓     ↑   │  Cold sinking
    │  ↓  🔥 ↑  🔥 ↓  🔥 ↑  🔥 ↓  🔥 ↑  │  Hot rising
    │  ↓     ↑     ↓     ↑     ↓     ↑   │
    └─────────────────────────────────────┘
```

### RADI — Radiation (Index 12)
**Effect:** High-energy particles push others away and lose mass. Creates stellar wind effects. Synergizes with COLL for radiation pressure.

### SUBL — Sublimation (Index 13)
**Effect:** Instant solid-to-gas phase dispersion. Particles with high mass and low energy suddenly disperse into many low-mass, high-velocity particles.

### MELT — Melting (Index 14)
**Effect:** Bond degradation in high-energy/density zones. Particle stiffness decreases when energy exceeds a threshold, causing rigid structures to collapse into fluid.

```javascript
if (isSet(MELT) && particle.energy > dna.reactionThreshold) {
    particle.stiffness *= 0.95;  // Gradual structural melting
}
```

### BOIL — Boiling (Index 15)
**Effect:** Explosive volume expansion at energy thresholds. When particle energy exceeds `Reaction Threshold`, it experiences a rapid outward velocity burst.

### COND — Condensation (Index 26)
**Effect:** Increased attraction in low-energy zones. Slowing particles cluster together more tightly, forming liquid-like droplets.

### DEPO — Deposition (Index 27)
**Effect:** Instant gas-to-solid phase transition. Low-energy, low-mass particles instantly gain mass and stiffness, forming solid deposits.

### EXOP — Exothermic (Index 28)
**Effect:** Systemic heat release during interactions. Collisions release energy into neighboring particles, creating thermal chain reactions.

## Phase State Diagram

```
                    ┌──────────┐
     ┌──────────────│  SOLID   │◄──────────────┐
     │  MELT        │          │  DEPO          │
     │  (high E)    └────┬─────┘  (low E)      │
     │                   │                      │
     ▼                   ▼                      │
  ┌──────┐          ┌────────┐                  │
  │LIQUID│◄────────►│  GAS   │                  │
  │      │  BOIL    │        │                  │
  └──────┘  (high E)└────────┘                  │
     │                   │                      │
     │                   ▼                      │
     │              ┌──────────┐                │
     └──────────────│ PLASMA   │────────────────┘
        SUBL        │ (high E) │
                    └──────────┘
```

## DNA Interactions

| DNA Parameter | Index | Effect on Thermodynamics |
|--------------|-------|--------------------------|
| `Heat Output` | 39 | Determines energy released per interaction |
| `Phase Temp` | 49 | Threshold at which phase transitions trigger |
| `Reaction Threshold` | 37 | Mass/energy limit for phase change |
| `Catalysis` | 38 | Multiplier for reaction speed |
| `Conductivity` | 32 | Rate of thermal energy transfer between particles |

## Emergent Behaviors

- **Thermal Runaway:** HEAT + EXOP creates a feedback loop where collisions generate more heat, which amplifies collisions
- **Weather Fronts:** HEAT + COLD + CONV creates stable atmospheric circulation patterns
- **Volcanic Eruptions:** MELT + BOIL + EXOP — particles melt, then explosively expand, then heat their neighbors
- **Ice Ages:** COLD + COND + DEPO — progressive freezing of the simulation from cold zones outward
- **Stellar Nucleosynthesis:** GRAV + HEAT + RADI + EXOP — gravitational collapse generates heat, triggering fusion and radiation pressure
