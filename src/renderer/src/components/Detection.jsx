import { useCallback, useRef } from "react";

import useWebcam from "../hooks/useWebcam";
import useHandLandmarker from "../hooks/useHandLandmarker";
import configuration from "../../../utils/config";
import handleGesturePrediction from "../gestureController/gestureController";
import { useNavigate } from "react-router-dom";

const Detection = () => {
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
      <div className="container">
        <h1 className="title">MODO REHABILITACIÓN</h1>
        <video autoPlay={true} width={600} height={300} id="video"></video>
        <div className="buttons-container">
          <button onClick={() => navigate("/")}>CAMBIAR MODO</button>
          <button onClick={() => navigate("/rehabilitation")}>VOLVER</button>
          <button id="start" onClick={startDetection}>
            COMENZAR
          </button>
        </div>
      </div>
    </>
  );
};

export default Detection;
