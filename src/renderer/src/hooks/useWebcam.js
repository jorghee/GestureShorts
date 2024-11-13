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
          videoElement.onloadeddata = () => {
            videoElement.play();
            console.log("Video metadata loaded and playing");
          };
        })
        .catch((error) => {
          alert("Could not connect to webcam: " + error.message);
        });
    }
  }, [videoId]);

  return { isWebcamRunning, setWebcamRunning, videoRef };
};

export default useWebcam;
