import "./assets/main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GestureControlMapper from "./components/GestureControlMapper";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/mapper"
          element={
            <GestureControlMapper
              getGestureDisplayNames={window.api.getGestureDisplayNames}
              getControlDisplayNames={window.api.getControlDisplayNames}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
