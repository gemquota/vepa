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
  VOID: '∅', BOND: '⛓',
  LIFE: '✦', GLOW: '☀', AFFINITY: '⇌', REPRO: '⚤', TRACK: '⌖', SENESCENCE: '☠',
  ENERGY: '⚡', RADIATION: '☢', GENOTYPE: '🧬', PHENOTYPE: '◈',
  CATALYSIS_LAW: '⚗', SOLVATION: '≈', ACIDITY: '∇', OXIDATION: '🔥', POLYMER: '⛓',
  ISOMERIZATION: '⟳', CHIRALITY: '⇆', CRYSTALLIZATION: '◇', REDUCTION: '▼', ALLOY: '◆',
  HEAT: '☀', COLD: '❄', CONVECTION: '↻', PHASE_RADIATION: '⟐', SUBLIMATION: '⟡',
  MELT: '↕', BOIL: '♨', CONDENSE: '↓', DEPOSIT: '⬇', EXOTHERMIC: '★',
  TIME_DILATION: '⌛', DIMENSIONALITY: '◈', CHAOS: '☄', ORDER: '⊡', FATE: '⚖',
  WILL: '⚔', SOUL_LAW: '👁', MIND: '🧠',
  TELEPATHY: '〰', CLAIRVOYANCE: '◎', PRECOGNITION: '◉', ASTRAL: '👻',
};

// Short names for law grid (max 4 chars)
const LAW_SHORT = {
  GRAV: 'GRV', DRAG: 'DRG', ENTR: 'ENT', WRAP: 'WRP', COLL: 'COL', ACCR: 'ACR',
  PLANETARY: 'PLN', VOID: 'VID', BOND: 'BND',
  LIFE: 'LIF', GLOW: 'GLW', AFFINITY: 'AFF', REPRO: 'REP',
  TRACK: 'TRK', SENESCENCE: 'SEN', ENERGY: 'NRG', RADIATION: 'RAD',
  GENOTYPE: 'GEN', PHENOTYPE: 'PHE',
  CATALYSIS_LAW: 'CAT', SOLVATION: 'SLV', ACIDITY: 'ACD', OXIDATION: 'OXD',
  POLYMER: 'PLY', ISOMERIZATION: 'ISM', CHIRALITY: 'CHR', CRYSTALLIZATION: 'CRY',
  REDUCTION: 'RED', ALLOY: 'ALY',
  HEAT: 'HET', COLD: 'CLD', CONVECTION: 'CNV', PHASE_RADIATION: 'PHR',
  SUBLIMATION: 'SBL', MELT: 'MLT', BOIL: 'BIL', CONDENSE: 'CND', DEPOSIT: 'DEP', EXOTHERMIC: 'EXO',
  TIME_DILATION: 'TME', DIMENSIONALITY: 'DIM', CHAOS: 'CHO', ORDER: 'ORD',
  FATE: 'FAT', WILL: 'WIL', SOUL_LAW: 'SOL', MIND: 'MND',
  TELEPATHY: 'TLP', CLAIRVOYANCE: 'CLV', PRECOGNITION: 'PRC', ASTRAL: 'AST',
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

// Track which law is currently selected for info display
let selectedLawIdx = -1;
let viewMode = 'icon'; // 'icon' or 'word'

/**
 * Create the world panel in the WORLD tab.
 */
export function createWorldPanel(bus, lawStateObj) {
  const grid = document.getElementById('law-grid');
  const params = document.getElementById('world-params');
  if (!grid) return;

  // ── Category filter buttons + view toggle ──
  const filterRow = document.querySelector('.category-filter-row');
  if (filterRow) {
    filterRow.querySelectorAll('.cat-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        applyCategoryFilter(grid, filterRow);
      });
    });

    // Add view mode toggle at the right end
    let toggleBtn = filterRow.querySelector('.view-mode-toggle');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'view-mode-toggle';
      toggleBtn.textContent = 'ABC';
      toggleBtn.title = 'Toggle icon/word view';
      filterRow.appendChild(toggleBtn);
      toggleBtn.addEventListener('click', () => {
        viewMode = viewMode === 'icon' ? 'word' : 'icon';
        toggleBtn.textContent = viewMode === 'icon' ? 'ABC' : '◈◈';
        toggleBtn.classList.toggle('word-mode', viewMode === 'word');
        renderLawGrid(grid, lawStateObj, bus);
      });
    }
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

/**
 * Set the selected law (for info display).
 */
export function setSelectedLaw(idx) {
  selectedLawIdx = idx;
  // Update visual selection on all sq-toggle buttons
  document.querySelectorAll('#law-grid .sq-toggle').forEach((btn) => {
    const lawIdx = parseInt(btn.dataset.law, 10);
    btn.classList.toggle('selected', lawIdx === idx);
  });
}

