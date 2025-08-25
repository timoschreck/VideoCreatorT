# Musik Video Editor

Dies ist ein erster Prototyp für eine plattformübergreifende Anwendung zur Erstellung von Musikvideos mit ChatGPT‑Unterstützung. Die App basiert auf Electron und verwendet HTML/CSS/JavaScript für die Oberfläche.

## Funktionen

* **Datei öffnen und abspielen** – Es können Video‑ und Audiodateien (MP4, MOV, MP3, WAV, OGG) ausgewählt und im integrierten Player wiedergegeben werden.
* **ChatGPT‑Integration** – Ein Chatbereich ermöglicht es, direkt Fragen an ChatGPT zu stellen, um kreative Ideen, Ratschläge oder technische Hilfestellungen zu erhalten. Der API‑Key muss gesetzt werden.
* **Basis für weitere Erweiterungen** – Diese Struktur dient als Ausgangspunkt. Funktionen wie Schneiden, Übergänge, Effekte, Textoverlays und Export können über weitere Komponenten (z. B. ffmpeg) hinzugefügt werden.

## Voraussetzungen

* **Node.js** (Version 16 oder höher) und npm müssen installiert sein.
* Ein API‑Schlüssel von OpenAI wird benötigt. Diesen können Sie unter [platform.openai.com](https://platform.openai.com) generieren. Setzen Sie den Schlüssel entweder als Umgebungsvariable `OPENAI_API_KEY` oder tragen Sie ihn in `main.js` ein.

## Installation

1. Wechseln Sie in das Verzeichnis `video-editor-app`:

   ```bash
   cd video-editor-app
   ```
2. Installieren Sie die Abhängigkeiten:

   ```bash
   npm install
   ```

## Starten der App

```bash
npm start
```

Die Anwendung öffnet ein Fenster, in dem Sie über „Video öffnen“ eine Mediendatei auswählen können. Rechts befindet sich der Chatbereich.

## Weiterentwicklung

Für die eigentliche Videobearbeitung (Schneiden, Zusammensetzen, Effekte) empfiehlt sich die Nutzung von **ffmpeg**. Unter Node.js können Sie über das Modul `child_process` ffmpeg‑Kommandos ausführen oder Bibliotheken wie [`fluent-ffmpeg`](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) nutzen. Mit React oder anderen Frameworks lässt sich das UI weiterentwickeln (Timeline‑Editor, Drag&Drop). Dieser Prototyp zeigt den Einstieg und die Anbindung von ChatGPT.

Viel Erfolg beim Ausbau Ihres Musikvideo‑Editors!