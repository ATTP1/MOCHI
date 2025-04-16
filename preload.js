const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendPrompt: (prompt) => ipcRenderer.invoke("send-prompt", prompt),
});

contextBridge.exposeInMainWorld("weatherAPI", {
  getCurrent: (lat, lon) => ipcRenderer.invoke("get-weather", { lat, lon }),
});
