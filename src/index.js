const {app}=require("electron");
const { autoUpdater } = require("electron-updater")
const{createWindow}=require("./main")

require("./db")

let mainWindow;
app.whenReady().then(() => {

  mainWindow = createWindow();

  // Buscar actualizaciones
  autoUpdater.checkForUpdatesAndNotify();

})

// Eventos del updater

autoUpdater.on("checking-for-update", () => {
  console.log("🔍 Buscando actualización...");
});

autoUpdater.on("update-available", (info) => {
  console.log("✅ Actualización disponible");
});

autoUpdater.on("update-not-available", () => {
  console.log("✔ No hay actualización disponible");
});

autoUpdater.on("download-progress", (progress) => {
  console.log("⬇ Descargando: " + progress.percent.toFixed(2) + "%");
});

autoUpdater.on("update-downloaded", () => {
  console.log("📦 Actualización descargada");
  autoUpdater.quitAndInstall();
});

autoUpdater.on("error", (err) => {
  console.log("❌ Error updater:", err);
});

app.disableHardwareAcceleration();
