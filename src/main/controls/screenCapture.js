import { screen } from "@nut-tree-fork/nut-js"; // `screen` es una instancia de `ScreenClass`
import { FileType } from "@nut-tree-fork/shared";

export async function captureFullScreen() {
  try {
    const fileName = "full-screen-capture";
    const fileFormat = FileType.PNG; // Usa FileType.PNG o FileType.JPG según sea necesario
    const filePath = "./Capturas"; // Directorio donde se guardará la captura
    const fileNamePrefix = "capture_";
    const fileNamePostfix = `_${Date.now()}`; // Postfijo con la marca de tiempo

    // Llamamos a `capture` con los parámetros detallados
    const filePathResult = await screen.capture(
      fileName,
      fileFormat,
      filePath,
      fileNamePrefix,
      fileNamePostfix
    );

    console.log(`Screen captured and saved at ${filePathResult}`);
  } catch (error) {
    console.error("Error capturing the screen:", error);
  }
}
