# Review: Architect Perspective

**Focus:** Structural integrity, boundaries, coupling, data flow

## Finding 1: Save format couples engine internals to storage (High)
The `engines` field embeds internal state representations directly. If any engine's internals change, the save format must bump and a migration must be written.

**Recommendation:** Define serialization adapters (DTOs) per engine. Storage holds DTOs, not engine internals.

## Finding 2: Graveyard lives in wrong layer (Medium)
Lifecycle is split across Worker (death detection), main thread (buffer management), and SaveManager (serialization).

**Recommendation:** Make GraveyardEngine a first-class engine with its own event subscription.

## Finding 3: Selective loading undermines state consistency (High)
Loading partial state creates synthetic states impossible in the original simulation.

**Recommendation:** Two load modes: "Restore" (exact) and "Remix" (synthetic, with warning).

## Finding 4: Migration has no rollback (Medium)
If migration fails partway, the save is corrupted with no recovery path.

**Recommendation:** Atomic migration on a deep clone. Original untouched.

## Finding 5: Event Bus wiring overhead (Low)
Returning individual handler references from wireSystem() is fragile.

**Recommendation:** Namespace-based registration for group teardown.
