/**
 * VEPA v3 — World Panel (WORLD tab)
 * Category filter tabs + law grid (icon ⇄ settings-style word mode) +
 * world parameter sliders grouped into accordion sections.
 */
import { LAW_INDEXES, LAW_CATEGORIES, LAW_COUNT } from '../constants.js';
import { isSet, set as setLaw, clear as clearLaw, toggle as toggleLaw } from '../state/lawState.js';

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
  COMMS: '◍',
  CHARGE_LAW: '±', FIELD: '✺', CURRENT: '⇥', RESISTANCE: 'Ω', CAPACITANCE: '∥',
  INDUCTANCE: '∿', MAGNETISM: '🧲', RESONANCE: '♫', FLUX: '⇄', IONIZATION: '⚛',
  MEMORY: '💾', PATTERN: '▦', STIGMERGY: '🐜', SIGNAL_BOOST: '📶', LEARN: '🎓',
  SYMBOL: '☯', METRIC: '📏', PREDICT: '🔮', CODE: '✜', PROTOCOL: '📡',
  SINGULARITY: '⬤', ENTANGLEMENT: '⚭', HISTORY: '📜',
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
let viewMode = 'icon';  // 'icon' | 'word' — which mode the law grid shows
let lawsHidden = false; // hide the law grid entirely

// ── Law set presets (theorycrafted) ─────────────────────────────
// Each preset lists law names; indices resolve via LAW_INDEXES at load.
export const LAW_SET_PRESETS = [
  { name: 'PRIME DIRECTIVE', laws: ['GRAV', 'DRAG', 'WRAP', 'COLL'] },
  { name: 'ORIGIN SOUP', laws: ['LIFE', 'REPRO', 'ENERGY', 'AFFINITY'] },
  { name: 'NEUTRON STAR', laws: ['GRAV', 'ACCR', 'PLANETARY', 'HEAT', 'COLD'] },
  { name: 'PREDATOR PREY', laws: ['TRACK', 'PREDATION', 'AFFINITY', 'REPRO'] },
  { name: 'CRYSTAL GARDEN', laws: ['CRYSTALLIZATION', 'BOND', 'COLL', 'ISOMERIZATION'] },
  { name: 'CHEMICAL REACTOR', laws: ['CATALYSIS_LAW', 'SOLVATION', 'ACIDITY', 'OXIDATION', 'REDUCTION', 'HEAT'] },
  { name: 'HIVE MIND', laws: ['COMMS', 'MIND', 'AFFINITY', 'TELEPATHY', 'ENERGY'] },
  { name: 'GHOST NATION', laws: ['SOUL_LAW', 'ASTRAL', 'TELEPATHY', 'CLAIRVOYANCE', 'PRECOGNITION'] },
  { name: 'THERMAL ENGINE', laws: ['HEAT', 'COLD', 'CONVECTION', 'PHASE_RADIATION', 'SUBLIMATION', 'MELT', 'BOIL', 'CONDENSE', 'DEPOSIT', 'EXOTHERMIC'] },
  { name: 'ENTROPY MAX', laws: ['ENTR', 'TIME_DILATION', 'CHAOS', 'SENESCENCE'] },
  { name: 'ORDER FORGE', laws: ['ORDER', 'FATE', 'WILL', 'CRYSTALLIZATION'] },
  { name: 'GENESIS', laws: ['LIFE', 'GENOTYPE', 'PHENOTYPE', 'REPRO', 'TRACK'] },
  { name: 'GRAVITY WELL', laws: ['GRAV', 'PLANETARY', 'ACCR', 'TIME_DILATION'] },
  { name: 'BIO CHEM', laws: ['LIFE', 'CATALYSIS_LAW', 'SOLVATION', 'ENERGY'] },
  { name: 'PSYCHIC NET', laws: ['MIND', 'COMMS', 'TELEPATHY', 'CLAIRVOYANCE'] },
  { name: 'DEEP SPACE', laws: ['VOID', 'COLD', 'ASTRAL', 'SOUL_LAW', 'DRAG'] },
  { name: 'POLYMER LAB', laws: ['POLYMER', 'BOND', 'ISOMERIZATION', 'CHIRALITY'] },
  { name: 'SUPERCONDUCTOR', laws: ['ALLOY', 'COLD', 'BOND', 'HEAT', 'SUPERCONDUCTIVITY'] },
  { name: 'CHRONOS', laws: ['TIME_DILATION', 'DIMENSIONALITY', 'FATE', 'PRECOGNITION'] },
  { name: 'CHAOS THEORY', laws: ['CHAOS', 'ENTR', 'WILL', 'FATE'] },
  { name: 'ELECTRIC STORM', laws: ['CHARGE_LAW', 'FIELD', 'CURRENT', 'IONIZATION', 'DISCHARGE', 'PLASMA'] },
  { name: 'NEURAL WEB', laws: ['MEMORY', 'LEARN', 'SYMBOL', 'LANGUAGE', 'FEEDBACK', 'CULTURE'] },
  { name: 'CRYO CURRENT', laws: ['SUPERCONDUCTIVITY', 'COLD', 'CURRENT', 'RESISTANCE', 'FLUX', 'CONDENSE'] },
];

