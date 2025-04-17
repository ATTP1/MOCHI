const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { OPENAI_API_KEY } = require("./config");
const OpenAI = require("openai");

// Initialisation de l'API OpenAI
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

function saveMemory(newEntry) {
  const memory = loadMemory();
  memory.push(newEntry);

  // Garde les 5 derniers échanges max
  const trimmed = memory.slice(-10); //MEMOIRE JUSQUA 10 ECHANGES (5 REPONSES)
  fs.writeFileSync(memoryPath, JSON.stringify(trimmed, null, 2));
}

const fs = require("fs");
const memoryPath = path.join(__dirname, "memory.json");

function loadMemory() {
  if (!fs.existsSync(memoryPath)) return [];
  const raw = fs.readFileSync(memoryPath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 820,
    height: 600,
    icon: path.join(__dirname, "images", "icon", "icon.png"),
    autoHideMenuBar: true,

    transparent: false,
    resizable: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      zoomFactor: 0.85, // ou toute autre valeur par défaut que tu veux

      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 🔁 Gestion de la communication avec le renderer
ipcMain.handle("send-prompt", async (event, prompt) => {
  try {
    const memory = loadMemory();

    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 50,
      messages: [
        {
          role: "system",
          content:
            "Tu es Mochi(Mignion,outil,conversation,hilarant,instructif), un assistant IA mignon et curieux.Tu parles en français avec un ton joyeux. Tu utilises souvent des émojis, mais pas de #. Tes réponses sont claires, courtes et ne doivent JAMAIS dépasser 100 caractères.",
        },
        ...memory,
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = res.choices[0].message.content;

    saveMemory({ role: "user", content: prompt });
    saveMemory({ role: "assistant", content: reply });

    return reply;
  } catch (err) {
    return `❌ Erreur : ${err.message}`;
  }
});

const fetch = require("node-fetch");

ipcMain.handle("get-weather", async () => {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=45.5088&longitude=-73.5617&daily=weathercode&current_weather=true&timezone=auto"
  );
  const data = await response.json();

  return {
    temperature: data.current_weather.temperature, // température actuelle
    weathercode: data.daily.weathercode[0], // prévision météo du jour
  };
});
