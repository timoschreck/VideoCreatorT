/**
 * Diese Datei enthält die clientseitige Logik für den Online‑Musikvideo‑Editor.
 * Sie erlaubt das Laden lokaler Dateien als Video, das Speichern eines OpenAI API‑Schlüssels
 * und das Senden von Fragen an ChatGPT über Fetch.
 */

// Elemente aus dem DOM holen
const fileInput = document.getElementById('fileInput');
const videoPlayer = document.getElementById('videoPlayer');
const apiKeyInput = document.getElementById('apiKey');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const chatLog = document.getElementById('chat-log');
const promptInput = document.getElementById('promptInput');
const sendPromptBtn = document.getElementById('sendPromptBtn');

// Beim Laden versuchen wir, einen gespeicherten API‑Key zu laden
window.addEventListener('DOMContentLoaded', () => {
  const storedKey = localStorage.getItem('openai_api_key');
  if (storedKey) {
    apiKeyInput.value = storedKey;
  }
});

// Datei auswählen und in den Videoplayer laden
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    videoPlayer.src = url;
  }
});

// API‑Key speichern
saveKeyBtn.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    localStorage.setItem('openai_api_key', key);
    alert('API‑Key gespeichert.');
  } else {
    alert('Bitte einen gültigen API‑Key eingeben.');
  }
});

/**
 * Fügt eine Chatnachricht zum Protokoll hinzu.
 * @param {string} role "user" oder "assistant"
 * @param {string} text Die Nachricht
 */
function addChatMessage(role, text) {
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `<strong>${role === 'user' ? 'Du' : 'ChatGPT'}:</strong><span>${text.replace(/\n/g, '<br>')}</span>`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

/**
 * Sendet einen Prompt an ChatGPT über die OpenAI API.
 * @param {string} prompt Der Benutzer‑Prompt
 * @returns {Promise<string>} Die Antwort oder eine Fehlermeldung
 */
async function askChatGPT(prompt) {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    return 'Bitte einen gültigen OpenAI API‑Key eingeben.';
  }
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Du bist ein hilfreicher Assistent für die Musikvideoerstellung.' },
      { role: 'user', content: prompt },
    ],
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return `Fehler: ${response.status} – ${errorText}`;
    }
    const data = await response.json();
    const message = data.choices[0].message.content.trim();
    return message;
  } catch (err) {
    console.error('Fetch‑Fehler', err);
    return 'Es ist ein Fehler beim Abrufen der Antwort aufgetreten.';
  }
}

// Prompt absenden
sendPromptBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;
  addChatMessage('user', prompt);
  promptInput.value = '';
  const answer = await askChatGPT(prompt);
  addChatMessage('assistant', answer);
});