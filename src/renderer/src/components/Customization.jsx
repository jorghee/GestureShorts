import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Customization = () => {
  const navigate = useNavigate();
  const gestureOptions = useRef(window.api.getGestures());
  const controlOptions = useRef(window.api.getControls());
  const selectedGesture = useRef("");
  const selectedControl = useRef("");
  const [mappings, setMappings] = useState([]);

  useEffect(() => {
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
    console.log("Render useEffect");
  }, []);

  const handleSaveMapping = () => {
    if (selectedGesture.current && selectedControl.current) {
      gestureOptions.current = gestureOptions.current.filter(
        (item) => item !== selectedGesture.current
      );

      controlOptions.current = controlOptions.current.filter(
        (item) => item !== selectedControl.current
      );

      setMappings((prev) => [
        ...prev,
        { gesture: selectedGesture.current, control: selectedControl.current }
      ]);
    }
  };

  const handleUndoMapping = () => {
    if (mappings.length > 0) {
      const lastMapping = mappings[mappings.length - 1];
      gestureOptions.current = [...gestureOptions.current, lastMapping.gesture];
      controlOptions.current = [...controlOptions.current, lastMapping.control];
      setMappings((prev) => prev.slice(0, -1));
    }
  };

  const handleTerminate = async () => {
    const result = await window.api.saveMappings(mappings);
    if (result.success) {
      console.log("Mappings saved successfully!");
      navigate("/detection");
    } else {
      console.log("Error saving mappings:", result.error);
    }
  };

  return (
    <>
    <br /><br /><br />
      <h1 className="title title-fixed">RELACIONAR</h1>
      <div className="container-flex">
        {gestureOptions.current.length > 0 &&
          controlOptions.current.length > 0 && (
            <div className="radio-tile-group">
              <div className="creategesto">
                <button onClick={() => navigate("/creategesture")}>CREAR NUEVO GESTO</button>
              </div>
              
              <div className="container-block">

                <h2 className="heading">GESTOS</h2>
    
                {gestureOptions.current.map((gesture) => (
                  <div
                    className="input-container input-container--small"
                    key={crypto.randomUUID()}
                  >
                    <input
                      id={`gesture-${gesture}`}
                      type="radio"
                      name="gestures"
                      onChange={() => (selectedGesture.current = gesture)}
                    />
                    <div className="radio-tile radio-tile--highlighted">
                      <label htmlFor={`gesture-${gesture}`}>{gesture}</label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="container-block">
                <h2 className="heading">CONTROLES</h2>
                {controlOptions.current.map((control) => (
                  <div
                    className="input-container input-container--small"
                    key={crypto.randomUUID()}
                  >
                    <input
                      id={`control-${control}`}
                      type="radio"
                      name="controls"
                      onChange={() => {
                        selectedControl.current = control;
                        handleSaveMapping();
                      }}
                    />
                    <div className="radio-tile radio-tile--highlighted">
                      <label htmlFor={`control-${control}`}>{control}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="container-scrool">
          <div className="buttons-container">
            <button onClick={() => navigate("/")}>VOLVER</button>
            <button
              onClick={handleUndoMapping}
              disabled={mappings.length === 0}
            >
              DESHACER
            </button>
            <button onClick={handleTerminate}>CONFIRMAR</button>
          </div>
          <h2 className="heading">MAPEOS ACTUALES</h2>
          {mappings.map(({ gesture, control }) => (
            <div key={crypto.randomUUID()} className="mapping-item">
              <label>{gesture}</label>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <label>{control}</label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Customization;
