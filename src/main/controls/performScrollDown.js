import { mouse } from "@nut-tree-fork/nut-js";
import { ag } from "../gestures/availableGestures.js";

const performScrollDown = async (gestureStr, landmarks) => {
    const gesture = ag.get(gestureStr);

    if (gesture && gesture(landmarks)) {
        await mouse.scrollDown(50);
    }
};

export default performScrollDown;