const LAW_SET_STORAGE = 'vepa.lawsets.v1';

function loadSavedLawSets() {
  try {
    const raw = localStorage.getItem(LAW_SET_STORAGE);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function persistLawSets(sets) {
  try { localStorage.setItem(LAW_SET_STORAGE, JSON.stringify(sets)); } catch { /* storage may be unavailable */ }
}

/** Resolve a preset's law list (names or indices) to concrete indices. */
function resolvePresetLaws(preset) {
  const out = [];
  for (const l of preset.laws || []) {
    const i = typeof l === 'number' ? l : LAW_INDEXES[l];
    if (i !== undefined && i < LAW_COUNT) out.push(i);
  }
  return out;
}

/**
 * Create the world panel in the WORLD tab.
 */
export function createWorldPanel(bus, lawStateObj) {
  const grid = document.getElementById('law-grid');
  const params = document.getElementById('world-params');
  if (!grid) return;

  // ── Category filter buttons + exclusive view-mode group ──
  const filterRow = document.querySelector('.category-filter-row');
  if (filterRow) {
    filterRow.querySelectorAll('.cat-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        applyCategoryFilter(grid);
      });
    });

    // [◈ icon] [ABC list] [✕ hide] — exactly one mode active at a time;
    // tapping the already-selected mode hides the law grid instead.
    let group = filterRow.querySelector('.view-mode-group');
    if (!group) {
      group = document.createElement('div');
      group.className = 'view-mode-group';
      const btnIcon = document.createElement('button');
      btnIcon.className = 'view-mode-toggle law-mode-icon';
      btnIcon.title = 'Icon mode — tap again to hide laws';
      btnIcon.textContent = '◈';
      const btnWord = document.createElement('button');
      btnWord.className = 'view-mode-toggle law-mode-abc';
      btnWord.title = 'List mode — tap again to hide laws';
      btnWord.textContent = 'ABC';
      const btnHide = document.createElement('button');
      btnHide.className = 'view-mode-toggle law-mode-hide';
      btnHide.title = 'Show / hide laws';
      btnHide.textContent = '✕';
      group.append(btnIcon, btnWord, btnHide);
      filterRow.appendChild(group);

      const sync = () => {
        btnIcon.classList.toggle('active', !lawsHidden && viewMode === 'icon');
        btnWord.classList.toggle('active', !lawsHidden && viewMode === 'word');
        btnHide.classList.toggle('active', lawsHidden);
        renderLawGrid(grid, lawStateObj, bus);
      };
      btnIcon.addEventListener('click', () => {
        if (lawsHidden) lawsHidden = false;
        else if (viewMode === 'icon') lawsHidden = true;
        viewMode = 'icon';
        sync();
      });
      btnWord.addEventListener('click', () => {
        if (lawsHidden) lawsHidden = false;
        else if (viewMode === 'word') lawsHidden = true;
        viewMode = 'word';
        sync();
      });
      btnHide.addEventListener('click', () => {
        lawsHidden = !lawsHidden;
        sync();
      });
    }
  }

  // ── Build law grid ──
  renderLawGrid(grid, lawStateObj, bus);

  // ── Law set bar: save / load presets with a mini-icon dropdown ──
  setupLawSets(grid, bus, lawStateObj);

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
  grid.className = lawsHidden ? 'law-grid hidden'
    : isWordMode ? 'law-grid word-mode' : 'law-icon-grid';

  let html = '';
  // One row per law category (physics / biology / chemistry / thermo / meta)
  for (const [catName, cat] of Object.entries(LAW_CATEGORIES)) {
    const colorName = (cat.color || 'BLUE').toLowerCase();
    html += `<div class="law-cat-row" data-cat-row="${catName}">`;
    html += `<div class="law-cat-label" style="color:var(--accent-${colorName})">${catName}</div>`;
    for (const idx of cat.laws) {
      const name = LAW_NAME_BY_IDX[idx] || `LAW_${idx}`;
      const icon = LAW_ICONS[name] || '?';
      const active = isSet(lawStateObj, idx);
      const catClass = 'cat-' + catName;
      const selectedClass = idx === selectedLawIdx ? ' selected' : '';
      if (isWordMode) {
        html += `<button class="law-btn ${catClass}${active ? ' active' : ''}${selectedClass}" `
              + `data-law="${idx}" title="${name}">`
              + `<span class="tog-icon">${icon}</span><span class="tog-name">${name}</span></button>`;
      } else {
        html += `<button class="sq-toggle ${catClass}${active ? ' active' : ''}${selectedClass}" `
              + `data-law="${idx}" title="${name}">${icon}</button>`;
      }
    }
    html += '</div>';
  }
  grid.innerHTML = html;

  // Wire clicks
  grid.querySelectorAll('.sq-toggle, .law-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.law, 10);
      toggleLaw(lawStateObj, idx);
      const nowActive = isSet(lawStateObj, idx);
      btn.classList.toggle('active', nowActive);
      setSelectedLaw(idx);
      bus.emit('law:toggled', {
        lawIndex: idx,
        active: nowActive,
        state: nowActive ? 1 : 0,
      });
    });
  });

  // Re-apply category filter
  applyCategoryFilter(grid);
}

