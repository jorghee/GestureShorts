import performLeftClick from "./performLeftClick.js";
import performScreenCapture from "./performScreenCapture.js";
import performRightClick from "./performRightClick.js";

const ac = new Map();
ac.set("Clic izquierdo", performLeftClick);
ac.set("Clic derecho", performRightClick);
ac.set("Captura de pantalla", performScreenCapture);

export default ac;
