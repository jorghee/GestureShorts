import { useCallback, useRef } from "react";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";

import useWebcam from "./hooks/useWebcam.js";
import useHandLandmarker from "./hooks/useHandLandmarker.js";
import configuration from "../../utils/config.js";
import handleGesturePrediction from "./gestureController/gestureController.js";

import { useNavigate } from "react-router-dom";

const App = () => {
  const { isWebcamRunning, setWebcamRunning, videoRef } = useWebcam("video");
  const handLandmarkerRef = useHandLandmarker();
  const animationFrameRef = useRef(null); // Track the animation

  const navigate = useNavigate();

  const predictWebcam = useCallback(() => {
    handleGesturePrediction(
      handLandmarkerRef,
      videoRef,
      configuration.bufferSize,
      animationFrameRef
    );
  }, [handLandmarkerRef, videoRef]);

  const startDetection = () => {
    if (!handLandmarkerRef.current) {
      console.log("Wait! handLandmarker not loaded yet.");
      return;
    }

    if (isWebcamRunning) {
      predictWebcam();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startButton = document.getElementById("start");
    startButton.innerText = isWebcamRunning ? "CANCELAR" : "COMENZAR";

    setWebcamRunning(!isWebcamRunning);
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
        <Button onClick={() => navigate("/mapper")}>Configurar Gestos</Button>
      </div>
    </>
  );
};

export default App;
