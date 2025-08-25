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
const exportBtn = document.getElementById('exportBtn');
// Elemente und Variablen für Hintergrund‑Audio
const audioInput = document.getElementById('audioInput');
const addAudioBtn = document.getElementById('addAudioBtn');
let audioFile = null;
let audioURL = null;
let audioElement = null;

// Lautstärkeregler für das Hintergrund-Audio
const volumeSlider = document.getElementById('volumeSlider');
let audioVolume = 1.0;

// Element und Variable für den globalen Videofilter
const filterSelect = document.getElementById('filterSelect');
let selectedFilter = 'none';
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

// Audio hinzufügen: Klick auf den Button löst die Dateiauswahl aus
addAudioBtn.addEventListener('click', () => {
  audioInput.click();
});

// Wenn eine Audiodatei ausgewählt wurde, speichern wir sie und bereiten sie für die Vorschau vor
audioInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  // Überprüfen, ob die ausgewählte Datei ein unterstütztes Audioformat ist
  const match = file.name.toLowerCase().match(/\.(mp3|aac|wav|ogg|flac)$/);
  if (!match) {
    alert('Bitte eine unterstützte Audio‑Datei auswählen (mp3, aac, wav, ogg, flac).');
    audioInput.value = '';
    return;
  }
  // Vorherige Audio‑Ressourcen freigeben
  if (audioURL) {
    URL.revokeObjectURL(audioURL);
  }
  audioFile = file;
  audioURL = URL.createObjectURL(file);
  // Button‑Text aktualisieren, um den Namen anzuzeigen
  addAudioBtn.textContent = `Audio: ${file.name}`;
  // Neues Audio‑Element erstellen
  if (audioElement) {
    audioElement.pause();
  }
  audioElement = new Audio(audioURL);
  audioElement.loop = false;
  // Eingabe zurücksetzen
  audioInput.value = '';
});

// Lautstärkeänderung: aktualisieren Sie den Pegel des Audioelements
volumeSlider.addEventListener('input', () => {
  audioVolume = parseFloat(volumeSlider.value);
  if (audioElement) {
    audioElement.volume = audioVolume;
  }
});

// Wenn der Filter geändert wird, speichern wir die Auswahl und wenden sie in der Vorschau an
filterSelect.addEventListener('change', () => {
  selectedFilter = filterSelect.value;
  // CSS-Filter im Videoelement aktualisieren
  switch (selectedFilter) {
    case 'grayscale':
      videoPlayer.style.filter = 'grayscale(100%)';
      break;
    case 'sepia':
      videoPlayer.style.filter = 'sepia(100%)';
      break;
    case 'invert':
      videoPlayer.style.filter = 'invert(100%)';
      break;
    default:
      videoPlayer.style.filter = '';
  }
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
  // Falls ein Hintergrund‑Audio vorhanden ist, beginnen wir die Wiedergabe von Anfang an
  if (audioElement) {
    audioElement.currentTime = 0;
    audioElement.volume = audioVolume;
    audioElement.play();
  }
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
        } else {
          // Wenn alle Clips abgespielt wurden, stoppen wir das Hintergrund‑Audio
          if (audioElement) {
            audioElement.pause();
          }
        }
      }
    };
    videoPlayer.addEventListener('timeupdate', onTimeUpdate);
  }
  playClip(current);
});

