import { id } from "../../utils/utils.js";

export const isFist = (landmarks) => {
  const thumbTip = landmarks[id.THUMB_TIP];
  const indexTip = landmarks[id.INDEX_FINGER_TIP];
  const middleTip = landmarks[id.MIDDLE_FINGER_TIP];
  const ringTip = landmarks[id.RING_FINGER_TIP];
  const pinkyTip = landmarks[id.PINKY_TIP];

  const isClose = (point1, point2, threshold = 0.1) => {
    const distance = Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
    return distance < threshold;
  };

  return (
    isClose(thumbTip, indexTip) &&
    isClose(thumbTip, middleTip) &&
    isClose(thumbTip, ringTip) &&
    isClose(thumbTip, pinkyTip)
  );
};