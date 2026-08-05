// ============================================================================
// VEPA v4 — LAN Multiplayer Hub
//
// One process, one port:
//   1. serves the built app (v4/.dist) over HTTP with COOP/COEP headers
//      (required for SharedArrayBuffer on every phone)
//   2. runs a WebSocket room hub at /ws (host-authoritative relay)
//   3. advertises itself via mDNS as "vepa.local" (bonjour-service, optional)
//   4. prints a QR code for the URL (qrcode-terminal, optional)
//
// Run (from v4/):  npm run build
//                  cd server && npm i && node server.js
// Then open http://<this-phone-ip>:3000 on every phone and join the same room.
// ============================================================================

import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', '.dist');
const PORT = Number(process.env.PORT || 3000);
const WS_PATH = '/ws';
const VITE_BASE = '/vepa/vepar/'; // vite base for local builds (see v4/vite.config.js)
const SNAP_MAGIC = Buffer.from([0x56, 0x45, 0x50, 0x41]); // 'VEPA'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

const COOP_HEADERS = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cache-Control': 'no-cache, must-revalidate',
};

// ── Static app ──────────────────────────────────────────────────────────────

function serveStatic(req, res) {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('bad request');
    return;
  }
  if (urlPath.startsWith(VITE_BASE)) urlPath = urlPath.slice(VITE_BASE.length - 1);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  const filePath = path.join(DIST, urlPath);
  const rel = path.relative(DIST, filePath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, {
      ...COOP_HEADERS,
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    res.end(data);
  });
}

// ── Room hub ────────────────────────────────────────────────────────────────

const rooms = new Map();   // roomCode -> Set<client>
const clients = new Map(); // clientId -> client

function roomMembers(code) {
  return rooms.get(code) || new Set();
}

function broadcast(room, payload, except = null) {
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
  for (const c of room) {
    if (c !== except && c.ws.readyState === c.ws.OPEN) c.ws.send(text);
  }
}

function sendPresence(room) {
  broadcast(room, {
    t: 'presence',
    peers: [...room].map((c) => ({ id: c.id, name: c.name, role: c.role, tick: c.tick })),
  });
}

function joinRoom(client, roomCode, role, name) {
  if (!/^[A-Z0-9]{4}$/.test(roomCode)) {
    client.ws.send(JSON.stringify({ t: 'error', code: 'BAD_ROOM', message: 'room codes are 4 chars A-Z0-9' }));
    return;
  }
  leaveRoom(client);
  client.room = roomCode;
  client.role = role === 'observer' ? 'observer' : 'guest';
  client.name = (name || 'phone').slice(0, 24);
  const room = roomMembers(roomCode);
  room.add(client);
  rooms.set(roomCode, room);

  const hasHost = [...room].some((c) => c.role === 'host');
  if (!hasHost && client.role !== 'observer') client.role = 'host';

  const maxTick = [...room].reduce((m, c) => Math.max(m, c.tick), 0);
  client.ws.send(JSON.stringify({
    t: 'joined',
    room: roomCode,
    id: client.id,
    role: client.role,
    host: [...room].find((c) => c.role === 'host')?.id || null,
    peers: [...room].map((c) => ({ id: c.id, name: c.name, role: c.role, tick: c.tick })),
    tick: maxTick,
  }));
  sendPresence(room);
}

function leaveRoom(client) {
  if (!client.room) return;
  const room = roomMembers(client.room);
  const wasHost = client.role === 'host';
  room.delete(client);
  if (room.size === 0) {
    rooms.delete(client.room);
  } else {
    if (wasHost) {
      const candidates = [...room]
        .filter((c) => c.role === 'guest')
        .sort((a, b) => b.tick - a.tick)
        .map((c) => ({ id: c.id, name: c.name, tick: c.tick }));
      broadcast(room, { t: 'host-left', lastTick: client.tick, candidates });
    }
    sendPresence(room);
  }
  client.room = null;
  client.role = null;
}

