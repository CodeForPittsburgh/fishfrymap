import L from "leaflet";
import {
  faLocationArrow,
  faMinus,
  faPlus,
  faSpinner,
  faUpDownLeftRight,
  iconHtml
} from "../icons/fontAwesome";

let pluginsLoaded = false;

async function ensureLeafletPlugins() {
  if (pluginsLoaded) {
    return;
  }

  if (typeof window !== "undefined") {
    window.L = L;
  }

  await import("leaflet.markercluster");
  await import("leaflet-basemaps");
  await import("leaflet.locatecontrol");
  await import("leaflet-groupedlayercontrol");
  await import("leafletgeojsonfilter");
  await import("@unchartedsoftware/leaflet.zoomhome/dist/leaflet.zoomhome");

  pluginsLoaded = true;
}

const highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

const unpublishedStyle = {
  radius: 3,
  color: "#fedb96",
  fillColor: "#fff",
  fillOpacity: 1,
  weight: 5,
  opacity: 0.5
};

function serializeBounds(bounds) {
  return {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest()
  };
}

export class LeafletController {
  constructor() {
    this.map = null;
    this.markerClusters = null;
    this.highlightLayer = null;
    this.locateIconObserver = null;
    this.markersById = new Map();
    this.featuresById = new Map();
    this.filteredFeatures = [];
    this.listeners = new Map();
    this.overlayVisible = true;
    this.baseLayers = {};
    this.activeBasemap = "light";
  }

  getBasemapIdForLayer(layer) {
    if (!layer) {
      return null;
    }

    const byIdentity = Object.entries(this.baseLayers).find(([, candidate]) => candidate === layer)?.[0];
    if (byIdentity) {
      return byIdentity;
    }

    return (
      Object.entries(this.baseLayers).find(([, candidate]) => {
        return candidate?._url === layer?._url;
      })?.[0] || null
    );
  }

  async init(containerEl) {
    await ensureLeafletPlugins();

    this.baseLayers.dark = L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    );

    this.baseLayers.gold = L.tileLayer(
      "https://{s}.sm.mapstack.stamen.com/((terrain-background,$000[@30],$fff[hsl-saturation@80],$1b334b[hsl-color],mapbox-water[destination-in]),(watercolor,$fff[difference],$000000[hsl-color],mapbox-water[destination-out]),(terrain-background,$000[@40],$000000[hsl-color],mapbox-water[destination-out])[screen@60],(streets-and-labels,$fedd9a[hsl-color])[@50])/{z}/{x}/{y}.png",
      {
        attribution:
          '<a style="color:black" href="http://stamen.com">Stamen Design</a> under <a style="color:black" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> license + <a style="color:black" href="http://openstreetmap.org">OpenStreetMap</a> under <a style="color:black" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a> license.',
        maxZoom: 18
      }
    );

