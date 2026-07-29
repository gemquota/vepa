/**
 * VEPA v3 — Hold-to-View Tooltip
 * Shows a HELP_DB tooltip when pressing and holding a law button.
 * Timer-based: hold 500ms → show tooltip.
 */
import { LAW_HELP_DB, LAW_COLOR_BY_INDEX, LAW_TO_CATEGORY } from '../constants.js';

let tooltipEl = null;
let holdTimer = null;
let currentBtn = null;

const HOLD_DELAY = 500;

/**
 * Initialize the tooltip system.
 */
export function initTooltip() {
  tooltipEl = document.getElementById('law-tooltip');
  if (!tooltipEl) {
    // Create tooltip element
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'law-tooltip';
    tooltipEl.className = 'law-tooltip hidden';
    document.body.appendChild(tooltipEl);
  }

  // Delegate hold-to-view for all .sq-toggle buttons
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointerup', onPointerUp, true);
  document.addEventListener('pointerleave', onPointerCancel, true);
}

function onPointerDown(e) {
  const btn = e.target.closest('.sq-toggle');
  if (!btn) return;

  currentBtn = btn;
  holdTimer = setTimeout(() => {
    showTooltip(btn);
    holdTimer = null;
  }, HOLD_DELAY);
}

function onPointerUp(e) {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
  // Don't hide immediately — let the user read
  // The tooltip hides when clicking elsewhere or pressing the close button
  if (!e.target.closest('.law-tooltip')) {
    // If clicking on a different law button while tooltip is shown, keep showing
    const btn = e.target.closest('.sq-toggle');
    if (!btn || btn === currentBtn) {
      // Same button or not a button — do nothing (keep tooltip)
    }
  }
  currentBtn = null;
}

function onPointerCancel(e) {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
}

/**
 * Show tooltip for a law button.
 */
function showTooltip(btn) {
  const idx = parseInt(btn.dataset.law, 10);
  const catName = LAW_TO_CATEGORY[idx] || 'unknown';
  const colorName = (LAW_COLOR_BY_INDEX[idx] || 'BLUE').toLowerCase();

  // Get HELP_DB entry
  const name = btn.title;
  const help = LAW_HELP_DB[name];
  if (!help) return;

  const hint = help.hint || '';
  const explanation = help.explanation || '';
  const system = help.system || '';

  const btnRect = btn.getBoundingClientRect();
  const tooltipW = 280;
  const tooltipH = 160;

  // Position above the button
  let x = btnRect.left + btnRect.width / 2 - tooltipW / 2;
  let y = btnRect.top - tooltipH - 8;

  // Clamp to viewport
  if (y < 4) y = btnRect.bottom + 8;
  if (x < 4) x = 4;
  if (x + tooltipW > window.innerWidth - 4) x = window.innerWidth - tooltipW - 4;

  tooltipEl.innerHTML = `
    <div class="tooltip-header" style="border-left: 3px solid var(--accent-${colorName})">
      <span class="tooltip-title">${name}</span>
      <span class="tooltip-category" style="color:var(--accent-${colorName})">${catName.toUpperCase()}</span>
      <button class="tooltip-close" onclick="document.getElementById('law-tooltip').classList.add('hidden')">✕</button>
    </div>
    <div class="tooltip-hint">${hint}</div>
    <div class="tooltip-explanation">${explanation}</div>
    <div class="tooltip-system">${system}</div>
  `;

  tooltipEl.style.left = x + 'px';
  tooltipEl.style.top = y + 'px';
  tooltipEl.classList.remove('hidden');
}

/**
 * Hide the tooltip.
 */
export function hideTooltip() {
  if (tooltipEl) tooltipEl.classList.add('hidden');
}

// Allow clicking anywhere to dismiss
document.addEventListener('click', (e) => {
  if (tooltipEl && !tooltipEl.classList.contains('hidden') && !e.target.closest('.sq-toggle') && !e.target.closest('.law-tooltip')) {
    tooltipEl.classList.add('hidden');
  }
});
