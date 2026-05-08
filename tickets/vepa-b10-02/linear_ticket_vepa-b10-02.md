---
id: vepa-b10-02
title: "Help Panel UI Upgrade & Encyclopedia Button"
status: Done
priority: High
order: 20
created: 2026-04-24
updated: 2026-04-24
links:
  - url: ../vepa-epic-07/linear_ticket_vepa-epic-07.md
    title: Parent Ticket
---

# Description

## Problem to solve
The Help Panel's "Encyclopedia" button (📖) is currently inside the tooltip or lacks a standard position. The Help Panel layout needs to be modernized with the 📖 button in a square slot at the top right, to the left of the close [X] button. Also, tooltips and the help panel should close when clicking anywhere outside of them.

## Solution
- Update `HelpPanel.render` to include the square 📖 button in the header.
- Implement "click-outside" logic for both `Tooltip` and `HelpPanel`.
- Ensure the '?' toggle (Help Mode) correctly manages the visibility of these elements.

## Implementation Details
- Modify `src/ui.js`: `HelpPanel` class, `Tooltip` class, and global click listeners.
- Update `style.css`: Add styles for the square 📖 button and header layout.
