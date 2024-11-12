import { mouse } from "@nut-tree-fork/nut-js";
import { ag } from "../gestures/availableGestures.js";

const performScrollUp = async (gestureStr, landmarks) => {
    const gesture = ag.get(gestureStr);

    if (gesture && gesture(landmarks)) {
        await mouse.scrollUp(50);
    }
};

export default performScrollUp;
