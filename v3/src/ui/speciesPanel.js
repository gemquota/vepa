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

export function createSpeciesPanel(bus, dnaBuffer) {
  const list = document.getElementById('species-list');
  const accordion = document.getElementById('dna-accordion');
  const addBtn = document.getElementById('add-species-btn');

  renderSpeciesList(list, dnaBuffer);
  renderAccordion(accordion, dnaBuffer, bus);

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      bus.emit('narrative:system', { text: 'Add species — not yet implemented in v3.' });
    });
  }

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

function renderSpeciesList(container, dnaBuffer) {
  if (!container) return;
  let html = '';
  const count = Math.min(SPECIES_NAMES.length, MAX_SPECIES);
  for (let s = 0; s < count; s++) {
    const color = SPECIES_COLORS[s] || '#444';
    const name = SPECIES_NAMES[s] || `Species ${s}`;
    const selected = s === selectedSpecies ? ' selected' : '';
    html += `<div class="species-card${selected}" data-species="${s}">`
          + `<span class="species-swatch" style="background:${color}"></span>`
          + `<span class="species-name">${name}</span>`
          + `</div>`;
  }
  container.innerHTML = html;

  container.querySelectorAll('.species-card').forEach((card) => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.species-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedSpecies = parseInt(card.dataset.species, 10);
      const accordion = document.getElementById('dna-accordion');
      const dnaBuffer = window.__dnaBuffer;
      if (accordion && dnaBuffer) {
        renderAccordion(accordion, dnaBuffer, null);
      }
    });
  });
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

  // Store ref for species list click handler
  window.__dnaBuffer = dnaBuffer;
}
