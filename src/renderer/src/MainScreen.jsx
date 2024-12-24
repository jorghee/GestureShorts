import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  let link = "";

  return (
    <>
      <div className="container">
        <h1 className="title">GESTURE SHORTS</h1>

        <div className="radio-tile-group">
          <div className="input-container">
            <input
              id="hand"
              type="radio"
              name="radio"
              onChange={() => (link = "/rehabilitation")}
            />
            <div className="radio-tile">
              <ion-icon name="thumbs-up-outline"></ion-icon>
              <label htmlFor="hand">Modo Rehabilitación</label>
            </div>
          </div>

          <div className="input-container">
            <input
              id="custom"
              type="radio"
              name="radio"
              onChange={() => (link = "/customization")}
            />
            <div className="radio-tile">
              <ion-icon name="trending-up-outline"></ion-icon>
              <label htmlFor="custom">Modo Personalizable</label>
            </div>
          </div>
        </div>

        <div className="buttons-container">
          <button onClick={() => window.close()}>Salir</button>
          <button onClick={() => navigate(link)}>Continuar</button>
        </div>
      </div>
    </>
  );
};

export default App;