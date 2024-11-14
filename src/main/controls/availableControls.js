import performLeftClick from "./performLeftClick.js";
import performScreenCapture from "./performScreenCapture.js";
import performRightClick from "./performRightClick.js";

const ac = new Map();
ac.set("performLeftClick", performLeftClick);
ac.set("performRightClick", performRightClick);
ac.set("performScreenCapture", performScreenCapture);

export default ac;
