# The Chaos Multiplex & Parallel Realities

The Chaos Multiplex is a high-level experimentation UI that allows the Architect to run multiple parallel universes simultaneously to brute-force evolutionary outcomes.

## 1. Iframe Sandboxing
The Multiplex uses a grid of iframes, each running an independent instance of the `VepaEngine`. This ensures that a crash or a "Big Rip" in one universe does not affect the master simulation.

## 2. Brute-Force Evolution
Architects can use the Multiplex to:
1.  **Reroll:** Run 12 identical setups with different PRNG seeds.
2.  **Drift:** Apply a slight "DNA Drift" to each instance.
3.  **Select:** Identify the most "interesting" universe (using the Insight Engine) and import its state back into the master simulation.

## 3. Multiplex Protocol
The master UI communicates with sandboxed iframes via `postMessage`.
*   **Export:** Captures the current `worldConfig`, `laws`, and `dnaBuffer`.
*   **Import:** Splicing the state from a successful parallel reality into the active SharedArrayBuffer.

---
*Experimental Physics Spec v2.1*
