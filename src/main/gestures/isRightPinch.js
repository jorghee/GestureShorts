import { id } from "../../utils/utils.js";

export const isRightPinch = (landmarks) => {
    const thumbTip = landmarks[id.THUMB_TIP];
    const indexTip = landmarks[id.MIDDLE_FINGER_DIP];

    const distance = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
    );

    return distance < 0.05; // Umbral
}
