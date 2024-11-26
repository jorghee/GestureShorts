import { isLeftPinch } from "./isLeftPinch.js";
import { isRightPinch } from "./isRightPinch.js";
import { isFist } from "./isFist.js";
import { isWristExtensionBackward } from "./isWristExtensionBackward.js";
import { isWristFlexionForward } from "./isWristFlexionForward.js";

const ag = new Map();
ag.set("Pinch con indice", isLeftPinch);
ag.set("Pinch con medio", isRightPinch);
ag.set("Puño", isFist);
ag.set("Extención de muñeca para atrás", isWristExtensionBackward);
ag.set("Flexión de muñeca para adelante", isWristFlexionForward);


export default ag;
