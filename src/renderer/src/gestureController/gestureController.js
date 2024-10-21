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
      console.log("Error of handLandmarker.current or video.current.");
      return;
    }

    const startTimeMs = performance.now();

    if (lastVideoTime !== video.currentTime) {
      setLastVideoTime(video.currentTime);
      const newResults = await handLandmarker.detectForVideo(
        video,
        startTimeMs
      );
      console.log(newResults);

      if (newResults.landmarks.length > 0) {
        const smoothed = await window.api.movingAverageSmoothing(
          newResults.landmarks[0],
          smoothedLandmarks,
          setSmoothedLandmarks,
          bufferSize
        );

        await window.api.moveMouse(newResults.handedness, smoothed);

        if (newResults.landmarks.length > 1) {
          await window.api.detectClick(
            newResults.handedness,
            newResults.landmarks[1]
          );
        }
      }
    }
  };

  animationFrame = window.requestAnimationFrame(predictWebcam);
  return predictWebcam;
};

export default handleGesturePrediction;
