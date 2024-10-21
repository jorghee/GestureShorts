import { useEffect, useState, useRef } from "react";

/**
  * @param videoId is the tag of html. La etiqueta no cambia en este
  * proyecto, pero cuando cambie se vuelve a cargar en la nueva etiqueta
  *
  * @return principalmente el estado de usar la webcam y una referencia al
  * elemento html que se ha obtenido, en este caso <video></video>
  */
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
            console.log("Video metadata loaded and playing");
            videoElement.play();
          };
        }).catch((error) => {
          alert("Could not connect to webcam: " + error.message);
        });
    }
  }, [videoId]);

  return { isWebcamRunning, setWebcamRunning, videoRef };
};

export default useWebcam;
