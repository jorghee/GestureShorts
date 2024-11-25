import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/GestureControlMapper.css";

const GestureControlMapper = () => {
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

    navigate("/"); // Back to App.js
  };

  return (
    <>
      <main>
        <h1 className="tituloRelacionar">RELACIONAR GESTOS CON CONTROLES</h1>
        <div className="contenedor">
          <div className="gestos">
            <h2 className="subTitulo">GESTOS</h2>
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
            <h2 className="subTitulo">CONTROLES</h2>
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

        <div className="contenedor-botones">
          <button className="Reiniciar" onClick={handleResetMappings}>
            REINICIAR
          </button>
          <button
            className="Confirmar"
            onClick={handleSaveMapping}
            disabled={!selectedGesture || !selectedControl}
          >
            CONFIRMAR
          </button>
          <button className="Terminar" onClick={handleTerminate}>
            TERMINAR
          </button>
        </div>
      </main>

      <div className="mappings">
        <h3 className="mapeo">MAPEOS ACTUALES:</h3>
        <ul>
          {Array.from(mappings).map(([gesture, control]) => (
            <li key={crypto.randomUUID()} className="mapping-item">
              <div className="gesture">{gesture}</div>
              <div className="arrow">➡️</div>
              <div className="gesture">{control}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GestureControlMapper;
