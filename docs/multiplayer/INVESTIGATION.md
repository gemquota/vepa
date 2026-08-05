# VEPA Multiplayer — Investigation & Ascertained Architecture

> **Branch:** `feature/multiplayer-investigation`
> **Date:** 2026-08-05
> **Target:** VEPA v4 (`v4/` — the active app tree)
> **Status:** Investigation complete — architecture ascertained, POC + LAN hub shipped
> **Question:** *How can two (or more) phones be linked so they both see and interact with the same VEPA world, when the phones are sitting directly next to each other?*

---

## 1. TL;DR — The Answer

**Link the phones over their local network with a host-authoritative star topology:**

1. **One phone runs a tiny Node.js server (Termux):** it serves the VEPA v4 app **and** runs a WebSocket relay/hub on the same port. No internet required.
2. **The other phones open a URL** — `http://<host-ip>:3000` (or `http://vepa.local:3000` via mDNS) — and join the same room code.
3. **The first phone to join is the HOST.** It runs the real simulation (unchanged physics). Every tick it broadcasts a compact binary **snapshot** of the world to all guests.
4. **Guests are render-only:** they run the normal VEPA renderer over a replicated particle buffer and interpolate between snapshots. Their law/param/spawn/DNA controls send small **events** to the host, which applies them authoritatively.
5. **Failover:** if the host disappears, the guest with the freshest snapshot can be promoted and the world continues.

This was chosen over the alternatives (pure WebRTC, deterministic lockstep, full mesh) because it is the **only option that works with zero friction on plain HTTP from phone browsers, tolerates VEPA's deliberate non-determinism, and requires no new physics determinism guarantees** — while still being a genuine distributed system (room hub, role election, ordered events, drift reconciliation).

The full wire protocol is specified in [`PROTOCOL.md`](./PROTOCOL.md). A zero-dependency codec + bandwidth simulation is in [`v4/net-poc/`](../../v4/net-poc/), and the LAN hub server is in [`v4/server/`](../../v4/server/).

---

## 2. Goals & Constraints

| Constraint | Implication |
|---|---|
| Phones are **directly next to each other** | They share a LAN: same WiFi router, or one phone's hotspot. Likely **no internet**. Zero-config, zero-app-install is achievable. |
| **No installs on guest phones** | Everything must run in the phone browser. No app store, no OS permissions. |
| Guest browsers are mobile Chrome/Safari | Narrow API surface: WebSocket, WebRTC, Web NFC, Web Bluetooth, BroadcastChannel. No raw UDP/TCP, no WiFi Direct. |
| VEPA v4 runs **main-thread physics** (solver.js), seeded with `Date.now()`, uses its own PRNG + `performance.now()` | Simulation is **not bit-deterministic across devices**. Lockstep is off the table without a determinism rewrite. |
| `SharedArrayBuffer` needs **cross-origin isolation** (COOP/COEP) | Already configured in `v4/vite.config.js` and `vercel.json`. The LAN server must set the same headers. |
| One world, both phones | Guests must see the **same positions, species, laws, params, population** — not a clone, not a fork. |
| Small group (2–6 phones) | Star + broadcast is plenty; no need for scalable mesh routing. |
| Existing architecture must be respected | Reuse the stride-100 buffer, `physics:tick` bus event, law `serialize/deserialize`, worldParams, sprite sync. No rewrite of the physics. |

**Numbers that drive the design** (`v4/src/constants.js`):

- `PARTICLE_STRIDE = 100`, `MAX_PARTICLES = 2500`, `MAX_SPECIES = 64`, `WORLD_SIZE = 2000`
- Default population: 5 species × 250 = **1250 particles**
- Particle buffer: `2500 × 100 × 4B = 1.0 MB` per snapshot copy (raw full copy is ~1 MB)
- Sim tick: 1 per `requestAnimationFrame` frame, `SUBSTEPS=4 × DT=0.25` (≈60 ticks/s, scaled by `runtimeConfig.simSpeed`)

---

## 3. Transport Options — Phones Side by Side

