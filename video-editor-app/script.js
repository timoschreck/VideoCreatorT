/**
 * Diese Datei enthält die clientseitige Logik für den Online‑Musikvideo‑Editor.
 * Sie erlaubt das Laden lokaler Dateien als Video, das Speichern eines OpenAI API‑Schlüssels
 * und das Senden von Fragen an ChatGPT über Fetch.
 */

// Elemente aus dem DOM holen
const fileInput = document.getElementById('fileInput');
const clipInput = document.getElementById('clipInput');
const addClipBtn = document.getElementById('addClipBtn');
const previewAllBtn = document.getElementById('previewAllBtn');
const videoPlayer = document.getElementById('videoPlayer');
const apiKeyInput = document.getElementById('apiKey');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const chatLog = document.getElementById('chat-log');
const promptInput = document.getElementById('promptInput');
const sendPromptBtn = document.getElementById('sendPromptBtn');
const timelineDiv = document.getElementById('timeline');

// Liste der Clips
const clips = [];

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

// Clip hinzufügen per Button
addClipBtn.addEventListener('click', () => {
  clipInput.click();
});

// Beim Auswählen eines oder mehrerer Clips diese zur Liste hinzufügen
clipInput.addEventListener('change', (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file);
    const vid = document.createElement('video');
    vid.preload = 'metadata';
    vid.src = url;
    vid.onloadedmetadata = () => {
      const duration = vid.duration || 0;
      clips.push({ file, name: file.name, url, start: 0, end: duration, duration });
      renderTimeline();
    };
  });
  // Eingabe zurücksetzen, damit bei gleicher Auswahl erneut der change‑Event ausgelöst wird
  clipInput.value = '';
});

// Zeitleiste rendern
function renderTimeline() {
  timelineDiv.innerHTML = '';
  clips.forEach((clip, index) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = clip.name;
    item.appendChild(nameSpan);
    const startInput = document.createElement('input');
    startInput.type = 'number';
    startInput.min = 0;
    startInput.max = clip.duration;
    startInput.step = '0.1';
    startInput.value = clip.start;
    startInput.title = 'Startzeit (s)';
    startInput.addEventListener('change', () => {
      const val = parseFloat(startInput.value);
      if (!isNaN(val) && val >= 0 && val < clip.end) {
        clip.start = val;
      } else {
        startInput.value = clip.start;
      }
    });
    item.appendChild(startInput);
    const endInput = document.createElement('input');
    endInput.type = 'number';
    endInput.min = 0;
    endInput.max = clip.duration;
    endInput.step = '0.1';
    endInput.value = clip.end;
    endInput.title = 'Endzeit (s)';
    endInput.addEventListener('change', () => {
      const val = parseFloat(endInput.value);
      if (!isNaN(val) && val > clip.start && val <= clip.duration) {
        clip.end = val;
      } else {
        endInput.value = clip.end;
      }
    });
    item.appendChild(endInput);
    const upBtn = document.createElement('button');
    upBtn.textContent = '↑';
    upBtn.title = 'Clip nach oben';
    upBtn.addEventListener('click', () => {
      if (index > 0) {
        const tmp = clips[index - 1];
        clips[index - 1] = clips[index];
        clips[index] = tmp;
        renderTimeline();
      }
    });
    item.appendChild(upBtn);
    const downBtn = document.createElement('button');
    downBtn.textContent = '↓';
    downBtn.title = 'Clip nach unten';
    downBtn.addEventListener('click', () => {
      if (index < clips.length - 1) {
        const tmp = clips[index + 1];
        clips[index + 1] = clips[index];
        clips[index] = tmp;
        renderTimeline();
      }
    });
    item.appendChild(downBtn);
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.title = 'Clip entfernen';
    removeBtn.addEventListener('click', () => {
      clips.splice(index, 1);
      renderTimeline();
    });
    item.appendChild(removeBtn);
    timelineDiv.appendChild(item);
  });
}

// Clips nacheinander abspielen
previewAllBtn.addEventListener('click', () => {
  if (clips.length === 0) return;
  let current = 0;
  function playClip(idx) {
    const clip = clips[idx];
    videoPlayer.src = clip.url;
    videoPlayer.currentTime = clip.start;
    videoPlayer.play();
    const onTimeUpdate = () => {
      if (videoPlayer.currentTime >= clip.end) {
        videoPlayer.removeEventListener('timeupdate', onTimeUpdate);
        videoPlayer.pause();
        if (idx + 1 < clips.length) {
          playClip(idx + 1);
        }
      }
    };
    videoPlayer.addEventListener('timeupdate', onTimeUpdate);
  }
  playClip(current);
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