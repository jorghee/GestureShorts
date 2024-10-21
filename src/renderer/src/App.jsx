import { useState, useCallback } from "react";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";

import Sidebar from "./components/Sidebar.jsx";
import { configuration } from "../../utils/config.js";

import useWebcam from "./hooks/useWebcam.js";
import useHandLandmarker from "./hooks/useHandLandmarker.js";

const App = () => {
  const { isWebcamRunning, setWebcamRunning, videoRef } = useWebcam("video");
  const handLandmarkerRef = useHandLandmarker();
  const [smoothedLandmarks, setSmoothedLandmarks] = useState([]);
  const [config, setConfig] = useState(configuration);

  const getPredictWebcam = useCallback(async () => {
    if (!handLandmarkerRef.current || !videoRef.current) {
      console.warn("El handLandmarker o el video no están listos");
      return;
    }

    try {
      const predictWebcam = await window.api.invoke(
        "get-predict-webcam",
        handLandmarkerRef.current,
        videoRef.current,
        config.bufferSize,
        smoothedLandmarks,
        setSmoothedLandmarks
      );

      return predictWebcam;
    } catch (error) {
      console.error("Error al obtener predictWebcam:", error);
    }
  }, [handLandmarkerRef, videoRef, config, smoothedLandmarks]);

  const startDetection = () => {
    setWebcamRunning((prevRunning) => {
      const newRunning = !prevRunning;
      const startButton = document.getElementById("start");
      startButton.innerText = newRunning ? "Stop" : "Start";

      if (newRunning) getPredictWebcam();

      return newRunning;
    });
  };

  return (
    <>
      <header>
        <p>Gesture Shorts</p>
      </header>
      <div id="content">
        <Sidebar config={config} setConf={setConfig} />
        <div id="camera">
          <video
            autoPlay={true}
            width={800}
            height={400}
            id="video"
            style={{ transform: "scaleX(-1)" }}
          ></video>
          <Button
            id="start"
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={startDetection}
          >
            Start
          </Button>
        </div>
      </div>
    </>
  );
};

export default App;
