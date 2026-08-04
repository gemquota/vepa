// ============================================================================
// VEPA v4 — Chaos Multiplex UI
// Owns the long-press settings modal, the full-screen shard grid overlay,
// and the right-edge drawer (minimizable, always showing an iterate button).
// ============================================================================

import {
  createMultiplex,
  startMultiplex,
  stopMultiplex,
  iterateMultiplex,
  stepMultiplex,
  renderMultiplex,
  resizeMultiplex,
  MULTIPLEX_DEFAULTS,
  MAX_SHARDS,
} from './multiplex.js';

const MODAL_ID = 'chaos-modal';
const OVERLAY_ID = 'multiplex-overlay';
const GRID_ID = 'multiplex-grid';
const DRAWER_ID = 'multiplex-drawer';

/**
 * Create the multiplex controller.
 *
 * @param {object} bus        - App event bus
 * @param {Function} getSource - Returns the current source sim:
 *   { view, count, dna, laws, speciesCount }
 * @returns Controller with { mx, openModal, closeModal, exit, iterate,
 *   isActive, step, render, resize }
 */
export function createMultiplexController(bus, getSource) {
  const mx = createMultiplex(bus);
  let overlay = null;
  let grid = null;
  let drawer = null;
  let domReady = false;

  // ── DOM scaffolding (created lazily on first use) ──

  function ensureDom() {
    if (domReady) return;
    domReady = true;

    // Full-screen grid overlay
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    grid = document.createElement('div');
    grid.id = GRID_ID;
    overlay.appendChild(grid);
    document.body.appendChild(overlay);

    // Right-edge drawer
    drawer = document.createElement('div');
    drawer.id = DRAWER_ID;
    drawer.className = 'minimized hidden';
    drawer.innerHTML = `
      <div class="mpx-strip" title="Expand multiplex controls">
        <button id="mpx-iterate-strip" class="mpx-btn mpx-icon" title="Iterate multiplex">⚡</button>
        <span class="mpx-chevron">◀</span>
      </div>
      <div class="mpx-body">
        <div class="mpx-body-header">
          <span class="mpx-title">MULTIPLEX</span>
          <button id="mpx-minimize" class="mpx-btn mpx-icon" title="Minimize">▸</button>
        </div>
        <div class="mpx-stat" id="mpx-stat-grid">—</div>
        <div class="mpx-stat" id="mpx-stat-selected">SELECTED —</div>
        <div class="mpx-stat" id="mpx-stat-iteration">ITERATION 0</div>
        <div class="mpx-actions">
          <button id="mpx-iterate" class="mpx-btn mpx-action" title="Regenerate all shards from the selected shard">⚡ ITERATE</button>
          <button id="mpx-exit" class="mpx-btn mpx-action mpx-danger" title="Exit multiplex">✕ EXIT</button>
        </div>
      </div>`;
    document.body.appendChild(drawer);

    drawer.querySelector('#mpx-iterate-strip').addEventListener('click', (e) => {
      e.stopPropagation();
      iterate();
    });
    drawer.querySelector('.mpx-strip').addEventListener('click', () => {
      drawer.classList.remove('minimized');
      drawer.classList.add('expanded');
      updateDrawer();
    });
    drawer.querySelector('#mpx-minimize').addEventListener('click', () => {
      drawer.classList.remove('expanded');
      drawer.classList.add('minimized');
    });
    drawer.querySelector('#mpx-iterate').addEventListener('click', iterate);
    drawer.querySelector('#mpx-exit').addEventListener('click', exit);

    // Settings modal (long-press the Chaos button)
    buildModal();
  }

  function buildModal() {
    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div class="chaos-modal-panel">
        <div class="chaos-modal-title">CHAOS MULTIPLEX</div>
        <p class="chaos-modal-sub">Guided evolution — X×Y concurrent futures, one shared camera.</p>

        <div class="chaos-modal-section">
          <div class="chaos-modal-label">GRID</div>
          <div class="chaos-grid-row">
            <label>Columns <input id="mpx-cols" type="number" min="1" max="4" value="2"></label>
            <label>Rows <input id="mpx-rows" type="number" min="1" max="4" value="2"></label>
            <span class="chaos-grid-count" id="mpx-shard-count">4 SIMS</span>
          </div>
        </div>

        <div class="chaos-modal-section">
          <div class="chaos-modal-label">RANDOMIZE ASPECTS</div>
          <label class="chaos-check"><input id="mpx-rand-laws" type="checkbox" checked><span>Laws</span></label>
          <label class="chaos-check"><input id="mpx-rand-dna" type="checkbox" checked><span>DNA</span></label>
          <label class="chaos-check"><input id="mpx-rand-pop" type="checkbox" checked><span>Population</span></label>
        </div>

        <div class="chaos-modal-section">
          <div class="chaos-modal-label">VARIATION BETWEEN SHARDS</div>
          <input id="mpx-variation" type="range" min="0" max="1" step="0.05" value="0.5">
          <div class="chaos-variation-row">
            <span>IDENTICAL</span><span id="mpx-variation-value">50%</span><span>WILD</span>
          </div>
        </div>

        <div class="chaos-modal-section">
          <div class="chaos-modal-label">DERIVED FROM THE SELECTED SIMULATION</div>
          <label class="chaos-radio"><input type="radio" name="mpx-derive" value="clone" checked><span>Clone — copy positions, DNA &amp; laws, then vary</span></label>
          <label class="chaos-radio"><input type="radio" name="mpx-derive" value="spawn"><span>Spawn — fresh population, keep DNA &amp; laws</span></label>
        </div>

        <div class="chaos-modal-actions">
          <button id="mpx-start" class="mpx-btn mpx-action">⚡ START MULTIPLEX</button>
          <button id="mpx-cancel" class="mpx-btn mpx-action mpx-danger">CANCEL</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    modal.querySelector('#mpx-cancel').addEventListener('click', closeModal);
    modal.querySelector('#mpx-start').addEventListener('click', () => {
      begin(modal._readConfig());
      closeModal();
    });
    const cols = modal.querySelector('#mpx-cols');
    const rows = modal.querySelector('#mpx-rows');
    const count = modal.querySelector('#mpx-shard-count');
    const variation = modal.querySelector('#mpx-variation');
    const variationValue = modal.querySelector('#mpx-variation-value');
    const refreshCount = () => {
      const c = Math.max(1, Math.min(4, parseInt(cols.value, 10) || 1));
      const r = Math.max(1, Math.min(4, parseInt(rows.value, 10) || 1));
      const total = Math.min(MAX_SHARDS, c * r);
      count.textContent = total + ' SIMS';
    };
    cols.addEventListener('input', refreshCount);
    rows.addEventListener('input', refreshCount);
    variation.addEventListener('input', () => {
      variationValue.textContent = Math.round(variation.value * 100) + '%';
    });

    modal._readConfig = () => {
      const c = Math.max(1, Math.min(4, parseInt(cols.value, 10) || 1));
      const r = Math.max(1, Math.min(4, parseInt(rows.value, 10) || 1));
      return {
        cols: c,
        rows: r,
        randomizeLaws: modal.querySelector('#mpx-rand-laws').checked,
        randomizeDNA: modal.querySelector('#mpx-rand-dna').checked,
        randomizePopulation: modal.querySelector('#mpx-rand-pop').checked,
        variation: parseFloat(variation.value) || 0,
        deriveMode: (modal.querySelector('input[name="mpx-derive"]:checked') || {}).value || 'clone',
      };
    };
  }

  function populateModal(config) {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    const c = config || MULTIPLEX_DEFAULTS;
    modal.querySelector('#mpx-cols').value = c.cols || 2;
    modal.querySelector('#mpx-rows').value = c.rows || 2;
    modal.querySelector('#mpx-rand-laws').checked = c.randomizeLaws !== false;
    modal.querySelector('#mpx-rand-dna').checked = c.randomizeDNA !== false;
    modal.querySelector('#mpx-rand-pop').checked = c.randomizePopulation !== false;
    modal.querySelector('#mpx-variation').value = c.variation || 0;
    modal.querySelector('#mpx-variation-value').textContent = Math.round((c.variation || 0) * 100) + '%';
    const derive = modal.querySelector(`input[name="mpx-derive"][value="${c.deriveMode || 'clone'}"]`);
    if (derive) derive.checked = true;
    const cols = modal.querySelector('#mpx-cols');
    const rows = modal.querySelector('#mpx-rows');
    const total = Math.min(MAX_SHARDS, (parseInt(cols.value, 10) || 1) * (parseInt(rows.value, 10) || 1));
    modal.querySelector('#mpx-shard-count').textContent = total + ' SIMS';
  }

  // ── Public actions ──

  function openModal() {
    ensureDom();
    populateModal(mx.active ? mx.config : MULTIPLEX_DEFAULTS);
    document.getElementById(MODAL_ID).classList.add('open');
  }

  function closeModal() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) modal.classList.remove('open');
  }

  function begin(config) {
    ensureDom();
    // Derive from the selected simulation — the selected shard while a
    // multiplex is running, otherwise the main sim.
    const source = (mx.active && mx.shards[mx.selected]) ? mx.shards[mx.selected] : getSource();
    startMultiplex(mx, source, config, grid);
    overlay.classList.add('active');
    drawer.classList.remove('hidden');
    drawer.classList.remove('expanded');
    drawer.classList.add('minimized');
    updateDrawer();
    if (bus) bus.emit('multiplex:started', { cols: mx.config.cols, rows: mx.config.rows });
  }

  function exit() {
    if (!mx.active) return;
    stopMultiplex(mx);
    overlay.classList.remove('active');
    drawer.classList.add('hidden');
    if (bus) bus.emit('multiplex:exited', {});

  }

  function iterate() {
    if (!mx.active) return;
    iterateMultiplex(mx);
    updateDrawer();
  }

  function updateDrawer() {
    if (!drawer) return;
    const gridStat = drawer.querySelector('#mpx-stat-grid');
    const selStat = drawer.querySelector('#mpx-stat-selected');
    const iterStat = drawer.querySelector('#mpx-stat-iteration');
    if (gridStat) gridStat.textContent = `${mx.config.cols}×${mx.config.rows} · ${mx.shards.length} SIMS`;
    if (selStat) selStat.textContent = `SELECTED S${String(mx.selected + 1).padStart(2, '0')}`;
    if (iterStat) iterStat.textContent = `ITERATION ${mx.iteration}`;
  }

  // Re-select / stats refresh comes through the bus too.
  if (bus) {
    bus.on('multiplex:selected', updateDrawer);
  }

  return {
    mx,
    openModal,
    closeModal,
    exit,
    iterate,
    isActive: () => mx.active,
    step: (dt, simSpeed, worldSize) => {
      if (mx.active) stepMultiplex(mx, dt, simSpeed, worldSize);
    },
    render: (worldSize) => {
      if (mx.active) renderMultiplex(mx, worldSize);
    },
    resize: () => {
      if (mx.active) resizeMultiplex(mx);
    },
  };
}
