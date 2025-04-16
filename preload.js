const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendPrompt: (prompt) => ipcRenderer.invoke("send-prompt", prompt),
  getWeather: () => ipcRenderer.invoke("get-weather"),
});
