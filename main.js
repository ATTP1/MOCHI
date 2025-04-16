const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { OPENAI_API_KEY } = require("./config");
const OpenAI = require("openai");

// Initialisation de l'API OpenAI
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 50,
      messages: [
        {
          role: "system",
          content:
            "Tu es Mochi(Mignion,outil,conversation,hilarant,instructif), un assistant IA mignon et curieux.Tu parles en français avec un ton joyeux. Tu utilises souvent des émojis, mais pas de #.  Tes réponses sont claires ,courtes et ne doit JAMAIS dépassé 150 caractères",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return res.choices[0].message.content;
  } catch (err) {
    return `❌ Erreur : ${err.message}`;
  }
});

const fetch = require("node-fetch");

ipcMain.handle("get-weather", async () => {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=45.5088&longitude=-73.5617&current_weather=true"
  );
  const data = await response.json();

  return {
    temperature: data.current_weather.temperature,
    weathercode: data.current_weather.weathercode,
  };
});
