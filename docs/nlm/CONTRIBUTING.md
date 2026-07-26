# Architectural Contribution Guide

Welcome, Architect. To contribute a new Genomic Law to VEPA, follow this rigorous protocol.

## Protocol for New DNA Traits
1.  **Define the Parameter:** Identify a trait that is not yet covered (e.g., *Metabolic Half-life*).
2.  **Assign Index:** Map the trait to a vacant slot in the **24-word Stride** (0x24 - 0x58).
3.  **Update SSoT:** Add the parameter name to `DNA_META` in `constants.js`.
4.  **Implement Physics:** Add the trait's influence logic to the **Physics Worker**.
5.  **Populate Codex:** Add a full `HELP_DB` entry with Hint, Explanation, System, and Advanced layers.
6.  **Add Drone Lore:** Update `DRONE_COMMENTS` to provide snarky feedback on the new trait.

## Coding Standards
*   **Locality First:** Keep calculations local to the 24-word stride. Avoid external object lookups.
*   **Zero-Copy:** Ensure all state changes occur within the `SharedArrayBuffer`.
*   **Deterministic:** Use seedable noise for mutation and reproduction.

## Review Process
All new "Laws" are reviewed for:
*   **Architectural Fit:** Does it enhance or dilute emergent complexity?
*   **Performance Impact:** Does it significantly lower the PPS (Particles Per Second)?
*   **Lore Consistency:** Does it fit the "Architect Codex" narrative?