    this.baseLayers.light = L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    );

    this.highlightLayer = L.geoJson(null);
    this.markerClusters = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 6
    });

    this.map = L.map(containerEl, {
      zoom: 10,
      center: [40.4452, -79.9866],
      layers: [this.baseLayers.light, this.markerClusters, this.highlightLayer],
      zoomControl: false,
      attributionControl: false
    });

    this.map.addControl(
      L.Control.zoomHome({
        position: "topleft"
      })
    );

    const zoomOut = document.querySelector(".leaflet-control-zoomhome-out");
    const zoomIn = document.querySelector(".leaflet-control-zoomhome-in");
    const zoomHome = document.querySelector(".leaflet-control-zoomhome-home");
    if (zoomOut) zoomOut.innerHTML = iconHtml(faMinus);
    if (zoomIn) zoomIn.innerHTML = iconHtml(faPlus);
    if (zoomHome) zoomHome.innerHTML = iconHtml(faUpDownLeftRight);

    this.map.addControl(
      L.control.basemaps({
        position: "topright",
        basemaps: [this.baseLayers.dark, this.baseLayers.light],
        tileX: 4550,
        tileY: 6176,
        tileZ: 14
      })
    );

    const overlayControl = L.control.layers(
      {},
      {
        "Fish Fries": this.markerClusters
      },
      {
        collapsed: true
      }
    );
    overlayControl.addTo(this.map);

    const locateControl = L.control.locate({
      position: "topleft",
      drawCircle: true,
      follow: true,
      setView: true,
      keepCurrentZoomLevel: false,
      markerStyle: {
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
      },
      circleStyle: {
        weight: 1,
        clickable: false
      },
      icon: "fishfry-locate-icon",
      iconLoading: "fishfry-locate-icon-loading",
      createButtonCallback: (container, options) => {
        const link = L.DomUtil.create("a", "leaflet-bar-part leaflet-bar-part-single", container);
        link.title = options.strings.title;

        const iconEl = L.DomUtil.create(options.iconElementTag, options.icon, link);
        iconEl.innerHTML = iconHtml(faLocationArrow);

        return { link, icon: iconEl };
      },
      metric: false,
      strings: {
        title: "My location",
        popup: "You are within {distance} {unit} from this point",
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
      },
      locateOptions: {
        maxZoom: 17,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    });
    this.map.addControl(locateControl);
    this.observeLocateIcon(locateControl);

    this.map.addControl(
      L.control.attribution({
        position: "bottomright",
        prefix: "<a href='http://codeforpittsburgh.github.io'>Code for Pittsburgh</a>"
      })
    );

    this.map.on("overlayadd", (event) => {
      if (event.layer === this.markerClusters) {
        this.overlayVisible = true;
        this.emit("overlaychange", { visible: true });
      }
    });

    this.map.on("overlayremove", (event) => {
      if (event.layer === this.markerClusters) {
        this.overlayVisible = false;
        this.emit("overlaychange", { visible: false });
      }
    });

    this.map.on("baselayerchange", (event) => {
      const layer = event?.layer || event;
      const id = this.getBasemapIdForLayer(layer);
      if (!id) {
        return;
      }

      this.activeBasemap = id;
      this.emit("basemapchange", { id });
    });

    this.map.on("moveend", () => {
      this.sizeLayerControl();
      this.emit("moveend", {
        bounds: serializeBounds(this.map.getBounds()),
        center: this.map.getCenter(),
        zoom: this.map.getZoom()
      });
    });

    this.map.on("click", () => {
      this.highlightFeature(null);
      this.emit("mapclick", {});
    });

    const layerControlContainer = document.querySelector(".leaflet-control-layers");
    if (layerControlContainer) {
      if (!L.Browser.touch) {
        L.DomEvent.disableClickPropagation(layerControlContainer).disableScrollPropagation(
          layerControlContainer
        );
      } else {
        L.DomEvent.disableClickPropagation(layerControlContainer);
      }
    }

    this.sizeLayerControl();

    this.emit("ready", {
      bounds: serializeBounds(this.map.getBounds()),
      center: this.map.getCenter(),
      zoom: this.map.getZoom()
    });
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    this.listeners.get(eventName).add(callback);
    return () => {
      this.listeners.get(eventName)?.delete(callback);
    };
  }

  emit(eventName, payload) {
    (this.listeners.get(eventName) || []).forEach((listener) => listener(payload));
  }

  observeLocateIcon(locateControl) {
    if (!locateControl?._icon) {
      return;
    }

    const iconEl = locateControl._icon;
    const updateIcon = () => {
      if (iconEl.classList.contains("fishfry-locate-icon-loading")) {
        iconEl.innerHTML = iconHtml(faSpinner, { classes: ["fa-spin"] });
        return;
      }
      iconEl.innerHTML = iconHtml(faLocationArrow);
    };

    updateIcon();

    if (typeof MutationObserver === "undefined") {
      return;
    }

    this.locateIconObserver = new MutationObserver(updateIcon);
    this.locateIconObserver.observe(iconEl, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  sizeLayerControl() {
    const layerControl = document.querySelector(".leaflet-control-layers");
    const mapEl = document.getElementById("map");
    if (layerControl && mapEl) {
      layerControl.style.maxHeight = `${mapEl.clientHeight - 50}px`;
    }
  }

  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
      this.sizeLayerControl();
    }
  }

  setFeatures(features) {
    this.featuresById = new Map(features.map((feature) => [feature.id, feature]));
  }

  createMarker(feature) {
    const [lng, lat] = feature.geometry.coordinates;
    const latlng = [lat, lng];

    if (feature.properties.publish) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: feature.properties.icon,
          iconSize: [30, 76]
        }),
        title: feature.properties.venue_name,
        riseOnHover: true
      });
    }

    return L.circleMarker(latlng, unpublishedStyle);
  }

  setFilteredFeatures(features) {
    this.filteredFeatures = features;
    this.markersById.clear();

    if (!this.markerClusters) {
      return;
    }

    this.markerClusters.clearLayers();

    features.forEach((feature) => {
      const marker = this.createMarker(feature);
      marker.on("click", () => {
        this.highlightFeature(feature.id);
        this.emit("featureclick", { featureId: feature.id });
      });
      this.markersById.set(feature.id, marker);
      this.markerClusters.addLayer(marker);
    });
  }

  setOverlayVisible(_name, visible) {
    if (!this.map || !this.markerClusters) {
      return;
    }

    this.overlayVisible = visible;
    if (visible && !this.map.hasLayer(this.markerClusters)) {
      this.map.addLayer(this.markerClusters);
    }
    if (!visible && this.map.hasLayer(this.markerClusters)) {
      this.map.removeLayer(this.markerClusters);
    }
  }

  setBasemap(id) {
    if (!this.map || !this.baseLayers[id]) {
      return;
    }

    if (this.activeBasemap === id && this.map.hasLayer(this.baseLayers[id])) {
      return;
    }

    Object.values(this.baseLayers).forEach((layer) => {
      if (this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });

    this.map.addLayer(this.baseLayers[id]);
    this.activeBasemap = id;
    this.emit("basemapchange", { id });
  }

  highlightFeature(featureId) {
    if (!this.highlightLayer) {
      return;
    }

    this.highlightLayer.clearLayers();
    if (!featureId) {
      return;
    }

    const marker = this.markersById.get(featureId);
    if (!marker) {
      return;
    }

    const latLng = marker.getLatLng();
    this.highlightLayer.addLayer(L.circleMarker([latLng.lat, latLng.lng], highlightStyle));
  }

  focusFeature(featureId, zoom = 17) {
    const marker = this.markersById.get(featureId);
    if (!marker || !this.map) {
      return;
    }

    const latLng = marker.getLatLng();
    this.map.setView([latLng.lat, latLng.lng], zoom);
  }

  openFeature(featureId) {
    const marker = this.markersById.get(featureId);
    if (!marker) {
      return;
    }

    this.focusFeature(featureId, 17);
    marker.fire("click");
  }

  setView(lat, lng, zoom = 17) {
    if (!this.map) {
      return;
    }

    this.map.setView([lat, lng], zoom);
  }

  destroy() {
    if (this.locateIconObserver) {
      this.locateIconObserver.disconnect();
      this.locateIconObserver = null;
    }

    this.listeners.clear();
    this.markersById.clear();
    this.featuresById.clear();

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
