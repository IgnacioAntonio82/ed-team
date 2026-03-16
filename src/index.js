const { app, Notification } = require("electron"); // 👈 Importamos Notification
const { autoUpdater } = require("electron-updater");
const { createWindow } = require("./main");

require("./db");

let mainWindow;

// Función auxiliar para lanzar notificaciones rápido
function showUpdateNotification(title, body) {
  new Notification({
    title: title,
    body: body,
    silent: false // Reproduce el sonido del sistema
  }).show();
}

app.whenReady().then(() => {
  mainWindow = createWindow();

  // Buscar actualizaciones
  autoUpdater.checkForUpdatesAndNotify();
});

// --- Eventos del updater con Notificaciones ---

autoUpdater.on("checking-for-update", () => {
  console.log("🔍 Buscando actualización...");
  // Opcional: Notificar que está buscando (puede ser molesto si es muy seguido)
  // showUpdateNotification("Actualizador", "Buscando nuevas actualizaciones...");
});

autoUpdater.on("update-available", (info) => {
  console.log("✅ Actualización disponible");
  showUpdateNotification("Actualización Disponible", `Se encontró la versión ${info.version}. Descargando...`);
});

autoUpdater.on("update-not-available", () => {
  console.log("✔ No hay actualización disponible");
  // Generalmente aquí no se pone notificación para no molestar al usuario
});

autoUpdater.on("download-progress", (progress) => {
  // Aquí es mejor usar console.log o una barra de progreso en la ventana, 
  // ya que una notificación por cada % de descarga saturaría el sistema.
  console.log(`⬇ Descargando: ${progress.percent.toFixed(2)}%`);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("📦 Actualización descargada");
  
  const notification = new Notification({
    title: "Actualización Lista",
    body: `La versión ${info.version} ha sido descargada. La aplicación se reiniciará para instalar.`
  });

  notification.show();

  // Esperamos 3 segundos para que el usuario lea la notificación antes de reiniciar
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 3000);
});

autoUpdater.on("error", (err) => {
  console.log("❌ Error updater:", err);
  showUpdateNotification("Error de Actualización", "Hubo un problema al buscar actualizaciones.");
});

app.disableHardwareAcceleration();