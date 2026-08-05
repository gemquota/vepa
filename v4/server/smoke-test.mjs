// ============================================================================
// VEPA LAN hub smoke test — host/guest relay, presence, tick sniffing,
// promote flow, and static app headers. Run after `node server.js` is up:
//
//   node v4/server/smoke-test.mjs [port]
// ============================================================================

import { WebSocket } from 'ws';
import { encodeSnapshot, decodeSnapshot, SNAP_FULL } from '../net-poc/codec.js';

const PORT = Number(process.argv[2] || 3100);
const URL_BASE = `http://127.0.0.1:${PORT}`;
const WS_URL = `ws://127.0.0.1:${PORT}/ws`;
const ROOM = 'X7KQ';

let failures = 0;
function check(name, cond) {
  console.log(`${cond ? '✅' : '❌'} ${name}`);
  if (!cond) failures++;
}

function connect(name) {
  const ws = new WebSocket(WS_URL);
  ws.binaryType = 'arraybuffer';
  const inbox = [];
  ws.on('message', (data, isBinary) => inbox.push({ data, isBinary }));
  ws.waitFor = (pred, timeoutMs = 3000) =>
    new Promise((resolve, reject) => {
      const t0 = Date.now();
      const poll = () => {
        const i = inbox.findIndex(pred);
        if (i >= 0) resolve(inbox.splice(i, 1)[0]);
        else if (Date.now() - t0 > timeoutMs) reject(new Error(`${name}: timed out waiting for message`));
        else setTimeout(poll, 20);
      };
      poll();
    });
  ws.open = new Promise((res) => ws.on('open', res));
  ws.sendJson = (o) => ws.send(JSON.stringify(o));
  return ws;
}

function buildSnap(tick) {
  const stride = 100, W = 2000, N = 64;
  const view = new Float32Array(N * stride);
  for (let i = 0; i < N; i++) {
    view[i * stride] = i * 10;
    view[i * stride + 1] = i * 7;
    view[i * stride + 7] = i % 5;
    view[i * stride + 52] = 0;
  }
  return encodeSnapshot({
    type: SNAP_FULL, tick, seq: 1, hostTimeMs: 1000, worldSize: W, simVersion: 1,
    law: { low: 1, high: 0, ext: 0, quad: 0 }, params: [], dna: null,
    particles: view, stride, particleCount: N,
  });
}

async function run() {
  // ── static app: COOP/COEP headers must be present ──
  const page = await fetch(`${URL_BASE}/vepa/vepar/`);
  check('static app served at /vepa/vepar/', page.status === 200);
  check('COOP header present', page.headers.get('cross-origin-opener-policy') === 'same-origin');
  check('COEP header present', page.headers.get('cross-origin-embedder-policy') === 'require-corp');

  const host = connect('host');
  await host.open;
  host.sendJson({ t: 'join', room: ROOM, role: 'guest', name: 'host phone' });
  const hostJoined = (await host.waitFor((m) => !m.isBinary && JSON.parse(m.data).t === 'joined')).data;
  const hostInfo = JSON.parse(hostJoined);
  check('first joiner becomes host', hostInfo.role === 'host');

  const guest = connect('guest');
  await guest.open;
  guest.sendJson({ t: 'join', room: ROOM, role: 'guest', name: 'guest phone' });
  const guestJoined = JSON.parse((await guest.waitFor((m) => !m.isBinary && JSON.parse(m.data).t === 'joined')).data);
  const guestInfo = guestJoined;
  check('second joiner becomes guest', guestJoined.role === 'guest');
  check('guest sees host id', guestJoined.host === hostInfo.id);

  // ── binary snapshot relay host → guest + tick sniffing ──
  const snapBuf = buildSnap(777);
  host.send(snapBuf);
  const got = await guest.waitFor((m) => m.isBinary);
  const snap = decodeSnapshot(got.data);
  check('guest receives SNAP with tick 777', snap.tick === 777 && snap.records.length === 64);

  // control event guest → host
  guest.sendJson({ t: 'law', lawId: 3, value: 1 });
  const lawMsg = JSON.parse((await host.waitFor((m) => !m.isBinary && JSON.parse(m.data).t === 'law')).data);
  check('host receives guest law event', lawMsg.lawId === 3 && lawMsg.value === 1);

  // host echo → guest
  host.sendJson({ t: 'pause' });
  const pauseMsg = JSON.parse((await guest.waitFor((m) => !m.isBinary && JSON.parse(m.data).t === 'pause')).data);
  check('guest receives host pause echo', pauseMsg.t === 'pause');

  // ── host loss → candidates with ticks → promote ──
  const hostLeft = new Promise((res) => {
    guest.on('message', (data, isBinary) => {
      if (!isBinary) {
        const m = JSON.parse(data.toString());
        if (m.t === 'host-left') res(m);
      }
    });
  });
  host.close();
  const left = await hostLeft;
  check('guest notified host-left with lastTick', left.lastTick === 777);
  check('guest listed as candidate', left.candidates.some((c) => c.id === guestInfo.id));

  guest.sendJson({ t: 'promote' });
  const promoted = JSON.parse((await guest.waitFor((m) => !m.isBinary && JSON.parse(m.data).t === 'host')).data);
  check('guest promoted to host', promoted.id === guestInfo.id);

  // new joiner sees promoted host
  const third = connect('third');
  await third.open;
  third.sendJson({ t: 'join', room: ROOM, role: 'guest', name: 'third' });
  const thirdJoined = JSON.parse((await third.waitFor((m) => !m.isBinary && JSON.parse(m.data).t === 'joined')).data);
  check('new joiner sees promoted host', thirdJoined.host === guestInfo.id);

  guest.close();
  third.close();
  console.log(failures === 0 ? '\n✅ HUB SMOKE TEST PASSED' : `\n❌ ${failures} check(s) failed`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((e) => {
  console.error('❌ smoke test error:', e.message);
  process.exit(1);
});
