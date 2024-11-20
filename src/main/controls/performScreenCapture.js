import { captureFullScreen } from "./screenCapture.js";

const performScreenCapture = async (gesture, landmarks) => {
  if (gesture && gesture(landmarks)) {
    await captureFullScreen();
  }
};

export default performScreenCapture;
