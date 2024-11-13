import { useState, useCallback, useRef } from "react";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";

import { configuration } from "../../utils/config.js";

import useWebcam from "./hooks/useWebcam.js";
import useHandLandmarker from "./hooks/useHandLandmarker.js";
import handleGesturePrediction from "./gestureController/gestureController.js";

const App = () => {
  const { isWebcamRunning, setWebcamRunning, videoRef } = useWebcam("video");
  const [lastVideoTime, setLastVideoTime] = useState(-1);
  const [config, setConfig] = useState(configuration);
  const [smoothedLandmarks, setSmoothedLandmarks] = useState([]);
  const handLandmarkerRef = useHandLandmarker();
  const animationFrame = useRef(null); // Track the animation

  console.log("Renderizando...");

  const predictWebcam = useCallback(() => {
    handleGesturePrediction(
      handLandmarkerRef.current,
      videoRef.current,
      config.bufferSize,
      smoothedLandmarks,
      setSmoothedLandmarks,
      animationFrame.current,
      lastVideoTime,
      setLastVideoTime
    );
  }, [handLandmarkerRef, videoRef, smoothedLandmarks, config]);

  const startDetection = () => {
    if (!handLandmarkerRef.current) {
      console.log("Wait! handLandmarker not loaded yet.");
      return;
    }

    setWebcamRunning((prevRunning) => {
      if (prevRunning) {
        predictWebcam();
      } else if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      const startButton = document.getElementById("start");
      startButton.innerText = prevRunning ? "CANCELAR" : "COMENZAR";

      return !prevRunning;
    });
  };

  return (
    <>
      <header>
        <p>Gesture Shorts</p>
      </header>
      <div id="home">
        <video autoPlay={true} width={400} height={200} id="video"></video>
        <Button
          id="start"
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={startDetection}
        >
          COMENZAR
        </Button>
      </div>
    </>
  );
};

export default App;
