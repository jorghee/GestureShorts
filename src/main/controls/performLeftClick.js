import { mouse } from "@nut-tree-fork/nut-js";
import { ag } from "../gestures/availableGestures.js";

const performLeftClick = async (gestureStr, landmarks) => {
  const gesture = ag.get(gestureStr);

  if (gesture && gesture(landmarks)) {
    await mouse.leftClick();
  }
};

export default performLeftClick;