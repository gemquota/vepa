/**
 * VEPA v3 — Main UI Orchestrator (v2 parity)
 * Initializes all UI panels, wires up tab switching, toolbar controls,
 * and keyboard shortcuts. Called from main.js after boot.
 */
import { createHUD } from './hud.js';
import { createWorldPanel } from './worldPanel.js';
import { createSpeciesPanel } from './speciesPanel.js';
import { createDNAAnalytics } from './dnaAnalytics.js';
import { createNarrativePanel } from './narrativePanel.js';
import { createPresetPanel } from './presetPanel.js';
import { createSettingsPanel } from './settingsPanel.js';
import { initTooltip } from './tooltip.js';

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
  createNarrativePanel(bus);
  createPresetPanel(bus);
  createSettingsPanel(bus, lawStateObj);
  initTooltip(bus, lawStateObj);
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
    let chaosPressTimer = null;
    chaosBtn.addEventListener('pointerdown', () => {
      chaosPressTimer = setTimeout(() => {
        chaosPressTimer = null;
        showChaosMenu(bus);
      }, 600);
    });
    chaosBtn.addEventListener('pointerup', () => {
      if (chaosPressTimer) {
        clearTimeout(chaosPressTimer);
        chaosPressTimer = null;
        // Short click = instant chaos
        bus.emit('sim:chaos');
      }
    });
    chaosBtn.addEventListener('pointerleave', () => {
      if (chaosPressTimer) {
        clearTimeout(chaosPressTimer);
        chaosPressTimer = null;
      }
    });
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


function showChaosMenu(bus) {
  var old = document.getElementById("chaos-menu");
  if (old) old.remove();
  var cats = [
    { id: "physics", label: "PHYS" },
    { id: "biology", label: "BIOL" },
    { id: "chemistry", label: "CHEM" },
    { id: "thermodynamics", label: "THERMO" },
    { id: "metaphysics", label: "META" }
  ];
  var menu = document.createElement("div");
  menu.id = "chaos-menu";
  menu.className = "chaos-menu";
  var html = "<div class=\"chaos-menu-content\">";
  html += "<div class=\"chaos-menu-title\">CHAOS CONTROL</div>";
  html += "<div class=\"chaos-menu-cats\">";
  for (var i = 0; i < cats.length; i++) {
    html += "<label class=\"chaos-cat-row\"><input type=\"checkbox\" data-cat=\"" + cats[i].id + "\" checked><span>" + cats[i].label + "</span></label>";
  }
  html += "</div>";
  html += "<div class=\"chaos-menu-actions\">";
  html += "<button class=\"chaos-btn-action\" data-action=\"randomize\">RANDOMIZE</button>";
  html += "<button class=\"chaos-btn-action\" data-action=\"clear\">CLEAR ALL</button>";
  html += "<button class=\"chaos-btn-action\" data-action=\"close\">CLOSE</button>";
  html += "</div></div>";
  menu.innerHTML = html;
  document.body.appendChild(menu);
  menu.querySelectorAll(".chaos-btn-action").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var action = btn.dataset.action;
      if (action === "close") { menu.remove(); return; }
      if (action === "clear") { bus.emit("sim:chaosClear"); menu.remove(); return; }
      if (action === "randomize") {
        var checked = [];
        menu.querySelectorAll("input[type=\"checkbox\"]:checked").forEach(function(cb) {
          checked.push(cb.dataset.cat);
        });
        bus.emit("sim:chaosSelective", { categories: checked });
        menu.remove();
      }
    });
  });
  menu.addEventListener("click", function(e) {
    if (e.target === menu) menu.remove();
  });
}
