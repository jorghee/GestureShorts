import { isLeftPinch } from "./isLeftPinch.js";
import { isRightPinch } from "./isRightPinch.js"; 
import { isWristExtensionBackward } from "./isWristExtensionBackward.js";
import { isWristFlexionForward } from "./isWristFlexionForward.js";

export const ag = new Map([
    ["isPinch", isPinch], 
    ["isFist", isFist],
    ["isRightPinch", isRightPinch],
    ["isWristExtensionBackward", isWristExtensionBackward],
    ["isWristFlexionForward", isWristFlexionForward]
]);
