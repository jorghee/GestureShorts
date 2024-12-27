import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

import ac from "./controls/availableControls.js";
import ag from "./gestures/availableGestures.js";
import { moveMouse } from "./controls/mouseTracking.js";

import { saveMappings, loadMappings, saveCustom, loadCustom, saveInstruction, loadInstruction } from "./mappingHandler/mappingHandler.js";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      backgroundThrottling: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  ipcMain.handle("loadMappings", async () => {
    try {
      return await loadMappings(ag, ac);
    } catch (error) {
      return { error: error.message };
    }
  });

  ipcMain.handle("saveMappings", async (event, newMappings) => {
    try {
      await saveMappings(newMappings);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("saveCustom", async (event, newCustom) => {
    try {
      await saveCustom(newCustom);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("loadCustom", async () => {
    try {
      return await loadMappings(ag, ac);
    } catch (error) {
      return { error: error.message };
    }
  });

  ipcMain.handle("saveInstruction", async (event, newCustom) => {
    try {
      await saveCustom(newCustom);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("loadInstruction", async () => {
    try {
      return await loadMappings(ag, ac);
    } catch (error) {
      return { error: error.message };
    }
  });

  ipcMain.handle("moveMouse", async (event, handedness, smoothed) => {
    await moveMouse(handedness, smoothed);
  });

  //Cargando todos los mapeos para manejarlos adecuadamente 

  for (const [controlStr, controlFunction] of ac.entries()) {
    ipcMain.handle(controlStr, async (event, gestureStr, landmarks) => {
      const gestureFunction = ag.get(gestureStr);
      await controlFunction(gestureFunction, landmarks);
    });
  }
  ipcMain.handle("executeInVm", async (event, command)=> {
    
  }
);

});

app.on("activate", function () {
  // On macOS it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
