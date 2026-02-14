import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getFeatureBounds } from "@/domain/filterUtils";
import { LeafletController } from "@/features/map/LeafletController";
import { mapActions } from "@/store/slices/mapSlice";
import { selectionActions } from "@/store/slices/selectionSlice";
import { uiActions } from "@/store/slices/uiSlice";
import { logClientError } from "@/utils/errorLogging";

const MapView = ({ features, filteredFeatures }) => {
  const dispatch = useDispatch();
  const overlayVisible = useSelector((state) => state.map.overlayVisible);
  const activeBasemap = useSelector((state) => state.map.activeBasemap);
  const highlightedFeatureId = useSelector((state) => state.selection.highlightedFeatureId);
  const openFeatureRequest = useSelector((state) => state.selection.openFeatureRequest);
  const focusFeatureRequest = useSelector((state) => state.selection.focusFeatureRequest);
  const setViewRequest = useSelector((state) => state.selection.setViewRequest);
  const sidebarVisible = useSelector((state) => state.ui.sidebarVisible);
  const allFeatureBounds = useMemo(() => getFeatureBounds(features), [features]);

  const onMoveEnd = useCallback(
    ({ bounds, center, zoom }) => {
      dispatch(
        mapActions.setMapViewState({
          bounds,
          center: {
            lat: center.lat,
            lng: center.lng
          },
          zoom
        })
      );
    },
    [dispatch]
  );

  const onOverlayChange = useCallback(
    ({ visible }) => {
      dispatch(mapActions.setOverlayVisible(visible));
    },
    [dispatch]
  );

  const onBasemapChange = useCallback(
    ({ id }) => {
      dispatch(mapActions.setActiveBasemap(id));
    },
    [dispatch]
  );

  const onFeatureClick = useCallback(
    ({ featureId }) => {
      dispatch(selectionActions.setSelectedFeatureId(featureId));
      dispatch(selectionActions.setHighlightedFeatureId(featureId));
      dispatch(uiActions.setFeatureModalOpen(true));
    },
    [dispatch]
  );

  const onMapClick = useCallback(() => {
    dispatch(selectionActions.setHighlightedFeatureId(null));
  }, [dispatch]);

  const mapRef = useRef(null);
  const controllerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const handlersRef = useRef({
    onMoveEnd,
    onOverlayChange,
    onBasemapChange,
    onFeatureClick,
    onMapClick
  });

  const lastOpenSeq = useRef(null);
  const lastFocusSeq = useRef(null);
  const lastViewSeq = useRef(null);
  const hasAppliedInitialFit = useRef(false);

  useEffect(() => {
    handlersRef.current = {
      onMoveEnd,
      onOverlayChange,
      onBasemapChange,
      onFeatureClick,
      onMapClick
    };
  }, [onBasemapChange, onFeatureClick, onMapClick, onMoveEnd, onOverlayChange]);

  useEffect(() => {
    let cancelled = false;
    const abortController = new AbortController();
    const controller = new LeafletController();
    controllerRef.current = controller;

    controller
      .init(mapRef.current, { signal: abortController.signal })
      .then(() => {
        if (cancelled || abortController.signal.aborted) {
          controller.destroy();
          return;
        }

        controller.on("moveend", (payload) => handlersRef.current.onMoveEnd(payload));
        controller.on("overlaychange", (payload) => handlersRef.current.onOverlayChange(payload));
        controller.on("basemapchange", (payload) => handlersRef.current.onBasemapChange(payload));
        controller.on("featureclick", (payload) => handlersRef.current.onFeatureClick(payload));
        controller.on("mapclick", (payload) => handlersRef.current.onMapClick(payload));

        setReady(true);
      })
      .catch((error) => {
        if (cancelled || abortController.signal.aborted) {
          return;
        }
        logClientError("map.init", error);
      });

    return () => {
      cancelled = true;
      abortController.abort();
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
    if (!ready || !controllerRef.current || hasAppliedInitialFit.current || !allFeatureBounds) {
      return;
    }

    if (controllerRef.current.fitToBounds(allFeatureBounds)) {
      hasAppliedInitialFit.current = true;
    }
  }, [allFeatureBounds, ready]);

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

    controllerRef.current.setBasemap(activeBasemap);
  }, [activeBasemap, ready]);

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
    dispatch(selectionActions.acknowledgeOpenFeature());
  }, [dispatch, openFeatureRequest, ready]);

  useEffect(() => {
    if (!ready || !controllerRef.current || !focusFeatureRequest) {
      return;
    }

    if (lastFocusSeq.current === focusFeatureRequest.seq) {
      return;
    }

    lastFocusSeq.current = focusFeatureRequest.seq;
    controllerRef.current.focusFeature(focusFeatureRequest.id, focusFeatureRequest.zoom);
    dispatch(selectionActions.acknowledgeFocusFeature());
  }, [dispatch, focusFeatureRequest, ready]);

  useEffect(() => {
    if (!ready || !controllerRef.current || !setViewRequest) {
      return;
    }

    if (lastViewSeq.current === setViewRequest.seq) {
      return;
    }

    lastViewSeq.current = setViewRequest.seq;
    controllerRef.current.setView(setViewRequest.lat, setViewRequest.lng, setViewRequest.zoom);
    dispatch(selectionActions.acknowledgeSetView());
  }, [dispatch, ready, setViewRequest]);

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
