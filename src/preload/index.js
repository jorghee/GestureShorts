import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import ag from "../main/gestures/availableGestures.js";
import ac from "../main/controls/availableControls.js";

// Custom APIs for renderer
const api = {
  moveMouse: (handedness, smoothed) =>
    ipcRenderer.invoke("moveMouse", handedness, smoothed),

  performLeftClick: (gestureStr, landmark) =>
    ipcRenderer.invoke("performLeftClick", gestureStr, landmark),

  performScreenCapture: (gestureStr, landmark) =>
    ipcRenderer.invoke("performScreenCapture", gestureStr, landmark),

  performRightClick: (gestureStr, landmark) =>
    ipcRenderer.invoke("performRightClick", gestureStr, landmark),

  performScrollUp: (gestureStr, landmark) =>
    ipcRenderer.invoke("performScrollUp", gestureStr, landmark),

  performScrollDown: (gestureStr, landmark) =>
    ipcRenderer.invoke("performScrollDown", gestureStr, landmark)

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