| # | Option | Discovery | Latency (LAN) | Throughput | Secure context needed? | Guest friction | Verdict |
|---|---|---|---|---|---|---|---|
| **A** | **WebSocket relay — Node hub on one phone (Termux), serving app + `ws` on one port** | Typed IP, mDNS `vepa.local`, QR | ~1–5 ms | MB/s (WiFi) | **No** (`ws://` from an `http://` page is fine) | Open a URL, tap join | ✅ **RECOMMENDED** |
| B | WebRTC DataChannel, P2P | Needs signaling first (SDP exchange) | ~1–3 ms | MB/s | **Yes** (https or chrome flag) | Cert warning / flag gymnastics on Android | ⏳ Phase 2 direct-link upgrade |
| C | BroadcastChannel | — | — | — | — | Same browser only — **cannot cross devices** | ❌ |
| D | Web Bluetooth (GATT) | Manual pairing per device | ~10–50 ms | 0.1–0.2 Mbps real | Yes | Pairing prompt + Chrome Android only + central-role limitation | ❌ (pairing token only) |
| E | Web NFC | Tap-to-pair | n/a | tiny payloads | Yes | Android-only, per-tap | ❌ (could bootstrap signaling later) |
| F | Public PeerJS broker | Cloud | good | good | Yes | Needs internet + 3rd-party service | ❌ (assumes internet) |
| G | WiFi Direct / hotspot APIs | — | — | — | Not exposed to browsers | — | ❌ |
| H | Public deploy (Vercel) + WSS | Cloud | 20–100 ms | good | Yes (native) | Needs internet | ➕ nice for internet play, not the LAN case |

### Why A wins here

- **Secure-context trap:** WebRTC and Web Bluetooth require a **secure context** (`https://`, `localhost`, or chrome flag). A phone reaching `http://192.168.x.x:3000` is *not* a secure context, so those APIs silently fail. Serving HTTPS from a phone needs a self-signed cert → hostile "your connection is not private" walls on every guest phone.
  Plain **HTTP + `ws://` has no such wall**, and `SharedArrayBuffer` only requires COOP/COEP headers (not TLS). So the *entire* MVP — including cross-origin isolation — works over plain LAN HTTP.
- **Signaling chicken-and-egg:** WebRTC still needs a signaling channel to exchange SDP/ICE. Without a server you'd do manual copy-paste or QR SDP exchange — flaky for 3+ phones. With a server you might as well use the server's WebSocket for state relay.
- **Latency is a non-problem:** same-LAN `ws` round-trip is ~1–5 ms. VEPA renders at ~60 Hz; there is nothing to win by going P2P for a 2–6 phone room.
- **One process, one port, zero installs:** the Termux Node process serves the built app *and* relays world state. Guests literally open a URL.

---

## 4. Sync Architecture Options

| # | Model | How it works | Determinism needed? | Bandwidth | Failure behavior | Verdict |
|---|---|---|---|---|---|---|
| 1 | **Deterministic lockstep** | Every phone runs the identical sim from the same seed; only *inputs* (law toggles, spawns) are broadcast. | **Yes — bit-exact across devices** | Tiny (events only) | Divergence is silent and permanent without resync | ❌ Rejected — VEPA v4 is deliberately non-deterministic (`new PRNG(Date.now())`, `performance.now()` in engines, main-thread timing). Making it deterministic = rewrite. |
| 2 | **Full mesh, replicated state machine** | Every device simulates the full world; all events broadcast with Lamport clocks; periodic reconciliation. | Partial (reconciliation heals drift) | Events + reconcile | Complex consensus, ordering, duplicate-event handling | ⏳ Phase 3 ambition; overkill for 2–6 phones |
| 3 | **Host-authoritative star** | One phone runs the sim. Broadcasts snapshots. Guests render + send control events. | **None** | Snapshots (see §7) | Simple: host loss → promote freshest guest | ✅ **RECOMMENDED** |

### Why host-authoritative

