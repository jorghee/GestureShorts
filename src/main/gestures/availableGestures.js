import { isLeftPinch } from "./isLeftPinch.js";
import { isRightPinch } from "./isRightPinch.js";
import { isFist } from "./isFist.js";

const ag = new Map();
ag.set("Pinch con indice", isLeftPinch);
ag.set("Pinch con medio", isRightPinch);
ag.set("Puño", isFist);

export default ag;
