/**
 * VEPA v3 — Species Panel (SPECIES tab)
 * Species roster with +SPECIES button + trait accordion panels.
 * Mirrors v2 design for browsing/editing species DNA profiles.
 */
import { MAX_SPECIES, DNA_META, DNA_RANGES, DNA_INDEXES, DNA_COUNT } from '../constants.js';
import { getSpeciesDNA, setSpeciesDNA, setDNAFloat, getDNAFloat } from '../dna/dnaBuffer.js';

const SPECIES_COLORS = ['#ff5050', '#ffc832', '#50ff78', '#78a0ff', '#643c8c'];
const SPECIES_NAMES = ['Predator', 'Sol', 'Life', 'Aether', 'Void'];

// Accordion groups with member indices and display names
const ACCORDION_GROUPS = [
  { name: 'BASIC', indices: [
    DNA_INDEXES.FORCE, DNA_INDEXES.VISCOSITY, DNA_INDEXES.BIRTH_RATE, DNA_INDEXES.DEATH_RATE,
  ]},
  { name: 'MOTION', indices: [
    DNA_INDEXES.JITTER, DNA_INDEXES.TORQUE, DNA_INDEXES.TIDAL, DNA_INDEXES.INERTIA,
    DNA_INDEXES.FRICTION, DNA_INDEXES.MAX_VELOCITY,
  ]},
  { name: 'SIGNALING', indices: [
    DNA_INDEXES.SIGNAL_RESP, DNA_INDEXES.PULSE_RATE, DNA_INDEXES.NEIGHBORHOOD_RADIUS,
    DNA_INDEXES.SIGNAL_STRENGTH, DNA_INDEXES.SIGNAL_DECAY, DNA_INDEXES.PROPAGATION_SPEED,
    DNA_INDEXES.TUNING_CH1, DNA_INDEXES.TUNING_CH2, DNA_INDEXES.TUNING_CH3, DNA_INDEXES.TUNING_CH4,
  ]},
  { name: 'ADVANCED', indices: [
    DNA_INDEXES.SYMMETRY, DNA_INDEXES.HIDDEN_MASS, DNA_INDEXES.STIFFNESS, DNA_INDEXES.FUSION,
    DNA_INDEXES.FUSION_MOMENTUM, DNA_INDEXES.FUSION_TIME, DNA_INDEXES.BASE_RADIUS,
    DNA_INDEXES.ELASTICITY, DNA_INDEXES.BOND_ANGLE,
  ]},
  { name: 'CORE_TRAITS', indices: [
    DNA_INDEXES.POLARITY, DNA_INDEXES.ALPHA, DNA_INDEXES.MUTATION, DNA_INDEXES.MEMORY_DECAY,
  ]},
  { name: 'BIOLOGY', indices: [
    DNA_INDEXES.ENERGY_EFFICIENCY, DNA_INDEXES.SEX_CHANCE, DNA_INDEXES.PREDATION_BIAS,
    DNA_INDEXES.SPECIES_AFFINITY,
  ]},
  { name: 'CHEMISTRY', indices: [
    DNA_INDEXES.CONDUCTIVITY, DNA_INDEXES.MAGNETIC_MOMENT, DNA_INDEXES.REACTION_THRESHOLD,
    DNA_INDEXES.CATALYSIS, DNA_INDEXES.HEAT_OUTPUT,
  ]},
];

let selectedSpecies = 0;
let speciesCount = 5; // default roster size (matches spawnDefaultPopulation)

export function createSpeciesPanel(bus, dnaBuffer) {
  const list = document.getElementById('species-list');
  const accordion = document.getElementById('dna-accordion');
  const addBtn = document.getElementById('add-species-btn');

  renderSpeciesList(list, dnaBuffer);
  renderAccordion(accordion, dnaBuffer, bus);

  const removeBtn = document.getElementById('remove-species-btn');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addSpecies(dnaBuffer, bus, list, accordion);
    });
  }
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      removeLastSpecies(dnaBuffer, bus, list, accordion);
    });
  }

  // Stay in sync with restarts (roster resets to the default 5)
  bus.on('species:sync', ({ count }) => {
    speciesCount = Math.max(1, Math.min(count || 5, MAX_SPECIES));
    selectedSpecies = Math.min(selectedSpecies, speciesCount - 1);
    renderSpeciesList(list, dnaBuffer);
    renderAccordion(accordion, dnaBuffer, bus);
  });

  bus.on('dna:sync', () => {
    renderSpeciesList(list, dnaBuffer);
    renderAccordion(accordion, dnaBuffer, bus);
  });
  bus.on('dna:changed', () => {
    renderSpeciesList(list, dnaBuffer);
  });
  bus.on('physics:tick', ({ speciesCount: sc } = {}) => {
    // Could add live population counts per species here
  });
}

function speciesColor(s) {
  if (s < SPECIES_COLORS.length) return SPECIES_COLORS[s];
  return `hsl(${(s * 47) % 360}, 80%, 60%)`;
}

function speciesName(s) {
  return SPECIES_NAMES[s] || `Species ${s}`;
}

