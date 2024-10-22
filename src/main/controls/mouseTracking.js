import { mouse, Point, straightTo, screen } from "@nut-tree-fork/nut-js";
import { id } from "../../utils/utils.js";

async function convertLandmarksToScreenCoords(landmark) {
  const width = await screen.width();
  const height = await screen.height();

  const x = width - landmark.x * width;
  const y = landmark.y * height;

  const screenCoords = new Point(x, y);
  return screenCoords;
}

async function moveMouse(handedness, landmarks) {
  const screenCoords = await convertLandmarksToScreenCoords(
    landmarks[id.INDEX_FINGER_TIP]
  );
  await mouse.move(straightTo(screenCoords));
}

export { moveMouse };
