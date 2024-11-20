import { mouse } from "@nut-tree-fork/nut-js";

const performLeftClick = async (gesture, landmarks) => {
  if (gesture && gesture(landmarks)) {
    await mouse.leftClick();
  }
};

export default performLeftClick;
