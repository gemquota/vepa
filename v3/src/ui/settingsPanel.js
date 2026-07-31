/**
 * VEPA v3 — Settings Panel
 * Camera configuration (focal distance, orthographic blend, rotate/pan
 * sensitivity) plus the full law toggle panel.
 */
import { setCameraConfig, resetCamera } from './camera.js';
import { createLawPanel } from './lawPanel.js';

const CAMERA_FIELDS = [
  { key: 'focalLength',       label: 'FOCAL DISTANCE',    min: 400,  max: 4000, step: 50,   value: 1200 },
  { key: 'ortho',             label: 'ORTHOGRAPHIC',      min: 0,    max: 1,    step: 0.05, value: 0 },
  { key: 'rotateSensitivity', label: 'ROTATE SENSITIVITY', min: 0.1, max: 5,    step: 0.1,  value: 1 },
  { key: 'panSensitivity',    label: 'PAN SENSITIVITY',   min: 0.1,  max: 5,    step: 0.1,  value: 1 },
];

/**
 * Build the settings panel into #laws-panel.
 * @param {import('../core/eventBus.js').EventBus} bus
 * @param {{ lowFlags: Uint32Array, highFlags: Uint32Array }} lawStateObj
 */
export function createSettingsPanel(bus, lawStateObj) {
  const panel = document.getElementById('laws-panel');
  if (!panel) return;

  let html = '<div class="panel-section">';
  html += '<h3 class="law-category-header" style="color:#0ff">CAMERA</h3>';

  for (const f of CAMERA_FIELDS) {
    html += `<div class="setting-row">`;
    html += `<label class="setting-label" for="cam-${f.key}">${f.label}</label>`;
    html += `<input id="cam-${f.key}" class="setting-slider" type="range" `;
    html += `min="${f.min}" max="${f.max}" step="${f.step}" value="${f.value}" data-cam-key="${f.key}">`;
    html += `<span class="setting-value" id="cam-val-${f.key}">${f.value}</span>`;
    html += '</div>';
  }

  html += '<div class="setting-row">';
  html += '<button id="cam-reset" class="btn tiny-btn" type="button">RESET CAMERA</button>';
  html += '</div>';
  html += '</div>';

  panel.innerHTML = html;

  // Wire sliders
  for (const input of panel.querySelectorAll('.setting-slider')) {
    const key = input.dataset.camKey;
    const valEl = document.getElementById(`cam-val-${key}`);
    input.addEventListener('input', () => {
      const value = parseFloat(input.value);
      if (valEl) valEl.textContent = value;
      setCameraConfig({ [key]: value });
    });
  }

  const resetBtn = document.getElementById('cam-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetCamera();
      for (const f of CAMERA_FIELDS) {
        const input = document.getElementById(`cam-${f.key}`);
        const valEl = document.getElementById(`cam-val-${f.key}`);
        if (input) input.value = f.value;
        if (valEl) valEl.textContent = f.value;
      }
    });
  }

  // Law toggles below the camera section
  createLawPanel(bus, lawStateObj);
}
