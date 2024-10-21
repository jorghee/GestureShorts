import { useState, useCallback, useRef } from "react";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";

import Sidebar from "./components/Sidebar.jsx";
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
      const newRunning = !prevRunning;
      const startButton = document.getElementById("start");
      startButton.innerText = newRunning ? "Stop" : "Start";

      if (newRunning) {
        predictWebcam();
      } else {
        cancelAnimationFrame(animationFrame.current);
      }

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
