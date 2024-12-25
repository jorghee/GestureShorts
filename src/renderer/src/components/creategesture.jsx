import { useCallback, useRef, useState } from "react";
import "../assets/create.css";
import useWebcam from "../hooks/useWebcam.js";
import useHandLandmarker from "../hooks/useHandLandmarker.js";
import configuration from "../../../utils/config.js";
import handleGesturePrediction from "../gestureController/gestureController.js";
import { useNavigate } from "react-router-dom";
import Mappings from "./mappings";
import retrocederIcon from "../assets/images/escape.png";

const CreateGesture = () => {
    const { isWebcamRunning, setWebcamRunning, videoRef } = useWebcam("video");
    const handLandmarkerRef = useHandLandmarker();
    const animationFrameRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        gestureName: "",
        limit: "0.5",
        type: "derecha",
        pulgar: "1",
        indice: "1",
        medio: "1",
        anular: "1",
        menique: "1"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    const crearNuevoGesto = () => {
        console.log("Nuevo gesto:", formData);
        // Aquí irá la lógica para crear el gesto
    };

    return (
        <>
            <div className="back-button" onClick={() => navigate("/")}>
                <img src={retrocederIcon} className="retroceder-icon" alt="Retroceder"/>
            </div>
            <body>
                <div className="content-container">
                    <div className="left-content">
                        <video autoPlay={true} width={200} height={100} id="video"></video>
                        <button className="Comenzar" id="start" onClick={startDetection}>
                        CAPTURAR GESTO</button>
                    </div>
                    <div className="right-content">
                        <h1 className="titulo">CREA UN NUEVO GESTO</h1>
                        <div className="form-container">
                            <form className="gesture-form">
                                <div className="form-group">
                                    <label>Nombre del Gesto:</label>
                                    <input
                                        type="text"
                                        name="gestureName"
                                        value={formData.gestureName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="inline-container">
                                    <div className="form-group">
                                        <label>Límite:</label>
                                        <input
                                            type="number"
                                            name="limit"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={formData.limit}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Tipo:</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value="derecha">Derecha</option>
                                            <option value="izquierda">Izquierda</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="fingers-section">
                                    <h3>Configuración de dedos</h3>
                                    <div className="fingers-grid">
                                        <div className="finger-input">
                                            <label>Pulgar:</label>
                                            <select
                                                name="pulgar"
                                                value={formData.pulgar}
                                                onChange={handleInputChange}
                                            >
                                                {[1, 2, 3, 4].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="finger-input">
                                            <label>Índice:</label>
                                            <select
                                                name="indice"
                                                value={formData.indice}
                                                onChange={handleInputChange}
                                            >
                                                {[1, 2, 3, 4].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="finger-input">
                                            <label>Medio:</label>
                                            <select
                                                name="medio"
                                                value={formData.medio}
                                                onChange={handleInputChange}
                                            >
                                                {[1, 2, 3, 4].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="finger-input">
                                            <label>Anular:</label>
                                            <select
                                                name="anular"
                                                value={formData.anular}
                                                onChange={handleInputChange}
                                            >
                                                {[1, 2, 3, 4].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="finger-input">
                                            <label>Meñique:</label>
                                            <select
                                                name="menique"
                                                value={formData.menique}
                                                onChange={handleInputChange}
                                            >
                                                {[1, 2, 3, 4].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <button className="Comenzar" onClick={crearNuevoGesto}>
                            CREAR GESTO
                        </button>
                    </div>
                </div>
            </body>
        </>
    );
};

export default CreateGesture;