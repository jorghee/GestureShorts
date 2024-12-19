import { useState, useEffect } from "react";
import "../assets/Mapping.css";
import flechaIcon from "../assets/images/flecha.png";

const Mappings = () => {
    const [gestureOptions, setGestureOptions] = useState([]);
    const [controlOptions, setControlOptions] = useState([]);
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


    return (
        <>
        <div className="mappings">
            <h3 className="tituloMapping">GESTOS ACTUALES:</h3>
            <ul>
            {Array.from(mappings).map(([gesture, control]) => (
                <li key={crypto.randomUUID()} className="mapping-item">
                <div className="gesture">{gesture}</div>
                <img src={flechaIcon} alt="Arrow" className="flecha-icon" />
                <div className="gesture">{control}</div>
                </li>
            ))}
            </ul>
        </div>
        </>
    );
    };

export default Mappings;
