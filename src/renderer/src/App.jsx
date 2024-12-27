import { useNavigate } from "react-router-dom";
import "./assets/App.css"
import rehabilitacionIcon from "../src/assets/images/massage_color.png";
import personalizacionIcon from "../src/assets/images/personalized.png";
import customIcon from "../src/assets/images/custom.png";

const App = () => {
  const navigate = useNavigate();
  let link = "";

  return (
    <>
      <div className="gesture-container">
        <h1 className="gesture-title">GESTURE SHORTS</h1>

        <div className="gesture-mode-selector">
          <div className="gesture-option-container">
            <input
              id="rehabilitation-mode"
              type="radio"
              name="mode-selection"
              onChange={() => (link = "/Rehabilitacion")}
            />
            <div className="gesture-option">
              <ion-icon name="thumbs-up-outline"></ion-icon>
              <label htmlFor="rehabilitation-mode">Modo Rehabilitación</label>
              <img src={rehabilitacionIcon}/>
            </div>
          </div>

          <div className="gesture-option-container">
            <input
              id="custom-mode"
              type="radio"
              name="mode-selection"
              onChange={() => (link = "/Personalizado")}
            />
            <div className="gesture-option">
              <ion-icon name="trending-up-outline"></ion-icon>
              <label htmlFor="custom-mode">Modo Personalizable</label>
              <img src={personalizacionIcon}/>
            </div>
          </div>
          <div className="gesture-option-container">
            <input
              id="rehabilitation-mode"
              type="radio"
              name="mode-selection"
              onChange={() => (link = "/Custom")}
            />
            <div className="gesture-option">
              <ion-icon name="thumbs-up-outline"></ion-icon>
              <label htmlFor="rehabilitation-mode">Modo Rehabilitación</label>
              <img src={customIcon}/>
            </div>
          </div>
        </div>
        

        <div className="gesture-buttons-container">
          <button className= "Continuar" onClick={() => navigate(link)}>Continuar</button>
        </div>
      </div>
    </>
  );
};

export default App;