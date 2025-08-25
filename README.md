# Online Musik Video Editor (Web Version)

Diese Version des Musikvideo‑Editors funktioniert komplett clientseitig im Browser und benötigt keine Installation von Node.js oder Electron. Sie können den Ordner auf einem Webserver (z. B. GitHub Pages) hosten oder die `index.html` lokal im Browser öffnen.

## Funktionen

Die Web‑Version bietet bereits viele grundlegende Bearbeitungsfunktionen:

* **Clips verwalten:** Sie können mehrere Video‑ oder Audiodateien auswählen, die als einzelne Clips in einer Zeitleiste erscheinen. Für jeden Clip können Start‑ und Endzeitpunkte festgelegt, die Reihenfolge verändert oder der Clip entfernt werden.
* **Alle Clips in der Vorschau abspielen:** Über den Button „Alle Vorschau“ werden alle Clips in der definierten Reihenfolge und Länge hintereinander abgespielt.
* **Hintergrund‑Audio:** Sie können zusätzlich eine Hintergrund‑Audiodatei hochladen (z. B. den Song für das Musikvideo). Die Audiodatei wird während der Vorschau abgespielt und beim Export mit dem Video gemischt. Sobald eine Audiodatei ausgewählt wurde, wird der Button „Audio hinzufügen“ den Dateinamen anzeigen.
* **Videofilter:** Über ein Dropdown‑Menü können Sie einen globalen Filter für Ihr Video auswählen (Schwarz/Weiß, Sepia, invertiert). Dieser Filter wird in der Vorschau als CSS‑Filter dargestellt und beim Export mit `ffmpeg.wasm` auch auf das Endvideo angewendet.
* **Video‑Suche:** Über das Feld „Suchbegriff für Video…“ können Sie kostenlose Stock‑Videos direkt aus der App durchsuchen. Die Anwendung verwendet die Pexels‑API, um Videos zu finden, die für den gewerblichen Einsatz frei sind. Zu jedem Ergebnis wird ein Vorschaubild angezeigt und ein Button „Clip hinzufügen“, mit dem der Clip heruntergeladen und sofort Ihrer Zeitleiste hinzugefügt wird.
* **Automatisches Suchen von Clips anhand des Drehbuchs:** Nach der Erstellung eines Drehbuchs können Sie mit dem Button „Clips für Szenen suchen“ für die ersten Szenen passende Stock‑Videos suchen lassen. Die App nimmt die Textbeschreibungen der Szenen, sendet sie als Suchbegriffe an die Pexels‑API und fügt die am besten passenden Clips automatisch der Zeitleiste hinzu. So erhalten Sie schnell visuelle Rohmaterialien, die Sie anschließend weiter zuschneiden und bearbeiten können.
* **Drehbuch generieren:** Geben Sie einen Musiktitel ein und lassen Sie ChatGPT ein detailliertes Drehbuch mit nummerierten Szenen, Beschreibungen und Dauerangaben erstellen. Das generierte Drehbuch kann als Textdatei heruntergeladen und als Vorlage für eigene Videoaufnahmen verwendet werden.
* **Lautstärkeregler:** Ein Schieberegler erlaubt die Anpassung der Lautstärke des Hintergrund‑Audios. Der eingestellte Pegel wirkt sich auf die Vorschau und den exportierten Clip aus.
* **Übergänge zwischen Clips:** Über das Dropdown „Übergang“ können Sie wählen, ob ein Fade‑In/Fade‑Out für die Clips verwendet werden soll. Bei Auswahl der Option „Fade (Ein-/Ausblenden)“ wendet die Anwendung auf jeden Clip eine kurze Ein- und Ausblendung an; beim Export werden die Clips mit sanften Übergängen zusammengesetzt.
* **Clips exportieren:** Mit dem Button „Exportieren“ lassen sich alle zugeschnittenen Clips als ein einzelnes MP4‑Video zusammenfügen und herunterladen. Wenn ein Hintergrund‑Audio gewählt wurde, entfernt die Anwendung zunächst den Ton der Clips und mischt das ausgewählte Audio über das gesamte Video. Hierfür wird `ffmpeg.wasm` (WebAssembly) verwendet, sodass der Export vollständig im Browser erfolgt.
* **Integrierter Chatbereich:** Stellen Sie Fragen an ChatGPT. Es wird der OpenAI‑Chat‑Completion‑Endpunkt im Browser per Fetch aufgerufen.
* **API‑Key‑Eingabe:** Speichern Sie Ihren OpenAI‑API‑Schlüssel lokal im Browser (`localStorage`), sodass er nicht bei jedem Laden neu eingegeben werden muss.

## Nutzung

