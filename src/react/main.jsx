import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet-basemaps/L.Control.Basemaps.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

import "../css/MarkerCluster.Default.css";
import "../css/app.css";
import "./styles/react-app.css";

import { store } from "./store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
