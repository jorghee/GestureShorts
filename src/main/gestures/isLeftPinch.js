import { id } from "../../utils/utils.js";

export const isLeftPinch = (landmarks) => {
  const thumbTip = landmarks[id.THUMB_TIP];
  const indexTip = landmarks[id.INDEX_FINGER_TIP];

  const distance = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
  );

  return distance < 0.05; // Umbral
};