- **Works with the sim as-is.** The host is the single writer; `Math.random`-class non-determinism, engine jitter, and timing differences become irrelevant — guests just reproduce the host's output.
- **Late join = free.** A new guest requests a full snapshot; done. No replay of history, no consensus.
- **Deterministic world view.** Every guest renders the same authoritative buffer, so "both phones share the same world" holds *by construction*.
- **Simple failure model.** The hub tracks each client's latest tick; on host loss, the guest with the highest tick is the natural successor (with user confirmation).
- **The physics cost is unchanged.** The host runs the exact existing `solve()` path; guests run only the renderer — actually *cheaper* than today's phones.

### Distributed-system properties we keep (even in star mode)

- **Role election:** host identity is a join-time election (first joiner wins; explicit promotion on failure).
- **Total order of control events:** host assigns an authoritative sequence number and echoes events to the room — every guest applies the same ordered event stream.
- **Logical clocks:** snapshots carry `tick` + `hostTimeMs`; guests compute a smoothed clock offset for interpolation and detect lag/drift.
- **Reconciliation:** periodic full snapshots (every ~1 s) re-anchor guests even if a delta was dropped.
- **Partition tolerance:** guests freeze on the last snapshot, keep rendering locally, and resync on reconnect (last-writer / freshest-tick wins).

---

## 5. Chosen Architecture (Diagram)

```
┌─────────────────────────────  LAN / hotspot  ─────────────────────────────┐
│                                                                           │
│   PHONE A — Termux                                                         │
│   ┌─────────────────────────────┐                                          │
│   │ node v4/server/server.js     │  :3000                                  │
│   │  ├─ static server (built app │  HTTP  + COOP/COEP headers             │
│   │  │   + COOP/COEP headers)    │  ← http://<ip>:3000  (or vepa.local)   │
│   │  └─ WebSocket room hub       │  ← ws://<ip>:3000/ws                   │
│   └─────────────────────────────┘                                          │
│                                                                           │
│   Browser on A                 Browser on B            Browser on C       │
│   ┌──────────────────┐         ┌──────────────────┐    ┌──────────────┐   │
│   │ VEPA v4 HOST mode │         │ VEPA v4 GUEST mode│   │ GUEST mode   │   │
│   │ solve()  ✅ runs  │         │ solve()  ⛔ skip  │   │  (render-only)│   │
│   │ render   ✅       │         │ render   ✅       │   │               │   │
│   │ controls ✅ local │         │ controls → events │   │               │   │
│   └───────┬──────────┘         └───────┬──────────┘    └───────┬──────┘   │
│           │  SNAP (binary, 20–30 Hz)   │  EVT (control)        │          │
│           └────────────► hub ◄─────────┘                       │          │
│                         │  fan-out to every guest              │          │
│                         └──────────────────────────────────────┘          │
└───────────────────────────────────────────────────────────────────────────┘
```

### Host mode
- Runs the unmodified v4 main loop (`solve()`, spawn, engines, timeline).
- After each `physics:tick`, encodes a binary snapshot (full every 1 s; full-or-delta otherwise) and `ws.send()`s it to the hub.
- Applies local control inputs directly; broadcasts the same inputs as events so guests see them reflected.
- Responds to `PING` (clock sync) and `SYNC` (full resend) messages.

### Guest mode
- Skips `solve()` and all spawn/lifecycle writes. Keeps `renderer` + `spriteSync` running against a replicated `particleBuffer`.
- Applies incoming snapshots: writes positions/species/color/radius/energy into the buffer at the same particle indices, keeps two snapshots for **interpolation**.
- Local controls become events: `LAW`, `PARAM`, `SPAWN`, `DNA`, `PRESET`, `PAUSE`, `RESET`, `SCRUB`.
- UI is read-only for world state until the host echoes an authoritative change (prevents fighting the host).

