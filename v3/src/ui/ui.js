/**
 * VEPA v3 — Main UI Orchestrator
 * Initializes all UI panels, wires up tab switching, keyboard shortcuts,
 * and playback controls. Called from main.js after boot.
 */
import { createHUD } from './hud.js';
import { createLawPanel } from './lawPanel.js';
import { createDNAPanel } from './dnaPanel.js';
import { createPresetPanel } from './presetPanel.js';
import { createNarrativePanel } from './narrativePanel.js';
import * as lawState from '../state/lawState.js';
import { serialize } from '../state/lawState.js';
import { getSpeciesDNA, setSpeciesDNA } from '../dna/dnaBuffer.js';

/**
 * Initialize the full UI layer.
 *
 * @param {import('../core/eventBus.js').EventBus} bus
 * @param {{ lowFlags: Uint32Array, highFlags: Uint32Array }} lawStateObj
 * @param {Uint16Array} dnaBuffer
 */
export function initUI(bus, lawStateObj, dnaBuffer) {
  setupTabSwitching();
  setupPlaybackControls(bus);
  setupKeyboardShortcuts(bus);
  setupPresetStateHandler(bus, lawStateObj, dnaBuffer);

  createHUD(bus);
  createLawPanel(bus, lawStateObj);
  createDNAPanel(bus, dnaBuffer);
  createPresetPanel(bus);
  createNarrativePanel(bus);
}

/**
 * Wire up tab switching in the side panel.
 */
function setupTabSwitching() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Deactivate all
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

/**
 * Wire up playback control buttons (play/pause, restart, hard-reset).
 */
function setupPlaybackControls(bus) {
  const playPauseBtn = document.getElementById('play-pause-btn');
  const restartBtn = document.getElementById('restart-btn');
  const hardResetBtn = document.getElementById('hard-reset-btn');

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      bus.emit('sim:togglePause');
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      bus.emit('sim:restart');
    });
  }

  if (hardResetBtn) {
    hardResetBtn.addEventListener('click', () => {
      bus.emit('sim:hardReset');
    });
  }

  // Listen for pause state changes to update button label
  bus.on('sim:paused', ({ paused }) => {
    if (playPauseBtn) {
      playPauseBtn.textContent = paused ? '▶' : '⏸';
    }
  });
}

/**
 * Handle keyboard shortcuts.
 *
 * - Space: toggle pause
 * - R: restart
 * - Shift+R: hard reset
 * - 1-5: switch tabs
 * - Escape: close side panel (future)
 */
function setupKeyboardShortcuts(bus) {
  document.addEventListener('keydown', (e) => {
    // Ignore when typing in an input/select/textarea
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        bus.emit('sim:togglePause');
        break;

      case 'r':
      case 'R':
        if (e.shiftKey) {
          bus.emit('sim:hardReset');
        } else {
          bus.emit('sim:restart');
        }
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5': {
        const tabIdx = parseInt(e.key, 10) - 1;
        const tabs = document.querySelectorAll('.tab-btn');
        if (tabs[tabIdx]) tabs[tabIdx].click();
        break;
      }

      default:
        break;
    }
  });
}

/**
 * Wire up preset state request/response for save/load.
 * Main.js should listen to 'preset:requestState' and emit 'preset:stateResponse'.
 * This handler bridges the preset panel to the actual simulation state.
 */
function setupPresetStateHandler(bus, lawStateObj, dnaBuffer) {
  // Respond to preset save requests
  bus.on('preset:requestState', ({ presetName }) => {
    const law = serialize(lawStateObj);
    const dna = Array.from(getSpeciesDNA(dnaBuffer, 0));
    bus.emit('preset:stateResponse', { presetName, law, dna });
  });

  // Handle preset load
  bus.on('preset:load', ({ name, preset }) => {
    if (preset.law) {
      // Deserialize law state
      const { deserialize } = lawState;
      const restored = deserialize(preset.law);
      lawStateObj.lowFlags = restored.lowFlags;
      lawStateObj.highFlags = restored.highFlags;
      bus.emit('law:sync');
    }

    if (preset.dna) {
      // Restore DNA for all species (clone species 0 to all)
      for (let s = 0; s < 64; s++) {
        setSpeciesDNA(dnaBuffer, s, preset.dna);
      }
      bus.emit('dna:sync');
    }

    bus.emit('narrative:system', { text: `Preset "${name}" loaded.` });
  });
}
