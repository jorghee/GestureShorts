import { screen } from "@nut-tree-fork/nut-js"; // `screen` es una instancia de `ScreenClass`

export async function captureFullScreen() {
  try {
    const fileName = "full-screen-capture";
    const fileFormat = "png"; // Formato de la captura
    const filePath = "./";    // Directorio donde se guardará la captura

    // Captura la pantalla completa usando `ScreenClass`
    const filePathResult = await screen.capture(fileName, fileFormat, filePath);
    console.log(`Screen captured and saved at ${filePathResult}`);
  } catch (error) {
    console.error("Error capturing the screen:", error);
  }
}
