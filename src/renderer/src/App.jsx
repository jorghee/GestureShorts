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
        
    </header>

    <main>
      <hr />
      <h1 class="titulo">GESTURE SHORTS</h1>
      <video autoPlay={true} width={200} height = {100} id="video" ></video>
      <Button class = "btnComenzar "id="start" onClick={startDetection}> COMENZAR </Button>
      <Button class = "btnConfiguracion" onClick={() => navigate("/mapper")}> CONFIGURAR GESTOS</Button>
      <hr />
    </main>

    <footer>
    </footer>

    </>
  );
};

export default App;
