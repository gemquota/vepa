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
  summarizeMultiplex,
  selectShard,
  getFitnessReport,
  MULTIPLEX_DEFAULTS,
  FITNESS_METRICS,
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
export function createMultiplexController(bus, getSource, applyShard) {
  const mx = createMultiplex(bus);
  let overlay = null;
  let grid = null;
  let drawer = null;
  let metricsDrawer = null;
  let metricsFrame = 0;
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

    // Metrics bottom drawer — collapsible per-shard scores + live stats.
    metricsDrawer = document.createElement('div');
    metricsDrawer.id = 'mpx-metrics';
    metricsDrawer.className = 'expanded';
    metricsDrawer.innerHTML = `
      <button id="mpx-metrics-toggle" class="mpx-metrics-toggle" type="button">▼ METRICS</button>
      <div class="mpx-metrics-body">
        <div id="mpx-metrics-chips" class="mpx-metrics-chips"></div>
        <div id="mpx-metrics-stats" class="mpx-metrics-stats"></div>
      </div>`;
    overlay.appendChild(metricsDrawer);
    metricsDrawer.querySelector('#mpx-metrics-toggle').addEventListener('click', () => {
      metricsDrawer.classList.toggle('collapsed');
      const btn = metricsDrawer.querySelector('#mpx-metrics-toggle');
      if (btn) btn.textContent = metricsDrawer.classList.contains('collapsed') ? '▲ METRICS' : '▼ METRICS';
    });

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
        <div class="mpx-stat" id="mpx-stat-live">ALIVE 0 · CAP 0 · ΔSEL — · ΔAVG —</div>
        <div class="mpx-tabs">
          <button class="mpx-tab active" data-mpx-tab="live" type="button">LIVE</button>
          <button class="mpx-tab" data-mpx-tab="fit" type="button">FIT</button>
        </div>
        <div class="mpx-panel active" id="mpx-panel-live">
          <div class="mpx-settings">
            <div class="mpx-settings-title">LIVE SETTINGS</div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">VARIATION</span>
              <input id="mpx-drawer-variation" type="range" min="0" max="1" step="0.05" value="0.5">
              <span class="mpx-set-value" id="mpx-drawer-variation-value">50%</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">LAW VAR</span>
              <input id="mpx-drawer-law-var" type="range" min="0" max="1" step="0.05" value="1">
              <span class="mpx-set-value" id="mpx-drawer-law-var-value">100%</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">DNA VAR</span>
              <input id="mpx-drawer-dna-var" type="range" min="0" max="1" step="0.05" value="1">
              <span class="mpx-set-value" id="mpx-drawer-dna-var-value">100%</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">POP VAR</span>
              <input id="mpx-drawer-pop-var" type="range" min="0" max="1" step="0.05" value="1">
              <span class="mpx-set-value" id="mpx-drawer-pop-var-value">100%</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">RANDOMIZE</span>
              <span class="mpx-checks">
                <label class="mpx-check"><input id="mpx-drawer-rand-laws" type="checkbox" checked><span>LAWS</span></label>
                <label class="mpx-check"><input id="mpx-drawer-rand-dna" type="checkbox" checked><span>DNA</span></label>
                <label class="mpx-check"><input id="mpx-drawer-rand-pop" type="checkbox" checked><span>POP</span></label>
              </span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">DERIVE</span>
              <select id="mpx-drawer-derive">
                <option value="clone">CLONE</option>
                <option value="spawn">SPAWN</option>
              </select>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">GRID</span>
              <label class="mpx-num">C <input id="mpx-drawer-cols" type="number" min="1" max="4" value="2"></label>
              <label class="mpx-num">R <input id="mpx-drawer-rows" type="number" min="1" max="4" value="2"></label>
              <span class="mpx-set-value" id="mpx-drawer-shards">4</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">POP SCALE</span>
              <input id="mpx-drawer-pop-scale" type="range" min="0.25" max="1" step="0.05" value="1">
              <span class="mpx-set-value" id="mpx-drawer-pop-scale-value">100%</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">SEED</span>
              <input id="mpx-drawer-seed" type="number" min="0" max="2147483647" step="1" value="0">
              <span class="mpx-set-value" id="mpx-drawer-seed-value">RANDOM</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">SUBSTEPS</span>
              <input id="mpx-drawer-substeps" type="range" min="1" max="8" step="1" value="1">
              <span class="mpx-set-value" id="mpx-drawer-substeps-value">1</span>
            </div>
            <div class="mpx-set-row">
              <label class="mpx-check"><input id="mpx-drawer-auto-iterate" type="checkbox"><span>AUTO-ITERATE</span></label>
              <span class="mpx-set-value" id="mpx-drawer-auto-value">OFF</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">EVERY</span>
              <input id="mpx-drawer-interval" type="range" min="50" max="2000" step="50" value="400">
              <span class="mpx-set-value" id="mpx-drawer-interval-value">400T</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">AFTER ITERATE</span>
              <select id="mpx-drawer-select-after">
                <option value="none">NONE</option>
                <option value="fittest">FITTEST</option>
                <option value="follow">FOLLOW</option>
              </select>
            </div>
            <div class="mpx-set-row">
              <label class="mpx-check"><input id="mpx-drawer-keep-selected" type="checkbox"><span>KEEP SELECTED</span></label>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">SIM SPEED</span>
              <input id="mpx-drawer-sim-speed" type="range" min="0.25" max="3" step="0.25" value="1">
              <span class="mpx-set-value" id="mpx-drawer-sim-speed-value">1.0×</span>
            </div>
            <div class="mpx-set-row">
              <label class="mpx-check"><input id="mpx-drawer-paused" type="checkbox"><span>PAUSE GRID</span></label>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">MAX ITERS</span>
              <input id="mpx-drawer-max-iters" type="number" min="0" max="999" value="0">
              <span class="mpx-set-value" id="mpx-drawer-max-iters-value">∞</span>
            </div>
            <div class="mpx-set-row">
              <span class="mpx-set-label">DRIFT</span>
              <input id="mpx-drawer-drift" type="range" min="0" max="0.05" step="0.005" value="0">
              <span class="mpx-set-value" id="mpx-drawer-drift-value">0</span>
            </div>
            <div class="mpx-set-row">
              <label class="mpx-check"><input id="mpx-drawer-eco" type="checkbox" checked><span>GPU ECO</span></label>
            </div>
            <div class="mpx-set-row">
              <label class="mpx-check"><input id="mpx-drawer-import-on-exit" type="checkbox" checked><span>IMPORT ON EXIT</span></label>
            </div>
          </div>
        </div>
        <div class="mpx-panel" id="mpx-panel-fit">
          <div class="mpx-settings">
            <div class="mpx-settings-title">FITNESS WEIGHTS</div>
            <div id="mpx-fit-metrics"></div>
            <div class="mpx-fit-title">SHARD SCORES</div>
            <div id="mpx-fit-list" class="mpx-fit-list"></div>
          </div>
        </div>
        <div class="mpx-actions">
          <button id="mpx-iterate" class="mpx-btn mpx-action" title="Regenerate all shards from the selected shard">⚡ ITERATE</button>
          <button id="mpx-exit" class="mpx-btn mpx-action mpx-danger" title="Exit multiplex (imports the selected shard)">✕ EXIT</button>
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
    drawer.querySelectorAll('.mpx-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.mpxTab;
        drawer.querySelectorAll('.mpx-tab').forEach((b) => b.classList.toggle('active', b === btn));
        const livePanel = drawer.querySelector('#mpx-panel-live');
        const fitPanel = drawer.querySelector('#mpx-panel-fit');
        if (livePanel) livePanel.classList.toggle('active', tab === 'live');
        if (fitPanel) fitPanel.classList.toggle('active', tab === 'fit');
      });
    });
    wireDrawerSettings();
    buildFitPanel();

    // Settings modal (long-press the Chaos button)
    buildModal();
  }

  /** Live settings in the right drawer — mutates mx.config directly. */
  function wireDrawerSettings() {
    const clamp = (v, lo, hi, dflt) => Math.max(lo, Math.min(hi, parseInt(v, 10) || dflt));
    const variation = drawer.querySelector('#mpx-drawer-variation');
    const variationValue = drawer.querySelector('#mpx-drawer-variation-value');
    variation.addEventListener('input', () => {
      mx.config.variation = parseFloat(variation.value) || 0;
      variationValue.textContent = Math.round(mx.config.variation * 100) + '%';
    });

    // Per-aspect variation knobs — they apply on the next iterate/build.
    const lawVar = drawer.querySelector('#mpx-drawer-law-var');
    lawVar.addEventListener('input', () => {
      mx.config.lawVariation = parseFloat(lawVar.value) || 0;
      drawer.querySelector('#mpx-drawer-law-var-value').textContent = Math.round(mx.config.lawVariation * 100) + '%';
    });
    const dnaVar = drawer.querySelector('#mpx-drawer-dna-var');
    dnaVar.addEventListener('input', () => {
      mx.config.dnaVariation = parseFloat(dnaVar.value) || 0;
      drawer.querySelector('#mpx-drawer-dna-var-value').textContent = Math.round(mx.config.dnaVariation * 100) + '%';
    });
    const popVar = drawer.querySelector('#mpx-drawer-pop-var');
    popVar.addEventListener('input', () => {
      mx.config.popVariation = parseFloat(popVar.value) || 0;
      drawer.querySelector('#mpx-drawer-pop-var-value').textContent = Math.round(mx.config.popVariation * 100) + '%';
    });

    const randLaws = drawer.querySelector('#mpx-drawer-rand-laws');
    const randDna = drawer.querySelector('#mpx-drawer-rand-dna');
    const randPop = drawer.querySelector('#mpx-drawer-rand-pop');
    randLaws.addEventListener('change', (e) => { mx.config.randomizeLaws = e.target.checked; });
    randDna.addEventListener('change', (e) => { mx.config.randomizeDNA = e.target.checked; });
    randPop.addEventListener('change', (e) => { mx.config.randomizePopulation = e.target.checked; });

    const derive = drawer.querySelector('#mpx-drawer-derive');
    derive.addEventListener('change', (e) => { mx.config.deriveMode = e.target.value; });

    // Grid size applies immediately — it rebuilds the shard grid.
    const cols = drawer.querySelector('#mpx-drawer-cols');
    const rows = drawer.querySelector('#mpx-drawer-rows');
    const shards = drawer.querySelector('#mpx-drawer-shards');
    const applyGrid = () => {
      const c = clamp(cols.value, 1, 4, 2);
      const r = clamp(rows.value, 1, 4, 2);
      cols.value = c;
      rows.value = r;
      shards.textContent = Math.min(MAX_SHARDS, c * r);
      if (c !== (mx.config.cols || 2) || r !== (mx.config.rows || 2)) {
        mx.config.cols = c;
        mx.config.rows = r;
        if (mx.active) iterate();
      }
    };
    cols.addEventListener('change', applyGrid);
    rows.addEventListener('change', applyGrid);

    // POP SCALE and SEED rebuild immediately (new caps / deterministic runs).
    const popScale = drawer.querySelector('#mpx-drawer-pop-scale');
    const popScaleValue = drawer.querySelector('#mpx-drawer-pop-scale-value');
    popScale.addEventListener('input', () => {
      mx.config.populationScale = parseFloat(popScale.value) || 1;
      popScaleValue.textContent = Math.round(mx.config.populationScale * 100) + '%';
    });
    popScale.addEventListener('change', () => { if (mx.active) iterate(); });

    const seed = drawer.querySelector('#mpx-drawer-seed');
    const seedValue = drawer.querySelector('#mpx-drawer-seed-value');
    seed.addEventListener('input', () => {
      mx.config.seed = Math.max(0, parseInt(seed.value, 10) || 0);
      seedValue.textContent = mx.config.seed > 0 ? String(mx.config.seed) : 'RANDOM';
    });
    seed.addEventListener('change', () => { if (mx.active) iterate(); });

    const substeps = drawer.querySelector('#mpx-drawer-substeps');
    const substepsValue = drawer.querySelector('#mpx-drawer-substeps-value');
    substeps.addEventListener('input', () => {
      mx.config.substeps = clamp(substeps.value, 1, 8, 1);
      substepsValue.textContent = String(mx.config.substeps);
    });

    const autoIterate = drawer.querySelector('#mpx-drawer-auto-iterate');
    const autoValue = drawer.querySelector('#mpx-drawer-auto-value');
    autoIterate.addEventListener('change', (e) => {
      mx.config.autoIterate = e.target.checked;
      autoValue.textContent = e.target.checked ? 'ON' : 'OFF';
    });

    const interval = drawer.querySelector('#mpx-drawer-interval');
    const intervalValue = drawer.querySelector('#mpx-drawer-interval-value');
    interval.addEventListener('input', () => {
      mx.config.autoIterateInterval = parseInt(interval.value, 10) || 400;
      intervalValue.textContent = mx.config.autoIterateInterval + 'T';
    });

    const selectAfter = drawer.querySelector('#mpx-drawer-select-after');
    selectAfter.addEventListener('change', (e) => {
      mx.config.selectAfterIterate = e.target.value;
      mx.config.autoSelectFittest = e.target.value === 'fittest';
    });

    const keepSelected = drawer.querySelector('#mpx-drawer-keep-selected');
    keepSelected.addEventListener('change', (e) => {
      mx.config.keepSelected = e.target.checked;
    });

    const simSpeed = drawer.querySelector('#mpx-drawer-sim-speed');
    const simSpeedValue = drawer.querySelector('#mpx-drawer-sim-speed-value');
    simSpeed.addEventListener('input', () => {
      mx.config.simSpeed = parseFloat(simSpeed.value) || 1;
      simSpeedValue.textContent = mx.config.simSpeed.toFixed(2) + '×';
    });

    const paused = drawer.querySelector('#mpx-drawer-paused');
    paused.addEventListener('change', (e) => {
      mx.config.paused = e.target.checked;
    });

    const maxIters = drawer.querySelector('#mpx-drawer-max-iters');
    const maxItersValue = drawer.querySelector('#mpx-drawer-max-iters-value');
    const applyMaxIters = () => {
      mx.config.maxIterations = clamp(maxIters.value, 0, 999, 0);
      maxIters.value = mx.config.maxIterations;
      maxItersValue.textContent = mx.config.maxIterations > 0 ? String(mx.config.maxIterations) : '∞';
    };
    maxIters.addEventListener('change', applyMaxIters);

    const drift = drawer.querySelector('#mpx-drawer-drift');
    const driftValue = drawer.querySelector('#mpx-drawer-drift-value');
    drift.addEventListener('input', () => {
      mx.config.variationDrift = parseFloat(drift.value) || 0;
      driftValue.textContent = String(mx.config.variationDrift);
    });

    const importOnExit = drawer.querySelector('#mpx-drawer-import-on-exit');
    importOnExit.addEventListener('change', (e) => {
      mx.config.importOnExit = e.target.checked;
    });

    const eco = drawer.querySelector('#mpx-drawer-eco');
    eco.addEventListener('change', (e) => {
      mx.config.renderQuality = e.target.checked ? 'eco' : 'full';
    });
  }

  function syncDrawerSettings() {
    if (!drawer || !mx.config) return;
    const setVal = (id, v) => { const el = drawer.querySelector(id); if (el) el.value = v; };
    const setPct = (id, idValue, v) => {
      setVal(id, v);
      const out = drawer.querySelector(idValue);
      if (out) out.textContent = Math.round(v * 100) + '%';
    };
    setVal('#mpx-drawer-variation', mx.config.variation ?? 0.5);
    const vv = drawer.querySelector('#mpx-drawer-variation-value');
    if (vv) vv.textContent = Math.round((mx.config.variation ?? 0.5) * 100) + '%';
    setPct('#mpx-drawer-law-var', '#mpx-drawer-law-var-value', mx.config.lawVariation ?? 1);
    setPct('#mpx-drawer-dna-var', '#mpx-drawer-dna-var-value', mx.config.dnaVariation ?? 1);
    setPct('#mpx-drawer-pop-var', '#mpx-drawer-pop-var-value', mx.config.popVariation ?? 1);
    const rl = drawer.querySelector('#mpx-drawer-rand-laws');
    const rd = drawer.querySelector('#mpx-drawer-rand-dna');
    const rp = drawer.querySelector('#mpx-drawer-rand-pop');
    if (rl) rl.checked = mx.config.randomizeLaws !== false;
    if (rd) rd.checked = mx.config.randomizeDNA !== false;
    if (rp) rp.checked = mx.config.randomizePopulation !== false;
    setVal('#mpx-drawer-derive', mx.config.deriveMode || 'clone');
    setVal('#mpx-drawer-cols', mx.config.cols || 2);
    setVal('#mpx-drawer-rows', mx.config.rows || 2);
    const shards = drawer.querySelector('#mpx-drawer-shards');
    if (shards) shards.textContent = Math.min(MAX_SHARDS, (mx.config.cols || 2) * (mx.config.rows || 2));
    setPct('#mpx-drawer-pop-scale', '#mpx-drawer-pop-scale-value', mx.config.populationScale ?? 1);
    const seed = drawer.querySelector('#mpx-drawer-seed');
    const seedValue = drawer.querySelector('#mpx-drawer-seed-value');
    if (seed) seed.value = mx.config.seed || 0;
    if (seedValue) seedValue.textContent = mx.config.seed > 0 ? String(mx.config.seed) : 'RANDOM';
    setVal('#mpx-drawer-substeps', mx.config.substeps ?? 1);
    const subv = drawer.querySelector('#mpx-drawer-substeps-value');
    if (subv) subv.textContent = String(mx.config.substeps ?? 1);
    const ai = drawer.querySelector('#mpx-drawer-auto-iterate');
    const av = drawer.querySelector('#mpx-drawer-auto-value');
    if (ai) ai.checked = mx.config.autoIterate === true;
    if (av) av.textContent = mx.config.autoIterate === true ? 'ON' : 'OFF';
    setVal('#mpx-drawer-interval', mx.config.autoIterateInterval ?? 400);
    const iv = drawer.querySelector('#mpx-drawer-interval-value');
    if (iv) iv.textContent = (mx.config.autoIterateInterval ?? 400) + 'T';
    const sa = drawer.querySelector('#mpx-drawer-select-after');
    if (sa) sa.value = mx.config.selectAfterIterate || (mx.config.autoSelectFittest ? 'fittest' : 'none');
    const ks = drawer.querySelector('#mpx-drawer-keep-selected');
    if (ks) ks.checked = mx.config.keepSelected === true;
    const ss = drawer.querySelector('#mpx-drawer-sim-speed');
    const ssv = drawer.querySelector('#mpx-drawer-sim-speed-value');
    if (ss) ss.value = mx.config.simSpeed ?? 1;
    if (ssv) ssv.textContent = ((mx.config.simSpeed ?? 1)).toFixed(2) + '×';
    const ps = drawer.querySelector('#mpx-drawer-paused');
    if (ps) ps.checked = mx.config.paused === true;
    const mi = drawer.querySelector('#mpx-drawer-max-iters');
    const miv = drawer.querySelector('#mpx-drawer-max-iters-value');
    if (mi) mi.value = mx.config.maxIterations ?? 0;
    if (miv) miv.textContent = (mx.config.maxIterations ?? 0) > 0 ? String(mx.config.maxIterations) : '∞';
    const dr = drawer.querySelector('#mpx-drawer-drift');
    const drv = drawer.querySelector('#mpx-drawer-drift-value');
    if (dr) dr.value = mx.config.variationDrift ?? 0;
    if (drv) drv.textContent = String(mx.config.variationDrift ?? 0);
    const io = drawer.querySelector('#mpx-drawer-import-on-exit');
    if (io) io.checked = mx.config.importOnExit !== false;
    const eco = drawer.querySelector('#mpx-drawer-eco');
    if (eco) eco.checked = mx.config.renderQuality !== 'full';
  }

  /** Build the 14 metric weight/mode rows (FIT tab). */
  function buildFitPanel() {
    const host = drawer.querySelector('#mpx-fit-metrics');
    if (!host) return;
    host.innerHTML = FITNESS_METRICS.map((key) => `
      <div class="mpx-fit-row" data-metric="${key}">
        <span class="mpx-fit-label" title="${key}">${key.toUpperCase()}</span>
        <input type="range" min="0" max="1" step="0.05" data-metric="${key}">
        <span class="mpx-fit-pct" data-metric="${key}">0%</span>
        <button class="mpx-mode" data-metric="${key}" type="button" title="fitness mode">MAX</button>
      </div>`).join('');
    host.querySelectorAll('input[type="range"]').forEach((slider) => {
      slider.addEventListener('input', () => {
        const key = slider.dataset.metric;
        mx.config.fitnessWeights = { ...mx.config.fitnessWeights, [key]: parseFloat(slider.value) || 0 };
        syncFitMetrics();
        updateFitReadout();
      });
    });
    host.querySelectorAll('.mpx-mode').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.metric;
        const mode = mx.config.fitnessModes[key] === 'min' ? 'max' : 'min';
        mx.config.fitnessModes = { ...mx.config.fitnessModes, [key]: mode };
        syncFitMetrics();
        updateFitReadout();
      });
    });
    syncFitMetrics();
  }

  /** Mirror fitness weights/modes into the FIT rows. */
  function syncFitMetrics() {
    const host = drawer.querySelector('#mpx-fit-metrics');
    if (!host) return;
    for (const key of FITNESS_METRICS) {
      const w = Math.max(0, Math.min(1, parseFloat((mx.config.fitnessWeights || {})[key]) || 0));
      const mode = (mx.config.fitnessModes || {})[key] === 'min' ? 'MIN' : 'MAX';
      const slider = host.querySelector(`input[data-metric="${key}"]`);
      const pct = host.querySelector(`.mpx-fit-pct[data-metric="${key}"]`);
      const btn = host.querySelector(`.mpx-mode[data-metric="${key}"]`);
      if (slider) slider.value = w;
      if (pct) pct.textContent = Math.round(w * 100) + '%';
      if (btn) btn.textContent = mode;
    }
  }

  /** Render the per-shard fitness readout + live Δ stats (FIT tab). */
  function updateFitReadout() {
    const list = drawer.querySelector('#mpx-fit-list');
    const liveStat = drawer.querySelector('#mpx-stat-live');
    if (!mx.active || !mx.shards.length) return;
    const report = getFitnessReport(mx);
    if (list) {
      list.innerHTML = report.perShard.map((e) => {
        const sel = e.id === mx.selected ? ' selected' : '';
        return `<div class="mpx-fit-shard${sel}" data-shard="${e.id}">S${String(e.id + 1).padStart(2, '0')} <span>${e.fitness.toFixed(2)}</span></div>`;
      }).join('');
      list.querySelectorAll('.mpx-fit-shard').forEach((row) => {
        row.addEventListener('click', () => selectShard(mx, parseInt(row.dataset.shard, 10)));
      });
    }
    if (liveStat) {
      const sum = summarizeMultiplex(mx);
      const selEntry = report.perShard.find((e) => e.id === mx.selected);
      liveStat.textContent = `ALIVE ${sum.alive} · CAP ${sum.populationCap} · ΔSEL ${selEntry ? selEntry.metrics.delta.toFixed(2) : '—'} · ΔAVG ${report.avgDelta.toFixed(2)}`;
    }
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
    const imported = mx.shards[mx.selected];
    const importOnExit = mx.config.importOnExit !== false;
    stopMultiplex(mx);
    overlay.classList.remove('active');
    drawer.classList.add('hidden');
    if (imported && importOnExit && applyShard) {
      applyShard(imported);
      if (bus) bus.emit('multiplex:imported', { count: imported.count, speciesCount: imported.speciesCount });
    }
    if (bus) bus.emit('multiplex:exited', {});
  }

  function iterate() {
    if (!mx.active) return;
    iterateMultiplex(mx);
    updateDrawer();
  }

  /** Per-shard fitness chips + live stats in the metrics bottom drawer. */
  function updateMetricsDrawer() {
    if (!metricsDrawer || !mx.active || !mx.shards.length) return;
    const chips = metricsDrawer.querySelector('#mpx-metrics-chips');
    const stats = metricsDrawer.querySelector('#mpx-metrics-stats');
    const report = getFitnessReport(mx);
    if (chips) {
      chips.innerHTML = report.perShard.map((e) => {
        const sel = e.id === mx.selected ? ' selected' : '';
        return `<button class="mpx-metric-chip${sel}" data-shard="${e.id}" type="button">S${String(e.id + 1).padStart(2, '0')} ${e.fitness.toFixed(2)}</button>`;
      }).join('');
      chips.querySelectorAll('.mpx-metric-chip').forEach((c) => {
        c.addEventListener('click', () => selectShard(mx, parseInt(c.dataset.shard, 10)));
      });
    }
    if (stats) {
      const sum = summarizeMultiplex(mx);
      const sel = report.perShard.find((e) => e.id === mx.selected);
      const ms = mx.lastTickMs === undefined ? 0 : mx.lastTickMs;
      stats.textContent = `ALIVE ${sum.alive} · CAP ${sum.populationCap} · ΔSEL ${sel ? sel.metrics.delta.toFixed(2) : '—'} · ΔAVG ${report.avgDelta.toFixed(2)} · ITER ${mx.iteration} · MS ${ms.toFixed(2)}`;
    }
  }

  function updateDrawer() {
    if (!drawer) return;
    syncDrawerSettings();
    const gridStat = drawer.querySelector('#mpx-stat-grid');
    const selStat = drawer.querySelector('#mpx-stat-selected');
    const iterStat = drawer.querySelector('#mpx-stat-iteration');
    if (gridStat) gridStat.textContent = `${mx.config.cols}×${mx.config.rows} · ${mx.shards.length} SIMS`;
    if (selStat) selStat.textContent = `SELECTED S${String(mx.selected + 1).padStart(2, '0')}`;
    if (iterStat) iterStat.textContent = `ITERATION ${mx.iteration}`;
    updateFitReadout();
    updateMetricsDrawer();
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
      if (!mx.active) return;
      stepMultiplex(mx, dt, simSpeed, worldSize);
      if (++metricsFrame % 24 === 0) updateMetricsDrawer();
    },
    render: (worldSize) => {
      if (mx.active) renderMultiplex(mx, worldSize);
    },
    resize: () => {
      if (mx.active) resizeMultiplex(mx);
    },
  };
}