function renderSpeciesList(container, dnaBuffer) {
  if (!container) return;
  let html = '';
  const count = Math.min(speciesCount, MAX_SPECIES);
  for (let s = 0; s < count; s++) {
    const color = speciesColor(s);
    const name = speciesName(s);
    const selected = s === selectedSpecies ? ' selected' : '';
    const removable = count > 1 ? '' : ' disabled';
    html += `<div class="species-card${selected}" data-species="${s}">`
          + `<span class="species-swatch" style="background:${color}"></span>`
          + `<span class="species-name">${name}</span>`
          + `<button class="species-remove${removable}" data-remove="${s}" title="Remove ${name}">✕</button>`
          + `</div>`;
  }
  container.innerHTML = html;

  container.querySelectorAll('.species-card').forEach((card) => {
    card.addEventListener('click', (ev) => {
      if (ev.target.closest('.species-remove')) return;
      container.querySelectorAll('.species-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedSpecies = parseInt(card.dataset.species, 10);
      const accordion = document.getElementById('dna-accordion');
      const buf = window.__dnaBuffer;
      if (accordion && buf) {
        renderAccordion(accordion, buf, null);
      }
    });
  });

  container.querySelectorAll('.species-remove:not(.disabled)').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      removeSpeciesAt(parseInt(btn.dataset.remove, 10), dnaBuffer, window.__bus || null);
      const accordion = document.getElementById('dna-accordion');
      const buf = window.__dnaBuffer;
      renderSpeciesList(container, buf);
      if (accordion && buf) renderAccordion(accordion, buf, null);
    });
  });
}

/** Add a new species by cloning species 0's DNA into the next free slot. */
function addSpecies(dnaBuffer, bus, list, accordion) {
  if (speciesCount >= MAX_SPECIES) {
    if (bus) bus.emit('narrative:system', { text: 'Species roster full (64 max).' });
    return;
  }
  const template = getSpeciesDNA(dnaBuffer, 0);
  setSpeciesDNA(dnaBuffer, speciesCount, template);
  speciesCount++;
  selectedSpecies = speciesCount - 1;
  renderSpeciesList(list, dnaBuffer);
  renderAccordion(accordion, dnaBuffer, bus);
  if (bus) {
    bus.emit('dna:sync');
    bus.emit('species:changed', { count: speciesCount });
    bus.emit('narrative:system', { text: `Species added: ${speciesName(selectedSpecies)} (${speciesCount} total).` });
  }
}

/** Remove the species at index `idx`, compacting the roster. */
function removeSpeciesAt(idx, dnaBuffer, bus) {
  if (speciesCount <= 1) return;
  if (idx < 0 || idx >= speciesCount) return;
  for (let s = idx; s < speciesCount - 1; s++) {
    const from = getSpeciesDNA(dnaBuffer, s + 1);
    setSpeciesDNA(dnaBuffer, s, from);
  }
  setSpeciesDNA(dnaBuffer, speciesCount - 1, new Float32Array(64));
  speciesCount--;
  if (selectedSpecies >= speciesCount) selectedSpecies = speciesCount - 1;
  if (bus) {
    bus.emit('dna:sync');
    bus.emit('species:changed', { count: speciesCount });
    bus.emit('narrative:system', { text: `Species removed: ${speciesName(idx)} (${speciesCount} remain).` });
  }
}

/** Remove the last species (header − button). */
function removeLastSpecies(dnaBuffer, bus, list, accordion) {
  removeSpeciesAt(speciesCount - 1, dnaBuffer, bus);
  const buf = window.__dnaBuffer;
  renderSpeciesList(list, buf);
  renderAccordion(accordion, buf, bus);
}

function renderAccordion(container, dnaBuffer, bus) {
  if (!container) return;
  let html = '';
  for (const group of ACCORDION_GROUPS) {
    html += `<div class="accordion-section${group.name === 'BASIC' ? ' open' : ''}">`;
    html += `<div class="accordion-header"><span class="arrow">▶</span>${group.name}</div>`;
    html += `<div class="accordion-body">`;
    for (const idx of group.indices) {
      if (idx >= DNA_COUNT) continue;
      const range = DNA_RANGES[idx];
      const name = DNA_META[idx] || `DNA_${idx}`;
      const val = dnaBuffer ? getDNAFloat(dnaBuffer, selectedSpecies, idx, range.min, range.max) : range.default;
      const valDisp = val.toFixed(idx < 10 ? 2 : 3);
      html += `<div class="accordion-slider-row">`
            + `<label>${name}</label>`
            + `<input type="range" min="${range.min}" max="${range.max}" step="${(range.max - range.min) / 1000}" `
            + `value="${val}" data-param="${idx}" data-species="${selectedSpecies}">`
            + `<span class="slider-val" data-param="${idx}">${valDisp}</span>`
            + `</div>`;
    }
    html += `</div></div>`;
  }
  container.innerHTML = html;

  // Wire accordion headers
  container.querySelectorAll('.accordion-header').forEach((header) => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('open');
    });
  });

  // Wire sliders
  container.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener('input', () => {
      const idx = parseInt(slider.dataset.param, 10);
      const species = parseInt(slider.dataset.species, 10);
      const val = parseFloat(slider.value);
      const range = DNA_RANGES[idx];
      const display = container.querySelector(`.slider-val[data-param="${idx}"]`);
      if (display) display.textContent = val.toFixed(2);

      if (dnaBuffer) {
        setDNAFloat(dnaBuffer, species, idx, val, range.min, range.max);
        if (bus) {
          bus.emit('dna:changed', { species, param: idx, value: val });
        }
      }
    });
  });

  // Store refs for species list click handler
  window.__dnaBuffer = dnaBuffer;
  window.__bus = bus;
}
