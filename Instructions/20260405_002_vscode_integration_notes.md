# VS Code / Cursor / Copilot — Electronics-lab Integration Notes
**Date:** 2026-04-05  
**Project:** Electronics-lab  
**Status:** Reference / deferred implementation

---

## The Stack

| Tool | Role | Limit / Issue |
|------|------|---------------|
| VS Code | Editor, file manager, Git | No context limit |
| Cursor | AI-assisted editing | **Short context window** — loses thread on large files |
| GitHub Copilot | Inline completion, chat | Active subscription — use for boilerplate, completions |
| Claude (chat) | Architecture, complex builds | Long context, surgical edits |

---

## Working Around Cursor's Context Limit

Cursor loses context fast on large HTML/JS files (like the schematic editor).  
These strategies keep it useful without hitting the wall:

### 1. Split files at natural seams
Instead of one monolithic HTML file, break the editor into:
- `editor-core.js` — canvas, draw loop, state
- `components.js` — component library definitions and draw functions
- `ui.js` — toolbar, properties panel, library panel
- `index.html` — thin shell that loads them

Cursor can work on one module at a time without needing the whole picture.

### 2. Use `.cursorrules` at project root
Create `~/Projects/Electronics-lab/.cursorrules` with standing instructions:

```
This is a browser-based electronics lab notebook.
No frameworks. Vanilla JS, HTML, CSS only.
No build tools. Files must run directly from disk or GitHub Pages.
Mobile-first. Touch events required alongside mouse events.
File naming: YYYYMMDD_NNN_filename.ext
Do not rename, move, or delete files without explicit instruction.
Do not execute commands without explicit instruction.
```

This persists across sessions and constrains Copilot/Cursor behavior.

### 3. Keep a `CONTEXT.md` in each project folder
One file that summarizes the project state for pasting into Cursor when the window resets:

```markdown
# AM_receiver_20260405 — Context
Target: AM receiver, 1610 kHz (KLIX)
Phase: 1 — breadboard prototype
Key components: LM386, 1N4148, 220µH, 100pF + 50pF trimmer, 18650
Schematic editor: tools/schematic-editor.html
BOM: projects/AM_receiver_20260405/bom.json
Log: projects/AM_receiver_20260405/log.json
```

Paste this at the top of any Cursor session to restore context in ~50 tokens.

### 4. Use Copilot for what it's good at inside VS Code
- Autocomplete repetitive draw functions (new component symbols)
- Boilerplate JSON structures
- CSS property completion
- Do NOT use it for architecture decisions or multi-file refactors

### 5. Use Claude chat for heavy lifts
- Full file builds
- Architecture decisions
- Debugging logic errors
- Anything that requires holding the whole picture

Then paste the result into VS Code manually. This keeps execution in your hands.

---

## Permissions Boundary (deferred — your note)

When you're ready to set hard limits on what Cursor/Copilot can execute:
- VS Code has a `terminal.integrated.env` setting to restrict shell access
- Cursor has no built-in execution permissions — control is at the OS level
- Consider a separate low-privilege user account for AI-assisted editing sessions
- `.cursorrules` `do not execute` instruction is advisory only — not enforced

**Do not implement this section until you've decided on the approach.**

---

## GitHub Copilot — Current Subscription Value

With an active Copilot subscription and the Electronics-lab on GitHub:
- Copilot sees your repo files as context in VS Code
- Useful for: completing component draw functions, JSON schema, CSS
- Less useful for: anything requiring knowledge of your specific project architecture
- Copilot Chat in VS Code sidebar can answer "what does this function do" questions without leaving the editor

---

## File Location Convention

All project files follow: `YYYYMMDD_NNN_filename.ext`  
Common assets live closer to `~/Projects/Electronics-lab/` root.  
Project-specific files live under `projects/AM_receiver_20260405/`.  
Claude drops files where you tell it. You own the folder structure.
