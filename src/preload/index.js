import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import ag from "../main/gestures/availableGestures.js";
import ac from "../main/controls/availableControls.js";

// Custom APIs for renderer
const api = {
  moveMouse: (handedness, smoothed) =>
    ipcRenderer.invoke("moveMouse", handedness, smoothed),

  getGestures: () => [...ag.keys()],
  getControls: () => [...ac.keys()],
  loadMappings: () => ipcRenderer.invoke("loadMappings"),
  saveMappings: (newMappings) => ipcRenderer.invoke("saveMappings", newMappings),
  //cargar y guardar los custom gestures
  loadCustom: () => ipcRenderer.invoke("loadCustom"),
  saveCustom: (newCustom) => ipcRenderer.invoke("saveCustom", newCustom),
};

for (const [controlStr] of ac.entries()) {
  api[controlStr] = (gestureStr, landmarks) =>
    ipcRenderer.invoke(controlStr, gestureStr, landmarks);
}

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
