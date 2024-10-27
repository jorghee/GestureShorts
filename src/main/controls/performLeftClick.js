import { mouse } from "@nut-tree-fork/nut-js";
import { ag } from "../gestures/availableGestures.js";
import { keyboard, Key } from "@nut-tree-fork/nut-js";

const performLeftClick = async (gestureStr, landmarks) => {
  const gesture = ag.get(gestureStr);

  if (gesture && gesture(landmarks)) {
    if (gestureStr === "isFist") {
      await keyboard.type(Key.Print);
    } else if (gestureStr === "isPinch"){
      await mouse.leftClick();
    }
  }
};

export default performLeftClick;
