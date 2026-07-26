# Metaphysical Laws: A Practitioner's Guide

> **Category:** META | **Status:** Functional | **Slot:** Indices 48-63

## Overview

The 12 metaphysical (META) laws govern reality-manipulation within the VEPA simulation. These laws transcend conventional physics, enabling time dilation, teleportation, hive minds, and even astral projection. They require the `complexityLevel` to reach specific thresholds before becoming available.

## Law Reference

### TIME — Time Dilation (Index 48)
**Effect:** Modifies the local physics timestep (`dt`) based on particle velocity and local mass density.

```javascript
let localDt = isSet(LAW_INDEXES.TIME)
    ? dt * Math.max(0.1, Math.min(1.0, 
        Math.sqrt(posX² + posY² + posZ²) / 200))
    : dt;
```

High-velocity particles experience slower time. Dense regions create relativistic pockets. Synergizes with GRAV for black hole event horizon effects.

### DIME — Dimensionality (Index 49)
**Effect:** Allows particles to phase through spatial collisions.

When DIME is active, the collision law (`COLL`) is bypassed — particles pass through each other without momentum exchange. Creates ghost-like matter. Synergizes with SOUL for full spectral interactions.

### CHAO — Chaos (Index 50)
**Effect:** Amplifies stochastic entropy injection (5× jitter multiplier).

```javascript
const j = (entropy + dna_jitter) * (isSet(CHAO) ? 5.0 : 0.5);
ax += (prng()-0.5)*j;
```

Part of the Harmony cycling system (OFF → ORDER → CHAOS). Overrides ORDE when both are set.

### ORDE — Order (Index 51)
**Effect:** Dampens entropy, promoting structural rigidity. Reduces jitter forces and encourages particles to maintain stable positions.

Part of the Harmony cycling system. Mutually exclusive with CHAO at the UI level.

### FATE — Determinism (Index 52)
**Effect:** Locks particles into fixed trajectories. Once velocity is set, it cannot change except through collision. Creates ballistic, deterministic paths.

### WILL — Free Will (Index 53)
**Effect:** Spontaneous vector negation/reversal. Particles randomly invert their velocity vectors, creating chaotic, "unpredictable" behavior that cannot be anticipated.

### SOUL — Soul Persistence (Index 54)
**Effect:** Identity data retention across death cycles. Dead particles remain at `DEAD = 0.5` instead of `1.0`, allowing reincarnation:

```javascript
if (isSet(SOUL) && dead === 0.5 && prng.next() < 0.01 * dt) {
    dead = 0;  // Reincarnate
    energy = 50.0;
}
```

Synergizes with ASTR for full astral projection capabilities.

### MIND — Hive Mind (Index 55)
**Effect:** Global telepathic state synchronization. All particles of the same species share signal state instantaneously. Creates collective intelligence.

Synergizes with GLOW for emergent swarm behavior.

### TELE — Teleportation (Index 56)
**Effect:** Instantaneous spatial relocation at boundary edges. Instead of wrapping, particles jump to random coordinates. Breaks continuous space assumptions.

### CLAI — Clairvoyance (Index 57)
**Effect:** Proactive collision avoidance. Particles detect incoming collisions before they happen and adjust trajectories. Creates "omniscient" swarms.

### PREO — Precognition (Index 58)
**Effect:** Proactive evasion of high-density clusters. Particles calculate density gradients in advance and steer toward lower-density regions. Creates "scared matter."

### ASTR — Astral Projection (Index 59)
**Effect:** Ghost forms influence matter remotely. Requires SOUL to be active. Dead particles at `DEAD = 0.5` can still exert forces on living particles, creating poltergeist-like effects.

## Synergy Matrix

| Laws | Effect |
|------|--------|
| SOUL + ASTR | Dead particles become fully interactive ghosts |
| MIND + GLOW | Global signal synchronization across species |
| GRAV + TIME | Gravitational time dilation near massive bodies |
| FATE + WILL | Deterministic chaos — conflicting reality layers |
| TELE + WRAP | Random teleportation on boundary wrap |
| CHAO + TIME | Temporal chaos — stuttering time flow |

## Emergent States

- **Reality Fracture:** `FATE + WILL + CHAO` — Reality itself becomes inconsistent, with particles caught between deterministic and chaotic influences
- **Ghost Swarm:** `SOUL + ASTR + GLOW` — Luminescent ghost particles that drift through physical matter, creating haunting visual patterns
- **Omega Hive:** `MIND + TIME + TELE` — A hyper-intelligent swarm that perceives time differently and can relocate anywhere instantly
