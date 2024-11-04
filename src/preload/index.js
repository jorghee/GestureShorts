import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  moveMouse: (handedness, smoothed) =>
    ipcRenderer.invoke("moveMouse", handedness, smoothed),

  performLeftClick: (gestureStr, landmark) =>
    ipcRenderer.invoke("performLeftClick", gestureStr, landmark),

  performScreenCapture: (gestureStr, landmark) =>
    ipcRenderer.invoke("performScreenCapture", gestureStr, landmark),

  performRightClick: (gestureStr, landmark) =>
    ipcRenderer.invoke("performRightClick", gestureStr, landmark)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
