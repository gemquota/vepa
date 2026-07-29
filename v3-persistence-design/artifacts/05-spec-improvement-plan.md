# Specification Improvement Plan

## P0 (Must fix before implementation)
| ID | Finding | Source | Change |
|----|---------|--------|--------|
| A1 | Engine internals in save format | Architect | Per-engine serialization adapters (DTOs) |
| A3 | Selective loading undermines consistency | Architect | Two modes: Restore vs Remix with warning |
| E1 | Float64Array wrong type | Engineer | Float32Array; clarify serialization |
| E2 | Worker init incomplete | Engineer | init_ack protocol; render loop waits |
| E7 | No error handling | Engineer | Formal SaveError codes + messages |
| P1 | "Slots" not "worlds" | Player | World Timeline with snapshot entries |

## P1 (After P0)
| ID | Finding | Change |
|----|---------|--------|
| A2 | Graveyard wrong layer | GraveyardEngine as first-class engine |
| A4 | Migration no rollback | Atomic migration on clone |
| E3 | Auto-save frame drops | requestIdleCallback; 30s throttle |
| E6 | Graveyard memory bound | Fixed-size 50-entry ring buffer |
| P3 | Auto-save discoverability | Subtle indicator + resume banner |
| P4 | Timeline story view | Insight log persisted + displayed |
| P5 | Undo UI | Undo banner + Cmd+Z |

## P2 (Stretch)
| ID | Finding | Change |
|----|---------|--------|
| E4 | Checksum cost | Two-tier CRC32/SHA-256 |
| E5 | Migration ordering | Map keyed by "from->to" |
| P6 | Graveyard as mechanic | HUD count + reanimation |
| P7 | World discovery | Gallery view |
