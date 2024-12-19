import { useCallback, useRef } from "react";
import "../assets/rehabilitacion.css"


import useWebcam from "../hooks/useWebcam.js";
import useHandLandmarker from "../hooks/useHandLandmarker.js";
import configuration from "../../../utils/config.js";
import handleGesturePrediction from "../gestureController/gestureController.js";
import { useNavigate } from "react-router-dom";
import Mappings from "./mappings";
import retrocederIcon from "../assets/images/escape.png";

const Rehabilitacion = () => {
    const { isWebcamRunning, setWebcamRunning, videoRef } = useWebcam("video");
    const handLandmarkerRef = useHandLandmarker();
    const animationFrameRef = useRef(null); 
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
            <div class="back-button" onClick={() => navigate("/")}>
                <img src={retrocederIcon} className="retroceder-icon"/>
            </div>
            <body>
                <div className="content-container">
                <div className="left-content">
                    <h1 className="titulo">GESTURE SHORTS</h1>
                    <p> Estas en el apartado a punto de iniciar el control a traves de gestos de mano</p>
                    <Mappings/>
                    <button className="Comenzar" id="start" onClick={startDetection}>
                        COMENZAR
                    </button>
                </div>
                <div className="right-content">
                    <video autoPlay={true} width={200} height={100} id="video"></video>
                </div>
                </div>
            </body>
        </>
    );
};

export default Rehabilitacion;
