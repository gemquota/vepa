/**
 * VEPA v3 — 3D Camera + Touch/Mouse Controls
 * Manages pan, zoom, and orbit for the 3D viewport.
 */
const camera = {
  x: 0,
  y: 0,
  zoom: 1.0,
  rotY: 0,       // horizontal orbit (radians)
  rotX: 0,       // vertical orbit (radians)
  focalLength: 1800,
};

// ── Touch/mouse state ──
let touchState = {
  touches: [],
  lastPinchDist: 0,
  lastAngle: 0,
  isDragging: false,
  lastX: 0,
  lastY: 0,
  dragStartX: 0,
  dragStartY: 0,
  lastPanX: 0,
  lastPanY: 0,
};

/**
 * Initialize camera controls on a canvas element.
 */
export function initCamera(canvas) {
  if (!canvas) return;

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  // Touch events for pinch/rotate
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });
}

function onPointerDown(e) {
  touchState.isDragging = true;
  touchState.lastX = e.clientX;
  touchState.lastY = e.clientY;
  touchState.dragStartX = e.clientX;
  touchState.dragStartY = e.clientY;
  touchState.lastPanX = camera.x;
  touchState.lastPanY = camera.y;
}

function onPointerMove(e) {
  if (!touchState.isDragging) return;
  // Single finger = pan
  const dx = (e.clientX - touchState.lastX) / camera.zoom;
  const dy = (e.clientY - touchState.lastY) / camera.zoom;
  camera.x -= dx;
  camera.y -= dy;
  touchState.lastX = e.clientX;
  touchState.lastY = e.clientY;
}

function onPointerUp() {
  touchState.isDragging = false;
  touchState.touches = [];
}

function onWheel(e) {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  camera.zoom *= delta;
  camera.zoom = Math.max(0.1, Math.min(10, camera.zoom));
}

// ── Touch gesture handling ──
let touchIds = {};

function onTouchStart(e) {
  e.preventDefault();
  for (const t of e.changedTouches) {
    touchIds[t.identifier] = { x: t.clientX, y: t.clientY };
  }
  const count = Object.keys(touchIds).length;
  if (count === 1) {
    // Single touch = pan
    const t = e.changedTouches[0];
    touchState.isDragging = true;
    touchState.lastX = t.clientX;
    touchState.lastY = t.clientY;
    touchState.lastPanX = camera.x;
    touchState.lastPanY = camera.y;
  } else if (count === 2) {
    touchState.isDragging = false;
    const ids = Object.keys(touchIds);
    const t0 = touchIds[ids[0]];
    const t1 = touchIds[ids[1]];
    const dx = t1.x - t0.x;
    const dy = t1.y - t0.y;
    touchState.lastPinchDist = Math.sqrt(dx * dx + dy * dy);
    touchState.lastAngle = Math.atan2(dy, dx);
  }
}

function onTouchMove(e) {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (touchIds[t.identifier]) {
      touchIds[t.identifier].x = t.clientX;
      touchIds[t.identifier].y = t.clientY;
    }
  }
  const ids = Object.keys(touchIds);
  if (ids.length === 1) {
    // Pan
    const t = e.changedTouches[0];
    const dx = (t.clientX - touchState.lastX) / camera.zoom;
    const dy = (t.clientY - touchState.lastY) / camera.zoom;
    camera.x -= dx;
    camera.y -= dy;
    touchState.lastX = t.clientX;
    touchState.lastY = t.clientY;
  } else if (ids.length >= 2) {
    const t0 = touchIds[ids[0]];
    const t1 = touchIds[ids[1]];
    const dx = t1.x - t0.x;
    const dy = t1.y - t0.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    if (touchState.lastPinchDist > 0) {
      // Pinch zoom
      const scale = dist / touchState.lastPinchDist;
      camera.zoom *= scale;
      camera.zoom = Math.max(0.1, Math.min(10, camera.zoom));
    }
    // Two-finger rotate
    const angleDelta = angle - touchState.lastAngle;
    camera.rotY += angleDelta * 1.5;

    touchState.lastPinchDist = dist;
    touchState.lastAngle = angle;
  }
}

function onTouchEnd(e) {
  for (const t of e.changedTouches) {
    delete touchIds[t.identifier];
  }
  if (Object.keys(touchIds).length === 0) {
    touchState.isDragging = false;
    touchState.lastPinchDist = 0;
  }
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
  let pz = z;

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

  // Apply pan (in world units, before projection)
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
  camera.rotY = 0;
  camera.rotX = 0;
}

export default camera;
