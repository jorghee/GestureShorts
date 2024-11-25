import { mouse } from "@nut-tree-fork/nut-js";
import { ag } from "../gestures/availableGestures.js";

const performScrollDown = async (gesture, landmarks) => {

    if (gesture && gesture(landmarks)) {
        await mouse.scrollDown(75);
    }
};

export default performScrollDown;