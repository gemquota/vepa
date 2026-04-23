---
id: vepa-b7-03
title: "Fix physics flickering and smooth orbits/accretion"
status: Todo
priority: High
order: 30
created: 2026-04-24
updated: 2026-04-24
links:
  - url: ../vepa-epic-06/linear_ticket_vepa-epic-06.md
    title: Parent Ticket
---

# Description

## Problem to solve
Particles are flickering and movement isn't as smooth as it used to be.

## Solution
Analyze the sub-stepping and interpolation logic. Fix rendering artifacts.

## Implementation Details
- Debug worker-main synchronization.
- Improve accretion smoothing.
