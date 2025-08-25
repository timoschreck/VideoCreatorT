const { contextBridge, ipcRenderer } = require('electron');

// Über die contextBridge werden nur ausgewählte APIs dem Renderer zur Verfügung gestellt.
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Öffnet den Dateidialog und gibt den ausgewählten Pfad zurück.
   * @returns {Promise<string|null>} Pfad zur ausgewählten Datei oder null
   */
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  /**
   * Sendet einen Prompt an ChatGPT und gibt die Antwort zurück.
   * @param {string} prompt Der Benutzer‑Prompt
   * @returns {Promise<string>} Die generierte Antwort
   */
  askChatGPT: (prompt) => ipcRenderer.invoke('chatgpt:ask', prompt),
});