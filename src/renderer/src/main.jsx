import "./assets/App.css";
import "./assets/Mapping.css";
import "./assets/personalizacion.css";
import "./assets/rehabilitacion.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Personalizado from "./components/Personalizacion";
import Rehabilitacion from "./components/Rehabilitacion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateGesture from "./components/Personalizado"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateGesture />} />
        <Route path="/Personalizado" element={<Personalizado />} />
        <Route path="/Rehabilitacion" element={<Rehabilitacion />} />
        <Route path="/Custom" element={<CreateGesture />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
