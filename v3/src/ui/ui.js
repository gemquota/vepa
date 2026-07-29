/**
 * VEPA v3 — Main UI Orchestrator (v2 parity)
 * Initializes all UI panels, wires up tab switching, toolbar controls,
 * and keyboard shortcuts. Called from main.js after boot.
 */
import { createHUD } from './hud.js';
import { createWorldPanel } from './worldPanel.js';
import { createSpeciesPanel } from './speciesPanel.js';
import { createDNAAnalytics } from './dnaAnalytics.js';
import { createLawPanel } from './lawPanel.js';
import { createNarrativePanel } from './narrativePanel.js';
import { createPresetPanel } from './presetPanel.js';

/**
 * Initialize the full UI layer.
 */
export function initUI(bus, lawStateObj, dnaBuffer) {
  setupTabSwitching();
  setupToolbarControls(bus);
  setupKeyboardShortcuts(bus);

  createHUD(bus);
  createWorldPanel(bus, lawStateObj);
  createSpeciesPanel(bus, dnaBuffer);
  createDNAAnalytics(bus);
  createLawPanel(bus, lawStateObj);
  createNarrativePanel(bus);
  createPresetPanel(bus);
}

function setupTabSwitching() {
  document.querySelectorAll('#main-panel .tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#main-panel .tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('#main-panel .tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

function setupToolbarControls(bus) {
  const playPauseBtn = document.getElementById('play-pause-btn');
  const restartBtn = document.getElementById('restart-btn');
  const hardResetBtn = document.getElementById('hard-reset-btn');
  const chaosBtn = document.getElementById('chaos-btn');
  const helpToggle = document.getElementById('help-toggle');
  const rewindBtn = document.getElementById('btn-rewind');
  const reverseBtn = document.getElementById('btn-reverse');
  const playBtn = document.getElementById('btn-play');
  const ffBtn = document.getElementById('btn-fastforward');

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => bus.emit('sim:togglePause'));
  }
  if (restartBtn) {
    restartBtn.addEventListener('click', () => bus.emit('sim:restart'));
  }
  if (hardResetBtn) {
    hardResetBtn.addEventListener('click', () => bus.emit('sim:hardReset'));
  }
  if (chaosBtn) {
    chaosBtn.addEventListener('click', () => bus.emit('sim:chaos'));
  }
  if (helpToggle) {
    helpToggle.addEventListener('click', () => bus.emit('help:toggle'));
  }
  if (rewindBtn) {
    rewindBtn.addEventListener('click', () => bus.emit('sim:playbackMode', { mode: 'rewind' }));
  }
  if (reverseBtn) {
    reverseBtn.addEventListener('click', () => bus.emit('sim:playbackMode', { mode: 'reverse' }));
  }
  if (playBtn) {
    playBtn.addEventListener('click', () => bus.emit('sim:playbackMode', { mode: 'forward' }));
  }
  if (ffBtn) {
    ffBtn.addEventListener('click', () => bus.emit('sim:playbackMode', { mode: 'fastforward' }));
  }

  bus.on('sim:paused', ({ paused }) => {
    if (playPauseBtn) {
      playPauseBtn.textContent = paused ? '▶' : '⏸';
      playPauseBtn.classList.toggle('active', !paused);
    }
  });
}

function setupKeyboardShortcuts(bus) {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        bus.emit('sim:togglePause');
        break;
      case 'r':
      case 'R':
        if (e.shiftKey) { bus.emit('sim:hardReset'); }
        else { bus.emit('sim:restart'); }
        break;
      case '1': case '2': case '3': case '4': case '5': {
        const tabIdx = parseInt(e.key, 10) - 1;
        const tabs = document.querySelectorAll('#main-panel .tab-btn');
        if (tabs[tabIdx]) tabs[tabIdx].click();
        break;
      }
      default: break;
    }
  });
}
