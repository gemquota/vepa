# VEPA Multiplayer — Protocol Proof of Concept (zero deps)

Reference implementation of the snapshot codec from
[`docs/multiplayer/PROTOCOL.md`](../../docs/multiplayer/PROTOCOL.md).

| File | Purpose |
|---|---|
| `codec.js` | Binary encode/decode of FULL/DELTA snapshots + quantization + guest-side apply |
| `roundtrip-demo.js` | Builds a fake 1250-particle world, host-encodes, guest-decodes/applies, verifies parity + error bounds, prints per-rate bandwidth |
| `bandwidth-sim.js` | Bandwidth table for realistic populations × rates × guest counts vs a 5 MB/s hotspot |

```bash
node v4/net-poc/roundtrip-demo.js
node v4/net-poc/bandwidth-sim.js
```

Expected (as of this branch):

- 1250 alive ≈ 21.2 KB/snapshot; encode ~3–4 ms, decode ~8–10 ms, apply ~1.7 ms (laptop; phone-class ~2–3×).
- Default world @ 30 Hz × 4 guests ≈ 51% of a 5 MB/s hotspot link (2–3× headroom).

`codec.js` is browser-compatible ESM (no Node APIs) so the same file can be
imported by `v4/src/net/protocol.js` when P0 wiring lands.
