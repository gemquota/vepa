# The Codex Deep-Linking System

The VEPA Codex supports a deep-linking protocol that allows users to share specific technical entries or lore pages via URL parameters.

## 1. URL Protocol
To link directly to a Codex entry, use the following syntax:
`index.html?codex=true&entry=Force`

## 2. Parameter Parsing
The `main.js` and `codex/main.js` scripts parse these parameters during the `init()` phase:
```javascript
const params = new URLSearchParams(window.location.search);
const entryParam = params.get('entry');
if (entryParam && codexData[entryParam]) {
    selectEntry(entryParam);
}
```

## 3. UI Integration
Each Codex entry includes a "Deep Link" button that copies the direct URL to the clipboard, facilitating easy knowledge sharing among Architects.

---
*Interface Spec v1.1*
