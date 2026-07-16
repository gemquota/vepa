# The Law Bitmask System (64-bit Physics)

> **Files:** `src/constants.js` (definitions), `src/main.js` (computeFlags), `src/worker/physics.worker.js` (isSet)

## Overview

VEPA's 64 world laws are encoded as a **bitmask pair** (`lowFlags` and `highFlags`), each a 32-bit integer. This allows O(1) law state checks in the physics worker without string comparisons or object lookups.

```
lowFlags (bits 0-31)         highFlags (bits 32-63)
┌─────────────────────────┐  ┌─────────────────────────┐
│ 0  GRAV  │ 8  BOND      │  │ 32 CATA  │ 48 TIME     │
│ 1  DRAG  │ 9  HEAT      │  │ 33 SOLV  │ 49 DIME     │
│ 2  ENTR  │ 10 COLD      │  │ 34 ACID  │ 50 CHAO     │
│ 3  WRAP  │ 11 CONV      │  │ 35 OXID  │ 51 ORDE     │
│ 4  COLL  │ 12 RADI      │  │ 36 REDU  │ 52 FATE     │
│ 5  ACCR  │ 13 SUBL      │  │ 37 POLY  │ 53 WILL     │
│ 6  PLANET│ 14 MELT      │  │ 38 ISOM  │ 54 SOUL     │
│ 7  VOID  │ 15 BOIL      │  │ 39 CHIR  │ 55 MIND     │
│          │               │  │ 40 CRYS  │ 56 TELE     │
│ 16 LIFE  │ 24 ENER      │  │ 41 ALLO  │ 57 CLAI     │
│ 17 GLOW  │ 25 RAD       │  │          │ 58 PREO     │
│ 18 AFFIN │ 26 COND      │  │          │ 59 ASTR     │
│ 19 REPRO │ 27 DEPO      │  │          │             │
│ 20 TRACK │ 28 EXOP      │  │          │             │
│ 21 SENESC│              │  │          │             │
│ 22 GENO  │              │  │          │             │
│ 23 PHENO │              │  │          │             │
└─────────────────────────┘  └─────────────────────────┘
```

## Flags Computation

In `main.js`, the `computeFlags()` method builds the bitmasks from the `this.laws` object:

```javascript
computeFlags() {
    this.lowFlags = 0;
    this.highFlags = 0;
    
    for (const [category, laws] of Object.entries(LAW_MAP)) {
        laws.forEach(lawKey => {
            const isActive = this.laws[category]?.[lawKey];
            if (isActive) {
                const bitIndex = LAW_INDEXES[lawKey.toUpperCase()];
                if (bitIndex < 32) {
                    this.lowFlags |= (1 << bitIndex);
                } else {
                    this.highFlags |= (1 << (bitIndex - 32));
                }
            }
        });
    }
}
```

## Worker-Side Check

The worker receives `lowFlags` and `highFlags` in the step config and uses the `isSet()` closure:

```javascript
const isSet = (idx) => {
    if (idx < 32) return (lowFlags & (1 << idx)) !== 0;
    return (highFlags & (1 << (idx - 32))) !== 0;
};

// Usage — O(1) check
if (isSet(LAW_INDEXES.GRAV)) {
    // Compute gravity...
}
```

## Synergy Bonus System

When certain law combinations are active, they modify energy tax rates:

```javascript
function computeSynergyBonus(lowFlags, highFlags) {
    let bonus = 0;
    if (isSet(MIND) && isSet(ENER)) bonus -= 2.0;  // Hive mind energy efficiency
    if (isSet(GRAV) && isSet(TIME)) bonus -= 1.5;  // Relativistic time dilation
    if (isSet(ENTR) && isSet(CRYS)) bonus -= 1.0;  // Thermal annealing
    if (isSet(COLL) && isSet(RAD))  bonus -= 0.5;   // Radiation pressure
    if (isSet(RAD) && isSet(GENO))  bonus -= 1.0;   // Radiation-induced mutation
    if (isSet(POLY) && isSet(MIND)) bonus -= 2.0;   // Collective polymerization
    if (isSet(ASTR) && isSet(SOUL)) bonus -= 1.5;   // Astral projection
    return bonus;
}
```

## Adding a New Law (SOP)

Per AGENTS.md section 10.4:

1. Add to `LAW_INDEXES` in `src/constants.js`
2. Add to `LAW_MAP` category array
3. Add `HELP_DB` entry with all 4 tiers
4. Add default state in `VepaEngine.laws` in `src/main.js`
5. Add logic in `physics.worker.js` using `isSet(LAW_INDEXES.YOUR_LAW)`
6. Register in `computeFlags()` in `src/main.js`
7. Add UI toggle in `src/ui.js`
8. Update `ENGINE_SSOT.md` and `docs/fullaudit.md`

## Performance

Bitmask operations are extremely fast:
- **Flag computation:** ~1μs per frame (64 bits shifts and ORs)
- **Worker check:** ~0.1ns per lookup (single bitwise AND)
- **Total overhead:** <1% of physics frame time

## Constraints

- **Maximum 64 laws** — limited by 64-bit integer representation
- **JavaScript bitwise ops work on 32-bit signed integers** — hence the low/high split
- **Law indices 0-31** go in `lowFlags`, **32-63** go in `highFlags`
