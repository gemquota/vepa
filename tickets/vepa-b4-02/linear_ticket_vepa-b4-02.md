---
id: vepa-b4-02
title: "Advanced Matter: Base Radius & Elasticity (v1.3)"
status: Todo
priority: Medium
order: 50
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
Particles currently have a fixed relationship between mass and radius. We need species-level control over their physical extent and collision behavior.

## Solution
Implement Base Radius (independent of mass), Per-species Elasticity, and Bond Angle Preference.

## Implementation Details
- Add Base Radius, Per-species Elasticity, and Bond Angle Preference to DNA.
- Update collision resolution to use species-level elasticity.
- Implement angle-dependent force bias for "Crystal" tuning.
- UI: Add Matter sliders to the DNA tab.
