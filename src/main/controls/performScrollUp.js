import { mouse } from "@nut-tree-fork/nut-js";
import { ag } from "../gestures/availableGestures.js";

const performScrollUp = async (gesture, landmarks) => {

    if (gesture && gesture(landmarks)) {
        await mouse.scrollUp(75);
    }
};

export default performScrollUp;