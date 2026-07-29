/**
 * VEPA v3 — Law Info Module
 * Full-width info bar above the law grid showing the last-tapped law's
 * icon, name, category, and HELP_DB description.
 */
import { LAW_INDEXES, LAW_HELP_DB, LAW_COLOR_BY_INDEX, LAW_TO_CATEGORY } from '../constants.js';

let infoEl = null;

// Reverse: law index → name
const LAW_NAME_BY_IDX = {};
for (const [name, idx] of Object.entries(LAW_INDEXES)) {
  LAW_NAME_BY_IDX[idx] = name;
}

// Law icon symbols (mirrors worldPanel.js)
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

/**
 * Initialize the law info module.
 * @param {object} bus - Event bus
 */
export function initTooltip(bus) {
  infoEl = document.getElementById('law-info-module');
  if (!infoEl) return;

  // Listen for law toggle events
  if (bus) {
    bus.on('law:toggled', ({ lawIndex }) => {
      showLawInfo(lawIndex);
    });
  }

  // Close button delegation
  infoEl.addEventListener('click', (e) => {
    if (e.target.closest('.info-close')) {
      infoEl.classList.add('hidden');
    }
  });
}

/**
 * Show law info for a given law index.
 */
function showLawInfo(idx) {
  if (!infoEl || idx === undefined || idx < 0) return;

  const name = LAW_NAME_BY_IDX[idx];
  if (!name) return;

  const help = LAW_HELP_DB[name];
  if (!help) return;

  const catName = LAW_TO_CATEGORY[idx] || 'unknown';
  const colorName = (LAW_COLOR_BY_INDEX[idx] || 'BLUE').toLowerCase();
  const icon = LAW_ICONS[name] || '□';
  const hint = help.hint || '';
  const explanation = help.explanation || '';
  const system = help.system || '';

  infoEl.innerHTML = `
    <div class="info-row">
      <div class="info-icon" style="color:var(--accent-${colorName})">${icon}</div>
      <div class="info-body">
        <div class="info-header">
          <span class="info-title">${name}</span>
          <span class="info-category" style="color:var(--accent-${colorName})">${catName.toUpperCase()}</span>
          <button class="info-close">✕</button>
        </div>
        <div class="info-text">${hint}</div>
      </div>
    </div>
  `;

  infoEl.classList.remove('hidden');
}

/**
 * Hide the law info module.
 */
export function hideLawInfo() {
  if (infoEl) infoEl.classList.add('hidden');
}
