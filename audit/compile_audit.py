#!/usr/bin/env python3
"""
VEPA v3 — Audit Batch Compiler
Compiles all 10 batch audit artifacts into a single comprehensive report.
Run: python3 audit/compile_audit.py
"""

import os
from pathlib import Path

BATCHES_DIR = Path(__file__).parent / "batches"
OUTPUT = Path(__file__).parent / "FULL_AUDIT.md"

def compile_audit():
    batch_files = sorted(BATCHES_DIR.glob("*.md"))
    
    if not batch_files:
        print("ERROR: No batch files found in audit/batches/")
        return
    
    print(f"Found {len(batch_files)} batch files")
    
    sections = []
    
    for bf in batch_files:
        content = bf.read_text()
        # Extract title from first line
        title_line = content.strip().split('\n')[0].replace('# ', '')
        sections.append((bf.stem, title_line, content))
    
    # Build compilation
    header = """# VEPA v3 — Comprehensive Functionality Parity Audit

> **Compiled:** auto-generated
> **Batches:** 10
> **Scope:** All laws, DNA parameters, UI panels, engines, and core systems

---

## Executive Summary

This audit covers all 38 laws, 42 DNA parameters, 7 UI panel components,
5 engines, and core system infrastructure of VEPA v3. Each component is
checked for: definition completeness, implementation status, wiring/calling
in the solver, and runtime behavior.

### Key Metrics

| Category | Total | Implemented | Missing/Dead | Health |
|----------|-------|-------------|-------------|--------|
| Physics Laws | 7 | 7 | 2 dead funcs | 71% |
| Biology Laws | 10 | 5 | 5 missing, 2 dead funcs | 50% |
| Chemistry Laws | 8 | 4 | 4 missing, 4 dead funcs | 50% |
| Thermodynamics Laws | 5 | 2 | 3 missing, 2 dead funcs | 40% |
| Metaphysics Laws | 8 | 8 | 0 | 100% |
| DNA Motion Parameters | 8 | 5 | 3 unused | 62% |
| DNA Matter Parameters | 9 | 5 | 4 unused | 55% |
| DNA EM Parameters | 7 | 5 | 2 unused | 71% |
| DNA Biology Parameters | 7 | 5 | 2 unused | 71% |
| DNA Communication Params | 11 | 0 | 11 unused | 0% |
| UI Panels | 7 | 6 | 1 missing | 85% |
| Engines | 5 | 0 | 5 not wired | 0% |

### Critical Gaps

1. **5 Engines not wired**: Goal, Insight, Narrative, Lineage, Timeline — disconnected
2. **10 Laws missing implementations**: GLOW, SENESCENCE, ENERGY, RADIATION, PHENOTYPE,
   ISOMERIZATION, CHIRALITY, CRYSTALLIZATION, PHASE_RADIATION, SUBLIMATION
3. **11 DNA params completely unused**: Entire Communication group (SIGNAL_RESP through TUNING_CH4, MEMORY_DECAY)
4. **No World Panel**: #world-panel container exists but no component renders into it

---

## Per-Batch Details

"""
    
    footer = """
---

## Compilation Notes

- Dead function = function that exists in source but is never called from the solver
- Missing implementation = law has an index in LAW_INDEXES but no function in laws.js
- Unused DNA param = defined in DNA_INDEXES/DNA_RANGES but never read in solver.js or laws.js
- This audit covers `v3/src/` as of the latest commit on the `new` branch
- Synergies: 19 synergy checks in solver, 8 combination rules in synergy.js
"""
    
    with open(OUTPUT, 'w') as f:
        f.write(header)
        
        for stem, title, content in sections:
            batch_num = stem.split('_')[0]
            f.write(f"\n---\n\n### Batch {batch_num}: {title}\n\n")
            # Include the full content but strip the top-level heading (already present)
            lines = content.strip().split('\n')
            # Skip the first "# Title" line since we have a custom header
            body = '\n'.join(lines[1:]).strip()
            f.write(body)
            f.write('\n')
        
        f.write(footer)
    
    print(f"Compiled audit written to {OUTPUT}")
    print(f"Size: {OUTPUT.stat().st_size} bytes")

if __name__ == "__main__":
    compile_audit()
