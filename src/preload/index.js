import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import ac from "../main/controls/availableControls.js";
import ag from "../main/gestures/availableGestures.js";

const gesturesD = ["Pinch izquierdo", "Pinch derecho", "Puño"];
const controlsD = ["Clic izquierdo", "Clic derecho", "Captura de pantalla"];

const gestureDisplayNames = new Map();
const controlDisplayNames = new Map();

let i = 0;
for (const [controlStr] of ac.entries()) {
  controlDisplayNames.set(controlsD[i++], controlStr);
}

i = 0;
for (const [gestureStr] of ag.entries()) {
  gestureDisplayNames.set(gesturesD[i++], gestureStr);
}

// Custom APIs for renderer
const api = {
  moveMouse: (handedness, smoothed) =>
    ipcRenderer.invoke("moveMouse", handedness, smoothed),

  getControlDisplayNames: () => controlDisplayNames,
  getGestureDisplayNames: () => gestureDisplayNames
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