function renderLawGrid(grid, lawStateObj, bus) {
  const isWordMode = viewMode === 'word';
  // In word mode, use a single-column layout per category
  if (isWordMode) {
    grid.className = 'law-icon-grid word-mode';
  } else {
    grid.className = 'law-icon-grid';
  }
  let html = '';
  for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
    for (const idx of cat.laws) {
      const name = LAW_NAME_BY_IDX[idx] || `LAW_${idx}`;
      const short = LAW_SHORT[name] || name.slice(0, 3);
      const icon = LAW_ICONS[name] || '□';
      const active = isSet(lawStateObj, idx);
      const catClass = `cat-${catName}`;
      const color = LAW_COLOR_BY_INDEX[idx] || 'BLUE';
      const selectedClass = idx === selectedLawIdx ? ' selected' : '';

      if (isWordMode) {
        // Full word mode: icon + name text
        html += `<button class="sq-toggle sq-toggle-word ${catClass}${active ? ' active' : ''}${selectedClass}" `
              + `data-law="${idx}" title="${name}" `
              + `style="${active ? 'border-color:var(--accent-' + color.toLowerCase() + ')' : ''}">`
              + `<span class="tog-icon">${icon}</span>`
              + `<span class="tog-name">${name}</span>`
              + `</button>`;
      } else {
        // Icon mode: just the symbol
        html += `<button class="sq-toggle ${catClass}${active ? ' active' : ''}${selectedClass}" `
              + `data-law="${idx}" title="${name}" `
              + `style="${active ? 'border-color:var(--accent-' + color.toLowerCase() + ')' : ''}">`
              + `${icon}</button>`;
      }
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
      // Update selected law
      setSelectedLaw(idx);
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
    { key: 'WORLD_SIZE', label: 'WORLD SIZE', min: 50, max: 4000, default: 120, step: 10 },
    { key: 'PARTICLE_COUNT', label: 'PARTICLE COUNT', min: 100, max: 20000, default: 1000, step: 100 },
    { key: 'INITIAL_POP', label: 'INITIAL POPULATION', min: 10, max: 5000, default: 200, step: 10 },
    { key: 'MAX_POP', label: 'MAX POPULATION', min: 100, max: 50000, default: 5000, step: 100 },
    { key: 'GLOBAL_G', label: 'GRAVITY STRENGTH', min: 0, max: 20, default: 1, step: 1 },
    { key: 'DAMPING', label: 'MOTION DAMPING %', min: 0, max: 100, default: 10, step: 1 },
    { key: 'SPAWN_RATE', label: 'SPAWN RATE', min: 0, max: 100, default: 10, step: 1 },
    { key: 'BASE_SIZE', label: 'BASE SIZE', min: 0.5, max: 10, default: 2, step: 0.5 },
    { key: 'ENTROPY', label: 'ENTROPY', min: 0, max: 2, default: 0.1, step: 0.05 },
    { key: 'SHAPE', label: 'SPAWN SHAPE', min: 0, max: 1, default: 0.5, step: 0.1 },
    { key: 'GROUND_HEIGHT', label: 'GROUND HEIGHT', min: 0, max: 1, default: 0.9, step: 0.05 },
    { key: 'VISCOSITY', label: 'GLOBAL VISCOSITY', min: 0.5, max: 1, default: 0.98, step: 0.01 },
    { key: 'WIND', label: 'WIND FORCE', min: 0, max: 5, default: 0, step: 0.5 },
    { key: 'HEAT_CAPACITY', label: 'HEAT CAPACITY', min: 0.1, max: 10, default: 1, step: 0.5 },
    { key: 'LIGHT_LEVEL', label: 'LIGHT LEVEL', min: 0, max: 2, default: 0.5, step: 0.1 },
    { key: 'RADIATION_LEVEL', label: 'RADIATION LEVEL', min: 0, max: 5, default: 0, step: 0.5 },
    { key: 'SPECIES_INTERACTION', label: 'SPECIES INTERACTION', min: -2, max: 2, default: 0.5, step: 0.1 },
    { key: 'MUTATION_RATE', label: 'MUTATION RATE', min: 0, max: 5, default: 0.5, step: 0.1 },
    { key: 'ENERGY_TRANSFER', label: 'ENERGY TRANSFER', min: 0, max: 2, default: 0.5, step: 0.1 },
    { key: 'DECAY_RATE', label: 'DECAY RATE', min: 0, max: 2, default: 0.1, step: 0.05 },
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
      const isFloat = slider.dataset.key === 'DAMPING' || slider.dataset.key === 'GLOBAL_G';
      const val = isFloat ? parseFloat(slider.value) : parseInt(slider.value, 10);
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