function handleText(client, raw) {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    client.ws.send(JSON.stringify({ t: 'error', code: 'BAD_JSON', message: 'control messages must be JSON' }));
    return;
  }
  const room = client.room ? roomMembers(client.room) : null;

  switch (msg.t) {
    case 'join':
      joinRoom(client, msg.room, msg.role, msg.name);
      return;
    case 'leave':
      leaveRoom(client);
      return;
    case 'promote': {
      if (!room || client.role === 'observer') return;
      if (client.role !== 'host') {
        client.role = 'host';
        broadcast(room, { t: 'host', id: client.id });
      }
      return;
    }
    case 'tick':
      if (typeof msg.tick === 'number') client.tick = msg.tick;
      return;
    case 'ping':
    case 'sync':
    case 'law':
    case 'param':
    case 'dna':
    case 'spawn':
    case 'preset':
    case 'pause':
    case 'resume':
    case 'reset':
    case 'scrub':
    case 'scrubTo':
      // Control messages route to the host; the host re-broadcasts what it applies.
      if (!room) return;
      if (client.role === 'host') broadcast(room, raw, client);
      else {
        const host = [...room].find((c) => c.role === 'host');
        if (host) host.ws.send(raw);
        else client.ws.send(JSON.stringify({ t: 'error', code: 'NO_HOST', message: 'no host in room yet' }));
      }
      return;
    default:
      client.ws.send(JSON.stringify({ t: 'error', code: 'UNKNOWN', message: `unknown message type ${msg.t}` }));
  }
}

function handleBinary(client, data) {
  const room = client.room ? roomMembers(client.room) : null;
  if (!room) return;

  // Sniff VEPA snapshot headers to track the client's latest tick.
  if (data.length >= 12 && data.subarray(0, 4).equals(SNAP_MAGIC)) {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    client.tick = view.getUint32(6, true); // tick offset per PROTOCOL.md §4.1
  }

  if (client.role === 'host') {
    for (const c of room) {
      if (c !== client && c.ws.readyState === c.ws.OPEN) c.ws.send(data);
    }
  } else {
    const host = [...room].find((c) => c.role === 'host');
    if (host) host.ws.send(data);
  }
}

// ── mDNS + QR (optional deps, degrade gracefully) ───────────────────────────

let bonjour = null;
let qrcodeTerminal = null;

try {
  const { Bonjour } = await import('bonjour-service');
  bonjour = new Bonjour();
  console.log('  mDNS:  advertising vepa.local (bonjour-service)');
} catch {
  console.log('  mDNS:  unavailable (npm i bonjour-service to enable)');
}

try {
  const mod = await import('qrcode-terminal');
  qrcodeTerminal = mod.default || mod;
} catch {
  /* optional */
}

function lanAddresses() {
  const out = [];
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces || []) {
      if (iface.family === 'IPv4' && !iface.internal) out.push(iface.address);
    }
  }
  return out;
}

// ── Bootstrap ───────────────────────────────────────────────────────────────

const server = http.createServer(serveStatic);
const wss = new WebSocketServer({ server, path: WS_PATH });

wss.on('connection', (ws) => {
  const client = { id: crypto.randomUUID(), ws, room: null, role: null, name: null, tick: 0 };
  clients.set(client.id, client);
  ws.on('message', (data, isBinary) => (isBinary ? handleBinary(client, data) : handleText(client, data.toString())));
  ws.on('close', () => {
    leaveRoom(client);
    clients.delete(client.id);
  });
  ws.on('error', () => {});
});

server.listen(PORT, '0.0.0.0', () => {
  const distOk = fs.existsSync(path.join(DIST, 'index.html'));
  const addrs = lanAddresses();
  console.log('');
  console.log('🌌 VEPA v4 — LAN Multiplayer Hub');
  console.log('='.repeat(52));
  console.log(`  ws hub:  ws://<ip>:${PORT}${WS_PATH}  (host-authoritative relay)`);
  if (!distOk) {
    console.log('  ⚠ build missing: run `cd v4 && npm run build` first');
  }
  console.log('  open on EVERY phone:');
  for (const addr of addrs) console.log(`    http://${addr}:${PORT}`);
  console.log('    http://vepa.local:' + PORT + '   (mDNS, Android 12+ / iOS)');
  console.log('  then join the same 4-char room code in the app.');
  console.log('='.repeat(52));

  if (bonjour) {
    bonjour.publish({ name: 'VEPA Multiplayer', type: 'http', port: PORT });
  }
  const primary = addrs[0] ? `http://${addrs[0]}:${PORT}` : `http://vepa.local:${PORT}`;
  if (qrcodeTerminal) {
    console.log('  scan to open on another phone:');
    qrcodeTerminal.generate(primary, { small: true });
  } else {
    console.log('  (install qrcode-terminal for a scannable QR)');
  }
  console.log('');
});

process.on('SIGINT', () => {
  if (bonjour) bonjour.destroy();
  process.exit(0);
});
