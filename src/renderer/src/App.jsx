import { useEffect, useState, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

import Sidebar from "./components/Sidebar.jsx";
import { configuration } from "../../utils/config.js";

const App = () => {
  const [webcamRunning, setWebcamRunning] = useState(true);
  const [lastVideoTime, setLastVideoTime] = useState(-1);
  const [config, setConfig] = useState(configuration);
  const [smoothedLandmarks, setSmoothedLandmarks] = useState([]); // empty array
  const handLandmarkerRef = useRef(null); // Use useRef for mutable handLandmarker
  const animationFrameId = useRef(null); // Track the animation frame ID
  const bufferSize = configuration.bufferSize;

  useEffect(() => {
    startVideo();
    createHandLandmarker();

    const video = document.getElementById("video");
    video.addEventListener("loadeddata", () => {
      if (webcamRunning) {
        predictWebcam();
      }
    });

    // Add event listener to the start button
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", startDetection);

    // Cleanup event listeners on unmount
    return () => {
      video.removeEventListener("loadeddata", predictWebcam);
      startButton.removeEventListener("click", startDetection);
      cancelAnimationFrame(animationFrameId.current); // Cancel any pending animation frames
    };
  }, []);

  const startVideo = () => {
    const videoElement = document.getElementById("video");
    if (videoElement) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoElement.srcObject = stream;
          videoElement.onloadeddata = () => {
            console.log("Video metadata loaded and playing");
            videoElement.play();
          };
        })
        .catch((error) => {
          alert("Could not connect to webcam: " + error.message);
        });
    }
  };

  const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    ).catch((error) => {
      console.error("Failed to load the wasm file.", error);
    });

    const handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: "video",
      numHands: 2
    });

    handLandmarkerRef.current = handLandmarker; // Store in useRef
  };

  const predictWebcam = useCallback(async () => {
    if (!handLandmarkerRef.current || !webcamRunning) {
      return;
    }

    const video = document.getElementById("video");
    if (!video || video.readyState !== 4) {
      return;
    }

    const startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      setLastVideoTime(video.currentTime);
      const newResults = await handLandmarkerRef.current.detectForVideo(
        video,
        startTimeMs
      );

      // Test 1: The newResults object contains the coordenates
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

    // Schedule the next frame
    animationFrameId.current = window.requestAnimationFrame(predictWebcam);
  }, [lastVideoTime, webcamRunning]);

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
        cancelAnimationFrame(animationFrameId.current); // Cancel any pending animation frames
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
        <div id="camera">
          <video
            autoPlay={true}
            width={800}
            height={400}
            id="video"
            style={{ transform: "scaleX(-1)" }}
          ></video>
          <Sidebar config={config} setConf={setConfig} />
          <Button id="start" variant="contained" startIcon={<PlayArrow />}>
            Start
          </Button>
        </div>
      </div>
    </>
  );
};

export default App;
