import { movingAverageSmoothing } from "./smoothing.js";

const handleGesturePrediction = (
  handLandmarker,
  video,
  bufferSize,
  smoothedLandmarks,
  setSmoothedLandmarks,
  animationFrame,
  lastVideoTime,
  setLastVideoTime
) => {
  const predictWebcam = async () => {
    if (!handLandmarker || !video || video.readyState !== 4) {
      console.log("Error of handLandmarker or video.");
      return;
    }

    const startTimeMs = performance.now();

    if (lastVideoTime !== video.currentTime) {
      setLastVideoTime(video.currentTime);
      const newResults = await handLandmarker.detectForVideo(
        video,
        startTimeMs
      );

      if (newResults.landmarks.length > 0) {
        const smoothed = movingAverageSmoothing(
          newResults.landmarks[0],
          smoothedLandmarks,
          setSmoothedLandmarks,
          bufferSize
        );

        await window.api.moveMouse(newResults.handedness, smoothed);

        if (newResults.landmarks.length > 1) {
          await Promise.all([
            window.api.performLeftClick("isPinch", newResults.landmarks[1]),
            window.api.performScreenCapture("isFist", newResults.landmarks[1])
          ]);
        }
      }
    }
    animationFrame = window.requestAnimationFrame(predictWebcam);
  };

  animationFrame = window.requestAnimationFrame(predictWebcam);
  return predictWebcam;
};

export default handleGesturePrediction;
