import { moveMouse, detectClick } from "../mouseControl/main.js";
import { movingAverageSmoothing } from "../mouseControl/smoothing.js";

const handleGesturePrediction = (
  handLandmarker,
  video,
  bufferSize,
  smoothedLandmarks,
  setSmoothedLandmarks
) => {
  const predictWebcam = async () => {
    if (!handLandmarker || !video || video.readyState !== 4) {
      return;
    }

    const startTimeMs = performance.now();
    const newResults = await handLandmarker.detectForVideo(video, startTimeMs);

    if (newResults.landmarks.length > 0) {
      const smoothed = movingAverageSmoothing(
        newResults.landmarks[0],
        smoothedLandmarks,
        setSmoothedLandmarks,
        bufferSize
      );

      moveMouse(newResults.handedness, smoothed);

      if (newResults.landmarks.length > 1) {
        detectClick(newResults.handedness, newResults.landmarks[1]);
      }
    }
  };

  return predictWebcam;
};

export default handleGesturePrediction;
