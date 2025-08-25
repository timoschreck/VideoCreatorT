const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

// Laden des API‑Schlüssels aus der Umgebung. Ersetzen Sie diesen Wert oder setzen Sie eine Umgebungsvariable OPENAI_API_KEY.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_API_KEY_HERE';

/**
 * Erstellt das Browserfenster und lädt die HTML‑Datei.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });
  win.loadFile('index.html');
}

// Handler für ChatGPT‑Anfragen. Ruft das ChatGPT‑Modell auf und gibt die Antwort zurück.
ipcMain.handle('chatgpt:ask', async (_event, prompt) => {
  try {
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Du bist ein hilfreicher Assistent für die Musikvideoerstellung.' },
        { role: 'user', content: prompt },
      ],
    });
    const message = completion.data.choices[0].message.content.trim();
    return message;
  } catch (err) {
    console.error('ChatGPT Fehler:', err);
    return 'Fehler bei der Anfrage. Bitte API‑Key überprüfen oder Internetverbindung herstellen.';
  }
});

// Handler, um eine Mediendatei zu öffnen. Gibt den ausgewählten Pfad zurück oder null bei Abbruch.
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Media', extensions: ['mp4', 'mov', 'mp3', 'wav', 'ogg'] },
    ],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

// Initialisierung der Anwendung.
app.whenReady().then(createWindow);

// Bei allen Fenstern geschlossen: Anwendung beenden (außer auf macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});