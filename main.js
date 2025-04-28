const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const processCSV = require("./src/processCSV");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("public/index.html");
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle("select-csv", async () => {
  const result = await dialog.showOpenDialog({
    filters: [{ name: "CSV Files", extensions: ["csv"] }],
    properties: ["openFile"],
  });
  return result.filePaths[0];
});

ipcMain.handle("geolocate-csv", async (event, { filePath, apiKey }) => {
  const outputPath = await processCSV(filePath, apiKey);
  return outputPath;
});
