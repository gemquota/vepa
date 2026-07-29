/**
 * VEPA v3 — Species Overview Panel
 * Lists all species with their color swatches, names, DNA trait summaries,
 * and particle counts. Provides an overview of the current ecosystem.
 */
import { MAX_SPECIES, DNA_META, DNA_RANGES, DNA_INDEXES } from '../constants.js';
import { getSpeciesDNA } from '../dna/dnaBuffer.js';

// The five canonical species names (matching main.js spawnDefaultPopulation)
const CANONICAL_NAMES = ['Predator', 'Sol', 'Life', 'Aether', 'Void'];

// DNA trait keys that are interesting for the overview display
const TRAIT_SUMMARY = [
  { idx: DNA_INDEXES.FORCE, label: 'Force', format: 'v' },
  { idx: DNA_INDEXES.VISCOSITY, label: 'Viscosity', format: 'p' },
  { idx: DNA_INDEXES.BIRTH_RATE, label: 'Birth', format: 'v' },
  { idx: DNA_INDEXES.MUTATION, label: 'Mutation', format: 'v' },
  { idx: DNA_INDEXES.PREDATION_BIAS, label: 'Predation', format: 'v' },
  { idx: DNA_INDEXES.ENERGY_EFFICIENCY, label: 'Energy Eff', format: 'v' },
];

let speciesColors = [
  '#ff5050', '#ffc832', '#50ff78', '#78a0ff', '#643c8c',
];

/**
 * Paint a 12px color swatch canvas for a species.
 */
function colorSwatch(r, g, b) {
  return `<span class="species-swatch" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:rgb(${r|0},${g|0},${b|0});vertical-align:middle;margin-right:6px;"></span>`;
}

/**
 * Normalize a DNA uint16 value to a display-friendly float.
 */
function dnaToDisplay(dnaValue, range) {
  const normalized = dnaValue / 65535;
  const value = range.min + normalized * (range.max - range.min);
  return value;
}

/**
 * Format a numeric value for display.
 */
function formatValue(val, fmt) {
  if (fmt === 'p') return (val * 100).toFixed(0) + '%';
  if (fmt === 'v') return val.toFixed(2);
  return val.toFixed(2);
}

/**
 * Create the species overview panel in #species-panel.
 *
 * @param {import('../core/eventBus.js').EventBus} bus
 * @param {Uint16Array} dnaBuffer
 */
export function createSpeciesPanel(bus, dnaBuffer) {
  const panel = document.getElementById('species-panel');
  if (!panel) return;

  renderPanel(panel, dnaBuffer);

  // Listen for DNA changes to refresh
  bus.on('dna:changed', () => renderPanel(panel, dnaBuffer));
  bus.on('dna:sync', () => renderPanel(panel, dnaBuffer));
  bus.on('physics:tick', () => renderPanel(panel, dnaBuffer));
  bus.on('species:info', ({ colors } = {}) => {
    if (colors) speciesColors = colors;
    renderPanel(panel, dnaBuffer);
  });
}

function renderPanel(panel, dnaBuffer) {
  // Limit species shown to first 5 for now (or however many are defined)
  const count = 5;

  let html = '';
  for (let s = 0; s < count; s++) {
    const dna = getSpeciesDNA(dnaBuffer, s);
    const name = CANONICAL_NAMES[s] || `Species ${s}`;
    const color = speciesColors[s] || '#444';

    // Parse color for swatch
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    html += `<div class="species-card">`;
    html += `<div class="species-header">`;
    html += colorSwatch(r, g, b);
    html += `<span class="species-name">${name}</span>`;
    html += `<span class="species-index">#${s}</span>`;
    html += `</div>`;

    html += `<div class="species-traits">`;
    for (const trait of TRAIT_SUMMARY) {
      if (trait.idx >= dna.length) continue;
      const val = dnaToDisplay(dna[trait.idx], DNA_RANGES[trait.idx]);
      html += `<span class="species-trait"><span class="trait-label">${trait.label}:</span> ${formatValue(val, trait.format)}</span>`;
    }
    html += `</div>`;
    html += `</div>`;
  }

  panel.innerHTML = html;
}
