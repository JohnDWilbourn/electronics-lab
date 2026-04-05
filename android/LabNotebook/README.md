# LabNotebook — Android Studio Project
**Date:** 2026-04-05  
**Package:** com.electronicslab.labnotebook  
**Min SDK:** 24 (Android 7.0)  
**Target:** S25 Ultra, S24 FE

---

## Project Structure

```
LabNotebook/
├── app/
│   ├── build.gradle
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── assets/
│       │   ├── schematic_editor.html     ← COPY FROM tools/
│       │   └── help/
│       │       └── manual.html           ← COPY FROM docs/
│       ├── java/com/electronicslab/labnotebook/
│       │   ├── MainActivity.java         ← Hosts schematic editor
│       │   └── HelpActivity.java         ← Hosts user manual
│       └── res/
│           ├── layout/
│           │   ├── activity_main.xml
│           │   └── activity_help.xml
│           ├── menu/
│           │   └── main_menu.xml         ← Help item is here
│           └── values/
│               ├── strings.xml
│               ├── colors.xml
│               └── styles.xml
├── build.gradle
└── settings.gradle
```

---

## Asset Placement (REQUIRED before building)

The web files must be copied into `app/src/main/assets/` for the APK to bundle them.

```bash
# From Electronics-lab root:
cp tools/20260405_001_schematic_editor.html \
   LabNotebook/app/src/main/assets/schematic_editor.html

cp docs/20260405_003_lab_notebook_manual.html \
   LabNotebook/app/src/main/assets/help/manual.html
```

Note: asset filenames are fixed (no date prefix) because the Java code
references them by exact path. The source files keep their date-prefixed
names in the project — only the bundled copies are renamed.

---

## Missing Drawables

Android Studio will flag two missing drawable resources:
- `@drawable/ic_new` — add a New File icon (24dp, white/accent)
- `@drawable/ic_help` — add a Help/Question Mark icon (24dp, white/accent)

Use Android Studio's built-in Vector Asset tool:
File → New → Vector Asset → Clip Art → search "add" / "help"
Set tint to `@color/accent` (#00E5FF).

---

## Building

1. Open Android Studio
2. File → Open → select the `LabNotebook/` folder
3. Copy assets as described above
4. Add the two drawable icons
5. Build → Make Project
6. Run on device or emulator (API 24+)

---

## WebView Debug

In debug builds, WebView remote debugging is enabled.
Connect Chrome on desktop → `chrome://inspect` to debug the
schematic editor and manual running inside the app.

---

## Future Modules

When new web modules are added (Project Log, BOM, Test Data):
1. Add the HTML file to `assets/`
2. Add a new Activity class
3. Add a menu item in `main_menu.xml`
4. Wire the menu item in `MainActivity.onOptionsItemSelected()`

The pattern is identical to how HelpActivity is wired now.
