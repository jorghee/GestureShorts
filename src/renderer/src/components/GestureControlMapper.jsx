import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/GestureControlMapper.css";

const GestureControlMapper = ({
  getGestureDisplayNames,
  getControlDisplayNames
}) => {
  const navigate = useNavigate();
  const [gestureOptions, setGestureOptions] = useState([]);
  const [controlOptions, setControlOptions] = useState([]);
  const [selectedGesture, setSelectedGesture] = useState("");
  const [selectedControl, setSelectedControl] = useState("");
  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    const gestures = Array.from(getGestureDisplayNames().entries());
    const controls = Array.from(getControlDisplayNames().entries());
    setGestureOptions(gestures);
    setControlOptions(controls);
  }, [getGestureDisplayNames, getControlDisplayNames]);

  const handleSaveMapping = () => {
    if (selectedGesture && selectedControl) {
      setMappings((prev) => [
        ...prev,
        { gesture: selectedGesture, control: selectedControl }
      ]);
      setSelectedGesture("");
      setSelectedControl("");
    }
  };

  const handleResetMappings = () => {
    setMappings([]);
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
          {gestureOptions.map(([displayName, gesture]) => (
            <button
              key={gesture}
              className={`option-button ${selectedGesture === gesture ? "selected" : ""}`}
              onClick={() => setSelectedGesture(gesture)}
            >
              {displayName}
            </button>
          ))}
        </div>

        <div className="controls">
          <h3>Controles</h3>
          {controlOptions.map(([displayName, control]) => (
            <button
              key={control}
              className={`option-button ${selectedControl === control ? "selected" : ""}`}
              onClick={() => setSelectedControl(control)}
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
          {mappings.map((map, index) => (
            <li key={index} className="mapping-item">
              {
                gestureOptions.find(
                  ([_, gesture]) => gesture === map.gesture
                )[0]
              }
              →
              {
                controlOptions.find(
                  ([_, control]) => control === map.control
                )[0]
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GestureControlMapper;
