const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectCSV: () => ipcRenderer.invoke("select-csv"),
  geolocateCSV: (data) => ipcRenderer.invoke("geolocate-csv", data),
});
