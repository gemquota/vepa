/**
 * VEPA v3 — World Panel (WORLD tab)
 * Category filter tabs + law icon grid + world parameter sliders.
 * Mirrors the v2 design with PHYS/BIOL/CHEM/THERMO/META filtering.
 */
import { LAW_INDEXES, LAW_CATEGORIES, LAW_COLOR_BY_INDEX } from '../constants.js';
import { isSet, toggle as toggleLaw } from '../state/lawState.js';

// Law icon symbols (matching v2 aesthetic)
const LAW_ICONS = {
  GRAV: '⬡', DRAG: '≋', ENTR: '~', WRAP: '◯', COLL: '⊕', ACCR: '⊞', PLANETARY: '♁',
  LIFE: '✦', GLOW: '☀', AFFINITY: '⇌', REPRO: '⚤', TRACK: '⌖', SENESCENCE: '☠',
  ENERGY: '⚡', RADIATION: '☢', GENOTYPE: '🧬', PHENOTYPE: '◈',
  CATALYSIS_LAW: '⚗', SOLVATION: '≈', ACIDITY: '∇', OXIDATION: '🔥', POLYMER: '⛓',
  ISOMERIZATION: '⟳', CHIRALITY: '⇆', CRYSTALLIZATION: '◇',
  HEAT: '☀', COLD: '❄', CONVECTION: '↻', PHASE_RADIATION: '⟐', SUBLIMATION: '⟡',
  TIME_DILATION: '⌛', DIMENSIONALITY: '◈', CHAOS: '☄', ORDER: '⊡', FATE: '⚖',
  WILL: '⚔', SOUL_LAW: '👁', MIND: '🧠',
};

// Short names for law grid (max 4 chars)
const LAW_SHORT = {
  GRAV: 'GRV', DRAG: 'DRG', ENTR: 'ENT', WRAP: 'WRP', COLL: 'COL', ACCR: 'ACR',
  PLANETARY: 'PLN', LIFE: 'LIF', GLOW: 'GLW', AFFINITY: 'AFF', REPRO: 'REP',
  TRACK: 'TRK', SENESCENCE: 'SEN', ENERGY: 'NRG', RADIATION: 'RAD',
  GENOTYPE: 'GEN', PHENOTYPE: 'PHE',
  CATALYSIS_LAW: 'CAT', SOLVATION: 'SLV', ACIDITY: 'ACD', OXIDATION: 'OXD',
  POLYMER: 'PLY', ISOMERIZATION: 'ISM', CHIRALITY: 'CHR', CRYSTALLIZATION: 'CRY',
  HEAT: 'HET', COLD: 'CLD', CONVECTION: 'CNV', PHASE_RADIATION: 'PHR',
  SUBLIMATION: 'SBL',
  TIME_DILATION: 'TME', DIMENSIONALITY: 'DIM', CHAOS: 'CHO', ORDER: 'ORD',
  FATE: 'FAT', WILL: 'WIL', SOUL_LAW: 'SOL', MIND: 'MND',
};

// Reverse: law index → name
const LAW_NAME_BY_IDX = {};
for (const [name, idx] of Object.entries(LAW_INDEXES)) {
  LAW_NAME_BY_IDX[idx] = name;
}

// Reverse: law index → category class
const LAW_CAT_CLASS = {};
for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
  for (const idx of cat.laws) {
    LAW_CAT_CLASS[idx] = 'cat-' + catName;
  }
}

/**
 * Create the world panel in the WORLD tab.
 */
export function createWorldPanel(bus, lawStateObj) {
  const grid = document.getElementById('law-grid');
  const params = document.getElementById('world-params');
  if (!grid) return;

  // ── Category filter buttons ──
  const filterRow = document.querySelector('.category-filter-row');
  if (filterRow) {
    filterRow.querySelectorAll('.cat-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        applyCategoryFilter(grid, filterRow);
      });
    });
  }

  // ── Build law icon grid ──
  renderLawGrid(grid, lawStateObj, bus);

  // ── Build world parameter sliders ──
  if (params) {
    renderWorldSliders(params, bus);
  }

  // ── Listen for law sync ──
  bus.on('law:sync', () => renderLawGrid(grid, lawStateObj, bus));
}

