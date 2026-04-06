# LAB//NOTEBOOK — Architecture Specification
**Document:** 20260405_005_architecture_spec.md  
**Date:** 2026-04-05  
**Status:** GOVERNING — no module is built that contradicts this document without a recorded revision  
**Author:** JDW

---

## 1. Vision

A personal electronics design workbench — schematic capture, parameter-aware component library, pre-simulation design validation, BOM management, project logging, and test data correlation — built for one engineer, architected for commercial extensibility.

This is not a teaching tool. It is not a collaboration platform. It is a precision instrument for electronics design, built the way EWB should have been built.

Commercial potential is preserved by clean architecture, open data formats, and separation of concerns. Nothing is hardcoded that should be configurable. Nothing is coupled that should be independent.

---

## 2. Design Principles

1. **Data first.** The component schema and project data model are designed before any UI. UI is a view over data, not the other way around.
2. **Plain formats.** All project data is JSON. All schematics are JSON. No proprietary binary formats. Everything is readable, scriptable, and version-controllable.
3. **No build tools required.** The core application runs as static HTML/JS from disk or GitHub Pages. No webpack, no npm, no server required for basic use.
4. **Mobile-first.** Every UI decision is validated against S25 Ultra portrait use first.
5. **Separation of concerns.** Each module has a defined boundary. Modules communicate through documented interfaces, not shared globals.
6. **Parameter depth.** Every component carries three parameter layers: ideal, datasheet, and environmental. The UI exposes the appropriate layer for the task.
7. **Commercial hygiene.** No dependencies that cannot be replaced. No vendor lock-in. License-clean from day one.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LAB//NOTEBOOK                           │
├─────────────┬──────────────┬───────────────┬───────────────┤
│  SCHEMATIC  │   PROJECT    │  COMPONENT    │  VALIDATION   │
│  EDITOR     │   MANAGER    │  DATABASE     │  ENGINE       │
├─────────────┼──────────────┼───────────────┼───────────────┤
│  Canvas     │  Log         │  Schema       │  Rules        │
│  Symbols    │  BOM         │  Parameters   │  Thermal      │
│  Wiring     │  Versions    │  Search       │  Electrical   │
│  Export     │  Assets      │  Import/Export│  Derating     │
├─────────────┴──────────────┴───────────────┴───────────────┤
│                      DATA LAYER                             │
│         JSON Project Files  /  Component Registry          │
├─────────────────────────────────────────────────────────────┤
│                    STORAGE LAYER                            │
│         GitHub API  /  Box.com  /  Local File System       │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Module Definitions

### 4.1 Schematic Editor
**File:** `tools/schematic_editor.html`  
**Responsibility:** Visual placement and wiring of components on an infinite canvas.  
**Inputs:** Component definitions from Component Database  
**Outputs:** Schematic JSON (`schematic.json`)  
**Boundaries:**
- Does not perform simulation
- Does not validate design rules (delegates to Validation Engine)
- Does not manage project files (delegates to Project Manager)
- Does not store component parameters (reads from Component Database)

### 4.2 Project Manager
**File:** `tools/project_manager.html` *(planned)*  
**Responsibility:** Project creation, file organization, version history, build log, asset management.  
**Inputs:** User actions, schematic JSON, BOM JSON, test data  
**Outputs:** Project manifest (`project.json`), committed versions via GitHub API  
**Boundaries:**
- Does not edit schematics
- Does not define components
- Does not run validation

### 4.3 Component Database
**File:** `assets/components/component_registry.json`  
**Responsibility:** Single source of truth for all component definitions — symbols, pins, ideal parameters, datasheet parameters, environmental parameters.  
**Inputs:** JSON component definitions  
**Outputs:** Component objects consumed by Schematic Editor and Validation Engine  
**Boundaries:**
- Pure data — no UI logic
- No project-specific data
- Versioned independently of projects

### 4.4 Validation Engine
**File:** `tools/validation_engine.js` *(planned)*  
**Responsibility:** Design rule checking against component parameters. Flags thermal violations, voltage/current overloads, timing issues, derating violations.  
**Inputs:** Schematic JSON + Component Database  
**Outputs:** Validation report JSON (`validation_report.json`)  
**Boundaries:**
- Read-only — does not modify schematics
- Does not perform full SPICE simulation (that is a future module)
- Reports violations; does not auto-fix

---

## 5. Data Model

### 5.1 Project Manifest (`project.json`)
```json
{
  "schema_version": "1.0",
  "project_id": "AM_receiver_20260405",
  "created": "2026-04-05T00:00:00Z",
  "modified": "2026-04-05T00:00:00Z",
  "description": "AM broadcast receiver, 1610 kHz target (KLIX)",
  "phase": "breadboard_prototype",
  "schematics": ["schematics/20260405_001_schematic.json"],
  "bom": "bom.json",
  "log": "log.json",
  "validation_reports": [],
  "assets": []
}
```

### 5.2 Schematic File (`schematic.json`)
```json
{
  "schema_version": "1.0",
  "project_id": "AM_receiver_20260405",
  "created": "2026-04-05T00:00:00Z",
  "components": [
    {
      "id": 1,
      "type": "inductor",
      "ref": "L1",
      "x": 100,
      "y": 80,
      "rotation": 0,
      "flipH": false,
      "parameters": {
        "value": "220µH",
        "tolerance": "±10%",
        "current_rating": "300mA",
        "dcr": "2.8Ω",
        "self_resonant_freq": "3.5MHz"
      },
      "notes": "Bojack DIP choke kit"
    }
  ],
  "wires": [
    {"x1": 130, "y1": 80, "x2": 180, "y2": 80}
  ],
  "nets": []
}
```