1. **API‑Key eingeben:** Tragen Sie Ihren OpenAI‑API‑Key in das entsprechende Feld ein und klicken Sie auf „Speichern“. Der Schlüssel wird nur lokal im Browser gespeichert.
2. **Clip(s) hinzufügen:** Klicken Sie auf „Clip hinzufügen“ und wählen Sie eine oder mehrere Video‑/Audiodateien aus. Jeder ausgewählte Clip erscheint in der Zeitleiste. Stellen Sie optional Start‑ und Endzeiten ein oder verschieben Sie die Clips per Auf‑/Ab‑Buttons.
3. **Optional Hintergrund‑Audio hinzufügen:** Über den Button „Audio hinzufügen“ können Sie eine Audiodatei (mp3, wav, aac, ogg oder flac) auswählen. Nach der Auswahl erscheint der Dateiname auf dem Button. Diese Datei wird als Soundtrack genutzt, sowohl in der Vorschau als auch beim Export.
4. **Filter auswählen (optional):** Wählen Sie über das Dropdown „Filter“ einen Effekt für das gesamte Video (z. B. Schwarz/Weiß, Sepia oder invertiert). In der Vorschau wird der Filter sofort sichtbar, beim Export wird er ebenfalls angewendet.
5. **Lautstärke einstellen (optional):** Mit dem Schieberegler „Lautstärke“ regulieren Sie den Pegel der Hintergrund‑Audiodatei. Werte zwischen 0 und 1 sind möglich (Standard = 1). Dieser Wert beeinflusst auch das exportierte Video.
6. **Drehbuch generieren (optional):** Geben Sie einen Musiktitel in das Feld „Musiktitel eingeben“ ein und klicken Sie auf „Drehbuch generieren“. ChatGPT erstellt ein Drehbuch mit Szenen und Dauerangaben. Der Text wird im Eingabefeld angezeigt und kann per „Script herunterladen“ als Datei gespeichert werden. Nutzen Sie das Drehbuch als Vorlage, um passende Clips zu filmen oder auszuwählen.
7. **Clips in der Vorschau ansehen:** Mit dem Button „Alle Vorschau“ werden die Clips nacheinander abgespielt, wobei nur der definierte Zeitbereich jedes Clips zu sehen ist. Wenn ein Hintergrund‑Audio ausgewählt wurde, läuft dieses parallel zu den Clips. Am Ende der Vorschau wird die Musik automatisch gestoppt.
8. **Chat nutzen:** Stellen Sie eine Frage in das Chatfeld und klicken Sie auf „Senden“. Die Antwort von ChatGPT erscheint im Protokoll.
9. **Exportieren:** Wenn Ihre Clip‑Reihenfolge und Schnitte feststehen, klicken Sie auf „Exportieren“. Die Anwendung exportiert die Clips nacheinander zu einem einzelnen MP4‑Video und startet einen Download der fertigen Datei. Wenn ein Hintergrund‑Audio vorhanden ist, wird das Video stummgeschaltet und mit dem ausgewählten Ton versehen und die Lautstärke gemäß Schieberegler angepasst; die Länge richtet sich nach der kürzeren Datei (Video oder Audio). Falls Sie einen Videofilter gewählt haben, wird dieser beim Export angewendet (die Datei wird daher neu encodiert, was etwas länger dauern kann).

10. **Videos durchsuchen und hinzufügen (optional):** Geben Sie einen Suchbegriff in das Feld „Suchbegriff für Video…“ ein und klicken Sie auf „Video suchen“. Die Anwendung ruft die Pexels‑API auf und zeigt bis zu sechs passende Stock‑Clips inklusive Vorschaubild. Mit dem Button „Clip hinzufügen“ wird der jeweilige Clip heruntergeladen und automatisch zu Ihrer Zeitleiste hinzugefügt. Beachten Sie, dass für die Nutzung dieser Funktion ein gültiger Pexels‑API‑Schlüssel im Quellcode hinterlegt sein muss.

11. **Clips für Szenen suchen (optional):** Nachdem Sie mit „Drehbuch generieren“ eine Szenenliste erstellt haben, klicken Sie auf „Clips für Szenen suchen“. Die Anwendung extrahiert die Beschreibungen der ersten Szenen aus dem Drehbuch, sucht mithilfe der Pexels‑API automatisch nach passenden Videos und fügt die ersten Treffer Ihrer Zeitleiste hinzu. Dies erleichtert die Zusammenstellung eines Rohschnitts.

## Hosting auf GitHub Pages

Um diese Webanwendung online bereitzustellen, können Sie die Dateien in ein öffentliches GitHub‑Repository hochladen und GitHub Pages aktivieren:

1. Erstellen Sie ein neues Repository auf GitHub (z. B. `video-editor-online`).
2. Laden Sie die Dateien aus diesem Ordner in das Repository hoch (`index.html`, `script.js`, `README.md`).
3. Aktivieren Sie in den Repository‑Einstellungen GitHub Pages (Branch `main` oder `master` und Ordner `/root`).
4. Nach kurzer Zeit ist die Anwendung unter `https://<IhrGitHubName>.github.io/<RepositoryName>/` erreichbar.

Alternativ können Sie die `index.html` auch lokal öffnen, indem Sie sie per Doppelklick im Browser starten.

## Hinweise

* Der API‑Key wird lokal im Browser gespeichert; geben Sie ihn nicht weiter. Für eine sichere öffentliche Bereitstellung sollte ein serverseitiger Proxy für die ChatGPT‑Anfragen eingerichtet werden, um den Schlüssel zu verbergen.
* Da die Anwendung vollständig clientseitig ist, müssen Videodateien lokal ausgewählt werden und können nicht im Browser gespeichert werden.

Viel Spaß beim Ausprobieren und erweitern!