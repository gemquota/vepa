---
id: vepa-b6-01
title: "Global Fields: Temp, Pressure & Wind (v1.5+)"
status: Todo
priority: Medium
order: 100
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
The simulation environment is static and uniform. We need global environmental stressors.

## Solution
Implement world-wide fields for temperature, pressure, and air-currents (wind/turbulence).

## Implementation Details
- Add World Temperature, Pressure, and Wind Vector to Global Settings.
- Implement Temperature-linked jitter and Metabolism scaling.
- Implement Wind as a global force vector.
- UI: Add World Field sliders to the PHYS tab.
