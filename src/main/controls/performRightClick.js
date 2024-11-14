import { mouse } from "@nut-tree-fork/nut-js";

const performRightClick = async (gesture, landmarks) => {
  if (gesture && gesture(landmarks)) {
    await mouse.rightClick();
  }
};

export default performRightClick;
