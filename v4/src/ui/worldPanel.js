/**
 * VEPA v3 — World Panel (WORLD tab)
 * Category filter tabs + law grid (icon ⇄ settings-style word mode) +
 * world parameter sliders grouped into accordion sections.
 */
import { LAW_INDEXES, LAW_CATEGORIES, LAW_COLOR_BY_INDEX } from '../constants.js';
import { isSet, toggle as toggleLaw } from '../state/lawState.js';

// Law icon symbols (matching v2 aesthetic)
const LAW_ICONS = {
  GRAV: '⬡', DRAG: '≋', ENTR: '~', WRAP: '◯', COLL: '⊕', ACCR: '⊞', PLANETARY: '♁',
  VOID: '∅', BOND: '⛓',
  LIFE: '✦', GLOW: '☀', AFFINITY: '⇌', REPRO: '⚤', TRACK: '⌖', SENESCENCE: '☠', PREDATION: '⚔',
  ENERGY: '⚡', RADIATION: '☢', GENOTYPE: '🧬', PHENOTYPE: '◈',
  CATALYSIS_LAW: '⚗', SOLVATION: '≈', ACIDITY: '∇', OXIDATION: '🔥', POLYMER: '⛓',
  ISOMERIZATION: '⟳', CHIRALITY: '⇆', CRYSTALLIZATION: '◇', REDUCTION: '▼', ALLOY: '◆',
  HEAT: '☀', COLD: '❄', CONVECTION: '↻', PHASE_RADIATION: '⟐', SUBLIMATION: '⟡',
  MELT: '↕', BOIL: '♨', CONDENSE: '↓', DEPOSIT: '⬇', EXOTHERMIC: '★',
  TIME_DILATION: '⌛', DIMENSIONALITY: '◈', CHAOS: '☄', ORDER: '⊡', FATE: '⚖',
  WILL: '⚔', SOUL_LAW: '👁', MIND: '🧠',
  TELEPATHY: '〰', CLAIRVOYANCE: '◎', PRECOGNITION: '◉', ASTRAL: '👻',
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
    LAW_CAT_CLASS[idx] = catName;
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
        applyCategoryFilter(grid);
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

  // ── Build law grid ──
  renderLawGrid(grid, lawStateObj, bus);

  // ── Build world parameter sliders (accordion groups) ──
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
  document.querySelectorAll('#law-grid .sq-toggle, #law-grid .law-btn').forEach((btn) => {
    const lawIdx = parseInt(btn.dataset.law, 10);
    btn.classList.toggle('selected', lawIdx === idx);
  });
}

function renderLawGrid(grid, lawStateObj, bus) {
  const isWordMode = viewMode === 'word';
  grid.className = isWordMode ? 'law-grid word-mode' : 'law-icon-grid';

  let html = '';
  for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
    for (const idx of cat.laws) {
      const name = LAW_NAME_BY_IDX[idx] || `LAW_${idx}`;
      const icon = LAW_ICONS[name] || '?';
      const active = isSet(lawStateObj, idx);
      const catClass = 'cat-' + catName;
      const selectedClass = idx === selectedLawIdx ? ' selected' : '';
      const color = (LAW_COLOR_BY_INDEX[idx] || 'BLUE').toLowerCase();

      if (isWordMode) {
        // Settings-screen style: full-name text buttons
        html += `<button class="law-btn ${catClass}${active ? ' active' : ''}${selectedClass}" `
              + `data-law="${idx}" title="${name}">${name}</button>`;
      } else {
        // Icon mode: just the symbol
        html += `<button class="sq-toggle ${catClass}${active ? ' active' : ''}${selectedClass}" `
              + `data-law="${idx}" title="${name}" `
              + `style="${active ? 'border-color:var(--accent-' + color + ')' : ''}">`
              + `${icon}</button>`;
      }
    }
  }
  grid.innerHTML = html;

  // Wire clicks
  grid.querySelectorAll('.sq-toggle, .law-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.law, 10);
      toggleLaw(lawStateObj, idx);
      const nowActive = isSet(lawStateObj, idx);
      btn.classList.toggle('active', nowActive);
      const color = (LAW_COLOR_BY_INDEX[idx] || 'BLUE').toLowerCase();
      if (btn.classList.contains('sq-toggle')) {
        btn.style.borderColor = nowActive ? `var(--accent-${color})` : '';
      }
      setSelectedLaw(idx);
      bus.emit('law:toggled', {
        lawIndex: idx,
        active: nowActive,
        state: nowActive ? 1 : 0,
      });
    });
  });

  // Re-apply category filter (word mode re-renders everything)
  applyCategoryFilter(grid);
}

// ── World parameter groups (accordions) ──

