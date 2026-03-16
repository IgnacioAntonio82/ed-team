const { app, Notification } = require("electron");
const { autoUpdater } = require("electron-updater");
const { createWindow } = require("./main");

require("./db");

let mainWindow;
let notificationObj = null; // Variable global para persistencia

// Función mejorada para lanzar notificaciones
function showNotification(title, body) {
  notificationObj = new Notification({
    title: title,
    body: body,
    silent: false
  });
  notificationObj.show();
}

app.whenReady().then(() => {
  // 1. OBLIGATORIO: Registrar el AppUserModelId para Windows
  app.setAppUserModelId("com.ownisoft.edteam");

  mainWindow = createWindow();

  // 2. Prueba de diagnóstico (si esto no sale, es problema de Windows)
  // setTimeout(() => {
  //     showNotification("PRUEBA", "Si ves esto, las notificaciones funcionan");
  // }, 5000);

  // 3. Buscar actualizaciones
  autoUpdater.checkForUpdatesAndNotify();
});

// --- Eventos del updater ---

autoUpdater.on("update-available", (info) => {
  console.log("✅ Actualización disponible");
  showNotification("Actualización Disponible", `Se encontró la versión ${info.version}. Descargando...`);
});

autoUpdater.on("download-progress", (progress) => {
  console.log(`⬇ Descargando: ${progress.percent.toFixed(2)}%`);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("📦 Actualización descargada");
  
  showNotification("Actualización Lista", `La versión ${info.version} está lista. Reiniciando en 3 segundos...`);

  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 3000);
});

autoUpdater.on("error", (err) => {
  console.log("❌ Error updater:", err);
  showNotification("Error de Actualización", "Hubo un problema al buscar actualizaciones.");
});

app.disableHardwareAcceleration();