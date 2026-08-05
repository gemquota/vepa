# VEPA v4 — LAN Multiplayer Hub

One Node process on one phone (Termux) that makes every other phone on the same
WiFi/hotspot see the **same VEPA world**:

- serves the built app over HTTP with COOP/COEP headers (SharedArrayBuffer enabled)
- runs a WebSocket room hub at `/ws` — host-authoritative relay of world snapshots
- advertises `vepa.local` via mDNS, prints a QR code (both optional deps)

See the architecture in [`docs/multiplayer/INVESTIGATION.md`](../../docs/multiplayer/INVESTIGATION.md)
and the wire format in [`docs/multiplayer/PROTOCOL.md`](../../docs/multiplayer/PROTOCOL.md).

## Run on the host phone (Termux)

```bash
cd v4
npm run build                      # produce v4/.dist (required)
cd server
npm i                              # installs ws + bonjour-service (+ qrcode-terminal)
node server.js                     # or: PORT=8443 node server.js
```

The server prints the URLs to open on every phone:

```
open on EVERY phone:
  http://192.168.43.1:3000     ← Android hotspot gateway IP (or your router IP)
  http://vepa.local:3000       ← mDNS (Android 12+ / iOS)
```

Every phone opens the URL, then joins the **same 4-char room code** in the app.
The first phone in the room becomes the HOST and runs the simulation; the rest
render the same world and send controls to the host.

## Hotspot mode (no router, no internet)

1. Host phone: Settings → Tethering → WiFi hotspot (Android: usually gateway
   `192.168.43.1`).
2. Guest phones join that hotspot.
3. Run `node server.js` on the host phone and open the printed URL.

## Verified in this branch

- Codec round trip + bandwidth sim: `node v4/net-poc/roundtrip-demo.js` and
  `node v4/net-poc/bandwidth-sim.js` (no deps).
- Hub smoke test (host ↔ guest relay + presence + tick sniffing) — see the
  `smoke-test.mjs` notes in the git log/CHANGELOG.

## Notes

- Port: `PORT` env var, default `3000`.
- mDNS: install `bonjour-service` (default dep). If your Android resolves
  `.local`, `vepa.local` works; otherwise use the printed IP.
- QR: install `qrcode-terminal` (optional) to scan the URL from the next phone.
- Security: LAN-trusted by design — anyone on the network who knows the room
  code can join. Don't run this on untrusted networks without adding a token.
