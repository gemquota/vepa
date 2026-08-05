# VEPA Multiplayer — Wire Protocol Specification

> **Version:** 1 | **Status:** Proposed (P0) | **Companion codec:** `v4/net-poc/codec.js` (reference implementation)
>
> The protocol is deliberately small: JSON envelopes for control, a single binary
> frame layout for world state. Everything is designed around VEPA v4's
> stride-100 `Float32Array` particle buffer, 64-bit law bitmask (4×u32), and
> 23 `WORLD_PARAM_DEFS` world parameters.

---

## 1. Transport

- **One WebSocket** per client, connected to the LAN hub (`ws://<host>:3000/ws`).
- Binary frames (`ArrayBuffer`, `binaryType = 'arraybuffer'`) carry **snapshots** and **acknowledgements**.
- Text frames carry **control messages** (JSON).
- The page itself is served over plain HTTP from the same port with
  `Cross-Origin-Opener-Policy: same-origin` and
  `Cross-Origin-Embedder-Policy: require-corp` (required for `SharedArrayBuffer`).

---

## 2. Rooms & Roles

- A **room** is identified by a 4-char code (A-Z0-9, no lookalikes: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`).
- The **host** is the first client in a room. The hub is not authoritative — it relays.
- Roles: `host` (runs physics, writes snapshots), `guest` (renders, sends control events), `observer` (renders only, future).

### Join flow

```
GUEST                         HUB                        HOST
  |  {"t":"join","room":"X7KQ","role":"guest","name":"A"}  |
  |───────────────────────────────────────────────────────>|
  |                                                         |
  |       {"t":"joined","room":"X7KQ","id":"g2",            |
  |        "host":"h1","peers":[...],"tick":lastKnown}      |
  |<────────────────────────────────────────────────────────|
  |  {"t":"sync","want":"full"}                             |
  |───────────────────────────────────────────────────────>| (relayed)
  |                                                         | SNAP full
  |<────────────────── SNAP(full) ──────────────────────────|
  |  {"t":"tick","tick":N}  (every frame, throttled 4 Hz)   |
  |───────────────────────────────────────────────────────>|
```

- `joined` includes the room's current tick and peer roster so a fresh guest can
  show "syncing…" until the first snapshot arrives.
- Host loss: hub sends `{"t":"host-left","lastTick":N,"candidates":[{id,tick}]}`.
  A guest may then send `{"t":"promote","id":<self>}`; the hub broadcasts
  `{"t":"host","id":<new>}` and all clients switch their event target to the new host.

---

## 3. Control Messages (JSON text frames)

Every control message: `{ "t": <type>, "room": "X7KQ", "seq": <int>, "from": "<clientId>", ... }`

`seq` is a per-sender Lamport-ish counter (incremented on each send). The host
stamps authoritative ordering: the host assigns `aseq` when it applies an event
and echoes it, so all guests observe the same total order.

| `t` | Direction | Payload | Semantics |
|---|---|---|---|
| `join` | → hub | `room, role, name` | Join room |
| `joined` | hub → | `id, host, peers, tick` | Join acknowledgement |
| `leave` | → hub | — | Leave room |
| `presence` | hub → | `peers: [{id,name,role,tick}]` | Roster change |
| `host` | hub → | `id` | Host identity (initial + after promotion) |
| `host-left` | hub → | `lastTick, candidates` | Host disconnected |
| `promote` | → hub | `id` | Candidate announces itself as new host |
| `tick` | → hub | `tick` | Client's latest known tick (4 Hz throttle) |
| `ping` | → host | `t0` | Clock sync request (guest) |
| `pong` | host → | `t0, t1, t2` | Clock sync reply |
| `sync` | → host | `want: "full"|"delta"` | Request snapshot |
| `law` | → host | `lawId, value` | Set one law state |
| `param` | → host | `key, value` | Set one world param |
| `dna` | → host | `species, trait, value` | Set one species DNA value |
| `spawn` | → host | `species, count, x?, y?` | Spawn particles |
| `preset` | → host | `name` | Apply a named preset |
| `pause` / `resume` | → host | — | Toggle sim pause |
| `reset` | → host | — | Reset world (fresh population, current config) |
| `scrub` | → host | `tickIndex` | Host restores timeline snapshot & broadcasts it |
| `error` | any | `code, message` | Error (unknown room, bad payload, etc.) |

The hub routes every message tagged for the host to the current host, and
broadcasts `presence`/`host`/`host-left` to the room. Control messages are
**not** broadcast to guests by the hub — the host re-broadcasts what it applies
(so guests' UI mirrors authority, not requests).

---

## 4. Binary Snapshot Frame

**Endianness:** all multi-byte integers and floats are **little-endian**. The 4-byte magic reads `56 45 50 41` ("VEPA") on the wire.


### 4.1 Header (46 bytes)

| Offset | Size | Field | Notes |
|---|---|---|---|
| 0 | 4 | `magic` | `0x56 0x45 0x50 0x41` ("VEPA") |
| 4 | 1 | `version` | Protocol version (1) |
| 5 | 1 | `type` | `0x01` FULL, `0x02` DELTA, `0x03` ACK |
| 6 | 4 | `tick` u32 | Host tick at snapshot |
| 10 | 4 | `seq` u32 | Host snapshot sequence (monotonic) |
| 14 | 8 | `hostTimeMs` f64 | Host `performance.now()` at encode |
| 22 | 2 | `particleCount` u16 | Buffer capacity (stride slots) |
| 24 | 2 | `aliveCount` u16 | Alive particles included in this frame |
| 26 | 2 | `stride` u16 | Must be 100 |
| 28 | 4 | `worldSize` f32 | Current world extent |
| 32 | 2 | `simVersion` u16 | Sim config version (bump on reset) |
| 34 | 4 | `lawLow` u32 | Law bitmask block (see 4.2) |
| 38 | 4 | `lawHigh` u32 | |
| 42 | 4 | `lawExt` u32 | |
| 46 | 4 | `lawQuad` u32 | |
| 50 | 1 | `paramCount` u8 | Params included |
| 51 | 3×`paramCount` | `[keyIdx u8, value f32]` | World params |
| … | 2 | `dnaCount` u16 | Species included (FULL only; 0 in DELTA) |
| … | 2×64×`dnaCount` | packed DNA | `u16` per (species, trait) |
| … | 17×`aliveCount` | particle records | See 4.3 |

Header total: **51 + 5×paramCount + 2 + 128×dnaCount + 17×aliveCount** bytes
(≈ 51 + 115 + 2 + 8192 + 42500 ≈ 50 KB for a full 2500-particle snapshot).

### 4.2 Law block

Reuses `lawState.serialize()` from `v4/src/state/lawState.js` (4×u32:
`lowFlags/highFlags/extFlags/quadFlags`). Multi-state law values (WRAP 0–3 etc.)
live in world params where applicable; otherwise they are encoded as an
additional `u8` array appended after `lawQuad` (future revision).

### 4.3 Particle record (17 bytes, FULL)

| Offset | Size | Field | Encoding |
|---|---|---|---|
| 0 | 2 | `id` u16 | Particle index (`i` where `ptr = i * stride`) |
| 2 | 2 | `x` u16 | `q = clamp(round((x + W/2) / W * 65535), 0, 65535)` |
| 4 | 2 | `y` u16 | same |
| 6 | 2 | `vx` i16 | `q = clamp(round(v / 50 * 32767), -32768, 32767)` |
| 8 | 2 | `vy` i16 | same |
| 10 | 1 | `species` u8 | `SPECIES_ID` |
| 11 | 1 | `r` u8 | `round(colorR * 255)` |
| 12 | 1 | `g` u8 | |
| 13 | 1 | `b` u8 | |
| 14 | 1 | `radius` u8 | `q = clamp(round(radius / 50 * 255), 0, 255)` |
| 15 | 1 | `flags` u8 | bit0 `DEAD≥0.5`, bit1 bonded, bit2 newly spawned, bit3 pinned/soul |

Record size: **17 bytes** (2×5 + 1×7).

### 4.4 DELTA frames

Same record layout, but only particles whose quantized bytes changed since the
last sent frame. `type = 0x02`; `aliveCount` = number of changed records.
Guests apply by `id`. Because nearly every particle moves every tick, deltas
are only worthwhile at lower snapshot rates or with a movement threshold;
P0 sends FULL at 20–30 Hz and DELTA only for non-movers (`DEAD`, bonded, soul).

### 4.5 Dequantization (guest)

```
x  = qx / 65535 * W - W/2
y  = qy / 65535 * W - W/2
vx = qvx / 32767 * 50
radius = qr / 255 * 50
energy = qe / 255 * 200
```

Quantization error at `WORLD_SIZE = 2000`: 0.03 world units ≈ 0.01 px at
default zoom — invisible. Velocity quantization: 0.0015 units/tick — invisible.

---

## 5. Clock Sync & Interpolation

- **Clock offset:** guests send `ping` with `t0` (guest `performance.now()`).
  Host replies `pong {t0, t1, t2}` (`t1` = host recv time, `t2` = host send time).
  Guest computes `offset = ((t1 - t0) + (t2 - t3)) / 2` where `t3` = local recv.
- **Smoothed offset:** EMA over the last 8 pongs (`α = 0.25`) to ride out jitter.
- **Snapshot timestamps:** each SNAP carries `hostTimeMs`; guests keep the two
  most recent snapshots and compute

  ```
  t = (now + offset - prev.hostTimeMs) / (next.hostTimeMs - prev.hostTimeMs)
  pos = lerp(prev.pos, next.pos, clamp(t, 0, 1))
  ```

  This is robust to `runtimeConfig.simSpeed` changes because it interpolates on
  host wall time, not tick counts.
- **Catch-up:** if `next.hostTimeMs - prev.hostTimeMs` exceeds 500 ms (missed
  frames), snap directly to the latest snapshot instead of interpolating.
- **Pause:** host broadcasts pause via `pause`/`resume` events; guests freeze
  interpolation until `resume`.

---

## 6. Reconciliation & Failure

- **Gap detection:** if a guest sees a `seq` jump > 1, it sends `sync` (full).
- **Periodic anchor:** host sends a FULL snapshot every 60 ticks (~1 s) so any
  dropped delta heals within a second by construction.
- **Host loss:** guests keep the last snapshot and render it frozen. The hub
  broadcasts `host-left` with candidate ids + ticks. The freshest guest
  (highest `tick`) is the recommended successor; on `promote`, the new host
  sends a FULL snapshot immediately and guests re-anchor.
- **Guest rejoin:** same as join — full snapshot from host.
- **World reset:** host bumps `simVersion`; guests discard buffered snapshots
  and wait for the next FULL.

---

## 7. Codec Reference

`v4/net-poc/codec.js` implements §4–§5:

| Function | Role |
|---|---|
| `encodeSnapshot({type, tick, seq, hostTimeMs, worldSize, law, params, dna, particles, stride, aliveIds}) → ArrayBuffer` | Host |
| `decodeSnapshot(buf) → snapshot object` | Guest |
| `quantizePos(v, W) / dequantizePos(q, W)` | both |
| `quantizeVel(v) / dequantizeVel(q)` | both |
| `buildFullRecords(view, count, stride, worldSize) → {buffer, records}` | Host helper |
| `applySnapshot(buffer, snapshot)` | Guest (writes stride-100 slots) |

Run the demo:

```bash
node v4/net-poc/roundtrip-demo.js   # encode → decode → parity + error bounds
node v4/net-poc/bandwidth-sim.js    # bytes/s for realistic worlds & rates
```

---

## 8. Versioning

- `version` byte bumps on breaking layout changes.
- `simVersion` bumps on world reset; guests drop stale snapshots.
- Law/param/DNA payloads are self-describing (key indexes from
  `WORLD_PARAM_DEFS` / `DNA_INDEXES`), so old guests degrade gracefully when the
  host adds params.
