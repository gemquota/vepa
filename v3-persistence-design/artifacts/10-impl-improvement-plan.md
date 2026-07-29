# Implementation Improvement Plan

## P0 — Applied
| ID | Change | File |
|----|--------|------|
| IE1 | saveSnapshot is async. CRC32 sync, SHA-256 awaited. | saveManager.js, checksum.js |
| IE2 | loadSnapshot clones at parse time. Original untouched. | saveManager.js |
| IE3 | initWorker no longer references this. Pure promise. | workerProtocol.js |

## P1 — Applied
| ID | Change | File |
|----|--------|------|
| IE4 | tryAutoSave takes thunk (capture function), not snapshot. | saveManager.js, index.js |
| IP1 | Error messages rewritten user-friendly. | saveErrors.js |
| IP2 | getUndoInfo(), registerUndoShortcut() (Cmd+Z), undo events. | saveManager.js, index.js |

## P2 — Applied
| ID | Change | File |
|----|--------|------|
| IE5 | Label sanitization: max 128 chars, control chars stripped. | saveManager.js |
| IP3 | vepa:saveCompleted, vepa:saveFailed, vepa:undoAvailable events. | saveManager.js, index.js |
| IA2 | Adapter registration moved to explicit registerAdapters() call. | index.js |

## P3 — Deferred
| IA1 | Split VepaPersistence (god object) — deferred to integration phase. |
| IP5 | Default world naming — deferred to UI layer. |

---

*End.*