function renderLawGrid(grid, lawStateObj, bus) {
  let html = '';
  for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
    for (const idx of cat.laws) {
      const name = LAW_NAME_BY_IDX[idx] || `LAW_${idx}`;
      const short = LAW_SHORT[name] || name.slice(0, 3);
      const icon = LAW_ICONS[name] || '□';
      const active = isSet(lawStateObj, idx);
      const catClass = `cat-${catName}`;
      const color = LAW_COLOR_BY_INDEX[idx] || 'BLUE';

      html += `<button class="sq-toggle ${catClass}${active ? ' active' : ''}" `
            + `data-law="${idx}" title="${name}" `
            + `style="${active ? 'border-color:var(--accent-' + color.toLowerCase() + ')' : ''}">`
            + `${icon}</button>`;
    }
  }
  grid.innerHTML = html;

  // Wire clicks
  grid.querySelectorAll('.sq-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.law, 10);
      toggleLaw(lawStateObj, idx);
      const nowActive = isSet(lawStateObj, idx);
      btn.classList.toggle('active', nowActive);
      const name = LAW_NAME_BY_IDX[idx];
      const color = (LAW_COLOR_BY_INDEX[idx] || 'BLUE').toLowerCase();
      if (nowActive) {
        btn.style.borderColor = `var(--accent-${color})`;
      } else {
        btn.style.borderColor = '';
      }
      bus.emit('law:toggled', {
        lawIndex: idx,
        active: nowActive,
        state: nowActive ? 1 : 0,
      });
    });
  });
}

function renderWorldSliders(container, bus) {
  const params = [
    { key: 'INITIAL_POP', label: 'INITIAL POPULATION', min: 10, max: 10000, default: 500 },
    { key: 'MAX_POP', label: 'MAX POPULATION', min: 100, max: 50000, default: 2000 },
    { key: 'SPAWN_RATE', label: 'SPAWN RATE', min: 0, max: 100, default: 10 },
    { key: 'GLOBAL_G', label: 'GLOBAL G', min: 0, max: 10, default: 1 },
  ];

  let html = '';
  for (const p of params) {
    html += `<div class="world-slider-row">`
          + `<label>${p.label}</label>`
          + `<input type="range" min="${p.min}" max="${p.max}" value="${p.default}" data-key="${p.key}">`
          + `<span class="slider-value" data-key="${p.key}">${p.default}</span>`
          + `</div>`;
  }
  container.innerHTML = html;

  container.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener('input', () => {
      const val = parseInt(slider.value, 10);
      const display = container.querySelector(`.slider-value[data-key="${slider.dataset.key}"]`);
      if (display) display.textContent = val;
      bus.emit('world:paramChanged', { key: slider.dataset.key, value: val });
    });
  });
}

function applyCategoryFilter(grid, filterRow) {
  // Build set of active category names from filter tab data-cat attributes
  const activeCats = new Set();
  filterRow.querySelectorAll('.cat-tab.active').forEach((btn) => {
    activeCats.add(btn.dataset.cat);
  });

  // Map each law button index to its category name
  // Uses a lookup from LAW_NAME_BY_IDX through LAW_CATEGORIES
  const lawIdxToCat = {};
  for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
    for (const idx of cat.laws) {
      lawIdxToCat[idx] = catName;
    }
  }

  grid.querySelectorAll('.sq-toggle').forEach((btn) => {
    const idx = parseInt(btn.dataset.law, 10);
    const catName = lawIdxToCat[idx];
    // Check if this button's category is in the active filters
    // Compare using 'cat-' + catName against the data-cat values
    const visible = catName !== undefined && activeCats.has('cat-' + catName);
    btn.style.display = visible ? '' : 'none';
  });
}
