import performLeftClick from "./performLeftClick.js";
import performScreenCapture from "./performScreenCapture.js";
import performRightClick from "./performRightClick.js";
import performScrollDown from "./performScrollDown.js";
import performScrollUp from "./performScrollDown.js";

const ac = new Map();
ac.set("Clic izquierdo", performLeftClick);
ac.set("Clic derecho", performRightClick);
ac.set("Captura de pantalla", performScreenCapture);
ac.set("Scroll Up", performScrollUp);
ac.set("Scroll Down", performScrollDown);

export default ac;
