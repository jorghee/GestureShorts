import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/GestureControlMapper.css";

const GestureControlMapper = ({ getGestures, getControls }) => {
  console.log("Render component.");

  const navigate = useNavigate();
  const [gestureOptions, setGestureOptions] = useState([]);
  const [controlOptions, setControlOptions] = useState([]);
  const [selectedGesture, setSelectedGesture] = useState("");
  const [selectedControl, setSelectedControl] = useState("");
  const [mappings, setMappings] = useState(new Map());

  useEffect(() => {
    setGestureOptions(getGestures());
    setControlOptions(getControls());
  }, [getGestures, getControls]);

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

  const handleTerminate = () => {
    navigate("/"); // Back to App.js
  };

  return (
    <div className="gesture-control-mapper">
      <h2 className="title">Relacionar Gestos con Controles</h2>

      <div className="options-container">
        <div className="gestures">
          <h3>Gestos</h3>
          {gestureOptions.map((displayName) => (
            <button
              key={crypto.randomUUID()}
              className={`option-button ${selectedGesture === displayName ? "selected" : ""}`}
              onClick={() => setSelectedGesture(displayName)}
            >
              {displayName}
            </button>
          ))}
        </div>

        <div className="controls">
          <h3>Controles</h3>
          {controlOptions.map((displayName) => (
            <button
              key={crypto.randomUUID()}
              className={`option-button ${selectedControl === displayName ? "selected" : ""}`}
              onClick={() => setSelectedControl(displayName)}
            >
              {displayName}
            </button>
          ))}
        </div>
      </div>

      <div className="buttons-container">
        <button className="button terminate" onClick={handleTerminate}>
          Terminar
        </button>
        <button className="button reset" onClick={handleResetMappings}>
          Reiniciar
        </button>
        <button
          className="button confirm"
          onClick={handleSaveMapping}
          disabled={!selectedGesture || !selectedControl}
        >
          Confirmar
        </button>
      </div>

      <div className="mappings">
        <h3>Mapeos actuales:</h3>
        <ul>
          {Array.from(mappings).map(([gesture, control]) => (
            <li key={crypto.randomUUID()} className="mapping-item">
              {gesture} → {control}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GestureControlMapper;