// ── Law set bar (save / load presets) ───────────────────────────

function setupLawSets(grid, bus, lawStateObj) {
  const host = document.createElement('div');
  host.className = 'law-set-bar';

  // 3 buttons: dropdown selector, load (icon), save (icon)
  const selectorBtn = document.createElement('button');
  selectorBtn.className = 'law-set-btn law-set-selector';
  selectorBtn.title = 'Select a law set';
  const loadBtn = document.createElement('button');
  loadBtn.className = 'law-set-btn law-set-icon';
  loadBtn.textContent = '📂';
  loadBtn.title = 'Load the selected law set';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'law-set-btn law-set-icon';
  saveBtn.textContent = '💾';
  saveBtn.title = 'Save current laws to the selected set';
  host.append(selectorBtn, loadBtn, saveBtn);

  // Dropdown: one row per set, 1/4-size law icons in a single line.
  // Tapping a row only *selects* it — LOAD applies it, SAVE overwrites it.
  const dropdown = document.createElement('div');
  dropdown.className = 'law-set-dropdown';
  host.appendChild(dropdown);

  // Inline name editor (used when saving a brand-new set)
  const editor = document.createElement('div');
  editor.className = 'law-set-editor hidden';
  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 24;
  input.placeholder = 'PRESET NAME';
  const okBtn = document.createElement('button');
  okBtn.textContent = '✓';
  okBtn.title = 'Confirm save';
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '✕';
  cancelBtn.title = 'Cancel save';
  editor.append(input, okBtn, cancelBtn);
  host.appendChild(editor);

  grid.insertAdjacentElement('afterend', host);

  const builtIns = LAW_SET_PRESETS.map((p) => ({ name: p.name, laws: resolvePresetLaws(p) }));
  let saved = loadSavedLawSets();
  let currentName = 'CUSTOM';   // the set applied to the sim right now
  let selectedName = null;      // the set highlighted in the dropdown

  // User-saved sets take precedence over built-ins with the same name.
  const allPresets = () => {
    const seen = new Set();
    const out = [];
    for (const p of [...saved, ...builtIns]) {
      if (seen.has(p.name)) continue;
      seen.add(p.name);
      out.push(p);
    }
    return out;
  };

  const activeLawIndexes = () => {
    const laws = [];
    for (let i = 0; i < LAW_COUNT; i++) {
      if (isSet(lawStateObj, i)) laws.push(i);
    }
    return laws;
  };

  const updateSelector = () => {
    selectorBtn.textContent = currentName + ' ▾';
  };

  const applyPreset = (preset) => {
    for (let i = 0; i < LAW_COUNT; i++) clearLaw(lawStateObj, i);
    for (const idx of preset.laws) setLaw(lawStateObj, idx);
    currentName = preset.name;
    updateSelector();
    bus.emit('law:sync');
  };

  const renderDropdown = () => {
    dropdown.innerHTML = '';
    for (const preset of allPresets()) {
      const row = document.createElement('div');
      row.className = 'law-set-row' + (preset.name === selectedName ? ' selected' : '');
      row.title = preset.name;
      const mark = document.createElement('span');
      mark.className = 'law-set-check';
      mark.textContent = preset.name === selectedName ? '✓' : '';
      const miniRow = document.createElement('div');
      miniRow.className = 'law-set-mini-row';
      for (const idx of preset.laws) {
        const name = LAW_NAME_BY_IDX[idx];
        const icon = LAW_ICONS[name] || '□';
        const cat = LAW_CAT_CLASS[idx] || 'physics';
        const s = document.createElement('span');
        s.className = 'law-set-mini-icon cat-' + cat;
        s.textContent = icon;
        miniRow.appendChild(s);
      }
      const label = document.createElement('span');
      label.className = 'law-set-row-name';
      label.textContent = preset.name;
      row.append(mark, miniRow, label);
      // Select only — applying happens via the LOAD button. Tapping the
      // selected row again clears the selection (saving then names a new set).
      row.addEventListener('click', () => {
        selectedName = selectedName === preset.name ? null : preset.name;
        renderDropdown();
      });
      dropdown.appendChild(row);
    }
  };

  const openEditor = () => {
    editor.classList.remove('hidden');
    // Prefill the currently applied set name so saving renames it
    input.value = currentName === 'CUSTOM' ? '' : currentName;
    input.focus();
  };

  selectorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renderDropdown();
    dropdown.classList.toggle('open');
  });

  loadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const pick = selectedName || currentName;
    const preset = allPresets().find((p) => p.name === pick);
    if (preset) {
      applyPreset(preset);
      // The applied set now lives in the selector label — clear the highlight
      selectedName = null;
      renderDropdown();
    }
    dropdown.classList.remove('open');
  });

  saveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.remove('open');
    if (selectedName) {
      // Overwrite the selected set with the current laws
      const name = selectedName;
      saved = saved.filter((p) => p.name !== name);
      saved.push({ name, laws: activeLawIndexes() });
      persistLawSets(saved);
      currentName = name;
      updateSelector();
      renderDropdown();
    } else {
      openEditor(); // brand-new set: ask for a name first
    }
  });

  okBtn.addEventListener('click', () => {
    const name = (input.value || '').trim().toUpperCase() || 'UNNAMED';
    saved = saved.filter((p) => p.name !== name);
    saved.push({ name, laws: activeLawIndexes() });
    persistLawSets(saved);
    currentName = name;
    selectedName = name;
    updateSelector();
    editor.classList.add('hidden');
    renderDropdown();
  });
  cancelBtn.addEventListener('click', () => editor.classList.add('hidden'));

  // Manual law edits return the label to CUSTOM
  bus.on('law:toggled', () => {
    currentName = 'CUSTOM';
    updateSelector();
  });
  // Close the dropdown when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!host.contains(e.target)) dropdown.classList.remove('open');
  });

  updateSelector();
}
// ── World parameter groups (accordions) ──

