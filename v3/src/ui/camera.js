/**
 * VEPA v3 — 3D Camera + Touch/Mouse Controls
 * - 1 finger / mouse drag → orbit rotation
 * - 2 fingers → pan + pinch zoom
 * - Scroll wheel → zoom
 */
const camera = {
  x: 0,
  y: 0,
  zoom: 1.0,
  rotY: 0.6,     // horizontal orbit (radians) — tilt to show 3D depth
  rotX: -0.45,   // vertical orbit (radians)
  focalLength: 1200,
};

// ── Internal state ──
let _canvas = null;
const ptr = {
  // Pointer (mouse) orbit
  mouseDown: false, mouseX: 0, mouseY: 0,
  // Touch tracking
  touches: {},
  touchCount: 0,
  // 1-finger orbit
  orbitLastX: 0, orbitLastY: 0,
  // 2-finger pan + pinch
  pinchDist: 0,
  panCenterX: 0, panCenterY: 0,
  panStartX: 0, panStartY: 0,
  panStartRotY: 0, panStartRotX: 0,
};

/**
 * Initialize camera controls on a canvas element.
 */
export function initCamera(canvas) {
  if (!canvas) return;
  _canvas = canvas;
  canvas.style.touchAction = 'none';

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
}

// ── Mouse orbit (pointer events, touch-typed ignored) ──

function onPointerDown(e) {
  if (e.pointerType === 'touch') return;
  ptr.mouseDown = true;
  ptr.mouseX = e.clientX;
  ptr.mouseY = e.clientY;
}

function onPointerMove(e) {
  if (!ptr.mouseDown) return;
  const dx = e.clientX - ptr.mouseX;
  const dy = e.clientY - ptr.mouseY;
  camera.rotY -= dx * 0.003;
  camera.rotX = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, camera.rotX + dy * 0.003));
  ptr.mouseX = e.clientX;
  ptr.mouseY = e.clientY;
}

function onPointerUp() {
  ptr.mouseDown = false;
}

function onWheel(e) {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  camera.zoom = Math.max(0.1, Math.min(10, camera.zoom * delta));
}

// ── Touch gestures ──

function onTouchStart(e) {
  e.preventDefault();
  for (const t of e.changedTouches) {
    ptr.touches[t.identifier] = { x: t.clientX, y: t.clientY };
  }
  ptr.touchCount = Object.keys(ptr.touches).length;

  if (ptr.touchCount === 1) {
    // 1 finger → orbit (rotation)
    const t = e.touches[0];
    ptr.orbitLastX = t.clientX;
    ptr.orbitLastY = t.clientY;
  } else if (ptr.touchCount === 2) {
    // 2 fingers → start pan + pinch zoom
    beginPinchPan();
  }
}

function onTouchMove(e) {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (ptr.touches[t.identifier]) {
      ptr.touches[t.identifier] = { x: t.clientX, y: t.clientY };
    }
  }
  ptr.touchCount = Object.keys(ptr.touches).length;

  if (ptr.touchCount === 1) {
    // 1 finger → orbit rotation
    const t = e.touches[0];
    const dx = (t.clientX - ptr.orbitLastX) * 0.005;
    const dy = (t.clientY - ptr.orbitLastY) * 0.005;
    camera.rotY -= dx;
    camera.rotX = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, camera.rotX + dy));
    ptr.orbitLastX = t.clientX;
    ptr.orbitLastY = t.clientY;
  } else if (ptr.touchCount >= 2) {
    // 2 fingers → pan + pinch zoom
    doPinchPan();
  }
}

function onTouchEnd(e) {
  e.preventDefault();
  for (const t of e.changedTouches) {
    delete ptr.touches[t.identifier];
  }
  ptr.touchCount = Object.keys(ptr.touches).length;
  if (ptr.touchCount < 2) ptr.pinchDist = 0;
  if (ptr.touchCount === 1) {
    const t = e.touches[0];
    ptr.orbitLastX = t.clientX;
    ptr.orbitLastY = t.clientY;
  }
}

// ── 2-finger helpers ──

function beginPinchPan() {
  const ids = Object.keys(ptr.touches);
  const t0 = ptr.touches[ids[0]];
  const t1 = ptr.touches[ids[1]];
  const dx = t1.x - t0.x;
  const dy = t1.y - t0.y;
  ptr.pinchDist = Math.sqrt(dx * dx + dy * dy);
  ptr.panCenterX = (t0.x + t1.x) / 2;
  ptr.panCenterY = (t0.y + t1.y) / 2;
  ptr.panStartX = camera.x;
  ptr.panStartY = camera.y;
}

function doPinchPan() {
  const ids = Object.keys(ptr.touches);
  const t0 = ptr.touches[ids[0]];
  const t1 = ptr.touches[ids[1]];
  const dx = t1.x - t0.x;
  const dy = t1.y - t0.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Pinch zoom
  if (ptr.pinchDist > 0) {
    camera.zoom = Math.max(0.1, Math.min(10, camera.zoom * (dist / ptr.pinchDist)));
  }

  // Pan (relative to initial finger center)
  const centerX = (t0.x + t1.x) / 2;
  const centerY = (t0.y + t1.y) / 2;
  const panDx = (centerX - ptr.panCenterX) / camera.zoom;
  const panDy = (centerY - ptr.panCenterY) / camera.zoom;
  camera.x = ptr.panStartX - panDx;
  camera.y = ptr.panStartY - panDy;
}

/**
 * Apply camera transform to a world-space point.
 * Returns { sx, sy, sr } screen-space position and radius scale.
 */
export function projectPoint(x, y, z, worldSize, width, height) {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const scale = Math.min(width, height) / worldSize;
  const halfWorld = worldSize * 0.5;

  // Center the world at origin for rotation
  let px = x - halfWorld;
  let py = y - halfWorld;
  let pz = z - halfWorld;

  // Rotate around Y axis (horizontal orbit)
  const cosY = Math.cos(camera.rotY);
  const sinY = Math.sin(camera.rotY);
  const rx1 = px * cosY - pz * sinY;
  const rz1 = px * sinY + pz * cosY;
  const ry1 = py;

  // Rotate around X axis (vertical orbit)
  const cosX = Math.cos(camera.rotX);
  const sinX = Math.sin(camera.rotX);
  const rx2 = rx1;
  const ry2 = ry1 * cosX - rz1 * sinX;
  const rz2 = ry1 * sinX + rz1 * cosX;

  // Apply pan (in world units, after rotation)
  const tx = rx2 + camera.x;
  const ty = ry2 + camera.y;
  const tz = rz2;

  // Perspective projection
  const focal = camera.focalLength;
  const persp = focal / (focal + tz * camera.zoom);
  const screenX = cx + (tx * scale * camera.zoom) * persp;
  const screenY = cy + (ty * scale * camera.zoom) * persp;
  const radiusScale = persp;

  return { sx: screenX, sy: screenY, sr: radiusScale };
}

/**
 * Reset camera to default view.
 */
export function resetCamera() {
  camera.x = 0;
  camera.y = 0;
  camera.zoom = 1.0;
  camera.rotY = 0.6;
  camera.rotX = -0.45;
}

export default camera;
