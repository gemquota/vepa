// ============================================================================
// VEPA v4 — Electromagnetism Law Group (EM)
// Per-particle and pairwise law functions: Antenna, Shielding, Polarization.
// Each function returns a force object {ax, ay, az} or null. State mutations
// are NaN-guarded and clamped before being written back to the buffer.
// ============================================================================

import { PARTICLE_STRIDE, STRIDE_INDEXES as S, DNA_INDEXES as D } from '../../constants.js';
import { buffer_global, readDNA } from '../lawsState.js';

function clamp(v, lo, hi) {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

function nanGuard(v) {
  return Number.isFinite(v) ? v : 0;
}

/**
 * Antenna — directional emission along velocity.
 * Particles carrying an active SIGNAL broadcast additional signal energy
 * scaled by speed, so moving emitters transmit louder (SIGNAL capped at 10).
 */
export function applyAntenna(view, iBase, k) {
  const signal = view[iBase + S.SIGNAL];
  if (!(signal > 0.05)) return null;
  const vx = view[iBase + S.VEL_X];
  const vy = view[iBase + S.VEL_Y];
  const vz = view[iBase + S.VEL_Z];
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  const boost = Math.min(speed, 5) * 0.01 * k;
  view[iBase + S.SIGNAL] = clamp(nanGuard(signal + boost), 0, 10);
  return null;
}

/**
 * Shielding — Faraday-cage dissipation.
 * Stored ENERGY is spent to bleed off stored CHARGE, damping electrostatic
 * influence at a small energy cost (charge drained toward zero).
 */
export function applyShielding(view, iBase, k) {
  const energy = view[iBase + S.ENERGY];
  const charge = view[iBase + S.CHARGE];
  if (!(energy > 5) || !(Math.abs(charge) > 0)) return null;
  const delta = Math.sign(charge) * Math.min(0.01 * k, Math.abs(charge));
  view[iBase + S.CHARGE] = nanGuard(charge - delta);
  view[iBase + S.ENERGY] = clamp(energy - 0.05 * k, 0, 200);
  return null;
}

/**
 * Polarization — channel-filtered signal exchange.
 * Particles tuned to the same TUNING_CH1 channel exchange SIGNAL toward the
 * pair mean; mismatched channels absorb the transmission instead (damp).
 */
export function applyPolarization(view, iBase, jBase, k) {
  const dnaBase = S.DNA_CACHE_START;
  const t1i = view[iBase + dnaBase + D.TUNING_CH1];
  const t1j = view[jBase + dnaBase + D.TUNING_CH1];
  const si = view[iBase + S.SIGNAL];
  const sj = view[jBase + S.SIGNAL];
  if (t1i === t1j) {
    const mean = (si + sj) * 0.5;
    const t = clamp(k, 0, 1);
    view[iBase + S.SIGNAL] = clamp(nanGuard(si + (mean - si) * t), 0, 10);
    view[jBase + S.SIGNAL] = clamp(nanGuard(sj + (mean - sj) * t), 0, 10);
  } else {
    const damp = 1 - 0.01 * k;
    view[iBase + S.SIGNAL] = clamp(nanGuard(si * damp), 0, 10);
    view[jBase + S.SIGNAL] = clamp(nanGuard(sj * damp), 0, 10);
  }
  return null;
}

// ============================================================================
// 11. ELECTROMAGNETISM (cyan) — legacy laws migrated from laws.js
// ============================================================================

/** CHARGE_LAW — real Coulomb force on effective charge = POLARITY + stored CHARGE. */
export function applyChargeForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const q1 = (readDNA(p1Ptr, D.POLARITY) || 0) + (buf[p1Ptr + S.CHARGE] || 0);
  const q2 = (readDNA(p2Ptr, D.POLARITY) || 0) + (buf[p2Ptr + S.CHARGE] || 0);
  const qq = q1 * q2;
  if (qq === 0) return null;
  const force = -k * qq / (dist * dist + 0.5); // like charges repel, opposite attract
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** FIELD — uniform 3D drift along POLARITY sign, scaled by stored charge. */
export function applyFieldDrift(p1Ptr, k) {
  const buf = buffer_global;
  const q = readDNA(p1Ptr, D.POLARITY) || 0;
  if (q === 0) return null;
  const c = buf[p1Ptr + S.CHARGE] || 0;
  const f = k * (1 + Math.abs(c) * 0.5); // charged particles feel the field harder
  return { ax: q * f, ay: q * f, az: q * f };
}

/** CURRENT — charge diffusion between conductive neighbors. */
export function applyCurrentTransfer(p1Ptr, p2Ptr, distSq, k) {
  const buf = buffer_global;
  if (distSq > 300) return;
  // Real conduction needs both materials to conduct (confirmed batch-14).
  const cond = Math.min(readDNA(p1Ptr, D.CONDUCTIVITY) || 0, readDNA(p2Ptr, D.CONDUCTIVITY) || 0);
  if (cond <= 0) return;
  const dq = (buf[p2Ptr + S.CHARGE] - buf[p1Ptr + S.CHARGE]) * cond * k;
  if (dq === 0) return;
  buf[p1Ptr + S.CHARGE] += dq;
  buf[p2Ptr + S.CHARGE] -= dq;
}

/** RESISTANCE — kinetic energy → heat + velocity damping (per-particle).
 * Material-dependent (batch-15): high CONDUCTIVITY = low resistance, and
 * hotter particles damp harder (the doc's "hotter they get, more they slow"
 * feedback — prevents runaway charge-driven velocities). */
export function applyResistance(p1Ptr, vx, vy, vz, k) {
  const buf = buffer_global;
  const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
  if (speed < 0.01) return null;
  const cond = readDNA(p1Ptr, D.CONDUCTIVITY) || 0;
  const materialFactor = 1 - cond * 0.9; // conductors glide, insulators resist
  const heatFactor = 1 + (buf[p1Ptr + S.TEMPERATURE] || 0) * 2; // hotter → slower
  const damp = speed * k * materialFactor * heatFactor;
  buf[p1Ptr + S.TEMPERATURE] = Math.min(1, (buf[p1Ptr + S.TEMPERATURE] || 0) + speed * k * materialFactor * 0.5);
  return { ax: -vx * damp, ay: -vy * damp, az: -vz * damp };
}

/** CAPACITANCE — store surplus energy as charge (per-particle).
 * Batch-15: discharging drains toward zero only — a depleted capacitor never
 * flips sign from draining. Charging keeps the ±2 breakdown clamp. */
export function applyCapacitanceStore(p1Ptr, k) {
  const buf = buffer_global;
  const energy = buf[p1Ptr + S.ENERGY] || 50;
  const delta = (energy - 50) * k;
  const c = buf[p1Ptr + S.CHARGE] || 0;
  if (delta < 0) {
    // Bleed toward zero; never overshoot into the opposite polarity.
    buf[p1Ptr + S.CHARGE] = c > 0 ? Math.max(0, c + delta) : c;
  } else {
    buf[p1Ptr + S.CHARGE] = clamp(c + delta, -2, 2);
  }
}

/** CAPACITANCE — pairwise force from stored charge. */
export function applyStoredChargeForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const c1 = buf[p1Ptr + S.CHARGE] || 0;
  const c2 = buf[p2Ptr + S.CHARGE] || 0;
  const qq = c1 * c2;
  if (qq === 0) return null;
  const force = -k * qq / (dist * dist + 0.5); // same-sign stored charge repels
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** INDUCTANCE — velocity alignment (magnetic coupling), in-place.
 * Batch-15: coupling scales with the product of MAGNETIC_MOMENT magnitudes
 * (|m1·m2| — induction needs a magnetic field), fades with distance, and both
 * particles must conduct (real materials, consistent with CURRENT). Momentum
 * is conserved: the pair swaps equal-and-opposite velocity deltas. */
export function applyInductance(p1Ptr, p2Ptr, dist, k) {
  const buf = buffer_global;
  const cond = Math.min(readDNA(p1Ptr, D.CONDUCTIVITY) || 0, readDNA(p2Ptr, D.CONDUCTIVITY) || 0);
  if (cond <= 0) return;
  const m1 = readDNA(p1Ptr, D.MAGNETIC_MOMENT) || 0;
  const m2 = readDNA(p2Ptr, D.MAGNETIC_MOMENT) || 0;
  const couple = Math.abs(m1 * m2) / (1 + dist * 0.03);
  if (couple <= 0.0001) return;
  for (const slot of [S.VEL_X, S.VEL_Y, S.VEL_Z]) {
    const dv = (buf[p2Ptr + slot] - buf[p1Ptr + slot]) * k * couple;
    buf[p1Ptr + slot] += dv;
    buf[p2Ptr + slot] -= dv;
  }
}

/** MAGNETISM — aligned moments attract, opposing repel. */
export function applyMagneticForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const m1 = readDNA(p1Ptr, D.MAGNETIC_MOMENT) || 0;
  const m2 = readDNA(p2Ptr, D.MAGNETIC_MOMENT) || 0;
  const mm = m1 * m2;
  if (mm === 0) return null;
  const force = k * mm / (dist * dist + 0.5);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** RESONANCE — sympathetic vibration: matched pulsing pairs attract and amplify.
 * Batch-16: phase alignment matters. In-phase pairs (constructive interference)
 * scale the attraction up and the stronger pulser amplifies the weaker one's
 * SIGNAL — synchronized swarms get louder. Mismatched phase damps the force. */
export function applyResonanceForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const s1 = buf[p1Ptr + S.SIGNAL] || 0;
  const s2 = buf[p2Ptr + S.SIGNAL] || 0;
  if (s1 <= 0.01 || s2 <= 0.01) return null;
  const pr1 = readDNA(p1Ptr, D.PULSE_RATE) || 0.5;
  const pr2 = readDNA(p2Ptr, D.PULSE_RATE) || 0.5;
  const sync = 1.0 - Math.abs(pr1 - pr2);
  const sig = s1 * s2 * Math.max(0, sync);
  if (sig <= 0.001) return null;
  // Same oscillator phase as GLOW/COMMS: phase = sin(age·0.01·(0.1+pulseRate)).
  const ph1 = Math.sin((buf[p1Ptr + S.AGE] || 0) * 0.01 * (0.1 + pr1));
  const ph2 = Math.sin((buf[p2Ptr + S.AGE] || 0) * 0.01 * (0.1 + pr2));
  const phaseSync = 0.5 + 0.5 * Math.cos((ph1 - ph2) * Math.PI * 0.5);
  // Constructive interference: the weaker pulser is driven by the stronger.
  if (phaseSync > 0.6) {
    const weaker = s1 < s2 ? p1Ptr : p2Ptr;
    const stronger = weaker === p1Ptr ? p2Ptr : p1Ptr;
    buf[weaker + S.SIGNAL] = Math.min(1, (buf[weaker + S.SIGNAL] || 0) + (buf[stronger + S.SIGNAL] || 0) * phaseSync * k * 0.1);
  }
  const force = k * sig * phaseSync / (dist + 1.0);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** FLUX — charge carriers drift along the field: F = qE (batch-16).
 * Direction depends on the particle's effective charge q = POLARITY + CHARGE:
 * positive carriers move DOWN the stored-charge gradient (with the field),
 * negative carriers move UP it (electrons run the other way), and neutrals
 * follow the field lines — the classic "pushed toward higher charge" behavior. */
export function applyFluxForce(p1Ptr, p2Ptr, dx, dy, dz, dist, k) {
  const buf = buffer_global;
  const dq = (buf[p2Ptr + S.CHARGE] || 0) - (buf[p1Ptr + S.CHARGE] || 0);
  if (dq === 0) return null;
  const q = (readDNA(p1Ptr, D.POLARITY) || 0) + (buf[p1Ptr + S.CHARGE] || 0);
  // Epsilon band: quantized "default 0" POLARITY is ~1.5e-5, so treat |q| ≤ 1e-3 as neutral (follows the field lines).
  const dir = q > 1e-3 ? -1 : q < -1e-3 ? 1 : 1;
  const force = dir * k * dq / (dist + 1.0);
  const invDist = 1.0 / (dist + 0.001);
  return {
    ax: nanGuard(dx * invDist * force),
    ay: nanGuard(dy * invDist * force),
    az: nanGuard(dz * invDist * force),
  };
}

/** IONIZATION — hard contacts strip charge, forming conserved +/− ion pairs.
 * Batch-16 (match irl): ionization needs a threshold impact (real ionization
 * energy), and it transfers charge — the pair becomes a +/− ion pair with
 * conserved total charge (q_i + q_j = 0). The combined POLARITY of the pair
 * sets which partner turns positive. Already-charged particles are not re-stripped. */
export function applyIonization(p1Ptr, p2Ptr, dist, relSpeed, k) {
  const buf = buffer_global;
  if (dist > 3.0) return;
  const impact = Math.min(1, relSpeed * k);
  if (impact <= 0.15) return; // below ionization energy — no strip
  const c1 = buf[p1Ptr + S.CHARGE] || 0;
  const c2 = buf[p2Ptr + S.CHARGE] || 0;
  if (c1 !== 0 || c2 !== 0) return; // already ionized — no further stripping
  const s = Math.sign((readDNA(p1Ptr, D.POLARITY) || 0) + (readDNA(p2Ptr, D.POLARITY) || 0)) || 1;
  buf[p1Ptr + S.CHARGE] = impact * s;
  buf[p2Ptr + S.CHARGE] = -impact * s;
}

/** DISCHARGE — stored charge bursts into motion + heat (per-particle).
 * Batch-16 (match irl): the spark travels along the potential difference —
 * kicked toward the neighbor with the most opposite stored charge (accumulated
 * by the solver during the pair loop). Random burst only when no opposite-charge
 * field exists nearby. Threshold (|c| ≥ 0.5), heat spike, and reset unchanged. */
export function applyDischarge(p1Ptr, prng, k, aimX, aimY, aimZ) {
  const buf = buffer_global;
  const c = buf[p1Ptr + S.CHARGE] || 0;
  if (Math.abs(c) < 0.5) return null;
  const kick = c * k;
  const aimMag = Math.sqrt(aimX * aimX + aimY * aimY + aimZ * aimZ);
  let ax, ay, az;
  if (aimMag > 0.001) {
    // Spark follows the gradient toward the opposite charge. Direction comes
    // from the aim (already charge-aware); magnitude is |charge|·k so the
    // charge sign never flips the aimed kick.
    ax = Math.abs(kick) * (aimX / aimMag);
    ay = Math.abs(kick) * (aimY / aimMag);
    az = Math.abs(kick) * (aimZ / aimMag);
  } else {
    const dir = prng ? (prng() - 0.5) * 2 : 0;
    ax = kick * 0.6;
    ay = kick * dir;
    az = kick * 0.2;
  }
  buf[p1Ptr + S.TEMPERATURE] = Math.min(1, (buf[p1Ptr + S.TEMPERATURE] || 0) + Math.abs(c) * 0.08);
  buf[p1Ptr + S.CHARGE] = 0;
  return { ax: nanGuard(ax), ay: nanGuard(ay), az: nanGuard(az) };
}

/** PLASMA — the thermal-EM bridge with hysteresis (batch-17, match irl).
 * Above 0.6 surplus heat ionizes into stored charge, cooling the gas. Below
 * 0.5 a cooled plasma recombines: stored charge converts back to heat and the
 * ion resets — real plasma never keeps its charge after it cools. The 0.6/0.5
 * band prevents rapid ionize/recombine oscillation. */
export function applyPlasma(p1Ptr, k) {
  const buf = buffer_global;
  const temp = buf[p1Ptr + S.TEMPERATURE] || 0;
  const excess = temp - 0.6;
  if (excess > 0) {
    const conv = excess * k;
    buf[p1Ptr + S.CHARGE] = clamp((buf[p1Ptr + S.CHARGE] || 0) + conv, -2, 2);
    buf[p1Ptr + S.TEMPERATURE] = temp - conv * 0.5;
    return;
  }
  // Recombination: below the ionization threshold, charge releases as heat.
  if (temp < 0.5) {
    const c = buf[p1Ptr + S.CHARGE] || 0;
    if (c !== 0) {
      buf[p1Ptr + S.TEMPERATURE] = Math.min(1, temp + Math.abs(c) * k * 2);
      buf[p1Ptr + S.CHARGE] = 0;
    }
  }
}

/** SUPERCONDUCTIVITY — cold pairs couple: relative motion damped + charge equalized. */
export function applySuperconductivity(p1Ptr, p2Ptr, k) {
  const buf = buffer_global;
  const t1 = buf[p1Ptr + S.TEMPERATURE] || 0;
  const t2 = buf[p2Ptr + S.TEMPERATURE] || 0;
  if (t1 > 0.35 || t2 > 0.35) return null;
  const dq = ((buf[p2Ptr + S.CHARGE] || 0) - (buf[p1Ptr + S.CHARGE] || 0)) * k * 0.4;
  buf[p1Ptr + S.CHARGE] = (buf[p1Ptr + S.CHARGE] || 0) + dq;
  buf[p2Ptr + S.CHARGE] = (buf[p2Ptr + S.CHARGE] || 0) - dq;
  // Coupling force: damps the subject's motion toward the neighbor's velocity
  return {
    ax: nanGuard((buf[p2Ptr + S.VEL_X] - buf[p1Ptr + S.VEL_X]) * k),
    ay: nanGuard((buf[p2Ptr + S.VEL_Y] - buf[p1Ptr + S.VEL_Y]) * k),
    az: nanGuard((buf[p2Ptr + S.VEL_Z] - buf[p1Ptr + S.VEL_Z]) * k),
  };
}
