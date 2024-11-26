import { id } from "../../utils/utils.js";

export const isWristExtensionBackward = (landmarks) => {
    const wrist = landmarks[id.WRIST];
    const thumbTip = landmarks[id.THUMB_TIP];
    const indexTip = landmarks[id.INDEX_FINGER_TIP];
    const middleTip = landmarks[id.MIDDLE_FINGER_TIP];
    const ringTip = landmarks[id.RING_FINGER_TIP];
    const pinkyTip = landmarks[id.PINKY_TIP];
  
    const isAboveWrist = (fingerTip) => fingerTip.y < wrist.y;
  
    const areFingersClose = 
      Math.abs(indexTip.x - middleTip.x) < 0.05 &&
      Math.abs(middleTip.x - ringTip.x) < 0.05 &&
      Math.abs(ringTip.x - pinkyTip.x) < 0.05;
  
    return (
      isAboveWrist(indexTip) &&
      isAboveWrist(middleTip) &&
      isAboveWrist(ringTip) &&
      isAboveWrist(pinkyTip) &&
      areFingersClose
    );
  };
  