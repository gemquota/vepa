/**
 * VEPA v3 — Law Info Module
 * Displays HELP_DB info for the last-tapped law in a persistent panel.
 * Listens for law:toggled events on the bus.
 */
import { LAW_INDEXES, LAW_HELP_DB, LAW_COLOR_BY_INDEX, LAW_TO_CATEGORY } from '../constants.js';

let infoEl = null;
let currentLawIdx = -1;

// Reverse: law index → name
const LAW_NAME_BY_IDX = {};
for (const [name, idx] of Object.entries(LAW_INDEXES)) {
  LAW_NAME_BY_IDX[idx] = name;
}

/**
 * Initialize the law info module.
 * @param {object} bus - Event bus
 */
export function initTooltip(bus) {
  infoEl = document.getElementById('law-info-panel');
  if (!infoEl) {
    infoEl = document.createElement('div');
    infoEl.id = 'law-info-panel';
    infoEl.className = 'law-info-panel hidden';
    document.body.appendChild(infoEl);
  }

  // Listen for law toggle events
  if (bus) {
    bus.on('law:toggled', ({ lawIndex, active, state }) => {
      showLawInfo(lawIndex);
    });
  }

  // Close button handler (delegated)
  infoEl.addEventListener('click', (e) => {
    if (e.target.closest('.info-close')) {
      hideLawInfo();
    }
  });
}

/**
 * Show law info for a given law index.
 */
function showLawInfo(idx) {
  if (idx === undefined || idx < 0) return;
  currentLawIdx = idx;

  const name = LAW_NAME_BY_IDX[idx];
  if (!name) return;

  const help = LAW_HELP_DB[name];
  if (!help) return;

  const catName = LAW_TO_CATEGORY[idx] || 'unknown';
  const colorName = (LAW_COLOR_BY_INDEX[idx] || 'BLUE').toLowerCase();

  const hint = help.hint || '';
  const explanation = help.explanation || '';
  const system = help.system || '';

  infoEl.innerHTML = `
    <div class="info-header" style="border-left: 3px solid var(--accent-${colorName})">
      <span class="info-title">${name}</span>
      <span class="info-category" style="color:var(--accent-${colorName})">${catName.toUpperCase()}</span>
      <button class="info-close">✕</button>
    </div>
    <div class="info-hint">${hint}</div>
    <div class="info-explanation">${explanation}</div>
    <div class="info-system">${system}</div>
  `;

  infoEl.classList.remove('hidden');
}

/**
 * Hide the law info panel.
 */
export function hideLawInfo() {
  if (infoEl) {
    infoEl.classList.add('hidden');
    currentLawIdx = -1;
  }
}
