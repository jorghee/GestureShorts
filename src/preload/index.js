import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  moveMouse: (
    handedness,
    landmarks
  ) => ipcRenderer.invoke("move-mouse", handedness, landmarks),

  detectClick: (
    handedness,
    landmarks
  ) => ipcRenderer.invoke("detect-click", handedness, landmarks),

  smoothLandmarks: (
    newLandmarks,
    smoothedLandmarks,
    setSmoothedLandmarks,
    bufferSize
  ) => ipcRenderer.invoke(
    "average-smoothing",
    newLandmarks,
    smoothedLandmarks,
    setSmoothedLandmarks,
    bufferSize
  ),
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
