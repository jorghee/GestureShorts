import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/personalizacion.css";
import Mappings from "./mappings";
import retrocederIcon from "../assets/images/escape.png";

const Personalizado = () => {
  const navigate = useNavigate();
  const [gestureOptions, setGestureOptions] = useState([]);
  const [controlOptions, setControlOptions] = useState([]);
  const [selectedGesture, setSelectedGesture] = useState("");
  const [selectedControl, setSelectedControl] = useState("");
  const [mappings, setMappings] = useState(new Map());

  useEffect(() => {
    setGestureOptions(window.api.getGestures());
    setControlOptions(window.api.getControls());

    const loadDefaultMappings = async () => {
      const defaultMappings = await window.api.loadMappings();
      if (defaultMappings) {
        setMappings(defaultMappings);
        console.log("Mappings loaded successfully!");
      } else {
        console.error("Error loading default mappings:", defaultMappings.error);
      }
    };

    loadDefaultMappings();
  }, []);

  const handleSaveMapping = () => {
    if (selectedGesture && selectedControl) {
      setMappings((prev) => {
        const newMapping = new Map(prev);
        newMapping.set(selectedGesture, selectedControl);
        return newMapping;
      });
      setSelectedGesture("");
      setSelectedControl("");
    }
  };

  const handleResetMappings = () => {
    setMappings(new Map());
  };

  const handleTerminate = async () => {
    const result = await window.api.saveMappings(mappings);
    if (result.success) {
      console.log("Mappings saved successfully!");
    } else {
      console.log("Error saving mappings:", result.error);
    }

    navigate("/Rehabilitacion");
  };

  return (
    <>
      <div class="back-button" onClick={() => navigate("/")}>
        <img src={retrocederIcon} className="retroceder-icon"/>
      </div>
      <h1 className="gesture-titlepersonalizado">RELACIONAR GESTOS CON CONTROLES</h1>
        <div className="bloque">
          <div className="contenedor">
            <div className="gestos">
              <div className="encabezadogestos">
                <h2 className="gesture-subtitle">GESTOS</h2>
                <button className="botonNuevoGesto" onClick={() => navigate("/Crear")}>
                  + Nuevo Gesto
                </button>
              </div>
              {gestureOptions.map((displayName) => (
                <button
                  key={crypto.randomUUID()}
                  className={`botonesGestosControles ${selectedGesture === displayName ? "selected" : ""}`}
                  onClick={() => setSelectedGesture(displayName)}
                >
                  {displayName}
                </button>
              ))}
            </div>

            <div className="controles">
              <h2 className="gesture-subtitle">CONTROLES</h2>
              {controlOptions.map((displayName) => (
                <button
                  key={crypto.randomUUID()}
                  className={`botonesGestosControles ${selectedControl === displayName ? "selected" : ""}`}
                  onClick={() => setSelectedControl(displayName)}
                >
                  {displayName}
                </button>
              ))}
            </div>
        </div>
            
        <div className="button-container">
          <button className="botonesPersonalizacion" onClick={handleResetMappings}>
            REINICIAR
          </button>
          <button className="botonesPersonalizacion" onClick={handleSaveMapping} disabled={!selectedGesture || !selectedControl}>
              CONFIRMAR
          </button>
          <button className="botonesPersonalizacion" onClick={handleTerminate}>
            TERMINAR
          </button>
        </div>
        <Mappings/>
      </div>
    </>
  );
};

export default Personalizado;
