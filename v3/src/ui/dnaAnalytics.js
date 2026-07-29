/**
 * VEPA v3 — DNA Analytics Panel (DNA tab)
 * Shows genetic drift bar chart, colour diversity, population trends,
 * and state scatter (mass vs energy).
 *
 * Mirrors v2 design with real-time data from the simulation buffer.
 */
import { PARTICLE_STRIDE, STRIDE_INDEXES, MAX_SPECIES, DNA_INDEXES } from '../constants.js';

const SPECIES_COLORS = ['#ff5050', '#ffc832', '#50ff78', '#78a0ff', '#643c8c'];
const SPECIES_NAMES = ['Sol', 'Predator', 'Life', 'Aether', 'Void'];

let particleBuffer = null;
let particleCount = 0;
let speciesCount = 5;

/**
 * Create the DNA analytics panel in the DNA tab.
 */
export function createDNAAnalytics(bus) {
  const container = document.getElementById('dna-analytics');
  if (!container) return;

  // Initial render with placeholder data
  renderAnalytics(container, []);

  // Listen for physics tick to update
  bus.on('physics:tick', ({ buffer, particleCount: pc, speciesCount: sc }) => {
    particleBuffer = buffer;
    particleCount = pc;
    speciesCount = sc || speciesCount;
    updateCharts(bus);
  });

  // Also handle direct updates
  bus.on('dna:analyticsUpdate', ({ speciesData } = {}) => {
    if (speciesData) {
      renderAnalytics(container, speciesData);
    }
  });
}

function updateCharts(bus) {
  if (!particleBuffer) return;
  const container = document.getElementById('dna-analytics');
  if (!container) return;

  try {
    const view = new Float32Array(particleBuffer);
    const speciesPop = new Array(speciesCount).fill(0);
    const speciesEnergy = new Array(speciesCount).fill(0);
    const speciesMass = new Array(speciesCount).fill(0);
    const massNrgPairs = [];

    for (let i = 0; i < particleCount && i < 10000; i++) {
      const base = i * PARTICLE_STRIDE;
      if (view[base + STRIDE_INDEXES.DEAD] >= 0.99) continue;
      const sid = Math.round(view[base + STRIDE_INDEXES.SPECIES_ID]);
      if (sid >= 0 && sid < speciesCount) {
        speciesPop[sid]++;
        const nrg = view[base + STRIDE_INDEXES.ENERGY] || 0;
        const mass = view[base + STRIDE_INDEXES.MASS] || 0;
        speciesEnergy[sid] += nrg;
        speciesMass[sid] += mass;
        if (i % 10 === 0) {
          massNrgPairs.push({ mass, nrg });
        }
      }
    }

    const total = speciesPop.reduce((a, b) => a + b, 0) || 1;
    const speciesData = [];
    for (let s = 0; s < speciesCount; s++) {
      const avgMass = speciesPop[s] > 0 ? speciesMass[s] / speciesPop[s] : 0;
      const avgNrg = speciesPop[s] > 0 ? speciesEnergy[s] / speciesPop[s] : 0;
      speciesData.push({
        name: SPECIES_NAMES[s] || `Species ${s}`,
        color: SPECIES_COLORS[s] || '#888',
        count: speciesPop[s],
        pct: (speciesPop[s] / total * 100).toFixed(1),
        avgMass: avgMass.toFixed(1),
        avgNrg: avgNrg.toFixed(1),
      });
    }

    renderAnalytics(container, speciesData);
    renderPopTrend(speciesData);
    renderScatter(massNrgPairs);
  } catch (e) {
    // Silently handle rendering errors during init
  }
}

function renderAnalytics(container, speciesData) {
  // Genetic Drift + Color Diversity side by side
  let html = '<div class="analytics-row">';

  // Genetic Drift
  html += '<div class="analytics-card"><h4>GENETIC_DRIFT</h4><div class="bar-container">';
  for (const sp of speciesData) {
    const pct = parseFloat(sp.pct) || 0;
    html += `<div class="bar-row">`
          + `<span class="bar-label">${sp.name}</span>`
          + `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${sp.color}"></div></div>`
          + `<span class="bar-value">${sp.pct}%</span>`
          + `</div>`;
  }
  html += '</div></div>';

  // Colour Diversity
  html += '<div class="analytics-card"><h4>COLOUR_DIVERSITY</h4><div class="bar-container">';
  for (const sp of speciesData) {
    html += `<div class="bar-row">`
          + `<span class="bar-label">${sp.name}</span>`
          + `<div class="bar-track"><div class="bar-fill" style="width:100%;background:${sp.color};height:10px"></div></div>`
          + `<span class="bar-value">${sp.count}</span>`
          + `</div>`;
  }
  html += '</div></div>';

  html += '</div>';
  container.innerHTML = html;
}

function renderPopTrend(speciesData) {
  const canvas = document.getElementById('pop-line-graph');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width || canvas.clientWidth * 2 || 400;
  const h = canvas.height || canvas.clientHeight * 2 || 200;
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // Simple bar chart showing current population proportions
  const barW = (w - 40) / speciesData.length;
  const maxPop = Math.max(...speciesData.map(s => s.count), 1);

  for (let i = 0; i < speciesData.length; i++) {
    const sp = speciesData[i];
    const barH = (sp.count / maxPop) * (h - 40);
    const x = 20 + i * barW;
    const y = h - 20 - barH;

    ctx.fillStyle = sp.color;
    ctx.fillRect(x, y, barW - 4, barH);

    ctx.fillStyle = '#888';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(sp.name.slice(0, 4), x + (barW - 4) / 2, h - 6);
    ctx.fillText(sp.count.toString(), x + (barW - 4) / 2, y - 4);
  }
}

function renderScatter(pairs) {
  const canvas = document.getElementById('mass-nrg-scatter');
  if (!canvas || !canvas.getContext || pairs.length === 0) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width || canvas.clientWidth * 2 || 400;
  const h = canvas.height || canvas.clientHeight * 2 || 240;
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // Draw axes
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 10);
  ctx.lineTo(30, h - 20);
  ctx.lineTo(w - 10, h - 20);
  ctx.stroke();

  // Plot points
  const margin = 35;
  const plotW = w - margin - 10;
  const plotH = h - margin - 10;
  const maxMass = Math.max(...pairs.map(p => p.mass), 1);
  const maxNrg = Math.max(...pairs.map(p => p.nrg), 1);

  for (const p of pairs) {
    const x = margin + (p.mass / maxMass) * plotW;
    const y = h - 20 - (p.nrg / maxNrg) * plotH;
    ctx.fillStyle = '#4af';
    ctx.fillRect(x, y, 2, 2);
  }

  // Labels
  ctx.fillStyle = '#555';
  ctx.font = '7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MASS →', w / 2, h - 4);
  ctx.save();
  ctx.translate(8, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('NRG →', 0, 0);
  ctx.restore();
}
