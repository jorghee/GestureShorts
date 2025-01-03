import { useRef, useEffect } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const useHandLandmarker = () => {
  const handLandmarkerRef = useRef(null);

  useEffect(() => {
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
      }).catch((error) => {
        console.log("Failde to load hand_landmarker.task file.", error);
      });

      handLandmarkerRef.current = handLandmarker;
    };

    createHandLandmarker();

    return () => {
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  return handLandmarkerRef;
};

export default useHandLandmarker;
