import { mouse, Point, straightTo, screen } from "@nut-tree-fork/nut-js";
import { id } from "../../utils/utils.js";

const calculateDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

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

async function detectClick(handedness, landmarks) {
  const distance = calculateDistance(
    landmarks[id.THUMP_TIP], landmarks[id.INDEX_FINGER_TIP]
  );

  if (distance < 0.05) {
    await mouse.leftClick();
  }
}

export { moveMouse, detectClick };
