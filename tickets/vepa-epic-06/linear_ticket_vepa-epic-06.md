---
id: vepa-epic-06
title: "[Epic] Biology & Physics Reorganization"
status: Backlog
priority: High
order: 10
created: 2026-04-24
updated: 2026-04-24
---

# Description

## Problem to solve
The current physics and biology logic are somewhat mixed in the "laws" UI. Additionally, particles have lost some of their "smoothness" in movement and accretion. The biological systems are too simplistic and need expansion into more granular triggers like tracking, senescence, and genotype/phenotype expressions.

## Solution
1. Reorganize laws into two distinct groups: "pure" (physics) and "biol" (biology).
2. Expand biological systems with specialized sub-triggers.
3. Fix the flickering and improve the smoothness of the physics engine.

## Implementation Details
- Move physics-only laws (G, dt, drag, etc.) to a 'pure' group.
- Create a 'biol' group for biological triggers (affinity, reproduction, tracking, senescence, genotype, phenotype).
- Refactor worker logic to handle these groups.
- Investigate and fix the flickering/smoothness regression.