### The hub (server.js)
- Single port: static app + `ws` upgrade. Tracks rooms, members, roles, and each member's latest `tick` (clients send tiny `TICK` control messages, or the hub sniffs `SNAP` headers).
- Pure relay for binary snapshots (fan-out); routes control events to the host (or broadcasts if no host yet).
- Emits `PRESENCE` updates on join/leave; announces `HOST_LEFT` with the best successor candidate on host loss.

---

## 6. What Gets Synced

| State | Size | Sync mode |
|---|---|---|
| Law bitmask (4 × u32: low/high/ext/quad) | 16 B | Every snapshot (changed infrequently) |
| World params (23 floats, `WORLD_PARAM_DEFS`) | ~115 B | Every snapshot (or on change) |
| Species DNA (`64 × 64 × u16`) | 8 KB | Full snapshot on join + on `DNA_SET` |
| Particles (positions, species, color, radius, energy, dead, flags) | ~17 B/alive particle | Full every 1 s; delta otherwise |
| Control events (law/param/spawn/dna/preset/pause/reset) | < 100 B | On user action, guest → host → room |
| Timeline / multiplex / insight | n/a | Host-only in MVP (see §11 open questions) |

---

## 7. Bandwidth Math

Snapshot record (FULL, 17 B/particle — see PROTOCOL.md):

```
id u16 | x u16 | y u16 | vx i16 | vy i16 | species u8 | r g b u8×3 | radius u8 | energy u8 | flags u8
```

| Scenario | Per snapshot | At 30 Hz | At 20 Hz |
|---|---|---|---|
| 1250 alive (default) | ~21 KB | 640 KB/s | 425 KB/s |
| 2500 alive (max) | ~43 KB | 1.3 MB/s | 850 KB/s |
| 4 guests @ 1250 alive (hub fan-out) | — | ~2.6 MB/s host uplink | 1.7 MB/s |

- A typical 802.11n hotspot sustains 5–10 MB/s; the default world at 20–30 Hz is **33–50% of a 5 MB/s link for 4 guests (~2–3× headroom)**, and 10 Hz would be ~16%.
- Full snapshot on join: 20–40 KB + 8 KB DNA — instant.
- If ever needed: drop to 10 Hz + guest-side extrapolation, quantize harder, or delta-only positions.

**Why binary and not JSON:** the JSON form of 2500 particles is ~300–500 KB per snapshot (10–20× larger) and ~50× slower to parse on a phone. The codec in `v4/net-poc/codec.js` encodes/decodes a full snapshot in well under 1 ms on a laptop and ~2–4 ms on a phone-class CPU.

---

## 8. Protocol Summary

Full spec: [`PROTOCOL.md`](./PROTOCOL.md). Highlights:

- **Envelope (JSON for control, binary for state):** every message has `{ t, room, seq, from }`.
- **Binary snapshot header:** `magic 'VEPA' | version | type | tick u32 | seq u32 | hostTimeMs f64 | counts | worldSize f32 | simVersion u16`.
- **Quantization:** position → u16 over ±`worldSize/2` (0.03-unit resolution at WORLD_SIZE 2000); velocity → i16 over ±50; radius/energy/color → u8. Quantization error is below one screen pixel.
- **Clock sync:** NTP-lite ping/pong + smoothed offset from `hostTimeMs` in snapshots; guests interpolate with `t = (now + offset − prev.hostTimeMs) / span`.
- **Events:** `LAW`, `PARAM`, `SPAWN`, `DNA`, `PRESET`, `PAUSE`, `RESET`, `SCRUB` — all applied by the host, echoed to the room with an authoritative `seq`.
- **Reconciliation:** a `SYNC` request or any gap in `seq` triggers a full snapshot.

---

## 9. Integration Points in VEPA v4 (file map)

