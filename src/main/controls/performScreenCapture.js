import { ag } from "../gestures/availableGestures.js";
import { captureFullScreen } from "./screenCapture.js";

const performScreenCapture = async (gestureStr, landmarks) => {
  const gesture = ag.get(gestureStr);

  if (gesture && gesture(landmarks)) {
    await captureFullScreen();
  }
};

export default performScreenCapture;