const WORLD_PARAM_GROUPS = [
  {
    label: 'SPACE',
    subgroups: [
      {
        label: 'WORLD',
        params: [
          { key: 'WORLD_SIZE', label: 'WORLD SIZE', min: 50, max: 20000, default: 2000, step: 100 },
          { key: 'GROUND_HEIGHT', label: 'GROUND HEIGHT', min: 0, max: 1, default: 0.9, step: 0.05 },
        ],
      },
      {
        label: 'POPULATION',
        params: [
          { key: 'PARTICLE_COUNT', label: 'PARTICLE COUNT', min: 100, max: 20000, default: 1000, step: 100 },
          { key: 'INITIAL_POP', label: 'INITIAL POPULATION', min: 10, max: 5000, default: 250, step: 10 },
          { key: 'MAX_POP', label: 'MAX POPULATION', min: 100, max: 50000, default: 5000, step: 100 },
        ],
      },
      {
        label: 'DISTRIBUTION',
        params: [
          { key: 'SHAPE', label: 'DISTRIBUTION', min: 0, max: 1, default: 0, step: 0.05 },
          { key: 'SPAWN_CENTRES', label: 'CENTRES', min: 1, max: 64, default: 1, step: 1 },
          { key: 'SPAWN_CENTRE_RANDOM', label: 'CENTRE SCATTER', min: 0, max: 1, default: 0.5, step: 0.05 },
          { key: 'SPAWN_CENTRE_BIAS', label: 'CENTRE BIAS', min: 0, max: 1, default: 0, step: 0.05 },
        ],
      },
    ],
  },
  {
    label: 'PHYSICS',
    subgroups: [
      {
        label: 'FORCES',
        params: [
          { key: 'GLOBAL_G', label: 'GRAVITY STRENGTH', min: 0, max: 20, default: 1, step: 1 },
          { key: 'WIND', label: 'WIND FORCE', min: 0, max: 5, default: 0, step: 0.5 },
        ],
      },
      {
        label: 'MOTION',
        params: [
          { key: 'DAMPING', label: 'MOTION DAMPING %', min: 0, max: 100, default: 10, step: 1 },
          { key: 'VISCOSITY', label: 'GLOBAL VISCOSITY', min: 0.5, max: 1, default: 0.98, step: 0.01 },
          { key: 'ENTROPY', label: 'ENTROPY', min: 0, max: 2, default: 0.1, step: 0.05 },
        ],
      },
    ],
  },
  {
    label: 'ENVIRONMENT',
    subgroups: [
      {
        label: 'THERMAL',
        params: [
          { key: 'HEAT_CAPACITY', label: 'HEAT CAPACITY', min: 0.1, max: 10, default: 1, step: 0.5 },
          { key: 'LIGHT_LEVEL', label: 'LIGHT LEVEL', min: 0, max: 2, default: 0.5, step: 0.1 },
          { key: 'RADIATION_LEVEL', label: 'RADIATION LEVEL', min: 0, max: 5, default: 0, step: 0.5 },
        ],
      },
      {
        label: 'POPULATION',
        params: [
          { key: 'SPAWN_RATE', label: 'REGULAR SPAWN /S', min: 0, max: 100, default: 5, step: 1 },
        ],
      },
    ],
  },
  {
    label: 'BIOLOGY',
    subgroups: [
      {
        label: 'INTERACTION',
        params: [
          { key: 'SPECIES_INTERACTION', label: 'SPECIES INTERACTION', min: -2, max: 2, default: 0.5, step: 0.1 },
          { key: 'ENERGY_TRANSFER', label: 'ENERGY TRANSFER', min: 0, max: 2, default: 0.5, step: 0.1 },
        ],
      },
      {
        label: 'LIFE CYCLE',
        params: [
          { key: 'MUTATION_RATE', label: 'MUTATION RATE', min: 0, max: 5, default: 0.5, step: 0.1 },
          { key: 'DECAY_RATE', label: 'DECAY RATE', min: 0, max: 2, default: 0.1, step: 0.05 },
        ],
      },
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
    group.subgroups.forEach((sub, si) => {
      html += `<div class="sub-accordion-section${si === 0 ? ' open' : ''}">`;
      html += `<div class="sub-accordion-header" data-subacc="${gi}-${si}"><span class="arrow">▶</span>${sub.label}</div>`;
      html += '<div class="sub-accordion-body">';
      for (const p of sub.params) {
        html += `<div class="accordion-slider-row">`
              + `<label>${p.label}</label>`
              + `<input type="range" min="${p.min}" max="${p.max}" value="${p.default}" step="${p.step}" data-key="${p.key}">`
              + `<span class="slider-value" data-key="${p.key}">${p.default}</span>`
              + `</div>`;
      }
      html += '</div></div>';
    });
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

  // Sub-group accordion toggle
  container.querySelectorAll('.sub-accordion-header').forEach((header) => {
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

  grid.querySelectorAll('.law-cat-row').forEach((row) => {
    const catName = row.dataset.catRow;
    const visible = catName !== undefined && activeCats.has('cat-' + catName);
    row.style.display = visible ? '' : 'none';
  });
}
