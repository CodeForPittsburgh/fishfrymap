import React, { useEffect, useMemo } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-bootstrap";
import "./App.css";

import TopNav from "@/features/layout/TopNav";
import Sidebar from "@/features/layout/Sidebar";
import MapView from "@/features/map/MapView";
import AboutModal from "@/features/modals/AboutModal";
import FilterModal from "@/features/filters/FilterModal";
import FeatureModal from "@/features/modals/FeatureModal";
import LoadingOverlay from "@/features/layout/LoadingOverlay";
import ModalErrorBoundary from "@/features/modals/ModalErrorBoundary";

import { useGetFishfriesQuery } from "@/store/api/fishfryApi";
import { useSearchPlacesQuery } from "@/store/api/geocodeApi";
import { uiActions } from "@/store/slices/uiSlice";
import { filtersActions } from "@/store/slices/filtersSlice";
import { selectionActions } from "@/store/slices/selectionSlice";

import { computeGoodFriday } from "@/domain/dateUtils";
import { normalizeFeatureCollection, matchesSearch } from "@/domain/featureUtils";
import { featureIsInBounds, filterFeatures } from "@/domain/filterUtils";
import { logClientError } from "@/utils/errorLogging";

const App = () => {
  const dispatch = useDispatch();
  const hasMapboxToken = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);

  const ui = useSelector((state) => state.ui);
  const filters = useSelector((state) => state.filters);
  const mapState = useSelector((state) => state.map);
  const searchQuery = useSelector((state) => state.search.query);
  const selection = useSelector((state) => state.selection);

  const { data, isLoading, isFetching, error } = useGetFishfriesQuery();
  const dataSource = data?.__source || "primary";

  const goodFridayDate = useMemo(() => computeGoodFriday(moment().year()), []);

  const allFeatures = useMemo(() => {
    return normalizeFeatureCollection(data).sort((left, right) => {
      return (left.properties.venue_name || "").localeCompare(right.properties.venue_name || "");
    });
  }, [data]);

  const featuresById = useMemo(() => {
    const map = new Map();
    allFeatures.forEach((feature) => {
      map.set(feature.id, feature);
    });
    return map;
  }, [allFeatures]);

  const filteredFeatures = useMemo(() => {
    return filterFeatures(allFeatures, filters, goodFridayDate);
  }, [allFeatures, filters, goodFridayDate]);

  const visibleFeatures = useMemo(() => {
    if (!mapState.overlayVisible) {
      return [];
    }

    return filteredFeatures.filter((feature) => featureIsInBounds(feature, mapState.bounds));
  }, [filteredFeatures, mapState.bounds, mapState.overlayVisible]);

  const fishSuggestions = useMemo(() => {
    if (searchQuery.trim().length < 3) {
      return [];
    }

    return allFeatures
      .filter((feature) => matchesSearch(feature, searchQuery))
      .slice(0, 10)
      .map((feature) => ({
        source: "FishFrys",
        id: feature.id,
        name: feature.properties.venue_name,
        address: feature.properties.venue_address,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      }));
  }, [allFeatures, searchQuery]);

  const { data: placeSuggestions = [], isFetching: isGeocoding } = useSearchPlacesQuery(searchQuery, {
    skip: searchQuery.trim().length < 3
  });

  const selectedFeature = selection.selectedFeatureId
    ? featuresById.get(selection.selectedFeatureId) || null
    : null;

  useEffect(() => {
    if (document.body.clientWidth <= 767) {
      dispatch(uiActions.setSidebarVisible(false));
    }
  }, [dispatch]);

  useEffect(() => {
    const onWindowError = (event) => {
      const fallbackError = new Error(event.message || "Unhandled window error");
      logClientError("window.error", event.error || fallbackError, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const onUnhandledRejection = (event) => {
      const reason = event.reason;
      const rejectionError =
        reason instanceof Error
          ? reason
          : new Error(typeof reason === "string" ? reason : "Unhandled promise rejection");

      logClientError("window.unhandledrejection", rejectionError, {
        reasonType: typeof reason
      });
    };

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  const mapboxAlertOffsetClass = dataSource === "fallback" ? "fishfry-error--offset-116" : "fishfry-error--offset-64";

  return (
    <>
      <TopNav fishSuggestions={fishSuggestions} placeSuggestions={placeSuggestions} isSearching={isGeocoding} />

      <div id="container" className="app-container">
        <Sidebar features={visibleFeatures} />

        <MapView features={allFeatures} filteredFeatures={filteredFeatures} />
      </div>

      <LoadingOverlay show={isLoading || isFetching} />

      <ModalErrorBoundary name="about" label="About dialog" resetKey={`about-${ui.aboutModalOpen}`}>
        <AboutModal
          show={ui.aboutModalOpen}
          onHide={() => {
            dispatch(uiActions.setAboutModalOpen(false));
          }}
        />
      </ModalErrorBoundary>

      <ModalErrorBoundary name="filter" label="Filter dialog" resetKey={`filter-${ui.filterModalOpen}`}>
        <FilterModal
          show={ui.filterModalOpen}
          onHide={() => {
            dispatch(uiActions.setFilterModalOpen(false));
          }}
          filters={filters}
          onChange={(key, value) => {
            dispatch(filtersActions.setFilter({ key, value }));
          }}
        />
      </ModalErrorBoundary>

      <ModalErrorBoundary
        name="feature"
        label="Feature details dialog"
        resetKey={`feature-${ui.featureModalOpen}-${selection.selectedFeatureId || "none"}`}
      >
        <FeatureModal
          show={ui.featureModalOpen}
          onHide={() => {
            dispatch(uiActions.setFeatureModalOpen(false));
            dispatch(selectionActions.setHighlightedFeatureId(null));
          }}
          feature={selectedFeature}
          goodFridayDate={goodFridayDate}
          currentYear={moment().year()}
        />
      </ModalErrorBoundary>

      {error ? (
        <Alert className="fishfry-error" variant="warning">
          Unable to load data from the primary API and fallback source.
        </Alert>
      ) : null}

      {!error && dataSource === "fallback" ? (
        <Alert className="fishfry-error fishfry-error--offset-64" variant="info">
          Primary API is unreachable; showing fallback data.
        </Alert>
      ) : null}

      {!hasMapboxToken && searchQuery.trim().length >= 3 ? (
        <Alert className={`fishfry-error ${mapboxAlertOffsetClass}`} variant="info">
          Mapbox geocoding is disabled because <code>VITE_MAPBOX_TOKEN</code> is not set.
        </Alert>
      ) : null}
    </>
  );
};

export default App;