const WORLD_PARAM_GROUPS = [
  {
    label: 'SPACE',
    params: [
      { key: 'WORLD_SIZE', label: 'WORLD SIZE', min: 50, max: 20000, default: 2000, step: 100 },
      { key: 'PARTICLE_COUNT', label: 'PARTICLE COUNT', min: 100, max: 20000, default: 1000, step: 100 },
      { key: 'INITIAL_POP', label: 'INITIAL POPULATION', min: 10, max: 5000, default: 250, step: 10 },
      { key: 'MAX_POP', label: 'MAX POPULATION', min: 100, max: 50000, default: 5000, step: 100 },
      { key: 'SHAPE', label: 'SPAWN SHAPE', min: 0, max: 1, default: 0.5, step: 0.1 },
      { key: 'GROUND_HEIGHT', label: 'GROUND HEIGHT', min: 0, max: 1, default: 0.9, step: 0.05 },
    ],
  },
  {
    label: 'PHYSICS',
    params: [
      { key: 'GLOBAL_G', label: 'GRAVITY STRENGTH', min: 0, max: 20, default: 1, step: 1 },
      { key: 'DAMPING', label: 'MOTION DAMPING %', min: 0, max: 100, default: 10, step: 1 },
      { key: 'VISCOSITY', label: 'GLOBAL VISCOSITY', min: 0.5, max: 1, default: 0.98, step: 0.01 },
      { key: 'WIND', label: 'WIND FORCE', min: 0, max: 5, default: 0, step: 0.5 },
      { key: 'ENTROPY', label: 'ENTROPY', min: 0, max: 2, default: 0.1, step: 0.05 },
    ],
  },
  {
    label: 'ENVIRONMENT',
    params: [
      { key: 'HEAT_CAPACITY', label: 'HEAT CAPACITY', min: 0.1, max: 10, default: 1, step: 0.5 },
      { key: 'LIGHT_LEVEL', label: 'LIGHT LEVEL', min: 0, max: 2, default: 0.5, step: 0.1 },
      { key: 'RADIATION_LEVEL', label: 'RADIATION LEVEL', min: 0, max: 5, default: 0, step: 0.5 },
      { key: 'SPAWN_RATE', label: 'SPAWN RATE', min: 0, max: 100, default: 10, step: 1 },
    ],
  },
  {
    label: 'BIOLOGY',
    params: [
      { key: 'SPECIES_INTERACTION', label: 'SPECIES INTERACTION', min: -2, max: 2, default: 0.5, step: 0.1 },
      { key: 'MUTATION_RATE', label: 'MUTATION RATE', min: 0, max: 5, default: 0.5, step: 0.1 },
      { key: 'ENERGY_TRANSFER', label: 'ENERGY TRANSFER', min: 0, max: 2, default: 0.5, step: 0.1 },
      { key: 'DECAY_RATE', label: 'DECAY RATE', min: 0, max: 2, default: 0.1, step: 0.05 },
    ],
  },
];

function renderWorldSliders(container, bus) {
  let html = '<div class="main-accordion">';

  WORLD_PARAM_GROUPS.forEach((group, gi) => {
    const open = gi === 0 ? ' open' : '';
    html += `<div class="accordion-section${open}">`;
    html += `<div class="accordion-header" data-acc="${gi}"><span class="arrow">▶</span>${group.label}</div>`;
    html += '<div class="accordion-body">';
    for (const p of group.params) {
      html += `<div class="accordion-slider-row">`
            + `<label>${p.label}</label>`
            + `<input type="range" min="${p.min}" max="${p.max}" value="${p.default}" step="${p.step}" data-key="${p.key}">`
            + `<span class="slider-value" data-key="${p.key}">${p.default}</span>`
            + `</div>`;
    }
    html += '</div></div>';
  });

  html += '</div>';
  container.innerHTML = html;

  // Accordion toggle
  container.querySelectorAll('.accordion-header').forEach((header) => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('open');
    });
  });

  // Slider wiring
  container.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener('input', () => {
      const val = parseFloat(slider.value);
      const display = container.querySelector(`.slider-value[data-key="${slider.dataset.key}"]`);
      if (display) display.textContent = val;
      bus.emit('world:paramChanged', { key: slider.dataset.key, value: val });
    });
  });
}

function applyCategoryFilter(grid) {
  const filterRow = document.querySelector('.category-filter-row');
  if (!filterRow) return;
  // Build set of active category names from filter tab data-cat attributes
  const activeCats = new Set();
  filterRow.querySelectorAll('.cat-tab.active').forEach((btn) => {
    activeCats.add(btn.dataset.cat);
  });

  const lawIdxToCat = {};
  for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
    for (const idx of cat.laws) {
      lawIdxToCat[idx] = catName;
    }
  }

  grid.querySelectorAll('.sq-toggle, .law-btn').forEach((btn) => {
    const idx = parseInt(btn.dataset.law, 10);
    const catName = lawIdxToCat[idx];
    const visible = catName !== undefined && activeCats.has('cat-' + catName);
    btn.style.display = visible ? '' : 'none';
  });
}
