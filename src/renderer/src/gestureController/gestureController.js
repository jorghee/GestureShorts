import { movingAverageSmoothing } from "./smoothing.js";

const handleGesturePrediction = (
  handLandmarkerRef,
  videoRef,
  bufferSize,
  animationFrameRef
) => {
  let lastVideoTime = -1;
  let smoothedLandmarks = [];

  const predictWebcam = async () => {
    if (
      !handLandmarkerRef.current ||
      !videoRef.current ||
      videoRef.current.readyState !== 4
    ) {
      console.log("Error of handLandmarker or videoRef.");
      return;
    }

    const startTimeMs = performance.now();

    if (lastVideoTime !== videoRef.current.currentTime) {
      lastVideoTime = videoRef.current.currentTime;
      const newResults = await handLandmarkerRef.current.detectForVideo(
        videoRef.current,
        startTimeMs
      );

      if (newResults.landmarks.length > 0) {
        const smoothed = movingAverageSmoothing(
          newResults.landmarks[0],
          smoothedLandmarks,
          bufferSize
        );

        await window.api.moveMouse(newResults.handedness, smoothed);

        if (newResults.landmarks.length > 1) {
          await Promise.all([
            window.api.performLeftClick("isLeftPinch", newResults.landmarks[1]),
            window.api.performScreenCapture("isFist", newResults.landmarks[1]),
            window.api.performRightClick(
              "isRightPinch",
              newResults.landmarks[1]
            )
          ]);
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(predictWebcam);
  };

  predictWebcam();
};

export default handleGesturePrediction;
