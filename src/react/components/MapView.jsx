import React, { useEffect, useRef, useState } from "react";

import { LeafletController } from "../map/LeafletController";

const MapView = ({
  features,
  filteredFeatures,
  overlayVisible,
  highlightedFeatureId,
  openFeatureRequest,
  focusFeatureRequest,
  setViewRequest,
  sidebarVisible,
  onMoveEnd,
  onOverlayChange,
  onFeatureClick,
  onMapClick,
  onOpenHandled,
  onFocusHandled,
  onSetViewHandled
}) => {
  const mapRef = useRef(null);
  const controllerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const handlersRef = useRef({
    onMoveEnd,
    onOverlayChange,
    onFeatureClick,
    onMapClick
  });

  const lastOpenSeq = useRef(null);
  const lastFocusSeq = useRef(null);
  const lastViewSeq = useRef(null);

  useEffect(() => {
    handlersRef.current = {
      onMoveEnd,
      onOverlayChange,
      onFeatureClick,
      onMapClick
    };
  }, [onFeatureClick, onMapClick, onMoveEnd, onOverlayChange]);

  useEffect(() => {
    let cancelled = false;
    const controller = new LeafletController();
    controllerRef.current = controller;

    controller
      .init(mapRef.current)
      .then(() => {
        if (cancelled) {
          return;
        }

        controller.on("moveend", (payload) => handlersRef.current.onMoveEnd(payload));
        controller.on("overlaychange", (payload) => handlersRef.current.onOverlayChange(payload));
        controller.on("featureclick", (payload) => handlersRef.current.onFeatureClick(payload));
        controller.on("mapclick", (payload) => handlersRef.current.onMapClick(payload));

        setReady(true);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Leaflet controller initialization failed", error);
      });

    return () => {
      cancelled = true;
      controller.destroy();
    };
  }, []);

  useEffect(() => {
    if (!ready || !controllerRef.current) {
      return;
    }

    controllerRef.current.setFeatures(features);
  }, [features, ready]);

  useEffect(() => {
    if (!ready || !controllerRef.current) {
      return;
    }

    controllerRef.current.setFilteredFeatures(filteredFeatures);
  }, [filteredFeatures, ready]);

  useEffect(() => {
    if (!ready || !controllerRef.current) {
      return;
    }

    controllerRef.current.setOverlayVisible("Fish Fries", overlayVisible);
  }, [overlayVisible, ready]);

  useEffect(() => {
    if (!ready || !controllerRef.current) {
      return;
    }

    controllerRef.current.highlightFeature(highlightedFeatureId);
  }, [highlightedFeatureId, ready]);

  useEffect(() => {
    if (!ready || !controllerRef.current || !openFeatureRequest) {
      return;
    }

    if (lastOpenSeq.current === openFeatureRequest.seq) {
      return;
    }

    lastOpenSeq.current = openFeatureRequest.seq;
    controllerRef.current.openFeature(openFeatureRequest.id);
    onOpenHandled();
  }, [openFeatureRequest, onOpenHandled, ready]);

  useEffect(() => {
    if (!ready || !controllerRef.current || !focusFeatureRequest) {
      return;
    }

    if (lastFocusSeq.current === focusFeatureRequest.seq) {
      return;
    }

    lastFocusSeq.current = focusFeatureRequest.seq;
    controllerRef.current.focusFeature(focusFeatureRequest.id, focusFeatureRequest.zoom);
    onFocusHandled();
  }, [focusFeatureRequest, onFocusHandled, ready]);

  useEffect(() => {
    if (!ready || !controllerRef.current || !setViewRequest) {
      return;
    }

    if (lastViewSeq.current === setViewRequest.seq) {
      return;
    }

    lastViewSeq.current = setViewRequest.seq;
    controllerRef.current.setView(setViewRequest.lat, setViewRequest.lng, setViewRequest.zoom);
    onSetViewHandled();
  }, [onSetViewHandled, ready, setViewRequest]);

  useEffect(() => {
    if (!ready || !controllerRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      controllerRef.current.invalidateSize();
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [ready, sidebarVisible]);

  return <div id="map" ref={mapRef} />;
};

export default MapView;