| File | Change for multiplayer |
|---|---|
| `v4/src/main.js` | Add `network` init; `bus.on('physics:tick', …)` → host encodes snapshot; gate `solve()` off in guest mode; forward control events. |
| `v4/src/state/particleBuffer.js` | Reuse `setParticle()` / buffer creation for snapshot application (guest). |
| `v4/src/state/lawState.js` | Reuse `serialize()` / `deserialize()` (already 4×u32 — drop-in for the law block). |
| `v4/src/state/worldParams.js` | Serialize `WORLD_PARAM_DEFS` keys → values for the params block. |
| `v4/src/render/renderer.js` + `spriteSync.js` | Unchanged — guests feed the replicated buffer into the same render path. |
| `v4/src/ui/*` | New `networkPanel` (join/host UI, room code, status, promotion button) following `worldPanel` patterns. |
| `v4/src/net/` *(new)* | `protocol.js` (codec), `transport.js` (ws client, reconnect, ping), `networkHost.js`, `networkClient.js`, `discovery.js` (URL/QR helpers). |
| `v4/server/` *(new, shipped)* | LAN hub: static server + ws relay + mDNS + QR. |
| `vepa4` launcher | New `vepa4 multiplayer` subcommand. |

---

## 10. Security & Trust Model

- **LAN-trusted by design:** anyone on the same WiFi/hotspot can join a room if they know the code. Rooms use 4-char codes as a soft namespace, not security.
- No auth in MVP; document that the app must not be served on untrusted networks without adding a room token.
- Guests are **render-only** — they cannot corrupt the world; the host is the single writer. A malicious guest can only spam events (rate-limit at the hub/host in a later pass).
- WebSocket is plain `ws://` on LAN. If internet play is added later, the same hub code runs behind TLS (`wss://`) with no protocol change.

---

## 11. Phased Roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| **P0 — Proof of link (this branch)** | `docs/`, protocol spec, `net-poc` codec + bandwidth sim, `server.js` hub | 2 devices on same WiFi open the app; guest mirrors host positions; law toggle on host appears on guest |
| **P1 — Playable** | Guest render + interpolation; control events (law/param/spawn/DNA/preset); join/rejoin; pause/reset/scrub; host failover + promotion UI; network panel | 2–4 phones play a shared world for 30+ min without divergence |
| **P2 — Tighter coupling** | Delta-only snapshots, prediction on guests, WebRTC DataChannel direct links (https/flag), mesh event gossip, multiplex/timeline sync, room tokens | Sub-10 ms effective lag; 6 phones; internet play via TLS |
| **P3 — Distributed ideal** | Full replicated-state mesh, no host (Lamport-ordered events + snapshot reconciliation), observer mode | 2–6 phones survive arbitrary device loss without a coordinator |

---

## 12. Deliverables on This Branch

```
docs/multiplayer/INVESTIGATION.md   ← this file (ascertained architecture)
docs/multiplayer/PROTOCOL.md        ← wire protocol specification
v4/net-poc/codec.js                 ← zero-dep binary codec (host+guest)
v4/net-poc/bandwidth-sim.js         ← snapshot size / LAN bandwidth sim
v4/net-poc/roundtrip-demo.js        ← in-process host→guest round trip + parity check
v4/net-poc/README.md
v4/server/server.js                 ← LAN hub (static + ws + mDNS + QR)
v4/server/package.json              ← ws, bonjour-service (optional), qrcode-terminal (optional)
v4/server/README.md                 ← run instructions (Termux + hotspot)
vepa4                               ← new `multiplayer` subcommand
v4/CHANGELOG.md                     ← entry
```

## 13. Validation Plan (next steps)

1. `node v4/net-poc/roundtrip-demo.js` — codec round trip + error bounds. ✅ (on this branch)
2. `node v4/net-poc/bandwidth-sim.js` — confirm §7 numbers. ✅ (on this branch)
3. `cd v4/server && npm i && node server.js` — hub up on `http://<ip>:3000`; open from 2 phones; confirm pages load with COOP/COEP (check `crossOriginIsolated === true` in console).
4. P0 wiring in `v4/src/main.js` + `net/` — guest mirrors host (the actual next coding task on this branch).

---

*Open questions for the user (tracked as tickets): host-phone hotspot vs shared router; whether timeline scrubbing should broadcast; whether guests may spawn their own species or only the host configures DNA; target phone OS mix (Chrome-only vs iOS Safari).*
