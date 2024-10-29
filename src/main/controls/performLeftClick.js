import { mouse } from "@nut-tree-fork/nut-js";
import { ag } from "../gestures/availableGestures.js";
import { captureFullScreen } from "./screenCapture.js";

const performLeftClick = async (gestureStr, landmarks) => {
  const gesture = ag.get(gestureStr);

  if (gesture && gesture(landmarks)) {
    if (gestureStr === "isFist") {
      await captureFullScreen();
    } else if (gestureStr === "isPinch"){
      await mouse.leftClick();
    }
  }
};

export default performLeftClick;
