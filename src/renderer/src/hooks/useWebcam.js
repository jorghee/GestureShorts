import { useEffect, useState, useRef } from "react";

const useWebcam = (videoId) => {
  const [isWebcamRunning, setWebcamRunning] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = document.getElementById(videoId);
    videoRef.current = videoElement;

    if (videoElement) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch((error) => {
          console.error("Error al conectar la cámara:", error);
        });
    }
  }, [videoId]);

  return { isWebcamRunning, setWebcamRunning, videoRef };
};

export default useWebcam;
