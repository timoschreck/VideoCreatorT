# Online Musik Video Editor (Web Version)

Diese Version des Musikvideo‑Editors funktioniert komplett clientseitig im Browser und benötigt keine Installation von Node.js oder Electron. Sie können den Ordner auf einem Webserver (z. B. GitHub Pages) hosten oder die `index.html` lokal im Browser öffnen.

## Funktionen

* Auswählen und Abspielen lokaler Video‑ und Audiodateien im Browser über ein Dateiauswahlfeld.
* Integrierter Chatbereich für Fragen an ChatGPT. Es wird der OpenAI‑Chat‑Completion‑Endpunkt im Browser per Fetch aufgerufen.
* Eingabefeld zum Speichern des eigenen API‑Keys im Browser (lokal im `localStorage`).

## Nutzung

1. **API‑Key eingeben:** Tragen Sie Ihren OpenAI API‑Key in das entsprechende Feld ein und klicken Sie auf „Speichern“. Der Schlüssel wird nur lokal im Browser gespeichert.
2. **Video/Audio laden:** Wählen Sie eine Mediendatei per Klick auf den Dateiauswahldialog aus. Das Video wird sofort angezeigt und kann abgespielt werden.
3. **Chat nutzen:** Stellen Sie eine Frage in das Chatfeld und klicken Sie auf „Senden“. Die Antwort von ChatGPT erscheint im Protokoll.

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