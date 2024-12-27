import { useCallback, useRef, useState, useEffect } from "react";
import "../assets/create.css";
import useWebcam from "../hooks/useWebcam.js";
import useHandLandmarker from "../hooks/useHandLandmarker.js";
import configuration from "../../../utils/config.js";
import handleGesturePrediction from "../gestureController/gestureController.js";
import { useNavigate } from "react-router-dom";
import Mappings from "./mappings";
import retrocederIcon from "../assets/images/escape.png";
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';


const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],       // Pulgar
    [0, 5], [5, 6], [6, 7], [7, 8],       // Índice
    [5, 9], [9, 10], [10, 11], [11, 12],  // Medio
    [9, 13], [13, 14], [14, 15], [15, 16], // Anular
    [13, 17], [17, 18], [18, 19], [19, 20], // Meñique
    [0, 17] // Palma
];
/*funcion para dibujar*/

const drawHandLandmarks = (canvasCtx, landmarks) => {
    // Dibuja las conexiones entre los puntos
    for (const connection of HAND_CONNECTIONS) {
        const start = landmarks[connection[0]];
        const end = landmarks[connection[1]];
        
        if (start && end) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(start.x * canvasCtx.canvas.width, start.y * canvasCtx.canvas.height);
            canvasCtx.lineTo(end.x * canvasCtx.canvas.width, end.y * canvasCtx.canvas.height);
            canvasCtx.strokeStyle = "#00FF00";
            canvasCtx.lineWidth = 2;
            canvasCtx.stroke();
        }
    }

    // Dibuja los puntos de referencia y los números correspondientes
    landmarks.forEach((landmark, index) => {
        const x = landmark.x * canvasCtx.canvas.width;
        const y = landmark.y * canvasCtx.canvas.height;

        // Dibuja el punto
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 3, 0, 2 * Math.PI);
        canvasCtx.fillStyle = "#FF0000";
        canvasCtx.fill();

        // Dibuja el número
        canvasCtx.font = "12px Arial";
        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.fillText(index, x + 5, y - 5); // Ajusta la posición del texto
    });
};
// const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//         ...prev,
//         [name]: value
//     }));
// };
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

    // Mueve esta función dentro del componente
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const predictWebcam = useCallback(() => {
        const video = videoRef.current;
        const canvas = document.getElementById("output_canvas");
        const canvasCtx = canvas.getContext("2d");

        
        const detectHands = async () => {
            if (!video.videoWidth) {
                requestAnimationFrame(detectHands);
                return;
            }

            // Set canvas size to match video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const results = handLandmarkerRef.current.detectForVideo(video, performance.now());
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            if (results.landmarks) {
                results.landmarks.forEach((landmarks) => {
                    drawHandLandmarks(canvasCtx, landmarks);
                });
            }

            animationFrameRef.current = requestAnimationFrame(detectHands);
        };

        detectHands();
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

    const capturarGesto = () => {
        if (!handLandmarkerRef.current) return;
    
        const video = videoRef.current;
        const canvas = document.getElementById("output_canvas");
        const canvasCtx = canvas.getContext("2d");
        
        // Detener la detección
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    
        // Detectar las coordenadas actuales
        const results = handLandmarkerRef.current.detectForVideo(video, performance.now());
        if (results.landmarks && results.landmarks.length > 0) {
            const capturedCoordinates = results.landmarks[0]; // Asumiendo una sola mano detectada
            console.log("Coordenadas capturadas:", capturedCoordinates);
    
            // Guardar las coordenadas en el estado del formulario
            setFormData((prev) => ({
                ...prev,
                capturedCoordinates,
            }));
        }
    
        // Dibujar el marco congelado en el canvas
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        if (results.landmarks) {
            results.landmarks.forEach((landmarks) => {
                drawHandLandmarks(canvasCtx, landmarks);
            });
        }
    };
    
    const crearNuevoGesto = () => {
        console.log("Nuevo gesto:", formData);
        // Lógica para enviar la información del formulario, incluidas las coordenadas capturadas

        

        fetch("/api/gestures", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Gesto creado con éxito:", data);
            })
            .catch((error) => {
                console.error("Error al crear el gesto:", error);
            });
    };
    

    return (
        <>
            <div className="back-button" onClick={() => navigate("/")}>
                <img src={retrocederIcon} className="retroceder-icon" alt="Retroceder"/>
            </div>
            
            <div className="content-container">
                <div className="left-content">
                    <div className="video-wrapper">
                        <video className="webcam-video" autoPlay={true} id="video" ref={videoRef} ></video>
                        <canvas className="hand-canvas" id="output_canvas"></canvas>
                    </div>
                    <button className="Comenzar" id="start" onClick={startDetection}>
                        COMENZAR
                    </button>
                    <button className="Comenzar" id="capturar" onClick={capturarGesto}>
                        CAPTURAR PANTALLA
                    </button>
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
                                                {[6, 7, 8].map(num => (
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
                                                {[10, 11, 12].map(num => (
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
                                                {[14, 15, 16].map(num => (
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
                                                {[18, 19, 20].map(num => (
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
            
        </>
    );
};

export default CreateGesture;