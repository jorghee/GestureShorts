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
    if (!handLandmarker.current || !video.current || video.current.readyState !== 4) {
      console.log("Error of handLandmarker.current or video.current.");
      return;
    }

    const startTimeMs = performance.now();

    if (lastVideoTime !== video.current.currentTime) {
      setLastVideoTime(video.current.currentTime);
      const newResults = await handLandmarker.current.detectForVideo(
        video.current,
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
          await window.api.detectClick(newResults.handedness, newResults.landmarks[1]);
        }
      }
    }
  };

  animationFrame.current = window.requestAnimationFrame(predictWebcam);
  return predictWebcam;
};

export default handleGesturePrediction;
