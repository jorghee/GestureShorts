import { KalmanFilter } from "kalman-filter";
import { id } from "../../../utils/utils.js";

const handleGesturePrediction = (
  handLandmarkerRef,
  videoRef,
  bufferSize,
  animationFrameRef
) => {
  let lastVideoTime = -1;
  let mapping;
  let previousCorrectedX = null;
  let previousCorrectedY = null;

  const kalmanX = new KalmanFilter({
    observation: 1,
    dynamic: {
      name: "constant-speed"
    }
  });

  const kalmanY = new KalmanFilter({
    observation: 1,
    dynamic: {
      name: "constant-speed"
    }
  });

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
        const indexTip = newResults.landmarks[0][id.INDEX_FINGER_TIP];

        const predictedX = kalmanX.predict({
          previousCorrected: previousCorrectedX
        });
        const correctedX = kalmanX.correct({
          predicted: predictedX,
          observation: [indexTip.x]
        });

        const predictedY = kalmanY.predict({
          previousCorrected: previousCorrectedY
        });
        const correctedY = kalmanY.correct({
          predicted: predictedY,
          observation: [indexTip.y]
        });

        previousCorrectedX = correctedX;
        previousCorrectedY = correctedY;

        const smoothed = {
          x: correctedX.mean[0],
          y: correctedY.mean[0]
        };

        await window.api.moveMouse(newResults.handedness, smoothed);

        if (newResults.landmarks.length > 1) {
          await Promise.all(
            Array.from(mapping.entries()).map(async ([gesture, control]) => {
              await window.api[control](gesture, newResults.landmarks[1]);
            })
          );
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(predictWebcam);
  };

  const initializePrediction = async () => {
    mapping = await window.api.loadMappings();
    console.log(mapping);
    predictWebcam();
  };

  initializePrediction();
};

export default handleGesturePrediction;