### 5.3 BOM Entry
```json
{
  "ref": "L1",
  "type": "inductor",
  "value": "220µH",
  "quantity": 1,
  "source": "Bojack kit",
  "unit_cost": null,
  "in_inventory": true,
  "datasheet_url": null,
  "notes": "Tank circuit inductor"
}
```

### 5.4 Log Entry
```json
{
  "id": "log_001",
  "timestamp": "2026-04-05T14:23:00Z",
  "phase": "breadboard_prototype",
  "type": "build",
  "title": "Tank circuit assembled",
  "body": "L1 and C1 placed on breadboard. Measured resonant freq at 1.58 MHz — need to trim C.",
  "measurements": [
    {"label": "f_resonant", "value": 1580, "unit": "kHz"}
  ],
  "assets": []
}
```

---

## 6. Component Schema

Every component in the registry follows this schema. See `20260405_006_component_parameter_master.md` for all values.

```json
{
  "type": "string",           
  "category": "string",       
  "label": "string",          
  "sub": "string",            
  "symbol": {
    "w": "number",
    "h": "number",
    "pins": [
      {"name": "string", "x": "number", "y": "number", "type": "string"}
    ]
  },
  "parameters": {
    "ideal": {
      "field_name": {
        "label": "string",
        "unit": "string",
        "default": "any",
        "type": "string"
      }
    },
    "datasheet": {
      "field_name": {
        "label": "string",
        "unit": "string",
        "default": null,
        "type": "string",
        "min": "any",
        "typ": "any",
        "max": "any"
      }
    },
    "environmental": {
      "field_name": {
        "label": "string",
        "unit": "string",
        "default": null,
        "type": "string"
      }
    }
  }
}
```

### Pin Types
| Type | Meaning |
|------|---------|
| `passive` | No polarity — resistor lead, inductor terminal |
| `input` | Signal input |
| `output` | Signal output |
| `bidirectional` | Can be input or output |
| `power` | Supply rail |
| `ground` | Ground reference |
| `control` | Gate, base, control input |
| `analog` | Analog signal |
| `rf` | RF/high-frequency signal |
| `thermal` | Thermal connection (Peltier, heatsink) |
| `optical` | Optical port (photodiode, LED) |

---

## 7. File Naming Convention

All files: `YYYYMMDD_NNN_description.ext`

| Prefix | Module |
|--------|--------|
| `schematic_` | Schematic JSON files |
| `bom_` | BOM files |
| `log_` | Project log files |
| `validation_` | Validation reports |
| `capture_` | Scope/instrument captures |
| `arch_` | Architecture documents |

---

## 8. Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | Vanilla JS | No build tools, runs anywhere, no dependency rot |
| Storage | JSON files | Human-readable, git-friendly, portable |
| Version control | GitHub API | Already in use, free, accessible from all devices |
| Asset storage | Box.com | Cross-device, already provisioned |
| Rendering | HTML5 Canvas | Full control, no library dependencies, performant |
| Mobile | Touch-first Canvas | Native touch events, no framework needed |
| Android wrapper | WebView + Android Studio | Thin wrapper over web app, single codebase |
| Future simulation | SPICE netlist export | Industry standard, plugs into existing simulators |
| Fonts | Google Fonts CDN | Share Tech Mono, Barlow — consistent identity |

---

## 9. Module Build Order

Build in this sequence. Each module is usable before the next is started.

```
Phase 1 — COMPLETE
  ✓ Schematic Editor (symbol rendering, wiring, export/import)
  ✓ Component Library (passives, semiconductors, ICs, power, RF, instruments)
  ✓ Android scaffold (MainActivity, HelpActivity, menu)
  ✓ User Manual

Phase 2 — NEXT
  □ Component Parameter Schema (this document + component master)
  □ Expanded component library (FETs, transformers, Peltier, thermal, optical)
  □ Parameter panel in editor (ideal/datasheet/environmental tabs)
  □ Net labeling

Phase 3
  □ Project Manager UI
  □ BOM Manager
  □ Project Log with measurement entry
  □ GitHub API save/load

Phase 4
  □ Validation Engine (DRC — design rule check)
  □ Thermal analysis
  □ Derating calculator

Phase 5
  □ SPICE netlist export
  □ Test data correlation
  □ Scope capture integration

Phase 6 — Commercial Readiness
  □ Multi-user project sharing
  □ Component database import (Octopart, Digi-Key API)
  □ License and packaging decisions
```

---

## 10. Commercial Architecture Notes

These decisions are made now to preserve future options:

- **Component registry is separate from the editor.** It can be licensed, sold, or API-served independently.
- **Project files are open JSON.** No lock-in. This is a feature, not a limitation — engineers trust tools that don't trap their data.
- **Validation Engine is a separate module.** It can run server-side, as a CI check, or as a standalone tool.
- **The Android app is a thin wrapper.** The web app is the product. Android, iOS, desktop wrappers are distribution channels.
- **No telemetry, no accounts, no cloud dependency in the core tool.** These are opt-in additions for a commercial tier, not requirements for the base tool.

---

## 11. Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-04-05 | Initial governing document |
