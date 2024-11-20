import { isLeftPinch } from "./isLeftPinch.js";
import { isRightPinch } from "./isRightPinch.js";
import { isFist } from "./isFist.js";

const ag = new Map();
ag.set("isLeftPinch", isLeftPinch);
ag.set("isRightPinch", isRightPinch);
ag.set("isFist", isFist);

export default ag;
