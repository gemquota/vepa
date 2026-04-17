---
id: vepa-b3-02
title: "Expanded Communication System (v1.2)"
status: Done
priority: Medium
order: 30
created: 2026-03-03
updated: 2026-03-03
links:
  - url: ../vepa-epic-01/linear_ticket_vepa-epic-01.md
    title: Parent Ticket
---

# Description

## Problem to solve
The current signal response is a single parameter. We need a more complex communication system for emergent collective behavior.

## Solution
Implement multi-channel signal propagation with strength, decay, and receiver tuning.

## Implementation Details
- Add Signal Strength, Signal Decay, and Signal Channels (1–4) to DNA.
- Implement Receiver Tuning to filter signal channels.
- Implement Propagation Speed (delay in wave traversal).
- UI: Add Communication sliders to the DNA tab.
