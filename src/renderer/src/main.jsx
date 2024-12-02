import "./assets/App.css";
import "./assets/Rehabilitation.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Rehabilitation from "./components/Rehabilitation";
import Customization from "./components/Customization";
import Detection from "./components/Detection";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/rehabilitation" element={<Rehabilitation />} />
        <Route path="/customization" element={<Customization />} />
        <Route path="/detection" element={<Detection />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
