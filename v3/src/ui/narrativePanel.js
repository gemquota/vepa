/**
 * VEPA v3 — Narrative / Log Panel
 * Scrollback display for narrative entries with voice-based coloring.
 * Auto-scrolls to bottom and caps at 100 entries.
 */

const MAX_ENTRIES = 100;

const VOICE_COLORS = {
  Stabilizer: 'var(--accent-blue)',
  Diverger:   'var(--accent-red)',
  Observer:   'var(--accent-green)',
  Dissolver:  'var(--accent-purple)',
};

const DEFAULT_VOICE_COLOR = 'var(--text-secondary)';

let container = null;
let entryCount = 0;

/**
 * Scroll the container to its bottom.
 */
function scrollToBottom() {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Append a single narrative entry to the panel.
 * @param {{ voice?: string, text: string, timestamp?: number }} entry
 */
function appendEntry(entry) {
  if (!container) return;

  const voice = entry.voice || 'System';
  const color = VOICE_COLORS[voice] || DEFAULT_VOICE_COLOR;
  const ts = entry.timestamp
    ? new Date(entry.timestamp).toLocaleTimeString()
    : new Date().toLocaleTimeString();

  const div = document.createElement('div');
  div.className = 'narrative-entry';
  div.innerHTML = `<span class="narrative-voice" style="color:${color}">[${voice}]</span> `
                + `<span class="narrative-time">${ts}</span> `
                + `<span class="narrative-text">${escapeHtml(entry.text)}</span>`;

  container.appendChild(div);
  entryCount++;

  // Trim oldest entries if over cap
  while (entryCount > MAX_ENTRIES && container.firstChild) {
    container.removeChild(container.firstChild);
    entryCount--;
  }

  scrollToBottom();
}

/**
 * Escape HTML entities to prevent XSS from narrative text.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Create the narrative panel in #narrative-panel.
 *
 * @param {import('../core/eventBus.js').EventBus} bus
 */
export function createNarrativePanel(bus) {
  const panel = document.getElementById('narrative-panel');
  if (!panel) return;

  // Build inner structure
  panel.innerHTML = `
    <div class="narrative-header">
      <span class="narrative-title">Narrative Log</span>
      <button id="narrative-clear-btn" class="narrative-clear-btn" title="Clear log">✕</button>
    </div>
    <div id="narrative-scroll" class="narrative-scroll"></div>
  `;

  container = document.getElementById('narrative-scroll');
  entryCount = 0;

  // Clear button
  document.getElementById('narrative-clear-btn')?.addEventListener('click', () => {
    if (container) {
      container.innerHTML = '';
      entryCount = 0;
    }
  });

  // Subscribe to narrative entries
  bus.on('narrative:entry', (entry) => {
    appendEntry(entry);
  });

  // Batch entries support
  bus.on('narrative:batch', (entries) => {
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        appendEntry(entry);
      }
    }
  });

  // System messages (no voice)
  bus.on('narrative:system', ({ text, timestamp } = {}) => {
    appendEntry({ voice: 'System', text: text || '', timestamp: timestamp || Date.now() });
  });
}
