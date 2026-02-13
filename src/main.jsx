import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { config } from "@fortawesome/fontawesome-svg-core";

import "bootswatch/dist/darkly/bootstrap.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet-basemaps/L.Control.Basemaps.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

import "@/styles/index.css";

import { store } from "@/store";
import App from "@/App";

config.autoAddCss = false;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