// Clips exportieren und als eine einzelne Datei herunterladen
exportBtn.addEventListener('click', async () => {
  if (clips.length === 0) {
    alert('Es sind keine Clips zum Exportieren vorhanden.');
    return;
  }
  // Button deaktivieren und Status anzeigen
  exportBtn.disabled = true;
  const originalText = exportBtn.textContent;
  exportBtn.textContent = 'Export läuft…';
  try {
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    const concatLines = [];
    // Schreibe alle Eingabeclips und erstelle getrimmte Versionen. Wenn ein Hintergrund‑Audio vorhanden ist,
    // entfernen wir den Audiostrom aus den Clips (-an), damit am Ende nur das ausgewählte Audio verwendet wird.
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const extMatch = /\.\w+$/.exec(clip.file.name);
      const ext = extMatch ? extMatch[0] : '.mp4';
      const inputName = `input${i}${ext}`;
      await ffmpeg.FS('writeFile', inputName, await fetchFile(clip.file));
      const trimmedName = `trimmed${i}.mp4`;
      const duration = clip.end - clip.start;
      if (audioFile) {
        await ffmpeg.run(
          '-i', inputName,
          '-ss', String(clip.start),
          '-t', String(duration),
          '-an',
          '-c', 'copy',
          trimmedName
        );
      } else {
        await ffmpeg.run(
          '-i', inputName,
          '-ss', String(clip.start),
          '-t', String(duration),
          '-c', 'copy',
          trimmedName
        );
      }
      concatLines.push(`file ${trimmedName}`);
    }
    // concat-Datei anlegen
    const concatContent = concatLines.join('\n');
    await ffmpeg.FS('writeFile', 'concat.txt', new TextEncoder().encode(concatContent));
    // Erstellt einen zusammengesetzten Videostream ohne finale Audiomischung
    await ffmpeg.run(
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-c', 'copy',
      'video_concat.mp4'
    );
    let finalName = 'output.mp4';
    // Entscheide, ob ein Filter angewendet werden soll und setze den Filter-String
    let filterString = null;
    switch (selectedFilter) {
      case 'grayscale':
        filterString = 'hue=s=0';
        break;
      case 'sepia':
        // Sepia mittels colorchannelmixer
        filterString = 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131';
        break;
      case 'invert':
        filterString = 'negate';
        break;
      default:
        filterString = null;
    }
    if (audioFile) {
      // Audiodatei ins virtuelle FS schreiben
      const audioExtMatch = /\.\w+$/.exec(audioFile.name);
      const audioExt = audioExtMatch ? audioExtMatch[0] : '.mp3';
      const audioInputName = `bg_audio${audioExt}`;
      await ffmpeg.FS('writeFile', audioInputName, await fetchFile(audioFile));
      if (filterString) {
        // Video+Audio mit Filter: re-encodiert das Video, mischt Audio und passt die Lautstärke an
        await ffmpeg.run(
          '-i', 'video_concat.mp4',
          '-i', audioInputName,
          '-vf', filterString,
          '-filter:a', `volume=${audioVolume}`,
          '-c:v', 'libx264',
          '-c:a', 'aac',
          '-shortest',
          finalName
        );
      } else {
        // Video+Audio ohne Filter: kopiere Video-Frames, mische Audio und passe die Lautstärke an
        await ffmpeg.run(
          '-i', 'video_concat.mp4',
          '-i', audioInputName,
          '-filter:a', `volume=${audioVolume}`,
          '-c:v', 'copy',
          '-c:a', 'aac',
          '-shortest',
          finalName
        );
      }
    } else {
      if (filterString) {
        // Nur Video, Filter anwenden: re-encodiert das Video
        await ffmpeg.run(
          '-i', 'video_concat.mp4',
          '-vf', filterString,
          '-c:v', 'libx264',
          '-c:a', 'copy',
          finalName
        );
      } else {
        // Weder Audio noch Filter: einfache Kopie
        await ffmpeg.run(
          '-i', 'video_concat.mp4',
          '-c', 'copy',
          finalName
        );
      }
    }
    // Datei aus virtuellem FS lesen
    const outData = ffmpeg.FS('readFile', finalName);
    const blob = new Blob([outData.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Export abgeschlossen. Die Datei wurde heruntergeladen.');
  } catch (err) {
    console.error('Export-Fehler', err);
    alert('Beim Export ist ein Fehler aufgetreten. Siehe Konsole für Details.');
  } finally {
    exportBtn.disabled = false;
    exportBtn.textContent = originalText;
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

// Elemente für Drehbucherstellung
const songTitleInput = document.getElementById('songTitle');
const generateScriptBtn = document.getElementById('generateScriptBtn');
const downloadScriptBtn = document.getElementById('downloadScriptBtn');
const scriptOutput = document.getElementById('scriptOutput');

// Drehbuch generieren
generateScriptBtn.addEventListener('click', async () => {
  const title = songTitleInput.value.trim();
  if (!title) {
    alert('Bitte einen Musiktitel eingeben.');
    return;
  }
  // Deaktiviere Button während der Anfrage
  generateScriptBtn.disabled = true;
  generateScriptBtn.textContent = 'Generiere...';
  try {
    const prompt = `Du bist ein kreativer Regisseur. Schreibe ein detailliertes Drehbuch für ein Musikvideo mit dem Titel "${title}". Gliedere das Drehbuch in einzelne Szenen. Gib für jede Szene eine nummerierte Überschrift und eine Beschreibung der Handlung und der Stimmung an. Gib außerdem die ungefähre Dauer der Szene in Sekunden an.`;
    const script = await askChatGPT(prompt);
    scriptOutput.value = script;
    downloadScriptBtn.style.display = 'inline-block';
  } finally {
    generateScriptBtn.disabled = false;
    generateScriptBtn.textContent = 'Drehbuch generieren';
  }
});

// Script herunterladen
downloadScriptBtn.addEventListener('click', () => {
  const text = scriptOutput.value;
  if (!text) return;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `drehbuch_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});